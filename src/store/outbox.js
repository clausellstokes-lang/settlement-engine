/**
 * outbox.js — the durable persistence outbox (Track K §C3).
 *
 * A FIFO-per-saveId queue of PersistenceOps, mirrored to localStorage, that
 * turns `persistSaveUpdate` from a fire-and-forget cloud write into a durable
 * enqueue+drain: a local commit lands in one frame, the cloud catches up
 * visibly, and pending writes survive a tab close.
 *
 * WHAT THIS MODULE OWNS (and what it does NOT):
 *   • The op list (intent) and the payload cache (data), each mirrored to a
 *     schema-versioned localStorage envelope. The op list stays small — it
 *     carries INTENT ({ id, saveId, kind, payloadFingerprint, attempts,
 *     status, enqueuedAt, nextAttemptAt }) and REFERENCES its payload by key.
 *     Blobs live once, in the payload cache, keyed by `${saveId}:${kind}`.
 *     Supersede-dedup keeps at most one op — and therefore one payload — per
 *     (saveId, kind), so no blob is ever stored twice and the mirror is bounded.
 *   • The WS31 bounded-concurrency drain (cap 4), exponential backoff
 *     (1s / 5s / 30s, then park as 'failed'), and supersede-dedup.
 *   • A pluggable clock + scheduler so tests control time (no real timers fire
 *     unless a scheduler is wired — production wires setTimeout in initOutbox).
 *
 * It does NOT know about Supabase, the store, or the UI. The caller
 * (campaignSliceShared) provides a `runner(op, payload)` that performs the
 * actual network write and returns a boolean; this module drives it, records
 * op state, and mirrors durably. That keeps the outbox generic and lets boot
 * replay re-run the very same runner against the mirror.
 */

// ── Schema + bounds ──────────────────────────────────────────────────────────

const MIRROR_KEY = 'sf_outbox_v1';
const PAYLOAD_KEY = 'sf_outbox_payloads_v1';
const SCHEMA_VERSION = 1;

/**
 * Op-list bound. The queue drains continuously, so this is a backstop against a
 * pathological offline burst (thousands of edits with no connectivity). When
 * exceeded we prune the OLDEST ops first (their payloads too) — a dropped op is
 * the same outcome as today's fire-and-forget on a wedged connection, but only
 * ever the stalest write, and only past 200 pending.
 */
const MAX_QUEUED = 200;

/** Bounded-concurrency drain cap (WS31 pool). */
export const DRAIN_CAP = 4;

/**
 * Backoff ladder applied AFTER a failed attempt: the 1st failure waits 1s, the
 * 2nd 5s, the 3rd 30s; a 4th failure parks the op as 'failed'. So an op is
 * attempted at most `BACKOFF_MS.length + 1` (= 4) times before it parks.
 */
const BACKOFF_MS = [1000, 5000, 30000];

export const OP_KIND_BARRIER = 'barrier';

// ── Injectable clock + scheduler ─────────────────────────────────────────────
// Backoff timestamps use a clock; retries fire through a scheduler. Both are
// injectable so tests drive time deterministically. With NO scheduler wired
// (the test default), failed ops park in the queue and are only re-attempted
// when the caller explicitly drains (retry affordance / boot replay) — so no
// stray real timer ever fires inside a unit test.

/** @type {() => number} */
let _clock = () => Date.now();
/** @type {null | ((fn: () => void, delayMs: number) => void)} */
let _scheduler = null;

/** Inject the millisecond clock (default Date.now). Pass null to reset. */
export function setOutboxClock(fn) {
  _clock = typeof fn === 'function' ? fn : (() => Date.now());
}

/** Inject the retry scheduler (default none). Production wires setTimeout. */
export function setOutboxScheduler(fn) {
  _scheduler = typeof fn === 'function' ? fn : null;
}

// ── In-memory state (the mirror is its durable shadow) ───────────────────────

/**
 * @typedef {Object} PersistenceOp
 * @property {string} id                 // deterministic: `${saveId}::${kind}::${n}` (monotonic n)
 * @property {string} saveId
 * @property {string} kind               // field-set descriptor ('settlement+campaignState+…') or 'barrier'
 * @property {string|null} payloadKey    // key into the payload cache; null for a barrier
 * @property {string|null} payloadFingerprint
 * @property {number} attempts
 * @property {'queued'|'inflight'|'done'|'failed'} status
 * @property {number} enqueuedAt
 * @property {number} nextAttemptAt      // clock() threshold; 0 = ready now, Infinity = parked
 * @property {boolean} differential      // whether a success records the session differential fingerprint
 */

