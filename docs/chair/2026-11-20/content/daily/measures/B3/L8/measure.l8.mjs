#!/usr/bin/env node
/**
 * RUN (from the repository root, through the mutex, to the out file, never through a pipe):
 *   sh scripts/gate-mutex.sh --run -- node docs/chair/2026-11-20/content/daily/measures/B3/L8/measure.l8.mjs > docs/chair/2026-11-20/content/daily/measures/B3/L8/l8.out.txt 2>&1
 *
 * DAILY-3 · B3 L8 — the five `office:` atoms (`src/domain/facts/officeForms.js`, the lazy leaf read through
 * `factsOf(record).office`) and legitimacy L8 to L12 (`src/data/dailyLife/commonerResentments.js`), MEASURED ON THE
 * BUILT CODE. Measure only; the shape of `measures/B3/F1/measure.f1.mjs`. Births: M1's (150 a size, seeds
 * hxd-<size>-0..149). For `commoner_resentments` (a no-audience read): the top single SENTENCE share (% of 150) and EMPTY
 * by size, AFTER (the deriver as built) and BEFORE (the same keyed pick over the admitted lines with L8..L12 taken out of
 * the legitimacy pool: the base's pool, so the base's text); the route check (every printed text is its branches' keyed
 * picks); L8..L12's share by size; FALSE (a line printed where its office does not hold); the five atoms' share by size
 * beside `measures/OFFICE`'s (dark, point 97). The coordinator's addition (count only, no cure): L9 printed on a place
 * that also prints `dawn_work` W11 or B19 or `gathering_places` P13 (the three `ruler: elder` lines naming the elder).
 */
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
const HERE = dirname(fileURLToPath(import.meta.url));
const L = resolve(HERE, '../../../../../../../..');

const { generateSettlementPipeline } = await import(`${L}/src/generators/generateSettlementPipeline.js`);
const { birthConfig, loadGenerationLawPayloads } = await import(`${L}/src/domain/density/densityCreateBoundary.js`);
const { DEFAULT_CONFIG } = await import(`${L}/src/store/configSlice.js`);
const { deriveDailyLife } = await import(`${L}/src/domain/dailyLife.js`);
const { COMMONER_RESENTMENTS } = await import(`${L}/src/data/dailyLife/commonerResentments.js`);
const { DAWN_WORK } = await import(`${L}/src/data/dailyLife/dawnWork.js`);
const { GATHERING_NAMED, GATHERING_PLAIN } = await import(`${L}/src/data/dailyLife/gatheringPlaces.js`);
const { filterDeclared } = await import(`${L}/src/domain/facts/drawDeclared.js`);
const { factsOf } = await import(`${L}/src/domain/facts/factsOf.js`);
const { atomHolds } = await import(`${L}/src/domain/facts/factVocabulary.js`);
const { pickVariantMixed } = await import(`${L}/src/kernel/proseHash.js`);
const { fillAgreement, powerNameWithArticle } = await import(`${L}/src/domain/display/powerSentenceName.js`);
const { deriveAllCapacities } = await import(`${L}/src/domain/capacityModel.js`);
const { deriveCausalState } = await import(`${L}/src/domain/causalState.js`);
const { REGISTERED_WORDS } = await import(`${L}/src/domain/facts/registeredWords.js`);
const { liveInstitutionNames } = await import(`${L}/src/domain/facts/liveInstitutionNames.js`);

console.log('RE-RUN: sh scripts/gate-mutex.sh --run -- node docs/chair/2026-11-20/content/daily/measures/B3/L8/measure.l8.mjs > docs/chair/2026-11-20/content/daily/measures/B3/L8/l8.out.txt 2>&1');
const SIZES = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
const N = 150;
const BAD = ['strained', 'critical', 'collapsed'];
const KEYS = ['elders', 'headman', 'mayor', 'reeve', "lord's steward"];
const IDS = ['L8', 'L9', 'L10', 'L11', 'L12'];
/** `measures/OFFICE/office.out.txt` § 3, DARK (point 97, 1ec3e81d1): the candidate atom's share by size. */
const OFFICE_M = {
  elders: '90.0% 68.0% 70.7% 0.0% 0.0% 0.0%', headman: '0.0% 19.3% 8.0% 0.0% 0.0% 0.0%', mayor: '0.0% 0.0% 0.0% 37.3% 0.0% 0.0%',
  reeve: '0.0% 0.0% 14.0% 0.0% 0.0% 0.0%', "lord's steward": '10.0% 12.7% 7.3% 0.0% 0.0% 0.0%',
};
/** [the walker's thing, the office whose line it strikes, the line] (presumedThings ARM 1; presumptionClasses `sovereign:none`). */
const STRUCK = [['house: headman', 'headman', 'L9'], ['house: reeve', 'reeve', 'L11'], ["house: lord's steward", "lord's steward", 'L12'], ['sovereign', "lord's steward", 'L12']];
const t0 = Date.now();
await loadGenerationLawPayloads();

