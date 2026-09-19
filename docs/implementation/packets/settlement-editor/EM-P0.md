# Settlement editor / EM-P0 — THE PIPELINE SEAM: `runPipeline` gains a pinned mode keyed on the declared `provides` graph, the population step splits its draw from its derivations, and fresh generation is byte-identical

- **Status:** DRAFT
  ⚠ The status value above stands ALONE on its line because `parsePacketHeader`
  (`scripts/implementation-packets.mjs`) anchors the status row at end-of-line (J-TEWF1B-1).
- **Packet version:** 1
- **Verified base:** `fixes-2026-09-18-consist` at `d31af2ceebf643818201b2e2ab4a556765d2fc7c`
- **Last revalidated:** 2026-09-19 11:4x EDT at `d31af2cee`; the charter's Wave 0 read at `1d2da8c95`. Every measured `src/`, `tests/` and `scripts/` path is byte-identical across that window by object id (`EM-B2.evidence.md` §E0, §E12, §E14 — the `PACKET_STANDARD.md` J-T1 shape)
- **Depends on:** `NONE` — this is the train's first car
- **Collision group:** ⚠ **THE PIPELINE'S SPINE. RIDES ALONE IN ITS TRAIN** (charter Wave 0). It reserves `src/generators/pipeline.js` and `src/generators/steps/generatePopulation.js`; no other packet may hold either while it is non-terminal
- **Commit authority:** edits only; the chair commits
- **Baseline posture:** measured — `src/generators/pipeline.js` **113** effective lines and `src/generators/steps/generatePopulation.js` **142**, both by eslint's own `Linter` under `max-lines` with `skipBlankLines` + `skipComments`; neither carries a `scripts/.size-baseline.json` entry and the `src/generators/**` layer ceiling is 800 (`eslint.config.js:684-689`). The golden master fixture holds **525** rows. The lighting census tuple is `2645 / 383 / 2262 / 25009 / 6670` at `e5a27a1a5`
- **Preamble:** docs/implementation/preambles/EM-PREAMBLE.md (SHA-256: TO BE STAMPED BY THE CHAIR)
- **Evidence:** `EM-P0.evidence.md` — every verified row receipted by command and output.

---

## §0 · THE ONE SENTENCE, AND WHY IT IS CHEAP

`runPipeline` runs all 23 registered steps unconditionally from a context built out of config, and
accepts no record — which is why `rederive` had nothing to attach to (EM-B2 §0Z). This packet gives
it a **pinned mode keyed on the steps' own declared `provides`**: a step every one of whose
`provides` keys is already present in the initial context is SKIPPED, and the deriving steps then
run from the GIVEN roster.

⭐ **The estate prescribed exactly this, and the graph it asked for already exists.** `runPipeline`'s
docblock records that a step-level partial-rerun engine was built, found *"dead, untested, and
buggy (it keyed on step names while callers think in data keys)"*, retired, and left with one
instruction: *"If true step-level partial reruns are ever needed, build them on an explicit
per-step `reads`/`provides` data-dependency graph — not the old step-name model."* Every step
declares `deps`, `reads` and `provides` today, and strict mode enforces both halves. **This packet
keys on DATA KEYS, as instructed**, which is what makes the skip generic — and generic is what
keeps the budget at two files.

## §1 · Reconciled authority

1. **ODQ §934.47** (the chair, 2026-09-19) — the train gains Wave 0; this is its first car.
2. **`docs/DESIGN_EDIT_MODE_AND_DECREES.md` §14 final** (ODQ §934.44–§934.46) — one engine,
   re-derive with pins. Fresh generation with no pins is the golden and cannot move.
3. **THE PROMISE** — a seed is a starting world forever. This packet may not change what a seed
   produces; its whole proof is that it does not.
4. `docs/implementation/charters/EDIT-MODE-TRAIN.md` Wave 0, row **EM-P0** (at `1d2da8c95`).
5. `docs/ARCH_EDIT_MODE_AND_DECREES.md`'s prerequisites row: `runPipeline(initialContext, rng, { pins })`.
6. `PACKET_STANDARD.md`, `EM-PREAMBLE.md`.
7. Live git state at `d31af2cee`.

**Resolved contradictions**

