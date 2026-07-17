/**
 * @vitest-environment jsdom
 *
 * Gallery opt-in round-trip — locks the two owner opt-in columns
 * (gallery_importable, gallery_member_overrides) into BOTH library list
 * projections in src/lib/saves.js.
 *
 * Why this exists: ShareToGallery seeds its importable/member-override state
 * from the loaded save entry and its metadata bag always carries both keys
 * (updateGalleryMetadata writes them on every "Save gallery details"). Before
 * this pin, supabaseList/supabaseListMeta selected neither column, so after a
 * page reload the entry carried `undefined`, the component seeded
 * false / {}, and saving ANY gallery detail silently cleared the owner's
 * import opt-in and every per-member visibility override (data loss).
 *
 * What it locks:
 *   1. Both SELECT strings name gallery_importable AND gallery_member_overrides.
 *   2. Both row mappings carry the values through (true stays true; a keyed
 *      override map survives verbatim).
 *   3. Legacy rows (columns null/absent — pre-047/092 writes) map to the safe
 *      defaults: importable false, overrides null.
 */
import { describe, test, expect, beforeEach, vi } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const OPT_IN_COLUMNS = ['gallery_importable', 'gallery_member_overrides'];

// ── Source-level contract pins ───────────────────────────────────────────────
describe('gallery opt-ins — saves.js SELECT contracts', () => {
  const source = readFileSync(resolve(process.cwd(), 'src/lib/saves.js'), 'utf-8');

  function fnBody(name) {
    const start = source.indexOf(`async function ${name}(`);
    if (start === -1) throw new Error(`${name} not found in saves.js`);
    const nextFn = source.indexOf('\nasync function ', start + 1);
    return source.slice(start, nextFn === -1 ? undefined : nextFn);
  }

  for (const fn of ['supabaseList', 'supabaseListMeta']) {
    test(`${fn} SELECT names both gallery opt-in columns`, () => {
      const body = fnBody(fn);
      const select = body.match(/\.select\((['"`])([\s\S]*?)\1\)/);
      expect(select, `${fn} must call .select(...)`).toBeTruthy();
      for (const col of OPT_IN_COLUMNS) {
        expect(select[2].includes(col), `${fn} SELECT must include "${col}"`).toBe(true);
      }
    });
  }
});

// ── Supabase backend (mocked) — mapping round-trip ───────────────────────────
describe('gallery opt-ins — list/listMeta mapping (supabase mocked)', () => {
  let saves;
  const mockState = { rows: [] };
  const OVERRIDES = { 'npc-1': { revealDm: true }, 'npc-2': { allowImport: false } };

  beforeEach(async () => {
    mockState.rows = [];
    vi.resetModules();
    vi.doMock('../../src/lib/supabase.js', () => {
      const builder = () => {
        const chain = {
          select: () => chain,
          order: () => Promise.resolve({ data: mockState.rows, error: null }),
          eq: () => Promise.resolve({ data: [], error: null }),
        };
        return chain;
      };
      return {
        supabase: {
          from: () => builder(),
          rpc: () => Promise.resolve({ data: null, error: null }),
          auth: { getUser: () => Promise.resolve({ data: { user: { id: 'u1' } } }) },
        },
        isConfigured: true,
      };
    });
    ({ saves } = await import('../../src/lib/saves.js'));
  });

  function pushRow(extra = {}) {
    mockState.rows.push({
      id: 'sb-1', name: 'Rivermouth', tier: 'town',
      data: { name: 'Rivermouth', tier: 'town', npcs: [] },
      config: { settType: 'town' },
      access_state: 'active',
      is_public: true, public_slug: 'rivermouth',
      updated_at: new Date().toISOString(),
      ...extra,
    });
  }

  for (const method of ['list', 'listMeta']) {
    test(`${method}() carries an opted-in row's importable flag + member overrides`, async () => {
      pushRow({ gallery_importable: true, gallery_member_overrides: OVERRIDES });
      const [entry] = await saves[method]();
      expect(entry.gallery_importable).toBe(true);
      expect(entry.gallery_member_overrides).toEqual(OVERRIDES);
    });

    test(`${method}() maps a legacy row (columns absent) to false / null`, async () => {
      pushRow();
      const [entry] = await saves[method]();
      expect(entry.gallery_importable).toBe(false);
      expect(entry.gallery_member_overrides).toBeNull();
    });
  }
});