const legit = COMMONER_RESENTMENTS.legitimacy;
const LINE = Object.fromEntries(IDS.map((id) => [id, legit.find((l) => l.id === id)]));
for (const id of IDS) if (!LINE[id]) throw new Error(`measure: ${id} is not in the legitimacy pool`);
const BEFORE_POOLS = { ...COMMONER_RESENTMENTS, legitimacy: legit.filter((l) => !IDS.includes(l.id)) };
const allLines = (pools) => Object.values(pools).flatMap((v) => (Array.isArray(v) ? v : []));
const textOfId = (pools, id) => allLines(pools).find((l) => l?.id === id)?.text ?? null;
const ELDER_DOOR = { W11: textOfId(DAWN_WORK, 'W11'), B19: textOfId(DAWN_WORK, 'B19'), P13: textOfId({ GATHERING_NAMED, GATHERING_PLAIN }, 'P13') };
for (const [id, t] of Object.entries(ELDER_DOOR)) if (!t) throw new Error(`measure: ${id} not found`);

/** the branches the record puts commoner_resentments on (the deriver's rule, restated, as F1's measure) */
function resentBranchesOf(rec) {
  const band = deriveAllCapacities(rec).capacities.food_production.band;
  const out = [];
  if (BAD.includes(deriveCausalState(rec).bands.public_legitimacy)) out.push('legitimacy');
  if (BAD.includes(band)) out.push('food');
  if (factsOf(rec).uprising === true) out.push('uprising');
  return out;
}

const rows = [];
for (const size of SIZES) for (let i = 0; i < N; i++) {
  const seed = `hxd-${size}-${i}`;
  const rec = generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, settType: size }), null, { seed, customContent: {} });
  const slots = deriveDailyLife(rec).slots;
  const facts = factsOf(rec);
  const gov = String(rec.powerStructure?.government ?? '');
  const say = (t) => fillAgreement(t, { gov }).replace(/\{gov\}/g, powerNameWithArticle(gov));
  const branches = resentBranchesOf(rec);
  const pickOf = (pools) => branches.map((b) => { const p = pickVariantMixed(filterDeclared(pools[b], { facts }), `${rec.name}::dailyLife.commoner_resentments::${b}`); return p ? say(p.text) : ''; }).filter(Boolean).join(' ');
  rows.push({
    seed, size,
    after: slots.commoner_resentments.text, expected: pickOf(COMMONER_RESENTMENTS), before: pickOf(BEFORE_POOLS),
    office: Object.fromEntries(KEYS.map((k) => [k, atomHolds(`office: ${k}`, facts) === true])),
    legitimacy: branches.includes('legitimacy'),
    dawn: slots.dawn_work.text, gathering: slots.gathering_places.text,
    // THE WALKERS' STRIKES (presumedThings ARM 1, presumptionClasses): the rule book's own `absent` readers, per place
    struck: Object.fromEntries(STRUCK.map(([thing]) => [thing, thing === 'sovereign' ? facts.sovereign !== true
      : REGISTERED_WORDS[thing].absent(facts, liveInstitutionNames(rec), rec) === true])),
  });
}
console.log(`births and slots: ${rows.length} (${N} a size, M1's recipe) in ${((Date.now() - t0) / 1000).toFixed(0)}s`);

const by = (s) => rows.filter((x) => x.size === s);
const pct = (n, d = N) => Math.round((100 * n) / d);
const pct1 = (n, d = N) => `${((100 * n) / d).toFixed(1)}%`;
const line = (label, f) => `| ${label} | ${SIZES.map((s) => f(s)).join(' | ')} |`;
const HDR = `| row | ${SIZES.join(' | ')} |\n|---|${SIZES.map(() => '---:').join('|')}|`;
const sentences = (t) => (t ? t.split(/(?<=\.)\s+/).filter(Boolean) : []);
const topOf = (xs, f) => { const c = new Map(); for (const x of xs) for (const v of f(x)) c.set(v, (c.get(v) || 0) + 1); return [...c.entries()].sort((a, b) => b[1] - a[1])[0] || ['(none)', 0]; };

