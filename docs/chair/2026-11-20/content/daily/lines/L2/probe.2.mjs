#!/usr/bin/env node
/**
 * RUN (from the repository root):
 *   node docs/chair/2026-11-20/content/daily/lines/L2/probe.2.mjs > docs/chair/2026-11-20/content/daily/lines/L2/probe.2b.out.txt 2>&1
 * (L2b, the chair's ruling of 18:47: the beat by its event's name, crime wounds fall through, the defence ratings are no threat,
 * the power part only where the top power clearly leads, the second outsider part by keyed pick.)
 *
 * DAILY-1 · L2 — the probe of the pools in pools.2.mjs over M1's births (150 a size, seeds hxd-<size>-0..149, PAGE-9's THIN
 * recipe, copied from measures/M1/measure.m1.mjs). For each place and slot: the branches the record takes, the ELIGIBLE
 * wordings of each (every declared need true), the pick `pickVariantMixed(eligible, '<record.name>::dailyLife.<slot>::<branch>')`,
 * the slot text composed. Prints by size: top single text share, top sentence share, distinct count, empty share, min
 * eligible per branch beside the bar's reach / 0.15, and the FALSE-LINE counts by every M1 test and this probe's word tests.
 * Measure only: nothing is written to a record, nothing under src/ is touched. L2_CACHE=<jsonl> reads births from a
 * drafting cache instead of birthing (never for the recorded run).
 */
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { FOOD, COMMONER, COMMONER_DM, OUTSIDER, UNSPOKEN, RECENT } from './pools.2.mjs';
const HERE = dirname(fileURLToPath(import.meta.url));
const L = resolve(HERE, '../../../../../../..');
const REL = 'docs/chair/2026-11-20/content/daily/lines/L2';
console.log(`RE-RUN: node ${REL}/probe.2.mjs > ${REL}/probe.2b.out.txt 2>&1`);

const { generateSettlementPipeline } = await import(`${L}/src/generators/generateSettlementPipeline.js`);
const { birthConfig, loadGenerationLawPayloads } = await import(`${L}/src/domain/density/densityCreateBoundary.js`);
const { DEFAULT_CONFIG } = await import(`${L}/src/store/configSlice.js`);
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
const { marketOf } = await import(`${L}/src/domain/facts/market.js`);
const { rulingBodyOf } = await import(`${L}/src/domain/facts/rulingBody.js`);
const { rulerKindOf } = await import(`${L}/src/domain/facts/rulerKind.js`);
const { tradeRouteOf } = await import(`${L}/src/domain/facts/terrain.js`);
const { ACCESS_ONLY } = await import(`${L}/src/domain/facts/liveInstitutionNames.js`);
const { liveInstitutions } = await import(`${L}/src/domain/institutions/institutionRoster.js`);
const { isVeiledPower } = await import(`${L}/src/domain/people/cardVeil.js`);
const { pickVariantMixed } = await import(`${L}/src/kernel/proseHash.js`);
const { leaderLeadOfRecord } = await import(`${L}/src/domain/facts/leaderLead.js`);
const { EVENT_TYPE_NAMES } = await import(`${L}/src/data/historyData.js`);
const { VISIBLE_CAPACITY_LENSES } = await import(`${L}/src/domain/capacityModel.js`);
const { powerNameWithArticle, powerNameAfterArticle, powerPossessive, fillAgreement } = await import(`${L}/src/domain/display/powerSentenceName.js`);
const { SOURCE_WORDS } = await import(`${L}/src/domain/foodways.js`);
const { recordBattery, RECORD_BATTERY_CHECKS } = await import(`${L}/src/domain/coherence/recordBattery.js`);

const SIZES = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
const N = 150;
const t0 = Date.now();
let rows = [];
if (process.env.L2_CACHE) {
  rows = readFileSync(process.env.L2_CACHE, 'utf8').split('\n').filter(Boolean).map((l) => JSON.parse(l));
  console.log(`births: ${rows.length} READ FROM THE DRAFTING CACHE ${process.env.L2_CACHE} (not a recorded run)`);
} else {
  await loadGenerationLawPayloads();
  for (const size of SIZES) for (let i = 0; i < N; i++) {
    const seed = `hxd-${size}-${i}`;
    rows.push({ seed, size, rec: generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, settType: size }), null, { seed, customContent: {} }) });
  }
  console.log(`births: ${rows.length} (${N} a size, M1's recipe) in ${((Date.now() - t0) / 1000).toFixed(0)}s`);
}

