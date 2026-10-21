// V-MG-r1 probe: the D-MG-r1 re-plan cure (A.6 + the hop-weighted due clamp) on MASTER'S REAL plan base.
// master planMarch: base = hopWeeks(digest, origin, dest) = legWeeks(round(pathCost * k)) — ONE rounding of the O-D cost,
// NOT the sum of per-hop weeks the lane's probe used. nodeDueTickOf uses per-hop hopWeeks (each legWeeks(round(cost_i))).
// Model: a straight line of N+1 nodes with real hop costs (in week units); pathCost(a,b) = sum of costs on the line.
// Rules: KEEP (one plan n0->nN) vs A6+DUE (re-plan toward a quarry believed two nodes ahead, from a node m>=1 newly reached,
// only when the path changes, only at t >= ceil(due(m))). Reports FASTER cases and the slowdown distribution.
// Run: node replan-realbase.mjs <master-worktree>
const M = process.argv[2];
const { stepArmyPosition, armyMarchWeeks } = await import(`${M}/src/domain/spatial/armyTransit.js`);
const R = 0.5;
const legWeeks = (w) => Math.min(52, Math.max(1, w));
function seeded(s) { return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; }; }
function plan(costs, a, b, t) {
  let c = 0; for (let i = a; i < b; i++) c += costs[i];
  const base = legWeeks(Math.round(c));
  const path = []; for (let i = a; i <= b; i++) path.push(i);
  return { path, departTick: t, arrivalTick: t + armyMarchWeeks(base, R), position01: 0 };
}
function due(rec, costs, m) {
  let wm = 0, W = 0;
  for (let i = 0; i + 1 < rec.path.length; i++) { const w = legWeeks(Math.round(costs[rec.path[i]])); W += w; if (i < m) wm += w; }
  return rec.departTick + (rec.arrivalTick - rec.departTick) * (W ? wm / W : 0);
}
function run(costs, N) {
  let rec = plan(costs, 0, Math.min(2, N), 0);
  for (let t = 1; t <= 400; t++) {
    rec = { ...rec, ...stepArmyPosition(rec, t) };
    const n = rec.path.length - 1;
    const idxF = rec.position01 * n;
    if (rec.position01 >= 1 && rec.path[n] === N) return t;
    const m = Math.min(n, Math.floor(idxF + 1e-9));
    if (!(m >= 1 || rec.position01 >= 1)) continue;
    if (t < Math.ceil(due(rec, costs, m))) continue;
    const from = rec.path[m];
    const target = Math.min(from + 2, N);
    if (target === rec.path[n] && rec.position01 < 1) continue;
    if (from === N) return t;
    rec = plan(costs, from, target, t);
  }
  return null;
}
const N = 8; let faster = 0, frozen = 0, total = 0; const ratios = []; const worst = [];
for (let s = 1; s <= 2000; s++) {
  const rnd = seeded(s);
  const costs = Array.from({ length: N }, () => 0.3 + rnd() * 6);
  let c = 0; for (const x of costs) c += x;
  const keep = armyMarchWeeks(legWeeks(Math.round(c)), R);
  const t = run(costs, N); total++;
  if (t == null) { frozen++; continue; }
  if (t < keep) { faster++; if (worst.length < 3) worst.push({ costs: costs.map((x) => +x.toFixed(2)), keep, t }); }
  ratios.push(t / keep);
}
ratios.sort((a, b) => a - b);
const q = (p) => ratios[Math.floor(p * (ratios.length - 1))].toFixed(2);
console.log(`worlds ${total} · FASTER than KEEP ${faster} · frozen ${frozen}`);
console.log(`arrival / KEEP ratio: min ${q(0)} · p10 ${q(0.1)} · median ${q(0.5)} · p90 ${q(0.9)} · max ${q(1)}`);
console.log('first FASTER examples:', JSON.stringify(worst));
