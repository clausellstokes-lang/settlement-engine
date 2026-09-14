// probe-car10.mjs — the census figures, read the way the walker reads them, so car 10's
// cures can be measured without a vitest run. READ-ONLY: imports the dock's modules and
// writes nothing.
import { pathToFileURL } from 'node:url';

const D = '/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/4e3d2f70-f45f-4e14-b571-514c339cfa17/scratchpad/kit/laneINSTR';
const imp = (p) => import(pathToFileURL(`${D}/${p}`).href);

const wc = await imp('src/domain/prose/wiringCensus.js');
const { UNMOUNTED_BLOCKS } = await imp('src/domain/display/stateProse/dossierMounts.js');
const { loadStateLeaves, poolCells } = await imp('tests/helpers/dossierCorpus.js');
const {
  composedFillByBlock, composedFillByKeyFunction, composerSources, fillSites, unrenderedFacts,
} = await imp('tests/helpers/dossierComposedFill.js');

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
const census = wc.wiringCensus({
  sources: composerSources(),
  pools: table,
  fill: fillByBlock,
  fillByKeyFunction: composedFillByKeyFunction(sites),
  unmounted: UNMOUNTED_BLOCKS,
});
const held = [...new Set(unrenderedFacts().flatMap((r) => r.held))];
const summary = wc.censusSummary(census.rows, held);
const tiers = wc.tierRows({ rows: census.rows, held });
const counts = tiers.reduce((m, t) => m.set(t.tier, (m.get(t.tier) || 0) + 1), new Map());
const rungs = census.rows.reduce((m, r) => m.set(r.rung, (m.get(r.rung) || 0) + 1), new Map());

console.log('pools', summary.total, '· RESOLVED', summary.resolved, '· UNRESOLVED', summary.unresolved);
console.log('variants', summary.variants, '· mean', summary.meanPerPool, '· histogram', JSON.stringify(Object.fromEntries(summary.variantHistogram)));
console.log('rungs', JSON.stringify(Object.fromEntries(rungs)));
console.log('key fns', census.functions, '· consulted', census.consulted ?? '(not published)', '· tables', census.tables);
console.log('slotless', summary.slotless.length, '· bagless', summary.bagless.length, '· unheld-field predicates', summary.predicatesOverUnreadFields.length);
console.log('resolvedWithPredicate', summary.resolvedWithPredicate ?? '(not published)', '· resolvedWithCleanPredicate', summary.resolvedWithCleanPredicate ?? '(not published)');
console.log('syntheticTableFields', summary.syntheticTableFields ?? '(not published)');
console.log('TIERS · MISSING', counts.get('MISSING'), '· THIN', counts.get('THIN'), '· COVERED', counts.get('COVERED'));
const thinLimbs = { one: 0, grammar: 0, settlement: 0 };
for (const r of census.rows) {
  if (r.variants === 1) thinLimbs.one += 1;
  if (r.grammars === 1) thinLimbs.grammar += 1;
  if (r.slotsNamed.length > 0 && r.slotsNamed.every((s) => s === 'settlement')) thinLimbs.settlement += 1;
}
console.log('THIN limbs · one-variant', thinLimbs.one, '· one-grammar', thinLimbs.grammar, '· settlement-only', thinLimbs.settlement);
console.log('facts a key function conjoins', wc.factIndex(census.rows).length);

// The predicate-quality split, measured the way the second fold measured it.
const withPredicate = census.rows.filter((r) => r.predicate.length > 0);
const FRAGMENT = /[;{}]|\breturn\b|\bif\s*\(|\n/;
const fragments = withPredicate.filter((r) => r.predicate.some((p) => FRAGMENT.test(p.value)));
console.log('rows carrying a predicate row', withPredicate.length, '· of which a code fragment', fragments.length);
const emptyResolved = census.rows.filter((r) => r.status === 'RESOLVED' && r.predicate.length === 0);
console.log('RESOLVED with EMPTY predicate', emptyResolved.length);
if (process.argv.includes('--fragments')) {
  for (const r of fragments.slice(0, 20)) console.log('  FRAG', r.block, '::', r.pool, '=>', JSON.stringify(r.predicate));
}
if (process.argv.includes('--empty')) {
  for (const r of emptyResolved.slice(0, 20)) console.log('  EMPTY', r.block, '::', r.pool, '·', r.keyFunction, '·', r.rung);
}
if (process.argv.includes('--pow2')) {
  for (const r of census.rows.filter((x) => x.block === 'DS-POW-2')) console.log('  POW2', r.status, r.rung, '|', r.pool, '|', JSON.stringify(r.predicate));
}
if (process.argv.includes('--missing')) {
  for (const r of tiers.filter((t) => t.tier === 'MISSING')) console.log('  MISSING', r.subject);
}
if (process.argv.includes('--cells')) {
  console.log('loader pool cells', poolCells(leaves.filter((e) => e.register === 'R1')).size);
}
