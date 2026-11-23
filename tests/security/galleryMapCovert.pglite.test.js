/**
 * galleryMapCovert.pglite.test.js — MAP-COVERT, RED FIRST (VEIL-44's MAPCOVERT-RED; the unit IMPORT-DOOR's first red; chain B's
 * U-UNMARKED, lane/veil-42-2026-11-23-meas-wip eb0c60920, docs/chair/2026-11-20/veil/out/v42/meas/U-UNMARKED.md).
 *
 * THE FAULT. 211 :: get_gallery_map builds each member's `settlement` as
 * `coalesce(_gallery_veil(pub.j, s.gallery_member_overrides, false) -> 'body', pub.j)` over
 * `pub.j = _gallery_sanitize_public_json(src.j)` and never runs 212 :: _gallery_apply_member_overrides, the one home of the
 * covert CASE (VEIL-13 ruling (5): prominentRelationship WHOLE where it is the copy of a tie the public sanitiser drops as
 * `covert: true`; pressureSentence where it tells one). The gallery read, the party link and the import each run it.
 * 072 :: import_gallery_map returns get_gallery_map's payload. So at Reveal off a covert tie's copy is served on the map
 * member and on the map's import, on every marker.
 *
 * THE ARMS (each at Reveal OFF, on three markers: unmarked `{}`, the default `writeShareVeil({}, [])` (src/lib/gallery.js
 * takes it from galleryVeil.js), and a HAND marker as chain B's um.probe.jsx builds its `hand`: the owner's hand opening
 * the three criminal groupings and the plot-hooks tab), the town put on a shared `map_with_campaign` map (a saved_maps row
 * with gallery_share_campaign, campaign.settlementIds holding the town, the 046 owner guard satisfied: one owner):
 *   (c) THE CONTROL   get_gallery_dossier(slug).data: neither the covert copy nor the covert-telling sentence, nor any
 *                     marked tag of the covert tie; a person of the town still arrives. GREEN at 23bb8b8ae.
 *   (a)               get_gallery_map(slug) members[0].settlement, read as a visitor: the same, and the two keys present or
 *                     absent EXACTLY as on (c). RED at 23bb8b8ae (the fault).
 *   (b)               import_gallery_map(slug) members[0].settlement, read as a signed-in reader (072's gate): the same. RED.
 *   THE TOOTH         a town with NO covert tie serves its prominentRelationship on all three doors (a member that drops the
 *                     key always does not pass (a) or (b)).
 *   CHAIN B'S PLACES  r3m-town-wartime-0-29 and r3m-city-none-1-107 (their stored prominentRelationship a covert tie's copy),
 *                     born as the tell gate births its 140 (docs/chair/2026-11-20/veil/out/v27/tell/measure/tell-common.mjs ::
 *                     loadEngine's birth: DEFAULT_CONFIG and the dials, the size and the crisis; generateSettlementPipeline
 *                     over birthConfig; publicProse composed) and stored as src/lib/saves.js :: supabaseSave stores a
 *                     document (withNeighbourNetworkFromRelationship, a no-op without a neighbour, then withPublicProse):
 *                     (c) GREEN, (a) and (b) RED.
 *   REVEAL DM         read and RECORDED (printed, `MAPCOVERT-DM`), not ruled: what the cured map member serves at Reveal DM is
 *                     the build's ruling.
 * The covert copy of a born place is decided by the twin's own rule (gallerySecondHomes.js :: withholdCovertCopies over the
 * stored copy and sentence, against the stored document, shareDm false), as um.probe.jsx decides it.
 */
import { describe, it, expect, beforeAll, vi } from 'vitest';
import { PGlite } from '@electric-sql/pglite';
import { pgcrypto } from '@electric-sql/pglite/contrib/pgcrypto';
import { readFileSync, readdirSync, writeFileSync, mkdirSync } from 'node:fs';
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

/** The owner's hand in chain B's um.probe.jsx (tell-common.mjs :: OPEN, AT; loadVeil's write of settings().deltas.own). */
const HAND_OPEN = ['block:services.criminal', 'block:defense.criminalStructure', 'block:power.criminalUnderside', 'tab:plot_hooks'];
const HAND_AT = { mode: 'live', at: '2026-11-01T00:00:00.000Z' };
const MARKERS = ['unmarked', 'default', 'hand'];
/** Chain B's two places (U-UNMARKED: their stored prominentRelationship is a covert tie's copy), as the tell gate seeds them. */
const PLACES = [{ seed: 'r3m-town-wartime-0-29', size: 'town', crisis: 'wartime' }, { seed: 'r3m-city-none-1-107', size: 'city', crisis: 'none' }];
const DIALS = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };

/**
 * The ruling-5 block's town-g shape (galleryVeilHandRows.pglite.test.js :: covertTown): an open tie (Orrin Vale and the
 * first end) and a covert tie between `a` and `b` whose description, tension and phrasing carry `${tag}1` to `${tag}3`;
 * prominentRelationship the covert tie's copy; the pressure sentence the phrasing (it names both ends: it tells the tie).
 */
function covertTown(tag, a, b, { rels, prominent, pressure } = {}) {
  const d = `${tag}1 the two of them meet in the salt cellar at night`;
  const t = `${tag}2 if the council learns of it both hang`;
  const open = { id: 'tie.orrin-a', from: 'npc.orrin', to: 'npc.a', npc1Name: 'Orrin Vale', npc2Name: a, type: 'rival', typeName: 'Rivals', description: 'They split the docks.' };
  const covert = { id: 'tie.a-b', from: 'npc.a', to: 'npc.b', npc1Name: a, npc2Name: b, type: 'lover', typeName: 'Secret lovers', description: d, tension: t, covert: true };
  const phrasing = `${tag}3 they say ${a} and ${b} meet at night`;
  return { name: `Saltmere ${tag}`, tier: 'town', institutions: [{ name: 'Fish market', category: 'Economy', desc: 'Fish.' }],
    npcs: [{ id: 'npc.orrin', name: 'Orrin Vale', role: 'Guildmaster' }, { id: 'npc.a', name: a, role: 'Fence' }, { id: 'npc.b', name: b, role: 'Smith' }],
    relationships: rels ? rels(open, covert) : [open, covert],
    prominentRelationship: prominent ?? { npc1: a, npc2: b, type: 'Secret lovers', phrasing, full: d, tension: t },
    pressureSentence: pressure ?? phrasing };
}
const OPEN_COPY = { npc1: 'Orrin Vale', npc2: 'Mira Vane', type: 'Rivals', full: 'They split the docks.', phrasing: 'Orrin Vale and Mira Vane split the docks.' };
/** The plant: the covert tie's copy prominent, its phrasing the pressure sentence. */
const PLANT = () => covertTown('mapcov', 'Mira Vane', 'Tam Reed');
const PLANT_TAGS = ['mapcov1', 'mapcov2', 'mapcov3'];
/** THE TOOTH: no covert tie at all; the open tie's copy prominent. */
const TOOTH = () => covertTown('mapopen', 'Mira Vane', 'Tam Reed', { rels: (o) => [o], prominent: OPEN_COPY, pressure: 'The quay is quiet this season.' });

