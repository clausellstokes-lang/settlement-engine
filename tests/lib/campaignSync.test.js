import { describe, expect, test } from 'vitest';

import {
  getCampaignsNeedingSync,
  mergeCampaignLists,
  primeCampaignSync,
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
