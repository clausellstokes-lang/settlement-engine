// D-PR-r2 probe: the cured POPULATION gate (RULINGS-ROUND2b PR-r2-2): pool = max(min(1, ceiling), round(ceiling × clamp01(population / tierMidpoint)))
// where population is the people ledger's census pool (`settlement.population`, peopleLedger.js POOLS 'census')
// and tierMidpoint = (min+max)/2 of POPULATION_RANGES. Compared with the compiled facet read (always = ceiling, PR-r2-2).
const W = process.argv[2];
const { deriveMilitaryCapacity } = await import(W + '/src/domain/worldPulse/militaryStrength.js');
const { POPULATION_RANGES } = await import(W + '/src/data/constants.js');
const CEIL = { thorp: 0, hamlet: 1, village: 2, town: 4, city: 8, metropolis: 12 };
let binds = 0, rows = 0;
for (const [tier, { min, max }] of Object.entries(POPULATION_RANGES)) {
  const mid = (min + max) / 2;
  for (const pop of [min, Math.round(Math.sqrt(min * max)), Math.round(mid), max]) {
    const ceiling = CEIL[tier];
    const facet = deriveMilitaryCapacity({ id: 'x', tier, population: pop }, {}).facets.manpower;
    const oldPool = Math.ceil(ceiling * Math.min(1, Math.max(0, facet / 60)));
    const ratio = Math.min(1, Math.max(0, pop / mid));
    const pool = Math.max(Math.min(1, ceiling), Math.round(ceiling * ratio)); // cured: round, floored at one where the tier keeps any watch
    rows++; if (pool < ceiling) binds++;
    console.log(`${tier.padEnd(10)} pop=${String(pop).padStart(6)} mid=${String(mid).padStart(7)} ratio=${ratio.toFixed(3)} ceiling=${ceiling} pool(cured)=${pool} pool(compiled facet)=${oldPool} ${pool < ceiling ? '<-- population binds' : ''}`);
  }
}
console.log(`rows=${rows} binds=${binds}`);
