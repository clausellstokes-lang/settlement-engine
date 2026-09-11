import { drawVariant } from '../laneREWRITE/src/domain/display/stateProse/stateProseKernel.js';
import { DOSSIER_STATE_PROSE_ECONOMY } from '../laneREWRITE/src/data/dossierStateProse/economy.generated.js';
import { DOSSIER_STATE_PROSE_POWER } from '../laneREWRITE/src/data/dossierStateProse/power.generated.js';
import { DOSSIER_STATE_PROSE_DEFENSE } from '../laneREWRITE/src/data/dossierStateProse/defense.generated.js';
import { DOSSIER_STATE_PROSE_WAR_FAITH } from '../laneREWRITE/src/data/dossierStateProse/warFaith.generated.js';
import { DOSSIER_STATE_PROSE_STRESSORS } from '../laneREWRITE/src/data/dossierStateProse/stressors.generated.js';
import { DOSSIER_STATE_PROSE_GENERAL } from '../laneREWRITE/src/data/dossierStateProse/general.generated.js';
const P = [['economy', DOSSIER_STATE_PROSE_ECONOMY], ['power', DOSSIER_STATE_PROSE_POWER],
  ['defense', DOSSIER_STATE_PROSE_DEFENSE], ['warFaith', DOSSIER_STATE_PROSE_WAR_FAITH],
  ['stressors', DOSSIER_STATE_PROSE_STRESSORS], ['general', DOSSIER_STATE_PROSE_GENERAL]]
  .flatMap(([d, c]) => Object.entries(c).flatMap(([b, bl]) =>
    Object.entries(bl.pools).map(([p, pool]) => ({ desk: d, blockId: b, poolKey: p, pool }))));
const N = 10000, SEEDS = Array.from({length:N},(_,i)=>`uniformity-seed-${i}`);
const three = P.filter((r) => r.pool.length === 3);
// slot 0/1/2 = the pool's first/second/third annex row, so the seven canonical-led pools
// pool with the rest by POSITION rather than by id value.
const agg = [0,0,0];
const SE = Math.sqrt((1/3)*(2/3)/N)*100; let maxZ=0, maxAt='';
for (const {desk,blockId,poolKey,pool} of three) {
  const local=[0,0,0];
  for (const s of SEEDS) { const d=drawVariant(pool,blockId,poolKey,s); const i=pool.indexOf(d); local[i]++; agg[i]++; }
  for (let i=0;i<3;i++){ const z=Math.abs(local[i]/N*100-100/3)/SE; if(z>maxZ){maxZ=z;maxAt=`${desk} :: ${blockId} :: ${poolKey} slot ${i}`;} }
}
const total = three.length*N, exp = total/3;
const chi2 = agg.reduce((s,o)=>s+(o-exp)**2/exp,0);
console.log(`three-variant pools ${three.length} · reads ${total}`);
console.log('  shares by slot: ' + agg.map((c,i)=>`#${i} ${(c/total*100).toFixed(3)} %`).join(' · '));
console.log('  max |share - 100/3|: ' + Math.max(...agg.map(c=>Math.abs(c/total*100-100/3))).toFixed(4) + ' pp');
console.log(`  chi-square (df 2) ${chi2.toFixed(3)}   [crit 5.991 @ .05 · 9.210 @ .01 · 13.816 @ .001]`);
console.log(`  per-pool SE ${SE.toFixed(4)} pp · MAX |z| ${maxZ.toFixed(2)} at ${maxAt} (over ${three.length*3} shares)`);
