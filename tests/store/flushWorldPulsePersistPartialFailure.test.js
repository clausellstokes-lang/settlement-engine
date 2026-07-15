/**
 * flushWorldPulsePersistPartialFailure.test.js — Finding #3 (High), round-3 rewire.
 *
 * persistSaveUpdates still COLLECTS per-update results into { ok, total, failed }
 * (it is retained as the LOCAL-mode persist helper) — those unit pins remain.
 *
 * The cloud persist tail (flushWorldPulsePersist) was rewired in round-3: the whole
 * world-pulse advance write-set (every member settlement + the campaign snapshot)
 * now goes through ONE atomic persist_world_pulse_advance RPC (migration 069), not
 * N serial settlement upserts plus a separate campaign upsert. So the old forward
 * (partial-settlement) and inverse (campaign-upsert) failure modes collapse into a
 * single failure mode: the one transaction commits the whole advance or rolls it
 * ALL back — the cloud can never go hybrid.
 *
 * These pins now prove:
 *  - the cloud path calls the atomic RPC (NOT the serial upsert/save loop);
 *  - an RPC rejection leaves the campaign cloud-pending, surfaces a retryable
 *    failure via the persist-failure reporter, and does NOT re-throw (a throw would
 *    escape advanceCampaignWorld to WorldMap's "could not advance" over an
 *    already-committed local tick, inviting a double advance);
 *  - the happy path returns campaignSynced:true with no reported failure.
 */
import { beforeEach, describe, expect, test, vi } from 'vitest';

vi.mock('../../src/lib/saves.js', () => ({
  saves: { update: vi.fn() },
}));

// Controllable campaign service. The cloud path now calls persistWorldPulseAdvance
// (the atomic RPC); upsert is kept on the mock to prove the serial path is NOT used.
vi.mock('../../src/lib/campaigns.js', () => ({
  isCampaignActive: campaign => (campaign?.accessState || 'active') === 'active',
  campaigns: {
    upsert: vi.fn(campaign => Promise.resolve(campaign?.id)),
    persistWorldPulseAdvance: vi.fn(() => Promise.resolve({ applied: true, settlementsWritten: 2, settlementsRequested: 2 })),
    cache: vi.fn(),
    isConfigured: true,
  },
}));

import { saves } from '../../src/lib/saves.js';
import { campaigns as campaignService } from '../../src/lib/campaigns.js';
import { primeCampaignSync } from '../../src/lib/campaignSync.js';
import {
  persistSaveUpdates,
  flushWorldPulsePersist,
  initPersistFailureReporter,
} from '../../src/store/campaignSliceShared.js';

const CAMPAIGN_ID = 'camp-1';

// A campaign snapshot whose signature differs from anything primed, so
// syncCampaignChanges treats it as needing an upsert (it would, absent the guard).
function advancedSnapshot(tick) {
  return [{
    id: CAMPAIGN_ID,
    name: 'Realm',
    accessState: 'active',
    settlementIds: ['ashford'],
    worldState: { tick },
  }];
}

const updates = [
  { saveId: 'ashford', settlement: { name: 'Ashford' }, campaignState: { tick: 5 } },
  { saveId: 'barrow', settlement: { name: 'Barrow' }, campaignState: { tick: 5 } },
];

beforeEach(() => {
  vi.clearAllMocks();
  initPersistFailureReporter(null);
  // Prime with a PRIOR (tick 0) snapshot so the advanced snapshot looks changed.
  primeCampaignSync(advancedSnapshot(0));
});

describe('persistSaveUpdates collects per-update outcomes', () => {
  test('all-success returns ok with zero failures', async () => {
    saves.update.mockResolvedValue(undefined);
    const outcome = await persistSaveUpdates(updates);
    expect(outcome).toEqual({ ok: true, total: 2, failed: 0 });
  });

  test('a single rejected settlement write makes the batch NOT ok', async () => {
    saves.update
      .mockResolvedValueOnce(undefined)           // ashford lands
      .mockRejectedValueOnce(new Error('network')); // barrow fails
    const outcome = await persistSaveUpdates(updates);
    expect(outcome.ok).toBe(false);
    expect(outcome.failed).toBe(1);
    expect(outcome.total).toBe(2);
  });
});

