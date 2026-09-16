---
name: analytics-seam-architecture
description: "The existing privacy-first analytics/telemetry seam — reuse it, do not add a vendor; how to add usage events without a migration and within the first-paint budget."
metadata: 
  node_type: memory
  type: reference
  originSessionId: 300f6539-13df-49f2-85e2-adab9221ef09
---

SettlementForge already has a mature, owner-blessed, privacy-first product-telemetry seam. Any
"add usage telemetry" work EXTENDS this — never a new vendor/table.

**Client seam:** `src/lib/analytics.js` `track(event, props, opts)` (fire-and-forget, never throws)
→ whitelist against the frozen `EVENTS` registry in `src/lib/analyticsEvents.js` (+ `EVENT_CLASS`
essential|research, `EVENTS_REV` rev-stamp, currently 6) → consent/class gate (`src/lib/consent.js`
three-tier: essential default-ON unless opt-out/DNT; research opt-OUT default; DNT hard-kills all)
→ first-party sink `src/lib/analyticsQueue.js` (batches, spills to localStorage, sendBeacon on leave,
corpus stamp synthetic/dogfood/production) → POST `supabase/functions/ingest-events` → table
`analytics_events` (event name + **JSONB `props`** + consent_tier + actor_id...). Optional 3rd-party
mirror (Plausible/PostHog) gets ESSENTIAL-class ONLY. Canonical taxonomy doc:
`docs/analytics-event-taxonomy.md`; data-lifecycle `docs/PHASE6_DATA_LIFECYCLE.md`.

**Adding events — the mechanics:**
- Enriching an EXISTING event with new coarse props = ZERO registry bytes, ZERO server change
  (props is free-form JSONB; `stripProps` drops any string >64 chars at any depth). PREFERRED.
- A NEW event NAME = edit `analyticsEvents.js` (EAGER — see budget) + run `npm run build:edge-shared`
  to regenerate `supabase/functions/_shared/analyticsEventsBundle.js` (source-hash checked by
  `validate:edge`). NO DB migration for essential events (generic table + JSONB props).
- Prop hygiene (lint-enforced): coarse only — enums/bands/counts/booleans/hashes. Banned keys:
  name/newName/text/prose/secret/description/notes/email/body/label. Never ids or names.

**FIRST-PAINT BUDGET HAZARD:** `main.jsx` (entry) STATICALLY imports `analytics.js` → so the whole
`analyticsEvents.js` registry is in the EAGER first-paint closure. Empirically (2026-07-13) the
closure is 1,255,965 vs budget `CLOSURE_BUDGET_BYTES=1,255,985` (`tests/build/vendorPdfLazy.test.js`)
= **20 bytes headroom**. Each new event name ≈ 40-47 minified bytes → blows budget → owner-gated raise.
So instrument by prop-enrichment of events whose EXTRACTOR lives in a LAZY module (Rollup tree-shakes
per-function across chunks). Lazy fire modules: `campaignAdvanceSession.js` (world_pulse_advanced) and
`campaignSpatialCanonize.js` (spatial world_canonized). Eager: `campaignWorldPulseSlice.js`
(simulation_rules_updated:316) + `pulseFingerprint.js` extractors it imports. See
[[first-paint-budget-mechanics]].

Related: [[spatial-engine-direction]], [[handoff-plan-post-ladder]].
