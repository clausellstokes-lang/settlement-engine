/**
 * @vitest-environment jsdom
 *
 * STYLE OVERHAUL panel — render + flow. Pins: the candidate is projected through the REAL
 * validateBespokeStyle (rejected fields surface honestly), the live preview renders from the
 * read-only domain renderer, the base-lens flip-back is present, accept exercises the REAL
 * additive addBespokeStyle AND persists it onto the settlement blob via applyMapEdit (durable),
 * an unsaved draft falls back to the honest save-first copy, and the S1 money moment renders.
 * The transport + the map renderer are mocked (no edge / no heavy draw).
 */
import { describe, it, expect, afterEach, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, cleanup, waitFor } from '@testing-library/react';

const { storeRef, compileRef, applyMapEditRef } = vi.hoisted(() => ({
  storeRef: { current: {} }, compileRef: { fn: null }, applyMapEditRef: { fn: null },
}));

vi.mock('../../src/store/index.js', () => {
  const useStore = (selector) => selector(storeRef.current);
  useStore.getState = () => storeRef.current;
  return { useStore };
});
vi.mock('../../src/hooks/useRoute.js', () => ({ useRoute: () => ({ view: 'dossier', params: {} }) }));
vi.mock('../../src/lib/surveyorWrite.js', () => ({ compileStyleOverhaul: (...a) => compileRef.fn(...a) }));
vi.mock('../../src/domain/townMap/index.js', () => ({
  TOWN_MAP_STYLE_IDS: ['parchment', 'watercolor', 'darkFantasy', 'vtt'],
  buildTownMapModel: () => ({ districts: [{ id: 'd0' }] }),
  buildTownMapSvg: () => '<svg width="10" height="10"></svg>',
  hasDrawableMap: () => true,
}));

import StyleOverhaulPanel from '../../src/components/surveyor/StyleOverhaulPanel.jsx';

// A candidate with an unknown field + a bogus furniture kind: the real wall keeps the known
// role fields and lists the rest as violations.
const CANDIDATE = { label: 'Ink', bogusField: 'nope', furniture: ['well', 'NOT_A_KIND'] };

beforeEach(() => {
  applyMapEditRef.fn = vi.fn();
  // s1 is a SAVED settlement (activeSaveId + present in savedSettlements) ⇒ a durable persist target.
  storeRef.current = {
    settlement: { id: 's1', name: 'Harborton', districts: [{}] },
    savedSettlements: [{ id: 's1', settlement: { id: 's1', name: 'Harborton', districts: [{}] } }],
    campaigns: [], activeCampaignId: null, selectedSettlementId: 's1', activeSaveId: 's1', creditBalance: 12,
    applyMapEdit: (...a) => applyMapEditRef.fn(...a),
  };
  compileRef.fn = vi.fn(async () => ({ ok: true, candidate: CANDIDATE, musings: [], byok: false, earlyAccess: true }));
});
afterEach(() => { cleanup(); vi.clearAllMocks(); });

function compose() {
  render(<StyleOverhaulPanel />);
  fireEvent.change(screen.getByLabelText(/describe the map style/i), { target: { value: 'a moody ink map' } });
  fireEvent.click(screen.getByRole('button', { name: /compose style/i }));
}

describe('StyleOverhaulPanel', () => {
  it('validates the candidate, previews it live, and lists rejected fields honestly', async () => {
    compose();
    await waitFor(() => screen.getByTestId('style-preview'));
    expect(screen.getByTestId('style-preview').innerHTML).toMatch(/<svg/i);
    // real validateBespokeStyle rejected the bogus field / furniture kind
    expect(screen.getByTestId('style-violations').textContent).toMatch(/bogusField|NOT_A_KIND/);
    // flip-back: base lenses are present as preview options
    expect(screen.getByRole('button', { name: /parchment/i })).toBeTruthy();
  });

  it('shows the S1 money moment (styleOverhaul = 3 credits)', () => {
    render(<StyleOverhaulPanel />);
    expect(screen.getByText(/3 credits/i)).toBeTruthy();
    expect(screen.getByText(/12 left/i)).toBeTruthy();
  });

  it('accept PERSISTS the bespoke style onto the settlement blob (durable) via applyMapEdit', async () => {
    compose();
    await waitFor(() => screen.getByTestId('style-preview'));
    fireEvent.change(screen.getByLabelText(/name this style/i), { target: { value: 'Moody Ink' } });
    fireEvent.click(screen.getByRole('button', { name: /accept & save/i }));
    const saved = await waitFor(() => screen.getByTestId('style-saved'));
    expect(saved.textContent).toMatch(/moody ink/i);
    expect(saved.textContent).toMatch(/stays across sessions/i);      // the honest "pending ruling" copy is dead
    expect(saved.textContent).toMatch(/base lenses stay permanent/i);
    // The REAL applyMapEdit persisted a container carrying the wall-validated style, keyed to s1.
    await waitFor(() => expect(applyMapEditRef.fn).toHaveBeenCalledTimes(1));
    const [id, container] = applyMapEditRef.fn.mock.calls[0];
    expect(id).toBe('s1');
    expect(container.bespokeStyles['moody-ink'].__resolved).toBe(true);
  });

  it('an unsaved draft (no saved target) shows the honest save-first copy and persists nothing', async () => {
    storeRef.current = { ...storeRef.current, savedSettlements: [], activeSaveId: null };
    compose();
    await waitFor(() => screen.getByTestId('style-preview'));
    fireEvent.change(screen.getByLabelText(/name this style/i), { target: { value: 'Draft Look' } });
    fireEvent.click(screen.getByRole('button', { name: /accept & save/i }));
    const saved = await waitFor(() => screen.getByTestId('style-saved'));
    expect(saved.textContent).toMatch(/save this settlement to your library/i);
    expect(applyMapEditRef.fn).not.toHaveBeenCalled();
  });

  it('renders the §3d refusal verbatim when the edge declines', async () => {
    compileRef.fn = vi.fn(async () => ({ ok: false, error: 'The Surveyor declined this request.', refusalClass: null }));
    compose();
    const refusal = await waitFor(() => screen.getByTestId('surveyor-refusal'));
    expect(refusal.textContent).toMatch(/declined/i);
  });
});
