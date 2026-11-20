#!/usr/bin/env node
/**
 * RUN (from the repository root):
 *   node docs/chair/2026-11-20/content/daily/measures/M1/measure.m1.mjs > docs/chair/2026-11-20/content/daily/measures/M1/m1.out.txt 2>&1
 *
 * DAILY-1 · M1 — the measure of the eight Daily Life slots (brief: ../../briefs/M1-MEASURE.md). Measure only.
 * Births: 150 a size, six sizes, seeds hxd-<size>-0..149, by PAGE-9's THIN recipe (copied, not imported):
 *   loadGenerationLawPayloads(); generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, settType }), null, { seed, customContent: {} }).
 * Slots: deriveDailyLife(record) on the born record, as regenerationDelta.js :: deriveRegenerationDelta reads it (the store's record).
 * The branch of each slot is mirrored from src/domain/dailyLife.js over the same substrate derivers buildContext calls,
 * and every mirror is checked against the printed text (MIRROR lines). Nothing is written to a record; nothing is stored.
 */
import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
const HERE = dirname(fileURLToPath(import.meta.url));
const L = resolve(HERE, '../../../../../../..');
const REL = 'docs/chair/2026-11-20/content/daily/measures/M1';
console.log(`RE-RUN: node ${REL}/measure.m1.mjs > ${REL}/m1.out.txt 2>&1`);

const { generateSettlementPipeline } = await import(`${L}/src/generators/generateSettlementPipeline.js`);
const { birthConfig, loadGenerationLawPayloads } = await import(`${L}/src/domain/density/densityCreateBoundary.js`);
const { DEFAULT_CONFIG } = await import(`${L}/src/store/configSlice.js`);
const { deriveDailyLife, DAILY_LIFE_SLOTS } = await import(`${L}/src/domain/dailyLife.js`);
const { deriveAllFactionProfiles } = await import(`${L}/src/domain/factionProfile.js`);
const { deriveAllSupplyChainStates } = await import(`${L}/src/domain/supplyChainState.js`);
const { deriveAllActiveConditions } = await import(`${L}/src/domain/activeConditions.js`);
const { deriveAllThreatProfiles } = await import(`${L}/src/domain/threatProfile.js`);
const { deriveAllCapacities, CAPACITY_NAMES } = await import(`${L}/src/domain/capacityModel.js`);
const { deriveCausalState } = await import(`${L}/src/domain/causalState.js`);
const { deriveHistoryBeats } = await import(`${L}/src/domain/historyBeats.js`);
const { factsOf } = await import(`${L}/src/domain/facts/factsOf.js`);
const { hasInstitution } = await import(`${L}/src/domain/facts/institutions.js`);
const { defenceOf } = await import(`${L}/src/domain/facts/defence.js`);
const { marketOf, isMarketInstitution } = await import(`${L}/src/domain/facts/market.js`);
const { waterOf } = await import(`${L}/src/domain/facts/water.js`);
const { rulingBodyOf } = await import(`${L}/src/domain/facts/rulingBody.js`);
const { rulerKindOf } = await import(`${L}/src/domain/facts/rulerKind.js`);
const { tradeRouteOf } = await import(`${L}/src/domain/facts/terrain.js`);
const { ACCESS_ONLY } = await import(`${L}/src/domain/facts/liveInstitutionNames.js`);
const { liveInstitutions, isLiveInstitution } = await import(`${L}/src/domain/institutions/institutionRoster.js`);
const { isHideableHouse, isVeiledPower } = await import(`${L}/src/domain/people/cardVeil.js`);
const { toPublicSafe } = await import(`${L}/src/domain/display/publicSafe.js`);
await loadGenerationLawPayloads();

const SIZES = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
const N = 150;
const t0 = Date.now();
const rows = [];
for (const size of SIZES) for (let i = 0; i < N; i++) {
  const seed = `hxd-${size}-${i}`;
  const rec = generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, settType: size }), null, { seed, customContent: {} });
  rows.push({ seed, size, rec });
}
console.log(`births: ${rows.length} (${N} a size) in ${((Date.now() - t0) / 1000).toFixed(0)}s`);

// ── the record tests (named homes first; the nearest field where no home answers) ──
const liveNames = (rec) => liveInstitutions(rec).map((i) => String(i?.name || '')).filter((n) => n && !ACCESS_ONLY.test(n));
const anyLive = (rec, re) => liveNames(rec).some((n) => re.test(n));
const quarters = (rec) => (Array.isArray(rec?.spatialLayout?.quarters) ? rec.spatialLayout.quarters : []);
const landmarks = (rec) => quarters(rec).flatMap((q) => (Array.isArray(q?.landmarks) ? q.landmarks.map(String) : []));
const BAKERY = /\bbak(?:er|ers|ery|eries|ehouse)\b/i;
const WAREHOUSE = /\bwarehouse|\bstorehouse/i;
const WELL = /\bwells?\b|\bwater source|\bwater sources\b|\bwater system|\bwater infrastructure|\baqueduct/i;
const BRIDGE = /\bbridges?\b/i;
const SQUARE = /\bsquares?\b|\bplaza\b|\bgreen\b/i; // a 'common' is grazing land, not a square: not counted
const TRADE_QUARTER = /\bmarket|\btrade|\bmerchant|\bbazaar|\bcommerc/i;
const safe = (f, d = undefined) => { try { return f(); } catch { return d; } };
const T = {
  walls: (r) => defenceOf(r).walls,
  watch: (r) => defenceOf(r).watch,
  guard: (r) => safe(() => factsOf(r).guardPresence, false),
  gate: (r) => defenceOf(r).gate,
  bakery: (r) => anyLive(r, BAKERY),
  smithy: (r) => hasInstitution(r, 'smith'),
  granary: (r) => hasInstitution(r, 'granary'),
  quarters: (r) => quarters(r).length > 0,
  tradeQuarter: (r) => quarters(r).some((q) => TRADE_QUARTER.test(String(q?.name || ''))),
  market: (r) => marketOf(r),
  well: (r) => anyLive(r, WELL) || landmarks(r).some((l) => WELL.test(l)),
  bridge: (r) => anyLive(r, BRIDGE) || landmarks(r).some((l) => BRIDGE.test(l)),
  square: (r) => anyLive(r, SQUARE) || quarters(r).some((q) => SQUARE.test(String(q?.name || ''))) || landmarks(r).some((l) => SQUARE.test(l)),
  smallPlace: (r) => r.tier === 'thorp' || r.tier === 'hamlet',
  notTown: (r) => safe(() => factsOf(r).populationBand) === 'small',
  routeNone: (r) => ['', 'isolated', 'none'].includes(tradeRouteOf(r)),
  warehouse: (r) => anyLive(r, WAREHOUSE),
  temple: (r) => hasInstitution(r, 'temple'),
  sacred: (r) => safe(() => factsOf(r).sacredHouse, false),
  council: (r) => rulingBodyOf(r) === true,
  tavern: (r) => hasInstitution(r, 'tavern'),
  guild: (r) => safe(() => factsOf(r).guild, false),
  sickHouse: (r) => defenceOf(r).hospital || defenceOf(r).healer,
  neighbour: (r) => !!r.neighborRelationship,
  appointedPost: (r) => safe(() => factsOf(r).appointedPost, false),
  timber: (r) => safe(() => factsOf(r).timberAtHand, false),
};

