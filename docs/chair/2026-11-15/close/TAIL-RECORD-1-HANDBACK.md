# TAIL-RECORD-1 · the hand-back (two record cures, RECORD-MEASURE-3 rows 1e and 4)

Base: `2ff8ab7ee` (lane/join-2026-11-14). Branch: `lane/tail-record-2026-11-15`. Instruments: RECORD-MEASURE-1's
`births-only.sh` and `fielddiff.mjs`, CENSUS-3's `births.mjs` over its 720 seeds, RECORD-MEASURE-3's `row1.cjs` and
`row4.mjs`, all git-archived outside every tree. Every run went to a file in the seat's scratch tree.

## CURE R1 · c1b · THE ECONOMIC RATING IS CAPPED BY THE PROSPERITY WORD, IN THE RECORD

**What a reader sees change.** A Poor or Struggling town no longer reads "Economic Survival: STRONG" (and its "money in
hand" sentence) beside its prosperity word: its bar stops at 64, "Adequate". Its guard line's purse word follows.

- Before (r2r-town-11, Poor): Economic Survival 72, STRONG. After: 64, ADEQUATE.
- Before (r2r-city-19, Poor), the guard line: "Hired swords back the garrison." After: "Hired swords back the garrison
  when the purse allows."

**The rule and its home.** `src/generators/defenseGenerator.js :: generateDefenseProfile`: where the printed prosperity
ranks Subsistence, Struggling or Poor on the canonical ladder (`data/constants.js :: prosperityRank`, never a hand-typed
match), `scores.economic` is held at `SCORE_BAND_CUTS.strong - 1` (the cut read from its own constant). The readiness and
the parts read the arithmetic, not this whole-point score: they do not move.

**The count (the 720, base against the cure).**

| | the report's | measured |
|---|---|---|
| towns moved | 55 | **55** (exactly the 55 of the class; none outside it) |
| `defenseProfile.scores.economic` | 55 | **55** |
| `economicState.safetyProfile.guardEffectivenessDesc` | 30 | **30** |
| `activeConditions` | 17 | **17** |
| families | 3 | **3** |
| row 1e (`row1.cjs` econStrongPoor) | 55 → 0 | **55 → 0** |

**The law test.** `tests/generators/economicRatingCappedByProsperity.test.js`: 28 census births (four of each tier, four
witnesses of the 55); each witness proves itself by its uncapped arithmetic (`defenceExactOf`) reaching the cut; the
negative is anchored (`expectAbsentWithAnchor`, the anchor the cap's own landing band, computed); the seed loops through
`collectSeedFailures`. Red with the cure reverted (the base tree: 2 of 4 tests red, 4 of 4 witnesses and 4 of 28 draws
named), green with it.

**The pins re-keyed (one file, 4 rows).** `tests/domain/corpusCureGuards.test.js`, DS-DEF-2 "Economic Survival: STRONG"
v9 at w5-metropolis-occupied-2, v3 at w5-town-occupied-3, v12 at w5-city-occupied-101, v9 at w5-city-under_siege-103: each
town is occupied or Struggling, so under the cure it no longer reads the pool. No town can: every occupied town of the
census is Poor (12 of 12) and no Poor or Struggling town is STRONG (a scan of 130 occupied w5 towns: none reads the
pool). Each row is re-keyed by identity to `by: 'record'` at its own town (the file's own precedent, the chair's C27):
the line's cure is read on the town's record, a sibling admitted. 118 of 118 green.

**The costs.** 196 test files (every file naming `defenseGenerator`, every file naming one of the 55 seeds, every golden
file), base and cure, JSON reports diffed: 18 red at the base (named below, not this seat's); the cure adds exactly the 4
pins above, re-keyed in the commit. The three fast gates exit 0 (type ratchet 167 of 167, strict domain, eslint on the
touched files); `presumed-things-door --check` identical to the base (fresh 149, red at the base: no rise); the
twelve-birth grid 2 falls at the base, 2 at the cure (the same two towns: r2r-city-0 P7a, r2s-insurgency-metropolis-0 P7a).

**For the doors' seat: the goldens and stored counts this cure moves (NOT re-taken here).**
- `tests/fixtures/generator-golden-master.json` (read by `tests/property/generatorGoldenMaster.test.js` and
  `tests/property/dmLayerGoldenIsolation.test.js`): 23 of the 525 rows move (the list:
  `TAIL-RECORD-1-golden-rows.txt`, section R1). The golden is already stale at the base (all 525 drift).
- `tests/property/espionageDormancyFence.test.js` THE DRIVEN GOLDEN (360 settlements): red at the base (`00b8e84b…`), the
  cure moves it again (`2273a3c4…`).
- The tuning register's inventory (`tests/lint/tuningRegister.walker.test.js`, "the measured tree matches the committed
  inventory exactly": red at the base with 4 entries): the cure adds a fifth, `src/data/constants.js#METROPOLIS_ROLL_TUNING:
  dependents moved` (+ `src/generators/defenseGenerator.js`, which now imports `prosperityRank` from that file: the
  ladder read from its one home, as that file's own comment requires). No value moved; a refreeze is the register's seat's.

**To veto.** Revert the R1 commit: the 55 towns' Economic Survival scores, 30 guard lines and 17 towns' conditions return
to the base figures, and the four guard rows return to the draw.

## CURE R4 · c4a · THE MAGIC SHARE IS ROUNDED AT ITS SOURCE

**What a reader sees change.** Four thorps under a crisis (r2s-occupied-thorp-0, r2s-occupied-thorp-2,
r2s-indebted-thorp-2, r2s-insurgency-thorp-2) no longer hold a food record with 1 % of their food "provided by spell or by
prayer" (the Economics tab's DS-ECO-9 "HOW THE NEED IS MET: part of it by magic") beside "Reliance on magic: None".

- Before (r2s-occupied-thorp-0, a 31 lb need, 0 lb published by magic): the record's magic share 1 %, and the line drawn.
  After: 0 %, and the line is not raised (its key reads the share).
- Elsewhere the share is now the share of the pounds the food card prints: 18 towns move by the rounding of the pound
  (17 by one point; one, r2s-under_siege-thorp-2, a 12 lb need with 3 lb by magic, from 28 % to 25 %, which is 3 of 12).

**The rule and its home.** `src/generators/foodGenerator.js :: generateFoodSecurity`: the food record is handed
`Math.round(magicOffset)`, the pounds this writer publishes (as the gap's share already is). Nothing else moves: the
food band and the gap (`deficitPct`) are unchanged.

**The count (the 720, the R1 tip against the cure).**

| | the report's | measured |
|---|---|---|
| towns moved | 22 | **22** |
| `economicState.foodSecurity.foodRecord.magicPct` | 22 (the 4 to nought, 18 by a rounding point) | **22** (the 4 to nought; 18 by the rounding, one of them by 3 points, said above) |
| families | 1 | **1** |
| row 4 (`row4.mjs` relNone) | 4 → 0 | **4 → 0** |

The corpus born from the committed shape is byte-identical to the measured patch's (0 towns differ).

**The law test.** `tests/generators/foodMagicShareOfPublishedPounds.test.js`: 20 census births (every thorp of the three
crises the four came from, six plain thorps, two anchors whose magic is relied upon); each witness proves itself (the
divine provision's path stands in its own land, `foodLandOf`); the negative is anchored (`expectAbsentWithAnchor` on the
towns holding a share, the anchor a relied-upon thorp, computed); seed loops through `collectSeedFailures`. Red with the
cure reverted (2 of 2 tests; the 4 witnesses named), green with it.

**The pins re-keyed.** None: 143 test files (every file naming `foodGenerator`, every file naming one of the 22 seeds,
every golden file), the R1 tip and the cure, JSON reports diffed: the same 12 red before and after, no failure message
changed.

**The gates.** The three fast gates exit 0 (type ratchet 167 of 167, strict domain, eslint on the touched files);
`presumed-things-door --check` identical to the base (fresh 149); the twelve-birth grid 2 falls with both cures (the same
two as the base); the tuning register: no entry added.

**For the doors' seat.** No golden-master row moves (0 of 525: the 525 configs hold no town whose magic pounds round
across a share). No stored count moves.

**To veto.** Revert the R4 commit: the 22 towns' magic shares return to the share of the unrounded pounds, and the four
thorps' 1 % with them.

## Red at the base (named, not this seat's)

18 tests in the cost list are red at `2ff8ab7ee` before any cure: `tests/data/dossierStateProseProjection.contract.test.js`
(2), `tests/domain/corpusEcoTailGuards.test.js` (3), `tests/generators/urbanBandInstitutions.test.js` (1),
`tests/lint/proseComposed.walker.test.js` (2), `tests/lint/proseWiringCensus.walker.test.js` (5),
`tests/pdf/goldenViewModel.test.js` (1), `tests/property/dmLayerGoldenIsolation.test.js` (1),
`tests/property/espionageDormancyFence.test.js` (1), `tests/property/generatorGoldenMaster.test.js` (1),
`tests/property/heraldKnowledgeDeskGolden.test.js` (1).
Outside R1's list and inside R4's, red at `2ff8ab7ee` too: `tests/lint/tuningRegister.walker.test.js` (3; one of them
gains R1's entry, listed above) and `tests/domain/worldFactRederive.test.js` (1, the same message).

## The tip

R1 `b8a82cf4f`; R4 the commit after it. Both cures pushed to `lane/tail-record-2026-11-15`, each its own commit.
