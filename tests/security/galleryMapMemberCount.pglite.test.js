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
        access_state text default 'active'
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
        import_count int default 0
      );
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
    await db.exec(BACKDROP_FN);
    await db.exec(GET_FN);
    await db.exec(LIST_FN);

    // Two owned, active settlements referenced by the campaign envelope.
    await db.exec(`
      insert into public.settlements (id, user_id, name, tier) values
        ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '${OWNER}', 'Port', 't1'),
        ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '${OWNER}', 'Vale', 't2');
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

    await db.query(
      `insert into public.saved_maps
         (user_id, name, share_kind, gallery_share_campaign, map_data, is_public, public_slug)
       values
         -- BLANK share of a 5-settlement campaign: envelope carries settlementIds
         -- but the owner published a kind='map' (no opt-in).
         ($1, 'Blank of a Campaign', 'map', false, $2::jsonb, true, 'blank-optout'),
         -- map_with_campaign but the opt-in is OFF (publish without sharing members).
         ($1, 'Campaign, opt-out',   'map_with_campaign', false, $2::jsonb, true, 'campaign-optout'),
         -- The fully shared case: kind + opt-in ON -> members exposed.
         ($1, 'Shared Campaign',     'map_with_campaign', true,  $2::jsonb, true, 'shared')`,
      [OWNER, campaign],
    );
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
});
