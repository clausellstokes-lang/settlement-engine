#!/usr/bin/env node
/**
 * RUN (from the repository root):
 *   node docs/chair/2026-11-20/content/daily/measures/B2/measure.b2.mjs > docs/chair/2026-11-20/content/daily/measures/B2/b2.out.txt 2>&1
 *
 * DAILY-2 · B2 — `dawn_work` and `child_warnings` RE-MEASURED ON THE BUILT CODE (`src/domain/dailyLife.js ::
 * deriveDawnWork / deriveChildWarnings`, pools `src/data/dailyLife/dawnWork.js`, `childWarnings.js`). Measure only.
 * Births: M1's (150 a size, seeds hxd-<size>-0..149), copied as measures/B1/measure.b1.mjs copies them.
 * Per slot and size: the top single text share (% of 150), distinct texts, EMPTY, each branch's reach (% of 150 whose
 * printed line comes from it), the eligible rows of every branch over the places taking it (min) and, for the calm
 * pools (dawn `default`, child `none`), over ALL places as if each took it; the false lines by M1's every dawn/child test
 * (`measures/M1/measure.m1.mjs` rows 162-186, copied, applied by the clause printed); and the house checks of rules 4 and 6.
 */
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
const HERE = dirname(fileURLToPath(import.meta.url));
const L = resolve(HERE, '../../../../../../..');

const { generateSettlementPipeline } = await import(`${L}/src/generators/generateSettlementPipeline.js`);
const { birthConfig, loadGenerationLawPayloads } = await import(`${L}/src/domain/density/densityCreateBoundary.js`);
const { DEFAULT_CONFIG } = await import(`${L}/src/store/configSlice.js`);
const { deriveDailyLifeSlot } = await import(`${L}/src/domain/dailyLife.js`);
const { DAWN_WORK } = await import(`${L}/src/data/dailyLife/dawnWork.js`);
const { CHILD_WARNINGS } = await import(`${L}/src/data/dailyLife/childWarnings.js`);
const { filterDeclared } = await import(`${L}/src/domain/facts/drawDeclared.js`);
const { factsOf } = await import(`${L}/src/domain/facts/factsOf.js`);
const { defenceOf } = await import(`${L}/src/domain/facts/defence.js`);
const { hasInstitution } = await import(`${L}/src/domain/facts/institutions.js`);
const { marketOf } = await import(`${L}/src/domain/facts/market.js`);
const { tradeRouteOf } = await import(`${L}/src/domain/facts/terrain.js`);
const { liveInstitutions, isLiveInstitution } = await import(`${L}/src/domain/institutions/institutionRoster.js`);
const { ACCESS_ONLY } = await import(`${L}/src/domain/facts/liveInstitutionNames.js`);
const { isHideableHouse } = await import(`${L}/src/domain/people/cardVeil.js`);
const { institutionSentenceNoun } = await import(`${L}/src/domain/display/institutionSentenceNoun.js`);

console.log('RE-RUN: node docs/chair/2026-11-20/content/daily/measures/B2/measure.b2.mjs > docs/chair/2026-11-20/content/daily/measures/B2/b2.out.txt 2>&1');
const SIZES = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
const N = 150;
const t0 = Date.now();
await loadGenerationLawPayloads();
const rows = [];
for (const size of SIZES) for (let i = 0; i < N; i++) {
  const seed = `hxd-${size}-${i}`;
  const rec = generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, settType: size }), null, { seed, customContent: {} });
  const d = deriveDailyLifeSlot('dawn_work', rec), c = deriveDailyLifeSlot('child_warnings', rec);
  rows.push({ seed, size, rec, facts: factsOf(rec), dawn: { text: d.text, refs: d.references }, child: { text: c.text, refs: c.references } });
}
console.log(`births and slots: ${rows.length} (${N} a size, M1's recipe) in ${((Date.now() - t0) / 1000).toFixed(0)}s`);

// ── the branch a printed text came from ──
const patternOf = (t) => new RegExp(`^${t.replace(/[.*+?^$()|[\]\\]/g, '\\$&').replace(/\\?\{\w+\\?\}/g, '.+')}$`);
const findIn = (pools, part, keep = () => true) => { for (const [b, pool] of Object.entries(pools)) if (keep(b)) for (const l of pool) if (patternOf(l.text).test(part)) return { b, l }; return null; };
const PREFIX = 'Children are warned about ';
for (const x of rows) {
  x.dawn.own = x.dawn.text ? [findIn(DAWN_WORK, x.dawn.text)] : [];
  const whole = x.child.text ? findIn(CHILD_WARNINGS, x.child.text, (b) => b === 'none') : null;
  x.child.own = !x.child.text ? [] : whole ? [whole]
    : x.child.text.slice(PREFIX.length, -1).split(', and about ').map((p) => findIn(CHILD_WARNINGS, p, (b) => b !== 'none'));
}
const unmatched = rows.filter((x) => [...x.dawn.own, ...x.child.own].some((o) => !o)).length;
console.log(`texts not traced to a pool line: ${unmatched}`);

