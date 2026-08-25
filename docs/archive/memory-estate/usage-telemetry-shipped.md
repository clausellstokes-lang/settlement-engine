---
name: usage-telemetry-shipped
description: "Product usage telemetry for the Phase-5.5 spatial engine — SHIPPED to branch usage-telemetry (not merged/pushed); design, judgment calls, deferrals."
metadata: 
  node_type: memory
  type: project
  originSessionId: 300f6539-13df-49f2-85e2-adab9221ef09
---

Product usage telemetry (the owner's Phase-5.5 endgame analytics workstream, see
[[handoff-plan-post-ladder]]) is BUILT + gate-green on branch **`usage-telemetry`** (off
review-fixes-2026-07-08@5ea117ec), commit **6a8bfade**. NOT merged to review-fixes, NOT pushed
(both owner-gated). Isolated from the parallel [[round21-backlog-program]] (disjoint file set).

**What it does:** enriches two EXISTING essential events with coarse, id-free props (no new event
names → zero eager first-paint bytes; no DB migration → JSONB props in the generic analytics_events
table). world_pulse_advanced gains sim_config {preset_id, info_mode, CL-0 axes, flags_on} +
spatial_active + a per-mover activity block (movers_active + mover_counts + migration_pop_band) read
from post-tick spatialLedgers/proposals. Spatial world_canonized gains spatial/version/lit-feature/
digest-size props. Derivation = two NEW pure lazy modules `src/lib/spatialUsage.js` +
`src/lib/spatialCanonizeUsage.js`. EVENTS_REV 6→7 (edge bundle regenerated). Reuses the existing
Supabase ingest-events seam — see [[analytics-seam-architecture]].

**⚠️ Why TWO derivation modules (do not merge them):** a single telemetry module imported by BOTH
lazy bodies (advance + canonize) becomes a shared Rollup chunk whose filename leaks a ~44-byte
string into the eager entry manifest (measured: +44 before split, +0 after). One importer per module
folds it into that consumer's chunk. The FP-R "fresh module leaked a chunk-manifest entry" hazard.

**Laws proven:** goldens BYTE-IDENTICAL; entry closure 1,255,965 = byte-identical to baseline
(margin 20); verify:dist 108/108; any-cast 2252 exact; privacy canary test pins no id/name leak;
full suite 8264 pass (+2 pre-existing load-timeouts confirmed green in isolation — machine was at
load-avg 318 from parallel worktrees).

**JUDGMENT (owner delegated both 2026-07-13, vetoable):** backend = reuse existing Supabase
ingest-events seam (no vendor/table/migration); data class = essential/default-on (research would
undercount adoption). **DEFERRED (documented, not bugs):** (1) did NOT enrich the EAGER
simulation_rules_updated with preset_id/5.5-flag values or unblock its RULE_KEYS filter — that costs
eager bytes; adoption-in-use via the lazy world_pulse_advanced covers the owner's questions at
zero-eager. (2) a canonized-but-never-advanced campaign captures spatial config only at canonize, no
tick signal. (3) bespoke admin-dashboard tiles for spatial usage (AdminAnalyticsPanel hardcodes
dashboard ids) — data is queryable via analytics-export regardless. **On merge to review-fixes:** add
a STATE LEDGER row (playbook §0.0) — the ledger lives on review-fixes, updated with the owner-gated merge.