- `runPipeline`'s docblock names `settlementSlice.applyChange` as the caller that re-runs the
  pipeline on an edit. **That symbol does not exist** (`git grep -n "applyChange" -- src/store`
  returns one unrelated comment at `settlementRenameHelpers.js:37`). A documentation-truth defect,
  OUT OF SCOPE, recorded in the receipt and repaired by no one here.
- The charter's row allows a P0a/P0b split "if more than three logic files must move". **Measured,
  two move** (§3), so the split is not taken and the reason is stated rather than assumed.

## §2 · Outcome

**Observable result:** `runPipeline(initialContext, rng, { pins })` runs the deriving steps against
a pre-populated roster and skips every root-writing step whose outputs the pins supply; called with
no `pins`, it behaves exactly as it does today, byte for byte.

**Definition of done:** the pinned mode exists at §6's exact contract; `generatePopulation` is two
registered steps (`drawPopulation` → `generatePopulation`); pinning a golden-generated record's
roster reproduces that record byte-for-byte; both golden fixtures are unmoved.

**In scope**

1. the pinned mode in `runPipeline` (one primary behaviour);
2. the population step's root/derive split (the one required integration);
3. `tests/generators/pipelinePinnedMode.test.js` (the prevention guard).

**Explicit non-goals**

- `pinsFrom(record)` and `rederive(record, config', layer)` — **EM-B2a's**;
- `dmLayer`, any layer override, any edit surface, any store change;
- stable entity ids — **EM-P1's** (owner-gated); this packet pins by the ctx KEY, never by an id;
- registering generation's choosers — **EM-P2's**;
- any change to what an unpinned generation produces. That is the STOP condition, not a goal.
- Record adjacent discoveries in the receipt; do not investigate or repair them.

## §3 · Hard scope budget

| Limit | Packet budget | Standard |
|---|---:|---:|
| Behavior families | 1 | 1 |
| New persisted record families | 0 | ≤1 |
| Named state writers | 0 (a runner option, not a state writer) | ≤1 |
| Feature flags | 0 | ≤1 |
| User-facing surfaces | 0 | ≤1 |
| Direct consumers | 0 (no caller passes `pins` until EM-B2a) | ≤2 |
| New logic-bearing production leaves | **0** | ≤2 |
| Existing logic-bearing production files modified | **2** | ≤3 |
| Additional registration-only files | **0** | ≤3 |
| Handwritten files total | **4** | ≤12 |
| New/changed effective production lines | ≤90 | ≤400 |
| Effective lines per new leaf | n/a | ≤250 |
| Delta in a shared/hot file | n/a — neither file is baselined or hot | ≤15 |
| Acceptance cases | 7 | ≤8 |

Overrides approved before dispatch: `NONE`.

⭐ **WHY IT FITS, stated so it can be refused.** Three steps are ROOT-WRITING — `assembleInstitutions`
(`provides: ['institutions', …]`), `generatePower` (`provides: ['powerIntent','powerStructure']`)
and `generatePopulation` (`provides: ['npcs','relationships','factions','conflicts']`). The skip is
**generic over `provides`**, so the first two need NO edit. Only `generatePopulation` needs surgery,
because it alone provides BOTH roots (`npcs`, `factions`) and derivations (`relationships`,
`conflicts`) from one body. Hence two files, not five.

## §4 · Sealed dispatch and preflight

```sh
npm run implementation:dispatch -- EM-P0
```

Expected: exact packet Markdown and capsule emitted; ancestry and substrate proven; the CREATE
target absent; both MODIFY targets clean; every §5 symbol resolving; foreign dirt fingerprinted
without target overlap. ⚠ This packet reserves the pipeline's spine — confirm no sibling packet
holds either MODIFY path at a non-terminal status before dispatch.

## §5 · Verified tree contract

