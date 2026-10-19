// D-PS-r3 probe — PS-r2-15 / RULINGS-ROUND3 A.2: the ONE hold helper's two modes.
// Imports the LANDED stepArmyPosition from master 81f1cd963 (read-only) and replays the
// verifier's convicting arithmetic, then checks both modes over a grid.
// Run: node holds.mjs <master-worktree>
const M = process.argv[2];
const { stepArmyPosition } = await import(`${M}/src/domain/spatial/armyTransit.js`);

const pos = (d, a, t) => stepArmyPosition({ departTick: d, arrivalTick: a, path: [] }, t).position01;

// The round-2 helper: border clamp for ANY node j (the text the verifier convicted).
function clampR2(rec, j, n1, t) {
  const span = rec.arrivalTick - rec.departTick;
  const x = span * (j - 0.5) / n1;
  const m = Math.max(0, Math.ceil(x) - 1);
  const d = t - m;
  return { departTick: d, arrivalTick: d + span };
}
// Round-3 FREEZE mode: both clocks +1 on the clocks the record carries this tick.
const freeze = (rec) => ({ departTick: rec.departTick + 1, arrivalTick: rec.arrivalTick + 1 });
// Round-3 BORDER mode: admitted only for a node entered THIS tick (its boundary passed
// between t-1 and t on the carried clocks); then the clamp.
function enteredThisTick(rec, j, n1, t) {
  const span = rec.arrivalTick - rec.departTick;
  const x = span * (j - 0.5) / n1;
  return (t - rec.departTick) >= x && (t - 1 - rec.departTick) < x;
}

const out = [];
// (1) The verifier's worked example: span 10, n-1 = 2, j = 1, t - d = 1.
{
  const rec = { departTick: 0, arrivalTick: 10 }; const t = 1;
  const before = pos(rec.departTick, rec.arrivalTick, t);
  const r2 = clampR2(rec, 1, 2, t);
  const after = pos(r2.departTick, r2.arrivalTick, t);
  const drift = r2.arrivalTick - rec.arrivalTick;
  out.push(`(1) VERIFIER'S EXAMPLE, round-2 clamp mid-hop: position ${before} -> ${after} (forward=${after > before}); clock drift ${drift} week(s) (refund=${drift < 0})`);
  const fz = freeze(rec);
  out.push(`    round-3 FREEZE on the same record: position ${before} -> ${pos(fz.departTick, fz.arrivalTick, t)} vs prior tick ${pos(rec.departTick, rec.arrivalTick, t - 1)}; drift ${fz.arrivalTick - rec.arrivalTick}`);
  out.push(`    round-3 BORDER mode admits j=1 here? ${enteredThisTick(rec, 1, 2, t)} (x = 2.5 weeks; the unit is mid-hop)`);
}
// (2) Grid: spans 1..52, n-1 = 1..12, every t in [d, a], d = 5.
let freezeCases = 0, freezeBad = 0, borderAdmitted = 0, borderDiffersFromFreeze = 0, borderForward = 0, r2AnyForward = 0, r2AnyRefund = 0, r2Cases = 0;
for (let span = 1; span <= 52; span++) {
  for (let n1 = 1; n1 <= 12; n1++) {
    const d = 5, a = d + span;
    for (let t = d; t <= a; t++) {
      const rec = { departTick: d, arrivalTick: a };
      const prior = pos(d, a, t - 1);
      // freeze
      freezeCases++;
      const fz = freeze(rec);
      const pf = pos(fz.departTick, fz.arrivalTick, t);
      if (pf !== prior || (fz.arrivalTick - a) !== 1) freezeBad++;
      // border and the round-2 clamp, per node j
      for (let j = 1; j <= n1 - 0; j++) {
        if (j > n1) continue;
        r2Cases++;
        const r2 = clampR2(rec, j, n1, t);
        const p2 = pos(r2.departTick, r2.arrivalTick, t);
        const now = pos(d, a, t);
        if (p2 > now) r2AnyForward++;
        if ((r2.arrivalTick - a) < 0) r2AnyRefund++;
        if (enteredThisTick(rec, j, n1, t)) {
          borderAdmitted++;
          if (r2.departTick !== fz.departTick) borderDiffersFromFreeze++;
          if (p2 > prior) borderForward++;
        }
      }
    }
  }
}
out.push(`(2) GRID spans 1..52 x hops 1..12 x every tick of the march:`);
out.push(`    FREEZE: ${freezeCases} cases; position != prior tick's or drift != +1 in ${freezeBad}`);
out.push(`    round-2 clamp applied to ANY node: ${r2Cases} (tick,node) cases; moved the unit FORWARD in ${r2AnyForward}; REFUNDED clock weeks in ${r2AnyRefund}`);
out.push(`    BORDER mode (node entered this tick only): ${borderAdmitted} admitted; clamp differs from FREEZE in ${borderDiffersFromFreeze}; forward of prior tick in ${borderForward}`);
// (3) A sequence of holds: drift equals the number of holds (Bound 2 reads it exactly).
{
  let rec = { departTick: 3, arrivalTick: 3 + 17 }; const planned = rec.arrivalTick; let holds = 0;
  for (let t = 4; t < 4 + 9; t++) { rec = freeze(rec); holds++; }
  out.push(`(3) nine consecutive freezes: drift ${rec.arrivalTick - planned} = holds ${holds}`);
}
console.log(out.join('\n'));
