/**
 * P2(d) — WITH NO HELD BAG EVERY OVERRIDE MUST BE INERT.
 * The whole seam is installed (`rederive(row, {})`), so every `__FN_OVERRIDE__` guard and
 * every restore placement is exercised with an EMPTY held bag, and the result is compared
 * with the committed golden hash of the control row and of a stride of the corpus.
 *
 * usage: node --import ./hook3.mjs p2-inert.mjs
 */
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { TREE } from './instrument.mjs';
import { goldenCorpus, keyOf, h } from './lib.mjs';
import { rederive, generate } from './seam.mjs';

const manifest = JSON.parse(readFileSync(`${TREE}/tests/fixtures/generator-golden-master.json`, 'utf-8'));
const sha = (s) => createHash('sha256').update(JSON.stringify(s)).digest('hex');

console.log('=== P2(d) — the seam installed with NO held bag is INERT ===');
const GR = { settType: 'town', culture: 'germanic', terrainOverride: 'plains', tradeRouteAccess: 'road', monsterThreat: 'civilized', _seed: 'golden-master-v3' };
const viaSeam = rederive(GR, {});
console.log(`control row = ${keyOf(GR)}`);
console.log(`manifest    = ${manifest[keyOf(GR)]}`);
console.log(`seam, bag={} = ${sha(viaSeam)}`);
console.log(`EQUAL       = ${manifest[keyOf(GR)] === sha(viaSeam)}`);

const stride = goldenCorpus().filter((_, i) => i % 21 === 0);
let ok = 0; const bad = [];
for (const row of stride) {
  const s = rederive(row, {});
  if (sha(s) === manifest[keyOf(row)]) ok += 1; else bad.push(keyOf(row));
}
console.log(`\ngolden stride (every 21st of 525): identical=${ok}/${stride.length}`);
if (bad.length) console.log(`DIVERGENT: ${bad.slice(0, 10).join(' , ')}`);

// And the same thing against a plain unpinned run, over the structured sample, so the
// inertness is proved off the golden corpus's own seed too.
const { sample63 } = await import('./lib.mjs');
let ok2 = 0; const bad2 = [];
for (const row of sample63()) {
  const plain = generate(row);
  const seam = rederive(row, {});
  if (h(plain) === h(seam)) ok2 += 1; else bad2.push(keyOf(row));
}
console.log(`63-row sample, seam(bag={}) vs plain run: identical=${ok2}/63`);
if (bad2.length) console.log(`DIVERGENT: ${bad2.slice(0, 6).join(' , ')}`);
console.log(`\nINERT = ${ok === stride.length && ok2 === 63 && manifest[keyOf(GR)] === sha(viaSeam)}`);
