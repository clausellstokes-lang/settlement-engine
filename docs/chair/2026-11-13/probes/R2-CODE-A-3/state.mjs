// node state.mjs <corpus> <cut.json> [n,n,...] -> each lane-ra line: exact|head|gone in its town; with a path where its head printed
import fs from 'node:fs'; import zlib from 'node:zlib'; import readline from 'node:readline';
const [,,F,CUT,ONLY]=process.argv; const L=JSON.parse(fs.readFileSync(CUT,'utf8')).lines.filter(l=>l.package==='lane ra'&&(!ONLY||ONLY.split(',').includes(String(l.n))));
const clean=(s)=>s.replace(/^(Secret: |Wants |Origin:)/,'').replace(/^"|"$/g,'').replace(/…$/,'').trim();
const towns=new Set(L.map(l=>l.town)); const recs={};
const rl=readline.createInterface({input:fs.createReadStream(F).pipe(zlib.createGunzip()),crlfDelay:Infinity});
for await (const line of rl){ if(!line) continue; const o=JSON.parse(line); if(towns.has(o.seed)) recs[o.seed]=o.s; }
function walk(o,p,out){ if(typeof o==='string'){ out.push([p,o]); return; } if(Array.isArray(o)){ o.forEach((v,i)=>walk(v,p+'['+i+']',out)); return; } if(o&&typeof o==='object') for(const k of Object.keys(o)) walk(o[k],p+'.'+k,out); }
const strs={}; for(const t of towns){ const out=[]; walk(recs[t],'',out); strs[t]=out; }
const res={exact:0,head:0,gone:0};
for(const l of L){ const full=clean(l.sentence).slice(0,150); const head=full.slice(0,45); const S=strs[l.town]||[];
  const ex=S.find(([p,t])=>t.includes(full)); const hd=ex?null:S.find(([p,t])=>t.includes(head));
  const st=ex?'exact':hd?'head':'gone'; res[st]++;
  console.log(`#${l.n}\t${l.severity}\t${st}\t${l.town}\t${(ex||hd||[''])[0].replace(/\[\d+\]/g,'[]')}\t${hd?hd[1].slice(0,160):''}`); }
console.error(JSON.stringify(res));
