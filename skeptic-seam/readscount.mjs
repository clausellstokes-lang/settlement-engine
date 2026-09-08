import fs from 'node:fs';
const dir = process.argv[2];
const census = JSON.parse(fs.readFileSync(dir+'/docs/content/wiring-census.json','utf8'));
const m = new Map();
for (const r of census.rows) m.set(r.block+'::'+r.pool, r);
let mismatch=[], okPresent=0, okAbsent=0, presentButEmpty=[], absentButHas=[];
let censusNonEmpty=0, censusEmpty=0;
for (const r of census.rows) { (Array.isArray(r.reads)&&r.reads.length? censusNonEmpty++ : censusEmpty++); }
const files = fs.readdirSync(dir+'/src/data/dossierStateProse');
for (const f of files) {
  const mod = await import(dir+'/src/data/dossierStateProse/'+f);
  const obj = Object.values(mod)[0];
  for (const [bid, block] of Object.entries(obj)) {
    for (const [k, meta] of Object.entries(block.poolMeta||{})) {
      const row = m.get(bid+'::'+k);
      if (!row) { mismatch.push('NO CENSUS ROW '+bid+'::'+k); continue; }
      const n = Array.isArray(row.reads)? row.reads.length : 0;
      if ('readsCount' in meta) { if (meta.readsCount!==n) mismatch.push(bid+'::'+k+' rc='+meta.readsCount+' census='+n); else if(n===0) presentButEmpty.push(bid+'::'+k); else okPresent++; }
      else { if (n>0) absentButHas.push(bid+'::'+k+' census reads='+n); else okAbsent++; }
    }
  }
}
console.log('census rows with non-empty reads', censusNonEmpty, 'empty', censusEmpty);
console.log('OK present', okPresent, 'OK absent', okAbsent);
console.log('mismatch', mismatch.length, mismatch.slice(0,5).join(' | '));
console.log('present but census empty', presentButEmpty.length);
console.log('absent but census has reads', absentButHas.length, absentButHas.slice(0,5).join(' | '));
