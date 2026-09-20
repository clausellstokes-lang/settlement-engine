# EM-P2 version 3 — EVIDENCE (Opus COMPILE lane, session 7d3418f8, 2026-09-19)

**Tree read and imported:** `$SP/read-tip-a41a0e109`, `git rev-parse HEAD` = `a41a0e109bdee8fe3a0df082bf35b36d2399301e` (CONFIRMED). Its `src/` and `tests/` are the build branch's tip; `git status --porcelain` was **empty**.
**Nothing was edited, staged or committed anywhere.** Every script and output lives under `$SP/lane-em-p2-v3-scratch/`. No vitest, no eslint, no npm script, no build, no gate; one `node` process at a time.

`SP=/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/923472dc-319b-4b73-9e42-fa911739df78/scratchpad`

**Scripts** (all under `$SP/lane-em-p2-v3-scratch/proto/`): `vimock-loader.mjs` + `register.mjs` (the vi.mock simulator), `shim-prng.mjs`, `shim-proseHash.mjs`, `harness.mjs` (the Tier-1 counting instrument), `p1-controls.mjs`, `p2-sample.mjs`, `p3-tier2.mjs`, `p4-resolver.mjs`, `p5-emit.mjs`, and the emitted `generationForkRegistry.SPEC.js`.

A fact without a command is not verified. Everything below was EXECUTED.

---

## E-0 · The base, and the preamble

```
$ git -C $SP/read-tip-a41a0e109 rev-parse HEAD
a41a0e109bdee8fe3a0df082bf35b36d2399301e
$ git -C $SP/read-tip-a41a0e109 status --porcelain
              (no output)

$ git -C /Users/cstokes/Desktop/settlement-engine rev-parse fixes-2026-09-18-consist
816fc95e94e3160386563e2cceda24d4fd5cae99
$ git show fixes-2026-09-18-consist:docs/implementation/preambles/EM-PREAMBLE.md | shasum -a 256
1cf5442719f2236320068afb6b4bab2b4ea49f3b08457c04ccf5eaae6a11faf6  -
$ git show fixes-2026-09-18-consist:docs/implementation/preambles/EM-PREAMBLE.md | wc -l
      83
```

⚠ The header's verified base is left `__BASE__` for the chair; the preamble line is left as the chair's stamp. The measured hash above is quoted so the chair's stamp can be checked against a figure a lane executed, not asserted. §P2 rows 10 and 11 are present in the 83-line file (read whole).

---

## E-1 · VF-1 — the Tier-1 denominator is 75 pairs, not 57 keys

```
$ node -e "…getStepMeta()…"
steps=22 providesKeys=57 distinctProvides=51 mutatesKeys=18 pairs=75
```

§21.1's *"57 provided keys"* is an ENTRY count read as a KEY count. Five keys have two or three producers (`stress` ×3, `stressTypes`, `generationRepairs`, `isolationSupport`, `economicState`), which is why the both-directions equality must be against PAIRS and why nothing may join on `key` alone. **Agrees with the recon (C3).**

---

## E-2 · VF-5, VF-6 — `fork` is an INTRA-MODULE call to `createPRNG`, and it is the only one

```
$ grep -n "createPRNG(" src/kernel/prng.js
10: *   const rng = createPRNG('my-seed');            ← a JSDoc line
22:export function createPRNG(seed) {                 ← the definition
84:    fork: (label) => createPRNG(`${seed}::${label}`),   ← THE ONLY intra-module call

$ sed -n '84p' src/kernel/prng.js
    fork: (label) => createPRNG(`${seed}::${label}`),

$ grep -nE "^export " src/kernel/prng.js
22:export function createPRNG(seed) {
106:export function epochSuffix(advanceEpoch) {
118:export const SEED_ENTROPY_LEN = 6;
148:export const SEED_SEQUENCE_LEN = 3;
151:export const SEED_SUFFIX_LEN = SEED_SEQUENCE_LEN + SEED_ENTROPY_LEN;
241:export function generateSeed() {

$ grep -nE "^export " src/kernel/proseHash.js
28:export function fnv1a32(str) {
47:export function pickVariant(pool, seed) {
```

**This single line is the whole difference between the recon's instrument and a vitest one.** The estate had already written the lesson down, at `tests/property/advanceEpochDormancyFence.test.js:77-82`:

> *"THE SPY SITS OUTSIDE pulseKernel.js, AND THAT IS LOAD-BEARING. The recorded WR-10 lesson is that wrapping a function in its OWN module's namespace counts ZERO when the caller invokes it intra-module, because the internal binding stays the original."*

---

## E-3 · The in-vitest instrument — the precedent set in the tree

```
$ git grep -n "vi\.mock('.*kernel/" -- tests
tests/domain/advanceEpochForkParity.test.js:77:vi.mock('../../src/kernel/prng.js', async (importOriginal) => {
tests/domain/advanceEpochStampSurvival.test.js:114:vi.mock('../../src/kernel/prng.js', async (importOriginal) => {
tests/property/advanceEpochDormancyFence.test.js:83:vi.mock('../../src/kernel/prng.js', async (importOriginal) => {
tests/store/advanceEpochForkSemantics.test.js:52:vi.mock('../../src/kernel/prng.js', async (importOriginal) => {
tests/store/locksEngine.test.js:42:vi.mock('../../src/kernel/prng.js', async (importOriginal) => ({
tests/store/npcStateRegenRebind.test.js:58:vi.mock('../../src/kernel/prng.js', async (importOriginal) => ({
tests/store/pinnedNpcRegenRemap.test.js:45:vi.mock('../../src/kernel/prng.js', async (importOriginal) => ({

$ git grep -n "vi.mock(.*proseHash" -- tests
              (no output — this packet is the first)

$ git grep -l "vi\.mock(" -- tests | wc -l
     451
```

