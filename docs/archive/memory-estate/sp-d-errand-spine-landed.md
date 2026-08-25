---
name: ""
metadata: 
  node_type: memory
  created: 2026-08-06
  tags: 
    - fp-build
    - spine
    - sp-d
    - errand
    - hazard
    - veil
  status: active
  modified: 2026-08-06T11:19:28.239Z
  originSessionId: 0be2ac61-89a4-425a-9361-67c3f5ab1681
---

# SP-D LANDED — the errand spine generalization @ 0aac6792

Dark. `errandSpineEnabled` virtual; CQ5 trio in ONE commit (manifest row in
simulationRules.js + authored row in subsystemRowsVirtual.js + first gate read in the new
`errandMint.js`). 23 files, +1,888 lines. Unblocks ES-1, TR-8, WF-2b, IN-4, INT-3b.

## What exists now

- **`envoyErrandVocabulary.js`** — `ENVOY_PURPOSE_CLASSES` {commercial, covert,
  diplomatic, factional, personal, religious}; `PURPOSE_CLASS_BY_PURPOSE` (the mapping
  row as DATA: sue/self_parlay → diplomatic); `ERRAND_CONSUMERS` (frozen 6-row registry);
  `purposeClassOf` / `declaredPurposeClassOf` — THE TWO READERS, one definition each.
- **`errandMint.js`** (new leaf, 56 effective lines) — `errandSpineActive` (the ONE
  `errandSpineEnabled === true` in the tree), `errandSpineFields`, `mintErrandSpine`
  (also normalizes the outbound route plan → it is the movement manifest's new
  injected-plan row).
- **`envoyErrand.js`** — ONE delegation call, nothing else.
- **`envoyErrandRecords.js`** — `errandSpineBlock`, spread into `normalizeErrand`.
- **`envoyErrandProjection.js`** — `projectErrandPurpose(row, { includeCovert })`, NEW.

## ⚠⚠ THE HAZARD THAT ALMOST ATE THIS WAVE — `normalizeErrand` IS AN EXPLICIT KEY LIST

Every path into `worldState.envoyErrands` runs `writeErrands` → `normalizeEnvoyErrands` →
`normalizeErrand`, and that normalizer BUILDS ITS OUTPUT FROM AN EXPLICIT `out` OBJECT. A
new field it does not name does not error and does not warn — it EVAPORATES on the first
write, while every unit test of the mint stays green because the mint really did return
it. **Any future field on an errand row must be added to `normalizeErrand` or it does not
exist.** Executed control: deleting the one spread reds 9 of 16 lifecycle pins.

## The three field laws (each pinned, each with an executed mutant)

1. **DROP-WHEN-DERIVABLE.** `purposeClass` is written ONLY when it differs from what the
   mapping row derives. A war errand carries NO class key and reads `diplomatic`. That is
   what buys the no-migration promise — and its cost is that a DIRECT read of
   `errand.purposeClass` returns `undefined` on the commonest rows. Hence the one-reader
   law, scanned by `tests/lint/errandConsumerRegistry.walker.test.js`.
2. **THE PAIR IS ATOMIC.** `declaredPurpose`/`truePurpose` survive only together, only as
   lawful words, only when they differ, and only when the true half equals the resolved
   class. Half-splits heal to ABSENT — an errand can lose a cover story, never gain a
   secret. The mint REFUSES a disagreeing `truePurpose`; the import HEALS it.
3. **THE VEIL DOES NOT ANNOUNCE THE SECRET.** The public projection of a covert errand
   wearing a diplomatic face is IDENTICAL key-for-key to an honest embassy's — a `covert:
   true` marker or a conditionally-present `declaredPurpose` key would BE the tell.

## Two substrate overstatements found (J-WR-13), reported not silently fixed

- **SP §4's "envoyErrandProjection.js already owns the audience split" is FALSE.** Zero
  `covert`/`includeCovert` in that file. The ES volume had already measured this
  (`DESIGN_FP_ARCH_ES.md` §1 ⟨seam-nit⟩). SP-D BUILT it, borrowing the estate's existing
  `includeCovert` spelling. Both docs now carry the supersession.
- **`envoyErrand.js` was NOT "at the effective ceiling."** 823 is RAW; effective was
  695/800 (105 lines of headroom). The leaf landed on the collision-map reason instead.

## Registration rows a new worldPulse leaf owes (all four bit this wave)

`tests/domain/envoyK3BeliefSeam.test.js` (exact import list, family member), 
`tests/lint/namedPersonTransitTotality.walker.test.js` (auto-discovered by
`normalizeRoutePlan(`), `tests/lint/couplingInclusion.walker.test.js` (LAYER_PATTERNS or
ARGUED_UNLAYERED — errandMint took ARGUED_UNLAYERED on the lawWord.js argument),
`tests/lint/spTermLiteral.walker.test.js`. Plus
`tests/lint/sovereigntyLightingContract.walker.test.js`'s CENSUS re-measure whenever the
test-file count moves (2,318→2,322 here) and `scripts/mutation-coverage-manifest.json` for
any test file whose basename matches the invariant NAME_PATTERN — note **"Spine" contains
"pin"**, so any `*Spine*.test.js` is enumerated.

## Gate state at landing (all executed)

`typecheck:domain:strict` green at exactly the 1313 ceiling. tests/lint + property +
security + domain: 25 failing tests — the SAME 25 executed against BASE state, so SP-D adds
ZERO. `npm run lint` red at base on 3 untouched files; `npm run typecheck` red at base
(envoyErrand/envoyErrandRecords error counts 39/5 in BOTH states).
