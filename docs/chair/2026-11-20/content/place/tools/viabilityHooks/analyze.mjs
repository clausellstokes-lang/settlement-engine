// PLACE-1 · viabilityHooks MEASURE: sections A and C from measure.mjs's rows.
//   node analyze.mjs <rows.json> > out/analyze.txt
import fs from 'node:fs';
import { TEMPLATES } from './templates.mjs';
const rows = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
const SIZES = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
const by = (s) => rows.filter((r) => r.size === s);
const pad = (x, n) => String(x).padEnd(n);
const log = (...a) => console.log(...a);

log('== BEFORE: places of 100 holding any viability hook; the commonest masked hook (places / 100, of holders)');
for (const s of SIZES) {
  const rs = by(s); const holders = rs.filter((r) => r.hooks.length).length;
  const c = new Map();
  for (const r of rs) for (const m of new Set(r.hooks.map((h) => h.masked))) c.set(m, (c.get(m) || 0) + 1);
  const top = [...c.entries()].sort((a, b) => b[1] - a[1]);
  log(`${pad(s, 11)} holders ${pad(holders, 4)} top ${pad(top[0]?.[1] ?? 0, 3)} (${top[0]?.[1] ?? 0}/${holders})  "${String(top[0]?.[0] ?? '').slice(0, 90)}"`);
  for (const [m, k] of top.slice(1, 4)) log(`${' '.repeat(16)}next ${pad(k, 3)} "${m.slice(0, 90)}"`);
}

log('\n== PER TEMPLATE: places of 100 holding it, by size (thorp hamlet village town city metropolis)');
const ids = TEMPLATES.map(([id]) => id).concat('?');
for (const id of ids) {
  const cells = SIZES.map((s) => by(s).filter((r) => r.hooks.some((h) => h.template === id)).length);
  if (cells.some(Boolean)) log(`${pad(id, 24)} ${cells.map((c) => pad(c, 4)).join(' ')}`);
}
log('\n== DISTINCT MASKED TEXTS PER TEMPLATE (slots that already vary)');
for (const id of ids) {
  const t = new Map(); for (const r of rows) for (const h of r.hooks) if (h.template === id) t.set(h.masked, (t.get(h.masked) || 0) + 1);
  if (t.size) log(`${pad(id, 24)} ${t.size} text(s): ${[...t.entries()].sort((a, b) => b[1] - a[1]).slice(0, 4).map(([m, k]) => `${k}× "${m.slice(0, 70)}…"`).join(' | ')}`);
}
log('\n== CATEGORY / SEVERITY of the moderate-gap twin (S1t), by size');
for (const s of SIZES) {
  const c = new Map(); for (const r of by(s)) for (const h of r.hooks) if (h.template === 'S1t.moderateGapTwin') { const k = `${h.category} / ${h.severity}`; c.set(k, (c.get(k) || 0) + 1); }
  if (c.size) log(`${pad(s, 11)} ${[...c.entries()].map(([k, v]) => `${v}× ${k}`).join(' | ')}`);
}
log('\n== S1t holders: food band (printed / raw), route, market, granary, stores, food sources, importChannel');
const s1t = rows.filter((r) => r.hooks.some((h) => h.template === 'S1t.moderateGapTwin'));
const tally = (f) => { const c = new Map(); for (const r of s1t) { const k = JSON.stringify(f(r)); c.set(k, (c.get(k) || 0) + 1); } return [...c.entries()].sort((a, b) => b[1] - a[1]).map(([k, v]) => `${v}× ${k}`).join(' | '); };
log(`n = ${s1t.length}`);
log(`band (shown/raw): ${tally((r) => `${r.facts.foodBand}/${r.facts.foodBandRaw}`)}`);
log(`route:            ${tally((r) => r.facts.route)}`);
log(`market:           ${tally((r) => r.facts.market)}`);
log(`guild:            ${tally((r) => r.facts.guild)}`);
log(`granary:          ${tally((r) => r.facts.inst.granary)}`);
log(`mill:             ${tally((r) => r.facts.inst.mill)}`);
log(`docks:            ${tally((r) => r.facts.inst.docks)}`);
log(`tavern:           ${tally((r) => r.facts.inst.tavern)}`);
log(`lead source:      ${tally((r) => (r.facts.foodSources || [])[0] ?? null)}`);
log(`stores (months):  ${tally((r) => (typeof r.facts.stores === 'number' ? (r.facts.stores < 1 ? '<1' : r.facts.stores < 3 ? '1-3' : r.facts.stores < 6 ? '3-6' : '6+') : r.facts.stores))}`);
log(`importChannel:    ${tally((r) => r.importChannel)}`);
log(`grain import:     ${tally((r) => (r.facts.imports || []).some((x) => /grain/i.test(x)))}`);
log(`imports > 0:      ${tally((r) => (r.facts.imports || []).length > 0)}`);
log(`war:              ${tally((r) => r.facts.war)}`);
log(`terrain:          ${tally((r) => r.facts.terrain)}`);
log(`navigable:        ${tally((r) => r.facts.water?.navigable)}`);
log(`stress:           ${tally((r) => r.stressTypes)}`);
log(`deficitPercent:   ${tally((r) => (r.deficitPercent > 0 ? 'gap>0' : 'gap 0'))}`);