// M1's record tests for these slots (copied from measure.m1.mjs)
const liveNames = (r) => liveInstitutions(r).map((i) => String(i?.name || '')).filter((n) => n && !ACCESS_ONLY.test(n));
const anyLive = (r, re) => liveNames(r).some((n) => re.test(n));
const quarters = (r) => (Array.isArray(r?.spatialLayout?.quarters) ? r.spatialLayout.quarters : []);
const landmarks = (r) => quarters(r).flatMap((q) => (Array.isArray(q?.landmarks) ? q.landmarks.map(String) : []));
const safe = (f, d = undefined) => { try { return f(); } catch { return d; } };
const WELL = /\bwells?\b|\bwater source|\bwater sources\b|\bwater system|\bwater infrastructure|\baqueduct/i;
const T = {
  walls: (r) => defenceOf(r).walls, guard: (r) => safe(() => factsOf(r).guardPresence, false), gate: (r) => defenceOf(r).gate,
  bakery: (r) => anyLive(r, /\bbak(?:er|ers|ery|eries|ehouse)\b/i), smithy: (r) => hasInstitution(r, 'smith'), granary: (r) => hasInstitution(r, 'granary'),
  quarters: (r) => quarters(r).length > 0, tradeQuarter: (r) => quarters(r).some((q) => /\bmarket|\btrade|\bmerchant|\bbazaar|\bcommerc/i.test(String(q?.name || ''))),
  market: (r) => marketOf(r), well: (r) => anyLive(r, WELL) || landmarks(r).some((l) => WELL.test(l)),
  routeNone: (r) => ['', 'isolated', 'none'].includes(tradeRouteOf(r)), warehouse: (r) => anyLive(r, /\bwarehouse|\bstorehouse/i),
  sacred: (r) => safe(() => factsOf(r).sacredHouse, false), guild: (r) => safe(() => factsOf(r).guild, false),
  sickHouse: (r) => defenceOf(r).hospital || defenceOf(r).healer, neighbour: (r) => !!r.neighborRelationship,
  appointedPost: (r) => safe(() => factsOf(r).appointedPost, false), timber: (r) => safe(() => factsOf(r).timberAtHand, false),
};
const M1 = [
  ['dawn', /the granary queue/, 'no granary', (r) => !T.granary(r)],
  ['dawn', /The walls claim/, 'no walls', (r) => !T.walls(r)],
  ['dawn', /the watch musters/, 'no guard force', (r) => !T.guard(r)],
  ['dawn', /Smithy fires/, 'no smithy', (r) => !T.smithy(r)],
  ['dawn', /guild-callers/, 'no guild', (r) => !T.guild(r)],
  ['dawn', /Merchant caravans roll/, 'no trade route', (r) => T.routeNone(r)],
  ['dawn', /queue at the warehouses/, 'no warehouse', (r) => !T.warehouse(r)],
  ['dawn', /Bakers light their ovens/, 'no bakery', (r) => !T.bakery(r)],
  ['dawn', /then the smiths/, 'no smithy', (r) => !T.smithy(r)],
  ['dawn', /the watch changes/, 'no guard force', (r) => !T.guard(r)],
  ['dawn', /as the gates open/, 'no gate', (r) => !T.gate(r)],
  ['child', /the deep well/, 'no well', (r) => !T.well(r)],
  ['child', /the woods at twilight/, 'no timber', (r) => !T.timber(r)],
  ['child', /linger at the gates/, 'no gate', (r) => !T.gate(r)],
  ['child', /the trade quarter/, 'no quarters at all', (r) => !T.quarters(r)],
  ['child', /the trade quarter/, 'no trade-kind quarter', (r) => !T.tradeQuarter(r)],
  ['child', /the empty stalls/, 'no market', (r) => !T.market(r)],
  ['child', /the sick-house/, 'no hospital or healer', (r) => !T.sickHouse(r)],
  ['child', /when the bells ring/, 'no sacred house', (r) => !T.sacred(r)],
  ['child', /the neighbour\b/, 'no neighbour', (r) => !T.neighbour(r)],
  ['child', /officials/, 'no appointed post', (r) => !T.appointedPost(r)],
];
const rowOf = (rec, ref) => (Array.isArray(rec.institutions) ? rec.institutions : []).find((i) => (ref.id && i?.id === ref.id) || i?.name === ref.label);
const HOUSE = [
  ['a named house not live or access-only', (s, x) => s.refs.filter((r) => r.type === 'institution').some((ref) => { const i = rowOf(x.rec, ref); return !i || !isLiveInstitution(i) || ACCESS_ONLY.test(String(i.name)); })],
  ['a hideable house named (rule 6)', (s, x) => s.refs.filter((r) => r.type === 'institution').some((ref) => { const i = rowOf(x.rec, ref); return !!i && isHideableHouse(i); })],
  ['a bracket printed (rule 4)', (s) => /[()]/.test(s.text)],
  ['the word "town" (rule 4)', (s) => /\btowns?\b/i.test(s.text)],
  ['a named house without its article (rule 4)', (s) => s.refs.filter((r) => r.type === 'institution').some((ref) => !s.text.includes(`the ${institutionSentenceNoun(ref.label)}`))],
];
const CHILD_ONLY = [['"; " joining two warnings (child only; the join is ", and about ")', (s) => /; /.test(s.text)]];

