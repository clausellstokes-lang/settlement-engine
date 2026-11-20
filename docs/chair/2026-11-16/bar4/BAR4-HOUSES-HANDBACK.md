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
| H1 (vi) the food's own source: the one-source frame against the roster (a split in the record, cured on the page by the chair's ruling FW1) | class `source` (a live subsistence holding by `foodLand.js`'s four names, native name; no grain in the food record) | 87 in 87 → 0 | 28 in 28 → 0 | — | (a); (b) the game frame beside a Subsistence farming house with no grain fires, with grain is silent |
| **all classes** | | **110 in 108 → 0** | **46 in 46 → 0** | | |

The detector fires on all seven worklist rows in their own read towns at the base (bar0-town-calm-rand-23 sex,
bar0-town-occupied-rand-22 timber, bar0-town-occupied-rand-21 answers, bar0-hamlet-under_siege-rand-22 market,
bar0-village-famine-rand-22 and -23 store, bar0-thorp-calm-rand-21 source). The 720's count was read both off the record and
off the census's dumps (`printed`: each line found in the town's page text): the same instances. (My K2 line gave the source class as 24 / 6: that was a narrower first reading, by the holding's description words; the chair's FW1 reads the roster, 87 / 28.)

**THE PAGE WHOLE FOR (vi): BATCH 3 (the chair's ruling FW1b, 08:55).** Two callers handed the reader the economy alone and so kept the old frame (the economy's own roster stamp, `compound.inst.names`, is declared unreadable by `institutionRename.js`). Each is now ONE argument on its own line, no line added, moved or re-wrapped: the Economics tab (`src/components/new/tabs/EconomicsTab.jsx`, the `foodwaysLine` const) hands `s ? { ...s, economicState: eco } : { economicState: eco }`; the assembly (`src/generators/steps/assembleSettlement.js`, the `culturalIdentity` entry of the record's literal) hands `{ institutions, economicState }`. WHY THAT ROSTER IS THE FINAL ONE: it is the array the same literal stores as `settlement.institutions` (through `fishTradeTwinned`, which rewrites descriptions only), and neither the assembly after it (the late re-reads change descriptions and labels, never a house's name or liveness) nor the pipeline after assembly (`generateSettlementPipeline.js` reads `settlement.institutions`, never reassigns it) changes which houses stand. The guard's (d) proves on a constructed record that the tab's call, the PDF's and Foundry's call (`foodwaysLineOf(settlement)`) and the stored identity print one line, and over the 720 that the stored identity IS the reader's line.

## The rows

