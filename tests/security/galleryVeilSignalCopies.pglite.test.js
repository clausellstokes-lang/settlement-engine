// @vitest-environment jsdom
/**
 * galleryVeilSignalCopies.pglite.test.js — THE SHUT GROUPING'S SIGNAL SURVIVES A COPY (ruling VR17 of the sixth chair,
 * 2026-11-19 09:42 UTC, from the security reader's commit 3da0516c7; vetoable by the owner).
 *
 * THE FAULT IT PINS. A shut grouping removes its DATA from the page model, but a block DERIVED from identity facts the
 * veil keeps (Defense's criminal-structure label and ring note read the house names and the powers' roster) can only be
 * silenced by a SIGNAL beside the data. That signal lived in a WeakMap keyed by the page model OBJECT
 * (galleryVeil.js :: VEILED_GROUPINGS), so any copy lost it and drew the block a visitor never sees. Measured at
 * bedd5a392 (docs/chair/2026-11-20/veil/vr17/out/): a structuredClone of the page model; the gallery page AND the party
 * link whenever the civility mask changes any string (gallery.js :: sanitizeDossier -> veilPublicPayload -> civility.js ::
 * veilDeep rebuilds every changed object); the public campaign map's member dossier (get_gallery_map sends no list).
 *
 * THE CURE (galleryVeil.js :: GROUPING_OPEN_EVIDENCE, read by isVeiled on a visitor's page): a grouping with a derived
 * block is drawn open only where the page model PROVES it open by the keys its remover deletes and the generator always
 * writes (Defense's: safetyProfile.criminalInstitutions; R3-TELL-8: crimeTypes is withheld on EVERY read since the eighth
 * chair's ruling (b), so its absence is no evidence and the operations list alone is). The evidence IS the served data, so every copy
 * keeps it by construction, the map member follows the DM's eyes, and no key is added to any payload or record.
 *
 * HOW, BY EXECUTION ONLY. An in-process pglite chain of every migration on disk; born towns (the generator, a browser's
 * dials) stored in BOTH stored shapes (the current client's, and master's: ties by `npc1Id`/`npc2Id`, the top-level
 * `factions[]`); each family grouping (criminalVeilSwitch.js's family: criminal services, Defense's criminal
 * architecture, Power's capture reading) shut ALONE by the share panel's own writer, the other two opened, and the
 * control with all three opened. Each surface is read by the tree's own client (src/lib/gallery.js) as an anonymous
 * visitor and drawn by the tree's own components, walked by tests/components/pageCensusWalk.shared.mjs :: walkDossier
 * (every group, sub-tab and disclosure).
 *
 * WHAT MUST HOLD, for each grouping G and each surface S:
 *   (A) S with G shut draws NONE of G's lines (the lines the gallery page draws with G open and not with G shut);
 *   (B) THE CONTROL: S with G open draws every line of G's DERIVED block (the lines the open page loses when only the
 *       signal names G), and Defense's derived block is non-empty on every town, at a desktop's and a phone's width;
 *   (C) where the registry withholds the evidence key for a hidden house (criminalInstitutions), the derived block is not
 *       drawn though the grouping is open (intended: the page cannot prove it open). R3-TELL-8: crimeTypes left (C): it is
 *       withheld on every read and the page re-derives it (pageRederive.js :: rederiveCrimeTypes), so it proves nothing;
 *   (D) no shared page offers a print, PDF, journal, Foundry or download control: those surfaces run on the viewer's
 *       own saved record only (SettlementDetail), never on a page model.
 * Each surface is walked at a desktop's width and, for the page, the civility-masked page, the map member and a clone,
 * at a phone's (375 px), each against its own width's reference.
 */
import { describe, it, expect, beforeAll, vi } from 'vitest';
import { PGlite } from '@electric-sql/pglite';
import { pgcrypto } from '@electric-sql/pglite/contrib/pgcrypto';
import { readFileSync, readdirSync } from 'node:fs';
import { resolve, join } from 'node:path';

