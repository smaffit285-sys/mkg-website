import { getVercelOidcToken } from "@vercel/oidc";

const allowedEventTypes = new Set([
  "form_submission", "booking_request", "chat_turn", "review_submission", "referral_request",
]);

export type CrmEvent = {
  eventId: string;
  eventType: string;
  source: string;
  serviceType?: string;
  sessionId?: string;
  contact?: Record<string, unknown>;
  details?: Record<string, unknown>;
  attribution?: Record<string, unknown>;
  page?: Record<string, unknown>;
};

export function validateCrmEvent(value: unknown): CrmEvent {
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error("Invalid CRM payload.");
  const event = value as Partial<CrmEvent>;
  if (!event.eventId || !/^[a-zA-Z0-9._:-]{8,160}$/.test(event.eventId)) throw new Error("A valid event ID is required.");
  if (!event.eventType || !allowedEventTypes.has(event.eventType)) throw new Error("Unsupported CRM event type.");
  if (!event.source || event.source.length > 120) throw new Error("A valid source is required.");
  return event as CrmEvent;
}

export async function sendCrmEvent(event: CrmEvent) {
  const url = process.env.MKG_CRM_INGEST_URL || import.meta.env.MKG_CRM_INGEST_URL;
  if (!url) return { configured: false, ok: false };
  const token = await getVercelOidcToken();
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify(event),
    signal: AbortSignal.timeout(8000),
  });
  if (!response.ok) throw new Error(`CRM intake returned ${response.status}.`);
  return { configured: true, ok: true, result: await response.json() };
}
