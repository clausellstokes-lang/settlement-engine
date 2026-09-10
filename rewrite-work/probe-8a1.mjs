import { drawVariant } from '../laneREWRITE/src/domain/display/stateProse/stateProseKernel.js';
import { DOSSIER_STATE_PROSE_ECONOMY } from '../laneREWRITE/src/data/dossierStateProse/economy.generated.js';
import { DOSSIER_STATE_PROSE_POWER } from '../laneREWRITE/src/data/dossierStateProse/power.generated.js';
import { DOSSIER_STATE_PROSE_DEFENSE } from '../laneREWRITE/src/data/dossierStateProse/defense.generated.js';
import { DOSSIER_STATE_PROSE_WAR_FAITH } from '../laneREWRITE/src/data/dossierStateProse/warFaith.generated.js';
import { DOSSIER_STATE_PROSE_STRESSORS } from '../laneREWRITE/src/data/dossierStateProse/stressors.generated.js';
import { DOSSIER_STATE_PROSE_GENERAL } from '../laneREWRITE/src/data/dossierStateProse/general.generated.js';

function referenceHash(key) {
  let h = 0x811c9dc5;
  for (let i = 0; i < key.length; i++) { h ^= key.charCodeAt(i); h = Math.imul(h, 0x01000193) >>> 0; }
  let x = h >>> 0;
  x ^= x >>> 16; x = Math.imul(x, 0x85ebca6b); x ^= x >>> 13; x = Math.imul(x, 0xc2b2ae35); x ^= x >>> 16;
  return x >>> 0;
}
const modulusDraw = (e, b, p, s) => e[referenceHash(`${s}::${b}::${p}`) % e.length];

const POOLS = [['economy', DOSSIER_STATE_PROSE_ECONOMY], ['power', DOSSIER_STATE_PROSE_POWER],
  ['defense', DOSSIER_STATE_PROSE_DEFENSE], ['warFaith', DOSSIER_STATE_PROSE_WAR_FAITH],
  ['stressors', DOSSIER_STATE_PROSE_STRESSORS], ['general', DOSSIER_STATE_PROSE_GENERAL]]
  .flatMap(([desk, c]) => Object.entries(c).flatMap(([blockId, b]) =>
    Object.entries(b.pools).map(([poolKey, pool]) => ({ desk, blockId, poolKey, pool }))));

console.log(`pools ${POOLS.length} · variants ${POOLS.reduce((s, r) => s + r.pool.length, 0)}`);
const byLen = new Map();
for (const r of POOLS) byLen.set(r.pool.length, (byLen.get(r.pool.length) || 0) + 1);
console.log('pool lengths: ' + [...byLen].sort((a,b)=>a[0]-b[0]).map(([l,n])=>`${l}:${n}`).join(' '));

const N = 10000;
const SEEDS = Array.from({ length: N }, (_, i) => `uniformity-seed-${i}`);
const three = POOLS.filter((r) => r.pool.length === 3);
const SE = Math.sqrt((1/3) * (2/3) / N) * 100;
let maxZ = 0, maxRow = '';
const agg = new Map([[1,0],[2,0],[3,0]]);
for (const { desk, blockId, poolKey, pool } of three) {
  const tally = new Map(pool.map((v) => [v.vid, 0]));
  for (const seed of SEEDS) { const d = drawVariant(pool, blockId, poolKey, seed); tally.set(d.vid, tally.get(d.vid) + 1); }
  for (const [vid, count] of tally) {
    agg.set(vid, agg.get(vid) + count);
    const share = count / N * 100;
    const z = Math.abs(share - 100/3) / SE;
    if (z > maxZ) { maxZ = z; maxRow = `${desk} :: ${blockId} :: ${poolKey} :: v${vid} ${share.toFixed(2)} %`; }
  }
}
const total = three.length * N;
console.log(`\nUNIFORMITY · ${three.length} three-variant pools x ${N} seeds = ${total} reads`);
console.log('  POOLED share per vid: ' + [...agg].map(([v,c])=>`v${v} ${(c/total*100).toFixed(2)} %`).join(' · '));
const pooledSE = Math.sqrt((1/3)*(2/3)/total)*100;
console.log(`  pooled 2 SE band: [${(100/3-2*pooledSE).toFixed(3)}, ${(100/3+2*pooledSE).toFixed(3)}]`);
console.log(`  per-pool SE ${SE.toFixed(4)} pp · MAX |z| ${maxZ.toFixed(2)} SE at ${maxRow}`);
console.log(`  shares measured: ${three.length * 3}`);

// APPEND SAFETY
const AN = 2000;
const ASEEDS = SEEDS.slice(0, AN);
let sMoved=0,sToNew=0,mMoved=0,mToNew=0,reads=0,between=0;
for (const { blockId, poolKey, pool } of three) {
  const grown = [...pool, { angle: 'ledger', text: 'planted', slots: [], vid: 4 }];
  for (const seed of ASEEDS) {
    reads++;
    const a = drawVariant(pool, blockId, poolKey, seed), b = drawVariant(grown, blockId, poolKey, seed);
    if (a.vid !== b.vid) { sMoved++; if (b.vid === 4) sToNew++; else between++; }
    const c = modulusDraw(pool, blockId, poolKey, seed), d = modulusDraw(grown, blockId, poolKey, seed);
    if (c !== d) { mMoved++; if (d.vid === 4) mToNew++; }
  }
}
console.log(`\nAPPEND-SAFETY · ${three.length} pools x ${AN} seeds = ${reads} reads`);
console.log(`  law 6   moved ${sMoved} (${(sMoved/reads*100).toFixed(2)} %) · to the NEW vid ${sToNew} (${(sToNew/sMoved*100).toFixed(2)} % of movers) · between two OLD ${between}`);
console.log(`  modulus moved ${mMoved} (${(mMoved/reads*100).toFixed(2)} %) · to the NEW vid ${mToNew} (${(mToNew/mMoved*100).toFixed(2)} % of movers) · between two OLD ${mMoved-mToNew}`);
