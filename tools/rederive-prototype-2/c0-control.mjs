/**
 * C0 — THE INERTNESS CONTROL for RECON-2's own loader.
 *
 * With `enrich-loader2.mjs` installed and NO held bag and NO override:
 *   (a) the committed golden row's hash is the manifest's own,
 *   (b) a 25-row stride of the 525-row golden corpus is byte-identical to the manifest.
 *
 * usage: node --import ./hook3.mjs c0-control.mjs
 */
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { generateSettlementPipeline, TREE } from './instrument.mjs';
import { goldenCorpus, keyOf } from './lib.mjs';

const manifest = JSON.parse(readFileSync(`${TREE}/tests/fixtures/generator-golden-master.json`, 'utf-8'));
const hashOf = (row) => {
  const { _seed, ...cfg } = row;
  const s = generateSettlementPipeline(cfg, null, { seed: _seed, customContent: {} });
  return createHash('sha256').update(JSON.stringify(s)).digest('hex');
};

console.log('=== C0.a — the committed golden CONTROL row, with RECON-2\'s loader installed ===');
const GR = { settType: 'town', culture: 'germanic', terrainOverride: 'plains', tradeRouteAccess: 'road', monsterThreat: 'civilized', _seed: 'golden-master-v3' };
const k = keyOf(GR);
const measured = hashOf(GR);
console.log(`row      = ${k}`);
console.log(`manifest = ${manifest[k]}`);
console.log(`measured = ${measured}`);
console.log(`EQUAL    = ${manifest[k] === measured}`);

console.log('\n=== C0.b — a stride of the 525-row golden corpus (every 21st row) ===');
const ALL = goldenCorpus();
const stride = ALL.filter((_, i) => i % 21 === 0);
let ok = 0; const bad = [];
const t0 = Date.now();
for (const row of stride) {
  const key = keyOf(row);
  const got = hashOf(row);
  if (manifest[key] === got) ok += 1; else bad.push(key);
}
console.log(`rows=${stride.length}  identical=${ok}/${stride.length}  wall=${Date.now() - t0} ms`);
if (bad.length) console.log(`DIVERGENT: ${bad.join(' , ')}`);
console.log(`INERT = ${ok === stride.length && manifest[k] === measured}`);
