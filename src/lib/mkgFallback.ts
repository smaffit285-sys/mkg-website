import { publishedPricing } from "./mkgPricing.ts";

type Message = { role: "user" | "assistant"; text: string; images?: unknown[] };

export function fallbackAssistantReply(messages: Message[]) {
  const last = [...messages].reverse().find((message) => message.role === "user");
  const text = (last?.text || "").toLowerCase();
  const hasPhotos = Boolean(last?.images?.length);

  if (hasPhotos) {
    return "I received the photos. They can help Sean assess visible chips, broken tips, corrosion, and likely thinning or reprofiling—but the final condition and price still need his review. What is the approximate blade length, how many tools are shown, and are any edges serrated?";
  }
  if (/price|cost|quote|estimate|how much/.test(text)) {
    return `I can build an estimate from the published rates. Fine-edge knives are ${publishedPricing.fineEdge}. Serrated knives are ${publishedPricing.serrated}. Repairs are ${publishedPricing.repairs}; thinning is ${publishedPricing.thinning}. How many knives do you have, what are their approximate blade lengths, and are any serrated or damaged?`;
  }
  if (/pickup|delivery|collect|travel|drop.?off/.test(text)) {
    return `Drop-off keeps the service lean. Pickup and return are ${publishedPricing.travel}. Choose pickup in Service Details and enter the complete address; if live routing is unavailable, Sean will confirm the travel amount before scheduling.`;
  }
  if (/thin|wedge|geometry|behind the edge/.test(text)) {
    return `Sharpening restores the apex; thinning removes material behind the edge when a knife still wedges or feels thick after sharpening. Thinning starts at $16 per side and rises with material removed, labor, abrasives, and time. Clear side-profile and choil photos help Sean assess it.`;
  }
  if (/chip|broken tip|repair|crack|bend|bent/.test(text)) {
    return `Minor repairs are $6, major repairs are $10, and heavy or specialty repairs start at $20+, added to sharpening. A crack, serious bend, or structural damage needs an in-person safety review. Upload a close edge photo and a full side-profile photo with a common object for scale.`;
  }
  if (/serrat|bread knife/.test(text)) {
    return `Serrated sharpening starts at $12 for 6 inches or smaller and is $2 per inch above that. Each scallop is treated deliberately; tell me the blade length and whether teeth are chipped or flattened.`;
  }
  if (/single.?bevel|deba|yanagiba|usuba/.test(text)) {
    return `Thin single-bevel work is $3 per inch; thick single-bevel work is $5 per inch. Major repair on a thick single bevel starts at $20+. Photos of both faces, the edge, and the tip help determine the correct path.`;
  }
  if (/japanese|german|premium|expensive|custom|steel/.test(text)) {
    return "MKG prices the work by geometry, finish, condition, and intended use—not merely by a knife’s country of origin. Working Edge is the practical choice for daily tools; Performance Edge adds refinement; White Glove is for premium finish and presentation care. Tell me what knife it is and how you use it.";
  }
  if (/hone|honing|rod|steel/.test(text)) {
    return "Honing can realign or refresh an edge between sharpenings, but it does not replace sharpening once the apex is rounded or damaged. Use light pressure and a suitable rod; aggressive grooved steels can remove more material and leave a rougher edge.";
  }
  if (/how often|frequency|when.*sharpen|dull/.test(text)) {
    return "Sharpen when performance drops—not by a rigid calendar. Steel, cutting board, technique, and workload all matter. Sliding on tomato skin, crushing herbs, or needing extra force are practical signs. A ceramic rod may extend the interval if the edge is not damaged.";
  }
  if (/board|dishwasher|care|rust|store|storage/.test(text)) {
    return "Use wood or quality plastic boards, hand-wash and dry promptly, and store the edge in a guard, block, or secure magnetic rack. Glass, stone, ceramic boards, dishwasher cycles, and loose drawer storage shorten edge life or damage finishes.";
  }
  if (/restaurant|hotel|commercial|fleet|sharp after dark/.test(text)) {
    return `A one-time restaurant reset starts at $150. Recurring commercial programs typically start at $250 per month and scale with fleet size, repair load, timing, and route fit. Sharp After Dark offers 8 PM–1 AM collection and 3 AM–8 AM return windows by confirmed appointment.`;
  }
  if (/club|membership|monthly|concierge/.test(text)) {
    return `Miami Knife Club options are ${publishedPricing.club}. Essential Edge suits smaller active drawers, Chef's Drawer supports a larger rotation, and Private Kitchen Concierge adds higher-touch care and route planning.`;
  }
  if (/choose|best option|which service|recommend/.test(text)) {
    return "For practical daily knives, start with Working Edge. Choose Performance Edge when you want a more refined finish, and White Glove for premium, sentimental, or presentation-sensitive knives. Chips, broken tips, wedging, rust, or specialty tools need a condition review. What are you sharpening and how do you use it?";
  }
  return "I can help with prices, repairs, thinning, serrations, single-bevel knives, specialty tools, care, pickup, restaurant programs, and scheduling. Tell me what you have—or upload clear photos—and I’ll narrow down the best service and likely cost.";
}
