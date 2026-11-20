/**
 * galleryImportRederive.test.js — THE IMPORTER'S SAVE RE-DERIVES WHAT THE SHARE WITHHOLDS (ruling VR25, the seventh
 * chair, 2026-11-20 01:15 UTC, vetoable by the owner; VEIL-20 item 3a; src/domain/veil/importRederive.js).
 *
 * THE SHARE AS R2 WILL SEND IT: born towns, the default veil (writeShareVeil({}, [])), Reveal DM off, read by the
 * client's twin (galleryPayloadFor, projectShareVeil); then every path the roster-choice registry withholds on EVERY
 * non-owner read deleted (its `withhold`/`always` rows). (Prosperity and its founding line, withheld here under the
 * chair's ruling of 01:20 UTC, are SERVED again under VR28 (01:35 UTC, tier 2): RULED_SINCE is empty since; the import
 * keeps the served band, tests/store/galleryImportServedBand.test.js.) That document is what the import read answers,
 * and the tree's own import runs over it.
 *
 * THE ARMS:
 *   1  THE TEN FIELDS (R2-IMPORT-MEASURE.md's outcome (c)) arrive on the importer's record: the compound's figures in
 *      both copies, the safety ratio, the stores' months, the readiness score, every condition's severity, the
 *      legitimacy causes, the quarters; or, where the served document does not decide one, it is LEFT OUT whole
 *      (no default, no blank row): no condition without a severity, no crisis-cast row without its role and reason.
 *   2  SERVED FIELDS ONLY: the save's re-derivation, run under a recorder, reads no withheld path.
 *   3  THE ENGINE'S OWN RULE: on a town with nothing hidden, every re-derived field the served document decides equals
 *      the value the town was born with.
 *   4  NO HIDDEN TERM: where the veil removed a house, the re-derived compound equals the engine's reading over the
 *      SERVED houses, never the stored figure that counted the hidden ones.
 */
import { describe, it, expect, beforeAll, vi } from 'vitest';

const mocks = vi.hoisted(() => ({ payload: null, captured: null }));
vi.mock('../../src/lib/analytics.js', () => ({ track: vi.fn(), Funnel: { track: vi.fn() }, EVENTS: new Proxy({}, { get: (_t, k) => String(k) }) }));
vi.mock('../../src/lib/supabase.js', () => {
  const supabase = {
    auth: { getSession: async () => ({ data: { session: null } }), getUser: async () => ({ data: { user: null } }), onAuthStateChange: () => ({ data: { subscription: { unsubscribe() {} } } }) },
    from: () => ({ select: () => ({ eq: () => ({ maybeSingle: async () => ({ data: null, error: null }), single: async () => ({ data: null, error: null }) }) }) }),
    rpc: async (name) => (name === 'import_gallery_dossier'
      ? { data: [{ id: 'src-1', name: mocks.payload?.name || 'T', tier: mocks.payload?.tier, data: JSON.parse(JSON.stringify(mocks.payload)) }], error: null }
      : { data: null, error: null }),
  };
  return { supabase, isConfigured: true, default: supabase };
});
vi.mock('../../src/lib/saves.js', async (orig) => ({ ...(await orig()), saves: { save: async (e) => { mocks.captured = e; return 'new-id'; } } }));

const ARM_TIMEOUT_MS = 600_000;
const SEEDS = [
  ['town', null], ['city', 'infiltrated'], ['metropolis', null], ['village', 'insurgency'],
  ['city', 'indebted'], ['hamlet', null], ['thorp', null], ['metropolis', 'occupied'], ['town', 'famine'],
];
const isRec = (v) => !!v && typeof v === 'object' && !Array.isArray(v);
const clone = (v) => JSON.parse(JSON.stringify(v));
/** VR28 (01:35 UTC) served `economicState.prosperity` and `history.founding.overcoming` again (tier 2): none since. */
const RULED_SINCE = [];

