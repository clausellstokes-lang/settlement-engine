/**
 * galleryCovertFrozen.pglite.test.js — COVERT-FROZEN, RED FIRST (U3R, VEIL-56's builder seat; the chair's RULING V28 (1), F1:
 * THE COVERT CHECK IS BLIND ON A FROZEN COPY).
 *
 * THE FAULT. In snapshot mode a share's source is its FROZEN COPY ($veil.snapshot), read by the gallery read, the import and
 * the map member (and import_gallery_map, which returns the map's payload). Master's client stores that copy as
 * galleryVeil.js :: galleryPayloadFor at db832c892 = publicSafe.js :: toPublicSafe ALONE, which drops every covert tie and
 * keeps prominentRelationship and pressureSentence. So 212 :: _gallery_apply_member_overrides found no covert tie in its
 * source and served the covert tie's copy and its phrasing, where the party link (the live row) withheld them.
 * THE CURE'S PARTS (V28 (1)): (a) the source's own covert ties; (b) PLUS the live stored row's covert ties (`data`'s
 * relationships[] and its narration's); (c) THE ORPHAN RULE: a prominentRelationship that is the copy of no tie present
 * in the source's relationships[] is withheld whole. The sentence under (c) waits for the chair's PS-RULE: recorded here.
 * THE ORACLE is the town AS BORN (its stored copy, its phrasing, three planted tags), never the rule.
 * Harness: galleryCovertUnread.pglite.test.js (its pglite chain, its five doors, its narrated save).
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


/** The owner's freeze time (the marker's `at`). */
const AT = '2026-11-01T00:00:00.000Z';
const A = 'Mira Vane'; const B = 'Tam Reed';
const TAGS = ['frozcov1', 'frozcov2', 'frozcov3'];
/**
 * The town as born (galleryMapCovert.pglite.test.js :: covertTown's shape): an open tie (Orrin Vale and Mira Vane) and a
 * covert tie between Mira Vane and Tam Reed whose description, tension and phrasing carry the three tags;
 * prominentRelationship is the covert tie's copy; the pressure sentence is its phrasing (it names both ends).
 * `open: true` (THE TOOTH): no covert tie; the open tie's copy prominent and an untold sentence.
 */
function bornTown({ open = false } = {}) {
  const d = `${TAGS[0]} the two of them meet in the salt cellar at night`;
  const t = `${TAGS[1]} if the council learns of it both hang`;
  const openTie = { id: 'tie.orrin-a', from: 'npc.orrin', to: 'npc.a', npc1Name: 'Orrin Vale', npc2Name: A, type: 'rival', typeName: 'Rivals', description: 'They split the docks.' };
  const covert = { id: 'tie.a-b', from: 'npc.a', to: 'npc.b', npc1Name: A, npc2Name: B, type: 'lover', typeName: 'Secret lovers', description: d, tension: t, covert: true };
  const phrasing = `${TAGS[2]} they say ${A} and ${B} meet at night`;
  return { name: 'Saltmere frozen', tier: 'town', institutions: [{ name: 'Fish market', category: 'Economy', desc: 'Fish.' }],
    npcs: [{ id: 'npc.orrin', name: 'Orrin Vale', role: 'Guildmaster' }, { id: 'npc.a', name: A, role: 'Fence' }, { id: 'npc.b', name: B, role: 'Smith' }],
    relationships: open ? [openTie] : [openTie, covert],
    prominentRelationship: open ? { npc1: 'Orrin Vale', npc2: A, type: 'Rivals', full: 'They split the docks.', phrasing: 'Orrin Vale and Mira Vane split the docks.' }
      : { npc1: A, npc2: B, type: 'Secret lovers', phrasing, full: d, tension: t },
    pressureSentence: open ? 'The quay is quiet this season.' : phrasing };
}
/** THE DRIFT (after the freeze, the live row changes): 'deleted' (the covert tie gone), 'renamed' (one end renamed, its card too). */
function drift(town, how) {
  const d = clone(town);
  if (how === 'deleted') d.relationships = d.relationships.filter((t) => t.covert !== true);
  if (how === 'renamed') { for (const t of d.relationships) if (t.covert === true) t.npc1Name = `${A} Vell`; for (const n of d.npcs) if (n.id === 'npc.a') n.name = `${A} Vell`; }
  return d;
}
const DOORS = ['gallery', 'link', 'import', 'map', 'mapImport'];
const COPY_DOORS = ['gallery', 'import', 'map', 'mapImport'];