describe('MAP-COVERT: the map member and the map import serve no covert tie\'s copy at Reveal off (VEIL-44, MAPCOVERT-RED; VEIL-13 ruling (5))', () => {
  /** @type {PGlite} */ let db;
  let veil; let homes;
  /** @type {Map<string, any>} */ const born = new Map();
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
      insert into public.profiles (id) values ('${OWNER}'), ('${READER}') on conflict do nothing;`);
    veil = await import('../../src/domain/display/galleryVeil.js');
    homes = await import('../../src/domain/display/gallerySecondHomes.js');
    // CHAIN B'S PLACES, born as the tell gate births them (tell-common.mjs :: loadEngine's birth, no house dropped) and
    // stored as supabaseSave stores a document
    const { generateSettlementPipeline } = await import('../../src/generators/generateSettlementPipeline.js');
    const { birthConfig, loadGenerationLawPayloads } = await import('../../src/domain/density/densityCreateBoundary.js');
    const { DEFAULT_CONFIG } = await import('../../src/store/configSlice.js');
    const { composePublicProse } = await import('../../src/components/new/publicProseCompose.js');
    const { withPublicProse } = await import('../../src/domain/display/publicProse.js');
    await loadGenerationLawPayloads();
    for (const p of PLACES) {
      const cfg = { ...DEFAULT_CONFIG, ...DIALS, settType: p.size, ...(p.crisis !== 'none' ? { selectedStresses: [p.crisis], selectedStressesRandom: false } : {}) };
      let t = generateSettlementPipeline(birthConfig(cfg), null, { seed: p.seed, customContent: {} });
      t = { ...t }; delete t.publicProse; t = withPublicProse(t, composePublicProse(t));
      born.set(p.seed, clone(t));
    }
    if (process.env.MAPCOVERT_BIRTH_OUT) {
      mkdirSync(process.env.MAPCOVERT_BIRTH_OUT, { recursive: true });
      for (const [seed, doc] of born) writeFileSync(join(process.env.MAPCOVERT_BIRTH_OUT, `${seed}.json`), JSON.stringify(doc));
    }
  }, PGLITE_BOOT_TIMEOUT_MS);

  const markerOf = (name) => (name === 'unmarked' ? {}
    : name === 'default' ? veil.writeShareVeil({}, [])
      : veil.writeShareVeil({}, HAND_OPEN.map((address) => ({ address, hidden: false })), HAND_AT));

  /**
   * One share of `town` under the marker, Reveal DM `dm`, on its own map_with_campaign map (one owner: the 046 guard), read
   * by the three doors: { gallery: get_gallery_dossier data, map: get_gallery_map's member, mapImport: import_gallery_map's
   * member (a signed-in reader) } and how many members each map door handed.
   */
  async function readsOf(key, town, marker, dm) {
    const k = `${key}|${marker}|${dm}`;
    if (memo.has(k)) return memo.get(k);
    seq += 1;
    const slug = `mapcov${seq}`;
    const id = (await db.query(`insert into public.settlements (id,user_id,name,tier,data,is_public,public_slug,published_at,unlisted_slug,visibility,gallery_member_overrides,gallery_share_dm,gallery_importable)
      values (gen_random_uuid(), $1, $2, 'town', $3::jsonb, true, $4, now(), $5, 'unlisted', $6::jsonb, $7, true) returning id::text as id`,
    [OWNER, town.name || 'x', JSON.stringify(town), slug, `${slug}-l`, JSON.stringify(markerOf(marker)), dm])).rows[0].id;
    await db.query(`insert into public.saved_maps (id, user_id, name, map_data, is_public, public_slug, share_kind, gallery_share_campaign, gallery_importable, unlisted_slug, visibility)
      values (gen_random_uuid(), $1, 'map', $2::jsonb, true, $3, 'map_with_campaign', true, true, $4, 'public')`, [OWNER, JSON.stringify({ campaign: { settlementIds: [id] } }), `${slug}-m`, `${slug}-mu`]);
    await db.exec(`set test.uid = '';`);
    const gallery = (await db.query(`select to_jsonb(g.data) as d from public.get_gallery_dossier($1) g`, [slug])).rows[0]?.d;
    const map = (await db.query(`select public.get_gallery_map($1) as x`, [`${slug}-m`])).rows[0]?.x;
    await db.exec(`set test.uid = '${READER}';`);
    const mapImport = (await db.query(`select public.import_gallery_map($1) as x`, [`${slug}-m`])).rows[0]?.x;
    await db.exec(`set test.uid = '';`);
    const members = (m) => (isRec(m) && Array.isArray(m.members) ? m.members : []);
    const out = { gallery, map: members(map)[0]?.settlement, mapImport: members(mapImport)[0]?.settlement,
      counts: { map: members(map).length, mapImport: members(mapImport).length } };
    memo.set(k, out);
    return out;
  }

  /** What the twin's rule takes from a stored document at Reveal off: { pr, ps } (the covert copy, the covert-telling sentence). */
  const covertOf = (town) => {
    const probe = homes.withholdCovertCopies({ prominentRelationship: town.prominentRelationship, pressureSentence: town.pressureSentence }, town, false);
    return { pr: isRec(town.prominentRelationship) && !('prominentRelationship' in probe), ps: typeof town.pressureSentence === 'string' && !('pressureSentence' in probe) };
  };
  /** The sends on one door: the covert copy, the covert-telling sentence, a tag of the covert tie; and the person must still arrive. */
  const sendsOf = (what, doc, town, cov, tags, person) => {
    const bad = [];
    if (!isRec(doc)) return [`${what}: no document (${JSON.stringify(doc)})`];
    if (cov.pr && J(doc.prominentRelationship) === J(town.prominentRelationship)) bad.push(`${what}: prominentRelationship is the covert copy: ${JSON.stringify(doc.prominentRelationship).slice(0, 90)}`);
    if (cov.ps && doc.pressureSentence === town.pressureSentence) bad.push(`${what}: pressureSentence tells the covert tie: ${JSON.stringify(doc.pressureSentence).slice(0, 90)}`);
    for (const n of tags) bad.push(...arrivals(doc, n).map((a) => `${what}: ${n} arrives: ${a}`));
    if (!leaves(doc).some((l) => l.kind === 'value' && l.text === person)) bad.push(`${what}: the person ${person} is gone`);
    return bad;
  };
  /** The keys on a map door present or absent EXACTLY as on the gallery read. */
  const keysAsGallery = (what, doc, gallery) => ['prominentRelationship', 'pressureSentence']
    .filter((key) => isRec(doc) && isRec(gallery) && (key in doc) !== (key in gallery))
    .map((key) => `${what}: ${key} is ${key in doc ? 'present' : 'absent'} on the map door, ${key in gallery ? 'present' : 'absent'} on the gallery read`);
  /** The covert tie's own strings of a born place (its description and tension), the tags a hand plant carries in its marks. */
  const bornTags = (town) => {
    const pr = town.prominentRelationship;
    return [...new Set([pr?.full, pr?.tension].filter((s) => typeof s === 'string' && s.length >= 12))];
  };
  const personOf = (town) => (Array.isArray(town.npcs) ? town.npcs.find((n) => isRec(n) && typeof n.name === 'string' && n.name)?.name : undefined);

  // ── THE PLANT (hand) ────────────────────────────────────────────────────────────────────────────────────────────────
  it('MAP-COVERT (c) THE CONTROL: the gallery read (get_gallery_dossier data) of a hand town whose prominentRelationship is a covert tie\'s copy and whose pressureSentence tells it serves neither, nor a tag of the covert tie, at Reveal off on the three markers (unmarked, the default writeShareVeil({}, []), a hand marker)', async () => {
    const town = PLANT(); const cov = covertOf(town);
    expect(cov).toEqual({ pr: true, ps: true });
    const bad = [];
    for (const m of MARKERS) bad.push(...sendsOf(`gallery | ${m} | off`, (await readsOf('plant', town, m, false)).gallery, town, cov, PLANT_TAGS, 'Mira Vane'));
    expect(bad, `${bad.length} sends`).toEqual([]);
  }, ARM_TIMEOUT_MS);

  it('MAP-COVERT (a): get_gallery_map\'s member (members[0].settlement, a visitor) of that hand town serves neither the covert copy nor the covert-telling sentence, nor a tag of the covert tie, and the two keys present or absent exactly as on the gallery read, at Reveal off on the three markers', async () => {
    const town = PLANT(); const cov = covertOf(town);
    const bad = [];
    for (const m of MARKERS) {
      const r = await readsOf('plant', town, m, false);
      if (r.counts.map !== 1) bad.push(`map | ${m} | off: ${r.counts.map} members`);
      bad.push(...sendsOf(`map member | ${m} | off`, r.map, town, cov, PLANT_TAGS, 'Mira Vane'), ...keysAsGallery(`map member | ${m} | off`, r.map, r.gallery));
    }
    expect(bad, `${bad.length} sends`).toEqual([]);
  }, ARM_TIMEOUT_MS);

  it('MAP-COVERT (b): import_gallery_map\'s member (members[0].settlement, a signed-in reader) of that hand town serves neither the covert copy nor the covert-telling sentence, nor a tag of the covert tie, and the two keys present or absent exactly as on the gallery read, at Reveal off on the three markers', async () => {
    const town = PLANT(); const cov = covertOf(town);
    const bad = [];
    for (const m of MARKERS) {
      const r = await readsOf('plant', town, m, false);
      if (r.counts.mapImport !== 1) bad.push(`map import | ${m} | off: ${r.counts.mapImport} members`);
      bad.push(...sendsOf(`map import | ${m} | off`, r.mapImport, town, cov, PLANT_TAGS, 'Mira Vane'), ...keysAsGallery(`map import | ${m} | off`, r.mapImport, r.gallery));
    }
    expect(bad, `${bad.length} sends`).toEqual([]);
  }, ARM_TIMEOUT_MS);

  it('MAP-COVERT THE TOOTH: a hand town with no covert tie serves its prominentRelationship, as stored, on the gallery read, the map member and the map import, at Reveal off on the three markers', async () => {
    const town = TOOTH();
    expect(covertOf(town)).toEqual({ pr: false, ps: false });
    const bad = [];
    for (const m of MARKERS) {
      const r = await readsOf('tooth', town, m, false);
      for (const door of ['gallery', 'map', 'mapImport']) {
        if (J(r[door]?.prominentRelationship) !== J(town.prominentRelationship)) bad.push(`${door} | ${m} | off: prominentRelationship is ${JSON.stringify(r[door]?.prominentRelationship)}`);
      }
    }
    expect(bad, `${bad.length} losses`).toEqual([]);
  }, ARM_TIMEOUT_MS);

  // ── CHAIN B'S TWO PLACES (born) ─────────────────────────────────────────────────────────────────────────────────────
  it('MAP-COVERT (c) THE CONTROL on chain B\'s two places (r3m-town-wartime-0-29, r3m-city-none-1-107; born by the app\'s pipeline, stored as the save stores them): each stored prominentRelationship is a covert tie\'s copy, and the gallery read serves neither it nor a covert-telling sentence, nor the copy\'s full or tension, at Reveal off on the three markers', async () => {
    const bad = [];
    for (const p of PLACES) {
      const town = born.get(p.seed);
      expect(town?.neighborRelationship?.name ?? null).toBe(null); // the save's neighbour step is a no-op on this document
      const cov = covertOf(town);
      expect([p.seed, cov.pr]).toEqual([p.seed, true]);
      for (const m of MARKERS) bad.push(...sendsOf(`${p.seed} | gallery | ${m} | off`, (await readsOf(p.seed, town, m, false)).gallery, town, cov, bornTags(town), personOf(town)));
    }
    expect(bad, `${bad.length} sends`).toEqual([]);
  }, ARM_TIMEOUT_MS);

  it('MAP-COVERT (a) and (b) on chain B\'s two places: get_gallery_map\'s member and import_gallery_map\'s member serve neither the stored covert copy nor a covert-telling sentence, nor the copy\'s full or tension, and the two keys present or absent exactly as on the gallery read, at Reveal off on the three markers', async () => {
    const bad = [];
    for (const p of PLACES) {
      const town = born.get(p.seed); const cov = covertOf(town);
      for (const m of MARKERS) {
        const r = await readsOf(p.seed, town, m, false);
        for (const [door, label] of [['map', 'map member'], ['mapImport', 'map import']]) {
          if (r.counts[door] !== 1) bad.push(`${p.seed} | ${label} | ${m} | off: ${r.counts[door]} members`);
          bad.push(...sendsOf(`${p.seed} | ${label} | ${m} | off`, r[door], town, cov, bornTags(town), personOf(town)), ...keysAsGallery(`${p.seed} | ${label} | ${m} | off`, r[door], r.gallery));
        }
      }
    }
    expect(bad, `${bad.length} sends`).toEqual([]);
  }, ARM_TIMEOUT_MS);

  // ── REVEAL DM: RECORDED, NOT RULED ──────────────────────────────────────────────────────────────────────────────────
  it('MAP-COVERT REVEAL DM, RECORDED NOT RULED: each door hands a document at Reveal DM on the three markers (the hand plant and chain B\'s two places); what each serves of the covert copy and sentence is printed (MAPCOVERT-DM), the build\'s to rule', async () => {
    const rows = []; const missing = [];
    for (const [key, town] of [['plant', PLANT()], ...PLACES.map((p) => [p.seed, born.get(p.seed)])]) {
      for (const m of MARKERS) {
        const r = await readsOf(key, town, m, true);
        for (const door of ['gallery', 'map', 'mapImport']) {
          const doc = r[door];
          if (!isRec(doc)) { missing.push(`${key} | ${door} | ${m} | DM`); continue; }
          const pr = !('prominentRelationship' in doc) ? 'absent' : J(doc.prominentRelationship) === J(town.prominentRelationship) ? 'the stored copy' : 'another';
          const ps = !('pressureSentence' in doc) ? 'absent' : doc.pressureSentence === town.pressureSentence ? 'the stored sentence' : 'another';
          rows.push(`MAPCOVERT-DM ${key} | ${door} | ${m} | DM | prominentRelationship: ${pr} | pressureSentence: ${ps}`);
        }
      }
    }
    console.log(rows.join('\n'));
    expect(missing).toEqual([]);
    expect(rows.length).toBe(27);
  }, ARM_TIMEOUT_MS);
});
