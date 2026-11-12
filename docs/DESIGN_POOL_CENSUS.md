# DESIGN: the pool census, part 0 (CENSUS-0, 2026-11-04)

> A dated design record from an audit seat. It is **read-only on code**: nothing under `src/`, `tests/`, `scripts/` or `data/` was changed. Branch `lane/census-0-2026-11-04`, cut from `lane/rung2-2026-11-04` at `d0068d35e`.
>
> The owner's word, 2026-11-04 ~20:03, approving the chair's proposal: "Do it." The proposal: every pool line and table row declares the atomic facts it presumes; one draw function checks each atom against the record and refuses a line the record contradicts; an undeclared line is always drawable; the soak stays as the proof.
>
> This doc is the census the build seats work from. The order is §1 facts, §2 pools, §3 the gate, §4 the estimate. The appendices hold the raw tables.

**Receipts taken at this base**
- Soak: `node scripts/audit/soak-review.mjs --count 60 --workers 4 --out artifacts/census0`. It took 40 s and gave 60 settlements, 102 findings, 0 errors, CLIMB.
- The walls-gate draw proof (§3.3): a scratch script over the shipped leaves, deleted with the scratchpad. The method is described there and can be re-run.
- Three read-only sub-seats wrote the raw material for §1, §2 and the sample. Their tables are Appendices A to C.
  - Their counts come from module imports and AST or grep scans.
  - Their judgments of what a line presumes are a reader's, not a test's.
  - I spot-read their quoted sites for the kernel, `defenseFacts.js`, `defenceTwinLines.js`, `rngContext.js :: pick` and `proseSelection.js :: pickLine`. The rest is theirs (PLAUSIBLE until a build seat re-reads its row).

**Two corrections to the brief's premises**
1. The wiring census lives at **`docs/content/wiring-census.json`**, not `tests/lint/`. It holds **708** rows (68 blocks, 2,266 variants), not 709. The DS-DEF-9 row was never re-taken: rung 1D §4 records the census stale and bypassed by a scratch projector.
2. "Silence = calm" cannot be global. See §3.2: 916 of 1,000 places carry an active crisis.

## 1. The fact vocabulary and its homes

These are the facts a drawn line can presume, gathered from the instrument families (`coherenceBattery.js`, `readerBattery.js`, `checks.mjs :: KIND_OF`), the chair's intake, and the 400-line sample (§2.3). The full table, with file:line for every site, is **Appendix A**. This is the summary a build seat needs.

| fact | values | ONE reader today, or SCATTERED | instrument reading it today | state |
|---|---|---|---|---|
| walls / palisade | hasWalls, wallKind | `defenseFacts.js :: defenseFactsOf` (live roster); `wallsAnswered` for state prose | coh:defense-words; hook-truth | **competing**: `priorityHelpers.js :: getInstitutionNames.hasWalls` (raw roster, substring) still feeds about 8 `safetyProfile.js` lines; about 12 ad-hoc sites |
| gate | hasGate | `defenseFactsOf.hasGate` | none | **competing**: `priorityHelpers.hasGates` counts a palisade as gated |
| garrison / soldiers / commander | hasGarrison, hasMercenary, hasCommander | `defenseFactsOf`, `forceWordsOf`, `defenceRoleGate` | coh:defense-words; hook-truth | **competing**: `priorityHelpers` (18 reads in `safetyProfile.js`), `crisisCast.js :: defenderCandidates` regex, `historyGenerator.js :: buildHistoryContext` |
| watch | hasWatch | `defenseFactsOf.hasWatch` (watch only) | reader:daily-life [no-watch] (own regex); hook-truth (watch or militia) | **competing, three meanings** |
| militia | hasMilitia | `defenseFactsOf` | coh:defense-words | single |
| guard presence (for hooks) | — | none: reader:hook-pools [guard] uses `ENFORCEMENT_HOUSE` / `ROLE` regexes | reader:hook-pools | **competing** |
| market | permanent / periodic | `hasMarketInstitution` (raw roster) | reader:daily-life [no-market] | **competing**: `arrivalScene.holdsMarket`, plus substring flags in `foodGenerator`, `stressGenerator` and `priorityHelpers` (which count "black market") |
| tier | thorp…metropolis | `settlement.tier` (a field) | everywhere | single (a field) |
| population band | — | SCATTERED: `OWNER_BANDS` (`checks.mjs`), `TIER_STAMP_CUTS`; nothing answers "is this small" | A-bands | **no reader** |
| terrain class | — | SCATTERED: a raw field through two fallback chains (`readerBattery.js:40` vs `checks.mjs:208`) | reader:validation | **no reader** |
| water (sea, river, lake, port, navigable) | waterAccessKind | `tradeRouteSemantics.js :: waterAccessKind` | **none calls it** | **competing, five readings**: `hasNavigableWater`, `WATER_TERRAIN`, checks `hasWater`, `npcGenerator` (counts a `coastal` route), `viability.deriveWaterDependencyAnalysis`, `priorityHelpers.hasPort` |
| trade route kind | road / river / sea / isolated / crossroads | `tradeRouteSemantics` | reader:traditions-water (partly) | single |
| magic functions / level | on/off; level | `magicWorksAt`; `magicLedger` | coh:magic-absent-prose | **competing**: `features.mjs:97` reads a missing `magicExists` as off; 58 raw `magicExists` reads |
| faith presence (temple, priest, patron creed) | — | `faithReadingOf` (live roster) | coh (faith words, partly) | **competing**: `priorityHelpers.hasChurch` (War & Faith premise), 80+ name tests |
| crisis kind and state | siege, famine, plague, occupation, succession, debt, migration, war, raiders, insurgency, schism… | `canonStressors` (reads `stressors` → `stress` → `stresses`) | checks (`stress` only) | **no single reader of the KIND**: three carriers (`stress[]`, world-pulse stressors, `activeConditions`) in three vocabularies; `crisisEntriesOf`, `hookTruthRecord.js:70` and `checks.mjs:287` read `stress` only; siege has four readings; `crisisCastFindings` is in no battery |
| criminal structure | none / gangs / guild / syndicate | `deriveCriminalStructure` | coh:crime-denied-and-listed; A-06 | **competing**: `SummaryTab.jsx:29 hasCrim`, `priorityHelpers.hasCriminalInst`, `safetyProfile.criminalInstitutions` |
| food state (band, deficit, famine) | secure … famine | `foodBalance.js :: deriveFoodRecord` | coh:food-words; coh:grade-vs-food; A-01; X-49 | **competing, three famine rules**: `recordAllowsStarving`, hook-truth `famineLicensed`, A-01 |
| stores in months / granary | number | `foodRecord.storageMonths` and `foodSecurity.storageMonths` | X-49, foodWords vs defenseFacts, hook-truth | **competing AND DRIFTING**: the pulse writers (`foodStockpile.js:406`, `applyWorldPulse.js:106`, `generosityUpdates.js:65`) update only `foodSecurity` |
| fish / grain / game / livestock source | — | `deriveFoodRecord` (food sources); `fishSource` | coh:food-words | single |
| imports / exports present | lists | `canonExports` / `canonImports` | coh:food-words (partly) | single, but the Foundry Exports line bypasses it (rung 2 §2) |
| migration direction | in / out | none | none | **no reader** (the "three families left" exodus line under an influx, rung 2 §3c) |
| war state (one record) | at war / front / aggressor / peace | only world-level `settlementWarStatus` | none | **no reader on the record** |
| institutions present (mill, smith, bathhouse, docks, quarry, mine, tavern, school, hospital, healer…) | per institution | `defenseFactsOf.hasHospital` / `hasHealer` only; mill through `hasImportProcessor` | reader:validation | **no reader** for most; `priorityHelpers.hasHospital` (counts a monastery) still read at `generalStateProse.js:1207` |
| ruler kind | council / lord / mayor / priest-king / elder | none: about 10 sites pattern-match `powerStructure.government` | none | **no reader**; `governingFactionOf` answers the faction, not the kind |
| culture | — | `resolveSettlementCulture` | none | single |
| climate / season | — | no field on the record | none | **no reader, no field**: lines presume them anyway ("grain reserves before winter") |
| other named NPC | ≥ 2 NPCs | none | cert:narrative_quality (by accident: the rung-2 `someone` failures) | **no reader**; a new atom from the sample |

**Live vs raw roster (one cross-cutting fault).** `defenseFactsOf` and `faithReadingOf` read `liveInstitutions` (ruin-filtered). `hasMarketInstitution`, `getInstitutionNames` and every `readerBattery` check read the raw roster, ruined rows included. "One fact, one home" also has to mean one roster.

**The homing work (SCATTERED or competing, in priority order).** Each home is `factsOf(record).<fact>`, pure, on the live roster.
1. **crisis kind**: one map over the three carriers, the precondition of the crisis dimension.
2. **stores months**: retire the drift, so both carriers are written from one place.
3. **watch / walls / gate / garrison / hospital**: retire `priorityHelpers.getInstitutionNames` from prose.
4. **water**: route every reading through `waterAccessKind`.
5. **market**: put `hasMarketInstitution` on the live roster and retire the substring flags.
6. **famine**: one rule.
7. **magic**: missing means on everywhere, or off everywhere.
8. **ruler kind**.
9. **migration direction**.
10. **war state on the record**.
11. **institution presence**: one `hasInstitution(record, kind)`.
12. **population band**.
13. **terrain class**.
14. **other-NPC**.
15. **climate / season**: needs a record field first. That is new capability and the owner's call.

## 2. The pool inventory

### 2.1 The two halves

| half | pools | lines | draw kind | already declares | RNG |
|---|---|---|---|---|---|
| **The wiring census**: dossier state prose, DS-*, six desks | **708** (DEF 126 · GEN 140 · ECO 85 · WAR 86 · POW 79 · FTH 52 · STR 49 · POP 29 · SUP 20 · CND 18 · REL 13 · HK 11) | **2,266** variants | K, all of them (`readStateProse` → `eligibleVariants` → `drawVariant`, a hash argmax over `vid`) | `walls` on 40 lines plus 40 twins (F10; 19 dimensioned blocks; 17 mounts declare `dimensions: ['walls']`); `severity` / `deficit` / `anchor` on the three demoted-key blocks; `crisis`: **none on this base** (F12 is on a sibling lane I could not read) | none |
| **Outside the census** (Appendix B, 124 rows) | **124** | **≈ 10,866** | R 45 / 1,966 · T 47 / 3,188 · H 17 / 3,495 · A 13 / 1,555 · K 2 / 662 | `defenceTwinLines.js` (10 text-keyed twins, needs walls / garrison / soldiers); `inlandHookLines.js` (F5); the hook-truth drop gate; F9's crime read; `secretsHeldByFoodRecord` (a food pre-filter on secrets) | R sites consume the seeded stream (below) |
| out of scope, counted only | 153 | 1,992 | H, almost all (world pulse, Herald, news, roads) | — | none |

**Total on the generator's DM-facing surfaces: about 832 pools and 13,130 lines**, plus 1,992 world-pulse lines if the chair brings them in.

**Three census gaps inside the kernel family.** These already draw through `eligibleVariants` / `drawVariant`, so the mark channel is available to them, but they are not rows of the wiring census:
- the decree pools (`decreeProsePools.js`, 69 sub-pools, 194 variants);
- the causal register (`dossierCausalProse.generated.js`, 78 families, 468 variants; no `vid`, so the modulus fallback, see §3.3);
- the 12 connectives.

**By surface (outside the census; pools / lines):** Institutions and Services 10 / 2,515 · NPCs 22 / 2,348 · Rumours 4 / 1,268 · Economics and Resources 13 / 865 · Overview and Tonight 21 / 804 · state-prose family off-census 3 / 674 · History 13 / 636 · other (lexicons, explain panels, rewriters, dead) 9 / 526 · Factions and Power 10 / 438 · Defense and War 7 / 301 · Daily Life 2 / 181 · Plot Hooks and Crisis 4 / 168 · Faith and Traditions 6 / 142.

**Dead pools:** `engagementNarrative.js` (35) and `demographicReading.js` (26) have no importer. They stay in stasis rather than being deleted (rule 36): flag them, do not declare them.

### 2.2 The draw sites, by kind: what a gate may and may not do there

There are **23 distinct bespoke draw functions** (the list is in Appendix B). They fall into five kinds.

- **K, the kernel.** The pre-filter is safe (§3.3, proven).
- **R, the seeded stream.** One generic path, `rngContext.js :: pick` / `helpers.js :: pickRandom` / `npcGenerator.js :: pickFromArray`, serves every R row. ⚠ `pick([])` returns before `_roll()`, so a gate that empties a pool **deletes a roll** and shifts everything after it in the birth. ⚠ These sites have **roll counts that already depend on pool content**, and the gate must not change those counts:
  - the stress-goal roll, conditional on a non-empty pool (`npcGenerator.js:608`);
  - the stress-secret roll after the food filter (`:779`);
  - redraw-once rejection (`arrivalScene.js:248`, `:265`);
  - the history fill and timeline loops (`historyGenerator.js:446-460`, `:556-582`);
  - one roll per relationship (`settlementNarrative.js:205`);
  - one roll per eligible service definition (`services/institutionServices.js:69/203`);
  - the faction-name retry (`factionGrouping.js`);
  - the tradition-trappings shuffle (pool length − 1 rolls on a forked local PRNG, `traditions/genesis.js`);
  - `drawUnique` (`hookVariety.js:93`), which is always one roll and safe.
- **H, the hash modulus.** `proseHash.js :: pickVariant` and `proseSelection.js :: pickLine` serve institution descriptions, STRESS_NOTES, origin pools, history descriptions and the tie fallback. A pre-filter moves the modulus, never the stream.
- **T, the table lookup with no draw.** `npcStructure.js:424`, `crisisCast.js:461-701`, `crisisHooks.js:162`, `dailyLifeLogic :: DEFENSE_CONTEXT` (which prints walls and garrison keyed on the readiness label, ungated), and the inline branches of `safetyProfile`, `rulingStructure`, `governanceNarrative`, `stressFactions`, `economicState` and `spatialGenerator`. Here the gate is a declared twin or fallback at the lookup.
- **A, all printed (lists).** Trade lists, strengths, imports, exports. No draw to protect: filter the list.

### 2.3 The sample: 400 lines, 20 pools × 20

