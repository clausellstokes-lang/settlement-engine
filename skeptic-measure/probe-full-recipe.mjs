// SKEPTIC probe: re-run the RATE corpus with the economy desk's SHIPPED tab readings supplied.
import { readFileSync } from 'node:fs';
const K = '/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/4e3d2f70-f45f-4e14-b571-514c339cfa17/scratchpad/kit/skepMEASURE';
const { rateGrid, deskReturns, rateTable, tierSilences } = await import(`${K}/scripts/prose-rate-corpus.mjs`);
const { buildCensus } = await import(`${K}/scripts/wiring-census.mjs`);
const { generateSettlementPipeline } = await import(`${K}/src/generators/generateSettlementPipeline.js`);
const { deriveFoodBalance, deriveGranaryOutlook } = await import(`${K}/src/domain/display/dossierViewModel.js`);
const { economyDeskRead } = await import(`${K}/src/components/new/economyDeskRead.js`);
const { coOccurringPairs } = await import(`${K}/src/domain/prose/wiringCensus.js`);
const { DOSSIER_MOUNTS } = await import(`${K}/src/domain/display/stateProse/dossierMounts.js`);

function walk(node, out, depth = 0) {
  if (!node || typeof node !== 'object' || depth > 8) return;
  if (node.blockId && node.poolKey) out.push({ block: node.blockId, pool: node.poolKey });
  for (const v of Object.values(node)) walk(v, out, depth + 1);
}
const towns = [];
for (const spec of rateGrid()) {
  let s; try { s = generateSettlementPipeline(spec.config, null, { seed: spec.seed, customContent: {} }); } catch { continue; }
  const seed = String(s._seed ?? s.id ?? spec.seed);
  const fired = [];
  for (const e of deskReturns(s, { seed, audience: 'dm' }, () => {})) walk(e.value, fired);
  // the ONE difference: the economy desk re-read with the tab's own readings
  walk(economyDeskRead(s, { foodBalance: deriveFoodBalance(s), granaryOutlook: deriveGranaryOutlook(s) }), fired);
  towns.push({ tier: String(s.tier), fired });
}
const run = { towns };
const table = rateTable(run);
console.log('towns', towns.length, '| pools that fired', table.rows.length, '(shipped corpus: 267)');
const dep = table.rows.filter(r => r.rateBp < 1000);
console.log('DEPARTURE at 10%:', dep.length, 'uncommon /', table.rows.length - dep.length, 'common  (shipped: 70 / 197)');
const census = await buildCensus({});
const sitesByBlock = new Map();
for (const m of DOSSIER_MOUNTS) {
  if (!sitesByBlock.has(m.blockId)) sitesByBlock.set(m.blockId, []);
  sitesByBlock.get(m.blockId).push(m.mount);
}
const sil = tierSilences(table.rows, table.tiers, sitesByBlock, census.rows);
console.log('per-tier silences', sil.length, '| LAWFUL', sil.filter(r => r.verdict === 'LAWFUL').length,
  '| MISSING-AT-TIER', sil.filter(r => r.verdict === 'MISSING-AT-TIER').length, ' (shipped: 347 / 303 / 44)');
const pairs = coOccurringPairs({ firings: towns.map(t => t.fired), rows: census.rows, minTowns: 1 });
const cls = f => (String(f).includes(' (via ') ? 'synthetic' : (String(f).includes('.') ? 'fact' : 'unrooted'));
const usable = pairs.pairs.filter(p => cls(p.a) === 'fact' && cls(p.b) === 'fact');
console.log('pairs', pairs.pairs.length, '| clearing >=51', pairs.pairs.filter(p => p.towns >= 51).length,
  '| usable', usable.length, '| usable clearing', usable.filter(p => p.towns >= 51).length,
  ' (shipped: 729 / 590 / 226 / 170)');