// ── the mirror of each writer's branch (dailyLife.js), over the same derivers buildContext calls ──
const RELIGIOUS = /(temple|cathedral|chapel|shrine|abbey|monastery)/i;
const TRADE = /(market|bazaar|forum|exchange|quay|wharf)/i;
const INN = /(inn|tavern|hall|guildhall)/i;
const byPat = (r, re) => (Array.isArray(r.institutions) ? r.institutions : []).filter((i) => re.test(String(i?.name || '')));
const BAD = ['strained', 'critical', 'collapsed'];
function mirror(r, ctx) {
  const B = {}; // slot -> branch names (an additive writer takes several)
  const food = ctx.capacities.capacities.food_production, def = ctx.capacities.capacities.defense;
  const craft = ctx.profiles.find((p) => p.archetype === 'craft')?.power || 0;
  const merch = ctx.profiles.find((p) => p.archetype === 'merchant')?.power || 0;
  const siege = ctx.threats.some((t) => t.type === 'siege');
  const wanting = ctx.threats.some((t) => t.type === 'famine' || t.type === 'siege');
  B.dawn_work = [food.band === 'critical' || food.band === 'collapsed' ? 'food-critical'
    : def.band === 'critical' || def.band === 'collapsed' ? 'defense-critical'
    : craft >= 25 ? 'craft-power>=25' : merch >= 30 && siege ? 'merchant>=30+siege' : merch >= 30 ? 'merchant-power>=30' : 'default(bakers)'];
  const rel = byPat(r, RELIGIOUS), tr = byPat(r, TRADE), inn = byPat(r, INN);
  B.gathering_places = rel.length || tr.length || inn.length
    ? [rel.length && 'named:religious', tr.length && 'named:trade', inn.length && 'named:inn/hall'].filter(Boolean) : ['fallback(well,bridge,square)'];
  const chosen = [rel[0], tr[0], inn[0]].filter(Boolean);
  const top3 = [...ctx.threats].sort((a, b) => b.severity - a.severity).slice(0, 3);
  B.child_warnings = top3.length ? [...new Set(top3.map((t) => `threat:${t.type}`))] : ['fallback(no threat)'];
  const foodChains = ctx.chains.filter((c) => c.needKey === 'food_security');
  const stable = foodChains.find((c) => c.status === 'stable'), disrupted = foodChains.find((c) => c.status !== 'stable');
  B.food_culture = [food.band === 'surplus' ? (wanting ? 'surplus+famine/siege' : stable ? 'surplus+stable-chain' : 'surplus')
    : food.band === 'adequate' ? 'adequate' : food.band === 'strained' ? (disrupted ? 'strained+disrupted-chain' : 'strained')
    : food.band === 'critical' ? (disrupted ? 'critical+disrupted-chain' : 'critical') : 'collapsed(default)'];
  const crim = ctx.causal.scores.criminal_opportunity ?? 50;
  const legit = ctx.causal.bands.public_legitimacy;
  const corruption = ctx.conditions.find((c) => c.archetype === 'corruption_exposed');
  const cr = [crim >= 70 ? 'criminal_opportunity>=70' : crim >= 55 ? 'criminal_opportunity>=55' : null,
    BAD.includes(food.band) ? 'food-strained+' : null, BAD.includes(legit) ? 'legitimacy-strained+' : null,
    corruption ? 'corruption_exposed' : null].filter(Boolean);
  B.commoner_resentments = cr.length ? cr : ['fallback(any town)'];
  const topT = [...ctx.threats].sort((a, b) => b.severity - a.severity)[0];
  const domF = ctx.profiles.slice().sort((a, b) => (b.power || 0) - (a.power || 0))[0];
  const strained = CAPACITY_NAMES.filter((n) => BAD.includes(ctx.capacities.bands[n]));
  const oi = [domF ? 'dominant-power' : null, topT && topT.severityBand !== 'low' ? 'top-threat>low' : null, strained.length >= 3 ? 'strained-caps>=3' : null].filter(Boolean);
  B.outsider_impressions = oi.length ? oi : ['fallback(ordinary)'];
  const hidden = ctx.threats.filter((t) => t.visibility === 'hidden' || t.visibility === 'rumored');
  const ut = [hidden.length ? 'hidden/rumored-threat' : null, ctx.history.unresolvedWound ? 'unresolvedWound' : null, corruption ? 'corruption_exposed' : null].filter(Boolean);
  B.unspoken_topics = ut.length ? ut : ['fallback(happy to discuss)'];
  const newC = ctx.conditions.filter((c) => (c.duration?.elapsedTicks ?? 0) < 2);
  const acute = ctx.threats.filter((t) => t.currentStage === 'imminent' || t.currentStage === 'realized');
  const rc = [ctx.history.recentDisruption ? 'recentDisruption' : null, newC.length ? 'new-condition(<2 ticks)' : null, acute.length ? 'acute-threat(imminent/realized)' : null].filter(Boolean);
  B.recent_changes = rc.length ? rc : ['fallback(usual course)'];
  return { B, chosen, domF, topT, top3, hidden, acute };
}

