import { createRequire } from 'node:module'; const require = createRequire(import.meta.url);
const [W, corpus, loadPath] = process.argv.slice(2);
const load = require(loadPath);
const { magicPractitioners } = await import(W + '/src/domain/magicReliance.js');
let printed = 0, against = 0; const ex = [];
for (const { seed, s } of load(corpus)) {
  const d = (s.powerStructure?.factions || []).some((f) => /Magical practitioners/.test(f.desc || ''));
  if (!d) continue; printed++;
  if (magicPractitioners(s).length === 0) { against++; if (ex.length < 5) ex.push(seed); }
}
console.log('printed', printed, 'against', against, ex.join(' '));
