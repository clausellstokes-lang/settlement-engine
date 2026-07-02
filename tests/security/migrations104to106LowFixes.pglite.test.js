/**
 * migrations104to106LowFixes.pglite.test.js — EXECUTION tests of the three
 * low-severity migration repairs 104/105/106 against in-process Postgres.
 *
 * 104 — 053's admin_user_summary counted `settlements.campaign_id is not null`,
 *   but no migration ever created that column (013 added campaign_state); the
 *   pre-013 exception guard swallowed the undefined_column, so the admin panel's
 *   campaign metric was permanently NULL. Proven DIFFERENTIALLY: under the 053
 *   body the count is NULL despite real campaign rows; under 104 it is real.
 *
 * 105 — 059's account-status recreate of publish_settlement silently dropped
 *   018's canon-only server gate. Proven DIFFERENTIALLY: under the 059 body an
 *   un-canonized settlement publishes via direct RPC; under 105 it is refused,
 *   while every client-parity canonized shape (phase='canon', canonizedAt,
 *   worldState.canonizedAt, and NULL campaign_state) still publishes.
 *
 * 106 — 065's bump_map_import was a bare authenticated increment: no dedup, no
 *   owner exclusion, no importability gate — most_imported was forgeable by
 *   looping the RPC. Proven DIFFERENTIALLY: under the 065 body the same caller
 *   double-counts; under 106 repeats/owner/non-importable/anon are no-ops and a
 *   distinct importer still counts.
 *
 * auth.uid() is faked with a session-GUC shim so the definer bodies run
 * verbatim (pglite has no GoTrue). Mirrors migrations100to102AccessGates.
 */
import { describe, it, expect, beforeAll } from 'vitest';
import { PGlite } from '@electric-sql/pglite';
import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

const MIG_DIR = resolve(process.cwd(), 'supabase/migrations');
const MIG_053 = resolve(MIG_DIR, '053_admin_user_management.sql');
const MIG_059 = resolve(MIG_DIR, '059_enforce_account_status_rls.sql');
const MIG_065 = resolve(MIG_DIR, '065_gallery_map_metrics_and_filters.sql');
const MIG_104 = resolve(MIG_DIR, '104_fix_admin_summary_campaign_count.sql');
const MIG_105 = resolve(MIG_DIR, '105_restore_publish_canon_gate.sql');
const MIG_106 = resolve(MIG_DIR, '106_dedupe_map_import_bumps.sql');

const allExist = [MIG_053, MIG_059, MIG_065, MIG_104, MIG_105, MIG_106].every(existsSync);

// Hard-fail (not a silent vacuous skip) if any target migration vanished.
describe('104/105/106 pglite targets exist (guards against silent vacuous skip)', () => {
  it('all target migrations are present on disk', () => {
    expect(allExist, '053/059/065/104/105/106 must all exist under supabase/migrations').toBe(true);
  });
});

/** Extract a `create or replace function public.<name>` body verbatim through its first `$$;`. */
function extractFn(file, name) {
  const src = readFileSync(file, 'utf8');
  const m = src.match(new RegExp(`create or replace function public\\.${name}\\b[\\s\\S]*?\\$\\$;`, 'i'));
  if (!m) throw new Error(`could not extract ${name} from ${file}`);
  return m[0];
}

const ADMIN    = '11111111-1111-4111-8111-111111111111';
const OWNER    = '22222222-2222-4222-8222-222222222222';
const IMPORTER = '33333333-3333-4333-8333-333333333333';
const IMPORTER2 = '44444444-4444-4444-8444-444444444444';

/** Run a single statement as a given user (session-GUC auth.uid() shim, one tx). */
function asUser(db, uid, sql, params) {
  return db.transaction(async (tx) => {
    await tx.query(`set local request.jwt.claim.sub = '${uid}'`);
    return tx.query(sql, params);
  });
}

/** Shared scaffold: roles + the auth.uid() GUC shim. */
async function scaffoldAuth(db) {
  await db.exec(`
    create schema if not exists auth;
    create or replace function auth.uid() returns uuid language sql stable as $fn$
      select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid
    $fn$;
    do $do$ begin
      if not exists (select from pg_roles where rolname = 'anon') then create role anon; end if;
      if not exists (select from pg_roles where rolname = 'authenticated') then create role authenticated; end if;
      if not exists (select from pg_roles where rolname = 'service_role') then create role service_role; end if;
    end $do$;
  `);
}

