/**
 * galleryVeilTell8.pglite.test.js — R3-TELL-8 unit (viii) (VEIL-32; the eighth chair's ruling (b) of 2026-11-22 05:15 UTC,
 * "THE OTHER WAY", and ruling 88 of 07:19, each vetoable by the owner): THE CRIME LIST WITHHELD ALWAYS, THE PAGE RE-DERIVES,
 * on BORN towns, BOTH ENGINES (212 through the server on a pglite chain of every migration on disk; the twin,
 * projectShareVeil over galleryPayloadFor, beside it), every setting of the owner's switch (own, the mixed g:<bits>, allOpen,
 * off) and the old unmarked shape, Reveal DM off and on; the gallery read at every setting, the party link, the import and
 * the campaign map's member at the own setting.
 * THE LAW (ruling (b)): `economicState.safetyProfile.crimeTypes`, THE KEY ITSELF, is on NO shared read of ANY place (marked
 * or not, both stored shapes, every door, Reveal DM off and on: an absence every place shows is no tell); ONE reader derives
 * the list from the document in hand by the engine's own writer, ONLY where the served data proves the types' grouping open
 * (`criminalInstitutions` an array, the evidence VR29 keeps: TELL8 1e, 6,528 of 6,528 pages); where it cannot, it draws none.
 *   HALF 1 (TOTAL): no served document carries the key.
 *   HALF 2: the list the shared page PRINTS (the client's own read path: gallery.js :: fetchPublicDossier for the gallery
 *     page and the party link, fetchGalleryMap for the map's member, importRederive.js :: rederiveServed over
 *     fetchDossierForImport for the import's save; the twin's projection through pageRederive.js :: rederiveForPage) equals
 *     THE RECORD REFERENCE over the SERVED page (ruling 88: generateSafetyProfile over the served config, tier and houses,
 *     then settleCrimeLinesToSignal over the served seats, houses, tensions and services), [type, desc] entry for entry;
 *     where the grouping is not proven open the page prints no list.
 *   THE MERCHANT-ARMY HOOK (TELL7 cause (f); TELL8 1f): where the hook pool is served and the record holds the hook, the hook
 *     is served exactly where getStressFlags over the served config and houses raises `merchantArmy` (the engine's own
 *     flag; the map row was hasGangInfra).
 * THE BIRTHS (tell-common.mjs :: pool's seeds and dials, byte for byte; TELL7's causes, one town each): (a) a threshold type
 * the map withheld (city-under_siege-1-108, Survival crime); (b) Magical crime the withheld 'Arcane black market' suppressed
 * (city-wartime-1-109); (c) the fallback (town-none-0-17, Background crime); (d) a crisis's type (city-none-1-103, black
 * market passage); (e) desperation theft settled away (town-under_siege-0-28); (f) the merchant-army hook
 * (metropolis-occupied-0-65); the desc-level tell (town-indebted-0-16, debt evasion); and THE CONTROL (village-under_siege-0-8,
 * nothing hideable; ruling 88's page: services and underside shut, the structure open).
 */
import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest';
import { PGlite } from '@electric-sql/pglite';
import { pgcrypto } from '@electric-sql/pglite/contrib/pgcrypto';
import { appendFileSync } from 'node:fs';
import { bootChain, OWNER, BIRTH_DIALS } from './veilChain.shared.mjs';

const ARM_TIMEOUT_MS = 1_800_000; // deadlock guard, not a perf budget
const PGLITE_BOOT_TIMEOUT_MS = 900_000; // deadlock guard, not a perf budget — never tune to a measured boot (see pgliteHookTimeoutRatchet.test.js)
const READER = '22222222-2222-2222-2222-222222222222';

const env = vi.hoisted(() => ({ db: null, raw: {} }));
vi.mock('../../src/lib/supabase.js', () => {
  const keep = (name, v) => { env.raw[name] = v == null ? v : JSON.parse(JSON.stringify(v)); return v; };
  const supabase = {
    auth: { getSession: async () => ({ data: { session: null } }), getUser: async () => ({ data: { user: null } }), onAuthStateChange: () => ({ data: { subscription: { unsubscribe() {} } } }) },
    from: () => ({ select: () => ({ eq: () => ({ maybeSingle: async () => ({ data: null, error: null }), single: async () => ({ data: null, error: null }) }) }) }),
    rpc: async (name, args) => {
      if (name === 'get_gallery_dossier') {
        const rows = (await env.db.query('select to_jsonb(g) as r from public.get_gallery_dossier($1) g', [args.dossier_slug])).rows.map((x) => x.r);
        keep(name, rows[0]?.data);
        return { data: rows, error: null };
      }
      if (name === 'get_unlisted_dossier') {
        const r = (await env.db.query('select public.get_unlisted_dossier($1) as r', [args.p_slug])).rows[0]?.r ?? null;
        keep(name, r?.dossier);
        return { data: r, error: null };
      }
      if (name === 'get_gallery_map') {
        const r = (await env.db.query('select public.get_gallery_map($1) as r', [args.p_slug])).rows[0]?.r ?? null;
        keep(name, r?.members?.[0]?.settlement);
        return { data: r, error: null };
      }
      if (name === 'import_gallery_dossier') {
        const rows = (await env.db.query('select to_jsonb(g) as r from public.import_gallery_dossier($1) g', [args.dossier_slug])).rows.map((x) => x.r);
        keep(name, rows[0]?.data);
        return { data: rows, error: null };
      }
      return { data: null, error: null };
    },
  };
  return { supabase, isConfigured: true, default: supabase };
});

