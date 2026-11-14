// node pathdiff.mjs <base> <tip> <regex on normalised path> : print seed, path, base, tip for each differing leaf whose path matches
import fs from 'node:fs'; import zlib from 'node:zlib';
const read=(f)=>{ const m=new Map(); for(const l of zlib.gunzipSync(fs.readFileSync(f)).toString().split('\n')) if(l){ const o=JSON.parse(l); m.set(o.seed, o.s);} return m; };
const A=read(process.argv[2]), B=read(process.argv[3]); const re=new RegExp(process.argv[4]||'.');
function walk(a,b,p,seed){ if(a===b) return; if(typeof a!=='object'||typeof b!=='object'||a===null||b===null){ if(re.test(p.replace(/\[\d+\]/g,'[]'))) console.log(seed+'\t'+p+'\n  - '+String(JSON.stringify(a)).slice(0,330)+'\n  + '+String(JSON.stringify(b)).slice(0,330)); return; }
  const ks=new Set([...Object.keys(a),...Object.keys(b)]); for(const k of ks) walk(a[k],b[k],Array.isArray(a)?`${p}[${k}]`:`${p}.${k}`,seed); }
for(const [seed,a] of A){ const b=B.get(seed); if(b) walk(a,b,'',seed); }
