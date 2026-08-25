import { describe, it, expect } from 'vitest';
import { mutateSettlement } from '../../../src/domain/events/mutate.js';

// §9b/§9g/§9h — Settlement Dispute / Brokered Alliance / Opened Trade Route set
// the matched neighbour's relationshipType on this settlement's neighbourNetwork.
const base = () => ({
  name: 'Home',
  neighbourNetwork: [
    { id: 'n1', name: 'Stonehaven', relationshipType: 'neutral' },
    { id: 'n2', name: 'Irontown', relationshipType: 'trade_partners' },
  ],
});
const relOf = (s, name) => s.neighbourNetwork.find((n) => n.name === name)?.relationshipType;

describe('§9 relationship events', () => {
  it('SETTLEMENT_DISPUTE downgrades only the matched neighbour', () => {
    const next = mutateSettlement({ settlement: base(), event: { id: 'e1', type: 'SETTLEMENT_DISPUTE', targetId: 'Stonehaven', payload: { relationshipType: 'hostile' } } });
    expect(relOf(next, 'Stonehaven')).toBe('hostile');
    expect(relOf(next, 'Irontown')).toBe('trade_partners'); // untouched
  });

  it('BROKERED_ALLIANCE forces the relationship to allied', () => {
    const next = mutateSettlement({ settlement: base(), event: { id: 'e2', type: 'BROKERED_ALLIANCE', targetId: 'Stonehaven', payload: {} } });
    expect(relOf(next, 'Stonehaven')).toBe('allied');
  });

  it('OPENED_TRADE_ROUTE sets the chosen trade relationship', () => {
    const next = mutateSettlement({ settlement: base(), event: { id: 'e3', type: 'OPENED_TRADE_ROUTE', targetId: 'Irontown', payload: { relationshipType: 'patron' } } });
    expect(relOf(next, 'Irontown')).toBe('patron');
  });

  // H12 — the canonical label is the SINGULAR 'trade_partner'; the plural the
  // event historically wrote is recognized by no other subsystem.
  it('OPENED_TRADE_ROUTE defaults to the canonical trade_partner label', () => {
    const next = mutateSettlement({ settlement: base(), event: { id: 'e5', type: 'OPENED_TRADE_ROUTE', targetId: 'Stonehaven', payload: {} } });
    expect(relOf(next, 'Stonehaven')).toBe('trade_partner');
  });

  it('OPENED_TRADE_ROUTE normalizes the legacy plural payload the composer still offers', () => {
    const next = mutateSettlement({ settlement: base(), event: { id: 'e6', type: 'OPENED_TRADE_ROUTE', targetId: 'Irontown', payload: { relationshipType: 'trade_partners' } } });
    expect(relOf(next, 'Irontown')).toBe('trade_partner');
  });

  it('is a no-op when the named neighbour is not linked', () => {
    const s = base();
    const next = mutateSettlement({ settlement: s, event: { id: 'e4', type: 'SETTLEMENT_DISPUTE', targetId: 'Nowhere', payload: { relationshipType: 'rival' } } });
    expect(next.neighbourNetwork).toEqual(s.neighbourNetwork);
  });
});
