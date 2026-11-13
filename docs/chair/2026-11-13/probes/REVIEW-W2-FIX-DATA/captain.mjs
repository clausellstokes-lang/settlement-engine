// REVIEW-W2-FIX-DATA: towns whose record carries the guard-captain hook at base and not at the tip, with their defence houses.
import fs from 'node:fs'; import zlib from 'node:zlib';
const load=f=>new Map(zlib.gunzipSync(fs.readFileSync(f)).toString().trim().split('\n').map(l=>{const o=JSON.parse(l);return [o.seed,o.s];}));
const B=load(process.argv[2]), T=load(process.argv[3]); const re=/guard captain is on the payroll/;
const cls={}; for(const [sd,b] of B){ const t=T.get(sd); const inB=re.test(JSON.stringify(b.history)), inT=re.test(JSON.stringify(t.history));
  if(inB&&!inT){ const d=t.defenseProfile.institutions; const k=`watch=${(d.watch||[]).length>0} garrison=${(d.garrison||[]).length>0} militia=${(d.militia||[]).length>0}`; (cls[k]=cls[k]||[]).push(sd+'('+t.tier+')'); } }
for(const [k,v] of Object.entries(cls)) console.log(v.length,k,'|',v.join(' '));
