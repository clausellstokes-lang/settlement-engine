# CENSUS-3: the Economics and Resources lists, the traditions and the hook tables (lane record, 2026-11-04)

> A build seat's record for the chair. The branch is `lane/census-3-2026-11-04`, cut from `lane/census-1-2026-11-04` at `ee3b9c766`. The window branch (`lane/window-rung2-2026-11-04` at `6a9fb3c`) is already an ancestor, and the chair's procedure branch (`lane/census-sop-2026-11-04`) is merged. Pushes are transport only; there is no pull request.
>
> **Phase B (CENSUS-3b, 2026-11-05): units 1, 2, 3 and 5 landed on this branch; unit 4 (the DS pools) and unit 6 (the hook tables) are PARKED with their tools and findings. See "Phase B" at the end.** The phase-A note below is history.
>
> **Where the phase-A seat stopped.** Phase A (annotation) is complete, committed and pushed. **Phase B (apply) was not started.** `lane/census-1b-2026-11-04` had not been pushed at any boundary of this lane (`git ls-remote` was empty at each one), so neither the vocabulary module, the sibling-column schema nor `drawDeclared` exists to apply against. The two-phase rule forbids applying before they land. The next seat starts at Phase B, step 1 below.

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

## Phase B (CENSUS-3b, 2026-11-05)

Base: `6276e1205`, then `origin/lane/census-1b-2026-11-04` at `358b0a841` merged (`4f369fa`), then `origin/lane/window-rung2-2026-11-04` at `3bc72bc0c` (`c3aa387`). `origin/lane/census-sop-2026-11-04` at `3b0d87bc9` was already an ancestor. No generated leaf conflicted at any merge.

**The byte-identity method.** A scratch hasher took sha-256 of the 525 golden configurations' records, of soak1k-0..59's records, and of their rendered surfaces (all tabs, Tonight, the PDF, the Foundry journal), before and after every unit. Red-firsts were run red in a clean worktree of the unit's parent.

### The units

| unit | commit | what | births moved (golden · records 60 · pages 60) |
|---|---|---|---|
| 1 | `0fab7c3` | `factsOf` getters by delegation: `foodSources`, `imports`, `exports`, `culture`, `crime`, `prosperity`. The vocabulary names their atoms: fish, grain, game and livestock; imports and exports; `organised crime` (crime ≥ semi-organized); `culture: <key>`; and the `crime` and `prosperity` bands. The "named but refused" list shrinks to `priest` and `soldiers`, both CENSUS-1c's. `route` and `tier` were already getters. The ledger is re-spelled (table below). | 0 · 0 · 0 |
| 2 | `25f7dda` | The owed DS-ECO claims. DS-ECO-10 established v1 and DS-ECO-12 one-source v3 take `no hunger`. DS-ECO-8 COMFORTABLE v1 takes `no crisis: indebted`. | 0 · 0 · 3 (economics 49, 58; daily_life 22) |
| 3 | `7af3c67` | The A lists: `tradeListDisplay.js`, `tradeListDeclarations.js`, the kind read model, the camel chain's `terrain: desert`, and "What the land offers". | 0 · 0 · economics 49, resources 60, pdf 60, foundry 38 |
| 4 | `3aff73f` | **PARKED.** The apply script and the mute scan are committed; the annex is untouched. | — |
| 5 | `56f6644` | The traditions: three water elements declare `needs`, and the tab filters through `filterDeclared`. | 0 · 0 · traditions 7 |
| 6 | — | **PARKED, not started.** | — |
| R-A (the chair's ruling of 2026-11-05 01:13) | `416bafa` | The leaked author note. `tradeGoodsData.js :: GOODS_MODIFIERS_BY_TIER.metropolis["Printing services"].desc` read "Mass-produced texts (if technology exists)", which presumes a technology level. That has no field and no atom (`magic` is not what it means), so the parenthetical is removed and the row is listed under "needs a field" below. Red-first: `tests/data/tradeGoodsAuthorNotes.test.js`, 1 red → green. | 0 · 0 · 0 (the row's text is printed on none of the 60) |

### The rename table (`_vocabulary.json` → `factVocabulary.js`)

The table is also kept in `_vocabulary.json :: respelledTo`.

- **Renames:**
  - `water: coast | river | navigable` → `coast` | `river` | `navigable`;
  - `food-source: X` → `X`;
  - `crime` → `organised crime`;
  - `food-band: deficit` → `food: ≤ deficit`;
  - `migration: in | out` → `migration: influx | exodus`;
  - `magic: >= low` → `magic level: ≥ low`.
- **Disjunctions:**
  - `watch|garrison|militia` and `garrison|militia` → `guardPresence`. This widens the second (the ruled composite);
  - the single-valued `route: a|b` and `terrain: a|b` → the complement's `excludes`;
  - `institution: temple|institution: monastery` cannot be expressed (a many-valued presence), so it is left undeclared.
- **Not atoms.** Nine pool-level key notes ("act (the key)" and the like) are descriptions, not atoms.

### The chair's rulings recorded at this seat (vetoable)

