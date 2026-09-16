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

---

## IMPLEMENTATION RESULT (2026-07-14 — Opus implementer; unstaged on review-fixes-2026-07-08 @ 0d559be3)

### §2 CENSUS (committed table). The set()-usage census (the walker's denominator) found **223**
mutating store actions across the 15 composed slices — far more than the design's "~40" estimate,
because the census counts EVERY set()-referencing action (incl. dozens of pure-UI setters, e.g.
mapSlice alone contributes 42). Classified per §2:

| Class | Count | What |
|---|---|---|
| K-A CANON | 5 | applyEvent, undoLastEvent, recordSnapshot, revertToSnapshot, destroySavedSettlement |
| K-C MACRO | 38 | generate/regen/canonize(±spatial/saved)/advance/catchUp/resolveMajors/apply-proposal/party-impact/canon-relationship(±reverse)/dismiss-proposal/undo-pulse/rules-update, the two gallery + account + neighbour imports, stressor inject/resolve/undo, regional rebuild/advance/apply/resolve, AI narrative/dailyLife/progression/cosmetic-rename/revert-to-raw, custom-content cloud load/migrate, commitPendingEdits, applyEventBatch |
| K-B MECHANICAL | 114 | simple setters/updaters of durable/domain state (saves, campaigns, edits, locks, renames, map DATA, toggles, config values, credits, auth session, neighbour links, custom content) |
| K-D EXEMPT | 66 | pure-UI / transient / session state (view/tool/selection/hover/panel/loading/error/wizard-step/preview/dismiss/in-flight-guard/onboarding-coach), each exempt-with-reason |

The executable census is `src/store/operationRegistry.js` (`OPERATIONS` + `EXEMPT_OPERATIONS`);
`tests/store/operationRegistry.walker.test.js` enforces `registered ∪ exempt == the live census`
exactly (both directions) + `exempt.length ≤ EXEMPT_CEILING=66` (shrink-only). The census scanner
is comment/string-aware and brace-matched; the get()-DELEGATING orchestrators (authSignOut →
clearAuth, applyAllQueuedRegionalImpacts, setPrimaryDeity/imposeCult, pinNpc, …) reference `get`
not `set`, so they are out of the denominator by design — compositions of registered sub-ops, a
documented cannot-catch (walker header).

### DIVERGENCE FROM §4 (JUDGMENT — vetoable). §4 anticipated ~1-2 lines/action of EAGER envelope
emission (≤400 B). Measured reality on this lineage: the store slices are eager (in the first-paint
static closure) and the closure margin is ~54 B against `CLOSURE_BUDGET_BYTES=1,214,050`. Eager
emission across ~150 actions provably cannot ship within the constitutional first-paint gate, and
its ONLY consumer (the Surveyor proposal/approval lane + the owner-gated aiOperationLog —
DESIGN_AI_CONTROL_SURFACE.md stage 3, §5's scope fence here) does not exist yet. So this wave
ships the typed operation SURFACE (the manifest) + the completeness WALKER (§3, the wave's stated
point) + the pure envelope module (`operations.js`, `makeOperation` / `operationFromActionResult`)
with **ZERO action-body changes** — goldens byte-identical, first-paint untouched (nothing eager
imports either new module). Runtime envelope FLOW is DEFERRED to its consumer, when the budget
question is owner-resolved. This is a deliberate, documented divergence, not an omission —
`chose manifest+walker (byte-free) over eager per-action emission because 54 B < 400 B and the
consumer is owner-gated — say "veto" to revisit`.

### K-phasing. Because emission is deferred, K1-K4 collapse into one byte-free deliverable: the
complete registry (K1 5 canon + K2 settlement-edit + K3 campaign/pulse + K4 config/custom-content,
all registered at once) + the walker + the K-A adapter proof (`tests/store/operations.test.js`).
No commit made (all work left unstaged per brief).
