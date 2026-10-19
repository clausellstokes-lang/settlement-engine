// D-CH-r5 probe (F5 = SEAMS-r4-13 = D-RN-r4 ROUTES CH): the findings row's arrivalTick in RN's guarded form vs the
// round-4 bare sum, over master's own hopWeeks on an absent digest and an unknown pair. Usage: node arrivalForm.mjs <master>
const M = process.argv[2];
const D = await import(`${M}/src/domain/spatial/distanceRead.js`);
const finiteNumber = (v, d) => (Number.isFinite(Number(v)) && v !== null ? Number(v) : d);
const tick = 10;
const cases = [
  ['no digest (aspatial)', null, 'meet', 'seat'],
  ['empty digest, unknown pair', {}, 'meet', 'seat'],
  ['same town', null, 'seat', 'seat'],
];
const out = cases.map(([label, digest, a, b]) => {
  let hw; try { hw = D.hopWeeks(digest, a, b, null); } catch (e) { hw = 'THROWS: ' + e.message; }
  const bare = typeof hw === 'number' || hw === null ? tick + hw : 'n/a';
  const guarded = a === b ? tick : tick + Math.max(1, finiteNumber(hw, 1));
  return { label, hopWeeks: hw, bareSum: bare, bareInTransitAt10: typeof bare === 'number' ? bare > tick : 'n/a', rnGuarded: guarded };
});
console.log(JSON.stringify(out, null, 1));
