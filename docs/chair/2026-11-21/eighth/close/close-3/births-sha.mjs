// CLOSE-3: per-birth sha over N births a size (seeds <prefix>-<size>-<i>), born as the product births (birthConfig), and the sha of all.
import { createHash } from 'node:crypto';
import { writeFileSync } from 'node:fs';
const R = (process.env.TREE) + '/src/';
const { generateSettlementPipeline } = await import(R + 'generators/generateSettlementPipeline.js');
const { birthConfig, loadGenerationLawPayloads } = await import(R + 'domain/density/densityCreateBoundary.js');
await loadGenerationLawPayloads();
const N = Number(process.argv[2] || 150); const prefix = process.argv[3] || 'dp'; const out = process.argv[4];
const sizes = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
const all = createHash('sha256'); const lines = []; let laws = null;
for (const settType of sizes) for (let i = 0; i < N; i++) {
  const seed = `${prefix}-${settType}-${i}`;
  const s = generateSettlementPipeline(birthConfig({ settType }), null, { seed, customContent: {} });
  if (laws === null) laws = JSON.stringify(Object.fromEntries(Object.entries(s.config || {}).filter(([k]) => /LawVersion/.test(k))));
  const j = JSON.stringify(s); const h = createHash('sha256').update(j).digest('hex');
  all.update(h); lines.push(`${seed}\t${h}`);
}
writeFileSync(out, lines.join('\n') + '\n');
console.log(`laws ${laws}; births ${lines.length}; sha ${all.digest('hex')}`);
