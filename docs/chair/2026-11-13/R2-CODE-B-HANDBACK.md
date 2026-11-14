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

---

# PART 2 — R2-CODE-B-2, the second seat (round three's list for this lane)

**Seat:** R2-CODE-B-2 (session_01FE9mEsvRCQQpZm8mEtEsz3). **Tip read back from origin at start:** 62e30c7e7 (as the brief gave it). Scratch worktree on a local branch at that tip; plain pushes to `lane/r2-code-b-2026-11-13`.

## The brief's rulings, copied (the chair's message of 2026-11-13; it is not on the branch)
- THE HOUSE'S LABEL ON EVERY SURFACE, then the lane's last rows and its ONE final statement. Files: the cut's package "lane rb" (serviceComponents.jsx, tabs/InstitutionsTab.jsx, domain/display/institutionDisplayName.js, npcComponents.jsx, settlementQuickGuide.js, crisis/crisisCast.js, tabs/DailyLifeTab.jsx) AND, so one lane holds a house's label on every surface, tabs/CrisisTab.jsx, tabs/power/PowerStrata.jsx, tabs/WhoRunsThisTownPanel.jsx, tabs/ViabilityTab.jsx with generators/economy/viability.js (stop #939 now this lane's), and the PDF's sections that print a house's name. NOT this lane's: src/pdf/sections/DefenseSecurity.jsx (defence lane); tabs/DefenseTab.jsx, HistoryTab.jsx, SubstrateTab.jsx (another seat); tabs/EconomicsTab.jsx and ResourcesTab.jsx (third leaves lane) except ONE line, the "Via: <house>" label, named as shared.
- RULED (a) THE HOUSE'S LABEL: one display leaf on every surface, both PDF variants (built on chainHouses and institutionDisplayName); strips count ranges, household ranges and floors, population gates, conditions, magic gates; a count word is a plain plural from the display-name table ("Inn (multiple)" -> "Inns"); in-world qualifiers stay; the table's own ranges in scope; no count line added; catalogue names, record and goldens' keys unchanged, the births' field diff EMPTY for it. ACCEPTANCE: the cut's census at ZERO for ranges and conditions on the page, both PDF variants, the Foundry journal and the Tonight sheet; thirty labels read in their towns; a guard that reds on a raw catalogue range or condition on any rendered surface.
- RULED (b) "REQ" leaves the roster and every other surface of this lane's; "YOU" stays where true.
- RULED (c) the crisis cast's "the one with the least say" only in a house of more than one; in a house of one the person is named without it.
- RULED (d) #804 ("Hunting grounds" as a chain card's "From" where the record says the resource is absent): display only, page and PDF. NOT this lane's: #452 (third leaves lane); #191 #381 #513 #370 #371 #672 (data lane and defence lane; the chair's correction of 19:0x: "#370, #371 and #672", not "#370 to #372"); #312 (powers lane); #215 (round two's first code lane); #257 #437 #329 #858 (round-three seats); #883 and the sovereignty word (the seat after the merges).
- The page shows the ratings, never the machinery. No new key in the record; no new word in the vocabulary file. A name a user can hide by hand is never written into a stored, composed sentence. A claim of zero is counted on every surface (tabs, Tonight, PDF text, Foundry journal, exports).
- HIGH first; each writer its own commit, measured first on births in the app's shape and on the reader's own town, red first; the false sentence gone and what prints in its place read true; a `round2` line may already be cured; new wording listed with its town; no commit at or below 62e30c7e7 rewritten. Then THE FINAL STATEMENT once.
- AUTHORISED: scratch worktrees, `npm ci`, commits on the lane, plain pushes to it. NEVER: another branch, `--no-verify`, force, an empty push, a PR, master, a golden's door, a deploy, a hosted database.
- Messages to the chair only for a total stop, when the house's label stands at zero on every surface (one line, tip and census before/after), and the hand-back (150 words).

## The chair's rulings received by this seat (notifications)
- 19:05 UTC: ADDED RULING (e) in a file of this lane's, after the house's label: a chain run only through an "Access to …" row (a hamlet's "Access to external mill", "Access to parish church") is not run here; the card says the work is done elsewhere in the page's own words, or does not print as running. The card's read is `SupplyChainsPanel.jsx :: chainFlowFacts`. Use the page's local-production test's wording (`tradeListDisplay.js :: localProductionAsPrinted`, third leaves lane) restated in this lane's leaf, named here for the seat after the merges. Measure first on births in the app's shape (thorps, hamlets); count the cards on the page and the PDF; read ten.
- 19:06 UTC: the cut's #13 and #55 are this lane's by their true writer (crisisCast.js :: bruntCandidates, CAST_REASONS.bruntLeast), with #11 #53 under ruling (c). Cure the four together.
- 19:28 UTC: THE CENSUS INSTRUMENT HAZARD: census.sh (lane/second-wave-census-2026-11-12) exits 0 when its counter fails (piped). After every census run check the counter's own exit and that counts.txt is non-empty with the expected rows; say so in the final statement.
- (at start) the chair's correction: ruling (d)'s "#370 to #372" reads "#370, #371 and #672".

## Instruments (rebuilt; scratchpad only)
- The reader's render (`render.rr2s.jsx`, `surfaces.census.jsx`, unchanged) on the reader's 20 seeds, app shape, page + all three PDF variants + all three Foundry variants + the Tonight sheet, records beside them.
- The cut's census `classes.mjs` (unchanged) AND, because it is BLIND to the Foundry journal (the journal is markdown and escapes a bracket: "Mills \(2-5\)"), a held-house census `mycensus.mjs`: every house the town's own record holds with a machinery bracket, in its raw or display spelling, case-folded, on every surface, the Foundry markdown unescaped. The cut's "Foundry and Tonight: 0" was 78 + 78 at 62e30c7e7.
- `full.census.jsx`: the same walk for the census's 720 seeds (births.mjs's shapes) and the reader's 20 in one pass; `births.mjs` + `fielddiff.mjs` (the reader's) for the 720 field diff.

