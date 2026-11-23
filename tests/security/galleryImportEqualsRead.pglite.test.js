/**
 * galleryImportEqualsRead.pglite.test.js — THE PIN "AN IMPORT EQUALS THE GALLERY READ" (VEIL-44's TRAD4-RECUT; IMPORT-DOOR's
 * unit 0; docs/chair/2026-11-20/veil/briefs/TRAD4-RECUT-BRIEF.md).
 *
 * THE SOURCE. TRAD-4's block "TRAD-4 UNIT 8: 140 born towns, a hideable house planted to keep a rite, saved, served, sanitized
 * and imported" of tests/security/traditionDescriptionSharedPage.test.js at 14f16760b (origin/lane/trad-4-2026-11-20-u8-wip,
 * its lines 937-1139). That file is not on this tree and its block reads three modules this lane lacks
 * (src/domain/traditions/traditionDescription.js, src/domain/traditions/shownTraditions.js,
 * src/data/traditionDescriptionTable.js :: KEEPER_HOUSES), so the pin is re-cut here as a file of its own.
 *
 * TAKEN from the block: the birth of the 140 (its `born`: generateSettlementPipeline over { settType, culture,
 * terrainOverride: 'auto', tradeRouteAccess: 'random_trade', monsterThreat: 'civilized' }, the six tiers round-robin, the seven
 * cultures in runs of six, seed `trad4-u8-<tier>-<culture>-<i>`); the save; the served read through PGlite; the import through
 * importGallerySettlementImpl with the real fetchDossierForImport (wrapped by vi.mock so the arm sees it called) over a
 * supabase.rpc that runs the PGlite import_gallery_dossier, saves.save mocked to capture the entry; the clone (that entry's
 * `settlement`). Of its arms, the shape of "THE IMPORT PATH (a)": the RPC served every town, the importer drove the real
 * transform, the clone compared with what was served (here the whole document, not its tradition rows), the seed gone.
 *
 * DROPPED from the block, because each reads the traditions modules this lane lacks: every tradition row and the drawn-rows
 * comparisons; `plantOf` and the KEEPER_HOUSES plant (the Corvine Sanctum); the arms "NOT VACUOUS: ... every town planted;
 * every tier draws a row with a keeper or a cause" (its plant and keeper halves; its tier and culture halves are kept),
 * "CONTROL (arm 3): the OWNER's page ...", "THE ROUND TRIP (client) ...", "THE ROUND TRIP (server) ..." (the block's
 * net-current sanitizer over tradition rows), "NAMES NOTHING HIDDEN ...", "THE IMPORT PATH (b): the IMPORTER's OWNER page
 * ..." and "MEASURED (CTR9 ...)". Also dropped: the block's partial server (its hand-made tables and six netCurrentFn bodies);
 * this file runs THIS tree's migrations 001..212 whole, in file order, on PGlite.
 *
 * THE SAVE (N5 / E134: every proof on the document as the save stores it). src/lib/saves.js :: supabaseSave (the brief's
 * "src/store/saves.js" is that file; there is no src/store/saves.js) writes `data` as
 * withPublicProse(withNeighbourNetworkFromRelationship(v2.settlement), composePublicProse(that settlement)), where
 * migrateSaveToV2 leaves the settlement as given. A born town has no neighbour (its pipeline runs with none), so the neighbour
 * step is a no-op, asserted per town; the stored document is therefore withPublicProse(t, composePublicProse(t)) with
 * publicProse.js's withPublicProse (the same rule as saves.js's private copy for a non-null projection), as the block did.
 *
 * THE SHARES. Each town is shared six times, each its own row (gallery_importable true, is_public true): three markers in
 * gallery_member_overrides, unmarked `{}`, the default `writeShareVeil({}, [])`, and the owner's HAND as
 * origin/lane/veil-42-2026-11-23-meas-wip :: docs/chair/2026-11-20/veil/out/v42/meas/um.probe.jsx builds its `hand`
 * (tell-common.mjs :: OPEN, AT: the three criminal groupings and the plot-hooks tab opened, mode live at 2026-11-01), at Reveal
 * OFF and ON (gallery_share_dm). The gallery read is get_gallery_dossier(slug).data, read as a visitor (auth.uid() null); the
 * import is import_gallery_dossier(slug).data, read by a signed-in premium importer.
 *
 * THE ASSERTIONS, for every town and every share:
 *   (a) THE IMPORT EQUALS THE GALLERY READ: import_gallery_dossier(slug).data equals get_gallery_dossier(slug).data value for
 *       value (ruling 56; ruling 57 (b) for the unmarked share), EXCEPT where the import's own gate differs: 212 ::
 *       _gallery_apply_member_overrides(..., for_import true) also requires a person's `allowImport` (else the share's
 *       importable) to splice that person's DM record. The difference is allowed ONLY under a person whose override sets
 *       allowImport false; these shares set none (counted and asserted 0), so here nothing may differ.
 *   (b) THE CLONE, in its two seams:
 *       (b1) THE FETCH: fetchDossierForImport's `settlement` equals the served `data` except what it strips or adds on purpose
 *            (src/lib/gallery.js :: stripImportConfidential: `seed`, `_seed`, `_config`, `config._seed`, `dmNotes`,
 *            `dossierNotes`, `narrativeNotes`; :: veilPublicPayload, the civility mask: a string replaced by
 *            civility.js :: veilText of itself; and the envelope's `id`, `name`, `tier` hoisted from the row). Each counted.
 *       (b2) THE SAVE OF THE CLONE: the entry's `settlement` holds no top-level key the served `data` lacks and differs from it
 *            in no top-level key, EXCEPT the keys importGallerySettlementImpl changes on purpose, each named in CLONE_RULES
 *            below by the step that changes it; and every string the clone carries stands somewhere in the served `data`,
 *            except under `importedFrom` (the clone names nothing the gallery did not serve).
 *   (c) NOT VACUOUS: the 140 cover every tier and at least six cultures; for every marker at least one town's share withholds
 *       a row (a string leaf, by its path with indices dropped, of the stored document missing from the served `data`; for a
 *       marked share also one the unmarked share of the same town served), counted and asserted, so (a) is never two empty
 *       documents.
 *   THE TOOTH: a scratch copy of one marked share's served `data` with one veiled path restored (from the unmarked share's
 *       read of the same town) reds (a)'s and (b2)'s checks, and the unplanted copy passes them again.
 *
 * THE ID LAW. At this tip person ids are not re-keyed, so the comparison is by raw value, written through ONE comparator,
 * `sameModuloIds(a, b)`, today the identity on the canonical JSON. At the R4-IDS merge the seat switches it, in one line, to
 * tests/security/personIdBijection.shared.mjs (on the R4-IDS branches, not here).
 */
