// hits.mjs <lines.json> <births.gz> <out.json>: for every regex line, every town (and string path) where it matches a record string leaf.
import fs from 'node:fs'; import zlib from 'node:zlib'; import readline from 'node:readline';
const [lf, births, outf] = process.argv.slice(2);
const L = JSON.parse(fs.readFileSync(lf)).filter(l=>!l.src); const SZ=['thorp','hamlet','village','town','city','metropolis'];
const RX = L.map(l=>new RegExp(l.rx)); const H = Object.fromEntries(L.map(l=>[l.id,[]]));
const rl=readline.createInterface({input:fs.createReadStream(births).pipe(zlib.createGunzip()),crlfDelay:Infinity});
for await (const line of rl){ const {seed,s}=JSON.parse(line); const st=(Array.isArray(s.stress)?s.stress:s.stress?[s.stress]:[]).map(x=>x.type);
  const strs=[]; (function w(v,p){ if(typeof v==='string') strs.push([p,v]); else if(Array.isArray(v)) v.forEach((x,i)=>w(x,p+'['+i+']')); else if(v&&typeof v==='object') for(const k in v) w(v[k],p+'.'+k); })(s,'');
  L.forEach((l,i)=>{ const m=strs.filter(([p,v])=>RX[i].test(v)); if(m.length) H[l.id].push({seed,tier:s.tier,pop:s.population,st,route:s.config?.tradeRouteAccess,paths:[...new Set(m.map(([p])=>p.replace(/\[\d+\]/g,'[]')))],v:m[0][1].slice(0,600)}); }); }
const out={}; for(const l of L){ const h=H[l.id]; const sizes={}; const cr={}; const paths={}; for(const x of h){ sizes[x.tier]=(sizes[x.tier]||0)+1; for(const c of (x.st.length?x.st:['calm'])) cr[c]=(cr[c]||0)+1; for(const p of x.paths) paths[p]=(paths[p]||0)+1; }
  out[l.id]={n:h.length,sizes,cr,paths,hits:h}; console.log(`${l.id}\t${h.length}\t${JSON.stringify(sizes)}\t${JSON.stringify(paths)}`); }
fs.writeFileSync(outf, JSON.stringify(out));
