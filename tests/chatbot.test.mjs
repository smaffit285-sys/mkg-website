import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { calculateSharpeningEstimate } from "../src/lib/mkgPricing.ts";
import { fallbackAssistantReply } from "../src/lib/mkgFallback.ts";

test("published knife rates are calculated deterministically", () => {
  const quote = calculateSharpeningEstimate([
    { description: "6-inch chef knife", edgeType: "fine", bladeLengthInches: 6, quantity: 1, repair: "none" },
    { description: "8-inch chef knife", edgeType: "fine", bladeLengthInches: 8, quantity: 2, repair: "minor" },
    { description: "7-inch bread knife", edgeType: "serrated", bladeLengthInches: 7, quantity: 1, repair: "major" },
  ]);
  assert.equal(quote.lines[0].subtotal, 9);
  assert.equal(quote.lines[1].subtotal, 36);
  assert.equal(quote.lines[2].subtotal, 24);
  assert.equal(quote.knownTotal, 69);
  assert.equal(quote.needsReview, false);
});

test("unknown specialty and heavy work are marked for review", () => {
  const quote = calculateSharpeningEstimate([
    { description: "Kitchen shears", edgeType: "specialty", quantity: 1, repair: "none" },
    { description: "Damaged cleaver", edgeType: "fine", bladeLengthInches: 8, quantity: 1, repair: "heavy" },
  ]);
  assert.equal(quote.needsReview, true);
  assert.match(quote.lines[0].note, /requires photo or in-person review/i);
  assert.match(quote.lines[1].note, /starts at \$20/i);
});

test("rendered pages include the accessible assistant and scheduling controls", async () => {
  const html = await readFile(new URL("../dist/client/index.html", import.meta.url), "utf8");
  assert.match(html, /Feeling a little dull today\?/);
  assert.match(html, /aria-controls="mkg-chat-panel"/);
  assert.match(html, /Request a service window/);
  assert.match(html, /Photo assessments and prices are estimates pending Sean/);
  assert.match(html, /<script type="module" src="\/_astro\/chatbot\.[^"]+\.js"><\/script>/);
});

test("local fallback answers core pricing and service questions", () => {
  const price = fallbackAssistantReply([{ role: "user", text: "How much will sharpening cost?" }]);
  assert.match(price, /\$9 minimum/);
  assert.match(price, /\$12 minimum/);
  const thinning = fallbackAssistantReply([{ role: "user", text: "Does my wedging knife need thinning?" }]);
  assert.match(thinning, /\$16 per side/);
  const photos = fallbackAssistantReply([{ role: "user", text: "Take a look", images: [{}] }]);
  assert.match(photos, /received the photos/i);
});
