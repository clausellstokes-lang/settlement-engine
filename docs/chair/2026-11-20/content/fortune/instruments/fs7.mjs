// FORTUNE-1 instrument (FS7, a SCREEN, not a verdict): stored prose sentences that speak of wealth or poverty, of a
// ruler's favour or disfavour, in towns whose fortune or standing label says otherwise. Each hit is a candidate to be
// READ; a sentence about "the poor" of a rich city is not a contradiction.
//   node fs7.mjs <tree> <out.json> [perSize=20] [prefix=hxd]
import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const [, , treeArg, outArg, nArg = '20', prefix = 'hxd'] = process.argv;
const L = resolve(treeArg);
const { generateSettlementPipeline } = await import(`${L}/src/generators/generateSettlementPipeline.js`);
const { birthConfig, loadGenerationLawPayloads } = await import(`${L}/src/domain/density/densityCreateBoundary.js`);
const { DEFAULT_CONFIG } = await import(`${L}/src/store/configSlice.js`);
const { proseStringsOf, sentencesOf } = await import(`${L}/tests/helpers/namesInSentences.mjs`);
const SIZES = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
const RICH = /\b(wealth|wealthy|riches|affluen\w*|opulen\w*|prosper(?:s|ing|ous|ity)|thriv(?:e|es|ing)|coffers fill|rich (?:town|city|village|place|settlement|merchants?))\b/i;
const POOR = /\b(poverty|impoverish\w*|destitut\w*|penniless|threadbare|struggl(?:e|es|ing) to (?:feed|pay|make|get)|(?:a|this|the) poor (?:town|city|village|place|settlement|hamlet|thorp))\b/i;
const LIKED = /\b(beloved|adored|well[- ]liked|widely respected|popular (?:with|among)|enjoys? (?:wide|broad|real) support|endorsed)\b/i;
const DISLIKED = /\b(resented|despised|hated|unpopular|illegitimate|barely tolerated|no one trusts|lost the people)\b/i;
const RANK = { Subsistence: 0, Struggling: 0, Poor: 1, Moderate: 2, Comfortable: 3, Prosperous: 4, Wealthy: 5 };
const LRANK = { 'Legitimacy Crisis': 0, Contested: 1, Tolerated: 2, Approved: 3, Endorsed: 4 };
await loadGenerationLawPayloads();
const out = [];
for (const size of SIZES) for (let i = 0; i < +nArg; i++) {
  const seed = `${prefix}-${size}-${i}`;
  const t = generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, settType: size }), null, { seed, customContent: {} });
  const fortune = t.economicState?.prosperity; const standing = t.powerStructure?.publicLegitimacy?.label;
  const fr = RANK[fortune] ?? 2; const sr = LRANK[standing] ?? 2;
  for (const { path, text } of proseStringsOf(t)) for (const s of sentencesOf(text)) {
    const kinds = [];
    if (RICH.test(s) && fr <= 1) kinds.push('rich-word in a poor town');
    if (POOR.test(s) && fr >= 3) kinds.push('poor-word in a comfortable town');
    if (LIKED.test(s) && sr <= 1) kinds.push('favour-word under a contested ruler');
    if (DISLIKED.test(s) && sr >= 3) kinds.push('disfavour-word under an approved ruler');
    if (kinds.length) out.push({ seed, size, name: t.name, fortune, standing, calm: !t.stress, path, kinds, sentence: s });
  }
}
writeFileSync(outArg, JSON.stringify(out, null, 1));
const by = {}; for (const h of out) for (const k of h.kinds) by[k] = (by[k] || 0) + 1;
console.log(`${SIZES.length * +nArg} towns; candidates ${out.length}:`, JSON.stringify(by));
