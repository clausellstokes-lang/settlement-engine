// COHERENCE-VEIL-6, the chair's added item: where do the ratings' machinery keys sit in what a NON-OWNER receives?
import { it } from 'vitest';
import { writeFileSync } from 'node:fs';
const SRC = process.env.RV5_SRC;
const isRec = (v) => !!v && typeof v === 'object' && !Array.isArray(v);
it('machinery trace', async () => {
  const M = `${SRC}/src`;
  const { generateSettlementPipeline } = await import(`${M}/generators/generateSettlementPipeline.js`);
  const { birthConfig, loadGenerationLawPayloads } = await import(`${M}/domain/density/densityCreateBoundary.js`);
  const { DEFAULT_CONFIG } = await import(`${M}/store/configSlice.js`);
  const { toPublicSafe } = await import(`${M}/domain/display/publicSafe.js`);
  const { buildWorldExport } = await import(`${M}/lib/worldExport.js`);
  await loadGenerationLawPayloads();
  const dials = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true,
    selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
  const KEYS = new Set(['breakdown', 'govMultiplier', 'crimMultiplier', 'weight']);
  const out = { towns: 0, record: {}, publicSafe: {}, exportPlayer: {}, exportOwner: {}, docs: [] };
  const walk = (v, p, acc) => { if (Array.isArray(v)) v.forEach((x) => walk(x, `${p}[]`, acc)); else if (isRec(v)) for (const [k, x] of Object.entries(v)) { const q = p ? `${p}.${k}` : k; if (KEYS.has(k)) acc[q] = (acc[q] || 0) + 1; walk(x, q, acc); } };
  let i = 0;
  for (const size of ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis']) for (const k of [0, 1, 2, 3]) {
    i += 1; if (i > Number(process.env.N || 20)) break;
    const s = generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, ...dials, settType: size }), null, { seed: `cv6-mach-${size}-${k}`, customContent: {} });
    out.towns += 1;
    walk(s, '', out.record);
    walk(toPublicSafe(s, {}), '', out.publicSafe);
    if (i === 1) out.docs.push(JSON.stringify(s).length);
    try {
      const world = { settlements: [s], name: 'W' };
      walk(buildWorldExport(world, {}), '', out.exportPlayer);
      walk(buildWorldExport(world, { full: true }), '', out.exportOwner);
    } catch (e) { out.exportError = String(e.message).slice(0, 200); }
  }
  writeFileSync(process.env.RV5_OUT, JSON.stringify(out, null, 1));
}, 1800000);