| Role | File | Symbol | Verified fact | Required use |
|---|---|---|---|---|
| The runner | `src/generators/pipeline.js` | `export function runPipeline` | iterates `getStepOrder()` and calls `step.fn(ctx, stepRng)` for every step unconditionally; accepts `initialContext`, `rng`, `options`; `options` already carries `onStep`, `strict`, `onStrictViolation` | Gains exactly one option, `pins` |
| The order | `src/generators/pipeline.js` | `export function getStepOrder` | a topological walk over each step's `deps`, throwing on cycles and on an unknown step | Unchanged; the new step joins the graph through `deps` |
| The registry | `src/generators/pipeline.js` | `export function registerStep` | throws on a duplicate name; stores `{ name, ...meta, fn }` | Used once more, for `drawPopulation` |
| ⭐ The safety fact | `src/generators/pipeline.js` | `const stepRng = rng.fork(name);` | every step draws from a stream forked by its own NAME | **This is why a skipped step cannot shift another step's draws.** A5 asserts it |
| The seam step | `src/generators/steps/generatePopulation.js` | `registerStep('generatePopulation', {` | `deps: ['coherenceRepairPass','powerEconomyReconcilePass']`, `provides: ['npcs','relationships','factions','conflicts']` — the one step providing both roots and derivations | Splits into two registrations in this same file |
| The root half | `src/generators/npcGenerator.js` | `export const generateNPCs = (` | takes `(settlement, culture, config, generationContext, massTarget)`; takes NO roster; draws the roster | Called only by `drawPopulation`; UNCHANGED |
| The derive half (1) | `src/generators/npcGenerator.js` | `export const generateRelationships = (npcs, config = {}, institutions = []) => {` | already a separate export whose FIRST argument is the roster | Called only by `generatePopulation`; UNCHANGED |
| The derive half (2) | `src/generators/power/factionGrouping.js` | `export const generateFactions = (npcs, relationships) => {` | already in another module; runs from a GIVEN roster | Called only by `generatePopulation`; UNCHANGED |
| The other root-writers | `src/generators/steps/assembleInstitutions.js` · `src/generators/steps/generatePower.js` | `registerStep('assembleInstitutions', {` · `registerStep('generatePower', {` | `provides: ['institutions', 'catalogForTier', 'generationRepairs']` · `provides: ['powerIntent', 'powerStructure']` | **NOT EDITED.** The generic skip covers them |
| Golden authority | `tests/property/generatorGoldenMaster.test.js` | `function hashFor(config)` | `sha256(JSON.stringify(generateSettlementPipeline(cfg, null, { seed, customContent: {} })))` over a 525-row fixture | UNCHANGED; the standing proof |
| Prose golden | `tests/property/dossierProseManifest.test.js` | `const MANIFEST_REL` | `'tests/fixtures/dossier-prose-manifest-golden.json'` | UNCHANGED |
| Test precedent | `tests/domain/settlementMigrations.test.js` | `describe('Tier 1.4 — migrateSettlementToLatest behavior')` › `it('is idempotent on an already-current settlement')`, `it('does not mutate the input')` | flat literal registration; idempotency and purity arms | Copy this proof shape |

**Forbidden alternatives**

- no second runner, no second step registry, no second PRNG stream, no re-introduction of the
  retired `getAffectedSteps`/`rerunAffected` step-name model;
- no edit to `generateNPCs`, `generateRelationships` or `generateFactions` — the seam is a step
  boundary, and moving a generator body would put the golden at risk for no gain;
- no edit to `assembleInstitutions.js`, `generatePower.js`, `steps/index.js`, or any step that
  `deps` on `generatePopulation` (`assembleSettlement.js`, `corruptionPass.js`,
  `generateNarratives.js`) — measured, none needs one;
- no file outside the §7 manifest.

## §6 · Exact contracts

### Inputs and outputs

```js
/**
 * @typedef {Record<string, unknown>} Pins  A map of ctx KEY → the value to hold fixed.
 *   Keyed on the steps' declared `provides` keys — never on a step NAME (the retired engine's
 *   defect, recorded in runPipeline's own docblock) and never on an entity id (EM-P1's).
 */

/**
 * @param {Object} initialContext
 * @param {Object} rng
 * @param {Object} [options]
 * @param {Pins}   [options.pins]  ABSENT or an empty object ⇒ today's behaviour EXACTLY.
 * @returns {Object} the accumulated context
 */
export function runPipeline(initialContext, rng, options = {});
```

**The rule, complete and without discretion.** Before the loop, `ctx` is seeded with
`{ ...initialContext, ...pins }`. Then for each step in `getStepOrder()`:

1. Let `P` be the step's declared `provides` (absent or `[]` ⇒ treat as `[]`).
2. **SKIP** the step when `P` is non-empty AND every key in `P` is an own key of `pins`.
3. A skipped step still consumes `rng.fork(name)` — the fork is taken and discarded — so a skip
   cannot shift any other step's stream. (Measured: each step's stream is forked by NAME, so this
   is belt-and-braces; it is done anyway so the rule holds if forking ever changes.)
