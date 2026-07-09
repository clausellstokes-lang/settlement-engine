/**
 * campaignSliceShared.js — pure utilities + persistence helpers extracted from
 * campaignSlice (WS4 decomposition, increment 1).
 *
 * These hold no store state: they operate on plain values or on the Immer draft
 * `state` passed in. Extracting them shrinks the campaignSlice megafile and gives
 * future campaign sub-slices a single import home for the shared persistence
 * surface. The module never imports campaignSlice, so there is no cycle.
 */
import { saves as savesService } from '../lib/saves.js';
import { campaigns as campaignService, isCampaignActive } from '../lib/campaigns.js';
import {
  forgetCampaignSync,
  primeCampaignSync,
  syncCampaignChanges,
} from '../lib/campaignSync.js';

export function cloneJson(value) {
  if (value === undefined || value === null) return value;
  // Roadmap P3: structuredClone is materially faster than JSON round-tripping the
  // large (~1.8MB @ 10 members) settlement/campaignState payloads the world-pulse
  // persist path deep-clones. It is native in Node ≥17 and every modern browser
  // (and the vitest node env). We keep a JSON fallback for TWO cases so the exact
  // prior semantics are preserved on every path this helper already served:
  //   1. A runtime without structuredClone (feature-detect).
  //   2. Inputs structuredClone REFUSES to clone — it throws DataCloneError on
  //      Immer draft proxies (several call sites clone a live draft, e.g.
  //      capturePulseSnapshot) and on any function/Symbol-carrying value. JSON
  //      silently drops those; the catch reproduces that exact behaviour.
  // Net: a pure speedup on the common plain-object payloads (the ones actually
  // uploaded), with byte-identical results to before on the draft/exotic paths.
  if (typeof structuredClone === 'function') {
    try {
      return structuredClone(value);
    } catch {
      return JSON.parse(JSON.stringify(value));
    }
  }
  return JSON.parse(JSON.stringify(value));
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

export function findActiveCampaign(campaigns, campaignId) {
  const campaign = campaigns.find(item => item.id === campaignId);
  return isCampaignActive(campaign) ? campaign : null;
}

export function campaignSettlements(state, campaignId) {
  const c = findActiveCampaign(state.campaigns, campaignId);
  if (!c) return [];
  const ids = new Set(c.settlementIds || []);
  return (state.savedSettlements || []).filter(save => ids.has(save.id));
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

export function persistSaveUpdate(saveId, partial) {
  if (!saveId || !partial) return Promise.resolve(true);
  // Still must not rethrow — several callers fire-and-forget, and a rejection
  // here produced unhandled promise rejections. But the failure is no longer
  // SILENT: it used to leave the user seeing success while Supabase drifted from
  // local state (surfacing later as a settlement that "reverts" on reload). Now
  // it reports to the store so the UI can warn. Returns true/false so awaited
  // batch callers can react too.
  return savesService.update(saveId, partial).then(() => true).catch(e => {
    console.warn('[campaignSlice] save update failed', e);
    try { _reportPersistFailure?.(e); } catch { /* reporting must never throw */ }
    return false;
  });
}

// ── World-pulse member-save flush: parallelism + differential persistence ────

// The whole-blob member uploads inside a world-pulse flush are wall-clock-bound
// by Σ(RTT + upload), linear in members. Run them with a small concurrency cap
// rather than strictly sequentially — enough to overlap the RTTs without hammering
// the backend with the full fan-out at large member counts.
const PERSIST_CONCURRENCY = 4;

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
 * Run `worker` over `items` with at most `limit` in flight at once. Every item is
 * processed (each lane pulls the next index until the queue drains) and ALL settle
 * before this resolves — no fail-fast abandonment. `worker` must not throw
 * (persistSaveUpdate never does; it resolves true/false), so one bad item can't
 * reject the batch and skip the rest.
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

/**
 * Flush per-member save updates with bounded parallelism + differential skipping.
 *
 * Seam contract (unchanged): this settles EVERY update (success, reported failure,
 * or differential skip) before the caller runs syncCampaignSnapshot — the snapshot
 * is the commit point and must land after member saves are durable (F2 crash-
 * consistency). Ordering BETWEEN members is incidental, so we overlap them.
 *
 * Failure semantics (unchanged): persistSaveUpdate never throws and reports a
 * failure via campaignSyncError. Every update is still ATTEMPTED (no fail-fast), so
 * the banner ends up set if ANY member failed. A failed member's fingerprint is NOT
 * recorded, so the next flush re-uploads it (a retry is never skipped).
 *
 * Returns a small summary ({ attempted, skipped, failed }) for tests/benchmarks;
 * existing callers ignore it.
 */
export async function persistSaveUpdates(updates = []) {
  const summary = { attempted: 0, skipped: 0, failed: 0 };
  await runWithConcurrency(updates, PERSIST_CONCURRENCY, async (update) => {
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
      return true;
    }
    summary.attempted += 1;
    const ok = await persistSaveUpdate(saveId, partial);
    // Record the fingerprint ONLY on a successful persist — recording on failure
    // would let the retry be differential-skipped, silently dropping the write.
    if (ok && fingerprint != null) lastPersistedFingerprints.set(saveId, fingerprint);
    if (!ok) summary.failed += 1;
    return ok;
  });
  return summary;
}

/**
 * Shared persist tail for the world-pulse mutators (advanceCampaignWorld /
 * applyWorldPulseProposal / recordPartyImpact): flush the per-save updates, then
 * sync the campaign snapshot. Both awaits run only when the mutator produced
 * state. Failures inside persistSaveUpdates surface via campaignSyncError (see
 * persistSaveUpdate). Centralizing the pattern keeps the three call sites honest.
 */
export async function flushWorldPulsePersist({ result, campaignPersist, persistUpdates, campaignId }) {
  if (!(result && campaignPersist)) return;
  await persistSaveUpdates(persistUpdates);
  await syncCampaignSnapshot(campaignPersist.snapshot, campaignId);
}
