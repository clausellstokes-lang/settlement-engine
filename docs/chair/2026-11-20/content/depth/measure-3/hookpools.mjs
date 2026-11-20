// hookpools.mjs <tree> [n] [sizes,comma] — DEPTH-3: own-hook pair share over ALL ordered pairs, by size, and per pool/theme where repeats come from.
import { masker } from './born.mjs';
const L = process.argv[2]; const N = +(process.argv[3] || 50); const SIZES = (process.argv[4] || 'town,city,metropolis').split(',');
const { generateSettlementPipeline } = await import(`${L}/src/generators/generateSettlementPipeline.js`);
const { birthConfig, loadGenerationLawPayloads } = await import(`${L}/src/domain/density/densityCreateBoundary.js`);
const { DEFAULT_CONFIG } = await import(`${L}/src/store/configSlice.js`);
const { NPC_FACTION_LOYALTY } = await import(`${L}/src/data/npcData.js`);
const { themeOfText } = await import(`${L}/src/domain/hookThemes.js`);
await loadGenerationLawPayloads();
const poolOf = new Map(); for (const [k, a] of Object.entries(NPC_FACTION_LOYALTY)) for (const l of a) { const t = typeof l === 'string' ? l : l.text; if (!poolOf.has(t)) poolOf.set(t, k); }
const sizes = Object.entries(NPC_FACTION_LOYALTY).map(([k, a]) => `${k} ${a.length}`).join(', ');
console.log(`pools: ${sizes}`);
for (const size of SIZES) {
  const towns = [];
  for (let i = 0; i < N; i++) { const t = generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, settType: size }), null, { seed: `hxd-${size}-${i}`, customContent: {} }); const m = masker(t);
    towns.push((t.npcs || []).flatMap((n) => (n.plotHooks || []).filter(Boolean).map((h) => ({ pool: poolOf.get(h) || 'unmatched', theme: themeOfText(h), line: m(h) })))); }
  let shareSum = 0, pairs = 0; const rep = {}, drw = {}, repT = {};
  const sets = towns.map((d) => new Set(d.map((x) => x.line)));
  for (let a = 0; a < N; a++) for (let b = 0; b < N; b++) { if (a === b || !towns[b].length) continue; let c = 0;
    for (const x of towns[b]) { if (sets[a].has(x.line)) { c++; rep[x.pool] = (rep[x.pool] || 0) + 1; repT[x.pool + '/' + x.theme] = (repT[x.pool + '/' + x.theme] || 0) + 1; } }
    shareSum += c / towns[b].length; pairs++; }
  for (const d of towns) for (const x of d) drw[x.pool] = (drw[x.pool] || 0) + 1;
  const totRep = Object.values(rep).reduce((s, v) => s + v, 0);
  console.log(`\n${size}: own hook PAIR share ${(100 * shareSum / pairs).toFixed(1)}% over ${pairs} pairs; hooks/town ${(towns.flat().length / N).toFixed(1)}`);
  for (const [k, v] of Object.entries(drw).sort((p, q) => (rep[q[0]] || 0) - (rep[p[0]] || 0))) {
    const r = rep[k] || 0; console.log(`  ${k.padEnd(16)} draws/town ${(v / N).toFixed(2).padStart(6)}  share of repeats ${(100 * r / totRep).toFixed(1).padStart(5)}%  repeat rate of its draws ${(100 * r / (v * (N - 1))).toFixed(1).padStart(5)}%`); }
  const linesIn = {}; for (const [k, a] of Object.entries(NPC_FACTION_LOYALTY)) for (const l of a) { const c = k + '/' + themeOfText(typeof l === 'string' ? l : l.text); linesIn[c] = (linesIn[c] || 0) + 1; }
  const dC = {}; for (const d of towns) for (const x of d) { const c = x.pool + '/' + x.theme; dC[c] = (dC[c] || 0) + 1; }
  if (process.env.CELLS) console.log('  CELLS (pool/theme · lines · draws/town · draws per line · share of repeats):\n' + Object.entries(repT).sort((p, q) => q[1] - p[1]).slice(0, +process.env.CELLS).map(([c, v]) => `    ${c.padEnd(32)} ${String(linesIn[c] || 0).padStart(3)} ${(dC[c] / N).toFixed(2).padStart(6)} ${((dC[c] / N) / (linesIn[c] || 1)).toFixed(2).padStart(6)} ${(100 * v / totRep).toFixed(1).padStart(5)}%`).join('\n'));
  console.log('  top pool/theme repeat cells:', Object.entries(repT).sort((p, q) => q[1] - p[1]).slice(0, 12).map(([k, v]) => `${k} ${(100 * v / totRep).toFixed(1)}%`).join(' · '));
}
