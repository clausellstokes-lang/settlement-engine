/**
 * galleryUnlisted.pglite.test.js — the party link (V-20 unlisted sharing, migration
 * 168, as amended by migration 208) + V-13 FEATURED.
 *
 * EXECUTION tests (galleryReactions.pglite idiom): auth.uid() + account_is_active()
 * are settable-GUC stubs; the REAL RPC bodies run inside in-process Postgres — 168's
 * functions first, then migration 208 applied whole over them (its backfill, its
 * constraint and its five recreated settlement RPCs), plus the real publish (105) and
 * unpublish (059), the real per-member splice (092's key, 093's apply) and the real
 * gallery read get_gallery_dossier (147) over a stubbed tile view.
 *
 * Re-keyed by cause (SW-B7a PARTY-LINK, 2026-11-09):
 *   168  the RLS pair — OWNER-SEES-OWN-UNLISTED; a private town shared by link is in
 *        no public browse and cannot be featured; by-slug read; rotation; the write
 *        gates; FEATURED admin-only; the maps.
 *   (c)  the link is idempotent — "share twice, one slug"; "publish keeps the link".
 *   (d)  the link honours the veil — "the veil hides the same rows on both reads".
 *   (f)  the owner is told — "the owner is told is_owner".
 *   (g)  both at once — "share unlisted keeps the listing"; revoke nulls the slug
 *        alone; the owner's list and the read key on the slug; visibility derived.
 *
 * The sanitizer _gallery_sanitize_public_json is stubbed to strip a `secret` key at the
 * top and on each NPC (its real redaction is pinned by the gallerySanitize suites), and
 * _gallery_dm_full_json is identity, so the per-member splice is observable here.
 */
import { describe, it, expect, beforeAll, beforeEach } from 'vitest';
import { PGlite } from '@electric-sql/pglite';
import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

const PGLITE_BOOT_TIMEOUT_MS = 180_000; // deadlock guard, not a perf budget — never tune to a measured boot (see pgliteHookTimeoutRatchet.test.js)

const dir = resolve(process.cwd(), 'supabase', 'migrations');
const MIG = resolve(dir, '168_gallery_visibility_and_featured.sql');
const MIG_208 = resolve(dir, '208_party_link_independent_idempotent_veiled.sql');
const MIG_PUBLISH = resolve(dir, '105_restore_publish_canon_gate.sql');
const MIG_UNPUBLISH = resolve(dir, '059_enforce_account_status_rls.sql');
const MIG_SLUG = resolve(dir, '008_public_gallery.sql');
const MIG_NPC_KEY = resolve(dir, '092_gallery_member_overrides.sql');
const MIG_SPLICE = resolve(dir, '093_gallery_member_overrides_fix.sql');
const MIG_GALLERY_READ = resolve(dir, '147_gallery_tile_chain_aliveness_title_reactions.sql');
const ALL = [MIG, MIG_208, MIG_PUBLISH, MIG_UNPUBLISH, MIG_SLUG, MIG_NPC_KEY, MIG_SPLICE, MIG_GALLERY_READ];
const present = ALL.every(existsSync);

// Latest-in-file extraction: a file may define a function more than once.
function extractFn(src, name) {
  const all = [...src.matchAll(new RegExp(`^create\\s+or\\s+replace\\s+function\\s+public\\.${name}\\b[\\s\\S]*?\\$\\$;`, 'gim'))];
  if (!all.length) throw new Error(`could not extract ${name}`);
  return all.at(-1)[0];
}

const OWNER = '11111111-1111-1111-1111-111111111111';
const OTHER = '22222222-2222-2222-2222-222222222222';
const ADMIN = '33333333-3333-3333-3333-333333333333';
const S_UNLISTED = 'aaaaaaaa-0000-0000-0000-000000000001';
const S_PUBLIC = 'aaaaaaaa-0000-0000-0000-000000000002';
const M_UNLISTED = 'bbbbbbbb-0000-0000-0000-000000000001';

