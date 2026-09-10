/**
 * @vitest-environment jsdom
 *
 * S5/S6 CONSTRUCTION panel — render + flow. Pins: the config draft renders the config-wall
 * output (kept keys + dropped keys), declared constraints render, the DETERMINISTIC comparator
 * lists deviations honestly, the DELTA-ONLY revise pass carries the _noSlices marker (no
 * re-grounding), the S1 money moment, and the §3d refusal. The transport + the generators are
 * mocked; the config wall + the comparator + the revise decision run for real.
 */
import { describe, it, expect, afterEach, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, cleanup, waitFor } from '@testing-library/react';

const { storeRef, compileRef, reviseRef, saveRef } = vi.hoisted(() => ({
  storeRef: { current: {} }, compileRef: { fn: null }, reviseRef: { fn: null }, saveRef: { fn: null },
}));

vi.mock('../../src/store/index.js', () => ({ useStore: (selector) => selector(storeRef.current) }));
vi.mock('../../src/hooks/useRoute.js', () => ({ useRoute: () => ({ view: 'home', params: {} }) }));
vi.mock('../../src/lib/surveyorWrite.js', () => ({
  compileConstruction: (...a) => compileRef.fn(...a),
  reviseConstruction: (...a) => reviseRef.fn(...a),
}));
vi.mock('../../src/generators/generateSettlementPipeline.js', () => ({
  generateSettlementPipeline: () => ({ name: 'Draftholm', tier: 'town' }),
}));
// Controlled system state so the REAL comparator produces deterministic deviations.
vi.mock('../../src/domain/state/deriveSystemState.js', () => ({
  deriveSystemState: () => ({ resilience: { value: 20 }, volatility: { value: 80 }, externalThreat: { value: 50 }, resourcePressure: { value: 50 } }),
}));
vi.mock('../../src/lib/saves.js', () => ({ saves: { save: (...a) => saveRef.fn(...a) } }));

import ConstructionPanel from '../../src/components/surveyor/ConstructionPanel.jsx';

// raw config with one good key + one bogus key (dropped at the wall); constraints that will
// deviate from the controlled state (resilience target high but actual low; volatility target
// low but actual high).
const RAW = {
  rawConfig: { settType: 'town', population: 4200, notAKey: 'x' },
  rawConstraints: { resilience: 'high', volatility: 'low' },
  musings: [], byok: false, earlyAccess: true,
};

beforeEach(() => {
  storeRef.current = { settlement: null, savedSettlements: [], campaigns: [], activeCampaignId: null,
    selectedSettlementId: null, activeSaveId: null, creditBalance: 30,
    instantWorld: vi.fn(async () => ({ ok: true, campaignId: 'c1', settlementCount: 4 })), setActiveSaveId: vi.fn() };
  compileRef.fn = vi.fn(async () => ({ ok: true, ...RAW }));
  reviseRef.fn = vi.fn(async () => ({ ok: true, rawConfig: { settType: 'town', population: 4200 }, rawConstraints: { resilience: 'high', volatility: 'low' }, musings: [] }));
  saveRef.fn = vi.fn(async () => 'save-1');
});
afterEach(() => { cleanup(); vi.clearAllMocks(); });

function compile() {
  render(<ConstructionPanel />);
  fireEvent.change(screen.getByLabelText(/describe what the surveyor should build/i), { target: { value: 'a resilient fishing town' } });
  fireEvent.click(screen.getByRole('button', { name: /compile config/i }));
}

describe('ConstructionPanel', () => {
  it('renders the config draft (kept + dropped keys) and the declared constraints', async () => {
    compile();
    await waitFor(() => screen.getByTestId('construct-config'));
    expect(screen.getByTestId('construct-config').textContent).toMatch(/settType/);
    expect(screen.getByTestId('construct-config').textContent).toMatch(/population/);
    // the bogus key was dropped at the wall, listed honestly
    expect(screen.getByTestId('construct-unsupported').textContent).toMatch(/notAKey/);
    expect(screen.getByTestId('construct-constraints').textContent).toMatch(/resilience/i);
  });

  it('lists comparator deviations honestly after a deterministic generate', async () => {
    compile();
    await waitFor(() => screen.getByTestId('construct-config'));
    fireEvent.click(screen.getByRole('button', { name: /generate & compare/i }));
    const dev = await waitFor(() => screen.getByTestId('construct-deviations'));
    // resilience: actual low, asked high → "raise"; volatility: actual high, asked low → "lower"
    expect(dev.textContent).toMatch(/resilience/i);
    expect(dev.textContent).toMatch(/raise|lower/i);
  });

  it('a revise pass is DELTA-ONLY (the _noSlices marker is carried, no re-grounding)', async () => {
    compile();
    await waitFor(() => screen.getByTestId('construct-config'));
    fireEvent.click(screen.getByRole('button', { name: /generate & compare/i }));
    await waitFor(() => screen.getByTestId('construct-deviations'));
    fireEvent.click(screen.getByRole('button', { name: /revise \(delta-only\)/i }));
    await waitFor(() => expect(reviseRef.fn).toHaveBeenCalled());
    const arg = reviseRef.fn.mock.calls[0][0];
    expect(arg.payload._noSlices).toBe(true);
    expect(Array.isArray(arg.payload.deviations)).toBe(true);
    expect(arg.payload.config).toBeTruthy();
  });

  it('shows the S1 money moment and renders the §3d refusal verbatim', async () => {
    // settlement scope default = 6 credits
    render(<ConstructionPanel />);
    expect(screen.getByText(/6 credits/i)).toBeTruthy();
    cleanup();
    compileRef.fn = vi.fn(async () => ({ ok: false, error: 'This capability is paused right now, so nothing was charged.', refusalClass: 'stage_disabled' }));
    compile();
    const refusal = await waitFor(() => screen.getByTestId('surveyor-refusal'));
    expect(refusal.textContent).toMatch(/paused/i);
  });

  it('commits a settlement through the existing save path', async () => {
    compile();
    await waitFor(() => screen.getByTestId('construct-config'));
    fireEvent.click(screen.getByRole('button', { name: /generate & compare/i }));
    await waitFor(() => screen.getByTestId('construct-deviations'));
    fireEvent.click(screen.getByRole('button', { name: /create the settlement/i }));
    await waitFor(() => screen.getByTestId('construct-committed'));
    expect(saveRef.fn).toHaveBeenCalledTimes(1);
    expect(storeRef.current.setActiveSaveId).toHaveBeenCalledWith('save-1');
    expect(screen.getByTestId('construct-committed').textContent).toMatch(/draft save/i);
  });
});