4. A step with an EMPTY `provides` is never skipped: it exists for its `mutates`, and skipping it
   would drop work no pin supplies.
5. A step whose `provides` are only PARTIALLY pinned is NOT skipped; it runs, and `Object.assign`
   lets its output overwrite the pin. ⛔ **Partial pinning is therefore an ERROR, not a silent
   half-measure:** when `pins` holds some but not all of a step's `provides`, `runPipeline` throws
   `Pipeline pins: step "<name>" provides [<all>] but pins supply only [<subset>] — pin the whole
   step's outputs or none of them.` Under `onStrictViolation` it reports `{ step, kind: 'pin', keys }`
   instead, matching the existing strict-violation shape.
6. Strict mode is unchanged: a skipped step neither reads nor writes, so it can raise neither the
   `read` nor the undeclared-write violation.

### State schema

`pins` is transient. Nothing is persisted, and no settlement key is added or removed.

**Absence rules**

- **absent** `options.pins`: today's behaviour, exactly. This is the fresh-generation path and
  the goldens' path.
- **empty** `{}`: identical to absent — no step's `provides` can be a non-empty subset of `{}`.
- **`null`**: read as absent; never written.
- **invalid** (a non-object, or a key naming nothing any step provides): a key no step provides is
  seeded into `ctx` and otherwise IGNORED — it is an initial-context value, which is what the
  runner already accepts. A non-object `pins` throws `Pipeline pins: options.pins must be a plain
  object`.

### Transition table

| Prior state | Input/event | Guard | Next state | Receipt |
|---|---|---|---|---|
| any | `runPipeline(ctx, rng, {})` | — | identical to `runPipeline(ctx, rng)` byte for byte | none |
| `pins` ⊇ a step's whole `provides` | that step's turn | `provides` non-empty | step skipped; `rng.fork(name)` still taken | `onStep` NOT called for it |
| `pins` ⊃ part of a step's `provides` | that step's turn | — | **throws** (or `onStrictViolation({step, kind:'pin', keys})`) | the exact message of rule 5 |
| `pins` names a key no step provides | before the loop | — | seeded into `ctx`, ignored thereafter | none |
| a step with `provides: []` | its turn | — | ALWAYS runs | normal |

### Ordering and precedence

- **Pipeline position:** the skip decision is taken inside the existing `for (const name of stepOrder)`
  loop, before `step.fn` is called. `getStepOrder()` is NOT re-sorted and `deps` are NOT rewritten.
- **Same-tick visibility:** `ctx` accumulates exactly as today (`Object.assign(ctx, patch)`).
- **Merge/replace:** pins are seeded FIRST and a running step's patch overwrites them — which is
  why rule 5 refuses a partial pin rather than allowing a silent overwrite.
- **Tie-break:** none.

### Determinism

- **Hash/fork key:** unchanged — `rng.fork(name)`, per step, by name.
- **Stable enumeration:** `getStepOrder()`'s existing topological order, unchanged.
- **Rounding/clamping:** none.
- **No-draw behaviour:** no `pins` ⇒ not one draw moves. This is A1 and the goldens.

### The population split

`src/generators/steps/generatePopulation.js` registers TWO steps, both in that one file:

```js
registerStep('drawPopulation', {
  deps: ['coherenceRepairPass', 'powerEconomyReconcilePass'],
  reads: <the existing step's reads>,
  provides: ['npcs'],                       // THE ROOT
}, (ctx, rng) => ({ npcs: generateNPCs(...) }));   // the existing call, verbatim

registerStep('generatePopulation', {
  deps: ['drawPopulation'],
  reads: [...<the existing reads>, 'npcs'],
  provides: ['relationships', 'factions', 'conflicts'],   // THE DERIVATIONS
}, (ctx, rng) => ({ ...<the existing body from generateRelationships onward> }));
```

⛔ **The name `generatePopulation` stays on the DERIVING half**, so the three steps that
`deps: ['generatePopulation']` — `assembleSettlement.js:82`, `corruptionPass.js:43`,
`generateNarratives.js:23` — resolve unchanged and are NOT edited. `steps/index.js` is NOT edited,
because both registrations live in the file it already imports. The `densityMassTarget` roll stays
with the ROOT half (it is a draw that sizes the roster). No generator body moves.

