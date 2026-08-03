# MKG Copy Opportunities — Decisions & Implementation

Sean supplied the operating details on August 3, 2026. The approved items below are now incorporated into the `fix/mkg-site-polish` preview without changing the broader brand voice.

## 1. Make the service radius concrete

**Implemented.** Commercial service is available throughout Miami-Dade and Broward by confirmed appointment. Scheduling depends on location, operating hours, the existing route, and availability; it is not positioned as immediate on-call service.

Residential sharpening is completed at the MKG shop. Drop-off is available. Same-day and quick-turnaround service depend on capacity; rush pricing depends on workload and requested timing.

## 2. Give Sharp After Dark one measurable promise

**Implemented.** Preferred pickup windows run from 8 PM–1 AM; preferred return windows run from 3 AM–8 AM. Every appointment remains subject to route and schedule confirmation.

The page now uses the windows as a concrete scheduling range rather than an unconditional guarantee.

## 3. Clarify the home-service threshold

**Implemented.** Pickup and return are free within 10 miles for orders of 10 or more knives. Outside the free zone—or for fewer than 10 knives—travel is $1 per mile driven. Exact cost and timing are confirmed before booking.

A mileage calculator is intentionally deferred until the distance origin and exact mileage method are defined well enough to prevent accidental misquotes.

## 4. Turn Knife Club into an instantly legible offer

**Implemented** with a compact opening line and no additional section:

“Recurring edge care for serious home kitchens—scheduled before the knives start fighting back.”

## 5. Add a proof bridge near the first booking decision

**Implemented** directly below the first homepage CTA as a restrained link to the review page:

“17+ years of edge care · 200K+ knives sharpened · 5.0 on Google.”

## Recommendation

The new presentation uses one reusable logistics component across the Services page and both booking paths. Future changes to the service rules should be made in `src/config/serviceLogistics.ts` so the language stays consistent.
