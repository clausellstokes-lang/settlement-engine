// VR25-OWED UNIT 1 — THE RUINED-HOUSE IMPORT MEASURE (VEIL-21's side builder; the chair's grant of VR2's form to
// importRederive.js's ruin-filter exemption, 2026-11-20 02:14 UTC, OWED with it; each vetoable by the owner).
// For born towns, each given ONE RUINED house (calamityKernel.ruinInstitution: status 'ruined', _worldPulseInactive,
// the ruin filter's own signal), one variant per house:
//   STORE  the ruined town on a pglite chain of every migration on disk (tests/security/veilChain.shared.mjs), shared
//          with the DEFAULT veil (writeShareVeil({}, [])), Reveal DM off;
//   READ   as anon through the server: public.get_gallery_dossier(slug) (auth.uid() null);
//   SHARE  every registry withhold-always path deleted (as galleryImportRederive.test.js: the share as R2 sends it);
//   IMPORT the tree's own import (importGallerySettlementImpl; the import rpc answers the read, the save captured).
// For each of the ten fields rederiveServed re-derives, the imported value (where the import keeps it) against the
// REFERENCE: the engine's birth derivers called directly over the town with its ruined house as born (the full stored
// record). A MIS-DRAW: kept on the import and unequal to the reference. CONTROL: the same town unruined. CONTEXT (not
// the brief's question): the reference over the LIVE roster (liveInstitutions), to show where the birth derivers
// credit the ruined house.
// Run from the worktree root:
//   RV6_SRC=$PWD RV9_PROBE=$PWD/docs/chair/2026-11-20/veil/measure/vr25-owed/ruined.probe.js \
//   VR25_OWED_OUT=<dir> npx vitest run --maxWorkers=2 --config docs/chair/2026-11-20/veil/measure/vr25-owed/vitest.config.mjs
import { it, vi } from 'vitest';
import { writeFileSync, mkdirSync } from 'node:fs';
import { PGlite } from '@electric-sql/pglite';
import { pgcrypto } from '@electric-sql/pglite/contrib/pgcrypto';

const SRC = process.env.RV6_SRC;
const OUT = process.env.VR25_OWED_OUT || `${SRC}/docs/chair/2026-11-20/veil/out/v21/vr25-owed`;
const mocks = vi.hoisted(() => ({ payload: null, captured: null }));
vi.mock(`${process.env.RV6_SRC}/src/lib/analytics.js`, () => ({ track: vi.fn(), Funnel: { track: vi.fn() }, EVENTS: new Proxy({}, { get: (_t, k) => String(k) }) }));
vi.mock(`${process.env.RV6_SRC}/src/lib/supabase.js`, () => {
  const supabase = {
    auth: { getSession: async () => ({ data: { session: null } }), getUser: async () => ({ data: { user: null } }), onAuthStateChange: () => ({ data: { subscription: { unsubscribe() {} } } }) },
    from: () => ({ select: () => ({ eq: () => ({ maybeSingle: async () => ({ data: null, error: null }), single: async () => ({ data: null, error: null }) }) }) }),
    rpc: async (name) => (name === 'import_gallery_dossier'
      ? { data: [{ id: 'src-1', name: mocks.payload?.name || 'T', tier: mocks.payload?.tier, data: JSON.parse(JSON.stringify(mocks.payload)) }], error: null }
      : { data: null, error: null }),
  };
  return { supabase, isConfigured: true, default: supabase };
});
vi.mock(`${process.env.RV6_SRC}/src/lib/saves.js`, async (orig) => ({ ...(await orig()), saves: { save: async (e) => { mocks.captured = e; return 'new-id'; } } }));

