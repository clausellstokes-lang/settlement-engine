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

const LINE = 'The Merchant Guild Council carries out what the Occupation Authority decides.'; // NAMES-1 (CN1): the article

/** @param {number} occupierPower @param {string[]} stresses */
const rowFor = (occupierPower, stresses = ['occupied']) => computeFactionRelationships([
  { faction: 'Merchant Guild Council', category: 'economy', power: 24, isGoverning: true },
  { faction: 'Occupation Authority', category: 'military', power: occupierPower },
], 'city', {}, {}, stresses, null).find((r) => r.pair.includes('Occupation Authority'));

describe('the occupier is never written as the hall\'s soldiers (ROUND-3-CUT #1074)', () => {
  it('at every band (subordinate, symbiotic, tense, competitive): the hall carries out what the occupier decides', () => {
    const kinds = [10, 20, 26, 40].map((power) => {
      const row = rowFor(power);
      expect(row.narrative, `occupier power ${power}`).toBe(LINE);
      return row.type;
    });
    expect(kinds).toEqual(['tense', 'tense', 'tense', 'competitive']);
  });

  it('a town\'s own military keeps its banded line (no occupation in force)', () => {
    const row = computeFactionRelationships([
      { faction: 'Merchant Guild Council', category: 'economy', power: 24, isGoverning: true },
      { faction: 'Military Council', category: 'military', power: 20 },
    ], 'city', {}, {}, [], null).find((r) => r.pair.includes('Military Council'));
    expect(row.type).toBe('symbiotic');
    expect(row.narrative).toBe('The Merchant Guild Council gives the orders and the Military Council carries them out; each needs the other to stay strong.'); // NAMES-1 (CN1): the article
  });
});

// R3-CODE-C-2 (ROUND-3-CUT-INCREMENT #pf-591, #pf-90, #pf-590, and CENSUS-2's r2r-village-27): three relation rows
// that said more than the powers' own strengths hold.
describe('a relation row says only what the powers\' strengths hold', () => {
  const row = (factions, a, b) => computeFactionRelationships(factions, 'town', {}, null, [], null)
    .find((r) => r.pair.includes(a) && r.pair.includes(b))?.narrative;
  it('the force "makes the decisions" only as the strongest; merchant money only beside a stronger merchant power; a separate church is not the same people', () => {
    const church = { faction: 'Church Council', category: 'government', isGoverning: true, power: 12 };
    const guard = { faction: 'Military/Guard', category: 'military', power: 19 };
    const religious = { faction: 'Religious Authorities', category: 'religious', power: 47 };
    expect(row([church, guard, religious], 'Church Council', 'Military/Guard')).toBe('The Guard no longer takes orders from the Church Council.'); // NAMES-1 (CN1): the article
    expect(row([church, guard], 'Church Council', 'Military/Guard'))
      .toBe('The Guard no longer takes orders from the Church Council. The Church Council keeps the title; the Guard makes the decisions that matter.'); // NAMES-1 (CN1): the article
    const royal = { faction: 'Royal Authority', category: 'government', isGoverning: true, power: 40 };
    const nobles = { faction: 'Noble Families', category: 'noble', power: 10 };
    const craft = { faction: 'Craft Guilds', category: 'economy', power: 7 };
    expect(row([royal, nobles, craft], 'Noble Families', 'Royal Authority')).toBe('The Noble Families still have their titles, but the hall\'s offices have taken most of their power.'); // NAMES-1 (CN1): the article
    const merchants = { faction: 'Merchant Guilds', category: 'economy', power: 20 };
    expect(row([royal, nobles, merchants], 'Noble Families', 'Royal Authority')).toBe('The Noble Families still have their titles, but merchant money and the hall\'s offices have taken most of their power.'); // NAMES-1 (CN1): the article
    const same = row([religious, church], 'Church Council', 'Religious Authorities'); // the record orders its powers by strength
    expect([same].filter((n) => /same people/.test(String(n)))).toEqual([]);
    expect(typeof same).toBe('string');
  });
});
