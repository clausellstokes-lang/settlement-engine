# EM-P0 — evidence (lane EM COMPILE P3, letter `c`, Opus, session 923472dc)

Base, drift window and the byte-identity proof: `EM-B2.evidence.md` §E0, §E12, §E14 — not repeated.
Base `d31af2cee`; the charter's Wave 0 read at `1d2da8c95`. Read-only tools only.

## P0-E1 · THE STEP GRAPH IS REAL, DECLARED, AND STRICT-CHECKED

```
$ git grep -c "registerStep(" -- src/generators | wc -l      24  (1 def + 23 registrations)
$ sed -n '93,98p' src/generators/pipeline.js
export function registerStep(name, meta, fn) {
  if (_steps.has(name)) throw new Error(`Pipeline step "${name}" already registered`);
  _steps.set(name, { name, ...meta, fn });
}
```

Every step declares `deps`, `reads`, `provides` (and `readsVersion`, `mutates`, `scratch`), and
`runPipeline`'s strict mode ENFORCES both halves (`pipeline.js:170-186`): a read of a key no prior
step produced throws, and an undeclared write throws. Measured `deps`/`provides`, whole:

| step | deps | provides |
|---|---|---|
| `resolveConfig` | — | (config keys) |
| `buildGenerationContext` | resolveConfig | (context) |
| `resolveResources` | buildGenerationContext | (resources) |
| `resolveStress` | resolveConfig, resolveResources | `stress`, `stressTypes` |
| `resolveNeighbour` | resolveConfig | `neighbourProfile`, `neighbourEconBias`, `neighbourFacBias`, `rawNeighbour` |
| **`assembleInstitutions`** | buildGenerationContext, resolveResources, resolveStress, resolveNeighbour | **`institutions`**, `catalogForTier`, `generationRepairs` |
| `subsumptionPass` | assembleInstitutions | `[]` |
| `cascadePass` | subsumptionPass, buildGenerationContext | `[]` |
| `isolationPass` | cascadePass | `stress`, `isolationSupport` |
| `stressConfirmPass` | resolveStress, isolationPass | `stress`, `stressTypes` |
| `generateEconomy` | stressConfirmPass, resolveNeighbour | `economicState` |
| **`generatePower`** | generateEconomy, resolveNeighbour | **`powerIntent`, `powerStructure`** |
| `neighbourFactions` | generatePower, resolveNeighbour | `[]` |
| `factionCorrelationPass` | neighbourFactions, generateEconomy, buildGenerationContext | `[]` |
| `coherenceRepairPass` | factionCorrelationPass | (repairs) |
| `economyReconcilePass` | coherenceRepairPass | `economicState`, `spatialLayout`, `availableServices` |
| `powerEconomyReconcilePass` | economyReconcilePass | `[]` |
| `structuralValidationPass` | powerEconomyReconcilePass | `structural` |
| **`generatePopulation`** | coherenceRepairPass, powerEconomyReconcilePass | **`npcs`, `relationships`, `factions`, `conflicts`** |
| `corruptionPass` | generatePopulation, economyReconcilePass | (corruption) |
| `generateNarratives` | generatePopulation, economyReconcilePass | `settlementReason`, `resourceAnalysis`, `economicViability`, `history` |
| `assembleSettlement` | generateNarratives, generatePopulation, corruptionPass, structuralValidationPass | `settlement` |

**THE THREE ROOT-WRITING STEPS ARE `assembleInstitutions`, `generatePower` AND
`generatePopulation`.** Every other step is DERIVING. That classification is read off the
declared `provides`, not judged.

## P0-E2 · ⭐ THE ESTATE ALREADY PRESCRIBED THIS CURE, AND THE GRAPH IT ASKED FOR EXISTS

`runPipeline`'s own docblock (`pipeline.js:118-137`), verbatim:

    A step-level partial-rerun engine used to live here (getAffectedSteps/rerunAffected) but it
    was dead, untested, and buggy (it keyed on step names while callers think in data keys, and
    its context merge clobbered the very overrides it was given), so it was retired. ... If true
    step-level partial reruns are ever needed, build them on an explicit per-step
    `reads`/`provides` data-dependency graph — not the old step-name model.

That graph is P0-E1's table, and it is strict-mode-enforced today. **The pinned mode is keyed on
DATA KEYS (`provides`), exactly as the retirement note requires**, which is what makes the skip
GENERIC: a step every one of whose `provides` keys is already pinned in the initial context is
skipped. No root-writing step needs its own edit.

⚠ The same docblock names `settlementSlice.applyChange`, which does NOT exist:
`git grep -n "applyChange" -- src/store` returns one unrelated comment in
`settlementRenameHelpers.js:37`. A documentation-truth defect, out of this packet's scope,
recorded for the receipt.

