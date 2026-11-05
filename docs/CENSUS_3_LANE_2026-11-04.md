# CENSUS-3: the Economics and Resources lists, the traditions and the hook tables (lane record, 2026-11-04)

> A build seat's record for the chair. The branch is `lane/census-3-2026-11-04`, cut from `lane/census-1-2026-11-04` at `ee3b9c766`. The window branch (`lane/window-rung2-2026-11-04` at `6a9fb3c`) is already an ancestor, and the chair's procedure branch (`lane/census-sop-2026-11-04`) is merged. Pushes are transport only; there is no pull request.
>
> **Where this seat stopped.** Phase A (annotation) is complete, committed and pushed. **Phase B (apply) is not started.** `lane/census-1b-2026-11-04` had not been pushed at any boundary of this lane (`git ls-remote` was empty at each one), so neither the vocabulary module, the sibling-column schema nor `drawDeclared` exists to apply against. The two-phase rule forbids applying before they land. The next seat starts at Phase B, step 1 below.

## Phase A: the ledger (`docs/census/declarations/`)

| set | files | pools / tables | rows read | rows declaring | pure-colour pools | crisis-scoped |
|---|---|---|---|---|---|---|
| DS-ECO / DS-SUP / DS-POP (state prose, K) | 18 | 134 | 421 | 126 | 51 | 15 |
| Economics / Resources data tables (A, T) | 8 | 8 | 962 | 384 | 0 | 0 |
| Economics generator lists (A, T, H) | 25 | 25 | 571 | 385 | 0 | 13 |
| Traditions (R, H) | 6 | 6 | 166 | 16 | 3 | 0 |
| Hook tables (H, T, R, A) | 6 | 6 | 231 | 52 | 1 | 0 |
| **total** | **63** | **179** | **2,351** | **1,053** | **55** | **28** |

- **The spelling.** `_vocabulary.json` holds the lane's working atom spelling, one reader per atom. It stands in until CENSUS-1b's `factVocabulary.js` lands, and the apply step re-spells to that module where the two differ. Every atom in all 2,351 rows was checked against it by script, and none is outside it.
- **Atoms with no reader: none.** Five atoms have a reader in the tree that is **not a `factsOf` getter**:
  - `tier` (a record field);
  - `route` (`facts/terrain.js :: tradeRouteOf`);
  - `food-source` (`foodRecord.foodSources`);
  - `culture` (`resolveSettlementCulture`);
  - `crime` (`deriveCriminalStructure`).

  CENSUS-1b's vocabulary must name these, or the apply step cannot declare them (open question 1).
- **Unhomed presumptions** are recorded per row in `notes` and were never invented as atoms. The leading ones are guild, the craft houses with no institution kind (sawmill, tannery, weaver, jeweller, brewer), "staple = grain", climate and season, and the slavery and narcotics content boundaries.
- **The summaries** are in `_ds_summary.json`, `_eco_tables_summary.json`, `_eco_lists_summary.json` and `_mine_summary.json`. They carry:
  - the luxury class (28 labels);
  - the 58 + 13 category-error rows;
  - the both-list goods;
  - the suffix-site and consumer inventory;
  - the hook-string locations.

## Baseline measurements (this base, before any apply)

The base is `ee3b9c766`; runs are `soak-review.mjs --workers 4`.

| class | 60 | 1,000 |
|---|---|---|
| `reader:scale-lists` (a) `[luxury-imports]` | 13 | 156 |
| `reader:scale-lists` (b) `[~strength-no-house]` | 46 | 768 |
| `reader:hook-pools` | 9 (sea 3, guard 6) | 113 (sea 66, guard 50) |
| `reader:traditions-water` | 3 | 40 |
| `coh:*` classes, including `coh:food-words` | 0 | 0 |
| findings / errors / verdict | 102 / 0 / CLIMB | 1,676 / 0 / CLIMB |

