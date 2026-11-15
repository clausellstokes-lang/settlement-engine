# TAIL-DISPLAY-ECON · hand-back

Seat: TAIL-DISPLAY-ECON (builder). Branch `lane/tail-display-econ-2026-11-14`, cut from the joined line `lane/join-2026-11-14` at **bcad1a358** (read back from origin, 2026-11-14). Worklist: `docs/chair/2026-11-14/read-all/WORKLIST-DISPLAY-ECON.{md,json}` on the chair's lane (156 rows, read at e5b421802). One batch cured; I'm handing back by file at the budget, with the rest of the worklist below.

## The rulings worked to (the chair's, 2026-11-14; each vetoable by the owner)

- **(X1)** Most rows have no traced writer: find each row's writer (component, leaf, record field) first, then cure by writer.
- **(X2)** A chain's state and a house's work have one home: a flow printed Running, Impaired or active, and a card's outputs, read the record's own chain state and gaps. "Economic Flows (N active, M impaired)" counts what the cards under it show.
- **(X3)** "Nothing structural depends on arcane work" and "Reliance on magic: None" beside a share of the food made by magic, and food "by magic" where the food record shows none: ONE reader of the food record's magic share (magicSource.js and magicProvisionShown.js are this seat's).
- **(X4)** "Production: N lbs/day + M imported" agrees with the food record's own figures (one rounding, one home). An income row's own words are the DEFECON seat's writer (economicState.js): such rows are NAMED for it.
- And the method's laws (BRIEF-TAIL C): silence is true, but a line stays in its pool unless the town makes it false; a mute state takes a twin; no draw moved; one home for one fact; no new vocabulary word.

## Writers found (X1)

