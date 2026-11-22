#!/usr/bin/env node
/**
 * RUN (from the repository root):
 *   node docs/chair/2026-11-20/content/daily/measures/B1/measure.b1.mjs > docs/chair/2026-11-20/content/daily/measures/B1/b1.out.txt 2>&1
 *
 * DAILY-2 · B1b C3 — `gathering_places` RE-MEASURED ON THE BUILT CODE (`src/domain/dailyLife.js :: deriveGatheringPlaces`,
 * pools `src/data/dailyLife/gatheringPlaces.js`). Measure only: nothing under src/ is changed.
 * Births: M1's (150 a size, seeds hxd-<size>-0..149; PAGE-9's THIN recipe, copied as M1 and the L1 probe copy it):
 *   loadGenerationLawPayloads(); generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, settType }), null, { seed, customContent: {} }).
 * Per size: the top single text share (% of 150), the distinct texts, the EMPTY count, the branch reach, the false lines by
 * M1's every gathering test (`measures/M1/measure.m1.mjs` rows 173-176, copied), and the house checks of LINES-COMMON rules
 * 4 and 6 (a hideable or access-only or dead house named, a bracket printed, the word "town").
 */
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
const HERE = dirname(fileURLToPath(import.meta.url));
const L = resolve(HERE, '../../../../../../..');

const { generateSettlementPipeline } = await import(`${L}/src/generators/generateSettlementPipeline.js`);
const { birthConfig, loadGenerationLawPayloads } = await import(`${L}/src/domain/density/densityCreateBoundary.js`);
const { DEFAULT_CONFIG } = await import(`${L}/src/store/configSlice.js`);
const { deriveDailyLifeSlot } = await import(`${L}/src/domain/dailyLife.js`);
const { liveInstitutions, isLiveInstitution } = await import(`${L}/src/domain/institutions/institutionRoster.js`);
const { ACCESS_ONLY } = await import(`${L}/src/domain/facts/liveInstitutionNames.js`);
const { isHideableHouse } = await import(`${L}/src/domain/people/cardVeil.js`);
const { institutionSentenceNoun } = await import(`${L}/src/domain/display/institutionSentenceNoun.js`);

console.log('RE-RUN: node docs/chair/2026-11-20/content/daily/measures/B1/measure.b1.mjs > docs/chair/2026-11-20/content/daily/measures/B1/b1.out.txt 2>&1');
const SIZES = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
const N = 150;
const t0 = Date.now();
await loadGenerationLawPayloads();
const rows = [];
for (const size of SIZES) for (let i = 0; i < N; i++) {
  const seed = `hxd-${size}-${i}`;
  const rec = generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, settType: size }), null, { seed, customContent: {} });
  const s = deriveDailyLifeSlot('gathering_places', rec);
  rows.push({ seed, size, rec, text: s.text, refs: s.references });
}
console.log(`births and slots: ${rows.length} (${N} a size, M1's recipe) in ${((Date.now() - t0) / 1000).toFixed(0)}s`);