import { describe, it, expect, beforeAll, vi } from 'vitest';
import { PGlite } from '@electric-sql/pglite';
import { pgcrypto } from '@electric-sql/pglite/contrib/pgcrypto';
import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { composePublicProse } from '../../src/components/new/publicProseCompose.js';
import { withPublicProse } from '../../src/domain/display/publicProse.js';
import { writeShareVeil } from '../../src/domain/display/galleryVeil.js';
import { veilText } from '../../src/lib/civility.js';
import { importGallerySettlementImpl } from '../../src/store/galleryImportSettlement.js';
import { fetchDossierForImport } from '../../src/lib/gallery.js';
import { saves } from '../../src/lib/saves.js';
import { supabase } from '../../src/lib/supabase.js';

vi.mock('../../src/lib/supabase.js', () => ({ supabase: { from: vi.fn(), rpc: vi.fn() }, isConfigured: true }));
// the real fetchDossierForImport (its confidential strip and its veilPublicPayload), wrapped so the arm sees it called
vi.mock('../../src/lib/gallery.js', async (importOriginal) => {
  const actual = await importOriginal();
  return { ...actual, fetchDossierForImport: vi.fn(actual.fetchDossierForImport) };
});
vi.mock('../../src/lib/saves.js', async (importOriginal) => ({ ...(await importOriginal()), saves: { save: vi.fn() } }));

const PGLITE_BOOT_TIMEOUT_MS = 900_000; // deadlock guard, not a perf budget — never tune to a measured boot (see pgliteHookTimeoutRatchet.test.js)
const POOL_TIMEOUT_MS = 7_200_000; // deadlock guard for the pool's own hook (140 born towns, six shares each, two reads and an import per share; measured about 3,000 s alone), never a budget
const ARM_TIMEOUT_MS = 120_000;