const isRec = (v) => !!v && typeof v === 'object' && !Array.isArray(v);
const clone = (v) => JSON.parse(JSON.stringify(v));
const J = (v) => JSON.stringify(v);
const note = (...a) => { if (process.env.R3_MEASURES) appendFileSync(process.env.R3_MEASURES, `${a.join(' ')}\n`); };
const OPEN = ['block:services.criminal', 'block:defense.criminalStructure', 'block:power.criminalUnderside', 'tab:plot_hooks'];
const CRIM = OPEN.slice(0, 3);
const MA_HOOK = "The merchant guild's private security force just detained someone";
/** [seed, size, crisis, the cause it carries] (tell-common.mjs :: pool's seed spelling). */
const BIRTHS = Object.freeze([
  ['r3m-city-under_siege-1-108', 'city', 'under_siege', '(a) threshold type'],
  ['r3m-city-wartime-1-109', 'city', 'wartime', '(b) Magical crime under a withheld Arcane black market'],
  ['r3m-town-none-0-17', 'town', 'none', '(c) the fallback'],
  ['r3m-city-none-1-103', 'city', 'none', '(d) a crisis type'],
  ['r3m-town-under_siege-0-28', 'town', 'under_siege', '(e) desperation theft'],
  ['r3m-metropolis-occupied-0-65', 'metropolis', 'occupied', '(f) the merchant-army hook'],
  ['r3m-town-indebted-0-16', 'town', 'indebted', 'the debt-evasion desc'],
  ['r3m-village-under_siege-0-8', 'village', 'under_siege', 'THE CONTROL (ruling 88)'],
]);

