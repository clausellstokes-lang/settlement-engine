import { generateSettlementPipeline } from '../skepMEASURE/src/generators/generateSettlement.js';
import { deriveFoodBalance, deriveGranaryOutlook } from '../skepMEASURE/src/domain/display/dossierViewModel.js';
import { economyDeskRead } from '../skepMEASURE/src/components/new/economyDeskRead.js';
import { rateGrid } from '../skepMEASURE/scripts/prose-rate-corpus.mjs';

const grid = rateGrid();
let avail = 0, granAvail = 0, n = 0;
const firedNoRead = new Map(), firedFullRead = new Map();
const bump = (m, k) => m.set(k, (m.get(k) || 0) + 1);
function walk(node, out, depth = 0) {
  if (!node || typeof node !== 'object' || depth > 6) return;
  if (node.blockId && node.poolKey) bump(out, `${node.blockId} :: ${node.poolKey}`);
  for (const v of Object.values(node)) walk(v, out, depth + 1);
}
for (const spec of grid.slice(0, 200)) {
  let s; try { s = generateSettlementPipeline(spec.config, null, { seed: spec.seed, customContent: {} }); } catch { continue; }
  n++;
  const fb = deriveFoodBalance(s), gr = deriveGranaryOutlook(s);
  if (fb?.available) avail++;
  if (gr?.available) granAvail++;
  walk(economyDeskRead(s, {}), firedNoRead);
  walk(economyDeskRead(s, { foodBalance: fb, granaryOutlook: gr }), firedFullRead);
}
console.log('towns', n, 'foodBalance.available', avail, 'granaryOutlook.available', granAvail);
const only = [...firedFullRead.keys()].filter(k => !firedNoRead.has(k));
console.log('pools that fire ONLY with the tab readings:', only.length);
for (const k of only.sort()) console.log('   ', k, firedFullRead.get(k));
