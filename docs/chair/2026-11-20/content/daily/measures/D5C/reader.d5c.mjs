#!/usr/bin/env node
/**
 * RUN (from the repository root, through the gate mutex, to a file, never a pipe):
 *   sh scripts/gate-mutex.sh --run -- node docs/chair/2026-11-20/content/daily/measures/D5C/reader.d5c.mjs > docs/chair/2026-11-20/content/daily/measures/D5C/reader.<before|after>.out.txt 2>&1
 *
 * DAILY-5 · D5C-2 phase B (brief: ../../briefs/D5C-2-PHASE-B.md § 3): THE READER'S FIGURE. Nothing under src/ or tests/
 * is changed; it reads the live pools, so it measures the tree as it stands.
 *
 * Births: M1's 900 (150 a size, seeds hxd-<size>-0..149), the recipe of `../D4C/measure.d4c.mjs` (M1's, copied).
 * The page: deriveDailyLife(record), the eight public slots (DAILY_LIFE_PAGE_SLOTS) as a reader's page prints them.
 * THE INSTRUMENT is D4C's (`../D4C/measure.d4c.mjs :: readSlot`, its house finder and template reader COPIED, as
 * `tests/domain/dailyLifeNoRepeat.test.js` copies them): every branch's keyed pick by THE ROUTE, kept where its template
 * is found in the printed text. A SENTENCE is each printed part's filled text (`said`); child_warnings, as the measure's
 * table 2 counts it, the whole printed sentence. A page's sentences are a set (one sentence printed twice counts once).
 *
 * THE FIGURE: for every pair of places OF ONE SIZE, the number of sentences the two pages share; the mean over the
 * pairs, per size and pooled within size (all same-size pairs of the six sizes); and the same over ALL pairs of the 900
 * (any two places), and over the cross-size pairs alone. Sum over pairs of |A ∩ B| = Σ over sentences C(c, 2), c the
 * pages printing it.
 */
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
const HERE = dirname(fileURLToPath(import.meta.url));
const L = resolve(HERE, '../../../../../../..');

const { generateSettlementPipeline } = await import(`${L}/src/generators/generateSettlementPipeline.js`);
const { birthConfig, loadGenerationLawPayloads } = await import(`${L}/src/domain/density/densityCreateBoundary.js`);
const { DEFAULT_CONFIG } = await import(`${L}/src/store/configSlice.js`);
const { deriveDailyLife, DAILY_LIFE_PAGE_SLOTS } = await import(`${L}/src/domain/dailyLife.js`);
const { filterDeclared } = await import(`${L}/src/domain/facts/drawDeclared.js`);
const { factsOf } = await import(`${L}/src/domain/facts/factsOf.js`);
const { INSTITUTION_KIND_PATTERNS, ACCESS_ONLY } = await import(`${L}/src/domain/facts/institutions.js`);
const { isMarketInstitution } = await import(`${L}/src/domain/facts/market.js`);
const { liveInstitutions } = await import(`${L}/src/domain/institutions/institutionRoster.js`);
const { nativeSemanticName } = await import(`${L}/src/domain/content/customContentSemanticAuthority.js`);
const { isHideableHouse } = await import(`${L}/src/domain/people/cardVeil.js`);
const { pickVariantMixed } = await import(`${L}/src/kernel/proseHash.js`);
const { GATHERING_NAMED, GATHERING_PLAIN } = await import(`${L}/src/data/dailyLife/gatheringPlaces.js`);
const { DAWN_WORK } = await import(`${L}/src/data/dailyLife/dawnWork.js`);
const { CHILD_WARNINGS } = await import(`${L}/src/data/dailyLife/childWarnings.js`);
const { COMMONER_RESENTMENTS } = await import(`${L}/src/data/dailyLife/commonerResentments.js`);
const { FOOD_CULTURE } = await import(`${L}/src/data/dailyLife/foodCulture.js`);
const { OUTSIDER_IMPRESSIONS } = await import(`${L}/src/data/dailyLife/outsiderImpressions.js`);
const { UNSPOKEN_TOPICS } = await import(`${L}/src/data/dailyLife/unspokenTopics.js`);
const { RECENT_CHANGES } = await import(`${L}/src/data/dailyLife/recentChanges.js`);
await loadGenerationLawPayloads();

