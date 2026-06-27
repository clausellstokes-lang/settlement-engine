/**
 * religionLegitimacy.test.js — the *rightful claim* axis (distinct from share).
 * Covers the ruler lens, the legitimacy target composite (ruler fit + neighbour +
 * tenure − heresy stain), the lagged step, and determinism.
 */
import { describe, it, expect } from 'vitest';
import {
  rulerLens, deityLegitimacyTarget, stepDeityLegitimacy, RELIGION_LEGITIMACY_TUNING,
} from '../../src/domain/worldPulse/religionLegitimacy.js';

const deity = (name, temper = 'neutral', align = 'neutral', rank = 'minor') =>
  ({ _deityRef: `custom:lu_${name.toLowerCase()}`, name, temperamentAxis: temper, alignmentAxis: align, rankAxis: rank });

const militarySettlement = () => ({
  tier: 'city',
  config: {},
  powerStructure: { governingName: 'Iron Legion', factions: [{ id: 'f.mil', name: 'Iron Legion', archetype: 'military', power: 85 }] },
  npcs: [],
  economicState: { prosperity: 'average' },
  institutions: [],
});
const noNeighbour = () => null;

describe('rulerLens — the ruling power as a character lens', () => {
  it('a military junta reads as warlike, well-backed', () => {
    const lens = rulerLens(militarySettlement());
    expect(lens.temper).toBeGreaterThan(0.7);     // military archetype ⇒ warlike
    expect(lens.power).toBeGreaterThan(0.6);       // 85% power ⇒ strongly backed
    expect(lens.corrupt).toBeGreaterThanOrEqual(0);
  });

  it('falls back to the highest-power faction when governingName does not match', () => {
    const s = { powerStructure: { governingName: '', factions: [{ id: 'f.c', name: 'Cabal', archetype: 'criminal', power: 90 }] }, npcs: [] };
    const lens = rulerLens(s);
    expect(lens.temper).toBeGreaterThan(0.5);      // criminal lean
  });
});

describe('deityLegitimacyTarget — fit, tenure, and the heresy stain', () => {
  const base = (entry, deityArg) => deityLegitimacyTarget({
    settlement: militarySettlement(), snapshot: {}, worldState: {}, cid: 's1',
    deity: deityArg, deityRef: deityArg._deityRef, neighbourIds: [], entry,
    deitySnapshotFor: noNeighbour,
  });
  const fresh = { tenure: 0, heresyStain: 0, standing: 'cult' };

  it('a deity that fits the ruling power is more legitimate than one that clashes', () => {
    const warlike = base(fresh, deity('Korl', 'warlike', 'neutral'));
    const peaceful = base(fresh, deity('Sael', 'peaceful', 'good'));
    expect(warlike).toBeGreaterThan(peaceful);
  });

  it('tenure raises legitimacy', () => {
    const d = deity('Korl', 'warlike', 'neutral');
    expect(base({ tenure: 30, heresyStain: 0, standing: 'ascendant' }, d))
      .toBeGreaterThan(base({ tenure: 0, heresyStain: 0, standing: 'cult' }, d));
  });

  it('the heresy stain drags legitimacy down', () => {
    const d = deity('Korl', 'warlike', 'neutral');
    expect(base({ tenure: 0, heresyStain: 0.45, standing: 'cult' }, d))
      .toBeLessThan(base({ tenure: 0, heresyStain: 0, standing: 'cult' }, d));
  });

  it('neighbour endorsement (the deity is patron next door) raises legitimacy', () => {
    const d = deity('Korl', 'warlike', 'neutral');
    const withNeighbour = deityLegitimacyTarget({
      settlement: militarySettlement(), snapshot: {}, worldState: {}, cid: 's1',
      deity: d, deityRef: d._deityRef, neighbourIds: ['n1', 'n2'], entry: { tenure: 0, heresyStain: 0, standing: 'cult' },
      deitySnapshotFor: () => d,   // both neighbours carry Korl as patron
    });
    const without = base({ tenure: 0, heresyStain: 0, standing: 'cult' }, d);
    expect(withNeighbour).toBeGreaterThan(without);
  });

  it('is deterministic — identical inputs give identical output', () => {
    const d = deity('Korl', 'warlike', 'neutral');
    expect(base(fresh, d)).toBe(base(fresh, d));
  });
});

describe('stepDeityLegitimacy — lagged approach + tenure + stain decay', () => {
  it('moves legitimacy toward the target by the lag factor', () => {
    const entry = { legitimacy: 0.1, tenure: 0, heresyStain: 0, standing: 'ascendant' };
    stepDeityLegitimacy(entry, 0.9);
    expect(entry.legitimacy).toBeCloseTo(0.1 + RELIGION_LEGITIMACY_TUNING.LAG * 0.8, 5);
  });

  it('accrues tenure while established and burns the stain off', () => {
    const entry = { legitimacy: 0.2, tenure: 5, heresyStain: 0.45, standing: 'established' };
    stepDeityLegitimacy(entry, 0.5);
    expect(entry.tenure).toBe(6);
    expect(entry.heresyStain).toBeLessThan(0.45);
  });

  it('a cult (not established) loses tenure rather than gaining it', () => {
    const entry = { legitimacy: 0.2, tenure: 3, heresyStain: 0, standing: 'cult' };
    stepDeityLegitimacy(entry, 0.5);
    expect(entry.tenure).toBe(2);
  });

  it('defaults an unseeded legitimacy to the cult seed before stepping', () => {
    const entry = { tenure: 0, heresyStain: 0, standing: 'cult' };   // no legitimacy field
    stepDeityLegitimacy(entry, 0.5);
    expect(entry.legitimacy).toBeGreaterThan(0);
    expect(entry.legitimacy).toBeLessThan(0.5);
  });
});
