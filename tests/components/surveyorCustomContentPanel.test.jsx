/**
 * @vitest-environment jsdom
 *
 * S4 CUSTOM CONTENT panel — render + full controlled workflow. Pins the four
 * truth labels, typed review, honest unsupported list, money moment, graceful
 * refusal, and atomic approve → immutable command receipt.
 */
import { describe, it, expect, afterEach, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, cleanup, waitFor } from '@testing-library/react';

const { storeRef, compileRef, addRef, applyRef, previewRef } = vi.hoisted(() => ({
  storeRef: { current: {} },
  compileRef: { fn: null },
  addRef: { fn: null },
  applyRef: { fn: null },
  previewRef: { fn: null },
}));

vi.mock('../../src/store/index.js', () => ({ useStore: (selector) => selector(storeRef.current) }));
vi.mock('../../src/hooks/useRoute.js', () => ({ useRoute: () => ({ view: 'home', params: {} }) }));
vi.mock('../../src/lib/surveyorWrite.js', () => ({ compileCustomContent: (...a) => compileRef.fn(...a) }));
vi.mock('../../src/lib/customContentPreviewClient.js', () => ({
  runCustomContentPreview: (...a) => previewRef.fn(...a),
}));

import CustomContentPanel from '../../src/components/surveyor/CustomContentPanel.jsx';

const DRAFT = {
  entries: [{
    bucket: 'institutions',
    entry: { name: 'The Ashford Ring', essential: true },
    fieldLabels: [
      { field: 'name', kind: 'flavor' },
      { field: 'essential', kind: 'mechanical' },
    ],
    label: 'inferred', rationale: 'You asked for a smuggling ring.', sourced: false,
  }],
  unsupported: [{ requested: 'grants flight', reason: 'unregistered_field' }],
};

beforeEach(() => {
  storeRef.current = { settlement: null, savedSettlements: [], campaigns: [], activeCampaignId: null,
    selectedSettlementId: null, activeSaveId: null, creditBalance: 20,
    customContent: {},
    addCustomItem: (...a) => addRef.fn(...a),
    applyCustomContentCommand: (...a) => applyRef.fn(...a) };
  addRef.fn = vi.fn(() => undefined);
  applyRef.fn = vi.fn(async () => ({
    ok: true,
    status: 'applied',
    commandId: 'content-test-command',
    persistence: { state: 'confirmed' },
    result: { landed: 1 },
    perEntry: [{ ok: true, category: 'institutions' }],
  }));
  previewRef.fn = vi.fn(async () => ({
    seed: 'taste-gate',
    saved: false,
    diff: {
      scalarChanges: [],
      materialized: {
        institutions: [{ name: 'The Ashford Ring', localUid: 'preview-i' }],
        resources: [],
        services: [],
      },
      addedExports: [],
    },
    forced: [{ name: 'The Ashford Ring' }],
    dormant: [],
  }));
});
afterEach(() => { cleanup(); vi.clearAllMocks(); });

function fillAndDraft() {
  render(<CustomContentPanel />);
  fireEvent.change(screen.getByLabelText(/describe the custom content/i), { target: { value: 'a smuggling ring' } });
  fireEvent.click(screen.getByRole('button', { name: /draft it/i }));
}

async function inspectAndForgeSample() {
  fireEvent.click(screen.getByRole('button', { name: /inspect effect map/i }));
  fireEvent.click(screen.getByRole('button', { name: /forge unsaved sample/i }));
  await screen.findByTestId('content-sample-receipt');
}

