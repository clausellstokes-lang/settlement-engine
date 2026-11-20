// RUN (from the repository root): node docs/chair/2026-11-20/content/page/build/OUTPUT/born.hash.mjs "$PWD" > <out file>
// PAGE-1 OUTPUT unit's hash proof (BUILD.md, the common law: RENDER ONLY). Births the chair's 300 towns
// (`hxd-<size>-<i>`, measures/A/measureA.mjs's recipe: DEFAULT_CONFIG untouched, birthConfig, no custom content)
// AND the census's 720 (`censusPlan('r2')` through `configOf(row, DEFAULT_CONFIG, birthConfig)` after
// `loadGenerationLawPayloads()`, as NAMES-3's born.census.js does), and prints one line a document:
// `<corpus> <key> <sha256 of JSON.stringify(doc)>`, then the two counts. Run it at base and at the tip; the two
// outputs must be byte-identical.
import { createHash } from 'node:crypto';

const L = process.argv[2];
const { generateSettlementPipeline } = await import(`${L}/src/generators/generateSettlementPipeline.js`);
const { birthConfig, loadGenerationLawPayloads } = await import(`${L}/src/domain/density/densityCreateBoundary.js`);
const { DEFAULT_CONFIG } = await import(`${L}/src/store/configSlice.js`);
const { SIZES, censusPlan, configOf } = await import(`${L}/tests/components/pageCensusWalk.shared.mjs`);

await loadGenerationLawPayloads();
const sha = (doc) => createHash('sha256').update(JSON.stringify(doc)).digest('hex');
let n300 = 0, n720 = 0;
for (const size of SIZES) for (let i = 0; i < 50; i++) {
  const seed = `hxd-${size}-${i}`;
  const doc = generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, settType: size }), null, { seed, customContent: {} });
  console.log(`hxd ${seed} ${sha(doc)}`); n300++;
}
for (const row of censusPlan('r2')) {
  const doc = generateSettlementPipeline(configOf(row, DEFAULT_CONFIG, birthConfig), null, { seed: row.seed, customContent: {} });
  console.log(`census ${row.seed} ${sha(doc)}`); n720++;
}
console.log(`COUNTS hxd ${n300} census ${n720}`);