describe('COVERT-FROZEN: a frozen copy made by master\'s client path (a public projection, every covert tie already gone) serves no covert tie\'s copy or the sentence that tells it, at the doors that read the copy (U3R; the chair\'s RULING V28 (1): (a) the source\'s ties, (b) the live stored row\'s covert ties, (c) the orphan rule)', () => {
  /** @type {PGlite} */ let db;
  let veil; let homes; let pubsafe;
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
    pubsafe = await import('../../src/domain/display/publicSafe.js');
  }, PGLITE_BOOT_TIMEOUT_MS);

  /**
   * THE TWO FREEZES. 'master': master's client path, galleryPayloadFor as master has it (db832c892: toPublicSafe ALONE,
   * which drops every covert tie and keeps the copy and the sentence); 'tip': this tree's galleryPayloadFor.
   */
  const freeze = (town, how) => (how === 'master' ? pubsafe.toPublicSafe(clone(town), { full: false, memberOverrides: null }) : veil.galleryPayloadFor(clone(town), { shareDm: false, memberOverrides: null }));

  /**
   * One share at Reveal DM off, importable, frozen (`copy` in the marker's snapshot) or live (`copy` null), its live row
   * `live` (PLAIN in `data`; NARRATED in ai_data.aiSettlement with `data` the town carrying no tie), on its own map; read at
   * the five doors.
   */
  async function readsOf({ live, copy, narrated = false }) {
    seq += 1;
    const slug = `frozcov${seq}`;
    const ov = veil.writeShareVeil({}, [], copy ? { mode: 'snapshot', at: AT, snapshot: copy } : { mode: 'live', at: AT });
    const base = { name: live.name, tier: 'town', npcs: clone(live.npcs) };
    const id = (await db.query(`insert into public.settlements (id,user_id,name,tier,data,is_public,public_slug,published_at,unlisted_slug,visibility,gallery_member_overrides,gallery_share_dm,gallery_importable,gallery_share_narrated,ai_data)
      values (gen_random_uuid(), $1, $2, 'town', $3::jsonb, true, $4, now(), $5, 'unlisted', $6::jsonb, false, true, $7, $8::jsonb) returning id::text as id`,
    [OWNER, live.name, JSON.stringify(narrated ? base : live), slug, `${slug}-l`, JSON.stringify(ov), narrated, narrated ? JSON.stringify({ aiSettlement: live }) : null])).rows[0].id;
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
    return { gallery, link, import: imported, map: members(map)[0]?.settlement, mapImport: members(mapImport)[0]?.settlement };
  }
  /** THE ORACLE IS THE TOWN AS BORN (never the rule): the covert copy is the stored copy; a sentence tells when it is the stored phrasing; any tag of the covert tie. */
  const sends = (what, doc, born, { pr = true, ps = true } = {}) => {
    if (!isRec(doc)) return [`${what}: no document (${JSON.stringify(doc)})`];
    const bad = [];
    if (pr && J(doc.prominentRelationship) === J(born.prominentRelationship)) bad.push(`${what}: prominentRelationship is the covert copy`);
    if (ps && doc.pressureSentence === born.pressureSentence) bad.push(`${what}: pressureSentence is the covert tie's phrasing`);
    // a tag anywhere (the sentence's own key aside where the sentence is only recorded)
    for (const n of TAGS) bad.push(...arrivals(doc, n).filter((a) => ps || !a.startsWith('value $.pressureSentence')).map((a) => `${what}: ${n} arrives: ${a}`));
    if (!leaves(doc).some((l) => l.kind === 'value' && l.text === 'Orrin Vale')) bad.push(`${what}: the person Orrin Vale is gone`);
    return bad;
  };
  const keysOf = (doc) => (isRec(doc) ? ['prominentRelationship', 'pressureSentence'].filter((k) => k in doc).join('+') || 'neither' : 'no document');

  it('COVERT-FROZEN (a)+(b)+(c): a copy frozen by MASTER\'s path, the live row as born: neither the covert copy nor its phrasing, nor a tag, at the gallery read, the import, the map member and the map import (PLAIN and NARRATED); the party link the same (its control)', async () => {
    const born = bornTown(); const copy = freeze(born, 'master');
    expect(Array.isArray(copy.relationships) && copy.relationships.some((t) => t.covert === true)).toBe(false); // the projection dropped it
    expect(J(copy.prominentRelationship)).toBe(J(born.prominentRelationship)); // and kept the copy (the fault's precondition)
    const bad = [];
    for (const narrated of [false, true]) {
      const r = await readsOf({ live: born, copy, narrated });
      for (const door of DOORS) bad.push(...sends(`${door} | master copy | ${narrated ? 'narrated' : 'plain'}`, r[door], born));
    }
    expect(bad, `${bad.length} sends`).toEqual([]);
  }, ARM_TIMEOUT_MS);

  it('COVERT-FROZEN the tip-made copy (this tree\'s galleryPayloadFor): neither the covert copy nor its phrasing at any door (PLAIN and NARRATED)', async () => {
    const born = bornTown(); const copy = freeze(born, 'tip');
    const bad = [];
    for (const narrated of [false, true]) {
      const r = await readsOf({ live: born, copy, narrated });
      for (const door of DOORS) bad.push(...sends(`${door} | tip copy | ${narrated ? 'narrated' : 'plain'}`, r[door], born));
    }
    expect(bad, `${bad.length} sends`).toEqual([]);
  }, ARM_TIMEOUT_MS);

  for (const how of ['deleted', 'renamed']) {
    it(`COVERT-FROZEN THE DRIFT (${how}): frozen by master's path, THEN the live row's covert tie ${how === 'deleted' ? 'deleted' : 'has one end renamed'}: the covert copy is not served at the gallery read, the import, the map member or the map import (the orphan rule (c) alone stands); the sentence is RECORDED (its rule is the chair's: PS-RULE)`, async () => {
      const born = bornTown(); const copy = freeze(born, 'master');
      const r = await readsOf({ live: drift(born, how), copy });
      const bad = [];
      for (const door of COPY_DOORS) bad.push(...sends(`${door} | drift ${how}`, r[door], born, { pr: true, ps: false }));
      console.log(`COVERT-FROZEN-DRIFT ${how}: ${DOORS.map((d) => `${d} ${keysOf(r[d])}`).join(' | ')}`);
      expect(bad, `${bad.length} sends`).toEqual([]);
    }, ARM_TIMEOUT_MS);
  }

  it('COVERT-FROZEN THE TOOTH: a town with no covert tie, frozen by master\'s path and by the tip\'s, and live: its prominentRelationship (the open tie\'s copy) and its sentence are served as stored at every door', async () => {
    const born = bornTown({ open: true });
    const bad = [];
    for (const copy of [freeze(born, 'master'), freeze(born, 'tip'), null]) {
      const r = await readsOf({ live: born, copy });
      for (const door of DOORS) {
        if (J(r[door]?.prominentRelationship) !== J(born.prominentRelationship)) bad.push(`${door} | ${copy ? 'copy' : 'live'}: prominentRelationship is ${JSON.stringify(r[door]?.prominentRelationship)}`);
        if (r[door]?.pressureSentence !== born.pressureSentence) bad.push(`${door} | ${copy ? 'copy' : 'live'}: pressureSentence is ${JSON.stringify(r[door]?.pressureSentence)}`);
      }
    }
    expect(bad, `${bad.length} losses`).toEqual([]);
  }, ARM_TIMEOUT_MS);

  it('COVERT-FROZEN THE TWIN, rule for rule (withholdCovertCopies with the live stored rows): over the master-made copy it withholds both strings; over the drifted rows the copy; over the tooth neither', () => {
    const born = bornTown();
    const copy = freeze(born, 'master');
    const twin = (src, lives) => keysOf(homes.withholdCovertCopies({ name: src.name, prominentRelationship: clone(src.prominentRelationship), pressureSentence: src.pressureSentence }, clone(src), false, lives.map(clone)));
    expect(twin(copy, [born])).toBe('neither');
    expect(twin(copy, [drift(born, 'deleted')])).not.toMatch(/prominentRelationship/);
    expect(twin(copy, [drift(born, 'renamed')])).not.toMatch(/prominentRelationship/);
    const open = bornTown({ open: true });
    expect(twin(freeze(open, 'master'), [open])).toBe('prominentRelationship+pressureSentence');
  });
});