console.log(`\n════ commoner_resentments (public, no audience)\n${HDR}`);
for (const k of ['before', 'after']) {
  console.log(line(`${k.toUpperCase()}: top single SENTENCE % of 150`, (s) => String(pct(topOf(by(s), (x) => new Set(sentences(x[k])))[1]))));
  console.log(line(`${k.toUpperCase()}: EMPTY % of 150 (count)`, (s) => { const n = by(s).filter((x) => !x[k]).length; return `${pct(n)} (${n})`; }));
}
console.log(line('legitimacy branch taken (count)', (s) => String(by(s).filter((x) => x.legitimacy).length)));
const off = rows.filter((x) => x.after !== x.expected);
console.log(`${line('FALSE route: a printed text not its branches\' keyed pick of the admitted lines', (s) => String(off.filter((x) => x.size === s).length))}${off[0] ? ` e.g. ${off[0].seed}` : ''}`);
const moved = rows.filter((x) => x.after !== x.before);
console.log(line('places whose text moved (before != after)', (s) => String(moved.filter((x) => x.size === s).length)));
for (const k of ['before', 'after']) for (const s of SIZES) { const [t, n] = topOf(by(s), (x) => new Set(sentences(x[k]))); console.log(`  ${k} top sentence ${s} (${n}/${N}): "${t}"`); }

console.log(`\n════ L8..L12: printed share by size, and FALSE (printed where the office does not hold)\n${HDR}`);
let falseTotal = off.length;
for (const [i, id] of IDS.entries()) {
  const said = rows.filter((x) => x.after.includes(LINE[id].text));
  console.log(line(`${id} (office: ${KEYS[i]}) printed: % of 150 (count)`, (s) => { const n = said.filter((x) => x.size === s).length; return `${pct(n)} (${n})`; }));
  const bad = said.filter((x) => !x.office[KEYS[i]]); falseTotal += bad.length;
  console.log(`${line(`FALSE ${id} printed where office: ${KEYS[i]} does not hold`, (s) => String(bad.filter((x) => x.size === s).length))}${bad[0] ? ` e.g. ${bad[0].seed}` : ''}`);
}
console.log(`FALSE TOTAL (route + L8..L12): ${falseTotal}`);

console.log(`\n════ the five atoms' share by size (factsOf(record).office), beside measures/OFFICE (DARK, point 97)\n${HDR}`);
for (const k of KEYS) {
  const mine = SIZES.map((s) => pct1(by(s).filter((x) => x.office[k]).length)).join(' ');
  console.log(line(`office: ${k}`, (s) => pct1(by(s).filter((x) => x.office[k]).length)));
  console.log(`  OFFICE-M: ${OFFICE_M[k]}  | equal: ${mine === OFFICE_M[k]}`);
}

console.log(`\n════ the coordinator's addition (count only, no cure): L9 printed AND, on the same place, dawn_work W11 or B19, or gathering_places P13\n${HDR}`);
const l9 = rows.filter((x) => x.after.includes(LINE.L9.text));
const both = (x, ids) => ids.some((id) => (id === 'P13' ? x.gathering : x.dawn).includes(ELDER_DOOR[id]));
for (const ids of [['W11'], ['B19'], ['P13'], ['W11', 'B19', 'P13']]) {
  const hits = l9.filter((x) => both(x, ids));
  console.log(`${line(`L9 with ${ids.join(' or ')} (count)`, (s) => String(hits.filter((x) => x.size === s).length))}${hits[0] ? ` e.g. ${hits[0].seed}: resent "${hits[0].after}" | dawn "${hits[0].dawn}" | gathering "${hits[0].gathering}"` : ''}`);
}
console.log(`\n════ THE WALKERS' STRIKES: where the office holds, the thing the walker reads absent (its own reader), and where the line printed\n${HDR}`);
for (const [thing, k, id] of STRUCK) {
  const held = rows.filter((x) => x.office[k]);
  console.log(line(`office: ${k} holds (count)`, (s) => String(held.filter((x) => x.size === s).length)));
  const gone = held.filter((x) => x.struck[thing]);
  console.log(`${line(`  of them, ${thing} absent by the rule book's reader`, (s) => String(gone.filter((x) => x.size === s).length))}${gone[0] ? ` e.g. ${gone[0].seed}` : ''}`);
  const printed = gone.filter((x) => x.after.includes(LINE[id].text));
  console.log(`${line(`  of them, ${id} printed`, (s) => String(printed.filter((x) => x.size === s).length))}${printed[0] ? ` e.g. ${printed[0].seed}` : ''}`);
}
console.log(`\ndone in ${((Date.now() - t0) / 1000).toFixed(0)}s`);
