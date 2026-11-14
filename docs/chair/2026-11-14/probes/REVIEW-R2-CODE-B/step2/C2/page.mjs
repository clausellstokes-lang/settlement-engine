// page.mjs <tree> <births.gz> <seeds,csv|ALL> : composeCrisisPage JSON (compact) per town
import fs from 'node:fs'; import zlib from 'node:zlib';
const [tree, births, seeds] = process.argv.slice(2); const want = seeds==='ALL'?null:new Set(seeds.split(','));
const { loadGenerationLawPayloads } = await import(tree + '/src/domain/density/densityCreateBoundary.js'); await loadGenerationLawPayloads();
const { composeCrisisPage } = await import(tree + '/src/domain/crisis/crisisPage.js');
for (const l of zlib.gunzipSync(fs.readFileSync(births)).toString().split('\n')) { if (!l) continue; const { seed, s } = JSON.parse(l); if (want && !want.has(seed)) continue;
  let p; try { p = composeCrisisPage(s); } catch (e) { p = 'ERR ' + e.message; }
  console.log(JSON.stringify({ seed, tier: s.tier, p })); }
