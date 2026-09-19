# Edit Mode and the Decree Registry — the implementation architecture (2026-09-19)

Companion to `docs/DESIGN_EDIT_MODE_AND_DECREES.md` (the design and its addenda §2.5a, §2.7a, §10, §11). This document is the build contract: modules, types, schemas, interfaces, instruments, and the lane order with each lane's proof. Everything here is headless-first; the surfaces come last and read only what the domain declares.

## 1. Module map

| module | responsibility | exports |
|---|---|---|
| `src/domain/edit/fieldDeclarations.js` | the editable fields per card type (§2.1); the source every modal is generated from | `FIELD_DECLARATIONS`, `declarationsFor(cardType)`, `isEditableCard(cardType)` |
| `src/domain/edit/pools.js` | the catalogue of catalogues (§2.2): pool id → source | `POOLS`, `poolValues(poolId, world, seed)`, `rollFrom(poolId, world, seed, rollIndex)` |
| `src/domain/edit/operations.js` | the typed op catalogue (§2.3) | `OP_TYPES`, `makeOp(type, target, payload)`, `validateOp(op, world)` |
| `src/domain/edit/dmLayer.js` | the DM's layer over the seed (§2.4): compose, apply, namespace | `composeWorld(seedWorld, layer)`, `applyPlainEdit(layer, op)`, `DM_ID_NS`, `mintDmId(seed, kind, n)` |
| `src/domain/edit/registry.js` | pure operations on the decree registry (§2.5, §2.5a) | `stage(registry, op, meta)`, `reorder`, `withdraw`, `reopen`, `markApplied`, `revertTick(registry, tickRef)` |
| `src/domain/edit/guards.js` + `guardRules.js` | the guard engine and its rules (§2.7, §2.7a, §11) | `evaluateGuards(registry, world, opCatalogue)`, `GUARD_KINDS`, `GUARD_RULES` |
| `src/domain/edit/phantoms.js` | phantoms (§2.8) | `mintPhantom(seed, name, kind)`, `promotePhantom(phantom) → seed`, `isPhantomRef(ref)` |
| `src/domain/worldPulse/decreeHook.js` | the head-of-tick application (§2.6) and the rewind | `applyDecreesAtTick(worldState, registry, tickRef)`, `retractDecreesOfTick(...)` |
| `src/domain/display/stateProse/decreeProse.js` | the chronicle's sentences for decrees (§11) from authored pools | `decreeChronicleLine(entry, world)` |
| `src/store/editSlice.js` | edit mode, the registry and the layer in the store; persistence | `enterEditMode`, `leaveEditMode`, `stageDecree`, `applyPlainEdit`, `reorderDecree`, `withdrawDecree`, `reopenDecree`, selectors |
| `src/store/persistProjection.js` (existing) | partializes `dmLayer` and `decrees` with the save; never into the anonymous envelope | (existing surface) |
| `src/components/edit/EditModeShell.jsx` | the mode indicator, pencils and pluses (§3) | `EditModeShell`, `useEditMode()` |
| `src/components/edit/CardEditorDialog.jsx` | the generated modal (§3), on the §934.31 dialog primitive, in the forge's scheme | `CardEditorDialog` |
| `src/components/edit/DecreeRegistryPage.jsx` | the registry at the dossier's foot (§3) | `DecreeRegistryPage` |
| `src/components/surveyor/*` (existing) | proposals emitted as ops into the registry (§3, G) | (re-pointed) |
| `scripts/migrate-edit-registry.mjs` | the governed migration of Change Dock and inline edits (§11) | CLI |

Rules: no component imports `dmLayer.js` or `registry.js` directly except through `editSlice`; no store writer is reachable from `src/components/edit/**` except the op boundary; `src/domain/edit/**` is strict-typecheck clean and imports nothing from `src/components`.

## 2. Types (JSDoc, in `src/domain/edit/types.js`)

