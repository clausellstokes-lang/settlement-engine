/**
 * galleryVeilHandRows.pglite.test.js — THE VEIL'S DESIGN, HELD ON ROWS WRITTEN BY HAND (COHERENCE-VEIL-10; the
 * security read REVIEW-VEIL-212-FINAL-2026-11-13.md, V7-1 to V7-10; the chair's design of 2026-11-14, record 420).
 *
 * WHY ROWS BY HAND. Every finding of that read but two came from a row the generator never bears: custom content, a
 * house edited after its birth, a name in another script. gallerySecondHomes.pglite.test.js holds the born towns
 * (markers planted during the birth); this file holds what a sharer can STORE. Each arm stores its town three times
 * on a chain of every migration on disk (no veil record; the veil; the veil with Reveal DM), reads each by the
 * gallery read, the party link and the import, and runs THE CLIENT'S TWIN over the same stored row as a read of its
 * own (galleryPayloadFor, then projectShareVeil). A check is one of: a needle that MUST NOT ARRIVE in any key or
 * string, as written, lower-cased, or squeezed (lower case, every character that is not a letter or a digit of any
 * script removed); a string that MUST STILL ARRIVE; a path's value; a list's length; no record without a name.
 *
 * THE ARMS (one per cure, each red first at the commit before it):
 *   V7-3  a house hidden whole is removed whole BY ITS ID ALONE: the set is decided before the eyes trim anything
 *         (the `function` eye strips the tags, facets and service keys that put a house in the class) and is not
 *         tested again.
 *   V7-1  THE NAME SEARCH, REBUILT (PART 11 section 4; with V7-4, V7-6, V7-7, V7-9, V7-10). Five arms:
 *         EVERY SCRIPT   a hidden name in Cyrillic, Greek, Han, Thai, Arabic, symbols, separators only, mixed scripts,
 *                        with a dotted capital I, a sharp s, the Kelvin sign: as written, lower-cased, upper-cased and
 *                        squeezed, in a sentence, an export, a person's goal and the derived list.
 *         THE FORMS      a key, a join, an id beside a name, camel case, squeezed, the name without its bracketed
 *                        qualifier, a plural, a label with no name.
 *         WHAT IS NOT HIDDEN STAYS   an open house whose name holds a hidden one, a shown power named as a hidden
 *                        house, an open house named as a hidden one (another id), the town's name, and every planted
 *                        string that names no hidden house, counted.
 *         THE BOUND      a document 3,000 levels deep is served wherever the frozen 211 alone serves it; a hidden
 *                        name below level 64 does not arrive (the container at the bound is withheld whole).
 *         THE TABLES     the fold, the needle and the three tables are the same in both engines.
 *         On every arm: the paths at which the gallery read and the client's twin differ, zero.
 */
import { describe, it, expect, beforeAll, vi } from 'vitest';
import { PGlite } from '@electric-sql/pglite';
import { pgcrypto } from '@electric-sql/pglite/contrib/pgcrypto';
import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { resolve, join } from 'node:path';

const PGLITE_BOOT_TIMEOUT_MS = 900_000; // deadlock guard, not a perf budget — never tune to a measured boot (see pgliteHookTimeoutRatchet.test.js)
const ARM_TIMEOUT_MS = 600_000;

vi.mock('../../src/lib/supabase.js', () => {
  const supabase = { rpc: async () => ({ data: null, error: null }) };
  return { supabase, isConfigured: true, default: supabase };
});

const MIGRATIONS = resolve(process.cwd(), 'supabase', 'migrations');
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

const isRec = (v) => !!v && typeof v === 'object' && !Array.isArray(v);
/** Lower case, every character that is not a letter or a digit of ANY script removed. */
const squeeze = (t) => String(t).toLowerCase().replace(/[^\p{L}\p{N}]+/gu, '');
/** Every KEY and every string VALUE of a document, with its path. */
function leaves(v, path = '$', acc = []) {
  if (typeof v === 'string') acc.push({ path, text: v, kind: 'value' });
  else if (Array.isArray(v)) v.forEach((x, i) => leaves(x, `${path}[${i}]`, acc));
  else if (isRec(v)) for (const [k, x] of Object.entries(v)) { acc.push({ path: `${path}.${k}`, text: k, kind: 'KEY' }); leaves(x, `${path}.${k}`, acc); }
  return acc;
}
/** Where a needle arrives: as written, lower-cased, or squeezed. `unless`: a hit whose own text matches is not one. */
function arrivals(doc, needle, { at = null, notAt = null, unless = [] } = {}) {
  return leaves(doc).filter(({ path, text }) => (!at || at.test(path)) && !(notAt && notAt.test(path))
    && (text.includes(needle) || text.toLowerCase().includes(needle.toLowerCase()) || (squeeze(needle) !== '' && squeeze(text).includes(squeeze(needle))))
    && !unless.some(u => u.test(text))).map(({ path, text, kind }) => `${kind} ${path} = ${JSON.stringify(text.slice(0, 70))}`);
}
const valuesOf = (doc) => leaves(doc).filter(l => l.kind === 'value');
/** The paths at which two documents differ (a: the server's read, b: the client's twin). Iterative: a document may be thousands of levels deep. */
function differ(a, b) {
  const out = [];
  const stack = [[a, b, '$']];
  while (stack.length) {
    const [x, y, p] = stack.pop();
    if (isRec(x) && isRec(y)) { for (const k of new Set([...Object.keys(x), ...Object.keys(y)])) stack.push([x[k], y[k], `${p}.${k}`]); continue; }
    if (Array.isArray(x) && Array.isArray(y)) { for (let i = 0; i < Math.max(x.length, y.length); i += 1) stack.push([x[i], y[i], `${p}[${i}]`]); continue; }
    if (JSON.stringify(x) !== JSON.stringify(y)) out.push(`${p.slice(0, 120)} | server ${String(JSON.stringify(x)).slice(0, 60)} | twin ${String(JSON.stringify(y)).slice(0, 60)}`);
  }
  return out;
}
/** A value nested `depth` containers deep (arrays and records in turn). */
function nested(depth, bottom) {
  let v = bottom;
  for (let i = 0; i < depth; i += 1) v = i % 2 ? { in: v } : [v];
  return v;
}
/** How many containers deep a nested value still goes (iterative). */
function depthOf(v) {
  let d = 0;
  for (let x = v; x && typeof x === 'object';) { const next = Array.isArray(x) ? x[0] : x.in; if (next === undefined) break; d += 1; x = next; }
  return d;
}

