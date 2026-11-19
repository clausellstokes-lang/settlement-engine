// UPKEEP-9: the 1,490 (UPKEEP-8 seeds.all.txt, its cfgFor) born at TREE, whole records, gzipped ndjson.
// usage: TREE=<tree> node birthgz.mjs <seeds> <out.ndjson.gz>
import fs from 'node:fs'; import zlib from 'node:zlib';
const T=process.env.TREE;
const { generateSettlementPipeline } = await import(T+'/src/generators/generateSettlementPipeline.js');
const { cfgFor } = await import(T+'/docs/chair/2026-11-13/probes/UPKEEP-8/births.mjs');
const gz=zlib.createGzip(); gz.pipe(fs.createWriteStream(process.argv[3]));
let n=0;
for(const seed of fs.readFileSync(process.argv[2],'utf8').trim().split('\n')){
  const s=generateSettlementPipeline(cfgFor(seed),null,{seed,customContent:{}});
  gz.write(JSON.stringify({seed,s})+'\n'); n++;
}
gz.end(); console.log('born',n);
