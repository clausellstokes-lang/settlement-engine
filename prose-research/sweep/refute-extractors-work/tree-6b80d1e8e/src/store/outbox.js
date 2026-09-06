/**
 * outbox.js — the durable persistence outbox (Track K §C3).
 *
 * A queue of PersistenceOps, mirrored to localStorage, that turns
 * `persistSaveUpdate` from a fire-and-forget cloud write into a durable
 * enqueue+drain: a local commit lands in one frame, the cloud catches up
 * visibly, and pending writes survive a tab close.
 *
 * ORDERING GUARANTEE (enforced, not merely hoped): the `kind` is a save row's
 * COLUMN set (campaignSliceShared.kindForPartial), so every write to the SAME save
 * is serialized (attemptOps' per-save gate) AND a newer op supersedes an older
 * non-inflight op whose columns it fully COVERS (enqueue's subset-supersede) — so
 * an in-flight stale write can neither race nor land after a fresher overlapping
 * write (store-hooks-state-2: the destroy-resurrection + map-edit-revert class).
 * Different saves still drain concurrently up to DRAIN_CAP. Same-save disjoint
 * columns serialize too: the small availability cost is preferable to attempting
 * an overlap graph that can miss a future multi-column writer.
 *
 * FIFO continues through retry backoff: a newer same-save op remains queued behind
 * an older backing-off or parked op. That intentionally favors correctness over
 * availability for one save; the visible Retry affordance revives the blocked head
 * and its successors. Cross-save writes remain independent.
 *
 * ONE LANE OWNS ai_data (convergence landed): aiSlice's nine narrative writes
 * (generation / progression / chronicle / dossier notes / pin / unpin / cosmetic
 * rename / revert) used to call savesService.update directly and swallow the error
 * in a local catch, so two racing ai_data writes could land out of order and an
 * offline one was simply lost. They now all go through persistSaveUpdate, so the
 * `ai_data` column obeys the same supersede + retry guarantees as `data` and
 * `campaign_state`. The remaining non-outbox ai_data writer is deliberate: the
 * canon command transaction commits ai_data through a server RPC carrying an
 * `expectedAiData` compare-and-set, a STRONGER guarantee than the outbox's
 * last-write-wins, and it must stay on that lane.
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

import { createWeakReporterRegistry } from './weakReporterRegistry.js';

// ── Schema + bounds ──────────────────────────────────────────────────────────

const LEGACY_MIRROR_KEY = 'sf_outbox_v1';
const LEGACY_PAYLOAD_KEY = 'sf_outbox_payloads_v1';
const MIRROR_KEY_PREFIX = 'sf_outbox_v2:';
const PAYLOAD_KEY_PREFIX = 'sf_outbox_payloads_v2:';
const SCHEMA_VERSION = 2;

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
// Full-row intents used by deterministic world-pulse births.  They participate
// in the same per-save FIFO as column patches, but unlike a column set they
// supersede every older non-inflight intent for that row: an upsert is the full
// desired row, while a delete is its tombstone.
export const OP_KIND_FULL_ROW_UPSERT = 'world_pulse_save_upsert';
export const OP_KIND_FULL_ROW_DELETE = 'world_pulse_save_delete';
const FULL_ROW_KINDS = new Set([OP_KIND_FULL_ROW_UPSERT, OP_KIND_FULL_ROW_DELETE]);

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
 * @property {string|null} ownerId        // authenticated mirror owner; null before auth resolution
 * @property {boolean} ownerPending       // true only for a same-session enqueue that raced initial auth
 */

/** @type {PersistenceOp[]} */
let _ops = [];
/** @type {Record<string, any>} */
let _payloads = {};
let _counter = 0;
// null is used both before auth resolves and for a known signed-out session;
// _ownerKnown distinguishes those states. Only an authenticated owner receives a
// durable mirror or may replay one.
let _activeOwnerId = null;
let _ownerKnown = false;
let _ownerEpoch = 0;
/** Same-tab fallback when localStorage is unavailable/full. Never cross-drained. */
const _memoryByOwner = new Map();

/**
 * Per-(owner,saveId) serialization gates. Owner scoping lets B use the same
 * save id without waiting for A, while retaining A's gate across detach/reattach
 * so A cannot replay or supersede an older write before its original request
 * settles. Every same-owner write for one save therefore lands in enqueue order.
 * @type {Map<string, Promise<void>>}
 */
let _inflightByKey = new Map();

const _statusReporters = createWeakReporterRegistry();

