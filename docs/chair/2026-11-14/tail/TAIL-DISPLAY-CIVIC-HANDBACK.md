# TAIL-DISPLAY-CIVIC · hand-back (READ-ALL worklist DISPLAY-CIVIC, 142 rows)

Seat: TAIL-DISPLAY-CIVIC, branch `lane/tail-display-civic-2026-11-14`, cut from the joined line `lane/join-2026-11-14` at **f663a2699**. Files held: `src/components/*` (not the SERVICES / DISPLAY-ECON seats' tabs), `src/domain/display/*` (not defenseDisplay.js, dossierViewModel.js), `src/domain/facts/*` (not founder.js; not factVocabulary.js, X7). Nothing merged; plain pushes to this branch only.

## The rulings worked to (the chair's, 2026-11-14; each vetoable by the owner)

- **X1** Most rows have no traced writer: find each row's writer first (the table below), then cure by writer.
- **X2** ONE HOME FOR ONE FACT: "Public legitimacy <word>" on Summary/Foundations reads the Power tab's word (NOLANE-2's item-legit patch, re-applied). A pair of powers' chip ("stable", "escalating") and the prose beside it read ONE relation (the record's factionRelationships and conflicts).
- **X3** "Economic Resilience Strong" in a besieged, struggling town: verify by the score's own law; if right by its law STRIKE with the law's line, else STOP. No band is changed by this seat.
- **X4** A heading's count is computed from the list it heads; a label that always carries a value never prints without one.
- **X5** A tradition kept under a plague: MEASURE; the display withholds nothing true; the generator's side is NAMED as a declared move, not made.
- **X6** `src/domain/summary/tonightSheet.js` is the CRISIS seat's; a Tonight-sheet row it writes is NAMED for it.
- **X7** (23:26 UTC) `src/domain/facts/factVocabulary.js` is not this seat's to edit; a cure needing a missing fact is PARKED and told.
- **X8** (23:30 UTC) "Ruling authority": neither struck nor renamed; the row keeps its composite but is not printed above what the record says of the same government: under a legitimacy crisis or fractured governance at most the scale's word below Adequate; under a contested legitimacy at most Adequate. The cap in ONE leaf; no new word. And: the governance paragraph's cause "crime" (427 towns where the safety label names another cause) reworded to "insecurity" / "the curfew"; ACCEPTED, on the owner's veto list.

## The batches

Instruments: `docs/chair/2026-11-14/probes/READ-ALL/` (inventory.py, inventory_diff.py) and CENSUS-3's `census3.sh <tree> <out> 4`, git-archived to the scratchpad and run there; each census on a scratch worktree at the batch's commit. Verification scripts read `corpus.ndjson.gz` and the dumps (never rendered to verify).

