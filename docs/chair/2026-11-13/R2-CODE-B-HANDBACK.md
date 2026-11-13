# R2-CODE-B — the hand-back (kept current after every item)

**Lane:** `lane/r2-code-b-2026-11-13`, cut from `lane/integration-2026-11-07` at **e969a75b7** (the line's tip as found, 2026-11-13 ~14:50 UTC).
**Seat:** R2-CODE-B, a builder of round two. **Chair:** session_01FE9mEws7PXYRYdjQPbSX15.

## The brief's rulings, copied (the chair's messages are not on the branch)
- Cure the 51 MEDIUM rows of the cold list REVIEW-W2A-3 (f385d487b, `debt/final.json`, status "untouched") whose listed file is one of 24 named files; find the true writer of each row first. A true writer outside the list: take it if no lane in flight changed it and it is not named to another seat; else it is a stop for that row.
- Named to others, never mine: narrativeText.js, npcGenerator.js, stressInstitutionEffects.js, foodBalance.js, narrativeData.js, powerSiblings.js, npcData.js, narrativeGenerator.js (R2-CODE-A); validationOnPage.js, defenseDisplay.js, EconomicsTab.jsx (third leaves seat); safetyProfile.js, economicState.js, the defence generator and display, keep.js, dossierViewModel.js (upkeep lane); the catalogue files, historyData.js, historyGenerator.js, arrivalProse.js, cultureProfiles.js, the roster's assembler (data lane); the corpus (corpus lane); src/generators/power/, src/generators/people/, src/domain/people/, npcStructure.js, factionCompetition.js, powerSentenceName.js, PowerTab.jsx and children (powers follow-up); resourceGenerator.js, structuralValidator.js, computeActiveChains.js.
- Work by mechanism, widest first; measure first over the census's 720 + the reviewer's 20 in the app's own shape; red first, one cause per commit; receipts.
- The page states facts in plain words and never the machinery. A line is in its pool unless the town makes it false; a refused pick resolves draw-free to the next admitted row; a case left empty gets a line true in it; never delete a line true somewhere.
- No new key in the record, no change of its shape; no new word in the vocabulary file (park with what it needs). Display files: no byte of any generated record moves (field diff over the 720).
- Size ruling (the chair, 2026-11-13, the instrument lane's standard): plural streets, an agora, a civic or market square, building in masonry, neighbourhoods and suburbs are a size error in a thorp or a hamlet; quarters and districts are a size error below the middling population band.
- The Defence tab's food-endurance line is defenseDisplay.js (third leaves seat): name the switch, do not make it. The foundations "Trade connectivity Adequate" rows: measure, park a changed reading; cure only a word.
- Push after every item and before any long run; read notifications after every commit; message the chair only for a total stop, once when mechanism 1 is pushed, and the hand-back.

## Base, instruments
- Base e969a75b7. Lanes in flight checked (merge base → tip, `git diff --name-only`), 2026-11-13 ~14:55 UTC: coherence-agree 69b53decd, coherence-upkeep 65cb03ef1, coherence-veil 333b33973, w2-a-leaves 817980b33, w2-c-leaves 4534ea5e3, w2-write 4f52408b7, w2-fix-data 5e0060000, w2-b-declare c3913f999, r2-code-a 425784da4, powers-follow-up 7b3f3b692: **none changes any of the 24 files.**
- Renderer: the census's `render.census.jsx` with the census's 720 seed names and the reviewer's 20 all in the app's shape (`selectedStresses`, `selectedStressesRandom:false`; calm = []), records written beside the dumps. Per-row counter by script (`measure.mjs`, in the scratchpad; summary numbers below).

## Items
| item | rows | commit | state |
|---|---|---|---|
| 1a service row machinery | #249 #251 #430 #550 #607 #690 #692 #693 (chip), #865 (covers), #85 #246 (provenance tags) | f2c77472c | cured, pushed |
| 1b house label | #140 #960 (NPC door), #269 #444 (chain card rank) | 231798731 | cured, pushed |
| 1 Outlook list "Taverns (5-20)" | #939 | — | STOP: writer `src/generators/economy/viability.js` (changed on six lanes) |
| 2 YOU badge | #893 #894 | 9cd4f7306 | cured, pushed |
| 3 stores span, one home | #149 #856 #872 | aaf314475 | cured, pushed; #883 (Defence line) named, not made |
| 4a Relationships empty line | #29 #60 | 49a6ad244 | cured, pushed |
| 4b Daily Life food tile | #848 | 9cee7f470 | cured, pushed |
| 4c crisis cast (defender, treater) | #328 #855 | 90bafc4d1 | cured, pushed; RECORDS MOVE: stress[].cast in 17 of 740 |
| 4d "The Market Contest" | #536 | 742ff4e43 | cured, pushed (display filter; 0 records move) |
| 5 culture scope line at size | #323 #365 #498 #816 | 922fe5141 | cured, pushed ("an assembly ground" has no home: named) |
| 5 "A road settlement" | #63 #369 | — | STOP: needs `narrativeGenerator.js :: generateSettlementReason` (R2-CODE-A's) |
| 6a famine harvest, wartime profit | #857 #670 | 111e8b152 | cured, pushed; RECORDS MOVE: stress[].summary in 46 of 740; "in a kingdom" parked (no sovereignty atom) |
| 6b faith line: access to a church | #180 | ffe89ab39 | cured, pushed (25 -> 0; the quiet line now names no shrine it lacks) |
| lighting census re-frozen | the lane's new test files | 608cbdd9b | its own door, clean tree; verified 34/34 |
| ruling R1: the PDF's chain rows | (finding 3 of REVIEW-R2-STAGES) | c1efd7f93 | cured, pushed |
| ruling R2: the wiring census | (finding 5) | 938a6b1d4 | re-made by `node scripts/wiring-census.mjs`, its own commit |
| fix-forward, tests | anchors; loops for test.each | 60f9383a9, 9bbde2599 | pushed (no assertion changed) |
| writer-reach strike | item 2's lit row | e7fd7c7d8 | pushed (shrink-only `--write`) |

## Stops and parked items (with recommendation)
- **#939** — "11 institutions critically impaired by siege: …, Taverns (5-20), …": written by `viability.js :: issues` (`critical.map(d => institutionDisplayName(d.institution))`). The switch: read `institutionHouseLabel` (or `houseInProse` in a sentence). Recommend: the lane that next holds viability.js takes it.

- **#883** — the Defence tab's food endurance ("carries the town for a few weeks at full rations, a few weeks on half" at three days of stores): `defenseDisplay.js :: monthsInWords` (the third leaves seat's file). The switch: for a span under a month, read `tonightSheet.js :: storesSpanWords` (the one home, item 3).

## THE EXACT NEXT STEP (the seat handed back by file at ~400k tokens of context, 2026-11-13 ~18:45 UTC)
Tip at hand-back: the branch's last commit (this file). Line base unchanged: e969a75b7. The scratchpad (base render of the 740, gz records, births at each step, the PDF census, the tools `measure.mjs`, `births.mjs`, `fielddiff.mjs`, `pdf.census.jsx`, `pdfrun.sh`) is in the seat's container only.

**Rows not yet begun, widest first (base counts on the 740, app shape):**
1. **#804 "Hunting grounds"** as a chain card's "From" where the town has none (75 chains in 77 towns; every one an entrepôt `furs_north` with `resourceCondition` "absent", `resourceInputAvailable` false). Writer: `SupplyChainsPanel.jsx :: chainFlowFacts` (`resource: chain?.resource`). Cure: `resource` null where the record says `resourceInputAvailable === false` (a legacy record without the field keeps it). Display only. The PDF prints the same field (SupplyChainFlow.jsx, Services.jsx `chain.resource`): same switch there.
2. **#452 "Needs: Tannery, Leatherworkers' guild"** beside "Tanner (established)" (38 towns print "Needs: … Tannery" on Resources). Writer to confirm: `src/data/resourceChains.js` (the gap's `missing` list) and its reader; the gap should read the roster's tanner by the shared join.
3. **#191 #381 #513 finished-goods pills** (`src/data/finishedGoodsCategory.js`): advanced weapons from one part-time smith; mountain timber imported into a forest hamlet with a woodcutter's camp; salt imported beside its own salt works. Each needs a disqualifier read from a home (the chain model, the roster); a depleted or worked-here reading that needs a new vocabulary word is parked.
4. **#312 "keep the work going"** at a worked-out quarry (`src/data/people/goalFamilies.js`; 3 towns by the measure's filter). Generator-side (goals): records move; the goal draw must stay draw-free.
5. **#370 #371 #672** (`src/data/stressTypes.js`: "Fewer people come to market" with no market, "The healer who identified the outbreak" with no healer, "A crown officer" in a self-governing city): the entry's `crisisHook` and `viabilityNote` are written at roll time (`stressGenerator.js :: buildStressEntry`, before the roster exists). STOP: the resolution site is assembly (`src/generators/steps/assembleSettlement.js :: rerenderStressSummary`, the upkeep lane's file), where `factsOf` is in hand; "a crown officer" also needs a sovereignty atom the vocabulary lacks (PARK, with #670's "in a kingdom").
6. **Mechanism 7:** #215 the isolated shortfall's "the caravans that still come, the roads in a good season" under a siege — the channel list is written in `narrativeGenerator.js :: generateSettlementReason` (R2-CODE-A's): STOP. #257 #437 "Wool & Textile Trade … bought from pastoral regions" under a siege or an impaired textile chain — find the true writer (the list says treasury.js). #329 #858 "Trade connectivity Adequate" under a siege — the foundations reading (`causalState.js`, the upkeep lane's; `SubstrateTab.jsx`): measure what the reading takes from a siege and PARK (a changed reading is a ruled design).

**The final statement (not begun):** the whole suite once at the final tip (`git fetch origin review-fixes-2026-07-08:review-fixes-2026-07-08`; `npx vitest run --maxWorkers=2` to a file), every red classed against the line's own failing set at e969a75b7 (base reds seen here: tests/lint domainAnyCastBaseline, ledgerCitationIntegrity, newsHeadlineContract, newsVoiceContract, proseFamilyContract ×4); the census counter base against tip (`origin/lane/second-wave-census-2026-11-12`'s census.sh); the 720 field diff by family; ONE draft shift record named for the lane; the edge bundles as the last commit, alone.
**Known reds at the tip, the merge seat's:** tests/property/generatorGoldenMaster.test.js (items 4c and 6a move records), tests/generators/institutionBudgetPromise.test.js (seeds 27, 36 by item 4c), and the PDF golden where chain rows printed a count (items 1b and R1).

**Generated-record moves, measured (births of the 740, before against after each commit):** items 1a–4b, 4d, 5, 6b, R1: 0 of 740. Item 4c: 17 towns, `stress[].cast` only. Item 6a: 46 towns, `stress[].summary` only. No person, roster, draw or other field moves.

## Count ranges and catalogue gates still printing (the chair's ruling: list, do not cure; the class is ruled whole)
Measured at c1efd7f93 on the 740 records (the PDF's canon dossier, by section) and from REVIEW-R2-STAGES §6 (the page, its 20 towns). Each writer, and whether a lane in flight holds it (merge base → tip, 14:55 UTC / 18:20 UTC):
- the Outlook's list "N institutions critically impaired by siege: …, Taverns (5-20)" — `src/generators/economy/viability.js` — HELD (six lanes);
- the Crisis tab's cast rows ("Mills (2-5) · held by …") — `src/domain/crisis/crisisCast.js` row `name` (str(i.name)) and its page reader `src/domain/crisis/crisisPage.js` — not held;
- the crisis hook "The conversion turns on the houses of worship (50-100+)" (page, PDF Plot Hooks and Tonight chapters) — `src/domain/crisis/crisisHooks.js :: houseInProse` (its pattern misses a trailing "+") — not held;
- the Power tab's house lists — `src/components/new/tabs/PowerTab.jsx` and children — HELD (the powers follow-up);
- the PDF's "Who Runs This Town" (184) — `src/pdf/sections/WhoRunsThisTown.jsx` — not checked against lanes here;
- the Services tab's provider headings (the roster's own names) — `src/components/new/tabs/ServicesTab.jsx` — not held;
- the Institutions roster (page and PDF, 1,766 in the PDF) — `src/components/new/tabs/InstitutionsTab.jsx`, `src/pdf/sections/Institutions.jsx` — the catalogue name the roster prints by ruling ODQ §934.13;
- the PDF's Notable NPCs (236: the house with its range, the PDF twin of item 1b's NPC card) — `src/pdf/sections/NotableNPCs.jsx` — not held;
- "Gates (if walled)" — mapped to "Town gates" by the seam for its exact key; where it still prints, a reader bypasses the seam (REVIEW-R2-STAGES §6 counts 2);
- "Via: major monasteries (5-10)" on Economics — `src/components/new/tabs/EconomicsTab.jsx` (the services-with-institutions row, `svc.institutions.map(institutionDisplayName)`) — HELD (the third leaves seat);
- the PDF's Crisis sections (73), Defense (4), Viability (2), History (1) — roster names in their rows.

