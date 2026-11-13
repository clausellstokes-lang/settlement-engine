import { it } from 'vitest';
import { writeFileSync } from 'node:fs';
const SRC = process.env.RV5_SRC;
it('processing names against hideable houses', async () => {
  const M = `${SRC}/src`;
  const { generateSettlementPipeline } = await import(`${M}/generators/generateSettlementPipeline.js`);
  const { birthConfig, loadGenerationLawPayloads } = await import(`${M}/domain/density/densityCreateBoundary.js`);
  const { DEFAULT_CONFIG } = await import(`${M}/store/configSlice.js`);
  const { institutionMatchesProcessor } = await import(`${M}/generators/computeActiveChains.js`);
  const { isHideableHouse } = await import(`${M}/domain/people/cardVeil.js`);
  await loadGenerationLawPayloads();
  const dials = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true,
    selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
  const pairs = {}; let towns = 0; let entries = 0; const hideableOnly = {};
  for (let k = 0; k < Number(process.env.N || 30); k += 1) for (const size of ['hamlet', 'village', 'town', 'city', 'metropolis']) for (const stress of [null, 'infiltrated']) {
    const cfg = { ...DEFAULT_CONFIG, ...dials, settType: size, ...(stress ? { selectedStresses: [stress], selectedStressesRandom: false } : {}) };
    let s; try { s = generateSettlementPipeline(birthConfig(cfg), null, { seed: `cv6-proc-${size}-${stress}-${k}`, customContent: {} }); } catch { continue; }
    towns += 1;
    const insts = (s.institutions || []).filter((i) => i && typeof i === 'object');
    for (const c of s.economicState?.activeChains || []) for (const x of c.processingInstitutions || []) {
      entries += 1;
      const matched = insts.filter((i) => institutionMatchesProcessor(i, x));
      for (const i of matched) if (i.name !== x) { const key = `${x}  <=  ${i.name}${isHideableHouse(i) ? '  [HIDEABLE]' : ''}`; pairs[key] = (pairs[key] || 0) + 1; }
      if (matched.length && matched.every((i) => isHideableHouse(i)) && !matched.some((i) => i.name === x)) { const key = `${x} <= ${matched.map((i) => i.name).join(' | ')} @ cv6-proc-${size}-${stress}-${k}`; hideableOnly[key] = (hideableOnly[key] || 0) + 1; }
    }
  }
  writeFileSync(process.env.RV5_OUT, JSON.stringify({ towns, entries, hideableOnlyByOtherName: hideableOnly, pairs }, null, 1));
}, 3600000);
