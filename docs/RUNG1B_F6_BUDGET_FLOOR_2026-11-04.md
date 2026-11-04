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