/** Delete every node whose differ-normalised path a withhold-always pattern matches (arrays read as `[]`). */
function withholdAlways(doc, patterns) {
  const hit = (p) => patterns.some((re) => re.test(p) || re.test(`${p} (only in A)`) || re.test(`${p} (only in B)`));
  const walk = (o, path) => {
    if (Array.isArray(o)) {
      const el = `${path}[]`;
      if (hit(el)) { o.length = 0; return; }
      o.forEach((x) => walk(x, el));
      return;
    }
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

/** A deep proxy noting every read of an ABSENT key whose path a withhold-always pattern matches. */
function recorder(root, patterns) {
  const hits = new Set();
  const cache = new WeakMap();
  const wrap = (o, path) => {
    if (!o || typeof o !== 'object') return o;
    if (cache.has(o)) return cache.get(o);
    const note = (t, k) => {
      if (typeof k === 'symbol' || k in t) return;
      const child = Array.isArray(t) ? `${path}[]` : (path ? `${path}.${k}` : k);
      if (patterns.some((re) => re.test(child))) hits.add(child);
    };
    const p = new Proxy(o, {
      get(t, k, r) {
        note(t, k);
        if (typeof k === 'symbol' || !(k in t)) return Reflect.get(t, k, r);
        return wrap(Reflect.get(t, k, r), Array.isArray(t) && /^\d+$/.test(String(k)) ? `${path}[]` : (path ? `${path}.${String(k)}` : String(k)));
      },
      has(t, k) { note(t, k); return Reflect.has(t, k); },
    });
    cache.set(o, p);
    return p;
  };
  return { rec: wrap(root, ''), hits };
}

describe('VR25: the importer\'s save re-derives what the share withholds, from the served document alone', () => {
  let towns;
  let PATTERNS;
  let lib;

  beforeAll(async () => {
    const { generateSettlementPipeline } = await import('../../src/generators/generateSettlementPipeline.js');
    const { birthConfig, loadGenerationLawPayloads } = await import('../../src/domain/density/densityCreateBoundary.js');
    const { DEFAULT_CONFIG } = await import('../../src/store/configSlice.js');
    const { composePublicProse } = await import('../../src/components/new/publicProseCompose.js');
    const { withPublicProse } = await import('../../src/domain/display/publicProse.js');
    const veil = await import('../../src/domain/display/galleryVeil.js');
    const { isHideableHouse } = await import('../../src/domain/people/cardVeil.js');
    const { REGISTRY_ROWS } = await import('../../src/domain/veil/rosterChoiceRegistry.js');
    const { importGallerySettlementImpl } = await import('../../src/store/galleryImportSettlement.js');
    lib = {
      rederive: await import('../../src/domain/veil/importRederive.js'),
      flags: await import('../../src/generators/priorityHelpers.js'),
    };
    await loadGenerationLawPayloads();
    PATTERNS = [...REGISTRY_ROWS.filter((r) => r.rule === 'withhold' && r.when === 'always').map((r) => new RegExp(r.path)), ...RULED_SINCE];
    const dials = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
    const mo = veil.writeShareVeil({}, []);
    const get = () => ({ auth: { user: { id: 'u1' }, tier: 'premium', role: null }, maxSaves: () => Infinity, savedSettlements: [] });
    towns = [];
    for (const [i, [size, crisis]] of SEEDS.entries()) {
      const cfg = birthConfig({ ...DEFAULT_CONFIG, ...dials, settType: size, ...(crisis ? { selectedStresses: [crisis], selectedStressesRandom: false } : {}) });
      const born = clone(withPublicProse(...((t) => [t, composePublicProse(t)])(generateSettlementPipeline(cfg, null, { seed: `vr25-import-${size}-${crisis || 'calm'}-${i}`, customContent: {} }))));
      const served = withholdAlways(clone(veil.projectShareVeil(veil.galleryPayloadFor(born, { shareDm: false, memberOverrides: mo }), mo)), PATTERNS);
      mocks.payload = served; mocks.captured = null;
      await importGallerySettlementImpl(get, () => {}, `slug-${i}`);
      towns.push({ seed: `${size}-${crisis || 'calm'}-${i}`, born, served, saved: clone(mocks.captured.settlement), hidden: (born.institutions || []).filter((h) => isHideableHouse(h)).length });
    }
  }, ARM_TIMEOUT_MS);

  it('the share withholds the ten before the import runs (the arms read a real absence), and the corpus has towns with and without a hidden house', () => {
    for (const t of towns) {
      expect(t.served.economicState?.compound?.criminalEffective, t.seed).toBeUndefined();
      expect(t.served.defenseProfile?.readiness?.score, t.seed).toBeUndefined();
      expect(t.served.spatialLayout?.quarters, t.seed).toBeUndefined();
    }
    expect(towns.filter((t) => t.hidden > 0).length).toBeGreaterThan(1);
    expect(towns.filter((t) => t.hidden === 0).length).toBeGreaterThan(1);
  });

  it('1: the ten arrive on the importer\'s record, or are left out whole (no default, no blank row)', () => {
    const bad = [];
    for (const { seed, saved: s } of towns) {
      const e = s.economicState || {};
      for (const k of lib.rederive.REDERIVED_COMPOUND_KEYS) {
        if (e.compound?.[k] === undefined) bad.push(`${seed}: compound.${k} absent`);
        if (e.safetyProfile && e.safetyProfile.compound?.[k] === undefined) bad.push(`${seed}: safetyProfile.compound.${k} absent`);
      }
      if (e.safetyProfile && !Number.isFinite(e.safetyProfile.safetyRatio)) bad.push(`${seed}: safetyRatio absent`);
      if (e.foodSecurity && !Number.isFinite(e.foodSecurity.storageMonths)) bad.push(`${seed}: storageMonths absent`);
      if (s.defenseProfile?.readiness && !Number.isFinite(s.defenseProfile.readiness.score)) bad.push(`${seed}: readiness.score absent`);
      if (s.spatialLayout && !Array.isArray(s.spatialLayout.quarters)) bad.push(`${seed}: quarters absent`);
      for (const c of s.activeConditions || []) if (!Number.isFinite(c?.severity)) bad.push(`${seed}: condition ${c?.archetype} without a severity`);
      const b = s.powerStructure?.publicLegitimacy?.breakdown;
      if (s.powerStructure?.publicLegitimacy && !Number.isFinite(b?.safety)) bad.push(`${seed}: breakdown.safety absent`);
      for (const k of ['stress', 'stressors']) for (const x of [s[k]].flat()) {
        for (const r of x?.cast?.roles || []) if (!r?.role || !r?.reason) bad.push(`${seed}: ${k}.cast.roles row without role or reason`);
        for (const r of x?.cast?.absent || []) if (!r?.role || !r?.reason) bad.push(`${seed}: ${k}.cast.absent row without role or reason`);
        for (const r of x?.cast?.stakes || []) if (!r?.stake || !r?.reason) bad.push(`${seed}: ${k}.cast.stakes row without stake or reason`);
      }
    }
    expect(bad).toEqual([]);
  });

  it('2: the re-derivation reads no withheld path', () => {
    const reads = towns.flatMap(({ seed, served }) => {
      const { rec, hits } = recorder(clone(served), PATTERNS);
      lib.rederive.rederiveInPlace(rec);
      return [...hits].map((h) => `${seed}: ${h}`);
    });
    expect(reads).toEqual([]);
  });

  it('3: on a town with nothing hidden, every field the served document decides equals the value it was born with', () => {
    const bad = [];
    for (const { seed, born, saved, hidden } of towns.filter((t) => t.hidden === 0)) {
      void hidden;
      const want = (p) => p.split('.').reduce((o, k) => o?.[k], born);
      const have = (p) => p.split('.').reduce((o, k) => o?.[k], saved);
      const paths = [
        ...lib.rederive.REDERIVED_COMPOUND_KEYS.map((k) => `economicState.compound.${k}`),
        ...lib.rederive.REDERIVED_COMPOUND_KEYS.map((k) => `economicState.safetyProfile.compound.${k}`),
        'economicState.safetyProfile.safetyRatio', 'economicState.foodSecurity.storageMonths', 'defenseProfile.readiness.score',
        'spatialLayout.quarters', 'powerStructure.publicLegitimacy.breakdown.safety',
      ];
      for (const p of paths) if (JSON.stringify(have(p)) !== JSON.stringify(want(p))) bad.push(`${seed}: ${p} ${JSON.stringify(have(p))?.slice(0, 60)} vs born ${JSON.stringify(want(p))?.slice(0, 60)}`);
      for (const p of ['economicState.prosperity', 'powerStructure.publicLegitimacy.breakdown.prosperity']) {
        if (have(p) !== undefined && JSON.stringify(have(p)) !== JSON.stringify(want(p))) bad.push(`${seed}: ${p} ${have(p)} vs born ${want(p)}`);
      }
      const sev = new Map((saved.activeConditions || []).map((c) => [c.archetype, c.severity]));
      for (const c of born.activeConditions || []) if (sev.has(c.archetype) && sev.get(c.archetype) !== c.severity) bad.push(`${seed}: severity ${c.archetype}`);
    }
    expect(bad).toEqual([]);
  });

  it('4: where the veil removed a house, the compound is the engine\'s reading over the served houses, never the stored figure', () => {
    const hiddenTowns = towns.filter((t) => t.hidden > 0);
    const bad = [];
    let moved = 0;
    for (const { seed, served, saved, born } of hiddenTowns) {
      const want = lib.flags.getInstFlags(served.config, served.institutions || []);
      for (const k of ['criminalEffective', 'criminalPreStress', 'militaryEffective', 'economyOutput']) {
        if (saved.economicState.compound[k] !== want[k]) bad.push(`${seed}: ${k} ${saved.economicState.compound[k]} vs ${want[k]}`);
        if (saved.economicState.compound[k] !== born.economicState.compound[k]) moved += 1;
      }
    }
    expect(bad).toEqual([]);
    expect(moved, 'the corpus holds a town whose stored compound counted a hidden house').toBeGreaterThan(0);
  });
});
