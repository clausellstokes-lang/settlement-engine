---
name: tc4-ready-flip-rulings
description: "TC-4 promoted READY @ b52223d7 — §12b closed all 7 O-items; two pre-rulings REVISED OUT LOUD (O-2 label-parse over structured field, O-5 clamp over premise error) with the catalog-canary cure"
metadata: 
  node_type: memory
  type: project
  originSessionId: 0e891b2f-8f5a-4f56-bc66-d7add755cac2
  modified: 2026-08-10T22:43:40.924Z
---

TC-4 (buildings/multiplicity/packing) promoted READY @ `b52223d7` (2026-08-10), capsule
`0476bb4a…`, validator 9 packets / 1 READY — which also PROVED O-7: the manifest
validator releases LANDED (terminal) packets' paths, so TC-4 lists TC-3A/3B's shared
rows with no deferred-row mechanism.

⚠⚠ TWO CHAIR PRE-RULINGS WERE REVISED AT THE FLIP — recorded out loud, never silently:

- **CR-TC4-O2-R1:** the earlier pre-ruling wanted a STRUCTURED `countRange` field on
  sceneSemantics rows (the EP-g4 free-string class). REVISED to the label-parse ruling
  because semantics rows ship on the DARK path — a new row key changes base-manifest
  bytes, a golden-moving change the packet's own STOP forbids (PLAUSIBLE mechanism,
  consistent with the author lane's code reading). The free-string hazard is cured by
  MACHINERY instead: a C2 **catalog-canary exact-literal pin** — count the real ranged
  labels (≈19), pin the measured literal, assert each parses non-degenerate via
  `parseCatalogRange`. A cosmetic reword that drops a range becomes a visible red, not
  a silent multiplicity-1 fall. Exact literal on frozen authored data is deliberate.
- **CR-TC4-O5-R1:** the earlier pre-ruling wanted overflow = PREMISE ERROR ("never
  truncate"). REVISED to the clamp because `receipts.multiplicity` preserves the
  canonical resolved count losslessly (`{min,max,resolved,emitted}` + `overflowCount`)
  — the concern was loss, and nothing is lost; premise-erroring would make a valid
  world state (high-count institution, small tier) a compile hazard.

**Why: the lesson is the [[hazard-conversion-law]] applied to chair pre-rulings — a
pre-ruling made before the author's code reading is a HYPOTHESIS; when the final draft
refutes it with a mechanism, revise out loud and convert the surviving concern into a
pin, never dismiss it and never silently flip.**

**How to apply:** at TC-4's landing, both R-rulings go in the packet header (the
mid-wave-ruling pattern). Related: [[osr-resolver-state-identity-ruling]],
[[gr3b-in0c-chair-rulings]] (the refutation-chain precedents).

## CR-TC4-BAND-1 (chair, 2026-08-10) — the byte band DERIVES from the count cap

The lane's §13 STOP measured the authored TC4_LAYER_MAX_BYTES table MUTUALLY
INCONSISTENT with MAXIMUM_CARTOGRAPHY_BUILDINGS: per-row cost is a uniform
~340-374 B (id spellings dominate), so city 176 rows × ~338 B = a 59.5KB floor
against a 52KB band — no cap-bound city/metropolis row could EVER fit. Ruling:
the count caps stand (the deliberately-authored density control); the band table
is DELETED and replaced by `byteBudget = cap × TC4_ROW_BYTES_BAND (400)` — the
[[derive-dont-restate-and-mutant-must-change]] law applied to tuning: two
independently-authored tables that must agree WILL eventually disagree; derive
one from the other and the class is dead. Rejected: lowering the caps (an
unmeasured guess must never control deliberate density; changes observable
output) and a re-authored hand table (recreates the class). ⚠ the catalog canary
measured 17 ranged labels, not the author's expected 19 — two matches live in a
COMMENT (institutionalCatalog.js:2478-2479); the measured figure is pinned.
