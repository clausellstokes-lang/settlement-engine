// node analyze-e-groups.mjs <C|V> : pages moved by the cure, by group of views (Daily Life / crisis vantage / headlines / fortune), and pages moved if Daily Life were left on the name
import { readFileSync } from 'node:fs';
const C = process.argv[2]; const W = '/tmp/rename/work';
const rd = (f) => new Map(readFileSync(f, 'utf8').split('\n').filter(Boolean).map((l) => { const j = JSON.parse(l); return [j.seed, j]; }));
const B = rd(`${W}/E-base-${C}.jsonl`); const R = rd(`${W}/E-rekey-${C}.jsonl`);
const grp = (v) => /Daily Life|dailyLife/.test(v) ? 'dailyLife' : /headlines|NPC Quick Reference|Foundry\/Overview/.test(v) ? 'headlines (PDF/Foundry)' : /Defense|Tonight/.test(v) ? 'crisis vantage (Defense/Tonight)' : /Power/.test(v) ? 'fortune (Power)' : v;
const out = {}; let notDL = 0; let notDLtabs = 0;
for (const [s, b] of B) { const r = R.get(s); const g = new Set(); const tabs = new Set();
  for (const v of new Set([...Object.keys(b.views), ...Object.keys(r.views)])) { const x = (b.views[v] || []).join('\n'); const y = (r.views[v] || []).join('\n'); if (x !== y) { g.add(grp(v)); if (!/^(PDF|Foundry|Tonight|Session)\//.test(v)) tabs.add(grp(v)); } }
  for (const k of g) out[k] = (out[k] || 0) + 1;
  if ([...g].some((k) => k !== 'dailyLife')) notDL++; if ([...tabs].some((k) => k !== 'dailyLife')) notDLtabs++; }
console.log(C, JSON.stringify(out), `| pages moved by the cure if Daily Life kept the name: ${notDL} (on the owner's tabs: ${notDLtabs})`);