## P0-E3 · THE SAFETY PROOF — `rng.fork(name)` PER STEP

```
$ sed -n '162,166p' src/generators/pipeline.js
  for (const name of stepOrder) {
    const step = _steps.get(name);
    // Fork a PRNG for this step so it's deterministic regardless of step order changes
    const stepRng = rng.fork(name);
```

Each step draws from a stream forked by its own NAME, not from a shared sequence. **Therefore
skipping a step, or releasing one pin inside a step, cannot shift any other step's draws** — the
property the whole pinned mode rests on. It is asserted by A5 rather than assumed.

## P0-E4 · THE POPULATION SEAM — ALREADY HALF-SPLIT

```
$ grep -n "export const generateNPCs\|export const generateRelationships" src/generators/npcGenerator.js
1440:export const generateNPCs = (
1640:export const generateRelationships = (npcs, config = {}, institutions = []) => {
$ git grep -n "export const generateFactions" -- src/generators
src/generators/power/factionGrouping.js:23:export const generateFactions = (npcs, relationships) => {
$ sed -n '63,68p' src/generators/steps/generatePopulation.js
  const npcs = generateNPCs({ tier, institutions, powerStructure, economicState },
    culture, effectiveConfig, generationContext, densityMassTarget);
  const relationships = generateRelationships(npcs, effectiveConfig, institutions);
  const factions = generateFactions(npcs, relationships);
```

`generateNPCs` is the ROOT half. `generateRelationships` is ALREADY a separate export and
`generateFactions` ALREADY lives in another module — both take `npcs` as their first argument, so
**the deriving half already runs from a GIVEN roster.** The seam is a step boundary, not a
refactor of either generator.

## P0-E5 · THE SPLIT COSTS NO DEPENDANT EDITS — measured

```
$ git grep -n "'generatePopulation'" -- src/generators
src/generators/steps/assembleSettlement.js:82:  deps: [... 'generatePopulation' ...]
src/generators/steps/corruptionPass.js:43:      deps: ['generatePopulation', 'economyReconcilePass'],
src/generators/steps/generateNarratives.js:23:  deps: ['generatePopulation', 'economyReconcilePass'],
$ cat src/generators/steps/index.js        (a pure import barrel, 22 side-effect imports)
```

Three steps name `generatePopulation` in `deps`. Registering the new ROOT step as
`drawPopulation` **before** it, and keeping the name `generatePopulation` for the DERIVING half
with `deps: ['drawPopulation', …]`, leaves all three dependants resolving unchanged (`getStepOrder`
is a topological walk over `deps`, `pipeline.js:104-139`) and needs **no edit to
`steps/index.js`** either, because both `registerStep` calls live in the file it already imports.

## P0-E6 · THE BUDGET — IT FITS; NO SPLIT IS NEEDED

| Row | Measured | Limit |
|---|---:|---:|
| existing logic-bearing production files modified | **2** (`src/generators/pipeline.js`, `src/generators/steps/generatePopulation.js`) | ≤3 |
| additional registration-only files | **0** | ≤3 |
| new logic-bearing leaves | 0 | ≤2 |
| handwritten files total | 3 | ≤12 |

Effective lines at the base, executed with eslint's own `Linter` under `max-lines`
(`skipBlankLines`, `skipComments`):

```
$ node -e "const {Linter}=require('eslint');…max-lines{max:1,skipBlankLines,skipComments}…"
src/generators/pipeline.js                 -> File has too many lines (113). Maximum allowed is 1.
src/generators/steps/generatePopulation.js -> File has too many lines (142). Maximum allowed is 1.
```
Neither carries a `scripts/.size-baseline.json` entry, and the `src/generators/**` layer ceiling
is 800 (`eslint.config.js:684-689`). Headroom is ample; neither is a hot file.

**So EM-P0 does NOT split.** The chair's P0a/P0b boundary is not reached, and the reason is
P0-E2's: the skip is generic over `provides`, so the two other root-writing steps
(`assembleInstitutions`, `generatePower`) need no edit at all.

## P0-E7 · THE GOLDEN POSTURE — UNCHANGED, AND THE STANDING PROOF

```
$ sed -n '796,801p' tests/property/generatorGoldenMaster.test.js
function hashFor(config) { const { _seed, ...cfg } = config;
  const s = generateSettlementPipeline(cfg, null, { seed: _seed, customContent: {} });
  return createHash('sha256').update(JSON.stringify(s)).digest('hex'); }
$ python3 -c "import json;print(len(json.load(open('tests/fixtures/generator-golden-master.json'))))"
525
$ grep -n "MANIFEST_REL" tests/property/dossierProseManifest.test.js
83:const MANIFEST_REL = 'tests/fixtures/dossier-prose-manifest-golden.json';
```

Fresh generation passes NO pins, so it takes the identical path it takes today and both fixtures
are byte-identical. `UPDATE_GOLDEN=1 …` is FORBIDDEN to this packet.

