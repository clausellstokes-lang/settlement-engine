// AGREE-FOLLOW-UP probe 4 — is PROSPERITY_BAND live at a tree? Over the arm's own 42
// roster-free births: (a) the score at Destitute vs Wealthy on every birth; (b) the rung
// at the two extremes under K re-rolled identities per birth (`id: s_pros_<n>`, the device
// the file's own determinism and boundary arms use), counting up- and down-moves;
// (c) the score, and the cause's own term (.causes[].contribution), at the two extremes over the same 42 x K; (d) the same over the arm's other three RAISES causes, for comparison.
// usage: node sewerProsperityIdentities.mjs <tree root> <K>
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
const root = resolve(process.argv[2]); const K = Number(process.argv[3] || 8);
const imp = (p) => import(pathToFileURL(join(root, p)).href);
const { generateSettlementPipeline } = await imp('src/generators/generateSettlementPipeline.js');
const { TIER_ORDER } = await imp('src/data/constants.js');
const { SANITATION_LADDER, sanitationRosterOf } = await imp('src/domain/undercity/strataExistence.js');
const { deriveSewerLadder } = await imp('src/domain/undercity/sewerDerivation.js');
const { facetOf } = await imp('src/domain/spatial/cohesionWeave.js');
const TR = { plains: 'road', hills: 'road', forest: 'isolated', riverside: 'river', coastal: 'port', mountain: 'road', desert: 'road' };
const free = TIER_ORDER.flatMap((t) => Object.keys(TR).map((terrain) => generateSettlementPipeline(
  { settType: t, culture: 'germanic', terrainOverride: terrain, tradeRouteAccess: TR[terrain], monsterThreat: 'civilized' }, null, { seed: `uc1-acc-${t}-${terrain}`, customContent: {} })))
  .map((s) => ({ ...s, institutions: s.institutions.filter((i) => !sanitationRosterOf([i]).length) }));
const stamps = (n, type) => Array.from({ length: n }, (_, i) => ({ type, name: `strike ${i}`, year: 40 + i, tick: i, deaths: 10, exodus: 5, k: 1, targets: [] }));
const causes = {
  PROSPERITY_BAND: [(s) => ({ ...s, economicState: { ...s.economicState, prosperity: 'Destitute' } }), (s) => ({ ...s, economicState: { ...s.economicState, prosperity: 'Wealthy' } })],
  CIVIC_CAPACITY: [(s) => ({ ...s, institutions: s.institutions.filter((i) => facetOf(i, 'institutionNature') !== 'civic') }), (s) => ({ ...s, institutions: [...s.institutions, { name: 'Town hall' }, { name: 'High court' }, { name: 'Grand assembly' }, { name: 'Elders council' }] })],
  CALAMITY_REBUILD: [(s) => ({ ...s, calamityHistory: [] }), (s) => ({ ...s, calamityHistory: stamps(9, 'x') })],
  HIGH_WATER_POPULATION: [(s) => ({ ...s, config: { ...s.config, peakTier: undefined } }), (s) => ({ ...s, config: { ...s.config, peakTier: 'metropolis' } })],
};
const ri = (s) => SANITATION_LADDER.indexOf(deriveSewerLadder(s).rung);
for (const [name, [lo, hi]] of Object.entries(causes)) {
  const scoreUp = free.filter((s) => deriveSewerLadder(hi(s)).score > deriveSewerLadder(lo(s)).score).length;
  const asIs = free.map((s) => ri(hi(s)) - ri(lo(s)));
  let up = 0, down = 0, scoreUpK = 0, termUpK = 0, birthsUp = new Set();
  const termOf = (x) => deriveSewerLadder(x).causes.find((c) => c.cause === name).contribution;
  free.forEach((s, b) => { for (let n = 0; n < K; n++) { const x = { ...s, id: `s_pros_${n}` }; if (deriveSewerLadder(hi(x)).score > deriveSewerLadder(lo(x)).score) scoreUpK++; if (termOf(hi(x)) > termOf(lo(x))) termUpK++; const d = ri(hi(x)) - ri(lo(x)); if (d > 0) { up++; birthsUp.add(b); } if (d < 0) down++; } });
  console.log(`${name}: score rises on ${scoreUp}/42 | rung, the arm as written: up ${asIs.filter((d) => d > 0).length} down ${asIs.filter((d) => d < 0).length} | over ${K} identities x 42: up ${up} (births ${[...birthsUp].map((b) => free[b].tier + '/' + free[b].config.terrainType).join(',')}) down ${down} | score rises on ${scoreUpK} of ${free.length * K} | own term rises on ${termUpK} of ${free.length * K}`);
}
