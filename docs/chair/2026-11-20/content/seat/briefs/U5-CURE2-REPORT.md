# U5-CURE2: builder B5c's report to SEAT-6

**Outcome.** The coup path is wired, and the ceiling did not rise. `applyWorldPulse.js`'s `powerTransfer` branch now hands `transferRulingPower` the seat's circumstances. Under the law, a Royal Authority city with trade wealth held, taken by Merchant Guilds through the world pulse's power-transfer outcome, keeps the Royal Authority, and R1 names Merchant Guilds. `scripts/.size-baseline.json` goes from 907 to **905**, and its own door wrote the figure. The law dark is byte-identical: the 22 digests are unchanged and confinement is EQUAL.

**The ruling this follows.** The chair ruled at 19:19Z/19:34Z (relayed by SEAT-6), superseding the brief's "move": there is NO move of code to a sibling. The room comes from collapsing the multi-line `import { … } from '../rulingPower.js'` to ONE line. The "keeper's move" is not ruled and was not done.

Branch `lane/seat-2026-11-20-u5-cure2`, cut from `c9e6ce45b`. Nothing is pushed and there is no pull request.

| commit | what |
|---|---|
| `614078b67` | The brief's move, made before the new ruling arrived. `applyWorldPulseOutcomes`' arrival fold went to `spatial/spatialArrival.js :: foldSpatialArrivals`, and the register went 907 → 902. |
| `5d9406890` | **That move reverted, in a new commit (no history rewritten).** The three files it touched equal `c9e6ce45b` byte for byte, and the register is back to 907. |
| `0a65c289e` | The collapse, the one import and the one argument; arm (11)'s pin; the `rulingPower.js` comment; the register 907 → 905. |
| (next) | This report. |

At no commit does the register exceed 907. It reads 907 → 902 → 907 → 905.

## The room, measured
- **The collapse:** 907 → 902 counted lines, measured by `tests/lint/sizeBaseline.test.js`.
- **It survives `eslint --fix` byte-unchanged.** I ran `npx eslint --fix` on a scratch copy inside the tree. Its sha256 was `d35559cc…8ca1` before and after. The one report was `max-lines` 902 > 800, because the scratch path lacks the real file's per-file override. The copy was removed. The repository has no prettier. The commit hook's own `eslint --fix` also kept the line.
- **The wiring costs +3 → 905.** The ruling estimated 903–904, but that left out the hoist, which is its own line: `const handed = liftOccupationAuthority(next, outcome.powerTransfer)`. The hoist keeps out a new `powerTransfer on outcome` read; `check:observed-shape-readers` still reads 2214, exactly the frozen inventory. The other two lines are `seatCircumstances: () => seatCircumstancesOf(handed)` and `import { seatCircumstancesOf } from '../seat/seatCircumstances.js'`.
- **By the door:** "shrank to 905 < frozen 907 — LOWER its number here to 905".

## Red → green
| arm | red | green |
|---|---|---|
| (11) `pulseTransfer` (STOP → KEPT, in the wiring's commit) | 1 failed / 38 at `5d9406890`: `pulseTransfer:coup` gave 'Grand Merchant Senate' | 39 / 39 |
| (11) `eventChange`, the NAMED SURVIVOR (first paint) | stays pinned falling closed | green |
| (12) the law dark, 22 digests | `RECORDED` is untouched | equal; the law-on control differs |

## Gates (every run to a file)
- **Every test file naming `applyWorldPulse`, `spatialArrival` or `rulingPower.js`:** 142 files. At base: 2184 passed / 32 skipped. At tip: 2184 passed / 32 skipped.
- **The five walkers below:** 5 files, 50 passed.
  - `sizeBaseline`
  - `domainAnyCastBaseline`
  - `architecture/layerBoundaries`
  - `architecture/engineCoreLazyEdge`
  - `densityCreateBoundary.walker`
- **`typecheck:ratchet`:** 167/167.
- **`typecheck:domain:strict`:** 1113/1113.
- **`lint`:** 0 errors. There are 38 warnings, none in my files.
- **`tests/lint` whole:** 1 failed / 3270 passed. The one red is `tuningRegister.walker`, below. Both census arms are green, because this unit adds no file.
- **`confine-two.sh c9e6ce45b 0a65c289e`: EQUAL.** Both read `all 36ee5bb0bea0bb3fcc6bd83f1e9e732b4dc643f09e0844545c64785798d8ce89 1245`.

## Registers that move (named, not re-recorded)
- **`tests/lint/.tuning-inventory.json` `seatCircumstances.js#SEAT_CIRCUMSTANCE_TUNING`:** the dependents go from `[rulingPowerCoup.js, worldPulse/applyWorldPulseFactionRoster.js, worldPulse/stressorDynamics.js]` to those three plus `worldPulse/applyWorldPulse.js`. `namedDependents` do not move.
- **`scripts/.size-baseline.json`:** `applyWorldPulse.js` goes 907 → 905, written by its door.

**CONFIRMED vs PLAUSIBLE.**
- CONFIRMED by executed runs:
  - the collapse's byte-stability under `eslint --fix`;
  - 905 by the door;
  - arm (11) red → green;
  - arm (12) unchanged;
  - EQUAL confinement;
  - the gates and figures above.
- PLAUSIBLE, and not built: the bundles move by about the one import, because `seatCircumstances.js` is already reached from the `applyWorldPulse` chunk through the roster.
