/**
 * galleryImportServedBand.test.js — THE IMPORT KEEPS THE SERVED PROSPERITY BAND (VR28, the seventh chair, 2026-11-20
 * 01:35 UTC: the prosperity band is TIER 2, served as stored; PART 21 section 5e point 1, placed with VEIL-21's side
 * builder by the chair at 02:42 UTC; each vetoable by the owner; src/domain/veil/importRederive.js step 4).
 *
 * THE SHARE AS VR28 SENDS IT: born towns, the default veil (writeShareVeil({}, [])), Reveal DM off, read by the
 * client's twin (galleryPayloadFor, projectShareVeil); then every path the roster-choice registry withholds on EVERY
 * non-owner read deleted (its `withhold`/`always` rows). The prosperity band is a `diffuse` row: it stays. The tree's
 * own import runs over that document (galleryImportRederive.test.js's door: the rpc and the save mocked).
 *
 * THE ARMS:
 *   CORPUS  the share serves each town's stored band, and the corpus holds a Subsistence town (its base took a birth
 *           draw, so no served field re-derives the band).
 *   BAND    the importer's record carries the SERVED band on every town (a Subsistence town's band is not dropped; a
 *           band a hidden house moved is not changed).
 *   DEPENDENT  the fields the import derives from the band read the served band: the legitimacy cause equals the
 *           engine's contribution for that band; the readiness score and each condition's severity equal the engine's
 *           own functions over the importer's record; on a town with nothing hidden each equals the value it was born with.
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
/** Small towns (a Subsistence base is a small town's) and large ones (a hidden house can move the band). */
const SEEDS = [
  ['thorp', null], ['hamlet', null], ['thorp', 'famine'], ['hamlet', 'plague_onset'], ['village', null],
  ['city', 'indebted'], ['metropolis', null], ['town', null],
];
const isRec = (v) => !!v && typeof v === 'object' && !Array.isArray(v);
const clone = (v) => JSON.parse(JSON.stringify(v));

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

