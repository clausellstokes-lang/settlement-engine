#!/usr/bin/env node
/**
 * GFOLD probe — per leaf: the ledger's emission acts, how many the constructor DREW, how many it
 * refused, and how many acts sit at an epoch that also carries a circuit-raise event (the
 * J-GROWA-12 class). Plus plots / wraps, so the plot-count restoration is quotable per leaf.
 *
 * Usage: node emitCensus.mjs   (run from the lane worktree root)
 */
import { CORPUS, buildOne } from '../exemplars.mjs';
import { buildSettledPartition } from '../../src/domain/townMap/fabric/partitionConstruct.js';
import { partitionInputs } from '../laneSPINE1/partitionPerf.mjs';

const rows = [];
for (const spec of CORPUS) {
  const { settlement, model, fabric } = buildOne(spec);
  const input = partitionInputs(settlement, model, fabric);
  const led = input.ledger;
  let acts = 0; let raiseActs = 0; let raiseEpochs = 0;
  for (const ep of (led.epochs || [])) {
    const n = (ep.emissions || []).length;
    acts += n;
    if ((ep.circuitEvents || []).length) { raiseEpochs++; raiseActs += n; }
  }
  const P = buildSettledPartition(input);
  const drawnKeys = new Set(P.emissions.map((e) => e.key));
  let raiseDrawn = 0;
  for (const ep of (led.epochs || [])) {
    if (!(ep.circuitEvents || []).length) continue;
    for (const a of (ep.emissions || [])) if (drawnKeys.has(a.key)) raiseDrawn++;
  }
  rows.push({
    key: spec.key,
    tier: fabric.meta.tier,
    plots: P.plots,
    wraps: P.wraps.length,
    acts,
    drawn: P.emissions.length,
    emitPlots: P.emissions.reduce((s, e) => s + e.plots, 0),
    refused: P.emissionRefusals,
    raiseEpochs,
    raiseActs,
    raiseDrawn,
  });
}
const pad = (v, n) => String(v).padStart(n);
console.log('leaf         tier          plots wraps  acts drawn refus emitPlots | raiseEp raiseActs raiseDrawn');
for (const r of rows) {
  console.log(`${r.key.padEnd(12)} ${r.tier.padEnd(11)} ${pad(r.plots, 6)}${pad(r.wraps, 6)}${pad(r.acts, 6)}${pad(r.drawn, 6)}${pad(r.refused, 6)}${pad(r.emitPlots, 10)} |${pad(r.raiseEpochs, 8)}${pad(r.raiseActs, 10)}${pad(r.raiseDrawn, 11)}`);
}
const tot = (f) => rows.reduce((s, r) => s + r[f], 0);
console.log(`TOTAL                     ${pad(tot('plots'), 6)}${pad(tot('wraps'), 6)}${pad(tot('acts'), 6)}${pad(tot('drawn'), 6)}${pad(tot('refused'), 6)}${pad(tot('emitPlots'), 10)} |${pad(tot('raiseEpochs'), 8)}${pad(tot('raiseActs'), 10)}${pad(tot('raiseDrawn'), 11)}`);
console.log(JSON.stringify(rows));
