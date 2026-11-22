const T = process.argv[2];
const sh = await import(`${T}/tests/lint/factLayers.shared.mjs`);
const births = await sh.gridBirths();
const leaves = await sh.leafArm(births);
const v = leaves.powersList;
console.log(JSON.stringify({ undeclared: v.undeclared, unread: v.unread, unplaced: v.unplaced, violations: v.violations, touches: v.touches }).slice(0, 900));
