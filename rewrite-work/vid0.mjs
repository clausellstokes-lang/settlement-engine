import { DOSSIER_STATE_PROSE_ECONOMY } from '../laneREWRITE/src/data/dossierStateProse/economy.generated.js';
import { DOSSIER_STATE_PROSE_POWER } from '../laneREWRITE/src/data/dossierStateProse/power.generated.js';
import { DOSSIER_STATE_PROSE_DEFENSE } from '../laneREWRITE/src/data/dossierStateProse/defense.generated.js';
import { DOSSIER_STATE_PROSE_WAR_FAITH } from '../laneREWRITE/src/data/dossierStateProse/warFaith.generated.js';
import { DOSSIER_STATE_PROSE_STRESSORS } from '../laneREWRITE/src/data/dossierStateProse/stressors.generated.js';
import { DOSSIER_STATE_PROSE_GENERAL } from '../laneREWRITE/src/data/dossierStateProse/general.generated.js';
const P = [['economy', DOSSIER_STATE_PROSE_ECONOMY], ['power', DOSSIER_STATE_PROSE_POWER],
  ['defense', DOSSIER_STATE_PROSE_DEFENSE], ['warFaith', DOSSIER_STATE_PROSE_WAR_FAITH],
  ['stressors', DOSSIER_STATE_PROSE_STRESSORS], ['general', DOSSIER_STATE_PROSE_GENERAL]]
  .flatMap(([desk, c]) => Object.entries(c).flatMap(([blockId, b]) =>
    Object.entries(b.pools).map(([poolKey, pool]) => ({ desk, blockId, poolKey, pool }))));
const odd = P.filter((r) => r.pool.some((v) => !Number.isInteger(v.vid) || v.vid <= 0));
console.log(`pools holding a non-positive vid: ${odd.length}`);
for (const r of odd) {
  console.log(`\n${r.desk} :: ${r.blockId} :: ${r.poolKey}  (len ${r.pool.length})`);
  for (const v of r.pool) console.log(`   vid=${JSON.stringify(v.vid)} angle=${v.angle} marks=${JSON.stringify(v.marks||[])} text="${String(v.text).slice(0,60)}"`);
}
const allVids = new Map();
for (const r of P) for (const v of r.pool) allVids.set(JSON.stringify(v.vid), (allVids.get(JSON.stringify(v.vid))||0)+1);
console.log('\nvid value histogram: ' + [...allVids].sort().map(([k,n])=>`${k}:${n}`).join(' '));
const firstNotOne = P.filter((r) => r.pool[0].vid !== 1);
console.log(`pools whose first variant is not vid 1: ${firstNotOne.length}`);
const nonContig = P.filter((r) => r.pool.some((v, i) => v.vid !== i + 1));
console.log(`pools whose vids are not 1..n in order: ${nonContig.length}`);
