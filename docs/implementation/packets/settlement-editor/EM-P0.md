# Settlement editor / EM-P0 — THE PIPELINE SEAM: `runPipeline` hands `pins` to every step, each chooser consults them, and `generatePopulation` keeps ONE registration and ONE stream with its root/derive seam moved inside

- **Status:** LANDED
  ⚠ The status value above stands ALONE on its line because `parsePacketHeader`
  (`scripts/implementation-packets.mjs`) anchors the status row at end-of-line (J-TEWF1B-1).
- **Packet version:** 2
  ⛔ **Version 1's design was REFUTED BY EXECUTION at the build lane** (ODQ §934.47 addendum 9,
  ledger `c22c25efc`). §0R records the refutation and what replaced it.
- **Verified base:** `fixes-2026-09-18-consist` at `d9497e90fef775c1282fc9de6b1b2cee1b46882a`
- **Last revalidated:** 2026-09-19 at `d9497e90fef775c1282fc9de6b1b2cee1b46882a` by the chair at promotion — re-pinned from d31af2cee under J-T1 (the eight measured paths byte-identical across the window by `git diff --stat`; the lane's object-id proof).
- **Landed:** 2026-09-19 at `429ceed54d3eea87b0d05ed2b37ffbbb92f37911` on `fixes-2026-09-18-consist` (train EM-T2, alone; the build lane's §12 receipt is in the chair kit's findings/EM-P0.receipt.md; the goldens byte-identical — 525 rows, 41 sampled, 0 moved; the sealed verbs refused on the lighting refreeze the packet scheduled inside itself — ruled: the census re-derives at the terminal, never inside a packet; the terminal is check 2 run 15).
- **Depends on:** `NONE`. ⭐ Measured in §0R.4: **EM-P0 defines the pin key spelling and EM-P2 registers against it**, not the reverse, so the train order stands — T1 = P0 (alone), T2 = P2, T3 = P1 (alone)
- **Collision group:** ⚠ **THE PIPELINE'S SPINE. RIDES ALONE IN ITS TRAIN.** It reserves `src/generators/pipeline.js` and `src/generators/steps/generatePopulation.js`
- **Commit authority:** edits only; the chair commits
- **Baseline posture:** measured — `src/generators/pipeline.js` **113** effective and `src/generators/steps/generatePopulation.js` **142**, by eslint's own `Linter` under `max-lines` with `skipBlankLines` + `skipComments`; neither carries a `scripts/.size-baseline.json` entry and the `src/generators/**` ceiling is 800. The golden fixture holds **525** rows; the lighting tuple is `2645 / 383 / 2262 / 25009 / 6670`
- **Preamble:** docs/implementation/preambles/EM-PREAMBLE.md (SHA-256: fece7560b7418c607f41717c9955aef87ad7496add1ee7dc863d1f038d3cd60e)
- **Evidence:** `EM-P0.evidence.md` — §P0-E1…E8 (v1, still valid on the step graph) and §P0-E9…E15 (the re-cut)

---

## §0R · ⛔⛔ WHAT VERSION 1 GOT WRONG, MEASURED — AND THE MECHANISM THAT REPLACES IT

### §0R.1 · The refuted claim

v1 read `generateRelationships(npcs, …)` and `generateFactions(npcs, relationships)` taking the
roster as their first argument and concluded *"the deriving half already runs from a GIVEN
roster"*. **True of its ARGUMENTS, false of its DRAWS.** The build lane counted:

> `generateRelationships` **62** draws · `generateFactions` **2** · `generateConflicts` **3** —
> **67 draws on the step's own stream.**

Two channels, both re-verified statically at this base: **ambiently**, because
`npcGenerator.js:16` imports `random` and `pick` from `src/kernel/rngContext.js` and
`pipeline.js :: runPipeline` binds the step's stream with `setActiveRng(stepRng)` for the whole step body; and
**directly**, at `generatePopulation.js :: linkFactions`'s `rng.random()` power-weighted scatter.

### §0R.2 · ⛔ Why the split could never have worked — `fork` mints at position 0

```
$ sed -n '84p' src/kernel/prng.js
    fork: (label) => createPRNG(`${seed}::${label}`),
```

A fork is `createPRNG` over a derived seed — **a fresh stream at position 0, never a
continuation**. Two registered steps can therefore never share one stream position. Proved three
ways over a 41-row sample of the 525-row corpus:

| variant | design | golden rows moved |
|---|---|---:|
| **V1** | two registered steps, each forking its own name | **41 of 41** |
| **V2** | two steps, the root half forking the string `'generatePopulation'` | **41 of 41** |
| **V3** | ONE shared stream object across both halves | **0 of 41** |

⭐ **V2 convicts v1's §6 exactly.** v1 predicted that forking the original name would preserve the
draws and made a wrong spelling A7's whole conviction. The prediction was wrong — the root half
gets that label's stream at position 0, the derive half then gets its own at position 0 rather than
continuing, and the 67 draws land elsewhere.

### §0R.3 · The mechanism, as the chair cut it

1. **`generatePopulation` stays ONE registered step with ONE stream.** No second registration, no
   second `fork`. The root/derive seam is **internal**: two functions inside the file, the step's
   stream object passed through. **Fresh generation is byte-identical BY CONSTRUCTION** — the same
   registration, the same stream, the same draws in the same order.
2. **The pinned mode is chooser-level, not step-level.** `runPipeline(initialContext, rng, { pins })`
   hands `pins` to every step through the CONTEXT. Inside a step, **every registered chooser
   consults the pins** — the roots AND the drawn derivations, because `relationships`, `factions`
   and `conflicts` are choosers too. In pinned mode they are pinned from the record and **nothing
   draws where the record holds the output**. A chooser the record lacks draws on the step's own
   stream — deterministic under the same seed and pins, and DISTINCT FROM FRESH GENERATION BY
   DESIGN.
3. **A missing pin for a chooser the record must hold THROWS** (v1's rule 5 survives, re-aimed from
   `provides` to choosers).

⛔ **v1's whole-step `provides` skip is RETIRED.** Chooser-level consult subsumes it, and the skip
was unsound anyway: a step whose outputs are wholly pinned still had to advance its stream for the
steps that follow, which a skip could not do.

### §0R.4 · ⭐ THE PIN KEYS — P0 DEFINES THE SPELLING, P2 REGISTERS AGAINST IT

The chair asked which way the dependency runs. **Measured, P0 → P2; the train order does not flip.**
The pin a chooser consults is keyed by the RECORD PATH it writes (`npcs[].role`, `relationships`,
`factions`, `conflicts`) — a fact about the record, readable today, with no registry in the tree
(`ls src/domain/generation` is ENOENT). Three measurements:

1. **The chooser call sites are inside the step's own body** — `generatePopulation` knows its four
   choosers because it calls them. A registry is not an input to the mechanism.
2. **The registry's job is TOTALITY, a GUARD OVER the mechanism** — EM-P2's A1 asserts declared ==
   scanned both directions, an arm writable only once the key spelling is settled.
3. **Sequencing P2 first is the real circularity** — its rows carry an `outputKey` whose spelling
   P0 has not yet defined.

## §1 · Reconciled authority

0. ⭐ **ODQ §934.47 addendum 9** (the chair, ledger `c22c25efc`), on the EM-P0 build's STOP: the
   mechanism above. **It supersedes version 1's §6 wherever they differ.**
1. **ODQ §934.47** — Wave 0; this is its first car.
2. **`docs/DESIGN_EDIT_MODE_AND_DECREES.md` §14 final** — one engine, re-derive with pins; fresh
   generation with no pins is the golden and cannot move.
3. **THE PROMISE** — a seed is a starting world forever. ⚠ `prng.js :: fork`'s own header records that
   changing the fork derivation *"re-rolls every seeded stream in the product and is owner-gated
   under THE PROMISE"*. **This packet does not touch it**, which is exactly why the seam moved
   inside the step.
4. Charter Wave 0 row **EM-P0**; the ARCH's prerequisites row; `PACKET_STANDARD.md`; `EM-PREAMBLE.md`.
5. Live git state at `d31af2cee`.

**Resolved contradictions**

- v1 §6's two-registration split → **REFUTED BY EXECUTION** (§0R.2). One registration, one stream.
- v1 §5's *"the deriving half already runs from a GIVEN roster"* → **REFUTED**: it draws 67 times
  (§0R.1). An argument is not a proof of purity.
- v1's whole-step `provides` skip → **RETIRED** in favour of chooser-level consult (§0R.3).
- `runPipeline`'s docblock names `settlementSlice.applyChange`, **which does not exist**
  (`git grep -n "applyChange" -- src/store` returns one unrelated comment at
  `settlementRenameHelpers.js:37`). v1 recorded it out of scope; **the re-cut corrects it in place**
  at +0 effective lines, since the packet is already editing that docblock.

## §2 · Outcome

**Observable result:** `runPipeline(initialContext, rng, { pins })` re-derives a settlement with
every chooser the record holds pinned and nothing drawn where a pin exists; called with no `pins`,
it produces byte-identical output to today's.

**Definition of done:** the pinned mode exists at §6's contract; `generatePopulation`'s root and
derive halves are separate functions sharing ONE stream object inside ONE registration; the goldens
are byte-identical plain; and a pinned re-derive of a golden-generated record reproduces it.

**In scope**

1. the chooser-level pinned mode in `runPipeline` (one primary behaviour);
2. `generatePopulation`'s internal seam and its four chooser consults (the required integration);
3. `tests/generators/pipelinePinnedMode.test.js` (the prevention guard).

**Explicit non-goals**

- `pinsFrom(record)` and `rederive(record, config, layer)` — **EM-B2a's**;
- registering the choosers — **EM-P2's** (this packet defines the key spelling it registers against);
- stable ids — **EM-P1's**; this packet pins by RECORD PATH, never by an entity id;
- ⛔ any change to `prng.js`'s fork derivation — owner-gated under THE PROMISE, and the whole reason
  the seam is internal;
- the other root-writing steps (`assembleInstitutions`, `generatePower`): their choosers consult
  pins in a later car; this packet proves the mechanism on `generatePopulation`;
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
| New/changed effective production lines | ≤100 | ≤400 |
| Delta in a shared/hot file | n/a — neither file is baselined or hot | ≤15 |
| Acceptance cases | 7 | ≤8 |

Overrides approved before dispatch: `NONE`.

⭐ **THE RE-CUT IS SMALLER THAN v1.** v1 split one registration into two; v2 moves a seam inside one
file and leaves the registration, its `deps`, `reads`, `readsVersion`, `provides` and `phase`
untouched. `steps/index.js` and the three steps that `deps: ['generatePopulation']` stay untouched
for the same reason, as do `npcGenerator.js`, `power/conflicts.js` and `power/factionGrouping.js`.

## §4 · Sealed dispatch and preflight

```sh
npm run implementation:dispatch -- EM-P0
```

⚠ **The v1 sealed session is CLEARED and its packet is STALE.** This is version 2; dispatch afresh.
Expected: capsule emitted; ancestry and substrate proven; the CREATE target absent; both MODIFY
targets clean; every §5 symbol resolving; foreign dirt fingerprinted without target overlap.

## §5 · Verified tree contract

| Role | File | Symbol | Verified fact | Required use |
|---|---|---|---|---|
| The runner | `src/generators/pipeline.js` | `export function runPipeline` | iterates `getStepOrder()` and calls `step.fn(ctx, stepRng)` for every step unconditionally; `options` already carries `onStep`, `strict`, `onStrictViolation` | Gains one option, `pins`, handed to steps through the CONTEXT |
| ⛔ The ambient binding | `src/generators/pipeline.js` | `const prevRng = setActiveRng(stepRng);` | binds the step's stream for the whole step body, which is how `generateRelationships`'s 62 draws reach it without naming it | Preserved exactly; the re-cut depends on it |
| ⛔⛔ The fork law | `src/kernel/prng.js` | `fork: (label) => createPRNG(\`${seed}::${label}\`)` | a fork is `createPRNG` over a derived seed — **a fresh stream at position 0, never a continuation**. Its own header records that changing this derivation is owner-gated under THE PROMISE | **NEVER EDITED.** It is why the seam is internal |
| The ambient helpers | `src/kernel/rngContext.js` | `export function setActiveRng` · `export function random` · `export function pick` | the ambient draw surface bound per step | Unchanged |
| ⛔ The drawing reader | `src/generators/npcGenerator.js` | `import { random as _rng, pick as ctxPick } from '../kernel/rngContext.js';` | **the proof that the deriving half draws**: `generateRelationships` reaches the step's stream through these | **NOT EDITED** — the seam is in the step, not the generator |
| The step | `src/generators/steps/generatePopulation.js` | `registerStep('generatePopulation', {` | `deps: ['coherenceRepairPass','powerEconomyReconcilePass']` · `reads: ['culture','economicState','effectiveConfig','generationContext','institutions','powerStructure','tier']` · `readsVersion: { economicState: 'reconciled' }` · `provides: ['npcs','relationships','factions','conflicts']` · `phase: 'population'` · fn `(ctx, rng)` | **ALL SIX DECLARATIONS UNCHANGED.** One registration, one stream |
| The direct draw | `src/generators/steps/generatePopulation.js` | `const roll = rng.random() * totalPower;` | the power-weighted scatter draws on the step's own handle | Inside the derive half; consults pins in pinned mode |
| Chooser 1 (root) | `src/generators/npcGenerator.js` | `export const generateNPCs = (` | draws the roster; takes no roster | Pinned by `npcs` |
| Chooser 2 | `src/generators/npcGenerator.js` | `export const generateRelationships = (npcs, config = {}, institutions = []) => {` | takes the roster **and draws 62 times** | Pinned by `relationships` |
| Chooser 3 | `src/generators/power/factionGrouping.js` | `export const generateFactions = (npcs, relationships) => {` | takes both **and draws twice** | Pinned by `factions` |
| Chooser 4 | `src/generators/power/conflicts.js` | `export const generateConflicts = (factions, relationships, config = {}, institutions = []) => {` | draws three times | Pinned by `conflicts` |
| The order | `src/generators/pipeline.js` | `export function getStepOrder` | a topological walk over `deps` | Unchanged — no step is added |
| Golden authority | `tests/property/generatorGoldenMaster.test.js` | `function hashFor(config)` | `sha256(JSON.stringify(generateSettlementPipeline(cfg, null, { seed, customContent: {} })))` over 525 rows | UNCHANGED; the standing proof, run PLAIN |
| Prose golden | `tests/property/dossierProseManifest.test.js` | `const MANIFEST_REL` | `'tests/fixtures/dossier-prose-manifest-golden.json'` | UNCHANGED |
| Test precedent | `tests/domain/settlementMigrations.test.js` | `describe('Tier 1.4 — migrateSettlementToLatest behavior')` › `it('is idempotent on an already-current settlement')`, `it('does not mutate the input')` | flat literal registration | Copy this shape |

**Forbidden alternatives**

- ⛔ **no second `registerStep`, no second `fork`, no second stream object** — V1 and V2 both moved
  41 of 41 sampled golden rows;
- ⛔ no edit to `src/kernel/prng.js` or its fork derivation (owner-gated under THE PROMISE);
- no edit to `npcGenerator.js`, `power/conflicts.js`, `power/factionGrouping.js`,
  `kernel/rngContext.js`, `steps/index.js`, or any step that `deps` on `generatePopulation`;
- no re-introduction of the retired `getAffectedSteps`/`rerunAffected` step-name model;
- no whole-step skip (retired, §0R.3);
- no file outside the §7 manifest.

## §6 · Exact contracts

### Inputs and outputs

```js
/**
 * @typedef {Record<string, unknown>} Pins
 *   Keyed by the RECORD PATH a chooser writes — `npcs`, `relationships`, `factions`,
 *   `conflicts`, and later `institutions`, `powerStructure`. ⭐ EM-P0 DEFINES THIS SPELLING and
 *   EM-P2 registers its rows' `outputKey` against it (§0R.4). Never a step NAME (the retired
 *   engine's defect) and never an entity id (EM-P1's).
 */

/**
 * @param {Object} initialContext
 * @param {Object} rng
 * @param {Object} [options]
 * @param {Pins}   [options.pins]  ABSENT or `{}` ⇒ today's behaviour EXACTLY.
 * @returns {Object} the accumulated context
 */
export function runPipeline(initialContext, rng, options = {});
```

**The runner's rule, complete and without discretion.**

1. `options.pins` absent or `null` ⇒ behave exactly as today. A non-object throws
   `Pipeline pins: options.pins must be a plain object`.
2. Otherwise `ctx` is seeded `{ ...initialContext, ...pins }` **and the pins are handed to every
   step through the context** under the reserved key `__pins` — so `step.fn(ctx, rng)`'s signature
   is UNCHANGED and no step is re-registered. `__pins` is stripped from the returned context.
3. ⛔ **Every step still RUNS.** There is no skip: a step must advance its own stream for the steps
   that follow, and a skipped step cannot.
4. Strict mode is unchanged. `__pins` is exempt from the undeclared-write scan by name, stated here
   so the exemption is a rule rather than an accident.

**The step's rule, complete.** `generatePopulation` keeps ONE registration and ONE stream object,
and its body becomes two functions in the same file — `drawPopulation(ctx, rng, pins)` (the root
draw) and `derivePopulation(ctx, rng, pins, npcs)` — with **the same `rng` object passed to both**.
Each of the four choosers is wrapped by one helper:

```js
/** Consult the pins for one chooser. ⛔ It does NOT advance the stream when a pin is present:
 *  in pinned mode nothing draws where the record holds the output, which is what makes a pinned
 *  re-derive reproduce the record. */
function chooseOrPin(pins, key, draw) {
  if (pins && Object.prototype.hasOwnProperty.call(pins, key)) return pins[key];
  return draw();
}
```

5. ⛔ **PARTIAL PINNING IS AN ERROR.** In pinned mode (`pins` present and non-empty), a step whose
   chooser set is only partially pinned throws
   `Pipeline pins: step "<name>" has choosers [<all>] but pins supply only [<subset>] — pin every
   chooser of a step or none of them.` Under `onStrictViolation` it reports
   `{ step, kind: 'pin', keys }` instead, matching the existing shape.
   ⚠ **A DM's root edit is NOT a partial pin**: EM-B2a builds a pin for EVERY chooser from the
   record and then overrides a value. A root edit changes a pin's VALUE; it never removes one.
6. A chooser the record lacks (`pins` has no such key while other choosers of that step do) is the
   rule-5 error. A chooser in a step with NO pins at all draws normally.

### State schema

`pins` is transient. Nothing is persisted; no settlement key is added or removed.

**Absence rules** — absent/`{}`: today's behaviour and the goldens' path. `null`: read as absent.
A key naming nothing any chooser writes: seeded into `ctx` and otherwise ignored (the runner
already accepts arbitrary initial-context values).

### Transition table

| Prior state | Input/event | Guard | Next state | Receipt |
|---|---|---|---|---|
| any | `runPipeline(ctx, rng, {})` | — | identical to `runPipeline(ctx, rng)` byte for byte | — |
| pinned | a chooser's key is present | — | the pin's value is taken; **no draw** | `onStep` still fires for the step |
| pinned | a chooser's key is absent while a sibling's is present | — | **throws** (or `onStrictViolation`) | rule 5's message |
| unpinned | any chooser | — | draws on the step's stream, in today's order | — |

### Ordering and precedence

- **Pipeline position:** unchanged — `getStepOrder()` is not re-sorted and no `deps` are rewritten.
- **Within the step:** `drawPopulation` then `derivePopulation`, exactly today's order, on the same
  stream object.
- **Merge/replace:** `ctx` accumulates as today via `Object.assign(ctx, patch)`.

### Determinism

- **Hash/fork key:** ⛔ **NONE MINTED.** No `fork` is added anywhere — that is the whole re-cut.
- **Stable enumeration:** `getStepOrder()`'s existing order.
- **No-draw behaviour:** no `pins` ⇒ not one draw moves, by construction (same registration, same
  stream, same call order). This is A1 and the goldens.
- ⚠ **A pinned run's stream position differs from a fresh run's**, because pinned choosers do not
  draw. That is by design (§0R.3) and A3 asserts it rather than leaving it implicit.

### Flag and dormancy

- **Flag:** `NONE`. The mode is dormant by absence; no caller passes `pins` until EM-B2a.
- **Golden posture:** **UNCHANGED**, and now by CONSTRUCTION rather than by argument.
  ⛔ `UPDATE_GOLDEN=1 npx vitest run tests/property/generatorGoldenMaster.test.js` is **FORBIDDEN**;
  any motion of either fixture is a STOP. ⚠ Version 1's design moved **41 of 41** sampled rows —
  this is the exact failure the re-cut exists to prevent, and A1 is where it would show.

### Lifecycle

| Create | Read | Persist | Reload | Regenerate | Undo | Import/migrate | Public veil |
|---|---|---|---|---|---|---|---|
| `pins` is created per call by a caller; none exists until EM-B2a | read once at the runner, then by each chooser | nothing persisted | n/a | **this packet is the regeneration seam**; today's callers pass no pins and are unaffected | n/a | n/a | n/a — no projection, no surface, no receipt string |

### Receipts and privacy

- **Closed kinds:** the strict-violation `kind` vocabulary gains exactly one member, `'pin'`.
- **Address chain:** `{ step: <name>, kind: 'pin', keys: [<record paths>] }`.
- **Numeric-to-word bands / DM-only fields / player projection:** `NONE`.

### Alignment and edit story

- **Alignment:** `DECLARED EMPTY`. **Edit story:** `ENGINE-ONLY` — a runner option with no DM verb.

## §7 · Exact change manifest

| Action | File | Symbol/region | Maximum delta | Coding instruction |
|---|---|---|---:|---|
| `MODIFY` | `src/generators/pipeline.js` | `runPipeline` (the `pins` option, the context hand-off, the partial-pin refusal) **and its docblock** | +45 eff | Implement §6's rules 1–4. ⛔ No skip, no fork, no step-name keying. ⭐ **In the same edit, correct the docblock's reference to `settlementSlice.applyChange`, which does not exist** — name the real caller or drop the clause, at **+0 effective lines** (it is a comment). Measured 113 effective; ceiling 800; no baseline entry. |
| `MODIFY` | `src/generators/steps/generatePopulation.js` | the step body → `drawPopulation` + `derivePopulation` + `chooseOrPin`, all in this file | +40 eff | Split INTERNALLY per §6. ⛔ **ONE `registerStep`, ONE stream object, passed to both halves. No second registration and no `fork` anywhere.** Leave `deps`, `reads`, `readsVersion`, `provides` and `phase` exactly as they are. Wrap all four choosers — `generateNPCs`, `generateRelationships`, `generateFactions`, `generateConflicts` — including the `rng.random()` scatter. Measured 142 effective. |
| `CREATE` | `tests/generators/pipelinePinnedMode.test.js` | A1–A7 | n/a | Copy `tests/domain/settlementMigrations.test.js`'s shape. Flat literal `it(...)` only — no `.each`, loops, conditionals or nested describes (`EM-PREAMBLE.md` §P3.4). |
| `REGISTER` | `scripts/mutation-coverage-manifest.json` | the `invariants` row for `tests/generators/pipelinePinnedMode.test.js` | +4 eff | `tests/generators` is one of the eight `ENFORCER_DIRS`, so the row is owed. Add it SURGICALLY beside its siblings; ⛔ never re-serialise the manifest whole. |

**Generated artifacts:** `tests/lint/.lighting-census-baseline.json`, regenerated:

```sh
LIGHTING_CENSUS_REFREEZE='EM-P0' LIGHTING_CENSUS_NOTE='EM-P0: one new test file (the pinned-mode battery)' \
  npx vitest run tests/lint/sovereigntyLightingContract.walker.test.js
```

**Predicted INTERIOR RED:** `2645 / 383 / 2262 / 25009 / 6670` → **`2646 / 383 / 2263 / … / …`** —
`+1 file, +0 parked, +1 credited`, caused by the ONE new TEST file (the walker walks `tests/` only —
`EM-B2a.evidence.md` §E7a; ⚠ `EM-PREAMBLE.md` §P2.1 attributes this to `src/domain/**` and is wrong).

**Registers that do NOT move:** `scripts/check-writer-reach.mjs`,
`scripts/check-observed-shape-readers.mjs`, `scripts/.size-baseline.json` (neither file has an entry),
`tests/lint/proseNumerics.test.js`, the five edge-shared bundles.

No other file may be edited.

## §8 · Ordered coding sequence

0. Dispatch and seal (afresh — the v1 session is cleared); stop on any preflight mismatch.
1. Capture the baseline: both golden fixtures' SHA-256; the lighting tuple; eslint `Linter`
   `max-lines` for both MODIFY targets (expect **113** and **142**).
2. Add the failing tests for A1–A7.
3. Split `generatePopulation` INTERNALLY — two functions, one stream object, one registration — and
   run the goldens PLAIN. ⭐ **This step must be green before any runner work begins**: it is the
   half v1 got wrong, and proving it in isolation is what makes the rest cheap.
4. Implement the runner's `pins` option and the context hand-off, and correct the docblock.
5. Wrap the four choosers with `chooseOrPin`.
6. Add the mutation-coverage row; regenerate the lighting baseline; re-run the walker plainly.
7. Run the focused verification of §10.
8. ⚠ This car RIDES ALONE: its own bare full gate and boot smoke are its terminal. Write §12.

**Bounded algorithm — the runner**

```text
1. If options.pins is absent or null, run exactly as today.
2. If options.pins is not a plain object, throw the §6 message.
3. ctx = { ...initialContext, ...pins, __pins: pins }.
4. For each step name in getStepOrder():
   a. stepRng = rng.fork(name)      — unchanged, every step, always.
   b. Run the step. There is no skip.
5. Delete __pins from the returned context.
```

**Bounded algorithm — the step**

```text
1. pins = ctx.__pins || null.
2. If pins is non-empty and SOME but not ALL of this step's four chooser keys are present,
   throw the rule-5 message (or report {step, kind:'pin', keys}).
3. npcs          = chooseOrPin(pins, 'npcs',          () => drawPopulation(ctx, rng));
4. relationships = chooseOrPin(pins, 'relationships', () => generateRelationships(npcs, …));
5. factions      = chooseOrPin(pins, 'factions',      () => generateFactions(npcs, relationships));
6. conflicts     = chooseOrPin(pins, 'conflicts',     () => generateConflicts(factions, …));
7. Return { npcs, relationships, factions, conflicts }.
   The SAME rng object reaches every draw; no fork is taken anywhere in this file.
```

## §9 · Acceptance matrix

| ID | Case | Fixture/input | Required observation | Test home |
|---|---|---|---|---|
| A1 | ⛔ Main behavior — THE NULL CHANGE | the golden corpus, with no `pins` and with `pins: {}` | output **byte-identical** to `tests/fixtures/generator-golden-master.json` across all 525 rows, and the prose manifest unmoved. ⚠ **Version 1 moved 41 of 41 sampled rows here** — this arm is where that failure appears | `tests/generators/pipelinePinnedMode.test.js` |
| A2 | The pin reproduces the record | generate a settlement, pass its `npcs`, `relationships`, `factions`, `conflicts` back as pins at the same seed | the resulting settlement is **byte-for-byte** the first one, and no chooser drew | same |
| A3 | ⛔ Counterforce — A PINNED CHOOSER DOES NOT DRAW | a counting wrapper over the step's stream, run pinned and unpinned | unpinned takes the full 67 derive-half draws (62 + 2 + 3) plus the root's; fully pinned takes **zero** in the derive half. The two stream positions differ, which §6 states is by design | same |
| A4 | ⛔ Boundary — THE PARTIAL PIN REFUSES | `pins` holding `relationships` but not `factions` or `conflicts` | throws with the exact rule-5 message naming the step, its four chooser keys and the supplied subset; under `onStrictViolation` reports `{ step, kind: 'pin', keys }` and does not throw | same |
| A5 | ⛔ Determinism — ONE STREAM, ONE STEP | the step's `rng` handle captured in both halves | **the same object identity (`===`) in `drawPopulation` and `derivePopulation`**, and `getStepOrder()` still contains exactly one `'generatePopulation'` and no `'drawPopulation'`. This replaces v1's fork-spelling arm: there is no fork left to spell wrong | same |
| A6 | Idempotency | the same pinned call three times | byte-identical each time; `pins` and `initialContext` unmutated; `__pins` absent from the returned context | same |
| A7 | ⛔ Regression — NO SECOND STREAM ANYWHERE | a source scan of `src/generators/steps/generatePopulation.js` | it contains exactly ONE `registerStep(` and **ZERO** `fork(` calls. Control: `src/kernel/prng.js`'s `fork: (label) => createPRNG(...)` is byte-identical to the base, so the owner-gated derivation is untouched | same |

**7 of 8.** One case deliberately unused.

## §10 · Verification commands

```sh
npx eslint src/generators/pipeline.js src/generators/steps/generatePopulation.js \
  tests/generators/pipelinePinnedMode.test.js
npm run typecheck:ratchet
npm run typecheck:domain:strict

# STEP 3'S PROOF — the goldens PLAIN, after the internal split and before the runner work
GATE_MUTEX_TIER=shared GATE_MUTEX_MAX_POLLS=100000 GATE_MUTEX_POLL_SECONDS=20 \
  sh scripts/gate-mutex.sh --run -- npx vitest run --pool=threads --maxWorkers=2 \
  tests/property/generatorGoldenMaster.test.js tests/property/dossierProseManifest.test.js

GATE_MUTEX_TIER=shared GATE_MUTEX_MAX_POLLS=100000 GATE_MUTEX_POLL_SECONDS=20 \
  sh scripts/gate-mutex.sh --run -- npx vitest run --pool=threads --maxWorkers=2 \
  tests/generators/pipelinePinnedMode.test.js tests/generators/assemblyCoherenceRngIsolation.test.js

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
`EM-PREAMBLE.md` §P7 / HZ-GATE-POLL. ⚠ This car rides ALONE, so its own bare full gate and a
separate boot smoke ARE its terminal and must both exit zero with the status captured in-shell.

## §11 · Mandatory STOP conditions

In addition to `PACKET_STANDARD.md` and `EM-PREAMBLE.md` §P8, stop if:

- either golden fixture's SHA-256 moves by one byte — **that is the whole failure mode, and version
  1 hit it at 41 of 41 sampled rows**;
- a second `registerStep`, a second stream object, or ANY `fork(` appears necessary in
  `generatePopulation.js`;
- `src/kernel/prng.js` must be edited (owner-gated under THE PROMISE);
- a third existing logic-bearing production file must move;
- `npcGenerator.js`, `power/conflicts.js`, `power/factionGrouping.js`, `kernel/rngContext.js`,
  `steps/index.js` or any step that `deps` on `generatePopulation` must be edited;
- the step's `deps`, `reads`, `readsVersion`, `provides` or `phase` must change;
- a partial pin must be tolerated rather than refused;
- a whole-step skip appears necessary (retired — a skipped step cannot advance its stream);
- the lighting census moves by anything other than `+1 file / +0 parked / +1 credited`.

## §12 · Completion receipt

- Base SHA, and the J-T1 window re-proved:
- Dispatch bundle and seal identity (version 2; the v1 seal is cleared):
- Final commit or working-tree state:
- Exact changed files and effective-line deltas (eslint `Linter`, before and after; expect 113 and 142 before):
- ⭐ **Step 3's isolated proof: both goldens green PLAIN after the internal split, before any runner work:**
- Acceptance cases A1–A7, executed and passed:
- The derive-half draw counts, re-measured unpinned and fully pinned (expect 67 and 0):
- Focused commands, exits, and counts:
- Sealed per-step receipt and exact-state resume status:
- Both typecheck configurations:
- ⚠ This car's OWN bare full gate and boot smoke, exits captured in-shell:
- Base-versus-wave failure identity diff:
- Dormancy/golden result — both fixtures' SHA-256 before and after:
- `src/kernel/prng.js` unchanged, confirmed by object id:
- Lighting census tuple before and after, attributed per file by execution:
- Generated artifacts: `NONE | tests/lint/.lighting-census-baseline.json`
- Deviations: `NONE | STOP`
- Out-of-scope observations, without investigation:
- Judgment calls: `NONE`
