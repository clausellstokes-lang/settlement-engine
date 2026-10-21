// D-FOUR-r4 (G.4): levy_thin half (ii) as CURED — DEPLETION = CONSCRIPTED ONLY, against the room AT THE MARCH,
// stamped once by WS's P5 mark at the first read of a deployment whose age <= 1:
//   roomAtMarch := max(0, homePopNow + conscriptedNow - FLOOR)   (exact unless a non-war change fell in that first week)
// A deployment first read older than that carries NO mark => (ii) never holds (the room at the march is unknown).
// Landed arithmetic (warHomeCosts.js :: applyHomeWarCosts): room = max(0, homePop - 250); sent = min(round(homePop*0.006), room);
// the bank deployedPopulation += sent; conscripted = max(0, deployedPopulation - leviedTotal) (deploymentReturn.js).
const FLOOR = 250, RATE = 0.006, CUT = 0.5;
function run({ homePop0, exodusAt = 0, exodus = 0, ticks = 12, firstReadAge = 1 }) {
  let pop = homePop0, conscripted = 0, mark = null; const roomAtMarchTrue = Math.max(0, homePop0 - FLOOR); const rows = [];
  for (let t = 1; t <= ticks; t++) {
    const room = Math.max(0, pop - FLOOR); const sent = Math.min(Math.round(pop * RATE), room);
    conscripted += sent; pop -= sent;
    if (t === exodusAt) pop -= exodus; // a non-war loss: calamityKernel "Fled the calamity." / populationDynamics pressure loss
    const age = t; // deploymentAge after t ticks in the field
    if (mark === null && t >= firstReadAge) mark = age <= 1 ? Math.max(0, pop + conscripted - FLOOR) : 'none';
    const roomNow = Math.max(0, pop - FLOOR);
    const r3 = conscripted / Math.max(1, conscripted + roomNow);
    const r4 = typeof mark === 'number' && mark > 0 ? conscripted / mark : 0;
    rows.push({ t, conscripted, roomNow, mark, r3: +r3.toFixed(3), r4: +r4.toFixed(3), truth: +(conscripted / Math.max(1, roomAtMarchTrue)).toFixed(3),
      r3holds: r3 >= CUT, r4holds: typeof mark === 'number' && mark > 0 && r4 >= CUT, trueHolds: roomAtMarchTrue > 0 && conscripted / roomAtMarchTrue >= CUT });
  }
  const last = rows[rows.length - 1];
  return { case: { homePop0, exodusAt, exodus, ticks, firstReadAge }, roomAtMarchTrue, mark: last.mark, last: { t: last.t, conscripted: last.conscripted, r3: last.r3, r4: last.r4, truth: last.truth },
    firstR3Hold: (rows.find((r) => r.r3holds) || {}).t ?? null, firstR4Hold: (rows.find((r) => r.r4holds) || {}).t ?? null, firstTrueHold: (rows.find((r) => r.trueHolds) || {}).t ?? null,
    r4EverDisagreesWithTruth: rows.filter((r) => r.r4holds !== r.trueHolds && typeof r.mark === 'number').length };
}
const cases = [
  // the verifier's four (levyShrink.out) — the test the cure must pass: r4 never holds where the truth does not
  { homePop0: 400, exodusAt: 5, exodus: 0 }, { homePop0: 400, exodusAt: 5, exodus: 140 }, { homePop0: 600, exodusAt: 8, exodus: 300 }, { homePop0: 1000, exodusAt: 10, exodus: 700 },
  // positive controls: a small spare room genuinely spent by conscription (long wars)
  { homePop0: 300, ticks: 30 }, { homePop0: 400, ticks: 60 }, { homePop0: 300, exodusAt: 3, exodus: 20, ticks: 30 },
  // floor: a home at or below the floor at the march never holds (small, never thin)
  { homePop0: 250, ticks: 30 }, { homePop0: 200, ticks: 30 },
  // a deviation lit mid-war: first read at age 6 => no mark => never holds (conservative)
  { homePop0: 300, ticks: 30, firstReadAge: 6 },
  // the declared edge: a non-war loss in the march's own first week is read as the home's size at the march
  { homePop0: 400, exodusAt: 1, exodus: 140, ticks: 30 },
];
for (const c of cases) console.log(JSON.stringify(run(c)));