**Seven files already mock `src/kernel/prng.js` through `importOriginal` in this repo's vitest setup**, and `advanceEpochForkParity.test.js:66-76` already wraps `fork` recursively. The mechanism is not novel here; only the fork RE-IMPLEMENTATION is, and E-6 is why.

---

## E-4 · How the instrument's logic was proven without vitest

`vi.mock` replaces a module's EXPORTS for its IMPORTERS and leaves intra-module bindings alone. `proto/vimock-loader.mjs` reproduces exactly that with a Node ESM `resolve` hook: importers of `src/kernel/prng.js` and `src/kernel/proseHash.js` are redirected to a shim, and the shim reaches the original through a `?__actual=1` query — the stand-in for `importOriginal()`. **No file under `read-tip-a41a0e109` is written.** `EMP2_REIMPL_FORK=0` disables the fork re-implementation: the negative control.

---

## E-5 · THE CONTROLS — all green (`node --import ./register.mjs p1-controls.mjs`)

```
### EMP2_REIMPL_FORK = 1 (the specified instrument)

=== C0 — export parity (nothing is lost by replacing the module) ===
prng.js: actual=[SEED_ENTROPY_LEN,SEED_SEQUENCE_LEN,SEED_SUFFIX_LEN,createPRNG,epochSuffix,generateSeed]
prng.js: shim  =[SEED_ENTROPY_LEN,SEED_SEQUENCE_LEN,SEED_SUFFIX_LEN,createPRNG,epochSuffix,generateSeed]  EQUAL=true
proseHash.js: actual=[fnv1a32,pickVariant]
proseHash.js: shim  =[fnv1a32,pickVariant]  EQUAL=true

=== C1 — THE GOLDEN CONTROL: the instrument changes no generated byte ===
row      = town|germanic|plains|road|civilized|golden-master-v3
manifest = b77b5909009112855bad4dacf881847d06e43385f64a15f4b528e0d30c91c3ce
measured = b77b5909009112855bad4dacf881847d06e43385f64a15f4b528e0d30c91c3ce
EQUAL    = true
stride-21 sweep: checked=25 moved=0 (none)

=== C2 — THE PIN CONTROL (EM-P0 A3, re-measured under the instrument) ===
unpinned generatePopulation: draws=315 random=315 other=0 innerForks=0
  > DERIVE_HALF_DRAWS(67)? true
fully pinned generatePopulation: draws=0 random=0 other=0
  === 0? true
pinned run reproduces the record? true

=== C3 — THE MINT CENSUS (the channel the fork proxy cannot see) ===
total mints = 35  (direct=4, via fork=31)
DIRECT mints (an importer called createPRNG(seed) — the C12 channel):
   seed="golden-master-v3"  calls=0
   seed="golden-master-v3::generatePower::power-structure"  calls=0
   seed="golden-master-v3::generatePower::power-structure"  calls=0
   seed="golden-master-v3::generatePower::power-structure"  calls=0
seeds minted MORE THAN ONCE = 1
   "golden-master-v3::generatePower::power-structure" x4  vias=[fork|direct|direct|direct]
mints whose seed does NOT start with the run's root seed = 0

=== C4 — THE HASH CENSUS (pickVariant: choices with zero draws) ===
pickVariant calls = 96; real choices (pool>1 AND non-falsy seed) = 96
distinct seed strings among real choices = 96
first 6 seeds:
    "golden-master-v3:Town granary"
    "golden-master-v3:Market square"
    "golden-master-v3:Weekly market"
    "golden-master-v3:Annual fair"
    "golden-master-v3:Merchant guilds (3-8)"
    "golden-master-v3:Craft guilds (5-15)"

fnv1a32 EXTERNAL call sites executed = 6
  (pickVariant’s own intra-module fnv1a32 call is NOT in this count — disjoint by construction)
  first 3 strings: "[\"power-economy-v1\",\"town\",\"Prosperous\",\"Moderate\",\"Pressured\"]" , …

=== C5 — CROSS-CHECK: proxy-observed forks vs census-observed fork mints ===
steps forked by the runner = 22; sub-forks seen by the proxy = 9
census mints via fork = 31  (expected = 22 step forks + 9 sub-forks = 31)
settlement produced? true  steps=22
```

**Every control the chair's brief names is green, and every figure the recon published is reproduced exactly**: the golden hash `b77b5909…`, 315 / 0, **35 mints**, the power-structure seed minted **4 times**, **96** `pickVariant` choices. C5's arithmetic (22 + 9 = 31) is the accounting proof that no mint is counted twice or lost.

---

## E-6 · ⛔ THE NEGATIVE CONTROL — what a naive `vi.mock` wrapper would have measured

```
$ EMP2_REIMPL_FORK=0 node --import ./register.mjs p1-controls.mjs
### EMP2_REIMPL_FORK = 0 (NEGATIVE CONTROL: a naive vi.mock wrapper)
…
=== C3 — THE MINT CENSUS ===
total mints = 4  (direct=4, via fork=0)
seeds minted MORE THAN ONCE = 1
   "golden-master-v3::generatePower::power-structure" x3  vias=[direct|direct|direct]
```

**4 mints against 35 — the naive wrapper is blind to 31 of them (89%)**, and it reads the power-structure seed as minted **three** times rather than four, losing the fork that puts the seed STRING on `powerIntent` in the first place. C0/C1/C2/C4 stay green under it, so **nothing but this control would have caught it**. That is why §6.3's fork re-implementation is specified as law and why A5 pins `prng.js:84`.

