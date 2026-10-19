// D-ST-r2 probe — executes the LANDED resolveSiegeVerdict (master 81f1cd963, read-only import)
// (1) ST-r2-4: a keep's +18 in homeDefense on the SPATIAL core RAISES pFall through relief01's denominator.
// (2) the CURE's two arms (relief01 denominator excludes siteDefense; the starvation clock lengthened by the keep)
//     never raise pFall over a grid ("a bigger keep never raises pFall").
// (3) ST-r2-5: the no-roll arms (pin, ceiling, capitulation) answer roll === 0; a rolled fall answers roll > 0.
const M = process.argv[2];
const { resolveSiegeVerdict, SIEGE_MAX_AGE } = await import(`${M}/src/domain/worldPulse/warSiegeVerdict.js`);
const { logistic, clamp01 } = await import(`${M}/src/domain/region/contestMath.js`);
const rngOf = (v) => ({ fork: () => ({ random: () => v }) });
const facets = { will: 50, logistics: 50 };
function run({ home, relief, att = 100, age = 6, interdiction = 0.5, spatial = true, rollValue = 0.5, pins = null, resolve = false, will = 50, logistics = 50, legit = 50 }) {
  const capacityFor = (id) => id === 'T' ? { offensive: home, homeDefense: home, facets: { will, logistics } } : { offensive: att, homeDefense: att, facets };
  return resolveSiegeVerdict({ targetId: 'T', besiegers: ['A'], capacityFor, effectiveStrengthFor: () => null, defenderItem: { name: 'T', settlement: { powerStructure: { publicLegitimacy: { score: legit } } } }, rng: rngOf(rollValue), tick: 10, siegeAge: age, defenderReliefBonus: relief, supplyInterdiction: interdiction, spatialSiege: spatial, forkPins: pins, defenderResolveEnabled: resolve });
}
// (1) the skeptic's numbers: homeDefense 40, relief 20, +18 keep
const a = run({ home: 40, relief: 20 }), b = run({ home: 58, relief: 20 });
console.log('(1) LANDED spatial core: pFall home40 =', a.pFall.toFixed(4), ' home58 (keep +18) =', b.pFall.toFixed(4), ' verdicts', a.verdict, b.verdict, '→ keep RAISES pFall:', b.pFall > a.pFall);
// (2) the cure, replicated from the landed formula with two named changes
const STARVE_K = 6, STARVE_FULL_TICKS = 12, STARVE_RELIEF_BIAS = 3, HOLD = 3, KEEP_CLOCK_WEEKS_MAX = 6;
function curedPFall({ home, keep, relief, age, interdiction }) {
  const defenderCurrent = home + keep + relief;           // siteDefense rides homeDefense (feasibility + ceiling read it)
  const timeFactor = clamp01(age / (STARVE_FULL_TICKS + KEEP_CLOCK_WEEKS_MAX * (keep / 18)));
  const relief01 = clamp01(relief / Math.max(1, defenderCurrent - keep)); // the keep never enters relief01
  return clamp01(logistic(STARVE_K * clamp01(interdiction) * timeFactor - STARVE_RELIEF_BIAS * relief01 - HOLD));
}
let worst = 0, cells = 0, raised = 0;
for (const home of [5, 20, 40, 60, 80]) for (const relief of [0, 5, 20, 40]) for (const age of [1, 6, 12, 24, 59]) for (const interdiction of [0, 0.25, 0.5, 1]) {
  let prev = curedPFall({ home, keep: 0, relief, age, interdiction });
  for (const keep of [2, 6, 10, 14, 18]) { const p = curedPFall({ home, keep, relief, age, interdiction }); cells++; if (p > prev + 1e-12) { raised++; worst = Math.max(worst, p - prev); } prev = p; }
}
console.log('(2) CURED spatial core: cells', cells, 'cells where a bigger keep raised pFall:', raised, 'worst rise', worst);
// the landed formula replica matches the landed function at the skeptic's cell (keep 0 ⇒ identical)
const rep = curedPFall({ home: 40, keep: 0, relief: 20, age: 6, interdiction: 0.5 });
console.log('    replica at keep 0 equals landed pFall:', Math.abs(rep - a.pFall) < 1e-9, rep.toFixed(4), a.pFall.toFixed(4));
// aspatial core: monotone already (K·(coalition − defender))
const asp = [0, 6, 12, 18].map(k => run({ home: 40 + k, relief: 20, spatial: false, att: 85 }).pFall);
console.log('    LANDED aspatial core pFall by keep 0/6/12/18:', asp.map(x => x.toFixed(4)).join(' '), 'monotone non-increasing:', asp.every((p, i) => i === 0 || p <= asp[i - 1]));
// (3) the no-roll sentinel
const pinned = run({ home: 40, relief: 0, pins: { 'HBF-86': 'costly_success' } });
const ceiling = run({ home: 40, relief: 0, age: SIEGE_MAX_AGE, att: 70 });
const capit = run({ home: 40, relief: 0, resolve: true, will: 0, logistics: 0, legit: 0, att: 120 });
const rolled = run({ home: 40, relief: 0, rollValue: 0.001, interdiction: 1, age: 12 });
console.log('(3) pin: falls', pinned.falls, 'roll', pinned.roll, '| ceiling: falls', ceiling.falls, 'roll', ceiling.roll, '| capitulation:', capit.capitulation === true, 'falls', capit.falls, 'roll', capit.roll, '| rolled fall: falls', rolled.falls, 'roll', rolled.roll, 'band', rolled.band);
