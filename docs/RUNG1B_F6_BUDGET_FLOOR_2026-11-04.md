# RUNG1B-F6, the budget floor (2026-11-04)

> A dated lane record. Branch `lane/rung1b-f6-budget-floor-2026-11-04`, cut from `lane/window-rung1-2026-11-04` at `f9ce225c5`. The chair's ruling it executes: the exemptions and the anchors stand, the TARGET gives way (`target_scalable = expectedHousesAt(P) − R_tier − X`, X the expected draws of the exempt rows that can stand in THIS settlement). Rung-1B record: `docs/SOAK_1000_RUNG1B_2026-11-04.md` §4, §5 F6.

## Unit 1 — the red and its mechanism, measured at the base (`f9ce225c5`)

**The red, reproduced through the mutex.** `tests/generators/institutionBudgetDensity.test.js` › "d(pop) is the inverse of realised(d) …": `expected 0 to be greater than 0` (1 failed, 6 passed).

**Where d = 0 at the base** (every integer population in the band; `densityFactor(tier, P)` at `f9ce225c5`):

| tier | R | realised(0) | d = 0 at | target there (anchor − R) |
|---|---|---|---|---|
| thorp | 2 | 1.23 | P = 5–6 (2 populations) | 1.000 – 1.204 |
| hamlet | 3 | 1.195 | none (target at the band bottom 1.547) | — |
| village | 6 | 1.985 | P = 75–99 (25 populations) | 1.283 – 1.975 |
| town | 11 | 2.12 | none (3.340 at the bottom) | — |
| city | 15 | 1.12 | none (18.565) | — |
| metropolis | 15 | 1.37 | none (61.0) | — |

**What stands at d = 0** (forced d = 0 at the band's geometric midpoint, the calibration's 200 cells and seeds; non-required, non-fabric houses per settlement):

| tier | realised(0) | exempt rows (share) | the largest exempt rows | repairs and forced rows on scalable names |
|---|---|---|---|---|
| thorp | 1.23 | 0.57 (46%) | Fishing community 0.365, Shepherd collective 0.11, Woodcutter's camp 0.095 | 0.66: Palisade 0.33, Household levy 0.33 (`coherence_repair`) |
| hamlet | 1.195 | 0.535 (45%) | Fisher's landing 0.35, Woodcutter's camp 0.105, Caravanserai 0.08 | 0.66: Palisade or earthworks 0.33, Citizen militia 0.33 |
| village | 1.985 | 1.305 (66%) | Fisher's landing 0.39, River ferry 0.28, River boatyard 0.22, Salt works 0.155 | 0.68: Palisade or earthworks 0.34, Citizen militia 0.34 |
| town | 2.12 | 1.37 (65%) | Docks 0.27, River ferry 0.265, Salt works 0.29, River boatyard 0.255 | 0.67 Town walls (repair); 0.08 forced (Teleportation circle, Hedge wizard) |
| city | 1.12 | 1.04 (93%) | Docks 0.255, River boatyard 0.19, Harbour master 0.19, River ferry 0.18 | 0.08 forced |
| metropolis | 1.37 | 1.28 (93%) | Docks 0.275, River boatyard 0.235, Harbour master 0.23, River ferry 0.205, Dragon 0.06 | 0.09 forced |

The exempt rows are route- or terrain-required (and the metropolis Dragon, rare). None carries a row guard, an exclusion condition or an exclusive group, so the draw's chance for each is its gates plus `getBaseChance(…) × resourceMult`, and X can be read without a draw.

**The finding the ruling does not name:** at the bottom four tiers about a third to a half of realised(0) is not exempt rows but coherence repairs (the defence plan's Palisade / levy / militia / walls) and toggle-forced rows. Neither is a scaled draw. Under the ruling's scalable definition (realised(0) = 0 by construction) they fall outside both X and realised_scalable. Unit 4 measures what that costs.

Measured by `scripts/audit/institution-budget-floor-measure.mjs` (run line in its header).

## Unit 2 — the ruling in code (`bf3d1258`)

- **X per settlement.** `src/generators/steps/assembleInstitutions.js :: exemptHouseExpectation` adds up, over the tier's non-required, non-fabric, density-exempt rows, the chance the draw itself would give each one. It applies the main roll's world-law, category and toggle gates, then `rowRoll` at d = 1: the route, terrain, resource and row-guard gates, `getBaseChance` (sliders, neighbour, goods) and the resource multiplier. A toggle-forced exempt row counts 1. It is an expectation: no draw is taken and nothing is tabled. `rowRoll` is the step's former `rollFor` body lifted out unchanged, so the expectation and the draw read one function.
- **One d, three passes.** `settlementDensity(ctx)` returns `densityFactor(tier, P, X)`. assembleInstitutions, `cascadePass` (it passes `density` to `applyCascadeInstitutions`) and `factionCorrelationPass` (the new last argument of `applyFactionInstitutionBoosts`) all read it. A headless call keeps the bare curve (X = 0). The two passes now declare the context keys X reads.
- **The target.** `densityFactor(tier, P, exempt)` is the inverse of realised_scalable at expectedHousesAt(P) − R − X, clamped at 0 and 4. d = 0 exactly where the target is 0 or less. The seven anchors are untouched.
- **The table.** It is re-measured over the scalable rows at the same eight d, with the same cells, seeds and script as U10. realised(0) = 0 in every tier. realised(1), before → after: thorp 3.29 → 2.355, hamlet 9.775 → 8.77, village 26.045 → 24.29, town 46.24 → 44.62, city 51.67 → 49.975, metropolis 58.96 → 57.04. The full output is in `docs/RUNG1B_F6_BUDGET_FLOOR_2026-11-04.calibration.json`.
- **The density test, re-keyed red-first.** At the base it fails on `realised_scalable(0)` (`[0, 1.23]`) and on the pin; it is green at `bf3d1258` (9 of 9). The d = 0 populations at the largest authored X are pinned:
  - thorp 5–6 (X 1.27, river/forest);
  - village 75–95 (X 1.89);
  - none in hamlet, town, city or metropolis;
  - none anywhere at X = 0.
- **What changed in the d = 0 band.** At the base the band bottoms read d = 0 for every settlement (thorp 5–6, village 75–99). Now d = 0 there only where the settlement's own exempt rows fill the room.

## Unit 3 — the promise and the measuring script

- **The promise.** `tests/generators/institutionBudgetPromise.test.js` holds 60 of 60 at the tip against its existing digests, with the factor forced to 1.0. The new code reaches the draw only through `densityFactor`, which the promise mocks to 1. No digest moved, so nothing was re-captured, and the red-first step had no red to start from.
- **The measuring script.** `scripts/audit/institution-budget-measure.mjs --calibrate` now measures realised(d) over the scalable rows: drawn at a scaled chance (source `generated`, `cascade` or `faction_boost`), and not required, fabric or density-exempt.
