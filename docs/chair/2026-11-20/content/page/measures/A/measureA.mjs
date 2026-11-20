// RUN (from the repository root): node docs/chair/2026-11-20/content/page/measures/A/measureA.mjs "$PWD" > docs/chair/2026-11-20/content/page/measures/A/measureA.out.txt 2>&1
// PAGE-1 helper A (MEASURE.md section A: F1 sameness, F2 sides blind to the town). Measure only; record level.
// The towns: the chair's 300 (batch2.mjs recipe): SIZES x i in 0..49, seed `hxd-${size}-${i}`, DEFAULT_CONFIG untouched.
// Rendered confirmation of the same strings is renderA.census.jsx (see its header).
import { readFileSync } from 'node:fs';

const L = process.argv[2];
const N = Number(process.argv[3] || 50);
const { generateSettlementPipeline } = await import(`${L}/src/generators/generateSettlementPipeline.js`);
const { birthConfig, loadGenerationLawPayloads } = await import(`${L}/src/domain/density/densityCreateBoundary.js`);
const { DEFAULT_CONFIG } = await import(`${L}/src/store/configSlice.js`);
const { SIZES } = await import(`${L}/tests/components/pageCensusWalk.shared.mjs`);
const { HISTORICAL_EVENTS_DATA, HISTORY_DESC_SIBLINGS, LEGITIMACY_HELD_TWINS } = await import(`${L}/src/data/historyData.js`);
const { HISTORY_DESC_VARIANTS } = await import(`${L}/src/data/historyDescVariants.js`);
const { ARRIVAL_SENSES, ARRIVAL_PEOPLE, ARRIVAL_TENSIONS, ARRIVAL_MEMORIES } = await import(`${L}/src/data/arrivalProse.js`);
const { ARRIVAL_SCENES, STRESS_DESCS } = await import(`${L}/src/data/narrativeData.js`);
const { CULTURE_PROFILES, CULTURE_LINE_SIBLINGS } = await import(`${L}/src/data/cultureProfiles.js`);
const { crimeSignalOf } = await import(`${L}/src/domain/crimeSignal.js`);
const { textOf } = await import(`${L}/src/domain/facts/textOf.js`);
const { speakTierNoun } = await import(`${L}/src/domain/display/stateProse/stateProseKernel.js`);
const { tierNounFor } = await import(`${L}/src/domain/display/stateProse/weaveBlock.js`);
const { sentenceCase } = await import(`${L}/src/generators/narrativeProse.js`);
const { factsOf } = await import(`${L}/src/domain/facts/factsOf.js`);
const { nativeSemanticNames } = await import(`${L}/src/domain/content/customContentSemanticAuthority.js`);

await loadGenerationLawPayloads();
const towns = [];
for (const size of SIZES) for (let i = 0; i < N; i++) {
  const seed = `hxd-${size}-${i}`;
  const t = generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, settType: size }), null, { seed, customContent: {} });
  t.__seed = seed; t.__size = size; towns.push(t);
}
const pct = (a, b) => (b ? `${(100 * a / b).toFixed(1)}%` : 'n/a');
const tally = (a) => { const m = new Map(); for (const k of a) m.set(k, (m.get(k) || 0) + 1); return [...m].sort((x, y) => y[1] - x[1]); };
const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const out = (...a) => console.log(...a);
out(`TOWNS: ${towns.length} (${SIZES.join(', ')} x ${N}); cultures: ${tally(towns.map((t) => t.config?.culture)).map(([k, c]) => `${k} ${c}`).join(', ')}`);

// ═════════════════════════════════════════ F1.1 TENSIONS ═════════════════════════════════════════
// The authored forms a current tension's description can take, per type (code), each with its label.
const formsOf = (type) => {
  const t = HISTORICAL_EVENTS_DATA.find((e) => e.type === type);
  /** @type {Array<[string, string]>} */ const forms = [];
  if (!t) return forms;
  forms.push(['base', t.description]);
  if (t.descriptionByDirection) for (const [k, v] of Object.entries(t.descriptionByDirection)) if (v !== t.description) forms.push([`dir.${k}`, v]);
  for (const k of ['dated', 'unanchored']) if (t.byMemory?.[k]?.description) forms.push([k, t.byMemory[k].description]);
  (HISTORY_DESC_VARIANTS[type] || []).forEach((v, i) => forms.push([`variant${i + 1}(apartFromOwnEvent only)`, v]));
  for (const [label, text] of [...forms]) for (const row of HISTORY_DESC_SIBLINGS[text] || []) if (row.text !== text) forms.push([`${label}.sibling`, row.text]);
  for (const [label, text] of [...forms]) if (LEGITIMACY_HELD_TWINS[text]) forms.push([`${label}.legitimacyTwin`, LEGITIMACY_HELD_TWINS[text]]);
  return forms;
};
const sideSetsOf = (type) => {
  const t = HISTORICAL_EVENTS_DATA.find((e) => e.type === type);
  const sets = new Map();
  if (!t) return sets;
  sets.set('base', (t.factions || []).join(' | '));
  for (const k of ['dated', 'unanchored']) if (t.byMemory?.[k]?.factions) sets.set(k, t.byMemory[k].factions.join(' | '));
  return sets;
};
const formRe = (text) => new RegExp(`^${esc(text).replace(/\\\{[a-z_]+\\\}/g, '.+?').replace(/\btown\b/g, '\\w+')}$`, 'i');
const classify = (type, desc) => {
  for (const [label, text] of formsOf(type)) if (formRe(text).test(desc)) return label;
  if (type === 'resource_scarcity') return 'scarcity lead+issue (historyGenerator.js buildHistoricalEvent)';
  return 'UNMATCHED';
};

