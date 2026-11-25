/**
 * galleryServerVeil.pglite.test.js — THE PAGE'S VEIL IS APPLIED BEFORE THE RESPONSE LEAVES
 * (COHERENCE-VEIL, migration 211; the chair's rulings of 2026-11-12).
 *
 * THE FAULT IT PINS. Before 211 the veil a DM sets by hand (gallery_member_overrides.$veil,
 * src/domain/display/galleryVeil.js) was applied only in the reader's browser: the gallery read
 * and the party link SENT everything the page hides; the gallery read sent a frozen copy
 * verbatim, never sanitised; the map page and import applied no veil at all.
 *
 * HOW, BY EXECUTION ONLY (no rule is re-implemented here). Two in-process Postgres databases:
 *   LIVE — every migration on disk, in order (the chain this tip ships);
 *   AT210 — the chain through 210 (the red control and the page before 211).
 * Towns come from the generator with a browser's random dials (§0.4 of the charter); each is
 * veiled BY HAND through the share panel's own model and writer (curateModelFor ->
 * writeShareVeil; the frozen copy by galleryPayloadFor). Each read is called as its reader, and
 * each PAGE is built by the REAL client read (src/lib/gallery.js) over a fake supabase whose rpc
 * runs the real SQL. CARRIED = a path in the response the page lacks; READABLE = a string of six
 * or more characters in the response that the page's text nowhere holds.
 *
 * WHAT MUST HOLD at LIVE, on every row:
 *   (1) nothing carried, nothing readable — gallery `data`, party-link `dossier`, the map member,
 *       the import — and gallery_member_overrides holds only members' booleans and the served
 *       marker {v: 2, mode, at, groupings} (no delta, no frozen copy);
 *   (2) no page changes: the LIVE page deep-equals the AT210 page of the same share read live
 *       (a frozen copy, old or new, is served as its live page; the import equals the listing's
 *       page; the map member equals, by value, the party link's page of the same row and marker:
 *       N84 (a), 212's header item (36));
 *   (3) THE RED CONTROL: AT210 carries readable strings on the same rows (the measure of the
 *       phase-1 proposal), so (1) is not vacuous.
 *   (4) NO PAGE CARRIES A ROLE ITS CARD WITHHOLDS: no tie on any page (the 210 page included: the current client
 *       over the deployed server's response) copies the role of a person whose own card on that page shows none.
 * (2) RE-KEYED BY IDENTITY, never loosened (the chair's ruling on VEIL-14's item 0, 2026-11-14): no page changes,
 * for every key EXCEPT a tie's copy of an end's role (relationships[].npc1Role, .npc2Role) of a person whose own
 * card on the 210 page shows no role: there the page WITHHOLDS. The 210 page is compared with exactly those copies
 * removed where the page now lacks them, and with nothing else removed (212's N3, 81350423d; its twin, VEIL-14).
 * And the edges: the `$veil` shapes never raise or leak (the VEIL-FIX review's low finding 2);
 * the sanitiser runs once per link read, counted with an IMMUTABLE stand-in (low finding 1);
 * an anonymous legacy event is veiled fail-closed; the helpers' twins agree with the client's
 * on slugs and the house class; no client path writes a served v2 marker back into a row (the
 * chair's ruling 4); no migration from 211 on holds a raw invisible character (low finding 4).
 *
 * The full 360-town run is the phase-2 hand-back's, once; this routine pin runs eight towns,
 * two of each size, chosen so every kind of hidden thing is present.
 */
import { describe, it, expect, beforeAll, vi } from 'vitest';
import { PGlite } from '@electric-sql/pglite';
import { pgcrypto } from '@electric-sql/pglite/contrib/pgcrypto';
import { appendFileSync, readFileSync, readdirSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { bijectionTeeth, canonPeople, notBijective, readsDiffer, unkeyPeople } from './personIdBijection.shared.mjs';
import { buildNameSearch } from '../../src/domain/display/gallerySecondHomes.js';

const PGLITE_BOOT_TIMEOUT_MS = 900_000; // deadlock guard, not a perf budget — never tune to a measured boot (see pgliteHookTimeoutRatchet.test.js)
const TOWN_TIMEOUT_MS = 900_000;

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
      } catch (e) { return { data: null, error: { message: String(e.message) } }; }
    },
    from: (table) => ({
      update: (patch) => ({
        eq: async (col, val) => {
          const cols = Object.keys(patch);
          await H.db.query(`update public.${table} set ${cols.map((c, i) => `${c} = $${i + 2}`).join(', ')} where ${col} = $1`,
            [val, ...cols.map((c) => (patch[c] !== null && typeof patch[c] === 'object' ? JSON.stringify(patch[c]) : patch[c]))]);
          return { error: null };
        },
      }),
    }),
  };
  return { supabase, isConfigured: true, default: supabase };
});

