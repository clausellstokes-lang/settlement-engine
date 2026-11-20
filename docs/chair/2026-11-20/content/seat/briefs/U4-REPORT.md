# U4-REPORT: THE CONTEST (CS3, CS4, CS5, DARK). Builder B4 to SEAT-3. STATUS: UNFINISHED (see "What is left")

Branch `lane/seat-2026-11-20-u4`, cut from `d61c05637`. Commits: `28d85cbd5` (the unit), `7506bd780` (the tuning
inventory by its ritual), and this report's commit (the acceptance script, its output, this file). Nothing pushed.

## What was built
- `src/domain/rulingPowerCoup.js :: coupContenders`: under the seat law (`seatLaw.js :: seatsByHolder`) the holder
  (`holderOfSeat.js :: holderOf`, owner audience) leaves the challengers; the next heaviest takes its place; the office
  row stays the incumbent with its own power figure; no share moves; `COUP_COERCION` untouched. The one dial
  `seatCircumstances.js :: SEAT_CONTEST_LIT` (false) lights `seatTable.js :: contestKindOf` and the CS5 factors
  together. Old law byte-identical (arm 9 pins the base's own JSON).
- NEW `src/domain/seat/seatCircumstances.js`: CS5's eight reads (the proposal's fields, open rows only, no infiltrated
  stress, no veiled row); `SEAT_CIRCUMSTANCE_TUNING` registered DRAFT (`factors` every 1, `productCeiling` 1.6, `cuts`
  0.8 / 25 / 70), the proposed figures beside each leaf and in the register note.
- `factionStanding.js :: annotateFactionStanding`: the partial call hands `seat.config`, else the old law (fail closed).
- `stressorDynamics.js`: RULINGS (9) 4, lit under the law a craft contender reads `merchant_cabal`; dark unchanged.
- `vite.config.js :: FIRSTPAINT2_LAZY_DOMAIN` pins `seat/seatCircumstances.js` (the CURE).

## Red -> green (tests/domain/seat/seatContest.test.js)
RED before the code: 30 failed | 13 passed (43); the 13 are preconditions and controls (holder reads, without-law
arms, (7) shipped-table and old-law controls, (8) dark, (9) five old-law pins). GREEN after: 43 passed (43).

## Gates (each through scripts/gate-tail.sh, read by count lines)
- Every test naming a changed module + layerBoundaries + engineCoreLazyEdge + densityCreateBoundary.walker (46 files,
  no tests/build): 942 passed | 5 failed, every one named below.
- typecheck:ratchet 167 / 167 exit 0; typecheck:domain:strict 1113 / 1113 exit 0; raw tsc on both configs: no
  diagnostic in a touched file. lint exit 0 (0 errors; 38 warnings, none in touched files).
- tuningRegister.walker after the refreeze: 76 passed (76).
- `tests/lint` WHOLE at `7506bd780`: 215 files passed, 5 failed; tests 3262 passed | 9 failed:
  1. `proseWiringCensus.walker` x3 (census arms): stamp producer index 1438 -> 1439 = my new
     `src/domain/seat/seatCircumstances.js` (CONFIRMED by count); ALIAS DRAFT candidate rows 24 -> 25 = the
     factionStanding.js `seat.config` read (CONFIRMED by execution: with that file at base the arm reads 24).
  2. `sovereigntyLightingContract.walker` x2: census file count 3708 -> 3709 (my new test file); and the
     EACH-FAMILY park debt 106 -> 107 = my test file's `test.each` (MINE, to cure: loops in place of `each`).
  3. `arcaneClassifierCensus.walker` x2: the LINE-keyed row `src/domain/worldPulse/stressorDynamics.js:53` moved to
     `:55` by my two imports above it (pattern byte-identical). A register I move; not re-pointed (not my file).
  4. `factLayers.walker` x1: leaf `powersList` (`powerStrata.js :: derivePowerStrata`) now touches `config` and
     `_config` (the seat-law read) beside its declared `powerStructure`; no layer violation. Cure is one line in
     `src/domain/facts/factLayers.js :: LEAVES.powersList` reads, a file OUTSIDE my manifest: NEEDS A RULING.
  5. `writerReach.walker` x1 (round-trip): `fear on candidates` GAINS `campaign-pdf` and `world-book` reach (frozen
     `dossier-pdf=N foundry=N web-display=N web-transitive=N`, tip adds `campaign-pdf=N` and `world-book=N`): my new
     import edges widen those two PDF closures. `scripts/.writer-reach-baseline.json` is never re-recorded by me.
     Under attribution (which edge) when this was written. NEEDS A RULING.

## Acceptance (one command, both pools, under today's standing)
`node docs/chair/2026-11-20/content/seat/u4/measure-u4.mjs --force-law _seatLawVersion=2` (570 s), output
`u4/u4-contest.md`. LAW (dial dark) and FORCED equal the proposal's CS3 column in EVERY kind on both pools
(default craft 2 -> 37, noble 98 -> 115, merchant 450 -> 145, no-contender 240 -> 269; presets craft 147 -> 191,
noble 220 -> 158, merchant 345 -> 209, no-contender 293 -> 313), the ladder equal too, every circumstance count equal
to section (5), 0 towns differ from SEAT-1's draft CS3 field. Findings: (a) `criminal` column default present 28 vs 26,
contends 2 vs 0: two hidden "The Independent Bloc" rows (seat-measure-hamlet-58, -98) read criminal by U2's
`contestKindOf` veil step where the draft read `other` (U2's reader, not U4). (b) births forced under the law move in
2/900 and 2/960 towns (conflicts, cast, relationships; at the base forced births equal dark births): the contest is
read at birth by `castPowers.js :: contendersOf` on the whole settlement (PLAUSIBLE path). Dark: nothing moves.
`--force-law` sets the key on the config `birthConfig` returns (birthConfig clamps an incoming marker by design).

## What is left (UNFINISHED)
1. Cure the each-family park (loops for `test.each` in my test), commit.
2. Name the writerReach edge; the confinement `confine-two.sh d61c05637 <tip>`; the tip build for the worker delta
   against 2,585,176 B; the brief's "twelve" call sites: eleven found in `src/` (the craft variant arm is (8)).
3. Rulings needed: factLayers `powersList` declaration; writerReach baseline row; the birth callers
   `rulingStructure.js :: generatePowerStructure` and `rosterText.js :: settleStandingToRoster` hand no `config`
   to annotateFactionStanding, so the partial call reads the old law at birth until they do (outside my manifest).