**A correction to CENSUS-1's record.** That record reads `reader:traditions-water` at 0 → 0. At this base it is **3 of 60 and 40 of 1,000**. CENSUS-1's First Landing weight left the `tide` and `river` elements at their base weights in dry places, and the 60 shows "The Tide Fair" on a plains road (soak1k-28), "The Fair of the Tide" in the mountains (soak1k-52), and "Tide" at a mountain crossroads (soak1k-17).

`declared-share` and `cert:false-presumption` do not exist until CENSUS-1b's mechanism lands.

## The chair's rulings recorded in this lane (vetoable)

1. **Luxury band: `tier: >= village`.** This follows the instrument's thorp-and-hamlet reading, where the brief's line wrote `>= town`. It is applied to export rows as well as import rows, and it is listed once, in `_eco_tables_summary.json :: luxuryClass`. Hamlet "Quality cloth" is left out of the class, because the band would make its own hamlet row undrawable.
2. **The camel chain declares `terrain: desert` and no culture.** Culture resolution ignores terrain, so a culture atom would hide the chain in a desert of any other culture. There are no yak, llama or reindeer chains in the tables.
3. **The `kind` field is a display read model, not a persisted shape.** Persisted shapes are the owner's class. The apply step derives `{ label, kind }` from the stored suffix at one display reader: the tab renders the mark, and the legend renders only when a transit mark is on the page. Today the "Blue = re-exported transit goods" legend keys on `isEntrepot`. The ~12 consumers that string-match a suffix are listed in `_eco_lists_summary.json :: suffixSites`. The live writer is `computeActiveChains.js :: deriveExportsFromChains`; `economicState.js`'s three suffix sites are overwritten at the chain override.
4. **"What the land offers."** The Resources tab's "Economic strengths" comes from `geographyData.js` terrain data, not `RESOURCE_DATA`. It is relabelled and not filtered, and `reader:scale-lists` (b) stops counting it by its label (the instrument reads the label).
5. **Twins owed (not yet written).** For each, the share is to be measured at apply:
   - the food-balance timber hook without "and shipbuilding" (`excludes: water: navigable`), which is the `[sea]` sub-case on plains and desert roads;
   - a guard-free form of the history `crime_wave` "guard captain" hook, needed where `watch|garrison|militia` is absent.

   Each will be written to `docs/POOL_WRITING_PROCEDURE.md` §3 and §8 and quoted here with its share.

## Phase B: where the next seat starts

1. `git fetch origin lane/census-1b-2026-11-04 lane/window-rung2-2026-11-04` and merge both. Re-spell `_vocabulary.json` to `factVocabulary.js`.
2. The A lists first, because they carry no RNG risk:
   - the imports and exports filtered by the luxury band and the producer atoms (the export wins);
   - the category errors moved to the income table;
   - the `kind` read model;
   - the relabel.
3. The traditions: the Traditions tab prints only admissible rows (R6). No weight moves, so the forked PRNG and its shuffle counts are untouched.
4. The hooks: the self-check re-asserts the record hooks' declarations (R5), and the tension and outlook pools go through `drawDeclared`.
5. The DS pools: tags into the annex, `gen:dossier-prose`, and the wiring census re-taken through its door in the same commit (ruling 10).
6. Then the 60 and the 1,000 against the baseline above.

## Open questions

1. Do `tier`, `route`, `food-source`, `culture` and `crime` become `factsOf` getters, or does the vocabulary admit a field reader?
2. `generational_divide`'s "the old guard" is figurative, but `reader:hook-pools`' `GUARD_WORDS` reads it. Narrow the instrument, or reword the line?
3. `NPC_FACTION_LOYALTY` hooks were declared here because the instrument reads the Plot Hooks tab whole. CENSUS-4 owns the table: does CENSUS-4 apply them?
4. The procedure's water atoms name lake and port, but `waterOf` has only coast, river and navigable (a port route is folded into coast). Is that a gap in the design, or in the procedure?
5. Reader hazards found while annotating:
   - `institution: mill` matches "Access to external mill";
   - `institution: tavern` misses "Ale house".
