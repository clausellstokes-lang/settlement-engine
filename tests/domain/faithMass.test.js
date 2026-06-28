/**
 * faithMass.test.js — size-scaled cross-settlement faith influence. A neighbour's
 * pull on a settlement's faith (growth prevalence + legitimacy endorsement) scales
 * with the SIZE ASYMMETRY between them: a city sways a village strongly and barely
 * bends to a hamlet. Rides the CURRENT tier (which the tier-drift system can change).
 */
import { describe, it, expect } from 'vitest';
import { faithMass, neighbourFaithInfluence, TIER_MASS } from '../../src/domain/worldPulse/religionState.js';
import { deityLegitimacyTarget } from '../../src/domain/worldPulse/religionLegitimacy.js';

describe('faithMass', () => {
  it('is monotonic by tier (thorp < ... < metropolis)', () => {
    expect(faithMass({ tier: 'thorp' })).toBe(1);
    expect(faithMass({ tier: 'metropolis' })).toBe(32);
    const order = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'].map((t) => faithMass({ tier: t }));
    for (let i = 1; i < order.length; i++) expect(order[i]).toBeGreaterThan(order[i - 1]);
  });
  it('falls back to population band when tier is absent, else a neutral default', () => {
    expect(faithMass({ population: 50 })).toBe(TIER_MASS.thorp);       // popToTier(50) = thorp
    expect(faithMass({ population: 12000 })).toBe(TIER_MASS.city);     // popToTier(12000) = city
    expect(faithMass({})).toBe(TIER_MASS.village);                     // unknown ⇒ neutral middle
  });
  it('reads config.tier when the top-level tier is missing', () => {
    expect(faithMass({ config: { tier: 'town' } })).toBe(TIER_MASS.town);
  });
});

describe('neighbourFaithInfluence', () => {
  it('is 1 at equal size, capped high when the neighbour dwarfs, floored when dwarfed', () => {
    expect(neighbourFaithInfluence(8, 8)).toBe(1);                         // equal
    expect(neighbourFaithInfluence(TIER_MASS.city, TIER_MASS.village)).toBe(4);     // 16/4 = 4 (ceiling)
    expect(neighbourFaithInfluence(TIER_MASS.metropolis, TIER_MASS.hamlet)).toBe(4); // 32/2 = 16 → ceiling 4
    expect(neighbourFaithInfluence(TIER_MASS.hamlet, TIER_MASS.city)).toBeCloseTo(0.125, 5); // 2/16, above the floor
    expect(neighbourFaithInfluence(TIER_MASS.thorp, TIER_MASS.metropolis)).toBe(0.12); // 1/32 = 0.03 → floored to 0.12
  });
  it('coerces unknown mass to a neutral pull', () => {
    expect(neighbourFaithInfluence(undefined, undefined)).toBe(1);
  });
});

// End-to-end through the legitimacy target: a deity endorsed by a neighbour confers
// more standing the BIGGER that neighbour is, and a SMALLER target is swayed more.
describe('asymmetric neighbour endorsement (the user intuition)', () => {
  const deityRef = 'd.aur';
  const deity = { _deityRef: deityRef, name: 'Aurelia', temperamentAxis: 'peaceful', alignmentAxis: 'good', rankAxis: 'major' };
  const deitySnapshotFor = (_snap, id) => (id === 'N' ? deity : null);   // neighbour N holds our deity as patron
  const snapWithNeighbour = (neighbourTier) => ({ byId: new Map([['N', { settlement: { tier: neighbourTier } }]]) });
  const base = {
    worldState: {}, cid: 'C', deity, deityRef, neighbourIds: ['N'],
    entry: { standing: 'established', tenure: 5, legitimacy: 0.5, heresyStain: 0 },
    lens: { temper: 0.5, align: 0.5, power: 0.5, corrupt: 0, compromise: 0 }, institutionBacking: 0, deitySnapshotFor,
  };

  it('a BIGGER neighbour endorses a creed far more than a tiny one does (same target)', () => {
    const town = { tier: 'town', powerStructure: {}, npcs: [] };
    const byCity = deityLegitimacyTarget({ ...base, settlement: town, snapshot: snapWithNeighbour('city') });   // influence 2 ⇒ saturates
    const byThorp = deityLegitimacyTarget({ ...base, settlement: town, snapshot: snapWithNeighbour('thorp') }); // influence 0.125
    expect(byCity).toBeGreaterThan(byThorp);
  });

  it('a smaller settlement is swayed MORE by the same neighbour than a large one is', () => {
    // A hamlet neighbour: it strongly endorses within a village (influence 0.5) but barely
    // moves a city (influence 0.125) — the city "scarcely notices the hamlet's creed".
    const hamletNeighbour = snapWithNeighbour('hamlet');
    const villageTarget = deityLegitimacyTarget({ ...base, settlement: { tier: 'village', powerStructure: {}, npcs: [] }, snapshot: hamletNeighbour });
    const cityTarget = deityLegitimacyTarget({ ...base, settlement: { tier: 'city', powerStructure: {}, npcs: [] }, snapshot: hamletNeighbour });
    expect(villageTarget).toBeGreaterThan(cityTarget);
  });
});
