# Design QA — Assistant Quick Actions

## Evidence

- Source visual truth: `C:\Users\Miami\AppData\Local\Temp\codex-clipboard-b6cff2b6-6622-4b6b-9f5f-7de4c9c90419.png`
- Implementation: `http://127.0.0.1:4321/`
- Implementation screenshot: Codex in-app browser capture from this QA run (open assistant at 437 × 690 CSS px; browser-runtime artifact rather than a filesystem-backed file)
- Side-by-side comparison: `http://127.0.0.1:4321/qa-comparison-chatbot-quick-actions.html` during QA
- Source pixels: 437 × 690.
- Implementation viewport and pixels: 437 × 690 CSS px at device scale 1.
- Comparison normalization: source and implementation displayed side by side at 1:1 size in the same browser capture.
- State: homepage with Edge Concierge open and quick actions visible.

## Findings

- No remaining P0, P1, or P2 findings.
- The horizontal scrollbar is gone because the quick-action region no longer overflows: `scrollWidth` and `clientWidth` both measure 419 px and computed `overflow-x` is `visible`.
- The four actions form a balanced 2 × 2 grid with two equal 191.5 px columns and an 8 px gap.
- Every action has an 11 px label and a 42 px minimum height, materially improving readability and touch accuracy while preserving the existing pill styling.
- The new rows fit above Service Details and the message composer without hiding or overlapping either control.
- A visible cyan focus outline was added for keyboard users.

## Required Fidelity Surfaces

- Fonts and typography: existing Montserrat family, weight, tracking, and white-on-dark hierarchy are preserved; quick-action labels increase from 9 px to 11 px with a 13.75 px line height.
- Spacing and layout rhythm: the single overflow row becomes a symmetrical two-row grid with 8 px gaps and 12 px bottom spacing.
- Colors and visual tokens: existing pink borders, dark translucent fills, hover glow, and cyan focus token remain consistent.
- Image quality and asset fidelity: no images or brand assets changed.
- Copy and content: all four existing action labels and their behavior remain unchanged.

## Full-View Comparison Evidence

The before and after states were displayed together at matched 437 × 690 dimensions. The after state removes the accidental scrollbar, makes every choice fully visible, and preserves clear separation from Service Details and the composer.

## Focused Region Comparison Evidence

The quick-action region was measured directly: 419 px wide, no horizontal overflow, two 191.5 px columns, 8 px gap, four 42 px-high buttons, and 11 px labels. No cropping or truncation is visible.

## Comparison History

1. Source finding: one-line overflow produced a prominent horizontal scrollbar and 9 px option labels with small targets.
2. Fix: replaced the scrolling flex row with a 2 × 2 grid, increased labels to 11 px, increased targets to 42 px, and added keyboard focus styling.
3. Post-fix evidence: the matched side-by-side capture shows all four actions simultaneously with no scrollbar; runtime measurements confirm no overflow.

## Primary Interactions and Runtime Checks

- Opened the assistant at the reference viewport.
- Confirmed all four preset buttons are visible and enabled.
- Confirmed Service Details and the message composer remain visible.
- Checked browser console errors: none.
- Automated checks: 5 chatbot tests, 15 form tests, and the Astro production build passed.

## Implementation Checklist

- [x] Remove horizontal quick-action overflow.
- [x] Show all four actions without scrolling.
- [x] Increase label size and target height.
- [x] Preserve styling and copy.
- [x] Add visible keyboard focus treatment.
- [x] Verify the open panel at the reference viewport.

final result: passed
