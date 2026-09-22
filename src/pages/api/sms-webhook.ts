import type { APIRoute } from "astro";
import twilio from "twilio";
import {
  customerKey, normalizePhone, requestKey, schedulingServices, sendText,
  type ServiceWindowRequest,
} from "../../lib/scheduling";

export const prerender = false;

const twiml = () => new Response("<?xml version=\"1.0\" encoding=\"UTF-8\"?><Response></Response>", {
  headers: { "Content-Type": "text/xml; charset=utf-8" },
});

export const POST: APIRoute = async ({ request }) => {
  const services = schedulingServices();
  if (!services) return new Response("Not configured", { status: 503 });

  const formData = await request.formData();
  const params = Object.fromEntries([...formData.entries()].map(([key, value]) => [key, String(value)]));
  const signature = request.headers.get("x-twilio-signature") || "";
  const webhookUrl = process.env.TWILIO_WEBHOOK_URL || request.url;
  if (!twilio.validateRequest(services.authToken, signature, webhookUrl, params)) {
    return new Response("Invalid signature", { status: 403 });
  }

  const from = normalizePhone(params.From || "");
  const body = (params.Body || "").trim();
  if (!from || !body) return twiml();

  try {
    if (from === services.ownerPhone) {
      const match = body.match(/^([A-Z0-9]{6})\s+(.+)$/i);
      if (!match) {
        await sendText(from, "Reply with the request ID and window, for example: A1B2C3 9-11 AM");
        return twiml();
      }
      const id = match[1].toUpperCase();
      const proposedWindow = match[2].trim().slice(0, 120);
      const record = await services.redis.get<ServiceWindowRequest>(requestKey(id));
      if (!record) {
        await sendText(from, `I couldn't find active request ${id}. It may have expired.`);
        return twiml();
      }
      if (/^unavailable\b/i.test(proposedWindow)) {
        record.status = "declined";
        await services.redis.set(requestKey(id), record, { ex: 60 * 60 * 24 * 7 });
        await sendText(record.customerPhone, `Miami Knife Guy can't meet the requested window for ${record.requestedDay}. Reply with another preferred day and morning/evening, or call/text Sean at (305) 909-5773.`);
        return twiml();
      }
      record.status = "awaiting_customer";
      record.proposedWindow = proposedWindow;
      await services.redis.set(requestKey(id), record, { ex: 60 * 60 * 24 * 7 });
      await sendText(record.customerPhone, `Miami Knife Guy can offer ${proposedWindow} for your service request. Reply YES to confirm or NO if that window doesn't work. Reply STOP to opt out.`);
      await sendText(from, `${id}: proposed window sent to ${record.name}. I'll text you when they confirm.`);
      return twiml();
    }

    const id = await services.redis.get<string>(customerKey(from));
    if (!id) return twiml();
    const record = await services.redis.get<ServiceWindowRequest>(requestKey(id));
    if (!record || record.status !== "awaiting_customer") return twiml();
    if (/^(yes|y|confirm|confirmed)\b/i.test(body)) {
      record.status = "confirmed";
      await services.redis.set(requestKey(id), record, { ex: 60 * 60 * 24 * 7 });
      await sendText(from, `Confirmed: Miami Knife Guy service window ${record.proposedWindow}. Sean has your request details and will follow up if anything else is needed.`);
      await sendText(services.ownerPhone, `MKG ${id} CONFIRMED by ${record.name}: ${record.proposedWindow}. ${record.customerPhone}`);
    } else if (/^(no|n|decline|different)\b/i.test(body)) {
      record.status = "declined";
      await services.redis.set(requestKey(id), record, { ex: 60 * 60 * 24 * 7 });
      await sendText(from, "No problem. Reply with another preferred day plus morning or evening, or text Sean directly at (305) 909-5773.");
      await sendText(services.ownerPhone, `MKG ${id}: ${record.name} declined ${record.proposedWindow}. Please contact ${record.customerPhone} with another option.`);
    }
  } catch (error) {
    console.error("SMS webhook error", error);
  }
  return twiml();
};
