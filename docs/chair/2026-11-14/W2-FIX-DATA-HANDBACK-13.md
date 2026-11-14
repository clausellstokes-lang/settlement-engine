# W2-FIX-DATA-13: the data lane goes on curing (kept current after every item)

**State: HANDED BACK BY FILE at the count (322,755 at 13:34; the next cure with its reads and gates would cross 400,000).** Cured and pushed: DATA-SMELTER; the chair's 12:11 HIGH (revised to the 12:50 ruling); R3C-REVOLTNOTE. The ONE MESSAGE after four cures not reached (three cures); the chair was told of the HIGH's push in one line as ruled. Every figure EXECUTED unless marked PLAUSIBLE.

**Seat.** The thirteenth seat on `lane/w2-fix-data-2026-11-13`, from `c4d941895` (read back from origin first: the brief's tip, no stop). Chair: `session_01ACmDYZrFEVXyZEUg1NDxxC`. Brief: `origin/lane/chair-2026-11-08:docs/chair/2026-11-14/briefs/BRIEF-W2-FIX-DATA-13.md`. Nothing at or below c4d941895 is rewritten.

## 0. Instruments (re-made in minutes)

- Scratch worktree `/home/user/wt13` on local branch `w13` at the lane's tip, `npm ci` there (it wrote `core.hooksPath=.husky/_` and the branch's tracking keys into the shared config: nothing else; refs and config snapshotted before and after).
- Pushes: `git push origin w13:refs/heads/lane/w2-fix-data-2026-11-13`, each after `git fetch` and `test -n "$(git rev-list origin/lane/w2-fix-data-2026-11-13..w13)"`.
- Births: the scratchpad's `q/births.mjs` = CENSUS-2's `births.mjs` verbatim (`origin/lane/census-2-2026-11-13:docs/chair/2026-11-13/probes/CENSUS-2/`, by git archive); `q/seedcfg.mjs` = CENSUS-2's plus the bar's `bar0-` branch (`render.bar0.jsx :: cfgFor` verbatim); seeds = CENSUS-2's 720 + `seeds.bar0.txt` = 730 (0 errors). `q/rank13.mjs` (one predicate per row; the record fields the card, the Services tab, the PDF view model and the journal print: `institutions[].desc`, `availableServices.*[].desc`, `arrivalScene`, `history`, `culturalIdentity`/`culturalNotes`; crisis by `domain/facts/crisisKind.js :: activeCrisisTypes`, the market by `domain/facts/market.js :: marketOf`, the food record's `failedSource`/`foodSources`/`band`).

## 1. THE TABLE at the tip c4d941895 (the 730; EXECUTED, `rank13.mjs`)

