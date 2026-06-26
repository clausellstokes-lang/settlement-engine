/**
 * galleryMapMemberCount.pglite.test.js — EXECUTION proof that the gallery-maps
 * tile metric `member_count` (list_gallery_maps, migration 065) reports EXACTLY
 * the members the detail RPC get_gallery_map (migration 046) projects — and never
 * a count derived from campaign membership the owner did NOT choose to share.
 *
 * The trap this closes: campaigns.js persists the full campaign envelope
 * (settlementIds included) for EVERY cloud row, so a blank kind='map' share — or
 * a map_with_campaign with the gallery_share_campaign opt-in OFF — still carries
 * map_data->'campaign'->'settlementIds'. 046 gates member projection behind
 * `share_kind='map_with_campaign' AND gallery_share_campaign`, so those rows
 * expose ZERO members. An un-gated member_count subquery would count those
 * un-shared settlements, surfacing a misattributed metric (the tile reads "N
 * settlements") and an opt-out bypass (the row would pass the hasSettlements
 * facet) for membership the owner never published.
 *
 * The JS fixture (tests/components/gallery/galleryMapsUtils.test.js) hard-codes
 * member_count:0 for its blank tile, so only an SQL execution test can catch a
 * regression in the gate. This loads the NET-CURRENT function bodies (latest-wins
 * across migrations) into in-process Postgres (pglite) and RUNS them.
 */
