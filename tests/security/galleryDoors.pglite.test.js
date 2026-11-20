/**
 * galleryDoors.pglite.test.js — THE DOORS BESIDE `data` (VEIL-DOORS; REVIEW-VEIL-10's V10-1, V10-3, V10-4; the seventh
 * chair's rulings VR19 to VR23).
 *
 * Sixteen builders and nine readers checked the main document. A non-owner read returns more than `data`: the event
 * chronicle (migration 032), the tile columns every list, filter, sort and count reads (migration 147), a campaign map's
 * members. Each arm stores a town on a chain of every migration on disk and reads it as a visitor would.
 *
 * THE ARMS (each red at bedd5a392, the commit before the cure):
 *   V10-1 THE CHRONICLE DOOR (VR20 (B), VR21): an entry that names a house hidden whole, a covert act with a criminal
 *         grouping shut, an event type no rule knows: withheld whole on the gallery read and on a map's member; what is
 *         open arrives; the newest fifty are taken over what is SERVED; no entry carries an id (a flavor id holds the
 *         log's length when it was written: a counter taken before the removal).
 *   V10-3 THE TILE DOOR (VR19, VR22): on a marked share the stability tile is its band word alone, everywhere a visitor
 *         reads it (the dossier's column, the list's tile); prosperity is its stored band (VR28 tier 2); a
 *         tile that holds a hideable house's name is sent by none; the closed answer sends no tile beside the name; an
 *         unmarked listed page is unchanged (VR23, R4).
 *   V10-4 THE MAP MEMBER (VR23): a member with no veil of its own takes the default veil.
 *   THE TILE ROWS ARE NO DOOR OF THEIR OWN: with Supabase's default privileges, _gallery_public_tile_rows() is callable
 *         by no visitor.
 *   VR23 ON THE BROWSER'S IMPORT PATH (VEIL-DOORS-2, item 4; red at bedd5a392): the campaign map import the browser runs
 *         (src/store/galleryImportMap.js :: importGalleryMapWithCampaignImpl -> src/lib/gallery.js :: fetchGalleryMap ->
 *         get_gallery_map; import_gallery_map(text) has no caller in src/, api/, scripts/ or supabase/functions/) lands a
 *         member with no veil of its own DEFAULT-VEILED in the importer's own record.
 *   SNAPSHOT MODE (VEIL-DOORS-2, item 6; red at eafece56a): a frozen share's chronicle keeps the entries up to the
 *         freeze, and its name, tier and time are the copy's, on the gallery read, the list, a map's member and the import.
 *   THE ONE-ROW READ (VEIL-DOORS-2; the chair's condition (a), red at cca49cb8d): the dossier read takes its own row's
 *         tiles by the one tile rule (_gallery_doors_tiles), never the tile rows of every public row; every row and tile
 *         column it sends equals the list's row (the cost rows are in VEIL-DOORS-2-HANDBACK.md).
 *   VR40 A SHARED MAP'S WORLD SENDS NO CHRONICLE (VEIL-DOORS-3, part (2); red at 4274504b8): a stored world snapshot that
 *         holds a chronicle (planted past 091's guard, as a test may: what a row may already hold) is served by neither
 *         get_gallery_map nor get_unlisted_map, its other sections are, its section list loses the key, a stored snapshot
 *         that is not an object is served as none; the twin (publicWorld, publicWorldSections) agrees. Part (1), the
 *         share editor and publish_map on a born world, is tests/security/galleryWorldShare.pglite.test.jsx.
 */
import { describe, it, expect, beforeAll, vi } from 'vitest';
import { PGlite } from '@electric-sql/pglite';
import { pgcrypto } from '@electric-sql/pglite/contrib/pgcrypto';
import { readFileSync, readdirSync } from 'node:fs';
import { resolve, join } from 'node:path';

const PGLITE_BOOT_TIMEOUT_MS = 900_000; // deadlock guard, not a perf budget — never tune to a measured boot (see pgliteHookTimeoutRatchet.test.js)
const ARM_TIMEOUT_MS = 600_000;

// THE BROWSER'S PATH (VEIL-DOORS-2, item 4): the client's rpc runs the named function on this chain as a signed-in
// visitor (the one arm that sets ROUTE.db), and the importer's save is captured, never written.
const ROUTE = vi.hoisted(() => ({ db: null, uid: null, saved: [] }));
vi.mock('../../src/lib/supabase.js', () => {
  const supabase = {
    rpc: async (name, args = {}) => {
      if (!ROUTE.db) return { data: null, error: null };
      try {
        await ROUTE.db.exec(`set role authenticated; set test.uid = '${ROUTE.uid}';`);
        const keys = Object.keys(args);
        const r = await ROUTE.db.query(`select public.${name}(${keys.map((k, i) => `${k} => $${i + 1}`).join(', ')}) as out`, keys.map((k) => args[k]));
        return { data: r.rows[0]?.out ?? null, error: null };
      } catch (e) { return { data: null, error: { message: String(e?.message || e) } }; } finally { await ROUTE.db.exec('reset role; reset test.uid;'); }
    },
  };
  return { supabase, isConfigured: true, default: supabase };
});
vi.mock('../../src/lib/saves.js', () => {
  const ok = async () => ({});
  return { saves: { save: async (entry) => { ROUTE.saved.push(entry); return `import_${ROUTE.saved.length}`; }, update: ok, delete: ok } };
});

