// CENSUS-2: one seed -> configuration map for every corpus this instrument births, copied from the instruments that
// first born them (no new shape): r2r-/r2s- = SECOND-WAVE-CENSUS births.mjs (the 720); rr2s- = REVIEW-R2-STAGES
// render.rr2s.jsx; rww- = ROUND-3-CUT increment render.rww.jsx; rpf-/rw3- = render.rw3.jsx (the readers' towns).
const SIZE = '(thorp|hamlet|village|town|city|metropolis)';
const dials = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
export function makeCfgFor(birthConfig, DEFAULT_CONFIG) {
  return function cfgFor(seed) {
    let m = seed.match(new RegExp(`^r2r-${SIZE}-(\\d+)$`)); if (m) return birthConfig({ ...DEFAULT_CONFIG, ...dials, settType: m[1] });
    m = seed.match(new RegExp(`^r2s-(\\w+)-${SIZE}-(\\d+)$`)); if (m) return birthConfig({ ...DEFAULT_CONFIG, ...dials, selectedStresses: [m[1]], selectedStressesRandom: false, settType: m[2] });
    m = seed.match(new RegExp(`^rr2s-${SIZE}-([a-z_+]+)-([a-z_]+)-(\\d+)$`)); if (m) {
      const stresses = m[2] === 'calm' ? [] : m[2].split('+'); const route = m[3] === 'rand' ? {} : { tradeRouteAccess: m[3] };
      return birthConfig({ ...DEFAULT_CONFIG, ...route, settType: m[1], selectedStressesRandom: false, selectedStresses: stresses, _randomizePriorities: true }); }
    m = seed.match(new RegExp(`^(?:rww|rw3|rpf)-${SIZE}-([a-z_+]+)-(\\d+)$`)); if (m) {
      const stresses = m[2] === 'calm' ? [] : m[2].split('+');
      return birthConfig({ ...DEFAULT_CONFIG, settType: m[1], selectedStressesRandom: false, selectedStresses: stresses, _randomizePriorities: true }); }
    // REVIEW-POWERS-4: r4- the app's own shape (as rww-); r4g- the same under the grim content profile (slavery and trafficking admitted)
    m = seed.match(new RegExp(`^r[45](g?)-${SIZE}-([a-z_+]+)-(\\d+)$`)); if (m) {
      const stresses = m[3] === 'calm' ? [] : m[3].split('+');
      return birthConfig({ ...DEFAULT_CONFIG, settType: m[2], selectedStressesRandom: false, selectedStresses: stresses, _randomizePriorities: true, ...(m[1] ? { contentProfile: 'grim' } : {}) }); }
    throw new Error('CENSUS-2: no configuration for seed ' + seed);
  };
}
