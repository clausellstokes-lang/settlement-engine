/**
 * galleryCampaignTiles.pglite.test.js — EXECUTION tests for migration 149
 * (the Campaigns-tab server surface, GALLERY-2 phase 2).
 *
 * The REAL 149 SQL runs wholesale in in-process Postgres (147 applied first for
 * the columns + CHECKs). Stubs: auth.uid()/account_is_active (settable GUCs,
 * the actionVelocity idiom), _make_public_slug (deterministic counter),
 * _gallery_world_snapshot_is_safe (true — its scanner has its own suite).
 * Pinned here:
 *
 *   • publish_map stamps gallery_facet_aliveness / gallery_facet_world_age
 *     from p_facets on BOTH branches (first publish + re-publish), with
 *     preserve-on-omit (coalesce(new, current)) and degrade-to-null on a
 *     malformed bag (digits-only aliveness clamp 0-100; age-band vocabulary).
 *   • every 089 gate SURVIVES the 149 fork: anon rejected, banned rejected,
 *     non-owner rejected, the member-ownership IDOR guard rejects a campaign
 *     naming someone else's settlement.
 *   • list_gallery_maps projects at_war / world_age / aliveness onto tiles,
 *     honors the kind facet (the Campaigns tab's query), and keeps NULL
 *     aliveness NULL.
 */
import { describe, it, expect, beforeAll, beforeEach } from 'vitest';
import { PGlite } from '@electric-sql/pglite';
import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

const PGLITE_BOOT_TIMEOUT_MS = 180_000; // deadlock guard, not a perf budget — never tune to a measured boot (see pgliteHookTimeoutRatchet.test.js)

const dir = resolve(process.cwd(), 'supabase', 'migrations');
const MIG_146 = resolve(dir, '146_gallery_title_aliveness_columns.sql');
const MIG_148 = resolve(dir, '148_gallery_maps_campaign_tiles.sql');
const allExist = existsSync(MIG_146) && existsSync(MIG_148);

const OWNER = '11111111-1111-1111-1111-111111111111';
const OTHER = '22222222-2222-2222-2222-222222222222';
const MAP1 = '33333333-3333-3333-3333-333333333333';
const SETT1 = '44444444-4444-4444-4444-444444444444';
const FOREIGN_SETT = '55555555-5555-5555-5555-555555555555';

let db;
const asUser = (uid) => db.exec(`set test.uid = '${uid}';`);
const asAnon = () => db.exec(`set test.uid = '';`);
const setActive = (v) => db.exec(`set test.active = '${v}';`);
const one = async (q) => (await db.query(q)).rows[0];
const rows = async (q) => (await db.query(q)).rows;
const publish = (facetsJson, kind = 'map_with_campaign') =>
  db.query(`select public.publish_map('${MAP1}', '${kind}', null, null, null, null, null, null, null, null, null, ${facetsJson ? `'${facetsJson}'::jsonb` : 'null'})`);

describe('gallery campaign-tiles migration fixtures exist (guards against silent vacuous skip)', () => {
  it('147 + 149 are present (a renamed/renumbered file must fail loudly)', () => {
    expect(existsSync(MIG_146), `missing: ${MIG_146}`).toBe(true);
    expect(existsSync(MIG_148), `missing: ${MIG_148}`).toBe(true);
  });
});