const MIGRATIONS = resolve(process.cwd(), 'supabase', 'migrations');
const OWNER = '11111111-1111-1111-1111-111111111111';
const READER = '22222222-2222-2222-2222-222222222222';
const BROWSER = Object.freeze({ tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat',
  nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' });
// Two of each size; between them a criminal house, a veiled face, a criminal power, a HIDDEN power (the
// infiltrated city: a DM picks that stress in the wizard), defence vulnerabilities and every card kind.
const TOWNS = Object.freeze([
  { seed: 'server-veil-village-3', settType: 'village' },
  { seed: 'server-veil-village-0', settType: 'village' },
  { seed: 'server-veil-town-2', settType: 'town' },
  { seed: 'server-veil-town-0', settType: 'town' },
  { seed: 'server-veil-city-2', settType: 'city' },
  { seed: 'server-veil-city-infiltrated-0', settType: 'city', crisis: 'infiltrated', selectedStresses: ['infiltrated'], selectedStressesRandom: false },
  { seed: 'server-veil-metropolis-3', settType: 'metropolis' },
  { seed: 'server-veil-metropolis-7', settType: 'metropolis' },
]);

async function buildDb(through = 999) {
  const db = new PGlite({ extensions: { pgcrypto } });
  await db.exec(`
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
    create extension if not exists pgcrypto;
  `);
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

// ── trees ─────────────────────────────────────────────────────────────────────────────────
const isRec = (v) => !!v && typeof v === 'object' && !Array.isArray(v);
function keyOf(el, i) {
  if (isRec(el)) for (const k of ['id', 'key', 'faction', 'name', 'title', 'address']) if (typeof el[k] === 'string' && el[k]) return `${k}=${el[k]}`;
  return `#${i}`;
}
function flat(v, p = '', out = new Map()) {
  if (Array.isArray(v)) { if (!v.length) out.set(`${p}[]`, '[]'); v.forEach((e, i) => flat(e, `${p}[${keyOf(e, i)}]`, out)); }
  else if (isRec(v)) { const ks = Object.keys(v); if (!ks.length) out.set(`${p}{}`, '{}'); for (const k of ks) flat(v[k], p ? `${p}.${k}` : k, out); }
  else out.set(p, v);
  return out;
}
/** A page as a reader's browser holds it after the wire: undefined keys gone, keys in one order (the
 *  210 client rebuilt a card in its allowlist's order and left `title: undefined` on a veiled face). */
function canon(v) {
  if (Array.isArray(v)) return v.map(canon);
  if (!isRec(v)) return v;
  return Object.fromEntries(Object.keys(v).sort().filter((k) => v[k] !== undefined).map((k) => [k, canon(v[k])]));
}
const TEETH_FILE = 'galleryServerVeil';
// VR46 (R4I-PAGE-4, VEIL-38 G3): every non-owner read re-keys every person id under a salt of its own (VR10), so a guard that
// found a person, a tie or a marker key by its STORED id reads the served document MODULO THE READ'S PERSON-ID BIJECTION AND
// NOTHING ELSE: `unkeyPeople` against the stored record (it throws on a stored id served, tooth (ii), and on two cards under
// one id, tooth (iv)), each unkeyed card then checked against the stored card of that id by its name, so a canonical order
// the veil shifted can never pass as a person. `teethOn` executes VR46's five teeth on the guard's own equality and keeps
// what each did (bit, missed, could not be built) in the file VR46_TEETH names, where it is set.
function unkeyNamed(d, stored, out, tag) {
  const u = unkeyPeople(d, stored);
  const names = new Map((Array.isArray(stored?.npcs) ? stored.npcs : []).filter(isRec).map((n) => [n.id, n.name]));
  for (const n of (Array.isArray(u?.npcs) ? u.npcs : []).filter(isRec)) {
    if (names.has(n.id) && typeof n.name === 'string' && typeof names.get(n.id) === 'string' && n.name !== names.get(n.id)) out.push(`${tag}: VR46: the bijection reads ${n.name} as ${names.get(n.id)}`);
  }
  return u;
}
function teethOn(served, holds, opt, need, out, tag) {
  const { missed, absent } = bijectionTeeth(served, holds, opt);
  for (const m of missed) if (need.some((re) => re.test(m))) out.push(`${tag}: VR46 tooth did not bite: ${m}`);
  if (process.env.VR46_TEETH) appendFileSync(process.env.VR46_TEETH, `${JSON.stringify({ file: TEETH_FILE, tag, missed, absent })}\n`);
  return { missed, absent };
}
/**
 * VR46 (R4I-PAGE-4, VEIL-38 G3): every non-owner read re-keys every person and tie id under a salt of its own (VR10): the
 * server's response under 212's, the page under the client's own (`projectServedVeil` projects the served document again),
 * the import and the map member each under theirs, and the 210 page under the current client's. So laws (1) and (2) compare
 * them MODULO EACH READ'S PERSON-ID BIJECTION AND NOTHING ELSE: `people` maps each document's person and tie ids to their
 * canonical names (`canonPeople`), every other byte as before; `freshFaults` holds the teeth a single read carries: (ii) every
 * served person or tie id is one the re-key made, (iv) no two cards under one id.
 */
const FRESH_ID = /^(npc|tie)_[0-9a-f]{16}$/;
const people = (v) => (isRec(v) ? canonPeople(v).doc : v);
function freshFaults(doc) {
  if (!isRec(doc)) return [];
  const out = [];
  for (const v of canonPeople(doc).names.keys()) if (!FRESH_ID.test(String(v))) out.push(`VR46 (ii): a person id the re-key did not make: ${String(v).slice(0, 60)}`);
  out.push(...notBijective(doc).map((x) => `VR46 (iv): ${x}`));
  return out;
}
/** A read (readAll) with its four documents read by `people`; `raw` keeps the read as served. */
function canonRead(r) {
  return { ...r, raw: r, gPage: people(r.gPage), lPage: people(r.lPage), gRow: r.gRow && { ...r.gRow, data: people(r.gRow.data) },
    lResp: r.lResp && { ...r.lResp, dossier: people(r.lResp.dossier) } };
}
/** What the response carries that the page lacks: paths, and strings nowhere in the page's text. */
function carried(resp, page) {
  page = canon(page);
  const R = flat(resp); const P = flat(page); const text = JSON.stringify(page);
  const paths = []; const readable = [];
  for (const [p, v] of R) {
    if (P.has(p)) continue;
    paths.push(p);
    if (typeof v === 'string' && v.trim().length >= 6 && !text.includes(JSON.stringify(v).slice(1, -1))) readable.push(`${p} = ${v.slice(0, 80)}`);
  }
  return { paths, readable };
}
/** A tie's copy of an end's role (`npc1Role` for `from`, `npc2Role` for `to`; master's `npc1Id`, `npc2Id`) where that
 *  person's own card on the same page shows no role: the role the card withholds, told by the tie (law 4). */
function rolesItsCardWithholds(page) {
  const out = [];
  if (!isRec(page) || !Array.isArray(page.relationships)) return out;
  const cards = new Map((Array.isArray(page.npcs) ? page.npcs : []).filter((c) => isRec(c) && typeof c.id === 'string').map((c) => [c.id, c]));
  page.relationships.forEach((t, i) => {
    if (!isRec(t)) return;
    for (const [key, end] of [['npc1Role', t.from ?? t.npc1Id], ['npc2Role', t.to ?? t.npc2Id]]) {
      const card = cards.get(String(end));
      if (typeof t[key] === 'string' && !(isRec(card) && typeof card.role === 'string')) out.push(`relationships[${keyOf(t, i)}].${key} = ${t[key].slice(0, 60)}`);
    }
  });
  return out;
}
/** Law (2)'s reference, re-keyed by identity: the 210 page with exactly the copies law (4) names on it removed where
 *  the page after 211 and 212 lacks them (the page WITHHOLDS there), and nothing else; `n` counts them. */
function withheldFrom(ref, now) {
  const page = structuredClone(ref); let n = 0;
  if (!isRec(page) || !Array.isArray(page.relationships) || !isRec(now) || !Array.isArray(now.relationships)) return { page, n };
  const told = new Set(rolesItsCardWithholds(ref).map((x) => x.slice(0, x.indexOf(' = '))));
  const nowTies = new Map(now.relationships.map((t, i) => [keyOf(t, i), t]));
  page.relationships.forEach((t, i) => {
    if (!isRec(t)) return;
    const k = keyOf(t, i); const mine = nowTies.get(k);
    for (const key of ['npc1Role', 'npc2Role']) if (told.has(`relationships[${k}].${key}`) && isRec(mine) && !(key in mine)) { delete t[key]; n += 1; }
  });
  return { page, n };
}
/** R3-CURE-2 (VEIL-24's builder; the chair's ruling 3 of 09:04 UTC): A GOAL THAT NAMES A WITHHELD POWER LEAVES WITH IT, UNDER
 *  REVEAL DM TOO (the ruling "leaves whole" reaches every string: R3-CURE's goal rule, 212 :: _gallery_veil_roster_choices).
 *  Law (2)'s reference with exactly those goals removed: a person's goal whose intent targets, or whose sentence names (the
 *  lane's own fold, gallerySecondHomes.js :: buildNameSearch), a power of the stored record that the page after 212 does
 *  not serve. `n` counts them; `shown` counts the goals left aimed at a SHOWN power (the re-statement's tooth: each is
 *  still compared byte for byte by law (2)). */
function goalsLeaveWithTheirPower(record, page, now) {
  const powers = (d) => [...(Array.isArray(d?.powerStructure?.factions) ? d.powerStructure.factions : []), ...(Array.isArray(d?.factions) ? d.factions : [])].filter(isRec);
  const served = new Set(powers(now).flatMap((f) => [f.faction, f.name, f.id].filter((v) => typeof v === 'string' && v)));
  const gone = powers(record).filter((f) => ![f.faction, f.name].some((x) => typeof x === 'string' && served.has(x)));
  const ids = new Set(gone.map((f) => (typeof f.id === 'number' ? String(f.id) : f.id)).filter((v) => typeof v === 'string' && v));
  const search = buildNameSearch(gone.flatMap((f) => [f.faction, f.name]).filter((v) => typeof v === 'string' && v), [...served]);
  const named = (v) => (typeof v === 'number' && ids.has(String(v))) || (typeof v === 'string' && v !== '' && (ids.has(v) || (!!search && search.hit(v))));
  const out = structuredClone(page); let n = 0; let shown = 0;
  for (const p of isRec(out) && Array.isArray(out.npcs) ? out.npcs : []) {
    if (!isRec(p) || !isRec(p.goal)) continue;
    const g = p.goal; const it = isRec(g.intent) ? g.intent : {};
    const tids = [it.short?.target?.id, it.long?.target?.id];
    if (tids.some(named) || (!!search && (search.hit(String(g.short ?? '')) || search.hit(String(g.long ?? ''))))) { delete p.goal; n += 1; }
    else if (tids.some((v) => typeof v === 'string' && served.has(v))) shown += 1;
  }
  return { page: out, n, shown };
}
/** R3-CURE-3 (VEIL-24's builder; the chair's ruling A of 10:21 UTC): THE LEAK CHECK the re-statement's tooth rests on. Every person of
 *  the stored record whose goal targets, or whose sentence names (the lane's search), a power the page does not serve: `aimed` counts
 *  them; `served` lists those whose goal the page still carries (a leak). Measured (out/v24/r3c3/unit1-goals.txt): at R3-CURE-2 the
 *  two towns' Reveal-DM goals of npc_mages_guild and npc_smelter are aimed at the withheld Thieves' Guild by their target id and leave
 *  on BOTH pages (the 210 page too: the current client read withholds them over 210's response), so goalsLeaveWithTheirPower
 *  removes nothing there; the checks below prove they leave, and that the goals aimed at a SHOWN power stay byte for byte. */
function goalsAimedAtWithheld(record, now) {
  const powers = (d) => [...(Array.isArray(d?.powerStructure?.factions) ? d.powerStructure.factions : []), ...(Array.isArray(d?.factions) ? d.factions : [])].filter(isRec);
  const served = new Set(powers(now).flatMap((f) => [f.faction, f.name, f.id].filter((v) => typeof v === 'string' && v)));
  const gone = powers(record).filter((f) => ![f.faction, f.name].some((x) => typeof x === 'string' && served.has(x)));
  const ids = new Set(gone.map((f) => (typeof f.id === 'number' ? String(f.id) : f.id)).filter((v) => typeof v === 'string' && v));
  const search = buildNameSearch(gone.flatMap((f) => [f.faction, f.name]).filter((v) => typeof v === 'string' && v), [...served]);
  const named = (v) => (typeof v === 'number' && ids.has(String(v))) || (typeof v === 'string' && v !== '' && (ids.has(v) || (!!search && search.hit(v))));
  const onPage = new Map((isRec(now) && Array.isArray(now.npcs) ? now.npcs : []).filter((p) => isRec(p) && typeof p.id === 'string').map((p) => [p.id, p]));
  let aimed = 0; const leaks = [];
  for (const p of Array.isArray(record?.npcs) ? record.npcs : []) {
    if (!isRec(p) || !isRec(p.goal)) continue;
    const g = p.goal; const it = isRec(g.intent) ? g.intent : {};
    if (![it.short?.target?.id, it.long?.target?.id].some(named) && !(!!search && (search.hit(String(g.short ?? '')) || search.hit(String(g.long ?? ''))))) continue;
    aimed += 1;
    if (isRec(onPage.get(p.id)) && 'goal' in onPage.get(p.id)) leaks.push(`npcs[id=${p.id}].goal = ${JSON.stringify(onPage.get(p.id).goal).slice(0, 80)}`);
  }
  return { aimed, leaks };
}
const SERVED_KEYS = new Set(['v', 'mode', 'at', 'groupings']);
/** The overrides a read sends: each member's two booleans and, at most, the served marker. */
function overridesOffences(ov) {
  const out = [];
  if (!isRec(ov)) return ov == null ? [] : ['not an object'];
  for (const [k, v] of Object.entries(ov)) {
    if (k === '$veil') {
      if (!isRec(v) || v.v !== 2) out.push(`$veil is not the served marker: ${JSON.stringify(v).slice(0, 80)}`);
      else for (const kk of Object.keys(v)) if (!SERVED_KEYS.has(kk)) out.push(`$veil.${kk}`);
      continue;
    }
    if (!isRec(v)) { out.push(`member ${k} not an object`); continue; }
    for (const kk of Object.keys(v)) if (!['revealDm', 'allowImport'].includes(kk) || typeof v[kk] !== 'boolean') out.push(`member ${k}.${kk}`);
  }
  return out;
}

describe('the server-side share veil (211) — execution against the real SQL and the real client read', () => {
  /** @type {any} */ let LIVE; /** @type {any} */ let AT210;
  /** @type {any} */ let gen; /** @type {any} */ let veil; /** @type {any} */ let gallery; /** @type {any} */ let compose;
  const control = { readable: 0, rows: 0, withheld: 0, goals: 0, shownGoals: 0, aimedAtWithheld: 0 };

  beforeAll(async () => {
    LIVE = await buildDb();
    AT210 = await buildDb(210);
    ({ generateSettlementPipeline: gen } = await import('../../src/generators/generateSettlementPipeline.js'));
    ({ composePublicProse: compose } = await import('../../src/components/new/publicProseCompose.js'));
    veil = await import('../../src/domain/display/galleryVeil.js');
    gallery = await import('../../src/lib/gallery.js');
  }, PGLITE_BOOT_TIMEOUT_MS);

  it('both chains apply whole: every file on disk, and 001 to 210', () => {
    expect(LIVE.failed).toEqual([]);
    expect(AT210.failed).toEqual([]);
    expect(AT210.files.at(-1)).toMatch(/^210_/);
  });

  /** The configurations a DM can set by hand, from the curate model the share panel draws. */
  function configsFor(pub) {
    const m = veil.curateModelFor(pub, []);
    const A = { groupings: [], switches: [], houses: [], npcFields: [], powerFields: [], otherFields: [] };
    for (const sec of m.sections) {
      for (const g of sec.groupings) A.groupings.push(g.address);
      for (const s of sec.switches) A.switches.push(s.address);
      for (const c of sec.cards) {
        if (c.whole) A.houses.push(c.whole.address);
        for (const e of c.eyes) (c.kind === 'npc' ? A.npcFields : c.kind === 'faction' ? A.powerFields : A.otherFields).push(e.address);
      }
    }
    const faces = (pub.npcs || []).map((n) => `card:npc:${veil.CARD_KINDS.npc.idOf(n)}`);
    const hide = (xs, hidden = true) => xs.map((address) => ({ address, hidden }));
    const every = [...A.groupings, ...A.switches, ...A.houses, ...A.npcFields, ...A.powerFields, ...A.otherFields];
    const defaults = veil.defaultVeilFor(pub).map((d) => d.address);
    return {
      default: [], groupings: hide(A.groupings), switches: hide(A.switches), houses: hide(A.houses), faces: hide(faces),
      npcFields: hide(A.npcFields), powerFields: hide(A.powerFields), otherFields: hide(A.otherFields),
      all: hide([...every, ...faces]),
      // every default OPENED, and every class switch shut with its eyes opened: the exceptions' path
      opened: [...hide(defaults, false), ...hide(A.switches), ...hide([...A.npcFields, ...A.otherFields], false)],
      // eyes shut and opened in turn, in the panel's order
      mixed: every.map((address, i) => ({ address, hidden: i % 3 !== 1 })),
    };
  }

  async function readAll(db, slug, link) {
    H.db = db; H.uid = '';
    const g = await gallery.fetchPublicDossier(slug);
    const gRow = H.last?.[0];
    const l = await gallery.fetchPublicDossier(link);
    const lResp = H.last;
    return { gPage: canon(g.settlement), gGroupings: veil.veilGroupingsOf(g.settlement), gRow, gAt: g.snapshotAt, gMode: g.galleryMode,
      lPage: canon(l.settlement), lGroupings: veil.veilGroupingsOf(l.settlement), lResp };
  }

  for (const [n, town] of TOWNS.entries()) {
    it(`${town.seed}: nothing the page hides is sent; no page changes; 210 is red on the same rows`, async () => {
      const { seed, crisis, ...cfg } = town;
      const raw = gen({ ...BROWSER, ...cfg }, null, { seed, customContent: {} });
      // a town named for a crisis IS in it, and an infiltrated one carries a hidden power (the second
      // review's R8: the key the generator reads is selectedStresses)
      if (crisis) {
        expect(raw.stress?.type, `${seed} stress`).toBe(crisis);
        expect((raw.powerStructure?.factions || []).filter((f) => f.hidden === true).length, `${seed} hidden powers`).toBeGreaterThan(0);
      }
      const record = { ...raw, publicProse: compose(raw) };
      const pub = veil.galleryPayloadFor(record, {});
      const id = `aaaaaaaa-0000-0000-0000-${String(n + 1).padStart(12, '0')}`;
      const slug = `pub-${n}`; const link = `lnk-${n}`;
      for (const { db } of [LIVE, AT210]) {
        await db.query(`insert into public.settlements (id, user_id, name, tier, data, is_public, public_slug, published_at, unlisted_slug, visibility, gallery_importable)
          values ($1, $2, $3, $4, $5, true, $6, now(), $7, 'unlisted', true)`, [id, OWNER, record.name || seed, cfg.settType, JSON.stringify(record), slug, link]);
      }
      const setRow = (ov, dm) => Promise.all([LIVE, AT210].map(({ db }) => db.query(
        'update public.settlements set gallery_member_overrides = $2, gallery_share_dm = $3 where id = $1', [id, JSON.stringify(ov), dm])));
      const faults = [];
      const fault = (where, list) => { for (const x of list.slice(0, 3)) faults.push(`${where}: ${x}`); };
      const livePage210 = new Map();

      const cases = [['unmarked', null, 'live', false]];
      for (const [name, deltas] of Object.entries(configsFor(pub))) {
        cases.push([name, deltas, 'live', false], [name, deltas, 'snapshot', false]);
        if (['all', 'opened', 'default'].includes(name)) cases.push([name, deltas, 'old-copy', false], [name, deltas, 'live', true], [name, deltas, 'snapshot', true]);
      }
      for (const [name, deltas, mode, dm] of cases) {
        const tag = `${name}${dm ? '+dm' : ''}/${mode}`;
        const at = '2026-11-11T00:00:00.000Z';
        const snapshot = mode === 'snapshot' ? veil.galleryPayloadFor(record, { shareDm: dm }) : mode === 'old-copy' ? record : null;
        const ov = deltas === null ? {} : veil.writeShareVeil({}, deltas, { mode: mode === 'live' ? 'live' : 'snapshot', at, snapshot });
        await setRow(ov, dm);
        // VR46 (R4I-PAGE-4): every read compared modulo its own person-id bijection (`canonRead`); the teeth a read carries on
        // each read after 212, and (v): the gallery and the link reads share no person id
        const nowRaw = await readAll(LIVE.db, slug, link);
        const now = canonRead(nowRaw);
        const before = canonRead(await readAll(AT210.db, slug, link));
        for (const [where, d] of [['gallery.data', nowRaw.gRow.data], ['link.dossier', nowRaw.lResp.dossier], ['gallery page', nowRaw.gPage], ['link page', nowRaw.lPage]]) fault(`${tag} ${where}`, freshFaults(d));
        const shared = readsDiffer(nowRaw.gRow.data, nowRaw.lResp.dossier);
        if (shared.length && shared[0] !== '(the first read serves no person id)') fault(`${tag} VR46 (v)`, [`the gallery and the link reads share ${shared.length} person ids`]);
        // (4) no page carries a role its card withholds: the pages after 211 and 212, and the 210 pages
        for (const [where, page] of [['gallery page', now.gPage], ['link page', now.lPage], ['210 gallery page', before.gPage], ['210 link page', before.lPage]]) {
          fault(`${tag} ${where} carries a role its card withholds`, rolesItsCardWithholds(page));
        }
        // (1) nothing the page hides is sent
        const g = carried(now.gRow.data, now.gPage);
        fault(`${tag} gallery.data carried`, g.paths); fault(`${tag} gallery.data readable`, g.readable);
        fault(`${tag} gallery overrides`, overridesOffences(now.gRow.gallery_member_overrides));
        const l = carried(now.lResp.dossier, now.lPage);
        fault(`${tag} link.dossier carried`, l.paths); fault(`${tag} link.dossier readable`, l.readable);
        fault(`${tag} link overrides`, overridesOffences(now.lResp.gallery_member_overrides));
        // (3) the red control: 210 sends what its page hides on these rows
        if (deltas !== null) {
          const r = carried(before.gRow.data, before.gPage).readable.length
            + carried(before.gRow.gallery_member_overrides?.$veil?.snapshot ?? {}, before.gPage).readable.length;
          control.readable += r; control.rows += 1;
        }
        // R3-CURE-3 (the chair's ruling A): a goal aimed at, or naming, a power the page withholds leaves with it, every read
        // (VR46: the leak check finds each person by the stored record's id, so each page is read back to it by its bijection)
        for (const [where, page] of [['gallery page', unkeyNamed(nowRaw.gPage, record, faults, `${tag} gallery page`)], ['link page', unkeyNamed(nowRaw.lPage, record, faults, `${tag} link page`)]]) {
          const a = goalsAimedAtWithheld(record, page); control.aimedAtWithheld += a.aimed;
          fault(`${tag} ${where} serves a goal aimed at a withheld power`, a.leaks);
        }
        // (2) no page changes: compared with 210's page of the same share read LIVE
        const key = `${name}|${dm}`;
        if (mode === 'live') livePage210.set(key, before);
        const ref = livePage210.get(key);
        if (ref) {
          // re-keyed by identity (the header): the page withholds exactly law (4)'s copies, and changes nothing else
          const g1 = withheldFrom(ref.gPage, now.gPage); const l1 = withheldFrom(ref.lPage, now.lPage);
          control.withheld += g1.n + l1.n;
          // R3-CURE-2 (the chair's ruling 3): and the goals that name a withheld power, which leave with it (Reveal DM too)
          const g2 = goalsLeaveWithTheirPower(record, g1.page, now.gPage); const l2 = goalsLeaveWithTheirPower(record, l1.page, now.lPage);
          control.goals += g2.n + l2.n; control.shownGoals += g2.shown + l2.shown;
          if (JSON.stringify(now.gPage) !== JSON.stringify(g2.page)) fault(`${tag} gallery page changed`, carried(g2.page, now.gPage).paths.concat(carried(now.gPage, g2.page).paths.map((p) => `+${p}`)).concat(['(order or value)']));
          if (JSON.stringify(now.gGroupings) !== JSON.stringify(ref.gGroupings)) fault(`${tag} gallery groupings`, [`${now.gGroupings} vs ${ref.gGroupings}`]);
          if (JSON.stringify(now.lPage) !== JSON.stringify(l2.page)) fault(`${tag} link page changed`, carried(l2.page, now.lPage).paths.concat(carried(now.lPage, l2.page).paths.map((p) => `+${p}`)).concat(['(order or value)']));
          if (JSON.stringify(now.lGroupings) !== JSON.stringify(ref.lGroupings)) fault(`${tag} link groupings`, [`${now.lGroupings} vs ${ref.lGroupings}`]);
          // VR46's five teeth on law (2)'s gallery page equality, once a town (the default veil, live): a second read for (v)
          if (name === 'default' && mode === 'live' && !dm) {
            const want = JSON.stringify(g2.page);
            const again = (await readAll(LIVE.db, slug, link)).gPage;
            teethOn(nowRaw.gPage, (c) => freshFaults(c).length === 0 && JSON.stringify(people(c)) === want, { storedId: String(record.npcs?.[0]?.id ?? ''), again },
              [/^\(i\)/, /^\(ii\)/, /^\(iii\)/, /^\(iv\)/, /^\(v\)/, /^\(the equality/], faults, `${tag} law (2) gallery page`);
          }
        }
        if (mode !== 'live' && now.gMode !== 'snapshot') fault(`${tag} gallery mode`, [String(now.gMode)]);
        if (mode !== 'live' && now.gAt !== at) fault(`${tag} snapshotAt`, [String(now.gAt)]);
        // the import: the listing's page, nothing more; the map page's member: the party link's page (below)
        if (mode === 'live' && !dm && ['all', 'opened', 'mixed', 'default', 'unmarked'].includes(name)) {
          H.db = LIVE.db; H.uid = READER;
          const impRaw = await gallery.fetchDossierForImport(slug);
          const iRaw = H.last[0].data;
          fault(`${tag} import response`, freshFaults(iRaw)); fault(`${tag} import page`, freshFaults(impRaw.settlement));
          const imp = { ...impRaw, settlement: people(impRaw.settlement) };
          const iResp = people(iRaw);
          fault(`${tag} import readable`, carried(iResp, now.gPage).readable);
          fault(`${tag} import page`, carried(imp.settlement, now.gPage).paths);
          fault(`${tag} import page carries a role its card withholds`, rolesItsCardWithholds(imp.settlement));
          const mapId = `cccccccc-0000-0000-0000-${String(n + 1).padStart(12, '0')}`;
          await LIVE.db.query(`insert into public.saved_maps (id, user_id, name, map_data, is_public, public_slug, share_kind, gallery_share_campaign)
            values ($1, $2, 'map', $3, true, $4, 'map_with_campaign', true) on conflict do nothing`, [mapId, OWNER, JSON.stringify({ campaign: { settlementIds: [id] } }), `map-${n}`]);
          H.uid = '';
          const map = await gallery.fetchGalleryMap(`map-${n}`);
          const memberRaw = map.members.find((mm) => mm.settlement)?.settlement;
          if (memberRaw) fault(`${tag} map member`, freshFaults(memberRaw));
          const member = people(memberRaw);
          if (!member) faults.push(`${tag} map: no member`);
          else {
            fault(`${tag} map member shows what the listing hides`, carried(member, now.gPage).readable);
            // N84 (a) (the chair, 2026-11-23; VR23) and 212's header item (36): THE MAP MEMBER IS THE PARTY LINK'S READ OF THE
            // SAME TOWN (the public projection, the link's splice, the link's veil; an UNMARKED member takes the default veil as
            // the link does; share-level Reveal DM never applies). So the member EQUALS, BY VALUE, the party link's page of the
            // same row and marker (now.lPage, read above through the real client read), at every marker this arm reads, unmarked
            // and marked. 211's member = listing rule is dropped, not loosened. Person ids are not re-keyed between the two reads
            // (the same row, the same projection), so the comparison is plain.
            const memberPage = canon(member);
            if (JSON.stringify(memberPage) !== JSON.stringify(now.lPage)) {
              const L = flat(now.lPage); const M = flat(memberPage);
              const diff = [...[...L.keys()].filter((p) => !M.has(p)).map((p) => `lacks ${p}`), ...[...M.keys()].filter((p) => !L.has(p)).map((p) => `+${p}`),
                ...[...M].filter(([p, v]) => L.has(p) && !Object.is(L.get(p), v)).map(([p]) => `value ${p}`)];
              fault(`${tag} map member is not the party link's page (N84 (a); 212 (36))`, diff.length ? diff : ['(order)']);
            }
            fault(`${tag} map member carries a role its card withholds`, rolesItsCardWithholds(member));
          }
        }
      }
      expect(faults, faults.slice(0, 20).join('\n')).toEqual([]);
      expect(control.rows).toBeGreaterThan(0);
    }, TOWN_TIMEOUT_MS);
  }

  it('R3-CURE-3, THE RE-STATEMENT\'S TOOTH (the chair\'s rulings 3 of 09:04 and A of 10:21): goals aimed at a withheld power exist on the judged reads and leave; goals aimed at a SHOWN power exist and are compared byte for byte by law (2)', () => {
    expect(control.rows).toBeGreaterThan(0);
    expect(control.aimedAtWithheld, 'stored goals aimed at a power the page withholds (the leak check is live)').toBeGreaterThan(0);
    expect(control.shownGoals, 'goals aimed at a shown power, each compared byte for byte by law (2)').toBeGreaterThan(0);
  });

  it('THE RED CONTROL: at 210 the same rows carry what their pages hide (the pin is live)', () => {
    expect(control.rows).toBeGreaterThan(0);
    expect(control.readable).toBeGreaterThan(0);
  });

  it('LAW (4), PLANTED: no page carries a role its card withholds, after 211 and 212 and at 210 (the chair\'s ruling on VEIL-14\'s item 0)', async () => {
    // THE CLASS OF THE 156: four veiled faces (a house record not stamped public: 206), each holding a role in a form the
    // earlier markers lacked, each switched off by hand on a Reveal-DM share; each tie copies its end's role.
    // CONTROLS: p2 is revealed and holds a role; p4 is switched off by hand and its card (an open face) holds one.
    const MARKS = ['ROLEMARK İß ✦', 'ΡΟΛΟΣ σφραγίδα', 'РОЛЬ печать', '✦✧◆★'];
    const veiled = MARKS.map((role, i) => ({ id: `v${i}`, name: `Veiled ${i}`, role, institution: { kind: 'house', key: 'rookery' } }));
    const town = { name: 'Role crossing', tier: 'town',
      npcs: [...veiled, { id: 'p2', name: 'Other', role: 'the smith' }, { id: 'p4', name: 'Bohdan', role: 'the ferryman' }],
      relationships: [...veiled.map((v, i) => (i % 2 ? { id: `t${i}`, from: 'p2', to: v.id, npc1Role: 'the smith', npc2Role: v.role }
        : { id: `t${i}`, from: v.id, to: 'p2', npc1Role: v.role, npc2Role: 'the smith' })),
      { id: 't9', from: 'p4', to: 'p2', npc1Role: 'the ferryman', npc2Role: 'the smith' }] };
    const ov = veil.writeShareVeil({}, [...veiled.map((v) => ({ address: `card:npc:${v.id}`, hidden: true })), { address: 'card:npc:p4', hidden: true }],
      { mode: 'live', at: '2026-11-11T00:00:00.000Z' });
    expect([ov.v0, ov.v3, ov.p2, ov.p4]).toEqual([{ revealDm: false }, { revealDm: false }, undefined, { revealDm: false }]);
    for (const { db } of [LIVE, AT210]) {
      await db.query(`insert into public.settlements (id, user_id, name, tier, data, is_public, public_slug, published_at, unlisted_slug, visibility, gallery_importable, gallery_member_overrides, gallery_share_dm)
        values ('abababab-0000-0000-0000-000000000001', $1, $2, 'town', $3, true, 'role-p', now(), 'role-l', 'unlisted', true, $4, true)`, [OWNER, town.name, JSON.stringify(town), JSON.stringify(ov)]);
    }
    // VR46 (R4I-PAGE-4): every page re-keys its people and ties (the 210 page under the current client's projection), so the
    // planted ties are found by their stored ids through each page's own bijection (`unkeyPeople` against the planted town)
    const nowRaw = await readAll(LIVE.db, 'role-p', 'role-l');
    const beforeRaw = await readAll(AT210.db, 'role-p', 'role-l');
    const now = { ...nowRaw, gPage: unkeyPeople(nowRaw.gPage, town), lPage: unkeyPeople(nowRaw.lPage, town) };
    const before = { ...beforeRaw, gPage: unkeyPeople(beforeRaw.gPage, town), lPage: unkeyPeople(beforeRaw.lPage, town) };
    const pages = { 'gallery page': now.gPage, 'link page': now.lPage, '210 gallery page': before.gPage, '210 link page': before.lPage };
    const told = Object.entries(pages).flatMap(([where, page]) => rolesItsCardWithholds(page).map((x) => `${where}: ${x}`));
    const text = JSON.stringify([pages, now.gRow, now.lResp]);
    expect({ told, marks: MARKS.filter((m) => text.includes(m)) }).toEqual({ told: [], marks: [] });
    // anchored: the reads drew the planted town, and the controls arrive on both Reveal-DM pages
    for (const page of [now.gPage, before.gPage]) {
      const byId = new Map(page.relationships.map((t) => [t.id, t]));
      expect([byId.get('t0')?.npc2Role, byId.get('t1')?.npc1Role, byId.get('t9')?.npc1Role, byId.get('t9')?.npc2Role]).toEqual(['the smith', 'the smith', 'the ferryman', 'the smith']);
    }
    // THE CHECK IS LIVE: the copy planted back on a page is found
    const planted = structuredClone(now.gPage); planted.relationships.find((t) => t.id === 't0').npc1Role = MARKS[0];
    expect(rolesItsCardWithholds(planted)).toEqual([`relationships[id=t0].npc1Role = ${MARKS[0]}`]);
    // VR46's teeth on the anchor's lookups: (ii), (iv) two people under one id and (v) (a second read) must bite; (i), (iii)
    // and (iv) one person under two ids cannot (the anchor reads tie roles by the tie's id, not a person's reference nor a
    // card's byte; measured: those three are missed, out/v38/r4ip4/logs/teeth-galleryServerVeil.jsonl)
    const bad = [];
    const anchored = (c) => { const m = new Map(unkeyPeople(c, town).relationships.map((t) => [t.id, t]));
      return JSON.stringify([m.get('t0')?.npc2Role, m.get('t1')?.npc1Role, m.get('t9')?.npc1Role, m.get('t9')?.npc2Role]) === JSON.stringify(['the smith', 'the smith', 'the ferryman', 'the smith']); };
    const again = (await readAll(LIVE.db, 'role-p', 'role-l')).gPage;
    teethOn(nowRaw.gPage, anchored, { storedId: 'p2', again }, [/^\(ii\)/, /^\(iv\) two people/, /^\(v\)/, /^\(the equality/], bad, 'LAW (4) gallery page');
    expect(bad).toEqual([]);
  });

  it('a share past the client\'s clamp: the server reads the same last 2,000 well-formed deltas the page reads', async () => {
    const town = TOWNS[2];
    const { seed, ...cfg } = town;
    const raw = gen({ ...BROWSER, ...cfg }, null, { seed, customContent: {} });
    const record = { ...raw, publicProse: compose(raw) };
    const pub = veil.galleryPayloadFor(record, {});
    const eyes = veil.curateModelFor(pub, []).sections.flatMap((x) => x.cards.flatMap((c) => c.eyes.map((e) => ({ address: e.address, hidden: true }))));
    // the real eyes FIRST (the clamp cuts them), malformed and over-long entries, then 5,000 more, a
    // few real eyes repeated at the END (kept), and the first real eye re-opened last of all
    const junk = Array.from({ length: 5000 }, (_, i) => ({ address: `field:npc:nobody-${i}:secret`, hidden: i % 2 === 0 }));
    const tail = eyes.slice(0, 40);
    const deltas = [...eyes, { address: `field:npc:${'x'.repeat(400)}:secret`, hidden: true }, { address: 'nonsense', hidden: true },
      { address: 'field:npc:a:secret', hidden: 'yes' }, 7, ...junk, ...tail, { ...eyes[0], hidden: false }];
    const { db } = LIVE;
    await db.query(`insert into public.settlements (id, user_id, name, tier, data, is_public, public_slug, published_at, unlisted_slug, visibility, gallery_member_overrides)
      values ('eeeeeeee-0000-0000-0000-000000000001', $1, 'T', 'town', $2, true, 'clamp-p', now(), 'clamp-l', 'unlisted', $3)`,
    [OWNER, JSON.stringify(record), JSON.stringify({ $veil: { v: 1, deltas } })]);
    // VR46 (R4I-PAGE-4): the response, the page and the twin each re-key under their own salt: compared by `canonRead` /
    // `people`, modulo each read's person-id bijection and nothing else
    const nowRaw = await readAll(db, 'clamp-p', 'clamp-l');
    const now = canonRead(nowRaw);
    expect([nowRaw.gRow.data, nowRaw.gPage, nowRaw.lResp.dossier, nowRaw.lPage].flatMap(freshFaults)).toEqual([]);
    expect(carried(now.gRow.data, now.gPage).paths).toEqual([]);
    expect(carried(now.lResp.dossier, now.lPage).paths).toEqual([]);
    // the page the 210 client draws from the same stored row (its own clamp), equal to what 211 serves
    const want = canon(people(veil.projectShareVeil(pub, { $veil: { v: 1, deltas } })));
    expect(JSON.stringify(canon(now.gRow.data))).toBe(JSON.stringify(want));
    // VR46's five teeth on the server-and-twin equality: a second read for (v)
    const bad = [];
    const again = (await readAll(db, 'clamp-p', 'clamp-l')).gRow.data;
    teethOn(nowRaw.gRow.data, (c) => freshFaults(c).length === 0 && JSON.stringify(canon(people(c))) === JSON.stringify(want), { storedId: String(record.npcs?.[0]?.id ?? ''), again },
      [/^\(i\)/, /^\(ii\)/, /^\(iii\)/, /^\(iv\)/, /^\(v\)/, /^\(the equality/], bad, 'clamp gallery.data');
    expect(bad).toEqual([]);
    // R2-CURE (VEIL-21): RE-RECORDED BY THE RULING. The page is the served document AND the page's re-derivation of what the
    // server withholds on every read and the page draws (the seventh chair's VR19 (c), VR33, VR37 (a): the defence scores,
    // the readiness score, the gates, the economy's output, a condition's severity from its band; src/lib/gallery.js ::
    // sanitizeDossier -> src/domain/veil/pageRederive.js), so the page equals the twin's projection re-derived, from the
    // projection alone. The server's document still equals the twin's projection exactly (above).
    const { rederiveForPage } = await import('../../src/domain/veil/pageRederive.js');
    expect(JSON.stringify(now.gPage)).toBe(JSON.stringify(canon(people(rederiveForPage(veil.projectShareVeil(pub, { $veil: { v: 1, deltas } }))))));
  });

  it('the $veil shapes never raise and never leak; an anonymous legacy event is veiled fail-closed', async () => {
    const { db } = LIVE;
    const PLANT = { name: 'Old Copy', criminalCaptureState: { capturedBy: 'PLANT-CAPTURE' }, npcs: [{ id: 'n1', name: 'A', secret: 'PLANT-SECRET' }], seed: 'PLANT-SEED' };
    const shapes = [
      ['array', { $veil: [] }], ['string', { $veil: 'x' }], ['null', { $veil: null }],
      ['extra-key', { $veil: { v: 1, deltas: [], copy: { secret: 'PLANT-EXTRA' } } }],
      ['old-copy', { $veil: { v: 1, deltas: [], mode: 'snapshot', at: '2026-01-01T00:00:00Z', snapshot: PLANT } }],
      ['served-v2-stored', { $veil: { v: 2, groupings: [], deltas: [{ address: 'tab:plot_hooks', hidden: false }] } }],
    ];
    for (const [i, [tag, ov]] of shapes.entries()) {
      const id = `bbbbbbbb-0000-0000-0000-00000000000${i + 1}`;
      await db.query(`insert into public.settlements (id, user_id, name, tier, data, is_public, public_slug, published_at, unlisted_slug, visibility, gallery_member_overrides)
        values ($1, $2, 'T', 'town', $5, true, $3, now(), $4, 'unlisted', $6)`,
      [id, OWNER, `shape-p${i}`, `shape-l${i}`, JSON.stringify({ name: 'T', history: { historicalEvents: [{ description: 'PLANT-ANON-EVENT', severity: 'minor' }] } }), JSON.stringify(ov)]);
      await db.exec(`set test.uid = '';`);
      const g = await db.query('select data, gallery_member_overrides from public.get_gallery_dossier($1)', [`shape-p${i}`]);
      const l = await db.query('select public.get_unlisted_dossier($1) as o', [`shape-l${i}`]);
      const text = JSON.stringify([g.rows, l.rows]);
      expect(text, tag).toMatch(/"name":"T"/);
      // anchored: the line above proves the reads returned the planted row itself, and 210 serves these PLANTs (red at 5b563a4aa)
      expect(text, tag).not.toMatch(/PLANT-(SECRET|CAPTURE|SEED|EXTRA)/);
      expect(overridesOffences(g.rows[0].gallery_member_overrides), tag).toEqual([]);
      expect(overridesOffences(l.rows[0].o.gallery_member_overrides), tag).toEqual([]);
    }
    // the anonymous event: the client addresses it by a hash the server cannot know; an eye shut on
    // it (any legacy id) shuts it on the server too
    const ov = { $veil: { v: 1, deltas: [{ address: 'field:event:event.legacy-abc123:description', hidden: true }] } };
    await db.query('update public.settlements set gallery_member_overrides = $2 where id = $1', ['bbbbbbbb-0000-0000-0000-000000000001', JSON.stringify(ov)]);
    const l = await db.query('select public.get_unlisted_dossier($1) as o', ['shape-l0']);
    expect(l.rows[0].o.dossier.history.historicalEvents).toHaveLength(1);
    // anchored: the line above proves the event itself is still on the page; only its description is gone
    expect(JSON.stringify(l.rows[0].o.dossier)).not.toContain('PLANT-ANON-EVENT');
  });

  it('the helpers twin the client: slugs, card ids and the house class, by execution', async () => {
    const { db } = LIVE;
    const { slugifyEntity } = await import('../../src/domain/dossier/entityLinks.js');
    const { isHideableHouse } = await import('../../src/domain/people/cardVeil.js');
    const { facetOf } = await import('../../src/domain/spatial/cohesionWeave.js');
    const names = ['', 'Thieves\' Guild', '  -- Ünder  Côte --  ', 'İstanbul KELVIN Kk', 'a'.repeat(120), '日本語', '🗝 Key', 'x_y-z.9'];
    const insts = [
      { name: 'The Fence', category: 'Criminal' }, { name: 'A', priorityCategory: 'criminal' },
      { name: 'B', facets: { clandestine: 'clandestine' } }, { name: 'C', tags: ['facet:subterranean:subterranean'] },
      { name: 'D', facets: { institutionFunction: 'clandestine' } }, { name: 'E', facets: { clandestine: '' }, tags: ['facet:clandestine:clandestine'] },
      { name: 'F', serviceKeys: ['info_feed'], tags: ['brokerage', 'criminal'] }, { name: 'G', serviceKeys: ['info_feed'], tags: ['brokerage'] },
      { name: 'H', serviceKeys: [5, 'info_plant'], tags: ['criminal', 'brokerage'] }, { name: 'I', category: 'CRİMİNAL' }, { name: 'J', category: 7 },
    ];
    for (const t of TOWNS.slice(0, 4)) {
      const { seed, ...cfg } = t;
      const s = gen({ ...BROWSER, ...cfg }, null, { seed, customContent: {} });
      for (const i of s.institutions || []) { insts.push(i); names.push(i.name); }
      for (const f of s.powerStructure?.factions || []) names.push(f.faction || f.name);
    }
    for (const v of names) {
      const r = await db.query('select public._gallery_veil_slug($1) as s', [v]);
      expect(r.rows[0].s, JSON.stringify(v)).toBe(slugifyEntity(v));
    }
    for (const i of insts) {
      const r = await db.query('select public._gallery_veil_house($1) as h, public._gallery_veil_card_id(\'institution\', $1) as id', [JSON.stringify(i)]);
      expect(r.rows[0].h, JSON.stringify(i).slice(0, 80)).toBe(isHideableHouse(i));
      expect(r.rows[0].id).toBe(veil.CARD_KINDS.institution.idOf(i));
      // the house class stays declarative: no inference row may make a house clandestine by its name
      const bare = { name: i.name, category: i.category };
      expect(facetOf(bare, 'clandestine')).toBe(null);
      expect(facetOf(bare, 'subterranean')).toBe(null);
      expect(facetOf(bare, 'institutionFunction')).not.toBe('clandestine');
    }
    // the constants: the SQL table is the client's CARD_KINDS and GROUPING_REMOVERS, field for field
    const kinds = (await db.query('select public._gallery_veil_kinds() as k, public._gallery_veil_groupings() as g, public._gallery_veil_kind_order() as o')).rows[0];
    expect(kinds.o).toEqual(Object.keys(veil.CARD_KINDS));
    for (const [k, def] of Object.entries(veil.CARD_KINDS)) {
      expect(kinds.k[k].lists, k).toEqual(def.lists);
      expect(kinds.k[k].floor, k).toEqual(def.floor);
      expect(kinds.k[k].fields, k).toEqual(def.fields);
    }
    expect([...kinds.g].sort()).toEqual(Object.keys(veil.GROUPING_REMOVERS).sort());
  });

  it('RULING 4: no client path writes a served v2 marker back into a row', async () => {
    const { db } = LIVE;
    const served = { npc_a: { revealDm: false }, $veil: { v: 2, mode: 'snapshot', at: '2026-11-11T00:00:00.000Z', groupings: ['tab:plot_hooks'] } };
    // the share panel's writer, from a served read (it reads the owner's own row, but even so)
    const rewritten = veil.writeShareVeil(served, [{ address: 'tab:plot_hooks', hidden: true }]);
    expect(rewritten.$veil.v).toBe(1);
    expect('groupings' in rewritten.$veil).toBe(false);
    // the one database writer of the column (updateGalleryMetadata, which clamps), executed into the row
    const id = 'aaaaaaaa-0000-0000-0000-000000000001';
    H.db = db;
    await gallery.updateGalleryMetadata(id, { memberOverrides: served });
    const row = (await db.query('select gallery_member_overrides as o from public.settlements where id = $1', [id])).rows[0].o;
    expect(row.$veil.v).toBe(1);
    expect('groupings' in row.$veil).toBe(false);
    // and that writer is the only one: every source file that names the column, with its role
    const REGISTER = {
      'src/lib/gallery.js': 'the one database writer (updateGalleryMetadata, clamped to v 1) and the read projection',
      'src/lib/galleryUnlisted.js': 'comment',
      'src/lib/saves.js': 'reads the owner\'s own row into the library',
      'src/lib/saveAdmission.js': 'checks a loaded row\'s column is an object',
      'src/domain/display/galleryVeil.js': 'comments; the writer writeShareVeil (v 1) and the readers',
      // R4I-PAGE-4 (the chair's ruling (b), 02:38 UTC): R4-IDS's module names the column in one JSDoc comment alone
      // (rekeyServed's @param); rekeyServed re-keys the served marker into a NEW object and writes no row
      'src/domain/display/galleryVeilPeople.js': 'comment; the reader rekeyServed (the served marker re-keyed into a new object, no row written)',
      'src/store/settlementSliceHelpers.js': 'the in-memory patch key list',
      'src/hooks/useGalleryShareControls.js': 'in-memory mirror of the writer\'s result',
      'src/components/ShareToGallery.jsx': 'in-memory mirror of the writer\'s result',
      'src/components/dossier/DossierActionBand.jsx': 'passes the owner\'s own save to the share panel',
      'src/components/SettlementDetail.jsx': 'passes the owner\'s own save to the share panel',
      'src/components/gallery/GalleryDetail.jsx': 'passes the owner\'s own save (ownedSave) to the share panel',
    };
    const found = [];
    const walk = (d) => { for (const e of readdirSync(d, { withFileTypes: true })) {
      const p = join(d, e.name);
      if (e.isDirectory()) walk(p); else if (/\.(js|jsx|ts|tsx)$/.test(e.name) && readFileSync(p, 'utf-8').includes('gallery_member_overrides')) found.push(p.slice(process.cwd().length + 1));
    } };
    walk(resolve(process.cwd(), 'src'));
    expect(found.sort()).toEqual(Object.keys(REGISTER).sort());
  });

  it('LOW FINDING 4: no migration from 211 on holds a raw invisible or blank character', () => {
    const BLANK = /[\u00A0\u1680\u2000-\u200B\u2028\u2029\u202F\u205F\u3000\uFEFF\u0085\u180E]/;
    for (const f of readdirSync(MIGRATIONS).filter((x) => /^\d{3}_.*\.sql$/.test(x) && Number(x.slice(0, 3)) >= 211)) {
      expect(BLANK.test(readFileSync(join(MIGRATIONS, f), 'utf-8')), f).toBe(false);
    }
  });
});

describe('LOW FINDING 1: the party link runs the sanitiser once per read (an IMMUTABLE counting stand-in)', () => {
  /** @type {any} */ let db;
  beforeAll(async () => {
    ({ db } = await buildDb());
    await db.exec(`
      create sequence public.sanitize_calls;
      create or replace function public._gallery_sanitize_public_json(value jsonb, path text[] default '{}') returns jsonb
        language sql immutable as $f$ select value || jsonb_build_object('n', nextval('public.sanitize_calls')) $f$;
      insert into public.settlements (id, user_id, name, tier, data, unlisted_slug, visibility)
        values ('dddddddd-0000-0000-0000-000000000001', '${OWNER}', 'T', 'town', '{"name":"T"}', 'count-me', 'unlisted');`);
  }, PGLITE_BOOT_TIMEOUT_MS);

  it('one read, one evaluation', async () => {
    await db.exec(`set test.uid = '';`);
    const before = Number((await db.query(`select coalesce((select last_value from public.sanitize_calls where is_called), 0) as n`)).rows[0].n);
    await db.query('select public.get_unlisted_dossier($1)', ['count-me']);
    const after = Number((await db.query('select last_value as n from public.sanitize_calls')).rows[0].n);
    expect(after - before).toBe(1);
  });
});
