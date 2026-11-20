// For each kind of goal: how many distinct wordings exist (names masked) against how many people of ONE city draw that kind.
const [, , L, nA = '50'] = process.argv;
const { generateSettlementPipeline } = await import(`${L}/src/generators/generateSettlementPipeline.js`);
const { birthConfig, loadGenerationLawPayloads } = await import(`${L}/src/domain/density/densityCreateBoundary.js`);
const { DEFAULT_CONFIG } = await import(`${L}/src/store/configSlice.js`);
const { SIZES } = await import(`${L}/tests/components/pageCensusWalk.shared.mjs`);
await loadGenerationLawPayloads();
const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const masker = (t) => { const names = new Set(); const add = (s) => { if (typeof s === 'string' && s.trim().length > 2) names.add(s.trim()); };
  add(t.name); for (const n of t.npcs || []) { add(n.name); for (const p of String(n.name || '').split(/\s+/)) if (p.length > 3) add(p); add(n.institution); add(n.role); add(n.title); }
  for (const f of t.powerStructure?.factions || []) add(f.faction); add(t.powerStructure?.government);
  for (const i of t.institutions || []) { add(i.name); add(String(i.name || '').replace(/\s*\(.*\)\s*$/, '')); }
  const re = new RegExp([...names].sort((a, b) => b.length - a.length).map(esc).join('|'), 'gi');
  return (s) => typeof s === 'string' ? s.replace(re, '§').replace(/\b(the|The|a|an|A|An)\s+§/g, '§').replace(/\d+/g, '#') : ''; };
const kinds = new Map(); // key -> { lines:Set, maxInTown:0, draws:0, townsOver:0 }
const towns = [];
for (const size of SIZES) for (let i = 0; i < +nA; i++) towns.push(generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, settType: size }), null, { seed: `hxd-${size}-${i}`, customContent: {} }));
for (const which of ['short', 'long']) {
  kinds.clear();
  const perTown = [];
  for (const t of towns) { const m = masker(t); const c = new Map();
    for (const n of t.npcs || []) { const g = n.goal || {}; const key = `${g.intent?.[which]?.family || '?'}/${g.intent?.[which]?.kind || '?'}`; const line = m(g[which]); if (!line) continue;
      const k = kinds.get(key) || { lines: new Set(), max: 0, draws: 0 }; k.lines.add(line); k.draws++; kinds.set(key, k); c.set(key, (c.get(key) || 0) + 1); }
    perTown.push({ tier: t.tier, c }); for (const [key, v] of c) { const k = kinds.get(key); if (v > k.max) k.max = v; } }
  let short = 0;
  console.log(`\n== ${which} goals: kind · draws · distinct wordings · most people of ONE town with that kind · enough wordings for no repeat?`);
  for (const [key, k] of [...kinds].sort((a, b) => b[1].draws - a[1].draws)) { const ok = k.lines.size >= k.max; if (!ok) short++; console.log(`${key.padEnd(30)} ${String(k.draws).padStart(5)} ${String(k.lines.size).padStart(4)} ${String(k.max).padStart(4)}  ${ok ? 'yes' : 'NO: short by ' + (k.max - k.lines.size)}`); }
  console.log(`kinds: ${kinds.size}; kinds with too few wordings for their busiest town: ${short}`);
  // how many repeats would remain if a town never drew the same wording twice where the pool allows
  let forced = 0, total = 0; for (const { c } of perTown) for (const [key, v] of c) { total += v; forced += Math.max(0, v - kinds.get(key).lines.size); }
  console.log(`people: ${total}; repeats that NO re-deal could avoid with today's wordings: ${forced} (${(100 * forced / total).toFixed(1)}%)`);
}
