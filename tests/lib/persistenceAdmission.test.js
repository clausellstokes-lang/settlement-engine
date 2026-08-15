/**
 * @vitest-environment jsdom
 *
 * Persistence boundary admission contracts.
 *
 * These tests pin the user-data guarantee rather than one library choice:
 * historical shapes keep flowing to their established migrations, unsupported
 * or malformed envelopes are isolated to one sibling, and diagnostics state
 * exactly whether each source record was current, migrated, or rejected.
 */

import { describe, expect, test } from 'vitest';

import {
  admitSupabaseSavedSettlementRows,
  saves,
} from '../../src/lib/saves.js';
import { admitSavedSettlementEntries } from '../../src/lib/saveAdmission.js';
import {
  admitCampaignEntries,
  admitSupabaseCampaignRows,
  campaigns,
} from '../../src/lib/campaigns.js';

const CURRENT_CAMPAIGN_ID = '11111111-1111-4111-8111-111111111111';
const LEGACY_CAMPAIGN_ID = '22222222-2222-4222-8222-222222222222';
const FUTURE_CAMPAIGN_ID = '33333333-3333-4333-8333-333333333333';
const UNWRAPPED_CAMPAIGN_ID = '55555555-5555-4555-8555-555555555555';

function currentMapState(overrides = {}) {
  return {
    schemaVersion: 2,
    fmgSnapshot: null,
    placements: {},
    labels: [],
    markers: [],
    forests: [],
    layers: {},
    viewport: {},
    ...overrides,
  };
}

describe('saved-settlement admission', () => {
  test('keeps valid current and legacy siblings while rejecting only malformed entries', () => {
    const admitted = admitSavedSettlementEntries([
      {
        id: 'save-current',
        name: 'Current',
        settlement: { schemaVersion: 1, name: 'Current' },
        campaignState: { phase: 'canon' },
        accessState: 'active',
      },
      {
        id: 7,
        name: 'Museum-era',
        settlement: { name: 'Museum-era', _seed: 'legacy-seed' },
      },
      null,
      {
        id: 'save-broken',
        name: 'Broken history',
        settlement: { schemaVersion: 1 },
        campaignState: { phase: 'canon' },
        versionHistory: { not: 'an array' },
      },
    ]);

    expect(admitted.entries.map(entry => entry.name)).toEqual(['Current', 'Museum-era']);
    expect(admitted.diagnostics).toMatchObject({
      current: 1,
      migrated: 1,
      rejected: 2,
    });
    expect(admitted.diagnostics.entries.map(entry => entry.status)).toEqual([
      'current',
      'migrated',
      'rejected',
      'rejected',
    ]);
  });

  test('checks Supabase JSONB before defaults and normalizes every admitted row', async () => {
    const admitted = await admitSupabaseSavedSettlementRows([
      {
        id: 'save-current',
        name: 'Current cloud save',
        data: { schemaVersion: 1, name: 'Current cloud save' },
        config: {},
        toggles: {},
        ai_data: {},
        campaign_state: { phase: 'canon' },
        version_history: [],
        gallery_tags: [],
        access_state: 'active',
        updated_at: '2026-07-24T12:00:00.000Z',
      },
      {
        id: 'save-corrupt',
        name: 'Corrupt cloud save',
        data: 'not-json-object',
        access_state: 'active',
      },
      {
        id: 'save-legacy',
        name: 'Legacy cloud save',
        data: { name: 'Legacy cloud save', _seed: 'cloud-legacy' },
        access_state: 'active',
        updated_at: '2025-04-01T12:00:00.000Z',
      },
    ]);

    expect(admitted.entries.map(entry => entry.id)).toEqual([
      'save-current',
      'save-legacy',
    ]);
    expect(admitted.entries[1].settlement.schemaVersion).toBe(1);
    expect(admitted.entries[1].campaignState.phase).toBe('draft');
    expect(admitted.diagnostics).toMatchObject({
      current: 1,
      migrated: 1,
      rejected: 1,
    });
    expect(admitted.diagnostics.entries[1]).toMatchObject({
      status: 'rejected',
      id: 'save-corrupt',
      code: 'data_jsonb_invalid',
    });
  });

  test('the local save service exposes the diagnostics from its real load path', async () => {
    if (saves.isConfigured) return;
    localStorage.setItem('dnd_settlement_saves', JSON.stringify([
      {
        id: 'live-save',
        name: 'Live',
        settlement: { schemaVersion: 1 },
        campaignState: { phase: 'draft' },
        accessState: 'active',
      },
      'broken-sibling',
    ]));

    expect((await saves.list()).map(entry => entry.id)).toEqual(['live-save']);
    expect(saves.getAdmissionDiagnostics()).toMatchObject({
      source: 'local-cache',
      current: 1,
      rejected: 1,
    });
  });
});

