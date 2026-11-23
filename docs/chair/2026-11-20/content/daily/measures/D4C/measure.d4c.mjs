#!/usr/bin/env node
/**
 * RUN (from the repository root, through the gate mutex):
 *   sh scripts/gate-mutex.sh --run -- node docs/chair/2026-11-20/content/daily/measures/D4C/measure.d4c.mjs > docs/chair/2026-11-20/content/daily/measures/D4C/d4c.out.txt 2>&1
 *
 * DAILY-4 · D4C — MEASURE ONLY (brief: ../../briefs/D4C-MEASURE.md). The owner's three: (1) one fact twice on a page,
 * (2) the same sentence in two places, (3) "the Headman's Authority's mark". Nothing under src/ or tests/ is changed.
 *
 * Births: M1's 900 (150 a size, seeds hxd-<size>-0..149), M1's recipe COPIED, not imported:
 *   loadGenerationLawPayloads(); generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, settType }), null, { seed, customContent: {} }).
 * The page: deriveDailyLife(record) (the eight public slots, DAILY_LIFE_PAGE_SLOTS order) and, SEPARATELY,
 * deriveDailyLife(record, { audience: 'owner' }).slots.commoner_resentments_dm (the owner-only slot).
 *
 * THE INSTRUMENT (the derivation returns no pool row): every slot picks a line by THE ROUTE
 * (dailyLife.js :: pickNameable = filterDeclared(pool) -> every named {house} nameable -> pickVariantMixed(eligible,
 * '<name>::dailyLife.<slot>::<branch>')). The pick of a branch is a pure function of the record and the branch, so this
 * script re-runs the route for EVERY branch of the slot's pools (the same door, the same house finder copied from
 * dailyLife.js :: DAILY_HOUSES, the same key) and keeps the branches whose pick's template (placeholders as wildcards)
 * is found in the printed text: that is the row the page printed, and its branch is what the derivation drew it ON.
 * COVERAGE line: places whose printed text is not wholly covered by matched rows (0 = the instrument read every part).
 */
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
const HERE = dirname(fileURLToPath(import.meta.url));
const L = resolve(HERE, '../../../../../../..');
const REL = 'docs/chair/2026-11-20/content/daily/measures/D4C';
console.log(`RE-RUN: sh scripts/gate-mutex.sh --run -- node ${REL}/measure.d4c.mjs > ${REL}/d4c.out.txt 2>&1`);

const { generateSettlementPipeline } = await import(`${L}/src/generators/generateSettlementPipeline.js`);
const { birthConfig, loadGenerationLawPayloads } = await import(`${L}/src/domain/density/densityCreateBoundary.js`);
const { DEFAULT_CONFIG } = await import(`${L}/src/store/configSlice.js`);
const { deriveDailyLife, DAILY_LIFE_PAGE_SLOTS } = await import(`${L}/src/domain/dailyLife.js`);
const { deriveAllFactionProfiles } = await import(`${L}/src/domain/factionProfile.js`);
const { deriveAllThreatProfiles } = await import(`${L}/src/domain/threatProfile.js`);
const { filterDeclared } = await import(`${L}/src/domain/facts/drawDeclared.js`);
const { factsOf } = await import(`${L}/src/domain/facts/factsOf.js`);
const { INSTITUTION_KIND_PATTERNS, ACCESS_ONLY } = await import(`${L}/src/domain/facts/institutions.js`);
const { isMarketInstitution } = await import(`${L}/src/domain/facts/market.js`);
const { liveInstitutions } = await import(`${L}/src/domain/institutions/institutionRoster.js`);
const { nativeSemanticName } = await import(`${L}/src/domain/content/customContentSemanticAuthority.js`);
const { isHideableHouse } = await import(`${L}/src/domain/people/cardVeil.js`);
const { powerNameAfterArticle } = await import(`${L}/src/domain/display/powerSentenceName.js`);
const { pickVariantMixed } = await import(`${L}/src/kernel/proseHash.js`);
const { GATHERING_NAMED, GATHERING_PLAIN } = await import(`${L}/src/data/dailyLife/gatheringPlaces.js`);
const { DAWN_WORK } = await import(`${L}/src/data/dailyLife/dawnWork.js`);
const { CHILD_WARNINGS } = await import(`${L}/src/data/dailyLife/childWarnings.js`);
const { COMMONER_RESENTMENTS_DM } = await import(`${L}/src/data/dailyLife/commonerResentmentsDm.js`);
const { COMMONER_RESENTMENTS } = await import(`${L}/src/data/dailyLife/commonerResentments.js`);
const { FOOD_CULTURE } = await import(`${L}/src/data/dailyLife/foodCulture.js`);
const { OUTSIDER_IMPRESSIONS } = await import(`${L}/src/data/dailyLife/outsiderImpressions.js`);
const { UNSPOKEN_TOPICS } = await import(`${L}/src/data/dailyLife/unspokenTopics.js`);
const { RECENT_CHANGES } = await import(`${L}/src/data/dailyLife/recentChanges.js`);
await loadGenerationLawPayloads();

