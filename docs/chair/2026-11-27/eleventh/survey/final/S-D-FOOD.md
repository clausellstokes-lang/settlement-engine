# S-D FOOD — plenty against want, on the final record (MEASURE ONLY; SURVEY-FINAL, 2026-11-28)

Measured 13:21–15:45 UTC (`date -u`) on the code tip **b2a9010fe** (held; this file is a docs commit after it). No code
changed, no birth moved, no register re-recorded.

## Method (and what it cannot see)

- **Pages:** all 900 C and 900 V owner pages, rendered as the app renders them (OutputContainer + the `walkDossier` walk
  in jsdom, the S-A bundle method, `tools/`), every tab's text leaves. Notes tabs left out. **Shared pages not rendered in
  this round** (owner only); PDF/Foundry/journal checked by source (below).
- **Atoms:** each town re-born (`generateSettlementPipeline(birthConfig(row.config), null, {seed, customContent:{}})`,
  stamped with `withPublicProse`), `factsOf(record)` read: `food` (the printed band), `food surplus`
  (`growsMoreThanEats`), `stores` (`storesMonthsOf`), `famine`, `starving`, the crisis kinds (hunger group = famine,
  under_siege), the live tensions (`history.currentTensions`).
- **Lines:** every printed sentence classed by subject and side with a word filter (EAT±: on the table now; STORE±: kept
  back), then the top lines read by hand and attributed to their pool by text (`out/pools.json`: every state-prose
  variant and Daily Life row with its declaration, 3,798 rows) or to the code that writes them. The filter is a
  candidate net (PLAUSIBLE); every count below is a CONFIRMED page count for a named line, string-matched on the page.
- **Blind:** a line the filter's words miss; a page printing a store claim inside a longer leaf it splits wrongly.

## THE PAIR THE CHAIR NAMED — CONFIRMED

| | C | V |
|---|---|---|
| pages printing `DS-ECO-8::COMFORTABLE#4` | 184 | 61 |
| … beside the Economics tail "…some to put by against a bad year" | **183** | **55** |
| … beside "…shared or put by" (`FOOD_CULTURE.surplus#S4`) | 6 | 2 |
| SURVEY-TABLE's neighbour table (their tip, their method) | 86 | 31 (and 3 / 0) |

My counts are about double SURVEY-TABLE's on both plans; theirs counted a line as standing on an atom where the
presumption ledger notes it (the Economics tail is composed in code and is in no ledger), mine string-match both lines
on the rendered page. The page count is mine; the reason for the gap is PLAUSIBLE.

**What each line reads, and the softer side.**

- `DS-ECO-8::COMFORTABLE#4` (Daily Life, state prose): "The town is plainly comfortable. Its buildings are well kept,
  though nobody here keeps more in store than the coming season needs." **Declared** `food: ≥ secure`, `stores: < 3`.
  On the record: TRUE on 184 of 184 C and 61 of 61 V pages (stores < 3 on every one; dp-thorp-2 holds 1.7 months).
- The Economics tail (`EconomicsTab.jsx :: foodSentence`, line 787): "{S} grows [a little / — / far] more than it eats,
  with some to put by against a bad year." **Undeclared, composed in code**, on the production surplus alone
  (`fb.surplus`); it reads no stores figure. On the record: the town holds under 3 months on **408 of 465 C** and
  **283 of 296 V** pages that print it (no hunger crisis on any). Its own sibling branch on the same card DOES read the
  months (`Math.round(foodRecord.storageMonths) >= 3` → "…covers each day's food." / "…, with nothing to spare against a
  bad year."), off the food record directly, not through the one reader `storesMonthsOf` (PLAUSIBLE: a second reader of
  the months; the round makes 2.5–2.99 read as 3 there, where the atom reads < 3).
- The same card prints the figure beside it: dp-thorp-2 (C), Economics: "Rossford grows more than it eats, with some to
  put by against a bad year." / "No granary; about a month and a half in household stores." / "Rossford is fed, but what
  it keeps put by would not outlast a run of poor harvests." (`DS-ECO-9::SECURE#3`, declared `stores: < 12`).

**The softer side is the Economics tail**: it is the one of the pair that stands on no store atom and is false for the
record on 691 owner pages (408 C + 283 V); COMFORTABLE#4 is declared and true wherever it prints. "Shared or put by"
(S4) is softer still (a disjunction: "shared" can hold where nothing is kept), but it is undeclared and prints under
3 months on 24 of 30 C and 28 of 32 V pages.

## EVERY LINE OF THE FAMILY THAT PRINTS (top lines, both plans, read by hand)

Pages per line; "contrary" = the record says otherwise by the atom named.

