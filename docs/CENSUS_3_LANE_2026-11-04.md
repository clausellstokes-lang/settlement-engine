# CENSUS-3: the Economics and Resources lists, the traditions and the hook tables (lane record, 2026-11-04)

> A build seat's record for the chair. The branch is `lane/census-3-2026-11-04`, cut from `lane/census-1-2026-11-04` at `ee3b9c766`. The window branch (`lane/window-rung2-2026-11-04` at `6a9fb3c`) is already an ancestor, and the chair's procedure branch (`lane/census-sop-2026-11-04`) is merged. Pushes are transport only; there is no pull request.
>
> **Phase B (CENSUS-3b, 2026-11-05): units 1, 2, 3 and 5 landed on this branch; unit 4 (the DS pools) and unit 6 (the hook tables) are PARKED with their tools and findings. See "Phase B" at the end.** The phase-A note below is history.
>
> **CENSUS-3c (2026-11-05): unit 4 (DS-ECO, DS-SUP, DS-POP) and the revenues (R-P 2) landed; unit 6 is NOT started — CENSUS-3d starts there. See "CENSUS-3c" at the end.**
>
> **CENSUS-3d (2026-11-05): unit 6 landed as 6a (the history hooks) and 6b (the outlook hooks, carried); answers 2 and 3 resolved with no code (the projector has no v0 slot; the roster's taxonomy has no court or bank kind). See "CENSUS-3d" at the end.**
>
> **CENSUS-3e (2026-11-05): the NPC loyalty guard rows declared (`[guard]` loyalty 29 → 0 on the 1,000), `demographic_pressure` split by direction (R-AA), the grain-monopoly hook reworded (R-V measured: `guild` is not settled at the draw). The outlook twins and the timeline roll stay carried (CENSUS-1f has not wired them). See "CENSUS-3e" at the end.**
>
> **CENSUS-3f (2026-11-05): CENSUS-1f merged (the outlook and timeline sites wired by the mechanism lane); unit 3 re-measured (`[sea]` 66 → 0 on the 1,000, no slot emptied); the seven canonical v0 rows declared through the projector's tag slot (`market` ×2, `guild` ×1); R-AJ / R-AL / R-AM / R-AO not landed on 1b, listed as waiting. Nothing of this lane remains but the compose and those four. See "CENSUS-3f" at the end.**
>
> **CENSUS-3g (2026-11-05): CENSUS-1g merged (R-AO, R-AM, R-AJ); DS-ECO-6 v4 declares `guild`; 77 lines marked `colour`; the starving outlook set reworded and twinned once R-AM ledgered it. 3g wrote no section; CENSUS-3h wrote it from the commits. See "CENSUS-3g" at the end.**
>
> **CENSUS-3h (2026-11-05): CENSUS-1g's tip merged (R-AL: 16 history births, 0 empty tension lists); the moderate-gap twin graded by the band the record reads (R-AV: 95 of 1,000, 131 of 525); R-AU not landed on 1b at this seat's boundary, so the 250-class findings on `OUTLOOK_HOOK_SIBLINGS` stay listed as the mechanism lane's. Nothing of this lane remains but the compose. See "CENSUS-3h" at the end.**
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

## CENSUS-3c (2026-11-05)

Base: CENSUS-3b's tip `988a858ed`. Merged, in order: `origin/lane/census-1b-2026-11-04` at `d6f8456be` (`fbe6ce4`; R-J), then `origin/lane/census-5-2026-11-04` at `40f0490ad` (`40285f1`; R-N), then, after unit 4 DS-ECO, `origin/lane/census-1b-2026-11-04` at `ca14125` (`aebd2f6`; CENSUS-1d's R-H disjunction, sites 89, 90, 94, 97–103, 110, 111, and the two declaration registers). The 1b merge conflicted in `factVocabulary.js` / `factsOf.js` and was resolved as a union. At that merge the "named but refused" list is EMPTY, so the three tests that pinned it from one side each were re-pinned to `[]`.

**The base's own reds (R-B: not this lane's).** Every sibling tip carries 709 state pools, but 11 tests in `dossierStateProseProjection.contract`, `composeStateProse` and `stateProseKernel` still pin 708. They are red at `988a858`, `d6f8456be`, `40f0490ad` and this lane's merged base alike. This lane does not re-pin them. The values its units move inside those same red tests are listed by cause in each unit's row.

### Unit 4 · DS-ECO (`e3295d1`)

The step: `_apply_ds_pools.mjs DS-ECO`, then `gen:dossier-prose` with `--check` green, then the wiring census re-taken. The result is 91 lines declared and 6 pools `{crisis-scoped}`. The food pools take `no hunger` on their calm lines (R-K); 12 lines carry it.

**The chair's rulings applied at this seat (vetoable):**