// ── 104 — admin_user_summary campaign count is real, not permanently NULL ────
describe.runIf(allExist)('104 — admin_user_summary counts campaign_state (pglite)', () => {
  let db;
  const summary = async () =>
    (await asUser(db, ADMIN, `select public.admin_user_summary('${OWNER}'::uuid) as s`)).rows[0].s;

  beforeAll(async () => {
    db = new PGlite();
    await scaffoldAuth(db);
    // Minimal profiles/settlements/warnings + the 050 helpers the body calls.
    // settlements deliberately has campaign_state and NO campaign_id — the real
    // schema shape 053's count silently failed against.
    await db.exec(`
      create table public.profiles (
        id uuid primary key, role text default 'user', tier text default 'free',
        is_founder boolean default false, display_name text, email text,
        credits int default 0, created_at timestamptz default now(),
        disabled_at timestamptz, banned_at timestamptz
      );
      create table public.settlements (
        id uuid primary key default gen_random_uuid(),
        user_id uuid not null, is_public boolean default false,
        campaign_state jsonb
      );
      create table public.warnings (
        id uuid primary key default gen_random_uuid(), user_id uuid not null
      );
      create or replace function public.current_user_is_support_or_higher()
        returns boolean language sql stable as $fn$ select true $fn$;
      create or replace function public.mask_email(e text)
        returns text language sql immutable as $fn$ select '***' $fn$;
    `);
    await db.query(
      `insert into public.profiles (id, email) values ($1, 'a@x.io'), ($2, 'o@x.io')`,
      [ADMIN, OWNER],
    );
    // Two campaign-carrying settlements + one plain draft for the owner.
    await db.query(
      `insert into public.settlements (user_id, campaign_state) values
         ($1, '{"phase":"canon"}'::jsonb),
         ($1, '{"phase":"preplay"}'::jsonb),
         ($1, null)`,
      [OWNER],
    );
  });

  it('DIFFERENTIAL: under the 053 body the campaign count is NULL (undefined_column swallowed)', async () => {
    await db.exec(extractFn(MIG_053, 'admin_user_summary'));
    const s = await summary();
    expect(s.settlements, 'settlement count still works under 053').toBe(3);
    expect(s.campaigns, '053: campaign_id never existed, so the guard nulls the metric').toBeNull();
  });

  it('AFTER 104 the campaign count keys on campaign_state and is real', async () => {
    await db.exec(readFileSync(MIG_104, 'utf8'));
    const s = await summary();
    expect(s.campaigns, '104: two rows carry campaign_state').toBe(2);
    expect(s.settlements).toBe(3);
    expect(s.redacted, 'redacted posture preserved').toBe(true);
    expect(s.email_masked).toBe('***');
    expect(s.email, 'raw email never projected').toBeUndefined();
  });
});

// ── 105 — publish_settlement refuses an un-canonized settlement again ────────
describe.runIf(allExist)('105 — publish_settlement canon gate restored (pglite)', () => {
  let db;
  const ids = {};
  const publish = (uid, id) =>
    asUser(db, uid, `select public.publish_settlement('${id}'::uuid) as slug`);

  beforeAll(async () => {
    db = new PGlite();
    await scaffoldAuth(db);
    await db.exec(`
      create table public.settlements (
        id uuid primary key default gen_random_uuid(),
        user_id uuid not null, is_public boolean default false,
        public_slug text unique, published_at timestamptz,
        campaign_state jsonb
      );
      -- 059's account gate + 008's slug minter, stubbed to isolate the canon gate.
      create or replace function public.account_is_active(uid uuid)
        returns boolean language sql stable as $fn$ select true $fn$;
      create or replace function public._make_public_slug()
        returns text language sql volatile as $fn$
          select 'slug-' || substr(md5(random()::text), 1, 10)
        $fn$;
    `);
    const rows = [
      ['preplay',   `{"phase":"preplay"}`],
      ['canon',     `{"phase":"canon"}`],
      ['stampTop',  `{"phase":"preplay","canonizedAt":"2026-01-01"}`],
      ['stampWorld', `{"phase":"preplay","worldState":{"canonizedAt":"2026-01-01"}}`],
      ['noCampaign', null],
    ];
    for (const [key, state] of rows) {
      const r = await db.query(
        `insert into public.settlements (user_id, campaign_state) values ($1, $2::jsonb) returning id`,
        [OWNER, state],
      );
      ids[key] = r.rows[0].id;
    }
  });

  it('DIFFERENTIAL: under the 059 body an UN-canonized settlement publishes (the gap is real)', async () => {
    await db.exec(extractFn(MIG_059, 'publish_settlement'));
    const r = await publish(OWNER, ids.preplay);
    expect(r.rows[0].slug, '059 body mints a slug for a preplay settlement').toBeTruthy();
    // Reset for the 105 leg.
    await db.query(`update public.settlements set is_public = false, public_slug = null, published_at = null`);
  });

  it('AFTER 105 an un-canonized settlement is refused', async () => {
    await db.exec(readFileSync(MIG_105, 'utf8'));
    await expect(publish(OWNER, ids.preplay)).rejects.toThrow(/only canonized/i);
    const r = await db.query(`select is_public from public.settlements where id = '${ids.preplay}'`);
    expect(r.rows[0].is_public).toBe(false);
  });

  it('AFTER 105 every client-parity canonized shape still publishes', async () => {
    for (const key of ['canon', 'stampTop', 'stampWorld', 'noCampaign']) {
      const r = await publish(OWNER, ids[key]);
      expect(r.rows[0].slug, `${key} must publish`).toBeTruthy();
    }
  });

  it('AFTER 105 a re-publish keeps the existing slug and a non-owner is still refused', async () => {
    const first = (await publish(OWNER, ids.canon)).rows[0].slug;
    await db.query(`update public.settlements set is_public = false where id = '${ids.canon}'`);
    const again = (await publish(OWNER, ids.canon)).rows[0].slug;
    expect(again, 're-publish keeps the slug so old links resolve').toBe(first);
    await expect(publish(IMPORTER, ids.canon)).rejects.toThrow(/not found or not owned/i);
  });
});