## The chair's rulings received
- 18:45 UTC (read 18:50): ROUND THREE'S LIST FOR THIS LANE — NOT STARTED by this seat (past 300k tokens of context: the chair's own condition; a successor takes it). The cut: `lane/round-3-cut-2026-11-13` (3bae61499), docs/chair/2026-11-13/ROUND-3-CUT-2026-11-13.md §2, §6, §6b, §7 and ROUND-3-CUT.json (`lines`; filter by `package` "lane rb" and by `writer.file`). Package "lane rb": 56 high, 73 medium — serviceComponents.jsx (the Services headings, 53), tabs/InstitutionsTab.jsx (the roster, 48), domain/display/institutionDisplayName.js (11), npcComponents.jsx (8), settlementQuickGuide.js (3), crisis/crisisCast.js (3), tabs/DailyLifeTab.jsx (3); and, so ONE lane holds a house's label on every surface: tabs/CrisisTab.jsx, tabs/power/PowerStrata.jsx, tabs/WhoRunsThisTownPanel.jsx, the Outlook's list (ViabilityTab and src/generators/economy/viability.js), and the PDF's sections that print a house's name. NOT this lane's: src/pdf/sections/DefenseSecurity.jsx, tabs/DefenseTab.jsx, HistoryTab.jsx.
  RULED (a) THE HOUSE'S LABEL: ONE display leaf read on EVERY surface, both PDF variants (build on chainHouses.js and institutionDisplayName.js). It strips count ranges, household ranges and floors, population gates ("(10,000+ only)"), conditions ("(if walled)") and magic gates ("(high magic)"); a count word is a plain plural from the display-name table ("Inn (multiple)" reads "Inns"), never a parenthesis; in-world qualifiers STAY ("(part-time)", "(established)", "(open cast)", "(guild)", "(district)", "(resident)"); the table's own ranges ("Houses of worship (10-30)") are in scope; no count line added; catalogue names, the record and every golden's keys unchanged (display only). ACCEPTANCE: probes/ROUND-3-CUT/classes.mjs (918 occurrences on the twenty towns at the line's tip) at ZERO for ranges and conditions on the page, both PDF variants, the Foundry journal and the Tonight sheet; thirty labels read in their towns. EconomicsTab.jsx's "Via: <house>" label: touch that line only, named as shared.
  RULED (b): "REQ" leaves the roster and every surface of this lane's (224 on the roster of the twenty towns); "YOU" stays where true.
  RULED (c): the crisis cast's "the one with the least say" prints only in a house of more than one.
  HOW: HIGH first; each writer its own commit, measured first in the app's shape and on the reader's own town, red first; the false sentence gone and what prints in its place read true; a claim of zero counted on every surface; a `round2` line may already be held: cure once; new wording listed with its town; the lane's final statement comes AFTER this list, once.
  NOTE FOR THE SUCCESSOR: item 1b's institutionHouseLabel (institutionDisplayName.js) already strips digit-led counts and "(high magic)", "(if walled)"; chainHouses.js reads it; the page NPC card and both chain-card surfaces read it. Ruling (a) widens it (household ranges, "(multiple)" plurals, the table's own ranges) and points every surface at it.