describe('flushWorldPulsePersist routes the cloud advance through the atomic RPC', () => {
  test('the whole write-set goes through persist_world_pulse_advance (NOT the serial upsert/save loop)', async () => {
    const report = vi.fn();
    initPersistFailureReporter(report);

    const out = await flushWorldPulsePersist({
      result: { ok: true, tick: 1 },
      campaignPersist: { snapshot: advancedSnapshot(1) },
      persistUpdates: updates,
      campaignId: CAMPAIGN_ID,
    });

    // ONE atomic call carried the whole advance — no serial settlement updates and
    // no separate campaign upsert (the two writes that could go hybrid).
    expect(campaignService.persistWorldPulseAdvance).toHaveBeenCalledTimes(1);
    expect(saves.update).not.toHaveBeenCalled();
    expect(campaignService.upsert).not.toHaveBeenCalled();
    // The RPC received the campaign snapshot, the settlement write-set, and the tick.
    const arg = campaignService.persistWorldPulseAdvance.mock.calls[0][0];
    expect(arg.campaignId).toBe(CAMPAIGN_ID);
    expect(arg.campaign?.id).toBe(CAMPAIGN_ID);
    expect(arg.settlementUpdates).toEqual(updates);
    expect(arg.expectedTick).toBe(1);
    expect(out).toEqual({ ok: true, savesFailed: 0, campaignSynced: true });
    expect(report).not.toHaveBeenCalled();
  });

  test('an atomic-RPC rejection leaves the campaign cloud-pending, reports the failure, and does NOT throw (double-advance guard)', async () => {
    const report = vi.fn();
    initPersistFailureReporter(report);
    campaignService.persistWorldPulseAdvance.mockRejectedValueOnce(new Error('atomic advance rejected'));

    // Load-bearing: this MUST resolve, not reject. A rejection would propagate out
    // of advanceCampaignWorld to WorldMap's "could not advance" toast — over a tick
    // already committed and cached locally in Phase 2 — and the user re-advances,
    // double-ticking the world. So we assert the call resolves rather than throws.
    const out = await flushWorldPulsePersist({
      result: { ok: true, tick: 1 },
      campaignPersist: { snapshot: advancedSnapshot(1) },
      persistUpdates: updates,
      campaignId: CAMPAIGN_ID,
    });

    // The DB rolled the WHOLE write-set back, so no member is ahead of the campaign.
    expect(campaignService.persistWorldPulseAdvance).toHaveBeenCalledTimes(1);
    expect(out.ok).toBe(false);
    expect(out.campaignSynced).toBe(false);
    expect(out.savesFailed).toBe(0);
    expect(report).toHaveBeenCalled();
  });

  test('a FORWARD-advance stale_tick no-op (applied:false) surfaces a conflict, not a silent success', async () => {
    const report = vi.fn();
    initPersistFailureReporter(report);
    // A forward advance (backward falsy) whose guard returns applied:false means the
    // cloud already advanced to/past this tick — a CONCURRENT same-tick advance won the
    // race. THIS write did NOT land, so it must be surfaced as a conflict (cloud-pending
    // + reported failure) so the caller can warn + reload, NOT reported as success that
    // silently drops this tab's locally-advanced world on reload.
    campaignService.persistWorldPulseAdvance.mockResolvedValueOnce({ applied: false, reason: 'stale_tick' });

    const out = await flushWorldPulsePersist({
      result: { ok: true, tick: 1 },
      campaignPersist: { snapshot: advancedSnapshot(1) },
      persistUpdates: updates,
      campaignId: CAMPAIGN_ID,
    });

    expect(out.ok).toBe(false);
    expect(out.conflict).toBe(true);
    expect(out.campaignSynced).toBe(false);
    expect(report).toHaveBeenCalled();
  });

  test('a BACKWARD/non-advancing stale_tick no-op (applied:false) is still cloud-coherent success (last-write-wins preserved)', async () => {
    const report = vi.fn();
    initPersistFailureReporter(report);
    // The undo / apply-proposal / record-party-impact path passes backward:true
    // (expectedTick=null, so the guard is skipped); an applied:false there can only
    // mean an id-keyed retry already landed coherently — success, no conflict. This
    // proves the conflict surfacing does NOT regress the last-write-wins path.
    campaignService.persistWorldPulseAdvance.mockResolvedValueOnce({ applied: false, reason: 'stale_tick' });

    const out = await flushWorldPulsePersist({
      result: { ok: true, tick: 1 },
      campaignPersist: { snapshot: advancedSnapshot(1) },
      persistUpdates: updates,
      campaignId: CAMPAIGN_ID,
      backward: true,
    });

    expect(out).toEqual({ ok: true, savesFailed: 0, campaignSynced: true });
    expect(report).not.toHaveBeenCalled();
  });

  test('a no-op (no result/snapshot) neither saves nor syncs', async () => {
    const out = await flushWorldPulsePersist({
      result: null,
      campaignPersist: null,
      persistUpdates: updates,
      campaignId: CAMPAIGN_ID,
    });
    expect(saves.update).not.toHaveBeenCalled();
    expect(campaignService.persistWorldPulseAdvance).not.toHaveBeenCalled();
    expect(campaignService.upsert).not.toHaveBeenCalled();
    expect(out.ok).toBe(true);
    expect(out.campaignSynced).toBe(false);
  });
});
