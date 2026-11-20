import { bornAll } from './born.mjs';
const { towns } = await bornAll(process.argv[2], 20);
for (const size of ['town','city','metropolis']) {
  const g = towns.filter(t => t.tier === size); let tot=0, probe=0; const by = {};
  for (const t of g) for (const n of t.npcs) for (const h of n.plotHooks||[]) { tot++; const m = /^PROBE hook (\w+)/.exec(h); if (m) { probe++; by[m[1]]=(by[m[1]]||0)+1; } }
  let tie=0, tp=0; for (const t of g) for (const r of t.relationships||[]) { tie++; if (/PROBE/.test(r.description)) tp++; }
  console.log(size, 'hooks', tot, 'probe', probe, JSON.stringify(by), '| ties', tie, 'probe', tp);
}
