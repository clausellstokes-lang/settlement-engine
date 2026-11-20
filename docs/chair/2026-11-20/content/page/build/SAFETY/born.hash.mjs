#!/usr/bin/env node
/**
 * RUN (from the repository root, once at base and once at the tip):
 *   node docs/chair/2026-11-20/content/page/build/SAFETY/born.hash.mjs "$PWD" > docs/chair/2026-11-20/content/page/build/SAFETY/born.<base|tip>.txt
 * PAGE-1's SAFETY unit, the hash proof (BUILD.md, the common law: RENDER ONLY, no stored field of a born town moves).
 * THE TOWNS: (1) the chair's 300, measures/A/measureA.mjs's recipe: SIZES x i 0..49, seed `hxd-<size>-<i>`, DEFAULT_CONFIG
 * untouched, `generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, settType: size }), null, { seed, customContent: {} })`;
 * (2) the census's 720, as born.census.js on origin/lane/names-3-2026-11-20 does: `loadGenerationLawPayloads()`, then
 * `censusPlan('r2')` through `configOf(row, DEFAULT_CONFIG, birthConfig)`, seed `row.seed`.
 * Each document: `JSON.stringify`, sha256. One line per town: `<corpus> <key> <sha256>`, then the counts and a digest of
 * all lines (the two runs' lists are equal exactly when the digests are).
 */
import { createHash } from 'node:crypto';

const L = process.argv[2];
const { generateSettlementPipeline } = await import(`${L}/src/generators/generateSettlementPipeline.js`);
const { birthConfig, loadGenerationLawPayloads } = await import(`${L}/src/domain/density/densityCreateBoundary.js`);
const { DEFAULT_CONFIG } = await import(`${L}/src/store/configSlice.js`);
const { SIZES, censusPlan, configOf } = await import(`${L}/tests/components/pageCensusWalk.shared.mjs`);

await loadGenerationLawPayloads();
const sha = (s) => createHash('sha256').update(s).digest('hex');
const lines = [];
for (const size of SIZES) for (let i = 0; i < 50; i++) {
  const seed = `hxd-${size}-${i}`;
  const doc = generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, settType: size }), null, { seed, customContent: {} });
  lines.push(`town300 ${seed} ${sha(JSON.stringify(doc))}`);
}
for (const row of censusPlan('r2')) {
  const doc = generateSettlementPipeline(configOf(row, DEFAULT_CONFIG, birthConfig), null, { seed: row.seed, customContent: {} });
  lines.push(`census720 ${row.seed} ${sha(JSON.stringify(doc))}`);
}
for (const l of lines) console.log(l);
const n300 = lines.filter((l) => l.startsWith('town300 ')).length;
const n720 = lines.filter((l) => l.startsWith('census720 ')).length;
console.log(`COUNTS town300 ${n300} census720 ${n720}`);
console.log(`DIGEST ${sha(lines.join('\n'))}`);
