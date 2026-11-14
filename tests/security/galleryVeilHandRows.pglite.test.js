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
 *   V7-2  A SECOND HOME FOLLOWS ITS SOURCE'S EYE BY IDENTITY, NEVER BY MATCHING TEXT (PART 11 section 9; the chair's
 *         record 418). Three arms, the plants this file's own:
 *         THE FIVE HOMES   the legacy annotation (by its entry's event), the siege narrative (with any shut tension),
 *                        prominentRelationship's copies (by the tie), pressureSentence (by the tie whose two ends it
 *                        names) and a person's impression (by its person), each with its hidden source as born,
 *                        amended by appending, amended by a prefix, rewritten wholly, lower-cased and upper-cased; and
 *                        what must STILL ARRIVE: another event's annotation, another tie's copies, another person's
 *                        impression, a narrative with no shut tension, the events' names, the people, the tie's ends.
 *         THE PRESSURE SENTENCE   the one home the record gives no tie for: by the two ends it names; where nothing
 *                        else accounts for it (no stress on the town, not the power structure's recentConflict); and,
 *                        where only the words tie it, on the current and the stored wording, in both directions. What
 *                        stays: the stress's line, recentConflict, another tie's sentence, the open tension itself.
 *         NO EVENT, NO TIE   an entry in the older spelling, an entry whose event was renamed (by its type and years),
 *                        an entry with no event and a copy with no tie (closed: every event's, every tie's eye).
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

  // ── V7-2: a second home follows its source's eye BY IDENTITY, never by matching text (PART 11 section 9) ──────────

  /** The born wording of each hidden source (one sentence each, so no piece of it is a shorter sentence), and its rewriting. */
  const BORN = Object.freeze({
    levy: 'Salt weights are still checked twice at the north gate by order of the old levy',
    toll: 'The ferry guild has been turning away the upriver barges until its toll is doubled',
    favour: 'Hale Dunmore carried Wren Ashby across the flood for nothing and has never let the favour drop',
    insult: 'Wren Ashby has started paying the ferry toll in full and Hale Dunmore reads it as an insult',
    palm: 'A rope burn across the right palm that never quite healed',
  });
  const REWRITTEN = Object.freeze({
    levy: 'Nothing of that season is spoken of at the gate any more',
    toll: 'An old quarrel between two crews has flared again this month',
    favour: 'Two neighbours who keep their own counsel about an old winter',
    insult: 'Something between them has soured lately and neither will name it',
    palm: 'An old injury kept out of sight under a glove',
  });
  /** A phrase of each born wording that must not arrive once its source's eye is shut, whatever the source now says. */
  const NEEDLE = Object.freeze({ levy: 'checked twice at the north gate', toll: 'turning away the upriver barges', favour: 'across the flood for nothing',
    insult: 'paying the ferry toll in full', palm: 'rope burn across the right palm' });
  const AMENDED = Object.freeze({
    'as born': (k) => BORN[k],
    'amended by appending': (k) => `${BORN[k]} (or so the harbour clerk has it)`,
    'amended by a prefix': (k) => `By every account worth hearing, ${BORN[k]}`,
    'rewritten wholly': (k) => REWRITTEN[k],
    'lower-cased': (k) => BORN[k].toLowerCase(),
    'upper-cased': (k) => BORN[k].toUpperCase(),
  });
  const lowerFirst = (t) => t.charAt(0).toLowerCase() + t.slice(1);
  const FROST_EFFECT = 'The orchard terraces above the weir were never replanted';
  const FROST_ANNOTATION = `As of the founding survey, the Long Frost (12 years ago) hit the settlement hard, and it has since recovered: the present calm was partly built in the rebuilding that followed. What it left behind (${lowerFirst(FROST_EFFECT)}) is still part of the place.`;
  const NET_LOFT = 'Odo Pell and Sib Marrow have shared one net loft since their fathers quarrelled';
  const NET_MENDING = 'Sib Marrow has been mending nets for the rival boat and Odo Pell has noticed';
  const WREN_IMPRESSION = 'Quick hands and a chipped front tooth, worn without shame.';
  const fieldEye = (kind, card, eye) => ({ address: `field:${kind}:${veil.CARD_KINDS[kind].idOf(card)}:${eye}`, hidden: true });
  const at = (doc, path) => path.reduce((c, k) => (c === null || c === undefined ? undefined : c[k]), doc);
  const person = (doc, name) => (Array.isArray(doc?.npcs) ? doc.npcs : []).find(n => isRec(n) && n.name === name);

  /**
   * SALTMERE: a town whose five second homes were composed from the BORN wording (each as the engine's own composer
   * frames it), with each hidden source as `now` says it stands. `shut`: which sources' eyes the share shuts by hand.
   * Two events, two ties and two people carry the controls (the second of each is open).
   */
  function saltmere(now, { shut = ['levy', 'toll', 'tieA', 'palm'], prominentOf = 'A', pressure, stress, recentConflict, favourBorn = BORN.favour, insultBorn = BORN.insult, extra = {} } = {}) {
    const hale = { id: 'npc.hale', name: 'Hale Dunmore', role: 'Ferryman', physical: { feature: now('palm'), build: 'Broad in the shoulder' },
      presentation: { impression: `Weathered and slow to speak, with ${lowerFirst(BORN.palm)}.`, disposition: 'guarded' } };
    const wren = { id: 'npc.wren', name: 'Wren Ashby', role: 'Chandler', physical: { feature: 'A chipped front tooth, worn without shame' }, presentation: { impression: WREN_IMPRESSION, disposition: 'open' } };
    const levy = { id: 'event.salt-levy', name: 'The Salt Levy', type: 'economic', yearsAgo: 31, severity: 'major', lastingEffects: [now('levy')] };
    const frost = { id: 'event.long-frost', name: 'The Long Frost', type: 'disaster', yearsAgo: 12, severity: 'major', lastingEffects: [FROST_EFFECT] };
    const ferry = { id: 'tension.ferry', type: 'guild_conflict', severity: 'high', description: now('toll') };
    const tieA = { id: 'tie.hale-wren', from: 'npc.hale', to: 'npc.wren', npc1Name: 'Hale Dunmore', npc2Name: 'Wren Ashby', type: 'debtor_creditor', typeName: 'Outstanding Debt',
      description: now('favour'), tension: now('insult') };
    // the second tie as the deployed client stored it (master's shape: npc1Id / npc2Id, no id)
    const tieB = { npc1Id: 'npc.odo', npc2Id: 'npc.sib', npc1Name: 'Odo Pell', npc2Name: 'Sib Marrow', type: 'rival', typeName: 'Professional Rivalry', description: NET_LOFT, tension: NET_MENDING };
    const town = { name: 'Saltmere', tier: 'town',
      institutions: [{ name: 'Net loft', category: 'Economy', desc: 'Nets.' }],
      npcs: [hale, wren, { id: 'npc.odo', name: 'Odo Pell', role: 'Netmaker' }, { id: 'npc.sib', name: 'Sib Marrow', role: 'Netmaker' }],
      relationships: [tieA, tieB],
      prominentRelationship: prominentOf === 'A'
        ? { npc1: 'Hale Dunmore', npc2: 'Wren Ashby', type: 'Outstanding Debt', phrasing: `Hale Dunmore and Wren Ashby are tied by a debt not yet paid. ${insultBorn}.`, full: favourBorn, tension: insultBorn }
        : { npc1: 'Odo Pell', npc2: 'Sib Marrow', type: 'Professional Rivalry', phrasing: NET_MENDING, full: NET_LOFT, tension: NET_MENDING },
      pressureSentence: pressure === undefined ? `Hale Dunmore and Wren Ashby are tied by a debt not yet paid. ${insultBorn}.` : pressure,
      history: {
        historicalEvents: [levy, frost],
        legacyAnnotations: [
          { annotation: `As of the founding survey, the Salt Levy (31 years ago) set up ways of doing things that have since changed: the merchants have mattered here ever since, and their power today was built up slowly over the years. What it left behind (${lowerFirst(BORN.levy)}) is still part of the place.`,
            eventType: 'economic', yearsAgo: 31, severity: 'major', eventName: 'The Salt Levy' },
          { annotation: FROST_ANNOTATION, eventType: 'disaster', yearsAgo: 12, severity: 'major', eventName: 'The Long Frost' },
        ],
        currentTensions: [ferry],
        siegeNarrative: `The Long Frost is still present in living memory: ${BORN.toll}.`,
      },
      ...(stress ? { stress } : {}), ...(recentConflict ? { powerStructure: { recentConflict, factions: [] } } : {}), ...extra };
    const deltas = [
      ...(shut.includes('levy') ? [fieldEye('event', levy, 'lastingEffects')] : []),
      ...(shut.includes('toll') ? [fieldEye('tension', ferry, 'description')] : []),
      ...(shut.includes('tieA') ? [fieldEye('relationship', tieA, 'description'), fieldEye('relationship', tieA, 'tension')] : []),
      ...(shut.includes('tieA.description') ? [fieldEye('relationship', tieA, 'description')] : []),
      ...(shut.includes('palm') ? [fieldEye('npc', hale, 'physical')] : []),
    ];
    return { town, deltas };
  }
  /** What every read of Saltmere must still carry, whatever is shut: the events' names, the people, the ties' ends, the open tie, the open person. */
  function saltmereFloor(tag, doc) {
    const bad = [];
    const want = (path, value) => { if (JSON.stringify(at(doc, path)) !== JSON.stringify(value)) bad.push(`${tag}: ${path.join('.')} is ${String(JSON.stringify(at(doc, path))).slice(0, 90)}, not ${JSON.stringify(value).slice(0, 60)}`); };
    want(['history', 'historicalEvents', 0, 'name'], 'The Salt Levy'); want(['history', 'historicalEvents', 1, 'name'], 'The Long Frost');
    want(['history', 'historicalEvents', 1, 'lastingEffects'], [FROST_EFFECT]);
    want(['history', 'legacyAnnotations', 0, 'eventName'], 'The Salt Levy'); want(['history', 'legacyAnnotations', 0, 'yearsAgo'], 31);
    want(['history', 'legacyAnnotations', 1, 'annotation'], FROST_ANNOTATION);
    want(['history', 'currentTensions', 0, 'type'], 'guild_conflict');
    want(['relationships', 0, 'npc1Name'], 'Hale Dunmore'); want(['relationships', 0, 'npc2Name'], 'Wren Ashby'); want(['relationships', 0, 'typeName'], 'Outstanding Debt');
    want(['relationships', 1, 'description'], NET_LOFT); want(['relationships', 1, 'tension'], NET_MENDING);
    for (const name of ['Hale Dunmore', 'Wren Ashby', 'Odo Pell', 'Sib Marrow']) if (!person(doc, name)) bad.push(`${tag}: ${name} is gone`);
    if (person(doc, 'Hale Dunmore')?.presentation?.disposition !== 'guarded') bad.push(`${tag}: the rest of the hidden person's presentation is gone`);
    if (person(doc, 'Wren Ashby')?.presentation?.impression !== WREN_IMPRESSION) bad.push(`${tag}: another person's impression is gone`);
    return bad;
  }

  it('V7-2 THE FIVE HOMES: the legacy annotation, the siege narrative, prominentRelationship\'s copies, pressureSentence and a person\'s impression go with their source\'s eye, with the source as born, amended by appending, by a prefix, rewritten wholly, lower-cased and upper-cased; what is open stays', async () => {
    const bad = []; const differs = []; let reads = 0;
    const HOMES = [['history', 'legacyAnnotations', 0, 'annotation'], ['history', 'siegeNarrative'], ['prominentRelationship', 'full'], ['prominentRelationship', 'tension'],
      ['prominentRelationship', 'phrasing'], ['pressureSentence']];
    for (const [how, amend] of Object.entries(AMENDED)) {
      const { town, deltas } = saltmere(amend);
      const r = await sharesOf(town, deltas);
      differs.push(...twinDiffers(r).map(d => `${how}: ${d}`));
      for (const { tag, doc } of each(r)) {
        reads += 1;
        const t = `${how}, ${tag}`;
        expect(isRec(doc), t).toBe(true);
        for (const path of HOMES) if (at(doc, path) !== undefined) bad.push(`${t}: ${path.join('.')} is sent: ${JSON.stringify(at(doc, path)).slice(0, 110)}`);
        if (person(doc, 'Hale Dunmore')?.presentation?.impression !== undefined) bad.push(`${t}: the impression is sent: ${JSON.stringify(person(doc, 'Hale Dunmore').presentation.impression).slice(0, 110)}`);
        for (const [k, needle] of Object.entries(NEEDLE)) bad.push(...arrivals(doc, needle).map(a => `${t}: the born wording of '${k}' arrives: ${a}`));
        bad.push(...saltmereFloor(t, doc));
        // the tie's ends in its copy are its floor: they stay
        for (const [k, v] of [['npc1', 'Hale Dunmore'], ['npc2', 'Wren Ashby'], ['type', 'Outstanding Debt']]) if (at(doc, ['prominentRelationship', k]) !== v) bad.push(`${t}: prominentRelationship.${k} is gone`);
      }
    }
    expect(reads).toBe(6 * 8);
    // THE CONTROLS, as born. (1) No tension shut: the narrative arrives. (2) The prominent tie is the OPEN one, and the
    // sentence names the open tie's two ends, while the other tie is shut: its three copies and the sentence arrive.
    // (3) Nothing shut by hand at all: every home arrives as stored.
    const c1 = saltmere(AMENDED['as born'], { shut: ['levy', 'tieA', 'palm'] });
    const r1 = await sharesOf(c1.town, c1.deltas);
    differs.push(...twinDiffers(r1).map(d => `no tension shut: ${d}`));
    for (const { tag, doc } of each(r1)) {
      if (at(doc, ['history', 'siegeNarrative']) !== c1.town.history.siegeNarrative) bad.push(`no tension shut, ${tag}: the narrative is ${JSON.stringify(at(doc, ['history', 'siegeNarrative']))}`);
      bad.push(...saltmereFloor(`no tension shut, ${tag}`, doc));
    }
    const openSentence = `Odo Pell and Sib Marrow are rivals in the same line of work. ${NET_MENDING}.`;
    const c2 = saltmere(AMENDED['rewritten wholly'], { prominentOf: 'B', pressure: openSentence });
    const r2 = await sharesOf(c2.town, c2.deltas);
    differs.push(...twinDiffers(r2).map(d => `another tie: ${d}`));
    for (const { tag, doc } of each(r2)) {
      if (differ(doc.prominentRelationship, c2.town.prominentRelationship).length) bad.push(`another tie, ${tag}: its copies are ${JSON.stringify(doc.prominentRelationship).slice(0, 160)}`);
      if (doc.pressureSentence !== openSentence) bad.push(`another tie, ${tag}: its sentence is ${JSON.stringify(doc.pressureSentence)}`);
      bad.push(...saltmereFloor(`another tie, ${tag}`, doc));
    }
    const c3 = saltmere(AMENDED['amended by appending'], { shut: [] });
    const r3 = await sharesOf(c3.town, c3.deltas);
    differs.push(...twinDiffers(r3).map(d => `nothing shut: ${d}`));
    for (const { tag, doc } of each(r3)) {
      for (const path of HOMES) if (JSON.stringify(at(doc, path)) !== JSON.stringify(at(c3.town, path))) bad.push(`nothing shut, ${tag}: ${path.join('.')} is ${String(JSON.stringify(at(doc, path))).slice(0, 90)}`);
      if (person(doc, 'Hale Dunmore')?.presentation?.impression !== c3.town.npcs[0].presentation.impression) bad.push(`nothing shut, ${tag}: the impression is gone`);
    }
    expect(bad).toEqual([]);
    expect(differs).toEqual([]);
  }, ARM_TIMEOUT_MS);

  it('V7-2 THE PRESSURE SENTENCE, which the record ties to no one tie: it goes by the two ends it names; where no stress and no recentConflict accounts for it; and by the words, current and stored, in both directions. The stress\'s line, recentConflict and the open tension itself stay', async () => {
    const bad = []; const differs = [];
    const rewritten = AMENDED['rewritten wholly'];
    const FAMINE = 'The granaries of Saltmere are a week from empty and everyone on the quay can count';
    const WARDENS = 'The harbour wardens want the night ferry stopped and the chandlers will not hear of it';
    const CALL_IN = 'Wren Ashby is about to call the old favour in';              // a tension that names ONE end (the prominent tie is the other one there: no stored wording)
    const STRANGER = 'Hale Dunmore once carried a stranger across the flood for nothing and has never let the favour drop'; // a description that names one end
    /** [what, the town's options, the source's wording now, GONE (a needle that must not arrive) or the sentence that must arrive] */
    const CASES = [
      ['BY ITS ENDS: the bare tension, which names both ends; the tie rewritten wholly', { pressure: `${BORN.insult}.` }, rewritten, { gone: NEEDLE.insult }],
      ['BY ITS ENDS, under a stress too: the two names, the gloss, the tension; the tie rewritten wholly', { stress: { type: 'famine' } }, rewritten, { gone: NEEDLE.insult }],
      ['NO OTHER ACCOUNT: a sentence written by hand that names neither end in full; no stress, no recentConflict; the tie amended',
        { pressure: 'Word on the quay: somebody has started paying the ferry toll in full, and the ferryman reads it as an insult.' }, AMENDED['amended by appending'], { gone: NEEDLE.insult }],
      ['NO OTHER ACCOUNT, the tie rewritten wholly', { pressure: 'Word on the quay: somebody has started paying the ferry toll in full, and the ferryman reads it as an insult.' }, rewritten, { gone: NEEDLE.insult }],
      ['THE WORDS, the copy inside the source: under a stress, a born tension that names one end, its source amended by appending',
        { stress: { type: 'famine' }, pressure: `${CALL_IN}.`, prominentOf: 'B' }, (k) => (k === 'insult' ? `${CALL_IN}, and soon (or so the harbour clerk has it)` : AMENDED['as born'](k)), { gone: 'call the old favour in' }],
      ['THE WORDS, the copy inside the source: the same, its source amended by a prefix',
        { stress: { type: 'famine' }, pressure: `${CALL_IN}.`, prominentOf: 'B' }, (k) => (k === 'insult' ? `By every account worth hearing, ${CALL_IN}` : AMENDED['as born'](k)), { gone: 'call the old favour in' }],
      ['THE WORDS, the stored wording: under a stress, the description as born kept in prominentRelationship.full, the tie rewritten wholly',
        { stress: { type: 'famine' }, pressure: `They still tell it on the quay: ${STRANGER}.`, favourBorn: STRANGER }, rewritten, { gone: 'carried a stranger across the flood' }],
      // WHAT STAYS, the tie's two eyes shut and the tie rewritten wholly
      ['STAYS: the stress\'s line, in a town under a stress', { stress: { type: 'famine' }, pressure: FAMINE }, rewritten, { stays: FAMINE }],
      ['STAYS: the stress\'s line, the stress stored as a list', { stress: [{ type: 'famine' }], pressure: FAMINE }, rewritten, { stays: FAMINE }],
      ['STAYS: the power structure\'s recentConflict', { recentConflict: WARDENS, pressure: WARDENS }, rewritten, { stays: WARDENS }],
      // the description's eye alone shut: the sentence that IS the open tension stays; the composer's third form goes
      ['STAYS: the tension itself, its eye open, the description\'s eye alone shut', { shut: ['tieA.description'], pressure: BORN.insult }, AMENDED['as born'], { stays: BORN.insult }],
      ['the description\'s eye alone shut: the two names, the gloss and the tension go (the record cannot tell that head from one written by hand)', { shut: ['tieA.description'] }, AMENDED['as born'], { gone: 'tied by a debt not yet paid' }],
    ];
    for (const [what, opts, now, expected] of CASES) {
      const { town, deltas } = saltmere(now, opts);
      const r = await sharesOf(town, deltas);
      differs.push(...twinDiffers(r).map(d => `${what}: ${d}`));
      for (const { tag, doc } of each(r)) {
        expect(isRec(doc), `${what}, ${tag}`).toBe(true);
        if (expected.gone !== undefined) {
          if (doc.pressureSentence !== undefined) bad.push(`${what}, ${tag}: the sentence is sent: ${JSON.stringify(doc.pressureSentence).slice(0, 110)}`);
          bad.push(...arrivals(doc, expected.gone, { notAt: /^\$\.relationships\[0\]\.tension$/ }).map(a => `${what}, ${tag}: ${a}`));
        } else if (doc.pressureSentence !== expected.stays) bad.push(`${what}, ${tag}: the sentence is ${JSON.stringify(doc.pressureSentence)}`);
        bad.push(...saltmereFloor(`${what}, ${tag}`, doc));
      }
      // the description's eye alone: the copy that IS the open tension stays with it (prominentRelationship.phrasing), the description's copy goes
      if (opts.shut && opts.shut.includes('tieA.description')) {
        const pr = saltmere(now, { ...opts, extra: { prominentRelationship: { npc1: 'Hale Dunmore', npc2: 'Wren Ashby', type: 'Outstanding Debt', phrasing: BORN.insult, full: BORN.favour, tension: BORN.insult } } });
        const r2 = await sharesOf(pr.town, pr.deltas);
        differs.push(...twinDiffers(r2).map(d => `${what} (the copies): ${d}`));
        for (const { tag, doc } of each(r2)) {
          if (differ(doc.prominentRelationship, { npc1: 'Hale Dunmore', npc2: 'Wren Ashby', type: 'Outstanding Debt', phrasing: BORN.insult, tension: BORN.insult }).length) {
            bad.push(`${what}, ${tag}: the copies are ${JSON.stringify(doc.prominentRelationship).slice(0, 200)}`);
          }
        }
      }
    }
    expect(bad).toEqual([]);
    expect(differs).toEqual([]);
  }, ARM_TIMEOUT_MS);

  it('V7-2 NO EVENT, NO TIE: an annotation in the older spelling goes by its event\'s name; one whose event was renamed, by its type and years; one with no event at all, and a copy that names no tie, follow every event\'s and every tie\'s eye (closed), and arrive where none is shut', async () => {
    const bad = []; const differs = [];
    const MINT = 'The mint mark on the old coin is still refused at the fish stalls';
    const WALL = 'The east wall was rebuilt two courses lower than the charter allows';
    const extraHistory = (now) => {
      const base = saltmere(now).town.history;
      const mint = { id: 'event.mint', name: 'The Clipped Coin', type: 'political', yearsAgo: 44, lastingEffects: [REWRITTEN.levy] };
      // renamed after its birth: the entry still says 'The Wall Riot'
      const wall = { id: 'event.wall', name: 'The Quiet Rebuilding', type: 'military', yearsAgo: 57, lastingEffects: [REWRITTEN.toll] };
      return { events: { mint, wall }, history: { ...base, historicalEvents: [...base.historicalEvents, mint, wall],
        legacyAnnotations: [...base.legacyAnnotations,
          { event: 'The Clipped Coin', type: 'political', yearsAgo: 44, annotation: `The Clipped Coin left its mark: ${lowerFirst(MINT)}.` },
          { annotation: `As of the founding survey, the Wall Riot (57 years ago): what it left behind (${lowerFirst(WALL)}) is still part of the place.`, eventType: 'military', yearsAgo: 57, eventName: 'The Wall Riot' },
          { annotation: 'As of the founding survey, the Drowned Fair (90 years ago): what it left behind (the fair ground is still marked on no map of the town) is still part of the place.', eventType: 'magical', yearsAgo: 90, eventName: 'The Drowned Fair' },
        ] } };
    };
    const orphanCopies = { npc1: 'Hale of the Ferry', npc2: 'Wren the Chandler', type: 'An Old Debt', phrasing: `It is an open secret: ${BORN.insult}.`, full: BORN.favour, tension: BORN.insult };
    // (1) the events' lasting effects shut by the switch; the tie's two eyes shut by hand; every source rewritten wholly
    const h1 = extraHistory(AMENDED['rewritten wholly']);
    const s1 = saltmere(AMENDED['rewritten wholly'], { shut: ['tieA'], extra: { history: h1.history, prominentRelationship: orphanCopies } });
    // (the switch on every event's lasting effects, and one event excepted from it by hand: the Long Frost stays open)
    const r1 = await sharesOf(s1.town, [...s1.deltas, { address: 'class:event:lastingEffects', hidden: true }, { address: 'field:event:event.long-frost:lastingEffects', hidden: false }]);
    differs.push(...twinDiffers(r1).map(d => `shut: ${d}`));
    for (const { tag, doc } of each(r1)) {
      for (const i of [0, 2, 3, 4]) if (at(doc, ['history', 'legacyAnnotations', i, 'annotation']) !== undefined) bad.push(`shut, ${tag}: annotation ${i} is sent: ${JSON.stringify(at(doc, ['history', 'legacyAnnotations', i, 'annotation'])).slice(0, 90)}`);
      for (const needle of [NEEDLE.levy, 'still refused at the fish stalls', 'two courses lower than the charter', 'marked on no map']) bad.push(...arrivals(doc, needle).map(a => `shut, ${tag}: ${a}`));
      for (const k of ['full', 'tension', 'phrasing']) if (at(doc, ['prominentRelationship', k]) !== undefined) bad.push(`shut, ${tag}: the copy with no tie keeps ${k}`);
      for (const needle of [NEEDLE.favour, NEEDLE.insult]) bad.push(...arrivals(doc, needle).map(a => `shut, ${tag}: ${a}`));
      // the entries keep their floor, and the open event (the switch excepted on it by hand) keeps its annotation
      for (const [i, nm] of [[2, 'The Clipped Coin'], [3, 'The Wall Riot'], [4, 'The Drowned Fair']]) if ((at(doc, ['history', 'legacyAnnotations', i, 'eventName']) ?? at(doc, ['history', 'legacyAnnotations', i, 'event'])) !== nm) bad.push(`shut, ${tag}: entry ${i} lost its event's name`);
      bad.push(...saltmereFloor(`shut, ${tag}`, doc));
    }
    // (2) no event's eye and no tie's eye shut (a person's appearance alone): every entry and the copy arrive as stored
    const s2 = saltmere(AMENDED['rewritten wholly'], { shut: ['palm'], extra: { history: h1.history, prominentRelationship: orphanCopies } });
    const r2 = await sharesOf(s2.town, s2.deltas);
    differs.push(...twinDiffers(r2).map(d => `open: ${d}`));
    for (const { tag, doc } of each(r2)) {
      if (differ(at(doc, ['history', 'legacyAnnotations']), s2.town.history.legacyAnnotations).length) bad.push(`open, ${tag}: the entries are ${JSON.stringify(at(doc, ['history', 'legacyAnnotations'])).slice(0, 160)}`);
      if (differ(doc.prominentRelationship, orphanCopies).length) bad.push(`open, ${tag}: the copy is ${JSON.stringify(doc.prominentRelationship).slice(0, 160)}`);
    }
    expect(bad).toEqual([]);
    expect(differs).toEqual([]);
  }, ARM_TIMEOUT_MS);

  // ── COHERENCE-VEIL-11: THE WORDS IN EVERY SCRIPT (the seat's read of 212 section 4b) ──────────────────────────────
  // Where only the words tie a copy to its source (a pressureSentence in a town under a stress that names no tie's two
  // ends), the source is matched in any case. The two engines' own case maps disagree outside ASCII (PostgreSQL's
  // lower() writes a word-final capital sigma as a medial sigma where JavaScript writes the final one; JavaScript
  // writes U+0130 as i and a combining dot), and neither makes the sharp s 'ss', the dotless i 'i' or an accent
  // nothing. Each plant: the shut tie's description in one case, the sentence holding it in the other.
  it('VEIL-11 THE WORDS IN EVERY SCRIPT: a shut source is found in a words-only home whatever the case, the script, the accents, a sharp s or a dotted capital I, by the same fold in both engines; the same sentence arrives where its source is open', async () => {
    const bad = []; const differs = []; let reads = 0;
    const PLANTS = [
      ['Greek, a word-final sigma', 'ΟΙ ΔΥΟ ΟΙΚΟΓΕΝΕΙΕΣ ΜΟΙΡΑΖΟΝΤΑΙ ΕΝΑ ΠΑΛΙΟ ΧΡΕΟΣ', 'Στο λιμάνι λένε πως οι δυο οικογενειες μοιραζονται ενα παλιο χρεος.'],
      ['Greek, accented in the copy', 'ΟΙ ΔΥΟ ΟΙΚΟΓΕΝΕΙΕΣ ΜΟΙΡΑΖΟΝΤΑΙ ΕΝΑ ΠΑΛΙΟ ΧΡΕΟΣ', 'Στο λιμάνι λένε πως οι δύο οικογένειες μοιράζονται ένα παλιό χρέος.'],
      ['Turkish, a dotted capital I and the dotless i', 'İSKELE KAPISI GECE AÇIK KALDI', 'Rıhtımda herkes biliyor: iskele kapısı gece açık kaldı.'],
      ['German, a sharp s', 'DIE GROSSE STRASSE WURDE GESPERRT', 'Am Kai heißt es nur: die große straße wurde gesperrt.'],
      ['German, a capital sharp s', 'DIE GROẞE STRAẞE WURDE GESPERRT', 'Am Kai heißt es nur: die grosse strasse wurde gesperrt.'],
      ['Cyrillic', 'СТАРЫЙ ДОЛГ ЗА ПЕРЕПРАВУ ТАК И НЕ ВЕРНУЛИ', 'На пристани говорят: старый долг за переправу так и не вернули.'],
      ['Armenian', 'ՀԻՆ ՊԱՐՏՔԸ ԴԵՌ ՉԻ ՎԵՐԱԴԱՐՁՎԵԼ', 'Նավամատույցում ասում են՝ հին պարտքը դեռ չի վերադարձվել։'],
    ];
    for (const [how, source, sentence] of PLANTS) {
      for (const open of [false, true]) {
        const t = saltmere((k) => (k === 'favour' ? source : AMENDED['as born'](k)), { shut: open ? [] : ['tieA'], stress: { type: 'famine' }, pressure: sentence });
        const r = await sharesOf(t.town, t.deltas);
        differs.push(...twinDiffers(r).map(d => `${how}${open ? ' (open)' : ''}: ${d}`));
        for (const { tag, doc } of each(r)) {
          reads += 1;
          const sent = doc?.pressureSentence;
          if (!open && sent !== undefined) bad.push(`${how}, ${tag}: the sentence holding the shut source is sent: ${JSON.stringify(sent).slice(0, 90)}`);
          if (open && sent !== sentence) bad.push(`${how} (open), ${tag}: the sentence is ${JSON.stringify(sent).slice(0, 90)}`);
        }
      }
    }
    expect(reads).toBe(PLANTS.length * 2 * 8);
    expect(bad).toEqual([]);
    expect(differs).toEqual([]);
  }, ARM_TIMEOUT_MS);

  it('VEIL-11 THE WORDS\' FOLD IS ONE: _gallery_veil_case_fold and the twin\'s caseFold give the same string for every code point of the basic plane and every letter of the case table, alone and inside a word', async () => {
    const sh = await import('../../src/domain/display/gallerySecondHomes.js');
    const points = [];
    for (let c = 1; c <= 0xffff; c += 1) if (c < 0xd800 || c > 0xdfff) points.push(String.fromCodePoint(c));
    for (const ch of new Set(Array.from(sh.NAME_CASE.replace(/ /g, '')))) if (ch.codePointAt(0) > 0xffff) points.push(ch);
    const bad = []; let asked = 0;
    for (let i = 0; i < points.length; i += 2048) {
      const part = points.slice(i, i + 2048);
      for (const text of [part.join(' '), part.map(ch => `x${ch}y`).join(' ')]) {
        asked += 1;
        const server = (await db.query('select public._gallery_veil_case_fold($1) as f', [text])).rows[0].f;
        if (server !== sh.caseFold(text)) {
          const a = Array.from(server); const b = Array.from(sh.caseFold(text)); let k = 0; while (k < a.length && a[k] === b[k]) k += 1;
          bad.push(`from U+${part[0].codePointAt(0).toString(16)}: first difference at ${k}: server ${JSON.stringify(a.slice(k, k + 4).join(''))}, twin ${JSON.stringify(b.slice(k, k + 4).join(''))}`);
        }
      }
    }
    expect(asked).toBeGreaterThan(60);
    expect(bad).toEqual([]);
    // the fold is the words' only case map: a sigma, a dotted capital I, a sharp s
    expect(sh.caseFold('ΧΡΕΟΣ')).toBe(sh.caseFold('χρεος'));
    expect(sh.caseFold('İSKELE KAPISI')).toBe(sh.caseFold('iskele kapısı'));
    expect(sh.caseFold('STRAẞE')).toBe(sh.caseFold('strasse'));
  }, ARM_TIMEOUT_MS);
});
