/**
 * gallerySecondHomes.pglite.test.js — WHAT IS HIDDEN BY HAND IS NEVER SENT, AT ANY ADDRESS
 * (COHERENCE-VEIL-6; the fifth review's V5-1, REVIEW-VEIL-211-333b33973-2026-11-13.md §2; the owner's law, record 331).
 *
 * THE FAULT IT PINS. The veil hid a fact at its one address, but the stored town keeps some facts a second
 * time, at paths the veil did not walk (the review's ten SECOND HOMES): a tie's description and tension under
 * `prominentRelationship` and inside `pressureSentence`; a current tension inside `history.siegeNarrative`; a
 * house's description and function in the defence profile's lists; the name of a house hidden whole in the
 * economy's chains and in the simulation trace; a sentence of a person's appearance inside the card's
 * impression. Each is now withheld by the eye that governs its source, in migration 212 and in the client's
 * veil (gallerySecondHomes.js, called by galleryVeil.js :: applyVeil) alike.
 *
 * HOW, BY EXECUTION AND BY TEXT, NOT BY KEY. Every string a user can hide by hand (every eye of every card kind,
 * and the data each grouping removes) is given a MARKER OF ITS OWN DURING THE BIRTH, through the generator's own
 * step hook (`options.onStep`), at the boundary of the step after which it first exists, as the review's
 * planted-marker probe does: every field a LATER step derives from it carries the marker with it. The town is
 * stored in both stored shapes (the new one, and the one the deployed client wrote: master's), shared with EVERY
 * EYE SHUT BY HAND (every grouping, every switch, every card eye, every house hidden whole, every person hidden
 * whole), with the DM reveal off and on, live and frozen, on a chain of every migration on disk. The WHOLE ROW of
 * each of the four reads (the gallery page, the party link, the map page, the import) is searched AS TEXT for any
 * marker, and for the name of every house the share hid whole. Nothing is looked for by key.
 *
 * ITS TWO LIMITS (the review's §2.1), and what covers them:
 *   (1) A MARKER CANNOT RIDE A BOOLEAN OR A NUMBER (`corrupt: true`, a capture share), nor a NAME (a name is a join
 *       key inside the birth and is not renamed: a house hidden whole is searched for by its name, as text), nor
 *       the engine's own inputs on a house (`tags`, `facets`, `serviceKeys`), which are left unmarked so the birth
 *       runs true.
 *   (2) A FIELD DERIVED IN THE SAME STEP AS ITS SOURCE IS PLANTED TOO LATE: the ties and each person's goal are
 *       written inside `assembleSettlement`, the step that also writes `prominentRelationship` and
 *       `pressureSentence`. Those need the SENTENCE SEARCH (the review's secondhome2.mjs with SENTENCES=1). The
 *       third arm below holds that class by hand: the three composed homes of a tie, and the impression, are
 *       written from marked sources on born towns, in both shapes, and must not be sent.
 * The second arm proves the guard is live: a second home this test plants itself, at a path no rule names, is
 * found.
 *
 * THE WIDER EYE (COHERENCE-VEIL-8; REVIEW-VEIL-6's twelfth: the names of houses hidden whole were still sent
 * LOWER-CASED in `economicState.compound.inst.names[]` and `economicState.safetyProfile.compound.inst.names[]`, and as
 * `institution.<snake>` in the trace's `targetId`, where every earlier search looked for the card's own spelling only).
 * A marker is letters and digits only (`Sh6K<n>Q`), so a case fold, a slug or a join keeps it; every string of every
 * response, and every key, is searched in its FOLDED form (lower case, every run of characters that are not a letter
 * or a digit made one `_`). The name of a house hidden whole is searched in its own spelling and folded on `_`
 * boundaries (a case fold, a slug, a snake or kebab key, an id such as `institution.<snake>`); an open house whose
 * name holds the hidden one is blanked first (it is not the hidden name). (A JOINED form, every separator removed,
 * meets the model's own camel-case vocabulary, `hasBlackMarket`, in every town; the lane's probe lists it,
 * docs/chair/2026-11-13/veil-probe-8/.) Six reads: the gallery read, the party link, the map page, the map's party
 * link, the town's import and the map's import.
 */
import { describe, it, expect, beforeAll, vi } from 'vitest';
import { PGlite } from '@electric-sql/pglite';
import { pgcrypto } from '@electric-sql/pglite/contrib/pgcrypto';
import { readFileSync, readdirSync } from 'node:fs';
import { resolve, join } from 'node:path';

const PGLITE_BOOT_TIMEOUT_MS = 900_000; // deadlock guard, not a perf budget — never tune to a measured boot (see pgliteHookTimeoutRatchet.test.js)
const TOWN_TIMEOUT_MS = 1_800_000;

