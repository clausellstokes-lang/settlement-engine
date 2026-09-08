# SettlementForge — Settlement schema

The settlement object is the central contract every layer reads from:
generators write it, the store holds it, the PDF renders from it, the
AI overlay grounds in it, the UI components consume it. This document
is the single readable summary.

**Source of truth:** `src/domain/settlement.schema.js`. The JSDoc
typedefs there are exhaustive — this file paraphrases them so
newcomers don't have to read 1100+ lines to know what's there.

---

## Versioning

Every settlement carries three version stamps (see Tier 1.4):

- `schemaVersion: number` — shape version. Bumps when fields rename,
  restructure, or get removed.
- `simulationVersion: number` — generator-output semantics. Bumps
  when the same seed + config no longer produces an identical
  settlement.
- `generatorVersion: string` — build stamp ("1.2.3") for diagnostic
  display.

The constants live in `settlement.schema.js`. Today: SCHEMA_VERSION =
1, SIMULATION_VERSION = 1.

### Migrating saves

`src/domain/settlementMigrations.js` holds the migration chain.
`migrateSettlementToLatest(settlement)` is called automatically by
`normalizeSettlement`, so any save loaded through the adapter is
upgraded transparently.

Adding a new migration step:

1. Bump `SCHEMA_VERSION` in `settlement.schema.js`.
2. Append `{ from: <prev>, to: <new>, description, migrate }` to
   `MIGRATIONS` in `settlementMigrations.js`. The function MUST set
   the new `schemaVersion` on its returned object.
3. Add a fixture test in `tests/domain/settlementMigrations.test.js`
   that proves the step does what you think.

The chain is linear: each step's `to` MUST equal `from + 1`. No
fanout, no skips. The contract test `diagnoseMigrationChain` fails if
the chain has a gap.

---

## Top-level shape

A typical generated settlement carries the following keys. Items
marked **canonical** are the names new code should use; **legacy**
aliases survive for backward compatibility (see "Field aliases"
below).

### Identity

- `id: string` — opaque stable identifier (`s_` + 16 hex chars).
  Deterministic from `_seed` when present.
- `_seed: string` — PRNG seed. Never mutate. Replay determinism
  depends on this.
- `name: string`
- `tier: 'hamlet' | 'village' | 'town' | 'city' | 'metropolis'`
- `population: number`
- `schemaVersion: number`
- `simulationVersion: number`
- `generatorVersion: string`

### Configuration

- `config: object` — the user's inputs that drove generation
  (culture, terrain, monsterThreat, tradeRouteAccess, magic levels,
  toggles, etc.). Generators read this to deterministically produce
  the settlement; consumers can show "what was selected".

### Mechanical entities

These are the structured nodes the simulation reasons about. Each is
an array of objects:

- `institutions[]` — buildings + services with `id`, `name`,
  `category`, `desc`, `tags`, plus simulation flags.
- `powerStructure.factions[]` — political nodes with structured
  `archetype`, `power`, `legitimacy`, `resources`, `wants`, `fears`,
  `leverage`, `vulnerabilities` (Phase 4.1 / `factionProfile.js`).
- `powerStructure.conflicts[]` — active rivalries / disputes.
- `npcs[]` — characters with `id`, `name`, `role`, `goal`, `secret`,
  `factionAffiliation`, `structuralRank` (Phase 4.5 / `npcProfile.js`).
- `supplyChains[]` — stateful chains with `status`, `controller`,
  `dependencies`, `failureConsequences` (Phase 4.3 /
  `supplyChainState.js`).
- `activeConditions[]` — persistent simulation events (plague,
  refugees, cut routes) with `severity`, `affectedSystems`, source
  event id (Phase 4 / `activeConditions.js`).
- `threats[]` — typed threat surfaces (Phase 4.6 /
  `threatProfile.js`).
- `hooks[]` — plot hooks with structured origin, ifIgnored, possible
  resolutions, escalation clocks (Phase 4.10 / `hookEscalation.js`).

### Geography + map

