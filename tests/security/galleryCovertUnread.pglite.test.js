/**
 * galleryCovertUnread.pglite.test.js — COVERT-UNREAD, RED FIRST (VEIL-52's builder; the chair's RULING V28 (1), Q1, FAIL
 * CLOSED; the brief docs/chair/2026-11-24/tenth/veil/v52/briefs/COVERT-UNREAD-BRIEF.md).
 *
 * THE FAULT. 212 :: _gallery_apply_member_overrides (twin: gallerySecondHomes.js :: withholdCovertCopies) judges a covert
 * tie's copy (prominentRelationship) and the sentence that tells it (pressureSentence) against the full town's own
 * relationships[]. A full town that carries either string and has NO relationships key gives the judge nothing to read:
 * no tie is dropped, so both strings were served on a public read. V28 (1): there the read is `unread` (fail closed):
 * both are withheld, the existing `closed` path.
 *
 * THE PLANT. A stored town carrying a covert tie's copy (prominentRelationship: npc1/npc2/type/full) and a pressureSentence
 * that tells it, and NO relationships key, saved two ways at Reveal DM off (unmarked): PLAIN (`data`) and NARRATED
 * (`ai_data.aiSettlement`, gallery_share_narrated true; its `data` a base town carrying neither key, so a door that read
 * `data` instead of the narration serves nothing of the plant and the CONTROL catches it). Read at every door:
 * get_gallery_dossier (data, a visitor), get_unlisted_dossier (-> 'dossier', a visitor), import_gallery_dossier (data, a
 * signed-in premium reader), get_gallery_map (members[0].settlement, a visitor), import_gallery_map (members[0].settlement,
 * a signed-in reader); and THE TWIN (galleryPayloadFor and withholdCovertCopies over the same document, shareDm false).
 * Neither the copy nor the sentence (nor any of their tagged words) is served.
 * THE CONTROL. The same document WITH `relationships: [<an OPEN tie the copy copies>]` (an array, no covert tie): both
 * strings ARE served, as stored, at every door and by the twin (the plant is not withheld for another reason). U3R: the
 * control was `relationships: []`; under THE ORPHAN RULE (V28 (1) (c)) a copy of no tie present goes whole, so the control
 * now holds the tie its copy is of, open.
 * Harness: galleryMapCovert.pglite.test.js (its pglite chain, its plant style, its four server reads); the premium reader
 * as galleryVeilHandRows.pglite.test.js; the narrated save as galleryVeilCures.pglite.test.js :: put.
 */
import { describe, it, expect, beforeAll, vi } from 'vitest';
import { PGlite } from '@electric-sql/pglite';
import { pgcrypto } from '@electric-sql/pglite/contrib/pgcrypto';
import { readFileSync, readdirSync } from 'node:fs';
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
const clone = (v) => JSON.parse(JSON.stringify(v));
/** JSON with every record's keys sorted (a jsonb round trip reorders keys). */
const J = (v) => JSON.stringify(v ?? null, (_k, x) => (isRec(x) ? Object.fromEntries(Object.keys(x).sort().map((q) => [q, x[q]])) : x));
/** Lower case, every character that is not a letter or a digit of ANY script removed. */
const squeeze = (t) => String(t).toLowerCase().replace(/[^\p{L}\p{N}]+/gu, '');
/** Every KEY and every string VALUE of a document, with its path. */
function leaves(v, path = '$', acc = []) {
  if (typeof v === 'string') acc.push({ path, text: v, kind: 'value' });
  else if (Array.isArray(v)) v.forEach((x, i) => leaves(x, `${path}[${i}]`, acc));
  else if (isRec(v)) for (const [k, x] of Object.entries(v)) { acc.push({ path: `${path}.${k}`, text: k, kind: 'KEY' }); leaves(x, `${path}.${k}`, acc); }
  return acc;
}
/** Where a needle arrives: as written, lower-cased, or squeezed. */
const arrivals = (doc, needle) => leaves(doc).filter(({ text }) => text.includes(needle) || text.toLowerCase().includes(needle.toLowerCase())
  || (squeeze(needle) !== '' && squeeze(text).includes(squeeze(needle)))).map(({ path, text, kind }) => `${kind} ${path} = ${JSON.stringify(text.slice(0, 70))}`);

const PERSON = 'Mira Vane';
const TAGS = ['unread1', 'unread2', 'unread3'];
/**
 * The plant: a covert tie's copy (between Mira Vane and Tam Reed) prominent, its phrasing the pressure sentence, and NO
 * relationships key. `withRels` adds `relationships: [<that tie, OPEN>]` (THE CONTROL: an array, no covert tie; U3R).
 */
