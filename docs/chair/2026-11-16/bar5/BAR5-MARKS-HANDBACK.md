# BAR5-MARKS · HAND-BACK · what the crisis stops is not on offer unmarked (LAW 2's rows of a house or a service)

**STATUS: FINAL.**

- Base: `600b7683a`, the joined line. No later tip.
- Branch: `lane/bar5-marks-2026-11-16`. Its tip is the commit that carries this file.
- The audit branch `lane/bar5-audit-b-2026-11-16` at `d40d6ab28` is merged `--no-ff`. It adds helpers and documents only.
- No pull request, no master, no deploy.

## THE RULES

How the counts were taken:

- Every count is instances / towns of my six rules.
- They are read by the audit's runner (`docs/chair/2026-11-16/bar5/AUDIT/runB.mjs`) over the PAGE-COPY render of each tree. A render is `census3.sh … --count-only`, with the seed files `seeds.sixty` (bar4 + bar5), PAGE-COPY `seeds.txt` (the 720) and `seeds.fresh300.txt`.
- **BEFORE** is at `600b7683a`. It reproduces the audit's own tables exactly in all three populations.
- **FACT ALONE** is the facts and dependences only, the line twins left out. It was rendered over the 67 towns where my rules fired at base, and read with the corrected detector.
- **AFTER** is the tip render. It was read with this branch's detector: one correction and two named exclusions, both below.

