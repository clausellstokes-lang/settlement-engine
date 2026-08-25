#!/usr/bin/env node
/**
 * GFOLD probe — the structural preconditions for moving the raise ahead of the epoch's growth.
 *   (a) does ANY corpus leaf carry a circuit event at epoch 0 (where no arrangement exists yet)?
 *   (b) at each raise epoch, how many built pieces exist BEFORE that epoch's growth vs after —
 *       i.e. would the hull still clear `raiseWrap`'s `pts.length < 8` floor?
 *   (c) does `state.plots` agree with the PLOT face count (the band swallows plots without
 *       decrementing) — measured as a control, before and after the order change.
 */
import { CORPUS, buildOne } from '../exemplars.mjs';
import { buildSettledPartition } from '../../src/domain/townMap/fabric/partitionConstruct.js';
import { liveFaces } from '../../src/domain/townMap/fabric/partitionArrangement.js';
import { partitionInputs } from '../laneSPINE1/partitionPerf.mjs';

let zeroEpochRaises = 0;
const rows = [];
for (const spec of CORPUS) {
  const { settlement, model, fabric } = buildOne(spec);
  const input = partitionInputs(settlement, model, fabric);
  const eps = input.ledger.epochs || [];
  const raiseIdx = [];
  for (let k = 0; k < eps.length; k++) if ((eps[k].circuitEvents || []).length) raiseIdx.push(k);
  if (raiseIdx.includes(0)) zeroEpochRaises++;
  // built-piece count at the CLOSE of the epoch before each raise (epochCap = k), which is what the
  // hull would see if the raise moved ahead of this epoch's growth.
  const before = [];
  const after = [];
  for (const k of raiseIdx) {
    const Pb = buildSettledPartition({ ...input, epochCap: k });        // through epoch k-1
    const Pa = buildSettledPartition({ ...input, epochCap: k + 1 });    // through epoch k
    const cnt = (P) => liveFaces(P.arrangement)
      .filter((f) => f.cls === 'PLOT' || f.cls === 'VOID' || f.cls === 'BLOCK').length;
    before.push(cnt(Pb));
    after.push(cnt(Pa));
  }
  const P = buildSettledPartition(input);
  const plotFaces = liveFaces(P.arrangement).filter((f) => f.cls === 'PLOT').length;
  rows.push({
    key: spec.key, epochs: eps.length, raiseEpochs: raiseIdx,
    piecesBeforeRaise: before, piecesAfterRaise: after,
    wraps: P.wraps.length, plots: P.plots, plotFaces, drift: P.plots - plotFaces,
  });
}
for (const r of rows) {
  console.log(`${r.key.padEnd(12)} eps=${String(r.epochs).padStart(2)} raiseEp=[${r.raiseEpochs.join(',')}]`
    + `  piecesBEFORE=[${r.piecesBeforeRaise.join(',')}] piecesAFTER=[${r.piecesAfterRaise.join(',')}]`
    + `  wraps=${r.wraps} plots=${r.plots} plotFaces=${r.plotFaces} drift=${r.drift}`);
}
console.log(`\nleaves with a circuit event at EPOCH 0: ${zeroEpochRaises}`);
console.log(`min pieces standing BEFORE any raise epoch's growth: `
  + Math.min(...rows.flatMap((r) => r.piecesBeforeRaise), Infinity));
console.log(`total plots/plotFaces drift over the corpus: ${rows.reduce((s, r) => s + r.drift, 0)}`);