const DM = 'commoner_resentments_dm';
const SIZES = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
const N = Number(process.env.D4C_N || 150); // D4C_N: a smoke run only; the measure is 150
const POOLS = {
  outsider_impressions: OUTSIDER_IMPRESSIONS, dawn_work: DAWN_WORK, food_culture: FOOD_CULTURE,
  gathering_places: { named: GATHERING_NAMED, plain: GATHERING_PLAIN }, child_warnings: CHILD_WARNINGS,
  commoner_resentments: COMMONER_RESENTMENTS, unspoken_topics: UNSPOKEN_TOPICS, recent_changes: RECENT_CHANGES,
  [DM]: COMMONER_RESENTMENTS_DM,
};
// the placeholders a slot's deriver FILLS before the route (dailyLife.js: withGovernment, withPower, the beat's fill);
// any other {word} is a house the route must name
const FILLED = (slot, branch) => {
  if (slot === 'commoner_resentments') return ['gov'];
  if (slot === 'outsider_impressions' && (branch === 'power' || branch === 'power.level')) return ['power', 'Power'];
  if (slot === 'outsider_impressions' && branch.startsWith('services.')) return ['gov'];
  if (slot === 'recent_changes' && branch === 'beat') return ['Event', 'event'];
  return [];
};

// ── the house finder, COPIED from dailyLife.js (DAILY_HOUSES, nameableRows, houseFinder) ──
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
  const bits = text.split(/\{[^{}]*\}/);
  const src = bits.map(esc).join('(.+?)') + (/\{[^{}]*\}$/.test(text) ? '' : '');
  const fixed = /\{[^{}]*\}$/.test(text) ? src.replace(/\(\.\+\?\)$/, '([^,.]+)') : src;
  const re = new RegExp(fixed);
  reCache.set(text, re);
  return re;
}

/** Every branch's pick for a record, by THE ROUTE; the ones found in the printed text are the parts. */
function readSlot(rec, slot, text, house) {
  const facts = factsOf(rec);
  const name = typeof rec.name === 'string' && rec.name ? rec.name : null;
  const parts = [];
  for (const [branch, pool] of Object.entries(POOLS[slot])) {
    const eligible0 = filterDeclared(pool, { facts, poolId: `dailyLife.${slot}.${branch}`, surface: 'dailyLife' });
    const filled = FILLED(slot, branch);
    const eligible = eligible0.filter((l) => [...l.text.matchAll(/\{(\w+)\}/g)].map((m) => m[1]).filter((k) => !filled.includes(k)).every((k) => !!house(k)));
    const pick = pickVariantMixed(eligible, name ? `${name}::dailyLife.${slot}::${branch}` : null);
    if (!pick) continue;
    const m = templateRe(pick.text).exec(text);
    if (!m) continue;
    parts.push({ slot, branch, id: pick.id, template: pick.text, needs: [...(pick.needs || [])], said: m[0], at: m.index, eligible: eligible.length, poolSize: pool.length });
  }
  // one printed span read by two branches (the same wording in two pools): keep both, flagged
  parts.sort((a, b) => a.at - b.at || b.said.length - a.said.length);
  const spans = new Map();
  for (const p of parts) {
    const k = `${p.at}:${p.said.length}`;
    if (!spans.has(k)) spans.set(k, []);
    spans.get(k).push(p);
  }
  const out = [];
  for (const group of spans.values()) {
    const p = group[0];
    p.alsoBranches = group.slice(1).map((g) => `${g.branch}#${g.id}`);
    out.push(p);
  }
  // drop a span wholly inside another (a short wildcard pick matching inside a longer sentence)
  const kept = out.filter((p) => !out.some((q) => q !== p && q.at <= p.at && q.at + q.said.length >= p.at + p.said.length && q.said.length > p.said.length));
  // the parts out first (a `none` line is a whole sentence, frame and all), then the two-kind frame
  let rest = text;
  for (const p of kept) rest = rest.split(p.said).join(' ');
  if (slot === 'child_warnings') rest = rest.replace(/^\s*Children are warned about /, '').replace(/\s*, and about /g, ' ').replace(/\.\s*$/, '');
  return { parts: kept, uncovered: rest.replace(/\s+/g, '') };
}

