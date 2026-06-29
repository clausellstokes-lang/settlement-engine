/**
 * @vitest-environment jsdom
 *
 * Smoke tests for src/lib/saves.js — the save/load service that backs
 * the campaign library.
 *
 * Architecture note: `saves.*` is bound at module-load time to either
 * the supabase* or local* implementations based on `isConfigured` from
 * supabase.js. Tests therefore need to mock supabase.js BEFORE importing
 * saves.js, and reset modules between describe blocks to swap mock
 * variants. We use vi.doMock + vi.resetModules + a fresh dynamic import
 * in each beforeEach.
 *
 * Coverage:
 *   1. Local backend (vi.doMock returns isConfigured: false)
 *      - round-trip via localStorage (real jsdom impl)
 *      - migrateSaveToV2 default-fills for old saves
 *      - migrateSaveToV2 is idempotent
 *      - update / delete / count / writeAll behaviour
 *   2. Supabase backend (vi.doMock returns mock fluent client + isConfigured: true)
 *      - save shapes the row to supabase schema (verifies serialization)
 *      - list maps supabase rows back to entry shape (verifies deserialization)
 *      - update sends only the partial fields that changed
 *      - toggle bundle round-trip
 */

import { describe, test, expect, beforeEach, vi } from 'vitest';

// ── Test 1: local backend (supabase mocked to unconfigured) ────────────
describe('saves — local backend round-trip', () => {
  let saves;

  beforeEach(async () => {
    localStorage.clear();
    vi.resetModules();
    // Force isConfigured=false so saves.* bind to local* implementations.
    vi.doMock('../../src/lib/supabase.js', () => ({
      supabase: null,
      isConfigured: false,
    }));
    ({ saves } = await import('../../src/lib/saves.js'));
  });

  test('isConfigured is false → local backend selected', () => {
    expect(saves.isConfigured).toBe(false);
    expect(saves.writeAll).toBeTruthy();  // local-only API surface
  });

  test('list returns [] on fresh start', async () => {
    expect(await saves.list()).toEqual([]);
  });

  test('save → list round-trips the entry shape', async () => {
    const entry = {
      name: 'Test Town',
      tier: 'village',
      settlement: { name: 'Test Town', tier: 'village', population: 800 },
      config: { settType: 'village', culture: 'germanic' },
      institutionToggles: { 'village::Economy::Marketplace': { require: true } },
      seed: 'seed-123',
    };
    const id = await saves.save(entry);
    expect(id).toBeDefined();

    const list = await saves.list();
    expect(list).toHaveLength(1);
    const loaded = list[0];
    expect(loaded.name).toBe('Test Town');
    expect(loaded.tier).toBe('village');
    // saves.list() runs migrateSettlementShape (normalizeSettlement) at
    // the boundary, so the loaded settlement carries version stamps +
    // default canonical containers in addition to the original fields.
    // toMatchObject asserts the original keys survive without requiring
    // exact equality.
    expect(loaded.settlement).toMatchObject(entry.settlement);
    expect(loaded.settlement.schemaVersion).toBeGreaterThan(0);
    expect(loaded.settlement.id).toMatch(/^s_/);
    expect(loaded.seed).toBe('seed-123');
    // Local path stores toggles at top level; institutionToggles survives.
    expect(loaded.institutionToggles).toEqual(entry.institutionToggles);
  });

  test('migration default-fills campaignState on v1 entries at load time', async () => {
    // Plant a v1-shaped entry directly in localStorage to simulate an
    // older save written before the v2 migration shipped.
    localStorage.setItem('dnd_settlement_saves', JSON.stringify([{
      id: 99, name: 'Old Town', tier: 'town',
      settlement: { name: 'Old Town' },
      savedAt: 1700000000000,
    }]));

    const [loaded] = await saves.list();

    expect(loaded.campaignState).toBeDefined();
    expect(loaded.campaignState.phase).toBe('draft');
    expect(loaded.campaignState.eventLog).toEqual([]);
    expect(loaded.campaignState.systemState).toBeNull();
    expect(loaded.campaignState.locks).toEqual({});
    expect(loaded.campaignState.canonizedAt).toBeNull();
    expect(loaded.campaignState.lastExportAt).toBeNull();
  });

  test('migration is idempotent on already-v2 entries', async () => {
    const v2Entry = {
      id: 1, name: 'X', tier: 'village',
      settlement: { name: 'X' },
      campaignState: {
        phase: 'canon',
        eventLog: [{ id: 'ev1' }],
        systemState: { resilience: { value: 70 } },
        locks: { name: true },
        generatedAt: '2026-01-01',
        editedAt: '2026-01-02',
        canonizedAt: '2026-01-03',
        lastExportAt: null,
        narrativeDrift: null,
        exportState: null,
      },
    };
    localStorage.setItem('dnd_settlement_saves', JSON.stringify([v2Entry]));
    const [loaded] = await saves.list();
    expect(loaded.campaignState.phase).toBe('canon');
    expect(loaded.campaignState.eventLog).toEqual([{ id: 'ev1' }]);
    expect(loaded.campaignState.canonizedAt).toBe('2026-01-03');
  });

  test('update mutates an existing entry by id', async () => {
    const id = await saves.save({ name: 'Before', tier: 'village', settlement: {} });
    await saves.update(id, { name: 'After' });
    const [loaded] = await saves.list();
    expect(loaded.name).toBe('After');
  });

  test('delete removes the right entry by id', async () => {
    // Pass explicit IDs to avoid Date.now() collision on back-to-back saves
    // (the impl uses Date.now() as default ID; calls within the same
    // millisecond would assign duplicate IDs, irrelevant in real use).
    const id1 = await saves.save({ id: 1001, name: 'A', tier: 'thorp', settlement: {} });
    const id2 = await saves.save({ id: 1002, name: 'B', tier: 'hamlet', settlement: {} });
    expect(await saves.count()).toBe(2);
    await saves.delete(id1);
    const list = await saves.list();
    expect(list).toHaveLength(1);
    expect(list[0].name).toBe('B');
    expect(list[0].id).toBe(id2);
  });

  test('count only includes active local saves', async () => {
    localStorage.setItem('dnd_settlement_saves', JSON.stringify([
      { id: 1, name: 'Active', tier: 'village', settlement: {}, accessState: 'active' },
      { id: 2, name: 'Inactive', tier: 'town', settlement: {}, accessState: 'inactive_plan' },
    ]));
    expect(await saves.count()).toBe(1);
  });

  test('writeAll replaces the whole array', async () => {
    await saves.save({ name: 'A', tier: 'village', settlement: {} });
    await saves.writeAll([
      { id: 10, name: 'Replaced1', tier: 'town', settlement: {} },
      { id: 11, name: 'Replaced2', tier: 'city', settlement: {} },
    ]);
    const list = await saves.list();
    expect(list).toHaveLength(2);
    expect(list.map(s => s.name).sort()).toEqual(['Replaced1', 'Replaced2']);
  });
});

