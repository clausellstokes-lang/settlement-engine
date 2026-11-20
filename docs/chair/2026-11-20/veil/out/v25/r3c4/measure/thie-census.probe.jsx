// R3-CURE-4 unit 2, THE CENSUS (twin side, no server needed: the projection is the input power.entry reads): the born pool of
// keys.probe.jsx (sizes x crises x N, seed r3m-<size>-<crisis>-<k>-<idx>), each town's projection (galleryPayloadFor, Reveal DM
// off and on): every power of either list whose name matches /thie/i, with its category; and how many such powers the two
// readings of power.entry's criminal test disagree on: OLD (category 'criminal' OR a thieves' name) and NEW (category 'criminal';
// a thieves' name only where the power carries NO category string). Out: RV9_OUT (JSON).
import { it, vi } from 'vitest';
import { writeFileSync } from 'node:fs';
const SRC = process.env.RV6_SRC;
vi.mock(`${process.env.RV6_SRC}/src/lib/supabase.js`, () => ({ supabase: { rpc: async () => ({ data: null, error: null }) }, isConfigured: true }));
const SIZES = 'village,town,town,city,city,metropolis,metropolis'.split(',');
const CRISES = 'none,infiltrated,none,insurgency,occupied,indebted,none,under_siege,wartime,politically_fractured'.split(',');
const N = Number(process.env.RV9_N || 2);
const isRec = (v) => !!v && typeof v === 'object' && !Array.isArray(v);
const clone = (v) => JSON.parse(JSON.stringify(v));
it('thie census', async () => {
  const { generateSettlementPipeline } = await import(`${SRC}/src/generators/generateSettlementPipeline.js`);
  const { birthConfig, loadGenerationLawPayloads } = await import(`${SRC}/src/domain/density/densityCreateBoundary.js`);
  const { DEFAULT_CONFIG } = await import(`${SRC}/src/store/configSlice.js`);
  const { isHideableHouse } = await import(`${SRC}/src/domain/people/cardVeil.js`);
  const veil = await import(`${SRC}/src/domain/display/galleryVeil.js`);
  await loadGenerationLawPayloads();
  const dials = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
  const low = (v) => (typeof v === 'string' ? v.replace(/[A-Z]/g, (c) => c.toLowerCase()) : '');
  const nameOf = (f) => (typeof (f.faction !== undefined ? f.faction : f.name) === 'string' ? (f.faction !== undefined ? f.faction : f.name) : '');
  const OLD = (f) => f.isGoverning !== true && (low(f.category) === 'criminal' || /thie/i.test(nameOf(f)));
  const NEW = (f) => f.isGoverning !== true && (low(f.category) === 'criminal' || (typeof f.category !== 'string' && /thie/i.test(nameOf(f))));
  const out = { towns: 0, hiddenHouseTowns: 0, projections: 0, powers: 0, thie: {}, disagree: [] };
  let idx = 0;
  for (const size of SIZES) for (const crisis of CRISES) for (let k = 0; k < N; k += 1) {
    idx += 1;
    const seed = `r3m-${size}-${crisis}-${k}-${idx}`;
    const cfg = { ...DEFAULT_CONFIG, ...dials, settType: size, ...(crisis !== 'none' ? { selectedStresses: [crisis], selectedStressesRandom: false } : {}) };
    const t = generateSettlementPipeline(birthConfig(cfg), null, { seed, customContent: {} });
    out.towns += 1;
    if ((t.institutions || []).some((h) => isHideableHouse(h))) out.hiddenHouseTowns += 1;
    for (const dm of [false, true]) {
      const pub = veil.galleryPayloadFor(clone(t), { shareDm: dm });
      out.projections += 1;
      for (const [list, fs] of [['powerStructure.factions', pub.powerStructure?.factions], ['factions', pub.factions]]) {
        for (const f of Array.isArray(fs) ? fs.filter(isRec) : []) {
          out.powers += 1;
          if (/thie/i.test(nameOf(f))) { const key = `${nameOf(f)} | category ${JSON.stringify(f.category)} | governing ${f.isGoverning === true}`; out.thie[key] = (out.thie[key] || 0) + 1; }
          if (OLD(f) !== NEW(f)) out.disagree.push({ seed, dm, list, name: nameOf(f), category: f.category });
        }
      }
    }
  }
  writeFileSync(process.env.RV9_OUT, JSON.stringify(out, null, 1));
}, 3600000);
