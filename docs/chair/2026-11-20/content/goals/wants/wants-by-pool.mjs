// GOALS-3 builder 9 (scratch measure, docs only): THE WANTS BY POOL. Reads a birth file of wants-born.mjs (the chair's
// measure towns, each want with its cell from the deal's receipts) and prints, for the city and metropolis towns:
//   (A) the chair's cross-town measure, all 2,450 ordered pairs a size (bill.mjs's metric: the share of B's wants whose
//       masked text stands among A's wants of that vantage, mean over pairs);
//   (B) per CELL (family/kind/vantage): its lines (cell + reserve), its holdings per town, the repeats it carries (count,
//       share of all repeats, points of the pair share), its holders' offices (card role) and kinds (card category), and
//       the rotation's rungs (how many holdings pass two moved, and how many sit on a RESERVE line: what the reserve absorbs);
//   (C) THE BILL BY CELL: a cell of N drawn lines deals its templates without replacement inside a town (the held-text and
//       wording rules), so B's want (template j, fill f) stands among A's with chance min(1, m_A(f)/N), m_A(f) = A's
//       holdings of that cell with the same fill (names masked; unmasked fills such as a house noun or a resource kept);
//       overflow past N goes to the reserve in rotation order. A cell's points of the pair share at N = n + k are thus
//       computed exactly in expectation; the greedy adds one line at a time where it buys the most fall, until a city's
//       pair share falls under the target. The model's own k = 0 figure is printed beside the observed one (its error).
// Usage: node wants-by-pool.mjs <born.json> [target=0.30] [margin=0.01] [budget a vantage=190]   (the bills also go to <born>.bill.json)
import fs from 'node:fs';
const [, , IN, TG = '0.30', MG = '0.01', BG = '190'] = process.argv;
const MARGIN = +MG, BUDGET = +BG;
const D = JSON.parse(fs.readFileSync(IN, 'utf8'));
const TARGET = +TG;
const SZ = ['city', 'metropolis'];
const V = ['short', 'long'];
const pct = (x) => (100 * x).toFixed(1) + '%';
const pp = (x) => (100 * x).toFixed(2);
const mean = (a) => (a.length ? a.reduce((x, y) => x + y, 0) / a.length : NaN);
const tally = (a) => { const m = new Map(); for (const k of a) m.set(k, (m.get(k) || 0) + 1); return [...m].sort((x, y) => y[1] - x[1]); };
const cellOf = (h, v) => (h.t >= 0 || h.n > 0 ? `${h.f}/${h.k}/${v}` : `${h.f}/${h.k}/${v} (no cell)`);
const bySize = Object.fromEntries(SZ.map((s) => [s, D.towns.filter((t) => t.tier === s)]));
const PAIRS = (n) => { const a = []; for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) if (i !== j) a.push([i, j]); return a; };
// the reserve's size per cell, and the cell's own line count, from the holdings (n) and the highest reserve index seen
const GF = await import(new URL(`file://${D.tree}/src/data/people/goalFamilies.js`).href);
const cellLines = (key) => { const [f, k, v] = key.split('/'); return { n: (GF.GOAL_FAMILY_LINES[f]?.[k]?.[v] || []).length, r: (GF.GOAL_RESERVE_LINES?.[f]?.[k]?.[v] || []).length }; };
console.log(`birth file ${IN}: ${D.towns.length} towns (${D.sizes.join(',')}), tree ${D.tree}, append ${D.append ? JSON.stringify(D.append) : 'none'}`);

