// PR-r2 probe: does the "population" gate (facets.manpower → pool) ever bind under PR §3.1?
const W = process.argv[2];
const { deriveMilitaryCapacity } = await import(W + '/src/domain/worldPulse/militaryStrength.js');
const { POPULATION_RANGES } = await import(W + '/src/data/constants.js');
const CEIL = { thorp: 0, hamlet: 1, village: 2, town: 4, city: 8, metropolis: 12 };
const MANPOWER_FULL = 60;
for (const [tier, { min, max }] of Object.entries(POPULATION_RANGES)) {
  for (const pop of [min, Math.round(Math.sqrt(min * max)), max]) {
    const m = deriveMilitaryCapacity({ id: 'x', tier, population: pop }, {});
    const manpower = m.facets.manpower;
    const ceiling = CEIL[tier];
    const pool = Math.ceil(ceiling * Math.min(1, Math.max(0, manpower / MANPOWER_FULL)));
    console.log(`${tier.padEnd(10)} pop=${String(pop).padStart(6)} manpower=${String(manpower).padStart(3)} ceiling=${ceiling} pool=${pool} ${pool < ceiling ? '<-- BINDS' : ''}`);
  }
}
