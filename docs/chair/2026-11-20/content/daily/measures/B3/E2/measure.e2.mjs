#!/usr/bin/env node
/**
 * RUN (from the repository root):
 *   node docs/chair/2026-11-20/content/daily/measures/B3/E2/measure.e2.mjs > docs/chair/2026-11-20/content/daily/measures/B3/E2/e2.out.txt 2>&1
 *
 * DAILY-3 · B3 E2 — the public `commoner_resentments` and `food_culture` (a no-audience read, `deriveDailyLife(record)`),
 * MEASURED ON THE BUILT CODE (`src/domain/dailyLife.js`, pools `src/data/dailyLife/commonerResentments.js` and
 * `src/data/dailyLife/foodCulture.js`). Measure only; the shape of `measures/B3/E1/measure.e1.mjs`. Births: M1's (150 a
 * size, seeds hxd-<size>-0..149). Per slot and size: the top single SENTENCE share (% of 150), the top whole text,
 * distinct texts, EMPTY, each branch's reach and its eligible rows (min, and the bar's need ceil(reach/15%)); the false
 * lines by M1's tests for these two slots (`measures/M1/measure.m1.mjs` rows 187-199, copied) and by the pools' own
 * declared needs (every printed sentence is its branch's keyed pick of the admitted lines); the house checks (a hideable
 * house named, a bracket, "town" at a place smaller than a town, a veiled power's name, a crime word).
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
const { filterDeclared } = await import(`${L}/src/domain/facts/drawDeclared.js`);
const { factsOf } = await import(`${L}/src/domain/facts/factsOf.js`);
const { defenceOf } = await import(`${L}/src/domain/facts/defence.js`);
const { hasInstitution } = await import(`${L}/src/domain/facts/institutions.js`);
const { marketOf } = await import(`${L}/src/domain/facts/market.js`);
const { rulingBodyOf } = await import(`${L}/src/domain/facts/rulingBody.js`);
const { tradeRouteOf } = await import(`${L}/src/domain/facts/terrain.js`);
const { isHideableHouse, isVeiledPower } = await import(`${L}/src/domain/people/cardVeil.js`);
const { pickVariantMixed } = await import(`${L}/src/kernel/proseHash.js`);
const { fillAgreement, powerNameWithArticle } = await import(`${L}/src/domain/display/powerSentenceName.js`);
const { deriveAllThreatProfiles } = await import(`${L}/src/domain/threatProfile.js`);
const { deriveAllCapacities } = await import(`${L}/src/domain/capacityModel.js`);
const { deriveCausalState } = await import(`${L}/src/domain/causalState.js`);

console.log('RE-RUN: node docs/chair/2026-11-20/content/daily/measures/B3/E2/measure.e2.mjs > docs/chair/2026-11-20/content/daily/measures/B3/E2/e2.out.txt 2>&1');
const SIZES = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
const N = 150;
const BAD = ['strained', 'critical', 'collapsed'];
const t0 = Date.now();
await loadGenerationLawPayloads();

/** the branches the record puts each slot on (the deriver's rule, restated) */
function branchesOf(rec) {
  const band = deriveAllCapacities(rec).capacities.food_production.band;
  const wanting = deriveAllThreatProfiles(rec).some((t) => t.type === 'famine' || t.type === 'siege');
  const food = band === 'surplus' ? (wanting ? 'surplus.wanting' : 'surplus') : ['adequate', 'strained', 'critical'].includes(band) ? band : 'collapsed';
  const resent = [];
  if (BAD.includes(deriveCausalState(rec).bands.public_legitimacy)) resent.push('legitimacy');
  if (BAD.includes(band)) resent.push('food');
  if (factsOf(rec).uprising === true) resent.push('uprising');
  return { food, resent };
}

