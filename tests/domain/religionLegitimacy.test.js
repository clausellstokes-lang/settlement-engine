/**
 * religionLegitimacy.test.js — the *rightful claim* axis (distinct from share).
 * Covers the ruler lens, the legitimacy target composite (ruler fit + neighbour +
 * tenure − heresy stain), the lagged step, and determinism.
 */
import { describe, it, expect } from 'vitest';
import {
  rulerLens, deityLegitimacyTarget, stepDeityLegitimacy, deityGrowthFavor, RELIGION_LEGITIMACY_TUNING,
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

describe('deityGrowthFavor — the conversion-speed knob', () => {
  it('a faith that fits the ruling power grows faster than one that clashes', () => {
    const lens = rulerLens(militarySettlement());            // warlike junta
    expect(deityGrowthFavor(deity('Korl', 'warlike', 'neutral'), lens))
      .toBeGreaterThan(deityGrowthFavor(deity('Sael', 'peaceful', 'good'), lens));
  });

  it('corruption speeds an evil-leaning faith and slows a good one', () => {
    const corrupt = { temper: 0.5, align: 0.5, power: 0.5, corrupt: 0.85 };
    expect(deityGrowthFavor(deity('Vorr', 'neutral', 'evil'), corrupt))
      .toBeGreaterThan(deityGrowthFavor(deity('Lumis', 'neutral', 'good'), corrupt));
  });

  it('is bounded 0..1 and deterministic', () => {
    const lens = rulerLens(militarySettlement());
    const v = deityGrowthFavor(deity('Korl', 'warlike', 'evil'), lens);
    expect(v).toBeGreaterThanOrEqual(0);
    expect(v).toBeLessThanOrEqual(1);
    expect(v).toBe(deityGrowthFavor(deity('Korl', 'warlike', 'evil'), lens));
  });
});

describe('compromise re-weights legitimacy toward the captured rulership', () => {
  const cleanLens = { temper: 0.5, align: 0.7, power: 0.6, corrupt: 0, compromise: 0 };
  const corruptLens = { temper: 0.7, align: 0.15, power: 0.6, corrupt: 0.6, compromise: 0.85 };
  const target = (deityArg, entry, lens) => deityLegitimacyTarget({
    settlement: militarySettlement(), snapshot: {}, worldState: {}, cid: 's',
    deity: deityArg, deityRef: deityArg._deityRef, neighbourIds: [], entry, lens, deitySnapshotFor: noNeighbour,
  });
  it('a corrupt rulership collapses a misaligned (good) patron’s legitimacy', () => {
    const good = deity('Lumis', 'peaceful', 'good');
    expect(target(good, { tenure: 25, heresyStain: 0, standing: 'ascendant' }, corruptLens))
      .toBeLessThan(target(good, { tenure: 25, heresyStain: 0, standing: 'ascendant' }, cleanLens));
  });
  it('…and lifts the aligned (evil) creed it favours', () => {
    const evil = deity('Vorr', 'warlike', 'evil');
    expect(target(evil, { tenure: 0, heresyStain: 0, standing: 'cult' }, corruptLens))
      .toBeGreaterThan(target(evil, { tenure: 0, heresyStain: 0, standing: 'cult' }, cleanLens));
  });
});

describe('compromise chain — corruption/criminal-rule amplifies EVIL faiths', () => {
  // A settlement ruled by a criminal syndicate with a corruptible boss NPC and a
  // criminal institution: the NPC→faction→ruler compromise chain is deep.
  const compromised = () => ({
    tier: 'city', config: {},
    powerStructure: { governingName: 'The Syndicate', factions: [{ id: 'f.crime', name: 'The Syndicate', archetype: 'criminal', power: 70 }] },
    npcs: [{ id: 'n1', name: 'Boss', importance: 'pillar', linkedFactionIds: ['f.crime'], personality: { dominant: 'greedy', flaw: 'greedy' }, flaw: 'greedy' }],
    institutions: [{ id: 'i.thieves', name: 'Thieves Guild', category: 'criminal', status: 'active' }],
    economicState: { prosperity: 'struggling' },
  });

  it('rulerLens surfaces a high compromise for a rotten rulership', () => {
    expect(rulerLens(compromised()).compromise).toBeGreaterThan(rulerLens(militarySettlement()).compromise);
    expect(rulerLens(compromised()).compromise).toBeGreaterThan(0.5);
  });

  it('an evil faith grows significantly faster under a compromised rulership', () => {
    const evil = deity('Vorr', 'neutral', 'evil');
    expect(deityGrowthFavor(evil, rulerLens(compromised())))
      .toBeGreaterThan(deityGrowthFavor(evil, rulerLens(militarySettlement())));
  });

  it('the compromise amplifier does NOT lift good faiths (evil-only)', () => {
    const lens = rulerLens(compromised());
    // Strip the compromise term and confirm a GOOD faith's favour is unchanged by it.
    const lensNoCompromise = { ...lens, compromise: 0 };
    expect(deityGrowthFavor(deity('Lumis', 'neutral', 'good'), lens))
      .toBe(deityGrowthFavor(deity('Lumis', 'neutral', 'good'), lensNoCompromise));
  });
});