function plantTown(withRels) {
  const full = `${TAGS[0]} the two of them meet in the salt cellar at night`;
  const tension = `${TAGS[1]} if the council learns of it both hang`;
  const phrasing = `${TAGS[2]} they say Mira Vane and Tam Reed meet at night`;
  return { name: 'Saltmere unread', tier: 'town', institutions: [{ name: 'Fish market', category: 'Economy', desc: 'Fish.' }],
    npcs: [{ id: 'npc.orrin', name: 'Orrin Vale', role: 'Guildmaster' }, { id: 'npc.a', name: PERSON, role: 'Fence' }, { id: 'npc.b', name: 'Tam Reed', role: 'Smith' }],
    ...(withRels ? { relationships: [{ id: 'tie.a-b', from: 'npc.a', to: 'npc.b', npc1Name: PERSON, npc2Name: 'Tam Reed', type: 'lover', typeName: 'Secret lovers', description: full, tension }] } : {}),
    prominentRelationship: { npc1: PERSON, npc2: 'Tam Reed', type: 'Secret lovers', phrasing, full, tension },
    pressureSentence: phrasing };
}
/** The narrated save's `data`: a base town carrying neither key (a door that read it in place of the narration serves nothing of the plant). */
const NARRATED_BASE = { name: 'Saltmere base', tier: 'town', institutions: [{ name: 'Fish market', category: 'Economy', desc: 'Fish.' }],
  npcs: [{ id: 'npc.orrin', name: 'Orrin Vale', role: 'Guildmaster' }] };
const SAVES = ['plain', 'narrated'];
const DOORS = ['gallery', 'link', 'import', 'map', 'mapImport'];
const DOOR_NAME = { gallery: 'get_gallery_dossier data', link: 'get_unlisted_dossier dossier', import: 'import_gallery_dossier data',
  map: 'get_gallery_map members[0].settlement', mapImport: 'import_gallery_map members[0].settlement' };