const rows = [];
for (const size of SIZES) for (let i = 0; i < N; i++) {
  const seed = `hxd-${size}-${i}`;
  const rec = generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, settType: size }), null, { seed, customContent: {} });
  const slots = deriveDailyLife(rec).slots;
  const facts = factsOf(rec);
  const gov = String(rec.powerStructure?.government ?? '');
  const say = (t) => fillAgreement(t, { gov }).replace(/\{gov\}/g, powerNameWithArticle(gov));
  const { food, resent } = branchesOf(rec);
  const elig = (pools, b) => filterDeclared(pools[b], { facts });
  const expected = (slot, pools, b) => { const p = pickVariantMixed(elig(pools, b), `${rec.name}::dailyLife.${slot}::${b}`); return p ? say(p.text) : ''; };
  rows.push({
    seed, size, rec, gov,
    food: { text: slots.food_culture.text, refs: slots.food_culture.references, branches: [food], eligible: { [food]: elig(FOOD_CULTURE, food).length },
      expected: expected('food_culture', FOOD_CULTURE, food) },
    resent: { text: slots.commoner_resentments.text, refs: slots.commoner_resentments.references, branches: resent,
      eligible: Object.fromEntries(resent.map((b) => [b, elig(COMMONER_RESENTMENTS, b).length])),
      expected: resent.map((b) => expected('commoner_resentments', COMMONER_RESENTMENTS, b)).filter(Boolean).join(' ') },
  });
}
console.log(`births and slots: ${rows.length} (${N} a size, M1's recipe) in ${((Date.now() - t0) / 1000).toFixed(0)}s`);