/** Wire or replace one store's status listener. One-argument use remains valid. */
export function initOutboxStatusReporter(storeKey, reporter) {
  if (arguments.length === 1) {
    return _statusReporters.replaceLegacy(storeKey);
  }
  return _statusReporters.subscribe(storeKey, reporter);
}

// ── localStorage mirror (schema-versioned, tolerant, guarded) ────────────────

function safeLocalStorage() {
  try {
    return typeof localStorage !== 'undefined' ? localStorage : null;
  } catch {
    return null; // some environments throw on access (privacy mode)
  }
}

function normalizeOwnerId(ownerId) {
  if (ownerId == null || ownerId === '') return null;
  return String(ownerId);
}

function mirrorKeys(ownerId = _activeOwnerId) {
  if (!ownerId) return null;
  const suffix = encodeURIComponent(ownerId);
  return {
    ops: `${MIRROR_KEY_PREFIX}${suffix}`,
    payloads: `${PAYLOAD_KEY_PREFIX}${suffix}`,
  };
}

function scrubLegacyMirror(ls) {
  try {
    // V1 had no owner marker, so assigning it to whichever account happens to
    // sign in next would be a cross-account write. It cannot be migrated safely.
    ls.removeItem(LEGACY_MIRROR_KEY);
    ls.removeItem(LEGACY_PAYLOAD_KEY);
  } catch { /* ignore */ }
}

/** Persist the op list + payload cache to localStorage. Never throws. */
function persistMirror() {
  const ls = safeLocalStorage();
  const keys = mirrorKeys();
  if (!ls || !keys || !_ownerKnown) return;
  try {
    // Normalise on write: an inflight op that a crash interrupts must replay,
    // so it is mirrored as a ready 'queued' op (a half-sent write is retried;
    // the underlying update is idempotent — last-writer-wins on the row).
    const ops = _ops
      .filter(op => op.status !== 'done')
      .map(op => op.status === 'inflight'
        ? { ...op, status: 'queued', nextAttemptAt: 0 }
        : op);
    ls.setItem(keys.ops, JSON.stringify({
      version: SCHEMA_VERSION,
      ownerId: _activeOwnerId,
      ops,
    }));
    ls.setItem(keys.payloads, JSON.stringify({
      version: SCHEMA_VERSION,
      ownerId: _activeOwnerId,
      payloads: _payloads,
    }));
  } catch (e) {
    // Quota or serialization failure — the in-memory queue still drives this
    // session; we simply lose crash-durability. Warn, never crash a save.
    console.warn('[outbox] mirror write failed', e);
  }
}

/**
 * Read the ACTIVE OWNER'S mirror into memory. Loading merges with, rather than
 * resets, same-session work so an auth-resolution race cannot erase an enqueue
 * that landed just before initialization. A corrupt/incompatible envelope is
 * scrubbed without touching the live queue. Returns the number of disk ops added.
 */
export function loadMirror() {
  const ls = safeLocalStorage();
  const keys = mirrorKeys();
  if (!ls || !keys || !_ownerKnown) return 0;
  scrubLegacyMirror(ls);
  let rawOps;
  let rawPayloads;
  try {
    rawOps = ls.getItem(keys.ops);
    rawPayloads = ls.getItem(keys.payloads);
  } catch {
    return 0;
  }
  if (!rawOps) return 0;
  try {
    const envelope = JSON.parse(rawOps);
    if (!envelope
      || envelope.version !== SCHEMA_VERSION
      || envelope.ownerId !== _activeOwnerId
      || !Array.isArray(envelope.ops)) {
      throw new Error('unrecognized outbox envelope');
    }
    const payloadEnv = rawPayloads ? JSON.parse(rawPayloads) : null;
    const payloads = (payloadEnv
      && payloadEnv.version === SCHEMA_VERSION
      && payloadEnv.ownerId === _activeOwnerId
      && payloadEnv.payloads)
      ? payloadEnv.payloads
      : {};
    // Drop barriers (intra-session ordering markers; their partner snapshot is
    // re-synced by loadCampaigns on boot) and any op whose payload is missing.
    const loadedOps = envelope.ops.filter(op =>
      op && op.kind !== OP_KIND_BARRIER && op.payloadKey && payloads[op.payloadKey] !== undefined,
    ).map(op => ({
      ...op,
      ownerId: _activeOwnerId,
      ownerPending: false,
      status: op.status === 'failed' ? 'failed' : 'queued',
      // Parked-on-disk ops become immediately retryable on a fresh boot.
      nextAttemptAt: 0,
      attempts: op.status === 'failed' ? op.attempts : 0,
    }));
    // Keep only payloads still referenced by a surviving op.
    const existingKeys = new Set(_ops.map(op => op.payloadKey).filter(Boolean));
    const additions = loadedOps.filter(op => !existingKeys.has(op.payloadKey));
    const live = new Set(additions.map(op => op.payloadKey));
    const loadedPayloads = Object.fromEntries(
      Object.entries(payloads).filter(([k]) => live.has(k)),
    );
    // Disk work predates this session's enqueues. Keep it first while ensuring a
    // same-key session payload wins and remains the last write.
    _ops = [...additions, ..._ops];
    _payloads = { ...loadedPayloads, ..._payloads };
    for (const op of _ops) {
      const match = /::(\d+)$/.exec(String(op.id || ''));
      if (match) _counter = Math.max(_counter, Number(match[1]) + 1);
    }
    return additions.length;
  } catch (e) {
    console.warn('[outbox] owner mirror corrupt — keeping the live queue', e);
    // Best-effort scrub of only this owner's poisoned envelope. Same-session
    // work and every other account's mirror remain untouched.
    try {
      ls.removeItem(keys.ops);
      ls.removeItem(keys.payloads);
    } catch {
      // Cleanup is best-effort; the live in-memory queue is still usable.
    }
    return 0;
  }
}