const OUT = { target: TARGET, pools: {} };
const SEQ = []; const PROJ = {}; const FILE = 60;
for (const v of V) {
  console.log(`\n================ ${v.toUpperCase()} WANTS ================`);
  const per = {}; // size -> { towns: [{ all: [h], masked: Set, cells: Map(cell -> [h]) }], pairs, obsShare, obsByCell }
  for (const s of SZ) {
    const towns = bySize[s].map((t) => { const all = t.npcs.map((n) => n[v] && { ...n[v], holder: n }).filter(Boolean); const cells = new Map();
      for (const h of all) { const c = cellOf(h, v); if (!cells.has(c)) cells.set(c, []); cells.get(c).push(h); }
      return { all, masked: new Set(all.map((h) => h.masked)), cells }; });
    const P = PAIRS(towns.length); const repBy = new Map(); const ptsBy = new Map(); let tot = 0; const shares = [];
    for (const [a, b] of P) { const A = towns[a], B = towns[b]; if (!B.all.length) continue; let c = 0;
      for (const h of B.all) if (A.masked.has(h.masked)) { const k = cellOf(h, v); repBy.set(k, (repBy.get(k) || 0) + 1); ptsBy.set(k, (ptsBy.get(k) || 0) + 1 / B.all.length); c++; tot++; }
      shares.push(c / B.all.length); }
    for (const [k, x] of ptsBy) ptsBy.set(k, x / shares.length);
    per[s] = { towns, P, obs: mean(shares), repBy, ptsBy, tot, nPairs: shares.length };
    console.log(`(A) ${s}: ${towns.length} towns, ${mean(towns.map((t) => t.all.length)).toFixed(1)} ${v} wants a town; all ${P.length} ordered pairs: share of B's among A's ${pct(per[s].obs)}; repeats ${tot}`);
  }
  // ---- (C)'s model, per cell: points of the pair share at N lines ----
  const cells = [...new Set(SZ.flatMap((s) => per[s].towns.flatMap((t) => [...t.cells.keys()])))].filter((c) => !/no cell/.test(c));
  // per size, per cell: for every pair the list of (m_B(f), m_A(f)) over B's fill groups, compacted as counts
  const pre = {};
  for (const s of SZ) { const { towns, P } = per[s]; pre[s] = new Map();
    const groups = towns.map((t) => new Map([...t.cells].map(([c, hs]) => [c, tally(hs.map((h) => h.fill))])));
    for (const c of cells) { const rows = new Map(); // key "mb|ma|Bsize" -> weight
      for (const [a, b] of P) { const Bn = towns[b].all.length; if (!Bn) continue; const gb = groups[b].get(c); if (!gb) continue; const ga = new Map(groups[a].get(c) || []);
        for (const [f, mb] of gb) { const key = `${mb}|${ga.get(f) || 0}|${Bn}`; rows.set(key, (rows.get(key) || 0) + 1); } }
      pre[s].set(c, [...rows].map(([k, w]) => { const [mb, ma, bn] = k.split('|').map(Number); return { mb, ma, bn, w }; })); } }
  const eRep = (mb, ma, N, r) => { if (!ma) return 0; const p = Math.min(1, ma / N); const inMain = Math.min(mb, N) * p;
    const ob = Math.max(0, mb - N), oa = Math.max(0, ma - N); const inRes = Math.min(ob, oa, r); const beyond = Math.max(0, ob - r) * p; return inMain + inRes + beyond; };
  const pts = (s, c, k) => { const { n, r } = cellLines(c); const N = n + k; let x = 0; for (const { mb, ma, bn, w } of pre[s].get(c) || []) x += w * eRep(mb, ma, N, r) / bn; return x / per[s].nPairs; };
  // ---- (B) per cell ----
  console.log(`\n(B) PER CELL (${v}), worst first by the city's repeats. lines = cell+reserve; hold/town = mean holdings a town (city · metropolis);`);
  console.log('    reps% = the cell\'s share of all repeats; pts = points of the pair share it carries (observed · the model at k=0);');
  console.log('    rungs over city+metropolis: drawn line kept · moved by pass two (to a cell line · to a RESERVE line) · twice/same-power/stands/exhausted · refused-by-secret');
  const rowsB = cells.map((c) => ({ c, rc: per.city.repBy.get(c) || 0 })).sort((a, b) => b.rc - a.rc);
  for (const { c } of rowsB) {
    const { n, r } = cellLines(c);
    const hs = SZ.flatMap((s) => per[s].towns.flatMap((t) => t.cells.get(c) || []));
    const hpt = SZ.map((s) => mean(per[s].towns.map((t) => (t.cells.get(c) || []).length)).toFixed(2));
    const repS = SZ.map((s) => `${pct((per[s].repBy.get(c) || 0) / per[s].tot)}`);
    const ptsS = SZ.map((s) => `${pp(per[s].ptsBy.get(c) || 0)}/${pp(pts(s, c, 0))}`);
    const moved = hs.filter((h) => h.rot); const toRes = hs.filter((h) => h.t >= n);
    const rung = Object.fromEntries(tally(hs.map((h) => h.rung).filter(Boolean)));
    const roles = tally(hs.map((h) => h.holder.role)).slice(0, 10).map(([x, k]) => `${x} ${k}`).join(', ');
    const cats = tally(hs.map((h) => h.holder.cat)).map(([x, k]) => `${x} ${Math.round(100 * k / hs.length)}%`).join(', ');
    const tu = tally(hs.filter((h) => h.t >= 0).map((h) => h.t)).sort((a, b) => a[0] - b[0]).map(([t, k]) => `${t < n ? t : 'R' + (t - n)}:${k}`).join(' ');
    console.log(`\n  ${c}  lines ${n}+${r}  hold/town ${hpt.join(' · ')}  reps% ${repS.join(' · ')}  pts ${ptsS.join(' · ')}`);
    console.log(`    rungs: kept ${hs.length - moved.length - hs.filter((h) => h.refusedBy).length} · moved ${moved.length} (to cell ${moved.length - moved.filter((h) => h.t >= n).length} · to reserve ${toRes.length}) · ${['twice', 'twice-same-power', 'stands', 'exhausted'].map((x) => `${x} ${rung[x] || 0}`).join(' · ')} · refused-by-secret ${hs.filter((h) => h.refusedBy).length}`);
    console.log(`    template use (index:holdings, R = reserve): ${tu}`);
    console.log(`    offices (role): ${roles}`);
    console.log(`    kinds (category): ${cats}`);
  }
  const nocell = SZ.flatMap((s) => per[s].towns.flatMap((t) => [...t.cells].filter(([c]) => /no cell/.test(c)).flatMap(([, hs]) => hs)));
  console.log(`\n  no cell (CRISIS lines and the like): ${nocell.length} holdings over city+metropolis; city repeats ${[...per.city.repBy].filter(([c]) => /no cell/.test(c)).reduce((x, [, y]) => x + y, 0)}`);
  // ---- (C) the bill ----
  // CALIBRATED: each cell's model points are scaled by its observed / model ratio at k = 0 (the model reads every holding of a
  // town as free to take any line; the gates, the refusals and the masker's quirks make the observed share lower), so the
  // projected fall is the model's fall at the cell's own observed level. Verified by birth: wants-verify.mjs.
  const cal = Object.fromEntries(SZ.map((s) => [s, new Map(cells.map((c) => { const m0 = pts(s, c, 0); return [c, m0 > 0 ? (per[s].ptsBy.get(c) || 0) / m0 : 1]; }))]));
  const ptsC = (s, c, k) => pts(s, c, k) * cal[s].get(c);
  const alloc = new Map(cells.map((c) => [c, 0]));
  const proj = (s) => per[s].obs - cells.reduce((x, c) => x + (ptsC(s, c, 0) - ptsC(s, c, alloc.get(c))), 0);
  const seq = []; // the build order: each line as the greedy added it, with its bill and the fall it bought (city + metropolis points)
  let stage = 1;
  const step = (gain) => { let best = null, bg = 0; for (const c of cells) { const g = gain(c, alloc.get(c)); if (g > bg) { bg = g; best = c; } }
    if (best) { const k = alloc.get(best); seq.push({ v, c: best, k: k + 1, stage, fall: both(best, k) }); alloc.set(best, k + 1); } return best; };
  const gainOf = (s) => (c, k) => ptsC(s, c, k) - ptsC(s, c, k + 1);
  const both = (c, k) => gainOf('city')(c, k) + gainOf('metropolis')(c, k);
  const snap = () => new Map(alloc);
  const total = (m) => [...m.values()].reduce((x, y) => x + y, 0);
  const show = (label, m) => {
    console.log(`\n  ${label}: +${total(m)} lines; projected city ${pct(projOf('city', m))} · metropolis ${pct(projOf('metropolis', m))}`);
    console.log('    cell                                         now  +lines  city pts before→after   metro pts before→after');
    for (const c of cells.filter((c) => m.get(c) > 0).sort((a, b) => m.get(b) - m.get(a))) { const k = m.get(c); const { n } = cellLines(c);
      console.log(`    ${c.padEnd(44)} ${String(n).padStart(4)}  ${('+' + k).padStart(5)}   ${pp(ptsC('city', c, 0)).padStart(6)} → ${pp(ptsC('city', c, k)).padEnd(6)}        ${pp(ptsC('metropolis', c, 0)).padStart(6)} → ${pp(ptsC('metropolis', c, k))}`); } };
  const projOf = (s, m) => per[s].obs - cells.reduce((x, c) => x + (ptsC(s, c, 0) - ptsC(s, c, m.get(c) || 0)), 0);
  console.log(`\n(C) THE BILL BY CELL (${v}), calibrated (each cell's model scaled to its observed points). Observed city ${pct(per.city.obs)} · metropolis ${pct(per.metropolis.obs)}.`);
  console.log(`    The model's own k=0 (uncalibrated): city ${pct(cells.reduce((x, c) => x + pts('city', c, 0), 0) + [...per.city.ptsBy].filter(([c]) => /no cell/.test(c)).reduce((x, [, y]) => x + y, 0))} · metropolis ${pct(cells.reduce((x, c) => x + pts('metropolis', c, 0), 0) + [...per.metropolis.ptsBy].filter(([c]) => /no cell/.test(c)).reduce((x, [, y]) => x + y, 0))}`);
  // (1) a CITY under the target: one line at a time where it buys the most fall in a city's share
  while (proj('city') >= TARGET - MARGIN && step(gainOf('city')));
  const B1 = snap(); show(`BILL 1, a second CITY under ${pct(TARGET)} (to ${pct(TARGET - MARGIN)}, the margin for the model's error)`, B1);
  // (2) continued: a METROPOLIS under the target too
  stage = 2; while (proj('metropolis') >= TARGET - MARGIN && step(gainOf('metropolis')));
  const B2 = snap(); show(`BILL 2, BILL 1 continued until a second METROPOLIS is under ${pct(TARGET)} too (to ${pct(TARGET - MARGIN)})`, B2);
  // (3) continued to the budget: each next line where it buys the most fall in city + metropolis together
  stage = 3; while (total(alloc) < BUDGET && step(both));
  const B3 = snap(); show(`BILL 3, BILL 2 continued to the budget of ${BUDGET} lines in this vantage, each line where it buys the most fall in city and metropolis together`, B3);
  OUT.pools[v] = { observed: { city: per.city.obs, metropolis: per.metropolis.obs }, bills: [B1, B2, B3].map((m) => ({ cells: Object.fromEntries([...m].filter(([, k]) => k)), lines: total(m), city: projOf('city', m), metropolis: projOf('metropolis', m) })) };
  SEQ.push(...seq); PROJ[v] = projOf;
}
// ---- THE BUILD ORDER: both vantages' lines merged, bill by bill, each bill's lines by the fall they buy (city + metropolis
// points of their own vantage's share), cut into files of FILE lines; the projected shares after each file ----
const order = [...SEQ].sort((a, b) => a.stage - b.stage || b.fall - a.fall);
console.log(`\n================ THE BUILD ORDER: ${order.length} lines, in files of ${FILE} ================`);
for (let f = 0; f * FILE < order.length; f++) {
  const part = order.slice(f * FILE, (f + 1) * FILE); const upTo = order.slice(0, (f + 1) * FILE);
  const mOf = (v) => { const m = new Map(); for (const x of upTo) if (x.v === v) m.set(x.c, (m.get(x.c) || 0) + 1); return m; };
  const cellsIn = new Map(); for (const x of part) cellsIn.set(`${x.c}`, (cellsIn.get(x.c) || 0) + 1);
  console.log(`\n  FILE ${f + 1}: ${part.length} lines (bills ${[...new Set(part.map((x) => x.stage))].join(', ')}); after it (cumulative ${upTo.length}): short city ${pct(PROJ.short('city', mOf('short')))} · metropolis ${pct(PROJ.short('metropolis', mOf('short')))}; long city ${pct(PROJ.long('city', mOf('long')))} · metropolis ${pct(PROJ.long('metropolis', mOf('long')))}`);
  for (const [c, k] of [...cellsIn].sort((a, b) => b[1] - a[1])) { const before = order.slice(0, f * FILE).filter((x) => x.c === c).length; console.log(`    ${c.padEnd(44)} +${k}  (lines ${before + 1}–${before + k} of the cell's new)`); }
}
OUT.order = order.map(({ v, c, k, stage }) => ({ c, k, stage }));
fs.writeFileSync(IN.replace(/\.json$/, '') + '.bill.json', JSON.stringify(OUT, null, 1));
console.log(`\nwrote ${IN.replace(/\.json$/, '')}.bill.json`);
