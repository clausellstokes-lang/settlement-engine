/**
 * docs/evidence/phase4-wf5-oracle/stage2-corpus-outputs.mjs
 *
 * Emit FULL settlement outputs for the golden-master corpus from a given repo
 * root — used to produce BEFORE (HEAD worktree) and AFTER (working tree)
 * snapshots for the W-F5 stage-2 field-path diff evidence.
 *
 * The corpus construction MIRRORS tests/property/generatorGoldenMaster.test.js
 * exactly (same rows, same keys), so every manifest key is covered.
 *
 * Usage: node stage2-corpus-outputs.mjs <repoRoot> <outFile.json>
 */

const [, , repoRoot, outFile] = process.argv;
if (!repoRoot || !outFile) {
  console.error('usage: node stage2-corpus-outputs.mjs <repoRoot> <outFile.json>');
  process.exit(1);
}

const { generateSettlementPipeline } = await import(`${repoRoot}/src/generators/generateSettlementPipeline.js`);
const { writeFileSync } = await import('node:fs');

const TIERS = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
const CULTURES = ['germanic', 'celtic', 'norse', 'mediterranean'];
const TERRAINS = ['plains', 'hills', 'forest', 'riverside', 'coastal', 'mountain', 'desert'];
const TERRAIN_ROUTE = {
  plains: 'road', hills: 'road', forest: 'isolated',
  riverside: 'river', coastal: 'port', mountain: 'road', desert: 'road',
};
const TRADE = ['road', 'river', 'port', 'crossroads', 'isolated', 'none'];
const THREAT = ['safe', 'civilized', 'frontier', 'plagued'];

const keyOf = (c) => [c.settType, c.culture, c.terrainOverride, c.tradeRouteAccess, c.monsterThreat, c._seed].join('|');

function corpus() {
  const rows = [];
  const base = { settType: 'town', culture: 'germanic', terrainOverride: 'plains', tradeRouteAccess: 'road', monsterThreat: 'civilized' };
  const seed = 'golden-master-v3';
  for (const settType of TIERS) for (const culture of CULTURES) for (const terrainOverride of TERRAINS) {
    rows.push({ ...base, settType, culture, terrainOverride, tradeRouteAccess: TERRAIN_ROUTE[terrainOverride], _seed: seed });
  }
  for (const tradeRouteAccess of TRADE) rows.push({ ...base, tradeRouteAccess, _seed: seed });
  for (const monsterThreat of THREAT) rows.push({ ...base, monsterThreat, _seed: seed });
  for (const s of [seed, 'gm-seed-a', 'gm-seed-b', 'gm-seed-c']) {
    rows.push({ ...base, tradeRouteAccess: 'random_trade', terrainOverride: 'auto', _seed: s });
    rows.push({ ...base, tradeRouteAccess: 'random_trade', terrainOverride: 'mountain', _seed: s });
  }
  for (const s of ['gm-seed-a', 'gm-seed-b', 'gm-seed-c']) rows.push({ ...base, _seed: s });
  const seen = new Set();
  return rows.filter((c) => { const k = keyOf(c); if (seen.has(k)) return false; seen.add(k); return true; });
}

const out = {};
for (const c of corpus()) {
  const { _seed, ...cfg } = c;
  out[keyOf(c)] = generateSettlementPipeline(cfg, null, { seed: _seed, customContent: {} });
}
writeFileSync(outFile, JSON.stringify(out));
console.log(`${Object.keys(out).length} corpus outputs -> ${outFile}`);
