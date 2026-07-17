/**
 * @vitest-environment jsdom
 *
 * STYLE OVERHAUL panel — render + flow. Pins: the candidate is projected through the REAL
 * validateBespokeStyle (rejected fields surface honestly), the live preview renders from the
 * read-only domain renderer, the base-lens flip-back is present, accept exercises the REAL
 * additive addBespokeStyle and surfaces the owner-gated persistence seam honestly, and the S1
 * money moment renders. The transport + the map renderer are mocked (no edge / no heavy draw).
 */
import { describe, it, expect, afterEach, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, cleanup, waitFor } from '@testing-library/react';

const { storeRef, compileRef } = vi.hoisted(() => ({ storeRef: { current: {} }, compileRef: { fn: null } }));

vi.mock('../../src/store/index.js', () => ({ useStore: (selector) => selector(storeRef.current) }));
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
  storeRef.current = { settlement: { id: 's1', name: 'Harborton', districts: [{}] }, savedSettlements: [],
    campaigns: [], activeCampaignId: null, selectedSettlementId: 's1', activeSaveId: 's1', creditBalance: 12 };
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

  it('accept saves additively for the session and surfaces the owner-gated persistence seam', async () => {
    compose();
    await waitFor(() => screen.getByTestId('style-preview'));
    fireEvent.change(screen.getByLabelText(/name this style/i), { target: { value: 'Moody Ink' } });
    fireEvent.click(screen.getByRole('button', { name: /accept & save/i }));
    const saved = await waitFor(() => screen.getByTestId('style-saved'));
    expect(saved.textContent).toMatch(/moody ink/i);
    expect(saved.textContent).toMatch(/base lenses stay permanent/i);
    expect(saved.textContent).toMatch(/durable save/i);
  });

  it('renders the §3d refusal verbatim when the edge declines', async () => {
    compileRef.fn = vi.fn(async () => ({ ok: false, error: 'The Surveyor declined this request.', refusalClass: null }));
    compose();
    const refusal = await waitFor(() => screen.getByTestId('surveyor-refusal'));
    expect(refusal.textContent).toMatch(/declined/i);
  });
});
