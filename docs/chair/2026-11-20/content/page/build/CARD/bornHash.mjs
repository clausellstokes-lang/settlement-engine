// RUN (from the repository root), once per tree:
//   node docs/chair/2026-11-20/content/page/build/CARD/bornHash.mjs <tree> > <out>.txt
// PAGE-1 CARD's hash proof (BUILD.md, the common law: "RENDER ONLY. NO stored field of a born town moves. PROVE IT").
// Births, in the tree given, (1) the chair's 300: seed `hxd-${size}-${i}`, SIZES x 0..49, DEFAULT_CONFIG untouched
// (measures/A/measureA.mjs's recipe), and (2) the census's 720: censusPlan('r2') through configOf(row, DEFAULT_CONFIG,
// birthConfig) after loadGenerationLawPayloads() (NAMES-3's born.census.js on origin/lane/names-3-2026-11-20). Prints one
// line per document, `<corpus> <key> <sha256 of JSON.stringify(doc)>`, then each corpus's count and a digest of its list.
import { createHash } from 'node:crypto';

const L = process.argv[2];
const { generateSettlementPipeline } = await import(`${L}/src/generators/generateSettlementPipeline.js`);
const { birthConfig, loadGenerationLawPayloads } = await import(`${L}/src/domain/density/densityCreateBoundary.js`);
const { DEFAULT_CONFIG } = await import(`${L}/src/store/configSlice.js`);
const { SIZES, censusPlan, configOf } = await import(`${L}/tests/components/pageCensusWalk.shared.mjs`);

const sha = (/** @type {string} */ s) => createHash('sha256').update(s).digest('hex');
await loadGenerationLawPayloads();
/** @type {Record<string, string[]>} */ const lists = { hxd300: [], census720: [] };
for (const size of SIZES) for (let i = 0; i < 50; i++) {
  const seed = `hxd-${size}-${i}`;
  const doc = generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, settType: size }), null, { seed, customContent: {} });
  const line = `hxd300 ${seed} ${sha(JSON.stringify(doc))}`;
  lists.hxd300.push(line); console.log(line);
}
for (const row of censusPlan('r2')) {
  const doc = generateSettlementPipeline(configOf(row, DEFAULT_CONFIG, birthConfig), null, { seed: row.seed, customContent: {} });
  const line = `census720 ${row.seed} ${sha(JSON.stringify(doc))}`;
  lists.census720.push(line); console.log(line);
}
for (const [k, v] of Object.entries(lists)) console.log(`COUNT ${k} ${v.length} LIST-DIGEST ${sha(v.join('\n'))}`);
