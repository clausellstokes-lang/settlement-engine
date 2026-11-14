import fs from 'node:fs'; import zlib from 'node:zlib';
const [tree, births, out] = process.argv.slice(2);
const { loadGenerationLawPayloads } = await import(tree + '/src/domain/density/densityCreateBoundary.js'); await loadGenerationLawPayloads();
const { cultureScopeLine } = await import(tree + '/src/domain/summary/settlementQuickGuide.js');
const res = {};
for (const l of zlib.gunzipSync(fs.readFileSync(births)).toString().split('\n')) { if (!l) continue; const { seed, s } = JSON.parse(l);
  let v; try { v = cultureScopeLine(s); } catch (e) { v = 'ERR ' + e.message; }
  const inst = (s.institutions||[]).map(i=>i.name);
  res[seed] = { v: typeof v==='string'?v:JSON.stringify(v), tier: s.tier, pop: s.population, terrain: s.config?.terrainType, res: s.config?.nearbyResources, market: s.economicState?.compound?.inst?.hasMarket, inst,
    gov: (s.factions||[]).find(f=>f.isGoverning||f.governing)?.name, st:(Array.isArray(s.stress)?s.stress:s.stress?[s.stress]:[]).map(x=>x.type).join('+')||'calm' };
}
fs.writeFileSync(out, JSON.stringify(res));