const MIGRATIONS = resolve(process.cwd(), 'supabase', 'migrations');
const OWNER = '11111111-1111-1111-1111-111111111111';
const IMPORTER = '33333333-3333-3333-3333-333333333333';
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

const N = 140;
const TIERS = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
const CULTURES = ['germanic', 'celtic', 'arabic', 'slavic', 'latin', 'norse', 'greek'];
const MARKERS = ['unmarked', 'default', 'hand'];
/** The owner's hand in chain B's um.probe.jsx (tell-common.mjs :: OPEN, AT; loadVeil's write of settings().deltas.own). */
const HAND_OPEN = ['block:services.criminal', 'block:defense.criminalStructure', 'block:power.criminalUnderside', 'tab:plot_hooks'];
const HAND_AT = { mode: 'live', at: '2026-11-01T00:00:00.000Z' };
const markerOf = (name) => (name === 'unmarked' ? {}
  : name === 'default' ? writeShareVeil({}, [])
    : writeShareVeil({}, HAND_OPEN.map((address) => ({ address, hidden: false })), HAND_AT));

/** What fetchDossierForImport strips on purpose (src/lib/gallery.js :: stripImportConfidential), by name. */
const FETCH_STRIPS = ['seed', '_seed', '_config', 'config._seed', 'dmNotes', 'dossierNotes', 'narrativeNotes'];

/** The printed records (TRAD4-RECUT MEASURE, TOOTH): logged, and appended to TRAD4_RECORD_OUT when set (the gate may silence a passing test's log). */
const record = (line) => {
  console.log(line);
  if (process.env.TRAD4_RECORD_OUT) writeFileSync(process.env.TRAD4_RECORD_OUT, `${line}\n`, { flag: 'a' });
};
const isRec = (v) => !!v && typeof v === 'object' && !Array.isArray(v);
/** JSON with every record's keys sorted (a jsonb round trip reorders keys). */
const J = (v) => JSON.stringify(v ?? null, (_k, x) => (isRec(x) ? Object.fromEntries(Object.keys(x).sort().map((q) => [q, x[q]])) : x));
/**
 * THE ID LAW'S ONE COMPARATOR. Today the identity (person ids are not re-keyed at this tip). At the R4-IDS merge the seat
 * switches this one line to tests/security/personIdBijection.shared.mjs.
 */
const sameModuloIds = (a, b) => J(a) === J(b);

/** Every primitive leaf of a document, with its path. */
function leaves(v, path = '$', acc = []) {
  if (Array.isArray(v)) v.forEach((x, i) => leaves(x, `${path}[${i}]`, acc));
  else if (isRec(v)) for (const [k, x] of Object.entries(v)) leaves(x, `${path}.${k}`, acc);
  else acc.push({ path, value: v });
  return acc;
}
/** The paths at which two documents differ (a path present on one side only, or a different leaf), at most `max`. */
function diffPaths(a, b, max = 6) {
  const out = [];
  const walk = (x, y, path) => {
    if (out.length >= max) return;
    if (Array.isArray(x) && Array.isArray(y)) {
      if (x.length !== y.length) out.push(`${path} (length ${x.length} vs ${y.length})`);
      for (let i = 0; i < Math.min(x.length, y.length); i += 1) walk(x[i], y[i], `${path}[${i}]`);
    } else if (isRec(x) && isRec(y)) {
      for (const k of new Set([...Object.keys(x), ...Object.keys(y)])) {
        if (!(k in x)) out.push(`${path}.${k} (only on the second)`);
        else if (!(k in y)) out.push(`${path}.${k} (only on the first)`);
        else walk(x[k], y[k], `${path}.${k}`);
      }
    } else if (J(x) !== J(y)) out.push(`${path} (${JSON.stringify(x)?.slice(0, 50)} vs ${JSON.stringify(y)?.slice(0, 50)})`);
  };
  walk(a, b, '$');
  return out;
}
/** A document's string leaves as a multiset of `<path with indices dropped>=<value>`. */
const rowsOf = (doc) => {
  const m = new Map();
  for (const { path, value } of leaves(doc)) {
    if (typeof value !== 'string') continue;
    const k = `${path.replace(/\[\d+\]/g, '[]')}=${value}`;
    m.set(k, (m.get(k) || 0) + 1);
  }
  return m;
};
/** How many rows of `a` the document `b` lacks (multiset difference). */
const withheld = (a, b) => {
  const rb = rowsOf(b);
  let n = 0;
  for (const [k, c] of rowsOf(a)) n += Math.max(0, c - (rb.get(k) || 0));
  return n;
};