| line (home) | declares | C pages | V pages | contrary on the record |
|---|---|---|---|---|
| **PLENTY / STORES KEPT** | | | | |
| "{S} grows … more than it eats, with some to put by against a bad year." (`EconomicsTab.jsx:787`, code) | none | 465 | 296 | stores < 3: **408 / 283** |
| "Most households eat well, and what is left over is shared or put by." (`foodCulture.js` S4) | `needs: []` | 30 | 32 | stores < 3: **24 / 28**; no `food surplus`: 7 / 6 |
| "…the stores are more than the season needs." (`DS-ECO-8::COMFORTABLE#3`) | `food: ≥ secure`, `stores: ≥ 3` | 118 | 33 | 0 |
| "The place grows more than it eats, and it shows in every household." (S5) | `food surplus` | 25 | 18 | 0 (makes no store claim) |
| "In an ordinary season {S} has enough to eat, or near enough." (`DS-ECO-9::SECURE#1`) | `no hunger` | 164 | 138 | 0 |
| "Nothing on {S}'s tables suggests to a visitor that food is a worry here." (`DS-ECO-9::SECURE#8`) | `no hunger` | 139 | 105 | 0 |
| "Meals follow the season and what the household has put by." (`foodways.js:153`, code default) | none | 244 | 197 | neutral (no amount claimed): DIFFERENT THING |
| **WANT / STORES THIN** | | | | |
| "…nobody here keeps more in store than the coming season needs." (COMFORTABLE#4) | `food: ≥ secure`, `stores: < 3` | 184 | 61 | 0 |
| "{S} is fed, but what it keeps put by would not outlast a run of poor harvests." (SECURE#3) | `no hunger`, `stores: < 12` | 127 | 98 | 0 |
| "Every household here has its work, and there is little to spare." (`narrativeGenerator.js :: SMALL_PLACE_TIER_LINES[0]`, code) | none | 62 | 62 | 0 (stores < 3 on all) |
| "Everyone here knows every household by name, and none has much put by." (`SMALL_PLACE_TIER_LINES[2]`, code) | none | 57 | 57 | 0 (stores < 3 on all) |
| "{S} feeds itself and has nothing to spare." (`DS-ECO-8::POOR#6`) | `crisis: any`, `food: ≥ secure`, `need not brought in: any` | 11 | 39 | stores ≥ 3: 1 / 3 (soft: "to spare" reads as money here) |
| "What is grown here … covers each day's food, with nothing to spare against a bad year." (`EconomicsTab.jsx`, code) | none (reads `Math.round(storageMonths) >= 3`) | 7 | 47 | 0 |
| "What the road does not bring in, the people here go without." (`DS-ECO-1::COMBINATION C5`) | `[]` | 0 | 26 | 0 (11 famine, 6 pressured, 7 secure: soft) |

Hunger and rationing lines (`FOOD_CULTURE.critical/collapsed`, `DS-STR-1::FAMINE`, `DS-GEN-3 Deficit`) print only under
their bands (filtered by the fare band and the food band); the EAT pair census found **no page** printing "enough to eat"
beside a hunger line of the town's own table: the 52 C | 48 V "both" pages are an NPC secret ("…lets the rest go hungry",
prisoners: DIFFERENT THING) and one betrayal line ("lock more doors").

Money lines the filter caught and set aside (S-D-MONEY's, not FOOD's): "{S} has nothing laid by to pay for a long
defence…" (`DS-DEF-2::Economic Survival: WEAK#1`), "…nothing laid by to pay them for it", "…money laid by"
(COMFORTABLE#1).

## PAGES THAT PRINT BOTH SIDES OF THE STORE CLAIM — CONFIRMED

| | C | V |
|---|---|---|
| pages printing any STORE+ beside any STORE- line | 476 | 257 |
| … of which the Economics tail beside a store-thin line | **342** | **187** |
| COMFORTABLE#3 "…more than the season needs" beside SECURE#3 "…would not outlast a run of poor harvests" | 10 | 4 |
| S4 "…shared or put by" beside a store-thin line | 20 | 22 |

COMFORTABLE#3 beside SECURE#3 is a DIFFERENT THING (both true on 3 ≤ stores < 12: a season against a run of years).
Pairs the Economics tail makes (C | V): COMFORTABLE#4 183 | 55; SECURE#3 85 | 52; the tier line [0] 59 | 43; the tier
line [2] 51 | 36; POOR#6 9 | 20. Examples: C dp-thorp-2, dp-thorp-3, dp-thorp-4; V dp-thorp-4, dp-thorp-5, dp-thorp-10.

## WHAT A CURE WOULD NEED (named; nothing built)

**Atoms:** all exist (`stores`, `food`, `food surplus`, `famine`, `crisis: hunger`). One is missing from the
vocabulary: no atom reads a live `resource_scarcity` tension ("The Shortage", `historyGenerator.js:436`); no line of
this family's top lines needed one on these corpora (named, not proposed).

| # | line | the row it needs | pages that move (owner) | EMPTY slot? |
|---|---|---|---|---|
| F1 | Economics tail | split on `stores`: `food surplus` + `stores: ≥ 3` keeps "…, with some to put by against a bad year."; `stores: < 3` drops the tail (the sentence ends "…more than it eats.") or takes the chair's wording | **C 408, V 283** (the Economics tab only; PDF/Foundry/journal do not print the sentence: `grep` finds it in `EconomicsTab.jsx` alone) | none: the sentence keeps its body |
| F1b | the same card's other branch | read the months through `storesMonthsOf` and the atom (`stores: ≥ 3`), not `Math.round(foodRecord.storageMonths)` | towns with 2.5 ≤ months < 3 that print no surplus (not counted this round: PLAUSIBLE small) | none |
| F2 | S4 "…shared or put by" | declare `stores: ≥ 3` (or the chair rules it DIFFERENT THING: "shared") | **C 24, V 28** (the Daily Life row re-draws in its branch) | none: the `surplus` branch keeps S1 (`needs: []`) and S2/S3 (`excludes: famine`) |
| F3 | the tier lines [0] and [2] | declare `stores: < 3` (true wherever they print) | 0 | 0 |

Note for F2: the Daily Life `surplus` branch is the capacity model's production band placed inside the printed band
(`dailyLife.js :: fareBandOf`), not the `food surplus` atom; S4 prints on 7 C and 6 V towns where `food surplus` is false.
Two readings of "surplus": named, not ruled.

**Goldens and registers that would move with F1/F2 (named, none re-recorded):** the page text of 691 (F1) and 52 (F2)
owner pages; the golden view model and the page-clash census register (SURVEY-TABLE's) where their samples hold these
towns; the presumption ledger gains F1's rows if it becomes a table. No birth moves (both are page-time choices).
