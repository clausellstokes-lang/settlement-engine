# RECORD-MEASURE-3 · the ratings against the state words, the shadow economy's figure, two food ledgers (and after)

The method is RECORD-MEASURE-1's (its brief's steps 2 to 4), unchanged. **Base measured: `c8116d79` (lane/join-2026-11-14,
"docs(JOIN-8): the hand-back after point 8").** The 720 are the census's seeds (CENSUS-3 `seeds.txt`); the BEFORE run is
`census3.sh` at the base (corpus and 720 dumps); each candidate is `births-only.sh` in its own scratch tree, then
`fielddiff.mjs` against the BEFORE corpus. The page column is `pageprint3.mjs` on the BEFORE dumps (tabs only: Summary,
Systems, World, Table). Nothing here is committed under `src/` or `tests/`; the patches below each `git apply` at `c8116d79`.

## THE TABLE

| row | class | predicate (on the record) | towns of 720 | the maker | what the page prints | candidates, measured | recommendation; what it loses |
|---|---|---|---|---|---|---|---|
| 1e | Economic Survival STRONG beside Poor / Struggling | `scoreBand(defenseProfile.scores.economic) === 'STRONG'` and `economicState.prosperity` ∈ {Poor, Struggling} | **55** (town 13, city 24, metropolis 18; of the 368 Poor or Struggling) | `defenseGenerator.js :: computeDefenseScores` (the `sup` dims: stores, market, hospital, purse, food chain) banded by `defenseScoreBands.js :: scoreBand` | 55 print the prosperity word with Overview "Economic Resilience · Strong"; 44 also print the Defense row's STRONG sentence ("money in hand", "money laid by") | **c1b** (the rating capped by the word, in the record): 55 → **0**; field diff 55 towns, 3 families: `defenseProfile.scores.economic` 55, `economicState.safetyProfile.guardEffectivenessDesc` 30, `activeConditions` 17. Readiness does not move (it reads the parts). **c1a** (label only, described, not patched): the same 55 → 0 with no record move | **c1b**; it loses nothing true: the bar of a Poor town with six months' stores drops from 65–74 to 64 (Adequate), its guard line's purse word reads Moderate, not Prosperous |
| 1m | Invasion & War STRONG beside readiness Vulnerable | `scoreBand(scores.military) === 'STRONG'` and `readiness.label` ∈ {Vulnerable, Undefended} | **9** (hamlets and villages; every one walls + militia) | the same function: `mil` (walls, militia, will, terrain) vs the readiness (the five scores' sum over n, the size and the danger) | 4 print "would see off a raid" with "Vulnerable" on the Defense tab | none tried: the two words grade two facts (one front; the whole) and the record bears both | **no record cure**; a page matter (the readiness is the whole town's) |
| 1p | the power card's strength chip | a faction not governing whose `powerLabel` ranks above the governing faction's | **156** (e.g. "Occupation Authority · Dominant" over "*Elder Council · Strong"); and **495** towns hold a chip off the documented ladder (`factionDynamics.js :: powerLabelOf`: 43 labelled Strong where the ladder says Dominant) | `factionDynamics.js` (the renormalised share) | not measured by sentence | none tried | **open**: the readers' sentence is needed to say which half is false; recorded for a later seat |
| 2a | a capture printed where no criminal income stands | `safetyProfile.blackMarketCapture >= 3` (the tab's floor, `shadowEconomyShown.js`) and no `incomeSources[].isCriminal` | **240** of the 476 that print it (thorp 44, hamlet 47, village 62, town 30, city 28, metropolis 29; 169 with no criminal house either) | capture: `safetyProfile.js :: generateSafetyProfile` (`(criminalEffective − 25)/3` + the crisis bonus × the tier's scale); the income row: `economicState.js` pushes it only where the capture is **above 10** | 240 print "Shadow Economy: N% capture" on Economics with no criminal row among the Income Sources | **c2b** (the source written wherever the capture is printed, at ≥ 3; carries c2a): 240 → **0** and 2b → 0; field diff **469** towns, 17 families: `incomeSources` 469, `economicComplexity` 50, and in **2** towns the cascade (prosperity, standing, food security, factions, legitimacy, founding, scores) | **c2a alone, and the 240 left to the page** (see 2b); c2b writes "Black Market Revenue: 4%" into harvest-only thorps and moves two towns' prosperity |
| 2b | two figures for one shadow economy | a criminal income row stands and its `percentage` ≠ `blackMarketCapture` | **228** of 236 (capture minus the row's share: −22 to +30, median +7) | the row is pushed with the capture as its weight (the code's comment: "so normalized % matches Shadow Economy section") and then normalised TWICE with every other row: `economicState.js` stage 3 and `incomeLineSiblings.js :: keepRowsThePageBearsOut` | 199 print both figures on Economics ("Shadow Economy: 33% capture" above a criminal row of 19%) | **c2a** (one figure: the criminal row held at the capture in both normalisers, the lawful rows share the rest): 228 → **0**; field diff **229** towns, 2 families: `economicState.incomeSources` 229, `economicState.economicComplexity` 35. Prosperity does not move | **c2a**; it loses the lawful rows' old shares (each lawful row shrinks or grows by a few points so the criminal row reads the capture) |
| 3 | two food ledgers | the tab's shortfall (`foodRowShown.js`: need − grown − imported − magic, where the writer has a gap) ≠ `economicViability.metrics.foodBalance.deficit` | **221** (imports differ in 211, by up to 2,011 lb/day; magic in 76) | the writer `foodGenerator.js :: generateFoodSecurity`; the view `foodBalance.js` (its canonical arm) **rebuilds** the pounds from the rounded `deficitPct` × need and splits the coverage by the writer's proportions | 18 print both ("cannot cover ~6640 lbs … (32%)" in Viability / Overview beside "Short: 6,742 lbs/day" in Economics); 19 records carry the differing pounds in their verdict text | **c3a** (one writer, the view a reading: where the writer publishes its split the view reads its imports and magic and its shortfall is the tab's remainder): 221 → **0**, imports 211 → **0**; field diff **226** towns, 7 families, all **readers of the view**: `economicViability.metrics.foodBalance` 226, `.summary` 23, `.issues` 22, `.dependencies` 15, `.plotHooks` 10, `history.currentTensions` 9, `history.siegeNarrative` 1. `economicViability.viable` does not move; the stores do not move | **c3a**; it loses nothing the page bears: a persisted record without the writer's split keeps the old reconstruction |

Costs elsewhere (pins, goldens) for each candidate: see **COSTS** below (named, never re-taken).

## ROW 1 · THE RATINGS AGAINST THE STATE WORDS

**What makes the rating.** `computeDefenseScores` builds the five scores from parts. The Economic Survival score (`sup`,
stored as `scores.economic`) is: the **stores** (months laid by, `storesPointsOf`: up to 70 points, ~45 at six months),
the market and the hospital (10 each at the funded gate), the **purse** (20 × the standing label's `keep.bought`: 11 in a
Poor town, 8 in a Struggling one), and the food chain (±). It reads prosperity only through the purse's 20. So a Poor
city with a granary and six months laid by scores 65–74: **STRONG**. `scoreBand` cuts it at 65.

**What the word reads.** "Poor" / "Struggling" is `economicState.prosperity` (`prosperity.js :: computeBaseProsperity`
then `deriveProsperityLabels`), printed on the Overview and the Economics tab. The rating's own readers then speak of
money: the DS-DEF-2 STRONG pool ("{settlement}'s accounts have money in hand", "money laid by before this trouble"), and
`assembleSettlement.js :: withGuardPaidFromDefence` hands the band to the guard line as its purse word
(`safetyProfile.js :: purseWordOfBand`: STRONG → "Prosperous"; COHERENCE-UPKEEP-6, ruling A). In the reader's words: the
row counts the food in the granary and calls it money.

**The class.** 55 of 720 (none below a town: a small place's stores do not reach 65). All 55 print the prosperity word with
"Economic Resilience · Strong" on the Overview; 44 also print the Defense row's money sentence.

**The candidates.** (c1b, patched) the rating capped by the word, in the record: where the printed prosperity is Poor,
Struggling or Subsistence, `scores.economic` is held at 64 (`SCORE_BAND_CUTS.strong − 1`). It moves the score field and
its readers only (the guard line's purse word in 30 towns; 17 towns' `activeConditions`, which carry a reading of the
defence profile); the readiness, the parts and every other score do not move. (c1a, described) the same cap applied to the
band word alone, at every reader of the economic band (`DefenseTab.jsx` threat row and Economic Backing,
`OverviewTab.jsx` Systems Health, `economicSurvivalBandOf` for the purse word and the DS-DEF-2 key, the PDF's defence
slice): it **moves the label only** (no record field), the bar stays 65–74 under an "Adequate" word. **Recommendation:
c1b**: one home (the record) and every reader follows; c1a leaves a bar past the Strong cut under a word that is not, and
must be threaded through five readers. Neither is "the rating and the word read one home" in full (that is the purse made
of prosperity, which would move every Poor town's readiness): it is not tried, as a re-weighting of a ruled design.

**Invasion & War.** 9 towns, every one a hamlet or village with walls and a militia: Strong against a raid, Vulnerable as
a whole (its monsters, its order and its supply low). Both are so. Not a record class; if the reader is misled it is the
page's (the readiness badge does not say it is the whole). **The power chip.** Measured only as a shape (156 towns where
a non-governing faction's chip outranks the ruler's; 495 with a chip off `powerLabelOf`'s ladder); no reader's sentence
was given to say which word is false, so no candidate.

## ROW 2 · THE SHADOW ECONOMY'S FIGURE

**Where each figure is made.** The capture: `generateSafetyProfile`, `round(max(0, (criminalEffective − 25) / 3))` plus the
crisis bonus (siege 20, insurgency 18, revolt 22 …) scaled by the tier (thorp 0.1 … city 1.0), at most 80. Printed by the
Economics tab where it is 3 or more (`shadowEconomyShown.js :: SHADOW_CAPTURE_FLOOR`). The income row: `economicState.js`
pushes a criminal row only where the capture is **above 10**, with the capture as its weight; then stage 3 normalises all
rows by weight, and `incomeLineSiblings.js :: keepRowsThePageBearsOut` normalises them again when it drops a row the page
does not bear out. The code's own comment says the weight was chosen "so normalized % matches Shadow Economy section"; two
normalisations make it match in 8 towns of 236.

**What they count, in the reader's words.** The capture is the share of the town's dealing that goes on off the books; the
row is the criminals' take as a share of the town's income. The design meant them to be one figure; the page prints them
as two ("33% capture" over a row of 19%). And a capture of 3 to 10 has no row at all: a besieged hamlet whose income is
harvest alone prints "5% capture" (base 1 + the siege's 20 × 0.2).

**The candidates.** (c2a, patched) one figure: in both normalisers the criminal row is held at its capture and the lawful
rows share the rest in their own proportions (rounding's residue to the largest lawful row). 2b: 228 → 0; 229 towns move,
`incomeSources` and `economicComplexity` only; prosperity does not move. (c2b, patched, carries c2a) the source wherever
the capture is printed (the push at ≥ 3): 2a 240 → 0, but 469 towns move, two of them through prosperity and on (founding,
factions, defence scores), and a harvest-only thorp gains "Black Market Revenue: 4%" with "Untaxed trade, fencing and
theft bring money in here". **Recommendation: c2a**, and for 2a the page's floor (the Shadow Economy block printed only
where its row stands, `SHADOW_CAPTURE_FLOOR` to 11: label only, no record move; it loses the block and its drag line in
the 240, of which 169 have no criminal house at all). What c2a loses: each lawful row's share moves by a few points.

## ROW 3 · TWO FOOD LEDGERS

**Why there are two.** `generateFoodSecurity` (`economicState.foodSecurity`) is the single writer (generators-domain-4);
`economicViability.metrics.foodBalance` is its view, persisted. The view's canonical arm reads the writer's production and
need but **rebuilds** the shortfall from the writer's ROUNDED `deficitPct` × need (LANDING-7 lane H: "the two fields every
persisted record carries"), and splits the coverage by the writer's import/magic proportions. A whole per cent of a
20,000 lb need is 200 lb, so a city's shortfall moves by up to a hundred pounds and a metropolis's by up to 2,000.

**What each feeds.** The writer: the Economics tab's bar and "Short:" (`foodRowShown.js`, which reads only the writer),
the food band, the prosperity modifier, the stores and the defence's stores part. The view: the viability verdicts'
sentences ("Settlement cannot cover ~N lbs of food per day (P% of needs)"), the viability summary, dependencies and plot
hooks, and the history's tensions that quote them. The verdict itself (`viable`) cuts on the per cent, which both share.

**The class.** 221 towns; 18 print both figures, differing ("cannot cover ~6640 lbs … (32%)" in Viability and Overview,
"Short: 6,742 lbs/day" in Economics). A smaller fault inside the writer itself: in 79 towns `rawDeficit` ≠ `deficit +
importCoverage + magicOffset` by a pound (its three are rounded apart); the tab's remainder absorbs it.

**The candidate.** (c3a, patched) one writer, the view a reading: where the writer publishes its split, the view takes its
imports and magic and its shortfall is need − grown − imported − magic where the writer has a gap (the tab's own figure),
its per cent derived from those pounds as before. 221 → 0, imports 211 → 0, magic 76 → 0. 226 towns move, every field a
reader of the view; `viable` and the stores do not move. **Recommendation: c3a.** It loses nothing the page bears.

## COSTS

(pending: the pins and goldens each candidate reds, named from a run of `tests/generators tests/domain tests/components
tests/ui tests/pdf tests/dossier tests/property tests/generation.test.js` in each candidate tree against the base.)
