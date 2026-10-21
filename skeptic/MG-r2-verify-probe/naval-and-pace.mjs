// D-MG-r2 probe: the receipts behind MG-V1 (a fleet re-plan with the land helper) and minor 5 (a light wing
// re-planned at column speed), executed on master's own pure functions. Read-only imports; nothing written.
// Run: node naval-and-pace.mjs <master-worktree>
const M = process.argv[2];
const { seaBattleInputs, convoyTransitWeeks } = await import(`${M}/src/domain/spatial/navalLayer.js`);
const { stepArmyPosition, armyMarchWeeks } = await import(`${M}/src/domain/spatial/armyTransit.js`);
const { namedPersonLegTicks } = await import(`${M}/src/domain/worldPulse/namedPersonTransit.js`);

const out = [];
// (1) A convoy 70% of the way along a lane, then the land re-plan's restart (departTick := tick; position01 restarts at 0).
const fleet = { armyId: 'f', ownerId: 'A', path: ['A', 's1', 's2', 'B'], departTick: 0, arrivalTick: 10, position01: 0, strength: 100, readiness: 0.5, supplyQuality: 1, funding: 0.5 };
const mid = stepArmyPosition(fleet, 7);
const restarted = stepArmyPosition({ ...mid, path: ['s2', 's1', 'A'], departTick: 7, arrivalTick: 7 + 4 }, 7);
const a = seaBattleInputs(mid), b = seaBattleInputs(restarted);
out.push(`(1) seaBattleInputs at week 7 of 10: groundAdvantage01 ${a.groundAdvantage01} · fatigue01 ${a.fatigue01}`);
out.push(`    after a land-helper restart the same tick:  groundAdvantage01 ${b.groundAdvantage01} · fatigue01 ${b.fatigue01}  (fresh, in home waters, mid-sea)`);
// (2) The two pricers over the same base hop-weeks.
const rows = [];
for (const base of [1, 2, 3, 4, 6, 8, 12]) rows.push(`${base}:${armyMarchWeeks(base, 0.5)}/${convoyTransitWeeks(base, 0.5)}`);
out.push(`(2) base → armyMarchWeeks/convoyTransitWeeks (readiness 0.5): ${rows.join(' · ')}`);
// (3) A light wing (leg physics) vs the column pricer over the same hops (road grade, multiplier 1).
const cells = [];
for (const hops of [[1, 1, 1], [2, 2], [1, 3, 2], [4, 4], [2, 1, 1, 2]]) {
  const legs = hops.reduce((s, w) => s + namedPersonLegTicks({ nominalWeeks: w, gradeMultiplier: 1 }), 0);
  const col = armyMarchWeeks(hops.reduce((s, w) => s + w, 0), 0.5);
  cells.push(`[${hops}] light ${legs} vs column ${col}`);
}
out.push(`(3) a light wing's own pace vs the column pricer the land helper uses: ${cells.join(' · ')}`);
console.log(out.join('\n'));