| rows | section · words | writer (component · leaf · record field) |
|---|---|---|
| B06680 | Economics · "Economic Flows (N active · M impaired)" | `EconomicsTab.jsx :: EconomicFlowsSection` header; cards' states from `chainStateShown.js :: chainAsShown` over `economicState.activeChains[].status`; services by `serviceStateShown` |
| B10927, 13751, 13120, 03456, 04478 | Economics · a card's state chip | `chainStateShown.js :: chainStateShown` (the record's `status`, a famine's failed ground, a siege's stopped field work and trade); services: `serviceStateShown` (not this seat's leaf: shared with the PDF and the journal) |
| 04405 12736 04329 B10244 11407 09786 B06484 B12005 B15876 B05118 B07375 B17929 B06493 B15685 B15874 04499 B09873 B03722 B11290 B17206 04474 23037 | Economics card note · Magic tab "Chain: note" | the record's `activeChains[].magicNote` (written only by `generators/chainMagicSubstitution.js`), printed through `magicProvisionShown.js :: magicNoteShown` on the card; the Magic tab printed the raw note (`MagicTab.jsx`, the dependence block) |
| 15124 | Magic · "Nothing structural at X depends on arcane work." | the DS-DEF-9 desk (`magicDeskRead.js` → `defenseStateProse.js`), handed the flag from `dossierViewModel.js :: magicRelianceDeskSettlement` ← `magicReliance.js :: deriveMagicReliance` |
| 16001 16002 16003 16004 | Economics · "Production: N lbs/day + M imported + K by … provision" | `EconomicsTab.jsx` stat row ← `foodRowShown.js` ← `economicState.foodSecurity.{dailyProduction, importCoverage, magicOffset}` |
| 00600, 12888 | Economics · "X grows about … of what it eats, and carts bring in …" / "… provision makes up … of what it eats" | `EconomicsTab.jsx :: foodSentence` (shares over `dailyNeed`) |
| 14073 14072 14075 | Outlook · "Much of what X eats is brought in …; its own land does not produce enough." | `dossierViewModel.js` viability summary (the `covered` pool's fourth line) |
| 12961 | Economics · "Many households go short, and a bad season would bring real hunger." | `EconomicsTab.jsx :: shortWords` (famine-aware, not siege-aware) |
| 22206, 16853, B19491 | Economics · "The table rests on …" | `domain/foodways.js` (the foodways line) |
| 30975 30931 30978 30974 30977 30946 30945 30947 30972 30973 30928 30929 30930 B29875 B29918 B29904 30938 30976 B29880 B29879 B29902 B29878 30964 B29920 B29905 | Resources · "What the land offers: ✓ …" | `ResourcesTab.jsx` header chips ← `resourceAnalysis.economicStrengths` (`resourceGenerator.js` keeps a terrain strength only where the town's own resources or route stand under it) |
| 14553 14551 14550 14543 14549 14545 14542 14547 20768 20234 20769 22241 22240 20767 22405 22229 29070 11963 14649 23340 B29895 | Resources · "No one here works …", "leaves its X unworked", "Unexploited", "✓ Fully exploited" | `validationOnPage.js :: exploitationGroupsShown` / `tradeListDisplay.js :: needMetBy` / `chainWorking.js` |
| B12001 B14840 B15067 07801 04674 16360 B15904 | Economics · export / product pills | `tradeListDisplay.js :: tradeListsAsPrinted` / `chainOutputsShown` |
| 05780 B09326 05779 23075 05224 | Economics · income rows and "Contributes to X - N% of income" | the income source's words: `economicState.js` (DEFECON, X4); the card's "Contributes to" line: `EconomicsTab.jsx` |
| 12560 12562 B12337 B04742 09824 | Economics · a card's need sentence | `chainNeedShown.js :: chainNeedLine` |
| 14404 B13482 14395 14400 14242 | Economics · "Needed, and not brought in: …" | `EconomicsTab.jsx :: NeedsNotMet` ← `tradeListDisplay.js :: importsAsPrinted` |
| B28xxx / B29xxx resource-chip runs | Resources / Economics · resource chips | `resourceAnalysis.availableResources` / `config.nearbyResources` chips (`ResourcesTab.jsx`, Nearby Resources) |

## Batch 1 · the Economic Flows header (X2) and the food claims of magic (X3)

Commit: see `git log` on this branch ("fix(TAIL-DISPLAY-ECON · 1)"). Census before = the base bcad1a358 (`census3.sh`, 720 towns); census after = the cured tree. Inventory diff: `sentences: before 29874 after 29873 · gone 14 · new 13 · in fewer towns 30 · in more towns 0`.

**The cures**
- `EconomicsTab.jsx :: flowHeaderCount` (new, end of file; the header line keeps its place): "N active" counts only cards that print a working state (running, operational, entrepôt, vulnerable, magically sustained). "M impaired" counts impaired chain cards plus service cards that print Impaired. A card that prints no state (a neighbour's house) is neither. With nothing at work the header reads "(M impaired)", and with neither it is the bare "Economic Flows".
- `magicProvisionShown.js`:
  - `foodMagicShare(record)` (new) is THE ONE READER of the food record's magic share (`foodSecurity.magicOffset / dailyNeed`).
  - `MAGIC_FOOD_NOTES` (new) is every note of the substitution step's food branch, derived from `MAGIC_NOTE_TRADITION` minus its five non-food notes.
  - `magicNoteShown` prints a food note only where `foodMagicShare > 0`. Two twins, true in the state that made the old wording false: "Blessed stores; divine provision fills the gap" → "Blessed stores; divine provision **eases the shortfall**" wherever the food record still has a deficit, which is every town with divine provision in this census. "Druidic cultivation supplements depleted farmland" → "Druidic cultivation supplements **the depleted ground**" on a chain whose ground is not grain fields or floodplain (grazing land, salt flats, foraging).
  - The card, the PDF and the Foundry journal all read this note through `chainAsShown`, so all three follow.
- `MagicTab.jsx`: the dependence block's chain notes print the card's own note (`magicNoteShown`), not the raw record note. One home: a note the card withholds is not printed on the Magic tab.

**Rows cured** (towns printing before → after; the measure before is the count of printing towns where the record makes the line false, by script over `corpus.ndjson.gz`)

| id | line | printing before → after | false by record before |
|---|---|---|---|
| B06680 | Economic Flows (# active · # impaired) | 297 → 292 (the fold folds the figures: the count is cured in place) | header ≠ its cards in **460 of 715** towns with flows → 0 (by `flowHeaderCount` over the records) |
| 04405 | Blessed stores; divine provision fills the gap | 28 → 0 | 28 |
| 12736 | Livestock & Dairy: Blessed stores; … fills the gap | 23 → 0 | 23 |
| 04329 | Beekeeping & Wax: Blessed stores; … fills the gap | 22 → 0 | 22 |
| B10244 | Horse & Animal Trade: Blessed stores; … fills the gap | 21 → 0 | 21 |
| 11407 | Hunting & Trapping: Blessed stores; … fills the gap | 18 → 0 | 18 |
| 09786 | Grain & Bread: Blessed stores; … fills the gap | 18 → 0 | 18 |
| B06484 | Druidic cultivation supplements depleted farmland | 35 → 2 | 33 |
| B12005 | Livestock & Dairy: Druidic cultivation … depleted farmland | 21 → 0 | 20 |
| B15876 | Salt & Preservation: Druidic cultivation … depleted farmland | 5 → 0 | 5 |
| B05118 | Conjured game produces fish; minor supplement | 6 → 1 | 5 |
| B07375 | Fishing & Seafood: Conjured game produces fish; … | 4 → 1 | 3 |
| B17929 | Temple stores supplement grain shortage | 6 → 1 | 5 |
| B06493 | Druids call fish and bless the waters | 9 → 3 (still in the town read) | 6 |
| B15685 | River Fishing: Druids call fish and bless the waters | 4 → 1 | 3 |
| B15874 | Salt & Preservation: Arcane quickening of growth … | 4 → 2 (still in the town read) | 2 |
| 04499 | Brewing & Malting: Arcane quickening of growth … | 3 → 1 | 2 |

Each row fell by exactly its measure; B12005 fell by 21 against a measure of 20. Its 21st town prints the twin "Livestock & Dairy: Druidic cultivation supplements the depleted ground", so the old line was false there too (grazing land is not farmland). The two rows "still in the town read" are towns where the food record does hold a provision: the line is true there and stays.

**Every other line that prints in fewer towns, explained**
- The other food-branch notes and their "Chain: note" forms (Druidic animal husbandry 21 → 7, Temple fishing rites, Druidic grain-blessing, beast-callers, hive-tending, Arcane quickening, Conjured game; 14 gone or fewer in all): the same cure. In each lost town the food record holds no provision.
- "Economic Flows (# active)" 418 → 390: 28 thorps and hamlets whose every card prints no state (a neighbour's house); the bare "Economic Flows" inherits them.
- "Economic Flows (# active · # impaired)" 297 → 292: 5 towns where every card is impaired; "Economic Flows (# impaired)" inherits them (r2s-under_siege-thorp-0 is the town the row was read in).
- "Herbalism & Remedies: Divine healing supplements mundane medicine" 41 → 29, plus one town 1 → 0 on "Divine & Magical Healing: …": the Magic tab now prints the card's own note, and the card already left out a divine note where the defence holds no divine tradition (W2-C-LEAVES-5 item 5, record 387). False there by that ruling.

**The inheritors, read where they print:** the bare "Economic Flows" (28: thorps and hamlets, e.g. r2r-thorp-0; its one card is "Faith & Worship" through "Access to parish church", which prints no state). "Economic Flows (# impaired)" (5: siege thorps and hamlets plus r2r-hamlet-0 and r2r-hamlet-28; every card is Impaired). The two note twins (listed below). All are true where they print.

**THE VETO LIST: every new or changed line, with the towns it was read in**
1. "Economic Flows" (the header with no count, where no card prints a state): r2r-thorp-0 (thorp), r2s-famine-hamlet-1 (hamlet, famine), r2s-under_siege-thorp-1 (siege), r2s-occupied-thorp-0 (occupation). Sizes reached: thorp to hamlet.
2. "Economic Flows (N impaired)" (where every card is impaired): r2s-under_siege-thorp-0 (thorp, siege), r2s-under_siege-hamlet-1 (hamlet, siege), r2r-hamlet-28. Sizes reached: thorp to hamlet.
3. "Economic Flows (N active · M impaired)": the same words. "N active" now leaves out the impaired and the stateless cards, and M takes in service cards that print Impaired: r2r-town-9 (15 active · 2 impaired at the base).
4. "Blessed stores; divine provision eases the shortfall": r2s-mass_migration-village-0 (village, smallest), r2r-metropolis-12 (metropolis, largest), r2s-under_siege-town-0 (siege), r2r-town-9.
5. "Druidic cultivation supplements the depleted ground": r2s-famine-city-2 (city, smallest; famine), r2r-metropolis-49 (metropolis, largest; salt flats), r2s-occupied-metropolis-3 (occupation).

**The test:** `tests/components/displayEconFlowsMagicFood.test.jsx` (births of the census's own seeds).
- Seven NOT pairs: each red at the base (shown in a detached worktree at bcad1a358) and each naming what prints instead or that the slot is silent.
- Two twins: red at the base by design.
- Three KEEP pairs plus anchors: green before and after.
- All green on the cure. The base run is the plant: the same test, run against the uncured leaves, reds every pair.

`tests/components/economicsClergyProvision.test.jsx` re-keyed by identity: its kept divine and druid notes are now read as the card prints them (`magicNoteShown`). The town and the claim are the same, and the kept note's words follow the X3 cure.

**Gates** (the cured tree; reds carried from the base named):
- strict domain: 1113 errors against a ceiling of 1113.
- type ratchet: 167 against 167.
- eslint on the touched files: clean.
- presumed-things walker `--check`: fresh 147 at the base and 147 after. (A first form restated the food notes and added 4 house-word hits; derived from the table instead, it adds 0.)
- twelve-birth grid: exit 0, 2 falls, no rise.
- the 62 test files naming the touched files: green but `tests/ui/defenseTabFlow.test.js` "STOP-2: no Arcane defense force group in a dead-magic world", which is red at the base: CARRIED.

**Struck, each with its reason**
- **B10927** "Impaired" (302): the chip is the record's own `impaired`, or the state the chair ruled for a crisis in force (a famine's failed ground; a siege's stopped field work and trade, `chainStateShown.js`). The reader's LAND line gave the record's calm status, not the crisis state. True.
- **16001, 16002, 16003, 16004** (the food row's import, 138/19/43/37): the row prints the food record's own `foodSecurity.importCoverage` in **447 of 447** towns that print an import. The readers' header figure is the viability view's (`economicViability.metrics.foodBalance`, via `aiLayer.js`), which agrees in only 240. X4 is met; the record's two homes disagree (named below).
- **13120** "Mercenary Forces · Operational" (59): the chain runs through the "Free company hall", which stands on the roster (r2s-plague_onset-town-0). "Hired: none" is the defence's own hire, not the hall's work.
- **B09873** "Divine healing supplements mundane medicine" (41): the step sets such a chain to vulnerable, and "supplements" claims no more than that.
- **B03722, B11290, B17206** "Arcane fabrication … partially offset depleted extraction": the step sets the chain to vulnerable, and the ground is depleted in 60 of the 60 cards that print it. "Partially offset" is what the record holds.
- **30953, 14219**: gone at the base.

**Named for other seats** (one line each, to the chair)
- **15124** "Nothing structural at X depends on arcane work." (135; false by record in **13**) and "Reliance on magic: None/Present" beside a food provision (**52** towns where `foodMagicShare > 0` and the reliance reading is not relied-upon) → `src/domain/magicReliance.js :: deriveMagicReliance`, the ONE reading: Overview, Magic and Foundations print its word (pinned by `magicOneAnswer.test.jsx`), and the DS-DEF-9 desk reads its flag (`dossierViewModel.js :: magicRelianceDeskSettlement`). The cure is there: the food record's provision (`magicProvisionShown.js :: foodMagicShare`, now the one reader) counted as a dependent, ideally from a share of about a fifth up, where the food sentence says "about a fifth". A first form here silenced the Magic tab's row and desk line, but that split the one answer across three tabs and silenced true desk lines in 52 towns, so it was withdrawn.
- **"✦ Magically Sustained"** on a food chain whose note now leaves (the food record has no provision) → `chainStateShown.js` / the step's `status`.
- **14073, 14072, 14075** (Outlook) → `dossierViewModel.js`: the fourth line of the `covered` pool needs a share condition (imports a large part of the need).
- **05780, B09326, 05779, 23075, 05224** (income rows' words) → DEFECON (`economicState.js`), X4.
- **RECORD:** the food record (`foodSecurity`) and the viability view (`economicViability.metrics.foodBalance`) disagree on the import in 207 of 447 towns. The readers' header read the view.

**Registers:** none re-taken. EconomicsTab.jsx's line-keyed prose-numerics rows: the header was changed in place and the helper appended at the end, so no row above moved. MagicTab.jsx: one import added at the end. No register named stale.

**Declared moves:** none. No generator or data file was touched, and the record is unchanged.

## What is left of the worklist (by writer, for the next seat)

- **EconomicsTab.jsx (this seat's):**
  - 00600 and 12888: the food sentence's shares are of the need but say "of what it eats". Candidate: "of what it needs"; a short town eats less than its need.
  - 12961: `shortWords` is famine-aware only; a siege with no imports needs "hunger is already here".
  - The card's "Contributes to X" line under a siege or famine (05780, 05779).
  - "Needed, and not brought in" (14404, B13482, 14395, 14400, 14242: verify against the import pills and the roster).
- **ResourcesTab.jsx (this seat's):** the "What the land offers: ✓ …" rows (30975 and kin, about 25 rows). The strengths are filtered by the town's own resources or route (`resourceGenerator.js`), so the land does offer them. The readers took "✓" for "worked". Likely struck, but verify the depleted-only supports first.
- **tradeListDisplay.js / chainWorking.js / chainNeedShown.js / foodBalanceBar.js (this seat's):** the "No one here works …" and "leaves its X unworked" rows (14553 and kin, about 20) against TRADE made-here; the export pills under a famine or siege (B12001, B14840, B15067); the need line's "gate control" without gates (12560, 12562); "brought in by magic" (B12337, B04742).
- Not reached: the resource-chip runs (B28xxx and B29xxx, one town each).

## How the instruments are re-made

```
git fetch origin lane/chair-2026-11-08 lane/census-3-2026-11-14 lane/round-3-cut-2026-11-13
git archive origin/lane/chair-2026-11-08 docs/chair/2026-11-14/probes/READ-ALL | tar -x -C <scratch>/inst
git archive origin/lane/census-3-2026-11-14 docs/chair/2026-11-14/probes/CENSUS-3 | tar -x -C <scratch>/inst
sh <scratch>/inst/docs/chair/2026-11-14/probes/CENSUS-3/census3.sh <tree with node_modules> <out> 4
python3 <scratch>/inst/docs/chair/2026-11-14/probes/READ-ALL/inventory.py <out> <out>.json
python3 <scratch>/inst/docs/chair/2026-11-14/probes/READ-ALL/inventory_diff.py before.json after.json <rows.json>
```
The record probes (the header count, the food-note measure, the food row's import) are node scripts that import the tree's own leaves (`chainStateShown.js`, `magicProvisionShown.js`, `dossierViewModel.js`) over `corpus.ndjson.gz`, with the census's `load.mjs`. Each is a few lines and kept in the seat's scratch, outside every tree.

---

# TAIL-DISPLAY-ECON-2 · the successor's batches

Seat: TAIL-DISPLAY-ECON-2 (builder), succeeding TAIL-DISPLAY-ECON on the same branch, continued from its tip **6e36000a4** (read back from origin, 2026-11-15). Work in a scratch worktree (detached at the tip; pushed by explicit refspec). The joined line has since moved to 48fedbe98; this branch merges nothing.

## The chair's rulings since (2026-11-15 00:10 UTC; each vetoable by the owner)

- **(X9)** The exports' read (`read-all-3/WORKLIST3-DISPLAY-ECON.md`) found one row of these files that only the PDF and the journal print (29296): taken with its writer's batch. The two EXPORTS seats hold `src/pdf/` and `src/foundry/` and call the tabs' leaves: a changed leaf signature (`foodMagicShare`, `tradeListDisplay`, `chainNeedShown`) is said to the chair in the batch line.
- **(X10)** `src/domain/magicReliance.js` is this seat's whole. "Reliance on magic: None" beside a food record that holds a provision by magic (52 towns), and row 15124: ONE HOME FOR ONE FACT: `deriveMagicReliance` reads the food's share by magic through `foodMagicShare`; verify by the record, measure all its readers by the inventory diff, say every sentence that moves.
- **(X11)** The stores sentence under a crisis gets an optional second argument (the crisis) from the CRISIS seat on its branch (`foodStoresWords`): the Economics tab's stores call is LEFT AS IT IS and named (below); a later seat passes the crisis in after the landing. `shortWords` and the tab's own sentences are this seat's: 12961 is cured from the crisis the tab already holds.
- **(X12)** "of what it eats" (00600, 12888): "of what it needs" is accepted if the record's shares are of the need: the measure is said; the new words go on the veto list.
- **(X13)** The Outlook rows 14073, 14072, 14075 are `dossierViewModel.js`'s. CORRECTED by the chair (2026-11-15): that file is the DEFECON group's, and the three rows went to TAIL-DEFECON-D. Not this seat's.

## Batch 2 · the reliance reading counts the food provision (X10); the food sentence's shares are of the need (X12); a siege's hunger (12961); gate control (12560, 12562); a stopped card's income (05779, 05780)

Census before = the tip 6e36000a4 (`census3.sh`, 720 towns); census after = the cured tree. Inventory diff: `sentences: before 29873 after 29886 · gone 57 · new 70 · in fewer towns 40 · in more towns 24 · moved 3`.

**The cures**
- `magicReliance.js`: `foodMagicShare` is DEFINED here now (moved whole, unchanged) and `magicDependents` counts the food supply (`FOOD_SUPPLY_DEPENDENT`, never printed) where `foodMagicShare > 0`. `display/magicProvisionShown.js` re-exports `foodMagicShare` unchanged (same name, same signature: no leaf signature changed for the EXPORTS seats); moved because the reading lives below the display leaf (magicProvisionShown → magicSource → magicReliance), so no import cycle is added.
- `facts/magicSource.js`: the reliance line's "supplied by" names, for the food supply, the houses of the provision's tradition (the kind word its note opens on, `foodBalanceBar.js :: magicFoodChannelWord`; 'magical' names none). No town newly relying on magic is left with an unstatable (silent) reliance line: 0 of 52.
- `EconomicsTab.jsx :: foodSentence`: "grows … of what it needs" and "… provision makes up … of what it needs" (X12). THE MEASURE: both shares are of the need by construction (`dailyProduction / dailyNeed`, `magicFoodOffset / dailyNeed`, `foodRowShown.js`'s figures). Before, the sentence printed "of what it eats" 370 times in 259 towns, and in 111 of those printings the band word was wrong for what a short town eats (the need less the shortfall). After: 0 printings of "of what it eats" from this writer.
- `EconomicsTab.jsx :: foodSentence → shortWords(pct, famine || tradeStoppedHere(s))`: under a siege that stopped the trade, the short clause takes the famine's twin ("hunger is already here").
- `chainNeedShown.js :: chainNeedLine`: a service with "gate" in it is named only where a gate or a wall stands (`facts/defence.js :: defenceOf`: `gate || walls`; a palisade has its gate). Same signature.
- `EconomicsTab.jsx` (the flow card): "Contributes to X - N% of income" is not printed on a card the crisis stops (`chainCrisisStateShown` of the card read as running is `impaired`: a famine's failed ground, a siege's stopped field work or trade). Changed in place on lines 119 and 244 (no line-keyed register row moves).

**Rows cured** (towns printing before → after; the measure = printing towns where the record makes the line false)

| id | line | printing before → after | false by record before |
|---|---|---|---|
| 15124 | Nothing structural at X depends on arcane work. | 135 → 122 | 13 (foodMagicShare > 0) |
| (X10) | Reliance on magic: None | 416 → 366 | 50 (+2 "Present" → Integral) |
| 00600 and every fold of its sentence | X grows about … of what it eats, and carts bring in … | 75 → 0 (all such folds: 370 printings in 259 towns → 0) | 111 printings with the wrong band for what is eaten |
| 12888 and kin | … provision makes up … of what it eats. | 9 → 0 (and the "less than a fifth" folds: 114 → 0) | 9 of 9 for this fold |
| 12961 | Many households go short, and a bad season would bring real hunger. | 12 → 8 | 4 (the siege towns; the 8 left are calm) |
| 12560 | Law enforcement, patrol and gate control here depend on iron brought in, which … | 58 → 35 | 23 |
| (kin) | … gate control here depend on iron brought in. / … by magic. | 32 → 26 · 2 → 1 | 6 · 1 |
| 12562 | … gate control here depend on iron from outside, which the siege has cut off. | 1 → 0 | 1 |
| 05780 | Contributes to Grain Sales - N% of income | 94 → 91 | 3 (the famine failed the grain) |
| 05779 | Contributes to Entrepôt Trade - N% of income | 70 → 69 | 1 (r2s-under_siege-town-0; its other cards in r2r-metropolis-14 still work) |

33 of the 110 towns that named gate control have no gate and no wall: all 33 cured (23 + 6 + 1 + 3 by-magic/isolated forms).

**Every other line that prints in fewer towns, explained**
- DS-DEF-9's false pool ("The <size> would go on if the arcane went away…", "Whatever magic reaches X, the <size> does not rest on it…", "What the <size> makes it makes with hands and ground…"): 4 to 8 towns each, every one a town whose food record now counts its provision; false there.
- "Contributes to Iron & Metalwork" 158 → 149, "Timber Trade" 74 → 71, "Apothecary & Alchemy" 11 → 10: siege towns whose mine, woods or herb ground the siege stopped (the card prints Impaired); false there by the siege law.
- "Medical role: common" 244 → 243, "Economic role: common" 153 → 151, "Infrastructure role: common" 151 → 149: the reading is now Integral there (`magicProfile.js` raises a role on the one reading's integral), inherited by the same roles at "integral".
- "Reliance on magic: Present" 15 → 13: both now Integral (a practitioner and two dependents).
- "supplied by …" phrases that lost towns: the same towns now name the food provision's tradition houses as well (e.g. "Wizard's tower and X" → "Wizard's tower, Houses of worship and X").

**The inheritors, read where they print:** "Reliance on magic: Relied upon" (+50) and its "supplied by …" (r2r-hamlet-14, r2s-occupied-thorp-1, r2r-city-38 read: each names the house of the provision's tradition); DS-DEF-9's relied-upon pool ("X relies on help beyond ordinary work…", +14; "X leans on the people who give it help…"): true, the food rests on the provision; "Reliance on magic: Integral" (+14); the "of what it needs" folds (one each for every old fold); "Law enforcement and patrol here depend on iron …" (+23); "Many households go short, and hunger is already here." (+4, sieges). All true where they print.

**DECLARED MOVE (the record):** `deriveMagicReliance` is the defence generator's reading too (`defenseGenerator.js :: generateDefenseProfile`, its stored `magicDependency`). Field diff by family on the 720, before → after: **`defenseProfile` in 52 towns, and only these paths: `defenseProfile.magicDependency` and its mirror `defenseProfile.scores.magicDependency`** (false → true where the food record holds a provision). No other family moves; no draw is moved (the flag is computed after the scores and no generator reads it back; `dailyLifeLogic.js` reads it for display).

**THE VETO LIST: every new or changed line, with the towns it was read in**
1. "X grows about … of what it **needs**, and <carriers> bring in … of the rest." and "<Kind> provision makes up … of what it **needs**." (36 folds, 259 towns): r2r-thorp-32 (thorp, smallest), r2s-plague_onset-metropolis-2 (metropolis, largest), r2s-under_siege-thorp-2 (siege), r2s-famine-thorp-1 (famine), r2s-occupied-thorp-1 (occupation).
2. "Many households go short, and hunger is already here." newly under a siege (the famine's own words): r2s-under_siege-hamlet-2 (hamlet, smallest), r2s-under_siege-metropolis-1 (largest), r2s-under_siege-city-0.
3. "Law enforcement and patrol here depend on iron brought in, which a siege, a closed road or a blockade would cut off." (23, towns only): r2r-town-40, r2s-insurgency-town-3, r2s-famine-town-2 (famine); and its siege form "… depend on iron from outside, which the siege has cut off." (r2s-under_siege-town-1).
4. "Reliance on magic: Relied upon · supplied by Access to a house of worship" (29): r2s-under_siege-thorp-1 (thorp, siege), r2s-recently_betrayed-hamlet-2 (hamlet, largest), r2s-occupied-thorp-1 (occupation), r2r-hamlet-14. NOTE for the veto: the house is the roster's "Access to …" row (a neighbour's church): the record's divine provision is credited through it (the food generator's own `hasDivine` reads the row).
5. "Reliance on magic: Relied upon" / "Integral" newly beside a food provision: r2s-under_siege-thorp-1 (thorp) … r2r-city-44 (city); Integral: r2s-wartime-town-1 … r2r-metropolis-27, r2s-under_siege-town-1.
6. Silences (no new words): "Contributes to X - N% of income" on a card the crisis stops (13 towns, 20 cards).

**The test:** `tests/components/displayEconRelianceFoodWords.test.jsx` (births of the census's own seeds): eleven NOT pairs, each naming what prints instead or the slot's silence, each red at the base 6e36000a4; five twins (red at the base by design); five KEEP pairs (green before and after); the one-reader anchor (`magicProvisionShown.foodMagicShare === magicReliance.foodMagicShare`, red at the base: the reading had no such reader). All green on the cure. Re-keyed BY IDENTITY: `economicsFoodSentenceTrue.test.jsx`, `economicsTabMalformedFlows.test.jsx`, `tests/ui/economicsTabFlow.test.js` (the food sentence's "of what it eats" → "of what it needs"; the same towns, the same shares).

**Gates** (the cured tree; reds carried from the base named):
- strict domain: 1113 against a ceiling of 1113. Type ratchet: 167 against 167. eslint on the touched files: clean.
- presumed-things walker `--check`: fresh 148 at the base and 148 after (no rise).
- twelve-birth grid: exit 0, 2 falls (P7a: r2r-city-0, r2s-insurgency-metropolis-0), no rise.
- the 107 test files naming the touched files: green but these ten, red at the base with the same tests: CARRIED: `dossierPhoneFloorAllViews`, `phoneChromeFloor.census`, `observedShapeReaders.walker`, `proseNumerics`, `rawColorLiteral`, `pdf/goldenViewModel`, `dossierProseManifest`, `espionageDormancyFence`, `generatorGoldenMaster` (525 configs stale at the base and after), `ui/defenseTabFlow`.

**Registers:** none re-taken. `generatorGoldenMaster` is stale at the base already (525 of 525); this batch's declared move (52 towns' `magicDependency`) adds to what its re-take must bank: NAMED stale. EconomicsTab.jsx's line-keyed prose-numerics rows: every edit above line 669 was made in place (lines 119, 244); the food sentence edits are below every keyed row.

**Struck, each with its reason**
- **The "What the land offers: ✓ …" rows** (30975 30931 30978 30974 30977 30946 30945 30947 30972 30973 30928 30929 30930 B29875 B29918 B29904 30938 30976 B29880 B29879 B29902 B29878 30964 B29920 B29905): the header says what the LAND OFFERS, not what is worked; every chip (1121 on the 720) stands on a supporting resource whose condition is `available`, or on the route: **0** chips stand only on depleted resources (by script over `resourceAnalysis.resourceConditions` and `STRENGTH_SUPPORT`). The readers took "✓" for "worked". True.
- **B12337, B04742** "… brought in by magic: no trade road reaches X": on an isolated route the dependency is non-critical only where the town holds teleportation infrastructure (`economicState.js`: "Supplied via magical trade infrastructure: teleportation imports replace road access."); the goods are not food, so the food record's 0% is not the measure. True in all 12.
- **B14840 "Pig iron", B15067 "Preserved foods / Leather goods", B15904 "Salted fish / Smoked seafood"**: every card that prints them while impaired or on a depleted input prints them under "Normally yields" (`chainYield.js :: chainYieldRefused`; 65 of 126, 50 of 99, 2 of 2); the other cards run on an available input. The census dump prints a repeated label once, so the readers did not see it. True.
- **14553 14550 14543 14549 14545 14547 20768 20234 20769 22241 22240 20767 22405** ("No one here works the X", "leaves its X unworked") against "TRADE made here": the readers' TRADE line is the record's raw `localProduction` (every commodity of every resource held, worked or not); the page's own "Produced locally" and "Exports" pills never name the resource such a line says is unworked (0 of 183 lines on the 720, by script). True.
- **B17694** "Arcane fabrication and stone-shaping partially offset depleted extraction": the same note as the struck B03722 (the step sets the chain vulnerable; "partially offset" is what the record holds).
- **B12001** "Livestock" (130): gone in the town read (r2s-famine-thorp-1); in the three livestock-failed famine towns it prints in none.
- **B15684**: gone at the base.

**Named for other seats**
- **X11:** the Economics tab's stores call (`EconomicsTab.jsx` line 304, `foodStoresWords(eco.foodSecurity.foodRecord)`) is left as it is: a later seat passes the crisis in after the CRISIS seat's landing.
- **00615** "ships bring in about a third of the rest" under a siege → `foodCarrier.js :: carriersOf` (not this seat's; the PDF reads it too): a port with docks keeps "ships bring" under a siege (W2-C-LEAVES-4's sea exception). The siege law says nothing comes in by water: the two rulings disagree; the chair's.
- **29296** (X9, PDF cover) "Top export: Salted fish (naval route only)" under a siege: the same sea exception (`chainStateShown.js :: seaOpenTo`, the record's "by the naval route only"). Named with 00615 for the chair's one ruling; not cured.
- **r2r-thorp-54** Foundations "Isolated from major trade routes, and short of what it eats. Nothing is brought in to close the gap; it gets by on what it produces itself." beside a quarter of the need by provision → `generators/narrative/settlementOriginProse.js` (HOLDS_TOKEN).
- **Withheld notes still count:** 26 towns whose only dependents are chains with a raw food or tradition note the card withholds (`magicNoteShown`) still read "Relied upon" / print "✦ Magically Sustained" → `chainStateShown.js` / the step's `status` (already named by the predecessor).
- **13751** "Mining & Coinage ✓ Running" with no mine or mint, **03456** "Almshouse Care ○ Operational" with no almshouse, **04478** "Bowyer & fletcher ✦ Magically Sustained" → `chainStateShown.js` / `serviceStateShown` (not this seat's leaves).
- **B29895** "✓ Fully exploited Livestock" under a famine that failed the herds → `validationOnPage.js :: exploitationCardShown` (not this seat's).

## After batch 2 · the chair's notes X17 and X18, measured (2026-11-15; nothing cured)

- **(X17)** "The PDF and the journal print a chain (impaired) where the land's own line says running, in siege towns": THE LEAF IS NOT WRONG, AND THE EXPORTS READ IT. `pdf/lib/chainStateOnPage.js` and `foundry/journalPages.js` call `chainStateShown.js :: chainAsShown`, the reader the Economics tab's cards use (`chainWorking.js` holds no state). On the after-census, 172 chains print "(impaired)" in the siege towns' journals, and the tab prints Impaired for every one: 98 are impaired on the record, 71 are running (60) or entrepôt (11) on the record and impaired by the siege branch (own field work or trade stopped), and 3 are services. The "running" is the record's calm `activeChains[].status` (the readers' LAND header), the limit B10927 was struck on. The PDF's only "Running" in those towns is its legend swatch. Reported to the chair.
- **(X18)** THE RECORD DECIDES THE SIEGE'S SEA: the chair asked for the measure before any cure. Of the 31 census siege towns, 3 are ports and 2 have docks (the record holds the sea open: r2s-under_siege-city-0, -metropolis-1). Only city-0 brings food in by sea on the record (6,439 lb/day, 24%). Its page says against it: "With the siege closing every way in, Bellaurbs has lost…", "Whatever Bellaurbs used to buy for its table, none of it has come since the siege closed the roads.", "Current effective trade is likely zero". "Stopped by the siege." prints in none of the 3. 29296's town r2r-village-21 is NOT a port on the record (no sea access, import 0), so "(naval route only)" is false there by the record. AWAITING THE CHAIR'S RULING on the count; the writers are `foodCarrier.js :: carriersOf` (00615) and the PDF cover's top export from `tradeListDisplay.js` / the record's export words (29296); the "none of it has come" lines are other seats' pools.

## What is left of the worklist (for the next seat), as at f9b957cbd

- **11782** "Institutional control guild_controlled" (14 towns): `MagicTab.jsx :: Facet` prints the stored key. The cure is ready and measured, but neither its census run nor its test was made: `{String(value ?? '').replace(/_/g, ' ')}` on the value span, in place (no line moves), giving "Guild controlled" through the span's own capitalize. "guild_controlled" is the only facet value with an underscore on the 720.
- **13538** "Military role: common" with no magic on the defence (11 towns): `magicProfile.js` roles (not this seat's file unless the chair rules), via `MagicTab.jsx :: roleRowShown`.
- **14551** (22 towns) "No one here works the mineral hot springs" beside a line saying the town draws on the springs: verify against both writers.
- **23037, 23039, 18036** "Druidic forest management…" / "✦ Magically Sustained" timber where timber is imported because the woodland is cleared (16 towns): the note is `magicNoteShown`'s (this seat's), and the chip is `chainStateShown.js`'s.
- **16353** "Reed & Marsh Harvest: Arcane fabrication…" in a mountain town that makes no reeds; **04474** bowyer fabrication without a bowyer: `magicNoteShown` / the step.
- **11963** "It has worked out its river fisheries." beside a fishing community (13 towns); **29070** hide work "stops half-way" beside tanners; **22229** the missing article ("what it lacks is Smelter"): `validationOnPage.js` (not this seat's): name them.
- **14404, B13482, 14395, 14400, 14242** "Needed, and not brought in: …": verify against `importsAsPrinted` and the roster (fish beside a fish market; spices with no spice need).
- **B11520, 12110, 12104, 12111** "Its own food comes from its X and little else": the foodways and food-source writer (`domain/foodways.js` or the food record's sources): verify.
- **22206, 16853, B19491** "The table rests on …" (`domain/foodways.js`): under a siege the hunters cannot leave; houses the table names are missing.
- **01192** "lives on a surplus farm trade" (1 town); **05224** "Coin minting" with no mint (40): the income words → DEFECON (X4).
- **The resource-chip runs** (B28xxx, B29xxx, one town each): `ResourcesTab.jsx` Nearby Resources / `resourceAnalysis.availableResources` chips naming the commodities of depleted or absent resources (salt, gems, honey, grain): a batch of one shape, about 50 rows: the chips should read the resource's condition (`resourceConditions`).
- Named and not this seat's: see the batch-2 "Named for other seats" list.

## How the instruments were re-made for batch 2

As above. The before census ran in a second detached worktree at the tip (its `node_modules` linked to the cured tree's), so the cured tree could be edited during the before run. NEVER edit the tree a census is rendering: the render reads the source live. The record probes of this batch (the reliance moves, the food-share bands, the gate-control and stopped-card counts, the field diff by family, X17 and X18) are node scripts over `corpus.ndjson.gz` and `dumps/` importing the tree's own leaves, kept in the seat's scratch.

---

# TAIL-DISPLAY-ECON-3 · the third seat's batch

Seat: TAIL-DISPLAY-ECON-3 (builder), succeeding TAIL-DISPLAY-ECON-2 on the same branch, continued from its tip **ac0f7b439** (read back from origin, 2026-11-15). Scratch worktrees (detached; pushed by explicit refspec). The hand-back is this seat's to keep current.

## The chair's rulings since (2026-11-15; each vetoable by the owner)

- **(X19)** STRUCK: "(impaired)" under a siege is the page's own siege-aware state on every surface. The readers' "running" was the record's calm status on the chair's header. Nothing to cure.
- **(X20)** The siege's sea exception is a state of the record (one census town). Its three lines are not in these files: two are the corpus's (reworded by its seat), and the third already says "or severely restricted": struck. Nothing here.
- **(X21)** THE ONE KIND OF MERGE THIS SEAT MAKES: `origin/lane/join-2026-11-14` AT **eb054d53f**, a merge commit of its own. That tip holds the crisis seat's `foodStoresWords(record, crisis?)` and the Tonight sheet's call. The first cure after it is the Economics tab's call (K7's other half, row 18671's kin): it passes the crisis. ONE HOME. Then re-take the before at the merged tree and strike every row gone there.
- **(X22)** Then: 11782 (the Magic tab's facet prints the raw key "guild_controlled"); the resource-chip rows of one shape (about 50); the one row of the exports' read (29296).
- **(X23)** COMING: the PDF seat's two leaves under `src/domain/display/` (`shadowEconomyShown`, `criticalImportsShown`). When the chair names a tip that holds them, switching the tab to them is this seat's. Until then the tab's own composition stays as it is.
- **(X24)** If the worklist is finished inside the count, say so and hand back early.

## The merge (X21)

`e1cd689e6` merges `eb054d53f` (no conflicts; lockfile unchanged, `npm ci` run).

THE BEFORE RE-TAKEN at the merged tree (census3, 720 towns, 30050 sentences). Of the 175 rows (the worklist's 174 and the exports' read's 1), these 16 are gone there: 00600 04405 12736 04329 B10244 B12005 11407 09786 12888 30953 B15876 B15684 12562 00615 14219 29296. All but two were already cured or struck by the seats before. The two new ones:
- **00615** "ships bring in about a third of the rest" under a siege: gone at the base (the corpus seat's rewording, X20). Struck.
- **29296** (PDF cover) "Top export: Salted fish (naval route only)": gone at the base. Struck. The by-record measure, for the record: r2r-village-21 is a river town under a siege. `computeActiveChains.js` marks its exports "naval route only" by the world law (`supportsMaritime`), not by the town's own route, while the tab's own export pills (`exportsAsPrinted`) print none there. The cover read the raw `primaryExports[0]` through `dossierViewModel.js :: deriveTopExport`, which is DEFECON's file. If it returns, the cure is there (read `exportsAsPrinted`, one home).

## Batch 3 · the stores sentence takes the crisis (X21); a facet key prints as words (11782); the timber note on a depleted ground (23037)

Census before = the merge `e1cd689e6`; census after = the cure `53e295e5a`. Inventory diff: `sentences: before 30050 after 30053 · gone 5 · new 8 · in fewer towns 6 · in more towns 0 · moved 0`.

**The cures**
- `EconomicsTab.jsx` (line 304, in place): `foodStoresWords(eco.foodSecurity.foodRecord, s ? factsOf(s).crisis : null)`, the Tonight sheet's own call. The import is appended at the end of the file, so no line-keyed row moves.
- `MagicTab.jsx :: Facet` (in place): a string value prints with `_` read as a space ("guild_controlled" → "guild controlled", capitalized by the span's own style). "guild_controlled" is the only facet value with an underscore on the 720.
- `magicProvisionShown.js :: magicNoteShown` (its wording step): the step's timber note "Druidic forest management accelerates regrowth and sustainable yield" prints on a ground the record holds depleted (`resourceAnalysis.resourceConditions`) in **48 of the 49** cards that print it. There the woodland is cleared and timber is bought in, or the ground is a cut-over marsh. On such a ground it takes a twin:
  - "Druidic forest management speeds the regrowth of the cleared woodland" (managed, coastal and mountain stands);
  - "Druidic tending speeds the regrowth of the depleted ground" (a marsh: no forest).
  An available ground keeps the note (r2s-under_siege-metropolis-3's bowyer). The card, the Magic tab, the PDF and the journal all read the note through this leaf.

**Rows cured** (towns printing before → after; the measure = printing towns where the record makes the line false)

| id | line | printing before → after | false by record before |
|---|---|---|---|
| (X21, K7 · 18671's kin) | Stores: a granary, about # months of grain. (Economics, where the Tonight sheet says the crisis is eating into them) | 350 → 334 | 16 (13 sieges with a gap, incl. r2r-metropolis-14; 3 famines) |
| 11782 | Institutional control guild_controlled | 14 → 0 | 14 |
| 23037 | Timber & Lumber: Druidic forest management accelerates regrowth and sustainable yield | 16 → 0 | 16 |
| (kin) | Bowyer & fletcher: … · Reed & Marsh Harvest: … · Shipbuilding and Timber: … · Boatbuilding & River Transport: … | 17 → 1 · 9 → 0 · 6 → 0 · 1 → 0 | 16 · 9 · 6 · 1 |
| (kin) | the bare note (the card and the exports) | 29 → 1 | 28 |

Every row fell by exactly its measure. The one bowyer and the one bare note left are r2s-under_siege-metropolis-3, whose woodland is available, so they are true there.

**Every other line that prints in fewer towns, explained**
- "Patron deity", "Assign a patron god…", "Upgrade to premium…" 720 → 718 (r2r-thorp-0, r2r-thorp-2): the Power tab's deity panel did not render in the first town of two render workers (each is its worker's first seed). This is a render warm-up flake, and none of this batch's files renders that panel. Not a silence.

**The inheritors, read where they print:**
- the two note twins (22 + 9 towns with their chain-prefixed forms; r2r-city-57 and r2r-city-5 read: the ground is depleted and timber is imported);
- "Institutional control guild controlled" (14);
- in the 16 stores towns, the Tonight sheet's own words, already printed there on the Tonight sheet.

All are true where they print.

**THE VETO LIST: every new or changed line, with the towns it was read in**
1. "Stores: a granary, about N of grain, and the siege is eating into them." now on the Economics tab too (the crisis seat's words, already on the Tonight sheet): r2s-under_siege-town-0 (town, smallest), r2s-under_siege-metropolis-3 (largest), r2r-metropolis-14 (a calm-seed siege). Its famine form: r2s-famine-town-0, -2, -3 (towns only).
2. "Druidic forest management speeds the regrowth of the cleared woodland" (22 towns; chain forms Timber & Lumber 16, Bowyer & fletcher 16, Shipbuilding and Timber 6, Boatbuilding & River Transport 1): r2r-city-57 (city, smallest), r2s-wartime-metropolis-3 (largest), r2s-under_siege-city-0 (siege), r2s-famine-metropolis-0 (famine).
3. "Druidic tending speeds the regrowth of the depleted ground" (9; Reed & Marsh Harvest): r2r-city-5 (smallest), r2s-under_siege-metropolis-3 (largest; siege), r2s-famine-metropolis-1 (famine).
4. "Institutional control: guild controlled" (14): r2r-town-1 (town, smallest), r2s-indebted-metropolis-0 (largest), r2s-occupied-city-3 (occupation), r2s-under_siege-city-3 (siege).

**The test:** `tests/components/displayEconStoresFacetTimber.test.jsx` (births of the census's own seeds).
- Six NOT pairs, each naming what prints instead.
- Five twins.
- The one-home anchor: the tab prints `foodStoresWords(record, factsOf(t).crisis)`, the Tonight sheet's sentence.
- Three KEEP pairs.
- **12 red at the base e1cd689e6** (every NOT, every twin, the anchor), the 3 KEEP green. All 15 green on the cure. The base run is the plant.

**Gates** (the cured tree):
- strict domain: 1113 against a ceiling of 1113. Type ratchet: 167 against 167. eslint on the touched files: clean.
- presumed-things walker `--check`: fresh 145 at the base and 145 after (no rise; its exit 1 is the base's own).
- twelve-birth grid: exit 0, 2 falls (P7a: r2r-city-0, r2s-insurgency-metropolis-0), no rise.
- the 78 test files naming the touched files: green but seven, each red at the base with the same failing tests, by name: CARRIED. They are `dossierPhoneFloorAllViews`, `phoneChromeFloor.census`, `observedShapeReaders.walker`, `proseNumerics`, `rawColorLiteral`, `dossierProseManifest`, `ui/defenseTabFlow`.

**Registers:** none re-taken; none named stale by this batch. Both tab edits are in place and the import is at the end of the file.

**Declared moves:** none. No generator or data file was touched.

**Struck, each with its reason**
- **00615, 29296**: gone at the merged base (above).
- **The resource-chip rows, Economics "Produced locally"** (B28568 B28997 B28918 B28447 B28570 B28439 B28448 B29020 B28633 B28639 B28489 B29755 B28634 B29368 B29743 B28477 B28991 B28461 B28998): each pill stands where the record says it does. A chain of the record works a resource held **available** whose catalogue commodities name the good (`data/goods/identity.js :: RESOURCE_DATA[k].commodities`; the leaf `tradeListDisplay.js :: localProductionAsPrinted` keeps only such goods). Checked by script on 20 of the rows' towns. Examples: salt by a running river fishery (`river_fish` → fish, salt), gems by worked precious-metal veins (`precious_metals` → luxury, gems), grain by date palms (`date_palms` → grain, dates), honey by an ancient grove, herbs and peat by worked marshland. The readers' LAND header named resources, not their commodities. The display is true to the record, and THE DATA IS WHAT THE READERS DOUBTED: NAMED below.
- **The resource-chip rows, Resources "Commodities available"** (B28930 B29119 B29184 B29205 B29175 B29167 B28285 B28274 B28405 B28606 B29208 B29206 B28935 B28273 B29367 B29109 B29151 B29230 B29171 B28283 B28182 B28581 B29168 B28183 B28521): the chips are `resourceAnalysis.availableResources`, the town's **available** resources (depleted ones are already left out, e.g. r2r-hamlet-10) and each one's catalogue commodities. "Available" claims no working (B28521 iron "not processed" is true). The same data is doubted: NAMED below.

**Named for other seats** (one line each, to the chair)
- **THE CATALOGUE'S COMMODITIES** (`src/data/goods/identity.js :: RESOURCE_DATA`, data: a declared move if changed) → the data's owner. The doubted pairs, behind about 45 chip rows of the shape: `river_fish` / `fishing_grounds` → salt; `date_palms` → grain; `precious_metals` → gems; `ancient_grove` → honey; `oasis_water` → dates; `river_mills` → processed textiles; `hot_springs` → medicinal herbs. The display reads them as the record's facts, so the cure is a row of data, not a display condition.
- **B28788, B28789** "defended pass" chips in towns with no defence: the resource KEY `defended_pass` printed raw (`ResourcesTab.jsx`: the Abundant chip's `fmtKey` and the commodity chips' key), where the catalogue's own label is "Mountain Pass" (29 towns). The cure is in this seat's file (chips print `RESOURCE_DATA[k].label`, one home for a resource's name). But it rewords every Nearby Resources chip on the 720 ("Iron Deposits" → "Iron Ore Deposits", …), so it is put to the chair before it is made.
- **B28006, B28222** "Wool→cloth→dyed fabric" / "cloth, dyed fabric" (39 towns) with no weaver or dyer: not reached (the Resources chain's outputs; verify against `chainOutputsShown`).
- **23039, 18036** "✦ Magically Sustained" on the timber cards → `chainStateShown.js` / the step's `status` (already named).
- **16353, 04474** "Arcane fabrication provides processed goods…" on a Reed & Marsh card in a mountain town and on a bowyer with no bowyer: the step's chain (`generators/chainMagicSubstitution.js`) and the record's chain list. Not a wording of this leaf.

## The chair's ruling X25 (2026-11-15 01:41 UTC; vetoable by the owner), received after batch 3 was pushed: NOT DONE, THE NEXT SEAT'S FIRST BATCH

- **(X25.1) ONE VOICE:** the journal now calls the crisis leaf for income shares, chains and houses (427 rows in 97 towns). The Economics tab does not, so under a siege the journal marks "Toll Revenue" and the tab does not. The leaf is already on this branch through the X21 merge: `src/domain/display/crisisStoppedRow.js` (`rowStoppedBy(settlement, 'chain' | 'income', row)`, keyed by the record's chain id or the income share's source name; `crisisMarkText`, `STOPPED_WORD`, `ordinaryTimesLine`, `stoppingCrisesOf`). THE TAB'S INCOME ROWS AND CHAIN ROWS CALL IT and print its mark as the Services tab does (`ServicesTab.jsx` line 24 and line 151 show the form; `InstitutionsTab.jsx` line 372 does the same for houses). The chair asked for it with the stores call in one batch. The stores call was already pushed as batch 3, so this is batch 4. Mind the overlap with batch 2's silence of "Contributes to X - N% of income" on a stopped card (`EconomicsTab.jsx` lines 119 and 244, `stoppedByCrisis`): one reading should decide both, the leaf's.
- **(X25.2) NAMED, not this seat's file:** the Resources tab's exploitation rows show the failed food's resource as "full" under a famine (journal rows 35544, 35551, 35555 of `read-all-3/WORKLIST3-EXPORTS-JOURNAL.json`). That table reads `src/domain/display/validationOnPage.js :: exploitationGroupsShown` (line 465), which is not in this group's file list, so it is named to the chair (with B29895 before it).

## What is left of the worklist (for the next seat), as at this batch

- **X25.1** (above): first.
- **X23**: switch the tab to `shadowEconomyShown` / `criticalImportsShown` when the chair names a tip that holds them.
- **B28788, B28789** the resource label (above): the chair's word first.
- **B28006, B28222** wool → cloth chips (39): verify.
- **14551** (22) "No one here works the mineral hot springs" beside a line saying the town draws on the springs: verify against both writers.
- **14404, B13482, 14395, 14400, 14242** "Needed, and not brought in: …": verify against `importsAsPrinted` and the roster (fish beside a fish market; spices with no spice need).
- Named and not this seat's: **13538** (`magicProfile.js`), **11963, 29070, 22229** (`validationOnPage.js`), **B11520, 12110, 12104, 12111, 22206, 16853, B19491** (`domain/foodways.js`), **01192, 05224** (DEFECON), and the lists above.

## How the instruments were re-made for batch 3

As above:
- three detached worktrees: the cure tree, the merge for the before census, and the cure commit for the after census. Each `node_modules` is linked to the cure tree's;
- the census run on each, and `inventory.py`, `inventory_diff.py <rows>`;
- the record probes (the chip and pill grounds, the druid note's grounds, the stores sentence with and without the crisis, 29296's route) are node scripts over `corpus.ndjson.gz` that import the tree's own leaves (`tradeListDisplay.js`, `magicProvisionShown.js`, `tonightSheet.js`, `factsOf.js`), kept in the seat's scratch.

## Hand-back (TAIL-DISPLAY-ECON-3)

I handed back by the clock after batch 3, about 45 minutes and a large context into the count. One more batch needs its own census and could not be finished inside 250,000. The branch tip is the hand-back commit after b570b76ea. The after census of batch 3 (at 53e295e5a) is the next seat's before only if it renders that same tree. It was written to this seat's scratch, which does not outlive the container: re-make it with the commands above.
