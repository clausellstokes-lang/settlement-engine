import { readFileSync } from 'node:fs';
const d = JSON.parse(readFileSync('./rows.json','utf8'));
const rows = d.rows;
const pick = (pred, n, seedStep) => { const f = rows.filter(pred); const out=[]; for(let i=0;i<f.length && out.length<n;i+=Math.max(1,Math.floor(f.length/n))) out.push(f[i]); return out; };
for (const rung of ['literal','template','table']) {
  console.log('=== RUNG', rung, '===');
  for (const r of pick(x=>x.rung===rung, 4)) {
    console.log(`${r.block} :: ${r.pool}\n   fn=${r.keyFunction}\n   pred=${JSON.stringify(r.predicate)}\n   fieldsRead=${JSON.stringify(r.fieldsRead).slice(0,200)}`);
  }
}
