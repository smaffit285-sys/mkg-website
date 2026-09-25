import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { JSDOM } from 'jsdom';
import { initRequestForms, buildRequestMessage, canSharePhotos } from '../src/scripts/request-form.js';

function page(route='book/home/', search='') {
  const html=readFileSync(`.vercel/output/static/${route}index.html`,'utf8');
  const dom=new JSDOM(html,{url:`https://www.miamiknifeguy.com/${route}${search}`});
  const doc=dom.window.document;
  initRequestForms(doc);
  const form=doc.querySelector('[data-mkg-request-form]');
  return {dom,doc,form,win:dom.window};
}
function fill(form,values={}) {
  const defaults={name:'Test Customer',phone:'3055550100',location:'North Miami Beach',business:'Test Kitchen',notes:'Wedges in carrots',requestType:'thinning',platform:'private',feedback:'Test feedback',referrer:'Test referrer',serviceInterest:'one_time_home'};
  for(const control of form.querySelectorAll('[required]')) {
    control.value=values[control.name] ?? defaults[control.name] ?? 'Test';
  }
}
const settle=()=>new Promise(resolve=>setImmediate(resolve));

test('knife count starts at 12 and the complete catalogue is available on every intake',()=>{
  assert.equal(page().form.elements.knifeCount.value,'12');
  const expected=['Knife sharpening','Kitchen shears','Food processor blades','Mandolins','Machetes','Axes / hatchets','Wood planers','Carving tools','Medical tools','Hair shears','Fabric shears','Thinning or reprofiling','Custom creations','Other request / help me choose'];
  for(const route of ['book/home/','book/restaurant/','book/mail-in/','send-photos/']) {
    const {form}=page(route);
    const labels=[...form.elements.requestType.options].map(option=>option.textContent.trim());
    for(const label of expected) assert(labels.includes(label),`${route}: ${label}`);
  }
});

test('service discovery links preselect valid tools and ignore unknown query values',()=>{
  const services=new JSDOM(readFileSync('.vercel/output/static/services/index.html','utf8'));
  for(const link of services.window.document.querySelectorAll('.specialty-service-list a')) {
    const url=new URL(link.getAttribute('href'),'https://www.miamiknifeguy.com');
    const {form}=page('send-photos/',url.search);
    assert.equal(form.elements.requestType.value,url.searchParams.get('service'));
    assert.match(buildRequestMessage(form),new RegExp(form.elements.requestType.selectedOptions[0].textContent.trim().replace(/[.*+?^${}()|[\]\\]/g,'\\$&')));
  }
  assert.equal(page('send-photos/','?service=unknown').form.elements.requestType.value,'');
  assert.equal(page('book/home/','?service=unknown').form.elements.requestType.value,'knife_sharpening');
});

test('home request prepares a readable SMS without sending or exposing internal metadata',()=>{
  const {win,doc,form}=page();
  fill(form); form.elements.knifeDetails.value='Chipped tip & 8-inch knife';
  const events=[]; win.addEventListener('mkg:analytics',event=>events.push(event.detail));
  form.requestSubmit();
  assert.equal(doc.querySelector('[data-request-preview]').hidden,false);
  const text=doc.querySelector('[data-request-message]').value;
  assert.match(text,/Service interest: One-time home service/);
  assert.match(text,/Chipped tip & 8-inch knife/);
  assert(!text.includes('public_book_home'));
  assert(!text.includes('home_knives'));
  assert.equal(decodeURIComponent(doc.querySelector('[data-open-message]').getAttribute('href').split('?body=')[1]),text);
  assert.equal(win.location.pathname,'/book/home/');
  assert.match(doc.querySelector('[data-form-status]').textContent,/Nothing has been sent/);
  assert(!JSON.stringify(events).includes('Test Customer'));
});

