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
