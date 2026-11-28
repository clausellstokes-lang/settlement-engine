#!/usr/bin/env node
/**
 * RUN (from the repository root):
 *   node docs/chair/2026-11-20/content/daily/measures/B3/E3/measure.e3.mjs > docs/chair/2026-11-20/content/daily/measures/B3/E3/e3.out.txt 2>&1
 *
 * DAILY-3 · B3 E3 — `outsider_impressions`, `unspoken_topics`, `recent_changes` (a no-audience read,
 * `deriveDailyLife(record)`), MEASURED ON THE BUILT CODE (`src/domain/dailyLife.js`, pools
 * `src/data/dailyLife/outsiderImpressions.js`, `unspokenTopics.js`, `recentChanges.js`). Measure only; the shape of
 * `measures/B3/E2/measure.e2.mjs`. Births: M1's (150 a size, seeds hxd-<size>-0..149). Per slot and size: the top single
 * SENTENCE share (% of 150), the top whole text, distinct texts, EMPTY, each branch's reach and its eligible rows (min,
 * and the bar's need ceil(reach/15%)); the false lines: every printed text against its branches' keyed picks of the
 * admitted lines (the declared needs; the rule restated from the rulings, as the E3 test's oracle), M1's engine lines,
 * an age, "founding survey", an engine label, a hidden or rumoured threat's label, a veiled power's name, a crime word,
 * a bracket, "town" at a place smaller than a town, a hideable house cited.
 */
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
const HERE = dirname(fileURLToPath(import.meta.url));
const L = resolve(HERE, '../../../../../../../..');

const { generateSettlementPipeline } = await import(`${L}/src/generators/generateSettlementPipeline.js`);
const { birthConfig, loadGenerationLawPayloads } = await import(`${L}/src/domain/density/densityCreateBoundary.js`);
const { DEFAULT_CONFIG } = await import(`${L}/src/store/configSlice.js`);
const { deriveDailyLife } = await import(`${L}/src/domain/dailyLife.js`);
const { OUTSIDER_IMPRESSIONS } = await import(`${L}/src/data/dailyLife/outsiderImpressions.js`);
const { UNSPOKEN_TOPICS } = await import(`${L}/src/data/dailyLife/unspokenTopics.js`);
const { RECENT_CHANGES } = await import(`${L}/src/data/dailyLife/recentChanges.js`);
const { filterDeclared } = await import(`${L}/src/domain/facts/drawDeclared.js`);
const { factsOf } = await import(`${L}/src/domain/facts/factsOf.js`);
const { isHideableHouse, isVeiledPower } = await import(`${L}/src/domain/people/cardVeil.js`);
const { pickVariantMixed } = await import(`${L}/src/kernel/proseHash.js`);
const { fillAgreement, powerNameAfterArticle, powerNameWithArticle, powerPossessive } = await import(`${L}/src/domain/display/powerSentenceName.js`);
const { deriveAllThreatProfiles } = await import(`${L}/src/domain/threatProfile.js`);
const { deriveAllCapacities, CAPACITY_NAMES, VISIBLE_CAPACITY_LENSES } = await import(`${L}/src/domain/capacityModel.js`);
const { deriveAllFactionProfiles } = await import(`${L}/src/domain/factionProfile.js`);
const { deriveAllActiveConditions } = await import(`${L}/src/domain/activeConditions.js`);
const { deriveHistoryBeats } = await import(`${L}/src/domain/historyBeats.js`);
const { leaderLeadOfRecord } = await import(`${L}/src/domain/facts/leaderLead.js`);
const { EVENT_TYPE_NAMES } = await import(`${L}/src/data/historyData.js`);

console.log('RE-RUN: node docs/chair/2026-11-20/content/daily/measures/B3/E3/measure.e3.mjs > docs/chair/2026-11-20/content/daily/measures/B3/E3/e3.out.txt 2>&1');
const SIZES = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
const N = 150;
const BAD = ['strained', 'critical', 'collapsed'];
const t0 = Date.now();
await loadGenerationLawPayloads();

