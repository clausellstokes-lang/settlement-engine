// node ref525.mjs <tree> <out.json>: each of the golden's 525 reference configurations, born in <tree>, hashed whole and by top-level field
import { createHash } from 'node:crypto'; import { writeFileSync } from 'node:fs';
const [, , tree, out] = process.argv;
const { goldenCorpus, keyOf } = await import(`${tree}/tests/helpers/goldenMasterCorpus.js`);
const { generateSettlementPipeline } = await import(`${tree}/src/generators/generateSettlementPipeline.js`);
const h = (v) => createHash('sha256').update(JSON.stringify(v) ?? 'undefined').digest('hex').slice(0, 16);
const rows = {};
for (const config of goldenCorpus()) {
  const { _seed, ...cfg } = config;
  const s = generateSettlementPipeline(cfg, null, { seed: _seed, customContent: {} });
  rows[keyOf(config)] = { all: h(s), fields: Object.fromEntries(Object.keys(s).map((k) => [k, h(s[k])])) };
}
writeFileSync(out, JSON.stringify(rows));
console.log('configs', Object.keys(rows).length);
