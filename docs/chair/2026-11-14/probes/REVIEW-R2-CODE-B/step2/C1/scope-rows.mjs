import fs from 'node:fs'; import zlib from 'node:zlib';
const [tree, births, seeds] = process.argv.slice(2); const want = new Set(seeds.split(','));
const { loadGenerationLawPayloads } = await import(tree + '/src/domain/density/densityCreateBoundary.js'); await loadGenerationLawPayloads();
const { cultureScopeLine } = await import(tree + '/src/domain/summary/settlementQuickGuide.js');
for (const l of zlib.gunzipSync(fs.readFileSync(births)).toString().split('\n')) { if (!l) continue; const { seed, s } = JSON.parse(l); if (!want.has(seed)) continue;
  const v = cultureScopeLine(s); const fsx = s.economicState?.compound?.inst||{};
  console.log(seed, '|', s.tier, s.population, s.config?.terrainType, JSON.stringify(s.config?.nearbyResources), 'market', fsx.hasMarket, 'court', fsx.hasCourtSystem, '\n   ', typeof v==='string'?v:JSON.stringify(v)); }