// ── 106 — bump_map_import is deduped, owner-excluded, importability-gated ────
describe.runIf(allExist)('106 — bump_map_import dedup ledger (pglite)', () => {
  let db;
  let openMap, closedMap;
  const bump = (uid, slug) =>
    asUser(db, uid, `select public.bump_map_import('${slug}')`);
  const count = async (id) =>
    (await db.query(`select import_count from public.saved_maps where id = '${id}'`)).rows[0].import_count;

  beforeAll(async () => {
    db = new PGlite();
    await scaffoldAuth(db);
    await db.exec(`
      create table public.saved_maps (
        id uuid primary key default gen_random_uuid(),
        user_id uuid not null, name text not null default 'm',
        is_public boolean default false, public_slug text unique,
        import_count integer not null default 0,
        gallery_importable boolean not null default false
      );
    `);
    const mk = async (slug, importable) => {
      const r = await db.query(
        `insert into public.saved_maps (user_id, is_public, public_slug, gallery_importable)
           values ($1, true, $2, $3) returning id`,
        [OWNER, slug, importable],
      );
      return r.rows[0].id;
    };
    openMap = await mk('open-map', true);
    closedMap = await mk('closed-map', false);
  });

  it('DIFFERENTIAL: under the 065 body one caller loops the counter up (forgeable)', async () => {
    await db.exec(extractFn(MIG_065, 'bump_map_import'));
    await bump(IMPORTER, 'open-map');
    await bump(IMPORTER, 'open-map');
    expect(await count(openMap), '065: the same caller double-counts').toBe(2);
    await db.query(`update public.saved_maps set import_count = 0`);
  });

  it('AFTER 106 a repeat caller counts once per map per day', async () => {
    await db.exec(readFileSync(MIG_106, 'utf8'));
    await bump(IMPORTER, 'open-map');
    await bump(IMPORTER, 'open-map');
    await bump(IMPORTER, 'open-map');
    expect(await count(openMap)).toBe(1);
  });

  it('AFTER 106 a distinct importer still counts', async () => {
    await bump(IMPORTER2, 'open-map');
    expect(await count(openMap)).toBe(2);
  });

  it('AFTER 106 the owner cannot inflate their own map', async () => {
    await bump(OWNER, 'open-map');
    expect(await count(openMap)).toBe(2);
  });

  it('AFTER 106 a non-importable map never counts (no import is possible for it)', async () => {
    await bump(IMPORTER, 'closed-map');
    expect(await count(closedMap)).toBe(0);
  });

  it('AFTER 106 an unauthenticated call is a quiet no-op', async () => {
    await db.query(`select public.bump_map_import('open-map')`); // no GUC set → auth.uid() null
    expect(await count(openMap)).toBe(2);
  });

  it('the dedup ledger is not API-readable (029 posture)', async () => {
    for (const role of ['anon', 'authenticated']) {
      const r = await db.query(`select has_table_privilege('${role}', 'public.map_imports', 'SELECT') as ok`);
      expect(r.rows[0].ok, `${role} must not read map_imports`).toBe(false);
    }
  });
});
