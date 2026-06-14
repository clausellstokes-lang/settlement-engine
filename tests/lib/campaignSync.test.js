import { describe, expect, test } from 'vitest';

import {
  campaignSignature,
  getCampaignsNeedingSync,
  mergeCampaignLists,
  primeCampaignSync,
  reconcileTombstones,
  syncCampaignChanges,
} from '../../src/lib/campaignSync.js';

describe('campaign sync policy', () => {
  test('merge keeps local-only campaigns when remote campaigns load', () => {
    const merged = mergeCampaignLists(
      [{ id: 'local-only', name: 'Local Draft', updatedAt: '2024-03-05T00:00:00Z' }],
      [{ id: 'remote-only', name: 'Cloud Realm', updatedAt: '2024-03-04T00:00:00Z' }],
    );

    expect(merged.map(campaign => campaign.id)).toEqual(['local-only', 'remote-only']);
  });

  test('merge chooses the freshest copy when local and remote share an id', () => {
    expect(mergeCampaignLists(
      [{ id: 'camp-1', name: 'Local Old', updatedAt: '2024-03-01T00:00:00Z' }],
      [{ id: 'camp-1', name: 'Remote New', updatedAt: '2024-03-02T00:00:00Z' }],
    )[0].name).toBe('Remote New');

    expect(mergeCampaignLists(
      [{ id: 'camp-1', name: 'Local New', updatedAt: '2024-03-03T00:00:00Z' }],
      [{ id: 'camp-1', name: 'Remote Old', updatedAt: '2024-03-02T00:00:00Z' }],
    )[0].name).toBe('Local New');
  });

  test('server retention state remains authoritative over fresher cached content', () => {
    const [merged] = mergeCampaignLists(
      [{
        id: 'camp-1',
        name: 'Local New',
        updatedAt: '2024-03-03T00:00:00Z',
        accessState: 'active',
      }],
      [{
        id: 'camp-1',
        name: 'Remote Old',
        updatedAt: '2024-03-02T00:00:00Z',
        accessState: 'inactive_plan',
        retentionExpiresAt: '2024-06-02T00:00:00Z',
      }],
    );

    expect(merged.name).toBe('Local New');
    expect(merged.accessState).toBe('inactive_plan');
    expect(merged.retentionExpiresAt).toBe('2024-06-02T00:00:00Z');
  });

  test('sync uploads only records that differ from the primed cloud snapshot', async () => {
    const upserted = [];
    const service = {
      isConfigured: true,
      upsert: async (campaign) => {
        upserted.push(campaign.id);
        return campaign.id;
      },
    };

    primeCampaignSync([
      { id: 'remote-same', name: 'Same', updatedAt: '2024-03-01T00:00:00Z' },
      { id: 'local-newer', name: 'Old Name', updatedAt: '2024-03-01T00:00:00Z' },
    ]);

    const campaigns = [
      { id: 'remote-same', name: 'Same', updatedAt: '2024-03-01T00:00:00Z' },
      { id: 'local-newer', name: 'New Name', updatedAt: '2024-03-02T00:00:00Z' },
      { id: 'local-only', name: 'Local Only', updatedAt: '2024-03-02T00:00:00Z' },
    ];

    expect(getCampaignsNeedingSync(campaigns).map(campaign => campaign.id))
      .toEqual(['local-newer', 'local-only']);

    await syncCampaignChanges(campaigns, { service });
    expect(upserted).toEqual(['local-newer', 'local-only']);
  });

  test('inactive retained campaigns are never backfilled through ordinary sync', async () => {
    const upserted = [];
    const service = {
      isConfigured: true,
      upsert: async campaign => upserted.push(campaign.id),
    };

    primeCampaignSync([]);
    await syncCampaignChanges([
      { id: 'active', accessState: 'active', updatedAt: '2024-03-01T00:00:00Z' },
      { id: 'retained', accessState: 'inactive_plan', updatedAt: '2024-03-01T00:00:00Z' },
    ], { service });

    expect(upserted).toEqual(['active']);
  });

  test('a previously-synced campaign missing from remote is dropped, not resurrected', () => {
    // pendingSync:false means "this device has confirmed it in the cloud". Its
    // absence from a successful remote load therefore means a remote deletion.
    const merged = mergeCampaignLists(
      [{ id: 'ghost', name: 'Deleted Elsewhere', updatedAt: '2024-03-01T00:00:00Z', pendingSync: false }],
      [],
    );
    expect(merged).toEqual([]);
  });

  test('a never-synced local campaign missing from remote is kept', () => {
    const merged = mergeCampaignLists(
      [{ id: 'draft', name: 'Offline Draft', updatedAt: '2024-03-01T00:00:00Z', pendingSync: true }],
      [],
    );
    expect(merged.map(c => c.id)).toEqual(['draft']);
  });

  test('a remote-confirmed campaign is stamped pendingSync:false so a later deletion sticks', () => {
    const [merged] = mergeCampaignLists(
      [{ id: 'camp-1', name: 'Local', updatedAt: '2024-03-02T00:00:00Z' }],
      [{ id: 'camp-1', name: 'Local', updatedAt: '2024-03-02T00:00:00Z' }],
    );
    expect(merged.pendingSync).toBe(false);
  });

  test('a tombstoned campaign is suppressed even if a stale cache copy carries it', () => {
    const merged = mergeCampaignLists(
      [{ id: 'camp-1', name: 'Stale', updatedAt: '2024-03-01T00:00:00Z', pendingSync: false }],
      [],
      { tombstones: [{ id: 'camp-1', deletedAt: '2024-03-05T00:00:00Z' }] },
    );
    expect(merged).toEqual([]);
  });

  test('a tombstone is suppressed even when an in-flight remote load still returns the row', () => {
    // list() resolved with a copy from BEFORE the deletion (older than the
    // tombstone) — the tombstone must still win.
    const merged = mergeCampaignLists(
      [],
      [{ id: 'camp-1', name: 'Cloud Echo', updatedAt: '2024-03-01T00:00:00Z' }],
      { tombstones: [{ id: 'camp-1', deletedAt: '2024-03-05T00:00:00Z' }] },
    );
    expect(merged).toEqual([]);
  });

  test('a remote copy newer than the tombstone wins — a genuine re-creation', () => {
    const merged = mergeCampaignLists(
      [],
      [{ id: 'camp-1', name: 'Recreated', updatedAt: '2024-03-10T00:00:00Z' }],
      { tombstones: [{ id: 'camp-1', deletedAt: '2024-03-05T00:00:00Z' }] },
    );
    expect(merged.map(c => c.id)).toEqual(['camp-1']);
  });

  test('campaignSignature ignores the pendingSync marker', () => {
    const base = { id: 'camp-1', name: 'C', updatedAt: '2024-03-01T00:00:00Z' };
    expect(campaignSignature({ ...base, pendingSync: true }))
      .toBe(campaignSignature({ ...base, pendingSync: false }));
    expect(campaignSignature({ ...base, pendingSync: false }))
      .toBe(campaignSignature(base));
  });

  test('flipping pendingSync does not by itself mark a campaign as needing sync', () => {
    primeCampaignSync([{ id: 'camp-1', name: 'C', updatedAt: '2024-03-01T00:00:00Z' }]);
    const needing = getCampaignsNeedingSync([
      { id: 'camp-1', name: 'C', updatedAt: '2024-03-01T00:00:00Z', pendingSync: false },
    ]);
    expect(needing).toEqual([]);
  });

  test('reconcileTombstones keeps in-flight/recent entries and prunes confirmed-gone ones', () => {
    const now = Date.parse('2024-06-01T00:00:00Z');
    const ninetyOneDaysAgo = new Date(now - 91 * 24 * 60 * 60 * 1000).toISOString();
    const kept = reconcileTombstones(
      [
        { id: 'still-in-cloud', deletedAt: '2024-01-01T00:00:00Z' }, // delete not yet propagated
        { id: 'recent-gone', deletedAt: '2024-05-30T00:00:00Z' },    // gone from cloud but fresh
        { id: 'stale-gone', deletedAt: ninetyOneDaysAgo },           // gone + aged out
      ],
      [{ id: 'still-in-cloud', name: 'X', updatedAt: '2024-01-01T00:00:00Z' }],
      { now },
    );
    expect(kept.map(t => t.id).sort()).toEqual(['recent-gone', 'still-in-cloud']);
  });

  test('changedId narrows sync to the requested campaign', async () => {
    const upserted = [];
    const service = {
      isConfigured: true,
      upsert: async (campaign) => {
        upserted.push(campaign.id);
        return campaign.id;
      },
    };

    primeCampaignSync([]);
    await syncCampaignChanges([
      { id: 'camp-a', name: 'A', updatedAt: '2024-03-01T00:00:00Z' },
      { id: 'camp-b', name: 'B', updatedAt: '2024-03-01T00:00:00Z' },
    ], { service, changedId: 'camp-b' });

    expect(upserted).toEqual(['camp-b']);
  });
});