describe('COVERT-UNREAD: a full town with the covert copy or sentence and no relationships key is unread, so both are withheld on a public read (V28 (1), fail closed)', () => {
  /** @type {PGlite} */ let db;
  let veil; let homes;
  /** @type {Map<string, any>} */ const memo = new Map();
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
    homes = await import('../../src/domain/display/gallerySecondHomes.js');
  }, PGLITE_BOOT_TIMEOUT_MS);

  /**
   * One share of `town` (PLAIN: in `data`; NARRATED: in ai_data.aiSettlement, gallery_share_narrated true), unmarked, Reveal
   * DM off, importable, on its own map_with_campaign map (one owner), read at the five doors.
   */
  async function readsOf(key, town, save) {
    const k = `${key}|${save}`;
    if (memo.has(k)) return memo.get(k);
    seq += 1;
    const slug = `unread${seq}`;
    const narrated = save === 'narrated';
    const id = (await db.query(`insert into public.settlements (id,user_id,name,tier,data,is_public,public_slug,published_at,unlisted_slug,visibility,gallery_member_overrides,gallery_share_dm,gallery_importable,gallery_share_narrated,ai_data)
      values (gen_random_uuid(), $1, $2, 'town', $3::jsonb, true, $4, now(), $5, 'unlisted', '{}'::jsonb, false, true, $6, $7::jsonb) returning id::text as id`,
    [OWNER, town.name, JSON.stringify(narrated ? NARRATED_BASE : town), slug, `${slug}-l`, narrated, narrated ? JSON.stringify({ aiSettlement: town }) : null])).rows[0].id;
    await db.query(`insert into public.saved_maps (id, user_id, name, map_data, is_public, public_slug, share_kind, gallery_share_campaign, gallery_importable, unlisted_slug, visibility)
      values (gen_random_uuid(), $1, 'map', $2::jsonb, true, $3, 'map_with_campaign', true, true, $4, 'public')`, [OWNER, JSON.stringify({ campaign: { settlementIds: [id] } }), `${slug}-m`, `${slug}-mu`]);
    await db.exec(`set test.uid = '';`);
    const gallery = (await db.query(`select to_jsonb(g.data) as d from public.get_gallery_dossier($1) g`, [slug])).rows[0]?.d;
    const link = (await db.query(`select public.get_unlisted_dossier($1) -> 'dossier' as d`, [`${slug}-l`])).rows[0]?.d;
    const map = (await db.query(`select public.get_gallery_map($1) as x`, [`${slug}-m`])).rows[0]?.x;
    await db.exec(`set test.uid = '${READER}';`);
    const imported = (await db.query(`select to_jsonb(g.data) as d from public.import_gallery_dossier($1) g`, [slug])).rows[0]?.d;
    const mapImport = (await db.query(`select public.import_gallery_map($1) as x`, [`${slug}-m`])).rows[0]?.x;
    await db.exec(`set test.uid = '';`);
    const members = (m) => (isRec(m) && Array.isArray(m.members) ? m.members : []);
    const out = { gallery, link, import: imported, map: members(map)[0]?.settlement, mapImport: members(mapImport)[0]?.settlement,
      counts: { map: members(map).length, mapImport: members(mapImport).length } };
    memo.set(k, out);
    return out;
  }

  /** The sends of the plant on one document: the copy, the sentence, any tagged word of either; and the person must still arrive. */
  const sendsOf = (what, doc, town) => {
    if (!isRec(doc)) return [`${what}: no document (${JSON.stringify(doc)})`];
    const bad = [];
    if ('prominentRelationship' in doc) bad.push(`${what}: prominentRelationship served: ${JSON.stringify(doc.prominentRelationship).slice(0, 90)}`);
    if ('pressureSentence' in doc) bad.push(`${what}: pressureSentence served: ${JSON.stringify(doc.pressureSentence).slice(0, 90)}`);
    for (const n of TAGS) bad.push(...arrivals(doc, n).map((a) => `${what}: ${n} arrives: ${a}`));
    if (!leaves(doc).some((l) => l.kind === 'value' && l.text === PERSON)) bad.push(`${what}: the person ${PERSON} is gone`);
    return bad;
  };
  /** THE CONTROL on one document: both strings served as stored. */
  const lossesOf = (what, doc, town) => {
    if (!isRec(doc)) return [`${what}: no document (${JSON.stringify(doc)})`];
    const bad = [];
    if (J(doc.prominentRelationship) !== J(town.prominentRelationship)) bad.push(`${what}: prominentRelationship is ${JSON.stringify(doc.prominentRelationship)}`);
    if (doc.pressureSentence !== town.pressureSentence) bad.push(`${what}: pressureSentence is ${JSON.stringify(doc.pressureSentence)}`);
    return bad;
  };
  /** The twin over a document, shareDm false: galleryPayloadFor's payload and withholdCovertCopies' own answer. */
  const twinOf = (town) => ({
    payload: veil.galleryPayloadFor(clone(town), { shareDm: false, memberOverrides: {} }),
    withhold: homes.withholdCovertCopies({ name: town.name, npcs: clone(town.npcs), prominentRelationship: clone(town.prominentRelationship), pressureSentence: town.pressureSentence }, clone(town), false),
  });

  for (const door of DOORS) {
    it(`COVERT-UNREAD ${door} (${DOOR_NAME[door]}): the plant (copy and sentence, no relationships key), PLAIN and NARRATED, at Reveal off serves neither the covert copy nor the sentence`, async () => {
      const town = plantTown(false);
      const bad = [];
      for (const save of SAVES) {
        const r = await readsOf('plant', town, save);
        if ((door === 'map' || door === 'mapImport') && r.counts[door] !== 1) bad.push(`${door} | ${save}: ${r.counts[door]} members`);
        bad.push(...sendsOf(`${door} | ${save}`, r[door], town));
      }
      expect(bad, `${bad.length} sends`).toEqual([]);
    }, ARM_TIMEOUT_MS);
  }

  it('COVERT-UNREAD THE TWIN (galleryPayloadFor and withholdCovertCopies over the plant, shareDm false) serves neither the covert copy nor the sentence', () => {
    const town = plantTown(false);
    const t = twinOf(town);
    expect([...sendsOf('twin | galleryPayloadFor', t.payload, town), ...sendsOf('twin | withholdCovertCopies', t.withhold, town)]).toEqual([]);
  });

  it('COVERT-UNREAD THE CONTROL: the same document WITH relationships: [the copy\'s tie, open] (no covert tie) serves both strings, as stored, at every door (PLAIN and NARRATED) and by the twin', async () => {
    const town = plantTown(true);
    const bad = [];
    for (const save of SAVES) {
      const r = await readsOf('control', town, save);
      for (const door of DOORS) bad.push(...lossesOf(`${door} | ${save}`, r[door], town));
    }
    const t = twinOf(town);
    bad.push(...lossesOf('twin | galleryPayloadFor', t.payload, town), ...lossesOf('twin | withholdCovertCopies', t.withhold, town));
    expect(bad, `${bad.length} losses`).toEqual([]);
  }, ARM_TIMEOUT_MS);
});