---

## E-7 · VF-4, §6.4 — the 63-row sample, re-executed (`p2-sample.mjs`)

```
=== (A) the sample: 63 rows (grid 42 + tail 21) of 525 ===
ROWS=63 wall=25426 ms  per-row=403.6 ms
pairs=75  moved>0 = 29  moved=0 = 46
steps that draw = 13: resolveConfig, resolveResources, resolveStress, assembleInstitutions,
  cascadePass, isolationPass, generateEconomy, factionCorrelationPass, economyReconcilePass,
  generatePopulation, corruptionPass, generateNarratives, assembleSettlement
```

Diffed row by row against `findings/RECON-EM-P2-TIER1-LITERAL.md` (525 rows): **ZERO disagreements on any of the 75 drawn/pure verdicts.** The rare rows land dead-on because the sample carries the whole 21-row tail:

| row | recon (of 525) | compile lane (of 63) |
|---|---|---|
| `resolveConfig\|tradeRoute` | drawn (5) | drawn (**5**/63) |
| `resolveConfig\|terrainType` | drawn (3) | drawn (**3**/63) |
| `resolveConfig\|resolvedTerrain` | drawn (3) | drawn (**3**/63) |
| `resolveConfig\|effectiveConfig` | drawn (7) | drawn (**7**/63) |
| `factionCorrelationPass\|institutions` | pure, step drew 1/525 | pure, step drew **1**/63 |
| `isolationPass\|*` (4 rows) | pure, step drew 24/525 | pure, step drew **2**/63 |
| `generatePower\|powerIntent` | moves 525/525, step draws **0** | moves **63**/63, step draws **0** |
| `generatePower\|powerStructure` | pure | pure |
| `corruptionPass\|npcs`,`factions` | drawn (270), step drew 273 | drawn (**39**/63), step drew **42**/63 |
| `assembleSettlement\|stress` | drawn (516) | drawn (**54**/63) |

⚠ **Under §21.5.2's own rule the classification is 28 `drawn` · 1 `label` · 46 `pure`**, not 29/46: the 29 is the count of rows that MOVE, and `generatePower|powerIntent` is the one that moves under a zero-draw step. Counted in the emitted literal:

```
$ grep -c "class: 'drawn'" generationForkRegistry.SPEC.js   → 28
$ grep -c "class: 'label'" generationForkRegistry.SPEC.js   → 1
$ grep -c "class: 'pure'"  generationForkRegistry.SPEC.js   → 46
$ grep "class: 'label'" generationForkRegistry.SPEC.js
  { step: 'generatePower', key: 'powerIntent', via: 'provides', stepDraws: 0, keyMoves: 63, rows: 63, class: 'label', onRecord: 'absent', recordPath: null },
$ grep -c "via: 'provides'" → 57 ; grep -c "via: 'mutates'" → 18
```

**Cost:** 25,426 ms for 1,449 pipeline runs with the instrument installed, against the recon's 23,287 ms for the same sample under the loader hook — the `vi.mock` wrapper costs **+9%**.

---

## E-8 · §6.4 — the off-corpus block, and why the arm asserts `> 0`

```
=== (B) OFF-CORPUS: the wizard's random modes over resolveConfig (24 seeds each) ===
IN-corpus control	MOVED=[population:24/24 , culturalIdentity:24/24]
settType:'random'	MOVED=[population:24/24 , culturalIdentity:24/24 , tier:19/24 , effectiveConfig:19/24 , townPlus:13/24]
culture:'random_culture'	MOVED=[population:24/24 , culturalIdentity:24/24 , culture:20/24 , effectiveConfig:20/24]
_randomizePriorities:true	MOVED=[population:24/24 , culturalIdentity:24/24 , effectiveConfig:24/24 , priorityMagicEffective:23/24 , magicLevel:15/24]
```

All five keys the golden corpus classes `pure` (0/525 and 0/63) are DRAWN under a wizard-reachable config. **The ratios differ from the recon's on two keys** — `townPlus` 13/24 here vs 11/24 there, `priorityMagicEffective` 23/24 here vs 24/24 there — because the seed SETS differ. The measurement agrees; the ratio is not a property of the tree. **An arm that pinned a ratio would be a flake with a number on it**, so §6.4 specifies `> 0` with the observed count recorded in the failure message.

---

## E-9 · VF-7, VF-8 — the two channels' variance across rows

```
=== (C) MINT + HASH census per row ===
row	mints	direct	viaFork	pickVariant	fnv1a32ext
thorp|germanic|plains|road|civilized|golden-master-v3	35	4	31	20	6
thorp|south_asian|coastal|port|civilized|golden-master-v3	35	4	31	20	6
hamlet|east_asian|coastal|port|civilized|golden-master-v3	35	4	31	31	6
village|mesoamerican|riverside|river|civilized|golden-master-v3	36	4	32	57	6
town|east_asian|desert|road|civilized|golden-master-v3	35	4	31	96	6
city|steppe|hills|road|civilized|golden-master-v3	36	4	32	125	6
metropolis|mediterranean|riverside|river|civilized|golden-master-v3	36	4	32	123	6
town|germanic|mountain|mountain_pass|civilized|golden-master-v3	36	4	32	85	6
town|germanic|auto|random_trade|civilized|gm-seed-c	35	4	31	94	6
```

⛔ **This is why A5 pins the DIRECT count and A6 pins the probe row, not a global constant.** `direct = 4` on **9 of 9** rows across all six tiers, and `fnv1a32` external = **6** on all nine — those are stable facts and they are the assertions. Total mints (35–36) and `pickVariant` calls (**20 to 125**) are row properties: an assertion of "96 per settlement" would be true of one row and false of eight. §21.5.7's "96 choices per settlement" is a TOWN-row figure and the register says so.

