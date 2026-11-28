# U5-CURE: builder B5b's report to SEAT-6

**Outcome.** Part (a) is done and green. Part (b) is ONE of three callers wired. The other two are STOPPED, each pinned falling closed:
- **`events/mutateWorld.js :: changeRulingPower` is FIRST PAINT.** The chain is `main.jsx` → `store/index.js` → `store/settlementSlice.js` → `events/mutate.js` → `events/mutateWorld.js`. Its closure does not reach `seat/seatCircumstances.js` today. The brief forbids the import, so it is not wired.
- **`worldPulse/applyWorldPulse.js` is lazy, but it stands AT its size ceiling.** `scripts/.size-baseline.json` holds it at 907. That register is shrink-only and is raised only by a chair ruling. The wiring costs 3 counted lines, and `npm run lint` measured `max-lines` 910 > 907. I did not raise the register or squeeze lines to fit. The file is byte-identical to `9a05215bc`. **The lane's owner rules.** The wiring that was measured is:

  ```js
  const handed = liftOccupationAuthority(next, outcome.powerTransfer);
  // the transfer then takes `handed` and the option:
  seatCircumstances: () => seatCircumstancesOf(handed),
  ```

  It adds one import line. It adds no `powerTransfer on outcome` read.
- **Wired: `worldPulse/applyWorldPulseFactionRoster.js` (`government_change`).** The file is lazy: it is unpinned, not first paint and not engine-core. Its static closure already reached `seatCircumstances.js` through `factionCompetition` → … → `rulingPowerCoup.js`. The change is `seatCircumstances: () => seatCircumstancesOf(settlement)` plus the import.

Branch `lane/seat-2026-11-20-u5-cure`, cut from `9a05215bc`. Commits:
- `ccc91b645`: the code, the tests and the measure.
- `2f19d4eab`: the anchor cure.
- The commit carrying this report.

Nothing pushed. No pull request.

## (a) The homonym
`'retired'` → `'retiredEdge'` in:
- `holderOfSeat.js`: the `TransferSentence` typedef, the list's row and the comments;
- `seatTransfer.test.js` and `holderOfSeat.test.js`;
- per SEAT-6's addition, `u5/measure-u5.mjs` (the code and the printed label).

The walker is untouched, and A3's pin does not move.

The regenerated `u5-transfer.{md,json}` equal the base run except for `seconds` (371 → 532) and the label:
- LAW kept 36 / 88;
- R1 names more than one taker in 0 towns;
- retired edges 1008 / 1020, all in the `'retiredEdge'` wording;
- retired edges read as `'edge'`: 0;
- the fail-closed rule fires in 0 / 0 towns, in both pools.

Not touched (outside the manifest): the comment in `rulingPower.js :: transferRulingPower` still names "`TRANSFER_WORDINGS`' `'retired'` row". It is a comment only, and it is stale.

## Red → green
| arm | red | green |
|---|---|---|
| walker A3 (`statusUnionTotality`) | 1 failed at `9a05215bc` | green |
| (10) `seatTransfer` class count | 1 (tests renamed first) | 2/2 |
| (11) `holderOfSeat` class counts | 1 | 51/51 |
| (11) U5-CURE, the wired roster path keeps Royal Authority | 1 at `9a05215bc` (fell to Grand Merchant Senate) | green; the 2 STOPPED paths are pinned falling closed |
| (12) the law dark: 3 paths, every cause, 22 rows | recorded at `9a05215bc` with no caller edited; green there | equal at tip; negative control: all law-on digests differ |

The final test file, run in a `git archive` tree of `9a05215bc`, gives 2 failed / 37 passed: (10) and (11) fail, and (12) is green. At the tip, `seatTransfer` is 39/39.

A note on (12): its two `rosterChange` rows were re-recorded in the base tree. The roster fixture's summary aligned with a state-prose wording (`proseDrawnAnchors`, DS-FTH-3), so I changed it, which changed those two digests. The other 20 rows read equal there.

## Gates (every run to a file)
- Every test file naming the three callers: 62/62 files; 977 passed, 32 skipped.
- `layerBoundaries` and `engineCoreLazyEdge`: green.
- `typecheck:ratchet` 167/167; `typecheck:domain:strict` 1113/1113.
- `lint`: 0 errors. There are 38 warnings, none in these files.
- `check:observed-shape-readers`: 2214, exactly the frozen inventory.
- **`tests/lint` whole at `2f19d4eab`: 2 failed / 3269 passed.**
  - The lighting census, 3709 → 3710: the one new file is U5's `seatTransfer.test.js`, inherited. U5-CURE adds no file.
  - `tuningRegister`: the dependents moved (below).
  - The wiring-census arms and `writerReach` are green.
- **`confine-two.sh 9a05215bc 2f19d4eab`: EQUAL.** Base and tip are both `all 36ee5bb0bea0bb3fcc6bd83f1e9e732b4dc643f09e0844545c64785798d8ce89 1245`.

## Registers that move (named, not re-recorded)
- `tests/lint/.tuning-inventory.json` `src/domain/seat/seatCircumstances.js#SEAT_CIRCUMSTANCE_TUNING`:
  - dependents go from `[rulingPowerCoup.js, worldPulse/stressorDynamics.js]` to those two plus `worldPulse/applyWorldPulseFactionRoster.js`;
  - `namedDependents` are unmoved.
- `scripts/.observed-shape-readers-baseline.json` manifest, row `applyWorldPulseFactionRoster.js`: sha `015348ab…` (9148 B) → `e6652f4a…` (9402 B). The finding inventory is unmoved.

## Size (fresh `build` and `verify:dist` at the base archive tree and at the tip)
| | base | tip | delta |
|---|---|---|---|
| first paint, raw | 1,179,486 | 1,179,623 | +137 |
| first paint, gzip | 375,386 | 375,456 | +70 |
| first paint, Brotli | 315,266 | 315,367 | +101 |
| worker | 2,598,229 | 2,598,233 | +4 |
| engine chunk | 910,877 | 910,877 | 0 |

- The same 13 build rows fail at base and at tip.
- No ceiling was re-recorded.
- The roster module stays in the `applyWorldPulse` chunk (+37 B).
- `engine-core` (+137) and `coherence-lazy` (+2,025) each gained one export. The cause of the re-partition was not traced further, so it is PLAUSIBLE, not CONFIRMED.

**CONFIRMED vs PLAUSIBLE.**
- CONFIRMED by executed tests, the base-tree runs, the measure and the builds: the rename, the roster path's kept form, dark byte-identity on all three paths, both stops, EQUAL confinement, and the figures above.
- PLAUSIBLE: the cause of the first-paint +137 B.
