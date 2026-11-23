#!/usr/bin/env node
/**
 * RUN (from the repository root):
 *   node docs/chair/2026-11-20/content/daily/measures/B3/E1/measure.e1.mjs > docs/chair/2026-11-20/content/daily/measures/B3/E1/e1.out.txt 2>&1
 *
 * DAILY-3 · B3 E1 — the owner-only `commoner_resentments_dm` (as the owner reads it: `deriveDailyLife(record, { audience:
 * 'owner' })`) and the public `commoner_resentments` (a no-audience read), MEASURED ON THE BUILT CODE
 * (`src/domain/dailyLife.js`, pool `src/data/dailyLife/commonerResentmentsDm.js`). Measure only; the shape of
 * `measures/B2/measure.b2.mjs`. Births: M1's (150 a size, seeds hxd-<size>-0..149), copied as B2 copies them.
 * Per slot and size: the top single SENTENCE share (% of 150), the top whole text, distinct texts, EMPTY, each dm branch's
 * reach and its eligible rows (min); the false lines by M1's every commoner_resentments test (`measures/M1/measure.m1.mjs`
 * rows 191-199, copied, applied by the clause printed, the dm slot read for the crime clause it now carries) and the dm
 * pool's own needs; the house checks (a hideable house named, a bracket, "town" at a place smaller than a town).
 */
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
const HERE = dirname(fileURLToPath(import.meta.url));
const L = resolve(HERE, '../../../../../../../..');

const { generateSettlementPipeline } = await import(`${L}/src/generators/generateSettlementPipeline.js`);
const { birthConfig, loadGenerationLawPayloads } = await import(`${L}/src/domain/density/densityCreateBoundary.js`);
const { DEFAULT_CONFIG } = await import(`${L}/src/store/configSlice.js`);
const { deriveDailyLife } = await import(`${L}/src/domain/dailyLife.js`);
const { COMMONER_RESENTMENTS_DM } = await import(`${L}/src/data/dailyLife/commonerResentmentsDm.js`);
const { filterDeclared } = await import(`${L}/src/domain/facts/drawDeclared.js`);
const { factsOf } = await import(`${L}/src/domain/facts/factsOf.js`);
const { defenceOf } = await import(`${L}/src/domain/facts/defence.js`);
const { hasInstitution } = await import(`${L}/src/domain/facts/institutions.js`);
const { marketOf } = await import(`${L}/src/domain/facts/market.js`);
const { rulingBodyOf } = await import(`${L}/src/domain/facts/rulingBody.js`);
const { isHideableHouse } = await import(`${L}/src/domain/people/cardVeil.js`);

console.log('RE-RUN: node docs/chair/2026-11-20/content/daily/measures/B3/E1/measure.e1.mjs > docs/chair/2026-11-20/content/daily/measures/B3/E1/e1.out.txt 2>&1');
const SIZES = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
const N = 150;
const DM = 'commoner_resentments_dm';
const t0 = Date.now();
await loadGenerationLawPayloads();
const rows = [];
for (const size of SIZES) for (let i = 0; i < N; i++) {
  const seed = `hxd-${size}-${i}`;
  const rec = generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, settType: size }), null, { seed, customContent: {} });
  const owner = deriveDailyLife(rec, { audience: 'owner' }).slots;
  const pub = deriveDailyLife(rec).slots;
  rows.push({ seed, size, rec, facts: factsOf(rec), dm: { text: owner[DM].text, refs: owner[DM].references }, pub: { text: pub.commoner_resentments.text, refs: pub.commoner_resentments.references }, keyOnPublic: Object.hasOwn(pub, DM) });
}
console.log(`births and slots: ${rows.length} (${N} a size, M1's recipe) in ${((Date.now() - t0) / 1000).toFixed(0)}s`);
console.log(`the dm key on a no-audience read: ${rows.filter((x) => x.keyOnPublic).length} of ${rows.length}`);

// ── the dm branch a printed text came from ──
const branchOf = (t) => Object.entries(COMMONER_RESENTMENTS_DM).find(([, pool]) => pool.some((l) => l.text === t))?.[0] ?? null;
for (const x of rows) x.dm.branch = x.dm.text ? branchOf(x.dm.text) : null;
console.log(`dm texts not traced to a pool line: ${rows.filter((x) => x.dm.text && !x.dm.branch).length}`);

