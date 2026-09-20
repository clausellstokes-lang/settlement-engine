# Settlement editor / EM-B2b — WORLD FACTS BY CONSEQUENCE: a `config′` change re-derives through the pins, and the delta card gains a field-level "the DM's fields" section reading `dmLayer.roots` and `dmLayer.worldFacts`

- **Status:** DRAFT
- **Packet version:** 1
- **Verified base:** `fixes-2026-09-18-consist` at `d31af2ceebf643818201b2e2ab4a556765d2fc7c`
- **Last revalidated:** 2026-09-19 11:5x EDT at `d31af2cee`. J-T1 window in `EM-B2a.evidence.md` §E0/§E12/§E14
- **Depends on:** `EM-B2a` (`pinsFrom` / `rederive`, which this packet extends with `config′`) and `EM-P3` (the world-fact option sets' one home — `config′` cannot be validated against a set that lives in three spellings). Behind those: `EM-P0`, `EM-P1`, `EM-P2`
- **Collision group:** `EM-B2a` (the same `dmLayer.js` leaf — they serialize, B2a first) · `EM-E3` (renders the section this packet derives) · `EM-B3` (`dmLayer.worldFacts` is one of the persisted key's sub-objects)
- **Commit authority:** edits only; the chair commits
- **Baseline posture:** measured — `src/domain/regenerationDelta.js` **103** effective lines (eslint `Linter`, `skipBlankLines` + `skipComments`) against the 800 layer ceiling, no `scripts/.size-baseline.json` entry, and in NONE of the five edge-shared closures; its envelope is **eleven** keys on both branches; `culture` is read by **145** files in `src/`, **21** of them in `src/generators` and **15** in `src/domain/display` + `src/pdf`
- **Preamble:** docs/implementation/preambles/EM-PREAMBLE.md (SHA-256: TO BE STAMPED BY THE CHAIR)
- **Evidence:** `EM-B2b.evidence.md`

---

## §0 · THE ONE SENTENCE

A DM who moves a settlement to the coast keeps its harbour master and its ship-wrights: the pins
hold every chosen fact, `config′` changes the world facts, and only the derivations move. Design
§14 final rules the resulting incoherence **consequence by design, never an error** — so this
packet's duty is to make the consequence LEGIBLE, in the delta, not to bound it.

⭐ **GATE 4, ANSWERED BY NAMING RATHER THAN BOUNDING.** The chair recorded my culture finding as
consequence-by-design and asked this packet to name every in-pipeline reader so the blast radius is
stated. It is, in §5 and in `EM-B2b.evidence.md` §B2b-E1: **21 files in `src/generators`**, led by
`npcGenerator.js` (21 reads) and `steps/resolveConfig.js` (18), with `resolveConfig` and
`buildGenerationContext` sitting at the head of the step graph — upstream of every chooser. A
culture change re-derives essentially the whole world, and that is the ruling working, not a defect.

## §1 · Reconciled authority

1. **ODQ §934.47** — the EM-B2 split; this is its second car. **§934.44–§934.46** — design §14
   final: world facts by consequence, one engine, re-derive with pins.
2. **`docs/DESIGN_EDIT_MODE_AND_DECREES.md` §14 final**, verbatim on the mechanism: `rederive`
   runs "with the layer's overrides applied (a root edit; a world-fact change in `config′`)", and
   `dmLayer` records "`roots` (by `<cardType>:<entityId>:<field>`) and `worldFacts` (by config key)".
3. **§12.12** — the delta card's "kept" is an entity diff, so a field-level section is NEW derivation.
4. Charter Wave 0 (EM-P3) and Wave 1 (EM-B2b); `PACKET_STANDARD.md`; `EM-PREAMBLE.md`.
5. Live git state at `d31af2cee`.

**Resolved contradictions** — none outstanding. The three that blocked the undivided EM-B2 became
Wave 0 packets (`EM-B2a.md` §0Y); this car inherits them as dependencies rather than as blocks.

## §2 · Outcome

**Observable result:** changing a world fact on a saved draft re-derives the settlement through the
pins — every chosen fact kept, every derivation recomputed — and the regeneration delta reports,
field by field, which values are the DM's and which world facts they followed from.

**Definition of done:** `rederive` accepts a `config′` and a `dmLayer.worldFacts`;
`deriveRegenerationDelta` returns a twelfth key `dmFields` reading both `dmLayer.roots` and
`dmLayer.worldFacts`; the eleven existing keys are untouched; both goldens are unmoved.

**In scope**

1. `config′` world-fact overrides through EM-B2a's `rederive` (one primary behaviour);
2. the delta's field-level DM section (the one required integration);
3. the consequence-by-design pin — a world-fact change moves derivations and no chosen fact.

**Explicit non-goals**

- ⛔ **bounding the blast radius of a world-fact change.** §14 final rules it consequence by design;
  this packet NAMES the readers and reports the consequence, and a lane that tries to constrain it
  is contradicting the owner's ruling;
- rendering the section — **EM-E3's**; wave 1 is headless;
- persisting `worldFacts` — **EM-B3's**;
- the option sets' canonical home — **EM-P3's**;
- canon, which does not re-derive at all (decrees at the tick, wave 3);
- Record adjacent discoveries in the receipt; do not investigate or repair them.

## §3 · Hard scope budget

| Limit | Packet budget | Standard |
|---|---:|---:|
| Behavior families | 1 | 1 |
| New persisted record families | 0 | ≤1 |
| Named state writers | 0 (extends EM-B2a's `applyEdit`) | ≤1 |
| Feature flags | 0 | ≤1 |
| User-facing surfaces | 0 (headless) | ≤1 |
| Direct consumers | 1 (EM-B2a's `rederive`) | ≤2 |
| New logic-bearing production leaves | 0 | ≤2 |
| Existing logic-bearing production files modified | **2** (`src/domain/edit/dmLayer.js`, `src/domain/regenerationDelta.js`) | ≤3 |
| Additional registration-only files | 1 | ≤3 |
| Handwritten files total | 5 | ≤12 |
| New/changed effective production lines | ≤150 | ≤400 |
| Delta in a shared/hot file | n/a — neither file is baselined or hot | ≤15 |
| Acceptance cases | 7 | ≤8 |

Overrides approved before dispatch: `NONE`.

## §4 · Sealed dispatch and preflight

```sh
npm run implementation:dispatch -- EM-B2b
```

Expected: capsule emitted; ancestry proven; MODIFY targets clean; every §5 symbol resolving.
⚠ `EM-B2a` and `EM-P3` must both be LANDED — this packet extends `rederive` and validates `config′`
against EM-P3's canonical option sets.

## §5 · Verified tree contract

| Role | File | Symbol | Verified fact | Required use |
|---|---|---|---|---|
| The engine | `src/domain/edit/dmLayer.js` | `rederive` (EM-B2a's) | runs the derivation steps against the record's pins with root overrides released | Extended with `config′` + `worldFacts`; no second engine |
| The delta | `src/domain/regenerationDelta.js` | `export function deriveRegenerationDelta` | returns ELEVEN keys — `directEffects, rippleEffects, capacityShifts, dailyLifeShifts, preservedCanon, brokenDependencies, newEntities, removedEntities, newOpportunities, newRisks, summary` — identically on the nullish branch and the real return | Gains exactly one key; the eleven and their order are preserved |
| The entity diff | `src/domain/regenerationDelta.js` | `export function regenerationDeltaSize` | sums the four effect layers plus added/removed entities | `dmFields` does NOT enter the size — a DM's own field is not a change the world made |
| Config resolution | `src/generators/steps/resolveConfig.js` | `registerStep('resolveConfig', {` | `deps: []` — the FIRST step of the graph; **18** `culture` reads | `config′` enters here, upstream of every chooser |
| Context build | `src/generators/steps/buildGenerationContext.js` | `registerStep('buildGenerationContext', {` | `deps: ['resolveConfig']` — the second step; **4** `culture` reads | The second place a world fact lands |
| ⭐ Culture reader, heaviest | `src/generators/npcGenerator.js` | `export const generateNPCs = (` | **21** `culture` reads; receives `culture` directly from `steps/generatePopulation.js:65` | **Named, not bounded** — §0 |
| Culture readers, in-pipeline | `src/generators/demandProfile.js` (11) · `narrativeGenerator.js` (9) · `generateSettlementPipeline.js` (8) · `economy/foodBalance.js` (8) · `generationContext.js` (7) · `steps/assembleSettlement.js` (6) · `foodGenerator.js` (6) · `steps/generatePopulation.js` (3) · `steps/economyReconcilePass.js` (3) · `aiLayer.js` (3) · `steps/stepMetadata.js` (2) · `institutionProbability.js` (2) · `generationCoherence.js` (2) · `npcStructure.js`, `npc/generatedNpcTitle.js`, `isolationGenerator.js`, `economy/prosperity.js`, `computeActiveChains.js` (1 each) | — | **21 files total in `src/generators`** | The stated blast radius. The packet's §9 A4 asserts this list is COMPLETE at its base |
| Culture readers, display | `src/pdf/sections/IdentityDailyLife.jsx` (18) · `src/pdf/lib/viewModel.js` (3) · `src/domain/display/tracePresentation.js` (3) · `src/domain/display/institutionVocabulary.js` (3) · `src/pdf/sections/EconomicsTrade.jsx` (2) · `src/pdf/lib/generationContracts.js` (2) · `src/domain/display/guidanceRegistry.js` (2) · `src/pdf/lib/viewModelBodySlices.js` (1) | — | **15 files** in `src/domain/display` + `src/pdf` | Named for the record; not edited |
| Renderer (later) | `src/components/primitives/RegenerationDeltaCard.jsx` | the delta card | renders the envelope | **NOT EDITED** — EM-E3's |
| Golden authority | `tests/property/generatorGoldenMaster.test.js` | `function hashFor(config)` | hashes the whole serialised settlement over 525 rows | UNCHANGED |
| Test precedent | `tests/domain/regenerationDelta.test.js` | `describe('deriveRegenerationDelta()')` › `it('returns canonical envelope shape')`, `it('does not mutate either snapshot')` | flat literal registration; whole-envelope and purity arms | Copy this shape |

**Forbidden alternatives**

- ⛔ no bounding, clamping, warning or refusal on a world-fact change — §14 final rules the
  consequence by design;
- no second engine, no second delta deriver, no second option-set home;
- no edit to any `src/generators` file, to `RegenerationDeltaCard.jsx`, or to any EM-B3 path;
- no file outside the §7 manifest.

## §6 · Exact contracts

### Inputs and outputs

```js
/** @typedef {Record<string, unknown>} WorldFactOverrides  keyed by CONFIG key (terrain, culture,
 *  tradeRouteAccess, resources, goods, services, stressors), valued from EM-P3's canonical option
 *  sets. A key EM-P3 does not know is REFUSED — `config′` is not a free-text door. */

/** dmLayer gains its second sub-object, per design §14 final:
 *  { roots: Record<string, unknown>, worldFacts: WorldFactOverrides,
 *    minted: Record<string, object>, phantoms: Record<string, object> } */

/** EM-B2a's engine, extended. PURE; the record is never mutated.
 * @param {object} record @param {object} config the save's stored config
 * @param {DmLayer} layer  `layer.worldFacts` is merged OVER `config` to form `config′`
 * @returns {object} the re-derived record
 *   config′ = { ...config, ...layer.worldFacts }. A worldFacts key whose value is not a member of
 *   EM-P3's option set for that key throws; it never silently falls back to the stored value.
 */
export function rederive(record, config, layer);
```

### The twelfth delta key

```js
/** Appended after `summary` on BOTH branches of deriveRegenerationDelta, leaving the eleven and
 *  their order untouched. Reads `after.dmLayer.roots` AND `after.dmLayer.worldFacts`.
 *  @type {{ roots: Array<{ key, cardShape, entityId, field, dmValue, engineValue }>,
 *           worldFacts: Array<{ configKey, dmValue, engineValue }> }}
 *  Both arrays ASCII-ascending on their first field. `{ roots: [], worldFacts: [] }` when the
 *  layer is absent or empty — so every existing caller sees an ADDED key and no changed one.
 *  `regenerationDeltaSize` does NOT count it. */
dmFields
```

### Absence rules

- **absent** `worldFacts`: no world fact is overridden; `config′ === config` by value.
- **empty** `{}`: identical to absent.
- **`null`**: read as absent; never written.
- **invalid** (a key EM-P3 does not know, or a value outside its option set): **throws**, naming the
  key and the accepted set. ⛔ Never a silent fallback — a fallback would make the DM's stated
  world quietly untrue, which is the one thing §14's "consequence by design" does not license.

### Transition table

| Prior state | Input/event | Guard | Next state | Receipt |
|---|---|---|---|---|
| a draft record | `rederive` with empty `worldFacts` | — | byte-identical to `rederive(record, config, {roots})` | `dmFields.worldFacts: []` |
| a draft record | `rederive` with `{ terrain: 'coastal' }` | the value is in EM-P3's set | every PINNED chosen fact is unchanged; every derivation recomputes | `dmFields.worldFacts` names the key with both values |
| any | a value outside the option set | — | **throws**, naming the key and the set | — |
| any | a key EM-P3 does not know | — | **throws** | — |
| canon | any | — | ⛔ does not re-derive at all — decrees at the tick (wave 3) | — |

### Ordering, determinism, flag

- **Precedence:** `worldFacts` merges OVER the stored config; pins hold every chosen fact; the
  layer's `roots` release the pins the DM overrode. Order: config → `config′` → pins → roots.
- **Determinism:** same record + same `config′` + same layer ⇒ the same record, byte for byte.
- **Flag:** `NONE`. **Golden posture: UNCHANGED** — fresh generation passes no layer and no
  `config′`. ⛔ `UPDATE_GOLDEN=1 …` is FORBIDDEN; motion is a STOP.

### Lifecycle

| Create | Read | Persist | Reload | Regenerate | Undo | Import/migrate | Public veil |
|---|---|---|---|---|---|---|---|
| a `worldFacts` entry is created by an op on a declared world fact | the delta's `dmFields` reads both sub-objects | ⛔ EM-B3's | ⛔ EM-B3's | **this packet** — `config′` re-derives through the pins | EM-C1's `withdraw` | ⛔ EM-B4 folds only ROOT paths and notes; a world fact is not an inline edit | ⛔ EM-B3 names both keys in `publicSafe` / `worldSnapshotPublic` |

### Receipts, alignment, edit story

Closed kinds: the throw vocabulary — `unknown_world_fact`, `value_not_in_option_set`.
Numeric-to-word bands: `NONE` (nothing rendered here; EM-E3 owes prose-numerics if it renders a
figure). DM-only fields: the whole layer. Alignment: `DECLARED EMPTY`. Edit story: the DM's verb is
EM-D2's world-fact control, reaching this leaf through EM-C4's slice and the one decree adapter.

## §7 · Exact change manifest

| Action | File | Symbol/region | Maximum delta | Coding instruction |
|---|---|---|---:|---|
| `MODIFY` | `src/domain/edit/dmLayer.js` | `rederive`, and `DmLayer` gaining `worldFacts` | +60 eff | Merge `layer.worldFacts` over `config` to form `config′`; validate every key and value against EM-P3's canonical sets and THROW on a miss. ⛔ No fallback, no clamp, no warning-and-continue. |
| `MODIFY` | `src/domain/regenerationDelta.js` | `deriveRegenerationDelta` (both branches) | +45 eff | Add `dmFields` exactly as §6 specifies, reading both sub-objects. Do not touch the eleven keys, their order, `regenerationDeltaSize` or `newEntitiesByType`. Measured 103 effective lines; ceiling 800; in no edge-shared closure. |
| `TEST` | `tests/domain/regenerationDelta.test.js` | one arm in `describe('deriveRegenerationDelta()')` | n/a | Assert the twelfth key on both branches and that the eleven are unmoved. Re-assert `it('returns canonical envelope shape')` against TWELVE keys. Already-credited file. |
| `CREATE` | `tests/domain/worldFactRederive.test.js` | A1–A7 | n/a | Copy `tests/domain/regenerationDelta.test.js`'s shape. Flat literal `it(...)` only (`EM-PREAMBLE.md` §P3.4). |
| `REGISTER` | `scripts/mutation-coverage-manifest.json` | ⚠ **only if `enumerateInvariants` picks the new file** | +4 eff | `tests/domain` is not an `ENFORCER_DIR` and `worldFactRederive` matches no `NAME_PATTERN` token, so measured, NO row is owed. Run the measurement; add nothing the meta-test does not demand. |

**Generated artifacts:** `tests/lint/.lighting-census-baseline.json` (`LIGHTING_CENSUS_REFREEZE='EM-B2b'`).
**Predicted INTERIOR RED:** `+1 file, +0 parked, +1 credited`, caused by the one new TEST file.
**Registers that do NOT move:** both goldens, `check-writer-reach.mjs`,
`check-observed-shape-readers.mjs` (the `dmLayer on settlement` row is EM-B2a's scheduled chair act
at the terminal), `.size-baseline.json`, the five edge-shared bundles, prose-numerics.

No other file may be edited.

## §8 · Ordered coding sequence

0. Dispatch and seal; stop on any preflight mismatch. Refuse to start unless `EM-B2a` and `EM-P3`
   have LANDED.
1. Capture the baseline: both golden fixtures' SHA-256; the lighting tuple; `regenerationDelta.js`
   at **103** effective.
2. Add the failing tests for A1–A7.
3. Extend `rederive` with `config′` and its validation (the pure contract).
4. Add `dmFields` to both branches of `deriveRegenerationDelta`.
5. (no consumer to wire — EM-E3 renders it later.)
6. Measure whether a mutation-coverage row is owed; regenerate the lighting baseline.
7. Run the focused verification of §10.
8. Run the wave-end gate and write §12.

## §9 · Acceptance matrix

| ID | Case | Fixture/input | Required observation | Test home |
|---|---|---|---|---|
| A1 | ⛔ Main behavior — THE HARBOUR MASTER KEEPS HIS JOB | a saved draft re-derived with `{ terrain: 'coastal' }` | **every pinned chosen fact is unchanged** — the same NPCs by id, the same institution roster, the same faction archetypes — while the derivations (economy, supply chains, defense scores, food security) recompute | `tests/domain/worldFactRederive.test.js` |
| A2 | Dormant/absent | `worldFacts` absent, and `{}` | the result is byte-identical to a roots-only `rederive`, and `dmFields.worldFacts` is `[]` | same |
| A3 | ⛔ Counterforce — NO SILENT FALLBACK | an unknown config key, and a known key with a value outside EM-P3's option set | each THROWS, naming the key and the accepted set; neither falls back to the stored value nor warns and continues | same |
| A4 | ⛔ Boundary — THE STATED BLAST RADIUS IS COMPLETE | a source scan for `culture` across `src/generators` | the reader set equals the **21** files §5 names, exactly, in both directions. A new reader reds here, so the blast radius stays STATED rather than quietly growing — which is what §14's consequence-by-design ruling requires of this packet | same |
| A5 | Idempotency | the same `config′` re-derive run three times | byte-identical each time; `record`, `config` and `layer` are not mutated | same |
| A6 | Real integration — THE DELTA READS BOTH | a layer holding one root override and one world fact | `dmFields.roots` names the root with both values and `dmFields.worldFacts` names the config key with both; both arrays ASCII-ascending; the eleven original keys are unmoved and `regenerationDeltaSize` is unchanged by their presence | `tests/domain/regenerationDelta.test.js` |
| A7 | ⛔ Regression — THE GOLDENS CANNOT SEE ANY OF IT | fresh generation, no layer and no `config′` | `tests/fixtures/generator-golden-master.json` and `tests/fixtures/dossier-prose-manifest-golden.json` byte-identical by SHA-256 | `tests/domain/worldFactRederive.test.js` |

**7 of 8.** One case deliberately unused.

## §10 · Verification commands

```sh
npx eslint src/domain/edit/dmLayer.js src/domain/regenerationDelta.js \
  tests/domain/worldFactRederive.test.js
npm run typecheck:ratchet
npm run typecheck:domain:strict

GATE_MUTEX_TIER=shared GATE_MUTEX_MAX_POLLS=100000 GATE_MUTEX_POLL_SECONDS=20 \
  sh scripts/gate-mutex.sh --run -- npx vitest run --pool=threads --maxWorkers=2 \
  tests/domain/worldFactRederive.test.js tests/domain/regenerationDelta.test.js \
  tests/domain/dmLayer.test.js

GATE_MUTEX_TIER=shared GATE_MUTEX_MAX_POLLS=100000 GATE_MUTEX_POLL_SECONDS=20 \
  sh scripts/gate-mutex.sh --run -- npx vitest run --pool=threads --maxWorkers=2 \
  tests/property/generatorGoldenMaster.test.js tests/property/dossierProseManifest.test.js \
  tests/property/dmLayerGoldenIsolation.test.js

GATE_MUTEX_TIER=shared GATE_MUTEX_MAX_POLLS=100000 GATE_MUTEX_POLL_SECONDS=20 \
  sh scripts/gate-mutex.sh --run -- npx vitest run --pool=threads --maxWorkers=2 \
  tests/lint/sovereigntyLightingContract.walker.test.js tests/lint/mutationCoverageManifest.test.js

node scripts/check-observed-shape-readers.mjs
node scripts/implementation-packets.mjs validate
npm run check:packet -- EM-B2b
```

Every command exits `0`. A lane never runs `npm run check`; it pauses at a held gate per
`EM-PREAMBLE.md` §P7 / HZ-GATE-POLL.

## §11 · Mandatory STOP conditions

In addition to `PACKET_STANDARD.md` and `EM-PREAMBLE.md` §P8, stop if:

- either golden fixture moves by one byte;
- a pinned chosen fact moves on a world-fact change (A1's inverse — that would mean the pins leaked);
- an invalid `config′` value must fall back, clamp or warn rather than throw;
- the culture reader set differs from the 21 files §5 names (a new reader is a real finding);
- any of the eleven delta keys changes name, order or value, or `regenerationDeltaSize` moves;
- a `src/generators` file, `RegenerationDeltaCard.jsx`, or any EM-B3 path must be edited;
- a bound, guard or warning on a world-fact change appears necessary — §14 rules it consequence by
  design, and a lane does not reopen that;
- `EM-B2a` or `EM-P3` has not landed.

## §12 · Completion receipt

- Base SHA:
- Dispatch bundle and seal identity:
- Final commit or working-tree state:
- Exact changed files and effective-line deltas (eslint `Linter`, before and after):
- Acceptance cases A1–A7, executed and passed:
- Focused commands, exits, and counts:
- Sealed per-step receipt and exact-state resume status:
- Both typecheck configurations:
- Wave-end gate stages actually executed:
- Base-versus-wave failure identity diff:
- Dormancy/golden result — both fixtures' SHA-256 before and after:
- The culture reader set, re-measured, against the 21 files named at compile:
- Lighting census tuple before and after:
- Generated artifacts:
- Deviations: `NONE | STOP`
- Out-of-scope observations, without investigation:
- Judgment calls: `NONE`
