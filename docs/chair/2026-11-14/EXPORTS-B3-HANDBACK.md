# EXPORTS-B3 — hand-back (2026-11-14): the PDF's RESOURCE CHAINS and the journal's Exploitation rows print what the tab's card prints

The seat EXPORTS-B3, a builder of the settlement-engine integration program, on its own branch `lane/exports-b3-2026-11-14`, cut
from the surfaces lane `lane/join-surfaces-2026-11-14` at **c66333f0c** (its tip as read back from origin at the start; the measure
was taken at 3c30fdeb4). The brief: `origin/lane/chair-2026-11-08:docs/chair/2026-11-14/briefs/BRIEF-EXPORTS-B3.md`. Merging
nothing; the merge and the deploy stay the owner's.

## The ruling worked to (copied from the brief; the chair's ruling on EXPORTS-MEASURE-1, 2026-11-14 14:52Z)

> THE RULING (B3, CANDIDATE A, WITH THE TAB'S OWN LABEL): THE EXPORT'S ROW PRINTS WHAT THE TAB'S CARD PRINTS: a worked row: the
> resource and its status, NO houses and NO goods; a partly worked row: what the tab's Partial card prints; an unexploited row:
> the houses still needed UNDER THE TAB'S WORD "Needs:" and its first two goods. ONE FILE: src/pdf/lib/viewModelBodySlices.js ::
> resourcesSlice (the PDF and the journal both read its rows), with the section and page code only where the label must be
> printed, and its guard.

The law it serves (the chair's; vetoable by the owner): one reader for one fact on every surface; a surface with no room prints
less, never something else.

## The lane under me

Cut at c66333f0c. The surfaces lane's own seat has since pushed to f9d40e3de (its items 2 r3/r4 and docs; it touches
`ResourcesProduction.jsx` NEARBY RESOURCES and `journalPages.js`' trade pills, not the chain rows and none of this seat's files).
My commit applied on f9d40e3de in a scratch tree: the guard, the two re-keyed pins and that lane's two new guards
(`abundantUnderSiegeEverySurface`, `tradePillWordEverySurface`): 47 green (EXECUTED). Nothing merged.

## The cure (commit 282b95825, pushed; read back from origin)

- `src/pdf/lib/viewModelBodySlices.js :: resourcesSlice` — the measure's patch for this file only
  (`git apply --include=src/pdf/lib/viewModelBodySlices.js candX.B1C-B2AB-B3A-B4.patch`, read whole against the ruling first),
  and the label the measure did not run: a worked row (full, partial) carries `processing: null, output: null`; an unexploited
  row carries `processing: "Needs: <housesStillNeeded, display names>"` (no needed house: null) and `output: <finalProducts, the
  first two>`.
- THE LABEL IS MADE IN THE SLICE, not in the section or the page: both surfaces print the slice's string, so the PDF's chapter
  (`pdf/sections/ResourcesProduction.jsx`) and the journal's page (`foundry/journalPages.js :: resourcesPage`) are UNCHANGED.
  Why: `journalPages.js` is also B4's file (`defensePage`); one file kept out of two lanes' hands. `humanize` passes a string
  with a space through as itself, so the PDF prints the label as written.
- The guard, `tests/pdf/resourceChainsLikeTheTab.test.jsx` (new): renders the tab's own card (`ResourceChainCard`, as the tab
  calls it: `exploitationGroupsShown`, `moved`, the settlement on Unexploited) beside the PDF's ChainRow elements and the
  journal's table rows, and asks that every house and good a row prints is on the tab's card for that resource and grade, and
  that an unexploited row's houses print under "Needs:". Seven arms (r2r-thorp-14 PDF; r2r-thorp-14 journal; siege r2r-hamlet-0
  and the largest size r2r-metropolis-14; famine r2r-hamlet-16 and r2r-city-44; the "Needs:" label (thorp-14, city-44,
  thorp-0); an unexploited row's first two goods (thorp-14's hides, four in the catalogue); the keep-guards: r2r-town-1, whose
  apothecary and alchemist stand, still prints its worked herbs row on both surfaces, and r2r-thorp-0, lacking both, still names
  them under "Needs:" with its two goods).
  EXECUTED: at the base 6 red, the keep-guard green; with the patch alone, the label arm alone red; with the label alone, the
  five house-and-good arms red (the label arm and the keep-guard green); with both, 7 green.
- Pins re-keyed BY IDENTITY in the same commit: `tests/pdf/resourcesPdfNeedsLikeTheTab.test.js` (the Unexploited row names only
  the houses still needed: now under "Needs: "), `tests/pdf/sections.smoke.test.js` "the resources slice joins DISPLAY names"
  (a worked row now names no house, so the join the arm guards is the one the slice still makes: an Unexploited row on a roster
  holding neither house: "Needs: House of worship, Blacksmith"; the model under it still unmoved).

