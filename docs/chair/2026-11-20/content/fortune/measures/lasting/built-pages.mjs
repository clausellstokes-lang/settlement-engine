#!/usr/bin/env node
// FORTUNE U7b: the governance paragraph WHOLE, AS BUILT, on the owner's page and the shared page (`toPublicSafe`), for
// the chair's eye (PAGES-BUILT-LASTING.md). Law 2 by the fixture arm, `customContent: {}`, the configs of
// tests/domain/fortuneLastingSentence.test.js. The LASTING sentence is printed as built; nothing is planted.
// usage: node built-pages.mjs <tree> <out.md-body> <seed:size>...
import { writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
const [treeArg, out, ...places] = process.argv.slice(2);
const T = resolve(treeArg);
const imp = (p) => import(join(T, p));
const { generateSettlementPipeline } = await imp('src/generators/generateSettlementPipeline.js');
const { birthConfig, loadGenerationLawPayloads } = await imp('src/domain/density/densityCreateBoundary.js');
const { DEFAULT_CONFIG } = await imp('src/store/configSlice.js');
const { governanceAccountOf, governanceStressTypesOf } = await imp('src/domain/display/governanceAccount.js');
const { resolvePrimaryStress } = await imp('src/generators/stressPriority.js');
const { meritsOf } = await imp('src/domain/fortune/fortuneMerits.js');
const { toPublicSafe } = await imp('src/domain/display/publicSafe.js');
await loadGenerationLawPayloads();
const para = (rec) => governanceAccountOf(rec, { primaryStress: resolvePrimaryStress(governanceStressTypesOf(rec)) })?.text ?? '(no paragraph)';
const lines = [];
for (const place of places) {
  const [seed, size] = place.split(':');
  const rec = generateSettlementPipeline({ ...birthConfig({ ...DEFAULT_CONFIG, settType: size, _randomizePriorities: true }), _fortuneLawVersion: 2 }, null, { seed, customContent: {} });
  const leg = rec.powerStructure.publicLegitimacy;
  const m = meritsOf(rec);
  const cap = rec.powerStructure?.criminalCaptureState;
  const own = para(rec); const shared = para(toPublicSafe(rec));
  lines.push(`## ${rec.name} (\`${seed}\`, ${size}, age ${rec.history.age}, ${leg.label} ${leg.score}, merits +${leg.breakdown?.merits ?? 0} ${JSON.stringify(m)}${['corrupted', 'capture'].includes(cap) ? `, CAPTURED HALL: ${cap}` : ''})`);
  lines.push('', `OWNER: ${own}`, '', shared === own ? 'SHARED: the same string, byte for byte.' : `SHARED: ${shared}`, '');
}
writeFileSync(out, lines.join('\n'));
console.log(`wrote ${places.length} places`);
