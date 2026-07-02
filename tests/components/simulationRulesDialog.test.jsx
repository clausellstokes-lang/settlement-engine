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

    // Discoverability: the Engine group auto-opens while the living-world gates are
    // still off, so the war/religion toggles are visible the moment the dialog opens
    // — no click-to-expand needed (the "buyers never found the gates" fix).
    expect(screen.getByRole('button', { name: /Engine gates \(advanced\)/ }).getAttribute('aria-expanded')).toBe('true');
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

    // The Engine group is open by default while the gates are off, so the toggles
    // are directly reachable — no expand click needed.
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

  // ── advance-guard-ui — the store no-ops rules writes mid-advance, so the dialog
  // must DISABLE its edit controls + show the affordance rather than let Save fire a
  // write the store will silently drop and still report success over. ───────────────
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
    expect(screen.getByRole('checkbox', { name: 'War layer' }).disabled).toBe(true);
    expect(screen.getAllByTestId('gate-disabled-reason').length).toBeGreaterThan(0);

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
