// born.mjs — birth one review-720 seed in a tree (the census's cfgFor), shared by the probes.
import path from 'node:path';
export async function bornIn(tree) {
  const R = path.resolve(tree) + '/src';
  const { generateSettlementPipeline } = await import(R + '/generators/generateSettlementPipeline.js');
  const { birthConfig, loadGenerationLawPayloads } = await import(R + '/domain/density/densityCreateBoundary.js');
  const { DEFAULT_CONFIG } = await import(R + '/store/configSlice.js');
  await loadGenerationLawPayloads();
  const dials = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
  const cfgFor = (seed) => {
    let m = seed.match(/^r2r-(\w+)-(\d+)$/); if (m) return birthConfig({ ...DEFAULT_CONFIG, ...dials, settType: m[1] });
    m = seed.match(/^r2s-(\w+)-(thorp|hamlet|village|town|city|metropolis)-(\d+)$/); if (m) return birthConfig({ ...DEFAULT_CONFIG, ...dials, selectedStresses: [m[1]], selectedStressesRandom: false, settType: m[2] });
    throw new Error(seed);
  };
  return (seed) => generateSettlementPipeline(cfgFor(seed), null, { seed, customContent: {} });
}
export const SIZES = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
export const STRESSES = ['under_siege', 'famine', 'occupied', 'politically_fractured', 'indebted', 'recently_betrayed', 'infiltrated', 'plague_onset', 'succession_void', 'monster_pressure', 'insurgency', 'religious_conversion', 'slave_revolt', 'wartime', 'mass_migration'];
export function seeds720() { const s = []; for (const t of SIZES) for (let i = 0; i < 60; i++) s.push(`r2r-${t}-${i}`); for (const x of STRESSES) for (const t of SIZES) for (let i = 0; i < 4; i++) s.push(`r2s-${x}-${t}-${i}`); return s; }