// ── facts: what a part was drawn ON (the branch key, made concrete), and its declared atoms ──
const OUTSIDE = ['siege', 'monster_pressure', 'bandit_raids', 'rival_neighbor'];
const MED = ['medium', 'high', 'critical'];
const STATE_ATOM = /^(crisis:|famine$|food surplus$|grain imported$|stores:|prosperity:)/;
const SCALE_ATOM = /^(tier:|population:)/;
function factsOfPart(p, ctx, i, threatRefs) {
  const f = [];
  const { slot, branch } = p;
  if (slot === 'food_culture') {
    if (branch === 'surplus') f.push('food:surplus');
    else if (branch === 'surplus.wanting') { f.push('food:surplus'); for (const t of ctx.threats) if (t.type === 'famine' || t.type === 'siege') f.push(`threat:${t.type}`); }
    else if (branch === 'adequate') f.push('food:adequate');
    else f.push('food:want');
  } else if (slot === 'dawn_work') {
    if (branch === 'food') f.push('food:want');
    else if (branch === 'defence') { f.push('defence:want'); for (const t of ctx.threats) if (OUTSIDE.includes(t.type) && MED.includes(t.severityBand)) f.push(`threat:${t.type}`); }
    else if (branch === 'craft') f.push(`power:${ctx.profiles.find((x) => x.archetype === 'craft')?.name}`);
    else if (branch === 'merchant') f.push(`power:${ctx.profiles.find((x) => x.archetype === 'merchant')?.name}`);
    else if (branch === 'merchant_siege') f.push(`power:${ctx.profiles.find((x) => x.archetype === 'merchant')?.name}`, 'threat:siege');
  } else if (slot === 'child_warnings') {
    if (branch !== 'none') {
      const ref = threatRefs[i];
      const t = ref ? ctx.threats.find((x) => x.id === ref.id) : null;
      f.push(`threat:${t?.type ?? (branch === 'default' ? 'default' : branch)}`);
    }
  } else if (slot === 'commoner_resentments') {
    f.push(branch === 'legitimacy' ? 'legitimacy:want' : branch === 'food' ? 'food:want' : 'tension:popular_uprising');
  } else if (slot === 'outsider_impressions') {
    if (branch === 'power') f.push(`power:${ctx.top?.name}`);
    else if (branch === 'power.level') f.push('power:no-clear-lead');
    else if (branch.startsWith('threat.')) f.push(`threat:${branch.split('.')[1]}`);
    else if (branch === 'services.food_production') f.push('food:want');
    else if (branch === 'services.defense') f.push('defence:want');
    else if (branch.startsWith('services.')) f.push(`cap:${branch.slice(9)}:want`);
  } else if (slot === 'unspoken_topics') {
    f.push(`tension:${branch.slice(6)}`);
  } else if (slot === 'recent_changes') {
    if (branch === 'beat') f.push(`event:${ctx.beatEvent}`);
    else if (branch.startsWith('condition.')) f.push(`condition:${branch.slice(10)}`);
    else if (branch.startsWith('threat.')) f.push(`threat:${branch.split('.')[1]}`);
  } else if (slot === DM) f.push('crime:criminal_opportunity');
  for (const a of p.needs) if (STATE_ATOM.test(a)) f.push(`atom:${a}`);
  return [...new Set(f)];
}
// the TOPIC layer (coarse; an explicit alias table, so nothing is joined that is not listed here)
const TOPIC = {};
const topic = (name, keys) => { for (const k of keys) TOPIC[k] = name; };
topic('danger outside', ['threat:monster_pressure', 'threat:siege', 'threat:bandit_raids', 'threat:rival_neighbor', 'tension:external_threat', 'condition:war_pressure', 'condition:war_mobilization', 'condition:regional_conflict_pressure', 'condition:regional_protection_gap', 'defence:want', 'atom:crisis: under_siege']);
topic('sickness', ['threat:plague', 'condition:plague', 'tension:plague_years', 'cap:healing:want']);
topic('hunger', ['food:want', 'threat:famine', 'condition:famine', 'condition:food_anchor_lost', 'condition:regional_import_shortage', 'tension:resource_scarcity', 'atom:famine']);
topic('rule', ['legitimacy:want', 'tension:legitimacy_crisis', 'tension:tyranny', 'tension:leadership_vacuum', 'tension:succession_crisis', 'condition:government_overthrown', 'condition:coup_suppressed', 'cap:administrative:want', 'condition:regional_authority_instability']);
topic('uprising', ['tension:popular_uprising', 'condition:rebellion', 'threat:unrest']);
topic('trade', ['threat:economic_collapse', 'tension:trade_collapse', 'tension:market_crash', 'condition:trade_route_cut', 'condition:regional_route_disruption', 'condition:trade_embargo', 'condition:regional_export_market_loss', 'tension:trade_dispute', 'tension:outside_debt']);
topic('magic', ['threat:arcane_instability', 'condition:magical_instability', 'tension:magical_controversy', 'tension:wild_magic', 'cap:magical:want']);

