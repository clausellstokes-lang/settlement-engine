import { describe, it, expect } from 'vitest';
import { mutateSettlement } from '../../../src/domain/events/mutate.js';

// #3 — INFILTRATION INSTIGATOR → configurable, LIGHTER souring. When
// APPLY_STRESSOR applies an 'infiltrated' stressor and names an instigating
// neighbour, the home settlement's view of that neighbour sours to the DM-chosen
// relationship (rival / cold_war / hostile, default rival) — a lighter touch than
// the war stressors' flat 'hostile'. Like #1 the change is settlement-local
// (espionage, not an army: no cross-settlement war deployment), and it only ever
// ESCALATES along the adversarial axis (never softens an already-worse edge).
const base = (rel = 'neutral') => ({
  name: 'Home',
  neighbourNetwork: [
    { id: 'n1', name: 'Stonehaven', relationshipType: rel },
    { id: 'n2', name: 'Irontown', relationshipType: 'trade_partner' },
  ],
});
const relOf = (s, name) => s.neighbourNetwork.find((n) => n.name === name)?.relationshipType;

const infiltrated = (instigator, instigatorRelationship) => ({
  id: 'ev-inf', type: 'APPLY_STRESSOR', targetId: 'infiltrated',
  payload: {
    stressorType: 'infiltrated', label: 'infiltrated', severity: 0.5,
    ...(instigator ? { instigatorNeighbour: instigator } : {}),
    ...(instigatorRelationship ? { instigatorRelationship } : {}),
  },
});

describe('#3 infiltration-stressor instigator → configurable souring', () => {
  it('defaults to rival when no relationship is chosen', () => {
    const next = mutateSettlement({ settlement: base('neutral'), event: infiltrated('Stonehaven') });
    expect(relOf(next, 'Stonehaven')).toBe('rival');
    expect(relOf(next, 'Irontown')).toBe('trade_partner'); // untouched
  });

  it('sours to the chosen relationship for each allowed level', () => {
    for (const rel of ['rival', 'cold_war', 'hostile']) {
      const next = mutateSettlement({ settlement: base('neutral'), event: infiltrated('Stonehaven', rel) });
      expect(relOf(next, 'Stonehaven')).toBe(rel);
    }
  });

  it('falls back to rival for an out-of-set relationship value', () => {
    const next = mutateSettlement({ settlement: base('neutral'), event: infiltrated('Stonehaven', 'allied') });
    expect(relOf(next, 'Stonehaven')).toBe('rival');
  });

  it('ESCALATES a milder edge (rival → cold_war)', () => {
    const next = mutateSettlement({ settlement: base('rival'), event: infiltrated('Stonehaven', 'cold_war') });
    expect(relOf(next, 'Stonehaven')).toBe('cold_war');
  });

  it('does NOT downgrade an already-worse edge (hostile stays hostile under a rival infiltration)', () => {
    const next = mutateSettlement({ settlement: base('hostile'), event: infiltrated('Stonehaven', 'rival') });
    expect(relOf(next, 'Stonehaven')).toBe('hostile'); // not softened
    expect(next.neighbourNetwork.find((n) => n.name === 'Stonehaven')._relationshipEventId).toBeUndefined();
  });

  it('is a no-op when no instigator is named', () => {
    const next = mutateSettlement({ settlement: base('neutral'), event: infiltrated(null, 'hostile') });
    expect(relOf(next, 'Stonehaven')).toBe('neutral');
  });

  it('is a no-op when the instigator name matches no linked neighbour', () => {
    const s = base('neutral');
    const next = mutateSettlement({ settlement: s, event: infiltrated('Nowhere', 'rival') });
    expect(next.neighbourNetwork).toEqual(s.neighbourNetwork);
  });
});
