// RECORD-MEASURE-2 · the export-side c1 hit traced to its writer: resource tradeGoods (step 1, which resource),
// a chain output (step 2, which chain and which processor houses), a service export, or none of these.
// node c1source.mjs <tree> <corpus> <c1.json from c1members.mjs>
import { createRequire } from 'node:module'; import fs from 'node:fs'; const require = createRequire(import.meta.url);
const [TREE, CORPUS, J] = process.argv.slice(2);
const { RESOURCE_DATA } = await import(TREE + '/src/data/resourceData.js');
const C = Object.fromEntries(require('./load.cjs')(CORPUS).map((r) => [r.seed, r.s]));
const { detail } = JSON.parse(fs.readFileSync(J, 'utf8'));
const tally = {};
const strip = (g) => g.replace(/ \((transit|taxed by occupation|naval route only)\)$/, '');
for (const [seed, hits] of Object.entries(detail)) {
  const s = C[seed]; const near = s.resourceAnalysis.availableResources || [];
  for (const h of hits) {
    const [id, ...gs] = h.split('|');
    for (const g0 of gs) { const g = strip(g0);
      const src = [];
      for (const r of near) if ((RESOURCE_DATA[r]?.tradeGoods || []).includes(g)) src.push('res:' + r);
      for (const ch of s.economicState.activeChains || []) if ((ch.outputs || []).includes(g)) src.push(`chain:${ch.chainId}[${(ch.processingInstitutions || []).join('/')}]${ch.exportable ? '' : '(not exportable)'}${ch.entrepot ? '(entrepot)' : ''}`);
      if ((s.economicState.institutionalServices || []).some?.((x) => JSON.stringify(x).includes(g))) src.push('service');
      const k = `${id} · ${g} · ${src.join(' + ') || 'NONE'}`;
      (tally[k] ??= { n: 0, tiers: {} }).n++; tally[k].tiers[s.tier] = (tally[k].tiers[s.tier] || 0) + 1;
    }
  }
}
for (const [k, v] of Object.entries(tally).sort((a, b) => b[1].n - a[1].n)) console.log(v.n + '\t' + k + '\t' + JSON.stringify(v.tiers));
