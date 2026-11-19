import fs from 'node:fs'; import zlib from 'node:zlib';
const R=process.env.TREE+'/src'; const { waterOf } = await import(R+'/domain/facts/water.js'); const { marketOf } = await import(R+'/domain/facts/market.js');
const rd=(f)=>zlib.gunzipSync(fs.readFileSync(f)).toString().split('\n').filter(Boolean).map(l=>JSON.parse(l));
const pats={sea:/the ones still at sea/, merchants:/and the merchants are watching it decide/};
const t={}; const add=(k,s)=>{(t[k] ||= []).push(s)};
function leaves(o,p,acc){ if(typeof o==='string'){acc.push([p,o]);return;} if(o&&typeof o==='object') for(const k of Object.keys(o)) leaves(o[k],p+'.'+k,acc); }
for (const f of process.argv.slice(2)) for (const {seed,s} of rd(f)) { const acc=[]; leaves(s,'',acc);
  for (const [k,re] of Object.entries(pats)) { const hits=acc.filter(([p,v])=>re.test(v)); if(!hits.length) continue;
    const paths=[...new Set(hits.map(([p])=>p.replace(/\.\d+/g,'[]')))].join(',');
    const extra = k==='sea' ? 'water:'+waterOf(s).kind : 'market:'+JSON.stringify(marketOf(s)).slice(0,60);
    add(`${k} ${extra} @ ${paths}`, seed); } }
for (const [k,v] of Object.entries(t).sort()) console.log(String(v.length).padStart(4),k,'|',v.slice(0,4).join(' '));
