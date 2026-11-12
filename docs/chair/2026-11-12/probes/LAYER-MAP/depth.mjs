// LAYER-MAP depth.mjs — EXECUTED over the 720 births: measures 7 (pool depth under disqualifiers), 8 (the pick:
// uniform vs weighted top share), 10 (case tables) and 12 (the gap list).
// Every real eligibility call the desks make is seen through the kernel hook (jsx-loader.mjs, LAYER_MAP_HOOK=1):
// the pool, the options the desk handed in (slots, audience, the answered dimensions, the facts) and the eligible
// lines. On top of today's gates, a line is DISQUALIFIED BY ITS WORDS where it names a registered thing (the
// presumed-things walker's `thingsNamedIn`) that the walker's own `absent(factsOf)` says the town lacks.
// A pool's CASE in a town = the values of every condition fact its lines read: each declared atom (atomHolds),
// each kernel dimension the pool partitions by (the desk's answer), each registered thing its lines name (absent?).
// Run: TREE=<tree> CORPUS=<corpus.ndjson.gz> LAYERS=layers.json PERTURB=perturb.json LAYER_MAP_HOOK=1 \
//      node --import ./jsx-register.mjs depth.mjs <out-dir>   → depth.json, gaps.json, sample50.txt
import { readFileSync, writeFileSync } from 'node:fs';
import { loadCorpus } from './load.mjs';
const R = (process.env.TREE || process.cwd()) + '/src';
const imp = (p) => import(R + p);
const OUT = process.argv[2] || '.';
const { PUBLIC_PROSE_SITES } = await imp('/components/new/publicProseCompose.js');
const { publicVeiledRecordOf } = await imp('/domain/display/publicSafe.js');
const { factsOf } = await imp('/domain/facts/factsOf.js');
const { variantFactDeclaration, poolDimensions, variantIsAnchored, variantIsAudible } = await imp('/domain/display/stateProse/stateProseKernel.js');
const { atomsOf, declarationOfMarks, atomHolds, STATE_MARK_DIMENSIONS } = await imp('/domain/facts/factVocabulary.js');
const { THINGS, thingsNamedIn } = await import((process.env.TREE || process.cwd()) + '/tests/lint/presumedThings.shared.mjs');
const LAY = JSON.parse(readFileSync(process.env.LAYERS, 'utf8')).rows;
const PERT = Object.fromEntries(JSON.parse(readFileSync(process.env.PERTURB, 'utf8')).pools.map((p) => [p.pool, p.dependsOn]));
// pool array -> id, from the very module instances the desks use
const POOL_ID = new WeakMap(); const META = {}; const POOLS = {};
for (const n of ['economy', 'defense', 'general', 'power', 'stressors', 'warFaith']) {
  const leaf = Object.values(await imp(`/data/dossierStateProse/${n}.generated.js`)).find((v) => v && typeof v === 'object');
  for (const [b, block] of Object.entries(leaf)) for (const [k, vs] of Object.entries(block.pools || {})) { const id = `${b}::${k}`; POOL_ID.set(vs, id); META[id] = (block.poolMeta || {})[k] || {}; POOLS[id] = vs; }
}
const KERNEL_WORDS = new Set(Object.values(STATE_MARK_DIMENSIONS).flat());
const declAtoms = (v) => [...atomsOf(variantFactDeclaration(v)), ...atomsOf(declarationOfMarks(v.marks || []))];
const stateMarks = (v) => (v.marks || []).filter((m) => KERNEL_WORDS.has(m) && !atomsOf(declarationOfMarks([m])).length);
const things = (v) => thingsNamedIn(String(v.text || ''));
const undeclaredThings = (v) => { const a = new Set(declAtoms(v).map((x) => x.replace(/^no /, ''))); return things(v).filter((t) => !THINGS[t].atoms.some((x) => a.has(x))); };
const disqCount = (v) => declAtoms(v).length + stateMarks(v).length + undeclaredThings(v).length;
const POOL_FACTS = {}; // id -> { atoms:[], dims:[], things:[] }
const poolFacts = (id) => POOL_FACTS[id] ||= (() => {
  const vs = POOLS[id]; const atoms = new Set(); const th = new Set();
  for (const v of vs) { for (const a of declAtoms(v)) atoms.add(a.replace(/^no /, '')); for (const t of things(v)) th.add(t); }
  for (const a of META[id].declares || []) atoms.add(String(a).replace(/^no /, ''));
  return { atoms: [...atoms].sort(), dims: poolDimensions(vs), things: [...th].sort() };
})();
const byWordsLen = (rs, f) => rs.filter((v) => !undeclaredThings(v).some((t) => absentIn(t, f))).length;
const absentIn = (t, f) => { try { return THINGS[t].absent ? !!THINGS[t].absent(f) : false; } catch { return false; } };
const hold = (w, f) => { try { const h = atomHolds(w, f, { npc: 0 }); return h === undefined ? 'u' : h ? 1 : 0; } catch { return 'E'; } };

