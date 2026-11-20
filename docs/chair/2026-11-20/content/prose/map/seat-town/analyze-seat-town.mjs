/**
 * analyze-seat-town.mjs — reads the census's `seat.*.jsonl` (and town-noun.static.mjs's JSON) and prints the counts the two
 * reports quote. `node analyze-seat-town.mjs <ROOT> <census-dir> <town-static.json> <out.json>`. MEASURE ONLY.
 */
import { readFileSync, readdirSync, writeFileSync } from 'node:fs';

const [, , ROOT, DIR, STATIC, OUTFILE] = process.argv;
const { tierNounKeptSpans } = await import(`${ROOT}/src/domain/display/stateProse/stateProseKernel.js`);
const SIZES = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
const P = readdirSync(DIR).filter((f) => /^seat\.\d+\.jsonl$/.test(f))
  .flatMap((f) => readFileSync(`${DIR}/${f}`, 'utf8').trim().split('\n').map((l) => JSON.parse(l)));
const CONTESTED = 'Contested'; const CRITICAL = 'Critical. The seat could fall';
const contest = (p) => p.label === CONTESTED || p.label === CRITICAL;
const EXPECT = new Set([1, 3, 4]); // DS-POW-2 › stable matched: vids whose words state an expectation (Table 2)
const out = { places: P.length, table1: {}, reasons: {}, reasonsBySize: {}, widen: {}, hide: {}, header: {}, town: {} };

for (const size of [...SIZES, 'ALL']) {
  const S = P.filter((p) => size === 'ALL' || p.size === size);
  const C = S.filter(contest);
  const stableBeside = C.filter((p) => p.headerKey === 'stable matched' && p.header?.sentence);
  const calmC = C.filter((p) => p.calm);
  out.table1[size] = {
    places: S.length, contested: S.filter((p) => p.label === CONTESTED).length, critical: S.filter((p) => p.label === CRITICAL).length,
    stableHeaderBeside: stableBeside.length, stableExpectation: stableBeside.filter((p) => EXPECT.has(p.headerVid)).length,
    calmContested: calmC.length, calmContestedC: calmC.filter((p) => p.label === CONTESTED).length, calmContestedCr: calmC.filter((p) => p.label === CRITICAL).length,
    calmNamed: calmC.filter((p) => p.namesFirst).length, calmNamedProse: calmC.filter((p) => p.namesFirst || p.namesFirstProse).length,
    calmAtOdds: calmC.filter((p) => p.atOdds).length, calmBargaining: calmC.filter((p) => p.bargaining).length,
    calmStableHeader: calmC.filter((p) => p.headerKey === 'stable matched').length,
    calmStableExpect: calmC.filter((p) => p.headerKey === 'stable matched' && EXPECT.has(p.headerVid)).length,
    calmLegitContested: calmC.filter((p) => p.legitimacy === 'Contested' || p.legitimacy === 'Legitimacy Crisis').length,
    calm: S.filter((p) => p.calm).length,
    govRecomputedUnequal: S.filter((p) => !p.govRecomputedEqual).length,
  };
}
// header vids beside a contest
for (const p of P.filter(contest)) { const k = `${p.headerKey} :: ${p.headerVid}`; out.header[k] = (out.header[k] || 0) + 1; }

