// AGREE-FOLLOW-UP probe 8 — does the arm's CALAMITY_REBUILD perturbation (calamityHistory [] vs
// nine stamps of deaths 10, exodus 5) move any OTHER cause's value? Over the arm's 42 roster-free
// births: per cause, on how many births its value differs between the two extremes, and how
// many births' score rises when CALAMITY's own contribution is subtracted out.
// usage: node sewerCalamityCrossTalk.mjs <tree root>
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
const root = resolve(process.argv[2]);
const imp = (p) => import(pathToFileURL(join(root, p)).href);
const { generateSettlementPipeline } = await imp('src/generators/generateSettlementPipeline.js');
const { TIER_ORDER } = await imp('src/data/constants.js');
const { sanitationRosterOf } = await imp('src/domain/undercity/strataExistence.js');
const { deriveSewerLadder } = await imp('src/domain/undercity/sewerDerivation.js');
const TR = { plains: 'road', hills: 'road', forest: 'isolated', riverside: 'river', coastal: 'port', mountain: 'road', desert: 'road' };
const free = TIER_ORDER.flatMap((t) => Object.keys(TR).map((terrain) => generateSettlementPipeline({ settType: t, culture: 'germanic', terrainOverride: terrain, tradeRouteAccess: TR[terrain], monsterThreat: 'civilized' }, null, { seed: `uc1-acc-${t}-${terrain}`, customContent: {} }))).map((s) => ({ ...s, institutions: s.institutions.filter((i) => !sanitationRosterOf([i]).length) }));
const stamps = (n, type) => Array.from({ length: n }, (_, i) => ({ type, name: `strike ${i}`, year: 40 + i, tick: i, deaths: 10, exodus: 5, k: 1, targets: [] }));
const lo = (s) => ({ ...s, calamityHistory: [] }), hi = (s) => ({ ...s, calamityHistory: stamps(9, 'x') });
const moved = {}; let restUp = 0;
for (const s of free) {
  const a = deriveSewerLadder(lo(s)), b = deriveSewerLadder(hi(s));
  for (const c of a.causes) { const d = b.causes.find((x) => x.cause === c.cause); if (d.value !== c.value) moved[c.cause] = (moved[c.cause] || 0) + 1; }
  const rest = (l) => l.causes.filter((c) => c.cause !== 'CALAMITY_REBUILD').reduce((n, c) => n + c.contribution, 0);
  if (rest(b) > rest(a)) restUp++;
}
console.log(`causes whose value moves under the CALAMITY perturbation (births of 42): ${JSON.stringify(moved)} | births whose score less CALAMITY's own term rises: ${restUp}`);