---

## E-10 · VF-10, VF-11 — Tier 2 measured (`p3-tier2.mjs`, 42 rows × 22 perturbations)

```
card	outputKey	holding (step,key)	resolves	values	moves under HOLDER	origin	moved-by (top 5)
institution	institutions[].name	(assembleInstitutions,institutions)	42/42	1364	42/42	drawn	assembleInstitutions:42 cascadePass:34 resolveResources:29 resolveStress:1
institution	institutions[].category	(assembleInstitutions,institutions)	42/42	1364	41/42	drawn	assembleInstitutions:41 cascadePass:32 resolveResources:26 resolveStress:1
institution	institutions[].state	(assembleInstitutions,institutions)	0/42	0	0/42	n/a (ABSENT)	(none)
npc	npcs[].name	(generatePopulation,npcs)	42/42	419	42/42	drawn	generatePopulation:42 resolveStress:40 assembleInstitutions:36 assembleSettlement:35 resolveResources:23
npc	npcs[].role	(generatePopulation,npcs)	42/42	419	42/42	drawn	generatePopulation:42 assembleInstitutions:41 resolveStress:40 assembleSettlement:35 resolveResources:25
npc	npcs[].status	(generatePopulation,npcs)	18/42	27	12/42	drawn	resolveStress:19 assembleInstitutions:17 generatePopulation:12 assembleSettlement:10 resolveResources:9
faction	powerStructure.factions[].faction	(generatePower,powerStructure)	42/42	270	0/42	computed	resolveStress:40 assembleInstitutions:35 resolveResources:11 cascadePass:9
faction	powerStructure.factions[].category	(generatePower,powerStructure)	42/42	270	0/42	computed	resolveStress:40 assembleInstitutions:35 resolveResources:11 cascadePass:9
faction	powerStructure.factions[].power	(generatePower,powerStructure)	42/42	270	0/42	computed	resolveStress:40 assembleInstitutions:38 resolveResources:15 cascadePass:12 generateEconomy:3
powerSeat	powerStructure.governingName	(generatePower,powerStructure)	42/42	42	0/42	computed	assembleInstitutions:18 resolveResources:1
powerSeat	powerStructure.factions[].isGoverning	(generatePower,powerStructure)	42/42	42	0/42	computed	(none)
powerSeat	powerStructure.seats[].holder	(generatePower,powerStructure)	0/42	0	0/42	n/a (ABSENT)	(none)
```

**CONFIRMS §21.5.3 by independent execution:** the power structure consumes zero entropy — `faction`, `category`, `power`, `governingName` and `isGoverning` move under **no** perturbation of `generatePower`, in 42 of 42 rows — and all five stay editable because design §14 as amended tests what the record HOLDS, not what a draw chose. **CONFIRMS the STOP's S4:** `powerStructure.seats[].holder` resolves 0/42. `institutions[].state` resolves 0/42 (EM-A1's `createdBy` branch). `npcs[].status` at 18/42 is EM-A1 §1c.2's structural-seat family — declared and shown empty.

`powerStructure.factions[].isGoverning` moved under **no step at all** across 42 rows × 22 perturbations. Recorded as observed data; the register's arm for it is occupancy and `origin`, both of which hold.

---

## E-11 · VF-12 — the resolver, and its guard-the-guard (`p4-resolver.mjs`)

```
=== ARM: every registered STEP is declared EXACTLY ONCE in its own step file ===
V3 resolver   : 22/22 steps declared exactly once
MODEL resolver: 0/22 steps declared exactly once  <- the reason the model cannot name a step

=== ARM: the declared leaf PRODUCERS resolve, exactly once, in their own module ===
src/generators/npcGenerator.js#pickFirst	V3=1	MODEL=1	(module-local const arrow, never exported)
src/generators/power/rulingStructure.js#generatePowerStructure	V3=1	MODEL=1
src/generators/steps/generatePopulation.js#generatePopulation	V3=1	MODEL=0	(a registerStep host)
src/generators/steps/assembleInstitutions.js#assembleInstitutions	V3=1	MODEL=0	(a registerStep host)
src/generators/steps/generatePower.js#generatePower	V3=1	MODEL=0	(a registerStep host)

=== ANTI-VACUITY: a symbol that does NOT exist must resolve to 0 ===
src/generators/steps/generatePower.js#generatePowerX	V3=0  (must be 0)
src/generators/npcGenerator.js#pickSecond	V3=0  (must be 0)

=== ANTI-VACUITY: a name that appears ONLY in prose/strings must not be counted ===
declared = [actuallyHere:1 , alsoHere:1 , real:1 , realTwo:1]
ghostInComment absent? true
ghostInString absent?  true
ghostInTemplate absent? true
actuallyHere = 1 ; alsoHere = 1
```