const isRating = (t) => t.originSurface === 'defenseProfile' && (t.type === 'unrest' || t.type === 'economic_collapse');
const formOf = (t, rec) => {
  if (t.type === 'unrest') return t.originSurface === 'activeConditions' ? 'void' : 'stressor';
  if (t.type === 'economic_collapse') return t.originSurface === 'activeConditions' ? 'route' : 'stressor';
  if (t.type === 'monster_pressure') return t.originSurface === 'config' ? (rec.config?.monsterThreat === 'plagued' ? 'overrun' : 'frontier') : 'stressor';
  return 'any';
};
const fillPower = (t, name) => fillAgreement(t, { power: name }).replace(/\{power's\}/g, `the ${powerPossessive(powerNameAfterArticle(name))}`)
  .replace(/\{Power\}/g, powerNameWithArticle(name, true)).replace(/\{power\}/g, powerNameWithArticle(name));
const fillGov = (t, gov) => fillAgreement(t, { gov }).replace(/\{gov\}/g, powerNameWithArticle(gov));
const fillEvent = (t, ev) => { const b = ev.replace(/^the\s+/i, ''); return t.replace(/\{Event\}/g, `The ${b}`).replace(/\{event\}/g, `the ${b}`); };

/** the rule restated: each slot's branches, their eligible counts and the expected text */
function expectedOf(rec) {
  const facts = factsOf(rec);
  const elig = (pools, b) => filterDeclared(pools[b] || [], { facts });
  const take = (slot, pools, b, fill = (t) => t) => { const p = pickVariantMixed(elig(pools, b), `${rec.name}::dailyLife.${slot}::${b}`); return { b, n: elig(pools, b).length, t: p ? fill(p.text) : '' }; };
  const threats = deriveAllThreatProfiles(rec); const caps = deriveAllCapacities(rec);
  const gov = String(rec.powerStructure?.government ?? '');
  const out = [];
  const top = deriveAllFactionProfiles(rec).slice().sort((a, b) => (b.power || 0) - (a.power || 0))[0];
  const row = top && (rec.powerStructure?.factions || []).find((f) => f.faction === top.name);
  let veiledTop = false;
  if (top && !isVeiledPower(row) && top.archetype !== 'criminal') {
    const lead = leaderLeadOfRecord(rec).leadOverSecond;
    out.push(take('outsider_impressions', OUTSIDER_IMPRESSIONS, lead === null || lead > 6 ? 'power' : 'power.level', (t) => fillPower(t, top.name)));
  } else if (top) veiledTop = true;
  const open = threats.filter((t) => t.visibility === 'open' && !isRating(t)).sort((a, b) => b.severity - a.severity)[0];
  let real = false;
  if (open && open.severityBand !== 'low') { const p = take('outsider_impressions', OUTSIDER_IMPRESSIONS, `threat.${open.type}.${formOf(open, rec)}`); if (OUTSIDER_IMPRESSIONS[p.b]) out.push(p); if (p.t) real = true; }
  const lenses = VISIBLE_CAPACITY_LENSES.filter((n) => BAD.includes(caps.bands[n])).map((n) => `services.${n}`);
  const strained = CAPACITY_NAMES.filter((n) => BAD.includes(caps.bands[n])).length;
  const options = (real ? (strained >= 3 ? lenses : []) : [...lenses, 'ordinary']).filter((b) => elig(OUTSIDER_IMPRESSIONS, b).length > 0);
  const second = pickVariantMixed(options, `${rec.name}::dailyLife.outsider_impressions::second`);
  if (second) out.push(take('outsider_impressions', OUTSIDER_IMPRESSIONS, second, (t) => fillGov(t, gov)));

  const history = deriveHistoryBeats(rec);
  const types = (Array.isArray(rec.history?.currentTensions) ? rec.history.currentTensions : []).map((t) => (t && typeof t === 'object' ? t.type : undefined));
  const CRIME = ['crime_wave', 'corruption_scandal'];
  let type = types[0]; let fell = false;
  if (history.unresolvedWound && CRIME.includes(type)) { type = types.slice(1).find((x) => !CRIME.includes(x) && UNSPOKEN_TOPICS[`wound.${x}`]); fell = true; }
  const un = history.unresolvedWound && type && UNSPOKEN_TOPICS[`wound.${type}`] ? [take('unspoken_topics', UNSPOKEN_TOPICS, `wound.${type}`)] : [];

  const rc = [];
  const beat = history.recentDisruption; const ev = String(beat?.references?.eventName ?? '');
  const crimeBeat = !!beat && (ev === EVENT_TYPE_NAMES.crime_wave || ev === EVENT_TYPE_NAMES.corruption_scandal);
  const evRow = (Array.isArray(rec.history?.historicalEvents) ? rec.history.historicalEvents : []).find((e) => e?.name === ev);
  const beatNoRow = !!beat && !!ev && !evRow;
  const kindDisagrees = !!beat && !!ev && !!evRow && (['crime_wave', 'corruption_scandal'].includes(evRow.templateType) !== crimeBeat);
  if (beat && ev && !crimeBeat) rc.push(take('recent_changes', RECENT_CHANGES, 'beat', (t) => fillEvent(t, ev)));
  const fresh = deriveAllActiveConditions(rec).filter((c) => (c.duration?.elapsedTicks ?? 0) < 2);
  for (const c of fresh.slice(0, 2)) { const b = `condition.${c.archetype}`; if (RECENT_CHANGES[b] && !rc.some((p) => p.b === b)) rc.push(take('recent_changes', RECENT_CHANGES, b)); }
  const acuteOf = (t) => !isRating(t) && (t.currentStage === 'imminent' || t.currentStage === 'realized');
  for (const t of threats.filter((x) => x.visibility === 'open' && acuteOf(x)).sort((a, b) => b.severity - a.severity).slice(0, 2)) { const b = `threat.${t.type}.${formOf(t, rec)}.${t.currentStage}`; if (RECENT_CHANGES[b] && !rc.some((p) => p.b === b)) rc.push(take('recent_changes', RECENT_CHANGES, b)); }
  if (!rc.length && !(!!beat || fresh.length > 0 || threats.some(acuteOf))) rc.push(take('recent_changes', RECENT_CHANGES, 'calm'));
  const join = (ps) => ps.map((p) => p.t).filter(Boolean).join(' ');
  return {
    outsider: { parts: out, expected: join(out), veiledTop, real }, unspoken: { parts: un, expected: join(un), woundType: history.unresolvedWound ? types[0] ?? '(no type)' : null, fell },
    recent: { parts: rc, expected: join(rc), crimeBeat, beatNoRow, kindDisagrees, ratingsOnly: !rc.length && threats.some((t) => isRating(t) && (t.currentStage === 'imminent' || t.currentStage === 'realized')) },
    hidden: threats.filter((t) => t.visibility !== 'open').map((t) => String(t.label).toLowerCase()),
  };
}

const KEY = { outsider: 'outsider_impressions', unspoken: 'unspoken_topics', recent: 'recent_changes' };
const POOLS = { outsider: OUTSIDER_IMPRESSIONS, unspoken: UNSPOKEN_TOPICS, recent: RECENT_CHANGES };
const rows = [];
for (const size of SIZES) for (let i = 0; i < N; i++) {
  const seed = `hxd-${size}-${i}`;
  const rec = generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, settType: size }), null, { seed, customContent: {} });
  const slots = deriveDailyLife(rec).slots;
  const e = expectedOf(rec);
  const r = { seed, size, rec, hidden: e.hidden };
  for (const k of Object.keys(KEY)) r[k] = { ...e[k], text: slots[KEY[k]].text, refs: slots[KEY[k]].references, branches: e[k].parts.map((p) => p.b), eligible: Object.fromEntries(e[k].parts.map((p) => [p.b, p.n])) };
  rows.push(r);
}
console.log(`births and slots: ${rows.length} (${N} a size, M1's recipe) in ${((Date.now() - t0) / 1000).toFixed(0)}s`);

