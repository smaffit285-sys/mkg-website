import { captureRequestForm } from './crm-capture.js';
import { canSharePhotos, messageLink } from './request-form.js';

const MKG_PHONE = '(305) 909-5773';
const MAX_PHOTOS = 4;
const MAX_TOTAL_BYTES = 20 * 1024 * 1024;

function value(form, name) {
  const field = form.elements.namedItem(name);
  return field && 'value' in field ? String(field.value || '').trim() : '';
}
function selected(form, name) {
  if (name === 'customerRole' && form.querySelector('[name="roleGate"][value="home"]')?.checked) return 'home';
  return form.querySelector(`[name="${name}"]:checked`)?.value || '';
}
function photos(form) {
  return [...(form.elements.namedItem('photos')?.files || [])];
}
function labelForRole(role) {
  return role === 'restaurant' ? 'Restaurant or commercial kitchen' : role === 'pro_personal' ? 'Culinary pro · personal knives' : 'Home cook';
}
function buildQuickMessage(form, mode, includePhotos) {
  const role = selected(form, 'customerRole');
  const lines = [
    'Miami Knife Guy — service request',
    `Name: ${value(form, 'name')}`,
    `Phone: ${value(form, 'phone')}`,
    `For: ${labelForRole(role)}`,
  ];
  if (value(form, 'business')) lines.push(`Business: ${value(form, 'business')}`);
  if (mode === 'mail_in') lines.push('Handoff: Mail-in request — awaiting approval');
  else lines.push(`Handoff: ${selected(form, 'handoffPreference') === 'pickup_return' ? 'Pickup and return' : 'NMB drop-off by appointment'}`);
  if (value(form, 'knifeVolumeRange')) lines.push(`Approximate knives: ${form.elements.namedItem('knifeVolumeRange').selectedOptions[0]?.textContent?.trim() || value(form, 'knifeVolumeRange')}`);
  if (selected(form, 'otherEquipment') === 'yes') lines.push(`Other kitchen equipment: ${value(form, 'equipmentDetails') || 'Yes — discuss with Sean'}`);
  if (value(form, 'address')) lines.push(`Pickup address: ${value(form, 'address')}`);
  if (value(form, 'availability')) lines.push(`Availability: ${value(form, 'availability')}`);
  if (form.elements.namedItem('rushRequested')?.checked) lines.push(`Rush requested: ${value(form, 'neededBy') || 'Date to discuss'}`);
  if (value(form, 'offerIntent')) lines.push(`Service interest: ${value(form, 'offerIntent').replaceAll('-', ' ')}`);
  if (value(form, 'requestType')) lines.push(`Specialty: ${value(form, 'requestType').replaceAll('_', ' ')}`);
  if (value(form, 'notes')) lines.push(`Notes: ${value(form, 'notes')}`);
  if (includePhotos) lines.push(`Photos: ${photos(form).length} included`);
  return lines.join('\n');
}

