import { runHeadless, instrumentedRoot } from './instrument.mjs';
import { goldenCorpus, keyOf } from './lib.mjs';
let rows=0, moveQ4=0, instQ4=0; const byTier=new Map();
for (const row of goldenCorpus()) {
  const s = (await runHeadless(row, instrumentedRoot(row._seed ?? keyOf(row)).root)).settlement;
  rows++;
  const n = s.institutions.filter(i=>!i.catalogId && !(i.isCustom||i.source==='custom')).length;
  instQ4 += n; if (n>0) moveQ4++;
  const t=s.tier; const r=byTier.get(t)||{rows:0,move:0}; r.rows++; if(n>0)r.move++; byTier.set(t,r);
}
console.log(`rows ${rows}; Q4 cure moves ${moveQ4}/${rows} golden rows; stamps ${instQ4} institutions`);
for (const [t,r] of byTier) console.log(`   ${t.padEnd(11)} ${r.move}/${r.rows}`);