function rememberDetachedOwner(ownerId) {
  // Keep a same-tab copy in addition to the durable mirror. This preserves the
  // old owner's pending writes when localStorage is unavailable or quota-bound.
  const ops = _ops
    .filter(op => op.status !== 'done' && op.kind !== OP_KIND_BARRIER)
    .map(op => op.status === 'failed'
      ? { ...op }
      : { ...op, status: 'queued', nextAttemptAt: 0 });
  if (ops.length === 0) {
    _memoryByOwner.delete(ownerId);
    return;
  }

  const payloadKeys = new Set(ops.map(op => op.payloadKey).filter(Boolean));
  _memoryByOwner.set(ownerId, {
    ops,
    payloads: Object.fromEntries(
      Object.entries(_payloads).filter(([key]) => payloadKeys.has(key)),
    ),
  });
}

/**
 * Move the in-memory queue to an authenticated owner (or detach it on sign-out).
 * Switching owners persists the old owner's queue, clears it from memory, then
 * loads only the new owner's mirror. On the FIRST auth resolution, enqueues that
 * raced initialization are claimed by that authenticated owner and merged with
 * its disk queue instead of being discarded.
 */
export function activateOutboxOwner(ownerId) {
  const nextOwnerId = normalizeOwnerId(ownerId);
  if (_ownerKnown && nextOwnerId === _activeOwnerId) {
    // Auth transitions detach/attach before publishing the replacement auth
    // object. A same-owner refresh after that store commit must re-emit the
    // current status; otherwise the first notification was correctly filtered
    // against the old owner and the new/anonymous session can retain stale UI.
    notify();
    return 0;
  }

  const wasKnown = _ownerKnown;
  const previousOwnerId = _activeOwnerId;
  if (wasKnown && previousOwnerId) {
    persistMirror();
    rememberDetachedOwner(previousOwnerId);
  }

  const pendingAuthOps = !wasKnown && nextOwnerId
    ? _ops.filter(op => op.ownerPending === true)
    : [];
  const pendingPayloadKeys = new Set(pendingAuthOps.map(op => op.payloadKey).filter(Boolean));
  const pendingAuthPayloads = Object.fromEntries(
    Object.entries(_payloads).filter(([key]) => pendingPayloadKeys.has(key)),
  );

  _ownerEpoch += 1;
  _ownerKnown = true;
  _activeOwnerId = nextOwnerId;
  const remembered = nextOwnerId ? _memoryByOwner.get(nextOwnerId) : null;
  if (nextOwnerId) _memoryByOwner.delete(nextOwnerId);
  _ops = remembered ? remembered.ops : pendingAuthOps;
  _payloads = remembered ? remembered.payloads : pendingAuthPayloads;
  for (const op of _ops) {
    op.ownerId = nextOwnerId;
    op.ownerPending = false;
  }

  const loaded = nextOwnerId ? loadMirror() : 0;
  if (nextOwnerId) persistMirror();
  notify();
  return loaded;
}

/** Current authenticated owner, or null while unresolved/signed out. */
export function getActiveOutboxOwner() {
  return _ownerKnown ? _activeOwnerId : null;
}

// ── Status / notification ────────────────────────────────────────────────────