## The counts (EXECUTED; instruments: the measure's, git-archived, run from outside every tree)

| figure | measure (3c30fdeb4 → tree X) | this seat, base c66333f0c | this seat, tip |
|---|---|---|---|
| FAST: towns with a worked row naming a house the roster lacks (`b3fast.mjs`, the tab's `housesStillNeeded`) | 310 → 0 | **310** | **0** |
| FAST: towns with a worked row naming only held houses (TRUE, lost) | 149 → 0 | **149** | **0** |
| FAST: towns printing any goods | 492 → 163 | **492** | **163** |
| CENSUS: towns with kind a in the Resources views of the PDF and the journal | 381 → 230 | **381** | **230** |
| FIELD DIFF of the record over the 720, base vs tip (`fielddiff.mjs`) | 0 towns, 0 families | — | **0 towns, 0 families** |

The census: `census3.sh` (CENSUS-3's probes, `holders.tipA.json`) full at the base (720 births, 0 errors; births+render 1158 s,
count+trace 469 s; exit 0); at the tip with `CENSUS_RENDER=render.lean.jsx BASE_DUMPS=<base dumps>` (the PDF and the journal
rendered in the tip tree, the tabs and the Tonight sheet the base's: a cure in the slice does not move them).

THE 230 TOWNS LEFT, READ (the census's own `why` on every hit; by class, towns): **157** an unexploited row under "Needs:" on the
journal ("| Stone | unexploited | Needs: Stone quarry, Stonemasons' guild | buildings, monuments |", 54 towns, "Stonemasons with no
mason on the roster": TRUE, the houses the town lacks, under the word that says so; the census skips a line OPENING "Needs:"
(the PDF's cell) but not a table row holding it); **114** the "Mining" category heading on the PDF ("Mining with no mine on the
roster": WEAK by the census's own ruling; 114 at the base too); **21** the strategic value line ("Strategic value: High - controls
sea routes and naval access", "naval with no ships": not a chain row, 21 at the base too, outside this block: NAMED); **6** an
unexploited row's goods cell on the PDF ("furniture, ships", "ships" with no shipwright: the first two goods the tab's card prints
for a resource the town does not work: LOW). No hit in the Resources views is a worked row's.

## True lines lost, counted (EXECUTED, `b3lost.mjs`: the base's and the tip's slice over the same 720 records)

- The worked rows' houses: **574 rows in 390 towns** no longer print a processing column; of those towns, **149** had worked
  rows naming only houses that stand (true lines, lost); 310 named one the roster lacks (false, cured).
- The worked rows' goods: **590 rows in 403 towns** no longer print their goods (the catalogue's final products, never read
  against the record; the tab's Full card prints none). Towns printing any goods 492 → 163.
- The unexploited rows' goods past the first two: **196 rows in 144 towns** (the tab's card shows two).
- The partial rows' intermediate goods: the tab's Partial card prints them ("Timber → lumber → planks", r2r-town-1); the export's
  row prints none (it did not before either: its columns carried the houses and the final goods). PRINTS LESS. Rows in the corpus:
  363 partial rows in 287 towns, 177 of them (151 towns) printed houses and final goods at the base.
- No row is added or dropped: 413 full, 363 partial, 226 unexploited rows at the base and at the tip.

## EVERY NEW OR CHANGED LINE, with the towns it was read in (the owner's veto list)

Read on the tip's dumps (`b3read.mjs`), the PDF and the journal beside the Resources tab (the base's tab dump, unchanged).

1. A WORKED ROW, the PDF: "<Resource> » – » – full" / "… partial"; the journal: "| <Resource> | full | — | — |". The tab's card:
   "✓ Fully exploited <Resource> <value>" / "Partial <Resource> <value>" (+ its intermediate goods).
2. AN UNEXPLOITED ROW, the PDF: "<Resource> » Needs: <houses> » <good>, <good> unexploited"; the journal: "| <Resource> |
   unexploited | Needs: <houses> | <good>, <good> |". The tab's card: "Needs: <houses>" and the same first two goods.
   Across the 720: 440 "Needs:" lines printed (220 rows × the two surfaces, 163 towns); **0** of them is not a line the town's
   Resources tab prints (EXECUTED).

| town | cell | PDF (the tip) | journal (the tip) | the tab's card |
|---|---|---|---|---|
| r2r-thorp-0 | thorp 11 | medicinal herbs » Needs: Apothecary, Alchemist shop » healing potions, antidotes | the same | Needs: Apothecary, Alchemist shop; …→healing potions→antidotes |
| r2r-thorp-14 | thorp 19, the measure's | Livestock » – » – full; Wool » – » – partial; animal hides » Needs: Tannery, Leatherworkers' guild » boots, armor | \| Livestock \| full \| — \| — \| … | ✓ Fully exploited Livestock; Partial Wool; Needs: Tannery, Leatherworkers' guild; …→boots→armor |
| r2r-hamlet-0 | hamlet 22, SIEGE | Grain » – » – full | \| Grain \| full \| — \| — \| | ✓ Fully exploited Grain |
| r2r-village-6 | village 291 | Livestock » – » – full; Wool » – » – partial | the same | Partial Wool; ✓ Livestock |
| r2r-village-23 | village 271 | Gemstones, Hot Springs Mineral » – » – partial; Timber » Needs: Sawmill, Carpenters' guild » furniture, buildings; Mountain Timber » Needs: Sawmill, Carpenters' guild, Charcoal burner » building timber, charcoal fuel | the same | the same Needs lines; Partial Gemstones (→cut gems) |
| r2s-famine-village-0 | village 114, FAMINE | Grain » – » – full | the same | ✓ Grain |
| r2r-town-1 | town 1,590 (keep-guard) | medicinal herbs » – » – full; Timber » – » – partial | the same | ✓ Medicinal herbs; Partial Timber (→lumber→planks) |
| r2s-under_siege-town-0 | town 2,137, SIEGE | Fish » – » – full | the same | ✓ Fish |
| r2s-famine-city-0 | city 2,909, FAMINE | Fish full; Timber partial | the same | the same grades |
| r2r-town-6, r2r-city-48, r2r-metropolis-0 | (the measure's) | no chain rows | none | none |
| r2r-village-55, r2s-under_siege-village-0 | SIEGE | worked rows only, "» – » –" | the same | the same grades |
| r2s-under_siege-thorp-0 | thorp 9, SIEGE, the smallest | Fish » – » – full; Stone » Needs: Stone quarry, Stonemasons' guild » buildings, monuments | the same | the same Needs |
| r2r-hamlet-28, r2r-village-58, r2r-city-44 | FAMINE | Fish / Oasis Water full; Timber » Needs: Sawmill, Carpenters' guild » furniture, ships; Stone » Needs: … » buildings, monuments | the same | the same Needs |
| r2r-thorp-40, r2s-occupied-thorp-0, r2s-occupied-thorp-2 | OCCUPATION | Livestock / Fish full; animal hides » Needs: Tannery, …; Clay » Needs: Potter, Brickmaker » pottery, bricks; Timber » Needs: Sawmill, … | the same | the same Needs |
| r2r-thorp-4, -12, -19 | thorp | Oasis Water / Grain / Fish full; gold/silver ore » Needs: Smelter, Goldsmiths' guild » jewelry, coins; Gemstones » Needs: Jewelers' guild; Camel Herds » Needs: Caravanserai, Leather tanner | the same | the same Needs |
| r2r-metropolis-19, -24, r2s-indebted-metropolis-1 | metropolis to 145,383, the largest read (r2r-metropolis-14, 271,164, SIEGE, in the guard) | worked rows only, "» – » –" | the same | the same grades |

As read: NO false line on either surface in the 27 towns (12 + 15) and the guard's: every printed house is a "Needs:" house of
the tab, every printed good one of the tab's two. What the rows now lack is listed under the lines lost.

## Gates and suites after the cure (EXECUTED, each through `sh scripts/gate-tail.sh`)

- strict-domain gate (`npm run typecheck:domain:strict`): exit 0. Type ratchet (`npm run typecheck:ratchet`): exit 0. eslint on
  the four touched files: exit 0.
- The twelve-birth grid (`node scripts/census/page-census.mjs --grid`): exit 0, 0 falls, no rise.
- The presumed-things walker (`tests/lint/presumedThings.walker.test.js`): 3 red at the base AND at the tip, the same output
  line for line (153 + 2 rows; arms 1, 2, 3): no rise; not this seat's.
- The 70 test files that name the touched files (`viewModelBodySlices`, `ResourcesProduction`, `resourcesSlice`, `journalPages`,
  `buildViewModel`, `generateFoundryModule`): at the tip 13 red of 818; 3 were this seat's pins (re-keyed above, green); the 10
  others are red at the base too: `houseLabelEverySurface.test.jsx` (1), `coherenceAgreeCures.test.js` (2),
  `observedShapeReaders.walker.test.js` (6), `goldenViewModel.test.js` (1: defense.scoreAvg, headcounts.npcs,
  prosperity.inCrisis — the same diff at the base and the tip; no field of this block).

## Registers named STALE (re-derived once, at the close; nothing banked, nothing raised)

- **The observed-shape register** (`scripts/check-observed-shape-readers.mjs`, `observedShapeReaders.walker.test.js`): the cure
  removes four reads on `exploitation` in `src/pdf/lib/viewModelBodySlices.js` (`processing`, `institution`, `output`,
  `product`): the walker's vanished-row list rises 6 → 10 by exactly these four. Two it calls "a lawful repair"; two (`processing`,
  `institution`) it flags "THE READ IS STILL WRITTEN … INSTRUMENT EROSION": TRIAGED: the reads on `exploitation` are gone
  (`grep '?\.(processing|institution)'` in the file finds only `c?.processing` on activeChains, line 52, and `iss?.institution`,
  line 93: the same property name on other receivers). All four are shrinks; the door (`--write`, on a clean tree) is the close's.
- No other register moved by this cure: the grid unmoved; the presumed walker unmoved; no golden moved by it.

## THE ONE MEASURE (not cured): the journal's "Black market (operational)" row

- WHO WRITES IT: `src/foundry/journalPages.js :: economicsPage`, the "## Supply chains" list: `- **<name>** *(<state>)*`; the
  name from `src/pdf/lib/viewModelBodySlices.js :: economicsSlice` (`chainPrintName(c, s).label`, the chain `black_market`,
  label "Black market", need "Criminal economy"), the state from `pdf/lib/chainStateOnPage.js` (since b6f5d459b, SURFACES-1 · 1).
- SINCE WHICH COMMIT: **364c2313d** (2026-11-14 11:27Z, "fix(UPKEEP-14): (j) the Foundry journal names each supply chain by its
  record, not 'Chain'"): before it every row read "- **Chain** *(operational)*" (`name: c?.name || c?.chainName || 'Chain'`); it is
  in 3c30fdeb4 and not in c2c12792e, which is the measure's rise 490 → 560.
- THE TAB: the Economics tab prints the same chain card in **all 250** towns ("Black market · Criminal economy · ○ Operational",
  its houses, its goods; base dumps, `bm.mjs`). 140 of the 250 hold a house named "Black market"; the **110** others run the chain
  through "Front businesses" (cities) or a "Fence (word of mouth)" (hamlets) and the tab names those houses. The census's hit in
  those 110 is its house pattern reading the chain's NAME as a house. Three read: r2r-city-15 (12,526; Front businesses; the tab
  "Black market · Operational"), r2r-hamlet-19 (84; Fence), r2r-city-42 (7,313; Front businesses). As read: the journal says what
  the tab says; the row names a trade, not a house (LOW: the name is the record's). Not cured by this seat.

## What is left (line by line; none of it this seat's to cure)

1. The partial rows' intermediate goods (the tab's Partial card prints them; the export prints none: less). If the chair wants
   them carried, they are the tab's `intermediateGoods` unless `moved`; a new column or a third cell (the journal's "Output" is
   not their word). Not measured.
2. A card moved to Unexploited (`exploitationCardShown :: moved`): the tab still prints "Needs: …" on it; the export's row prints
   the resource and "unexploited" only (less). Unchanged by this cure.
3. The PDF's worked row prints "» – » –" (`pdf/primitives/Visuals.jsx :: ChainRow`'s fallback for an empty cell): no false word,
   a dash in an empty column. A row with no houses and no goods could print the resource and its status alone (Visuals.jsx: not
   in this block).