### Flag and dormancy

- **Flag:** `NONE`. The pinned mode is dormant by absence: no caller passes `pins` until EM-B2a.
- **Golden posture:** **UNCHANGED.** `tests/fixtures/generator-golden-master.json` (525 rows) and
  `tests/fixtures/dossier-prose-manifest-golden.json` byte-identical.
  ⛔ `UPDATE_GOLDEN=1 npx vitest run tests/property/generatorGoldenMaster.test.js` is **FORBIDDEN**
  to this packet, and any motion of either fixture is a STOP, not a re-record. Splitting one step
  into two changes no draw: each half keeps the stream its work took, because `rng.fork(name)` is
  keyed by name and the ROOT half is the one that draws.
  ⚠ **THE ONE REAL RISK, NAMED:** `drawPopulation` is a NEW step name, so it forks a NEW stream
  (`rng.fork('drawPopulation')`) where the draw previously came from `rng.fork('generatePopulation')`.
  **The root half MUST therefore fork the string `'generatePopulation'`, not its own name** — the
  implementer passes the original name explicitly. A1 is what convicts a wrong spelling.

### Lifecycle

| Create | Read | Persist | Reload | Regenerate | Undo | Import/migrate | Public veil |
|---|---|---|---|---|---|---|---|
| `pins` is created by a caller per call; none exists until EM-B2a | read once, before the loop | NOTHING is persisted | n/a | **this packet is the regeneration seam itself**; today's callers pass no pins and are unaffected | n/a | n/a | n/a — no projection, no surface, no receipt string |

### Receipts and privacy

- **Closed kinds:** the strict-violation `kind` vocabulary gains exactly one member, `'pin'`,
  beside the existing `'read'` and the undeclared-write report.
- **Address chain:** `{ step: <name>, kind: 'pin', keys: [<provides keys>] }`.
- **Numeric-to-word bands:** `NONE`. **DM-only fields:** `NONE`. **Player projection:** `NONE`.

### Alignment and edit story

- **Alignment:** `DECLARED EMPTY`.
- **Edit story:** `ENGINE-ONLY` — a runner option with no DM verb. The DM's path reaches it through
  EM-B2a's `rederive`.

## §7 · Exact change manifest

| Action | File | Symbol/region | Maximum delta | Coding instruction |
|---|---|---|---:|---|
| `MODIFY` | `src/generators/pipeline.js` | `runPipeline` (the option, the seed, the skip and the partial-pin refusal) + its docblock | +55 eff | Implement §6's six rules. Key on `provides`, never on a step name. Do NOT re-introduce `getAffectedSteps`/`rerunAffected`. Measured 113 effective lines; ceiling 800; no baseline entry. |
| `MODIFY` | `src/generators/steps/generatePopulation.js` | `registerStep('generatePopulation', …)` → two registrations | +30 eff | Split per §6. The ROOT half forks the string `'generatePopulation'` explicitly. Move no generator body; change no call's arguments. Measured 142 effective lines. |
| `CREATE` | `tests/generators/pipelinePinnedMode.test.js` | A1–A7 | n/a | Copy `tests/domain/settlementMigrations.test.js`'s shape. Flat literal `it(...)` only — no `.each`, no loops, no conditionals, no nested describes (`EM-PREAMBLE.md` §P3.4). |
| `REGISTER` | `scripts/mutation-coverage-manifest.json` | the `invariants` row for `tests/generators/pipelinePinnedMode.test.js` | +4 eff | `tests/generators` is one of the eight `ENFORCER_DIRS`, so the row is owed. Add it SURGICALLY beside its siblings; ⛔ never re-serialise the manifest whole. |

**Generated artifacts:** `tests/lint/.lighting-census-baseline.json`, regenerated, never hand-edited:

```sh
LIGHTING_CENSUS_REFREEZE='EM-P0' LIGHTING_CENSUS_NOTE='EM-P0: one new test file (the pinned-mode battery)' \
  npx vitest run tests/lint/sovereigntyLightingContract.walker.test.js
```

