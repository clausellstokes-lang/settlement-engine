/**
 * @vitest-environment jsdom
 *
 * S4 CUSTOM CONTENT panel — render + flow. Pins: the §9 field labels (MECHANICAL/FLAVOR/
 * UNSUPPORTED) render, the honest unsupported list renders, the S1 money moment (cost +
 * balance + insufficient), the §3d kill-switch refusal renders verbatim, and per-item
 * approve → addCustomItem mint. The transport is mocked (no edge round-trip headless); the
 * PURE half reviewContentDraft runs for real, so the accept→mint mapping is really exercised.
 */
import { describe, it, expect, afterEach, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, cleanup, waitFor } from '@testing-library/react';

const { storeRef, compileRef, addRef } = vi.hoisted(() => ({
  storeRef: { current: {} },
  compileRef: { fn: null },
  addRef: { fn: null },
}));

vi.mock('../../src/store/index.js', () => ({ useStore: (selector) => selector(storeRef.current) }));
vi.mock('../../src/hooks/useRoute.js', () => ({ useRoute: () => ({ view: 'home', params: {} }) }));
vi.mock('../../src/lib/surveyorWrite.js', () => ({ compileCustomContent: (...a) => compileRef.fn(...a) }));

import CustomContentPanel from '../../src/components/surveyor/CustomContentPanel.jsx';

const DRAFT = {
  entries: [{
    bucket: 'institutions',
    entry: { name: 'The Ashford Ring', criticality: 'important', teleports: 'yes' },
    fieldLabels: [
      { field: 'name', kind: 'flavor' },
      { field: 'criticality', kind: 'mechanical' },
      { field: 'teleports', kind: 'unsupported' },
    ],
    label: 'inferred', rationale: 'You asked for a smuggling ring.', sourced: false,
  }],
  unsupported: [{ requested: 'grants flight', reason: 'unregistered_field' }],
};

beforeEach(() => {
  storeRef.current = { settlement: null, savedSettlements: [], campaigns: [], activeCampaignId: null,
    selectedSettlementId: null, activeSaveId: null, creditBalance: 20, addCustomItem: (...a) => addRef.fn(...a) };
  addRef.fn = vi.fn(() => undefined);
});
afterEach(() => { cleanup(); vi.clearAllMocks(); });

function fillAndDraft() {
  render(<CustomContentPanel />);
  fireEvent.change(screen.getByLabelText(/describe the custom content/i), { target: { value: 'a smuggling ring' } });
  fireEvent.click(screen.getByRole('button', { name: /draft it/i }));
}

describe('CustomContentPanel', () => {
  it('renders the §9 field labels and the honest unsupported list from a draft', async () => {
    compileRef.fn = vi.fn(async () => ({ ok: true, draft: DRAFT, musings: [], byok: false, earlyAccess: true }));
    fillAndDraft();
    await waitFor(() => screen.getByTestId('content-entry-0'));
    expect(screen.getByText('Mechanical')).toBeTruthy();
    expect(screen.getByText('Flavor')).toBeTruthy();
    // one on the unsupported field, one on the unsupported-list item
    expect(screen.getAllByText('Unsupported').length).toBeGreaterThanOrEqual(2);
    expect(screen.getByTestId('content-unsupported').textContent).toMatch(/grants flight/i);
  });

  it('shows the S1 money moment: cost + balance, and the insufficient state when short', () => {
    compileRef.fn = vi.fn(async () => ({ ok: true, draft: DRAFT }));
    render(<CustomContentPanel />);
    expect(screen.getByText(/6 credits/i)).toBeTruthy();
    expect(screen.getByText(/20 left/i)).toBeTruthy();
    expect(screen.queryByTestId('surveyor-insufficient')).toBeNull();
    cleanup();
    storeRef.current.creditBalance = 2;
    render(<CustomContentPanel />);
    expect(screen.getByTestId('surveyor-insufficient').textContent).toMatch(/not enough credits/i);
  });

  it('renders the §3d kill-switch refusal verbatim (paused stage)', async () => {
    compileRef.fn = vi.fn(async () => ({ ok: false, error: 'This capability is paused right now, so nothing was charged.', refusalClass: 'stage_disabled', doors: ['ask_readonly'] }));
    fillAndDraft();
    const refusal = await waitFor(() => screen.getByTestId('surveyor-refusal'));
    expect(refusal.textContent).toMatch(/paused/i);
    expect(refusal.textContent).toMatch(/nothing was charged/i);
  });

  it('mints only approved entries through addCustomItem (the pure review runs for real)', async () => {
    compileRef.fn = vi.fn(async () => ({ ok: true, draft: DRAFT }));
    fillAndDraft();
    await waitFor(() => screen.getByTestId('content-entry-0'));
    fireEvent.click(screen.getByRole('button', { name: /approve this entry/i }));
    fireEvent.click(screen.getByRole('button', { name: /add approved to my content/i }));
    await waitFor(() => screen.getByTestId('content-applied'));
    expect(addRef.fn).toHaveBeenCalledTimes(1);
    expect(addRef.fn).toHaveBeenCalledWith('institutions', expect.objectContaining({ name: 'The Ashford Ring' }));
    expect(screen.getByTestId('content-applied').textContent).toMatch(/added 1/i);
  });
});
