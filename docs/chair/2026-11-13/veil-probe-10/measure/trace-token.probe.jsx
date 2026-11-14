// VEIL-10 measure (the chair's corrected ruling on V7-4's trace target): over born towns, every string of
// simulationTrace[] whose SQUEEZED form equals a roster-style house name squeezed (blackmarket, thievesguild...),
// against whether the roster holds a house of that name. Read-only; prints one table.
import { it, vi } from 'vitest';
import { writeFileSync } from 'node:fs';
const SRC = process.env.V10_SRC;
vi.mock(`${process.env.V10_SRC}/src/lib/supabase.js`, () => ({ supabase: { rpc: async () => ({ data: null, error: null }) }, isConfigured: true }));
const isRec = (v) => !!v && typeof v === 'object' && !Array.isArray(v);
const sq = (t) => String(t).toLowerCase().replace(/[^a-z0-9]+/g, '');
it('trace tokens that spell a house name', async () => {
  const { generateSettlementPipeline: gen } = await import(`${SRC}/src/generators/generateSettlementPipeline.js`);
  const density = await import(`${SRC}/src/domain/density/densityCreateBoundary.js`);
  await density.loadGenerationLawPayloads();
  const { DEFAULT_CONFIG } = await import(`${SRC}/src/store/configSlice.js`);
  const catalog = await import(`${SRC}/src/domain/institutionalCatalog.js`).catch(() => null);
  const BROWSER = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
  const sizes = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
  const N = Number(process.env.V10_N || 20);
  // token -> { withHouse, withoutHouse, paths:Set, sample }
  const tok = new Map(); let towns = 0; let withTrace = 0; const houseSq = new Map();
  const allHouseNames = new Set();
  const born = [];
  for (const settType of sizes) for (const stress of [null, 'infiltrated']) for (let i = 0; i < N; i += 1) {
    const cfg = { ...DEFAULT_CONFIG, ...BROWSER, settType, ...(stress ? { selectedStresses: [stress], selectedStressesRandom: false } : {}) };
    let s; try { s = gen(density.birthConfig(cfg), null, { seed: `v10-tok-${settType}-${stress || 'calm'}-${i}`, customContent: {} }); } catch { continue; }
    towns += 1; born.push(s);
    for (const inst of (s.institutions || []).filter(isRec)) if (typeof inst.name === 'string') allHouseNames.add(sq(inst.name));
  }
  for (const s of born) {
    const roster = new Set((s.institutions || []).filter(isRec).map(i => sq(i.name || '')));
    const trace = Array.isArray(s.simulationTrace) ? s.simulationTrace : []; if (trace.length) withTrace += 1;
    const seen = new Map();
    const walk = (v, path) => { if (typeof v === 'string') { const q = sq(v.replace(/^institution\./, '')); if (allHouseNames.has(q) && !/\s/.test(v.trim()) ) { if (!seen.has(q)) seen.set(q, new Set()); seen.get(q).add(`${path} = ${v}`); } }
      else if (Array.isArray(v)) v.forEach(x => walk(x, `${path}[]`)); else if (isRec(v)) for (const [k, x] of Object.entries(v)) walk(x, `${path}.${k}`); };
    walk(trace, 'simulationTrace');
    for (const [q, paths] of seen) { const r = tok.get(q) || { withHouse: 0, withoutHouse: 0, paths: new Map() }; if (roster.has(q)) r.withHouse += 1; else r.withoutHouse += 1;
      for (const p of paths) { const key = p.replace(/\[\]/g, '[]'); const e = r.paths.get(key) || { withHouse: 0, withoutHouse: 0 }; if (roster.has(q)) e.withHouse += 1; else e.withoutHouse += 1; r.paths.set(key, e); } tok.set(q, r); }
  }
  const lines = [`towns born ${towns}; with a trace ${withTrace}; distinct house names (squeezed) ${allHouseNames.size}`, 'token (squeezed) | towns where the roster holds the house | towns where it does not | path = value: with / without'];
  for (const [q, r] of [...tok].sort((a, b) => (b[1].withHouse + b[1].withoutHouse) - (a[1].withHouse + a[1].withoutHouse))) {
    lines.push(`${q} | ${r.withHouse} | ${r.withoutHouse} | ${[...r.paths].map(([p, e]) => `${p}: ${e.withHouse}/${e.withoutHouse}`).join(' ;; ')}`);
  }
  writeFileSync(process.env.V10_OUT, lines.join('\n') + '\n');
}, 14_400_000);
