import { describe, it, expect } from 'vitest';
import { applyCorruptionImpairments } from '../../src/domain/worldPulse/corruptionImpair.js';

const NOW = '2026-06-08T00:00:00.000Z';
const baseSettlement = () => ({
  institutions: [
    { id: 'i1', name: "Thieves' Guild Chapter" },
    { id: 'i2', name: 'City Watch' },
  ],
  powerStructure: { factions: [{ id: 'f1', name: 'City Watch', controlsInstitutionIds: ['i2'] }] },
  factions: [],
});

const allStamps = (s) => [
  ...(s.institutions || []).flatMap((i) => (i.impairments || []).map((im) => im.appliedAt)),
  ...((s.powerStructure?.factions) || []).flatMap((f) => (f.impairments || []).map((im) => im.appliedAt)),
];

describe('applyCorruptionImpairments', () => {
  it('impairs the tied criminal institution and the home institution', () => {
    const exp = [{ npcId: 's1:guard', name: 'Greedy Guard', kind: 'ousted', criminalInstitution: "Thieves' Guild Chapter", homeInstitution: 'City Watch' }];
    const next = applyCorruptionImpairments(baseSettlement(), exp, { now: NOW });
    const guild = next.institutions.find((i) => i.id === 'i1');
    const watch = next.institutions.find((i) => i.id === 'i2');
    expect(guild.impairments?.length).toBeGreaterThan(0);
    expect(guild.impairments[0].type).toBe('legitimacy');
    expect(watch.impairments?.length).toBeGreaterThan(0); // home "City Watch" institution
  });

  it('threads appliedAt = now everywhere including propagated impairments (deterministic, no new Date)', () => {
    const exp = [{ npcId: 's1:g', name: 'G', kind: 'demoted', criminalInstitution: "Thieves' Guild Chapter", homeInstitution: 'City Watch' }];
    const a = applyCorruptionImpairments(baseSettlement(), exp, { now: NOW });
    const b = applyCorruptionImpairments(baseSettlement(), exp, { now: NOW });
    const sa = allStamps(a);
    expect(sa.length).toBeGreaterThan(0);
    expect(sa.every((t) => t === NOW)).toBe(true); // propagation inherited the timestamp
    expect(sa).toEqual(allStamps(b));              // fully deterministic
  });

  it('is a no-op on empty exposures (same reference)', () => {
    const s = baseSettlement();
    expect(applyCorruptionImpairments(s, [], { now: NOW })).toBe(s);
  });
});
