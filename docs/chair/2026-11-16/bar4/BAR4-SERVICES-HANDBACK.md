# BAR4-SERVICES · hand-back (kept current in every push)

Branch `lane/bar4-services-2026-11-16`, cut from 8aef8e7d4 (the closed tree of the round before: the tip of
`lane/bar3-close-doors-2-2026-11-16` read a71788851 when I started, which differs from 8aef8e7d4 in one hand-back document only).
Every cure is RENDER-TIME: no generator reads a changed function (`crisisDependence.js`, `crisisStoppedRow.js` and
`magicProvisionShown.js :: magicRoleHeld` are read by display leaves only), so NO RECORD MOVES.

## THE KINDS

| kind | detector | 720 before → after (instances in towns) | fresh 300 before → after | named exclusions (TRUE, with reason) | guard and positive control |
|---|---|---|---|---|---|
| S1 and S3 together | `tests/helpers/markPromise.js :: markPromiseInstances` (seven parts, below) | **94 in 54 → 0** (S1's seven parts 61) | **167 in 58 → 0** (S1's 147) | EX-WITHIN 1 in 1 / 0; EX-CARRIED 7 in 6 / 19 in 19; EX-SPLIT 61 in 59 / 14 in 14 (a K6 split, named for the chair) | `tests/domain/bar4MarkPromise.test.js` (a) the zero over the 720; (b) seven controls, one a part: the detector with the tabs read blind must find the record's need in a named 720 town |
| · siege-import (a row on an input the record says is imported, bare under a siege) | same | 40 in 8 → 0 | 107 in 20 → 0 | none | control r2r-metropolis-14 (the smelter) |
| · siege-travel (a row whose own words are travel past the gates, bare under a siege) | same | 4 in 4 → 0 | 15 in 12 → 0 | EX-WITHIN: "Armed escort within the settlement's jurisdiction" (the barracks' Military escort) | control r2s-under_siege-metropolis-0 |
| · famine-food (a row naming the failed food, bare in the famine) | same | 7 in 6 → 0 (14 in 10 counted with the cooper) | 8 in 7 → 0 (27 in 23 with the cooper) | EX-CARRIED: the cooper's "Barrel making" ("barrels for ale, wine, salted meat, and fish") and the river freight's "Cargo freight": what they carry, not what they sell | control r2s-famine-village-2 |
| · gap-missing (a row of a house the record says lacks its input, bare) | same | 0 → 0 bare where the page's gap line speaks | 0 → 0 | EX-SPLIT (K6): 61 in 59 / 14 in 14 | control r2r-village-4 |
| · spent-fishery (RULING FS1: a fishing house's input row bare where every fishery of the town is depleted, whatever the food ledger counts) | same | 1 in 1 → 0 (C22221's town) | 0 → 0 | none | control r2s-plague_onset-thorp-2 |
| · tab-split (one row marked on one tab, bare on the other) | same | 0 → 0 | 0 → 0 | none | control r2r-metropolis-14 (Institutions read blind) |
| · income-house (a share bare beside its trade's marked houses) | same | 9 in 9 → 0 | 17 in 17 → 0 | none | control r2s-under_siege-thorp-0 |
| S3 magic-medical ("Medical role: absent" beside a printed healing by magic) | same (its seventh part) | 33 in 33 → 0 | 20 in 20 → 0 | none | control r2r-village-1 |

THE FRESH 300 SHOW THE KIND WIDER THAN THE 720: 167 instances in 58 of 300 towns against 94 in 54 of 720, about three times the rate a town (the siege-import part alone: 107 in 20 against 40 in 8). The 30 read towns (packets10's seeds): 17 instances in 7 → 0 (bar the exclusions: EX-CARRIED 3, EX-SPLIT 1).

## The rows

| row | verdict | how |
|---|---|---|
| C0341, C0543 (rand-21 Iron refining) | CURED | S1 (i): the record's gap "Smelter runs on imported iron ore" under a siege: the house and its rows on that input read "Curtailed by the siege." (`crisisStoppedRow.js :: housesOnImportedInput`, `IMPORTED_INPUT` in `CURTAILED_BY`): it works what it holds and nothing more comes in (the trade record's own reading of a siege: "running on existing stockpiles only"; the smiths beside it print Impaired). Door word "(curtailed)". |
| C6093 (rand-23 Fresh bread, WEAK) | CURED | the same rule ("Bakers runs on imported grain"): the door now reads "Fresh bread (curtailed)" and the Services row "Impaired · Curtailed by the siege." The house's one tag already read Impaired. |
| C6632 (rand-23 Street food) | CURED | `"Street food": [GRAIN, LIVESTOCK]` (pies, roasted meats): "Scarce in the famine." The class: Drink service (ale) [GRAIN]; Grain storage and Strategic grain reserves [GRAIN]. |
| C19622 (rand-22 Armed escort) | CURED | `"Armed escort": [TRAVELLERS]`: "Stopped by the siege." The class: Mercenary hire "Off-duty soldiers available for escort" and Pack animal hire "… for journeys." by their descriptions (`SERVICE_DEPENDENCE_BY_DESC`). |
| C6795 (rand-23 Stone Quarrying, WEAK) | CURED | S1 (ii): a share titled by a resource trade (`incomeLineSiblings.js :: RESOURCE_ROW_TRADES`, the maritime fish share with the fish trade) whose every live house of the trade carries a crisis mark takes the mildest of them: "Stopped by the siege." beside its quarry. The class: the fish shares beside a stopped or curtailed fishing house (9 in the 720, 17 in the 300). |
| C46104 (rand-21 village Lumber milling) | NAMED (K6), TO BAR4-RECORD (the chair, 08:00) | THE RECORD IS SPLIT: `resourceAnalysis.gaps` says "Sawmill exists but lacks access to timber" while the economy's production and exports list "Milled lumber" and the page's gap reader (`validationOnPage.js :: inputAnswered`) answers the input from them: no gap line prints. Marking the row short would set it against the town's own export list. The two leaves are `src/generators/resourceGenerator.js` (the gap) and `src/domain/display/validationOnPage.js` / the economy's production (neither mine). 61 rows in 59 towns of the 720 and 14 in 14 of the 300 (the charcoal burner 36, the caravanserai 16, the sawmill 8). |
| C22221 (r2s-plague_onset-thorp-2, fish stall) | CURED (RULING FS1, the chair's, 2026-11-16) | the food record counts `fish` among the sources while the Depleted list holds the town's only fishery and no chain works it (45 towns of the 720 and 30 of the 300 hold a fish source with every fishery depleted; the food record is not opened this round). The mark reads THE GROUNDS THEMSELVES: a fishing house no chain names, in a town whose own fisheries on the record (`config.nearbyResources`) are every one on the Depleted list, is short of fish (`crisisStoppedRow.js :: housesOnSpentGround`, `nearbyGrounds`): "Short of fish. Fish sold daily from the morning catch." Of the 45 towns this was the one row printed bare; the others' fish rows were already marked through their chains. |
| C7595 (bar0-city-wartime-rand-6, "Fully exploited") | STRUCK by the measure | by the record a war takes 15 in 100 of the harvest (`foodBalance.js`: `productionMult *= 0.85`, "The levy has taken workers from the fields") and stops no chain (no war arm in `chainStateShown.js`; the own-ground chain cards of the 24 war towns of the 720 print running 53, vulnerable 52, impaired 37, entrepôt 8, as calm towns do). "Fully exploited" grades which grounds are worked, and they are all still worked. |
| C45429 (rand-23 village, "Medical role: absent", WEAK) | CURED | S3: `magicProvisionShown.js :: magicRoleHeld('medical')` also holds where a healing row of the record (`availableServices.healing`, not custom) names magic, the divine or a spell (`healingByMagicShown`): the row prints the profile's own band ("occasional", "common"), or is left out where that band is "absent". 33 towns of the 720. |

## What my marks read once BAR4-RECORD's gap line prints (the chair's question)

The mark follows the page's own gap line (`housesShortOfInput` reads `resourceGapLines`, house by house). CONFIRMED on
constructed records: each of the 61 EX-SPLIT rows of the 720, its town's record built so that nothing answers the house's
input (no goods made, sold or bought, the route isolated, no food source), prints the gap line, and all 61 rows then take
"Short of …" (59 lead with it; 2 in siege towns read the siege's mark first, then "Short of …"). Pinned in the guard, arm
(d): r2r-hamlet-9's Charcoal supply. So once that seat's cure prints the gap line, the rows are marked with no change of mine.

## Every new or changed line (THE VETO LIST)

No new words. These marks are new on rows that printed bare (the marks' words are the leaf's own, already on the list):
- "Curtailed by the siege." on a house on an imported input and its input rows (smelter, potter, brickmaker, bakers):
  r2r-metropolis-14 (metropolis), r2s-under_siege-city-2 (city), r2s-under_siege-town-1 (town). The smallest town it
  reaches is a town.
- "Stopped by the siege." on Armed escort, Mercenary hire (escort), Pack animal hire (journeys): r2s-under_siege-metropolis-0,
  bar0-hamlet-under_siege-rand-22 (hamlet), r2r-metropolis-14.
- "Scarce in the famine." on Street food, Drink service, Grain storage, Strategic grain reserves: r2s-famine-village-2
  (village), r2s-famine-town-1 (town), r2s-famine-city-1 (city).
- An income share's mark from its houses: r2s-under_siege-thorp-0 (thorp), r2r-village-21 (village, "Curtailed"),
  r2s-under_siege-city-0 (city).
- "Short of fish." on a fishing house no chain names, every fishery depleted (FS1): r2s-plague_onset-thorp-2 (thorp; the
  one town of the 720, none of the 300).
- "Stopped by the siege." / "(stopped)" on Mercenary hire "Off-duty soldiers available for escort" and Pack animal hire
  "… for journeys."; "Curtailed by the outbreak." on the same travel rows and Armed escort under an outbreak:
  r2s-under_siege-city-0 (city), r2s-plague_onset-town-1 (town), r2s-plague_onset-city-1 (city).
- The Magic tab's medical row: "Medical role: occasional" where it read "absent" beside the priest's divine healing:
  r2r-village-1, r2r-village-4, r2r-village-5 (villages).

## The books my cures move

THE BASE IS GREEN WHOLE (the chair's check of 8aef8e7d4, 08:28), so every red at my tip is mine. Run alone at my final tip,
each to a file through `sh scripts/gate-tail.sh`: BRIEF-BAR2's seventeen law suites, BRIEF-BAR3's three
(`engineCoreLazyEdge`, `tuningRegister`, `chainPrintSites`), BRIEF-BAR4's ten (`customContentPresentationClaims`,
`regenDerivedState`, `styleLaw.walker`, `deepCraftKillList`, `economicStructure`, `proseCorpusBytes`, `stressSecretDeclared`,
`tieProseDeclared`, `defensePostureAgainstItsFacts`, `corpusEcoTailGuards`), `generatorGoldenMaster`, the three corpus
walkers of BRIEF-BAR3's amendment 11, and the files that pin a symbol I changed (`crisisStoppedRows`, `bar2ServicesRows`,
`bar3ServicesRows`, `bar2MagicWords`, `bar3LabelWords` 1-3, `displayEconCrisisMarks`, `journalMarksCrisisRows`,
`tailExportsPdf2Batch2`, `tailExportsPdf3Batch3`, `generationWorkerLazy`, `observedShapeReaders`, `layerBoundaries`):
ALL GREEN BUT ONE, a stored register's row:

| test | arm | old | new | door | batch |
|---|---|---|---|---|---|
| `tests/lint/writerReach.walker.test.js` | "the surfaceReach grammar round-trips": `kind on gaps` | every surface N | `dossier-pdf=R foundry=R web-display=R` (the rest N) | `scripts/check-writer-reach.mjs --write` (its charter), the baseline `scripts/.writer-reach-baseline.json` | 1: a REAL reader of `resourceAnalysis.gaps[].kind` (`crisisStoppedRow.js :: housesOnImportedInput`), which the Services and Institutions tabs, the PDF and the journal reach (ruling WR1: named, not cured, never hidden). Green at 8aef8e7d4. |

TWO LAWS MY FIRST BUILD TURNED RED, CURED AT THEIR CAUSE before this push: `tests/build/domainGeneratorsBoundary.test.js`
(a new domain -> generators edge: `crisisStoppedRow.js` imported `incomeLineSiblings.js :: RESOURCE_ROW_TRADES`) and
`tests/build/vendorPdfLazy.test.js` (the engine chunk 878,561 bytes against its 878,554 ceiling, the generator module pulled
along with the import). THE CURE INVERTS THE EDGE: the trades' houses are DECLARED in my data file
(`crisisDependence.js :: INCOME_TRADE_HOUSES`, by catalogue id), and the guard's arm (e) pins that declaration equal to the
generator's own house words over the catalogue's names. The engine chunk now reads 878,553 bytes, the same as a build of
8aef8e7d4 (878,553): my cures add nothing to it. NOTE FOR THE CLOSE: the base's own engine chunk stands 1 byte under its
ceiling. ONE BUILD AND `verify:dist` AT MY FINAL TIP: see the last line of this section.

THE 525 REFERENCE CONFIGURATIONS: `generatorGoldenMaster` green at my tip: 0 of 525 move. The census's 720 records hashed
at 8aef8e7d4 and at my tip: 0 of 720 move (no generator reads a changed function).

THE INVENTORY DIFF (census3 `--count-only` at 8aef8e7d4 and at my tip, `inventory.py`, `inventory_diff.py`):
- the 720: 30,152 sentences -> 30,175; gone 0; new 23; fewer 20; more 5. Every line in fewer towns is a row that now
  carries its mark (it moves to its marked form) or "Medical role: absent" (602 -> 569, the 33 towns: it reads "occasional"
  in 21 and "common" in 5; in 7 the profile's band is "absent" and the row is left out, the tab's own rule). THREE OTHER
  LINES, "Patron deity" and its two premium-prompt lines (719 -> 716 in r2r-thorp-0, -2, -3), are AN ARTIFACT OF THE
  RENDER, NOT MY CURE: they drop from the first town a render worker draws; rendered again at my tip in another order the
  three print them and the first town drawn (r2r-thorp-5) loses them.
- the fresh 300: 21,856 -> 21,876; gone 1 ("Stone Quarrying" bare, 8 -> 0: it prints now with "Stopped by the siege.");
  new 21; fewer 16; more 4. The one line silenced that is not a row's own: "Contributes to Stone Quarrying - #% of income"
  (15 -> 9): a chain card leaves that line out where the leaf marks the share it names (`economicsCrisisMarks.js ::
  flowCrisisMarks`, batch 2 of TAIL-DISPLAY-ECON-4): the share is now marked stopped, and the silence is true.
- THE INHERITORS read: the widest are the rows' marked forms ("ServicesIron refining (curtailed)", "ServicesGrain storage
  (scarce)", "ServicesArmed escort (stopped)", "Stone Quarrying Stopped by the siege.", "Medical role: occasional").

THE ANNEX: no block of `docs/content/RECEIPT_POOLS_DOSSIER_STATE.md` is mine and none moved; no shared stored file is
re-taken.

THE FINAL LINE: at my final tip, ONE `npm run build` (exit 0) and `npm run verify:dist` (exit 0: "STRICT DIST OK — 67
discovered/reported file(s), 603 test(s), zero failed"; its boot smoke passes), then `dist/` removed, then
`bar4MarkPromise`, `crisisStoppedRows` and `chainPrintSites` re-run alone: all green. The type ratchet and the strict-domain
gate hold their ceilings (167; 1113); eslint clean on every touched file.

## Registrations owed

- None under `tests/generators` (the guard is `tests/domain/bar4MarkPromise.test.js`: no manifest entry owed).
- No new import of a goods module (amendment 12) and no new src -> generators edge (the trade table is declared in
  `crisisDependence.js`; only the guard test reads `incomeLineSiblings.js`).
- The writer-reach register's row for `kind` on `resourceAnalysis.gaps` (above): owed to the close, through its door.

## Left, in order (for a successor)

1. C46104's K6 split is BAR4-RECORD's (the chair, 08:00): my marks follow its gap line (above). Nothing else is left of my
   worklist.

## How the instruments are re-made

`git archive` of `docs/chair/2026-11-14/probes/READ-ALL` (chair's lane) and `.../CENSUS-3` (census lane) to the scratch
directory. Records alone (enough for the detector): `TREE=<tree> OUT=<dir> SEEDS=<seeds file> node CENSUS-3/births.mjs`
(the 720: `seeds.txt`; the fresh 300: packets11's `seeds.fresh300.txt`; the read towns: packets10's `seeds.bar4.txt`).
The count: a twenty-line script over `corpus.ndjson.gz` that imports `<tree>/tests/helpers/markPromise.js` and tallies
`markPromiseInstances(s)` by `kind` (and `excluded`), town and line. The page census and the inventory diff as before:
`census3.sh <tree> <out> 4 --count-only` (with `--seeds <file>` for the 300), `inventory.py`, `inventory_diff.py`.
