#!/usr/bin/env node
/**
 * RUN (from the repository root):
 *   node docs/chair/2026-11-20/content/daily/measures/B3/F1/measure.f1.mjs > docs/chair/2026-11-20/content/daily/measures/B3/F1/f1.out.txt 2>&1
 *
 * DAILY-3 · B3 F1 — the chair's six pool lines (food A4, A12, T9, C5; resentments F0; the owner's crime70 K70_4),
 * MEASURED ON THE BUILT CODE (`src/domain/dailyLife.js`, pools `src/data/dailyLife/foodCulture.js`,
 * `commonerResentments.js`, `commonerResentmentsDm.js`). Measure only; the shape of `measures/B3/E2/measure.e2.mjs`.
 * Births: M1's (150 a size, seeds hxd-<size>-0..149). For `food_culture`, `commoner_resentments` (a no-audience read) and
 * the owner's `commoner_resentments_dm` (`{ audience: 'owner' }`): the top single SENTENCE share (% of 150) and EMPTY by
 * size; the false lines (M1's record tests for these slots, copied from E1's and E2's measures, and every printed text
 * against its branch's keyed pick of the admitted lines); and for each of T9, C5, F0, A12 the share of places of each
 * size printing it and the count of those whose record holds no grain (F0 also no market; A12 no import of grain), read
 * from the fact homes directly.
 */
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
const HERE = dirname(fileURLToPath(import.meta.url));
const L = resolve(HERE, '../../../../../../../..');

const { generateSettlementPipeline } = await import(`${L}/src/generators/generateSettlementPipeline.js`);
const { birthConfig, loadGenerationLawPayloads } = await import(`${L}/src/domain/density/densityCreateBoundary.js`);
const { DEFAULT_CONFIG } = await import(`${L}/src/store/configSlice.js`);
const { deriveDailyLife } = await import(`${L}/src/domain/dailyLife.js`);
const { FOOD_CULTURE } = await import(`${L}/src/data/dailyLife/foodCulture.js`);
const { COMMONER_RESENTMENTS } = await import(`${L}/src/data/dailyLife/commonerResentments.js`);
const { COMMONER_RESENTMENTS_DM } = await import(`${L}/src/data/dailyLife/commonerResentmentsDm.js`);
const { filterDeclared } = await import(`${L}/src/domain/facts/drawDeclared.js`);
const { factsOf } = await import(`${L}/src/domain/facts/factsOf.js`);
const { defenceOf } = await import(`${L}/src/domain/facts/defence.js`);
const { hasInstitution } = await import(`${L}/src/domain/facts/institutions.js`);
const { marketOf } = await import(`${L}/src/domain/facts/market.js`);
const { rulingBodyOf } = await import(`${L}/src/domain/facts/rulingBody.js`);
const { tradeRouteOf } = await import(`${L}/src/domain/facts/terrain.js`);
const { pickVariantMixed } = await import(`${L}/src/kernel/proseHash.js`);
const { fillAgreement, powerNameWithArticle } = await import(`${L}/src/domain/display/powerSentenceName.js`);
const { deriveAllThreatProfiles } = await import(`${L}/src/domain/threatProfile.js`);
const { deriveAllCapacities } = await import(`${L}/src/domain/capacityModel.js`);
const { deriveCausalState } = await import(`${L}/src/domain/causalState.js`);

console.log('RE-RUN: node docs/chair/2026-11-20/content/daily/measures/B3/F1/measure.f1.mjs > docs/chair/2026-11-20/content/daily/measures/B3/F1/f1.out.txt 2>&1');
const SIZES = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
const N = 150;
const BAD = ['strained', 'critical', 'collapsed'];
const DM = 'commoner_resentments_dm';
const t0 = Date.now();
await loadGenerationLawPayloads();

/** the branches the record puts each slot on (the deriver's rule, restated, as E2's measure) */
function branchesOf(rec) {
  const band = deriveAllCapacities(rec).capacities.food_production.band;
  const wanting = deriveAllThreatProfiles(rec).some((t) => t.type === 'famine' || t.type === 'siege');
  const food = band === 'surplus' ? (wanting ? 'surplus.wanting' : 'surplus') : ['adequate', 'strained', 'critical'].includes(band) ? band : 'collapsed';
  const resent = [];
  if (BAD.includes(deriveCausalState(rec).bands.public_legitimacy)) resent.push('legitimacy');
  if (BAD.includes(band)) resent.push('food');
  if (factsOf(rec).uprising === true) resent.push('uprising');
  const crime = deriveCausalState(rec).scores.criminal_opportunity;
  const dm = crime >= 70 ? 'crime70' : crime >= 55 ? 'crime55' : null;
  return { food, resent, dm };
}