const rowOf = (rec, ref) => (Array.isArray(rec.institutions) ? rec.institutions : []).find((i) => (ref.id && i?.id === ref.id) || i?.name === ref.label);
const SMALLER_THAN_TOWN = new Set(['thorp', 'hamlet', 'village']);
const veiledNames = (rec) => (Array.isArray(rec.powerStructure?.factions) ? rec.powerStructure.factions : []).filter((f) => isVeiledPower(f)).map((f) => String(f.faction || '')).filter(Boolean);
const HOUSE = [
  ['a printed text not its branches\' keyed picks of the admitted lines (declared needs)', (s) => s.text !== s.expected],
  ['M1\'s engine lines ("the wound", "has come to a head", "new shape of things", "obvious unspoken weight", "civic services run short")', (s) => /"the wound"|the matter referenced|has come to a head|new shape of things|obvious unspoken weight|civic services run short/i.test(s.text)],
  ['an engine label (civic stability, economic fragility, at risk)', (s) => /civic stability|economic fragility|\bat risk\b/i.test(s.text)],
  ['an age (N years ago) or "founding survey"', (s) => /\b\d+\s+years?\s+ago\b|founding survey/i.test(s.text)],
  ['a hidden or rumoured threat\'s label printed (ruling 7)', (s, x) => x.hidden.some((l) => s.text.toLowerCase().includes(l))],
  ['a veiled power\'s name printed (ruling 7)', (s, x) => veiledNames(x.rec).some((n) => s.text.includes(n))],
  ['a crime word (crim|smuggl|corrupt|thie|brib|black market|scandal) printed', (s) => /\bcrim|\bsmuggl|\bcorrupt|\bthie(?:f|ves)\b|\bbrib|\bblack market|\bscandal/i.test(s.text)],
  ['a hideable house cited (rule 6)', (s, x) => s.refs.filter((r) => r.type === 'institution').some((ref) => { const i = rowOf(x.rec, ref); return !!i && isHideableHouse(i); })],
  ['a bracket printed (rule 4)', (s) => /[()]/.test(s.text)],
  ['the word "town" at a place smaller than a town (rule 4)', (s, x) => SMALLER_THAN_TOWN.has(x.size) && /\btowns?\b/i.test(s.text)],
];

