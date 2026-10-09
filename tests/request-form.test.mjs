import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { JSDOM } from 'jsdom';
import { initRequestForms } from '../src/scripts/request-form.js';
import { initQuickIntakes } from '../src/scripts/quick-intake.js';

function quickPage(route = 'book/home/', search = '') {
  const html = readFileSync(`.vercel/output/static/${route}index.html`, 'utf8');
  const dom = new JSDOM(html, { url: `https://www.miamiknifeguy.com/${route}${search}` });
  const { document: doc } = dom.window;
  initQuickIntakes(doc);
  const form = doc.querySelector('[data-quick-form]');
  return { dom, win: dom.window, doc, form, shell: doc.querySelector('[data-mkg-quick-intake]') };
}
function classicPage(route) {
  const html = readFileSync(`.vercel/output/static/${route}index.html`, 'utf8');
  const dom = new JSDOM(html, { url: `https://www.miamiknifeguy.com/${route}` });
  initRequestForms(dom.window.document);
  return { dom, doc: dom.window.document, form: dom.window.document.querySelector('[data-mkg-request-form]') };
}
function choose(win, form, name, chosen) {
  const control = form.querySelector(`[name="${name}"][value="${chosen}"]`);
  assert(control, `missing ${name}=${chosen}`);
  control.checked = true;
  control.dispatchEvent(new win.Event('change', { bubbles: true }));
}
function next(shell, step) {
  shell.querySelector(`[data-step="${step}"] [data-next]`).click();
}
function setPhotos(win, form, files) {
  const input = form.elements.namedItem('photos');
  Object.defineProperty(input, 'files', { configurable: true, value: files });
  input.dispatchEvent(new win.Event('change', { bubbles: true }));
}
const settle = () => new Promise(resolve => setImmediate(resolve));

test('home cook starts with two choices and can request service with only a name, phone and handoff', async () => {
  const { win, form, shell } = quickPage();
  assert.equal(form.querySelectorAll('[name="roleGate"]').length, 2);
  assert.equal(shell.querySelector('[data-pro-choices]').hidden, true);
  choose(win, form, 'roleGate', 'home');
  next(shell, 1);
  assert.equal(shell.querySelector('[data-step="2"]').hidden, false);
  next(shell, 2);
  assert.equal(shell.querySelector('[data-step="3"]').hidden, false);
  form.elements.namedItem('name').value = 'Test Customer';
  form.elements.namedItem('phone').value = '3055550100';
  choose(win, form, 'handoffPreference', 'shop_dropoff');
  let saved;
  win.fetch = async (url, options) => { saved = JSON.parse(options.body); return { ok: true, json: async () => ({ ok: true }) }; };
  const fallback = shell.querySelector('[data-sms-fallback]');
  let opened = '';
  fallback.click = () => { opened = fallback.href; };
  form.dispatchEvent(new win.Event('submit', { bubbles: true, cancelable: true }));
  await settle();
  assert.match(opened, /^sms:\+13059095773/);
  assert.equal(saved.contact.name, 'Test Customer');
  assert.equal(saved.contact.phone, '3055550100');
  assert.equal(saved.details.customerRole, 'home');
  assert.equal(saved.details.handoffPreference, 'shop_dropoff');
  assert.equal(saved.details.knifeVolume, undefined);
});

test('culinary pro branches to personal or restaurant; restaurant fields appear only when applicable', () => {
  const { win, form, shell } = quickPage();
  choose(win, form, 'roleGate', 'pro');
  assert.equal(shell.querySelector('[data-pro-choices]').hidden, false);
  next(shell, 1);
  assert.match(shell.querySelector('[data-status]').textContent, /personal knives or restaurant/);
  choose(win, form, 'customerRole', 'pro_personal');
  next(shell, 1);
  assert.equal(shell.querySelector('[data-restaurant-details]').hidden, true);
  shell.querySelector('[data-step="2"] [data-back]').click();
  choose(win, form, 'customerRole', 'restaurant');
  next(shell, 1);
  assert.equal(shell.querySelector('[data-restaurant-details]').hidden, false);
  form.elements.namedItem('knifeVolumeRange').value = '11-25';
  form.elements.namedItem('knifeVolumeRange').dispatchEvent(new win.Event('change', { bubbles: true }));
  choose(win, form, 'otherEquipment', 'yes');
  assert.equal(shell.querySelector('[data-equipment-details]').hidden, false);
  next(shell, 2);
  assert.equal(shell.querySelector('[data-business-field]').hidden, false);
  assert.equal(form.elements.namedItem('business').required, true);
  choose(win, form, 'handoffPreference', 'pickup_return');
  assert.equal(shell.querySelector('[data-pickup-fields]').hidden, false);
  assert.equal(form.elements.namedItem('address').required, true);
  assert.equal(form.elements.namedItem('knifeVolume').value, '18');
  assert(form.elements.namedItem('rushRequested'));
  assert.equal(form.elements.namedItem('neededBy'), null);
});