const PGLITE_BOOT_TIMEOUT_MS = 900_000; // deadlock guard, not a perf budget — never tune to a measured boot (see pgliteHookTimeoutRatchet.test.js)
const TOWN_TIMEOUT_MS = 1_800_000;

const H = vi.hoisted(() => ({ db: null, uid: '', last: null, store: {}, width: 1280, listeners: new Map(), controls: [] }));
vi.mock('../../src/lib/supabase.js', () => {
  const tableFns = new Set(['get_gallery_dossier', 'import_gallery_dossier']);
  const served = new Set(['get_gallery_dossier', 'get_unlisted_dossier', 'import_gallery_dossier', 'get_gallery_map']);
  const supabase = {
    auth: { getSession: async () => ({ data: { session: null } }), getUser: async () => ({ data: { user: null } }), onAuthStateChange: () => ({ data: { subscription: { unsubscribe() {} } } }) },
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
    from: () => ({ select: () => ({ eq: () => ({ maybeSingle: async () => ({ data: null, error: null }), single: async () => ({ data: null, error: null }) }) }) }),
  };
  return { supabase, isConfigured: true, default: supabase };
});
vi.mock('../../src/store/index.js', () => {
  const useStore = (sel) => sel(H.store);
  useStore.subscribe = () => () => {}; useStore.getState = () => H.store; useStore.setState = () => {};
  return { useStore, default: useStore };
});
vi.mock('../../src/generators/aiLayer', () => ({ runTemplateNarrative: vi.fn() }));
vi.mock('../../src/lib/analytics.js', () => ({ track: vi.fn(), Funnel: { track: vi.fn() }, EVENTS: new Proxy({}, { get: (_t, k) => String(k) }) }));

