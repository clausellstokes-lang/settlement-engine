/**
 * campaignCanonRelationshipSession — the LAZY body of the Lane-2
 * ([domain-events-region-1]) non-party canon relationship ripple + its undo
 * reversal, split out of campaignWorldPulseSlice under the FP-2a dep-import
 * pattern (mirroring canonizeCampaignWorldSpatial → campaignSpatialCanonize.js).
 *
 * WHY A SEPARATE LAZY CHUNK: this module pulls the relationship applier
 * (worldPulse/canonRelationshipImpact.js → the relationshipState constructor +
 * region channel-bundle sync) that the first-paint budget deliberately keeps out
 * of the entry closure. The eager slice methods (recordCanonRelationshipRipple /
 * reverseCanonRelationshipRipple) keep only their SYNC-PREFIX guards and
 * dynamic-import this body, so NONE of the heavy relationship machinery reaches
 * first paint. Reached only on the first DM canon relationship event / its undo.
 *
 * Both bodies take `{ set, get, ... }` (the store's Immer set + getter) and
 * persist exactly like the recordPartyImpact path: mutate the campaign's
 * worldState + regionalGraph on the draft, cache, and sync the snapshot.
 */

import { ensureWorldState } from '../domain/worldPulse/worldState.js';
import { ensureRegionalGraph } from '../domain/region/index.js';
import { applyCanonRelationshipEvent, reverseCanonRelationshipEvent } from '../domain/worldPulse/canonRelationshipImpact.js';
import {
  cloneJson, cacheCampaignState, findActiveCampaign, syncCampaignSnapshot,
} from './campaignSliceShared.js';

/**
 * Forward: land a NON-party canon relationship event on the campaign's pulse edge.
 * ORPHAN GUARD: if the triggering event was already undone (a sync undoLastEvent
 * raced ahead of this async ripple), skip — the undo already restored the
 * pre-ripple edge, so landing the ripple now would orphan it.
 *
 * `now` is the pinNow injection seam (temporal-architecture leg 2, TEMPORAL_AUDIT
 * §1): resolve the wall clock ONCE at this session entry, honouring an injected
 * `now` (a test pins determinism; the drain-path parity replay threads the
 * advance's tick clock so a clock-bound member's relationship verb lands the pulse
 * edge deterministically at the tick) and falling back to a fresh boundary read.
 * Mirrors campaignAdvanceSession's options.now seam — determinism no longer
 * depends on call-site wall-clock discipline.
 *
 * @param {{ set: Function, campaignId: string, event: any, homeId: string|number, now?: string|null }} args
 */
export async function runRecordCanonRelationshipRipple({ set, campaignId, event, homeId, now: nowArg = null }) {
  let result = /** @type {any} */ (null);
  let campaignPersist = /** @type {any} */ (null);
  const now = nowArg || new Date().toISOString();
  set((/** @type {any} */ state) => {
    const c = findActiveCampaign(state.campaigns, campaignId);
    if (!c) return;
    const activeLog = String(state.activeSaveId) === String(homeId)
      ? (state.eventLog || [])
      : ((state.savedSettlements.find((/** @type {any} */ s) => String(s.id) === String(homeId))?.campaignState?.eventLog) || []);
    if (!activeLog.some((/** @type {any} */ e) => e?.event?.id === event.id)) return;
    result = applyCanonRelationshipEvent({ campaign: cloneJson(c), event, homeId, now });
    if (!result) return;
    c.worldState = ensureWorldState(result.worldState, c);
    c.regionalGraph = ensureRegionalGraph(result.regionalGraph, { now });
    c.updatedAt = now;
    campaignPersist = cacheCampaignState(state);
  });
  if (result && campaignPersist) {
    await syncCampaignSnapshot(campaignPersist.snapshot, campaignId);
  }
  return result;
}

/**
 * Reverse: restore the campaign's pre-ripple pulse edge from the undo snapshot
 * applyEvent stamped on logEntry.undo.relationshipRipple.
 *
 * `now` is the same pinNow injection seam as the forward (temporal-architecture
 * leg 2): the reverse re-stamps the relabelled edge's updatedAt, so an injected
 * `now` keeps the restore deterministic; absent, it reads a fresh boundary clock.
 *
 * @param {{ set: Function, campaignId: string, snapshot: any, now?: string|null }} args
 */
export async function runReverseCanonRelationshipRipple({ set, campaignId, snapshot, now: nowArg = null }) {
  let result = /** @type {any} */ (null);
  let campaignPersist = /** @type {any} */ (null);
  const now = nowArg || new Date().toISOString();
  set((/** @type {any} */ state) => {
    const c = findActiveCampaign(state.campaigns, campaignId);
    if (!c) return;
    result = reverseCanonRelationshipEvent({ campaign: cloneJson(c), snapshot, now });
    if (!result) return;
    c.worldState = ensureWorldState(result.worldState, c);
    c.regionalGraph = ensureRegionalGraph(result.regionalGraph, { now });
    c.updatedAt = now;
    campaignPersist = cacheCampaignState(state);
  });
  if (result && campaignPersist) {
    await syncCampaignSnapshot(campaignPersist.snapshot, campaignId);
  }
  return result;
}
