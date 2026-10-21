// D-MG-r3 probe (E.4 · MG-V3): the imposed holds reaching a wing through MG's stepper, on master's own pure stepper.
// PS9's FREEZE (PS §4.1, designed): both clocks +1 on the clocks the record carries this tick -> position stands where the
// prior tick left it; Bound 1: arrivalTick - sinceTick <= SIEGE_MAX_AGE - 1 (SIEGE_MAX_AGE 60, warSiegeVerdict.js).
// Run: node e4-wing-holds.mjs <master-worktree>
const M = process.argv[2];
const { stepArmyPosition } = await import(`${M}/src/domain/spatial/armyTransit.js`);
const { SIEGE_MAX_AGE } = await import(`${M}/src/domain/worldPulse/warSiegeVerdict.js`);
const freeze = (rec, tick, sinceTick) => {
  const shifted = { ...rec, departTick: rec.departTick + 1, arrivalTick: rec.arrivalTick + 1 };
  if (shifted.arrivalTick - sinceTick > SIEGE_MAX_AGE - 1) return null; // Bound 1 refuses
  return stepArmyPosition(shifted, tick);
};
const out = [`SIEGE_MAX_AGE ${SIEGE_MAX_AGE} (master) -> Bound 1: arrivalTick - sinceTick <= ${SIEGE_MAX_AGE - 1}`];
// An army on a 4-node path, 12 weeks, held by the approach fort (registrant 2) on its stretch for weeks 11..13.
const sinceTick = 0;
let army = stepArmyPosition({ armyId: 'kell', path: ['a', 'b', 'c', 'd'], departTick: 2, arrivalTick: 14, position01: 0 }, 10);
// The split at tick 10: a with_train wing minted on the army's own remaining path and clocks (armyRecordOf-shaped).
let wingR2 = { ...army }, wingR3 = { ...army };
const rows = [];
for (let tick = 11; tick <= 13; tick++) {
  const priorA = army.position01, priorW3 = wingR3.position01;
  army = stepArmyPosition(army, tick); army = freeze(army, tick, sinceTick) || army; // registrant 2 holds the army
  wingR2 = stepArmyPosition(wingR2, tick);                                          // r2: step (0) steps, no imposed hold
  const stepped = stepArmyPosition(wingR3, tick);                                    // r3: step (0)(a) steps ...
  wingR3 = freeze(stepped, tick, sinceTick) || stepped;                               // ... (b) its army held -> FREEZE
  rows.push(`tick ${tick}: army ${priorA}->${army.position01} (held) · wing r2 ${wingR2.position01} (passes the fort) · wing r3 ${priorW3}->${wingR3.position01} (held with its army)`);
}
out.push(...rows);
out.push(`after the three held weeks: army arrival ${army.arrivalTick} · wing r2 arrival ${wingR2.arrivalTick} (3 weeks ahead of its own held army) · wing r3 arrival ${wingR3.arrivalTick}`);
// Bound 1 on the wing's own clocks (sinceTick = the parent's): a wing at arrival 59 cannot be held; it keeps its course.
const late = { armyId: 'kell', path: ['a', 'b'], departTick: 50, arrivalTick: 59, position01: 0 };
const r = freeze(stepArmyPosition(late, 55), 55, sinceTick);
out.push(`Bound 1: a wing with arrivalTick 59, sinceTick 0 -> FREEZE ${r === null ? 'REFUSED (null): the wing keeps its course' : 'admitted'}`);
console.log(out.join('\n'));
