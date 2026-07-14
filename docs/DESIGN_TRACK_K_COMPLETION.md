# DESIGN — TRACK K COMPLETION: THE OPERATION LAYER
## Fable 5 architecture, 2026-07-14 — the bridge wave: owed work AND Surveyor's foundation
### Binding context: DESIGN_AI_CONTROL_SURFACE.md §1 (ops-not-state), the Track K ActionResult/outbox precedent (5 canon actions, deliberate partial adoption)

## 0. Goal
One typed OPERATION surface over every state-mutating store action, so that (a) manual UI and the
future AI compiler provably drive the SAME verbs (the Surveyor §2 requirement: "the AI should not
possess special authority the manual interface lacks"), (b) receipts become uniform, and (c) the
proposal/approval lane can carry ANY op, not just world-pulse proposals. This wave changes ZERO
behavior: envelopes WRAP existing actions; every action's semantics, bytes, and tests stay
untouched (goldens byte-identical is the wave gate).

## 1. The envelope (extends ActionResult, does not replace it)
`src/store/operations.js` (eager-thin) + `operationRegistry.js`:
`{ opType, targets: {saveId?, campaignId?, entityRef?}, params, provenance: 'manual'|'system',
receiptRef?, undoToken? }` — 'ai' provenance is RESERVED (arrives with Surveyor stage 3, along
with the owner-reviewed persisted aiOperationLog; v1 logs ride the EXISTING outbox + session
surfaces — NO new persisted shape, that class is owner-gated and deliberately deferred).

## 2. The census + classification (the wave's first deliverable, committed as a table in this doc)
Enumerate every mutating store action (~40 by the store survey) into four classes:
- K-A ALREADY ENVELOPED: the 5 Track-K canon actions — adapt to the registry, zero change.
- K-B MECHANICAL WRAPS: simple setters/updaters — thin envelope emission at the action boundary.
- K-C ORCHESTRATORS AS MACRO-OPS: generate / canonize / advance / catchUp / proposals — one
  macro-op each; their EXISTING receipts (rollExplanations, rulesetLog, pulse records) become the
  receiptRef; no internal change.
- K-D EXEMPT-WITH-REASON: pure-UI state (toggles, view state) — registered as exempt so the
  walker's denominator is total.

## 3. Structural prevention (the point of the wave)
`tests/store/operationRegistry.walker.test.js`: every mutating action in the store (detected by
set()-usage census, the clamp-baseline scan idiom) is either registered with an opType or
exempt-with-reason — a NEW mutating action cannot ship outside the operation surface. Shrink-only
on the exempt list.

## 4. Budget + phasing (each phase its own gateable commit)
Envelope emission code rides EAGER slices — budget it: the thin emitter is ~1-2 lines/action +
one small shared module; estimate ≤400B eager total, measured per phase against the ratchet
(dep-import the registry body if it grows). Phases: K1 registry + walker + the 5 existing (the
foundation, proves the pattern); K2 settlement-edit ops; K3 campaign/pulse macro-ops; K4
config/custom-content ops. Full gate per phase; goldens byte-identical throughout.

## 5. What this is NOT (scope fences)
Not the proposal-review UI extension (Surveyor stage 3). Not the aiOperationLog (owner-gated
persisted shape, Surveyor stage 3). Not an undo rework (undoToken points at EXISTING undo
machinery where it exists; absent ⇒ null). Not a store rewrite — no action body changes.

## 6. Sequencing
After the owner-batch merge + catch-up collapse + dockets land (it touches the same store files —
serial, not parallel). K1 can chip the moment that lane frees; K2-K4 follow as one lane.
