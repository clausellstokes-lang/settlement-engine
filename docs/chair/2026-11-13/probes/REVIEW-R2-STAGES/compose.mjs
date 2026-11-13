// REVIEW-R2-STAGES: compose each town's reading file from five renders. V1 is read whole (each line once, under the
// first view it appears in); then, per later version, the lines it prints that no earlier version printed, under their views.
// node compose.mjs <r20 dir> <seedsfile> <outdir>
import fs from 'node:fs';
const [R,sf,out]=process.argv.slice(2); fs.mkdirSync(out,{recursive:true});
const V=[['V1','a-tip'],['V2','b-tip'],['V3','c-tip'],['V4','ab-base'],['V5','c-base']];
const seeds=fs.readFileSync(sf,'utf8').trim().split('\n'); let tot=0; const stats=[];
for(const s of seeds){
  const seen=new Set(); const parts=[]; const per=[];
  for(const [v,dir] of V){
    const lines=fs.readFileSync(`${R}/${dir}/dumps/${s}.txt`,'utf8').split('\n'); let view=''; let lastPrinted=''; const acc=[]; let n=0;
    for(const l of lines){ if(!l) continue; if(l.startsWith('== ')){ view=l; continue; } if(l.startsWith('[STYLE]')) continue; if(seen.has(l)) continue; seen.add(l); if(view!==lastPrinted){ acc.push(view); lastPrinted=view; } acc.push(l); n++; }
    per.push(`${v}:${n}`);
    parts.push(v==='V1' ? `######## ${v} — THE PAGE, WHOLE (record: records/${v}/${s}.json)` : `######## ${v} — LINES THIS VERSION OF THE PAGE PRINTS THAT NO VERSION ABOVE PRINTED (record: records/${v}/${s}.json)`, ...acc, '');
    tot+=n;
  }
  fs.writeFileSync(`${out}/${s}.txt`, parts.join('\n')); stats.push(`${s} ${per.join(' ')}`);
}
console.log(stats.join('\n')); console.log('total lines', tot);