## Items (this seat)
| item | rows | commit | measured (reader's 20, held-house census unless said) |
|---|---|---|---|
| (a) the leaf widened: household ranges/floors pinned, "Inn (multiple)" -> "Inns", houseLabelsInText | NPC card "Inn (multiple)" | a2088f22c | 350 -> 346 (cut's classes); records 0 |
| (a) the roster's label | 22 HIGH + 26 MED (InstitutionCard) | e28ac16fa | Institutions 62 -> 0 |
| (a) InstitutionLink + profile heading: Services providers, Power lists | 26 HIGH + 27 MED (ServiceItem), PowerStrata | d425c31c1 | Services 62 -> 0, Power 54 -> 1 |
| (a) EntityLink / EntityRef: a door to a house | Crisis cast + levers (#400 #516 #754 …) | 69b449d97 | Crisis 8 -> 0 |
| (a) WhoRuns panel, page + PDF | #945 | 963167f4b | Power 1 -> 0 |
| (a) the Outlook's stored list read with labels, page + PDF (stop #939) | #472 #508 | 4b11e3910 | Outlook 1 -> 0 |
| (a) PDF Institutions, Services, Notable NPCs, Crisis | the PDF twins | 9b898d5c3 (+3988270a8 baseline addresses) | PDF 78 -> 1 per variant |
| (a) Foundry journal (SHARED file, five lines) | the journal twins | 2af8bdfa9 | Foundry 78 -> 0 per variant |
| (a) Economics "Via:" (SHARED line) | the cut's Economics flow | 4909ba684 | Economics 1 -> 0 |
| (a) crisis hooks' houseInProse ("(50-100+)") | the first seat's list | 668fe2baf | the conversion metropolis: 0 |
| (b) REQ off the roster; PDF "Source: Required/Generated/…" off | the roster's REQ (224) | c40969214 | REQ 224 -> 0; PDF Source 695 -> 3 per variant |
| (c) "least say" only in a house of several, never beside the lever | #11 #13 #53 #55 #268 | 24ab15c9b | 720: 71 -> 22 rows; RECORDS MOVE 49 towns, cast reasons only |
| (a) the guard: every rendered surface, four towns | ruling (a)'s acceptance | feb3da917 | red at 62e30c7e7 on every surface; green here |
| (a) the stored stockpile sentence on the journal's Issues/Tensions and the PDF's Live tensions | found by the 740 census | d1c8612b1 | Foundry 3+3 -> 0, PDF 1+1 -> 0 |
| (d) #804: a chain names no ground the record says is ABSENT, page + PDF | #804 | 99432257c | 720: 850 chains in 396 towns; reader's 20: 23 page grounds, 69 lines per PDF variant |
| (e) a chain run only via "Access to …" names that row | W2-C #195 #196 | 5ea26f677 | 720: 276 cards in 221 thorps/hamlets; 46 rendered: 43 towns changed |
| increment HIGH #pf-84 #pf-720: Tonight keeper styled "Acting …" | 2 HIGH | 535e654d6 | read in 3 succession towns |
| increment HIGH #pf-717 #pf-718 (+ the MED twin): relationship card keeper | 2 HIGH + 1 MED | f09e55042 | read in 5 succession towns |
| increment HIGH #ww-536 (+ 2 MED): Faith's "real political weight" for a contender | 1 HIGH + 2 MED (+3 of the same) | 57395ee18 | 6 towns, every one with another power governing |
| increment HIGH #ww-252 ("defends: no military…" beside a Household levy) | 1 HIGH | 90bafc4d1 (round two's item 4c) | already cured on this lane: at 62e30c7e7 rww-thorp-under_siege-1 prints "defends: Palisade · the defence of the place, with no one named to lead it" |
| chair's #9 #51 (111e8b152's reach), #270 (ruling (c)) | rendered | — | at this tip: "Sahlfort / Archodion has gone short of food for a second season."; "… takes the worst of it: one of the house the crisis hits." |

**Generated-record moves (this seat):** all of (a) and (b): the 720 births byte-equal to 62e30c7e7 (field diff 0 leaf diffs). (c): 49 of 720, `stress[].cast.roles[].reason` only.

## Left on the reader's 20 after (a), and whose: "Gates (if walled)" on the Defense tab's force cards (src/components/new/tabs/DefenseTab.jsx) and the PDF's forces (src/pdf/sections/DefenseSecurity.jsx), page 1 and 1 per PDF variant: the defence lanes'. REQ/FORCED on the same two surfaces (11/10 page, 25/14 per PDF variant): the same. The Foundry Defense page's "(required)", "(faction_boost)", "(coherence_repair)" after each force: the generator's provenance, in journalPages.js (upkeep lanes' file), not cured here (the defence surfaces are the defence lane's).

## (d) THE DISQUALIFIER, MEASURED (a correction to the first seat's note)
The first seat proposed `resource` null where `resourceInputAvailable === false`. On the 720 that flag is also false for every DEPLETED ground ("Fishing grounds (depleted)", true): that read would have removed true lines. The disqualifier built is the chain's own `resourceCondition === 'absent'` (a legacy record without it: no input AND not depleted).

## FOR THE JOIN (the chair's ruling of 21:13 UTC: not touched here; cured when the lanes are joined, by calling this lane's leaf)
The leaf: `src/domain/display/institutionDisplayName.js :: institutionHouseLabel(nameOrInst)` (and `houseLabelsInText(text, settlement.institutions)` for a stored sentence). The test that reds on each once the leaf is present: `tests/components/houseLabelEverySurface.test.jsx` — strike its `DEFENCE_ALLOWANCE` row (town-under_siege-rand-1: Defense tab 1, each PDF variant 1) and it reds until the three call sites below read the leaf; over the 740, the scratchpad's held-house census (`mycensus.mjs`) pointed at the same surfaces gives 16 page / 12 + 12 PDF for "Gates (if walled)" and 3 + 3 for the healer note (deduced at d1c8612b1 from the 740 run at cf676399d; re-measure at the join).
1. `src/components/new/tabs/DefenseTab.jsx :: DefenseTab`, inner `ForceCard` (line ~342): `{i.name}` -> `{institutionHouseLabel(i)}` ("Gates (if walled)" -> "Town gates").
2. `src/pdf/sections/DefenseSecurity.jsx :: DefenseSecurity` (line ~188): `{force.name}` -> `{institutionHouseLabel(force.name)}`.
3. `src/domain/display/defenseDisplay.js :: deriveSupportingCapabilities` (line ~411, Medical Readiness): `` `${facts.healerName}. Wounds and fevers …` `` -> `` `${institutionHouseLabel(facts.healerName)}. Wounds and fevers …` `` ("Major monasteries (5-10). Wounds and fevers…", 3 metropolises in the 720). `facts.healerName` is `src/domain/defense/defenseFacts.js :: defenseFactsOf`'s roster name (a match: keep it raw there).
4. The Foundry journal's Defense page (`src/foundry/journalPages.js :: defensePage`) already reads the leaf for the force NAME (2af8bdfa9); its "(required)", "(faction_boost)", "(coherence_repair)" provenance tag after each force is class (b) machinery, left for the defence surfaces' holder.

**THE STORED STOCKPILE SENTENCE (Overview and History, one town: r2r-town-9, isolated).** True writer: `src/generators/economy/viability.js :: generateEconomicViability`, the trade-dependency branch (line ~515: `` `${critical.length} institution… operating on stockpiles only (isolated trade): ` + critical.map((d) => institutionDisplayName(d.institution)).join(', ') ``; the siege variant "critically impaired by siege" is the same expression). It is copied at birth into `history.currentTensions[]` by `src/generators/historyGenerator.js` (the "Priority-add: economic viability issues → resource_scarcity" block, line ~431). Cure at the writer: `institutionHouseLabel` in place of `institutionDisplayName` in that `.map` (RECORDS MOVE: `economicViability.issues[].description` and the copied tension, in isolated and besieged towns). This lane read it at display on the Outlook, the PDF and the journal (4b11e3910, d1c8612b1); the page's Overview (`OverviewTab.jsx`, upkeep lanes', pin X-37) and `HistoryTab.jsx` (another seat's) print it raw.

## Rows NOT reached by this seat (for a successor, line by line)
- The increment's MED rows in this lane's files (ROUND-3-CUT-INCREMENT.json at fe6d5b741, class NEW, `at.line` set), not begun: tonightSheet.js — #pf "Wants to hold the line through the war with fewer hands…" (rpf-metropolis-wartime-13, CAST_WANTS vs the person's own goal), "Wants to keep the pressure on until the seat gives way…" (rpf-city-succession_void+politically_fractured-13), "Wants to use this crisis to take the seat…" (rpf-village-politically_fractured-13): CAST_WANTS printed over the card's own goal; "No granary; two months in household stores" where storageMonths is 1.5 (rpf-thorp-under_siege-13, rpf-thorp-succession_void-13, rpf-thorp-occupied-13: `foodStoresWords` rounds 1.5 up; the stores-span home, item 3) and "Food Secure" beside a deficit. npcComponents.jsx — "Merchant guilds (3-8) · Burgomaster, first of Merchant Council · first of Merchant Guilds" (rpf-town-occupied-13: the range is cured by (a); the seat-holder-also-contender clause is not), "Madam" / "Goodwife" honorifics for male cards (rpf-city-occupied-13, rpf-village-succession_void+famine-13; the honorific table is data/faceHonorifics.js, not this lane's), "Mill · second of The Highborn Circle" (rpf-village-succession_void-13: a card with no house given a house door). crisisCast.js — "already carries more weight than whoever holds the seat" where no one holds the seat (rpf-town-succession_void-13, rpf-village-succession_void-13; CAST_REASONS.instigatorRival: needs `isSeatVacant`). WhoRunsThisTownPanel.jsx — "handled by … (Multiple criminal factions)" under another house's boss (rpf-metropolis-politically_fractured-13: the label is cured by (a) to "Rival gangs"; the handler-under-the-wrong-guild is patronage.js, the powers lane's) and "Housing (75-650 households)" (cured by (a)). traditionCorpus.js — "The Long Forge Fair" with no forge (rww-hamlet-calm-1), "The Lesser Landfall Fair" where no fair stands (rww-thorp-under_siege-1): item 4d's market disqualifier extended to forges and fairs. faithReading.js — "walk to the next village’s parish church" with no access row (rww-thorp-famine-1; item 6b's cure, check it reaches this town) and under a siege that bars the road (rww-thorp-under_siege-1). settlementQuickGuide.js — "built in wards and courtyards, ordered by bureaux" in a hamlet of 31 (rww-hamlet-succession_void-1; item 5's size rule, a frame it did not cover) and CENSUS-2's QUICK_GUIDE_SIBLINGS (38 small places). RelationshipsTab.jsx — "No neighbours, ties between people or conflicts are recorded" (rpf-thorp-calm-13; item 4a's cure, check it reaches this town). NPCsTab.jsx — "1 high influence ·" dangling separator (rpf-hamlet-succession_void-13).
- The cut's own MED rows in this lane's files not of classes (a)-(c): DailyLifeTab food tile "Strained"/"Tightening" against the food record (#843 #1102 #1297); PowerStrata "The Powers (3)" against the 5 or 6 the record holds (#562 #712 #806) and "RulerElder Council…Strong" (#85); WhoRuns "answers to Black market through …" a whisper broker (#944 #946 #1077: patronage.js, the powers lane's); viability.js's slider lines ("Military slider is high…", "Raise Economy priority…", #576 #823 #824 #825: machinery, a stored sentence, records move); crisisCast STAKE_REASONS "Grain Holders gains · holds what the crisis makes scarce" (#864); the quick guide's scope phrases #1 #234 #513; npcComponents #389 (ungrammatical conflict issue), #510, #967 #968 (hidden allegiance through the other market's broker), #978 #979 #1097.
- #1049 ("Needs Grain · affects: meals, ale, lodging" on Economics): the chair names it "your Economics line of record 371"; record 371's text is not in the chair's records this seat could reach (docs/chair on lane/chair-2026-11-08). PARKED: needs record 371's ruling and EconomicsTab.jsx beyond its "Via:" line.

## Register doors and fix-forwards (this seat, each its own commit)
- 3988270a8, and the address-only rows inside 99432257c, f09e55042, 5ea26f677, d1c8612b1: tests/lint/.prose-numerics-baseline.json, path/category/snippet unchanged, lines moved by the touched files.
- 7ea3dfee2 the wiring census re-made by `node scripts/wiring-census.mjs`; 42028f01d the lighting census re-frozen through its door (LIGHTING_CENSUS_REFREEZE='R2-CODE-B-2'; 3236 -> 3239 files); 8242ce082 the writer-reach baseline through its shrink-only `--write` (cohort 1363 -> 1363); c40969214 banked tests/lint/rawColorLiteral.test.js 1225 -> 1224 (the REQ tone left).
- e5640b041: two reads the observed-shape ratchet convicted (journalPages.js `vm.raw?.institutions`, faithReading.js `name` on factions), re-made through keys the record writes; no baseline moved.
- The anchor walker: houseLabelEveryForm's two negatives anchored (its own commit).
- tests/lint at the tip of the doors (run at ~21:20, before the doors): six walkers red here and green at 62e30c7e7 (negativeAssertionAnchor, observedShapeReaders, proseWiringCensus, sovereigntyLightingContract, writerReach, siteCoherenceRatchet); each re-run green after its commit above (siteCoherenceRatchet green on its re-run without change). Base reds (62e30c7e7, tests/lint): domainAnyCastBaseline, ledgerCitationIntegrity, mutationCoverageManifest, newsHeadlineContract, newsVoiceContract, proseFamilyContract.

## CENSUS-2 at this tip (the measuring seat's command, lane/census-2-2026-11-13 at 2686272b1, run on a clean worktree at 5ea26f677; its own exit 0, counts.txt 75 rows, read)
- Kinds over its 720 births (towns): a 716 · b 70 · c 262 · d 377 · e 60 · **f 306** · **g 720** · h 2. The line, per the chair: f 720, g 720.
- **(f) at this tip is the ruled-KEPT qualifiers**: of 2,286 (f) hits, all but 17 are "Inns and taverns (district)" or "Bowyers & fletchers (guild)" (ruling (a): in-world qualifiers stay; the census counts them). The 17: "Gates (if walled)" on Systems/Defense (11) and the healer note "Major monasteries (5-10). Wounds and fevers…" (4) — FOR THE JOIN above; the stored stockpile sentence on Overview and History (2) — named above. Limit: CENSUS-2 renders the page only (no PDF, Foundry, Tonight); the held-house census is the instrument there (0 on this lane's surfaces).
- **(g)** at this tip: the Power tab's legitimacy Breakdown rows (PowerTab.jsx, the powers lane's; cured on its lane), viability.js's "Military slider is high…" (2, a stored sentence, the cut's #576 class, not begun). **(d)**: FORCED (Defense, not this lane's), History's slider ends (HistoryTab, not this lane's), "Import: Food Processing" (68 lines; a chain LABEL printed as an import on the chain card's From, `SupplyChainsPanel.jsx :: chainFlowFacts.importedUpstream` -> EconomicsTab's "Import: …": a successor's row, this lane's leaf).
- In this lane's files, NEW hits read and NOT cured (for a successor): crisisHooks/crisisCast "In the migration, the Access to parish church holds the key to it" and "The conversion turns on the access to a house of worship" (a lever that is a road to another place's church: the cast's lever candidates take "Access to …" rows; and the hook's lever clause prints the RAW name, not `houseInProse`); viability.js "→Add a tier-plausible hedge practitioner or alchemical workshop" (21 towns, a stored suggestion naming machinery); settlementQuickGuide.js 57 lines (a) and 7 (c) (QUICK_GUIDE_SIBLINGS / SCOPE_LINE_FRAMES); traditionCorpus.js "The Fair of the First Landing" where no fair stands (3).
- Kind (h) (an empty seat's keeper by the bare title): 2 towns at this tip; the Tonight sheet and the relationship card cured (535e654d6, f09e55042); the census does not render the Tonight sheet.

## THE EXACT NEXT STEP (this seat hands back by file at its context limit, 2026-11-13 ~22:20 UTC)
Tip: the branch's last commit (this file). Line base unchanged: e969a75b7. This seat's base: 62e30c7e7.
1. The rows not reached (listed above, part 2, line by line), then CENSUS-2's hits in this lane's files above.
2. THE FINAL STATEMENT, NOT BEGUN by this seat (as the brief gives it): the whole suite once at the final tip (`git fetch origin review-fixes-2026-07-08:review-fixes-2026-07-08`; `npx vitest run --maxWorkers=2` to a file), every red classed against e969a75b7's and 62e30c7e7's failing sets (known reds at this tip, the merge seat's: tests/property/generatorGoldenMaster.test.js, tests/generators/institutionBudgetPromise.test.js, tests/generators/pipelinePinnedChoosers.test.js (A1), tests/property/dossierProseManifest.test.js (3 titles, red at 62e30c7e7), the PDF golden where house labels moved); the census counter base against tip (origin/lane/second-wave-census-2026-11-12 census.sh: CHECK ITS COUNTER'S OWN EXIT and a non-empty counts.txt, the chair's hazard of 19:28); the 720 field diff by family (this seat measured: (a), (b), (d), (e) and the increment's display commits 0 records; (c) 49 towns, cast reasons only); the held-house census over the 740 at the final tip (scratchpad tools are lost with the container: rebuild `mycensus.mjs` from part 2's description; 18,659 at 62e30c7e7; 58 at cf676399d by measure; 50 after d1c8612b1 by deduction, not re-run); ONE draft shift record; the edge bundles as the last commit, alone.
3. The hand-back message to the chair (150 words).

## New words (this seat, for the owner's veto)
- (c): "the only one in the house the crisis hits" (thorp-calm-rand-1, thorp-famine-rand-1); "one of the house the crisis hits" (village-famine-rand-1).
- (a): "Inns" for "Inn (multiple)" (town-calm-rand-1, town-indebted-port-1, town-plague_onset-rand-1, town-under_siege-rand-1). Otherwise words removed only.
- (b): the roster's help pill loses "history," ("The badge says who put it here: you, the living world, or a dependency.").

## FOR THE JOIN — the empty seat's keeper (the chair's ruling of 22:19 UTC, read AFTER 535e654d6 and f09e55042 were pushed)
This seat's two commits do NOT build a styled name of their own: they read the existing leaf on this tree, `src/domain/people/seatKeeper.js :: keeperFormOf` / `seatKeeperOf` (the powers lane's file, read, not changed), and print the keeper's form in place of the bare office:
- `src/domain/summary/tonightSheet.js :: peopleOf`, the person's `role` (was `clean(npc.role || npc.title)`; now `roleOf(npc)`, the keeper's form for the keeper of an empty seat) — #pf-84, #pf-720.
- `src/components/new/npcComponents.jsx :: NPCRelCard2`, the role line `{npc1Role} · {strength} · {npc2Role}` (now `roleShown(rel.from|rel.to, …)`) — #pf-717, #pf-718.
AT THE JOIN, where the ruled one home is `seatKeeper.js :: seatKeeperStyledNameOf(settlement)` (powers lane 96a6ced46, fb4561b03): the join seat replaces `keeperFormOf(source)` in those two expressions by the leaf's styled form (or reverts the two commits if the leaf prints the name with the form, since both rows already print the name beside the role). The test that reds on the four towns: render rpf-metropolis-succession_void-13 and rpf-village-succession_void+famine-13 (app shape) and assert the Tonight person and the relationship role line never print the bare "First Magnate" / "Headman" for the keeper (read here at f09e55042: "Acting First Magnate", "Acting Headman"). Not written by this seat (context limit).

---

# PART 3 — R2-CODE-B-3, the third seat (the people and crisis surfaces; the lane's one final statement)

**Seat:** R2-CODE-B-3 (session_01FE9mEtsvAovTvSQFwwYdDT). **Tip read back from origin at start:** 0570b3441 (the brief said 4d546386d; the one commit between is the second seat's docs-only FOR THE JOIN note — the chair's correction of 22:38 UTC: "NOT a stop: work from 0570b3441; read 4d546386d as 0570b3441, including 'do not rewrite a commit at or below'"). Scratch worktree on a local branch; plain pushes. The side seat (R2-CODE-B-SIDE, lane/r2-code-b-side-2026-11-13) holds the flow card's facts, the quick guide, the Power strata, the traditions and the faith reading.

## The brief's rulings, copied (the chair's message; it is not on the branch)
- MY FILES: tonightSheet.js; npcComponents.jsx; the crisis cast and hooks (crisisCast.js, the hooks' lever clause); tabs/DailyLifeTab.jsx, RelationshipsTab.jsx, NPCsTab.jsx; the label leaf and the second seat's surfaces for upkeep only. NOT MINE: the side seat's files (SupplyChainsPanel.jsx, chainHouses.js, engineKeysInText.js, the PDF's Services.jsx and SupplyChainFlow.jsx, PowerStrata.jsx, settlementQuickGuide.js, traditionCorpus.js, faithReading.js); viability.js (RULED: its rows, the slider lines #576 #823 #824 #825, the "hedge practitioner" suggestion and the stockpile sentence's writer go to the defence lane); data/faceHonorifics.js, patronage.js (#944 #946 #1077, the powers lane's); the Defense surfaces; EconomicsTab.jsx (#1049 to the third leaves lane).
- ITEM 1 RULED: one home for what a person wants, the person's own goal as the card prints it; a cast "wants" line only where the card carries no goal AND the line is true of the role in that crisis; otherwise nothing is added.
- ITEM 2 RULED: the words contain the figure (1.5 months is not "two months"; the span's words from the stores' one home; a band's word true of every figure in the band); the food label on every surface reads ONE home, the food record the Economics tab's sentence reads; a label of plenty never stands beside a deficit. New words listed with three towns.
- ITEM 4 RULED: an "Access to …" row is not a house (record 375): never a lever; the hook's lever clause prints the house through `houseInProse`.
- THE METHOD (records 386, 387, 404): read where it prints (three towns, a siege/famine/occupation among them, the smallest and largest tier); a twin carries every condition; a line naming a house/role/force/good reads the roster; a line its conditions cannot make true is not written; every cure that takes a line off some towns has its guard town; a seat that rewords a sentence owns it whole.
- The page shows the ratings, never the machinery. No new key in the record, no new word in the vocabulary file. A claim of zero counted on every surface. The false sentence gone and what prints in its place read true. A cure that moves a stored line is a DECLARED MOVE. Do not rewrite a commit at or below 0570b3441.
- Item 8 (merge the side branch; THE ONE FINAL STATEMENT) ON THE CHAIR'S WORD ONLY.

## The chair's rulings received by this seat (notifications)
- 22:38 UTC: the tip correction above.
- 22:42 UTC: ONE ADDED ITEM, HIGH, FIRST: the Services tab's "Needs TimberSupply route severed." run together (the cut's #163 #427 #497 #891; CENSUS-2 kind d) in serviceComponents.jsx :: ServiceItem. RULED: "Needs X" and the sentence after it are two things: two elements, a separator that survives copying; no word changes. Count page, PDF, Foundry on the 720 and the readers' towns; read ten. FOR THE JOIN: ServicesTab.jsx's `impactCovers` is read by nothing once the change is in. (Read after item 1 was pushed; done next.)

## Instruments (scratchpad only)
- The base: a detached worktree at 0570b3441; CENSUS-2's births and render (its own census2.sh, `--count-only`) over the census's 720 + the readers' 80 (seeds.txt + seeds.readers.txt), app shape: 800 births, 0 errors, 800 dumps.
- `tonight.mjs`: composeTonightSheet over the same 800 records with any tree's code (people, facts, food record), diffed tip against tip.
- `svc.census.jsx`: ServicesTab rendered over the 800 records, every need line.
- `surfaces.census.jsx` (the reader's, with public prose stamped as the reader's render stamps it): the PDF (three variants), the Foundry journal (three) and the Tonight sheet of the readers' 80.

## Items (this seat)
| item | rows | commit | measured (800 = census's 720 + readers' 80, app shape) |
|---|---|---|---|
| 1 Tonight wants: the card's own goal | inc #176 #303 #856 | 48ddf7685 (+72bbaf182 anchors) | cast people 427: overprinted 406 -> 0; 21 goal-less temporaries keep a true role line; 330 towns' people change; display only |
| ADDED HIGH: "Needs X" apart from its sentence | cut #163 #427 #497 #891 | e878a1367 | need lines 444; run together 30 (30 towns) -> 0; only those 30 change; PDF/Foundry print no service need line (0/0); "· covers" 0 on 800 page dumps |
| 2a stores' span contains its figure | inc #472 #668 #769 | f719dbb38 | stores lines 800: off figure 127 -> 0; bare above a month 758 -> 0; 759 towns' line changes |
| 2b food label, one home | cut #843 #1102 #1297; inc #197 #941 #995 #1329 #1516, #472 #668 #769 | d94638185 (+bc2860a35 tuning door) | Secure->Pressured 160, Import-Dependent->Deficit 6; plenty beside a deficit 160 -> 0; tile = sheet word 800/800 |
| 3 NPC card: allegiance handler; badge and conflict pill apart | cut #967 #968 #1097, #389 (the pill only) | 87c541620 | hidden-allegiance lines 923: 284 (105 towns) named a handler of another house -> none; 639 keep theirs; the page re-count was owed to the tip render (not run) |
| 4 crisis cast and hooks | inc (rpf-town/village-succession_void-13), cut #864, CENSUS-2 "Access to …" levers | NOT COMMITTED: docs/chair/2026-11-13/R2-CODE-B-3-ITEM4.patch | measured, see below; 5 governing reds NOT classed |

## FOR THE JOIN (this seat)
- THE WARTIME SUMMARY'S ONE PATH: the cure is in stressNarrative.js :: RENDERERS.wartime, which `assembleSettlement.js :: rerenderStressSummary` calls through renderStressSummary on this tree AND on the data lane (lane/w2-fix-data-2026-11-13, read): no second path was built; at the join the data lane's door renders the cured text. Named, not cured (not ruled): the loss text's "Supply caravans pass through on crown requisition" prints in the 4 isolated wartime towns of the 800 (r2s-wartime-thorp-1 and -hamlet-3 among them); RECOMMENDATION: a declared twin of that sentence excluding `route: isolated`, the crisis lane's or the seat after the merges.
- ServicesTab.jsx's `impactCovers` (the X-50 plan's `covers` list) is read by nothing once this lane's ServiceItem is in: it goes at the join (the tabs lane's file).
- The food label's one home is `src/domain/summary/tonightSheet.js :: foodBandOf(foodRecord)`. Two surfaces still print the generator's label raw and disagree with the sheet in the 160 "Pressured" towns: the Overview's Food Security (OverviewTab.jsx, `eco.foodSecurity.label`, the upkeep lanes') and the Quick Guide's food line (settlementQuickGuide.js :: the `economy.foodSecurity?.label` read, the side seat's). Each takes `foodBandOf(eco.foodSecurity.foodRecord)?.label`.
- The Defence tab's endurance line says "about three months at full rations" where the record holds 1.5 months (rpf-thorp-under_siege-13): defenseDisplay.js's own arithmetic (the first seat's #883), the defence lanes'.

## New words (this seat, for the owner's veto)
- Item 2a: "about a month and a half" (rpf-thorp-occupied-13, rpf-thorp-succession_void-13, rpf-thorp-under_siege-13), "about two and a half months" (2.25–2.75 months), and "about" before every span of a month and more ("about two months", rww-village-indebted-1; "about nine months", r2r-city-7; "about 13 months", r2s-famine-metropolis-2).
- Item 2b: none (the band ladder's own "Pressured" and "Deficit"); the Daily Life tile's own words "Severe/Serious/Strained/Tightening/Adequate" print only for a record with no band.
- Item 1 and the added HIGH: none.

## Item 3: named, not cured (writers outside this lane's files)
- #389's words "A ruling one power refuses to obey": src/generators/power/conflictIssues.js (powers lane). Item 3 took only the run-together pill.
- #693 "Burgomaster, first of Merchant Council · first of Merchant Guilds" (rpf-town-occupied-13): the record ranks the seat-holder first of both; composed by src/domain/people/cardPowers.js :: cardPowerLine (powers lane). PARKED: which is false — the membership or the Power tab's "Contests the seat" — is the powers lane's ruling.
- inc #14 "Mill · second of The Highborn Circle": the miller HAS a house (key "Mill", on the roster, "Backs The Highborn Circle"); the rank is the people car's backing membership. PARKED with #191 #192 #624 #625 #749-#752 (craft faces ranked in noble powers): the powers lane's memberships.
- #979 "Disposition established": the influence word folded into the disposition by src/domain/display/npcInteriorityRead.js :: npcInteriority (INFLUENCE_WORD).
- #510: no longer prints at 0570b3441; the fill survives in a goal ("Secure enough legal reserves to outlast the blockade", rr2s-town-under_siege-rand-1): the goal writer's. #978: 0 at 0570b3441.
- Seen, not cured (same run-together class, not named to me): trait chips "Flaw: vainTemperament: clever" on the card.

## Item 4 — BUILT AND MEASURED, NOT COMMITTED (the worker restarted mid-classification at the seat's context mark)
The patch (apply on 87c541620 with `git apply docs/chair/2026-11-13/R2-CODE-B-3-ITEM4.patch`): crisisCast.js — `instigatorRival` -> `instigatorGains` and stake `gainsRival` -> `gainsClaim` where people/seatKeeper.js :: isSeatVacant; stake `gainsHolds` only where a member of the power faces a house of the scarce kind (institution.key), never by name; `deriveLevers` drops "Access to …" rows (record 375). crisisHooks.js :: holderWords prints an institution holder through houseInProse. New test tests/domain/crisisCastSeatAndAccess.test.js: 4/5 red at 0570b3441, 5/5 green with the patch.
- MEASURED (800 = census's 720 + readers' 80, app shape, base 0570b3441 vs the patch): empty-seat "whoever holds the seat" roles 12 -> 0, stakes 25 -> 0, hooks 12 -> 0; "Access to" levers 56 -> 0, hooks naming one 57 (53 towns) -> 0; name-only "holds what the crisis makes scarce" 14 -> 0 (Grain Holders in r2s-famine-city-1 now "no stake yet · it could side with either camp"). Hooks 884 -> 831; no crisis left with none (558 crises; 53 lose only the Access-to lever hook).
- DECLARED MOVE (field diff, the reader's fielddiff.mjs): 94 of 800 towns; families stress/stressors (`cast.levers[]`, `cast.roles[].{reason,id,name,kind,temporary}`, `cast.stakes[].{reason,stake}`) and npcs (47 towns: exactly ONE temporary person added — a Grain Steward or a Healer, the cast's own rule for a natural crisis with no lever house — no existing person changed). No other family.
- READ: rpf-town-succession_void-13 / rpf-village-succession_void-13 "… is stirring it: its power gains from the crisis." and stake "a rival claim to govern gains by it"; r2r-thorp-17 famine lever "Ehecatl Chel · nobody here could, so this one stepped in for the crisis". GUARD r2s-politically_fractured-thorp-0 (held, contested seat) keeps "already carries more weight …".
- THE FIVE REDS TO CLASS (governing run, 43 files, 392 passed): tests/domain/crisisHooks.test.js ("the tier noun is spoken through the estate's one rewrite"); tests/generators/generationForkCensus.test.js (A3e — the classification re-executed; suspect the temporary mint as a new draw site: CHECK that it moves no draw); tests/generators/institutionBudgetPromise.test.js and tests/generators/pipelinePinnedChoosers.test.js (A1) — both known reds at 62e30c7e7 (part 2), re-check at 0570b3441; tests/generators/people/castDerived.test.js ("every person a cast names is on the roster" — likely the added temporary). The base-side run was killed by the restart. Do not commit the patch until each is classed (origin, or a pin re-keyed by identity) and the gates run.
- Named twin (0 in 800 births): a PLURAL institution holding a hook's line role reads "the houses of worship is stirring it" (LINE_ROLE_CLAUSE's verbs are singular).

## Rows NOT reached by this seat (line by line)
1. Item 4: class the five reds above, then commit the patch (one commit), gates, push.
2. Item 5: RelationshipsTab.jsx "No neighbours, ties between people or conflicts are recorded" on rpf-thorp-calm-13 (check item 4a's cure reaches it: base dump); NPCsTab.jsx "1 high influence ·" dangling separator (rpf-hamlet-succession_void-13).
3. Item 6: the second seat's FOR THE JOIN note (0570b3441) read; nothing to add.
4. The page re-count of items 3–5 on the 800 (one tip render: CENSUS-2's census2.sh --count-only on a frozen tip worktree).
5. The lighting census re-freeze through its own door at a clean tip (LIGHTING_CENSUS_REFREEZE; the estate's file count 3239 -> 3242 by this seat's new test files: tonightOwnGoal, storesSpanFigure, npcCardAllegianceHandler, + crisisCastSeatAndAccess with item 4); the sovereignty walker reds until then.
6. Item 7: CENSUS-2 at the final tip and at 62e30c7e7 (--files the lane's files; read the counter's own exit and counts.txt).
7. Item 8 (on the chair's word only): merge the side branch; THE ONE FINAL STATEMENT as part 2's EXACT NEXT STEP item 2 gives it.

## Stops and parked items (with recommendation)
- #693 and inc #14 (and the craft-in-noble-power rows): PARK to the powers lane (memberships / the Power tab's contender label).
- #389's words, #979, #510's goal fill: name to their writers' lanes (above).
- The Overview and Quick Guide food labels: FOR THE JOIN (above).


# PART 4 — R2-CODE-B-4, the fourth seat (item 4 committed; items 5 on; the lane's one final statement)

**Seat:** R2-CODE-B-4 (session_01FE9mEtWoAUqxb42BaXTiCv). **Tip read back from origin at start:** db61f66fc (as the brief gave it). Scratch worktree on a local branch; a frozen base worktree at db61f66fc; plain pushes with the explicit refspec.

## The brief's rulings, copied (the chair's message of 2026-11-14; it is not on the branch)
- MY FILES: the people and crisis surfaces (as PART 3) and the lane's ONE final statement. NOT MINE: #693 and the craft faces ranked in noble powers (the powers lane); #389's words (the powers lane); viability.js (the defence lane); the Overview's food label (OverviewTab.jsx: FOR THE JOIN as PART 3 wrote it); the Defence tab's endurance line.
- ITEM 4 RULED: (a) no draw added or moved unless declared: a mint on a stream other draws share is a STOP with the stream's name; on the cast's own fork with the fork census green through its own door it is a DECLARED MOVE (say the towns, and that no existing person changed). (b) a red that is the patch's own is cured at its cause; a pin re-keyed by identity with its cause; none loosened. (c) the plural holder ("the houses of worship is stirring it"): cure it in the same commit, read in three towns, or declare the clause off plural holders. Then one commit, the gates, push; read ten changed lines, a siege and an empty seat among them.
- ITEM 5: RelationshipsTab.jsx (rpf-thorp-calm-13: check the first seat's cure reaches it); NPCsTab.jsx "1 high influence ·" (rpf-hamlet-succession_void-13). The NPC card's trait chips ("Flaw: vainTemperament: clever"): set apart as the Services need was; no word changes; count before and after.
- Then: the page re-count of the third seat's items 3-5 and mine on its 800 (`--count-only`); the lighting census re-frozen through its own door at a clean tip (own commit); CENSUS-2 at my tip and at 62e30c7e7 over the lane's files; then tell the chair (one message) and WAIT. ON THE CHAIR'S WORD ONLY: merge lane/r2-code-b-side-2026-11-13 (plain; registers re-made through their doors); then the quick guide's food line takes `tonightSheet.js :: foodBandOf(foodRecord)`; then THE ONE FINAL STATEMENT as part 2's "EXACT NEXT STEP" item 2.
- THE METHOD (records 386, 387, 404) and the page laws as PART 3 copies them. Never rewrite a commit at or below db61f66fc.

## The chair's rulings received by this seat (notifications)
- 00:20 UTC: ONE ROW added to item 2: tabs/WhoRunsThisTownPanel.jsx's agent row prints a title twice ("Tserenpuntsag Jalayir (the workhouse master), the workhouse master", r2r-metropolis-7; CENSUS-2 kind d). RULED: the row adds the title only where the link's own label does not already carry it; count before and after on the 800; the PDF's twin (src/pdf/sections/WhoRunsThisTown.jsx) the same. For the statement, no work: round three's code lane reworded the crisis page's "Who it touches: nobody" to "no one yet named" (an infiltration's cast is empty while the roster's secrets hold its infiltrator and recruits); leave it so and say it.

## Instruments (outside the tree; lost with the container)
- /home/user/m: the 800 seeds (CENSUS-2's seeds.txt + seeds.readers.txt), births by CENSUS-2's births.mjs in any tree (base/, p4/ corpora); `cast.mjs` (each crisis's roles, stakes, levers and hooks read with a tree's code), `count4.mjs`, `fielddiff.mjs` (leaf-path diff of two corpora by family).

## Items (this seat)
| item | commit | measured (800, app shape, db61f66fc vs the commit) |
|---|---|---|
| 4 the crisis cast and hooks (the third seat's patch + two cures) | 77ed210af | empty-seat "whoever holds the seat" roles 12->0, stakes 25->0, hooks 12->0; "Access to" levers 56->0, hooks 57 (53 towns)->0; "holds what the crisis makes scarce" 14->0 (all 14 false by roster; a guard test holds the rule where a member faces a granary); hooks 884->831, crises with none 26->26. DECLARED MOVE: 94 towns, families stress/stressors (cast) and npcs (47 towns: exactly ONE temporary person appended, 32 Grain Stewards + 15 Healers; every existing person byte-equal). |
| 4 the fork census door | 32438f8d1 | resolveCrisisCast's two rows stepDraws/keyMoves 0->2 of 63, pure->drawn; "steps that draw" 12->13; no other row moved. |
| 4 fix-forward: the register's tally | 01ee0bac6 | the contract's entropy tally drawn 25->27, pure 48->46 (the register's own re-measure). Governing set (40 files): 379 passed; red only pipelinePinnedChoosers A1, institutionBudgetPromise, dmLayerGoldenIsolation A7, each the same rows as db61f66fc (origin). |

### Item 4: the five reds, classed (each file run at db61f66fc without the patch and with it)
- crisisHooks.test.js (the tier noun): the ruled houseInProse ("the watch house"): pin re-keyed by identity.
- people/castDerived.test.js ("a power-drawn person holds a membership of that relation"; soak1k-227): THE PATCH'S OWN: an empty-seat rival whose stake is split was told "its power gains from the crisis". Cured at its cause: under an empty seat the rival is an instigator by this rule only where its stake IS gains. Green.
- institutionBudgetPromise.test.js: red at db61f66fc on 8 seeds (2 13 20 27 36 43 48 49), origin (the merge seat's); the patch added seed 51 (cast.roles[].reason, cast.stakes[].reason only): re-keyed by identity. Item 4 also moves 13, 43, 49 (already red at base; hash measured, not field-diffed). The failing set is now the base's.
- pipelinePinnedChoosers.test.js A1: the same three rows red at db61f66fc: origin.
- generationForkCensus.test.js A3e: THE DRAW QUESTION: the temporary person's name is drawn by npcGenerator :: pickFirst on the active stream, which in this step is rng.fork('resolveCrisisCast') (pipeline.js), the step's only draw. Measured: only that step's two rows move. Not a shared stream: a DECLARED MOVE through the census's own door (32438f8d1). Green.
- Ruling (c): DECLARED OFF PLURAL HOLDERS (only 6 hooks of 800 have a house as the line holder, none plural: plural verbs could not be read where they print). Guard: r2r-thorp-16 "the palisade leads the defence".
- Named, not cured: r2s-succession_void-town-3: the rival gains and loses at once, so the instigator is absent ("no power gains") beside two powers that "gain and lose by it at once": the vocabulary's existing pair (14 such crises at base, 15 now). Recommendation: the crisis lane rules whether "no power gains" should read "no power gains alone" (a word change on a ruled vocabulary).

## Rows NOT reached (line by line; kept current)
1. Item 5 (RelationshipsTab, NPCsTab), the chair's added row (WhoRunsThisTownPanel + its PDF twin), the trait chips.
2. The page re-count (`--count-only`) of items 3-5 and this seat's.
3. The lighting census re-freeze (own commit).
4. CENSUS-2 at the tip and at 62e30c7e7 over the lane's files.
5. The message to the chair; then, on the chair's word, the merge, the quick guide's food line, THE FINAL STATEMENT.


# PART 5 — R2-CODE-B-5, the fifth seat (both branches: the rows left, the side branch's merge, the final statement)

**Seat:** R2-CODE-B-5 (session_01ACmDYWXYWK8GnFZ2AehCjo), on the new account; **the chair:** session_01ACmDYZrFEVXyZEUg1NDxxC. Every earlier session is ended. **Tip read back from origin at start:** 5063298a2 (as the brief gave it). Scratch worktree on a local branch; frozen worktrees at 5063298a2, 0570b3441 and each measured tip; plain pushes with the explicit refspec. **First act:** the four commits after db61f66fc read against PART 4 and their bodies: no stop and no question put to the old chair without its ruling copied in; so no first message was sent.

## The brief's rulings, copied (docs/chair/2026-11-14/briefs/BRIEF-R2-CODE-B-5.md on lane/chair-2026-11-08)
- The predecessor's brief (BRIEF-R2-CODE-B-4) binds as written, with these changes: THERE IS NO SIDE SEAT: this seat takes both branches. Never rewrite a commit at or below 5063298a2.
- THE WORK: (1) what PART 4 leaves (the two small tabs; the trait chips apart; the page re-count; the lighting census); (2) THE CHAIR'S WORD FOR THE SIDE BRANCH IS GIVEN: merge origin/lane/r2-code-b-side-2026-11-13 at 5975515ad (plain; say what conflicted); re-make through their own doors the raw-colour budget, the phone chrome floor routes, the dossier phone floors and the lighting census; then the quick guide's food line onto tonightSheet.js :: foodBandOf; (3) the measuring seat's command ONCE on the merged tree over both seats' files at the lane's base and at the tip, every hit read, cured or named; the 720 field diff base against tip by family; (4) one message to the chair and WAIT FOR POINT 49 (the chair names the line's tip); then the merge of the line's tip, the instrument's page census on this lane's lines, THE ONE FINAL STATEMENT (the whole suite once, six vitest shards). The side seat's stops (the fair's act; the PDF's Traditions chapter; items 1 and 2 at the join) are NAMED under FOR THE JOIN, not built.
- THE COUNT: at each turn's end, and after about two hours, with nothing running and everything pushed: a send_later COUNT CHECK, then end the turn; at or over 350,000 tokens, hand back. End the turn after steps 1, 2, 3 and the final statement.
- LONG RUNS to files outside every tree; never end a turn while a needed run is in flight; the whole suite in six shards, a killed shard re-run alone.
- NEVER: a push to any other branch, `--no-verify`, a force push, an empty push, a pull request, master, a golden's door in its writing mode, a deploy, a hosted database or production credentials.

## The chair's rulings received by this seat (notifications)
- 01:30 UTC: ONE ROW ADDED to step 1, from the defence lane's hand-back (its eighth seat): tonightSheet.js :: foodStoresWords "a few weeks in the larder" under ten days (101 births by that lane's count). RULED, item 2a's law: the stores' span in words contains its figure; measure first on the 720; red first, one commit; days said as days. Read the defence lane's endurance-line span words (defenseDisplay.js, on that lane) only to say under FOR THE JOIN whether the two homes should become one; do not touch that file.

- 02:06 UTC: A SECOND ROW ADDED to step 1, from round three's code lane: stressNarrative.js :: RENDERERS (wartime), the stored profit summary "… doing well out of it: army contracts pay, prices are high, and merchants with the right friends are getting rich." in 8 small places with no merchant, two isolated (r2r-thorp-11, -16, -32, -56, r2s-wartime-thorp-1, -hamlet-2, -hamlet-3, -village-2). RULED: merchants only where the roster holds a market or a merchant house; an isolated place is not said to do well on army contracts; a twin true of the town, or nothing; MEASURE FIRST; a DECLARED MOVE confined to the stress summary, red first, a guard town. If the data lane's door (assembleSettlement.js :: rerenderStressSummary) is the summary's one home, build no second path: FOR THE JOIN, and tell the chair.

## Instruments (outside the tree; lost with the container)
- /home/user/seeds800.txt (CENSUS-2's seeds.txt + seeds.readers.txt); CENSUS-2's census2.sh `--count-only` renders: /home/user/r-t0 (5063298a2), /home/user/r-tb (0570b3441), /home/user/r-t1 (e2c446851).
- /home/user/m: q2.mjs (dmPowerViewOf's rows and the NPCs tally over the records), q3.mjs (every Tonight stores span against its months), pc.mjs / pc2.mjs (the page forms of items 3-5, lines and towns, with the empty-seat condition from people/seatKeeper.js).

## Items (this seat)
| item | commit | measured (800 = census's 720 + readers' 80, app shape; page dumps at 5063298a2) |
|---|---|---|
| 5 NPCsTab: the tally's separator only between two counts | 2e905f036 | "1 high influence ·" dangling: 85 towns (thorp 9, hamlet 51, village 8, town 15, city 2) -> 0 |
| 5 RelationshipsTab | none needed | rpf-thorp-calm-13 prints "No neighbours or ties between people are recorded …" beside its recorded tension (the first seat's cure reaches it); the full line, denying conflicts: 0 of 800 |
| 5 the trait chips apart | 846f2bcef | two chips run together in the copied text: 9,279 card lines in 693 towns -> 0 |
| the chair's added row: the DM view's title twice, page and PDF | af8045386 | 10 rows in 10 towns (ruling three 4, handler 2, agent 4; 14 page lines) -> 0; a title the name lacks still prints |
| fix-forward: the fourth seat's ruling-(c) negative anchored | 81be8a6b1 | negativeAssertionAnchor.walker red at 5063298a2 on crisisCastSeatAndAccess.test.js (1 bare not.toMatch) -> green |
| the chair's added row: the Tonight stores' span under ten days | none needed | MEASURED at 5063298a2 over the 800 records (q3.mjs): 800 stores lines; "a few weeks" 0; 36 under ten days, all said in days ("about N days"); every span contains its figure (764 months, 36 days). The defence lane's 101 were counted on its own tree, whose tonightSheet.js predates this lane's aaf314475 (the span's one home) and f719dbb38 (item 2a). No red to make: no commit. |
| the chair's second added row: the wartime profit summary | e06c1a429 | 36 wartime summaries on the 800; profit 6, no market 1 (r2r-thorp-11), isolated 0; 7 of the chair's 8 towns already print the loss text on this tree (item 6's prosperity refusal). DECLARED MOVE: 1 town, stress/stressors `summary` only. The 525 golden configs hash identically with and without it (the golden's 36 reds are the base's). |
| the lighting census re-frozen through its door | e2c446851, then 77927e2ae (titles 29288 -> 29289) | 3239 -> 3244 files (tonightOwnGoal, storesSpanFigure, npcCardAllegianceHandler, crisisCastSeatAndAccess, peopleRowsApart); 34/34 green |

## FOR THE JOIN (this seat)
- THE WARTIME SUMMARY'S ONE PATH: the cure is in stressNarrative.js :: RENDERERS.wartime, which `assembleSettlement.js :: rerenderStressSummary` calls through renderStressSummary on this tree AND on the data lane (lane/w2-fix-data-2026-11-13, read): no second path was built; at the join the data lane's door renders the cured text. Named, not cured (not ruled): the loss text's "Supply caravans pass through on crown requisition" prints in the 4 isolated wartime towns of the 800 (r2s-wartime-thorp-1 and -hamlet-3 among them); RECOMMENDATION: a declared twin of that sentence excluding `route: isolated`, the crisis lane's or the seat after the merges.
- THE STORES' SPAN HAS TWO HOMES that disagree on one figure: this lane's `tonightSheet.js :: storesSpanWords` ("about N days" to ten days, "about N weeks", months to the half below three: "about a month and a half") and the defence lane's `defenseDisplay.js :: monthsInWords` on lane/coherence-upkeep-2026-11-12 ("a day or two", "a few days", "a week or two", "a few weeks" to 31 days, "about a month" to six weeks, then the nearest whole month: 1.5 months reads "about two months", the words item 2a ruled false). RECOMMENDATION: ONE HOME at the join: the endurance line's span reads `storesSpanWords` (its own comment already names that switch as owed); the join seat measures both on the 720 first. On this lane's tree the Defence tab's older monthsInWords prints "a few weeks" in 36 towns (the defence lane's file; cured on its lane).

## THE PAGE RE-COUNT (items 3 to 5 of the third, fourth and fifth seats; one render each of the 800 by CENSUS-2's own census2.sh `--count-only`, exit 0, 800 dumps, at 0570b3441 (the third seat's base) and at the frozen tip e2c446851; pc2.mjs)
| form (page, lines / towns) | 0570b3441 | e2c446851 |
|---|---|---|
| i3 the allegiance badge run into its line | 830 / 236 | 0 / 0 |
| i3 a conflict's pill run into its parties | 630 / 381 | 0 / 0 |
| i3 allegiance lines naming a go-between (the 274 dropped are the other house's handlers; 556 keep their own house's) | 830 / 236 | 556 / 188 |
| i4 "whoever holds the seat" where the seat is EMPTY (people/seatKeeper.js :: isSeatVacant; 40 such towns) | 48 / 25 | 0 / 0 |
| i4 the same words where the seat is held (true; kept) | 210 / 99 | 210 / 99 |
| i4 an "Access to …" row as a lever | 57 / 53 | 0 / 0 |
| i4 "holds what the crisis makes scarce" | 14 / 14 | 0 / 0 |
| i5 the NPCs tally's dangling separator | 85 / 85 | 0 / 0 |
| i5 two trait chips run together | 9,279 / 693 | 0 / 0 |
| i5 the DM view's title twice | 14 / 10 | 4 / 2 (below) |
| i5 the Relationships line denying conflicts | 0 / 0 | 0 / 0 |
- NAMED, NOT CURED (not this lane's file): the 4 lines left of "a title twice" are the Power tab's SEAT line, not the DM view: "The seat Vachir Merv (the senior guild master), the senior guild master and Alderman" and "… holds the seat of the Guild Council" (r2r-town-50; r2s-monster_pressure-metropolis-2 "Rania ibn Hajar (the dean), the dean and Lord Protector of the Faith"), composed by src/domain/display/governanceAccount.js (`${who} holds the seat of …`) and the seat head on the Power tab. A minted face's stored name carries its title; the same rule (add the title only where the name lacks it) is the switch. RECOMMENDATION: the powers lane, or the seat after the merges.
- Limits: the page only (CENSUS-2's render; no PDF, Foundry or Tonight). The PDF twin of the DM view is proven by its test (the same rule, the same rows).

- 02:21 UTC: THE COUNT CHANGED: the mark is 400,000, not 350,000; the check is AFTER EVERY ITEM (every pushed cure), never more than forty-five minutes apart. A hand-back file says WHAT IS LEFT line by line and how the instruments are re-made. ("go on": this seat went on with step 2's first items.)

## Step 2 so far (this seat, after the hand-back of 02:20)
- 083dabdd2 THE MERGE of origin/lane/r2-code-b-side-2026-11-13 at 5975515ad (plain; base 0570b3441; 23 files). CONFLICTED: two registers only. tests/components/dossierPhoneFloorAllViews.test.jsx Systems/Economics, both rows (this lane's item 2a +1, the side's items 1-2 -2): composed, desktop 46, mobile 39/7/7/0; the file 2/2 green on the merged tree. tests/lint/.lighting-census-baseline.json: this lane's kept, then re-frozen. Push hook: ratchet 167/167, strict 1113/1113, lint 0 errors.
- the lighting census at the merged tip (the commit after 083dabdd2): files 3244 -> 3250; 34/34.

## Rows NOT reached (line by line; kept current)
1. STEP 2, what is left: (a) the raw-colour budget (tests/lint/rawColorLiteral.test.js, BUDGET; the side seat banked 1224 -> 1221 on its branch): run it on the merged tip; if it reds, re-bank through its door (the BUDGET constant, its comment naming e6f006eff and this merge) in its own commit. (b) the phone chrome floor routes (tests/components/phoneChromeFloor.census.test.js ROUTE_BASELINE; the side floored /create /settlements /compendium /gallery by -2, 4b80f7cea): run it on the merged tip; re-floor only through its own measure, own commit. (c) the dossier phone floors: done in the merge (above) — re-run tests/components/dossierPhoneFloorAllViews.test.jsx at the tip to confirm it still reads 2/2. (d) THE QUICK GUIDE'S FOOD LINE: src/domain/summary/settlementQuickGuide.js, the `economy.foodSecurity?.label` read, takes `foodBandOf(economy.foodSecurity?.foodRecord)?.label` (import from ./tonightSheet.js), so it agrees with the Tonight sheet and the Daily Life tile in the 160 "Pressured" towns: measure first on the 800 (the quick guide's food word against foodBandOf, per town), red first (a test of the label in a Secure band with a gap), the governing tests of settlementQuickGuide.js, the three gates; display only, the 720 field diff 0. (e) then ONE message to the chair: the tip, the merge's conflicts, and that the wartime summary built no second path (the data lane's rerenderStressSummary calls the cured renderer).
2. STEP 3: CENSUS-2 once on the merged tree over both seats' files at the lane's base (e969a75b7, the line's base; the third seat used 0570b3441 and 62e30c7e7) and at the tip: `sh <c2>/docs/chair/2026-11-13/probes/CENSUS-2/census2.sh <tree> <out-dir outside the repo> 4 --files <both seats' files, comma-separated>` (about 12 minutes each; its own exit and counts.txt read); every hit in the lane's files read, cured or named; the count per kind. THE 720 FIELD DIFF, base against tip, by family: births by CENSUS-2's births.mjs in both trees, a leaf diff (this seat's /home/user/m/fd.mjs: load both corpora, compare every leaf path, count towns and paths by top-level key); expected families: the least-say reasons (49 towns), item 4 (94 towns: stress/stressors cast, npcs 47), the wartime summary (1 town), nothing else.
3. STEP 4: one message to the chair and WAIT FOR POINT 49; on the chair's word the merge of the line's tip, the instrument's page census on this lane's lines, THE ONE FINAL STATEMENT (the whole suite once in six vitest shards, `npx vitest run --shard=<i>/6 --maxWorkers=2`, each to its own file outside the tree; every red classed against the lane's base; ONE draft shift record; the edge bundles last, alone). The side seat's stops (the fair's act, the PDF's Traditions chapter, items 1 and 2 at the join) NAMED under FOR THE JOIN, not built.

## How the instruments are re-made (they lived in this container only)
- The 800 seeds: `cat <c2>/…/CENSUS-2/seeds.txt <c2>/…/CENSUS-2/seeds.readers.txt | grep .` (c2 = `git archive origin/lane/census-2-2026-11-13 docs/chair/2026-11-13/probes/CENSUS-2 | tar -x -C <c2>`).
- A frozen tree: `git worktree add --detach <dir> <sha>` and symlink a node_modules from an `npm ci`'d worktree (package files unchanged across the lane).
- A page render: census2.sh with `--seeds <the 800> --count-only` (~11 min on 4 cores); the corpus is <out>/corpus.ndjson.gz, the dumps <out>/dumps/<seed>.txt, one block line per row under `== Group/Tab ==`.
- A record count: a node script importing the tree's own module by absolute path over the corpus (as the commit bodies of 2e905f036..e06c1a429 describe each count).
- The golden hash identity: run the tree's tests/helpers/goldenMasterCorpus.js configs through generateSettlementPipeline in both trees (a vitest config outside the tree whose `include` names the script) and diff the sha256 per keyOf(config).

# PART 6 — R2-CODE-B-6, the sixth seat (step 0; what PART 5 leaves; the final statement)

**Seat:** R2-CODE-B-6 (session_01ACmDYXHSyAUotEDbwYB3M6); **the chair:** session_01ACmDYZrFEVXyZEUg1NDxxC. **Tip read back from origin at start:** 083dabdd2, not the brief's 14be74cfc. Stopped and told the chair. The chair's word: the fifth seat went on by the chair's own doing and has ended; START FROM c962f8c28 (read back: 14be74cfc, the merge 083dabdd2, the lighting census dc718a8e5, the hand-back c962f8c28); never rewrite a commit at or below it; the side branch's merge is DONE.

## The brief's rulings, copied (docs/chair/2026-11-14/briefs/BRIEF-R2-CODE-B-6.md on lane/chair-2026-11-08)
- STEP 0, ruled now: the wartime LOSS text's "Supply caravans pass through on crown requisition" in the isolated wartime towns. The cure is a declared twin off an isolated route, true of the town, or the clause left out; a DECLARED MOVE of the stored summary only (with counts); a guard town.
- Then PART 5's rows (the chair's message of 02:29 UTC, exactly): row 1 (a) the raw-colour budget and (b) the phone chrome floor routes re-read at the merged tip, each through its own door if it reds; (c) the dossier phone floors confirmed; (d) the quick guide's food line onto tonightSheet.js :: foodBandOf. Row 2: CENSUS-2 once on the merged tree over both seats' files at the lane's base and at the tip; the 720 field diff by family. Row 3: one message, WAIT FOR POINT 49, then the line's merge, the page census, THE ONE FINAL STATEMENT.
- FOR THE JOIN names, not built: the side seat's stops (the fair's act and the Traditions tab's ELEMENT_NEEDS; the PDF's Traditions chapter; the chain card's items 1 and 2); THE STORES' SPAN'S TWO HOMES (storesSpanWords / defenseDisplay.js :: monthsInWords: one home at the join, measured on the 720 first); the wartime summary's one path through the data lane's rerenderStressSummary; the Power tab's seat line that prints a title twice (governanceAccount.js: the powers lane's).
- THE COUNT: after every pushed item, a send_later COUNT CHECK and end the turn; hand back at 400,000.

## Items (this seat)
| item | commit | measured (the 800: CENSUS-2's 720 + the readers' 80, births by CENSUS-2's births.mjs) |
|---|---|---|
| 0 no caravans through an isolated place at war | b47ba9262 | caravans strings 62 in 31 towns, isolated 8 in 4 (r2s-wartime-thorp-1, -2, -3, -hamlet-3) -> 54 in 27, isolated 0. The clause is LEFT OUT (no sentence is true there in its place). DECLARED MOVE: 4 towns, 8 leaves, `stress.summary` / `stressors.summary` only. The generator golden's 525 hashes are byte-identical with and without it. Red first 2/22 -> 22/22. |
| register: the lighting census | 922dadd7f | titles 29321 -> 29325, suiteTitles 7941 -> 7942 (item 0's four titles); verified 34/34 |
| row 1 (a)-(c): the raw-colour budget, the phone chrome floor routes, the dossier phone floors | none needed | re-read at the merged tip c962f8c28 (tests/lint/rawColorLiteral.test.js, tests/components/phoneChromeFloor.census.test.js, tests/components/dossierPhoneFloorAllViews.test.jsx): 29/29 green; the budget is EXACT, so the tip holds 1221; no door to run |
| row 1 (d) the quick guide's food word onto foodBandOf | fc7514261 | stored label against foodBandOf on the 800: 634 agree, 166 disagree (Secure -> Pressured 160; Import-Dependent -> Deficit 6, under a siege) -> the composed "How it lives" line moves in 166 towns, 0 disagree after; a record with no food record keeps its label. SAID PLAINLY: on this tree no surface calls composeSettlementQuickGuide (the Overview reads only cultureScopeLine and governsLine), so no page moves today. Display-time: field diff 0 by construction. Red first 1/18 -> 18/18 |
| register: the writer-reach dark register (a red new on the lane) | a1a9b79bb | tests/lint/writerReach.walker.test.js red at 083dabdd2 / c962f8c28, green at the base e969a75b7: `gapPct on foodRecord` LIT by the lane's d94638185 (foodBandOf). The row struck with cause; `check-writer-reach.mjs --write` (shrink-only: cohort 1363 -> 1363); both row-count pins 34 -> 33 with cause; 52/52 |
| register: the lighting census | db10ddaef | titles 29325 -> 29326 (row 1d's title); verified 34/34 |
| 0b the price line's twin ("the army has the carts and the road") left out where isolated and fed (the chair's ruling of 03:02) | ed308fdd8 | the road twin 29 towns, 2 isolated (r2s-wartime-thorp-1, -3, both fed) -> 27, isolated 0. The resolver reaches one twin only, so the line is left out in the renderer (item 0's form). DECLARED MOVE: 2 towns, 4 leaves, `stress.summary` / `stressors.summary` only; golden 525 identical. Red first 1/24 -> 24/24 |
| register: the lighting census | 5f62d1087 | titles 29326 -> 29328 (item 0b's two titles); verified 34/34 |

## Stops and parked items (with recommendation)
- (cured: the price line's twin "the road" in two isolated thorps, item 0b, on the chair's ruling of 03:02.)

## FOR THE JOIN (this seat, kept current)
- THE QUICK GUIDE'S COMPOSER PRINTS NOWHERE ON THIS TREE (the chair's ruling of 03:02, as found): no file under src/ or supabase/functions calls `composeSettlementQuickGuide` (its identity sentence, its three truths with row 1d's food word, its pressure, people and entry point); only tests read it. What does print the quick guide's lines: `src/components/new/overviewIdentity.js` imports `cultureScopeLine` (the culture scope line: the side seat's item 5) and `governsLine` (who governs), the Overview's identity strip. The composer's header still names Summary, Table View, Session Mode and the PDF; none of them calls it here.

## The chair's rulings received by this seat (notifications, copied)
- 02:27 UTC: HOLD before writing; the predecessor went on by the chair's doing. 02:29: START FROM c962f8c28 (above).
- 03:02: row 1 accepted; the price twin's "the road" in 2 isolated thorps is step 0's fault: cure it in step 0's form BEFORE row 2 if the writer is this lane's (it is: item 0b); and under FOR THE JOIN say what prints the quick guide's lines (done above).
- 03:08: POINT 49 IS ON THE LINE: lane/integration-2026-11-07 = 976db5b19 (the chair's read-back at 03:08 UTC). Step 3's word is GIVEN: do not wait and do not ask; merge the line's tip as read back then (plain; say which commit and what conflicted), the instrument's page census on this lane's lines, then the ONE final statement. FOR THE INSTRUMENT: read the merge book's section 2m "FOR EVERY LANE THAT MERGES THE LINE AFTER POINT 49" (lane/merge-15-point-49-wip-2026-11-14, docs/INTEGRATION_STYLE_2_2026-11-09.md, by script) before touching a register after the merge.
- 03:15 (copied, the chair's measured hazard): A SHALLOW CLONE CAN GIVE A WRONG MERGE BASE, NOT A MISSING ONE (31 false conflict hunks for another lane on the chair's shallow clone; none with full history). BEFORE THE MERGE: `git fetch --depth=2147483647 origin lane/integration-2026-11-07 lane/r2-code-b-2026-11-13`; then `git rev-parse --is-shallow-repository` prints false and `git merge-base --all origin/lane/integration-2026-11-07 HEAD` prints e969a75b7. The chair's in-memory merge of ba83c09da with 976db5b19: 9 conflicted files. CODE, resolved by hand at the cause and listed (the side branch's PDF twins against what points 47 and 48 put on the line): src/pdf/sections/EconomicsTrade.jsx, Services.jsx, SupplyChainFlow.jsx. THE REST (docs/content/wiring-census.json, scripts/.writer-reach-baseline.json, the lighting census, tests/lint/.tuning-inventory.json, dossierPhoneFloorAllViews, institutionBudgetPromise): each taken from ONE side and re-derived through its own door after the merge (a pin re-keyed by identity with its cause), never merged by hand. A conflict outside this list means the base is wrong or the lane moved: look before resolving. FOR THE JOIN, measured: this lane and the third leaves lane both change EconomicsTab.jsx and EconomicsTrade.jsx: name this lane's lines there.
- 03:18: section 2m is pushed (lane/merge-15-point-49-wip-2026-11-14, docs/INTEGRATION_STYLE_2_2026-11-09.md, "## 2m. FOR EVERY LANE THAT MERGES THE LINE AFTER POINT 49", lines 847-884 at b5a783c61): read it before the first register after the merge. READ by this seat (summary of what binds): right after the merge, run each check before anything else (presumed things `node scripts/presumed-things-door.mjs --check`; the page census `node scripts/census/page-census.mjs --workers=2` (the 720, ~15-20 min) and `--grid`; fact layers `node scripts/fact-layers-door.mjs`; observed shapes `node scripts/check-observed-shape-readers.mjs`; writer reach `node scripts/check-writer-reach.mjs`); every register SHRINK-ONLY; a fresh hit of this lane is CURED or DECLARED, a stale row leaves by `--shrink` in the commit that cured it; a page-census RISE is this lane's to cure; never bank by hand, raise a refused row, widen an exemption, skip or loosen; a refusal that cannot be cured is a STOP to the chair with the door's output. The tuning inventory and the lighting census are re-taken only on a clean committed tree through their rituals.

## ROW 3 MEASURED, NOT BEGUN (this seat hands back before the merge: the merge, its six register doors and the whole suite do not fit in what is left of the seat's count, and a half-made merge cannot be pushed)
- EXECUTED at 03:40 UTC in the main clone: `git fetch --depth=2147483647 origin lane/integration-2026-11-07 lane/r2-code-b-2026-11-13 lane/merge-15-point-49-wip-2026-11-14` exit 0; `--is-shallow-repository` false; the line's tip read back 976db5b19 (as the chair's); `git merge-base --all origin/lane/integration-2026-11-07 origin/lane/r2-code-b-2026-11-13` = e969a75b7 (one base).
- A TRIAL MERGE (a throwaway detached worktree at d18e73aa7, `merge --no-commit --no-ff origin/lane/integration-2026-11-07`, then `merge --abort` and the worktree removed): exit 1; 325 paths staged; EXACTLY the chair's 9 conflicted files: docs/content/wiring-census.json, scripts/.writer-reach-baseline.json, src/pdf/sections/EconomicsTrade.jsx, src/pdf/sections/Services.jsx, src/pdf/sections/SupplyChainFlow.jsx, tests/components/dossierPhoneFloorAllViews.test.jsx, tests/generators/institutionBudgetPromise.test.js, tests/lint/.lighting-census-baseline.json, tests/lint/.tuning-inventory.json. Nothing outside the list.
- FOR THE WRITER-REACH CONFLICT: this lane's a1a9b79bb STRUCK `gapPct on foodRecord` by clause S (the identity became LIT; the walker's own message "BANK THE WIN — strike the row", as this lane's item 2 struck `forcedByToggle on institutions`), not 2m's re-point case (a consumer that stopped reading). scripts/lib/writer-dark-register.mjs merges clean; take the baseline from one side, then `node scripts/check-writer-reach.mjs --write` on the committed merged tree, then the walker plain; the row-count pins read 33 on this lane: re-key them by identity to whatever the composed register holds, each with its cause.


## ROW 2: CENSUS-2 ONCE ON THE MERGED TREE (lane/census-2-2026-11-13 at 2686272b1; `census2.sh <tree> <out> 2 --files <the lane's 37 src files, base to tip>`, the census's 720; both runs exit 0, read)
- Trees: the lane's base e969a75b7 (frozen worktree) and the tip ba83c09da (clean worktree).
- Kinds over the 720 (towns · distinct lines), base -> tip: a 716·619 -> 688·531; b 70·99 -> 70·99; c 292·296 -> 260·153; d 381·39 -> 349·14; e 60·20 -> 60·20; f 720·345 -> 306·52; g 720·14 -> 720·14; h 21·68 -> 2·2. NEW 0 on both (no cold lists joined: "unjoined").
- The lane's files with hits, base -> tip: settlementQuickGuide.js c 158 / a 59 towns -> a 2; crisisCast.js a 18 -> 0; stressNarrative.js a 8 -> 0; crisisHooks.js f 6 -> 0; EconomicsTab.jsx a 498 -> 6, f 307 -> 206; InstitutionsTab.jsx f 720 -> 300; PowerStrata.jsx f 720 -> 296; WhoRunsThisTownPanel.jsx f 81 -> 13; traditionCorpus.js a 3 -> 3; institutionDisplayName.js f 0 -> 6 (its label now reaches the Outlook line; ruled-kept qualifier).
- EVERY HIT AT THE TIP IN THE LANE'S FILES, READ (a hit is a candidate):
  - f, all five writers (InstitutionsTab, PowerStrata, WhoRunsThisTownPanel, institutionDisplayName, EconomicFlowsSection): "Bowyers & fletchers (guild)", "Inns and taverns (district)": the ruled-KEPT in-world qualifiers (ruling (a)). Kept.
  - traditionCorpus.js a, 3 towns: "The Fair of the First Landing" with no fair: the side seat's FAIR stop (FOR THE JOIN). Named.
  - settlementQuickGuide.js a, 2 towns (r2s-indebted-village-3, r2s-mass_migration-hamlet-1): the Greek scope's "built around the harbour" on a coastal place whose roster holds no docks. The scope's harbour gate is the record's water (`navigable`, ruling 5); the census reads a harbour as a house. NAMED, NOT CURED (a ruled gate; whether a coast's harbour needs a docks house is a ruling).
  - EconomicsTab.jsx (the third leaves lane's file, as the side seat's brief says: not this lane's to change): g 720 towns "Agriculture modifier: 69%" (machinery on the page); a 6 "ships bring in most of the rest" with no ships on the roster (r2r-thorp-24); b 25 "a bad season would bring real hunger" under a famine (shortWords; r2r-hamlet-16); b 1 "No recorded imports." while the roads are cut (r2s-under_siege-thorp-2). NAMED with their owner.
- LIMITS: the dossier's page views only (no PDF, Foundry, Tonight, exports); it cannot see two lines disagreeing.

## THE 720 FIELD DIFF, base e969a75b7 against the tip ba83c09da (the two censuses' own births, every leaf; /home/user/b6/m/fdiff.mjs)
- 129 towns, 929 leaves, THREE families, each one this lane declares: `stress` 446 leaves / 129 towns and `stressors` 446 / 129 (the cast: roles' reason / id / name / kind / temporary, levers, stakes in 113 towns: item 4 and the least-say reasons; the summary in 53 towns: famine 42 (item 6's grain twin), wartime 13 (item 6's prosperity refusal, the fifth seat's market refusal, items 0 and 0b)); `npcs` 37 leaves / 37 towns (whole entries, item 4's). Nothing else moved.

## Rows NOT reached (line by line; kept current)
1. (done: row 1 (a)-(d); the message to the chair with the tip follows this push.)
2. (done: row 2, above.)
3. Row 3, THE WORD GIVEN (03:08) — THE EXACT NEXT STEP for the successor, in this order: (i) deepen as above if the clone is shallow, check the base is e969a75b7; (ii) in a scratch worktree at the lane's tip, `git merge origin/lane/integration-2026-11-07` (read the tip back first; 976db5b19 at 03:40); resolve the three PDF sections by hand AT THE CAUSE (read each whole: the side seat's items 1-3 removed the upstream note, the "Import: <chain label>" From line and the template house list from SupplyChainFlow.jsx and Services.jsx; keep the line's point 47/48 changes and this lane's removals), take each of the six registers from ONE side; commit the merge naming the commit and what conflicted; (iii) run 2m's checks, then re-derive each register through its door (wiring census, writer reach, lighting census, tuning inventory, dossier phone floors, institutionBudgetPromise's pin), each its own commit; (iv) the page census on this lane's lines (2m's door, the 720); (v) THE ONE FINAL STATEMENT: merge lane/integration-2026-11-07 at its tip as read back (976db5b19 at 03:08; plain; say what conflicted); read section 2m of the merge book first; the instrument's page census on this lane's lines; THE ONE FINAL STATEMENT in the brief's form (the whole suite once in six shards, every red classed against the lane's base; ONE draft shift record; FOR THE JOIN; the edge bundles last, alone).

## Instruments (outside the tree; lost with the container; re-made as PART 5 says)
- /home/user/b6: seeds800.txt; births-base (c962f8c28's code = 083dabdd2's) and births-i0 (item 0) corpora; m/war.mjs (caravans strings by route), m/fdiff.mjs (leaf diff by family and path), m/ghash.mjs (the golden's 525 hashes in a tree, read only).

## HAND BACK (2026-11-14 ~03:45 UTC; the seat's own count read by get_session at 03:39: 318,441 tokens, under 400,000; handed back early by judgement, see ROW 3 above)
Step 0, items 0 and 0b, row 1 (a)-(d) and row 2 are done and pushed; nothing is running. A successor starts at row 3 (i). Instruments (lost with the container): /home/user/b6 (seeds800.txt; births-base, births-i0, births-i0b corpora; cen-base and cen-tip, the two CENSUS-2 outputs with dumps, counts.txt, hits.json; m/war.mjs, m/hunger.mjs (wartime summaries by route and hunger), m/fdiff.mjs (leaf diff by family), m/ghash.mjs (the golden's 525 hashes, read only), m/food.mjs and m/cmpqg.mjs (the quick guide's food word)); frozen worktrees /home/user/wt-base (e969a75b7), /home/user/wt-tip0 (083dabdd2), the working one /home/user/wt-b6. Re-made as PART 5's "How the instruments are re-made" says; m/fdiff.mjs is twenty lines (load both corpora, walk every leaf, count towns and paths by top-level key).

---
# PART 7 — R2-CODE-B-7, the seventh seat (the line's merge, the instrument's findings, the final statement)

**Seat:** R2-CODE-B-7 (session_01ACmDYaHvaJ1hdXFn6nAMFt); **the chair:** session_01ACmDYZrFEVXyZEUg1NDxxC. **Brief:** docs/chair/2026-11-14/briefs/BRIEF-R2-CODE-B-7.md on lane/chair-2026-11-08. **Tip read back at start:** c40da4ec6 (as the brief); the line's tip 976db5b19 (as the brief). Full history fetched; not shallow; one merge base e969a75b7.

## The brief's rulings, copied
- The work in order: full history; THE MERGE of the line's tip (plain; 9 conflicted files; the three PDF sections by hand at the cause, both sides' cures standing; the six registers and pins each from ONE side, then re-derived through its own door, each its own commit; the edge bundles last, alone); EVERY CHECK OF 2m right after the merge (a red naming this lane's lines cured or declared through its door; another lane's red named with its owner; nothing banked by hand); the page census on this lane's lines (the 720); THE ONE FINAL STATEMENT. No adjacent repair; never rewrite a commit at or below c40da4ec6; merging the PR and the deploy are the owner's.
- The chair's notification of 03:52 (copied): the ONLY branch merged into the lane is lane/integration-2026-11-07 (976db5b19); lane/chair-2026-11-08 is read only; the merge's second parent is the line's tip. (Checked: 0aa0cce00's parents are c40da4ec6 and 976db5b19.)

## Items (this seat)
| item | commit | measured |
|---|---|---|
| THE MERGE of 976db5b19 | 0aa0cce00 | exactly the 9 predicted files conflicted, nothing outside the list; 325 paths. EconomicsTrade.jsx 1 hunk (PROC the lane's chainHousesOf; OUT the line's "Normally yields"); Services.jsx 3 hunks (both props; the line's `shown` kept; source through ruling (d) over the line's access name; houses the lane's; outputs the line's); SupplyChainFlow.jsx 2 hunks (importedUpstream's removal stands, the line's `refused` kept; the source node as in Services). No hunk needed a choice between two behaviours. The six registers taken from the line's side. Only the nine files differ from git's own merge-tree result (lint-staged moved nothing). |
| cure: the toll's From under the town's access (ruling (d) composed with F1) | e285c603f | red carried by the merge: tests/components/chainPrintName.test.jsx 4 of 5 seeds. chainSourceOf(chain, printed): where chainPrintName renamed the source, the source is the access. 96 of the 800 towns, 96 chains, all the toll: port -> "Harbour traffic" 35, river -> "River traffic" 61 (the line's own F1 word). Read: r2r-village-2, r2r-city-44 (famine), r2s-under_siege-metropolis-1, r2s-occupied-town-3. Guard r2r-town-14 (crossroads). Display only. |
| register: writer reach | 5518495b7 | `--write`: cohort 1378 -> 1378; dark register merged clean (the lane's strike stands); pins hold at 33; 52/52 |
| register: wiring census | bd39e82ad | `node scripts/wiring-census.mjs`: crisisCast.CAST_REASONS 46 -> 50 lines (38 -> 42 undeclared), traditions.TRADITION_ELEMENTS 122 -> 124 (this lane's added lines); walker green |
| pin: institutionBudgetPromise | 0bd857e2e | 9 of 60 against the line's sixty (seeds 2 13 20 27 36 43 48 49 51), none by the budget; leaves `stress` 34, `stressors` 34, `npcs` 3: this lane's declared families |
| pin: dossier phone floors | 52cef8722 | Economics 46 -> 45 and chrome 7 -> 6 (both sides' moves composed from the base's 47 and 39/8/8); NPCs 282 -> 280, 281 -> 279 (the lane's item 1); 2/2 |
| register: the page census grid | c92e16849 | `--grid`: 11 falls, 0 rises (P11 4, P16powers 5, P18 2), lowered by `--grid --shrink`; 14/14 |
| cure: the faith leaf declares `stress` | f9ee7541d | tests/lint/factLayers.walker.test.js "every leaf declares exactly the strata it touches": `faith` (layer 3) touched `stress` (stratum 0) undeclared, this lane's read (R2-CODE-B-SIDE item 7, the siege that bars the road to church). Declared in factLayers.js; no layer raised, nothing banked. |
| register: presumed things, the stale row | 85e9a8e8d | `--shrink`: 1 stale row (tonightSheet.js, granary: the stores cure) out |
| register: the page census, the 720 | 9d6b4da65 | `--workers=2` exit 0, no rise; falls P11 448 -> 0, P16powers 281 -> 0, P18 360 -> 341, P8any 221 -> 218, lowered by `--from --shrink` |
| register: the tuning inventory | cf8e330fd | the ritual on the committed tip; no value moved; three tables' lines in this lane's files; WANT_MAX_WORDS gains DailyLifeTab.jsx; 76/76 |
| register: the lighting census | f1e322a17 | the ritual: files 3245 -> 3271, titles 29407 -> 29532, suiteTitles 7974 -> 8015; 34/34 |

## 2m's checks right after the merge (the merged tip, each by its own command, exits read)
- presumed things `--check`: exit 1, fresh 18 · stale 1 (the stale row shrunk above; THE 18 PARKED, below).
- fact layers: exit 1, 1 rise + 1 fall (the guild clause, PARKED below); the LEAVES arm's faith row cured above.
- observed shapes: exit 0. Writer reach: exit 0 (then `--write`, above). Page census `--grid`: exit 0, 11 falls (shrunk above); the 720: exit 0, no rise (shrunk above).

## Stops and parked items (with recommendation) — NOT cured, NOT banked
1. **PRESUMED THINGS, ARM 1: 18 FRESH HITS ON THIS LANE'S OWN LITERALS** (written after the instrument's base; the line never touched these files). `node scripts/presumed-things-door.mjs --check` at f1e322a17 prints them: src/domain/summary/settlementQuickGuide.js 15 (the scope clauses of the side seat's item 5, 66a4f587c, and the scope tables before it: `streets` 6 ("built around the agora…", "in quarters by trade…", "built in masonry around a civic square"), `market` 4 ("built on tribute and market", "tribute, and market-and-waterworks"), `docks` 2 ("built around the harbour", "…the agora and the harbour"), `temple` 2 ("under temple and guild", "under the temple"), `quarters` 1 ("built around kin districts and an assembly ground")); src/domain/dossier/faithReading.js 3 (`shrine` ", and the shrines answer to no named god."; `siege` and `temple` of one sentence " has no church of its own, and the siege keeps its people from the next village's parish church."). Each clause IS gated in code by the record (rosterHolds / the size / ruling 5's `navigable` water for the harbour / the siege in force), but not DECLARED through a draw door's carriers (`needs`/`excludes` through drawDeclared/filterDeclared/resolveDeclared), so the walker counts it undeclared; `--bank` refuses a new line. WHY NOT CURED HERE: declaring them is a re-route of the quick guide's and the faith reading's gates through the doors, a DECLARED MOVE of display text with its own read-where-it-prints per clause, and the harbour clause stands on ruling 5 (a coast's harbour by its water, not by a docks house: the sixth seat named it, "a ruling"). RECOMMENDATION: the chair rules (a) whether the scope clauses move into a drawn table with atoms (streets, market, docks, temple, quarters, shrine, siege), and (b) for the harbour, whether its atom is the docks house (changing ruling 5) or a water atom (a new word: PARKED with its word); then a seat of this lane makes the move, red first, and `--check` reads 0 fresh. Until then tests/lint/presumedThings.walker.test.js "every source literal that names a thing declares it, or has its row" stays RED, this lane's.
2. **FACT LAYERS, READERS: the guild clause's reader re-worded.** `node scripts/fact-layers-door.mjs` at f1e322a17: RISE `if (roster && out.includes('run by guild and estate') && !rosterHolds(source, GUILD_HOUSE))`, FALL the banked `… !factsOf( (source)).guild)`: the side seat's item 5 (66a4f587c) deliberately reads the guild HOUSE (a guild that only contends is a power: #234). The register keys by content, so the reworded line is a new row; `--shrink` refuses a rise. RECOMMENDATION: the same rework as 1 (the clause identity carried by the table, so no `out.includes('…guild…')` name test remains), or the chair rules the row's content re-keyed with its cause. Until then tests/lint/factLayers.walker.test.js READERS stays RED, this lane's.

## The chair's rulings received by this seat (notifications, copied)
- 04:37 UTC, to every seat (hazard bitten twice): a push with NOTHING TO SEND falls into the pre-push hook's WHOLE suite, and tests/scripts/implementationPackets.test.js and implementationSession.test.js then run git against the REAL repository from the linked worktree (the branch moved to a fixture, core.bare=true, a fixture user). BEFORE EVERY PUSH: `test -n "$(git rev-list origin/<branch>..<local>)"`; never chain a push after a step that can fail. (This seat: every push carried commits; every refs/config snapshot before and after compared equal.)
- 04:58 UTC: the merge and registers ACCEPTED at 9e8d2af22. STOPS 1 AND 2 RULED (vetoable), by the ruling made once for every closing lane: THE INSTRUMENT'S FRESH HITS AFTER THE LINE'S MERGE: (1) a stale row leaves by the door's shrink form; (2) a fresh hit where a set or table ALREADY declares the atom and the text only stands apart: the SHAPE CURE (the literal into its declaring member, output byte-identical); (3) a fresh hit on a line GATED IN CODE (true wherever it prints) but not declared through a draw door: NOT banked, NOT keyed by hand, NOT reworded to slip the matcher, NOT re-routed now: it stays RED AND NAMED under FOR THE DECLARATION PASS (file, text, the code condition, the atom, any new word); ONE DECLARATION PASS after the join, on the joined tree, for every lane; (4) a fresh hit on a line FALSE somewhere is a cure, now. The same for a fact-layers rise that is only a reader's reworded condition. For this lane: STOP 1's eighteen are class (3); (a) yes, the scope clauses belong in a drawn table with atoms, made in that pass, not now; (b) THE HARBOUR: ruling 5 stands (a coast's harbour by its water); its atom is a new word, PARKED WITH ITS WORD (navigable water). STOP 2: named the same way, both contents given; nothing re-keyed by hand. The statement gives each walker's exit and says these reds are the lane's, named.

## THE WHOLE SUITE, ONCE, IN SIX SHARDS (at 9e8d2af22; `npx vitest run --exclude='tests/build/**' --shard=<i>/6 --reporter=json`, each to its own file outside the tree; the ledger ref fetched first)
- 3204 files, 38,750 tests: 41 failed, 17 skipped/todo; each shard's own exit 1; refs and local config snapshotted before and after every shard and every classing run: all equal.
- CLASSED by re-running the 30 red files on frozen trees of the line 976db5b19, the lane's base e969a75b7 and the lane's own pre-merge tip c40da4ec6 (JSON per tree):
  - CARRIED, red on the line too (10; the line's, named, not touched): tests/lint/proseFamilyContract.walker.test.js 5; tests/property/dossierProseManifest.test.js 3; tests/data/foundingWorldBones.test.js 1; tests/lint/siteCoherenceRatchet.test.js 1.
  - THE LANE'S, red at its own tip c40da4ec6 before the merge, green on the line and at the base (27): tests/domain/recordInvariants.test.js; tests/domain/recordMerge.test.js; tests/edgeFunctions/aiGroundingBundle.freshness.test.js; tests/edgeFunctions/edgeSharedBundleReproducibility.test.js ×2; tests/generators/densityLaw.test.js; tests/generators/hookThemeDraws.test.js; tests/generators/nameHeldThroughAssembly.test.js; tests/generators/pipelinePinnedChoosers.test.js; tests/generators/pipelinePinnedMode.test.js ×3; tests/generators/powerEconomyFreshness.test.js; tests/generators/rosterDuplicateDraws.test.js; tests/generators/rosterFinalUnderHeldRoster.test.js; tests/generators/x46NpcBand.test.js; tests/joins/fieldManifest.test.js; tests/lint/mutationCoverageManifest.test.js; tests/lint/negativeAssertionAnchor.walker.test.js; tests/lint/recordRegisterTotality.walker.test.js; tests/lint/seedLoopTotality.walker.test.js; tests/property/dmLayerGoldenIsolation.test.js; tests/property/editCorpusRatchet.test.js ×3; tests/property/espionageDormancyFence.test.js; tests/property/generatorGoldenMaster.test.js. (The goldens and pins its declared moves shift, signed at the merge point; the edge bundles, rebuilt last; the walkers among them to be read against the fifth and sixth seats' classing.)
  - COMPOSED, red only at the merge (4): tests/lint/presumedThings.walker.test.js "every source literal … declares it, or has its row" (ruled class (3): FOR THE DECLARATION PASS, below); tests/lint/factLayers.walker.test.js READERS (ruled the same, below); tests/lint/defenceFactReaders.walker.test.js "every file reads exactly its banked count" and tests/lint/proseNumerics.test.js "legacy debt moved/fell" (193 rows): NOT YET READ by this seat (the next step's first row).

## FOR THE DECLARATION PASS (the chair's ruling of 04:58: red and named; NOT banked, keyed, reworded or re-routed now)
- src/domain/summary/settlementQuickGuide.js, 15 literals of the scope frames (SCOPE_PHRASE, l. 734-745) and their struck variants in scopeAtSize (l. 341-365) and scopeAgainstRoster (l. 405-420): `streets` 6 ("built in masonry around a civic square", "built around the agora, …" ×2, "built around the agora and the harbour", ", in quarters by trade and kin", ", in quarters by trade,"), gated by scopeAtSize (TINY_TIERS: no square, quarter or agora in a small place); `quarters` 1 ("built around kin districts and an assembly ground"), the same gate; `market` 4 ("built on tribute, market and waterworks", "tribute, and market-and-waterworks", "tribute and market", "built on tribute and market"): WATERWORKS_HOUSE strikes the waterworks, the market stands as the frame's; `docks` 2 ("built around the harbour", "… the agora and the harbour"): the record's water (`water !== 'maritime'` strikes it, l. 290; ruling 5); `temple` 2 ("under temple and guild", "under the temple"): GUILD_HOUSE strikes the guild.
- FOUND, FOR THE CHAIR (a correction of ruling (b)'s premise, not acted on): the WHOLE frames are ALREADY DECLARED in QUICK_GUIDE_SIBLINGS (l. 952 on): the Greek frame `needs: ['navigable']`, the south-asian `needs: ['market', 'institution: temple']`, the mesoamerican `needs: ['market']`. So the harbour's atom is the existing `navigable` (no new word), and the struck variants may be class (2), literals standing apart from a member that declares their atom (the SHAPE CURE, output byte-identical), rather than class (3). Recommendation: the chair re-rules on that fact; the shape cure moves each struck variant into its declaring set as a twin.
- src/domain/dossier/faithReading.js, 3: `shrine` ", and the shrines answer to no named god." (gated: no named god on the record); `siege` and `temple` " has no church of its own, and the siege keeps its people from the next village's parish church." (gated: the siege in force, R2-CODE-B-SIDE item 7, and no church on the roster); atoms: shrine, siege, the church's absence.
- STOP 2, the fact-layers READERS row of settlementQuickGuide.js `guild`: banked `if (roster && out.includes('run by guild and estate') && !factsOf( (source)).guild) {`; now `if (roster && out.includes('run by guild and estate') && !rosterHolds(source, GUILD_HOUSE)) {` (R2-CODE-B-SIDE item 5, 66a4f587c: a guild only with a guild HOUSE). Nothing re-keyed.
- Exits at 9e8d2af22: presumed-things `--check` 1 (fresh 18, stale 0 after 85e9a8e8d); fact-layers door 1 (1 rise, 1 fall); both walkers red, THIS LANE's, named.

## HAND BACK (2026-11-14 ~06:00 UTC, by file at the count's mark; nothing running)
THE EXACT NEXT STEP, in this order: (1) read the two unread COMPOSED reds (defenceFactReaders.walker, proseNumerics) at the tip: each a count- or line-keyed register that a merged file moved, re-derived through its own door in its own commit, or a new read cured; (2) CENSUS-2 at the tip (the 720, `census2.sh <tree> <out> 4 --files <the lane's files>`) against the sixth seat's tip counts (PART 6, ROW 2): the merge changes what the lane's files print where this seat's toll cure moves the From line (96 of the 800, PART 7) and where the line's changes compose; then the 720 field diff, base e969a75b7 against the tip, by family (the budget pin's 60 already read `stress`, `stressors`, `npcs` only); (3) ONE draft shift record named for the lane (the six golden surfaces and every registered surface the red titles above pin: tests/fixtures/.golden-freeze-register.json), by measure; (4) FOR THE JOIN gathered whole from PARTS 2, 3, 5, 6 (the side seat's stops; the stores' span's two homes; the wartime summary's one path; the quick guide that no surface calls; the Power tab's seat line), plus this lane's lines in EconomicsTab.jsx (l. 169, chainFlowFacts(chain, instNames, shown), this seat) and EconomicsTrade.jsx (the PROC row's chainHousesOf), which the third leaves lane also changes; (5) the new words gathered (PART 1 items 3-6; PART 2 (a)-(c); PART 3 item 2a; the side seat's, in its commit bodies; this seat adds none: the toll's "Harbour traffic" and "River traffic" are the line's F1 words); (6) the edge bundles LAST: `npm run build:edge-shared`, committed alone if they differ (expected to cure edgeSharedBundleReproducibility ×2 and aiGroundingBundle.freshness); (7) THE ONE FINAL STATEMENT, and one message to the chair.

## Instruments (outside the tree; lost with the container)
- /home/user/wt-b7 (the working worktree, branch b7-work), frozen trees /home/user/wt-line (976db5b19), /home/user/wt-base (e969a75b7), /home/user/wt-lane0 (c40da4ec6), node_modules symlinked; /home/user/b7/suite (the six shard reports s1-6.json, fails.mjs, cmp.mjs, classed.txt, classed2.txt, the classing reports cls-line/base/lane0.json), /home/user/b7: seeds800.txt; births-m (the merged tree's 800); c2 (CENSUS-2 at 2686272b1); m/toll.mjs (the toll's From with and without the printed name), m/read.test.jsx (the Economics card read from the corpus), m/ibp.test.js (institutionBudgetPromise's own loop, the factor forced to 1), m/leaf.mjs (the moved seeds' leaves by family); chk/ (each door's output).

# PART 8 — R2-CODE-B-8, the eighth seat (the two composed reds; the twenty-seven classed; CENSUS-2; the shift record; the final statement)

**Seat:** R2-CODE-B-8 (session_01ACmDYawEQFDbM8JwGmhXUT); **the chair:** session_01ACmDYZrFEVXyZEUg1NDxxC. **Brief:** docs/chair/2026-11-14/briefs/BRIEF-R2-CODE-B-8.md on lane/chair-2026-11-08. **Tip read back at start:** 327035149 (as the brief); the line's tip 976db5b19 (unchanged).

## The brief's rulings, copied
- The work in order: (1) the two unread COMPOSED reds; (2) the twenty-seven, each in ONE class by reading its failure: (a) a golden or pin a DECLARED move shifts (the draft shift record; no golden's door in its writing mode), (b) a walker, manifest or register this lane's files red (cured through its own door now, or named with the merge seat's door), (c) the edge bundles' three (step 6); (3) CENSUS-2 at the tip against PART 6 ROW 2, then the 720 field diff by family; (4) ONE draft shift record; (5) the gathering (FOR THE JOIN, THE NEW WORDS, FOR THE DECLARATION PASS as re-ruled, LEFT FOR AFTER THE JOIN); (6) the edge bundles last; (7) the final statement. NO new cure of a page line beyond what the checks ask; only files this lane holds.
- THE QUICK GUIDE RE-RULED (the chair, 2026-11-14 06:40 UTC, vetoable): (i) the harbour needs no new word (the Greek member of QUICK_GUIDE_SIBLINGS declares `navigable`; ruling 5 stands; "parked with its word" of 04:58 WITHDRAWN); (ii) the struck variants are NOT made twins now (that moves HOW the variant is chosen: class (3), for the pass); all eighteen stay RED AND NAMED; (iii) each quick-guide row's wording in the statement says (a) a replace()'s FIRST or SECOND argument, (b) whether the frame's member already declares the atom (a SHAPE ROW), (c) else the code condition and the atom it would need. The fact-layers reader's row stays as ruled.

## The chair's rulings received by this seat (notifications, copied)
- 07:32 UTC, STOP 1 RULED (vetoable): the six reds are a REAL fault of the lane's own, not pins: a person in the record is a WHOLE person. CURE AT THE MINT, a declared move of the npcs family, its own commit, the six reds as its red-first guard: the temporary person carries every field the record's contract asks of a born person (`importance` and whatever else recordInvariants names), and is minted where the receipt and every count read it (before the receipt counts, or the receipt counts after: whichever keeps the receipt TRUE; never a count edited to fit). Measure on the 720: how many towns mint; the field diff confined to npcs and the receipt; read the minted person where it prints in three towns, a crisis among them. If the density law is exceeded BY DESIGN (one person over a cap): STOP with both sides. Steps 1-2 accepted. THE WHOLE SUITE is run once on the joined tree: this lane's stays as classed.

## Items (this seat)
| item | commit | measured |
|---|---|---|
| step 1: defenceFactReaders.walker, crisisCast.js 3 -> 2 | e990583dc | a FALL: the line banked the base's three reads; this lane's item 4c (90bafc4d1) retired the house fallback's regex to the defence home (partitionDefenseInstitutions). Row lowered by the register's own form (a row falls the commit its reader retires). |
| step 1: proseNumerics, Services.jsx `{flow}` 245 -> 246 | 3c59ceaab | a PURE LINE MOVE: the file's one `{flow}` at l. 240 on the line, 245 at c40da4ec6, 246 merged; snippet/category/path identical; one -/+ pair. Both files 51/51 green. |
| step 2, class (b): negativeAssertionAnchor.walker | 490afeae6 | 10 bare negatives in the side seat's faithAccessUnderSiege (2) and quickGuideScopeRoster (8) tests, anchored by the helper (removal by its calm thorp; selection by a sibling clause the same line prints) |
| step 2, class (b): seedLoopTotality.walker | ab12a9983 | 8 bare seed loops in dailyLifeFoodTileBand (2), crisisCastSeatAndAccess (2), storesSpanFigure (1), tonightOwnGoal (3): collectSeedFailures/expectNoSeedFailures, bodies byte-identical |
| step 2, class (b): fieldManifest (upstreamNote) | ad254be9d | src/domain/fieldManifest.js: the two consumers the lane's 2ed36a430 stopped reading (SupplyChainsPanel.jsx, SupplyChainFlow.jsx) dropped; supplyChainState.js stays. strict 0, ratchet 167/167, eslint 0 |
| step 2, class (b): mutationCoverageManifest | b8b0f2971 | a rationale entry for tests/generators/stressSummaryDeclared.test.js, the mutation EXECUTED (grain gate inverted: 2/4 red; profit refusal dropped: 3/4 red; restored 4/4) |

## Step 2: THE TWENTY-SEVEN, CLASSED BY READING EACH FAILURE (re-run at 327035149, JSON to a file: 24 files, 496 tests, 29 red = the same 27 + the two ruled reds; the set did not change at the merge or by the seventh seat's cures)
| class | file :: test | the failure read |
|---|---|---|
| (a) golden | tests/property/generatorGoldenMaster.test.js | 36 configs differ from the golden master |
| (a) golden | tests/property/espionageDormancyFence.test.js :: THE DRIVEN GOLDEN | the 360-settlement hash moved (2e5ba810… for 05f70cf9…) |
| (a) golden | tests/property/dmLayerGoldenIsolation.test.js :: A7 | 36 rows: the dormant re-derivation is the moved golden |
| (a) golden | tests/generators/nameHeldThroughAssembly.test.js :: A1; rosterFinalUnderHeldRoster.test.js :: A1; pipelinePinnedChoosers.test.js :: A1; pipelinePinnedMode.test.js :: A1, A2, A5; powerEconomyFreshness.test.js :: A4 | each "a golden row moved with no pin bag": 3 rows of the golden corpus, the same 3 in each (the pin seams' null-change checks read the committed golden) |
| (a) pin | tests/generators/hookThemeDraws.test.js :: pin:no-hook-is-lost | the NPC denominator 2107 -> 2109 (two temporary persons in its corpus) |
| (a) pin | tests/generators/rosterDuplicateDraws.test.js :: the corpus is live | births with rosters of two or more 853 -> 889 of 1,000 |
| (a) pin | tests/generators/x46NpcBand.test.js :: sixty seeds | 6 dark worlds differ from their digests (x46-dark-thorp-005, …) |
| (a) pin | tests/property/editCorpusRatchet.test.js :: A7 | the honesty figures [682, 269, 2181] -> [674, 269, 2185] |
| (b) cured | negativeAssertionAnchor.walker, seedLoopTotality.walker, joins/fieldManifest, mutationCoverageManifest | the four commits above |
| (c) edge | aiGroundingBundle.freshness; edgeSharedBundleReproducibility ×2 | the recorded source hashes: step 6 |
| STOP 1 | tests/generators/densityLaw.test.js :: hamlet (R-P5); tests/lint/recordRegisterTotality.walker.test.js :: A6; tests/domain/recordInvariants.test.js :: EM-R0b A1; tests/domain/recordMerge.test.js :: A1; tests/property/editCorpusRatchet.test.js :: A1, A8 | ONE CAUSE, read in each: the crisis cast's TEMPORARY PERSON. This lane's ROUND THREE item 4 (77ed210af, ruling (a), a DECLARED move: 47 of 800 towns gain exactly one temporary person in `npcs`) reaches the mint in src/generators/steps/resolveCrisisCast.js (l. 76-86, unchanged since the base, on no lane): the minted entry has NO `importance` (densityLaw: `expected [minor, notable, key, pillar] to include undefined` for npc_temp_healer in a dens-e2e hamlet; recordRegisterTotality: "card-standing: importance missing from an npcs[] entry") and is appended AFTER the coherence receipt's graph evidence counted the roster (recordInvariants and editCorpusRatchet A8: V-EVIDENCE-ROSTER, "the receipt's graph evidence names roster sizes the record's own rosters do not carry", on exactly the golden-master-v3 thorps and hamlets that carry a temporary person; recordMerge A1 and editCorpusRatchet A1: merge(record, X, X) is not the record on the same two). Not a golden, not a pin, not a register of this lane's files: a record-integrity law the declared move breaks. NOT CURED (the brief: a red that fits none of the three is a STOP). RECOMMENDATION: a cure at the mint, red first, as a declared move of `npcs` (the temporary person stamped `importance: 'minor'` by the roster's own rule, and the receipt's roster evidence taken after the cast step, or the person counted in it), its field diff confined to `npcs` and the receipt; then the goldens of class (a) re-measured, since they move again. |

## Step 3: CENSUS-2 AT THE TIP (lane/census-2-2026-11-13 at 2686272b1; `sh <c2>/census2.sh /home/user/wt-b8 /home/user/b8/c2tip 4 --files <the lane's 38 src files: the 37 base..c40da4ec6 and the seventh seat's two cures' files>` at fd9c09f42 (b8b0f2971's tree + docs), the census's 720; its own exit 0; births+render 708 s, count+trace 118 s; counts.txt 1975 rows, read)
- THE BASE'S COUNTS are PART 6 ROW 2's, the same instrument (2686272b1) and the same 720 at e969a75b7: not re-run (no base file changed). Kinds (towns · distinct lines) base -> the sixth seat's tip ba83c09da -> THIS TIP: a 716·619 -> 688·531 -> 678·524; b 70·99 -> 70·99 -> 70·101; c 292·296 -> 260·153 -> 276·155; d 381·39 -> 349·14 -> 350·15; e 60·20 -> 60·20 -> 60·20; f 720·345 -> 306·52 -> 309·53; g 720·14 -> 720·14 -> 720·14; h 21·68 -> 2·2 -> 2·2.
- THE LANE'S FILES with hits at this tip (towns): EconomicsTab.jsx g 720, a 6, b 29, f 213; InstitutionsTab.jsx f 303; PowerStrata.jsx f 298; WhoRunsThisTownPanel.jsx f 13; institutionDisplayName.js f 7; traditionCorpus.js a 3; crisisHooks.js a 1 (by the hit's trace); settlementQuickGuide.js a 2 -> 0 (the Greek harbour hits gone).
- THE RISES, READ: c (+16 towns) and d (+1) are in no file of the lane's (the line's merged writers). f in the lane's files (+3 InstitutionsTab, +2 PowerStrata, +7 EconomicsTab, +1 institutionDisplayName: the siege's "critically impaired" list now names "Inns and taverns (district)" in 6 sieged cities and metropolises): every one the ruled-KEPT in-world qualifier ("Inns and taverns (district)", "Bowyers & fletchers (guild)", ruling (a)). b in EconomicsTab.jsx 26 -> 29 (famine "hunger-later" 23 towns: "grows about a third … Many households go short", and siege trade lists 4): the third leaves lane's food and trade writers (NAMED with their owner by the sixth seat), composed with the line's W2-A-LEAVES-2 F1 (04bab40c6, "the gap lines print again"). traditionCorpus a 3: the side seat's FAIR stop (FOR THE JOIN).
- ONE FRESH FALSE LINE IN A LANE FILE (class (4) of the 04:57 ruling, a cure; NOT YET MADE by this seat, see LEFT): r2r-town-37, Summary/Crisis: "Maisa ibn Battuta, the healer who identified the outbreak first, has gone quiet." Maisa is the dean of the town's Parish churches (2-5); no healer stands on the roster. The writer: src/domain/crisis/crisisHooks.js :: CRISIS_HOOK_SLOTS.plague_onset (l. 301), whose slot fills the plague's LEVER person into "the healer who identified the outbreak first" without reading the person's role; at the line 976db5b19 the town's plague cast has no npc lever, at this tip its lever is the dean (the lane's lever rule composed with the line's roster). The cure (method rule 3: a line that names a role reads the roster): the slot fills only a holder whose own role is a healer's, else the sentence keeps its own words; red first on r2r-town-37, a guard town with a healer lever.
- LIMITS: the dossier's page views only (no PDF, Foundry, Tonight, exports); it cannot see two lines disagreeing.

## Step 3: THE 720 FIELD DIFF (the census's own births; /home/user/b8/fdiff.mjs, every leaf, family = the record's top key)
- THE LINE 976db5b19 AGAINST THE TIP (the lane's share on the merged tree): 127 of 720 towns; THREE families, each one the lane declares: `stress` 442 leaves / 127 towns (cast.roles 296, summary 51, cast.levers 46, cast.stakes 37, cast.absent 12), `stressors` the same 442 / 127 (the alias), `npcs` 37 leaves / 37 towns (one whole temporary person each, ROUND THREE item 4). Nothing else moved (the receipt did not: STOP 1). Against the sixth seat's pre-merge 446 / 129 and 37 / 37: the line's own cast and summary changes compose in two towns.
- THE BASE e969a75b7 AGAINST THE TIP: 716 of 720 towns, 22 families: the line's own moves merged (npcs 99,773 leaves / 177 towns, economicState 46,822 / 637, simulationTrace 46,574 / 308, relationships 43,192 / 88, institutions 23,312 / 87, …): the lane's share is the line-to-tip diff above.

## Step 4: THE DRAFT SHIFT RECORD
- docs/chair/2026-11-13/R2-CODE-B-shift-record.DRAFT.json: all 51 registered surfaces (tests/fixtures/.golden-freeze-register.json) by measure; THE SIX: generator-golden-master MOVED (36 of 525 configurations; the pin seams' 3 rows and dmLayer A7's 36 read it), espionage-dormancy-fence MOVED (the 360-settlement hash 05f70cf9… -> 2e5ba810…), dossier-prose-manifest CARRIED (the line's red), pdf-golden, herald-knowledge-desk-golden, preset-lighting-witness UNMOVED (their suites green in the whole suite at 9e8d2af22; no src/ change since but a registry); the pins hookThemeDraws, rosterDuplicateDraws, x46NpcBand, editCorpusRatchet A7, institutionBudgetPromise; the STOP 1 caveat. Unsigned; no golden door run.

## Step 5: GATHERED BY SCRIPT from the parts' own paragraphs (/home/user/b8/sec.awk over the hand-back at 327035149; the commit bodies' new-word paragraphs of e969a75b7..c40da4ec6 by git show; nothing from memory). The statement's FOR THE JOIN, THE NEW WORDS and LEFT FOR AFTER THE JOIN are built from these.

### FOR THE JOIN, gathered (PARTS 2, 3, 5, 6, copied whole)

<!-- from the hand-back, l. 161 -->
#### FOR THE JOIN (the chair's ruling of 21:13 UTC: not touched here; cured when the lanes are joined, by calling this lane's leaf)
The leaf: `src/domain/display/institutionDisplayName.js :: institutionHouseLabel(nameOrInst)` (and `houseLabelsInText(text, settlement.institutions)` for a stored sentence). The test that reds on each once the leaf is present: `tests/components/houseLabelEverySurface.test.jsx` — strike its `DEFENCE_ALLOWANCE` row (town-under_siege-rand-1: Defense tab 1, each PDF variant 1) and it reds until the three call sites below read the leaf; over the 740, the scratchpad's held-house census (`mycensus.mjs`) pointed at the same surfaces gives 16 page / 12 + 12 PDF for "Gates (if walled)" and 3 + 3 for the healer note (deduced at d1c8612b1 from the 740 run at cf676399d; re-measure at the join).
1. `src/components/new/tabs/DefenseTab.jsx :: DefenseTab`, inner `ForceCard` (line ~342): `{i.name}` -> `{institutionHouseLabel(i)}` ("Gates (if walled)" -> "Town gates").
2. `src/pdf/sections/DefenseSecurity.jsx :: DefenseSecurity` (line ~188): `{force.name}` -> `{institutionHouseLabel(force.name)}`.
3. `src/domain/display/defenseDisplay.js :: deriveSupportingCapabilities` (line ~411, Medical Readiness): `` `${facts.healerName}. Wounds and fevers …` `` -> `` `${institutionHouseLabel(facts.healerName)}. Wounds and fevers …` `` ("Major monasteries (5-10). Wounds and fevers…", 3 metropolises in the 720). `facts.healerName` is `src/domain/defense/defenseFacts.js :: defenseFactsOf`'s roster name (a match: keep it raw there).
4. The Foundry journal's Defense page (`src/foundry/journalPages.js :: defensePage`) already reads the leaf for the force NAME (2af8bdfa9); its "(required)", "(faction_boost)", "(coherence_repair)" provenance tag after each force is class (b) machinery, left for the defence surfaces' holder.

**THE STORED STOCKPILE SENTENCE (Overview and History, one town: r2r-town-9, isolated).** True writer: `src/generators/economy/viability.js :: generateEconomicViability`, the trade-dependency branch (line ~515: `` `${critical.length} institution… operating on stockpiles only (isolated trade): ` + critical.map((d) => institutionDisplayName(d.institution)).join(', ') ``; the siege variant "critically impaired by siege" is the same expression). It is copied at birth into `history.currentTensions[]` by `src/generators/historyGenerator.js` (the "Priority-add: economic viability issues → resource_scarcity" block, line ~431). Cure at the writer: `institutionHouseLabel` in place of `institutionDisplayName` in that `.map` (RECORDS MOVE: `economicViability.issues[].description` and the copied tension, in isolated and besieged towns). This lane read it at display on the Outlook, the PDF and the journal (4b11e3910, d1c8612b1); the page's Overview (`OverviewTab.jsx`, upkeep lanes', pin X-37) and `HistoryTab.jsx` (another seat's) print it raw.


<!-- from the hand-back, l. 200 -->
#### FOR THE JOIN — the empty seat's keeper (the chair's ruling of 22:19 UTC, read AFTER 535e654d6 and f09e55042 were pushed)
This seat's two commits do NOT build a styled name of their own: they read the existing leaf on this tree, `src/domain/people/seatKeeper.js :: keeperFormOf` / `seatKeeperOf` (the powers lane's file, read, not changed), and print the keeper's form in place of the bare office:
- `src/domain/summary/tonightSheet.js :: peopleOf`, the person's `role` (was `clean(npc.role || npc.title)`; now `roleOf(npc)`, the keeper's form for the keeper of an empty seat) — #pf-84, #pf-720.
- `src/components/new/npcComponents.jsx :: NPCRelCard2`, the role line `{npc1Role} · {strength} · {npc2Role}` (now `roleShown(rel.from|rel.to, …)`) — #pf-717, #pf-718.
AT THE JOIN, where the ruled one home is `seatKeeper.js :: seatKeeperStyledNameOf(settlement)` (powers lane 96a6ced46, fb4561b03): the join seat replaces `keeperFormOf(source)` in those two expressions by the leaf's styled form (or reverts the two commits if the leaf prints the name with the form, since both rows already print the name beside the role). The test that reds on the four towns: render rpf-metropolis-succession_void-13 and rpf-village-succession_void+famine-13 (app shape) and assert the Tonight person and the relationship role line never print the bare "First Magnate" / "Headman" for the keeper (read here at f09e55042: "Acting First Magnate", "Acting Headman"). Not written by this seat (context limit).

---


<!-- from the hand-back, l. 241 -->
#### FOR THE JOIN (this seat)
- THE WARTIME SUMMARY'S ONE PATH: the cure is in stressNarrative.js :: RENDERERS.wartime, which `assembleSettlement.js :: rerenderStressSummary` calls through renderStressSummary on this tree AND on the data lane (lane/w2-fix-data-2026-11-13, read): no second path was built; at the join the data lane's door renders the cured text. Named, not cured (not ruled): the loss text's "Supply caravans pass through on crown requisition" prints in the 4 isolated wartime towns of the 800 (r2s-wartime-thorp-1 and -hamlet-3 among them); RECOMMENDATION: a declared twin of that sentence excluding `route: isolated`, the crisis lane's or the seat after the merges.
- ServicesTab.jsx's `impactCovers` (the X-50 plan's `covers` list) is read by nothing once this lane's ServiceItem is in: it goes at the join (the tabs lane's file).
- The food label's one home is `src/domain/summary/tonightSheet.js :: foodBandOf(foodRecord)`. Two surfaces still print the generator's label raw and disagree with the sheet in the 160 "Pressured" towns: the Overview's Food Security (OverviewTab.jsx, `eco.foodSecurity.label`, the upkeep lanes') and the Quick Guide's food line (settlementQuickGuide.js :: the `economy.foodSecurity?.label` read, the side seat's). Each takes `foodBandOf(eco.foodSecurity.foodRecord)?.label`.
- The Defence tab's endurance line says "about three months at full rations" where the record holds 1.5 months (rpf-thorp-under_siege-13): defenseDisplay.js's own arithmetic (the first seat's #883), the defence lanes'.


<!-- from the hand-back, l. 356 -->
#### FOR THE JOIN (this seat)
- THE WARTIME SUMMARY'S ONE PATH: the cure is in stressNarrative.js :: RENDERERS.wartime, which `assembleSettlement.js :: rerenderStressSummary` calls through renderStressSummary on this tree AND on the data lane (lane/w2-fix-data-2026-11-13, read): no second path was built; at the join the data lane's door renders the cured text. Named, not cured (not ruled): the loss text's "Supply caravans pass through on crown requisition" prints in the 4 isolated wartime towns of the 800 (r2s-wartime-thorp-1 and -hamlet-3 among them); RECOMMENDATION: a declared twin of that sentence excluding `route: isolated`, the crisis lane's or the seat after the merges.
- THE STORES' SPAN HAS TWO HOMES that disagree on one figure: this lane's `tonightSheet.js :: storesSpanWords` ("about N days" to ten days, "about N weeks", months to the half below three: "about a month and a half") and the defence lane's `defenseDisplay.js :: monthsInWords` on lane/coherence-upkeep-2026-11-12 ("a day or two", "a few days", "a week or two", "a few weeks" to 31 days, "about a month" to six weeks, then the nearest whole month: 1.5 months reads "about two months", the words item 2a ruled false). RECOMMENDATION: ONE HOME at the join: the endurance line's span reads `storesSpanWords` (its own comment already names that switch as owed); the join seat measures both on the 720 first. On this lane's tree the Defence tab's older monthsInWords prints "a few weeks" in 36 towns (the defence lane's file; cured on its lane).


<!-- from the hand-back, l. 420 -->
#### FOR THE JOIN (this seat, kept current)
- THE QUICK GUIDE'S COMPOSER PRINTS NOWHERE ON THIS TREE (the chair's ruling of 03:02, as found): no file under src/ or supabase/functions calls `composeSettlementQuickGuide` (its identity sentence, its three truths with row 1d's food word, its pressure, people and entry point); only tests read it. What does print the quick guide's lines: `src/components/new/overviewIdentity.js` imports `cultureScopeLine` (the culture scope line: the side seat's item 5) and `governsLine` (who governs), the Overview's identity strip. The composer's header still names Summary, Table View, Session Mode and the PDF; none of them calls it here.


### FOR THE JOIN, added by PART 7's next step and the brief (named, not touched)
- This lane's lines in src/components/new/tabs/EconomicsTab.jsx (l. 169, chainFlowFacts(chain, instNames, shown), the seventh seat) and src/components/new/EconomicsTrade.jsx (the PROC row's chainHousesOf), which the third leaves lane also changes.
- The tests' git helper that must clear the inherited git environment (tests/scripts/implementationPackets.test.js, implementationSession.test.js run git against the real repository from a linked worktree inside the pre-push hook: the chair's hazard of 04:37).
- (this seat) EconomicsTab.jsx's food and trade b-lines and the a 'ships bring in' line (CENSUS-2 at the tip, 29 and 6 towns): the third leaves lane's writers, named with their owner.

### THE NEW WORDS, gathered (the parts' sections, copied whole)

<!-- from the hand-back, l. 92 -->
#### New words (for the owner's veto)
- Items 1a/1b remove words; the house label is the existing label minus its bracket.
- Item 3: the stores span "less than a day", "about a day", "about N days", "about N weeks".
- Item 4a: "No neighbours or ties between people are recorded for this settlement." (the old line less its last claim).
- Item 4c: "the defence of the place, with no one named to lead it"; "a member of the merchants' power, with the seat itself in dispute".
- Item 5: "run by patronage and law" standing alone; "built on tribute and the ritual calendar"; "built on tribute, market and waterworks"; "built around kin and an assembly ground"; "kin by kin"; "built around courtyards".
- Item 6a: "{name} has gone short of food for a second season."
- Item 6b: "…, and no god is named here." 

---


<!-- from the hand-back, l. 195 -->
#### New words (this seat, for the owner's veto)
- (c): "the only one in the house the crisis hits" (thorp-calm-rand-1, thorp-famine-rand-1); "one of the house the crisis hits" (village-famine-rand-1).
- (a): "Inns" for "Inn (multiple)" (town-calm-rand-1, town-indebted-port-1, town-plague_onset-rand-1, town-under_siege-rand-1). Otherwise words removed only.
- (b): the roster's help pill loses "history," ("The badge says who put it here: you, the living world, or a dependency.").


<!-- from the hand-back, l. 247 -->
#### New words (this seat, for the owner's veto)
- Item 2a: "about a month and a half" (rpf-thorp-occupied-13, rpf-thorp-succession_void-13, rpf-thorp-under_siege-13), "about two and a half months" (2.25–2.75 months), and "about" before every span of a month and more ("about two months", rww-village-indebted-1; "about nine months", r2r-city-7; "about 13 months", r2s-famine-metropolis-2).
- Item 2b: none (the band ladder's own "Pressured" and "Deficit"); the Daily Life tile's own words "Severe/Serious/Strained/Tightening/Adequate" print only for a record with no band.
- Item 1 and the added HIGH: none.


### THE NEW WORDS in the lane's commit bodies (each commit whose body names new words, with the towns its body says the words were read in; an entry saying 'no new word' is kept as said)
- fc7514261 fix(R2-CODE-B-6 row 1d): the quick guide's food word reads its one home, tonightSheet.js :: foodBandOf
  - words: are unchanged. No new word. 

- e06c1a429 fix(R2-CODE-B-5, the chair's second added row): the wartime profit summary names merchants only where a market or a merchant house
  - words: the pick resolves as before to the loss text: no line added, the coin's draw unchanged, no new word. 

- 77ed210af fix(R2-CODE-B-4, ROUND THREE item 4): the crisis cast reads the empty seat, the roster and the road; a hook names a house in prose


- 8b27458cd fix(R2-CODE-B-SIDE item 7): no walk to the next village's church under a siege that bars the road
  - words: church." (new wording, for the owner's veto; read in r2s-under_siege-thorp-0..3, r2s-under_siege-hamlet-0/1, r2r-thorp-58 and r2r-hamlet-0). The first seat's item 6b (ffe89ab39) REACHES rww-thorp-famine-1: at 0570b3441 that thorp prints no walk (its only "Access to" row is the mill's); pinned in the same file. 

- 87c541620 fix(R2-CODE-B-3 item 3): a hidden allegiance names a handler only of the house the person answers to; the card's badge and a confl


- d94638185 fix(R2-CODE-B-3 item 2b): the food label reads one home on the Tonight sheet and the Daily Life tile, and a label of plenty never 
  - words: band. The ladder's own words only: no new word. 

- 66a4f587c fix(R2-CODE-B-SIDE item 5): the scope line reads the roster and the size in every frame


- f719dbb38 fix(R2-CODE-B-3 item 2a): the stores' span in words contains its figure — "about a month and a half", never "two months" for 1.5


- 305210087 fix(R2-CODE-B-SIDE item 4): the seat's list is headed by what it lists, not "The Powers (N)" twice


- e878a1367 fix(R2-CODE-B-3, the chair's added HIGH): a Services row's need and the sentence after it print apart — never "Needs TimberSuppl


- 48ddf7685 fix(R2-CODE-B-3 item 1): the Tonight sheet voices a cast person with the card's own goal, and a role's line only where the card ha


- 5ea26f677 fix(R2-CODE-B round 3, the chair's ruling (e)): a chain run only through an "Access to …" row names that row, not a house the to


- 57395ee18 fix(R2-CODE-B round 3, increment): the Faith tab never calls a contender "the real political weight" where another power governs
  - words: function already holds, "A voice in {place}’s affairs belongs to the {power}." (no new words). A governing religious power and one where no power governs read as before. The reading is composed at read: no record moves (the 22 increment towns' records byte-equal before and after). 
  - read in: Measured first and read where it prints (record 386; app shape): six towns lose the false line, every one with another power governing: rww-town-under_siege-1 (a siege; Corrupt Council governs), rww-village- under_siege-1 (a siege; Feudal Stewardship governs at 39, the Religious Authorities 31), rpf-village-succession_void+famine-13 (a famine), rww-village-calm-1 (Headman's Authority governs at 52, the Religious Authorities 37), rpf-town-succession_void-13, rpf-village-succession_void-13. In each the Faith tab now reads "A voice in the town’s / village’s affairs belongs to the Religious Authorities.": true, a contending power with a say. Smallest tier it reaches here: village; largest: t

- f09e55042 fix(R2-CODE-B round 3, increment): a relationship card styles an empty seat's keeper as the Power tab does

  - read in: Measured first and read where it prints (record 386; app shape, the reader's rpf towns): rpf-metropolis-succession_void-13 (largest): "Acting First Magnate · substantial · the postmaster", "the lord · minor · Acting First Magnate"; rpf-village-succession_void+famine-13 (famine): "Acting Headman · minor · the midwife"; rpf-village-succession_void-13: "the lord · minor · Acting Elder"; rpf-thorp-succession_void-13 (smallest): "Acting Elder · substantial · the outlaw host". Each is the Power tab's own keeper, whose seat stands empty. A held seat's tie is unchanged. New words: none. 

- 535e654d6 fix(R2-CODE-B round 3, increment): the Tonight sheet styles an empty seat's keeper as the Power tab does ("Acting Headman")

  - read in: Measured first and read where it prints (record 386: three towns, a famine among them, the smallest and largest tier it reaches; the reader's own render shape, rpf seeds born in the app's shape): - rpf-metropolis-succession_void-13 (the largest): the Tonight person "First Magnate" -> "Acting First   Magnate" (Li Song, first of the Grand Merchant Oligarchy, whose seat the Power tab says "Stands empty …   Acting First Magnate Li Song … keeps the seat meanwhile"). True. - rpf-village-succession_void+famine-13 (a famine): "Headman" -> "Acting Headman" (Achilles Bryennios,   the miller; the Power tab: "Acting Headman Achilles Bryennios, the miller, keeps the seat meanwhile"). - rpf-thorp-succ

- 99432257c fix(R2-CODE-B round 3, ruling (d)): a chain card names no ground the record says is absent (#804), page and PDF
  - words: entrepôt line), unchanged; no new words. 

- 24ab15c9b fix(R2-CODE-B round 3, ruling (c)): the crisis cast's "the one with the least say" only in a house of more than one, and never bes


- ffe89ab39 fix(R2-CODE-B item 6b): the faith line walks to a parish church only where the record gives that access


- 111e8b152 fix(R2-CODE-B item 6a): the famine and wartime summaries say no harvest where no grain grows, and no profit where the town is poor
  - words: not have (no new word in the vocabulary file). 

- 922fe5141 fix(R2-CODE-B item 5): the culture scope line speaks at the place's size


- 742ff4e43 fix(R2-CODE-B item 4d): a Market tradition prints only where a market stands
  - words: new word in the vocabulary. The tab's filter (kind A: a filter over the list, no weight and no roll moves) leaves the row out where no market stands; a DM's authored tradition is printed as authored, as before. genesis.js reads no declaration: NO RECORD MOVES (births field diff over the 740, before against after this commit: 0 of 740 differ). NAMED, NOT MADE: the PDF's Traditions chapter (src/pdf/sections/Traditions.jsx) prints the `settlement.traditions` mirror unfiltered, for the water elements as for this one; it is lit only in the deep presets. The switch: the same filterDeclared over ELEMENT_NEEDS. 

- 90bafc4d1 fix(R2-CODE-B item 4c): the crisis cast reads the defence home the Tonight sheet reads, and says "a merchant" only of a trader


- 49a6ad244 fix(R2-CODE-B item 4a): the empty Relationships line never denies a conflict the record holds


- aaf314475 fix(R2-CODE-B item 3): the span of the stores in words has one home, true at days, weeks and months



### LEFT, gathered (the parts' stops and rows not reached, copied whole: the statement marks each row done, ruled or LEFT FOR AFTER THE JOIN)

<!-- from the hand-back, l. 42 -->
#### Stops and parked items (with recommendation)
- **#939** — "11 institutions critically impaired by siege: …, Taverns (5-20), …": written by `viability.js :: issues` (`critical.map(d => institutionDisplayName(d.institution))`). The switch: read `institutionHouseLabel` (or `houseInProse` in a sentence). Recommend: the lane that next holds viability.js takes it.

- **#883** — the Defence tab's food endurance ("carries the town for a few weeks at full rations, a few weeks on half" at three days of stores): `defenseDisplay.js :: monthsInWords` (the third leaves seat's file). The switch: for a span under a month, read `tonightSheet.js :: storesSpanWords` (the one home, item 3).


<!-- from the hand-back, l. 170 -->
#### Rows NOT reached by this seat (for a successor, line by line)
- The increment's MED rows in this lane's files (ROUND-3-CUT-INCREMENT.json at fe6d5b741, class NEW, `at.line` set), not begun: tonightSheet.js — #pf "Wants to hold the line through the war with fewer hands…" (rpf-metropolis-wartime-13, CAST_WANTS vs the person's own goal), "Wants to keep the pressure on until the seat gives way…" (rpf-city-succession_void+politically_fractured-13), "Wants to use this crisis to take the seat…" (rpf-village-politically_fractured-13): CAST_WANTS printed over the card's own goal; "No granary; two months in household stores" where storageMonths is 1.5 (rpf-thorp-under_siege-13, rpf-thorp-succession_void-13, rpf-thorp-occupied-13: `foodStoresWords` rounds 1.5 up; the stores-span home, item 3) and "Food Secure" beside a deficit. npcComponents.jsx — "Merchant guilds (3-8) · Burgomaster, first of Merchant Council · first of Merchant Guilds" (rpf-town-occupied-13: the range is cured by (a); the seat-holder-also-contender clause is not), "Madam" / "Goodwife" honorifics for male cards (rpf-city-occupied-13, rpf-village-succession_void+famine-13; the honorific table is data/faceHonorifics.js, not this lane's), "Mill · second of The Highborn Circle" (rpf-village-succession_void-13: a card with no house given a house door). crisisCast.js — "already carries more weight than whoever holds the seat" where no one holds the seat (rpf-town-succession_void-13, rpf-village-succession_void-13; CAST_REASONS.instigatorRival: needs `isSeatVacant`). WhoRunsThisTownPanel.jsx — "handled by … (Multiple criminal factions)" under another house's boss (rpf-metropolis-politically_fractured-13: the label is cured by (a) to "Rival gangs"; the handler-under-the-wrong-guild is patronage.js, the powers lane's) and "Housing (75-650 households)" (cured by (a)). traditionCorpus.js — "The Long Forge Fair" with no forge (rww-hamlet-calm-1), "The Lesser Landfall Fair" where no fair stands (rww-thorp-under_siege-1): item 4d's market disqualifier extended to forges and fairs. faithReading.js — "walk to the next village’s parish church" with no access row (rww-thorp-famine-1; item 6b's cure, check it reaches this town) and under a siege that bars the road (rww-thorp-under_siege-1). settlementQuickGuide.js — "built in wards and courtyards, ordered by bureaux" in a hamlet of 31 (rww-hamlet-succession_void-1; item 5's size rule, a frame it did not cover) and CENSUS-2's QUICK_GUIDE_SIBLINGS (38 small places). RelationshipsTab.jsx — "No neighbours, ties between people or conflicts are recorded" (rpf-thorp-calm-13; item 4a's cure, check it reaches this town). NPCsTab.jsx — "1 high influence ·" dangling separator (rpf-hamlet-succession_void-13).
- The cut's own MED rows in this lane's files not of classes (a)-(c): DailyLifeTab food tile "Strained"/"Tightening" against the food record (#843 #1102 #1297); PowerStrata "The Powers (3)" against the 5 or 6 the record holds (#562 #712 #806) and "RulerElder Council…Strong" (#85); WhoRuns "answers to Black market through …" a whisper broker (#944 #946 #1077: patronage.js, the powers lane's); viability.js's slider lines ("Military slider is high…", "Raise Economy priority…", #576 #823 #824 #825: machinery, a stored sentence, records move); crisisCast STAKE_REASONS "Grain Holders gains · holds what the crisis makes scarce" (#864); the quick guide's scope phrases #1 #234 #513; npcComponents #389 (ungrammatical conflict issue), #510, #967 #968 (hidden allegiance through the other market's broker), #978 #979 #1097.
- #1049 ("Needs Grain · affects: meals, ale, lodging" on Economics): the chair names it "your Economics line of record 371"; record 371's text is not in the chair's records this seat could reach (docs/chair on lane/chair-2026-11-08). PARKED: needs record 371's ruling and EconomicsTab.jsx beyond its "Via:" line.


<!-- from the hand-back, l. 268 -->
#### Rows NOT reached by this seat (line by line)
1. Item 4: class the five reds above, then commit the patch (one commit), gates, push.
2. Item 5: RelationshipsTab.jsx "No neighbours, ties between people or conflicts are recorded" on rpf-thorp-calm-13 (check item 4a's cure reaches it: base dump); NPCsTab.jsx "1 high influence ·" dangling separator (rpf-hamlet-succession_void-13).
3. Item 6: the second seat's FOR THE JOIN note (0570b3441) read; nothing to add.
4. The page re-count of items 3–5 on the 800 (one tip render: CENSUS-2's census2.sh --count-only on a frozen tip worktree).
5. The lighting census re-freeze through its own door at a clean tip (LIGHTING_CENSUS_REFREEZE; the estate's file count 3239 -> 3242 by this seat's new test files: tonightOwnGoal, storesSpanFigure, npcCardAllegianceHandler, + crisisCastSeatAndAccess with item 4); the sovereignty walker reds until then.
6. Item 7: CENSUS-2 at the final tip and at 62e30c7e7 (--files the lane's files; read the counter's own exit and counts.txt).
7. Item 8 (on the chair's word only): merge the side branch; THE ONE FINAL STATEMENT as part 2's EXACT NEXT STEP item 2 gives it.


<!-- from the hand-back, l. 277 -->
#### Stops and parked items (with recommendation)
- #693 and inc #14 (and the craft-in-noble-power rows): PARK to the powers lane (memberships / the Power tab's contender label).
- #389's words, #979, #510's goal fill: name to their writers' lanes (above).
- The Overview and Quick Guide food labels: FOR THE JOIN (above).



<!-- from the hand-back, l. 316 -->
#### Rows NOT reached (line by line; kept current)
1. Item 5 (RelationshipsTab, NPCsTab), the chair's added row (WhoRunsThisTownPanel + its PDF twin), the trait chips.
2. The page re-count (`--count-only`) of items 3-5 and this seat's.
3. The lighting census re-freeze (own commit).
4. CENSUS-2 at the tip and at 62e30c7e7 over the lane's files.
5. The message to the chair; then, on the chair's word, the merge, the quick guide's food line, THE FINAL STATEMENT.



<!-- from the hand-back, l. 383 -->
#### Rows NOT reached (line by line; kept current)
1. STEP 2, what is left: (a) the raw-colour budget (tests/lint/rawColorLiteral.test.js, BUDGET; the side seat banked 1224 -> 1221 on its branch): run it on the merged tip; if it reds, re-bank through its door (the BUDGET constant, its comment naming e6f006eff and this merge) in its own commit. (b) the phone chrome floor routes (tests/components/phoneChromeFloor.census.test.js ROUTE_BASELINE; the side floored /create /settlements /compendium /gallery by -2, 4b80f7cea): run it on the merged tip; re-floor only through its own measure, own commit. (c) the dossier phone floors: done in the merge (above) — re-run tests/components/dossierPhoneFloorAllViews.test.jsx at the tip to confirm it still reads 2/2. (d) THE QUICK GUIDE'S FOOD LINE: src/domain/summary/settlementQuickGuide.js, the `economy.foodSecurity?.label` read, takes `foodBandOf(economy.foodSecurity?.foodRecord)?.label` (import from ./tonightSheet.js), so it agrees with the Tonight sheet and the Daily Life tile in the 160 "Pressured" towns: measure first on the 800 (the quick guide's food word against foodBandOf, per town), red first (a test of the label in a Secure band with a gap), the governing tests of settlementQuickGuide.js, the three gates; display only, the 720 field diff 0. (e) then ONE message to the chair: the tip, the merge's conflicts, and that the wartime summary built no second path (the data lane's rerenderStressSummary calls the cured renderer).
2. STEP 3: CENSUS-2 once on the merged tree over both seats' files at the lane's base (e969a75b7, the line's base; the third seat used 0570b3441 and 62e30c7e7) and at the tip: `sh <c2>/docs/chair/2026-11-13/probes/CENSUS-2/census2.sh <tree> <out-dir outside the repo> 4 --files <both seats' files, comma-separated>` (about 12 minutes each; its own exit and counts.txt read); every hit in the lane's files read, cured or named; the count per kind. THE 720 FIELD DIFF, base against tip, by family: births by CENSUS-2's births.mjs in both trees, a leaf diff (this seat's /home/user/m/fd.mjs: load both corpora, compare every leaf path, count towns and paths by top-level key); expected families: the least-say reasons (49 towns), item 4 (94 towns: stress/stressors cast, npcs 47), the wartime summary (1 town), nothing else.
3. STEP 4: one message to the chair and WAIT FOR POINT 49; on the chair's word the merge of the line's tip, the instrument's page census on this lane's lines, THE ONE FINAL STATEMENT (the whole suite once in six vitest shards, `npx vitest run --shard=<i>/6 --maxWorkers=2`, each to its own file outside the tree; every red classed against the lane's base; ONE draft shift record; the edge bundles last, alone). The side seat's stops (the fair's act, the PDF's Traditions chapter, items 1 and 2 at the join) NAMED under FOR THE JOIN, not built.


<!-- from the hand-back, l. 417 -->
#### Stops and parked items (with recommendation)
- (cured: the price line's twin "the road" in two isolated thorps, item 0b, on the chair's ruling of 03:02.)


<!-- from the hand-back, l. 450 -->
#### Rows NOT reached (line by line; kept current)
1. (done: row 1 (a)-(d); the message to the chair with the tip follows this push.)
2. (done: row 2, above.)
3. Row 3, THE WORD GIVEN (03:08) — THE EXACT NEXT STEP for the successor, in this order: (i) deepen as above if the clone is shallow, check the base is e969a75b7; (ii) in a scratch worktree at the lane's tip, `git merge origin/lane/integration-2026-11-07` (read the tip back first; 976db5b19 at 03:40); resolve the three PDF sections by hand AT THE CAUSE (read each whole: the side seat's items 1-3 removed the upstream note, the "Import: <chain label>" From line and the template house list from SupplyChainFlow.jsx and Services.jsx; keep the line's point 47/48 changes and this lane's removals), take each of the six registers from ONE side; commit the merge naming the commit and what conflicted; (iii) run 2m's checks, then re-derive each register through its door (wiring census, writer reach, lighting census, tuning inventory, dossier phone floors, institutionBudgetPromise's pin), each its own commit; (iv) the page census on this lane's lines (2m's door, the 720); (v) THE ONE FINAL STATEMENT: merge lane/integration-2026-11-07 at its tip as read back (976db5b19 at 03:08; plain; say what conflicted); read section 2m of the merge book first; the instrument's page census on this lane's lines; THE ONE FINAL STATEMENT in the brief's form (the whole suite once in six shards, every red classed against the lane's base; ONE draft shift record; FOR THE JOIN; the edge bundles last, alone).

## HAND BACK (2026-11-14 ~07:50 UTC, by file, by judgement before the count's mark: the seat's own count read by get_session at 07:41 was 299,441 tokens; the chair's ruled cure at the mint, its 720 measure and read-where-it-prints, the plague slot's cure and the re-measures after both do not fit in what is left; a half-made generator cure cannot be pushed). Nothing running; everything pushed.
DONE (this seat, each pushed): step 1 (e990583dc, 3c59ceaab); step 2 classed, class (b) cured (490afeae6, ab12a9983, ad254be9d, b8b0f2971), STOP 1 named and RULED (07:32, above); step 3 CENSUS-2 at the tip read and the 720 field diff (46f64aba2); step 4 the draft shift record (46f64aba2); step 5 gathered (this commit).
WHAT IS LEFT, in this order (the successor's list):
1. STOP 1's CURE AT THE MINT, as the chair ruled at 07:32 (copied above). Where: src/generators/steps/resolveCrisisCast.js, mintTemporary (l. 76-86) pushes `{ id, name, gender, role, category: 'civic', power: 1, influence: 'low', memberships: [], temporary, temporaryKind, crisisIds }` with NO `importance`; the roster's own rule is src/domain/entities/npcs.js :: inferImportance (l. 144); read recordInvariants' and recordRegisterTotality's per-entry groups (src/domain/edit/recordInvariants.js :: rosterCited l. 301, V-EVIDENCE-ROSTER l. 360; the record class register's `card-standing` group) for every other field a born person carries. The receipt's graph evidence is written in src/generators/steps/assembleSettlement.js, BEFORE the cast step appends the person: keep the receipt TRUE (mint before it counts, or count after), never edit a count. Red first: the six (tests/generators/densityLaw.test.js hamlet; tests/lint/recordRegisterTotality.walker.test.js A6; tests/domain/recordInvariants.test.js EM-R0b A1; tests/domain/recordMerge.test.js A1; tests/property/editCorpusRatchet.test.js A1, A8). Measure on the 720 (the census's births; /home/user/b8/fdiff.mjs, re-made below): towns that mint (37 of 720 at fd9c09f42), the field diff confined to `npcs` and the receipt; read the minted person where it prints in three towns, a crisis among them. A density cap exceeded BY DESIGN: STOP with both sides. Then the goldens and pins of class (a) move again: re-measure the shift record's rows.
2. THE PLAGUE SLOT (CENSUS-2 at the tip, class (4), a false line in a lane file; step 3 above): src/domain/crisis/crisisHooks.js :: CRISIS_HOOK_SLOTS.plague_onset (l. 301) fills the plague's lever person into "the healer who identified the outbreak first" without reading the role: r2r-town-37 prints "Maisa ibn Battuta, the healer who identified the outbreak first, has gone quiet." (the dean of the Parish churches; no healer on the roster). Cure: the slot fills only a holder whose own role is a healer's (slotCrisisHook is handed the cast only: read the person's role from the cast row or hand it the roster), else the sentence keeps its own words; red first on r2r-town-37, a guard town whose lever IS a healer; the method's three towns.
3. AFTER 1 AND 2: CENSUS-2 at the new tip and the 720 field diff again (the line 976db5b19 against the tip: families stress, stressors, npcs, and the receipt by STOP 1's ruling); the draft shift record re-measured (docs/chair/2026-11-13/R2-CODE-B-shift-record.DRAFT.json); the governing shards of the touched files' tests only (the brief: the whole suite is the joined tree's).
4. THE STATEMENT'S FOR THE DECLARATION PASS rows worded as the chair re-ruled at 06:40 (the brief's (iii)): for each of the fifteen quick-guide hits in src/domain/summary/settlementQuickGuide.js (SCOPE_PHRASE l. 734-745; scopeAtSize l. 341-365; scopeAgainstRoster l. 405-420; QUICK_GUIDE_SIBLINGS l. 952 on) say (a) a replace()'s FIRST argument (a matcher of text the frame holds) or SECOND (text a page prints); (b) whether the frame's member already declares the atom (`market` mesoamerican and south-asian, `institution: temple` south-asian, `navigable` Greek, the harbour's gate scopePhrase's water branch with `water === 'maritime'`): a SHAPE ROW; (c) else the code condition and the atom (`streets`, `quarters`: TINY_TIERS; the faith reading's three: no named god / the siege in force and no church). The fact-layers reader's row as ruled (both contents in PART 7). NOT DONE by this seat.
5. THE EDGE BUNDLES LAST: `npm run build:edge-shared`, committed alone if they differ; then tests/edgeFunctions/aiGroundingBundle.freshness.test.js and edgeSharedBundleReproducibility.test.js re-run (class (c)).
6. `node scripts/implementation-packets.mjs validate` at the final tip, its exit; THE ONE FINAL STATEMENT in the brief's form (base e969a75b7; a fresh reader reads from 80b960171), built from PARTS 6-8 and step 5's gathering above; one message to the chair.

## Instruments (outside the tree; lost with the container)
- /home/user/wt-b8 (working worktree, branch b8-work); frozen trees /home/user/wt-base (e969a75b7) and /home/user/wt-line (976db5b19), node_modules symlinked from wt-b8; /home/user/b8: dfr.mjs (the defence walker's count per line at any rev), owners.sh + others.txt (the other current lanes, dated 11-12..11-14, that changed a file beyond the line), fails.mjs (a vitest JSON report's reds with messages), red27.txt/json (the 24 red files re-run), seedloop.py, c2/ (CENSUS-2 at 2686272b1), c2tip/ (the tip's census: counts.txt, hits.json, corpus.ndjson.gz), births-base/ and births-line/ (births.mjs only), fdiff.mjs (the field diff of two corpora by family), sec.awk + join/words/left.md (step 5's extraction).
- RE-MADE: the census as the brief's form; births only: `TREE=<tree> OUT=<dir> SEEDS=<c2>/…/seeds.txt node <c2>/…/births.mjs` with node_modules linked into OUT; fdiff.mjs walks every leaf of two corpus.ndjson.gz files keyed by seed and counts leaves and towns per top-level key (about thirty lines; its counting is described in step 3).

# PART 9 — R2-CODE-B-9, the ninth seat (the person minted whole; the plague slot; the re-measures; the final statement)

**Seat:** R2-CODE-B-9 (session_01ACmDYYVFQGSVcyPRiiveGr); **the chair:** session_01ACmDYZrFEVXyZEUg1NDxxC. **Brief:** docs/chair/2026-11-14/briefs/BRIEF-R2-CODE-B-9.md on lane/chair-2026-11-08. **Tip read back at start:** 30ed925ee (as the brief); the line 976db5b19 (unchanged).

## Items (this seat; each pushed)
| item | commit | measured |
|---|---|---|
| 1: the temporary person minted whole (the chair's 07:32 ruling) | ef0b6208d | mintTemporary stamps `importance: 'minor'` and `structuralRank: 'unaffiliated'` (the roster's own rules for a face of no power: castPowers.js, membership.js :: structuralStandingOf; 1,982 of 1,982 born no-membership cards carry exactly these on the 720); where a person is minted, the coherence receipt is written again by its own writer over the final roster (no count edited). THE SIX REDS GREEN. 720: 57 towns mint (the line's 20 + the lane's 37; 26 thorps, 26 hamlets, 5 villages), the density cap holds in all; tip→cure 57 towns, npcs 114 leaves (importance 57, structuralRank 57) + generationCoherenceReceipt 57 (the finalGraph count only); line→cure stress 442/127, stressors 442/127, npcs 77/57, receipt 57/57. Four towns read in every dossier view and the Tonight sheet: byte-identical. |
| 2: the plague slot reads its holder's role | 9a12e5411 | CRISIS_HOOK_SLOTS gains `holds` (the holder's own roster role the fill names); slotCrisisHook reads the record's npcs. Of the five slots only the plague's fill names a role: 26 towns fill, 8 of a holder with another role (the dean 4, the priest 4), now the catalog's own words; 18 healers named still. Records 0 of 720 changed (a reader). Red first r2r-town-37; guards r2s-plague_onset-thorp-0 (Healer), r2r-city-19 (apothecary). resolveCrisisCast.test.js's DM-edit pin (which asserted the false line) re-keyed by identity. |
| register: the lighting census | d3d94961d | its ritual on the committed 9a12e5411: titles 29532 -> 29536, suiteTitles 8015 -> 8016 |

## FOR THE JOIN (this seat)
- tests/generators/resolveCrisisCast.test.js is held by W2-FIX-DATA (w2-fix-data-2026-11-13, W2-FIX-DATA-7; on join-2026-11-14) too: it re-keyed the two plague tests' seed to slot-plague_onset-1 (its cure: the plague sentence's healer declared `needs: healer` at the source, stressTypes.js :: STRESS_TYPE_SIBLINGS). This lane's 9a12e5411 leaves that line untouched; its arms hold at either seed. The two cures are of two faults and compose.
- src/domain/crisis/crisisHooks.js is held by COHERENCE-UPKEEP (and its copies) in a disjoint hunk (CRISIS_NOUN to crisisNoun.js, l. 52-69).

## Item 3, PART DONE (measured at 5764b04c4; its src is 9a12e5411's)
- CENSUS-2 at the tip (2686272b1; `census2.sh <wt> <scratch>/c2tip 4 --files <the lane's 39 src files: git diff --name-only 976db5b19 HEAD -- src>`; its own exit 0; births+render 738 s, count+trace 149 s). Kinds (towns · distinct lines), the eighth seat's tip fd9c09f42 -> THIS TIP: a 678·524 -> 678·523; b 70·101 -> 70·101; c 276·155 -> 276·155; d 350·15 -> 350·15; e 60·20 -> 60·20; f 309·53 -> 309·53; g 720·14 -> 720·14; h 2·2 -> 2·2. The one line gone: the plague slot's (crisisHooks.js a 1 -> 0, row gone).
- THE LANE'S FILES with hits (towns): EconomicsTab.jsx g 720, a 6, b 29, f 213; InstitutionsTab.jsx f 303; PowerStrata.jsx f 298; WhoRunsThisTownPanel.jsx f 13; institutionDisplayName.js f 7; traditionCorpus.js a 3; settlementQuickGuide.js a 3 (r2s-indebted-village-3 docks, scopeAgainstRecord l. 294; r2s-insurgency-town-1 waterworks and r2s-mass_migration-hamlet-1 docks, scopeAtSize l. 354/357: the scope lines item 4 rows; "on the coast" / the plaza printed true by their code conditions). These three print BYTE-IDENTICAL at 30ed925ee (re-rendered there, the same harbour/plaza lines): not a rise of this seat's. PART 8 read "a 2 -> 0" for this file at fd9c09f42 (the same src): the two counts disagree; the successor reads the hits at the base by the same command before ruling.
- THE PLAGUE SENTENCE'S OWN WORDS now hit in 3 towns (a, "healer" with no healer on the roster: r2r-thorp-41, r2r-town-37, r2s-plague_onset-hamlet-3), traced to src/data/stressTypes.js l. 103 (STRESS_TYPE_MAP.plague_onset.crisisHook): NOT a lane file; it is W2-FIX-DATA-7's cure at the source (FOR THE JOIN above: the slot-less twin where no healer stands).
- THE 720 FIELD DIFF, the line 976db5b19 against the tip: 136 of 720 towns; FOUR families, each declared: stress 442 / 127 and stressors 442 / 127 (the lane's cast, as PART 8), npcs 77 / 57 (the 37 whole persons and the line's 20 made whole, item 1), generationCoherenceReceipt 57 / 57 (the finalGraph count, item 1). 9a12e5411 moved no record (0 of 720).

## HAND BACK (2026-11-14 ~09:35 UTC, by judgement before the count's mark: the seat's own count by get_session at 09:07 was 334,088; the census and the field diff above took the margin). Nothing running; everything pushed.
WHAT IS LEFT, in order (the successor's list):
1. Item 3's rest: the draft shift record's rows re-measured (docs/chair/2026-11-13/R2-CODE-B-shift-record.DRAFT.json; the goldens and pins of class (a) moved again with the mint: editCorpusRatchet A7 now [672, 269, 2185] (measured at ef0b6208d); generatorGoldenMaster, espionageDormancyFence, dmLayerGoldenIsolation A7, the pin seams' A1s, hookThemeDraws, rosterDuplicateDraws, x46NpcBand: re-read each failure at the tip, JSON to a file); the test files that name the files this seat touched (resolveCrisisCast.js: tests/domain/worldFactRederive, tests/generators/{generationForkCensus,people/ties,pipelinePinnedChoosers,resolveCrisisCast}, tests/lint/{chooserRecordPathRegistry,generationForkRegistry.contract,heldKeyWriterCensus,observedShapeSentinel,transientChooserRegistry}; crisisHooks.js: tests/architecture/engineCoreLazyEdge, tests/components/publicCrisisHookLabel, tests/domain/{crisisCastSeatAndAccess,crisisHooks,facts/displayDrawSites}, tests/generators/resolveCrisisCast) at the tip AND at 30ed925ee, no red new on this seat's commits. Already measured by this seat: the six reds green and the step's files green at ef0b6208d (pipelinePinnedChoosers A1 the one class-(a) red); the crisisHooks set at 9a12e5411 red only on presumedThings (red at ef0b6208d, the same door output) and the lighting census (re-taken, d3d94961d).
2. Item 4, the declaration-pass rows; 5, the edge bundles (PLAUSIBLE, not measured: both bundles carry crisis-hook code, `crisisHook` greps in supabase/functions/_shared/engineBundle.js and aiGroundingBundle.js, so they likely differ); 6, validate, THE FINAL STATEMENT, one message: as the brief and PART 8's HAND BACK give them.


## Instruments (outside the tree; lost with the container)
- <scratch>/wt (branch b9-work), wt-line (976db5b19), wt-tip0 (30ed925ee), wt-tip1 (ef0b6208d), node_modules symlinked from wt; <scratch>/c2 (CENSUS-2 at 2686272b1); births-line/, births-tip0/, births-cure1/ (ef0b6208d), births-cure2/ (9a12e5411): the 720 by births.mjs; tools/: fdiff.mjs (the field diff by family; re-made as PART 8 describes), rdiff.mjs (one family's differing leaves with an example), minted.mjs, npckeys.mjs, npcvals.mjs, counts.mjs (stored roster counts), slots.mjs (each slot's fills by holder role), plague.mjs, tonight.mjs (composeTonightSheet per town).

# PART 10 — R2-CODE-B-10, the tenth seat (the record re-measured; the touched tests; the declaration rows; the edge bundles; THE LANE'S ONE FINAL STATEMENT)

**Seat:** R2-CODE-B-10 (session_01ACmDYY2433jsUYaeB9fos7); **the chair:** session_01ACmDYZrFEVXyZEUg1NDxxC. **Brief:** docs/chair/2026-11-14/briefs/BRIEF-R2-CODE-B-10.md on lane/chair-2026-11-08 (self-contained; read whole). **Tip read back at start:** ac8168c8c (as the brief); the line 976db5b19. **Nothing under src/ is changed by this seat** (a fresh reader reads the lane at ac8168c8c): `git diff --stat ac8168c8c..HEAD -- src/` prints nothing.

## The chair's rulings received by this seat (notifications)
- None queued at any read (after every commit) through this part's last commit.

## Items (this seat; each pushed)
| step | commit | measured |
|---|---|---|
| 1: the draft shift record re-measured at the tip | 750b7a612 | the 51 registered suites and the eleven pin files, run as files at the line 976db5b19 and at the tip ac8168c8c (vitest JSON to files outside the tree): line 493 tests / 4 red, tip 493 / 19 red. generator-golden-master MOVED (36 of 525, green at the line); espionage-dormancy-fence MOVED (483e4786c1f33ff8… against the pinned 05f70cf9…; 2e5ba810… at fd9c09f42); dossier-prose-manifest CARRIED (the same 3 reds at both); the other 48 UNMOVED (green at both). The pins named, NOT re-keyed: hookThemeDraws 2107 -> 2109; rosterDuplicateDraws 853 -> 889; x46NpcBand 7 dark worlds (6 at fd9c09f42); editCorpusRatchet A7 [682, 269, 2181] -> [672, 269, 2185]; institutionBudgetPromise 3 of 60 ([13, 43, 49]); the pin seams' A1s (nameHeldThroughAssembly A1, rosterFinalUnderHeldRoster A1, pipelinePinnedChoosers A1, pipelinePinnedMode A1/A2/A5, powerEconomyFreshness A4: 3 golden rows each) and dmLayerGoldenIsolation A7 (36) read the moved golden. editCorpusRatchet A5 red at BOTH trees (a timeout, ~685 s under two concurrent runs on four cores): carried. |
| 2: the test files that name the files the ninth seat touched, at 30ed925ee and at the tip | (this part) | the sixteen files (src/generators/steps/resolveCrisisCast.js and src/domain/crisis/crisisHooks.js named by: tests/architecture/engineCoreLazyEdge, tests/components/publicCrisisHookLabel, tests/domain/{crisisCastSeatAndAccess,crisisHooks,facts/displayDrawSites,worldFactRederive}, tests/generators/{generationForkCensus,people/ties,pipelinePinnedChoosers,resolveCrisisCast}, tests/lint/{chooserRecordPathRegistry.walker,generationForkRegistry.contract,heldKeyWriterCensus.walker,observedShapeSentinel,transientChooserRegistry.walker}; and tests/lint/.lighting-census-baseline.json's reader tests/lint/sovereigntyLightingContract.walker), vitest JSON to files: 30ed925ee 166 tests / 2 red; the tip 170 / 2 red (crisisHooks.test.js gains its 4). THE SAME TWO REDS AT BOTH, none new on the ninth seat's commits: pipelinePinnedChoosers A1 (class (a), the moved golden, step 1) and generationForkCensus A3e (STACK_TRACE_ERROR at ~250 s at both trees: a timeout under the concurrent run; carried). No message to the chair (no red new). |
| 3: the declaration-pass rows worded | (this part) | below, "Step 3". |
## Step 3: FOR THE DECLARATION PASS, the rows worded as the chair re-ruled (PART 8's HAND BACK item 4; the chair's 06:40 ruling (iii))
Measured at the tip ac8168c8c by `node scripts/presumed-things-door.mjs --check` (writes nothing; exit 1: `fresh 18 · stale 0 · first-register stale 0 · banked 4719 · strips fresh 0 stale 0 banked 107`): the fifteen quick-guide hits and the faith reading's three, the same eighteen as PART 7's 9e8d2af22. Each literal read in src/domain/summary/settlementQuickGuide.js itself, by line (the line numbers are the tip's: the literals sit at l. 352-364 in scopeAtSize and l. 412-416 in scopeAgainstRoster; PART 7's ranges are older). FIRST = the replace()'s first argument, a matcher of text the frame holds (the page prints the whole frame where the gate does not strike it); SECOND = the replace()'s second argument, text a page prints. A SHAPE ROW is a literal standing apart from a QUICK_GUIDE_SIBLINGS member (l. 952 on) that already declares its atom: the shape cure moves it into its declaring member as a twin, the output byte-identical. Every other row: the code condition that gates it and the atom it would declare. No new word is needed by any row.

| # | line | atom (the matcher's) | the literal | arg | the row |
|---|---|---|---|---|---|
| 1 | 352 | streets | "built in masonry around a civic square, and run by" | FIRST (the Latin frame, SCOPE_PHRASE.latin) | CODE CONDITION: struck where `tiny` (TINY_TIERS: thorp, hamlet; scopeAtSize l. 351); the Latin frame declares nothing in QUICK_GUIDE_SIBLINGS. Atom: `streets` (a civic square, masonry), the frame's own need where not tiny. |
| 2 | 354 (and 413 as FIRST) | market | "built on tribute, market and waterworks" | SECOND at 354 (prints in a tiny Mesoamerican place); FIRST at 413 (matched where no waterworks house) | SHAPE ROW: the Mesoamerican member declares `needs: ['market']` (l. 961); the struck variant stands apart from it. |
| 3 | 357 | docks | "built around the agora and the harbour" | FIRST (the Greek frame) | SHAPE ROW: the Greek member declares `needs: ['navigable']` (l. 968), and the harbour's gate is scopePhrase's water branch (WATERSIDE_SCOPES, isLandlocked) with scopeAgainstRecord l. 290 striking the harbour where `water !== 'maritime'`. |
| 4 | 357 | streets | "built around the agora and the harbour" (the same literal) | FIRST | CODE CONDITION: struck to "built around the harbour" where `tiny \|\| noMarket` (l. 356; noMarket = a roster and factsOf(s).market === false). Atom: `streets` (the agora); the Greek member declares only `navigable`. |
| 5 | 357 | docks | "built around the harbour" | SECOND (prints in a tiny or marketless maritime Greek place) | SHAPE ROW: the Greek member's `navigable` (l. 968), reached only where l. 290 left the harbour standing (`water === 'maritime'`). |
| 6 | 358 | streets | "built around the agora, and run by" | FIRST (the Greek frame after l. 290 and the ground's replace, l. 293-296, where the terrain names no ground) | CODE CONDITION: `tiny \|\| noMarket` (l. 356). Atom: `streets` (the agora). |
| 7 | 359 | streets | "built around the agora, " | FIRST (the Greek frame with its ground, inland or not) | CODE CONDITION: `tiny \|\| noMarket` (l. 356). Atom: `streets` (the agora). |
| 8 | 362 | quarters | "built around kin districts and an assembly ground" | FIRST (the Celtic frame) | CODE CONDITION: struck to "built around kin" where `small` (l. 361: populationBandOf(s) === 'small' or SMALL_TIERS thorp, hamlet, village; NOT TINY_TIERS, as PART 8's item 4 wrote: the code reads `small` for the quarters lines). The Celtic frame declares nothing. Atom: `quarters`. |
| 9 | 363 | streets | ", in quarters by trade and kin" | FIRST (the South-Asian twin "built around the tank, in quarters by trade and kin", l. 966, which declares nothing itself) | CODE CONDITION: `small` (l. 361). Atom: `streets` as the matcher names it (the quarters by trade). |
| 10 | 364 | streets | ", in quarters by trade," | FIRST (the South-Asian frame) | CODE CONDITION: `small` (l. 361). The South-Asian member declares `market` and `institution: temple` (l. 965), not this atom: not a shape row. Atom: `streets`. |
| 11 | 412 | market | "tribute, and market-and-waterworks" | FIRST (the Mesoamerican frame) | SHAPE ROW: the Mesoamerican member's `market` (l. 961). |
| 12 | 412 | market | "tribute and market" | SECOND (prints where the roster holds no waterworks house) | SHAPE ROW: the Mesoamerican member's `market` (l. 961). |
| 13 | 413 | market | "built on tribute and market" | SECOND (prints in a tiny Mesoamerican place with no waterworks house) | SHAPE ROW: the Mesoamerican member's `market` (l. 961). |
| 14 | 416 | temple | ", under temple and guild" | FIRST (the South-Asian frame) | SHAPE ROW: the South-Asian member declares `institution: temple` (l. 965). |
| 15 | 416 | temple | ", under the temple" | SECOND (prints where the roster holds no guild house, GUILD_HOUSE) | SHAPE ROW: the South-Asian member's `institution: temple` (l. 965). |

Fifteen: SHAPE ROWS 8 (#2, 3, 5, 11-15: the market 4, the harbour 2, the temple 2); CODE-CONDITION rows 7 (#1, 4, 6-10: `streets` 6, `quarters` 1). A shape cure is output byte-identical by the ruling's own form; it is the declaration pass's, after the join, not made here.

The faith reading's three (src/domain/dossier/faithReading.js, read by line at the tip), class (3), code-gated:
- l. 385 `shrine`, ", and the shrines answer to no named god." FIRST (quietOf's matcher; the whole line prints, l. 341/379/381, where `shrine`, the reading's own shrine on the roster, holds): CODE CONDITION `shrine`; atom `shrine`.
- l. 426 `siege` and `temple`, "… has no church of its own, and the siege keeps its people from the next village's parish church." PRINTED (a template the page prints): CODE CONDITION `!reading.hasChurch && reading.accessOnly && reading.roadBarred` (the siege in force, R2-CODE-B-SIDE item 7); atoms `siege` and the church's absence (`temple`).

THE FACT-LAYERS READER'S ROW (STOP 2; `node scripts/fact-layers-door.mjs` at the tip, exit 1, "1 rise(s), 1 fall(s)", REFUSED: shrink-only; it wrote nothing): src/domain/summary/settlementQuickGuide.js `guild`, a reader's reworded condition, both contents —
- banked (FALL): `if (roster && out.includes('run by guild and estate') && !factsOf( (source)).guild) {`
- the tree (RISE, l. 278): `if (roster && out.includes('run by guild and estate') && !rosterHolds(source, GUILD_HOUSE)) {` (R2-CODE-B-SIDE item 5, 66a4f587c: a guild only with a guild HOUSE). Nothing re-keyed, nothing banked.

## Step 4: THE EDGE BUNDLES (6923a7d47, committed alone)
`npm run build:edge-shared` (exit 0) in the scratch worktree with its own node_modules (npm ci; not symlinked; `grep` of the scratch path in every bundle: 0). engineBundle.js and aiGroundingBundle.js differ (their sourceHash 9efe8877… -> 51c2a04a…, ad4aac80… -> 99b941ba…); the other four bundles' meta carry only a new generatedAt and are committed with them (edgeSharedBundleReproducibility's single-build-window title reds when they are left out: measured, 46,912 s spread). The eleven test files that read the bundles (tests/build/{engineBundleReplay,engineServiceCore,engineServiceStoreParity}, tests/domain/deityTemperConsumerCensus.walker, tests/edgeFunctions/{aiCharterBundle.freshness,aiGroundingBundle.freshness,aiGroundingContract,edgeSharedBundleReproducibility,intentAtlasBundle.freshness}, tests/lib/{engineRemoteTransport,generationClient}): at 750b7a612 (before) 262 tests / 5 red: THE THREE EDGE TITLES (aiGroundingBundle.freshness "the current source tree matches the recorded hash"; edgeSharedBundleReproducibility's aiGroundingBundle.meta and engineBundle.meta dirty-build titles) and engineBundleReplay's two (the golden corpus 36 of 525, the fence 50 of 360: the stale bundle against the in-process pipeline); at 6923a7d47 (after, re-run after lint-staged's eslint pass on the commit) 262 / 0 red.

## Step 5: VALIDATE
`node scripts/implementation-packets.mjs validate` at 6923a7d47 (through gate-tail): exit 0, "valid: 257 packets (0 READY)". No symbol this lane retired is required by a landed packet (no `retiredBy` row needed).

## Also measured (step 1's pin, read at the ninth seat's base)
tests/generators/institutionBudgetPromise.test.js, run as a file at 30ed925ee: GREEN (1 test); at the tip red ([13, 43, 49] of its sixty sealed record hashes). It is not a file that names the ninth seat's files (step 2's set) but it IS red new on the ninth seat's commit ef0b6208d: class (a), a pin moved by the ruled mint (the chair's 07:32 ruling: the person minted whole moves `npcs` and the receipt), as x46NpcBand's seventh world and editCorpusRatchet A7's 672. Named, not re-keyed (the merge seat's). The shift record's row says so.

# THE LANE'S ONE FINAL STATEMENT — R2-CODE-B (lane/r2-code-b-2026-11-13), composed by R2-CODE-B-10

**The final tip:** the commit that carries this statement; its src/ and bundles are 6923a7d47's (`git diff --stat ac8168c8c..HEAD -- src/` prints nothing: the src/ a fresh reader reads at ac8168c8c is the final src/). **Base:** e969a75b7. **The line:** 976db5b19 (merged at 0aa0cce00). **The stage a reader has not read** begins at 80b960171. Composed from PARTS 6 to 10; the sections below marked COPIED are copied by script (sed over this file at ac8168c8c, headings demoted two levels), not re-read or re-measured by this seat. The whole suite was NOT run by this seat (the brief): its classing is the seventh seat's (PART 7, at 9e8d2af22), brought current by the eighth's (PART 8 step 2), the ninth's (PART 9) and this seat's (PART 10) measures.

## S1. THE COUNTS (CENSUS-2), before and after
- The instrument: CENSUS-2, the measuring seat's command (`git fetch origin lane/census-2-2026-11-13`; `git archive origin/lane/census-2-2026-11-13 docs/chair/2026-11-13/probes/CENSUS-2 | tar -x -C <scratch>/c2`; `sh <scratch>/c2/docs/chair/2026-11-13/probes/CENSUS-2/census2.sh <tree root> <an out-dir outside the repository> 4 --files <the lane's src files, comma-separated>`), at 2686272b1.
- On the merged tree: COPIED, PART 6 ROW 2, below. At the eighth seat's tip: COPIED, PART 8 Step 3, below. AT THE FINAL SRC (5764b04c4, src = 9a12e5411 = ac8168c8c = the final tip's): COPIED, PART 9 Item 3, below. Kinds (towns · distinct lines), fd9c09f42 -> the final src: a 678·524 -> 678·523; b 70·101 -> 70·101; c 276·155 -> 276·155; d 350·15 -> 350·15; e 60·20 -> 60·20; f 309·53 -> 309·53; g 720·14 -> 720·14; h 2·2 -> 2·2 (the one line gone: the plague slot's, crisisHooks.js a 1 -> 0).
- ITS LIMITS, beside every zero: it sees the dossier's views only; it cannot see two lines disagreeing. A hit is a candidate, read against its town (PART 9 Item 3 reads the lane's files' hits).
- FRESH SEEDS: no census on seeds outside the 720 is recorded in PARTS 6 to 9, and this seat ran none (the brief: measure only what it names). LEFT, named: the counts on fresh seeds are not in this statement.

## S2. THE 720-BIRTH FIELD DIFF, by family (each family one the lane declares)
- The line 976db5b19 against the final src (PART 9): 136 of 720 towns; FOUR families, each declared: `stress` 442 leaves / 127 towns and `stressors` 442 / 127 (the lane's crisis cast and stress summaries), `npcs` 77 / 57 (the temporary person minted whole: the lane's 37 and the line's 20 made whole), `generationCoherenceReceipt` 57 / 57 (its finalGraph count, re-written by its own writer over the final roster). 9a12e5411 moved no record. No other family.
- The base e969a75b7 against the merged tip (PART 6): COPIED below (the line's own moves composed; the lane's share is the line-to-tip diff above).

## S3. THE DRAFT SHIFT RECORD
docs/chair/2026-11-13/R2-CODE-B-shift-record.DRAFT.json, re-measured at ac8168c8c (PART 10 step 1): the 51 registered surfaces by measure — generator-golden-master MOVED (36 of 525), espionage-dormancy-fence MOVED (483e4786… for the pinned 05f70cf9…), dossier-prose-manifest CARRIED (the line's 3 reds), the other 48 UNMOVED (green at the line and the tip); THE SIX: those three, pdf-golden-view-model-snapshot's suite, herald-knowledge-desk-golden and preset-lighting-witness UNMOVED. The pins NAMED with their new figures (hookThemeDraws 2109; rosterDuplicateDraws 889; x46NpcBand 7 worlds; editCorpusRatchet A7 [672, 269, 2185]; institutionBudgetPromise [13, 43, 49]; the pin seams' 3 rows; dmLayerGoldenIsolation A7 36). UNSIGNED: `seat` and the merge commit are the merge seat's; no golden door was run in its writing mode by any seat of this lane.

## S4. THE REDS, BY CLASS, at the final tip (each red classed against the line's own failing set at 976db5b19 and the lane's base)
- (a) GOLDENS AND PINS MOVED BY THE LANE'S DECLARED FAMILIES (red at the tip, green at the line; the merge seat's to sign and re-key by identity): generatorGoldenMaster; espionageDormancyFence THE DRIVEN GOLDEN; dmLayerGoldenIsolation A7; nameHeldThroughAssembly A1; rosterFinalUnderHeldRoster A1; pipelinePinnedChoosers A1; pipelinePinnedMode A1, A2, A5; powerEconomyFreshness A4; hookThemeDraws pin:no-hook-is-lost; rosterDuplicateDraws the corpus is live; x46NpcBand sixty seeds; editCorpusRatchet A7; institutionBudgetPromise (red new on ef0b6208d, the ruled mint; PART 10). Measured by this seat as files at both trees (PART 10 step 1).
- (b) CURED by the lane (PART 8: negativeAssertionAnchor.walker, seedLoopTotality.walker, joins/fieldManifest, mutationCoverageManifest; PART 9: STOP 1's six, green at ef0b6208d).
- (c) THE EDGE BUNDLES: CURED (6923a7d47; PART 10 step 4: 5 red -> 0 on the eleven files).
- THE LANE'S WALKERS, RED AND NAMED, for the declaration pass (the chair's 04:58 ruling; not banked, keyed, reworded or re-routed): presumed-things (`node scripts/presumed-things-door.mjs --check` at ac8168c8c: exit 1, fresh 18, stale 0) and fact-layers (`node scripts/fact-layers-door.mjs`: exit 1, 1 rise, 1 fall, refused, wrote nothing). THE LANE'S, named: the rows in S6.
- THE LINE'S, CARRIED (red at 976db5b19 too): dossierProseManifest's 3 (the seventh seat's classing).
- LOAD TIMEOUTS, red at both trees measured (not the lane's): editCorpusRatchet A5 (~685 s; red at the line too) and generationForkCensus A3e (~250 s; red at 30ed925ee too), both under two concurrent runs on four cores; the whole suite in six shards on the joined tree classes them.
- The whole suite's own classing: COPIED, PART 7's shards and PART 8 Step 2, below.

## S5. THE NEW WORDS, for the owner's veto
COPIED: PART 8 Step 5's "THE NEW WORDS, gathered" and "THE NEW WORDS in the lane's commit bodies", below. The ninth seat and this seat add no word (PART 9 names none; this seat wrote no line).

## S6. FOR THE DECLARATION PASS
PART 10 Step 3 above: the fifteen quick-guide rows (8 SHAPE ROWS: market 4, the harbour 2, the temple 2; 7 CODE-CONDITION rows: `streets` 6, `quarters` 1), the faith reading's three, and the fact-layers reader's row with both contents. No row needs a new word.

## S7. FOR THE JOIN
COPIED: PART 8 Step 5's "FOR THE JOIN, gathered" and "added by PART 7's next step and the brief", and PART 9's FOR THE JOIN, below. This seat adds none (nothing under src/ changed).

## S8. THE EDGE BUNDLES, checked last: committed alone, 6923a7d47 (PART 10 step 4).

## S9. EXITS
`node scripts/implementation-packets.mjs validate` at the final src: exit 0 (257 packets, 0 READY). Presumed-things `--check`: 1 (S4, S6). Fact-layers door: 1 (S4, S6). The edge files: 0 red. Step 2's sixteen files: the same 2 reds at 30ed925ee and the tip, none new.

## S10. LEFT
COPIED: PART 8 Step 5's "LEFT, gathered", below (each row's state is the parts' that follow it: PART 8's steps 1-5, PART 9's items 1-3 and this PART's steps 1-5 mark what they did; this seat did not re-mark the rows one by one, as the brief forbids reading the gathering). LEFT AFTER THIS STATEMENT: the merge seat's signing of S3's record and the re-keying of S4 (a)'s pins by identity; the declaration pass (S6) on the joined tree; the whole suite in six shards on the joined tree; the counts on fresh seeds (S1); the bar's rows (the brief's step 6), by this seat only if its count allows.

---
## COPIED BY SCRIPT (from this file at ac8168c8c)

### COPIED — PART 6 ROW 2 (lines 436,446 at ac8168c8c)
#### ROW 2: CENSUS-2 ONCE ON THE MERGED TREE (lane/census-2-2026-11-13 at 2686272b1; `census2.sh <tree> <out> 2 --files <the lane's 37 src files, base to tip>`, the census's 720; both runs exit 0, read)
- Trees: the lane's base e969a75b7 (frozen worktree) and the tip ba83c09da (clean worktree).
- Kinds over the 720 (towns · distinct lines), base -> tip: a 716·619 -> 688·531; b 70·99 -> 70·99; c 292·296 -> 260·153; d 381·39 -> 349·14; e 60·20 -> 60·20; f 720·345 -> 306·52; g 720·14 -> 720·14; h 21·68 -> 2·2. NEW 0 on both (no cold lists joined: "unjoined").
- The lane's files with hits, base -> tip: settlementQuickGuide.js c 158 / a 59 towns -> a 2; crisisCast.js a 18 -> 0; stressNarrative.js a 8 -> 0; crisisHooks.js f 6 -> 0; EconomicsTab.jsx a 498 -> 6, f 307 -> 206; InstitutionsTab.jsx f 720 -> 300; PowerStrata.jsx f 720 -> 296; WhoRunsThisTownPanel.jsx f 81 -> 13; traditionCorpus.js a 3 -> 3; institutionDisplayName.js f 0 -> 6 (its label now reaches the Outlook line; ruled-kept qualifier).
- EVERY HIT AT THE TIP IN THE LANE'S FILES, READ (a hit is a candidate):
  - f, all five writers (InstitutionsTab, PowerStrata, WhoRunsThisTownPanel, institutionDisplayName, EconomicFlowsSection): "Bowyers & fletchers (guild)", "Inns and taverns (district)": the ruled-KEPT in-world qualifiers (ruling (a)). Kept.
  - traditionCorpus.js a, 3 towns: "The Fair of the First Landing" with no fair: the side seat's FAIR stop (FOR THE JOIN). Named.
  - settlementQuickGuide.js a, 2 towns (r2s-indebted-village-3, r2s-mass_migration-hamlet-1): the Greek scope's "built around the harbour" on a coastal place whose roster holds no docks. The scope's harbour gate is the record's water (`navigable`, ruling 5); the census reads a harbour as a house. NAMED, NOT CURED (a ruled gate; whether a coast's harbour needs a docks house is a ruling).
  - EconomicsTab.jsx (the third leaves lane's file, as the side seat's brief says: not this lane's to change): g 720 towns "Agriculture modifier: 69%" (machinery on the page); a 6 "ships bring in most of the rest" with no ships on the roster (r2r-thorp-24); b 25 "a bad season would bring real hunger" under a famine (shortWords; r2r-hamlet-16); b 1 "No recorded imports." while the roads are cut (r2s-under_siege-thorp-2). NAMED with their owner.
- LIMITS: the dossier's page views only (no PDF, Foundry, Tonight, exports); it cannot see two lines disagreeing.


### COPIED — PART 6 THE 720 FIELD DIFF (lines 447,449 at ac8168c8c)
#### THE 720 FIELD DIFF, base e969a75b7 against the tip ba83c09da (the two censuses' own births, every leaf; /home/user/b6/m/fdiff.mjs)
- 129 towns, 929 leaves, THREE families, each one this lane declares: `stress` 446 leaves / 129 towns and `stressors` 446 / 129 (the cast: roles' reason / id / name / kind / temporary, levers, stakes in 113 towns: item 4 and the least-say reasons; the summary in 53 towns: famine 42 (item 6's grain twin), wartime 13 (item 6's prosperity refusal, the fifth seat's market refusal, items 0 and 0b)); `npcs` 37 leaves / 37 towns (whole entries, item 4's). Nothing else moved.


### COPIED — PART 7 THE WHOLE SUITE (lines 499,505 at ac8168c8c)
#### THE WHOLE SUITE, ONCE, IN SIX SHARDS (at 9e8d2af22; `npx vitest run --exclude='tests/build/**' --shard=<i>/6 --reporter=json`, each to its own file outside the tree; the ledger ref fetched first)
- 3204 files, 38,750 tests: 41 failed, 17 skipped/todo; each shard's own exit 1; refs and local config snapshotted before and after every shard and every classing run: all equal.
- CLASSED by re-running the 30 red files on frozen trees of the line 976db5b19, the lane's base e969a75b7 and the lane's own pre-merge tip c40da4ec6 (JSON per tree):
  - CARRIED, red on the line too (10; the line's, named, not touched): tests/lint/proseFamilyContract.walker.test.js 5; tests/property/dossierProseManifest.test.js 3; tests/data/foundingWorldBones.test.js 1; tests/lint/siteCoherenceRatchet.test.js 1.
  - THE LANE'S, red at its own tip c40da4ec6 before the merge, green on the line and at the base (27): tests/domain/recordInvariants.test.js; tests/domain/recordMerge.test.js; tests/edgeFunctions/aiGroundingBundle.freshness.test.js; tests/edgeFunctions/edgeSharedBundleReproducibility.test.js ×2; tests/generators/densityLaw.test.js; tests/generators/hookThemeDraws.test.js; tests/generators/nameHeldThroughAssembly.test.js; tests/generators/pipelinePinnedChoosers.test.js; tests/generators/pipelinePinnedMode.test.js ×3; tests/generators/powerEconomyFreshness.test.js; tests/generators/rosterDuplicateDraws.test.js; tests/generators/rosterFinalUnderHeldRoster.test.js; tests/generators/x46NpcBand.test.js; tests/joins/fieldManifest.test.js; tests/lint/mutationCoverageManifest.test.js; tests/lint/negativeAssertionAnchor.walker.test.js; tests/lint/recordRegisterTotality.walker.test.js; tests/lint/seedLoopTotality.walker.test.js; tests/property/dmLayerGoldenIsolation.test.js; tests/property/editCorpusRatchet.test.js ×3; tests/property/espionageDormancyFence.test.js; tests/property/generatorGoldenMaster.test.js. (The goldens and pins its declared moves shift, signed at the merge point; the edge bundles, rebuilt last; the walkers among them to be read against the fifth and sixth seats' classing.)
  - COMPOSED, red only at the merge (4): tests/lint/presumedThings.walker.test.js "every source literal … declares it, or has its row" (ruled class (3): FOR THE DECLARATION PASS, below); tests/lint/factLayers.walker.test.js READERS (ruled the same, below); tests/lint/defenceFactReaders.walker.test.js "every file reads exactly its banked count" and tests/lint/proseNumerics.test.js "legacy debt moved/fell" (193 rows): NOT YET READ by this seat (the next step's first row).


### COPIED — PART 8 Step 2 (lines 540,554 at ac8168c8c)
#### Step 2: THE TWENTY-SEVEN, CLASSED BY READING EACH FAILURE (re-run at 327035149, JSON to a file: 24 files, 496 tests, 29 red = the same 27 + the two ruled reds; the set did not change at the merge or by the seventh seat's cures)
| class | file :: test | the failure read |
|---|---|---|
| (a) golden | tests/property/generatorGoldenMaster.test.js | 36 configs differ from the golden master |
| (a) golden | tests/property/espionageDormancyFence.test.js :: THE DRIVEN GOLDEN | the 360-settlement hash moved (2e5ba810… for 05f70cf9…) |
| (a) golden | tests/property/dmLayerGoldenIsolation.test.js :: A7 | 36 rows: the dormant re-derivation is the moved golden |
| (a) golden | tests/generators/nameHeldThroughAssembly.test.js :: A1; rosterFinalUnderHeldRoster.test.js :: A1; pipelinePinnedChoosers.test.js :: A1; pipelinePinnedMode.test.js :: A1, A2, A5; powerEconomyFreshness.test.js :: A4 | each "a golden row moved with no pin bag": 3 rows of the golden corpus, the same 3 in each (the pin seams' null-change checks read the committed golden) |
| (a) pin | tests/generators/hookThemeDraws.test.js :: pin:no-hook-is-lost | the NPC denominator 2107 -> 2109 (two temporary persons in its corpus) |
| (a) pin | tests/generators/rosterDuplicateDraws.test.js :: the corpus is live | births with rosters of two or more 853 -> 889 of 1,000 |
| (a) pin | tests/generators/x46NpcBand.test.js :: sixty seeds | 6 dark worlds differ from their digests (x46-dark-thorp-005, …) |
| (a) pin | tests/property/editCorpusRatchet.test.js :: A7 | the honesty figures [682, 269, 2181] -> [674, 269, 2185] |
| (b) cured | negativeAssertionAnchor.walker, seedLoopTotality.walker, joins/fieldManifest, mutationCoverageManifest | the four commits above |
| (c) edge | aiGroundingBundle.freshness; edgeSharedBundleReproducibility ×2 | the recorded source hashes: step 6 |
| STOP 1 | tests/generators/densityLaw.test.js :: hamlet (R-P5); tests/lint/recordRegisterTotality.walker.test.js :: A6; tests/domain/recordInvariants.test.js :: EM-R0b A1; tests/domain/recordMerge.test.js :: A1; tests/property/editCorpusRatchet.test.js :: A1, A8 | ONE CAUSE, read in each: the crisis cast's TEMPORARY PERSON. This lane's ROUND THREE item 4 (77ed210af, ruling (a), a DECLARED move: 47 of 800 towns gain exactly one temporary person in `npcs`) reaches the mint in src/generators/steps/resolveCrisisCast.js (l. 76-86, unchanged since the base, on no lane): the minted entry has NO `importance` (densityLaw: `expected [minor, notable, key, pillar] to include undefined` for npc_temp_healer in a dens-e2e hamlet; recordRegisterTotality: "card-standing: importance missing from an npcs[] entry") and is appended AFTER the coherence receipt's graph evidence counted the roster (recordInvariants and editCorpusRatchet A8: V-EVIDENCE-ROSTER, "the receipt's graph evidence names roster sizes the record's own rosters do not carry", on exactly the golden-master-v3 thorps and hamlets that carry a temporary person; recordMerge A1 and editCorpusRatchet A1: merge(record, X, X) is not the record on the same two). Not a golden, not a pin, not a register of this lane's files: a record-integrity law the declared move breaks. NOT CURED (the brief: a red that fits none of the three is a STOP). RECOMMENDATION: a cure at the mint, red first, as a declared move of `npcs` (the temporary person stamped `importance: 'minor'` by the roster's own rule, and the receipt's roster evidence taken after the cast step, or the person counted in it), its field diff confined to `npcs` and the receipt; then the goldens of class (a) re-measured, since they move again. |


### COPIED — PART 8 Step 3 CENSUS-2 (lines 555,561 at ac8168c8c)
#### Step 3: CENSUS-2 AT THE TIP (lane/census-2-2026-11-13 at 2686272b1; `sh <c2>/census2.sh /home/user/wt-b8 /home/user/b8/c2tip 4 --files <the lane's 38 src files: the 37 base..c40da4ec6 and the seventh seat's two cures' files>` at fd9c09f42 (b8b0f2971's tree + docs), the census's 720; its own exit 0; births+render 708 s, count+trace 118 s; counts.txt 1975 rows, read)
- THE BASE'S COUNTS are PART 6 ROW 2's, the same instrument (2686272b1) and the same 720 at e969a75b7: not re-run (no base file changed). Kinds (towns · distinct lines) base -> the sixth seat's tip ba83c09da -> THIS TIP: a 716·619 -> 688·531 -> 678·524; b 70·99 -> 70·99 -> 70·101; c 292·296 -> 260·153 -> 276·155; d 381·39 -> 349·14 -> 350·15; e 60·20 -> 60·20 -> 60·20; f 720·345 -> 306·52 -> 309·53; g 720·14 -> 720·14 -> 720·14; h 21·68 -> 2·2 -> 2·2.
- THE LANE'S FILES with hits at this tip (towns): EconomicsTab.jsx g 720, a 6, b 29, f 213; InstitutionsTab.jsx f 303; PowerStrata.jsx f 298; WhoRunsThisTownPanel.jsx f 13; institutionDisplayName.js f 7; traditionCorpus.js a 3; crisisHooks.js a 1 (by the hit's trace); settlementQuickGuide.js a 2 -> 0 (the Greek harbour hits gone).
- THE RISES, READ: c (+16 towns) and d (+1) are in no file of the lane's (the line's merged writers). f in the lane's files (+3 InstitutionsTab, +2 PowerStrata, +7 EconomicsTab, +1 institutionDisplayName: the siege's "critically impaired" list now names "Inns and taverns (district)" in 6 sieged cities and metropolises): every one the ruled-KEPT in-world qualifier ("Inns and taverns (district)", "Bowyers & fletchers (guild)", ruling (a)). b in EconomicsTab.jsx 26 -> 29 (famine "hunger-later" 23 towns: "grows about a third … Many households go short", and siege trade lists 4): the third leaves lane's food and trade writers (NAMED with their owner by the sixth seat), composed with the line's W2-A-LEAVES-2 F1 (04bab40c6, "the gap lines print again"). traditionCorpus a 3: the side seat's FAIR stop (FOR THE JOIN).
- ONE FRESH FALSE LINE IN A LANE FILE (class (4) of the 04:57 ruling, a cure; NOT YET MADE by this seat, see LEFT): r2r-town-37, Summary/Crisis: "Maisa ibn Battuta, the healer who identified the outbreak first, has gone quiet." Maisa is the dean of the town's Parish churches (2-5); no healer stands on the roster. The writer: src/domain/crisis/crisisHooks.js :: CRISIS_HOOK_SLOTS.plague_onset (l. 301), whose slot fills the plague's LEVER person into "the healer who identified the outbreak first" without reading the person's role; at the line 976db5b19 the town's plague cast has no npc lever, at this tip its lever is the dean (the lane's lever rule composed with the line's roster). The cure (method rule 3: a line that names a role reads the roster): the slot fills only a holder whose own role is a healer's, else the sentence keeps its own words; red first on r2r-town-37, a guard town with a healer lever.
- LIMITS: the dossier's page views only (no PDF, Foundry, Tonight, exports); it cannot see two lines disagreeing.


### COPIED — PART 8 Step 3 FIELD DIFF (lines 562,565 at ac8168c8c)
#### Step 3: THE 720 FIELD DIFF (the census's own births; /home/user/b8/fdiff.mjs, every leaf, family = the record's top key)
- THE LINE 976db5b19 AGAINST THE TIP (the lane's share on the merged tree): 127 of 720 towns; THREE families, each one the lane declares: `stress` 442 leaves / 127 towns (cast.roles 296, summary 51, cast.levers 46, cast.stakes 37, cast.absent 12), `stressors` the same 442 / 127 (the alias), `npcs` 37 leaves / 37 towns (one whole temporary person each, ROUND THREE item 4). Nothing else moved (the receipt did not: STOP 1). Against the sixth seat's pre-merge 446 / 129 and 37 / 37: the line's own cast and summary changes compose in two towns.
- THE BASE e969a75b7 AGAINST THE TIP: 716 of 720 towns, 22 families: the line's own moves merged (npcs 99,773 leaves / 177 towns, economicState 46,822 / 637, simulationTrace 46,574 / 308, relationships 43,192 / 88, institutions 23,312 / 87, …): the lane's share is the line-to-tip diff above.


### COPIED — PART 8 Step 5 THE GATHERING (lines 569,786 at ac8168c8c)
#### Step 5: GATHERED BY SCRIPT from the parts' own paragraphs (/home/user/b8/sec.awk over the hand-back at 327035149; the commit bodies' new-word paragraphs of e969a75b7..c40da4ec6 by git show; nothing from memory). The statement's FOR THE JOIN, THE NEW WORDS and LEFT FOR AFTER THE JOIN are built from these.

##### FOR THE JOIN, gathered (PARTS 2, 3, 5, 6, copied whole)

<!-- from the hand-back, l. 161 -->
#### FOR THE JOIN (the chair's ruling of 21:13 UTC: not touched here; cured when the lanes are joined, by calling this lane's leaf)
The leaf: `src/domain/display/institutionDisplayName.js :: institutionHouseLabel(nameOrInst)` (and `houseLabelsInText(text, settlement.institutions)` for a stored sentence). The test that reds on each once the leaf is present: `tests/components/houseLabelEverySurface.test.jsx` — strike its `DEFENCE_ALLOWANCE` row (town-under_siege-rand-1: Defense tab 1, each PDF variant 1) and it reds until the three call sites below read the leaf; over the 740, the scratchpad's held-house census (`mycensus.mjs`) pointed at the same surfaces gives 16 page / 12 + 12 PDF for "Gates (if walled)" and 3 + 3 for the healer note (deduced at d1c8612b1 from the 740 run at cf676399d; re-measure at the join).
1. `src/components/new/tabs/DefenseTab.jsx :: DefenseTab`, inner `ForceCard` (line ~342): `{i.name}` -> `{institutionHouseLabel(i)}` ("Gates (if walled)" -> "Town gates").
2. `src/pdf/sections/DefenseSecurity.jsx :: DefenseSecurity` (line ~188): `{force.name}` -> `{institutionHouseLabel(force.name)}`.
3. `src/domain/display/defenseDisplay.js :: deriveSupportingCapabilities` (line ~411, Medical Readiness): `` `${facts.healerName}. Wounds and fevers …` `` -> `` `${institutionHouseLabel(facts.healerName)}. Wounds and fevers …` `` ("Major monasteries (5-10). Wounds and fevers…", 3 metropolises in the 720). `facts.healerName` is `src/domain/defense/defenseFacts.js :: defenseFactsOf`'s roster name (a match: keep it raw there).
4. The Foundry journal's Defense page (`src/foundry/journalPages.js :: defensePage`) already reads the leaf for the force NAME (2af8bdfa9); its "(required)", "(faction_boost)", "(coherence_repair)" provenance tag after each force is class (b) machinery, left for the defence surfaces' holder.

**THE STORED STOCKPILE SENTENCE (Overview and History, one town: r2r-town-9, isolated).** True writer: `src/generators/economy/viability.js :: generateEconomicViability`, the trade-dependency branch (line ~515: `` `${critical.length} institution… operating on stockpiles only (isolated trade): ` + critical.map((d) => institutionDisplayName(d.institution)).join(', ') ``; the siege variant "critically impaired by siege" is the same expression). It is copied at birth into `history.currentTensions[]` by `src/generators/historyGenerator.js` (the "Priority-add: economic viability issues → resource_scarcity" block, line ~431). Cure at the writer: `institutionHouseLabel` in place of `institutionDisplayName` in that `.map` (RECORDS MOVE: `economicViability.issues[].description` and the copied tension, in isolated and besieged towns). This lane read it at display on the Outlook, the PDF and the journal (4b11e3910, d1c8612b1); the page's Overview (`OverviewTab.jsx`, upkeep lanes', pin X-37) and `HistoryTab.jsx` (another seat's) print it raw.


<!-- from the hand-back, l. 200 -->
#### FOR THE JOIN — the empty seat's keeper (the chair's ruling of 22:19 UTC, read AFTER 535e654d6 and f09e55042 were pushed)
This seat's two commits do NOT build a styled name of their own: they read the existing leaf on this tree, `src/domain/people/seatKeeper.js :: keeperFormOf` / `seatKeeperOf` (the powers lane's file, read, not changed), and print the keeper's form in place of the bare office:
- `src/domain/summary/tonightSheet.js :: peopleOf`, the person's `role` (was `clean(npc.role || npc.title)`; now `roleOf(npc)`, the keeper's form for the keeper of an empty seat) — #pf-84, #pf-720.
- `src/components/new/npcComponents.jsx :: NPCRelCard2`, the role line `{npc1Role} · {strength} · {npc2Role}` (now `roleShown(rel.from|rel.to, …)`) — #pf-717, #pf-718.
AT THE JOIN, where the ruled one home is `seatKeeper.js :: seatKeeperStyledNameOf(settlement)` (powers lane 96a6ced46, fb4561b03): the join seat replaces `keeperFormOf(source)` in those two expressions by the leaf's styled form (or reverts the two commits if the leaf prints the name with the form, since both rows already print the name beside the role). The test that reds on the four towns: render rpf-metropolis-succession_void-13 and rpf-village-succession_void+famine-13 (app shape) and assert the Tonight person and the relationship role line never print the bare "First Magnate" / "Headman" for the keeper (read here at f09e55042: "Acting First Magnate", "Acting Headman"). Not written by this seat (context limit).

---


<!-- from the hand-back, l. 241 -->
#### FOR THE JOIN (this seat)
- THE WARTIME SUMMARY'S ONE PATH: the cure is in stressNarrative.js :: RENDERERS.wartime, which `assembleSettlement.js :: rerenderStressSummary` calls through renderStressSummary on this tree AND on the data lane (lane/w2-fix-data-2026-11-13, read): no second path was built; at the join the data lane's door renders the cured text. Named, not cured (not ruled): the loss text's "Supply caravans pass through on crown requisition" prints in the 4 isolated wartime towns of the 800 (r2s-wartime-thorp-1 and -hamlet-3 among them); RECOMMENDATION: a declared twin of that sentence excluding `route: isolated`, the crisis lane's or the seat after the merges.
- ServicesTab.jsx's `impactCovers` (the X-50 plan's `covers` list) is read by nothing once this lane's ServiceItem is in: it goes at the join (the tabs lane's file).
- The food label's one home is `src/domain/summary/tonightSheet.js :: foodBandOf(foodRecord)`. Two surfaces still print the generator's label raw and disagree with the sheet in the 160 "Pressured" towns: the Overview's Food Security (OverviewTab.jsx, `eco.foodSecurity.label`, the upkeep lanes') and the Quick Guide's food line (settlementQuickGuide.js :: the `economy.foodSecurity?.label` read, the side seat's). Each takes `foodBandOf(eco.foodSecurity.foodRecord)?.label`.
- The Defence tab's endurance line says "about three months at full rations" where the record holds 1.5 months (rpf-thorp-under_siege-13): defenseDisplay.js's own arithmetic (the first seat's #883), the defence lanes'.


<!-- from the hand-back, l. 356 -->
#### FOR THE JOIN (this seat)
- THE WARTIME SUMMARY'S ONE PATH: the cure is in stressNarrative.js :: RENDERERS.wartime, which `assembleSettlement.js :: rerenderStressSummary` calls through renderStressSummary on this tree AND on the data lane (lane/w2-fix-data-2026-11-13, read): no second path was built; at the join the data lane's door renders the cured text. Named, not cured (not ruled): the loss text's "Supply caravans pass through on crown requisition" prints in the 4 isolated wartime towns of the 800 (r2s-wartime-thorp-1 and -hamlet-3 among them); RECOMMENDATION: a declared twin of that sentence excluding `route: isolated`, the crisis lane's or the seat after the merges.
- THE STORES' SPAN HAS TWO HOMES that disagree on one figure: this lane's `tonightSheet.js :: storesSpanWords` ("about N days" to ten days, "about N weeks", months to the half below three: "about a month and a half") and the defence lane's `defenseDisplay.js :: monthsInWords` on lane/coherence-upkeep-2026-11-12 ("a day or two", "a few days", "a week or two", "a few weeks" to 31 days, "about a month" to six weeks, then the nearest whole month: 1.5 months reads "about two months", the words item 2a ruled false). RECOMMENDATION: ONE HOME at the join: the endurance line's span reads `storesSpanWords` (its own comment already names that switch as owed); the join seat measures both on the 720 first. On this lane's tree the Defence tab's older monthsInWords prints "a few weeks" in 36 towns (the defence lane's file; cured on its lane).


<!-- from the hand-back, l. 420 -->
#### FOR THE JOIN (this seat, kept current)
- THE QUICK GUIDE'S COMPOSER PRINTS NOWHERE ON THIS TREE (the chair's ruling of 03:02, as found): no file under src/ or supabase/functions calls `composeSettlementQuickGuide` (its identity sentence, its three truths with row 1d's food word, its pressure, people and entry point); only tests read it. What does print the quick guide's lines: `src/components/new/overviewIdentity.js` imports `cultureScopeLine` (the culture scope line: the side seat's item 5) and `governsLine` (who governs), the Overview's identity strip. The composer's header still names Summary, Table View, Session Mode and the PDF; none of them calls it here.


##### FOR THE JOIN, added by PART 7's next step and the brief (named, not touched)
- This lane's lines in src/components/new/tabs/EconomicsTab.jsx (l. 169, chainFlowFacts(chain, instNames, shown), the seventh seat) and src/components/new/EconomicsTrade.jsx (the PROC row's chainHousesOf), which the third leaves lane also changes.
- The tests' git helper that must clear the inherited git environment (tests/scripts/implementationPackets.test.js, implementationSession.test.js run git against the real repository from a linked worktree inside the pre-push hook: the chair's hazard of 04:37).
- (this seat) EconomicsTab.jsx's food and trade b-lines and the a 'ships bring in' line (CENSUS-2 at the tip, 29 and 6 towns): the third leaves lane's writers, named with their owner.

##### THE NEW WORDS, gathered (the parts' sections, copied whole)

<!-- from the hand-back, l. 92 -->
#### New words (for the owner's veto)
- Items 1a/1b remove words; the house label is the existing label minus its bracket.
- Item 3: the stores span "less than a day", "about a day", "about N days", "about N weeks".
- Item 4a: "No neighbours or ties between people are recorded for this settlement." (the old line less its last claim).
- Item 4c: "the defence of the place, with no one named to lead it"; "a member of the merchants' power, with the seat itself in dispute".
- Item 5: "run by patronage and law" standing alone; "built on tribute and the ritual calendar"; "built on tribute, market and waterworks"; "built around kin and an assembly ground"; "kin by kin"; "built around courtyards".
- Item 6a: "{name} has gone short of food for a second season."
- Item 6b: "…, and no god is named here." 

---


<!-- from the hand-back, l. 195 -->
#### New words (this seat, for the owner's veto)
- (c): "the only one in the house the crisis hits" (thorp-calm-rand-1, thorp-famine-rand-1); "one of the house the crisis hits" (village-famine-rand-1).
- (a): "Inns" for "Inn (multiple)" (town-calm-rand-1, town-indebted-port-1, town-plague_onset-rand-1, town-under_siege-rand-1). Otherwise words removed only.
- (b): the roster's help pill loses "history," ("The badge says who put it here: you, the living world, or a dependency.").


<!-- from the hand-back, l. 247 -->
#### New words (this seat, for the owner's veto)
- Item 2a: "about a month and a half" (rpf-thorp-occupied-13, rpf-thorp-succession_void-13, rpf-thorp-under_siege-13), "about two and a half months" (2.25–2.75 months), and "about" before every span of a month and more ("about two months", rww-village-indebted-1; "about nine months", r2r-city-7; "about 13 months", r2s-famine-metropolis-2).
- Item 2b: none (the band ladder's own "Pressured" and "Deficit"); the Daily Life tile's own words "Severe/Serious/Strained/Tightening/Adequate" print only for a record with no band.
- Item 1 and the added HIGH: none.


##### THE NEW WORDS in the lane's commit bodies (each commit whose body names new words, with the towns its body says the words were read in; an entry saying 'no new word' is kept as said)
- fc7514261 fix(R2-CODE-B-6 row 1d): the quick guide's food word reads its one home, tonightSheet.js :: foodBandOf
  - words: are unchanged. No new word. 

- e06c1a429 fix(R2-CODE-B-5, the chair's second added row): the wartime profit summary names merchants only where a market or a merchant house
  - words: the pick resolves as before to the loss text: no line added, the coin's draw unchanged, no new word. 

- 77ed210af fix(R2-CODE-B-4, ROUND THREE item 4): the crisis cast reads the empty seat, the roster and the road; a hook names a house in prose


- 8b27458cd fix(R2-CODE-B-SIDE item 7): no walk to the next village's church under a siege that bars the road
  - words: church." (new wording, for the owner's veto; read in r2s-under_siege-thorp-0..3, r2s-under_siege-hamlet-0/1, r2r-thorp-58 and r2r-hamlet-0). The first seat's item 6b (ffe89ab39) REACHES rww-thorp-famine-1: at 0570b3441 that thorp prints no walk (its only "Access to" row is the mill's); pinned in the same file. 

- 87c541620 fix(R2-CODE-B-3 item 3): a hidden allegiance names a handler only of the house the person answers to; the card's badge and a confl


- d94638185 fix(R2-CODE-B-3 item 2b): the food label reads one home on the Tonight sheet and the Daily Life tile, and a label of plenty never 
  - words: band. The ladder's own words only: no new word. 

- 66a4f587c fix(R2-CODE-B-SIDE item 5): the scope line reads the roster and the size in every frame


- f719dbb38 fix(R2-CODE-B-3 item 2a): the stores' span in words contains its figure — "about a month and a half", never "two months" for 1.5


- 305210087 fix(R2-CODE-B-SIDE item 4): the seat's list is headed by what it lists, not "The Powers (N)" twice


- e878a1367 fix(R2-CODE-B-3, the chair's added HIGH): a Services row's need and the sentence after it print apart — never "Needs TimberSuppl


- 48ddf7685 fix(R2-CODE-B-3 item 1): the Tonight sheet voices a cast person with the card's own goal, and a role's line only where the card ha


- 5ea26f677 fix(R2-CODE-B round 3, the chair's ruling (e)): a chain run only through an "Access to …" row names that row, not a house the to


- 57395ee18 fix(R2-CODE-B round 3, increment): the Faith tab never calls a contender "the real political weight" where another power governs
  - words: function already holds, "A voice in {place}’s affairs belongs to the {power}." (no new words). A governing religious power and one where no power governs read as before. The reading is composed at read: no record moves (the 22 increment towns' records byte-equal before and after). 
  - read in: Measured first and read where it prints (record 386; app shape): six towns lose the false line, every one with another power governing: rww-town-under_siege-1 (a siege; Corrupt Council governs), rww-village- under_siege-1 (a siege; Feudal Stewardship governs at 39, the Religious Authorities 31), rpf-village-succession_void+famine-13 (a famine), rww-village-calm-1 (Headman's Authority governs at 52, the Religious Authorities 37), rpf-town-succession_void-13, rpf-village-succession_void-13. In each the Faith tab now reads "A voice in the town’s / village’s affairs belongs to the Religious Authorities.": true, a contending power with a say. Smallest tier it reaches here: village; largest: t

- f09e55042 fix(R2-CODE-B round 3, increment): a relationship card styles an empty seat's keeper as the Power tab does

  - read in: Measured first and read where it prints (record 386; app shape, the reader's rpf towns): rpf-metropolis-succession_void-13 (largest): "Acting First Magnate · substantial · the postmaster", "the lord · minor · Acting First Magnate"; rpf-village-succession_void+famine-13 (famine): "Acting Headman · minor · the midwife"; rpf-village-succession_void-13: "the lord · minor · Acting Elder"; rpf-thorp-succession_void-13 (smallest): "Acting Elder · substantial · the outlaw host". Each is the Power tab's own keeper, whose seat stands empty. A held seat's tie is unchanged. New words: none. 

- 535e654d6 fix(R2-CODE-B round 3, increment): the Tonight sheet styles an empty seat's keeper as the Power tab does ("Acting Headman")

  - read in: Measured first and read where it prints (record 386: three towns, a famine among them, the smallest and largest tier it reaches; the reader's own render shape, rpf seeds born in the app's shape): - rpf-metropolis-succession_void-13 (the largest): the Tonight person "First Magnate" -> "Acting First   Magnate" (Li Song, first of the Grand Merchant Oligarchy, whose seat the Power tab says "Stands empty …   Acting First Magnate Li Song … keeps the seat meanwhile"). True. - rpf-village-succession_void+famine-13 (a famine): "Headman" -> "Acting Headman" (Achilles Bryennios,   the miller; the Power tab: "Acting Headman Achilles Bryennios, the miller, keeps the seat meanwhile"). - rpf-thorp-succ

- 99432257c fix(R2-CODE-B round 3, ruling (d)): a chain card names no ground the record says is absent (#804), page and PDF
  - words: entrepôt line), unchanged; no new words. 

- 24ab15c9b fix(R2-CODE-B round 3, ruling (c)): the crisis cast's "the one with the least say" only in a house of more than one, and never bes


- ffe89ab39 fix(R2-CODE-B item 6b): the faith line walks to a parish church only where the record gives that access


- 111e8b152 fix(R2-CODE-B item 6a): the famine and wartime summaries say no harvest where no grain grows, and no profit where the town is poor
  - words: not have (no new word in the vocabulary file). 

- 922fe5141 fix(R2-CODE-B item 5): the culture scope line speaks at the place's size


- 742ff4e43 fix(R2-CODE-B item 4d): a Market tradition prints only where a market stands
  - words: new word in the vocabulary. The tab's filter (kind A: a filter over the list, no weight and no roll moves) leaves the row out where no market stands; a DM's authored tradition is printed as authored, as before. genesis.js reads no declaration: NO RECORD MOVES (births field diff over the 740, before against after this commit: 0 of 740 differ). NAMED, NOT MADE: the PDF's Traditions chapter (src/pdf/sections/Traditions.jsx) prints the `settlement.traditions` mirror unfiltered, for the water elements as for this one; it is lit only in the deep presets. The switch: the same filterDeclared over ELEMENT_NEEDS. 

- 90bafc4d1 fix(R2-CODE-B item 4c): the crisis cast reads the defence home the Tonight sheet reads, and says "a merchant" only of a trader


- 49a6ad244 fix(R2-CODE-B item 4a): the empty Relationships line never denies a conflict the record holds


- aaf314475 fix(R2-CODE-B item 3): the span of the stores in words has one home, true at days, weeks and months



##### LEFT, gathered (the parts' stops and rows not reached, copied whole: the statement marks each row done, ruled or LEFT FOR AFTER THE JOIN)

<!-- from the hand-back, l. 42 -->
#### Stops and parked items (with recommendation)
- **#939** — "11 institutions critically impaired by siege: …, Taverns (5-20), …": written by `viability.js :: issues` (`critical.map(d => institutionDisplayName(d.institution))`). The switch: read `institutionHouseLabel` (or `houseInProse` in a sentence). Recommend: the lane that next holds viability.js takes it.

- **#883** — the Defence tab's food endurance ("carries the town for a few weeks at full rations, a few weeks on half" at three days of stores): `defenseDisplay.js :: monthsInWords` (the third leaves seat's file). The switch: for a span under a month, read `tonightSheet.js :: storesSpanWords` (the one home, item 3).


<!-- from the hand-back, l. 170 -->
#### Rows NOT reached by this seat (for a successor, line by line)
- The increment's MED rows in this lane's files (ROUND-3-CUT-INCREMENT.json at fe6d5b741, class NEW, `at.line` set), not begun: tonightSheet.js — #pf "Wants to hold the line through the war with fewer hands…" (rpf-metropolis-wartime-13, CAST_WANTS vs the person's own goal), "Wants to keep the pressure on until the seat gives way…" (rpf-city-succession_void+politically_fractured-13), "Wants to use this crisis to take the seat…" (rpf-village-politically_fractured-13): CAST_WANTS printed over the card's own goal; "No granary; two months in household stores" where storageMonths is 1.5 (rpf-thorp-under_siege-13, rpf-thorp-succession_void-13, rpf-thorp-occupied-13: `foodStoresWords` rounds 1.5 up; the stores-span home, item 3) and "Food Secure" beside a deficit. npcComponents.jsx — "Merchant guilds (3-8) · Burgomaster, first of Merchant Council · first of Merchant Guilds" (rpf-town-occupied-13: the range is cured by (a); the seat-holder-also-contender clause is not), "Madam" / "Goodwife" honorifics for male cards (rpf-city-occupied-13, rpf-village-succession_void+famine-13; the honorific table is data/faceHonorifics.js, not this lane's), "Mill · second of The Highborn Circle" (rpf-village-succession_void-13: a card with no house given a house door). crisisCast.js — "already carries more weight than whoever holds the seat" where no one holds the seat (rpf-town-succession_void-13, rpf-village-succession_void-13; CAST_REASONS.instigatorRival: needs `isSeatVacant`). WhoRunsThisTownPanel.jsx — "handled by … (Multiple criminal factions)" under another house's boss (rpf-metropolis-politically_fractured-13: the label is cured by (a) to "Rival gangs"; the handler-under-the-wrong-guild is patronage.js, the powers lane's) and "Housing (75-650 households)" (cured by (a)). traditionCorpus.js — "The Long Forge Fair" with no forge (rww-hamlet-calm-1), "The Lesser Landfall Fair" where no fair stands (rww-thorp-under_siege-1): item 4d's market disqualifier extended to forges and fairs. faithReading.js — "walk to the next village’s parish church" with no access row (rww-thorp-famine-1; item 6b's cure, check it reaches this town) and under a siege that bars the road (rww-thorp-under_siege-1). settlementQuickGuide.js — "built in wards and courtyards, ordered by bureaux" in a hamlet of 31 (rww-hamlet-succession_void-1; item 5's size rule, a frame it did not cover) and CENSUS-2's QUICK_GUIDE_SIBLINGS (38 small places). RelationshipsTab.jsx — "No neighbours, ties between people or conflicts are recorded" (rpf-thorp-calm-13; item 4a's cure, check it reaches this town). NPCsTab.jsx — "1 high influence ·" dangling separator (rpf-hamlet-succession_void-13).
- The cut's own MED rows in this lane's files not of classes (a)-(c): DailyLifeTab food tile "Strained"/"Tightening" against the food record (#843 #1102 #1297); PowerStrata "The Powers (3)" against the 5 or 6 the record holds (#562 #712 #806) and "RulerElder Council…Strong" (#85); WhoRuns "answers to Black market through …" a whisper broker (#944 #946 #1077: patronage.js, the powers lane's); viability.js's slider lines ("Military slider is high…", "Raise Economy priority…", #576 #823 #824 #825: machinery, a stored sentence, records move); crisisCast STAKE_REASONS "Grain Holders gains · holds what the crisis makes scarce" (#864); the quick guide's scope phrases #1 #234 #513; npcComponents #389 (ungrammatical conflict issue), #510, #967 #968 (hidden allegiance through the other market's broker), #978 #979 #1097.
- #1049 ("Needs Grain · affects: meals, ale, lodging" on Economics): the chair names it "your Economics line of record 371"; record 371's text is not in the chair's records this seat could reach (docs/chair on lane/chair-2026-11-08). PARKED: needs record 371's ruling and EconomicsTab.jsx beyond its "Via:" line.


<!-- from the hand-back, l. 268 -->
#### Rows NOT reached by this seat (line by line)
1. Item 4: class the five reds above, then commit the patch (one commit), gates, push.
2. Item 5: RelationshipsTab.jsx "No neighbours, ties between people or conflicts are recorded" on rpf-thorp-calm-13 (check item 4a's cure reaches it: base dump); NPCsTab.jsx "1 high influence ·" dangling separator (rpf-hamlet-succession_void-13).
3. Item 6: the second seat's FOR THE JOIN note (0570b3441) read; nothing to add.
4. The page re-count of items 3–5 on the 800 (one tip render: CENSUS-2's census2.sh --count-only on a frozen tip worktree).
5. The lighting census re-freeze through its own door at a clean tip (LIGHTING_CENSUS_REFREEZE; the estate's file count 3239 -> 3242 by this seat's new test files: tonightOwnGoal, storesSpanFigure, npcCardAllegianceHandler, + crisisCastSeatAndAccess with item 4); the sovereignty walker reds until then.
6. Item 7: CENSUS-2 at the final tip and at 62e30c7e7 (--files the lane's files; read the counter's own exit and counts.txt).
7. Item 8 (on the chair's word only): merge the side branch; THE ONE FINAL STATEMENT as part 2's EXACT NEXT STEP item 2 gives it.


<!-- from the hand-back, l. 277 -->
#### Stops and parked items (with recommendation)
- #693 and inc #14 (and the craft-in-noble-power rows): PARK to the powers lane (memberships / the Power tab's contender label).
- #389's words, #979, #510's goal fill: name to their writers' lanes (above).
- The Overview and Quick Guide food labels: FOR THE JOIN (above).



<!-- from the hand-back, l. 316 -->
#### Rows NOT reached (line by line; kept current)
1. Item 5 (RelationshipsTab, NPCsTab), the chair's added row (WhoRunsThisTownPanel + its PDF twin), the trait chips.
2. The page re-count (`--count-only`) of items 3-5 and this seat's.
3. The lighting census re-freeze (own commit).
4. CENSUS-2 at the tip and at 62e30c7e7 over the lane's files.
5. The message to the chair; then, on the chair's word, the merge, the quick guide's food line, THE FINAL STATEMENT.



<!-- from the hand-back, l. 383 -->
#### Rows NOT reached (line by line; kept current)
1. STEP 2, what is left: (a) the raw-colour budget (tests/lint/rawColorLiteral.test.js, BUDGET; the side seat banked 1224 -> 1221 on its branch): run it on the merged tip; if it reds, re-bank through its door (the BUDGET constant, its comment naming e6f006eff and this merge) in its own commit. (b) the phone chrome floor routes (tests/components/phoneChromeFloor.census.test.js ROUTE_BASELINE; the side floored /create /settlements /compendium /gallery by -2, 4b80f7cea): run it on the merged tip; re-floor only through its own measure, own commit. (c) the dossier phone floors: done in the merge (above) — re-run tests/components/dossierPhoneFloorAllViews.test.jsx at the tip to confirm it still reads 2/2. (d) THE QUICK GUIDE'S FOOD LINE: src/domain/summary/settlementQuickGuide.js, the `economy.foodSecurity?.label` read, takes `foodBandOf(economy.foodSecurity?.foodRecord)?.label` (import from ./tonightSheet.js), so it agrees with the Tonight sheet and the Daily Life tile in the 160 "Pressured" towns: measure first on the 800 (the quick guide's food word against foodBandOf, per town), red first (a test of the label in a Secure band with a gap), the governing tests of settlementQuickGuide.js, the three gates; display only, the 720 field diff 0. (e) then ONE message to the chair: the tip, the merge's conflicts, and that the wartime summary built no second path (the data lane's rerenderStressSummary calls the cured renderer).
2. STEP 3: CENSUS-2 once on the merged tree over both seats' files at the lane's base (e969a75b7, the line's base; the third seat used 0570b3441 and 62e30c7e7) and at the tip: `sh <c2>/docs/chair/2026-11-13/probes/CENSUS-2/census2.sh <tree> <out-dir outside the repo> 4 --files <both seats' files, comma-separated>` (about 12 minutes each; its own exit and counts.txt read); every hit in the lane's files read, cured or named; the count per kind. THE 720 FIELD DIFF, base against tip, by family: births by CENSUS-2's births.mjs in both trees, a leaf diff (this seat's /home/user/m/fd.mjs: load both corpora, compare every leaf path, count towns and paths by top-level key); expected families: the least-say reasons (49 towns), item 4 (94 towns: stress/stressors cast, npcs 47), the wartime summary (1 town), nothing else.
3. STEP 4: one message to the chair and WAIT FOR POINT 49; on the chair's word the merge of the line's tip, the instrument's page census on this lane's lines, THE ONE FINAL STATEMENT (the whole suite once in six vitest shards, `npx vitest run --shard=<i>/6 --maxWorkers=2`, each to its own file outside the tree; every red classed against the lane's base; ONE draft shift record; the edge bundles last, alone). The side seat's stops (the fair's act, the PDF's Traditions chapter, items 1 and 2 at the join) NAMED under FOR THE JOIN, not built.


<!-- from the hand-back, l. 417 -->
#### Stops and parked items (with recommendation)
- (cured: the price line's twin "the road" in two isolated thorps, item 0b, on the chair's ruling of 03:02.)


<!-- from the hand-back, l. 450 -->
#### Rows NOT reached (line by line; kept current)
1. (done: row 1 (a)-(d); the message to the chair with the tip follows this push.)
2. (done: row 2, above.)
3. Row 3, THE WORD GIVEN (03:08) — THE EXACT NEXT STEP for the successor, in this order: (i) deepen as above if the clone is shallow, check the base is e969a75b7; (ii) in a scratch worktree at the lane's tip, `git merge origin/lane/integration-2026-11-07` (read the tip back first; 976db5b19 at 03:40); resolve the three PDF sections by hand AT THE CAUSE (read each whole: the side seat's items 1-3 removed the upstream note, the "Import: <chain label>" From line and the template house list from SupplyChainFlow.jsx and Services.jsx; keep the line's point 47/48 changes and this lane's removals), take each of the six registers from ONE side; commit the merge naming the commit and what conflicted; (iii) run 2m's checks, then re-derive each register through its door (wiring census, writer reach, lighting census, tuning inventory, dossier phone floors, institutionBudgetPromise's pin), each its own commit; (iv) the page census on this lane's lines (2m's door, the 720); (v) THE ONE FINAL STATEMENT: merge lane/integration-2026-11-07 at its tip as read back (976db5b19 at 03:08; plain; say what conflicted); read section 2m of the merge book first; the instrument's page census on this lane's lines; THE ONE FINAL STATEMENT in the brief's form (the whole suite once in six shards, every red classed against the lane's base; ONE draft shift record; FOR THE JOIN; the edge bundles last, alone).


### COPIED — PART 9 FOR THE JOIN (lines 812,815 at ac8168c8c)
#### FOR THE JOIN (this seat)
- tests/generators/resolveCrisisCast.test.js is held by W2-FIX-DATA (w2-fix-data-2026-11-13, W2-FIX-DATA-7; on join-2026-11-14) too: it re-keyed the two plague tests' seed to slot-plague_onset-1 (its cure: the plague sentence's healer declared `needs: healer` at the source, stressTypes.js :: STRESS_TYPE_SIBLINGS). This lane's 9a12e5411 leaves that line untouched; its arms hold at either seed. The two cures are of two faults and compose.
- src/domain/crisis/crisisHooks.js is held by COHERENCE-UPKEEP (and its copies) in a disjoint hunk (CRISIS_NOUN to crisisNoun.js, l. 52-69).


### COPIED — PART 9 Item 3 (lines 816,821 at ac8168c8c)
#### Item 3, PART DONE (measured at 5764b04c4; its src is 9a12e5411's)
- CENSUS-2 at the tip (2686272b1; `census2.sh <wt> <scratch>/c2tip 4 --files <the lane's 39 src files: git diff --name-only 976db5b19 HEAD -- src>`; its own exit 0; births+render 738 s, count+trace 149 s). Kinds (towns · distinct lines), the eighth seat's tip fd9c09f42 -> THIS TIP: a 678·524 -> 678·523; b 70·101 -> 70·101; c 276·155 -> 276·155; d 350·15 -> 350·15; e 60·20 -> 60·20; f 309·53 -> 309·53; g 720·14 -> 720·14; h 2·2 -> 2·2. The one line gone: the plague slot's (crisisHooks.js a 1 -> 0, row gone).
- THE LANE'S FILES with hits (towns): EconomicsTab.jsx g 720, a 6, b 29, f 213; InstitutionsTab.jsx f 303; PowerStrata.jsx f 298; WhoRunsThisTownPanel.jsx f 13; institutionDisplayName.js f 7; traditionCorpus.js a 3; settlementQuickGuide.js a 3 (r2s-indebted-village-3 docks, scopeAgainstRecord l. 294; r2s-insurgency-town-1 waterworks and r2s-mass_migration-hamlet-1 docks, scopeAtSize l. 354/357: the scope lines item 4 rows; "on the coast" / the plaza printed true by their code conditions). These three print BYTE-IDENTICAL at 30ed925ee (re-rendered there, the same harbour/plaza lines): not a rise of this seat's. PART 8 read "a 2 -> 0" for this file at fd9c09f42 (the same src): the two counts disagree; the successor reads the hits at the base by the same command before ruling.
- THE PLAGUE SENTENCE'S OWN WORDS now hit in 3 towns (a, "healer" with no healer on the roster: r2r-thorp-41, r2r-town-37, r2s-plague_onset-hamlet-3), traced to src/data/stressTypes.js l. 103 (STRESS_TYPE_MAP.plague_onset.crisisHook): NOT a lane file; it is W2-FIX-DATA-7's cure at the source (FOR THE JOIN above: the slot-less twin where no healer stands).
- THE 720 FIELD DIFF, the line 976db5b19 against the tip: 136 of 720 towns; FOUR families, each declared: stress 442 / 127 and stressors 442 / 127 (the lane's cast, as PART 8), npcs 77 / 57 (the 37 whole persons and the line's 20 made whole, item 1), generationCoherenceReceipt 57 / 57 (the finalGraph count, item 1). 9a12e5411 moved no record (0 of 720).

