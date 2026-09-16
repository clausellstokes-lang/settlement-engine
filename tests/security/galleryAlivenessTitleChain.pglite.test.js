/**
 * galleryAlivenessTitleChain.pglite.test.js — EXECUTION tests for migration 148
 * (the GALLERY-2 phase-2 tile-chain recreate) + the 147 columns.
 *
 * The REAL migration SQL runs in in-process Postgres: 147 (columns +
 * constraints) applies verbatim; 148 applies WHOLESALE (all five functions,
 * drop order included). Table mirrors carry every column the chain reads.
 * The 092/093 sanitizer twins (_gallery_dm_full_json /
 * _gallery_sanitize_public_json / _gallery_apply_member_overrides /
 * _gallery_chronicle_json) are IDENTITY/EMPTY stubs here — their projection
 * parity has its own dedicated suites (gallerySanitize*.pglite, migration 142
 * twin parity); THIS file pins the phase-2 plumbing:
 *
 *   • the title chokepoint — coalesce(nullif(btrim(gallery_title),''), name)
 *     in the helper, inherited by list + dossier + search (blank/whitespace
 *     titles fall back).
 *   • aliveness flows helper → list → more-by-creator → my → dossier; NULL
 *     stays NULL (never fake-zero).
 *   • 'most_alive' sorts desc with un-stamped rows LAST.
 *   • the relevance term caps at +10 and orders a lived-in world above an
 *     identical fresh one under 'relevant'.
 *   • reactions aggregate onto tile rows as {key: count}, '{}' when none.
 *   • the 147 CHECK constraints (0–100 range, world-age vocabulary) bite.
 */
import { describe, it, expect, beforeAll, beforeEach } from 'vitest';
import { PGlite } from '@electric-sql/pglite';
import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

const PGLITE_BOOT_TIMEOUT_MS = 180_000; // deadlock guard, not a perf budget — never tune to a measured boot (see pgliteHookTimeoutRatchet.test.js)

const dir = resolve(process.cwd(), 'supabase', 'migrations');
const MIG_146 = resolve(dir, '146_gallery_title_aliveness_columns.sql');
const MIG_147 = resolve(dir, '147_gallery_tile_chain_aliveness_title_reactions.sql');
const allExist = existsSync(MIG_146) && existsSync(MIG_147);

const OWNER = '11111111-1111-1111-1111-111111111111';
const READER = '22222222-2222-2222-2222-222222222222';
const S1 = '33333333-3333-3333-3333-333333333333'; // titled, alive 100
const S2 = '44444444-4444-4444-4444-444444444444'; // untitled, alive 40
const S3 = '55555555-5555-5555-5555-555555555555'; // never stamped (null)

let db;
const rows = async (q) => (await db.query(q)).rows;
const one = async (q) => (await db.query(q)).rows[0];

describe('gallery phase-2 chain fixtures exist (guards against silent vacuous skip)', () => {
  it('147 + 148 are present (a renamed/renumbered file must fail loudly)', () => {
    expect(existsSync(MIG_146), `missing: ${MIG_146}`).toBe(true);
    expect(existsSync(MIG_147), `missing: ${MIG_147}`).toBe(true);
  });
});