```js
/** @typedef {'pool'|'free'} FieldKind */
/** @typedef {{ card: string, field: string, kind: FieldKind, pool?: string, label: string,
 *   group: string, maxLength?: number, readersProof?: string }} FieldDeclaration */
/** @typedef {{ id: string, source: 'catalogue'|'generator'|'world'|'literal', values?: readonly string[],
 *   read?: (world) => string[], roll?: (world, seed, n) => string }} PoolSource */
/** @typedef {{ type: string, target: EntityRef, payload: Record<string, unknown>,
 *   requires?: string[], enables?: string[], relatedTo?: string[], conflictsWith?: string[],
 *   duration?: number }} Op */
/** @typedef {{ kind: 'settlement'|'institution'|'npc'|'faction'|'power'|'phantom'|'section',
 *   id: string }} EntityRef */
/** @typedef {'pending'|'applied'|'withdrawn'} DecreeStatus */
/** @typedef {{ id: string, op: Op, status: DecreeStatus, addedBy: 'dm'|'guard'|'surveyor',
 *   orderIndex: number, when?: { tick?: number, season?: string }, orderedAt: string, appliedAt?: string,
 *   tickRef?: string, chronicleRef?: string, overrode?: string[], followsFrom?: string[],
 *   surveyorCredit?: number }} Decree */
/** @typedef {{ entities: Record<string, Record<string, unknown>>, minted: Record<string, object>,
 *   phantoms: Record<string, Phantom> }} DmLayer */
/** @typedef {{ entryId: string, kind: 'prerequisite'|'contradiction'|'duration'|'range'|'contention'|'connection',
 *   message: string, offers: Array<'fulfil'|'self'|'proceed'|'reorder'|'keepFirst'|'keepLast'|'keepBoth'>,
 *   fulfil?: Op, relatedEntryId?: string }} Guard */
/** @typedef {{ id: string, seed: string, name: string, kind: string, size: string, stance: string,
 *   traits: Record<string, string> }} Phantom */
```

## 3. Persisted schema and the migration

- Two keys join the saved settlement record: `dmLayer: DmLayer` and `decrees: Decree[]`. Both are partialized with the save and its cloud copy; **neither enters the anonymous-draft envelope, an export for a fork, an import, or the gallery projection** (design §11: edits do not travel). A personal backup export omits them under the same rule until the owner says otherwise.
- The observed-shape register takes a schema rung (the migration-bundle door on the consist lineage) for the two keys and their readers; the persisted-key walker's key set grows by two.
- `scripts/migrate-edit-registry.mjs` folds each save's existing Change Dock pending changes into `decrees` (`pending`, `addedBy: 'dm'`, order preserved) and its inline edits into `dmLayer` (drafts) or `decrees` (canonized), idempotent, with a `--check` arm; runs in lane B before any surface.

## 4. The store slice

State: `{ editMode: { active: boolean, saveId: string|null }, dmLayer, decrees }` — `dmLayer` and `decrees` live on the settlement record, `editMode` is transient. Actions call only `src/domain/edit/*` pure functions and the existing writers through the application-command boundary. Selectors: `selectCanonState(saveId)` (the canon rule), `selectPendingDecrees`, `selectGuards` (memoized over `decrees` + the composed world), `selectDeclarationsFor(cardType)`. Persistence: `persistProjection` includes the two keys iff `saveId` is set; `mergePersistedState` validates both against the schema rung.

## 5. The guard engine