`declaredSymbols` runs over `codeOnly(raw)` (the estate's one shared strip, `tests/helpers/codeOnlySource.js`) and reads a `registerStep` name back from the RAW source at the preserved offset, because `codeOnly` blanks string CONTENTS. **`pickFirst` at `npcGenerator.js:240` is module-local and never exported — EM-A1 §1c.1 property 2 satisfied by measurement.** Its path to the field is in the source: `:106 const fullName = pickFirst(culture, gender, true, tier);` → `:131 name: fullName,`.

The model is READ, never edited: `tests/lint/chooserTotality.walker.test.js` is untouched.

---

## E-12 · VF-13 — the leaf's budget, measured (`p5-emit.mjs`)

```
=== (C) THE LEAF'S BUDGET, measured ===
Tier 1 rows = 75  Tier 2 rows = 10
raw lines = 117
EFFECTIVE lines (eslint max-lines, skipBlankLines+skipComments) = 106
domain layer ceiling = 800 ; new-leaf packet budget = 250 ; ONE LEAF? true
longest line = 322 chars (no max-len rule in eslint.config.js)

$ grep -n "max-len" eslint.config.js
              (no output)
```

**106 effective lines against a 250-line new-leaf budget.** The pre-approved `…Tier1.js` / `…Tier2.js` split is **measured and NOT TAKEN** — the brief's "measure, do not squeeze" cuts both ways.

---

## E-13 · §6.2 — `onRecord` re-executed over three tiers

51 distinct keys, the recon's ladder re-implemented and run at village / town / city. Town is the register's column.

```
distinct keys = 51 ; absent = 20 ; transformed = 12 ; same = 19
absent      = tradeRoute, resolvedTerrain, generationContentProfile, threat, priorityMagicEffective,
              noMagic, townPlus, institutionToggles, categoryToggles, goodsToggles, servicesToggles,
              generationContext, neighbourProfile, neighbourEconBias, neighbourFacBias, rawNeighbour,
              structural, catalogForTier, generationRepairs, powerIntent
transformed = terrainType, culture, magicLevel, nearbyResourcesDepleted, nearbyResourcesNativeDepleted,
              nearbyResourcesCustom, nearbyResourceDefinitions, nearbyResourceDefinitionsDepleted,
              factions, npcs, powerStructure, history
tier-dependent: generationRepairs   (same at village and city, absent at town)
```

Per the 75 ROWS the register carries: `absent` 21 · `same` 37 · `transformed` 17.

**Relation to the recon's six-verdict ladder:** the three-state fold is a superset in each direction and the recon's headline sets are strict subsets of mine — its 5 ABSENT (`generationContentProfile`, `generationContext`, `catalogForTier`, `powerIntent`, `structural`) are all in my 20, and its 4 VALUE-DIFFERS (`npcs`, `factions`, `history`, `powerStructure`) are all in my 12. The extra 15 absent are its "not carried (only a coincidental scalar match)" rows and the extra 8 transformed are its "name present elsewhere, value differs" rows. **No disagreement; a coarser vocabulary, which is the one §21.5.4 ruled.** One key is tier-dependent and is named as a blind half.

---

## E-14 · §7.1 — the bundle measurement (preamble rows 10–11)

```
$ ls src/domain/generation
ls: …/src/domain/generation: No such file or directory

$ git grep -n "generationForkRegistry" -- src tests scripts supabase
              (no output; exit=1)

$ grep -l "src/domain/generation" supabase/functions/_shared/*.meta.json
              (no output)

$ for f in supabase/functions/_shared/*.meta.json → entry / inputs count
aiCharterBundle.meta.json      entry: src/domain/aiCharter.js      inputs: 114 files
aiGroundingBundle.meta.json    entry: src/domain/aiGrounding.js    inputs:  74 files
aiOutputSchemaBundle.meta.json entry: src/domain/aiOutputSchema.js inputs: 115 files
analyticsEventsBundle.meta.json entry: src/lib/analyticsEvents.js  inputs:   2 files
intentAtlasBundle.meta.json    entry: src/domain/intentAtlas.js    inputs:   2 files

$ grep -n "WORKER_BUNDLE_CEILING_BYTES" tests/build/generationWorkerLazy.test.js
138:export const WORKER_BUNDLE_CEILING_BYTES = 1401128;
```

The new leaf has **no production importer** and cannot acquire one in this packet, so it enters no bundle closure. The five edge-shared metas carry explicit `inputs` path lists and none lists a `src/domain/generation` path. **`npm run build:edge-shared` is not owed; no bundle-ceiling TEST row is carried; the build lane owes no `npm run build` attribution.**

---

## E-15 · §7.2 — the lighting census denominator, measured

```
$ sed -n '515,518p' tests/lint/sovereigntyLightingContract.walker.test.js
const TEST_FILES = walk(join(ROOT, 'tests'))
  .filter((p) => /\.test\.(js|jsx)$/.test(p))
  …
$ (walk tests/, count /\.test\.jsx?$/)
test files under tests/ matching /\.test\.jsx?$/ = 2646
of which tests/lint/ = 171

$ cat tests/lint/.lighting-census-baseline.json   (figures only)
"measuredAtSha": "baf8ccc1da4f7e327ad1d4d053ad814a830a90bf", "measuredBy": "EM-P0",
"files": 2646, "parked": 383, "credited": 2263, "titles": 25005, "suiteTitles": 6671
```

**The live count equals the frozen figure (2,646), so the base is clean and the delta is arithmetic.** The packet adds exactly two `.test.js` files ⇒ `files` 2,646 → **2,648**. `tests/helpers/generationForkCensus.js` is a plain `.js` and does not enter the denominator — CONFIRMED by the filter above.

---

## E-16 · VF-16 — every `requiredSymbols` entry exists NOW

```
$ grep -nE "^export (function|const) (registerStep|getStepOrder|getStepMeta|runPipeline)" src/generators/pipeline.js
99:export function registerStep(name, meta, fn) {
110:export function getStepOrder() {
171:export function runPipeline(initialContext, rng, options = {}) {
259:export function getStepMeta() {

$ grep -nE "^export " tests/helpers/goldenMasterCorpus.js
60:export const keyOf = (c) => [
76:export function goldenCorpus() {

$ grep -nE "^export " tests/helpers/anchoredNegatives.js
80:export function expectPresentThenAbsent(before, after, member, context) {
111:export function expectAbsentWithAnchor(collection, member, anchor, context) {

$ grep -nE "^export " tests/helpers/codeOnlySource.js
34:export function codeOnly(src) {

$ grep -nE "^export .*withCustomContent" src/lib/dependencyEngine.js
90:export function withCustomContent(customContent, fn) {

$ grep -nE "^export .*resolveConfigWithUserContentTunables" src/domain/content/userContentTunables.js
113:export function resolveConfigWithUserContentTunables(config, options = {}) {

$ grep -nE "^export .*generateSettlementPipeline" src/generators/generateSettlementPipeline.js
77:export function generateSettlementPipeline(config = {}, importedNeighbour = null, options = {}) {

$ grep -n "^const pickFirst" src/generators/npcGenerator.js
240:const pickFirst = (culture = 'germanic', gender = 'male', withSurname = true, tier = 'town') => {

$ grep -n "generatePowerStructure" src/generators/power/rulingStructure.js | head -2
2: * power/rulingStructure.js — the core assembly of generatePowerStructure:
79:export const generatePowerStructure = (
```

⚠ `pickFirst` is **not exported** — it is a module-local `const` arrow. It is named in `requiredSymbols` as a symbol the deliverable must PRESERVE **by source declaration**, which is exactly the case EM-A1 §1c.1 property 2 says a registry must be able to name; the resolver of §6.6 is what makes that possible (E-11).

---

## E-17 · VF-2, VF-3 — the runner's seams the Tier-1 instrument rests on

```
$ sed -n '160,171p;207p;229p' src/generators/pipeline.js
 * @param {Function} [options.onStep]  - Called after each step: (name, ctx, patch) => void
 * @param {Pins} [options.pins] - ABSENT or `{}` ⇒ today's behaviour EXACTLY …
export function runPipeline(initialContext, rng, options = {}) {
    const stepRng = rng.fork(name);
    const prevRng = setActiveRng(stepRng);
```

`onStep` fires inside the runner's `try`, before `clearActiveRng`, so a post-step capture is honest; `setActiveRng(stepRng)` takes the object the root's `fork` returned, so the ambient `kernel/rngContext.js` channel funnels through a test-side proxy **by construction** — which is why Tier 1 needs no mock at all. The recon proved the ambient claim in-pipeline for all 22 steps (delta exactly 1); this lane rests on it and re-proved its consequence, C2's 315/0.

---

## E-18 · What this lane did NOT measure, and what would settle it

1. **The instrument inside real vitest.** CONFIRMED by an exact semantic simulation; **PLAUSIBLE** that vitest's own module runner behaves identically. Seven files in the tree already do the same thing to the same module, which is strong precedent, not a receipt. **Settles it:** the build lane runs A1 first and alone (§6.3's STOP table).
2. **`credited` / `parked` in the lighting census.** PLAUSIBLE (+2 / +0). The walker's per-file crediting rules were read only in outline. **Settles it:** the recorded red of §10's last command.
3. **Whether `pickVariant`'s calls are the WHOLE hash channel.** `fnv1a32` has external sites the packet censuses (6 per run, all from `power/economyReconciliation.js`), and `pairProse`'s FNV pick described at `generateSettlementPipeline.js:216` was not separately attributed. Declared as a blind half.
4. **Leaf `producer` attribution for 8 of the 10 Tier-2 rows.** Not measured; declared `null` rather than guessed (§11 Q-4).
5. **Whether a key `pure` over both corpora is pure under EVERY reachable config.** PLAUSIBLE that the four config switches are the only ones. Declared as the corpus-ceiling blind half.
6. **The town-map glyph stream.** `domain/townMap/glyphAssign.js:125` mints `createPRNG('glyph:<name>')`, is in the closure, executes 0 times during generation (0 foreign-prefix mints in C3), and is name-keyed. Named as EM-P1b's class; nothing asserted.

