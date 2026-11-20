import * as require_fs from 'node:fs';
const [, , A, B] = process.argv;
const forge = async (L) => { const { generateSettlementPipeline } = await import(`${L}/src/generators/generateSettlementPipeline.js`);
  const { birthConfig, loadGenerationLawPayloads } = await import(`${L}/src/domain/density/densityCreateBoundary.js`);
  const { DEFAULT_CONFIG } = await import(`${L}/src/store/configSlice.js`); await loadGenerationLawPayloads();
  const out = []; for (const size of ['thorp','hamlet','village','town','city','metropolis']) for (let i = 0; i < 50; i++) out.push(generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, settType: size }), null, { seed: `hxd-${size}-${i}`, customContent: {} })); return out; };
const a = await forge(A), b = await forge(B);
const fk = {}; const g12 = []; let moved = 0, withCorr = 0, without = 0, goalMoved = 0, goalNoTie = 0; const ex = [];
for (let k = 0; k < a.length; k++) { const ta = a[k], tb = b[k];
  const corr = new Set(ta.npcs.filter((n, j) => n.influence !== tb.npcs[j]?.influence).map((n) => String(n.id)));
  const ids = (r) => [r.from, r.to].map(String);
  const touched = new Set();
  const byB = new Map(tb.relationships.map((r) => [String(r.from) + '>' + String(r.to), r]));
  ta.relationships.forEach((r, j) => { const s = byB.get(String(r.from) + '>' + String(r.to)); if (JSON.stringify(r) === JSON.stringify(s)) return; moved++; const p = ids(r); p.forEach((x) => touched.add(x)); if (p.some((x) => corr.has(x))) withCorr++; else { without++; for (const k of Object.keys(r)) if (JSON.stringify(r[k]) !== JSON.stringify(s?.[k])) fk[k] = (fk[k] || 0) + 1; if (ex.length < 3) ex.push(JSON.stringify(r).slice(0,300) + ' || ' + JSON.stringify(s).slice(0,300)); } });
  ta.npcs.forEach((n, j) => { if (JSON.stringify(n.goal) !== JSON.stringify(tb.npcs[j].goal)) { goalMoved++; if (!touched.has(String(n.id)) && !corr.has(String(n.id))) { goalNoTie++; g12.push({ town: ta.name, tier: ta.tier, k, id: n.id, a: n.goal, b: tb.npcs[j].goal, tiesOf: ta.relationships.filter((r) => String(r.from) === String(n.id) || String(r.to) === String(n.id)).map((r) => ({ to: r.to, from: r.from, type: r.type, moved: JSON.stringify(r) !== JSON.stringify(byB.get(String(r.from) + '>' + String(r.to))), corrTo: corr.has(String(r.to)) || corr.has(String(r.from)) })) }); } } }); }
require_fs.writeFileSync(process.env.G12, JSON.stringify(g12, null, 1)); console.log(fk, { moved, withCorr, without, goalMoved, goalNoTie, ex });