const MIGRATIONS = resolve(process.cwd(), 'supabase', 'migrations');
const OWNER = '11111111-1111-1111-1111-111111111111';
const READER = '22222222-2222-2222-2222-222222222222';
// The hand-rows harness's scaffold, and SUPABASE'S DEFAULT PRIVILEGES: a function created in public is executable by
// anon and authenticated unless a migration revokes it from them by name (`revoke ... from public` does not).
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
    alter default privileges in schema public grant execute on functions to anon, authenticated, service_role;
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
const squeeze = (t) => String(t).toLowerCase().replace(/[^\p{L}\p{N}]+/gu, '');
/** Every key and string value of a document. */
function leaves(v, path = '$', acc = []) {
  if (typeof v === 'string') acc.push({ path, text: v });
  else if (Array.isArray(v)) v.forEach((x, i) => leaves(x, `${path}[${i}]`, acc));
  else if (isRec(v)) for (const [k, x] of Object.entries(v)) { acc.push({ path: `${path}.${k}`, text: k }); leaves(x, `${path}.${k}`, acc); }
  return acc;
}
/** Where a needle arrives, as written or squeezed. */
/** A JSON value with its keys in one order (jsonb keeps its own). */
const canon = (v) => JSON.stringify(v, (k, x) => (isRec(x) ? Object.fromEntries(Object.keys(x).sort().map(key => [key, x[key]])) : x));
const arrivals = (doc, needle) => leaves(doc).filter(({ text }) => squeeze(text).includes(squeeze(needle))).map(({ path, text }) => `${path} = ${JSON.stringify(text.slice(0, 70))}`);

// THE TOWN: a Black market (Criminal: hidden whole by the default veil), an open Mill, a person of each, and the
// stability label the engine writes where organised crime dominates.
const BLACK = { id: 'inst_black', name: 'Black market', category: 'Criminal', catalogId: 'black_market', description: 'Stolen goods change hands.' };
const MILL = { id: 'inst_mill', name: 'Mill', category: 'Economy', catalogId: 'mill', description: 'Grinds the grain.' };
const town = (extra = {}) => ({
  name: 'Rookford', tier: 'town', population: 1800,
  config: { terrainType: 'riverlands', magicLevel: 'low', nearbyResources: ['grain'], culture: 'germanic' },
  institutions: [BLACK, MILL],
  npcs: [{ id: 'npc_vess', name: 'Vess', role: 'Miller', institution: 'Mill' }],
  powerStructure: { stability: 'Unstable (pervasive organized crime)', government: 'Merchant oligarchy', factions: [{ faction: 'The Millers', power: 40 }] },
  economicState: { prosperity: 'Comfortable' },
  threatProfile: { level: 'Moderate' },
  ...extra,
});
// THE LOG: what the app's writers put in campaign_state.eventLog (applyEvent's entries, a flavor row, a settlement rename).
const entry = (type, summary, extra = {}) => ({ event: { id: `ev-${type}-${summary.length}`, type, targetId: extra.targetId || null, payload: extra.payload || {}, cause: 'authoring' },
  appliedAt: extra.at || '2026-11-01T10:00:00.000Z', narrativeSummary: summary, beforeState: { stability: 50 }, ...extra.top });
const LOG = [
  entry('ADD_INSTITUTION', 'A new Black market was established.', { targetId: 'institution.black_market', at: '2026-11-01T10:00:00.000Z' }),
  entry('IMPOSE_CORRUPTION', 'Mill has been turned by the Smuggling network. Corruption takes root in the shadows.', { targetId: 'institution.mill', payload: { criminalInstitution: 'Smuggling network' }, at: '2026-11-01T10:01:00.000Z' }),
  entry('ADD_INSTITUTION', 'A new Mill was established.', { targetId: 'institution.mill', at: '2026-11-01T10:02:00.000Z' }),
  entry('ADD_NPC', 'Vess arrived as Fence at the stall.', { targetId: 'npc.vess', payload: { role: 'Fence', institution: 'Black market' }, at: '2026-11-01T10:03:00.000Z' }),
  entry('MYSTERY_EVENT', 'Something nobody classed happened.', { at: '2026-11-01T10:04:00.000Z' }),
  { id: 'flavor.TABLE_INCIDENT.1762000000000.5', type: 'TABLE_INCIDENT', targetId: null, timestamp: '2026-11-01T10:05:00.000Z', source: 'table', narrativeSummary: 'The party drank at the black-market tavern.', flavor: true },
  { id: 'rename.aaaa.1762000000000', type: 'RENAME_SETTLEMENT', targetId: 'Rookhold', timestamp: '2026-11-01T10:06:00.000Z', narrativeSummary: 'Rookhold is now known as Rookford.', flavor: true },
];
const OPEN_SUMMARIES = ['A new Mill was established.', 'Rookhold is now known as Rookford.'];

