// are the criminalInstitutions / incomeSources hits the names of houses the town holds?
import path from 'node:path'; import fs from 'node:fs';
import { DIALS } from './corpus.mjs';
const tree = path.resolve(process.argv[2]); const imp = (p) => import(path.join(tree, p));
const { generateSettlementPipeline } = await imp('src/generators/generateSettlementPipeline.js');
const { birthConfig, loadGenerationLawPayloads } = await imp('src/domain/density/densityCreateBoundary.js');
await loadGenerationLawPayloads();
const rows = fs.readFileSync(process.argv[3], 'utf8').trim().split('\n').map((l) => JSON.parse(l));
let house = 0, none = 0; const ex = [];
for (const r of rows) {
  const hits = r.hits.filter((h) => /criminalInstitutions|incomeSources/.test(h[0])); if (!hits.length) continue;
  const m = r.key.match(/^(?:rvf|l2)-(.+)-(thorp|hamlet|village|town|city|metropolis)-\d+$/);
  const cfg = m ? { ...DIALS, settType: m[2], selectedStresses: [m[1]], selectedStressesRandom: false } : { ...DIALS, settType: r.key.split('-')[1] };
  const s = generateSettlementPipeline(birthConfig(cfg), null, { seed: r.key, customContent: {} });
  const names = (s.institutions || []).map((i) => String(i.name).toLowerCase());
  for (const h of hits) { const base = h[2].replace(/ (Revenue|Chapter|\(.*\))$/, '').toLowerCase(); if (names.some((n) => n.startsWith(base.split(' (')[0]) || n.includes(base))) house++; else { none++; if (ex.length < 5) ex.push(`${r.key}: ${h[2]} | ${names.filter((n) => /thie|crim/.test(n)).join(',')}`); } }
}
console.log('hits naming a house the town holds', house, 'not', none); for (const e of ex) console.log(e);
