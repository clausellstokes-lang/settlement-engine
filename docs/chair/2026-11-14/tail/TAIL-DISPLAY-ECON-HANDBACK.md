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

---

# TAIL-DISPLAY-ECON-4 · the fourth seat's batches

Seat: TAIL-DISPLAY-ECON-4 (builder), succeeding TAIL-DISPLAY-ECON-3 on the same branch, continued from its tip **fcab8b63d** (read back from origin, 2026-11-15). Scratch worktrees, detached; pushed by explicit refspec. The hand-back is this seat's to keep current.

## The chair's rulings since (2026-11-15 02:10 UTC; each vetoable by the owner)

- **(X25.1)** FIRST, AS BATCH 4: the Economics tab's INCOME rows and CHAIN rows call the crisis leaf (`src/domain/display/crisisStoppedRow.js :: rowStoppedBy`, in the Services tab's form) and print its mark. Batch 2's own silence gives way to it. Measure against the leaf's own count over the record: the rows must equal the leaf's count for income and chains.
- **(X26)** YES to the predecessor's ask on the "defended pass" chips (B28788, B28789; 29 towns): A RESOURCE'S NAME HAS ONE HOME. The Nearby Resources chips print the catalogue's own label (`RESOURCE_DATA[k].label`: "Mountain Pass"), not the key run through a formatter. It rewords every such chip to the catalogue's existing word, IN ITS OWN COMMIT. The whole list, old to new, goes on the veto list with the towns. Say whether the PDF and the journal already print the catalogue's label or another word.
- **(X27)** `validationOnPage.js :: exploitationGroupsShown` (X25.2) is given to another seat (the civic display's files): not this seat's.
- **(X28)** THE CATALOGUE'S COMMODITIES (the seven doubted pairs behind about 45 struck chip rows) are DATA and a record move: NAMED for the record's next measure, not this seat's to change.
- **(X29)** Everything new on the tabs at the first landed tip was read cold (READ-ALL-4): no row of these files was flagged.
- THE ORDER: X25.1; X26; then this seat's rows printing in FIVE TOWNS OR MORE, widest first. A row in fewer than five towns waits.
- (U1) The account's weekly usage warning is on: commit and push every batch the moment it holds, with WHAT IS LEFT current in the same push; hand back at 250,000; one line to the chair only at the hand-back, a stop, or a question.

## Batch 4 · one voice: the Economics tab's income rows and flow cards call the crisis leaf (X25.1)

Commit **bb5ebff5c**. Census before = the tip fcab8b63d (`census3.sh`, 720 towns, 30053 sentences); census after = bb5ebff5c. Inventory diff: `sentences: before 30053 after 30083 · gone 4 · new 34 · in fewer towns 23 · in more towns 6 · moved 0`.

**The cures**
- `src/domain/display/economicsCrisisMarks.js` (new; only the Economics tab calls it): `flowCrisisMarks(town, records, shown)` (each card's mark, by the record's `chainId`, and the reading of the share a card names); `incomeDescShown(town, src)` (the share's mark, then its description of ordinary times: `markedDescription`); `econOrdinaryTimesLine(town, eco)` (the leaf's `ordinaryTimesLine`, where any income or chain row is marked). All three read `rowStoppedBy` and `crisisMarkText`: the Services tab's, the Institutions tab's and the journal's leaf.
- `EconomicsTab.jsx`, every edit in place (the file is at its 600-line ceiling, and the prose-numerics register keys lines 246, 436, 438, 663 and 669; no line moved):
  - the income row prints `incomeDescShown` (e.g. "Pilgrim Trade Stopped by the siege. Offerings, hospitality fees, …"; a share the siege closes, which prints no description, prints the mark alone: "Toll Revenue Stopped by the siege.");
  - a flow card prints its mark (`data-testid="flow-crisis-mark"`) before the card's sentence;
  - the tab's head line under the glance (`data-testid="economics-ordinary-times"`), as the Services tab and the journal print it;
  - "Contributes to X - N% of income" is left out where the leaf marks the share it names. This replaces batch 2's `stoppedByCrisis` (a card the crisis left impaired, by `chainCrisisStateShown`); that import is dropped.

**THE MEASURE (X25.1): the page equals the leaf.** By script over the after census (`corpus.ndjson.gz` through the tree's own `rowStoppedBy`; `dumps/`, the Systems/Economics view):

| rows | the leaf over the record | printed on the Economics tab |
|---|---|---|
| income shares marked | **74 rows in 48 towns** (siege 28, outbreak 34, famine 12) | **74 rows in 48 towns** (0 at the base) |
| chain cards marked | **100 rows in 43 towns** (siege 43, outbreak 30, famine 27) | in **43 towns** (0 at the base); the dump prints a repeated line once a view, so the per-card count is pinned by the test: exact in r2r-town-37, r2s-famine-hamlet-0, r2s-under_siege-town-1 and r2r-metropolis-14 (6 cards) |

The journal seat's 427 rows in 97 towns counted houses as well; houses are the Institutions tab's here, and already marked there.

**Rows cured:** X25.1's own rows (the journal's income and chain marks the tab did not print): 174 rows in 58 towns → printed, in the leaf's form. Every unmarked income line in a marked town is gone or fewer by exactly its marked towns. Examples: "Pilgrim Trade Offerings, …" 83 → 73 (10 marked); "Market Taxes District-level duties …" 232 → 223 (9); "Market Taxes Market day stall fees …" 133 → 126 (7); "Toll Revenue Tolls taken …" 110 → 105 (5); "Port Duties Import and export taxes …" 55 → 52 (3); the bare shares the siege closes ("Toll Revenue" 5, "Gate Tolls" 4, "Entrepôt Trade" 3, "Port Duties" 2) → 0, each now with its mark.

**Every other line that prints in fewer or more towns, explained**
- "Contributes to Entrepôt Trade - #% of income" 69 → 68 (r2r-metropolis-14): the leaf marks the share stopped by the siege, so no card claims it. False there by the siege law.
- **"Contributes to Iron & Metalwork" 149 → 158, "Timber Trade" 71 → 74, "Apothecary & Alchemy" 10 → 11: BATCH 2'S SILENCE GIVEN WAY (X25.1).** These 13 cards are the ones batch 2 silenced because the siege left them impaired (the mine's or woods' field work stopped, by `chainCrisisStateShown`). The leaf's table (the chair's S1/S6, `data/crisisDependence.js`) holds the forge, the mine, the woods and the still at work under a siege (NONE). The Income Sources row prints the same share unmarked, so the card now agrees with it. The card's own chip still prints "Impaired". On the VETO LIST below. `displayEconRelianceFoodWords.test.jsx`'s pair (r2s-under_siege-town-1) is re-keyed by identity from NOT to KEEP.
- "The descriptions here are of ordinary times." 99 → 100 (r2s-famine-hamlet-3): the one town where only the Economics tab marks a row (its livestock chain under the famine that failed the herds). True.
- "Patron deity" and its two lines 717 → 716 (r2r-thorp-0): the render warm-up flake batch 3 named (a worker's first seed; no file of this batch renders that panel). Not a silence.

**The inheritors, read where they print:** the marked forms, e.g. "Market Taxes Curtailed by the outbreak." (16, r2r-city-19), "Toll Revenue Stopped by the siege." (5, r2r-hamlet-0), "Pilgrim Trade Stopped by the siege." (5, r2r-metropolis-14), "Grain Sales Scarce in the famine." (4, r2s-famine-city-2), "Fish & Maritime Produce Scarce in the famine." (4, r2r-city-44). Each is the leaf's own reading of the record's crisis, true where it prints. The descriptions they carry (now split off by the inventory's sentence fold) are unchanged words. "Contributes to Iron & Metalwork" (8, r2r-metropolis-14) is above.

**THE VETO LIST (batch 4): every new or changed line, with the towns it was read in**
1. "<Income source> Stopped by the siege. <its description of ordinary times>" (17 towns): r2s-under_siege-thorp-0 (thorp, smallest), r2s-under_siege-metropolis-3 (largest), r2r-hamlet-0 (a calm-seed siege). The card form "Stopped by the siege." (15 towns): r2s-under_siege-hamlet-2 … r2s-under_siege-metropolis-3.
2. "<Income source> Curtailed by the outbreak. …" (19): r2s-plague_onset-thorp-2 (smallest), r2s-plague_onset-metropolis-0 (largest), r2r-town-37. The card form (13): r2s-plague_onset-village-2 … r2s-plague_onset-metropolis-3.
3. "<Income source> Scarce in the famine. …" (12): r2s-famine-hamlet-0 (smallest), r2s-famine-metropolis-1 (largest), r2r-hamlet-16. The card form (15): r2s-famine-hamlet-0 … r2s-famine-metropolis-2.
4. "The descriptions here are of ordinary times. While the siege / the outbreak / the famine lasts, a row it touches is marked." now on the Economics tab (the leaf's words, already on the Services and Institutions tabs): r2s-under_siege-town-1, r2r-town-37, r2s-famine-hamlet-0, r2s-famine-hamlet-3 (the only tab that marks there).
5. RE-PRINTED (batch 2's silence given way): "Contributes to Iron & Metalwork / Timber Trade / Apothecary & Alchemy - N% of income" on 13 siege cards printed Impaired: r2s-under_siege-hamlet-3 (smallest), r2s-under_siege-city-0, -city-3, -metropolis-3 (largest), r2r-village-55, r2r-metropolis-14.

**The test:** `tests/components/displayEconCrisisMarks.test.jsx` (births of the census's own seeds).
- Five NOT pairs (the unmarked income line), each naming what prints instead.
- Nine twins (the five marked lines, a bare share's mark, the head line under each crisis).
- The leaf's count: a card mark for each chain the leaf marks, in four towns.
- Four KEEP (three unmarked shares, and a calm town that marks nothing).
- **18 red at the base fcab8b63d, 4 green**; all 22 green on the cure. The base run is the plant.

**Gates** (the cured tree, with X26 on top):
- strict domain: 1113 against a ceiling of 1113. Type ratchet: 167 against 167. eslint on the touched files: clean (EconomicsTab.jsx at 600 of 600 code lines).
- presumed-things walker `--check`: fresh 145 at the base and 145 after (its exit 1 is the base's own).
- twelve-birth grid: exit 0, 2 falls (P7a: r2r-city-0, r2s-insurgency-metropolis-0), no rise.
- the 78 test files naming the touched files (EconomicsTab, ResourcesTab, crisisStoppedRow, economicsCrisisMarks): green but six. These are the same 14 failing tests, by name, at the base, so they are CARRIED: `dossierPhoneFloorAllViews`, `phoneChromeFloor.census`, `observedShapeReaders.walker`, `proseNumerics`, `rawColorLiteral`, `dossierProseManifest`.

**Registers:** none re-taken; none named stale (every tab edit in place; the new leaf is new). **Declared moves:** none (no generator or data file touched; the record is unchanged).

**Signature note for the EXPORTS seats (X9):** no leaf signature changed. The new leaf `economicsCrisisMarks.js` is the tab's alone. The journal already calls `rowStoppedBy` itself.

## X26 · a resource's name has one home: the Nearby Resources chips print the catalogue's label

Commit **9abfb1553** (its own commit, as ruled). Census before = batch 4's after (bb5ebff5c); census after = the X26 commit (the same code). Inventory diff: `sentences: before 30083 after 29620 · gone 657 · new 194 · in fewer towns 0 · in more towns 10 · moved 0`. **All 861 changed folds are on Systems/Resources** (the Nearby Resources chip runs, which the dump folds as one line). No sentence prints in fewer towns, so nothing is silenced.

**The cure** (`ResourcesTab.jsx`, three edits in place): the Abundant, Depleted and besieged ground chips (`fmtKey`) and the resource rows among "Commodities available" print `RESOURCE_DISPLAY_LABELS[k]`. That is the seam's verbatim, census-guarded transcription of `RESOURCE_DATA[k].label` (`resourceDisplayName.js`, the display's one home for a resource's name, which keeps the PDF worker bundle free of the catalogue). A custom ground keeps its key's words, and a commodity word is unchanged.

**Rows cured:** **B28788, B28789** ("defended pass" read as a defence in towns with none): 29 towns → 0. "Mountain Pass" prints there now, the catalogue's own word.

**THE VETO LIST (X26): every chip reworded, old → new, with its towns** (towns printing it as a ground chip / as a commodity-row chip; the smallest … the largest; a crisis town). Every key with a different word, 23 of the catalogue's 33, in **710 of the 720 towns**:

| old | new | towns | read in |
|---|---|---|---|
| Iron Deposits | Iron Ore Deposits | 255 / 164 | r2r-thorp-1 … r2s-mass_migration-metropolis-2 · r2s-under_siege-thorp-3 |
| Coal Deposits | Coal or Peat Deposits | 220 / 138 | r2r-thorp-2 … r2s-mass_migration-metropolis-3 · r2s-famine-thorp-1 |
| Foraging Areas | Wild Foraging Areas | 211 / 131 | r2r-thorp-1 … r2s-mass_migration-metropolis-2 · r2s-under_siege-thorp-0 |
| Stone Quarry | Stone quarry (the catalogue's own case) | 209 / 0 | r2r-thorp-0 … r2s-mass_migration-metropolis-3 · r2s-under_siege-thorp-0 |
| Grazing Land | Open Grazing Land | 196 / 120 | r2r-thorp-10 … r2s-mass_migration-metropolis-3 · r2s-famine-thorp-1 |
| Grain Fields | Extensive Grain Fields | 178 / 129 | r2r-thorp-12 … r2s-mass_migration-metropolis-2 · r2s-under_siege-hamlet-2 |
| Managed Forest | Managed Woodland | 148 / 94 | r2r-thorp-7 … r2s-wartime-metropolis-1 · r2s-famine-thorp-2 |
| Precious Metals | Precious Metal Veins | 117 / 91 | r2r-thorp-4 … r2s-mass_migration-metropolis-1 · r2s-occupied-thorp-3 |
| Crossroads Position | Strategic Crossroads | 115 / 115 | r2r-thorp-2 … r2s-mass_migration-metropolis-2 · r2s-under_siege-thorp-0 |
| Hot Springs | Hot Springs / Healing Waters | 109 / 109 | r2r-thorp-0 … r2s-religious_conversion-metropolis-1 · r2s-under_siege-thorp-3 |
| River Fish | River Fisheries | 87 / 59 | r2r-thorp-12 … r2s-mass_migration-metropolis-2 · r2s-under_siege-thorp-0 |
| Shipbuilding Timber | Coastal Timber | 78 / 53 | r2s-under_siege-thorp-1 … r2s-wartime-metropolis-3 |
| Deep Harbour | Deep Natural Harbour | 70 / 70 | r2r-thorp-43 … r2s-wartime-metropolis-3 · r2s-under_siege-thorp-1 |
| Magical Node | Magical Ley Line Node | 66 / 45 | r2r-thorp-43 … r2s-wartime-metropolis-2 · r2s-under_siege-thorp-1 |
| River Mills | Mill Sites | 50 / 50 | r2r-thorp-1 … r2s-mass_migration-metropolis-0 · r2s-famine-thorp-0 |
| Alpine Pasture | Alpine Pastures | 47 / 36 | r2r-thorp-7 … r2s-insurgency-metropolis-1 · r2s-occupied-thorp-1 |
| Hot Springs Mineral | Mineral Hot Springs | 41 / 41 | r2r-thorp-7 … r2s-insurgency-metropolis-1 · r2s-under_siege-town-2 |
| Defended Pass | Mountain Pass | 29 / 29 | r2r-thorp-16 … r2s-insurgency-metropolis-1 · r2s-occupied-hamlet-0 |
| Date Palms | Date Palms and Orchards | 18 / 15 | r2r-thorp-4 … r2s-succession_void-metropolis-1 · r2s-famine-city-1 |
| Oasis Water | Oasis and Water Rights | 16 / 16 | r2r-thorp-4 … r2r-metropolis-25 · r2s-occupied-hamlet-1 |
| River Clay | Clay Deposits | 15 / 11 | r2r-thorp-27 … r2s-mass_migration-metropolis-0 · r2s-occupied-thorp-0 |
| Glass Sand | Fine Glass Sand | 14 / 9 | r2r-thorp-10 … r2s-religious_conversion-metropolis-0 · r2s-occupied-hamlet-1 |
| Desert Salt | Salt Pans | 10 / 8 | r2r-hamlet-14 … r2s-religious_conversion-metropolis-0 · r2s-under_siege-town-1 |

The ten keys whose formatter word was already the label (Fishing Grounds, Salt Flats, Fertile Floodplain, Hunting Grounds, Ancient Grove, Gemstone Deposits, Ancient Ruins, Marshlands, Camel Herds, Mountain Timber) keep their words. In the commodity row they now print in the label's case, where the record's lower-case key printed before ("hunting grounds" → "Hunting Grounds"; the screen's CSS already capitalized it).

**THE PDF AND THE JOURNAL PRINT ANOTHER WORD (X26's question):** both print the key run through a formatter, not the catalogue's label. The PDF's Resources & Production page (`src/pdf/sections/ResourcesProduction.jsx`, the nearby chips) prints "Defended Pass". The journal's Resources page ("Nearby resources: … Defended Pass", "Depleted: Managed Forest": `src/foundry/journalPages.js :: resourcesPage`, `humanize(label(x) || x)`) does the same. The three surfaces agreed before on the formatter's word; now the tab prints the catalogue's and the two exports do not. NAMED for the EXPORTS seats: the cure is the same call, `resourceDisplayName.js :: RESOURCE_DISPLAY_LABELS[k]` for a catalogue key (the seam keeps the catalogue out of the PDF bundle). The Economics tab's card already prints "Mountain Pass" (the chain's own resource name).

**The test:** `tests/components/resourcesCatalogueLabel.test.jsx` (births of the census's own seeds).
- Four NOT pairs (Defended Pass, Iron Deposits, Crossroads Position, Hot Springs), each naming the label that prints instead.
- Five whole-section checks (every catalogue ground prints its label, and no formatter word that differs).
- Four KEEP (labels the formatter already gave).
- **9 red at the base, the 4 KEEP green**; all 13 green on the cure. `resourcesNoPlentyUnderSiege.test.jsx` is still green: its anchor "Grain Fields" is inside "Extensive Grain Fields".

**Gates:** with batch 4's, above (the gate tree held both commits). **Registers:** none. **Declared moves:** none.

## The rows printing in five towns or more, verified (the chair's order after X26)

Every row of the worklist is now cured, struck or named in this hand-back. The rows of five towns or more that were left, verified by the record over batch 4's after census:
- **B28006, B28222** "Wool→cloth→dyed fabric" (the Partial card) / "cloth, dyed fabric" (Export Potential) (39 towns): the wool chain is filed partial where exactly one house supports it (`resourceGenerator.js :: evaluateInstitutions`). In **38 of 39** that house is "Weavers/Textile workers", whose work is cloth, so the card is true. It is false in **1**: r2r-hamlet-48, where the lone house is a Shepherd (no weaver, dyer or fulling mill). ONE TOWN: it WAITS by the chair's order (fewer than five). The cure would be the card's goods borne out by its house, as `chainOutputsShown` does for a flow card's outputs.
- **14551** "No one here works the mineral hot springs near X." (22): STRUCK. In all 22 towns the springs are unexploited on the record: no chain, no house. The reader took the Unexploited card's "Draws on: hot spring source, knowledge of properties" (what the chain would draw on) for present work. A candidate for the chair if wanted: "Draws on:" on an Unexploited card could read "Would draw on:". A rewording, not made.
- **14404** "Needed, and not brought in: timber, stone, metals." (17): STRUCK. In all 17 towns no raw metal arrives. Two sieges bring "Iron (weapons)", a worked good, and by W2-C-LEAVES item 4(b) a worked good meets no raw need (`tradeListDisplay.js :: needMetBy`).
- **B13482** "Needed, and not brought in: spices." (13): STRUCK. In all 13 the line restates the record's own critical need (`resourceAnalysis.imports.critical`, "Hills terrain cannot produce this locally"), and no arrival names a spice. Note: "Luxury textiles and exotic goods" arrives in each, and whether "exotic goods" holds spices is the trade record's to say. If it should, the cure is a family word in `needMetBy`, not this line.

## What is left (as at X26)

- **Nothing of five towns or more.** The rows that wait (fewer than five towns), with their writers: B28006/B28222's one town (r2r-hamlet-48); **14395, 14400, 14242** (1 each: fish needed beside a fishmonger, `tradeListDisplay.js :: importsAsPrinted`); **B28459** (1) and the one-town chip runs struck as data (X28).
- **X23**: switch the tab to `shadowEconomyShown` / `criticalImportsShown` when the chair names a tip that holds them.
- **NAMED for the EXPORTS seats:** the PDF's and the journal's nearby-resource words (X26, above).
- Named and not this seat's: **13538** (`magicProfile.js`), **11963, 29070, 22229, B29895, X25.2** (`validationOnPage.js`, X27: another seat's), **B11520, 12110, 12104, 12111, 22206, 16853, B19491** (`domain/foodways.js`), **01192, 05224** (DEFECON), **X28** the catalogue's commodities (data, the record's next measure), and the earlier lists.

## How the instruments were re-made for batch 4 and X26

As above (`git archive` of READ-ALL and CENSUS-3 to the seat's scratch). Worktrees: `wt` (the cure, its own `npm ci`), `base` (fcab8b63d), `after` (bb5ebff5c) and `after26` (the X26 commit), each `node_modules` linked to `wt`'s. One census at a time. The record probes, kept in the seat's scratch: `leafcount.mjs` (the leaf's count over `corpus.ndjson.gz`, and batch 2's silence against the leaf's), `markcount.py` (the marks the Economics view of each dump prints), `pick.mjs`, `reskeys.mjs` (X26's old-to-new list with towns) and `labels.mjs`.

## Hand-back (TAIL-DISPLAY-ECON-4)

The worklist is finished inside the count (X24): batch 4 (X25.1) and X26 are pushed, and every row of five towns or more is verified. The branch tip is the hand-back commit after 9abfb1553. The after census of X26 (at 29deff376, the same code as 9abfb1553) is the next seat's before only if it renders that tree. It was written to this seat's scratch, which does not outlive the container: re-make it with the commands above.

# TAIL-DISPLAY-ECON-5 · the fifth seat's jobs (X30 to X32)

Seat: TAIL-DISPLAY-ECON-5 (builder), succeeding TAIL-DISPLAY-ECON-4 on the same branch from its tip **7beec164d**. First act: the joined line at **5d1e3096b** merged (merge commit **1322e7d0a**, the only merge). Scratch worktrees, detached; pushed by explicit refspec. The hand-back is this seat's to keep current.

## The chair's rulings for this seat (2026-11-15 04:02 UTC; each vetoable by the owner)

- **(X30)** THE SHADOW ECONOMY'S FIGURE (the Economics tab's "Shadow Economy: N% capture", 476 towns): measure where the figure comes from, where a capture stands with no criminal income source, and where it differs from the income's share and why (if they count different things the row says what it counts, in three words). Cure at the display: the row prints through the leaf the PDF already uses (`shadowEconomyShown`; the export prints what the tab prints), silent where the record holds no illicit money. A capture with no source: one line to the chair with the count.
- **(X31)** "A few households still go short, and a bad season would leave more of them hungry." (`EconomicsTab.jsx :: shortWords`, 183 towns) printed where the food record shows no gap and the band is Secure: the words read the food record's own band.
- **(X32)** THE MAGIC WORDS AGAINST THE FOOD RECORD: "Reliance on magic: None" (720 print the label, 366 the word), "Nothing structural at <N> depends on arcane work." (122) and "Economic role: occasional" (338) in towns whose food record shows food made by magic. Measure where the label reads None beside a record share above nothing; the label and the lines read the record's share (the smallest true word for a trace), in one home; where the record's share is the doubtful thing, one line to the chair.
- **(X33)** STRUCK by the chair (not this seat's): the "Production … imported" figures; "Fully exploited" on a failed fishery (cured on another branch).
- (U1) The usage warning is on: push every job the moment it holds; hand back at 250,000 or about seventy minutes; one line to the chair at the hand-back, a stop, or for the two counts X30 and X32 ask for.

## The measures before (census at 1322e7d0a, 720 towns, by script over `corpus.ndjson.gz` and `dumps/`)

- **X30.** The figure is `economicState.safetyProfile.blackMarketCapture` (`safetyProfile.js`: the criminal effect less 25, over 3, plus a stress bonus scaled by size). The record adds its criminal income share (`economicState.js`: "Black Market Revenue" and its kin, `isCriminal`, weighted by the capture) only where the capture is ABOVE 10. Of the **476** towns that print the row, **240** (capture 3 to 10, exactly) hold **no criminal income source**: 169 of them no criminal house either, 53 neither a house nor a crime pattern; 71 do hold a criminal house and 79 a criminal-economy chain (the record's capture without its money: TOLD TO THE CHAIR for the record's measuring seat). In all **236** towns above 10 the source stands; in **228** of them its share differs from the capture, because the two count different things: the capture is the trade that goes unrecorded (the block's own scale notes say so); the income row is the criminal take's share of all the town's income, normalized with the other sources (33 beside 19).
- **X31.** The line prints in exactly **183** towns: the record's band is **Secure in 177** (33 with a record gap of 0%, the leaf rounding a few pounds up to 1%; 144 with 1 to 5%, inside the band's own cut), **Pressured in 6**.
- **X32.** "Reliance on magic: None" (on the Magic tab and the Overview's substrate line) beside a record share above nothing: **4 towns** (r2s-occupied-thorp-0, r2s-occupied-thorp-2, r2s-indebted-thorp-2, r2s-insurgency-thorp-2). In all four `foodRecord.magicPct` is 1 while `foodSecurity.magicOffset` is 0 (no pound of provision) and no practitioner stands ("No arcane practitioners on the rolls"): a sub-pound trace (`foodGenerator.js` hands `deriveFoodRecord` the unrounded offset and publishes the rounded one) rounded into the record's share. THE RECORD'S SHARE IS THE DOUBTFUL THING: TOLD TO THE CHAIR; the label is true by the pounds and is not changed. The foodways sentence "some of what the thorp eats is provided by spell or by prayer" reads that 1% (`domain/foodways.js`, not this seat's). "Nothing structural …" beside a record share: **2** (two of those four). "Economic role: occasional" beside the food record's own provision (`foodMagicShare` > 0, under "Reliance on magic: Relied upon"): **63** (50 food alone, 13 food and a magic chain; a thorp fed 26% by magic among them).

## The cures (one commit a job; pushed at 756ba4bda)

- **X30, commit 1f41c23dc.** `shadowEconomyShown.js :: SHADOW_CAPTURE_FLOOR` 3 → **11**, the record's own floor for its criminal income share. The tab's block reads `shadowCaptureShown` (as the PDF already did), and the row reads **"Shadow Economy: N% of trade unrecorded"**. Every EconomicsTab edit in place (no line moved); the prose-numerics row at line 663 re-keyed by identity; `economicsTabFlow.test.js`'s anchor re-keyed to the new words.
- **X31, commit a4cd78c81.** `shortWords` takes the record's band (`foodRecord.band`): Secure prints **"Between them, nearly every household is fed, and a bad season would leave some of them short."** (under a crisis that brings the hunger here: "Between them, nearly every household is fed for now.", printed nowhere in the census). Every other band keeps its words.
- **X32, commit 756ba4bda.** `magicProvisionShown.js :: economicRoleBandShown` (new; only the Magic tab calls it): an economic band of absent or occasional beside the food record's own provision prints **"common"**, the ladder's smallest word true of a provision made every day ("regular, not foundational"). `MagicTab.jsx`: the role line and its gate read it. No export prints the role.

## The inventory diff (census before 1322e7d0a, after 756ba4bda)

Tabs: `sentences: before 29899 after 29899 · gone 2 · new 2 · in fewer towns 41 · in more towns 4 · moved 0`.
- "Shadow Economy: #% capture" 476 → 0; NEW "Shadow Economy: #% of trade unrecorded" 236. X30's 240 silenced exactly.
- "A few households still go short, …" 183 → **6** (the Pressured six); "Some households still go short, …" 40 → 39 (r2r-hamlet-12, band Secure); NEW twin 178 (177 + 1). X31's measure exactly.
- "Economic role: occasional" 338 → 275 and "Economic role: common" 151 → 214: X32's 63 exactly.
- **EVERY OTHER LINE IN FEWER TOWNS IS IN THE 240 (each lost town is one of them), explained:**
  - The block's own lines, unsupported where the record holds no illicit money: "Off-book" 476 → 236; the drag lines ("Some goods change hands here without a licence or a duty paid." 172 → 68, "It is noticed, …" 136 → 52, "A little changes hands here quietly, …" 70 → 18); the scale note and DS-ECO-6's desk lines of a small shadow trade ("Some petty theft goes on here, …" 45 → 7, "The shadow trade at <N> is small, but it is not casual …" 69 → 23, "Little of <N>'s trade goes unrecorded, …" 54 → 18, "There is some thieving …" 48 → 7, "There is unlicensed trade …" 43 → 9, "What passes for a shadow economy …" 43 → 9, "A little of <N>'s trade is done out of sight, …" 18 + 15 + 14 + 8 → 3 + 1 + 1 + 5, "Every <size> this size has both." 17 + 17 + 11 + 3 → 4 + 1 + 1 + 1).
  - **TRUE LINES SILENCED, the fact still on the page:** the "Criminal supply chains" pills ("Criminal supply chains" 236 → 157, "Operational" 224 → 149, "Black market" 189 → 147, "Guild crime", "Transhipment hub", "Smuggling" 168 → 166): **79 towns**; each chain still prints as its own Economic Flows card on the same tab ("Black market · Criminal economy · Operational", checked in all 79).
  - **TRUE LINES SILENCED, told to the chair before the push (X30's silence):** DS-ECO-6's hidden-house and theocratic lenses (the `DeskLines` under the block): "<N>'s Underground network / city / Black market bazaar works below its streets, …" and "The way into <N>'s Underground … is through a cellar, …" (about 28 towns), "A merchant arriving at <N> soon learns that the religious house has the last word …" 9 → 5 and "The clergy have more say over <N>'s market …" 5 → 3. The houses print on the Defense tab. NARROWING, for the next seat if the chair wants it: draw `DeskLines` where the block is silent but the raw capture was 3 or more (an edit in place on line 630; its own census).
- "Patron deity" and its two lines 716 → 717: the render warm-up flake batch 3 named (no file of this seat renders that panel).
- **THE INHERITORS, read where they print:** "Shadow Economy: #% of trade unrecorded" (236, e.g. r2r-city-0: "16% of trade unrecorded" beside "Black Market Revenue"), the Secure twin (178, e.g. r2r-city-12), "Economic role: common" (63, e.g. r2r-city-38, beside "Reliance on magic: Relied upon"): each is true by the record where it prints.

Exports (`SURFACES=PDF,Journal`): `before 36746 after 36746 · gone 0 · new 0 · in fewer towns 4 · in more towns 1`. The PDF follows the leaf: "Black market capture: #% of economy" 476 → 236; "SHADOW ECONOMY" 573 → 522 (it still prints where the record holds crime patterns or criminal chains); the enforcement line ("The criminals outmatch those who keep order." 217 → 209; "Those who keep order roughly match the criminals." 83 → 76) gives way in **15 towns** to "No criminal infrastructure has been identified." (62 → 77): towns with no criminal house, no crime pattern and now no shadow share (`criminalsStandHere`): true there.

## THE VETO LIST (this seat): every new or changed line, with the towns it was read in (smallest … largest · a crisis town)

1. "Shadow Economy: N% of trade unrecorded" (236): r2r-thorp-10 … r2s-wartime-metropolis-3 · r2s-famine-hamlet-3.
2. The Shadow Economy block SILENT where the capture is 3 to 10 (240): r2r-thorp-8 … r2s-wartime-metropolis-1 · r2r-thorp-58 (a siege), r2r-thorp-17 (a famine), r2r-thorp-27 (an occupation). The PDF's capture line silent in the same 240; its enforcement line reads "No criminal infrastructure has been identified." in 15 (r2r-thorp-13 … r2s-succession_void-town-3 · r2s-infiltrated-thorp-3).
3. "Between them, nearly every household is fed, and a bad season would leave some of them short." (178): r2r-thorp-10 … r2s-wartime-metropolis-3 · r2s-occupied-thorp-2.
4. "Economic role: common" where the profile said occasional (63): r2r-thorp-16 … r2s-plague_onset-city-3 · r2s-occupied-thorp-1.

## The tests

- `tests/components/displayEconShadowFloor.test.jsx` (X30): 4 NOT pairs (three silent by design, one naming the new words) and the one-home check (the leaf prints a capture exactly where the record holds a criminal income share), red at the base; 1 KEEP green.
- `tests/components/displayEconShortWords.test.jsx` (X31): 3 NOT pairs red at the base, each naming the twin; 2 KEEP (Pressured) green.
- `tests/components/magicRoleFoodProvision.test.jsx` (X32): 3 NOT pairs red at the base, each naming "common"; 3 KEEP green (occasional with no provision, common, integral).
- **11 red at the base 1322e7d0a, 6 green; all 17 green on the cure.** The base run is the plant.

## Gates (the cured tree 756ba4bda)

- strict domain: 1113 against 1113. Type ratchet: 167 against 167. eslint on the touched files: clean.
- presumed-things walker `--check`: 34 fresh at the base and 34 after, the same set (its exit 1 is the base's own).
- twelve-birth grid: exit 0, 2 falls (P7a: r2r-city-0, r2s-insurgency-metropolis-0), no rise.
- the 82 test files naming the touched files: green but nine. Six are the reds batch 4 named as carried (`dossierPhoneFloorAllViews`, `phoneChromeFloor.census`, `observedShapeReaders.walker`, `proseNumerics`, `rawColorLiteral`, `dossierProseManifest`). Three more fail the same 5 tests, by name, at the base 1322e7d0a: CARRIED FROM THE JOINED LINE (its record cures moved those births), not this seat's: `displayEconCrisisMarks` (3: r2s-famine-hamlet-0's fish line, r2s-under_siege-town-1), `displayEconRelianceFoodWords` (1), `defenseTabFlow` (1: T2-24 STOP-2). The two of this group's own files are NAMED for the next seat: re-key their pins by identity at the joined births.

**Registers:** the prose-numerics row re-keyed by identity (line 663's snippet). None stale. **Declared moves:** none (no generator or data file touched; the record is unchanged).

## Named for other seats

- **The EXPORTS seats:** the PDF's capture line says "Black market capture: N% of economy"; the tab now says "N% of trade unrecorded" (the same figure; the PDF's words are its own). The floor is already shared through the leaf.
- **The record's measuring seat (told to the chair):** X30's capture without its money (240 towns; 71 with a criminal house, 79 with a criminal chain); X32's magic trace (4 towns: `foodRecord.magicPct` 1 beside `magicOffset` 0, no practitioner).
- **`domain/foodways.js`:** "some of what the <size> eats is provided by spell or by prayer" reads the same 1% (4 towns).
- **Not cured, the same shape on this group's tab (a candidate for the chair):** "Economic role: occasional" under "Reliance on magic: Relied upon" where the reliance is a CHAIN that needs magic, not the food (36 towns), and "Economic role: absent" beside it (8). X32 was the food's; this would read the whole reliance reading.

## What is left (as at 756ba4bda)

- X30, X31 and X32 are cured and pushed; X33 was struck by the chair.
- The rows under five towns still wait, as the last seat left them: B28006/B28222's one town (r2r-hamlet-48); 14395, 14400, 14242 (1 each, `tradeListDisplay.js :: importsAsPrinted`); B28459 (1).
- The two carried pins of this group's own tests (`displayEconCrisisMarks`, `displayEconRelianceFoodWords`), re-keyed by identity at the joined births.
- The candidates above: the desk lenses' narrowing (X30) and the chain-reliance role rows (X32's shape).

## How the instruments were re-made

`git archive` of `docs/chair/2026-11-14/probes/READ-ALL` (lane/chair-2026-11-08) and `CENSUS-3` (lane/census-3-2026-11-14) into the seat's scratch. Worktrees: `wt` (the cure, its own `npm ci`), `base` (1322e7d0a) and `after` (756ba4bda), each `node_modules` linked to `wt`'s; one census at a time (`census3.sh <tree> <out> 4`, about 22 minutes), then `inventory.py` (and `SURFACES=PDF,Journal inventory.py` for the exports) and `inventory_diff.py`. The record probes (scratch, not kept): `x30.mjs` (the capture against the income sources), `x31.mjs` (the short words against the band, through the tree's own `foodRowShown` and `carriersOf`), `x32*.mjs` (the reliance word, the role rows and the Magic view against `foodMagicShare` and `foodRecord.magicPct`).

## The chair's ruling U2 (received after the hand-back): the three red files of this area, each run alone at 76450d5f8

- `tests/components/displayEconRelianceFoodWords.test.jsx` (1 red): (ii) A PIN A DECLARED MOVE EXPLAINS. The KEEP pair's card still prints in r2s-famine-town-1; the record's Entrepôt share moved 13 → 14 under the economy family's declared moves on the joined line (TAIL-DEFECON-2 5f67f382d, TAIL-DEFECON-3 2ac50c55d; which of the two is not isolated). RE-KEYED BY IDENTITY to "… 14% of income"; 23 of 23 green.
- `tests/joins/fieldManifest.test.js` (1 red at this tip, `magicRecovery`; the `magicNote` read the chair saw is green here): (iii) the cause is not in this seat's files. `src/domain/fieldManifest.js` lists `EconomicsTab.jsx` as a consumer of `activeChains[].magicRecovery`; the tab's read left with the recovery chip at **56f73d7ec** (W2-C-LEAVES-5 item 5), already on the joined line. The field keeps its reader (`supplyChainState.js`); the manifest's consumer list is stale, and the manifest is outside this group's files: for its own door.
- `tests/joins/labelJoins.test.js` (1 red): (iii) not this seat's: `src/generators/power/claimStanding.js` gains one label-join site (`instNamesScan`), last touched by **cc834166f** (TAIL-POWERS-B batch 2) on the joined line.
- Still red and carried (named above): `displayEconCrisisMarks` (3, the joined births moved its pins: for the next seat to re-key by identity, as this one was).

## Hand-back (TAIL-DISPLAY-ECON-5)

Handed back after X30 to X32, inside the count. The branch tip is the hand-back commit after 756ba4bda. The after census (at 756ba4bda) was written to this seat's scratch, which does not outlive the container: re-make it with the commands above.
