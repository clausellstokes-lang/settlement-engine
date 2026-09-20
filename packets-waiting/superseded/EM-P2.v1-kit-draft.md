# Settlement editor / EM-P2 — GENERATION'S CHOOSERS REGISTERED: a sibling registry keyed `{forkId, module, symbol, outputKey}`, because the existing one's law, its idiom signatures, its disposition axis and its row shape are all the simulation's

- **Status:** DRAFT
- **Packet version:** 1
- **Verified base:** `fixes-2026-09-18-consist` at `d31af2ceebf643818201b2e2ab4a556765d2fc7c`
- **Last revalidated:** 2026-09-19 11:4x EDT at `d31af2cee`; Wave 0 read at `1d2da8c95`. J-T1 window proved in `EM-B2.evidence.md` §E0/§E12/§E14
- **Depends on:** `EM-P0` (its split registers `drawPopulation`, which the registry must carry a row for; compiling P2 first would bank a row for a step that does not yet exist)
- **Collision group:** `NONE` — it edits no file any other EM packet names. ⚠ It READS `src/generators/pipeline.js` and `steps/generatePopulation.js` (EM-P0's paths) but modifies neither
- **Commit authority:** edits only; the chair commits
- **Baseline posture:** measured — `src/domain/worldPulse/habitForkRegistry.js` **296** effective lines (eslint `Linter`, `skipBlankLines` + `skipComments`) against the 800 layer ceiling, no `scripts/.size-baseline.json` entry, **43** rows across **32** distinct modules, **0** of them naming `src/generators`; the entropy census pins **23** read sites / **23** distinct ids / **22** measured read expressions; `src/generators` holds **6** `createPRNG(`, **13** `pickRandom(`, **14** `rng.fork(` and **74** `rng(` sites across **19** files
- **Preamble:** docs/implementation/preambles/EM-PREAMBLE.md (SHA-256: TO BE STAMPED BY THE CHAIR)
- **Evidence:** `EM-P2.evidence.md`

---

## §0 · THE MEASURED ANSWER TO THE CHAIR'S QUESTION — SIBLING, NOT WIDENING

The chair asked which: widen `HABIT_FORK_REGISTRY` and its walker's four roots, or mint a sibling.
**The tree answers sibling, on three measurements** (evidence §P2-E1):

1. **Both stated laws are `src/domain`-scoped.** `habitForkRegistry.js:5` — *"Every weighted
   decision fork in `src/domain` is classified here"* — and `chooserTotality.walker.test.js:5` —
   *"every weighted decision fork in `src/domain` is classified in the habit fork"*. Widening the
   roots makes two written laws false at once.
2. **The three idiom signatures are the simulation's and match nothing in generation.**
   `SOFTMAX_SAMPLE` (`softmaxWeights`/`stableSampleByWeight`), `KEYED_RACE` (`hash01`) and
   `SCORE_EXTREMUM` (a score-sorted `[0]`). Generation draws through `rng.fork(` (14 sites),
   `pickRandom(` (13) and `createPRNG(` (6). Pointed at `src/generators` the scan finds **zero**,
   so every generation row lands as `discovery: 'checklist'` — the half the registry's own header
   calls hand-maintained and blind. Widening would grow the blind half by dozens of rows while the
   scanned half stayed empty, which inverts the instrument's purpose.
3. **Its disposition vocabulary is about LEARNING.** `LEARN | STAY | DEFER | DEAD_CODE` asks
   whether a simulation fork should adapt over time. A generation chooser draws once from a seed
   and never adapts; its meaningful axis is the output KEY it writes, which is what EM-A1's
   declarations and EM-B2a's pins read. Two taxonomies in one register is a register that means
   two things.
4. ⭐ **ITS ROW SHAPE CARRIES NO `outputKey`** (ODQ §934.47 addendum 2). Measured, the existing row
   holds `actionVocabulary, arity, circumstanceClasses, closeOwed, closeSource, domain, forkId,
   reason, symbol` — and `outputKey` is absent. Adding it as an optional field would leave 43
   simulation rows carrying an empty optional forever while every generation row carries the only
   field EM-A1 joins on. **A field meaningful for one half of a register is a register that means
   two things**, which is reason 3 again in a different place.

⭐ **The sibling KEEPS the shared vocabulary** — `forkId`, `module`, `symbol`, `reason` are spelled
exactly as `HABIT_FORK_REGISTRY` spells them — so the two registers read alike and a lane that
knows one knows the other. Only what genuinely differs differs.

**Priced, as the chair asked:** widening would cost a change to `SCAN_ROOTS`, a fourth and fifth
idiom signature, a second disposition vocabulary, a rewrite of two header laws, and a re-derivation
of a 43-row totality assertion — against a sibling's one new data leaf and one new walker, with
both existing instruments untouched and both stated laws still true.

## §1 · Reconciled authority

1. **ODQ §934.47** — Wave 0; this is its third car (after EM-P0, beside EM-P1).
2. **`docs/DESIGN_EDIT_MODE_AND_DECREES.md` §14 final** — *"The estate registers every seeded
   chooser in its decision-fork classification registry, so the root set is that registry's rows
   for the editable card kinds — a measurement, never a judgment"*, and *"a chooser without a
   registry row is registered first or its field is dropped"*. **This packet is what makes EM-A1's
   declarations a measurement.**
3. `docs/implementation/charters/EDIT-MODE-TRAIN.md` Wave 0, row **EM-P2** (at `1d2da8c95`).
4. `PACKET_STANDARD.md` — "a seeded chooser or pool mint carries its decision-fork classification
   row"; `EM-PREAMBLE.md` §P2.5.
5. Live git state at `d31af2cee`.

**Resolved contradictions**

- The charter's row says the choosers *"join the decision-fork registry"*; the ARCH's prerequisites
  row says *"the registry rows (EM-P2)"*. Measured, the existing registry cannot carry them without
  falsifying its own law (§0) — so they join a SIBLING registry, and the chair's own alternative
  ("or a sibling registry for generation if the registry's charter ... cannot honestly widen") is
  taken with the measurement that earns it.

## §2 · Outcome

**Observable result:** every root-writing chooser in `src/generators` has a declared row naming the
context KEY it writes, and a walker refuses an unregistered one.

**Definition of done:** `GENERATION_FORK_REGISTRY` exists with a row per root chooser; its walker
asserts the declared set EQUALS the scanned set in both directions; the entropy census's four
figures are re-measured and re-recorded with their cause; both existing instruments are untouched
and both green.

**In scope**

1. the sibling registry (the one data leaf);
2. its walker (the one guard);
3. the entropy census's four figures re-recorded.

**Explicit non-goals**

- ⛔ **no behaviour whatsoever** — not one draw moves, no chooser is minted, renamed or re-keyed;
- widening `HABIT_FORK_REGISTRY`, its walker, its `SCAN_ROOTS`, its idiom signatures or its
  disposition vocabulary — §0 is why;
- EM-A1's declarations, which READ this registry — a later packet;
- stable ids (EM-P1) and the pinned mode (EM-P0);
- Record adjacent discoveries in the receipt; do not investigate or repair them.

## §3 · Hard scope budget

| Limit | Packet budget | Standard |
|---|---:|---:|
| Behavior families | 1 | 1 |
| New persisted record families | 0 | ≤1 |
| Named state writers | 0 | ≤1 |
| Feature flags | 0 | ≤1 |
| User-facing surfaces | 0 | ≤1 |
| Direct consumers | 0 (EM-A1 and EM-B2a read it later) | ≤2 |
| New logic-bearing production leaves | 1 (a frozen data leaf with its totality helpers) | ≤2 |
| Existing logic-bearing production files modified | **0** | ≤3 |
| Additional registration-only files | 1 (`scripts/mutation-coverage-manifest.json`) | ≤3 |
| Handwritten files total | 4 | ≤12 |
| New/changed effective production lines | ≤200 | ≤400 |
| Effective lines per new leaf | ≤200 | ≤250 |
| Delta in a shared/hot file | 0 | ≤15 |
| Acceptance cases | 6 | ≤8 |

Overrides approved before dispatch: `NONE`.

## §4 · Sealed dispatch and preflight

```sh
npm run implementation:dispatch -- EM-P2
```

Expected: capsule emitted; ancestry proven; CREATE targets absent; every §5 symbol resolving.
⚠ **EM-P0 must be LANDED first** — its split registers `drawPopulation`, and a registry compiled
before it would bank a row for a step that does not exist (and its walker's both-directions
equality would red the moment P0 landed).

## §5 · Verified tree contract

| Role | File | Symbol | Verified fact | Required use |
|---|---|---|---|---|
| The sibling's model | `src/domain/worldPulse/habitForkRegistry.js` | `export const HABIT_FORK_REGISTRY` | 43 rows over 32 distinct `src/domain/**` modules; **0** name `src/generators`; 296 effective lines | **Read as the shape to copy. NOT EDITED** |
| Its walker | `tests/lint/chooserTotality.walker.test.js` | `const SCAN_ROOTS` | `['src/domain/worldPulse','src/domain/spatial','src/domain/traditions','src/domain/region']`; three idiom signatures keyed on `softmaxWeights`/`stableSampleByWeight`, `hash01`, a score-sorted `[0]` | **Read as the arm shape to copy. NOT EDITED** — §0 |
| Root-writing step 1 | `src/generators/steps/assembleInstitutions.js` | `provides: ['institutions', 'catalogForTier', 'generationRepairs']` | declares the institution roster | Its choosers get rows keyed on `institutions` |
| Root-writing step 2 | `src/generators/steps/generatePower.js` | `provides: ['powerIntent', 'powerStructure']` | declares the power seats | Rows keyed on those two |
| Root-writing step 3 | `src/generators/steps/generatePopulation.js` | `registerStep('generatePopulation', {` | after EM-P0: `drawPopulation` provides `npcs`; `generatePopulation` provides `relationships`, `factions`, `conflicts` | Rows for the ROOT keys only |
| The fork discipline | `src/generators/density/densityRoll.js` | `const sizing = rng.fork('sizing');` | the file's own header (`:20`) records *"Every stage draws from its OWN keyed fork"* | The fork NAME is the de-facto chooser key the registry declares |
| The step fork | `src/generators/pipeline.js` | `const stepRng = rng.fork(name);` | every step's stream is forked by its name | The row key's outer scope. **NOT EDITED** |
| The census | `tests/lint/entropyRootCensus.walker.test.js` | `const READ_SITES` | pinned at 23 entries / 23 distinct ids / 22 measured read expressions; one `src/generators` row, `NC-1`, the mandatory control | Re-measure and re-record the four figures with the cause |
| Test precedent | `tests/lint/chooserTotality.walker.test.js` | its both-directions equality between the declared and scanned sets | a walker that asserts its own instrument before trusting it | Copy this proof shape |
| Registration law | `tests/lint/mutationCoverage.shared.mjs` | `export const ENFORCER_DIRS` | `tests/lint` is one, so a new walker owes a manifest row | The REGISTER row below |

**Forbidden alternatives**

- no edit to `HABIT_FORK_REGISTRY`, `chooserTotality.walker.test.js`, `SCAN_ROOTS` or the idiom
  signatures; no second disposition vocabulary inside the existing register;
- no edit to any `src/generators` file — this packet registers what is there and changes nothing;
- no new PRNG, no re-keyed fork, no renamed chooser;
- no file outside the §7 manifest.

## §6 · Exact contracts

### Inputs and outputs

```js
/**
 * @typedef {{ forkId: string, module: string, symbol: string, outputKey: string,
 *             cardShape: 'npc'|'institution'|'faction'|'power'|'none',
 *             forkKey: string, discovery: 'idiom'|'checklist', reason: string }} GenerationForkRow
 *   `forkId`      a stable id, spelled as HABIT_FORK_REGISTRY spells its own.
 *   `module`      repository-relative, extensionless, and it must resolve to a real file.
 *   `symbol`      ⛔ RESOLVED AGAINST SOURCE, NEVER AGAINST EXPORTS. Several choosers are
 *                 module-local — `pickFirst` (`src/generators/npcGenerator.js:240`, the NPC name
 *                 draw) is declared `const pickFirst = (...)` and never exported. An
 *                 export-keyed resolver would miss it and every sibling like it, so the walker
 *                 resolves within the module's source, exactly as chooserTotality's own
 *                 `enclosingSymbol(code, index)` already does.
 *   `outputKey`   ⭐ THE RECORD PATH the chooser writes — `npcs[].role`,
 *                 `institutions[].category`, `powerStructure.seats[].holder`. EM-A1 joins the
 *                 registry on `(cardShape, outputKey)`, so this is the join half, NOT a ctx
 *                 `provides` key. ⚠ It is an ASSERTION ABOUT THE RECORD and A4 checks it
 *                 resolves on a generated settlement — a typo would make a row that joins to
 *                 nothing and silently cost EM-A1 a field.
 *   `cardShape`   the other half of EM-A1's join. `'none'` ⇒ the chooser writes no card root.
 *   `forkKey`     the exact string passed to `rng.fork(...)`, or `''` when the chooser draws
 *                 on its step's own stream.
 *   `reason`      non-empty prose; a row with an empty reason is refused.
 */
export const GENERATION_FORK_REGISTRY;   // frozen array of GenerationForkRow
export const GENERATION_FORK_ROOTS;      // frozen: ['src/generators']
export const GENERATION_IDIOMS;          // frozen: the three scan signatures below
export function assertGenerationForkRegistry(rows = GENERATION_FORK_REGISTRY);  // throws on a bad row
```

**The three idiom signatures**, matched against generation's measured draw vocabulary rather than
the simulation's: `FORK` → `rng.fork(`, `PICK` → `pickRandom(`, `PRNG_MINT` → `createPRNG(`.

### State schema

A frozen module-level constant. **Nothing is persisted and no settlement key moves.**

**Absence rules** — absent row for a scanned chooser: the walker REDS (that is the point). Empty
`forkKey`: legal, means "draws on the step's own stream". Empty `reason`: REFUSED by
`assertGenerationForkRegistry`. `null` anywhere: refused. An unresolvable `module`: refused.

### Transition table

| Prior state | Input/event | Guard | Next state | Receipt |
|---|---|---|---|---|
| registry as declared | the walker runs | scanned set == declared set | green | — |
| a chooser lands unregistered | the walker runs | — | RED, naming module and symbol | the walker's message |
| a row names a chooser the scan cannot find | the walker runs | `discovery: 'idiom'` | RED as STALE | the walker's message |
| the same, with `discovery: 'checklist'` | the walker runs | — | allowed, and counted in the declared blind-half total | the totality arm |

### Ordering, determinism, flag

- **Enumeration:** rows sorted ASCII-ascending on `module` then `symbol`; the walker compares SETS
  in both directions, never order.
- **Determinism:** the registry is data; the walker is a source scan. No PRNG, no clock, no locale.
- **Flag:** `NONE`. **Golden posture: UNCHANGED** — this packet executes no generator and changes
  no draw, so neither fixture can move. ⛔ `UPDATE_GOLDEN=1 …` is FORBIDDEN; motion is a STOP.

### Lifecycle

| Create | Read | Persist | Reload | Regenerate | Undo | Import/migrate | Public veil |
|---|---|---|---|---|---|---|---|
| a row is authored with its chooser | EM-A1's declarations and EM-B2a's pins read `outputKey` | nothing persisted | n/a | the registry is data; regeneration never touches it | n/a | n/a | n/a — no projection, no surface |

### Receipts, alignment, edit story

Closed kinds: the walker's failure vocabulary — `UNREGISTERED`, `STALE_ROW`, `BAD_ROW`.
DM-only fields: `NONE`. Alignment: `DECLARED EMPTY`. Edit story: `ENGINE-ONLY`.

## §7 · Exact change manifest

| Action | File | Symbol/region | Maximum delta | Coding instruction |
|---|---|---|---:|---|
| `CREATE` | `src/domain/generation/generationForkRegistry.js` | `GENERATION_FORK_REGISTRY`, `GENERATION_FORK_ROOTS`, `GENERATION_IDIOMS`, `assertGenerationForkRegistry` | 220 eff | One frozen data leaf at §6's contract — rows `{forkId, module, symbol, outputKey, cardShape, forkKey, discovery, reason}` — one per root chooser of the three root-writing steps plus the 14 `rng.fork(` sub-choosers and the module-local name choosers. Spell `forkId`/`module`/`symbol`/`reason` exactly as `habitForkRegistry.js` spells them; do NOT import it. Zero imports from `src/components`; strict-typecheck clean. |
| `CREATE` | `tests/lint/generationForkRegistry.walker.test.js` | A1–A6 | n/a | Copy `chooserTotality.walker.test.js`'s both-directions equality and its self-proving arm (drive the auditor with synthetic broken registries before trusting the live one). Flat literal `it(...)` only (`EM-PREAMBLE.md` §P3.4). |
| `TEST` | `tests/lint/entropyRootCensus.walker.test.js` | the four pinned figures and the `NC-1` row's neighbourhood | n/a | Re-measure and re-record `READ_SITES` length, the distinct-id count and the measured-read-expression count, with the cause stated beside them. ⛔ Re-measure by execution; never hand-compose a figure. Already-credited file — no new lighting-census file row from this row. |
| `REGISTER` | `scripts/mutation-coverage-manifest.json` | the `invariants` row for `tests/lint/generationForkRegistry.walker.test.js` | +4 eff | `tests/lint` is an `ENFORCER_DIR`, so the row is owed (`PACKET_STANDARD.md`). Add it SURGICALLY; ⛔ never re-serialise the manifest whole. |

**Generated artifacts:** `tests/lint/.lighting-census-baseline.json`, regenerated:

```sh
LIGHTING_CENSUS_REFREEZE='EM-P2' LIGHTING_CENSUS_NOTE='EM-P2: one new test file (the generation fork registry walker)' \
  npx vitest run tests/lint/sovereigntyLightingContract.walker.test.js
```

**Predicted INTERIOR RED:** `2645 / 383 / 2262 / 25009 / 6670` → **`2646 / 383 / 2263 / … / …`** —
`+1 file, +0 parked, +1 credited`, caused by the ONE new TEST file. ⚠ The new `src/domain/**` leaf
moves NOTHING in that tuple: `files` is `TEST_FILES.length` over `walk(join(ROOT,'tests'))`
(`EM-B2.evidence.md` §E7a; `EM-PREAMBLE.md` §P2.1 is wrong about this).

**Registers that do NOT move:** the golden fixtures (no generator is executed),
`scripts/check-writer-reach.mjs` (no new written identity, no customer surface),
`scripts/check-observed-shape-readers.mjs` (no new reader of a save-time key),
`scripts/.size-baseline.json`, the five edge-shared bundles, `tests/lint/proseNumerics.test.js`.

No other file may be edited.

## §8 · Ordered coding sequence

0. Dispatch and seal; stop on any preflight mismatch. ⚠ Refuse to start unless EM-P0 has LANDED.
1. Capture the baseline: the entropy census's four figures; the lighting tuple; both golden SHA-256s.
2. Add the failing walker for A1–A6.
3. Author the registry leaf, one row per scanned chooser.
4. (no writer or lifecycle seam — this packet has none.)
5. (no consumer to wire — EM-A1 reads it later.)
6. Add the mutation-coverage row; re-record the entropy census by execution; regenerate the
   lighting baseline; re-run both walkers plainly.
7. Run the focused verification of §10.
8. Run the wave-end gate and write §12.

## §9 · Acceptance matrix

| ID | Case | Fixture/input | Required observation | Test home |
|---|---|---|---|---|
| A1 | Main behavior | the live scan of `src/generators` under the three idiom signatures | the declared row set EQUALS the scanned set **in both directions** — an unregistered chooser reds, and a row naming a chooser the scan cannot find reds as STALE | `tests/lint/generationForkRegistry.walker.test.js` |
| A2 | Guard-the-guard, and the SOURCE resolution | five synthetic broken registries (missing `reason`, unresolvable `module`, duplicate `module#symbol`, unknown `cardShape`, malformed `outputKey`) each throw from `assertGenerationForkRegistry` with the offending row named; PLUS a live arm that the MODULE-LOCAL chooser `pickFirst` (`npcGenerator.js:240`, never exported) resolves — an export-keyed resolver reds here | same |
| A3 | ⛔ Counterforce — the existing instruments are untouched | `HABIT_FORK_REGISTRY` and `chooserTotality.walker.test.js` | both are byte-identical to the base, `SCAN_ROOTS` still holds exactly its four `src/domain` roots, and the chooser-totality walker is GREEN — the sibling took nothing from it | same |
| A4 | ⛔ Boundary — EVERY `outputKey` RESOLVES ON A REAL RECORD | each row's `outputKey` walked against a generated settlement | every path resolves (`npcs[].role`, `institutions[].category`, `powerStructure.seats[].holder`, …) and every one sits under a ROOT-WRITING step's output — none names a deriving step's product (`relationships`, `conflicts`, `economicState`, `history`). A typo'd path reds here rather than silently costing EM-A1 a field | same |
| A5 | Idempotency | the walker run twice on an unchanged tree | identical verdicts and identical row sets; the registry is data and the scan is pure | same |
| A6 | ⛔ Regression — THE CENSUS FIGURES ARE RE-MEASURED, NOT RE-TYPED | `tests/lint/entropyRootCensus.walker.test.js` | its four figures equal the executed measurement at this base, the `NC-1` control row still resolves, and the walker is GREEN | `tests/lint/entropyRootCensus.walker.test.js` |

**6 of 8.** Two cases deliberately unused (no persistence, no privacy surface).

## §10 · Verification commands

```sh
npx eslint src/domain/generation/generationForkRegistry.js \
  tests/lint/generationForkRegistry.walker.test.js
npm run typecheck:ratchet
npm run typecheck:domain:strict

GATE_MUTEX_TIER=shared GATE_MUTEX_MAX_POLLS=100000 GATE_MUTEX_POLL_SECONDS=20 \
  sh scripts/gate-mutex.sh --run -- npx vitest run --pool=threads --maxWorkers=2 \
  tests/lint/generationForkRegistry.walker.test.js tests/lint/chooserTotality.walker.test.js \
  tests/lint/entropyRootCensus.walker.test.js tests/lint/sovereigntyLightingContract.walker.test.js \
  tests/lint/mutationCoverageManifest.test.js

GATE_MUTEX_TIER=shared GATE_MUTEX_MAX_POLLS=100000 GATE_MUTEX_POLL_SECONDS=20 \
  sh scripts/gate-mutex.sh --run -- npx vitest run --pool=threads --maxWorkers=2 \
  tests/property/generatorGoldenMaster.test.js tests/property/dossierProseManifest.test.js

node scripts/check-observed-shape-readers.mjs
node scripts/implementation-packets.mjs validate
npm run check:packet -- EM-P2
npm run implementation:resume -- EM-P2
```

Every command exits `0`. A lane never runs `npm run check`; it pauses at a held gate per
`EM-PREAMBLE.md` §P7 / HZ-GATE-POLL.

## §11 · Mandatory STOP conditions

In addition to `PACKET_STANDARD.md` and `EM-PREAMBLE.md` §P8, stop if:

- `HABIT_FORK_REGISTRY`, `chooserTotality.walker.test.js` or `SCAN_ROOTS` must be edited;
- any `src/generators` file must be edited — **this packet changes no behaviour**;
- either golden fixture moves by one byte;
- a scanned chooser cannot be given a truthful `outputKey` that RESOLVES on a generated record
  (that is a real finding about the pipeline, and it belongs to EM-P0's family, not to a row here);
- `symbol` would have to resolve against exports rather than source (module-local choosers like
  `pickFirst` would vanish from the denominator);
- the entropy census's figures cannot be reproduced by execution;
- EM-P0 has not landed, so `drawPopulation` does not exist;
- the lighting census moves by anything other than `+1 file / +0 parked / +1 credited`.

## §12 · Completion receipt

- Base SHA:
- Dispatch bundle and seal identity:
- Final commit or working-tree state:
- Exact changed files and effective-line deltas:
- Acceptance cases A1–A6, executed and passed:
- Focused commands, exits, and counts:
- Sealed per-step receipt and exact-state resume status:
- Both typecheck configurations:
- Wave-end gate stages actually executed:
- Base-versus-wave failure identity diff:
- Dormancy/golden result — both fixtures' SHA-256 before and after (expected: unmoved):
- The entropy census's four figures before and after, each re-measured by execution:
- Row count of the new registry, and the scanned-set size it equals:
- Lighting census tuple before and after:
- Generated artifacts: `NONE | tests/lint/.lighting-census-baseline.json`
- Deviations: `NONE | STOP`
- Out-of-scope observations, without investigation:
- Judgment calls: `NONE`