The pools: DS-GEN-3, ECO-8, POW-6, HK-1, FTH-1, DEF-1, STR-1, POP-1, SUP-1, WAR-1; `npcData.js` impressions (the file has no prose plot-hook pool) and faction goals; `stressInstitutionEffects.js` secrets and stakes; `institutionDescVariants.js`; `institutionServices.js`; `narrativeText.js :: PRESSURE_SENTENCES`; `traditionCorpus.js`; the Daily Life deterministic strings (the tab's prose is AI-written); `crisisCast.js :: CAST_REASONS`; `historyData.js :: HISTORICAL_EVENTS_DATA`. The per-line annotations are in Appendix C.

| figure | value |
|---|---|
| lines | 400 |
| mean presumptions per line, all atoms | **1.95** |
| mean presumptions per line, **excluding atoms the pool key guarantees** | **0.66** |
| lines with no presumption at all | 1.2% |
| lines **fact-free once key-guaranteed atoms are set aside** | **51.0%** |
| lines that presume `calm` (false under any crisis) | 2.0% (1.75% undeclared), plus 1.5% false under one named crisis |
| the most-presumed facts (key atoms excluded) | market 23 · ruler 15 · watch 13 · walls 12 · grain source 12 · other NPC 11 · tier ≥ town 9 · road 8 · temple 8 · calm 7 · trade route 6 · guild 6 · gate 5 · stores 5 · priest 5 |
| densest pools (atoms per line, key excluded) | stress secrets 1.5 · NPC goals 1.25 · narrativeText crisis lines 1.0 · Daily Life 1.0 · history 0.95 |
| sparsest | NPC impressions 0.05 · crisis-cast reasons 0.1 · DS-SUP 0.25; the DS pools run 0.25–0.8 |

**The atoms with NO reader yet**, by the §1 table: **ruler** (15, the second most presumed), **other NPC** (11), **institution: guild** (6), the single institutions (tavern, smith, mill), **migration direction**, **war state**, **climate / season** ("grain reserves before winter"), **population band** ("many hundreds" in a city), and **terrain** (woodland kilns, saline source). **Market** and **watch** have readers that disagree. So of the top five atoms, only `walls` and `grain` are declarable today without homing work first.

**A caution on the calm figure.** 2% is a floor, not an estimate. The sample took the FIRST twenty lines of each pool, and the crisis-blind lines the chair's read convicted ("Nothing presses…", "has never needed to think about what is outside it", "is fed and dependent. Nothing about the arrangement is failing") sit in **neutral-baseline** pools that a sample by position under-draws. The chair's own read found the class in about 20 of 60 settlements. The calm lexicon instrument (§3.6) is the right measure, not this sample.

**Lines probably wrong today** (16 in Appendix C). The leading ones:
- the Garrison Commander goal "repair the east wall" (no twin);
- the Guard Captain's thieves'-guild payroll goal (no crime gate);
- three `narrativeText.js` wall lines (no guard; that file has no twin entries);
- the famine line's "harvest failure" and "three factions";
- `genesis.js :: foundingElementWeight`, which keeps First Landing at a base weight of 1.5 in landlocked places. This is the cause of reader:traditions-water (15.8%);
- the Daily Life fallbacks that name market, tavern and watch **exactly when** the institution list is empty. This is the cause of reader:daily-life-placeholder (49.7%);
- the Overview safety head pool, which files `Quarantined` with `Secure`;
- the population bands written as absolute counts;
- institution descriptions that presume woodland, salt water or a catch.

## 3. The gate design

### 3.0 What exists today: three channels, one fault

The estate already refuses lines the record contradicts, in three different shapes. None of them is wrong, but they don't share a declaration, so no walker can census them together.

| channel | where | when it acts | what it reads | RNG |
|---|---|---|---|---|
| **K: the kernel's mark channel** | `stateProseKernel.js :: STATE_MARK_DIMENSIONS`, `eligibleVariants` (law 5) | before the draw: filters the pool | `walls` (F10, answered by `defenseFacts.js :: wallsAnswered` at 17 desk entries), plus the demoted state keys `severity` / `deficit` / `anchor` | none: `drawVariant` is a hash argmax over `vid` |
| **T: the twin tables** | `src/data/defenceTwinLines.js :: defenceTwinLine` (F10 unit 4), `inlandHookLines.js` (F5) | after the draw: swaps the drawn string for its twin | `needs: walls / garrison / soldiers`, and the inland facts | none added: "keyed by the line's own text, taken AFTER the draw, so no roll moves" |
| **D: the drop gates** | `coherence/hookTruth.js`, `hookTruthRecord.js :: storeTrueHooksOnly` (F10), F9's `deriveCriminalStructure` read | after generation: removes the line from the record | defence terms, crime | none |

The design keeps K's vocabulary and fail-closed law, T's post-draw byte safety, and D's position as the last word. It gives all three **one declaration format and one draw function**, so the census can be taken by walking declarations instead of grepping sentences.

### 3.1 The declaration schema: where a declaration lives, per pool kind

A declaration is a set of **atoms**, each an `(dimension, value)` pair drawn from the closed vocabulary of §1. A line never declares a combination: "a walled market town" is three atoms, `walls`, `market` and `tier ≥ town`. The atom words are written ONCE, in a single vocabulary module. The proposal is `src/domain/facts/factVocabulary.js`, which grows `STATE_MARK_DIMENSIONS`. The kernel's constant becomes a re-export of that module's mark-dimension half, so the contract test that refuses an unknown mark word refuses an unknown atom.

| pool kind | where the declaration lives | example | who projects / reads it |
|---|---|---|---|
| **Dossier state prose** (the 708 pools of the wiring census; annex `docs/content/RECEIPT_POOLS_DOSSIER_STATE.md`) | the existing bracket tag slot, `[angle · atom · atom]`, the same slot that carries `walls`, `dm-only` and `grammar: Vn` today. Key-guaranteed atoms go on the **pool heading** once, never on its lines (`#### pool UNDER SIEGE {crisis: siege}`) | `` 2. `[visitor · walls · market]` {settlement} is visibly well off… `` | `generate-dossier-state-prose.mjs` already folds tags into `marks`. It must route fact atoms into `marks` (closed vocabulary) and pool-heading atoms into a pool-level `declares` field. `wiring-census.mjs` adds two row columns, `declares` and `lineDeclares` |
| **Causal, connective and relations registers** (`dossier*.generated.js`) | the same annex grammar, in their own annexes | — | the same projector |
| **Data tables** (`institutionDescVariants.js`, `institutionServices.js`, `npcData.js` hooks, goals and tie texts, `stressInstitutionEffects.js` secrets and stakes, `economicData.js`, `resourceData.js`, `supplyChainData.js`, traditions, history templates, the arrival scene, `narrativeText.js`, `narrativeData.js`) | a **sibling column**: a line becomes `{ text, needs?: [...], excludes?: [...], crisis?: [...] }`. A bare string is still legal and means "declares nothing". For a table whose entries are already objects (goals, services) the column is a field on the object | `{ text: 'Behind its walls, merchants shelter…', needs: ['walls'] }` | a walker (`tests/lint/declaredLines.census.walker.test.js`) reads the modules by import. Projection is not needed: the data is the source |
| **Registries** (`npcStructure.js` registry goals, crisis cast `CAST_REASONS`, faction and role registries) | a `tags` field on the registry entry, in the same atom words | `{ goal: 'Hold the gate…', tags: ['gate', 'crisis: siege'] }` | the same walker |
| **Twin tables** (`defenceTwinLines.js`, `inlandHookLines.js`) | they DISSOLVE into the column above. A twin becomes a sibling line of its original with the complementary atom (`excludes: ['walls']`), declared beside it in the same table. The text-keyed lookup survives only as the draw function's twin resolver (§3.3) | — | — |

Three rules hold across the kinds. A line's atoms are what it **presumes**; what it is **about** is already in the pool key. Atoms the key guarantees go on the pool, not on the line. And there is no third form: every declaration is atoms, and every atom is in the vocabulary.

### 3.2 Polarity: stated once per dimension

Every dimension has one of three shapes. Its shape is written in the vocabulary module beside its words, never on a line.

1. **Presence dimensions** are boolean facts: walls, gate, palisade, watch, garrison, soldiers, militia, market, temple, priest, docks, river, coast, lake, navigable, every `institution: X`, magic functions, organised crime, fish, grain, game, livestock, imports, exports. A line may declare `needs: X` (the record must hold X) or `excludes: X` (the record must not hold X: the twin's side). Silence means neutral, drawable over both values. This is exactly K's `walls` / `no walls`, renamed, and the kernel's `variantSpeaksOver` is already this rule.
2. **Band dimensions** are ordered facts: tier, population band, magic level, months of food in store, prosperity. A line declares a **range**, `tier: ≥ town` or `stores: < 3 months`. Silence means every band. There is one comparator per dimension, in the vocabulary module, so `≥ town` means the same thing everywhere.
3. **The crisis dimension (the inverse default)** has values = the crisis kinds of the crisis record (siege, famine, plague, occupation, succession, debt, migration-in, migration-out, war, raiders, insurgency, schism, …), plus `calm`. Under an active crisis of kind K, a line is drawable only if it declares `crisis: K` or `crisis: any`. **Silence reads as `calm`, and `calm` is not drawable under any active crisis.** Under no crisis, a line declaring only crisis kinds is not drawable. A line sayable in every condition declares `crisis: any`.

   ⚠ **The inverse default must be SCOPED BY POOL, not global (correction to the chair's statement).** At rung 1D, **916 of 1,000** places carry an active crisis (§3 of `SOAK_1000_RUNG1D`: 150–155 of every ~167 per tier). A global "silence = calm" would make every undeclared line of every pool undrawable in 92% of births on the day it lands. A pool opts into the crisis dimension by declaring `{crisis-scoped}` on its heading, row or table; only then does silence there mean calm. The opt-in is shrink-proof: a register (§3.5) pins the scoped pools and the soak's crisis-blind-prose instrument names the next ones. The pools the chair's sample read convicted (DS-HK, DS-GEN-3, DS-DEF posture, the POWER exodus line, the "nothing presses" family, DS-ECO food summaries, DS-POW legitimacy) are the first opt-ins. Pure-colour pools (descriptions of a tannery's smell) never opt in.

A line may carry atoms from several dimensions. The gate takes their conjunction, never a disjunction across dimensions. Within one dimension a line may list several values, as a disjunction (`crisis: siege, war`).

### 3.3 Fail-closed semantics and the draw-count rule

**Fail-closed** (K's law 5, generalised). The reader of every dimension a pool declares must be **answered** before the pool is readable. A pool whose declarations name a dimension the caller did not answer returns no line: silence, not a throw. Unanswered never reads as "absent". That means a new desk entry or a new table consumer cannot leak a line by forgetting to ask, which is how the walls class kept returning. Answers come from one place per fact, the fact's reader in §1 (`factsOf(record)`), and never from a caller's own regex. A dimension with no reader yet **cannot be declared**: the vocabulary module refuses an atom whose reader is `null`. That is why §4 orders "home the fact" before "declare the lines".

**The draw-count rule.** The gate must never change how many draws a birth consumes, and must never move a birth whose drawn line is lawful. There are three draw kinds in the tree (§2), and the rule takes one shape for each.

- **(K) hash argmax over `vid`** (`drawVariant`). Filter BEFORE the draw. Removing a member can move a birth only where the removed member was the winner, because the argmax over the survivors equals the argmax over the full set whenever the winner survives. **Proven on the walls gate at this base** (scratch script `wallsproof.mjs`, every walls-partitioned pool with no second dimension, 32 pools × 2,000 seeds, the pre-F10 pool reconstructed by dropping the twins and the marks):

  | answer | draws | moved | moved because the old winner was a `walls` line (the gate's purpose) | moved because an appended twin out-hashed an unmarked winner (an ADDITION, not the gate) | moved for any other reason |
  |---|---|---|---|---|---|
  | `walls` | 64,000 | **0** | — | — | — |
  | `no walls` | 64,000 | 33,483 | 23,605 | 9,878 | **0** |

  Two consequences follow, and the second is the chair's to price. (a) The gate alone is byte-safe in the strong sense: it moves only refused winners. (b) **A twin is an addition, and an addition moves ~1/(n+1) of the births that can read it** (here 9,878 of 64,000, 15%). So every new twin is a golden-moving change, even though the gate is not. The twin budget belongs in the owner veto list (§4.5).
- **(R) seeded-stream draws** (`rngContext.js :: pick`, `helpers.js :: pickRandom`, `weightedPick`, `randInt`-indexed arrays; 45 pools / 1,966 lines, §2.2). Filtering before the draw is NOT safe here, for two reasons. `pick(arr)` returns early on an empty array **without consuming a roll**, so a gate that empties a pool shifts every later draw in the birth. And a shorter array re-maps `floor(r · n)`, so a birth moves even when its winner survives. The rule: **roll once over the FULL pool, exactly as today, then resolve.** If the drawn line is admissible, keep it (byte-identical). If it is refused, resolve deterministically, **without a further roll**: first its declared twin (a sibling with the complementary atom); else the argmax over the admissible members by `hashKey(seed::pool::lineId)`; else nothing. This is T's existing post-draw rule promoted to the one draw function, and it gives R sites the same guarantee as K: only refused winners move.
- **(H) hash modulus** (`proseHash.js :: pickVariant`, `proseSelection.js :: pickLine`, `eventProse.js`). A pre-filter re-maps the modulus and moves surviving winners. Use the same draw-over-full-then-resolve rule as R.

**The one draw function** is therefore `drawDeclared(pool, { facts, draw, key })`. `draw` is the site's existing selector (argmax, roll or modulus), applied to the full pool; `facts` is the answered record. It returns `{ line, refused: atom[] | null, resolvedBy: 'drawn' | 'twin' | 'argmax' | 'none' }`. The kernel's `eligibleVariants` keeps its pre-filter, because for K pre-filter and resolve-after give identical results. Every other site calls `drawDeclared`. A site that renders a WHOLE list (kind A: trade lists, strengths, imports) has no draw to protect: it filters the list, and the list is lawful iff each item is.

### 3.4 The runtime self-check

At birth, after the record is final and before certification, every line that was drawn through `drawDeclared` or the kernel is replayed against the FINAL record: each declared atom is asserted with the same reader. Each drawn line records `(pool, lineId, atoms)` in a birth-local ledger. The ledger is not persisted, and the check is pure over `(record, ledger)`. A failed atom is a **certification failure**, class `cert:false-presumption`, carrying the line, the atom and the reader's answer.

This catches two things no reader instrument can. (1) **Late writes**: the fact was true when the line was drawn and false by the end of the birth, for example a crisis that resolves the walls or a famine that empties the granary. Defend against these by drawing after the fact is final, and this check proves it. (2) **A wrong declaration**: a line declared `needs: walls` that actually also presumes `market` passes the gate and prints in a market-less place. The self-check cannot see the undeclared atom, but the soak's reader instruments can, so the two run together. A reader finding on a DECLARED line means its declaration is incomplete, and the fix is the declaration, not a new instrument. A reader finding on an UNDECLARED line is the next census row.

The census becomes self-verifying in the direction that matters: a declaration that lies about the record fails certification by name. Cost: one reader call per declared atom per drawn line, on a record already in memory. That is O(lines drawn), and about 400 to 900 per metropolis birth (measure before ruling; not measured here).

### 3.5 The registers

- **The undeclared-lines register** (`tests/lint/undeclaredLines.register.json`, shrink-only, pinned). One row per pool, with the count of its lines that carry no declaration and whose pool has not been certified "pure colour". The walker reds when a count rises or a new undeclared pool appears, and it prints, by name, every pool whose count fell, so the pin is re-taken in the same commit. "Pure colour" is a pool-level ruling (`{colour}` on the heading or table), never a line's silence. That keeps "nobody declared it" distinct from "it presumes nothing".
- **The crisis-scoped register.** The pools that opted into the inverse default (§3.2). It is grow-only, and a pool leaving it needs the chair's note.
- **The wiring census, extended.** Each of the 708 rows gains `declares` (the pool-level atoms), `lineDeclares` (an atom histogram over its variants), `undeclared` (a count) and `crisisScoped` (bool). The census also gains a second table, `tablePools`, one row per pool outside the state corpus (§2's inventory), with the same four columns plus `drawKind` (K / R / H / A / T) and `drawSite`. The `--check` stamp extends to the data modules that hold declared lines. Because `gen:dossier-prose` already refuses a stale census, a declaration change and its census re-take land in one commit. (Every lane since F9 has bypassed that refusal with a scratch projector copy. The census lane must re-take the census through its door first, or the extension is born stale.)

### 3.6 What the soak battery keeps doing

The battery stays as the PROOF that the declarations are right, because the gate can only be as truthful as the atoms. Each reader instrument (`readerBattery.js`, `coh:*`, `reader:*` in `checks.mjs :: KIND_OF`) stays until its class reads **0 on two consecutive rungs**. After that it is kept as a tripwire, not retired. The soak gains two aggregates:

- `declared-share`: the share of drawn lines that went through a declaration, by surface;
- `cert:false-presumption`: zero at every rung, or STOP.

One new instrument is owed, because the chair's sample read convicted a class the battery cannot see: **crisis-blind stock prose**, "Nothing presses X…" under a siege (about 20 of 60). The instrument is a lexicon of calm-asserting phrases read against the crisis record. It is the intake list for the crisis-scoped register, and it reads 0 only when every pool that can print calm under a crisis has opted in.

## 4. The estimate and the order

### 4.1 Lines to declare, by surface

Every line must be **read** once, including the ones that will declare nothing. In this census silence is a ruling ("pure colour", made at pool level), not an absence. The sample's figures turn line counts into declaration counts: about 49% of lines carry at least one atom, about 0.66 atoms per line.

| surface (primary) | pools | lines to read | ≈ lines that will declare (×0.49) | dominant draw kind | atoms that block on homing (§1) |
|---|---|---|---|---|---|
| Overview, Tonight, Crisis: DS-GEN, DS-HK, DS-STR, DS-CND, plus the 21 off-census Overview/Tonight pools and the 4 crisis-hook pools | 140 + 11 + 49 + 18 + 25 = **243** | 463 + 44 + 192 + 54 + 804 + 168 = **1,725** | ~845 | K, T | **crisis kind**, stores, watch |
| Economics and Resources: DS-ECO, DS-SUP, DS-POP, plus 13 lists and tables | 85 + 20 + 29 + 13 = **147** | 269 + 60 + 85 + 865 = **1,279** | ~625 | K, A | water, market, migration, population band |
| Power and Factions: DS-POW, DS-REL, plus 10 | 79 + 13 + 10 = **102** | 256 + 42 + 438 = **736** | ~360 | K, T | **ruler kind**, crime |
| Defense and War: DS-DEF, DS-WAR, plus 7 | 126 + 86 + 7 = **219** | 383 + 262 + 301 = **946** | ~465 | K, T | war state |
| Faith: DS-FTH, plus 6 traditions and faith pools | 52 + 6 = **58** | 156 + 142 = **298** | ~145 | K, R (shuffle) | water, terrain |
| Daily Life | **2** | **181** | ~90 (and the fallbacks need new lines) | T, AI | market, watch |
| NPCs (goals, secrets, stakes, impressions, ties) | **22** | **2,348** | ~1,150 (goals and secrets run 1.25–1.5 atoms) | R | other NPC, ruler, institutions, crime |
| Institutions and Services | **10** | **2,515** | ~1,230 | H, R | institutions, terrain, water |
| History | **13** | **636** | ~310 | R (loops) | ruler, institutions |
| Rumours | **4** | **1,268** | ~620 | H | broad |
| Off-census kernel family (decree, causal, connectives) | **3** | **674** | ~330 | K | crisis |
| Other (lexicons, explain panels, rewriters) | 9 | 526 | to triage | mixed | — |
| **Total** | **≈ 832** | **≈ 13,130** | **≈ 6,400** | | |

### 4.2 The order, with my correction

**The chair's order** was: the summary surfaces (Overview, Tonight, Crisis), then the Economics and Resources lists, then the long tabs. **I keep its spine and correct it in four places.** The inventory says the binding constraint is not the line count. It is that the top atoms of the summary surfaces have no single reader yet (§1), and a declaration against a competing reader certifies the wrong answer.

0. **Home the facts first, as their own wave, before any declaration.** These are crisis kind (blocking: the crisis dimension's precondition), stores months (drifting today), watch, walls, gate and hospital (retire `priorityHelpers.getInstitutionNames` from prose), water, market (live roster), famine and magic. This wave moves no prose. It changes which reader answers, and some state-prose keys move with it. It needs red-firsts per fact and golden accounting.
1. **The mechanism, on the walls dimension alone.** That covers `factVocabulary.js`, `drawDeclared`, the self-check, the two registers and the census extension, with the census re-taken **through its door** (§3.5). Proof: a byte-identical golden master and the walls-proof table re-run as a test. Nothing new is declared in this wave, so any golden that moves is a defect.
2. **The summary surfaces, plus the crisis-scoped opt-in.** This matches the chair's first step. It addresses the class that broke belief in about 20 of 60 settlements (rung 2 §3c, pattern 1).
3. **Daily Life, pulled forward from "long tabs".** It is 2 pools and 181 lines, it carries the largest reader class after validation text (49.7%), and the fix is a declared fallback, not a declaration sweep. It costs an hour and removes half the corpus's reader:daily-life findings.
4. **The Economics and Resources lists**, the chair's second step. These are mostly kind A (no draw), so this wave carries no RNG risk. It can run **in parallel with wave 2**, because it touches no shared draw site.
5. **NPCs before Institutions.** The NPC pools are the densest in atoms (secrets 1.5, goals 1.25). They hold the rung-2 certification failure class (`someone`, the `other NPC` atom) and the Tonight "Wants to" seam. Institutions are the biggest pool by lines but the sparsest in atoms. They come next, then Power, Defense and War, Faith and History, and Rumours last (H draws, broad and shallow).

### 4.3 Seats and hours

This is a range, not a promise. The assumptions are:
- **(a)** A build seat declares and verifies about 800–1,500 lines per seat-hour. The sample sub-seat annotated 400 lines in about 8 minutes, but declaration also has to check each atom against its reader and settle the pool-level colour rulings, so I priced it at a tenth of that speed.
- **(b)** A fact home costs 1–3 seat-hours, including its red-first.
- **(c)** Wiring a draw site costs 0.5–1.5 seat-hours.
- **(d)** The soak re-runs (1,000 at about 200 s; 10,000 at about 35 min) are the gate between waves.

| wave | work | seat-hours |
|---|---|---|
| 0 homes | 13 facts (climate and season excluded: owner) | 15–40 |
| 1 mechanism | vocabulary, `drawDeclared`, self-check, registers, census extension, the byte-identity proof | 8–16 |
| draw sites | 23 bespoke functions plus 3 off-census kernel families | 12–35 |
| declarations | ≈ 13,130 lines read | 9–17 |
| twins and fallbacks | unknown until the gate shows the empty slots: owner veto | 5–20, plus the owner's reading time |
| soaks and landings | one 1,000 per wave; one 10,000 at the end | 6–10 |
| **total** | | **≈ 55–140 seat-hours**; with four lanes kept full (rule 35), **≈ 15–35 wall-clock hours** |

The wide end is driven by the draw sites with content-dependent roll counts (§2.2) and by twins. Each content-dependent site needs its own byte-identity proof.

### 4.4 Owner veto points

1. **Every new twin or fallback line.** It is wording (the owner's class). Each twin is also an ADDITION that moves about 1/(n+1) of that pool's eligible births (the §3.3 table: 15% of the bare draws in the walls pools). The gate alone moves only refused winners.
2. **Pools whose every line presumes a fact most places lack**, where the gate leaves the slot empty for most births:
   - the Daily Life fallbacks (they fire exactly when the institutions are absent);
   - `narrativeText.js` siege lines (walls);
   - the Garrison Commander goals (walls);
   - the stress secrets for siege and famine (1 fact-free line of 20);
   - the First Landing tradition element, which needs coast, river or port. Its weight belongs in the homes wave, not as a gate.
   The owner chooses between new lines, a silent slot, or a re-key.
3. **The crisis default's scope** (§3.2): global (the chair's statement) or per pool (my recommendation).
4. **Whether `cert:false-presumption` stops at any count from wave 1**, or reads as advisory for one rung while the declarations settle. I recommend a stop from the first day, since the self-check fires only on what has been declared.
5. **Climate and season.** A record field is new capability.
6. **The world-pulse corpus** (153 pools, 1,992 lines): in scope or not.

## 5. Open questions for the chair

1. F12's crisis dimension is not on this base or the remote. Does §3.2's crisis shape (`crisis: K`, `calm`, `crisis: any`, the pool opt-in) match F12's, or does F12's vocabulary govern?
2. A building's own walls (the caravanserai, the foundling home, the flood tidemark on old houses: 43 of the 44 rung-2 kind-4 findings). Does atom `walls` mean the perimeter only, so that a building's walls declare nothing and the instrument narrows? I recommend the perimeter only.
3. Is the crisis inverse default scoped per pool (recommended) or global?
4. Is `cert:false-presumption` a stop from wave 1?
5. Does the homes wave own the `foodSecurity` / `foodRecord` storage-months drift, or does a separate fix lane?
6. Are the world-pulse and Herald pools in scope?
7. Who owns the wiring census re-take through `gen:dossier-prose`'s door? It has been bypassed since F9, and wave 1 cannot extend a stale census.

## 6. The dominance guard: what it reds, and on what corpus (POOL-GUARD, 2026-11-12)

`scripts/census/pool-dominance.mjs`, its register `scripts/census/pool-dominance.register.json`, its walker `tests/lint/poolDominance.walker.test.js`. Born in COHERENCE-QUARREL (2026-11-11) to keep a pool from coming to print more of one line without anyone deciding it. The purpose has not changed. This section records why the rule changed, and the evidence for the change.

### 6.1 Why the exact ceiling had to go

The guard banked each pool at its EXACT share on a fixed 360-settlement corpus, and redded on any rise. I re-seeded that corpus with no source change, and 104, 102 and 105 rows read above their ceilings (noiseA, B, C). Not one of the 51 rows COHERENCE-AGREE read red rose by even one standard error of a share (the largest was 0.86). Neither did any of the five rows re-banked upward at point 43 (0.06 to 0.78). The guard was measuring the dice.

### 6.2 The rule

A row reds when:
1. **beyond its own noise:** its share rises above the ceiling by more than **three standard errors of a share at the ceiling**. The error is taken **over settlements**: the ratio estimator's cluster variance, `sqrt(N/(N-1) · Σ_towns (x_i − c·n_i)²) / Σ n_i`. It is never taken below the binomial error. Draws inside one town are not independent: with the binomial error alone, `npcData:NPC_FACTION_LOYALTY` read 30 SE over its ceiling on a re-seed.
2. **across the dominated line:** whatever the noise, a pool read over **30 or more draws** whose commonest line crosses **0.75** from a ceiling below it reds. I measured the line before choosing it: with no draw floor, 0.5 added 5 to 15 chance crossings per re-seed, 0.75 added 3 to 7 and even 1.0 added 1 to 4, all on pools of a handful of draws.
3. **a collapse:** a pool banked with two or more distinct lines that prints one reds when chance does not explain it. The test is that `top1 ^ towns` falls below 1/1000. That needs at least 10 towns at a commonest line of one half, and 66 towns at 0.9. It reds whatever the share's error, because the share test cannot see a pool whose commonest line was already most of it.

A cured pool's **target** is judged exactly, with no allowance. A ceiling is **loose** only when its measure sits below it by more than the 0.02 slack AND by more than three standard errors. Row-set checks (no row, no longer drawn) are exact on the banked corpus. Under `--seed-prefix=<p>` they print as notes.

### 6.3 The corpus

The corpus covers thorp 150, hamlet 200, village 350, town 550, city 350 and metropolis 150, all on the browser's random dials. Forced stresses are added on top: famine (village 50, town 50), wartime (town 50, city 50) and siege (town 50, city 50). That makes 2,050 settlements, with seeds `quarrel-<tier>[-<stress>]-<i>`; the old 360 are a subset. The run takes **137 seconds alone** on the seat's machine; the walker took 137 to 145 s. `--seed-prefix=<p>` runs the same guard on towns nobody tuned to.

### 6.4 The re-base, and the control that makes it one

A ceiling is a statement about one pool on ONE population of towns. The register now names its corpus (`corpus`). The walker reds when that name no longer matches the corpus in use, and `--tighten` refuses to compare across corpora. A corpus change goes through `--rebase`, on a chair's ruling, which banks every row at the new corpus's measure. The door refuses while the register already names this corpus. Each `--hold` keeps a row at a lower ceiling where the rule holds it there, and refuses where it does not.

**CONTROL: the old 360-settlement corpus at the lane's base (f72262c68), judged against the old ceilings, reads exit 0** (POOL-GUARD 1, the walker 9/9). Nothing regressed. 49 rows (46 pools) rise numerically because they measure higher on towns the old corpus never drew. 45 of those rises are within 3 SE of the old ceiling. The four beyond 3 SE are **findings for the second wave**, not reds; the register's `census.secondWave` holds them. The chair ruled this re-base on 2026-11-12; the owner may veto it.

The five rows re-banked upward at point 43 are held at their original ceilings, or at the measure where that is lower. All five hold: ARRIVAL_PEOPLE.greek top1 0.3449 · ARRIVAL_SENSES.cloth.dominant 0.3507 · faith.dominant 0.4856 · herbs.dominant 0.375 · npcData STRESS_ECONOMIC_EFFECTS.genuine_respect top5 0.6656. The cured targets are exactly as they were. Five rows carry them: conflicts:ISSUES, record:conflicts.issue, conflicts:HOOKS, record:conflicts.plotHooks and record:safetyProfile.plotHooks.

The 49 rows follow. Each slice's share is that slice's share of the pool's own commonest line (or its five commonest), with the slice's draws in brackets. "Driven by" names the slice that reads highest. "Size alone" means the same four tiers at the new sizes.

| pool | m | old ceiling | new measure | SE | draws | small tiers | four tiers | stress | driven by |
|---|---|---|---|---|---|---|---|---|---|
| `historyData:HISTORICAL_EVENTS_DATA.plotHooks:religious_tension` | top1 | 0.794 | 0.849 | 3.57 | 834 | 0.841 (113) | 0.834 (615) | 0.943 (106) | a stress |
| `npcData:NPC_FACTION_LOYALTY` | top1 | 0.1207 | 0.1565 | 3.45 | 68422 | 0.232 (1360) | 0.152 (56005) | 0.171 (11057) | the small tiers |
| `npcData:NPC_FACTION_LOYALTY` | top5 | 0.2914 | 0.3202 | 3.43 | 68422 | 0.396 (1360) | 0.312 (56005) | 0.350 (11057) | the small tiers |
| `historyData:HISTORICAL_EVENTS_DATA.plotHooks:tyranny` | top1 | 0.5775 | 0.66 | 3.11 | 347 | 0.771 (35) | 0.630 (270) | 0.762 (42) | the small tiers |
| `historyData:HISTORICAL_EVENTS_DATA.plotHooks:infiltration_fear` | top1 | 0.8406 | 0.8691 | 2.59 | 1497 | 0.888 (197) | 0.850 (1091) | 0.952 (209) | a stress |
| `stressNarrative:STRESS_SUMMARY_SIBLINGS` | top1 | 0.9167 | 0.9711 | 2.31 | 138 | 1.000 (16) | 0.937 (63) | 1.000 (59) | the small tiers |
| `npcData:NPC_HOOK_SIBLINGS` | top1 | 0.5579 | 0.6209 | 2.11 | 422 | 1.000 (3) | 0.620 (355) | 0.609 (64) | the small tiers |
| `POLITICAL_FLAVOR.stable` | top5 | 0.6797 | 0.7166 | 2.09 | 702 | 0.653 (170) | 0.683 (442) | 1.000 (90) | a stress |
| `institutionDescVariants:village|Economy|River boatyard` | top1 | 0.4445 | 0.6 | 2.01 | 45 | — | 0.610 (41) | 0.500 (4) | size alone |
| `historyData:HISTORICAL_EVENTS_DATA.plotHooks:great_fire` | top1 | 0.6843 | 0.7279 | 1.84 | 441 | 0.815 (54) | 0.693 (339) | 0.875 (48) | a stress |
| `historyData:HISTORICAL_EVENTS_DATA.plotHooks:wild_magic` | top1 | 0.6529 | 0.6946 | 1.79 | 419 | 0.704 (54) | 0.674 (331) | 0.882 (34) | a stress |
| `institutionDescVariants:town|Religious|Parish burial grounds` | top1 | 0.3375 | 0.37 | 1.78 | 700 | — | 0.362 (550) | 0.400 (150) | a stress |
| `historyData:HISTORICAL_EVENTS_DATA.plotHooks:succession_crisis` | top1 | 0.616 | 0.6402 | 1.48 | 881 | 0.741 (162) | 0.632 (611) | 0.537 (108) | the small tiers |
| `historyData:HISTORICAL_EVENTS_DATA.plotHooks:heresy_trial` | top1 | 0.6445 | 0.6777 | 1.38 | 394 | 0.627 (51) | 0.663 (309) | 0.882 (34) | a stress |
| `foodBalance:OUTLOOK_HOOK_SIBLINGS` | top1 | 0.6285 | 0.649 | 1.37 | 1051 | 0.544 (57) | 0.641 (749) | 0.698 (245) | a stress |
| `historyData:HISTORICAL_EVENTS_DATA.plotHooks:guild_conflict` | top1 | 0.3704 | 0.387 | 1.33 | 1512 | 0.564 (39) | 0.377 (1364) | 0.450 (109) | the small tiers |
| `FOODWAYS.FRAMES.more` | top1 | 0.5 | 0.75 | 1.32 | 8 | — | 0.600 (5) | 1.000 (3) | a stress |
| `institutionDescVariants:metropolis|Government|Town crier` | top1 | 0.3667 | 0.4261 | 1.27 | 115 | — | 0.426 (115) | — | size alone |
| `historyData:HISTORICAL_EVENTS_DATA.plotHooks:plague_years` | top1 | 0.6982 | 0.7254 | 1.09 | 415 | 0.722 (36) | 0.680 (319) | 0.967 (60) | a stress |
| `historyData:HISTORICAL_EVENTS_DATA.plotHooks:magical_controversy` | top1 | 0.7821 | 0.8007 | 0.99 | 662 | 0.793 (87) | 0.785 (512) | 0.937 (63) | a stress |
| `historyData:HISTORICAL_EVENTS_DATA.plotHooks:popular_uprising` | top1 | 0.5642 | 0.5888 | 0.93 | 355 | 0.565 (46) | 0.566 (281) | 0.857 (28) | a stress |
| `STRESS_DESCS.politically_fractured` | top1 | 0.25 | 0.3019 | 0.81 | 53 | 0.400 (10) | 0.279 (43) | — | the small tiers |
| `institutionDescVariants:metropolis|Economy|Harbour master's office` | top1 | 0.3334 | 0.4167 | 0.80 | 24 | — | 0.417 (24) | — | size alone |
| `ARRIVAL_SENSES.tanners.dominant` | top1 | 0.4 | 0.4688 | 0.76 | 32 | — | 0.464 (28) | 0.500 (4) | a stress |
| `CULTURE_PROFILES.south_asian.architecturalDetails` | top1 | 0.5 | 0.6 | 0.75 | 15 | 0.714 (7) | 0.500 (8) | — | the small tiers |
| `STRESS_DESCS.politically_fractured` | top5 | 0.9167 | 0.9434 | 0.70 | 53 | 1.000 (10) | 0.930 (43) | — | the small tiers |
| `POLITICAL_FLAVOR.stable` | top1 | 0.1554 | 0.1653 | 0.70 | 702 | 0.194 (170) | 0.143 (442) | 0.222 (90) | a stress |
| `historyData:HISTORICAL_EVENTS_DATA.plotHooks:pilgrimage_surge` | top1 | 0.6512 | 0.6675 | 0.69 | 418 | 0.606 (33) | 0.652 (322) | 0.778 (63) | a stress |
| `institutionDescVariants:metropolis|Crafts|Bowyers & fletchers (guild)` | top1 | 0.3514 | 0.3788 | 0.65 | 132 | — | 0.379 (132) | — | size alone |
| `historyData:HISTORICAL_EVENTS_DATA.plotHooks:crime_wave` | top1 | 0.3389 | 0.3456 | 0.54 | 1502 | 0.452 (93) | 0.339 (1155) | 0.339 (254) | the small tiers |
| `FOODWAYS.FRAMES.two` | top1 | 0.5455 | 0.5693 | 0.54 | 130 | 0.559 (34) | 0.557 (79) | 0.647 (17) | a stress |
| `institutionDescVariants:city|Defense|Citadel` | top1 | 0.3489 | 0.3673 | 0.50 | 177 | — | 0.360 (150) | 0.407 (27) | a stress |
| `ARRIVAL_SENSES.market.lines` | top1 | 0.4 | 0.4667 | 0.50 | 15 | — | 0.364 (11) | 0.750 (4) | a stress |
| `institutionDescVariants:city|Economy|Harbour master's office` | top1 | 0.4 | 0.4269 | 0.49 | 82 | — | 0.377 (61) | 0.571 (21) | a stress |
| `ARRIVAL_SENSES.bread.lines` | top1 | 0.3334 | 0.375 | 0.48 | 32 | — | 0.391 (23) | 0.333 (9) | size alone |
| `historyData:HISTORICAL_EVENTS_DATA.plotHooks:disputed_land` | top1 | 0.5653 | 0.5798 | 0.47 | 257 | 0.667 (24) | 0.559 (222) | 0.818 (11) | a stress |
| `historyData:HISTORICAL_EVENTS_DATA.plotHooks:market_crash` | top1 | 0.5 | 0.5122 | 0.44 | 328 | 0.346 (26) | 0.518 (272) | 0.600 (30) | a stress |
| `STRESS_DESCS.indebted` | top1 | 0.3334 | 0.3637 | 0.41 | 44 | 0.750 (8) | 0.278 (36) | — | the small tiers |
| `ARRIVAL_MEMORIES.plague_years` | top1 | 0.4 | 0.4546 | 0.34 | 11 | — | 0.455 (11) | — | size alone |
| `institutionDescVariants:metropolis|Defense|Citadel` | top1 | 0.3847 | 0.4 | 0.32 | 105 | — | 0.400 (105) | — | size alone |
| `ARRIVAL_MEMORIES.great_flood` | top1 | 0.5 | 0.5455 | 0.29 | 11 | 0.000 (1) | 0.600 (10) | — | size alone |
| `STRESS_DESCS.plague_onset` | top1 | 0.3334 | 0.3637 | 0.29 | 22 | 1.000 (7) | 0.067 (15) | — | the small tiers |
| `npcData:STRESS_ECONOMIC_EFFECTS.gov_econ_dependence` | top1 | 0.1459 | 0.1491 | 0.23 | 644 | 0.000 (9) | 0.151 (624) | 0.182 (11) | a stress |
| `STRESS_DESCS.religious_conversion` | top1 | 0.4 | 0.4211 | 0.18 | 19 | 0.250 (4) | 0.467 (15) | — | size alone |
| `institutionDescVariants:metropolis|Economy|Barge and river transport company` | top1 | 0.6 | 0.6191 | 0.18 | 21 | — | 0.619 (21) | — | size alone |
| `npcData:HANDLER_TIE_ARCHETYPES.handler_leverage_loved` | top1 | 0.3077 | 0.312 | 0.10 | 125 | 0.000 (1) | 0.333 (99) | 0.240 (25) | size alone |
| `FOODWAYS.FRAMES.one` | top1 | 0.5129 | 0.514 | 0.06 | 751 | 0.486 (183) | 0.531 (473) | 0.484 (95) | size alone |
| `FOODWAYS.SOURCE_PHRASES.game` | top1 | 0.5455 | 0.5469 | 0.03 | 128 | 0.517 (60) | 0.569 (58) | 0.600 (10) | a stress |
| `institutionDescVariants:city|Crafts|Bakers (5-15)` | top1 | 0.3803 | 0.3811 | 0.03 | 328 | — | 0.389 (257) | 0.352 (71) | size alone |

Of the 49: 23 are driven by a stress, 13 by the small tiers and 13 by size alone.

### 6.5 The proofs, on the final rule and corpus

| proof | run | result |
|---|---|---|
| false alarm | `--seed-prefix=noiseA` | 1 row over (village River boatyard, crossing 0.75 on 40 draws); 1 loose; 7 notes |
| false alarm | `--seed-prefix=noiseB` | 1 row over (plotHooks:popular_uprising, 3.4 SE); 4 notes |
| false alarm | `--seed-prefix=noiseC` | 1 row over (city River ferry, 3.7 SE over 79 draws); 5 notes |
| false alarm | `--seed-prefix=dominance` | 0; exit 0 |
| power, small | ARRIVAL_PEOPLE.greek, 4 → 2 lines | reds: top1 0.5625 > 0.3449, 5.6 SE over 192 draws |
| power, middling | POLITICAL_FLAVOR.stable, 9 → 5 lines | reds: top1 5.7 SE, top5 16.7 SE over 702 draws |
| power, large | npcData:NPC_FACTION_LOYALTY, every category halved | reds: top1 17.0 SE, top5 18.2 SE |
| power, one line | ARRIVAL_MEMORIES.heresy_trial, 3 → 1 | reds by the collapse arm alone (10 draws in 10 towns; chance 1.0e-4; the share arm allows 1.0) |
| power, one line | village Dairy farmer, variants emptied | the pool leaves the ledger (its one line is undeclared): reds as no longer drawn |

Under the old exact rule the same four re-seeds put 146, 135, 144 and 138 rows over their ceilings.

### 6.6 What it does not catch

It does not catch a rise inside the pool's own noise; on a pool of twenty draws that is a wide band, and only a larger corpus narrows it. It does not see a pool the corpus never draws. It cannot see variety lost among lines that the pool's line id merges: `npcData:NPC_FACTION_LOYALTY` keys a line by its index inside its category, so its commonest "line" is seven categories' first lines added together. That is charged to the second wave.

### 6.7 A rise must repeat (the chair's ruling, 2026-11-12), and the residue's procedure

Any lane that changes the generator re-deals births, so every merge point is reading what amounts to a fresh sample. On five fresh prefixes (noiseA, noiseB, noiseC, chairA, chairB), the rule in §6.2 put exactly one row over on each, and every time it was a different row: plotHooks:popular_uprising, then city River ferry, then metropolis River ferry, then village River boatyard, then Town council.Public works. Four of those five pick their line by a hash of the seed. A merge point does not re-deal such a pick; it re-deals only whether the institution is born. So the guard now works like this. When the corpus reads a row over by the noise arm or the dominated line, the guard reads the same corpus shape again under the fixed second prefix `confirm`, at the same tree, against the same ceiling, by the same rule. The row reds only if it is over on BOTH readings. A row over on one alone prints as a note carrying both readings, and the guard exits 0.

These are NOT confirmed and stay exact on the one reading: a cured pool's target, the collapse arm, and the row-set checks. The second corpus is read only when there is a row to confirm. So a green tree costs nothing more, and a tree with a row to confirm costs about one more run.

I measured three ways to stop chance alarms. Repeating the rise (the one adopted) gave 0, 0, 1, 0, 0 alarms over the five prefixes. Banking the highest reading of three corpora gave 1, 0, 0, 1, 0, raised 180 ceilings, weakened the plants and redded the loose check at base. Both together gave 0 on all five, at the second option's costs. Power under the repeat rule, on the banked corpus and on `confirm`: greek 5.6 and 4.9 SE; POLITICAL_FLAVOR.stable 5.7 and 6.6; NPC_FACTION_LOYALTY 17.0 and 17.5.

**THE RESIDUE.** A ceiling banked low reads over on both corpora. At this re-base the register was banked so that both corpora read zero at the banking tree (§6.8). That still leaves a case for later.

**The procedure for later, which a seat runs without waiting:** when a row reds on both corpora at a tip, measure that pool on the SECOND corpus at the tip's BASE tree (its merge base with the line).
- If the base tree reads it over there too, the ceiling predates the change. It goes to the chair with four readings: the banked corpus and `confirm`, at the tip and at the base. The chair may authorise a re-base of that one row to the base tree's `confirm` reading, through the door, by name. A seat never does that alone.
- If the base tree does not read it over, the rise belongs to the change, and the cure is to write the lines the pool lacks.

A single-row door that refuses without the base tree's reading is NOT built here. It would have to measure a second tree from inside the first, which is more than an hour's honest work, so it is charged to the second wave.

### 6.8 Both corpora start from zero (the chair's ruling, 2026-11-12)

Suppose the second corpus reads a row over, by the rule, at the very tree that row was banked on. Nothing in the code differs between the two readings, so that row was banked low. The door `--level-second` deals with such rows at a re-base. It refuses unless the banked corpus reads zero. It raises such a row's ceiling to the second corpus's reading (ceil4) and writes both readings into the row's reason. It never raises a target, and it stops for a ruling if it would raise more than five rows. At this re-base it raised ONE row: `institutionDescVariants:city|Economy|River ferry`, top1 0.5157 → 0.7778 (quarrel 0.5156 over 64 draws; confirm 0.7778 over 81). From here, the banked corpus and the second corpus start from the same zero. Two consequences keep them there. First, a levelled metric (`levelled`) is never loose on the banked reading, because its ceiling is the higher of the two readings by ruling. Second, `--tighten` lowers a ceiling only to the HIGHER of the two corpora's readings. A door that lowered it to the banked corpus's reading alone would bank it low again. Run at this commit, `--tighten` leaves the register byte-identical.

### 6.9 A loose ceiling must repeat too

The loose prompt is the rise's mirror, and the dice deal it the same way. On the five fresh prefixes it fired 1, 1, 0, 0 and 2 times, each one a different row: plotHooks:population_friction, city River ferry before its levelling, and plotHooks:occupation_legacy. So under a foreign prefix it is a note, because `--tighten` reads the banked corpus alone. On the banked corpus it is read again on `confirm`, and it reds only when loose on both. A ceiling the dice left loose by chance is never tightened into a low bank.

## Appendix A — the fact readers (sub-seat table, file:line)

### Unit 1: record facts a DM-facing line can presume, and who reads them

Read-only audit, `lane/census-0-2026-11-04` @ `d0068d35e` (2026-11-04). Counts are grep hits in `src/` + `scripts/audit/`, excluding `tests/` (and `src/data/` where noted). "fn" is the enclosing top-level function. Each site was found by grep and its enclosing function by a scan; only the sites quoted below were read by eye.

Instrument key: `coh:*` = coherenceBattery (`src/domain/coherence/coherenceBattery.js:49`), `reader:*` = readerBattery (`src/domain/coherence/readerBattery.js:505`), `X-/A-*` = `scripts/audit/soak-review/checks.mjs :: reviewSettlement`, `hook-truth` = `src/domain/coherence/hookTruth.js :: settlementHookFacts` (:130).

#### Table

| fact | values | reader (fn + file) or SCATTERED (sites, count) | instrument that reads it today | notes |
|---|---|---|---|---|
| **walls / palisade** | hasWalls, wallKind stone/palisade, hasPalisade | **READER** `defenseFactsOf` `src/domain/defense/defenseFacts.js:75` (live roster through `standingDefenseForces`, `defenseInstitutionBuckets.js:170`); `wallsAnswered` :151 for state prose. Ad-hoc competitors: `priorityHelpers.js:56 getInstitutionNames.hasWalls` (birth names, substring 'walls'), which feeds `safetyProfile.js generateSafetyProfile` :293,:302,:310,:321,:331,:355,:509 (7 DM prose lines); `stressGenerator.js:107 buildStressContext`; `viability.js:361`; `structuralValidator.js:552 checkStructuralValidity`; `mapProfile.js:181 deriveDefensiveTerrain` (/wall\|gate\|fortress\|citadel/); `aiLayer.js:163 extractFullContext`; `rulingStructure.js:723 generatePowerStructure` (palisade). ~12 ad-hoc sites | coh:defense-words (`walls` term, `defenseWordsFindings.js`); hook-truth `hasWalls` | **COMPETING.** safetyProfile's wall sentences use the priorityHelpers flag, not defenseFactsOf: it reads the raw (not ruin-filtered) roster and matches the substring 'walls'. |
| **gate** | hasGate | **READER** `defenseFactsOf.hasGate` defenseFacts.js:113 (stone walls, or a row matching /gates?/). Competitor `priorityHelpers.js:57 hasGates` (includes 'palisade'), read at `safetyProfile.js:491` | none directly (defense-words has no gate term) | **COMPETING, they disagree on a palisade.** defenseFacts: a palisade is no gate. priorityHelpers: a palisade has gates. |
| **garrison / soldiers / commander** | hasGarrison, hasMercenary, hasCommander, forceName, `forceWordsOf` nouns | **READER** `defenseFactsOf` + `forceWordsOf` :193 + `defenceRoleGate` :208 (used in npcGenerator ×3, rulingStructure ×2, stressFactions, defenseStateProse ×9). Competitors: `priorityHelpers.js` hasGarrison/hasMercenary/hasMilitaryInst, read by `safetyProfile.js` (18× `inst.hasGarrison`) and `defenseGenerator.js computeDefenseScores`; `historyGenerator.js:131 buildHistoryContext`; `npcGenerator.js:887 mergeNPCLists`; `stressFactions.js:292`; `crisisCast.js:705 defenderCandidates` (/garrison\|barracks\|watch\|militia\|wall\|guard/); `events/registry.js:81 classifyInstitution`; `historyTemplate.js:84 buildCurrentTensionTokens`. ~37 regex/includes sites in total | coh:defense-words (Garrison Commander, garrison, soldiers terms); hook-truth `hasGarrison/hasSoldiers/hasArmedForce`; reader:hook-pools `[guard]` | **COMPETING.** reader:hook-pools judges a guard by its own `ENFORCEMENT_HOUSE` regex (readerBattery.js:380), which counts 'levy', 'warden' and 'citadel', and by `ENFORCEMENT_ROLE` over NPC roles (:381), not by defenseFactsOf. |
| **watch / militia / guard captain** | hasWatch, hasMilitia, Guard Captain licence | **READER** `defenseFactsOf.hasWatch/hasMilitia`; `ROLE_NEEDS['Guard Captain']` defenseFacts.js:164. Competitors: `priorityHelpers.js:52 hasWatch` ('town watch','city watch','village watch'); `stressGenerator.js:108 hasMilitary`; `safetyProfile.js:157,285,301,317,327,341,506`; readerBattery `WATCH_HOUSE` /watch\|guard\|garrison/ :481 | coh:defense-words (Guard Captain); hook-truth `hasWatch`; reader:daily-life-placeholder `[no-watch]` | **COMPETING, 3 meanings of "watch":** (1) defenseFacts.hasWatch means a watch only; (2) hook-truth `hasWatch` (hookTruth.js:~186) means watch OR militia; (3) reader:daily-life `[no-watch]` means /watch\|guard\|garrison/ on raw names, so a militia-only place counts as "no watch" and a "Watchtower" counts as a watch. |
| **hospital / healer** | hasHospital, hasHealer, healerName | **READER** `defenseFactsOf` (HOSPITAL_RE / HEALER_RE). Competitor `priorityHelpers.js:68 hasHospital` = hospital\|monastery\|healer\|friary (the old conflation defenseFacts.js:17 documents), read at `generalStateProse.js:1207` (PROVISIONED key); `stressGenerator.js:113 hasHealer`; `institutionProbability.js:144`; `narrativeGenerator.js:486 genPressureDetail`; `defenseGenerator.js:313`. 9 sites | coh:defense-words (hospital); hook-truth `hasHospital`; A-05:hospital-absent (checks.mjs:316, its own /hospital/ test over raw names) | **COMPETING.** A state-prose key still reads the conflated flag. |
| **stored food months** | number | **TWO READERS:** `defenseFactsOf.storedFoodMonths` and `foodLedger` (`foodLedger.js:55`, which hook-truth reads) both read `foodSecurity.storageMonths`. `foodEnduranceOf` (defenseFacts.js:249), X-49 (checks.mjs:269) and foodWords read `foodSecurity.foodRecord.storageMonths` | coh:defense-words ("no food stored"); X-49:stores-not-once; X-52:endurance-*; hook-truth famineLicensed | **COMPETING, and they drift apart after a pulse.** The world-pulse writers rewrite `foodSecurity.storageMonths` only: `foodStockpile.js:406`, `applyWorldPulse.js:106`, `generosityUpdates.js:65`. `foodRecord.storageMonths` stays at its birth value, so after a tick the Defense endurance line and the defence-words check use different months. |
| **food band (famine / deficit / surplus)** | foodRecord.band; foodSecurity.label | **READER** `deriveFoodRecord` `generators/economy/foodBalance.js:94`, stored at `economicState.foodSecurity.foodRecord`. Predicates on it: `recordAllowsStarving` `foodSurplus.js:72`, `offersFoodSurplus` :22. Competitors: hook-truth reads `foodSecurity.label` (hookTruth.js:~139); A-01 (checks.mjs:300) uses its own rule `band!=='famine' && gapPct<20`; `config.stressTypes.includes('famine')` at generation (priorityHelpers.js:~293 `s('famine')`, foodGenerator, economicState); `tabHelpers.js:18 foodNarrative` reads `fb.deficitPercent` | coh:food-words; coh:grade-vs-food (page text only); A-01:starving-fed; hook-truth famine | **COMPETING, 3 famine rules:** recordAllowsStarving = deficit\|famine; hook-truth = label in CRISIS_BANDS AND months<2; A-01 = not famine AND gap<20 (no famine finding at gap ≥20). `foodStockpile.js:406` rewrites deficitPct but not `label` or `foodRecord.band`. |
| **food sources (grain/livestock/fish/mill/game)** | foodRecord.foodSources[], failedSource | **READER** `foodRecord.foodSources`, computed in `foodGenerator.js:148 generateFoodSecurity`. `fishSource` is a local there (:139), not an export. Line words come from `foodways.js:55 sourcesNamedIn`. Ad hoc: `stressGenerator.js:99-101` hasGrain/hasFish (resource keys); `foodBalance.js:156 deriveFoodBalanceAnalysis`; `tradeGoods.js:35 deriveLocalCommodities`; `economicState.js:475`; `thorpSecondRole.js:19`; `historyGenerator.js:91`. 9 fish sites | coh:food-words (sourcesNamedIn vs foodSources) | Fish ad hoc outside the record. A-11 and checks.mjs:93 `INLAND_FISH` license fish text by their own rules. |
| **granary** | foodRecord.hasGranary | **READER** `foodRecord.hasGranary` (= hasAnyGranary, foodGenerator.js:398). Competitors: `foodGenerator.js:131` hasGranary (town/village granary only, which sets storage); `priorityHelpers.js:67` ('granar'); `stressGenerator.js:109`; `foodBalance.js:142`; `tradeGoods.js:76`; `events/registry.js:79`; `factionResponses.js:585`. 12 sites | X-52:endurance-disagrees (checks.mjs:297) | foodGenerator holds two granary meanings: city/state granaries count for hasGranary but not for the stores term. |
| **market** | periodic/permanent market present | **READER** `hasMarketInstitution` `domain/facts/market.js :: hasMarketInstitution` (re-exported by `generators/economy/viability.js`; catalogue tag 'market', or 'guild'+'trade'). Raw roster, not live. 6 callers: rulingStructure ×3, readerBattery, checks.mjs. Ad hoc: `foodGenerator.js:143` hasMarket (substring, so 'black market' counts); `stressGenerator.js:110` (market\|fair); `priorityHelpers.js:60` (market\|bazaar\|fair\|exchange, so 'Stock exchange' counts); `viability.js:258` (market\|merchant\|district); `economicState.js:74`; `arrivalScene.js:82 holdsMarket` (its own exported reader); `institutionProbability.js:160 getBaseChance`; `serviceAvailability.js:71`. 24 ad-hoc sites | reader:daily-life-placeholder `[no-market]`; A-14:guild-power-small; arrival scene filters market words through holdsMarket | **COMPETING:** `holdsMarket` (arrivalScene.js:82) vs `hasMarketInstitution`. `DailyLifeTab.jsx:189` prints "the market … the watch" without asking either. |
| **tier** | thorp…metropolis | Field `settlement.tier`. Helpers: `tierAtLeast` `data/constants.js:137` (19 uses), `popToTier` :140 (37), `isCityScale` `viability.js :: isCityScale` (2), `tierNounFor` `stateProse/weaveBlock.js:119` (22). SCATTERED comparisons: 120 `tier === '<x>'` + 49 `[...].includes(tier)` + 80 `TIER_ORDER.indexOf`. Top files: rulingStructure.js (30), narrativeGenerator.js (11), factionDynamics.js (8), structuralValidator.js (7), safetyProfile.js (7), defenseGenerator.js (6) | coh:tier-noun; A-14:guild-power-small / lord-mayor-small; reader:scale-lists `[luxury-imports]` | The value has one home. "Small place" thresholds are spelled per site. |
| **population band** | population vs tier band | SCATTERED. `TIER_STAMP_CUTS`/`popToTier` (constants.js:140) vs `OWNER_BANDS` checks.mjs:37 (roll bands). | X-46:population-outside-band | The two are different cuts by design (stamp vs roll). |
| **terrain class** | plains/hills/forest/riverside/coastal/mountain/desert (`resolveConfig.js:39`) | SCATTERED. Field `config.terrainType`. Fallback chains: readerBattery `terrainOf` :40 (terrainType ?? terrainOverride ?? terrain ?? resourceAnalysis.terrain) vs checks.mjs:208 `hasWater` (terrainType ?? terrain ?? config.terrainOverride …). Comparisons: 29 `terrain === '<x>'` (+13 coast tests, 17 river tests), e.g. `defenseGenerator.js:140-144 computeDefenseScores`, `thorpSecondRole.js:22-27`, `narrativeGenerator.js:233-253 genArrivalDetail`, `settlementOriginProse.js:164 originArmKey`, `traditions/genesis.js:210`, `mapProfile.js:189 deriveDefensiveTerrain`, `foodGenerator.js:396` | reader:traditions-water, reader:hook-pools, reader:validation-on-page, A-11 (all through terrain) | No reader. Two different fallback chains in the instruments. |
| **water (sea/coast, river, lake, port/docks, navigable)** | maritime/river/none | **READER** `waterAccessKind(terrain, route)` `src/domain/tradeRouteSemantics.js:211` (6 callers: generationContext:250, foodGenerator:138, resourceGenerator:432, defenseStateProse:1515, settlementQuickGuide:569). Competitors: readerBattery `hasNavigableWater` :52 (regex coast\|river\|lake\|marsh\|swamp\|island\|delta\|fjord\|wetland\|sea, or route port\|river); readerBattery `WATER_TERRAIN` :412 (coast\|river\|lake); checks.mjs:207 `hasWater`; `generationContext.js:252 riverTradeSupported` (hand-spelled beside waterAccessKind); `viability.js:209 deriveWaterDependencyAnalysis` (WATER_ROUTES on terrain.name); `npcGenerator.js :: generateNPCs` (its `hasPort` read; re-addressed to the symbol 2026-11-09, ALLEGIANCE-CAR4: the retired goal draw shortened the file) (route in port\|river\|**coastal**, or /port\|harbou?r/ name); `tradeGoods.js:61 deriveNecessityImports isPort`; `priorityHelpers.js:65 hasPort` (PORT_INFRA_RE); `seaLanes.js:186 hasWaterAccessInstitution`; `tabHelpers.js:66-68 foodNarrative`. Route port/river compares: 43 sites | reader:hook-pools `[sea]` (hasNavigableWater); reader:traditions-water (WATER_TERRAIN); A-11:sea-words-landlocked (checks hasWater); reader:validation-on-page `[requires-on-water]` | **COMPETING, 4+ water rules, none of them the domain reader.** No instrument calls `waterAccessKind`. They disagree on: `coastal` route (npcGenerator: water; the others: not); marsh/swamp/lake/island (hasNavigableWater: water; waterAccessKind: none; these are not generated terrain values, so they only matter for authored or legacy input); docks as an institution (priorityHelpers.hasPort) vs terrain or route. |
| **trade route kind** | road/river/crossroads/port/isolated/mountain_pass (+legacy) | **READER** `tradeRouteSemantics`/`tradeRouteTier` (tradeRouteSemantics.js:~100, 13 uses), `isTradeRouteDisconnected`/`isIsolatedRoute` (14), `hasTradeRouteConnection` :141. Raw field `config.tradeRouteAccess`; readerBattery `routeOf` :45. SCATTERED raw compares: port 31, isolated 29, crossroads 14, river 12, road 7, e.g. `prosperity.js:187 computeBaseProsperity`, `economicState.js:186,242 generateEconomicState`, `tradeGoods.js:94 deriveIsEntrepot`, `historyRouteContext.js:34,72`, `institutionProbability.js:159-184 getBaseChance`, `settlementOriginProse.js:161-168`, `foodGenerator.js:338`, `stressGenerator.js:~118` | reader:traditions-water (NO_WATER_ROUTE), reader:hook-pools, A-11 | Tier semantics have one home. Route-kind prose branches spell the raw string (~93 sites). |
| **magic functions** | bool | **READER** `magicWorksAt` `src/domain/worldPulse/magicWorksAt.js:49` (through `magicLedger`; 17 uses). Competitors: 58 raw `magicExists !== false` / `=== false` reads, e.g. `priorityHelpers.js` (×3), `magicProfile.js` (×3), `pdf/lib/viewModel.js` (×3), `foodGenerator.js:116`, `prosperity.js`, `foodBalance.js`, `generationContext.js:240`, `dossierViewModel.js`; `computeEffectiveMagicPresence` (priorityHelpers, 3 uses) | coh:magic-words; coh:magic-absent-prose (text vs text only); A-04:dragon / alchemist-magic-off; hook-truth `magicFunctions` | **COMPETING, one disagreement found:** `scripts/audit/soak-review/features.mjs:97` prints `config.magicExists ? 'on':'off'`, so a missing value prints 'off' while magicWorksAt (and the raw `!== false` reads) treat missing as on. |
| **magic level** | none/low/medium/high, priorityMagic 0..100 | **READER** `magicLedger` `src/domain/magicLedger.js:95` (18 uses); reliance `deriveMagicReliance` `magicReliance.js:184` (7). SCATTERED: 16 raw `magicLevel === '…'` / `priorityMagic <n` sites, e.g. `foodGenerator.js:226,372`, `historyEventStrands.js:197 generateTradeNarrative2`, `magicProfile.js:324 deriveRoles`, `magicBufferApply.js:140`, `threatProfile.js:406`; `priorityHelpers.js:72 hasMagicInst` (name regex) | coh:magic-words (integral vs deriveMagicReliance) | Raw band compares can miss the legacy vocabulary magicLedger folds (moderate/common/pervasive). |
| **faith presence (temple, priest, creed)** | hasChurch, accessOnly, shrine, seniorCleric, religiousFaction, tithe, dial, deity | **READER** `faithReadingOf` `src/domain/dossier/faithReading.js:253` + `faithHasChurchEvidence` :277. Callers: faithPanelModel, SessionMode, faithDenial only. SCATTERED: 85 sites over 25 files, e.g. `priorityHelpers.js:69 hasChurch` (counts 'priest','shrine'), read at `warFaithStateProse.js` (DS-FTH-4 premise); `stressGenerator.js:111`; `historyGenerator.js:115 buildHistoryContext` (7); `viability.js:378`; `rulingStructure.js` (6); `stressFactions.js` (6); `factionDynamics.js:351 govIsTheocratic`; `narrativeGenerator.js:158 genSettSummary`; `npcGenerator.js:896` | coh:faith-denial | **COMPETING.** War & Faith state prose premises read `inst.hasChurch` (priorityHelpers), not faithReadingOf, though faithReading.js:23 says the War & Faith desk reads it. A pantheon or patron creed has no generated field; the deity is the DM's embed (`config.primaryDeitySnapshot`). |
| **crisis kind & state** (siege, famine, plague, occupation, succession, debt, migration, war, beast/raider, insurgency …) | gen keys: under_siege, famine, occupied, plague_onset, succession_void, indebted, monster_pressure, insurgency, wartime, mass_migration … | **THREE CARRIERS, THREE VOCABULARIES:** (a) `settlement.stress[]` (gen keys); array reader `canonStressors` `src/domain/canonicalAccessors.js:32` (15 uses) and the page's `crisisEntriesOf` `src/domain/crisis/crisisPage.js:118` (reads `stress` only); key→noun map `CRISIS_NOUN` crisisHooks.js:48; key→pulse type `GEN_TO_PULSE_TYPE` `stressorPicker.js:35`. (b) world-pulse stressors (`STRESSOR_CATALOG` stressorsCore.js:54: siege, disease_outbreak, monster_raider_pressure …). (c) `activeConditions[]` (`deriveAllActiveConditions` activeConditions.js:680, 28 uses; archetypes plague, war_pressure, siege_lifted …). Plus generation-time `config.stressTypes` (163 refs). SCATTERED: 52 `type === '<kind>'` / `stressTypes.includes('<kind>')` sites, e.g. `economicState.js` (7), `stressGenerator.js` (6, e.g. :117 `type==='under_siege'`), `foodBalance.js` (5), `districtProfile.js` (5), `conflicts.js:161 generateConflicts`, `crisisCast.js` (4), `capacityModel.js` (4), `narrativeGenerator.js:568 genCoherence`. Hand-rolled `stress` array normalisation: `hookTruthRecord.js:70`, `checks.mjs:287`, `features.mjs:83`, `stressGenerator.js:~117` | X-51:first-line-not-crisis (`s.stress[].label`); coh:hook-truth-record (crisisHooksOf per entry); `crisisCastFindings` exists but is in **no** battery | **COMPETING:** `canonStressors` (stressors→stress→stresses) vs `crisisEntriesOf` / hookTruthRecord / checks (`stress` only). No one reader answers "the active crisis kind" across (a)/(b)/(c). Siege alone has four readings: stress type `under_siege`, `foodSecurity.hasSiege` (foodGenerator.js:498, birth), pulse `siege` stressor, `liveSieges(worldState)` `display/warStatus.js:88`. |
| **war state** | at war / occupied / exhaustion | World-level readers only: `settlementWarStatus` `display/warStatus.js:283`, `hasLiveWarState` :262, `occupiedSettlements` :318 (need worldState). On a lone record: `WAR_STRESSOR_TYPES` `worldPulse/warStressorTypes.js:14` vs gen keys `wartime`/`occupied`/`under_siege`. SCATTERED (76 refs to war-state tokens) | none | No reader on the record. |
| **migration direction** | in / out | No record reader. `mass_migration` stress key (one-directional), world-pulse `demographicsMigration.js:378`, `migrationKernel.js`, `spatial/migration.js:538 readMigrationColumn` (world state) | none | **NO READER.** "Refugees arrive" and "people leave" lines have no fact to check. |
| **criminal structure** | organized / semi-organized / diffuse / null | **READER** `deriveCriminalStructure` `src/domain/display/defenseDisplay.js:189` (uses `crimeSignalOf` crimeSignal.js:37 and `isCriminalInstitution` corruption.js:575). Callers: DefenseTab, defenseStateProse:865, printProse:423, pdf viewModelBodySlices:155. Competitors: `priorityHelpers.js:76 hasCriminalInst` (21 uses; safetyProfile, stressFactions); `safetyProfile.criminalInstitutions` (40 refs, its own label table); `SummaryTab.jsx:29 characterSentence hasCrim`; `economicState.js:338` hasMarket (black market); `npcGenerator.js` (12 sites); `relationshipArchetypes.js` (5); `serviceClassifier.js` (6) | coh:crime-denied-and-listed (text vs text); A-06:crime-absent-and-organised (text only) | **COMPETING.** Summary tab and safety profile classify crime without deriveCriminalStructure. Both instruments read page text, never the record. |
| **institutions present (general)** | live roster | **READER** `liveInstitutions` `src/domain/institutions/institutionRoster.js:53` (47 uses) + `nativeSemanticName` (57). Competing: 69 raw `.institutions \|\| []` reads, `getInstitutionNames` priorityHelpers.js:45 (flag bag, birth names, feeds 18 `getInstFlags` callers), `stressGenerator.js:105-115` flag bag | reader:scale-lists `[~strength-no-house]` (STRENGTH_HOUSES); reader:hook-pools / daily-life (raw `houseNames`) | Instruments use the raw roster (readerBattery.js:101 `houseNames`); defenseFacts uses the live one, so a ruined watch counts for daily-life but not for defense-words. |
| ↳ mill | | SCATTERED: `hasImportProcessor` foodBalance.js:~640 (grain processor, 3 uses) is the nearest reader. Also `foodGenerator.js:176`, `serviceClassifier.js:62`, `foodBalance.js:142`, `tradeGoods.js:29`, `institutionClassify.js:129 foodAnchorPredicate`. 16 sites / 5 files | reader:scale-lists (Milling) | |
| ↳ smith | | SCATTERED: `serviceClassifier.js:428`, `foodBalance.js:653`, `tradeGoods.js:30`, `economicState.js:309`, `historyGenerator.js:87`, `events/registry.js:86`. 8 sites / 6 files | reader:scale-lists (Metalworking) | |
| ↳ docks / port | | SCATTERED: `priorityHelpers.js:65 hasPort` (PORT_INFRA_RE), `seaLanes.js:186 hasWaterAccessInstitution`, `npcGenerator.js :: generateNPCs` (`hasPort`), `institutionProbability.js:161`, `historyEventStrands.js:114`, `serviceClassifier.js:138`, `foodBalance.js:156`, `economicState.js:134`. 20 sites / 13 files | A-11 airship licence (checks.mjs:148, /airship/) | |
| ↳ quarry / mine | | SCATTERED: mine 12 sites / 10 files (`foodGenerator.js:269`, `factionDynamics.js:35`, `prosperity.js:159`, `tradeGoods.js:64`, `economicState.js:552`, `narrativeGenerator.js:629` …); quarry 1 | reader:scale-lists (Mining, Stone quarrying) | |
| ↳ fishery | | see food sources | coh:food-words; A-11 | |
| ↳ tavern / inn | | SCATTERED: `serviceClassifier.js:49 classifyService` only (4 sites) | X-47:tavern-name (name leak only) | Daily Life names "the tavern" without asking. |
| ↳ school / academy | | SCATTERED: 6 sites / 6 files (`foodGenerator.js:333`, `serviceClassifier.js:418`, `npcGenerator.js:928`, `historyGenerator.js:147`, `isolationGenerator.js:97`, `defenseGenerator.js:102`) | none | |
| ↳ bathhouse | | no reader, 0 sites | none | |
| **ruler kind** (council, lord, mayor, priest-king, elder) | `powerStructure.government` label; governing faction | **READER** for the faction: `governingFactionOf` `src/domain/rulingPower.js:224` (46 uses); seat holder `seatHolder.js`, `rulingChainOf` powerStrata.js:310. **No reader for the KIND:** the `powerStructure.government` string (28 reads) is matched by pattern at each site: `causalState.js:896` (LAWFUL/ANARCHIC_GOVERNMENT_PATTERN), `militaryStrength.js:255` (MARTIAL/PACIFIST), `religionState.js:756-789`, `religiousContest.js:195`, `factionDynamics.js:351 govIsTheocratic`, `settlementQuickGuide.js:253`, `warStatus.js:334`, `defenseStateProse.js:807`; `governmentLabelFor` rulingPower.js:214 writes it; readerBattery `SEAT_ROLE` /Elder\|Mayor\|Lord Mayor\|Governor/ :256 | coh:seat-holder; A-08:hidden-ruler-note; A-14:lord-mayor-small; reader:relation-types (seat factions) | **NO READER** for ruler kind as a class. |
| **culture** | culture key | **READER** `resolveSettlementCulture` `src/domain/resolveCulture.js:63` (7 uses with resolveCulture). Competing: 30 raw `config.culture` reads (mostly gallery/share/AI persona), 44 `culturalIdentity` refs | none (A-11 culture judged by the chair) | |
| **climate** | | No record field. World-level only: `climateBandFor` `worldPulse/seasons.js:212`, `climateBandOf` `spatial/spatialDigest.js:431` | none | **NO READER** on the record. |
| **season** | | No record field. World clock only: `seasonForTick` `worldPulse/worldState.js:742`, `seasonOfWeek` `traditions/almanac.js:40` | none | **NO READER** on the record. A generated "this winter" line has nothing to check. |
| **imports / exports** | lists | **READER** `canonExports`/`canonImports`/`canonExportsPresent` canonicalAccessors.js:54/86/75 (23 uses). Competing: 51 raw `economicState.primaryExports/Imports` reads (incl. readerBattery.js:173 `readerDistributions`); `resourceAnalysis.imports.critical` (checks.mjs:144, 5 refs) is a different list | reader:scale-lists `[luxury-imports]` (reads the page's Imports line); A-11 `importsFish` | Two import lists (economicState vs resourceAnalysis.imports.critical). |

#### Facts with NO reader

- **Ruler kind** (council / lord / mayor / priest-king / elder). Each of ~10 sites matches the `powerStructure.government` string with its own pattern.
- **Migration direction** (in / out).
- **War state on a standalone record.** Only the world-level `settlementWarStatus` exists.
- **Climate** and **season** (no record field at all).
- **Terrain class.** It is a raw field, read through two different fallback chains (`readerBattery.js:40` vs `checks.mjs:208`).
- **Population band.** `OWNER_BANDS` (checks.mjs:37) and `TIER_STAMP_CUTS` exist, but nothing answers "is this a small place".
- **Most single institutions:** tavern, school, bathhouse, smith, quarry/mine, docks (no `hasX(settlement)` reader); mill only through `hasImportProcessor`.
- **The active crisis kind across carriers.** No function maps stress / pulse stressor / activeConditions to one kind.

#### Facts with COMPETING readers (disagreements found)

1. **Watch:** `defenseFactsOf.hasWatch` (watch only) vs hook-truth `hasWatch` (watch or militia) vs reader:daily-life `WATCH_HOUSE` /watch|guard|garrison/ (raw names) vs `priorityHelpers.hasWatch` (feeds 13 safetyProfile lines).
2. **Walls / gate:** `defenseFactsOf` vs `priorityHelpers.getInstitutionNames` hasWalls/hasGates, which safetyProfile.js prose reads ~8 times. They disagree on whether a palisade has a gate.
3. **Guard presence in hooks:** reader:hook-pools reads `ENFORCEMENT_HOUSE`/`ENFORCEMENT_ROLE` (readerBattery.js:380-381), not `defenseFactsOf`.
4. **Hospital:** `defenseFactsOf.hasHospital` vs `priorityHelpers.hasHospital` (which includes monastery/healer/friary), still read at `generalStateProse.js:1207`.
5. **Stored months:** `foodSecurity.storageMonths` (defenseFactsOf, foodLedger, hook-truth) vs `foodRecord.storageMonths` (foodEnduranceOf, X-49, foodWords). They drift because the pulse writers change only the first (`foodStockpile.js:406`, `applyWorldPulse.js:106`, `generosityUpdates.js:65`).
6. **Famine:** `recordAllowsStarving` (band deficit|famine) vs hook-truth (label in CRISIS_BANDS and months<2) vs A-01 (not famine and gap<20) vs `stressTypes.includes('famine')`.
7. **Water:** `waterAccessKind` (the domain reader, used by no instrument) vs `hasNavigableWater` vs `WATER_TERRAIN` vs checks `hasWater` vs `npcGenerator` (counts a `coastal` route) vs `viability.deriveWaterDependencyAnalysis` vs `priorityHelpers.hasPort`.
8. **Market:** `hasMarketInstitution` vs `arrivalScene.holdsMarket` vs substring flags in foodGenerator, stressGenerator and priorityHelpers (which count 'black market' and 'stock exchange').
9. **Magic on/off:** `magicWorksAt` vs `features.mjs:97` (missing reads as 'off') vs 58 raw `magicExists` reads.
10. **Crisis list:** `canonStressors` (stressors→stress→stresses) vs `crisisEntriesOf`, `hookTruthRecord.js:70`, `checks.mjs:287` and `features.mjs:83` (`stress` only). Siege also has four separate readings.
11. **Faith:** `faithReadingOf` vs `priorityHelpers.hasChurch` (War & Faith state-prose premise) vs 80+ name tests.
12. **Crime:** `deriveCriminalStructure` vs `SummaryTab.jsx:29 hasCrim` vs `priorityHelpers.hasCriminalInst` vs `safetyProfile.criminalInstitutions`.
13. **Live vs raw roster:** `defenseFactsOf` and `faithReadingOf` read `liveInstitutions`. `hasMarketInstitution`, every readerBattery check and `getInstitutionNames` read the raw roster, ruined rows included.

## Appendix B — the pool inventory outside the wiring census (sub-seat table)

### Unit 2 inventory: non-state-prose pools the generator draws DM-facing lines from

Audited read-only on branch lane/census-0-2026-11-04, 2026-11-04. Scope: every pool, list or table outside the 708 censused DS-* state-prose pools. Paths are relative to `src/`. Counts are exact element counts from importing the module at runtime or from an AST scan. Counts marked as inline literals (≈) are approximate counts of literals in state-branch code.

Kinds: **K** kernel eligibleVariants/drawVariant · **H** deterministic hash (fnv/pickVariant/stable index; 0 rng) · **R** seeded rng stream · **T** state-keyed table lookup · **A** all items printed.

Groups: GEN = generation-time (stored on the settlement) · DISP = display-time read model · STATE = state-prose family not in wiring-census.json.

| # | grp | file:line | pool | surface(s) | lines | draw site | kind | dimension / gate already declared | RNG note |
|---|---|---|---|---|---|---|---|---|---|
| 1 | GEN | data/npcData.js:6 | MANNERISMS (tells) | NPCs, PDF, Foundry | 30 | npcGenerator.js:323 → hookVariety.js:93 drawUnique | R | none | 1 roll always (HK-LAW-6); 0 if pool empty |
| 2 | GEN | data/npcData.js:39 | SPEECH_PATTERNS | NPCs, PDF, Foundry | 30 | npcGenerator.js:324 → drawUnique | R | none | as above |
| 3 | GEN | data/npcData.js:77 | NPC_PERSONALITY_TRAITS (pos/neg/neutral) | NPCs | 105 | npcGenerator.js:316-318 pickFromArray | R | none | 1 roll each |
| 4 | GEN | data/npcData.js:196 | NPC_AGE_DATA | NPCs | 16 | npcGenerator.js:353 pickFromArray ×2 | R | none | 2 rolls |
| 5 | GEN | data/npcData.js:337/350/385 | NPC_BUILDS / NPC_FEATURES / NPC_WANTS (clothes) | NPCs | 94 | npcGenerator.js:354-356 pickFromArray | R | none | 1 roll each |
| 6 | GEN | data/npcData.js:203 | NPC_PLOT_HOOKS (impression/disposition by role) | NPCs, Tonight sheet | 28 | npcGenerator.js:692 pick | R | none | 1 roll |
| 7 | GEN | data/npcData.js:1252 | NPC_PLOT_HOOKS_DATA (behaviour by disposition) | NPCs | 4 | npcGenerator.js:696 | T | none | — |
| 8 | GEN | data/npcData.js:458 | NPC_FACTION_GOALS (short/long by role) | NPCs, Tonight sheet, PDF | 54 | npcGenerator.js:613 pickFromArray | R | defenceTwinLine + inlandHookLine post-draw (npcGenerator.js:118) | 1 roll; reached only if stress-goal roll at :608 fails |
| 9 | GEN | generators/npcGenerator.js:374 | STRESS_GOALS (inline, by stress) | NPCs | 40 | npcGenerator.js:608 pickFromArray | R | twin/inland post-draw (:118) | ⚠ `stressGoals.length>0 && _rng()<0.4`: the 0.4 roll exists only if pool non-empty → a filter emptying it removes a roll |
| 10 | GEN | data/npcData.js:1165 | NPC_SECRETS (goal fallback by category) | NPCs | 14 | npcGenerator.js:627 pickFromArray | R | twin/inland post-draw | 1 roll (fallback branch) |
| 11 | GEN | data/npcData.js:1066 | NPC_FACTION_LOYALTY (NPC plot-hook titles) | NPCs, Plot Hooks, Tonight sheet | 80 | npcGenerator.js:659/683/687 drawLoyalty → drawUnique | R | inlandHookLine F5 post-draw (:126-127); themes registry | 1 roll + conditional `_rng()<0.45` (thorp/hamlet), biased-cat pick; 2nd hook gated by `_rng()>0.5` (:127) |
| 12 | GEN | data/npcData.js:1259 | NPC_PRESENTATION_MODES | NPCs | 9 | npcGenerator.js:844-846 pickRandom2 | R | none | random01(0.5) only on significant branch |
| 13 | GEN | data/stressInstitutionEffects.js:23 | STRESS_INSTITUTION_EFFECTS (secret+stakes by stress) | NPCs, Tonight sheet (tonightSheet.js:237 matches), Crisis | 95 | npcGenerator.js:778-780 pickRandom2 | R | secretsHeldByFoodRecord pre-filter (food record) | ⚠ `stressEffects.length>0 && random01(0.45)`: pre-draw food filter can empty pool → random01 + pick vanish |
| 14 | GEN | generators/npcGenerator.js:756 | generateCrimeLevel inline (what/stakes) | NPCs | 4 | npcGenerator.js:754-756 pickRandom2 | R | none | random01(0.25) && allNpcs.length>1 → 0 or 3 rolls |
| 15 | GEN | data/npcData.js:783 | NPC_CRIMINAL_SECRETS (secret+stakes by type) | NPCs, Factions | 62 | factionLeaderSecret.js:89 weighted type roll + :110 pickFromArray(eligiblePool) | R | eligibility pre-filter | weighted = 1 roll (iterates, not re-rolls); pick over filtered pool |
| 16 | GEN | generators/npcGenerator.js:1149 | STRESS_GOAL_OVERRIDES (wartime/military) | NPCs | 12 | npcGenerator.js:1235-1236 | T | defenceTwinLine | — |
| 17 | GEN | generators/npcStructure.js:57-405 | T registry (38 reg() × dominant/subordinate × position/goal/constraint) | NPCs (structuralPosition, activeConstraint, goal.short) | 228 | npcStructure.js:424 T[cat__cond__rank] | T | none (no walls/force words gate) | — |
| 18 | GEN | data/npcData.js:1339 | STRESS_ECONOMIC_EFFECTS (18 tie archetypes, desc+tension pairProse) | NPCs relationships, Power, Factions | 288 | archetype: relationshipArchetypes.js:94 weighted roll; prose: relationshipArchetypes.js:138 createTieProseDraw | H | force words F1 (TIE_FORCE_WORDS / forceWordsOf) | prose 0 rolls (fnv, w/o replacement); archetype 1 roll |
| 19 | GEN | generators/people/ties.js:49 | RELATIONSHIP_STRENGTHS | NPCs relationships | n/a | people/ties.js:144 pick | R | none | 1 roll; short labels (count n/a) — moved whole from the retired pair writer (npcGenerator.js :: generateRelationships) by PEOPLE-4 TIES; re-addressed at MERGE-CAR |
| 20 | GEN | data/narrativeData.js:11 | ARRIVAL_SCENES (by route) | Overview arrival, PDF | 26 | arrivalScene.js:225 pickRandom | R | none | 1 roll |
| 21 | GEN | data/narrativeData.js:151 | STRESS_DESCS (arrival vignettes) | Overview arrival, PDF | 103 | arrivalScene.js:221-224 pickRandom | R | F1 defenseWordsFindings + unheldClaims pre-filter (falls back to full pool) | 1 roll; filter changes modulus only |
| 22 | GEN | data/arrivalProse.js:31 | ARRIVAL_SENSES (+dominant) | Overview arrival | 107 | arrivalScene.js:160 pickRandom(scored) + :248 agreeingLine | R | institution/trade scoring; magicReal; market/catch-rack word check | ⚠ agreeingLine redraws once if first line names absent market → 1–2 rolls, content-dependent |
| 23 | GEN | data/arrivalProse.js:260 | ARRIVAL_PEOPLE (by culture) | Overview arrival | 48 | arrivalScene.js:286 agreeingLine | R | market/catch word check | ⚠ 1–2 rolls |
| 24 | GEN | data/arrivalProse.js:341 | ARRIVAL_TENSIONS (by safety) | Overview arrival | 20 | arrivalScene.js:290 pickRandom | R | none | 1 roll |
| 25 | GEN | data/arrivalProse.js:382 | ARRIVAL_MEMORIES (by history templateType) | Overview arrival | 39 | arrivalScene.js:186-187 → :290 | R | magicReal (wild_magic) | 1 roll |
| 26 | GEN | data/cultureProfiles.js:60 | CULTURE_PROFILES.architecturalDetails | Overview arrival sight | 33 | arrivalScene.js:265-268 pickRandom | R | market/catch word check | ⚠ redraw once on fail → 1–2 rolls |
| 27 | GEN | data/cultureProfiles.js:60 | CULTURE_PROFILES text fields (builtForm, civicPattern, exchange, foodways, sacredLife, defensePattern, socialTexture) | Daily Life, Overview, Config panel | 154 | dailyLifeLogic.js:14 etc. ([0] index) | T | none (defensePattern unguarded) | — |
| 28 | GEN | generators/structuralValidator.js:279-321 | checkInstCompat landmark pools (8 pools) | Overview arrival sight | 16 | structuralValidator.js:279-321 pickRandom | R | speaks() post-check in arrivalScene.js:258 | 1 roll when an institution matches |
| 29 | GEN | data/narrativeData.js:84 | TERRAIN_NARRATIVE_HOOKS (founding reason by terrain/route) | History founding, Overview | 48 | narrativeGenerator.js:238 reasonPool → :410 pick | R | none | 1 roll over merged reasonPool (size varies with commodity) |
| 30 | GEN | generators/narrativeGenerator.js:244 | COMMODITY_HOOKS (merged into reasonPool) | History founding | 24 | narrativeGenerator.js:295 → :410 pick | R | none | shares the :410 roll |
| 31 | GEN | generators/narrativeGenerator.js:300/342/377 | FOUNDERS_BY_TIER / CHALLENGES_BY_ROUTE / OVERCOMING_BY_PROSPERITY | History founding, Overview | 58 | narrativeGenerator.js:411-415 pick | R | none | 3 rolls |
| 32 | GEN | data/narrativeData.js:396 | STRESS_NOTES (founding note by stress) | History | 45 | narrativeGenerator.js:417 pickVariant | H | F1 licensedNotes (:208) | 0 rolls; filter changes modulus |
| 33 | GEN | generators/narrativeGenerator.js:657 | _getSettReason inline (5 pools) | Overview | 10 | narrativeGenerator.js:657-680 pickRandom | R | none | 1 roll |
| 34 | GEN | generators/narrativeText.js:73 | PRESSURE_SENTENCES (15 stresses) | Overview pressure line, Tonight sheet | 88 | narrativeGenerator.js:796 pickRandom2 | R | F1 defenseWordsFindings pre-filter (:795) | 1 roll (+ succession_void closure rolls) |
| 35 | GEN | generators/narrativeGenerator.js:819 | thorpPressures | Overview | 7 | narrativeGenerator.js:828 _rng()*len | R | none | 1 roll |
| 36 | GEN | generators/narrativeText.js:235 | POLITICAL_FLAVOR (8 patterns; closures pick event names) | Overview / History character | 56 | historyCoherence.js:55/81/84 pickRandom2 | R | none | ⚠ random01(0.15/0.6/0.5/0.65) cascade + inner pickRandom2 over filtered events per template |
| 37 | GEN | generators/narrative/settlementOriginProse.js:68 | ORIGIN_POOLS (5 arms) | History origin, Overview | 40 | settlementOriginProse.js:207 pickVariant | H | arm selection by state | 0 rolls |
| 38 | GEN | generators/legacyGenerator.js:88 | MUNDANE_LEGACY_VOICE (drift/unresolved) | History | 8 | legacyGenerator.js:124 stableEventPick | H | none | 0 rolls |
| 39 | GEN | generators/power/settlementNarrative.js:29 | STRESS_RUMORS (relationship rumour phrasings) | Overview / Power rumour | 4 | settlementNarrative.js:227 pickRandom2 | R | none | ⚠ random01(0.4) gate + one _rng() PER relationship in scoring (:215) → count = relationships.length |
| 40 | GEN | generators/power/settlementNarrative.js:10 | STRESS_FLAVOR (rel-type preferences) | (selector, no prose) | 41 | settlementNarrative.js:213 | T | — | — |
| 41 | GEN | data/historyData.js:1120 | HISTORICAL_EVENTS_DATA (29 templates: desc, hooks, effects) | History, Overview, PDF | 189 | fill: historyGenerator.js:451 pick; timeline: :582 _rng()*len | R | worldLaw.allowsHistoryEvent pre-filter; crime-signal set-aside (crime_wave) | ⚠ fill is a rejection loop (redraw on set-aside, extra _rng()>0.7 guild bias per iteration); timeline do/while category rerolls ≤5 and `if(!pool.length) continue` skips the roll |
| 42 | GEN | data/historyDescVariants.js:18 | HISTORY_DESC_VARIANTS (29 types × 2) | History | 58 | historyData.js:1598 pickVariant | H | none | 0 rolls |
| 43 | GEN | generators/historyGenerator.js:190 | defaultTokens ({quarter},{deity},{founder}… 26 token lists) | History | 100 | historyGenerator.js:190-230 pick | R | none | ⚠ every token list rolled eagerly (fixed count); short phrases |
| 44 | GEN | generators/history/historyEventStrands.js:123-208 | strand token lists ({former_ruler},{deity},founderDesc…) | History | 45 | historyEventStrands.js:123-208 pick | R | none | fixed count per strand |
| 45 | GEN | generators/historyGenerator.js:268 | ECHO_PREFIXES (history) | History | 5 | historyGenerator.js:279 _rng()*len | R | none | 1 roll |
| 46 | GEN | generators/historyGenerator.js:675 | generateRelationshipEvent lastingEffects / plotHooks | History | 16 | historyGenerator.js:760 _rng()*len + pick severity | R | none | 1–2 rolls |
| 47 | GEN | generators/historyGenerator.js:897 | ANCIENT_RUIN_PREFIXES/SUFFIXES | History | n/a | historyGenerator.js:896-897 | R | config gate | random01 + 2 picks; names (count n/a) |
| 48 | GEN | data/institutionalCatalog.js:97 | institutionalCatalog / INSTITUTION_FAMILIES desc (base description) | Institutions, PDF, Foundry | 519 | assembleInstitutions.js (copy of catalog desc) | T | SHIP_WORD → INLAND_DESCRIPTIONS (F5); defenceTwinLine; speakTierNoun | — |
| 49 | GEN | data/institutionDescVariants.js:1359 | INSTITUTION_DESC_VARIANTS (518 keys; 332 distinct pairs) | Institutions, PDF, Foundry | 664 | assembleInstitutions.js:65 shipFreeDesc + :1004 pickVariant | H | SHIP_WORD dry-filter (F5) + defenceTwinLine (F1) + INLAND_DESCRIPTIONS | 0 rolls; ship filter changes modulus (selection, not stream) |
| 50 | GEN | data/inlandDescriptions.js:14 | INLAND_DESCRIPTIONS (inland twins) | Institutions | 4 | assembleInstitutions.js:66/1003 | T | F5 inland twin | — |
| 51 | GEN | data/institutionServices.js:32 | INSTITUTION_SERVICES desc (978 services / 286 institutions) | Services/Institutions, PDF, Foundry | 978 | roll: services/institutionServices.js:69/203 `_rng()<threshold`; print serviceRollMaterialization.js:75 | A | defenceTwinLine (F1) at materialization | ⚠ one _rng() per eligible def, short-circuited by `force \|\| p>=1` → a pre-roll filter changes roll count |
| 52 | GEN | generators/servicesGenerator.js:181 | generateAvailableServices inline (name/desc) | Services | 15 | servicesGenerator.js:181+ | A | none | — |
| 53 | GEN | generators/steps/cascadePass.js:118 | MARITIME_INSTS desc | Institutions | 2 | cascadePass.js:131 rng.chance | A | maritime gate | 1 roll per inst |
| 54 | GEN | generators/isolationGenerator.js:25 | MAINTAINER_DESC | Institutions/Isolation | 3 | isolationGenerator.js:117/124 | T | none | — |
| 55 | GEN | data/economicData.js:24 | TRADE_DEPENDENCY_NEEDS (label/detail by institution) | Economics, Resources | 80 | economy/economicState.js:707 | T | none | — |
| 56 | GEN | data/finishedGoodsCategory.js:58 | INSTITUTION_FINISHED_GOODS_DEMAND | Economics | 15 | economy/finishedGoodsDemand.js:35 | A | none | — |
| 57 | GEN | data/resourceData.js:14/371 | RESOURCE_DATA desc/warning/label + SPECIAL_RESOURCES | Resources, Economics | 67 | resourceGenerator / display lookups | T | none | — |
| 58 | GEN | data/supplyChainData.js:64/729 | SUPPLY_CHAIN_NEEDS (desc/label/entrepotNote) | Economics supply chains | 189 | computeActiveChains.js:267; SupplyChainsPanel.jsx:12 | A | none | — |
| 59 | GEN | data/tradeGoodsData.js:68/149 | IMPORT_GOODS_BY_TIER / GOODS_MODIFIERS_BY_TIER desc | Economics trade lists | 86 | economy/tradeGoods.js | A | requiredInstitution | — |
| 60 | GEN | generators/economy/tradeGoods.js:242 | UPGRADE_GOODS_BY_TIER | Economics | 13 | tradeGoods.js | A | none | — |
| 61 | GEN | generators/demandProfile.js:15 | FACTION_DEMAND | Economics | 186 | demandProfile.js:190 | A | none | — |
| 62 | GEN | generators/computeActiveChains.js:865/953 | deriveImportsFromChains labels + INSTITUTIONAL_SERVICE_MAP | Economics | 20 | computeActiveChains.js:1018 | A | none | — |
| 63 | GEN | generators/economy/economicState.js:60-240 | income-source desc lines incl. rent lines (Agricultural/Property/Church Rents) | Economics | 56 | economicState.js inline branches | T | F1 walls inline at :173 | slave-labour branch `_rng()<slaveChance` (:664) |
| 64 | GEN | generators/economy/foodBalance.js:463 | food balance analysis + suggestedFixes | Economics food | 71 | foodBalance.js inline | T | food record | — |
| 65 | GEN | generators/economy/viability.js:179/293 | viability / power-dynamics suggestedFixes | Economics viability | 58 | viability.js inline | T | none | — |
| 66 | GEN | data/powerData.js:8 | FACTION_DESCRIPTORS (faction names) | Factions, Power, NPCs | 36 | factionGrouping.js generateFactions; applyDensityLaw.js:280 rng.random()*len; stressFactions.js:30 first-unused | R | — | ⚠ generateFactions uses a draw-count-VARIABLE retry loop (powerData.js:69-71) |
| 67 | GEN | data/powerData.js:81 | FACTION_DESCRIPTORS_EXTRA (dedup names) | Factions | 54 | stressFactions.js:30; factionDedup.js:73 | T | — | rng-free |
| 68 | GEN | generators/power/rulingStructure.js:221-430 | councilName / govDescByLabel / govDescByFaction | Power | 53 | rulingStructure.js inline | T | F10 defenceTwinLine (:355) | — |
| 69 | GEN | generators/power/governanceNarrative.js | governance narrative branches (≈95 literals) | Power | 95 | governanceNarrative.js inline | T | F10 twin (:746) | — |
| 70 | GEN | generators/power/stressFactions.js | stress-faction desc lines (≈39 literals) | Factions, Power | 39 | stressFactions.js inline | T | F1 force words (:51) | — |
| 71 | GEN | generators/power/conflicts.js:106 | issueTemplates (issue/stakes) + buildConflictPlotHooks | Factions, Plot Hooks | 12 | conflicts.js:185 pick | R | worldLaw.allowsGeneratedContent + maritime pre-filter (falls back) | 1 roll |
| 72 | GEN | generators/crossSettlementConflicts.js:33 | CONFLICT_NATURE (8 rel types) | Neighbours/Relationships, Factions | 44 | crossSettlementConflicts.js:235 rng.pick | R | none | ⚠ `if(!poolA.length\|\|!poolB.length) continue` skips 3+ picks |
| 73 | GEN | generators/crossSettlementConflicts.js:81/129 | buildConflictDesc / buildFactionDesc templates | Neighbours/Relationships | 23 | crossSettlementConflicts.js:123/160 rng.pick | R | none | 1 roll each |
| 74 | GEN | generators/neighbourGenerator.js:312/391/462 | mirror/oppose faction labels + MUNDANE_LORE_LABELS | Factions (neighbour) | 64 | neighbourGenerator.js:456 index from neighbourFactions.js:51 rng.randInt(0,3) | R | mundane-lore (magic off) | 1 roll, modulus by pool length |
| 75 | GEN | generators/steps/corruptionPass.js:28 | CORRUPT_SHORT_GOAL | NPCs | 5 | corruptionPass.js:79 | T | none | — |
| 76 | GEN | generators/stressNarrative.js:76 | RENDERERS (stress narrative) | Overview stressors | 15 | stressNarrative.js:58 | T | none | — |
| 77 | GEN | generators/spatialGenerator.js:61-345 | quarters desc/landmarks, LAYOUT_BY_TIER, thorpLayouts, TRADE_ACCESS_BY_ROUTE | Overview layout, Daily Life, Map | 69 | spatialGenerator.js inline | T | institution presence | — |
| 78 | GEN | generators/safetyProfile.js | safety profile lines (≈128 literals) | Defense, Overview | 128 | safetyProfile.js inline | T | none audited | — |
| 79 | GEN | generators/threatDefensePolicy.js:32 | DEFENSE_PREFERENCES | Defense | 2 | threatDefensePolicy.js:72 | T | none | — |
| 80 | GEN | generators/structuralValidator.js:57/659 | SPATIAL_FEATURES + suggestedFixes | Institutions/Viability | 31 | structuralValidator.js | A | none | — |
| 81 | GEN | data/defenceTwinLines.js:28 | DEFENCE_TWIN_LINES (needs: walls/soldiers) | (rewrites other pools) | 10 | defenceTwinLines.js:76 defenceTwinLine | T | IS the walls/soldiers gate | — |
| 82 | GEN | data/inlandHookLines.js:20 | INLAND_HOOK_LINES | (rewrites hooks) | 2 | inlandHookLines.js:35 | T | IS the F5 inland gate | — |
| 83 | GEN | data/stressorSpinePhrases.js:52 | STRESSOR_SPINE_PHRASES (fear/strain) | Overview spine, Pipeline rail | 30 | simulationSpine.js:387/402 | T | none | — |
| 84 | GEN | data/stressTypes.js:10 | STRESS_TYPE_MAP (crisisHook/viabilityNote/label) | Overview, Crisis, Config | 32 | resolveStress.js / isolationGenerator.js:195 | T | none | stress roll shuffles keys (stressGenerator.js:333) |
| 85 | GEN | data/biomeTexture.js:57 | TERRAIN_SEASON_TEXTURE | Overview / Daily Life | 32 | biomeTexture.js:116 | T | none | — |
| 86 | GEN | data/traditionCorpus.js:89/101/110 | TRADITION_NAME_TEMPLATES / ADJECTIVES / CULTURE_FLAVOR | Faith/Traditions | 54 | traditions/genesis.js:251-260 r.pick | R | none | local createPRNG + fork; motif reroll loop ≤5 (forked per attempt, :381) |
| 87 | GEN | data/traditionCorpus.js:132 | TRADITION_TRAPPINGS | Faith/Traditions | 24 | genesis.js:274 pickTrappings; politics.js:275 | R | none | ⚠ rng.shuffle over pool → pool.length−1 rolls (count-dependent), local PRNG |
| 88 | GEN | data/traditionCorpus.js:145 | TRADITION_EPITHETS | Faith/Traditions | 6 | genesis.js:409; politics.js:279 fork(epithet).pick | R | none | fork-isolated |
| 89 | DISP | data/traditionProse.js:39-79 | TRAD_HOOKS / HELD / CANCELLED summaries / OUTCOME_PHRASE | Faith/Traditions, Plot Hooks | 43 | traditions/prose.js:40 pickLine (fnv) | H | condition priority | 0 rolls |
| 90 | DISP | domain/dossier/hookLines.js:80-163 | HOOK_LINE_POOLS (licence/jurisdiction/property/revenue/people/seat/standing) + FOOD_GAP_LINES | Plot Hooks, Overview | 42 | hookLines.js:208 createConflictHookDraw; :226 foodGapHookLine | H | hookTruth (plotHooks.js:266) | 0 rolls; w/o replacement per town |
| 91 | DISP | domain/dossier/plotHooks.js:143 | ECHO_PREFIXES (dossier) | Plot Hooks | 5 | plotHooks.js:166 | A | hookTruth | — |
| 92 | DISP | domain/dossier/powerSupport.js:86 | ALIGNED_BASIS | Institutions, Power, PDF | 13 | powerSupport.js:112 | T | none | — |
| 93 | DISP | domain/crisis/crisisCast.js:142/189/206 | CAST_REASONS / CAST_ABSENCES / STAKE_REASONS | Crisis tab, Tonight sheet, Plot Hooks | 61 | crisisCast.js:461-701 | T | defenceTwinLine (:515, :701) | — |
| 94 | DISP | domain/crisis/crisisHooks.js:74 | LINE_ROLE_CLAUSE | Overview, Crisis, PDF | 6 | crisisHooks.js:162 | T | hookTruth (refuse/speakTruthfully) | — |
| 95 | DISP | domain/summary/settlementQuickGuide.js:512/675 | SCOPE_PHRASE / FOOD_SECURITY_CLAUSE | Overview quick guide | 17 | settlementQuickGuide.js:542/687 | T | food record | — |
| 96 | DISP | domain/hookEscalation.js:194/387 | ORIGIN_CONSEQUENCES / CLOCK_TEMPLATES | Plot Hooks (clocks), print prose | 60 | hookEscalation.js | T | none | — |
| 97 | DISP | domain/display/settlementRumors.js:123 | WHAT_PHRASES (canonical) | Rumours tab, briefs, PDF | 217 | settlementRumors.js:592 | T | none | — |
| 98 | DISP | domain/display/rumorPhrasePools.js:61 | WHAT_PHRASE_POOLS (63 keys) | Rumours tab, PDF | 375 | settlementRumors.js:634 avalanche(fnv)%len | H | none | 0 rolls |
| 99 | DISP | domain/display/rumorFallbackPhrasePools*.js | WAR/TRADE/FAITH/DIVINATION/EVENTS fallback pools + canonicals | Rumours tab | 660 | settlementRumors.js:634 | H | none | 0 rolls |
| 100 | DISP | domain/display/settlementRumors.js:712 | HEADLINE_FRAMES | Rumours tab | 16 | settlementRumors.js:748 fnv%len | H | none | 0 rolls |
| 101 | DISP | domain/display/causeConjunction*.js (12 role files + class + full) | role × situation × cause × stage content | NPCs (npcComponents.jsx) | 1116 | causeConjunctionContent.js:212-224 fnv%len | H | none | 0 rolls |
| 102 | DISP | domain/display/causeLifecycleVocabulary.js:39-93 | CAUSE_MECHANISM_PHRASE / STAGE_TEMPLATES / HISTORICIZE | NPCs | 34 | causeLifecycleVocabulary.js:146-152 | H | age band | 0 rolls |
| 103 | DISP | domain/display/warAndRoadNames.js:98-426 | WAR_NAME_POOLS / UNTYPED_WAR_NAME_MOLDS / WAR_REASON_CLAUSES / ROUTE_NAME_POOLS | War desk, Map | 70 | warAndRoadNames.js:275-276 pickLine | H | none | 0 rolls |
| 104 | DISP | domain/display/treatyDocument.js:53/154 | TREATY_COMPLIANCE_VOICE / FLOOR | War desk, Treaty panel, PDF | 42 | treatyDocument.js:173 | T | none | — |
| 105 | DISP | domain/display/warRemembrance.js:132-162 | ENDED_WORDS / RAN_WORDS / WAR_ENDING_TELLINGS | Herald, World book | 23 | warRemembrance.js:378 | T | none | — |
| 106 | DISP | domain/display/armyStrength.js / mobilizationStatus.js / occupationStatus.js | STRENGTH/REMAINING/CONDITION bands, FEASIBILITY_PHRASE, STATE_PHRASE | War desk | 24 | band lookups | T | none | — |
| 107 | DISP | domain/display/engagementNarrative.js:138/190 | ENGAGEMENT_PHASES / KIND_OPENINGS | (no importer found — dead?) | 35 | — | T | none | — |
| 108 | DISP | components/settlement/faithPanelModel.js:97/117 | CAUSE_SENTENCE / FALL_SENTENCE | Faith tab, War tab, print | 8 | faithPanelModel.js:174-175 | A | value threshold | — |
| 109 | DISP | domain/display/deityEffects.js:115 | DEITY_AXIS_EFFECTS | Faith/Magic tab, Pantheon, PDF | 7 | deityEffects.js:227-228 | A | axis sign | — |
| 110 | DISP | domain/display/marketPrices.js:70/229 | MOVEMENTS / CRIER_FRAMES | Economics | 12 | marketPrices.js:205 + fnv frame | H | none | 0 rolls |
| 111 | DISP | domain/foodways.js:23/32 | SOURCE_PHRASES / FRAMES (+library) | Economics, Daily Life PDF, Foundry | 12 | foodways.js:69-88 fnv offset + probe loop | H | claimless filter (food words) | 0 rolls |
| 112 | DISP | domain/display/institutionVocabulary.js:55 | INSTITUTION_IDENTITY | Institutions | 286 | institutionVocabulary.js:637 | T | none | — |
| 113 | DISP | domain/display/humanizeEngineTokens.js:243 | DISPLAY_LEXICON | many tabs | 77 | humanizeEngineTokens.js | T | none | — |
| 114 | DISP | domain/display/demographicReading.js:105/138 | OCCUPANCY_SENTENCES / CHIP_LABELS | (no importer found) | 26 | demographicReading.js:242 | T | none | — |
| 115 | DISP | domain/display/glossary.js:70-96 / state/bands.js:144 | STRAIN/CAPTURE/SEVERITY/MAGNITUDE defs, BAND_HINT | Glossary, System bar, PDF | 21 | lookups | T | none | — |
| 116 | DISP | domain/rulingPower.js:190/414 | GOVERNMENT_DESCS / STABILITY_BY_CAUSE | Power, Institutions | 18 | rulingPower.js:543/670 | T | none | — |
| 117 | DISP | domain/activeConditions.js:58 | CONDITION_ARCHETYPE_TEMPLATES | Overview conditions | 46 | activeConditions.js:1005 | T | none | — |
| 118 | DISP | domain/threatProfile.js:95 | THREAT_TYPE_TEMPLATES | Defense, Daily Life | 12 | threatProfile.js:684 | T | none | — |
| 119 | DISP | domain/npcProfile.js:81/136, factionProfile.js:158, districtProfile.js:499, contradictions.js, supplyChainState.js:247, resourceSemantics.js:42, factionRelationshipUpdate.js:51 | profile/explanation pools (NPC_TEMPLATES, REMOVAL_CONSEQUENCES, ARCHETYPE_TEMPLATES, inferHook, detectors, NEED_HEURISTICS, RESOURCE_SEMANTICS, ARCHETYPE_IMPACTS) | Explain panels, AI grounding, Daily Life, events | 304 | per-module lookups | T | none | — |
| 120 | DISP | components/new/dailyLifeLogic.js:179-200 + DailyLifeTab.jsx:80/314 | TERRAIN_CONTEXT / ROUTE_CONTEXT / DEFENSE_CONTEXT + tab inline | Daily Life | 27 | dailyLifeLogic.js | T | ⚠ DEFENSE_CONTEXT prints "walls"/"garrison" keyed on readiness label, not walls fact | — |
| 121 | DISP | domain/relationships/neighbourBackLink.js:35 | CONTACT_DESC | Settlements panel, relationships desk | 10 | lookup | T | none | — |
| 122 | STATE | domain/display/stateProse/decreeProsePools.js:373 (+8 pool exports) | DECREE_PROSE_BLOCKS / EVENT / FORM / HAND / OVERRIDE / PARTY_DEED / STANDING / FOLLOWS_FROM (69 pools) | Decree tracker, Event composer | 194 | decreeProse.js:237 kernel eligibleVariants+drawVariant | K | kernel marks available | 0 rolls |
| 123 | STATE | data/dossierCausalProse.generated.js:28 | DOSSIER_CAUSAL_PROSE (78 families) | Dossier sections (causal lines) | 468 | causalDossierProse.js:112-115 eligibleVariants+drawVariant (marks = arm) | K | marks channel (arm only; 0 walls marks) | 0 rolls |
| 124 | STATE | data/dossierConnectives.generated.js:20 | DOSSIER_CONNECTIVES (4 relations) | Dossier state prose joints | 12 | composeStateProse.js joint draw (list length = modulus) | H | no modifier seats today | 0 rolls |

#### Totals

- **Pools (rows): 124**, covering about **10,866 lines/entries**. A few rows group same-file sub-pools; see the pool names.
- By group: GEN 88 pools / 6467 lines · DISP 33 pools / 3725 lines · STATE 3 pools / 674 lines
- By draw kind: **A** 13 pools / 1555 lines · **H** 17 pools / 3495 lines · **K** 2 pools / 662 lines · **R** 45 pools / 1966 lines · **T** 47 pools / 3188 lines
- By primary surface: Institutions/Services 10/2515 · NPCs 22/2348 · Rumours 4/1268 · Economics/Resources 13/865 · Overview/Tonight 21/804 · Dossier/Decree state prose 3/674 · History 13/636 · Other (lexicons, explain panels, rewriters, dead) 9/526 · Factions/Power 10/438 · Defense/War 7/301 · Daily Life 2/181 · Plot Hooks/Crisis 4/168 · Faith/Traditions 6/142
- **Out of generator scope, counted but not tabled:** src/domain/worldPulse/** plus realm/region (Herald, news, envoys, war and commerce receipts) has 153 pools / 1,992 entries. These are almost all **H**, drawn through eventProse.js pickLine/pickLineWithFamily (fnv) and proseSelection.js:76. The display-side herald and news pools are newsVoice.js:92 VOICE_LINES 318 + VOICE_FLOOR 24, newsBody.js:93 BODY_POOLS 32, chroniclersLetter, chronicleReadModel QUIET_FALLBACK 16, heraldCausalGrammar TERMINALS 12 (pickCausal), heraldIntegrity 18, discourseKernel.js:296 pick (H), and data/roadsProse.js ROADS_NEWS 128. UI chrome copy (src/copy, components/legal, account, compendium) is excluded.
- **Dead or unimported pools:** engagementNarrative.js (35) and demographicReading.js (26) have no importer in src.

#### Distinct bespoke draw functions that would need a gate

1. rngContext.js:115 `pick` / helpers.js:62 `pickRandom`,`pickRandom2` / npcGenerator.js:52 `pickFromArray`: one generic R path that serves every R row. ⚠ `pick([])` returns before `_roll()`, so a pre-draw filter that EMPTIES a pool deletes a roll and shifts every later draw. A filter that only shrinks the pool keeps one roll but changes the modulus.
2. hookVariety.js:93 `drawUnique` (MANNERISMS, SPEECH_PATTERNS, NPC_FACTION_LOYALTY): always exactly one roll (HK-LAW-6), so it is safe for a pre-draw gate.
3. npcGenerator.js:600-627 generateNPCGoal (STRESS_GOALS → NPC_FACTION_GOALS → NPC_SECRETS): ⚠ the stress-goal roll is conditional on the pool being non-empty.
4. npcGenerator.js:775-781 secret draw (STRESS_INSTITUTION_EFFECTS + secretsHeldByFoodRecord): ⚠ the random01 roll is conditional on a non-empty filtered pool.
5. npcGenerator.js:654 generatePlotHook / :690 plot-hook impression / :754 crime level / :844 presentation.
6. factionLeaderSecret.js:89-110 (NPC_CRIMINAL_SECRETS).
7. arrivalScene.js:248 `agreeingLine` and :265 architecturalDetails: ⚠ redraw-once rejection, 1–2 rolls depending on content. :221-225 vignette/scene.
8. structuralValidator.js:279 checkInstCompat (landmark sight).
9. narrativeGenerator.js genArrivalDetail (:239-415), _getSettReason (:657), generatePressureSentence (:796/:828), pickNPC (:185).
10. historyCoherence.js:54-84 (POLITICAL_FLAVOR): random01 cascade.
11. settlementNarrative.js:205 genRelNarrative: ⚠ one roll per relationship.
12. historyGenerator.js:446-460 fill loop: ⚠ rejection loop. :556-582 timeline loop: ⚠ rerolls and skip. :190-230 token picks, :279, :760.
13. historyEventStrands.js:123-208 token picks.
14. power/conflicts.js:185, crossSettlementConflicts.js:123/160/229-235 (⚠ continue-skip), neighbourGenerator.js:456 (index from neighbourFactions.js:51).
15. services/institutionServices.js:69/203 service roll: ⚠ one roll per eligible definition.
16. factionGrouping.js generateFactions name loop (⚠ draw-count-variable retry), applyDensityLaw.js:280.
17. traditions/genesis.js:251-409 and politics.js:275-279: ⚠ shuffle costs pool.length−1 rolls; the PRNG is local and forked.
18. kernel/proseHash.js:47 `pickVariant` (H): institution descs at assembleInstitutions.js:65/:1004, STRESS_NOTES at narrativeGenerator.js:417, ORIGIN_POOLS at settlementOriginProse.js:207, HISTORY_DESC_VARIANTS at historyData.js:1598, tie fallback at npcData.js:1334. A gate changes only the modulus, never the stream.
19. relationshipArchetypes.js:138 createTieProseDraw (H, without replacement).
20. dossier/hookLines.js:208 createConflictHookDraw and :226 foodGapHookLine (H).
21. legacyGenerator.js:124 stableEventPick (H); traditions/prose.js:40 pickLine (H); warAndRoadNames.js:275 pickLine (H); foodways.js:69-88 (H + probe); marketPrices.js crier frame (H); settlementRumors.js:634/:748 (H); causeConjunctionContent.js:212 and causeLifecycleVocabulary.js:152 (H); composeStateProse.js connective joint (H).
22. Kernel-family sites outside the census: decreeProse.js:237 and causalDossierProse.js:115 use drawVariant/eligibleVariants, so the marks channel is already available.
23. T lookups with no draw, where a gate is a twin or fallback at the lookup: npcStructure.js:424, crisisCast.js:461-701, crisisHooks.js:162, dailyLifeLogic DEFENSE_CONTEXT (ungated walls/garrison claim), rulingStructure/governanceNarrative/stressFactions/safetyProfile/economicState/spatialGenerator inline branches, plus the display T tables listed above.

## Appendix C — the 400-line presumption sample (sub-seat annotations)

### Unit 2 sample: presumptions of 400 generated lines

Read-only audit of /home/user/settlement-engine, 2026-11-04. 20 pools x 20 lines. Atoms with a trailing `*` are key-guaranteed: the pool key, the line's own `walls`/`no walls` selector mark, or a generator gate such as a catalog terrain requirement guarantees them. Atoms without `*` are presumptions the record has to declare. Machine-readable sibling: unit2-sample.json.

#### Pool sources and substitutions

- P01 DS-GEN-3: one line from each of 20 of the block's ~38 keys, spread evenly. Lines 19-20 are `foodSecurity.label` (my parser labelled them with the readiness heading).
- P02 DS-ECO-8, P03 DS-POW-6, P04 DS-HK-1, P05 DS-FTH-1, P06 DS-DEF-1, P08 DS-POP-1 (the block is migration departures), P10 DS-WAR-1: the first 20 numbered lines in document order. P05 lines 15-17 sit under `DEVOTION: devout`, not CULTS.
- P07 DS-STR-1: lines 1-2 of each of 10 crisis pools (siege, famine, occupied, fractured, indebted, betrayed, infiltrated, plague, monster, wartime).
- P09 DS-SUP-1: has only 18 lines, so it is topped up with the first 2 lines of DS-SUP-2 (the same file's supply ladder).
- P11 src/data/npcData.js `NPC_PLOT_HOOKS`: substitution. These are first-impression lines (government/military/religious/economy/criminal x4); the file has no prose plot-hook pool.
- P12 npcData.js `NPC_FACTION_GOALS` short goals, the first 20 (Mayor through High Priest).
- P13 src/data/stressInstitutionEffects.js: secret+stakes pairs (siege 9, famine 8, occupied 3).
- P14 src/data/institutionDescVariants.js: thorp economy PAIRS 0-4 (10 lines) plus town/city/metropolis economy pairs (10 lines).
- P15 src/data/institutionServices.js: the first 20 service descs (Household elder through City administration).
- P16 src/generators/narrativeText.js `PRESSURE_SENTENCES`: siege 6, famine 6, occupied 6, fractured 2.
- P17 src/data/traditionCorpus.js: trappings (feast, procession, vigil, fair x4) plus the first 4 epithets. `Landfall` is an element name, not a prose line; see the wrong-today list.
- P18 Daily Life: substitution. The tab's prose comes from the AI, so I sampled the deterministic strings: the DailyLifeTab.jsx offer line, LOAD_MSGS, the local builder's variants, and aiLayer.js `buildLocalDailyLife`.
- P19 src/domain/crisis/crisisCast.js `CAST_REASONS` (src/generators/crisisCast.js does not exist): bruntBase x12 plus the next 8 reasons.
- P20 src/data/historyData.js `HISTORICAL_EVENTS_DATA`, which historyGenerator.js draws from: description plus 2 lastingEffects for 6 types, plus crime_wave's description and first effect.

#### Figures

- Total lines: **400**
- Mean presumptions per line, all atoms: **1.945**. Excluding key-guaranteed atoms: **0.66**
- Lines with zero presumptions of any kind (`none`): **1.2%**
- Lines that are fact-free once key-guaranteed atoms are excluded: **51.0%**
- Lines that presume `calm`, i.e. are false under ANY active crisis: **2.0%** (8 lines). 7 of them (1.75%) are undeclared; the 8th, the daily-life 'no stress' variant, is key-guaranteed. Another **1.5%** (6 lines) are false under one specific crisis (`not:siege`, `not:war`, `not:famine`)
- Top 15 atoms needing declaration (key-guaranteed excluded): `market` 23, `ruler` 15, `watch` 13, `walls` 12, `grain-source` 12, `other-npc` 11, `tier:>=town` 9, `road` 8, `temple` 8, `calm` 7, `trade-route` 6, `institution:guild` 6, `gate` 5, `food:stores` 5, `priest` 5

##### Per-pool means

| pool | mean all | mean excl. key | fact-free excl. key (of 20) |
|---|---|---|---|
| P01 DS-GEN-3 | 2.0 | 0.75 | 10 |
| P02 DS-ECO-8 | 1.5 | 0.4 | 12 |
| P03 DS-POW-6 | 2.9 | 0.8 | 10 |
| P04 DS-HK-1 | 1.65 | 0.4 | 12 |
| P05 DS-FTH-1 | 2.6 | 0.4 | 13 |
| P06 DS-DEF-1 | 1.55 | 0.55 | 11 |
| P07 DS-STR-1 | 1.6 | 0.35 | 13 |
| P08 DS-POP-1 | 1.7 | 0.7 | 9 |
| P09 DS-SUP-1 | 1.7 | 0.25 | 15 |
| P10 DS-WAR-1 | 2.1 | 0.5 | 14 |
| P11 npcData NPC_PLOT_HOOKS (impressions) | 1.05 | 0.05 | 19 |
| P12 npcData NPC_FACTION_GOALS (short) | 2.3 | 1.25 | 2 |
| P13 stressInstitutionEffects secrets+stakes | 2.5 | 1.5 | 1 |
| P14 institutionDescVariants | 3.05 | 0.85 | 8 |
| P15 institutionServices desc | 1.7 | 0.65 | 10 |
| P16 narrativeText crisis lines | 2.05 | 1.0 | 5 |
| P17 traditionCorpus trappings+epithets | 1.55 | 0.75 | 7 |
| P18 Daily Life (DailyLifeTab + aiLayer local) | 1.4 | 1.0 | 10 |
| P19 crisisCast CAST_REASONS | 2.0 | 0.1 | 18 |
| P20 historyData HISTORICAL_EVENTS_DATA | 2.0 | 0.95 | 5 |

##### New atoms added (no vocabulary atom fitted)
`no-walls`, `no-garrison`; `score:<axis>-<band>`, `readiness:<x>`, `safety:<x>`, `viable:<x>`, `legitimacy:<x>`, `capture:<x>`, `op:<x>`, `hook:<x>`, `rank:<x>`, `cults`, `piety:<x>`, `chain:<status>`, `war:<status>`, `exhaustion:<x>`, `migration-out:<band>`, `role:<x>`, `system:<x>`, `act:<x>`, `history:<type>` (these are mostly key labels); `not:<crisis>` (false under that one crisis only); `crisis:any`; `monster-threat` (config monster threat, not an active crisis); `multiple-faiths:<n>`; `factions-balanced`; `trend:declining`; `scarcity`; `primary-export`; `overlord` (a lord or regional authority above the seat); `ally` (a relief force); `resistance`; `festival`; `duration:<x>`; `water`; `history:dated-depletion`, `history:unrest`, `history:capture-recovered`; `ruler:collective`, `ruler:contested`, `ruler:elected`, `ruler:hereditary`; `climate:conifer`, `climate:winter`; `terrain:narrow-approach`.

#### Lines probably wrong today
These presumptions are not guaranteed by the pool key and are likely false in many records. I checked the guard code where noted; the rest is judgment.

1. **P12-15** Garrison Commander, "repair the east wall": presumes `walls`. `data/defenceTwinLines.js` has no twin for it (it covers only the siege goal and the conscription lines), so it prints for any garrison that has no walls.
2. **P12-14** Guard Captain, "officers ... on the thieves' guild payroll": presumes `criminal-structure`. Nothing gates it the way `crimeSignalOf` gates the history crime_wave template.
3. **P16-4, P16-5** (siege) "The walls of X have held", "the people on the walls", and the monster_pressure line at narrativeText.js:154, "where the walls are thin": presume `walls` with no guard. narrativeText.js has no defenceTwinLine entries.
4. **P16-8** famine: "The harvest failure" (the famine may come from a siege or blockade) and "at least three factions". **P16-20** fractured: "Three factions", where the key guarantees only 2.
5. **P13-11** famine secret: "reported them destroyed in a flood ... The flood was real" presumes a river or flood-prone ground (a desert or mountain town).
6. **P17-10** vigil "lantern-boats set adrift on the water": the act is drawn with no terrain gate. Also **Landfall / "the First Landing"**: `foundingElementWeight` (domain/traditions/genesis.js:204-214) gives first-landing a base weight of 1.5 even with no coast, river or port, so landlocked towns can get a Landfall founding tradition. Also **P17-17** "a custom older than the walls" (epithet, ungated) and **P17-3** "the guild ovens" (a thorp has no guild).
7. **P18-1** offer line "dawn, the market, the tavern, the watch"; **P18-6 / P18-19** the fallback anchors "the market, shrine, workshop, and watch post / public well". These fallbacks fire exactly when the institution list is empty, so they assert the things the record lacks. **P18-12** "Farmers, haulers, priests, guards" is unconditional.
8. **P01-13** the safety head-word pool groups `Quarantined` with `Secure`, so "A stranger walks X at any hour" prints under a plague quarantine.
9. **P08-20 / P08-16** "many hundreds ... a fraction of its old population" and "measurably smaller": the bands are absolute counts, so these are false for a city or metropolis.
10. **P09-17** BLOCKED "The workings above X sit idle" presumes an extractive chain, which is false for grain, fish or wool. **P09-18** "Without a road out" presumes `isolated`, but the block may come from a siege or blockade.
11. **P20-6** "merchant quarter and labourers' quarter remain walled apart" (small tiers); **P20-10..12** guild_conflict can be drawn with no guild (`hasGuild` only biases the draw); **P20-8** "two rival congregations still divide" (versus the faith record); **P20-17** granary reserves; **P20-2/3** hereditary bloodlines versus an elected seat.
12. **P15-7 / P15-9** "the lord's dues and the temple tithe", "the lord's court": presume `overlord` and `temple`.
13. **P14-13/14** the charcoal burner's woodland kilns (the catalog row has no terrain gate); **P14-19** salt works' "local saline source" (no gate is visible for metropolis); **P14-11/12** the town fish market's "morning's catch" (no water gate).
14. **P06-1/2/10/16** readiness or terrain lines with no walls mark that still presume built works or a perimeter.
15. Calm and not-crisis lines that a co-active crisis falsifies: **P02-8** "Nobody is going without bread", **P02-11/12**, **P04-4/10/12**, **P06-3/4/14**, **P07-14** "The economy is untouched", **P10-14/18** (the rested and near-peace exhaustion lines during an active war).
16. **P12-5** "grain reserves before winter" presumes a climate with winter.

#### Per-line annotations
| pool | # | first ~70 chars | presumptions (declare) | key-guaranteed |
|---|---|---|---|---|
| P01 | 1 | {settlement} can put a real body of armed men on its walls, and the me | soldiers | walls score:military-strong |
| P01 | 2 | The watch at {settlement} is a watch and not a garrison, and the diffe | watch gate no-garrison | score:military-weak |
| P01 | 3 | {settlement} is built for what comes out of the country around it: hea | monster-threat | score:monster-strong |
| P01 | 4 | {settlement} sits closer to unworked country than its defences acknowl | monster-threat | score:monster-weak |
| P01 | 5 | Order in {settlement} is kept quietly, which is the expensive kind: a  | none | score:internal-strong |
| P01 | 6 | There is more going on in {settlement} than the watch troubles itself  | watch criminal-structure | score:internal-weak |
| P01 | 7 | {settlement} could lose a season's trade and go on paying its people;  | trade-route market | score:economic-strong |
| P01 | 8 | {settlement} runs close to what it takes in: one interruption would re | none | score:economic-weak |
| P01 | 9 | The Art is worked openly in {settlement} and worked well; what it does | none | magic-functions score:magical-strong |
| P01 | 10 | Whatever the Art does elsewhere, it does very little in {settlement}. | none | magic-functions score:magical-weak |
| P01 | 11 | {settlement} is short of comfortable and knows precisely how short. | none | prosperity:struggling |
| P01 | 12 | {settlement} has the look of a town where the ordinary year leaves som | none | prosperity:comfortable |
| P01 | 13 | A stranger walks {settlement} at any hour and the town's only interest | market calm | safety:secure |
| P01 | 14 | {settlement} is a place to be careful in, and being careful is not suf | none | safety:dangerous |
| P01 | 15 | The arithmetic of {settlement} does not close: what the town requires  | trade-route | viable:false |
| P01 | 16 | {settlement} is defended properly rather than impressively: the works  | walls | readiness:well-defended |
| P01 | 17 | {settlement} has walls in the sense that there is a line where the tow | none | walls readiness:lightly |
| P01 | 18 | {settlement} has no defences at all, and the openness is the first thi | none | readiness:undefended |
| P01 | 19 | {settlement} grows more than it eats, and the difference is the town's | exports | food:surplus |
| P01 | 20 | {settlement} does not grow what it eats. The gap is bought, and the bu | none | imports food:import-dependent |
| P02 | 1 | {settlement} eats what it raises and keeps almost nothing back. A year | grain-source | prosperity:subsistence |
| P02 | 2 | There is no spare anything in this town: no spare grain, no spare coin | none | prosperity:subsistence |
| P02 | 3 | The accounts run to survival and stop. Nothing is set aside because th | none | prosperity:subsistence |
| P02 | 4 | {settlement} is short more often than not. Some needs are met and some | none | prosperity:struggling |
| P02 | 5 | The books never quite close. What the town needs and what the town has | none | prosperity:struggling |
| P02 | 6 | A stranger sees the shortage in the small things: a repair not made, a | market | prosperity:struggling |
| P02 | 7 | {settlement} covers what it must and nothing beyond. Every essential i | none | prosperity:poor |
| P02 | 8 | The town gets by. Nobody is going without bread and nobody is building | not:famine | prosperity:poor |
| P02 | 9 | {settlement} looks maintained rather than made. What stands is kept st | none | prosperity:poor |
| P02 | 10 | The accounts come out steady with a narrow margin. It is an ordinary t | none | prosperity:moderate |
| P02 | 11 | Things are fine. Not comfortable, not tight: fine, and fine is what pe | calm | prosperity:moderate |
| P02 | 12 | Nothing about {settlement}'s condition asks to be remarked on. The tow | calm | prosperity:moderate |
| P02 | 13 | {settlement} closes every year ahead. The margin is not large and it i | none | prosperity:comfortable |
| P02 | 14 | People here put things by, and can. That is the difference between thi | none | prosperity:comfortable |
| P02 | 15 | The town is plainly past subsistence. The buildings are finished rathe | food:stores | prosperity:comfortable |
| P02 | 16 | The surplus is large enough to be spent rather than merely held, and t | none | prosperity:prosperous |
| P02 | 17 | {settlement} is visibly well off. The halls, the walls and the roads a | road | walls prosperity:prosperous |
| P02 | 18 | There is money here and it goes into the town. Nobody argues about whe | none | prosperity:prosperous |
| P02 | 19 | {settlement} is visibly well off. The halls, the houses and the roads  | road | no-walls prosperity:prosperous |
| P02 | 20 | {settlement} holds reserves deep enough to sit out most of what could  | none | prosperity:wealthy |
| P03 | 1 | There is no reading of how {settlement} regards its rulers. The questi | none | legitimacy:absent |
| P03 | 2 | Whether the town backs the {seat} is not something anybody at {settlem | ruler | legitimacy:absent |
| P03 | 3 | A stranger at {settlement} cannot tell whether the hall is loved or en | ruler | legitimacy:absent |
| P03 | 4 | Nothing at {settlement} is moving the town's view of its rulers: not t | grain-source watch ruler | walls legitimacy:neutral |
| P03 | 5 | The town has no particular opinion of the hall, which the hall would d | ruler | legitimacy:neutral |
| P03 | 6 | Nothing is currently deciding how {settlement} regards the {seat}, whi | ruler | legitimacy:neutral |
| P03 | 7 | Nothing at {settlement} is moving the town's view of its rulers: not t | grain-source watch road ruler | no-walls legitimacy:neutral |
| P03 | 8 | The criminal interest at {settlement} is gaining ground inside the hal | ruler | criminal-structure prosperity:poor capture:advancing |
| P03 | 9 | Each season at {settlement} makes the next approach easier. The condit | none | criminal-structure capture:advancing |
| P03 | 10 | Money is being spent at {settlement} on people who cannot account for  | none | criminal-structure capture:advancing |
| P03 | 11 | What the criminal interest held at {settlement} it is losing; a town t | watch history:capture-recovered | criminal-structure capture:recovering |
| P03 | 12 | The approach was made at {settlement} and did not take. Prosperity and | watch | criminal-structure capture:recovering |
| P03 | 13 | What the criminal interest at {settlement} still holds it holds at a r | none | criminal-structure capture:recovering |
| P03 | 14 | Somebody well down inside {faction} at {settlement} is answering elsew | none | criminal-structure multiple-factions:1 capture:agent |
| P03 | 15 | Somebody at {settlement} is a little too well informed about {faction} | none | criminal-structure multiple-factions:1 capture:agent |
| P03 | 16 | The approach reached into {faction} at {settlement} and stopped at the | none | criminal-structure multiple-factions:1 capture:agent |
| P03 | 17 | The person who speaks for {faction} at {settlement} is not free to spe | none | criminal-structure multiple-factions:1 capture:leader |
| P03 | 18 | What {faction} decides at {settlement} is now shaped at the top rather | none | criminal-structure multiple-factions:1 capture:leader |
| P03 | 19 | {faction} at {settlement} has stopped opposing one particular interest | none | criminal-structure multiple-factions:1 capture:leader |
| P03 | 20 | There is a second market at {settlement} running alongside the lawful  | market | criminal-structure op:parallel-market |
| P04 | 1 | What is worth doing in {settlement} is worth doing because of who is i | none | hook:npc |
| P04 | 2 | {settlement}'s open questions sit with particular people rather than w | none | hook:npc |
| P04 | 3 | A stranger with business in {settlement} will be pointed at a person,  | none | hook:npc |
| P04 | 4 | {settlement}'s people are individually consequential and collectively  | calm | hook:npc |
| P04 | 5 | {settlement}'s live questions are questions between groups, and each g | none | multiple-factions:2 hook:faction |
| P04 | 6 | Nothing in {settlement} gets decided by one person, which means everyt | ruler:collective | multiple-factions:2 hook:faction |
| P04 | 7 | {settlement} has more than one authority and no arbiter, and that gap  | ruler:contested | multiple-factions:2 hook:faction |
| P04 | 8 | The blocs in {settlement} are close enough in strength that a small we | factions-balanced | multiple-factions:2 hook:faction |
| P04 | 9 | {settlement} runs on arrangements that everyone here has agreed not to | none | hook:tension |
| P04 | 10 | {settlement}'s difficulties are recorded, chronic and unresolved, whic | calm | hook:tension |
| P04 | 11 | What is wrong in {settlement} is not hidden. It is simply nobody's job | none | hook:tension |
| P04 | 12 | {settlement} carries its quarrels well and carries them all the time;  | calm | hook:tension |
| P04 | 13 | What {settlement} needs and what {settlement} can get do not line up,  | none | hook:economics |
| P04 | 14 | The trouble in {settlement} is a supply question before it is anything | none | hook:economics |
| P04 | 15 | {settlement} is short of something specific, and being short of someth | none | hook:economics |
| P04 | 16 | {settlement}'s margin is thin enough that a change in what arrives wou | imports | hook:economics |
| P04 | 17 | {settlement} has more trouble than it has people to answer it, and the | none | hook:safety |
| P04 | 18 | What {settlement} reports and what {settlement} suffers differ by enou | none | hook:safety |
| P04 | 19 | {settlement} is a town where being competent and armed makes you immed | none | hook:safety |
| P04 | 20 | {settlement} is safer than its country, and what threatens it comes fr | monster-threat | walls hook:safety |
| P05 | 1 | {creed} is the patron here, and it is no local creed. The same rite is | none | walls patron-creed rank:major |
| P05 | 2 | The observance here is {creed}'s, and it is the observance of the regi | road | patron-creed rank:major |
| P05 | 3 | {settlement} keeps {creed}, a faith holding seats far beyond this one. | priest | patron-creed rank:major |
| P05 | 4 | {creed} is the patron here, and it is no local creed. The same rite is | none | no-walls patron-creed rank:major |
| P05 | 5 | {creed} is the patron here, kept in a handful of settlements and nowhe | none | patron-creed rank:minor |
| P05 | 6 | The town's rite is {creed}'s: established, unremarkable elsewhere, and | none | patron-creed rank:minor |
| P05 | 7 | {settlement} keeps {creed}. Travellers from far enough away will not k | priest | patron-creed rank:minor |
| P05 | 8 | The patron of {settlement} is {creed}, a creed with few other homes. W | none | patron-creed rank:cult |
| P05 | 9 | {creed} holds the seat here and almost nowhere else; the town is the f | none | patron-creed rank:cult |
| P05 | 10 | Outside these walls {creed} is a curiosity. Inside them it is the cale | none | walls patron-creed rank:cult |
| P05 | 11 | Elsewhere {creed} is a curiosity. Here it is the calendar, the oath an | none | no-walls patron-creed rank:cult |
| P05 | 12 | Beneath {creed}, smaller observances keep their own shrines: tolerated | temple | patron-creed cults |
| P05 | 13 | The patron is not the only creed here; {rival_creed} keeps a following | none | patron-creed cults |
| P05 | 14 | Several lesser rites run alongside the patron's, each with its own day | multiple-faiths:3 tier:>=town | patron-creed cults |
| P05 | 15 | Devotion here runs deep. The rites are kept by people who would keep t | none | patron-creed piety:devout |
| P05 | 16 | {settlement} is a pious town in the plain sense: the observance's cale | none | patron-creed piety:devout |
| P05 | 17 | Observance is near-total, and it is not performance; the creed shapes  | none | patron-creed piety:devout |
| P05 | 18 | The town keeps its faith properly. Attendance is the rule rather than  | temple | patron-creed piety:faithful |
| P05 | 19 | Devotion here is steady and unspectacular. Most households keep the ri | none | patron-creed piety:faithful |
| P05 | 20 | {settlement} is faithful in the working sense: the benches are full on | temple | patron-creed piety:faithful |
| P06 | 1 | {settlement} reads as a defended place from the road in: the approache | watch walls | readiness:strong |
| P06 | 2 | What {settlement} can field and what {settlement} has built are both i | garrison walls | readiness:strong |
| P06 | 3 | The town does not spend much time thinking about being attacked, and t | not:siege | readiness:strong |
| P06 | 4 | Nothing presses {settlement} at present, and the absence is not luck:  | calm | readiness:strong |
| P06 | 5 | {settlement} is covered against what it is likely to face, with little | none | readiness:adequate |
| P06 | 6 | A stranger sees the town at {settlement} defended in the ordinary way: | none | readiness:adequate |
| P06 | 7 | The town believes it could hold against the usual trouble and does not | none | readiness:adequate |
| P06 | 8 | {settlement} is at the point where the arrangements are sufficient and | none | readiness:adequate |
| P06 | 9 | The defensive arrangements at {settlement} are thin. Something is in p | none | readiness:weak |
| P06 | 10 | What a stranger notices at {settlement} is how much of the perimeter h | walls | readiness:weak |
| P06 | 11 | {settlement} is getting by on not being tested. The margin has been na | trend:declining | readiness:weak |
| P06 | 12 | {settlement} is effectively undefended. There is no arrangement here t | none | readiness:critical |
| P06 | 13 | The town knows perfectly well what it could not survive, and the knowl | none | readiness:critical |
| P06 | 14 | A stranger reaches the centre of {settlement} without being stopped, c | not:siege | readiness:critical |
| P06 | 15 | The ground does more for {settlement} than the town does. The approach | terrain:narrow-approach | terrain:defensible |
| P06 | 16 | {settlement} is sited where the terrain carries part of the defense; w | walls | terrain:defensible |
| P06 | 17 | The ground here does the arguing. Anything weighing an attempt on {set | none | terrain:defensible |
| P06 | 18 | {settlement} sits open. There is no ground here that helps it, and eve | none | terrain:exposed |
| P06 | 19 | The site gives {settlement} nothing defensively. Every advantage the t | none | terrain:exposed |
| P06 | 20 | The town has no hill and no narrows and does not pretend otherwise; wh | none | terrain:exposed |
| P07 | 1 | Nothing moves through the gates. {settlement} lives on what is already | none | crisis:siege walls gate |
| P07 | 2 | The walls are held from outside; the fields beyond them have not been  | grain-source | crisis:siege walls |
| P07 | 3 | There is not enough to eat, and the shortfall is public now rather tha | institution:granary | crisis:famine |
| P07 | 4 | Hunger has moved from the poorest streets into the ordinary ones; what | grain-source | crisis:famine |
| P07 | 5 | Another power's writ runs here. The offices are the same offices; the  | none | crisis:occupation |
| P07 | 6 | Revenue leaves before it is spent: {settlement} is administered, and t | none | crisis:occupation |
| P07 | 7 | Nothing is decided. The factions each hold enough to block and none ho | none | crisis:fractured multiple-factions:2 |
| P07 | 8 | Authority here is divided past the point of use. Repairs, judgments an | none | crisis:fractured |
| P07 | 9 | A share of everything {settlement} earns leaves for a creditor beyond  | none | crisis:debt walls |
| P07 | 10 | The books balance only because nothing is being built. The debt is ser | none | crisis:debt |
| P07 | 11 | Trust here is a shorter commodity than it was. Institutions run at par | none | crisis:betrayed |
| P07 | 12 | The betrayal is over and its consequences are not. Offices that once s | none | crisis:betrayed |
| P07 | 13 | Nothing here looks wrong. Decisions land slightly askew, and informati | none | crisis:infiltrated |
| P07 | 14 | The economy is untouched and the intelligence is not. Someone else's i | not:famine | crisis:infiltrated |
| P07 | 15 | Illness is loose in the town. The market thins as people keep to their | market | crisis:plague |
| P07 | 16 | The sick outnumber the hands that can tend them, and the quarantine is | none | crisis:plague |
| P07 | 17 | The roads outside are not safe. Trade arrives thinner and later, and w | trade-route | crisis:raiders/beasts |
| P07 | 18 | Attacks on the outlying holdings have become regular enough to plan ar | none | crisis:raiders/beasts |
| P07 | 19 | The town is on a war footing. Grain, iron and men are counted against  | none | crisis:war |
| P07 | 20 | {settlement} lives at the rhythm of a war it is part of. Everything or | militia | crisis:war |
| P08 | 1 | Nobody left {settlement} in {season}. That is a small fact and, in a y | crisis:any season | migration-out:none |
| P08 | 2 | No one took to the road. Whatever the town is short of, it is not shor | scarcity | migration-out:none |
| P08 | 3 | The departure rolls are empty. Nothing here was bad enough to move any | none | migration-out:none |
| P08 | 4 | A few souls left {settlement} in {season}, few enough that everyone ca | population:small season | migration-out:few |
| P08 | 5 | The departure amounted to a few souls. The town noticed, because it is | population:small | migration-out:few |
| P08 | 6 | A few souls went. Nothing about the settlement changed except the numb | none | migration-out:few |
| P08 | 7 | A dozen or so have gone. That is a street's worth in a place this size | population:small | migration-out:dozen |
| P08 | 8 | The loss runs to a dozen or so: enough to leave a trade short-handed,  | none | migration-out:dozen |
| P08 | 9 | About a dozen households' worth of people have moved on; the town has  | none | migration-out:dozen |
| P08 | 10 | Dozens have left {settlement}. The workshops run with gaps in them, an | institution:workshop | migration-out:dozens |
| P08 | 11 | The departure runs to dozens, enough that the town's own count and the | none | migration-out:dozens |
| P08 | 12 | Dozens of people are gone from a place that could not spare them. What | population:small | migration-out:dozens |
| P08 | 13 | A hundred or so have gone from {settlement}, which is a visible subtra | tier:>=town | migration-out:hundred |
| P08 | 14 | The loss is a hundred or so people, and it is the sort of loss a town  | none | migration-out:hundred |
| P08 | 15 | About a hundred have left. That is enough to change what the market ca | market militia | migration-out:hundred |
| P08 | 16 | Several hundred have left {settlement}. The town is measurably smaller | none | migration-out:several-hundred |
| P08 | 17 | The exodus runs to several hundred: a real portion of a district, gone | tier:>=city | migration-out:several-hundred |
| P08 | 18 | Several hundred people are no longer here. What they paid in, the town | none | migration-out:several-hundred |
| P08 | 19 | Many hundreds have gone. {settlement} is a substantially different set | none | migration-out:many-hundreds |
| P08 | 20 | The departure runs to many hundreds. The town carries its old infrastr | population:<=town | migration-out:many-hundreds |
| P09 | 1 | The line from {resource} to {good} is unbroken: the workings feed {ins | none | chain:complete exports |
| P09 | 2 | Follow {resource} through {settlement} and it does not stop anywhere.  | gate | chain:complete exports |
| P09 | 3 | This is the trade the town is known for. Every hand in the line betwee | primary-export | chain:complete exports |
| P09 | 4 | {settlement} has the {resource} and not the {institution}. The line en | none | chain:missing-processor |
| P09 | 5 | A stranger looking for {institution} here will not find one. What the  | none | chain:missing-processor |
| P09 | 6 | The step that would make {resource} into {good} is not here. It has to | none | chain:missing-processor |
| P09 | 7 | {settlement} does not raise the {resource} its {chain} runs on. It buy | none | chain:import-upstream imports |
| P09 | 8 | The {chain} is whole on the town's side and borrowed on the far side;  | none | chain:import-upstream imports |
| P09 | 9 | What goes into the {chain} comes from elsewhere. The work is local; th | none | chain:import-upstream imports |
| P09 | 10 | The {resource} is worked out. The line above {institution} is still dr | none | chain:depleted |
| P09 | 11 | ‹needs a dated depletion› {settlement}'s {resource} gave out {timeband | history:dated-depletion | chain:depleted |
| P09 | 12 | What {institution} still works, it works on what is left. The {resourc | none | chain:depleted |
| P09 | 13 | Nothing in this {chain} begins or ends here. Goods arrive finished, ar | none | chain:entrepot trade-route |
| P09 | 14 | A stranger tracing {good} through {settlement} finds no workshop in th | none | chain:entrepot trade-route |
| P09 | 15 | The town does not make it and does not use it. The town moves it. | none | chain:entrepot trade-route |
| P09 | 16 | The {chain} is on the rolls and off the road. There is no way to move  | none | chain:blocked |
| P09 | 17 | The workings above {settlement} sit idle. It is not that there is noth | institution:mine | chain:blocked |
| P09 | 18 | The town has the {resource} and no use for it. Without a road out, the | isolated | chain:blocked |
| P09 | 19 | The line holds. Every input the {chain} needs is present, and nothing  | none | chain:complete |
| P09 | 20 | The {chain} works. There is no story in it this season. | none | chain:complete |
| P10 | 1 | {settlement}'s army is in the field against {counterpart}, and everyth | none | crisis:war soldiers war:on-campaign |
| P10 | 2 | The town is short of the people who would ordinarily be here, and the  | gate grain-source | crisis:war war:on-campaign |
| P10 | 3 | What {settlement} wins from this campaign it will win somewhere else;  | none | crisis:war war:on-campaign |
| P10 | 4 | A stranger finds {settlement} quieter than a town this size should be, | none | crisis:war war:on-campaign |
| P10 | 5 | {settlement} is held by {counterpart}. The hall still sits, the market | market ruler | crisis:occupation |
| P10 | 6 | What is decided at {settlement} is decided subject to the occupier; th | none | crisis:occupation |
| P10 | 7 | A stranger at {settlement} deals with the town's own people and notice | none | crisis:occupation soldiers |
| P10 | 8 | {settlement} is at war with {counterpart} and nothing has yet come of  | none | crisis:war war:at-war |
| P10 | 9 | The town is at war in the way a town can be at war without seeing any: | none | crisis:war war:at-war |
| P10 | 10 | {settlement} is at war with {counterpart} and has not been touched by  | none | crisis:war war:at-war walls |
| P10 | 11 | {settlement} is at war with {counterpart} and has not been touched by  | none | crisis:war war:at-war no-walls |
| P10 | 12 | {settlement} carries no scar from fighting. Whatever the town has done | none | exhaustion:rested |
| P10 | 13 | The town has its people and its temper both, and neither has been spen | none | exhaustion:rested |
| P10 | 14 | {settlement} could put its full strength in the field this season and  | soldiers not:war | exhaustion:rested |
| P10 | 15 | {settlement} carries a light mark from its fighting and is very nearly | none | exhaustion:near-peace |
| P10 | 16 | The town is close to being done with the war it fought, and the last o | none | exhaustion:near-peace |
| P10 | 17 | {settlement} is at the edge of being clear of its war; another quiet s | none | exhaustion:near-peace |
| P10 | 18 | The town talks about the fighting in the past tense now, with the occa | not:war | exhaustion:near-peace |
| P10 | 19 | {settlement} has had enough. The fighting has gone on past what the to | crisis:war | exhaustion:war-weary |
| P10 | 20 | Sustained fighting has worn {settlement} down to the point where the h | crisis:war ruler | exhaustion:war-weary |
| P11 | 1 | Efficient, slightly distracted: someone with too many things in their  | none | role:government |
| P11 | 2 | Warmer than their office suggests. They have the gift of making people | none | role:government |
| P11 | 3 | Formally polite. Every sentence is measured before it leaves their mou | none | role:government |
| P11 | 4 | Tired. Not rudely, but visibly. This is a person who has been doing a  | none | role:government |
| P11 | 5 | Direct. They assess you in the first three seconds and their expressio | none | role:military |
| P11 | 6 | Professionally cordial: the manner of someone who deals with strangers | trade-route | role:military |
| P11 | 7 | Relaxed in a way that reads as confidence rather than carelessness. | none | role:military |
| P11 | 8 | Alert. Not hostile, but attentive in a way that doesn't quite switch o | none | role:military |
| P11 | 9 | Genuinely glad to see you, or performs it so well the difference doesn | none | role:religious |
| P11 | 10 | Composed. The particular stillness of someone who has practised being  | none | role:religious |
| P11 | 11 | Interested in you as a person, or at least in what you might need. The | none | role:religious |
| P11 | 12 | Watchful, in a religious way: not suspicious, but as though taking a r | none | role:religious |
| P11 | 13 | Quick to smile, quick to calculate. Both things are happening simultan | none | role:economy |
| P11 | 14 | Busy, or presenting as busy. The first impression is of someone who do | none | role:economy |
| P11 | 15 | Affable. The manner of someone for whom friendliness is both genuine a | none | role:economy |
| P11 | 16 | Cautious with newcomers. The wariness is professional rather than pers | none | role:economy |
| P11 | 17 | Unremarkable, deliberately. The kind of person you would walk past twi | none | role:criminal |
| P11 | 18 | Helpful in a way that asks for nothing obvious in return. Yet. | none | role:criminal |
| P11 | 19 | Friendly, easy, slightly too interested in where you're from. | none | role:criminal |
| P11 | 20 | Quiet. They let other people fill the silence. | none | role:criminal |
| P12 | 1 | Navigate a dispute between two powerful guilds without losing either's | institution:guild multiple-factions:2 | ruler:mayor |
| P12 | 2 | Cover up a minor corruption scandal before the regional lord hears of  | overlord | ruler:mayor |
| P12 | 3 | Find funding for desperately needed infrastructure repairs | none | ruler:mayor |
| P12 | 4 | Discredit a council rival before the annual election | ruler:elected other-npc | ruler:mayor |
| P12 | 5 | Secure enough grain reserves before winter to prevent unrest | food:granary season climate:winter | ruler:governor |
| P12 | 6 | Root out the faction leaking tax figures to rivals | multiple-factions:1 | ruler:governor |
| P12 | 7 | Block a proposal that would undermine their patron's interests | other-npc | role:council |
| P12 | 8 | Expose a colleague's corruption without implicating themselves | other-npc | role:council |
| P12 | 9 | Meet this quarter's collection target without triggering another riot | history:unrest | role:tax-collector |
| P12 | 10 | Find a missing merchant whose taxes haven't been filed in six months | other-npc market | role:tax-collector |
| P12 | 11 | Close a murder case that has made the merchants nervous | market | role:magistrate |
| P12 | 12 | Resist pressure from a powerful patron to deliver a specific verdict | other-npc | role:magistrate |
| P12 | 13 | Find the person responsible for three unsolved dock-side killings | port/docks | guard-captain |
| P12 | 14 | Identify which of their officers is on the thieves' guild payroll | criminal-structure | guard-captain |
| P12 | 15 | Secure emergency funding to repair the east wall before it becomes a c | walls | garrison |
| P12 | 16 | Contain a near-mutiny caused by months of unpaid wages | prosperity:poor | garrison soldiers |
| P12 | 17 | Collect a debt from a client who keeps finding reasons to delay paymen | other-npc | role:mercenary |
| P12 | 18 | Evaluate whether the next contract is worth the risk to their crew | none | role:mercenary |
| P12 | 19 | Restore a desecrated shrine before the annual festival (quietly, witho | institution:shrine festival | priest |
| P12 | 20 | Identify who among their junior clergy is accepting bribes from mercha | priest market | priest |
| P13 | 1 | Secretly negotiating surrender terms with the besieging force, without | ruler:council | crisis:siege |
| P13 | 2 | Has been rationing their own private food stores while publicly enforc | food:stores | crisis:siege |
| P13 | 3 | Passed information about the settlement's water supply to someone in t | duration:>=3w | crisis:siege |
| P13 | 4 | Knows the barricade across the main approach is structurally compromis | ruler:council duration:>=2w | crisis:siege |
| P13 | 5 | Has already made personal arrangements to leave before the final assau | other-npc | crisis:siege |
| P13 | 6 | The supplies they declared destroyed in a fire are actually hidden in  | food:stores | crisis:siege |
| P13 | 7 | Is in contact with the besieging commander (not as a spy, as a former  | ruler:council | crisis:siege |
| P13 | 8 | Authorised an illegal sortie that failed. Five people died and no reco | soldiers other-npc | crisis:siege |
| P13 | 9 | Has been skimming from the {commodity} reserves to pay a personal debt | food:stores other-npc | crisis:siege |
| P13 | 10 | Controls a hidden cache of {commodity} reserves that could feed the se | food:stores multiple-factions:1 | crisis:famine |
| P13 | 11 | Sold the settlement's emergency grain reserves three months ago at pea | institution:granary river duration:>=3m | crisis:famine |
| P13 | 12 | Has been reporting false harvest figures to the regional authority to  | overlord grain-source | crisis:famine |
| P13 | 13 | Knows who is hoarding and has made a private arrangement to share the  | multiple-factions:1 | crisis:famine |
| P13 | 14 | Their family has been eating normally throughout the famine (from a pr | other-npc | crisis:famine |
| P13 | 15 | Helped engineer the original supply disruption that triggered the fami | imports duration:>=6w | crisis:famine |
| P13 | 16 | Is receiving {commodity} shipments through a covert route and selling  | imports trade-route | crisis:famine |
| P13 | 17 | Has documentation proving the famine was caused by export decisions ma | exports multiple-factions:1 | crisis:famine |
| P13 | 18 | Has been feeding information to the occupation authority since the fir | resistance other-npc | crisis:occupation |
| P13 | 19 | Made a private arrangement with the occupation commander ... at the co | none | crisis:occupation |
| P13 | 20 | Was part of the original resistance but surrendered their entire cell' | resistance | crisis:occupation |
| P14 | 1 | Every household works some 12-16 acres, enough to stay alive and no mo | none | tier:thorp grain-source |
| P14 | 2 | Each family tills roughly 12-16 acres, all of it for the table. | none | tier:thorp grain-source |
| P14 | 3 | A shared cellar for grain, roots, and preserved food. It is what stand | grain-source | tier:thorp institution:root-cellar |
| P14 | 4 | Grain, roots, and preserves kept in a common underground store. The se | grain-source | tier:thorp institution:root-cellar |
| P14 | 5 | Nets, traps, and racks for drying. The thorp lives by the water and ca | none | tier:thorp fish-source water |
| P14 | 6 | Its livelihood is the water itself. The nets, the traps, the drying ra | none | tier:thorp fish-source water |
| P14 | 7 | The flock is held and worked in common, and the thorp keeps time by th | none | tier:thorp livestock |
| P14 | 8 | One shared flock, tended together. The grazing seasons set the rhythm  | none | tier:thorp livestock |
| P14 | 9 | Felling and stacking timber by the season. The whole camp smells of fr | climate:conifer | tier:thorp terrain:forest |
| P14 | 10 | Timber cut and stacked when the season allows, and the air over the th | climate:conifer | tier:thorp terrain:forest |
| P14 | 11 | Covered stalls under the wardens' eye, selling the morning's catch or  | fish-source | tier:town institution:fish-market market |
| P14 | 12 | The market wardens keep a roofed fish market where fresh catch and sal | fish-source | tier:town institution:fish-market market |
| P14 | 13 | Crews tend kilns out in the woods and sell charcoal to smelters, smith | terrain:forest institution:smelter institution:smith | tier:town institution:charcoal |
| P14 | 14 | Charcoal from woodland kilns feeds the smelters, the smithies, and the | terrain:forest institution:smelter institution:smith | tier:town institution:charcoal |
| P14 | 15 | A shaft or adit worked by hired crews with winding gear and ore carts. | none | tier:city institution:mine |
| P14 | 16 | Hired crews, winding gear, and ore carts work a shaft into the deposit | none | tier:city institution:mine |
| P14 | 17 | A quarry with yards of dressed stone and its own masons. Half the regi | exports | tier:city institution:quarry |
| P14 | 18 | Masons dress the stone in yards beside the working face. The quarry su | exports | tier:city institution:quarry |
| P14 | 19 | Evaporation pans and brine-works turn the local saline source into sal | coast/sea primary-export | tier:metropolis institution:salt-works |
| P14 | 20 | Fur processors, traders, and retailers gathered into one quarter. It i | game-source | tier:metropolis institution:furrier |
| P15 | 1 | Settles quarrels between households by custom | none | institution:household-elder |
| P15 | 2 | Calls and chairs the gathering of families | none | institution:household-elder |
| P15 | 3 | Keeps the memory of boundaries, debts, and old agreements | none | institution:household-elder |
| P15 | 4 | Receives travellers and speaks for the settlement | road | institution:household-elder |
| P15 | 5 | Judges disputes over land, livestock, and debt | livestock | institution:headman |
| P15 | 6 | Organises shared work: harvest, repairs, the common fields | grain-source | institution:headman |
| P15 | 7 | Collects the lord's dues and the temple tithe | overlord temple | institution:headman |
| P15 | 8 | Holds the customary law of the village | none | institution:headman |
| P15 | 9 | Arbitrates quarrels before they reach the lord's court | overlord | institution:village-elder |
| P15 | 10 | Convenes the village moot on shared matters | none | institution:village-elder |
| P15 | 11 | Witnesses betrothals and settles inheritance by custom | none | institution:village-elder |
| P15 | 12 | Remembers precedent, boundaries, and communal rights | none | institution:village-elder |
| P15 | 13 | Enacts and enforces the town's own rules | none | institution:town-council |
| P15 | 14 | Hears civil pleas in the town court | institution:court | institution:town-council |
| P15 | 15 | Grants stalls, sets tolls, licenses the market | market | institution:town-council |
| P15 | 16 | Walls, wells, roads, and the watch | walls watch | institution:town-council |
| P15 | 17 | Keeps the charter, rolls, and civic archive | none | institution:town-council |
| P15 | 18 | Runs the offices, wards, and officers of the city | none | tier:city institution:city-admin |
| P15 | 19 | Assesses and collects taxes, tolls, and customs | trade-route | institution:city-admin |
| P15 | 20 | Grants guild, market, and trade privileges | institution:guild market | institution:city-admin |
| P16 | 1 | ${name} is surrounded. Supply lines are cut, morale is fracturing, and | ally | crisis:siege |
| P16 | 2 | The siege has entered its second week; {govFaction/the council} contro | gate duration:>=1w ruler | crisis:siege |
| P16 | 3 | Every {commodity} cache in ${name} has been inventoried and argued ove | none | crisis:siege |
| P16 | 4 | The walls of ${name} have held so far, which is the problem. ... leave | walls ally ruler | crisis:siege |
| P16 | 5 | ${name} is learning the arithmetic of a siege: how many mouths, how ma | walls | crisis:siege |
| P16 | 6 | Word came into ${name} three days ago that the relief column had turne | ally | crisis:siege |
| P16 | 7 | ${name} is two bad weeks from genuine starvation; {topFaction/the merc | market | crisis:famine |
| P16 | 8 | The harvest failure has restructured every relationship in ${name}. .. | grain-source multiple-factions:3 | crisis:famine |
| P16 | 9 | {topNPC/Someone} knows where the hoarded {commodity/grain} can be foun | none | crisis:famine |
| P16 | 10 | The bakers of ${name} have started cutting the bread with things that  | institution:bakery | crisis:famine |
| P16 | 11 | {GovFaction/The council} of ${name} announced a fair distribution of t | ruler | crisis:famine |
| P16 | 12 | Hunger has made ${name} quiet. The market still opens, the queues stil | market | crisis:famine |
| P16 | 13 | ${name} is under occupation; {govFaction/the administration} answers t | ruler | crisis:occupation |
| P16 | 14 | The occupation has been running long enough that some residents have a | resistance | crisis:occupation |
| P16 | 15 | {topNPC/The most senior local official} is simultaneously expected to  | none | crisis:occupation |
| P16 | 16 | The occupiers of ${name} are careful to leave the forms of local rule  | ruler:council | crisis:occupation |
| P16 | 17 | Every household in ${name} has quietly decided what it would and would | none | crisis:occupation |
| P16 | 18 | The curfew in ${name} is enforced unevenly, ... which face at the chec | none | crisis:occupation |
| P16 | 19 | ${name} has no effective government; {topFaction} controls one distric | tier:>=town | crisis:fractured multiple-factions:2 |
| P16 | 20 | Three factions are each waiting for one of the other two to make a mis | multiple-factions:3 | crisis:fractured |
| P17 | 1 | long tables set in the square | tier:>=village | act:feast |
| P17 | 2 | shared bread and the common cup | none | act:feast |
| P17 | 3 | the guild ovens working through the night | institution:guild | act:feast |
| P17 | 4 | a whole ox turned on the spit | livestock | act:feast |
| P17 | 5 | masked walkers and carried effigies | none | act:procession |
| P17 | 6 | the banners of every quarter | tier:>=town | act:procession |
| P17 | 7 | the old road walked end to end | road | act:procession |
| P17 | 8 | drums and the ringing of the bells | temple | act:procession |
| P17 | 9 | candles kept through the dark hours | none | act:vigil |
| P17 | 10 | lantern-boats set adrift on the water | river | act:vigil |
| P17 | 11 | the long silence before dawn | none | act:vigil |
| P17 | 12 | the old names read aloud from the rolls | none | act:vigil |
| P17 | 13 | stalls crowding the high street | market tier:>=town | act:fair |
| P17 | 14 | travelling players and their booths | none | act:fair |
| P17 | 15 | the toll-gate thrown open to all | gate road | act:fair |
| P17 | 16 | beasts and goods driven in from the hinterland | livestock | act:fair |
| P17 | 17 | a custom older than the walls | walls | - |
| P17 | 18 | the day the whole quarter shutters its doors | tier:>=town | - |
| P17 | 19 | kept since the first stone was laid | none | - |
| P17 | 20 | older than any charter the town can show | tier:>=town | - |
| P18 | 1 | Ordinary life here in prose: dawn, the market, the tavern, the watch. | market institution:tavern watch | - |
| P18 | 2 | Walking the streets... | none | - |
| P18 | 3 | Listening at the alehouse... | institution:tavern | - |
| P18 | 4 | Watching the market open... | market | - |
| P18 | 5 | Reading the mood... | none | - |
| P18 | 6 | Morning starts around {the market, shrine, workshop, and watch post}. | market temple institution:workshop watch | - |
| P18 | 7 | {terrain} and {trade} shape the pace: carts, tools, and gossip move wh | road | - |
| P18 | 8 | bread is dear and the poorest households plan every meal carefully | none | food:deficit |
| P18 | 9 | food is adequate for most families, though prices are watched closely | none | food:deficit |
| P18 | 10 | granaries and kitchen gardens give the town a little breathing room | institution:granary | food:surplus |
| P18 | 11 | the food supply is ordinary, practical, and never taken for granted | none | - |
| P18 | 12 | Work is divided by habit more than proclamation. Farmers, haulers, pri | grain-source priest watch market | - |
| P18 | 13 | people move after dusk with confidence | none | safety:high |
| P18 | 14 | doors are barred early and strangers are studied before they are welco | none | safety:mid |
| P18 | 15 | ordinary errands carry a careful awareness of who controls the street | none | safety:low |
| P18 | 16 | Most residents know where authority lives and how to petition it witho | ruler | stability:ok |
| P18 | 17 | The place is not peaceful so much as practiced: people know its routin | none | calm |
| P18 | 18 | By evening, daily life narrows to lamplight, shared meals, debts remem | none | - |
| P18 | 19 | Morning gathers around {the market, shrine, workshop, and public well} | market temple institution:workshop | - |
| P18 | 20 | People learn the day by watching who arrives early, which doors stay s | market | - |
| P19 | 1 | the hunger falls first on its people | none | crisis:any system:food |
| P19 | 2 | its hands do the work the crisis takes | none | crisis:any system:labour |
| P19 | 3 | its trade is cut | none | crisis:any system:trade trade-route |
| P19 | 4 | its people stand on the walls | walls | crisis:any system:defense |
| P19 | 5 | its standing is what the crisis spends | none | crisis:any system:legitimacy |
| P19 | 6 | its people tend the sick | none | crisis:any system:healing |
| P19 | 7 | its revenue is what the crisis drains | none | crisis:any system:tax |
| P19 | 8 | its people take in the newcomers | none | crisis:any system:housing migration-in |
| P19 | 9 | its people stop trusting their neighbours | none | crisis:any system:trust |
| P19 | 10 | its own ranks begin to split | none | crisis:any system:factions |
| P19 | 11 | its people keep an order that is failing | none | crisis:any system:law |
| P19 | 12 | its streets are where the crime lands | none | crisis:any system:crime criminal-structure |
| P19 | 13 | the least powerful of the house the crisis hits | none | crisis:any |
| P19 | 14 | holds the office the crisis turns on | none | crisis:any |
| P19 | 15 | the crisis turns on this house, and no one on the roster runs it | none | crisis:any |
| P19 | 16 | no one on the roster could; here for this crisis | none | crisis:any |
| P19 | 17 | outranks the seat while it weakens | ruler | crisis:any |
| P19 | 18 | its faction gains from the crisis | none | crisis:any multiple-factions:1 |
| P19 | 19 | drawn from the house that bore the famine | none | crisis:famine crisis:any |
| P19 | 20 | holds the seat | none | ruler crisis:any |
| P20 | 1 | The ruler of the time was aging or ill, and potential heirs jockeyed f | none | history:succession |
| P20 | 2 | Rival claimant bloodlines still contest ceremonial precedence | ruler:hereditary | history:succession |
| P20 | 3 | Succession now governed by a charter drafted in the aftermath | ruler:hereditary | history:succession |
| P20 | 4 | Growing wealth gap between merchant class and common laborers creates  | market | history:disparity |
| P20 | 5 | Wage disputes settled by a standing arbitration council since founded | institution:arbitration-council | history:disparity |
| P20 | 6 | The merchant quarter and the labourers' quarter remain walled apart | tier:>=town walls | history:disparity |
| P20 | 7 | Different faiths or interpretations competed for influence and convert | none | history:religious |
| P20 | 8 | Two rival congregations still divide the settlement's faithful | multiple-faiths:2 temple | history:religious |
| P20 | 9 | Public preaching restricted to licensed grounds after the unrest | priest | history:religious |
| P20 | 10 | Rival guilds competed for market share and political influence | institution:guild | history:guild |
| P20 | 11 | Guild membership rolls now audited by an outside adjudicator | institution:guild | history:guild |
| P20 | 12 | One guild's charter was revoked and never fully restored | institution:guild | history:guild |
| P20 | 13 | News of approaching danger divided the community on how to respond | none | history:external-threat |
| P20 | 14 | Watch towers and muster drills maintained since the alarm | watch militia | history:external-threat |
| P20 | 15 | A standing levy roster kept ready in the town archive | militia tier:>=town | history:external-threat |
| P20 | 16 | A critical resource became scarce, causing hoarding and price gouging | none | history:scarcity |
| P20 | 17 | Emergency granary reserves mandated by ordinance since the shortage | institution:granary | history:scarcity |
| P20 | 18 | Price ceilings on the affected goods still enforced in lean seasons | market | history:scarcity |
| P20 | 19 | A surge in criminal activity overwhelmed the authorities; vigilantes b | none | criminal-structure history:crime |
| P20 | 20 | An expanded watch and a night curfew survive from the crackdown | watch | history:crime |