describe.runIf(allExist)('gallery aliveness/title/reactions chain — execution against the real SQL (pglite)', () => {
  beforeAll(async () => {
    db = new PGlite();
    await db.exec(`
      -- The Supabase grant targets (absent in bare pglite; the migrations'
      -- GRANT/REVOKE statements need them to exist).
      do $roles$ begin
        if not exists (select 1 from pg_roles where rolname = 'authenticated') then create role authenticated; end if;
        if not exists (select 1 from pg_roles where rolname = 'anon') then create role anon; end if;
        if not exists (select 1 from pg_roles where rolname = 'service_role') then create role service_role; end if;
      end $roles$;
      create schema if not exists auth;
      create or replace function auth.uid() returns uuid language sql stable as $fn$
        select nullif(current_setting('test.uid', true), '')::uuid
      $fn$;

      -- Pre-147 mirrors of every column the chain reads.
      create table public.settlements (
        id uuid primary key,
        user_id uuid,
        name text,
        tier text,
        data jsonb default '{}'::jsonb,
        is_public boolean not null default false,
        public_slug text,
        published_at timestamptz default now(),
        updated_at timestamptz default now(),
        view_count integer default 0,
        is_curated boolean default false,
        gallery_description text,
        gallery_image_url text,
        gallery_image_alt text,
        gallery_tags text[] default '{}',
        gallery_updated_at timestamptz,
        gallery_share_narrated boolean default false,
        gallery_share_dm boolean default false,
        gallery_importable boolean default false,
        gallery_member_overrides jsonb,
        gallery_facet_culture text,
        gallery_facet_prosperity text,
        gallery_facet_deity text,
        gallery_facet_at_war boolean,
        campaign_state jsonb,
        ai_data jsonb
      );
      create table public.saved_maps (id uuid primary key);
      create table public.profiles (id uuid primary key, external_name text);
      create table public.gallery_votes (
        settlement_id uuid not null, user_id uuid not null,
        created_at timestamptz default now(),
        primary key (settlement_id, user_id)
      );
      create table public.gallery_comments (
        id uuid primary key default gen_random_uuid(),
        settlement_id uuid not null, user_id uuid not null,
        body text, deleted_at timestamptz
      );
      create table public.gallery_reactions (
        settlement_id uuid not null, user_id uuid not null,
        reaction_key text not null, created_at timestamptz default now(),
        primary key (settlement_id, user_id, reaction_key)
      );

      -- Identity/empty stubs for the 092/093 sanitizer twins (their parity has
      -- its own suites; this file pins the phase-2 plumbing only).
      create or replace function public._gallery_dm_full_json(j jsonb) returns jsonb
        language sql immutable as $fn$ select j $fn$;
      create or replace function public._gallery_sanitize_public_json(j jsonb) returns jsonb
        language sql immutable as $fn$ select j $fn$;
      create or replace function public._gallery_apply_member_overrides(
        base jsonb, dm_full jsonb, overrides jsonb,
        settlement_share_dm boolean, settlement_importable boolean, for_import boolean
      ) returns jsonb language sql immutable as $fn$ select base $fn$;
      create or replace function public._gallery_chronicle_json(j jsonb) returns jsonb
        language sql immutable as $fn$ select '[]'::jsonb $fn$;
    `);
    // The REAL migrations, wholesale.
    await db.exec(readFileSync(MIG_146, 'utf-8'));
    await db.exec(readFileSync(MIG_147, 'utf-8'));
  }, PGLITE_BOOT_TIMEOUT_MS);

  beforeEach(async () => {
    await db.exec(`
      truncate public.settlements, public.profiles, public.gallery_votes,
               public.gallery_comments, public.gallery_reactions cascade;
      set test.uid = '';
    `);
    await db.exec(`
      insert into public.profiles (id, external_name) values ('${OWNER}', 'Keeper of Maps');
      insert into public.settlements
        (id, user_id, name, tier, is_public, public_slug, published_at, gallery_title, gallery_facet_aliveness)
      values
        ('${S1}', '${OWNER}', 'Thornwick', 'town', true, 'slug-one',   now() - interval '3 days', 'The Bastion of Thornwick', 100),
        ('${S2}', '${OWNER}', 'Emberfall', 'village', true, 'slug-two', now() - interval '2 days', null, 40),
        ('${S3}', '${OWNER}', 'Greyhollow', 'hamlet', true, 'slug-three', now() - interval '1 day', '   ', null);
    `);
  });

  it('title chokepoint: the helper name is the gallery title, blank/whitespace falls back to the settlement name', async () => {
    const tiles = await rows('select id, name from public._gallery_public_tile_rows() order by name');
    const byId = Object.fromEntries(tiles.map(t => [t.id, t.name]));
    expect(byId[S1]).toBe('The Bastion of Thornwick');
    expect(byId[S2]).toBe('Emberfall');
    expect(byId[S3]).toBe('Greyhollow'); // whitespace-only title falls back
  });

  it('search matches the DISPLAYED title (and the dossier + list inherit it)', async () => {
    const hits = await rows(`select name from public.list_gallery_dossiers(0, 24, 'relevant', 'Bastion', '{}'::jsonb, false)`);
    expect(hits.map(h => h.name)).toEqual(['The Bastion of Thornwick']);
    const dossier = await one(`select name, aliveness from public.get_gallery_dossier('slug-one')`);
    expect(dossier.name).toBe('The Bastion of Thornwick');
    expect(dossier.aliveness).toBe(100);
  });

  it('aliveness flows the whole chain and NULL stays NULL (never fake-zero)', async () => {
    const tiles = await rows('select id, aliveness from public._gallery_public_tile_rows()');
    const byId = Object.fromEntries(tiles.map(t => [t.id, t.aliveness]));
    expect(byId[S1]).toBe(100);
    expect(byId[S2]).toBe(40);
    expect(byId[S3]).toBeNull();
    const dossier3 = await one(`select aliveness from public.get_gallery_dossier('slug-three')`);
    expect(dossier3.aliveness).toBeNull();
  });

  it("'most_alive' sorts desc with un-stamped rows LAST", async () => {
    const list = await rows(`select public_slug from public.list_gallery_dossiers(0, 24, 'most_alive', '', '{}'::jsonb, false)`);
    expect(list.map(r => r.public_slug)).toEqual(['slug-one', 'slug-two', 'slug-three']);
  });

  it('the relevance term is a MILD nudge: capped at +10, lifts a lived-in world over an identical fresh one', async () => {
    // Two identical rows except aliveness; equalize published_at so recency ties.
    await db.exec(`
      update public.settlements set published_at = now(), gallery_updated_at = now();
      update public.settlements set gallery_facet_aliveness = 0 where id = '${S2}';
    `);
    const list = await rows(`select public_slug, aliveness from public.list_gallery_dossiers(0, 24, 'relevant', '', '{}'::jsonb, false)`);
    expect(list[0].public_slug).toBe('slug-one'); // alive 100 outranks alive 0
    // The cap: 100/10 = 10; a hostile 9999 write is blocked upstream by the 147
    // range CHECK, so the term can never exceed +10.
    await expect(db.query(`update public.settlements set gallery_facet_aliveness = 9999 where id = '${S1}'`))
      .rejects.toThrow(/aliveness_range|check|constraint/i);
  });

  it('reactions aggregate onto tile rows as {key: count}, {} when none', async () => {
    await db.exec(`
      insert into public.gallery_reactions (settlement_id, user_id, reaction_key) values
        ('${S1}', '${OWNER}', 'worth_walking'),
        ('${S1}', '${READER}', 'worth_walking'),
        ('${S1}', '${READER}', 'map_speaks');
    `);
    const tiles = await rows('select id, reactions from public._gallery_public_tile_rows()');
    const byId = Object.fromEntries(tiles.map(t => [t.id, t.reactions]));
    expect(byId[S1]).toEqual({ worth_walking: 2, map_speaks: 1 });
    expect(byId[S2]).toEqual({});
    // …and ride through the list + more-by-creator + my-settlements shapes.
    const list = await rows(`select public_slug, reactions from public.list_gallery_dossiers(0, 24, 'relevant', '', '{}'::jsonb, false)`);
    expect(list.find(r => r.public_slug === 'slug-one').reactions).toEqual({ worth_walking: 2, map_speaks: 1 });
    const more = await rows(`select public_slug, reactions, aliveness from public.list_gallery_more_by_creator('slug-two', 6)`);
    expect(more.find(r => r.public_slug === 'slug-one').reactions).toEqual({ worth_walking: 2, map_speaks: 1 });
    await db.exec(`set test.uid = '${OWNER}';`);
    const mine = await rows('select public_slug, aliveness, reactions from public.list_my_gallery_dossiers()');
    expect(mine).toHaveLength(3);
    expect(mine.find(r => r.public_slug === 'slug-one').aliveness).toBe(100);
  });

  it('the 147 saved_maps constraints bite: aliveness range + world-age vocabulary', async () => {
    await db.exec(`insert into public.saved_maps (id) values ('${S1}')`);
    await expect(db.query(`update public.saved_maps set gallery_facet_aliveness = 101 where id = '${S1}'`))
      .rejects.toThrow(/check|constraint/i);
    await expect(db.query(`update public.saved_maps set gallery_facet_world_age = 'the-before-times' where id = '${S1}'`))
      .rejects.toThrow(/check|constraint/i);
    await db.exec(`update public.saved_maps set gallery_facet_aliveness = 55, gallery_facet_world_age = 'this-season' where id = '${S1}'`);
    const row = await one(`select gallery_facet_aliveness a, gallery_facet_world_age w from public.saved_maps where id = '${S1}'`);
    expect(row).toEqual({ a: 55, w: 'this-season' });
  });
});
