// Proves the documented refreeze door REFUSES, using the guard's OWN PURE functions.
// No write: writeShrinkOnlyBaseline is never called.
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
const ROOT = '/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/58f0a8e2-2c4f-4073-8635-ecc7cf5010f6/scratchpad/laneKERNELMARK-tree';
const { scanJsxTree } = await import(join(ROOT, 'tests/helpers/jsxLiteralWalk.js'));
const { totalsOf, growthRows } = await import(join(ROOT, 'tests/helpers/shrinkOnlyBaseline.js'));
const cur = {};
for (const { rel, strings } of scanJsxTree(join(ROOT, 'src'), ROOT)) {
  let em = 0, bang = 0;
  for (const t of strings) { em += (t.match(/—/g) || []).length; bang += (t.match(/!/g) || []).length; }
  if (em > 0 || bang > 0) cur[rel] = { em, bang };
}
const committed = JSON.parse(readFileSync(join(ROOT, 'tests/copy/.voice-mechanics-jsx-baseline.json'), 'utf8'));
const before = totalsOf(committed), after = totalsOf(cur);
console.log('committed totals :', JSON.stringify(before));
console.log('a full refreeze  :', JSON.stringify(after));
const grew = growthRows(before, after);
console.log('growthRows       :', JSON.stringify(grew));
console.log(grew.length ? 'VERDICT: writeShrinkOnlyBaseline WOULD THROW -> the documented door cannot bank this win.'
                        : 'VERDICT: the door would write.');
