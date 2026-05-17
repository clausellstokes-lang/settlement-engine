/**
 * @vitest-environment jsdom
 *
 * Save schema drift test — locks the canonical entry / campaignState /
 * supabase-row shapes used by src/lib/saves.js.
 *
 * Why this exists: same pattern as tests/data/stressTypesMeta.test.js
 * but at the storage layer. If a save written by an old client loses
 * a field when loaded by a new client (or vice versa), DMs lose
 * campaign state silently. This test fails CI before that ships.
 *
 * What it locks:
 *   1. ENTRY_SCHEMA — the keys / type contracts a loaded entry must
 *      have. Adding fields is fine; removing is not (without intent).
 *   2. CAMPAIGN_STATE_SCHEMA — the lifecycle fields on campaignState.
 *      These are the CRIT-tier audit fields (phase, eventLog,
 *      systemState, locks, provenance timestamps). Any change here
 *      breaks the save-load-then-undo flow.
 *   3. SUPABASE_ROW_SCHEMA — the columns saves.js writes to. Drift
 *      here means a v2 client can't read v1 supabase rows (or vice
 *      versa).
 *   4. The migration helper is idempotent and the migration produces
 *      a complete campaignState block when handed a v1 entry.
 */

import { describe, test, expect, beforeEach, vi } from 'vitest';

// Canonical schemas. To add a field, also bump the version comment
// and update the migration in saves.js. To remove a field, the migration
// helper needs to handle the absence on load AND any callers that read it.

const ENTRY_SCHEMA = {
  id:                'present',  // either string or number
  name:              'string',
  tier:              'string',
  settlement:        'object',
  config:            'optional-object',
  institutionToggles:'object',
  categoryToggles:   'object',
  goodsToggles:      'object',
  servicesToggles:   'object',
  seed:              'optional-string-or-null',
  savedAt:           'number',
  campaignState:     'object',
  // aiData lives next to the entry but is optional — saves written
  // before the AI layer can be missing it entirely.
  aiData:            'optional-object',
};

const CAMPAIGN_STATE_SCHEMA = {
  phase:          'string',           // 'draft' | 'canon'
  eventLog:       'array',
  systemState:    'optional-object',  // SystemState or null
  locks:          'object',
  generatedAt:    'optional-string',  // ISO date or null
  editedAt:       'optional-string',
  canonizedAt:    'optional-string',
  lastExportAt:   'optional-string',
  narrativeDrift: 'optional-object',
  exportState:    'optional-object',
};

const SUPABASE_ROW_SCHEMA = {
  user_id:         'string',
  name:            'string',
  tier:            'string',
  data:            'object',          // settlement
  config:          'optional-object',
  toggles:         'optional-object', // bundled
  seed:            'optional-string-or-null',
  neighbour_links: 'optional-array-or-null',
  ai_data:         'object',
  campaign_state:  'optional-object',
};

function assertShape(actual, schema, label = 'shape') {
  for (const [key, kind] of Object.entries(schema)) {
    const v = actual[key];
    const has = key in actual;
    switch (kind) {
      case 'present':
        expect(has, `${label}.${key} missing`).toBe(true);
        break;
      case 'string':
        expect(typeof v, `${label}.${key} not string`).toBe('string');
        break;
      case 'object':
        expect(v && typeof v === 'object' && !Array.isArray(v), `${label}.${key} not object`).toBe(true);
        break;
      case 'array':
        expect(Array.isArray(v), `${label}.${key} not array`).toBe(true);
        break;
      case 'optional-string':
        if (v !== null && v !== undefined) expect(typeof v, `${label}.${key}`).toBe('string');
        break;
      case 'optional-string-or-null':
        if (v !== undefined) expect(v === null || typeof v === 'string', `${label}.${key}`).toBe(true);
        break;
      case 'optional-object':
        if (v !== null && v !== undefined) expect(typeof v, `${label}.${key}`).toBe('object');
        break;
      case 'optional-array-or-null':
        if (v !== undefined) expect(v === null || Array.isArray(v), `${label}.${key}`).toBe(true);
        break;
      case 'number':
        expect(typeof v, `${label}.${key}`).toBe('number');
        break;
      default:
        throw new Error(`Unknown schema kind: ${kind}`);
    }
  }
}