let db;
const asUser = (uid) => db.exec(`set test.uid = '${uid}';`);
const asAnon = () => db.exec(`set test.uid = '';`);
const setActive = (v) => db.exec(`set test.active = '${v}';`);
const rows = async (q, params = []) => (await db.query(q, params)).rows;
const scalar = async (q, params = []) => (await db.query(q, params)).rows[0];
const share = async (id) => (await scalar(`select public.share_settlement_unlisted('${id}') as slug`)).slug;

describe('party-link migration fixtures exist (guards against a silent vacuous skip)', () => {
  it('168, 208 and the read/publish sources are present', () => {
    for (const f of ALL) expect(existsSync(f), `migration missing: ${f}`).toBe(true);
  });
});

describe.runIf(present)('the party link — execution against the real SQL (pglite)', () => {
  beforeAll(async () => {
    const src = readFileSync(MIG, 'utf-8');
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
      -- the sanitizer twin, reduced to an observable strip: a 'secret' key leaves the
      -- top level and every NPC (its real redaction is pinned elsewhere)
      create or replace function public._gallery_sanitize_public_json(value jsonb, path text[] default '{}')
        returns jsonb language sql immutable as $fn$
        select case when jsonb_typeof(value -> 'npcs') = 'array'
          then jsonb_set(value - 'secret', '{npcs}', (select coalesce(jsonb_agg(e - 'secret' order by o), '[]'::jsonb)
                 from jsonb_array_elements(value -> 'npcs') with ordinality t(e, o)))
          else value - 'secret' end
      $fn$;
      create or replace function public._gallery_dm_full_json(j jsonb) returns jsonb
        language sql immutable as $fn$ select j $fn$;
      create or replace function public._gallery_chronicle_json(j jsonb) returns jsonb
        language sql immutable as $fn$ select '[]'::jsonb $fn$;
      -- no-op audit stub (real _audit_action inserts into admin_actions)
      create or replace function public._audit_action(a uuid, b uuid, c text, d jsonb, e jsonb, f text)
        returns void language sql as $fn$ select $fn$;

      create table public.profiles (id uuid primary key, role text not null default 'user', external_name text);

      create table public.settlements (
        id uuid primary key, user_id uuid, name text, tier text,
        data jsonb default '{}'::jsonb, ai_data jsonb, gallery_share_narrated boolean default false,
        gallery_share_dm boolean not null default false, gallery_importable boolean not null default false,
        gallery_member_overrides jsonb not null default '{}'::jsonb, campaign_state jsonb,
        is_public boolean not null default false, is_featured boolean not null default false,
        is_curated boolean not null default false,
        featured_order integer, published_at timestamptz, updated_at timestamptz default now(),
        public_slug text, view_count integer not null default 0,
        gallery_description text, gallery_image_url text, gallery_image_alt text, gallery_tags text[],
        visibility text not null default 'public', unlisted_slug text
      );
      create table public.saved_maps (
        id uuid primary key, user_id uuid, name text, share_kind text default 'map',
        is_public boolean not null default false, is_featured boolean not null default false,
        featured_order integer, published_at timestamptz, public_slug text, view_count integer not null default 0,
        visibility text not null default 'public', unlisted_slug text,
        gallery_share_world boolean default false, gallery_world_snapshot jsonb,
        gallery_world_sections jsonb, gallery_realm_arc_summary jsonb,
        gallery_description text, gallery_tags text[], gallery_image_url text
      );
      -- the public tile view get_gallery_dossier joins (147's is a facet projection;
      -- this stub carries the columns the read selects, over the listed rows only)
      create or replace function public._gallery_public_tile_rows()
      returns table (
        id uuid, public_slug text, name text, tier text, published_at timestamptz, updated_at timestamptz,
        view_count integer, is_curated boolean, gallery_description text, gallery_image_url text,
        gallery_image_alt text, gallery_tags text[], population integer, terrain text, government_type text,
        magic_level text, stability text, primary_resource text, threat_level text, net_votes integer,
        comment_count integer, aliveness integer
      ) language sql stable as $fn$
        select s.id, s.public_slug, s.name, s.tier, s.published_at, s.updated_at, s.view_count, s.is_curated,
               s.gallery_description, s.gallery_image_url, s.gallery_image_alt, s.gallery_tags,
               null::int, null::text, null::text, null::text, null::text, null::text, null::text, 0, 0, null::int
          from public.settlements s where s.is_public = true
      $fn$;
    `);
    for (const fn of [
      '_make_unlisted_slug',
      'set_featured', 'list_featured_dossiers',
      'set_featured_map', 'list_featured_maps',
      'share_settlement_unlisted', 'rotate_settlement_unlisted_slug', 'revoke_settlement_unlisted',
      'get_unlisted_dossier', 'list_my_unlisted_dossiers',
      'share_map_unlisted', 'rotate_map_unlisted_slug', 'revoke_map_unlisted',
      'get_unlisted_map', 'list_my_unlisted_maps',
    ]) {
      await db.exec(extractFn(src, fn));
    }
    await db.exec(extractFn(readFileSync(MIG_SLUG, 'utf-8'), '_make_public_slug'));
    await db.exec(extractFn(readFileSync(MIG_PUBLISH, 'utf-8'), 'publish_settlement'));
    await db.exec(extractFn(readFileSync(MIG_UNPUBLISH, 'utf-8'), 'unpublish_settlement'));
    await db.exec(extractFn(readFileSync(MIG_NPC_KEY, 'utf-8'), '_gallery_npc_key'));
    await db.exec(extractFn(readFileSync(MIG_SPLICE, 'utf-8'), '_gallery_apply_member_overrides'));
    await db.exec(extractFn(readFileSync(MIG_GALLERY_READ, 'utf-8'), 'get_gallery_dossier'));
    // migration 208, whole, over 168 (as the deploy applies it)
    await db.exec(readFileSync(MIG_208, 'utf-8'));
  }, PGLITE_BOOT_TIMEOUT_MS);

  beforeEach(async () => {
    await db.exec(`
      delete from public.settlements; delete from public.saved_maps; delete from public.profiles;
      insert into public.profiles (id, role, external_name) values
        ('${OWNER}', 'user', 'The Owner'), ('${OTHER}', 'user', 'Someone Else'), ('${ADMIN}', 'admin', 'An Admin');
      insert into public.settlements (id, user_id, name, tier, is_public, public_slug, published_at, visibility) values
        ('${S_UNLISTED}', '${OWNER}', 'Saltmoor', 'town', false, null, null, 'public'),
        ('${S_PUBLIC}',   '${OWNER}', 'Highkeep', 'city', true,  'highkeep01', now(), 'public');
      insert into public.saved_maps (id, user_id, name, share_kind, is_public, visibility, gallery_share_world, gallery_world_snapshot) values
        ('${M_UNLISTED}', '${OWNER}', 'The Reach', 'map_with_campaign', false, 'public', true, '{"realm":"x"}'::jsonb);
    `);
    await setActive('true');
    await asUser(OWNER);
  });

  // ── 168: the RLS pair, the read, rotation, the gates ────────────────────────
  it('share mints an unguessable slug and marks the row linked (visibility follows the slug)', async () => {
    const slug = await share(S_UNLISTED);
    expect(typeof slug).toBe('string');
    expect(slug.length).toBeGreaterThanOrEqual(40); // ~168-bit unguessable slug
    const row = await scalar(`select is_public, visibility, unlisted_slug from public.settlements where id = '${S_UNLISTED}'`);
    expect(row.is_public).toBe(false); // a private town stays private
    expect(row.visibility).toBe('unlisted');
    expect(row.unlisted_slug).toBe(slug);
  });

  it('a PRIVATE town shared by link is in no is_public browse and cannot be featured', async () => {
    await share(S_UNLISTED);
    const pub = await scalar(`select count(*)::int n from public.settlements where is_public = true and id = '${S_UNLISTED}'`);
    expect(pub.n).toBe(0);
    const feat = await rows(`select id from public.list_featured_dossiers()`);
    expect(feat.find((x) => x.id === S_UNLISTED)).toBeUndefined();
    await asUser(ADMIN);
    await expect(db.query(`select public.set_featured('${S_UNLISTED}', true)`)).rejects.toThrow(/non-public/i);
  });

  it('OWNER-SEES-OWN-UNLISTED: list_my_unlisted_dossiers returns own linked rows; other/anon get nothing', async () => {
    await share(S_UNLISTED);
    const mine = await rows(`select id from public.list_my_unlisted_dossiers()`);
    expect(mine.map((x) => x.id)).toContain(S_UNLISTED);
    expect(mine.map((x) => x.id)).not.toContain(S_PUBLIC); // listed, never linked
    await asUser(OTHER);
    expect(await rows(`select id from public.list_my_unlisted_dossiers()`)).toHaveLength(0);
    await asAnon();
    expect(await rows(`select id from public.list_my_unlisted_dossiers()`)).toHaveLength(0);
  });

  it('BY-SLUG: get_unlisted_dossier returns the row for the exact slug only', async () => {
    const slug = await share(S_UNLISTED);
    await asAnon(); // the link is the capability
    const hit = await scalar(`select public.get_unlisted_dossier('${slug}') as j`);
    expect(hit.j.unlisted).toBe(true);
    expect(hit.j.id).toBe(S_UNLISTED);
    expect(hit.j.author_name).toBe('The Owner');
    expect((await scalar(`select public.get_unlisted_dossier('not-a-real-slug') as j`)).j).toBeNull();
  });

  it('ROTATION: the old slug dies, the new slug resolves', async () => {
    const oldSlug = await share(S_UNLISTED);
    const { slug: newSlug } = await scalar(`select public.rotate_settlement_unlisted_slug('${S_UNLISTED}') as slug`);
    expect(newSlug).not.toBe(oldSlug);
    await asAnon();
    expect((await scalar(`select public.get_unlisted_dossier('${oldSlug}') as j`)).j).toBeNull();
    expect((await scalar(`select public.get_unlisted_dossier('${newSlug}') as j`)).j).toBeTruthy();
  });

  it('rotate refuses a town with no link', async () => {
    await expect(db.query(`select public.rotate_settlement_unlisted_slug('${S_UNLISTED}')`)).rejects.toThrow(/not shared as unlisted/i);
  });

  it('write gates: a non-owner cannot share; an inactive account cannot share', async () => {
    await asUser(OTHER);
    await expect(db.query(`select public.share_settlement_unlisted('${S_UNLISTED}')`)).rejects.toThrow(/not owned/i);
    await asUser(OWNER);
    await setActive('false');
    await expect(db.query(`select public.share_settlement_unlisted('${S_UNLISTED}')`)).rejects.toThrow(/not active/i);
  });

  it('FEATURED is admin-only: an admin can feature a public dossier; a normal user cannot', async () => {
    await asUser(ADMIN);
    await db.query(`select public.set_featured('${S_PUBLIC}', true, 1)`);
    expect((await rows(`select id from public.list_featured_dossiers()`)).map((x) => x.id)).toContain(S_PUBLIC);
    await asUser(OWNER);
    await expect(db.query(`select public.set_featured('${S_PUBLIC}', false)`)).rejects.toThrow(/only admins/i);
  });

  // ── (c) the link is idempotent ───────────────────────────────────────────────
  it('share twice, one slug: a second share returns the same slug and writes nothing', async () => {
    const first = await share(S_UNLISTED);
    const before = await scalar(`select published_at, updated_at, visibility, is_public from public.settlements where id = '${S_UNLISTED}'`);
    const second = await share(S_UNLISTED);
    expect(second).toBe(first);
    const after = await scalar(`select published_at, updated_at, visibility, is_public from public.settlements where id = '${S_UNLISTED}'`);
    expect(after).toEqual(before);
    await asAnon();
    expect((await scalar(`select public.get_unlisted_dossier('${first}') as j`)).j.id).toBe(S_UNLISTED);
  });

  it('publish keeps the link; unpublish keeps the link', async () => {
    const slug = await share(S_UNLISTED);
    await db.query(`select public.publish_settlement('${S_UNLISTED}')`);
    let row = await scalar(`select is_public, unlisted_slug, visibility from public.settlements where id = '${S_UNLISTED}'`);
    expect(row).toMatchObject({ is_public: true, unlisted_slug: slug, visibility: 'unlisted' });
    await asAnon();
    expect((await scalar(`select public.get_unlisted_dossier('${slug}') as j`)).j.id).toBe(S_UNLISTED);
    await asUser(OWNER);
    await db.query(`select public.unpublish_settlement('${S_UNLISTED}')`);
    row = await scalar(`select is_public, unlisted_slug from public.settlements where id = '${S_UNLISTED}'`);
    expect(row).toMatchObject({ is_public: false, unlisted_slug: slug });
    await asAnon();
    expect((await scalar(`select public.get_unlisted_dossier('${slug}') as j`)).j.id).toBe(S_UNLISTED);
  });

  // ── (d) the link honours the veil ────────────────────────────────────────────
  it('the veil hides the same rows on both reads (default mode, one member revealed, one hidden)', async () => {
    const data = { name: 'Highkeep', secret: 'the compass', npcs: [
      { id: 'n1', name: 'Ada', secret: 'ada-secret' },
      { id: 'n2', name: 'Bo', secret: 'bo-secret' },
    ] };
    const overrides = { n1: { revealDm: true }, n2: { revealDm: false }, $veil: { v: 1, deltas: [{ address: 'card:npc:n2', hidden: true }] } };
    await db.query(`update public.settlements set data = $1, gallery_member_overrides = $2, gallery_share_dm = false where id = '${S_PUBLIC}'`,
      [JSON.stringify(data), JSON.stringify(overrides)]);
    const slug = await share(S_PUBLIC);
    await db.query(`select public.publish_settlement('${S_PUBLIC}')`); // listed and linked, both reads open
    await asAnon();
    const gallery = await scalar(`select data, gallery_share_dm, gallery_member_overrides from public.get_gallery_dossier('highkeep01')`);
    const link = (await scalar(`select public.get_unlisted_dossier('${slug}') as j`)).j;
    expect(link.dossier).toEqual(gallery.data);
    expect(link.gallery_member_overrides).toEqual(gallery.gallery_member_overrides);
    expect(link.gallery_share_dm).toBe(gallery.gallery_share_dm);
    // what the splice did, both sides: the settlement level stripped, Ada revealed, Bo stripped
    expect(link.dossier.secret).toBeUndefined();
    expect(link.dossier.npcs.find((n) => n.id === 'n1').secret).toBe('ada-secret');
    expect(link.dossier.npcs.find((n) => n.id === 'n2').secret).toBeUndefined();
  });

  it('the veil hides the same rows on both reads (DM content revealed, one member held back)', async () => {
    const data = { name: 'Highkeep', secret: 'the compass', npcs: [
      { id: 'n1', name: 'Ada', secret: 'ada-secret' },
      { id: 'n2', name: 'Bo', secret: 'bo-secret' },
    ] };
    await db.query(`update public.settlements set data = $1, gallery_member_overrides = $2, gallery_share_dm = true where id = '${S_PUBLIC}'`,
      [JSON.stringify(data), JSON.stringify({ n2: { revealDm: false } })]);
    const slug = await share(S_PUBLIC);
    await db.query(`select public.publish_settlement('${S_PUBLIC}')`); // listed and linked, both reads open
    await asAnon();
    const gallery = await scalar(`select data from public.get_gallery_dossier('highkeep01')`);
    const link = (await scalar(`select public.get_unlisted_dossier('${slug}') as j`)).j;
    expect(link.dossier).toEqual(gallery.data);
    expect(link.gallery_share_dm).toBe(true);
    expect(link.dossier.secret).toBe('the compass');
    expect(link.dossier.npcs.find((n) => n.id === 'n2').secret).toBeUndefined();
  });

  // ── (f) the owner is told ────────────────────────────────────────────────────
  it('the owner is told is_owner; another user and anon are not', async () => {
    const slug = await share(S_UNLISTED);
    expect((await scalar(`select public.get_unlisted_dossier('${slug}') as j`)).j.is_owner).toBe(true);
    await asUser(OTHER);
    expect((await scalar(`select public.get_unlisted_dossier('${slug}') as j`)).j.is_owner).toBe(false);
    await asAnon();
    expect((await scalar(`select public.get_unlisted_dossier('${slug}') as j`)).j.is_owner).toBe(false);
  });

  // ── (g) both at once ─────────────────────────────────────────────────────────
  it('share unlisted keeps the listing: is_public, is_featured and public_slug stand', async () => {
    await asUser(ADMIN);
    await db.query(`select public.set_featured('${S_PUBLIC}', true, 1)`);
    await asUser(OWNER);
    const slug = await share(S_PUBLIC);
    const row = await scalar(`select is_public, is_featured, public_slug, visibility, unlisted_slug from public.settlements where id = '${S_PUBLIC}'`);
    expect(row).toMatchObject({ is_public: true, is_featured: true, public_slug: 'highkeep01', visibility: 'unlisted', unlisted_slug: slug });
    expect((await rows(`select id from public.list_featured_dossiers()`)).map((x) => x.id)).toContain(S_PUBLIC);
    await asAnon();
    // both doors open at once, each keyed on its own slug
    expect((await scalar(`select count(*)::int n from public.get_gallery_dossier('highkeep01')`)).n).toBe(1);
    expect((await scalar(`select public.get_unlisted_dossier('${slug}') as j`)).j.id).toBe(S_PUBLIC);
    await asUser(OWNER);
    expect((await rows(`select id from public.list_my_unlisted_dossiers()`)).map((x) => x.id)).toContain(S_PUBLIC);
  });

  it('revoke nulls the slug alone: the listing stands and the link dies', async () => {
    const slug = await share(S_PUBLIC);
    await db.query(`select public.revoke_settlement_unlisted('${S_PUBLIC}')`);
    const row = await scalar(`select is_public, public_slug, visibility, unlisted_slug from public.settlements where id = '${S_PUBLIC}'`);
    expect(row).toMatchObject({ is_public: true, public_slug: 'highkeep01', visibility: 'public', unlisted_slug: null });
    await asAnon();
    expect((await scalar(`select public.get_unlisted_dossier('${slug}') as j`)).j).toBeNull();
    expect((await scalar(`select count(*)::int n from public.get_gallery_dossier('highkeep01')`)).n).toBe(1);
  });

  it('visibility is derived from the slug: a write that breaks the pairing is refused', async () => {
    await expect(db.query(`update public.settlements set visibility = 'unlisted' where id = '${S_UNLISTED}'`)).rejects.toThrow(/settlements_visibility_derived/);
    await share(S_UNLISTED);
    await expect(db.query(`update public.settlements set visibility = 'public' where id = '${S_UNLISTED}'`)).rejects.toThrow(/settlements_visibility_derived/);
  });

  // ── maps (a shared campaign IS a map_with_campaign row; untouched by 208) ────
  it('MAPS: unlisted share/list/by-slug honor the same RLS pair', async () => {
    const { slug } = await scalar(`select public.share_map_unlisted('${M_UNLISTED}') as slug`);
    expect(typeof slug).toBe('string');
    const row = await scalar(`select is_public, visibility from public.saved_maps where id = '${M_UNLISTED}'`);
    expect(row.is_public).toBe(false);
    expect(row.visibility).toBe('unlisted');
    expect((await rows(`select id from public.list_my_unlisted_maps()`)).map((x) => x.id)).toContain(M_UNLISTED);
    await asUser(OTHER);
    expect(await rows(`select id from public.list_my_unlisted_maps()`)).toHaveLength(0);
    await asAnon();
    const hit = await scalar(`select public.get_unlisted_map('${slug}') as j`);
    expect(hit.j.unlisted).toBe(true);
    expect(hit.j.world_snapshot).toEqual({ realm: 'x' });
  });
});