const rows = [];
for (const size of SIZES) for (let i = 0; i < N; i++) {
  const seed = `hxd-${size}-${i}`;
  const rec = generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, settType: size }), null, { seed, customContent: {} });
  const pub = deriveDailyLife(rec).slots;
  const owner = deriveDailyLife(rec, { audience: 'owner' }).slots;
  const facts = factsOf(rec);
  const gov = String(rec.powerStructure?.government ?? '');
  const say = (t) => fillAgreement(t, { gov }).replace(/\{gov\}/g, powerNameWithArticle(gov));
  const { food, resent, dm } = branchesOf(rec);
  const expected = (slot, pools, b) => { const p = pickVariantMixed(filterDeclared(pools[b], { facts }), `${rec.name}::dailyLife.${slot}::${b}`); return p ? say(p.text) : ''; };
  rows.push({
    seed, size, rec,
    food: { text: pub.food_culture.text, expected: expected('food_culture', FOOD_CULTURE, food) },
    resent: { text: pub.commoner_resentments.text, expected: resent.map((b) => expected('commoner_resentments', COMMONER_RESENTMENTS, b)).filter(Boolean).join(' ') },
    dm: { text: owner[DM].text, expected: dm ? expected(DM, COMMONER_RESENTMENTS_DM, dm) : '' },
    keyOnPublic: Object.hasOwn(pub, DM),
  });
}
console.log(`births and slots: ${rows.length} (${N} a size, M1's recipe) in ${((Date.now() - t0) / 1000).toFixed(0)}s`);
console.log(`the dm key on the owner's read: ${rows.filter((x) => typeof x.dm.text === 'string').length} of ${rows.length}; on a no-audience read: ${rows.filter((x) => x.keyOnPublic).length} of ${rows.length}`);

