export type QuoteItem = {
  description?: string;
  edgeType: "fine" | "serrated" | "thin_single_bevel" | "thick_single_bevel" | "specialty";
  bladeLengthInches?: number;
  quantity: number;
  repair?: "none" | "minor" | "major" | "heavy";
};

const money = (value: number) => `$${value.toFixed(value % 1 === 0 ? 0 : 2)}`;

export function calculateSharpeningEstimate(items: QuoteItem[]) {
  const lines: Array<{ label: string; quantity: number; unitPrice?: number; subtotal?: number; note?: string }> = [];
  let knownTotal = 0;
  let needsReview = false;

  for (const item of items) {
    const quantity = Math.max(1, Math.floor(item.quantity || 1));
    const length = item.bladeLengthInches;
    let unitPrice: number | undefined;
    let note: string | undefined;

    if (item.edgeType === "fine") {
      if (length == null) note = "Blade length needed for an exact published-rate estimate.";
      else unitPrice = length <= 6 ? 9 : length * 1.5;
    } else if (item.edgeType === "serrated") {
      if (length == null) note = "Blade length needed for an exact published-rate estimate.";
      else unitPrice = length <= 6 ? 12 : length * 2;
    } else if (item.edgeType === "thin_single_bevel") {
      if (length == null) note = "Blade length needed for an exact published-rate estimate.";
      else unitPrice = length * 3;
    } else if (item.edgeType === "thick_single_bevel") {
      if (length == null) note = "Blade length needed for an exact published-rate estimate.";
      else unitPrice = length * 5;
    } else {
      note = "Specialty work requires photo or in-person review.";
    }

    if (unitPrice == null) needsReview = true;
    let repairPrice = 0;
    if (item.repair === "minor") repairPrice = 6;
    if (item.repair === "major") repairPrice = 10;
    if (item.repair === "heavy") {
      repairPrice = 20;
      needsReview = true;
      note = [note, "Heavy or specialty repair starts at $20 and needs review."].filter(Boolean).join(" ");
    }

    const subtotal = unitPrice == null ? undefined : (unitPrice + repairPrice) * quantity;
    if (subtotal != null) knownTotal += subtotal;
    lines.push({
      label: item.description || item.edgeType.replaceAll("_", " "),
      quantity,
      unitPrice: unitPrice == null ? undefined : unitPrice + repairPrice,
      subtotal,
      note,
    });
  }

  return {
    lines: lines.map((line) => ({
      ...line,
      unitPriceDisplay: line.unitPrice == null ? undefined : money(line.unitPrice),
      subtotalDisplay: line.subtotal == null ? undefined : money(line.subtotal),
    })),
    knownTotal,
    knownTotalDisplay: money(knownTotal),
    needsReview,
    disclaimer: "Estimate only. Sean confirms condition, scope, travel, and the final price before work begins.",
  };
}

export const publishedPricing = {
  fineEdge: "$9 minimum for knives 6 inches or smaller; $1.50 per inch above 6 inches",
  serrated: "$12 minimum for knives 6 inches or smaller; $2 per inch above 6 inches",
  repairs: "Minor $6; major $10; heavy or specialty from $20+, added to sharpening",
  thinSingleBevel: "$3 per inch",
  thickSingleBevel: "$5 per inch",
  thinning: "From $16 per side; varies with material removed, labor, abrasives, and time",
  whiteGlove: "Condition and scope reviewed before pricing",
  travel: "$1 per total driven mile, rounded up; minimum travel charge confirmed before scheduling",
  restaurantReset: "From $150",
  restaurantRecurring: "Typically from $250 per month",
  club: "Essential Edge $39/month; Chef's Drawer $99/month; Private Kitchen Concierge from $199/month",
} as const;