const MIGRATIONS = resolve(process.cwd(), 'supabase', 'migrations');
const OWNER = '11111111-1111-1111-1111-111111111111';
const READER = '22222222-2222-2222-2222-222222222222';
const BROWSER = Object.freeze({ tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat',
  nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' });
/** The criminal family's groupings (criminalVeilSwitch.js :: CRIMINAL_VEIL_CLASSES' three grouping classes). */
const FAMILY = Object.freeze(['block:services.criminal', 'block:defense.criminalStructure', 'block:power.criminalUnderside']);
/** Born towns on which every family grouping removes something (presentCriminalGroupings, asserted below). */
const TOWNS = Object.freeze([
  { seed: 'server-veil-town-2', settType: 'town' },
  { seed: 'server-veil-city-2', settType: 'city' },
]);
const AT = '2026-11-20T00:00:00.000Z';
/** A word the civility mask rewrites (tests/lib/civility.test.js's own example). */
const FLAGGED = 'shit';

async function buildDb() {
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
  return { db, files, failed };
}

/** Master's stored shape: a tie's ends `npc1Id`/`npc2Id` (the inverse of settlementMigrations.js's tie step), and the
 *  powers listed again at the top level as master's client wrote them. */
function toMasterShape(record) {
  const out = structuredClone(record);
  if (Array.isArray(out.relationships)) out.relationships = out.relationships.map(({ from, to, ...rest }) => ({ ...rest, npc1Id: from, npc2Id: to }));
  out.factions = structuredClone(out.powerStructure?.factions || []);
  return out;
}

describe('the shut grouping\'s signal survives every copy a non-owner surface makes (VR17)', () => {
  /** @type {any} */ let LIVE;
  /** @type {any} */ let lib;

  beforeAll(async () => {
    LIVE = await buildDb();
    H.db = LIVE.db;
    const React = (await import('react')).default;
    const rtl = await import('@testing-library/react');
    const walk = await import('../components/pageCensusWalk.shared.mjs');
    lib = {
      React, ...rtl, ...walk,
      gen: (await import('../../src/generators/generateSettlementPipeline.js')).generateSettlementPipeline,
      compose: (await import('../../src/components/new/publicProseCompose.js')).composePublicProse,
      veil: await import('../../src/domain/display/galleryVeil.js'),
      present: (await import('../../src/domain/display/criminalVeilSwitch.js')).presentCriminalGroupings,
      gallery: await import('../../src/lib/gallery.js'),
      PublicDossierView: (await import('../../src/components/PublicDossierView.jsx')).default,
      CampaignWorldView: (await import('../../src/components/gallery/CampaignWorldView.jsx')).default,
    };
    // A viewport the test sets: desktop (1280) or a phone (375); a width query answers by it, and its listeners hear a change.
    const answers = (q) => { const max = /max-width:\s*(\d+)/.exec(q); const min = /min-width:\s*(\d+)/.exec(q);
      return (!max || H.width <= Number(max[1])) && (!min || H.width >= Number(min[1])) && !!(max || min); };
    window.matchMedia = Object.assign(vi.fn((q) => ({ media: q, get matches() { return answers(q); },
      addEventListener(_t, fn) { H.listeners.set(fn, q); }, removeEventListener(_t, fn) { H.listeners.delete(fn); },
      addListener(fn) { H.listeners.set(fn, q); }, removeListener(fn) { H.listeners.delete(fn); } })), { SF_CONTROLLED: true });
  }, PGLITE_BOOT_TIMEOUT_MS);

  it('the chain applies whole: every migration on disk', () => {
    expect(LIVE.failed).toEqual([]);
    expect(LIVE.files.at(-1)).toMatch(/^212_/);
  });

  /** Draw at a viewport: every width query's listeners hear the change (hooks/useIsMobile.js caches per breakpoint). */
  function atWidth(width) {
    H.width = width;
    for (const [fn, q] of H.listeners) fn({ matches: window.matchMedia(q).matches, media: q });
  }
  /** A control that would print, export or download the town: a shared page must offer none (those surfaces run on the
   *  viewer's own saved record only: SettlementDetail). */
  const EXPORT_CONTROL = /\b(print|pdf|foundry|journal|download)\b|\bexport (to|as|this|the)\b/i;
  /** Every line a rendered element's walk draws, as `<view> :: <line>`. */
  async function linesOfWalk(container) {
    const views = await lib.walkDossier(container, { fireEvent: lib.fireEvent, waitFor: lib.waitFor, expect });
    const out = new Set();
    for (const [view, ls] of Object.entries(views)) for (const l of ls) out.add(`${view} :: ${l}`);
    for (const el of container.querySelectorAll('button, a, [role="button"], [role="menuitem"]')) {
      const label = `${el.textContent || ''} ${el.getAttribute('aria-label') || ''} ${el.getAttribute('title') || ''}`.trim();
      if (EXPORT_CONTROL.test(label)) H.controls.push(label.slice(0, 80));
    }
    return out;
  }
  /** A page model drawn as the gallery's detail page and the party link draw it. */
  async function drawPage(dossier) {
    H.store = lib.storeFor(dossier.settlement, vi.fn);
    const { container } = lib.render(lib.React.createElement(lib.PublicDossierView, { dossier, showHeader: false }));
    try { return await linesOfWalk(container); } finally { lib.cleanup(); }
  }
  /** The campaign map page as a visitor opens one member: CampaignWorldView over get_gallery_map's response. */
  async function drawMapMember(detail, name) {
    H.store = lib.storeFor(null, vi.fn);
    const { container, getByRole } = lib.render(lib.React.createElement(lib.CampaignWorldView, { detail }));
    try {
      lib.fireEvent.click(getByRole('button', { name: `Open the dossier for ${name}` }));
      await lib.waitFor(() => expect(container.querySelector('[data-testid="campaign-selected-dossier"]')).toBeTruthy());
      return await linesOfWalk(container.querySelector('[data-testid="campaign-selected-dossier"]'));
    } finally { lib.cleanup(); }
  }
  /** The civility mask's spelling of a line is read back to the author's word by its masked token. */
  const unmask = (line) => line.replace(/\S*\*\S*/g, FLAGGED);

  for (const [n, town] of TOWNS.entries()) {
    for (const shape of ['current', 'master']) {
      it(`${town.seed} (${shape}'s stored shape): every family grouping shut alone, every copying surface, no derived block; the control draws it`, async () => {
        const { veil, gallery } = lib;
        const { seed, ...cfg } = town;
        const raw = lib.gen({ ...BROWSER, ...cfg }, null, { seed, customContent: {} });
        const born = JSON.parse(JSON.stringify({ ...raw, publicProse: lib.compose(raw) }));
        const record = shape === 'master' ? toMasterShape(born) : born;
        expect([...lib.present(veil.galleryPayloadFor(record, {}))].sort(), `${seed}: every family grouping removes something here`).toEqual([...FAMILY].sort());
        const k = `${n}${shape[0]}`;
        const id = `aaaaaaaa-0000-0000-0000-0000000000${n}${shape === 'master' ? '1' : '0'}`;
        const civId = `aaaaaaaa-0000-0000-0001-0000000000${n}${shape === 'master' ? '1' : '0'}`;
        // the same town with one word the civility mask rewrites, in its own name (a DM may write it; the read masks it)
        const civil = { ...record, name: `${record.name} ${FLAGGED}` };
        await H.db.exec(`set test.uid = '';`); H.uid = '';
        await H.db.query(`insert into public.settlements (id, user_id, name, tier, data, is_public, public_slug, published_at, unlisted_slug, visibility, gallery_importable)
          values ($1, $2, $3, $4, $5, true, $6, now(), $7, 'unlisted', true), ($8, $2, $9, $4, $10, true, $11, now(), $12, 'unlisted', true)`,
        [id, OWNER, record.name, cfg.settType, JSON.stringify(record), `p-${k}`, `l-${k}`, civId, civil.name, JSON.stringify(civil), `cp-${k}`, `cl-${k}`]);
        await H.db.query(`insert into public.saved_maps (id, user_id, name, map_data, is_public, public_slug, share_kind, gallery_share_campaign)
          values ($1, $2, 'map', $3, true, $4, 'map_with_campaign', true)`, [id.replace(/^a{8}/, 'cccccccc'), OWNER, JSON.stringify({ campaign: { settlementIds: [id] } }), `m-${k}`]);

        const faults = [];
        const drawn = {};
        for (const [label, shut] of [['open', []], ...FAMILY.map((g) => [g, [g]])]) {
          const ov = veil.writeShareVeil({}, FAMILY.map((g) => ({ address: g, hidden: shut.includes(g) })), { mode: 'live', at: AT });
          await H.db.query('update public.settlements set gallery_member_overrides = $2 where id in ($1, $3)', [id, JSON.stringify(ov), civId]);
          H.uid = '';
          const page = await gallery.fetchPublicDossier(`p-${k}`);
          const link = await gallery.fetchPublicDossier(`l-${k}`);
          const civPage = await gallery.fetchPublicDossier(`cp-${k}`);
          const civLink = await gallery.fetchPublicDossier(`cl-${k}`);
          const map = await gallery.fetchGalleryMap(`m-${k}`);
          expect(civPage.settlement.name, 'the civility mask rewrote the planted word (the row is live)').not.toContain(FLAGGED);
          const s = page.settlement;
          drawn[label] = {
            'the gallery page': await drawPage(page),
            'the party link': await drawPage({ ...link, shareDm: false }),
            'the gallery page, civility-masked': new Set([...await drawPage(civPage)].map(unmask)),
            'the party link, civility-masked': new Set([...await drawPage({ ...civLink, shareDm: false })].map(unmask)),
            'the campaign map member': await drawMapMember(map, record.name),
            'a structuredClone of the page model': await drawPage({ ...page, settlement: structuredClone(s) }),
            'a JSON round trip of the page model': await drawPage({ ...page, settlement: JSON.parse(JSON.stringify(s)) }),
            'a spread of the page model': await drawPage({ ...page, settlement: { ...s } }),
          };
          // the same at a phone's width (MobileTabStrip and the phone prose floor), the plain page its reference there
          atWidth(375);
          try {
            drawn[label]['the gallery page at phone width'] = await drawPage(page);
            drawn[label]['the gallery page, civility-masked, at phone width'] = new Set([...await drawPage(civPage)].map(unmask));
            drawn[label]['the campaign map member at phone width'] = await drawMapMember(map, record.name);
            drawn[label]['a structuredClone of the page model at phone width'] = await drawPage({ ...page, settlement: structuredClone(s) });
            if (label === 'open') {
              const marked = structuredClone(s);
              veil.markVeiled(marked, [...veil.veilGroupingsOf(s), 'block:defense.criminalStructure']);
              drawn['signal at phone width'] = await drawPage({ ...page, settlement: marked });
            }
          } finally { atWidth(1280); }
          if (label === 'open') {
            // G's DERIVED block: what the open page loses when only the signal names G (its data untouched)
            for (const g of FAMILY) {
              const marked = structuredClone(s);
              veil.markVeiled(marked, [...veil.veilGroupingsOf(s), g]);
              drawn[`signal ${g}`] = await drawPage({ ...page, settlement: marked });
            }
            // (C) the registry withholds one of the evidence keys for a hidden house (VR7): the block does not draw
            for (const key of ['criminalInstitutions']) {
              const withheld = structuredClone(s);
              delete withheld.economicState.safetyProfile[key];
              drawn[`withheld ${key}`] = await drawPage({ ...page, settlement: withheld });
            }
          }
        }
        const PHONE = ' at phone width';
        let defenseDerived = 0;
        for (const g of FAMILY) {
          // each width's own reference: the plain gallery page at that width
          const ref = (surface) => (surface.endsWith(PHONE) ? 'the gallery page at phone width' : 'the gallery page');
          const linesAt = (surface) => [...drawn.open[ref(surface)]].filter((x) => !drawn[g][ref(surface)].has(x));
          const derivedAt = (surface) => (surface.endsWith(PHONE)
            ? (g === 'block:defense.criminalStructure' ? [...drawn.open[ref(surface)]].filter((x) => !drawn['signal at phone width'].has(x)) : [])
            : [...drawn.open['the gallery page']].filter((x) => !drawn[`signal ${g}`].has(x)));
          const lines = linesAt('the gallery page');
          const derived = derivedAt('the gallery page');
          if (g === 'block:defense.criminalStructure') defenseDerived = derived.length;
          expect(lines.length, `${g}: shutting it removes something from the gallery page (the row is live)`).toBeGreaterThan(0);
          if (g === 'block:defense.criminalStructure') expect(derivedAt(`x${PHONE}`).length, 'the derived block is drawn at a phone\'s width too (the arm is live)').toBeGreaterThan(0);
          for (const [surface, set] of Object.entries(drawn[g])) {
            // (A) with G shut, no line of G on any surface
            const told = linesAt(surface).filter((x) => set.has(x));
            for (const x of told.slice(0, 2)) faults.push(`${g} SHUT, ${surface} draws: ${x.slice(0, 160)}`);
            // (B) the control: with G open the derived block is drawn on the surface
            const ctl = drawn.open[surface];
            for (const x of derivedAt(surface).filter((y) => !ctl.has(y)).slice(0, 2)) faults.push(`${g} OPEN, ${surface} lacks the derived line: ${x.slice(0, 160)}`);
          }
          // (C) the registry's withholding of an evidence key: the open grouping's derived block is not drawn
          if (g === 'block:defense.criminalStructure') {
            for (const key of ['criminalInstitutions']) {
              for (const x of derived.filter((y) => drawn[`withheld ${key}`].has(y)).slice(0, 2)) faults.push(`${key} withheld, the page draws: ${x.slice(0, 160)}`);
            }
          }
        }
        // (D) no shared page offers print, PDF, journal, Foundry or a download: those run on the viewer's own record only
        expect([...new Set(H.controls)], 'an export control on a non-owner page').toEqual([]);
        expect(defenseDerived, 'Defense\'s criminal architecture has a derived block on this town (the control is live)').toBeGreaterThan(0);
        expect(faults, faults.slice(0, 24).join('\n')).toEqual([]);
      }, TOWN_TIMEOUT_MS);
    }
  }
});
