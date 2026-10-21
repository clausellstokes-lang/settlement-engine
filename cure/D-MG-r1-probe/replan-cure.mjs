// D-MG-r1 probe (MG-r1-5 cure, RULINGS-P6 A.6): master's OWN kinematics (read-only imports):
// stepArmyPosition / armyMarchWeeks. Position is LINEAR IN TIME and INDEX-LINEAR along the path
// (currentRegion: Math.round(position01 * (path.length - 1))).
// RULES COMPARED for a unit that re-plans toward a moving believed place:
//   WEEKLY  — the compile's rule: re-plan every week from currentRegion's rounded node (the skeptic's defect)
//   A6      — A.6 as written: re-plan only from a node ACTUALLY REACHED (floor index advanced) and only when the path changes
//   A6+DUE  — A.6 plus the hop-weighted due clamp: re-plan from the reached node m only at a tick >= due(m),
//             due(m) = departTick + span * W(0..m)/W (the time the plan owed that node by HOP WEIGHT)
// Run: node replan-cure.mjs <master-worktree>
const M = process.argv[2];
const { stepArmyPosition, armyMarchWeeks } = await import(`${M}/src/domain/spatial/armyTransit.js`);
const R = 0.5;
function plan(path, hopW, from, t) { // a record over path (array of node indices) departing at t
  let W = 0; for (let i = 0; i + 1 < path.length; i++) W += hopW[path[i]];
  return { path, departTick: t, arrivalTick: t + armyMarchWeeks(W, R), position01: 0, W };
}
function due(rec, hopW, m) { let wm = 0; for (let i = 0; i < m; i++) wm += hopW[rec.path[i]]; return rec.departTick + (rec.arrivalTick - rec.departTick) * (rec.W ? wm / rec.W : 0); }
// hopW[i] = weeks of the hop node i -> node i+1 on a straight line of N+1 nodes; the quarry is believed 2 nodes ahead of the unit's node.
function run(rule, hopW, N, maxT = 200) {
  const line = Array.from({ length: N + 1 }, (_, i) => i);
  let target = Math.min(2, N);
  let rec = plan(line.slice(0, target + 1), hopW, 0, 0);
  let replans = 0;
  for (let t = 1; t <= maxT; t++) {
    rec = { ...rec, ...stepArmyPosition(rec, t) };
    const n = rec.path.length - 1;
    const idxF = rec.position01 * n;
    const here = rec.path[Math.min(n, Math.round(idxF))];
    const reached = rec.path[Math.min(n, Math.floor(idxF + 1e-9))];
    if (rec.position01 >= 1 && rec.path[n] === N) return { t, replans };
    let from = null;
    if (rule === 'WEEKLY') from = here;
    if (rule === 'A6' || rule === 'A6+DUE') {
      const m = Math.min(n, Math.floor(idxF + 1e-9));
      const fresh = m >= 1 || rec.position01 >= 1;
      if (fresh && (rule === 'A6' || t >= Math.ceil(due(rec, hopW, m)))) from = reached;
    }
    if (from == null) continue;
    const newTarget = Math.min(from + 2, N);
    if (rule !== 'WEEKLY' && newTarget === rec.path[n] && rec.position01 < 1) continue; // A.6: only when the path changes
    target = newTarget;
    if (from === N) return { t, replans };
    rec = plan(line.slice(from, target + 1), hopW, from, t); replans++;
  }
  return { t: null, replans };
}
const cases = [
  ['equal 1-wk hops', [1, 1, 1, 1, 1, 1, 1, 1]],
  ['equal 2-wk hops', [2, 2, 2, 2, 2, 2, 2, 2]],
  ['equal 3-wk hops', [3, 3, 3, 3, 3, 3, 3, 3]],
  ['long first hops [10,1,1,10,1,1,10,1]', [10, 1, 1, 10, 1, 1, 10, 1]],
  ['mixed [4,1,3,1,5,2,1,6]', [4, 1, 3, 1, 5, 2, 1, 6]],
  ['one long first hop [6,1,1,1,1,1,1,1]', [6, 1, 1, 1, 1, 1, 1, 1]],
  ['long odd hops [6,1,6,1,6,1,6,1]', [6, 1, 6, 1, 6, 1, 6, 1]],
  ['long odd hops [5,1,5,1,5,1,5,1]', [5, 1, 5, 1, 5, 1, 5, 1]],
];
const N = 8;
console.log(`readiness ${R}; a straight line of ${N + 1} nodes; the quarry believed two nodes ahead; KEEP = one plan n0->n${N} (the hop-weighted baseline)`);
for (const [name, hopW] of cases) {
  const W = hopW.reduce((a, b) => a + b, 0);
  const keep = armyMarchWeeks(W, R);
  const out = ['WEEKLY', 'A6', 'A6+DUE'].map((r) => { const o = run(r, hopW, N); return `${r}: ${o.t == null ? 'NEVER(frozen)' : o.t + 'wk'} (${o.replans} re-plans)${o.t != null && o.t < keep ? ' FASTER-THAN-KEEP' : ''}`; });
  console.log(`${name}: KEEP ${keep}wk | ${out.join(' | ')}`);
}
