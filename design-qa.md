# Design QA — Persistent Assistant Placement

## Evidence

- Source visual truth: `C:\Users\Miami\AppData\Local\Temp\codex-clipboard-b333aa10-8581-40c6-a612-b3b86fbfcd1f.png`
- Implementation: `http://127.0.0.1:4321/`
- Implementation screenshot: Codex in-app browser capture from this QA run (desktop closed state, desktop open state, scrolled desktop state, mobile closed state, and mobile open state; browser-runtime artifact rather than a filesystem-backed file)
- Comparison view: `http://127.0.0.1:4321/qa-comparison-chatbot-position.html` during QA
- Desktop viewport and pixels: 1548 × 745 CSS px at device scale 1; source and implementation compared at the same 1548 × 745 dimensions, then displayed side by side at the same 0.488 scale.
- Mobile viewport and pixels: 390 × 844 CSS px at device scale 1.
- State: homepage, assistant closed for placement comparison; open panel checked separately.

## Findings

- No remaining P0, P1, or P2 findings.
- Desktop placement matches the user-marked upper-right negative space without covering the headline, CTA, skyline focal point, navigation, or the browser edge.
- The open panel stays inside the viewport: top 88.29 px, right 1517.93 px, bottom 727.09 px in a 1548 × 745 viewport.
- The launcher remains at the same elevated viewport position after scrolling from the hero to the final call-to-action/footer area.
- At mobile width, the launcher remains bottom-right and the open panel fills the viewport with an 8 px safe inset.
- P3 follow-up only: the horizontally scrollable quick-question chips expose a native scrollbar in some viewport states. This behavior predates the positioning change and does not block use.

## Required Fidelity Surfaces

- Fonts and typography: unchanged from the existing site; launcher label weight, tracking, size, and neon hierarchy remain faithful.
- Spacing and layout rhythm: launcher now occupies the requested hero negative space on desktop; right inset matches the existing page edge rhythm. Tablet and mobile retain the established lower-right placement.
- Colors and visual tokens: existing cyan/pink borders, glow, translucency, and dark surface tokens are unchanged.
- Image quality and asset fidelity: no images or brand assets were replaced or regenerated; the skyline and MKG mark retain their original source quality and crop.
- Copy and content: “Ask the sharpener” and all assistant content are unchanged. An explicit accessible name was added to preserve the label when the visible text is hidden on mobile.

## Full-View Comparison Evidence

The source and implementation were rendered side by side at a matched 1548 × 745 viewport. The implemented launcher aligns with the user-circled space on the upper-right of the hero and preserves the intended visual balance.

## Focused Region Comparison Evidence

A separate focused crop was not needed because the launcher and its surrounding negative space were clearly legible in the matched side-by-side full-view comparison. Open-panel bounds and responsive states were checked independently.

## Comparison History

1. Initial desktop pass: placement and panel bounds passed. Mobile DOM exposed a P2 accessibility issue: hiding the visible label also removed the button's accessible name.
2. Fix: added `aria-label="Ask the sharpener"` to the launcher.
3. Post-fix evidence: the mobile accessibility tree identifies the collapsed control as “Ask the sharpener”; mobile closed/open screenshots show the intended bottom-right launcher and inset panel. No P0/P1/P2 findings remain.

## Primary Interactions and Runtime Checks

- Opened and closed the assistant on desktop.
- Opened and closed the assistant on mobile.
- Verified the desktop panel remains within all viewport edges.
- Scrolled from the hero to the footer and confirmed the launcher remains fixed.
- Checked browser console errors: none.

## Implementation Checklist

- [x] Elevate launcher into desktop hero negative space.
- [x] Keep launcher fixed while scrolling.
- [x] Keep open panel within the viewport.
- [x] Preserve bottom-right mobile behavior.
- [x] Preserve an accessible mobile button name.
- [x] Verify desktop, mobile, open, closed, and scrolled states.

final result: passed
