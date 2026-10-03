export const MKG_PHONE = '+13059095773';
import { captureRequestForm } from './crm-capture.js';

export function buildRequestMessage(form) {
  const lines = [`Miami Knife Guy — ${form.dataset.formTitle || 'Service Request'}`];
  for (const control of Array.from(form.elements)) {
    if (!control.name || ['file', 'submit', 'button'].includes(control.type)
      || control.hasAttribute('data-private') || control.disabled) continue;
    if (['checkbox', 'radio'].includes(control.type) && !control.checked) continue;
    const value = String(control.value || '').trim();
    if (!value) continue;
    const readable = control.tagName === 'SELECT'
      ? control.selectedOptions[0]?.textContent?.trim() || value : value;
    const line = `${control.dataset.label || control.name}: ${readable}`;
    if (!lines.includes(line)) lines.push(line);
  }
  return lines.join('\n');
}

export function messageLink(message) {
  return `sms:${MKG_PHONE}?body=${encodeURIComponent(message)}`;
}

function selectedFiles(form) {
  return [...form.querySelectorAll('input[type="file"]')].flatMap(input => [...(input.files || [])]);
}

export function canSharePhotos(navigator, files, message) {
  try {
    return files.length > 0 && typeof navigator.share === 'function'
      && typeof navigator.canShare === 'function'
      && navigator.canShare({ title: 'Miami Knife Guy request', text: message, files });
  } catch { return false; }
}