// M1's record tests for this slot (copied from measure.m1.mjs)
const liveNames = (rec) => liveInstitutions(rec).map((i) => String(i?.name || '')).filter((n) => n && !ACCESS_ONLY.test(n));
const anyLive = (rec, re) => liveNames(rec).some((n) => re.test(n));
const quarters = (rec) => (Array.isArray(rec?.spatialLayout?.quarters) ? rec.spatialLayout.quarters : []);
const landmarks = (rec) => quarters(rec).flatMap((q) => (Array.isArray(q?.landmarks) ? q.landmarks.map(String) : []));
const WELL = /\bwells?\b|\bwater source|\bwater sources\b|\bwater system|\bwater infrastructure|\baqueduct/i;
const BRIDGE = /\bbridges?\b/i;
const SQUARE = /\bsquares?\b|\bplaza\b|\bgreen\b/i;
const T = {
  well: (r) => anyLive(r, WELL) || landmarks(r).some((l) => WELL.test(l)),
  bridge: (r) => anyLive(r, BRIDGE) || landmarks(r).some((l) => BRIDGE.test(l)),
  square: (r) => anyLive(r, SQUARE) || quarters(r).some((q) => SQUARE.test(String(q?.name || ''))) || landmarks(r).some((l) => SQUARE.test(l)),
};
/** the roster row a reference names (by id, else by label) */
const rowOf = (rec, ref) => (Array.isArray(rec.institutions) ? rec.institutions : []).find((i) => (ref.id && i?.id === ref.id) || i?.name === ref.label);
const M1_TESTS = [
  ['"the well"', 'no well/water source (M1)', (x) => /the well\b/.test(x.text) && !T.well(x.rec)],
  ['"the bridge"', 'no bridge (M1)', (x) => /the bridge/.test(x.text) && !T.bridge(x.rec)],
  ['"the open square"', 'no square (M1)', (x) => /the open square/.test(x.text) && !T.square(x.rec)],
  ['a named house', 'not live or access-only (M1: isLiveInstitution / ACCESS_ONLY)', (x) => x.refs.some((ref) => { const i = rowOf(x.rec, ref); return !i || !isLiveInstitution(i) || ACCESS_ONLY.test(String(i.name)); })],
];
const HOUSE_TESTS = [
  ['a hideable house named (rule 6)', (x) => x.refs.some((ref) => { const i = rowOf(x.rec, ref); return !!i && isHideableHouse(i); })],
  ['a bracket printed (rule 4)', (x) => /[()]/.test(x.text)],
  ['the word "town" (rule 4)', (x) => /\btowns?\b/i.test(x.text)],
  ['a named house without its article (rule 4)', (x) => x.refs.some((ref) => !x.text.includes(`the ${institutionSentenceNoun(ref.label)}`))],
];

const by = (s) => rows.filter((x) => x.size === s);
const pct = (n) => Math.round((100 * n) / N);
const line = (label, f) => `| ${label} | ${SIZES.map((s) => f(s)).join(' | ')} |`;
console.log(`\n| row | ${SIZES.join(' | ')} |\n|---|${SIZES.map(() => '---:').join('|')}|`);
const top = (s) => { const c = new Map(); for (const x of by(s)) if (x.text) c.set(x.text, (c.get(x.text) || 0) + 1); return Math.max(0, ...c.values()); };
console.log(line('top single text % of 150', (s) => String(pct(top(s)))));
console.log(line('distinct texts', (s) => String(new Set(by(s).map((x) => x.text).filter(Boolean)).size)));
console.log(line('EMPTY (no true line)', (s) => String(by(s).filter((x) => !x.text).length)));
console.log(line('named branch (cites a house)', (s) => String(by(s).filter((x) => x.refs.length > 0).length)));
let falseTotal = 0;
for (const [clause, label, f] of M1_TESTS) {
  const hits = rows.filter(f); falseTotal += hits.length;
  console.log(`${line(`FALSE ${clause}: ${label}`, (s) => String(hits.filter((x) => x.size === s).length))}${hits[0] ? ` e.g. ${hits[0].seed}` : ''}`);
}
let houseTotal = 0;
for (const [label, f] of HOUSE_TESTS) {
  const hits = rows.filter(f); houseTotal += hits.length;
  console.log(`${line(label, (s) => String(hits.filter((x) => x.size === s).length))}${hits[0] ? ` e.g. ${hits[0].seed}` : ''}`);
}
console.log(`\nM1 FALSE-LINE TOTAL: ${falseTotal}`);
console.log(`HOUSE-RULE HITS TOTAL: ${houseTotal}`);

console.log('\n── the top text of each size ──');
for (const s of SIZES) {
  const c = new Map(); for (const x of by(s)) if (x.text) c.set(x.text, (c.get(x.text) || 0) + 1);
  const [t, n] = [...c.entries()].sort((a, b) => b[1] - a[1])[0] || ['(none)', 0];
  console.log(`${s}: ${n}/${N} "${t}"`);
}
console.log('\n── the named thorp M1 names (hxd-thorp-0) and a metropolis (hxd-metropolis-0) ──');
for (const seed of ['hxd-thorp-0', 'hxd-metropolis-0']) console.log(`${seed}: "${rows.find((x) => x.seed === seed).text}"`);
console.log(`\ndone in ${((Date.now() - t0) / 1000).toFixed(0)}s`);
