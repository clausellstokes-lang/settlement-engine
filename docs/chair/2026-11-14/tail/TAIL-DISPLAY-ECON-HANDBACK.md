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