4. FOR THE JOIN / NAMED, NOT CHANGED: the resource's name on the PDF and the journal is `humanize(<stored key>)` ("Hot Springs
   Mineral", "glass sand" beside "Glass Sand" in r2r-metropolis-19, "gold/silver ore") where the tab prints
   `resourceDisplayName` ("Mineral hot springs"): `ResourcesProduction.jsx :: ChainGroup` and `journalPages.js :: resourcesPage`
   (B4's file), one-line change each: `resourceDisplayName(c.resource)` for `humanize(c.resource)`. Not measured.
5. The registers above, at the close.

## How the instruments are re-made

From outside every tree: the measure's probes `git archive origin/lane/exports-measure-2026-11-14
docs/chair/2026-11-14/probes/EXPORTS-MEASURE-1`, the census's `git archive origin/lane/census-3-2026-11-14
docs/chair/2026-11-14/probes/CENSUS-3` (copy `render.lean.jsx` beside `census3.sh`). Base: `HOLDERS=<CENSUS-3>/holders.tipA.json
sh <CENSUS-3>/census3.sh <base tree> <out> 4`; tip: the same with `BASE_DUMPS=<base out>/dumps CENSUS_RENDER=render.lean.jsx`.
FAST: `node b3fast.mjs <out>/corpus.ndjson.gz <tree>`. This seat's own scripts (`docs/chair/2026-11-14/probes/EXPORTS-B3/`):
`b3rows.mjs` (rows by grade), `b3lost.mjs` (what the cure took off, base vs tip), `b3read.mjs` (the three surfaces per town),
`resviews.mjs` (kind a in the Resources views), `bm.mjs` (the Black market row).
