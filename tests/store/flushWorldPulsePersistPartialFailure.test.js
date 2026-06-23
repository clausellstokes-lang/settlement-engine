/**
 * flushWorldPulsePersistPartialFailure.test.js — Finding #3 (High).
 *
 * The world-pulse persist tail (flushWorldPulsePersist, shared by
 * advanceCampaignWorld / applyWorldPulseProposal / recordPartyImpact) used to
 * IGNORE the success/failure of each per-settlement save and push the campaign
 * snapshot to the cloud REGARDLESS. On a PARTIAL failure — some settlement writes
 * reject while the campaign + world graph advance — the cloud campaign row moved
 * ahead of a member settlement, so a reload reconstructed a HYBRID timeline.
 *
 * These pins prove the fix:
 *  - persistSaveUpdates now COLLECTS per-update results and returns an explicit
 *    outcome { ok, total, failed }.
 *  - flushWorldPulsePersist does NOT push the campaign snapshot (no campaign
 *    upsert) when any settlement write failed, leaves the campaign cloud-pending,
 *    and surfaces a retryable failure via the persist-failure reporter.
 *  - the all-success path still advances normally (campaign snapshot IS synced).
 *
 * The campaign upsert is the load-bearing assertion: it is the write that, if it
 * lands on a partial failure, produces the hybrid timeline on reload.
 *
 * The INVERSE direction (adversarial-review finding #3) is also pinned here: when
 * every settlement write SUCCEEDS but the campaign upsert itself rejects,
 * flushWorldPulsePersist must NOT re-throw. A throw escapes advanceCampaignWorld
 * (also unwrapped) up to WorldMap, which shows "could not advance" over an
 * already-committed local tick — so the user clicks advance again and the world
 * double-ticks. The guard swallows the rejection and surfaces the same honest,
 * retryable cloud-pending banner instead.
 */
import { beforeEach, describe, expect, test, vi } from 'vitest';

vi.mock('../../src/lib/saves.js', () => ({
  saves: { update: vi.fn() },
}));

// Real campaignSync, but a controllable campaign service. syncCampaignSnapshot →
// syncCampaignChanges → service.upsert is the cloud campaign write we watch.
vi.mock('../../src/lib/campaigns.js', () => ({
  isCampaignActive: campaign => (campaign?.accessState || 'active') === 'active',
  campaigns: {
    upsert: vi.fn(campaign => Promise.resolve(campaign?.id)),
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

describe('flushWorldPulsePersist guards the campaign snapshot on partial failure', () => {
  test('a PARTIAL settlement failure does NOT push the campaign snapshot and surfaces a retryable failure', async () => {
    const report = vi.fn();
    initPersistFailureReporter(report);
    saves.update
      .mockResolvedValueOnce(undefined)             // ashford lands
      .mockRejectedValueOnce(new Error('network')); // barrow fails

    const out = await flushWorldPulsePersist({
      result: { ok: true, tick: 1 },
      campaignPersist: { snapshot: advancedSnapshot(1) },
      persistUpdates: updates,
      campaignId: CAMPAIGN_ID,
    });

    // The campaign was NOT advanced in the cloud — no hybrid timeline on reload.
    expect(campaignService.upsert).not.toHaveBeenCalled();
    // Honest, retryable failure surfaced to the UI banner.
    expect(out.ok).toBe(false);
    expect(out.campaignSynced).toBe(false);
    expect(out.savesFailed).toBe(1);
    expect(report).toHaveBeenCalled();
  });

  test('the all-success path still advances the campaign (snapshot IS synced)', async () => {
    const report = vi.fn();
    initPersistFailureReporter(report);
    saves.update.mockResolvedValue(undefined);

    const out = await flushWorldPulsePersist({
      result: { ok: true, tick: 1 },
      campaignPersist: { snapshot: advancedSnapshot(1) },
      persistUpdates: updates,
      campaignId: CAMPAIGN_ID,
    });

    // Both members saved, so the campaign snapshot was pushed to the cloud.
    expect(saves.update).toHaveBeenCalledTimes(2);
    expect(campaignService.upsert).toHaveBeenCalledTimes(1);
    expect(out).toEqual({ ok: true, savesFailed: 0, campaignSynced: true });
    expect(report).not.toHaveBeenCalled();
  });

  test('INVERSE: all settlements succeed but the campaign upsert rejects — does NOT throw, surfaces a retryable failure (double-advance guard)', async () => {
    const report = vi.fn();
    initPersistFailureReporter(report);
    saves.update.mockResolvedValue(undefined);                         // every settlement lands
    campaignService.upsert.mockRejectedValueOnce(new Error('campaign upsert rejected'));

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

    // Both members saved (the inverse of the forward case) and the campaign upsert
    // WAS attempted — it just rejected.
    expect(saves.update).toHaveBeenCalledTimes(2);
    expect(campaignService.upsert).toHaveBeenCalledTimes(1);
    // The rejection became an honest cloud-pending banner, not a thrown advance error.
    expect(out.ok).toBe(false);
    expect(out.campaignSynced).toBe(false);
    expect(out.savesFailed).toBe(0);
    expect(report).toHaveBeenCalled();
  });

  test('a no-op (no result/snapshot) neither saves nor syncs', async () => {
    saves.update.mockResolvedValue(undefined);
    const out = await flushWorldPulsePersist({
      result: null,
      campaignPersist: null,
      persistUpdates: updates,
      campaignId: CAMPAIGN_ID,
    });
    expect(saves.update).not.toHaveBeenCalled();
    expect(campaignService.upsert).not.toHaveBeenCalled();
    expect(out.ok).toBe(true);
    expect(out.campaignSynced).toBe(false);
  });
});