export function initQuickIntakes(doc) {
  const win = doc.defaultView;
  if (!win) return;
  const params = new URLSearchParams(win.location.search);
  for (const shell of doc.querySelectorAll('[data-mkg-quick-intake]')) {
    if (shell.dataset.ready === 'true') continue;
    shell.dataset.ready = 'true';
    const form = shell.querySelector('[data-quick-form]');
    const mode = shell.dataset.mode;
    const steps = [...shell.querySelectorAll('[data-step]')];
    const status = shell.querySelector('[data-status]');
    const sendButton = shell.querySelector('[data-send]');
    const fallbackLink = shell.querySelector('[data-sms-fallback]');
    const progress = [...shell.querySelectorAll('[data-progress]')];
    const roleControls = [...form.querySelectorAll('[name="customerRole"]')];
    const roleGateControls = [...form.querySelectorAll('[name="roleGate"]')];
    const proChoices = shell.querySelector('[data-pro-choices]');
    const businessField = shell.querySelector('[data-business-field]');
    const restaurantDetails = shell.querySelector('[data-restaurant-details]');
    const equipmentDetails = shell.querySelector('[data-equipment-details]');
    const pickupFields = shell.querySelector('[data-pickup-fields]');
    const neededBy = shell.querySelector('[data-needed-by]');
    const photoCount = shell.querySelector('[data-photo-count]');
    const photoInput = form.elements.namedItem('photos');
    let step = 1;

    const intent = (params.get('intent') || '').slice(0,80);
    form.elements.namedItem('offerIntent').value = intent;
    form.elements.namedItem('referralCode').value = (params.get('ref') || '').slice(0,100);
    form.elements.namedItem('requestType').value = (params.get('service') || (intent === 'steak-knives' ? 'steak_knives' : intent === 'thinning' ? 'thinning' : '')).slice(0,80);
    if (mode === 'restaurant' && intent === 'sharp-after-dark') form.elements.namedItem('source').value = 'public_book_restaurant_sharp_after_dark';
    if (mode === 'restaurant' && intent === 'steak-knives') form.elements.namedItem('source').value = 'public_book_restaurant_steak_knives';
    if (mode === 'home' && intent === 'one-time') form.elements.namedItem('source').value = 'public_book_home_one_time';
    if (mode === 'home' && intent === 'club') {
      form.elements.namedItem('source').value = 'public_book_home_club';
      form.elements.namedItem('serviceType').value = 'knife_club';
    }
    if (mode === 'restaurant') {
      form.querySelector('[name="roleGate"][value="pro"]').checked = true;
      form.querySelector('[name="customerRole"][value="restaurant"]').checked = true;
      step = 2;
    }

    function setStatus(message) { status.textContent = message; }
    function updateRole() {
      const gate = selected(form, 'roleGate');
      proChoices.hidden = gate !== 'pro';
      form.querySelector('[data-role-value]').value = gate === 'home' ? 'home' : '';
      const restaurant = selected(form, 'customerRole') === 'restaurant';
      businessField.hidden = !restaurant;
      businessField.querySelector('input').required = restaurant;
      businessField.querySelector('input').disabled = !restaurant;
      restaurantDetails.hidden = !restaurant;
      for (const control of restaurantDetails.querySelectorAll('select,input')) control.disabled = !restaurant;
      if (!restaurant) equipmentDetails.hidden = true;
      if (mode === 'home' || mode === 'restaurant') {
        form.elements.namedItem('serviceType').value = restaurant ? 'restaurant' : mode === 'home' && intent === 'club' ? 'knife_club' : 'home_knives';
        form.elements.namedItem('source').value = restaurant
          ? mode === 'restaurant' && intent === 'sharp-after-dark' ? 'public_book_restaurant_sharp_after_dark' : mode === 'restaurant' && intent === 'steak-knives' ? 'public_book_restaurant_steak_knives' : 'public_book_restaurant'
          : mode === 'home' && intent === 'club' ? 'public_book_home_club' : mode === 'home' && intent === 'one-time' ? 'public_book_home_one_time' : 'public_book_home';
      }
    }
    function updateVolume() {
      const estimates = { '1-10': '5', '11-25': '18', '26-50': '38', '51-plus': '75', unsure: '' };
      form.elements.namedItem('knifeVolume').value = estimates[value(form, 'knifeVolumeRange')] || '';
    }
    function updateEquipment() {
      const visible = selected(form, 'otherEquipment') === 'yes' && selected(form, 'customerRole') === 'restaurant';
      equipmentDetails.hidden = !visible;
      equipmentDetails.querySelector('input').disabled = !visible;
    }
    function updateHandoff() {
      if (!pickupFields) return;
      const pickup = selected(form, 'handoffPreference') === 'pickup_return';
      pickupFields.hidden = !pickup;
      for (const input of pickupFields.querySelectorAll('input')) { input.disabled = !pickup; input.required = pickup; }
    }
    function updateRush() {
      const rush = form.elements.namedItem('rushRequested').checked;
      neededBy.hidden = !rush;
      const date = neededBy.querySelector('input');
      date.disabled = !rush;
      date.required = rush;
    }
    function updatePhotos() {
      const files = photos(form);
      photoCount.textContent = files.length ? `${files.length} photo${files.length === 1 ? '' : 's'} selected` : mode === 'mail_in' ? 'Add at least one photo; up to four total.' : 'Choose up to four photos, or continue without one.';
      const shareable = canSharePhotos(win.navigator, files, 'Miami Knife Guy request');
      sendButton.textContent = shareable ? 'Text Sean with Photos' : files.length ? 'Text Sean · attach photos' : 'Text Sean';
    }
    function showStep(next, focus = false) {
      step = next;
      for (const panel of steps) panel.hidden = Number(panel.dataset.step) !== next;
      for (const item of progress) {
        const n = Number(item.dataset.progress);
        item.classList.toggle('is-active', n === next);
        item.classList.toggle('is-complete', n < next);
      }
      if (focus) steps[next - 1].querySelector('h3')?.focus();
      setStatus('');
    }
    function invalid(message, control) {
      setStatus(message);
      control?.focus();
      return false;
    }
    function validate(n) {
      if (n === 1) {
        if (!selected(form, 'roleGate')) return invalid('Choose home cook or culinary pro.', roleGateControls[0]);
        if (selected(form, 'roleGate') === 'pro' && !selected(form, 'customerRole')) return invalid('Choose personal knives or restaurant service.', roleControls[0]);
      }
      if (n === 2) {
        if (selected(form, 'customerRole') === 'restaurant') {
          if (!value(form, 'knifeVolumeRange')) return invalid('Choose an approximate knife count, or Not sure yet.', form.elements.namedItem('knifeVolumeRange'));
          if (!selected(form, 'otherEquipment')) return invalid('Select Yes or No for other kitchen equipment.', form.querySelector('[name="otherEquipment"]'));
        }
        const files = photos(form);
        if (mode === 'mail_in' && !files.length) return invalid('Add at least one photo so Sean can review a mail-in request.', photoInput);
        if (files.length > MAX_PHOTOS) return invalid('Please choose no more than four photos.', photoInput);
        if (files.some(file => !file.type.startsWith('image/')) || files.reduce((sum,file) => sum + file.size,0) > MAX_TOTAL_BYTES) return invalid('Choose image files totaling under 20 MB.', photoInput);
      }
      if (n === 3) {
        if (!value(form, 'name')) return invalid('Enter your name so Sean knows who to contact.', form.elements.namedItem('name'));
        if (value(form, 'phone').replace(/\D/g,'').length < 10) return invalid('Enter a mobile number with at least 10 digits.', form.elements.namedItem('phone'));
        if (selected(form, 'customerRole') === 'restaurant' && !value(form, 'business')) return invalid('Enter the restaurant or business name.', form.elements.namedItem('business'));
        if (mode !== 'mail_in') {
          if (!selected(form, 'handoffPreference')) return invalid('Choose NMB drop-off or pickup and return.', form.querySelector('[name="handoffPreference"]'));
          if (selected(form, 'handoffPreference') === 'pickup_return') {
            if (!value(form, 'address')) return invalid('Enter the pickup address.', form.elements.namedItem('address'));
            if (!value(form, 'availability')) return invalid('Tell Sean when pickup generally works.', form.elements.namedItem('availability'));
          }
        }
        if (form.elements.namedItem('rushRequested').checked && !value(form, 'neededBy')) return invalid('Choose your needed-by date for a rush request.', form.elements.namedItem('neededBy'));
      }
      return true;
    }

    roleGateControls.forEach(control => control.addEventListener('change', () => {
      if (control.checked) roleControls.forEach(role => { role.checked = false; });
      updateRole(); updateEquipment();
    }));
    roleControls.forEach(control => control.addEventListener('change', () => { updateRole(); updateEquipment(); }));
    form.querySelectorAll('[name="otherEquipment"]').forEach(control => control.addEventListener('change', updateEquipment));
    form.elements.namedItem('knifeVolumeRange').addEventListener('change', updateVolume);
    form.querySelectorAll('[name="handoffPreference"]').forEach(control => control.addEventListener('change', updateHandoff));
    form.elements.namedItem('rushRequested').addEventListener('change', updateRush);
    photoInput.addEventListener('change', updatePhotos);
    form.addEventListener('input', () => { delete form.dataset.crmEventId; });
    shell.querySelectorAll('[data-next]').forEach(button => button.addEventListener('click', () => { if (validate(step)) showStep(step + 1, true); }));
    shell.querySelectorAll('[data-back]').forEach(button => button.addEventListener('click', () => showStep(step - 1, true)));

    form.addEventListener('submit', event => {
      event.preventDefault();
      for (const n of [1, 2, 3]) {
        if (!validate(n)) {
          if (step !== n) { showStep(n, true); validate(n); }
          return;
        }
      }
      const files = photos(form);
      const shareable = canSharePhotos(win.navigator, files, 'Miami Knife Guy request');
      const message = buildQuickMessage(form, mode, shareable);
      let saveStatus = 'Saving your request.';
      let sendStatus = shareable ? `Choose Messages, select Sean at ${MKG_PHONE}, and send the photos.` : 'Opening a text draft.';
      const report = () => setStatus(`${sendStatus} ${saveStatus}`.trim());
      sendButton.disabled = true;
      report();
      const crmPromise = captureRequestForm(form, win).then(result => {
        if (result.ok) {
          win.dispatchEvent(new win.CustomEvent('mkg:analytics', { detail: {
            name: 'service_request_saved',
            properties: { placement: 'form', service_type: mode === 'mail_in' ? 'mail_in' : mode === 'photo' ? 'photo' : selected(form, 'customerRole') === 'restaurant' ? 'restaurant' : value(form, 'serviceType') === 'knife_club' ? 'knife_club' : 'one_time_home' },
          }}));
          saveStatus = 'Details saved for Sean.';
        } else saveStatus = 'Automatic saving is unavailable.';
        report();
      }).catch(() => {
        saveStatus = 'Automatic saving is unavailable.';
        report();
      });
      if (shareable) {
        let sharing;
        try { sharing = win.navigator.share({ title: 'Miami Knife Guy request', text: message, files }); }
        catch { sharing = Promise.reject(new Error('Sharing unavailable')); }
        Promise.resolve(sharing).then(() => {
          sendStatus = `Check that your messaging app sent the photos and request to ${MKG_PHONE}. Sean confirms service in his reply.`;
          report();
        }).catch(error => {
          sendStatus = error?.name === 'AbortError' ? 'Sharing canceled. Tap Text Sean with Photos to try again.' : 'Photo sharing did not open. You can text Sean and attach the photos in Messages.';
          report();
        }).finally(() => { sendButton.disabled = false; });
      } else {
        fallbackLink.href = messageLink(message);
        fallbackLink.click();
        sendStatus = files.length ? `Text draft opened. Attach your photos in Messages and send to ${MKG_PHONE}.` : `Text draft opened. Tap Send to reach ${MKG_PHONE}.`;
        report();
        sendButton.disabled = false;
      }
      void crmPromise;
    });

    updateRole(); updateVolume(); updateEquipment(); updateHandoff(); updateRush(); updatePhotos(); showStep(step);
  }
}
