# MKG booking and navigation release — September 20, 2026

## Scope and evidence

- Audited 20 live sitemap pages and 38 live page, asset, and outbound destinations. All returned HTTP 200; no broken internal fragment links were found. This is a link/reachability check, not proof that external Google review completion works on every device.
- Inspected the live home intake and service chooser in the browser. The home link reaches the correct form, and submitting an empty form triggers required-field validation.
- Claude artifact `https://claude.ai/artifact/XnaAvk25CmbytaSdzKKLxQ` was blocked by a Cloudflare human-verification screen. No artifact content was available for comparison. Styling changes use the user's written preferences and MKG's existing skyline asset, fonts, colors, and button effects.
- Release scope includes the approved booking redesign, Edge Guide, complete service catalogue, and shared style refinements. Production publication is authorized by the site owner; deploy status is recorded by GitHub/Vercel for the release commit.

## Confirmed issues fixed

1. SMS-only automatic handoff left users without a messaging app without a usable on-page summary. Requests now remain visible with explicit text/share/copy choices and Sean's phone number.
2. Clipboard failure previously still produced a success message. Copy success is now reported only after the clipboard succeeds; blocked copying selects the text for manual copying.
3. The submit button was type=button and form submit was canceled without preparing anything. Native submission now prepares the request, including Enter-key submission where supported.
4. Photo-sharing support checks could throw before error handling. Capability checks and share cancellation now preserve the request and expose the text fallback. Multiple photo selection remains enabled.
5. Club entry did not select the club program. The link now carries `intent=club`. The thinning guide carries `intent=thinning` into the photo form.
6. Coded referrals lost attribution through some booking/text links. The chooser, form, header, and footer booking links now carry the code; analytics continue to exclude request details and referral codes.
7. Reviews, Proof, and Our Story marked visible panels `aria-hidden=true`. Their standalone-page containers now expose their content to assistive technology.
8. Mobile menu labeling did not reflect the expanded state. It now announces open/close correctly, returns focus on Escape, and closes when entering the desktop layout.

## Layout and confidence improvements

- Replace numbered booking boxes with three fully clickable service rows.
- Bring intake forms above optional logistics; remove introductory bento cards on intake pages.
- Keep travel and timing terms in clearly labeled expandable sections.
- Use the existing skyline at 20% opacity, with its background extended 15% beyond both vertical ends of the intake surface. Keep dark fields, outlined pink review buttons, and cyan send actions.
- Explain review → send → confirmation, label optional fields, enable contact autofill, and add the privacy link.
- Validate positive whole knife counts and reject whitespace-only required text.
- Invalidate prepared summaries when source fields change, preventing stale requests.
- Header Book Service jumps to the current intake instead of abandoning it.
- Home knife count defaults to 12, remains editable, and can be cleared for tools-only requests.
- Shared dropdown includes all requested knife, shear, blade, workshop, medical-tool, thinning/reprofiling, custom-creation, and other-request options. Services-page links preselect the corresponding option.
- Thinning starts at $16 per side; charges vary with material removed, labor, abrasives, and total time.
- Shared ignition effects support keyboard focus and reduced motion. Contact, pricing, reviews, and privacy are linked from the footer.
- Hero, proof, and story styles are imported where used, and font origins are preconnected. No change to the cinematic hero animation.

## Verification and remaining limits

Run `npm run build`, then `npm run test:forms` and `npm run check:links`.
Run `python3 scripts/check-links.py --live` for a fresh production link audit.

15 automated DOM regression cases cover the default count, complete catalogue, service-link preselection, requests, validation, clipboard failure/success, changed details, program preselection, photos, canceled/unsupported sharing, referral links, and navigation accessibility. These tests simulate browser APIs; they do not send texts or book appointments. Local build and all 15 cases pass; all 21 generated pages and 41 internal destinations pass link checks. Every generated page has one main heading, a title, and a description.

The local preview cannot be opened by this session's cloud browser, so visual verification uses the hosted preview. Actual iOS/Android messaging/share completion requires real-device follow-up. The site prepares a customer-sent message rather than accepting submissions on a server; it never claims a booking is confirmed automatically.

The Edge Guide and its generated assets ship together with their new navigation and sitemap links.

Hosted preview verification: home request renders the 12-knife default and full catalogue; entering test details and clicking Review prepares the correct message without sending it. Services → Thinning or reprofiling opens the specialty form with thinning selected. Rendered home and specialty forms were visually inspected, including skyline, pink outline button, typography, and page width. A final contrast improvement raises supporting route-page copy to a readable gray, and removes a repeated screen-reader heading.