export function initRequestForms(doc) {
  const win = doc.defaultView;
  const params = new URLSearchParams(win.location.search);
  for (const form of doc.querySelectorAll('[data-mkg-request-form]')) {
    if (form.dataset.requestReady === 'true') continue;
    form.dataset.requestReady = 'true';
    const preview = form.querySelector('[data-request-preview]');
    const messageBox = form.querySelector('[data-request-message]');
    const status = form.querySelector('[data-form-status]');
    const openMessage = form.querySelector('[data-open-message]');
    const shareButton = form.querySelector('[data-share-photos]');
    const fileSummary = form.querySelector('[data-file-summary]');
    let preparedMessage = '';

    if (params.get('intent') === 'club' && form.dataset.clubTitle) {
      form.dataset.formTitle = form.dataset.clubTitle;
      form.closest('section').querySelector('h2').textContent = form.dataset.clubTitle;
      for (const [name, value] of [['source',form.dataset.clubSource],['serviceType',form.dataset.clubServiceType],['serviceInterest','knife_club']]) {
        const control = form.elements.namedItem(name);
        if (control && value) control.value = value;
      }
      if (form.dataset.clubSubmitLabel) form.querySelector('[data-prepare-request]').textContent = form.dataset.clubSubmitLabel;
    }
    if (form.id === 'home-service-request' && params.get('intent') === 'one-time') {
      form.dataset.formTitle = 'One-Time Local Sharpening';
      form.closest('section').querySelector('h2').textContent = 'Request One-Time Sharpening';
      form.elements.namedItem('serviceInterest').value = 'one_time_home';
      form.elements.namedItem('source').value = 'public_book_home_one_time';
    }
    if (form.id === 'restaurant-service-request' && params.get('intent') === 'sharp-after-dark') {
      form.dataset.formTitle = 'Sharp After Dark Request';
      form.closest('section').querySelector('h2').textContent = 'Request Sharp After Dark';
      form.elements.namedItem('programType').value = 'sharp_after_dark';
      form.elements.namedItem('source').value = 'public_book_restaurant_sharp_after_dark';
    }
    if (form.id === 'restaurant-service-request' && params.get('intent') === 'steak-knives') {
      form.dataset.formTitle = 'Steak Knife Service Request';
      form.closest('section').querySelector('h2').textContent = 'Request Steak Knife Service';
      form.elements.namedItem('serviceNeeds').value = 'Steak knife sharpening for the dining room.';
      form.elements.namedItem('source').value = 'public_book_restaurant_steak_knives';
    }
    if (params.get('intent') === 'thinning' && form.id === 'special-request-review') {
      form.elements.namedItem('requestType').value = 'thinning';
    }
    const service = params.get('service');
    const serviceSelect = form.elements.namedItem('requestType');
    if (serviceSelect?.tagName === 'SELECT' && [...serviceSelect.options].some(option => option.value === service)) {
      serviceSelect.value = service;
    }
    const clubFields = ['clubTier', 'clubCadence'].map(name => form.elements.namedItem(name)).filter(Boolean);
    const toggleClubFields = () => {
      const active = form.elements.namedItem('serviceInterest')?.value === 'knife_club';
      for (const field of clubFields) {
        field.closest('label').hidden = !active;
        field.disabled = !active;
        field.required = active;
      }
    };
    if (clubFields.length) { toggleClubFields(); form.elements.namedItem('serviceInterest')?.addEventListener('change', toggleClubFields); }
    const referral = params.get('ref');
    if (referral && referral.length <= 100 && !form.elements.namedItem('referralCode')) {
      const input = doc.createElement('input');
      input.type = 'hidden'; input.name = 'referralCode'; input.dataset.label = 'Referral code'; input.value = referral;
      form.append(input);
    }

    const invalidate = event => {
      event.target.setCustomValidity?.('');
      if (!preparedMessage) return;
      preparedMessage = ''; preview.hidden = true; openMessage.removeAttribute('href');
      delete form.dataset.crmEventId;
      messageBox.value = ''; status.textContent = 'Details changed. Review the updated request before sending.';
    };
    form.addEventListener('input', invalidate);
    form.addEventListener('change', invalidate);
    form.addEventListener('invalid', () => {
      status.textContent = 'Please complete the highlighted field so Sean can respond.';
    }, true);
    form.addEventListener('submit', event => {
      event.preventDefault();
      for (const control of form.querySelectorAll('input[required],textarea[required]')) {
        if (['text','tel'].includes(control.type) || control.tagName === 'TEXTAREA') {
          control.setCustomValidity(control.value.trim() ? '' : 'Please enter a value.');
        }
      }
      if (!form.reportValidity()) return;
      preparedMessage = buildRequestMessage(form);
      messageBox.value = preparedMessage;
      openMessage.href = messageLink(preparedMessage);
      const files = selectedFiles(form);
      const shareable = form.dataset.photoHandoff === 'true' && canSharePhotos(win.navigator, files, preparedMessage);
      shareButton.hidden = !shareable;
      fileSummary.textContent = files.length
        ? `${files.length} photo${files.length === 1 ? '' : 's'} selected. ${shareable ? 'Use “Share message & photos” and choose Messages, then address it to (305) 909-5773.' : 'Attach these photos yourself after opening your text message. Copying the request includes text only.'}`
        : 'No photos selected.';
      fileSummary.hidden = form.dataset.photoHandoff !== 'true' && files.length === 0;
      preview.hidden = false;
      status.textContent = 'Saving your request to MKG… You can review the prepared text below.';
      const submittedMessage = preparedMessage;
      void captureRequestForm(form, win).then(result => {
        if (preparedMessage !== submittedMessage) return;
        status.textContent = result.ok
          ? 'Request saved to MKG. Sean will review it; service is confirmed only after his reply. You may also text him directly.'
          : 'Automatic saving is unavailable. Please send the prepared text to Sean.';
      }).catch(() => {
        if (preparedMessage === submittedMessage) status.textContent = 'Automatic saving is temporarily unavailable. Your request is ready—please send the prepared text to Sean.';
      });
      messageBox.focus();
      preview.scrollIntoView?.({ block: 'nearest', behavior: 'auto' });
      const definitions = {
        'restaurant-service-request': ['restaurant_request_prepared','restaurant'],
        'home-service-request': ['home_request_prepared','home'],
        'special-request-review': ['photo_request_prepared','photo'],
        'mail-in-service-request': ['mail_in_request_prepared','mail_in'],
        'knife-exchange-request': ['knife_exchange_request_prepared','knife_exchange'],
        'knife-skills-request': ['knife_skills_request_prepared','knife_skills_intensive'],
        'corporate-experience-request': ['corporate_experience_request_prepared','corporate_culinary_experience'],
        'contact-request': ['contact_request_prepared','general'],
        'review-submission': ['review_message_prepared','review'],
        'generic-referral-request': ['referral_request_prepared','referral'],
        'coded-referral-request': ['referral_request_prepared','referral'],
      };
      const definition = definitions[form.id];
      if (definition) {
        let trackedService = definition[1];
        if (form.id === 'home-service-request') trackedService = form.elements.namedItem('serviceInterest')?.value === 'knife_club' ? 'knife_club' : 'one_time_home';
        if (form.id === 'restaurant-service-request') trackedService = form.elements.namedItem('programType')?.value === 'sharp_after_dark' ? 'sharp_after_dark' : 'restaurant';
        win.dispatchEvent(new win.CustomEvent('mkg:analytics', {
          detail: { name: definition[0], properties: { placement: 'form', service_type: trackedService, handoff_type: shareable ? 'share' : 'sms' } },
        }));
      }
    });
    openMessage.addEventListener('click', event => {
      if (!preparedMessage) { event.preventDefault(); return; }
      status.textContent = 'Finish sending in your messaging app. If it does not open, copy the request or call (305) 909-5773.';
    });
    form.querySelector('[data-copy-request]').addEventListener('click', async () => {
      if (!preparedMessage) return;
      const message = preparedMessage;
      try {
        if (typeof win.navigator.clipboard?.writeText !== 'function') throw new Error('Clipboard unavailable');
        await win.navigator.clipboard.writeText(message);
        if (message === preparedMessage) status.textContent = 'Request text copied. Paste it into a message to (305) 909-5773. Nothing has been sent yet.';
      } catch {
        if (message !== preparedMessage) return;
        messageBox.focus(); messageBox.select();
        status.textContent = 'Automatic copying was unavailable. Your request text is selected; copy it manually and send it to (305) 909-5773.';
      }
    });
    shareButton.addEventListener('click', async () => {
      if (!preparedMessage || shareButton.disabled) return;
      const files = selectedFiles(form);
      const message = preparedMessage;
      if (!canSharePhotos(win.navigator, files, message)) {
        shareButton.hidden = true;
        status.textContent = 'Photo sharing is unavailable here. Open a text message and attach your photos there.';
        return;
      }
      shareButton.disabled = true;
      try {
        await win.navigator.share({ title: 'Miami Knife Guy request', text: message, files });
        if (message === preparedMessage) status.textContent = 'Handed to your sharing app. Make sure the message is sent to (305) 909-5773; service is confirmed in Sean’s reply.';
      } catch (error) {
        if (message === preparedMessage) status.textContent = error?.name === 'AbortError'
          ? 'Sharing canceled. Your request is still here; you can try again or open a text message.'
          : 'Sharing did not complete. Your request is still here; open a text message and attach your photos there.';
      } finally { shareButton.disabled = false; }
    });
  }
}