| batch | commit | rows cured | measure before → after |
|---|---|---|---|
| 1 | 812fa7e1f | 16110 (and the whole legitimacy row); 19252 19466 19516 19333 19240; B05826 B05840 06098 06102 B05843 06101 06043 | legitimacy row ≠ record: 720 → 0. Seat sentence in occupied towns: "governs" 469 → 449 printings, "is governed by" 220 → 212 (= the 28 occupied towns exactly; 0 false after). "Crime" as the cause where the safety label names a crisis: 427 → 0 (7 printings remain, all under plain labels) |
| 2 | efface11b | 13341 10196 13403 23115 06925 07174 03798 09976 (fewer or GONE; 04908 10188 13395 07168 10187 struck below) | "stable" chip over a high-intensity conflict of the same pair: 114 chips in 107 towns → 0 (the Web's chip lines 1286 → 1172, exactly the 114; each leaves its chipless twin) |
| 3 | ef9371250 | 19954 | criminal truce row named "at odds with it": 18 towns → 0 (and its other arrangement, "The hall is at odds with the Thieves' Guild.", 19 → 0) |
| 4 | 7148c48c5 | 16764 16767 | ruling-authority row above the record's cap: 164 towns → 0 (116 now read Strained, 48 Surplus → Adequate; no other sentence of the 29,949 moved) |

Batch 1's after run: every other sentence that left was a line of the cure; one sentence family gained a town ("Patron deity" and its two lines, 716 → 717, r2r-thorp-0): the first town a worker renders. That's the instrument, and no line of this seat. Inheritors: the record's legitimacy labels (278 / 149 / 135 / 90 / 68), the "insecurity" lines (405 towns), the occupation twins (28), "the curfew" (22); each read by script as true where it prints.

Batches 2 and 3 share one after run (b1 → b3). Every other line that moved is the cure's own: the consequence lines ("Nothing large is settled in the hall without bargaining with them first." and its two arrangements, 49+44+54 → 34+34+45) leave with the truce row they followed; a list that named the Thieves' Guild beside another power now names the other alone ("The Religious Authorities are at odds with it.", +6); and where no estranged power is left, the record's own vignette (`powerStructure.recentConflict`) prints as the composer's designed fallback ("Several merchants have been found murdered this season, and people say the guard is doing nothing about it.", +3; "# guild masters are having each other's warehouses robbed. Both deny it publicly. Both are losing patience.", +1), read where they print as the record's own vignette.

Guards (one collected test a batch; every cured pair red at its base, every keep green): `tests/components/tailDisplayCivicBatch1.test.jsx`, `tests/components/tailDisplayCivicBatch2.test.jsx`, `tests/domain/tailDisplayCivicBatch3.test.js`, `tests/components/tailDisplayCivicBatch4.test.jsx`.

Gates after every batch: eslint on the touched files, `typecheck:domain:strict` (1113 = ceiling), `typecheck:ratchet` (167 = ceiling), `presumed-things-door.mjs --check` (fresh 147 = the base's 147), `page-census.mjs --grid` (2 falls = the base's 2: r2r-city-0 P7a, r2s-insurgency-metropolis-0 P7a). The test files that name the touched files: the reds CARRIED from the joined line, each red at f663a2699: `r3c9ReaderLinesTrue` n15, `powerStateProseDesk` (two), `phoneChromeFloor.census` (/create /settlements /gallery floored +1), `proseNumerics` (SummaryTab.jsx lines moved); the lint walkers over src/domain/display (factLayers, observedShapeReaders, presumedThings, proseWiringCensus, tuningRegister, writerReach: 15 tests) fail identically at the base and name none of this seat's files.

## The veto list: every new or changed line, with the towns it was read in

| line | read in |
|---|---|
| Foundations "Public legitimacy" prints the record's label: Legitimacy crisis / Contested / Tolerated / Approved / Endorsed | r2r-hamlet-0 (hamlet, siege: Legitimacy crisis), r2s-infiltrated-thorp-0 (thorp: Tolerated), r2r-city-27 (city: Endorsed) |
| "{place} is governed by {ruler} under the Occupation Authority." / "{Ruler} governs {place} under the Occupation Authority." (and "… governs under the Occupation Authority without a head.", "… under the Occupation Authority. No one is named to its seat.") | r2r-thorp-1 (thorp), r2s-occupied-town-0 (town), r2s-occupied-metropolis-3 (metropolis) |
| the adverse safety cause "insecurity" ("Insecurity is the reason.", "Poverty and insecurity have cost it its standing.", …) | r2r-thorp-10 (thorp, monster raids), r2s-under_siege-town-0 (town, siege), r2s-wartime-metropolis-3 (metropolis, war) |
| the adverse safety cause "the curfew" (an occupation curfew alone) | r2r-thorp-1 (thorp, occupied), r2s-occupied-metropolis-3 (metropolis, occupied), r2r-thorp-24 (thorp, occupied) |
| the Web's "stable" chip is not printed over a high quarrel of the pair (the pair and its narrative print) | r2s-occupied-town-3 (town, occupied), r2r-city-1 (city), r2r-city-10 (city) |
| the criminal truce row is not named "at odds with it" | r2r-city-56 (city), r2r-metropolis-44 (metropolis), r2r-metropolis-59 (metropolis) |
| "Ruling authority" capped: at most Strained under a legitimacy crisis, at most Adequate under a contested one | r2r-thorp-58 (thorp: Adequate → Strained), r2r-hamlet-0 (hamlet, siege: → Strained), r2s-succession_void-hamlet-1 (hamlet, succession: → Strained), r2s-plague_onset-thorp-3 (thorp, plague: Surplus → Adequate); the cap reaches no metropolis in the census |

The chair's (3) in X8, "prefer the label's own one plain word": not taken. The crisis labels name their cause in phrases ("Famine Conditions", "Active Siege", "Aftermath of Betrayal", "Plague Unrest — Plague Conditions", compound "+" labels), and a word table for them would cost more than the reword; it would also say "famine" beside the food cause's "hunger".

## Rows struck (true by the record), with why

- **07065** "Economic Resilience Strong" (314 towns): the row bands `defenseProfile.scores.economic` at the 65/40/20 cuts (`defenseScoreBands.js`). The score is the SUSTAINS parts (stores in hand, hospital, market, purse, food chains) less each crisis's take (`defenseGenerator.js :: computeDefenseScores`). Recomputed from the record it equals the stored score in all 720, and all 314 printing towns are ≥ 65 (9 of them besieged: a siege with 6.5+ months of stores in hand sustains its force). Prosperity and the food deficit are other facts.
- **X4 counts** ("Institutions behind this power (32)" over 29, "The Powers (5)" over four, "Critical Issues (3)" over two, "Lodging(2)" over one, the Systems Health "Safety" row bare): each count is its list's length in the code (`PowerStrata.jsx`: `support.length`, `roster.length`; `ViabilityTab.jsx`: `criticalIssues.length`). The census dump drops a line already printed in its section (`render.census3.jsx`, its per-section `seen` set), so a house behind two powers, or a repeated value, reads as missing. All 28 bare "Safety" rows have the value "Moderate", printed just above as the Prosperity. **For the instruments:** a reader of these dumps sees a deduped list.
- **09758 09761** "Governed by {ruler}" under an occupation: the line reads "Governed by {ruler} · Suppressed (under occupation: resistance simmers)" (`settlementQuickGuide.js :: governsLine`); the fold split at the "·".
- **B20892 B20909 B20834 B20852 B20819 B01702 B01911 B01913** (the seat's title, "the head shepherd and Headman"): the NPC's `role` is that title and they hold rank 1 of the ruling power (`memberships`), true in each town read; the readers' PEOPLE line gave the first title only.
- **04908 10188 13395 07168 10187** ("Church Council~Religious Authorities stable" beside "the two keep quarrelling" / "at odds with it"): no high conflict of the pair in the record; the chip's glyph "~" is the relation's type, Tense, and "stable" says the quarrel holds steady, which the prose bears out.
- **20721 20719 19722** ("The hall is at odds with the Military/Guard" beside "Elder Council~Military/Guard stable"): the relation's type is `tense` (the "~" glyph, "at odds"), and "stable" is its direction, so the two agree.
- **23301** "Uncontested" (9 towns): no power and no claimant contests the seat in any of the 9 (7 vacancies with an acting keeper, 2 held).
- **Gone at the base** (the third landing): B20985 B21022 B21327 B20135 (heraldCausalGrammar.js).

## Rows named for other groups, with their measure

| rows | writer (group) | what is false, and the cure that belongs there |
|---|---|---|
| B07041 B05720 B09553 B09557 B14868 B14869 B09552 B09556 B14848 B14855 B09895 B09901 B27913 B22268 B22149 B22144 B22175 B12247 (World/History "Current Tensions", Plot Hooks), 10722 B15436 B15115 B03548 B08924 B14403 B15437 B16654 (Overview camps) | `src/data/historyData.js` via `history.currentTensions` (HISTORY / generator) | each prints the record's own current tension (verified: the fold is in the town's `currentTensions` in every printing town). The tension pool draws past-tense events ("Great flood", "Plague years", "Heresy trial") and camps ("Price regulators" in a thorp of 7) that `historicalEvents` never holds and the town's size cannot bear: a DECLARED MOVE for the history generator (gate the pool by size and the past, or phrase as a tension) |
| B02506 (a fire "in the lower districts") | `generators/historyGenerator.js` / `history/historyRouteContext.js` | 14 of 20 printing towns hold no such tension: the description's writer |
| B11732 B11731 B11718 B11664 B11737 B11650 B11660 B11686 B11692 B11682 B11665 B11679 B11666 B11673 B11711 B11653 B11695 B11693 B11670 B11645 B11663 B11669 B11671 (Traditions "Kept in …" under a plague) | the traditions writer (X5) | MEASURED: the 23 rows print 378 times in 264 towns; under the plague 28 printings in 9 towns (all 28 plague towns' Traditions tabs are silent on the plague). "Kept in {window}" is the calendar, true; the display withholds nothing. DECLARED MOVE for the generator: a tradition's "Last held" outcome under a plague (gatherings suspended) |
| B12521 (89 towns) B13860 B18039 13199 06464 13370 ("{power} no stake yet") | `src/domain/crisis/crisisCast.js`, `crisisPage.js` (CRISIS) | a power the record's quarrels or the crisis's own choice name is said to have no stake |
| B11070 B11113 B11121 ("takes the worst of it", "holds the key to it") | `src/domain/crisis/crisisHooks.js` (CRISIS) | the person named is not of the house named (PEOPLE) |
| 09930 09967 09931 10594 06903 10575 09968 10600 09883 10588 ("X vs Y High" beside the same pair symbiotic/stable) | `generators/factionDynamics.js` (relations) vs the conflicts writer | RECORD INCOHERENCE: `factionRelationships` gives the pair symbiotic/stable where `conflicts` gives it high. Batch 2 stops the "stable" chip from printing over the quarrel; the two record fields are the generator's to reconcile |
| 07646 16740 23138 03799 ("Feudal Appointee~Thieves' Guild escalating" beside "leave each other alone"), B12623 B14083 | `factionDynamics.js :: govCriminalRelation` (direction) vs `criminalCaptureState`; `src/data/people/dmPowerLines.js` | RECORD INCOHERENCE: the criminal row's direction "escalating" at the truce rung "equilibrium" |
| 14552 (and its 11 sibling folds "No one here works the {raw} near {place}.", 197 printings) | `economicState.localProduction` (economy generator) | RECORD INCOHERENCE: in 138 of the 197 printings `localProduction` lists the raw that `resourceAnalysis.exploitation` calls unexploited; the Resources tab prints both ("Unexploited Stone"). The gap line (`validationOnPage.js`) agrees with the exploitation record; not silenced |
| 05688 B00530 00587 26926 B07353 B28204 20796 | `src/data/npcData.js`, `src/data/people/goalFamilies.js`, `src/data/people/dmPowerLines.js`, `domain/people/*` (PEOPLE) | NPC constraint, relationship and goal lines claim offices or houses the roster does not give |
| B01667 ("the alewife" for a man) | the institution title writer (`generators/people/mintTitles.js` / institution data) | a gendered house title on a male holder |
| B11922 ("Legal Infrastructure Court only") | `src/domain/display/defenseDisplay.js` (DEFECON) | no court on the roster |
| B00937 ("a quiet hamlet") | `src/data/dossierStateProse/defense.generated.js` | beside a regional monster threat |
| 15073 B14249 ("Nothing at {place} protects the {seat} now") | `src/data/dossierStateProse/power.generated.js` | the seat is the strongest power / has a symbiotic guard |
| B11462 ("founded to trade by water"), 20609 ("the gap is closed through the tracks") | `generators/narrative/settlementOriginProse.js` | a founding reason and a food line the record contradicts |
| 12547 ("run by patronage and law") | `src/domain/summary/settlementQuickGuide.js` | governed by household consensus |
| 23195 ("Trade connectivity Collapsed" in a prosperous trading city) | `src/domain/causalState.js` (the causal model) | 2 towns |

## What is left of this worklist (this seat's files, not cured)

- **21394 21466** ("church guidance" / "church sway" beside the ruling power, 4 towns): `src/domain/display/governingModifierWords.js`. The faith family is borne out by `factsOf(...).sacredHouse`, and the thorp has only "access to a parish church". Whether `sacredHouse` counts an outside church is UNVERIFIED; it is the next batch's first read.

## Registers named stale, guards owed

- No register re-taken (none of this seat's batches moved a pinned register: the presumed-things, grid, domain-strict and type ratchets read equal to the base).
- Guard owed to the instruments: the census dump's per-section dedupe (render.census3.jsx) misleads a reader on counts and repeated values (X4).

## How the instruments are re-made

`git archive origin/lane/chair-2026-11-08 docs/chair/2026-11-14/probes/READ-ALL docs/chair/2026-11-14/read-all/WORKLIST-DISPLAY-CIVIC.json | tar -x -C <scratch>`; `git archive origin/lane/census-3-2026-11-14 docs/chair/2026-11-14/probes/CENSUS-3 | tar -x -C <scratch>`; a scratch worktree at the commit with `npm ci`; `sh <scratch>/…/CENSUS-3/census3.sh <worktree> <out> 4`; `python3 -I inventory.py <out> <inv.json>`; `python3 -I inventory_diff.py before.json after.json <rows.json>`.
