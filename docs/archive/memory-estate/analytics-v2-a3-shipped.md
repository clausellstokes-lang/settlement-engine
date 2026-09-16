---
name: analytics-v2-a3-shipped
description: "Analytics V2 Wave A3 (the final analytics wave): §9 pre-Surveyor intent atlas, §10 two-lane auto-tuning RAILS (ships empty), and the A2 subject_id capture-stamp deferral — what shipped vs what's deferred, and the load-bearing finding that §10's design premises don't yet exist in code."
metadata:
  node_type: memory
  type: reference
  originSessionId: 049d4c82-58c0-4be1-956a-d47c628ee704
---

Wave A3 built the three items of DESIGN_ANALYTICS_V2.md §9/§10 + the A2 deferral, on branch
review-fixes-2026-07-08 (based on A2 @ a5521267), ALL WORK UNSTAGED (never committed by this
session). Focused batteries + full `npm run check` gate green.

**Item 3 — A2 deferral (subject_id capture stamp), CLOSED (mostly).** The seam was already
end-to-end (`track(evt, props, {subjectId})` → `enqueueEvent` → `buildEnvelope.events[].subjectId`
→ ingest `uuidOrNull` → `analytics_events.subject_id`); only the call sites didn't pass it. A3
stamps the campaign uuid at the 4 campaign-scoped emits: `world_pulse_advanced` ×2
(src/store/campaignAdvanceSession.js), `world_canonized` ×2 (campaignSpatialCanonize.js +
campaignWorldPulseSlice.js). This feeds `report_market_preset_adoption`'s k=200-campaigns floor.
- ⚠️ JUDGMENT: `generation_completed` is INTENTIONALLY left unstamped. Its sole emit
  (settlementSlice.js ~1005) is the pre-save, pre-campaign WORKING-BUFFER generation — no campaign
  uuid AND no persistent save uuid exists in scope (the generation-id spine uses a pseudonymous
  NON-uuid id). "Stamp where campaign-scoped" is a no-op there, so `report_market_archetype_popularity`'s
  campaign floor stays fail-closed by design until a campaign-scoped generation path exists.

**Item 1 — §9 INTENT CORPUS, pre-Surveyor slice only.** The Surveyor (NL→engine-op compiler)
DOESN'T EXIST, so the ALIGNMENT TRIPLE / correction-typology CLASSIFICATION / AI engineering map are
all Surveyor-gated → deferred (markers in migration 134 header + src/domain/intent/correctionTypology.js).
The ONE capturable-now piece is the MANUAL-USER ATLAS: migration 134 (WRITTEN-NOT-DEPLOYED)
`rollup_intent_atlas_daily()` — a rollup over the EXISTING research-plane `edit_events` (ZERO new
capture, ZERO eager): recurring (session,settlement) op-cluster SIGNATURES = macro candidates +
per-op-kind revert-rate (the pre-Surveyor correction proxy). Wired into `analytics_nightly_maintenance`
(latest-wins redefinition over 133). `correctionTypology.js` versions the vocabulary (only
'unclassified_manual' emitted; 6 Surveyor classes declared+deferred).

**Item 2 — §10 AUTO-TUNING RAILS (the load-bearing structural boundary).** src/domain/tuning/:
`autoTunableRegistry.js` (SHIPS EMPTY — owner ratifies at setup; nothing auto-applies on deploy),
`laneClassifier.js` (lane A auto-apply vs lane B owner-signed), `weeklyTuningJob.js` (pure
ingest→diagnose→classify→report, APPLIES NOTHING), `scripts/tuning-weekly.mjs` (WRITTEN-NOT-ENABLED
entry; `npm run tuning:weekly`). The golden/same-seed boundary is made STRUCTURAL (not just documented)
by 3 layers: (1) surface allowlist `['display','rollup','analytics']` — no 'sim'/'generation'; (2) a
module DENYLIST regex `/(worldPulse|spatial|generators?|\/generate|movers?)/i` — every golden-shifting
constant lives behind that call graph, so it can't be a valid entry; (3) the classifier forces lane B
on any `shiftsGolden` soak. Walker test (tests/domain/autoTunableRailsWalker.test.js) fails the GATE if
a sim-module entry is ever added.

**⚠️ LOAD-BEARING FINDING — §10's design premises don't yet exist in the codebase** (recon-confirmed):
- NO "design-envelope" registry: ~50 `*_TUNING` point-constant objects under worldPulse/spatial, but
  NOTHING pairing a constant with an acceptable min/max range. The doc's `FAMINE_PRESSURE_K` is a
  hypothetical in its own prose. Distribution envelopes exist ONLY as inline bounds in
  tests/simulation/distributionEnvelopes.test.js (not exported/diffable).
- The "CACOPHONY SOAK" doesn't exist — it's planned in DESIGN_PACING_GOVERNOR.md, blocked on the
  Narrative Tempo Governor (E0), also unbuilt. §10's own SEQUENCING gates it on "E0's envelopes live."
- NO in-repo AI-agent scheduled machinery. "The existing scheduled-agent machinery" = the Claude
  PLATFORM's scheduled-cloud-agent feature, not an in-repo asset. In-repo cron = GitHub Actions
  (Mon 06:00 UTC) + pg_cron nightly. So the full auto-tuning LOOP is E0-gated; A3 ships the RAILS +
  the report/classify machinery, empty and inert, per the design's "owner rails ratified once at setup."
- Golden regen: `UPDATE_GOLDEN=1 npx vitest run tests/property/<f>.test.js`; goldens in
  tests/fixtures/*-golden*.json. CLOSURE_BUDGET_BYTES (1,215,520) is a build-size ratchet, NOT a
  sim constant.

**Gotchas for the next implementer:**
- New src/domain files must be ZERO-`any` (tests/lint/domainAnyCastBaseline.test.js: "new files get 0")
  AND zero-strict-error (scripts/check-domain-strict.mjs ceiling 0). Use `unknown` + `Partial<T>` casts,
  never `@type {any}`. This bit A3 once (17 any in a first draft).
- Adding a migration bumps ARCHITECTURE.md's `**migrations/** (N)` fact (architectureFreshness test).
- All A3 additions are ZERO first-paint eager EXCEPT the one `world_canonized` stamp in the EAGER
  campaignWorldPulseSlice.js (~16 B); measured under the 1,215,520 budget.

Related: [[analytics-seam-architecture]], [[golden-branch-firstpaint-budget-overage]].
