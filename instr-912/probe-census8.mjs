// probe-census8.mjs — car 8's census, run end to end against the dock. READ-ONLY.
import { pathToFileURL } from 'node:url';

const D = '/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad/laneINSTR';
const imp = (p) => import(pathToFileURL(`${D}/${p}`).href);

const wc = await imp('src/domain/prose/wiringCensus.js');
const fill = await imp('tests/helpers/dossierComposedFill.js');
const corpus = await imp('tests/helpers/dossierCorpus.js');
const mounts = await imp('src/domain/display/stateProse/dossierMounts.js');

const leaves = await corpus.loadStateLeaves();
/** block -> pool -> variants */
const pools = new Map();
for (const e of leaves) {
  if (!pools.has(e.block)) pools.set(e.block, new Map());
  const b = pools.get(e.block);
  if (!b.has(e.pool)) b.set(e.pool, []);
  b.get(e.pool).push({ text: e.text, slots: e.slots });
}

const sites = fill.fillSites();
const byBlock = fill.composedFillByBlock(sites);
const fillMap = new Map([...byBlock].map(([b, r]) => [b, r.slots]));
const byKeyFn = fill.composedFillByKeyFunction(sites);

const { rows, functions, tables } = wc.wiringCensus({
  sources: fill.composerSources(),
  pools,
  fill: fillMap,
  fillByKeyFunction: byKeyFn,
  unmounted: mounts.UNMOUNTED_BLOCKS,
});
const s = wc.censusSummary(rows);
console.log(`key functions ${functions} · module key tables ${tables}`);
console.log(`rows ${s.total} · RESOLVED ${s.resolved} · UNRESOLVED ${s.unresolved}`);
console.log(`variants ${s.variants} · mean per pool ${s.meanPerPool}`);
console.log(`variants-per-pool histogram: ${s.variantHistogram.map(([k, n]) => `${k}->${n}`).join(' ')}`);
console.log('rungs:', [...rows.reduce((m, r) => m.set(r.rung, (m.get(r.rung) || 0) + 1), new Map())].sort((a, b) => b[1] - a[1]).map(([k, n]) => `${k} ${n}`).join(' · '));
console.log('\nUNRESOLVED reasons:');
for (const [reason, n] of s.reasons) console.log(`  ${String(n).padStart(4)}  ${reason.slice(0, 110)}`);
console.log('\nby block (top 12 unresolved):');
for (const [b, c] of s.byBlock.slice(0, 12)) console.log(`  ${b.padEnd(12)} resolved ${String(c.resolved).padStart(3)} · unresolved ${String(c.unresolved).padStart(3)}`);
console.log(`\nslots with no provider: ${s.slotless.length} pools`);
for (const r of s.slotless.slice(0, 12)) console.log(`  ${r.block} :: ${r.pool.slice(0, 44)} — {${r.slots.join('}, {')}}`);
console.log(`\npredicates over fields the key function does not read: ${s.predicatesOverUnreadFields.length}`);
for (const r of s.predicatesOverUnreadFields.slice(0, 8)) console.log(`  ${r.block} :: ${r.pool.slice(0, 40)} — ${r.field.slice(0, 60)}`);

const facts = wc.factIndex(rows);
console.log(`\nfacts a key function reads: ${facts.length}`);
for (const f of facts.slice(0, 15)) console.log(`  ${f.fact.padEnd(46).slice(0, 46)} pools ${String(f.pools.length).padStart(3)} variants ${String(f.variants).padStart(4)} grammars ${f.grammars}`);

const held = fill.unrenderedFacts().flatMap((r) => r.held);
const tiers = wc.tierRows({ rows, held: [...new Set(held)] });
const counts = tiers.reduce((m, t) => m.set(t.tier, (m.get(t.tier) || 0) + 1), new Map());
console.log(`\nTIERS: ${[...counts].map(([k, n]) => `${k} ${n}`).join(' · ')}`);
for (const t of tiers.filter((x) => x.tier === 'THIN').slice(0, 8)) console.log(`  THIN ${t.block} :: ${t.subject.slice(0, 40)} — ${t.count}`);
for (const t of tiers.filter((x) => x.tier === 'MISSING').slice(0, 10)) console.log(`  MISSING ${t.subject.slice(0, 60)} — ${t.count}`);
