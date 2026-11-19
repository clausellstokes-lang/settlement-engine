// node peek.mjs <tree> <corpus> <seed> [house-substring]: marks, gaps of a house, imports
import fs from 'node:fs'; import zlib from 'node:zlib';
const [tree, corpus, seed, sub = ''] = process.argv.slice(2);
const F = await import(tree + '/src/domain/facts/houseInputAtHand.js');
const { resourceGapLines } = await import(tree + '/src/domain/display/validationOnPage.js');
for (const l of zlib.gunzipSync(fs.readFileSync(corpus)).toString().split('\n')) { if (!l.includes(`"seed":"${seed}"`)) continue; const { s } = JSON.parse(l);
  console.log('route', s.config.tradeRouteAccess, 'stress', s.config.stressTypes, 'tier', s.tier, 'depleted', s.config.nearbyResourcesDepleted, 'near', s.config.nearbyResources);
  console.log('imports', s.economicState.primaryImports);
  console.log('marks', [...F.housesShortOf(s)].filter(([h]) => h.toLowerCase().includes(sub)));
  console.log('gaps', s.resourceAnalysis.gaps.filter((g) => String(g.institution || '').toLowerCase().includes(sub)).map((g) => `${g.kind}: ${g.impact}`));
  console.log('gapLines', resourceGapLines(s).map((g) => g.impact).filter((x) => x.toLowerCase().includes(sub)));
}
