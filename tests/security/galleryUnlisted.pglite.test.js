/**
 * galleryUnlisted.pglite.test.js — Vision V-20 UNLISTED SHARING + V-13 FEATURED.
 *
 * EXECUTION tests (galleryReactions.pglite idiom): auth.uid() + account_is_active()
 * are settable-GUC stubs; the REAL migration-168 RPC bodies run inside in-process
 * Postgres. THE REQUIRED RLS PAIR is pinned by execution:
 *   • NON-OWNER-LISTING-NEVER-CONTAINS-UNLISTED — an unlisted row is is_public=false,
 *     so every public browse (all filter is_public=true) excludes it, and it can
 *     never be featured.
 *   • OWNER-SEES-OWN-UNLISTED — list_my_unlisted_* returns the owner's own unlisted
 *     rows; a different caller / anon gets nothing.
 * Plus: by-slug read (the party link), slug ROTATION (revoke), revoke, the
 * owner/active write gates, and FEATURED admin-only. Settlements AND maps (a shared
 * campaign IS a map_with_campaign row).
 *
 * The authoritative sanitizer _gallery_sanitize_public_json is stubbed as identity
 * here — its redaction is pinned by gallerySanitize tests; this file isolates the
 * VISIBILITY/slug logic.
 */
import { describe, it, expect, beforeAll, beforeEach } from 'vitest';
import { PGlite } from '@electric-sql/pglite';
import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

const dir = resolve(process.cwd(), 'supabase', 'migrations');
const MIG = resolve(dir, '168_gallery_visibility_and_featured.sql');
const present = existsSync(MIG);

