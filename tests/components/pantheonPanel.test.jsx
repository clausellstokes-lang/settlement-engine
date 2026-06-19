/** @vitest-environment jsdom */
import { afterEach, describe, expect, test, vi } from 'vitest';
import { cleanup, render } from '@testing-library/react';

let STORE = { savedSettlements: [] };
vi.mock('../../src/store/index.js', () => ({
  useStore: Object.assign(selector => selector(STORE), { getState: () => STORE }),
}));

import PantheonPanel, { hasPantheon } from '../../src/components/map/PantheonPanel.jsx';

afterEach(() => { cleanup(); vi.clearAllMocks(); });

describe('PantheonPanel — dormant vs active (§S4)', () => {
  test('hasPantheon is FALSE when religion is dormant (no pantheon key)', () => {
    expect(hasPantheon({ worldState: {} })).toBe(false);
    expect(hasPantheon({ worldState: { pantheon: {} } })).toBe(false);
    expect(hasPantheon(null)).toBe(false);
  });

  test('hasPantheon is TRUE when a deity ledger is materialized', () => {
    expect(hasPantheon({ worldState: { pantheon: { 'deity:Vael': { tier: 'major', seats: 4 } } } })).toBe(true);
  });

  test('renders the empty state when dormant', () => {
    STORE = { savedSettlements: [] };
    const { container } = render(<PantheonPanel campaign={{ id: 'c', name: 'Realm', worldState: {} }} />);
    expect(container.textContent).toMatch(/No pantheon yet/i);
  });

  test('renders the deity hierarchy when active', () => {
    STORE = { savedSettlements: [{ id: 'a', name: 'Ashford', settlement: { config: { primaryDeitySnapshot: { name: 'Vael', _deityRef: 'deity:Vael' } } } }] };
    const campaign = {
      id: 'c', name: 'Realm', settlementIds: ['a'],
      worldState: { pantheon: { 'deity:Vael': { tier: 'major', seats: 4, wins: 3, losses: 0 } } },
    };
    const { container } = render(<PantheonPanel campaign={campaign} />);
    expect(container.textContent).toMatch(/Vael/);
    expect(container.textContent).toMatch(/Major Powers/i);
    expect(container.textContent).not.toMatch(/No pantheon yet/i);
  });
});
