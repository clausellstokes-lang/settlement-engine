/**
 * galleryVeilCures.pglite.test.js — THE INDEPENDENT REVIEW'S ROWS ON MIGRATION 211, PINNED
 * (COHERENCE-VEIL-2; REVIEW-VEIL-211-ad17ec005-2026-11-12 on lane/review-veil-2026-11-12).
 *
 * Each block is a finding's own row, red at ad17ec005, executed against the real SQL (every
 * migration on disk, in order, in an in-process Postgres) and, where a page is named, the real
 * client read (src/lib/gallery.js over a fake supabase whose rpc runs that SQL). AT210 is the chain
 * through 210: the page before 211, the control a cure may never show more than.
 *   F1  a snapshot share never serves the live row: the client's own copy passes the server's bound,
 *       and a copy past it is refused, never replaced by the live row;
 *   F2  the server's card id equals the client's for every value a row can hold: the review's rows,
 *       then a differential over thousands of generated cards;
 *   F3  nothing storable makes a read raise: the review's rows, then a fuzz through all four reads;
 *   F4  the member keys a read works on are the ones that name a person in the document;
 *   F7  the map serves what the member's own listing serves (its frozen copy, its narration);
 *   and the rollback: supabase/rollback/211_*.down.sql over 001..211 restores the four reads of a
 *       chain stopped at 210, byte for byte.
 * No clock is read here: the costs (F4, F5, F6) are the probes' (docs/chair/2026-11-12/veil-probe-2).
 */
import { describe, it, expect, beforeAll, vi } from 'vitest';
import { PGlite } from '@electric-sql/pglite';
import { pgcrypto } from '@electric-sql/pglite/contrib/pgcrypto';
import { readFileSync, readdirSync } from 'node:fs';
import { resolve, join } from 'node:path';

const PGLITE_BOOT_TIMEOUT_MS = 900_000; // deadlock guard, not a perf budget — never tune to a measured boot (see pgliteHookTimeoutRatchet.test.js)
const ROW_TIMEOUT_MS = 900_000;

const H = vi.hoisted(() => ({ db: null, uid: '', last: null }));
vi.mock('../../src/lib/supabase.js', () => {
  const tableFns = new Set(['get_gallery_dossier', 'import_gallery_dossier']);
  const served = new Set(['get_gallery_dossier', 'get_unlisted_dossier', 'import_gallery_dossier', 'get_gallery_map']);
  const supabase = {
    rpc: async (name, args = {}) => {
      if (!served.has(name)) return { data: null, error: { message: `not served here: ${name}` } };
      try {
        await H.db.exec(`set test.uid = '${H.uid}';`);
        const keys = Object.keys(args);
        const call = `public.${name}(${keys.map((k, i) => `${k} => $${i + 1}`).join(', ')})`;
        const r = await H.db.query(tableFns.has(name) ? `select * from ${call}` : `select ${call} as out`, keys.map((k) => args[k]));
        H.last = tableFns.has(name) ? r.rows : r.rows[0]?.out;
        return { data: H.last, error: null };
      } catch (e) { H.last = { raised: String(e.message) }; return { data: null, error: { message: String(e.message) } }; }
    },
  };
  return { supabase, isConfigured: true, default: supabase };
});

const MIGRATIONS = resolve(process.cwd(), 'supabase', 'migrations');
const ROLLBACK = resolve(process.cwd(), 'supabase', 'rollback');
const OWNER = '11111111-1111-1111-1111-111111111111';
const READER = '22222222-2222-2222-2222-222222222222';
const SCAFFOLD = `
    create schema if not exists auth;
    create or replace function auth.uid() returns uuid language sql stable as $fn$
      select nullif(current_setting('test.uid', true), '')::uuid $fn$;
    create or replace function auth.role() returns text language sql stable as $fn$
      select coalesce(nullif(current_setting('test.role', true), ''), 'anon') $fn$;
    create or replace function auth.jwt() returns jsonb language sql stable as $fn$ select '{}'::jsonb $fn$;
    create table if not exists auth.users (id uuid primary key, email text, raw_user_meta_data jsonb default '{}',
      raw_app_meta_data jsonb default '{}', created_at timestamptz default now(), last_sign_in_at timestamptz,
      email_confirmed_at timestamptz, phone text, deleted_at timestamptz, is_anonymous boolean default false);
    do $do$ begin
      if not exists (select from pg_roles where rolname = 'authenticated') then create role authenticated; end if;
      if not exists (select from pg_roles where rolname = 'anon') then create role anon; end if;
      if not exists (select from pg_roles where rolname = 'service_role') then create role service_role; end if;
    end $do$;
    create schema if not exists extensions;
    create schema if not exists cron;
    create table if not exists cron.job (jobid bigserial primary key, jobname text, schedule text, command text);
    create or replace function cron.schedule(n text, s text, c text) returns bigint language sql as $fn$
      insert into cron.job (jobname, schedule, command) values (n, s, c) returning jobid $fn$;
    create or replace function cron.unschedule(n text) returns boolean language sql as $fn$ select true $fn$;
    create or replace function cron.unschedule(n bigint) returns boolean language sql as $fn$ select true $fn$;
    create schema if not exists storage;
    create table if not exists storage.buckets (id text primary key, name text, public boolean, owner uuid,
      file_size_limit bigint, allowed_mime_types text[], created_at timestamptz default now(), updated_at timestamptz default now());
    create table if not exists storage.objects (id uuid primary key default gen_random_uuid(), bucket_id text, name text,
      owner uuid, metadata jsonb, created_at timestamptz default now(), updated_at timestamptz default now());
    create or replace function storage.foldername(name text) returns text[] language sql immutable as $fn$
      select string_to_array(name, '/') $fn$;
    create extension if not exists pgcrypto;`;