describe('VR28: the import keeps the served prosperity band, and what it derives from the band reads it', () => {
  let towns;
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
      defence: await import('../../src/generators/defenseGenerator.js'),
      legitimacy: await import('../../src/generators/factionDynamics.js'),
      promote: await import('../../src/domain/conditionPromotion.js'),
    };
    await loadGenerationLawPayloads();
    const PATTERNS = REGISTRY_ROWS.filter((r) => r.rule === 'withhold' && r.when === 'always').map((r) => new RegExp(r.path));
    const dials = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
    const mo = veil.writeShareVeil({}, []);
    const get = () => ({ auth: { user: { id: 'u1' }, tier: 'premium', role: null }, maxSaves: () => Infinity, savedSettlements: [] });
    towns = [];
    for (const [i, [size, crisis]] of SEEDS.entries()) {
      const cfg = birthConfig({ ...DEFAULT_CONFIG, ...dials, settType: size, ...(crisis ? { selectedStresses: [crisis], selectedStressesRandom: false } : {}) });
      const born = clone(withPublicProse(...((t) => [t, composePublicProse(t)])(generateSettlementPipeline(cfg, null, { seed: `vr28-band-${size}-${crisis || 'calm'}-${i}`, customContent: {} }))));
      const served = withholdAlways(clone(veil.projectShareVeil(veil.galleryPayloadFor(born, { shareDm: false, memberOverrides: mo }), mo)), PATTERNS);
      mocks.payload = served; mocks.captured = null;
      await importGallerySettlementImpl(get, () => {}, `slug-${i}`);
      const subsistence = lib.rederive.servedProsperityOutcomes(born, born.config).length > 1;
      const fromServedHouses = lib.rederive.servedProsperityOutcomes(served, served.config);
      towns.push({ seed: `${size}-${crisis || 'calm'}-${i}`, born, served, saved: clone(mocks.captured.settlement), subsistence, fromServedHouses,
        hidden: (born.institutions || []).filter((h) => isHideableHouse(h)).length });
    }
  }, ARM_TIMEOUT_MS);

  it('CORPUS: the share serves each town\'s stored band, and the corpus holds a Subsistence town', () => {
    for (const t of towns) expect(t.served.economicState?.prosperity, t.seed).toBe(t.born.economicState.prosperity);
    expect(towns.filter((t) => t.subsistence).map((t) => t.seed).length, towns.map((t) => `${t.seed}:${t.born.economicState.prosperity}:${t.subsistence ? 'S' : '-'}:h${t.hidden}`).join(' ')).toBeGreaterThan(0);
  });

  it('BAND: the importer\'s record carries the served band on every town', () => {
    const bad = towns.filter((t) => t.saved.economicState?.prosperity !== t.served.economicState.prosperity)
      .map((t) => `${t.seed}${t.subsistence ? ' (Subsistence)' : ''}: served ${t.served.economicState.prosperity}, imported ${t.saved.economicState?.prosperity}`);
    expect(bad).toEqual([]);
  });

  it('DEPENDENT: the legitimacy cause, the readiness score and each condition\'s severity read the served band', () => {
    const bad = [];
    for (const { seed, born, served, saved, hidden } of towns) {
      const band = served.economicState.prosperity;
      const cause = lib.legitimacy.computePublicLegitimacy({ prosperity: band }, '', String(saved.tier)).breakdown.prosperity;
      const b = saved.powerStructure?.publicLegitimacy?.breakdown;
      if (saved.powerStructure?.publicLegitimacy && b?.prosperity !== cause) bad.push(`${seed}: breakdown.prosperity ${b?.prosperity} vs the band's ${cause}`);
      const readiness = saved.defenseProfile?.readiness;
      const want = Math.round(Math.round(Number(lib.defence.defenceExactOf(saved).readiness) * 100) / 100);
      if (readiness && readiness.score !== want) bad.push(`${seed}: readiness.score ${readiness.score} vs the record's own ${want}`);
      const by = new Map((lib.promote.promoteStressorsToConditions({ ...saved, activeConditions: [] }).activeConditions || []).map((c) => [c.archetype, c.severity]));
      const servedArchetypes = (served.activeConditions || []).map((c) => c.archetype);
      const savedArchetypes = (saved.activeConditions || []).map((c) => c.archetype);
      if (JSON.stringify(savedArchetypes) !== JSON.stringify(servedArchetypes.filter((a) => by.has(a)))) bad.push(`${seed}: conditions ${savedArchetypes} vs served ${servedArchetypes}`);
      for (const c of saved.activeConditions || []) if (c.severity !== by.get(c.archetype)) bad.push(`${seed}: severity ${c.archetype} ${c.severity} vs ${by.get(c.archetype)}`);
      if (hidden === 0) {
        if (saved.powerStructure?.publicLegitimacy && b?.prosperity !== born.powerStructure.publicLegitimacy.breakdown.prosperity) bad.push(`${seed}: breakdown.prosperity ${b?.prosperity} vs born ${born.powerStructure.publicLegitimacy.breakdown.prosperity}`);
        if (readiness && readiness.score !== born.defenseProfile.readiness.score) bad.push(`${seed}: readiness.score ${readiness.score} vs born ${born.defenseProfile.readiness.score}`);
        const bornSev = new Map((born.activeConditions || []).map((c) => [c.archetype, c.severity]));
        for (const c of saved.activeConditions || []) if (c.severity !== bornSev.get(c.archetype)) bad.push(`${seed}: severity ${c.archetype} ${c.severity} vs born ${bornSev.get(c.archetype)}`);
        if ((saved.activeConditions || []).length !== (born.activeConditions || []).length) bad.push(`${seed}: ${(saved.activeConditions || []).length} conditions vs born ${(born.activeConditions || []).length}`);
      }
    }
    expect(bad).toEqual([]);
  });

  it('FALLBACK: where the served document lacks the band, it is re-derived where the served houses decide it, else left out with its cause', () => {
    const bad = [];
    for (const { seed, served, fromServedHouses } of towns) {
      const doc = clone(served);
      delete doc.economicState.prosperity;
      const out = lib.rederive.rederiveServed(doc);
      const want = fromServedHouses.length === 1 ? fromServedHouses[0] : undefined;
      if (out.economicState.prosperity !== want) bad.push(`${seed}: ${out.economicState.prosperity} vs ${want}`);
      const b = out.powerStructure?.publicLegitimacy?.breakdown;
      if (want === undefined && b && Object.hasOwn(b, 'prosperity')) bad.push(`${seed}: a cause for an unknown band (${b.prosperity})`);
    }
    expect(bad).toEqual([]);
    expect(towns.filter((t) => t.fromServedHouses.length > 1).length).toBeGreaterThan(0);
  });
});