const SIZES = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
const N = Number(process.env.D5C_N || 150); // D5C_N: a smoke run only; the figure is on 150
const POOLS = {
  outsider_impressions: OUTSIDER_IMPRESSIONS, dawn_work: DAWN_WORK, food_culture: FOOD_CULTURE,
  gathering_places: { named: GATHERING_NAMED, plain: GATHERING_PLAIN }, child_warnings: CHILD_WARNINGS,
  commoner_resentments: COMMONER_RESENTMENTS, unspoken_topics: UNSPOKEN_TOPICS, recent_changes: RECENT_CHANGES,
};
// ── COPIED from ../D4C/measure.d4c.mjs (FILLED, the house finder, templateRe, readSlot's read) ──
const FILLED = (slot, branch) => {
  if (slot === 'commoner_resentments') return ['gov'];
  if (slot === 'outsider_impressions' && (branch === 'power' || branch === 'power.level')) return ['power', 'Power'];
  if (slot === 'outsider_impressions' && branch.startsWith('services.')) return ['gov'];
  if (slot === 'recent_changes' && branch === 'beat') return ['Event', 'event'];
  return [];
};
const SACRED_ORDER = [/\bcathedral/i, /\btemple|\bchurch|\babbey|\bchapel/i, /\bshrine/i, /\bmonaster|\bfriary\b/i];
const CHURCH_ORDER = [SACRED_ORDER[0], SACRED_ORDER[1], SACRED_ORDER[3]];
const MARKET_NAME = /\bmarkets?\b(?!\s*squares?)/i;
const DOCKS_NAME = /\bdocks?\b|\bwharf|\bquays?\b/i;
const rowName = (inst) => String(nativeSemanticName(inst) || inst?.name || '');
const nameableRows = (s) => liveInstitutions(s).filter((i) => !isHideableHouse(i) && !ACCESS_ONLY.test(rowName(i)));
const firstRow = (rows, re, extra = () => true) => rows.find((i) => re.test(rowName(i)) && extra(i));
const DAILY_HOUSES = {
  sacred: (rows) => SACRED_ORDER.map((re) => firstRow(rows, re)).find(Boolean),
  church: (rows) => CHURCH_ORDER.map((re) => firstRow(rows, re)).find(Boolean),
  cathedral: (rows) => firstRow(rows, /\bcathedral/i),
  market: (rows) => firstRow(rows, MARKET_NAME, isMarketInstitution),
  square: (rows) => firstRow(rows, INSTITUTION_KIND_PATTERNS.square, isMarketInstitution),
  inn: (rows) => firstRow(rows, INSTITUTION_KIND_PATTERNS.tavern),
  mill: (rows) => firstRow(rows, INSTITUTION_KIND_PATTERNS.mill),
  bathhouse: (rows) => firstRow(rows, INSTITUTION_KIND_PATTERNS.bathhouse),
  bridge: (rows) => firstRow(rows, INSTITUTION_KIND_PATTERNS.bridge),
  docks: (rows) => firstRow(rows, DOCKS_NAME),
  theater: (rows) => firstRow(rows, INSTITUTION_KIND_PATTERNS.theatre),
};
function houseFinder(s) {
  const rows = nameableRows(s);
  const found = {};
  return (k) => (k in found ? found[k] : (found[k] = DAILY_HOUSES[k]?.(rows)));
}
const esc = (v) => v.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const reCache = new Map();
function templateRe(text) {
  if (reCache.has(text)) return reCache.get(text);
  const src = text.split(/\{[^{}]*\}/).map(esc).join('(.+?)');
  const re = new RegExp(/\{[^{}]*\}$/.test(text) ? src.replace(/\(\.\+\?\)$/, '([^,.]+)') : src);
  reCache.set(text, re);
  return re;
}
function readSlot(rec, slot, text, house) {
  const facts = factsOf(rec);
  const name = typeof rec.name === 'string' && rec.name ? rec.name : null;
  const parts = [];
  for (const [branch, pool] of Object.entries(POOLS[slot])) {
    const filled = FILLED(slot, branch);
    const eligible = filterDeclared(pool, { facts, poolId: `dailyLife.${slot}.${branch}`, surface: 'dailyLife' })
      .filter((l) => [...l.text.matchAll(/\{(\w+)\}/g)].map((m) => m[1]).filter((k) => !filled.includes(k)).every((k) => !!house(k)));
    const pick = pickVariantMixed(eligible, name ? `${name}::dailyLife.${slot}::${branch}` : null);
    if (!pick) continue;
    const m = templateRe(pick.text).exec(text);
    if (m) parts.push({ slot, branch, id: pick.id, said: m[0], at: m.index });
  }
  parts.sort((a, b) => a.at - b.at || b.said.length - a.said.length);
  const kept = parts.filter((p, i) => parts.findIndex((q) => q.at === p.at && q.said.length === p.said.length) === i)
    .filter((p, _, all) => !all.some((q) => q !== p && q.at <= p.at && q.at + q.said.length >= p.at + p.said.length && q.said.length > p.said.length));
  let rest = text;
  for (const p of kept) rest = rest.split(p.said).join(' ');
  if (slot === 'child_warnings') rest = rest.replace(/^\s*Children are warned about /, '').replace(/\s*, and about /g, ' ').replace(/\.\s*$/, '');
  return { parts: kept, uncovered: rest.replace(/\s+/g, '') };
}

