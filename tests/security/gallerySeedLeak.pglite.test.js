/**
 * gallerySeedLeak.pglite.test.js — the generation seed must never leave a
 * gallery read (migration 099 + the client mirrors).
 *
 * THE LEAK THIS PINS CLOSED: settlements persist the deterministic generation
 * seed as top-level `_seed`, again as `config._seed`, and the raw authoring
 * config as `_config`. With any of them, an anonymous gallery reader can
 * regenerate the FULL unsanitized settlement — every secret, plot hook and DM
 * note the sanitizers exist to strip — through the deterministic engine. The
 * pre-099 sanitizer denylist carried no seed token at all, and the DM-full
 * projection never dropped it, so get_gallery_dossier (anon-granted) and
 * import_gallery_dossier (whose 048 comment PROMISES "never the generation
 * seed") both served it.
 *
 * Three layers, mirroring how the leak was closed:
 *   1. SQL (pglite): the NET-CURRENT _gallery_sanitize_public_json AND
 *      _gallery_dm_full_json (latest-wins across migrations — 099) strip
 *      _seed / config._seed / _config while KEEPING the public config facets.
 *   2. Client projection: toPublicSafe strips the same keys in BOTH modes
 *      (the DM-share full mode skips the recursive denylist, so full mode is
 *      the layer that leaked hardest).
 *   3. Client import path: fetchDossierForImport's confidential strip drops
 *      the seed carriers without mutating the caller's row; and
 *      updateGalleryMetadata is a MERGE patch (a partial bag no longer wipes
 *      published metadata).
 */
