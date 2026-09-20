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