const allT = []; // {town, type, desc, sides}
for (const t of towns) for (const x of t.history?.currentTensions || []) allT.push({ t, type: x.type, desc: x.description, sides: x.factions || [] });
const types = [...new Set([...HISTORICAL_EVENTS_DATA.map((e) => e.type), ...allT.map((x) => x.type)])];
out(`\nF1.1 CURRENT TENSIONS: ${allT.length} tensions in ${towns.filter((t) => (t.history?.currentTensions || []).length).length} towns; per size mean: ${SIZES.map((s) => `${s} ${(allT.filter((x) => x.t.__size === s).length / N).toFixed(2)}`).join(', ')}`);
out('type | code: description forms (labels) / side-name sets | 300: towns carrying / distinct printed texts / distinct printed side sets | printed forms');
for (const type of types) {
  const forms = formsOf(type); const sets = sideSetsOf(type);
  const rows = allT.filter((x) => x.type === type);
  const tw = new Set(rows.map((x) => x.t.__seed)).size;
  const texts = new Set(rows.map((x) => x.desc)); const sides = new Set(rows.map((x) => x.sides.join(' | ')));
  const reach = forms.filter(([l]) => !l.includes('variant')).length;
  out(`${type.padEnd(21)} | code ${forms.length} forms (${reach} without the apart-variants: ${forms.map(([l]) => l).join(', ')}) / ${new Set(sets.values()).size} side sets | towns ${tw} / texts ${texts.size} / side sets ${sides.size} | ${tally(rows.map((x) => classify(type, x.desc))).map(([k, c]) => `${k} ${c}`).join('; ')}`);
}
const textTowns = new Map(); for (const x of allT) { if (!textTowns.has(x.desc)) textTowns.set(x.desc, new Set()); textTowns.get(x.desc).add(x.t.__seed); }
const top = [...textTowns].sort((a, b) => b[1].size - a[1].size);
out(`\nDistinct tension texts over the 300: ${textTowns.size} (from ${allT.length} tensions). Commonest:`);
top.slice(0, 12).forEach(([k, s], i) => out(`  #${i + 1} ${s.size} towns (${pct(s.size, towns.length)}): ${k.slice(0, 150)}`));
const top5 = new Set(top.slice(0, 5).flatMap(([, s]) => [...s]));
out(`Share of the 300 towns reached by the five commonest tension texts: ${top5.size}/${towns.length} = ${pct(top5.size, towns.length)}`);
const withT = towns.filter((t) => (t.history?.currentTensions || []).length);
out(`Share of towns WITH a tension whose every tension text is printed in at least one other town: ${pct(withT.filter((t) => t.history.currentTensions.every((x) => textTowns.get(x.description).size > 1)).length, withT.length)} (${withT.length} towns)`);
out(`Share of towns WITH a tension holding at least one text printed in >=10 towns: ${pct(withT.filter((t) => t.history.currentTensions.some((x) => textTowns.get(x.description).size >= 10)).length, withT.length)}`);
out('\nside-name sets printed, commonest 8 (strict):');
tally(allT.map((x) => `${x.type}: ${x.sides.join(' | ')}`)).slice(0, 8).forEach(([k, c]) => out(`  ${c} ${k.slice(0, 160)}`));
out(`distinct printed side sets: ${new Set(allT.map((x) => x.sides.join(' | '))).size} over ${allT.length} tensions`);
// The timeline uses the variants (historyGenerator.js :: generateEventNarrative, historyDescription), the tension does not:
const tlForms = tally(towns.flatMap((t) => (t.history?.historicalEvents || []).filter((e) => e.templateType).map((e) => {
  const v = HISTORY_DESC_VARIANTS[e.templateType] || []; const base = HISTORICAL_EVENTS_DATA.find((x) => x.type === e.templateType)?.description;
  if (base && formRe(base).test(e.description)) return 'base'; return v.some((s) => formRe(s).test(e.description)) ? 'variant' : 'other';
})));
out(`CONTRAST, the timeline's own events (same table): ${tlForms.map(([k, c]) => `${k} ${c}`).join(', ')}`);