| row | town | verdict | cure |
|---|---|---|---|
| C37943 | bar0-town-calm-rand-23 | STANDS (Ghalia al-Din, f, holds the Town crier) | both crier variants name no pronoun (8 towns of the 720 print them; a woman holds the post in 5) |
| C40862 | bar0-town-occupied-rand-22 | STANDS (Timber & Lumber impaired, woodland depleted) | the sawmill's two timber lines declare `timber at hand`, late; their twins claim the mill's own trade |
| C39560 | bar0-town-occupied-rand-21 | STANDS (occupied) | the council's line excludes `crisis: occupied` and `ruler: occupier`, late; its twin says the occupiers' orders |
| C19810 | bar0-hamlet-under_siege-rand-22 | STANDS (siege) | the culture's two market lines exclude `crisis: under_siege` where they print; twins name no market |
| C47050 | bar0-village-famine-rand-22 | STANDS (band famine, 0.1 months) | the harvest line needs `food: > deficit` where it prints; its twin is the preserving the households still do |
| C48079 | bar0-village-famine-rand-23 | STANDS (band famine) | the same |
| C33207 | bar0-thorp-calm-rand-21 | STANDS (a split in the record: `foodLand.js` counts grain only off grain fields; the roster's Subsistence farming tills for the table) | batch 2, the chair's ruling FW1: `foodways.js :: tilledOneFrame`: where a live subsistence holding stands and the one source is not grain, the frame names both (the page's two callers above still owed) |

## The cures (batch 1, 3cf213071; batch 2, FW1, d015e3041; batch 3, FW1b and the books' cures, the final push)

- `src/data/institutionDescVariants.js`: the Town crier's pair reworded (no pronoun); `DESC_VARIANT_DECLARATIONS` re-keyed to
  the new texts (needs `market`, as before). `DESC_LATE_SIBLINGS` 8 → 11: the commercial sawmill's two lines (`needs: timber at
  hand`) and the town council's "answers to no one in particular" (`excludes: crisis: occupied, ruler: occupier`; its twin declares `crisis: occupied`), each with a
  twin. Resolved by the existing late re-read (`assembleSettlement.js :: readHouseDescsLate`, untouched). The city-state's
  "no higher lord" lines were measured and left: no occupied town of the 1,050 holds a City-state government.
- `src/data/institutionDescColour.js`: the two sawmill lines leave the colour column (they now declare).
- `src/data/foodwaysPrintSiblings.js` (NEW, a zero-import leaf): `FOODWAYS_PRINT_SIBLINGS` (three sets, keyed by the
  profile rows' own texts, held equal to them by the guard's (e)): the market vendors (latin) and market supply (greek)
  lines, `excludes: crisis: under_siege`; the harvest line (slavic), `needs: food: > deficit`. The draw never reads it (no
  pick moves). Batches 1 and 2 kept it in `cultureProfiles.js`; the build's boot smoke and `cultureProfilesLazy` (FP-G16:
  the culture corpus off first paint; LAWS) went red because the eager reader then pulled the corpus into first paint:
  moved to the leaf in batch 3, `cultureProfiles.js` is again byte-identical to the base.
- `src/domain/foodways.js :: foodwaysLineOf` (the one reader): resolves each sentence of the line against that table
  (`resolveSiblingSentences`) over the food record's own readings (`foodwaysFactsOf`: `foodSecurity.hasSiege` /
  `hasFamine` and `foodRecord.band`), spelled there because this module rides the eager engine core and the fact homes
  (`factsOf.js`, `crisisKind.js`, `famine.js`) are pinned lazy (`engineCoreLazyEdge`, a law: a first draft read `factsOf`
  and turned it red; cured before the push).
- BATCH 2 (FW1): `src/domain/foodways.js`: `FRAMES.oneTilled` (two frames, the 'one' frame's index kept) and `tilledOneFrame`, applied in `foodwaysLineOf` after the famine's reading, over the record's live roster (`liveInstitutions`, `nativeSemanticName`); `foodLand.js` untouched.
- NEW VOCABULARY (amendment 5b): the atom `timber at hand` beside `iron at hand` (`factVocabulary.js`), its getter
  (`factsOf.js`), its layer row (`factLayers.js`, layer 2 over `economicState`), its home `src/domain/facts/timberAtHand.js`:
  the Timber & Lumber chain (`chainId: 'timber'`) working its own input.
- Registrations made: `scripts/lib/table-pools.mjs :: DECLARATION_CHANNELS` += `FOODWAYS_PRINT_SIBLINGS` (siblings);
  the pool's ledger `docs/census/declarations/institutionDescVariants.INSTITUTION_DESC_VARIANTS.json`: the crier rows' texts
  re-read, the sawmill rows `colour: false` with their `colourReadBy`; `tests/lint/presumedThings.widened.register.json`: 4
  stale rows out by `presumed-things-door.mjs --shrink`.
- Tests: the guard (new); `houseDescLateReRead.test.js` (the table's length 8 → 11, dated note); `tierNounPoolDraws.test.js`
  (a late twin is a pool line, as a draw-time twin is).

DECLARED MOVE (record, at the final tip against 8aef8e7d46): 111 of the census's 720 records (institutions 18, culturalIdentity 93: `culturalIdentity.foodways`, the harvest and market twins and FW1's frame); 47 of the fresh 300 (institutions 12, culturalIdentity 35). REFERENCE: 74 of the 525 configurations (culturalIdentity 70, institutions 4: four germanic plains towns' sawmill or crier). (Batch 1 alone moved 7 of the 525: culturalIdentity 3, institutions 4.)

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
9. "Each holding grows for its own table, and beyond that its food is {A}." (FW1; 56 of the 1,050) — r2r-thorp-9 (20), bar0-thorp-calm-rand-21 (19, C33207's town), r2r-thorp-24 (occupied); thorps and hamlets only.
10. "What each holding grows goes to its own table; beyond that, what it puts on the table itself is {A}." (FW1; 64) — r2r-thorp-3 (12), r2s-under_siege-hamlet-1 (57, siege), r2r-thorp-40 (occupied).
11. NEW VOCABULARY: the atom `timber at hand` (`facts/timberAtHand.js`).

## The census (before at 8aef8e7d46, after at 3cf213071), read through the inventory diff

sentences 30,152 → 30,156; gone 3, new 7, in fewer towns 6, in more 0. EVERY LOSS IS A DETECTOR INSTANCE: the crier's three
pronoun sentences (5, 3, 3 → 0); the sawmill's four timber sentences (9 → 3, 10 → 5: the 11); "stretch the harvest" 64 → 60
(the 4); "Market vendors …" 32 → 29 (the 3). No other sentence moved. THE INHERITORS (all seven read): the twins and the
reworded crier lines above, each in exactly the towns that lost its original. (Batch 2 is read where the line prints: the
census renders the Economics tab, which hands the economy alone, so its frame shows there only once the callers hand the
record; measured off the record: 0 / 0.)

## Gates and books at the final tip (against 8aef8e7d46, green whole by the chair's check)

ATOM NAMESAKE (for the join: keep ONE): mine is `'timber at hand'` in `src/domain/facts/factVocabulary.js` (beside `'iron
at hand'`, reader `f.timberAtHand`), the getter `timberAtHand` in `src/domain/facts/factsOf.js`, the layer row `timberAtHand`
in `src/domain/facts/factLayers.js`, its one reader `src/domain/facts/timberAtHand.js :: timberAtHandOf` (the Timber &
Lumber chain, `chainId: 'timber'`, working its own input); declared on two sets of `src/data/institutionDescVariants.js ::
DESC_LATE_SIBLINGS` (the commercial sawmill's two lines) and read by the detector `tests/helpers/housePresumptions.js`.
BAR4-SCENES' namesake is in `src/domain/facts/sceneSupply.js`.

RUN, at the tip: the 17 law suites, the three of BRIEF-BAR3's amendment 2 and the ten of BRIEF-BAR4's amendment 2 EACH
ALONE (at the batch-2 tip, `laws-tip`), then every one of them again with the pinned set (79 files: the files that pin a
symbol I changed) and the FW1b list (`sourceCitationIntegrity`, `regenDerivedState`, `generationForkRegistry.contract`,
`foodwaysOneLine`, `r3c9`/`r3c10` reader lines, `cultureBlockTwoSurfaces`, `heldKeyWriterCensus`) in one run at the final
tree (102 files), and every file red there, or touched since, ALONE again at the final tip. Green at the final tip: the
guard, `engineCoreLazyEdge`, `wiringCensusDeclared`, `ruinFilterRoster` (111 → 112, a compliant reader, dated note),
`chainPrintSites`, `sourceCitationIntegrity` (no test or register cites `assembleSettlement.js` by line), `regenDerivedState`,
`generationForkRegistry.contract`, `foodwaysOneLine` (its oracle now the one reader: dated note), the three corpus walkers,
`colourMarks4h`, `houseDescLateReRead`, `institutionProseDeclared`, `tierNounPoolDraws`, and every other law of the list.
eslint on the touched files, `typecheck:domain:strict` (1113, ceiling 1113), `check:observed-shape-readers` green.
LAWS MY CURES TURNED RED AND CURED BEFORE THE PUSH: `engineCoreLazyEdge` (the reader imported `factsOf`: now the food
record's own readings), the boot smoke and `cultureProfilesLazy` (the table moved to a zero-import leaf), `ruinFilterRoster`
(its count), `foodwaysOneLine` (its oracle).
ONE BUILD and `verify:dist` at the final tip: build 0; BOOT SMOKE PASSES (plain and flagged); `verify:dist` refuses only on
the stored figures below; `dist/` removed.

### The books my cures move (NAMED, not re-taken)

| test / file | arm | old → new | door | why |
|---|---|---|---|---|
| `tests/lint/presumedThings.walker.test.js` | ARM 1 "every source literal that names a thing declares it" | 0 → 6 fresh | the close (PT3/PT4) | (a) the crier's two REWORDED lines (`market`, `streets`, two each: each declares `needs: market` as its banked rows did, and a town has streets: true wherever they print, in 8 and 7 towns of the 1,050); their 4 stale rows went out by `--shrink` in batch 1. (b) the leaf's two market KEYS (`foodwaysPrintSiblings.js`): match keys spelled again for the culture's two market rows, which declare `needs: market` in their profile and are admitted at the draw only where a market stands; the leaf prints its twins, never its keys. |
| `tests/generators/generationForkCensus.test.js` | A4 the landing triples | `institutions.producedOnRecord` same −4, transformed +4 on the four late passes (cascade, isolation, factionCorrelation, coherenceRepair) | `src/domain/generation/generationForkRegistry.js` (the arm prints its fresh literal) | the late re-read now transforms the house descriptions of 4 golden towns |
| `tests/generators/pipelinePinnedMode.test.js` | A1, A2, A5 (golden rows) | 4 of its 41 golden rows | the golden door (the owner's word) | the same records as the 525 |
| `tests/property/generatorGoldenMaster.test.js` and the golden-derived files | the 525 | 74 of 525 (culturalIdentity 70, institutions 4) | the owner's word | the declared move |
| `tests/lint/proseWiringCensus.walker.test.js` | car 0 and car 5b (the committed census current) | stale bytes | `docs/content/wiring-census.json` and the pool census's files (the close) | a new channel (`FOODWAYS_PRINT_SIBLINGS`), the late sets, the reworded crier lines |
| `tests/lint/mutationCoverageManifest.test.js` | the new guard file | unregistered | `scripts/mutation-coverage-manifest.json` (the close) | registration owed, below |
| `tests/build/engineBundleReplay.test.js`, `engineServiceCore.test.js`, `engineServiceStoreParity.test.js` (verify:dist) | the committed engine bundle | 74 of 525 rows, 75 of 360 fence settlements, 1 of 3 cases, 1 seed and the derive arm differ | `npm run build:edge-shared` and commit the bundle (the close) | the bundle is stale against the declared move |
| `tests/build/generationWorkerLazy.test.js` (verify:dist) | the worker bundle's ceiling | 2,322,103 → 2,326,760 B (+4,657) | the ceiling's door (the chair's ruling B3 form) | the cures' code and text (the atom, the reader, the late sets, the leaf) in the worker |
| `tests/build/vendorPdfLazy.test.js` (verify:dist) | first-paint closure raw / gzip / Brotli; the engine chunk's bound | 1,132,308 → 1,134,786 (+2,478); 360,756 → 361,520 (+764); 302,830 → 303,504 (+674); engine chunk 878,554 → 878,577 (+23) | the budget's door | `foodways.js` rides the eager engine core: its two print-time readings and the leaf's six sentences |

REFERENCE: 74 of the 525 configurations move against 8aef8e7d46 (culturalIdentity 70: `culturalIdentity.foodways`, the
harvest twin in band-deficit slavic towns and FW1's frame in subsistence thorps and hamlets; institutions 4).

## Registrations owed

- manifest entry owed (`scripts/mutation-coverage-manifest.json`): `tests/generators/bar4HousesPresumptions.test.js`: kills a
  pronoun back in a house description, a timber/occupation late declaration dropped, and the foodways reader's print-time
  resolution removed (each reds the zero arm over the 720).
- roster row owed: none (no goods module imported).

## What is left, in order

1. Nothing of the worklist: every row cured; every class 0 in the 720 and in the fresh 300 (off the record; the 720's
   batch-1 after census read through the inventory diff, above).
2. The books above, for the close's doors (none re-taken here); the manifest entry owed.
3. For the join: ONE `timber at hand` (mine and BAR4-SCENES'); BAR4-CORPUS-ECO's "leans first on its hunting" (C33209) is
   the sibling of FW1 in the same towns (the chair's note).
4. Not measured by a census render at the final tip: batches 2 and 3 print on the tab only through the callers FW1b
   changed; the record-level detector reads 0 and the guard's (d) proves the surfaces agree.

## Instruments

`git archive origin/lane/chair-2026-11-08 docs/chair/2026-11-14/probes/READ-ALL` and `origin/lane/census-3-2026-11-14
docs/chair/2026-11-14/probes/CENSUS-3` into the scratchpad. Births alone (fast, ~1 min for 1,050): `TREE=<tree> OUT=<out>
SEEDS=<file> node <CENSUS-3>/births.mjs` (with `node_modules` linked into `<out>`). The detector over a corpus: a scratch
script that imports `<tree>/tests/helpers/housePresumptions.js` and runs `housePresumptionsOf(record, { printed, foodwaysLine
})` per town (`printed` from `<out>/dumps/<seed>.txt`; for a base corpus read with the tip's detector, hand the base tree's
`foodwaysLineOf` as `foodwaysLine`). The 525: a scratch script births `goldenCorpus()` in each tree, hashing each record whole
and per field.