test('required fields, whitespace, and non-positive knife counts block preparation',()=>{
  const {doc,form}=page();
  form.requestSubmit();
  assert(doc.querySelector('[data-request-preview]').hidden);
  fill(form); form.elements.name.value='   '; form.requestSubmit();
  assert(doc.querySelector('[data-request-preview]').hidden);
  form.elements.name.value='Test'; form.elements.name.setCustomValidity('');
  for(const count of ['-1','0','1.5']) {
    form.elements.knifeCount.value=count; form.requestSubmit();
    assert(doc.querySelector('[data-request-preview]').hidden,count);
  }
  form.elements.knifeCount.value='2'; form.requestSubmit();
  assert.equal(doc.querySelector('[data-request-preview]').hidden,false);
});

test('edited details invalidate an old prepared message',()=>{
  const {win,doc,form}=page(); fill(form); form.requestSubmit();
  form.elements.name.value='Updated Customer';
  form.elements.name.dispatchEvent(new win.Event('input',{bubbles:true}));
  assert(doc.querySelector('[data-request-preview]').hidden);
  assert.equal(doc.querySelector('[data-open-message]').getAttribute('href'),null);
  form.requestSubmit();
  assert.match(doc.querySelector('[data-request-message]').value,/Updated Customer/);
});

test('copy failure selects the request and never claims clipboard success',async()=>{
  const {win,doc,form}=page(); fill(form);
  Object.defineProperty(win.navigator,'clipboard',{value:{writeText:async()=>{throw new Error('Denied')}}});
  form.requestSubmit(); doc.querySelector('[data-copy-request]').click(); await settle();
  assert.match(doc.querySelector('[data-form-status]').textContent,/copy it manually/);
  assert(!doc.querySelector('[data-form-status]').textContent.includes('Request text copied'));
  const box=doc.querySelector('[data-request-message]');
  assert.equal(box.selectionEnd,box.value.length);
});

test('copy succeeds only after the clipboard confirms',async()=>{
  const {win,doc,form}=page(); fill(form); let copied='';
  Object.defineProperty(win.navigator,'clipboard',{value:{writeText:async text=>{copied=text}}});
  form.requestSubmit(); doc.querySelector('[data-copy-request]').click(); await settle();
  assert.equal(copied,doc.querySelector('[data-request-message]').value);
  assert.match(doc.querySelector('[data-form-status]').textContent,/Request text copied/);
});

test('club and thinning links select the matching request and preserve referral context',()=>{
  const club=page('book/home/','?intent=club&ref=SEAN-123');
  assert.equal(club.form.elements.serviceInterest.value,'knife_club');
  assert.equal(club.doc.querySelector('section.request-section h2').textContent,'Join Miami Knife Club');
  assert.match(buildRequestMessage(club.form),/Referral code: SEAN-123/);
  assert(!buildRequestMessage(club.form).includes('public_book_home_club'));
  const photo=page('send-photos/','?intent=thinning');
  assert.equal(photo.form.elements.requestType.value,'thinning');
});

test('multiple-photo sharing passes every selected file; cancellation keeps request available',async()=>{
  const {win,doc,form}=page('send-photos/'); fill(form);
  const files=[new win.File(['a'],'front.jpg',{type:'image/jpeg'}),new win.File(['b'],'back.jpg',{type:'image/jpeg'})];
  assert(form.elements.photos.multiple);
  Object.defineProperty(form.elements.photos,'files',{value:files});
  let payload;
  win.navigator.canShare=()=>true;
  win.navigator.share=async data=>{payload=data;throw new win.DOMException('Canceled','AbortError')};
  form.requestSubmit();
  assert.equal(doc.querySelector('[data-share-photos]').hidden,false);
  doc.querySelector('[data-share-photos]').click(); await settle();
  assert.equal(payload.files.length,2);
  assert.equal(doc.querySelector('[data-share-photos]').disabled,false);
  assert.equal(doc.querySelector('[data-request-preview]').hidden,false);
  assert.match(doc.querySelector('[data-form-status]').textContent,/Sharing canceled/);
});

