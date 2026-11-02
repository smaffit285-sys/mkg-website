import examples from "../data/workExamples.json";
import { publicCase } from "./publicCase.mjs";
export async function getWorkExamples() {
  const local = examples.map(publicCase);
  // Server-to-server only. No Firestore client credentials or private records reach the website.
  const feedUrl = import.meta.env.MKG_PUBLIC_PROOF_FEED_URL || process.env.MKG_PUBLIC_PROOF_FEED_URL;
  if (!feedUrl) return local;
  const endpoint = new URL(feedUrl);
  if (endpoint.protocol !== "https:" || endpoint.username || endpoint.password) throw new Error("Proof feed must be an HTTPS URL without credentials.");
  const response = await fetch(endpoint, { signal: AbortSignal.timeout(6000), redirect: "error" });
  if (!response.ok) throw new Error(`Proof feed returned ${response.status}`);
  const payload = await response.json();
  if (payload.version !== 1 || !Array.isArray(payload.cases) || payload.cases.length > 100) throw new Error("Invalid proof feed.");
  const combined = new Map(local.map(item => [item.slug, item]));
  for (const record of payload.cases) { const item = publicCase(record); combined.set(item.slug, item); }
  return [...combined.values()];
}
