// U4 instrument 2: the page under each law. For every birth (N a size, both laws, the fixture arm), the stored prose and
// the printed desk prose, sentence by sentence, with the town's fortune and standing; the four FS7 combinations flagged.
//   node pages.mjs <tree> <out.json> [perSize=20] [prefix=u4]
import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
const [, , treeArg, outArg, nArg = '20', prefix = 'u4'] = process.argv;
const L = resolve(treeArg);
const { generateSettlementPipeline } = await import(`${L}/src/generators/generateSettlementPipeline.js`);
const { birthConfig, loadGenerationLawPayloads } = await import(`${L}/src/domain/density/densityCreateBoundary.js`);
const { DEFAULT_CONFIG } = await import(`${L}/src/store/configSlice.js`);
const { buildPrintProse } = await import(`${L}/src/domain/display/stateProse/printProse.js`);
const { governanceAccountOf } = await import(`${L}/src/domain/display/governanceAccount.js`);
const { proseStringsOf, sentencesOf } = await import(`${L}/tests/helpers/namesInSentences.mjs`);
const SIZES = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
const SMALL = ['thorp', 'hamlet', 'village']; const BIG = ['city', 'metropolis'];
const comboOf = (size, p, s) => [
  SMALL.includes(size) && ['Comfortable', 'Prosperous'].includes(p) ? 'F:rich-small' : null,
  BIG.includes(size) && ['Poor', 'Moderate'].includes(p) ? 'F:modest-big' : null,
  SMALL.includes(size) && s === 'Approved' ? 'S:approved-small' : null,
  BIG.includes(size) && ['Tolerated', 'Contested'].includes(s) ? 'S:doubted-big' : null,
].filter(Boolean);
await loadGenerationLawPayloads();
const out = [];
for (const law of [1, 2]) for (const size of SIZES) for (let i = 0; i < +nArg; i++) {
  const seed = `${prefix}-${size}-${i}`;
  const base = birthConfig({ ...DEFAULT_CONFIG, settType: size });
  const t = generateSettlementPipeline(law === 2 ? { ...base, _fortuneLawVersion: 2 } : base, null, { seed, customContent: {} });
  const prosperity = t.economicState?.prosperity; const standing = t.powerStructure?.publicLegitimacy?.label;
  const combos = comboOf(size, prosperity, standing);
  const print = buildPrintProse(t);
  const sentences = [];
  for (const { path, text } of proseStringsOf(t)) for (const s of sentencesOf(text)) sentences.push({ where: `record:${path}`, s });
  for (const [tab, mounts] of Object.entries(print)) for (const [mount, text] of Object.entries(mounts)) for (const s of sentencesOf(String(text))) sentences.push({ where: `print:${mount}`, s });
  const acct = governanceAccountOf(t);
  if (acct) for (const s of sentencesOf(acct.text)) sentences.push({ where: 'screen:power.governanceAccount', s });
  out.push({ law, size, seed, name: t.name, prosperity, standing, combos, sentences });
}
writeFileSync(outArg, JSON.stringify(out));
console.log(`births ${out.length}; sentences ${out.reduce((n, r) => n + r.sentences.length, 0)}; in a combination: ${out.filter((r) => r.combos.length).length}`);