/** (a): the import's `data` against the gallery read's, the one allowed difference by its rule. */
function checkImportEqualsRead(where, imported, gallery, overrides) {
  if (!isRec(imported) || !isRec(gallery)) return [`${where}: no document (import ${typeof imported}, gallery ${typeof gallery})`];
  if (sameModuloIds(imported, gallery)) return [];
  const refused = Object.entries(overrides || {}).filter(([k, v]) => k !== '$veil' && isRec(v) && v.allowImport === false).map(([k]) => k);
  return diffPaths(imported, gallery).map((p) => `${where}: import vs gallery at ${p}${refused.length ? ` (allowImport false: ${refused.join(', ')})` : ''}`);
}

/** (b1): fetchDossierForImport's settlement against the served `data`: the named strips and the civility mask only. */
function checkFetch(where, dossier, served, row, tally) {
  if (!isRec(dossier) || !isRec(dossier.settlement)) return [`${where}: no dossier`];
  const red = [];
  const expected = { ...served };
  for (const k of FETCH_STRIPS) {
    if (k === 'config._seed') {
      if (isRec(expected.config) && '_seed' in expected.config) { expected.config = { ...expected.config }; delete expected.config._seed; tally.strips[k] = (tally.strips[k] || 0) + 1; }
    } else if (k in expected) { delete expected[k]; tally.strips[k] = (tally.strips[k] || 0) + 1; }
  }
  const got = new Map(leaves(dossier.settlement).map((l) => [l.path, l.value]));
  const want = new Map(leaves(expected).map((l) => [l.path, l.value]));
  for (const [p, v] of want) {
    if (!got.has(p)) { red.push(`${where}: fetch drops ${p}`); continue; }
    const g = got.get(p);
    if (g === v) continue;
    if (typeof v === 'string' && typeof g === 'string' && veilText(v) === g) { tally.masked += 1; continue; }
    red.push(`${where}: fetch changes ${p}`);
  }
  for (const p of got.keys()) if (!want.has(p)) red.push(`${where}: fetch adds ${p}`);
  if (dossier.id !== row.id) red.push(`${where}: envelope id ${dossier.id} is not the row's ${row.id}`);
  if (dossier.tier !== row.tier) red.push(`${where}: envelope tier ${dossier.tier} is not the row's ${row.tier}`);
  if (dossier.name !== row.name && dossier.name !== veilText(row.name)) red.push(`${where}: envelope name ${dossier.name} is not the row's`);
  return red;
}

/**
 * (b2) THE TOP-LEVEL KEYS importGallerySettlementImpl CHANGES ON PURPOSE (src/store/galleryImportSettlement.js), each by its
 * step, as measured on the 140 (no other key may differ from the served `data`).
 */
const CLONE_RULES = Object.freeze({
  // the entry's own literal: cross-settlement refs dropped, provenance stamped (the seed: `_seed: undefined`, absent in JSON)
  neighbourNetwork: 'importGallerySettlementImpl :: neighbourNetwork: []',
  interSettlementRelationships: 'importGallerySettlementImpl :: interSettlementRelationships: []',
  neighborRelationship: 'importGallerySettlementImpl :: neighborRelationship: null',
  importedFrom: 'importGallerySettlementImpl :: importedFrom { slug, sourceName, importedAt }',
  config: 'importScrub.js :: scrubImportedConfig (_seed, primaryDeityRef, primaryDeitySnapshot, cultDeitySnapshots, faithProfile)',
  // VR25: importRederive.js :: rederiveServed puts back, from the SERVED document alone, what the share withholds
  economicState: 'importRederive.js :: rederiveServed (compound, safetyProfile.compound/safetyRatio/crimeTypes, foodSecurity, prosperity)',
  defenseProfile: 'importRederive.js :: rederiveServed (readiness.score, scores, economicGates)',
  powerStructure: 'importRederive.js :: rederiveServed (publicLegitimacy.breakdown; recentConflict by pageRederive.js :: rederiveRecentConflict)',
  spatialLayout: 'importRederive.js :: rederiveServed (quarters by generateSpatialLayout)',
  activeConditions: 'importRederive.js :: rederiveServed (each condition\'s severity)',
  stress: 'importRederive.js :: castsNotKnown (a cast\'s roles, absent, stakes emptied)',
  stressors: 'importRederive.js :: castsNotKnown (a cast\'s roles, absent, stakes emptied)',
  // normalizeSettlement.js: the canonical defaults
  simulationTrace: 'normalizeSettlement.js :: simulationTrace defaults to []',
  aiOverlays: 'normalizeSettlement.js :: aiOverlays defaults to []',
  userCanon: 'normalizeSettlement.js :: userCanon defaults to {}',
});
/**
 * The paths (indices dropped) where the clone may carry a string the served `data` lacks: the engine's own writers run by
 * rederiveServed over the served document (VR25; R3-TELL-8 for crimeTypes, R5-RECENT E93 for recentConflict).
 */
