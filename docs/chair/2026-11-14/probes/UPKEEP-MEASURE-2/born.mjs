// UPKEEP-MEASURE-2: the reader's births (render5.mjs's cfgFor, copied verbatim), records only, plus a summary row per
// birth in corpus2.mjs's shape so compare.py reads it. Births are born through the WHOLE pipeline at the tree, so the
// powers and every later reader see that tree's defence.
//   TREE=<tree> node born.mjs <seedfile> <outdir> [shard] [shards]
//   -> <outdir>/rec/<seed>.json.gz (the record) and <outdir>/c2-<shard>.ndjson (summary rows: {key, base:{...}})
import fs from 'node:fs'; import zlib from 'node:zlib'; import crypto from 'node:crypto';
const T = process.env.TREE;
const { generateSettlementPipeline } = await import(T + '/src/generators/generateSettlementPipeline.js');
const { birthConfig, loadGenerationLawPayloads } = await import(T + '/src/domain/density/densityCreateBoundary.js');
const { DEFAULT_CONFIG } = await import(T + '/src/store/configSlice.js');
const { scoreBand } = await import(T + '/src/domain/display/defenseScoreBands.js');
const { deriveMagicReliance } = await import(T + '/src/domain/magicReliance.js');
const { collectThreatSources } = await import(T + '/src/domain/threatProfile.js');
await loadGenerationLawPayloads();
const dials = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
function cfgFor(seed) {
  let m = seed.match(/^r2r-(\w+)-(\d+)$/); if (m) return birthConfig({ ...DEFAULT_CONFIG, ...dials, settType: m[1] });
  m = seed.match(/^r2s-(\w+)-(thorp|hamlet|village|town|city|metropolis)-(\d+)$/); if (m) return birthConfig({ ...DEFAULT_CONFIG, ...dials, selectedStresses: [m[1]], selectedStressesRandom: false, settType: m[2] });
  m = seed.match(/^rv5-([a-z_+]+)-(thorp|hamlet|village|town|city|metropolis)-(\d+)$/); if (m) return birthConfig({ ...DEFAULT_CONFIG, ...dials, settType: m[2], selectedStresses: m[1] === 'calm' ? [] : m[1].split('+'), selectedStressesRandom: false });
  throw new Error(seed);
}
const [seedfile, outdir, shardArg = '0', shardsArg = '1'] = process.argv.slice(2);
const shard = Number(shardArg), shards = Number(shardsArg);
fs.mkdirSync(`${outdir}/rec`, { recursive: true });
const SK = ['military', 'monster', 'internal', 'economic', 'magical', 'disaster'];
const hash = (x) => crypto.createHash('sha1').update(JSON.stringify(x ?? null)).digest('hex').slice(0, 12);
const o = fs.createWriteStream(`${outdir}/c2-${shard}.ndjson`);
const seeds = fs.readFileSync(seedfile, 'utf8').trim().split('\n');
for (let r = shard; r < seeds.length; r += shards) {
  const seed = seeds[r];
  const s = generateSettlementPipeline(cfgFor(seed), null, { seed, customContent: {} });
  fs.writeFileSync(`${outdir}/rec/${seed}.json.gz`, zlib.gzipSync(JSON.stringify(s)));
  const d = s.defenseProfile || {}; const ps = s.powerStructure || {};
  o.write(JSON.stringify({ key: seed, tier: s.tier, base: {
    score: d.readiness?.score, band: d.readiness?.label,
    scores: SK.map((x) => d.scores?.[x] ?? null), sbands: SK.map((x) => (typeof d.scores?.[x] === 'number' ? scoreBand(d.scores[x]) : null)),
    reliance: deriveMagicReliance(s).reading,
    threats: collectThreatSources(s).filter((t) => t.originSurface === 'defenseProfile').map((t) => t.raw?.name).sort(),
    hPow: hash(ps), powers: (ps.factions || []).map((x) => x.faction).sort(), legit: ps.publicLegitimacy?.score ?? null, legitLabel: ps.publicLegitimacy?.label ?? null,
    hAll: hash(s), pop: s.population,
  } }) + '\n');
}
o.end();
console.error(`born ${shard}/${shards} done`);
