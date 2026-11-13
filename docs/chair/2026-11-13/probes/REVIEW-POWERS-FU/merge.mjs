// merge.mjs <readersDir> <baseDumps> <tipDumps> <out.json>: merge the readers' lists, check each sentence prints at the tip
// (in its tab) and mark whether it also prints at the base (same town, same tab; else anywhere in the base dump).
import fs from 'node:fs';
const [R,B,T,O]=process.argv.slice(2);
const views=(f)=>{ const o={}; let cur=null; for(const l of fs.readFileSync(f,'utf8').split('\n')){ const m=l.match(/^== (.+?) ==/); if(m){cur=m[1]; o[cur]=o[cur]||new Set(); continue;} if(cur&&l) o[cur].add(l);} return o; };
const norm=(s)=>String(s).replace(/\s+/g,' ').trim();
const all=[]; for(const f of fs.readdirSync(R).filter(f=>/^reader-\d+\.json$/.test(f)).sort((a,b)=>parseInt(a.slice(7))-parseInt(b.slice(7)))){
  const rows=JSON.parse(fs.readFileSync(`${R}/${f}`,'utf8')); for(const r of rows) all.push({reader:f.replace('.json',''),...r}); }
const cache={};
for(const r of all){
  const key=r.town; cache[key]=cache[key]||{b:views(`${B}/${key}.txt`),t:views(`${T}/${key}.txt`)};
  const {b,t}=cache[key]; const s=norm(r.sentence);
  const inT=(v)=>[...(v||[])].some(l=>l===s||l.includes(s));
  r.printsAtTip = inT(t[r.tab]) ? 'tab' : Object.values(t).some(inT) ? 'elsewhere' : 'NOT FOUND';
  r.printsAtBase = inT(b[r.tab]) ? 'tab' : Object.values(b).some(inT) ? 'elsewhere' : 'no';
  r.tipOnly = r.printsAtBase==='no';
}
fs.writeFileSync(O, JSON.stringify(all,null,1));
const by=(k)=>all.reduce((a,r)=>(a[r[k]]=(a[r[k]]||0)+1,a),{});
console.log('rows',all.length,'severity',JSON.stringify(by('severity')),'tipOnly',JSON.stringify(by('tipOnly')),'printsAtTip',JSON.stringify(by('printsAtTip')));