| row | writer | prints | false | the fact that makes it false |
|---|---|---|---|---|
| DATA-SMELTER (the catalogue's Smelter text "...between mine and smithy") | institutionalCatalog.js | 96 | 57 | the roster lacks a mine or a smith |
| #185 the smelter's variants | institutionDescVariants.js | 21 | 0 | (cured by the eleventh seat; read true) |
| "street kitchens" (the Indic food line) | cultureProfiles.js | 73 | 30 | no market stands (`marketOf`) |
| #158 the compact's grain clause "...the current shortage..." | generators/historyGenerator.js | 20 | 18 | the food band is neither deficit nor famine |
| #233 "Sacks of herbs and spices fill the carts" | arrivalProse.js | 12 | 12 | no spice import |
| #68 "Major livestock sales across all species" (Major annual fairs) | institutionServices.js | 173 | 14 | siege or famine |
| #51 the brewery "for regional sale" / "ships across the region" | institutionDescVariants.js | 115 | 10 | siege or famine |
| #73 "Collect toll from all who cross" | institutionServices.js | 159 | 10 | siege |
| BAR-248 "The weekly service. Attendance expected of all residents." (Access to parish church) | institutionServices.js | 221 | 11 | siege (every one an Access to parish church: the walk out) |
| #67 "The largest trading event of the year. Merchants from distant regions." | institutionServices.js | 179 | 8 | siege |
| #156 "Each family tills a small holding, all of it for the table." | institutionDescVariants.js | 39 | 7 | grain exported |
| #36 "Barrels of salt fish stand stacked for the carts" | arrivalProse.js | 19 | 6 | siege 4, or famine / fish failed |
| #71 "Fish sold daily from the morning catch" | institutionServices.js | 144 | 5 | fish failed or not a source |
| SVC "Fresh produce" (Daily markets) | institutionServices.js | 117 | 5 | famine |
| PAIRS the vintner's "must brought in" | institutionDescVariants.js | 65 | 5 | siege |
| #54 the coaching inn "Built for the road" | institutionDescVariants.js | 57 | 4 | siege |
| BAR-247 "Services mean the walk to the village house of worship" (hamlet) | institutionalCatalog.js | 38 | 4 | siege |
| SVC "Caravan organization" (bar n250) | institutionServices.js | 80 | 4 | siege |
| #157 "His writ is legitimate" (Lord's reeve) | institutionDescVariants.js | 4 | 3 | the reeve is a woman (3 of 4) |
| guild war beside no guild (historyGenerator guild_conflict) | generators/historyGenerator.js | 160 | 3 | no guild on the roster (r2r-village-1, -17, -55) |
| charter hall "...with no garrison to call on it musters the defence" | institutionDescVariants.js | 3 | 3 | RULED (a verdict a band can deny); all three hamlets |
| #60 the ferry "Carts, beasts and walkers wait their turn" | institutionDescVariants.js | 40 | 3 | siege |
| #59 "International merchants. Letters of credit accepted." | institutionalCatalog.js | 57 | 3 | siege |
| #57 the fish market "The morning's catch" | institutionDescVariants.js | 73 | 3 | fish failed |
| SVC "Street food ... roasted meats" | institutionServices.js | 124 | 3 | famine |
| PAIRS the brewery "taverns and ships" | institutionDescVariants.js | 23 | 3 | siege |
| SVC the Annual fair "Livestock auction" | institutionServices.js | 22 | 2 | siege |
| "the guilds negotiated a formal compact" beside no guild | generators/historyGenerator.js | 22 | 2 | no guild (r2s-slave_revolt-hamlet-1, bar0-village-famine-rand-1) |
| the stress opener "gates are open but attended: every person entering" | (the stress opener's pool) | 2 under a siege | 2 | siege |
| the arrival's lanes of stalls under a siege | arrivalProse.js | 8 | 0 | READ TRUE here (no besieged town draws it) |
| the arrival's carts under a siege ("Carts and timber block the lanes": the barricade) | arrivalProse.js | 9 | 0 | READ TRUE (the barricade); the salt-fish carts are #36 |
| (h) the great fire's "lower districts" / "merchant stalls" | generators/historyGenerator.js | 62 / 42 | 0 / 0 | READ TRUE here: town or larger only, every one with a market |
| THE CHAIR'S 12:50 (the reader REVIEW-W2-FIX-DATA-4, NOT CLEAR at 994733bcd): (a) the forge arrival still prints (Vatantash; rv4-any-metropolis-under_siege-7); (c) a wharf with no docks, a sawmill district with no sawmill, "chandlers and tanners" with neither | arrivalProse.js and the stage's carried lines | | | NAMED, to measure at this tip; (b) the wiring census stale: NAMED, NOT RE-TAKEN (registers re-derived once, at the close); the four guard gaps: one arm each, last |
| THE CHAIR'S 13:01: LV-CATHEDRAL (TRADE_DEPENDENCY_NEEDS' two cathedral rows: worship, pilgrimage, teaching "depend on stone") | economicData.js | 100 of 720 (as named) | 100 | the rows' `svcs` name what the stone keeps up; a declared move of `dependency.affectedServices` and the at-risk marks |
| THE CHAIR'S 13:01: R3C-REVOLTNOTE (slave_revolt.viabilityNote names keepers of order where no force stands) | stressTypes.js + stressTypesMeta.js | 24 (as named) | 11 | both twins, one commit |
| #64/#191, #9 | institutionServices.js | | | PARKED (the chain-working word), unchanged |
| #180, #2 | crisisCast.js, institutionVocabulary.js | | | FOR THE JOIN (HANDBACK-11 section 9), unchanged |

## 2. The rows as cured

### 1 · DATA-SMELTER, the catalogue's Smelter text (MEDIUM): CURED, `989af877a` (lighting census `3d48883b1`)

- `src/data/institutionalCatalog.js`, the Smelter's shared desc: "... The industrial intermediate between mine and smithy." -> "Converts raw ore to refined metal using charcoal-fueled furnaces." (the chair's 11:31 ruling). Holders by content: the Smelter row is byte-identical on every lane's copy (9 distinct blobs of the file, one Smelter line).
- Counts on the 730: the old text 96 prints, 57 false -> 0; the variants 21, 0 false, unchanged. DECLARED MOVE: 96 births, only `.institutions[].desc`, the Smelter's catalogue text each time.
- Read: r2r-town-26 (town, smallest), r2s-under_siege-city-2 (siege), r2s-occupied-metropolis-1 (occupation, largest): Systems/Institutions, the PDF view model (institutions, services.detailed, overview), the journal "- **Smelter**: ...": true.
- Guard: `tests/data/w2FixData13Rows.test.js` DATA-SMELTER (its bare seed loop, red on the seed-loop totality walker, collected in `34b5110a7`), red 3 of 3 with the old text planted, green after. Doors: presumed-things two stale rows (house: mine, smith) out by `--shrink` (banked 4658 -> 4656), fresh 49 carried; governing 77 files + walker: the same 3 reds as c4d941895 (ARM 1, the golden master, urbanBandInstitutions G5); grid 0; domain-strict, type ratchet, eslint 0.
- CARRIED: the edge-shared bundles are stale at c4d941895 (10 reds in the four freshness/replay files); not rebuilt here (the join's `build:edge-shared`).

### 2 · THE CHAIR'S 12:11 HIGH: districts and quarters in the history below a town (REVIEW-W2-FIX-DATA-4): CURED, `05e98c31e` (lighting census `051a8a10c`; the smelter guard collected `34b5110a7`)

- RULED: quarters and districts belong to a town or larger, whatever the head count; the whole class with the row. The class, listed by script over the 730 (every history string naming a district, a quarter or a ward, in a thorp, hamlet or village): exactly TWO table rows print there, both lasting effects of `src/data/historyData.js :: HISTORICAL_EVENTS_DATA` drawn raw by `historyGenerator.js :: generateEventNarrative` (and copied whole into a tension): the migration's "Newcomer and old-family districts remain socially distinct" and the economic divide's "The merchant quarter and the labourers' quarter remain walled apart"; the legacy annotations quote them. Every other district/quarter row of the history tables already carries `tier: ≥ town` (the stage's) or its small-place word. Holders: every differing copy of both files is an earlier state of this lane's own file.
- CURE (as revised by the chair's 12:50 ruling, `dda3ca111`: A TIER TWIN where the event can be said of a small place in its own words, ELSE SILENCE): the two rows take `needs ['tier: ≥ town']` in `HISTORY_DESC_SIBLINGS`, each with a twin `needs ['tier: ≤ village']`; `src/generators/history/sizedLastingEffects.js` (new) resolves each drawn effect, and a tension's whole list, through `resolveSibling` (dropRefused), draw-free. (05e98c31e first gave a refused effect the template's next row: superseded.)
- Counts on the 730, c4d941895+smelter -> here: history naming a district/quarter/ward: thorp 22 -> 0, hamlet 17 -> 0 (the reader's 39), village 21 -> 0; town 79, city 84, metropolis 103 unchanged. The reader's two towns r2r-thorp-58 Tallpatan (7) and r2s-indebted-thorp-0 Makrokastro (12): the line -> "A resettlement compact governs where new arrivals may hold property".
- DECLARED MOVE (field diff): 60 births: `.history.historicalEvents[].lastingEffects[]` 53, `.history.currentTensions[].lastingEffects[]` 12, `.history.legacyAnnotations[].annotation` 7 (they quote the effect), `.generationCoherenceReceipt.judgments[]` 7 (the battery's own "walls without walls" finding on the quarters line: needs_review -> pass in 6 villages, a finding fewer in r2r-hamlet-15). At `dda3ca111` the same 60 births and families: the migration's twin in 46 events (thorp 17, hamlet 15, village 14) and 11 tensions, the divide's twin in 7 events and 1 tension. No roll moved; nothing else.
- Read (the PDF's History chapter, by its function components; the History tab prints no lasting effect; the journal none): the migration's twin in r2r-thorp-58 (thorp 7, siege), r2s-occupied-thorp-0 (thorp 13, occupation), r2s-under_siege-village-3 (village 123), r2s-recently_betrayed-village-2 (village 394, the largest); the divide's in r2r-hamlet-15 (hamlet 42), r2s-famine-village-2 (village 214, famine), r2r-village-2 (village 388); r2r-town-7 (town) keeps the fire's "lower districts ... whole quarters", a town's.
- Guard: the second test of `tests/data/w2FixData13Rows.test.js` (four small towns, two arms: no district/quarter/ward; the event's effect in the twin's words; r2r-town-1, a town, keeps both originals): the district arm red 4 of 4 with the resolution planted out, the twin arm red 4 of 4 with the twins planted out, green after.
- Doors: presumed-things fresh 49 / stale 0 (carried); fact layers 0 rises 0 falls; the wiring census is stale at c4d941895 by the same 131 bytes (tablePools), not moved here; grid 0; domain-strict, type ratchet, eslint 0 (the helpers moved out of historyGenerator.js for its max-lines rule; births byte-identical across the move).

### 3 · R3C-REVOLTNOTE, the slave revolt's viability note (the chair's 13:01): CURED, `85322e82b` (lighting census `6f86693a5`)

- `src/data/stressTypes.js` slave_revolt.viabilityNote and its twin in `stressTypesMeta.js`: "... less gets made, and everyone who keeps order is busy containing the revolt." -> "Owners keep their gangs only on work they can watch, and less gets made while the revolt lasts." (names no force; no condition). Holders: stressTypes.js this lane's alone; stressTypesMeta.js unchanged by any lane. The census-2d ledger arm lists the cell as REWORDED already.
- Counts on the 730: 24 prints, 11 with no force -> "keeps order" 0. DECLARED MOVE: 24 births, only `.stress[].viabilityNote` / `.stressors[].viabilityNote`.
- Read: r2s-slave_revolt-thorp-1 (thorp 15), r2s-slave_revolt-metropolis-2 (metropolis), bar0-town-slave_revolt+under_siege-rand-1 (a siege; none on the 730): Summary/Crisis, Systems/Defense, the PDF view model, the journal: true.
- Guard: the third test, red 3 of 3 with the old note planted. Governing 92 files + walkers: 11 red, all red at c4d941895. Grid 0; gates 0.
- A NOTE (not cured, not this row; PLAUSIBLE): r2s-slave_revolt-thorp-1's Outlook "Erdeniin keeps order and pays its way" under a revolt in force.

## 3. EVERY NEW OR CHANGED LINE, with the towns it was read in (the owner's veto list)

- institutionalCatalog.js, Smelter: "Converts raw ore to refined metal using charcoal-fueled furnaces." (r2r-town-26, r2s-under_siege-city-2, r2s-occupied-metropolis-1).
- historyData.js HISTORY_DESC_SIBLINGS: "Newcomers and the old families still keep apart" (r2r-thorp-58, r2s-occupied-thorp-0, r2s-under_siege-village-3, r2s-recently_betrayed-village-2); "The merchant families and the labouring families still keep apart" (r2r-hamlet-15, r2s-famine-village-2, r2r-village-2).

- stressTypes.js / stressTypesMeta.js slave_revolt.viabilityNote: "Owners keep their gangs only on work they can watch, and less gets made while the revolt lasts." (r2s-slave_revolt-thorp-1, r2s-slave_revolt-metropolis-2, bar0-town-slave_revolt+under_siege-rand-1).

## 4. FOR THE JOIN

- Carried from HANDBACK-12 section 3 and HANDBACK-11 section 9, unchanged.

## 5. WHAT IS LEFT, line by line (re-measure each at the tip on the 730 before curing; section 1 has the counts at c4d941895)

1. THE CHAIR'S 12:50 MEDIUM rows of the reader (REVIEW-W2-FIX-DATA-4, `origin/lane/review-w2-fix-data-4-2026-11-14` 486ed1b17, its verdict file's findings table): (a) the forge arrival still prints (Vatantash; rv4-any-metropolis-under_siege-7); (c) a wharf with no docks, a sawmill district with no sawmill, "chandlers and tanners" with neither (A LINE THAT NAMES A HOUSE READS THE ROSTER). (b) the wiring census: NAMED, NOT RE-TAKEN (stale at c4d941895 by 131 bytes, tablePools; re-derived once, at the close). Its four guard gaps: one arm each, last.
2. THE CHAIR'S 13:01 LV-CATHEDRAL (100 of 720 as named; `src/data/economicData.js` TRADE_DEPENDENCY_NEEDS' two cathedral rows: the `svcs` name what the stone keeps up, not worship, pilgrimage, teaching): a DECLARED MOVE of `dependency.affectedServices` and the Services tab's at-risk marks; more moving is a stop. Check holders first.
3. The table, widest first: "street kitchens" where no market stands (cultureProfiles.js, 30 of 73); #158 the compact's grain clause (historyGenerator.js, 18 of 20; this lane holds the file); the siege cells (one cause, crisis twins in the shape of 18fcc08ca / 43e80bfde; SERVICE_DESC_SIBLINGS and DESC_VARIANT_SIBLINGS): #68 14, BAR-248 11 (the Access to parish church's weekly rite under a siege) with BAR-247 4 (the hamlet's walk to the village church: institutionalCatalog.js, keyed in DESC_VARIANT_SIBLINGS as the fair's catalogue line is), #51 10, #73 10, #67 8, PAIRS vintner 5, #54 4, SVC caravans 4 (bar n250), #60 3, #59 3, PAIRS brewery ships 3, the fair's livestock auction 2, the stress opener's "gates are open but attended" 2; #36 the salt fish 6; #233 herbs and spices 12; the famine cells: fresh produce 5, street food 3, #71 5, #57 3; #156 7; #157 "His writ" 3 (name no sex); the two guild lines (guild_conflict 3, the compact's "the guilds negotiated" 2: historyGenerator/historyData, HISTORY_TEMPLATE_RECORD_DECLARATIONS already needs `guild` for guild_conflict, so find why 3 print); the charter hall (3, all hamlets; RULED: what the hall does).
4. THE POOL GUARD'S TWO ROWS over their ceilings on the joined tree (plotHooks:succession_crisis 0.82 vs 0.64; plotHooks:resource_scarcity 0.37 vs 0.34): find which of this lane's cures declared the other lines off; widen with lines READ TRUE or narrow that cure; never raise a ceiling.
5. PARKED, unchanged: #64/#191, #9. FOR THE JOIN, carried. Candidates: the forge pool's line 2; the crowd in two hamlets; r2s-under_siege-city-3's "sound of a market" opener; "Erdeniin keeps order" under a revolt.

## 6. How the instruments are re-made

Section 0, plus (all in the scratchpad's `q/`, re-made in minutes from section 0's sources): `rank13.mjs` (the table), `fdiff.mjs` (field diff by family), `descdiff.mjs`, `distr.mjs` / `tierc.mjs` / `effd.mjs` (the history's size words and lasting effects), `revolt.mjs`, `surf13.mjs <regex> <seed...>` (record, PDF view model paths, journal lines), `render13.sh` + `render13.jsx` (REVIEW-BAR-0's render2.sh / render.bar0.jsx with CENSUS-2's cfgFor: the rendered tabs to `r/<tag>/dumps`), `pdfr/pdfhist.test.jsx` (a PDF section's text by its function components; env TREE, SECTION, RE, SEEDS, OUTF). `holders.sh <file>` over the 64 lanes dated 2026-11-12 to -14 (a differing copy that is an earlier state of this lane's own file is this lane's). Base worktree `/home/user/wt13-base` at c4d941895 (node_modules linked) for classing reds. Births: `out/tip` (c4d941895), `c1` (989af877a), `c2`/`c2b` (05e98c31e), `c3` (dda3ca111), `c4` (85322e82b).
