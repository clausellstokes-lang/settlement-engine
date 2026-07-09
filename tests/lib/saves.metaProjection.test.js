/**
 * @vitest-environment jsdom
 *
 * F42 — library-list egress. Locks two contracts on src/lib/saves.js:
 *
 *   1. supabaseListMeta() is a metadata-ONLY projection: its SELECT string
 *      names none of the blob columns (data / config / toggles / ai_data /
 *      campaign_state / version_history / neighbour_links). Those are the
 *      84–220 kB-per-row payloads (plus a 50-snapshot version history) that
 *      must NOT be fetched just to paint library cards. Both backends expose the
 *      same meta contract (blob fields nulled/emptied, `isMeta` flag).
 *
 *   2. supabaseSave() resolves a neighbour back-link with a TARGETED name query
 *      (supabaseListActiveByName), never a whole-library refetch (supabaseList).
 *
 * A source-level pin guards the SELECT projection + the targeted query (they
 * survive refactors even without a live DB); mock-backed behaviour tests prove
 * the mapping and that the neighbour link still fires its batch RPC.
 */
import { describe, test, expect, beforeEach, vi } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const BLOB_COLUMNS = ['data', 'config', 'toggles', 'ai_data', 'campaign_state', 'version_history', 'neighbour_links'];

// ── Source-level contract pins ───────────────────────────────────────────────
describe('F42 — saves.js source contracts', () => {
  const source = readFileSync(resolve(process.cwd(), 'src/lib/saves.js'), 'utf-8');

  function fnBody(name) {
    const start = source.indexOf(`async function ${name}(`);
    if (start === -1) throw new Error(`${name} not found in saves.js`);
    // Grab a generous slice; the assertions below are substring checks scoped
    // to the function that follows the declaration.
    const nextFn = source.indexOf('\nasync function ', start + 1);
    return source.slice(start, nextFn === -1 ? undefined : nextFn);
  }

  test('supabaseListMeta SELECT names NO blob columns', () => {
    const body = fnBody('supabaseListMeta');
    const select = body.match(/\.select\((['"`])([\s\S]*?)\1\)/);
    expect(select, 'supabaseListMeta must call .select(...)').toBeTruthy();
    const cols = select[2];
    for (const blob of BLOB_COLUMNS) {
      expect(cols.includes(blob), `meta SELECT must NOT include blob column "${blob}"`).toBe(false);
    }
    // Sanity: it still projects the light columns cards need.
    for (const light of ['id', 'name', 'tier', 'updated_at', 'access_state']) {
      expect(cols.includes(light)).toBe(true);
    }
  });

  test('supabaseSave resolves the neighbour partner with a targeted query, not a full-library refetch', () => {
    const body = fnBody('supabaseSave');
    expect(body.includes('supabaseListActiveByName')).toBe(true);
    // The whole-library refetch (the F42 offender) must be gone from the save path.
    expect(/await\s+supabaseList\(\)/.test(body)).toBe(false);
  });

  test('supabaseListActiveByName filters by the name column (targeted, not full scan)', () => {
    const body = fnBody('supabaseListActiveByName');
    expect(/\.eq\(\s*['"]name['"]/.test(body)).toBe(true);
  });
});

// ── Local backend — meta contract ────────────────────────────────────────────
describe('F42 — listMeta (local backend)', () => {
  let saves;
  beforeEach(async () => {
    localStorage.clear();
    vi.resetModules();
    vi.doMock('../../src/lib/supabase.js', () => ({ supabase: null, isConfigured: false }));
    ({ saves } = await import('../../src/lib/saves.js'));
  });

  test('strips blob fields, keeps light fields, flags isMeta', async () => {
    await saves.save({
      id: 'a1', name: 'Rivermouth', tier: 'town',
      settlement: { name: 'Rivermouth', tier: 'town', population: 4200, npcs: [{ id: 'n1' }] },
      config: { settType: 'town' },
      aiData: { thesis: 'x' },
      versionHistory: [{ id: 'snap', settlement: { name: 'Rivermouth' } }],
    });

    const [meta] = await saves.listMeta();
    // Light fields survive.
    expect(meta.id).toBe('a1');
    expect(meta.name).toBe('Rivermouth');
    expect(meta.tier).toBe('town');
    expect(meta.isMeta).toBe(true);
    // Blob fields stripped.
    expect(meta.settlement).toBeNull();
    expect(meta.config).toBeNull();
    expect(meta.aiData).toEqual({});
    expect(meta.campaignState).toBeNull();
    expect(meta.versionHistory).toEqual([]);
  });
});

// ── Supabase backend (mocked) — projection + targeted neighbour query ────────
describe('F42 — listMeta + targeted neighbour query (supabase mocked)', () => {
  let saves;
  const mockState = { rows: [], lastRpc: null, lastSelectCols: null };

  beforeEach(async () => {
    mockState.rows = [];
    mockState.lastRpc = null;
    mockState.lastSelectCols = null;
    vi.resetModules();
    vi.doMock('../../src/lib/supabase.js', () => {
      const builder = () => {
        let selectOptions = {};
        const chain = {
          select: (cols, options = {}) => { mockState.lastSelectCols = cols; selectOptions = options || {}; return chain; },
          order: () => Promise.resolve({ data: mockState.rows, error: null }),
          eq: (col, value) => {
            const rows = mockState.rows.filter(row => row[col] === value);
            if (selectOptions?.head) return Promise.resolve({ count: rows.length, error: null });
            return Promise.resolve({ data: rows, error: null });
          },
          insert: (row) => {
            const id = `mock-${mockState.rows.length + 1}`;
            mockState.rows.push({ ...row, id, updated_at: new Date().toISOString() });
            return { select: () => ({ single: () => Promise.resolve({ data: { id }, error: null }) }) };
          },
        };
        return chain;
      };
      return {
        supabase: {
          from: () => builder(),
          rpc: (fn, args) => { mockState.lastRpc = { fn, args }; return Promise.resolve({ data: null, error: null }); },
          auth: { getUser: () => Promise.resolve({ data: { user: { id: 'u1' } } }) },
        },
        isConfigured: true,
      };
    });
    ({ saves } = await import('../../src/lib/saves.js'));
  });

  test('listMeta SELECT requests no blob columns and returns nulled blobs', async () => {
    mockState.rows.push({
      id: 'sb-1', name: 'Keeptown', tier: 'city',
      data: { name: 'Keeptown', population: 20000 },
      config: { settType: 'city' },
      ai_data: { thesis: 'y' },
      campaign_state: { phase: 'canon' },
      version_history: [{ id: 's', settlement: {} }],
      access_state: 'active',
      updated_at: new Date().toISOString(),
    });

    const [meta] = await saves.listMeta();
    // The SELECT string the projection actually asked for.
    for (const blob of BLOB_COLUMNS) {
      expect(mockState.lastSelectCols.includes(blob), `listMeta SELECT must omit "${blob}"`).toBe(false);
    }
    // Mapping nulls blob fields regardless of what a row happens to carry.
    expect(meta.settlement).toBeNull();
    expect(meta.campaignState).toBeNull();
    expect(meta.versionHistory).toEqual([]);
    expect(meta.name).toBe('Keeptown');
    expect(meta.isMeta).toBe(true);
  });

  test('neighbour save fires the batch RPC after a targeted name lookup', async () => {
    // Existing active partner.
    mockState.rows.push({
      id: 'eastgate', name: 'Eastgate', tier: 'town',
      data: { name: 'Eastgate', tier: 'town', npcs: [{ id: 'e1', name: 'Mara', role: 'Reeve', category: 'economy' }], neighbourNetwork: [], interSettlementRelationships: [] },
      access_state: 'active',
      updated_at: new Date().toISOString(),
    });

    const id = await saves.save({
      name: 'Newford', tier: 'town',
      settlement: {
        name: 'Newford', tier: 'town',
        npcs: [{ id: 'w1', name: 'Bram', role: 'Factor', category: 'economy' }],
        neighbourNetwork: [],
        neighborRelationship: { name: 'Eastgate', relationshipType: 'trade_partner', tier: 'town' },
      },
    });

    expect(id).toBeDefined();
    expect(mockState.lastRpc?.fn).toBe('mutate_settlement_batch');
    // The batch links both sides: a create (the new save) + an update (the partner).
    expect(mockState.lastRpc.args.creates).toHaveLength(1);
    expect(mockState.lastRpc.args.updates).toHaveLength(1);
    expect(mockState.lastRpc.args.updates[0].id).toBe('eastgate');
  });
});