/** @type {PersistenceOp[]} */
let _ops = [];
/** @type {Record<string, any>} */
let _payloads = {};
let _counter = 0;

/** @type {null | ((status: {queued:number, failed:number, inflight:number}) => void)} */
let _statusReporter = null;

/** Wire a status listener (queued/failed counts) — the chip subscribes here. */
export function initOutboxStatusReporter(fn) {
  _statusReporter = typeof fn === 'function' ? fn : null;
}

// ── localStorage mirror (schema-versioned, tolerant, guarded) ────────────────

function safeLocalStorage() {
  try {
    return typeof localStorage !== 'undefined' ? localStorage : null;
  } catch {
    return null; // some environments throw on access (privacy mode)
  }
}

/** Persist the op list + payload cache to localStorage. Never throws. */
function persistMirror() {
  const ls = safeLocalStorage();
  if (!ls) return;
  try {
    // Normalise on write: an inflight op that a crash interrupts must replay,
    // so it is mirrored as a ready 'queued' op (a half-sent write is retried;
    // the underlying update is idempotent — last-writer-wins on the row).
    const ops = _ops
      .filter(op => op.status !== 'done')
      .map(op => op.status === 'inflight'
        ? { ...op, status: 'queued', nextAttemptAt: 0 }
        : op);
    ls.setItem(MIRROR_KEY, JSON.stringify({ version: SCHEMA_VERSION, ops }));
    ls.setItem(PAYLOAD_KEY, JSON.stringify({ version: SCHEMA_VERSION, payloads: _payloads }));
  } catch (e) {
    // Quota or serialization failure — the in-memory queue still drives this
    // session; we simply lose crash-durability. Warn, never crash a save.
    console.warn('[outbox] mirror write failed', e);
  }
}

/**
 * Read the mirror back into memory. Tolerant: a corrupt/incompatible envelope
 * is discarded (warn + fresh queue), never a crash. Returns the number of
 * replayable ops loaded.
 */
export function loadMirror() {
  const ls = safeLocalStorage();
  _ops = [];
  _payloads = {};
  if (!ls) return 0;
  let rawOps;
  let rawPayloads;
  try {
    rawOps = ls.getItem(MIRROR_KEY);
    rawPayloads = ls.getItem(PAYLOAD_KEY);
  } catch {
    return 0;
  }
  if (!rawOps) return 0;
  try {
    const envelope = JSON.parse(rawOps);
    if (!envelope || envelope.version !== SCHEMA_VERSION || !Array.isArray(envelope.ops)) {
      throw new Error('unrecognized outbox envelope');
    }
    const payloadEnv = rawPayloads ? JSON.parse(rawPayloads) : null;
    const payloads = (payloadEnv && payloadEnv.version === SCHEMA_VERSION && payloadEnv.payloads)
      ? payloadEnv.payloads
      : {};
    // Drop barriers (intra-session ordering markers; their partner snapshot is
    // re-synced by loadCampaigns on boot) and any op whose payload is missing.
    _ops = envelope.ops.filter(op =>
      op && op.kind !== OP_KIND_BARRIER && op.payloadKey && payloads[op.payloadKey] !== undefined,
    ).map(op => ({
      ...op,
      status: op.status === 'failed' ? 'failed' : 'queued',
      // Parked-on-disk ops become immediately retryable on a fresh boot.
      nextAttemptAt: 0,
      attempts: op.status === 'failed' ? op.attempts : 0,
    }));
    // Keep only payloads still referenced by a surviving op.
    const live = new Set(_ops.map(op => op.payloadKey));
    _payloads = Object.fromEntries(Object.entries(payloads).filter(([k]) => live.has(k)));
    return _ops.length;
  } catch (e) {
    console.warn('[outbox] mirror corrupt — starting a fresh queue', e);
    _ops = [];
    _payloads = {};
    // Best-effort scrub of the poisoned envelope so it can't re-trip next boot.
    try { ls.removeItem(MIRROR_KEY); ls.removeItem(PAYLOAD_KEY); } catch { /* ignore */ }
    return 0;
  }
}

// Prime the in-memory queue from the mirror at module load (guarded — a no-op
// in a node test env with no localStorage). Boot replay (initOutbox) re-drains.
loadMirror();

// ── Status / notification ────────────────────────────────────────────────────