---

# ADDENDUM — the chair's five rulings, applied and re-measured (2026-09-19 16:2x EDT)

Script: `proto/p6-onrecord-counts.mjs`. ONE execution fills every Tier-1 field — `stepDraws`, `keyMoves`, and the per-row `onRecord` counts — and emits the leaf at the ruled shape.

## E-19 · Q-5 — `onRecord` measured over the whole sample (63 rows), the ruled shape

```
$ EMP2_OBJECTS_ONLY=1 node --import ./register.mjs p6-onrecord-counts.mjs
### value-hash index admits OBJECTS/ARRAYS ONLY
ROWS=63 wall=31101 ms per-row=493.7 ms

=== EVERY ROW WHOSE onRecord IS 'varies' (final-context comparand) ===
  resolveResources|nearbyResourcesDepleted        absent=0  same=23 transformed=40  paths=[record.config.nearbyResourcesDepletedx63]
  resolveResources|nearbyResourcesNativeDepleted  absent=0  same=23 transformed=40  paths=[record.config.nearbyResourcesNativeDepletedx40 , record.config.nearbyResourcesDepletedx23]
  resolveStress|stressTypes                       absent=0  same=51 transformed=12  paths=[record.config.stressTypesx63]
  assembleInstitutions|generationRepairs          absent=43 same=20 transformed=0   paths=[record.generationCoherenceReceipt.repairsx20]
  stressConfirmPass|stressTypes                   absent=0  same=51 transformed=12  paths=[record.config.stressTypesx63]
  coherenceRepairPass|generationRepairs           absent=43 same=20 transformed=0   paths=[record.generationCoherenceReceipt.repairsx20]
varies rows = 6 of 75; rows whose non-absent recordPath is NOT unanimous = 1
label tally (final-context): {"absent":19,"same":35,"transformed":15,"varies":6}

class tally: {"drawn":28,"pure":46,"label":1}  (steps that draw = 13)
```

