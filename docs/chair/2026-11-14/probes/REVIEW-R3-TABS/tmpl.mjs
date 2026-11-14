// tmpl.mjs <deskdiff.jsonl> <births.gz> [lensRx]: the tip sentences that are new in a town (NEW or CHANGED), templated
// ({S} for the town's name), grouped: count, lens, kind, template, and towns (tier/stress).
import fs from 'node:fs'; import zlib from 'node:zlib'; import readline from 'node:readline';
const rows=fs.readFileSync(process.argv[2],'utf8').trim().split('\n').map(JSON.parse); const RX=process.argv[4]?new RegExp(process.argv[4]):null;
const meta=new Map(); const rl=readline.createInterface({input:fs.createReadStream(process.argv[3]).pipe(zlib.createGunzip()),crlfDelay:Infinity});
for await (const l of rl){ const {seed,s}=JSON.parse(l); meta.set(seed,{name:s.name,tier:s.tier,st:(Array.isArray(s.stress)?s.stress:s.stress?[s.stress]:[]).map(x=>x.type).join('+')||'calm'}); }
const g=new Map();
for(const r of rows){ if(RX&&!RX.test(r.k)) continue; const m=meta.get(r.seed); const esc=m.name.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
  const T=(x)=>x==null?null:x.replace(new RegExp(esc,'g'),'{S}');
  const key=r.k+' | '+(r.tip==null?'(silent)':T(r.tip)); const e=g.get(key)||{n:0,kinds:{},towns:[],from:new Map()}; e.n++; e.kinds[r.kind]=(e.kinds[r.kind]||0)+1; e.towns.push(r.seed); const f=T(r.line)??'(silent)'; e.from.set(f,(e.from.get(f)||0)+1); g.set(key,e); }
for(const [k,e] of [...g].sort((a,b)=>a[0].localeCompare(b[0]))) console.log(`${e.n}\t${JSON.stringify(e.kinds)}\t${k}\n\t\tfrom: ${[...e.from].map(([f,n])=>n+'× '+f.slice(0,90)).slice(0,4).join(' ‖ ')}\n\t\te.g. ${e.towns.slice(0,4).join(' ')}`);
