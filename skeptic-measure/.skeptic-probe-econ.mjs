import { generateSettlementPipeline } from './src/generators/generateSettlementPipeline.js';
import { deriveFoodBalance, deriveGranaryOutlook } from './src/domain/display/dossierViewModel.js';
import { economyDeskRead } from './src/components/new/economyDeskRead.js';
import { rateGrid } from './scripts/prose-rate-corpus.mjs';

const grid = rateGrid();
let avail = 0, granAvail = 0, n = 0;
const noRead = new Map(), fullRead = new Map();
const bump = (m, k) => m.set(k, (m.get(k) || 0) + 1);
function walk(node, out, depth = 0) {
  if (!node || typeof node !== 'object' || depth > 8) return;
  if (node.blockId && node.poolKey) bump(out, `${node.blockId} :: ${node.poolKey}`);
  for (const v of Object.values(node)) walk(v, out, depth + 1);
}
for (const spec of grid) {
  let s; try { s = generateSettlementPipeline(spec.config, null, { seed: spec.seed, customContent: {} }); } catch { continue; }
  n++;
  const fb = deriveFoodBalance(s), gr = deriveGranaryOutlook(s);
  if (fb?.available) avail++;
  if (gr?.available) granAvail++;
  walk(economyDeskRead(s, { seed: String(s._seed ?? s.id), audience: 'dm' }), noRead);
  walk(economyDeskRead(s, { foodBalance: fb, granaryOutlook: gr }), fullRead);
}
console.log('towns', n, '| deriveFoodBalance.available', avail, '| deriveGranaryOutlook.available', granAvail);
const only = [...fullRead.keys()].filter(k => !noRead.has(k)).sort();
console.log('pools firing ONLY when the tab readings are passed:', only.length);
for (const k of only) console.log('   ', k, '=', fullRead.get(k), 'towns =', Math.round(fullRead.get(k) / n * 10000), 'bp');
