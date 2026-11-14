// b14.mjs: TREE OUT SEEDS(file) SHARD NSHARD -> ndjson.gz, one row per birth: the whole record minus heavy traces
import fs from 'node:fs'; import zlib from 'node:zlib'; import path from 'node:path';
const TREE=process.env.TREE; const imp=(p)=>import(path.join(TREE,p));
const C2='/home/user/probes/census-2-2026-11-13/docs/chair/2026-11-13/probes/CENSUS-2';
const { generateSettlementPipeline } = await imp('src/generators/generateSettlementPipeline.js');
const { birthConfig, loadGenerationLawPayloads } = await imp('src/domain/density/densityCreateBoundary.js');
const { DEFAULT_CONFIG } = await imp('src/store/configSlice.js');
await loadGenerationLawPayloads();
const { makeCfgFor } = await import(C2+'/seedcfg.mjs'); const cfgFor=makeCfgFor(birthConfig, DEFAULT_CONFIG);
let seeds=fs.readFileSync(process.env.SEEDS||C2+'/seeds.txt','utf8').trim().split('\n').filter(Boolean);
seeds=seeds.filter((_,i)=>i%Number(process.env.NSHARD||1)===Number(process.env.SHARD||0));
const out=zlib.createGzip(); const done=new Promise(r=>out.pipe(fs.createWriteStream(process.env.OUT)).on('finish',r));
let n=0,err=0;
for(const seed of seeds){ try{
  const s=generateSettlementPipeline(cfgFor(seed),null,{seed,customContent:{}});
  const { simulationTrace, generationCoherenceReceipt, structuralViolations, structuralSuggestions, ...rest } = s;
  out.write(JSON.stringify({key:seed, s:rest})+'\n'); n++;
}catch(e){err++; console.error(seed,e.message);} }
out.end(); await done; console.log('births',n,'errors',err); process.exit(err?1:0);
