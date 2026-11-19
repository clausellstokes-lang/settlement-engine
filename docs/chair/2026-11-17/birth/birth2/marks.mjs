// item 3: the marks, base against tip. node marks.mjs <baseTree> <baseCorpus> <tipTree> <tipCorpus> -> JSON
import fs from 'node:fs'; import zlib from 'node:zlib';
const [bt, bc, tt, tc] = process.argv.slice(2);
const load = (f) => new Map(zlib.gunzipSync(fs.readFileSync(f)).toString().trim().split('\n').map((l) => { const o = JSON.parse(l); return [o.seed, o.s]; }));
const marksOf = async (tree, corpus) => { const HI = await import(tree + '/src/domain/facts/houseInputAtHand.js'); const CSR = await import(tree + '/src/domain/display/crisisStoppedRow.js');
  const out = new Map(); for (const [seed, s] of load(corpus)) { const m = new Map();
    for (const [h] of HI.housesShortOf(s)) { const inst = s.institutions.find((i) => i.name === h) || { name: h }; m.set(h, CSR.rowMarkText(s, 'house', inst) || '(no row mark)'); }
    const v = HI.ventureHouseOf ? HI.ventureHouseOf(s) : null; if (v) { const inst = s.institutions.find((i) => i.name === v.name); m.set(v.name, CSR.rowMarkText(s, 'house', inst) || '(venture, no row mark)'); }
    out.set(seed, { m, calm: !(s.config?.stressTypes || []).length, conn: /^(major|standard|seasonal)/.test('') || true, s }); } return out; };
const B = await marksOf(bt, bc), T = await marksOf(tt, tc);
const { hasTradeRouteConnection } = await import(tt + '/src/domain/tradeRouteSemantics.js');
const R = { all: { base: 0, tip: 0, unmarked: 0, marked: 0, newMarks: {}, gone: {} }, calm: { base: 0, tip: 0, unmarked: 0, marked: 0, newMarks: {}, gone: {} } };
const ex = {};
for (const [seed, b] of B) { const t = T.get(seed); const calm = (t.s.config?.stressTypes || []).length === 0 && hasTradeRouteConnection(String(t.s.config?.tradeRouteAccess ?? ''));
  for (const k of calm ? ['all', 'calm'] : ['all']) { const r = R[k]; r.base += b.m.size; r.tip += t.m.size;
    for (const [h, txt] of b.m) if (!t.m.has(h)) { r.unmarked++; const key = `${h.replace(/ \(.*\)/, '')}: ${txt}`; r.gone[key] = (r.gone[key] || 0) + 1; }
    for (const [h, txt] of t.m) if (!b.m.has(h)) { r.marked++; const key = `${h.replace(/ \(.*\)/, '')}: ${txt}`; r.newMarks[key] = (r.newMarks[key] || 0) + 1; ((ex[key] ||= [])).length < 3 && ex[key].push(seed); } } }
for (const k of ['all', 'calm']) for (const f of ['newMarks', 'gone']) R[k][f] = Object.fromEntries(Object.entries(R[k][f]).sort((a, b) => b[1] - a[1]).slice(0, 25));
R.examples = ex; console.log(JSON.stringify(R, null, 1));