const REDERIVED_STRINGS = Object.freeze([
  '$.economicState.safetyProfile.crimeTypes[].type', '$.economicState.safetyProfile.crimeTypes[].desc',
  '$.spatialLayout.quarters[].name', '$.spatialLayout.quarters[].location', '$.spatialLayout.quarters[].desc',
  '$.spatialLayout.quarters[].landmarks[]', '$.powerStructure.recentConflict',
]);
/** (b2): the clone against the served `data`, by top-level key, and every string the clone carries stood in the served. */
function checkClone(where, clone, served, tally) {
  if (!isRec(clone) || !isRec(served)) return [`${where}: no clone`];
  const red = [];
  for (const k of new Set([...Object.keys(clone), ...Object.keys(served)])) {
    if (J(clone[k]) === J(served[k])) continue;
    tally.keys[k] = (tally.keys[k] || 0) + 1;
    if (!(k in CLONE_RULES)) red.push(`${where}: clone ${!(k in served) ? 'adds' : !(k in clone) ? 'drops' : 'changes'} ${k}: ${diffPaths(clone[k], served[k], 2).join('; ')}`);
  }
  const servedStrings = new Set(leaves(served).filter((l) => typeof l.value === 'string').map((l) => l.value));
  for (const { path, value } of leaves(clone)) {
    if (typeof value !== 'string' || path.startsWith('$.importedFrom') || servedStrings.has(value)) continue;
    const q = path.replace(/\[\d+\]/g, '[]');
    tally.foreign[q] = (tally.foreign[q] || 0) + 1;
    if (!REDERIVED_STRINGS.includes(q)) red.push(`${where}: the clone carries a string the gallery did not serve at ${path}: ${value.slice(0, 60)}`);
  }
  return red;
}

