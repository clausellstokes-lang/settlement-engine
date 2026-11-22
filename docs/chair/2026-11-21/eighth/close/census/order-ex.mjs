// Out-of-power-order stored factions: dark vs lit, the first places that are sorted dark and unsorted lit.
import { readFileSync } from 'node:fs';
const [D, L, P] = process.argv.slice(2); const plan = JSON.parse(readFileSync(P, 'utf8')).filter((r) => r.size === 'city' || r.size === 'metropolis');
const load = async (T) => { const g = await import(`${T}/src/generators/generateSettlementPipeline.js`); const b = await import(`${T}/src/domain/density/densityCreateBoundary.js`); await b.loadGenerationLawPayloads(); return (row) => g.generateSettlementPipeline(b.birthConfig(row.config), null, { seed: row.seed, customContent: {} }); };
const bd = await load(D), bl = await load(L);
const sorted = (f) => f.every((x, i) => i === 0 || (f[i - 1].power ?? 0) >= (x.power ?? 0));
const fmt = (f) => f.map((x) => `${x.faction}${x.isGoverning ? '*' : ''} ${x.power}`).join(' | ');
let shown = 0, darkUnsorted = 0, both = 0;
for (const row of plan) {
  const fd = bd(row).powerStructure?.factions || [], fl = bl(row).powerStructure?.factions || [];
  if (!sorted(fd)) darkUnsorted += 1; if (!sorted(fd) && !sorted(fl)) both += 1;
  if (shown < 3 && sorted(fd) && !sorted(fl)) { shown += 1; console.log(`${row.seed}\n  DARK ${fmt(fd)}\n  LIT  ${fmt(fl)}`); }
}
console.log('dark unsorted', darkUnsorted, 'unsorted in both', both, 'of', plan.length);