1. **The luxury class on the page.** It is the 28 ledger labels plus the spellings the page prints for the same goods: Spices, Silk, Gems, Exotic goods, Fine cloth, Quality textiles, Quality textiles and cloth, and `camel_herds`. That list is the instrument's, which is the chair's. Camel herds carries the band here, although the phase-A note left the resource row unbanded.
2. **The category errors leave the lists at the display.** `NOT_A_GOOD` has 21 labels, including the camel chain's "Overland freight revenue". The record's income table is not rewritten (a generation change, golden-moving). Toll Revenue, Entrepôt Trade and Military Contracts already exist as income rows. The other revenues have no income row: open question 3.
3. **`economicState.js`'s suffix copy is not deleted.** Its interim list still feeds the stage-5 military and slave dedupe, so it is not wholly dead.
4. **A DM's authored custom tradition prints as authored.** The water filter holds only generated rows.
5. **The unit-4 apply rulings** are in `3aff73f`'s message and in `_apply_ds_pools.mjs`:
   - food pools take `no hunger`, not `{crisis-scoped}`;
   - Plains v2 drops `grain`;
   - F12's crisis twins in a scoped pool carry `crisis: any`.

### The 60 and the 1,000 (R-B: BEFORE = the merged base `c3aa387`, AFTER = this tip)

Runs: `soak-review.mjs --workers 4`, written to `artifacts/census3b-base` (60) and to `artifacts/census3b-before` and `-after` (1,000).

| class | 60 before → after | 1,000 before → after (settlements / occurrences) |
|---|---|---|
| `reader:scale-lists` (a) `[luxury-imports]` | 13 → 0 | 156 / 156 → **0** |
| `reader:scale-lists` (b) `[~strength-no-house]` | 46 → 0 | 768 / 768 → **0** (the relabel: the instrument no longer reads a claimed-strength list) |
| `reader:traditions-water` | 3 → 0 | 40 / 40 → **0** (the display's share; the weight share, the rows genesis still draws, is CENSUS-1c's and is unmeasured here) |
| `reader:hook-pools` (sea / guard) | 3 / 6 → 3 / 6 | 66 / 50 → 66 / 50 (unit 6 is parked) |
| `coh:crisis-blind-prose` | 24 / 74 → 22 / 71 | 278 / 902 → 231 / 843 |
| · nothing is failing / depends on none alone / a year closed ahead (this lane's claims) | | 34 / 22 / 3 → **0 / 0 / 0** |
| · current stability 538, stable institutional competition 134, competent administration 93, nobody stops a stranger 43, food secure 32, pilgrims 3 | | unchanged. The base's STOP, owned by CENSUS-4 / -2b / -5 / -1c |
| `A-12:self-vouch-false` | 0 → 0 | 18 → 18 (the base's) |
| `coh:food-words` and every other `coh:*` | 0 | 0 → 0 |
| `cert:*`, including `cert:false-presumption` | 0 | 0 → 0 |
| findings · verdict | 176 → 173 · STOP | 2,596 → 2,537 · STOP (the base's STOP classes at the same counts) |

**`declared-share`** reads `{}` before and after. The soak opens the presumption ledger around the BIRTH only, and every declaration this lane landed is drawn at RENDER. A render-wrapped scratch run over 200 births also read `{}`: the render harness loads the modules through vite's own module graph, so its ledger is a different module instance from the one the script opens. That is an instrument gap (open question 4). `cert:false-presumption` over the same render ledger read 0, which is vacuous for the same reason.

### Needs a field (no atom; the undeclared register's row, kept here until the register file exists on this base)

- `tradeGoodsData.js :: GOODS_MODIFIERS_BY_TIER.metropolis["Printing services"]` presumes a technology level. The vocabulary has no technology atom.
- Found by the same test and outside this lane: `institutionServices.js :: INSTITUTION_SERVICES.Mill` "Fulling cloth" "(if water mill)" and "Sawing timber" "(if saw mill)" are CENSUS-4's service table, and `institutionalCatalog.js` "Printing house" "(if technology exists)." is CENSUS-4's catalogue. Neither is cured here.

### Where the next seat starts

**Unit 4.**
1. Run `node docs/census/declarations/_apply_ds_pools.mjs DS-ECO`, then `npm run gen:dossier-prose` and `node scripts/wiring-census.mjs`.
2. Cure the 12 tests that read a declared pool without `facts`. Pass `facts` (`factsAnswered`), or skip a fact-declaring pool where the test's premise is "undeclared". These are:
   - `composeStateProse` ×4;
   - `economyStateProseDesk` ×2 (the STRUGGLING rung);
   - `stateProseKernel` ×3;
   - `dossierStateProseProjection.contract` ×2.
3. Author one crisis-safe twin per `no hunger` food pool, as the chair's ruling with its share. F12's "never mute under a crisis" walker requires it.
4. Do DS-SUP, then DS-POP: one commit each, mute-scanned (`_mute_scan.mjs` / `_mute_diff.mjs`).

**Open questions for the chair.**
1. Unit 4's twins: should each `no hunger` food pool get one crisis-safe line, or should those pools stay out of F12's never-mute walker?
2. Should the ledger's `{crisis-scoped}` on the food pools be replaced by `no hunger`, as this seat ruled at apply?
3. The revenue labels that leave the trade lists with no income row (Cultural tourism revenue, Planar trade access, Coin minting, the logistics and cartography services): should they get income rows (a generation change, golden-moving), or simply drop off the page?
4. Should `declared-share` / `cert:false-presumption` at RENDER go through the soak's render harness (one ledger across vite's module graph), and whose lane is that?
5. CENSUS-4's leaked author notes (Mill "(if water mill)" / "(if saw mill)"; "Printing house (if technology exists)").

**Unit 6.** The hook tables, the record self-check (`storeTrueHooksOnly`), and the `textOf` tolerance at the tension and outlook pools. Check `origin/lane/census-1b-2026-11-04` for 1c's wiring first. Narrow `GUARD_WORDS` past "the old guard".
