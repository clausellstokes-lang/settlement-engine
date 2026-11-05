# CENSUS-3: the Economics and Resources lists, the traditions and the hook tables (lane record, 2026-11-04)

> A build seat's record for the chair. The branch is `lane/census-3-2026-11-04`, cut from `lane/census-1-2026-11-04` at `ee3b9c766`. The window branch (`lane/window-rung2-2026-11-04` at `6a9fb3c`) is already an ancestor, and the chair's procedure branch (`lane/census-sop-2026-11-04`) is merged. Pushes are transport only; there is no pull request.
>
> **Phase B (CENSUS-3b, 2026-11-05): units 1, 2, 3 and 5 landed on this branch; unit 4 (the DS pools) and unit 6 (the hook tables) are PARKED with their tools and findings. See "Phase B" at the end.** The phase-A note below is history.
>
> **CENSUS-3c (2026-11-05): unit 4 (DS-ECO, DS-SUP, DS-POP) and the revenues (R-P 2) landed; unit 6 is NOT started — CENSUS-3d starts there. See "CENSUS-3c" at the end.**
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
