// RUN (from the repository root): node docs/chair/2026-11-20/content/page/build/MAGIC/bornHash.mjs <tree> > <list file>
// PAGE-1 MAGIC, the hash proof (BUILD.md's common law): RENDER ONLY, no stored field of a born town moves. Births, in the
// tree named by argv[2], the chair's 300 (measureA's recipe: SIZES x 0..49, seed `hxd-<size>-<i>`, DEFAULT_CONFIG
// untouched) and the census's 720 (`censusPlan('r2')` through `configOf(row, DEFAULT_CONFIG, birthConfig)` after
// `loadGenerationLawPayloads()`, as NAMES-3's born.census.js does), and prints one line per document:
// `<corpus> <key> <sha256 of JSON.stringify(doc)>`. The base list and the tip list must be equal, line for line.
import { createHash } from 'node:crypto';

const L = process.argv[2];
const { generateSettlementPipeline } = await import(`${L}/src/generators/generateSettlementPipeline.js`);
const { birthConfig, loadGenerationLawPayloads } = await import(`${L}/src/domain/density/densityCreateBoundary.js`);
const { DEFAULT_CONFIG } = await import(`${L}/src/store/configSlice.js`);
const { SIZES, censusPlan, configOf } = await import(`${L}/tests/components/pageCensusWalk.shared.mjs`);

await loadGenerationLawPayloads();
const sha = (doc) => createHash('sha256').update(JSON.stringify(doc)).digest('hex');
for (const size of SIZES) for (let i = 0; i < 50; i++) {
  const seed = `hxd-${size}-${i}`;
  console.log(`hxd ${seed} ${sha(generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, settType: size }), null, { seed, customContent: {} }))}`);
}
for (const row of censusPlan('r2')) {
  console.log(`census ${row.seed} ${sha(generateSettlementPipeline(configOf(row, DEFAULT_CONFIG, birthConfig), null, { seed: row.seed, customContent: {} }))}`);
}
