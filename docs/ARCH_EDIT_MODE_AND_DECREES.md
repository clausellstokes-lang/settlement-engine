# Edit Mode and the Decree Registry — the implementation architecture (2026-09-19; amended the same day per design §12)

Companion to `docs/DESIGN_EDIT_MODE_AND_DECREES.md` (the design, its addenda §2.5a, §2.7a, §10, §11, and **§12 — the adversarial review's rulings, which GOVERN**; every section below was amended to match them, and the packet train that builds this is `docs/implementation/charters/EDIT-MODE-TRAIN.md`). This document is the build contract: modules, types, schemas, interfaces, instruments, and the lane order with each lane's proof. Everything here is headless-first; the surfaces come last and read only what the domain declares.

## 1. Module map

| module | responsibility | exports |
|---|---|---|
| `src/domain/edit/fieldDeclarations.js` | the editable fields per card type (§2.1); the source every modal is generated from | `FIELD_DECLARATIONS`, `declarationsFor(cardType)`, `isEditableCard(cardType)` |
| `src/domain/edit/pools.js` | the catalogue of catalogues (§2.2): pool id → source | `POOLS`, `poolValues(poolId, world, seed)`, `rollFrom(poolId, world, seed, rollIndex)` |
| `src/domain/edit/operations.js` | the typed op catalogue (§2.3) | `OP_TYPES`, `makeOp(type, target, payload)`, `validateOp(op, world)` |
| `src/generators/pipeline.js` (pinned mode, EM-P0) + stable ids (EM-P1, owner-gated) + the registry rows (EM-P2) | the three prerequisites measured at compile (§934.47): `runPipeline` today runs all 23 steps from config and accepts no record; no card kind has a stable id; generation's choosers are unregistered | `runPipeline(initialContext, rng, { pins })`; ids `npc:<n>` / `inst:<n>` / `fac:<n>` minted from the step's stream; registry rows per step |
| `src/domain/edit/dmLayer.js` + the pipeline's pinned mode | ONE ENGINE (§14 final): `rederive(record, config′, layer)` runs the derivation steps with every registered chooser whose output the record holds PINNED to the record's value (no re-roll), a chooser the record lacks drawing on the seed's own stream, and the layer's overrides applied — a root edit (one pin released) or a world-fact change (`config′`); incoherence is consequence; fresh generation with no pins is the golden | `pinsFrom(record) → pins` (registry key → record path), `rederive(record, config′, layer) → record`, `applyEdit(layer, op) → layer`, `DM_ID_NS`, `mintDmId(seed, kind, n)`; `dmLayer = { roots: Record<key, value>, worldFacts: Record<configKey, value>, minted, phantoms }` |
| `src/domain/edit/registry.js` | pure operations on the decree registry (§2.5, §2.5a, §12.1) | `stage(registry, op, meta)`, `reorder`, `withdraw`, `reopen` (PENDING entries only — an applied entry reopens read-only), `markApplied`, `revertTick(restoredRegistry, laterStaged)` (after a snapshot restore, re-appends every entry staged after the tick) |
| `src/domain/edit/guards.js` + `guardRules.js` | the guard engine and its rules (§2.7, §2.7a, §11, §12.8): the engine FOLDS — each entry is judged against the world with every earlier entry applied | `evaluateGuards(registry, world, opCatalogue)`, `GUARD_KINDS`, `GUARD_RULES` |
| `src/domain/edit/phantoms.js` | phantoms as MINIMAL SAVE RECORDS (§2.8 as ruled by §12.6): `kind: 'phantom'`, a seed, the pooled traits, in the owner's library and hidden from the shelf, so every neighbour derivation that resolves by save works unchanged. **The phantom consequence rule (§13, §934.43):** an off-stage act against a phantom yields the HOME PROCEDURES (the force resolves won/lost and returns through the existing muster/casualty/upkeep mechanics; an envoy or caravan returns unchanged) and the RECORD (a chronicle line) and nothing else — no world state; a real save routes through the campaign's inter-settlement machinery | `mintPhantom(seed, name, kind) → saveRecord`, `promotePhantom(record) → seed` (forging the seed replaces the record in place; record-only history stays record-only), `isPhantomRecord(record)`, `consequenceFor(target) → 'home-procedures+record' \| 'world'` |
| `src/domain/worldPulse/decreeHook.js` | the head-of-tick application (§2.6, §12.11): consumes NO PRNG and preserves the pulse record's key order when there are no decrees (the preset witness hashes the serialized record); the rewind rides `undoLastPulse` (§12.1) | `applyDecreesAtTick(worldState, registry, tickRef)`, `retractDecreesOfTick(registry, tickRef)` |
| `src/domain/display/stateProse/decreeProse.js` | the chronicle's sentences for decrees (§11) from authored pools | `decreeChronicleLine(entry, world)` |
| `src/store/editSlice.js` | edit mode, the registry and the layer in the store; persistence | `enterEditMode`, `leaveEditMode`, `stageDecree`, `applyPlainEdit`, `reorderDecree`, `withdrawDecree`, `reopenDecree`, selectors |
| `src/store/persistProjection.js` (existing) | partializes `dmLayer` and `decrees` with the save; never into the anonymous envelope; both keys join the THREE hand-mirrored denylists and their drift test, and `publicSafe` / `worldSnapshotPublic` name them (§12.4) | (existing surface) |
| `src/application/commands/standardCommandRegistry.js` (existing) | ONE generic decree adapter dispatching by op type — not twenty adapters (§12.13) | (one adapter) |
| `src/components/edit/EditModeShell.jsx` | the mode indicator, pencils and pluses (§3) | `EditModeShell`, `useEditMode()` |
| `src/components/edit/CardEditorDialog.jsx` | the generated modal (§3), on the §934.31 dialog primitive, in the forge's scheme | `CardEditorDialog` |
| `src/components/edit/DecreeRegistryPage.jsx` | the registry at the dossier's foot (§3) | `DecreeRegistryPage` |
| `src/components/surveyor/*` (existing) | proposals emitted as ops into the registry (§3, G) | (re-pointed) |
| `scripts/migrate-edit-registry.mjs` | the governed migration of the Change Dock (flag-off; RETIRED, not merged) and the inline edits into the layer and the registry (§11, §12.13) | CLI, `--check` |

Rules: no component imports `dmLayer.js` or `registry.js` directly except through `editSlice`; no store writer is reachable from `src/components/edit/**` except the op boundary; `src/domain/edit/**` is strict-typecheck clean and imports nothing from `src/components`.

## 2. Types (JSDoc, in `src/domain/edit/types.js`)

```js
/** @typedef {'pool'|'free'|'free-cascade'} FieldKind */
// free-cascade (§12.3): typeable, but names are JOIN KEYS — a change is a typed op
// (rename-faction / rename-npc / rename-settlement) that runs the existing rename cascade.
/** @typedef {{ card: string, field: string, kind: FieldKind, pool?: string, label: string,
 *   group: string, maxLength?: number, readersProof?: string,
 *   provenance: 'root', writer: string }} FieldDeclaration */
// `provenance` is always 'root' by construction (§14): the declaration census admits a field only
// when its `writer` (a generator step, by symbol) reads nothing but the seed and the dials; the
// walker refuses a derived field, so a declaration for one cannot exist.
/** @typedef {{ id: string, source: 'catalogue'|'generator'|'world'|'literal', values?: readonly string[],
 *   read?: (world) => string[], roll?: (world, seed, n) => string }} PoolSource */
/** @typedef {{ type: string, target: EntityRef, payload: Record<string, unknown>,
 *   requires?: string[], enables?: string[], relatedTo?: string[], conflictsWith?: string[],
 *   duration?: number, stage?: 'home'|'off-stage' }} Op */
// An off-stage op's CONSEQUENCE is decided at apply time by the target's reality (§13):
// a phantom → the home procedures + the record; a real save → the campaign's machinery.
/** @typedef {{ kind: 'settlement'|'institution'|'npc'|'faction'|'power'|'phantom'|'section',
 *   id: string }} EntityRef */
/** @typedef {'pending'|'applied'|'withdrawn'} DecreeStatus */
/** @typedef {{ id: string, op: Op, status: DecreeStatus, addedBy: 'dm'|'guard'|'surveyor',
 *   orderIndex: number, when?: { tick?: number, season?: string }, orderedAt: string, appliedAt?: string,
 *   tickRef?: string, chronicleRef?: string, overrode?: string[], followsFrom?: string[],
 *   surveyorCredit?: number }} Decree */
/** @typedef {{ entities: Record<string, Record<string, unknown>>, minted: Record<string, object>,
 *   phantoms: Record<string, Phantom> }} DmLayer */
/** @typedef {{ entryId: string, kind: 'prerequisite'|'totality'|'contradiction'|'contention'|'connection',
 *   message: string, offers: Array<'fulfil'|'self'|'proceed'|'reorder'|'keepFirst'|'keepLast'|'keepBoth'>,
 *   fulfil?: Op, relatedEntryId?: string }} Guard */
/** @typedef {{ kind: 'phantom', id: string, seed: string, name: string, size: string, stance: string,
 *   traits: Record<string, string>, hidden: true }} PhantomRecord */ // a minimal SAVE record (§12.6)
```

## 3. Persisted schema and the migration

- Two keys join the saved settlement record: `dmLayer: DmLayer` and `decrees: Decree[]`. Both are partialized with the save and its cloud copy; **neither enters the anonymous-draft envelope, an export for a fork, an import, or the gallery projection** (design §11: edits do not travel). A personal backup export omits them under the same rule until the owner says otherwise.
- The observed-shape door for every new domain reader of a save-time key is an `EXPLAINED_WRITER_EXEMPTIONS` entry through the migration bundle, with a declared mechanism (§12.9) — not a "schema rung"; EM-B2 owes `dmLayer on settlement`, EM-C1 owes `decrees on settlement`. MEASURED at compile (EM-B3): the settlement record's keys ride the save row's `data`, not the zustand partialize — `partializeStoreState` is PRESERVED, not modified, and the earlier "persisted-key instrument grows by two" claim is withdrawn. `decrees` joins the client denylist with a migration file (202) mirroring it in the SQL scanner; `dmLayer` is already denied by both. Both keys join the three hand-mirrored denylists and their drift test; `publicSafe` and `worldSnapshotPublic` name them explicitly; the travel proof is a RUNTIME test (a fork, an import and the gallery projection carry neither key), not a static walker (§12.4).
- `scripts/migrate-edit-registry.mjs` folds each save's existing Change Dock pending changes (a flag-off surface that is RETIRED, not merged) into `decrees` (`pending`, `addedBy: 'dm'`, order preserved) and its inline edits into the record + `dmLayer` (drafts) or `decrees` (canonized), idempotent, with a `--check` arm; packet EM-B4, before any surface.

## 4. The store slice

State: `{ editMode: { active: boolean, saveId: string|null }, dmLayer, decrees }` — `dmLayer` and `decrees` live on the settlement record, `editMode` is transient. Actions call only `src/domain/edit/*` pure functions and the existing writers through the application-command boundary. Selectors: `selectCanonState(saveId)` reads the existing `campaignState.phase === 'canon'` (§12.2: canon is a save's state; the advance is a campaign act — a canonized settlement in no campaign shows "Place it in the Realm to advance" and its decrees wait), `selectPendingDecrees`, `selectGuards` (memoized over `decrees` + the record), `selectDeclarationsFor(cardType)`. Actions reach the writers through ONE generic decree adapter in the command registry (§12.13). Persistence: `persistProjection` includes the two keys iff `saveId` is set; `mergePersistedState` validates both against the observed-shape exemptions.

## 5. The guard engine

`evaluateGuards(registry, world, catalogue)` is pure and FOLDS (§12.8): each pending entry is judged against the world with every earlier entry applied, so a queue of one and a queue of ten are judged alike. Initial rules, each reusing existing knowledge: `prerequisite` (`checkInstCompat` / the gate features; op `requires[]` against the folded world), `totality` (faction power sums to 100 → `fulfil` with `renormalizeFactionPower` as the writer, or "how much, from whom"), `contradiction` (two entries whose ops `conflictsWith`), `contention` (two entries setting one fact), `connection` (out-of-sequence `requires`/`relatedTo` → `reorder`/`fulfil`/`proceed`, with the follows-from link). The "range over section counts" rule is DROPPED until a count table exists in the engine; `duration` waits for the same. Coverage is declared per op type in `OP_TYPES[type].guards` and stated when empty. Overrides record `overrode: [guardId]` on the entry. Guards never refuse; every `Guard` carries at least `'proceed'`.

## 6. The tick

`applyDecreesAtTick(worldState, registry, tickRef)` runs at the head of `simulateCampaignWorldPulse` (the kernel gains one hook): pending entries whose `when` is this tick (or unset), in `orderIndex` order, each converted to the kernel's event form with `cause: 'table'` (and `offStage`, `overrode`, `followsFrom` carried), status → `applied`, `tickRef` set; an off-stage entry against a PHANTOM applies only the home procedures (the returning force through the existing muster/casualty/upkeep mechanics; an envoy or caravan unchanged) and the chronicle line — no world state is written (§13); against a REAL save it is handed to the campaign's inter-settlement machinery; the chronicle line comes from `decreeChronicleLine` (authored pools, §11). The hook consumes NO PRNG and preserves the pulse record's key order at zero decrees; the preset witness is re-recorded BY HAND with a stated cause if it moves, and it must not move at zero decrees (§12.11). Scheduling (`when`) touches the interval orchestrator and the two-phase commit, not the hook alone (§12.13). The rewind is the REAL one — `undoLastPulse`, a whole-state snapshot restore, session-only, ten deep (§12.1): the restored snapshot already holds that tick's decrees as pending in order, and `revertTick` re-appends every decree staged after the tick from the pre-undo registry; `retractDecreesOfTick` is wired into that undo path. An APPLIED decree reopens READ-ONLY; only a rewind returns it to pending (THE PROMISE). A property test: any registry the guards accept applies without contradiction, and `proceed` always applies.

## 7. The surfaces

- `EditModeShell` wraps the dossier when `editMode.active`; it renders the mode indicator in the forge's scheme and injects the pencil (cards with a declaration) and the plus (sections that accept additions) through the dossier's existing entity web; Done leaves the mode.
- `CardEditorDialog` is generated from `declarationsFor(cardType)`: groups as the card groups them; a `PoolField` (drop-down / search / "roll another" via `rollFrom`, seeded by settlement seed + entry id + roll counter; pools read the GENERATOR's catalogue — `getInstitutionalCatalog` / `getInstitutionsForTier`, tier-gated — never the display seams, which pass unknowns through (§12.7)) or a `FreeField` (plain text, `maxLength`, a font-coverage check — NEW capability: a cmap read of the embedded faces, costed in its packet (§12.13)); the effect tag from `selectCanonState`; Save / Add / Remove (remove takes a cause pool); the §934.31 door; a full-height sheet at the phone breakpoint inside the page; the forge's brown-and-gold tokens.
- `DecreeRegistryPage` at the dossier's foot: entries in order with one-line summaries, move up/down, withdraw, reopen (PENDING only; opens `CardEditorDialog` on the entry and returns it to its index — an applied entry opens read-only), guard badges with the offers inline, the realm's Advance control (or "Place it in the Realm to advance" outside a campaign), the rewind's session limit stated; applied entries below with chronicle links; withdrawn kept for the record. The gate is `TIER_GATE.premium.editMode` (Cartographer is the display name) with its tier-facts parity pin (§12.10).
- The advance report reuses `RegenerationDeltaCard`'s sections for a tick that applied decrees, plus a field-level "the DM's fields" section — new derivation, since the card's "kept" is an entity diff (§12.12).
- The Surveyor's `InterpretApplyPanel` emits `Decree`s with `addedBy: 'surveyor'` and `surveyorCredit`; its consent barrier becomes a `Guard` kind.

## 8. Instruments (walkers under tests/lint, censuses under tests/build)

1. `editDeclarations.walker` — every card rendering a pencil has a declaration; every `pool` field names a pool in `POOLS`; every declared field is a ROOT (its named writer reads no other world fact — measured from the writer-reach and observed-shape data and the generators' reads), and a derived field is REFUSED (§14).
2. `flavorFields.census` — every `free` field has zero readers under `src/generators`, `src/domain/worldPulse`, `src/domain/causalState`, `src/domain/edit/guards*`, and the registers, measured by PROPERTY READS (the writer-reach and observed-shape data) AND by VALUE JOINS (the rename cascade's join list): a field the cascade joins on may only be `free-cascade` (§12.3); a proof string per row.
3. `opGuardCoverage.walker` — every op type declares its guard coverage (rules or `'none, stated'`).
4. `decreeCause.walker` — every applied decree carries a chronicle line with a cause; overrides carry `overrode`.
5. `editMutationPath.walker` — no store writer is imported under `src/components/edit/**` except through the op boundary.
6. the existing dialog-door, phone-floor, reachability and no-clamp walkers extended to `src/components/edit/**`.
7. `dmLayerGoldenIsolation` — a property test: generation with an EMPTY layer equals the golden master byte-for-byte; generation with a one-root layer differs from it only in that root and the derivations downstream of it (the untouched roots identical, because the overridden chooser still consumes its draw); the delta card reports the DM's fields.
8. `editTravel` — a RUNTIME test (not a walker): a fork, an import and the gallery projection carry neither key (design §11, §12.4).

## 9. The initial catalogues (seed content for lane A)

- **Card types with declarations (§14; the field list is EM-A1's enumeration over the record — ten root fields, `class`/`archetype` → `category`, standing/disposition/stance dropped as having no counterpart; §934.47 addendum 2):** WORLD FACTS (terrain, culture, trade access, resources, goods, services, stressors — pools = the wizard's option sets; a change re-derives with every choice pinned, never re-rolls), institution (name free-cascade; class pool; standing pool; note free), npc (name free-cascade with the generator's roll; role pool from the world's institutions; disposition pool; note free), faction (name free-cascade; archetype pool; power share as a root under the totality guard; stance pool), power seat (holder pool over factions/npcs). The system-state cards are STRUCK (derived). Names are join keys (§12.3). Every derived card renders provenance in place of a pencil, from the holder table's producer citations.
- **Pools:** `institution.class` (the generator's catalogue — `getInstitutionalCatalog` / `getInstitutionsForTier`, tier-gated; never the display seam behind `institutionDisplayName`), `name.<culture>` (the generator), `npc.role`, `faction.archetype`, `stance`, `cause.remove` (died, left, burned, dissolved, seized), `commodity` (the resource catalogue behind `resourceDisplayName`, read at its source), `deity` (the pantheon), `tier`.
- **Op types (twenty-five, in two packets):** HOME (EM-B1a): set-field, add-institution, remove-institution, set-institution-state (§15), add-npc, remove-npc, set-npc-status (§15), add-faction, remove-faction, set-power-holder, rebalance-power, set-relationship, rename-faction, rename-npc, rename-settlement (§12.3), set-world-fact (§14), found-phantom, promote-phantom. OFF-STAGE (EM-B1b, §13): declare-war, make-peace, open-trade, close-trade, send-force, recall-force, resolve-outcome (victory/defeat/stalemate/truce). `set-state` is STRUCK (system states are derived, §14).

## 10. The build order — the packet train

The seven lanes above are cut as a PACKET TRAIN at the estate's implementation-packet standard (§934.39 addendum): `docs/implementation/charters/EDIT-MODE-TRAIN.md` — nineteen packets in five waves (1: declarations, pools, the flavor census, ops, the layer on write, the registry key + travel, the migration · 2: the registry, the folded guard engine and rules, the store slice · 3: the tick hook, the chronicle's voice, the advance report · 4: the shell, the dialog, the registry page, the Surveyor bridge · 5: phantoms as hidden saves, promotion). Each packet is pre-proved by an Opus lane against the master tip after the push (verified facts by file:line, the change manifest, required symbols, the budget), validated by `scripts/implementation-packets.mjs`, and built with its instruments green, one directory per gated run, pause-and-resume at every gate (§934.33), and the chair's compose. Gate: the whole editor is Cartographer's — `TIER_GATE.premium.editMode` (§934.36 addendum, §12.10). Sequenced after the 2026-09-18 consist's push and before the simulator's build-out (§934.38).