const H = vi.hoisted(() => ({ db: null, uid: '' }));
vi.mock('../../src/lib/supabase.js', () => {
  const tableFns = new Set(['get_gallery_dossier', 'import_gallery_dossier']);
  const served = new Set(['get_gallery_dossier', 'get_unlisted_dossier', 'import_gallery_dossier', 'get_gallery_map', 'get_unlisted_map', 'import_gallery_map']);
  const supabase = {
    rpc: async (name, args = {}) => {
      if (!served.has(name)) return { data: name.startsWith('list_') ? [] : null, error: null };
      try {
        await H.db.exec(`set test.uid = '${H.uid}';`);
        const keys = Object.keys(args);
        const call = `public.${name}(${keys.map((k, i) => `${k} => $${i + 1}`).join(', ')})`;
        const r = await H.db.query(tableFns.has(name) ? `select * from ${call}` : `select ${call} as out`, keys.map((k) => args[k]));
        return { data: tableFns.has(name) ? r.rows : r.rows[0]?.out, error: null };
      } catch (e) { return { data: null, error: { message: String(e.message) } }; }
    },
  };
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

async function buildDb() {
  const db = new PGlite({ extensions: { pgcrypto } });
  await db.exec(SCAFFOLD);
  const files = readdirSync(MIGRATIONS).filter((f) => /^\d{3}_.*\.sql$/.test(f)).sort();
  const failed = [];
  for (const f of files) {
    // pg_cron / pg_net are not in pglite: their install statements become no-ops (cron.* is stubbed above).
    const sql = readFileSync(join(MIGRATIONS, f), 'utf-8').replace(/create extension if not exists (pg_cron|pg_net)( with schema extensions)?/gi, 'select 1');
    try { await db.exec(sql); } catch (e) { failed.push(`${f}: ${String(e?.message || e).slice(0, 160)}`); }
  }
  await db.exec(`insert into auth.users (id) values ('${OWNER}'), ('${READER}') on conflict do nothing;
    insert into public.profiles (id) values ('${OWNER}'), ('${READER}') on conflict do nothing;
    update public.profiles set role = 'developer' where id = '${OWNER}';
    create or replace function public.current_user_has_premium_access() returns boolean language sql stable as $f$ select true $f$;`);
  return { db, failed };
}

const isRec = (v) => !!v && typeof v === 'object' && !Array.isArray(v);
// THE MARKER: letters and digits only, so a case fold, a slug or a join keeps it (COHERENCE-VEIL-8)
const MARK = (n) => `Sh6K${n}Q`;
const TOKEN_RE = /sh6k(\d+)q/g; // read on the FOLDED string
const marked = (v) => /sh6k\d+q/i.test(JSON.stringify(v ?? null));
const fold = (s) => String(s).toLowerCase().replace(/[^a-z0-9]+/g, '_');
const foldTrim = (s) => fold(s).replace(/^_+|_+$/g, '');
const ORIGIN = new Map(); // marker number -> 'kind.key'
const at = (root, path) => path.reduce((c, seg) => (isRec(c) ? c[seg] : undefined), root);
const BROWSER = Object.freeze({ tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat',
  nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' });
// The data each grouping's remover deletes (galleryVeil.js :: GROUPING_REMOVERS), as the review's probe lists it.
const GROUPING_DATA = Object.freeze([
  ['availableServices', 'criminal'], ['economicState', 'safetyProfile', 'criminalInstitutions'], ['economicState', 'safetyProfile', 'crimeTypes'],
  ['powerStructure', 'criminalCaptureState'], ['economicState', 'safetyProfile', 'blackMarketCapture'], ['structuralViolations'], ['structuralSuggestions'],
  ['coherenceNotes'], ['generationCoherenceReceipt'], ['decrees'], ['dmLayer'],
]);
// Towns of every kind of second home the review lists (a criminal house hidden whole with its chain, the defence
// copies, the siege narrative from a current tension, the trace on a Reveal-DM share), the hamlet the smallest.
const TOWNS = Object.freeze([
  { seed: 'rv5-plant-city-infiltrated-0', settType: 'city', stress: 'infiltrated' },
  { seed: 'rv5-plant-hamlet-infiltrated-0', settType: 'hamlet', stress: 'infiltrated' },
  // a hidden house that feeds a chain under ANOTHER name (the engine's processor match: 'Black market' <= 'Black market
  // bazaar'; "Thieves' guild (powerful)" <= "Thieves' guild chapter"), found by the second instrument at item 1
  { seed: 'cv6-proc-metropolis-infiltrated-0', settType: 'metropolis', stress: 'infiltrated' },
  { seed: 'cv6-proc-city-infiltrated-2', settType: 'city', stress: 'infiltrated' },
]);

describe('COHERENCE-VEIL-6: a second home of a thing hidden by hand is never sent (V5-1)', () => {
  /** @type {any} */ let LIVE; /** @type {any} */ let veil; /** @type {any} */ let gallery; /** @type {any} */ let gen;
  /** @type {any} */ let compose; /** @type {any} */ let birthConfig; /** @type {any} */ let DEFAULT_CONFIG; /** @type {any} */ let factionIdFromName;
  /** @type {any} */ let matchesProcessor; /** @type {any} */ let instFlags;
  /** @type {any} */ let renameHouse; /** @type {any} */ let isHideableHouse; /** @type {any} */ let isCustom;
  /** @type {Map<string, string>} */ const BIRTH = new Map(); // catalogue id -> the catalogue's name (the name a stamped house was born with)
  let n = 0;

  beforeAll(async () => {
    LIVE = await buildDb();
    veil = await import('../../src/domain/display/galleryVeil.js');
    gallery = await import('../../src/lib/gallery.js');
    ({ generateSettlementPipeline: gen } = await import('../../src/generators/generateSettlementPipeline.js'));
    ({ composePublicProse: compose } = await import('../../src/components/new/publicProseCompose.js'));
    const density = await import('../../src/domain/density/densityCreateBoundary.js');
    birthConfig = density.birthConfig;
    await density.loadGenerationLawPayloads();
    ({ DEFAULT_CONFIG } = await import('../../src/store/configSlice.js'));
    ({ factionIdFromName } = await import('../../src/lib/entities.js'));
    ({ institutionMatchesProcessor: matchesProcessor } = await import('../../src/generators/computeActiveChains.js'));
    ({ getInstFlags: instFlags } = await import('../../src/generators/priorityHelpers.js'));
    ({ applyInstitutionRenameToSettlement: renameHouse } = await import('../../src/domain/institutionRename.js'));
    ({ isHideableHouse } = await import('../../src/domain/people/cardVeil.js'));
    ({ isMaterializedCustomContent: isCustom } = await import('../../src/domain/content/customContentSemanticAuthority.js'));
    const { institutionalCatalog, catalogIdForName } = await import('../../src/data/institutionalCatalog.js');
    for (const tier of Object.values(institutionalCatalog)) for (const g of Object.values(tier)) for (const nm of Object.keys(g)) if (!BIRTH.has(catalogIdForName(nm))) BIRTH.set(catalogIdForName(nm), nm);
  }, PGLITE_BOOT_TIMEOUT_MS);

  /** The marker planter: every string an eye or a grouping governs, at the step it first exists after. */
  function planter() {
    let seq = 1000; // 1, 2 and 901..904 are the hand-planted markers below
    const tok = (kind, key) => { seq += 1; ORIGIN.set(String(seq), `${kind}.${key}`); return MARK(seq); };
    const plant = (holder, key, kind) => {
      const v = holder[key];
      if (v == null || typeof v === 'boolean' || typeof v === 'number' || marked(v)) return;
      if (typeof v === 'string') { if (v.trim()) holder[key] = `${v} ${tok(kind, key)}`; } else if (Array.isArray(v)) { if (v.length) v.push(tok(kind, key)); } else if (isRec(v)) v.sh6 = tok(kind, key);
    };
    const plantAll = (root) => {
      if (!isRec(root)) return;
      for (const [kind, def] of Object.entries(veil.CARD_KINDS)) for (const path of def.lists) {
        const star = path.indexOf('*');
        const owners = star < 0 ? [root] : (Array.isArray(at(root, path.slice(0, star))) ? at(root, path.slice(0, star)).filter(isRec) : []);
        for (const o of owners) {
          const arr = at(o, star < 0 ? path : path.slice(star + 1));
          if (!Array.isArray(arr)) continue;
          for (const c of arr.filter(isRec)) for (const [eye, keys] of Object.entries(def.fields)) {
            if (kind === 'faction' && eye === 'members') continue;
            for (const key of keys) {
              if (kind === 'npc' && (key === 'institution' || key === 'linkedInstitutionIds' || key === 'relationships')) continue; // join keys: searched as names
              if (kind === 'institution' && (key === 'tags' || key === 'serviceKeys' || key === 'facets')) continue; // read by the engine's own predicates
              plant(c, key, kind);
            }
          }
        }
      }
      for (const p of GROUPING_DATA) {
        const holder = at(root, p.slice(0, -1)); const key = p[p.length - 1];
        if (isRec(holder) && Array.isArray(holder[key])) holder[key].filter(isRec).forEach((row) => { for (const f of ['desc', 'description', 'reason', 'note', 'text', 'detail']) plant(row, f, 'grouping'); });
        else if (isRec(holder) && typeof holder[key] === 'string') plant(holder, key, 'grouping');
      }
    };
    return { plantAll };
  }

  /** A person as master's client stored it (the inverse of the v1 -> v2 and v2 -> v3 steps), and a tie. */
  const oldPerson = (p) => {
    const { memberships, allegiance, institution, ...rest } = p;
    const ms = (Array.isArray(memberships) ? memberships : []).filter((m) => isRec(m) && typeof m.power === 'string');
    const out = { ...rest };
    if (ms[0]) out.factionAffiliation = ms[0].power;
    if (ms[1]) out.secondaryAffiliation = ms[1].power;
    if (ms.length) out.linkedFactionIds = ms.map((m) => factionIdFromName(m.power));
    if (isRec(institution) && institution.kind === 'house' && typeof institution.key === 'string') out.institution = institution.key;
    if (isRec(allegiance)) { out.corrupt = true; out.corruptionVector = allegiance.vector ?? null; }
    return out;
  };
  const oldTie = ({ from, to, id: _id, ...rest }) => ({ ...rest, npc1Id: from, npc2Id: to });
  const shapes = (born) => ({
    new: { ...born, publicProse: compose(born) },
    old: (() => {
      const s = structuredClone(born);
      s.npcs = (s.npcs || []).map((p) => (isRec(p) ? oldPerson(p) : p));
      s.relationships = (s.relationships || []).map((t) => (isRec(t) && 'from' in t ? oldTie(t) : t));
      s.schemaVersion = 1;
      return s;
    })(),
  });

  /** Every eye of the share panel, shut by hand (every grouping, switch, card eye, house hidden whole, person hidden whole). */
  function everyEyeShut(pub) {
    const m = veil.curateModelFor(pub, []);
    return m.sections.flatMap((sec) => [...sec.groupings.map((g) => g.address), ...sec.switches.map((x) => x.address),
      ...sec.cards.flatMap((c) => [...(c.whole ? [c.whole.address] : []), ...c.eyes.map((e) => e.address), ...(c.kind === 'npc' ? [`card:npc:${c.id}`] : [])])]);
  }

  /** Store the record as shares with every eye shut, read each of the four reads, and search every whole row as text. */
  async function sharesOf(record, label) {
    const db = LIVE.db; H.db = db;
    const sent = []; let reads = 0; let pages = 0;
    for (const dm of [false, true]) {
      const pub = veil.galleryPayloadFor(record, { shareDm: dm, memberOverrides: {} });
      const eyes = everyEyeShut(pub);
      // COHERENCE-VEIL-8, the chair's ruling (a): a third share a reveal, `houses`: the houses hidden whole and EVERY
      // OTHER EYE OPENED by hand (each default opened), so the name of a hidden house in a home a grouping or an eye
      // would otherwise remove (a person's goal, the criminal houses' list, the public prose) is seen; only the names,
      // the booleans and what is taken count on it (the rest is open on it)
      const houseEyes = new Set(veil.curateModelFor(pub, []).sections.flatMap((sec) => sec.cards.flatMap((c) => (c.whole ? [c.whole.address] : []))));
      for (const mode of ['live', 'snapshot', 'houses']) {
        n += 1;
        const id = `5ec0de60-0000-0000-0000-${String(n).padStart(12, '0')}`;
        const ov = veil.writeShareVeil({}, eyes.map((a) => ({ address: a, hidden: mode === 'houses' ? houseEyes.has(a) : true })),
          mode === 'snapshot' ? { mode, at: '2026-11-01T00:00:00.000Z', snapshot: pub } : { mode: 'live', at: '2026-11-01T00:00:00.000Z' });
        await db.query(`insert into public.settlements (id, user_id, name, tier, data, is_public, public_slug, published_at, unlisted_slug, visibility,
            gallery_member_overrides, gallery_share_dm, gallery_importable)
          values ($1, $2, $3, $4, $5, true, $6, now(), $7, 'unlisted', $8, $9, true)`,
        [id, OWNER, String(record.name || 'T'), String(record.tier || 'town'), JSON.stringify(record), `sh${n}`, `shl${n}`, JSON.stringify(ov), dm]);
        await db.query(`insert into public.saved_maps (id, user_id, name, map_data, is_public, public_slug, unlisted_slug, visibility, share_kind, gallery_share_campaign, gallery_importable)
          values (gen_random_uuid(), $1, 'm', $2, true, $3, $4, 'unlisted', 'map_with_campaign', true, true)`, [OWNER, JSON.stringify({ campaign: { settlementIds: [id] } }), `shm${n}`, `shn${n}`]);
        await db.exec(`set test.uid = '';`);
        const g = (await db.query('select * from public.get_gallery_dossier($1)', [`sh${n}`])).rows[0];
        const resp = { gallery: g,
          link: (await db.query('select public.get_unlisted_dossier($1) x', [`shl${n}`])).rows[0]?.x,
          map: (await db.query('select public.get_gallery_map($1) x', [`shm${n}`])).rows[0]?.x,
          maplink: (await db.query('select public.get_unlisted_map($1) x', [`shn${n}`])).rows[0]?.x };
        await db.exec(`set test.uid = '${READER}';`);
        resp.import = (await db.query('select * from public.import_gallery_dossier($1)', [`sh${n}`])).rows[0];
        resp.mapimport = (await db.query('select public.import_gallery_map($1) x', [`shm${n}`])).rows[0]?.x;
        await db.exec(`set test.uid = '';`);
        // the names of the houses this share hid whole (the gallery response no longer lists them)
        const listed = new Set((g?.data?.institutions || []).filter(isRec).map((i) => i.name));
        const goneCards = (record.institutions || []).filter((i) => isRec(i) && typeof i.name === 'string' && !listed.has(i.name));
        const openCards = (record.institutions || []).filter((i) => isRec(i) && typeof i.name === 'string' && listed.has(i.name));
        const gone = goneCards.map((i) => i.name).filter((x) => x.length >= 6);
        // VEIL-9 (the chair's ruling on PART 9's limits): a house's name in any spelling includes the name it was BORN
        // with, which a stamped house keeps as its catalogue identity (the rename's writer, institutionRename.js, moves
        // `name` only): it is searched too, and an open house's own birth name is blanked like its name
        const birthOf = (i) => (typeof i.catalogId === 'string' && BIRTH.has(i.catalogId) ? BIRTH.get(i.catalogId) : null);
        for (const i of goneCards) { const b = birthOf(i); if (b && b.length >= 6 && !gone.includes(b)) gone.push(b); }
        // the names a chain gives a hidden house, by the ENGINE's own processor match (computeActiveChains.js ::
        // institutionMatchesProcessor, id-first): a processing name only hidden houses answer to is that house's name
        for (const c of (isRec(record.economicState) && Array.isArray(record.economicState.activeChains) ? record.economicState.activeChains : []).filter(isRec)) {
          for (const x of Array.isArray(c.processingInstitutions) ? c.processingInstitutions : []) {
            if (typeof x === 'string' && x.length >= 6 && !gone.includes(x) && goneCards.some((h) => matchesProcessor(h, x)) && !openCards.some((h) => matchesProcessor(h, x))) gone.push(x);
          }
        }
        // each hidden name in its own spelling and folded; an open house whose name holds it is blanked first
        const openFold = [...openCards.map((i) => foldTrim(i.name)), ...openCards.map(birthOf).filter(Boolean).map(foldTrim)].filter(Boolean);
        const names = gone.map((nm) => ({ nm, f: foldTrim(nm), re: new RegExp(`(^|_)${foldTrim(nm)}(_|$)`) }));
        // COHERENCE-VEIL-8 (T1): every event's lasting effects, shut by hand here, in ANY case (a composer lower-cases
        // the first letter of what it embeds: legacyGenerator.js :: annotationBody). The marker rides the list as an
        // entry of its own, so an effect embedded elsewhere carries none: it is searched as folded text.
        const effects = [...new Set((['historicalEvents', 'eventsTimeline']).flatMap((k) => (isRec(record.history) && Array.isArray(record.history[k]) ? record.history[k] : []))
          .filter(isRec).flatMap((ev) => (Array.isArray(ev.lastingEffects) ? ev.lastingEffects : []))
          .filter((x) => typeof x === 'string' && !marked(x)).map(foldTrim).filter((x) => x.length >= 12))];
        // THE CLIENT'S TWIN (COHERENCE-VEIL-8; REVIEW-VEIL-6's V6-2: a page arm draws a response the server already
        // cut, so it cannot hold the twin): the client's own veil over the share's own projection, searched with the
        // same eye as a read of its own (`client`), never served
        resp.client = veil.projectShareVeil(veil.galleryPayloadFor(record, { shareDm: dm, memberOverrides: ov }), ov);
        for (const [read, body] of Object.entries(resp)) {
          if (read !== 'client') reads += 1;
          if (!body) { sent.push(`${label} dm=${dm} ${mode} ${read}: NO ROW`); continue; }
          const walk = (v, p) => {
            if (Array.isArray(v)) v.forEach((x) => walk(x, `${p}[]`));
            else if (isRec(v)) for (const [k, x] of Object.entries(v)) { walk(k, `${p ? `${p}.` : ''}<key>`); walk(x, p ? `${p}.${k}` : k); }
            else if (typeof v === 'string') {
              const fv = fold(v);
              if (mode !== 'houses') for (const t of fv.matchAll(TOKEN_RE)) sent.push(`${label} dm=${dm} ${mode} ${read}: ${ORIGIN.get(t[1]) || '?'} (${v.includes(MARK(t[1])) ? 'its own spelling' : 'folded'}) at ${p}`);
              for (const h of names) {
                let how = v.includes(h.nm) ? 'its own spelling' : null;
                if (!how) { let fb = fv; for (const o of openFold) if (o !== h.f && o.includes(h.f)) fb = fb.split(o).join('#'); if (h.re.test(fb)) how = 'folded, slugged or an id'; }
                if (how) sent.push(`${label} dm=${dm} ${mode} ${read}: the house "${h.nm}", hidden whole, or its name in a chain (${how}), at ${p}`);
              }
              if (mode !== 'houses') for (const e of effects) if (`_${fv}_`.includes(`_${e}_`)) sent.push(`${label} dm=${dm} ${mode} ${read}: an event's lasting effect, shut, in any case, at ${p}`);
            }
          };
          walk(body, '');
          // COHERENCE-VEIL-8, the chair's ruling (b): the engine's five criminal-house booleans read as the houses the
          // response still lists would raise them (the engine's own getInstFlags over that list); and (c): a criminal
          // income row (its label made from the hidden criminal list, its sentence the hidden capture figure) is not
          // sent where the groupings that hide them are shut (every grouping is shut on these shares)
          const FIVE = ['hasCriminalInst', 'hasThievesGuild', 'hasBlackMarket', 'hasSmuggling', 'hasGangInfra'];
          const settled = (v) => (Array.isArray(v) ? v.flatMap(settled) : isRec(v) ? [...(isRec(v.economicState) ? [v] : []), ...Object.values(v).filter((x) => x !== v.economicState).flatMap(settled)] : []);
          for (const t of settled(body)) {
            // (VEIL-9: by each listed house's identity, the name it was born with, which is the name the engine read)
            const listed = instFlags({}, (Array.isArray(t.institutions) ? t.institutions : []).filter(isRec).map((i) => (birthOf(i) ? { ...i, name: birthOf(i) } : i))).inst;
            for (const at2 of [t.economicState?.compound?.inst, t.economicState?.safetyProfile?.compound?.inst]) {
              if (isRec(at2)) for (const f of FIVE) if (at2[f] === true && !listed[f]) sent.push(`${label} dm=${dm} ${mode} ${read}: the boolean ${f}, raised only by a house the response does not list`);
            }
            // VEIL-9 (iii): every entry of the two name lists that a house the response STILL LISTS was stamped with is
            // still sent. The record's lists are the engine's lower-cased native roster in the roster's own order
            // (priorityHelpers.js :: getInstitutionNames), so entry k is the k-th native house of the record, whatever it
            // is called now (a rename moves `name` only); a list that is not that roster's length is counted, not read
            const nativeRec = (Array.isArray(record.institutions) ? record.institutions : []).filter((i) => isRec(i) && !isCustom(i));
            const listedNow = (Array.isArray(t.institutions) ? t.institutions : []).filter(isRec).map((i) => i.name);
            for (const [pth, sentInst] of [[['economicState', 'compound', 'inst'], t.economicState?.compound?.inst], [['economicState', 'safetyProfile', 'compound', 'inst'], t.economicState?.safetyProfile?.compound?.inst]]) {
              const recList = at(record, [...pth, 'names']);
              if (!Array.isArray(recList) || !isRec(sentInst)) continue;
              if (recList.length !== nativeRec.length) { sent.push(`${label} ${read}: a stored name list is not the roster's length (${recList.length} of ${nativeRec.length})`); continue; }
              const left = [...listedNow];
              const owed = [];
              nativeRec.forEach((h, k) => { const j = left.indexOf(h.name); if (j >= 0) { left.splice(j, 1); owed.push(recList[k]); } });
              const got = Array.isArray(sentInst.names) ? [...sentInst.names] : [];
              for (const e of owed) { const j = got.indexOf(e); if (j >= 0) got.splice(j, 1); else sent.push(`${label} dm=${dm} ${mode} ${read}: a listed house's entry "${e}" left ${pth.join('.')}.names`); }
            }
            for (const r of Array.isArray(t.economicState.incomeSources) ? t.economicState.incomeSources : []) {
              if (mode !== 'houses' && isRec(r) && r.isCriminal === true) sent.push(`${label} dm=${dm} ${mode} ${read}: a criminal income row (${r.source}), its groupings shut`);
            }
            // and nothing open is taken: every income row that is not criminal stays (the record's, by label)
            const openRows = (isRec(record.economicState) && Array.isArray(record.economicState.incomeSources) ? record.economicState.incomeSources : [])
              .filter((r) => isRec(r) && r.isCriminal !== true).map((r) => r.source);
            const sentRows = new Set((Array.isArray(t.economicState.incomeSources) ? t.economicState.incomeSources : []).filter(isRec).map((r) => r.source));
            for (const src of openRows) if (!sentRows.has(src) && !names.some((h) => fold(src).includes(h.f))) sent.push(`${label} dm=${dm} ${mode} ${read}: an open income row (${src}) was taken`);
          }
          // COHERENCE-VEIL-8 (N3): a tie's copy of an end's role, where that person's own entry in the same response
          // carries no role (a person the share does not reveal, sent as a veiled public card: 206). COHERENCE-VEIL-14: by
          // the VALUE, as the server judges the sent card: the twin's card can hold the key with no value, which no JSON sends
          const towns = (v) => (Array.isArray(v) ? v.flatMap(towns) : isRec(v) ? [...(Array.isArray(v.npcs) && Array.isArray(v.relationships) ? [v] : []), ...Object.values(v).flatMap(towns)] : []);
          for (const t of towns(body)) {
            const roleless = new Set(t.npcs.filter((x) => isRec(x) && typeof x.id === 'string' && x.role === undefined).map((x) => x.id));
            for (const r of t.relationships.filter(isRec)) {
              for (const [end, key] of [[r.from ?? r.npc1Id, 'npc1Role'], [r.to ?? r.npc2Id, 'npc2Role']]) {
                if (mode !== 'houses' && roleless.has(String(end)) && typeof r[key] === 'string') sent.push(`${label} dm=${dm} ${mode} ${read}: a tie's copy of a role its person's entry withholds, at relationships[].${key}`);
              }
            }
          }
        }
        // the page still draws, plainly, without what was withheld
        H.uid = '';
        const page = await gallery.fetchPublicDossier(`sh${n}`);
        if (!isRec(page)) sent.push(`${label} dm=${dm} ${mode}: the gallery page did not draw`); else pages += 1;
      }
    }
    return { sent, reads, pages };
  }

  const birth = (t, onStepExtra) => {
    const { plantAll } = planter();
    const cfg = { ...DEFAULT_CONFIG, ...BROWSER, settType: t.settType, ...(t.stress ? { selectedStresses: [t.stress], selectedStressesRandom: false } : {}) };
    const born = gen(birthConfig(cfg), null, { seed: t.seed, customContent: {}, onStep: (name, ctx) => {
      plantAll(ctx); if (isRec(ctx.settlement)) plantAll(ctx.settlement);
      if (onStepExtra) onStepExtra(name, ctx);
    } });
    plantAll(born);
    ORIGIN.set('1', 'grouping.decrees'); ORIGIN.set('2', 'grouping.dmLayer');
    born.decrees = [{ id: 'd1', text: `A decree ${MARK(1)}` }];
    born.dmLayer = { notes: `A note ${MARK(2)}` };
    return born;
  };

  it('every string hidden by hand, marked at birth: nothing of it, and no name of a house hidden whole, in any of the four reads, both shapes, DM off and on, live and frozen', async () => {
    expect(LIVE.failed).toEqual([]);
    const sent = []; let reads = 0; let pages = 0; let markers = 0;
    for (const t of TOWNS) {
      const born = birth(t);
      markers += (fold(JSON.stringify(born)).match(TOKEN_RE) || []).length;
      for (const [shape, record] of Object.entries(shapes(born))) {
        const r = await sharesOf(record, `${t.seed} ${shape}`);
        sent.push(...r.sent); reads += r.reads; pages += r.pages;
      }
    }
    expect(markers).toBeGreaterThan(1000);
    expect(reads).toBe(TOWNS.length * 2 * 6 * 6);
    expect(pages).toBe(TOWNS.length * 2 * 6);
    expect([...new Set(sent)]).toEqual([]);
  }, TOWN_TIMEOUT_MS);

  it('THE GUARD IS LIVE: a second home this test plants itself, at a path no rule names, is found', async () => {
    // after the birth's last step, a hidden house's description is copied to a key nothing withholds
    const t = TOWNS[0];
    const born = birth(t);
    const house = (born.institutions || []).find((i) => isRec(i) && typeof i.desc === 'string' && marked(i.desc));
    expect(house).toBeTruthy();
    born.economicState.secondHomePlantedByTheGuard = house.desc;
    const r = await sharesOf(shapes(born).new, `${t.seed} planted`);
    const found = r.sent.filter((x) => x.includes('economicState.secondHomePlantedByTheGuard'));
    // five of the six reads carry the town (the map's party link, get_unlisted_map, carries no member town at all),
    // and the client's twin does (COHERENCE-VEIL-8)
    expect(found.length).toBe(4 * 6);
  }, TOWN_TIMEOUT_MS);

  it('A HOUSE BY EVERY NAME (VEIL-9; the chair\'s ruling on PART 9\'s limits): a house renamed after birth and hidden whole is sent by neither name; a hidden name the two engines fold differently is not sent lower-cased; every entry of a house still listed, a renamed one included, still is', async () => {
    const sent = []; const planted = [];
    for (const t of [TOWNS[0], TOWNS[2]]) {
      const born = birth(t);
      const nativeRec = (born.institutions || []).filter((i) => isRec(i) && !isCustom(i));
      const stamped = (i) => typeof i.catalogId === 'string' && foldTrim(i.name) === i.catalogId;
      const hide = nativeRec.filter((i) => stamped(i) && isHideableHouse(i));
      const open = nativeRec.filter((i) => stamped(i) && !isHideableHouse(i));
      expect(hide.length).toBeGreaterThanOrEqual(2);
      const [h1, h2] = hide; const h3 = open[open.length - 1];
      const [b1, b2, b3] = [h1.name, h2.name, h3.name];
      // (i) the rename's own writer, after the birth (institutionRename.js moves `name`; the house keeps its catalogue
      // identity, the fold of the name it was born with), then hidden whole by the share
      expect(renameHouse(born, b1, 'Qorvath hall').changed).toBe(true);
      // (iii) a house the share leaves open, renamed the same way: the entry it was stamped with is still owed
      expect(renameHouse(born, b3, 'Brannoch yard').changed).toBe(true);
      // (ii) a hidden name holding a dotted capital I and the Kelvin sign, whose lower-cased copy, as the engine stamps it
      // (JavaScript's toLowerCase), stands in both lists at the house's own place in the roster
      const odd = '\u0130lvark \u212Amarket';
      expect(renameHouse(born, b2, odd).changed).toBe(true);
      const k2 = nativeRec.indexOf(h2);
      for (const inst of [born.economicState?.compound?.inst, born.economicState?.safetyProfile?.compound?.inst]) {
        expect(inst.names[k2]).toBe(b2.toLowerCase());
        inst.names[k2] = odd.toLowerCase();
      }
      planted.push(`${t.seed}: "${b1}" renamed "Qorvath hall" and hidden; "${b2}" renamed "${odd}" and hidden; "${b3}" renamed "Brannoch yard", open`);
      for (const [shape, record] of Object.entries(shapes(born))) {
        const r = await sharesOf(record, `${t.seed} ${shape} by-every-name`);
        sent.push(...r.sent);
      }
    }
    expect(planted.length).toBe(2);
    expect([...new Set(sent)]).toEqual([]);
  }, TOWN_TIMEOUT_MS);

  it('THE TWO FOLDS ARE ONE (VEIL-9; re-keyed by VEIL-10 to the name search): the server\'s _gallery_veil_name_fold gives the client\'s nameFold for every character of the basic plane, alone and inside a name, and both engines write the same needle for each; the catalogue identity\'s fold (_gallery_veil_fold, foldName) is one in both engines too, whatever the database\'s lower() does', async () => {
    const { foldName, nameFold, buildNameSearch } = await import('../../src/domain/display/gallerySecondHomes.js');
    // the only characters outside A-Z whose JavaScript lower case holds a letter a-z (the catalogue fold's SQL spells these out)
    const special = [];
    for (let cp = 1; cp <= 0x10ffff; cp += 1) {
      if (cp >= 0xd800 && cp <= 0xdfff) continue;
      const c = String.fromCodePoint(cp);
      if (!/[A-Za-z0-9]/.test(c) && /[a-z0-9]/.test(c.toLowerCase())) special.push(cp);
    }
    expect(special).toEqual([0x130, 0x212a]);
    const probes = [];
    for (let cp = 1; cp <= 0xffff; cp += 1) if (cp < 0xd800 || cp > 0xdfff) probes.push(String.fromCodePoint(cp), `Ab${String.fromCodePoint(cp)}Cd q`);
    probes.push('\u0130lvark \u212Amarket', "Thieves' Guild (Powerful)", 'institution.thieves_guild_powerful', '\u{1F600}Zz\u{10400}');
    const hex = (t) => [...t].map((c) => c.codePointAt(0).toString(16)).join(' ');
    // (1) THE CATALOGUE IDENTITY'S FOLD (the positive account and the processor match compare with it): as VEIL-9 pinned it
    const r = await LIVE.db.query('select coalesce(jsonb_agg(public._gallery_veil_fold(t) order by o), \'[]\') as f from jsonb_array_elements_text($1::jsonb) with ordinality x(t, o)', [JSON.stringify(probes)]);
    const server = r.rows[0].f;
    expect(server.length).toBe(probes.length);
    expect(probes.filter((t, i) => server[i] !== foldName(t)).map(hex)).toEqual([]);
    // (2) THE NAME SEARCH'S FOLD (VEIL-10: the letters of every script kept; NFKD, the marks U+0300..U+036F removed, A-Z
    // lowered by an explicit map, a run of separators one '_'): the same string in both engines for every probe
    const r2 = await LIVE.db.query('select coalesce(jsonb_agg(public._gallery_veil_name_fold(t) order by o), \'[]\') as f from jsonb_array_elements_text($1::jsonb) with ordinality x(t, o)', [JSON.stringify(probes)]);
    const server2 = r2.rows[0].f;
    expect(server2.length).toBe(probes.length);
    expect(probes.filter((t, i) => server2[i] !== nameFold(t)).map(hex)).toEqual([]);
    // it is not the catalogue's fold: a letter outside ASCII is kept (in its case: case is the needle's; a mark is no
    // part of a letter, so the short i is i), and no engine's lower() is asked
    expect(nameFold('Гильдия теней')).toBe('Гильдия_тенеи');
    expect(foldName('Гильдия теней')).toBe('');
    expect(nameFold('\u0130lvark \u212Amarket')).toBe('ilvark_kmarket');
    // (3) THE NEEDLE: every probe a hidden name of its own, ONE search: the two engines build the same pattern, character
    // for character (each letter's case class from the one table both carry), and the same names searched as written
    const r3 = await LIVE.db.query('select public._gallery_veil_name_search(array(select jsonb_array_elements_text($1::jsonb)), array[]::text[]) as j', [JSON.stringify(probes)]);
    const client = buildNameSearch(probes, []);
    expect(r3.rows[0].j.p === client.pattern).toBe(true);
    expect(client.pattern.length).toBeGreaterThan(500000);
    expect(r3.rows[0].j.raw).toEqual(client.raws);
    // and the database's own lower() is not the client's (the limit this cures)
    const low = (await LIVE.db.query('select lower($1) as l', ['\u0130\u212A'])).rows[0].l;
    expect(low === '\u0130\u212A'.toLowerCase()).toBe(false);
  }, TOWN_TIMEOUT_MS);

  it('THE SAME-STEP CLASS (the limit the marker cannot reach): the composed homes of a tie and a person\'s impression, written from marked sources, are not sent', async () => {
    const sent = [];
    for (const t of TOWNS.slice(0, 2)) {
      const born = birth(t);
      const ties = (born.relationships || []).filter(isRec);
      const tie = ties[0];
      expect(tie).toBeTruthy();
      ORIGIN.set('901', 'relationship.description'); ORIGIN.set('902', 'relationship.tension'); ORIGIN.set('903', 'relationship.tension'); ORIGIN.set('904', 'npc.physical');
      tie.description = `${tie.description || 'A tie.'} — the detail ${MARK(901)}`;
      tie.tension = `${tie.tension || 'Strain.'} ${MARK(902)}`;
      born.prominentRelationship = { npc1: tie.npc1Name, npc2: tie.npc2Name, type: tie.typeName,
        phrasing: `${tie.npc1Name} and ${tie.npc2Name} are closely tied. ${tie.tension}`, full: tie.description, tension: tie.tension };
      const other = ties[ties.length - 1];
      other.tension = `${other.tension || 'Strain.'} ${MARK(903)}`;
      born.pressureSentence = `Word is that ${other.tension}`;
      const person = (born.npcs || []).find((p) => isRec(p) && isRec(p.physical) && isRec(p.presentation));
      person.physical.clothes = `Plain clothes and a habit of watching the door ${MARK(904)}.`;
      person.presentation.impression = `Guarded. ${person.physical.clothes}`;
      for (const [shape, record] of Object.entries(shapes(born))) {
        const r = await sharesOf(record, `${t.seed} ${shape} same-step`);
        sent.push(...r.sent);
      }
    }
    expect([...new Set(sent)]).toEqual([]);
  }, TOWN_TIMEOUT_MS);

  it('THE ROLE BY ITS VALUE (COHERENCE-VEIL-14): on a Reveal-DM share, the ties of a person switched off by hand whose card carries no role (the twin\'s card holds the key with no value) send no copy of one, by the server, the client\'s twin or the page; a revealed person, and a person switched off whose card holds a role, keep the tie\'s copy', async () => {
    // THE HAND TOWN: p1 carries no role and is switched off by hand; each of its ties copies a role in a form the earlier
    // markers lacked (a dotted capital I and a sharp s, Greek, Cyrillic, symbols only), at either end. THE CONTROLS: p2
    // (a role) and p3 (none) are revealed (no override); p4 is switched off by hand and its card holds a role
    const MARKS = ['ROLEMARK İß ✦', 'ΡΟΛΟΣ σφραγίδα', 'РОЛЬ печать', '✦✧◆★'];
    const town = { name: 'Role crossing', tier: 'town',
      npcs: [{ id: 'p1', name: 'Nataşa', category: 'x' }, { id: 'p2', name: 'Other', role: 'the smith' },
        { id: 'p3', name: 'Ilse', category: 'x' }, { id: 'p4', name: 'Bohdan', role: 'the ferryman' }],
      relationships: [{ id: 't1', from: 'p1', to: 'p2', npc1Role: MARKS[0], npc2Role: 'the smith' },
        { id: 't2', from: 'p2', to: 'p1', npc1Role: 'the smith', npc2Role: MARKS[1] },
        { id: 't3', from: 'p1', to: 'p4', npc1Role: MARKS[2], npc2Role: 'the ferryman' },
        { id: 't4', from: 'p3', to: 'p1', npc1Role: 'the quiet reeve', npc2Role: MARKS[3] }] };
    const CONTROLS = [['p1>p2', 'npc2Role', 'the smith'], ['p2>p1', 'npc1Role', 'the smith'], ['p1>p4', 'npc2Role', 'the ferryman'], ['p3>p1', 'npc1Role', 'the quiet reeve']];
    const towns = (v) => (Array.isArray(v) ? v.flatMap(towns) : isRec(v) ? [...(Array.isArray(v.npcs) && Array.isArray(v.relationships) ? [v] : []), ...Object.values(v).flatMap(towns)] : []);
    const ends = (r) => `${r.from ?? r.npc1Id}>${r.to ?? r.npc2Id}`;
    const canon = (v) => (Array.isArray(v) ? v.map(canon) : isRec(v) ? Object.fromEntries(Object.keys(v).filter((k) => v[k] !== undefined).sort().map((k) => [k, canon(v[k])])) : v);
    const tiesOf = (body) => JSON.stringify(canon(towns(body).map((t) => t.relationships)));
    const db = LIVE.db; H.db = db;
    const sent = []; const lost = []; const unequal = []; let reads = 0;
    for (const [shape, record] of Object.entries(shapes(town))) {
      const pub = veil.galleryPayloadFor(record, { shareDm: true, memberOverrides: {} });
      for (const mode of ['live', 'snapshot']) {
        n += 1;
        const id = `5ec0de60-0000-0000-0000-${String(n).padStart(12, '0')}`;
        const ov = veil.writeShareVeil({}, [{ address: 'card:npc:p1', hidden: true }, { address: 'card:npc:p4', hidden: true }],
          mode === 'snapshot' ? { mode, at: '2026-11-01T00:00:00.000Z', snapshot: pub } : { mode: 'live', at: '2026-11-01T00:00:00.000Z' });
        expect([ov.p1, ov.p2, ov.p3, ov.p4]).toEqual([{ revealDm: false }, undefined, undefined, { revealDm: false }]);
        await db.query(`insert into public.settlements (id, user_id, name, tier, data, is_public, public_slug, published_at, unlisted_slug, visibility,
            gallery_member_overrides, gallery_share_dm, gallery_importable)
          values ($1, $2, $3, $4, $5, true, $6, now(), $7, 'unlisted', $8, true, true)`,
        [id, OWNER, record.name, record.tier, JSON.stringify(record), `sh${n}`, `shl${n}`, JSON.stringify(ov)]);
        await db.exec(`set test.uid = '';`);
        const resp = { gallery: (await db.query('select * from public.get_gallery_dossier($1)', [`sh${n}`])).rows[0] };
        await db.exec(`set test.uid = '${READER}';`);
        resp.import = (await db.query('select * from public.import_gallery_dossier($1)', [`sh${n}`])).rows[0];
        await db.exec(`set test.uid = '';`);
        // the client's twin as the guard computes it (sharesOf), and the client's read path over the stored row (the page)
        resp.client = veil.projectShareVeil(veil.galleryPayloadFor(record, { shareDm: true, memberOverrides: ov }), ov);
        H.uid = '';
        resp.page = await gallery.fetchPublicDossier(`sh${n}`);
        const label = `${shape} ${mode}`;
        for (const [read, body] of Object.entries(resp)) {
          reads += 1;
          if (!body) { sent.push(`${label} ${read}: NO ROW`); continue; }
          const text = JSON.stringify(body);
          for (const m of MARKS) if (text.includes(m) || text.toLowerCase().includes(m.toLowerCase())) sent.push(`${label} ${read}: the tie's copy "${m}" of a role p1's card does not carry`);
          const found = towns(body);
          if (!found.length) lost.push(`${label} ${read}: no town`);
          for (const t of found) {
            const byEnds = new Map(t.relationships.filter(isRec).map((r) => [ends(r), r]));
            for (const [tie, key, want] of CONTROLS) if (byEnds.get(tie)?.[key] !== want) lost.push(`${label} ${read}: the control "${want}" left the tie ${tie}`);
          }
        }
        for (const read of ['gallery', 'import']) if (resp[read] && tiesOf(resp.client) !== tiesOf(resp[read])) unequal.push(`${label}: the twin's ties are not the ${read} read's: ${tiesOf(resp.client)} != ${tiesOf(resp[read])}`);
      }
    }
    expect(reads).toBe(2 * 2 * 4);
    expect({ sent: [...new Set(sent)], lost, unequal }).toEqual({ sent: [], lost: [], unequal: [] });
  }, TOWN_TIMEOUT_MS);
});
