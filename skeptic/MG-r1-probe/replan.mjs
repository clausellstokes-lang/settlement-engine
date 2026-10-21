// MG-r1 probe: MG §3.1 `shadow` = "the ONE RE-PLAN each week toward the quarry's BELIEVED place";
// PS §4.1 step 6's re-plan (which MG's `replanFromNode` extracts) starts the new path "at the node
// the unit stands in" (currentRegion's rounding), departTick := tick, arrivalTick := tick + armyMarchWeeks(w, r).
// Simulate a column re-planning every week toward a fixed far node on a straight path of hops
// with base weeks per hop `h`, using master's own stepArmyPosition/currentRegion/armyMarchWeeks.
const M = process.argv[2];
const { stepArmyPosition, currentRegion, armyMarchWeeks } = await import(`${M}/src/domain/spatial/armyTransit.js`);
function run(h, hops, r, weeks) {
  const nodes = Array.from({ length: hops + 1 }, (_, i) => `n${i}`);
  let rec = { path: nodes.slice(), departTick: 0, arrivalTick: armyMarchWeeks(h * hops, r), position01: 0, destId: nodes[hops], originId: 'n0' };
  const trace = [];
  for (let t = 1; t <= weeks; t++) {
    rec = stepArmyPosition(rec, t);
    const here = currentRegion(rec);
    trace.push(here);
    const idx = nodes.indexOf(here);
    if (idx >= hops) break;
    const rest = nodes.slice(idx); // re-plan from the node it "stands in"
    rec = { ...rec, path: rest, departTick: t, arrivalTick: t + armyMarchWeeks(h * (rest.length - 1), r), position01: 0 };
  }
  return trace;
}
for (const [h, r] of [[1, 0.5], [2, 0.5], [3, 0.5], [2, 1.0], [4, 0.5]]) {
  const kc = armyMarchWeeks(h * 4, r);
  const tr = run(h, 4, r, 20);
  console.log(`hop=${h}wk r=${r}: keep_course arrives in ${kc} wk; weekly re-plan positions over 20 wk: ${tr.join(' ')}`);
}