`evaluateGuards(registry, world, catalogue)` is pure: for each pending entry in order, every rule in `GUARD_RULES` may return a `Guard`. Initial rules, each reusing existing knowledge: `prerequisite` (op `requires[]` against the composed world and earlier entries), `range` (the structural validator's tier ranges over section counts), `totality` (faction power sums to 100 → `fulfil` with a rebalance op, or "how much, from whom"), `contradiction` (two entries whose ops `conflictsWith`), `contention` (two entries setting one fact), `duration` (an op with `duration` at a tick that cannot hold it), `connection` (out-of-sequence `requires`/`relatedTo` → `reorder`/`fulfil`/`proceed`). Coverage is declared per op type in `OP_TYPES[type].guards` and stated when empty. Overrides record `overrode: [guardId]` on the entry. Guards never refuse; every `Guard` carries at least `'proceed'`.

## 6. The tick

`applyDecreesAtTick(worldState, registry, tickRef)` runs at the head of `simulateCampaignWorldPulse` (the kernel gains one hook): pending entries whose `when` is this tick (or unset), in `orderIndex` order, each converted to the kernel's event form with `cause: 'table'` (and `offStage`, `overrode`, `followsFrom` carried), status → `applied`, `tickRef` set; the chronicle line comes from `decreeChronicleLine` (authored pools, §11). `retractDecreesOfTick` runs on the realm's rewind: entries of that tick → `pending` at their `orderIndex`, chronicle lines retracted. A property test: any registry the guards accept applies without contradiction, and `proceed` always applies.

## 7. The surfaces

- `EditModeShell` wraps the dossier when `editMode.active`; it renders the mode indicator in the forge's scheme and injects the pencil (cards with a declaration) and the plus (sections that accept additions) through the dossier's existing entity web; Done leaves the mode.
- `CardEditorDialog` is generated from `declarationsFor(cardType)`: groups as the card groups them; a `PoolField` (drop-down / search / "roll another" via `rollFrom`, seeded by settlement seed + entry id + roll counter) or a `FreeField` (plain text, `maxLength`, a font-coverage check); the effect tag from `selectCanonState`; Save / Add / Remove (remove takes a cause pool); the §934.31 door; a full-height sheet at the phone breakpoint inside the page; the forge's brown-and-gold tokens.
- `DecreeRegistryPage` at the dossier's foot: entries in order with one-line summaries, move up/down, withdraw, reopen (opens `CardEditorDialog` on the entry and returns it to its index), guard badges with the offers inline, the realm's Advance control; applied entries below with chronicle links; withdrawn kept for the record.
- The advance report reuses `RegenerationDeltaCard`'s sections for a tick that applied decrees.
- The Surveyor's `InterpretApplyPanel` emits `Decree`s with `addedBy: 'surveyor'` and `surveyorCredit`; its consent barrier becomes a `Guard` kind.

## 8. Instruments (walkers under tests/lint, censuses under tests/build)

1. `editDeclarations.walker` — every card rendering a pencil has a declaration; every `pool` field names a pool in `POOLS`.
2. `flavorFields.census` — every `free` field has zero readers under `src/generators`, `src/domain/worldPulse`, `src/domain/causalState`, `src/domain/edit/guards*`, and the registers, measured from the writer-reach and observed-shape data; a proof string per row.
3. `opGuardCoverage.walker` — every op type declares its guard coverage (rules or `'none, stated'`).
4. `decreeCause.walker` — every applied decree carries a chronicle line with a cause; overrides carry `overrode`.
5. `editMutationPath.walker` — no store writer is imported under `src/components/edit/**` except through the op boundary.
6. the existing dialog-door, phone-floor, reachability and no-clamp walkers extended to `src/components/edit/**`.
7. `dmLayerGoldenIsolation` — a property test regenerates with a layer and asserts the golden master unchanged and the delta card reporting the layer as kept.
8. `editTravel.walker` — a fork, an import and the gallery projection carry neither key (design §11).

## 9. The initial catalogues (seed content for lane A)

- **Card types with declarations:** institution (name free; class pool; standing pool; note free), npc (name free with the generator's roll; role pool from the world's institutions; disposition pool; note free), faction (name free; archetype pool; power via the totality guard; stance pool), power seat (holder pool over factions/npcs), system state cards (typed states only: security, food security, order).
- **Pools:** `institution.class` (the catalogue behind `institutionDisplayName`), `name.<culture>` (the generator), `npc.role`, `faction.archetype`, `stance`, `cause.remove` (died, left, burned, dissolved, seized), `commodity` (behind `resourceDisplayName`), `deity` (the pantheon), `tier`.
- **Op types (first twenty):** set-field, add-institution, remove-institution, add-npc, remove-npc, add-faction, remove-faction, set-power-holder, rebalance-power, set-relationship, declare-war (on-stage / phantom), make-peace, open-trade, close-trade, send-force, recall-force, resolve-outcome (victory/defeat/stalemate/truce), found-phantom, promote-phantom, set-state.

## 10. The lanes, with dependencies and proofs

A (declarations, pools, the flavor census) → B (ops, the layer, the registry key, the schema rung, the migration script, plain edits on drafts) → C (the guard engine and rules; the property tests) → D (the surfaces: shell, dialog, registry page, phone sheets, the forge's scheme) → E (the tick hook, chronicle pools, the rewind, the advance report) → F (phantoms and promotion) → G (the Surveyor re-pointed). Each lane lands with its instruments green, one directory per gated run, pause-and-resume at every gate (§934.33), and the chair's compose. Gate: the whole editor is Cartographer's (§934.36 addendum). Sequenced after the 2026-09-18 consist's push and before the simulator's build-out (§934.38).
