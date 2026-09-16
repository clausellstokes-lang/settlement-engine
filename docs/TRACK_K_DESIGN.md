# Track K — the North-Star architecture, incrementally

> **Authored 2026-07-09 (Wave C design, Fable-architected).** The adopted North
> Star (see `A_PLUS_ROADMAP.md` §Reconciliation): *every user action becomes a
> typed command, every command emits causal receipts, every mutation persists
> through a durable sync path.* Both prior reviews agreed: **do not rewrite** —
> reach it incrementally, behind pins, never as a big-bang CQRS port. This doc
> is the concrete incremental path, grounded in the seams that exist today.

## What already exists (build on, don't rebuild)

- **Receipts foundation** — `src/domain/trace.js` (`Trace`/`TraceCause`/
  `TraceEffect`, `recordTrace(s)`, query helpers) is the generation-time
  receipt; `src/domain/explanation.js` returns read-only *explanation
  envelopes* (`envelope()`, causes/consequences) derived from traces + state.
  Two vocabularies, one idea.
- **Persistence seam** — `persistSaveUpdate(saveId, partial)`
  (`campaignSliceShared.js:156`): never throws, reports through
  `campaignSyncError`; `persistSaveUpdates` drains batches through a
  bounded-concurrency pool (cap 4) with all-attempted semantics and the
  saves-before-snapshot commit ordering (F2). This is already half an outbox —
  it lacks durability, retry, and a reconcile surface.
- **Action seams** — the five canon-path mutations (`applyEvent`,
  `undoLastEvent`, `recordSnapshot`, `revertToSnapshot`,
  `destroySavedSettlement`) all already: mutate in one `set()`, derive
  systemState, call `persistSaveUpdate`, and fire analytics. They return
  bespoke shapes. That repetition IS the command pattern, unnamed.

## C1 — the ActionResult envelope (name the pattern)

One typedef, adopted action-by-action (no orchestration rewrite):

```js
/**
 * @typedef {Object} ActionResult
 * @property {boolean} ok
 * @property {string} action          // canonical action id, e.g. 'applyEvent'
 * @property {Object|null} before     // minimal pre-state slice (NOT a full clone)
 * @property {Object|null} after      // minimal post-state slice
 * @property {Receipt[]} receipts     // C2 type — why this happened
 * @property {PersistenceOp[]} persistenceOps // what must reach durable storage
 * @property {{event: string, props: Object}|null} analyticsEvent
 * @property {string|null} userMessage // toast/banner copy, null = silent
 */
```

- Adoption order: the five canon-path actions first (they share the
  persistSaveUpdate seam C3 needs), then EventComposer's command path, then
  world-pulse mutators. **Never converted speculatively** — an action converts
  when a consumer needs its envelope.
- **Pin (adoption ratchet):** `tests/store/actionEnvelope.test.js` keeps a
  checked-in list of converted actions; each asserts envelope-shape conformance
  (schema walk) and the list is grow-only. A converted action can never quietly
  return a bespoke shape again.

## C2 — one Receipt type (unify trace + explanation)

```js
/**
 * @typedef {Object} Receipt
 * @property {string} id            // stable: `${source}:${targetId}:${n}`
 * @property {'generation'|'event'|'pulse'|'edit'} source
 * @property {string} kind          // vocabulary from trace.js types (closed set)
 * @property {TraceCause[]} causes  // reuse trace.js typedefs verbatim
 * @property {TraceEffect[]} effects
 * @property {number|null} tick     // pulse receipts only
 */
```

- `trace.js` gains `receiptFromTrace(trace)`; `explanation.js` envelopes gain
  `receipts: Receipt[]` alongside their existing fields (additive — no consumer
  breaks). Event application (`events/mutate.js`) emits receipts into the
  ActionResult from the same data it already writes to the event log.
- **Not** a storage migration: receipts are *derived or emitted views*; stored
  shapes (traces, eventLog) stay canonical. Rejecting the "rebuild receipts"
  reading per the roadmap's correction — this is a TYPE unification.
- **Pin:** conformance test — every `receiptFromTrace` output validates against
  the Receipt schema across a 3-config generated corpus; the `kind` vocabulary
  is a closed set (coverage-pinned like every other vocabulary here).

## C3 — the durable outbox (evolve persistSaveUpdate, don't replace it)

The user-visible promise: **an advance/edit commits locally in one frame; the
cloud catches up visibly and survives a tab close.**

- `src/store/outbox.js`: a FIFO-per-saveId queue of
  `PersistenceOp { id, saveId, kind, payloadFingerprint, attempts, status:
  'queued'|'inflight'|'done'|'failed', enqueuedAt }`, **mirrored to
  localStorage** (ops carry payload references into the existing local-save
  cache, not duplicate blobs — the local cache is already the durable copy;
  the outbox persists *intent*, not data).
- `persistSaveUpdate` becomes `enqueue + drain` internally — same signature,
  same never-throws contract, so **zero call sites change**. Drain uses the
  WS31 pool (cap 4), exponential backoff (1s/5s/30s, then park as 'failed'),
  fingerprint dedup (a newer op for the same saveId+kind supersedes a queued
  older one), and preserves the pulse ordering contract (members before
  snapshot) via a barrier op kind.
- Crash-safety: on boot, parked/queued ops replay from the localStorage mirror
  against the local cache (which committed before the tab died).
- Reconcile UI: `campaignSyncError` (boolean banner) evolves into an outbox
  status chip — n queued / n failed with a Retry action. Fail-visible, never
  fail-silent; the banner's existing test contract migrates with it.
- **Pins:** drain ordering (deferred-promise test, extends
  `campaignPulsePersist.test.js`), retry/backoff/park, supersede-dedup,
  boot-replay from a simulated dead tab, banner→chip visibility on failure.

## Sequencing & invariants

C1 → C2 → C3, one commit each, full gate green each, golden untouched (all
store/derive-layer work). Owner's A+ maintenance invariant applies: each step
ships WITH its pins. Implementation: Opus; design & review: this document.
