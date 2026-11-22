#!/usr/bin/env node
/**
 * RUN (from the repository root):
 *   node docs/chair/2026-11-20/content/daily/measures/B3/F2/measure.f2.mjs > docs/chair/2026-11-20/content/daily/measures/B3/F2/f2.out.txt 2>&1
 *
 * DAILY-3 · B3 F2 — crime55's four smugglers lines (K55_0 to K55_3, each beside `house: smuggling`), MEASURED ON THE
 * BUILT CODE (`src/domain/dailyLife.js`, pool `src/data/dailyLife/commonerResentmentsDm.js`). Measure only; the shape of
 * `measures/B3/F1/measure.f1.mjs`. Births: M1's (150 a size, seeds hxd-<size>-0..149). On the owner's read
 * (`{ audience: 'owner' }`) of `commoner_resentments_dm`, the crime55 branch (criminal opportunity >= 55 and < 70, the
 * deriver's ladder restated): the top single SENTENCE share by size AFTER (% of 150, F1's unit, and % of the branch's
 * places) and BEFORE (F1's `f1.out.txt`, restated here by the same keyed pick over the branch WITHOUT the four: its
 * top shares are F1's crime55 rows); each of K55_0..3's share by size; and the places printing a smugglers
 * line with no smuggling house standing (`facts/causeHouses.js :: causeHouseStands`, read directly: must be 0), with
 * each line's other needs read from their homes (gate, route open, market).
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
const { marketOf } = await import(`${L}/src/domain/facts/market.js`);
const { tradeRouteOf } = await import(`${L}/src/domain/facts/terrain.js`);
const { causeHouseStands } = await import(`${L}/src/domain/facts/causeHouses.js`);
const { pickVariantMixed } = await import(`${L}/src/kernel/proseHash.js`);
const { deriveCausalState } = await import(`${L}/src/domain/causalState.js`);

console.log('RE-RUN: node docs/chair/2026-11-20/content/daily/measures/B3/F2/measure.f2.mjs > docs/chair/2026-11-20/content/daily/measures/B3/F2/f2.out.txt 2>&1');
const SIZES = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
const N = 150;
const DM = 'commoner_resentments_dm';
const FOUR = ['K55_0', 'K55_1', 'K55_2', 'K55_3'];
const t0 = Date.now();
await loadGenerationLawPayloads();

const BEFORE_POOL = COMMONER_RESENTMENTS_DM.crime55.filter((l) => !FOUR.includes(l.id));
const T = {
  smuggling: (r) => causeHouseStands(r, 'smuggling') === true,
  gate: (r) => defenceOf(r).gate === true,
  market: (r) => marketOf(r) === true,
  routeOpen: (r) => !['', 'isolated', 'none'].includes(tradeRouteOf(r)),
};

const rows = [];
for (const size of SIZES) for (let i = 0; i < N; i++) {
  const seed = `hxd-${size}-${i}`;
  const rec = generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, settType: size }), null, { seed, customContent: {} });
  const crime = deriveCausalState(rec).scores.criminal_opportunity;
  const branch = crime >= 70 ? 'crime70' : crime >= 55 ? 'crime55' : null;
  const text = deriveDailyLife(rec, { audience: 'owner' }).slots[DM].text;
  const facts = factsOf(rec);
  const key = `${rec.name}::dailyLife.${DM}::crime55`;
  const after = branch === 'crime55' ? (pickVariantMixed(filterDeclared(COMMONER_RESENTMENTS_DM.crime55, { facts }), key)?.text ?? '') : null;
  const before = branch === 'crime55' ? (pickVariantMixed(filterDeclared(BEFORE_POOL, { facts }), key)?.text ?? '') : null;
  rows.push({ seed, size, rec, branch, text, after, before, house: T.smuggling(rec) });
}
console.log(`births: ${rows.length} (${N} a size, M1's recipe) in ${((Date.now() - t0) / 1000).toFixed(0)}s`);

const by = (s) => rows.filter((x) => x.size === s);
const c55 = (s) => by(s).filter((x) => x.branch === 'crime55');
const pct = (n, d = N) => (d ? Math.round((100 * n) / d) : 0);
const line = (label, f) => `| ${label} | ${SIZES.map((s) => f(s)).join(' | ')} |`;
const HDR = `| row | ${SIZES.join(' | ')} |\n|---|${SIZES.map(() => '---:').join('|')}|`;
const topOf = (xs, f) => { const c = new Map(); for (const x of xs) { const v = f(x); if (v) c.set(v, (c.get(v) || 0) + 1); } return [...c.entries()].sort((a, b) => b[1] - a[1])[0] || ['(none)', 0]; };

const off = rows.filter((x) => x.branch === 'crime55' && x.text !== x.after);
console.log(`the crime55 branch: ${rows.filter((x) => x.branch === 'crime55').length} places; a printed text not the branch's keyed pick of the admitted lines: ${off.length}${off[0] ? ` e.g. ${off[0].seed}` : ''}`);
console.log(`places holding a smuggling house (causeHouseStands): ${rows.filter((x) => x.house).length} of ${rows.length}; of the crime55 branch: ${rows.filter((x) => x.branch === 'crime55' && x.house).length}`);

console.log(`\n════ commoner_resentments_dm (the owner's read), the crime55 branch\n${HDR}`);
console.log(line('crime55 places (of 150)', (s) => String(c55(s).length)));
console.log(line('BEFORE top single SENTENCE % of 150 (the branch without the four; F1\'s unit)', (s) => String(pct(topOf(c55(s), (x) => x.before)[1]))));
console.log(line('AFTER top single SENTENCE % of 150', (s) => String(pct(topOf(c55(s), (x) => x.text)[1]))));
console.log(line('BEFORE top % of the branch\'s places', (s) => String(pct(topOf(c55(s), (x) => x.before)[1], c55(s).length))));
console.log(line('AFTER top % of the branch\'s places', (s) => String(pct(topOf(c55(s), (x) => x.text)[1], c55(s).length))));
for (const s of SIZES) {
  const [bt, bn] = topOf(c55(s), (x) => x.before); const [at, an] = topOf(c55(s), (x) => x.text);
  console.log(`  ${s}: BEFORE (${bn}/${N}) "${bt}" | AFTER (${an}/${N}) "${at}"`);
}

console.log(`\n════ K55_0 to K55_3: printed, and FALSE (printed where a need does not hold, read from its home)\n${HDR}`);
const NEEDS = { K55_0: [['no smuggling house', (r) => !T.smuggling(r)], ['no gate', (r) => !T.gate(r)], ['no route open', (r) => !T.routeOpen(r)]],
  K55_1: [['no smuggling house', (r) => !T.smuggling(r)], ['no market', (r) => !T.market(r)]],
  K55_2: [['no smuggling house', (r) => !T.smuggling(r)], ['no market', (r) => !T.market(r)]],
  K55_3: [['no smuggling house', (r) => !T.smuggling(r)], ['no route open', (r) => !T.routeOpen(r)]] };
let falseTotal = off.length;
for (const id of FOUR) {
  const t = COMMONER_RESENTMENTS_DM.crime55.find((l) => l.id === id).text;
  const said = rows.filter((x) => x.text === t);
  console.log(line(`${id} printed: % of 150 (count)`, (s) => { const n = said.filter((x) => x.size === s).length; return `${pct(n)} (${n})`; }));
  for (const [label, f] of NEEDS[id]) {
    const bad = said.filter((x) => f(x.rec)); falseTotal += bad.length;
    console.log(`${line(`FALSE ${id} printed with ${label}`, (s) => String(bad.filter((x) => x.size === s).length))}${bad[0] ? ` e.g. ${bad[0].seed}` : ''}`);
  }
}
const unhoused = rows.filter((x) => /smuggl/i.test(x.text) && !x.house); falseTotal += unhoused.length;
console.log(`${line('FALSE any /smuggl/ printed with no smuggling house standing', (s) => String(unhoused.filter((x) => x.size === s).length))}${unhoused[0] ? ` e.g. ${unhoused[0].seed}` : ''}`);
const outside = rows.filter((x) => /smuggl/i.test(x.text) && x.branch !== 'crime55'); falseTotal += outside.length;
console.log(`${line('FALSE any /smuggl/ printed off the crime55 branch', (s) => String(outside.filter((x) => x.size === s).length))}`);
console.log(`\nFALSE-LINE TOTAL (every FALSE row above, and the keyed-pick check): ${falseTotal}`);
console.log(`\ndone in ${((Date.now() - t0) / 1000).toFixed(0)}s`);
