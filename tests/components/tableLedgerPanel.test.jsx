/** @vitest-environment jsdom */
/**
 * tests/components/tableLedgerPanel.test.jsx — R-1 Session Ledger picker pins (SB2).
 *
 * The manual picker must see the SAME world every domain reader sees:
 *   - stressor targets resolve through canonStressors (the `stresses` alias and
 *     the bare-object legacy shape count — hand-rolled discovery dropped them);
 *   - exposure offers ONLY what EXPOSE_CORRUPTION can act on (the compromised
 *     roster), never every NPC index-keyed into a target_not_found ghost.
 */
import { afterEach, describe, expect, test, vi } from 'vitest';
import { cleanup, render, screen, fireEvent } from '@testing-library/react';

let STORE = {};
vi.mock('../../src/store/index.js', () => ({ useStore: (selector) => selector(STORE) }));

import TableLedgerPanel from '../../src/components/tableLedger/TableLedgerPanel.jsx';

afterEach(() => { cleanup(); });

function storeFor(settlement) {
  return {
    settlement,
    phase: 'canon',
    pendingEditsQueue: [],
    queueEdit: vi.fn(() => true),
    commitPendingEdits: vi.fn(),
    revertPendingEdits: vi.fn(),
  };
}

function optionLabels() {
  return Array.from(screen.getByLabelText('Who or what').querySelectorAll('option')).map((o) => o.textContent);
}

describe('TableLedgerPanel — stressor targets via canonStressors', () => {
  test('the `stresses` alias populates the hardship picker', () => {
    STORE = storeFor({ name: 'Ash', stresses: [{ type: 'famine', label: 'Famine' }] });
    render(<TableLedgerPanel />);
    fireEvent.click(screen.getByText('A hardship eased'));
    expect(optionLabels()).toContain('Famine');
  });

  test('a single bare-object stressor counts as one hardship', () => {
    STORE = storeFor({ name: 'Ash', stress: { type: 'banditry', label: 'Banditry' } });
    render(<TableLedgerPanel />);
    fireEvent.click(screen.getByText('A hardship eased'));
    expect(optionLabels()).toContain('Banditry');
  });
});

describe('TableLedgerPanel — exposure offers only the compromised roster', () => {
  const settlement = {
    name: 'Ash',
    npcs: [
      { id: 'npc.aldis', name: 'Aldis', corrupt: true },
      { id: 'npc.cato', name: 'Cato' }, // clean — EXPOSE_CORRUPTION would veto
    ],
    institutions: [
      { id: 'inst.guild', name: 'The Guild', impairments: [{ type: 'corruption' }] },
    ],
  };

  test('corrupt NPCs and corruption-impaired institutions are offered; clean NPCs are not', () => {
    STORE = storeFor(settlement);
    render(<TableLedgerPanel />);
    fireEvent.click(screen.getByText('A secret laid bare'));
    const labels = optionLabels();
    expect(labels).toContain('Aldis');
    expect(labels).toContain('The Guild');
    expect(labels).not.toContain('Cato');
  });

  test('with nothing compromised the picker is honestly empty', () => {
    STORE = storeFor({ name: 'Ash', npcs: [{ id: 'n1', name: 'Clean' }] });
    render(<TableLedgerPanel />);
    fireEvent.click(screen.getByText('A secret laid bare'));
    expect(optionLabels()).toEqual(['Nothing here to name yet']);
  });
});