describe('AN IMPORT EQUALS THE GALLERY READ: 140 born towns, saved, shared on three markers at Reveal off and on, served, imported and cloned (VEIL-44, TRAD4-RECUT)', () => {
  /** @type {PGlite} */ let db;
  const pool = [];
  const red = { a: [], fetch: [], clone: [] };
  const tally = { strips: {}, masked: 0, keys: {}, foreign: {}, refused: 0, ms: { birth: 0, gallery: 0, importRpc: 0, importClient: 0, checks: 0 }, byTier: {} };
  const veiled = Object.fromEntries(MARKERS.map((m) => [m, { shares: 0, towns: new Set(), rows: 0 }]));
  let tooth = null;
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
    await db.exec(`insert into auth.users (id) values ('${OWNER}'), ('${IMPORTER}') on conflict do nothing;
      insert into public.profiles (id) values ('${OWNER}'), ('${IMPORTER}') on conflict do nothing;
      update public.profiles set role = 'developer' where id = '${OWNER}';
      update public.profiles set tier = 'premium' where id = '${IMPORTER}';`);
  }, PGLITE_BOOT_TIMEOUT_MS);

  beforeAll(async () => {
    const started = Date.now();
    const last = { row: null }; // the import RPC's row, as the PGlite import_gallery_dossier served it
    supabase.rpc.mockImplementation(async (fn, args) => {
      if (fn !== 'import_gallery_dossier') return { data: null, error: { message: `unexpected rpc ${fn}` } };
      const t0 = Date.now();
      const rows = (await db.query('select * from public.import_gallery_dossier($1)', [args.dossier_slug])).rows;
      tally.ms.importRpc += Date.now() - t0;
      last.row = rows[0] ?? null;
      return { data: rows, error: null };
    });
    const entries = [];
    saves.save.mockImplementation(async (entry) => { entries.push(entry); return `import-${entries.length}`; });
    for (let i = 0; i < N; i += 1) {
      const tier = TIERS[i % TIERS.length];
      const culture = CULTURES[Math.floor(i / TIERS.length) % CULTURES.length];
      const tb = Date.now();
      const t = generateSettlementPipeline(
        { settType: tier, culture, terrainOverride: 'auto', tradeRouteAccess: 'random_trade', monsterThreat: 'civilized' },
        null, { seed: `trad4-u8-${tier}-${culture}-${i}`, customContent: {} },
      );
      const stored = withPublicProse(t, composePublicProse(t));
      tally.ms.birth += Date.now() - tb;
      const town = { i, tier, culture, name: stored.name, neighbour: stored.neighborRelationship?.name ?? null, shares: 0, imported: 0 };
      for (const dm of [false, true]) {
        let unmarked = null;
        for (const marker of MARKERS) {
          seq += 1;
          const slug = `t4r${seq.toString(16).padStart(6, '0')}`;
          const overrides = markerOf(marker);
          tally.refused += Object.entries(overrides).filter(([k, v]) => k !== '$veil' && isRec(v) && v.allowImport === false).length;
          const row = (await db.query(`insert into public.settlements (id, user_id, name, tier, data, is_public, public_slug, published_at, gallery_member_overrides, gallery_share_dm, gallery_importable)
            values (gen_random_uuid(), $1, $2, $3, $4::jsonb, true, $5, now(), $6::jsonb, $7, true) returning id::text as id, name, tier`,
          [OWNER, stored.name, tier, JSON.stringify(stored), slug, JSON.stringify(overrides), dm])).rows[0];
          await db.exec(`set test.uid = '';`);
          const tg = Date.now();
          const gallery = (await db.query('select to_jsonb(g.data) as d from public.get_gallery_dossier($1) g', [slug])).rows[0]?.d;
          tally.ms.gallery += Date.now() - tg;
          tally.byTier[tier] = (tally.byTier[tier] || 0) + Date.now() - tg;
          await db.exec(`set test.uid = '${IMPORTER}';`);
          last.row = null;
          const before = entries.length;
          const ti = Date.now(); const rpcBefore = tally.ms.importRpc;
          const newId = await importGallerySettlementImpl(
            () => ({ auth: { user: { id: IMPORTER }, tier: 'premium' }, maxSaves: () => Infinity, savedSettlements: [] }),
            (fn) => fn({ savedSettlements: [] }), slug,
          );
          tally.ms.importClient += Date.now() - ti - (tally.ms.importRpc - rpcBefore);
          await db.exec(`set test.uid = '';`);
          const tc = Date.now();
          const imported = last.row?.data;
          const dossier = await fetchDossierForImport.mock.results.at(-1)?.value;
          const clone = entries.length === before + 1 ? entries.at(-1).settlement : null;
          const where = `${tier} ${culture} #${i} ${stored.name} | ${marker} | ${dm ? 'DM' : 'off'}`;
          town.shares += 1;
          if (newId && clone && isRec(imported)) town.imported += 1;
          if (isRec(clone) && (clone._seed !== undefined || clone.config?._seed !== undefined)) red.clone.push(`${where}: seed`);
          red.a.push(...checkImportEqualsRead(where, imported, gallery, overrides));
          red.fetch.push(...checkFetch(where, dossier, imported, row, tally));
          red.clone.push(...checkClone(where, clone, imported, tally));
          const w = marker === 'unmarked' ? withheld(stored, gallery) : withheld(unmarked, gallery);
          if (w > 0) { veiled[marker].shares += 1; veiled[marker].towns.add(i); veiled[marker].rows += w; }
          if (marker === 'unmarked') unmarked = gallery;
          if (!tooth && marker !== 'unmarked' && w > 0 && isRec(gallery) && isRec(unmarked)) {
            const k = Object.keys(unmarked).find((key) => J(unmarked[key]) !== J(gallery[key]));
            if (k) tooth = { where, key: k, imported, gallery, clone, overrides, restored: { ...gallery, [k]: unmarked[k] } };
          }
          tally.ms.checks += Date.now() - tc;
        }
      }
      pool.push(town);
    }
    pool.ms = Date.now() - started;
    record(`TRAD4-RECUT MEASURE: ${pool.length} towns, ${seq} shares, ${pool.ms} ms; fetch strips ${J(tally.strips)}; masked ${tally.masked}; clone keys ${J(tally.keys)}; foreign ${J(tally.foreign)}; veiled ${J(Object.fromEntries(MARKERS.map((m) => [m, { towns: veiled[m].towns.size, shares: veiled[m].shares, rows: veiled[m].rows }])))}; tooth ${tooth?.where} ${tooth?.key}; ms ${J(tally.ms)}; gallery ms by tier ${J(tally.byTier)}`);
  }, POOL_TIMEOUT_MS);

  it('NOT VACUOUS (c): 140 towns, every tier, at least six cultures, each shared six times and imported six times; for every marker at least one town\'s share withholds a row (counted)', () => {
    expect(pool.length).toBe(N);
    expect(new Set(pool.map((x) => x.tier)).size).toBe(TIERS.length);
    expect(new Set(pool.map((x) => x.culture)).size).toBeGreaterThanOrEqual(6);
    expect(pool.filter((x) => x.neighbour !== null).map((x) => x.name)).toEqual([]); // the save's neighbour step is a no-op on every stored document
    expect(pool.filter((x) => x.shares !== 6 || x.imported !== 6).map((x) => `${x.tier} ${x.name}: ${x.shares} shares, ${x.imported} imported`)).toEqual([]);
    expect(fetchDossierForImport).toHaveBeenCalledTimes(N * 6);
    for (const m of MARKERS) expect([m, veiled[m].towns.size > 0, veiled[m].rows > 0]).toEqual([m, true, true]);
  }, ARM_TIMEOUT_MS);

  it('(a) THE IMPORT EQUALS THE GALLERY READ: import_gallery_dossier(slug).data equals get_gallery_dossier(slug).data value for value on every share (three markers, Reveal off and on); no share sets a person\'s allowImport false, so the import\'s own gate allows no difference', () => {
    expect(tally.refused).toBe(0);
    expect(red.a, `${red.a.length} differences`).toEqual([]);
  }, ARM_TIMEOUT_MS);

  it('(b1) THE FETCH: fetchDossierForImport hands the served data less only its named strips (seed, _seed, _config, config._seed, dmNotes, dossierNotes, narrativeNotes) and the civility mask, with the row\'s id, name and tier hoisted', () => {
    expect(red.fetch, `${red.fetch.length} differences`).toEqual([]);
  }, ARM_TIMEOUT_MS);

  it('(b2) THE CLONE: the saved entry\'s settlement differs from the served data only in the keys importGallerySettlementImpl changes on purpose, and carries the seed nowhere', () => {
    expect(red.clone, `${red.clone.length} differences`).toEqual([]);
  }, ARM_TIMEOUT_MS);

  it('THE TOOTH: a scratch copy of a marked share\'s served data with one veiled path restored (from the unmarked share of the same town) reds (a) and (b2); the unplanted copy passes both again', () => {
    expect(tooth, 'a marked share that withholds a row').toBeTruthy();
    const planted = [...checkImportEqualsRead(`${tooth.where} (planted)`, tooth.imported, tooth.restored, tooth.overrides),
      ...checkClone(`${tooth.where} (planted)`, tooth.clone, tooth.restored, { keys: {}, foreign: {} })];
    expect(() => expect(planted).toEqual([])).toThrow();
    expect(planted.some((r) => r.includes(`.${tooth.key}`) || r.includes(` ${tooth.key}`))).toBe(true);
    const restored = [...checkImportEqualsRead(tooth.where, tooth.imported, tooth.gallery, tooth.overrides),
      ...checkClone(tooth.where, tooth.clone, tooth.gallery, { keys: {}, foreign: {} })];
    expect(restored).toEqual([]);
    record(`TRAD4-RECUT TOOTH: ${tooth.where}: ${tooth.key} restored, ${planted.length} reds: ${planted.slice(0, 3).join(' || ')}`);
  }, ARM_TIMEOUT_MS);
});
