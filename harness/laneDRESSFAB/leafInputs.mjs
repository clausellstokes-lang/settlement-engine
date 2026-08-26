#!/usr/bin/env node
/** DRESS-FABRIC · the corpus's plan inputs, printed — the chaosGrid dial's own source. */
import { CORPUS, buildOne } from '../exemplars.mjs';
import { partitionInputs } from '../laneSPINE1/partitionPerf.mjs';
const BASE = { PLANTED_GRID: 0.12, COMPOSITE: 0.34 };
for (const spec of CORPUS) {
  const { settlement, model, fabric } = buildOne(spec);
  const i = partitionInputs(settlement, model, fabric);
  const base = BASE[i.planMode] != null ? BASE[i.planMode] : 0.58;
  console.log(`${spec.key.padEnd(14)} tier=${String(fabric.meta.tier).padEnd(11)} planMode=${String(i.planMode).padEnd(14)} chaosGridBase=${base}  originForm=${String(i.originForm).padEnd(12)} rw=${i.roadWidth} extent=${Math.round(i.extent)}`);
}
