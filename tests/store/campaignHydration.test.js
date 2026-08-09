import { describe, expect, test, vi } from 'vitest';

import {
  hydratePersistedCampaignRows,
  hydratePersistedCampaignWorld,
} from '../../src/store/campaignHydration.js';

describe('persisted campaign hydration', () => {
  test('strict world admission runs before structural campaign migration', () => {
    const raw = {
      id: 'campaign.raw',
      name: 'Raw campaign',
      worldState: { envoyErrands: [{ id: 'forged-row' }] },
    };
    const migrateCampaign = vi.fn((campaign, inferred) => {
      expect(campaign.worldState).not.toHaveProperty('envoyErrands');
      expect(inferred).toEqual({ cultures: [{ name: 'Pinned culture' }] });
      return { ...campaign, migrated: true };
    });

    const rows = hydratePersistedCampaignRows(
      [raw],
      { cultures: [{ name: 'Pinned culture' }] },
      migrateCampaign,
    );

    expect(migrateCampaign).toHaveBeenCalledTimes(1);
    expect(rows).toEqual([expect.objectContaining({ id: 'campaign.raw', migrated: true })]);
    expect(raw.worldState).toHaveProperty('envoyErrands');
  });

  test('one campaign hydration never aliases its persisted world graph', () => {
    const raw = {
      id: 'campaign.clone',
      worldState: {
        spatialLedgers: {
          rumorLedgers: { ashford: [{ id: 'rumor.one', nested: { known: true } }] },
        },
      },
    };
    const hydrated = hydratePersistedCampaignWorld(raw);

    expect(hydrated).not.toBe(raw);
    expect(hydrated.worldState).not.toBe(raw.worldState);
    expect(hydrated.worldState.spatialLedgers).not.toBe(raw.worldState.spatialLedgers);
    expect(hydrated.worldState.spatialLedgers).toEqual(raw.worldState.spatialLedgers);
  });

  test('non-record campaign values stay total and unchanged', () => {
    expect(hydratePersistedCampaignWorld(null)).toBeNull();
    expect(hydratePersistedCampaignWorld('not-a-campaign')).toBe('not-a-campaign');
  });
});
