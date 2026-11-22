/** @vitest-environment jsdom */
/**
 * tests/components/adminSimTuningPantheon.test.jsx — F1 Sim-Tuning dashboard:
 * the "Pantheon standings" tuning view.
 *
 * Pins that AdminSimTuningPanel surfaces the live campaign's pantheon ledger
 * through the SAME pure pantheonDepth selectors (pantheonStandings +
 * deityDisplayName) the DM PantheonPanel and the PDF liveWorld slice consume —
 * as a deity / tier / seats / W–L MiniTable — and that the Card is self-gating:
 * a religion-dormant campaign (no `pantheon` key) renders no Pantheon Card.
 *
 * The panel reads only `campaigns` + `savedSettlements` from the store, so a
 * minimal selector mock is enough; no network/supabase wiring is pulled in.
 */
import { afterEach, describe, expect, test, vi } from 'vitest';
import { cleanup, render, fireEvent } from '@testing-library/react';

let STORE = { campaigns: [], savedSettlements: [] };
vi.mock('../../src/store/index.js', () => ({
  useStore: Object.assign(selector => selector(STORE), { getState: () => STORE }),
}));

import AdminSimTuningPanel from '../../src/components/admin/AdminSimTuningPanel.jsx';

afterEach(() => { cleanup(); });

describe('AdminSimTuningPanel — Pantheon standings card', () => {
  test('renders a deity / tier / seats / W–L table from the live pantheon ledger', () => {
    STORE = {
      savedSettlements: [],
      campaigns: [{
        id: 'c1', name: 'Realm', settlementIds: [],
        worldState: {
          pantheon: {
            'deity:Vael': { tier: 'major', seats: 5, wins: 4, losses: 1 },
            'deity:Brakka': { tier: 'cult', seats: 1, wins: 0, losses: 2 },
          },
        },
      }],
    };
    const { container, getByRole } = render(<AdminSimTuningPanel />);
    // The Select is a controlled component that defaults to no selection; choose
    // the campaign so its live ledgers render.
    fireEvent.change(getByRole('combobox'), { target: { value: 'c1' } });

    expect(container.textContent).toMatch(/Pantheon standings/i);
    // deityDisplayName strips the `deity:` prefix and title-cases the tail.
    expect(container.textContent).toMatch(/Vael/);
    expect(container.textContent).toMatch(/Brakka/);
    // W/L is rendered as "wins/losses" for the top (descending-seats) deity.
    expect(container.textContent).toMatch(/4\/1/);
  });

  test('renders no Pantheon standings card when the ledger is dormant (self-gating)', () => {
    STORE = {
      savedSettlements: [],
      campaigns: [{ id: 'c2', name: 'Peaceful', settlementIds: [], worldState: {} }],
    };
    const { container, getByRole } = render(<AdminSimTuningPanel />);
    fireEvent.change(getByRole('combobox'), { target: { value: 'c2' } });

    expect(container.textContent).not.toMatch(/Pantheon standings/i);
  });
});
