import fs from 'node:fs'; import zlib from 'node:zlib';
const [corpus,T,diff]=process.argv.slice(2); const D=new Map(JSON.parse(fs.readFileSync(diff)).filter(d=>d.grade).map(d=>[d.seed,d.grade.added]));
const v=await import(T+'/src/domain/display/validationOnPage.js'); const t={};
for (const l of zlib.gunzipSync(fs.readFileSync(corpus)).toString().split('\n')) { if(!l) continue; const {seed,s}=JSON.parse(l); if(!D.has(seed)) continue;
  for (const a of D.get(seed)) { const [res]=a.split('='); const ex=s.economicState.primaryExports||[];
    const which=ex.filter(e=>{ const one={...s,economicState:{...s.economicState,primaryExports:[e]}}; return v.resourceWorkReading(one,res).sold; });
    const k=`${res} <= ${which.join(' + ')}`; t[k]=(t[k]||0)+1; } }
console.log(t);
