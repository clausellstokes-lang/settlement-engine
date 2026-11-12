# THE LAYER MAP: base, facts, lines and effort, by layer

**Seat.** LAYER-MAP is a read-only measuring seat. It ran on 2026-11-12 at `9b5fb174a`, the tip of `lane/coherence-agree-2026-11-11`. Nothing under `src/`, `tests/` or `scripts/` was changed.

**How each count was made.** Every count below names the script that produced it. All the scripts are in this folder, and their outputs are in `results/`. Each count carries one of three labels:
- **EXECUTED:** run over towns.
- **REGEX:** a shape count over source text, not a census of printed lines.
- **READ:** read in source and not run.

**The corpus.** The census's 720 births (`../SECOND-WAVE-CENSUS/births.mjs` and `seeds.txt` on the census lane), re-born at this tip in 46 seconds with 0 errors.

**The one design choice: a layer means value dependence.** A fact's or a line's layer is measured by *what its value depends on*, not *what it touches*:
- `perturb.mjs` deletes, or transplants from two other towns, one stored subtree at a time over 72 towns, and records which facts and which drawn lines change.
- The read-tracer (`facts.mjs`) also records what each function *touches*. Where the two disagree, the gap is itself a finding (section 2c).
- The brief's rule ("one more than the highest layer it reads") is applied to the value-dependence sets.

## 0. The answer in brief