import { describe, it, expect, vi, beforeAll, afterEach } from 'vitest';
import { PGlite } from '@electric-sql/pglite';
import { readFileSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';

vi.mock('../../src/lib/supabase.js', () => ({
  supabase: {
    from: vi.fn(),
    rpc: vi.fn(() => Promise.resolve({ data: [], error: null })),
  },
  isConfigured: true,
}));

import { supabase } from '../../src/lib/supabase.js';
import { toPublicSafe, PRIVATE_KEY_RE } from '../../src/domain/display/publicSafe.js';
import { fetchDossierForImport, updateGalleryMetadata } from '../../src/lib/gallery.js';

const MIGRATIONS_DIR = resolve(process.cwd(), 'supabase', 'migrations');

/** Latest-wins extraction of a `create or replace function` body across all
 *  migrations (file order) — same net-current discipline as
 *  gallerySanitizer.pglite.test.js, so a later recreation that re-drops the
 *  seed strip fails here, not in production. */
function netCurrentFn(name) {
  const files = readdirSync(MIGRATIONS_DIR).filter((f) => /^\d.*\.sql$/.test(f)).sort();
  const re = new RegExp(`create\\s+or\\s+replace\\s+function\\s+public\\.${name}\\b[\\s\\S]*?\\$\\$;`, 'ig');
  let last = null;
  for (const f of files) {
    const src = readFileSync(resolve(MIGRATIONS_DIR, f), 'utf-8');
    const matches = src.match(re);
    if (matches && matches.length) last = matches[matches.length - 1];
  }
  return last;
}

// A settlement shaped like what the engine persists: the three seed carriers +
// public config facets that MUST survive (tiles + the War & Faith tab read them).
const SEEDED = () => ({
  name: 'Riverbend',
  _seed: 'a1b2c3d4e5',
  _config: { tier: 'town', terrainType: 'random', _seed: 'a1b2c3d4e5' },
  config: {
    _seed: 'a1b2c3d4e5',
    terrainType: 'coastal',
    tradeRouteAccess: 'major_route',
    primaryDeitySnapshot: { name: 'Maratha' },
  },
  plotHooks: ['the heir is hidden'],
  dmNotes: 'private prep',
});

describe('SQL sanitizers strip the generation seed (net-current, pglite)', () => {
  let db;

  beforeAll(async () => {
    db = new PGlite();
    await db.exec('create schema if not exists public;');
    await db.exec(netCurrentFn('_gallery_sanitize_public_json'));
    await db.exec(netCurrentFn('_gallery_dm_full_json'));
  });

  const run = async (fn, obj) =>
    (await db.query(`select public.${fn}($1::jsonb) as out`, [JSON.stringify(obj)])).rows[0].out;

  it('_gallery_sanitize_public_json: no _seed / config._seed / _config; public config facets survive', async () => {
    const out = await run('_gallery_sanitize_public_json', SEEDED());
    expect(JSON.stringify(out)).not.toContain('a1b2c3d4e5');
    expect(out._seed).toBeUndefined();
    expect(out._config).toBeUndefined();
    expect(out.config).toBeDefined();
    expect(out.config._seed).toBeUndefined();
    // The reason config is NOT stripped wholesale: public display reads these.
    expect(out.config.terrainType).toBe('coastal');
    expect(out.config.tradeRouteAccess).toBe('major_route');
    expect(out.config.primaryDeitySnapshot).toEqual({ name: 'Maratha' });
    // Existing strips still hold (the denylist only ever grows).
    expect(out.plotHooks).toBeUndefined();
    expect(out.dmNotes).toBeUndefined();
  });

  it('_gallery_dm_full_json: the seed is confidential EVEN in the owner-opted DM-share view', async () => {
    const out = await run('_gallery_dm_full_json', SEEDED());
    expect(JSON.stringify(out)).not.toContain('a1b2c3d4e5');
    expect(out._seed).toBeUndefined();
    expect(out._config).toBeUndefined();
    expect(out.config._seed).toBeUndefined();
    expect(out.config.terrainType).toBe('coastal');
    // Full mode still reveals the DM layer the owner opted into…
    expect(out.plotHooks).toEqual(['the heir is hidden']);
    // …but never the private note space (031's guarantee, preserved).
    expect(out.dmNotes).toBeUndefined();
  });

  it('_gallery_dm_full_json: non-object config passes through untouched (drifted rows)', async () => {
    const out = await run('_gallery_dm_full_json', { name: 'X', config: 'legacy-string' });
    expect(out.config).toBe('legacy-string');
  });
});

describe('toPublicSafe strips the generation seed (client mirror)', () => {
  it('default mode: _seed / config._seed / _config gone, public config facets kept', () => {
    const out = toPublicSafe(SEEDED());
    expect(JSON.stringify(out)).not.toContain('a1b2c3d4e5');
    expect(out._seed).toBeUndefined();
    expect(out._config).toBeUndefined();
    expect(out.config).toBeDefined();
    expect(out.config._seed).toBeUndefined();
    expect(out.config.terrainType).toBe('coastal');
    expect(out.config.tradeRouteAccess).toBe('major_route');
  });

  it('full (DM-share) mode: the seed is stripped even though the denylist is skipped', () => {
    const out = toPublicSafe(SEEDED(), { full: true });
    expect(JSON.stringify(out)).not.toContain('a1b2c3d4e5');
    expect(out._seed).toBeUndefined();
    expect(out._config).toBeUndefined();
    expect(out.config._seed).toBeUndefined();
    expect(out.config.terrainType).toBe('coastal');
    expect(out.plotHooks).toEqual(['the heir is hidden']); // owner opted in
  });

  it('never mutates the input (config is cloned before its seed dies)', () => {
    const input = SEEDED();
    toPublicSafe(input);
    toPublicSafe(input, { full: true });
    expect(input._seed).toBe('a1b2c3d4e5');
    expect(input.config._seed).toBe('a1b2c3d4e5');
    expect(input._config._seed).toBe('a1b2c3d4e5');
  });

  it('PRIVATE_KEY_RE carries the seed token (any-depth, any-variant strip)', () => {
    for (const k of ['_seed', 'seed', '_regenSeed', 'rngSeed']) {
      expect(PRIVATE_KEY_RE.test(k)).toBe(true);
    }
  });
});

describe('gallery.js — import strip + metadata merge-patch', () => {
  afterEach(() => vi.clearAllMocks());

  it('fetchDossierForImport drops _seed / config._seed / _config without mutating the row', async () => {
    const data = SEEDED();
    supabase.rpc.mockResolvedValueOnce({ data: [{ id: '1', name: 'Riverbend', tier: 'town', data }], error: null });
    const out = await fetchDossierForImport('slug-1');
    expect(out.settlement._seed).toBeUndefined();
    expect(out.settlement._config).toBeUndefined();
    expect(out.settlement.config._seed).toBeUndefined();
    expect(out.settlement.config.terrainType).toBe('coastal');
    // The strip must not reach back into the RPC row (shared references).
    expect(data.config._seed).toBe('a1b2c3d4e5');
  });

  it('updateGalleryMetadata with a partial bag patches ONLY the provided fields', async () => {
    const update = vi.fn().mockReturnThis();
    const eq = vi.fn().mockResolvedValue({ error: null });
    supabase.from.mockReturnValueOnce({ update, eq });
    await updateGalleryMetadata('s1', { importable: true });
    const patch = update.mock.calls[0][0];
    expect(patch.gallery_importable).toBe(true);
    expect(patch.gallery_updated_at).toBeTruthy();
    // The old unconditional shape wiped these on every partial write.
    for (const k of ['gallery_description', 'gallery_image_url', 'gallery_image_alt', 'gallery_tags']) {
      expect(patch).not.toHaveProperty(k);
    }
  });

  it('an explicitly provided empty value still clears its column (omission preserves, empties clear)', async () => {
    const update = vi.fn().mockReturnThis();
    const eq = vi.fn().mockResolvedValue({ error: null });
    supabase.from.mockReturnValueOnce({ update, eq });
    await updateGalleryMetadata('s1', { description: '', imageUrl: '' });
    const patch = update.mock.calls[0][0];
    expect(patch.gallery_description).toBeNull();
    expect(patch.gallery_image_url).toBeNull();
    expect(patch).not.toHaveProperty('gallery_tags');
  });
});