// ── births: each page's set of sentences ──
const t0 = Date.now();
const pages = [];
let uncovered = 0;
for (const size of SIZES) for (let i = 0; i < N; i++) {
  const seed = `hxd-${size}-${i}`;
  const rec = generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, settType: size }), null, { seed, customContent: {} });
  const pub = deriveDailyLife(rec).slots;
  const house = houseFinder(rec);
  const sentences = new Set();
  for (const k of DAILY_LIFE_PAGE_SLOTS) {
    const text = typeof pub[k]?.text === 'string' ? pub[k].text.trim() : '';
    if (!text || text === '—') continue;
    const read = readSlot(rec, k, text, house);
    if (read.uncovered) uncovered++;
    if (k === 'child_warnings') sentences.add(text);
    else for (const p of read.parts) sentences.add(p.said);
  }
  pages.push({ seed, size, sentences });
}
console.log(`births: ${pages.length} (${N} a size) in ${((Date.now() - t0) / 1000).toFixed(0)}s`);
console.log(`COVERAGE: printed slot texts not wholly read back to pool rows: ${uncovered}`);

const pairs = (c) => (c * (c - 1)) / 2;
/** Σ over sentences C(c, 2) over a set of pages: the sum over their pairs of the sentences two pages share. */
function sharedSum(list) {
  const count = new Map();
  for (const p of list) for (const s of p.sentences) count.set(s, (count.get(s) || 0) + 1);
  let sum = 0;
  for (const c of count.values()) sum += pairs(c);
  return { sum, count };
}
console.log('\n════ THE READER\'S FIGURE: the mean number of identical Daily Life sentences two pages share (the public eight) ════');
let withinSum = 0, withinPairs = 0;
for (const z of SIZES) {
  const list = pages.filter((p) => p.size === z);
  const { sum, count } = sharedSum(list);
  withinSum += sum; withinPairs += pairs(list.length);
  const meanSent = list.reduce((a, p) => a + p.sentences.size, 0) / list.length;
  const top = [...count].sort((a, b) => b[1] - a[1]).slice(0, 3).map(([s, c]) => `${c} "${s.slice(0, 70)}"`).join('; ');
  console.log(`${z.padEnd(10)} pairs ${pairs(list.length)}  mean shared ${(sum / pairs(list.length)).toFixed(3)}  (sentences a page ${meanSent.toFixed(2)}; commonest: ${top})`);
}
console.log(`POOLED WITHIN SIZE (every same-size pair of the six sizes): pairs ${withinPairs}  mean shared ${(withinSum / withinPairs).toFixed(3)}`);
const all = sharedSum(pages);
const allPairs = pairs(pages.length);
console.log(`ALL PAIRS OF THE ${pages.length} (any two places): pairs ${allPairs}  mean shared ${(all.sum / allPairs).toFixed(3)}`);
console.log(`CROSS-SIZE PAIRS ONLY: pairs ${allPairs - withinPairs}  mean shared ${((all.sum - withinSum) / (allPairs - withinPairs)).toFixed(3)}`);
console.log(`\ndone in ${((Date.now() - t0) / 1000).toFixed(0)}s`);