const by = (s) => rows.filter((x) => x.size === s);
const pct = (n) => Math.round((100 * n) / N);
const line = (label, f) => `| ${label} | ${SIZES.map((s) => f(s)).join(' | ')} |`;
const HDR = `| row | ${SIZES.join(' | ')} |\n|---|${SIZES.map(() => '---:').join('|')}|`;
const sentences = (t) => (t ? t.split(/(?<=[.!?])\s+(?=[A-Z])/).filter(Boolean) : []);
const topOf = (xs, f) => { const c = new Map(); for (const x of xs) for (const v of f(x)) c.set(v, (c.get(v) || 0) + 1); return [...c.entries()].sort((a, b) => b[1] - a[1])[0] || ['(none)', 0]; };
let houseTotal = 0;
const thin = [];
for (const k of Object.keys(KEY)) {
  console.log(`\n════ ${KEY[k]}\n${HDR}`);
  console.log(line('top single SENTENCE % of 150', (s) => String(pct(topOf(by(s), (x) => new Set(sentences(x[k].text)))[1]))));
  console.log(line('top whole text % of 150', (s) => String(pct(topOf(by(s), (x) => (x[k].text ? [x[k].text] : []))[1]))));
  console.log(line('distinct texts', (s) => String(new Set(by(s).map((x) => x[k].text).filter(Boolean)).size)));
  console.log(line('EMPTY (no true line)', (s) => String(by(s).filter((x) => !x[k].text).length)));
  console.log(line('EMPTY % of 150', (s) => String(pct(by(s).filter((x) => !x[k].text).length))));
  const taken = [...new Set(rows.flatMap((x) => x[k].branches))].sort();
  for (const b of taken) {
    console.log(line(`reach % / min eligible / bar's need: ${b}`, (s) => {
      const xs = by(s).filter((x) => x[k].branches.includes(b));
      if (!xs.length) return '0 / — / 0';
      const min = Math.min(...xs.map((x) => x[k].eligible[b])); const need = Math.ceil(pct(xs.length) / 15);
      thin.push({ slot: KEY[k], b, s, min, need, reach: pct(xs.length) });
      return `${pct(xs.length)} / ${min} / ${need}`;
    }));
  }
  console.log(`  pool branches never taken on the 900: ${Object.keys(POOLS[k]).filter((b) => !taken.includes(b)).join(', ') || '(none)'}`);
  for (const b of taken) {
    const zero = rows.filter((x) => x[k].branches.includes(b) && x[k].eligible[b] === 0);
    if (zero.length) console.log(line(`places on ${b} with NO eligible line (that part EMPTY)`, (s) => String(zero.filter((x) => x.size === s).length)));
  }
  for (const [label, f] of HOUSE) {
    const hits = rows.filter((x) => f(x[k], x)); houseTotal += hits.length;
    console.log(`${line(`FALSE: ${label}`, (s) => String(hits.filter((x) => x.size === s).length))}${hits[0] ? ` e.g. ${hits[0].seed}: "${hits[0][k].text}" vs "${hits[0][k].expected}"` : ''}`);
  }
  for (const s of SIZES) { const [t, n] = topOf(by(s), (x) => new Set(sentences(x[k].text))); console.log(`  top sentence ${s} (${n}/${N}): "${t}"`); }
}
console.log(`\nFALSE-LINE TOTAL (the three slots, every FALSE row above): ${houseTotal}`);
const short = thin.filter((t) => t.min < t.need);
console.log(`THINNEST: branches short of the bar's need (min eligible < ceil(reach/15)): ${short.length}${short.map((t) => `\n  ${t.slot} ${t.b} @ ${t.s}: reach ${t.reach}%, min ${t.min}, need ${t.need}`).join('')}`);
const tight = thin.filter((t) => t.reach >= 5).sort((a, b) => (a.min - a.need) - (b.min - b.need)).slice(0, 5);
console.log(`the five tightest (reach >= 5%): ${tight.map((t) => `${t.slot} ${t.b} @ ${t.s} (reach ${t.reach}, min ${t.min}, need ${t.need})`).join('; ')}`);
console.log('\n── the rulings, counted ──');
console.log(line('outsider: top power veiled (power part dropped)', (s) => String(by(s).filter((x) => x.outsider.veiledTop).length)));
console.log(line('outsider: power.level taken', (s) => String(by(s).filter((x) => x.outsider.branches.includes('power.level')).length)));
console.log(line('outsider: a real threat said', (s) => String(by(s).filter((x) => x.outsider.real).length)));
console.log(line('unspoken: a crime wound fell through', (s) => String(by(s).filter((x) => x.unspoken.fell).length)));
console.log(line('unspoken: fell and found a tension', (s) => String(by(s).filter((x) => x.unspoken.fell && x.unspoken.text).length)));
console.log(line('recent: a crime or corruption beat (not said)', (s) => String(by(s).filter((x) => x.recent.crimeBeat).length)));
console.log(line('recent: only a rating acute (EMPTY or calm, never said)', (s) => String(by(s).filter((x) => x.recent.ratingsOnly).length)));
console.log(line('recent: beat\'s event not held by name (the built code fails closed; the ruled name test says it)', (s) => String(by(s).filter((x) => x.recent.beatNoRow).length)));
console.log(line('recent: the event\'s kind and EVENT_TYPE_NAMES disagree on crime', (s) => String(by(s).filter((x) => x.recent.kindDisagrees).length)));
console.log(line('recent: calm taken', (s) => String(by(s).filter((x) => x.recent.branches.includes('calm')).length)));
console.log('\n── M1\'s named places ──');
for (const seed of ['hxd-thorp-0', 'hxd-hamlet-0', 'hxd-hamlet-7', 'hxd-metropolis-0']) { const x = rows.find((r) => r.seed === seed); console.log(`${seed}: outsider "${x.outsider.text}" | unspoken "${x.unspoken.text}" | recent "${x.recent.text}"`); }
console.log(`\ndone in ${((Date.now() - t0) / 1000).toFixed(0)}s`);