log('\n== WRITER vs FINAL (C): the hooks the generateNarratives step returned against the final record');
const same = rows.filter((r) => JSON.stringify(r.atWriter.hooks.map((h) => h.hook)) === JSON.stringify(r.hooks.map((h) => h.hook))).length;
log(`hooks equal at the writer and on the final record: ${same} / ${rows.length}`);
const ch = new Map(); for (const r of rows) for (const n of r.changedBy) ch.set(n, (ch.get(n) || 0) + 1);
log(`later steps that changed the hooks: ${[...ch.entries()].map(([k, v]) => `${k} ${v}`).join(', ') || 'none'}`);
for (const r of rows.filter((x) => x.changedBy.length).slice(0, 6)) log(`   ${r.seed}: writer [${r.atWriter.hooks.map((h) => h.hook.slice(0, 40)).join(' / ')}] -> final [${r.hooks.map((h) => h.hook.slice(0, 40)).join(' / ')}]`);
log(`ctx._seed non-empty at the writer's step: ${rows.filter((r) => r.atWriter.ctxSeed).length} / ${rows.length}; equals the birth seed: ${rows.filter((r) => r.atWriter.ctxSeed === r.seed).length}`);
log(`config._seed at the writer: ${rows.filter((r) => r.atWriter.configSeed).length} / ${rows.length}; active stream seed form: ${rows[0].atWriter.rngSeed}`);
const KEYS = ['route', 'market', 'guild', 'foodBand', 'foodBandRaw', 'foodSources', 'stores', 'surplus', 'war', 'terrain', 'water', 'inst', 'imports', 'crisis'];
log('\nfacts at the writer (the thunk viability.js hands deriveSupplyRiskAnalysis) vs the final record, places that DISAGREE, all 600 / S1t holders:');
for (const k of KEYS) {
  const d = rows.filter((r) => JSON.stringify(r.atWriter.facts[k]) !== JSON.stringify(r.facts[k]));
  const d1 = d.filter((r) => r.hooks.some((h) => h.template === 'S1t.moderateGapTwin'));
  log(`   ${pad(k, 12)} ${pad(d.length, 4)} / ${d1.length}${d.length ? `   e.g. ${d[0].seed}: ${JSON.stringify(d[0].atWriter.facts[k]).slice(0, 70)} -> ${JSON.stringify(d[0].facts[k]).slice(0, 70)}` : ''}`);
}
const instDiff = new Map(); for (const r of rows) for (const k of Object.keys(r.facts.inst)) if (r.atWriter.facts.inst[k] !== r.facts.inst[k]) instDiff.set(k, (instDiff.get(k) || 0) + 1);
log(`   inst keys that disagree: ${[...instDiff.entries()].map(([k, v]) => `${k} ${v}`).join(', ') || 'none'}`);
log('\n== PER TEMPLATE AT THE WRITER (the generateNarratives step) where it differs from the final record (the drops of assembleSettlement.js :: storeTrueHooksOnly)');
const { templateOf } = await import('./templates.mjs');
for (const id of ids) {
  const w = SIZES.map((s) => by(s).filter((r) => r.atWriter.hooks.some((h) => templateOf(h.hook) === id)).length);
  const f = SIZES.map((s) => by(s).filter((r) => r.hooks.some((h) => h.template === id)).length);
  if (JSON.stringify(w) !== JSON.stringify(f)) log(`${pad(id, 24)} writer ${w.map((c) => pad(c, 4)).join(' ')}  final ${f.map((c) => pad(c, 4)).join(' ')}`);
}
