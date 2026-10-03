import { publishedPricing } from "./mkgPricing.ts";

type Message = { role: "user" | "assistant"; text: string; images?: unknown[] };

export function fallbackAssistantReply(messages: Message[]) {
  const last = [...messages].reverse().find((message) => message.role === "user");
  const text = (last?.text || "").toLowerCase();
  const hasPhotos = Boolean(last?.images?.length);

  if (hasPhotos) {
    return "The photos reached this chat, but automated visual assessment is unavailable. They are not automatically sent to Sean as image files. Please text the photos to (305) 909-5773 or use /send-photos/ so he can inspect them. Include a ruler beside each blade and a close view of damage. Any estimate needs his human review.";
  }
  if (/knife exchange|exchange program/.test(text)) {
    return "The Knife Exchange Program is listed at $99 with shipping included. Trade dull knives for sharp refurbished ones after Sean confirms eligibility and the handoff. Start at /book/knife-exchange/.";
  }
  if (/knife skills|intensive|workshop/.test(text)) {
    return "The Knife Skills Intensive is $399 for four weeks of weekly two-hour sessions with sharpening instruction. Sean confirms the next available schedule at /book/knife-skills/.";
  }
  if (/corporate culinary|team event|corporate experience/.test(text)) {
    return "The Corporate Culinary Experience is a half-day event for up to 15 participants, with a sharpening demonstration and meal. It starts at $1,200; Sean confirms scope and availability at /book/corporate-experience/.";
  }
  if (/online course|knife care course/.test(text)) {
    return "The Miami Knife Club online knife care course is planned and is not a current membership benefit. Ask Sean for care guidance between service visits.";
  }
  if (/mail.?in|\bship(?:ping|ped|ment)?\b|package|packing|ceramic|mandolin|\bsaws?\b|drill bit|peeler|zester/.test(text)) {
    return "Do not ship yet. Mail-in service starts with an online quote at /book/mail-in/. MKG reviews almost anything with a blade, but not ceramic knives, saws, drill bits, peelers, or zesters; mandolin blades must be removable. Customers pay current inbound and return shipping. Standard turnaround is three business days from arrival to departure, subject to final inspection, quote approval, payment details, and unusual work. The private address is provided only after the quote is complete and you are filling out the shipping intake. For approved shipments, clean and dry every knife, guard every edge and point, immobilize the protected knives in a sturdy box, and use tracking.";
  }
  if (/restaurant|hotel|commercial|fleet|sharp after dark/.test(text)) {
    return `A one-time restaurant reset starts at $150. Recurring commercial programs typically start at $250 per month and scale with fleet size, repair load, timing, and route fit. For confirmed accounts within agreed areas and schedules, Sharp After Dark collects after the last ticket and returns before prep the next day.`;
  }
  if (/club|membership|monthly|concierge/.test(text)) {
    return `Miami Knife Club options are ${publishedPricing.club}. Essential Edge suits smaller active drawers, Chef's Drawer supports a larger rotation, and Private Kitchen Concierge adds higher-touch care and route planning.`;
  }
  if (/price|cost|quote|estimate|how much/.test(text)) {
    return `I can build an estimate from the published rates. Fine-edge knives are ${publishedPricing.fineEdge}. Serrated knives are ${publishedPricing.serrated}. Repairs are ${publishedPricing.repairs}; thinning is ${publishedPricing.thinning}. You can also tap the + button to upload up to four photos for a preliminary AI assessment. Include each full knife beside a ruler in the same plane, close-ups of the edge and tip, and an edge-down view on a known-flat board. AI can make mistakes; all visible findings, dimensions, work, and prices are estimates subject to Sean's human review. How many knives do you have, and are any serrated?`;
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
  if (/choose|best option|which service|recommend/.test(text)) {
    return "For practical daily knives, start with Working Edge. Choose Performance Edge when you want a more refined finish, and White Glove for premium, sentimental, or presentation-sensitive knives. Chips, broken tips, wedging, rust, or specialty tools need a condition review. What are you sharpening and how do you use it?";
  }
  return "I don’t have a verified MKG answer for that yet, so I need Sean to review it rather than guess. The question is saved in the chat record for owner review, but I do not have your contact details here. Please text Sean at (305) 909-5773 or submit a service request if you want a direct reply.";
}