// the texts each branch must print (a check that the mirror reads the writer right)
const EXPECT = {
  dawn_work: { 'food-critical': /^Dawn work is the search/, 'defense-critical': /^The walls claim/, 'craft-power>=25': /^Smithy fires/, 'merchant>=30+siege': /^The merchants count/, 'merchant-power>=30': /^Merchant caravans/, 'default(bakers)': /^Bakers light/ },
  gathering_places: { 'fallback(well,bridge,square)': /^People gather where they can/ },
  child_warnings: { 'fallback(no threat)': /usual things/ },
  food_culture: { 'surplus+famine/siege': /^The stores still hold/, 'surplus+stable-chain': /are plentiful; markets close/, surplus: /^Bread and broth are plentiful; few/, adequate: /^Hearty grain bread/, 'strained+disrupted-chain': /^Loaves shrink each month; .+ is /, strained: /^Loaves shrink each month; householders/, 'critical+disrupted-chain': /^Rations are tight: /, critical: /^Rations are tight; /, 'collapsed(default)': /^Hunger is everywhere/ },
  commoner_resentments: { 'fallback(any town)': /small grievances of any town/, 'criminal_opportunity>=70': /blind eye/, 'criminal_opportunity>=55': /smugglers/, 'food-strained+': /rising bread prices/, 'legitimacy-strained+': /council's indifference/, corruption_exposed: /officials who keep their posts/ },
  outsider_impressions: { 'fallback(ordinary)': /reads to outsiders as ordinary/, 'dominant-power': /mark is on every door/, 'top-threat>low': /obvious unspoken weight/, 'strained-caps>=3': /civic services run short/ },
  unspoken_topics: { 'fallback(happy to discuss)': /happy to discuss/, unresolvedWound: /"the wound"/, corruption_exposed: /half-whispered in market stalls/ },
  recent_changes: { 'fallback(usual course)': /run their usual course/, 'new-condition(<2 ticks)': /is the new shape of things/, 'acute-threat(imminent/realized)': /has come to a head/ },
};

// ── the FALSE tests: slot, branch it lives on, the clause, the predicate that makes it FALSE (record test named) ──
const FALSE_TESTS = [
  ['dawn_work', 'food-critical', '"the granary queue"', 'no granary: hasInstitution(r,"granary")', (r) => !T.granary(r)],
  ['dawn_work', 'defense-critical', '"The walls claim"', 'no walls: defenceOf(r).walls', (r) => !T.walls(r)],
  ['dawn_work', 'defense-critical', '"the watch musters"', 'no guard force: factsOf(r).guardPresence', (r) => !T.guard(r)],
  ['dawn_work', 'craft-power>=25', '"Smithy fires"', 'no smithy: hasInstitution(r,"smith")', (r) => !T.smithy(r)],
  ['dawn_work', 'craft-power>=25', '"guild-callers"', 'no guild: factsOf(r).guild', (r) => !T.guild(r)],
  ['dawn_work', 'merchant-power>=30', '"Merchant caravans roll"', 'no trade route: tradeRouteOf(r) in ""/isolated/none', (r) => T.routeNone(r)],
  ['dawn_work', 'merchant-power>=30', '"queue at the warehouses"', 'no warehouse: live house /warehouse|storehouse/ (no home)', (r) => !T.warehouse(r)],
  ['dawn_work', 'default(bakers)', '"Bakers light their ovens"', 'no bakery: live house /baker(y)|bakehouse/ (no home)', (r) => !T.bakery(r)],
  ['dawn_work', 'default(bakers)', '"then the smiths"', 'no smithy: hasInstitution(r,"smith")', (r) => !T.smithy(r)],
  ['dawn_work', 'default(bakers)', '"the watch changes"', 'no guard force: factsOf(r).guardPresence', (r) => !T.guard(r)],
  ['dawn_work', 'default(bakers)', '"as the gates open"', 'no gate: defenceOf(r).gate', (r) => !T.gate(r)],
  ['gathering_places', 'fallback(well,bridge,square)', '"the well"', 'no well/water source: live house or quarter landmark /well|water source|aqueduct…/ (no home)', (r) => !T.well(r)],
  ['gathering_places', 'fallback(well,bridge,square)', '"the bridge"', 'no bridge: live house or quarter landmark /bridge/ (no home)', (r) => !T.bridge(r)],
  ['gathering_places', 'fallback(well,bridge,square)', '"the open square"', 'no square: live house, quarter or landmark /square|plaza|green/ (no home; a common is not one)', (r) => !T.square(r)],
  ['gathering_places', 'named:*', 'a named house', 'the named row is not live or is access-only: isLiveInstitution / ACCESS_ONLY', (r, m) => m.chosen.some((i) => !isLiveInstitution(i) || ACCESS_ONLY.test(String(i.name)))],
  ['child_warnings', 'fallback(no threat)', '"the deep well"', 'no well (as above)', (r) => !T.well(r)],
  ['child_warnings', 'fallback(no threat)', '"the woods at twilight"', 'no timber of its own: factsOf(r).timberAtHand (nearest; no woodland home)', (r) => !T.timber(r)],
  ['child_warnings', 'threat:bandit_raids', '"linger at the gates"', 'no gate: defenceOf(r).gate', (r) => !T.gate(r)],
  ['child_warnings', 'threat:economic_collapse', '"the trade quarter"', 'no quarters at all: spatialLayout.quarters', (r) => !T.quarters(r)],
  ['child_warnings', 'threat:economic_collapse', '"the trade quarter"', 'no trade-kind quarter: a quarter named /market|trade|merchant|bazaar|commerc/', (r) => !T.tradeQuarter(r)],
  ['child_warnings', 'threat:economic_collapse', '"the empty stalls"', 'no market: marketOf(r)', (r) => !T.market(r)],
  ['child_warnings', 'threat:plague', '"the sick-house"', 'no hospital or healer: defenceOf(r).hospital|healer', (r) => !T.sickHouse(r)],
  ['child_warnings', 'threat:siege', '"when the bells ring"', 'no sacred house: factsOf(r).sacredHouse (nearest for a bell)', (r) => !T.sacred(r)],
  ['child_warnings', 'threat:rival_neighbor', '"the neighbour"', 'no neighbour: record.neighborRelationship', (r) => !T.neighbour(r)],
  ['child_warnings', 'threat:corruption', '"officials"', 'no appointed post: factsOf(r).appointedPost', (r) => !T.appointedPost(r)],
  ['food_culture', 'surplus+stable-chain', '"markets close their stalls"', 'no market: marketOf(r)', (r) => !T.market(r)],
  ['food_culture', 'adequate', '"the wealthier streets"', 'a thorp or hamlet: record.tier', (r) => T.smallPlace(r)],
  ['food_culture', 'collapsed(default)', '"temple kitchens"', 'no sacred house: factsOf(r).sacredHouse', (r) => !T.sacred(r)],
  ['food_culture', 'collapsed(default)', '"caravans that never arrived"', 'no trade route (as above)', (r) => T.routeNone(r)],
  ['commoner_resentments', 'criminal_opportunity>=70', '"the watch turning a blind eye"', 'no guard force: factsOf(r).guardPresence', (r) => !T.guard(r)],
  ['commoner_resentments', 'food-strained+', '"merchants who claim"', 'no market: marketOf(r)', (r) => !T.market(r)],
  ['commoner_resentments', 'legitimacy-strained+', '"the council\'s indifference"', 'not a council: rulingBodyOf(r) !== true', (r) => !T.council(r)],
  ['commoner_resentments', 'corruption_exposed', '"officials who keep their posts"', 'no appointed post: factsOf(r).appointedPost', (r) => !T.appointedPost(r)],
  ['commoner_resentments', 'fallback(any town)', '"of any town"', 'not a town: factsOf(r).populationBand === "small"', (r) => T.notTown(r)],
  ['commoner_resentments', 'fallback(any town)', '"the gate fee"', 'no gate: defenceOf(r).gate', (r) => !T.gate(r)],
  ['commoner_resentments', 'fallback(any town)', '"market day"', 'no market: marketOf(r)', (r) => !T.market(r)],
  ['commoner_resentments', 'fallback(any town)', '"the council\'s"', 'not a council: rulingBodyOf(r) !== true', (r) => !T.council(r)],
  ['commoner_resentments', 'fallback(any town)', '"favorite tavern"', 'no tavern/inn: hasInstitution(r,"tavern")', (r) => !T.tavern(r)],
  ['outsider_impressions', 'fallback(ordinary)', '"Quiet streets"', 'a thorp or hamlet: record.tier', (r) => T.smallPlace(r)],
  ['outsider_impressions', 'fallback(ordinary)', '"predictable bells"', 'no sacred house: factsOf(r).sacredHouse (nearest)', (r) => !T.sacred(r)],
  ['unspoken_topics', 'corruption_exposed', '"market stalls"', 'no market: marketOf(r)', (r) => !T.market(r)],
];

// ── derive ──
const t1 = Date.now();
let mirrorBad = 0; const mirrorEx = [];
for (const x of rows) {
  const r = x.rec;
  x.dl = deriveDailyLife(r);
  x.ctx = { profiles: deriveAllFactionProfiles(r), chains: deriveAllSupplyChainStates(r), conditions: deriveAllActiveConditions(r),
    threats: deriveAllThreatProfiles(r), capacities: deriveAllCapacities(r), causal: deriveCausalState(r), history: deriveHistoryBeats(r) };
  x.m = mirror(r, x.ctx);
  for (const k of DAILY_LIFE_SLOTS) for (const b of x.m.B[k]) {
    const re = EXPECT[k]?.[b];
    if (re && !re.test(x.dl.slots[k].text)) { mirrorBad++; if (mirrorEx.length < 5) mirrorEx.push(`${x.seed} ${k}:${b} | ${x.dl.slots[k].text.slice(0, 90)}`); }
  }
}
console.log(`derived in ${((Date.now() - t1) / 1000).toFixed(0)}s; MIRROR mismatches (branch named vs text printed): ${mirrorBad}${mirrorEx.length ? `\n  ${mirrorEx.join('\n  ')}` : ''}`);
const bySize = (s) => rows.filter((x) => x.size === s);
const pct = (n, d = N) => `${Math.round((100 * n) / d)}`;
const line = (label, f) => `| ${label} | ${SIZES.map((s) => f(s)).join(' | ')} |`;
const HDR = `| row | ${SIZES.join(' | ')} |\n|---|${SIZES.map(() => '---:').join('|')}|`;

// ── 1. BRANCHES ──
console.log(`\n════ 1. BRANCHES — share by size (places taking the branch / ${N}, %); TOP = the slot's top single text share over all ${N}; DISTINCT = distinct texts`);
const ORDER = ['dawn_work', 'gathering_places', 'child_warnings', 'food_culture', 'commoner_resentments', 'outsider_impressions', 'unspoken_topics', 'recent_changes'];
const ALLBR = {
  dawn_work: Object.keys(EXPECT.dawn_work), gathering_places: ['named:religious', 'named:trade', 'named:inn/hall', 'fallback(well,bridge,square)'],
  child_warnings: ['fallback(no threat)', ...['monster_pressure', 'bandit_raids', 'siege', 'rival_neighbor', 'plague', 'famine', 'corruption', 'unrest', 'arcane_instability', 'cult', 'economic_collapse'].map((t) => `threat:${t}`)],
  food_culture: Object.keys(EXPECT.food_culture), commoner_resentments: Object.keys(EXPECT.commoner_resentments),
  outsider_impressions: Object.keys(EXPECT.outsider_impressions), unspoken_topics: ['hidden/rumored-threat', 'unresolvedWound', 'corruption_exposed', 'fallback(happy to discuss)'],
  recent_changes: ['recentDisruption', 'new-condition(<2 ticks)', 'acute-threat(imminent/realized)', 'fallback(usual course)'],
};
const topTexts = {};
for (const k of ORDER) {
  console.log(`\n[${k}]\n${HDR}`);
  const seen = new Set(rows.flatMap((x) => x.m.B[k]));
  const extra = [...seen].filter((b) => !ALLBR[k].includes(b));
  for (const b of [...ALLBR[k], ...extra]) console.log(line(`${k}:${b}`, (s) => pct(bySize(s).filter((x) => x.m.B[k].includes(b)).length)));
  topTexts[k] = {};
  console.log(line(`${k}: TOP text %`, (s) => {
    const m = new Map(); for (const x of bySize(s)) m.set(x.dl.slots[k].text, (m.get(x.dl.slots[k].text) || 0) + 1);
    const top = [...m].sort((a, b) => b[1] - a[1])[0]; topTexts[k][s] = top; return pct(top[1]);
  }));
  console.log(line(`${k}: DISTINCT texts`, (s) => String(new Set(bySize(s).map((x) => x.dl.slots[k].text)).size)));
  for (const s of SIZES) console.log(`  top ${s}: (${topTexts[k][s][1]}) "${topTexts[k][s][0].slice(0, 140)}"`);
}

// ── 2. FALSE LINES ──
console.log(`\n════ 2. FALSE LINES — places by size printing the clause while the record test says FALSE (count of ${N}); example place id`);
const falseBySlot = {};
for (const [k, br, clause, test, f] of FALSE_TESTS) {
  const on = (x) => (br === 'named:*' ? x.m.B[k].some((b) => b.startsWith('named:')) : x.m.B[k].includes(br));
  const hits = rows.filter((x) => on(x) && f(x.rec, x.m));
  const ex = hits[0]?.seed || '—';
  console.log(`${line(`${k}:${br} ${clause} — ${test}`, (s) => String(hits.filter((x) => x.size === s).length))} e.g. ${ex}`);
  for (const x of hits) (falseBySlot[k] ||= new Set()).add(x.seed);
}
console.log(`\n  places with AT LEAST ONE false clause, by slot:`);
for (const k of ORDER) console.log(line(`${k}: any false`, (s) => String([...(falseBySlot[k] || [])].filter((id) => id.startsWith(`hxd-${s}-`)).length)));
console.log(`  UNTESTABLE (no record test; why):
  dawn_work "before the ovens are warm" — household hearths are not a house kind the record holds;
  dawn_work:craft "apprentices haul water before the bell" — no record of a bell; merchant+siege "porters wait for loads" — no record of porters;
  child_warnings "the strangers' road", "the road past sundown" — every place has a road; no home answers "a road";
  child_warnings "masked strangers", "shimmering air", "crowds", "bread is short" — the threat itself is the fact (true by construction);
  commoner_resentments:criminal_opportunity>=55 "smugglers ... honest carts queue" — a crime score, no carts/tax record;
  outsider_impressions:strained-caps>=3 "missing watch, slow service, or shuttered shops" — says what is ABSENT; "faces that don't yet know yours" — no record;
  outsider_impressions:dominant-power "mark is on every door that matters" — a power's reach, no record of doors (see 7 for the veil);
  unspoken_topics "the matter referenced as \\"the wound\\"" — the beat's own fact; recent_changes:* — the history beat's own text, a condition's label, a threat's label ("has come to a head" fits both imminent and realized stages).`);

// ── 3. FACT REACH ──
console.log(`\n════ 3. FACT REACH — share of the ${N} places by size holding each fact (%). H = a house the fact counts is hideable (cardVeil.js :: isHideableHouse) on >=1 place; C = a crime fact`);
const hideableCounted = (r, re) => liveInstitutions(r).some((i) => re.test(String(i?.name || '')) && isHideableHouse(i));
const marketKinds = { 'market (periodic/weekly/daily/district)': /\bmarkets?\b(?!\s*square)/i, 'market square': /\bmarket squares?\b/i, 'fish market': /\bfish market/i, 'fair': /\bfairs?\b/i, 'trading house (guild+trade tags)': /guild|carrier|caravan/i };
const REACH = [
  ['walls (defenceOf.walls)', (r) => T.walls(r)], ['watch (defenceOf.watch)', (r) => T.watch(r)], ['guard force (factsOf.guardPresence)', (r) => T.guard(r)], ['gates (defenceOf.gate)', (r) => T.gate(r)],
  ['temple/church/shrine (hasInstitution temple)', (r) => T.temple(r)], ['sacred house (factsOf.sacredHouse)', (r) => T.sacred(r)],
  ['dailyLife RELIGIOUS pattern match (any row)', (r) => byPat(r, RELIGIOUS).length > 0, RELIGIOUS],
  ['market (marketOf)', (r) => T.market(r)],
  ...Object.entries(marketKinds).map(([k, re]) => [`  market kind: ${k}`, (r) => liveInstitutions(r).some((i) => isMarketInstitution(i) && re.test(String(i.name)))]),
  ['dailyLife TRADE pattern match (any row)', (r) => byPat(r, TRADE).length > 0, TRADE],
  ['inn/tavern (hasInstitution tavern)', (r) => T.tavern(r)], ['dailyLife INN pattern match (inn|tavern|hall)', (r) => byPat(r, INN).length > 0, INN],
  ['guild/guildhall (factsOf.guild)', (r) => T.guild(r)], ['well/water source (nearest: names, landmarks)', (r) => T.well(r)],
  ['navigable water (waterOf.navigable)', (r) => waterOf(r).navigable], ['mill (hasInstitution mill)', (r) => hasInstitution(r, 'mill')],
  ['bridge (nearest: names, landmarks)', (r) => T.bridge(r)], ['square (nearest: names, quarters, landmarks; not \'common\')', (r) => T.square(r)],
  ['bakery (nearest: names)', (r) => T.bakery(r)], ['smithy (hasInstitution smith)', (r) => T.smithy(r)], ['granary (hasInstitution granary)', (r) => T.granary(r)],
  ['hospital or healer (defenceOf)', (r) => T.sickHouse(r)], ['warehouse (nearest: names)', (r) => T.warehouse(r)],
  ['quarters (spatialLayout.quarters)', (r) => T.quarters(r)], ['trade-kind quarter (quarter name)', (r) => T.tradeQuarter(r)],
  ['trade route none/isolated (tradeRouteOf)', (r) => T.routeNone(r)], ['imports listed (factsOf.imports)', (r) => (safe(() => factsOf(r).imports, []) || []).length > 0],
  ['ruling body of more than one (rulingBodyOf)', (r) => T.council(r)], ['appointed post (factsOf.appointedPost)', (r) => T.appointedPost(r)],
  ['history.recentDisruption (deriveHistoryBeats)', (r, x) => !!x.ctx.history.recentDisruption], ['history.unresolvedWound (deriveHistoryBeats)', (r, x) => !!x.ctx.history.unresolvedWound],
  ['condition corruption_exposed (deriveAllActiveConditions) C', (r, x) => x.ctx.conditions.some((c) => c.archetype === 'corruption_exposed')],
  ['criminal_opportunity >= 55 (deriveCausalState.scores) C', (r, x) => (x.ctx.causal.scores.criminal_opportunity ?? 50) >= 55],
  ['criminal_opportunity >= 70 C', (r, x) => (x.ctx.causal.scores.criminal_opportunity ?? 50) >= 70],
  ['a crime structure (factsOf.crime !== none) C', (r) => safe(() => factsOf(r).crime, 'none') !== 'none'],
  ['any threat hidden or rumored (threat.visibility)', (r, x) => x.m.hidden.length > 0],
];
console.log(HDR);
for (const [label, f, pat] of REACH) {
  const H = pat ? rows.some((x) => hideableCounted(x.rec, pat)) : /market|guild|tavern|inn/.test(label) ? rows.some((x) => liveInstitutions(x.rec).some((i) => isHideableHouse(i) && (/market/.test(label) ? isMarketInstitution(i) : /guild/.test(label) ? /guild/i.test(i.name) : /tavern|inn|hall/i.test(i.name)))) : false;
  console.log(line(`${label}${H ? ' H' : ''}`, (s) => pct(bySize(s).filter((x) => f(x.rec, x)).length)));
}
const dist = (label, f) => {
  const vals = new Set(rows.flatMap((x) => [].concat(f(x.rec, x)).map(String)));
  for (const v of [...vals].sort()) console.log(line(`${label} = ${v}`, (s) => pct(bySize(s).filter((x) => [].concat(f(x.rec, x)).map(String).includes(v)).length)));
};
dist('food source (economicState.foodSecurity.foodRecord.foodSources; factsOf.foodSources)', (r) => safe(() => factsOf(r).foodSources, []) || ['(none)']);
dist('food band (capacity.food_production, the slot\'s read)', (r, x) => x.ctx.capacities.capacities.food_production.band);
dist('prosperity band (factsOf.prosperity; prosperityRank.js :: prosperityLabelOf)', (r) => safe(() => factsOf(r).prosperity) ?? '(none)');
dist('ruler kind (rulerKindOf)', (r) => rulerKindOf(r) ?? '(none)');
dist('public legitimacy band (deriveCausalState.bands)', (r, x) => x.ctx.causal.bands.public_legitimacy ?? '(none)');
dist('trade route (tradeRouteOf)', (r) => tradeRouteOf(r) || '(empty)');
dist('threat kind (deriveAllThreatProfiles.type)', (r, x) => (x.ctx.threats.length ? x.ctx.threats.map((t) => t.type) : ['(none)']));
dist('threat visibility', (r, x) => (x.ctx.threats.length ? x.ctx.threats.map((t) => t.visibility) : ['(none)']));
console.log(`  hideable houses seen on the roster (isHideableHouse), names: ${[...new Set(rows.flatMap((x) => liveInstitutions(x.rec).filter((i) => isHideableHouse(i)).map((i) => String(i.name))))].join('; ')}`);

// ── 4. WHO READS ──
console.log(`\n════ 4. WHO READS THE SLOTS (grep of src/ and supabase/functions, EXECUTED at run time)`);
const grep = (args) => { try { return execFileSync('grep', args, { cwd: L, encoding: 'utf8' }).trim().split('\n').filter(Boolean); } catch { return []; } };
for (const l of grep(['-rnE', 'deriveDailyLife|deriveDailyLifeSlot|summarizeDailyLife|compareDailyLife', 'src/', 'supabase/functions/generate-narrative/'])) if (!/^src\/domain\/dailyLife\.js/.test(l) && !/^\s*(\*|\/\/)/.test(l.split(':').slice(2).join(':'))) console.log(`  ${l.slice(0, 170)}`);
const stored = rows.filter((x) => 'dailyLife' in x.rec).length;
console.log(`  born records carrying a top-level dailyLife field: ${stored}/${rows.length}`);
const bundle = readFileSync(`${L}/supabase/functions/_shared/aiGroundingBundle.js`, 'utf8');
console.log(`  edge bundle supabase/functions/_shared/aiGroundingBundle.js: ${(bundle.match(/Source hash: \w+/) || ['?'])[0]}; deriveDailyLife inlined: ${/function deriveDailyLife\(/.test(bundle)}`);
console.log(`  text pins of slot sentences in tests/lint registers: ${grep(['-rlE', 'The walls claim the first hours|Bakers light their ovens|small grievances of any town|Hearty grain bread', 'tests/']).join(', ')}`);

// ── 5. THE KEY ──
console.log(`\n════ 5. THE KEY (EXECUTED over all ${rows.length})`);
let nameKept = 0, seedGone = 0, fullSeedGone = 0, pubEqual = 0, npcRefs = 0; const pubDiff = {};
for (const x of rows) {
  const p = toPublicSafe(x.rec), pf = toPublicSafe(x.rec, { full: true });
  if (p.name === x.rec.name) nameKept++;
  if (!('_seed' in p)) seedGone++;
  if (!('_seed' in pf)) fullSeedGone++;
  const d = deriveDailyLife(p); let same = true;
  for (const k of DAILY_LIFE_SLOTS) if (d.slots[k].text !== x.dl.slots[k].text) { same = false; pubDiff[k] = (pubDiff[k] || 0) + 1; }
  if (same) pubEqual++;
  if (DAILY_LIFE_SLOTS.some((k) => x.dl.slots[k].references.some((rf) => rf.type === 'npc'))) npcRefs++;
}
console.log(`  toPublicSafe keeps name: ${nameKept}/${rows.length}; strips _seed (default): ${seedGone}/${rows.length}; strips _seed (full): ${fullSeedGone}/${rows.length}`);
console.log(`  IF deriveDailyLife ran on toPublicSafe(record): all 8 slots equal on ${pubEqual}/${rows.length}; slots that differ: ${JSON.stringify(pubDiff)}`);
console.log(`  places whose slot references name an npc: ${npcRefs}/${rows.length}`);

// ── 7. THE HIDEABLE READS ──
console.log(`\n════ 7. THE HIDEABLE READS (EXECUTED): places by size`);
const isHiddenLabel = (x, k) => x.m.hidden.some((t) => x.dl.slots[k].text.toLowerCase().includes(String(t.label).toLowerCase()));
const powerOf = (x, prof) => (x.rec.powerStructure?.factions || []).find((f) => (f.faction ?? f.name) === prof?.name);
const HID = [
  ['gathering_places names a hideable house (isHideableHouse of the row picked)', (x) => x.m.chosen.some((i) => isHideableHouse(i))],
  ['outsider_impressions names a veiled power (isVeiledPower of the dominant power)', (x) => x.m.B.outsider_impressions.includes('dominant-power') && isVeiledPower(powerOf(x, x.m.domF))],
  ['outsider_impressions prints a hidden/rumored threat label', (x) => isHiddenLabel(x, 'outsider_impressions')],
  ['child_warnings prints a hidden/rumored threat label', (x) => isHiddenLabel(x, 'child_warnings')],
  ['child_warnings takes threat:corruption or threat:cult', (x) => x.m.B.child_warnings.some((b) => b === 'threat:corruption' || b === 'threat:cult')],
  ['recent_changes prints a hidden/rumored threat label', (x) => isHiddenLabel(x, 'recent_changes')],
  ['unspoken_topics prints a hidden/rumored threat label', (x) => isHiddenLabel(x, 'unspoken_topics')],
  ['commoner_resentments reads criminal_opportunity >= 55', (x) => x.m.B.commoner_resentments.some((b) => b.startsWith('criminal_opportunity'))],
  ['commoner_resentments or unspoken_topics read corruption_exposed', (x) => x.m.B.commoner_resentments.includes('corruption_exposed') || x.m.B.unspoken_topics.includes('corruption_exposed')],
];
for (const [label, f] of HID) { const hits = rows.filter(f); console.log(`${line(label, (s) => String(hits.filter((x) => x.size === s).length))} e.g. ${hits[0]?.seed || '—'}`); }
console.log(`  hideable names picked by gathering_places: ${[...new Set(rows.flatMap((x) => x.m.chosen.filter((i) => isHideableHouse(i)).map((i) => i.name)))].join('; ') || 'none'}`);
const src = readFileSync(`${L}/src/domain/dailyLife.js`, 'utf8').split('\n');
const at = (needle) => { const i = src.findIndex((l) => l.includes(needle)); return i < 0 ? '?' : `${i + 1}: ${src[i].trim().slice(0, 130)}`; };
for (const n of ['const crimScore = causalState.scores.criminal_opportunity', "const corruption = ctx.conditions.find(c => c.archetype === 'corruption_exposed');", "const hidden = ctx.threats.filter(t => t.visibility === 'hidden'", 'const trade = institutionByPattern(s, TRADE_PATTERN);', 'const inns = institutionByPattern(s, INN_PATTERN);', '.sort((a, b) => (b.power || 0) - (a.power || 0))[0];', "case 'corruption':", "case 'cult':", 'parts.push(`${top.label.toLowerCase()} is the obvious', 'changes.push(`${t.label.toLowerCase()} has come to a head`);', 'deriveAllNpcProfiles(settlement),']) console.log(`  dailyLife.js:${at(n)}`);
// ── 8. THE COHERENCE BATTERY (added on DAILY-1's word, the chair's) ──
// The mark: generationCoherenceReceipt.judgments[id=record_coherence_battery].status, written at birth by
// generators/recordBatteryFindings.js :: recordBatteryJudgment over recordTextSurfaces(record) (the STORED strings).
const { recordBatteryFindings, RECORD_BATTERY_CHECKS } = await import(`${L}/src/generators/recordBatteryFindings.js`);
const { recordBattery } = await import(`${L}/src/domain/coherence/recordBattery.js`);
console.log(`\n════ 8. THE COHERENCE BATTERY — generators/recordBatteryFindings.js :: recordBatteryJudgment (the receipt's record_coherence_battery judgment)`);
const SKIP = new Set(['config', 'generationCoherenceReceipt', 'simulationTrace']);
const pathsOf = (rec, quote) => {
  const q = quote.replace(/…$/, ''); const out = new Set(); const seen = new Set();
  const walk = (v, p) => {
    if (typeof v === 'string') { if (v.replace(/\s+/g, ' ').includes(q)) out.add(p.replace(/\.\d+/g, '[]').split('.').slice(0, 3).join('.')); return; }
    if (v == null || typeof v !== 'object' || seen.has(v)) return; seen.add(v);
    if (Array.isArray(v)) { v.forEach((e, i) => walk(e, `${p}.${i}`)); return; }
    for (const [k, e] of Object.entries(v)) { if (k.startsWith('_') || SKIP.has(k)) continue; walk(e, p ? `${p}.${k}` : k); }
  };
  walk(rec, ''); return [...out];
};
const norm = (s) => String(s || '').replace(/\s+/g, ' ').replace(/…$/, '').trim();
let storedEqRecomputed = 0, unplaced = 0; const bySlot = {}; const causeCount = new Map(), causeEx = new Map(), pathCount = new Map(), carried = {}, hyp = {};
for (const x of rows) {
  const j = (x.rec.generationCoherenceReceipt?.judgments || []).find((g) => g.id === 'record_coherence_battery');
  x.batStatus = j?.status ?? '(absent)';
  const fresh = recordBatteryFindings(x.rec);
  if ((j?.findings || []).length === fresh.length) storedEqRecomputed++;
  x.findings = fresh;
  for (const f of fresh) {
    const key = `${f.path} — ${f.detail}`.slice(0, 110);
    causeCount.set(key, (causeCount.get(key) || 0) + 1); if (!causeEx.has(key)) causeEx.set(key, `${x.seed}: "${String(f.evidence || '').slice(0, 70)}"`);
    const ps = f.evidence ? pathsOf(x.rec, norm(f.evidence)) : ['(no quote)'];
    for (const p of ps) pathCount.set(p, (pathCount.get(p) || 0) + 1);
    if (!ps.length) for (const k of DAILY_LIFE_SLOTS) if (x.dl.slots[k].text.replace(/\s+/g, ' ').includes(norm(f.evidence))) (bySlot[k] ||= new Set()).add(x.seed);
    if (!ps.length) unplaced++;
    for (const k of DAILY_LIFE_SLOTS) if (f.evidence && x.dl.slots[k].text.replace(/\s+/g, ' ').includes(norm(f.evidence))) (carried[k] ||= new Set()).add(x.seed);
  }
  // HYPOTHETICAL: the battery's word instruments over each slot's text as if it were a stored string (only findings quoting that text).
  for (const k of DAILY_LIFE_SLOTS) {
    const text = x.dl.slots[k].text;
    const fs = [...recordBattery(x.rec, { record: text }, { only: RECORD_BATTERY_CHECKS.filter((c) => c !== 'tier-noun') }),
      ...(/town/i.test(text) ? recordBattery(x.rec, { record: text }, { only: ['tier-noun'] }) : [])]
      .filter((f) => norm(f.quote) && text.replace(/\s+/g, ' ').includes(norm(f.quote)));
    if (fs.length) { (hyp[k] ||= { seeds: new Set(), why: new Map() }).seeds.add(x.seed); for (const f of fs) { const w = `${f.check}: ${String(f.detail).slice(0, 60)}`; hyp[k].why.set(w, (hyp[k].why.get(w) || 0) + 1); } }
  }
}
console.log(`  stored judgment findings count == recomputed recordBatteryFindings(record): ${storedEqRecomputed}/${rows.length}`);
console.log(HDR);
console.log(line('marked needs_review (record_coherence_battery)', (s) => String(bySize(s).filter((x) => x.batStatus === 'needs_review').length)));
console.log(line('receipt.status needs_review (the receipt\'s own)', (s) => String(bySize(s).filter((x) => x.rec.generationCoherenceReceipt?.status === 'needs_review').length)));
console.log(line('born records with a stored dailyLife field', (s) => String(bySize(s).filter((x) => 'dailyLife' in x.rec).length)));
for (const k of ORDER) console.log(line(`flagged BECAUSE OF ${k} text (quote in the slot, in NO stored string)`, (sz) => String([...(bySlot[k] || [])].filter((id) => id.startsWith(`hxd-${sz}-`)).length)));
console.log(`  finding rows whose quote sits in no stored string: ${unplaced}`);
for (const k of ORDER) console.log(line(`${k} text CONTAINS a flagged quote (carried, the cause is the stored string)`, (s) => String([...(carried[k] || [])].filter((id) => id.startsWith(`hxd-${s}-`)).length)));
console.log(`\n  causes (finding rows, all ${rows.length}), by check — detail, count, example:`);
for (const [k, c] of [...causeCount].sort((a, b) => b[1] - a[1])) console.log(`    ${String(c).padStart(4)}  ${k}  e.g. ${causeEx.get(k)}`);
console.log(`  causes by size (finding rows):`);
for (const chk of [...new Set(rows.flatMap((x) => x.findings.map((f) => f.path)))]) console.log(line(chk, (s) => String(bySize(s).reduce((n, x) => n + x.findings.filter((f) => f.path === chk).length, 0))));
console.log(`  the stored field holding each finding's quote (record path, 3 segments; a quote may sit in several):`);
for (const [p, c] of [...pathCount].sort((a, b) => b[1] - a[1]).slice(0, 20)) console.log(`    ${String(c).padStart(4)}  ${p}`);
console.log(`  HYPOTHETICAL — places the battery WOULD flag on a slot's own text were it stored (findings quoting the slot text):`);
for (const k of ORDER) console.log(`${line(k, (s) => String([...(hyp[k]?.seeds || [])].filter((id) => id.startsWith(`hxd-${s}-`)).length))} ${[...(hyp[k]?.why || [])].map(([w, c]) => `${w} (${c})`).join('; ')}`);

console.log(`\ndone in ${((Date.now() - t0) / 1000).toFixed(0)}s`);