describe('COHERENCE-VEIL-10: the veil\'s design on rows written by hand (REVIEW-VEIL-7, V7-1 to V7-10)', () => {
  /** @type {PGlite} */ let db;
  let veil;
  let seq = 0;

  beforeAll(async () => {
    db = new PGlite({ extensions: { pgcrypto } });
    await db.exec(SCAFFOLD);
    const failed = [];
    for (const f of readdirSync(MIGRATIONS).filter((n) => /^\d{3}_.*\.sql$/.test(n)).sort()) {
      const sql = readFileSync(join(MIGRATIONS, f), 'utf-8').replace(/create extension if not exists (pg_cron|pg_net)( with schema extensions)?/gi, 'select 1');
      try { await db.exec(sql); } catch (e) { failed.push(`${f}: ${String(e?.message || e).slice(0, 160)}`); }
    }
    expect(failed).toEqual([]);
    await db.exec(`insert into auth.users (id) values ('${OWNER}'), ('${READER}') on conflict do nothing;
      insert into public.profiles (id) values ('${OWNER}'), ('${READER}') on conflict do nothing;
      update public.profiles set role = 'developer' where id = '${OWNER}';
      create or replace function public.current_user_has_premium_access() returns boolean language sql stable as $f$ select true $f$;`);
    veil = await import('../../src/domain/display/galleryVeil.js');
  }, PGLITE_BOOT_TIMEOUT_MS);

  /**
   * Store one hand-written town three times and read each: {base|veil|dm: {gallery, link, import, client}}.
   * `base` is the share with no veil record (the link still takes the default veil; the twin leaves it unprojected).
   */
  async function sharesOf(town, deltas) {
    seq += 1;
    const ov = { [veil.VEIL_OVERRIDE_KEY]: { v: 1, mode: 'live', deltas } };
    const out = {};
    for (const [share, overrides, dm] of [['base', {}, false], ['veil', ov, false], ['dm', ov, true]]) {
      const slug = `hand${seq}-${share}`;
      await db.query(`insert into public.settlements (id,user_id,name,tier,data,is_public,public_slug,published_at,unlisted_slug,visibility,gallery_member_overrides,gallery_share_dm,gallery_importable)
        values (gen_random_uuid(), $1, $2, 'town', $3::jsonb, true, $4, now(), $5, 'unlisted', $6::jsonb, $7, true)`,
      [OWNER, town.name, JSON.stringify(town), slug, `${slug}-l`, JSON.stringify(overrides), dm]);
      await db.exec(`set test.uid = '';`);
      const gallery = (await db.query(`select to_jsonb(g.data) as d from public.get_gallery_dossier($1) g`, [slug])).rows[0]?.d;
      const link = (await db.query(`select public.get_unlisted_dossier($1) -> 'dossier' as d`, [`${slug}-l`])).rows[0]?.d;
      await db.exec(`set test.uid = '${READER}';`);
      const imported = (await db.query(`select to_jsonb(g.data) as d from public.import_gallery_dossier($1) g`, [slug])).rows[0]?.d;
      await db.exec(`set test.uid = '';`);
      const client = veil.projectShareVeil(veil.galleryPayloadFor(JSON.parse(JSON.stringify(town)), { shareDm: dm, memberOverrides: overrides }), overrides);
      out[share] = { gallery, link, import: imported, client };
    }
    return out;
  }
  /** Each (share, read) of a result, by default the two veiled shares and the four reads. */
  const each = (r, shares = ['veil', 'dm'], reads = ['gallery', 'link', 'import', 'client']) =>
    shares.flatMap(s => reads.map(k => ({ tag: `${s}/${k}`, doc: r[s][k] })));
  const cardAddress = (card) => `card:institution:${veil.CARD_KINDS.institution.idOf(card)}`;
  /** SERVER AGAINST TWIN: the paths at which the gallery read and the client's twin differ, on the two veiled shares. */
  const twinDiffers = (r) => ['veil', 'dm'].flatMap(s => differ(r[s].gallery, r[s].client).map(d => `${s}: ${d}`));

  it('V7-3: a house hidden whole is removed whole by its id alone: in the class by a declared facet, by a subterranean facet, or as an illegal brokerage alone, with the function eye shut', async () => {
    const hidden = [
      { name: 'Sunken chapel of the Tide', category: 'Religious', tags: ['facet:clandestine:clandestine'], desc: 'A chapel under the quay.' },
      { name: 'Cellar court', category: 'Civic', facets: { subterranean: 'subterranean' }, desc: 'A court below the street.' },
      { name: 'Whisper exchange', category: 'Economy', tags: ['brokerage', 'criminal'], serviceKeys: ['info_query'], desc: 'Answers, for a price.' },
      { id: 'inst-lodge', name: 'Lantern lodge', category: 'Civic', facets: { institutionFunction: 'clandestine' }, desc: 'A lodge that meets at night.' },
      { name: 'Cutpurse hall', category: 'Criminal', desc: 'Where purses go.' },
      // two records under ONE id, the second outside the class: the id is hidden whole, so both go (by the id alone)
      { id: 'inst-night', name: 'Night office', category: 'Criminal', desc: 'A desk nobody admits to.' },
      { id: 'inst-night', name: 'Night office', category: 'Civic', desc: 'The same door by day.' },
    ];
    const town = { name: 'Tidewick', tier: 'town',
      institutions: [...hidden, { name: 'Corn exchange', category: 'Economy', desc: 'Grain.' }],
      npcs: [{ id: 'npc.una', name: 'Una Farrow', role: 'Factor' }] };
    const deltas = [...new Set(hidden.map(cardAddress))].map(address => ({ address, hidden: true }));
    const r = await sharesOf(town, deltas);
    const bad = [];
    // the unmarked link takes the default veil, which hides every house of the class whole
    for (const { tag, doc } of [...each(r), ...each(r, ['base'], ['link'])]) {
      expect(isRec(doc), tag).toBe(true);
      const listed = (doc.institutions || []).map(i => (isRec(i) ? i.name : i));
      if (JSON.stringify(listed) !== JSON.stringify(['Corn exchange'])) bad.push(`${tag}: institutions[] lists ${JSON.stringify(doc.institutions).slice(0, 200)}`);
      for (const h of hidden) bad.push(...arrivals(doc, h.name).map(a => `${tag}: ${a}`));
      if (!valuesOf(doc).some(l => l.text === 'Corn exchange')) bad.push(`${tag}: the open house is gone`);
    }
    expect(bad).toEqual([]);
  }, ARM_TIMEOUT_MS);

  // ── V7-1 and the findings that turn on the search (PART 11 section 4) ─────────────────────────────────────────────

  /** A criminal house hidden whole under its own id, and its card address. */
  const hiddenHouse = (id, name, extra = {}) => ({ id, name, category: 'Criminal', desc: 'A house the owner hides.', ...extra });
  const hide = (...houses) => houses.map(h => ({ address: cardAddress(h), hidden: true }));
  /** Every string VALUE of a document that holds the text, as written. */
  const holding = (doc, text) => valuesOf(doc).filter(l => l.text.includes(text)).map(l => `${l.path} = ${JSON.stringify(l.text.slice(0, 70))}`);

  it('V7-1 EVERY SCRIPT: a hidden name in Cyrillic, Greek, Han, Thai, Arabic, symbols, separators only, mixed scripts, with a dotted capital I, a sharp s and the Kelvin sign is sent in no case and no spelling: a sentence, an export, a goal, the derived list', async () => {
    // [the script, the name, a sentence of that script holding the name as its writers would (no spaces where the script has none)]
    const SCRIPTS = [
      ['Cyrillic', 'Братство Ворона', 'Купцы платят дань, которую собирает Братство Ворона каждую весну.'],
      ['Greek', 'Αδελφότητα Σκιάς', 'Οι έμποροι πληρώνουν την Αδελφότητα Σκιάς κάθε μήνα.'],
      ['Han (no case, no spaces)', '黑鸦会', '城里的商人每月都向黑鸦会纳贡。'],
      ['Thai (no case, no spaces)', 'สมาคมเงา', 'พ่อค้าทุกคนจ่ายส่วยให้สมาคมเงาทุกเดือน'],
      ['Arabic (a particle joined to the name)', 'نقابة الظلال', 'يدفع التجار لنقابة الظلال كل شهر'],
      ['symbols only', '☠ ⚔ ☠', 'The door is chalked ☠ ⚔ ☠ at night.'],
      ['separators only', '§§§', 'The ledger is signed §§§ and nothing more.'],
      ['mixed scripts', 'Гильдия 影 Guild', 'Nobody refuses the Гильдия 影 Guild twice.'],
      ['a dotted capital I (U+0130) and a dotless i', '\u0130pek Han\u0131', 'Every caravan stops at the \u0130pek Han\u0131 first.'],
      ['a sharp s', 'Stra\u00dfenr\u00e4uber Gilde', 'Die Stra\u00dfenr\u00e4uber Gilde nimmt ihren Zehnten.'],
      ['the Kelvin sign (U+212A)', '\u212aelpie Court', 'The \u212aelpie Court sits after dark.'],
    ];
    const houses = SCRIPTS.map(([, name], i) => hiddenHouse(`inst-s${i}`, name));
    // each name as written, lower-cased, upper-cased, and squeezed (no space between its words); Greek capitals also as
    // a hand writes them, without the accents
    const formsOf = (name) => [...new Set([name, name.toLowerCase(), name.toUpperCase(), name.replace(/\s+/g, ''),
      name.toUpperCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').normalize('NFC')])];
    const planted = [];
    const exportsList = ['Corn exchange grain'];
    const talk = ['The Corn exchange opens at dawn.'];
    const npcs = [{ id: 'npc.una', name: 'Una Farrow', role: 'Factor', goal: { short: 'Buy the Corn exchange' } }];
    SCRIPTS.forEach(([, name, sentence], i) => {
      for (const f of formsOf(name)) {
        const line = sentence.replace(name, f);
        talk.push(line); exportsList.push(`${f} wares`);
        npcs.push({ id: `npc.s${i}-${npcs.length}`, name: `Witness ${npcs.length}`, role: 'Witness', goal: { short: `Join the ${f}` } });
        planted.push(f);
      }
    });
    const town = { name: 'Manytongues', tier: 'town',
      institutions: [...houses, { id: 'inst-corn', name: 'Corn exchange', category: 'Economy', desc: 'Grain.' }],
      npcs,
      economicState: { compound: { inst: { names: [...houses.map(h => h.name.toLowerCase()), 'corn exchange'], hasCriminalInst: false, hasMarket: true } },
        primaryExports: exportsList, marketTalk: talk } };
    const r = await sharesOf(town, hide(...houses));
    // the control: every planted sentence and export reaches a reader of the share with no veil record
    const control = valuesOf(r.base.gallery).map(l => l.text);
    expect(talk.filter(t => !control.includes(t))).toEqual([]);
    expect(exportsList.filter(t => !control.includes(t))).toEqual([]);
    const bad = [];
    for (const { tag, doc } of each(r)) {
      expect(isRec(doc), tag).toBe(true);
      SCRIPTS.forEach(([script, name]) => {
        for (const f of formsOf(name)) {
          bad.push(...holding(doc, f).map(a => `${tag} [${script}] as planted: ${a}`));
          bad.push(...arrivals(doc, f).map(a => `${tag} [${script}] in some case or squeezed: ${a}`));
        }
      });
      // what names no hidden house stays
      for (const keep of ['Corn exchange', 'corn exchange', 'Corn exchange grain', 'The Corn exchange opens at dawn.', 'Una Farrow']) {
        if (!valuesOf(doc).some(l => l.text === keep)) bad.push(`${tag}: ${JSON.stringify(keep)} is gone`);
      }
    }
    expect(planted.length).toBeGreaterThan(30);
    expect([...new Set(bad)]).toEqual([]);
    expect(twinDiffers(r)).toEqual([]);
  }, ARM_TIMEOUT_MS);

  it('V7-4, V7-9 THE FORMS: a hidden name as a key, in a join, in an id beside a name, camel-cased, squeezed, without its bracketed qualifier, in the plural; and a house hidden whole that has a label and no name', async () => {
    const ring = hiddenHouse('inst-ring', "Smugglers' ring (old)");
    const witch = hiddenHouse('inst-witch', 'Poison witch');
    const door = { label: 'Unmarked Door Society', category: 'Criminal', desc: 'A house with a label and no name.' };
    const town = { name: 'Formford', tier: 'town',
      institutions: [ring, witch, door, { id: 'inst-corn', name: 'Corn exchange', category: 'Economy', desc: 'Grain.' }],
      npcs: [
        { id: 'npc.una', name: 'Una Farrow', role: 'Factor', title: 'Voice of the SmugglersRingOld' },
        { id: 'npc.bo', name: 'Bo Tanner', role: 'Runner for the smugglersringold', secret: 'Owes the smugglers\' rings of two ports' },
        { id: 'npc.cy', name: 'Cy Marsh', role: 'Porter of the Unmarked Door Society', title: 'Friend of the poison witches' },
        { id: 'npc.di', name: 'Di Reed', role: 'Miller', title: 'Keeper of the Corn exchange' }],
      economicState: {
        compound: { inst: { names: ["smugglers' ring (old)", 'poison witch', 'unmarked door society', 'corn exchange'], hasCriminalInst: false, hasMarket: true } },
        situationDesc: 'Honest trade gets by; the Smugglers\' Ring takes the rest.',
        primaryExports: ['Corn exchange grain', 'SMUGGLERS RING contraband', 'unmarked door society dice', 'UnmarkedDoorSociety tokens'],
        tolls: { "Smugglers' ring (old)": 4, 'Corn exchange': 2, 'poison_witch': 1 },
        routes: [{ from: 'institution.smugglers_ring_old', to: 'npc.una', kind: 'employs' }, { from: 'npc.bo', to: 'institution.poison_witch', kind: 'fears' },
          { from: 'institution.corn_exchange', to: 'npc.di', kind: 'employs' }],
        stalls: [{ id: 'smugglers_ring_old.stall', name: 'Cheap stall' }, { id: 'stall-2', name: 'Stall of the Poison Witch' }, { id: 'corn_exchange.stall', name: 'Corn stall' }] } };
    const r = await sharesOf(town, [...hide(ring, witch), { address: cardAddress(door), hidden: true }]);
    const control = leaves(r.base.gallery).map(l => l.text);
    for (const reach of ["Smugglers' ring (old)", 'institution.smugglers_ring_old', 'smugglers_ring_old.stall', 'Voice of the SmugglersRingOld', 'unmarked door society dice']) expect(control, reach).toContain(reach);
    const bad = [];
    for (const { tag, doc } of each(r)) {
      expect(isRec(doc), tag).toBe(true);
      // every form of each hidden name, in any key or string: the name, the name without its qualifier (and so its
      // plural, its camel case, its squeezed spelling), the label of the house that has no name
      for (const needle of ["Smugglers' ring (old)", "Smugglers' ring", 'Poison witch', 'Unmarked Door Society']) bad.push(...arrivals(doc, needle).map(a => `${tag}: ${a}`));
      const econ = doc.economicState || {};
      if (JSON.stringify(Object.keys(econ.tolls || {})) !== JSON.stringify(['Corn exchange'])) bad.push(`${tag}: tolls keeps the keys ${JSON.stringify(Object.keys(econ.tolls || {}))}`);
      // a join that spells a hidden house goes; the join of an open house stays whole
      try { expect(econ.routes).toEqual([{ to: 'npc.una', kind: 'employs' }, { from: 'npc.bo', kind: 'fears' }, { from: 'institution.corn_exchange', to: 'npc.di', kind: 'employs' }]); } catch { bad.push(`${tag}: routes is ${JSON.stringify(econ.routes)}`); }
      // an entry whose own id or name is taken leaves the list whole: no record without a name
      try { expect(econ.stalls).toEqual([{ id: 'corn_exchange.stall', name: 'Corn stall' }]); } catch { bad.push(`${tag}: stalls is ${JSON.stringify(econ.stalls)}`); }
      if (JSON.stringify((doc.institutions || []).map(i => i.name)) !== JSON.stringify(['Corn exchange'])) bad.push(`${tag}: institutions[] lists ${JSON.stringify(doc.institutions).slice(0, 160)}`);
      for (const keep of ['Corn exchange', 'corn exchange', 'Corn exchange grain', 'Keeper of the Corn exchange', 'Una Farrow', 'Bo Tanner', 'Cy Marsh', 'Di Reed', 'Miller']) {
        if (!valuesOf(doc).some(l => l.text === keep)) bad.push(`${tag}: ${JSON.stringify(keep)} is gone`);
      }
    }
    expect([...new Set(bad)]).toEqual([]);
    expect(twinDiffers(r)).toEqual([]);

    // V7-9 alone: the ONLY house hidden whole has a label and no name
    const lone = { name: 'Lonedoor', tier: 'town', institutions: [door, { id: 'inst-corn', name: 'Corn exchange', category: 'Economy', desc: 'Grain.' }],
      npcs: [{ id: 'npc.cy', name: 'Cy Marsh', role: 'Porter of the Unmarked Door Society' }],
      economicState: { compound: { inst: { names: ['unmarked door society', 'corn exchange'], hasMarket: true } }, primaryExports: ['Corn exchange grain', 'Unmarked Door Society dice'] } };
    const r2 = await sharesOf(lone, [{ address: cardAddress(door), hidden: true }]);
    const bad2 = [];
    for (const { tag, doc } of each(r2)) {
      bad2.push(...arrivals(doc, 'Unmarked Door Society').map(a => `${tag}: ${a}`));
      try { expect(doc.institutions).toEqual([{ id: 'inst-corn', name: 'Corn exchange', category: 'Economy', desc: 'Grain.' }]); } catch { bad2.push(`${tag}: institutions[] is ${JSON.stringify(doc.institutions).slice(0, 160)}`); }
      if (!valuesOf(doc).some(l => l.text === 'Corn exchange grain')) bad2.push(`${tag}: the open export is gone`);
    }
    expect([...new Set(bad2)]).toEqual([]);
    expect(twinDiffers(r2)).toEqual([]);
  }, ARM_TIMEOUT_MS);

  it('V7-7 WHAT IS NOT HIDDEN STAYS: an open house whose name holds a hidden one keeps its name and its strings; a shown power named as a hidden house keeps its name; an open house named as a hidden one (another id) keeps its name; the town keeps its name; of the strings that name no hidden house, none is taken', async () => {
    const hand = hiddenHouse('inst-hand', 'Red hand');
    const court = hiddenHouse('inst-court-a', 'Grey court');
    // strings that name no hidden house, each planted where no other rule reaches; every one must come back
    const controls = ['Corn exchange grain', 'Red hand tannery leather', 'red hand tannery offcuts', 'RedHandTannery vellum', 'Redhanded thieves are fined', 'A reddish handcart',
      'The courtyard is grey', 'Shred handles', 'hasRedHand', 'Fred Handel\'s organ', 'Hundred handshakes'];
    const town = { name: 'Red Hand Crossing', tier: 'town',
      institutions: [hand, court,
        { id: 'inst-tan', name: 'Red hand tannery', category: 'Economy', desc: 'The Red hand tannery cures hides by the ford.' },
        { id: 'inst-court-b', name: 'Grey court', category: 'Civic', desc: 'The magistrates sit here.' },
        { id: 'inst-corn', name: 'Corn exchange', category: 'Economy', desc: 'Grain.' }],
      npcs: [{ id: 'npc.una', name: 'Una Farrow', role: 'Tanner at the Red hand tannery' }, { id: 'npc.bo', name: 'Bo Tanner', role: 'Runner for the Red hand' }],
      powerStructure: { factions: [{ faction: 'Red Hand', power: 7, desc: 'A power that is shown.' }, { name: 'Grey Court', power: 3 }] },
      economicState: { compound: { inst: { names: ['red hand', 'grey court', 'red hand tannery', 'grey court', 'corn exchange'], hasCriminalInst: false, hasMarket: true } },
        primaryExports: [...controls, 'Red hand contraband'], redHand: 'the engine\'s quantity, spelled as the hidden house' } };
    const r = await sharesOf(town, hide(hand, court));
    const control = valuesOf(r.base.gallery).map(l => l.text);
    expect(controls.filter(t => !control.includes(t))).toEqual([]);
    const bad = [];
    for (const { tag, doc } of each(r)) {
      expect(isRec(doc), tag).toBe(true);
      if (doc.name !== 'Red Hand Crossing') bad.push(`${tag}: the town's name is ${JSON.stringify(doc.name)}`);
      const listed = (doc.institutions || []).map(i => `${i.id}:${i.name}`);
      if (JSON.stringify(listed) !== JSON.stringify(['inst-tan:Red hand tannery', 'inst-court-b:Grey court', 'inst-corn:Corn exchange'])) bad.push(`${tag}: institutions[] lists ${JSON.stringify(listed)}`);
      const tan = (doc.institutions || []).find(i => i.id === 'inst-tan') || {};
      if (tan.desc !== 'The Red hand tannery cures hides by the ford.') bad.push(`${tag}: the open house's own description is ${JSON.stringify(tan.desc)}`);
      const powers = ((doc.powerStructure || {}).factions || []).map(f => f.faction || f.name);
      if (JSON.stringify(powers) !== JSON.stringify(['Red Hand', 'Grey Court'])) bad.push(`${tag}: the shown powers are ${JSON.stringify((doc.powerStructure || {}).factions)}`);
      const back = valuesOf(doc).map(l => l.text);
      const taken = controls.filter(t => !back.includes(t));
      if (taken.length) bad.push(`${tag}: ${taken.length} of ${controls.length} strings that name no hidden house are taken: ${JSON.stringify(taken)}`);
      if (!back.includes('Tanner at the Red hand tannery')) bad.push(`${tag}: the role at the open house is gone`);
      // and what does name the hidden house goes
      for (const gone of ['Red hand contraband', 'Runner for the Red hand']) if (back.includes(gone)) bad.push(`${tag}: ${JSON.stringify(gone)} arrives`);
      if ('redHand' in (doc.economicState || {})) bad.push(`${tag}: the key redHand arrives`);
    }
    expect([...new Set(bad)]).toEqual([]);
    expect(twinDiffers(r)).toEqual([]);
  }, ARM_TIMEOUT_MS);

  it('V7-10 THE BOUND: a document 3,000 levels deep with a house hidden whole is served wherever the frozen 211 alone serves it; a hidden name below level 64 does not arrive, and what holds no name at any depth comes back whole', async () => {
    // the frozen 211 alone, on a chain of its own: what it serves, this file's chain must serve
    const db211 = new PGlite({ extensions: { pgcrypto } });
    await db211.exec(SCAFFOLD);
    for (const f of readdirSync(MIGRATIONS).filter((n) => /^\d{3}_.*\.sql$/.test(n) && Number(n.slice(0, 3)) <= 211).sort()) {
      await db211.exec(readFileSync(join(MIGRATIONS, f), 'utf-8').replace(/create extension if not exists (pg_cron|pg_net)( with schema extensions)?/gi, 'select 1'));
    }
    await db211.exec(`insert into auth.users (id) values ('${OWNER}') on conflict do nothing; insert into public.profiles (id) values ('${OWNER}') on conflict do nothing;
      update public.profiles set role = 'developer' where id = '${OWNER}';`);
    const hand = hiddenHouse('inst-hand', 'Red hand');
    const ov = { [veil.VEIL_OVERRIDE_KEY]: { v: 1, mode: 'live', deltas: hide(hand) } };
    const served = async (pg, town, dm, slug) => {
      try {
        await pg.query(`insert into public.settlements (id,user_id,name,tier,data,is_public,public_slug,published_at,unlisted_slug,visibility,gallery_member_overrides,gallery_share_dm,gallery_importable)
          values (gen_random_uuid(), $1, $2, 'town', $3::jsonb, true, $4, now(), $5, 'unlisted', $6::jsonb, $7, true)`, [OWNER, town.name, JSON.stringify(town), slug, `${slug}-l`, JSON.stringify(ov), dm]);
        const doc = (await pg.query(`select to_jsonb(g.data) as d from public.get_gallery_dossier($1) g`, [slug])).rows[0]?.d;
        return isRec(doc) ? { doc } : { error: 'no row' };
      } catch (e) { return { error: String(e?.message || e).slice(0, 80) }; }
    };
    const bad = []; const seen = [];
    // the rows the frozen 211 raises on come last (a raise this deep can leave an in-process database unsteady), and
    // are not asked of this chain: nothing is owed where 211 alone does not serve
    for (const [depth, dm] of [[3000, true], [300, true], [60, false], [150, false], [300, false], [3000, false]]) {
      const town = { name: 'Deepwell', tier: 'town', institutions: [hand, { id: 'inst-corn', name: 'Corn exchange', category: 'Economy', desc: 'Grain.' }],
        economicState: { primaryExports: ['Corn exchange grain', 'Red hand contraband'], deep: nested(depth, 'bottom') } };
      const slug = `deep-${depth}-${dm ? 'dm' : 'pub'}`;
      const a = await served(db211, town, dm, slug);
      if (a.error) { seen.push(`${depth} deep, Reveal DM ${dm ? 'on' : 'off'}: 211 alone does not serve (${a.error})`); continue; }
      const b = await served(db, town, dm, slug);
      seen.push(`${depth} deep, Reveal DM ${dm ? 'on' : 'off'}: 211 alone serves, this chain ${b.error ? `raises (${b.error})` : 'serves'}`);
      if (b.error) { bad.push(seen[seen.length - 1]); continue; }
      if (depthOf(b.doc.economicState.deep) !== depth) bad.push(`${depth}/${dm}: the deep value comes back ${depthOf(b.doc.economicState.deep)} levels deep`);
      if (JSON.stringify(b.doc.economicState.primaryExports) !== JSON.stringify(['Corn exchange grain'])) bad.push(`${depth}/${dm}: exports are ${JSON.stringify(b.doc.economicState.primaryExports)}`);
    }
    if (process.env.VEIL_HAND_OUT) writeFileSync(process.env.VEIL_HAND_OUT, `${seen.join('\n')}\n`);
    // 3,000 deep under Reveal DM is the row the security read timed: the frozen 211 serves it, and so must this chain
    expect(seen[0]).toBe('3000 deep, Reveal DM on: 211 alone serves, this chain serves');
    expect(bad).toEqual([]);
    await db211.close();

    // THE CLOSED ANSWER AT THE BOUND: the root is level 0, so economicState.vault is a container at level 2; a name 80
    // containers below it is past the bound, and the container that stands AT level 64 is withheld whole. Its twin with
    // no name comes back whole, and a name above the bound is taken alone.
    const town = { name: 'Deepwell', tier: 'town', institutions: [hand, { id: 'inst-corn', name: 'Corn exchange', category: 'Economy', desc: 'Grain.' }],
      economicState: { vault: nested(80, 'Paid to the Red hand in full'), cellar: nested(80, 'Paid to the Corn exchange in full'),
        shelf: nested(20, ['Red hand tally', 'Corn exchange tally']), keyed: nested(80, { 'Red hand': 1 }) } };
    const r = await sharesOf(town, hide(hand));
    const bad2 = [];
    for (const { tag, doc } of each(r)) {
      expect(isRec(doc), tag).toBe(true);
      bad2.push(...arrivals(doc, 'Red hand').map(a => `${tag}: ${a.slice(0, 160)}`));
      const econ = doc.economicState || {};
      if (JSON.stringify(econ.cellar) !== JSON.stringify(town.economicState.cellar)) bad2.push(`${tag}: the deep value that names nothing is changed`);
      // vault is at level 2 and each nesting adds one: the container at level 64 is the 62nd below vault, so 61 remain
      if (depthOf(econ.vault) !== 61) bad2.push(`${tag}: vault comes back ${depthOf(econ.vault)} levels deep (61: the container at level 64 withheld whole)`);
      if (depthOf(econ.keyed) !== 61) bad2.push(`${tag}: keyed comes back ${depthOf(econ.keyed)} levels deep`);
      if (JSON.stringify(econ.shelf) !== JSON.stringify(nested(20, ['Corn exchange tally']))) bad2.push(`${tag}: shelf is ${JSON.stringify(econ.shelf).slice(0, 120)}`);
    }
    expect([...new Set(bad2)]).toEqual([]);
    expect(twinDiffers(r)).toEqual([]);
  }, ARM_TIMEOUT_MS);

  it('V7-1 THE TABLES: the separators, the case classes, the fold, the search pattern and the open names cut out are the same in both engines, for names of every script', async () => {
    const twin = await import('../../src/domain/display/gallerySecondHomes.js');
    const one = async (sql, params = []) => (await db.query(sql, params)).rows[0];
    expect((await one('select public._gallery_veil_name_sep(true) as v')).v).toBe(twin.NAME_SEP);
    expect((await one('select public._gallery_veil_name_case() as v')).v).toBe(twin.NAME_CASE);
    // every class is a letter and its other cases: the first member is what the others are written as
    const classes = twin.NAME_CASE.split(' ');
    expect(classes.length).toBeGreaterThan(1000);
    expect(classes.every(g => Array.from(g).length >= 2)).toBe(true);
    expect(new Set(Array.from(classes.join(''))).size).toBe(Array.from(classes.join('')).length);
    const names = ["Thieves' guild (powerful)", 'Black market', 'Братство Ворона', 'Αδελφότητα Σκιάς', '黑鸦会', 'สมาคมเงา', 'نقابة الظلال', '☠ ⚔ ☠', '§§§', '***',
      'Гильдия 影 Guild', '\u0130pek Han\u0131', 'Stra\u00dfenr\u00e4uber Gilde', '\u212aelpie Court', 'Ｆｕｌｌ\u3000ｗｉｄｔｈ', 'ﬁne ﬂour (ﬁrst)', 'Glass [blown] (old)', '(all brackets)', 'e\u0301cole', '\u00e9cole',
      'MASSE', '100% Pure_Gold (O\u0027Malley\u0027s) [.*]', 'a', 'Σίσυφος', 'ǅungla', 'x\ud83d\ude00y', '\ua7f1mall', '\ud833\udcd6\ud833\udcd7 outlined', '', 'Kirat \ud81b\udd68'];
    const opens = ['Black market bazaar', 'BLACK MARKET', 'Fish market', "Thieves' Guild Hall", 'Братство Ворона и Сокола', 'Old 黑鸦会 annex', 'Black markets', 'Ma\u00dfe und Gewichte', 'The Glass', ''];
    const folds = (await one('select coalesce(jsonb_agg(public._gallery_veil_name_fold(t) order by o), \'[]\') as f from jsonb_array_elements_text($1::jsonb) with ordinality x(t, o)', [JSON.stringify([...names, ...opens])])).f;
    expect(folds).toEqual([...names, ...opens].map(twin.nameFold));
    const server = (await one('select public._gallery_veil_name_search(array(select jsonb_array_elements_text($1::jsonb)), array(select jsonb_array_elements_text($2::jsonb))) as j', [JSON.stringify(names), JSON.stringify(opens)])).j;
    const client = twin.buildNameSearch(names, opens);
    expect(server.p).toBe(client.pattern);
    expect(server.raw).toEqual(client.raws);
    expect(server.blank).toEqual(client.blank);
    expect(client.raws).toEqual(['***', '§§§']);
    expect(client.blank.length).toBe(7);
    // and one string asked of each engine: the same answer (the server by the whole text first, the twin string by string)
    const asked = ['the THIEVES GUILDS of the coast', 'hasThievesGuild', 'ThievesGuildPowerful', 'the Black market bazaar stall', 'black markets', 'blackmarket', 'Black  market!', 'BLACK MARKET bazaars',
      'у нас братство ворона', 'БРАТСТВО ВОРОНА', 'братствоворона', 'побратство ворона', 'Братство Ворона и Сокола держит рынок', 'ΑΔΕΛΦΟΤΗΤΑ ΣΚΙΑΣ', 'αδελφότητα σκιάς', '城里的商人每月都向黑鸦会纳贡',
      'Old 黑鸦会 annex wall', 'ชาวเมืองจ่ายส่วยให้สมาคมเงาทุกเดือน', 'يدفع التجار لنقابة الظلال كل شهر', '☠⚔☠', 'signed §§§', 'two ** stars', 'three *** stars', 'i\u0307pek hani', '\u0130PEK HANI', 'ipek han',
      'STRASSENRAUBER GILDE', 'stra\u00dfenr\u00e4uber gilde', 'Strassenrauber Gilden', 'KELPIE COURT', 'kelpie courts', 'full width', 'FINE FLOUR', 'fine flour first', 'Glass', 'The Glass shop', 'glasses', 'all brackets',
      'ECOLE', 'E\u0301COLE', 'masse', 'Ma\u00dfe', 'Ma\u00dfe und Gewichte', '100 pure gold', 'a', 'A.', 'an', 'ΣΙΣΥΦΟΣ', 'σίσυφοσ', 'ǆungla', 'Ǆungla', 'X\ud83d\ude00Y', 'small', 'Small', 'AB OUTLINED', 'line\u000ablack\u0009market', 'say "black market" twice',
      'back\u005cblack market', '\uff02black market\uff02', 'nothing here', ''];
    const doc = { name: 'T', list: asked };
    const hits = (await one('select public._gallery_veil_name_hits($1::jsonb, $2::jsonb) as h', [JSON.stringify(doc), JSON.stringify(server)])).h;
    const answers = (await one('select coalesce(jsonb_agg(public._gallery_veil_name_hit(t, $2::jsonb, $3::jsonb, $4::jsonb) order by o), \'[]\') as a from jsonb_array_elements_text($1::jsonb) with ordinality x(t, o)',
      [JSON.stringify(asked), JSON.stringify(hits), JSON.stringify(server.blank), JSON.stringify(server.raw)])).a;
    const differ = asked.filter((t, i) => answers[i] !== client.hit(t)).map((t) => `${JSON.stringify(t)}: server ${answers[asked.indexOf(t)]}, twin ${client.hit(t)}`);
    expect(differ).toEqual([]);
    // the answers themselves, so that neither engine can be wrong the same way unseen
    const yes = asked.filter(t => client.hit(t));
    // (not among them: a key that only holds the letters, hasThievesGuild; the open names cut out: 'Black market
    // bazaar', its plural, 'Black markets', the longer Cyrillic and Han open names; a longer word, 'Gilden', 'an')
    expect(yes).toEqual(['the THIEVES GUILDS of the coast', 'ThievesGuildPowerful', 'blackmarket', 'Black  market!',
      'у нас братство ворона', 'БРАТСТВО ВОРОНА', 'братствоворона', 'ΑΔΕΛΦΟΤΗΤΑ ΣΚΙΑΣ', 'αδελφότητα σκιάς', '城里的商人每月都向黑鸦会纳贡',
      'ชาวเมืองจ่ายส่วยให้สมาคมเงาทุกเดือน', 'يدفع التجار لنقابة الظلال كل شهر', '☠⚔☠', 'signed §§§', 'three *** stars', 'i\u0307pek hani', '\u0130PEK HANI',
      'STRASSENRAUBER GILDE', 'stra\u00dfenr\u00e4uber gilde', 'KELPIE COURT', 'kelpie courts', 'full width', 'FINE FLOUR', 'fine flour first', 'Glass', 'glasses', 'all brackets',
      'ECOLE', 'E\u0301COLE', 'masse', 'Ma\u00dfe', '100 pure gold', 'a', 'A.', 'ΣΙΣΥΦΟΣ', 'σίσυφοσ', 'ǆungla', 'Ǆungla', 'X\ud83d\ude00Y', 'small', 'Small', 'AB OUTLINED', 'line\u000ablack\u0009market', 'say "black market" twice',
      'back\u005cblack market', '\uff02black market\uff02']);
  }, ARM_TIMEOUT_MS);
});
