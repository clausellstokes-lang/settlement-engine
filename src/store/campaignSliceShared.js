/**
 * campaignSliceShared.js — pure utilities + persistence helpers extracted from
 * campaignSlice (WS4 decomposition, increment 1).
 *
 * These hold no store state: they operate on plain values or on the Immer draft
 * `state` passed in. Extracting them shrinks the campaignSlice megafile and gives
 * future campaign sub-slices a single import home for the shared persistence
 * surface. The module never imports campaignSlice, so there is no cycle.
 */
import { deepClone } from '../domain/clone.js';
import { saves as savesService } from '../lib/saves.js';
import { campaigns as campaignService, isCampaignActive } from '../lib/campaigns.js';
import {
  forgetCampaignSync,
  primeCampaignSync,
  syncCampaignChanges,
} from '../lib/campaignSync.js';
import {
  enqueue as outboxEnqueue,
  enqueueBarrier,
  attemptOps,
  resolveBarrier,
  drainReady,
  reviveAllPending,
  loadMirror,
  setOutboxScheduler,
  OP_KIND_BARRIER,
} from './outbox.js';

export function cloneJson(value) {
  if (value === undefined || value === null) return value;
  // P3.1 clone-seam centralization: delegate to the SINGLE sanctioned seam
  // (domain/clone.js `deepClone`) instead of hand-rolling structuredClone + a JSON
  // fallback here. deepClone is structuredClone-primary with a DataCloneError-only
  // JSON fallback — the exact behaviour this helper needs for the large (~1.8MB @ 10
  // members) settlement/campaignState payloads and for the Immer draft proxies /
  // function-carrying values several call sites (e.g. capturePulseSnapshot) clone.
  // The name + null short-circuit stay so callers are untouched; the bare
  // hand-rolled JSON round-trip leaves the store tree (deepCloneHotPath lint).
  return deepClone(value);
}

/** Unique, sorted channel-type enums from an array of regional impacts. */
export function channelTypesFromImpacts(impacts) {
  const set = new Set();
  for (const impact of Array.isArray(impacts) ? impacts : []) {
    const t = impact?.channelType;
    if (typeof t === 'string' && t) set.add(t);
  }
  return [...set].sort();
}

export function newCampaignId() {
  try {
    if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID();
  } catch {
    // Fallback below.
  }
  // RFC-4122 v4-SHAPED fallback for browsers without crypto.randomUUID. It MUST
  // satisfy isUuid(): a non-UUID id churns identity — migrateCampaign remints it
  // and rowForCampaign omits a non-UUID id on upsert, so every reload mints a
  // fresh duplicate cloud row. Random-filled (not timestamp-only) to stay
  // collision-resistant under rapid creation.
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, ch => {
    const r = (Math.random() * 16) | 0;
    return (ch === 'x' ? r : (r & 0x3) | 0x8).toString(16);
  });
}

export function isUuid(value) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(String(value || ''));
}

/**
 * DETERMINISTIC v4-shaped UUID derived from a legacy (non-UUID) campaign id.
 *
 * WHY: migrateCampaign remints a non-UUID id (rowForCampaign omits non-UUID ids
 * on upsert). loadCampaigns runs migrateCampaign SEPARATELY over the local cache
 * and the remote list, so a random newCampaignId() gave the SAME legacy campaign
 * two different UUIDs — mergeCampaignLists (keyed by id) then could not dedupe the
 * two copies and yielded a duplicate row. Deriving the new id as a pure function
 * of the legacy id makes both copies converge on ONE id, so the merge dedupes.
 *
 * The output satisfies isUuid(): version nibble forced to 4, variant nibble to
 * 8..b. 128 bits from four independent FNV-1a passes over salted copies of the
 * source keep distinct legacy ids collision-resistant. Callers pass a NON-EMPTY
 * source (an empty/missing id can't identify a copy to dedupe against — those keep
 * the random newCampaignId() so genuinely-distinct id-less campaigns never
 * collapse into one).
 * @param {string|number} source the legacy id
 * @returns {string} a stable v4-shaped UUID
 */