| rule | the two readings, and where each is written | the one fact made | before: sixty · 720 · fresh 300 | fact alone | after (all three) |
|---|---|---|---|---|---|
| L2.war.iron | the war's iron hook (`economy/foodBalance.js`, stored on `economicViability.plotHooks`, category `Strategic Resource`) vs the mark leaf, which could not reach a war (`crisisStoppedRow.js :: STOPPING_CRISES`) | `src/domain/facts/warReach.js :: warTakesOf` (WM1). The new dependence word `iron` is on the forges (blacksmith, blacksmiths_3_10, resident_smith_part_time). Mark: "Curtailed by the war." | 8/2 · 9/4 · 25/10 | 0 | **0 · 0 · 0** |
| L2.war.animals | the paddocks line (`narrativeData.js :: STRESS_DESCS.wartime`, stored on `arrivalScene`) vs the same | the same leaf. The new word `working animals` is on the stable district, the pack-animal trader, and horse, carriage and pack-animal hire | 2/1 · 5/2 · 2/1 | 0 | **0 · 0 · 0** |
| L2.siege.cutgood | the herbs "from outside, which the siege has cut off" (`chainNeedShown.js`, from the record's imports) vs the herb houses, declared NONE (or `input` with no import reading) | `crisisDependence.js :: INPUT_IMPORTED_AS`: a herb house whose input the record imports by name is on an imported input under a siege, "Curtailed by the siege." (`crisisStoppedRow.js :: housesOnImportedInput`). `INCOME_REMEDY_HOUSES`: the remedies' income shares read their herb houses | 5/1 · 15/3 · 17/5 | 0 | **0 · 0 · 0** |
| L2.siege.abroad | each description's own outside trade vs its row's dependence (NONE) | on the row where the house's trade is outside by its own words: the stable district and the pack-animal trade `travellers`, their in-town rows freed (SV7, so the house reads "Curtailed"); the apothecary district `imported input` (its own "imported medicines") | 13/6 · 24/12 · 55/28 | 6/5 · 13/9 · 33/22 | **0 · 0 · 0** |
| L2.famine.meat | the food record's "no herds, nothing comes in" vs `stoppedBy('famine')`, which stops only the failed source | `crisisStoppedRow.js :: noHerdsHere`: under a siege, the meat of a town whose food sources name no livestock, whose pastoral chain is off and where no herd house stands is stopped | 4/2 · 0 · 8/4 | 0 | **0 · 0 · 0** |
| L2.famine.work | the famine's "no one can earn a normal living" vs the cobbler's lines, which were declared colour | none: this rule is cured by line (below) | 1/1 · 1/1 · 0 | 1/1 · 1/1 · 0 | **0 · 0 · 0** |
| **all six** | | | **33/9 · 54/19 · 107/39** | **8 · 18 · 36** (the audit's own detector) | **0 · 0 · 0** |

**What the fact left, cured line by line.** These are the lines true of only part of their house's trade (K3, K5):

- **The bowyers' caravans.** Six descriptions declare `excludes: crisis: under_siege`, each with a twin: "… With the roads cut, all of it goes to the town's defence." The house is not stopped, by the chair's S8.
- **The cobbler's steady work.** Three lines declare the famine, each with a twin.
- **The free company's caravan escort.** Three lines, each twinned.
- **The great cathedral's pilgrims.** Three lines, each twinned.
- **The bodyguards' merchants and travellers, and the monastery's pilgrims.** Service twins (`SERVICE_DESC_SIBLINGS`), with the siege declared on each definition: the service roll resolves only what a definition declares.
- **The house twins are in `DESC_LATE_SIBLINGS`.** A siege or famine drawn at random is settled after the description draw: r2r-metropolis-14 printed the bowyers' caravans beside its siege with a draw-time twin. So the late re-read resolves the twins against the settled record. No draw moves.

**Named exclusions** (page detector, `tests/helpers/pageLaws/law2.mjs`):

1. `L2.siege.abroad`: the record's own account of the past, printed on the Overview as a tension (`history.currentTensions[]` and `historicalEvents[]`). The text is "A claimed miracle or relic drew pilgrims … changed it for good". Measure rule 2: the past states its own fact. It is 1 instance in the 720 (r2s-under_siege-city-2). The line is `historyData.js`, no file of mine.
2. `L2.siege.cutgood`: the income line that itself says its herbs run short (`incomeLineSiblings.js :: REMEDIES_SHORT_LINE`, "… but few, while the herbs and reagents they need run short"). It is 1 instance (bar0-city-under_siege+famine-rand-101).

**One detector correction.** An Economics income row prints its title, then its mark: "Apothecary & Alchemy Curtailed by the siege. Remedies …". The detector read only a mark that leads the sentence, so it found 7 marked shares as bare. On the controls this is unchanged: all 22 STANDS are still found in the sixty at base, and no EXPLAINED control is found.

**THE GUARD** is `tests/domain/bar5MarksLaw2.test.js`, with the record form of the six rules in `tests/helpers/pageLaws/law2Marks.mjs`. It passes at tip.

- **(a) The zero over the census's 720 births.**
- **(b) Positive controls, the marks read blind:** r2s-under_siege-metropolis-0 (abroad), r2r-metropolis-14 (cutgood), r2s-wartime-metropolis-0 (animals).
- **(b) Constructed control of the war:** the calm city r2r-city-0, with the war and its two lines written on, gives the read's C8174 and C8475. The smiths' Repairs and Horse hire read "Curtailed by the war.", and blind both rules fire. The calm record keeps its rows bare.
- **(b) Constructed control of a twin:** the cobbler (C43575) and the bowyers (C5452), each original written back from the late table, are found.
- **(c) The paddocks line `warReach` reads is the pool's own line, once.**

**LAW 5 (my files), the static inventory:**

- **Before: 71**, by the audit's own inventory at base. That is institutionDescVariants 28, institutionServices 20, institutionalCatalog 23.
- **After: 0** at tip.
- **How:**
  - the facts and the twins above;
  - the shepherds' flocks carrying the herds a famine can fail (`food: livestock`);
  - six widenings of `AUDIT/law5-inventory.mjs`, each where it misread:
    - W1: a text in a sibling set and a column declares the union, as `institutionDescDraw.js :: lift` reads it.
    - W2: a line declaring another fact is still covered by its row.
    - W3: the catalogue's own descriptions belong to their house.
    - W4: each lexicon class reads its own crisis's row words (outside: what a siege stops or curtails; iron and animals: the war's two words; plenty: the food words).
    - W5: a twin is read in its original's row.
    - W6: a service row carries its house's dependence (SV1), less what `SERVICE_FREE_OF_HOUSE` frees.
  - 17 reviewed exclusions (`EXCLUDED_LINES`, each with its reason).
- **Measured on the same widened inventory:** 47 at base, 26 with the exclusions, 0 at tip.
- **The lexicon controls** read as the audit's: 11 of the 12 STANDS are caught, the same miss (C0927), and every source is now declared.
- **For the seats that read the inventory:** W1 to W6 also lower other files' undeclared counts at base, from 158 to 134 of 244.

**ALSO MINE BY NAME. C42840 is cured.** "Collects the lord's dues and the tithe" now reads "Collects the dues owed and the tithe" (Village headman). It names no lord the record does not hold. LAW 4's detector is BAR5-PEOPLE's.

## WHAT IS LEFT, IN ORDER

1. **OCCUPIED TOWNS THAT PRINT THE WAR'S IRON HOOK** beside an unmarked smith row. The chair's WM1b leaves them this round.
   - Counts: **2 of the 720** (r2s-occupied-town-3, r2s-occupied-city-1) and **1 of the fresh 300** (bar0-town-occupied-rand-108). The sixty hold one too (bar0-town-occupied-rand-22).
   - The reading the hook itself prints on: `economy/foodBalance.js` writes the war line where `factsOf(…).warState !== 'peace'` (an occupation reads `at war`, `facts/warState.js`). It is stored as `economicViability.plotHooks[]`, category `Strategic Resource`.
   - The next wave marks from that same fact. `warReach.js :: warTakesOf` would read `warStateOf(record) !== 'peace'` for the iron, in place of the wartime crisis. It should use the **short** mark, "Short of iron." (`crisisStoppedRow.js :: shortMarkText`, the S5 form), not the war's.
2. The siege's meat reading covers livestock only. The same "nothing comes in and none is raised here" is not read for grain, fish or game: they keep their stores. No instance shows it.
3. Nothing else of my six rules is left in the three populations.

## THE VETO LIST

Each new or changed line, with the towns it is read in at tip (sixty, 720, fresh 300). Every new line prints only under its crisis.

| line (new or changed) | towns |
|---|---|
| mark "Curtailed by the war." | 6 of the 720 and 12 of the 300 (r2s-wartime-city-2, r2s-wartime-metropolis-0, bar0-city-wartime-rand-24) |
| mark "Curtailed by the siege." on the stable district, the pack-animal trader, the apothecary district and its herb rows, and the remedy shares; "Stopped by the siege." on horse hire and the meat of a town with no herds | the siege towns where those rows print (r2s-under_siege-metropolis-0, bar0-city-under_siege+famine-rand-22, bar0-city-under_siege+famine-rand-24) |
| bowyers' twin "… With the roads cut, all of it goes to the town's defence." | r2r-metropolis-14, r2s-under_siege-metropolis-0, bar0-city-under_siege+famine-rand-22 |
| bowyers' twin "… With the caravans cut off by the siege, the town's defenders buy all of it." | r2s-under_siege-metropolis-2, bar0-city-under_siege+famine-rand-24, bar0-city-under_siege+famine-rand-106 |
| bowyers' twin "… While the siege lasts it supplies the town's defenders, and no caravan." | r2s-under_siege-city-0, r2s-under_siege-city-3, bar0-city-under_siege+famine-rand-102 |
| bowyers' twin (town) "… No caravan comes while the siege lasts, and every sheaf goes to the town's defence." | r2s-under_siege-town-0, r2s-under_siege-town-3 |
| bowyers' twins (town) "… While the siege holds the roads no caravan comes …" and "… With the roads held there are no caravans to restock …" | printed in none of the three populations |
| cobbler's twins (three; "… in the famine …") | r2s-famine-village-0, bar0-village-famine-rand-26, bar0-village-famine-rand-117 |
| free company's twins (three: "With the roads held there is no caravan to escort …", "No caravan leaves while the siege holds the roads …", "While the siege holds the roads they hire out by the day for garrison duty and the town's defence …") | printed in none of the three populations (a free company under a siege is rare) |
| great cathedral's twins (three) | r2s-under_siege-metropolis-0, -2, -3, r2r-metropolis-14 |
| bodyguard service twin "Personal protection for officials, and for anyone with reason to fear for their safety while the siege lasts." | 5 of the 720 and 12 of the 300 (r2s-under_siege-city-0, r2s-under_siege-city-2, bar0-city-under_siege+famine-rand-23) |
| monastery service twin "Rites, prayers, and observances, open to all; no pilgrim reaches the house while the siege holds." | printed in none of the three populations |
| "Collects the dues owed and the tithe" (reworded) | 5 of the 720 (r2r-hamlet-29, r2r-village-11, r2r-village-21) and bar0-hamlet-under_siege-rand-102 |

## THE NET

Each file was run alone, through `gate-tail.sh`, at `600b7683a` and at tip. 51 files; my guard was added at tip.

**Red at base and at tip with the same failing arms.** These are named, not chased:

| file | failing arms (base = tip) |
|---|---|
| tailHouses1Gaps | 1 |
| generationForkCensus | 3 |
| pipelinePinnedMode | 3 |
| tieProseDeclared | 2 |
| observedShapeReaders | 4 |
| proseCorpusBytes | 2 |
| proseTasteCorruption | 1 |
| proseWiringCensus | 12 |
| tuningRegister | 1 |

Three more are red at base and at tip with a moved figure; they are in the books table below: colourMarks4h, presumedThings and writerReach.

**Red at tip only, each classed:**

- `houseDescLateReRead`: a stored count (below).
- `institutionProseDeclared`: a ledger row (below).
- `bar3ServicesRows`: a LAW, my regression, **cured**. A siege hamlet's shepherd and dairy farmer read "Stopped" when no herds were in the ledger; a herd house standing now keeps the herds.
- `proseDrawnAnchors`: a LAW, **cured**. My guard's literal anchors are now computed from the late table.
- negativeAssertionAnchor and seedLoopTotality: green.

**Build and `verify:dist`** at tip and at base:

- The build is green in both.
- `verify:dist` refuses in both, on the same stored figures (the edge bundles, the size ceilings, the goods roster; amendment 1). The moved figures are in the books table.

## THE BOOKS MY CURES MOVE (named, not re-taken)

| test · arm | old → new | door |
|---|---|---|
| `tests/generators/houseDescLateReRead.test.js` · the table | `DESC_LATE_SIBLINGS` length 11 → 26 (my 15 late twins) | that file's own count, at the close |
| `tests/data/colourMarks4h.test.js` · the descriptions | the colour column 492 → 490 (the cobbler's two lines now declare the famine) | the census ledger `docs/census/declarations/institutionDescVariants.INSTITUTION_DESC_VARIANTS.json` |
| `tests/generators/institutionProseDeclared.test.js` · each definition carries exactly the ledger's declaration | the "Tithe and dues" ledger row: "Collects the lord's dues and the tithe" → "Collects the dues owed and the tithe" | the services' declaration ledger |
| `tests/lint/presumedThings.walker.test.js` | +18 fresh hits, all in my twins and keys (armedForce, garrison, watch, temple, quarters) | under PT3, true where they print: each names the house itself, or keeps the original's own declared needs. The door is `presumed-things-door.mjs` at the close |
| `tests/lint/writerReach.walker.test.js` | a new real reader: "Pastoral & livestock on chains" (`noHerdsHere`); the frozen counts 1413 → 1412 | WR1: the register's row, at the close |
| `verify:dist` · `generationWorkerLazy` worker ceiling | 2,356,121 B → 2,369,775 B (+13,654 B) | the size ceilings |
| `verify:dist` · the first-paint closure | gzip 362,611 → 362,613 B; Brotli 304,357 → 304,329 B | the size ceilings |
| `verify:dist` · `engineBundleReplay` fence | 248 → 249 of 360 differ | the edge bundle, `npm run build:edge-shared` |
| the reference (amendment 3) | **0 of the 525 configurations move.** The reference corpus selects no crisis and no Village headman tithe row | none |

**Registrations owed.**

- None to the mutation manifest: my test is under `tests/domain`.
- No goods-roster row: no new goods import. `crisisStoppedRow.js` now imports `canonicalAccessors.js` (`canonImports`), which is no goods module.
- The annex: my section names no blocks; nothing regenerated.

## FOR THE OWNER, IN PLAIN WORDS

When a town is under siege, at war or in famine, its pages used to offer things the crisis had cut off with no mark on them. The bowyers sold to caravans that could not come. The apothecaries' herbs were imported while the siege had cut them off. The smiths offered tool repairs while the war had taken the iron. The stables hired out horses the army had taken.

I fixed this mostly at the root, not line by line:

- **The war.** The page already says what the war took: the iron hook, and the line about the horses' receipts. The marks now read that one fact, so those rows say "Curtailed by the war." This is your chair's ruling WM1, and you can veto it.
- **Herbs and meat under a siege.** The same holds for herbs the town imports, and for meat in a besieged town with no herds of its own.
- **One reading for both.** The mark and the sentence it answers now read the same fact, so they cannot disagree.

That alone removed two-thirds of the false lines. The remaining lines describe only part of a trade. The bowyers also arm the garrison; the cathedral still holds its rites. So those got a second wording, which prints only during the crisis.

Across 60 read towns, the census's 720 and 300 fresh towns, these six kinds of false line went from 194 to 0.

Your reference set of 525 towns does not change.

One case is left on purpose: an occupied town can print the war's iron line beside an unmarked smith. That is 2 towns of the 720 and 1 of the fresh 300, with the fix written down above for the next round.
