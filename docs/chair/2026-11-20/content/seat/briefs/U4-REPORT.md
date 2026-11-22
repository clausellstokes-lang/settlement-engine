# U4-REPORT: THE CONTEST (CS3, CS4, CS5, DARK). Builder B4 to SEAT-3. STATUS: BUILT, two reds left for a ruling (files outside my manifest; see the end)

Branch `lane/seat-2026-11-20-u4`, cut from `d61c05637`. Commits: `28d85cbd5` (the unit), `7506bd780` (the tuning
inventory by its ritual), `5d1107c65` (acceptance script, output, report UNFINISHED on SEAT-3's order), `271aab955`
(cure: loops for `test.each`), and this report's final commit. Nothing pushed.

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
arms, (7) shipped-table and old-law controls, (8) dark, (9) five old-law pins). GREEN after: 43 passed (43); after the
each-cure (`271aab955`, the 16 + 4 table rows loop inside two tests, every assertion kept): 25 passed (25).

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
     EACH-FAMILY park debt 106 -> 107 = my test file's `test.each`: CURED at `271aab955` (arm 1 passed).
  3. `arcaneClassifierCensus.walker` x2: the LINE-keyed row `src/domain/worldPulse/stressorDynamics.js:53` moved to
     `:55` by my two imports above it (pattern byte-identical). A register I move; not re-pointed (not my file).
  4. `factLayers.walker` x1: leaf `powersList` (`powerStrata.js :: derivePowerStrata`) now touches `config` and
     `_config` (the seat-law read) beside its declared `powerStructure`; no layer violation. Cure is one line in
     `src/domain/facts/factLayers.js :: LEAVES.powersList` reads, a file OUTSIDE my manifest: NEEDS A RULING.
  5. `writerReach.walker` x1 (round-trip): `fear on candidates` GAINS `campaign-pdf` and `world-book` reach (frozen
     `dossier-pdf=N foundry=N web-display=N web-transitive=N`, tip adds `campaign-pdf=N` and `world-book=N`). The edge,
     CONFIRMED by the walker's own `surfaceClosures` at base and tip: `rulingPowerCoup.js -> seat/holderOfSeat.js` (the
     import the dispatch mandates) brings `people/cardVeil.js` and through it `spatial/cohesionWeave.js` (an `N` reader
     of the identity) into campaign-pdf (209 -> 218 files) and world-book (224 -> 233); dossier-pdf 611 -> 616, foundry
     507 -> 512, web-transitive 1075 -> 1078 (holderOfSeat, seatCircumstances, seatLaw, cultureOfficeTitles,
     officeTitles, informationBrokerageTuning, contentFingerprint). Only additions. The baseline row
     (`scripts/.writer-reach-baseline.json`) is never re-recorded by me: NEEDS SEAT-3's re-take or a ruling.

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

## Confinement, size, call sites
- `confine-two.sh d61c05637 271aab955`: base `all 36ee5bb0bea0bb3fcc6bd83f1e9e732b4dc643f09e0844545c64785798d8ce89 1245`,
  tip `all 36ee5bb0bea0bb3fcc6bd83f1e9e732b4dc643f09e0844545c64785798d8ce89 1245`: EQUAL (the reference hash). Dark, zero
  movement. Later commits on the branch are docs only.
- Size: no touched file is in the first-paint closure (`rulingPowerCoup.js` and the new leaf are pinned
  coherence-lazy); fresh `npm run build` at the tip: `vendorPdfLazy` and `engineChunkLazy` green. Worker bundle (the
  known red) 2,596,960 B against the stated base 2,585,176 B: **+11,784 B** from U4 (holderOfSeat's closure and the
  new leaf reach the worker through `factionStanding.js -> rulingPowerCoup.js`). No ceiling re-recorded. Base figure
  taken from the dispatch, not rebuilt here (PLAUSIBLE).
- Call sites: the brief says twelve; `src/` holds ELEVEN code call sites of `coupContenders` (EngineSections.jsx,
  powerDeskRead.js, factionStanding.js, castPowers.js, powerStrata.js, rulingPowerCoup.js :: resolveCoupVerdict,
  convergence.js, irregularForce.js, stressorDynamics.js, stressorGates.js, printProse.js). Only factionStanding.js
  hands a partial settlement; the other ten hand a whole record (READ at the call site, not executed per site).

## What I did NOT do, and what needs a ruling
1. `src/domain/facts/factLayers.js :: LEAVES.powersList` reads should gain `config` and `_config` (the one-line cure of
   the factLayers red). Outside my manifest: not edited.
2. `scripts/.writer-reach-baseline.json` row `fear on candidates` (the mandated holderOf import widens two PDF
   closures): not re-recorded.
3. The birth callers `rulingStructure.js :: generatePowerStructure` and `rosterText.js :: settleStandingToRoster` hand
   no `config` to annotateFactionStanding, so at birth the partial call reads the old law until they do (outside my
   manifest; matters only once the law is lit).
4. `COUP_VARIANT_BY_ARCHETYPE` table unchanged; the craft read is mapped behind the dial (ruled). The arcane census row
   `stressorDynamics.js:53 -> :55` and the two census arms are left for SEAT-3's re-take.
5. Security note (PLAUSIBLE): the engine reads the holder with the OWNER audience; on a served document a hidden R2 head
   is absent, so the page's own holder read could fall to R3 and name an open power; no hidden fact is exposed by it.

CONFIRMED: every figure above was executed here (arms, gates, census attributions by execution, closures, confinement,
acceptance, worker bytes). PLAUSIBLE: the castPowers path of the forced-birth movement, the worker base figure, the ten
whole-record call sites.