## P0-E8 · TEST PRECEDENT

```
$ ls tests/generators | wc -l
111
$ grep -n "describe(\|  it(" tests/domain/settlementMigrations.test.js | head -4
21:describe('Tier 1.4 — migration chain integrity', () => {
83:  it('is idempotent on an already-current settlement', () => {
90:  it('does not mutate the input', () => {
```
`tests/generators/` is one of the eight mutation-coverage `ENFORCER_DIRS`, so
`tests/generators/pipelinePinnedMode.test.js` **OWES a `scripts/mutation-coverage-manifest.json`
row** — priced in the manifest.

---

# ══ VERSION 2 — THE RE-CUT (ODQ §934.47 addendum 9, ledger `c22c25efc`) ══

The v1 design above is **REFUTED BY EXECUTION** by the EM-P0 build lane. Its probes are in
`$SP/lane-em-p0-scratch/`; I read them and re-verified every mechanism statically at my own base.
The refuted claim was v1 §P0-E4's *"the deriving half already runs from a GIVEN roster"* — true of
its ARGUMENTS, false of its DRAWS.

## P0-E9 · ⛔ THE DERIVING HALF DRAWS — 67 TIMES, ON THE STEP'S OWN STREAM

The build lane's counting probe (`$SP/lane-em-p0-scratch/probe.mjs`) wraps a PRNG, binds it with
`setActiveRng`, and calls the three deriving functions:

```
DERIVE-HALF DRAWS ON THE STEP STREAM:
  generateRelationships = 62   generateFactions = 2   generateConflicts = 3   TOTAL = 67
```

Re-verified statically at `d31af2cee`, the two channels those 67 draws travel:

```
$ grep -n "from '.*rngContext" src/generators/npcGenerator.js
16:import { random as _rng, pick as ctxPick } from '../kernel/rngContext.js';
$ sed -n '186,188p' src/generators/pipeline.js
    const prevRng = setActiveRng(stepRng);
    try {
      const patch = step.fn(ctx, stepRng);
$ grep -n "^export function" src/kernel/rngContext.js
45,57,62,91,105,110,115,121,126,135  setActiveRng clearActiveRng getActiveRng unseededRandom
                                     random chance pick randInt shuffle weightedPick
$ sed -n '123p' src/generators/steps/generatePopulation.js
    const roll = rng.random() * totalPower;
$ grep -n "export const generateConflicts" src/generators/power/conflicts.js
55:export const generateConflicts = (factions, relationships, config = {}, institutions = []) => {
```

**(a) AMBIENTLY** — `npcGenerator.js:16` imports `random` and `pick` from `kernel/rngContext.js`,
and `pipeline.js:187` binds the step's stream with `setActiveRng(stepRng)` for the whole step body.
So `generateRelationships`'s 62 draws come off the STEP's stream without ever naming it.
**(b) DIRECTLY** — `generatePopulation.js:123`'s power-weighted scatter calls `rng.random()` on the
step's own handle.

**`generateRelationships` and `generateFactions` take the roster as an argument AND STILL DRAW.**
An argument is not a proof of purity, and v1 read one as the other.

## P0-E10 · ⛔⛔ WHY THE SPLIT COULD NEVER WORK — `fork` MINTS AT POSITION 0

```
$ sed -n '84p' src/kernel/prng.js
    fork: (label) => createPRNG(`${seed}::${label}`),
```

A fork is `createPRNG` over a DERIVED SEED. It is a FRESH stream at position 0 every call, for a
given label — never a continuation. **Two registered steps can therefore never share one stream
position**, whatever they fork. The lane proved it three ways over a 41-row sample of the 525-row
corpus (`$SP/lane-em-p0-scratch/goldhash.mjs`):

| variant | design | golden rows moved |
|---|---|---:|
| **V1** | two registered steps, each forking its own name | **41 of 41** |
| **V2** | two registered steps, the root half forking the string `'generatePopulation'` | **41 of 41** |
| **V3** | ONE shared stream object threaded through both halves | **0 of 41** |

⭐ **V2 is the one that matters, and it convicts v1's §6 precisely.** v1 predicted that forking the
original name would preserve the draws, and named a wrong spelling as A7's whole conviction. The
prediction was WRONG: the root half forking `'generatePopulation'` gets that label's stream at
position 0, and the derive half — in the second registered step — then gets ITS OWN stream at
position 0 instead of continuing where the root half stopped. **The 67 draws land at different
positions, and 41 of 41 sampled rows move.** Only V3 — one stream object, one registered step —
holds.

## P0-E11 · THE STEP'S DECLARATIONS, EXACTLY (re-cut item 5)