test('unsupported or throwing file-share capability leaves text fallback available',()=>{
  const {win,doc,form}=page('send-photos/'); fill(form);
  Object.defineProperty(form.elements.photos,'files',{value:[new win.File(['a'],'front.jpg')]});
  win.navigator.share=async()=>{};
  win.navigator.canShare=()=>{throw new Error('Unsupported')};
  assert.equal(canSharePhotos(win.navigator,[{}],'test'),false);
  form.requestSubmit();
  assert(doc.querySelector('[data-share-photos]').hidden);
  assert.match(doc.querySelector('[data-file-summary]').textContent,/Attach these photos yourself/);
  assert(doc.querySelector('[data-open-message]').hasAttribute('href'));
});

test('restaurant, feedback, and referral forms retain their required fields and readable selections',()=>{
  for(const route of ['book/restaurant/','review/','r/']) {
    const {doc,form}=page(route); fill(form,{serviceInterest:'home'}); form.requestSubmit();
    assert.equal(doc.querySelector('[data-request-preview]').hidden,false,route);
    assert.match(doc.querySelector('[data-request-message]').value,/Your name: Test Customer/);
  }
});

test('service chooser preserves referral context on every service path',()=>{
  const html=readFileSync('.vercel/output/static/book/index.html','utf8');
  const dom=new JSDOM(html,{url:'https://www.miamiknifeguy.com/book/?ref=REF-123',runScripts:'outside-only'});
  dom.window.matchMedia=()=>({addEventListener(){}});
  dom.window.eval(readFileSync('src/scripts/interactions.js','utf8'));
  const choices=[...dom.window.document.querySelectorAll('.booking-choice')];
  assert.equal(choices.length,4);
  for(const choice of choices) assert.equal(new URL(choice.href).searchParams.get('ref'),'REF-123');
  dom.window.close();
});

test('navigation menu announces its state and Escape returns focus',()=>{
  const html=readFileSync('.vercel/output/static/book/index.html','utf8');
  const dom=new JSDOM(html,{url:'https://www.miamiknifeguy.com/book/',runScripts:'outside-only'});
  dom.window.matchMedia=()=>({addEventListener(){}});
  dom.window.eval(readFileSync('src/scripts/interactions.js','utf8'));
  const doc=dom.window.document, button=doc.getElementById('mkg-hamburger');
  button.click();
  assert.equal(button.getAttribute('aria-expanded'),'true');
  assert.equal(button.getAttribute('aria-label'),'Close navigation menu');
  doc.dispatchEvent(new dom.window.KeyboardEvent('keydown',{key:'Escape',bubbles:true}));
  assert.equal(button.getAttribute('aria-expanded'),'false');
  assert.equal(doc.activeElement,button);
  dom.window.close();
});

test('visible standalone pages expose their content and links to assistive technology',()=>{
  for (const route of ['reviews','proof','about']) {
    const dom=new JSDOM(readFileSync(`.vercel/output/static/${route}/index.html`,'utf8'));
    const panel=dom.window.document.querySelector('.panel');
    assert.notEqual(panel.getAttribute('aria-hidden'),'true',route);
    for(const link of panel.querySelectorAll('a[href]')) assert.equal(link.closest('[aria-hidden="true"]'),null,route);
    dom.window.close();
  }
});

test('coded referral routes preserve attribution through header and footer booking links',()=>{
  const html=readFileSync('.vercel/output/static/r/index.html','utf8');
  const dom=new JSDOM(html,{url:'https://www.miamiknifeguy.com/r/FRIEND-123/',runScripts:'outside-only'});
  dom.window.matchMedia=()=>({addEventListener(){}});
  dom.window.eval(readFileSync('src/scripts/interactions.js','utf8'));
  for(const link of dom.window.document.querySelectorAll('a[href^="/book/"]')) assert.equal(new URL(link.href).searchParams.get('ref'),'FRIEND-123');
  dom.window.close();
});
