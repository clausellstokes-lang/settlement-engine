# REVIEW-W2-C-LEAVES — step 1: every new or reworded line of the stage, read where it prints (2026-11-14)

By REVIEW-W2-C-LEAVES, an independent reader of `lane/w2-c-leaves-2026-11-13`, for the chair (session_01ACmDYZrFEVXyZEUg1NDxxC).
- **Tip read:** da7a567f4 (origin's tip when I began).
- **The stage:** the lane's own commits after d79ea4c70, with its two side branches (merges 6a42e039d and 1c36c1717) and the resolution of the line's merge baa4b707d.
- **Status of this file:** I fix nothing. It was written and pushed BEFORE I opened the lane's hand-back or statement. Every figure is from my own run unless marked otherwise.
- **Marks:** EXECUTED means run and read. PLAUSIBLE means read from code, not run.

**What I saw of the lane's own words before this push, stated:**
- My first `git log` printed the subjects of three commits: da7a567f4, bbb68f0a9 and cf07a0c1a. They carry no claim I used.
- `git show --remerge-diff baa4b707d -- src/domain/goods.schema.js` printed, inside its conflict markers, the subjects of 8c5e90ff6 and 976db5b19.
- Nothing else: no hand-back, no statement file, no other commit message.

## How the lines were found and read (EXECUTED)
- **The base the stage is read against:** `basep` is d79ea4c70 with the line's 976db5b19 merged in. The conflicted files are taken from the line: `docs/content/wiring-census.json`, the edge bundles and `tests/components/phoneChromeFloor.census.test.js`. None of them renders.
  - `basep` and the tip differ in `src/` in exactly the 21 files the stage's own commits change, so a page diff of basep against the tip is the stage's own change and nothing of the line's.
  - A first diff against bare d79ea4c70 moved the Power, NPC and Relationship tabs, which is the line's work. It was dropped for that reason.
- **The towns: 1,824 births, plus 4.**
  - The census's 720 (`r2r-`, `r2s-`, the census's own `cfgFor`).
  - The app-shape 816 (`rr3-<size>-<calm|stresses>-<rand|port>-<i>`: `selectedStresses` with `selectedStressesRandom:false`, every crisis kind, 48 each).
  - 288 fresh app-shape towns of my own (`rr3w-<size>-<under_siege|famine|occupied|under_siege+famine|calm|wartime>-<isolated|river|port|rand>-<0|1>`).
  - The 4 towns of the last read's findings: rw3-city-infiltrated-1, rw3-city-famine-1, rr2s-city-calm-rand-1 and rr2s-hamlet-under_siege-rand-1.
  - Each was rendered at basep and at the tip through the tree's own `OutputContainer`, every tab clicked and every disclosure opened (REVIEW-R3-STAGES `render.rr3s.jsx`, unchanged).
  - The PDF text (`SettlementPDF`, canon dossier) and the Foundry journal (`buildJournalPages`) were dumped from the same records (REVIEW-R2-STAGES `surfaces.census.jsx`, canon only).
- **The new lines:** every line that prints at the tip and not at basep in the same town, view and section (`linediff.mjs`). Tab: 15,879 new lines, 22,048 gone. PDF: 3,943 new, 23,175 gone. Journal: 2,494 new, 2,709 gone.
  - New lines are grouped into families (`families.mjs`). The diff lists no family outside the stage's own surfaces (Economics, Resources, Defense, Magic, the PDF and the journal).
