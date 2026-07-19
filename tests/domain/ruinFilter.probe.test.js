/**
 * ruinFilter.probe.test.js — the RUIN-FILTER defect-class behavioral proof
 * (coherence audit R3, the ruin-filter structural lane).
 *
 * A calamity (calamityKernel.ruin) leaves a destroyed institution SITTING in
 * `settlement.institutions` stamped `_worldPulseInactive: true` / `status: 'ruined'`.
 * Every functional consumer that reads the roster as a set of LIVE providers must now
 * exclude those (via src/domain/institutions/institutionRoster.js). These probes pin
 * the fix directly: the SAME institution, live vs. ruined, and the ruined copy
 * contributes nothing to each consumer. If a consumer regresses to counting ruins,
 * its probe reds. (The ratchet in ruinFilterRoster.walker.test.js guards the class
 * structurally; this file proves the behavior.)
 */
import { describe, it, expect } from 'vitest';
import { isLiveInstitution, liveInstitutions } from '../../src/domain/institutions/institutionRoster.js';
import { deriveMilitaryCapacity } from '../../src/domain/worldPulse/militaryStrength.js';
import { institutionBackingOf } from '../../src/domain/worldPulse/religionLegitimacy.js';
import { advanceInstitutionReform } from '../../src/domain/worldPulse/corruptionImpair.js';
import { classifyCareRoster } from '../../src/domain/spatial/pestilence.js';
import { institutionClassValue } from '../../src/domain/worldPulse/stressorDynamics.js';
import { healingLedger } from '../../src/domain/healingLedger.js';
import { settlementModalityWeight } from '../../src/domain/spatial/tradeFlow.js';
import { deriveSystemVariable } from '../../src/domain/causalState.js';
import { foreignEndpointLive } from '../../src/domain/worldPulse/corruptionWeb.js';

/** Mark a copy of an institution as calamity-ruined (the exact calamityKernel.ruin stamp). */
const ruin = (inst) => ({ ...inst, status: 'ruined', _worldPulseInactive: true, _worldPulseEconomyClosed: true });

describe('accessor: isLiveInstitution / liveInstitutions', () => {
  it('classifies every ruin vocabulary correctly (flag is primary, status names backstop)', () => {
    expect(isLiveInstitution({ name: 'Temple' })).toBe(true);
    expect(isLiveInstitution({ name: 'Temple', status: 'active' })).toBe(true);
    expect(isLiveInstitution({ name: 'Temple', status: 'impaired' })).toBe(true); // corrupt but STANDING
    expect(isLiveInstitution({ name: 'Temple', _worldPulseInactive: true })).toBe(false);
    expect(isLiveInstitution({ name: 'Temple', status: 'ruined' })).toBe(false);
    expect(isLiveInstitution({ name: 'Temple', status: 'removed' })).toBe(false);
    expect(isLiveInstitution({ name: 'Temple', status: 'destroyed' })).toBe(false);
    expect(isLiveInstitution({ name: 'Temple', status: 'remnant' })).toBe(false);
    expect(isLiveInstitution(null)).toBe(false);
    expect(isLiveInstitution(undefined)).toBe(false);
  });
  it('filters the roster and tolerates a non-array roster', () => {
    const s = { institutions: [{ name: 'A' }, ruin({ name: 'B' }), { name: 'C' }] };
    expect(liveInstitutions(s).map((i) => i.name)).toEqual(['A', 'C']);
    expect(liveInstitutions({})).toEqual([]);
    expect(liveInstitutions(null)).toEqual([]);
  });
});

describe('confirmed defect #1 — militaryStrength (calamity×war)', () => {
  const base = {
    name: 'Ironhold', tier: 'city', population: 12000,
    powerStructure: { government: 'Council', factions: [] },
    economicState: { primaryExports: [], primaryImports: [], foodSecurity: { resilienceScore: 50, storageMonths: 3 } },
    activeConditions: [],
  };
  const withGarrison = { settlement: { ...base, institutions: [{ name: 'Royal Garrison' }] } };
  const withRuinedGarrison = { settlement: { ...base, institutions: [ruin({ name: 'Royal Garrison' })] } };

  it('a ruined garrison fields no organized martial force', () => {
    const live = deriveMilitaryCapacity(withGarrison);
    const ruined = deriveMilitaryCapacity(withRuinedGarrison);
    expect(live.contributors.some((c) => c.effect === 'martial')).toBe(true);
    expect(ruined.contributors.some((c) => c.effect === 'martial')).toBe(false);
    expect(ruined.facets.institutions).toBeLessThan(live.facets.institutions);
  });
});