**Predicted INTERIOR RED:** the lighting census moves `2645 / 383 / 2262 / 25009 / 6670` →
**`2646 / 383 / 2263 / <25009 + the file's literal titles> / <6670 + its literal suite titles>`** —
`+1 file, +0 parked, +1 credited`, the title figures exact once the file is written and counted by
execution. The cause is the ONE new TEST file (the walker walks `tests/` only —
`EM-B2.evidence.md` §E7a; ⚠ `EM-PREAMBLE.md` §P2.1 attributes this to `src/domain/**` and is wrong).

**Registers that do NOT move:** `scripts/check-writer-reach.mjs` (no new written identity, no new
customer surface), `scripts/check-observed-shape-readers.mjs` (no new reader of a save-time key),
`scripts/.size-baseline.json` (neither file has an entry; neither approaches 800),
`tests/lint/proseNumerics.test.js` (nothing rendered), the five edge-shared bundles (neither file
is in a closure).

No other file may be edited.

## §8 · Ordered coding sequence

0. Dispatch and seal; stop on any preflight mismatch.
1. Capture the baseline: both golden fixtures' SHA-256; the lighting tuple; eslint `Linter`
   `max-lines` for both MODIFY targets (expect **113** and **142**).
2. Add the failing tests for A1–A7.
3. Implement the pinned mode in `runPipeline` (§6's six rules).
4. Split `generatePopulation` into `drawPopulation` + `generatePopulation`, the root half forking
   the string `'generatePopulation'`.
5. (no consumer to wire — the mode is dormant by absence.)
6. Add the mutation-coverage row; regenerate the lighting baseline; re-run the walker plainly.
7. Run the focused verification of §10.
8. ⚠ This packet RIDES ALONE: its own bare full gate and boot smoke are its terminal. Write §12.

**Bounded algorithm — the skip**

```text
1. If options.pins is absent or null, run exactly as today. Return early from this logic.
2. If options.pins is not a plain object, throw the §6 message.
3. ctx = { ...initialContext, ...pins }.
4. For each step name in getStepOrder():
   a. stepRng = rng.fork(name)          — ALWAYS, skipped or not.
   b. P = step.provides || [].
   c. If P is empty            -> run the step.
   d. Else if every key of P is an own key of pins -> SKIP (do not call step.fn, do not call onStep).
   e. Else if SOME key of P is an own key of pins  -> throw the partial-pin message
                                                      (or report {step, kind:'pin', keys}).
   f. Else                     -> run the step.
```

## §9 · Acceptance matrix

| ID | Case | Fixture/input | Required observation | Test home |
|---|---|---|---|---|
| A1 | ⛔ Main behavior — THE NULL CHANGE | the golden corpus, run with no `pins` and with `pins: {}` | `generateSettlementPipeline` output is **byte-identical** to the committed `tests/fixtures/generator-golden-master.json` in both cases, and the prose manifest is unmoved. **This is the packet's whole promise** | `tests/generators/pipelinePinnedMode.test.js` |
| A2 | The pin reproduces the record | generate a settlement, take its `npcs`, `institutions`, `powerIntent`, `powerStructure`, `factions` as `pins`, re-run at the same seed | the resulting context's settlement is **byte-for-byte** the first one | `tests/generators/pipelinePinnedMode.test.js` |
| A3 | Counterforce — the skip really skips | pin a whole step's `provides` with an `onStep` spy | that step's name never reaches `onStep`, and the pinned values survive into the final settlement unmodified | `tests/generators/pipelinePinnedMode.test.js` |
| A4 | ⛔ Boundary — THE PARTIAL PIN REFUSES | `pins` holding `relationships` but not `factions` or `conflicts` | throws with the exact §6 message naming the step, its whole `provides` and the supplied subset; under `onStrictViolation` reports `{ step, kind: 'pin', keys }` and does not throw | `tests/generators/pipelinePinnedMode.test.js` |
| A5 | ⛔ Determinism — THE FORK IS PER-NAME | run with a pin that skips one step, and compare every OTHER step's output against the unpinned run | every unskipped step's output is identical — a skip shifts no other step's stream, because `rng.fork(name)` keys by name. Control: a skipped step still takes its fork | `tests/generators/pipelinePinnedMode.test.js` |
| A6 | Idempotency | run the same pinned call three times | all three outputs are byte-identical, and `pins` and `initialContext` are not mutated | `tests/generators/pipelinePinnedMode.test.js` |
| A7 | ⛔ Regression — THE SPLIT DREW NOTHING NEW | the split step pair against the pre-split behaviour | `drawPopulation` + `generatePopulation` together provide exactly `npcs`, `relationships`, `factions`, `conflicts`; `getStepOrder()` still resolves `assembleSettlement`, `corruptionPass` and `generateNarratives`; and the settlement is byte-identical to the unsplit run — proving the root half forked the string `'generatePopulation'` and not its own name | `tests/generators/pipelinePinnedMode.test.js` |

**7 of 8.** One case deliberately unused.

## §10 · Verification commands

```sh
npx eslint src/generators/pipeline.js src/generators/steps/generatePopulation.js \
  tests/generators/pipelinePinnedMode.test.js
npm run typecheck:ratchet
npm run typecheck:domain:strict

GATE_MUTEX_TIER=shared GATE_MUTEX_MAX_POLLS=100000 GATE_MUTEX_POLL_SECONDS=20 \
  sh scripts/gate-mutex.sh --run -- npx vitest run --pool=threads --maxWorkers=2 \
  tests/generators/pipelinePinnedMode.test.js tests/generators/assemblyCoherenceRngIsolation.test.js

GATE_MUTEX_TIER=shared GATE_MUTEX_MAX_POLLS=100000 GATE_MUTEX_POLL_SECONDS=20 \
  sh scripts/gate-mutex.sh --run -- npx vitest run --pool=threads --maxWorkers=2 \
  tests/property/generatorGoldenMaster.test.js tests/property/dossierProseManifest.test.js

GATE_MUTEX_TIER=shared GATE_MUTEX_MAX_POLLS=100000 GATE_MUTEX_POLL_SECONDS=20 \
  sh scripts/gate-mutex.sh --run -- npx vitest run --pool=threads --maxWorkers=2 \
  tests/lint/sovereigntyLightingContract.walker.test.js tests/lint/mutationCoverageManifest.test.js \
  tests/lint/entropyRootCensus.walker.test.js

node scripts/check-observed-shape-readers.mjs
node scripts/implementation-packets.mjs validate
npm run check:packet -- EM-P0
npm run implementation:resume -- EM-P0
```

Every command exits `0`. A lane never runs `npm run check`; it pauses at a held gate per
`EM-PREAMBLE.md` §P7 / HZ-GATE-POLL. ⚠ Because this car rides ALONE, its own bare full gate and a
separate boot smoke ARE its terminal and must both exit zero with the status captured in-shell.

## §11 · Mandatory STOP conditions

In addition to `PACKET_STANDARD.md` and `EM-PREAMBLE.md` §P8, stop if:

- either golden fixture's SHA-256 moves by one byte — **that is the whole failure mode**;
- an unpinned run differs from today's output in any way;
- a third existing logic-bearing production file must move;
- `assembleInstitutions.js`, `generatePower.js`, `steps/index.js`, or any step that `deps` on
  `generatePopulation` must be edited;
- a generator body (`generateNPCs`, `generateRelationships`, `generateFactions`) must move or
  change signature;
- the skip must key on a step NAME rather than on `provides`;
- a partial pin must be tolerated rather than refused;
- `getStepOrder()` must be re-sorted, or any step's `deps` rewritten;
- the retired `getAffectedSteps`/`rerunAffected` model must return;
- the lighting census moves by anything other than `+1 file / +0 parked / +1 credited`.

Do not edit the packet, broaden the manifest, repair unrelated gate failures, or continue into
the next wave.

## §12 · Completion receipt

- Base SHA:
- Dispatch bundle and seal identity:
- Final commit or working-tree state:
- Exact changed files and effective-line deltas (eslint `Linter`, before and after, both MODIFY targets):
- Acceptance cases A1–A7, executed and passed:
- Focused commands, exits, and counts:
- Sealed per-step receipt and exact-state resume status:
- Both typecheck configurations:
- ⚠ This car's OWN bare full gate and boot smoke, with exits captured in-shell:
- Base-versus-wave failure identity diff:
- Dormancy/golden result — both fixtures' SHA-256 before and after:
- Lighting census tuple before and after, attributed per file by execution:
- Generated artifacts: `NONE | tests/lint/.lighting-census-baseline.json`
- Deviations: `NONE | STOP`
- Out-of-scope observations, without investigation (expected: `runPipeline`'s docblock names `settlementSlice.applyChange`, which does not exist):
- Judgment calls: `NONE`
