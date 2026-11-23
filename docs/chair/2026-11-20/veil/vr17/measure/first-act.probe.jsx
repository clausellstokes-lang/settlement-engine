// @vitest-environment jsdom
// VEIL-VR17 — THE FIRST ACT, MEASURED (the brief's (a), (b), (c)). Born towns, stored on an in-process pglite chain of
// every migration on disk (001..212), read through the tree's own client (src/lib/gallery.js) as an anonymous visitor,
// drawn by the tree's own PublicDossierView and walked by tests/components/pageCensusWalk.shared.mjs :: walkDossier.
// For each family grouping shut ALONE (the other two opened by hand) and the control (all three opened):
//   SERVED   the gallery page model as fetchPublicDossier returns it;
//   CLONE    the same page model after structuredClone (every copy idiom loses an object-keyed mark alike);
//   LINK     the party link's page model;
//   MAP      the campaign map's member (get_gallery_map), drawn as CampaignWorldView draws it;
//   CIVIL    the gallery page model of the same share with one civility-flagged word in the town's own name;
//   IMPORT   the importer's saved copy (fetchDossierForImport, then the import's own normalizer), drawn as a page.
// A DERIVED LINE of grouping G = a line the SERVED page draws with G opened and not with G shut. Reported per surface:
// how many of G's derived lines it draws with G shut (0 = the signal held). Plus (b): what the served bytes say.
// Run: VR17_SRC=<tree> VR17_PROBE=first-act.probe.jsx VR17_OUT=<file> npx vitest run --config <this dir>/vitest.config.mjs
import { it, vi, expect } from 'vitest';
import { writeFileSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const SRC = process.env.VR17_SRC;
const OUT = process.env.VR17_OUT;
const SEEDS = (process.env.VR17_SEEDS || 'server-veil-town-2:town,server-veil-city-2:city,server-veil-metropolis-3:metropolis,server-veil-village-0:village').split(',').map((x) => x.split(':'));
const H = vi.hoisted(() => ({ db: null, uid: '', last: null, store: {} }));
vi.mock(`${process.env.VR17_SRC}/src/lib/supabase.js`, () => {
  const tableFns = new Set(['get_gallery_dossier', 'import_gallery_dossier']);
  const supabase = {
    auth: { getSession: async () => ({ data: { session: null } }), getUser: async () => ({ data: { user: null } }), onAuthStateChange: () => ({ data: { subscription: { unsubscribe() {} } } }) },
    rpc: async (name, args = {}) => {
      if (!['get_gallery_dossier', 'get_unlisted_dossier', 'import_gallery_dossier', 'get_gallery_map'].includes(name)) return { data: null, error: { message: `not served here: ${name}` } };
      try {
        await H.db.exec(`set test.uid = '${H.uid}';`);
        const keys = Object.keys(args);
        const call = `public.${name}(${keys.map((k, i) => `${k} => $${i + 1}`).join(', ')})`;
        const r = await H.db.query(tableFns.has(name) ? `select * from ${call}` : `select ${call} as out`, keys.map((k) => args[k]));
        H.last = tableFns.has(name) ? r.rows : r.rows[0]?.out;
        return { data: H.last, error: null };
      } catch (e) { return { data: null, error: { message: String(e.message) } }; }
    },
    from: () => ({ select: () => ({ eq: () => ({ maybeSingle: async () => ({ data: null, error: null }), single: async () => ({ data: null, error: null }) }) }) }),
  };
  return { supabase, isConfigured: true, default: supabase };
});
vi.mock(`${process.env.VR17_SRC}/src/store/index.js`, () => { const useStore = (sel) => sel(H.store); useStore.subscribe = () => () => {}; useStore.getState = () => H.store; useStore.setState = () => {}; return { useStore, default: useStore }; });
vi.mock(`${process.env.VR17_SRC}/src/generators/aiLayer`, () => ({ runTemplateNarrative: vi.fn() }));
vi.mock(`${process.env.VR17_SRC}/src/lib/analytics.js`, () => ({ track: vi.fn(), Funnel: { track: vi.fn() }, EVENTS: new Proxy({}, { get: (_t, k) => String(k) }) }));

const OWNER = '11111111-1111-1111-1111-111111111111';
const READER = '22222222-2222-2222-2222-222222222222';
const BROWSER = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
const FAMILY = ['block:services.criminal', 'block:defense.criminalStructure', 'block:power.criminalUnderside'];

async function buildDb() {
  const { PGlite } = await import(`${SRC}/node_modules/@electric-sql/pglite/dist/index.js`);
  const { pgcrypto } = await import(`${SRC}/node_modules/@electric-sql/pglite/dist/contrib/pgcrypto.js`);
  const db = new PGlite({ extensions: { pgcrypto } });
  await db.exec(`
    create schema if not exists auth;
    create or replace function auth.uid() returns uuid language sql stable as $fn$ select nullif(current_setting('test.uid', true), '')::uuid $fn$;
    create or replace function auth.role() returns text language sql stable as $fn$ select coalesce(nullif(current_setting('test.role', true), ''), 'anon') $fn$;
    create or replace function auth.jwt() returns jsonb language sql stable as $fn$ select '{}'::jsonb $fn$;
    create table if not exists auth.users (id uuid primary key, email text, raw_user_meta_data jsonb default '{}', raw_app_meta_data jsonb default '{}', created_at timestamptz default now(), last_sign_in_at timestamptz, email_confirmed_at timestamptz, phone text, deleted_at timestamptz, is_anonymous boolean default false);
    do $do$ begin
      if not exists (select from pg_roles where rolname = 'authenticated') then create role authenticated; end if;
      if not exists (select from pg_roles where rolname = 'anon') then create role anon; end if;
      if not exists (select from pg_roles where rolname = 'service_role') then create role service_role; end if;
    end $do$;
    create schema if not exists extensions; create schema if not exists cron;
    create table if not exists cron.job (jobid bigserial primary key, jobname text, schedule text, command text);
    create or replace function cron.schedule(n text, s text, c text) returns bigint language sql as $fn$ insert into cron.job (jobname, schedule, command) values (n, s, c) returning jobid $fn$;
    create or replace function cron.unschedule(n text) returns boolean language sql as $fn$ select true $fn$;
    create or replace function cron.unschedule(n bigint) returns boolean language sql as $fn$ select true $fn$;
    create schema if not exists storage;
    create table if not exists storage.buckets (id text primary key, name text, public boolean, owner uuid, file_size_limit bigint, allowed_mime_types text[], created_at timestamptz default now(), updated_at timestamptz default now());
    create table if not exists storage.objects (id uuid primary key default gen_random_uuid(), bucket_id text, name text, owner uuid, metadata jsonb, created_at timestamptz default now(), updated_at timestamptz default now());
    create or replace function storage.foldername(name text) returns text[] language sql immutable as $fn$ select string_to_array(name, '/') $fn$;
    create extension if not exists pgcrypto;`);
  const dir = join(SRC, 'supabase', 'migrations');
  const files = readdirSync(dir).filter((f) => /^\d{3}_.*\.sql$/.test(f)).sort();
  const failed = [];
  for (const f of files) {
    const sql = readFileSync(join(dir, f), 'utf-8').replace(/create extension if not exists (pg_cron|pg_net)( with schema extensions)?/gi, 'select 1');
    try { await db.exec(sql); } catch (e) { failed.push(`${f}: ${String(e?.message || e).slice(0, 120)}`); }
  }
  await db.exec(`insert into auth.users (id) values ('${OWNER}'), ('${READER}') on conflict do nothing;
    insert into public.profiles (id) values ('${OWNER}'), ('${READER}') on conflict do nothing;
    update public.profiles set role = 'developer' where id = '${OWNER}';
    create or replace function public.current_user_has_premium_access() returns boolean language sql stable as $f$ select true $f$;`);
  return { db, files, failed };
}

it('VR17 first act', async () => {
  const lines = [];
  const say = (s) => { lines.push(s); writeFileSync(OUT, lines.join('\n') + '\n'); };
  const { db, files, failed } = await buildDb();
  H.db = db;
  say(`chain: ${files.length} files, last ${files.at(-1)}, failed ${failed.length}${failed.length ? ` ${failed.join(' | ')}` : ''}`);
  const React = (await import(`${SRC}/node_modules/react/index.js`)).default;
  const { render, fireEvent, waitFor, cleanup } = await import(`${SRC}/node_modules/@testing-library/react/dist/index.js`);
  const { walkDossier, storeFor } = await import(`${SRC}/tests/components/pageCensusWalk.shared.mjs`);
  const { generateSettlementPipeline: gen } = await import(`${SRC}/src/generators/generateSettlementPipeline.js`);
  const { composePublicProse: compose } = await import(`${SRC}/src/components/new/publicProseCompose.js`);
  const { normalizeSettlement } = await import(`${SRC}/src/domain/normalizeSettlement.js`);
  const veil = await import(`${SRC}/src/domain/display/galleryVeil.js`);
  const { presentCriminalGroupings } = await import(`${SRC}/src/domain/display/criminalVeilSwitch.js`);
  const gallery = await import(`${SRC}/src/lib/gallery.js`);
  const PublicDossierView = (await import(`${SRC}/src/components/PublicDossierView.jsx`)).default;
  window.matchMedia = Object.assign(vi.fn((q) => ({ media: q, matches: false, addEventListener() {}, removeEventListener() {}, addListener() {}, removeListener() {} })), { SF_CONTROLLED: true });

  const draw = async (dossier) => {
    H.store = storeFor(dossier.settlement, vi.fn);
    const { container } = render(React.createElement(PublicDossierView, { dossier, showHeader: false }));
    let views = {};
    try { views = await walkDossier(container, { fireEvent, waitFor, expect }); } finally { cleanup(); }
    const out = new Set();
    for (const [view, ls] of Object.entries(views)) for (const l of ls) out.add(`${view} :: ${l}`);
    return out;
  };

  for (const [n, [seed, settType]] of SEEDS.entries()) {
    const raw = gen({ ...BROWSER, settType }, null, { seed, customContent: {} });
    const record = JSON.parse(JSON.stringify({ ...raw, publicProse: compose(raw) }));
    const pub = veil.galleryPayloadFor(record, {});
    const present = [...presentCriminalGroupings(pub)];
    const id = `aaaaaaaa-0000-0000-0000-${String(n + 1).padStart(12, '0')}`;
    const cid = `aaaaaaaa-0000-0000-0001-${String(n + 1).padStart(12, '0')}`;
    const civilRecord = { ...record, name: `${record.name} shit` };
    await db.exec(`set test.uid = '';`); H.uid = '';
    await db.query(`insert into public.settlements (id, user_id, name, tier, data, is_public, public_slug, published_at, unlisted_slug, visibility, gallery_importable)
      values ($1, $2, $3, $4, $5, true, $6, now(), $7, 'unlisted', true), ($8, $2, $3, $4, $9, true, $10, now(), $11, 'unlisted', true)`,
    [id, OWNER, record.name || seed, settType, JSON.stringify(record), `pub-${n}`, `lnk-${n}`, cid, JSON.stringify(civilRecord), `civ-${n}`, `civl-${n}`]);
    await db.query(`insert into public.saved_maps (id, user_id, name, map_data, is_public, public_slug, share_kind, gallery_share_campaign)
      values ($1, $2, 'map', $3, true, $4, 'map_with_campaign', true)`, [`cccccccc-0000-0000-0000-${String(n + 1).padStart(12, '0')}`, OWNER, JSON.stringify({ campaign: { settlementIds: [id] } }), `map-${n}`]);
    say(`\n## ${seed} (${settType}) "${record.name}": family groupings that remove something here: ${present.join(', ') || 'none'}`);
    const cases = [['ALL OPEN', []], ...FAMILY.map((g) => [`SHUT ${g}`, [g]])];
    const pages = {};
    for (const [label, shut] of cases) {
      const ov = veil.writeShareVeil({}, FAMILY.map((g) => ({ address: g, hidden: shut.includes(g) })), { mode: 'live', at: '2026-11-20T00:00:00.000Z' });
      await db.query('update public.settlements set gallery_member_overrides = $2 where id in ($1, $3)', [id, JSON.stringify(ov), cid]);
      H.uid = '';
      const g = await gallery.fetchPublicDossier(`pub-${n}`);
      const marker = H.last?.[0]?.gallery_member_overrides?.$veil;
      const l = await gallery.fetchPublicDossier(`lnk-${n}`);
      const c = await gallery.fetchPublicDossier(`civ-${n}`);
      const map = await gallery.fetchGalleryMap(`map-${n}`);
      const member = (map?.members || []).find((m) => m.settlement);
      H.uid = READER;
      const imp = await gallery.fetchDossierForImport(`pub-${n}`);
      H.uid = '';
      const saved = imp ? normalizeSettlement({ ...imp.settlement }) : null;
      say(`${label}: (b) served marker $veil = ${JSON.stringify(marker)}; WeakMap on gallery page: [${veil.veilGroupingsOf(g.settlement)}], link: [${veil.veilGroupingsOf(l.settlement)}], civil: [${veil.veilGroupingsOf(c.settlement)}], map member: [${member ? veil.veilGroupingsOf(member.settlement) : 'no member'}], import: [${imp ? veil.veilGroupingsOf(imp.settlement) : 'none'}]`);
      pages[label] = {
        SERVED: await draw(g),
        CLONE: await draw({ ...g, settlement: structuredClone(g.settlement) }),
        LINK: await draw({ ...l, shareDm: false }),
        CIVIL: await draw(c),
        MAP: member ? await draw({ settlement: member.settlement, name: member.name, tier: member.tier, chronicle: member.chronicle, shareDm: false }) : new Set(),
        IMPORT: saved ? await draw({ settlement: saved, name: imp.name, tier: imp.tier, shareDm: false }) : new Set(),
      };
    }
    const open = pages['ALL OPEN'].SERVED;
    for (const g of FAMILY) {
      const P = pages[`SHUT ${g}`];
      const derived = [...open].filter((x) => !P.SERVED.has(x));
      const civ = (s) => s.replace(/ sh\*t| s\*\*t| \S*\*\S*/g, '');
      say(`  ${g}: ${derived.length} line(s) the served page draws with it open and not shut`);
      for (const x of derived.slice(0, 6)) say(`      | ${x.slice(0, 200)}`);
      for (const surface of ['CLONE', 'LINK', 'CIVIL', 'MAP', 'IMPORT']) {
        const set = surface === 'CIVIL' ? new Set([...P.CIVIL].map(civ)) : P[surface];
        const hits = derived.filter((x) => set.has(surface === 'CIVIL' ? civ(x) : x));
        say(`    ${surface.padEnd(6)} with it shut draws ${hits.length} of them${hits.length ? `: e.g. ${hits[0].slice(0, 160)}` : ''}`);
      }
    }
  }
}, 14_400_000);
