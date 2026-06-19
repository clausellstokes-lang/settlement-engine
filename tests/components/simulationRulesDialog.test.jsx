/** @vitest-environment jsdom */
import { afterEach, describe, expect, test, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';

import SimulationRulesDialog from '../../src/components/map/SimulationRulesDialog.jsx';

const actions = {
  previewCampaignWorldPulse: vi.fn(),
  updateCampaignSimulationRules: vi.fn(),
};

vi.mock('../../src/store/index.js', () => ({
  useStore: selector => selector(actions),
}));

describe('SimulationRulesDialog', () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  test('previews and saves a selected preset without mutating first', async () => {
    actions.previewCampaignWorldPulse.mockReturnValue({
      pulseRecord: {
        candidateCount: 3,
        selectedCount: 1,
        autoAppliedCount: 1,
        proposalCount: 0,
        selectedOutcomes: [{
          id: 'outcome-1',
          ruleFamily: 'relationship',
          headline: 'Major pressure event',
        }],
      },
    });
    actions.updateCampaignSimulationRules.mockResolvedValue({ presetId: 'dramatic_campaign' });
    const onClose = vi.fn();

    render(<SimulationRulesDialog
      open
      campaign={{ id: 'camp-1', name: 'Realm', worldState: { simulationRules: { propagationMode: 'local' } } }}
      onClose={onClose}
    />);

    fireEvent.click(screen.getByText('Dramatic Campaign'));
    fireEvent.click(screen.getByRole('button', { name: 'Preview' }));

    await waitFor(() => {
      expect(actions.previewCampaignWorldPulse).toHaveBeenCalledWith('camp-1', 'one_month', {
        simulationRules: expect.objectContaining({
          presetId: 'dramatic_campaign',
          intensity: 'dramatic',
          majorChangesRequireProposal: false,
        }),
      });
    });
    expect(screen.getByText('Major pressure event')).toBeTruthy();

    fireEvent.click(screen.getByRole('button', { name: 'Save' }));
    await waitFor(() => {
      expect(actions.updateCampaignSimulationRules).toHaveBeenCalledWith('camp-1', expect.objectContaining({
        presetId: 'dramatic_campaign',
      }));
      expect(onClose).toHaveBeenCalled();
    });
  });

  // ── UX Phase 4 — the THREE living-world gates (the unreachable-engine fix) ──
  test('renders the 3 living-world gates, OFF by default', () => {
    render(<SimulationRulesDialog
      open
      campaign={{ id: 'camp-1', name: 'Realm', worldState: { simulationRules: {} } }}
      onClose={() => {}}
    />);

    expect(screen.getByText('Living-world systems (advanced)')).toBeTruthy();
    const warGate = screen.getByRole('checkbox', { name: 'War layer' });
    const strategyGate = screen.getByRole('checkbox', { name: 'Settlement strategy' });
    const religionGate = screen.getByRole('checkbox', { name: 'Religion dynamics' });

    // The three gates default FALSE (DEFAULT_SIMULATION_RULES), so they render OFF
    // even though every other toggle is on-unless-explicitly-false.
    expect(warGate.checked).toBe(false);
    expect(strategyGate.checked).toBe(false);
    expect(religionGate.checked).toBe(false);
  });

  test('toggling the 3 gates ON reaches simulationRules on save', async () => {
    actions.updateCampaignSimulationRules.mockResolvedValue({});
    const onClose = vi.fn();

    render(<SimulationRulesDialog
      open
      campaign={{ id: 'camp-1', name: 'Realm', worldState: { simulationRules: {} } }}
      onClose={onClose}
    />);

    fireEvent.click(screen.getByRole('checkbox', { name: 'War layer' }));
    fireEvent.click(screen.getByRole('checkbox', { name: 'Settlement strategy' }));
    fireEvent.click(screen.getByRole('checkbox', { name: 'Religion dynamics' }));

    expect(screen.getByRole('checkbox', { name: 'War layer' }).checked).toBe(true);

    fireEvent.click(screen.getByRole('button', { name: 'Save' }));

    await waitFor(() => {
      // The toggles reach the rules object passed to updateCampaignSimulationRules —
      // this is the proof the premium engine is now reachable from the UI.
      expect(actions.updateCampaignSimulationRules).toHaveBeenCalledWith('camp-1', expect.objectContaining({
        warLayerEnabled: true,
        settlementStrategyEnabled: true,
        religionDynamicsEnabled: true,
      }));
      expect(onClose).toHaveBeenCalled();
    });
  });
});
