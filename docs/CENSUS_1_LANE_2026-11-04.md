# CENSUS-1 — wave 0, the fact homes (lane record, 2026-11-04)

> A build seat's record for the chair. Branch `lane/census-1-2026-11-04`, cut from the rung-2 window branch at `148a1f9` (F11, F13 and F12 composed; F12's `e216a2673` is an ancestor), with the CENSUS-0 design commit cherry-picked (`847a83f`), and the window branch merged at every unit boundary (`ec764f8` at fact 1→2, `6a9fb3c` at the end). Transport push only; no pull request.
>
> **Where this seat stopped.** Unit 0 and all fourteen fact homes of wave 0 are built and committed. **Wave 1 (the mechanism) is not started**: the next seat starts at wave 1 item 1 (`src/domain/facts/factVocabulary.js`) on this branch's tip. The boundary is the context budget, taken at a clean, committed, pushed point.

## The byte-identity method

The committed golden master is red 525/525 at this window base (moved by the composed F-lanes and never re-recorded, as a lane may not), so it cannot witness byte identity here. Every unit was instead proven with a scratch hasher run before and after: the 525 golden configurations' records, and soak1k-0..59's records **and rendered pages** (all tabs plus the Tonight sheet), sha-256. Where a re-point could plausibly move a birth outside that set, its two readers were also compared on soak1k-0..1999's born records before it landed, and a re-point that moved anything was withdrawn and is listed below for the chair.

Every red-first test was copied into a clean worktree of the window tip and run there (red), then run on the lane (green).

## Unit 0 — the wiring census through its own door

