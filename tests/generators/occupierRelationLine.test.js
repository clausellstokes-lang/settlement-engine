/**
 * R3-CODE-C (round three's cut, ROUND-3-CUT #1074, HIGH): the Power tab's relation between the governing power and the
 * occupier. In rr2s-city-occupied-rand-1 the page printed "Merchant Guild Council gives the orders and Occupation
 * Authority carries them out; each needs the other to stay strong." beside the crisis's own summary ("its own officials
 * take their orders") and the History tab ("Now foreign officers give the orders"). The occupation brings its power
 * onto the roster (stressFactions.js; data/stressPowerFaces.js's appointed row) under the military category, so the
 * Governing ↔ Military row read the occupier as the town's own soldiers and banded it by power: every band but one
 * says the hall commands it, or that it once took the hall's orders.
 *
 * The row now says what the occupation is, at every band: the hall carries out what the occupier decides; its kind is
 * never one that says the hall commands (subordinate) or that each needs the other (symbiotic).
 */
import { describe, expect, it } from 'vitest';
import { computeFactionRelationships } from '../../src/generators/factionDynamics.js';

const LINE = 'Merchant Guild Council carries out what Occupation Authority decides.';

/** @param {number} occupierPower @param {string[]} stresses */
const rowFor = (occupierPower, stresses = ['occupied']) => computeFactionRelationships([
  { faction: 'Merchant Guild Council', category: 'economy', power: 24, isGoverning: true },
  { faction: 'Occupation Authority', category: 'military', power: occupierPower },
], 'city', {}, {}, stresses, null).find((r) => r.pair.includes('Occupation Authority'));

describe('the occupier is never written as the hall\'s soldiers (ROUND-3-CUT #1074)', () => {
  it.each([
    ['subordinate band', 10],
    ['symbiotic band', 20],
    ['tense band', 26],
    ['competitive band', 40],
  ])('%s: the hall carries out what the occupier decides', (_band, power) => {
    const row = rowFor(power);
    expect(row.narrative).toBe(LINE);
    expect(['subordinate', 'symbiotic']).not.toContain(row.type);
  });

  it('a town\'s own military keeps its banded line (no occupation in force)', () => {
    const row = computeFactionRelationships([
      { faction: 'Merchant Guild Council', category: 'economy', power: 24, isGoverning: true },
      { faction: 'Military Council', category: 'military', power: 20 },
    ], 'city', {}, {}, [], null).find((r) => r.pair.includes('Military Council'));
    expect(row.type).toBe('symbiotic');
    expect(row.narrative).toBe('Merchant Guild Council gives the orders and Military Council carries them out; each needs the other to stay strong.');
  });
});