const isRec = (v) => !!v && typeof v === 'object' && !Array.isArray(v);
const clone = (v) => JSON.parse(JSON.stringify(v));
const eq = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const SEEDS = [
  ['thorp', null], ['hamlet', null], ['village', null], ['village', 'insurgency'], ['town', null], ['town', 'famine'],
  ['city', 'infiltrated'], ['city', 'indebted'], ['metropolis', null],
];
const MAX_VARIANTS_PER_TOWN = 14;

function withholdAlways(doc, patterns) {
  const hit = (p) => patterns.some((re) => re.test(p) || re.test(`${p} (only in A)`) || re.test(`${p} (only in B)`));
  const walk = (o, path) => {
    if (Array.isArray(o)) { const el = `${path}[]`; if (hit(el)) { o.length = 0; return; } o.forEach((x) => walk(x, el)); return; }
    if (!isRec(o)) return;
    for (const k of Object.keys(o)) {
      const p = path ? `${path}.${k}` : k;
      if (hit(p) || (Array.isArray(o[k]) && hit(`${p}[]`))) { delete o[k]; continue; }
      walk(o[k], p);
    }
  };
  walk(doc, '');
  return doc;
}

it('VR25-owed unit 1: the ruined-house import measure', async () => {
  mkdirSync(OUT, { recursive: true });
  const { bootChain, storeShare, BIRTH_DIALS } = await import(`${SRC}/tests/security/veilChain.shared.mjs`);
  const { generateSettlementPipeline } = await import(`${SRC}/src/generators/generateSettlementPipeline.js`);
  const { birthConfig, loadGenerationLawPayloads } = await import(`${SRC}/src/domain/density/densityCreateBoundary.js`);
  const { DEFAULT_CONFIG } = await import(`${SRC}/src/store/configSlice.js`);
  const { composePublicProse } = await import(`${SRC}/src/components/new/publicProseCompose.js`);
  const { withPublicProse } = await import(`${SRC}/src/domain/display/publicProse.js`);
  const veil = await import(`${SRC}/src/domain/display/galleryVeil.js`);
  const { isHideableHouse } = await import(`${SRC}/src/domain/people/cardVeil.js`);
  const { REGISTRY_ROWS } = await import(`${SRC}/src/domain/veil/rosterChoiceRegistry.js`);
  const { importGallerySettlementImpl } = await import(`${SRC}/src/store/galleryImportSettlement.js`);
  const { REDERIVED_COMPOUND_KEYS } = await import(`${SRC}/src/domain/veil/importRederive.js`);
  const { ruinInstitution } = await import(`${SRC}/src/domain/worldPulse/calamityKernel.js`);
  const { liveInstitutions, isLiveInstitution } = await import(`${SRC}/src/domain/institutions/institutionRoster.js`);
  const { getInstFlags } = await import(`${SRC}/src/generators/priorityHelpers.js`);
  const { defenceExactOf } = await import(`${SRC}/src/generators/defenseGenerator.js`);
  const { promoteStressorsToConditions } = await import(`${SRC}/src/domain/conditionPromotion.js`);
  const { computePublicLegitimacy } = await import(`${SRC}/src/generators/factionDynamics.js`);
  const { generateSpatialLayout } = await import(`${SRC}/src/generators/spatialGenerator.js`);
  const { computeBaseProsperity, deriveProsperityLabel } = await import(`${SRC}/src/generators/economy/prosperity.js`);
  await loadGenerationLawPayloads();

  const db = new PGlite({ extensions: { pgcrypto } });
  const failed = await bootChain(db);
  const PATTERNS = REGISTRY_ROWS.filter((r) => r.rule === 'withhold' && r.when === 'always').map((r) => new RegExp(r.path));
  const mo = veil.writeShareVeil({}, []);
  const get = () => ({ auth: { user: { id: 'u1' }, tier: 'premium', role: null }, maxSaves: () => Infinity, savedSettlements: [] });

  // THE REFERENCE: the engine's birth derivers called directly over a full stored record.
  const pick = (c) => (c ? Object.fromEntries(REDERIVED_COMPOUND_KEYS.map((k) => [k, c[k]])) : undefined);
  function referenceOf(t) {
    const cfg = t.config || {};
    const e = t.economicState || {};
    const houses = t.institutions || [];
    const flags = getInstFlags(cfg, houses);
    const base = computeBaseProsperity(t.tier, cfg.tradeRouteAccess, houses, cfg, houses.map((i) => i?.name), e.incomeSources || [], e.foodSecurity || null).label;
    const prosperity = base === 'Subsistence' ? e.prosperity : deriveProsperityLabel(base, cfg, houses); // a Subsistence band is the birth draw
    const r = { ...t, economicState: { ...e, compound: { ...(e.compound || {}), ...pick(flags) }, prosperity } };
    const score = Math.round(Math.round(Number(defenceExactOf(r).readiness) * 100) / 100);
    const sev = Object.fromEntries((promoteStressorsToConditions({ ...r, activeConditions: [] }).activeConditions || []).map((c) => [c.archetype, c.severity]));
    const b = computePublicLegitimacy(r.economicState, t.defenseProfile?.readiness?.label || '', String(t.tier)).breakdown;
    return {
      compound: pick(flags), 'safetyProfile.compound': e.safetyProfile ? pick(flags) : undefined,
      safetyRatio: e.safetyProfile ? Math.round((Number(flags.militaryEffective) / Math.max(8, Number(flags.criminalEffective))) * 10) / 10 : undefined,
      storageMonths: e.foodSecurity?.foodRecord?.storageMonths, prosperity, 'readiness.score': score, 'conditions.severity': sev,
      'legitimacy.breakdown': { prosperity: b.prosperity, safety: b.safety, defense: b.defense },
      quarters: generateSpatialLayout(String(t.tier), houses, cfg.tradeRouteAccess, cfg.terrainType).quarters,
      cast: [],
    };
  }
  /** The importer's record, per field; undefined where the import left the field out. */
  function importedOf(s) {
    const e = s.economicState || {};
    const b = s.powerStructure?.publicLegitimacy?.breakdown;
    const casts = ['stress', 'stressors'].flatMap((k) => [s[k]].flat()).flatMap((x) => (x?.cast ? [...(x.cast.roles || []), ...(x.cast.absent || []), ...(x.cast.stakes || [])] : []));
    return {
      compound: e.compound ? pick(e.compound) : undefined, 'safetyProfile.compound': e.safetyProfile?.compound ? pick(e.safetyProfile.compound) : undefined,
      safetyRatio: e.safetyProfile?.safetyRatio, storageMonths: e.foodSecurity?.storageMonths, prosperity: e.prosperity,
      'readiness.score': s.defenseProfile?.readiness?.score,
      'conditions.severity': s.activeConditions ? Object.fromEntries(s.activeConditions.map((c) => [c.archetype, c.severity])) : undefined,
      'legitimacy.breakdown': b ? Object.fromEntries(['prosperity', 'safety', 'defense'].filter((k) => Object.hasOwn(b, k)).map((k) => [k, b[k]])) : undefined,
      quarters: s.spatialLayout?.quarters, cast: casts,
    };
  }
  /** Unequal where the import kept the field (a kept part of a map is compared key by key). */
  function misdraw(f, imp, ref) {
    if (imp === undefined) return false;
    if (f === 'conditions.severity' || f === 'legitimacy.breakdown') return Object.entries(imp).some(([k, v]) => !eq(v, ref?.[k]));
    return !eq(imp, ref);
  }
  const FIELDS = ['compound', 'safetyProfile.compound', 'safetyRatio', 'storageMonths', 'prosperity', 'readiness.score', 'conditions.severity', 'legitimacy.breakdown', 'quarters', 'cast'];

  let n = 0;
  async function importOnce(town) {
    n += 1;
    const slug = `vr25owed-${n}`;
    await storeShare(db, { town, slug, overrides: mo, shareDm: false });
    await db.exec("set test.uid = ''; set test.role = 'anon';");
    const rows = (await db.query('select to_jsonb(g) as r from public.get_gallery_dossier($1) g', [slug])).rows.map((x) => x.r);
    if (rows.length !== 1 || !isRec(rows[0]?.data)) throw new Error(`${slug}: anon read gave ${rows.length} rows`);
    const read = rows[0].data;
    const served = withholdAlways(clone(read), PATTERNS);
    mocks.payload = served; mocks.captured = null;
    await importGallerySettlementImpl(get, () => {}, slug);
    return { read, served, saved: clone(mocks.captured.settlement) };
  }

  const res = { bootFailed: failed, seeds: SEEDS, fields: FIELDS, towns: [], per: {}, served: { ruinedHouseServed: 0, ruinedHouseVeiled: 0, ruinedHouseStatusStripped: 0, ex: [] }, context: {} };
  for (const f of FIELDS) res.per[f] = { variants: 0, kept: 0, leftOut: 0, misdraw: 0, misdrawNoHidden: 0, misdrawHiddenTown: 0, misdrawRuinAttributable: 0, ex: [], controlMisdraw: 0, refMovedByRuin: 0, impMovedByRuin: 0, movedApart: 0, movedApartEx: [] };
  for (const f of FIELDS) res.context[f] = { liveRosterDiffers: 0, ex: [] };

  for (const [i, [size, crisis]] of SEEDS.entries()) {
    const cfg = birthConfig({ ...DEFAULT_CONFIG, ...BIRTH_DIALS, settType: size, ...(crisis ? { selectedStresses: [crisis], selectedStressesRandom: false } : {}) });
    const seed = `vr25-owed-${size}-${crisis || 'calm'}-${i}`;
    const born = clone(withPublicProse(...((t) => [t, composePublicProse(t)])(generateSettlementPipeline(cfg, null, { seed, customContent: {} }))));
    const hiddenTown = (born.institutions || []).filter((h) => isHideableHouse(h)).length;
    const control = await importOnce(born);
    const refC = referenceOf(born);
    const impC = importedOf(control.saved);
    const controlBad = FIELDS.filter((f) => misdraw(f, impC[f], refC[f]));
    for (const f of controlBad) res.per[f].controlMisdraw += 1;
    // the ruined variants: up to MAX houses, spread over the roster
    const houses = born.institutions || [];
    const idx = houses.length <= MAX_VARIANTS_PER_TOWN ? houses.map((_, k) => k) : [...new Set(Array.from({ length: MAX_VARIANTS_PER_TOWN }, (_, k) => Math.floor((k * houses.length) / MAX_VARIANTS_PER_TOWN)))];
    const townRow = { seed, houses: houses.length, hiddenTown, controlMisdraw: controlBad, variants: [] };
    for (const k of idx) {
      const h = houses[k];
      const town = clone(born);
      town.institutions[k] = ruinInstitution(town.institutions[k], { reason: 'VR25-owed measure: a ruined house', fate: 'destroyed_by_disaster' });
      if (isLiveInstitution(town.institutions[k])) throw new Error('the ruin did not take');
      const { read, saved } = await importOnce(town);
      const servedHouse = (read.institutions || []).find((x) => x?.name === h.name);
      if (servedHouse) {
        res.served.ruinedHouseServed += 1;
        if (servedHouse.status !== 'ruined' || servedHouse._worldPulseInactive !== true) { res.served.ruinedHouseStatusStripped += 1; if (res.served.ex.length < 6) res.served.ex.push({ seed, house: h.name, servedStatus: servedHouse.status, servedInactive: servedHouse._worldPulseInactive }); }
      } else res.served.ruinedHouseVeiled += 1;
      const ref = referenceOf(town);
      const imp = importedOf(saved);
      const live = referenceOf({ ...town, institutions: liveInstitutions(town) });
      const bad = [];
      for (const f of FIELDS) {
        const P = res.per[f];
        P.variants += 1;
        if (imp[f] === undefined) P.leftOut += 1; else P.kept += 1;
        if (!eq(ref[f], refC[f])) P.refMovedByRuin += 1;
        if (imp[f] !== undefined && !eq(imp[f], impC[f])) P.impMovedByRuin += 1;
        if (imp[f] !== undefined && impC[f] !== undefined && eq(imp[f], impC[f]) !== eq(ref[f], refC[f])) { P.movedApart += 1; if (P.movedApartEx.length < 5) P.movedApartEx.push({ seed, house: h.name, imported: JSON.stringify(imp[f])?.slice(0, 120), importedUnruined: JSON.stringify(impC[f])?.slice(0, 120), reference: JSON.stringify(ref[f])?.slice(0, 120), referenceUnruined: JSON.stringify(refC[f])?.slice(0, 120) }); }
        if (!eq(live[f], ref[f])) { res.context[f].liveRosterDiffers += 1; if (res.context[f].ex.length < 3) res.context[f].ex.push({ seed, house: h.name, birthDerivers: JSON.stringify(ref[f])?.slice(0, 160), liveRoster: JSON.stringify(live[f])?.slice(0, 160) }); }
        if (misdraw(f, imp[f], ref[f])) {
          bad.push(f);
          P.misdraw += 1;
          if (hiddenTown === 0) P.misdrawNoHidden += 1; else P.misdrawHiddenTown += 1;
          if (!controlBad.includes(f)) { P.misdrawRuinAttributable += 1; if (P.ex.length < 5) P.ex.push({ seed, house: h.name, category: h.category, served: !!servedHouse, imported: JSON.stringify(imp[f])?.slice(0, 200), reference: JSON.stringify(ref[f])?.slice(0, 200) }); }
        }
      }
      townRow.variants.push({ house: h.name, hideable: isHideableHouse(h), served: !!servedHouse, misdraw: bad });
    }
    res.towns.push(townRow);
  }
  res.totals = { towns: res.towns.length, variants: res.towns.reduce((a, t) => a + t.variants.length, 0), noHiddenTowns: res.towns.filter((t) => t.hiddenTown === 0).length,
    noHiddenVariants: res.towns.filter((t) => t.hiddenTown === 0).reduce((a, t) => a + t.variants.length, 0) };
  writeFileSync(`${OUT}/u1-ruined-measure.json`, JSON.stringify(res, null, 1));
  const lines = [`towns ${res.totals.towns} (nothing hidden: ${res.totals.noHiddenTowns}); ruined variants ${res.totals.variants} (in towns with nothing hidden: ${res.totals.noHiddenVariants}); boot failures ${failed.length}`,
    `served: the ruined house served ${res.served.ruinedHouseServed}, veiled ${res.served.ruinedHouseVeiled}, served with its ruin stripped ${res.served.ruinedHouseStatusStripped}`,
    'field | variants | kept | left out | MIS-DRAW (no-hidden towns / hidden-house towns) | ruin-attributable | control mis-draw (towns) | reference moved by the ruin | import moved by the ruin | MOVED APART (one moved, the other not) | CONTEXT: live roster differs'];
  for (const f of FIELDS) { const P = res.per[f]; lines.push(`${f} | ${P.variants} | ${P.kept} | ${P.leftOut} | ${P.misdraw} (${P.misdrawNoHidden} / ${P.misdrawHiddenTown}) | ${P.misdrawRuinAttributable} | ${P.controlMisdraw} | ${P.refMovedByRuin} | ${P.impMovedByRuin} | ${P.movedApart} | ${res.context[f].liveRosterDiffers}`); }
  writeFileSync(`${OUT}/u1-ruined-summary.txt`, `${lines.join('\n')}\n`);
  await db.close();
}, 14_400_000);