const safe = (f, d = undefined) => { try { return f(); } catch { return d; } };
const T = {
  gate: (r) => defenceOf(r).gate, watch: (r) => defenceOf(r).watch, market: (r) => marketOf(r) === true, council: (r) => rulingBodyOf(r) === true,
  tavern: (r) => hasInstitution(r, 'tavern'), sacred: (r) => safe(() => factsOf(r).sacredHouse, false),
  smallPlace: (r) => r.tier === 'thorp' || r.tier === 'hamlet', notTown: (r) => safe(() => factsOf(r).populationBand) === 'small',
  routeNone: (r) => ['', 'isolated', 'none'].includes(tradeRouteOf(r)), guard: (r) => safe(() => factsOf(r).guardPresence, false),
  grain: (r) => (factsOf(r).foodSources ?? []).includes('grain'),
  grainImported: (r) => (factsOf(r).imports ?? []).some((g) => typeof g === 'string' && /\bgrain\b/i.test(g)),
};
const FALSE = [
  ['food', /markets close their stalls/, 'no market (M1 row 187)', (r) => !T.market(r)],
  ['food', /the wealthier streets/, 'a thorp or hamlet (M1 row 188)', (r) => T.smallPlace(r)],
  ['food', /temple kitchens/, 'no sacred house (M1 row 189)', (r) => !T.sacred(r)],
  ['food', /caravans that never arrived/, 'no trade route (M1 row 190)', (r) => T.routeNone(r)],
  ['food', /\bmarket|\bbought\b/, 'no market, save A12\'s "bought in" (the pool\'s own need)', (r) => !T.market(r), (t) => t.replace('The grain is bought in, not grown here, so bread is never wasted.', '')],
  ['food', /\bbread\b|\bloaf\b|\bgrain\b/, 'no grain grown and no import of grain (the pool\'s own needs)', (r) => !T.grain(r) && !T.grainImported(r)],
  ['food', /\bstreets\b|better-off/, 'a thorp or hamlet (the pool\'s own need)', (r) => T.smallPlace(r)],
  ['resent', /blind eye|smuggl|the law here bends/, 'a crime clause on the public slot (ruling 6)', () => true],
  ['resent', /merchants who claim/, 'no market (M1 row 192)', (r) => !T.market(r)],
  ['resent', /bread prices/, 'no grain (the pool\'s own need)', (r) => !T.grain(r)],
  ['resent', /the council's indifference/, 'not a council (M1 row 193)', (r) => !T.council(r)],
  ['resent', /of any town/, 'populationBand small (M1 row 195)', (r) => T.notTown(r)],
  ['resent', /the gate fee/, 'no gate (M1 row 196)', (r) => !T.gate(r)],
  ['resent', /market day/, 'no market (M1 row 197)', (r) => !T.market(r)],
  ['resent', /the council's favorite/, 'not a council (M1 row 198)', (r) => !T.council(r)],
  ['resent', /favorite tavern/, 'no tavern/inn (M1 row 199)', (r) => !T.tavern(r)],
  ['resent', /\bthe council\b/, 'not a council (the pool\'s own need)', (r) => !T.council(r)],
  ['resent', /price of food|\bstalls\b/, 'no market (the pool\'s own need)', (r) => !T.market(r)],
  ['dm', /blind eye/, 'no guard force (M1 row 191, owner-only)', (r) => !T.guard(r)],
  ['dm', /\bthe watch\b/, 'no watch (the pool\'s own need)', (r) => !T.watch(r)],
  ['dm', /those who keep order/, 'no guard force (the pool\'s own need)', (r) => !T.guard(r)],
  ['dm', /smuggl/, 'no smuggling home (no line may say it)', () => true],
];

const by = (s) => rows.filter((x) => x.size === s);
const pct = (n, d = N) => Math.round((100 * n) / d);
const line = (label, f) => `| ${label} | ${SIZES.map((s) => f(s)).join(' | ')} |`;
const HDR = `| row | ${SIZES.join(' | ')} |\n|---|${SIZES.map(() => '---:').join('|')}|`;
const sentences = (t) => (t ? t.split(/(?<=\.)\s+/).filter(Boolean) : []);
const topOf = (xs, f) => { const c = new Map(); for (const x of xs) for (const v of f(x)) c.set(v, (c.get(v) || 0) + 1); return [...c.entries()].sort((a, b) => b[1] - a[1])[0] || ['(none)', 0]; };
let falseTotal = 0;
for (const [k, slot] of [['food', 'food_culture (public, no audience)'], ['resent', 'commoner_resentments (public, no audience)'], ['dm', 'commoner_resentments_dm (the owner\'s read)']]) {
  console.log(`\n════ ${slot}\n${HDR}`);
  console.log(line('top single SENTENCE % of 150', (s) => String(pct(topOf(by(s), (x) => new Set(sentences(x[k].text)))[1]))));
  console.log(line('EMPTY (no true line)', (s) => String(by(s).filter((x) => !x[k].text).length)));
  console.log(line('EMPTY % of 150', (s) => String(pct(by(s).filter((x) => !x[k].text).length))));
  const off = rows.filter((x) => x[k].text !== x[k].expected); falseTotal += off.length;
  console.log(`${line('FALSE a printed text not its branch\'s keyed pick of the admitted lines (declared needs)', (s) => String(off.filter((x) => x.size === s).length))}${off[0] ? ` e.g. ${off[0].seed}` : ''}`);
  for (const [, re, label, f, strip] of FALSE.filter((m) => m[0] === k)) {
    const hits = rows.filter((x) => re.test(strip ? strip(x[k].text) : x[k].text) && f(x.rec)); falseTotal += hits.length;
    console.log(`${line(`FALSE ${re.source}: ${label}`, (s) => String(hits.filter((x) => x.size === s).length))}${hits[0] ? ` e.g. ${hits[0].seed}: "${hits[0][k].text}"` : ''}`);
  }
  for (const s of SIZES) { const [t, n] = topOf(by(s), (x) => new Set(sentences(x[k].text))); console.log(`  top sentence ${s} (${n}/${N}): "${t}"`); }
}

console.log(`\n════ the chair's lines of B3 F1\n${HDR}`);
const text = (pools, b, id) => pools[b].find((l) => l.id === id).text;
const LINES = [
  ['T9', 'food', text(FOOD_CULTURE, 'strained', 'T9'), [['no grain', (r) => !T.grain(r)]]],
  ['C5', 'food', text(FOOD_CULTURE, 'critical', 'C5'), [['no grain', (r) => !T.grain(r)]]],
  ['F0', 'resent', text(COMMONER_RESENTMENTS, 'food', 'F0'), [['no grain', (r) => !T.grain(r)], ['no market', (r) => !T.market(r)]]],
  ['A12', 'food', text(FOOD_CULTURE, 'adequate', 'A12'), [['no import of grain', (r) => !T.grainImported(r)]]],
  ['A4', 'food', text(FOOD_CULTURE, 'adequate', 'A4'), []],
  ['K70_4', 'dm', text(COMMONER_RESENTMENTS_DM, 'crime70', 'K70_4'), []],
];
for (const [id, k, t, tests] of LINES) {
  const said = rows.filter((x) => x[k].text.includes(t));
  console.log(line(`${id} printed: % of 150 (count)`, (s) => { const n = said.filter((x) => x.size === s).length; return `${pct(n)} (${n})`; }));
  for (const [label, f] of tests) {
    const bad = said.filter((x) => f(x.rec)); falseTotal += bad.length;
    console.log(`${line(`FALSE ${id} printed with ${label}`, (s) => String(bad.filter((x) => x.size === s).length))}${bad[0] ? ` e.g. ${bad[0].seed}` : ''}`);
  }
}
console.log(`\nFALSE-LINE TOTAL (all three slots and the six lines, every FALSE row above): ${falseTotal}`);
console.log('\n── M1\'s named places ──');
for (const seed of ['hxd-thorp-0', 'hxd-hamlet-0', 'hxd-hamlet-7', 'hxd-metropolis-0']) { const x = rows.find((r) => r.seed === seed); console.log(`${seed}: food "${x.food.text}" | resent "${x.resent.text}" | dm "${x.dm.text}"`); }
console.log(`\ndone in ${((Date.now() - t0) / 1000).toFixed(0)}s`);