// ── Local backend round-trip locks ENTRY + CAMPAIGN_STATE shape ──────
describe('save schema — entry + campaignState (local)', () => {
  let saves;

  beforeEach(async () => {
    localStorage.clear();
    vi.resetModules();
    vi.doMock('../../src/lib/supabase.js', () => ({ supabase: null, isConfigured: false }));
    ({ saves } = await import('../../src/lib/saves.js'));
  });

  test('a loaded entry has every required ENTRY_SCHEMA field', async () => {
    const id = await saves.save({
      id: 9999,
      name: 'Schema Lock', tier: 'town',
      settlement: { name: 'Schema Lock', tier: 'town', population: 3000 },
      config: { settType: 'town', culture: 'germanic' },
      institutionToggles: { foo: { allow: true } },
      categoryToggles: {},
      goodsToggles: {},
      servicesToggles: {},
      seed: 'schema-seed',
      aiData: {},
    });
    const [loaded] = await saves.list();
    expect(loaded.id).toBe(id);
    assertShape(loaded, ENTRY_SCHEMA, 'entry');
  });

  test('campaignState block has every required field after migration', async () => {
    // Plant a v1-shaped entry (no campaignState) to exercise the
    // migration path. Loaded entry must have a complete campaignState.
    localStorage.setItem('dnd_settlement_saves', JSON.stringify([{
      id: 1, name: 'V1', tier: 'village', settlement: { name: 'V1' },
      savedAt: 1700000000000,
    }]));
    const [loaded] = await saves.list();
    expect(loaded.campaignState).toBeDefined();
    assertShape(loaded.campaignState, CAMPAIGN_STATE_SCHEMA, 'campaignState');
    // Default values land on the right fields.
    expect(loaded.campaignState.phase).toBe('draft');
    expect(loaded.campaignState.eventLog).toEqual([]);
    expect(loaded.campaignState.locks).toEqual({});
  });

  test('migration is idempotent — a v2 entry round-trips unchanged', async () => {
    const v2 = {
      id: 7, name: 'V2', tier: 'city', settlement: { name: 'V2' },
      campaignState: {
        phase: 'canon',
        eventLog: [{ id: 'ev1', type: 'CUT_TRADE_ROUTE' }],
        systemState: { resilience: { value: 55 } },
        locks: { name: true },
        generatedAt: '2026-01-01T00:00:00Z',
        editedAt:    '2026-01-02T00:00:00Z',
        canonizedAt: '2026-01-03T00:00:00Z',
        lastExportAt: null,
        narrativeDrift: null,
        exportState: null,
      },
    };
    localStorage.setItem('dnd_settlement_saves', JSON.stringify([v2]));
    const [loaded] = await saves.list();
    expect(loaded.campaignState.phase).toBe('canon');
    expect(loaded.campaignState.eventLog).toEqual(v2.campaignState.eventLog);
    expect(loaded.campaignState.canonizedAt).toBe(v2.campaignState.canonizedAt);
    assertShape(loaded.campaignState, CAMPAIGN_STATE_SCHEMA, 'campaignState');
  });

  test('schema covers every CAMPAIGN_STATE_SCHEMA key the migration default-fills', async () => {
    // Negative test: when the migration runs on a v1 entry, the resulting
    // campaignState must have at least every key listed in CAMPAIGN_STATE_SCHEMA.
    // If a future field is added without updating either the migration or
    // this schema, one of the assertions below fails.
    localStorage.setItem('dnd_settlement_saves', JSON.stringify([{ id: 1, name: 'X', tier: 'thorp', settlement: {} }]));
    const [loaded] = await saves.list();
    for (const key of Object.keys(CAMPAIGN_STATE_SCHEMA)) {
      expect(key in loaded.campaignState, `migration didn't fill campaignState.${key}`).toBe(true);
    }
  });
});

// ── Supabase row shape lock ──────────────────────────────────────────
describe('save schema — supabase row (mocked)', () => {
  let saves;
  const mockState = { lastInsert: null };

  beforeEach(async () => {
    mockState.lastInsert = null;
    vi.resetModules();
    vi.doMock('../../src/lib/supabase.js', () => ({
      supabase: {
        from: () => ({
          select: () => ({ order: () => Promise.resolve({ data: [], error: null }) }),
          insert: (row) => {
            mockState.lastInsert = row;
            return { select: () => ({ single: () => Promise.resolve({ data: { id: 'mock' }, error: null }) }) };
          },
        }),
        auth: { getUser: () => Promise.resolve({ data: { user: { id: 'u1' } } }) },
      },
      isConfigured: true,
    }));
    ({ saves } = await import('../../src/lib/saves.js'));
  });

  test('save() writes a row matching SUPABASE_ROW_SCHEMA', async () => {
    await saves.save({
      name: 'Schema Row', tier: 'metropolis',
      settlement: { name: 'Schema Row', population: 60000, neighbourNetwork: [{ id: 'n1' }] },
      config: { settType: 'metropolis' },
      institutionToggles: { x: { require: true } },
      seed: 'row-seed',
    });
    const row = mockState.lastInsert;
    expect(row).toBeTruthy();
    assertShape(row, SUPABASE_ROW_SCHEMA, 'supabase-row');
    expect(row.user_id).toBe('u1');
    expect(row.data.name).toBe('Schema Row');
    expect(row.neighbour_links).toEqual([{ id: 'n1' }]);
    // toggles bundle keeps every per-toggle key
    expect(row.toggles).toBeDefined();
    expect(row.toggles.institutionToggles).toBeDefined();
    expect(row.toggles.categoryToggles).toBeDefined();
    expect(row.toggles.goodsToggles).toBeDefined();
    expect(row.toggles.servicesToggles).toBeDefined();
  });
});