- `spatialLayout` — districts/quarters, terrain features.
- `neighbourNetwork[]` — typed regional graph (Phase 4.13 /
  `regionalGraph.js`).
- `mapProfile` — bidirectional sim↔map data (Phase 4.14 /
  `mapProfile.js`).

### Narrative / prose

- `arrivalScene: string`
- `pressureSentence: string`
- `settlementReason: string | string[]`
- `prominentRelationship: { phrasing: string }`
- `history: { founding, historicalEvents, currentTensions,
  historicalCharacter }`
- `coherenceNotes: Array<string | { note: string }>`

### Derivation outputs (live, not stored)

These come from the pure-domain layer on read:

- `simulationSpine` — 7-line factual summary (Phase 2.5)
- `bands` — substrate + capacities qualitative bands (Phase 17/21)
- `aiGrounding payload` — the structured prompt envelope (Phase 6.1)

### Provenance / canon tagging

- Each entity may carry `source: 'generated' | 'user' | 'event' |
  'ai_overlay'`, `canonStatus: 'draft' | 'canon' | 'optional' |
  'superseded'`, `locked: boolean`. See `canonStatus.js`. The tagger
  infers these from `_authored`, `_source`, `appliedAt`,
  `causeEventId`, `_aiOverlay` flags when not set explicitly.
- `_userEdits: { [path]: { value, originalValue, editedAt } }` —
  per-field user authorship. Set by `applyUserEdit` (Tier 5.4 /
  `userEdits.js`). The presence of any edit on an entity sets
  `_authored: true` so the canonStatus tagger promotes the entity
  to `source: 'user'`.

### Persistence + container fields

- `simulationTrace[]` — causal trace records (Phase 2.1 / `trace.js`).
- `aiOverlays[]` — historical AI refinement passes.
- `userCanon: object` — user-asserted facts that survive every
  rerun.
- `eventLog[]` — applied events (Phase 2.2).

---

## Field aliases

Imported or older saved data may still contain historical field names. The
schema's `FIELD_ALIASES` map declares those relationships, and
`normalizeSettlement` promotes them to the canonical shape. Today:

```
stressors ← stress | stresses
```

`stressTypes` is deliberately **not** an alias of `stressors`: it is a separate
`string[]` field (type labels), whereas `stressors` holds stressor objects
(`type`/`name`/`severity`). Aliasing it would let `normalizeSettlement` write a
`string[]` into the object-expecting `stressors` field and corrupt substrate
readers. `FIELD_ALIASES` and `canonicalAccessors.canonStressors` both exclude
it for this reason.

When adding a new alias, update three places:

1. `FIELD_ALIASES` in `settlement.schema.js`.
2. Write only the canonical name in the generation pipeline, and add any
   import compatibility to `normalizeSettlement`.
3. The contract test
   `tests/domain/schemaCanonicalShape.test.js` — add an assertion
   for the new field.

---

## AI grounding interface

`src/domain/aiGrounding.js#buildAiGroundingPayload(settlement, opts)`
returns the structured envelope the AI overlay consumes:

```
{ identity, spine, bands, factions, chains, conditions, threats,
  npcs, history, hooks, contradictions, dailyLife, districts, region,
  userEdits, constraints: { forbidden, lockedEntities, userDirection } }
```

The bundle at `supabase/functions/_shared/aiGroundingBundle.js` is
the Deno-importable build of this module + its transitive deps. Run
`npm run build:edge-shared` after editing any file under
`src/domain/` that the bundle references.

`forbiddenChanges(settlement)` returns the per-call MUST PRESERVE
lines (locked entities, history beats, user-edited fields). The edge
function `generate-narrative` interpolates these into every refinement
prompt.

---

## When to update this doc

- Adding a top-level field to the schema — add a row above.
- Adding a new alias group — update the Field aliases section AND
  the dual-write contract test.
- Bumping SCHEMA_VERSION — update the Versioning section + add a
  migration step (see settlementMigrations.js).
- Refactoring an entire substructure — update the relevant section
  AND add a migration step that translates old → new.

The principle: this doc lives alongside `settlement.schema.js` and
should NEVER drift from it.