// ── the record tests a wording may declare (fact home first; the nearest field where no home answers, named) ──
const safe = (f, d = undefined) => { try { return f(); } catch { return d; } };
const liveNames = (rec) => liveInstitutions(rec).map((i) => String(i?.name || '')).filter((n) => n && !ACCESS_ONLY.test(n));
const srcs = (c) => c.f.foodSources || [];
const importsGrain = (c) => (safe(() => c.f.imports, []) || []).some((g) => /\bgrain\b/i.test(typeof g === 'string' ? g : String(g?.name ?? g?.good ?? '')));
const PROSPEROUS = ['prosperous', 'comfortable'], POOR = ['poor', 'struggling'];
export const NEEDS = {
  grain: ['factsOf(r).foodSources has grain', (r, c) => srcs(c).includes('grain')],
  grainHeld: ['factsOf(r).foodSources has grain or mill, or factsOf(r).imports names grain', (r, c) => srcs(c).includes('grain') || srcs(c).includes('mill') || importsGrain(c)],
  grainImport: ['factsOf(r).imports names grain, and factsOf(r).foodSources has no grain', (r, c) => importsGrain(c) && !srcs(c).includes('grain')],
  fish: ['factsOf(r).foodSources has fish', (r, c) => srcs(c).includes('fish')],
  game: ['factsOf(r).foodSources has game', (r, c) => srcs(c).includes('game')],
  livestock: ['factsOf(r).foodSources has livestock', (r, c) => srcs(c).includes('livestock')],
  mill: ['factsOf(r).foodSources has mill', (r, c) => srcs(c).includes('mill')],
  growsMore: ['factsOf(r).growsMoreThanEats', (r, c) => !!c.f.growsMoreThanEats],
  stores: ['factsOf(r).storesMonths > 0', (r, c) => (c.f.storesMonths ?? 0) > 0],
  market: ['factsOf(r).market (marketOf)', (r, c) => !!c.f.market],
  sacred: ['factsOf(r).sacredHouse', (r, c) => !!c.f.sacredHouse],
  route: ['factsOf(r).route not ""/isolated/none (tradeRouteOf)', (r, c) => !['', 'isolated', 'none'].includes(String(c.f.route ?? ''))],
  notSmall: ['factsOf(r).tier not thorp or hamlet', (r, c) => !['thorp', 'hamlet'].includes(c.f.tier)],
  prosperous: ['factsOf(r).prosperity prosperous or comfortable', (r, c) => PROSPEROUS.includes(c.f.prosperity)],
  notProsperous: ['factsOf(r).prosperity not prosperous or comfortable', (r, c) => !PROSPEROUS.includes(c.f.prosperity)],
  poor: ['factsOf(r).prosperity poor or struggling', (r, c) => POOR.includes(c.f.prosperity)],
  guard: ['factsOf(r).guardPresence', (r, c) => !!c.f.guardPresence],
  noGuard: ['!factsOf(r).guardPresence', (r, c) => !c.f.guardPresence],
  watch: ['defenceOf(r).watch', (r, c) => !!c.d.watch],
  gate: ['defenceOf(r).gate', (r, c) => !!c.d.gate],
  legitimacyGrave: ['deriveCausalState().bands.public_legitimacy critical or collapsed', (r, c) => ['critical', 'collapsed'].includes(c.causal.bands.public_legitimacy)],
  smuggling: ['OWNER-ONLY: a live house /smuggl/ (liveInstitutionNames; the crime key criminalStructureKey.js reads the same names) or an income row /smuggl/ (economicState.incomeSources, criminalIncome.js\'s list)', (r, c) => liveNames(r).some((n) => /smuggl/i.test(n)) || (r.economicState?.incomeSources || []).some((i) => /smuggl/i.test(String(i?.source ?? i?.name ?? i?.label ?? '')))],
  healer: ['defenceOf(r).healer || defenceOf(r).hospital', (r, c) => !!(c.d.healer || c.d.hospital)],
  noHealer: ['!(defenceOf(r).healer || defenceOf(r).hospital)', (r, c) => !(c.d.healer || c.d.hospital)],
  gov: ['rulerKindOf(r) !== null (powerStructure.government named)', (r, c) => c.kind !== null],
  council: ['rulingBodyOf(r) === true', (r, c) => c.body === true],
  elders: ["rulerKindOf(r) 'elder' && rulingBodyOf(r) && government label /elder/", (r, c) => c.kind === 'elder' && c.body === true && /\belder/i.test(c.gov)],
  headman: ["rulerKindOf(r) 'elder' && !rulingBodyOf(r) && government label /headman/", (r, c) => c.kind === 'elder' && c.body === false && /\bheadman/i.test(c.gov)],
  mayor: ["rulerKindOf(r) 'mayor' && government label /mayor/", (r, c) => c.kind === 'mayor' && /\bmayor/i.test(c.gov)],
  reeve: ["rulerKindOf(r) 'mayor' && government label /reeve/", (r, c) => c.kind === 'mayor' && /\breeve/i.test(c.gov)],
  steward: ["rulerKindOf(r) 'lord' && government label /steward/", (r, c) => c.kind === 'lord' && /\bsteward/i.test(c.gov)],
  guild: ['factsOf(r).guild', (r, c) => !!c.f.guild],
  magic: ['factsOf(r).magic.functions', (r, c) => !!c.f.magic?.functions],
  'power.merchant': ["the dominant power's archetype merchant (deriveAllFactionProfiles)", (r, c) => c.dom?.archetype === 'merchant'],
  'power.religious': ["the dominant power's archetype religious", (r, c) => c.dom?.archetype === 'religious'],
  'power.military': ["the dominant power's archetype military", (r, c) => c.dom?.archetype === 'military'],
};
for (const pools of [FOOD, COMMONER, COMMONER_DM, OUTSIDER, UNSPOKEN, RECENT]) for (const [b, pool] of Object.entries(pools)) for (const x of pool) for (const n of x.needs) if (!NEEDS[n]) throw new Error(`unknown need ${n} in ${b}`);