// ── Test 2: supabase backend (mocked fluent client) ────────────────────
describe('saves — supabase backend round-trip (mocked)', () => {
  let saves;
  const mockState = { rows: [], lastInsert: null, lastUpdate: null, lastRpc: null };

  beforeEach(async () => {
    mockState.rows = [];
    mockState.lastInsert = null;
    mockState.lastUpdate = null;
    mockState.lastRpc = null;

    vi.resetModules();
    vi.doMock('../../src/lib/supabase.js', () => {
      // Minimal chainable client mimicking @supabase/supabase-js for the
      // .from('settlements').select(...).order(...) shape used by saves.js.
      const builder = () => {
        let selectOptions = {};
        const chain = {
          select: (_cols, options = {}) => {
            selectOptions = options || {};
            return chain;
          },
          order: () => Promise.resolve({ data: mockState.rows, error: null }),
          eq: (col, value) => {
            const rows = mockState.rows.filter(row => row[col] === value);
            if (selectOptions?.head) return Promise.resolve({ count: rows.length, error: null });
            return Promise.resolve({ data: rows, error: null });
          },
          insert: (row) => {
            mockState.lastInsert = row;
            const id = `mock-${mockState.rows.length + 1}`;
            mockState.rows.push({ ...row, id, updated_at: new Date().toISOString() });
            return {
              select: () => ({ single: () => Promise.resolve({ data: { id }, error: null }) }),
            };
          },
          update: (partial) => ({
            eq: (_col, id) => {
              mockState.lastUpdate = { id, partial };
              const row = mockState.rows.find(r => r.id === id);
              if (row) Object.assign(row, partial);
              return Promise.resolve({ error: null });
            },
          }),
          delete: () => ({
            eq: (_col, id) => {
              mockState.rows = mockState.rows.filter(r => r.id !== id);
              return Promise.resolve({ error: null });
            },
          }),
        };
        return chain;
      };
      return {
        supabase: {
          from: () => builder(),
          rpc: (fn, args) => {
            mockState.lastRpc = { fn, args };
            if (fn === 'reactivate_free_settlement') {
              const row = mockState.rows.find(r => r.id === args.target_settlement_id);
              if (row) row.access_state = 'active';
              return Promise.resolve({ data: { ok: true }, error: null });
            }
            return Promise.resolve({ data: null, error: null });
          },
          auth: {
            getUser: () => Promise.resolve({ data: { user: { id: 'test-user-id' } } }),
          },
        },
        isConfigured: true,
        // saves.js now guards every network leg with withTimeout; in tests it is
        // a passthrough (the mocked client resolves synchronously).
        withTimeout: (p) => p,
      };
    });

    ({ saves } = await import('../../src/lib/saves.js'));
  });

  test('isConfigured is true → supabase backend selected', () => {
    expect(saves.isConfigured).toBe(true);
    expect(saves.writeAll).toBeNull();  // writeAll is local-only
  });

  test('save shapes the row to the supabase schema', async () => {
    await saves.save({
      name: 'Mock Town',
      tier: 'town',
      settlement: { name: 'Mock Town', neighbourNetwork: [{ id: 'n1' }] },
      config: { settType: 'town', culture: 'germanic' },
      institutionToggles: { foo: { require: true } },
      seed: 's1',
      versionHistory: [{ id: 'snap-1', label: 'Before trouble', settlement: { name: 'Mock Town' } }],
    });

    const row = mockState.lastInsert;
    expect(row).toBeTruthy();
    expect(row.user_id).toBe('test-user-id');
    expect(row.name).toBe('Mock Town');
    expect(row.tier).toBe('town');
    expect(row.data).toEqual({ name: 'Mock Town', neighbourNetwork: [{ id: 'n1' }] });
    expect(row.neighbour_links).toEqual([{ id: 'n1' }]);  // extracted from settlement.neighbourNetwork
    expect(row.toggles).toBeDefined();
    expect(row.toggles.institutionToggles).toEqual({ foo: { require: true } });
    // v2 migration default-fills campaign_state on the way in
    expect(row.campaign_state).toBeDefined();
    expect(row.campaign_state.phase).toBe('draft');
    expect(row.version_history).toEqual([{ id: 'snap-1', label: 'Before trouble', settlement: { name: 'Mock Town' } }]);
  });

  test('list maps supabase rows back to entry shape with toggles spread', async () => {
    mockState.rows.push({
      id: 'sb-1',
      name: 'Round Trip',
      tier: 'city',
      data: { name: 'Round Trip', population: 12000 },
      config: { settType: 'city' },
      toggles: {
        institutionToggles: { 'city::Government::Citadel': { require: true } },
        categoryToggles: { Magic: { allow: true } },
        goodsToggles: {},
        servicesToggles: {},
      },
      seed: 'seed-rt',
      neighbour_links: null,
      ai_data: { summary: 'Pre-cached AI text' },
      access_state: 'active',
      version_history: [{ id: 'snap-rt', label: 'Round trip', settlement: { name: 'Round Trip' } }],
      campaign_state: {
        phase: 'canon', eventLog: [], systemState: null, locks: {},
        generatedAt: '2026-01-01', editedAt: '2026-01-02',
        canonizedAt: '2026-01-03', lastExportAt: null,
        narrativeDrift: null, exportState: null,
      },
      updated_at: '2026-01-02T00:00:00Z',
    });

    const [e] = await saves.list();
    expect(e.id).toBe('sb-1');
    expect(e.name).toBe('Round Trip');
    // See the local-backend round-trip test above for the rationale:
    // migrateSettlementShape adds canonical version stamps + container
    // defaults to every loaded settlement.
    expect(e.settlement).toMatchObject({ name: 'Round Trip', population: 12000 });
    expect(e.settlement.schemaVersion).toBeGreaterThan(0);
    // Toggles bundle is spread back to top-level keys.
    expect(e.institutionToggles).toEqual({ 'city::Government::Citadel': { require: true } });
    expect(e.categoryToggles).toEqual({ Magic: { allow: true } });
    expect(e.goodsToggles).toEqual({});
    expect(e.servicesToggles).toEqual({});
    expect(e.aiData).toEqual({ summary: 'Pre-cached AI text' });
    expect(e.versionHistory).toEqual([{ id: 'snap-rt', label: 'Round trip', settlement: { name: 'Round Trip' } }]);
    expect(e.campaignState.phase).toBe('canon');
    expect(e.campaignState.canonizedAt).toBe('2026-01-03');
  });

  test('inactive supabase rows load as retained metadata without settlement payload', async () => {
    mockState.rows.push({
      id: 'inactive-1',
      name: 'Retained Town',
      tier: 'city',
      data: { name: 'Retained Town', population: 14000 },
      config: { settType: 'city' },
      toggles: { institutionToggles: { x: true } },
      seed: 'hidden-seed',
      ai_data: { summary: 'hidden' },
      access_state: 'inactive_plan',
      inactive_reason: 'premium_downgrade',
      inactive_since: '2026-06-05T00:00:00Z',
      retention_expires_at: '2026-09-05T00:00:00Z',
      campaign_state: null,
      version_history: [],
      updated_at: '2026-06-05T00:00:00Z',
    });

    const [e] = await saves.list();
    expect(e.accessState).toBe('inactive_plan');
    expect(e.settlement).toBeNull();
    expect(e.config).toBeNull();
    expect(e.seed).toBeNull();
    expect(e.retentionExpiresAt).toBe('2026-09-05T00:00:00Z');
  });

  test('count filters to active supabase rows and reactivation uses the RPC', async () => {
    mockState.rows.push(
      { id: 'active-1', access_state: 'active' },
      { id: 'inactive-1', access_state: 'inactive_plan' },
    );
    expect(await saves.count()).toBe(1);
    await saves.reactivateFreeSettlement('inactive-1');
    expect(mockState.lastRpc).toEqual({
      fn: 'reactivate_free_settlement',
      args: { target_settlement_id: 'inactive-1' },
    });
  });

  test('update sends only the partial fields that changed', async () => {
    mockState.rows.push({
      id: 'upd-1', name: 'Original', tier: 'town', data: { name: 'Original' },
      toggles: null, campaign_state: { phase: 'draft' },
      updated_at: '2026-01-01T00:00:00Z',
    });

    await saves.update('upd-1', {
      name: 'Updated',
      campaignState: {
        phase: 'canon', eventLog: [], systemState: null, locks: {},
        generatedAt: null, editedAt: null, canonizedAt: '2026-02-01',
        lastExportAt: null, narrativeDrift: null, exportState: null,
      },
      versionHistory: [{ id: 'snap-upd', label: 'Updated snapshot' }],
    });

    expect(mockState.lastUpdate.id).toBe('upd-1');
    expect(mockState.lastUpdate.partial.name).toBe('Updated');
    expect(mockState.lastUpdate.partial.campaign_state.phase).toBe('canon');
    expect(mockState.lastUpdate.partial.version_history).toEqual([{ id: 'snap-upd', label: 'Updated snapshot' }]);
    // tier wasn't passed → shouldn't appear in the update
    expect(mockState.lastUpdate.partial.tier).toBeUndefined();
    // settlement wasn't passed → no data/neighbour_links update
    expect(mockState.lastUpdate.partial.data).toBeUndefined();
    expect(mockState.lastUpdate.partial.neighbour_links).toBeUndefined();
  });
});
