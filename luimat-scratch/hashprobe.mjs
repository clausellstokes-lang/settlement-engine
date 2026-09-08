// L-UI-MAT differential engine-hash probe. READ-ONLY against the dock; writes ONLY
// into the lane scratch. Replicates tests/property/generatorGoldenMaster.test.js's
// corpus() and hashFor() exactly, then emits per-row hashes + one aggregate digest.
// Used to prove CAR A moves no engine hash, BASE vs TIP, WITHOUT depending on the
// committed manifest (which is stale at dd5f13218 — 525/525 rows drift before any edit).
import { createHash } from 'node:crypto';
import { writeFileSync } from 'node:fs';
const DOCK = process.env.DOCK;
const { generateSettlementPipeline } = await import(`${DOCK}/src/generators/generateSettlementPipeline.js`);
const { CULTURE_PROFILE_KEYS } = await import(`${DOCK}/src/domain/cultureProfiles.js`);

const TIERS = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
const CULTURES = [...CULTURE_PROFILE_KEYS, 'mediterranean'];
const TERRAINS = ['plains', 'hills', 'forest', 'riverside', 'coastal', 'mountain', 'desert'];
const TERRAIN_ROUTE = { plains:'road', hills:'road', forest:'isolated', riverside:'river', coastal:'port', mountain:'road', desert:'road' };
const TRADE = ['road','river','port','crossroads','isolated','mountain_pass','none'];
const THREAT = ['safe','civilized','frontier','plagued'];
const keyOf = (c) => [c.settType,c.culture,c.terrainOverride,c.tradeRouteAccess,c.monsterThreat,c._seed].join('|');

function corpus() {
  const rows = [];
  const base = { settType:'town', culture:'germanic', terrainOverride:'plains', tradeRouteAccess:'road', monsterThreat:'civilized' };
  const seed = 'golden-master-v3';
  for (const settType of TIERS) for (const culture of CULTURES) for (const terrainOverride of TERRAINS)
    rows.push({ ...base, settType, culture, terrainOverride, tradeRouteAccess: TERRAIN_ROUTE[terrainOverride], _seed: seed });
  for (const tradeRouteAccess of TRADE) rows.push({ ...base, tradeRouteAccess, _seed: seed });
  rows.push({ ...base, tradeRouteAccess:'mountain_pass', terrainOverride:'mountain', _seed: seed });
  for (const monsterThreat of THREAT) rows.push({ ...base, monsterThreat, _seed: seed });
  for (const s of [seed,'gm-seed-a','gm-seed-b','gm-seed-c']) {
    rows.push({ ...base, tradeRouteAccess:'random_trade', terrainOverride:'auto', _seed:s });
    rows.push({ ...base, tradeRouteAccess:'random_trade', terrainOverride:'mountain', _seed:s });
  }
  for (const s of ['gm-seed-a','gm-seed-b','gm-seed-c']) rows.push({ ...base, _seed:s });
  const seen = new Set();
  return rows.filter((c) => { const k = keyOf(c); if (seen.has(k)) return false; seen.add(k); return true; });
}
function hashFor(config) {
  const { _seed, ...cfg } = config;
  const s = generateSettlementPipeline(cfg, null, { seed:_seed, customContent:{} });
  return createHash('sha256').update(JSON.stringify(s)).digest('hex');
}
const rows = corpus();
const out = {};
for (const c of rows) out[keyOf(c)] = hashFor(c);
const keys = Object.keys(out).sort();
const agg = createHash('sha256');
for (const k of keys) agg.update(k).update('\0').update(out[k]).update('\n');
const digest = agg.digest('hex');
const sorted = {}; for (const k of keys) sorted[k] = out[k];
writeFileSync(process.env.OUT, JSON.stringify({ rows: keys.length, aggregate: digest, hashes: sorted }, null, 2) + '\n');
console.log('ROWS=' + keys.length);
console.log('AGGREGATE=' + digest);