1. **R-B1 at pool level.** Every pool-level `declares` in the DS-ECO/SUP/POP ledger restates its pool's key: terrain ×7, food band ×3, magic ×2, exodus ×2, metropolis ×1. The ledger's own `notes` say so. None is applied, which leaves 12 brace groups unwritten in DS-ECO.
2. **R-B1 at line level.** A line F12 already marks `hunger` does not re-declare `crisis: hunger` through the census channel. This affects DS-ECO-9 SECURE v4/v5, the two places where the ledger gave both. Declaring the fact twice made the calm double contradict the kernel's mark.
3. **R-K: the hunger-safe lines.** Six food pools gain one each. SECURE gains none, because it already carries two (F12's v4/v5). Each line is spelled with F12's `hunger` mark, which is the same spelling as SECURE's siblings on the same desk. R-O names the mark channel as 1d's wave-2 migration. A line marked `hunger` is drawn only under hunger, so it moves only hunger births, about 1/(k+1) of them, where k is the pool's lines admitted under hunger. The granary tile does not render at birth (0 of 200 births carry a stockpile season), so the GRANARY lines move no birth page.
   - FOOD: surplus v4 — "On the counts {settlement} still raises more than it eats. Under the hunger the stores are what the town is drawing on, and the drawing is what gets counted now." Share ≈ 1/2 of hunger births in the pool.
   - FOOD: balanced v4 — "{settlement}'s fields and its mouths came out level before the hunger. Now the stores make up the difference, and the stores are being drawn down." Share ≈ 1/3.
   - GRANARY: well stocked v4 — "The stores went into {season} deep, and the hunger is what they are being drawn down against now." Share ≈ 1/2; no birth page.
   - SURPLUS v4 — "{settlement} raised more than it ate, and what it put by is what the hunger is being met from now." Share ≈ 1/2.
   - PRESSURED v4 — "The food counts were short by a little before the hunger. Under it the shortfall comes out of the stores, and the stores are being drawn down." Share ≈ 1/3.
   - IMPORT-DEPENDENT v4 — "A substantial part of what {settlement} eats is bought, and under the hunger the bought part comes short. The stores cover the gap and are drawn down to do it." Share ≈ 1/3.
4. **R-G / R-L: four complement twins, `no institution: granary`.** The four GRANARY pools are declared `institution: granary` on every line. The key does not guarantee a granary, because the outlook is derived from the stockpile for every place, and 101 of 200 births stand without a granary. So without these twins the tile goes mute for about half of advanced towns, and F12's walker caught exactly that for well stocked. Each twin is the "stores" form of the pool's own first line and is drawn only where the granary lines are refused, so a granary town is byte-identical. Share: all no-granary towns in that band, with no birth page and no granary-town page moved.
   - well stocked v5 also carries `no hunger`;
   - stocked v4;
   - thin v4;
   - nearly empty v4.
5. **The canonicals.** The ledger's seven `*(canonical)*` v0 rows have no tag slot, so they are left as they are. Two of them presume `market` (DS-ECO-3 SHORTAGE / SURPLUS × trade-dependent), and they go to the undeclared register under "canonical, no slot".

**R-N.** The arms that read DS-ECO-8 without facts take `CALM_FACTS_ADMIT_ALL` (stateProseKernel ×3 laws). The economy desk's arms birth through `factsAnswered`, so their fixture towns gain the institutions the drawn lines presume: a granary, and a market square. The projection pin of dimensioned blocks gains DS-ECO-2, by cause.

**The merge of 1d's registers.** They were taken on 1d's base, which holds neither CENSUS-5's declarations nor this lane's, so `aebd2f6` re-takes them with `RETAKE_DECLARATION_REGISTERS=1`. The crisis-scoped register holds 20 pools after that merge (CENSUS-5's 14 and DS-ECO's 6) and 22 after DS-POP.

### Unit 4 · DS-SUP (`3a1bb7a`) and DS-POP (`586bedd`)

- **DS-SUP.** Three lines are declared: `gate`, `magic`, `institution: tavern`. The pool-level `tier: >= metropolis` restates the key, so it is not applied (R-B1).
- **DS-POP.** 17 lines are declared, and two pools are `{crisis-scoped}`: QUANTITY nobody and CANDIDATE decline.
  - The scale lines declare `population: small`, `tier: >= town`, `walls`, `grain`, `market` and the migration direction.
  - Two key restatements are not applied.
  - The script's block match now also takes DS-POP-3's `### DS-POP-3 ·` header.
  - The projection pin of dimensioned blocks gains DS-POP-1, because `walls` is the kernel's word (R-O).

### The revenues (`9e4283e`, R-P 2)

`tradeListDisplay.js :: revenuesOffTheLists` is a display read model; no generated fact is added. It prints a `NOT_A_GOOD` label that the record's lists carry under the income table, in its home's words (`data/revenueHomes.js`), when two things hold: no income row of the same family already speaks for it, and the record holds the fact behind it (`filterDeclared` against `factsOf`).

| home | the lists' labels | needs / excludes | family (already speaks) |
|---|---|---|---|
| Tolls | Toll revenue, Toll income, Trade access fees | `gate`; no `route: isolated` | Toll Revenue, Gate Tolls, River Tolls, Port Duties |
| Transit trade | Transit trade, Pass transit trade, Transit trade profit, Overland freight revenue | no `route: isolated` | Entrepôt Trade + the tolls |
| Market taxes | Market taxes | `market` | Market Taxes |
| Medical care | Advanced medical care | `hospital` | — |

The record holds no share for these revenues, so no figure is invented. The tab, the PDF and the Foundry journal each print one "Also earned, with no share recorded" line.

- **Needs a home** (no atom; these leave the page): Legal services, Advanced legal expertise, Banking services, International banking, Coin minting, Cultural tourism revenue, Planar trade access. The income table has rows of the same kind ("Court Fees & Fines", "Banking Fees"), but no court or bank atom exists to gate a printed line. How often those rows already stand beside the labels was not measured.
- **Not a revenue** (these leave the page): Warehousing and logistics services and Route maps and intelligence, which are imports of a service; Strategic control; Political legitimacy; Massive food requirements.

### The 60, per unit (records 60/60 byte-identical at every unit)

| unit | pages moved (of 60) | classes |
|---|---|---|
| DS-ECO | economics 24, daily_life 9, resources 4 | unchanged |
| the 1d merge (R-H) | 0 | unchanged |
| DS-SUP | 0 | unchanged |
| DS-POP | 0 | unchanged |
| revenues | economics 15, pdf 15, foundry 15 | unchanged |

### The 1,000 (R-B: BEFORE = the merged base without this lane's units, `40285f1` + `ca14125` composed in a scratch worktree; AFTER = `9e4283e`)

Runs: `soak-review.mjs --count 1000 --workers 4`, written to `artifacts/census3c-before` and `artifacts/census3c-after`. Records are 1000/1000 byte-identical.

| class | before → after |
|---|---|
| `coh:crisis-blind-prose` | 189 / 800 → 189 / 800. By claim, the base's STOP is unchanged: current stability, stable institutional competition, competent administration, and "food secure / migration" 32, which is CENSUS-2c's under R-P 1. None of this lane's DS-ECO/SUP/POP claims appears, before or after. |
| `A-12:self-vouch-false` | 14 → 14 (the base's) |
| `coh:food-words` and every other `coh:*` | 0 → 0 |
| `cert:*`, including `cert:false-presumption` | 0 → 0; certification 1000/1000 |
| `reader:scale-lists` | 0 → 0 |
| `reader:traditions-water` | 0 → 0 |
| `reader:hook-pools` | 109 / 112 (sea 66, guard 46) → the same (unit 6 is not started) |
| findings · verdict | 2,490 → 2,490 · STOP (the base's STOP classes at the same counts) |

**`declared-share`**, from the merged render ledger (R-J), before → after:

| surface | before | after |
|---|---|---|
| tab:dossier | 4,967 / 213,783 (0.023) | 12,417 / 213,783 (0.058) |
| tab:economics | 1,421 / 27,595 (0.051) | 1,851 / 28,025 (0.066) |
| foundry:economics | 710 / 12,940 (0.055) | 1,140 / 13,370 (0.085) |
| pdf:economics | — | 215 / 215 (the revenue read) |
| tab:traditions | 0.202 | 0.202 |

**The calm claims under hunger.** The DS-ECO/SUP/POP calm claims under hunger are 0 before and after on the instrument. `coh:crisis-blind-prose`'s regex mirror reads none of these pools' phrases, and that is why 3b's three claims (nothing is failing, depends on none alone, a year closed ahead) were already at 0. The declaration-driven check (`cert:false-presumption`) reads 0.

### Golden / manifest / census / pin rows moved, by cause (never re-recorded)

- **Golden records:** 0 (every change is display-time). Byte identity was checked on soak records at 60 and at 1,000; the 525 golden fixtures were not re-run.
- **The wiring census** (`docs/content/wiring-census.json`): `producerIndexFiles` +1 at each 1b merge, which is the new test file.
- **Registers:** crisis-scoped 0 → 20 (the merge) → 22 (DS-POP); undeclared lines re-taken at the merge, DS-SUP and DS-POP.
- **Pins edited by cause:**
  - the named-but-refused list → `[]` (three tests, at the 1c × 3b merge);
  - the dimensioned-blocks pin gains DS-ECO-2 and DS-POP-1;
  - the mount probe borrows DS-ECO-6;
  - stateProseKernel's DS-ECO-8 arms take the calm double (R-N);
  - the economy desk's fixture towns hold a granary and a market square.
- **Values moved inside the base's own red tests** (not re-pinned, because the 708 pin is red at every sibling tip):
  - variants 2324 → 2334;
  - law-5's compared-pool floor 675 → 641.

### Where CENSUS-3d starts

1. **Unit 6, the hook tables.** Wiring at this tip:
   - **Wired:** `npcGenerator.js` (1c: loyalty, goals, impressions) and `hookLines.js` (1d site 90).
   - **Not wired:**
     - `historyGenerator.js`: the R draw of `HISTORICAL_EVENTS_DATA[].plotHooks`, which is record-time and golden-moving if a row refuses;
     - `foodBalance.js`: the T writers of `economicViability.plotHooks`, including the timber "shipbuilding" row (the `[sea]` sub-case);
     - `safetyProfile.js` (T);
     - `plotHooks.js :: ECHO_PREFIXES` (A).
   - **The order.** Declare the ledger's rows (`docs/census/declarations/hooks.*.json`): 24 history rows, 1 conflict row, 14 loyalty rows, 7 outlook rows and 6 safety rows carry atoms. Where a consumer is unwired, add a `textOf` tolerance (R-C) and do not wire it. 3b's two owed twins (timber without "and shipbuilding", `excludes: navigable`; and the guard-free `crime_wave` hook) need a T branch to resolve at, so they follow 1d's wiring of those sites. `reader:hook-pools` reads sea 66 and guard 46 on the 1,000. `GUARD_IDIOM` already narrows "the old guard".
2. **The canonical rows.** Seven `*(canonical)*` v0 rows have no tag slot. Two presume `market` (DS-ECO-3 SHORTAGE / SURPLUS × trade-dependent) and are listed for the undeclared register.

## CENSUS-3d (2026-11-05)

Base: CENSUS-3c's tip `7112c939b`. Merged: `origin/lane/census-1b-2026-11-04` at `1c00ed2` (CENSUS-1e units 1–2) as `ef4866d`. The merge conflicted in `factVocabulary.js`, `factsOf.js`, three "named but refused" pins, the wiring census and the undeclared register. It was resolved as a union: this lane's `dim()` spelling, 1e's `guild` property and import block, and the pins kept at `[]` with 4b's `guild` asserted. The wiring census was re-taken through `scripts/wiring-census.mjs`, and `gen:dossier-prose --check` is green. The declaration registers were re-taken with `RETAKE_DECLARATION_REGISTERS=1` and equal this lane's side byte for byte.

### Answers 2 and 3 (no code)

- **Answer 2: the seven canonical v0 rows are waiting on the projector (CENSUS-1e).** `generate-dossier-state-prose.mjs` projects a `0. *(canonical)*` row with `marks: []` hard-coded. A tag written on it lands in the TEXT: a trial `` `[market]` `` on DS-ECO-3 SHORTAGE made `economy.generated.js` stale with the backticks inside the sentence. So the annex is unchanged. The declarations the rows want, for when the projector reads a v0 tag slot:

  | row | wants |
  |---|---|
  | DS-ECO-3 SHORTAGE × trade-dependent, "The roads have gone quiet. Little reaches the markets…" | `market` |
  | DS-ECO-3 SURPLUS × trade-dependent, "…the markets are well-fed." | `market` |
  | DS-ECO-6 significant off-book, "…paying duties and guild fees." | `guild` (4b's composite) |
  | DS-ECO-3 ADEQUATE, "Caravans keep to their rounds." | nothing: its pool is `{crisis-scoped}`, so its silence already reads calm |
  | DS-ECO-6 minor shadow; DS-ECO-7 TALLIES and CATALOG (frozen) | nothing beyond the key |

- **Answer 3: court and bank revenues stay off the page, under "needs a home".** The catalogue carries Courthouse, Banking houses, Banking district, Mint and Mint (official), but the roster's KIND taxonomy (`facts/institutions.js :: INSTITUTION_KIND_PATTERNS`, hence `institution: <key>`) has no `court`, `bank` or `mint` kind. So Legal services, Advanced legal expertise, Banking services, International banking and Coin minting have no keyed presence to read. As the chair ruled, the taxonomy is the gap. Adding those kinds is the mechanism lane's (open question 1).

### Unit 6 · the hook tables

| unit | commit | table | consumer (R-C) | rows declared | births moved |
|---|---|---|---|---|---|
| 6a | `cf937ca76` | `historyData.js :: HISTORICAL_EVENTS_DATA[].plotHooks` | **current tensions** (kind A, the table owner's): `historyGenerator.js :: buildHistoricalEvent` filters each tension's whole list through `filterDeclared` against the birth's facts (`factsOf` over the roster, config, tier and power structure) and stores text. **Timeline** (kind R, Appendix B item 12, the mechanism lane's): `generateEventNarrative` reads `lineText(row)`, byte-identical | 12 (below) | soak1k-0..59: 16 of 60. Golden: 60 of 525. 1,000: 214. Every move is inside `history.currentTensions[].plotHooks`, a refused row removed; every other section is byte-identical (sha per section) |
| 6b | `7929c7a0e` | `foodBalance.js :: deriveSupplyRiskAnalysis` (the outlook hooks) | inline T branches (Appendix B item 23, the mechanism lane's). `OUTLOOK_HOOK_SIBLINGS` is CARRIED beside them, keyed by the printed text; nothing reads it yet | 3 sets, 2 twins | 0 (records byte-identical on the 60 and the 525) |

**The twelve history rows:**
- succession_crisis ×2: `no ruler: council`;
- economic_disparity: `tier: >= town`;
- guild_conflict, resource_scarcity, market_crash: `market`;
- crime_wave: `guardPresence`;
- great_flood ×2: `navigable`;
- heresy_trial and pilgrimage_surge ×2: `institution: temple`.

They were measured on soak1k-0..199 before the change (printed / false): 38/15 and 45/22, 14/9, 21/1, 65/28, 1/0, 42/4, 6/4 and 7/3, 6/2, 4/1 and 4/2.

**The outlook sets** (printed / false):
- timber: `navigable` (33/16). The twin is CENSUS-3b's owed one, without "and shipbuilding".
- iron: `institution: smith` (38/3). The twin names no smith.
- starving: `food: ≤ deficit` and `tier: <= village` (8/0). No twin: under `resolveSibling` a refused original keeps its text, so this set serves the self-check only.

### The chair's rulings recorded at this seat (vetoable)

1. **The history migration rows are not declared.** The rows are population_friction ×3 and demographic_pressure ×3. The newcomers belong to the past event (its key), and a live crisis atom would refuse 13 of 14 true hooks. A content question remains: demographic_pressure carries both directions (influx on #0/#2, exodus on #1). That is the template's question, not a declaration (open question 3).
2. **Not re-declared, because each restates its key (R-B1):**
   - the magic rows, which the world law's event gate guarantees;
   - the dam (route river);
   - the blockade (route port, coastal);
   - the bandits (route road).

   The ledger's `river` on the dam was a wrong presumption (R-W): the water home folds a coastal river route into `maritime`, so it refused 3 of 16 true hooks (soak1k-22, -47, -137).
3. **The merchant-guild monopoly is waiting on order (R-Q).** It presumes `guild`, and `guildOf`'s power half is drawn after the economy step. The ledger's `food: ≤ deficit` on it was a wrong presumption: it refused 63 of 82, because the branch keys on the raw import gap, not the band. It is left undeclared.
4. **The safety hooks are guaranteed by their branches, as measured.** These are stateCrime, crimeIsGovt, arcaneBlackMarket and hasSmuggling (`organised crime`, `magic`), at 0 false of 63 printed on soak1k-0..199. They are not declared. The merchant army and the garrison chaplain are already CENSUS-5b's (`SAFETY_LINE_SIBLINGS`), and 1e resolves them.
5. **`ECHO_PREFIXES` is `{colour}`.** This covers both copies: `dossier/plotHooks.js` (A) and `historyGenerator.js` (the R roll beside the hook draw). The five connective prefixes presume nothing. No data-table brace exists yet (the undeclared register covers the state corpus only), so the ruling is recorded here and in the ledger's `colour: true`.
6. **No guard-free `crime_wave` twin (3b's owed twin is withdrawn).** In a tension the refused row simply leaves the list and the other two hooks stand. In the timeline, when it is wired, `drawDeclared`'s argmax over the event's own rows fills the slot. R-G gives a twin only where the slot would otherwise empty.
7. **Two twins are authored, in the house voice. Their golden-moving share is counted at wiring, and is exactly the births whose record refuses the original (a T site has no draw, so there is no 1/(n+1)):**
   - "Something is killing the forest the timber comes from, and the settlement's building trades stall without it. Find another supplier, or find out what is in those woods?"
   - "War breaks out. Metal suppliers prioritize military contracts, and the iron for tools and repairs stops arriving. Economy suffers, population discontent grows."

### The 60 and the 1,000 (R-B: BEFORE = the merged base `ef4866d`, AFTER = `7929c7a0e`)

The runs are `soak-review.mjs --workers 4`, written to `artifacts/census3d-base` and `census3d-after60` (60), and to `census3d-before` and `census3d-after` (1,000).

| class | 60 before → after | 1,000 before → after (settlements / occurrences) |
|---|---|---|
| `reader:hook-pools` | 9 → 6 | 108 / 111 → **96 / 99** |
| · `[guard]` history crime_wave guard captain (this lane's) | 3 → 0 | 12 → **0** |
| · `[sea]` timber "shipbuilding" (this lane's; carried) | 3 → 3 | 66 → 66: enforced when the mechanism lane routes the outlook branch |
| · `[guard]` NPC loyalty (CENSUS-4's table: government #5, military #0, criminal #0 / #6) | 3 → 3 | 29 → 29 |
| · `[guard]` conflict labels "Military/Guard" ×3, the revolt line ×1 (not this lane's) | 0 | 4 → 4 |
| `reader:scale-lists`, `reader:traditions-water` | 0 → 0 | 0 → 0 |
| `coh:crisis-blind-prose` | 2 → 2 | 35 / 35 → 35 / 35 (none of this lane's claims) |
| `coh:food-words` and every other `coh:*` | 0 | 0 → 0 |
| `A-12:self-vouch-false` | 0 → 0 | 3 → 3 (the base's) |
| `cert:false-presumption` | 0 → 0 | 8 / 24 → 8 / 24, **all `rulingStructure:FACTION_DESC_SIBLINGS` `no militia`** (the base's, CENSUS-1e / 5b); 0 on this lane's pools; certification otherwise 1000/1000 |
| findings · verdict | 104 → 104 · CLIMB | 1,738 → 1,738 · STOP (the base's STOP classes at the same counts; hook-pools −12, with occurrences re-binned) |

**`declared-share`:** `history` 1/1 → **670 / 5,178 (0.129)**, the tension lists' notes. Every other surface is unchanged (tab:dossier 12,417 / 213,593; tab:economics 1,851 / 28,025).

### Golden / manifest / census / pin rows moved, by cause (never re-recorded)

- **Golden records (unit 6a, the one cause: a tension's refused hook row removed):**
  - 525 configurations: 60 move;
  - soak1k-0..59: 16;
  - soak 1,000: 214.

  The manifest is 525/525 stale at the base already (its own red, R-B), so the count is this seat's sha per section, before and after.
- **Unit 6b:** 0.
- **The merge:** the wiring census (`dossierMounts.js` stamp, `producerIndexFiles`) was re-taken through its door; the registers were re-taken and equal this lane's side.
- **Pins:** the three "named but refused" pins keep `[]` (the conflict comments were unified), and `factVocabulary.test.js` gains 4b's `guild`.
- **The base's own reds (not this lane's, identical at `ef4866d`):**
  - the governing suites: dossierContent, proseComposed ×4, proseEntryContradiction ×5, generatorGoldenMaster, generalDeskTabFlow, powerSeatRender ×4, recordInvariants, worldFactRederive ×2, customFoodImpact, foodModelSingleWriter ×2, proseWiringCensus ×14, economicsTabFlow;
  - `typecheck:domain:strict` (crisisFactFindings +4, composeStateProse +2).

### Where CENSUS-3e starts

1. **This lane's tables wait on the mechanism lane (CENSUS-1e or its successor):**
   - the timeline hook roll (`historyGenerator.js :: generateEventNarrative`, Appendix B item 12) through `drawDeclared`. Its draw-count care: `splice` at the roll, the ECHO prefix roll keyed on the drawn row's tense, and a resolved row not re-drawn (a draft that shortened the loop moved two births outside the hooks and was withdrawn);
   - the outlook branches through `resolveSibling(…, OUTLOOK_HOOK_SIBLINGS, …)`, which takes `[sea]` 66 → 0;
   - the canonical v0 tag slot (the seven rows above).
2. **CENSUS-4's table:** the NPC loyalty guard rows (29 on the 1,000) are declared in `docs/census/declarations/hooks.NPC_FACTION_LOYALTY.json` and not applied.
3. Nothing else of unit 6 remains on this lane.

### Open questions for the chair

1. Should `court`, `bank` and `mint` join `INSTITUTION_KIND_PATTERNS`? They would be the mechanism lane's, with byte-identity 0 until a line declares them, and would bring back Legal services, Banking services and Coin minting under answer 3.
2. The guild-monopoly hook wants `guild`, but the power half is settled after the economy step. Should R-V's measurement (birth-time `guildOf` against the final record) be taken, or the line reworded to presume only imports?
3. demographic_pressure prints influx and exodus hooks from one template. Should the template be split by direction (content, golden-moving)?
4. The NPC loyalty guard rows: does CENSUS-4 apply them (they are 29 of the 33 remaining `[guard]`)?

## CENSUS-3e (2026-11-05)

Base: CENSUS-3d's tip `2810d360a`. Merged: `origin/lane/census-1b-2026-11-04` at `6e2cb6d` (CENSUS-1e unit 2's T sites and its R-Q cure) as `a38d16f`, with no conflicts. `gen:dossier-prose --check` and `wiring-census.mjs --check` are green, and the declaration registers test is green and unmoved. Re-fetched before unit 3: still `6e2cb6d`.

### The units

| unit | commit | what | births moved (golden 525 · soak 0..59 · soak 1,000) |
|---|---|---|---|
| 1 | `a38d16f` | the merge | 0 · 0 · 0 |
| 2a (answer 4) | `eb4a35f` | `NPC_FACTION_LOYALTY` declares the ledger's 14 rows: `guardPresence` on government #5, military #0/1/3/5/7/10 and criminal #0/6; `institution: temple` on religious #2; `market` on economy #3; `magic` on magic #2/5/6. `drawLoyalty` stores `.text`, and a refused row resolves through `hookVariety.js :: freshAdmittedTwin` (below). | 12 · 7 · 92 (sections `npcs` and `factions[].members[].plotHooks`) |
| 2b (answer 3, R-AA) | `4be7162` | `demographic_pressure`'s hooks declare their direction: the two newcomer hooks `migration: influx`, the departed-properties hook `migration: exodus` | 0 · 6 · 74 (`history` only) |
| 2c (answer 2) | `bc34830` | the grain-monopoly hook is reworded to presume only the imports: "A single importer controls the grain coming in and has raised prices 300%. …" | 38 · 23 · 377 (`economicViability` only) |
| 3 | — | nothing landed: neither the outlook branch nor the timeline roll is wired at `6e2cb6d` | — |

Byte identity was checked with a sha per record section, over the 525 golden configurations and soak1k-0..999, before and after every unit. The before tree is a `git archive` export of the merged base.

### The measurements behind the answers (soak1k-0..999, the draw's facts against the final record's)

- **Answer 4 (R-V):** `guardPresence`, `institution: temple`, `market` and `magic` read at the loyalty draw (`birthFactsOf`) equal the final record's on **14,340 of 14,340** draws. They are settled, so the rows declare.
- **Answer 2 (R-V):** `guild` at the economy step (`birthFactsOf` over the step's roster) differs from the final record on **25 of 1,000** births. Every one of the 25 is false at the step and true at the end, because `guildOf`'s power half is settled later. Of the 377 births that print the hook, 4 differ (soak1k-230, -398, -578, -602). R-V does not hold, so the line is reworded, not declared. CENSUS-3d's `food: ≤ deficit` on it was already withdrawn (a wrong presumption). The ledger row now reads the new text with `needs: []`.
- **Answer 3:** 74 `demographic_pressure` tensions: 58 under a live influx, 16 with no live migration (drawn by the fill), 0 under an exodus. At birth every mass migration is an influx, which is the catalog's direction (`crisis/migrationDirection.js`).

### The chair's rulings recorded at this seat (vetoable)

1. **The registry-aware resolution at the loyalty draw (`freshAdmittedTwin`).** `drawDeclared`'s fallback for a refused line is a hash argmax keyed by the pool alone. That ignores HK-3's settlement registry, so every refused draw of a pool resolves to the same template, which is an avoidable repeat that `drawUnique` exists to prevent. The site's `twin` resolver instead picks, among the admitted templates whose family is unused, the one with the highest hash of `key::drawn::candidate`, preferring an unspoken theme exactly as `drawUnique` does, and registers it. It uses no roll. With nothing fresh it answers `undefined`, and the kernel's argmax decides. It runs only on a refusal, so an admitted draw is byte-identical. This changes the resolution policy at CENSUS-1c's site (no line added under its `max-lines` 1288), so it is listed for the chair. The mechanism lane may lift it into `drawDeclared` as a `used` option.
2. **`demographic_pressure`: no twin.** Under no live migration (16 of 74), all three hooks are refused and the tension prints an empty list. The Plot Hooks collector simply adds no card. A kind-A list drops twin rows, and a fourth plain row would change the timeline roll's domain (item 12 splices the template's list by index), moving every timeline that draws the event. R-G gives a twin only where the slot empties for most births, and 16 of 74 is not most. The description ("through arrivals, departures, or both") and the faction ("The newly arrived or departing") name both directions with an "or" and presume neither, so they are left as they are.
3. **The exodus hook is never true at birth (0 of 74).** R-W would reword a never-true line, but the chair's answer 3 ordered the exodus declaration, and an authored exodus entry is representable (the entry's `direction`). It is declared as ordered and listed as open question 2.

### R-Q / R-V at this seat

- The loyalty rows are R-V (measured settled) and are declared.
- The monopoly hook is R-Q (not settled) and is reworded.
- The migration hooks are read from `config.stressTypes` at the history step, and the birth self-check re-asserts them against the final record: `cert:false-presumption` is 0 on the 1,000.

### Unit 3: carried

The outlook branches (`foodBalance.js`, `OUTLOOK_HOOK_SIBLINGS`, timber and iron) and the timeline hook roll (`historyGenerator.js :: generateEventNarrative`, Appendix B item 12) are not wired at `origin/lane/census-1b-2026-11-04` = `6e2cb6d`. CENSUS-1e's record lists them for CENSUS-1f. `[sea]` stays at 66 → 66.

### The 60 and the 1,000 (R-B: BEFORE = the merged base `a38d16f`, AFTER = `bc34830`)

Runs: `soak-review.mjs --workers 4`. The 60 was written to `artifacts/census3e-base` and `census3e-after60`. The 1,000 was written to `census3e-before` (from the base export) and `census3e-after`.

| class | 60 before → after | 1,000 before → after (settlements / occurrences) |
|---|---|---|
| `reader:hook-pools` | 6 → 3 | 96 / 99 → **70 / 71** |
| · `[guard]` NPC loyalty (this lane's) | 3 → 0 | 29 → **0** (government #5 15, military #0 6, criminal #0 4, criminal #6 4) |
| · `[sea]` the timber "shipbuilding" (carried) | 3 → 3 | 66 → 66 |
| · `[guard]` conflict labels "Military/Guard", the revolt line (CENSUS-4's / not this lane's) | 0 → 0 | 4 → 5. This is a re-bin, not a rise: the instrument reports one guard finding per settlement, and soak1k-614 carried "Military/Guard vs War Council" behind a loyalty row it read first |
| `reader:scale-lists`, `reader:traditions-water` | 0 | 0 → 0 |
| `coh:crisis-blind-prose` | 2 → 2 | 35 / 35 → 35 / 35. By claim: food secure / migration 32, pilgrims queue patiently 3. These are the base's (CENSUS-2c, 2b), and none are this lane's |
| `coh:food-words` and every other `coh:*` | 0 | 0 → 0 |
| `A-12:self-vouch-false` | 0 → 0 | 3 → 3 (the base's) |
| `cert:*`, including `cert:false-presumption` | 0 → 0 | 0 → 0; certification 1000/1000 |
| findings · verdict | 104 → 104 · CLIMB | 1,714 → 1,714 · STOP (the base's STOP classes at the same counts; `reader:*` is kind 9, 3,722 → 3,694) |

**`declared-share`:**

| surface | 60 | 1,000 |
|---|---|---|
| npcs | 165 / 2,658 (0.062) → 318 / 2,658 (0.120) | 2,567 / 42,934 (0.060) → **4,892 / 42,934 (0.114)** |
| history | 34 / 316 (0.108) → 44 / 308 (0.143) | 670 / 5,178 (0.129) → **786 / 5,072 (0.155)** |

Every other surface is unchanged.

### Golden / manifest / census / pin rows moved, by cause (never re-recorded)

- **Golden records** (sha per section, 525 configurations): 2a 12 (a refused loyalty row resolved), 2b 0, 2c 38 (the reworded hook). The two sets do not overlap in section.
- **Soak records, 1,000:** 2a 92, 2b 74, 2c 377. The 60: 7, 6, 23.
- **The manifest, the wiring census, the registers:** unmoved (`--check` green; `declarationRegisters.test.js` green).
- **Pins edited by cause:**
  - `hookTablesDeclared.test.js`'s row pin 12 → 15 (the three migration rows);
  - `hookThemeTotality.walker.test.js` reads the loyalty pool through `lineText` (R-C, byte-identical).
- **The base's own reds, identical before and after, and not re-pinned:**
  - `hookThemeDraws pin:no-hook-is-lost` (860 at the merged base and here, against its pin of 861);
  - `economicStructure` ×2;
  - the governing suites listed at CENSUS-3d;
  - `typecheck:domain:strict` (crisisFactFindings +4, composeStateProse +2).

### Needs a home / waiting

- `court`, `bank`, `mint`: no (R-AC). They stay under "needs a home" with CENSUS-3c's counts (Legal services, Advanced legal expertise, Banking services, International banking, Coin minting).
- The seven canonical v0 rows wait on CENSUS-1f's projector slot (the chair's item 3 of ~04:50).

### Where CENSUS-3f starts

1. When `origin/lane/census-1b-2026-11-04` shows CENSUS-1f's wiring of the outlook branch (`resolveSibling(…, OUTLOOK_HOOK_SIBLINGS, …)`) and of the timeline roll (item 12): merge it, then re-run the 60 and the 1,000.
   - `[sea]` 66 → 0 is expected from the timber twin.
   - Count the births the iron and timber twins move. That count is exactly the births whose record refuses the original, since a T site has no draw.
   - The timeline will also enforce `demographic_pressure`'s directions and 3d's twelve rows. Count the slots that empty under no live migration, because a timeline event of that type with no live migration has every hook refused.
2. When the projector reads a v0 tag slot: declare the seven canonical rows (CENSUS-3d's table: `market` ×2, `guild` ×1).
3. Nothing else remains on this lane.

### Open questions for the chair

1. `freshAdmittedTwin`: keep it at the loyalty site, or lift it into `drawDeclared` as a `used` registry option for every `drawUnique` site (the mechanism lane's)?
2. `demographic_pressure`'s exodus hook is never true at birth (0 of 74), because every born migration is an influx. Is it declared as ordered (as now), or reworded under R-W?
3. The 16 fill-drawn `demographic_pressure` tensions with no live migration print no hooks. Should the fill draw that template only under a live migration (a history draw change, which moves births), or is an empty list acceptable?

## CENSUS-3f (2026-11-05)

Base: CENSUS-3e's tip `de8de790f`. Merged: `origin/lane/census-1b-2026-11-04` at `99b0036` (CENSUS-1f: sites 19/18/15, the arrival redraw-once, the POLITICAL_FLAVOR cascade, OUTLOOK_HOOK_SIBLINGS enforced `4dfb47b`, the timeline roll through `drawDeclared` `cb46c3e`, RULING_POWER_SIBLINGS' door, `sacredHouse`, R-Z's sentence, the canonical tag slot `4818948`) as `f5061f6`, with no conflict. At the merge `gen:dossier-prose --check` and `wiring-census.mjs --check` are green (709 pools / 2,338 variants). `declarationRegisters.test.js` is red with 2 tests, and it is red identically at 1b's own tip `99b0036`: the undeclared register's `fell` 22 / `gone` 156 and the 45 opted pools unpinned are CENSUS-2e's and 1f's declarations. Those are the compose's to re-take (R-T), so they are not re-pinned here. Re-fetched before units 3 and 4: still `99b0036`.

### The units

| unit | commit | what | births moved (records 1,000 · pages 60) |
|---|---|---|---|
| 1 | `f5061f6` | the merge; the census re-taken through its door (`--check` green, nothing to stamp); the 60 as the merged base (`artifacts/census3f-base`) | 0 · 0 (this lane's) |
| 2 | — (this record) | unit 3 re-measured at the wired outlook and timeline sites (below) | 0 · 0 (no twin added, no slot emptied) |
| 3 | `525084d` | the seven canonical v0 rows declare through the tag slot | 0 · 1 (soak1k-30, dossier) |
| 4 | — | R-AJ / R-AL / R-AM / R-AO: none landed on 1b at `99b0036` (listed as waiting, below) | — |

### Unit 2 · re-measured at the wired sites (soak1k-0..999, the merged base's own records)

The outlook hooks (`foodBalance.js`, CENSUS-1f `4dfb47b`) are a T site with no draw, so a twin's share is exactly the births whose record refuses the original:

| set | twin prints (births) | original prints | share of the line's births | of 1,000 |
|---|---|---|---|---|
| timber, `navigable` (3b's twin, without "and shipbuilding") | 153 | 87 | 153 / 240 = 0.64 | 0.153 |
| iron, `institution: smith` (3d's twin, no blacksmiths) | 17 | 172 | 17 / 189 = 0.09 | 0.017 |
| either / both | 162 / 8 | | | |
| starving, `food: ≤ deficit` + `tier: <= village` | no twin: a refused original keeps its text (the self-check's set) | | | |

`navigable` is `waterOf(...).kind !== 'none'` (coast or river), so the timber twin moves only the dry places. `reader:hook-pools [sea]` reads **0 on the 1,000 at the merged base** (66 at CENSUS-3e). The fall is CENSUS-1f's wiring of the twin this lane authored, and it is counted once, on 1f's record. 1f's own count against its base: golden 104 / 525, of which 102 are `navigable` and 19 hooks `institution: smith`.

**The timeline roll** (CENSUS-1f `cb46c3e`, Appendix B item 12) resolves a refused drawn row to the argmax over the template's admitted, unprinted rows. Of 1,927 events within 80 years on the 1,000, **0 print an empty hook list**: no timeline slot empties, so no twin is owed (R-G) and no mute slot is listed. This includes the twelve 3d rows and `demographic_pressure`'s directions.

**The tensions (kind A, this lane's filter).** 16 of 74 `demographic_pressure` tensions print an empty hook list, the only empty tension lists on the 1,000. These are the §10 mute slots R-AL cures at the history draw (`needs: migration`, the mechanism lane's site). They are listed under waiting, below. The lines on the same surface that speak to the condition are the tension's description ("…through arrivals, departures, or both") and its faction ("The newly arrived or departing"). 16 of 1,000 is ≥ 1 in 100, so §10's fill rule would want a line. R-AL removes the slot instead, and a gap line here would be a fourth row in the timeline's spliced domain (CENSUS-3e ruling 2). So no line is written.

### Unit 3 · the canonical rows (`525084d`)

The annex carries the slot (`0. *(canonical)* \`[market]\` …`), `gen:dossier-prose` projects it, and `--check` is green. The receipt is the leaf's `marks` on vid 0, never hand-edited (R-D).

| row | declares |
|---|---|
| DS-ECO-3 SHORTAGE × trade-dependent ("…Little reaches the markets…") | `market` |
| DS-ECO-3 SURPLUS × trade-dependent ("…the markets are well-fed.") | `market` |
| DS-ECO-6 significant off-book ("…paying duties and guild fees.") | `guild`. The pool renders on the final record, so R-Q / R-AN do not bite (4b's composite) |
| DS-ECO-3 ADEQUATE; DS-ECO-6 minor shadow; DS-ECO-7 TALLIES, CATALOG (frozen) | nothing beyond the key, so no slot. ADEQUATE's pool is `{crisis-scoped}`, so its silence already reads calm. They are not marked `colour` because R-AO's spelling has not landed |

None of the three pools goes mute. Each keeps an undeclared sibling: SHORTAGE v3, SURPLUS v3, significant v1 and v2. Red-first: `tests/data/canonicalRowsDeclared.test.js` was 3 red on `f5061f6` and is 8 / 8 green. The 24 suites that read the economy corpus are red on 63 tests before and after, with identical titles (the base's). Two values moved inside them by cause and are not re-pinned:
- the register's `fell` went from 22 to 25 (these three pools: 2 → 1, 2 → 1, 3 → 2);
- `stateProseKernel` law-5's byte-identity list went from 203 to 215 (+12 rows: DS-ECO-6 significant read without facts).

### Waiting (the chair's answers 1–3 and R-AM / R-AO; none on 1b at `99b0036`)

- **R-AJ** (`freshAdmittedTwin` lifted into `drawDeclared`). Not landed, so the loyalty site's local copy stays. When it lands: merge it and hash `npcs` and `factions[].members[].plotHooks` on the 1,000 before and after (byte-identical expected). The merged base's 1,000 per-birth section hashes are kept for that comparison (scratch).
- **R-AK** (the exodus hook stays `migration: exodus`). It is waiting on the pulse: 0 of 74 at birth, and it is unchanged.
- **R-AL** (`needs: migration` at the `demographic_pressure` history draw). Not landed. The 16 of 74 tensions with no live migration (16 of 1,000 births) are the mute slots above. They will move 16 births at the history draw, a history change counted by cause on the mechanism lane.
- **R-AM** (kept-refused originals ledgered). Not landed. On this lane's sets it will make the starving outlook set visible to the self-check: the set has no twin, so a refused original keeps its text. `cert:false-presumption` may then rise on `foodBalance:OUTLOOK_HOOK_SIBLINGS`, and that rise is the instrument seeing it, reported by cause. 3d measured that set at 8 printed / 0 false on soak1k-0..199, so a rise is not expected to be large.
- **R-AO** (`colour` per line). Not landed. The four slotless canonical rows above are its first candidates on this lane.

### The base's own reds (listed, not cured; not this lane's)

| red | at | belongs to |
|---|---|---|
| `hookThemeDraws pin:no-hook-is-lost` 860 against its pin of 861 | red already at `ee3b9c766` (this lane's cut point from census-1) and at 1b's `6e2cb6d`. At the window compose `6d84aa8`, which set the 861 pin, the same suite fails earlier, on the NPC denominator (595 vs 613) | the window / rung-1b compose (`6d84aa8`), which is pre-census. No census lane |
| `economicStructure` ×2: `economicState.js` 909 > its ceiling; the export surface gained `mandatedRoleCandidate` | `2906232` (F1 unit 2, defence claim writers) and `e28f4b1` (F5 unit 2, the institutions band), 2026-11-04 ~12:40 | the window branch's F1 / F5 program, pre-census |
| `typecheck:domain:strict` +4 / +2 | `crisisFactFindings.js` +4 (F13, `57004ae`); `composeStateProse.js` +2 (`bbfc335`, CENSUS-1b wave 1 item 2) | the window branch's F13; CENSUS-1b (the mechanism lane) |
| `declarationRegisters` ×2 | red identically at 1b's tip | the compose (R-T) |
| `typecheck:ratchet` | green (167, ceiling 167) | — |

### The 60 and the 1,000 (R-B: BEFORE = the merged base `f5061f6`, AFTER = `525084d`)

Runs: `soak-review.mjs --workers 4`, written to `artifacts/census3f-base` / `census3f-after60` (60) and to `census3f-before` (a worktree of `f5061f6`) / `census3f-after` (1,000). Records are 60 / 60 and 1,000 / 1,000 byte-identical.

| class | 60 before → after | 1,000 before → after (settlements / occurrences) |
|---|---|---|
| `reader:hook-pools` | 0 → 0 | 5 / 5 → 5 / 5. All 5 are `[guard] "Guard" with no enforcement body` on the conflict labels "Military/Guard" ×4 and the revolt line ×1 (soak1k-110, -462, -470, -571, -614), which are not this lane's. **`[sea]` 0 → 0** (66 at CENSUS-3e, cured by the merge) and **`[guard]` loyalty / crime_wave 0 → 0** |
| `coh:crisis-blind-prose` | 0 → 0 | 0 → 0. CENSUS-3e's base had 35 (food secure / migration 32, pilgrims 3), and they are cured by siblings in the merge; 0 on this lane's claims |
| every other `coh:*`, `A-12:*` | 0 | 0 → 0 |
| `cert:*`, including `cert:false-presumption` | 0 → 0 | 0 → 0; certification 1,000 / 1,000 (no replay mismatch) |
| `reader:scale-lists`, `reader:traditions-water` | 0 | 0 → 0 |
| every finding class | identical | identical (1,662 → 1,662 · CLIMB) |

**`declared-share`** (1,000, before → after):
- history: 1,504 / 10,396 (0.145) → the same. CENSUS-3e's AFTER was 786 / 5,072; the denominator grew with 1f's timeline resolutions, which note the draw.
- npcs: 5,156 / 42,932 (0.120) → the same.
- economics: 388 / 1,771 (0.219); tab:economics 1,851 / 28,025 (0.066); foundry:economics 1,140 / 13,370 (0.085); pdf:economics 215 / 215 → the same.
- tab:dossier: 48,695 → **48,859** / 213,133 (0.228 → 0.229), unit 3's three rows.

**The undeclared register** for this lane's surfaces (statePools, re-taken in a scratch copy and not written, R-T):
- DS-ECO 172 → 169;
- DS-SUP 57 → 57;
- DS-POP 67 → 67.

The whole register re-takes at 1,486 lines / 516 pools against its pin of 2,026 / 672; the difference is the siblings' declarations, which are the compose's. The hook tables (history, npcs, economics) are outside the register, which covers the state corpus only.

### Golden / manifest / census / pin rows moved, by cause (never re-recorded)

- **Golden and soak records: 0.** Unit 3 is display-time; records are 1,000 / 1,000 byte-identical.
- **Pages:**
  - 1 of 60 (soak1k-30's dossier: no guild, so the significant-off-book v1 prints in place of v0);
  - on the 1,000, the dossier draws of a declared line rise by 164;
  - pages beyond the 60's sample were not hashed.
- **The generated leaf:** `economy.generated.js` gains three `marks` arrays (projected, `--check` green). The wiring census and the manifest are unmoved.
- **Pins:** none edited. Inside the base's reds, the register's `fell` went from 22 to 25 and law-5's list from 203 to 215, as above.

### Where CENSUS-3g starts

Nothing of this lane remains but the compose and the mechanism lane's four items. When 1b shows R-AJ, R-AL, R-AM or R-AO:
- **R-AJ:** merge it, then hash `npcs` and the faction members' hooks on the 1,000 (byte-identical expected).
- **R-AL:** count the 16 history births, and confirm 0 empty tension lists.
- **R-AM:** read `cert:false-presumption` on `foodBalance:OUTLOOK_HOOK_SIBLINGS` and on the loyalty pool, by cause. Twin or reword a kept false line under R-G / R-U.
- **R-AO:** mark the four slotless canonical rows `colour`, plus any other read line in this lane's mixed pools.

### Open questions for the chair

1. DS-ECO-6 "a large share off the books" v4 ("The guilds are losing their grip…", dm-only) presumes guilds as much as the canonical row this unit declared. It is DS-ECO's (this lane's annex rows), not in the seven. Should it declare `guild` now (display-time, about 1/4 of that pool's no-guild births), or wait for the compose's mute scan?
2. §10's fill rule (≥ 1 in 100) reads the 16 / 1,000 `demographic_pressure` mute slots as owing a line. R-AL removes them at the draw instead. This seat reads R-AL as superseding the gap line. Is that right?

## CENSUS-3g (2026-11-05; written by CENSUS-3h from the commits, since 3g's report stayed in its transcript)

Base: CENSUS-3f's tip `525084d`. Merged: `origin/lane/census-1b-2026-11-04` at `d2b1ab0` (CENSUS-1g: R-AO `c000dd9`, R-AM `28c6d2a`, R-AJ `d2b1ab0`) as `2b9ee3d`, with no conflict. `gen:dossier-prose --check` and `wiring-census.mjs --check` are green (709 pools / 2,338 variants).

| unit | commit | what | births moved |
|---|---|---|---|
| 1 | `2b9ee3d` | the merge. R-AJ is confirmed by hash: every section of soak1k-0..999, `npcs` and `factions[].members[].plotHooks` included, is byte-identical before and after | 0 |
| 2 | `b6caa5e` | DS-ECO-6 "a large share off the books" v4 ("The guilds are losing their grip…", dm-only) declares `guild` (the chair's answer 1 of 07:2x; R-AD). Red-first: `canonicalRowsDeclared.test.js` 1 red, then 9 / 9 | display-time; records 0; pages on the 60: 0 (tab:dossier declared draws 2,843 → 2,847) |
| 3 | `b1aab0f` | R-AO: 77 lines marked `colour` (read; presumes nothing) through the annex tag slot. These are the four slotless canonical rows (DS-ECO-3 ADEQUATE, DS-ECO-6 minor shadow, DS-ECO-7 TALLIES and CATALOG), 68 of the 73 undeclared lines in this lane's 41 mixed pools, and DS-ECO-7 TALLIES v1–3 and CATALOG v1–3. Red-first: `canonicalRowsDeclared.test.js` 9 red, then 18 / 18 | 0 (colour is silence to the draw; pages 0 / 60) |
| 4 | — | no commit carries a unit 4 | — |
| 5 | `167c957` | R-AM read: the starving outlook set reworded (R-U) and twinned (R-G). Below | soak 1,000: 143 · golden 525: 167 · the 60: 4 pages (`economicViability` only) |

**The five read lines left unmarked at unit 3** (each presumes a fact, so `colour` would be false; they stay in the undeclared register for the compose's reading): DS-ECO-1 C4 v2, DS-ECO-2 FOOD deficit v1, DS-ECO-8 COMFORTABLE v3, DS-ECO-11 fullyExploited v1, DS-POP-1 balance v3.

**The undeclared register after unit 3** (statePools, re-taken in scratch, not written, R-T): DS-ECO 168 → 111, DS-SUP 57 → 51, DS-POP 67 → 54.

### Unit 5 · the starving outlook set (`167c957`)

R-AM's ledger showed the kept-refused starving original false in 162 of the 1,000 births (`tier` 110, `food` 140). Each was later dropped from the record by the hook-truth pass. The loyalty pool read 0 false.

- **R-U:** the original no longer calls the residents "Villagers" ("Its hungriest are turning to banditry"). It now declares only `food: ≤ deficit`.
- **R-G, the chair's ruling recorded here (vetoable):** one twin for the moderate gap (Import-Dependent / Pressured; the chair's ruling 1 of 2026-11-03: a food hook for a moderate gap, nothing for a fed place), with no famine words: "The settlement grows less food than it eats, and a merchant has offered to make up the difference at a price the settlement cannot pay in coin." It excludes `food: ≤ deficit` and needs `food: ≤ pressured`. Its share is the births whose record refuses the original in the moderate band (a T site has no draw): 95 of 1,000.
- **The residue:** a fed place (Secure; 45 of 1,000 at 3g's reading) has no true line, so `resolveSibling` keeps the refused original. The hook-truth pass then drops it, so it never prints. This is the mechanism lane's site policy, which the chair has since ruled on (R-AU, below).
- **Births moved** (`economicViability` only): soak 1,000: 143 (45 reworded text, 95 twin added, 3 starving towns that now keep the hook). Golden 525: 167. The 60: 4 pages. Empty economics hook lists on the branch go from 88 to 38. Red-first: `outlookHooksResolved.test.js` 4 red, then 7 / 7.

3g's three questions and the chair's answers (08:3x): (1) R-AU — the site drops a refused hook with no admitted sibling, and the mechanism lane changes it; (2) R-AV — the twin carries only the severity and category the record holds; (3) the `A-11` finding on the merged base is CENSUS-2f's fish fix (`3386e59b7` on lane 2), not this lane's.

## CENSUS-3h (2026-11-05)

Base: CENSUS-3g's tip `167c957`. Merged: `origin/lane/census-1b-2026-11-04` at `e8b0072` (CENSUS-1g: R-AL `ef551fc`, the rulingStructure fix `12615155`, unit 3c `1425ac7`) as `bfd0958`, with no conflict. `gen:dossier-prose --check` is green. The wiring census was re-taken through its door: 1g's declared columns now count this lane's R-AO `colour` marks, and that is the only diff. Re-fetched at unit 7: 1b is at `5215c43` (CENSUS-1h unit 7, R-AQ `8c6dcab`, and a merge of census-5). R-AU is not in it (neither `foodBalance.js` nor `drawDeclared.js` changed), so it is not merged here: nothing of this lane needs it, and census-5's lane comes in at the compose.

| unit | commit | what | births moved (soak 1,000 · golden 525 · pages on the 60) |
|---|---|---|---|
| 1 | `bfd0958` | the merge; the census re-taken; the 60 as the merged base (`artifacts/census3h-base`) | 16 · 0 · 0 (R-AL, counted at unit 2) |
| 2 | — (this record) | R-AL counted (below) | — |
| 3 | `113a165` | R-AV: the moderate-gap twin graded by the band the record reads | 95 · 131 · 2 (soak1k-10, -15) |
| 4 | — | R-AU not landed on 1b at this boundary | — |
| 5 (unit 7) | this commit | the 60 and the 1,000 as a diff; this record | 0 |

### Unit 2 · R-AL counted (sha per record section, `167c957` against `bfd0958`)

- **Soak 1,000: 16 births move**, in `history` and `generationCoherenceReceipt` only (the receipt hashes the history). They are soak1k-8, -120, -129, -237, -295, -332, -394, -467, -608, -647, -712, -772, -800, -851, -951 and -976.
- **These are exactly the 16 births whose tension list was empty at the base**, every one a `demographic_pressure` tension with no live migration. Births with an empty tension list: **16 → 0**. No mute slot remains, so none is listed for the compose (R-AR: the slot is absent, not mute).
- **Golden 525: 0 move.**

### Unit 3 · R-AV (`113a165`)

`deriveSupplyRiskAnalysis` grades the moderate-gap twin by the band the food record reads at that birth, through the declaration's own reader (`famine.band`).
- **The category** is the band's own label (`FOOD_SECURITY_BANDS`, never re-spelled).
- **The severity** is the band's grade:
  - Import-Dependent `medium`: the record's own grade for that band's viability hook ("A poor harvest somewhere else…");
  - Pressured `low`: the grade under it, because the ladder writes no Pressured hook.
- **The famine-band original** keeps "Survival Crisis / critical".
- **The chair's ruling recorded here (vetoable):** the grade map is this seat's reading of "the band … and the category that band carries".
- **Display:** the Plot Hooks collector prints no severity sub-label below `high` and gives both grades priority 7. On the page the grade change therefore reads as a source label and an order, not as a new mark.

Births whose severity changes (`economicViability` only):

| corpus | Pressured / low | Import-Dependent / medium | total |
|---|---|---|---|
| soak 1,000 | 67 | 28 | 95 |
| golden 525 | 131 | 0 | 131 |

Red-first: `outlookHooksResolved.test.js` 2 red, then 11 / 11.

### Unit 4 · R-AU: not landed

At this boundary the kept-refused residue on `foodBalance:OUTLOOK_HOOK_SIBLINGS` reads **45 births / 45 findings on the 1,000** (6 / 6 on the 60), before and after this seat.
- **Not 250.** The chair's 250-in-161 was the set before CENSUS-3g's reword and twin. The 45 are the fed (Secure) places that keep the refused original, which never prints.
- **Listed as the mechanism lane's (R-AU).** When CENSUS-1h changes the site, 45 → 0 is expected with no page moved, and no twin is owed for the fed case (R-L).

### The 60 and the 1,000 (R-B: BEFORE = the merged base `bfd0958`, AFTER = `113a165`)

Runs: `soak-review.mjs --workers 4`, written to `artifacts/census3h-base` / `census3h-after60` (60) and to `census3h-before` (an export of `bfd0958`) / `census3h-after` (1,000).

| class | 60 before → after | 1,000 before → after (settlements / occurrences) |
|---|---|---|
| `reader:hook-pools` | 0 → 0 | 5 / 5 → 5 / 5. All 5 are `[guard]` conflict labels: lane 4's, cured by R-AW on the mechanism lane. 0 on this lane's pools |
| every `coh:*` | 0 → 0 | 0 → 0 |
| `A-11:sea-words-landlocked` | 0 → 0 | 1 / 1 → 1 / 1. This is CENSUS-2f's fish fix (`3386e59b7`, lane 2), which the compose merges; not this lane's |
| `A-12:*` | 0 | 0 → 0 |
| `cert:false-presumption` | 6 / 6 → 6 / 6 | 45 / 45 → 45 / 45, all `foodBalance:OUTLOOK_HOOK_SIBLINGS`, the fed residue waiting on R-AU (unit 4). No other cause. Certification is otherwise 1,000 / 1,000 |
| `reader:faction-role-fit` / `tension-memory` / `validation-on-page` | 18/25, 4/4, 60/163 (unchanged) | 348/521, 61/61, 985/2,547 (unchanged) |
| findings · verdict | 107 → 107 · STOP | 1,707 → 1,707 · STOP. The base's STOP at the same counts (R-B) |

**`declared-share` on the 1,000** (unchanged by this seat; R-AV re-grades a resolved line and declares nothing new):

| surface | declared / drawn | share |
|---|---|---|
| history | 1,568 / 10,499 | 0.149 |
| npcs | 5,156 / 42,932 | 0.120 |
| economics | 549 / 1,932 | 0.284 |
| tab:dossier | 49,011 / 213,133 | 0.230 |
| tab:economics | 1,851 / 28,025 | 0.066 |
| foundry:economics | 1,140 / 13,370 | 0.085 |
| pdf:economics | 215 / 215 | 1 |

**The undeclared register** (statePools, re-taken in scratch, not written, R-T), at the base and at the tip alike: DS-ECO 111, DS-SUP 51, DS-POP 54. The whole register re-takes at 1,409 lines / 478 pools. The difference from its pin is the siblings' declarations, which are the compose's.

### Golden / manifest / census / pin rows moved, by cause (never re-recorded)

- **Records:**
  - R-AL (the merge): soak 1,000 16, golden 0;
  - R-AV: soak 1,000 95, golden 131 (`economicViability`).
  - The sets do not overlap in section.
- **Pages on the 60:** 2 (R-AV).
- **The wiring census:** re-taken at the merge (the declared columns gain this lane's `colour` marks).
- **The manifest and the registers:** not re-pinned.
- **Pins:** none edited. `outlookHooksResolved.test.js` gains 4 tests.
- **The base's own reds, unchanged:** `typecheck:domain:strict` (crisisFactFindings +4, composeStateProse +2); the reds listed at CENSUS-3f.

### Where CENSUS-3i starts

Nothing of this lane remains but the compose. Two notes for whoever reads it:
- **When R-AU lands**, read `cert:false-presumption` on `OUTLOOK_HOOK_SIBLINGS`: 45 → 0 is expected, with no page moved.
- **The five read-but-unmarked DS lines of CENSUS-3g unit 3** are for the compose's mute and presumption reading.