// ── the things a part NAMES (borderline): its houses, a power's or the government's name in its text, its naming atoms ──
function thingsOfPart(p, rec, powerNames) {
  const t = [];
  for (const m of p.template.matchAll(/\{(\w+)\}/g)) if (!['gov', 'power', 'Power', 'Event', 'event'].includes(m[1])) t.push(`house:${m[1] === 'church' || m[1] === 'cathedral' ? 'sacred' : m[1]}`);
  for (const pn of powerNames) if (pn.body && p.said.includes(pn.body)) t.push(`name:${pn.body}`);
  for (const a of p.needs) if (!STATE_ATOM.test(a) && !SCALE_ATOM.test(a)) t.push(`atom:${a}`);
  return [...new Set(t)];
}

// ── births ──
const t0 = Date.now();
const pages = [];
let uncoveredPlaces = 0; const uncoveredEx = [];
let ambiguous = 0; const ambiguousEx = new Map();
for (const size of SIZES) for (let i = 0; i < N; i++) {
  const seed = `hxd-${size}-${i}`;
  const rec = generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, settType: size }), null, { seed, customContent: {} });
  const pub = deriveDailyLife(rec);
  const own = deriveDailyLife(rec, { audience: 'owner' });
  // the public eight are the same whatever the audience (dailyLife.js's law); checked
  for (const k of DAILY_LIFE_PAGE_SLOTS) if (pub.slots[k].text !== own.slots[k].text) console.log(`AUDIENCE MISMATCH ${seed} ${k}`);
  const profiles = deriveAllFactionProfiles(rec);
  const threats = deriveAllThreatProfiles(rec);
  const ctx = { profiles, threats, top: [...profiles].sort((a, b) => (b.power || 0) - (a.power || 0))[0] };
  const beatRef = pub.slots.recent_changes.references.find((r) => r.id === 'history.recentDisruption');
  ctx.beatEvent = beatRef?.label ?? '?';
  const factions = Array.isArray(rec?.powerStructure?.factions) ? rec.powerStructure.factions : [];
  const gov = String(rec?.powerStructure?.government ?? '');
  const powerNames = [...new Set([gov, ...factions.map((f) => String(f?.faction ?? ''))].filter(Boolean))].map((raw) => ({ raw, body: powerNameAfterArticle(raw) }));
  const house = houseFinder(rec);
  const slots = {};
  for (const k of [...DAILY_LIFE_PAGE_SLOTS, DM]) {
    const sl = k === DM ? own.slots[DM] : pub.slots[k];
    const text = typeof sl?.text === 'string' ? sl.text.trim() : '';
    if (!text || text === '—') { slots[k] = { text: '', parts: [] }; continue; }
    const { parts, uncovered } = readSlot(rec, k, text, house);
    if (uncovered) { uncoveredPlaces++; if (uncoveredEx.length < 8) uncoveredEx.push(`${seed} ${k}: "${uncovered.slice(0, 80)}" in "${text.slice(0, 160)}"`); }
    const threatRefs = (sl.references || []).filter((r) => r.type === 'threat');
    parts.forEach((p, j) => {
      p.facts = factsOfPart(p, ctx, j, threatRefs);
      p.topics = [...new Set(p.facts.map((f) => TOPIC[f]).filter(Boolean))];
      p.things = thingsOfPart(p, rec, powerNames);
      if (p.alsoBranches.length) { ambiguous++; const key = `${k} ${p.branch}#${p.id} = ${p.alsoBranches.join(',')}`; ambiguousEx.set(key, (ambiguousEx.get(key) || 0) + 1); }
    });
    slots[k] = { text, parts };
  }
  pages.push({ seed, size, name: rec.name, slots, powerNames });
}
console.log(`births: ${pages.length} (${N} a size) in ${((Date.now() - t0) / 1000).toFixed(0)}s`);
console.log(`COVERAGE: printed slot texts not wholly read back to pool rows: ${uncoveredPlaces}`);
for (const e of uncoveredEx) console.log(`  uncovered: ${e}`);
console.log(`AMBIGUITY: parts whose printed span is the pick of two or more branches: ${ambiguous}`);
for (const [k, n] of [...ambiguousEx].sort((a, b) => b[1] - a[1]).slice(0, 12)) console.log(`  ${n}  ${k}`);