const by = (s) => rows.filter((x) => x.size === s);
const pct = (n) => Math.round((100 * n) / N);
const line = (label, f) => `| ${label} | ${SIZES.map((s) => f(s)).join(' | ')} |`;
const HDR = `| row | ${SIZES.join(' | ')} |\n|---|${SIZES.map(() => '---:').join('|')}|`;
const top = (s, k) => { const c = new Map(); for (const x of by(s)) if (x[k].text) c.set(x[k].text, (c.get(x[k].text) || 0) + 1); return [...c.entries()].sort((a, b) => b[1] - a[1])[0] || ['(none)', 0]; };
const eligibleN = (x, pool) => filterDeclared(pool, { facts: x.facts }).length;
let falseTotal = 0, houseTotal = 0;
for (const [k, slot, POOLS, calm] of [['dawn', 'dawn_work', DAWN_WORK, 'default'], ['child', 'child_warnings', CHILD_WARNINGS, 'none']]) {
  console.log(`\n════ ${slot}\n${HDR}`);
  console.log(line('top single text % of 150', (s) => String(pct(top(s, k)[1]))));
  console.log(line('distinct texts', (s) => String(new Set(by(s).map((x) => x[k].text).filter(Boolean)).size)));
  console.log(line('EMPTY (no true line)', (s) => String(by(s).filter((x) => !x[k].text).length)));
  for (const b of Object.keys(POOLS)) {
    console.log(line(`reach % / min eligible: ${b}`, (s) => {
      const xs = by(s).filter((x) => x[k].own.some((o) => o?.b === b));
      return xs.length ? `${pct(xs.length)} / ${Math.min(...xs.map((x) => eligibleN(x, POOLS[b])))}` : '0 / —';
    }));
  }
  console.log(line(`ALL places as if ${calm}: min / median eligible`, (s) => { const e = by(s).map((x) => eligibleN(x, POOLS[calm])).sort((a, b) => a - b); return `${e[0]} / ${e[Math.floor(e.length / 2)]}`; }));
  for (const [kk, re, label, f] of M1.filter((m) => m[0] === k)) {
    const hits = rows.filter((x) => re.test(x[k].text) && f(x.rec)); falseTotal += hits.length;
    console.log(`${line(`FALSE ${re.source}: ${label}`, (s) => String(hits.filter((x) => x.size === s).length))}${hits[0] ? ` e.g. ${hits[0].seed}` : ''}`);
  }
  for (const [label, f] of k === 'child' ? [...HOUSE, ...CHILD_ONLY] : HOUSE) {
    const hits = rows.filter((x) => f(x[k], x)); houseTotal += hits.length;
    console.log(`${line(label, (s) => String(hits.filter((x) => x.size === s).length))}${hits[0] ? ` e.g. ${hits[0].seed}` : ''}`);
  }
  for (const s of SIZES) { const [t, n] = top(s, k); console.log(`  top ${s} (${n}/${N}): "${t}"`); }
}
console.log(`\nM1 FALSE-LINE TOTAL: ${falseTotal}\nHOUSE-RULE HITS TOTAL: ${houseTotal}`);
console.log('\n── M1\'s named places ──');
for (const seed of ['hxd-thorp-0', 'hxd-hamlet-0', 'hxd-hamlet-7', 'hxd-metropolis-0']) { const x = rows.find((r) => r.seed === seed); console.log(`${seed}: dawn "${x.dawn.text}" | child "${x.child.text}"`); }
console.log(`\ndone in ${((Date.now() - t0) / 1000).toFixed(0)}s`);