/** Current queue status for the chip: pending + parked counts (barriers excluded). */
export function getStatus() {
  let queued = 0;
  let failed = 0;
  let inflight = 0;
  for (const op of _ops) {
    if (op.kind === OP_KIND_BARRIER) continue;
    if (op.status === 'failed') failed += 1;
    else if (op.status === 'inflight') inflight += 1;
    else if (op.status === 'queued') queued += 1;
  }
  return { queued, failed, inflight };
}

function notify() {
  try { _statusReporter?.(getStatus()); } catch { /* reporting must never throw */ }
}

/** Commit in-memory changes to the mirror and fan out the status. */
function commit() {
  persistMirror();
  notify();
}

// ── Enqueue (supersede-dedup + payload cache + bound) ─────────────────────────

function payloadKeyFor(saveId, kind) {
  return `${saveId}:${kind}`;
}

/**
 * Enqueue (or supersede) a persistence op. A newer op for the same (saveId,
 * kind) REPLACES a still-pending or parked older op — the stale intent and its
 * payload are dropped (fingerprint supersede-dedup). Returns the live op.
 *
 * @param {{ saveId: string, kind: string, payload: any, fingerprint: string|null, differential?: boolean }} spec
 */
export function enqueue({ saveId, kind, payload, fingerprint, differential = false }) {
  const key = payloadKeyFor(saveId, kind);
  // Supersede: drop any non-inflight op with the same key (an inflight op is
  // mid-attempt — let it settle; the new op runs after and last write wins).
  // Its payload is about to be overwritten by the newer one, so no prune needed.
  _ops = _ops.filter(op => !(op.payloadKey === key && op.status !== 'inflight'));

  _payloads[key] = payload;
  const op = /** @type {PersistenceOp} */ ({
    id: `${saveId}::${kind}::${_counter++}`,
    saveId,
    kind,
    payloadKey: key,
    payloadFingerprint: fingerprint,
    attempts: 0,
    status: 'queued',
    enqueuedAt: _clock(),
    nextAttemptAt: 0,
    differential,
  });
  _ops.push(op);
  enforceBound();
  commit();
  return op;
}

/** Enqueue a barrier op (the members-before-snapshot ordering boundary). */
export function enqueueBarrier(saveId = '*') {
  const op = /** @type {PersistenceOp} */ ({
    id: `${saveId}::${OP_KIND_BARRIER}::${_counter++}`,
    saveId,
    kind: OP_KIND_BARRIER,
    payloadKey: null,
    payloadFingerprint: null,
    attempts: 0,
    status: 'queued',
    enqueuedAt: _clock(),
    nextAttemptAt: 0,
    differential: false,
  });
  _ops.push(op);
  commit();
  return op;
}

function pruneOp(op) {
  _ops = _ops.filter(o => o !== op);
  if (op.payloadKey && !_ops.some(o => o.payloadKey === op.payloadKey)) {
    delete _payloads[op.payloadKey];
  }
}

/** Drop the oldest ops (and orphaned payloads) once the queue exceeds MAX_QUEUED. */
function enforceBound() {
  const live = _ops.filter(op => op.kind !== OP_KIND_BARRIER);
  if (live.length <= MAX_QUEUED) return;
  const overflow = live.length - MAX_QUEUED;
  let dropped = 0;
  _ops = _ops.filter(op => {
    if (dropped < overflow && op.kind !== OP_KIND_BARRIER) { dropped += 1; return false; }
    return true;
  });
  // Garbage-collect payloads no op references any more.
  const live2 = new Set(_ops.map(op => op.payloadKey));
  _payloads = Object.fromEntries(Object.entries(_payloads).filter(([k]) => live2.has(k)));
}

// ── Drain (WS31 bounded pool + backoff) ──────────────────────────────────────

/**
 * Run `worker` over `items` with at most `limit` in flight at once. Every item
 * is processed and ALL settle before this resolves — no fail-fast. (Same lane
 * discipline as the world-pulse flush it replaces.)
 */
async function runWithConcurrency(items, limit, worker) {
  const results = new Array(items.length);
  let next = 0;
  const lane = async () => {
    while (true) {
      const i = next++;
      if (i >= items.length) return;
      results[i] = await worker(items[i], i);
    }
  };
  const laneCount = Math.max(1, Math.min(limit, items.length));
  const lanes = [];
  for (let k = 0; k < laneCount; k++) lanes.push(lane());
  await Promise.all(lanes);
  return results;
}