// THE TRIGGER: calm contested places where the at-odds line does not fire, by the first challenger's tie with the ruler
const reasonOf = (p) => {
  const o = p.firstTieOwner || []; const v = p.firstTieVeiled || [];
  if (!o.length) return 'R1 no relationship row between the ruler and the first challenger';
  const t = o[0];
  if (t.type === 'tense' && t.captureState === 'equilibrium') return 'R3 tense row at equilibrium (excluded by estrangedPowersOf)';
  if (t.type === 'tense' && !v.length) return 'R5 tense row stripped by the public veil';
  if (t.type === 'tense') return 'R? tense row present (another cause)';
  if (['competitive', 'corrupted'].includes(t.type)) return `R4 row is ${t.type}${t.captureState ? `/${t.captureState}` : ''} (a different estrangement line)`;
  return `R2 row type '${t.type}' (not read as estrangement)`;
};
for (const p of P.filter((x) => x.calm && contest(x) && !x.atOdds)) {
  const r = reasonOf(p); out.reasons[r] = (out.reasons[r] || 0) + 1;
  (out.reasonsBySize[p.size] ||= {})[r] = ((out.reasonsBySize[p.size] || {})[r] || 0) + 1;
}
// does any other power have a tense tie (owner) in those places?
out.reasonsOtherTense = P.filter((x) => x.calm && contest(x) && !x.atOdds).filter((p) => (p.estrangedOwner || []).some((e) => e.tie === 'tense')).length;
// first-challenger tie types over ALL contested places and over calm contested
const tieTally = (L) => { const m = {}; for (const p of L) { const t = p.firstTieOwner?.[0]; const k = t ? `${t.type}${t.captureState ? `/${t.captureState}` : ''}` : 'none'; m[k] = (m[k] || 0) + 1; } return m; };
out.firstTieAllContest = tieTally(P.filter(contest));
out.firstTieCalmContest = tieTally(P.filter((x) => x.calm && contest(x)));
// any estranged tie the account reads, calm contested
out.calmContestEstranged = P.filter((x) => x.calm && contest(x)).map((p) => (p.estrangedVeiled || []).map((e) => e.tie).join('+') || 'none')
  .reduce((m, k) => ((m[k] = (m[k] || 0) + 1), m), {});

// (a) widening: an account line naming challengers[0] wherever the label is Contested or Critical
const C = P.filter(contest);
out.widen = {
  contestedOrCritical: C.length, calm: C.filter((p) => p.calm).length, crisisBorn: C.filter((p) => !p.calm).length,
  alreadyNamesFirst: C.filter((p) => p.namesFirst).length, alreadyNamesFirstProse: C.filter((p) => p.namesFirst || p.namesFirstProse).length,
  newlyNamed: C.filter((p) => !(p.namesFirst || p.namesFirstProse)).length,
  newlyNamedCalm: C.filter((p) => p.calm && !(p.namesFirst || p.namesFirstProse)).length,
  newlyNamedCrisis: C.filter((p) => !p.calm && !(p.namesFirst || p.namesFirstProse)).length,
  alreadyAtOddsOther: C.filter((p) => p.atOdds && !(p.namesFirst || p.namesFirstProse)).length,
  holdingNamesFirst: P.filter((p) => p.label === 'Holding' && (p.namesFirst || p.namesFirstProse)).length,
};
// hideable first challengers
const W = P.filter((p) => p.challengers?.length);
const hideCount = (L) => ({
  withChallenger: L.length,
  hideableHouse: L.filter((p) => p.firstHideableHouse).length, veiledPower: L.filter((p) => p.firstVeiledPower).length,
  hidden: L.filter((p) => p.firstHidden).length, criminalCategory: L.filter((p) => String(p.firstCategory).toLowerCase() === 'criminal').length,
  instRowHideable: L.filter((p) => p.firstInstHideable).length, notInVeiled: L.filter((p) => p.firstInVeiled === false).length,
  anyFlag: L.filter((p) => p.firstHideableHouse || p.firstVeiledPower || p.firstHidden || p.firstInstHideable || p.firstInVeiled === false).length,
});
out.hide = { all: hideCount(W), contested: hideCount(W.filter(contest)), calmContested: hideCount(W.filter((p) => p.calm && contest(p))) };
out.firstArchetypesContested = C.map((p) => p.challengers[0].archetype).reduce((m, k) => ((m[k] = (m[k] || 0) + 1), m), {});