**The class tally is unchanged (28 · 1 · 46) and 13 steps draw**, so the chair's Q-1 count survives a second independent execution of the classification.

⭐ **The chair's reason for striking the probe row is visible in the numbers.** `generationRepairs` is not a tier fact: it is a **43/20 split over the corpus**. A town column would have reported a flat `absent` and a village column a flat `same`; the counts report the truth. The same is true of `stressTypes` (51/12) and both resource siblings (23/40) — four distinct keys, six rows, none of which a single probe row could have described.

**The one non-unanimous landing path** is `resolveResources|nearbyResourcesNativeDepleted`: in 40 rows it lands at `record.config.nearbyResourcesNativeDepleted` and in 23 its value is identical to its sibling's, so the value-hash search returns `record.config.nearbyResourcesDepleted` first. It is ALREADY `varies`, which is why the packet's contract makes that a tripwire (STOP-11): a row that lands in two places while reading unanimously `same` would be a register asserting a single truth it does not have, and it reds instead.

## E-20 · Q-7 — one defect in the recon's ladder, measured both ways

The recon's step 3 reads *"serialisations ≥ 12 bytes only, **so a scalar cannot match by coincidence**"*. The byte floor does not deliver the stated intent: `"crossroads"` serializes to 12 bytes and `"mountain_pass"` to 15.

```
### value-hash index admits any serialisation >= 12 bytes (the recon's literal rule)
  resolveConfig|tradeRoute   absent=58 same=5 transformed=0   paths=[record.economicState.tradeAccessx5]
varies rows = 7 of 75 ; label tally: {"absent":18,"same":35,"transformed":15,"varies":7}

### value-hash index admits OBJECTS/ARRAYS ONLY
  (resolveConfig|tradeRoute no longer appears)
varies rows = 6 of 75 ; label tally: {"absent":19,"same":35,"transformed":15,"varies":6}
```

**5 false `same` verdicts removed, 0 added**, and the result agrees with the recon's own published verdict for that key ("not carried — only a coincidental scalar match"). Adopted under the lane's judgment; **vetoable** (§11 Q-7).

## E-21 · Q-6 — the other comparand, measured but NOT switched

```
=== THE OTHER COMPARAND, measured not switched: post-step vs final-context ===
rows whose LABEL would differ under a post-step comparand = 18 of 75
  resolveConfig|effectiveConfig:        final=same    post=absent
  resolveResources|effectiveConfig:     final=same    post=absent
  resolveStress|stress:                 final=same    post=varies
  resolveStress|effectiveConfig:        final=same    post=absent
  resolveNeighbour|effectiveConfig:     final=same    post=absent
  assembleInstitutions|institutions:    final=same    post=varies
  assembleInstitutions|generationRepairs: final=varies post=absent
  subsumptionPass|institutions:         final=same    post=varies
  cascadePass|institutions:             final=same    post=varies
  isolationPass|stress:                 final=same    post=varies
  isolationPass|isolationSupport:       final=same    post=varies
  isolationPass|institutions:           final=same    post=varies
  isolationPass|effectiveConfig:        final=same    post=absent
  stressConfirmPass|stress:             final=same    post=varies
  stressConfirmPass|effectiveConfig:    final=same    post=absent
  generateEconomy|economicState:        final=same    post=varies
  generateEconomy|effectiveConfig:      final=same    post=absent
  factionCorrelationPass|institutions:  final=same    post=varies
```

Every one of the eighteen is a key a LATER step rewrites: seven `effectiveConfig` rows read `same` finally and `absent` post-step (what the step handed on is not what the record carries), and eleven `institutions`/`stress`/`economicState` rows read `same` finally and `varies` post-step. **This is exactly ARCH-REDERIVE's question (a) — which value a pin holds** — so the chair may want the post-step comparand, or both columns. Nothing was switched.

## E-22 · Q-4 — what striking `producer` costs, measured

The two non-null rows were `src/generators/npcGenerator.js#pickFirst` (for `npcs[].name`) and `src/generators/power/rulingStructure.js#generatePowerStructure` (for the five power rows). **Neither carries anything EM-A1 cannot get elsewhere:** EM-A1 §1c.2 already declares a `writer` per field and its I-3 arm checks that writer itself. What EM-A1 §1c.1 property 2 actually asks for is a CAPABILITY — *"`symbol` must resolve against SOURCE, not exports"*, because `pickFirst` is module-local — and that capability is the resolver, which EM-A1's I-3 can import. The packet therefore keeps `pickFirst` as a **guard-the-guard case in A8** (`declaredSymbols('src/generators/npcGenerator.js').get('pickFirst') === 1`) even though no register row names it: the arm proves the resolver can name what EM-A1 will name. **Column struck; capability kept; nothing lost.**

## E-23 · The leaf, re-measured at the ruled shape

```
=== THE LEAF, RE-MEASURED with the ruled onRecord shape and producer STRUCK ===
Tier 1 rows = 75  Tier 2 rows = 10
raw lines = 117
EFFECTIVE lines = 106   <= 250 ? true  (split needed? false)
longest line = 287 chars
```

**106 effective lines, unchanged.** The `onRecord` counts lengthen a Tier-1 row and striking `producer` shortens a Tier-2 row; neither adds a LINE, and there is no `max-len` rule. **The pre-approved two-leaf split stays untaken** — measured, not squeezed.

## E-24 · The EM-P3 exposure, measured

