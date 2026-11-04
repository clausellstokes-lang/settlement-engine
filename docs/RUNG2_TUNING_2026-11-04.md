# Rung 2, unit 1: the rung-1 tuning in force (2026-11-04)

> A dated archival record. It cites `lane/rung2-2026-11-04`, cut from `lane/window-rung1-2026-11-04` at `bf263a78` (the 1D record on the run tip `2e4694d5`). No dial moved in this unit. Nothing here re-records, refreezes or reads a golden.

**The outcome: both dials were already in force at the base, so no dial moves.** The figures in rung 1D (`docs/SOAK_1000_RUNG1D_2026-11-04.md`) are therefore the tuned figures, and so are rung 2's (`docs/SOAK_10000_RUNG2_2026-11-04.md`).

## 1. The two dials and their provenance

| dial | the dry run's proposal (`docs/SOAK_1000_2026-11-03.md` §4) | value at `bf263a78` | set by | the red-first it carried |
|---|---|---|---|---|
| T1 `src/data/foodImportRates.js :: SIEGE_PRODUCTION_KEPT` | 0.6 → 0.3 | **0.3** | `fe56bddd4` | `tests/domain/foodEnduranceLine.test.js` "a thorp growing 84% of its need runs out on half rations under siege (T1)" |
| T2 `src/generators/foodGenerator.js :: generateFoodSecurity`, no-granary `baseStorage` for a village | 1.0 → 1.5 | **1.5** (thorp, hamlet and village share it) | `fe56bddd4` | `tests/generators/foodBaseNumbers.test.js` "a village with no granary stores no less than a hamlet (T2)" |

- **The commit.** `fe56bddd47fb7f139fdb572a392d4bc1bb3cee45`, 2026-11-04 08:01:54 UTC, "food: the siege keeps 0.3 of the harvest; a village stores as a hamlet does (T1, T2)". It sits on the first-parent line of the window branch `lane/window-rung1-2026-11-04` (47 commits below its tip) and carries both dials in one commit. Its body names the authority as the chair's adoption under the owner's word of 2026-11-04 ("I leave it all to your judgment"). Both `git log -S` searches the brief names return this one commit.
- **The integration branch.** The brief says the integration branch that PR #72 lands still reads 0.6. I did not fetch that branch, so this is PLAUSIBLE (the brief's claim). It means the dials land with the window branch, not before it.
- **The tuning register.**
  - `tests/lint/.tuning-inventory.json` (measured at `0c104fe8`, 2026-10-31) has **no row for `SIEGE_PRODUCTION_KEPT`**. `src/data/foodImportRates.js` is in none of its tables. `fe56bddd`'s own body already names "a DECLARED tuning-register row for SIEGE_PRODUCTION_KEPT" as owed to the landing. It is still owed, and it goes to the landing seat's list (`docs/SOAK_10000_RUNG2_2026-11-04.md` §4). I have not refrozen anything.
  - T2's literal sits in `foodGenerator.js`, which the inventory already counts (`unregisteredNamed` 7; bare decimals 63). `fe56bddd`'s body says those counts were measured identical before and after. I did not re-measure them.
- **Goldens.** By `fe56bddd`'s own figure, T2 moves every village row (84 of the 525 in the generator golden master) and T1 moves every `under_siege` row and every Food endurance sentence. Those rows are inside the 525 that 1D §4 already lists as red against the committed manifest. This unit adds no golden movement, because it changes no code.

## 2. Predicted effect beside what was measured

The dry run's predictions were recomputed from its 1,000 records at 0.6 and 1.0. Rung 1D measured the same 1,000 seeds at the tuned tip. Rung 2 measured 10,000 seeds at the same tip; its first 1,000 seeds are 1D's corpus, and they reproduce 1D's finding counts exactly.

| tier | dry run, untuned: months in store · full-ration endurance | predicted | 1D measured (1,000): grown % · months in store · famine · secure | rung 2 measured (10,000): months in store · full-ration endurance (median) | never runs out on half rations: dry run → predicted → measured |
|---|---|---|---|---|---|
| thorp | 1.5 · 3.6 | endurance 2.2 | 94 · 1.8 · 17 · 97 (of 167) | 1.8 · 2.31 | 117/167 → 0 → **0** (1D) · **0 of 1,667** (rung 2) |
| hamlet | 1.5 · 3.8 | — | 95 · 1.8 · 31 · 96 | 1.8 · 2.37 | 125/167 → 0 → **0** · **0 of 1,667** |
| village | 1.3 · 3.0 | stores ≈ 1.9; endurance 1.8 at T1 (4.4 at the old siege dial) | 91 · 2.1 · 17 · 98 | 2.1 · 2.83 | 116/167 → 0 → **0** · **0 of 1,667** |
| town | 6.3 · 11.5 | endurance 8.2 | 76 · 6.3 · 12 · 103 | 6.3 · 8.26 | 46/167 → 0 → **0** · **0 of 1,667** |
| city | 8.8 · 13.9 | endurance 10.8 | 59 · 8.8 · 13 · 99 | 8.8 · 10.85 | (in the 404) → 0 → **0** · **0 of 1,666** |
| metropolis | 15 · 20.7 | endurance 17.4 | 45 · 15.0 · 15 · 103 | 15 · 17.57 | (in the 404) → 0 → **0** · **0 of 1,666** |

How to read the table:
- **T1 holds as predicted at every tier.** The 404 of 1,000 places that never ran out on half rations is now 0 of 1,000 in 1D and 0 of 10,000 in rung 2 (`chain.enduranceHalfForever` is false for every settlement). Measured endurance lands within 0.15 months of the dry run's prediction for thorp, town, city and metropolis.
- **T2 holds in its direction.** The village now stores more than the hamlet (2.1 against 1.8 months, both with the mill multiplier). That is above the dry run's "about 1.9" because the mill and preserved-source terms add on top of the 1.5 base.
- **1D's sentence.** 1D §3 says "No place ever runs out on half rations under siege". Measured, the meaning is the reverse: no place NEVER runs out (the count of places that hold out forever on half rations is 0). I flag it so the landing seat does not read 1D's line as a regression.
- **Two predictions I could not check.** The village's 1.8 full-ration prediction cannot be compared directly: the dry run predicted it with the old 1.0 store, and both dials moved together. The hamlet had no prediction.

## 3. The veto note

Both dials are the chair's adoption under delegated judgement. The owner may veto either one. On a veto, that dial is reverted in its own commit (red-first: the dial's own test above goes red), and the 10,000 is re-run without it using the same command (`node scripts/audit/soak-review.mjs --count 10000 --workers 4 --out artifacts/rung2-veto-<T1|T2>`). The figures in §2 are what such a re-run would be compared against.

## 4. CONFIRMED vs PLAUSIBLE

- **CONFIRMED:**
  - both values at `bf263a78`, read from the source;
  - the single setting commit, `fe56bddd`;
  - the missing `SIEGE_PRODUCTION_KEPT` row in the tuning inventory;
  - every rung-2 figure in §2, read from `artifacts/rung2` (`fields.json` and the shards).
- **PLAUSIBLE:**
  - that the integration branch still reads 0.6 (the brief's claim; not fetched);
  - `fe56bddd`'s golden-row figures (84 village rows) and its unmoved inventory counts (its own report; not re-measured here).
