// THE BAR (the chair's wording ruling; E70 (c)): under the lit law, the commonest W1 and W3 sentence by size, against ~15%
// of a size's places. Usage: node bar.mjs <root> <perSize>
const [root, perArg] = process.argv.slice(2); const PER = Number(perArg || 150);
const imp = (rel) => import(`${root}/${rel}`);
const { birthConfig, loadGenerationLawPayloads } = await imp('src/domain/density/densityCreateBoundary.js');
const { generateSettlementPipeline } = await imp('src/generators/generateSettlementPipeline.js');
const { seatHolderApartOf, seatHolderLinesOf } = await imp('src/generators/factionDynamics.js');
const { SEAT_HOLDER_LINES } = await imp('src/data/seatHolderLines.js');
await loadGenerationLawPayloads();
const SIZES = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
const out = {};
for (const size of SIZES) {
  const w1 = {}, w3 = {}, w1t = {}, w3t = {}; let apartN = 0, w1N = 0, w3N = 0, w2N = 0;
  for (let i = 0; i < PER; i += 1) {
    const s = generateSettlementPipeline(birthConfig({ settType: size, culture: 'germanic' }), null, { seed: `bar-${size}-${i}`, customContent: {} });
    const ps = s.powerStructure || {}; const apart = seatHolderApartOf(ps.factions || [], s, s);
    if (!apart) continue; apartN += 1;
    const rel = seatHolderLinesOf('relation', apart); const st = seatHolderLinesOf('standing', apart);
    const seenS = new Set(), seenT = new Set(), seen3 = new Set(), seen3t = new Set();
    for (const r of ps.factionRelationships || []) {
      const n = String(r?.narrative || ''); const k = rel.findIndex((l) => n.startsWith(l));
      if (k >= 0) { seenS.add(rel[k]); seenT.add(SEAT_HOLDER_LINES.relation[k]); if (n.includes(SEAT_HOLDER_LINES.licensed[0])) w2N += 1; }
    }
    const d = String(apart.holder.desc || ''); const k3 = st.findIndex((l) => d.includes(l));
    if (k3 >= 0) { seen3.add(st[k3]); seen3t.add(SEAT_HOLDER_LINES.standing[k3]); }
    if (seenS.size) w1N += 1; if (seen3.size) w3N += 1;
    for (const x of seenS) w1[x] = (w1[x] || 0) + 1; for (const x of seenT) w1t[x] = (w1t[x] || 0) + 1;
    for (const x of seen3) w3[x] = (w3[x] || 0) + 1; for (const x of seen3t) w3t[x] = (w3t[x] || 0) + 1;
  }
  const top = (o) => Object.entries(o).sort((a, b) => b[1] - a[1])[0] || [null, 0];
  const [s1, n1] = top(w1); const [t1, m1] = top(w1t); const [s3, n3] = top(w3); const [t3, m3] = top(w3t);
  out[size] = { places: PER, holderApart: apartN, w1Places: w1N, w3Places: w3N, w2: w2N,
    w1Sentence: { n: n1, pct: +(100 * n1 / PER).toFixed(1), s: s1 }, w1Template: { n: m1, pct: +(100 * m1 / PER).toFixed(1), t: t1 },
    w3Sentence: { n: n3, pct: +(100 * n3 / PER).toFixed(1), s: s3 }, w3Template: { n: m3, pct: +(100 * m3 / PER).toFixed(1), t: t3 } };
}
console.log(JSON.stringify(out, null, 1));
