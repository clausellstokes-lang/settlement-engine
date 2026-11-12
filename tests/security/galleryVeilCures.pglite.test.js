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
  // A seeded generator (no clock, no Math.random): the class tests are the same on every run.
  function rngOf(seed) { let s = seed >>> 0; return () => { s = (Math.imul(s, 1664525) + 1013904223) >>> 0; return s / 2 ** 32; }; }
  const EDGE_NUMBERS = ['0', '-0', '1', '-1', '0.5', '1e-7', '-1e-7', '1e-6', '1e21', '1e+21', '1e20', '123456789012345678901', '9007199254740992',
    '9007199254740993', '-9007199254740993', '12345678901234567890123', '31621967360964610', '1e400', '-1e400', '1e-400', '-1e-400', '5e-324',
    '2.4703282292062327e-324', '2.4703282292062328e-324', '1.7976931348623157e308', '1.7976931348623158e308', '1.7976931348623159e308',
    '0.1', '100.0', '1E5', '1.5e300', '-2.5e-10', '4.35e-6', '0.000001', '0.0000001', '999999999999999999999.5', '1e-323', '1.0000000000000002'];
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
  const ID_KEYS = ['id', 'refId', 'name', 'label', 'title', 'type', 'faction', 'parties', 'issue', 'from', 'to', 'npc1Name', 'npc2Name'];
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

  it('F3 (the class): 400 fuzzed stored documents and veils through all four reads, and no read raises', async () => {
    const { db } = LIVE;
    const r = rngOf(400);
    const raised = []; let reads = 0;
    for (let i = 0; i < 400; i += 1) {
      const doc = docText(r); const ov = overridesText(r);
      const narrated = r() < 0.2 ? docText(r) : null;
      n += 1;
      const id = `ffffffff-0000-0000-0000-${String(n).padStart(12, '0')}`;
      await db.query(`insert into public.settlements (id, user_id, name, tier, data, is_public, public_slug, published_at, unlisted_slug, visibility,
          gallery_member_overrides, gallery_share_dm, gallery_importable, gallery_share_narrated, ai_data)
        values ($1, $2, 'T', 'town', $3, true, $4, now(), $5, 'unlisted', $6, $7, true, $8, $9)`,
      [id, OWNER, doc, `fz${i}`, `fl${i}`, ov, r() < 0.3, narrated !== null, narrated === null ? null : `{"aiSettlement":${narrated}}`]);
      await db.query(`insert into public.saved_maps (id, user_id, name, map_data, is_public, public_slug, share_kind, gallery_share_campaign)
        values (gen_random_uuid(), $1, 'm', $2, true, $3, 'map_with_campaign', true)`, [OWNER, JSON.stringify({ campaign: { settlementIds: [id] } }), `fm${i}`]);
      for (const [read, uid, q] of [['gallery', '', `select data from public.get_gallery_dossier('fz${i}')`], ['link', '', `select public.get_unlisted_dossier('fl${i}')`],
        ['import', READER, `select data from public.import_gallery_dossier('fz${i}')`], ['map', '', `select public.get_gallery_map('fm${i}')`]]) {
        await db.exec(`set test.uid = '${uid}';`);
        reads += 1;
        try { await db.query(q); } catch (e) { raised.push(`${read} #${i}: ${String(e.message).slice(0, 100)} | doc ${doc.slice(0, 80)} | ov ${ov.slice(0, 120)}`); }
      }
    }
    expect(reads).toBe(1600);
    expect(raised.slice(0, 10)).toEqual([]);
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
});
