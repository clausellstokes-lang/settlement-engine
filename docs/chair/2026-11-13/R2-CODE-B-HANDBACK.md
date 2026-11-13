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
| 4c crisis cast (defender, treater) | #328 #855 | — | NOT STARTED in code (paused); exact next step below |
| 4d "The Market Contest" | #536 | — | NOT STARTED in code (paused); exact next step below |

## Stops and parked items (with recommendation)
- **#939** — "11 institutions critically impaired by siege: …, Taverns (5-20), …": written by `viability.js :: issues` (`critical.map(d => institutionDisplayName(d.institution))`). The switch: read `institutionHouseLabel` (or `houseInProse` in a sentence). Recommend: the lane that next holds viability.js takes it.

- **#883** — the Defence tab's food endurance ("carries the town for a few weeks at full rations, a few weeks on half" at three days of stores): `defenseDisplay.js :: monthsInWords` (the third leaves seat's file). The switch: for a span under a month, read `tonightSheet.js :: storesSpanWords` (the one home, item 3).

## THE EXACT NEXT STEP (where the seat stopped, 2026-11-13 ~16:10 UTC, on the chair's pause)
Tip at the stop: see the last commit of the branch (this file's commit). Scratch worktree: a local branch `r2b` at the tip; the base render of the 740 (`out-base/`, dumps + gzipped records) and the per-row counter `measure.mjs` live in the seat's scratchpad and are lost if the container goes — a resumed seat re-renders the base (about 60 minutes at 4 workers) or measures from the census's `render.census.jsx` with the app-shape `cfgFor` described above.
1. **4c, #328** ("defends: no military, garrison or watch stands" beside "Defence: Adventurers' charter hall"). Two homes: `crisisCast.js :: defenderCandidates`'s house fallback is its own regex (`/garrison|barracks|watch|militia|wall|guard/`); the Tonight sheet's "Defence:" line reads `defenseFactsOf(s).defenceNames`, i.e. the buckets of `domain/institutions/defenseInstitutionBuckets.js :: partitionDefenseInstitutions` (walls, garrison, militia, watch, mercenary, charter). Cure: the fallback filters `liveInstitutions(s)` to the members of those six buckets (roster order kept, rows keyed by `str(i.name)` as now). CARE: the cast is WRITTEN at generation (`generators/steps/resolveCrisisCast.js`), so records move (`stress[].cast`): births field diff base vs tip, declared. CARE 2: `CAST_REASONS.defenderInstitution` ("the town's defence, …") is declared `tier: >= town` in `docs/census/declarations/CRISIS_CAST_REASONS.json`; in the hamlet of #328 the row it would add is refused by that declaration unless the reason has a twin true below town ("the defence, with no one on the roster leading it") — a new reason string needs its row in that declarations file through its door.
2. **4c, #855** ("would treat: Zuma Kanil · a merchant, with the seat itself in dispute" — the master smith). `treaterCandidates` gives every member of a MERCHANT-archetype power `CAST_REASONS.treaterMerchant`. Cure: the reason "a merchant" only where the person's own role is trade; else a twin "a member of a merchant house, with the seat itself in dispute" (the code comment's own words), registered in the same declarations file. Pins: tests/domain/crisisCast.test.js (:133, :438-443), tests/generators/people/castDerived.test.js (:54).
3. **4d, #536** ("The Market Contest" where no market stands). The name is born in generation: `src/domain/traditions/genesis.js` composes a domain ("Market") with a noun from `src/data/traditionCorpus.js` (`contest`). Cure: the market domain is disqualified where the market fact (`facts/market.js`, `factsOf(s).market`) is false, and a refused pick resolves draw-free to the next admitted domain (no draw added or moved: prove with the fork census `habitForkRegistry`). genesis.js is not on any lane in flight (checked 14:55 UTC). Records move: field diff, declared.
4. Then mechanisms 5 (size: settlementQuickGuide.js's `scopeAgainstRecord`, read `tier` and `populationBand`, ruled words above), 6, 7, and the final statement, as the brief orders.

## The chair's rulings received
- 15:52 UTC (read 16:01): THE ACCOUNT'S WEEKLY ALLOWANCE IS IN ITS WARNING BAND. PAUSE: finish only the mechanism already under way (mechanism 4), push it, keep this file current with the exact next step, then STOP and wait for the chair's word. No new mechanism, no whole suite, no final statement. One line to the chair with the tip when stopped.

## Calls taken without the chair
- Took `src/components/new/SupplyChainsPanel.jsx`, `src/pdf/sections/Services.jsx`, `src/domain/display/institutionDisplayName.js` (one new export) and a new leaf `src/domain/display/chainHouses.js`: no lane in flight changes them, none is named to another seat.
- Re-recorded, each with its cause in the commit: the phone chrome floor ROUTE_BASELINE (-1 ×3), the dossier phone floors World/NPCs (-2), three address-only rows of the prose-numerics baseline.

## New words (for the owner's veto)
- Items 1a/1b remove words; the house label is the existing label minus its bracket.
- Item 3: the stores span "less than a day", "about a day", "about N days", "about N weeks".
- Item 4a: "No neighbours or ties between people are recorded for this settlement." (the old line less its last claim).
