import type { APIRoute } from "astro";
import { sendCrmEvent, validateCrmEvent } from "../../lib/crm";

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const length = Number(request.headers.get("content-length") || 0);
    if (length > 80_000) return Response.json({ error: "Request is too large." }, { status: 413 });
    const body = await request.json();
    if (body?.honeypot) return Response.json({ saved: true }, { status: 202 });
    const event = validateCrmEvent(body);
    const result = await sendCrmEvent(event);
    if (!result.configured) return Response.json({ error: "CRM intake is not configured." }, { status: 503 });
    return Response.json({ saved: true, duplicate: Boolean(result.result?.duplicate) });
  } catch (error) {
    console.error("CRM capture error", error);
    const message = error instanceof Error && error.message.startsWith("CRM intake returned")
      ? "CRM intake is temporarily unavailable." : "Invalid CRM request.";
    return Response.json({ error: message }, { status: message.startsWith("Invalid") ? 400 : 502 });
  }
};
