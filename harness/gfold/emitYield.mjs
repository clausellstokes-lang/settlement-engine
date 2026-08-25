#!/usr/bin/env node
/**
 * GFOLD probe — per EMISSION ACT: the souls the ledger asked for, the plots those souls IMPLY at
 * the representative ratio (`act.souls / denom`), and the plots the constructor actually drew.
 * The gap between "implied" and "drawn" is the emission's throttle, and it separates the two
 * candidate causes: a BUDGET gate (drawn === 1, the one-soul act) from a HOST failure (drawn well
 * under implied because the frontier face was already carved small).
 *
 * Usage: node harness/gfold/emitYield.mjs --leaf=metropolis
 */
import { CORPUS, buildOne } from '../exemplars.mjs';
import { buildSettledPartition } from '../../src/domain/townMap/fabric/partitionConstruct.js';
import { partitionInputs } from '../laneSPINE1/partitionPerf.mjs';

const arg = (n, d) => {
  const hit = process.argv.find((a) => a.startsWith(`--${n}=`));
  return hit ? hit.slice(n.length + 3) : d;
};
const keys = arg('leaf', 'metropolis').split(',');
for (const key of keys) {
  const spec = CORPUS.find((s) => s.key === key);
  const { settlement, model, fabric } = buildOne(spec);
  const input = partitionInputs(settlement, model, fabric);
  const eps = input.ledger.epochs;
  const finalPop = eps[eps.length - 1].population;
  const denom = Math.max(1, finalPop / Math.max(1, input.bodyTarget || 1));
  const P = buildSettledPartition(input);
  console.log(`\nLEAF ${key} · bodyTarget ${input.bodyTarget} · finalPop ${finalPop} · denom ${denom.toFixed(2)}`);
  console.log('  act                       year  souls  implied  drawn  anchor    origin');
  let impliedTot = 0; let drawnTot = 0; let onePlot = 0;
  for (const e of P.emissions) {
    const implied = Math.max(1, Math.round(e.souls / denom));
    impliedTot += implied; drawnTot += e.plots;
    if (e.plots <= 1) onePlot++;
    console.log(`  ${String(e.key).padEnd(24)}${String(e.year).padStart(6)}${String(e.souls).padStart(7)}`
      + `${String(implied).padStart(9)}${String(e.plots).padStart(7)}  ${String(e.anchorKind).padEnd(9)} ${e.origin}`);
  }
  console.log(`  TOTAL implied ${impliedTot} · drawn ${drawnTot} · shortfall ${impliedTot - drawnTot}`
    + ` · acts drawing ≤1 plot: ${onePlot}/${P.emissions.length} · emissionRefusals ${P.emissionRefusals}`);
  console.log(`  plots ${P.plots}`);
}
