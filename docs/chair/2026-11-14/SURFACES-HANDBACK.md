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
| 2 chain outputs the tab does not print | PDF flow | 596 | 881 | | r2r-thorp-0, -1, -2 |
| 2 chain outputs the tab does not print | PDF cards | 756 | 5,853 | | r2r-thorp-0, -1, -2 |
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

## Found, not cured (file, holder)

- **The lighting census is red at the joined tip 035159bc7** (`tests/lint/sovereigntyLightingContract.walker.test.js`,
  "THE CENSUS IS AN ASSERTION": the baseline was taken at R3-CODE-C-6, before the join; a re-take moves 3251 -> 3449
  files). Its door is the merge seat's at the joined tip; I did not re-take it (that would bank the join's 197 other
  files under my name). My new test files add to it: re-take after the merge seat's, at the chair's word.
- Red at the joined tip, the same titles with and without my change (classed against the base in a detached tree):
  `presumedThings.walker` (door `--check`: 153 fresh, 1 strip fresh), `factLayers.walker`, `observedShapeReaders.walker`,
  `writerReach.walker`. Not mine.

## What is left

Item 2 (outputs, the other spelling); item 3 (food deficit, the food word on every surface incl. the PDF Identity
block); "Abundant" under a siege; the bracketed names; the stores' unit in 6 towns; the trade connectivity row
measured at its item.
