// probe-census10.mjs — the execution figures joined to the CAR 10 census: how many of the
// fired keys the corrected ladder resolves, how many carry a predicate, the co-occurrence
// floors, and the tier table with the pair rows. Reads `firings-10.json` (cure 22's re-run).
import { pathToFileURL } from 'node:url';
import { readFileSync } from 'node:fs';

const D = '/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/4e3d2f70-f45f-4e14-b571-514c339cfa17/scratchpad/kit/laneINSTR';
const imp = (p) => import(pathToFileURL(`${D}/${p}`).href);
const wc = await imp('src/domain/prose/wiringCensus.js');
const { UNMOUNTED_BLOCKS } = await imp('src/domain/display/stateProse/dossierMounts.js');
const { loadStateLeaves } = await imp('tests/helpers/dossierCorpus.js');
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
const census = wc.wiringCensus({
  sources: composerSources(),
  pools: table,
  fill: new Map([...composedFillByBlock(sites)].map(([b, r]) => [b, r.slots])),
  fillByKeyFunction: composedFillByKeyFunction(sites),
  unmounted: UNMOUNTED_BLOCKS,
});
const held = [...new Set(unrenderedFacts().flatMap((r) => r.held))];
const index = wc.censusIndex(census.rows);
const file = process.argv[2] || 'firings-10.json';
const firings = JSON.parse(readFileSync(file, 'utf8'));

const fired = new Set();
for (const town of firings.firings) for (const f of town) fired.add(`${f.block} :: ${f.pool}`);
const rows = [...fired].map((k) => index.get(k)).filter(Boolean);
console.log(`EXECUTION (${file}) · towns ${firings.towns} · distinct fired keys ${fired.size}`);
console.log(`  fired keys ABSENT from the census: ${[...fired].filter((k) => !index.has(k)).length}`);
console.log(`  of the ${fired.size} fired keys, RESOLVED in the census: ${rows.filter((r) => r.status === 'RESOLVED').length}`);
console.log(`  ... and carrying a NON-EMPTY predicate: ${rows.filter((r) => r.predicate.length > 0).length}`);
console.log(`  ... and a CLEAN one: ${rows.filter((r) => wc.cleanPredicate(r.predicate)).length}`);

// THE ALWAYS-FIRING KEYS, and the absence/default class inside them, named by hand rather
// than by a regex that reads one word: a key is in the class when its own text says the
// reading is missing, zero, dormant, a first look, or the default.
const counts = new Map();
for (const town of firings.firings) for (const k of new Set(town.map((f) => `${f.block} :: ${f.pool}`))) counts.set(k, (counts.get(k) || 0) + 1);
const always = [...counts].filter(([, n]) => n === firings.towns).map(([k]) => k).sort();
const ABSENCE_CLASS = [
  'DS-POW-7 :: layer DORMANT (no ledger materialized)',
  'DS-REL-2 :: flagDriven count zero',
  'DS-DEF-3 :: First-Survey qualification (the reading is a first look)',
  'DS-GEN-11 :: THE FIRST-SURVEY QUALIFICATION',
  'DS-GEN-5 :: ordinary (route road and the default)',
];
console.log(`  keys firing on EVERY town: ${always.length}; of those, the ABSENCE/ZERO/DEFAULT class: ${ABSENCE_CLASS.filter((k) => always.includes(k)).length}`);
for (const k of ABSENCE_CLASS) console.log(`    ${always.includes(k) ? 'always' : 'NOT ALWAYS'}  ${k}`);

for (const floor of [100, 180, 200, 201]) {
  const r = wc.coOccurringPairs({ firings: firings.firings, rows: census.rows, minTowns: floor });
  console.log(`  floor ${floor}: pairs ${r.pairs.length}`);
  const tiers = wc.tierRows({ rows: census.rows, held, pairs: r.pairs });
  const c = tiers.reduce((m, t) => m.set(t.tier, (m.get(t.tier) || 0) + 1), new Map());
  console.log(`     TIERS with the pair rows at floor ${floor}: MISSING ${c.get('MISSING')} · THIN ${c.get('THIN')} · COVERED ${c.get('COVERED')}`);
}
const blind = wc.coOccurringPairs({ firings: firings.firings, rows: census.rows });
console.log(`  no floor: pairs ${blind.pairs.length} · notExecutable ${JSON.stringify(blind.notExecutable)}`);
