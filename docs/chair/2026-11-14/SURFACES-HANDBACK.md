# SURFACES-1 HAND-BACK (kept current after every item)

Seat SURFACES-1, session session_01ACmDYY4e42qgTGxPJkYTLt; chair session_01ACmDYZrFEVXyZEUg1NDxxC. Branch
`lane/join-surfaces-2026-11-14`, cut from `lane/join-2026-11-14` at **035159bc7** (the tip on origin when I began; it has
since moved to b6a5f97ab: not merged, the lane lands on the chair's word).

## The law

ONE READER FOR ONE FACT ON EVERY SURFACE (the chair, 2026-11-14; vetoable by the owner). What the tab says of a fact,
the PDF and the Foundry journal say through the same function the tab calls; no surface re-derives a fact from the raw
record or prints a stored key; a surface with no room prints less, never something else.

## The rulings this seat worked to (the chair's messages are not on the branch)

- 11:48Z: PWR-MODPDF moved up to the second cure. 12:11Z: **RULED NOT MINE**: the powers reader
  (`src/domain/display/governingModifierWords.js`) is on the powers lane after its join commit 77d7bcace, not on the
  joined tree, so that lane's seat makes the PDF's Power chapter and the Summary legend call it. PWR-MODPDF and
  PWR-MODLEGEND dropped; `src/pdf/sections/PowerStructure.jsx` and the Summary legend untouched. Order now: item 1; item
  2 (outputs on the PDF's flow and cards, the other spelling of a good); item 3 (the PDF's deficit against Short; the
  Overview's food word); "Abundant" under a siege; the bracketed names (the tab's one and the PDF's medical line); the
  stores' unit in 6 towns. One line to the chair after item 1.
- 12:27Z: item 3 widened: ONE HOME FOR THE FOOD WORD ON EVERY SURFACE: the PDF's Identity block ("Surplus" against
  the PDF's own Tonight "Secure", 830 of 1,536 by the r2-code-b reader, its row M1); every place a surface prints a food
  status word is listed with its count before the cure; one line to the chair when item 3 is pushed, with the three
  counts (Overview, PDF Identity, any other).

## Item 0: the table, MEASURED (one script)

Instruments (outside every tree; re-made by copying them back): the reader's probes (`render.sh`, `surfaces.sh`,
`jrlines.mjs` from `lane/review-w2-c-leaves-2026-11-14:docs/chair/2026-11-14/probes/REVIEW-W2-C-LEAVES/`) for the tab
dumps, the PDF text and the journal; my `measure.census.jsx` (each fact as the tab's reader gives it and as the PDF's
sections, walked as tests/pdf do, and the journal's markdown print it) and `agg.mjs` (the table). Births: the census's
720 (r2r, r2s) + 48 rr3 (12 each of famine, occupied, under_siege, under_siege+famine) + 4 (`seeds-extra.txt`) = 772;
56 siege, 49 famine, 36 occupied. Towns where the PDF or the journal says what the tab does not:

| fact | surface | towns before | items | after | three towns |
|---|---|---|---|---|---|
| 1 chain state (class: impaired / vulnerable / working / none) | PDF cards | 241 | 395 chains | **0** | r2r-thorp-0, -1, -2 |
| 1 chain state (class) | PDF flow colour | 241 | 395 | **0** | r2r-thorp-0, -1, -2 |
| 1 a working word under a siege or famine where the tab says Impaired | PDF cards | 61 | 165 | **0** | r2r-hamlet-0, r2r-village-21, -55 |
| 1 the flow's "K impaired" group header | PDF flow | 33 | 68 | **0** | r2r-city-44, r2r-metropolis-14, r2s-under_siege-town-0 |
| 1 the stored key printed ("*(entrepot)*") | journal | 220 | 629 | **0** | r2r-thorp-1, -30, r2r-hamlet-8 |
| 1 chain state (class) | journal | 0 | | struck, 0 | |
| 1 chain state (word: "Active" for "✓ Running") | PDF cards | 757 | 4,838 | **0** | |
| 2 chain outputs the tab does not print | PDF flow | 596 | 881 | **0** | r2r-thorp-0, -1, -2 |
| 2 chain outputs the tab does not print | PDF cards | 756 | 5,853 | **0** (the aggregator's 160 are cards printing no outputs, read) | r2r-thorp-0, -1, -2 |
| 2 trade lists: exports, imports, local | PDF, journal | 0 | | struck, 0 | |
| 2 imports under a siege | PDF, journal | 0 | | struck, 0 | |
| 2 a pill in another spelling than the tab ("River fish") | PDF, journal | 165 | 165 | | r2r-thorp-44, -50, -56 |
| 3 the PDF's deficit against the tab's Short | PDF | 253 | | | r2r-thorp-32, r2r-hamlet-12, -14 |
| 3 the Overview's food word against the food band | Overview tab | 159 | | | r2r-thorp-4, -10, -16 |
| 4 "Abundant" under a siege | PDF | 56 of 56 | | | r2r-thorp-45, -58, r2r-hamlet-0 |
| 4 a power's modifier key | PDF 344/344, Power tab 344/344 | | | RULED NOT MINE | |
| (i) a catalogue count range | History tab 1, Overview tab 1 ("Taverns (5-20)"); PDF 4 (medical line "monasteries (5-10)") | | | | r2r-town-9; r2r-metropolis-32, -51 |
| (ii) the Tonight sheet's stores length | "a few weeks of grain" prints nowhere; 6 of 630 towns differ in unit (Defense "week", Tonight "month") | | | | r2r-hamlet-28, r2s-famine-hamlet-0, -2 |
| (10) the journal names every chain "Chain" | journal | 766 | 10,309 | the coherence-upkeep lane's (UPKEEP-14 (j), viewModelBodySlices.js, after its join commit) | |

The trade connectivity row (UPK-869) is not in this table: the PDF's FOUNDATIONS grid prints only with a system state
(the Campaign State export), which a fresh birth has none of; it is measured at its own item.

## Item 1: THE CHAIN'S STATE (HIGH) — DONE, b6f5d459b

- CAUSE: the PDF's cards (`Services.jsx :: ChainCard`) worded the record's stored state; its flow
  (`SupplyChainFlow.jsx`) coloured, sorted and counted by it; the journal printed the stored key.
- CURE: `src/pdf/lib/chainStateOnPage.js` (this lane's): the tab's reader (`chainAsShown`) and the tab's chip words
  (`FLOW_STATUS`, glyphs struck). Cards and flow read it; `journalPages.js` is one call line and its import.
- COUNTS: the table's item-1 rows, before and after (all to 0 on the 772).
- GUARD: `tests/pdf/chainStateThreeSurfaces.test.jsx` (siege hamlet and metropolis, famine hamlet and city, occupation,
  a no-state chain, guard town). Red first: 4 of 5 at the uncured base; each surface uncured alone reds its own arm.
- READ: r2r-hamlet-0, r2r-metropolis-14, r2r-hamlet-16, r2r-thorp-1 (the commit body has the lines).
- PRINTS LESS: the cards' "Resource Depleted" and "On Substitute" pills (the tab prints neither; the depleted ground is
  said on the source, "(depleted)", as the tab's card says it); a pill where the tab prints no chip.
- NOT CURED, SAID: the flow colours "operational" green as "running" (its legend has no Operational swatch); the tab
  colours it neutral. The state is the tab's; the colour of one state is the flow's own.

## Item 2: THE CHAIN'S OUTPUTS — DONE, e280d24e1

- CAUSE: the PDF's flow printed the record's outputs (else the chain table's); its cards the first four raw.
- CURE: both call the tab's reader `chainOutputsShown` (three, as the tab).
- COUNTS: flow 596 -> 0 towns, cards 756 -> 0 (the table).
- GUARD: the sixth title of `tests/pdf/chainStateThreeSurfaces.test.jsx`; each file uncured alone reds it.
- READ: r2r-hamlet-0, r2r-hamlet-16, r2r-thorp-1, r2r-metropolis-14 (the commit body).
- PRINTS LESS: the cards' fourth output.
- LEFT IN ITEM 2: the other spelling of a good (165 towns: the PDF and the journal print `resourceDisplayName`'s
  "River fisheries" where the tab prints the record's "River fish"): not begun.

## THE FOOD WORD: MEASURED, NOT BEGUN (handed back at the count, before starting it, as the chair ruled 12:39Z)

Every place a surface prints a food status word (grep of src/pdf, src/foundry, src/components, src/domain/summary for the
stored label `economicState.foodSecurity.label` and for a band word), with its count on the 772 at 035159bc7:

| site | what it prints | reads | towns differing from the one home (`tonightSheet.js :: foodBandOf(eco.foodSecurity?.foodRecord)`) |
|---|---|---|---|
| Overview, Systems-health "Food Security" (`OverviewTab.jsx` ~431-438) | the stored label and its colour | the record raw | **159** ("Secure" / band "Pressured": r2r-thorp-4, -10, -16) |
| PDF Identity block "Food" (`pdf/sections/IdentityDailyLife.jsx` ~105-111) | its own word: Deficit / Surplus / Balanced from the view's deficit and surplus | the view | **729** (r2r-thorp-0 "Surplus" / band "Secure"; r2r-thorp-1 "Balanced"; 662 against the PDF's own Tonight page) |
| Substrate tab, Foundations "Food security" (`SubstrateTab.jsx :: foodRecordWord`, ~105) | the stored label, cased as the Overview | the record raw | the Overview's set (same stored word): not separately counted |
| `components/new/generalDeskRead.js:251` (`foodSecurityLabel`) | a desk's input, the stored label | the record raw | a prose input, not counted |
| Daily Life (`DailyLifeTab.jsx:132`), the Tonight sheet, the quick guide (`settlementQuickGuide.js:895`) | the band | the one home (the quick guide falls back to the stored label) | 0 by construction |

THE CURE, as I would make it (not begun): one display leaf of my lane, `foodWordShown(record)` = `foodBandOf(...)` with the
stored label as fallback (the brief's words), called by ONE line at each of the Overview row, the Substrate row and the
PDF Identity block (the Identity's own Deficit/Surplus/Balanced is a second vocabulary: it prints the band's label, or
nothing). Holders by content before each file: OverviewTab.jsx is the coherence-upkeep lane's too (its tensions lines;
nothing since its join commit at my reading). The guard: a sibling of `chainStateThreeSurfaces.test.jsx`, the
Overview, the Substrate row, the PDF Identity and the Tonight sheet agreeing in a siege, a famine, an occupation town.

## Found, not cured (file, holder)

- **The lighting census is red at the joined tip 035159bc7** (`tests/lint/sovereigntyLightingContract.walker.test.js`,
  "THE CENSUS IS AN ASSERTION": the baseline was taken at R3-CODE-C-6, before the join; a re-take moves 3251 -> 3449
  files). Its door is the merge seat's at the joined tip; I did not re-take it (that would bank the join's 197 other
  files under my name). My new test files add to it: re-take after the merge seat's, at the chair's word.
- Red at the joined tip, the same titles with and without my change (classed against the base in a detached tree):
  `presumedThings.walker` (door `--check`: 153 fresh, 1 strip fresh), `factLayers.walker`, `observedShapeReaders.walker`,
  `writerReach.walker`. Not mine.

## What is left, line by line (the next seat)

0. FIRST ACT (the chair, 12:39Z): merge the joined line's tip (b6a5f97ab or later) into this lane; re-take the lighting
   census ONCE through its ritual with every test file both seats added (mine: `tests/pdf/chainStateThreeSurfaces.test.jsx`).
   Until then it is a NAMED RED, class "refreeze".
1. THE FOOD WORD on every surface (above: Overview 159, PDF Identity 729, the Substrate row), BEFORE anything narrower;
   one line to the chair when pushed with the three counts.
2. Item 3's deficit: the PDF's food block (`EconomicsTrade.jsx :: FoodBalanceBlock`, fed `vm.economics.foodBalance`
   from `viewModelPrimitives.js :: foodCore`) prints the view's deficit where the tab's row prints `foodRowShown`'s
   Short: 253 towns (r2r-thorp-32 pdf 2 / tab 1). The tab calls `foodRowShown(s, !!carriersOf(s, eco))`
   (EconomicsTab.jsx:330); the PDF's block reads the same leaf.
3. Item 2's other spelling: 165 towns, the PDF and the journal print `resourceDisplayName(x)` ("River fisheries") where
   the tab prints the record's spelling ("River fish"): which side is the house's word is to be ruled first (the
   reader called the PDF the false side).
4. "Abundant" under a siege (`ResourcesProduction.jsx` ~167, `r.nearbyAbundant`): 56 of 56 siege towns; the tab's
   Resources prints no Abundant group.
5. The bracketed names: the tab's one (r2r-town-9, "Taverns (5-20)", History and Overview tension rows, through
   `houseLabelsInText` as the PDF's History does; check OverviewTab.jsx's tension lines by content first) and the PDF's
   medical line ("Major monasteries (5-10).", 4 towns: r2r-metropolis-32, -51, r2s-indebted-metropolis-2).
6. The stores' unit: 6 of 630 towns (Defense "would carry … for a few weeks", Tonight "a month…": r2r-hamlet-28,
   r2s-famine-hamlet-0, -2).
7. The trade connectivity row (UPK-869): the PDF FOUNDATIONS grid (`SystemStateSnapshot.jsx :: CausalSubstrate`) prints
   `causalBandWord` where the Substrate tab prints `siegeCrisisWord` (and `foodRecordWord` for food); measure with a
   system state (the Campaign State export).
8. The power key (PWR-MODPDF, PWR-MODLEGEND): RULED the powers lane's; not mine.

HOW THE INSTRUMENTS ARE RE-MADE: copy the reader's probes out (`git archive origin/lane/review-w2-c-leaves-2026-11-14
docs/chair/2026-11-14/probes/REVIEW-W2-C-LEAVES`); seeds = `seeds-all.txt`'s r2r/r2s lines + every 4th rr3 line of
famine, occupied, under_siege, under_siege+famine + `seeds-extra.txt` (772); `render.sh <tree> <out> <seeds> 3` (~18
min), `surfaces.sh`, then my `measure.sh <tree> <records> <out> <seeds>` + `RECS=<records> node agg.mjs <facts> <dumps> <surfaces> <seeds>` (they are in this file's sibling directory
`docs/chair/2026-11-14/probes/SURFACES-1/`).

# SURFACES-2

Seat SURFACES-2, session session_01ACmDYWwpmJS8jPaa4wcw8v; chair session_01ACmDYZrFEVXyZEUg1NDxxC. Branch
`lane/join-surfaces-2026-11-14`, read back at 24251bd88 at the start (as the brief said). Merges of the joined line
into the lane: c2c12792e (9e47f912a, the first act), fe6386f83 (a2df276b0, once w2-fix-data's IdentityDailyLife.jsx
change had landed), 333f91edc (c63241707, before the food word's push). Every merge clean but one import line in
`src/pdf/sections/IdentityDailyLife.jsx` (re-applying my cure over w2-fix-data's Architecture row): both kept.

## The rulings this seat works to (the chair's brief of 2026-11-14; each vetoable by the owner)

- (r1) REGISTERS ARE RE-DERIVED ONCE, AT THE CLOSE, ON THE FINAL TREE: no census, no baseline re-taken after a cure, no
  bundle rebuilt; a register a cure makes stale is NAMED (file; the title that reds; the commit); never banked, never
  raised, never hand-edited. After every cure: the three fast gates, the presumed-things walker (fresh hits against the
  base's), the test files that name the touched files. THE LIGHTING CENSUS IS NOT RE-TAKEN (item 0 changed): a NAMED RED.
- (r2) THE FOOD WORD HAS ONE HOME, MEASURED BEFORE TRUSTED: ten of the 159 read first; if the band is the false side in
  more than two of ten, STOP with the table; else one leaf, one call line at the Overview's Food Security row, the
  Foundations row and the PDF's Identity block; the Identity block's Deficit/Surplus/Balanced goes; the colour follows
  the word; a guard rendering the Overview, the Foundations row, the PDF's Identity and Tonight page and the journal in
  a siege, a famine and an occupied town, each arm red alone; one message to the chair when pushed.
- (r3) THE OTHER SPELLING (165 towns, "River fisheries" / "River fish"): THE TAB'S WORD GOVERNS; the PDF and the
  journal print the pill through the leaf the tab prints it with.
- (r4) "Abundant" under a siege: THE PDF PRINTS THE GROUPS THE TAB PRINTS, through the tab's reader.
- (r5) The Defence chapter's twins: `DefenseSecurity.jsx` prints a force's name raw and a provenance chip (REQ,
  FORCED) the Defense tab no longer prints: the same two cures through the tab's leaves; the PDF's medical line
  ("Major monasteries (5-10).") through the house-label leaf.
- (r6) The History tab's and the Overview's tension rows print a catalogue bracket ("Taverns (5-20)"): through
  `houseLabelsInText`, as the PDF's History does.
- One row more (the chair's first message): Systems Health prints "Safety" WITH NO VALUE in 28 thorps
  (`OverviewTab.jsx`, the Safety StatusTag): the tag prints the record's band or the row is left out; its own commit,
  after the food word.

## Item 1: THE FOOD WORD — DONE, 8251e0165 (pushed in c63241707)

- MEASURED FIRST, the ten of the 159 (stored label / band; the page's own words): r2r-thorp-4 calm (Secure/Pressured;
  Short 1 lbs/day, "A few households still go short"), r2r-hamlet-53 wartime (its own Crisis page "Food: Pressured"),
  r2r-village-23 (Short 22/542), r2r-town-17 (Short 31/3,116, six months of grain), r2r-city-16 (Short 269/28,064, nine
  months), r2r-thorp-24 occupied ("the food has to stretch about a fifth further"), r2s-occupied-metropolis-3 (the same,
  fifteen months), r2s-under_siege-hamlet-2 and r2s-under_siege-metropolis-1 (Import-Dependent/Deficit: "No food comes
  in by trade ... Many households go short"), r2s-wartime-thorp-3 (Import-Dependent/Deficit, "No food comes in by
  trade", Short 2/12). THE BAND IS TRUE IN 10 OF 10 (two thin: town-17 and city-16). The 159 are 152 Secure/Pressured
  (a gap > 0 under a secure band) and 7 Import-Dependent/Deficit (no import under a siege or a war). NO FAMINE TOWN IS
  AMONG THE 159: a famine's band is its stored label (0 of 49).
- CURE: `src/domain/display/foodWordShown.js` (the band's word and colour; a record with no band keeps its stored label
  and colour; null where neither); one call line in `OverviewTab.jsx` (word and the bar's colour; the bar keeps
  `resilienceScore`), `SubstrateTab.jsx :: foodRecordWord`, `IdentityDailyLife.jsx` (the band's word or no Food row).
- COUNTS (772 births, records born at 9e47f912a; `probes/SURFACES-2/food.census.jsx`, every surface rendered): Overview
  159 -> 0; Foundations 159 -> 0; PDF Identity 729 -> 0; PDF Tonight 0; journal Tonight 0; colours off the word 0.
- GUARD: `tests/pdf/foodWordEverySurface.test.jsx`. Red first 3 of 3 at the base; each of the three sites uncured
  alone reds its own arm (plants in a detached tree, not committed).
- RE-KEYED BY IDENTITY (the home moved by (r2)): `tests/components/dossierLabelCase.test.jsx` (the case pin's fixture
  carries the band it re-cases), `tests/generators/foodSurplusResidue.test.jsx` soak1k-5 (Pressured where Secure
  stood; "not Surplus" kept), `tests/pdf/sections.smoke.test.js` IdentityDailyLife (the struck vocabulary asserted
  absent; the callout's verdicts kept; a new title: the row prints the band), `tests/lint/chartProportionCensus.walker.
  test.js` row `overview-food-security-bar` (its figure `eco.foodSecurity.label` -> `foodWord.label`; the same pair, the
  same verdict; the bar's drawn expression kept verbatim).
- GATES: domain-strict 1113/1113; type ratchet 167/167; eslint clean; the presumed-things door prints the base's 155
  lines; the grid 0 rises, 0 falls; the 64 test files naming the touched files: the same 9 reds as the merged base
  a2df276b0, byte-identical (proseNumerics, rawColorLiteral 1209/1206, sourceCitationIntegrity ARM 2, writerReach x6).

## Every new or changed word on a surface (the owner's veto list)

| surface | before | after | towns read |
|---|---|---|---|
| Overview "Food Security", Foundations "Food" | the stored label: "Secure", "Import-dependent" | the band: "Pressured", "Deficit" (152 + 7 towns) | r2r-thorp-24, r2s-under_siege-metropolis-1, r2s-under_siege-hamlet-2, r2r-thorp-4 |
| PDF Identity "Food" | "Deficit" / "Surplus" / "Balanced" | the band's word ("Secure", "Pressured", "Deficit — Active Famine" ...) | r2r-thorp-24 (Deficit -> Pressured), r2r-hamlet-16 (Deficit -> Deficit — Active Famine), r2r-thorp-0 (Surplus -> Secure) |

## Registers named stale (r1)

- `tests/lint/sovereigntyLightingContract.walker.test.js` "THE CENSUS IS AN ASSERTION": red at the joined tip before me
  (the first seat's finding); my new test file `tests/pdf/foodWordEverySurface.test.jsx` adds to what a re-take will
  count. Not re-taken (r1).

## Found, not cured

- The journal's Economics "Food:" row (`journalPages.js :: economicsPage`, `fb.display`) prints the second vocabulary
  ("Surplus \+1", "Balanced", "Deficit −N (N% of need)") in 729 of 772: the journal twin of the PDF's food block. Taken
  with item 2 (the PDF's deficit against the tab's Short), where both read the tab's leaf.
- The PDF's Daily Life FOOD BALANCE callout (printed where no AI passage is) keeps its own tri-state verdict off the
  view's figures ("More is grown ... The local food supply is reliable"): a sentence, not the food word; item 2's.
- r2s-wartime-thorp-3: the economy prose "A substantial part of what Madinatsaray eats is bought rather than grown"
  beside the food block's "No food comes into Madinatsaray by trade". Not this lane's word.
- (r5) is partly on the joined line now: the merge of 333f91edc brought `tests/pdf/defenseForceNamesLabelled.test.jsx`
  (UPKEEP-14's cure of the raw force name); to be measured at (r5) before any change.

## The Safety row — MEASURED, NO FAULT (no commit)

- The row the chair named (Systems Health "Safety" with no value, 28 thorps by the no-lane seat's dump read): on the 772
  dumps, 29 towns read "Safety" followed by "Viability" (5 thorps, 10 hamlets, 8 villages, 4 towns, a city, a
  metropolis). In all 29 the record's Prosperity and Safety are both "Moderate", and the real tab, rendered
  (`OverviewTab`, jsdom, the 29 records), prints "Safety · Moderate" in 29 of 29. THE DUMP DROPS A WORD THAT REPEATS
  the one two lines above it (Prosperity's "Moderate"); the tag is never empty. `safetyBandOf(label) ?? label` is
  non-empty in 772 of 772 records. Nothing to cure; `OverviewTab.jsx`'s Safety line is untouched. (The instrument
  that reads a tab from the dump undercounts any value equal to its neighbour's: a note for the sweep's reader.)

## What is left, line by line

1. (the Safety row: measured, no fault, above.)
2. Item 2: the PDF's deficit against the tab's Short (253) and the journal's Economics "Food:" row (729). READ, NOT
   BEGUN (handed back before it, at 365,828, as the cure could not be pushed inside the mark): the tab prints
   `foodRowShown(s, !!carriersOf(s, eco))` (`EconomicsTab.jsx:330`); `carriersOf` is a module const of the TAB FILE
   (`EconomicsTab.jsx:803`, reading `tradeAccess`, `hasInstitution(r,'docks')`, `tradeStoppedHere`, the roster's
   ferry/barge/boat), so the PDF cannot call the same line without it. THE CURE I WOULD MAKE: move `carriersOf` whole
   into a display leaf (e.g. `domain/display/foodCarrier.js`, imported back by the tab: one line), then ONE call line in
   `EconomicsTrade.jsx` (`FoodBalanceBlock fb={foodRowShown(settlement, !!carriersOf(settlement, eco))?.fb ?? e.foodBalance}`,
   line 227; read the block whole first: it prints `fb.production`/`fb.need`, the leaf gives `dailyProduction`/
   `dailyNeed`, so the block's two reads are the ones to map) and ONE in `journalPages.js :: economicsPage` (line 331,
   `fb.display`: the row's words from the same leaf, and no Surplus/Balanced word of its own: the band word is
   Tonight's). Holders by content before each file (EconomicsTrade.jsx and journalPages.js are touched by many lanes:
   check `git log <joined>..<lane> -- <file>` on the 11-13/11-14 lanes, as item 1 did). Guard: a sibling of
   `foodWordEverySurface.test.jsx` (the tab's Short against the PDF block and the journal row, r2r-thorp-32 pdf 2 / tab
   1, a siege where the tab carries no import, a famine). Count with `measure.sh` + `agg.mjs` (row "3 food block").
3. (r3) the other spelling (165); (r4) "Abundant" under a siege (56); (r5); (r6); item 6 the stores' unit (6); item 7
   the connectivity row (with a system state).
4. THE SWEEP, once, at the end, at the tip after the last merge of the joined line.

HOW THE INSTRUMENTS ARE RE-MADE: `probes/SURFACES-2/` (seeds772.txt: the first seat's 772, rebuilt as its hand-back
says, rr3 crisis lines taken as NR%4==1); records by the first seat's `render.sh <tree> <out> seeds772.txt 3` (~35
min at 3 workers); then `sh food.sh <tree> <records> <out> seeds772.txt` (~8 min) and `node foodagg.mjs
<out>/food.jsonl`; `node foodlist.mjs <tree> <records>` lists the stored-label/band towns.

# SURFACES-3

Seat SURFACES-3, session session_01ACmDYagjWqZ7qwhc7fz4sa; chair session_01ACmDYZrFEVXyZEUg1NDxxC. Branch
`lane/join-surfaces-2026-11-14`, read back at e6cb445db at the start (as the brief said). Merges of the joined line
into the lane: 2166b7266 (600b9f743, the first act; clean), the merge of 9618e0319 before item 1's push (clean; the
food count re-taken on records born at it: every cell of item 1 still 0), 65dc92af9 (clean), 474c5f966 before item 2's push
(clean; records re-born at it, both counts re-taken: every cell of items 1 and 2 still 0).

## The rulings this seat works to (the chair's brief of 2026-11-14; each vetoable by the owner)

- (r1) to (r6) as copied by SURFACES-2 above: THEY STAND.
- (r7) THREE CHAPTERS OF THE EXPORTS ARE BEING MEASURED AND ARE NOT YOURS: in `src/pdf/sections/DefenseSecurity.jsx`
  every line written by the threat assessment; in `src/pdf/sections/IdentityDailyLife.jsx` the culture profile's
  lines; in `src/pdf/sections/ResourcesProduction.jsx` and the journal's Resources & Production page the tables of
  processing houses, tags and final products. In those files only what the list names (the force's name and chip in
  the Defence chapter; the "Abundant" group in Resources), in the smallest hunk.
- (r8) The second seat's finding on the Safety row stands: no fault; nothing to cure.
- The order: item 2 as the second seat wrote it (the PDF's food block, the journal's Economics "Food:" row); then (r3),
  (r4), (r5) measured first, (r6), the stores' unit, the connectivity row; THE SWEEP once at the end.

## HANDED BACK at the count (327,467 at 15:34 UTC, before (r6): a cure with its gates would not fit inside the mark)

## Item 1: THE FOOD FIGURES ON THE PDF AND THE JOURNAL — DONE, c79217099 (1a) and 88dbe3059 (1b)

- CAUSE: the PDF's FOOD SECURITY block (`EconomicsTrade.jsx :: FoodBalanceBlock`) printed the viability view's figures
  (`viewModelPrimitives.js :: foodCore`) where the tab's row prints `foodRowShown(s, !!carriersOf(s, eco))`;
  `carriersOf` was a const of the tab file. The journal's Economics "Food:" row printed its own vocabulary off the view.
- CURE 1a: `carriersOf` moved whole to `src/domain/display/foodCarrier.js` (the tab imports it back);
  `foodBlockShown(town, viewFb)` feeds the block the tab's row in its own field names; one call line in
  `EconomicsTrade.jsx`. CURE 1b: one call line in `journalPages.js :: economicsPage`, `kv('Food',
  foodWordShown(settlement)?.label)`: the food word or no row.
- COUNTS (772 births, records born at the merged base; `probes/SURFACES-3/foodblock.census.jsx`, the real tab, the real
  PDF section, the journal's markdown): PDF DEFICIT vs the tab's Short 253 -> 0; PDF provision vs the tab's 92 -> 0;
  "imports cover" under a siege whose row brings nothing in 7 -> 0; PRODUCED/NEEDED 0 -> 0; the journal row against the
  food word 772 -> 0 (every one printed the second vocabulary: 195 "Surplus +N", 322 "Deficit −N (N% of need)", 255
  "Balanced").
- PRINTS LESS: the PDF's "imports cover N% of gap" prints only beside a DEFICIT, as it always did (198 towns import with
  no deficit: the tab's row prints the import, the block nothing of it); the siege towns' provision line where the
  tab's row credits none (r2s-under_siege-metropolis-0's "divine provision covers 211").
- GUARD: `tests/pdf/foodFiguresEverySurface.test.jsx`. Red first 12 of 13 at the base; each cure out alone reds its own
  six titles; the guard town (r2r-town-44) reds alone under a plant that drops the cover.
- RE-KEYED BY IDENTITY: `tests/pdf/foodMagicChannelPrint.test.js` (its fixture's food record goes into the home the
  block now reads; the town holds the druid tradition its Druid Circle premise gives; titles and assertions kept).
- GATES: domain-strict 1113/1113; type ratchet 167/167; eslint clean; the presumed-things door prints the base's 155
  lines byte-identical; the grid 0 rises, 0 falls; the 90 test files naming the touched files: the base's 18 reds
  title for title.

## Item 2 (r3): THE OTHER SPELLING — DONE, e31da7379

- CAUSE: the tab prints an export as the list spells it and an import through the seam (`resourceDisplayName`); the
  PDF's EXPORTS column (`EconomicsTrade.jsx :: renderedTradeLabel`) and the journal's Exports row sent exports through
  the seam too.
- CURE: `src/domain/display/tradePillWord.js` (an import through the seam, an export as the list spells it); the tab,
  the PDF and the journal each call it. No match moves (ownership and terrain tests take the raw value).
- COUNTS (`probes/SURFACES-3/trade.census.jsx` + `tradeagg.mjs`, records born at 9618e0319): PDF exports 83 -> 0
  (38 "River fisheries", 30 "Precious metal veins", 15 "Coastal timber"); journal Exports 83 -> 0; imports 0 -> 0.
  SURFACES-1's 165 was at 035159bc7. No export of the 772 is machine-shaped (the seam guarded nothing there).
- GUARD: `tests/pdf/tradePillWordEverySurface.test.jsx`; each surface reds alone; the guard title (an import's raw key
  still resolved) reds alone under a plant.
- RE-KEYED BY IDENTITY: `tests/lint/resourceLabelSeam.census.test.js` (THREADED_VIA_PILL: the PDF, the journal and the
  tab call the pill's leaf; the leaf joins THREADED; the lane-25 split pins its two re-keyed lines).
- GATES: as item 1; the named tests: the base's 17 reds title for title.

## Item 2 (r4): "ABUNDANT" UNDER A SIEGE — DONE, e99bf024d

- CAUSE: the tab, under a siege in force (`chainStateShown.js :: tradeStoppedHere`), prints the grounds first and
  unlabelled; the PDF's NEARBY RESOURCES printed them under "Abundant".
- CURE ((r7) smallest hunk): `ResourcesProduction.jsx` calls the tab's reader: under a siege the grounds print first
  with no kicker, before Depleted; "Abundant" only where no siege holds. The journal prints no such word ("Nearby
  resources").
- COUNTS (`probes/SURFACES-3/abundant.census.jsx`, records at 474c5f966): "Abundant" under a siege 56 of 56 -> 0; with no
  siege 714 -> 714.
- GUARD: `tests/pdf/abundantUnderSiegeEverySurface.test.jsx` (the tab rendered and the PDF; the guard: a calm thorp keeps
  "Abundant"). Red first 3 of 3; the guard reds alone under a plant.
- GATES: as item 1; the 5 test files naming the file: 0 reds, as the base.

## Item 2 (r5): THE DEFENCE CHAPTER'S FORCE NAME AND CHIP — MEASURED, NO SURFACE FAULT (no commit)

- THE NAME: the PDF's ARMED FORCES list prints `institutionDisplayName(force.name) || force.name` (UPKEEP-14, on the
  line with `tests/pdf/defenseForceNamesLabelled.test.jsx`); the Defense tab's ForceCard prints `institutionDisplayName(i)`
  (R3-TABS-5). The leaf reads an object's `name` or takes the string, so the two calls give one word by construction.
- THE CHIP: struck on both (the PDF: COHERENCE-UPKEEP-7 item 3; the tab: R3-TABS b1). Nothing to cure.
- THE MEDICAL LINE ("Major monasteries (5-10)."): NOT a disagreement between surfaces: the tab and the PDF print the same
  `cap.note` from ONE writer, `src/domain/display/defenseDisplay.js :: deriveSupportingCapabilities`, Medical Readiness,
  `${facts.healerName}. Wounds and fevers ...` (the catalogue name with its bracket). That file is also changed on
  `lane/w2-c-leaves-2026-11-13` (27+/24-), so by the brief's law it is NAMED FOR THE JOIN, not cured here: the one-line
  change is `${houseLabelsInText(facts.healerName)}` (or `institutionHouseLabel`, the seam the History PDF uses).
  Not re-counted (SURFACES-1 counted 4 towns on the PDF: r2r-metropolis-32, -51, r2s-indebted-metropolis-2; the tab
  prints the same note in the same towns).

## Every new or changed word on a surface (the owner's veto list)

| surface | before | after | towns read |
|---|---|---|---|
| PDF Economics, FOOD SECURITY block | the view's DEFICIT, share, cover, provision | the tab's row: DEFICIT = the tab's Short; its share; cover only where the row imports; the provision the row credits | r2s-famine-thorp-0 (10 -> 11), r2s-under_siege-metropolis-0 (80026 -> 80237, provision line gone), r2s-under_siege-city-2 ("imports cover 1%" gone), r2s-occupied-town-0 (228 -> 245), r2r-thorp-32 (2 -> 1) |
| journal Economics "Food" | "Deficit −10 (26% of need)", "Surplus +1", "Balanced" | the food word: "Deficit — Active Famine", "Deficit", "Pressured", "Secure" | r2s-famine-thorp-0, r2s-under_siege-metropolis-0, r2s-occupied-town-0, r2r-thorp-32 |
| PDF EXPORTS, journal Exports | "River fisheries", "Precious metal veins", "Coastal timber" | the tab's "River fish", "Precious metals", "Shipbuilding timber" | r2r-thorp-44, r2s-famine-city-2, r2s-wartime-metropolis-1, r2r-town-52 |
| PDF NEARBY RESOURCES under a siege | "Abundant" before the grounds | the grounds first, unlabelled ("Depleted" kept) | r2s-under_siege-thorp-0, rr3-hamlet-under_siege+famine-rand-4, r2s-under_siege-metropolis-0, r2r-hamlet-0 |

## Registers named stale (r1)

- `tests/lint/sovereigntyLightingContract.walker.test.js` "THE CENSUS IS AN ASSERTION": red before me; my new test files
  `tests/pdf/foodFiguresEverySurface.test.jsx`, `tests/pdf/tradePillWordEverySurface.test.jsx` and
  `tests/pdf/abundantUnderSiegeEverySurface.test.jsx` add to what a re-take counts. Not re-taken.

## Found, not cured

- FOR THE JOIN: `src/domain/display/defenseDisplay.js :: deriveSupportingCapabilities` (Medical Readiness note, the
  healer's catalogue bracket on the tab and the PDF): `${houseLabelsInText(facts.healerName)}`; held by w2-c-leaves too.

- The PDF block's `fb.summary` line (the view's food summary, EditableProse) is the view's words; not measured here.

## What is left, line by line

1. (r6) the tension rows' bracket ("Taverns (5-20)", History and Overview, through `houseLabelsInText`; check
   OverviewTab.jsx's tension lines by content first: the coherence-upkeep lane holds them); the stores' unit (6 towns); the trade connectivity row (with a system state).
2. THE CHAIR'S THREE ROWS (15:35 UTC; named by other seats; measure first, by false towns; one line back each when pushed):
   (a) the PDF's IdentityDailyLife prints "brought in falls short" in 31 besieged towns (under a siege nothing is
   brought in): the tab's reader or a twin; (b) "Underground city bazaar" prints on the PDF only, 22 towns: find its
   writer; the export's row prints what the tab's card prints; (c) `src/pdf/lib/viewModel.js`, the Overview's
   `crisisSummaryForSurface(x, s?.name, 'overview')` hands no facts, so "has lost a second harvest" can print on the
   PDF's Overview where the town has neither grain nor mill: the Tonight caller's one-line cure of 600b9f743
   (`factsOf(source)`), red first on births. NOT MINE (the chair): the journal's provenance tag on a force (cured twice:
   r2-code-b a48cf4126, exports-b24 2779a3d6d).
3. THE SWEEP, once, at the end, at the tip after the last merge of the joined line (the first seat's `measure.sh` +
   `agg.mjs`, every fact of its table re-taken).

HOW THE INSTRUMENTS ARE RE-MADE: `probes/SURFACES-3/run.sh <tree> <x.census.jsx> <out> <seeds> <workers> [VAR=val]`
runs a census under vitest in shards. Records: `run.sh <tree> births.census.jsx <out> probes/SURFACES-2/seeds772.txt 4
RECORD_OUT=<records>` (39 s for the 772: births only, no render). The food figures: `run.sh <tree>
foodblock.census.jsx <out> <seeds> 4 RECORDS=<records>` (45 s), then `node foodblockagg.mjs <out>`. The trade pills: `run.sh <tree> trade.census.jsx <out> <seeds> 4
RECORDS=<records>`, then `node tradeagg.mjs <out>`. The siege groups:
`run.sh <tree> abundant.census.jsx <out> <seeds> 4 RECORDS=<records>` (each line: siege, "Abundant" printed, the block).
