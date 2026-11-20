// node mine.mjs <hits.json> [detail-regex] : my files' hits by writer fn and pattern (towns), or lines for a writer matching the regex
import fs from 'node:fs';
const j=JSON.parse(fs.readFileSync(process.argv[2],'utf8')); const h=Array.isArray(j)?j:(j.hits||[]);
const mine=/settlementOriginProse|narrativeGenerator\.js|src\/data\/npcData|src\/generators\/narrativeText|stressInstitutionEffects|economy\/foodBalance|src\/data\/narrativeData|powerSiblings|npcGenerator\.js|steps\/generateNarratives/;
const det=process.argv[3]?new RegExp(process.argv[3]):null; const by={};
for(const x of h){ const w=x.writer?(x.writer.file+' :: '+x.writer.fn):''; if(!mine.test(w)) continue;
  if(det){ if(det.test(w)) console.log(x.seed,'|',x.pattern+'/'+x.sub,'|',(x.why||'').slice(0,60),'|',String(x.sentence||x.line).slice(0,200)); continue; }
  const k=`${w} [${x.pattern}/${x.sub}]`; (by[k] ||= new Set()).add(x.seed); }
if(!det){ let t=0; for(const [k,v] of Object.entries(by).sort((a,b)=>b[1].size-a[1].size)){ t+=v.size; console.log(String(v.size).padStart(4),k);} console.log('total town-hits',t); }
