# BAR7-ECON · HAND-BACK · the Economics tab reads the mark and the lists it prints

Seat BAR7-ECON of `docs/chair/2026-11-14/briefs/BRIEF-BAR7.md` (the chair's lane). Base: the joined line at
**7e4a64a19** (the tip my prompt named, unchanged when I started). Branch `lane/bar7-econ-2026-11-17`, plain pushes,
fast-forward; nothing merged; no pull request. Every render in scratch worktrees outside the repository's checkout
(PAGE-COPY's `census3.sh --count-only`, base and tip each over the sixth read's thirty, the 150 and the census's 720), every
count by the auditors' runners (`runH.mjs`, `runI.mjs`) as they stand at my checkout.

FIRST LINE OF THE BRIEF'S ASKS: not applicable to this seat (no journal file, no "DS-ECO-8"). My files only: the seven the
section lists, my guard, and the two tests my cure made untrue (re-keyed, below).

## 1. THE RULES, BEFORE AND AFTER (the thirty · the 150 · the 720; instances)

| rule | base | tip | the guard |
|---|---|---|---|
| 8f.short | 6 · 14 · 85 | 0 · 1 · 5 | (1) |
| 8f.chain | 1 · 0 · 4 | 0 · 0 · 0 | (1) |
| 8g.export | 2 · 0 · 2 | 0 · 0 · 0 | (2) |
| 8i.resource | 1 · 1 · 1 | 0 · 0 · 0 | (3) |
| 8i.chainStopped | 2 · 0 · 2 | 0 · 0 · 0 | (4) |
| 8j.exports | 0 · 2 · 10 | 0 · 0 · 0 | (5) |
| 8j.local | 0 · 1 · 0 | 0 · 1 · 0 | (5) KEEP |
| 9h.no-exports | 1 · 1 · 1 | 0 · 0 · 0 | (6) |
| 9h.no-exports-record | 0 · 3 · 3 | 0 · 0 · 1 | (6) |
| item 7: a need named twice on "Needed, and not brought in" (my reading, towns: an exact double or one name whole inside another) | 0 · 7 · 38 | 0 · 0 · 0 | — |

THE GUARD: `tests/components/bar7EconTab.test.jsx` (new, jsdom; the tab and the Resources tab rendered for named towns,
each arm with an anchor and a sibling that still prints): **7 of 8 red at 7e4a64a19, 8 of 8 green at the tip** (the one
green at base is a KEEP arm).

## 2. THE CONTROLS

Over the thirty at the tip (`runH`/`runI` with `SECOND-CHECK.final51.json`): **C8021, C40674, C41826, C41825, C33921, C4828,
C39519, C7539, C20287, C20830 are GONE** (each "clear"; each CHANGED by a mark the page now prints: the share opens "Short of
wool." / "Short of iron." / "Short of its materials." / "Curtailed by the siege."; the service card prints Impaired; the
harbour's "Normally yields" no longer names Ship construction, the shipyard's chips stay; the Fish card prints "Impaired";
the export column prints "Nothing is sold outward while the siege lasts."). The wide read's C211337 and C217617 (the 150;
not in the second-check file) are gone with their rule (9h.no-exports-record 3 → 0). No EXPLAINED row of my rules is found.
The runner's exit 3 at the tip is other seats' STANDS rows (8h: CARDS; 8i.surplus: held for after BIRTH-1; 8j.outputs: the
seam's).

## 3. WHAT I DID, ITEM BY ITEM (each cured at its one fact; each read at print unless named a declared move)

1. **8f** · `crisisStoppedRow.js :: incomeShortOf` (new export beside `incomeHouseKind`, which now shares its house list,
   `incomeTradeHousesOf`): the short half of a share's mark, read house by house through `rowShortOf` as the crisis half reads
   `rowStoppedBy`; where every live house of the trade carries a mark and one is short, the share is short of what those
   houses lack ("its materials" where they differ). `economicsCrisisMarks.js :: incomeMarkShown` prints both halves in the
   leaf's order (`incomeDescShown` reads it); `econOrdinaryTimesLine` adds the leaf's `SUPPLIED_LINE` where a share is marked
   short (also in a calm town). **"Wool & Textile Trade"**: the brief said it joins `INCOME_TRADE_HOUSES`; the code shows that
   table pinned equal to `RESOURCE_ROW_TRADES` (`tests/domain/bar4MarkPromise.test.js` (e)), so it sits beside the remedies'
   table as `crisisDependence.js :: INCOME_CLOTH_HOUSES` (weavers, fuller: the seam's own makers of cloth), read by the same
   function. **8f.chain**: `incomeKindShown` reads, besides a chain of the share's printed name, the chain whose card says it
   feeds the share (`incomeShareOfChain`, the tab's own "Contributes to" rule moved verbatim so both read one rule): "Timber
   Trade" under a siege beside "Timber & Lumber · Impaired" takes "Curtailed by the siege." and the card's "Contributes to"
   line goes, as it already did for a chain of the share's name. **The twins (R7)**: `incomeLineSiblings.js` gains
   `METAL_SHORT_LINE` ("Little metal is worked here while the metal trade is short of what it needs.") and `TIMBER_SHORT_LINE`
   ("Little timber is worked here while the timber trade is short of what it needs."), the cloth line's arm for an iron/smelting
   or timber chain the record holds impaired; declared as twins in `INCOME_STATE_SIBLINGS`. The twin cannot read the houses'
   short mark at the draw (the resource analysis is born after the economy, `generateNarratives.js`), so the houses are read at
   print by the mark and the twin answers the chain: the premise "the twin answers the houses" is false at the draw; I followed
   the code. The first wording of the timber twin ("felled or sawn") put a fresh line on the presumption door (its `resource`
   class reads "sawn"): reworded, the door's count is the base's again.
2. **8g** · `EconomicsTab.jsx :: impairedHousesOf` reads `setsWithMarkedHousesWorse(town, computeChainSets(town))`, the card
   head's own reading.
3. **8i.resource** · `economicsCrisisMarks.js :: fullCardWordUnderSiege`: a chain card whose every live Via house the leaf marks
   (`rowMarkText`, house) is no working card here; it reads as ruling SW1's impaired card does.
4. **8i.chainStopped (CY1)** · `economicsCrisisMarks.js :: chainOutputsOnCard`: where the card refuses its yield
   (`chainYieldRefused`, the card's own header), an output naming a service row the leaf leaves unmarked leaves the line; the
   tab reads it. The brief names `tradeListDisplay.js :: chainOutputsShown`: that file sits BELOW the mark's leaf
   (`crisisStoppedRow.js` imports it through `validationOnPage.js`; the cycle guard is shrink-only), so the leaf is read one
   layer up and `chainOutputsShown` is unchanged. The shipyard is not stopped; its chips and rows stay.
5. **8j** · `tradeListDisplay.js :: everyMakerShortHere`, the seam's `everyMakerShort` over `housesShortOf`, on
   `exportsAsPrinted` and `localProductionAsPrinted`. Over the 720: **38 pills leave, in 33 towns** (exports 5,713 → 5,684:
   Preserved foods 12, Fulled cloth 9, Quality tools and weapons 5, Glassware 2, Fine textiles 1; "Produced locally" 5,725 →
   5,716: Preserved foods 4, Fine metalwork and jewelry 2, processed textiles 2, Leather goods 1), each beside makers the page
   marks short. A FIRST CUT read the fact's short set alone (`housesShortOf`) and took 72 pills in 48 towns, among them
   "Magical identification" beside an unmarked enchanter's shop and "Cavalry mounts" beside an unmarked stable district: that
   set holds 193 houses of the 720 the page prints bare (no input dependence). The lists now read it as `rowShortOf` does (a
   house whose dependence holds INPUT; `houseDependenceOf` moved verbatim to its table's file, `crisisDependence.js`, and
   re-exported by the leaf), so NO GOOD LEAVES WHOSE MAKER THE PAGE PRINTS BARE (measured: every one of the 33 towns' removed
   goods has only page-marked makers; the 720's ten 8j.exports instances and the 150's two all leave). The seam's own
   `chainOutputsShown` reads the wider set still (not my item: named below); a good with an unmarked maker never leaves (the guard's KEEP: "Leather goods" in
   bar0-metropolis-calm-rand-39, its tanner short and its Cobbler's guild a maker by `MADE_GOOD_HOUSES`, stays: that is the
   8j.local instance left on the 150, true by the maker table).
6. **9h** · `economicsCrisisMarks.js :: exportsEmptyLineShown`: an empty Exports column in a town whose record holds an export of
   its own (transit alone is none) under a crisis that marks rows prints "Nothing is sold outward while <the siege | the famine |
   the outbreak | the war> lasts."; any other empty column keeps "No significant exports." (`crisisNounOf`, a new one-line export
   of the leaf's own nouns).
7. **LOW, one good once** · `criticalImportsShown.js :: neededNamesShown`: a name is said once (the fullest of equals), and a
   name whose words stand whole inside another need's gives way to it ("mountain timber", not "timber, mountain timber"); the
   tab still names each need through the label seam (`resourceLabelSeam.census.test.js` holds it).

`EconomicsTab.jsx` is edited LINE-NEUTRALLY above its end (the line-keyed registers: `proseNumerics`, the doors): the new
imports are at the file's end.

## 4. THE LINES A READER CAN SEE (new or changed; three towns each, from the tip's renders)

Counted over the census's 720 (towns, base → tip); three towns each from the tip's render.

| line | towns | three towns |
|---|---|---|
| an income share opening with its houses' short mark ("Short of iron. Metal is smelted or worked here.") | 0 → 204 | r2r-city-0, r2r-city-1, r2r-city-10 (the 30: bar0-village-calm-rand-42, bar0-town-occupied-rand-44, bar0-city-under_siege+famine-rand-44) |
| the Economics tab's head "A row marked short is what its house makes when supplied." where a share is the tab's only short row (the line already printed on the house tabs) | on the tab's head: new in calm towns | bar0-village-calm-rand-42, and every town above with no crisis |
| "Timber Trade" opening "Curtailed by the siege." (fed by an impaired timber chain); that card's "Contributes to Timber Trade" line goes | 1 → 4 | r2s-under_siege-city-2, r2s-under_siege-city-3, r2s-under_siege-metropolis-0 |
| "Little metal is worked here while the metal trade is short of what it needs." (stored: the declared move) | 0 → 53 | r2r-city-53, r2r-city-57, r2r-metropolis-1 |
| "Little timber is worked here while the timber trade is short of what it needs." (stored) | 0 → 3 | r2r-city-54, r2r-metropolis-43, r2s-under_siege-metropolis-0 |
| "Nothing is sold outward while the siege lasts." / "… the famine lasts." | 0 → 1 / 0 → 2 (the 150: 1 / 3) | r2r-village-21; r2r-hamlet-28, r2s-famine-hamlet-0; bar0-hamlet-under_siege-rand-44 (C20830), bar0-village-famine-rand-28, -37 |
| a service card "Impaired" where it printed "○ Operational" through a house the page marks | the 30's two (C39519 and its twin row) | bar0-town-occupied-rand-43 and the auditor's two of the 720 |
| a ground's card printing "Impaired" where it printed "✓ Fully exploited" | 1 · 1 · 1 → 0 | bar0-hamlet-under_siege-rand-43 (C20287), bar0-city-under_siege+famine-rand-34 |
| a stopped chain's "Normally yields" without the service kept on offer | 1 town of each population | bar0-city-under_siege+famine-rand-44 (C7539) |
| one good once on "Needed, and not brought in" ("mountain timber", not "timber, mountain timber") | 38 → 0 | the base's 38 (e.g. "timber / mountain timber" 30, "fine glass sand" twice 12) |

The 720's render at the tip was taken before item 5's narrowing (below); the lists' figures in §1 and §3.5 are measured on the
tip's code over that render's records.

## 5. DECLARED MOVES

**One field family: `economicState.incomeSources[].desc`** (the metal and timber twins at the draw). **1 of the 525 reference
configurations moves** (hashed field by field at base and tip, `goldenCorpus()`; no other field moves). In the populations:
"Little metal is worked here …" prints in 2 of the thirty, 9 of the 150, 53 of the 720; the timber twin in 0 · 0 ·
3. Everything else is read at print. No new field; nothing in `assembleSettlement.js`, `vite.config.js`,
`package.json`; no file under `src/domain/facts/` (so no build was owed); no new atom of the vocabulary.

## 6. THE TESTS MY CURE MADE UNTRUE, RE-KEYED BY IDENTITY (each with a dated note beside it)

- `tests/generators/incomeLinesSayTheRecord.test.js`, row #1301 (`rr2s-metropolis-wartime-rand-1`, the coal line cured): the
  same town and cured line; its iron and smelting chains are impaired, so its true twin is now `METAL_SHORT_LINE`; a new arm
  anchors the chain's state. (No other town found bearing the row's exact twin in the probe I could afford: named.)
- `tests/lint/chainPrintSites.walker.test.js`: the tab's one logic read of a chain label (the share a card feeds) moved verbatim
  to `economicsCrisisMarks.js`; it is classed as the logic read it is (an EXEMPT row of one line, its reason and date). This is
  a classing by the walker's own procedure; the chair may prefer the read back in the tab: say so and I move it.

## 7. THE NET (R11), BASE FIRST

| gate | base 7e4a64a19 | tip |
|---|---|---|
| `typecheck:domain:strict` | 1113, ceiling 1113 | 1113, ceiling 1113 |
| `typecheck:ratchet` | 167, ceiling 167 | 167, ceiling 167 |
| `npx eslint` on my changed files | — | 0 problems |
| `npx vitest run tests/architecture` | 347/347 | 347/347 |
| build + vendorPdfLazy + bootSmoke | not owed (no file under `src/domain/facts`) | not owed |
| my guard | 7 of 8 red | 8/8 |
| bar5*/bar6* guards | 1 red: `tests/domain/bar6ScenesGoods.test.js:170` | the same, same message (SCENES' file: named, not chased) |
| the doors (`--check`, last line) | presumption-classes: hits 1798 · banked 1938 · fresh 3 · stale 143; presumed-things: fresh 39 · stale 72 · first-register stale 6 · banked 4688 | the same lines: NO FRESH LINE ADDED |

Files near mine, red at base AND tip with the same messages (named, not chased): `bar3LabelWords3.test.jsx` (L3b),
`displayEconCrisisMarks.test.jsx`, `displayEconRelianceFoodWords.test.jsx`, `economicsChainYieldLabel.test.jsx`,
`publicProseEquality.test.jsx` (3 services cases), `economyDeskReadsTheCards.test.js`, `foodEnduranceLine.test.js`,
`bar4ScenePresumption.test.js`, `tailExportsPdf2Batch2.test.jsx` and `tailExportsPdf3Batch3.test.jsx` (CARDS' item 4).

## 8. THE BOOKS MY CURES MOVE (the close's; not re-taken)

`tests/fixtures/generator-golden-master.json` (stale at base already: 454 of 525 differ; 455 at the tip, the one more mine);
any golden-derived file reading `incomeSources[].desc`; the census's counts of the Economics tab's lines.

## 9. LEFT BY NAME

- **8f.short, 1 of the 150** (`bar0-hamlet-calm-rand-29`): its iron trade holds an unmarked "Mine (open cast)", a house of
  the trade by `INCOME_TRADE_HOUSES`; the share stays bare by the table. The line says "smelted or worked"; whether a mine
  answers it is the table's question, not this seat's.
- **8f.short, 5 of the 720**: the same shape, five hamlets (r2r-hamlet-10, -26, -35, r2s-recently_betrayed-hamlet-0,
  r2s-succession_void-hamlet-0) each holding an unmarked "Mine (open cast)" beside its part-time smith marked "Short of iron.".
- **9h.no-exports-record, 1 of the 720** (r2r-village-5, "Cargo barges" under a religious conversion, the auditor's unsure
  row): a conversion marks no row, so the column keeps "No significant exports.".
- **The seam's `chainOutputsShown`** (`tradeListDisplay.js`, SEAM-ECON item 8) reads the fact's wider short set, which holds
  houses the page prints bare (193 of the 720): a chain card's output can leave beside an unmarked maker. Not my item; the
  reading item 5 now uses (`everyMakerShortHere`) is the cure, one line.
- **The PDF and the journal** print the income shares through the crisis half alone (`pdf/sections/EconomicsTrade.jsx`,
  `foundry/journalPages.js :: rowStoppedBy(…'income')`) and the chain card's outputs through `chainOutputsShown`
  (`pdf/sections/Services.jsx`, `SupplyChainFlow.jsx`): not my files. Their seat can read `incomeMarkShown` and
  `chainOutputsOnCard`.
- An empty Exports column with a record export and NO marking crisis (the auditor's unsure "Cargo barges" under a religious
  conversion) keeps "No significant exports.".
- Not touched, as the section says: the share cell alone, a chip alone, the shipyard's dependence, `houseInputAtHand.js`,
  8i.surplus and the seam's four houses (held for after BIRTH-1).