const ORDER = [...DAILY_LIFE_PAGE_SLOTS, DM];
const pct = (n, d) => (d ? `${((100 * n) / d).toFixed(1)}%` : '-');
const bySize = (m) => SIZES.map((z) => m[z] || 0).join(' / ');
const sum = (m) => SIZES.reduce((a, z) => a + (m[z] || 0), 0);

// ════ TABLE 1 ════
function pairTable(selectKey, label, publicOnly, dmOnly, excludeSharedFact) {
  const T = new Map(); // key -> { size counts (pages), example }
  for (const pg of pages) {
    const seen = new Set();
    const list = ORDER.flatMap((k) => pg.slots[k].parts);
    for (let a = 0; a < list.length; a++) for (let b = a + 1; b < list.length; b++) {
      const A = list[a], B = list[b];
      if (A.slot === B.slot) continue;
      const hasDm = A.slot === DM || B.slot === DM;
      if (publicOnly && hasDm) continue;
      if (dmOnly && !hasDm) continue;
      if (excludeSharedFact && A.facts.some((f) => B.facts.includes(f))) continue;
      if (excludeSharedFact === 'topic' && A.topics.some((f) => B.topics.includes(f))) continue;
      const ka = selectKey(A), kb = selectKey(B);
      for (const x of ka) if (kb.includes(x)) {
        const [s1, s2] = ORDER.indexOf(A.slot) < ORDER.indexOf(B.slot) ? [A, B] : [B, A];
        const key = `${x} | ${s1.slot} | ${s2.slot}`;
        if (seen.has(key)) continue;
        seen.add(key);
        if (!T.has(key)) T.set(key, { n: {}, ex: `${pg.seed}: [${s1.slot} ${s1.branch}#${s1.id}] "${s1.said}" || [${s2.slot} ${s2.branch}#${s2.id}] "${s2.said}"` });
        const r = T.get(key);
        r.n[pg.size] = (r.n[pg.size] || 0) + 1;
      }
    }
  }
  const rows = [...T].sort((a, b) => sum(b[1].n) - sum(a[1].n));
  console.log(`\n── ${label}: ${rows.length} rows (pages of 900; by size ${SIZES.join(' / ')})`);
  for (const [k, r] of rows) console.log(`${String(sum(r.n)).padStart(4)}  [${bySize(r.n)}]  ${k}\n        e.g. ${r.ex}`);
}
console.log('\n════ TABLE 1 — ONE FACT TWICE ON A PAGE (the owner\'s (1)) ════');
console.log('A part = one pool row printed. Its FACT = the branch key it was drawn on, made concrete (food:want = food band strained or worse, from');
console.log('food_culture strained/critical/collapsed, commoner_resentments food, dawn_work food, outsider services.food_production; threat:<kind> from');
console.log('child_warnings, the outsider threat part, a recent_changes threat branch, dawn_work defence (each outside threat at medium+), food_culture');
console.log('surplus.wanting; power:<name> from the outsider power part and dawn craft/merchant; tension:<type> from unspoken_topics and the');
console.log('resentment uprising branch; condition:<archetype>, event:<name> from recent_changes; legitimacy:want; defence:want; cap:<lens>:want)');
console.log('plus its declared STATE atoms (crisis:*, famine, food surplus, grain imported, stores:*, prosperity:*). Count = pages holding the pair.');
pairTable((p) => p.facts, '1a. SAME FACT (exact key), the public eight', true, false, false);
pairTable((p) => p.topics, '1b. SAME TOPIC, NOT THE SAME EXACT FACT (the explicit alias table in the script), the public eight', true, false, 'fact');
pairTable((p) => p.things, '1c. BORDERLINE — the same thing NAMED (a house, a power\'s or the government\'s name in the text, a naming atom), no shared fact or topic, the public eight', true, false, 'topic');
pairTable((p) => p.facts, '1d. THE OWNER-ONLY LINE against the eight: same fact', false, true, false);
pairTable((p) => p.things, '1e. THE OWNER-ONLY LINE against the eight: borderline (same thing named, no shared fact or topic)', false, true, 'topic');

