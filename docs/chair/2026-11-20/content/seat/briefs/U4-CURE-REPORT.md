# U4-CURE-REPORT: two walker reds of U4, cured by cause. Builder B4c to SEAT-4. STATUS: cure 1 GREEN; cure 2 cured its identity, and the walker stays RED on three more identities that U4 caused and the brief did not list. They need a ruling.

Branch `lane/seat-2026-11-20-u4-cure`, cut from `0fa999bf6`. Commits: `c1d208beb` (cure 1), `040221723` (cure 2), and this
report's commit. Nothing pushed. `scripts/.writer-reach-baseline.json`, `tests/lint/.lighting-census-baseline.json` and
`docs/content/wiring-census.json` are untouched (`git diff --quiet 0fa999bf6 -- <each>`).

## Cure 1: `factLayers.walker` (`c1d208beb`)
`src/domain/facts/factLayers.js :: LEAVES.powersList`: its `reads` gain `config` and `_config`. That is the one
declaration the chair ruled; nothing else in the file changed (the note is unchanged).
- RED at `0fa999bf6`: `tests/lint/factLayers.walker.test.js` 1 failed | 14 passed (15). The failing test: "every leaf
  declares exactly the strata it touches, and every stored field it reads is placed" (`powersList` undeclared
  `[_config, config]`).
- GREEN: 15 passed (15). The neighbours that read `factLayers` (`presumedThings.walker`, `facts/sharedPower`,
  `rulingBody`, `rivalPower`, `seatOutranked`, `leftLines`, `bar6HousesSovereign`): 88 passed (88).

## Cure 2: `writerReach.walker` (`040221723`)
**The measure, taken before any edit with the walker's own `surfaceClosures` and `edgeMapOf` at `0fa999bf6`.** There is
ONE chain: `rulingPowerCoup.js -> seat/holderOfSeat.js -> people/cardVeil.js -> spatial/cohesionWeave.js`. Of the eight
imports of `holderOfSeat.js`, only `cardVeil.js` reaches it. These do not: `rulingPower`, `factionArchetypes`,
`dossier/seatHolder`, `people/membership`, `people/cardPowers`, `seat/seatTable`, `data/cultureOfficeTitles`.
**The brief's likely shape is refuted.** The leaf takes ONE thing from `cardVeil.js`: `isVeiledPower`. The HOLDER rules
read it (R3's open filter and the reader's `servable`); the PERSON read does not (it reads
`cardPowers.js :: cardInstitutionVeilOf`, which reaches nothing). R2's holder also needs the person, so a holder-only
leaf would hold the whole of `holderOf`. The predicate already has a row twin: `seat/seatTable.js :: isVeiledRow`,
pinned equal to `isVeiledPower` by `tests/domain/seat/seatTable.test.js`.
**The cure:** `holderOfSeat.js` reads the veil with `isVeiledRow`. One import is dropped, two calls are renamed, and the
comments are updated. There is no new leaf and no change to `rulingPowerCoup.js` or `vite.config.js`. `holderOf`'s API
and every answer are unchanged.
- Closures (the walker's lib): campaign-pdf 218 -> 214 and world-book 233 -> 229. The four files that leave are
  `cardVeil.js`, `cohesionWeave.js`, `informationBrokerageTuning.js` and `contentFingerprint.js`. dossier-pdf 616,
  foundry 512 and web-transitive 1078 are unchanged.
- RED-first arm (9) in `tests/domain/seat/holderOfSeat.test.js`, run on the base code: 1 failed | 30 passed (31). The
  failing test: "the static import closure of seat/holderOfSeat.js holds no spatial/cohesionWeave.js". The arm's control
  (`isVeiledRow` equals `isVeiledPower` on every row shape) is green on both sides. GREEN: 31 passed (31), with U3's 29
  unchanged.
- Every test naming `holderOfSeat` or `rulingPowerCoup` (18 files), plus `seatTable`, `engineCoreLazyEdge`,
  `layerBoundaries` and `densityCreateBoundary.walker`: 22 files, 581 passed (581).

**`writerReach.walker` is STILL RED: 1 failed | 51 passed (52), before and after.** The round-trip arm stops at its
first mismatch, so it hid the rest. Measured whole (every identity's live reach against the frozen map, through the
walker's own `measure`):

| tree | identities differing |
| --- | --- |
| U4's base `d61c05637` | 0 |
| `0fa999bf6` | 10 |
| this tip | 3 |

Cured here (7): fear on candidates · fear on outcome · fear on relationshipPatch · fear on relationshipStates · fear on
selected · facets on institutions · serviceKeys on institutions.
Left (3). U4's own reads cause them, and no split can remove them without changing U4's answers. The readers are by the
walker's verdict rows:
| identity | frozen | live | reader added by U4 |
| --- | --- | --- | --- |
| narrative on factionRelationships | all six `N` | campaign-pdf, dossier-pdf, foundry, web-transitive, world-book `R` | `holderOfSeat.js :: transferTakerOf` (R1) |
| recentConflict on powerStructure | no web-transitive | + `web-transitive=R` | `holderOfSeat.js :: transferSays` (R1) |
| priorityMilitary on config | no foundry | + `foundry=R` | `seat/seatCircumstances.js` (CS5) |
These are not re-recorded. They need SEAT-4's or the chair's ruling: a re-record with its cause.

## Gates
- `typecheck:ratchet` 167 / 167, exit 0. `typecheck:domain:strict` 1113 / 1113, exit 0. `lint`: 0 errors, 38 warnings,
  none in a touched file.
- `confine-two.sh 0fa999bf6 040221723`: both base and tip read
  `all 36ee5bb0bea0bb3fcc6bd83f1e9e732b4dc643f09e0844545c64785798d8ce89 1245`. EQUAL.
- Fresh `npm run build`: the generation worker is 2,596,960 B against U4's 2,596,960, **delta 0**.
- `tests/lint` WHOLE: 220 files: 4 failed | 216 passed. Tests: 7 failed | 3264 passed (3271). U4 had 9 failed (its `7506bd780`); this run has
  2 fewer: `factLayers` (cure 1) and the each-family arm (cured at `271aab955`). Every one of the 7 is U4's or a
  census arm, and none is mine. I added no file, so no census delta of mine exists:
  - `writerReach.walker` x1: the three identities above.
  - `proseWiringCensus.walker` x3: the stale stamp, and ALIAS DRAFT 24 -> 25. Both are U4's.
  - `sovereigntyLightingContract.walker` x1: file count 3708 -> 3709, which is U4's test file.
  - `arcaneClassifierCensus.walker` x2: `stressorDynamics.js:53 -> :55`, which is U4's.

## What I did NOT do
- I re-recorded no baseline or census and ran no `wiring-census.mjs`.
- I made no new leaf, no `vite.config.js` pin and no `rulingPowerCoup.js` edit. The measure showed none was needed.
- I made no change to `seatCircumstances.js` and no R1 change for the three identities left.

CONFIRMED (executed here): every count, closure, identity diff, hash and byte figure above.
PLAUSIBLE: none.
