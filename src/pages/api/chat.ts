import type { APIRoute } from "astro";
import type { ModelMessage } from "ai";
import { mkgAssistant } from "../../lib/mkgAssistant";
import { fallbackAssistantReply } from "../../lib/mkgFallback";
import { sendCrmEvent } from "../../lib/crm";

export const prerender = false;

type IncomingMessage = {
  role: "user" | "assistant";
  text: string;
  images?: Array<{ dataUrl: string; mediaType: string; name?: string }>;
};

const allowedImageTypes = new Set(["image/jpeg", "image/png", "image/webp", "image/heic", "image/heif"]);

export const POST: APIRoute = async ({ request }) => {
  let fallbackMessages: IncomingMessage[] = [];
  try {
    const contentLength = Number(request.headers.get("content-length") || 0);
    if (contentLength > 12_000_000) return Response.json({ error: "Please upload fewer or smaller photos." }, { status: 413 });

    const body = await request.json() as {
      messages?: IncomingMessage[];
      crm?: { eventId?: string; sessionId?: string; attribution?: Record<string, unknown>; page?: Record<string, unknown> };
    };
    const incoming = Array.isArray(body.messages) ? body.messages.slice(-14) : [];
    fallbackMessages = incoming;
    if (!incoming.length) return Response.json({ error: "A message is required." }, { status: 400 });
    if (process.env.MKG_AI_ENABLED !== "true") {
      const reply = fallbackAssistantReply(incoming);
      await saveChatTurn(body.crm, incoming, reply);
      return Response.json({ reply, fallback: true }, {
        headers: { "Cache-Control": "no-store" },
      });
    }

    const messages: ModelMessage[] = incoming.map((message) => {
      const text = String(message.text || "").slice(0, 4000);
      if (message.role === "assistant") return { role: "assistant", content: text };
      const validImages = (message.images || []).slice(0, 4).filter((image) =>
        allowedImageTypes.has(image.mediaType) && image.dataUrl.startsWith(`data:${image.mediaType};base64,`)
      );
      if (!validImages.length) return { role: "user", content: text };
      return {
        role: "user",
        content: [
          { type: "text", text: text || "Please assess these photos for likely sharpening or repair needs." },
          ...validImages.map((image) => ({ type: "file" as const, data: image.dataUrl, mediaType: image.mediaType, filename: image.name })),
        ],
      };
    });

    const result = await mkgAssistant.generate({ messages });
    const reply = result.text || "I couldn't complete that answer. Please try again or text Sean directly.";
    await saveChatTurn(body.crm, incoming, reply);
    return Response.json({ reply }, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    console.error("MKG assistant error", error);
    if (!fallbackMessages.length) return Response.json({ error: "The sharpener is temporarily offline. You can still text Sean directly." }, { status: 503 });
    return Response.json({ reply: fallbackAssistantReply(fallbackMessages), fallback: true }, {
      headers: { "Cache-Control": "no-store" },
    });
  }
};

async function saveChatTurn(
  crm: { eventId?: string; sessionId?: string; attribution?: Record<string, unknown>; page?: Record<string, unknown> } | undefined,
  messages: IncomingMessage[], reply: string,
) {
  const latest = [...messages].reverse().find(message => message.role === "user");
  if (!latest || !crm?.eventId) return;
  try {
    await sendCrmEvent({
      eventId: crm.eventId,
      eventType: "chat_turn",
      source: "website_chatbot",
      serviceType: "assistant",
      sessionId: crm.sessionId,
      details: {
        customerMessage: String(latest.text || "").slice(0, 4000),
        assistantReply: reply.slice(0, 5000),
        photos: (latest.images || []).slice(0, 4).map(image => ({ name: image.name || "photo", type: image.mediaType })),
      },
      attribution: crm.attribution,
      page: crm.page,
    });
  } catch (error) {
    console.error("Chat CRM capture error", error);
  }
}