/** Schedule a parked op's retry via the injected scheduler (no-op if none). */
function scheduleRetry(op, runner, delayMs) {
  if (!_scheduler) return;
  _scheduler(() => {
    // Only fire if the op is still the live, ready, queued op it was.
    if (_ops.includes(op) && op.status === 'queued') {
      attemptOps([op], runner).catch(() => { /* runner is boolean-safe */ });
    }
  }, delayMs);
}

/**
 * Attempt each op once through `runner`, bounded at DRAIN_CAP in flight. On
 * success the op is pruned; on failure it backs off (1s/5s/30s) and, past the
 * ladder, parks as 'failed'. Returns per-op { op, ok } in input order.
 *
 * @param {PersistenceOp[]} ops
 * @param {(op: PersistenceOp, payload: any) => Promise<boolean>} runner
 */
export async function attemptOps(ops, runner) {
  const results = await runWithConcurrency(ops, DRAIN_CAP, async (op) => {
    if (op.status === 'done') return { op, ok: true };
    op.status = 'inflight';
    op.attempts += 1;
    let ok;
    try {
      ok = await runner(op, op.payloadKey != null ? _payloads[op.payloadKey] : undefined);
    } catch {
      ok = false; // runner should be boolean-safe, but never let it reject the pool
    }
    if (ok) {
      op.status = 'done';
      pruneOp(op);
    } else {
      const delay = BACKOFF_MS[op.attempts - 1];
      if (delay == null) {
        op.status = 'failed';
        op.nextAttemptAt = Infinity; // parked — Retry affordance / next boot revives it
      } else {
        op.status = 'queued';
        op.nextAttemptAt = _clock() + delay;
        scheduleRetry(op, runner, delay);
      }
    }
    return { op, ok };
  });
  commit();
  return results;
}

/** Ops eligible for a drain right now (ready, still queued, non-barrier). */
export function readyOps() {
  const now = _clock();
  return _ops.filter(op =>
    op.kind !== OP_KIND_BARRIER && op.status === 'queued' && op.nextAttemptAt <= now,
  );
}

/** Attempt every currently-ready op (boot replay / scheduled sweep). */
export function drainReady(runner) {
  return attemptOps(readyOps(), runner);
}

/**
 * Resolve a barrier: it clears once every op ENQUEUED BEFORE it is terminal
 * (done or parked-failed). Called after a member drain so the caller may then
 * run the snapshot commit. Idempotent; prunes the barrier when satisfied.
 */
export function resolveBarrier(barrier) {
  const idx = _ops.indexOf(barrier);
  if (idx === -1) return true;
  // The barrier clears once no predecessor is literally mid-flight. A member
  // whose first attempt FAILED (now backing off, status 'queued') is terminal
  // for THIS flush — the snapshot commits after it just as it did before the
  // outbox (local truth is durable; the member retries independently).
  const blocked = _ops.slice(0, idx).some(op =>
    op.kind !== OP_KIND_BARRIER && op.status === 'inflight',
  );
  if (blocked) return false;
  _ops.splice(idx, 1);
  commit();
  return true;
}

/**
 * Force every pending op — parked ('failed') AND still backing off ('queued'
 * with a future nextAttemptAt) — to be immediately retryable (the chip's Retry
 * action: "I fixed my connection, try now"). Resets attempts + backoff so the
 * next drain re-attempts them all. Leaves inflight ops alone. Returns the ops
 * it revived.
 */
export function reviveAllPending() {
  const revived = [];
  for (const op of _ops) {
    if (op.kind === OP_KIND_BARRIER) continue;
    if (op.status === 'failed' || op.status === 'queued') {
      op.status = 'queued';
      op.attempts = 0;
      op.nextAttemptAt = 0;
      revived.push(op);
    }
  }
  if (revived.length) commit();
  return revived;
}

// ── Lifecycle / test hooks ───────────────────────────────────────────────────

/** Wipe the queue, payload cache, mirror, and counter (boot/test reset). */
export function resetOutbox() {
  _ops = [];
  _payloads = {};
  _counter = 0;
  const ls = safeLocalStorage();
  if (ls) {
    try { ls.removeItem(MIRROR_KEY); ls.removeItem(PAYLOAD_KEY); } catch { /* ignore */ }
  }
  notify();
}

/** Snapshot of the current op list (defensive copy) — for tests/inspection. */
export function peekOps() {
  return _ops.map(op => ({ ...op }));
}

/** Snapshot of the current payload cache (defensive copy) — for tests. */
export function peekPayloads() {
  return { ..._payloads };
}
