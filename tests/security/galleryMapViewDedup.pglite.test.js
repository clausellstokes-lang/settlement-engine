/**
 * galleryMapViewDedup.pglite.test.js — EXECUTION test for get_gallery_map's
 * de-duplicated view counter (migration 050 §2).
 *
 * 046 regressed 029's dedup: the maps gallery bumped view_count on EVERY
 * anonymous read, so one reader refreshing (or a crawler) inflated the number.
 * 050 re-applies the 029 pattern via a sibling ledger (gallery_map_views): the
 * counter climbs only on a genuinely new (map, viewer, UTC day) triple.
 *
 * Loads the REAL, net-current get_gallery_map body from 050 into pglite. The
 * kind='map' path only reaches _gallery_map_backdrop, so that's the only helper
 * stubbed; auth.uid() is a settable GUC seam (mirrors creditLedger.pglite.test).
 * request.headers is unset here, so the User-Agent is null → treated as a real
 * (non-bot) viewer, which is exactly what we want to dedup.
 */

import { describe, it, expect, beforeAll, beforeEach } from 'vitest';
import { PGlite } from '@electric-sql/pglite';
import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

const MIGRATION = resolve(process.cwd(), 'supabase', 'migrations', '050_money_and_public_projection_hardening.sql');
const migExists = existsSync(MIGRATION);

function extractFn(sql, name) {
  const m = sql.match(new RegExp(`create\\s+or\\s+replace\\s+function\\s+public\\.${name}\\b[\\s\\S]*?\\$\\$;`, 'i'));
  if (!m) throw new Error(`could not extract ${name} from migration 050`);
  return m[0];
}

const UID_A = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';
const UID_B = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb';
const OWNER = 'cccccccc-cccc-cccc-cccc-cccccccccccc';
const MAP_ID = 'dddddddd-dddd-dddd-dddd-dddddddddddd';

let db;
const asUser = (uid) => db.exec(`set test.uid = '${uid}';`);
const scalar = async (q) => (await db.query(q)).rows[0];
const viewCount = async () => (await scalar(`select view_count from public.saved_maps where id='${MAP_ID}'`)).view_count;
const callMap = () => db.query(`select public.get_gallery_map('map-slug') as r`);

describe.runIf(migExists)('get_gallery_map — de-duplicated view count (pglite)', () => {
  beforeAll(async () => {
    db = new PGlite();
    const sql = readFileSync(MIGRATION, 'utf-8');
    await db.exec(`
      create schema if not exists auth;
      create or replace function auth.uid() returns uuid language sql stable as $fn$
        select nullif(current_setting('test.uid', true), '')::uuid
      $fn$;
      create table public.saved_maps (
        id uuid primary key, user_id uuid not null, name text,
        public_slug text, is_public boolean not null default false,
        view_count integer not null default 0,
        share_kind text not null default 'map',
        gallery_share_campaign boolean not null default false,
        gallery_description text, gallery_tags text[],
        map_data jsonb not null default '{}'::jsonb
      );
      -- kind='map' path only touches this helper; stub it.
      create or replace function public._gallery_map_backdrop(p jsonb)
        returns jsonb language sql immutable as $fn$ select '{}'::jsonb $fn$;
    `);
    // The dedup ledger + the real net-current read RPC, verbatim from 050.
    const tableMatch = sql.match(/create table if not exists public\.gallery_map_views[\s\S]*?\);/i);
    if (!tableMatch) throw new Error('could not extract gallery_map_views table');
    await db.exec(tableMatch[0]);
    await db.exec(extractFn(sql, 'get_gallery_map'));
  });

  beforeEach(async () => {
    await db.exec('truncate public.saved_maps, public.gallery_map_views cascade;');
    await db.exec(`insert into public.saved_maps (id, user_id, name, public_slug, is_public, view_count)
      values ('${MAP_ID}', '${OWNER}', 'Test Map', 'map-slug', true, 0);`);
    await asUser(''); // anonymous by default
  });

  it('increments once on the first view', async () => {
    await callMap();
    expect(await viewCount()).toBe(1);
  });

  it('two identical calls from the same viewer count as ONE view (029 dedup)', async () => {
    await callMap();
    await callMap();
    expect(await viewCount()).toBe(1);
    expect((await scalar(`select count(*)::int n from public.gallery_map_views`)).n).toBe(1);
  });

  it('a distinct signed-in viewer bumps the counter again', async () => {
    await asUser(UID_A); await callMap();
    await asUser(UID_A); await callMap(); // repeat: no-op
    await asUser(UID_B); await callMap(); // new viewer: +1
    expect(await viewCount()).toBe(2);
  });

  it('returns null for a slug that is not public', async () => {
    await db.exec(`update public.saved_maps set is_public=false where id='${MAP_ID}';`);
    const { r } = await scalar(`select public.get_gallery_map('map-slug') as r`);
    expect(r).toBeNull();
    expect(await viewCount()).toBe(0); // unchanged
  });
});
