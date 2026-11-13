// The two corpora (L2): R = the reviewer's (rvw 100 x 6 tiers, rvf 15 stresses x 6 tiers x 8, the golden's 525 as the golden
// calls them); S = the second seat's (critique 150/150/60/160/100/40, l2 15 stresses x 6 tiers x 20). Every corpus birth but
// the golden's goes through birthConfig with the browser's dials.
export const DIALS = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
export const TIERS = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
export async function jobsFor(imp, which) {
  const { birthConfig } = await imp('src/domain/density/densityCreateBoundary.js');
  const { STRESS_TYPE_MAP } = await imp('src/data/stressTypes.js');
  const STRESSES = Object.keys(STRESS_TYPE_MAP);
  const jobs = [];
  if (which.includes('R')) {
    for (const t of TIERS) for (let i = 0; i < 100; i++) jobs.push({ key: `rvw-${t}-${i}`, c: 'R', tier: t, stress: null, cfg: birthConfig({ ...DIALS, settType: t }), seed: `rvw-${t}-${i}` });
    for (const st of STRESSES) for (const t of TIERS) for (let i = 0; i < 8; i++) jobs.push({ key: `rvf-${st}-${t}-${i}`, c: 'R', tier: t, stress: st, seed: `rvf-${st}-${t}-${i}`, cfg: birthConfig({ ...DIALS, settType: t, selectedStresses: [st], selectedStressesRandom: false }) });
  }
  if (which.includes('G')) {
    const { goldenCorpus, keyOf } = await imp('tests/helpers/goldenMasterCorpus.js');
    for (const g of goldenCorpus()) { const { _seed, ...cfg } = g; jobs.push({ key: 'golden:' + keyOf(g), c: 'G', tier: cfg.settType, stress: null, cfg, seed: _seed }); }
  }
  if (which.includes('S')) {
    const N = { thorp: 150, hamlet: 150, village: 60, town: 160, city: 100, metropolis: 40 };
    for (const t of TIERS) for (let i = 0; i < N[t]; i++) jobs.push({ key: `critique-${t}-${i}`, c: 'S', tier: t, stress: null, seed: `critique-${t}-${i}`, cfg: birthConfig({ ...DIALS, settType: t }) });
    for (const st of STRESSES) for (const t of TIERS) for (let i = 0; i < 20; i++) jobs.push({ key: `l2-${st}-${t}-${i}`, c: 'S', tier: t, stress: st, seed: `l2-${st}-${t}-${i}`, cfg: birthConfig({ ...DIALS, settType: t, selectedStresses: [st], selectedStressesRandom: false }) });
  }
  return jobs;
}
