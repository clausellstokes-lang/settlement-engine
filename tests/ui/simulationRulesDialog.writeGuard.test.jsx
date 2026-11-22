/**
 * @vitest-environment jsdom
 *
 * tests/ui/simulationRulesDialog.writeGuard.test.jsx — lock-in for the
 * mid-advance write guard (RP-1 §130 safety regression).
 *
 * While a campaign's advance is in flight the store no-ops a rules write (it
 * would be clobbered by the advance's wholesale worldState replace), so a Save
 * would silently drop the GM's edit. The dialog must (a) show the advancing
 * banner, (b) disable Save, and (c) not call updateCampaignSimulationRules on a
 * Save attempt. When no advance is in flight, Save writes normally.
 */

import { describe, test, expect, afterEach, vi } from 'vitest';
import { render, cleanup, fireEvent, screen, waitFor } from '@testing-library/react';

afterEach(cleanup);

let state = {};
vi.mock('../../src/store/index.js', () => {
  function useStore(selector) { return selector(state); }
  useStore.getState = () => state;
  return { useStore };
});

import SimulationRulesDialog from '../../src/components/map/SimulationRulesDialog.jsx';

const CAMPAIGN = { id: 'camp-1', name: 'Realm', worldState: { simulationRules: {} } };

function mount({ advanceInFlight, updateRules }) {
  state = {
    updateCampaignSimulationRules: updateRules,
    previewCampaignWorldPulse: vi.fn(),
    advanceInFlight,
  };
  render(<SimulationRulesDialog open campaign={CAMPAIGN} onClose={vi.fn()} />);
}

describe('SimulationRulesDialog — mid-advance write guard', () => {
  test('blocks Save while this campaign is advancing', () => {
    const updateRules = vi.fn().mockResolvedValue(undefined);
    mount({ advanceInFlight: ['camp-1'], updateRules });

    expect(screen.getByTestId('rules-advance-blocked')).toBeTruthy();
    const save = screen.getByRole('button', { name: 'Save' });
    expect(save.disabled).toBe(true);

    fireEvent.click(save);
    expect(updateRules).not.toHaveBeenCalled();
  });

  test('allows Save when no advance is in flight', async () => {
    const updateRules = vi.fn().mockResolvedValue(undefined);
    mount({ advanceInFlight: [], updateRules });

    expect(screen.queryByTestId('rules-advance-blocked')).toBeNull();
    const save = screen.getByRole('button', { name: 'Save' });
    expect(save.disabled).toBe(false);

    fireEvent.click(save);
    await waitFor(() => expect(updateRules).toHaveBeenCalledWith('camp-1', expect.any(Object)));
  });
});