```
$ (requiredSymbols rows naming src/generators/steps/resolveConfig.js)
              (none — the step-file rows are assembleInstitutions.js, generatePopulation.js, generatePower.js)

$ (Tier-1 rows whose step is resolveConfig)
              18 of 75
```

EM-P3 moves `src/generators/steps/resolveConfig.js` and adds two option-list modules. **No `requiredSymbols` row of this packet names that file**, so EM-P3's move cannot break a required symbol. The exposure is entirely in the Tier-1 **data** — 18 rows, three of which (`tradeRoute` 5/63, `terrainType` 3/63, `resolvedTerrain` 3/63) turn on a handful of corpus rows. The pre-proof at promotion re-runs the full 75-row classification at the then-tip; the goldens stay byte-identical under EM-P3 so the expectation is zero rows move, **and the re-run is the receipt.**

---

# ADDENDUM 2 — the closing rulings Q-6 and Q-7 (2026-09-19 16:4x EDT)

Script: `proto/p6-onrecord-counts.mjs`, extended to carry BOTH comparands and to measure whether a second path field is ever needed. One execution, `EMP2_OBJECTS_ONLY=1`.

## E-25 · Q-6 — both comparands, measured together

```
ROWS=63 wall=25885 ms per-row=410.9 ms

label tally (final-context):      {"absent":19,"same":35,"transformed":15,"varies":6}
producedOnRecordClass tally:      {"absent":27,"same":18,"transformed":15,"varies":15}
rows whose LABEL differs between the two comparands = 18 of 75
class tally: {"drawn":28,"pure":46,"label":1}  (steps that draw = 13)
```

The eighteen, in full, are §E-21's list (unchanged between runs — the same eighteen rows, so the disagreement is a property of the pipeline and not of a run). Seven `effectiveConfig` rows read `same` finally and **`absent`** post-step; ten `stress`/`institutions`/`economicState` rows read `same` finally and **`varies`** post-step; `assembleInstitutions|generationRepairs` reads `varies` finally and **`absent`** post-step.

⭐ **What the second triple buys, in one row.** `resolveConfig|effectiveConfig`: `onRecord` says `same` — the config *is* on the record — while `producedOnRecord` says `absent`, because what `resolveConfig` handed on is not what the record carries; six later steps mutate `effectiveConfig` after it. A re-entry that trusted `onRecord` alone would hold, at seven different writers, a value none of them wrote.

## E-26 · Q-6 — is a `producedPath` ever needed? NO, and it is measured

```
=== DOES THE POST-STEP VALUE EVER LAND AT A DIFFERENT PATH THAN THE FINAL ONE? ===
rows with ANY differing landing path (both non-null) = 0 of 75
=> a separate producedPath field is NOT NEEDED
```

Counting only corpus rows where BOTH comparands land (a `null` is an absence the `producedOnRecord` triple already reports), **no register row ever sees the post-step value land somewhere other than where the final value lands.** Where a step's output reaches the record at all, it reaches it at the same path. The two comparands disagree about *whether* a value reaches, never about *where* — so one `recordPath` serves both triples. **A4 re-measures that zero**, so the field cannot quietly become owed without a red.

## E-27 · Q-7 — the byte floor was the defect; the type gate is the fix

Recorded here in full so the next reader does not re-derive it.

**The defect.** The recon's ladder step 3 reads *"serialisations ≥ 12 bytes only, **so a scalar cannot match by coincidence**"*. The ≥ 12-byte floor does not deliver that intent, because a long enum STRING clears it: `JSON.stringify('crossroads')` is **12** bytes and `JSON.stringify('mountain_pass')` is **15**. A scalar therefore can and does match by coincidence.

**The evidence, before and after, on the one key it bit:**

```
### value-hash index admits any serialisation >= 12 bytes   (the recon's literal rule)
  resolveConfig|tradeRoute   absent=58  same=5  transformed=0   paths=[record.economicState.tradeAccess x5]
  varies rows = 7 of 75 ; label tally {"absent":18,"same":35,"transformed":15,"varies":7}

### value-hash index admits OBJECTS/ARRAYS ONLY               (the fix)
  resolveConfig|tradeRoute   absent=63  same=0  transformed=0   -> onRecordClass 'absent'
  varies rows = 6 of 75 ; label tally {"absent":19,"same":35,"transformed":15,"varies":6}
```

The five `same` verdicts were `tradeRoute`'s value colliding with `record.economicState.tradeAccess` in the five long-route corpus rows — a different field, the same string. **5 false `same` removed, 0 added**, and the result agrees with the recon's own published verdict for that key (*"not carried — only a coincidental scalar match"*).

**The fix.** Step 3 admits a value to the record's value-hash index only when it is an **object or an array** AND its serialization is ≥ 12 bytes. The type gate is what makes "a scalar cannot match by coincidence" true; the byte floor stays as a cheap second guard on tiny structures. **ACCEPTED by the chair, 2026-09-19.**

## E-28 · The leaf and the cost, at the final shape

```
Tier 1 rows = 75  Tier 2 rows = 10
raw lines = 117
EFFECTIVE lines = 106   <= 250 ? true  (split needed? false)
longest line = 384 chars
```

**106 effective lines across all three shapes** the packet passed through (pre-ruling; one triple; two triples with `producer` struck). A second count triple lengthens a Tier-1 row from 287 to 384 characters and adds no LINE; `eslint.config.js` declares no `max-len` rule. **The pre-approved two-leaf split stays untaken — measured at every shape, never squeezed.**

Census wall-clock across this lane's three executions of the same 63-row sample: **25,426 / 31,101 / 25,885 ms**. The packet budgets against **~31 s**, not the best run, under a 180,000 ms timeout.