- 18:08 UTC (read 18:22): REVIEW-R2-STAGES at be53f933b (NOT CLEAR, 1 medium, 1 low). R1 (MEDIUM): the PDF's chain rows read the leaf chainHousesOf; acceptance counted on the PDF's text; "a claim of zero is counted on every surface: the tabs, the Tonight sheet, the PDF's text, the Foundry journal and the exports". R2 (LOW): re-take the wiring census by its own writer in its own commit. List the writers of the count-range and gate class, do not cure them. Do not rewrite a commit at or below 80b960171.
- 17:13 UTC: the pause lifted ("Oh we have plenty of usage", the owner). Carry on from the next step, the generated-record rows measured first and draw-free, then the final statement. Hand back near 400k tokens.
- 15:52 UTC (read 16:01): THE ACCOUNT'S WEEKLY ALLOWANCE IS IN ITS WARNING BAND. PAUSE: finish only the mechanism already under way (mechanism 4), push it, keep this file current with the exact next step, then STOP and wait for the chair's word. No new mechanism, no whole suite, no final statement. One line to the chair with the tip when stopped.

## Calls taken without the chair
- Took `src/components/new/SupplyChainsPanel.jsx`, `src/pdf/sections/Services.jsx`, `src/domain/display/institutionDisplayName.js` (one new export) and a new leaf `src/domain/display/chainHouses.js`: no lane in flight changes them, none is named to another seat.
- Re-recorded, each with its cause in the commit: the phone chrome floor ROUTE_BASELINE (-1 ×3), the dossier phone floors World/NPCs (-2), three address-only rows of the prose-numerics baseline.

## New words (for the owner's veto)
- Items 1a/1b remove words; the house label is the existing label minus its bracket.
- Item 3: the stores span "less than a day", "about a day", "about N days", "about N weeks".
- Item 4a: "No neighbours or ties between people are recorded for this settlement." (the old line less its last claim).
- Item 4c: "the defence of the place, with no one named to lead it"; "a member of the merchants' power, with the seat itself in dispute".
- Item 5: "run by patronage and law" standing alone; "built on tribute and the ritual calendar"; "built on tribute, market and waterworks"; "built around kin and an assembly ground"; "kin by kin"; "built around courtyards".
- Item 6a: "{name} has gone short of food for a second season."
- Item 6b: "…, and no god is named here." 
