import fs from 'node:fs';
const dir=process.argv[2];
const c=JSON.parse(fs.readFileSync(dir+'/docs/content/wiring-census.json','utf8'));
const mod=await import(dir+'/src/data/proseNorms.generated.js');
const N=Object.values(mod)[0];
console.log('leaf rows', Object.keys(N).length, 'departure=1', Object.values(N).filter(v=>v.departure===1).length);
console.log('census rate.departureReport', JSON.stringify(c.rate.departureReport));
const withRate=c.rows.filter(r=>r.rateBp!==null&&r.rateBp!==undefined);
console.log('census rows with rateBp', withRate.length);
console.log('census rows with departure!==null', c.rows.filter(r=>r.departure!==null&&r.departure!==undefined).length);
let mism=[]; let lineBp=c.rate.departureReport.lineBp;
for(const r of c.rows){
  const k=r.block+'::'+r.pool;
  const leaf=N[k];
  const hasRate = r.rateBp!==null && r.rateBp!==undefined;
  if(hasRate){
    if(!leaf) {mism.push('MISSING leaf row '+k); continue;}
    const want = r.departure;
    if(leaf.departure!==want) mism.push(k+' leaf='+leaf.departure+' census.departure='+want+' rateBp='+r.rateBp);
    // independent recomputation: departure 1 iff rateBp < lineBp ?
  } else if(leaf) mism.push('EXTRA leaf row '+k);
}
console.log('mismatches', mism.length, mism.slice(0,6).join(' | '));
// independent: does departure==1 correspond to rateBp below the line?
const one=c.rows.filter(r=>r.departure===1), zero=c.rows.filter(r=>r.departure===0);
console.log('departure=1 rateBp range', Math.min(...one.map(r=>r.rateBp)), Math.max(...one.map(r=>r.rateBp)));
console.log('departure=0 rateBp range', Math.min(...zero.map(r=>r.rateBp)), Math.max(...zero.map(r=>r.rateBp)));
console.log('lineBp', lineBp, '-> rule check: all departure=1 have rateBp<lineBp?', one.every(r=>r.rateBp<lineBp), '; all 0 have >=?', zero.every(r=>r.rateBp>=lineBp));
// sample ten
let i=0; for(const r of c.rows){ if(r.departure===null||r.departure===undefined) continue; if(i++>=10) break; console.log('SAMPLE', (r.block+'::'+r.pool).padEnd(52), 'rateBp',String(r.rateBp).padStart(5), 'census.dep',r.departure, 'leaf.dep', N[r.block+'::'+r.pool].departure); }