*Items 7–12 (the chair's added measures) follow section 6; the limits are section 13.*

- **Layers.** The town record has five strata (L0–L4). The facts sit on L1–L5. The state-prose pools sit on L1–L5, plus a sixth column, W: desks that read the campaign world rather than the town.
- **Where two answers are born.** Almost always in one of three places:
  - **(a) A line selected at a lower layer than the fact it asserts.** The magic-weight line is L2 while practitioners are L4. The crime desk's capture pressure is L2 while the hall's capture state is L4–5. The beasts row is L1 while the readiness grade is L3.
  - **(b) A generator step that writes text before the fact's home exists.** The governance label is written at `generatePower`, but the defence profile is born at `assembleSettlement`.
  - **(c) One loop in the generator:** roster → economy → powers → roster. It fires in 164 of 720 births.
- **The owner's design already exists as machinery.** This is the "if the dossier has X, the line may or may not be in the pool, several conditions per item" design. It is built from:
  - the closed atom vocabulary (`factVocabulary.js`);
  - the kernel's fail-closed gate (`stateProseKernel.js :: eligibleVariants`);
  - `drawDeclared`;
  - the birth self-check;
  - a shrink-only register of undeclared lines.

  What is missing is three things: **coverage**, **the layer** (nothing says which facts a pool may read), and **vocabulary for the claims about value** (practitioner, capture, a count, a margin).
- **Recommendation.** Three working layers plus the reconciler: P, S, T, and R (section 4). The W desks are their own track.

## 1. THE BASE (layer 0): the rolled structure

**The pipeline's own data-flow contract.** `steps.mjs` (EXECUTED) reads `getStepMeta()` and `getStepOrder()`: 22 steps, each declaring `reads`, `provides` and `mutates` (`results/steps.json`).

**What layer 0 is.** The config, plus every **draw** that reads only the config and other draws.

| base field | home (file :: function, or step) |
|---|---|
| size: `tier`, `population` | `generators/steps/resolveConfig.js` (step `resolveConfig`) |
| terrain, access: `config.terrainType`, `config.tradeRouteAccess` | `resolveConfig`; the facts read them through `domain/facts/terrain.js :: terrainClassOf / tradeRouteOf` |
| culture: `config.culture`, `culturalIdentity` | `resolveConfig`, then `buildGenerationContext` (the culture profile) |
| magic dial, threat, priorities: `config.magicExist`, `config.monsterThreat`, `config.priority*` | `resolveConfig` |
| resources: `config.nearbyResources*` | `resolveResources` |
| crises in force: `stress`, `stressors`, `activeConditions` | `resolveStress`, then `isolationPass` and `stressConfirmPass` (`domain/conditionPromotion.js` promotes them) |
| neighbour: `neighborRelationship` | `resolveNeighbour` |
| the roster: `institutions` | `assembleInstitutions` (+ `subsumptionPass`, `cascadePass`, `isolationPass`, `coherenceRepairPass`), which read only L0 |
| the name | `assembleSettlement :: generateSettlementName` (a draw over culture) |

**Not base, by the contract.**
- **The government and the factions.** They are drawn in `generatePower`, which reads `economicState`, so they sit at L2.
- **The cast** (`npcs`, `relationships`). It is drawn in `generatePopulation`, which reads `economicState` and `powerStructure`, so it sits at L3.

The brief's "the cast if nothing derived feeds it" is therefore answered *no*: the economy and the powers feed the cast.

**The stored derived strata** (`recordLayers.mjs`; each stratum's value is 1 + the highest layer its writing step reads):

| layer | what is stored there |
|---|---|
| **L1** | the economy (`economicState`), `spatialLayout`, `availableServices`, `isolationSupport`, `structuralViolations` |
| **L2** | the powers (`powerStructure`); the defence profile, **by value** (`readiness.mjs`, EXECUTED, 120 towns: readiness and scores change under a transplanted economy in 119/120, roster 115/120, config 120/120, cast **0/120**, powers **0/120**) |
| **L3** | the cast, `history`, `settlementReason`, `resourceAnalysis`, `economicViability` (a bound from the step contract; not measured by value) |
| **L4** | `powerStructure.criminalCaptureState` and `conflicts` (written at assembly from the cast, READ); the stored lines `arrivalScene` and `pressureSentence` |

**The base is not clean at three points** (all EXECUTED, `rosterLoop.mjs` on the 720):

| the loop | births | what it means |
|---|---|---|
| the roster is re-shaped **after** the economy by `factionCorrelationPass`, which reads the powers | **164/720** | roster → economy → powers → roster: the generator's one cycle |
| the economy is re-derived after that change (prosperity or exports differ) | 58/720 | `economyReconcilePass` closes it |
| the government changes after its draw | **0/720** | stable |
| the faction names change after `generatePower` | 660/720 | `neighbourFactions`, the density law, `factionLabelClose`: names, not who rules |

**Four fields are written at assembly from a higher layer into a lower stratum's object** (READ, `assembleSettlement.js`):
- `economicState.safetyProfile.crimeTypes[].desc`, from the powers (`settleCrimeLinesToSignal`);
- `culturalIdentity.foodways`, from the economy (`foodwaysLineOf`);
- `powerStructure.criminalCaptureState`, from the cast (`writeHallCapture`);
- `conflicts`, from the cast (`generateConflicts`).

## 2. THE FACTS BY LAYER

**Sources.**
- **Value layers:** `perturb.mjs` (EXECUTED, 72 towns spanning six sizes, calm and all 15 crises, 0 site throws; `results/perturb.json`).
- **Read sets:** `facts.mjs` (EXECUTED read-tracer, 120 towns; `results/facts.json`).

A fact's layer is 1 + the highest stored layer its value depends on.

### 2a. The leaves of `src/domain/facts/`, the class table's other homes, and every vocabulary atom

| layer | facts (value) | count |
|---|---|---|
| **L1**: base facts | terrain, route, water, culture, magic (dial: functions and level), `magicDialAbsent`*, tier, populationBand, hasInstitution (14 kinds), market, sacredHouse, defence (walls, palisade, gate, watch, militia, garrison, mercenary, commander, court, prison, hospital, healer), guardPresence, soldiers, commander, migration, warState (no world handed), the crisis kinds, `canonStressors`* | 17 leaves (+2*) |
| **L2**: over the economy | crisis (its **families**), famine and food band, starving, foodSources, storesMonths, `foodEnduranceOf`, imports, exports, prosperity, `magicDependents`; the stored defence readiness | 9 (+1 stored) |
| **L3**: over the powers | rulerKind, guild, crime (`deriveCriminalStructure`), `crimeSignalOf`, faith (`faithReadingOf`; the priest atom) | 7 |
| **L4**: over the cast | `magicPractitioners`, `deriveMagicReliance`, hasOtherNpc; the stored capture climate | 3 (+1 stored) |
| **L5** | `hallCaptureOf` (the hall card's state: the cast plus the stored capture climate) | 1 |

\* traced in `facts.mjs` only; not in the perturbation set.

**The vocabulary's 51 dimensions** (`FACT_DIMENSIONS`: 43 presence, 7 band, 1 crisis; every one has a reader) **by layer, EXECUTED:**
- **L1:** 34 (walls, gate, watch, market, temple, docks, institution, crisis, migration, war, terrain, route, port, culture, magic, tier, population, magic level, …).
- **L2:** 11 (imports, exports, famine, starving, fish, game, grain, livestock, food, stores, prosperity).
- **L3:** 5 (guild, organised crime, ruler, crime, priest).
- **L4:** 1 (other npc).

The bare perturbation could not test nine of them, because they need a comparator or a key: the seven bands (tier, population, magic level, food, stores, prosperity, crime), magic and priest. These take their home fact's measured layer. *(An earlier draft of this file said "47 dimensions"; that was a miscount, corrected here.)*

### 2b. The eleven twice-derived facts, by the layer of each derivation

| fact | derivation 1 (layer) | derivation 2 (layer) | where the second answer is born |
|---|---|---|---|
| fed / bought in | food label → DS-ECO-9 key (L2) | the food record → `EconomicsTab :: foodSentence` (L2) | **equal layer**, two fields of one stored object; the key reads the narrower field |
| stores months | `storesMonthsOf` (L2) | `foodEnduranceOf` → `foodEnduranceLine` (L2 → line L3) | **equal layer**, two quantities, one question |
| magic here | the magic dial (L1) | `magicDependents` (L2); `magicPractitioners` (**L4**) | **three layers**: a line at L1 or L2 asserts what only L4 knows |
| hall in criminal hands | `hallCaptureOf` (**L5**; stored climate L4) | `capturePoolKey`, DS-POW-6 pools (**L2**, read off `safetyProfile`) | the desk line sits **three layers below** the fact |
| how crime is organised | `crimeSignalOf` (L3) | `deriveCriminalStructure`'s name ladder (L3) | **equal layer**, two predicates |
| imports | `primaryImports` → the imports fact (L2) | `EconomicsTab`'s inline list (+ `resourceAnalysis.imports.critical`, stored L3 → L4) | **higher** layer on the page |
| founder | `history.founding.foundedBy` (stored L3) | `founding.reason` (stored L3) | **equal layer**, siblings drawn apart in one step |
| beasts readiness | the readiness grade, DS-DEF-1 (**L3**) | the beasts row's situation, `beastsRowPoolKey` on `monsterThreat` (**L1**) | the line reads the base threat, not the grade |
| the powers | the contenders (L3) | the roster section (L3) | **equal layer**, two lists over the same factions |
| defence posture | `defenseProfile.readiness` (L2 by value; **born at `assembleSettlement`**) | `deriveBaselineStability`'s `militaryEffective` (written at **`generatePower`**) | **step order**: the home does not exist when the label is written |
| a house is here | the roster, `hasInstitution` (L1) | `chainFlowFacts`' first-word test (L1) | **equal layer**, two predicates |

**The five missing leaves, and the layer each would take** (READ, from what each must read):

| missing leaf | what it must read | layer |
|---|---|---|
| presence on a card | the roster | **L1** |
| imports as printed | `primaryImports` (+ `necessityImports`) | **L2** (L4 if it keeps `resourceAnalysis.imports.critical`) |
| beasts readiness against threat | the readiness grade (L2) + `config.monsterThreat` (L0) | **L3** |
| the list of powers | `powerStructure.factions` | **L3** |
| the founder | `history.founding` | **L4** |

### 2c. Cycles, and reads of an equal or higher layer

**No cycle among the fact leaves** (`facts.mjs`'s dependency walk found none). The cycles and higher-layer reads are elsewhere.

1. **The generator's one cycle.** roster → economy → powers → roster (`factionCorrelationPass`). It fires in 164/720 births and is closed by two reconcile passes. The economy moved in 58/720; the government in 0/720.
2. **The four back-writes at assembly** (section 1). Each puts a higher-layer value inside a lower stratum's object.
3. **Leaves that bundle two layers.** Their reads exceed their value:
   - `defenseFactsOf` computes walls, gate and watch (L1 by value) in the same object as the stores figure (L2). So every walls atom *touches* the economy (`facts.mjs`: reads `economicState.foodSecurity`).
   - `factsOf.crisis` answers the **hunger family** from the food band (L2), not from the crises in force (L0). The base's crises and the crisis fact can therefore give two answers.
   - `faithReadingOf` touches the cast (traced) but its value depends only on config, roster, income and factions (L3).
4. **Equal-layer twins.** Five of the eleven (2b): two predicates over one stratum, neither reading the other.
5. **Lines that read lines.**
   - Two pool keys take another pool's key as input: `foodMeansPoolKey(foodRecord, securityKey)` and `criminalStructurePoolKey(structureKey)`.
   - Two corpus blocks read stored lines: DS-GEN-5 (`arrivalScene`) and DS-REL-2 (`prominentRelationship.phrasing`).
   - The summaries quote stored lines: `domain/summary/tonightSheet.js`, `settlementQuickGuide.js`, the Overview and Summary tabs, the PDF and the Foundry journal read `pressureSentence` or `arrivalScene` (REGEX, 15 files).

## 3. THE LINES BY LAYER

### 3a. The state-prose corpus: 69 blocks, 856 pools, 2,779 variants

**The declaration counts** (`corpus.mjs`, EXECUTED, with the repository's own `declarationRegisters.js :: statePoolCounts`):
- **665** variants declare: fact atoms or kernel dimension words in their marks.
- **359** are colour lines.
- **412** undeclared lines remain, in 138 pools. This matches `tests/lint/undeclaredLines.register.json` exactly: 138 rows, 412.
- **718** pools are fully answered: 390 pools are ruled `{colour}`, 67 `{crisis-scoped}`, and 61 carry a declares group.

**This corrects the class table's "0 of 2,779 carry a needs declaration".** The corpus does not spell `needs`; it declares through `marks` and brace groups, and the kernel enforces them.

**The pools by layer** (`assemble.mjs`, `results/layers.json`). How each pool's layer was found:
- **210 MEASURED:** drawn in the 72-town perturbation; the layer is 1 + the highest stored layer its key, its eligibility or its slots depend on.
- **197 INFERRED:** undrawn, but in a drawn block; the layer is the block's highest measured pool.
- **193 STATIC:** the block is never drawn by the public-prose sites; the layer comes from the block title's declared fields (READ).
- **235 W:** the block reads the campaign world.
- **21 UNKNOWN:** DS-GEN-10, DS-HK-1 and DS-GEN-15 declare no fields.

| layer | pools | variants | of which undeclared lines | measured / inferred / static |
|---|---|---|---|---|
| **L1** | 115 | 405 | 72 | 50 / 60 / 5 |
| **L2** | 197 | 614 | 110 | 83 / 71 / 43 |
| **L3** | 116 | 373 | 0 | 48 / 47 / 21 |
| **L4** | 161 | 533 | 96 | 29 / 19 / 113 |
| **L5** | 11 | 47 | 4 | 0 / 0 / 11 (DS-GEN-2 conflicts; DS-GEN-5 and DS-REL-2, lines over stored lines) |
| **W**: campaign world | 235 | 735 | 124 | world (war, treaties, faith states, ledgers) |
| **?** | 21 | 72 | 6 | — |
| **total** | **856** | **2,779** | **412** | |

**By desk:**

| desk | L1 | L2 | L3 | L4 | L5 | W | ? |
|---|---|---|---|---|---|---|---|
| economy | — | 82 | — | 39 | — | 5 | — |
| defense | 30 | 66 | 68 | 9 | — | 11 | — |
| general | 5 | 24 | — | 108 | 11 | 35 | 21 |
| power | — | 16 | 46 | 5 | — | 20 | — |
| stressors | 80 | — | — | — | — | 32 | — |
| warFaith | — | 9 | 2 | — | — | 132 | — |

**The key layer against the pool layer.** Of the 210 measured pools, 197 sit at their key's own layer. 13 are raised by a slot or by the text drawn over the same key:
- DS-DEF-2 Invasion & War ×3, and DS-DEF-5's arcane row: L3, by the defence profile;
- seven DS-DEF-4 and DS-DEF-5 rows: L2, by `economicState.compound`;
- DS-FTH-2 and DS-POW-5 `crimeIsGovt`: L3, by the powers.

The key layer here is approximated by the subtree that decided the key.

**Pool-key functions:** 151 exported in `src/domain/display/stateProse` (REGEX). 120 desk lenses were observed drawing.

### 3b. Lines outside the corpus (REGEX shape counts, `sources.mjs`, `results/sources.json`)

**The literals.** A literal is a string or template of three words or more, or JSX text, not an object key.

| root | literals | of which state-prose files |
|---|---|---|
| `src/data` | 11,845 | 3,023 |
| `src/generators` | 3,000 | — |
| `src/domain` | 17,694 | 500 |
| `src/components` | 5,404 | — |

The class table's counts (12,606 / 3,643 / 18,209 / 4,930) used its own `habitat.mjs`. That script is **not on the census lane** (`git ls-tree` finds no `habitat.mjs` there), so its definitions could not be re-run, and the two sets of counts differ by definition.

**When a generator-time line can be drawn.** Each `src/data` and `src/generators` file was placed at the **earliest pipeline step whose import closure reaches it**. That is an over-approximation: a file may be reached early but drawn later. The step sets a **ceiling** on what such a line can read.

| `src/data` literals | ceiling | earliest step |
|---|---|---|
| 3,344 | L0 | resolveConfig, buildGenerationContext, resolveResources, resolveStress, assembleInstitutions |
| 283 | L0 | generateEconomy |
| 28 | L1 | generatePower |
| 4,290 | L2 | generatePopulation 3,270; generateNarratives 1,020 |
| 75 | L3 | assembleSettlement |
| 802 | — | display-time |

| `src/generators` literals | ceiling |
|---|---|
| 899 | L0 |
| 628 | L1 |
| 1,066 | L2 |
| 167 | L3 |
| 240 | display-time |

**The largest files, by step:**
- `people/titleSecretsPresentations.js`: 1,832 (generatePopulation)
- `institutionServices.js`: 988 (resolveResources)
- `npcData.js`: 977 (generatePopulation)
- `institutionDescVariants.js`: 668 (assembleInstitutions; pattern 10's file)
- `goalFamilies.js`: 530 (generateNarratives)
- `narrativeData.js`: 225 (generateNarratives; pattern 7a and 7b's file)

**`src/domain` and `src/components`:** 12,752 + 5,404 literals are display-time. They read the finished record, so they can read any layer.

**Lines that read lines** (section 2c, item 5): 2 pool keys, 2 corpus blocks, and the summaries.

**The composers:**
- `weaveBlock` (2 call sites);
- `composeStateProse` / `composeStateProseMount` (39 call sites, REGEX);
- `aliasRepeatedRungs`;
- `resolveSiblingSentences`.

All of them sit above what they join (section 6).

## 4. THE EFFORT BY LAYER

### 4a. The 25 patterns in layers

**Column guide.**
- **Fact L:** the measured layer of the fact the line asserts.
- **Line L:** the layer the line is selected at today.
- **Condition:** *has / has-not* on a base fact, or a *value* (a band) of a derived fact.
- **M / A:** mechanical (scriptable from the vocabulary) or authored.

| # | cl. | fact L | line L | condition the line needs | M / A | needs first |
|---|---|---|---|---|---|---|
| 1a, 1b | B | 2 (food record) | 2 (key on the label) | value: the record's sources and balance | A (new bought-in lines) | — |
| 2 + 20 | A, B | 2 (stores), 1 (siege) | 3 (composer) | value: stores; has: siege | A (one sentence) | — |
| 3 | A | 4 (practitioners) | 1–2 | has: practitioner | A | an L4 atom `practitioner` |
| 4 | B | 3 (standing vs the leader) | 3 (composer) | value: margin to the leader | A + register the words | — |
| 5a | A | 4–5 (capture) | 2 | value: stored capture state | M (say nothing at none) | a capture atom at L4 |
| 5b | A | 3 | 3 | the signal outranks the ladder | M | — |
| 6 | A | 2 | 2 / 4 | one list | M (the leaf) | the imports leaf (L2) |
| 7a | A | 4 (founder) | 3 (step) | has: the founder's kind | A (twins) | the founder leaf |
| 7b | B | 1 (water, docks) | 3 (step) | has: docks / navigable | M (declare) + A (twin) | — |
| 8 | B (+A) | 1 (sacred house), 3 (faith) | 2 | has: sacredHouse | M (declare) + A (access wording) | — |
| 9 | A | 3 (grade) | 1 (threat) | value: grade | A (settled-and-weak) | beasts leaf (L3) |
| 10 | B | 1 (gate) | 0-ceiling step (assembleInstitutions) | has: gate | M (declare) + A (twin) | — |
| 11 | B | 1 (chain flags) | 1 | value: resource / substitute / bought | M (carrier leaf) | — |
| F4 | B | 1 | 1 (same step) | has: the working | A | — |
| 13 | C | — | 2 (DS-DEF-9) | — | A (one line) | — |
| 14 | B | 1 (size) | 2 (food) | band: population | M (declare and draw) | — |
| 16a | B | 3 (the seat list) | 0 (a fixed title) | value: count | M (count what is listed) | — |
| 16b | A | 3 | 3 | two lists, two names | M | powers leaf (L3) |
| 17 | C | — | — | display leaf | M | — |
| 18 | C | 1 | — | display leaf | M | — |
| 19 | C | — | 4 (viability) | — | A (one line) | — |
| NEW-1 | A | 2 (readiness, at assembly) | 2 (at generatePower) | value: readiness | A + **step order** | the readiness leaf before the label, or the label moved to assembly |
| NEW-2 | B | 4 | 2 | has: practitioner | M (declare) + A | the `practitioner` atom (L4) |

**The habitat by layer.**
- **The 412 undeclared corpus lines:** L1 72, L2 110, L3 0, L4 96, L5 4, W 124, ? 6.
- **The registered-thing namings in the corpus** (`guardCount.mjs`, EXECUTED with the walker's own `thingsNamedIn`): 258, of which **89 are undeclared**. Every registered thing is an L1 fact except `guildhall` (L3); `prison` and `court` have no atoms yet.
- **The class table's habitat outside the corpus** (2,330 undeclared pairs; 711 state, size and count literals; 247 bare picks): placed by root.
  - `src/data` and `src/generators` lines are bounded by their step (3b). Their declared atoms: 698 (REGEX, `stepReads.mjs`), of which **38** ask for a fact above their file's earliest step ceiling (20 are the per-NPC `other npc` atom drawn while the cast is made).
  - The `src/domain` and `src/components` literals read the finished record, so they can sit at any layer, and their vocabulary is not registered.
- **The pickers at this tip** (REGEX):
  - declared: `drawDeclared` 31, `filterDeclared` 8, `drawAdmitted` 6, `agreeingLine` 2;
  - bare: `pick(` 140, `.pick(` 56, `pickRandom` 16, `pickVariant` 12, `offset %` 4.

### 4b. How many layers: THREE working layers and the reconciler (P, S, T + R), with the world (W) as its own track

Six measured strata exist (L0–L5). They fall into three kinds of condition. That kind is what divides the effort, so finer layers buy nothing.

| band | facts it reads | the condition | how it is written | pools / variants (corpus) | what must exist first |
|---|---|---|---|---|---|
| **P (primary)** | L1: roster presence, terrain, route, water, crisis kinds, size, culture, the magic dial | has / has-not | **mechanical**: the atoms exist (31 L1 dimensions); the walker's matcher finds the words; tag, then twin or colour | 115 / 405 (72 undeclared) | split `defenseFactsOf`'s L1 bits from the stores; give `prison` and `court` atoms; register states and sizes |
| **S (secondary)** | L2–L3 over the economy and the powers: food band, stores, imports, prosperity, readiness, ruler, guild, crime, faith | a value or band of a derived fact | **half mechanical** (bands exist: food, stores, prosperity, crime), **half authored** (splits like 1a; the standing margin of 4) | 313 / 987 (110 undeclared) | the L2 and L3 leaves: imports as printed, beasts readiness, the list of powers |
| **T (tertiary)** | L4–L5 over the cast: practitioners, capture, the founder, a second NPC | has or value on a cast-derived fact | **authored**; no atom exists yet for practitioner, capture state or founder | 172 / 580 (100 undeclared) | the atoms `practitioner`, `capture`, `founder`, and their leaves |
| **R (reconciler)** | lines | after selection | **mechanical** (section 6) | the woven mounts | — |
| **W (world)** | campaign `worldState` | its own base | out of the town layers | 235 / 735 (124 undeclared) | a base map of the world record (not measured here) |

### 4c. How the three class lanes work through the layers, primary first

1. **W2-A-LEAVES makes the layers exist.** In order:
   - the fact-layer table and the guard (section 5);
   - the **P** leaf repairs: split `defenseFactsOf`; read the hunger family from the crises in force or name it L2; presence on a card;
   - the **S** leaves: imports as printed, the one stores sentence, beasts readiness, the list of powers;
   - **NEW-1's step order;**
   - the **T** leaves and atoms: practitioner, capture, founder.

   File split across seats: each new leaf is its own file. `factsOf.js` and `factVocabulary.js` are shared registries, so **one** A seat holds both and the other seats hand in rows.
2. **W2-B-DECLARE declares band by band, behind A.**
   - **P (mechanical):** the 89 undeclared thing-namings and the 72 L1 register lines; the 3 strip sites; patterns 7b, 10, 14 and 8's declare half.
   - **S:** 1a and 1b, then 4 and 16a with their words registered.
   - **T:** NEW-2, 3's wording, 7a, after A's atoms.

   The corpus document and its six generated files are **one** file family and one seat. B's generator-side pools are separate files and can be split one per seat: `cultureProfiles.js`, `institutionServices.js`, `institutionalCatalog.js`, `historyData.js`, `stressInstitutionEffects.js`, `narrativeData.js`, `institutionDescVariants.js`, `foodGenerator.js`.
3. **W2-C-LEAVES is layer-free.** Class C is display text. Its files (`SupplyChainsPanel.jsx`, `EconomicsTab.jsx`, `institutionDisplayName.js`, `tradeListDeclarations.js`, `viability.js`) are disjoint from A's leaves and B's corpus, so it runs beside both from the start. It rebases once on A's imports leaf.
4. **No two seats hold one file** if:
   - A has one registry seat plus one seat per leaf;
   - B has one corpus seat plus one seat per generator data file;
   - C has one seat.

## 5. THE GUARD THAT MAKES A LAYER REAL

**Where the layer is declared.**
- **On a leaf:** a `layer` field on each dimension of `src/domain/facts/factVocabulary.js :: FACT_DIMENSIONS`, beside `home` and `reader`. The module stays import-free (its law). Every atom's layer then has one home, and the kernel and `drawDeclared` already route every condition through it.
- **On a corpus pool:** a brace ruling `{layer N}` in `docs/content/RECEIPT_POOLS_DOSSIER_STATE.md`. The generator already projects brace rulings into `poolMeta` (`declares`, `crisisScoped`, `colour`).
- **On a generator pool:** the draw site's step (the pipeline's `getStepMeta`), so no new declaration is needed.

**What the walker extends.**
- **Arm 1**, beside `tests/lint/wiringCensusDeclared.walker.test.js` and `domain/facts/declarationRegisters.js` (shrink-only, the same door): **red** a pool any of whose variants declares an atom of layer ≥ the pool's layer, or names a registered thing whose atom layer is ≥ the pool's layer without declaring it.
- **Arm 2**, beside `tests/lint/presumedThings.shared.mjs`'s ARM 1: **red** a generator-time declared atom whose layer exceeds its draw step's ceiling + 1.
- **The pin on the table:** `perturb.mjs`, cut to a fixed grid of about 24 seeds, re-measures every leaf's value layer. A leaf measured **above** its declared layer reds; the table is re-taken only by its door.

**Today's violations, to bank shrink-only:**

| arm | count | how it was counted |
|---|---|---|
| corpus, registered things | **7** variants in 5 pools (of 89 undeclared namings) | EXECUTED, `guardCount.mjs`; e.g. `DS-DEF-8::override: WAR FOOTING` ×3, `DS-STR-1::UNDER OCCUPATION` (a garrison) |
| corpus, every undeclared line, by layer | **412** | the existing register; each row gains its layer |
| generator, atoms above the step ceiling | **38** | REGEX, `stepReads.mjs`: 20 `other npc`, 14 `guild`, 3 `ruler`, 1 `organised crime`; an over-count bounded by import reach |
| leaves bundling two layers | **2** | `defenseFactsOf`; `factsOf.crisis`'s hunger family |
| back-writes at assembly | **4** | section 1 |

**What the guard cannot see yet.** The class B patterns that matter most (3, 5a, 8's weight, NEW-2) assert facts **no registered word names**: a practitioner, a capture, a weight. The arm reds them only once those words are registered, which is ruling 2's ratchet. So the 7 is a floor.

## 6. THE RECONCILER

### 6a. What joins or weaves chosen sentences today (READ)

- **`stateProse/weaveBlock.js :: weaveBlock`.** Already a reconciler by contract: "it adds not one authored word". It:
  - joins the drawn sentences with one space;
  - stands a repeated opening *settlement name* down to the tier noun, or to "It" where the line already names a tier;
  - draws nothing and reads no seed.
- **`stateProse/composeStateProse.js :: composeStateProse`:** a spine plus modifiers with `CONNECTIVES`. It is block-local, and its candidate leaves are empty ("authored for 0 … pools").
- **`publicProse.js :: aliasRepeatedRungs`:** a rung stored twice with the same text becomes an alias.
- **`stateProse/dossierMounts.js`:** "one fact, one sentence", meaning one sentence rung per block per page set, walker-enforced.
- **`tierVoice.js`** (the tier noun) and **`drawDeclared.js :: resolveSiblingSentences`** (swaps a sentence for its declared twin).

### 6b. The faults of FLOW, not of fact

`flow.mjs` ran over all 720 towns: every public-prose site drawn, identical site outputs counted once, 51,239 sentences.

| fault | towns | measure | what it is |
|---|---|---|---|
| **F2: neighbouring sentences repeat a 5-word run** | 196 | 244 distinct pairs | Chiefly the power desk naming the governing body in full, sentence after sentence: "The Elder Council at Breitdorf has left obvious decisions untaken … Call the Elder Council at Breitdorf by any other title …". The weave stands down only the *settlement's* name. |
| **F4: neighbours share their opening two words** | 257 | — | "The thorp is poor, and its people say so … The thorp gets by.": also **one fact said twice in neighbouring sentences**, prosperity from DS-ECO-1 (header) and DS-ECO-8 (rung), two blocks on one fact. |
| **F3: a 4-word run repeated inside one sentence** | — | 367 distinct sentences | Mostly **deliberate** parallelism ("a bad year for one is not a bad year for everyone"): **not** a reconciler target. |

**Also from the census's captures** (READ):
- **Pattern 2:** the stores stated twice, Economics and Defense: a flow half beside its fact half.
- **Pattern 3:** the Magic tab qualifies "Relied upon" with the same clause twice.
- **Pattern 13** ("… and go on") is an authored slip (class C). It is a two-word repeat F3 does not catch.

### 6c. The contract: a last pass, after selection

- **Input:** the drawn units of one mount, with their provenance (block, pool key, vid).
- **It may:** reorder; join; stand down a repeated proper name (settlement **or power**) to its noun or a pronoun; vary a connective from a closed, owner-signed list; drop a sentence whose block's fact set is already said by an earlier sentence on the mount.
- **It may not:** add a claim, change a value, or draw.
- **Deterministic:** any choice is a stable hash of the seed and the mount; no clock, no locale.

**The proof check** (a unit and a corpus arm):
1. The multiset of **registered words** after the pass is contained in the multiset before it: the walker's `thingsNamedIn`, every vocabulary atom word, the state, size and count words, and every numeral.
2. Every output sentence is an input sentence, or a join of two adjacent ones, modulo the name stand-down and the closed connective list.
3. Running it on the 720 shows zero new registered words, and F2 and F4 fall.

### 6d. The smallest useful first version

**`weaveBlock` widened by two moves, on the mounts it already weaves:**
1. Stand down a repeated **power name** after its first mention, to the power's own short noun or "it". This needs one small noun table, which is new words for the owner's veto. It cures most of F2.
2. Drop a second sentence whose block reads the **same fact** as an earlier one on the mount. The DS-ECO-1 header beside the DS-ECO-8 rung is the measured case; one fact key per block comes from the layer table.

Everything else (reorder, connectives) waits, because `composeStateProse` already owns connectives and the owner signs that copy.

## The chair's four added measures, and two more (items 7–12, sent 2026-11-12 18:55–19:07; read after the first hand-back)

**The instrument for 7, 8, 10 and 12:** `depth.mjs`, EXECUTED over all 720 births in 33 seconds.
- **The hook.** The tree's kernel is wrapped *in memory* by the loader hook (`jsx-loader.mjs`, `LAYER_MAP_HOOK=1`; the tree's file is not changed). Every real `eligibleVariants` call the desks make is then seen with the desk's own options: slots, audience, the answered dimensions, the facts.
- **A disqualifier** is either of two things:
  - today's gates: the declared atoms, the kernel dimensions, the pool's brace group;
  - **the words**: a line naming a registered thing (the walker's `thingsNamedIn`) in a town where the walker's own `absent(factsOf)` says the town lacks it.

  A gate is a disqualifier (the owner's ruling (a)).
- **Coverage.** 368 of the 856 corpus pools are reached by the public-prose sites, over **55,197** (pool, town) draws. The other 488 pools are mounted elsewhere (GM-only views, the campaign world) and are **not** measured here.
- **The class table** §5.5 already covers the generator data pools (5 with no line).
- **Audience.** The draw is the player audience, as the sites draw. Each case also carries the owner view (`linesLeftOwnerView`).

## 7. POOL DEPTH UNDER DISQUALIFIERS

**The distribution of lines left per (pool, town) draw**, slot-silenced draws left out:
- 1,061 draws leave **none**;
- **3,243 leave one**.

**The median lines left per pool:**

| lines left (median) | pools |
|---|---|
| 0 | 10 |
| 1 | 18 |
| 2 | 88 |
| 3 | 185 |
| 4 | 57 |
| 5 | 5 |
| 6 | 5 |

**By layer:**

| layer | pools reached | draws | one left | none left | bill (3 at 95%) |
|---|---|---|---|---|---|
| L1 | 57 | 5,493 | 92 | 1 | 20 |
| L2 | 117 | 13,695 | 1,280 | 607 | 76 |
| L3 | 68 | 10,922 | 401 | 33 | 35 |
| L4 | 115 | 22,145 | 1,436 | 399 | 115 |
| L5 | 10 | 2,222 | 34 | 21 | 5 |
| W | 1 | 720 | 0 | 0 | 0 |

**THE WRITING BILL.** Giving every reached pool at least three eligible lines in 95% of the towns that draw it takes **251 new lines in 162 pools**. This is a lower bound: it assumes lines that presume nothing, each serving every town of its pool.

**The words remove almost nothing today.** Only 6 cases (369 towns) lose a line to its words, and none is emptied by them. The emptiness is the gates' and the audience's, not the words'. The words matter for the lines a builder declares next, not for today's eligibility.

**(a) The read sample: 50 declared variants**, a fixed stride over the corpus (`results/sample50.txt`; READ, my judgment):

| class | count | what it is |
|---|---|---|
| truth | **39** | e.g. `[gate]` on "the gates close on time"; `[institution: granary]` on "the granary feeds fewer"; `[population: ≥ middling]` on "the poorest quarters" |
| not a requirement at all | **5** | `crisis: any`: a **widening** in a crisis-scoped pool (232 variants carry it) |
| flavour: a requirement that truth does not need, a weight's job | **5** | `[market]` on "what the town sells is dear" (trade needs no market); `[no walls]` ×3: the wall-free twins of F10 ("Everything at {settlement} answers to the siege now", "safer than its country", "has not been touched by it"), each **true in a walled town too**; `[no garrison]` on armed officials who answer to nobody |
| borderline | **1** | `[no crisis: infiltrated]` on a watched-strangers line |

So of the 45 that are requirements, about **5 or 6 (11–13%) are flavour**. The largest family: 42 variants carry `no walls`. Where each is the twin of a `walls` line, it is gated for fit, not truth.

One more line (no. 15, `[crisis: any]`) names a granary and a harbour it does not declare. That is the opposite fault, already in the 412.

## 8. THE PICK TODAY, AND WEIGHTED AGAINST UNIFORM

**Today's pick (READ, source).** Both doors are unweighted:
- **The corpus:** `stateProseKernel.js :: drawVariant` is a seeded **rendezvous hash** over the eligible lines (the highest `avalanche32(fnv1a32(seed::block::pool::v<vid>))` wins; ties go to the lower vid). That is uniform in expectation, with **no weights**.
- **Generator pools:** `drawDeclared.js :: drawDeclared` takes the site's own draw over the whole pool. If refused, it takes the declared twin, else the hash argmax over the admitted lines. **No weights** there either.
- **REGEX:** `weight` appears 0 times in the kernel and in `drawDeclared`.
- **Pools of differing specificity.** 116 of the 368 reached pools have lines of differing specificity (number of disqualifiers). Only those can feel a weight.

**Over the 720.** For each pool, the top line's expected share is computed under:
- a uniform draw among the lines left; and
- a draw weighted by 1 + min(4, disqualifiers on the line).

The weighted draw is the owner's "fit is a weight". The actual seeded draw is given beside both.

| measure | uniform | weighted | actual |
|---|---|---|---|
| pools drawn 30 times or more | 192 | 192 | 192 |
| top line ≥ 0.75 (the repetition guard's absolute rule) | **8** | **7** | **6** |
| mean top-line share | 0.377 | 0.380 | — |
| pools where weighting raises the top share by more than 0.005 | — | 27 | — |

The pools at ≥ 0.75: DS-ECO-6 *minor shadow activity* (1.0 under all three), DS-ECO-2 *FOOD: deficit*, DS-ECO-1 *C3*, DS-ECO-2 *FOOD: surplus*, DS-ECO-11 *TERRAIN: Plains* and *Forest*, DS-ECO-6 *significant off-book*, DS-DEF-8 *INFILTRATION*. Every one has a median of **1 line left**: that is depth, not the pick.

**The guard has no rows for these pools.** The repetition guard's register (`scripts/census/pool-dominance.register.json`) holds **908 rows, all generator ledger pools, and none of the corpus's 856.** So "passes its row" cannot be read for a corpus pool today. The table above applies the guard's absolute rule (0.75 at 30 draws or more) instead.

**Verdict.** On today's corpus, weighting changes little (7 pools against 8 at ≥ 0.75; the mean moves 0.003). Its value is in the lines yet to be written, where a specific line will sit beside a line that presumes nothing.

## 9. LINES THAT READ WORDING

**REGEX** (`wording.sh`; `results/wording.txt`): 66 lines in src match a string test, a regex test, a first-word split or a label compared by its text. I read all 66 and classed them by hand (READ).

**18 lines in 14 files decide what to say from already-chosen wording or a display label:**

| site | what it tests |
|---|---|
| `narrativeGenerator.js` (`situationDesc` includes 'church controls') | stored prose |
| `settlementLifecycleKernel.js` (`reason` startsWith 'Displaced population') | stored prose |
| `mutateEntities.js` (`description` includes '(role)') | stored prose |
| `DefenseTab.jsx` (a regex of the status over `cap.note`) | displayed wording |
| `defenseDisplay.js` (`DEFENSE_VULNERABILITY_RE.test(row.reason)`) | stored prose |
| `economyStateProse.js` (`TERRAIN_ONLY_RE.test(row.reason)`) | stored prose, **inside a pool-key reader** |
| `EconomicsTab.jsx` (a chain label's first word) | a label |
| `SupplyChainsPanel.jsx` ×2 (first-word presence: patterns 8 and 18) | a name's first word |
| `pdf/sections/SupplyChainFlow.jsx` ×2 (its PDF twin) | a name's first word |
| `finishedGoodsDemand.js`, `tradeCommodity.js` (a goods label's first word) | a label |
| `foodBalanceBar.js` (a note's first word) | stored prose |
| `settlementQuickGuide.js` (the first word of a descriptor string) | stored prose |
| `DefenseTab.jsx`, `pdf/sections/DefenseSecurity.jsx`, `defenseDisplay.js` (a capability **label** compared by text: 'Economic Backing', 'Arcane Support') | a label |

**Not counted:**
- **8 checks that read wording on purpose:** the agreement guard (`generationCoherence.js` ×5), `foodWordsFindings`, `crisisCastFindings`, `composedWalker`.
- **The rest:** search boxes, `typeof` guards, enum labels, typography (`OverviewTab`'s drop cap).

**Not seen by the regex (READ):**
- `drawDeclared.js :: resolveSibling` / `resolveSiblingSentences` / `noteDeclared` find a drawn line's twin **keyed by the line's text**.
- `weaveBlock` (an opening name) and `aliasRepeatedRungs` (text equality) read wording too, but as reconcilers, which is their contract.

**The ledger already exists.** `domain/facts/presumptionLedger.js` is the *ledger of claims already made*: every drawn line's atoms, per block. But it is birth-local and write-only: only the self-check (`presumptionCheck.js`) reads it. No draw consults it.

## 10. THE CASE TABLE

**A pool's facts** = its key's stored-subtree dependencies (perturb, measured pools) + the condition facts its lines read (declared atoms, kernel dimensions, registered things named). Its case table is 2^(condition facts) with the key held fixed (the key is what routed the town to this pool).

**Condition facts per pool** (368 reached pools):

| condition facts | pools |
|---|---|
| 0 | 200 |
| 1 | 71 |
| 2 | 39 |
| 3 | 26 |
| 4 | 17 |
| 5 | 8 |
| 6 | 4 |
| 7 | 2 |
| 8 | 1 |

**Key plus condition facts:** 0 for 89 pools; 1–4 for 222; 5–10 for 57.

**Reachable cases over the 720:** 252 pools reach 1 case, 67 reach 2, and 49 reach 3 to 12. **591 cases in all.**

**Exhaustively testable at ≤ 64 cases: 365 of 368 pools.** The three that are not are all DS-GEN-3: *foodSecurity.label: Secure* (7 facts), *safetyProfile.safetyLabel…* (7), *foodSecurity.label: Import-Dependent* (8). The largest table is 256. **Every reached pool except those three can be proven on every case of its table, not on sampled births.**

## 11. THE AUTHORING PATH AS IT STANDS IN SOURCE (READ, names checked against the tree)

### Where a pool lives

- **Corpus pools.**
  - **Source:** `docs/content/RECEIPT_POOLS_DOSSIER_STATE.md`.
  - **Variant syntax:** a variant is `` N. `[angle · tag · tag]` text ``; the tags become its `marks`.
  - **Pool syntax:** a pool is `**KEY** {…}`. The brace group is `{atom, …}` (declares), `{crisis-scoped}` or `{colour}`, and becomes `poolMeta`.
  - **The generator:** `scripts/generate-dossier-state-prose.mjs` (`npm run gen:dossier-prose`; the gate runs it with `--check`).
  - **The output:** `src/data/dossierStateProse/{economy,defense,general,power,stressors,warFaith}.generated.js`.
- **Generator pools:** arrays in `src/data/*.js` or `src/generators/**`, drawn through `drawDeclared` / `filterDeclared` / `drawAdmitted` / `agreeingLine` (47 call sites, REGEX), or through 228 bare picks.

### How a variant declares today: every carrier

| carrier | where | who reads it at the DRAW |
|---|---|---|
| `marks` (atoms; the kernel words `walls`, `no walls`, the five crisis families; the state words `severity`, `deficit`, `anchor`; `colour`; `dm-only`) | corpus variants | the kernel: `eligibleVariants` (`variantFactDeclaration`, law 5, `variantIsAudible`) |
| pool brace `declares` / `crisisScoped` / `colour` | corpus `poolMeta` | the kernel, via `composeStateProse` (`poolDeclares`, `crisisScoped`); `colour` is read by the registers only |
| `needs` / `excludes` / `crisis` | generator line objects | `factVocabulary.js :: declarationOf` (inside `drawDeclared`) |
| `tags` | registry entries | `declarationOf`, **only** when the site passes `{ tagged: true }` |
| `poolDeclares`, `crisisScoped`, `twin` / `twinOf`, `registry`, `ctx` | the options of `drawDeclared` | `drawDeclared` |
| `cast` (`conflictIssues.js`), `requires` (`resourceData.js`, `spatialData.js`: 75 REGEX) | their own tables | their own code (`conflictIssues.js`, `structuralValidator.js` / `generationCoherence.js`): **not** the vocabulary's door |

**A mismatch of carriers.** The walker (`presumedThings.shared.mjs :: DECL_PROPS`) accepts seven carriers as a declaration: `needs`, `excludes`, `tags`, `marks`, `cast`, `poolDeclares`, `requires`. The door enforces a different set.
- A generator line that "declares" through `marks`, `cast` or `requires`, or through `tags` at an untagged site, **satisfies the walker and is not refused by `drawDeclared`**.
- The door's `crisis` carrier is **not** in the walker's list.

### The walkers and registers that read a pool today

| walker or register | what it holds |
|---|---|
| `tests/data/dossierStateProseProjection.contract.test.js` | refuses unknown mark words |
| `tests/lint/wiringCensusDeclared.walker.test.js` + `domain/facts/declarationRegisters.js` | the undeclared-lines register `tests/lint/undeclaredLines.register.json` (138 rows, 412; re-taken by `RETAKE_DECLARATION_REGISTERS=1 npx vitest run tests/domain/facts/declarationRegisters.test.js`) and `crisisScopedPools.register.json` (grow-only) |
| `tests/lint/presumedThings.walker.test.js` + `.shared.mjs` + `.register.json` | the 16 things; arm 1 over `src/data` and `src/generators`; arm 2 over printed records |
| `tests/lint/drawDeclaredKeys.walker.test.js` | the declared door's keys |
| `tests/lint/declaredLineShape.test.js` | the shape of a declared line |
| `tests/domain/facts/factVocabulary.test.js` | the vocabulary |
| `tests/domain/facts/colourMark.test.js` | the colour mark |
| `tests/lint/poolDominance.walker.test.js` + `scripts/census/pool-dominance.mjs` (`--bank-new`; `--tighten`, the chair's) + its register | generator ledger pools only |
| `tests/domain/phraseRepetition.test.js` | phrase repetition |
| the birth self-check `cert:false-presumption` (`presumptionCheck.js`) | re-asserts every declared atom against the final record |

### The procedure's section 9, corrected name by name

| the procedure says | the source says |
|---|---|
| "The declared door: drawDeclared and filterDeclared." | For **generator** pools, `src/domain/facts/drawDeclared.js :: drawDeclared, filterDeclared` (also `drawAdmitted`, `agreeingLine`). **The corpus's door is another**: `src/domain/display/stateProse/stateProseKernel.js :: eligibleVariants` (the gate) + `drawVariant` (the pick), reached through `composeStateProse.js :: composeStateProse`. |
| "factVocabulary, 51 dimensions (43, 7, 1)." | **Confirmed:** `src/domain/facts/factVocabulary.js :: FACT_DIMENSIONS`, 51 (43 presence, 7 band, 1 crisis), every reader present. Beside it, the kernel's `STATE_MARK_DIMENSIONS` (9: three demoted state keys, `walls`, five crisis families) and the pool rulings `POOL_RULINGS` (`crisis-scoped`, `colour`). |
| "The words of each registered thing: the presumed-things walker's shared list." | `tests/lint/presumedThings.shared.mjs :: THINGS` (16 things) with the matcher `thingsNamedIn` and the denial reader `thingsDeniedIn`; it is a **test** file, not a domain module. |
| "The fact homes: the leaves under the domain's facts folder (24)." | 24 **files**, of which **15 are fact leaves**: crisisKind, defence, famine, guild, institutions, magic, market, migration, otherNpc, populationBand, rulerKind, storesMonths, terrain, warState, water. **9 are machinery**: bareLine, declarationRegisters, drawDeclared, factVocabulary, factsAnswered, factsOf, presumptionCheck, presumptionLedger, textOf. Several homes live **outside** the folder: `defense/defenseFacts.js`, `dossier/faithReading.js`, `canonicalAccessors.js`, `resolveCulture.js`, `display/defenseDisplay.js :: deriveCriminalStructure`, `prosperityRank.js`, `magicLedger.js`, `magicReliance.js`. The one entry point is `factsOf.js :: factsOf`. |
| "The prose corpus and its door: the dossier-state receipt pools document and its generator script." | `docs/content/RECEIPT_POOLS_DOSSIER_STATE.md` → `scripts/generate-dossier-state-prose.mjs` (`npm run gen:dossier-prose`) → the six `src/data/dossierStateProse/*.generated.js`. |
| "The repetition guard: the pool-dominance census and its bank-new door." | `scripts/census/pool-dominance.mjs` (`--bank-new`), `scripts/census/pool-dominance.register.json`, `tests/lint/poolDominance.walker.test.js`. **It holds no corpus pool** (908 rows, all `ledger:` generator pools). |

### The procedure's rules the code CANNOT meet today, and what is missing

| rule | what is missing |
|---|---|
| §1.2, §2.3, §7.1: a fact's **layer**, a pool's layer, "reads nothing at or above its layer" | No `layer` exists on any dimension, pool or leaf, and no walker reads one (section 5 of this file). |
| §1.3: "never reads another line's wording; reads the ledger of claims" | 18 sites read wording (measure 9) and no walker forbids it. The claims ledger exists (`presumptionLedger.js`) but no draw can read it: it is birth-local and write-only. |
| §1.5, §3.4: **the weight** | Neither `drawVariant` nor `drawDeclared` takes a weight; there is no weight field and no rule. A weighted rendezvous draw would move every same-seed draw: every golden surface moves. |
| §1.6, §4: **one line that presumes nothing, exactly one** | No check. **163 of the 466 non-colour pools have no line free of a disqualifier** (117 because a pool-level brace declares for every line). |
| §2.4, §7.2: **the case table** | No in-repo tool computes one. `depth.mjs` here is a probe; 365 of 368 reached pools would fit an exhaustive test. |
| §3.2: a disqualifier for every thing, state, size, **count** or **value** | Things, crisis kinds, sizes (tier, population) and the four banded values exist. **No count dimension.** The nine dimensions of the class table §5.1 are missing (practitioner, capture rung, readiness grade, access-only church, grows-more-than-eats and import share, worked here, carrier, lead). |
| §3.2: a denial is disqualified where the thing exists | Only for registered things, with `excludes` / `no X` (the walker's denial arm banks 35 literals). |
| §3.5: names, numbers and lists through placeholders | Slots exist (corpus `{…}`, anchored liveness), but no walker refuses a typed number or name in a pool line (unverified beyond the prose-numerics baseline). |
| §3.8: a one-word-swap sibling is not a new line | No near-duplicate check (READ: none found by name). |
| §5.1: a sentence in code is a pool of one, checked at its print site | 1,462 such lines (class table §5.4) and no print-site check. |
| §5.3: no bare pick from a declared pool; no stripping | `drawDeclaredKeys.walker` reads keys, not callers. 3 strip sites. The carrier mismatch above. |
| §5.4: new words join the checks | Possible by hand, in two homes: the walker's `THINGS` (a test file) and `FACT_DIMENSIONS`. Nothing ties a new word in a line to either. |
| §5.5, §7.5: bank a new pool in the repetition guard; the weighted top share inside its row | **The guard holds no corpus pool**, so a new corpus pool cannot be banked through `--bank-new` today. Its corpus is generator ledgers. |
| §7.3: the page measure by vocabulary | Not built (ruling 3 of record 288 assigns it to B). |

## 12. THE GAP LIST

**File:** `GAPS.json`, beside this file.
- **Rows:** 591 cases, one per (pool, reachable case of its condition facts).
- **Each row carries:** the towns of the 720 that reach the case; the lines left (the case's capacity, player audience); the lines left by today's declarations alone; the owner-view lines left; the slot-silenced towns; and why an empty case is empty.
- **Order:** by towns reached.

**Totals, player audience:**
- **cases with none: 32**, in 25 pools and 1,009 towns (14 of them are empty only to the player: the owner view keeps lines);
- **cases under three: 236**, in about 15,000 towns.

**Owner view:**
- **cases with none: 18**, in 15 pools and 157 towns;
- **cases under three: 237**.

**The empty cases, owner view.** These are the ones a writer must fill:

| pool | cases | towns | case |
|---|---|---|---|
| DS-GEN-9 event types | 9 | 66 | political, disaster, economic ×2, demographic, occupation, religious ×2, exile, magical (with no anchor) |
| DS-GEN-5 and DS-GEN-6 *river* | 3 | 42 | no river |
| DS-GEN-3 *readiness: Undefended* | 1 | 15 | walls, militia, no garrison |
| DS-GEN-3 *scores.military: CRITICAL* | 1 | 5 | — |
| DS-FTH-4 heresy flags | 2 | 4 | no temple |
| DS-POW-6 *commander as a political actor* | 1 | 21 | no commander; audience |

**The lines a writer would have to write:**

| target | player audience | owner view |
|---|---|---|
| **≥ 1 line in every reachable case** | **25** (one per pool, a line that presumes nothing) to 32 (one per case) | 15 to 18 |
| **≥ 3 lines in every reachable case** | **252** (per pool, the largest shortfall of its cases) to 393 (per case) | 222 to 346 |

Of the 236 cases under three by player view, **124 are L4 pools** (history, viability, the stored lines). Then 54 are L2, 35 L3 and 23 L1.

## 13. What I did not do, and the limits

- **The perturbation sample** is 72 towns, and each subtree was perturbed 3 times. A dependence that shows only in rarer towns would be missed, so a layer is a **lower bound** where the sample is thin.
- **The read-tracer** sees only the branches taken.
- **The stored strata L3–L4** for `resourceAnalysis`, `economicViability` and `history` are bounds from the step contract; they were not measured by value. The defence profile was measured: L2.
- **The site draws** are the **player audience** (`PUBLIC_PROSE_SITES`). DM-only variants are layered with their pool, not drawn.
- **193 pools are layered STATIC** from block titles (READ). 21 have no declared fields.
- **`habitat.mjs`** is not on the census lane, so the class table's habitat counts are cited, not re-run. The REGEX counts here use this folder's own definitions.
- **No rate was re-measured.** No golden, gate or migration was touched.

## Re-run

All commands run from the tree root with `TREE=$PWD`. The corpus is `births.mjs`'s `corpus.ndjson.gz`; `<f>` is this folder.

| script | command | time |
|---|---|---|
| steps | `node <f>/steps.mjs` | — |
| rosterLoop | `SEEDS=<seeds.txt> node <f>/rosterLoop.mjs` | — |
| facts | `CORPUS=… node <f>/facts.mjs` | 9 s |
| perturb | `CORPUS=… SAMPLE=72 node --import <f>/jsx-register.mjs <f>/perturb.mjs` | 6 min |
| readiness | `CORPUS=… node <f>/readiness.mjs` | — |
| corpus | `node <f>/corpus.mjs` | — |
| assemble | `node <f>/assemble.mjs corpus.json perturb.json` | — |
| guardCount | `node <f>/guardCount.mjs layers.json perturb.json` | — |
| sources | `node <f>/sources.mjs` | — |
| stepReads | `PERTURB=perturb.json node <f>/stepReads.mjs` | — |
| flow | `CORPUS=… node --import <f>/jsx-register.mjs <f>/flow.mjs` | 30 s |
| depth (measures 7, 8, 10, 12) | `CORPUS=… LAYERS=layers.json PERTURB=perturb.json LAYER_MAP_HOOK=1 node --import <f>/jsx-register.mjs <f>/depth.mjs <out>` | 33 s |
| wording (measure 9) | `OUT=wording.txt sh <f>/wording.sh` | — |

`jsx-loader.mjs` lets plain node import the tree's `.jsx` files (an esbuild transform from the tree's own `node_modules`).