```
$ sed -n '27,33p' src/generators/steps/generatePopulation.js
registerStep('generatePopulation', {
  deps: ['coherenceRepairPass', 'powerEconomyReconcilePass'],
  reads: ['culture', 'economicState', 'effectiveConfig', 'generationContext', 'institutions', 'powerStructure', 'tier'],
  readsVersion: { economicState: 'reconciled' },
  provides: ['npcs', 'relationships', 'factions', 'conflicts'],
  phase: 'population',
}, (ctx, rng) => {
```

**The re-cut changes NONE of them.** The step stays one registration, so `reads` gains nothing
(v1's worry about the derive half needing `npcs` in `reads` is MOOT — `npcs` never leaves the step
body) and `provides` keeps all four keys. `deps`, `readsVersion` and `phase` are untouched, and the
three steps that `deps: ['generatePopulation']` are untouched for the same reason.

## P0-E12 · THE PINS' KEYS — P0 DEFINES THE SPELLING; P2 REGISTERS AGAINST IT (re-cut item 3)

The chair asked which way the dependency runs. **Measured, it runs P0 → P2, and the train order
does NOT flip.**

The pin a chooser consults is keyed by the RECORD PATH it writes — `npcs[].role`,
`relationships`, `factions`, `conflicts` — which is a fact about the RECORD, readable off a
generated settlement today, with no registry in the tree:

```
$ grep -n "provides: \['npcs', 'relationships', 'factions', 'conflicts'\]" src/generators/steps/generatePopulation.js
31:  provides: ['npcs', 'relationships', 'factions', 'conflicts'],
$ ls src/domain/generation 2>&1
ls: src/domain/generation: No such file or directory
```

Three measurements decide it:

1. **The chooser call sites are inside the step's own body.** `generatePopulation` knows its four
   choosers without consulting anything — it calls them. A registry is not an input to the
   mechanism.
2. **The registry's job is TOTALITY, which is a GUARD OVER the mechanism, not a precondition of
   it.** EM-P2's A1 asserts the declared set equals the scanned set both directions; that arm can
   only be written once the choosers consult pins under a settled key spelling.
3. **Sequencing P2 first is the actual circularity:** P2's rows carry an `outputKey` whose spelling
   P0 has not yet defined, so P2 would be registering against a contract that does not exist.

**So: EM-P0 defines the key spelling (the record path), lands first, and EM-P2 then registers every
chooser against it and proves no chooser was missed.** EM-P0 `Depends on: NONE`; EM-P2 keeps
`Depends on: EM-P0`. The train order stands: **T1 = P0 (alone), T2 = P2, T3 = P1 (alone)**.

## P0-E13 · THE BASE IS STILL GOOD — the J-T1 window re-proved across 26 commits

The chair offered `d31af2cee` with J-T1 or the tip `f32b0e984`. **`d31af2cee` holds**, proved by
object id over every path this packet measures:

```
$ git log --oneline d31af2cee..f32b0e984 | wc -l
26
$ for f in <the eight P0 paths>; do [ "$(git rev-parse d31af2cee:$f)" = "$(git rev-parse f32b0e984:$f)" ] && echo IDENTICAL $f; done
IDENTICAL src/generators/pipeline.js
IDENTICAL src/generators/steps/generatePopulation.js
IDENTICAL src/kernel/prng.js
IDENTICAL src/kernel/rngContext.js
IDENTICAL src/generators/npcGenerator.js
IDENTICAL src/generators/power/conflicts.js
IDENTICAL src/generators/power/factionGrouping.js
IDENTICAL tests/fixtures/generator-golden-master.json
```

Zero MOVED across 26 commits, so every figure in this file is executed at both ends of the window.

## P0-E14 · THE BUDGET, RE-MEASURED FOR THE RE-CUT

Still **two** existing logic-bearing production files, and now with LESS surgery than v1:

| file | effective (eslint `Linter`) | ceiling | baseline entry |
|---|---:|---:|---|
| `src/generators/pipeline.js` | **113** | 800 | none |
| `src/generators/steps/generatePopulation.js` | **142** | 800 | none |

v1 split one registration into two; v2 leaves the registration alone and moves a seam INSIDE the
file, which is strictly smaller. `steps/index.js`, `assembleSettlement.js`, `corruptionPass.js`,
`generateNarratives.js`, `npcGenerator.js`, `power/conflicts.js` and `power/factionGrouping.js` are
all untouched, as they were in v1.

## P0-E15 · A7 IS REPLACED — there is no fork spelling left to get wrong (re-cut item 6)

v1's A7 convicted a wrong fork spelling. **The re-cut mints no fork at all**, so that conviction has
no subject. It is replaced by the probe the lane's V3 result earned: **the step's stream object
must be the SAME OBJECT in both halves**, asserted by identity (`===`) at the seam, with the
whole-corpus golden equality beside it. That is the executable form of "one stream, one step".