// ═════════════════════════════════════════ F1.2 ARRIVAL ═════════════════════════════════════════
const svSrc = readFileSync(`${L}/src/generators/structuralValidator.js`, 'utf8').split('\n');
const start = svSrc.findIndex((l) => /export const checkInstCompat/.test(l));
let end = start; while (end < svSrc.length && !/^};/.test(svSrc[end])) end++;
const landmarkLines = [];
for (const l of svSrc.slice(start, end)) for (const m of l.matchAll(/(["'])((?:(?!\1)[^\\]|\\.){20,})\1/g)) landmarkLines.push(m[2].replace(/\\'/g, "'"));
/** pool id -> { key, lines: ((name,tier)=>string)[] } */
const pools = [];
const asFn = (line) => { const x = textOf(line); return typeof x === 'function' ? x : () => String(x); };
for (const [k, lines] of Object.entries(ARRIVAL_SCENES)) pools.push({ id: `ARRIVAL_SCENES.${k}`, beat: 'HOOK', key: `route→scene ${k}`, file: 'narrativeData.js', lines: lines.map((l) => ({ fn: asFn(l), hook: true })) });
for (const [k, lines] of Object.entries(STRESS_DESCS)) pools.push({ id: `STRESS_DESCS.${k}`, beat: 'HOOK', key: `stress ${k}`, file: 'narrativeData.js', lines: lines.map((l) => ({ fn: asFn(l), hook: true })) });
pools.push({ id: 'checkInstCompat landmarks', beat: 'SIGHT', key: 'native institution names', file: `structuralValidator.js:${start + 1}`, lines: landmarkLines.map((s) => ({ fn: () => s })) });
for (const [k, p] of Object.entries(CULTURE_PROFILES)) pools.push({ id: `CULTURE_PROFILES.${k}.architecturalDetails`, beat: 'SIGHT', key: `culture ${k}`, file: 'cultureProfiles.js', lines: (p.architecturalDetails || []).map((d) => ({ fn: () => `${sentenceCase(String(textOf(d)).trim())}.` })) });
pools.push({ id: 'CULTURE_LINE_SIBLINGS (twins of materialized details)', beat: 'SIGHT', key: 'culture detail twin', file: 'cultureProfiles.js:557', lines: Object.values(CULTURE_LINE_SIBLINGS).flatMap((rows) => rows.filter((r) => r.twinOf).map((r) => ({ fn: () => `${sentenceCase(String(r.text).trim())}.` }))) });
for (const s of ARRIVAL_SENSES) for (const f of ['lines', 'dominant']) if (s[f]?.length) pools.push({ id: `ARRIVAL_SENSES.${s.key}.${f}`, beat: 'SENSE', key: `trade ${s.key}${f === 'dominant' ? ' (dominant)' : ''}`, file: 'arrivalProse.js', lines: s[f].map((l) => ({ fn: asFn(l) })) });
for (const [k, lines] of Object.entries(ARRIVAL_PEOPLE)) pools.push({ id: `ARRIVAL_PEOPLE.${k}`, beat: 'PEOPLE', key: `culture ${k}`, file: 'arrivalProse.js:388', lines: lines.map((l) => ({ fn: asFn(l) })) });
for (const [k, lines] of Object.entries(ARRIVAL_TENSIONS)) pools.push({ id: `ARRIVAL_TENSIONS.${k}`, beat: 'CLOSING', key: `safety/prosperity ${k}`, file: 'arrivalProse.js:479', lines: lines.map((l) => ({ fn: asFn(l) })) });
for (const [k, lines] of Object.entries(ARRIVAL_MEMORIES)) pools.push({ id: `ARRIVAL_MEMORIES.${k}`, beat: 'CLOSING', key: `recent event ${k}`, file: 'arrivalProse.js:520', lines: lines.map((l) => ({ fn: asFn(l) })) });

const splitSentences = (p) => String(p || '').split(/(?<=[.?!])\s+(?=[A-Z"'‘“])/).map((s) => s.trim()).filter(Boolean);
const mask = (t, s) => s.split(t.name).join('§');
const arrival = []; // per town: { t, beats: [{pool, idx, text}], residue, sentences }
for (const t of towns) {
  const para = String(t.arrivalScene || ''); const noun = tierNounFor(t.tier);
  const hits = [];
  for (const p of pools) p.lines.forEach((ln, idx) => {
    let text; try { text = ln.fn(t.name, t.tier); } catch { return; }
    if (typeof text !== 'string' || text.length < 12) return;
    const forms = ln.hook ? [speakTierNoun(text, noun), text] : [text];
    for (const f of forms) { const at = para.indexOf(f); if (at >= 0) { hits.push({ pool: p, idx, text: f, at }); break; } }
  });
  // keep non-overlapping longest hits
  hits.sort((a, b) => b.text.length - a.text.length);
  const kept = []; for (const h of hits) if (!kept.some((k) => h.at < k.at + k.text.length && k.at < h.at + h.text.length)) kept.push(h);
  kept.sort((a, b) => a.at - b.at);
  let residue = para; for (const k of kept) residue = residue.replace(k.text, '');
  arrival.push({ t, beats: kept, residue: residue.trim(), sentences: splitSentences(para) });
}
const unattributed = arrival.filter((a) => a.residue.length > 0);
out(`\nF1.2 ARRIVAL PARAGRAPH (record field arrivalScene, composed by src/generators/narrative/arrivalScene.js :: composeArrivalScene): ${arrival.filter((a) => a.t.arrivalScene).length} towns with one; sentences per paragraph mean ${(arrival.reduce((s, a) => s + a.sentences.length, 0) / arrival.length).toFixed(2)}`);
out(`attribution: ${arrival.reduce((s, a) => s + a.beats.length, 0)} beats matched to a pool line; ${unattributed.length} towns keep unattributed residue${unattributed.length ? `, e.g. ${unattributed.slice(0, 3).map((a) => `[${a.t.__seed}] "${a.residue.slice(0, 120)}"`).join(' ; ')}` : ''}`);
out('pool | beat | key | file | size (lines incl. twins) | towns drawing | distinct lines drawn | commonest line share of its drawers');
const poolRows = pools.map((p) => {
  const draws = arrival.flatMap((a) => a.beats.filter((b) => b.pool === p).map((b) => ({ seed: a.t.__seed, idx: b.idx })));
  return { p, n: new Set(draws.map((d) => d.seed)).size, distinct: new Set(draws.map((d) => d.idx)).size, topShare: draws.length ? tally(draws.map((d) => d.idx))[0][1] / draws.length : 0 };
}).filter((r) => r.n > 0).sort((a, b) => b.n - a.n);
for (const r of poolRows) out(`${r.p.id.padEnd(44)} | ${r.p.beat.padEnd(7)} | ${r.p.key.padEnd(30)} | ${r.p.file.padEnd(26)} | ${String(r.p.lines.length).padStart(3)} | ${String(r.n).padStart(3)} | ${r.distinct} | ${(100 * r.topShare).toFixed(0)}%`);
out(`pools never drawn on the 300: ${pools.filter((p) => !poolRows.some((r) => r.p === p)).length} of ${pools.length}`);
const beatsBy = (beat) => arrival.map((a) => a.beats.find((b) => b.pool.beat === beat)).filter(Boolean);
for (const beat of ['HOOK', 'SIGHT', 'SENSE', 'PEOPLE', 'CLOSING']) {
  const b = beatsBy(beat); out(`beat ${beat}: present in ${b.length}/${towns.length} paragraphs; distinct lines (name-masked) ${new Set(b.map((x) => x.pool.id + '#' + x.idx)).size}`);
}
// verbatim sharing
const sentTowns = (key) => { const m = new Map(); for (const a of arrival) for (const s of new Set(a.sentences.map((x) => key(a.t, x)))) { if (!m.has(s)) m.set(s, new Set()); m.get(s).add(a.t.__seed); } return m; };
const strictM = sentTowns((t, s) => s); const maskedM = sentTowns((t, s) => mask(t, s));
const sharesWith = (m, key) => (a) => a.sentences.some((s) => m.get(key(a.t, s)).size > 1);
const shStrict = arrival.filter(sharesWith(strictM, (t, s) => s)); const shMasked = arrival.filter(sharesWith(maskedM, (t, s) => mask(t, s)));
out(`\nShare of towns whose paragraph shares a sentence VERBATIM with another town's: strict ${shStrict.length}/${towns.length} = ${pct(shStrict.length, towns.length)}; with the town's own name masked ${shMasked.length}/${towns.length} = ${pct(shMasked.length, towns.length)}`);
for (const size of SIZES) { const g = arrival.filter((a) => a.t.__size === size); out(`  ${size.padEnd(10)} strict ${pct(g.filter(sharesWith(strictM, (t, s) => s)).length, g.length)}  masked ${pct(g.filter(sharesWith(maskedM, (t, s) => mask(t, s))).length, g.length)}`); }
out('commonest shared sentences (strict, no name in them):');
[...strictM].sort((a, b) => b[1].size - a[1].size).slice(0, 10).forEach(([k, s]) => {
  const owner = arrival.find((a) => a.sentences.includes(k)); const b = owner?.beats.find((x) => x.text.includes(k));
  out(`  ${s.size} towns: ${k.slice(0, 130)}  [${b ? `${b.pool.id} #${b.idx}` : 'part of a multi-sentence line'}]`);
});
// the chair's example: the germanic people line
const germ = arrival.filter((a) => a.t.config?.culture === 'germanic');
out(`germanic towns: ${germ.length}; their PEOPLE line: ${tally(germ.map((a) => { const b = a.beats.find((x) => x.pool.id === 'ARRIVAL_PEOPLE.germanic'); return b ? `#${b.idx}` : 'none'; })).map(([k, c]) => `${k} ${c}`).join(', ')} (ARRIVAL_PEOPLE.germanic has ${ARRIVAL_PEOPLE.germanic.length} lines, src/data/arrivalProse.js:389)`);
out('PEOPLE pool size vs drawers, by culture: ' + Object.keys(ARRIVAL_PEOPLE).map((k) => { const d = arrival.filter((a) => a.beats.some((b) => b.pool.id === `ARRIVAL_PEOPLE.${k}`)); return `${k} ${ARRIVAL_PEOPLE[k].length}L/${d.length}T`; }).join(', '));

// ═════════════════════════════════════════ F1.3 VISITOR'S ODDS ═════════════════════════════════════════
const tripleOdds = (items, keysOf) => { // exact over all C(n,3) triples
  const n = items.length; const ks = items.map((x) => new Set(keysOf(x)));
  const share = Array.from({ length: n }, () => new Uint8Array(n));
  for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) { let s = 0; for (const k of ks[i]) if (ks[j].has(k)) { s = 1; break; } share[i][j] = share[j][i] = s; }
  let hit = 0, tot = 0, pairs = 0, pairHit = 0;
  for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) { pairs++; pairHit += share[i][j]; }
  for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) { const sij = share[i][j]; const ri = share[i], rj = share[j]; for (let k = j + 1; k < n; k++) { tot++; if (sij || ri[k] || rj[k]) hit++; } }
  return { triple: hit / tot, pair: pairHit / pairs };
};
out('\nF1.3 THE VISITOR\'S ODDS (exact over every triple of distinct towns; pair odds beside)');
const tKeys = (t) => (t.history?.currentTensions || []).map((x) => x.description);
const aStrict = (t) => splitSentences(t.arrivalScene); const aMasked = (t) => splitSentences(t.arrivalScene).map((s) => mask(t, s));
const show = (label, keysOf) => {
  const all = tripleOdds(towns, keysOf);
  out(`${label}: all sizes mixed P(>=2 of 3 share) = ${(100 * all.triple).toFixed(1)}% (a pair: ${(100 * all.pair).toFixed(1)}%) | per size: ${SIZES.map((s) => { const r = tripleOdds(towns.filter((t) => t.__size === s), keysOf); return `${s} ${(100 * r.triple).toFixed(1)}%`; }).join(', ')}`);
};
show('tension text, word for word', tKeys);
show('tension SIDE-NAME SET, word for word', (t) => (t.history?.currentTensions || []).map((x) => (x.factions || []).join(' | ')));
show('arrival sentence, strict', aStrict);
show('arrival sentence, own name masked', aMasked);

// ═════════════════════════════════════════ F2 ═════════════════════════════════════════
// The explicit presumption table: a printed description or side (matched by regex on the PRINTED string) -> the house it
// presumes -> the record field that would show it. Declared = the template already refuses where the field is false
// (historyGenerator.js :: HISTORY_TEMPLATE_RECORD_DECLARATIONS).
const instNames = (t) => nativeSemanticNames(t.institutions || []).map((s) => s.toLowerCase());
const fac = (t) => t.powerStructure?.factions || [];
const EVID = {
  market: { field: 'factsOf(record).market (facts/market.js)', has: (t, f) => f.market === true },
  guild: { field: 'factsOf(record).guild (facts/guild.js)', has: (t, f) => f.guild === true },
  legal: { field: 'factsOf(record).legalHouse || .courtSits (facts/legalHouse.js, defence.js)', has: (t, f) => f.legalHouse === true || f.courtSits === true },
  temple: { field: "factsOf(record).hasInstitution('temple') || .sacredHouse", has: (t, f) => f.hasInstitution?.('temple') === true || f.sacredHouse === true },
  healer: { field: "factsOf(record).defence.healer || .hospital", has: (t, f) => f.defence?.healer === true || f.defence?.hospital === true },
  scholar: { field: "factsOf(record).hasInstitution('school') or an institution named academy/university/college/library/mage/wizard", has: (t, f) => f.hasInstitution?.('school') === true || instNames(t).some((n) => /academ|universit|college|librar|mage|wizard|arcan|scriptor/.test(n)) },
  creditor: { field: "factsOf(record).hasInstitution('bank') or market", has: (t, f) => f.hasInstitution?.('bank') === true || f.market === true },
  criminal: { field: 'crimeSignalOf({ seats: factions, estate: institutions }).present (domain/crimeSignal.js:37; the fill gate itself)', has: (t) => crimeSignalOf({ seats: fac(t), estate: t.institutions || [] }).present === true },
  criminalPower: { field: 'powerStructure.factions[].category === criminal', has: (t) => fac(t).some((x) => x.category === 'criminal') },
  force: { field: 'factsOf(record).defence.watch || .garrison || .militia', has: (t, f) => !!(f.defence?.watch || f.defence?.garrison || f.defence?.militia) },
  officials: { field: 'factsOf(record).appointedPost', has: (t, f) => f.appointedPost === true },
};
const PRESUME = [
  { kind: 'desc', re: /merchants are getting richer|merchant class prospers/i, cls: 'market', declared: true, where: 'economic_disparity base/variant2' },
  { kind: 'desc', re: /every merchant and every purse/i, cls: 'market', declared: true, where: 'trade_dispute base/unanchored' },
  { kind: 'desc', re: /guilds? (fought|and non-guild)|rival guilds/i, cls: 'guild', declared: true, where: 'guild_conflict' },
  { kind: 'desc', re: /speculative frenzy|coming crash/i, cls: 'market', declared: true, where: 'market_crash' },
  { kind: 'desc', re: /legally plausible|legally unresolved/i, cls: 'legal', declared: false, where: 'disputed_land base; occupation_legacy unanchored' },
  { kind: 'desc', re: /price gouging/i, cls: 'market', declared: false, where: 'resource_scarcity base' },
  { kind: 'desc', re: /official corruption/i, cls: 'officials', declared: false, where: 'corruption_scandal base' },
  { kind: 'desc', re: /trade the settlement (was built upon|lives on)|\{route_type\} trade/i, cls: 'market', declared: false, where: 'trade_collapse' },
  { kind: 'side', re: /^Legal class/i, cls: 'legal', declared: false, where: 'disputed_land' },
  { kind: 'side', re: /^Merchants who benefit from cheap newcomer labour/i, cls: 'market', declared: false, where: 'population_friction' },
  { kind: 'side', re: /^Merchants (tied|who trade)/i, cls: 'market', declared: true, where: 'trade_dispute' },
  { kind: 'side', re: /^the merchant class$/i, cls: 'market', declared: true, where: "economic_disparity 'Wealthy merchants' fallback (substituteNames)" },
  { kind: 'side', re: /^(Displaced traders|Traders who fear)/i, cls: 'market', declared: false, where: 'trade_collapse' },
  { kind: 'side', re: /^Price regulators/i, cls: 'market', declared: false, where: 'resource_scarcity base' },
  { kind: 'side', re: /^Creditors calling/i, cls: 'creditor', declared: true, where: 'market_crash' },
  { kind: 'side', re: /guild/i, cls: 'guild', declared: true, where: 'guild_conflict' },
  { kind: 'side', re: /^Temple beneficiaries/i, cls: 'temple', declared: true, where: 'pilgrimage_surge' },
  { kind: 'side', re: /^the orthodox clergy$/i, cls: 'temple', declared: false, where: "religious_tension 'Orthodox believers' fallback (substituteNames)" },
  { kind: 'side', re: /^Healers and charlatans/i, cls: 'healer', declared: false, where: 'plague_years base' },
  { kind: 'side', re: /^Scholars studying/i, cls: 'scholar', declared: false, where: 'wild_magic base' },
  { kind: 'side', re: /^the criminal network$/i, cls: 'criminal', declared: false, where: "crime_wave 'Criminal organisations' fallback (substituteNames)" },
  { kind: 'side', re: /^the criminal network$/i, cls: 'criminalPower', declared: false, where: "crime_wave fallback, against a criminal POWER" },
  { kind: 'side', re: /^Local enforcement$/i, cls: 'force', declared: false, where: "crime_wave 'Official guards' fallback forceParty" },
];
out('\nF2.1 PRESUMED HOUSES. Table rows (regex on the printed string) | class | record field | declared? | drawn in towns | of those, record LACKS it');
const factsCache = new Map(); const factsFor = (t) => { if (!factsCache.has(t)) factsCache.set(t, factsOf(t)); return factsCache.get(t); };
for (const row of PRESUME) {
  const drew = towns.filter((t) => (t.history?.currentTensions || []).some((x) => (row.kind === 'desc' ? [x.description] : (x.factions || [])).some((s) => row.re.test(String(s)))));
  const lack = drew.filter((t) => !EVID[row.cls].has(t, factsFor(t)));
  out(`  ${row.where.padEnd(58)} ${row.kind} ${String(row.re).slice(0, 60).padEnd(62)} | ${row.cls.padEnd(9)} | ${row.declared ? 'declared' : 'NOT declared'} | drew ${String(drew.length).padStart(3)} (${pct(drew.length, towns.length)}) | lacks ${lack.length}${drew.length ? ` (${pct(lack.length, drew.length)} of drawers; ${pct(lack.length, towns.length)} of 300)` : ''}${lack.length ? ` e.g. ${lack.slice(0, 3).map((t) => t.__seed).join(', ')}` : ''}`);
}
out('record fields, fill over the 300: ' + Object.entries(EVID).map(([k, e]) => `${k} ${pct(towns.filter((t) => e.has(t, factsFor(t))).length, towns.length)}`).join(', '));
for (const size of SIZES) out(`  ${size.padEnd(10)} ` + Object.entries(EVID).map(([k, e]) => `${k} ${pct(towns.filter((t) => t.__size === size && e.has(t, factsFor(t))).length, N)}`).join(', '));
// "Official guards" substitution reads a faction NAMED like a military: what did it print?
out('crime_wave "Official guards" printed as: ' + tally(allT.filter((x) => x.type === 'crime_wave').map((x) => x.sides[0])).map(([k, c]) => `${k} ${c}`).join(', '));
out('economic_disparity "Wealthy merchants" printed as (with the faction category): ' + tally(allT.filter((x) => x.type === 'economic_disparity').map((x) => { const f = fac(x.t).find((y) => y.faction === x.sides[0]); return `${x.sides[0]} [${f?.category ?? 'not a power'}]`; })).map(([k, c]) => `${k} ${c}`).join(', '));
out('succession_crisis "Power behind throne"/"Legitimate heir" printed as: ' + tally(allT.filter((x) => x.type === 'succession_crisis').map((x) => x.sides.join(' | '))).map(([k, c]) => `${k} ${c}`).join(' ;; '));

// F2.2 nameable sides: template side -> role -> the record's candidate
const ROLE = [
  [/^(Wealthy merchants|Merchants who benefit|Merchants tied|Merchants who trade|Displaced traders|Traders who fear|Creditors calling|Ruined speculators)/i, 'merchants', (t) => fac(t).filter((f) => f.category === 'economy' && /merchant|trade|bank|guild/i.test(f.faction)).map((f) => f.faction)],
  [/^(Established guilds|Upstart guilds|Guild members)/i, 'guilds', (t) => fac(t).filter((f) => /guild/i.test(f.faction)).map((f) => f.faction)],
  [/^(Orthodox believers|Temple beneficiaries|The accusers)/i, 'clergy', (t) => fac(t).filter((f) => f.category === 'religious').map((f) => f.faction)],
  [/^(Official guards|Security hardliners|Quarantine hardliners|Prepare for war)/i, 'force', (t) => fac(t).filter((f) => f.category === 'military').map((f) => f.faction)],
  [/^(Criminal organisations|Actual agents)/i, 'criminal', (t) => [...fac(t).filter((f) => f.category === 'criminal').map((f) => f.faction), ...(t.institutions || []).filter((i) => i.priorityCategory === 'criminal').map((i) => String(i.name).toLowerCase())]],
  [/^(Legitimate heir|Corrupt officials|The sitting authority|Those in charge|Authorities caught|Authorities exploiting|Those in authority|Price regulators|Those who would fix a fair price|Old loyalists|Those who want a strong hand)/i, 'rulers', (t) => fac(t).filter((f) => f.isGoverning).map((f) => f.faction)],
  [/^(Power behind throne)/i, 'second power', (t) => fac(t).filter((f) => !f.isGoverning).map((f) => f.faction)],
  [/^(Old families|Original claimants|Landowners|Collaborator families|Loyalist families)/i, 'old/landed families', (t) => fac(t).filter((f) => /noble|gentry|landed|lord|famil|house|clan|elder/i.test(f.faction) && !f.isGoverning).map((f) => f.faction)],
  [/^(Healers and charlatans)/i, 'healers', (t) => instNames(t).filter((n) => /healer|hospital|physician|herbal|apothec|infirm|wise/.test(n))],
  [/^(Scholars studying|Those who would study)/i, 'scholars', (t) => [...fac(t).filter((f) => /arcane|mage|wizard|scholar|academ/i.test(f.faction) || f.category === 'magic').map((f) => f.faction), ...instNames(t).filter((n) => /academ|universit|college|librar|mage|wizard|arcan|scriptor/.test(n))]],
  [/^(Legal class)/i, 'legal class', (t) => instNames(t).filter((n) => /court|scribe|notar|law|magistr|advocat/.test(n))],
  [/^(Pro-magic|Regulation advocates|The changed|Those touched by the flares)/i, 'magic users', (t) => fac(t).filter((f) => /arcane|mage|wizard|magic/i.test(f.faction)).map((f) => f.faction)],
];
// template side names (for "printed generic" vs "named from the record")
const templateSides = new Set(HISTORICAL_EVENTS_DATA.flatMap((e) => [...(e.factions || []), ...(e.byMemory?.dated?.factions || []), ...(e.byMemory?.unanchored?.factions || [])]));
const subFallbacks = { 'the merchant class': 'Wealthy merchants', 'the criminal network': 'Criminal organisations', 'the orthodox clergy': 'Orthodox believers', 'Local enforcement': 'Official guards', 'The garrison': 'Official guards', 'The watch': 'Official guards', 'The militia': 'Official guards' };
// reconstruct each printed side's template side by position in its template's set
const sideRows = [];
for (const x of allT) {
  const tmpl = HISTORICAL_EVENTS_DATA.find((e) => e.type === x.type);
  const candSets = [tmpl?.factions, tmpl?.byMemory?.dated?.factions, tmpl?.byMemory?.unanchored?.factions].filter(Boolean);
  const set = candSets.find((s) => s.length === x.sides.length && s.every((v, i) => templateSides.has(x.sides[i]) ? x.sides[i] === v : true)) || candSets[0] || [];
  x.sides.forEach((printed, i) => {
    const tside = templateSides.has(printed) ? printed : subFallbacks[printed] ?? set[i] ?? printed;
    sideRows.push({ x, printed, tside, generic: templateSides.has(printed) || printed in subFallbacks });
  });
}
out(`\nF2.2 NAMEABLE SIDES: ${sideRows.length} printed sides over ${allT.length} tensions; printed generic (a template phrase) ${pct(sideRows.filter((r) => r.generic).length, sideRows.length)}, named from the record (substituteNames, historyGenerator.js buildHistoricalEvent) ${pct(sideRows.filter((r) => !r.generic).length, sideRows.length)}`);
out('role | template sides | drawn | already named | a candidate exists in the record (of drawn) | of the generic ones, nameable | commonest candidate');
let roleDrawn = 0, roleCand = 0, roleGeneric = 0, roleGenericCand = 0;
for (const [re, role, cand] of ROLE) {
  const rows = sideRows.filter((r) => re.test(r.tside));
  if (!rows.length) { out(`${role.padEnd(20)} | ${String(re).slice(0, 50)} | drawn 0`); continue; }
  const c = rows.filter((r) => cand(r.x.t).length > 0); const gen = rows.filter((r) => r.generic); const genC = gen.filter((r) => cand(r.x.t).length > 0);
  roleDrawn += rows.length; roleCand += c.length; roleGeneric += gen.length; roleGenericCand += genC.length;
  out(`${role.padEnd(20)} | ${[...new Set(rows.map((r) => r.tside))].join('; ').slice(0, 90).padEnd(90)} | ${String(rows.length).padStart(3)} | ${pct(rows.length - gen.length, rows.length)} | ${pct(c.length, rows.length)} | ${genC.length}/${gen.length} | ${tally(rows.flatMap((r) => cand(r.x.t).slice(0, 1))).slice(0, 3).map(([k, n]) => `${k} ${n}`).join(', ')}`);
}
out(`ALL ROLES: ${roleDrawn} drawn sides with a role; a record candidate exists for ${pct(roleCand, roleDrawn)}; ${roleGeneric} printed generic, of which ${roleGenericCand} (${pct(roleGenericCand, roleGeneric)}) have a candidate the record holds; sides with no role class (crowds: Reformers, Newcomers, Hoarders...): ${sideRows.length - roleDrawn}`);
out('faction names x category over the 300: ' + tally(towns.flatMap((t) => fac(t).map((f) => `${f.faction} [${f.category}]`))).map(([k, c]) => `${k} ${c}`).join(', '));
