// MG-r1 probe: executes master's own pure functions (read-only imports) for
// (a) the forced march's gain = armyMarchWeeks(w, readiness) vs armyMarchWeeks(w, 1)
// (b) the riding factor composed into namedPersonLegTicks (foot/horse = 150/250 = 0.6, MG §8.2 DRAFT)
const M = process.argv[2];
const { armyMarchWeeks } = await import(`${M}/src/domain/spatial/armyTransit.js`);
const { namedPersonLegTicks } = await import(`${M}/src/domain/worldPulse/namedPersonTransit.js`);
const { gradeLegMultiplier } = await import(`${M}/src/domain/worldPulse/routeNetworkConsumersTransit.js`);
console.log('(a) FORCED MARCH: base weeks w, readiness r -> keep_course weeks | forced (r=1) weeks | gain');
let zero = 0, tot = 0;
for (const r of [0.2, 0.5, 0.8, 1.0]) {
  const row = [];
  for (let w = 1; w <= 8; w++) {
    const k = armyMarchWeeks(w, r), f = armyMarchWeeks(w, 1);
    row.push(`w${w}:${k}->${f}(${k - f})`); tot++; if (k - f <= 0) zero++;
  }
  console.log(`  r=${r}  ` + row.join('  '));
}
console.log(`  cells with ZERO gain: ${zero}/${tot}`);
console.log('(b) RIDING: nominal hop weeks n -> walk ticks | ride ticks (x0.6) per grade');
const ratio = 150 / 250;
let same = 0, all = 0;
for (const g of ['highway', 'road']) {
  const row = [];
  for (const n of [0.5, 1, 1.5, 2, 2.5, 3, 4, 6]) {
    const walk = namedPersonLegTicks({ nominalWeeks: n, gradeMultiplier: gradeLegMultiplier(g) });
    const ride = namedPersonLegTicks({ nominalWeeks: n, gradeMultiplier: gradeLegMultiplier(g) * ratio });
    row.push(`n${n}:${walk}/${ride}`); all++; if (walk === ride) same++;
  }
  console.log(`  ${g}: ` + row.join('  '));
}
console.log(`  cells where riding gains NOTHING: ${same}/${all}`);
// (c) forced riding: x0.8 more
const row = [];
for (const n of [1, 2, 3, 4]) {
  const ride = namedPersonLegTicks({ nominalWeeks: n, gradeMultiplier: gradeLegMultiplier('road') * ratio });
  const forced = namedPersonLegTicks({ nominalWeeks: n, gradeMultiplier: gradeLegMultiplier('road') * ratio * 0.8 });
  row.push(`n${n}:${ride}->${forced}`);
}
console.log('(c) FORCED RIDING on road (x0.8): ' + row.join('  '));