const BAD = ['strained', 'critical', 'collapsed'];
function ctxOf(r) {
  const f = factsOf(r);
  const profiles = deriveAllFactionProfiles(r);
  const factions = r.powerStructure?.factions || [];
  const rowOf = (p) => factions.find((x) => (x.faction ?? x.name) === p?.name);
  const ranked = profiles.slice().sort((a, b) => (b.power || 0) - (a.power || 0));
  const top = ranked[0];
  return {
    f, d: defenceOf(r), profiles, top, dom: top && !isVeiledPower(rowOf(top)) && top.archetype !== 'criminal' ? top : null,
    domVeiled: !!top && (isVeiledPower(rowOf(top)) || top.archetype === 'criminal'),
    chains: deriveAllSupplyChainStates(r), conditions: deriveAllActiveConditions(r), threats: deriveAllThreatProfiles(r),
    capacities: deriveAllCapacities(r), causal: deriveCausalState(r), history: deriveHistoryBeats(r),
    gov: String(r.powerStructure?.government ?? ''), kind: rulerKindOf(r), body: rulingBodyOf(r),
    lead: leaderLeadOfRecord(r).leadOverSecond, event: String(deriveHistoryBeats(r).recentDisruption?.references?.eventName ?? ''),
  };
}
const holds = (x, r, c) => x.needs.every((n) => NEEDS[n][1](r, c));
const cap = (s) => (s ? s[0].toUpperCase() + s.slice(1) : s);
function fill(t, c, bare = false) {
  if (bare) return cap(fillAgreement(t, { gov: c.gov, power: c.dom?.name ?? '' }).replace(/\{[^}]*\}/g, 'NAME'));
  const names = { gov: c.gov, power: c.dom?.name ?? '' };
  const ev = c.event.replace(/^the\s+/i, '');
  let s = fillAgreement(t, names).replace(/\{Event\}/g, `The ${ev}`).replace(/\{event\}/g, `the ${ev}`);
  s = s.replace(/\{Gov\}/g, powerNameWithArticle(c.gov, true)).replace(/\{gov\}/g, powerNameWithArticle(c.gov))
    .replace(/\{power's\}/g, `the ${powerPossessive(powerNameAfterArticle(names.power))}`)
    .replace(/\{Power\}/g, powerNameWithArticle(names.power, true)).replace(/\{power\}/g, powerNameWithArticle(names.power));
  if (/[{}]/.test(s)) throw new Error(`unfilled: ${s}`);
  return cap(s);
}
/** one branch: the eligible wordings, the keyed pick (rule 2) */
function pick(slot, branch, pool, r, c) {
  const eligible = (pool || []).filter((x) => holds(x, r, c));
  const chosen = pickVariantMixed(eligible, `${r.name}::dailyLife.${slot}::${branch}`);
  return { branch, n: eligible.length, w: chosen, text: chosen ? fill(chosen.t, c) : '', bare: chosen ? fill(chosen.t, c, true) : '' };
}

// ── the five slots ──
const formOf = (t) => {
  switch (t.type) {
    case 'unrest': return t.originSurface === 'activeConditions' ? 'void' : t.originSurface === 'defenseProfile' ? 'order' : 'stressor';
    case 'economic_collapse': return t.originSurface === 'defenseProfile' ? 'supply' : t.originSurface === 'activeConditions' ? 'route' : 'stressor';
    case 'monster_pressure': return t.originSurface === 'config' ? (/overrun/i.test(String(t.label)) ? 'overrun' : 'frontier') : 'stressor';
    default: return 'any';
  }
};
/** L2b (ruling 3): the defence's ORDER and SUPPLY ratings are no threat in any slot */
const isRating = (t) => t.originSurface === 'defenseProfile' && (t.type === 'unrest' || t.type === 'economic_collapse');
/** L2b (ruling 1): an event of a crime or corruption kind, by data/historyData.js :: EVENT_TYPE_NAMES */
const CRIME_EVENT_NAMES = new Set([EVENT_TYPE_NAMES.crime_wave, EVENT_TYPE_NAMES.corruption_scandal]);
function foodCulture(r, c) {
  const band = c.capacities.capacities.food_production.band;
  const wanting = c.threats.some((t) => t.type === 'famine' || t.type === 'siege');
  const branch = band === 'surplus' ? (wanting ? 'surplus.wanting' : 'surplus') : ['adequate', 'strained', 'critical'].includes(band) ? band : 'collapsed';
  const p = pick('food_culture', branch, FOOD[branch], r, c);
  return { parts: [p], text: p.text };
}
function commoner(r, c) {
  const parts = [];
  if (BAD.includes(c.causal.bands.public_legitimacy)) parts.push(pick('commoner_resentments', 'legitimacy', COMMONER.legitimacy, r, c));
  if (BAD.includes(c.capacities.capacities.food_production.band)) parts.push(pick('commoner_resentments', 'food', COMMONER.food, r, c));
  if (c.f.uprising) parts.push(pick('commoner_resentments', 'uprising', COMMONER.uprising, r, c));
  return { parts, text: parts.map((p) => p.text).filter(Boolean).join(' ') };
}
/** OWNER-ONLY (the chair's ruling of 18:26): today's two crime clauses, measured here; never on a shared read */
function commonerDm(r, c) {
  const crim = c.causal.scores.criminal_opportunity ?? 50;
  const branch = crim >= 70 ? 'crime70' : crim >= 55 ? 'crime55' : null;
  const parts = branch ? [pick('commoner_resentments_dm', branch, COMMONER_DM[branch], r, c)] : [];
  return { parts, text: parts.map((p) => p.text).join(' ') };
}
function outsider(r, c) {
  const parts = [];
  if (c.dom) parts.push(c.lead === null || c.lead > 6 ? pick('outsider_impressions', 'power', OUTSIDER.power, r, c) : pick('outsider_impressions', 'power.level', OUTSIDER['power.level'], r, c));
  const open = c.threats.filter((t) => t.visibility === 'open' && !isRating(t)).sort((a, b) => b.severity - a.severity)[0];
  let real = false;
  if (open && open.severityBand !== 'low') { const b = `threat.${open.type}.${formOf(open)}`; if (OUTSIDER[b]) { parts.push(pick('outsider_impressions', b, OUTSIDER[b], r, c)); real = true; } }
  const lenses = VISIBLE_CAPACITY_LENSES.filter((n) => BAD.includes(c.capacities.bands[n])).map((n) => `services.${n}`);
  const strained9 = CAPACITY_NAMES.filter((n) => BAD.includes(c.capacities.bands[n])).length;
  const options = real ? (strained9 >= 3 ? lenses : []) : [...lenses, 'ordinary'];
  const second = pickVariantMixed(options, `${r.name}::dailyLife.outsider_impressions::second`);
  if (second) parts.push(pick('outsider_impressions', second, OUTSIDER[second], r, c));
  return { parts, text: parts.map((p) => p.text).filter(Boolean).join(' ') };
}
function unspoken(r, c) {
  const parts = [];
  const wound = c.history.unresolvedWound;
  const ts = (Array.isArray(r.history?.currentTensions) ? r.history.currentTensions : []).map((t) => (t && typeof t === 'object' ? t.type : undefined));
  const CRIME_WOUND = ['crime_wave', 'corruption_scandal'];
  // L2b (ruling 2): a crime wound falls to the next tension the record holds that a pool can say; a non-crime wound stays as it is
  let type = ts[0];
  if (wound && CRIME_WOUND.includes(type)) type = ts.slice(1).find((x) => !CRIME_WOUND.includes(x) && UNSPOKEN[`wound.${x}`]);
  if (wound && type && UNSPOKEN[`wound.${type}`]) parts.push(pick('unspoken_topics', `wound.${type}`, UNSPOKEN[`wound.${type}`], r, c));
  return { parts, text: parts.map((p) => p.text).filter(Boolean).join(' '), woundType: wound ? ts[0] ?? '(no type)' : null, fell: wound && type !== ts[0] };
}
function recent(r, c) {
  const parts = [];
  const beat = c.history.recentDisruption;
  if (beat && c.event && !CRIME_EVENT_NAMES.has(c.event)) parts.push(pick('recent_changes', 'beat', RECENT.beat, r, c));
  const fresh = c.conditions.filter((x) => (x.duration?.elapsedTicks ?? 0) < 2);
  for (const k of fresh.slice(0, 2)) { const b = `condition.${k.archetype}`; if (RECENT[b] && !parts.some((p) => p.branch === b)) parts.push(pick('recent_changes', b, RECENT[b], r, c)); }
  const acute = c.threats.filter((t) => t.visibility === 'open' && !isRating(t) && (t.currentStage === 'imminent' || t.currentStage === 'realized')).sort((a, b) => b.severity - a.severity);
  for (const t of acute.slice(0, 2)) { const b = `threat.${t.type}.${formOf(t)}.${t.currentStage}`; if (RECENT[b] && !parts.some((p) => p.branch === b)) parts.push(pick('recent_changes', b, RECENT[b], r, c)); }
  const anySource = !!beat || fresh.length > 0 || c.threats.some((t) => !isRating(t) && (t.currentStage === 'imminent' || t.currentStage === 'realized'));
  if (!parts.length && !anySource) parts.push(pick('recent_changes', 'calm', RECENT.calm, r, c));
  return { parts, text: parts.map((p) => p.text).filter(Boolean).join(' ') };
}
const SLOTS = { food_culture: foodCulture, commoner_resentments: commoner, commoner_resentments_dm: commonerDm, outsider_impressions: outsider, unspoken_topics: unspoken, recent_changes: recent };
const SLOTKEYS = Object.keys(SLOTS);

const t1 = Date.now();
for (const x of rows) { x.c = ctxOf(x.rec); x.out = {}; for (const k of SLOTKEYS) x.out[k] = SLOTS[k](x.rec, x.c); }
console.log(`slots derived in ${((Date.now() - t1) / 1000).toFixed(0)}s`);
const bySize = (s) => rows.filter((x) => x.size === s);
const pct = (n, d = N) => Math.round((100 * n) / d);
const HDR = `| row | ${SIZES.join(' | ')} |\n|---|${SIZES.map(() => '---:').join('|')}|`;
const line = (label, f) => `| ${label} | ${SIZES.map((s) => f(s)).join(' | ')} |`;
const sentencesOf = (text) => String(text || '').split(/(?<=[.!?])\s+(?=[A-Z])/).map((s) => s.trim()).filter(Boolean);

// ── 1. SHARES ──
console.log(`\n════ 1. SHARES by size (of ${N}, %): TOP TEXT = the top single non-empty slot text; TOP SENTENCE = the top sentence (places printing it); EMPTY = slot text ''`);
console.log(HDR);
const summary = {};
for (const k of SLOTKEYS) {
  summary[k] = {};
  for (const s of SIZES) {
    const xs = bySize(s);
    const m = new Map(), sm = new Map();
    for (const x of xs) {
      const t = x.out[k].text;
      if (t) m.set(t, (m.get(t) || 0) + 1);
      for (const se of new Set(sentencesOf(t))) sm.set(se, (sm.get(se) || 0) + 1);
    }
    const top = [...m].sort((a, b) => b[1] - a[1])[0] || ['', 0];
    const tops = [...sm].sort((a, b) => b[1] - a[1]).slice(0, 3);
    summary[k][s] = { top: top[1], topText: top[0], topS: tops[0]?.[1] || 0, tops, distinct: m.size, empty: xs.filter((x) => !x.out[k].text).length };
  }
  console.log(line(`${k}: TOP TEXT %`, (s) => pct(summary[k][s].top)));
  console.log(line(`${k}: TOP SENTENCE %`, (s) => pct(summary[k][s].topS)));
  console.log(line(`${k}: DISTINCT texts`, (s) => summary[k][s].distinct));
  console.log(line(`${k}: EMPTY %`, (s) => pct(summary[k][s].empty)));
}
for (const k of SLOTKEYS) for (const s of SIZES) console.log(`  ${k} ${s}: top sentences ${summary[k][s].tops.map(([t, n]) => `(${n}) "${t.slice(0, 110)}"`).join(' · ')}`);

// ── 2. BRANCHES: reach, the bar's need (ceil(reach / 0.15)), the min eligible ──
console.log(`\n════ 2. BRANCHES — reach % · need = ceil(reach/0.15) · MIN eligible over the places taking it (SHORT where min < need)`);
const branchStats = new Map();
for (const x of rows) for (const k of SLOTKEYS) for (const p of x.out[k].parts) {
  const key = `${k}:${p.branch}`; const e = branchStats.get(key) || {}; (e[x.size] ||= []).push(p.n); branchStats.set(key, e);
}
let short = 0, zero = 0;
for (const [key, e] of [...branchStats].sort()) {
  const cells = SIZES.map((s) => {
    const a = e[s] || []; if (!a.length) return '—';
    const need = Math.ceil(a.length / N / 0.15 - 1e-9), min = Math.min(...a);
    if (min < need) short++; if (min === 0) zero++;
    return `${pct(a.length)}·${need}·${min}${min < need ? ' SHORT' : ''}`;
  });
  console.log(`| ${key} | ${cells.join(' | ')} |`);
}
console.log(`  branches SHORT of the bar (min eligible < need), size cells: ${short}; cells where a place had NO eligible wording: ${zero}`);
const minAll = (k) => (s) => { let m = Infinity; for (const [key, e] of branchStats) if (key.startsWith(`${k}:`) && e[s]?.length) { const need = Math.ceil(e[s].length / N / 0.15 - 1e-9); m = Math.min(m, Math.min(...e[s]) - need); } return m === Infinity ? '—' : (m >= 0 ? `+${m}` : String(m)); };
for (const k of SLOTKEYS) console.log(line(`${k}: min (eligible - need) over branches`, minAll(k)));

// ── 3. FALSE LINES ──
console.log(`\n════ 3. FALSE LINES — places by size printing a clause the record test says is false (must be 0)`);
const anyLive = (rec, re) => liveNames(rec).some((n) => re.test(n));
const quarters = (rec) => (Array.isArray(rec?.spatialLayout?.quarters) ? rec.spatialLayout.quarters : []);
const landmarks = (rec) => quarters(rec).flatMap((q) => (Array.isArray(q?.landmarks) ? q.landmarks.map(String) : []));
const T = { // M1's record tests (measure.m1.mjs, copied)
  walls: (r) => defenceOf(r).walls, watch: (r) => defenceOf(r).watch, guard: (r) => safe(() => factsOf(r).guardPresence, false), gate: (r) => defenceOf(r).gate,
  bakery: (r) => anyLive(r, /\bbak(?:er|ers|ery|eries|ehouse)\b/i), smithy: (r) => hasInstitution(r, 'smith'), granary: (r) => hasInstitution(r, 'granary'),
  quarters: (r) => quarters(r).length > 0, tradeQuarter: (r) => quarters(r).some((q) => /\bmarket|\btrade|\bmerchant|\bbazaar|\bcommerc/i.test(String(q?.name || ''))),
  market: (r) => marketOf(r), well: (r) => anyLive(r, /\bwells?\b|\bwater source|\bwater sources\b|\bwater system|\bwater infrastructure|\baqueduct/i) || landmarks(r).some((l) => /\bwells?\b|\bwater source/i.test(l)),
  bridge: (r) => anyLive(r, /\bbridges?\b/i) || landmarks(r).some((l) => /\bbridges?\b/i.test(l)),
  square: (r) => anyLive(r, /\bsquares?\b|\bplaza\b|\bgreen\b/i) || quarters(r).some((q) => /\bsquares?\b|\bplaza\b|\bgreen\b/i.test(String(q?.name || ''))),
  smallPlace: (r) => r.tier === 'thorp' || r.tier === 'hamlet', notTown: (r) => safe(() => factsOf(r).populationBand) === 'small',
  routeNone: (r) => ['', 'isolated', 'none'].includes(tradeRouteOf(r)), warehouse: (r) => anyLive(r, /\bwarehouse|\bstorehouse/i),
  sacred: (r) => safe(() => factsOf(r).sacredHouse, false), council: (r) => rulingBodyOf(r) === true, tavern: (r) => hasInstitution(r, 'tavern'),
  guild: (r) => safe(() => factsOf(r).guild, false), sickHouse: (r) => defenceOf(r).hospital || defenceOf(r).healer, neighbour: (r) => !!r.neighborRelationship,
  appointedPost: (r) => safe(() => factsOf(r).appointedPost, false), timber: (r) => safe(() => factsOf(r).timberAtHand, false),
};
const M1_CLAUSES = [ // every clause of M1's FALSE_TESTS (any slot), read over the five new slot texts
  ['the granary queue', (r) => !T.granary(r)], ['The walls claim', (r) => !T.walls(r)], ['the watch musters', (r) => !T.guard(r)],
  ['Smithy fires', (r) => !T.smithy(r)], ['guild-callers', (r) => !T.guild(r)], ['Merchant caravans roll', (r) => T.routeNone(r)],
  ['queue at the warehouses', (r) => !T.warehouse(r)], ['Bakers light their ovens', (r) => !T.bakery(r)], ['then the smiths', (r) => !T.smithy(r)],
  ['the watch changes', (r) => !T.guard(r)], ['as the gates open', (r) => !T.gate(r)], ['the well', (r) => !T.well(r)], ['the bridge', (r) => !T.bridge(r)],
  ['the open square', (r) => !T.square(r)], ['the deep well', (r) => !T.well(r)], ['the woods at twilight', (r) => !T.timber(r)],
  ['linger at the gates', (r) => !T.gate(r)], ['the trade quarter', (r) => !T.tradeQuarter(r)], ['the empty stalls', (r) => !T.market(r)],
  ['the sick-house', (r) => !T.sickHouse(r)], ['when the bells ring', (r) => !T.sacred(r)], ['the neighbour', (r) => !T.neighbour(r)],
  ['officials', (r) => !T.appointedPost(r)], ['markets close their stalls', (r) => !T.market(r)], ['the wealthier streets', (r) => T.smallPlace(r)],
  ['temple kitchens', (r) => !T.sacred(r)], ['caravans that never arrived', (r) => T.routeNone(r)], ['the watch turning a blind eye', (r) => !T.guard(r)],
  ['merchants who claim', (r) => !T.market(r)], ["the council's indifference", (r) => !T.council(r)], ['officials who keep their posts', (r) => !T.appointedPost(r)],
  ['of any town', (r) => T.notTown(r)], ['the gate fee', (r) => !T.gate(r)], ['market day', (r) => !T.market(r)], ["the council's", (r) => !T.council(r)],
  ['favorite tavern', (r) => !T.tavern(r)], ['Quiet streets', (r) => T.smallPlace(r)], ['predictable bells', (r) => !T.sacred(r)], ['market stalls', (r) => !T.market(r)],
];
// this probe's word tests (read on the wording with the filled power names struck: a name is the record's, not the line's word): a word a wording says, the record test that must hold (absence wordings, needs noGuard/noHealer, are exempt for their house)
const WORDS = [
  ['market words (market|stalls|merchants|vendors|prices|dear)', /\bmarkets?\b|\bstalls?\b|\bmerchants?\b|\bvendors?\b|\bprices?\b|\bdear\b/i, (r, c) => !!c.f.market, null],
  ['sacred words (temple|shrine|church|chapel|bells)', /\btemples?\b|\bshrines?\b|\bchurch|\bchapel|\bbells?\b/i, (r, c) => !!c.f.sacredHouse, null],
  ['watch words (the watch|watchman)', /\bthe watch\b|\bwatch(?:man|men)\b/i, (r, c) => !!c.d.watch, 'noGuard'],
  ['guard words (guards|soldiers|garrison)', /\bguards?\b|\bsoldiers?\b|\bgarrison/i, (r, c) => !!c.f.guardPresence, 'noGuard'],
  ['walls', /\bwalls?\b/i, (r, c) => !!c.d.walls, null], ['gates', /\bgates?\b/i, (r, c) => !!c.d.gate, null],
  ['council', /\bcouncil\b/i, (r, c) => c.body === true, null],
  ['healer words (healer|hospital)', /\bhealers?\b|\bhospital/i, (r, c) => !!(c.d.healer || c.d.hospital), 'noHealer'],
  ['guild', /\bguilds?\b/i, (r, c) => !!c.f.guild, null], ['mill', /\bmill\b/i, (r, c) => srcs(c).includes('mill') || hasInstitution(r, 'mill'), null],
  ['tavern|inn', /\btaverns?\b|\binns?\b/i, (r, c) => hasInstitution(r, 'tavern'), null],
  ['the elders', /\bthe elders\b/i, (r, c) => c.kind === 'elder', null], ['headman', /\bheadman\b/i, (r, c) => /headman/i.test(c.gov), null],
  ['mayor', /\bmayor\b/i, (r, c) => c.kind === 'mayor', null], ['reeve', /\breeve\b/i, (r, c) => /reeve/i.test(c.gov), null],
  ["steward|lord", /\bsteward\b|\blord\b/i, (r, c) => c.kind === 'lord', null], ['streets', /\bstreets?\b/i, (r, c) => !['thorp', 'hamlet'].includes(c.f.tier), null],
  ['grain words (foodways SOURCE_WORDS.grain; loaves)', new RegExp(`${SOURCE_WORDS.grain.source}|\\bloaf\\b|\\bloaves\\b|\\bflour\\b`, 'i'), (r, c) => srcs(c).includes('grain') || srcs(c).includes('mill') || importsGrain(c), null],
  ['livestock words (SOURCE_WORDS.livestock)', SOURCE_WORDS.livestock, (r, c) => srcs(c).includes('livestock'), null],
  ['fish words (SOURCE_WORDS.fish)', SOURCE_WORDS.fish, (r, c) => srcs(c).includes('fish'), null],
  ['game words (SOURCE_WORDS.game)', SOURCE_WORDS.game, (r, c) => srcs(c).includes('game'), null],
  ['"town" (rule 4)', /\btowns?\b/i, () => false, null],
];
const CRIME = /\bcrim|\bsmuggl|\bcorrupt|\bthie(?:f|ves)\b|\bbrib|\bblack market|\bgraft\b|\bvigilant/i;
const RULE7 = /\b(?:spring|summer|autumn|winter|harvest|rain|snow|frost|storm|drought|years?|months?|weeks?|seasons?|ago)\b|\d/i;
const LABELS = /civic stability at risk|economic fragility|frontier monster pressure|region overrun with monsters|referenced as|has come to a head|obvious unspoken weight|new shape of things|"the wound"/i;
const fl = new Map(); const flEx = new Map();
const hit = (label, x, ex) => { const e = fl.get(label) || {}; e[x.size] = (e[x.size] || 0) + 1; fl.set(label, e); if (!flEx.has(label)) flEx.set(label, `${x.seed}: ${ex.slice(0, 120)}`); };
for (const x of rows) {
  const r = x.rec, c = x.c;
  for (const k of SLOTKEYS) {
    const out = x.out[k];
    const flagged = new Set();
    const mark = (label, ex) => { if (!flagged.has(label)) { flagged.add(label); hit(label, x, ex); } };
    for (const p of out.parts) {
      if (p.w && !holds(p.w, r, c)) mark(`${k}: a DECLARED need false (construction)`, p.text);
      for (const [clause, f] of M1_CLAUSES) if (p.text.toLowerCase().includes(clause.toLowerCase()) && f(r)) mark(`${k}: M1 clause "${clause}"`, p.text);
      for (const [label, re, test, exempt] of WORDS) if (re.test(p.bare) && !(exempt && p.w?.needs.includes(exempt)) && !test(r, c)) mark(`${k}: word ${label}`, p.text);
      if (CRIME.test(p.bare) && k !== 'commoner_resentments_dm') mark(`${k}: a crime word (rule 6)`, p.text);
      if (RULE7.test(p.bare)) mark(`${k}: a rule-7 word`, p.text);
      if (RULE7.test(p.text) && !RULE7.test(p.bare)) mark(`${k}: a rule-7 word inside a record name (record text, e.g. an event's name)`, p.text);
      if (LABELS.test(p.text)) mark(`${k}: a machine label (rule 5)`, p.text);
    }
    const text = out.text;
    if (text) {
      const fs = [...recordBattery(r, { record: text }, { only: RECORD_BATTERY_CHECKS.filter((ch) => ch !== 'tier-noun') }), ...(/town/i.test(text) ? recordBattery(r, { record: text }, { only: ['tier-noun'] }) : [])]
        .filter((f) => f.quote && text.replace(/\s+/g, ' ').includes(String(f.quote).replace(/…$/, '').replace(/\s+/g, ' ').trim()));
      const beatText = out.parts.find((p) => p.branch === 'beat')?.text || '';
      for (const f of fs) mark(beatText.includes(String(f.quote).replace(/…$/, '').trim()) ? `${k}: battery ${f.check} quoting the beat's own text (record text)` : `${k}: battery ${f.check} (the slot text as if stored)`, `${f.detail} :: ${f.quote}`);
    }
  }
}
console.log(HDR);
if (!fl.size) console.log(`| (no false line of any test, any slot) | ${SIZES.map(() => '0').join(' | ')} |`);
for (const [label, e] of [...fl].sort()) console.log(`${line(label, (s) => String(e[s] || 0))} e.g. ${flEx.get(label)}`);
const recordOnly = (label) => /record text/.test(label);
for (const k of SLOTKEYS) console.log(line(`${k}: FALSE (my wordings, every test)`, (s) => String([...fl].filter(([l]) => l.startsWith(`${k}:`) && !recordOnly(l)).reduce((n, [, e]) => n + (e[s] || 0), 0))));

// ── 4. THE WORDINGS' OWN SHAPE (static, every wording filled with each size's names): words 8..30 ──
console.log(`\n════ 4. WORDINGS: count, and any outside 8..30 words when printed (over every printed part)`);
const allPools = { food_culture: FOOD, commoner_resentments: COMMONER, commoner_resentments_dm: COMMONER_DM, outsider_impressions: OUTSIDER, unspoken_topics: UNSPOKEN, recent_changes: RECENT };
for (const [k, pools] of Object.entries(allPools)) console.log(`  ${k}: ${Object.keys(pools).length} branches, ${Object.values(pools).reduce((n, p) => n + p.length, 0)} wordings`);
const wc = new Map();
for (const x of rows) for (const k of SLOTKEYS) for (const p of x.out[k].parts) if (p.text) { const n = p.text.split(/\s+/).length; if (n < 8 || n > 30) wc.set(p.text, n); }
console.log(`  printed parts outside 8..30 words: ${wc.size}${wc.size ? '\n    ' + [...wc].map(([t, n]) => `${n}: ${t}`).join('\n    ') : ''}`);
const never = [];
const used = new Set(rows.flatMap((x) => SLOTKEYS.flatMap((k) => x.out[k].parts.map((p) => p.w?.t)).filter(Boolean)));
for (const [k, pools] of Object.entries(allPools)) for (const [b, pool] of Object.entries(pools)) for (const x of pool) if (!used.has(x.t)) never.push(`${k}:${b} "${x.t.slice(0, 70)}"`);
console.log(`  wordings never printed on these 900 (rare branches or needs): ${never.length}`);

// ── 5. WHAT FEEDS THE SLOTS (record reach, %) ──
console.log(`\n════ 5. FEEDS (share of ${N}, %)`);
console.log(HDR);
const R = (label, f) => console.log(line(label, (s) => pct(bySize(s).filter(f).length)));
R('unspoken: a wound held (deriveHistoryBeats.unresolvedWound)', (x) => !!x.c.history.unresolvedWound);
R('unspoken: the wound is crime_wave or corruption_scandal', (x) => ['crime_wave', 'corruption_scandal'].includes(x.out.unspoken_topics.woundType));
R('unspoken: a crime wound FELL to the next sayable tension (L2b)', (x) => !!x.out.unspoken_topics.fell && !!x.out.unspoken_topics.text);
R('unspoken: EMPTY (a crime wound with no sayable tension after it, or no pool)', (x) => !x.out.unspoken_topics.text);
R('commoner: legitimacy strained+ / food strained+ / uprising', (x) => x.out.commoner_resentments.parts.some((p) => p.branch === 'legitimacy'));
R('  food strained+', (x) => x.out.commoner_resentments.parts.some((p) => p.branch === 'food'));
R('  uprising (factsOf.uprising)', (x) => x.out.commoner_resentments.parts.some((p) => p.branch === 'uprising'));
R('commoner_dm (OWNER-ONLY): criminal_opportunity >= 70 / >= 55', (x) => x.out.commoner_resentments_dm.parts.some((p) => p.branch === 'crime70'));
R('  >= 55 (and < 70)', (x) => x.out.commoner_resentments_dm.parts.some((p) => p.branch === 'crime55'));
R('outsider: power named (clearly leads)', (x) => x.out.outsider_impressions.parts.some((p) => p.branch === 'power'));
R('  dominant power veiled or criminal: not named', (x) => x.c.domVeiled);
R('  powers level (leaderLeadOfRecord leadOverSecond <= 6): power.level said', (x) => x.out.outsider_impressions.parts.some((p) => p.branch === 'power.level'));
R('  ordinary said (keyed pick, no real threat)', (x) => x.out.outsider_impressions.parts.some((p) => p.branch === 'ordinary'));
R('  threat said', (x) => x.out.outsider_impressions.parts.some((p) => p.branch.startsWith('threat.')));
R('  service said (keyed pick among strained VISIBLE lenses)', (x) => x.out.outsider_impressions.parts.some((p) => p.branch.startsWith('services.')));
R('recent: the beat / a new condition said / an acute threat said / calm', (x) => x.out.recent_changes.parts.some((p) => p.branch === 'beat'));
R('  new condition said', (x) => x.out.recent_changes.parts.some((p) => p.branch.startsWith('condition.')));
R('  acute threat said', (x) => x.out.recent_changes.parts.some((p) => p.branch.startsWith('threat.')));
R('  calm pool', (x) => x.out.recent_changes.parts.some((p) => p.branch === 'calm'));
R('  EMPTY (a source held, none sayable: crime condition etc.)', (x) => !x.out.recent_changes.text);
R('  a beat held but NOT said (its event a crime or corruption kind)', (x) => !!x.c.history.recentDisruption && !x.out.recent_changes.parts.some((p) => p.branch === 'beat'));
R('food: a food source listed (factsOf.foodSources)', (x) => srcs(x.c).length > 0);

// ── 6. EXAMPLES (first two places of each size) ──
console.log(`\n════ 6. EXAMPLES`);
for (const s of SIZES) for (const x of bySize(s).slice(0, 2)) {
  console.log(`  ${x.seed} (${x.rec.name})`);
  for (const k of SLOTKEYS) console.log(`    ${k}: ${x.out[k].text || "'' (EMPTY)"}`);
}

// ── 7. THE SUMMARY BLOCK (for LINES-2.md) ──
console.log(`\n════ 7. SUMMARY BLOCK — top text % / top sentence % / empty % / distinct, by size; FALSE = my wordings' false lines, every test`);
console.log(`| slot | ${SIZES.join(' | ')} | FALSE |\n|---|${SIZES.map(() => '---').join('|')}|---:|`);
for (const k of SLOTKEYS) {
  const F = [...fl].filter(([l]) => l.startsWith(`${k}:`) && !recordOnly(l)).reduce((n, [, e]) => n + Object.values(e).reduce((a, b) => a + b, 0), 0);
  console.log(`| ${k} | ${SIZES.map((s) => `${pct(summary[k][s].top)}/${pct(summary[k][s].topS)}/${pct(summary[k][s].empty)}/${summary[k][s].distinct}`).join(' | ')} | ${F} |`);
}
console.log(`\ndone in ${((Date.now() - t0) / 1000).toFixed(0)}s`);
