import test from 'node:test';
import assert from 'node:assert/strict';
import { JSDOM } from 'jsdom';
import { crmAttribution, serializeCrmForm } from '../src/scripts/crm-capture.js';

test('CRM form serialization separates contact details and excludes raw photo data', () => {
  const dom = new JSDOM(`<form>
    <input name="source" value="public_book_home"><input name="serviceType" value="home_knives">
    <input name="name" value="Test Customer"><input name="phone" value="3055550100">
    <textarea name="notes">Two chef knives</textarea><input name="photos" type="file">
  </form>`);
  const form = dom.window.document.querySelector('form');
  Object.defineProperty(form.elements.photos, 'files', { value: [new dom.window.File(['binary'], 'knife.jpg', { type: 'image/jpeg' })] });
  const result = serializeCrmForm(form);
  assert.equal(result.contact.name, 'Test Customer');
  assert.equal(result.source, 'public_book_home');
  assert.equal(result.details.notes, 'Two chef knives');
  assert.deepEqual(result.details.photos, [{ name: 'knife.jpg', type: 'image/jpeg', size: 6 }]);
  assert(!JSON.stringify(result).includes('binary'));
});

test('Google campaign and click attribution persist across the website session', () => {
  const first = new JSDOM('', { url: 'https://www.miamiknifeguy.com/book/?utm_source=google&utm_campaign=gbp_booking&gclid=abc123' });
  assert.deepEqual(crmAttribution(first.window), { utm_source: 'google', utm_campaign: 'gbp_booking', gclid: 'abc123' });
  first.reconfigure({ url: 'https://www.miamiknifeguy.com/book/home/' });
  assert.equal(crmAttribution(first.window).utm_campaign, 'gbp_booking');
});
