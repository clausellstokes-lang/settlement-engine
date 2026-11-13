// node magic.mjs <dumpsdir> <recordsdir|corpus.ndjson.gz>: every " · supplied by " line, its names checked against roster+npcs
import fs from 'node:fs'; import zlib from 'node:zlib';
const [D,R]=process.argv.slice(2); let recs={};
if(R.endsWith('.gz')){ for(const l of zlib.gunzipSync(fs.readFileSync(R)).toString().split('\n')){ if(!l.trim())continue; const o=JSON.parse(l); recs[o.seed]=o.s; } }
else for(const f of fs.readdirSync(R)) recs[f.replace('.json','')]=JSON.parse(fs.readFileSync(R+'/'+f,'utf8'));
let n=0,br=0,miss=0,dup=0,long=0; const ex=[];
for(const f of fs.readdirSync(D)){ const s=f.replace('.txt',''); const r=recs[s]; if(!r) continue;
  for(const l of new Set(fs.readFileSync(D+'/'+f,'utf8').split('\n').filter(x=>x.includes(' · supplied by ')))){ n++;
    const tail=l.split(' · supplied by ')[1]; if(/\(/.test(tail)) br++; if(l.length>280) long++;
    const names=tail.replace(/ and (\d+ practitioners?)$/,', $1').split(/, | and /);
    if(new Set(names).size<names.length) dup++;
    const inst=r.institutions.map(i=>i.name.replace(/\s*\([^)]*\)/g,'').trim().toLowerCase()); const npc=(r.npcs||[]).map(x=>x.name);
    const m=names.filter(x=>!/practitioner/.test(x)&&!inst.some(i=>i===x.toLowerCase()||i.includes(x.toLowerCase())||x.toLowerCase().includes(i))&&!npc.includes(x));
    if(m.length){ miss++; if(ex.length<12) ex.push(s+' :: '+JSON.stringify(m)+' :: '+l.slice(0,200)); } } }
console.log({lines:n,withBracket:br,houseTwice:dup,over280:long,nameNotInRosterOrCast:miss}); for(const e of ex) console.log(e);
