/**
 * @vitest-environment jsdom
 *
 * S7 AUTONOMY panel — render + flow. Pins: the S1 money moment (autonomy=4), the
 * PICKER-ONLY condition builder (signals come from the REAL registry; free-text ids
 * cannot exist), the local schema wall gating the Run button, the run flow → the stop
 * receipt (fired · weeks · seed + engine version), nudge approve → the registered
 * injectCampaignStressor op with the CLAMPED emission, standing-instructions save →
 * updateSavedCampaign with a versioned record, and the §3d kill-switch refusal
 * verbatim. Transports are mocked; the PURE halves (registry, wall, describe,
 * buildNudgeOp, nextStandingInstructions) run for real.
 */
import { describe, it, expect, afterEach, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, cleanup, waitFor } from '@testing-library/react';

const { storeRef, composeRef, runRef, injectRef, updateRef } = vi.hoisted(() => ({
  storeRef: { current: {} },
  composeRef: { fn: null },
  runRef: { fn: null },
  injectRef: { fn: null },
  updateRef: { fn: null },
}));

vi.mock('../../src/store/index.js', () => {
  const useStore = (selector) => selector(storeRef.current);
  useStore.getState = () => storeRef.current;
  return { useStore };
});
vi.mock('../../src/hooks/useRoute.js', () => ({ useRoute: () => ({ view: 'home', params: {} }) }));
vi.mock('../../src/lib/surveyorWrite.js', () => ({ composeAutonomy: (...a) => composeRef.fn(...a) }));
vi.mock('../../src/lib/surveyorAutonomy.js', () => ({ runAutonomousAdvance: (...a) => runRef.fn(...a) }));

import AutonomyPanel from '../../src/components/surveyor/AutonomyPanel.jsx';
import { signalRegistryEntries, STANDING_INSTRUCTIONS_KEY } from '../../src/domain/autonomy/index.js';

const CAMPAIGN = {
  id: 'camp-1', name: 'The March', settlementIds: ['ashford', 'bramwick'],
  worldState: { tick: 0, rngSeed: 'seed-1' },
};

beforeEach(() => {
  storeRef.current = {
    settlement: null,
    savedSettlements: [
      { id: 'ashford', name: 'Ashford' },
      { id: 'bramwick', name: 'Bramwick' },
    ],
    campaigns: [CAMPAIGN],
    activeCampaignId: 'camp-1',
    selectedSettlementId: null, activeSaveId: null, creditBalance: 20,
    advanceCampaignWorld: vi.fn(async () => ({ ok: true })),
    injectCampaignStressor: (...a) => injectRef.fn(...a),
    updateSavedCampaign: (...a) => updateRef.fn(...a),
  };
  injectRef.fn = vi.fn();
  updateRef.fn = vi.fn();
  composeRef.fn = vi.fn(async () => ({ ok: true, composition: { stopCondition: null, maxWeeks: 1, nudges: [], unsupported: [] }, musings: [] }));
  runRef.fn = vi.fn(async () => ({ stopped: 'condition', receipt: null }));
});
afterEach(() => { cleanup(); vi.clearAllMocks(); });