describe('campaign admission', () => {
  test('admits the supported v1 cache migration but refuses future map versions', () => {
    const admitted = admitCampaignEntries([
      {
        id: CURRENT_CAMPAIGN_ID,
        name: 'Current',
        settlementIds: [],
        mapState: currentMapState(),
        accessState: 'active',
      },
      {
        id: 'legacy-local-id',
        name: 'Legacy',
        settlementIds: 'historically-normalized-to-empty',
        mapState: {
          placements: [{ burgId: 1, settlementId: 'save-1' }],
          mapSeed: 42,
        },
      },
      null,
      {
        id: FUTURE_CAMPAIGN_ID,
        name: 'Future',
        settlementIds: [],
        mapState: currentMapState({ schemaVersion: 3 }),
        accessState: 'active',
      },
    ], { ownerId: 'owner-a' });

    expect(admitted.entries.map(entry => entry.name)).toEqual(['Current', 'Legacy']);
    expect(admitted.diagnostics).toMatchObject({
      ownerId: 'owner-a',
      current: 1,
      migrated: 1,
      rejected: 2,
    });
    expect(admitted.diagnostics.entries[3]).toMatchObject({
      status: 'rejected',
      code: 'campaign_map_version_unsupported',
    });
  });

  test('isolates malformed Supabase campaign JSONB and preserves legacy saved maps', () => {
    const admitted = admitSupabaseCampaignRows([
      {
        id: CURRENT_CAMPAIGN_ID,
        name: 'Current cloud campaign',
        map_data: {
          kind: 'settlementforge_campaign',
          version: 2,
          campaign: {
            id: CURRENT_CAMPAIGN_ID,
            name: 'Current cloud campaign',
            settlementIds: [],
            mapState: currentMapState(),
            accessState: 'active',
          },
        },
        burg_settlement_map: {},
        supply_chain_config: [],
        access_state: 'active',
      },
      {
        id: LEGACY_CAMPAIGN_ID,
        name: 'Legacy saved map',
        map_seed: 17,
        map_data: { fmgSnapshot: 'legacy-map-snapshot' },
        burg_settlement_map: {},
        supply_chain_config: [],
        access_state: 'active',
      },
      {
        id: FUTURE_CAMPAIGN_ID,
        name: 'Future wrapper',
        map_data: {
          kind: 'settlementforge_campaign',
          version: 3,
          campaign: {},
        },
        burg_settlement_map: {},
        supply_chain_config: [],
      },
      {
        id: '44444444-4444-4444-8444-444444444444',
        name: 'Broken placements',
        map_data: {},
        burg_settlement_map: [],
        supply_chain_config: [],
      },
    ]);

    expect(admitted.entries.map(entry => entry.name)).toEqual([
      'Current cloud campaign',
      'Legacy saved map',
    ]);
    expect(admitted.entries[1].mapState.schemaVersion).toBe(2);
    expect(admitted.diagnostics).toMatchObject({
      current: 1,
      migrated: 1,
      rejected: 2,
    });
    expect(admitted.diagnostics.entries[2]).toMatchObject({
      status: 'rejected',
      code: 'campaign_envelope_version_unsupported',
    });
    expect(admitted.diagnostics.entries[3]).toMatchObject({
      status: 'rejected',
      code: 'burg_settlement_map_jsonb_invalid',
    });
  });

  test('migrates untagged and unwrapped cloud campaign envelopes without losing their payload', () => {
    const admitted = admitSupabaseCampaignRows([
      {
        id: LEGACY_CAMPAIGN_ID,
        name: 'Untagged wrapper',
        map_data: {
          campaign: {
            id: LEGACY_CAMPAIGN_ID,
            name: 'Untagged wrapper',
            settlementIds: ['save-a'],
            mapState: currentMapState(),
            worldState: { tick: 8 },
          },
        },
        burg_settlement_map: {},
        supply_chain_config: [],
      },
      {
        id: UNWRAPPED_CAMPAIGN_ID,
        name: 'Unwrapped campaign',
        map_data: {
          id: UNWRAPPED_CAMPAIGN_ID,
          name: 'Unwrapped campaign',
          settlementIds: ['save-b'],
          mapState: currentMapState(),
          wizardNews: { entries: [] },
        },
        burg_settlement_map: {},
        supply_chain_config: [],
      },
      {
        id: '66666666-6666-4666-8666-666666666666',
        name: 'Raw legacy map state',
        map_seed: 42,
        map_data: {
          fmgSnapshot: 'raw-map-snapshot',
          labels: [{ id: 'label-a', text: 'Old road' }],
          customLegacyKey: { retained: true },
        },
        burg_settlement_map: {},
        supply_chain_config: [],
      },
    ]);

    expect(admitted.entries).toHaveLength(3);
    expect(admitted.entries[0]).toMatchObject({
      settlementIds: ['save-a'],
      worldState: { tick: 8 },
    });
    expect(admitted.entries[1]).toMatchObject({
      settlementIds: ['save-b'],
      wizardNews: { entries: [] },
    });
    expect(admitted.entries[2].mapState).toMatchObject({
      seed: 42,
      fmgSnapshot: 'raw-map-snapshot',
      customLegacyKey: { retained: true },
    });
    expect(admitted.diagnostics).toMatchObject({
      current: 0,
      migrated: 3,
      rejected: 0,
    });
    expect(admitted.diagnostics.entries.map(entry => entry.code)).toEqual([
      'legacy_untagged_campaign_envelope',
      'legacy_unwrapped_campaign',
      'legacy_saved_map',
    ]);
  });

  test('campaign cache diagnostics remain scoped to the owner that was read', () => {
    if (campaigns.isConfigured) return;
    campaigns.cache([
      {
        id: CURRENT_CAMPAIGN_ID,
        name: 'Owner A',
        settlementIds: [],
        mapState: currentMapState(),
        accessState: 'active',
      },
      42,
    ], 'owner-a');
    campaigns.cache([{
      id: LEGACY_CAMPAIGN_ID,
      name: 'Owner B',
      settlementIds: [],
      mapState: currentMapState(),
      accessState: 'active',
    }], 'owner-b');

    expect(campaigns.loadCached('owner-a')).toHaveLength(1);
    expect(campaigns.loadCached('owner-b')).toHaveLength(1);
    expect(campaigns.getAdmissionDiagnostics('owner-a')).toMatchObject({
      current: 1,
      rejected: 1,
    });
    expect(campaigns.getAdmissionDiagnostics('owner-b')).toMatchObject({
      current: 1,
      rejected: 0,
    });
  });
});
