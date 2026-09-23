const ATTRIBUTION_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "gclid", "gbraid", "wbraid"];

function randomId(prefix) {
  const id = globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  return `${prefix}:${id}`;
}

export function crmEventId(prefix = "event") { return randomId(prefix); }

export function crmSession(win) {
  try {
    let id = win.sessionStorage.getItem("mkgCrmSession");
    if (!id) { id = randomId("session"); win.sessionStorage.setItem("mkgCrmSession", id); }
    return id;
  } catch { return randomId("session"); }
}

export function crmAttribution(win) {
  const params = new URLSearchParams(win.location.search);
  let saved = {};
  try { saved = JSON.parse(win.sessionStorage.getItem("mkgAttribution") || "{}"); } catch { saved = {}; }
  for (const key of ATTRIBUTION_KEYS) {
    const value = params.get(key);
    if (value) saved[key] = value.slice(0, 300);
  }
  try { win.sessionStorage.setItem("mkgAttribution", JSON.stringify(saved)); } catch { /* best effort */ }
  return saved;
}

function readableValue(control) {
  if (control.type === "file") return [...(control.files || [])].map(file => ({ name: file.name, type: file.type, size: file.size }));
  if (["checkbox", "radio"].includes(control.type)) return control.checked ? (control.value || true) : undefined;
  if (control.tagName === "SELECT") return control.selectedOptions[0]?.textContent?.trim() || control.value;
  return String(control.value || "").trim();
}

export function serializeCrmForm(form) {
  const contactNames = new Set(["name", "phone", "email", "business", "location", "address"]);
  const contact = {}, details = {};
  let honeypot = "";
  for (const control of Array.from(form.elements)) {
    if (!control.name || ["submit", "button"].includes(control.type) || control.disabled) continue;
    const value = readableValue(control);
    if (control.name === "companyWebsite") { honeypot = String(value || ""); continue; }
    if (value === undefined || value === "" || (Array.isArray(value) && !value.length)) continue;
    (contactNames.has(control.name) ? contact : details)[control.name] = value;
  }
  const source = String(details.source || "public_website");
  const serviceType = String(details.serviceType || "general");
  delete details.source; delete details.serviceType;
  return { contact, details, source, serviceType, honeypot };
}

export function eventTypeForForm(form) {
  if (form.id === "review-submission") return "review_submission";
  if (form.id.includes("referral")) return "referral_request";
  return "form_submission";
}

export async function captureRequestForm(form, win) {
  const serialized = serializeCrmForm(form);
  if (!form.dataset.crmEventId) form.dataset.crmEventId = randomId("form");
  const payload = {
    eventId: form.dataset.crmEventId,
    eventType: eventTypeForForm(form),
    source: serialized.source,
    serviceType: serialized.serviceType,
    sessionId: crmSession(win),
    contact: serialized.contact,
    details: serialized.details,
    attribution: crmAttribution(win),
    page: { path: win.location.pathname, title: win.document.title, referrer: win.document.referrer || "" },
    honeypot: serialized.honeypot,
  };
  if (typeof win.fetch !== "function") return { ok: false, unavailable: true };
  const response = await win.fetch("/api/crm-capture", {
    method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload),
  });
  if (!response.ok) throw new Error("Automatic saving is temporarily unavailable.");
  return { ok: true, ...(await response.json()) };
}
