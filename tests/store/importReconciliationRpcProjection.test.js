/**
 * Wire-to-store contract for the authoritative structured-import command.
 *
 * Migration 184 returns a camel-case JSON result envelope whose `saveRow` and
 * `campaignRows` values come directly from PostgreSQL `to_jsonb(...)`. Those
 * nested rows therefore retain snake-case database column names. This test
 * deliberately preserves that mixed shape while crossing the production RPC
 * transport, persistence admission, and Zustand projection boundaries.
 */

import { beforeEach, describe, expect, test, vi } from 'vitest';

const transport = vi.hoisted(() => ({
  rpc: vi.fn(),
}));

vi.mock('../../src/lib/supabase.js', () => ({
  isConfigured: true,
  supabase: {
    rpc: (...args) => transport.rpc(...args),
  },
}));

import { runImportReconciliationCommandTransaction } from '../../src/store/importReconciliationCommandTransaction.js';

const OWNER = '11111111-1111-4111-8111-111111111111';
const TARGET = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa';
const CREATED = 'dddddddd-dddd-4ddd-8ddd-dddddddddddd';
const CHECKSUM = 'sf-import-v1:source';
const APPLIED_AT = '2026-07-24T12:05:00.000Z';

function importedEntry() {
  return {
    name: 'Imported Ashford',
    tier: 'town',
    settlement: {
      schemaVersion: 1,
      name: 'Imported Ashford',
      importedFrom: {
        source: 'account-export',
        sourceChecksum: CHECKSUM,
        sourceId: 'source-save',
      },
    },
    config: null,
    seed: null,
    aiData: {},
    campaignState: { phase: 'draft', eventLog: [] },
    versionHistory: [],
  };
}

function createCommand() {
  return {
    commandId: 'cmd:import-reconciliation:rpc-projection',
    kind: 'import.settlement.create-and-attach',
    targets: { campaignId: TARGET, saveId: CREATED },
    expected: {
      sourceFingerprint: CHECKSUM,
      membershipCampaignIds: [],
    },
    correlation: { importSessionId: 'irs:source:target' },
    params: { entry: importedEntry() },
    requestedAt: APPLIED_AT,
  };
}

/**
 * The outer keys are written explicitly by jsonb_build_object. Nested keys are
 * the actual settlements/saved_maps column names emitted by to_jsonb(row).
 */
function migrationRpcResponse() {
  return {
    status: 'applied',
    replayed: false,
    fingerprint: 'f'.repeat(64),
    receipt: {
      importSessionId: 'irs:source:target',
      sourceChecksum: CHECKSUM,
      kind: 'import.settlement.create-and-attach',
      campaignId: TARGET,
      saveId: CREATED,
      membershipPolicy: 'exclusive-rehome',
      previousCampaignIds: [],
      affectedCampaignIds: [TARGET],
      created: true,
      appliedAt: APPLIED_AT,
    },
    saveRow: {
      id: CREATED,
      user_id: OWNER,
      name: 'Imported Ashford',
      tier: 'town',
      data: importedEntry().settlement,
      config: null,
      toggles: null,
      seed: null,
      neighbour_links: [],
      ai_data: {},
      campaign_state: { phase: 'draft', eventLog: [] },
      version_history: [],
      access_state: 'active',
      inactive_reason: null,
      inactive_since: null,
      retention_expires_at: null,
      created_at: APPLIED_AT,
      updated_at: APPLIED_AT,
    },
    campaignRows: [{
      id: TARGET,
      user_id: OWNER,
      name: 'Target campaign',
      map_seed: null,
      map_data: {
        kind: 'settlementforge_campaign',
        version: 2,
        campaign: {
          id: TARGET,
          name: 'Target campaign',
          settlementIds: [CREATED],
          worldState: {
            pendingEvents: [],
            envoyErrands: [{ id: 'forged.rpc' }],
          },
          unrelated: { keep: true },
        },
      },
      burg_settlement_map: {},
      supply_chain_config: [],
      access_state: 'active',
      inactive_reason: null,
      inactive_since: null,
      retention_expires_at: null,
      created_at: APPLIED_AT,
      updated_at: APPLIED_AT,
    }],
  };
}

function harness() {
  let state = {
    auth: { user: { id: OWNER } },
    campaignSessionGeneration: 7,
    savedSettlementsOwnerId: OWNER,
    savedSettlementsHydrationGeneration: 11,
    campaigns: [{
      id: TARGET,
      name: 'Target before response',
      settlementIds: [],
      worldState: { pendingEvents: [] },
      accessState: 'active',
    }],
    savedSettlements: [],
  };
  return {
    get: () => state,
    set: (recipe) => {
      recipe(state);
    },
    read: () => state,
  };
}

beforeEach(() => {
  transport.rpc.mockReset();
  transport.rpc.mockResolvedValue({
    data: migrationRpcResponse(),
    error: null,
  });
});

describe('structured-import RPC projection', () => {
  test('admits migration 184 row envelopes and projects application records', async () => {
    const command = createCommand();
    const store = harness();

    const result = await runImportReconciliationCommandTransaction({
      set: store.set,
      get: store.get,
      command,
    });

    expect(transport.rpc).toHaveBeenCalledWith(
      'apply_import_reconciliation_command',
      {
        p_expected_owner: OWNER,
        p_command_id: command.commandId,
        p_kind: command.kind,
        p_campaign_id: TARGET,
        p_save_id: CREATED,
        p_source_checksum: CHECKSUM,
        p_import_session_id: 'irs:source:target',
        p_expected_membership_campaign_ids: [],
        p_entry: command.params.entry,
      },
    );
    expect(result).toMatchObject({
      ok: true,
      status: 'applied',
      persistenceState: 'confirmed',
      result: {
        mode: 'server-atomic',
        projection: 'applied',
        saveId: CREATED,
        campaignId: TARGET,
      },
    });

    const projectedSave = store.read().savedSettlements[0];
    expect(projectedSave).toMatchObject({
      id: CREATED,
      name: 'Imported Ashford',
      tier: 'town',
      timestamp: APPLIED_AT,
      accessState: 'active',
      campaignState: { phase: 'draft', eventLog: [] },
      settlement: {
        name: 'Imported Ashford',
        importedFrom: {
          source: 'account-export',
          sourceChecksum: CHECKSUM,
          sourceId: 'source-save',
        },
      },
    });
    expect(projectedSave).not.toHaveProperty('user_id');
    expect(projectedSave).not.toHaveProperty('campaign_state');

    const projectedCampaign = store.read().campaigns[0];
    expect(projectedCampaign).toMatchObject({
      id: TARGET,
      name: 'Target campaign',
      settlementIds: [CREATED],
      worldState: { pendingEvents: [] },
      unrelated: { keep: true },
      accessState: 'active',
      updatedAt: APPLIED_AT,
    });
    expect(projectedCampaign.worldState).not.toHaveProperty('envoyErrands');
    expect(projectedCampaign).not.toHaveProperty('map_data');
    expect(projectedCampaign).not.toHaveProperty('user_id');
  });
});
