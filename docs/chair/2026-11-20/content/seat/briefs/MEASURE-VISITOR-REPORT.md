# MEASURE-VISITOR — report (builder BMV to SEAT-6; a measure only)

**Outcome.** The calibration reproduces at MEASURE-LIT's commits (c4df8a027 + c167b5f11), both rows EQUAL. The cause is **CONFIRMED**. A calm visitor's village reads contested 31.7% today, not 70%. With fortune at 1cd2e6d93 on, it reads 16% or under at every size. One command, `sh docs/chair/2026-11-20/content/seat/u4/measure-lit.sh`, ran in **2,202 s**: 21,000 arm births with 0 errors, plus 3,000 calibration and sanity births. Every table is in `../u4/measure-lit.md`.

**The visitor (`src/store/settlementGenerateAction.js :: generateSettlementAction`):**
`birthConfig({ ...birthInputs, _institutionToggles, _categoryToggles, _goodsToggles, _servicesToggles, ...(state.randomSliderMode === true && !isSampleFork ? { _randomizePriorities: true } : {}), ...(neighbor ? { _importedNeighbor: neighbor } : {}) })`. Here `birthInputs` is the config without `seed`.

- **Signed-out:** `{ ...DEFAULT_CONFIG, settType: ANON_FORGE_SIZE }` (`'town'`), with four `{}` bags.
- **Signed-in:** `storedConfig`, which at rest is `{ ...DEFAULT_CONFIG }`, with `{}` bags.
- **Both:** `randomSliderMode` rests at true, there is no neighbour, and the content runtime is vanilla.

I measure the signed-in path with the size picked, because the signed-out path forges only towns. Those towns are exactly this pool's town rows.

**Fortune.** The scratch merge gave the chair's six conflicts (5+2 hunks), which the recipe covers. With no law forced it matches today on 596/600 (chair's 600) and 599/600 (visitor) places. No contest reading moved.

**Cause arm.** With fortune off, pool A is within noise of pool B. With fortune on, A sits beyond twice the standard error at four sizes (Σ 46.7 points). A′ closes the gap: no size beyond noise, Σ 11.5. Pool A is born on road and frontier in 900 of 900 places.

Calm places contested, % (fortune off → on; D; L1 is identical to D):

| pool | thorp | hamlet | village | town | city | metropolis |
|---|---|---|---|---|---|---|
| **visitor**, today | 0 | 1.5 | 31.7 | 2.9 | 0 | 0 |
| **visitor**, seat D | 0 → 0 | 1.5 → 0 | 27 → 11.1 | 2.9 → 1.4 | 0 → 4.2 | 0 → 4.4 |
| **visitor**, seat LP | 0 → 0 | 1.5 → 0 | 33.3 → 15.9 | 2.9 → 1.4 | 0 → 4.2 | 0 → 7.4 |
| chair's 600, seat D | 0 → 0 | 7.6 → 1.5 | 67.1 → 17.1 | 5.7 → 8.6 | 0 → 11 | 0 → 10.4 |
| pool A, seat D *(not a visitor's world)* | 0 → 0 | 2.8 → 0 | 68.6 → 2 | 1.9 → 0 | 0 → 0 | 0 → 0 |
| pool A′, seat D *(not a visitor's world)* | 0 → 0 | 9.7 → 1 | 59.2 → 17.5 | 3.6 → 3.6 | 0 → 8.2 | 0 → 7.5 |

Fortune-off rates are under today's standing. The measure reads faction weights.

**Not done.** No `src/` or `tests/` edit, no test run, no push. I dropped the presets pool (pool A's family); its figures stay at 213ec7cbb.

**CONFIRMED vs PLAUSIBLE.** The calibration, the cause arm and every figure here are CONFIRMED by these runs. PLAUSIBLE, untested: the visitor's lower village figure comes from `_randomizePriorities`, the only setting that differs from pool B's birth.
