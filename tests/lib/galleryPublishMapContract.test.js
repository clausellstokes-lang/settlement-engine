/**
 * @vitest-environment jsdom
 *
 * tests/lib/galleryPublishMapContract.test.js — client↔RPC param-parity for
 * publish_map (finding components-commerce-2).
 *
 * THE BUG THIS CATCHES: shareMap() forwarded only 4 of publish_map's 12 params, so
 * the first publish of a campaign map silently dropped the configured world
 * snapshot, section toggles, cover image + alt, importable flag, realm-arc summary
 * and facets. This is a class defect — a *future* RPC param added to publish_map
 * would silently drop the same way unless the client keeps up.
 *
 * THE GUARD: parse the live migration's publish_map signature and assert the exact
 * set of params the client sends (target_id + publishMapParams) equals it. Add a
 * param server-side without wiring it in publishMapParams → this fails.
 */

import { describe, test, expect } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { publishMapParams } from '../../src/lib/gallery.js';

const MIGRATIONS_DIR = join(dirname(fileURLToPath(import.meta.url)), '..', '..', 'supabase', 'migrations');

/**
 * Find the highest-numbered migration that (re)defines public.publish_map and
 * return the ordered list of its parameter names. Scanning the latest definition
 * (not a hard-coded file) means a future migration that adds a param is what the
 * client is measured against — the whole point of the guard.
 */
function latestPublishMapSignatureParams() {
  const defRe = /create\s+or\s+replace\s+function\s+public\.publish_map\s*\(/i;
  const files = readdirSync(MIGRATIONS_DIR)
    .filter(f => f.endsWith('.sql'))
    .sort(); // numeric zero-padded prefixes sort lexicographically in order
  let chosen = null;
  for (const f of files) {
    const sql = readFileSync(join(MIGRATIONS_DIR, f), 'utf8');
    if (defRe.test(sql)) chosen = { f, sql };
  }
  if (!chosen) throw new Error('No migration defines public.publish_map');

  const start = chosen.sql.search(defRe);
  const open = chosen.sql.indexOf('(', start);
  const close = chosen.sql.indexOf(') returns', open);
  const body = chosen.sql.slice(open + 1, close);
  const params = body
    .split(',')
    .map(line => line.trim())
    .filter(Boolean)
    // Each param line begins with the name, e.g. "p_world_sections    jsonb default null".
    .map(line => line.split(/\s+/)[0])
    .filter(name => /^[a-z_]+$/i.test(name));
  return { file: chosen.f, params };
}

describe('publish_map client↔RPC param parity', () => {
  test('shareMap forwards exactly the migration signature params', () => {
    const { file, params: signatureParams } = latestPublishMapSignatureParams();
    // shareMap calls supabase.rpc('publish_map', { target_id, ...publishMapParams(opts) }).
    const clientParams = ['target_id', ...Object.keys(publishMapParams({}))];

    const sig = new Set(signatureParams);
    const client = new Set(clientParams);

    const missingFromClient = [...sig].filter(p => !client.has(p));
    const extraOnClient = [...client].filter(p => !sig.has(p));

    expect(
      missingFromClient,
      `publish_map params in ${file} not forwarded by shareMap/publishMapParams — they would silently drop`,
    ).toEqual([]);
    expect(
      extraOnClient,
      `client sends params ${file}'s publish_map does not declare — the RPC would reject`,
    ).toEqual([]);
  });

  test('a full share-opts bag maps every metadata field through (not just kind/description/tags)', () => {
    const p = publishMapParams({
      kind: 'map_with_campaign',
      description: 'A living realm',
      tags: ['Trade', 'war!!'],
      importable: true,
      imageUrl: 'https://example.com/cover.jpg',
      imageAlt: 'the map',
      shareWorld: true,
      worldSections: ['worldClock', 'chronicle', 'not-a-section'],
      worldSnapshot: { schemaVersion: 1, clock: {} },
      realmArcSummary: 'The long war',
      facets: { memberBand: 'small', atWar: true },
    });
    expect(p.p_kind).toBe('map_with_campaign');
    expect(p.p_description).toBe('A living realm');
    // clampTags lowercases + strips punctuation (parity with the edit path).
    expect(p.p_tags).toEqual(['trade', 'war']);
    expect(p.p_importable).toBe(true);
    expect(p.p_image_url).toBe('https://example.com/cover.jpg');
    expect(p.p_image_alt).toBe('the map');
    expect(p.p_share_world).toBe(true);
    // Unknown section keys are dropped to the bounded allowlist.
    expect(p.p_world_sections).toEqual(['worldClock', 'chronicle']);
    expect(p.p_world_snapshot).toEqual({ schemaVersion: 1, clock: {} });
    expect(p.p_realm_arc_summary).toBe('The long war');
    expect(p.p_facets).toEqual({ memberBand: 'small', atWar: true });
  });

  test('omitted metadata forwards null so the RPC preserves prior values (preserve-on-omit)', () => {
    const p = publishMapParams({ kind: 'map', description: '', tags: null });
    expect(p.p_importable).toBeNull();
    expect(p.p_image_url).toBeNull();
    expect(p.p_share_world).toBeNull();
    expect(p.p_world_snapshot).toBeNull();
    expect(p.p_realm_arc_summary).toBeNull();
    expect(p.p_facets).toBeNull();
    // An unsafe cover URL is never forwarded.
    expect(publishMapParams({ imageUrl: 'javascript:alert(1)' }).p_image_url).toBeNull();
  });
});