test('restaurant entry skips the role question but lets the customer go back', () => {
  const { form, shell } = quickPage('book/restaurant/', '?intent=sharp-after-dark&ref=SEAN-123');
  assert.equal(shell.querySelector('[data-step="2"]').hidden, false);
  assert.equal(form.querySelector('[name="customerRole"][value="restaurant"]').checked, true);
  assert.equal(form.elements.namedItem('source').value, 'public_book_restaurant_sharp_after_dark');
  assert.equal(form.elements.namedItem('referralCode').value, 'SEAN-123');
  shell.querySelector('[data-step="2"] [data-back]').click();
  assert.equal(shell.querySelector('[data-step="1"]').hidden, false);
});

test('mail-in requires a photo, omits local handoff, and shares the photos with the request text', async () => {
  const { win, form, shell } = quickPage('book/mail-in/');
  choose(win, form, 'roleGate', 'home');
  next(shell, 1);
  next(shell, 2);
  assert.match(shell.querySelector('[data-status]').textContent, /at least one photo/);
  const files = [new win.File(['front'], 'front.jpg', { type: 'image/jpeg' })];
  setPhotos(win, form, files);
  next(shell, 2);
  assert.equal(shell.querySelector('[data-step="3"]').hidden, false);
  assert.equal(form.querySelector('[name="handoffPreference"]').value, 'mail_in');
  form.elements.namedItem('name').value = 'Mail Customer';
  form.elements.namedItem('phone').value = '3055550100';
  win.navigator.canShare = () => true;
  let shared;
  win.navigator.share = async payload => { shared = payload; };
  win.fetch = async () => ({ ok: true, json: async () => ({ ok: true }) });
  form.dispatchEvent(new win.Event('submit', { bubbles: true, cancelable: true }));
  await settle();
  assert.equal(shared.files.length, 1);
  assert.match(shared.text, /Mail-in request/);
  assert.match(shell.querySelector('[data-status]').textContent, /Check that your messaging app sent/);
});

test('unsupported photo sharing offers a prepared text and asks the customer to attach photos', async () => {
  const { win, form, shell } = quickPage('send-photos/');
  choose(win, form, 'roleGate', 'home');
  next(shell, 1);
  setPhotos(win, form, [new win.File(['front'], 'front.jpg', { type: 'image/jpeg' })]);
  next(shell, 2);
  form.elements.namedItem('name').value = 'Photo Customer';
  form.elements.namedItem('phone').value = '3055550100';
  choose(win, form, 'handoffPreference', 'shop_dropoff');
  win.fetch = async () => ({ ok: true, json: async () => ({ ok: true }) });
  const fallback = shell.querySelector('[data-sms-fallback]');
  let opened = '';
  fallback.click = () => { opened = fallback.href; };
  form.dispatchEvent(new win.Event('submit', { bubbles: true, cancelable: true }));
  await settle();
  assert.match(opened, /^sms:\+13059095773/);
  assert.match(shell.querySelector('[data-status]').textContent, /Attach your photos/);
});

test('service chooser preserves referral context on every service path',()=>{
  const html=readFileSync('.vercel/output/static/book/index.html','utf8');
  const dom=new JSDOM(html,{url:'https://www.miamiknifeguy.com/book/?ref=REF-123',runScripts:'outside-only'});
  dom.window.matchMedia=()=>({addEventListener(){}});
  dom.window.eval(readFileSync('src/scripts/interactions.js','utf8'));
  const choices=[...dom.window.document.querySelectorAll('.booking-choice')];
  assert.equal(choices.length,9);
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


test('offer links preserve intent while keeping the short form', () => {
  const club = quickPage('book/home/', '?intent=club');
  assert.equal(club.form.elements.namedItem('offerIntent').value, 'club');
  assert.equal(club.form.elements.namedItem('serviceType').value, 'knife_club');
  const oneTime = quickPage('book/home/', '?intent=one-time');
  assert.equal(oneTime.form.elements.namedItem('source').value, 'public_book_home_one_time');
  const steak = quickPage('book/restaurant/', '?intent=steak-knives');
  assert.equal(steak.form.elements.namedItem('requestType').value, 'steak_knives');
});

test('general contact questions use a CRM-backed request form',()=>{
  const {form}=classicPage('contact/');
  assert.equal(form.id,'contact-request');
  assert.equal(form.elements.source.value,'public_contact');
  assert.equal(form.elements.question.required,true);
});