`node scripts/wiring-census.mjs`, then `npm run gen:dossier-prose`; both `--check`s green, no scratch projector. **708 → 709 pools** (DS-DEF-9), 2,266 → 2,323 variants, 165 relation rows, 7 stamped files. The three re-projected leaves are exactly the projector's output: two `readsCount` moves in `defense.generated.js`, two in `general.generated.js`, the pool count in `proseNorms.generated.js`'s header. 0 of 525 golden records, 0 of 60 soak records, 0 of 60 pages moved. Six census/projection staleness reds cured; no new red (the 708-pinned counts were red at the base and stay red). Every later commit that adds a domain module re-takes the census in the same commit (the stamp's producer-file index moves; 0 rows).

## Wave 0 — the fourteen homes

| # | fact | readers retired (before) | the one reader (after) | test | births moved |
|---|---|---|---|---|---|
| 1 | crisis kind | `crisisFacts.activeCrisisTypes`, `crisisPage.crisisEntriesOf`, `hookTruthRecord`'s hand-rolled list, checks X-51, features `chain.stress`, `tabHelpers`' siege test (all `stress` only) | `facts/crisisKind.js :: crisisOf` (alias order; pulse types fold; conditions reported apart); F12's families and the window's `familyActiveIn` moved here, re-exported by `crisisFacts.js` | `crisisKind.test.js` red-first 5/5 | 0 |
| 2 | stores months | five writers moved only `foodSecurity.storageMonths`; the endurance line, X-49 and food-words read `foodRecord.storageMonths` | `facts/storesMonths.js`: `withStoresMonths` (one writer, both homes) and `storesMonthsOf` (one reader); equal at birth on 585/585 | `storesMonths.test.js` red-first 3/3 | 0 |
| 3 | walls / gate / watch / militia / garrison / hospital | `safetyProfile`'s raw-roster substring flags (walls, watch, garrison, gates); hook-truth's "watch or militia" | `facts/defence.js :: defenceOf` (defenseFactsOf's live answers, one meaning each); hook-truth carries `hasWatch` and `hasMilitia` | `defence.test.js` red-first 3/3 | 0 |
| 4 | water | readerBattery `hasNavigableWater` and `traditionsWaterFindings`' regexes, checks `hasWater`, npcGenerator's `coastal` route | `facts/water.js :: waterOf` over `waterAccessKind`; First Landing weighs 0 without water (founding and addition draws) | `water.test.js` red-first 2/3 | **pages only: 12 of 60** (0 golden records; traditions draw at display) |
| 5 | market | foodGenerator, stressGenerator, priorityHelpers substring flags; the raw-roster rule (`arrivalScene.holdsMarket` kept: item 9 below) | `facts/market.js` (the SIZE rule, live roster), re-exported by `viability.js`; readerBattery's `viability` edge retired | `market.test.js` red-first 3/3 | 0 (all four agreed on 2,000 births) |
| 6 | famine | hook-truth's label rule; A-01's `band ≠ famine ∧ gap < 20` | `facts/famine.js :: famineOf` (`recordAllowsStarving`); label = band on 2,000/2,000 births | `famine.test.js` red-first 2/3 | 0 |
| 7 | magic | features `chain.magicScenario` (missing = off) | `facts/magic.js :: magicOf` (`magicWorksAt`, missing = on) | `magic.test.js` red-first | 0 (instrument only) |
| 8 | ruler kind | — (no reader existed) | `facts/rulerKind.js :: rulerKindOf` (elder / lord / priest / mayor / occupier / council) | `rulerKind.test.js` (definition) | 0 |
| 9 | migration direction | — | `facts/migration.js :: migrationOf` (the entry's direction) | `migration.test.js` | 0 |
| 10 | war state | — | `facts/warState.js :: warStateOf` (world first, record default) | `warState.test.js` | 0 |
| 11 | institution presence | defenseFacts' private hospital / healer regexes | `facts/institutions.js :: hasInstitution(record, kind)`; defenseFacts reads its table (regex source byte-identical) | `institutions.test.js` | 0 |
| 12 | population band | — | `facts/populationBand.js :: populationBandOf` (stamp cuts) | `populationBand.test.js` | 0 |
| 13 | terrain class | readerBattery and checks' two chains | `facts/terrain.js :: terrainClassOf` / `tradeRouteOf` | `terrain.test.js` (definition) | 0 (instrument only) |
| 14 | other NPC | npcGenerator's inline selection | `facts/otherNpc.js :: otherNpcOf` / `hasOtherNpc` | `otherNpc.test.js` | 0 |

`facts/factsOf.js :: factsOf(record)` names all fourteen, read live (no cache). Climate and season: no field, no home (ruling 8).

## What was NOT re-pointed, and why (the chair's to rule)

Each of these is a correct cure by the design's meaning, but it moves births, and the lane's byte-identity law lets a home move none (fact 4's First Landing excepted). Each was measured, then withdrawn:

1. **Militia in `safetyProfile`** (fact 3). `priorityHelpers.hasMilitia` and `defenseFactsOf.hasMilitia` disagree on 130 of soak1k-0..1999; re-pointing moved soak1k-18's record.
2. **DS-GEN-17's PROVISIONED hospital** (fact 3), `generalDeskRead.js`'s `compound.inst.hasHospital` (the birth flag bag's hospital-or-monastery-or-healer-or-friary). Re-pointing to the hospital atom moves 4 of soak1k-0..1999's pages PROVISIONED → BARE (524, 728, 998, 1970); 0 of the 60.
3. **`viability.deriveWaterDependencyAnalysis`** (fact 4) reads the terrain object alone when one is present, so a port route on hills reads dry. Re-pointing moves 4 of 525 golden records and 5 of 60 soak records.
4. **The power step's migration direction** (fact 9, F13's census debt). `governanceNarrative` and `stressFactions` call `migrationDirectionOf(null)` because the power step receives `config.stressTypes`, not the entries. Reading the entry there is a pipeline change (handing the entries to the power step), not a reader re-point. At birth the two agree.
5. **`foodBalance.hasImportProcessor`** (fact 11) asks a different question (which building processes an import) on the raw roster at a generation step. Moving it to the live roster is a birth question.
6. **The ~10 government pattern sites** (fact 8) classify other properties (lawful / anarchic, martial / pacifist, theocracy; `factionDynamics.govIsTheocratic` reads the faction name). None of them asks the ruler kind, so none was retired.
7. **The Economy stores row** (`tonightSheet.foodStoresWords`, fact 2) still takes the food record's months. With the one writer the two homes agree on every save written from now on. A save written before this lane, after a tick, still shows its birth figure there.
8. **The hunger family's "any food-record deficit" member** (ruling 2). It arrived on the window branch (`d175715`, `familyActiveIn`) and now lives in the home unchanged.
9. **`arrivalScene.holdsMarket` and DS-GEN-13's `marketPoolKey`** (fact 5). Chair ruling T1-12 pins the two EQUAL (`tests/generators/arrivalScene.test.js`), both on a name regex under which "Shambles" and "Annual fair" are markets. Retiring one side alone reds the ruled equality. Retiring both moves DS-GEN-13 pages. On born rosters both agree with the home (2,000 of 2,000), so the only difference is authored or legacy names.

## Measurements (window tip `6a9fb3c` vs lane tip, clean worktrees, `soak-review.mjs --workers 4`)

| run | settlements | findings | errors | verdict | classes moved | `coh:*` / `cert:*` |
|---|---|---|---|---|---|---|
| 60 | 60 → 60 | 102 → 102 | 0 → 0 | CLIMB → CLIMB | none | none on either side |
| 1,000 | 1,000 → 1,000 | 1,676 → 1,676 | 0 → 0 | CLIMB → CLIMB | none | none on either side |

`reader:traditions-water` reads **0 at the window base already** (0 → 0). So the First Landing weight's 12 page moves in 60 change no class: the moved pages draw a different land element, and none of them was a finding. A-01 (the famine rule re-point) did not move either. `declared-share` and `cert:false-presumption` do not exist yet: they are wave 1.

**Governing suites.** 187 test files name a module this lane changed. Base: 44 red. Lane: 41 red, 0 new; 3 census staleness reds cured. A fourth new red (`arrivalScene.test.js`, ruling T1-12) was found here and cured by keeping `holdsMarket` (item 9 above).

## Reds owed elsewhere (present at the window tip, not this lane's)

- `tests/property/generatorGoldenMaster.test.js`: 525/525 red at the base (moved by the composed F-lanes, never re-recorded).
- `tests/lint/heldKeyWriterCensus.walker.test.js` A3: `fishTradeTwinned` is undeclared in the assembly step's roster (red at `148a1f9`).
- `typecheck:domain:strict`: `src/domain/coherence/crisisFactFindings.js` +4 (red at the window tip).
- `tests/build/domainGeneratorsBoundary.test.js`: readerBattery → `generators/npc/factionRoleCatalog.js` remains (this lane retired the `viability.js` edge).
- The census- and projection-pinned counts that say 708 (they now read 709; never re-pinned by a lane).
