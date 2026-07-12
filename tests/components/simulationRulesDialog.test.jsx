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
    actions.updateCampaignSimulationRules.mockResolvedValue({ presetId: 'full_simulation' });
    const onClose = vi.fn();

    render(<SimulationRulesDialog
      open
      campaign={{ id: 'camp-1', name: 'Realm', worldState: { simulationRules: { propagationMode: 'local' } } }}
      onClose={onClose}
    />);

    // CL-0 dialog v2: the grid carries the four §11 presets (the legacy trio
    // stays resolvable in the catalog but off the grid).
    fireEvent.click(screen.getByText('Full Simulation'));
    fireEvent.click(screen.getByRole('button', { name: 'Preview' }));

    await waitFor(() => {
      expect(actions.previewCampaignWorldPulse).toHaveBeenCalledWith('camp-1', 'one_month', {
        simulationRules: expect.objectContaining({
          presetId: 'full_simulation',
          propagationMode: 'full',
          majorChangesRequireProposal: false,
          politicalAutonomy: 'full',
          warLayerEnabled: true,
        }),
      });
    });
    expect(screen.getByText('Major pressure event')).toBeTruthy();

    fireEvent.click(screen.getByRole('button', { name: 'Save' }));
    await waitFor(() => {
      expect(actions.updateCampaignSimulationRules).toHaveBeenCalledWith('camp-1', expect.objectContaining({
        presetId: 'full_simulation',
      }));
      expect(onClose).toHaveBeenCalled();
    });
  });
});