async function buildDb(through = 999) {
  const db = new PGlite({ extensions: { pgcrypto } });
  await db.exec(SCAFFOLD);
  const files = readdirSync(MIGRATIONS).filter((f) => /^\d{3}_.*\.sql$/.test(f)).sort().filter((f) => Number(f.slice(0, 3)) <= through);
  const failed = [];
  for (const f of files) {
    // pg_cron / pg_net are not in pglite: their install statements become no-ops (cron.* is stubbed above).
    const sql = readFileSync(join(MIGRATIONS, f), 'utf-8').replace(/create extension if not exists (pg_cron|pg_net)( with schema extensions)?/gi, 'select 1');
    try { await db.exec(sql); } catch (e) { failed.push(`${f}: ${String(e?.message || e).slice(0, 160)}`); }
  }
  if (failed.length) return { db, files, failed };
  await db.exec(`insert into auth.users (id) values ('${OWNER}'), ('${READER}') on conflict do nothing;
    insert into public.profiles (id) values ('${OWNER}'), ('${READER}') on conflict do nothing;
    update public.profiles set role = 'developer' where id = '${OWNER}';
    create or replace function public.current_user_has_premium_access() returns boolean language sql stable as $f$ select true $f$;`);
  return { db, files, failed };
}

const BROWSER = Object.freeze({ tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat',
  nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' });
// The deploy-check "Force all" request (lane/chair-2026-11-08 :: docs/chair/2026-11-10/deploy-check-force-all.json,
// copied byte for byte beside this lane's probes): the heaviest request the wizard sends, the review's F1 row.
const FORCE_ALL = resolve(process.cwd(), 'docs/chair/2026-11-12/veil-probe-2/deploy-check-force-all.json');

const isRec = (v) => !!v && typeof v === 'object' && !Array.isArray(v);
const has = (v, s) => JSON.stringify(v ?? null).includes(s);

describe('COHERENCE-VEIL-2: the review rows on 211, executed', () => {
  /** @type {any} */ let LIVE; /** @type {any} */ let AT210;
  /** @type {any} */ let veil; /** @type {any} */ let gallery; /** @type {any} */ let gen; /** @type {any} */ let compose;
  let n = 0;

  beforeAll(async () => {
    LIVE = await buildDb();
    AT210 = await buildDb(210);
    veil = await import('../../src/domain/display/galleryVeil.js');
    gallery = await import('../../src/lib/gallery.js');
    ({ generateSettlementPipeline: gen } = await import('../../src/generators/generateSettlementPipeline.js'));
    ({ composePublicProse: compose } = await import('../../src/components/new/publicProseCompose.js'));
  }, PGLITE_BOOT_TIMEOUT_MS);

  /** A listed and linked share of `data` (a record, or raw JSON text written as PostgREST would). */
  async function put(db, data, ov, { dm = false, narrated = null } = {}) {
    n += 1;
    const id = `aaaaaaaa-0000-0000-0000-${String(n).padStart(12, '0')}`;
    await db.query(`insert into public.settlements (id, user_id, name, tier, data, is_public, public_slug, published_at, unlisted_slug, visibility,
        gallery_member_overrides, gallery_share_dm, gallery_importable, gallery_share_narrated, ai_data)
      values ($1, $2, 'T', 'town', $3, true, $4, now(), $5, 'unlisted', $6, $7, true, $8, $9)`,
    [id, OWNER, typeof data === 'string' ? data : JSON.stringify(data), `p${n}`, `l${n}`, JSON.stringify(ov), dm,
      narrated !== null, narrated === null ? null : JSON.stringify({ aiSettlement: narrated })]);
    return { id, slug: `p${n}`, link: `l${n}` };
  }
  async function readBoth(db, { slug, link }) {
    H.db = db; H.uid = '';
    const g = await gallery.fetchPublicDossier(slug); const gResp = H.last;
    const l = await gallery.fetchPublicDossier(link); const lResp = H.last;
    return { g, gResp, l, lResp };
  }

  it('both chains apply whole', () => {
    expect(LIVE.failed).toEqual([]);
    expect(AT210.failed).toEqual([]);
    expect(AT210.files.at(-1)).toMatch(/^210_/);
  });

  // ── F1 ────────────────────────────────────────────────────────────────────────────────────────
  it('F1 (the review row): the Force-all copy the client itself froze, Reveal DM on, is served FROZEN, never the live row', async () => {
    const { config, seed } = JSON.parse(readFileSync(FORCE_ALL, 'utf-8'));
    const raw = gen(config, null, { seed, customContent: {} });
    const rec = { ...raw, publicProse: compose(raw) };
    const copy = veil.galleryPayloadFor(rec, { shareDm: true });
    const at = '2026-11-12T00:00:00.000Z';
    const ov = veil.writeShareVeil({}, [], { mode: 'snapshot', at, snapshot: copy });
    expect(ov.$veil.snapshot, 'the client keeps its own copy').toBeTruthy();
    const live = structuredClone(rec);
    live.institutions[0].desc = `POSTSNAPSHOT_SPOILER ${live.institutions[0].desc || ''}`;
    for (const [where, { db }] of [['211', LIVE], ['210', AT210]]) {
      const share = await put(db, live, ov, { dm: true });
      const r = await readBoth(db, share);
      expect(r.g.galleryMode, where).toBe('snapshot');
      expect(r.g.snapshotAt, where).toBe(at);
      // anchored: the page is the town itself (its name is drawn), and it is the frozen one
      expect(r.g.settlement.name, where).toBe(rec.name);
      expect(has(r.g.settlement, 'POSTSNAPSHOT_SPOILER'), `${where} page`).toBe(false);
      if (where === '211') expect(has(r.gResp, 'POSTSNAPSHOT_SPOILER'), '211 response').toBe(false);
    }
  }, ROW_TIMEOUT_MS);

  it('F1 (the bound, derived): every copy the client admits passes the server\'s; a copy past it is REFUSED, never the live row', async () => {
    const { db } = LIVE;
    // THE WORST RATIO, executed. jsonb::text adds a space after every ':' and ',' (ratio 2 on that
    // character) and prints a number in plain notation; strings, escapes, literals and brackets are no
    // longer (a code point is at most one UTF-16 unit shorter). The worst number token is the smallest
    // subnormal: JS spells it in 6 characters, jsonb in 326. So the server's length is at most 326/6 of
    // the client's, whatever the shape, and the bound is 1,000,000 x 326 / 6 = 54,333,333.
    const tokens = ['5e-324', '-5e-324', '1e-323', '1e+308', '1.7976931348623157e+308', '1e-7', '1e+21', '0', '-1.5e-10'];
    let worst = 0;
    for (const t of tokens) {
      expect(String(Number(t)) === t || JSON.stringify(Number(t)) === t, t).toBe(true);
      const pgLen = (await db.query('select length($1::jsonb::text) as n', [t])).rows[0].n;
      worst = Math.max(worst, pgLen / t.length);
    }
    expect(worst).toBe(326 / 6);
    const bound = Number((await db.query(`select public._gallery_veil_copy_bound() as b`)).rows[0].b);
    expect(bound).toBe(Math.floor(1_000_000 * 326 / 6));
    // a hand-written copy past the bound (180,000 numbers 1e+308: 1.08 MB in JS, 56 MB as jsonb text)
    const big = `{"name":"FROZEN","n":[${Array(180_000).fill('1e+308').join(',')}]}`;
    const ov = `{"$veil":{"v":1,"deltas":[],"mode":"snapshot","at":"2026-11-12T00:00:00.000Z","snapshot":${big}}}`;
    n += 1;
    await db.query(`insert into public.settlements (id, user_id, name, tier, data, is_public, public_slug, published_at, unlisted_slug, visibility, gallery_member_overrides)
      values ($1, $2, 'T', 'town', '{"name":"LIVE_ROW"}', true, $3, now(), $4, 'unlisted', $5)`, [`aaaaaaaa-0000-0000-0000-${String(n).padStart(12, '0')}`, OWNER, `p${n}`, `l${n}`, ov]);
    expect(Number((await db.query(`select length((gallery_member_overrides #> '{$veil,snapshot}')::text) as n from public.settlements where public_slug = $1`, [`p${n}`])).rows[0].n)).toBeGreaterThan(bound);
    const g = await db.query('select data from public.get_gallery_dossier($1)', [`p${n}`]);
    expect(g.rows, 'refused: no row, so never the live row under the word snapshot').toEqual([]);
  }, ROW_TIMEOUT_MS);
});
