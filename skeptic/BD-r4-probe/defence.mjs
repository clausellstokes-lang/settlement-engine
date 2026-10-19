// BD-r4 probe: the defence threshold's two scales. Reads master's deriveMilitaryCapacity
// (the homeDefense source, warCapacityReads.js :: buildCapacityLookup) on minimal settlements
// by tier, and the army latent floors bodyStrength is built on (armyStrength.js).
const M = '/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/a73343ed-904d-46d0-a0f5-2969909eb66e/scratchpad/master-81f1cd963/src';
const { deriveMilitaryCapacity } = await import(M + '/domain/worldPulse/militaryStrength.js');
const pops = { thorp: 40, hamlet: 120, village: 600, town: 3000, city: 15000, metropolis: 60000 };
for (const [tier, population] of Object.entries(pops)) {
  const s = { tier, population, config: { tier, population }, institutions: [] };
  const m = deriveMilitaryCapacity(s);
  console.log(tier.padEnd(10), 'pop', String(population).padStart(6), 'theoretical', m.theoreticalCapacity.toFixed(1), 'current', m.currentCapacity.toFixed(1), JSON.stringify(m.facets));
}
// bodyStrength per BD §2.5: the might band's latent midpoint x readiness x cohesion factors in [0.6, 1]
const floors = { thin: [0, 26], modest: [26, 42], capable: [42, 60], strong: [60, 78], formidable: [78, 100] };
for (const [k, [a, b]] of Object.entries(floors)) {
  const mid = (a + b) / 2;
  console.log(k.padEnd(10), 'midpoint', mid, 'max bodyStrength', mid, 'min', (mid * 0.36).toFixed(1));
}
