import { wiringCensus, censusSummary, tierRows, factIndex, rootOf } from '/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/4e3d2f70-f45f-4e14-b571-514c339cfa17/scratchpad/kit/skepINSTR2/src/domain/prose/wiringCensus.js';
import { UNMOUNTED_BLOCKS } from '/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/4e3d2f70-f45f-4e14-b571-514c339cfa17/scratchpad/kit/skepINSTR2/src/domain/display/stateProse/dossierMounts.js';
import { loadStateLeaves, poolCells } from '/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/4e3d2f70-f45f-4e14-b571-514c339cfa17/scratchpad/kit/skepINSTR2/tests/helpers/dossierCorpus.js';
import { composedFillByBlock, composedFillByKeyFunction, composerSources, fillSites, unrenderedFacts } from '/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/4e3d2f70-f45f-4e14-b571-514c339cfa17/scratchpad/kit/skepINSTR2/tests/helpers/dossierComposedFill.js';
import { writeFileSync } from 'node:fs';

const leaves = await loadStateLeaves();
const table = new Map();
for (const e of leaves) {
  if (!table.has(e.block)) table.set(e.block, new Map());
  const b = table.get(e.block);
  if (!b.has(e.pool)) b.set(e.pool, []);
  b.get(e.pool).push({ text: e.text, slots: e.slots });
}
const sites = fillSites();
const fillByBlock = new Map([...composedFillByBlock(sites)].map(([b, r]) => [b, r.slots]));
const census = wiringCensus({
  sources: composerSources(), pools: table, fill: fillByBlock,
  fillByKeyFunction: composedFillByKeyFunction(sites), unmounted: UNMOUNTED_BLOCKS,
});
const held = [...new Set(unrenderedFacts().flatMap((r) => r.held))];
writeFileSync('/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/4e3d2f70-f45f-4e14-b571-514c339cfa17/scratchpad/kit/skeptic-instr2/rows.json', JSON.stringify({rows: census.rows, functions: census.functions, tables: census.tables, held}, null, 0));

// THIN sub-limbs
const oneVariant = census.rows.filter(r => r.variants === 1).length;
const oneGrammar = census.rows.filter(r => r.grammars === 1).length;
const settlementOnly = census.rows.filter(r => r.slotsNamed.length > 0 && r.slotsNamed.every(s => s === 'settlement')).length;
const thin = census.rows.filter(r => r.variants === 1 || r.grammars === 1 || (r.slotsNamed.length>0 && r.slotsNamed.every(s=>s==='settlement'))).length;
console.log('THIN limbs: one-variant', oneVariant, '· one-grammar', oneGrammar, '· settlement-only', settlementOnly, '· union THIN', thin, '· COVERED', census.rows.length - thin);
// blocks whose EVERY pool is settlement-only; blocks with at least one
const byBlock = new Map();
for (const r of census.rows) {
  if (!byBlock.has(r.block)) byBlock.set(r.block, []);
  byBlock.get(r.block).push(r.slotsNamed.length>0 && r.slotsNamed.every(s=>s==='settlement'));
}
let allSO = 0, anySO = 0;
for (const [b, list] of byBlock) { if (list.every(Boolean)) allSO++; if (list.some(Boolean)) anySO++; }
console.log('blocks EVERY pool settlement-only:', allSO, '· blocks with AT LEAST ONE:', anySO, '· blocks total', byBlock.size);
// rung split
const rung = new Map(); for (const r of census.rows) rung.set(r.rung, (rung.get(r.rung)||0)+1);
console.log('rungs', [...rung]);
const s = censusSummary(census.rows, held);
console.log('resolved', s.resolved, 'unresolved', s.unresolved, 'slotless', s.slotless.length, 'bagless', s.bagless.length, 'overUnread', s.predicatesOverUnreadFields.length);
console.log('facts', factIndex(census.rows).length);