const safe = (f, d = undefined) => { try { return f(); } catch { return d; } };
const T = {
  gate: (r) => defenceOf(r).gate, market: (r) => marketOf(r), council: (r) => rulingBodyOf(r) === true, tavern: (r) => hasInstitution(r, 'tavern'),
  sacred: (r) => safe(() => factsOf(r).sacredHouse, false), smallPlace: (r) => r.tier === 'thorp' || r.tier === 'hamlet',
  notTown: (r) => safe(() => factsOf(r).populationBand) === 'small', routeNone: (r) => ['', 'isolated', 'none'].includes(tradeRouteOf(r)),
  appointedPost: (r) => safe(() => factsOf(r).appointedPost, false), guard: (r) => safe(() => factsOf(r).guardPresence, false),
};
const M1 = [
  ['food', /markets close their stalls/, 'no market (M1 row 187)', (r) => !T.market(r)],
  ['food', /the wealthier streets/, 'a thorp or hamlet (M1 row 188)', (r) => T.smallPlace(r)],
  ['food', /temple kitchens/, 'no sacred house (M1 row 189)', (r) => !T.sacred(r)],
  ['food', /caravans that never arrived/, 'no trade route (M1 row 190)', (r) => T.routeNone(r)],
  ['resent', /blind eye|smuggl/, 'a crime clause on the public slot (ruling 6)', () => true],
  ['resent', /merchants who claim/, 'no market (M1 row 192)', (r) => !T.market(r)],
  ['resent', /the council's indifference/, 'not a council: rulingBodyOf(r) !== true (M1 row 193)', (r) => !T.council(r)],
  ['resent', /officials who keep their posts/, 'no appointed post (M1 row 194)', (r) => !T.appointedPost(r)],
  ['resent', /of any town/, 'not a town: populationBand small (M1 row 195)', (r) => T.notTown(r)],
  ['resent', /the gate fee/, 'no gate (M1 row 196)', (r) => !T.gate(r)],
  ['resent', /market day/, 'no market (M1 row 197)', (r) => !T.market(r)],
  ['resent', /the council's favorite/, 'not a council (M1 row 198)', (r) => !T.council(r)],
  ['resent', /favorite tavern/, 'no tavern/inn (M1 row 199)', (r) => !T.tavern(r)],
  ['resent', /\bthe council\b/, 'not a council (the pool\'s own need)', (r) => !T.council(r)],
  ['resent', /price of food|\bstalls\b/, 'no market (the pool\'s own need)', (r) => !T.market(r)],
  ['food', /\bmarket|\bbought\b/, 'no market (the pool\'s own need)', (r) => !T.market(r)],
  ['food', /\bstreets\b|better-off/, 'a thorp or hamlet (the pool\'s own need)', (r) => T.smallPlace(r)],
];
const rowOf = (rec, ref) => (Array.isArray(rec.institutions) ? rec.institutions : []).find((i) => (ref.id && i?.id === ref.id) || i?.name === ref.label);
const SMALLER_THAN_TOWN = new Set(['thorp', 'hamlet', 'village']);
const veiledNames = (rec) => (Array.isArray(rec.powerStructure?.factions) ? rec.powerStructure.factions : []).filter((f) => isVeiledPower(f)).map((f) => String(f.faction || f.name || '')).filter(Boolean);
const HOUSE = [
  ['a printed text not its branch\'s keyed pick of the admitted lines (declared needs)', (s) => s.text !== s.expected],
  ['a hideable house named (rule 6)', (s, x) => s.refs.filter((r) => r.type === 'institution').some((ref) => { const i = rowOf(x.rec, ref); return !!i && isHideableHouse(i); })],
  ['a veiled power\'s name printed (ruling 7)', (s, x) => veiledNames(x.rec).some((n) => s.text.includes(n))],
  ['a crime word (crim|smuggl|corrupt|thie|brib|black market) printed', (s) => /\bcrim|\bsmuggl|\bcorrupt|\bthie(?:f|ves)\b|\bbrib|\bblack market/i.test(s.text)],
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
for (const [k, slot, pools] of [['food', 'food_culture', FOOD_CULTURE], ['resent', 'commoner_resentments (public, no audience)', COMMONER_RESENTMENTS]]) {
  console.log(`\n════ ${slot}\n${HDR}`);
  console.log(line('top single SENTENCE % of 150', (s) => String(pct(topOf(by(s), (x) => new Set(sentences(x[k].text)))[1]))));
  console.log(line('top whole text % of 150', (s) => String(pct(topOf(by(s), (x) => (x[k].text ? [x[k].text] : []))[1]))));
  console.log(line('distinct texts', (s) => String(new Set(by(s).map((x) => x[k].text).filter(Boolean)).size)));
  console.log(line('EMPTY (no true line)', (s) => String(by(s).filter((x) => !x[k].text).length)));
  console.log(line('EMPTY % of 150', (s) => String(pct(by(s).filter((x) => !x[k].text).length))));
  for (const b of Object.keys(pools)) {
    console.log(line(`reach % / min eligible / bar's need: ${b}`, (s) => {
      const xs = by(s).filter((x) => x[k].branches.includes(b));
      return xs.length ? `${pct(xs.length)} / ${Math.min(...xs.map((x) => x[k].eligible[b]))} / ${Math.ceil(pct(xs.length) / 15)}` : '0 / — / 0';
    }));
  }
  for (const b of Object.keys(pools)) {
    console.log(line(`places on ${b} with NO eligible line (that part EMPTY)`, (s) => String(by(s).filter((x) => x[k].branches.includes(b) && x[k].eligible[b] === 0).length)));
  }
  for (const [kk, re, label, f] of M1.filter((m) => m[0] === k)) {
    const hits = rows.filter((x) => re.test(x[kk].text) && f(x.rec)); falseTotal += hits.length;
    console.log(`${line(`FALSE ${re.source}: ${label}`, (s) => String(hits.filter((x) => x.size === s).length))}${hits[0] ? ` e.g. ${hits[0].seed}` : ''}`);
  }
  for (const [label, f] of HOUSE) {
    const hits = rows.filter((x) => f(x[k], x)); houseTotal += hits.length;
    console.log(`${line(label, (s) => String(hits.filter((x) => x.size === s).length))}${hits[0] ? ` e.g. ${hits[0].seed}: "${hits[0][k].text}"` : ''}`);
  }
  for (const s of SIZES) { const [t, n] = topOf(by(s), (x) => new Set(sentences(x[k].text))); console.log(`  top sentence ${s} (${n}/${N}): "${t}"`); }
}
console.log(`\nFALSE-LINE TOTAL (both slots, every FALSE row above): ${falseTotal}\nHOUSE-RULE HITS TOTAL (both slots, every rule row above): ${houseTotal}`);
console.log('\n── the government label said in a {gov} line ──');
const govSaid = rows.filter((x) => x.gov && x.resent.text.includes(powerNameWithArticle(x.gov)));
console.log(`places whose commoner_resentments names the government: ${govSaid.length} of ${rows.length}`);
const crimGov = govSaid.filter((x) => /corrupt|shadow/i.test(x.gov));
console.log(`of them, a criminal archetype's label (Corrupt Council / Corrupt City Council / Shadow Senate): ${crimGov.length}${crimGov[0] ? ` e.g. ${crimGov[0].seed}: "${crimGov[0].resent.text}"` : ''}`);
console.log('\n── M1\'s named places ──');
for (const seed of ['hxd-thorp-0', 'hxd-hamlet-0', 'hxd-hamlet-7', 'hxd-metropolis-0']) { const x = rows.find((r) => r.seed === seed); console.log(`${seed}: food "${x.food.text}" | resent "${x.resent.text}"`); }
console.log(`\ndone in ${((Date.now() - t0) / 1000).toFixed(0)}s`);