describe.runIf(allExist)('publish_map + list_gallery_maps — execution against the real 149 SQL (pglite)', () => {
  beforeAll(async () => {
    db = new PGlite();
    await db.exec(`
      do $roles$ begin
        if not exists (select 1 from pg_roles where rolname = 'authenticated') then create role authenticated; end if;
        if not exists (select 1 from pg_roles where rolname = 'anon') then create role anon; end if;
      end $roles$;
      create schema if not exists auth;
      create or replace function auth.uid() returns uuid language sql stable as $fn$
        select nullif(current_setting('test.uid', true), '')::uuid
      $fn$;
      create or replace function public.account_is_active(p uuid) returns boolean language sql stable as $fn$
        select coalesce(nullif(current_setting('test.active', true), '')::boolean, true)
      $fn$;
      -- Deterministic slug mint (the real one is random base36).
      create sequence public._slug_seq;
      create or replace function public._make_public_slug() returns text language sql volatile as $fn$
        select 'slug-' || nextval('public._slug_seq')::text
      $fn$;
      -- The snapshot scanner has its own dedicated suite; stub true here.
      create or replace function public._gallery_world_snapshot_is_safe(j jsonb) returns boolean
        language sql immutable as $fn$ select true $fn$;

      create table public.settlements (
        id uuid primary key,
        user_id uuid,
        access_state text default 'active'
      );
      create table public.profiles (id uuid primary key, external_name text);
      -- saved_maps: every column publish_map/list_gallery_maps touches (pre-147).
      create table public.saved_maps (
        id uuid primary key,
        user_id uuid,
        name text,
        map_data jsonb default '{}'::jsonb,
        is_public boolean not null default false,
        public_slug text,
        published_at timestamptz,
        view_count integer not null default 0,
        import_count integer not null default 0,
        share_kind text not null default 'map',
        gallery_share_campaign boolean not null default false,
        gallery_description text,
        gallery_tags text[],
        gallery_importable boolean default false,
        gallery_image_url text,
        gallery_image_alt text,
        gallery_share_world boolean default false,
        gallery_world_sections jsonb default '[]'::jsonb,
        gallery_world_snapshot jsonb,
        gallery_realm_arc_summary text,
        gallery_facet_member_band text,
        gallery_facet_at_war boolean,
        gallery_facet_dominant_culture text,
        gallery_facet_tier_spread text
      );
      create unique index saved_maps_public_slug_unique on public.saved_maps (public_slug) where public_slug is not null;
    `);
    await db.exec(readFileSync(MIG_146, 'utf-8'));
    await db.exec(readFileSync(MIG_148, 'utf-8'));
  }, PGLITE_BOOT_TIMEOUT_MS);

  beforeEach(async () => {
    await db.exec('truncate public.saved_maps, public.settlements, public.profiles cascade; alter sequence public._slug_seq restart;');
    await db.exec(`
      insert into public.profiles (id, external_name) values ('${OWNER}', 'Keeper of Maps');
      insert into public.settlements (id, user_id) values ('${SETT1}', '${OWNER}'), ('${FOREIGN_SETT}', '${OTHER}');
      insert into public.saved_maps (id, user_id, name, map_data) values
        ('${MAP1}', '${OWNER}', 'The Reach',
         '{"campaign": {"settlementIds": ["${SETT1}"], "mapState": {}}}'::jsonb);
    `);
    await asUser(OWNER);
    await setActive('true');
  });

  it('stamps aliveness + world age from p_facets on FIRST publish', async () => {
    await publish('{"aliveness": 87, "worldAge": "this-year", "atWar": true, "memberBand": "small-realm"}');
    const row = await one(`select gallery_facet_aliveness a, gallery_facet_world_age w, gallery_facet_at_war war from public.saved_maps where id = '${MAP1}'`);
    expect(row).toEqual({ a: 87, w: 'this-year', war: true });
  });

  it('preserve-on-omit: a re-publish whose bag omits the facets keeps the prior stamps', async () => {
    await publish('{"aliveness": 87, "worldAge": "this-year"}');
    await publish('{"atWar": false}'); // re-publish, phase-2 facets omitted
    const row = await one(`select gallery_facet_aliveness a, gallery_facet_world_age w from public.saved_maps where id = '${MAP1}'`);
    expect(row).toEqual({ a: 87, w: 'this-year' });
  });

  it('degrades a malformed bag to null instead of aborting: non-digit aliveness, unknown band', async () => {
    await publish('{"aliveness": "very", "worldAge": "the-before-times"}');
    const row = await one(`select gallery_facet_aliveness a, gallery_facet_world_age w, is_public p from public.saved_maps where id = '${MAP1}'`);
    expect(row).toEqual({ a: null, w: null, p: true }); // publish still succeeded
    // Digits beyond 100 clamp rather than tripping the 147 CHECK.
    await publish('{"aliveness": 400}');
    expect((await one(`select gallery_facet_aliveness a from public.saved_maps where id = '${MAP1}'`)).a).toBe(100);
  });

  it('every 089 gate survives the fork: anon, banned, non-owner, member-IDOR', async () => {
    await asAnon();
    await expect(publish('{"aliveness": 1}')).rejects.toThrow(/not authenticated/i);
    await asUser(OWNER);
    await setActive('false');
    await expect(publish('{"aliveness": 1}')).rejects.toThrow(/account is not active/i);
    await setActive('true');
    await asUser(OTHER);
    await expect(publish('{"aliveness": 1}')).rejects.toThrow(/not found or not owned/i);
    // IDOR guard: a campaign naming someone else's settlement is rejected.
    await asUser(OWNER);
    await db.exec(`update public.saved_maps set map_data = '{"campaign": {"settlementIds": ["${FOREIGN_SETT}"]}}'::jsonb where id = '${MAP1}'`);
    await expect(publish('{"aliveness": 1}')).rejects.toThrow(/settlements you do not own/i);
  });

  it('list_gallery_maps projects at_war / world_age / aliveness and honors the kind facet (the Campaigns tab query)', async () => {
    await publish('{"aliveness": 87, "worldAge": "this-year", "atWar": true}');
    // A second, blank-map share with no facets.
    await db.exec(`
      insert into public.saved_maps (id, user_id, name, is_public, public_slug, published_at, share_kind)
      values ('${SETT1}', '${OWNER}', 'Blank Vale', true, 'slug-blank', now(), 'map');
    `);
    const campaigns = await rows(`select * from public.list_gallery_maps(0, 24, 'newest', '', '{"kind": ["map_with_campaign"]}'::jsonb)`);
    expect(campaigns).toHaveLength(1);
    expect(campaigns[0]).toMatchObject({
      name: 'The Reach', kind: 'map_with_campaign',
      at_war: true, world_age: 'this-year', aliveness: 87,
      member_count: 1, author_name: 'Keeper of Maps',
    });
    const blanks = await rows(`select name, at_war, world_age, aliveness from public.list_gallery_maps(0, 24, 'newest', '', '{"kind": ["map"]}'::jsonb)`);
    expect(blanks).toHaveLength(1);
    expect(blanks[0]).toEqual({ name: 'Blank Vale', at_war: false, world_age: null, aliveness: null });
  });
});