describe('R3-TELL-8 unit (viii): the crime list withheld always, the page re-derives, on born towns, the twin against 212', () => {
  let veil; let sw; let lib; let eng;
  let m = 0;
  const towns = [];
  const at = '2026-11-01T00:00:00.000Z';
  const opened = (as) => as.map((a) => ({ address: a, hidden: false }));
  const settingsOf = (stored, dm) => {
    const pub = veil.galleryPayloadFor(clone(stored), { shareDm: dm, memberOverrides: null });
    const model = veil.curateModelFor(pub, []);
    const present = sw.presentCriminalGroupings(pub);
    const out = { own: opened(OPEN) };
    for (let b = 0; b < 7; b += 1) {
      const bits = [4, 2, 1].map((x) => ((b & x) ? '1' : '0')).join('');
      out[`g:${bits}`] = opened(['tab:plot_hooks', ...CRIM.filter((_g, i) => bits[i] === '1')]);
    }
    out.allOpen = sw.setCriminalVeil(opened(OPEN), model.defaults, false, present, model).filter((d) => !String(d.address).startsWith('card:institution:'));
    out.off = sw.setCriminalVeil(opened(OPEN), model.defaults, true, present, model);
    return out;
  };
  const spOf = (d) => (isRec(d?.economicState?.safetyProfile) ? d.economicState.safetyProfile : null);
  const pairs = (xs) => (Array.isArray(xs) ? xs.map((c) => (isRec(c) ? [String(c.type), typeof c.desc === 'string' ? c.desc : `#${typeof c.desc}`] : [`#${typeof c}`, ''])) : '#notarray');
  const listOf = (d) => { const sp = spOf(d); return !sp || !Object.prototype.hasOwnProperty.call(sp, 'crimeTypes') ? '#absent' : pairs(sp.crimeTypes); };
  const recs = (v) => (Array.isArray(v) ? v.filter(isRec) : []);
  /** THE RECORD REFERENCE over a served page (ruling 88), or '#absent' where the grouping is not proven open. */
  const refOf = (d) => {
    if (!Array.isArray(spOf(d)?.criminalInstitutions) || !isRec(d.config)) return '#absent';
    const sp = eng.generateSafetyProfile(d.config, d.tier, recs(d.institutions));
    return pairs(eng.settleCrimeLinesToSignal({ ...(d.economicState || {}), safetyProfile: sp },
      { seats: d.powerStructure?.factions, estate: d.institutions, tensions: d.history?.currentTensions, services: d.availableServices })?.safetyProfile?.crimeTypes);
  };

  /** Every read of one born town by BOTH engines: [{ setting, dm, read, eng, raw, page }]: `raw` the served document, `page`
   * the document the client's own path makes of it. */
  const readAll = async (stored) => {
    const out = [];
    for (const dm of [false, true]) for (const [setting, deltas] of [...Object.entries(settingsOf(stored, dm)), ['unmarked', null]]) {
      m += 1;
      const ov = deltas === null ? {} : veil.writeShareVeil({}, deltas, { mode: 'live', at });
      const id = `7e8c8000-0000-0000-0000-${String(m).padStart(12, '0')}`;
      const slug = `t8x${m}`;
      await env.db.query(`insert into public.settlements (id,user_id,name,tier,data,is_public,public_slug,published_at,unlisted_slug,visibility,gallery_member_overrides,gallery_share_dm,gallery_importable)
        values ($1,$2,$3,$4,$5::jsonb,true,$6,now(),$7,'unlisted',$8::jsonb,$9,true)`, [id, OWNER, String(stored.name), String(stored.tier), J(stored), slug, `${slug}-link`, J(ov), dm]);
      await env.db.exec(`set test.uid = '';`);
      const reads = [['gallery', 'get_gallery_dossier', async () => (await lib.fetchPublicDossier(slug))?.settlement]];
      if (setting === 'own') {
        await env.db.query(`insert into public.saved_maps (id, user_id, name, map_data, is_public, public_slug, unlisted_slug, visibility, share_kind, gallery_share_campaign, gallery_importable)
          values (gen_random_uuid(), $1, 'm', $2, true, $3, $4, 'unlisted', 'map_with_campaign', true, true)`, [OWNER, J({ campaign: { settlementIds: [id] } }), `${slug}-map`, `${slug}-mapl`]);
        reads.push(['map', 'get_gallery_map', async () => (await lib.fetchGalleryMap(`${slug}-map`))?.members?.[0]?.settlement]);
        if (!dm) reads.push(['link', 'get_unlisted_dossier', async () => (await lib.fetchPublicDossier(`${slug}-link`))?.settlement]);
        reads.push(['import', 'import_gallery_dossier', async () => {
          await env.db.exec(`set test.uid = '${READER}';`);
          try { const d = await lib.fetchDossierForImport(slug); return d?.settlement ? lib.rederiveServed(d.settlement) : undefined; } finally { await env.db.exec(`set test.uid = '';`); }
        }]);
      }
      const unmarked = !veil.readShareVeil(ov).marked;
      const twinOf = (d) => veil.projectShareVeil(veil.galleryPayloadFor(clone(stored), { shareDm: d, memberOverrides: ov }), ov);
      const twin = twinOf(dm); const twinOff = dm ? twinOf(false) : twin;
      for (const [read, rpc, page] of reads) {
        env.raw[rpc] = undefined;
        const p = await page();
        const raw = env.raw[rpc];
        if (!isRec(raw)) continue;
        out.push({ setting, dm, read, eng: 'server', raw, page: p });
        const t = read === 'map' || read === 'link' ? twinOff : twin;
        out.push({ setting, dm, read, eng: 'twin', raw: t, page: read === 'import' ? lib.rederiveServed(t) : lib.rederiveForPage(clone(t), { unveiled: unmarked }) });
      }
    }
    return out;
  };
  const tag = (t, r) => `${t.seed} ${r.eng} ${r.read} ${r.setting} dm=${r.dm}`;

  beforeAll(async () => {
    env.db = new PGlite({ extensions: { pgcrypto } });
    expect(await bootChain(env.db)).toEqual([]);
    await env.db.exec(`insert into auth.users (id) values ('${READER}') on conflict do nothing; insert into public.profiles (id) values ('${READER}') on conflict do nothing;
      create or replace function public.current_user_has_premium_access() returns boolean language sql stable as $f$ select true $f$;`);
    veil = await import('../../src/domain/display/galleryVeil.js');
    sw = await import('../../src/domain/display/criminalVeilSwitch.js');
    const gallery = await import('../../src/lib/gallery.js');
    lib = { fetchPublicDossier: gallery.fetchPublicDossier, fetchGalleryMap: gallery.fetchGalleryMap, fetchDossierForImport: gallery.fetchDossierForImport,
      rederiveServed: (await import('../../src/domain/veil/importRederive.js')).rederiveServed, rederiveForPage: (await import('../../src/domain/veil/pageRederive.js')).rederiveForPage };
    eng = await import('../../src/generators/safetyProfile.js');
    eng.getStressFlags = (await import('../../src/generators/priorityHelpers.js')).getStressFlags;
    const { generateSettlementPipeline } = await import('../../src/generators/generateSettlementPipeline.js');
    const { birthConfig, loadGenerationLawPayloads } = await import('../../src/domain/density/densityCreateBoundary.js');
    const { DEFAULT_CONFIG } = await import('../../src/store/configSlice.js');
    const { composePublicProse } = await import('../../src/components/new/publicProseCompose.js');
    const { withPublicProse } = await import('../../src/domain/display/publicProse.js');
    const { isHideableHouse } = await import('../../src/domain/people/cardVeil.js');
    await loadGenerationLawPayloads();
    for (const [seed, size, crisis, cause] of BIRTHS) {
      const cfg = { ...DEFAULT_CONFIG, ...BIRTH_DIALS, settType: size, ...(crisis !== 'none' ? { selectedStresses: [crisis], selectedStressesRandom: false } : {}) };
      let t = { ...generateSettlementPipeline(birthConfig(cfg), null, { seed, customContent: {} }) };
      delete t.publicProse; t = clone(withPublicProse(t, composePublicProse(t)));
      towns.push({ seed, cause, stored: t, hidden: recs(t.institutions).filter((h) => isHideableHouse(h)).length,
        maHook: (spOf(t)?.plotHooks || []).some((h) => String(h).startsWith(MA_HOOK)) });
    }
  }, PGLITE_BOOT_TIMEOUT_MS);
  afterAll(async () => { if (env.db) await env.db.close(); });

  it('HALF 1 and HALF 2 and the merchant-army hook: no shared read carries the crime list; the page prints the record reference over the served page where the grouping is proven open, and no list where it is not; the hook follows the served merchantArmy flag; both engines, every door and setting, Reveal DM off and on', async () => {
    const h1 = []; const h2 = []; const hook = []; const tally = {};
    for (const t of towns) {
      const k = { reads: 0, open: 0, printed: 0, hookPool: 0, hookServed: 0 };
      for (const r of await readAll(t.stored)) {
        k.reads += 1;
        if (spOf(r.raw) && Object.prototype.hasOwnProperty.call(spOf(r.raw), 'crimeTypes')) h1.push(`${tag(t, r)}: the served document carries crimeTypes ${J(spOf(r.raw).crimeTypes).slice(0, 120)}`);
        const ref = refOf(r.raw); const shown = listOf(r.page);
        if (ref !== '#absent') k.open += 1;
        if (Array.isArray(shown) && shown.length) k.printed += 1;
        if (J(shown) !== J(ref)) h2.push(`${tag(t, r)}: printed ${J(shown).slice(0, 160)} | reference ${J(ref).slice(0, 160)}`);
        const sp = spOf(r.raw);
        if (t.maHook && Array.isArray(sp?.plotHooks) && isRec(r.raw.config)) {
          k.hookPool += 1;
          const flag = !!eng.getStressFlags(r.raw.config, recs(r.raw.institutions)).merchantArmy;
          const served = sp.plotHooks.some((h) => String(h).startsWith(MA_HOOK));
          if (served) k.hookServed += 1;
          if (served !== flag) hook.push(`${tag(t, r)}: the hook ${served ? 'served' : 'withheld'}, the served flag ${flag}`);
        }
      }
      tally[t.seed] = k;
    }
    note('R3-TELL-8 (viii) on the born towns:', J(tally), '| HALF 1', h1.length, '| HALF 2', h2.length, '| hook', hook.length,
      h1.length ? `\n  H1 ${h1.slice(0, 6).join('\n  H1 ')}` : '', h2.length ? `\n  H2 ${h2.slice(0, 12).join('\n  H2 ')}` : '', hook.length ? `\n  HOOK ${hook.slice(0, 6).join('\n  HOOK ')}` : '');
    // the births are the causes' towns (anti-vacuity: a stale seed or dial would silently test other towns)
    for (const t of towns) expect(t.hidden > 0, `${t.seed} (${t.cause}): hideable houses ${t.hidden}`).toBe(!t.cause.startsWith('THE CONTROL'));
    expect(towns.find((t) => t.seed === 'r3m-metropolis-occupied-0-65')?.maHook, 'the merchant-army town holds the hook').toBe(true);
    // the teeth: every town has reads the grouping proves open, and the page prints a list on them
    for (const [seed, k] of Object.entries(tally)) { expect(k.open, `${seed}: open reads`).toBeGreaterThan(0); expect(k.printed, `${seed}: printed lists`).toBeGreaterThan(0); }
    expect(tally['r3m-metropolis-occupied-0-65'].hookServed, 'the hook is served where the served flag raises it').toBeGreaterThan(0);
    expect(h1).toEqual([]);
    expect(h2).toEqual([]);
    expect(hook).toEqual([]);
  }, ARM_TIMEOUT_MS);
});