import { describe, it, expect, beforeAll } from 'vitest';
import { PGlite } from '@electric-sql/pglite';
import { readFileSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';

const MIGRATIONS_DIR = resolve(process.cwd(), 'supabase', 'migrations');

/** Latest-wins extraction of a `create or replace function` body across all
 *  migrations (file order). Returns the LAST definition so we exercise the
 *  net-current behavior, not a superseded one. */
function netCurrentFn(name) {
  const files = readdirSync(MIGRATIONS_DIR).filter((f) => /^\d.*\.sql$/.test(f)).sort();
  const re = new RegExp(`create\\s+or\\s+replace\\s+function\\s+public\\.${name}\\b[\\s\\S]*?\\$\\$;`, 'ig');
  let last = null;
  for (const f of files) {
    const matches = readFileSync(resolve(MIGRATIONS_DIR, f), 'utf-8').match(re);
    if (matches && matches.length) last = matches[matches.length - 1];
  }
  return last;
}

const OWNER = '11111111-1111-1111-1111-111111111111';

const BACKDROP_FN = netCurrentFn('_gallery_map_backdrop');
const GET_FN = netCurrentFn('get_gallery_map');
const LIST_FN = netCurrentFn('list_gallery_maps');
// 088 added the server-side defense-in-depth scanner + wired it into publish_map.
const SAFE_FN = netCurrentFn('_gallery_world_snapshot_is_safe');
const PUBLISH_FN = netCurrentFn('publish_map');

// A second account — its settlements must NEVER be projected by another owner's
// shared campaign (the 046 IDOR guard get_gallery_map carries).
const OTHER = '22222222-2222-2222-2222-222222222222';

let db;

describe('gallery maps member_count — net-current execution (pglite)', () => {
  it('locates the net-current function bodies across migrations', () => {
    expect(BACKDROP_FN, 'no _gallery_map_backdrop found').toBeTruthy();
    expect(GET_FN, 'no get_gallery_map found').toBeTruthy();
    expect(LIST_FN, 'no list_gallery_maps found').toBeTruthy();
    // The net-current list_gallery_maps MUST gate member_count behind the same
    // share_kind + opt-in 046 uses — guard against the un-gated regression.
    expect(LIST_FN).toMatch(/share_kind\s*=\s*'map_with_campaign'\s+and\s+m\.gallery_share_campaign/i);
    // ...and it must NOT walk the bare top-level settlementIds fallback (046 reads
    // only map_data->'campaign'->'settlementIds').
    expect(LIST_FN).not.toMatch(/m\.map_data->'settlementIds'/);
    // 088: the server-side snapshot scanner + the publish_map that calls it.
    expect(SAFE_FN, 'no _gallery_world_snapshot_is_safe found').toBeTruthy();
    expect(PUBLISH_FN, 'no publish_map found').toBeTruthy();
    // get_gallery_map must keep the 046 member-ownership IDOR guard.
    expect(GET_FN).toMatch(/s\.user_id\s*=\s*row\.user_id/i);
    // get_gallery_map must gate the world panel on the gallery_share_world opt-in.
    expect(GET_FN).toMatch(/case\s+when\s+row\.gallery_share_world/i);
  });

  beforeAll(async () => {
    db = new PGlite();
    await db.exec('create schema if not exists public;');

    // Minimal schema mirroring the columns the two RPCs touch.
    await db.exec(`
      create table public.settlements (
        id uuid primary key,
        user_id uuid not null,
        name text,
        tier text,
        data jsonb default '{}'::jsonb,
        campaign_state jsonb default '{}'::jsonb,
        access_state text default 'active',
        -- get_gallery_map (088) deep-links each member to its own dossier when the
        -- member settlement is itself published, so it reads these columns.
        is_public boolean default false,
        public_slug text
      );
      create table public.saved_maps (
        id uuid primary key default gen_random_uuid(),
        user_id uuid not null,
        name text,
        share_kind text default 'map',
        gallery_share_campaign boolean default false,
        gallery_description text,
        gallery_tags text[],
        map_data jsonb default '{}'::jsonb,
        is_public boolean default false,
        public_slug text,
        published_at timestamptz default now(),
        view_count int default 0,
        import_count int default 0,
        gallery_importable boolean default false,
        -- Migration 088 columns (the net-current list_gallery_maps projects the
        -- image cover; get_gallery_map/publish_map reference the rest). Mirror the
        -- real saved_maps shape so the net-current RPC bodies resolve.
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
      -- Migration 076 added a LEFT JOIN onto profiles.external_name to resolve
      -- the map AUTHOR by owner id. This test exercises member_count, not the
      -- author, but the JOIN must resolve, so create a minimal profiles table +
      -- seed the owner's external_name.
      create table public.profiles (
        id uuid primary key,
        external_name text
      );
      insert into public.profiles (id, external_name) values ('${OWNER}', 'QuietCartographer418');
    `);
    // get_gallery_map (046) calls these settlement sanitizers; stub them as
    // identity/passthrough so we can run the member projection without loading the
    // full 020/032/033 sanitizer chain (out of scope — that has its own test).
    await db.exec(`
      create or replace function public._gallery_sanitize_public_json(p jsonb)
        returns jsonb language sql immutable as $$ select coalesce(p, '{}'::jsonb) $$;
      create or replace function public._gallery_chronicle_json(p jsonb)
        returns jsonb language sql immutable as $$ select coalesce(p, '[]'::jsonb) $$;
    `);
    // publish_map (088) is SECURITY DEFINER and calls account_is_active + a slug
    // minter; stub both. account_is_active returns true (the account-gate path is
    // covered elsewhere — here we exercise the snapshot rejection). The slug minter
    // is deterministic so the rejection raises BEFORE any row mutation, which is the
    // whole point — a forbidden snapshot must never reach storage.
    await db.exec(`
      create or replace function public.account_is_active(p uuid)
        returns boolean language sql immutable as $$ select true $$;
      create or replace function public._make_public_slug()
        returns text language sql volatile as $$ select 'slug-' || gen_random_uuid()::text $$;
    `);
    // auth.uid() — pglite has no auth schema; stub it to the OWNER so publish_map's
    // ownership + auth gates resolve to the seeded owner.
    await db.exec(`
      create schema if not exists auth;
      create or replace function auth.uid()
        returns uuid language sql stable as $$ select '${OWNER}'::uuid $$;
    `);
    await db.exec(BACKDROP_FN);
    await db.exec(SAFE_FN);
    await db.exec(GET_FN);
    await db.exec(LIST_FN);
    await db.exec(PUBLISH_FN);

    // Two owned, active settlements referenced by the campaign envelope, plus ONE
    // owned by a DIFFERENT account (the IDOR probe — its dossier must never project).
    await db.exec(`
      insert into public.settlements (id, user_id, name, tier) values
        ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '${OWNER}', 'Port', 't1'),
        ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '${OWNER}', 'Vale', 't2'),
        ('cccccccc-cccc-cccc-cccc-cccccccccccc', '${OTHER}', 'Foreign Hold', 't3');
    `);

    const campaign = JSON.stringify({
      campaign: {
        settlementIds: [
          'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
          'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
        ],
        mapState: { seed: 42 },
      },
    });

    // IDOR probe: a shared campaign whose owner-controlled settlementIds list TWO
    // of their own settlements PLUS a settlement owned by OTHER. get_gallery_map is
    // SECURITY DEFINER (bypasses RLS), so without the 046 ownership filter the
    // foreign 'Foreign Hold' dossier + slug would leak. The owner can list any UUID.
    const idorCampaign = JSON.stringify({
      campaign: {
        settlementIds: [
          'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
          'cccccccc-cccc-cccc-cccc-cccccccccccc', // NOT owned by OWNER
        ],
        mapState: { seed: 7 },
      },
    });

    // gallery_importable (migration 072) is ORTHOGONAL to member_count: a blank
    // map can be importable, and a campaign with members need not be. Set it so
    // the importable facet's result set {campaign-optout, shared} is distinct from
    // the hasSettlements set {shared} — proving the two facets gate independently.
    await db.query(
      `insert into public.saved_maps
         (user_id, name, share_kind, gallery_share_campaign, map_data, is_public, public_slug, gallery_importable)
       values
         -- BLANK share of a 5-settlement campaign: envelope carries settlementIds
         -- but the owner published a kind='map' (no opt-in). Not importable.
         ($1, 'Blank of a Campaign', 'map', false, $2::jsonb, true, 'blank-optout', false),
         -- map_with_campaign but the opt-in is OFF (publish without sharing members).
         -- Importable, yet exposes ZERO members.
         ($1, 'Campaign, opt-out',   'map_with_campaign', false, $2::jsonb, true, 'campaign-optout', true),
         -- The fully shared case: kind + opt-in ON -> members exposed. Importable.
         ($1, 'Shared Campaign',     'map_with_campaign', true,  $2::jsonb, true, 'shared', true)`,
      [OWNER, campaign],
    );

    // The IDOR + world-gate rows are seeded inside their own tests (below) so the
    // pre-existing facet/parity assertions keep their pristine 3-row fixture set.
    // Stash the IDOR campaign envelope for that test.
    db.__idorCampaign = idorCampaign;
    db.__campaign = campaign;
  });

  const memberCountFor = async (slug) => {
    const rows = (await db.query(`select slug, member_count from public.list_gallery_maps(0, 24)`)).rows;
    return rows.find((r) => r.slug === slug)?.member_count;
  };

  it('a BLANK kind=map share of a campaign reports member_count = 0 (not the un-shared 2)', async () => {
    expect(await memberCountFor('blank-optout')).toBe(0);
  });

  it('a map_with_campaign with the opt-in OFF reports member_count = 0', async () => {
    expect(await memberCountFor('campaign-optout')).toBe(0);
  });

  it('the fully shared campaign (kind + opt-in ON) reports the real member_count', async () => {
    expect(await memberCountFor('shared')).toBe(2);
  });

  it('member_count is at PARITY with the members get_gallery_map projects', async () => {
    // For every public tile, the count list_gallery_maps reports MUST equal the
    // length of the members array get_gallery_map returns for that same slug.
    const tiles = (await db.query(`select slug, member_count from public.list_gallery_maps(0, 24)`)).rows;
    for (const tile of tiles) {
      const detail = (await db.query(`select public.get_gallery_map($1) as out`, [tile.slug])).rows[0].out;
      const projected = Array.isArray(detail?.members) ? detail.members.length : 0;
      expect(tile.member_count, `member_count mismatch for ${tile.slug}`).toBe(projected);
    }
  });

  it('the hasSettlements facet EXCLUDES the opt-out blank rows (member_count > 0 only)', async () => {
    const filtered = (await db.query(
      `select slug from public.list_gallery_maps(0, 24, 'newest', '', '{"hasSettlements": true}'::jsonb)`,
    )).rows.map((r) => r.slug).sort();
    // Only the fully shared row survives; both opt-out rows are filtered out.
    expect(filtered).toEqual(['shared']);
  });

  it('projects the importable flag and the facet narrows to opted-in maps (migration 072)', async () => {
    // The tile carries the owner opt-in flag …
    const tiles = (await db.query(`select slug, importable from public.list_gallery_maps(0, 24)`)).rows;
    const flagBySlug = Object.fromEntries(tiles.map((r) => [r.slug, r.importable]));
    expect(flagBySlug['blank-optout']).toBe(false);
    expect(flagBySlug['campaign-optout']).toBe(true);
    expect(flagBySlug['shared']).toBe(true);

    // … and the facet narrows to exactly the opted-in maps — independent of
    // member_count (a blank/opt-out map can still be importable).
    const filtered = (await db.query(
      `select slug from public.list_gallery_maps(0, 24, 'newest', '', '{"importable": true}'::jsonb)`,
    )).rows.map((r) => r.slug).sort();
    expect(filtered).toEqual(['campaign-optout', 'shared']);
  });

  // ── 088: IDOR — a member owned by a DIFFERENT user must NOT be projected ──────
  it('get_gallery_map does NOT project a member settlement owned by another user (046 IDOR guard)', async () => {
    // A fully shared campaign whose owner-controlled settlementIds list one OWNED
    // settlement plus a settlement owned by OTHER (the IDOR probe).
    await db.query(
      `insert into public.saved_maps
         (user_id, name, share_kind, gallery_share_campaign, map_data, is_public, public_slug, gallery_importable)
       values ($1, 'IDOR Probe', 'map_with_campaign', true, $2::jsonb, true, 'idor', false)`,
      [OWNER, db.__idorCampaign],
    );
    const detail = (await db.query(`select public.get_gallery_map('idor') as out`)).rows[0].out;
    const names = (detail.members || []).map((m) => m.name).sort();
    // Only the OWNER's settlement survives; the foreign 'Foreign Hold' is filtered.
    expect(names).toEqual(['Port']);
    // And neither its old_id nor its slug leaks anywhere in the projection.
    const blob = JSON.stringify(detail);
    expect(blob).not.toContain('cccccccc-cccc-cccc-cccc-cccccccccccc');
    expect(blob).not.toContain('Foreign Hold');
    // member_count parity: the tile must agree the count is 1, not 2.
    expect(await memberCountFor('idor')).toBe(1);
  });

  // ── 088: the gallery_share_world gate — world panel ONLY on the opt-in ────────
  it('get_gallery_map projects the world panel ONLY when gallery_share_world is true', async () => {
    // Two shared campaigns identical but for the gallery_share_world opt-in + a
    // stored (already-sanitized) world snapshot/sections artifact.
    const worldSnapshot = JSON.stringify({ schemaVersion: 1, worldClock: { tick: 3 } });
    await db.query(
      `insert into public.saved_maps
         (user_id, name, share_kind, gallery_share_campaign, gallery_share_world,
          gallery_world_snapshot, gallery_world_sections, map_data, is_public, public_slug)
       values
         ($1, 'World On',  'map_with_campaign', true, true,  $3::jsonb, '[{"title":"Wars"}]'::jsonb, $2::jsonb, true, 'world-on'),
         ($1, 'World Off', 'map_with_campaign', true, false, $3::jsonb, '[{"title":"Wars"}]'::jsonb, $2::jsonb, true, 'world-off')`,
      [OWNER, db.__campaign, worldSnapshot],
    );
    const on = (await db.query(`select public.get_gallery_map('world-on') as out`)).rows[0].out;
    const off = (await db.query(`select public.get_gallery_map('world-off') as out`)).rows[0].out;
    // Opt-in ON: the stored, pre-sanitized snapshot + sections panel is projected.
    expect(on.world).not.toBeNull();
    expect(on.world.snapshot).toEqual({ schemaVersion: 1, worldClock: { tick: 3 } });
    expect(on.world.sections).toEqual([{ title: 'Wars' }]);
    // Opt-in OFF: the panel is null even though the snapshot is STORED on the row
    // and members still project (the gate is the only thing withholding it).
    expect(off.world).toBeNull();
    expect((off.members || []).length).toBe(2);
  });

  // ── 088: publish_map REJECTS a snapshot carrying a HARD-DENY key ──────────────
  it('publish_map REJECTS a world snapshot containing a HARD-DENY key (server-side scan)', async () => {
    // Seed a map the OWNER can publish.
    await db.exec(`
      insert into public.saved_maps (id, user_id, name, map_data, share_kind)
      values ('dddddddd-dddd-dddd-dddd-dddddddddddd', '${OWNER}',
              'To Publish', '{"campaign":{"settlementIds":[]}}'::jsonb, 'map');
    `);
    const callPublish = (snapshot) =>
      db.query(
        `select public.publish_map(
           'dddddddd-dddd-dddd-dddd-dddddddddddd'::uuid,
           'map_with_campaign', 'a description', null, null,
           null, null, true, null, $1::jsonb, null, null)`,
        [JSON.stringify(snapshot)],
      );

    // A snapshot with a forbidden key nested deep inside an allowed section.
    await expect(
      callPublish({ schemaVersion: 1, dashboard: { rngSeed: 12345 } }),
    ).rejects.toThrow(/forbidden private key/i);

    // A top-level HARD-DENY key (npcStates) is rejected too.
    await expect(
      callPublish({ schemaVersion: 1, npcStates: { n1: { secret: 'x' } } }),
    ).rejects.toThrow(/forbidden private key/i);

    // A snapshot missing schemaVersion = 1 is rejected as malformed.
    await expect(
      callPublish({ worldClock: { tick: 1 } }),
    ).rejects.toThrow(/schemaVersion/i);

    // A clean, versioned snapshot publishes successfully and is stored verbatim.
    await callPublish({ schemaVersion: 1, worldClock: { tick: 1 } });
    const stored = (await db.query(
      `select gallery_world_snapshot as s from public.saved_maps
        where id = 'dddddddd-dddd-dddd-dddd-dddddddddddd'`,
    )).rows[0].s;
    expect(stored).toEqual({ schemaVersion: 1, worldClock: { tick: 1 } });
  });
});