// the calm contested places, listed
out.calmContestedList = P.filter((x) => x.calm && contest(x)).map((p) => ({
  seed: p.seed, name: p.name, label: p.label, legit: p.legitimacy, gov: p.govOwner, first: p.challengers[0], inc: p.incWeight,
  header: p.headerKey === 'stable matched' ? `v${p.headerVid}` : p.headerKey, named: p.namesFirst, namedProse: p.namesFirstProse, atOdds: p.atOdds,
  tie: p.firstTieOwner?.[0] ?? null, estranged: (p.estrangedVeiled || []).map((e) => `${e.name}:${e.tie}`), banner: p.banner?.sentence ?? null,
}));

// UNIT 2 — the printed 'town' at a size that is not a town
const ST = JSON.parse(readFileSync(STATIC, 'utf8'));
const counted = ST.rows.filter((r) => r.moved > 0 || r.movedCity > 0);
const reOf = (text) => new RegExp(String(text).split(/(\{[^}]+\})/).map((t) => (t.startsWith('{') && t.endsWith('}') ? '[\\s\\S]*?' : t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))).join(''), 'i');
const RES = counted.map((r) => ({ r, re: reOf(r.text) }));
const WHOLE = /(?<![\p{L}\p{N}_])[Tt]own(?:['’]s)?(?![\p{L}\p{N}_])/gu;
const unspokenBySite = {}; const unspokenPlaces = {}; const vidsBySite = {}; const examples = {};
const named = { market: [], founded: [] };
for (const p of P) {
  for (const { path, s } of p.townStrings || []) {
    if (/what trade the \w+ does is done house to house/.test(s)) named.market.push({ seed: p.seed, size: p.size, path, s: s.match(/what trade the \w+ does/)[0] });
    if (/the \w+ has grown well past that since/.test(s)) named.founded.push({ seed: p.seed, size: p.size, path, s: s.match(/the \w+ has grown well past that since/)[0] });
    if (p.size === 'town') continue;
    const kept = tierNounKeptSpans(s, p.size);
    const hits = [...s.matchAll(WHOLE)].filter((m) => !kept.some(([a, b]) => m.index < b && a < m.index + m[0].length));
    if (!hits.length) continue;
    const site = path.replace(/\[\d+\]/g, '[]');
    const k = `${p.size} :: ${site}`;
    unspokenBySite[k] = (unspokenBySite[k] || 0) + 1;
    (unspokenPlaces[p.size] ||= new Set()).add(p.seed);
    const tpl = RES.filter(({ re }) => re.test(s)).map(({ r }) => `${r.file}|${r.blockId}|${r.poolKey}|v${r.vid}`);
    for (const t of tpl.length ? tpl : ['UNMATCHED']) ((vidsBySite[site] ||= {})[t] = ((vidsBySite[site] || {})[t] || 0) + 1);
    if (!examples[p.size]) examples[p.size] = { seed: p.seed, name: p.name, population: p.population, path, s, tpl };
  }
}
out.town = {
  unspokenBySite, unspokenPlaces: Object.fromEntries(Object.entries(unspokenPlaces).map(([k, v]) => [k, v.size])),
  vidsBySite, examples,
  namedMarket: named.market.reduce((m, x) => ((m[`${x.size} :: ${x.path} :: ${x.s}`] = (m[`${x.size} :: ${x.path} :: ${x.s}`] || 0) + 1), m), {}),
  namedFounded: named.founded.reduce((m, x) => ((m[`${x.size} :: ${x.path} :: ${x.s}`] = (m[`${x.size} :: ${x.path} :: ${x.s}`] || 0) + 1), m), {}),
  townExample: P.filter((p) => p.size === 'town').map((p) => ({ p, hit: (p.townStrings || []).find(({ s }) => RES.some(({ re }) => re.test(s))) })).find((x) => x.hit) ?? null,
};
if (out.town.townExample) out.town.townExample = { seed: out.town.townExample.p.seed, name: out.town.townExample.p.name, population: out.town.townExample.p.population, path: out.town.townExample.hit.path, s: out.town.townExample.hit.s };
writeFileSync(OUTFILE, JSON.stringify(out, null, 1));
console.log(`places ${P.length}; ALL ${JSON.stringify(out.table1.ALL)}`);
