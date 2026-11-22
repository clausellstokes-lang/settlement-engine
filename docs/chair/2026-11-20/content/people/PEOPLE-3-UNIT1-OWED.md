# PEOPLE-3: WHAT UNIT 1 (the first half, landed as point 93) STILL OWED (written 2026-11-22T08:04Z)

## 1. HOUSES THE FIRST HALF'S WORDINGS NEED (for the veil reader)
Read from the two census declarations at bd7933433 (`docs/census/declarations/npcStructureVariants.POSITION_VARIANTS.json`, 59 rows; `…CONSTRAINT_VARIANTS.json`, 78 rows). No row needs or excludes a house of a hideable kind (`cardVeil.js :: isHideableHouse`) or a crime fact.
- POSITION_VARIANTS needs: own house ×9 (the card's own house, admitted only where it is stamped `veiled: false` at birth), market ×4, church ×3, court sits ×1, walls ×1, guild ×1, militia ×1. Non-house needs: ruling body ×4, population small ×5 / large ×6, prosperity ≥ comfortable ×3 / moderate ×1, export good ×4, import good ×1. Excludes: crisis ×42.
- CONSTRAINT_VARIANTS needs: own house ×7, guild ×3, church ×3, militia ×3, paid watch ×2, watch ×2, court sits ×2, market ×2, walls ×2, mercenary ×1. Non-house needs: ruling body ×13, ruler: elder ×1, seat outranked ×1, rival power ×1, population small ×4 / large ×4, prosperity ≥ comfortable ×6 / moderate ×3, tier ≥ village ×1, export good ×2, import good ×2. Excludes (houses): paid watch ×3, garrison ×2, mercenary ×2, court sits ×1; and crisis ×60, ruler: priest ×4, seat outranked ×1.

## 2. THE CLASS-TABLE AND VOCABULARY ROWS FOR THE JOIN
- `src/domain/facts/factVocabulary.js :: FACT_DIMENSIONS`: THREE rows, appended by PEOPLE-1's B1 on the seventh chair's ruling 4 (16:41 UTC 2026-11-20): `own house` (home hasOtherNpc, needsContext npc: the card's `institution`, kind house, `veiled === false`), `export good` (home exports), `import good` (home imports).
- `registeredWords.js`, `factLayers.js`, `tests/lint/presumptionClasses.shared.mjs`: NO row (unchanged across point 93).

## 3. THE STORED FIGURES THE LANE MOVED (point 93, 2482e40e3 → bd7933433)
- Pool dominance, ON THE LINE: 19 rows lowered (17 `NPC_STRUCTURE.*` rows from 1 to 0.37–0.50; `ARRIVAL_SENSES.faith.lines` 0.3438→0.3385; `ARRIVAL_SENSES.herbs.dominant` 0.363→0.3616); no row added (the varied lines keep the pool ids `NPC_STRUCTURE.<key>`).
- THE THIRTY ROWS PEOPLE-1's DOOR TIGHTENED, NOT ON THE LINE (the line's side taken at the merge; re-tightened once at the close, not by this seat). Each with the line's ceiling and the lane's (the lane measured on its old base 43ab0f5eb, before the arrival pools were deepened, so several of the lane's readings are HIGHER than the line's ceilings and must not be carried):
  - ARRIVAL_MEMORIES.occupation_legacy	line 0.3903	lane 0.3903
  - ARRIVAL_PEOPLE.mesoamerican	line 0.2046	lane 0.2889
  - ARRIVAL_PEOPLE.norse	line 0.1759	lane 0.2886
  - ARRIVAL_PEOPLE.slavic	line 0.1765	lane 0.3024
  - ARRIVAL_SCENES.ordinary	line 0.1051	lane 0.18
  - ARRIVAL_SENSES.arcane.dominant	line 0.1986	lane 0.3383
  - ARRIVAL_SENSES.arms.dominant	line 0.3246	lane 0.3246
  - ARRIVAL_SENSES.cloth.dominant	line 0.3349	lane 0.3393
  - ARRIVAL_SENSES.faith.dominant	line 0.4127	lane 0.4032
  - ARRIVAL_SENSES.fish.dominant	line 0.1852	lane 0.3404
  - ARRIVAL_SENSES.herbs.dominant	line 0.3616	lane 0.3616
  - ARRIVAL_SENSES.livestock.dominant	line 0.3969	lane 0.3847
  - ARRIVAL_SENSES.smiths.dominant	line 0.1786	lane 0.2632
  - ARRIVAL_SENSES.stone.dominant	line 0.3627	lane 0.3579
  - ARRIVAL_SENSES.bread.lines	line 0.375	lane 0.375
  - ARRIVAL_SENSES.cloth.lines	line 0.3334	lane 0.3334
  - ARRIVAL_SENSES.faith.lines	line 0.3385	lane 0.3385
  - ARRIVAL_SENSES.fish.lines	line 0.4348	lane 0.4348
  - ARRIVAL_SENSES.horses.lines	line 0.3334	lane 0.3334
  - ARRIVAL_SENSES.kilns.lines	line 0.375	lane 0.3334
  - ARRIVAL_SENSES.livestock.lines	line 0.1811	lane 0.2858
  - ARRIVAL_SENSES.stone.lines	line 0.5	lane 0.5
  - ARRIVAL_SENSES.timber.lines	line 0.2609	lane 0.2963
  - POLITICAL_FLAVOR.stable	line 0.1653	lane 0.1653
  - conflicts:HOOKS	line 0.1	lane 0.1
  - foodBalance:OUTLOOK_HOOK_SIBLINGS	line 0.4563	lane 0.4563
  - npcData:STRESS_ECONOMIC_EFFECTS.mutual_leverage	line 0.1394	lane 0.1437
  - npcGenerator:CRIME_KNOWLEDGE	line 0.2536	lane 0.2536
  - stressInstitutionEffects:STRESS_INSTITUTION_EFFECTS	line 0.1514	lane 0.1514
  - record:conflicts.plotHooks	line 0.1	lane 0.1
- The tuning inventory (`tests/lint/.tuning-inventory.json`, re-frozen by its door: "npcStructure.js imports the goals' fillers"); the mutation manifest (the lane's rationale entries); the lighting census (3,736 → 3,741 files, by the chair's door 6197c4c72); the hideable walker's hand list (two tables, f5295e425, by the chair).

## 4. THE +588 RAW OF FIRST PAINT AT POINT 93, FILE BY FILE
Measured: two fresh builds with sourcemaps (2482e40e3, the line at point 92; bd7933433, point 93), each through the gate mutex; the entry's static closure walked as `tests/build/vendorPdfLazy.test.js :: entryStaticClosure` walks it, each chunk's bytes attributed to its source by its map (the script `measures/p3-fp-itemize.mjs`, its output `measures/p3-fp-itemize.out.txt`).
- Closure raw 1,178,915 → 1,179,503: **+588**, ONE chunk (`engine-core`, 309,108 → 309,696), ONE source: **`src/domain/facts/factVocabulary.js` +588** (the three atoms' rows, `own house`, `export good`, `import good`: the vocabulary is eager by design and an atom's reader rides with it). `npcStructure.js` and `src/data/npcStructureVariants.js` add 0 to first paint (lazy side). Sum of source deltas 588 = the closure delta.
- For the owner's size sign-off: a ruled-exception candidate of 588 raw (the chair names it; this seat signs nothing).
