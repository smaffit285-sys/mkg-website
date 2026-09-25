type PhotoAwareMessage = {
  role?: string;
  text?: string;
  images?: unknown[];
};

export const PHOTO_REVIEW_DISCLAIMER =
  "AI can make mistakes; all photo findings, dimensions, work, and prices are estimates subject to Sean's human review.";

const PROFILE_PHOTO_GUIDANCE =
  "For the profile check, rest the knife edge-down on a known-flat cutting board and photograph it from board height, with the camera level with the edge and light visible behind any gap.";

export function ensurePhotoGuardrails(reply: string, messages: PhotoAwareMessage[]) {
  const latest = [...messages].reverse().find((message) => message.role === "user");
  if (!latest) return reply;

  const concernsPhotos = Boolean(latest.images?.length)
    || /\b(photo|photos|photograph|photographs|picture|pictures|image|images|upload|camera)\b/i.test(latest.text || "");
  if (!concernsPhotos) return reply;

  const additions: string[] = [];
  if (!/board height|camera level with the edge|light visible behind any gap/i.test(reply)) {
    additions.push(PROFILE_PHOTO_GUIDANCE);
  }
  if (!reply.includes(PHOTO_REVIEW_DISCLAIMER)) additions.push(PHOTO_REVIEW_DISCLAIMER);
  return [reply.trim(), ...additions].filter(Boolean).join("\n\n");
}