/** Current queue status for the chip: pending + parked counts (barriers excluded). */
export function getStatus(ownerId) {
  if (arguments.length > 0) {
    const requestedOwner = normalizeOwnerId(ownerId);
    if (!_ownerKnown || requestedOwner !== _activeOwnerId) {
      return { queued: 0, failed: 0, inflight: 0 };
    }
  }
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
  const status = getStatus();
  _statusReporters.publish(status, _ownerKnown ? _activeOwnerId : null);
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

function inflightKeyFor(op) {
  return op?.ownerId && op?.saveId != null
    ? `${op.ownerId}\u0000${op.saveId}`
    : null;
}

function earlierOpForSameOwnerAndSave(op, opIndex = _ops.indexOf(op)) {
  if (opIndex <= 0) return null;
  return _ops.slice(0, opIndex).find(candidate => (
    candidate.kind !== OP_KIND_BARRIER
    && candidate.ownerId === op.ownerId
    && candidate.saveId === op.saveId
  )) || null;
}

/**
 * A newer covering write may have been enqueued while its predecessor was
 * inflight.  Enqueue cannot recall that request, but once the gate settles a
 * failed/backing-off predecessor is safe to supersede before the newer intent
 * runs.  This is especially load-bearing for a row tombstone following a birth
 * upsert whose response was lost: the delete must not park forever behind the
 * stale create it exists to reverse.
 */
function pruneCoveredPredecessors(op) {
  const index = _ops.indexOf(op);
  if (index <= 0) return;
  const covered = _ops.slice(0, index).filter(candidate => (
    candidate.kind !== OP_KIND_BARRIER
    && candidate.ownerId === op.ownerId
    && candidate.saveId === op.saveId
    && candidate.status !== 'inflight'
    && kindCovers(op.kind, candidate.kind)
  ));
  for (const candidate of covered) pruneOp(candidate);
}

// A kind is a '+'-joined sorted COLUMN set (campaignSliceShared.kindForPartial).
// `newKind` COVERS `oldKind` when every column oldKind writes is also written by
// newKind (oldKind ⊆ newKind) — so a newer op with newKind fully overwrites the
// older op's columns with fresher data, making the older op redundant.
function kindCovers(newKind, oldKind) {
  if (newKind === oldKind) return true;
  if (FULL_ROW_KINDS.has(newKind)) return true;
  if (FULL_ROW_KINDS.has(oldKind)) return false;
  const cols = new Set(newKind ? String(newKind).split('+') : []);
  const old = oldKind ? String(oldKind).split('+') : [];
  return old.length > 0 && old.every(c => cols.has(c));
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
  // Supersede (store-hooks-state-2): drop any non-inflight op for the SAME saveId
  // whose COLUMNS are a subset of this newer op's columns (kindCovers) — the newer
  // write fully overwrites those columns with fresher data, so the older op is
  // redundant, and if it had backed off its stale retry would REVERT this write
  // (the un-delete / map-edit-revert ghost class). The same-key case is the equal-
  // set special case. An op touching a column this one does NOT write (version_history
  // vs data) is NOT covered, so it correctly COEXISTS. An in-flight op can't be
  // recalled — attemptOps' per-save gate makes every same-save newer op WAIT, so
  // last-write-wins holds in enqueue order (the module-header ORDERING GUARANTEE).
  const superseded = _ops.filter(op =>
    op.kind !== OP_KIND_BARRIER && op.saveId === saveId && op.status !== 'inflight' && kindCovers(kind, op.kind));
  if (superseded.length) {
    const drop = new Set(superseded);
    _ops = _ops.filter(op => !drop.has(op));
    // GC each dropped op's payload if no surviving op still references its key
    // (the new op's own key is re-populated below).
    for (const op of superseded) {
      if (op.payloadKey && op.payloadKey !== key && !_ops.some(o => o.payloadKey === op.payloadKey)) {
        delete _payloads[op.payloadKey];
      }
    }
  }

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
    ownerId: _activeOwnerId,
    ownerPending: !_ownerKnown,
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
    ownerId: _activeOwnerId,
    ownerPending: !_ownerKnown,
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
    // A known signed-out session never writes, and an op from an owner that has
    // since been detached never starts under the next account's credentials.
    const ownerCanRun = () => _ownerKnown
      && _activeOwnerId != null
      && op.ownerPending !== true
      && op.ownerId === _activeOwnerId;
    if (!ownerCanRun() || !_ops.includes(op)) return { op, ok: false, ownerMismatch: true };
    pruneCoveredPredecessors(op);
    const predecessor = earlierOpForSameOwnerAndSave(op);
    // A queued/failed predecessor is in retry backoff (or deliberately parked).
    // Do not let this newer op overtake it. An inflight predecessor is handled by
    // the promise gate below, which waits and then runs this op in the same call.
    if (predecessor && predecessor.status !== 'inflight') {
      return { op, ok: false, blockedByPredecessor: true };
    }
    const key = op.payloadKey;
    const inflightKey = inflightKeyFor(op);

    // ── Per-save serialization (the durable "runs after" guarantee) ─────────
    // Wait out any op currently mid-attempt for this owner's same save so a
    // newer partially-overlapping write lands AFTER the older one. Distinct
    // saves never share a gate, so cross-save concurrency remains intact.
    if (inflightKey != null) {
      while (_inflightByKey.has(inflightKey)) {
        try {
          await _inflightByKey.get(inflightKey);
        } catch {
          // Gates normally resolve. A rejected test double still counts as
          // settled, so the successor may re-evaluate ownership and ordering.
        }
      }
      // The op may have been superseded (and pruned) while it waited — a still-
      // newer covering write took over; treat as persisted (that write
      // carries the newest payload and will land).
      if (!_ops.includes(op)) return { op, ok: true };
      if (!ownerCanRun()) return { op, ok: false, ownerMismatch: true };
      // A second caller can be waiting on the very same op. If the first
      // attempt failed, it has already advanced that op onto its retry ladder.
      // Honor that backoff instead of immediately consuming another attempt.
      if (op.status !== 'queued' || op.nextAttemptAt > _clock()) {
        return { op, ok: false, blockedByBackoff: true };
      }
      pruneCoveredPredecessors(op);
      const survivingPredecessor = earlierOpForSameOwnerAndSave(op);
      // The predecessor may have failed into backoff while this op waited on its
      // in-flight gate. It still owns FIFO priority; do not overtake it.
      if (survivingPredecessor) {
        return { op, ok: false, blockedByPredecessor: true };
      }
    }

    let settleGate = () => {};
    if (inflightKey != null) {
      let resolveGate;
      const gate = new Promise(res => { resolveGate = res; });
      _inflightByKey.set(inflightKey, gate);
      settleGate = () => {
        if (_inflightByKey.get(inflightKey) === gate) _inflightByKey.delete(inflightKey);
        resolveGate();
      };
    }

    try {
      const attemptEpoch = _ownerEpoch;
      op.status = 'inflight';
      op.attempts += 1;
      const payload = key != null ? _payloads[key] : undefined;
      let ok;
      try {
        ok = await runner(op, payload);
      } catch {
        ok = false; // runner should be boolean-safe, but never let it reject the pool
      }
      // The request began under the old owner. Its old-owner mirror was already
      // snapshotted as queued during the switch; never prune or rewrite the new
      // owner's in-memory queue when this stale request settles.
      if (attemptEpoch !== _ownerEpoch || !ownerCanRun() || !_ops.includes(op)) {
        return { op, ok: false, ownerMismatch: true };
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
    } finally {
      // Release the save gate LAST — only once this op is fully settled (pruned
      // or parked) may the next same-save op start, so in-flight ordering is exact.
      settleGate();
    }
  });
  commit();
  // A same-save successor may have returned early while its predecessor was
  // inflight. Once this batch settles, schedule the newly-unblocked queue head.
  // Tests without an injected scheduler retain explicit control via drainReady.
  if (_scheduler && readyOps().length > 0) {
    _scheduler(() => {
      drainReady(runner).catch(() => { /* runner is boolean-safe */ });
    }, 0);
  }
  return results;
}

/** Ops eligible for a drain right now (ready, still queued, non-barrier). */
export function readyOps() {
  const now = _clock();
  return _ops.filter((op, index) =>
    op.kind !== OP_KIND_BARRIER
      && op.status === 'queued'
      && op.nextAttemptAt <= now
      && _ownerKnown
      && _activeOwnerId != null
      && op.ownerId === _activeOwnerId
      && op.ownerPending !== true
      // Strict per-owner/save FIFO includes backoff and parked predecessors.
      && !earlierOpForSameOwnerAndSave(op, index),
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

/** Wipe the active queue/mirror and return ownership to unresolved (test reset). */
export function resetOutbox() {
  const keys = mirrorKeys();
  _ops = [];
  _payloads = {};
  _counter = 0;
  _inflightByKey = new Map();
  _activeOwnerId = null;
  _ownerKnown = false;
  _ownerEpoch += 1;
  _memoryByOwner.clear();
  const ls = safeLocalStorage();
  if (ls) {
    try {
      if (keys) {
        ls.removeItem(keys.ops);
        ls.removeItem(keys.payloads);
      }
      scrubLegacyMirror(ls);
    } catch {
      // Reset is also used in storage-hostile tests; memory is already clean.
    }
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