- **The readers:** five helper readers, one per surface: Economics trade and food; Economics flows; Resources; Defense and Magic; the PDF and the journal.
  - Each was given the scale (`readers/SCALE.md`, the readers' kinds (a) to (h) and the severities), the towns, the lines and nothing else.
  - Each read every family by script in every town it prints in, and by hand in its smallest town, its largest town and a crisis town.
  - Their results and scripts are under `probes/REVIEW-W2-C-LEAVES/readers/`.
- **My own checks of their returns** (each EXECUTED by my own query, and each agreeing with the reader):
  - Defense: r2r-town-4, rr3-town-occupied-rand-3, r2r-metropolis-0 and r2r-metropolis-25. The 18 towns with a governing criminal power I counted myself.
  - Economics flows: r2r-hamlet-6, r2r-metropolis-14 and rr3-town-infiltrated-rand-2.
  - Resources: r2r-village-5, and r2r-thorp-48 (found by me before the readers).
  - Trade and food: rr3-village-famine-rand-0, plus 5 towns for the carried check.
  - Surfaces: r2r-hamlet-0 and r2r-thorp-16.
  - A separate finding of my own: the port food sentence under a siege (10 towns).
- **Own or carried:** a family is THE STAGE'S OWN when its false item did not print in that town at basep. It is CARRIED when the false item (the pill, the clause, the note, the sentence) printed there at basep too.
  - This was checked at basep in the example towns of each false family. It is not checked town by town for every pill.

## The false lines, ranked (step 1's verdicts; detail and every family in the table below)

### HIGH, the stage's own
1. **"Criminal structure: Semi-organized networks. Criminal activity is coordinated enough to maintain routes and territories but lacks a single controlling authority. Several gangs may be competing…"** It is false in 36 of the 289 towns where it is new.
   - The cause is `defenseDisplay.js :: deriveCriminalStructure`, `rivalRingsHere`; `corruption.js :: rivalRingsOf`.
   - In 18 of the 36, a criminal power GOVERNS the town; I counted these myself. Example: r2r-metropolis-0, whose same section prints "Underworld: Shadow Senate · Dominant" (one criminal faction, governing, power 39).
   - In the other 18, a thieves' guild runs the trade by the page's own operations list. In r2r-metropolis-25 the next sentence reads "The thieves at Mönkhköl answer to a guild, and the guild decides who works which streets."
   - The crime prose drawn with the new key is false in the same towns. It says "Rival crews at {N} are fighting over who runs the streets…", "…who it is changes by street and by season", "…no head".
   - The base printed "Organized syndicate", which was true. The same key reaches the PDF and the stored publicProse (`defense:criminal.*`). Kinds (c) and (g).
2. **"The {resource} in {N}'s country is worked all the way through: the ground gives it, {House} finishes it, and it leaves as {good}."** (Resources tab, the economy prose.) It is false in 34 of the 41 towns where it is new.
   - Example: r2r-village-5, a village of 117: "Fishmonger finishes it, and it leaves as preserved fish". The town has no fishmonger and no fish house, and its exports are Sea salt, River craft and Cargo barges.
   - Livestock "leaves as leather goods" in 12 of 12 towns, and none exports leather goods. Grain "leaves as bread" in 11 of 12, which export milled flour.
   - It prints because the stage re-files the cards (`validationOnPage.js :: exploitationForDesk`), which hands the prose to the record's fullyExploited row. The sentence never printed in these towns at basep.
   - The bare catalogue name ("Fishmonger finishes it") is a slot filled as if it were a person. It is written into the stored publicProse too (`economy:resources.exploitation`). Kinds (a), (c) and (h).

### MEDIUM, the stage's own
3. **The Legal Infrastructure row now reads the roster (`defenseDisplay.js :: courtOnRoster`).**
   - "Legal Infrastructure: None. No deterrence beyond force." is false in 86 of 86 towns where it is new. Example: r2r-town-4, whose own Guard assessment says "Offenders the town watch catches go before the court", while the record holds `hasCourtSystem: true`.
   - "Prison only. Detention without process. Arbitrary enforcement." is false in 19 of 19, beside "…are tried at the court and held in the prison" (rr3-town-occupied-rand-3).
   - The base printed "Court only" and "Court + Prison", which agreed with the page. Kind (g).
4. **The counts of the Economic Flows section leave out the service cards the stage now marks Impaired (`serviceStateShown`).**
   - The header "(# active · # impaired)" is wrong in 80 of 200 towns. r2r-metropolis-14 says "22 impaired" and prints 26 Impaired chips.
   - The "Issues (#)" filter counts are wrong in 26/45, 47/48, 5/13 and 2/3 towns across their four families. Kinds (e) and (g).
5. **The siege port's food sentence.** A port with docks under a siege prints "{N} grows … and ships bring in about a third of the rest" with "+ {n} imported" in the stat row, in 10 of 10 such towns.
   - On the same tab the stage withholds the Imports list and marks the Harbour and Maritime chain Impaired, and the Defense tab says "Field work and trade have stopped".
   - Example: r2s-under_siege-city-0. The siege's own line says only "nothing comes in by road", so the sea may be open. The fault is that the page's places disagree. Kind (g). EXECUTED by me.
6. **A resource card re-filed "Partial" beside the Economics tab's "The {resource} around {N} goes unworked; no house takes it up."**
   - Medicinal herbs: 12 of 72. Example: r2r-thorp-48 (Huawan), card Partial, Economics "goes unworked".
   - Mountain timber "Partial" beside the same tab's "Depleted": 3 of 17. One "Unexploited Fish" beside fishing worked.
   - The stage moved the card; the general desk (`generalStateProse.js :: craftReasonPoolKey`) still reads the raw bucket. Kind (g).
7. **The economy prose the re-filing newly prints:**
   - "This is the trade the {T} is actually built on…": 44 of 52 false. Example: rr3-metropolis-religious_conversion-rand-3, "built on" livestock at 4% of its income.
   - "…takes the easy half of this trade and sells the rest…": 16 of 76.
   - "…works part of the line that X could support…": 12 of 26.
   - "{X} leaves {N} half-finished, and nobody … is troubled by it.": 11 of 27. Example: r2s-succession_void-city-1, wool "half-finished" beside weavers, a dyer and tailors who export dyed cloth.
   - "There is X out there and nobody has ever thought it worth the trouble…": 2 of 4.
   - Kinds (b) and (c).
8. **The PDF's "LOCAL PRODUCTION: None recorded" beside its own EXPORTS of raw goods: 68 of 217.**
   - Example: r2r-thorp-16, where the exports print Raw wool, Live sheep and Coal.
   - The stage's local-production reader drops the goods that its export reader keeps. In that town no house works them, so the false side is the export pill (carried, below). Kind (g).
9. **Military Contracts "Impaired" (a service card) where the Mercenary quarter it runs through is not impaired on the Institutions tab: 2 of 52.** Kind (g).

### HIGH, CARRIED (false at basep too; whose file writes them)
10. **The Foundry journal names every supply chain "Chain"**: "- **Chain** *(impaired)*", 23,653 lines in all 1,824 towns.
    - The writer is `src/pdf/lib/viewModelBodySlices.js`: `name: c?.name || c?.chainName || 'Chain'`, while the record's chains carry `label`. The line is `src/foundry/journalPages.js :: economicsPage`.
    - The stage reworded this line's state and left the name. Kind (h).
11. **"Outputs: Master-crafted weapons"** on an Iron & Metalwork card whose only houses are a mine: 21 of 21.
    - Example: r2r-hamlet-6, a hamlet of 57 with "Mine (open cast)". At basep the row was "Quality tools and weapons, Advanced weapons and armor, Master-crafted weapons".
    - The stage's `chainOutputsShown` took two out and kept the third: the good has no row in `MADE_GOOD_ROWS`, so the mine's name passes as its maker. The same pill prints in the PDF, which prints the raw outputs. Kind (a).
12. **The PDF prints the record's chain state, not the tab's.** See "The lane's three-surface claim" below.
    - 200 towns print "Active" or "Entrepôt" under a siege or famine on a chain the tab and the journal call Impaired. Example: r2r-hamlet-0, "Grain & Bread · Active" beside "Field work and trade have stopped".
    - The writers are `src/pdf/sections/SupplyChainFlow.jsx` and the Services chain cards, which are unchanged by the stage. Kind (c).
13. **Exports under a famine list the food that failed: 12 to 13 towns on the tab and the journal.**
    - Example: rr3-village-famine-rand-0 exports "Raw wool, Livestock" beside "The herds failed this year" and its own Livestock card Impaired.
    - The pills printed at basep (checked in 5 towns). The stage's `pillAsPrinted` keeps a raw good that no maker chain carries. Kind (c).

### MEDIUM, CARRIED
- The need sentences name "gate control" where the town has no walls or gates (79 towns). The services come from the record's `dependency.affectedServices`; at basep they printed as "· affects: …".
- The isolated need sentences:
  - "…run on stored {goods}: no trade road reaches {N}." and "…brought in by magic: no trade road reaches {N}." are false in 64 of 64 towns. They sit beside the Imports list of the same goods and beside "{N} is too poor to mend its road" (rr3-town-infiltrated-rand-2).
  - At basep the same contradiction printed as "Needs Iron - No trade access: running on existing stockpiles only."
- The "Needed, and not brought in" line:
  - The same item is listed twice in 29 towns at basep and at the tip (r2r-village-4: "timber, luxury goods, timber, mountain timber").
  - "livestock" is listed beside a dairy farmer and common grazing land in 4 towns.
- Magic notes on the wrong ground (the note's text printed at basep, then with its recovery chip):
  - "Druidic forest management…" on reed and marsh: 29 of 64.
  - "Conjured game produces fish": 12 of 12.
  - "…depleted farmland" on salt: 13 of 84.
  - "Arcane quickening of growth" on salt: 4 of 46.
  - Druidic notes on Magically Sustained cards under a siege: about 15.
- Chain output pills with no maker house:
  - "Milled lumber" with only a thatcher: 9 of 26.
  - "Dyed cloth" with only a fuller: 4 of 7.
  - "Ship construction" or "Ocean-going vessels" with no shipyard: 7.
- The Resources prose's strategic frame, which printed at basep in the same towns (the paragraph is new only because the exploitation sentence beside it changed):
  - "…whoever holds the ground holds what the assessment below names": 77 of 77; no assessment prints.
  - "…could not keep it against anyone who came for it" in a "Fortress": 33 of 61.
- The PDF and journal resource rows "Timber » – » – partial" beside a standing sawmill: 131 towns.
  - The stage's moved card prints no processor (`viewModelBodySlices.js`). A dash is silence, so I rule it LOW, against the surfaces reader's MED.

### LOW (the stage's own, or doubtful)
- "No one here works the stone near {N}." is new by the stage's ruled data cure (`chainWorking.js :: NOT_WORKED_THROUGH`, a brickmaker or walls do not quarry). The Economics tab still prints a Stone & Construction chain running through the Brickmaker: 18 to 22 of 55.
  - The line is true by the ruling; it is the chain card that says otherwise. Listed for the chair's ruling (§ rulings in the review).
- "PartialTimber": 86 of 184 have a sawmill and carpenters standing.
- "PartialAnimal hides": 20 of 65.
- "UnexploitedMedicinal herbs": 13 of 22, beside "Complete production chain in place".
- The import label "Precious metal veins" on the PDF and the journal (the tab and the record say "Precious metals"), in 249 towns. "River fisheries" and "Coastal timber" labels.
- Exports "Smoked seafood / Fish oil" in inland river towns: 66 to 72.
- "Bulk food exports" in thorps and hamlets.
- "Divine provision" with only "Access to parish church": the record cannot settle it.

## The last read's findings at this tip (step 1's own births; the rows the lane claims are read at step 2)
- **Finding 1, the half-way line by kind: CURED.**
  - On the 720, 17 half-way lines remain; I read all 17 against their rosters. None stands beside a house of the finishing trade.
  - Two are doubtful, LOW and carried: a bowyer beside the timber line in r2r-village-29, and a bathhouse beside the hot-springs line in r2r-town-30.
  - Its own towns: rw3-city-infiltrated-1 and rw3-city-famine-1 no longer print the line (born at basep they still do).
- **Finding 2, "Needed, and not brought in" naming goods made here: CURED by its matcher.**
  - My own wider matcher (exports, the raw local-production list, the grounds and working chains, and 13 maker houses of my own list) finds no need met by an export, a working chain or the raw local list.
  - It leaves the 4 livestock-beside-a-dairy lines and the duplicates above. rr2s-city-calm-rand-1 no longer lists spices.
- **Finding 4, the 8 true lines lost: RESTORED.** All 8 towns print "No one here works the stone / medicinal herbs near {N}" again at the tip, and none at basep.
- **Finding 8, the imports under a siege: CURED BY SILENCE.** No Imports header or pill prints under a siege on the tab, the PDF or the journal, in any of the 1,824 towns (the surfaces reader's count: 0).

## The lane's three-surface claim (the brief: "the PDF, the journal and the tab print ONE trade list and ONE chain state"), EXECUTED on 1,824 towns
- **Trade lists: TRUE in the goods.**
  - The PDF and the journal are identical in all 1,824 towns.
  - They differ from the tab only by three display labels: "Precious metal veins", "River fisheries" and "Coastal timber". This is the case in 150 towns' exports and 249 towns' imports, and never in a siege or an occupation. The PDF and the journal are the false side.
- **Chain state: TRUE for the journal, FALSE for the PDF.**
  - The journal matches the tab in every chain (23,653).
  - The PDF disagrees in 720 towns: 198 sieges, 82 famines, 35 occupations, 111 calm, the rest other crises.
  - It prints "Active" or "Entrepôt" under a siege or famine in 200 towns, and "Active" on 521 chains whose only house is a neighbour's. Its "K impaired" group headers count the pre-crisis state in 121 towns.
  - The PDF's chain writers (`SupplyChainFlow.jsx` and the Services cards) do not read `chainAsShown`.
- **Chain outputs: the PDF prints more than the tab in 1,453 towns (2,390 cards).** The PDF is the false side; it prints the raw outputs.
- **The revert of a2eaf6a6a by bb2002626 is WHOLE.** `git diff a2eaf6a6a^ bb2002626` on its five files is empty, no other commit touches them, and they are byte-identical at d79ea4c70 and the tip.

## The stage's lines, from the diff (step 1's catalogue: file, function, the line, the condition it is declared under)

| id | surface | file :: function | the line (new or reworded) | declared under |
|---|---|---|---|---|
| E1 | tab Economics, chain card | `chainStateShown.js :: chainCrisisStateShown, chainStateShown, chainAsShown`; `EconomicsTab.jsx :: EconomicFlowsSection` | the chain's state chip: "Impaired" in place of "Running"/"Operational"/"Entrepôt"; or NO chip | impaired: a famine in force and the chain works the failed food ground with its own carrier; a siege in force and the chain is field work (own carrier, a land ground, the sea open only to a port's fishing/harbour) or trade (entrepôt, transit, bought). No chip: the chain's houses stand only as "Access to …" |
| E2 | tab Economics, chain card | `tradeListDisplay.js :: chainOutputsShown` | the card's Outputs pills, each borne out by a house here | an output is kept when a live house of the chain (or the good's maker house) stands, or the good is of a ground the chain works itself |
| E3 | tab Economics, chain card | `chainNeedShown.js :: chainNeedLine` | (a) "{Services} here depend on {goods} brought in, which a siege, a closed road or a blockade would cut off." (the clause on the first card only); (b) "{Services} here depend on {goods} from outside, which the siege has cut off." (needs `crisis: under_siege`); (c) "{Services} here run on stored {goods}: no trade road reaches {name}." (isolated, critical); (d) "{Services} here depend on {goods} brought in by magic: no trade road reaches {name}." (isolated, not critical). Replaces "Needs {resource} - {impact} · affects: …" | the dependency's house is live and not access-only, works the chain, has services, and a good it needs is among the imports as printed |
| E4 | tab Economics, chain card | `EconomicsTab.jsx` | the "{n}% recovery" chip removed (machinery) | — |
| E5 | tab Economics, service flow card | `chainStateShown.js :: serviceStateShown` | the chip "Impaired" in place of "○ Operational" | every house of the service is impaired (`computeChainSets`) |
| E6 | tab Economics, Food Security stat row and bar | `foodRowShown.js :: foodRowShown` | "Production … + {n} imported … Short …": imports zero where no carrier; the short re-derived; the magic food note only where its tradition holds | trade open = a carrier is named (`carriersOf`) |
| E7 | tab Economics, food sentence | `EconomicsTab.jsx :: foodSentence, carriersOf, GROWN_BANDS, BROUGHT_BANDS` | "{name} grows {share} of what it eats, and {ships bring / boats bring / carts bring / trade brings} in {share of the rest}."; "{Tradition} provision makes up {share} of what it eats."; "What is grown here[ and brought in] covers each day's food[. / , with nothing to spare against a bad year.]"; "No food comes into {name} by trade." where no carrier; new share words (two/three/four parts in five, nine parts in ten) | ships: a port with docks (also under a siege); boats: a river with docks, a ferry, barge or boat house; trade: a port without docks, a river without; carts: any other route (isolated included); none under a siege (but a port's ships) |
| E8 | tab Economics, food | `EconomicsTab.jsx` | "Agriculture modifier: …", "Stress penalty: ×…", "Trade covers …% of gap" removed (machinery) | — |
| E9 | tab Economics, Trade Profile | `tradeListDisplay.js :: tradeListsAsPrinted, exportsAsPrinted, pillAsPrinted, importsAsPrinted, localProductionAsPrinted, madeHere` | Exports pills (each borne out: a working maker chain, a maker house, or carried "(transit)"; marks "(transit)", "(naval route only)", "(taxed by occupation)"); Imports header and "No recorded imports." withheld under a siege; Imports pills; "Needed, and not brought in: …" (a need met by a good made here is left out); "Produced locally" pills (each borne out: a working chain's output, a worked ground, or a maker house) | per pill, as stated |
| R1 | tab Resources, exploitation cards; dossier search | `validationOnPage.js :: exploitationCardShown, exploitationGroupsShown`; `ResourcesTab.jsx :: ResourceChainCard`; `DossierSearchResults.jsx` | a card re-filed (Unexploited ↔ Partial) and, when moved, the resource alone (no goods, no "Draws on") | unexploited → partial where the resource is worked (leaf) or its raw good sold; partial/full → unexploited where modelled and not worked |
| R2 | tab Resources, Unexploited card; PDF resources rows | `validationOnPage.js :: housesStillNeeded`; `viewModelBodySlices.js` | "Needs: {houses}" lists only the houses not standing (a finishing trade counts) | — |
| R3 | tab Resources, nearby resources | `ResourcesTab.jsx` | the "Abundant" label withheld under a siege; the grounds print unlabelled | siege in force |
| R4 | tab Resources gap lines; PDF structural gaps | `validationOnPage.js :: resourceGapLines, resourceWorkReading, tradeFinisherHere`; `chainWorking.js :: chainWorksResource (WORKED_BY_HOUSE: an apothecary works herbs, a charcoal burner works timber; NOT_WORKED_THROUGH: fortifications and a brickmaker do not quarry; divine healing and pilgrimage do not gather herbs)` | "Work on the {raw} here stops half-way: no {house} finishes it." withheld where a finishing trade stands; "No one here works the {raw}…"/"The {raw} around {name} goes unworked; no house takes it up." added or withheld by the leaf | as stated |
| R5 | tab Economics desk (economy state prose) | `economyStateProse.js` via `validationOnPage.js :: exploitationForDesk` | the exploitation sentence's pool row and {institution} fill read the cards as shown | — |
| D1 | tab Defense, criminal structure; PDF defense | `defenseDisplay.js :: deriveCriminalStructure, rivalRingsHere`; `corruption.js :: rivalRingsOf` | the "semi-organized" structure row in place of "organized" | two or more non-governing criminal factions, or a "multiple criminal factions" house |
| D2 | tab Defense | `defenseDisplay.js :: ringNoteUnderStreetFighting` | the organized ring's note withheld | the safety label names a crisis and the safety lines say the streets are fought over or unpatrolled |
| D3 | tab Defense | `defenseDisplay.js :: ORGANIZED_RING_NOTES` | "Crime here answers to one ring. It keeps the streets quiet …" declared `tier: ≥ village`; the row's own note below a village | — |
| D4 | tab Defense, supporting capabilities | `defenseDisplay.js :: courtOnRoster` | Legal Infrastructure "Court + Prison" / "Court only" / "Prison only" / "None" and their notes, the court read from the live roster (a courthouse, court buildings, or a court service of a live house) | — |
| D5 | tab Defense, supporting capabilities | `defenseDisplay.js :: navalRowStandsOn` | the naval row only on a port route or a blockade | — |
| D6 | tab Defense, supporting capabilities | `defenseDisplay.js`, `facts/magic.js :: defenceHoldsArcane, recordNamesAMage` | the Arcane Support row removed (practitioners listed but the defence holds no arcane; or "None" beside a mage the record names) | — |
| M1 | tab Magic, roles | `MagicTab.jsx :: roleRowShown`; `facts/magic.js :: economyShowsMagic` | "Economic role: absent" withheld where an export or income is magical; "Military role: absent" withheld where the defence holds arcane | — |
| M2 | tab Economics, chain card | `magicProvisionShown.js :: magicNoteShown` | the chain's magic note withheld where its tradition is not held | — |
| P1 | PDF, Economics & Trade | `EconomicsTrade.jsx` | EXPORTS / IMPORTS / LOCAL from the tab's lists; IMPORTS and "None significant" withheld under a siege | — |
| J1 | Foundry journal, Economics & Trade | `journalPages.js :: economicsPage` | Exports / Imports from the tab's lists (Imports empty under a siege); each supply chain's state from the tab's reader (none printed where the tab prints none) | — |

## Every family read, its towns and its verdict (the five readers; "own or carried" by me)

A family is the new line with the town name, the figures and the goods folded out; "prints in" counts the towns where it is NEW at the tip. Families TRUE in every town read are listed too.

### Economics tab: Trade Profile and Food Security

| family | prints in (towns) | verdict | false towns | severity · kind | own or carried | example (town: the fact) |
|---|---|---|---|---|---|---|
| TRADE-PILLS: {pills} | 972 | MIXED | 151 | MED a,c | CARRIED | r2r-hamlet-16: famine in force; record foodRecord.failedSource='fish' (the fish failed); grounds for this good: river_fish; chain cards: Fishing & Seafood vulnerable, River Fishing impaired |
| NEEDS: Needed, and not brought in: {goods}. | 354 | MIXED | 51 | MED b,h | CARRIED | r2r-village-4: repeated item: timber |
| TRADE-PILLS: coalSalted fishSmoked seafoodFreshwater catch | 1 | FALSE | 1 | MED a,c | CARRIED | rr3-hamlet-under_siege+famine-rand-0: famine in force; record foodRecord.failedSource='fish' (the fish failed); grounds for this good: river_fish; chain cards: Fishing & Seafood vulnerable, River Fishing impaired |
| TRADE-PILLS: timberBarrels and containersShip construction | 1 | FALSE | 1 | MED a | CARRIED | rr3-town-succession_void-rand-3: no shipyard or shipwright on the roster (only Docks/port facilities, Harbour master's office) |
| TRADE-PILLS: Raw woolLivestockSacred woodRitual componentsIron ore | 1 | FALSE | 1 | MED c | CARRIED | rr3w-village-famine-river-1: famine in force; record foodRecord.failedSource='livestock' (the livestock failed); grounds for this good: none other; chain cards:  |
| TRADE-PILLS: Salted fishSmoked seafoodFreshwater catchReligious services | 1 | FALSE | 1 | MED a,c | CARRIED | rr3w-village-under_siege+famine-rand-1: famine in force; record foodRecord.failedSource='fish' (the fish failed); grounds for this good: river_fish; chain cards: Fishing & Seafood vulnerable, River Fishing impaired |
| FOOD: No food comes into {N} by trade. Divine provision makes up {share} of what it eats. Most households go short, and hunger is already here. | 69 | MIXED | 24 | LOW a | CARRIED | r2r-thorp-54: no house of worship on the roster (only Access to parish church, Burial ground); the record's magicOffset under a divine tradition is the only ground; record cannot settle |
| FOODROW: Production: # lbs/day+ # imported+ # by divine provisionNeed: # lbs/dayShort: # lbs/day | 138 | MIXED | 9 | LOW a | CARRIED | r2r-hamlet-28: no house of worship on the roster (only Access to parish church, Burial ground); the record's magicOffset under a divine tradition is the only ground; record cannot settle |
| FOOD: {N} grows {share} of what it eats, and carts bring in {share of rest}. Divine provision makes up {share} of what it eats. A few households still go short, | 67 | MIXED | 9 | LOW a | CARRIED | r2r-thorp-16: no house of worship on the roster (only Access to parish church, Burial ground); the record's magicOffset under a divine tradition is the only ground; record cannot settle |
| FOODROW: Production: # lbs/day+ # by divine provisionNeed: # lbs/dayShort: # lbs/day | 45 | MIXED | 7 | LOW a | CARRIED | r2s-succession_void-hamlet-2: no house of worship on the roster (only Access to parish church, Burial ground); the record's magicOffset under a divine tradition is the only ground; record cannot settle |
| FOOD: {N} grows {share} of what it eats, and trade brings in {share of rest}. Divine provision makes up {share} of what it eats. Some households still go short, | 8 | MIXED | 6 | LOW a | CARRIED | r2r-hamlet-28: no house of worship on the roster (only Access to parish church, Burial ground); the record's magicOffset under a divine tradition is the only ground; record cannot settle |
| FOOD: {N} grows {share} of what it eats, and trade brings in {share of rest}. Divine provision makes up {share} of what it eats. A few households still go short | 18 | MIXED | 5 | LOW a | CARRIED | rr3-hamlet-occupied-rand-5: no house of worship on the roster (only Access to parish church, Burial ground); the record's magicOffset under a divine tradition is the only ground; record cannot settle |
| TRADE-PILLS: fishsaltSalted fishSmoked seafoodFreshwater catch | 4 | FALSE | 4 | LOW a | CARRIED | r2r-town-23: no sea: route crossroads, grounds river_fish,grazing_land,crossroads_position,gemstone_deposits (river fish only) |
| TRADE-PILLS: timberRiver craftCargo barges | 5 | MIXED | 3 | LOW a | CARRIED | r2r-village-5: no boatyard/shipyard on the roster (only River ferry) |
| FOOD: No food comes into {N} by trade. Divine provision makes up {share} of what it eats. A few households still go short, and a bad season would leave more of  | 3 | FALSE | 3 | LOW a | CARRIED | r2s-succession_void-thorp-2: no house of worship on the roster (only Access to parish church, Burial ground); the record's magicOffset under a divine tradition is the only ground; record cannot settle |
| FOOD: {N} grows {share} of what it eats, and trade brings in {share of rest}. Divine provision makes up {share} of what it eats. Many households go short, and h | 3 | FALSE | 3 | LOW a | CARRIED | rr3-hamlet-famine-rand-5: no house of worship on the roster (only Access to parish church, Burial ground); the record's magicOffset under a divine tradition is the only ground; record cannot settle |
| TRADE-PILLS: fishsaltgrainSalted fishSmoked seafoodFreshwater catch | 2 | FALSE | 2 | LOW a | CARRIED | r2r-hamlet-17: no sea: route crossroads, grounds river_fish,grain_fields,crossroads_position,gemstone_deposits (river fish only) |
| TRADE-PILLS: flourReligious servicesEducation (basic) | 2 | FALSE | 2 | LOW c | CARRIED | rr3-village-under_siege-rand-4: under siege; every chain on its ground (Grain & Bread, Brewing & Malting) prints Impaired; record viability: 'Field work and trade have stopped, and everything now turns on how long the food and water last.' |
| TRADE-PILLS: honeymedicinal herbsHoney and beeswaxForaged goods | 87 | MIXED | 1 | LOW c | CARRIED | rr3-hamlet-under_siege-rand-2: under siege; every chain on its ground (Reed & Marsh Harvest) prints Impaired; record viability: 'Field work and trade have stopped, and everything now turns on how long the food and water last.' |
| FOOD: {N} grows {share} of what it eats, and carts bring in {share of rest}. Divine provision makes up {share} of what it eats. Some households still go short,  | 13 | MIXED | 1 | LOW a | CARRIED | rr3-thorp-slave_revolt-rand-5: no house of worship on the roster (only Access to parish church, Burial ground); the record's magicOffset under a divine tradition is the only ground; record cannot settle |
| FOOD: {N} grows {share} of what it eats, and carts bring in {share of rest}. Divine provision makes up {share} of what it eats. Many households go short, and hu | 9 | MIXED | 1 | LOW a | CARRIED | rr3-thorp-famine-rand-1: no house of worship on the roster (only Access to parish church, Burial ground); the record's magicOffset under a divine tradition is the only ground; record cannot settle |
| FOOD: No food comes into {N} by trade. Divine provision makes up {share} of what it eats. Some households still go short, and a bad season would leave more of t | 6 | MIXED | 1 | LOW a | CARRIED | rr3w-hamlet-wartime-isolated-1: no house of worship on the roster (only Access to parish church, Burial ground); the record's magicOffset under a divine tradition is the only ground; record cannot settle |
| FOOD: No food comes into {N} by trade. Divine provision makes up {share} of what it eats. Many households go short, and a bad season would bring real hunger. | 3 | MIXED | 1 | LOW a | CARRIED | r2s-wartime-thorp-3: no house of worship on the roster (only Access to parish church, Burial ground); the record's magicOffset under a divine tradition is the only ground; record cannot settle |
| FOOD: {N} grows {share} of what it eats, and carts bring in {share of rest}. Divine provision makes up {share} of what it eats. Some households still go short,  | 2 | MIXED | 1 | LOW a | CARRIED | rr3-hamlet-famine-rand-2: no house of worship on the roster (only Access to parish church, Burial ground); the record's magicOffset under a divine tradition is the only ground; record cannot settle |
| TRADE-PILLS: saltmedicinal herbsShip construction | 1 | FALSE | 1 | LOW a | CARRIED | r2r-town-4: no shipyard or shipwright on the roster (only River boatyard, Docks/port facilities, Harbour master's office) (a boatyard may build some craft; doubtful) |
| TRADE-PILLS: River craftCargo barges | 1 | FALSE | 1 | LOW a | CARRIED | rr3-village-famine-rand-2: no boatyard/shipyard on the roster (only Fisher's landing, River ferry) |
| TRADE-PILLS: gemsPrecious metalsReligious servicesEducation (basic) | 1 | FALSE | 1 | LOW a | CARRIED | rr3-town-famine-rand-5: no mine on the roster (gems/metal worked via Jeweller) |
| TRADE-PILLS: salttimberShip construction | 1 | FALSE | 1 | LOW c | CARRIED | rr3-city-under_siege+famine-rand-1: under siege; every chain on its ground (Fishing & Seafood) prints Impaired; record viability: 'Field work and trade have stopped, and everything now turns on how long the food and water last.' |
| TRADE-PILLS: medicinal herbsReligious services | 1 | FALSE | 1 | LOW c | CARRIED | rr3w-village-under_siege+famine-isolated-0: under siege; every chain on its ground (Divine & Magical Healing, Pilgrimage & Holy Sites) prints Impaired; record viability: 'Field work and trade have stopped, and everything now turns on how long the food and water la |
| TRADE-PILLS: flourlivestockwooldairyanimal hidesBoots and shoes | 1 | FALSE | 1 | LOW c | CARRIED | rr3w-metropolis-under_siege-river-0: under siege; every chain on its ground (Grain & Bread, Brewing & Malting, Food Processing) prints Impaired; record viability: 'Field work and trade have stopped, and everything now turns on how long the food and water la |
| FOOD: What is grown here and brought in covers each day's food. | 365 | TRUE | 0 |  |  |  |
| TRADE-PILLS: Blue = re-exported transit goods | 284 | TRUE | 0 |  |  |  |
| FOODROW: Production: # lbs/day+ # importedNeed: # lbs/dayShort: # lbs/day | 276 | TRUE | 0 |  |  |  |
| TRADE-PILLS: medicinal herbshoneyHoney and beeswaxForaged goods | 107 | TRUE | 0 |  |  |  |
| FOODROW: Production: # lbs/day+ # imported+ # by druidic provisionNeed: # lbs/dayShort: # lbs/day | 104 | TRUE | 0 |  |  |  |
| FOOD: {N} grows {share} of what it eats, and carts bring in {share of rest}. A few households still go short, and a bad season would leave more of them hungry. | 79 | TRUE | 0 |  |  |  |
| FOOD: {N} grows {share} of what it eats, and carts bring in {share of rest}. Some households still go short, and a bad season would leave more of them hungry. | 60 | TRUE | 0 |  |  |  |
| FOODROW: Production: # lbs/day+ # imported+ # by arcane provisionNeed: # lbs/dayShort: # lbs/day | 60 | TRUE | 0 |  |  |  |
| FOOD: What is grown here covers each day's food, with nothing to spare against a bad year. | 52 | TRUE | 0 |  |  |  |
| TRADE-PILLS: Religious servicesEducation (basic) | 48 | TRUE | 0 |  |  |  |
| FOOD: {N} grows {share} of what it eats, and trade brings in {share of rest}. A few households still go short, and a bad season would leave more of them hungry. | 46 | TRUE | 0 |  |  |  |
| FOOD: {N} grows {share} of what it eats, and carts bring in {share of rest}. Druidic provision makes up {share} of what it eats. A few households still go short | 42 | TRUE | 0 |  |  |  |
| FOODROW: Production: # lbs/dayNeed: # lbs/dayShort: # lbs/day | 26 | TRUE | 0 |  |  |  |
| FOODROW: Production: # lbs/day+ # by druidic provisionNeed: # lbs/dayShort: # lbs/day | 26 | TRUE | 0 |  |  |  |
| FOOD: {N} grows {share} of what it eats, and ships bring in {share of rest}. A few households still go short, and a bad season would leave more of them hungry. | 25 | TRUE | 0 |  |  |  |
| FOOD: {N} grows {share} of what it eats, and ships bring in {share of rest}. Druidic provision makes up {share} of what it eats. A few households still go short | 23 | TRUE | 0 |  |  |  |
| TRADE-PILLS: grainmedicinal herbshoneyHoney and beeswaxForaged goods | 22 | TRUE | 0 |  |  |  |
| FOOD: {N} grows {share} of what it eats, and ships bring in {share of rest}. Divine provision makes up {share} of what it eats. A few households still go short, | 21 | TRUE | 0 |  |  |  |
| TRADE-PILLS: grain | 20 | TRUE | 0 |  |  |  |
| FOOD: {N} grows {share} of what it eats, and boats bring in {share of rest}. A few households still go short, and a bad season would leave more of them hungry. | 19 | TRUE | 0 |  |  |  |
| FOOD: {N} grows {share} of what it eats, and carts bring in {share of rest}. Arcane provision makes up {share} of what it eats. A few households still go short, | 18 | TRUE | 0 |  |  |  |
| TRADE-PILLS: peathoneymedicinal herbsHoney and beeswaxForaged goods | 17 | TRUE | 0 |  |  |  |
| FOOD: {N} grows {share} of what it eats, and carts bring in {share of rest}. Many households go short, and hunger is already here. | 16 | TRUE | 0 |  |  |  |
| FOODROW: Production: # lbs/day+ # by arcane provisionNeed: # lbs/dayShort: # lbs/day | 16 | TRUE | 0 |  |  |  |
| FOOD: No food comes into {N} by trade. Arcane provision makes up {share} of what it eats. Most households go short, and hunger is already here. | 16 | TRUE | 0 |  |  |  |
| FOOD: {N} grows {share} of what it eats, and trade brings in {share of rest}. Many households go short, and hunger is already here. | 15 | TRUE | 0 |  |  |  |
| FOOD: {N} grows {share} of what it eats, and boats bring in {share of rest}. Divine provision makes up {share} of what it eats. A few households still go short, | 15 | TRUE | 0 |  |  |  |
| FOOD: {N} grows {share} of what it eats, and ships bring in {share of rest}. Arcane provision makes up {share} of what it eats. A few households still go short, | 14 | TRUE | 0 |  |  |  |
| TRADE-PILLS: fishsaltSalted fishSmoked seafood | 13 | TRUE | 0 |  |  |  |
| FOOD: {N} grows {share} of what it eats, and carts bring in {share of rest}. Most households go short, and hunger is already here. | 12 | TRUE | 0 |  |  |  |
| FOOD: No food comes into {N} by trade. Druidic provision makes up {share} of what it eats. Many households go short, and a bad season would bring real hunger. | 12 | TRUE | 0 |  |  |  |
| FOOD: {N} grows {share} of what it eats, and boats bring in {share of rest}. Druidic provision makes up {share} of what it eats. A few households still go short | 12 | TRUE | 0 |  |  |  |
| FOOD: {N} grows {share} of what it eats, and carts bring in {share of rest}. Arcane provision makes up {share} of what it eats. Some households still go short,  | 11 | TRUE | 0 |  |  |  |
| FOOD: {N} grows {share} of what it eats, and ships bring in {share of rest}. Many households go short, and hunger is already here. | 11 | TRUE | 0 |  |  |  |
| FOOD: {N} grows {share} of what it eats, and carts bring in {share of rest}. Many households go short, and a bad season would bring real hunger. | 11 | TRUE | 0 |  |  |  |
| FOOD: {N} grows {share} of what it eats, and trade brings in {share of rest}. Some households still go short, and a bad season would leave more of them hungry. | 11 | TRUE | 0 |  |  |  |
| FOODROW: Production: # lbs/dayNeed: # lbs/day | 10 | TRUE | 0 |  |  |  |
| FOODROW: Production: # lbs/day+ # importedNeed: # lbs/day | 9 | TRUE | 0 |  |  |  |
| FOOD: No food comes into {N} by trade. Most households go short, and hunger is already here. | 8 | TRUE | 0 |  |  |  |
| FOOD: No food comes into {N} by trade. Druidic provision makes up {share} of what it eats. Most households go short, and hunger is already here. | 8 | TRUE | 0 |  |  |  |
| FOOD: {N} grows {share} of what it eats, and carts bring in {share of rest}. Druidic provision makes up {share} of what it eats. Some households still go short, | 8 | TRUE | 0 |  |  |  |
| TRADE-PILLS: Religious services | 7 | TRUE | 0 |  |  |  |
| TRADE-PILLS: Financial servicesInternational banking services | 7 | TRUE | 0 |  |  |  |
| TRADE-PILLS: Spellcasting (minor)Magical identification | 7 | TRUE | 0 |  |  |  |
| TRADE-PILLS: No significant exports. | 6 | TRUE | 0 |  |  |  |
| TRADE-PILLS: grainflourBaked goodsReligious servicesEducation (basic) | 6 | TRUE | 0 |  |  |  |
| FOOD: No food comes into {N} by trade. Druidic provision makes up {share} of what it eats. Many households go short, and hunger is already here. | 6 | TRUE | 0 |  |  |  |
| FOOD: {N} grows {share} of what it eats, and boats bring in {share of rest}. Many households go short, and hunger is already here. | 5 | TRUE | 0 |  |  |  |
| TRADE-PILLS: medicinal herbsReligious servicesEducation (basic) | 5 | TRUE | 0 |  |  |  |
| FOOD: {N} grows {share} of what it eats, and boats bring in {share of rest}. Some households still go short, and a bad season would leave more of them hungry. | 5 | TRUE | 0 |  |  |  |
| FOOD: {N} grows {share} of what it eats, and trade brings in {share of rest}. Druidic provision makes up {share} of what it eats. A few households still go shor | 5 | TRUE | 0 |  |  |  |
| TRADE-PILLS: medicinal herbspeathoneyHoney and beeswaxForaged goods | 5 | TRUE | 0 |  |  |  |
| FOOD: {N} grows {share} of what it eats, and boats bring in {share of rest}. Arcane provision makes up {share} of what it eats. A few households still go short, | 5 | TRUE | 0 |  |  |  |
| TRADE-PILLS: Preserved foods (transit) | 5 | TRUE | 0 |  |  |  |
| FOOD: {N} grows {share} of what it eats, and carts bring in {share of rest}. Druidic provision makes up {share} of what it eats. Many households go short, and h | 5 | TRUE | 0 |  |  |  |
| TRADE-PILLS: saltPreserved foods | 4 | TRUE | 0 |  |  |  |
| TRADE-PILLS: grainflourBaked goodsAle (barrel)Beer (barrel) | 4 | TRUE | 0 |  |  |  |
| TRADE-PILLS: timberBarrels and containers | 4 | TRUE | 0 |  |  |  |
| TRADE-PILLS: fishsaltPreserved foodsSalted fishSmoked seafood | 4 | TRUE | 0 |  |  |  |
| TRADE-PILLS: honeymedicinal herbsstoneHoney and beeswaxForaged goods | 4 | TRUE | 0 |  |  |  |
| TRADE-PILLS: Recovered artefacts (naval route only) | 4 | TRUE | 0 |  |  |  |
| TRADE-PILLS: livestockwooldairyanimal hidesPreserved foods | 4 | TRUE | 0 |  |  |  |
| TRADE-PILLS: Recovered artefactsPreserved foods (transit) | 4 | TRUE | 0 |  |  |  |
| FOOD: {N} grows {share} of what it eats, and ships bring in {share of rest}. Divine provision makes up {share} of what it eats. Most households go short, and hu | 4 | TRUE | 0 |  |  |  |
| TRADE-PILLS: grainflourBaked goods | 3 | TRUE | 0 |  |  |  |
| TRADE-PILLS: timbersaltRiver craftCargo bargesPreserved foods | 3 | TRUE | 0 |  |  |  |
| FOOD: {N} grows {share} of what it eats, and ships bring in {share of rest}. Some households still go short, and a bad season would leave more of them hungry. | 3 | TRUE | 0 |  |  |  |
| FOOD: {N} grows {share} of what it eats, and boats bring in {share of rest}. Divine provision makes up {share} of what it eats. Many households go short, and hu | 3 | TRUE | 0 |  |  |  |
| TRADE-PILLS: timberReligious servicesEducation (basic) | 3 | TRUE | 0 |  |  |  |
| FOOD: {N} grows {share} of what it eats, and carts bring in {share of rest}. Arcane provision makes up {share} of what it eats. Many households go short, and hu | 3 | TRUE | 0 |  |  |  |
| TRADE-PILLS: game meatanimal hidesFurs and pelts | 3 | TRUE | 0 |  |  |  |
| TRADE-PILLS: coalReligious servicesEducation (basic) | 3 | TRUE | 0 |  |  |  |
| TRADE-PILLS: timbermedicinal herbshoneyHoney and beeswaxForaged goods | 3 | TRUE | 0 |  |  |  |
| TRADE-PILLS: Overland cargo transportEscorted caravan | 3 | TRUE | 0 |  |  |  |
| TRADE-PILLS: Furs and pelts (transit) | 3 | TRUE | 0 |  |  |  |
| FOOD: {N} grows {share} of what it eats, and boats bring in {share of rest}. Divine provision makes up {share} of what it eats. Some households still go short,  | 3 | TRUE | 0 |  |  |  |
| TRADE-PILLS: stoneReligious servicesEducation (basic) | 3 | TRUE | 0 |  |  |  |
| FOOD: {N} grows {share} of what it eats, and ships bring in {share of rest}. Druidic provision makes up {share} of what it eats. Some households still go short, | 3 | TRUE | 0 |  |  |  |
| FOOD: {N} grows {share} of what it eats, and carts bring in {share of rest}. Druidic provision makes up {share} of what it eats. Some households still go short, | 3 | TRUE | 0 |  |  |  |
| TRADE-PILLS: Medical care (basic)Spellcasting (minor) | 3 | TRUE | 0 |  |  |  |
| TRADE-PILLS: Raw sandRaw woolLivestockSacred woodRitual components | 2 | TRUE | 0 |  |  |  |
| TRADE-PILLS: livestockwooldairyanimal hidescoalPreserved foods | 2 | TRUE | 0 |  |  |  |
| TRADE-PILLS: honeymedicinal herbsgrainHoney and beeswaxForaged goods | 2 | TRUE | 0 |  |  |  |
| TRADE-PILLS: grainflourBaked goodsPreserved foods | 2 | TRUE | 0 |  |  |  |
| FOOD: {N} grows {share} of what it eats, and ships bring in {share of rest}. Druidic provision makes up {share} of what it eats. Many households go short, and a | 2 | TRUE | 0 |  |  |  |
| TRADE-PILLS: Sacred woodRitual components | 2 | TRUE | 0 |  |  |  |
| TRADE-PILLS: woollivestockdairyanimal hidesPreserved foods | 2 | TRUE | 0 |  |  |  |
| TRADE-PILLS: medicinal herbshoneycoalHoney and beeswaxForaged goods | 2 | TRUE | 0 |  |  |  |
| TRADE-PILLS: coal | 2 | TRUE | 0 |  |  |  |
| TRADE-PILLS: medicinal herbsPotions and elixirsAlchemical reagents | 2 | TRUE | 0 |  |  |  |
| FOOD: {N} grows {share} of what it eats, and trade brings in {share of rest}. Arcane provision makes up {share} of what it eats. A few households still go short | 2 | TRUE | 0 |  |  |  |
| TRADE-PILLS: medicinal herbs | 2 | TRUE | 0 |  |  |  |
| TRADE-PILLS: saltShip constructionPreserved foods | 2 | TRUE | 0 |  |  |  |
| FOOD: {N} grows {share} of what it eats, and ships bring in {share of rest}. Arcane provision makes up {share} of what it eats. Some households still go short,  | 2 | TRUE | 0 |  |  |  |
| FOOD: {N} grows {share} of what it eats, and ships bring in {share of rest}. Arcane provision makes up {share} of what it eats. Most households go short, and hu | 2 | TRUE | 0 |  |  |  |
| TRADE-PILLS: coalMedical care (basic)Spellcasting (minor) | 2 | TRUE | 0 |  |  |  |
| TRADE-PILLS: grainlivestock | 1 | TRUE | 0 |  |  |  |
| FOOD: {N} grows {share} of what it eats, and trade brings in {share of rest}. Divine provision makes up {share} of what it eats. Some households still go short, | 1 | TRUE | 0 |  |  |  |
| TRADE-PILLS: Water rightsOasis provisionsRaw sandRaw woolLivestock | 1 | TRUE | 0 |  |  |  |
| TRADE-PILLS: Iron ore | 1 | TRUE | 0 |  |  |  |
| TRADE-PILLS: iron | 1 | TRUE | 0 |  |  |  |
| TRADE-PILLS: Salted fishSmoked seafoodFish oilPreserved foods (transit) | 1 | TRUE | 0 |  |  |  |
| TRADE-PILLS: Grain surplus | 1 | TRUE | 0 |  |  |  |
| TRADE-PILLS: grainhoneymedicinal herbsHoney and beeswaxForaged goods | 1 | TRUE | 0 |  |  |  |
| TRADE-PILLS: grainmedicinal herbshoneyironHoney and beeswaxForaged goods | 1 | TRUE | 0 |  |  |  |
| TRADE-PILLS: Reeds and thatchCoalWaterfowlSacred woodRitual components | 1 | TRUE | 0 |  |  |  |
| TRADE-PILLS: Sea saltFurs and pelts (transit) | 1 | TRUE | 0 |  |  |  |
| TRADE-PILLS: Medicinal herbsWild honeySacred woodRitual components | 1 | TRUE | 0 |  |  |  |
| TRADE-PILLS: Milled lumberSea saltRiver craftCargo bargesPreserved foods | 1 | TRUE | 0 |  |  |  |
| TRADE-PILLS: Raw woolLive sheepHewn timberPine planksCharcoalLivestock | 1 | TRUE | 0 |  |  |  |
| TRADE-PILLS: woollivestockdairyanimal hidestimberPreserved foodsFuel wood | 1 | TRUE | 0 |  |  |  |
| TRADE-PILLS: timberBarrels and containersRiver craftCargo barges | 1 | TRUE | 0 |  |  |  |
| TRADE-PILLS: Milled flourCoalRare spices and exotic dyes (transit) | 1 | TRUE | 0 |  |  |  |
| TRADE-PILLS: Sacred woodRitual componentsRecovered artefacts | 1 | TRUE | 0 |  |  |  |
| TRADE-PILLS: ironstoneRefined iron ingotsPig iron | 1 | TRUE | 0 |  |  |  |
| FOOD: {N} grows {share} of what it eats, and boats bring in {share of rest}. Arcane provision makes up {share} of what it eats. Some households still go short,  | 1 | TRUE | 0 |  |  |  |
| TRADE-PILLS: Defence servicesWeapons training | 1 | TRUE | 0 |  |  |  |
| FOOD: {N} grows {share} of what it eats, and trade brings in {share of rest}. Arcane provision makes up {share} of what it eats. Many households go short, and h | 1 | TRUE | 0 |  |  |  |
| FOOD: {N} grows {share} of what it eats, and boats bring in {share of rest}. Some households still go short, and hunger is already here. | 1 | TRUE | 0 |  |  |  |
| TRADE-PILLS: Water rightsOasis provisionsRaw sand | 1 | TRUE | 0 |  |  |  |
| FOOD: What is grown here and brought in covers each day's food, with nothing to spare against a bad year. | 1 | TRUE | 0 |  |  |  |
| TRADE-PILLS: medicinal herbshoneyironHoney and beeswaxForaged goods | 1 | TRUE | 0 |  |  |  |
| TRADE-PILLS: Medical treatmentSurgeryReligious servicesEducation (basic) | 1 | TRUE | 0 |  |  |  |
| TRADE-PILLS: Healing waters (bottled)Pilgrim hospitalityCoal | 1 | TRUE | 0 |  |  |  |
| TRADE-PILLS: stone | 1 | TRUE | 0 |  |  |  |
| TRADE-PILLS: Milled flourFlour and mealFurs and pelts (transit) | 1 | TRUE | 0 |  |  |  |
| TRADE-PILLS: grainmedicinal herbshoneycoalHoney and beeswaxForaged goods | 1 | TRUE | 0 |  |  |  |
| TRADE-PILLS: Sacred woodRitual componentsCoal | 1 | TRUE | 0 |  |  |  |
| TRADE-PILLS: grainironAle (barrel)Beer (barrel) | 1 | TRUE | 0 |  |  |  |
| TRADE-PILLS: fishsaltSalted fishSmoked seafoodPreserved foods | 1 | TRUE | 0 |  |  |  |
| TRADE-PILLS: timbermedicinal herbshoneycoalHoney and beeswaxForaged goods | 1 | TRUE | 0 |  |  |  |
| TRADE-PILLS: Raw sandDate harvestDesert grainRaw woolLivestock | 1 | TRUE | 0 |  |  |  |
| TRADE-PILLS: grainAle (barrel)Beer (barrel) | 1 | TRUE | 0 |  |  |  |
| TRADE-PILLS: Grain surplusLivestockCoalPreserved foods | 1 | TRUE | 0 |  |  |  |
| TRADE-PILLS: grainlivestockPreserved foods | 1 | TRUE | 0 |  |  |  |
| TRADE-PILLS: honeymedicinal herbscoalHoney and beeswaxForaged goods | 1 | TRUE | 0 |  |  |  |
| TRADE-PILLS: game meatanimal hidesFurs and peltsstonecoal | 1 | TRUE | 0 |  |  |  |
| TRADE-PILLS: Raw woolLivestockPreserved foodsFurs and pelts (transit) | 1 | TRUE | 0 |  |  |  |
| TRADE-PILLS: Raw woolLivestockCoalPreserved foodsFurs and pelts (transit) | 1 | TRUE | 0 |  |  |  |
| TRADE-PILLS: Preserved foods (transit)Meals and drink | 1 | TRUE | 0 |  |  |  |
| FOOD: {N} grows {share} of what it eats, and boats bring in {share of rest}. Divine provision makes up {share} of what it eats. A few households still go short, | 1 | TRUE | 0 |  |  |  |
| TRADE-PILLS: Recovered artefactsFurs and pelts (transit) | 1 | TRUE | 0 |  |  |  |
| TRADE-PILLS: Meals and drinkPreserved foods (transit) | 1 | TRUE | 0 |  |  |  |
| TRADE-PILLS: medicinal herbshoneyHerbal remediesPotions and elixirs | 1 | TRUE | 0 |  |  |  |
| TRADE-PILLS: Recovered artefactsMeals and drinkPreserved foods (transit) | 1 | TRUE | 0 |  |  |  |
| TRADE-PILLS: saltfishPreserved foodsSalted fishSmoked seafood | 1 | TRUE | 0 |  |  |  |
| TRADE-PILLS: coalOverland cargo transportEscorted caravan | 1 | TRUE | 0 |  |  |  |
| FOOD: {N} grows {share} of what it eats, and ships bring in {share of rest}. Divine provision makes up {share} of what it eats. Some households still go short,  | 1 | TRUE | 0 |  |  |  |
| TRADE-PILLS: fishsaltSalted fishSmoked seafoodShip construction | 1 | TRUE | 0 |  |  |  |
| FOOD: {N} grows {share} of what it eats, and ships bring in {share of rest}. Divine provision makes up {share} of what it eats. Many households go short, and a  | 1 | TRUE | 0 |  |  |  |
| TRADE-PILLS: Spellcasting (minor)Religious services | 1 | TRUE | 0 |  |  |  |
| TRADE-PILLS: stoneFinancial servicesInternational banking services | 1 | TRUE | 0 |  |  |  |
| TRADE-PILLS: stonecoalFinancial servicesInternational banking services | 1 | TRUE | 0 |  |  |  |
| FOOD: {N} grows {share} of what it eats, and boats bring in {share of rest}. Arcane provision makes up {share} of what it eats. Some households still go short,  | 1 | TRUE | 0 |  |  |  |
| TRADE-PILLS: coalstoneFinancial servicesInternational banking services | 1 | TRUE | 0 |  |  |  |
| TRADE-PILLS: Medical treatmentSurgery | 1 | TRUE | 0 |  |  |  |
| TRADE-PILLS: medicinal herbsMedical treatmentSurgery | 1 | TRUE | 0 |  |  |  |
| TRADE-PILLS: coaltimber | 1 | TRUE | 0 |  |  |  |
| TRADE-PILLS: grainstoneAle (barrel)Beer (barrel) | 1 | TRUE | 0 |  |  |  |
| TRADE-PILLS: graindatesgame meatanimal hidesFurs and peltsPalm sugar | 1 | TRUE | 0 |  |  |  |
| TRADE-PILLS: ironReligious servicesEducation (basic) | 1 | TRUE | 0 |  |  |  |
| TRADE-PILLS: game meatanimal hidesfurscoalBoots and shoes | 1 | TRUE | 0 |  |  |  |
| TRADE-PILLS: Ship construction | 1 | TRUE | 0 |  |  |  |
| TRADE-PILLS: Spellcasting (minor)Religious servicesEducation (basic) | 1 | TRUE | 0 |  |  |  |
| FOOD: {N} grows {share} of what it eats, and boats bring in {share of rest}. Divine provision makes up {share} of what it eats. Some households still go short,  | 1 | TRUE | 0 |  |  |  |
| FOOD: {N} grows {share} of what it eats, and ships bring in {share of rest}. Druidic provision makes up {share} of what it eats. Many households go short, and h | 1 | TRUE | 0 |  |  |  |
| TRADE-PILLS: livestockwooldairyanimal hidesLeather goods | 1 | TRUE | 0 |  |  |  |
| FOOD: {N} grows {share} of what it eats, and boats bring in {share of rest}. Arcane provision makes up {share} of what it eats. Many households go short, and hu | 1 | TRUE | 0 |  |  |  |
| FOOD: {N} grows {share} of what it eats, and trade brings in {share of rest}. Druidic provision makes up {share} of what it eats. Some households still go short | 1 | TRUE | 0 |  |  |  |
| FOOD: {N} grows {share} of what it eats, and boats bring in {share of rest}. Druidic provision makes up {share} of what it eats. Some households still go short, | 1 | TRUE | 0 |  |  |  |
| FOOD: {N} grows {share} of what it eats, and carts bring in {share of rest}. Divine provision makes up {share} of what it eats. Many households go short, and a  | 1 | TRUE | 0 |  |  |  |
| TRADE-PILLS: coalMedical treatmentSurgery | 1 | TRUE | 0 |  |  |  |

### Economics tab: Economic Flows (chain and service cards)

| family | prints in (towns) | verdict | false towns | severity · kind | own or carried | example (town: the fact) |
|---|---|---|---|---|---|---|
| Economic Flows: Economic Flows (# active · # impaired)▲?What is made here and what it depends on. | 200 | MIXED | 80 | MED e | THE STAGE'S OWN | r2r-metropolis-14: the header counts 22 impaired; the section prints 26 Impaired chips (22 chain cards + 4 service cards, e.g. "Banking & FinanceServiceExportImpaired") |
| NEED: {services} here depend on {goods} brought in, which a siege, a closed road or a blockade would cut off. | 712 | MIXED | 54 | MED a | CARRIED | r2r-town-2: no walls or gates on the roster (Town watch is the only defence house); the Defense tab says "Unfortified. No perimeter walls. Defenders cannot control entry points" |
| Economic Flows: All (#)Issues (#)Entrepôt (#)Services (#) | 48 | MIXED | 47 | MED e | THE STAGE'S OWN | r2r-metropolis-14: Issues (33) but 37 cards print Impaired or Vulnerable: 33 chain cards + 4 service cards printed "Impaired" (All counts the service cards) |
| NEED: {services} here depend on {goods} brought in by magic: no trade road reaches {N}. | 30 | FALSE | 30 | MED g,a | CARRIED | r2r-town-12: the same page says "Qasrtappa is poor, and the road to it is long and hard.", and its Imports list prints iron arriving |
| Economic Flows: Druidic forest management accelerates regrowth and sustainable yield | 64 | MIXED | 29 | MED h,c | CARRIED | r2r-city-5: on the Reed & Marsh Harvest card: the ground is Marshlands (depleted), no forest |
| Economic Flows: All (#)Issues (#)✓ Productive (#)Entrepôt (#)Services (#) | 45 | MIXED | 26 | MED e | THE STAGE'S OWN | r2s-under_siege-city-0: Issues (17) but 24 cards print Impaired or Vulnerable: 17 chain cards + 7 service cards printed "Impaired" (All counts the service cards) |
| Economic Flows: Master-crafted weapons | 21 | FALSE | 21 | HIGH a | CARRIED | r2r-hamlet-6: hamlet of 57: the card's only houses are Mine (open cast) · Mine; no smith, forge or weaponsmith stands on the roster |
| NEED: {services} here run on stored {goods}: no trade road reaches {N}. | 17 | FALSE | 17 | MED g,a | CARRIED | r2r-town-9: the same page says "Every load of iron ore that Ravengarde's Smelter uses comes in from elsewhere; a closed road would stop its work within the season.", and its Imports list prints iron arriving |
| NEED: {services} here depend on {goods} brought in. | 677 | MIXED | 16 | MED a,c | CARRIED | r2r-town-4: no walls or gates on the roster (Town watch is the only defence house); the Defense tab says "Unfortified. No perimeter walls. Defenders cannot control entry points" |
| NEED: {services} here run on stored {goods}. | 14 | FALSE | 14 | MED g | CARRIED | r2r-town-9: the same tab's Imports list prints grain arriving (and the page says "Every load of iron ore that Ravengarde's Smelter uses comes in from elsewhere; a closed road would stop its work within the season."): not run on stor |
| Economic Flows: Druidic cultivation supplements depleted farmland | 84 | MIXED | 13 | MED h,c | CARRIED | r2r-metropolis-42: on the Salt & Preservation card: the depleted ground is Salt flats, not farmland |
| Economic Flows: Conjured game produces fish; minor supplement | 12 | FALSE | 12 | MED h | CARRIED | r2r-town-6: on the Fishing & Seafood card (Fishing grounds): conjured "game" is the wrong kind of word for fish |
| NEED: {services} here depend on {goods} from outside, which the siege has cut off. | 108 | MIXED | 10 | MED a | CARRIED | r2s-under_siege-town-1: no walls or gates on the roster (Town watch is the only defence house); the Defense tab says "Unfortified. No perimeter walls. Defenders cannot control entry points" |
| Economic Flows: Milled lumber | 26 | MIXED | 9 | MED a | CARRIED | r2r-village-2: the card's only house is a Thatcher ("Lays roofs and mends them."); no sawmill on the roster |
| Economic Flows: All (#)Issues (#)✓ Productive (#)Services (#) | 13 | MIXED | 5 | MED e | THE STAGE'S OWN | r2s-under_siege-town-3: Issues (12) but 13 cards print Impaired or Vulnerable: 12 chain cards + 1 service cards printed "Impaired" (All counts the service cards) |
| Economic Flows: Processed textilesDyed clothFine textiles | 7 | MIXED | 4 | MED a | CARRIED | r2s-insurgency-village-2: the card's only house is a Fuller ("Finishes woven cloth by cleaning and thickening it"); no dyer on the roster |
| Economic Flows: Arcane quickening of growth provides minor food supplement | 46 | MIXED | 4 | MED h | CARRIED | r2r-town-51: on the Salt & Preservation card: salt flats grow nothing to quicken |
| Economic Flows: Druidic beast-callers attract game to supplement depleted grounds | 21 | MIXED | 2 | MED c | CARRIED | rr3-metropolis-under_siege-rand-5: under the siege the page says "Field work and trade have stopped" and "The siege has taken the outlying fields", yet this Hunting & Trapping card prints ✦ Magically Sustained with the druids still working its Hunting gro |
| Economic Flows: Druidic grain-blessing and water purification sustain brewing | 28 | MIXED | 2 | MED c | CARRIED | rr3-metropolis-under_siege-rand-3: under the siege the page says "Field work and trade have stopped" and "The siege has taken the outlying fields", yet this Brewing & Malting card prints ✦ Magically Sustained with the druids still working its Grain fields |
| Economic Flows: Military ContractsServiceExportImpaired | 52 | MIXED | 2 | MED g | THE STAGE'S OWN | rr3w-city-under_siege-port-0: the Institutions tab prints "Mercenary quarterDefense" (not impaired), yet the service card runs through it and prints Impaired |
| NEED: {services} here depend on {goods}, iron and grain brought in by magic: no trade road reaches {N}. | 2 | FALSE | 2 | MED g | CARRIED | r2r-metropolis-44: the same page says "Every load of grain that Tallchowk's Mill uses comes in from elsewhere; a closed road would stop its work within the season.", and its Imports list prints stone, iron and grain arriving |
| Economic Flows: All (#)Issues (#)Services (#) | 3 | MIXED | 2 | MED e | THE STAGE'S OWN | r2s-under_siege-town-2: Issues (6) but 7 cards print Impaired or Vulnerable: 6 chain cards + 1 service cards printed "Impaired" (All counts the service cards) |
| NEED: {services} here depend on {goods} brought in by magic. | 31 | MIXED | 1 | MED a | CARRIED | r2r-town-54: no walls or gates on the roster (Town watch is the only defence house); the Defense tab says "Unfortified. No perimeter walls. Defenders cannot control entry points" |
| NEED: {services} here run on stored {goods}, iron and grain: no trade road reaches {N}. | 1 | FALSE | 1 | MED g | CARRIED | rr3w-metropolis-occupied-isolated-0: the same page says "Bolts of cloth and bales of wool fill the carts waiting on the road out.", and its Imports list prints stone, iron and grain arriving |
| Economic Flows: Grain surplusBulk food exports | 52 | MIXED | 0 | LOW d | CARRIED | r2r-thorp-12: thorp of 23; "bulk" exports from a surplus of 14 lbs/day (Exports prints Grain surplus) |
| Economic Flows: Blessed stores; divine provision fills the gap | 53 | MIXED | 0 | LOW c | CARRIED | r2r-metropolis-14: under the siege ("Field work and trade have stopped") the note still claims the Grazing land yields by magic; card chip vulnerable |
| Economic Flows: Flour and mealMilled lumber | 20 | MIXED | 0 | LOW a | CARRIED | r2r-village-37: the only mill is a grain mill ("Mill"); no sawmill on the roster |
| Economic Flows: Druidic animal husbandry sustains the herd | 43 | MIXED | 0 | LOW c | CARRIED | rr3-metropolis-under_siege+famine-rand-2: under the siege ("Field work and trade have stopped") the note still claims the Grazing land yields by magic; card chip vulnerable |
| Economic Flows: Ship constructionVessel maintenance | 82 | MIXED | 0 | LOW a | CARRIED | r2r-city-19: no shipyard or shipwright on the roster (Docks/port facilities) |
| Economic Flows: Arcane fabrication provides processed goods from alternative sources | 56 | MIXED | 0 | LOW c | CARRIED | rr3-city-under_siege-rand-3: under the siege ("Field work and trade have stopped") the note still claims the Managed woodland yields by magic; card chip vulnerable |
| Economic Flows: Arcane fabrication and stone-shaping partially offset depleted extraction | 76 | MIXED | 0 | LOW c | CARRIED | r2s-under_siege-metropolis-3: under the siege ("Field work and trade have stopped") the note still claims the Iron ore deposits yields by magic; card chip vulnerable |
| Economic Flows: Druids call fish and bless the waters | 23 | MIXED | 0 | LOW c | CARRIED | rr3w-metropolis-famine-rand-0: the famine failed this very source (fish); the card still claims the magic provision |
| Economic Flows: GlasswareBooks and manuscripts | 307 | MIXED | 0 | LOW a | CARRIED | r2r-city-51: the card's house is Glassmakers; the book-maker credited is only "Hedge wizard" |
| Economic Flows: Luxury manufactured goodsExtreme luxury goodsMaster-crafted weapons | 35 | MIXED | 0 | LOW a | CARRIED | r2r-city-24: city of 4512: the card's only houses are Luxury goods quarter; no smith, forge or weaponsmith stands on the roster |
| Economic Flows: Temple fishing rites improve depleted catch | 14 | MIXED | 0 | LOW c | CARRIED | r2s-under_siege-village-1: under the siege ("Field work and trade have stopped") the note still claims the River fisheries yields by magic; card chip vulnerable |
| NEED: {services} here depend on {goods}, iron and grain brought in, which a siege, a closed road or a blockade would cut off. | 33 | MIXED | 0 | LOW g | CARRIED | r2s-succession_void-metropolis-1: grain is also printed under "Produced locally" (grain) as well as on the Imports list: "depend on grain brought in" overstates |
| Economic Flows: Alchemy & ReagentsArcane & magicalImpaired | 2 | UNSETTLED | 0 | LOW c | CARRIED | rr3-town-under_siege-port-1: Impaired under the siege on its Magical ley line node (magical_node): no field work or road trade carries it; the record cannot settle whether a land siege stops it |
| Economic Flows: Planar TradeArcane & magicalImpaired | 1 | UNSETTLED | 0 | LOW c | CARRIED | rr3-metropolis-under_siege-port-0: Impaired under the siege on its planar gate (no ground): no field work or road trade carries it; the record cannot settle whether a land siege stops it |
| NEED: {services} here depend on {goods}, grain and fuel brought in by magic. | 1 | MIXED | 0 | LOW g | CARRIED | rr3-metropolis-recently_betrayed-rand-4: fuel is also printed under "Produced locally" (Fuel wood) as well as on the Imports list: "depend on fuel brought in" overstates |
| Economic Flows: Faith & WorshipReligion & civic | 409 | TRUE | 0 |  |  |  |
| Economic Flows: All (#)✓ Productive (#) | 31 | TRUE | 0 |  |  |  |
| Economic Flows: All (#)Issues (#) | 135 | TRUE | 0 |  |  |  |
| Economic Flows: All (#) | 22 | TRUE | 0 |  |  |  |
| Economic Flows: Grain & BreadFood security | 67 | TRUE | 0 |  |  |  |
| Economic Flows: All (#)Entrepôt (#) | 5 | TRUE | 0 |  |  |  |
| Economic Flows: Grain surplusAgricultural surplus | 4 | TRUE | 0 |  |  |  |
| Economic Flows: Grain & BreadFood securityImpaired | 35 | TRUE | 0 |  |  |  |
| Economic Flows: Preserved foods | 109 | TRUE | 0 |  |  |  |
| Economic Flows: Aged cheeseLuxury dairy products | 5 | TRUE | 0 |  |  |  |
| Economic Flows: All (#)Issues (#)✓ Productive (#) | 86 | TRUE | 0 |  |  |  |
| Economic Flows: Palm sugarPreserved fruit | 27 | TRUE | 0 |  |  |  |
| Economic Flows: River FishingFood securityImpaired | 13 | TRUE | 0 |  |  |  |
| Economic Flows: Normally yields | 64 | TRUE | 0 |  |  |  |
| Economic Flows: All (#)Issues (#)✓ Productive (#)Entrepôt (#) | 22 | TRUE | 0 |  |  |  |
| Economic Flows: River Mill IndustryRaw materials & fuel | 12 | TRUE | 0 |  |  |  |
| Economic Flows: Pilgrimage & Holy SitesReligion & civic | 33 | TRUE | 0 |  |  |  |
| Economic Flows: Furs and pelts | 56 | TRUE | 0 |  |  |  |
| Economic Flows: Fishing & SeafoodFood securityImpaired | 7 | TRUE | 0 |  |  |  |
| Economic Flows: Salted fishSmoked seafoodFish oil | 2 | TRUE | 0 |  |  |  |
| Economic Flows: Transit trade profit | 428 | TRUE | 0 |  |  |  |
| Economic Flows: Leather goods | 6 | TRUE | 0 |  |  |  |
| Economic Flows: Livestock & DairyFood securityImpaired | 26 | TRUE | 0 |  |  |  |
| Economic Flows: Textiles & ClothManufacturing & craftsImpaired | 20 | TRUE | 0 |  |  |  |
| Economic Flows: Cloth Finishing & ClothingManufacturing & craftsImpaired | 19 | TRUE | 0 |  |  |  |
| Economic Flows: Legal services | 194 | TRUE | 0 |  |  |  |
| Economic Flows: Sacred hive-tending and flower-calling maintains honey production | 25 | TRUE | 0 |  |  |  |
| Economic Flows: Pottery and ceramics | 4 | TRUE | 0 |  |  |  |
| Economic Flows: Strategic controlTrade access fees | 28 | TRUE | 0 |  |  |  |
| Economic Flows: Books and manuscriptsPrinting services | 31 | TRUE | 0 |  |  |  |
| Economic Flows: Glassware | 7 | TRUE | 0 |  |  |  |
| Economic Flows: Fine textiles | 2 | TRUE | 0 |  |  |  |
| Economic Flows: Luxury manufactured goods | 9 | TRUE | 0 |  |  |  |
| NEED: {services} here depend on {goods}, grain and fuel brought in. | 2 | TRUE | 0 |  |  |  |
| Economic Flows: Temple stores supplement grain shortage | 12 | TRUE | 0 |  |  |  |
| NEED: {services} here depend on {goods}, iron and grain from outside, which the siege has cut off. | 7 | TRUE | 0 |  |  |  |
| Economic Flows: Strategic Crossroads TollTrade & entrepôtImpaired | 12 | TRUE | 0 |  |  |  |
| Economic Flows: Wine & SpiritsTrade & entrepôtImpaired | 45 | TRUE | 0 |  |  |  |
| Economic Flows: Banking & FinanceServiceExportImpaired | 47 | TRUE | 0 |  |  |  |
| Economic Flows: Medical ServicesServiceImpaired | 27 | TRUE | 0 |  |  |  |
| Economic Flows: Scholarly RevenueServiceExportImpaired | 51 | TRUE | 0 |  |  |  |
| Economic Flows: Foraging & SmallholdingFood securityImpaired | 17 | TRUE | 0 |  |  |  |
| Economic Flows: Pilgrimage & Holy SitesReligion & civicImpaired | 33 | TRUE | 0 |  |  |  |
| Economic Flows: All (#)Issues (#)Entrepôt (#) | 21 | TRUE | 0 |  |  |  |
| Economic Flows: Hunting & TrappingFood securityImpaired | 14 | TRUE | 0 |  |  |  |
| Economic Flows: Iron & MetalworkRaw materials & fuelImpaired | 28 | TRUE | 0 |  |  |  |
| Economic Flows: Furs & PeltsTrade & entrepôtImpaired | 40 | TRUE | 0 |  |  |  |
| Economic Flows: Divine & Magical HealingHealing & medicineImpaired | 24 | TRUE | 0 |  |  |  |
| Economic Flows: Beekeeping & WaxManufacturing & craftsImpaired | 15 | TRUE | 0 |  |  |  |
| Economic Flows: Salt & PreservationFood securityImpaired | 37 | TRUE | 0 |  |  |  |
| Economic Flows: Spices & DyesTrade & entrepôtImpaired | 25 | TRUE | 0 |  |  |  |
| Economic Flows: Storage & LogisticsTrade & entrepôtImpaired | 13 | TRUE | 0 |  |  |  |
| Economic Flows: Caravan & Overland TradeTrade & entrepôtImpaired | 7 | TRUE | 0 |  |  |  |
| Economic Flows: Camel Caravan TradeTrade & entrepôtImpaired | 8 | TRUE | 0 |  |  |  |
| Economic Flows: Reed & Marsh HarvestRaw materials & fuelImpaired | 10 | TRUE | 0 |  |  |  |
| Economic Flows: Bowyer & fletcherManufacturing & craftsImpaired | 13 | TRUE | 0 |  |  |  |
| Economic Flows: Mountain Pass ControlTrade & entrepôtImpaired | 1 | TRUE | 0 |  |  |  |
| Economic Flows: Harbour DuesTrade & entrepôtImpaired | 23 | TRUE | 0 |  |  |  |
| Economic Flows: Religious RevenueServiceExportImpaired | 9 | TRUE | 0 |  |  |  |
| Economic Flows: Arcane ServicesServiceExportImpaired | 41 | TRUE | 0 |  |  |  |
| Economic Flows: Port RevenueServiceExportImpaired | 45 | TRUE | 0 |  |  |  |
| Economic Flows: Alchemical TradeServiceExportImpaired | 18 | TRUE | 0 |  |  |  |
| Economic Flows: Horse & Animal TradeFood securityImpaired | 16 | TRUE | 0 |  |  |  |
| Economic Flows: FortificationsDefense & securityImpaired | 13 | TRUE | 0 |  |  |  |
| Economic Flows: Herbalism & RemediesHealing & medicineImpaired | 19 | TRUE | 0 |  |  |  |
| Economic Flows: Timber & LumberRaw materials & fuelImpaired | 13 | TRUE | 0 |  |  |  |
| Economic Flows: Stone & ConstructionRaw materials & fuelImpaired | 16 | TRUE | 0 |  |  |  |
| NEED: {services} here depend on {goods}, grain and fuel from outside, which the siege has cut off. | 1 | TRUE | 0 |  |  |  |
| Economic Flows: Mountain TimberRaw materials & fuelImpaired | 2 | TRUE | 0 |  |  |  |
| Economic Flows: Education & ScholarshipServiceExportImpaired | 31 | TRUE | 0 |  |  |  |
| Economic Flows: Boatbuilding & River TransportRaw materials & fuelImpaired | 4 | TRUE | 0 |  |  |  |
| Economic Flows: River TollTrade & entrepôtImpaired | 16 | TRUE | 0 |  |  |  |
| Economic Flows: Brewing & MaltingFood securityImpaired | 22 | TRUE | 0 |  |  |  |
| Economic Flows: Food ProcessingManufacturing & craftsImpaired | 6 | TRUE | 0 |  |  |  |
| Economic Flows: Leatherworking & CordwainingManufacturing & craftsImpaired | 12 | TRUE | 0 |  |  |  |
| Economic Flows: All (#)✓ Productive (#)Entrepôt (#) | 3 | TRUE | 0 |  |  |  |
| Economic Flows: Fuel & HeatingRaw materials & fuelImpaired | 17 | TRUE | 0 |  |  |  |
| Economic Flows: Meals and drinkPreserved foods | 1 | TRUE | 0 |  |  |  |
| Economic Flows: Alpine Wool and DairyRaw materials & fuelImpaired | 1 | TRUE | 0 |  |  |  |
| Economic Flows: Oasis Water and AgricultureRaw materials & fuelImpaired | 1 | TRUE | 0 |  |  |  |
| Economic Flows: Magical Items & EnchantingArcane & magicalImpaired | 9 | TRUE | 0 |  |  |  |
| Economic Flows: Pottery & BrickmakingManufacturing & craftsImpaired | 2 | TRUE | 0 |  |  |  |
| Economic Flows: Clay & CeramicsRaw materials & fuelImpaired | 2 | TRUE | 0 |  |  |  |
| Economic Flows: River Mill IndustryRaw materials & fuelImpaired | 4 | TRUE | 0 |  |  |  |
| Economic Flows: Silk & Luxury TextilesTrade & entrepôtImpaired | 8 | TRUE | 0 |  |  |  |
| Economic Flows: Luxury GoodsManufacturing & craftsImpaired | 8 | TRUE | 0 |  |  |  |
| Economic Flows: Mining & CoinageRaw materials & fuelImpaired | 9 | TRUE | 0 |  |  |  |
| Economic Flows: Shipbuilding and TimberRaw materials & fuelImpaired | 2 | TRUE | 0 |  |  |  |
| Economic Flows: Floodplain AgricultureRaw materials & fuelImpaired | 1 | TRUE | 0 |  |  |  |
| Economic Flows: Leather & HidesManufacturing & craftsImpaired | 1 | TRUE | 0 |  |  |  |

### Resources tab

| family | prints in (towns) | verdict | false towns | severity · kind | own or carried | example (town: the fact) |
|---|---|---|---|---|---|---|
| Gaps & Opportunities: No one here works the stone near {N}. | 55 | MIXED | 22 | MED b | THE STAGE'S OWN | r2r-town-16: Economics tab, same page: 'Stone & Construction' chain Running (From Stone quarry, Via Brickmaker, Outputs Quarried stone, Building materials, 'Contributes to Stone Quarrying - 5% of income'); record activeChains stone s |
| Gaps & Opportunities: No one here works the timber near {N}. | 27 | TRUE | 0 |  |  |  |
| Gaps & Opportunities: No one here works the medicinal herbs near {N}. | 21 | TRUE | 0 |  |  |  |
| Gaps & Opportunities: Work on the timber here stops half-way: no sawmill or carpenters' guild finishes it. | 4 | TRUE | 0 |  |  |  |
| Gaps & Opportunities: Gaps & Opportunities▲ | 49 | TRUE | 0 |  |  |  |
| Resource Exploitation: PartialMedicinal herbsvery high value (+ the re-filed name line 'Medicinal herbs') | 72 | MIXED | 12 | MED g | THE STAGE'S OWN | r2r-thorp-48: Economics tab, same page: 'The medicinal herbs around Huawan goes unworked; no house takes it up.' |
| Resource Exploitation: PartialTimbermedium value (+ 'Timber') | 184 | MIXED | 86 | LOW b | THE STAGE'S OWN | r2r-town-1: Roster has Sawmill (commercial) and Carpenters (5-15) - every house the card's chain names; timber chain running (Milled lumber, Barrels); exports Milled timber. 'Partial' understates (record files it Unexploited). |
| Resource Exploitation: PartialMountain timbermedium value (+ 'Mountain timber') | 17 | MIXED | 3 | MED g | THE STAGE'S OWN | r2r-village-57: Same tab: Nearby Resources lists Mountain Timber under 'Depleted', and the paragraph says 'Nobody at Tlalche bothers with the mountain timber this year: there is nothing left worth taking'; record mountain_timber conditi |
| Resource Exploitation: PartialAnimal hideshigh value (+ 'Animal hides') | 65 | MIXED | 20 | LOW b | THE STAGE'S OWN | r2r-city-7: Tanner (established) + Cobbler's guild + Furrier's district on roster; leather and leather_goods chains running. |
| Resource Exploitation: PartialAlpine pastureshigh value (+ 'Alpine pastures') | 37 | TRUE | 0 |  |  |  |
| Resource Exploitation: PartialWoolhigh value (+ 'Wool') | 54 | TRUE | 0 |  |  |  |
| Resource Exploitation: PartialFine glass sandhigh value (+ 'Fine glass sand') | 12 | TRUE | 0 |  |  |  |
| Resource Exploitation: PartialSalt panshigh value (+ 'Salt pans') | 23 | TRUE | 0 |  |  |  |
| Resource Exploitation: PartialMineral hot springshigh value (+ 'Mineral hot springs') | 4 | TRUE | 0 |  |  |  |
| Resource Exploitation: PartialCamel herdsvery high value (+ 'Camel herds') | 2 | TRUE | 0 |  |  |  |
| Resource Exploitation: PartialIron orevery high value (+ 'Iron ore') | 1 | TRUE | 0 |  |  |  |
| Resource Exploitation: UnexploitedMedicinal herbsvery high value | 22 | MIXED | 13 | LOW g | CARRIED | r2r-town-17: Same tab, below: 'Export Potential: healing potions, antidotes / Complete production chain in place'. Record: herbs filed fullyExploited; herbs imported ('Medicinal herbs', 'Ritual wood and herbs (ancient grove damaged)' |
| Resource Exploitation: UnexploitedFishmedium value (+ 'Fish') | 1 | FALSE | 1 | MED g | THE STAGE'S OWN | rr3w-town-under_siege+famine-rand-0: Fish market and Salt works stand, fishing chain 'Impaired' (not stopped) on the Economics tab, Overview says half the town is 'gutting, salting' fish, food is 'fish from the local waters', and Export Potential on the sam |
| Resource Exploitation: Needs: Salters' guild | 1 | UNSETTLED | 0 | LOW b | CARRIED | rr3w-town-under_siege+famine-rand-0: No Salters' guild on the roster (true), but Salt works stands and the record's fishing chain names Salt works as the house that salts the catch; the record cannot settle whether that is 'of its trade'. |
| Resource Exploitation: Needs: Sawmill, Charcoal burner | 3 | TRUE | 0 |  |  |  |
| Resource Exploitation: Needs: Sawmill | 3 | TRUE | 0 |  |  |  |
| Resource Exploitation: Needs: Apothecary, Alchemist shop | 2 | TRUE | 0 |  |  |  |
| Prose (strategic framing): "{N}'s position is worth watching over: whoever holds the ground holds what the assessment below names." | 77 | FALSE | 77 | MED h | CARRIED | r2r-metropolis-10: No assessment prints below (or anywhere on the page): the record's resourceAnalysis.strategicValue (e.g. 'Medium - controls caravan routes, water sources are strategic') is not shown; 0 of 77 pages carry it. The sentence |
| Prose (strategic framing): "The people of {N} know what their ground is worth to others, and know they could not keep it against anyone who came for it." | 61 | MIXED | 33 | MED g | CARRIED | r2r-metropolis-20: Defense tab: posture 'Fortress'; 'its defences would make any attack costly, so raiders and rivals look elsewhere'; Massive walls and fortifications, Multiple garrisons; strategicValue 'difficult to besiege'. |
| Prose (strategic framing): "Others want {N} for what it controls." | 71 | TRUE | 0 |  |  |  |
| Prose (strategic framing): "Anyone who looks at {N}'s position can see why someone would want to hold it." | 58 | TRUE | 0 |  |  |  |
| Prose (strategic framing): "For as long as others value {N}'s position, the <T> will have to reckon with who wants it..." | 57 | TRUE | 0 |  |  |  |
| Prose (strategic framing): "The people who live there see little of that value." | 71 | UNSETTLED |  | LOW c | CARRIED | rr3-metropolis-occupied-rand-3: The record holds no field saying how much of the position's worth leaves the town; r2s-insurgency-village-0's own Economics tab says 'There is no trade out. Whatever surplus there is stays'. Unsettleable; LOW. |
| Prose (strategic framing): "A newcomer to {N} soon hears what its ground is worth to the powers around it, and how little of that worth stays in the <T>." | 76 | UNSETTLED |  | LOW c | CARRIED | r2s-insurgency-village-0: The record holds no field saying how much of the position's worth leaves the town; r2s-insurgency-village-0's own Economics tab says 'There is no trade out. Whatever surplus there is stays'. Unsettleable; LOW. |
| Prose (partial): "The <T> takes the easy half of this trade and sells the rest of it to whoever will do the hard half." | 76 | MIXED | 16 | MED b | THE STAGE'S OWN | r2r-city-20: The town does the hard half itself: alpine_pasture finished by Dyer, Weavers/Textile workers, Tailor's guild and exported as Processed textiles |
| Prose (partial): "The <T> works part of the line that X could support: the raw material moves, and it moves before it has been made into anything worth more." | 26 | MIXED | 12 | MED b | THE STAGE'S OWN | r2r-town-47: Weavers/Textile workers on the roster; exports Processed textiles |
| Prose (partial): "X leaves {N} half-finished, and nobody in the <T> is troubled by it." | 27 | MIXED | 11 | MED b | THE STAGE'S OWN | r2r-town-37: Shipyard, Carpenters (5-15), Cooper on the roster; exports Barrels and containers, River craft, Cargo barges, Ship construction |
| Prose (full): "This is the trade the <T> is actually built on, and the <T> has taken it as far as it goes." | 52 | MIXED | 44 | MED c | THE STAGE'S OWN | rr3-metropolis-religious_conversion-rand-3: 'This trade' can only be the Fully exploited card above it (livestock); its income line is 4% of the town's income (top: Market Taxes 21%). |
| Prose (full): "Every stage of the X trade at {N} is done here, from the ground to the gate." | 26 | MIXED | 14 | LOW b | CARRIED | rr3-city-wartime-rand-4: No mine and no goldsmith on the roster, no precious-metals chain at all; the record's card still needs a Goldsmiths' guild (MED). |
| Prose (full): "The X in {N}'s country is worked all the way through: the ground gives it, H finishes it, and it leaves as G." | 41 | MIXED | 34 | HIGH a | THE STAGE'S OWN | r2r-village-5: No fisher, no fishmonger, no fish market, no fishing chain and no fish export (exports: Sea salt, River craft, Cargo barges) - the fish is not worked at all (HIGH a). |
| Prose (depletion): "Nothing more can be taken from the R at {N}." | 57 | TRUE | 0 |  |  |  |
| Prose (depletion): "The <T> has worked out its R, and it will not come back on its own: someone has to put labour and money into it before it yields again." | 52 | TRUE | 0 |  |  |  |
| Prose (depletion): "It has worked out its R." | 75 | TRUE | 0 |  |  |  |
| Prose (depletion): "Nobody at {N} bothers with the R this year: there is nothing left worth taking..." | 82 | TRUE | 0 |  |  |  |
| Prose (depletion): "Left alone, the ground will come back in time; until it does, the <T> buys what it used to take, or goes without." | 75 | TRUE | 0 |  |  |  |
| Prose (depletion): "Until somebody pays to open new workings, the hands that worked there are idle or gone elsewhere." | 57 | TRUE | 0 |  |  |  |
| Prose (unexploited): "There is X out there and nobody has ever thought it worth the trouble, which is the <T>'s considered opinion rather than an oversight." | 4 | MIXED | 2 | MED b | THE STAGE'S OWN | r2r-town-54: Economics tab: 'Stone & Construction' chain Running via Brickmaker, outputs Quarried stone, 'Contributes to Stone Quarrying - 7% of income'. |
| Prose (unexploited): "X has been there for {N} to take for as long as the <T> has stood, and nobody has found it worth the trouble." | 5 | TRUE | 0 |  |  |  |
| Prose (unexploited): "The <T> leaves its X unworked." | 4 | TRUE | 0 |  |  |  |
| Prose (unexploited): "It would fetch barely enough to pay for the digging." | 4 | MIXED | 3 | LOW h | CARRIED | rr3-hamlet-famine-rand-3: The resource is timber (managed woodland): timber is felled, not dug - wrong-kind word. |
| Prose (unexploited): "The <T> has the gold/silver ore; what it lacks is Smelter to start the work." | 1 | FALSE | 1 | LOW h | CARRIED | r2s-wartime-hamlet-1: True that no smelter stands and precious_metals is available; but the catalogue name prints bare as if a person ('lacks is Smelter'), and 'gold/silver ore' is the record's slash label. |
| Prose (unexploited): "There is gold/silver ore in {N}'s country worth real money and nothing in the <T> takes it out of the ground." | 2 | TRUE | 0 |  |  |  |
| Prose (unexploited): "Everybody in this <T> can point at the gold/silver ore, and nobody in this <T> is working it." | 1 | TRUE | 0 |  |  |  |
| Prose (unexploited): "gold/silver ore lies unworked around {N}, and anyone who knows its price elsewhere will want to change that." | 3 | TRUE | 0 |  |  |  |

### Defense and Magic tabs

| family | prints in (towns) | verdict | false towns | severity · kind | own or carried | example (town: the fact) |
|---|---|---|---|---|---|---|
| Supporting Capabilities: Legal InfrastructureNone | 86 | FALSE | 86 | MED g | THE STAGE'S OWN | r2r-town-4: record economicState.compound.inst.hasCourtSystem=true, hasPrison=false; roster law houses: none; the same Defense tab's Guard assessment says: "Offenders the town watch catches go before the court; there is little room  |
| Supporting Capabilities: No deterrence beyond force. | 86 | FALSE | 86 | MED g | THE STAGE'S OWN | r2r-town-4: record economicState.compound.inst.hasCourtSystem=true, hasPrison=false; roster law houses: none; the same Defense tab's Guard assessment says: "Offenders the town watch catches go before the court; there is little room  |
| Supporting Capabilities: Legal InfrastructurePrison only | 19 | FALSE | 19 | MED g | THE STAGE'S OWN | r2r-town-5: record economicState.compound.inst.hasCourtSystem=true, hasPrison=true; roster law houses: Small prison/stocks; the same Defense tab's Guard assessment says: "A wrong done here goes before the court, and the guilty can b |
| Supporting Capabilities: Detention without process. Arbitrary enforcement. | 19 | FALSE | 19 | MED g | THE STAGE'S OWN | r2r-town-5: record economicState.compound.inst.hasCourtSystem=true, hasPrison=true; roster law houses: Small prison/stocks; the same Defense tab's Guard assessment says: "A wrong done here goes before the court, and the guilty can b |
| Criminal Architecture & Public Order: Criminal structure: Semi-organized networks | 289 | MIXED | 36 | HIGH c,g | THE STAGE'S OWN | r2r-city-50: Power tab: Ruler Corrupt City Council (Criminal, power 39) governs the city; this same Defense section prints 'Underworld: Corrupt City Council · Dominant'; roster and this tab's 'Active criminal operations' hold 'Thieve |
| Criminal Architecture & Public Order: Criminal activity is coordinated enough to maintain routes and territories but lacks a single controlling authority. Sever | 289 | MIXED | 36 | HIGH c,g | THE STAGE'S OWN | r2r-city-50: Power tab: Ruler Corrupt City Council (Criminal, power 39) governs the city; this same Defense section prints 'Underworld: Corrupt City Council · Dominant'; roster and this tab's 'Active criminal operations' hold 'Thieve |
| Criminal Architecture & Public Order: Rival crews at {N} are fighting over who runs the streets, and until one wins, people pay both the cut and the brawling. A | 34 | MIXED | 3 | HIGH c,g | THE STAGE'S OWN | r2s-plague_onset-city-3: Power tab: Ruler Corrupt City Council (Criminal, power 23) governs the city; this same Defense section prints 'Underworld: Corrupt City Council · Significant' |
| Criminal Architecture & Public Order: Everyone at {N} knows someone takes a cut, but who it is changes by street and by season. Nothing sold at {N}'s black mark | 17 | MIXED | 5 | HIGH c,g | THE STAGE'S OWN | r2s-religious_conversion-city-3: Power tab: Ruler Corrupt City Council (Criminal, power 36) governs the city; this same Defense section prints 'Underworld: Corrupt City Council · Strong' |
| Criminal Architecture & Public Order: Everyone at {N} knows someone takes a cut, but who it is changes by street and by season. Anyone at {N} who knows whom to  | 37 | MIXED | 1 | HIGH c,g | THE STAGE'S OWN | r2s-recently_betrayed-metropolis-3: Power tab: Ruler Shadow Senate (Criminal, power 24) governs the metropolis; this same Defense section prints 'Underworld: Shadow Senate · Significant' |
| Criminal Architecture & Public Order: Criminal work at {N} is coordinated enough to hold routes and territories and not coordinated enough to have a head; sever | 32 | MIXED | 3 | HIGH c,g | THE STAGE'S OWN | r2r-metropolis-7: Power tab: Ruler Shadow Senate (Criminal, power 33) governs the metropolis; this same Defense section prints 'Underworld: Thieves' Guild · Dominant' |
| Criminal Architecture & Public Order: Criminal work at {N} is coordinated enough to hold routes and territories and not coordinated enough to have a head; sever | 6 | TRUE | 0 |  |  |  |
| Criminal Architecture & Public Order: Criminal work at {N} is coordinated enough to hold routes and territories and not coordinated enough to have a head; sever | 38 | MIXED | 5 | HIGH c,g | THE STAGE'S OWN | r2r-city-50: Power tab: Ruler Corrupt City Council (Criminal, power 39) governs the city; this same Defense section prints 'Underworld: Corrupt City Council · Dominant'; roster and this tab's 'Active criminal operations' hold 'Thieve |
| Criminal Architecture & Public Order: Everyone at {N} knows someone takes a cut, but who it is changes by street and by season. Goods moved by smuggling never p | 4 | TRUE | 0 |  |  |  |
| Criminal Architecture & Public Order: Everyone at {N} knows someone takes a cut, but who it is changes by street and by season. A smuggling network runs through | 1 | TRUE | 0 |  |  |  |
| Criminal Architecture & Public Order: Rival crews at {N} are fighting over who runs the streets, and until one wins, people pay both the cut and the brawling. A | 6 | MIXED | 1 | HIGH c,g | THE STAGE'S OWN | r2r-metropolis-0: Power tab: Ruler Shadow Senate (Criminal, power 39) governs the metropolis; this same Defense section prints 'Underworld: Shadow Senate · Dominant' |
| Criminal Architecture & Public Order: Criminal work at {N} is coordinated enough to hold routes and territories and not coordinated enough to have a head; sever | 2 | FALSE | 2 | HIGH g | THE STAGE'S OWN | r2r-metropolis-5: roster and this tab's 'Active criminal operations' hold 'Thieves' guild (powerful)'; the line's own next sentence says 'a thieves' guild settles them first' |
| Criminal Architecture & Public Order: Rival crews at {N} are fighting over who runs the streets, and until one wins, people pay both the cut and the brawling. N | 19 | MIXED | 1 | HIGH c,g | THE STAGE'S OWN | rr3w-metropolis-calm-river-0: Power tab: Ruler Shadow Senate (Criminal, power 36) governs the metropolis; this same Defense section prints 'Underworld: Shadow Senate · Dominant' |
| Criminal Architecture & Public Order: Rival crews at {N} are fighting over who runs the streets, and until one wins, people pay both the cut and the brawling. G | 9 | MIXED | 1 | HIGH c,g | THE STAGE'S OWN | rr3w-metropolis-famine-river-1: Power tab: Ruler Shadow Senate (Criminal, power 31) governs the metropolis; this same Defense section prints 'Underworld: Shadow Senate · Strong' |
| Criminal Architecture & Public Order: Everyone at {N} knows someone takes a cut, but who it is changes by street and by season. Nothing sold at {N}'s black mark | 14 | TRUE | 0 |  |  |  |
| Criminal Architecture & Public Order: Criminal work at {N} is coordinated enough to hold routes and territories and not coordinated enough to have a head; sever | 2 | FALSE | 2 | HIGH g | THE STAGE'S OWN | rr3-metropolis-indebted-rand-0: Power tab: Ruler Shadow Senate (Criminal, power 22) governs the metropolis; this same Defense section prints 'Underworld: Shadow Senate · Significant'; roster and this tab's 'Active criminal operations' hold 'Thieves' gu |
| Criminal Architecture & Public Order: Rival crews at {N} are fighting over who runs the streets, and until one wins, people pay both the cut and the brawling. T | 6 | FALSE | 6 | HIGH g | THE STAGE'S OWN | r2r-metropolis-25: roster and this tab's 'Active criminal operations' hold 'Thieves' guild (powerful)'; the line's own next sentence says 'The thieves ... answer to a guild, and the guild decides who works which streets' |
| Criminal Architecture & Public Order: Everyone at {N} knows someone takes a cut, but who it is changes by street and by season. Whatever {N}'s gangs take in nev | 1 | TRUE | 0 |  |  |  |
| Criminal Architecture & Public Order: Rival crews at {N} are fighting over who runs the streets, and until one wins, people pay both the cut and the brawling. W | 3 | TRUE | 0 |  |  |  |
| Criminal Architecture & Public Order: Criminal work at {N} is coordinated enough to hold routes and territories and not coordinated enough to have a head; sever | 5 | TRUE | 0 |  |  |  |
| Criminal Architecture & Public Order: Rival crews at {N} are fighting over who runs the streets, and until one wins, people pay both the cut and the brawling. W | 3 | TRUE | 0 |  |  |  |
| Criminal Architecture & Public Order: Rival crews at {N} are fighting over who runs the streets, and until one wins, people pay both the cut and the brawling. N | 15 | MIXED | 2 | HIGH c,g | THE STAGE'S OWN | rr3-city-famine-rand-0: Power tab: Ruler Corrupt City Council (Criminal, power 23) governs the city; this same Defense section prints 'Underworld: Thieves' Guild · Significant' |
| Criminal Architecture & Public Order: Everyone at {N} knows someone takes a cut, but who it is changes by street and by season. A smuggling network runs through | 6 | TRUE | 0 |  |  |  |
| Criminal Architecture & Public Order: Criminal work at {N} is coordinated enough to hold routes and territories and not coordinated enough to have a head; sever | 9 | TRUE | 0 |  |  |  |
| Criminal Architecture & Public Order: Rival crews at {N} are fighting over who runs the streets, and until one wins, people pay both the cut and the brawling. A | 2 | TRUE | 0 |  |  |  |
| Criminal Architecture & Public Order: Everyone at {N} knows someone takes a cut, but who it is changes by street and by season. Goods moved by smuggling never p | 2 | TRUE | 0 |  |  |  |
| Criminal Architecture & Public Order: Everyone at {N} knows someone takes a cut, but who it is changes by street and by season. Criminal gangs at {N} keep a foo | 2 | TRUE | 0 |  |  |  |
| Criminal Architecture & Public Order: Criminal work at {N} is coordinated enough to hold routes and territories and not coordinated enough to have a head; sever | 4 | TRUE | 0 |  |  |  |
| Criminal Architecture & Public Order: Everyone at {N} knows someone takes a cut, but who it is changes by street and by season. The thieves at {N} answer to a g | 3 | FALSE | 3 | HIGH g | THE STAGE'S OWN | rr3-metropolis-occupied-rand-4: roster and this tab's 'Active criminal operations' hold 'Thieves' guild (powerful)'; the line's own next sentence says 'The thieves ... answer to a guild, and the guild decides who works which streets' |
| Criminal Architecture & Public Order: Rival crews at {N} are fighting over who runs the streets, and until one wins, people pay both the cut and the brawling. F | 1 | FALSE | 1 | HIGH g | THE STAGE'S OWN | rr3-metropolis-recently_betrayed-rand-0: Power tab: Ruler Shadow Senate (Criminal, power 30) governs the metropolis; this same Defense section prints 'Underworld: Shadow Senate · Strong'; roster and this tab's 'Active criminal operations' hold 'Thieves' guild ( |
| Criminal Architecture & Public Order: Everyone at {N} knows someone takes a cut, but who it is changes by street and by season. Criminal gangs at {N} keep a foo | 2 | TRUE | 0 |  |  |  |
| Criminal Architecture & Public Order: Rival crews at {N} are fighting over who runs the streets, and until one wins, people pay both the cut and the brawling. C | 1 | TRUE | 0 |  |  |  |

### The PDF text and the Foundry journal

| family | prints in (towns) | verdict | false towns | severity · kind | own or carried | example (town: the fact) |
|---|---|---|---|---|---|---|
| – (processing/output cells of a resource row moved to Partial) | 422 | MIXED | 131 | MED b/g | CARRIED | r2r-town-1: Roster holds Sawmill (commercial) and Carpenters (5-15); the same PDF's chain card prints 'Timber & Lumber · Active: Managed woodland » Sawmill + Carpenters + Carpenter » Barrels and containers, Milled lumber'. |
| partial (grade word of a resource row moved from Unexploited) | 422 | MIXED | 3 | MED c/g | CARRIED | r2r-town-58: resourceConditions mountain_timber=depleted; the same PDF: 'NEARBY RESOURCES Depleted … Mountain Timber' and 'The nearby alpine pasture and mountain timber are used up.' |
| PARTIALLY EXPLOITED (group header) / # (its count) | 350 | MIXED | 12 | LOW e | CARRIED | r2r-thorp-10: One resource (glass_sand) printed twice, from the record's two chain cards ('sand' and 'desertGlass'); the count 2 is one resource. |
| unprocessed / no output / UNEXPLOITED / unexploited (rows moved Partial/Full → Unexploited) | 23 | TRUE | 0 |  |  |  |
| Sawmill / Sawmill, Charcoal burner (houses an Unexploited row still needs) | 3 | TRUE | 0 |  |  |  |
| Criminal structure · Semi-organized networks + its note ('… lacks a single controlling authority. Several gangs may be competing …') | 289 | TRUE | 0 |  |  |  |
| <good> (transit) export pills: Rare spices and exotic dyes 219, Preserved foods 114, Furs and pelts 74, Extraplanar goods 40, Caravan trade goods 30, Exotic imp | 430 | TRUE | 0 |  |  |  |
| <good> (transit) (taxed by occupation): Rare spices 7, Preserved foods 6, Furs and pelts 1 | 14 | TRUE | 0 |  |  |  |
| None recorded (under LOCAL PRODUCTION) | 217 | MIXED | 68 | MED g/b | CARRIED | r2r-thorp-16: Same block: EXPORTS Raw wool, Live sheep, Coal; record localProduction holds wool, livestock, coal. |
| None significant (EXPORTS/IMPORTS) | 15 | MIXED | 3 | LOW g | CARRIED | r2r-hamlet-28: Same PDF cover: 'Top export: Salted fish'; Economy: 'Its income rests on salted fish'; chain card 'Fishing & Seafood · Active · EXPORT yes'. Famine with failedSource fish — the cover lines are the false ones. |
| Low / Medium (gap severities), GAPS & OPPORTUNITIES (header) | 102 | TRUE | 0 |  |  |  |
| No one here works the stone near {N}. | 55 | MIXED | 18 | MED g/b | THE STAGE'S OWN | r2r-town-16: Same PDF: 'Stone & Construction · Active · EXPORT yes: Stone quarry » Brickmaker » Quarried stone, Building materials'; income 'Stone Quarrying 5% — Local quarry provides dressed stone'; record chain stone=running. |
| No one here works the timber near {N}. | 27 | TRUE | 0 |  |  |  |
| No one here works the medicinal herbs near {N}. | 21 | TRUE | 0 |  |  |  |
| Work on the timber here stops half-way: no sawmill or carpenters' guild finishes it. | 4 | TRUE | 0 |  |  |  |
| Supporting capabilities: Arcane Support · None ('No arcane practitioners on the rolls…'); Legal Infrastructure · None | 84 | MIXED | 7 | LOW g | THE STAGE'S OWN | r2r-town-36: Same block, lines above: 'Arcane defense · Alchemist shop'; roster holds Alchemist shop; traditions.hasArcane=true. |
| No deterrence beyond force. | 86 | TRUE | 0 |  |  |  |
| Prison only / Detention without process. Arbitrary enforcement. | 19 | TRUE | 0 |  |  |  |
| - **Chain** / - **Chain** *(impaired)* / - **Chain** *(magically sustained)* (journal supply-chain lines) | 600 | FALSE | 600 | HIGH h | CARRIED | r2r-thorp-10: The town's chains are 'Foraging & Smallholding' and 'Faith & Worship'; every supply-chain line of the journal prints the placeholder 'Chain' for the name (23,653 lines in 1,824 towns; no chain name anywhere on the page). |
| - **Exports:** <row> (journal) | 481 | MIXED | 38 | HIGH c (13 HIGH), h (19 LOW), c (6 LOW) | CARRIED | r2s-famine-village-1: Famine with foodRecord.failedSource='fish', famineCutPct 65, both fishing chains on river_fish; it exports the very food that failed. |
| \| <resource> \| partial \| — \| — \| (journal exploitation rows) | 422 | MIXED | 145 | MED b/g (131), c (3), e (12) | CARRIED | r2r-town-1: Sawmill (commercial) + Carpenters on the roster; Timber & Lumber chain running, Milled lumber. |
| \| <resource> \| unexploited \| … \| (journal exploitation rows, moved or needs-only) | 26 | TRUE | 0 |  |  |  |

## Not read, said plainly
- **The Tonight sheet and the exports** (JSON, the Markdown export): no line of the stage prints there by the diff of its readers. I did not render them.
- **The other two PDF variants** (draft brief, timeline packet): only the canon dossier was read.
- **Pills checked for own-or-carried:** in the example towns of each false family (about 25 towns), not pill by pill in all 1,824.
- **Lines the stage REMOVED:** 22,048 on the tab, 23,175 in the PDF, 2,709 in the journal. These are step 2's (thirty of each removal read for truth), after this push.
- **The readers' verdicts** I took as returned, after checking the sample named at the top. A reader's MED or HIGH that I re-ranked is marked so above.