describe('confirmed defect #2 — religionLegitimacy.institutionBackingOf (calamity×religion)', () => {
  it('a ruined cathedral lends zero faith backing', () => {
    const cathedral = { name: 'Grand Cathedral', tags: ['religious', 'church'] };
    expect(institutionBackingOf({ institutions: [cathedral] })).toBeGreaterThan(0);
    expect(institutionBackingOf({ institutions: [ruin(cathedral)] })).toBe(0);
  });
});

describe('confirmed defect #3 — corruptionImpair.advanceInstitutionReform (calamity×corruption)', () => {
  it('a ruined impaired building cannot reform, and stays in the roster', () => {
    const rng = { fork: () => ({ random: () => 0 }) }; // always below chance ⇒ reform fires when reached
    const impaired = (name, extra = {}) => ({ name, impairments: [{ type: 'corruption' }], ...extra });
    const settlement = {
      npcs: [],
      institutions: [impaired('Live Exchange'), impaired('Ruined Exchange', ruin({}))],
    };
    const { settlement: next, reformed } = advanceInstitutionReform(settlement, rng);
    const names = reformed.map((r) => r.name);
    expect(names).toContain('Live Exchange');
    expect(names).not.toContain('Ruined Exchange');
    // Roster preserved (ruin is not spliced out) and the ruined row keeps its impairment.
    expect(next.institutions.map((i) => i.name)).toEqual(['Live Exchange', 'Ruined Exchange']);
    const ruinedRow = next.institutions.find((i) => i.name === 'Ruined Exchange');
    expect(ruinedRow.impairments.some((p) => p.type === 'corruption')).toBe(true);
  });
});

describe('confirmed defect #4 — pestilence.classifyCareRoster (calamity×pestilence)', () => {
  it('a ruined healing house supplies no plague care', () => {
    const house = { name: 'Great Hospital' };
    expect(classifyCareRoster([house]).healingHouse).toBe(1);
    expect(classifyCareRoster([ruin(house)]).healingHouse).toBe(0);
  });
});

describe('extended denominator — the same class, structurally routed', () => {
  it('stressorDynamics.institutionClassValue: a ruined garrison supplies no defense capacity', () => {
    const s = { institutions: [{ name: 'Garrison' }, { name: 'Barracks' }] };
    expect(institutionClassValue(s, 'defense')).toBeGreaterThan(0);
    expect(institutionClassValue({ institutions: s.institutions.map(ruin) }, 'defense')).toBe(0);
  });
  it('healingLedger.healerCount: a ruined infirmary is not a live healer', () => {
    const infirmary = { name: 'City Infirmary' };
    expect(healingLedger({ institutions: [infirmary] }).healerCount).toBe(1);
    expect(healingLedger({ institutions: [ruin(infirmary)] }).healerCount).toBe(0);
  });
  it('tradeFlow.settlementModalityWeight: a ruined harbour adds no sea throughput', () => {
    const port = { name: 'Deepwater Harbour' };
    const live = settlementModalityWeight({ institutions: [port] });
    const ruined = settlementModalityWeight({ institutions: [ruin(port)] });
    expect(ruined).toBeLessThan(live);
  });
  it('causalState law_order: razed courts uphold no law', () => {
    const courts = [{ name: 'High Courthouse' }, { name: 'Magistrate Hall' }];
    const live = deriveSystemVariable('law_order', { institutions: courts });
    const ruined = deriveSystemVariable('law_order', { institutions: courts.map(ruin) });
    expect(ruined.score).toBeLessThan(live.score);
  });
});

describe('point bug — corruptionWeb.foreignEndpointLive (occupation×corruption)', () => {
  const snapshot = { settlements: [{ id: 's1', settlement: { status: 'active' } }] };
  const leash = { foreign: true, settlementId: 's1' };

  it('an occupied patron no longer commands its arm (reads the real occupations map)', () => {
    expect(foreignEndpointLive(leash, snapshot)).toBe(true);           // no occupations ⇒ live (dormant)
    expect(foreignEndpointLive(leash, snapshot, {})).toBe(true);       // empty map ⇒ live
    expect(foreignEndpointLive(leash, snapshot, { s1: { occupierId: 'x' } })).toBe(false); // occupied ⇒ dead
    // The retired fields the old check read are NEVER consulted now:
    const withDeadFields = { settlements: [{ id: 's1', settlement: { status: 'active', occupiedBy: 'x', occupation: 'y', conqueredBy: 'z' } }] };
    expect(foreignEndpointLive(leash, withDeadFields)).toBe(true);     // dead-field values are inert
  });
});