describe('AutonomyPanel', () => {
  it('asks for a campaign when none is open', () => {
    storeRef.current.activeCampaignId = null;
    render(<AutonomyPanel />);
    expect(screen.getByText(/open a campaign first/i)).toBeTruthy();
  });

  it('shows the S1 money moment: the autonomy compose costs 4 credits', () => {
    render(<AutonomyPanel />);
    expect(screen.getByText(/4 credits/i)).toBeTruthy();
    expect(screen.getByText(/20 left/i)).toBeTruthy();
  });

  it('the condition builder is PICKER-ONLY over the real registry (never free-text ids)', () => {
    render(<AutonomyPanel />);
    fireEvent.click(screen.getByRole('button', { name: /add a test/i }));
    const signalSelect = screen.getByLabelText('Signal');
    expect(signalSelect.tagName).toBe('SELECT');
    const options = [...signalSelect.querySelectorAll('option')].map((o) => o.value);
    expect(options).toEqual(signalRegistryEntries().map((e) => e.id));
    expect(options).toContain('world.tick');
    expect(options).toContain('pressure.food');
  });

  it('the local wall gates the Run button: a settlement signal without a settlement is not runnable', () => {
    render(<AutonomyPanel />);
    fireEvent.click(screen.getByRole('button', { name: /add a test/i }));
    // Switch the row to a settlement-scoped signal but pick no settlement.
    fireEvent.change(screen.getByLabelText('Signal'), { target: { value: 'pressure.food' } });
    expect(screen.getByText(/not runnable yet/i)).toBeTruthy();
    expect(screen.getByRole('button', { name: /advance until it fires/i }).disabled).toBe(true);
    // Complete it: settlement + threshold ⇒ runnable.
    fireEvent.change(screen.getByLabelText('Settlement'), { target: { value: 'ashford' } });
    fireEvent.change(screen.getByLabelText('Threshold'), { target: { value: '0.5' } });
    expect(screen.queryByText(/not runnable yet/i)).toBeNull();
    expect(screen.getByRole('button', { name: /advance until it fires/i }).disabled).toBe(false);
    expect(screen.getByTestId('autonomy-condition').textContent).toContain('pressure.food @ashford');
  });

  it('runs the bounded advance and renders the stop receipt (seed + engine version)', async () => {
    runRef.fn = vi.fn(async ({ condition, maxWeeks }) => ({
      stopped: 'condition',
      receipt: {
        kind: 'autonomous_advance', engineVersion: 'gen-1/sim-1', seed: 'seed-1',
        conditionLabel: 'world.tick ≥ 2', fired: true, capped: false,
        startTick: 0, stopTick: 2, weeksAdvanced: 2, maxWeeks,
        evaluations: [{ signalId: 'world.tick', settlementId: null, otherId: null, value: 2, pass: true }],
        at: 'now', _condition: condition,
      },
    }));
    render(<AutonomyPanel />);
    fireEvent.click(screen.getByRole('button', { name: /add a test/i }));
    fireEvent.change(screen.getByLabelText('Threshold'), { target: { value: '2' } });
    fireEvent.change(screen.getByLabelText('Max weeks'), { target: { value: '5' } });
    fireEvent.click(screen.getByRole('button', { name: /advance until it fires/i }));
    await waitFor(() => screen.getByTestId('autonomy-receipt'));
    expect(runRef.fn).toHaveBeenCalledTimes(1);
    const args = runRef.fn.mock.calls[0][0];
    expect(args.campaignId).toBe('camp-1');
    expect(args.maxWeeks).toBe(5);
    expect(args.condition.root.signalId).toBe('world.tick');
    expect(screen.getByTestId('autonomy-receipt').textContent).toMatch(/condition fired/i);
    expect(screen.getByTestId('surveyor-receipt').textContent).toMatch(/gen-1\/sim-1/);
    expect(screen.getByTestId('surveyor-receipt').textContent).toMatch(/seed-1/);
  });

  it('a composed run proposal renders; approving a nudge dispatches the registered op with the clamped emission', async () => {
    composeRef.fn = vi.fn(async () => ({
      ok: true,
      composition: {
        stopCondition: { version: 1, root: { kind: 'test', signalId: 'world.tick', test: { op: 'gte', value: 4 } } },
        maxWeeks: 6,
        nudges: [{ type: 'famine', originSettlementId: 'ashford', severity: 2, rationale: 'lean harvest' }],
        unsupported: [{ requested: 'kill the duke', reason: 'outcome_write' }],
      },
      musings: [{ text: 'Consider a shorter run first.' }],
    }));
    render(<AutonomyPanel />);
    fireEvent.change(screen.getByLabelText(/describe the autonomous run/i), { target: { value: 'run until famine' } });
    fireEvent.click(screen.getByRole('button', { name: /compose it/i }));
    await waitFor(() => screen.getByTestId('autonomy-nudge-0'));
    // The honest unsupported list renders the outcome-write refusal.
    expect(screen.getByTestId('autonomy-unsupported').textContent).toMatch(/kill the duke/);
    // The composed condition landed in the run section.
    expect(screen.getByTestId('autonomy-condition').textContent).toContain('world.tick');
    // Approve the nudge: the registered op receives the CLAMPED severity (2 → 0.85).
    fireEvent.click(screen.getByRole('button', { name: /approve this nudge/i }));
    expect(injectRef.fn).toHaveBeenCalledWith('camp-1', { type: 'famine', originSettlementId: 'ashford', severity: 0.85 });
    expect(screen.getByText('injected')).toBeTruthy();
  });

  it('renders the §3d kill-switch refusal verbatim (paused stage, nothing charged)', async () => {
    composeRef.fn = vi.fn(async () => ({ ok: false, error: 'This Surveyor capability (autonomy) is paused right now, so nothing was charged.', refusalClass: 'stage_disabled', doors: ['ask_readonly'] }));
    render(<AutonomyPanel />);
    fireEvent.change(screen.getByLabelText(/describe the autonomous run/i), { target: { value: 'run' } });
    fireEvent.click(screen.getByRole('button', { name: /compose it/i }));
    const refusal = await waitFor(() => screen.getByTestId('surveyor-refusal'));
    expect(refusal.textContent).toMatch(/paused/i);
    expect(refusal.textContent).toMatch(/nothing was charged/i);
  });

  it('saves standing instructions as a versioned record through the registered campaign op', () => {
    render(<AutonomyPanel />);
    fireEvent.click(screen.getByRole('button', { name: /^edit$/i }));
    fireEvent.change(screen.getByLabelText(/standing campaign instructions/i), { target: { value: 'favor diplomacy' } });
    fireEvent.click(screen.getByRole('button', { name: /save instructions/i }));
    expect(updateRef.fn).toHaveBeenCalledTimes(1);
    const [id, patch] = updateRef.fn.mock.calls[0];
    expect(id).toBe('camp-1');
    expect(patch[STANDING_INSTRUCTIONS_KEY]).toMatchObject({ text: 'favor diplomacy', version: 1 });
    expect(typeof patch[STANDING_INSTRUCTIONS_KEY].updatedAt).toBe('string');
  });
});