describe('CustomContentPanel', () => {
  it('renders category-aware truth labels and the honest unsupported list', async () => {
    compileRef.fn = vi.fn(async () => ({ ok: true, draft: DRAFT, musings: [], byok: false, earlyAccess: true }));
    fillAndDraft();
    await waitFor(() => screen.getByTestId('content-entry-0'));
    expect(screen.getAllByText('Conditional').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Presentation').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Unsupported').length).toBeGreaterThanOrEqual(1);
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

  it('mints only approved entries through one atomic version command', async () => {
    compileRef.fn = vi.fn(async () => ({ ok: true, draft: DRAFT }));
    fillAndDraft();
    await waitFor(() => screen.getByTestId('content-entry-0'));
    fireEvent.click(screen.getByRole('button', { name: /approve this entry/i }));
    await inspectAndForgeSample();
    fireEvent.click(screen.getByRole('button', { name: /review approval/i }));
    fireEvent.click(await screen.findByRole('button', { name: /add approved to my content/i }));
    await waitFor(() => screen.getByTestId('content-applied'));
    expect(applyRef.fn).toHaveBeenCalledTimes(1);
    expect(applyRef.fn).toHaveBeenCalledWith(expect.objectContaining({
      kind: 'content.definition.create-revision',
      entries: [{
        category: 'institutions',
        item: expect.objectContaining({ name: 'The Ashford Ring' }),
      }],
      source: expect.objectContaining({ type: 'surveyor' }),
    }));
    expect(addRef.fn).not.toHaveBeenCalled();
    expect(screen.getByTestId('content-applied').textContent).toMatch(/added 1/i);
    expect(screen.getByTestId('content-applied').textContent).toMatch(/confirmed/i);
  });

  it('fails closed when the immutable command writer is unavailable', async () => {
    storeRef.current.applyCustomContentCommand = undefined;
    compileRef.fn = vi.fn(async () => ({ ok: true, draft: DRAFT }));
    fillAndDraft();
    await waitFor(() => screen.getByTestId('content-entry-0'));
    fireEvent.click(screen.getByRole('button', { name: /approve this entry/i }));
    await inspectAndForgeSample();
    fireEvent.click(screen.getByRole('button', { name: /review approval/i }));
    fireEvent.click(await screen.findByRole('button', {
      name: /add approved to my content/i,
    }));

    expect((await screen.findByRole('alert')).textContent)
      .toMatch(/immutable content writer is unavailable.*nothing was changed/i);
    expect(addRef.fn).not.toHaveBeenCalled();
  });

  it('reports an interrupted command as ambiguous instead of stranding approval', async () => {
    applyRef.fn = vi.fn(async () => {
      throw new Error('Connection closed before confirmation.');
    });
    compileRef.fn = vi.fn(async () => ({ ok: true, draft: DRAFT }));
    fillAndDraft();
    await waitFor(() => screen.getByTestId('content-entry-0'));
    fireEvent.click(screen.getByRole('button', { name: /approve this entry/i }));
    await inspectAndForgeSample();
    fireEvent.click(screen.getByRole('button', { name: /review approval/i }));
    fireEvent.click(await screen.findByRole('button', {
      name: /add approved to my content/i,
    }));

    const receipt = await screen.findByRole('alert');
    expect(receipt.textContent).toMatch(/confirmation was interrupted/i);
    expect(receipt.textContent).toMatch(/connection closed before confirmation/i);
    expect(screen.getByText(/step 7 of 7: receipt/i)).toBeTruthy();
  });

  it('preserves boolean field types while editing', async () => {
    compileRef.fn = vi.fn(async () => ({ ok: true, draft: DRAFT }));
    fillAndDraft();
    await waitFor(() => screen.getByTestId('content-entry-0'));
    fireEvent.click(screen.getByRole('button', { name: /edit this entry/i }));
    const control = screen.getByRole('checkbox', { name: /edit essential/i });
    expect(control.checked).toBe(true);
    fireEvent.click(control);
    await inspectAndForgeSample();
    fireEvent.click(screen.getByRole('button', { name: /review approval/i }));
    fireEvent.click(await screen.findByRole('button', { name: /add approved to my content/i }));
    await waitFor(() => expect(applyRef.fn).toHaveBeenCalled());
    expect(applyRef.fn.mock.calls[0][0].entries[0].item.essential).toBe(false);
  });

  it('forges an unsaved same-seed sample only when the author asks', async () => {
    const activeEnvironmentContent = {
      institutions: [{ name: 'Pinned Baseline Hall' }],
    };
    storeRef.current.customContent = {
      institutions: [{ name: 'Unpinned Author Head' }],
    };
    storeRef.current.activeContentEnvironmentContent =
      activeEnvironmentContent;
    compileRef.fn = vi.fn(async () => ({ ok: true, draft: DRAFT }));
    fillAndDraft();
    await waitFor(() => screen.getByTestId('content-entry-0'));
    fireEvent.click(screen.getByRole('button', { name: /approve this entry/i }));
    expect(previewRef.fn).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole('button', { name: /inspect effect map/i }));
    fireEvent.click(screen.getByRole('button', { name: /forge unsaved sample/i }));
    const receipt = await waitFor(() => screen.getByTestId('content-sample-receipt'));
    expect(receipt.textContent).toMatch(/did not alter your library/i);
    expect(receipt.textContent).toMatch(/The Ashford Ring/i);
    expect(previewRef.fn).toHaveBeenCalledTimes(1);
    expect(previewRef.fn.mock.calls[0][0].baseContent)
      .toBe(activeEnvironmentContent);
  });

  it('invalidates review evidence when an accepted field changes', async () => {
    compileRef.fn = vi.fn(async () => ({ ok: true, draft: DRAFT }));
    fillAndDraft();
    await waitFor(() => screen.getByTestId('content-entry-0'));
    fireEvent.click(screen.getByRole('button', { name: /approve this entry/i }));
    await inspectAndForgeSample();
    expect(screen.getByRole('button', { name: /review approval/i }).disabled)
      .toBe(false);

    fireEvent.click(screen.getByRole('button', { name: /edit this entry/i }));
    expect(screen.getByRole('button', { name: /review approval/i }).disabled)
      .toBe(true);
    expect(screen.queryByTestId('content-sample-receipt')).toBeNull();
  });

  it('invalidates a sample when the active environment baseline changes', async () => {
    const view = render(<CustomContentPanel />);
    compileRef.fn = vi.fn(async () => ({ ok: true, draft: DRAFT }));
    fireEvent.change(screen.getByLabelText(/describe the custom content/i), {
      target: { value: 'A covert ashford ring' },
    });
    fireEvent.click(screen.getByRole('button', { name: /draft it/i }));
    await waitFor(() => screen.getByTestId('content-entry-0'));
    fireEvent.click(screen.getByRole('button', { name: /approve this entry/i }));
    await inspectAndForgeSample();

    storeRef.current.activeContentEnvironmentContent = {
      institutions: [{ name: 'A newly activated baseline' }],
    };
    view.rerender(<CustomContentPanel />);

    await waitFor(() => {
      expect(screen.queryByTestId('content-sample-receipt')).toBeNull();
    });
    expect(screen.getByRole('button', { name: /forge unsaved sample/i }).disabled)
      .toBe(false);
  });

  it('does not let an invalid edited entry satisfy the sample gate', async () => {
    compileRef.fn = vi.fn(async () => ({ ok: true, draft: DRAFT }));
    fillAndDraft();
    await waitFor(() => screen.getByTestId('content-entry-0'));
    fireEvent.click(screen.getByRole('button', { name: /edit this entry/i }));
    fireEvent.change(screen.getByRole('textbox', { name: /edit name/i }), {
      target: { value: '' },
    });

    expect(screen.getByTestId('content-invalid-reviewed').textContent)
      .toMatch(/no longer pass.*registered content schema/i);
    expect(screen.getByRole('button', { name: /inspect effect map/i }).disabled)
      .toBe(true);
    expect(previewRef.fn).not.toHaveBeenCalled();
    expect(applyRef.fn).not.toHaveBeenCalled();
  });
});