function extractFn(src, name) {
  const m = src.match(new RegExp(`create\\s+or\\s+replace\\s+function\\s+public\\.${name}\\b[\\s\\S]*?\\$\\$;`, 'i'));
  if (!m) throw new Error(`could not extract ${name}`);
  return m[0];
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

describe('unlisted migration fixture exists (guards against a silent vacuous skip)', () => {
  it('168_gallery_visibility_and_featured.sql is present', () => {
    expect(present, `migration missing: ${MIG}`).toBe(true);
  });
});

describe.runIf(present)('gallery unlisted + featured — execution against the real SQL (pglite)', () => {
  beforeAll(async () => {
    const src = readFileSync(MIG, 'utf-8');
    db = new PGlite();
    await db.exec(`
      create schema if not exists auth;
      create or replace function auth.uid() returns uuid language sql stable as $fn$
        select nullif(current_setting('test.uid', true), '')::uuid
      $fn$;
      create or replace function public.account_is_active(p uuid) returns boolean language sql stable as $fn$
        select coalesce(nullif(current_setting('test.active', true), '')::boolean, true)
      $fn$;
      -- identity stub for the authoritative sanitizer (its redaction pinned elsewhere)
      create or replace function public._gallery_sanitize_public_json(value jsonb, path text[] default '{}')
        returns jsonb language sql immutable as $fn$ select value $fn$;
      -- no-op audit stub (real _audit_action inserts into admin_actions)
      create or replace function public._audit_action(a uuid, b uuid, c text, d jsonb, e jsonb, f text)
        returns void language sql as $fn$ select $fn$;

      create table public.profiles (id uuid primary key, role text not null default 'user', external_name text);

      create table public.settlements (
        id uuid primary key, user_id uuid, name text, tier text,
        data jsonb default '{}'::jsonb, ai_data jsonb, gallery_share_narrated boolean default false,
        is_public boolean not null default false, is_featured boolean not null default false,
        featured_order integer, published_at timestamptz, public_slug text, view_count integer not null default 0,
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
  });

  beforeEach(async () => {
    await db.exec(`
      delete from public.settlements; delete from public.saved_maps; delete from public.profiles;
      insert into public.profiles (id, role, external_name) values
        ('${OWNER}', 'user', 'The Owner'), ('${OTHER}', 'user', 'Someone Else'), ('${ADMIN}', 'admin', 'An Admin');
      insert into public.settlements (id, user_id, name, tier, is_public, visibility) values
        ('${S_UNLISTED}', '${OWNER}', 'Saltmoor', 'town', false, 'public'),
        ('${S_PUBLIC}',   '${OWNER}', 'Highkeep', 'city', true,  'public');
      insert into public.saved_maps (id, user_id, name, share_kind, is_public, visibility, gallery_share_world, gallery_world_snapshot) values
        ('${M_UNLISTED}', '${OWNER}', 'The Reach', 'map_with_campaign', false, 'public', true, '{"realm":"x"}'::jsonb);
    `);
    await setActive('true');
    await asUser(OWNER);
  });

  it('share_settlement_unlisted makes the row unlisted + is_public=false + mints an unguessable slug', async () => {
    const r = await scalar(`select public.share_settlement_unlisted('${S_UNLISTED}') as slug`);
    expect(typeof r.slug).toBe('string');
    expect(r.slug.length).toBeGreaterThanOrEqual(40); // ~168-bit unguessable slug
    const row = await scalar(`select is_public, is_featured, visibility, unlisted_slug from public.settlements where id = '${S_UNLISTED}'`);
    expect(row.is_public).toBe(false);
    expect(row.visibility).toBe('unlisted');
    expect(row.unlisted_slug).toBe(r.slug);
  });

  it('NON-OWNER-LISTING-NEVER-CONTAINS-UNLISTED: excluded from every is_public=true browse + cannot be featured', async () => {
    await db.query(`select public.share_settlement_unlisted('${S_UNLISTED}')`);
    // the shared public-browse choke filters is_public=true → excludes the unlisted row
    const pub = await scalar(`select count(*)::int n from public.settlements where is_public = true and id = '${S_UNLISTED}'`);
    expect(pub.n).toBe(0);
    // featured/curated listings filter is_public=true → never contain it
    const feat = await rows(`select id from public.list_featured_dossiers()`);
    expect(feat.find((x) => x.id === S_UNLISTED)).toBeUndefined();
    // and an admin cannot hero-bill it (is_public=false)
    await asUser(ADMIN);
    await expect(db.query(`select public.set_featured('${S_UNLISTED}', true)`)).rejects.toThrow(/non-public/i);
  });

  it('OWNER-SEES-OWN-UNLISTED: list_my_unlisted_dossiers returns own unlisted; other/anon get nothing', async () => {
    await db.query(`select public.share_settlement_unlisted('${S_UNLISTED}')`);
    const mine = await rows(`select id from public.list_my_unlisted_dossiers()`);
    expect(mine.map((x) => x.id)).toContain(S_UNLISTED);
    // it does NOT include the public (non-unlisted) settlement
    expect(mine.map((x) => x.id)).not.toContain(S_PUBLIC);

    await asUser(OTHER);
    expect(await rows(`select id from public.list_my_unlisted_dossiers()`)).toHaveLength(0);
    await asAnon();
    expect(await rows(`select id from public.list_my_unlisted_dossiers()`)).toHaveLength(0);
  });

  it('BY-SLUG: get_unlisted_dossier returns the row for the exact slug only', async () => {
    const { slug } = await scalar(`select public.share_settlement_unlisted('${S_UNLISTED}') as slug`);
    await asAnon(); // the link is the capability
    const hit = await scalar(`select public.get_unlisted_dossier('${slug}') as j`);
    expect(hit.j).toBeTruthy();
    expect(hit.j.unlisted).toBe(true);
    expect(hit.j.id).toBe(S_UNLISTED);
    const miss = await scalar(`select public.get_unlisted_dossier('not-a-real-slug') as j`);
    expect(miss.j).toBeNull();
  });

  it('ROTATION revokes: the old slug dies, the new slug resolves', async () => {
    const { slug: oldSlug } = await scalar(`select public.share_settlement_unlisted('${S_UNLISTED}') as slug`);
    const { slug: newSlug } = await scalar(`select public.rotate_settlement_unlisted_slug('${S_UNLISTED}') as slug`);
    expect(newSlug).not.toBe(oldSlug);
    await asAnon();
    expect((await scalar(`select public.get_unlisted_dossier('${oldSlug}') as j`)).j).toBeNull();
    expect((await scalar(`select public.get_unlisted_dossier('${newSlug}') as j`)).j).toBeTruthy();
  });

  it('revoke_settlement_unlisted clears the slug and kills the link', async () => {
    const { slug } = await scalar(`select public.share_settlement_unlisted('${S_UNLISTED}') as slug`);
    await db.query(`select public.revoke_settlement_unlisted('${S_UNLISTED}')`);
    const row = await scalar(`select visibility, unlisted_slug from public.settlements where id = '${S_UNLISTED}'`);
    expect(row.visibility).toBe('public');
    expect(row.unlisted_slug).toBeNull();
    await asAnon();
    expect((await scalar(`select public.get_unlisted_dossier('${slug}') as j`)).j).toBeNull();
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

  // ── maps (a shared campaign IS a map_with_campaign row) ─────────────────────
  it('MAPS: unlisted share/list/by-slug honor the same RLS pair', async () => {
    const { slug } = await scalar(`select public.share_map_unlisted('${M_UNLISTED}') as slug`);
    expect(typeof slug).toBe('string');
    const row = await scalar(`select is_public, visibility from public.saved_maps where id = '${M_UNLISTED}'`);
    expect(row.is_public).toBe(false);
    expect(row.visibility).toBe('unlisted');
    // owner sees own unlisted map; other does not
    expect((await rows(`select id from public.list_my_unlisted_maps()`)).map((x) => x.id)).toContain(M_UNLISTED);
    await asUser(OTHER);
    expect(await rows(`select id from public.list_my_unlisted_maps()`)).toHaveLength(0);
    // by-slug read returns the pre-sanitized snapshot
    await asAnon();
    const hit = await scalar(`select public.get_unlisted_map('${slug}') as j`);
    expect(hit.j.unlisted).toBe(true);
    expect(hit.j.world_snapshot).toEqual({ realm: 'x' });
  });
});
