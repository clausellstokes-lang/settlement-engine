# BAR5-FOOD · HAND-BACK

**STATUS: FINAL.** Base `600b7683a` (the joined line; its tip read back from origin at the start, unchanged). Branch
`lane/bar5-food-2026-11-16`: the audit branches merged first (`lane/bar5-audit-b-2026-11-16` at d40d6ab28, then
`lane/bar5-audit-a-2026-11-16` at c0ea05497, both `--no-ff`, helpers and documents only), then my commits. Rulings worked
to: BRIEF-BAR5 (Amendment L), BRIEF-BAR4's K3–K6 and amendments, BRIEF-BAR3's amendment 2, BRIEF-BAR2's method, and the
chair's FD1 (2026-11-16: the vocabulary's `food` reads the band the page prints).

## THE RULES

Counts are instances · towns, by the audit's runner (`runB.mjs`, `run-a.mjs`) over PAGE-COPY renders of each population at
600b7683a (before) and at my tip (after). "orig" = the audit's detector as merged; "mine" = the detector as I left it (the
changes are under "the detector's changes" below).

| rule | the two readings, and where | the one fact made | sixty before → after | 720 before → after | fresh 300 before → after | one change cured / line by line | named exclusions | guard and positive control | LAW 5 |
|---|---|---|---|---|---|---|---|---|---|
| `L3.failedFood` | the famine's failed source (`foodRecord.failedSource`, printed "✗ Failed this year · X" by `validationOnPage.js :: famineFailedResourceOf`) against the Resources tab's "Commodities available" (`resourceAnalysis.availableResources` read raw) and the Economics tab's "Produced locally" (`tradeListDisplay.js :: localProductionAsPrinted`) | `display/commoditiesShown.js`: the failed grounds through the chain leaf's own reading (`chainStateShown.js :: failedGroundsOf`) and the failed food's goods (`failedFoodGoodsOf`); the commodity chips carry `(failed)`; "Produced locally" leaves the failed food | 5 · 5 → 0 | 20 · 15 → 0 | 24 · 22 → 0 | all by the one fact (the list and the trade profile read one reading) | none | `tests/domain/bar5FoodFacts.test.js` (five read towns); positive control: the same towns with the list read raw | — |
| `L3.foodLineStopped` | the mark leaf's stop of the fish trade under a siege (`crisisStoppedRow.js :: rowStoppedBy`, its houses' GATES/GOODS) against the foodways line (`foodways.js :: foodwaysLineOf`), which read only the famine and a fished-out water | `facts/catchStopped.js :: catchStoppedBySiege` (eager-safe: the leaf is pinned lazy and the foodways line rides the engine core); `fedLineOf` strikes the catch as it does a fished-out water; the guard holds it EQUAL to the leaf's verdict on every house of the trade (720 of 720 agree at the base records) | 1 · 1 → 0 | 2 · 2 → 0 | 1 · 1 → 0 | all by the one fact | none | the same file (C17290's town); positive control: the record's stored line | — |
| `L3.foodModel` | the food ledger's sources (`foodBalance.js`/`foodLand.js`: grain only where grain fields lie) against the roster's live Farmland selling "Grain at harvest" | the wording made true, the ledger's figures not opened (the chair's standing ruling): `foodways.js :: farmedOneFrame`: "Its own fields give it grain" before a food line that names no grain beside a live farmland house (every frame of the line; not under a siege; not where the famine failed the grain) | orig 2 · 2, mine 4 · 4 → 0 | orig 13 · 13, mine 45 · 45 → 0 | orig 2 · 2, mine 15 · 15 → 0 | all by the one wording | none | the same file (C39597's town and three more); positive control: the stored line | `foodways.js` 1 → 0 (reviewed) |
| LAW 1 `1b-reassures/Pressured` (the food word) | the page's food word (`foodWordShown.js` → `tonightSheet.js :: foodBandOf`, "Pressured" over a daily gap) against the stored label (`economicState.foodSecurity.label`, the DS-ECO-9 rung's key) and the vocabulary's `food` dimension (the ledger's raw band, `famine.js`) | FD1: `facts/foodBandShown.js :: foodBandShownKey`, read by `foodBandOf`, by `famineOf` (`shownBand`; `band` kept raw for `starvingAllowed` and the gap grade) and so by the `food` dimension; the DS-ECO-9 rung keys on `foodWordShown` | 1 · 1 → 0 | 3 · 3 → 0 | 1 · 1 → 0 | the rung by the one fact; the FOOD SOURCES lens's v1 re-declared `food: ≥ secure` and given its twin v9 (line by line, the annex) | none | the three tests FD1 named, green; the guard's own arms | — |
| (e) DS-ECO-8 POOR v3 "old buildings patched" in a town the History calls newly built | — | NOT MADE (left, in order: the vocabulary holds no age atom; 1 town of the 720, 1 of the 300) | — | 1 · 1 → 1 · 1 | 1 · 1 → 1 · 1 | — | — | — | — |