describe('VEIL-DOORS: the doors beside data (REVIEW-VEIL-10, V10-1, V10-3, V10-4)', () => {
  /** @type {PGlite} */ let db;
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
  }, PGLITE_BOOT_TIMEOUT_MS);

  const VEIL = (deltas = []) => ({ $veil: { v: 1, mode: 'live', at: '2026-11-01T00:00:00.000Z', deltas } });
  /** Store one town as a public gallery row; returns its slug and id. */
  async function store(data, { overrides = {}, dm = false, log = null, isPublic = true } = {}) {
    seq += 1;
    const id = `d0000000-0000-0000-0000-${String(seq).padStart(12, '0')}`;
    await db.query(`insert into public.settlements (id,user_id,name,tier,data,is_public,public_slug,published_at,gallery_member_overrides,gallery_share_dm,gallery_importable,campaign_state,gallery_facet_prosperity,access_state)
      values ($1,$2,$3,'town',$4::jsonb,$5,$6,now() - ($7 || ' seconds')::interval,$8::jsonb,$9,true,$10::jsonb,$11,'active')`,
    [id, OWNER, data.name || 'x', JSON.stringify(data), isPublic, `door${seq}`, String(seq), JSON.stringify(overrides), dm,
      JSON.stringify(log ? { eventLog: log } : {}), data?.economicState?.prosperity || null]);
    return { slug: `door${seq}`, id };
  }
  const dossier = async (slug) => (await db.query('select * from public.get_gallery_dossier($1)', [slug])).rows[0];
  const listed = async (filters = {}, search = '') => (await db.query(`select * from public.list_gallery_dossiers(0, 60, 'newest', $1, $2::jsonb, false)`, [search, JSON.stringify(filters)])).rows;
  async function mapOf(memberIds) {
    seq += 1;
    await db.query(`insert into public.saved_maps (id,user_id,name,map_data,is_public,public_slug,share_kind,gallery_share_campaign)
      values (gen_random_uuid(),$1,'Realm',$2::jsonb,true,$3,'map_with_campaign',true)`, [OWNER, JSON.stringify({ campaign: { settlementIds: memberIds } }), `realm${seq}`]);
    return (await db.query('select public.get_gallery_map($1) as m', [`realm${seq}`])).rows[0].m;
  }

  it('V10-1 THE CHRONICLE DOOR: on a marked share an entry naming a house hidden whole (summary, target or payload), a covert act with a criminal grouping shut and an unclassed type are withheld whole, on the gallery read and a map\'s member; open entries arrive; no entry carries an id; an unmarked listed page keeps its chronicle as 032 sends it', async () => {
    const leaksOf = (chron) => [...arrivals(chron, 'Black market'), ...arrivals(chron, 'black-market'), ...arrivals(chron, 'Smuggling'),
      ...leaves(chron).filter(l => /IMPOSE_CORRUPTION|MYSTERY_EVENT/.test(l.text)).map(l => l.path)];
    for (const dm of [false, true]) {
      const marked = await store(town(), { overrides: VEIL(), dm, log: LOG });
      const g = await dossier(marked.slug);
      expect(arrivals(g.data, 'Black market'), 'the house itself is hidden by the default veil').toEqual([]);
      expect(leaksOf(g.chronicle), `gallery read, Reveal DM ${dm}`).toEqual([]);
      const summaries = (g.chronicle || []).map(e => e.narrativeSummary);
      for (const s of OPEN_SUMMARIES) expect(summaries, `an open entry arrives (Reveal DM ${dm})`).toContain(s);
      expect(leaves(g.chronicle).filter(l => /\.id$/.test(l.path)), 'no entry id: a flavor id holds the log\'s length').toEqual([]);
    }
    // a map's member, marked: the same rule
    const member = await store(town(), { overrides: VEIL(), log: LOG, isPublic: false });
    const m = await mapOf([member.id]);
    expect(leaksOf(m.members[0].chronicle), 'map member').toEqual([]);
    // an unmarked listed page: as 032 sends it (VR23: R4's sparing untouched)
    const unmarked = await store(town(), { overrides: {}, log: LOG });
    const u = await dossier(unmarked.slug);
    expect((u.chronicle || []).length).toBe(LOG.length);
  }, ARM_TIMEOUT_MS);

  it('V10-1 / VR21 THE NEWEST FIFTY OF THE SERVED: a log of 70 entries whose newest five name the hidden house serves fifty, none of them withheld ones', async () => {
    const log = [];
    for (let i = 0; i < 70; i += 1) {
      const t = `2026-11-0${1 + Math.floor(i / 24)}T${String(i % 24).padStart(2, '0')}:00:00.000Z`;
      log.push(i >= 65 ? entry('ADD_INSTITUTION', `A new Black market was established (${i}).`, { at: t }) : entry('ADD_INSTITUTION', `A new Mill was established (${i}).`, { at: t }));
    }
    const marked = await store(town(), { overrides: VEIL(), log });
    const g = await dossier(marked.slug);
    expect(arrivals(g.chronicle, 'Black market')).toEqual([]);
    expect((g.chronicle || []).length, 'fifty served: the window is taken after the removal').toBe(50);
    expect(g.chronicle[49].narrativeSummary).toBe('A new Mill was established (64).');
  }, ARM_TIMEOUT_MS);

  it('V10-3 THE TILE DOOR: on a marked share the stability tile is the band word alone (dossier column and list tile); prosperity is its stored band (VR28 tier 2); a tile holding a hideable house\'s name is sent by none; an unmarked listed page is unchanged', async () => {
    const marked = await store(town(), { overrides: VEIL() });
    const g = await dossier(marked.slug);
    expect(g.stability).toBe('Unstable');
    const row = (await listed()).find(r => r.public_slug === marked.slug);
    expect(row.stability).toBe('Unstable');
    // VR28 tier 2: the prosperity band is sent as stored (the recorded residual), and its filter matches it
    expect(row.prosperity).toBe('Comfortable');
    expect((await listed({ prosperity: ['Comfortable'] })).map(r => r.public_slug)).toContain(marked.slug);
    // a tile value that holds a hideable house's name (a sharer's own config)
    const named = await store(town({ config: { terrainType: 'Black market bluffs', magicLevel: 'low', nearbyResources: ['black market salt'] } }), { overrides: VEIL() });
    const n = (await listed()).find(r => r.public_slug === named.slug);
    expect([n.terrain, n.primary_resource]).toEqual([null, null]);
    expect((await listed({ terrain: ['Black market bluffs'] })).map(r => r.public_slug)).not.toContain(named.slug);
    // unmarked listed: as before (VR23)
    const unmarked = await store(town(), { overrides: {} });
    const ur = (await listed()).find(r => r.public_slug === unmarked.slug);
    expect([ur.stability, ur.prosperity]).toEqual(['Unstable (pervasive organized crime)', 'Comfortable']);
  }, ARM_TIMEOUT_MS);

  it('V10-3 THE CLOSED ANSWER SENDS NO TILE: a share past the name search\'s bound (600 houses hidden whole of 145 characters) serves the name alone and no tile beside it', async () => {
    const houses = Array.from({ length: 600 }, (_, i) => ({ id: `inst_c${i}`, name: `${String(i).padStart(4, '0')} ${'Shadow'.repeat(23)}`.slice(0, 145), category: 'Criminal' }));
    const closed = await store(town({ institutions: [...houses, MILL] }), { overrides: VEIL() });
    const g = await dossier(closed.slug);
    expect(Object.keys(g.data || {}), 'the closed answer').toEqual(['name']);
    expect(['population', 'terrain', 'government_type', 'magic_level', 'stability', 'primary_resource', 'threat_level'].map(c => g[c])).toEqual(Array(7).fill(null));
  }, ARM_TIMEOUT_MS);

  it('V10-4 THE MAP MEMBER: a member with no veil of its own takes the default veil; a marked member its own', async () => {
    const unmarked = await store(town(), { overrides: {}, isPublic: false });
    const m = await mapOf([unmarked.id]);
    expect(arrivals(m.members[0].settlement, 'Black market'), 'unmarked member').toEqual([]);
    expect(arrivals(m.members[0].settlement, 'Mill').length, 'the open house stays').toBeGreaterThan(0);
  }, ARM_TIMEOUT_MS);

  it('THE ONE-ROW READ (the chair\'s condition (a), VEIL-DOORS-2): get_gallery_dossier takes its own row\'s tiles by the one tile rule, never every public row\'s; its row and tile columns equal the list\'s row for every share (unmarked, the default veil, a hand veil, Reveal DM, snapshot mode, votes and comments counted)', async () => {
    const body = (await db.query(`select p.prosrc from pg_proc p where p.oid = to_regprocedure('public.get_gallery_dossier(text)')`)).rows[0].prosrc;
    expect(/_gallery_public_tile_rows/.test(body), 'the dossier read computes the tile rows of EVERY public row to read its one').toBe(false);
    expect(/_gallery_doors_tiles\s*\(/.test(body), 'the dossier read does not read the one tile rule').toBe(true);
    const COLS = ['id', 'public_slug', 'name', 'tier', 'published_at', 'updated_at', 'view_count', 'is_curated', 'gallery_description',
      'gallery_image_url', 'gallery_image_alt', 'gallery_tags', 'population', 'terrain', 'government_type', 'magic_level', 'stability',
      'primary_resource', 'threat_level', 'net_votes', 'comment_count', 'aliveness'];
    const shares = [
      { overrides: {} }, { overrides: VEIL() }, { overrides: VEIL(), dm: true },
      { overrides: VEIL([{ address: 'block:power.criminalUnderside', hidden: false }, { address: 'block:services.criminal', hidden: false }]) },
      { overrides: { $veil: { ...VEIL().$veil, mode: 'snapshot', snapshot: town({ population: 999, powerStructure: { stability: 'Tense (a feud)', government: 'Council' } }) } } },
    ];
    const differs = [];
    for (const share of shares) {
      const row = await store(town(), share);
      await db.query(`insert into public.gallery_votes (settlement_id, user_id) values ($1, $2)`, [row.id, READER]);
      await db.query(`insert into public.gallery_comments (settlement_id, user_id, body) values ($1, $2, 'Fine town.'), ($1, $2, 'Gone.')`, [row.id, READER]);
      await db.query(`update public.gallery_comments set deleted_at = now() where settlement_id = $1 and body = 'Gone.'`, [row.id]);
      await db.query(`update public.settlements set gallery_title = 'Rookford of the River', gallery_facet_aliveness = 7 where id = $1`, [row.id]);
      const g = await dossier(row.slug);
      const l = (await listed()).find(r => r.public_slug === row.slug);
      for (const c of COLS) if (canon(g[c]) !== canon(l[c])) differs.push(`${JSON.stringify(share).slice(0, 60)} ${c}: dossier ${canon(g[c])} | list ${canon(l[c])}`);
      expect([g.net_votes, g.comment_count, g.name], 'the counts and the title are the row\'s own').toEqual([1, 1, 'Rookford of the River']);
    }
    expect(differs).toEqual([]);
  }, ARM_TIMEOUT_MS);

  it('VR23 ON THE BROWSER\'S IMPORT PATH (VEIL-DOORS-2, item 4): importing a shared campaign map runs importGalleryMapWithCampaignImpl -> fetchGalleryMap -> get_gallery_map; a member with no veil of its own arrives in the importer\'s record default-veiled (its criminal house absent, its open house present), a marked member by its own veil', async () => {
    const { importGalleryMapWithCampaignImpl } = await import('../../src/store/galleryImportMap.js');
    const unmarked = await store(town(), { overrides: {}, isPublic: false, log: LOG });
    const marked = await store(town(), { overrides: VEIL(), isPublic: false, log: LOG });
    seq += 1;
    const slug = `realm${seq}`;
    await db.query(`insert into public.saved_maps (id,user_id,name,map_data,is_public,public_slug,share_kind,gallery_share_campaign,gallery_importable)
      values (gen_random_uuid(),$1,'Realm',$2::jsonb,true,$3,'map_with_campaign',true,true)`, [OWNER, JSON.stringify({ campaign: { settlementIds: [unmarked.id, marked.id] } }), slug]);
    const state = {
      auth: { user: { id: READER }, tier: 'premium', role: 'user' }, campaignSessionGeneration: 0, savedSettlements: [], campaigns: [],
      maxSaves: () => Infinity, createCampaign: () => { state.campaigns.push({ id: 'camp_import', settlementIds: [] }); return 'camp_import'; },
      saveCampaignMap: () => {},
    };
    Object.assign(ROUTE, { db, uid: READER, saved: [] });
    try {
      expect(await importGalleryMapWithCampaignImpl(() => state, (fn) => fn(state), slug)).toBe('camp_import');
    } finally { ROUTE.db = null; }
    expect(ROUTE.saved.length, 'both members were imported').toBe(2);
    for (const entry of ROUTE.saved) {
      expect(arrivals(entry.settlement, 'Black market'), `the importer's record of ${entry.name}`).toEqual([]);
      expect(arrivals(entry.settlement, 'Mill').length, `the open house arrives in ${entry.name}`).toBeGreaterThan(0);
    }
    expect(state.savedSettlements.map((e) => e.id)).toEqual(['import_1', 'import_2']);
  }, ARM_TIMEOUT_MS);

  it('THE EVENT-TYPE TABLE ON PURPOSE (VEIL-DOORS-2, item 5; the surprise of 03:24 UTC): on a marked share a covert act (imposed OR exposed corruption), a crime stressor, a table note and every entry naming a house, person or power the served body does not show (removed since, or never in the copy) are withheld whole; open entries arrive; server equals twin', async () => {
    const SHOWN = ['A new Mill was established.', 'A new Granary was established.', 'Famine pressure grips the settlement.', 'Vess took up Miller at the Mill.'];
    const LOG5 = [
      entry('ADD_INSTITUTION', 'A new Mill was established.', { targetId: 'institution.mill' }),
      entry('ADD_INSTITUTION', 'A new Granary was established.', { targetId: 'institution.granary' }),
      entry('EXPOSE_CORRUPTION', 'Corruption inside Mill has been publicly exposed.', { targetId: 'institution.mill' }),
      entry('APPLY_STRESSOR', 'Criminal corridor grips the settlement.', { targetId: 'criminal_corridor', payload: { stressorType: 'criminal_corridor', label: 'Criminal corridor' } }),
      entry('APPLY_STRESSOR', 'Famine pressure grips the settlement.', { targetId: 'famine', payload: { stressorType: 'famine', label: 'Famine pressure' } }),
      { id: 'flavor.TABLE_INCIDENT.1.1', type: 'TABLE_INCIDENT', targetId: null, timestamp: '2026-11-01T11:00:00.000Z', source: 'table', narrativeSummary: 'The party paid off a fence at the docks.', flavor: true },
      entry('ADD_INSTITUTION', 'A new Smugglers den was established.', { targetId: 'institution.smugglers_den' }),
      entry('REMOVE_INSTITUTION', 'The Smugglers den closed or was dissolved.', { targetId: 'institution.smugglers_den' }),
      entry('ADD_NPC', 'Rask arrived as Lookout at the Smugglers den.', { targetId: 'npc_vess', payload: { role: 'Lookout', institution: 'Smugglers den' } }),
      entry('KILL_NPC', 'Old Gant is gone.', { targetId: 'npc_old_gant' }),
      entry('ASSIGN_NPC_TO_ROLE', 'Vess took up Miller at the Mill.', { targetId: 'npc_vess', payload: { role: 'Miller', institution: 'Mill' } }),
      entry('ADD_FACTION', 'A new power, The Quiet Hand, has formed.', { targetId: 'The Quiet Hand' }),
      // one entry per type re-classed from 'target' (each red at the commit before: VEIL-DOORS-2-HANDBACK.md's table)
      entry('DAMAGE_INSTITUTION', 'The Smugglers den was damaged.', { targetId: 'institution.smugglers_den' }),
      entry('IMPAIR_INSTITUTION', 'Smugglers den suffered a capacity setback.', { targetId: 'institution.smugglers_den' }),
      entry('RESTORE_INSTITUTION', 'Smugglers den recovered.', { targetId: 'institution.smugglers_den' }),
      entry('KILL_LEADER', 'Old Gant (the settlement\'s leader) is gone.', { targetId: 'npc_old_gant' }),
      entry('PROMOTE_NPC', 'Old Gant rises within their power, displacing a rival on the way up.', { targetId: 'npc_old_gant' }),
      entry('DEMOTE_NPC', 'Old Gant is pushed down the ranks of their power.', { targetId: 'npc_old_gant' }),
      entry('IMPAIR_FACTION', 'The Quiet Hand lost standing.', { targetId: 'The Quiet Hand' }),
      entry('RESTORE_FACTION', 'The Quiet Hand recovered.', { targetId: 'The Quiet Hand' }),
      entry('CHANGE_RULING_POWER', 'The Quiet Hand took power in Rookford by coup.', { targetId: 'The Quiet Hand', payload: { cause: 'coup' } }),
      entry('ASSIGN_NPC_TO_ROLE', 'Rask took up Lookout at the Smugglers den.', { targetId: 'npc_vess', payload: { role: 'Lookout', institution: 'Smugglers den' } }),
      entry('RESOLVE_STRESSOR', 'Criminal corridor no longer grips the settlement.', { targetId: 'criminal_corridor', payload: { stressorType: 'criminal_corridor', label: 'Criminal corridor' } }),
    ];
    const t = town({ institutions: [BLACK, MILL, { id: 'inst_gran', name: 'Granary', category: 'Economy', catalogId: 'granary' }] });
    const row = await store(t, { overrides: VEIL(), log: LOG5 });
    const g = await dossier(row.slug);
    expect((g.chronicle || []).map((e) => e.narrativeSummary), 'what a visitor reads').toEqual(SHOWN);
    const veil = await import('../../src/domain/display/galleryVeil.js');
    const doors = await import('../../src/domain/display/galleryDoors.js');
    const proj = veil.galleryPayloadFor(JSON.parse(JSON.stringify(t)), { shareDm: false, memberOverrides: VEIL() });
    const twin = doors.veilChronicle(LOG5, { proj, body: g.data, groupings: g.gallery_member_overrides?.$veil?.groupings || [], src: t, shareDm: false });
    expect(canon(twin), 'server equals twin').toBe(canon(g.chronicle));
    // an unmarked listed page: as 032 sends it (VR23: R4's sparing untouched)
    const unmarked = await store(t, { overrides: {}, log: LOG5 });
    expect(((await dossier(unmarked.slug)).chronicle || []).length).toBe(LOG5.length);
  }, ARM_TIMEOUT_MS);

  it('SNAPSHOT MODE (VEIL-DOORS-2, item 6): after a freeze the DM adds a criminal house and events, renames the town, shifts its tier and saves; the frozen share\'s chronicle, name, tier and time (dossier, list, map member, import) tell none of it; the twin agrees', async () => {
    const FROZEN_AT = '2026-11-05T00:00:00.000Z';
    const copy = town();
    const before = [entry('ADD_INSTITUTION', 'A new Mill was established.', { targetId: 'institution.mill', at: '2026-11-01T10:00:00.000Z' })];
    const after = [
      entry('ADD_INSTITUTION', 'A new Granary was established.', { targetId: 'institution.granary', at: '2026-11-12T10:00:00.000Z' }),
      { id: 'rename.x.1', type: 'RENAME_SETTLEMENT', targetId: 'Rookford', timestamp: '2026-11-13T10:00:00.000Z', narrativeSummary: 'Rookford is now known as Rookhold.', flavor: true },
      entry('SHIFT_TIER', 'The settlement swells to a larger tier, its institutions rising to match the new scale.', { at: '2026-11-14T10:00:00.000Z' }),
    ];
    const overrides = { $veil: { ...VEIL().$veil, mode: 'snapshot', at: FROZEN_AT, snapshot: copy } };
    const row = await store(copy, { overrides, log: before });
    await db.query(`update public.settlements set gallery_updated_at = null, published_at = $2 where id = $1`, [row.id, FROZEN_AT]); // a row never re-published: its time is its publication's
    const live = town({ name: 'Rookhold', institutions: [BLACK, MILL, { id: 'inst_gran', name: 'Granary', category: 'Economy', catalogId: 'granary' }] });
    await db.query(`update public.settlements set name = 'Rookhold', tier = 'city', data = $2::jsonb, campaign_state = $3::jsonb, updated_at = '2026-11-15T00:00:00Z' where id = $1`,
      [row.id, JSON.stringify(live), JSON.stringify({ eventLog: [...before, ...after] })]);
    const g = await dossier(row.slug);
    const l = (await listed()).find((r) => r.public_slug === row.slug);
    expect({ chronicle: (g.chronicle || []).map((e) => e.narrativeSummary), name: g.name, tier: g.tier, updated: new Date(g.updated_at).toISOString() },
      'the gallery read of a frozen share').toEqual({ chronicle: ['A new Mill was established.'], name: 'Rookford', tier: 'town', updated: FROZEN_AT });
    expect({ name: l.name, tier: l.tier, updated: new Date(l.updated_at).toISOString() }, 'the list row').toEqual({ name: 'Rookford', tier: 'town', updated: FROZEN_AT });
    const m = await mapOf([row.id]);
    expect({ name: m.members[0].name, tier: m.members[0].tier, chronicle: (m.members[0].chronicle || []).map((e) => e.narrativeSummary) }, 'the map member')
      .toEqual({ name: 'Rookford', tier: 'town', chronicle: ['A new Mill was established.'] });
    await db.exec(`set test.uid = '${READER}';`);
    const imp = (await db.query('select * from public.import_gallery_dossier($1)', [row.slug])).rows[0];
    await db.exec('reset test.uid;');
    expect({ name: imp.name, tier: imp.tier }, 'the importer\'s record').toEqual({ name: 'Rookford', tier: 'town' });
    // the twin: the same chronicle from the frozen marker
    const veil = await import('../../src/domain/display/galleryVeil.js');
    const doors = await import('../../src/domain/display/galleryDoors.js');
    const proj = veil.galleryPayloadFor(JSON.parse(JSON.stringify(copy)), { shareDm: false, memberOverrides: overrides });
    const twin = doors.veilChronicle([...before, ...after], { proj, body: g.data, groupings: g.gallery_member_overrides?.$veil?.groupings || [], src: copy, frozen: overrides.$veil });
    expect(canon(twin), 'server equals twin').toBe(canon(g.chronicle));
  }, ARM_TIMEOUT_MS);

  it('VR40 A SHARED MAP\'S WORLD SENDS NO CHRONICLE (VEIL-DOORS-3): a stored world snapshot holding a chronicle, planted past the guard, is served by neither map read; its other sections are; its section list loses the key; a snapshot that is not an object is served as none; the twin agrees', async () => {
    const HEADLINE = "Thieves and racketeers are working Rookford's streets in the open.";
    const SNAP = { schemaVersion: 1, sourceWorldStateSchemaVersion: 1, worldClock: { tick: 3, season: 'spring' },
      pantheon: [{ deityId: 'aster', name: 'Aster', tier: 'major', seats: 1 }],
      chronicle: [{ tick: 2, headlines: [HEADLINE], affectedSettlementIds: ['m1'], affectedSettlementNames: ['Rookford'] }] };
    const SECTIONS = ['worldClock', 'chronicle', 'pantheon'];
    const NOT_OBJECT = [{ chronicle: [{ headlines: [HEADLINE] }] }];
    const plant = async (snapshot, sections) => {
      seq += 1;
      const slug = `world${seq}`; const link = `worldlink${seq}`;
      // past 091's trigger guard, which refuses the key today: what an older row (or any path round the guard) may hold
      await db.exec('alter table public.saved_maps disable trigger trg_saved_maps_world_snapshot_guard;');
      try {
        await db.query(`insert into public.saved_maps (id,user_id,name,map_data,is_public,public_slug,share_kind,gallery_share_campaign,gallery_share_world,gallery_world_snapshot,gallery_world_sections,unlisted_slug,visibility)
          values (gen_random_uuid(),$1,'Realm',$2::jsonb,true,$3,'map_with_campaign',true,true,$4::jsonb,$5::jsonb,$6,'unlisted')`,
        [OWNER, JSON.stringify({ campaign: { settlementIds: [] } }), slug, JSON.stringify(snapshot), JSON.stringify(sections), link]);
      } finally { await db.exec('alter table public.saved_maps enable trigger trg_saved_maps_world_snapshot_guard;'); }
      const read = async (sql, arg) => {
        await db.exec('set role anon;');
        try { return (await db.query(sql, [arg])).rows[0].m; } finally { await db.exec('reset role;'); }
      };
      // the link read, the guard in place (it writes nothing, so nothing stands in front of it)
      const u = await read('select public.get_unlisted_map($1) as m', link);
      // the gallery read bumps the row's view count, so 091's BEFORE UPDATE guard fires on the read itself and a row
      // holding a chronicle raises there today; held off for the read, as for a row the guard does not refuse
      await db.exec('alter table public.saved_maps disable trigger trg_saved_maps_world_snapshot_guard;');
      try { return { g: await read('select public.get_gallery_map($1) as m', slug), u }; } finally {
        await db.exec('alter table public.saved_maps enable trigger trg_saved_maps_world_snapshot_guard;');
      }
    };
    const { g, u } = await plant(SNAP, SECTIONS);
    expect([...arrivals(g, 'racketeers'), ...arrivals(u, 'racketeers')], 'the headline reaches a visitor').toEqual([]);
    const { chronicle: _gone, ...rest } = SNAP;
    expect({ gallery: g.world?.snapshot, link: u.world_snapshot }, 'the stored world as served').toEqual({ gallery: rest, link: rest });
    expect({ gallery: g.world?.sections, link: u.world_sections }, 'the section list as served').toEqual({ gallery: ['worldClock', 'pantheon'], link: ['worldClock', 'pantheon'] });
    const odd = await plant(NOT_OBJECT, 'not a list');
    expect([...arrivals(odd.g, 'racketeers'), ...arrivals(odd.u, 'racketeers')], 'a stored snapshot that is not an object').toEqual([]);
    expect({ gallery: odd.g.world?.snapshot ?? null, link: odd.u.world_snapshot, sections: odd.u.world_sections }).toEqual({ gallery: null, link: null, sections: null });
    // the twin
    const doors = await import('../../src/domain/display/galleryDoors.js');
    expect({ snap: doors.publicWorld(SNAP), sections: doors.publicWorldSections(SECTIONS), odd: doors.publicWorld(NOT_OBJECT), oddSections: doors.publicWorldSections('not a list') }, 'server equals twin')
      .toEqual({ snap: g.world.snapshot, sections: g.world.sections, odd: odd.u.world_snapshot, oddSections: odd.u.world_sections });
  }, ARM_TIMEOUT_MS);

  it('THE TILE ROWS ARE NO DOOR OF THEIR OWN: _gallery_public_tile_rows() is executable by neither anon nor authenticated (Supabase\'s default privileges)', async () => {
    const r = (await db.query(`select has_function_privilege('anon', 'public._gallery_public_tile_rows()', 'execute') as a,
      has_function_privilege('authenticated', 'public._gallery_public_tile_rows()', 'execute') as u`)).rows[0];
    expect(r).toEqual({ a: false, u: false });
  }, ARM_TIMEOUT_MS);
  it('THE TWIN: the server and src/domain/display/galleryDoors.js send the same chronicle and the same tiles (the default veil and a hand veil, Reveal DM off and on; the closed answer)', async () => {
    const doors = await import('../../src/domain/display/galleryDoors.js');
    const veil = await import('../../src/domain/display/galleryVeil.js');
    const legacy = (l) => (Array.isArray(l) ? l : null);
    const shares = [VEIL(), VEIL([{ address: 'block:power.criminalUnderside', hidden: false }, { address: 'block:services.criminal', hidden: false },
      { address: 'block:defense.criminalStructure', hidden: false }, { address: `card:institution:${veil.CARD_KINDS.institution.idOf(BLACK)}`, hidden: false }])];
    const differs = [];
    for (const overrides of shares) for (const dm of [false, true]) {
      const t = town();
      const row = await store(t, { overrides, dm, log: LOG });
      const g = await dossier(row.slug);
      const proj = veil.galleryPayloadFor(JSON.parse(JSON.stringify(t)), { shareDm: dm, memberOverrides: overrides });
      const twin = doors.veilChronicle(LOG, { proj, body: g.data, groupings: g.gallery_member_overrides?.$veil?.groupings || [], src: t, shareDm: dm, legacy });
      if (canon(twin) !== canon(g.chronicle)) differs.push(`chronicle ${JSON.stringify(overrides).length} dm ${dm}: server ${JSON.stringify(g.chronicle).slice(0, 200)} | twin ${JSON.stringify(twin).slice(0, 200)}`);
      const tiles = doors.tilesUnderVeil(t);
      const lr = (await listed()).find(r => r.public_slug === row.slug);
      for (const [k, v] of Object.entries(tiles)) if ((lr[k] ?? null) !== v) differs.push(`tile ${k}: server ${lr[k]} | twin ${v}`);
    }
    expect(differs).toEqual([]);
    // the closed answer: neither sends a chronicle
    const houses = Array.from({ length: 600 }, (_, i) => ({ id: `inst_t${i}`, name: `${String(i).padStart(4, '0')} ${'Murk'.repeat(35)}`.slice(0, 145), category: 'Criminal' }));
    const closed = await store(town({ institutions: [...houses, MILL] }), { overrides: VEIL(), log: LOG });
    const g = await dossier(closed.slug);
    expect([g.chronicle, doors.veilChronicle(LOG, { proj: {}, body: g.data, legacy })]).toEqual([null, null]);
  }, ARM_TIMEOUT_MS);
});
