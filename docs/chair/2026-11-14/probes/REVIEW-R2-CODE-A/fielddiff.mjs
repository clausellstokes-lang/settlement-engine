// fielddiff.mjs <base.ndjson.gz> <tip.ndjson.gz> <out.jsonl> [seedRegex]: every leaf compared at its own path, base
// against tip (REVIEW-R2-STAGES fielddiff.mjs's walk). Prints towns moved, families by towns, paths by towns; writes each
// differing string leaf {seed,path,base,tip} to out.jsonl. Also: NEW KEY / GONE KEY rows.
import fs from 'node:fs'; import zlib from 'node:zlib'; import readline from 'node:readline';
const [fa, fb, outf, sre] = process.argv.slice(2); const SRX = sre ? new RegExp(sre) : null;
async function* rd(f){ const rl=readline.createInterface({input:fs.createReadStream(f).pipe(zlib.createGunzip()),crlfDelay:Infinity}); for await (const l of rl) if(l) yield JSON.parse(l); }
const A=new Map(); for await (const o of rd(fa)) if(!SRX||SRX.test(o.seed)) A.set(o.seed,o.s);
const out=fs.createWriteStream(outf); const diffs=[]; let missing=0, nb=0;
function walk(a,b,p,seed){
  if(a===b) return; const ta=Array.isArray(a)?'arr':typeof a, tb=Array.isArray(b)?'arr':typeof b;
  if(ta!==tb||a===null||b===null||ta!=='object'&&ta!=='arr'){ if(!(Number.isNaN(a)&&Number.isNaN(b))){ diffs.push([seed,p]); if(typeof a==='string'||typeof b==='string') out.write(JSON.stringify({seed,path:p,base:a??null,tip:b??null})+'\n'); } return; }
  if(ta==='arr'){ const n=Math.max(a.length,b.length); for(let i=0;i<n;i++) walk(a[i],b[i],`${p}[${i}]`,seed); return; }
  const ks=new Set([...Object.keys(a),...Object.keys(b)]); for(const k of ks){ if(!(k in a)||!(k in b)){ diffs.push([seed,`${p}.${k}${!(k in a)?' (NEW KEY)':' (GONE KEY)'}`]); continue;} walk(a[k],b[k],`${p}.${k}`,seed); }
}
for await (const o of rd(fb)){ if(SRX&&!SRX.test(o.seed)) continue; nb++; const a=A.get(o.seed); if(!a){missing++;continue;} walk(a,o.s,'',o.seed); }
out.end();
const norm=(p)=>p.replace(/\[\d+\]/g,'[]'); const towns=new Set(diffs.map(d=>d[0])); const fam=new Map(), path=new Map();
for(const [seed,p] of diffs){ const f=p.split(/[.[]/)[1]||p; (fam.get(f)||fam.set(f,new Set()).get(f)).add(seed); const n=norm(p); (path.get(n)||path.set(n,new Set()).get(n)).add(seed); }
console.log(`births base ${A.size} tip ${nb} missing ${missing}; leaf diffs ${diffs.length}; towns moved ${towns.size}`);
for(const [f,s] of [...fam].sort((x,y)=>y[1].size-x[1].size)) console.log(`family ${f}: ${s.size} towns`);
for(const [p,s] of [...path].sort((x,y)=>y[1].size-x[1].size)) console.log(`  ${s.size}\t${p}\t e.g. ${[...s].slice(0,3).join(' ')}`);
const nk=diffs.filter(d=>/NEW KEY|GONE KEY/.test(d[1])); console.log('NEW/GONE KEY rows', nk.length, JSON.stringify([...new Set(nk.map(d=>norm(d[1])))].slice(0,20)));