// M1's record tests for this slot (copied from measure.m1.mjs)
const safe = (f, d = undefined) => { try { return f(); } catch { return d; } };
const T = {
  guard: (r) => safe(() => factsOf(r).guardPresence, false), watch: (r) => defenceOf(r).watch, gate: (r) => defenceOf(r).gate,
  market: (r) => marketOf(r), council: (r) => rulingBodyOf(r) === true, tavern: (r) => hasInstitution(r, 'tavern'),
  appointedPost: (r) => safe(() => factsOf(r).appointedPost, false), notTown: (r) => safe(() => factsOf(r).populationBand) === 'small',
};
const M1 = [
  ['dm', /blind eye/, 'no guard force: factsOf(r).guardPresence (M1 row 191, the clause now owner-only)', (r) => !T.guard(r)],
  ['dm', /\bthe watch\b/, 'no watch: defenceOf(r).watch (the pool\'s own need)', (r) => !T.watch(r)],
  ['dm', /those who keep order/, 'no guard force: factsOf(r).guardPresence (the pool\'s own need)', (r) => !T.guard(r)],
  ['dm', /smuggl/, 'no smuggling home (no line may say it)', () => true],
  ['pub', /blind eye|smugglers who pay no tax/, 'a crime clause on the public slot (ruling 6)', () => true],
  ['pub', /merchants who claim/, 'no market: marketOf(r) (M1 row 192)', (r) => !T.market(r)],
  ['pub', /the council's indifference/, 'not a council: rulingBodyOf(r) !== true (M1 row 193)', (r) => !T.council(r)],
  ['pub', /officials who keep their posts/, 'no appointed post (M1 row 194)', (r) => !T.appointedPost(r)],
  ['pub', /of any town/, 'not a town: populationBand small (M1 row 195)', (r) => T.notTown(r)],
  ['pub', /the gate fee/, 'no gate (M1 row 196)', (r) => !T.gate(r)],
  ['pub', /market day/, 'no market (M1 row 197)', (r) => !T.market(r)],
  ['pub', /the council's favorite/, 'not a council (M1 row 198)', (r) => !T.council(r)],
  ['pub', /favorite tavern/, 'no tavern/inn (M1 row 199)', (r) => !T.tavern(r)],
];
const rowOf = (rec, ref) => (Array.isArray(rec.institutions) ? rec.institutions : []).find((i) => (ref.id && i?.id === ref.id) || i?.name === ref.label);
const SMALLER_THAN_TOWN = new Set(['thorp', 'hamlet', 'village']);
const HOUSE = [
  ['a hideable house named (rule 6)', (s, x) => s.refs.filter((r) => r.type === 'institution').some((ref) => { const i = rowOf(x.rec, ref); return !!i && isHideableHouse(i); })],
  ['a bracket printed (rule 4)', (s) => /[()]/.test(s.text)],
  ['the word "town" at a place smaller than a town (rule 4)', (s, x) => SMALLER_THAN_TOWN.has(x.size) && /\btowns?\b/i.test(s.text)],
  ['the word "town" at any place', (s) => /\btowns?\b/i.test(s.text)],
];

const by = (s) => rows.filter((x) => x.size === s);
const pct = (n) => Math.round((100 * n) / N);
const line = (label, f) => `| ${label} | ${SIZES.map((s) => f(s)).join(' | ')} |`;
const HDR = `| row | ${SIZES.join(' | ')} |\n|---|${SIZES.map(() => '---:').join('|')}|`;
const sentences = (t) => (t ? t.split(/(?<=\.)\s+/).filter(Boolean) : []);
const topOf = (xs, f) => { const c = new Map(); for (const x of xs) for (const v of f(x)) c.set(v, (c.get(v) || 0) + 1); return [...c.entries()].sort((a, b) => b[1] - a[1])[0] || ['(none)', 0]; };
let falseTotal = 0, houseTotal = 0;
for (const [k, slot] of [['dm', 'commoner_resentments_dm (the owner\'s read)'], ['pub', 'commoner_resentments (public, no audience)']]) {
  console.log(`\n════ ${slot}\n${HDR}`);
  console.log(line('top single SENTENCE % of 150', (s) => String(pct(topOf(by(s), (x) => new Set(sentences(x[k].text)))[1]))));
  console.log(line('top whole text % of 150', (s) => String(pct(topOf(by(s), (x) => (x[k].text ? [x[k].text] : []))[1]))));
  console.log(line('distinct texts', (s) => String(new Set(by(s).map((x) => x[k].text).filter(Boolean)).size)));
  console.log(line('EMPTY (no true line)', (s) => String(by(s).filter((x) => !x[k].text).length)));
  if (k === 'dm') for (const b of Object.keys(COMMONER_RESENTMENTS_DM)) {
    console.log(line(`reach % / min eligible: ${b}`, (s) => {
      const xs = by(s).filter((x) => x.dm.branch === b);
      return xs.length ? `${pct(xs.length)} / ${Math.min(...xs.map((x) => filterDeclared(COMMONER_RESENTMENTS_DM[b], { facts: x.facts }).length))}` : '0 / —';
    }));
  }
  for (const [kk, re, label, f] of M1.filter((m) => m[0] === k)) {
    const hits = rows.filter((x) => re.test(x[kk].text) && f(x.rec)); falseTotal += hits.length;
    console.log(`${line(`FALSE ${re.source}: ${label}`, (s) => String(hits.filter((x) => x.size === s).length))}${hits[0] ? ` e.g. ${hits[0].seed}` : ''}`);
  }
  for (const [label, f] of HOUSE) {
    const hits = rows.filter((x) => f(x[k], x)); houseTotal += hits.length;
    console.log(`${line(label, (s) => String(hits.filter((x) => x.size === s).length))}${hits[0] ? ` e.g. ${hits[0].seed}` : ''}`);
  }
  for (const s of SIZES) { const [t, n] = topOf(by(s), (x) => new Set(sentences(x[k].text))); console.log(`  top sentence ${s} (${n}/${N}): "${t}"`); }
}
console.log(`\nFALSE-LINE TOTAL (both slots, every row above): ${falseTotal}\nHOUSE-RULE HITS TOTAL (both slots, every row above): ${houseTotal}`);
console.log('\n── M1\'s named places ──');
for (const seed of ['hxd-thorp-0', 'hxd-hamlet-0', 'hxd-hamlet-7', 'hxd-metropolis-0']) { const x = rows.find((r) => r.seed === seed); console.log(`${seed}: dm "${x.dm.text}" | public "${x.pub.text}"`); }
console.log(`\ndone in ${((Date.now() - t0) / 1000).toFixed(0)}s`);
