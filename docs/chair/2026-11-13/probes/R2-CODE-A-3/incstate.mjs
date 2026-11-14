import fs from 'node:fs'; import zlib from 'node:zlib';
const [,,F,INC]=process.argv; const FILES=["src/data/npcData.js","src/generators/narrativeText.js","src/data/narrativeData.js","src/data/stressInstitutionEffects.js","src/generators/narrativeGenerator.js","src/generators/economy/foodBalance.js","src/data/powerSiblings.js","src/generators/narrative/settlementOriginProse.js"];
const L=JSON.parse(fs.readFileSync(INC,'utf8')).lines.filter(l=>l.class==="NEW"&&l.at&&l.at.line&&l.writer&&FILES.includes(l.writer.file));
const recs={}; for(const l of zlib.gunzipSync(fs.readFileSync(F)).toString().split('\n')) if(l){const o=JSON.parse(l); recs[o.seed]=o.s;}
function walk(o,p,out){ if(typeof o==='string'){ out.push([p,o]); return; } if(Array.isArray(o)){ o.forEach((v,i)=>walk(v,p+'['+i+']',out)); return; } if(o&&typeof o==='object') for(const k of Object.keys(o)) walk(o[k],p+'.'+k,out); }
const clean=(s)=>String(s).replace(/^(Secret: |Wants |Origin:|Founded by:)/,'').replace(/^"|"$/g,'').replace(/…$/,'').trim();
for(const l of L){ const out=[]; walk(recs[l.town],'',out); const full=clean(l.sentence).slice(0,120), head=full.slice(0,40);
  const ex=out.find(([p,t])=>t.includes(full)), hd=ex?null:out.find(([p,t])=>t.includes(head));
  console.log([l.list+'-'+l.i, l.severity, ex?'exact':hd?'head':'gone', l.town, l.writer.file.split('/').pop()+'::'+l.writer.fn, (ex||hd||['',''])[0].replace(/\[\d+\]/g,'[]'), clean(l.sentence).slice(0,90)].join('\t')); }