// ════ TABLE 2 ════
const SAMENESS = readFileSync(`${L}/scripts/sameness-census.mjs`, 'utf8');
const redShare = Number(/export const LAW1_RED_SHARE = ([0-9.]+)/.exec(SAMENESS)?.[1]);
const BAR = Math.ceil(N * redShare - 1e-9);
console.log('\n════ TABLE 2 — THE SAME SENTENCE IN TWO PLACES (the owner\'s (2)) ════');
console.log(`THE BAR: scripts/sameness-census.mjs :: LAW1_RED_SHARE = ${redShare} -> law1RedPlaces(150) = ${BAR} of 150 (the door reds an unregistered slot's commonest sentence there; "two thirds of the 15% bar"); watch LAW1_WATCH_SHARE = 8/150. The 15% bar itself = ${Math.ceil(N * 0.15)} of 150; 20% = ${N * 0.2}.`);
console.log('Shares: ALL = of the 150 places of the size; PRINT = of the places that print the slot. elig = the branch\'s eligible lines at the places that printed the row (min/median/max); pool = the branch\'s lines; reach = places taking the branch / 150; need = ceil(reach/0.15) (COMMON-RULES 3).');
const fam = new Map(); const filled = new Map(); const printers = {}; const branchReach = new Map();
for (const pg of pages) for (const k of ORDER) {
  const s = pg.slots[k];
  if (!s.text) continue;
  printers[`${k}|${pg.size}`] = (printers[`${k}|${pg.size}`] || 0) + 1;
  const seenB = new Set(), seenF = new Set(), seenS = new Set();
  for (const p of s.parts) {
    const bk = `${k}|${pg.size}|${p.branch}`;
    if (!seenB.has(bk)) { seenB.add(bk); branchReach.set(bk, (branchReach.get(bk) || 0) + 1); }
    const fk = `${k}|${pg.size}|${p.branch}#${p.id}`;
    if (!seenF.has(fk)) {
      seenF.add(fk);
      if (!fam.has(fk)) fam.set(fk, { n: 0, elig: [], pool: p.poolSize, template: p.template, slot: k, size: pg.size, branch: p.branch });
      const r = fam.get(fk); r.n++; r.elig.push(p.eligible);
    }
    const sentence = k === 'child_warnings' ? s.text : p.said;
    const sk = `${k}|${pg.size}|${sentence}`;
    if (!seenS.has(sk)) {
      seenS.add(sk);
      if (!filled.has(sk)) filled.set(sk, { n: 0, slot: k, size: pg.size, sentence, fam: `${p.branch}#${p.id}`, elig: [], pool: p.poolSize, branch: p.branch });
      const r = filled.get(sk); r.n++; r.elig.push(p.eligible);
    }
  }
}
const med = (a) => { const s = [...a].sort((x, y) => x - y); return s.length ? `${s[0]}/${s[Math.floor(s.length / 2)]}/${s[s.length - 1]}` : '-'; };
function row2(r, kind) {
  const pr = printers[`${r.slot}|${r.size}`] || 0;
  const reach = (branchReach.get(`${r.slot}|${r.size}|${r.branch}`) || 0) / N;
  const label = kind === 'family' ? `${r.branch}#${r.fam ?? ''}`.replace(/#$/, '') : r.fam;
  return `${String(r.n).padStart(4)}  ALL ${pct(r.n, N).padStart(6)}  PRINT ${pct(r.n, pr).padStart(6)}  elig ${med(r.elig)} pool ${r.pool} reach ${(100 * reach).toFixed(0)}% need ${Math.ceil(reach / 0.15 - 1e-9)}  ${r.slot} | ${r.size} | ${label}  "${kind === 'family' ? r.template : r.sentence}"`;
}
for (const [fk, r] of fam) r.fam = fk.split('#').slice(1).join('#');
const famOver = [...fam.values()].filter((r) => r.n >= BAR).sort((a, b) => ORDER.indexOf(a.slot) - ORDER.indexOf(b.slot) || SIZES.indexOf(a.size) - SIZES.indexOf(b.size) || b.n - a.n);
console.log(`\n── 2a. FAMILIES (pool row, template before names are filled) printed in >= ${BAR} of 150 places of a size: ${famOver.length}`);
for (const r of famOver) console.log(row2(r, 'family'));
const filOver = [...filled.values()].filter((r) => r.n >= BAR).sort((a, b) => ORDER.indexOf(a.slot) - ORDER.indexOf(b.slot) || SIZES.indexOf(a.size) - SIZES.indexOf(b.size) || b.n - a.n);
console.log(`\n── 2b. FILLED SENTENCES (as printed; child_warnings: the whole sentence) printed in >= ${BAR} of 150 places of a size: ${filOver.length}`);
for (const r of filOver) console.log(row2(r, 'filled'));
// per slot per size: the commonest family and the commonest filled sentence (all, over the bar or not)
console.log('\n── 2c. EVERY SLOT, EVERY SIZE: places printing / the commonest family / the commonest filled sentence');
for (const k of ORDER) for (const z of SIZES) {
  const f = [...fam.values()].filter((r) => r.slot === k && r.size === z).sort((a, b) => b.n - a.n)[0];
  const s = [...filled.values()].filter((r) => r.slot === k && r.size === z).sort((a, b) => b.n - a.n)[0];
  console.log(`${k} | ${z}: prints ${printers[`${k}|${z}`] || 0}/150; top family ${f ? `${f.branch}#${f.fam} ${f.n} (${pct(f.n, N)})` : '-'}; top filled ${s ? `${s.n} (${pct(s.n, N)}) "${s.sentence.slice(0, 90)}"` : '-'}`);
}
console.log('\n── 2d. THE TWO SEEN IN SIX PLACES (their rows always, over the bar or not)');
const SEEN = [/^People do as the Headman's Authority says, but few of them think well of it\.$/, /^How the place should answer the danger it has been warned of is argued in private, not before strangers\.$/];
const SEEN_T = ['People do as {gov} {gov|says|say}, but few of them think well of {gov|it|them}.', 'How the place should answer the danger it has been warned of is argued in private, not before strangers.'];
for (let i = 0; i < 2; i++) {
  console.log(`  filled: "${SEEN[i].source.slice(1, -1).replace(/\\/g, '')}"`);
  for (const z of SIZES) {
    const rs = [...filled.values()].filter((r) => r.size === z && SEEN[i].test(r.sentence));
    for (const r of rs) console.log(`    ${row2(r, 'filled')}`);
    if (!rs.length) console.log(`    ${z}: 0`);
  }
  console.log(`  family: "${SEEN_T[i]}"`);
  for (const z of SIZES) {
    const rs = [...fam.values()].filter((r) => r.size === z && r.template === SEEN_T[i]);
    for (const r of rs) console.log(`    ${row2(r, 'family')}`);
    if (!rs.length) console.log(`    ${z}: 0`);
  }
}
// 2e (the chair's addition, via the coordinator): ALWAYS the TEN COMMONEST filled sentences across the eight public slots,
// and separately the ten commonest families, ranked over all 900, each with its slot and its share of ALL places by size
const PUBLIC = new Set(DAILY_LIFE_PAGE_SLOTS);
function topTen(map, keyOf, textOf, label) {
  const agg = new Map();
  for (const r of map.values()) {
    if (!PUBLIC.has(r.slot)) continue;
    const k = keyOf(r);
    if (!agg.has(k)) agg.set(k, { slot: r.slot, label: k.split('|')[1], text: textOf(r), n: {} });
    agg.get(k).n[r.size] = (agg.get(k).n[r.size] || 0) + r.n;
  }
  const rows = [...agg.values()].sort((a, b) => sum(b.n) - sum(a.n)).slice(0, 10);
  console.log(`\n── ${label} (ranked by places of 900; share of ALL 150 places by size ${SIZES.join(' / ')})`);
  rows.forEach((r, i) => console.log(`${String(i + 1).padStart(2)}. ${String(sum(r.n)).padStart(4)}  [${SIZES.map((z) => pct(r.n[z] || 0, N)).join(' / ')}]  max ${Math.max(...SIZES.map((z) => r.n[z] || 0))}/150  ${r.slot} | ${r.label}  "${r.text}"`));
}
topTen(filled, (r) => `${r.slot}|${r.fam}|${r.sentence}`, (r) => r.sentence, '2e-i. THE TEN COMMONEST FILLED SENTENCES, the eight public slots');
topTen(fam, (r) => `${r.slot}|${r.branch}#${r.fam}`, (r) => r.template, '2e-ii. THE TEN COMMONEST FAMILIES, the eight public slots');
console.log(`\n  families at or over the door's bar (${BAR} of 150 of some size): ${famOver.length}; filled sentences: ${filOver.length}`);

// the same filled sentence in two SLOTS of one page (a sentence the page prints twice)
let twiceOnPage = 0;
for (const pg of pages) { const all = ORDER.flatMap((k) => pg.slots[k].parts.map((p) => p.said)); if (new Set(all).size !== all.length) twiceOnPage++; }
console.log(`\n  pages printing one identical part sentence in two slots: ${twiceOnPage}`);

// ════ TABLE 3 ════
console.log('\n════ TABLE 3 — "the Headman\'s Authority\'s mark" (the owner\'s (3)), the Daily Life page (eight + owner-only), 900 places ════');
const POSS = new Map(); const DOUBLE = new Map(); const GENERIC = new Map();
let possN = 0, doubleN = 0, genericN = 0;
const add = (m, key, ex) => { if (!m.has(key)) m.set(key, { n: 0, ex }); m.get(key).n++; };
for (const pg of pages) for (const k of ORDER) for (const p of pg.slots[k].parts) {
  for (const pn of pg.powerNames) {
    if (!pn.body) continue;
    const re = new RegExp(`${esc(pn.body)}'s?(?![A-Za-z])`, 'g');
    for (const m of p.said.matchAll(re)) {
      // the name itself ending in 's (a name that is itself a possessive, unpossessed) is no possessive on it
      if (m[0].length === pn.body.length) continue;
      possN++; add(POSS, `${k} | ${p.branch}#${p.id}`, `${pg.seed}: "${p.said}"`);
      if (/'s/.test(pn.body)) { doubleN++; add(DOUBLE, `${k} | ${p.branch}#${p.id} | ${pn.body}`, `${pg.seed}: "${p.said}"`); }
    }
  }
  for (const m of p.said.matchAll(/\b[\w-]+'s\s+[\w-]+(?:\s+[\w-]+)?'s?(?![A-Za-z])/g)) { genericN++; add(GENERIC, `${k} | ${p.branch}#${p.id}`, `${pg.seed}: "${m[0]}" in "${p.said}"`); }
}
console.log(`3a. "<power name>'s" (a possessive on any power's or the government's name, the record's own names): ${possN} sentences`);
for (const [k, r] of [...POSS].sort((a, b) => b[1].n - a[1].n)) console.log(`  ${String(r.n).padStart(4)}  ${k}\n        e.g. ${r.ex}`);
console.log(`3b. the DOUBLE: a power name that itself holds "'s", followed by "'s": ${doubleN} sentences`);
for (const [k, r] of [...DOUBLE].sort((a, b) => b[1].n - a[1].n)) console.log(`  ${String(r.n).padStart(4)}  ${k}\n        e.g. ${r.ex}`);
console.log(`3c. any "X's Y['s]" double possessive, by shape (no name list): ${genericN} hits`);
for (const [k, r] of [...GENERIC].sort((a, b) => b[1].n - a[1].n)) console.log(`  ${String(r.n).padStart(4)}  ${k}\n        e.g. ${r.ex}`);
const holdS = {}; for (const pg of pages) if (pg.powerNames.some((pn) => /'s/.test(pn.body))) holdS[pg.size] = (holdS[pg.size] || 0) + 1;
console.log(`places whose government or a faction name itself holds "'s": ${sum(holdS)} [${bySize(holdS)}]`);
const nameCount = new Map(); for (const pg of pages) for (const pn of pg.powerNames) if (/'s/.test(pn.body)) nameCount.set(pn.body, (nameCount.get(pn.body) || 0) + 1);
console.log(`  names: ${[...nameCount].sort((a, b) => b[1] - a[1]).map(([n, c]) => `${n} ${c}`).join('; ')}`);
console.log(`\ndone in ${((Date.now() - t0) / 1000).toFixed(0)}s`);
