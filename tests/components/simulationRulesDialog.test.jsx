/** @vitest-environment jsdom */
import { afterEach, describe, expect, test, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';

import SimulationRulesDialog from '../../src/components/map/SimulationRulesDialog.jsx';

const actions = {
  previewCampaignWorldPulse: vi.fn(),
  updateCampaignSimulationRules: vi.fn(),
  // Which campaigns have an advance in flight. The dialog subscribes to this LIST
  // (not the isAdvanceInFlight fn) and does the membership test itself, so tests
  // drive the blocked state by mutating this array. Empty = nothing advancing.
  advanceInFlight: [],
};

vi.mock('../../src/store/index.js', () => ({
  useStore: selector => selector(actions),
}));

describe('SimulationRulesDialog', () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
    actions.advanceInFlight = [];
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

  // LINEAGE NOTE (master merge W6): master placed the three living-world gates
  // (war / strategy / religion) INSIDE this dialog under an auto-opened "Engine
  // gates (advanced)" group. This lineage deliberately surfaces them as
  // LivingWorldGates on the Realm dashboard (src/components/settlements/
  // LivingWorldGates.jsx, mounted in RealmDashboard.jsx:375 — covered by
  // campaignWorldPulseControlLayer + warFaithSurfacing, 27 green). The two
  // in-dialog gate tests were removed; the dialog's own coupling logic
  // (war→strategy, faithSpread↔religionDynamics twin-write) stays exercised
  // through the save path below.

  test('blocks the rules edit while this campaign is advancing', async () => {
    actions.updateCampaignSimulationRules.mockResolvedValue({});
    actions.advanceInFlight = ['camp-1'];
    const onClose = vi.fn();

    render(<SimulationRulesDialog
      open
      // camp-1 present in advanceInFlight → every rules write is a store no-op.
      campaign={{ id: 'camp-1', name: 'Realm', worldState: { simulationRules: {} } }}
      onClose={onClose}
    />);

    // The "the realm is advancing…" affordance is shown, the write control is
    // disabled, and the living-world gates carry the brief in-flight hint.
    expect(screen.getByTestId('rules-advance-blocked')).toBeTruthy();
    const saveBtn = screen.getByRole('button', { name: 'Save' });
    expect(saveBtn.disabled).toBe(true);
    // (master's in-dialog gate checkboxes are not rendered here — see the
    // LINEAGE NOTE above; the banner + disabled Save + refused write are the
    // shared substance.)

    // Even if Save is fired (defensively), no store write goes out — the guard
    // refuses so no false-success path exists.
    fireEvent.click(saveBtn);
    await Promise.resolve();
    expect(actions.updateCampaignSimulationRules).not.toHaveBeenCalled();
    expect(onClose).not.toHaveBeenCalled();
  });

  test('does not block the rules edit for a DIFFERENT campaign advancing', async () => {
    actions.updateCampaignSimulationRules.mockResolvedValue({});
    actions.advanceInFlight = ['camp-other'];
    const onClose = vi.fn();

    render(<SimulationRulesDialog
      open
      // The advance is on camp-other, not this dialog's camp-2, so editing is free.
      campaign={{ id: 'camp-2', name: 'Realm Two', worldState: { simulationRules: {} } }}
      onClose={onClose}
    />);

    expect(screen.queryByTestId('rules-advance-blocked')).toBeNull();
    const saveBtn = screen.getByRole('button', { name: 'Save' });
    expect(saveBtn.disabled).toBe(false);

    fireEvent.click(saveBtn);
    await waitFor(() => {
      expect(actions.updateCampaignSimulationRules).toHaveBeenCalledWith('camp-2', expect.anything());
      expect(onClose).toHaveBeenCalled();
    });
  });
});
