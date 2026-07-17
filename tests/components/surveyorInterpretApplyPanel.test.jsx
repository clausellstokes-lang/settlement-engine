/**
 * @vitest-environment jsdom
 *
 * ACCEPT→MINT panel — render + flow. Pins: the PROTECTED-CONSENT BARRIER (a flagged op cannot
 * apply without an explicit consent tick — it lands in `blocked`), NEVER-DROPPED honesty (an op
 * naming no dispatchable verb is surfaced as `unroutable`), the mint runs through the injected
 * store verbs (applyEvent / recordPartyImpact), and the reproducibility receipt (engine + seed)
 * renders. The transport is mocked; the PURE halves reviewInterpretation + runInterpretApply
 * run for real, so the whole accept→mint slice is genuinely exercised.
 */
import { describe, it, expect, afterEach, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, cleanup, waitFor } from '@testing-library/react';

const { storeRef, compileRef, applyEventRef, partyRef } = vi.hoisted(() => ({
  storeRef: { current: {} }, compileRef: { fn: null }, applyEventRef: { fn: null }, partyRef: { fn: null },
}));

vi.mock('../../src/store/index.js', () => ({ useStore: (selector) => selector(storeRef.current) }));
vi.mock('../../src/hooks/useRoute.js', () => ({ useRoute: () => ({ view: 'chronicle', params: {} }) }));
vi.mock('../../src/lib/surveyorWrite.js', () => ({ compileInterpretation: (...a) => compileRef.fn(...a) }));

import InterpretApplyPanel from '../../src/components/surveyor/InterpretApplyPanel.jsx';

const INTERPRETATION = {
  ops: [
    { opType: 'settlement_founded', family: 'canon_event', params: { name: 'Keld' }, label: 'required', protectedFlags: [] },
    { opType: 'name_attacker', family: 'party_impact', params: { attacker: 'Ashford' }, label: 'inferred', protectedFlags: [] },
    { opType: 'mystery_op', family: 'unknown_family', params: {}, label: 'uncertain', protectedFlags: [] },
    { opType: 'seal_the_vault', family: 'canon_event', params: {}, label: 'optional', protectedFlags: ['consent_required'] },
  ],
};

beforeEach(() => {
  applyEventRef.fn = vi.fn(() => ({ ok: true }));
  partyRef.fn = vi.fn(async () => ({ ok: true }));
  storeRef.current = { settlement: { id: 's1' }, savedSettlements: [], campaigns: [{ id: 'camp-1', worldState: { tick: 3 } }],
    activeCampaignId: 'camp-1', selectedSettlementId: 's1', activeSaveId: 'save-1', creditBalance: 25,
    applyEvent: (...a) => applyEventRef.fn(...a), recordPartyImpact: (...a) => partyRef.fn(...a) };
  compileRef.fn = vi.fn(async () => ({ ok: true, interpretation: INTERPRETATION, seed: 'seed-xyz', interpretRef: 'ref-1', musings: [], byok: false, earlyAccess: true }));
});
afterEach(() => { cleanup(); vi.clearAllMocks(); });

function interpret() {
  render(<InterpretApplyPanel />);
  fireEvent.change(screen.getByLabelText(/paste the session recap/i), { target: { value: 'the party sacked the customs house' } });
  fireEvent.click(screen.getByRole('button', { name: /^interpret$/i }));
}

describe('InterpretApplyPanel', () => {
  it('renders proposed ops with the protected marker + consent tick', async () => {
    interpret();
    await waitFor(() => screen.getByTestId('op-0'));
    expect(screen.getByTestId('op-3').textContent).toMatch(/protected/i);
    expect(screen.getByLabelText(/consent to the protected op seal_the_vault/i)).toBeTruthy();
  });

  it('applies accepted ops through the store verbs, surfaces unroutable + blocked, shows the receipt', async () => {
    interpret();
    await waitFor(() => screen.getByTestId('op-0'));
    // approve the canon_event, the party_impact, the unroutable op, and the protected op WITHOUT consent
    fireEvent.click(screen.getAllByRole('button', { name: /approve this op/i })[0]);
    fireEvent.click(screen.getAllByRole('button', { name: /approve this op/i })[1]);
    fireEvent.click(screen.getAllByRole('button', { name: /approve this op/i })[2]);
    fireEvent.click(screen.getAllByRole('button', { name: /approve this op/i })[3]);
    fireEvent.click(screen.getByRole('button', { name: /apply accepted ops/i }));

    const res = await waitFor(() => screen.getByTestId('apply-result'));
    // op0 (canon) + op1 (party) applied; op2 unroutable; op3 blocked (no consent)
    expect(applyEventRef.fn).toHaveBeenCalledTimes(1);
    expect(partyRef.fn).toHaveBeenCalledTimes(1);
    expect(partyRef.fn).toHaveBeenCalledWith('camp-1', expect.objectContaining({ kind: 'name_attacker' }));
    expect(res.textContent).toMatch(/applied 2/i);
    expect(screen.getByTestId('apply-unroutable').textContent).toMatch(/mystery_op/);
    expect(res.textContent).toMatch(/1 blocked/i);
    // the reproducibility receipt
    const receipt = screen.getByTestId('surveyor-receipt');
    expect(receipt.textContent).toMatch(/engine gen-.*\/sim-/i);
    expect(receipt.textContent).toMatch(/seed-xyz/);
  });

  it('a consented protected op DOES apply', async () => {
    interpret();
    await waitFor(() => screen.getByTestId('op-3'));
    fireEvent.click(screen.getAllByRole('button', { name: /approve this op/i })[3]);
    fireEvent.click(screen.getByLabelText(/consent to the protected op seal_the_vault/i));
    fireEvent.click(screen.getByRole('button', { name: /apply accepted ops/i }));
    await waitFor(() => screen.getByTestId('apply-result'));
    // op3 is a canon_event → applyEvent runs for it
    expect(applyEventRef.fn).toHaveBeenCalledTimes(1);
    expect(screen.getByTestId('apply-result').textContent).toMatch(/applied 1/i);
  });

  it('shows the S1 money moment (interpret = 5 credits) and the §3d refusal', async () => {
    render(<InterpretApplyPanel />);
    expect(screen.getByText(/5 credits/i)).toBeTruthy();
    cleanup();
    compileRef.fn = vi.fn(async () => ({ ok: false, error: 'This capability is paused right now, so nothing was charged.', refusalClass: 'stage_disabled' }));
    interpret();
    const refusal = await waitFor(() => screen.getByTestId('surveyor-refusal'));
    expect(refusal.textContent).toMatch(/paused/i);
  });
});
