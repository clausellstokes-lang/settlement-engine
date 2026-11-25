// node record-of.mjs <tree> <plan.json> <out.tsv> : per birth, sha256 of the born record whole, and with every
// `generatorVersion` key removed; plus the generatorVersion values seen. Births exactly as mirror/food-of.mjs does.
import { writeFileSync, readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
const [tree, planFile, out] = process.argv.slice(2);
const R = `${tree}/src/`;
const { generateSettlementPipeline } = await import(R + 'generators/generateSettlementPipeline.js');
const { birthConfig, loadGenerationLawPayloads } = await import(R + 'domain/density/densityCreateBoundary.js');
await loadGenerationLawPayloads();
const plan = JSON.parse(readFileSync(planFile, 'utf8'));
const h = (s) => createHash('sha256').update(s).digest('hex');
const lines = [];
for (const { seed, config } of plan) {
  const s = generateSettlementPipeline(birthConfig(config), null, { seed, customContent: {} });
  const gv = new Set();
  const whole = JSON.stringify(s);
  const stripped = JSON.stringify(s, (k, v) => { if (k === 'generatorVersion') { gv.add(JSON.stringify(v)); return undefined; } return v; });
  lines.push([seed, h(whole), h(stripped), [...gv].join('|')].join('\t'));
}
writeFileSync(out, lines.join('\n') + '\n');
console.log(`record-of: ${lines.length} births from ${tree}`);
