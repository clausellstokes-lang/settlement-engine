// D-WS-r3 probe 2 (REFINED under E.1): with the method's tie-break struck, does `way_logistics` keep a reach
// from the STRENGTHS alone? Candidate logistics cells, codepoint ties, uniform strength vectors (not seeds).
const lvl = { below: 0, level: 1, above: 2 };
const base = {
  way_attrition:  (s) => (s.manpower === 'above' ? 2 : 0) + (lvl[s.institutions] >= 1 ? lvl[s.institutions] : 0),
  way_coalition:  (s) => ({ alone: 0, few: 1, many: 2 })[s.chain] + (lvl[s.manpower] <= 1 ? 1 : 0),
  way_fortress:   (s) => (s.institutions === 'above' ? 2 : 0) + (lvl[s.manpower] <= 1 ? 1 : 0),
  way_harassment: (s) => (s.manpower === 'below' ? 1 : 0) + (s.institutions === 'below' ? 1 : 0) + ({ none: 0, few: 1, many: 2 })[s.ways],
  way_raiding:    (s) => (s.horses === 'horsed' ? 1 : 0) + ({ none: 0, few: 1, many: 2 })[s.ways] + (lvl[s.manpower] <= 1 ? 1 : 0),
  way_shock:      (s) => (s.materiel === 'above' ? 2 : 0) + (lvl[s.manpower] >= 1 ? lvl[s.manpower] : 0) + (s.horses === 'horsed' ? 1 : 0),
};
const L = (x) => (lvl[x] >= 1 ? lvl[x] : 0);
const variants = {
  'r2 (seafaring + institutions level+)': (s) => (s.harbour === 'seafaring' ? 1 : 0) + L(s.institutions),
  'V1 (+ materiel level+)': (s) => (s.harbour === 'seafaring' ? 1 : 0) + L(s.institutions) + L(s.materiel),
  'V2 (seafaring + materiel level+ + institutions level+, manpower below-level)': (s) => (s.harbour === 'seafaring' ? 1 : 0) + L(s.materiel) + (lvl[s.institutions] >= 1 ? 1 : 0) + (lvl[s.manpower] <= 1 ? 1 : 0),
  'V3 (seafaring + materiel level+ + institutions level+)': (s) => (s.harbour === 'seafaring' ? 1 : 0) + L(s.materiel) + (lvl[s.institutions] >= 1 ? 1 : 0),
};
const B3 = ['below', 'level', 'above']; const vecs = [];
for (const manpower of B3) for (const institutions of B3) for (const materiel of B3)
for (const kw of ['none', 'few', 'many']) for (const horses of ['poor', 'horsed'])
for (const chain of ['alone', 'few', 'many']) for (const harbour of ['landbound', 'seafaring']) vecs.push({ manpower, institutions, materiel, ways: kw, horses, chain, harbour });
for (const [name, lc] of Object.entries(variants)) {
  const cells = { ...base, way_logistics: lc }; const ws = Object.keys(cells).sort();
  const dist = {}, uq = {}; let ties = 0;
  for (const s of vecs) { const sc = ws.map((w) => cells[w](s)); const best = Math.max(...sc); const tied = ws.filter((w, i) => sc[i] === best);
    dist[tied[0]] = (dist[tied[0]] || 0) + 1; if (tied.length === 1) uq[tied[0]] = (uq[tied[0]] || 0) + 1; else ties++; }
  const min = Math.min(...ws.map((w) => dist[w] || 0)), max = Math.max(...ws.map((w) => dist[w] || 0));
  console.log(`${name}\n  all ${JSON.stringify(dist)}\n  unique ${JSON.stringify(uq)} · ties ${ties} · min ${(100 * min / vecs.length).toFixed(1)}% · max ${(100 * max / vecs.length).toFixed(1)}%`);
}
