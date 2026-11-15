# BAR2-SERVICES · hand-back (kept current after every batch)

Seat: BAR2-SERVICES (REVIEW-BAR-2, the Services tab's rows and the marks a row carries). Started from the joined line
`lane/join-2026-11-14` at **f8042b61a** (its tip as read); merged it at **dcb069bff** on the chair's word (16:21 UTC). Branch `lane/bar2-services-2026-11-15`, worked in a scratch
worktree. Census before: CENSUS-3 at f8042b61a on the 720; after: the same command at each batch's tip.

## The rulings worked to (the chair's, 2026-11-15; each vetoable by the owner)

- **SV1** A service row carries the mark its house carries: where the house's row is stopped, curtailed or short of its
  input, every service row of that house that lives on the same thing prints the same mark. One rule at the leaf
  (`crisisStoppedRow.js` and `crisisDependence.js`); no description rewritten row by row.
- **SV2** A row false in ordinary times takes a declaration or a twin (the high-end retail's "rare spices"; "inland
  traders" in a place with no trade).
- **SV3** "Slow but broadly legitimate." (Family decisions) reworded out of the legitimacy register.
- **SV4** "Backs Military/Guard": the Backs line takes the power's sentence name from the one leaf.
- **SV5** "Connection: Lord Chancellor / Lord Mayor <a woman>": only the form by sex is cured, through `titleForHolder`.
- **SV6** (the chair's message after batch 1) A house that lives on a resource which the page itself prints as depleted or
  absent is short of it: the leaf reads the resource's printed condition as it reads a gap; the house's row and its
  service rows carry the short mark naming the resource; a chain running at full on a depleted or absent ground is the
  record's incoherence, NAMED; a house the record feeds by an import is not short (struck with the count).

## Batch 1 (SV1, SV2, SV3, SV4; SV5 struck)

### SV1 — a service row carries its house's mark

MEASURE FIRST (my script over the census's 720 records at f8042b61a, every service row whose house's row carries a mark
the row lacks): **172 rows in 55 towns, 55 (house, service, cause) keys**, e.g. the quarry's Cut stone and Rubble under a
siege (6), the fairs' spectacles and livestock auctions (10), the inns' accommodation (18), the fish market's rows (14),
the bakers' pastries under a grain famine (2), the listening post's register (8), the butchers' offal (1), the
caravanserai's caravans where "No camels reach the caravanserai." (1).

THE PREMISE MEASURED, TWO PARTS OF IT WRONG ON THE RECORD (followed the record, one line each):
- *A house short of its input with an unmarked service row* (Lumber milling, Charcoal supply, Salt production, Caravan
  organization): on the 720 the page's own gap line ("No timber reaches the sawmill.") and the row's mark never disagree
  but in ONE town (r2r-town-54, the caravanserai, cured below). The flags rest on the readers' LAND header, which gave the
  record's raw `resourceAnalysis.gaps`; where the page prints no gap line the page reads the input as reaching the house
  (goods held or a connected route: `validationOnPage.js :: inputAnswered`), and ruling S5 binds the mark to that line.
  Towns where the record holds the house's gap and the page prints no gap line: Sawmill 8, Charcoal burner 79, Salt works
  20, Caravanserai 16, Bakers 204, Smelter 193, Potter 91, Brickmaker 92, Vintner 11: the page reads the input as reaching. STRUCK for that cause: C33684, C13360 (and C31592's gap part).
- *A depleted or absent ground* (fresh fish "from the morning catch" on depleted grounds, the mine's ore where the ore is
  absent, salt on depleted flats): NO house's row carries a mark for it, so the ruling's rule (the row carries its house's
  mark) does not reach it. The page says it on the chain's row ("Fishing grounds (depleted) » Fisher's landing + Salt works
  + Fish market » Normally yields …") and the trade list ("Salt (local salt flats exhausted)"). PARKED at batch 1, CURED in batch 2 by the chair's ruling SV6 (see
  "Left"): C23813, C8434, C10682, C16282.

THE CURE (one rule at the leaf): `serviceRowDependence(settlement, row)` — a service row lives on its own line AND on its
house's line (`HOUSE_DEPENDENCE` of the record's house by `institution`), but for what the new table
`SERVICE_FREE_OF_HOUSE` declares it free of. `rowStoppedBy(…, 'service', …)` and `rowShortOf(…, 'service', …)` read it, so
the Services tab's mark, the Institutions tab's door word, the PDF's and the journal's rows (which read the same leaf)
agree. A row whose description is its crisis's own twin keeps its twin (unchanged). `SERVICE_FREE_OF_HOUSE` was read row by
row over the 97 (house, service) pairs of the catalogue where the house's line reaches a dependence the row's own does not
(`scripts` in my scratch: `pairs.mjs`): 40 rows declared free (the mill's fulling and sawing; mead; wine appraisal; the
alchemist's identification and sourcing; the apothecary's consultation; the caravanserai's route planning; customs'
smuggling investigation; the carriers' porterage and storage; the cartographer's bench work; the inns' meals and music;
the stable yard's boarding; the luxury quarter's commissions and appraisal; the square's proclamations; the theatre's
rehearsal and wardrobe hire; the smugglers' storage and safe house; the cemetery office's register and plot trade; the
troupe's own performances; the listening post's weighing and vouching; the chroniclers' archive, answers and grading).
The caravanserai's house line takes `input` (its camels): where the page says "No camels reach the caravanserai." the house
and its caravans are marked "Short of camels.".

MEASURE AFTER (same script, the cured leaf, the same 720): **0 rows undeclared**; 78 rows remain unmarked under a marked
house, every one either declared free (53) or printing its own crisis twin (25: the mill run, the coaching inn's lodging
and horse change, the fair's seasonal trading, the carriers' haulage under a siege).

### SV2 — two rows false in ordinary times

- C10654 "Jewellery, fine clothing, rare spices, and luxury goods from across the world." — VERIFIED: false in 21 of the 97
  printing dumps read (the town's own line "Needed, and not brought in: … spices"). The vocabulary has no atom for one good
  imported (its `imports` dimension is presence only), and the services' draw site resolves a sibling set's first twin
  only, at the roll, before the trade record is final: a twin keyed to spices is not available. CURED by a reworded line
  that claims no more than every printing town bears: "Jewellery, fine clothing, and luxury goods from across the world."
  (214 towns; the row is not silenced, its one false-prone noun is dropped; told to the chair before the push).
- C23820 "Bulk purchase by households, institutions, and inland traders." (the fish market's twin where no tavern stands):
  prints in 1 of the 720 (r2r-thorp-50, which exports); the reader's town had no trade. A third twin keyed to `exports`
  was tried and REFUSED by measure: the draw site takes a set's first twin only and `exports` is unanswered at the roll,
  so the row dropped from r2r-thorp-50 (a draw moved). CURED by rewording the twin to claim no trader: "Bulk purchase by
  households and institutions." (the smallest places, where no tavern stands).

### SV3 — Family decisions

C23436, C24226: "Slow but broadly legitimate." printed in 30 towns, false where the page's legitimacy word is Contested.
CURED: "Matters affecting multiple families go to a council of heads, who settle them slowly, by talk." (30 towns).

### SV4 — the Backs line

C0253, C18444, C24598, C26553, C5979, C0365, C6106: the Institutions tab's Backs line printed the roster label. CURED in
`InstitutionsTab.jsx`: the line calls `powerSentenceName` (the leaf; as the Crisis tab's doors do), "Backs The Guard".
The leaf has a form for every slash or bracket label the estate writes; nothing to tell the chair. MEASURED: towns whose
Institutions section prints "Military/Guard" 242 -> 0; "BacksNoble Claimant (Senior Line)" and "BacksCrown Creditors (Noble
Coalition)" 1 -> 0 each. The 248-town fold "Military/Guard" still prints on the POWER tab (the roster chip keeps the label
by the leaf's own rule) and on the PDF's Institutions section (named below).

### SV5 — struck

C16054 "Connection: Lord Chancellor <a woman>", C16005 "Lord Mayor <a woman>": STRUCK. The title is an office's title
(`officeTitles.js`), which the titles' leaf declines by design ("An office's title … is the office's, never listed here":
`titleForHolder` returns it unchanged for either sex), and by usage the office's title is borne as it stands by a holder
of either sex (a Lord Mayor, a Lord Chancellor who is a woman keeps the title). By the owner's pin M-1b the role is the
institution's title. No form by sex to cure; nothing called.

### The batch's guard

`tests/components/bar2ServicesRows.test.jsx` (births): MARKED 8 pairs (each red at f8042b61a), KEEP 4 (green at base and
tip; the plant — the chroniclers' "Archive consultation" struck from the free table — reds it, not committed), REWORDED 3
(red at base), BACKS 2 (red at base), and the free table's walker (every entry names a house that lives on the dependence
and a service of its menu). Two pins of `tests/components/crisisStoppedRows.test.jsx` re-keyed by their text (dated notes):
the high-end retail row, the fish market's household twin. The services ledger
`docs/census/declarations/institutionServices.INSTITUTION_SERVICES.json` re-keyed by text for its two rows (High-end
retail, Family decisions), as the cure seats before kept it.

### The inventory diff (before f8042b61a -> after batch 1, the 720)

Sentences 29967 -> 30005 · gone 7 · new 45 · in fewer towns 14 · in more towns 2. GONE: the rare-spices row 214, "Backs
Military/Guard" 192, Family decisions' two sentences 30 each, the inland-traders twin 1, two other slash labels on a Backs
line 1 each. Every line in fewer towns is an Institutions-tab door that now carries its house's word ("Cut stone
(stopped)", "Full accommodation (curtailed)", "Preserved fish (stopped)", "Burial (stopped)" …: SV1's marks, 2 to 9 towns
each). THE INHERITORS read: "The Guard" / "Backs The Guard" (192-242), the reworded rows (214, 30, 1), the door words and
the Services marks (2-9 towns each, each under the crisis that marks its house). Worklist rows: 6 GONE, C4138 (Pastries)
143 -> 142 (the door; both famine towns where the grain failed now print "Pastries (scarce)" and the Services row "Scarce in
the famine. Pies, …").

### Declared move (field diff by family on the 720)

245 of 720 records move, ALL in `availableServices` (descriptions only, no row added or dropped, no draw moved): the
rare-spices row 214, Family decisions 30, the inland-traders twin 1.

### Gates (batch 1)

Strict-domain gate 0 · type ratchet OK (167, ceiling 167) · eslint on the touched files 0 · presumed-things `--check`
fresh 0, stale 0 (base the same) · the twelve-birth grid 0 falls · the 74 test files naming the touched files: 70 green;
4 red, all CARRIED from f8042b61a (8 arms red at base and tip: `upkeepVocation.test.jsx` RED-FIRST page arm,
`proseComposed.walker.test.js` two arms, `proseWiringCensus.walker.test.js` five arms: the close's books); the one arm my
cure turned red (`institutionProseDeclared.test.js`, the ledger's text) re-keyed by text as above.

## Batch 2 (SV6: the depleted ground)

MEASURE FIRST (my scripts over the 720 at 41ef3a9b4; the Resources tab prints `config.nearbyResourcesDepleted` as its
Depleted list; "absent" prints nowhere on any page of the 720): **1,882 house-towns** stand on a printed-depleted ground
(a chain of the record the house works, `activeChains[].resourceKey`, on that list): 1,407 with the trade record's
shortage import for that ground (`resourceSemantics.js :: resourceShortageImport`, "Iron ore (local iron mines
exhausted)"), 475 without. Chains: impaired or vulnerable, some magically sustained; **NONE running** (part (b): 0).

THE PREMISE MEASURED, ONE PART WRONG ON THE RECORD (followed the record, one line): the import feeds the houses that BUY
what the ground yields (the smiths' iron, the bakers' grain), never the work on the ground: the mine's "Ore cut
underground by the crews" is false on an exhausted seam whatever ore is bought in (36 such mine-towns), as the quarry's
stone (45) and the boats' morning catch (13). So the import lifts the mark for a buyer and NOT for the seven houses that
work the ground (`SPENT_GROUND_WORKERS`: mine, stone quarry, salt works, fisher's landing, fishing community, fish market,
hunter's lodge). STRUCK by the import rule: the buyers fed (the 1,407 house-towns less the workers': smiths, smelters,
weavers, tailors, dyers, fullers, cobblers, bakers, butchers, citadels … each fed by its shortage import).

THE CURE (the leaf, `crisisStoppedRow.js :: housesOnSpentGround`, read into the same short map as the gap line, so one
mark): a house that makes from what reaches it (`input`) whose EVERY own ground is on the page's Depleted list, none kept
by magic, and none fed (a worker is never fed) is short of the ground's yield (`SPENT_GROUND_YIELD`: fish, iron ore, salt,
stone, game, livestock, clay, coal, timber, herbs, glass sand, grain, reeds, grapes; else "its materials"); its service
rows carry it through SV1. `input` declared on the six ground-working houses that lacked it (mine, stone quarry, fish
market, fisher's landing, fishing community, hunter's lodge); free of it: the hunter's guide, the fish market's wholesale
and preserved stores (fed by what is brought in).
A house that works two grounds and has only one spent is NOT marked (the salt works on spent fishing grounds still makes
salt): one salt works on spent flats beside live fishing grounds stays unmarked (r2s-mass_migration-village-0), the cost of
reading the house whole.

MEASURE AFTER (the cured leaf on the same records): towns with a house short 272 -> 332; new short houses: Stone quarry
45 towns, Mine 40, Fish market 19, Fisher's landing 12, Tanners 11, Charcoal burner 8, Smelter 4, Bakers 2, Hunter's lodge
2, Glassmakers 2, Specialized metalworkers 4, Salt works +1, Fishmonger +1, Apothecary 1, Brickmaker 1.
Worklist rows: C10682 (the mine's ore) marked in every printing town whose seam the page prints depleted; C23813, C8434
(the morning catch) the same; C16282 (salt on spent flats) marked where the salt works' every ground is spent.

PART (b), NAMED for the record's seat: no chain runs at full on a depleted ground in the 720 (0). THE RECORD'S OWN
INCOHERENCE that remains: **a Mine on a roster whose ground holds no ore at all** (no ore key in
`config.nearbyResources`, no chain for the Mine): 9 towns, r2r-village-3, r2r-town-51, r2r-town-52. The page prints no
depletion there, so (a) does not mark it; the roster's draw is the record seat's.

THE GUARD: `bar2ServicesRows.test.jsx` MARKED gains 4 SV6 pairs (the mine r2r-town-45, the fish market r2r-village-11, the
quarry r2r-city-18, the landing r2r-hamlet-10), each red at 41ef3a9b4; KEEP gains the smiths fed by the import
(r2r-town-12), green at both; the plant (the mine struck from `SPENT_GROUND_WORKERS`) reds r2r-town-45, not committed.

THE INVENTORY DIFF (after batch 1 -> after batch 2, the 720): sentences 30005 -> 30034 · gone 0 · new 29 · in fewer towns 20
· in more 9. Every line in fewer towns is an Institutions door that now carries "(short)" ("Raw extraction" 125 -> 85,
"Cut stone" 49 -> 38, "Hide processing", "Fresh fish retail", "Fresh fish", "Charcoal supply" 123 -> 115, "Iron
refining", "Salt production", "Game meat", "Herbal remedies", "Fresh bread"): the marks themselves. THE INHERITORS read:
"A row marked short is what its house makes when supplied." +46, "Short of iron ore." 42, "Short of stone." 45, "Short of
fish." 4 -> 33, "Short of livestock." 36 -> 47, "Short of coal." 8, and the doors' "(short)".

DECLARED MOVE: none. 0 of 720 records move (the leaf and its table are display data); 0 of the 525 reference
configurations.

GATES (batch 2): strict-domain 0 · type ratchet OK (167, ceiling 167) · eslint 0 · presumed-things fresh 0 stale 0 · grid
0 falls · the 74 touched-file tests: 71 green, the same 8 arms CARRIED from f8042b61a.

## Every new or changed line (THE VETO LIST)

| line | where | read in (smallest · largest · a crisis) |
|---|---|---|
| "Jewellery, fine clothing, and luxury goods from across the world." | Services, the luxury goods quarter | r2r-city-0 · r2r-metropolis-0 · r2s-under_siege-city-1 (marked "Stopped by the siege.") |
| "Matters affecting multiple families go to a council of heads, who settle them slowly, by talk." | Services, head-of-household consensus | r2r-thorp-11 · r2r-thorp-17 · (prints in thorps only: no crisis town among the 30) |
| "Bulk purchase by households and institutions." | Services, the fish market where no tavern stands | r2r-thorp-50 (its one town) |
| "Backs The Guard" (the sentence name, the leaf's) | Institutions, the Backs line | r2r-city-0 · r2r-metropolis-14 · r2s-under_siege-city-0 |
| "Short of fish." / "Short of iron ore." / "Short of stone." / "Short of livestock." / "Short of coal." / "Short of game." / "Short of grain." / "Short of herbs." / "Short of glass sand." / "Short of salt." (SV6, `SPENT_GROUND_YIELD`) and the doors' "(short)" | Institutions and Services, a house on a ground the page prints depleted | r2r-hamlet-10 (fish) · r2r-metropolis-14 (iron ore) · r2s-under_siege-metropolis-3 (iron ore, a siege), r2r-town-49 (grain) |
| the house's mark on its service rows ("Stopped by the siege." / "Curtailed by the outbreak." / "Scarce in the famine." / "Short of camels."): existing marks, new rows | Services rows and Institutions doors | r2s-under_siege-hamlet-3 (hunter's lodge) · r2r-metropolis-14 (siege) · r2s-famine-city-2 (pastries), r2s-plague_onset-town-2 (register), r2r-town-54 (camels) |

## Rows named for other seats

- **The PDF's Institutions section** (`src/pdf/sections/Institutions.jsx`, the exports' seat): its Backs line prints the
  roster label ("Backs Merchant Guilds · Military/Guard", 242 towns): it is to call `powerSentenceName`
  (`src/domain/display/powerSentenceName.js`), as the tab now does.

## THE BOOKS MY CURES MOVE (F2), at the merged tip (lane/join-2026-11-14 at dcb069bff merged: 72236fb6c)

Run alone, each to a file, through `sh scripts/gate-tail.sh`, after the merge:
(a) the 60 test files that name a file I touched: 790 passed, 5 skipped, 0 red;
(b) the 17 law suites: 14 green; three red, classed:

| test | arm | class | old | new | door |
|---|---|---|---|---|---|
| `tests/lint/ruinFilterRoster.walker.test.js` | every `.institutions` reader is COMPLIANT or EXEMPT; the scan's reader count | A LAW, MY REGRESSION (batch 1's house lookup read the raw roster) | 111 readers | 112 | CURED at my tip: the lookup reads `liveInstitutions` (`institutionRoster.js`); both arms green |
| `tests/property/generatorGoldenMaster.test.js` | every config byte-identical | STORED FIGURE moved by my declared move | 525 hashes (the line tip matches the stored manifest exactly) | 216 of 525 move (thorp 60, city 72, metropolis 84), ONE family: `availableServices` | `UPDATE_GOLDEN=1` through the close's door (a shift record) |
| `tests/generators/pipelinePinnedMode.test.js` | A1, A2, A5 (the golden sample unmoved by the pin seam) | STORED FIGURE (reads the same manifest) | 0 rows moved | 17 of its sample rows moved, by my `availableServices` move alone | the golden manifest's door, as above (no figure of its own) |
| `tests/generators/generationForkCensus.test.js` | A1 (STOP-3, the golden rows under the instrument) | STORED FIGURE (reads the same manifest) | 0 rows moved | 12 rows moved, the same | the golden manifest's door, as above |

All four green at the line's tip (dcb069bff, run there: 25 of 25 for the last three). Nothing re-taken. The owner's six (the
cartography calibration, the description manifest, the lighting witness) I did not touch. Batch 2 moves no record: the 216
are batch 1's three reworded descriptions (the luxury quarter's row, Family decisions, the fish market's household twin).

## Left of my worklist

- CURED in batch 2 (SV6): the depleted ground. What is left: the salt works on spent flats beside live fishing grounds
  (1 town, the house read whole); the Mine on no ore ground (9 towns, the record seat's).
- The PDF's Backs line (named above).

## How the instruments are re-made

`git archive` of `docs/chair/2026-11-14/probes/READ-ALL` (chair's lane) and `docs/chair/2026-11-14/probes/CENSUS-3`
(census lane) to a scratch directory; `census3.sh <tree> <out> 4`; `inventory.py <out> <json>`; `inventory_diff.py
before.json after.json WORKLIST-SERVICES.json`. My measures: `sv1measure.mjs` (rows under a marked house that lack the
mark), `sv1short.mjs` (gap houses and their marks), `sv6b.mjs` and `sv6after.mjs` (houses on a printed-depleted ground, fed or
not, and the short marks before and after), `pairs.mjs` (the catalogue's house-service pairs), `famdiff.mjs` (the
record's field diff), `golden.mjs` (the 525 hashes) — each a few lines over `corpus.ndjson.gz` and the tree's own leaf.