**LAW 5 for my files** (the audit's inventory, run at 600b7683a and at my tip, `law5-inventory.mjs`): **12 → 7 of 29**
crisis-sensitive lines not declared for a crisis WITH my reviewed exclusions, **12 WITHOUT them** (the code files 5 → 1;
the economy desk's annex lines 7 → 6). The 14 rows are `docs/chair/2026-11-16/bar5/AUDIT/tables/B.law5.exclusions.FOOD.json`
(the chair's EX1: BAR5-WORLD's form, its reader at the join). The 7 and the 12 were measured with my own reader, a
`REVIEWED` block I had written in `law5-inventory.mjs` before EX1; that block is REVERTED (the file is the audit's again,
d40d6ab28), so the inventory on this branch reads 12 until WORLD's reader arrives. The rows: `foodways.js` (the herds' phrase, struck at print by `fedLineOf`), `foodBalance.js` (a
suggested fix; the minor-routes label, never chosen under a siege; the "no dependable trade route" deficit line; the cut
route's own hook), `incomeLineSiblings.js` (both coal lines, gated at `trueIncomeDesc`'s besieged arm), `prosperity.js`
(the siege's own lines and the isolated town's three), the annex (a lexicon false positive; the blockade's own line).
LEFT (7): `foodBalance.js:792` the Bandit Raids hook (a road and a deficit, no siege read; prints in 0 of the 720 and 0
of the 300 at the base); the annex's `ADEQUATE` "Caravans keep to their rounds", `SURPLUS × trade-dependent` "The roads
are busy. Caravans arrive thick", `SURPLUS × not trade-dependent` "Plenty passes here", `FOOD AND PROSPERITY: full stores`
"A lean month … full larders", and the supply-gap "Travellers stock up before they reach": each prints in 0 of the 1,020
towns; each wants `no crisis: under_siege` (the full larders `no crisis: famine` too) and, where that leaves its pool
mute, a twin.

## THE DETECTOR'S CHANGES (L3), and their effect on the controls

- `L3.failedFood` TIGHTENED: read item by item (a row's cells are joined by ` · `: one marked chip no longer marks its
  row's others), and `(failed)` is the failed food's own mark. At the base the counts are unchanged (20 · 15; 24 · 22).
- `L3.foodModel` WIDENED: every frame of the composer's line ("Its own food is …", "… anchor the table", "The table is
  …"), any source but grain (the merged rule read one index of the one-source frame and three sources); a line naming
  grain, the fields' grain or the holdings' table is not the fault. At the base: 13 → 45 in the 720, 2 → 15 in the 300.
- The controls (the sixty, at my tip): every STANDS control of L2 still found; of L3, C42011 and C42947 (failedFood),
  C17290 (foodLineStopped), C39597 (foodModel) are CURED and kept as the guard's positive controls (the base line on the
  same town fires); no EXPLAINED control found.

## HOW THE AFTER-RUN WAS MADE (said once)

The tip renders of the sixty and the 720 began before my last annex change (DS-ECO-9 v1/v9) and their render workers held
the old leaf; every town whose printed band is pressured or import-dependent (136, and the 85 whose printed band differs
from the raw one) was rendered again at the final tree and its dump replaced. The fresh 300 was rendered whole at it. Every
other rule of the audit's two runners reads the same at base and tip in all three populations. NOT RUN: `npm run build` and
`npm run verify:dist` (BRIEF-BAR4 amendment 2's last step): owed by the close.

## THE GUARD

`tests/domain/bar5FoodFacts.test.js`: the audit's L3 detector over the page the cured leaves print (the failed card, the
commodity list, the food line, the fish trade's income mark, the farmland cards and their chips) in the read towns where
each rule bit at the base: (a) zero at the tip; (b) the base line (the list read raw; the record's stored line) fires in
every one; (c) the catch's one fact equals the mark leaf's verdict on every house of the fish trade in every guard town.
The three corpus walkers (negativeAssertionAnchor, seedLoopTotality, proseDrawnAnchors) green over it.

## THE VETO LIST (every new or changed line, three towns it is read in)

| line | where | towns read in |
|---|---|---|
| chip mark `(failed)` after a failed ground or good ("Extensive Grain Fields (failed) · grain (failed) · flour (failed)") | Resources › Nearby Resources › Commodities available | bar0-village-famine-rand-24 (village, famine), r2s-famine-hamlet-3 (hamlet), r2s-famine-metropolis-3 (metropolis) |
| "Its own fields give it grain, and beyond that its food is {A}." / "Its own fields give it grain; beyond that, what it puts on the table itself is {A}." | the foodways line (Economics, PDF, journal, stored identity) | bar0-village-calm-rand-24, r2r-village-2, r2s-wartime-village-0 (wartime) |
| "Its own fields give it grain; beyond that, " before a two- or three-source frame | the same | bar0-village-calm-rand-22, bar0-village-calm-rand-25, r2r-village-31 |
| DS-ECO-9 FOOD SOURCES v9 "{settlement}'s food comes from more than one source, the {good} most of all, and together they do not quite cover what the town eats." | Economics desk | r2r-thorp-41 (thorp), bar0-village-calm-rand-25 (village), r2s-plague_onset-town-0 (town, an outbreak) |
| (rung moves, no new line) DS-ECO-9's security rung SECURE → PRESSURED where the page prints Pressured; the catch's phrase struck under a siege that stops the fish trade ("Meals follow the season and what the household has put by." / the culture's line) | Economics | bar0-hamlet-under_siege-rand-24, r2s-under_siege-city-0 (city), r2s-under_siege-hamlet-1 |

## THE BOOKS MY CURES MOVE (stored figures; not re-taken)

| test | arm | at 600b7683a | at my tip | door |
|---|---|---|---|---|
| `tests/property/generatorGoldenMaster.test.js` and the golden-derived files | the 525 | red (the round's) | 107 of 525 move against 600b7683a: culturalIdentity 48 (the foodways line), economicViability 59 (the outlook hooks read the printed band: "The settlement grows less food than it eats, and a merchant …" where the page prints Deficit) | the owner's word |
| `tests/lint/proseCorpusBytes.test.js` | `economy.generated.js` gzip | 26073 vs the committed 25695 (red) | 26105 (+32: v9) | the close |
| `docs/content/wiring-census.json` | stale against three composers at the base (red); re-taken locally only to regenerate the economy leaf, NOT committed | | | the close |
| `tests/generators/generationForkCensus.test.js` | red at both (golden-derived); one arm more at the tip ran out on a loaded box (STACK_TRACE_ERROR) | | | the close |
| the reach register (`writerReach`), the presumed things, the observed shape, the wiring census walker, `tieProseDeclared`, `tuningRegister`, `tradeListWriters`, `tailHouses1Gaps`, `proseTasteCorruption`, `vendorPdfLazy` (needs a build), `pipelinePinnedMode` | red at the base and at my tip with the same arms | | | named, not chased |

DECLARED MOVE of the record: the census's 720: 127 records (economicViability 75, culturalIdentity 57); the fresh 300: 58 records (economicViability 34, culturalIdentity 25).

## REGISTRATIONS OWED

- Goods roster row owed: `src/domain/display/commoditiesShown.js` imports no goods module (it reads the display label
  leaf); none owed. `catchStopped.js` imports `data/institutionalCatalog.js` (not a goods module): none.
- Manifest entry owed: none (the guard is under `tests/domain`, not `tests/generators`).
- The PDF's commodity list (`src/pdf/lib/viewModelBodySlices.js :: availableCommodities`, a copy) still reads the raw
  list: the leaf to call is `commoditiesShown` (named for the PDF's holder; the detector reads the dossier only).

## WHAT IS LEFT, IN ORDER

1. LAW 5's seven (above): the Bandit Raids hook (`foodBalance.js:792`, a declaration in `outlookHookSiblings.js`'s form
   or the route read after the siege) and the economy desk's six annex lines (`no crisis: under_siege` etc., twins where
   a pool would go mute; every one prints in 0 of the 1,020 towns today).
2. (e) DS-ECO-8 POOR v3 against a newly built place: the vocabulary needs an age atom (DS-GEN-14's `FOUNDED-YOUNG`
   reading, `generalStateProse.js :: foundedPoolKey`): one line to the chair before adding it.
3. The PDF's commodity list (named above).

## FOR THE OWNER, IN PLAIN WORDS

When a famine has ruined a town's harvest, the Resources tab now marks that harvest "(failed)" in the list of what the
town has, and the Economics tab no longer lists it as made here. When a siege has stopped the fishing boats, the line about
what the town eats no longer puts the day's catch on the table. Where a village works its own farmland, the food line now
says its fields give it grain before naming what else it eats. And every sentence that depends on how well fed a town is
now reads the same word the page shows ("Pressured" rather than the ledger's "Secure"), so the page no longer says a town
can weather a bad season without going hungry beside a heading that says it is already short.
