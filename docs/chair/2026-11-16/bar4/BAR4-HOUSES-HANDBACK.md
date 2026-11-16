# BAR4-HOUSES · hand-back (2026-11-16)

Base 8aef8e7d46 (checkout tip a71788851: the base plus the BAR3-CLOSE-DOORS-2 hand-back, documents only). Branch
`lane/bar4-houses-2026-11-16`. Kind H1, the description's presumption: a house's stock description and the foodways line
against their own town. Worked to BRIEF-BAR4 (amendment K: a detector first), BRIEF-BAR2's method and BRIEF-BAR3's
amendments 2 to 9, 11, 12.

## THE KINDS

| kind | detector | 720 before → after | fresh 300 before → after | named exclusions | guard and positive control |
|---|---|---|---|---|---|
| H1 (i) sex: he / his / she / her against the holder | `tests/helpers/housePresumptions.js :: housePresumptionsOf`, class `sex` | 5 in 5 → 0 | 4 in 4 → 0 | none | `tests/generators/bar4HousesPresumptions.test.js` (a) zero over the 720; (b) a crier card with a woman holding it fires, a man holding it is silent |
| H1 (ii) timber to hand | class `timber` (reads the new atom's reader `timberAtHand.js`) | 11 in 11 → 0 | 6 in 6 → 0 | none | (a); (b) a sawmill with no timber chain fires, with a working one is silent |
| H1 (iii) answers to no one, under an occupation | class `answers` | 0 → 0 | 1 in 1 → 0 | a contract killer "answering to no assassins guild" (no government spoken of) | (a); (b) the council's line under `occupied` fires, calm is silent |
| H1 (iv) the market's vendors, under a siege | class `market` | 3 in 3 → 0 | 3 in 3 → 0 | none | (a); (b) the vendors line under a siege fires, calm is silent |
| H1 (v) the harvest kept, in want | class `store` (band famine or deficit) | 4 in 4 → 0 | 4 in 4 → 0 | none (the lines of technique, "Smoking, drying, fermenting, and winter storage are central household technologies", "Herd cycles and winter fodder matter …", carry none of the class's words and are true in want) | (a); (b) the harvest line under a famine band fires, secure is silent |
| H1 (vi) the food's own source (K6: A SPLIT IN THE RECORD) | class `source` | 24 in 24 → 24 (not cured) | 6 in 6 → 6 | — | (a) held at a ceiling of 24 (never raised) |
| **all cured classes** | | **23 in 23 → 0** | **18 in 18 → 0** | | |

The detector fires on all seven worklist rows in their own read towns at the base (bar0-town-calm-rand-23 sex,
bar0-town-occupied-rand-22 timber, bar0-town-occupied-rand-21 answers, bar0-hamlet-under_siege-rand-22 market,
bar0-village-famine-rand-22 and -23 store, bar0-thorp-calm-rand-21 source). The 720's count was read both off the record and
off the census's dumps (`printed`: each line found in the town's page text): the same 47 instances (23 cured + 24 split).

## The rows

| row | town | verdict | cure |
|---|---|---|---|
| C37943 | bar0-town-calm-rand-23 | STANDS (Ghalia al-Din, f, holds the Town crier) | both crier variants name no pronoun (8 towns of the 720 print them; a woman holds the post in 5) |
| C40862 | bar0-town-occupied-rand-22 | STANDS (Timber & Lumber impaired, woodland depleted) | the sawmill's two timber lines declare `timber at hand`, late; their twins claim the mill's own trade |
| C39560 | bar0-town-occupied-rand-21 | STANDS (occupied) | the council's line excludes `crisis: occupied` and `ruler: occupier`, late; its twin says the occupiers' orders |
| C19810 | bar0-hamlet-under_siege-rand-22 | STANDS (siege) | the culture's two market lines exclude `crisis: under_siege` where they print; twins name no market |
| C47050 | bar0-village-famine-rand-22 | STANDS (band famine, 0.1 months) | the harvest line needs `food: > deficit` where it prints; its twin is the preserving the households still do |
| C48079 | bar0-village-famine-rand-23 | STANDS (band famine) | the same |
| C33207 | bar0-thorp-calm-rand-21 | K6 SPLIT, NAMED for the chair (not cured) | `src/generators/foodLand.js` counts grain only off `grain_fields`/`fertile_floodplain`; the roster's Subsistence farming (`hasSubsistence`) tills holdings for the table: 24 of the 720 and 6 of the 300 print the one-source frame beside a tilling house with no grain in the food record |

## The cures (one commit)

- `src/data/institutionDescVariants.js`: the Town crier's pair reworded (no pronoun); `DESC_VARIANT_DECLARATIONS` re-keyed to
  the new texts (needs `market`, as before). `DESC_LATE_SIBLINGS` 8 → 11: the commercial sawmill's two lines (`needs: timber at
  hand`) and the town council's "answers to no one in particular" (`excludes: crisis: occupied, ruler: occupier`; its twin declares `crisis: occupied`), each with a
  twin. Resolved by the existing late re-read (`assembleSettlement.js :: readHouseDescsLate`, untouched). The city-state's
  "no higher lord" lines were measured and left: no occupied town of the 1,050 holds a City-state government.
- `src/data/institutionDescColour.js`: the two sawmill lines leave the colour column (they now declare).
- `src/data/cultureProfiles.js`: `FOODWAYS_PRINT_SIBLINGS` (three sets, keyed off the profile rows' own texts): the market
  vendors (latin) and market supply (greek) lines, `excludes: crisis: under_siege`; the harvest line (slavic), `needs: food: >
  deficit`. The draw never reads it (no pick moves).
- `src/domain/foodways.js :: foodwaysLineOf` (the one reader): resolves each sentence of the line against that table
  (`resolveSiblingSentences`) over `factsOf` of the record handed; where a caller hands the economy alone (the Economics tab,
  the identity record at assembly) the food security's own `hasSiege` / `hasFamine` stand in as the stress container
  (`withFoodCrises`), so the tab and the PDF read one answer.
- NEW VOCABULARY (amendment 5b): the atom `timber at hand` beside `iron at hand` (`factVocabulary.js`), its getter
  (`factsOf.js`), its layer row (`factLayers.js`, layer 2 over `economicState`), its home `src/domain/facts/timberAtHand.js`:
  the Timber & Lumber chain (`chainId: 'timber'`) working its own input.
- Registrations made: `scripts/lib/table-pools.mjs :: DECLARATION_CHANNELS` += `FOODWAYS_PRINT_SIBLINGS` (siblings);
  the pool's ledger `docs/census/declarations/institutionDescVariants.INSTITUTION_DESC_VARIANTS.json`: the crier rows' texts
  re-read, the sawmill rows `colour: false` with their `colourReadBy`; `tests/lint/presumedThings.widened.register.json`: 4
  stale rows out by `presumed-things-door.mjs --shrink`.
- Tests: the guard (new); `houseDescLateReRead.test.js` (the table's length 8 → 11, dated note); `tierNounPoolDraws.test.js`
  (a late twin is a pool line, as a draw-time twin is).

DECLARED MOVE (record): 25 of the census's 720 records (institutions 18, culturalIdentity 7); 19 of the fresh 300
(institutions 12, culturalIdentity 7). REFERENCE: 7 of the 525 configurations move against 8aef8e7d46 (institutions 4: four
germanic plains towns' sawmill or crier; culturalIdentity 3: the slavic forest isolated thorp, hamlet and village, band
deficit, take the harvest twin).

## The veto list (every new or changed line, three towns it is read in)

1. "The official voice, reading proclamations, market prices, and news at set hours in the market square. Town or guild pays
   the wage." (was "pays his wage") — r2r-town-49 (1,724), r2s-occupied-town-1 (occupied), bar0-town-occupied-rand-114 (town only).
2. "At fixed times the proclamations, the prices, and the news are called out in the market square. The town pays for it, or
   else a guild." — r2r-town-47 (1,410), r2s-under_siege-town-1 (siege), bar0-town-calm-rand-23 (C37943's town).
3. "A saw driven by water or ox, cutting planks and beams for builders whenever logs can be had. The crew is permanent." (the
   sawmill's twin) — r2r-town-29, r2s-wartime-town-3 (wartime), bar0-town-occupied-rand-113 (occupied).
4. "Water or ox power turns logs into planks and beams for the construction trade whenever logs can be had, and a standing
   crew works it." — r2r-town-2 (914), r2s-insurgency-town-0, bar0-town-occupied-rand-22 (C40862's town, occupied).
5. "A loose council of leading citizens sees to the town's common business. It takes its orders from the occupiers now, but
   the work gets done." — bar0-town-occupied-rand-21 (C39560's town), bar0-town-occupied-rand-125 (757); none in the 720 (2 towns of 1,050).
6. "Shared dining customs make food distribution visibly civic." — bar0-hamlet-under_siege-rand-22 (94, C19810's town),
   r2s-under_siege-city-0 (13,252), r2s-under_siege-metropolis-1 (70,862).
7. "Food supply and the grain stores become politically charged as population grows." — prints in none of the 1,050 (a greek
   town under a siege); the state's twin.
8. "Fermentation, pickling, and drying are how the households make what food they have last." — r2s-under_siege-thorp-1 (16,
   siege), r2s-famine-hamlet-2 (famine), bar0-city-under_siege+famine-rand-107 (city).
9. NEW VOCABULARY: the atom `timber at hand` (`facts/timberAtHand.js`).

## Gates and books at the tip (against 8aef8e7d46)

Run alone at the tip: the guard green (and red by a planted pronoun, not committed); `colourMarks4h`, `houseDescLateReRead`,
`institutionProseDeclared`, `tierNounPoolDraws`, `wiringCensusDeclared`, `negativeAssertionAnchor`, `seedLoopTotality`,
`proseDrawnAnchors` green; eslint on the touched files, `typecheck:domain:strict` (1113, ceiling 1113),
`check:observed-shape-readers` green.

### The books my cures move (NAMED, not re-taken)

| test / file | arm | old → new | door | why |
|---|---|---|---|---|
| `tests/lint/presumedThings.walker.test.js` | ARM 1 "every source literal that names a thing declares it" | 0 → 4 fresh | the close (PT3/PT4) | the crier's two REWORDED lines (`market`, `streets`, two each: each declares `needs: market`, as its banked rows did, and every town has streets: true wherever they print; measured in the 8 and 7 towns of the 1,050 that print them). Their 4 stale rows went out by `--shrink` in this commit. (The council's twin declares `crisis: occupied`: `ruler: occupier` occurs in none of the 1,050 without it) |
| `tests/generators/generationForkCensus.test.js` | A4 the landing triples | cascade/isolation/factionCorrelation/coherenceRepair `institutions.producedOnRecord` same −4, transformed +4 | `src/domain/generation/generationForkRegistry.js` (the arm prints its fresh literal) | the late re-read now transforms the house descriptions of 4 golden towns |
| `tests/property/generatorGoldenMaster.test.js` and the golden-derived files | the 525 | 7 of 525 | the owner's word | as above |
| `docs/content/wiring-census.json` and the pool census's files | a new channel and its rows | (not re-taken) | the close | `FOODWAYS_PRINT_SIBLINGS`, the late sets, the reworded crier lines |

## Registrations owed

- manifest entry owed (`scripts/mutation-coverage-manifest.json`): `tests/generators/bar4HousesPresumptions.test.js`: kills a
  pronoun back in a house description, a timber/occupation late declaration dropped, and the foodways reader's print-time
  resolution removed (each reds the zero arm over the 720).
- roster row owed: none (no goods module imported).

## What is left, in order

1. C33207's K6 split (named for the chair): `foodLand.js` vs the roster's subsistence holdings (24 of the 720, 6 of the 300).
2. The books above (the close's doors).
3. (This section is completed at the final push with the wide net's results.)

## Instruments

`git archive origin/lane/chair-2026-11-08 docs/chair/2026-11-14/probes/READ-ALL` and `origin/lane/census-3-2026-11-14
docs/chair/2026-11-14/probes/CENSUS-3` into the scratchpad. Births alone (fast, ~1 min for 1,050): `TREE=<tree> OUT=<out>
SEEDS=<file> node <CENSUS-3>/births.mjs` (with `node_modules` linked into `<out>`). The detector over a corpus: a scratch
script that imports `<tree>/tests/helpers/housePresumptions.js` and runs `housePresumptionsOf(record, { printed, foodwaysLine
})` per town (`printed` from `<out>/dumps/<seed>.txt`; for a base corpus read with the tip's detector, hand the base tree's
`foodwaysLineOf` as `foodwaysLine`). The 525: a scratch script births `goldenCorpus()` in each tree, hashing each record whole
and per field.