let town = null; let facts = null; let seen = null;
const per = {}; // id -> { towns, cases: Map(caseKey -> {towns, min, minDecl, dmMin}), uni: Map(vid->sum), wtd: Map, actual: Map, draws }
globalThis.__EV_HOOK = (pool, options, result, raw) => {
  const id = POOL_ID.get(pool); if (!id || seen.has(id)) return; seen.add(id);
  const pf = poolFacts(id); const f = options.facts || facts;
  const caseObj = {};
  for (const a of pf.atoms) caseObj[a] = hold(a, f);
  for (const d of pf.dims) caseObj['dim ' + d] = (options.dimensions || {})[d] ?? '-';
  for (const t of pf.things) caseObj['thing ' + t] = absentIn(t, f) ? 'absent' : 'present';
  const ck = JSON.stringify(caseObj);
  // why a pool is empty here: no line anchored (a slot the desk left empty: designed silence), none audible, the gates, the words
  const why = result.length ? (byWordsLen(result, f) ? null : 'words')
    : !pool.some((v) => variantIsAnchored(v, options.slots || {})) ? 'slot'
      : !pool.some((v) => variantIsAudible(v, options.audience === 'dm' ? 'dm' : 'player')) ? 'audience' : 'gates';
  const byWords = result.filter((v) => !undeclaredThings(v).some((t) => absentIn(t, f)));
  let dm = []; try { dm = raw(pool, { ...options, audience: 'dm' }).filter((v) => !undeclaredThings(v).some((t) => absentIn(t, f))); } catch { /* */ }
  const p = per[id] ||= { towns: 0, cases: new Map(), uni: new Map(), wtd: new Map(), actual: new Map(), draws: 0, depth: [], specificity: new Set(pool.map(disqCount)).size > 1 };
  p.towns++; if (why !== 'slot') p.depth.push(byWords.length); else p.slotSilent = (p.slotSilent || 0) + 1;
  const c = p.cases.get(ck) || { towns: 0, min: -1, minDecl: -1, dmMin: -1, caseObj, why: {} };
  if (why) c.why[why] = (c.why[why] || 0) + 1;
  c.towns++; c.min = Math.max(c.min, byWords.length); c.minDecl = Math.max(c.minDecl, result.length); c.dmMin = Math.max(c.dmMin, dm.length); p.cases.set(ck, c);
  if (byWords.length) {
    const W = byWords.map((v) => 1 + Math.min(4, disqCount(v))); const S = W.reduce((a, b) => a + b, 0);
    byWords.forEach((v, i) => { p.uni.set(v.vid, (p.uni.get(v.vid) || 0) + 1 / byWords.length); p.wtd.set(v.vid, (p.wtd.get(v.vid) || 0) + W[i] / S); });
  }
};
const corpus = loadCorpus(process.env.CORPUS);
for (const { seed, s } of corpus) {
  town = seed; facts = factsOf(s); seen = new Set();
  const ctx = { veiledRecord: publicVeiledRecordOf(s) };
  for (const [, draw] of PUBLIC_PROSE_SITES) {
    let o; try { o = draw(s, false, ctx); } catch { continue; }
    const walk = (x) => { if (!x || typeof x !== 'object') return; if (x.provenance?.blockId) for (const q of x.provenance.pieces || []) { const id = `${x.provenance.blockId}::${q.key}`; if (per[id] && !x.__counted) { per[id].actual.set(q.vid, (per[id].actual.get(q.vid) || 0) + 1); per[id].draws++; } } for (const [k, v] of Object.entries(x)) if (k !== 'provenance') walk(v); };
    walk(o);
  }
}
// ── assemble ──
const pct = (arr, q) => { if (!arr.length) return 3; const a = [...arr].sort((x, y) => x - y); return a[Math.floor(q * (a.length - 1))]; };
const top = (m, n) => (n ? Math.max(0, ...m.values()) / n : 0);
// linesLeft of a case = its CAPACITY: the most lines any town in the case keeps (towns differ inside a case only by the slots a desk fills)
const pools = []; const gaps = [];
for (const [id, p] of Object.entries(per)) {
  const pf = poolFacts(id); const c = pf.atoms.length + pf.dims.length + pf.things.length; const k = (PERT[id] || []).length;
  const p5 = pct(p.depth, 0.05);
  const actualTop = p.draws ? Math.max(...p.actual.values()) / p.draws : null;
  pools.push({ pool: id, layer: LAY[id]?.layer, towns: p.towns, lines: POOLS[id].length, depthMin: p.depth.length ? Math.min(...p.depth) : null, slotSilent: p.slotSilent || 0, depthP5: p5, depthMedian: pct(p.depth, 0.5), oneLeft: p.depth.filter((d) => d === 1).length, noneLeft: p.depth.filter((d) => d === 0).length, billTo3at95: Math.max(0, 3 - p5),
    conditionFacts: c, keyFacts: k, tableSize: 2 ** c, reachableCases: p.cases.size, exhaustive: 2 ** c <= 64,
    specificityVaries: p.specificity, top1Uniform: +top(p.uni, p.towns).toFixed(3), top1Weighted: +top(p.wtd, p.towns).toFixed(3), top1Actual: actualTop == null ? null : +actualTop.toFixed(3), draws: p.draws });
  for (const [, cs] of p.cases) gaps.push({ pool: id, layer: LAY[id]?.layer, towns: cs.towns, slotSilentTowns: cs.why.slot || 0, linesLeft: cs.min, linesLeftByDeclarationsOnly: cs.minDecl, linesLeftOwnerView: cs.dmMin, flag: cs.min === 0 ? 'NONE' : cs.min < 3 ? 'UNDER3' : 'ok', emptyBecause: cs.why, case: cs.caseObj });
}
gaps.sort((a, b) => b.towns - a.towns || a.pool.localeCompare(b.pool));
const sum = (xs) => xs.reduce((a, b) => a + b, 0);
const noneWhy = {}; for (const g of gaps) if (g.flag === 'NONE') { const w = Object.keys(g.emptyBecause).sort((a, b) => g.emptyBecause[b] - g.emptyBecause[a])[0] || '?'; noneWhy[w] = (noneWhy[w] || 0) + 1; }
const none = gaps.filter((g) => g.flag === 'NONE'), under = gaps.filter((g) => g.flag === 'UNDER3');
const poolsNone = new Set(none.map((g) => g.pool)); const poolsUnder = new Set([...none, ...under].map((g) => g.pool));
const deficit = (t) => { const per = {}; for (const g of gaps) if (g.linesLeft < t) per[g.pool] = Math.max(per[g.pool] || 0, t - g.linesLeft); return { lowerBound: sum(Object.values(per)), upperBound: sum(gaps.filter((g) => g.linesLeft < t).map((g) => t - g.linesLeft)), pools: Object.keys(per).length }; };
const drawn = pools.filter((p) => p.draws >= 30);
const totals = {
  poolsReached: pools.length, poolTownDraws: sum(pools.map((p) => p.towns)),
  oneLeftDraws: sum(pools.map((p) => p.oneLeft)), noneLeftDraws: sum(pools.map((p) => p.noneLeft)),
  writingBillTo3at95: sum(pools.map((p) => p.billTo3at95)), poolsNeedingLinesTo3at95: pools.filter((p) => p.billTo3at95 > 0).length,
  cases: gaps.length, casesNone: none.length, casesNoneBy: noneWhy, casesUnder3: under.length, poolsWithACaseNone: poolsNone.size, poolsWithACaseUnder3: poolsUnder.size,
  linesToWrite: { atLeast1: deficit(1), atLeast3: deficit(3) },
  exhaustivePools: pools.filter((p) => p.exhaustive).length, tableSizeMax: Math.max(...pools.map((p) => p.tableSize)),
  conditionFactsHistogram: pools.reduce((h, p) => (h[p.conditionFacts] = (h[p.conditionFacts] || 0) + 1, h), {}),
  specificityVaries: pools.filter((p) => p.specificityVaries).length,
  pick: { poolsWith30Draws: drawn.length, top1Over075Uniform: drawn.filter((p) => p.top1Uniform >= 0.75).length, top1Over075Weighted: drawn.filter((p) => p.top1Weighted >= 0.75).length, top1Over075Actual: drawn.filter((p) => p.top1Actual >= 0.75).length,
    meanTop1Uniform: +(sum(drawn.map((p) => p.top1Uniform)) / drawn.length).toFixed(3), meanTop1Weighted: +(sum(drawn.map((p) => p.top1Weighted)) / drawn.length).toFixed(3), weightedRaisesTop1: drawn.filter((p) => p.top1Weighted > p.top1Uniform + 0.005).length },
};
writeFileSync(OUT + '/depth.json', JSON.stringify({ totals, pools: pools.sort((a, b) => b.towns - a.towns) }, null, 1));
writeFileSync(OUT + '/gaps.json', JSON.stringify({ _doc: 'LAYER-MAP measure 12: per state-prose pool, per reachable case of the facts its lines read (declared atoms, kernel dimensions, registered things named), the lines left after today\'s gates AND the disqualifiers implied by the registered words each line names; over the census 720, player audience as the public-prose sites draw (linesLeftOwnerView: the owner audience). Ordered by towns reached. flag NONE = no line left; UNDER3 = one or two.', totals: { cases: totals.cases, casesNone: totals.casesNone, casesUnder3: totals.casesUnder3, linesToWrite: totals.linesToWrite }, gaps }, null, 1));
// the read sample: 50 declared variants, seeded by a fixed stride over the corpus order
const declared = Object.entries(POOLS).flatMap(([id, vs]) => vs.filter((v) => declAtoms(v).length).map((v) => ({ id, v })));
const step = Math.floor(declared.length / 50);
writeFileSync(OUT + '/sample50.txt', declared.filter((_, i) => i % step === 0).slice(0, 50).map(({ id, v }, i) => `${i + 1}. ${id} vid ${v.vid}\n   [${declAtoms(v).join(' · ')}]\n   ${v.text}`).join('\n'));
console.log(JSON.stringify(totals, null, 1));
