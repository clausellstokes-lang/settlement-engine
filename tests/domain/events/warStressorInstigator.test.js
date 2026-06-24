import { describe, it, expect } from 'vitest';
import { mutateSettlement } from '../../../src/domain/events/mutate.js';

// #1 — SIEGE/OCCUPATION INSTIGATOR → HOSTILE. When APPLY_STRESSOR applies a
// WAR-type stressor (siege / wartime / occupation / betrayal) and names an
// instigating neighbour, the home settlement's view of that neighbour sours to
// 'hostile' — unless it is already in a hostile-family relationship. The change
// is settlement-local (the home settlement's neighbourNetwork only).
const base = (rel = 'neutral') => ({
  name: 'Home',
  neighbourNetwork: [
    { id: 'n1', name: 'Stonehaven', relationshipType: rel },
    { id: 'n2', name: 'Irontown', relationshipType: 'trade_partner' },
  ],
});
const relOf = (s, name) => s.neighbourNetwork.find((n) => n.name === name)?.relationshipType;

const war = (instigator, stressorType = 'siege') => ({
  id: 'ev-war', type: 'APPLY_STRESSOR', targetId: stressorType,
  payload: { stressorType, label: stressorType, severity: 0.7, ...(instigator ? { instigatorNeighbour: instigator } : {}) },
});

describe('#1 war-stressor instigator → hostile', () => {
  it('flips the named instigator to hostile on a siege', () => {
    const next = mutateSettlement({ settlement: base('neutral'), event: war('Stonehaven') });
    expect(relOf(next, 'Stonehaven')).toBe('hostile');
    expect(relOf(next, 'Irontown')).toBe('trade_partner'); // untouched
  });

  it('flips for every WAR_STRESSOR_TYPES variant', () => {
    for (const t of ['siege', 'wartime', 'occupation', 'betrayal']) {
      const next = mutateSettlement({ settlement: base('neutral'), event: war('Stonehaven', t) });
      expect(relOf(next, 'Stonehaven')).toBe('hostile');
    }
  });

  it('is a no-op on the relationship when no instigator is chosen', () => {
    const s = base('neutral');
    const next = mutateSettlement({ settlement: s, event: war(null) });
    expect(relOf(next, 'Stonehaven')).toBe('neutral');
    expect(relOf(next, 'Irontown')).toBe('trade_partner');
  });

  it('is a no-op when the neighbour is ALREADY hostile', () => {
    const s = base('hostile');
    const next = mutateSettlement({ settlement: s, event: war('Stonehaven') });
    expect(relOf(next, 'Stonehaven')).toBe('hostile'); // unchanged
    // The link object is not rewritten with a new event id when already hostile.
    expect(next.neighbourNetwork.find((n) => n.name === 'Stonehaven')._relationshipEventId).toBeUndefined();
  });

  it('ESCALATES a cold_war neighbour to hostile (cold_war is below hostile on the adversarial axis)', () => {
    // A war stressor targets the top of the axis (hostile). cold_war ranks below
    // it, so a siege escalates the edge the rest of the way to open hostility —
    // the no-downgrade guard only blocks SOFTENING, never escalation.
    const next = mutateSettlement({ settlement: base('cold_war'), event: war('Stonehaven') });
    expect(relOf(next, 'Stonehaven')).toBe('hostile');
  });

  it('is a no-op when the neighbour is ALREADY hostile (the top of the axis)', () => {
    const next = mutateSettlement({ settlement: base('hostile'), event: war('Stonehaven') });
    expect(relOf(next, 'Stonehaven')).toBe('hostile'); // unchanged, no re-stamp
    expect(next.neighbourNetwork.find((n) => n.name === 'Stonehaven')._relationshipEventId).toBeUndefined();
  });

  it('does NOT flip for a non-war stressor even with an instigator named', () => {
    const next = mutateSettlement({
      settlement: base('neutral'),
      event: { id: 'ev-f', type: 'APPLY_STRESSOR', targetId: 'famine', payload: { stressorType: 'famine', label: 'famine', severity: 0.7, instigatorNeighbour: 'Stonehaven' } },
    });
    expect(relOf(next, 'Stonehaven')).toBe('neutral');
  });

  it('is a no-op when the instigator name matches no linked neighbour', () => {
    const s = base('neutral');
    const next = mutateSettlement({ settlement: s, event: war('Nowhere') });
    expect(next.neighbourNetwork).toEqual(s.neighbourNetwork);
  });
});
