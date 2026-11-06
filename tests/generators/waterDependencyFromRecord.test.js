/**
 * tests/generators/waterDependencyFromRecord.test.js — WATER IS READ FROM THE RECORD, AND A
 * MILL IS NOT A WATER DEPENDENCY (lane REVIEW-INTAKE unit 3, 2026-11-06).
 *
 * `economy/viability.js :: deriveWaterDependencyAnalysis` read water from the terrain (or, with
 * no terrain, the route) and never from the settlement's own water rows, and its alternatives
 * ("Windmill", "Horse mill", "Deep well") named rows no catalog carries. Measured on the 1,000
 * soak settlements: 1,569 'Water Dependency' entries in 476 places, every one beside a water
 * row. The owner, 2026-11-06: "mills don't necessarily need water access as some mills use
 * physical force from livestock or wind" — a mill needs MOTIVE power, the DM's to picture.
 */
import { describe, it, expect } from 'vitest';
import { generateEconomicViability } from '../../src/generators/economy/viability.js';

const water = (ev) => [...ev.warnings, ...ev.dependencies, ...ev.issues]
  .filter((w) => w.category === 'Water Dependency');
const place = (tier, names, route) => ({
  population: tier === 'thorp' ? 40 : 2500,
  tier,
  institutions: names.map((name) => ({ name, category: 'Economy' })),
  config: { tradeRouteAccess: route, settType: tier },
  economicState: {},
});

describe('water dependency reads the record', () => {
  it('a hills town with Multiple water sources, a Mill, a Brewery and a Dyers\' guild owes no water warning', () => {
    const ev = generateEconomicViability(place('town', ['Multiple water sources', 'Mill', 'Brewery', "Dyers' guild"], 'road'), 'hills');
    expect(water(ev).map((w) => w.title)).toEqual([]);
  });

  it('a desert thorp with no water row and a Tannery reads exactly one, naming the supply and real catalog rows', () => {
    const ev = generateEconomicViability(place('thorp', ['Tannery'], 'road'), 'desert');
    const found = water(ev);
    expect(found).toHaveLength(1);
    expect(found[0].description).toMatch(/Tannery/);
    expect(found[0].description).toMatch(/water/i);
    expect(found[0].suggestedFixes).toEqual(['Add Water source', 'Add Aqueduct or water system']);
  });

  it('a river or port route alone is a supply, and a mill never raises the warning', () => {
    expect(water(generateEconomicViability(place('town', ['Tannery'], 'river'), 'plains'))).toEqual([]);
    expect(water(generateEconomicViability(place('town', ['Mill', 'Sawmill', 'Fuller', 'Guild governance'], 'road'), 'desert'))).toEqual([]);
  });
});
