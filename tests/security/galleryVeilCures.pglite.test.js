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
 *   F3  an id beyond double range reads as JavaScript reads it (the review's rows);
 *   R3  (the SECOND review, REVIEW-VEIL-211-c4d78c907) THE PARITY LAW: no stored row raises a read at
 *       211 that serves at 210 — its rows (a number at the top of numeric's range in the document, a
 *       frozen copy, a narration), then a fuzz to the edges of what the database stores, both chains;
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
  // A seeded generator (no clock, no Math.random): the class tests are the same on every run.
  function rngOf(seed) { let s = seed >>> 0; return () => { s = (Math.imul(s, 1664525) + 1013904223) >>> 0; return s / 2 ** 32; }; }
  const EDGE_NUMBERS = ['0', '-0', '1', '-1', '0.5', '1e-7', '-1e-7', '1e-6', '1e21', '1e+21', '1e20', '123456789012345678901', '9007199254740992',
    '9007199254740993', '-9007199254740993', '12345678901234567890123', '31621967360964610', '1e400', '-1e400', '1e-400', '-1e-400', '5e-324',
    '2.4703282292062327e-324', '2.4703282292062328e-324', '1.7976931348623157e308', '1.7976931348623158e308', '1.7976931348623159e308',
    '0.1', '100.0', '1E5', '1.5e300', '-2.5e-10', '4.35e-6', '0.000001', '0.0000001', '999999999999999999999.5', '1e-323', '1.0000000000000002',
    // the edges of what the database can store (COHERENCE-VEIL-3, the review's R3): numeric holds up to
    // 131,072 digits before the point and 16,383 after; 2.5e130748 is where 211's multiplication left the range
    '1e131071', '-1e131071', '9.99e131071', '2.5e130748', '-2.5e130748', '1e130747', '1e-16383', '-1e-16383'];
  /** A JSON number token: an edge, a random double from random bits (every exponent), or a long decimal. */
  function numberToken(r) {
    const pick = r();
    if (pick < 0.4) return EDGE_NUMBERS[Math.floor(r() * EDGE_NUMBERS.length)];
    if (pick < 0.8) {
      const dv = new DataView(new ArrayBuffer(8));
      dv.setUint32(0, Math.floor(r() * 2 ** 32)); dv.setUint32(4, Math.floor(r() * 2 ** 32));
      const x = dv.getFloat64(0);
      return Number.isFinite(x) ? JSON.stringify(x) : '0';
    }
    const digits = Array.from({ length: 1 + Math.floor(r() * 40) }, () => Math.floor(r() * 10)).join('');
    return `${r() < 0.5 ? '-' : ''}${digits.replace(/^0+(?=\d)/, '')}${r() < 0.5 ? `.${Math.floor(r() * 1e9)}` : ''}${r() < 0.5 ? `e${Math.floor(r() * 700) - 350}` : ''}`;
  }
  const STRINGS = ['', ' ', 'x', 'House', 'The Hidden Hand', "Thieves' Guild", '  -- Ünder  Côte --  ', 'İstanbul KELVIN Kk', '日本語', '🗝 Key',
    'a:b:c', 'x_y-z.9', 'a'.repeat(120), '0', 'false', 'null', 'event.legacy-1', '$veil', 'npc.a', '\n\t', '"q"', '\\'];
  function valueToken(r, depth = 0) {
    const pick = r();
    if (pick < 0.45) return numberToken(r);
    if (pick < 0.75) return JSON.stringify(STRINGS[Math.floor(r() * STRINGS.length)]);
    if (pick < 0.85) return ['true', 'false', 'null'][Math.floor(r() * 3)];
    if (pick < 0.95 && depth < 2) return `[${Array.from({ length: Math.floor(r() * 4) }, () => valueToken(r, depth + 1)).join(',')}]`;
    return depth < 2 ? `{${r() < 0.5 ? '' : `"a":${valueToken(r, depth + 1)}`}}` : '{}';
  }
  // master's stored tie (COHERENCE-VEIL-4, V4-1): its ends are `npc1Id`/`npc2Id`, so the fuzz draws
  // ties in both stored shapes, the deployed client's and the new one
  const ID_KEYS = ['id', 'refId', 'name', 'label', 'title', 'type', 'faction', 'parties', 'issue', 'from', 'to', 'npc1Id', 'npc2Id', 'npc1Name', 'npc2Name'];
  function cardText(r) {
    const keys = ID_KEYS.filter(() => r() < 0.35);
    return `{${keys.map((k) => `${JSON.stringify(k)}:${valueToken(r)}`).join(',')}}`;
  }

  // ── F3 ────────────────────────────────────────────────────────────────────────────────────────
  it('F3 (the review rows): an id beyond double range reads as JavaScript reads it; no read raises', async () => {
    for (const v of ['1e400', '-1e400', '1e-400']) {
      const share = await put(LIVE.db, `{"name":"T","institutions":[{"id":${v},"name":"House","desc":"ok"}]}`, veil.writeShareVeil({}, []));
      const r = await readBoth(LIVE.db, share);
      expect(r.gResp?.raised ?? null, v).toBe(null);
      expect(r.lResp?.raised ?? null, v).toBe(null);
      expect(r.g.settlement.institutions[0].name, v).toBe('House');
    }
  }, ROW_TIMEOUT_MS);

  /** A stored document shaped like a settlement, every value drawn from the awkward pools above. */
  function docText(r) {
    const card = () => {
      const keys = [...ID_KEYS, 'category', 'priorityCategory', 'facets', 'tags', 'serviceKeys', 'desc', 'description', 'secret', 'plotHooks',
        'institution', 'linkedInstitutionIds', 'members', 'captureState', 'reason', 'personality', 'allegiance', 'stakes'].filter(() => r() < 0.3);
      return `{${keys.map((k) => `${JSON.stringify(k)}:${k === 'category' && r() < 0.5 ? '"criminal"' : k === 'tags' && r() < 0.5 ? '["facet:clandestine:clandestine","brokerage","criminal"]' : valueToken(r)}`).join(',')}}`;
    };
    const list = () => (r() < 0.85 ? `[${Array.from({ length: Math.floor(r() * 5) }, () => (r() < 0.9 ? card() : valueToken(r))).join(',')}]` : valueToken(r));
    const parts = [`"name":${r() < 0.9 ? '"T"' : valueToken(r)}`];
    for (const k of ['npcs', 'institutions', 'factions', 'conflicts', 'relationships', 'structuralViolations', 'decrees', 'coherenceNotes']) if (r() < 0.6) parts.push(`"${k}":${list()}`);
    if (r() < 0.6) parts.push(`"powerStructure":{"factions":${list()},"conflicts":${list()},"factionRelationships":${list()},"criminalCaptureState":${valueToken(r)}}`);
    if (r() < 0.6) parts.push(`"history":{"historicalEvents":${list()},"eventsTimeline":${list()},"currentTensions":${list()}}`);
    if (r() < 0.5) parts.push(`"availableServices":{"criminal":${list()},"trade":${list()}}`);
    if (r() < 0.4) parts.push(`"economicState":{"safetyProfile":{"criminalInstitutions":${valueToken(r)},"blackMarketCapture":${valueToken(r)}}}`);
    if (r() < 0.4) parts.push(`"publicProse":{"blocks":{"defense:criminal":${valueToken(r)},"power:desk":{"captureReading":${valueToken(r)}}}}`);
    if (r() < 0.3) parts.push(`"plotHooks":${list()}`);
    return `{${parts.join(',')}}`;
  }
  const GOOD_ADDRESSES = ['tab:plot_hooks', 'block:services.criminal', 'block:power.criminalUnderside', 'class:npc:secret', 'class:institution:services',
    'class:event:description', 'field:event:event.legacy-1:description', 'card:institution:house', 'card:npc:npc.a', 'field:npc:1e-7:personality'];
  function overridesText(r) {
    const parts = [];
    for (let i = Math.floor(r() * 4); i > 0; i -= 1) parts.push(`${JSON.stringify(STRINGS[Math.floor(r() * STRINGS.length)] || 'k')}:${r() < 0.6 ? `{"revealDm":${r() < 0.5 ? 'false' : 'true'},"allowImport":${r() < 0.5 ? 'false' : 'true'}}` : r() < 0.6 ? `{"revealDm":${valueToken(r)},"allowImport":${valueToken(r)}}` : valueToken(r)}`);
    if (r() < 0.85) {
      const delta = () => (r() < 0.8 ? `{"address":${r() < 0.6 ? JSON.stringify(GOOD_ADDRESSES[Math.floor(r() * GOOD_ADDRESSES.length)]) : valueToken(r)},"hidden":${r() < 0.8 ? (r() < 0.5 ? 'true' : 'false') : valueToken(r)}}` : valueToken(r));
      const veilParts = [`"v":${valueToken(r)}`, `"deltas":${r() < 0.85 ? `[${Array.from({ length: Math.floor(r() * 6) }, delta).join(',')}]` : valueToken(r)}`];
      if (r() < 0.5) veilParts.push(`"mode":${r() < 0.7 ? '"snapshot"' : valueToken(r)}`, `"at":${valueToken(r)}`, `"snapshot":${r() < 0.7 ? docText(r) : valueToken(r)}`);
      parts.push(`"$veil":${r() < 0.9 ? `{${veilParts.join(',')}}` : valueToken(r)}`);
    }
    return `{${parts.join(',')}}`;
  }

  /** One stored row (raw JSON text, as PostgREST would write it) in `db`, with a map holding it. */
  async function putRaw(db, tag, { doc, ov = '{}', dm = false, narrated = null }) {
    n += 1;
    const id = `ffffffff-0000-0000-0000-${String(n).padStart(12, '0')}`;
    await db.query(`insert into public.settlements (id, user_id, name, tier, data, is_public, public_slug, published_at, unlisted_slug, visibility,
        gallery_member_overrides, gallery_share_dm, gallery_importable, gallery_share_narrated, ai_data)
      values ($1, $2, 'T', 'town', $3, true, $4, now(), $5, 'unlisted', $6, $7, true, $8, $9)`,
    [id, OWNER, doc, `z${tag}`, `zl${tag}`, ov, dm, narrated !== null, narrated === null ? null : `{"aiSettlement":${narrated}}`]);
    await db.query(`insert into public.saved_maps (id, user_id, name, map_data, is_public, public_slug, share_kind, gallery_share_campaign)
      values (gen_random_uuid(), $1, 'm', $2, true, $3, 'map_with_campaign', true)`, [OWNER, JSON.stringify({ campaign: { settlementIds: [id] } }), `zm${tag}`]);
  }
  /** The four reads of a row put by putRaw, each 'ok' or the message it raised. */
  async function fourReads(db, tag) {
    const out = {};
    for (const [read, uid, q] of [['gallery', '', `select data from public.get_gallery_dossier('z${tag}')`], ['link', '', `select public.get_unlisted_dossier('zl${tag}')`],
      ['import', READER, `select data from public.import_gallery_dossier('z${tag}')`], ['map', '', `select public.get_gallery_map('zm${tag}')`]]) {
      await db.exec(`set test.uid = '${uid}';`);
      try { await db.query(q); out[read] = 'ok'; } catch (e) { out[read] = String(e.message).slice(0, 100); }
    }
    await db.exec(`set test.uid = '';`);
    return out;
  }
  /** THE PARITY LAW (COHERENCE-VEIL-3): a read that serves the row at 210 serves it at 211. */
  async function parity(tag, row) {
    await putRaw(LIVE.db, tag, row); await putRaw(AT210.db, tag, row);
    const now = await fourReads(LIVE.db, tag); const before = await fourReads(AT210.db, tag);
    return { now, before, breaches: Object.keys(now).filter((k) => now[k] !== 'ok' && before[k] === 'ok').map((k) => `${k}: ${now[k]}`) };
  }

  it('R3 (the review rows): a number at the top of the database\'s range makes no read raise that serves at 210', async () => {
    const MARKED = '{"$veil":{"v":1,"deltas":[]}}';
    const ROWS = [
      ['npc id 1e131071, unmarked', { doc: '{"name":"T","npcs":[{"name":"A","id":1e131071}]}' }],
      ['member name 2.5e130748, marked', { doc: '{"name":"T","powerStructure":{"factions":[{"name":"F","members":[{"name":2.5e130748}]}]}}', ov: MARKED }],
      ['npc id -1e131071 in the frozen copy', { doc: '{"name":"T"}', ov: '{"$veil":{"v":1,"deltas":[],"mode":"snapshot","at":"2026-11-01T00:00:00Z","snapshot":{"name":"T","npcs":[{"name":"A","id":-1e131071}]}}}' }],
      ['npc id 1e131071 in the narration', { doc: '{"name":"T"}', ov: MARKED, narrated: '{"name":"T","npcs":[{"name":"A","id":1e131071}]}' }],
      ['conflict part 9.99e131071, unmarked', { doc: '{"name":"T","conflicts":[{"parties":[9.99e131071,"x"],"stakes":"S"}]}' }],
      ['institution id -2.5e130748, marked', { doc: '{"name":"T","institutions":[{"id":-2.5e130748,"name":"House","desc":"d"}]}', ov: MARKED }],
    ];
    const out = {};
    for (const [tag, row] of ROWS) {
      const { now, before, breaches } = await parity(`r3-${Object.keys(out).length}`, row);
      // anchored: 210 serves every read of these rows, so a 211 raise is a breach of the law
      expect(Object.values(before), `${tag} at 210`).toEqual(['ok', 'ok', 'ok', 'ok']);
      out[tag] = { breaches, now };
    }
    expect(Object.fromEntries(Object.entries(out).map(([k, v]) => [k, v.breaches]))).toEqual(Object.fromEntries(ROWS.map(([k]) => [k, []])));
  }, ROW_TIMEOUT_MS);

  /** A subtree N objects or arrays deep, a hook key at its bottom (the second review's R4 row). */
  const deepText = (kind, depth) => {
    let s = '{"theHook":"x"}';
    for (let i = 0; i < depth; i += 1) s = kind === 'obj' ? `{"a":${s}}` : `[${s}]`;
    return s;
  };
  /** An id N arrays deep (String() of it is Array.prototype.join, recursively). */
  const deepId = (depth) => `${'['.repeat(depth)}1${']'.repeat(depth)}`;

  it('R4 (the review rows): a document hundreds deep under Reveal DM makes no read raise that serves at 210', async () => {
    const MARKED = '{"$veil":{"v":1,"deltas":[]}}';
    const ROWS = [];
    for (const kind of ['obj', 'arr']) for (const depth of [550, 900]) {
      ROWS.push([`${kind} ${depth}, Reveal DM, marked`, { doc: `{"name":"T","npcs":[{"name":"A"}],"deep":${deepText(kind, depth)},"lore":{"aHook":"z"}}`, ov: MARKED, dm: true }]);
    }
    const out = {};
    for (const [tag, row] of ROWS) {
      const { before, breaches } = await parity(`r4-${Object.keys(out).length}`, row);
      // anchored: 210 serves every read of these rows, so a 211 raise is a breach of the law
      expect(Object.values(before), `${tag} at 210`).toEqual(['ok', 'ok', 'ok', 'ok']);
      out[tag] = breaches;
    }
    expect(out).toEqual(Object.fromEntries(ROWS.map(([k]) => [k, []])));
    // and what the walk serves: every hook key gone at every depth, the deep subtree itself kept
    for (const [i, [tag]] of ROWS.entries()) {
      const g = (await LIVE.db.query(`select data from public.get_gallery_dossier('zr4-${i}')`)).rows[0].data;
      expect(JSON.stringify(g).includes('Hook'), tag).toBe(false);
      expect(JSON.stringify(g.deep).length, tag).toBeGreaterThan(1000);
      expect(g.npcs[0].name, tag).toBe('A');
    }
  }, ROW_TIMEOUT_MS);

  it('R4 (the same class, found by searching every helper for recursion): String() of an id 1,000 and 5,000 arrays deep is JavaScript\'s, with no nested call', async () => {
    const ids = [deepId(1000), deepId(5000), `[${deepId(1000)},[],null,{"a":1},"x",[[2,[]],3]]`, `[[],[[]],[null,[null]],[1,[2,[3,[4,"5"]]]]]`];
    const rows = (await LIVE.db.query(`select e::text as t, public._gallery_veil_jsstr(e) as s, public._gallery_veil_join(e, '-') as j
        from jsonb_array_elements($1::jsonb) with ordinality x(e, o) order by o`, [`[${ids.join(',')}]`])).rows;
    expect(rows).toHaveLength(ids.length);
    // an id 5,000 deep: JavaScript's own String() overflows its stack there (the client cannot address
    // such an id at all), so its spelling is checked as known: the one leaf, '1'
    expect(rows[1].s).toBe('1');
    expect(rows[1].j).toBe('1');
    for (const { t: text, s, j } of rows.filter((_, i) => i !== 1)) {
      const v = JSON.parse(text);
      expect(s, text.slice(0, 40)).toBe(String(v));
      expect(j, text.slice(0, 40)).toBe(v.map((x) => (x === null || x === undefined ? '' : String(x))).join('-'));
    }
  }, ROW_TIMEOUT_MS);

  // ── R1 ────────────────────────────────────────────────────────────────────────────────────────
  it('R1 (the review row): the import of a snapshot share is its FROZEN copy: nothing written after the freeze reaches the importer', async () => {
    const at = '2026-11-01T00:00:00.000Z';
    const rec = { name: 'T', npcs: [{ id: 'npc_a', name: 'Ada', role: 'smith' }], institutions: [{ id: 'h', name: 'House', desc: 'FROZEN_DESC' }] };
    const live = structuredClone(rec);
    live.institutions[0].desc = 'RVPOST_DESC';
    live.npcs.push({ id: 'npc_rvpost', name: 'Rvpost Newcomer', role: 'spy', secret: 'RVPOST_SECRET' });
    const read = async (db, ov, dm = false) => {
      const share = await put(db, live, ov, { dm });
      H.db = db; H.uid = READER;
      const page = await gallery.fetchDossierForImport(share.slug);
      const resp = H.last; H.uid = '';
      const g = await gallery.fetchPublicDossier(share.slug);
      return { page, resp, g };
    };
    const out = {};
    for (const [where, { db }] of [['211', LIVE], ['210', AT210]]) {
      for (const dm of [false, true]) {
        const ov = veil.writeShareVeil({}, [], { mode: 'snapshot', at, snapshot: veil.galleryPayloadFor(rec, { shareDm: dm }) });
        const r = await read(db, ov, dm);
        out[`${where}${dm ? ' +dm' : ''}`] = { postFreeze: has(r.resp, 'Rvpost') || has(r.resp, 'RVPOST'), frozen: has(r.page, 'FROZEN_DESC'),
          sameAsGallery: JSON.stringify(r.page.settlement.npcs?.map((x) => x.name)) === JSON.stringify(r.g.settlement.npcs?.map((x) => x.name)) };
      }
    }
    // red control: 210 hands the importer the live town
    expect(out['210'].postFreeze).toBe(true);
    expect(out['211']).toEqual({ postFreeze: false, frozen: true, sameAsGallery: true });
    expect(out['211 +dm']).toEqual({ postFreeze: false, frozen: true, sameAsGallery: true });
  }, ROW_TIMEOUT_MS);

  it('R1 (the edges): a refused copy is refused on import too; a snapshot share with no copy imports what its gallery page shows', async () => {
    const { db } = LIVE;
    // past the bound (the F1 row's copy): no row on import, never the live row
    const big = `{"name":"FROZEN","n":[${Array(180_000).fill('1e+308').join(',')}]}`;
    const refused = await put(db, '{"name":"LIVE_ROW"}', {});
    await db.query(`update public.settlements set gallery_member_overrides = $2 where public_slug = $1`, [refused.slug,
      `{"$veil":{"v":1,"deltas":[],"mode":"snapshot","at":"2026-11-12T00:00:00.000Z","snapshot":${big}}}`]);
    await db.exec(`set test.uid = '${READER}';`);
    expect((await db.query('select data from public.import_gallery_dossier($1)', [refused.slug])).rows).toEqual([]);
    expect((await db.query('select data from public.get_gallery_dossier($1)', [refused.slug])).rows).toEqual([]);
    // no copy: live, as the gallery read
    await db.exec(`set test.uid = '';`);
    const nocopy = await put(db, { name: 'T', institutions: [{ id: 'h', name: 'House', desc: 'LIVE_NOCOPY' }] }, { $veil: { v: 1, deltas: [], mode: 'snapshot', at: '2026-11-12T00:00:00.000Z' } });
    await db.exec(`set test.uid = '${READER}';`);
    const imp = (await db.query('select data from public.import_gallery_dossier($1)', [nocopy.slug])).rows[0].data;
    await db.exec(`set test.uid = '';`);
    const gal = (await db.query('select data from public.get_gallery_dossier($1)', [nocopy.slug])).rows[0].data;
    expect(has(imp, 'LIVE_NOCOPY')).toBe(true);
    expect(imp).toEqual(gal);
  }, ROW_TIMEOUT_MS);

  // ── R9 / R11 ──────────────────────────────────────────────────────────────────────────────────
  it('R9/R11 (the review rows): a stored revealDm or allowImport that is not a boolean raises nothing and reveals nothing; only JSON true reveals', async () => {
    const VALUES = ['"maybe"', '{}', '"yes"', '"t"', '1', '"on"', '"no"', '"off"', 'true', 'false', 'null', 'absent'];
    const doc = { name: 'T', npcs: [{ id: 'a', name: 'Ada', role: 'smith', secret: 'R9SECRET_ADA' }] };
    const out = {};
    for (const [where, { db }] of [['211', LIVE], ['210', AT210]]) {
      for (const v of VALUES) {
        for (const dm of [false, true]) {
          // revealDm through the gallery and the import, the link for raising only (an unmarked link takes the default veil)
          const ovText = v === 'absent' ? '{"a":{}}' : `{"a":{"revealDm":${v}}}`;
          const tag = `${where} revealDm ${v}${dm ? ' +dm' : ''}`;
          await putRaw(db, `r9-${Object.keys(out).length}`, { doc: JSON.stringify(doc), ov: ovText, dm });
          const reads = await fourReads(db, `r9-${Object.keys(out).length}`);
          const g = reads.gallery === 'ok' ? (await db.query(`select data from public.get_gallery_dossier('zr9-${Object.keys(out).length}')`)).rows[0].data : null;
          out[tag] = { raised: Object.values(reads).filter((x) => x !== 'ok').length, revealed: g === null ? null : has(g, 'R9SECRET_ADA') };
        }
        // allowImport on the import of a Reveal DM share
        const ovText = v === 'absent' ? '{"a":{}}' : `{"a":{"allowImport":${v}}}`;
        const key = `r9i-${Object.keys(out).length}`;
        await putRaw(db, key, { doc: JSON.stringify(doc), ov: ovText, dm: true });
        await db.exec(`set test.uid = '${READER}';`);
        let imported = null; let raised = 0;
        try { imported = has((await db.query(`select data from public.import_gallery_dossier('z${key}')`)).rows[0].data, 'R9SECRET_ADA'); } catch { raised = 1; }
        await db.exec(`set test.uid = '';`);
        out[`${where} allowImport ${v} +dm`] = { raised, revealed: imported };
      }
    }
    const want = {};
    for (const v of VALUES) {
      // only JSON true reveals; absent and null fall back to the share's Reveal DM; anything else is not a reveal
      want[`211 revealDm ${v}`] = { raised: 0, revealed: v === 'true' };
      want[`211 revealDm ${v} +dm`] = { raised: 0, revealed: v === 'true' || v === 'null' || v === 'absent' };
      want[`211 allowImport ${v} +dm`] = { raised: 0, revealed: v === 'true' || v === 'null' || v === 'absent' };
    }
    expect(Object.fromEntries(Object.entries(out).filter(([k]) => k.startsWith('211')))).toEqual(want);
    // the red control: 210 raises on "maybe" and an object, and reveals on "yes"
    expect(out['210 revealDm "maybe"'].raised).toBeGreaterThan(0);
    expect(out['210 revealDm {}'].raised).toBeGreaterThan(0);
    expect(out['210 revealDm "yes"'].revealed).toBe(true);
  }, ROW_TIMEOUT_MS);

  // ── R5 ────────────────────────────────────────────────────────────────────────────────────────
  it('R5 (a, the review rows): a page that draws the LIVE town carries no freeze date; the frozen page keeps its own', async () => {
    const at = '2026-11-01T00:00:00.000Z';
    const town = { name: 'T', institutions: [{ id: 'h', name: 'House', desc: 'LIVE_AFTER_FREEZE' }] };
    const frozen = { name: 'T', institutions: [{ id: 'h', name: 'House', desc: 'FROZEN_DESC' }] };
    const out = {};
    for (const [where, { db }] of [['211', LIVE], ['210', AT210]]) {
      // (1) the party link of a listed snapshot share (the link serves live by 208's design)
      const listed = await put(db, town, veil.writeShareVeil({}, [], { mode: 'snapshot', at, snapshot: frozen }));
      const r1 = await readBoth(db, listed);
      // (2) a share in snapshot mode whose copy is absent (the shape the writer left before R5 (b))
      const nocopy = await put(db, town, { $veil: { v: 1, deltas: [], mode: 'snapshot', at } });
      const r2 = await readBoth(db, nocopy);
      // anchored: what each page draws
      expect(has(r1.g.settlement, 'FROZEN_DESC') && has(r1.l.settlement, 'LIVE_AFTER_FREEZE'), where).toBe(true);
      expect(has(r2.g.settlement, 'LIVE_AFTER_FREEZE'), where).toBe(true);
      out[where] = { galleryWithCopy: r1.g.snapshotAt, linkOfListedSnapshot: r1.l.snapshotAt, galleryNoCopy: r2.g.snapshotAt,
        linkMode: r1.l.galleryMode, noCopyMode: r2.g.galleryMode };
    }
    expect(out['211']).toEqual({ galleryWithCopy: at, linkOfListedSnapshot: null, galleryNoCopy: null, linkMode: 'snapshot', noCopyMode: 'snapshot' });
    // and every label is the 210 page's
    expect(out['211']).toEqual(out['210']);
  }, ROW_TIMEOUT_MS);

  it('R5 (b): a copy the writer drops for size does not keep the word "snapshot": the stored mode is live', () => {
    const at = '2026-11-12T00:00:00.000Z';
    const big = { name: 'T', pad: 'x'.repeat(1_100_000) };
    const ov = veil.writeShareVeil({}, [], { mode: 'snapshot', at, snapshot: big });
    expect('snapshot' in ov.$veil).toBe(false);
    expect(ov.$veil.mode).toBe('live');
    expect(veil.readShareMode(ov).mode).toBe('live');
    // anchored: a copy within the bound keeps both
    const ok = veil.writeShareVeil({}, [], { mode: 'snapshot', at, snapshot: { name: 'T' } });
    expect(ok.$veil.mode).toBe('snapshot');
    expect(ok.$veil.snapshot).toEqual({ name: 'T' });
  });

  it('R3/R4 (the class): 400 fuzzed stored documents, copies and narrations to the edges of the range and hundreds deep, through all four reads at 211 and 210: PARITY', async () => {
    const r = rngOf(400);
    const breaches = []; const tally = { reads: 0, raised211: 0, raised210: 0, marked: 0, unmarked: 0, huge: 0, deep: 0 };
    const HUGE = /e1310|e13074/;
    // DEPTH (the review's R4): a subtree hundreds deep ending in a hook key, appended to a document (a
    // later key wins, so it is never lost to one docText drew). An id hundreds of ARRAYS deep is not
    // drawn here: it sends the reads into the sanitiser's own recursion (older than 211), which a native
    // server refuses with an error at 210 and 211 alike but which kills this in-process WASM Postgres;
    // its parity is the native probe's, and its String() is pinned directly below.
    const deepen = (text) => (r() < 0.12 ? `${text.slice(0, -1)},"deep":${deepText(r() < 0.5 ? 'obj' : 'arr', [60, 550, 900, 2000][Math.floor(r() * 4)])}}` : text);
    for (let i = 0; i < 400; i += 1) {
      const doc = deepen(docText(r)); const ov = overridesText(r);
      const narrated = r() < 0.2 ? deepen(docText(r)) : null;
      const dm = r() < 0.3;
      if (/"deep":/.test(doc + (narrated || ''))) tally.deep += 1;
      if (ov.includes('"$veil":{')) tally.marked += 1; else tally.unmarked += 1;
      if (HUGE.test(doc + ov + (narrated || ''))) tally.huge += 1;
      const p = await parity(`fz${i}`, { doc, ov, dm, narrated });
      tally.reads += 8;
      tally.raised211 += Object.values(p.now).filter((x) => x !== 'ok').length;
      tally.raised210 += Object.values(p.before).filter((x) => x !== 'ok').length;
      for (const b of p.breaches) breaches.push(`#${i} ${b} | doc ${doc.slice(0, 80)} | ov ${ov.slice(0, 120)}`);
    }
    expect(tally.reads).toBe(3200);
    // anchored: marked and unmarked listings, and rows holding a number at the range's top, are all in it
    expect(tally.marked).toBeGreaterThan(0);
    expect(tally.unmarked).toBeGreaterThan(0);
    expect(tally.huge).toBeGreaterThan(20);
    expect(tally.deep).toBeGreaterThan(20);
    expect(breaches.slice(0, 10)).toEqual([]);
  }, ROW_TIMEOUT_MS);
  // ── the review's minimal towns: every eye the panel offers ON THE CARD shut (its box and its depth
  // eyes, never a class switch, which hides by kind and would mask a wrong id) ─────────────────────
  const cardEyes = (pub) => veil.curateModelFor(pub, []).sections.flatMap((x) => x.cards.flatMap((c) => [...(c.whole ? [c.whole.address] : []), ...c.eyes.map((e) => e.address)]));
  async function shutCardEyes(db, text) {
    const pub = veil.galleryPayloadFor(JSON.parse(text), {});
    const eyes = cardEyes(pub);
    const share = await put(db, text, veil.writeShareVeil({}, eyes.map((address) => ({ address, hidden: true }))));
    return { eyes, ...(await readBoth(db, share)) };
  }

  // ── F2 ────────────────────────────────────────────────────────────────────────────────────────
  it('F2 (the review rows): a falsy label or a numeric part no longer loses the eye the DM shut', async () => {
    const ROWS = [
      ['event label null', '{"name":"T","history":{"historicalEvents":[{"label":null,"description":"EVSECRET_LABELNULL"}]}}', 'EVSECRET_LABELNULL'],
      ['event label ""', '{"name":"T","history":{"historicalEvents":[{"label":"","description":"EVSECRET_LABELEMPTY"}]}}', 'EVSECRET_LABELEMPTY'],
      ['event label 0', '{"name":"T","history":{"historicalEvents":[{"label":0,"description":"EVSECRET_LABELZERO"}]}}', 'EVSECRET_LABELZERO'],
      ['event name 1e-7', '{"name":"T","history":{"historicalEvents":[{"name":1e-7,"description":"EVSECRET_TINYNAME"}]}}', 'EVSECRET_TINYNAME'],
      ['institution id 1e-7', '{"name":"T","institutions":[{"id":1e-7,"name":"House","desc":"INSTSECRET_TINYID"}]}', 'INSTSECRET_TINYID'],
      ['institution id 9007199254740993 (a raw write)', '{"name":"T","institutions":[{"id":9007199254740993,"name":"House","desc":"INSTSECRET_BIGID"}]}', 'INSTSECRET_BIGID'],
      ['conflict parties [1e-7, "x"]', '{"name":"T","conflicts":[{"parties":[1e-7,"x"],"stakes":"CONFSECRET_STAKES","desc":"CONFSECRET_DESC"}]}', 'CONFSECRET'],
      ['npc id 1e-7', '{"name":"T","npcs":[{"id":1e-7,"name":"A","personality":{"core":"NPCSECRET_TINYID"}}]}', 'NPCSECRET_TINYID'],
    ];
    const out = [];
    for (const [tag, text, secret] of ROWS) {
      for (const [where, { db }] of [['211', LIVE], ['210', AT210]]) {
        const r = await shutCardEyes(db, text);
        // anchored: the panel offered eyes on the card, and the town itself was read
        expect(r.eyes.length, `${tag}: eyes`).toBeGreaterThan(0);
        expect(r.g.settlement.name, tag).toBe('T');
        out.push([`${where} ${tag}`, { page: has(r.g.settlement, secret) || has(r.l.settlement, secret),
          response: where === '211' ? has(r.gResp, secret) || has(r.lResp, secret) : null }]);
      }
    }
    expect(Object.fromEntries(out)).toEqual(Object.fromEntries(out.map(([k]) => [k, { page: false, response: k.startsWith('211') ? false : null }])));
  }, ROW_TIMEOUT_MS);

  it('F2 (the class): the server card id equals the client\'s idOf on 10,500 generated cards of every kind', async () => {
    const { db } = LIVE;
    const r = rngOf(211);
    const bad = []; let compared = 0; let legacy = 0;
    for (const kind of Object.keys(veil.CARD_KINDS)) {
      const texts = Array.from({ length: 1500 }, () => cardText(r));
      const rows = (await db.query(`select e::text as t, public._gallery_veil_card_id($2, e) as id
          from jsonb_array_elements($1::jsonb) with ordinality x(e, o) order by o`, [`[${texts.join(',')}]`, kind])).rows;
      expect(rows).toHaveLength(1500);
      for (const { t, id } of rows) {
        // the client computes its id on the card as the owner's own read delivers it: jsonb's text, parsed
        const card = JSON.parse(t);
        const want = veil.CARD_KINDS[kind].idOf(card);
        compared += 1;
        // an anonymous legacy event (no string id; no truthy name, title or label): the client hashes it,
        // the server reads it fail-closed (NULL)
        const anonymous = kind === 'event' && !(typeof card.id === 'string' && card.id) && !(card.name || card.title || card.label);
        if (anonymous) { legacy += 1; if (id !== null) bad.push(`${kind} ${t} -> ${id} (want legacy)`); continue; }
        if (id !== want) bad.push(`${kind} ${t.slice(0, 120)} -> ${JSON.stringify(id)}, client ${JSON.stringify(want)}`);
      }
    }
    expect(compared).toBe(10_500);
    expect(legacy).toBeGreaterThan(0);
    expect(bad.slice(0, 20)).toEqual([]);
  }, ROW_TIMEOUT_MS);

  it('F2 (the class): the server spells 20,000 JSON numbers as JavaScript\'s String() does, past double range included', async () => {
    const { db } = LIVE;
    const r = rngOf(1075);
    const toks = [...EDGE_NUMBERS, ...Array.from({ length: 20_000 - EDGE_NUMBERS.length }, () => numberToken(r))];
    const rows = (await db.query(`select e::text as t, public._gallery_veil_jsstr(e) as s
        from jsonb_array_elements($1::jsonb) with ordinality x(e, o) order by o`, [`[${toks.join(',')}]`])).rows;
    expect(rows).toHaveLength(20_000);
    const bad = rows.filter(({ t, s }) => String(JSON.parse(t)) !== s).map(({ t, s }) => `${t.slice(0, 60)} -> ${s}, JS ${String(JSON.parse(t))}`);
    expect(bad.slice(0, 20)).toEqual([]);
    // anchored: the edges JS reads as zero and as the infinities are among them
    expect(rows.filter(({ s }) => s === 'Infinity' || s === '-Infinity').length).toBeGreaterThan(0);
  }, ROW_TIMEOUT_MS);
  // ── F4 ────────────────────────────────────────────────────────────────────────────────────────
  it('F4: a member key naming no person is worked on by no read; one naming a person still hides its depth', async () => {
    const ov = { $veil: { v: 1, deltas: [] }, npc_0: { revealDm: false } };
    for (let i = 1; i <= 5000; i += 1) ov[`ghost_${i}`] = { revealDm: false, allowImport: true };
    const share = await put(LIVE.db, { name: 'T', npcs: [{ id: 'npc_0', name: 'A', personality: { core: 'F4SECRET_FACE' } }, { id: 'npc_1', name: 'B', personality: { core: 'F4OPEN_FACE' } }] }, ov);
    const r = await readBoth(LIVE.db, share);
    // anchored: the open face's depth is drawn, so the read is the town's
    expect(has(r.g.settlement, 'F4OPEN_FACE')).toBe(true);
    expect(has(r.gResp, 'F4SECRET_FACE') || has(r.lResp, 'F4SECRET_FACE')).toBe(false);
    // the served booleans are the people's: the one person with an entry, never a ghost
    expect(Object.keys(r.gResp[0].gallery_member_overrides).sort()).toEqual(['$veil', 'npc_0']);
    expect(Object.keys(r.lResp.gallery_member_overrides).sort()).toEqual(['$veil', 'npc_0']);
  }, ROW_TIMEOUT_MS);
  // ── F7 ────────────────────────────────────────────────────────────────────────────────────────
  it('F7: the map member shows its frozen copy and its narration, each under its own listing\'s veil', async () => {
    const { seed, ...cfg } = { seed: 'server-veil-village-3', settType: 'village' };
    const raw = gen({ ...BROWSER, ...cfg }, null, { seed, customContent: {} });
    const rec = { ...raw, publicProse: compose(raw) };
    const live = structuredClone(rec);
    live.institutions[0].desc = 'MAPSPOILER_AFTER_FREEZE';
    const narrated = { ...structuredClone(rec), name: 'NARRATED_NAME' };
    const cases = [
      ['snapshot, edited after freezing', live, veil.writeShareVeil({}, [], { mode: 'snapshot', at: '2026-11-12T00:00:00.000Z', snapshot: veil.galleryPayloadFor(rec, {}) }), null],
      ['narrated, live', rec, veil.writeShareVeil({}, [], { mode: 'live' }), narrated],
    ];
    for (const [tag, data, ov, narration] of cases) {
      for (const [where, { db }] of [['211', LIVE], ['210', AT210]]) {
        const share = await put(db, data, ov, { narrated: narration });
        await db.query(`insert into public.saved_maps (id, user_id, name, map_data, is_public, public_slug, share_kind, gallery_share_campaign)
          values (gen_random_uuid(), $1, 'm', $2, true, $3, 'map_with_campaign', true)`, [OWNER, JSON.stringify({ campaign: { settlementIds: [share.id] } }), `map-${share.slug}`]);
        H.db = db; H.uid = '';
        const listing = await gallery.fetchPublicDossier(share.slug);
        const map = await gallery.fetchGalleryMap(`map-${share.slug}`);
        const member = map.members.find((x) => x.settlement)?.settlement;
        if (where === '210') {
          // the red control: 210's map drew the live row and ignored the narration
          expect(member.name === listing.settlement.name && !has(member, 'MAPSPOILER_AFTER_FREEZE'), `${tag} 210`).toBe(false);
          continue;
        }
        expect(member.name, tag).toBe(listing.settlement.name);
        expect(has(member, 'MAPSPOILER_AFTER_FREEZE'), tag).toBe(false);
        expect(JSON.stringify(Object.keys(member).sort()), tag).toBe(JSON.stringify(Object.keys(listing.settlement).sort()));
      }
    }
  }, ROW_TIMEOUT_MS);
  // ── V3-1 (the THIRD review, REVIEW-VEIL-211-f07db8760) ─────────────────────────────────────────
  // The editor's working state (`decrees`, `dmLayer`) is never shared, even with Reveal DM on: the
  // client strips both in full mode (publicSafe.js :: toPublicSafe, "THE OPT-IN DOES NOT COVER THEM").
  // The server's full reveal kept them, so they reached an anonymous reader of an unmarked Reveal-DM
  // listing, an importer, and every reader once "Pending decrees" was opened. Red at f07db8760.
  const V31_DOC = {
    name: 'T',
    npcs: [{ id: 'a', name: 'Ada', role: 'smith', goal: 'V31_GOAL' }],
    decrees: [{ id: 'd1', text: 'V31_DECREE: the mayor dies next session' }],
    dmLayer: { npcs: { a: { goal: 'V31_DMLAYER' } } },
  };
  const OPENED = [{ address: 'block:housekeeping.decrees', hidden: false }];
  /** The gallery, link, import and map responses of a Reveal-DM share of `data`, with the gallery page. */
  async function v31Reads(db, data, ov, opts = {}) {
    const share = await put(db, data, ov, { dm: true, ...opts });
    await db.query(`insert into public.saved_maps (id, user_id, name, map_data, is_public, public_slug, share_kind, gallery_share_campaign)
      values (gen_random_uuid(), $1, 'm', $2, true, $3, 'map_with_campaign', true)`, [OWNER, JSON.stringify({ campaign: { settlementIds: [share.id] } }), `map-${share.slug}`]);
    const r = await readBoth(db, share);
    H.uid = READER;
    await gallery.fetchDossierForImport(share.slug);
    const iResp = H.last; H.uid = '';
    await gallery.fetchGalleryMap(`map-${share.slug}`);
    const mResp = H.last;
    // `goal` is a DM field the default veil keeps: present, it anchors that the read is the DM-full one
    return { page: r.g.settlement, gallery: r.gResp, link: r.lResp, import: iResp, map: mResp, dmFull: has(r.gResp, 'V31_GOAL') };
  }
  const editorState = (v) => has(v, 'V31_DECREE') || has(v, 'V31_DMLAYER') || /"(decrees|dmLayer)":/.test(JSON.stringify(v ?? null));

  it('V3-1 (the review row, the gallery read): an unmarked Reveal-DM listing sends no anonymous reader the editor\'s decrees or its DM layer', async () => {
    const out = {};
    for (const [where, { db }] of [['211', LIVE], ['210', AT210]]) {
      const r = await v31Reads(db, V31_DOC, {});
      expect(r.dmFull, `${where}: the Reveal-DM read`).toBe(true);
      out[where] = { gallery: editorState(r.gallery), link: editorState(r.link), map: editorState(r.map), page: editorState(r.page) };
    }
    // the red control: 210 sends both in the gallery response (its page never drew them)
    expect(out['210'].gallery).toBe(true);
    expect(out['211']).toEqual({ gallery: false, link: false, map: false, page: false });
  }, ROW_TIMEOUT_MS);

  it('V3-1 (the review row, the import): the importer of a Reveal-DM share, unmarked or marked, frozen or narrated, receives no decree and no DM layer', async () => {
    const at = '2026-11-12T00:00:00.000Z';
    const cases = [
      ['unmarked', V31_DOC, {}],
      ['marked, default veil', V31_DOC, veil.writeShareVeil({}, [])],
      ['marked, Pending decrees opened', V31_DOC, veil.writeShareVeil({}, OPENED)],
      ['frozen copy holding both, opened', { name: 'T' }, { $veil: { ...veil.writeShareVeil({}, OPENED).$veil, mode: 'snapshot', at, snapshot: V31_DOC } }],
      ['narration holding both, opened', { name: 'T' }, veil.writeShareVeil({}, OPENED), { narrated: V31_DOC }],
    ];
    const out = {};
    for (const [tag, data, ov, opts] of cases) {
      const r = await v31Reads(LIVE.db, data, ov, opts);
      expect(r.dmFull, `${tag}: the Reveal-DM read`).toBe(true);
      expect(Array.isArray(r.import) && r.import.length, `${tag}: an import row`).toBe(1);
      out[tag] = editorState(r.import);
    }
    // the red control: 210's import of the unmarked share hands both over
    expect(editorState((await v31Reads(AT210.db, V31_DOC, {})).import)).toBe(true);
    expect(out).toEqual(Object.fromEntries(cases.map(([tag]) => [tag, false])));
  }, ROW_TIMEOUT_MS);

  it('V3-1 (the review row, Pending decrees opened): opening the grouping sends no reader the editor\'s state, whatever the source', async () => {
    const at = '2026-11-12T00:00:00.000Z';
    const cases = [
      ['live', V31_DOC, veil.writeShareVeil({}, OPENED)],
      ['frozen copy', { name: 'T' }, { $veil: { ...veil.writeShareVeil({}, OPENED).$veil, mode: 'snapshot', at, snapshot: V31_DOC } }],
      ['narration', { name: 'T' }, veil.writeShareVeil({}, OPENED), { narrated: V31_DOC }],
      // and every other grouping opened with it: no other eye reaches them either
      ['every grouping opened', V31_DOC, veil.writeShareVeil({}, veil.defaultVeilFor(veil.galleryPayloadFor(V31_DOC, { shareDm: true })).map((d) => ({ address: d.address, hidden: false })))],
    ];
    const out = {};
    for (const [tag, data, ov, opts] of cases) {
      const r = await v31Reads(LIVE.db, data, ov, opts);
      expect(r.dmFull, `${tag}: the Reveal-DM read`).toBe(true);
      expect(r.gallery[0].gallery_member_overrides.$veil.v, `${tag}: a served (veiled) read`).toBe(2);
      out[tag] = { gallery: editorState(r.gallery), link: editorState(r.link), import: editorState(r.import), map: editorState(r.map), page: editorState(r.page) };
    }
    // the red control: at 210 the opened share sends both in the gallery response
    expect(editorState((await v31Reads(AT210.db, V31_DOC, veil.writeShareVeil({}, OPENED))).gallery)).toBe(true);
    expect(out).toEqual(Object.fromEntries(cases.map(([tag]) => [tag, { gallery: false, link: false, import: false, map: false, page: false }])));
  }, ROW_TIMEOUT_MS);

  // ── V3-2 (the THIRD review) ────────────────────────────────────────────────────────────────────
  // The client drops a person card with neither a name nor a role (publicSafe.js :: toPublicSafe,
  // `filter(npc => npc.name || npc.role)`); a served page is not projected again, so at f07db8760 the
  // card the face veil left nameless and roleless was drawn. Hand-edited towns only.
  it('V3-2 (the review row): a person with no name and no role (the face veil took the role) is drawn on no page and sent by no served read', async () => {
    const doc = { name: 'T',
      institutions: [{ id: 'den', name: 'The Den', category: 'criminal', desc: 'd' }],
      npcs: [
        { id: 'npc:named', name: 'Ada', role: 'smith', physical: 'V32_ANCHOR' },
        // the review's class: an empty name, a role the face veil removes (tied to a hidden house)
        { id: 'npc:211:x', name: '', role: 'fence', institution: { kind: 'house', key: 'The Den', veiled: true }, physical: 'V32_PHYS_FACE', personality: { core: 'V32_PERS_FACE' } },
        // and plainly nameless and roleless
        { id: 'npc:211:y', name: '', physical: 'V32_PHYS_BARE' },
      ] };
    const out = {};
    for (const [where, { db }] of [['211', LIVE], ['210', AT210]]) {
      for (const [tag, ov, dm] of [['default veil', veil.writeShareVeil({}, []), false], ['every eye open', veil.writeShareVeil({}, veil.defaultVeilFor(veil.galleryPayloadFor(doc, {})).map((d) => ({ address: d.address, hidden: false }))), false],
        ['Reveal DM, the person revealed', { ...veil.writeShareVeil({}, []), 'npc:211:y': { revealDm: true } }, true]]) {
        const r = await readBoth(db, await put(db, doc, ov, { dm }));
        // anchored: the named person is drawn on both pages
        expect(has(r.g.settlement, 'V32_ANCHOR') && has(r.l.settlement, 'V32_ANCHOR'), `${where} ${tag}`).toBe(true);
        // with Reveal DM on, person x is the full record (no face veil: its role stays, so it is drawn on
        // every page); the nameless and roleless card is y alone
        const tok = dm ? 'V32_PHYS_BARE' : 'V32_PHYS';
        out[`${where} ${tag}`] = { page: has(r.g.settlement, tok) || has(r.l.settlement, tok),
          response: where === '211' ? has(r.gResp, tok) || has(r.lResp, tok) : null };
      }
    }
    // the control: the 210 page never drew either card
    for (const [k, v] of Object.entries(out)) if (k.startsWith('210')) expect(v.page, k).toBe(false);
    expect(Object.fromEntries(Object.entries(out).filter(([k]) => k.startsWith('211'))))
      .toEqual(Object.fromEntries(Object.keys(out).filter((k) => k.startsWith('211')).map((k) => [k, { page: false, response: false }])));
  }, ROW_TIMEOUT_MS);

  // ── V4 (the FOURTH review, REVIEW-VEIL-211-master-client-2026-11-13) ──────────────────────────
  // Every town already saved was saved by master's client, in master's shape, and the veil reads
  // those rows as stored (211 never runs the client's v1 -> v2 migration). Master's panel addressed
  // a relationship by its `npc1Id`/`npc2Id` ends (galleryVeil.js:221 at db832c892); the new rule
  // reads `from`/`to` (141383cd4), so an eye master's DM shut on a relationship fell away. And the
  // CENSUS of every key master's veil read that the new one no longer reads: master removed an
  // npc's `factionGoal` under its `goals` eye and its `linkedFactionIds` under its `ties` eye
  // (db832c892:galleryVeil.js:155,159; master's generator writes both, npcGenerator.js:1285 and
  // factionRoles.js:262), which the people car retired from the record, so the new tables dropped
  // them: under Reveal DM (the full record, which keeps both) a shut eye left them served.
  // Red at 5a2399cf9.
  /** Master's relationship id, its own rule (db832c892:galleryVeil.js:221), for the addresses its panel wrote. */
  const masterRelId = (c) => {
    const own = typeof c.id === 'string' ? c.id : '';
    if (own) return own;
    const s = (v) => (typeof v === 'string' ? v : '');
    const parts = [c.npc1Id || c.npc1Name, c.npc2Id || c.npc2Name, c.type];
    return `relationship.${slugify(parts.map((p) => (Array.isArray(p) ? p.join('-') : s(p))).filter(Boolean).join('-'))}`;
  };
  let slugify;
  /** The ends of a tie in master's stored shape (the inverse of settlementMigrations.js's tie step). */
  const toOldShape = ({ from, to, ...rest }) => ({ ...rest, npc1Id: from, npc2Id: to });
  const V41_NEW = {
    name: 'T',
    npcs: [{ id: 'npc-1', name: 'Peiyun Huang', role: 'smith' }, { id: 'npc-3', name: 'Jiahao Luo', role: 'guard' }],
    relationships: [
      { from: 'npc-1', to: 'npc-3', type: 'rival', typeName: 'Rival', npc1Name: 'Peiyun Huang', npc2Name: 'Jiahao Luo', description: 'V41_DESC_FIELD' },
      { from: 'npc-3', to: 'npc-1', type: 'debtor', typeName: 'Debtor', npc1Name: 'Jiahao Luo', npc2Name: 'Peiyun Huang', description: 'V41_DESC_CARD', tension: 'V41_TENSION_CARD' },
      { from: 'npc-1', to: 'npc-3', type: 'ally', typeName: 'Ally', npc1Name: 'Peiyun Huang', npc2Name: 'Jiahao Luo', description: 'V41_KEEP' },
    ],
  };
  const V41_OLD = { ...V41_NEW, relationships: V41_NEW.relationships.map(toOldShape) };
  // the addresses master's panel wrote: one description eye, one whole card
  const V41_DELTAS = () => [
    { address: `field:relationship:${masterRelId(V41_OLD.relationships[0])}:description`, hidden: true },
    { address: `card:relationship:${masterRelId(V41_OLD.relationships[1])}`, hidden: true },
  ];
  const v41Secret = (v) => has(v, 'V41_DESC_FIELD') || has(v, 'V41_DESC_CARD') || has(v, 'V41_TENSION_CARD');

  it('V4-1 (the review row): a relationship eye master\'s DM shut on a town stored in master\'s shape holds in every read', async () => {
    slugify = (await import('../../src/domain/dossier/entityLinks.js')).slugifyEntity;
    expect(masterRelId(V41_OLD.relationships[0])).toBe('relationship.npc-1-npc-3-rival');
    const out = {};
    for (const [shape, doc] of [['old', V41_OLD], ['new', V41_NEW]]) {
      for (const dm of [false, true]) {
        const r = await v31Reads(LIVE.db, doc, veil.writeShareVeil({}, V41_DELTAS()), { dm });
        // anchored: the open tie's description is drawn and served, so the reads are the town's ties
        expect(has(r.page, 'V41_KEEP') && has(r.gallery, 'V41_KEEP') && has(r.import, 'V41_KEEP'), `${shape} dm=${dm}: anchor`).toBe(true);
        out[`${shape} dm=${dm}`] = { gallery: v41Secret(r.gallery), link: v41Secret(r.link), import: v41Secret(r.import), map: v41Secret(r.map), page: v41Secret(r.page) };
      }
    }
    const clean = { gallery: false, link: false, import: false, map: false, page: false };
    // the control: the same ties in the new shape (the same ends, as the migration maps them) hold already
    expect(out['new dm=false']).toEqual(clean);
    expect(out['new dm=true']).toEqual(clean);
    expect(out).toEqual(Object.fromEntries(Object.keys(out).map((k) => [k, clean])));
  }, ROW_TIMEOUT_MS);

  it('V4-1 (the client): both shapes are the same two ends — the client\'s id on a stored tie is master\'s, and its migrated twin\'s', async () => {
    slugify = (await import('../../src/domain/dossier/entityLinks.js')).slugifyEntity;
    const { migrateV1toV2 } = await import('../../src/domain/settlementMigrations.js');
    const migrated = migrateV1toV2(structuredClone(V41_OLD)).settlement.relationships;
    for (const [i, old] of V41_OLD.relationships.entries()) {
      expect(veil.CARD_KINDS.relationship.idOf(old), `tie ${i}: master's address`).toBe(masterRelId(old));
      expect(veil.CARD_KINDS.relationship.idOf(migrated[i]), `tie ${i}: the migrated twin`).toBe(masterRelId(old));
    }
    // and the client's own projection of an unmarked-era delta list over the stored town hides them
    const projected = veil.projectShareVeil(veil.galleryPayloadFor(V41_OLD, {}), veil.writeShareVeil({}, V41_DELTAS()));
    expect(has(projected, 'V41_KEEP')).toBe(true);
    expect(v41Secret(projected)).toBe(false);
  }, ROW_TIMEOUT_MS);

  it('V4-1 (the class): 3,000 fuzzed ties in master\'s shape: server id = client id = master\'s id = the migrated twin\'s id', async () => {
    slugify = (await import('../../src/domain/dossier/entityLinks.js')).slugifyEntity;
    const { migrateV1toV2 } = await import('../../src/domain/settlementMigrations.js');
    const r = rngOf(4101);
    const OLD_KEYS = ['id', 'npc1Id', 'npc2Id', 'npc1Name', 'npc2Name', 'type'];
    const texts = Array.from({ length: 3000 }, () => {
      // both ends present most of the time (what master wrote), sometimes one or neither (a hand edit)
      const keys = OLD_KEYS.filter((k) => (k === 'npc1Id' || k === 'npc2Id' ? r() < 0.9 : k === 'id' ? r() < 0.15 : r() < 0.6));
      return `{${keys.map((k) => `${JSON.stringify(k)}:${valueToken(r)}`).join(',')}}`;
    });
    const rows = (await LIVE.db.query(`select e::text as t, public._gallery_veil_card_id('relationship', e) as id
        from jsonb_array_elements($1::jsonb) with ordinality x(e, o) order by o`, [`[${texts.join(',')}]`])).rows;
    expect(rows).toHaveLength(3000);
    const bad = []; let moved = 0;
    for (const { t, id } of rows) {
      const card = JSON.parse(t);
      const master = masterRelId(card);
      const client = veil.CARD_KINDS.relationship.idOf(card);
      const twin = migrateV1toV2({ relationships: [card] }).settlement.relationships[0];
      if ('from' in twin) moved += 1;
      const twinId = veil.CARD_KINDS.relationship.idOf(twin);
      if (id !== master || client !== master || twinId !== master) bad.push(`${t.slice(0, 120)} -> server ${id}, client ${client}, twin ${twinId}, master ${master}`);
    }
    // anchored: most ties were moved by the migration, so the twin is the new shape
    expect(moved).toBeGreaterThan(2000);
    expect(bad.slice(0, 20)).toEqual([]);
  }, ROW_TIMEOUT_MS);

  // ── THE ROLLBACK ──────────────────────────────────────────────────────────────────────────────
  it('the rollback: 001..211 then supabase/rollback/211_*.down.sql equals a chain stopped at 210, byte for byte', async () => {
    const down = readdirSync(ROLLBACK).filter((f) => /^211_.*\.down\.sql$/.test(f));
    expect(down).toEqual(['211_server_side_share_veil.down.sql']);
    const rolled = await buildDb();
    expect(rolled.failed).toEqual([]);
    await rolled.db.exec(readFileSync(join(ROLLBACK, down[0]), 'utf-8'));
    const CATALOGUE = `select p.oid::regprocedure::text as sig, md5(p.prosrc) as body, p.provolatile, p.prosecdef, p.proconfig::text as config,
        p.proacl::text as acl, pg_get_userbyid(p.proowner) as owner, pg_get_function_result(p.oid) as result
      from pg_proc p join pg_namespace ns on ns.oid = p.pronamespace where ns.nspname = 'public' order by 1`;
    const at210 = (await AT210.db.query(CATALOGUE)).rows;
    const after = (await rolled.db.query(CATALOGUE)).rows;
    expect(after.filter((x) => x.sig.includes('_gallery_veil'))).toEqual([]);
    expect(after).toEqual(at210);
    // and the four reads, as text
    for (const f of ['get_gallery_dossier(text)', 'get_unlisted_dossier(text)', 'import_gallery_dossier(text)', 'get_gallery_map(text)']) {
      const def = `select pg_get_functiondef('public.${f}'::regprocedure) as d`;
      expect((await rolled.db.query(def)).rows[0].d, f).toBe((await AT210.db.query(def)).rows[0].d);
    }
  }, ROW_TIMEOUT_MS);
});
