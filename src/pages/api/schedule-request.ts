import type { APIRoute } from "astro";
import {
  customerKey, newRequestId, normalizePhone, requestKey, schedulingServices, sendText,
  type ServiceWindowRequest,
} from "../../lib/scheduling";

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const input = await request.json() as Partial<ServiceWindowRequest> & { consent?: boolean };
    const customerPhone = normalizePhone(input.customerPhone || "");
    if (!input.name?.trim() || !customerPhone || !input.requestedDay || !["morning", "evening"].includes(input.dayPart || "")) {
      return Response.json({ error: "Name, valid mobile number, requested day, and morning/evening preference are required." }, { status: 400 });
    }
    if (!input.consent) return Response.json({ error: "Text-message consent is required to coordinate a service window." }, { status: 400 });
    const handoff = input.handoff === "pickup" ? "pickup" : "dropoff";
    if (handoff === "pickup" && (!input.address || input.address.trim().length < 8)) {
      return Response.json({ error: "A complete service address is required for pickup and return." }, { status: 400 });
    }

    const services = schedulingServices();
    const fallbackBody = [
      "Miami Knife Guy — service-window request",
      `Name: ${input.name.trim()}`,
      `Phone: ${customerPhone}`,
      `Handoff: ${handoff === "pickup" ? "Pickup and return" : "Shop drop-off"}`,
      input.address ? `Address: ${input.address.trim()}` : "",
      `Preference: ${input.requestedDay}, ${input.dayPart}`,
      input.travelEstimate ? `Travel estimate: ${input.travelEstimate}` : "",
      `Details: ${(input.requestSummary || "Sharpening request").slice(0, 700)}`,
    ].filter(Boolean).join("\n");

    if (!services) return Response.json({
      connected: false,
      fallbackBody,
      message: "Automated scheduling texts are not connected yet. Open a text to send this request directly to Sean.",
    });

    const id = newRequestId();
    const record: ServiceWindowRequest = {
      id,
      name: input.name.trim().slice(0, 100),
      customerPhone,
      address: input.address?.trim().slice(0, 240),
      handoff,
      requestedDay: String(input.requestedDay).slice(0, 80),
      dayPart: input.dayPart as "morning" | "evening",
      requestSummary: String(input.requestSummary || "Sharpening request").slice(0, 1000),
      travelEstimate: input.travelEstimate?.slice(0, 80),
      status: "awaiting_sean",
      createdAt: new Date().toISOString(),
    };
    await services.redis.set(requestKey(id), record, { ex: 60 * 60 * 24 * 7 });
    await services.redis.set(customerKey(customerPhone), id, { ex: 60 * 60 * 24 * 7 });

    const ownerMessage = [
      `MKG ${id} — new service request`,
      `${record.name} · ${record.customerPhone}`,
      `${record.handoff === "pickup" ? `PICKUP · ${record.address}` : "DROP-OFF"}`,
      `${record.requestedDay} · ${record.dayPart.toUpperCase()}`,
      record.travelEstimate ? `Travel: ${record.travelEstimate}` : "",
      record.requestSummary,
      `Reply: ${id} 9-11 AM (use the actual window). Reply ${id} unavailable if needed.`,
    ].filter(Boolean).join("\n");
    await sendText(services.ownerPhone, ownerMessage);
    await sendText(customerPhone, `Miami Knife Guy received your ${record.dayPart} service preference for ${record.requestedDay}. Sean is checking availability. Reply STOP to opt out.`);

    return Response.json({ connected: true, id, message: "Request sent to Sean. You'll receive his proposed service window by text." });
  } catch (error) {
    console.error("Schedule request error", error);
    return Response.json({ error: "The scheduling text could not be sent. Please text Sean directly." }, { status: 502 });
  }
};
