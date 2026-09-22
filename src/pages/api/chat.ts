import type { APIRoute } from "astro";
import type { ModelMessage } from "ai";
import { mkgAssistant } from "../../lib/mkgAssistant";
import { fallbackAssistantReply } from "../../lib/mkgFallback";

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

    const body = await request.json() as { messages?: IncomingMessage[] };
    const incoming = Array.isArray(body.messages) ? body.messages.slice(-14) : [];
    fallbackMessages = incoming;
    if (!incoming.length) return Response.json({ error: "A message is required." }, { status: 400 });

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
    return Response.json({ reply: result.text || "I couldn't complete that answer. Please try again or text Sean directly." }, {
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
