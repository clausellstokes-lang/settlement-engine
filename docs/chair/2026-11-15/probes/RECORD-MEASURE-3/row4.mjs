// row 4: food made by magic where nothing magical stands. TREE=<tree> node row4.mjs <corpus>
import { createRequire } from 'node:module'; const require = createRequire(import.meta.url);
const L = require('./load.cjs')(process.argv[2]); const T = process.env.TREE;
const { foodLandOf } = await import(T + '/src/generators/foodLand.js'); const { deriveMagicReliance } = await import(T + '/src/domain/magicReliance.js');
const o = { magic: 0, relNone: 0, noDefTrad: 0, byFlag: {}, byTier: {} , pct1: 0}; const ex = [];
for (const { seed, s } of L) { const f = s.economicState.foodSecurity; const mp = f.foodRecord?.magicPct || 0;
  if (!((f.magicOffset || 0) > 0 || mp > 0)) continue; o.magic++;
  const rel = deriveMagicReliance(s).reading; const tr = s.defenseProfile.traditions || {};
  const land = foodLandOf(s.tier, s.institutions, { ...s.config, _population: s.population }, s.config.tradeRouteAccess);
  const flag = land.hasDruid ? 'druid' : land.hasDivine ? 'divine' : land.hasArcane ? 'arcane' : 'none';
  if (rel === 'none') { o.relNone++; o.byFlag[flag] = (o.byFlag[flag] || 0) + 1; o.byTier[s.tier] = (o.byTier[s.tier] || 0) + 1; if (mp <= 1) o.pct1++;
    if (!tr.hasArcane && !tr.hasDruid && !tr.hasDivine && !tr.hasArcaneGuild && !tr.hasAlchemy) o.noDefTrad++;
    if (ex.length < 4) ex.push([seed, s.tier, 'magicPct', mp, 'offset', f.magicOffset, flag, 'houses', s.institutions.filter((i) => /shrine|temple|church|druid|grove|chapel|priest|mage|wizard|hedge/i.test(i.name)).map((i) => i.name).join('|')].join(' ')); } }
console.log(JSON.stringify(o)); ex.forEach((e) => console.log(e));