export function uuidFromLegacyId(source) {
  const str = String(source == null ? '' : source);
  let hex = '';
  for (let salt = 0; salt < 4; salt++) {
    let h = (0x811c9dc5 ^ salt) >>> 0;
    const s = `${salt}:${str}`;
    for (let i = 0; i < s.length; i++) {
      h ^= s.charCodeAt(i);
      h = Math.imul(h, 0x01000193);
    }
    hex += (h >>> 0).toString(16).padStart(8, '0');
  }
  // hex is 32 hex chars. Force the UUID v4 shape (isUuid-valid): version '4',
  // variant ∈ 8..b. The remaining nibbles are the derived hash.
  const variant = ((parseInt(hex[16], 16) & 0x3) | 0x8).toString(16);
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-4${hex.slice(13, 16)}-${variant}${hex.slice(17, 20)}-${hex.slice(20, 32)}`;
}

export function findActiveCampaign(campaigns, campaignId) {
  const campaign = campaigns.find(item => item.id === campaignId);
  return isCampaignActive(campaign) ? campaign : null;
}

export function campaignSettlements(state, campaignId) {
  const c = findActiveCampaign(state.campaigns, campaignId);
  if (!c) return [];
  // String-normalized membership (signed W6 misc verdict, Owner Ruling #5
  // blanket 2026-07-17): settlement ids are an acknowledged number/string mix
  // (cloud rows return numeric ids; local saves mint strings). This resolver
  // feeds every world-pulse advance its member saves — the old exact-match
  // Set silently dropped mismatched members from the pulse. Matches the
  // isSettlementClockBound / applyEvent membership scans.
  const ids = new Set((c.settlementIds || []).map(String));
  return (state.savedSettlements || []).filter(save => ids.has(String(save.id)));
}

export function campaignCacheOwner(state) {
  return state?.auth?.user?.id ? String(state.auth.user.id) : 'anon';
}

export function localWrite(campaigns, ownerId = 'anon') {
  try {
    campaignService.cache(campaigns, ownerId);
  } catch (e) {
    // Likely quota exceeded — FMG snapshots can be large (~1MB). The caller
    // should already have warned via canSaveSnapshot(); log and continue.
    console.warn('[campaignSlice] localStorage write failed', e);
  }
}

export function persistCampaigns(campaigns, changedId = null, ownerId = 'anon', options = {}) {
  const snapshot = cloneJson(campaigns) || [];
  localWrite(snapshot, ownerId);
  const sync = syncCampaignChanges(snapshot, { service: campaignService, changedId });
  if (options.strict) return sync;
  sync.catch(e => {
    console.warn('[campaignSlice] campaign cloud sync failed', e);
  });
  return sync;
}

export function persistCampaignState(state, changedId = null, options = {}) {
  return persistCampaigns(state.campaigns, changedId, campaignCacheOwner(state), options);
}

export function cacheCampaignState(state) {
  const ownerId = campaignCacheOwner(state);
  const snapshot = cloneJson(state.campaigns) || [];
  localWrite(snapshot, ownerId);
  return { ownerId, snapshot };
}

export function syncCampaignSnapshot(snapshot, changedId) {
  return syncCampaignChanges(snapshot, { service: campaignService, changedId });
}

export function deletePersistedCampaign(id, campaigns, ownerId = 'anon') {
  const snapshot = cloneJson(campaigns) || [];
  localWrite(snapshot, ownerId);
  forgetCampaignSync(id);
  if (!campaignService.isConfigured) return;
  // Record a deletion tombstone BEFORE the async cloud delete. mergeCampaignLists
  // reads it (at list()-resolve time) so an in-flight load or a stale cache copy
  // can't resurrect the campaign while the cloud delete is still propagating.
  campaignService.recordTombstone(id, ownerId);
  campaignService.delete(id).catch(e => {
    console.warn('[campaignSlice] campaign cloud delete failed', e);
  });
}

export function deletePersistedCampaignState(state, id) {
  return deletePersistedCampaign(id, state.campaigns, campaignCacheOwner(state));
}

export function clearCampaignSyncBookkeeping() {
  primeCampaignSync([]);
}

// Set by campaignSlice via initPersistFailureReporter so this module-scoped
// helper can report a failed cloud save into store state (the UI then warns).
let _reportPersistFailure = null;

/** Wire the store-state failure reporter (called once from createCampaignSlice). */
export function initPersistFailureReporter(fn) {
  _reportPersistFailure = fn;
}

// The persist-partial key -> DB COLUMN map (saves.js supabaseUpdate). `timestamp`
// is deliberately ABSENT — supabaseUpdate has NO timestamp column, so it must not
// perturb the op kind (store-hooks-state-2). Any unmapped key falls back to itself
// so it still gates against same-named keys and is never merged with a real column.
const COLUMN_FOR_PARTIAL_KEY = Object.freeze({
  settlement: 'data', campaignState: 'campaign_state', versionHistory: 'version_history',
  aiData: 'ai_data', name: 'name', tier: 'tier', config: 'config', seed: 'seed',
});

/**
 * The op "kind" is the sorted set of DB COLUMNS the partial writes — NOT its raw
 * keys. Keying on columns (a) collapses ops that touch the SAME columns even when a
 * NON-persisted key like `timestamp` perturbs the raw-key set (destroy
 * {campaignState,settlement,timestamp} and applyEvent {campaignState,settlement}
 * both write {campaign_state,data}, so the newer destroy now supersedes a
 * backed-off applyEvent instead of racing it → no un-delete resurrection), and
 * (b) lets outbox.enqueue's subset-supersede drop an older op whose columns a
 * newer op fully overwrites (e.g. a map-edit {data} superseded by a later
 * applyEvent {campaign_state,data}). A write to a column this op does NOT touch
 * (version_history vs data) is still a distinct kind, so it correctly COEXISTS.
 */
function kindForPartial(partial) {
  const columns = new Set();
  for (const k of Object.keys(partial)) {
    if (partial[k] === undefined) continue;
    if (k === 'timestamp') continue; // not a DB column — must never perturb the kind
    columns.add(COLUMN_FOR_PARTIAL_KEY[k] || k);
  }
  return [...columns].sort().join('+') || 'empty';
}

/**
 * The single outbox runner: performs the actual cloud write, reports a failure
 * into the store (campaignSyncError — the load-bearing never-silent contract),
 * and records the differential fingerprint on a successful MEMBER flush. Used by
 * every drain path (first attempt, background retry, Retry affordance, boot
 * replay) so all four behave identically.
 *
 * @param {{ saveId: string, kind: string, payloadFingerprint: string|null, differential: boolean }} op
 * @param {any} payload
 */
async function outboxRunner(op, payload) {
  if (op.kind === OP_KIND_BARRIER) return true;
  let ok;
  try {
    await savesService.update(op.saveId, payload);
    ok = true;
  } catch (e) {
    // Never rethrow — callers fire-and-forget, and the pool must not reject.
    // Not SILENT either: report so the UI warns (the chip / banner).
    console.warn('[campaignSlice] save update failed', e);
    try { _reportPersistFailure?.(e); } catch { /* reporting must never throw */ }
    ok = false;
  }
  // Differential cache: record ONLY on success, so an identical next flush skips
  // the upload and a FAILED one re-uploads (never differential-skips a retry).
  if (ok && op.differential && op.payloadFingerprint != null) {
    lastPersistedFingerprints.set(op.saveId, op.payloadFingerprint);
  }
  return ok;
}

/**
 * Persist a single save update through the durable outbox — SAME signature and
 * SAME never-throws contract as before, so zero call sites change.
 *
 * The op is mirrored to localStorage (it survives a tab close), then attempted
 * once now; the awaited result is that first attempt's outcome (true/false), so
 * awaiting callers (e.g. the regional ordered-write gate) see exactly what they
 * saw before. A failed op backs off and retries in the background / on Retry /
 * on next boot — the caller is never blocked on retries.
 */
export function persistSaveUpdate(saveId, partial) {
  if (!saveId || !partial) return Promise.resolve(true);
  const op = outboxEnqueue({
    saveId,
    kind: kindForPartial(partial),
    payload: partial,
    fingerprint: fingerprintPersistPartial(partial),
    differential: false,
  });
  return attemptOps([op], outboxRunner)
    .then(results => !!(results[0] && results[0].ok))
    .catch(() => false);
}

// ── World-pulse member-save flush: parallelism + differential persistence ────

// FNV-1a 32-bit + length — the exact idiom campaignSync.js uses for its snapshot
// fingerprint. Fast, dependency-free, single pass; collisions are astronomically
// unlikely for change detection (the length prefix guards the trivial cases).
function hashText(text) {
  let h = 0x811c9dc5;
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return `${text.length}:${(h >>> 0).toString(36)}`;
}

// saveId → fingerprint of the LAST SUCCESSFULLY-PERSISTED payload. Session-scoped
// and correct as such: a MISS (empty after reload, or first write) just costs one
// redundant upload; a STALE HIT is impossible because the fingerprint is taken over
// the exact {settlement, campaignState, versionHistory} bytes we hand to the cloud —
// if any bit of the payload changed (including a lone campaignState.worldTick stamp
// on an otherwise-untouched member), the fingerprint changes and the upload runs.
const lastPersistedFingerprints = new Map();

/** Test/lifecycle hook: drop the differential cache so a fresh flush re-uploads. */
export function clearPersistFingerprintCache() {
  lastPersistedFingerprints.clear();
}

function fingerprintPersistPartial(partial) {
  return hashText(JSON.stringify(partial));
}

/**
 * Flush per-member save updates through the outbox with bounded parallelism +
 * differential skipping.
 *
 * Seam contract (unchanged): this settles EVERY member's first attempt (success,
 * reported failure, or differential skip) before the caller runs
 * syncCampaignSnapshot — the snapshot is the commit point and must land after
 * member saves are attempted (F2 crash-consistency). Ordering BETWEEN members is
 * incidental, so the WS31 pool (cap 4) overlaps them; a trailing BARRIER op marks
 * the members-before-snapshot boundary in the durable mirror.
 *
 * Failure semantics (unchanged): the runner never throws and reports a failure
 * via campaignSyncError. Every non-skipped member is still ATTEMPTED (no fail-
 * fast), so the banner/chip ends up set if ANY member failed. A failed member's
 * fingerprint is NOT recorded, so the next flush re-uploads it (a retry is never
 * differential-skipped) — AND the op stays in the outbox to retry on its own.
 *
 * Returns a small summary ({ attempted, skipped, failed }) for tests/benchmarks;
 * existing callers ignore it.
 */
export async function persistSaveUpdates(updates = []) {
  const summary = { attempted: 0, skipped: 0, failed: 0 };
  const enqueued = [];
  for (const update of updates) {
    const partial = {
      settlement: update.settlement,
      campaignState: update.campaignState,
      versionHistory: update.versionHistory,
    };
    const saveId = update.saveId;
    const fingerprint = saveId ? fingerprintPersistPartial(partial) : null;
    // Differential skip: the exact payload already reached the cloud this session.
    if (fingerprint != null && lastPersistedFingerprints.get(saveId) === fingerprint) {
      summary.skipped += 1;
      continue;
    }
    if (!saveId) {
      // No id — nothing to persist; a no-op that still counts as attempted, exactly
      // as the pre-outbox persistSaveUpdate(null, …) resolve-true path did.
      summary.attempted += 1;
      continue;
    }
    enqueued.push(outboxEnqueue({
      saveId,
      kind: kindForPartial(partial),
      payload: partial,
      fingerprint,
      differential: true,
    }));
  }
  const barrier = enqueueBarrier();
  const results = await attemptOps(enqueued, outboxRunner);
  // Members' first attempts have all settled (none inflight) → release the
  // barrier so the caller may commit the snapshot.
  resolveBarrier(barrier);
  for (const res of results) {
    summary.attempted += 1;
    if (!res.ok) summary.failed += 1;
  }
  return summary;
}

/**
 * Shared persist tail for the world-pulse mutators (advanceCampaignWorld /
 * applyWorldPulseProposal / recordPartyImpact): flush the per-save updates, then
 * sync the campaign snapshot. Both awaits run only when the mutator produced
 * state. persistSaveUpdates settles every member's first attempt (past the
 * barrier) before this returns, so the snapshot never jumps ahead of the members.
 */
export async function flushWorldPulsePersist({ result, campaignPersist, persistUpdates, campaignId }) {
  if (!(result && campaignPersist)) return;
  await persistSaveUpdates(persistUpdates);
  await syncCampaignSnapshot(campaignPersist.snapshot, campaignId);
}

/**
 * Retry affordance (chip's Retry): revive every parked op (reset attempts) and
 * re-drain. Resolves to the drain results. Never throws.
 */
export function retryOutboxPersist() {
  reviveAllPending();
  return drainReady(outboxRunner).catch(() => []);
}

/**
 * Boot replay: wire the background retry scheduler and re-drain whatever the
 * localStorage mirror survived from a prior (possibly dead) tab against the
 * local payload cache. Called once at store init (alongside initAuth).
 */
export function initOutbox() {
  // Production backoff scheduler. Tests leave this unset, so no stray timer
  // fires — parked ops are re-attempted only on explicit Retry / boot replay.
  setOutboxScheduler((fn, delayMs) => {
    try {
      if (typeof setTimeout === 'function') setTimeout(fn, delayMs);
    } catch { /* no timer host */ }
  });
  loadMirror();
  return drainReady(outboxRunner).catch(() => []);
}
