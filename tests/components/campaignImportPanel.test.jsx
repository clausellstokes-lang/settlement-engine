/** @vitest-environment jsdom */
/**
 * campaignImportPanel.test.jsx — V-17 THE CAMPAIGN IMPORT surface pins.
 *
 * The per-event confirmation gate as UI (commit disabled until a row is confirmed),
 * the commit calls the store action with source:'table' records, and the surface is
 * an accessible dialog. The 375px usability pin lives in the R-3 companion pass.
 */
import { afterEach, describe, expect, test, vi } from 'vitest';
import {
  cleanup, render, screen, fireEvent, waitFor,
} from '@testing-library/react';
import { ACCOUNT_EXPORT_VERSION } from '../../src/lib/accountData.js';

const importTableEvents = vi.fn(() => 1);
const storeState = {
  importTableEvents,
  auth: { user: null },
  campaigns: [],
  savedSettlements: [],
  executeImportReconciliationDraft: undefined,
};
vi.mock('../../src/store/index.js', () => {
  function useStore(selector) { return selector(storeState); }
  useStore.getState = () => storeState;
  return { useStore };
});

function installMatchMedia(matches = false) {
  window.matchMedia = vi.fn((query) => ({
    media: query, matches, addEventListener: () => {}, removeEventListener: () => {},
    addListener: () => {}, removeListener: () => {},
  }));
}

async function loadPanel() {
  vi.resetModules();
  return (await import('../../src/components/settlements/CampaignImportPanel.jsx')).default;
}

const campaign = {
  id: 'camp1',
  name: 'The Long Winter',
  settlementIds: [],
  worldState: { tick: 20 },
  wizardNews: { currentTick: 20 },
};
const settlements = [{ id: 'ashford', name: 'Ashford' }];

afterEach(() => {
  cleanup();
  localStorage.clear();
  storeState.auth = { user: null };
  storeState.campaigns = [];
  storeState.savedSettlements = [];
  storeState.executeImportReconciliationDraft = undefined;
});

describe('CampaignImportPanel', () => {
  test('is an accessible modal dialog with a clear, plain-language intro', async () => {
    installMatchMedia(false);
    const Panel = await loadPanel();
    render(<Panel campaign={campaign} settlements={settlements} onClose={() => {}} />);
    const dialog = screen.getByRole('dialog', { name: /bring your campaign/i });
    expect(dialog).toBeTruthy();
    // Clarity clause: the intro states plainly that nothing writes until confirmed.
    expect(screen.getByText(/Nothing is written until you say so/i)).toBeTruthy();
  });

  test('the confirmation gate: commit is disabled until an event is confirmed, then commits source:table records', async () => {
    installMatchMedia(false);
    importTableEvents.mockClear();
    const Panel = await loadPanel();
    render(<Panel campaign={campaign} settlements={settlements} onClose={() => {}} />);

    // Paste one note and read it.
    fireEvent.change(screen.getByLabelText(/Your campaign notes/i), { target: { value: 'A famine struck Ashford.' } });
    fireEvent.click(screen.getByRole('button', { name: /Read the notes/i }));

    // Review step: one row, commit disabled (nothing confirmed yet).
    const commitBtn = screen.getByRole('button', { name: /Add .* to the chronicle/i });
    expect(commitBtn.disabled).toBe(true);

    // Confirm the event → commit enables.
    fireEvent.click(screen.getByRole('button', { name: /Confirm this event/i }));
    const commitBtn2 = screen.getByRole('button', { name: /Add 1 event to the chronicle/i });
    expect(commitBtn2.disabled).toBe(false);

    // Commit → store action called with a source:'table' record at the chosen tick.
    fireEvent.click(commitBtn2);
    expect(importTableEvents).toHaveBeenCalledTimes(1);
    const [campId, records] = importTableEvents.mock.calls[0];
    expect(campId).toBe('camp1');
    expect(records).toHaveLength(1);
    expect(records[0].source).toBe('table');
    expect(records[0].kind).toBe('incident');
    expect(records[0].tick).toBe(20);

    // Done step confirms the outcome in plain, world-flavored language.
    expect(screen.getByText(/joined your chronicle/i)).toBeTruthy();
  });

  test('the fully-manual path: "add events by hand" opens review with a blank row', async () => {
    installMatchMedia(false);
    const Panel = await loadPanel();
    render(<Panel campaign={campaign} settlements={settlements} onClose={() => {}} />);
    fireEvent.click(screen.getByRole('button', { name: /add events by hand/i }));
    // A blank editable row is present (its kind selector defaults to Incident).
    expect(screen.getByRole('button', { name: /Confirm this event/i })).toBeTruthy();
  });

  test('reviews a structured export with explicit decisions and an honest no-write preview', async () => {
    installMatchMedia(false);
    importTableEvents.mockClear();
    storeState.savedSettlements = [
      { id: 'existing', name: 'Bellweather', settlement: { name: 'Bellweather' } },
    ];
    const Panel = await loadPanel();
    render(
      <Panel
        campaign={{ ...campaign, settlementIds: ['existing'] }}
        settlements={settlements}
        onClose={() => {}}
      />,
    );

    fireEvent.click(screen.getByRole('button', {
      name: /reconcile a SettlementForge export/i,
    }));
    expect(await screen.findByText(/file is reviewed locally first/i)).toBeTruthy();

    const file = new File([JSON.stringify({
      version: ACCOUNT_EXPORT_VERSION,
      settlements: [
        {
          id: 'new-save',
          name: 'Ashford',
          tier: 'town',
          settlement: { name: 'Ashford', tier: 'town', config: {} },
        },
        {
          id: 'existing',
          name: 'Bellweather',
          tier: 'town',
          settlement: { name: 'Bellweather', tier: 'town', config: {} },
        },
      ],
      campaigns: [],
    })], 'old-campaign.json', { type: 'application/json' });
    fireEvent.change(screen.getByLabelText(/SettlementForge export file/i), {
      target: { files: [file] },
    });

    const ashfordDecision = await screen.findByLabelText(/Decision for Ashford/i);
    const bellweatherDecision = screen.getByLabelText(/Decision for Bellweather/i);
    const previewButton = screen.getByRole('button', { name: /Preview exact changes/i });
    expect(previewButton.disabled).toBe(true);

    fireEvent.change(ashfordDecision, { target: { value: 'create' } });
    const matchOption = [...bellweatherDecision.options].find(option => (
      /Use Bellweather/i.test(option.textContent)
    ));
    fireEvent.change(bellweatherDecision, { target: { value: matchOption.value } });
    expect(screen.getByRole('button', { name: /Preview exact changes/i }).disabled)
      .toBe(false);

    fireEvent.click(screen.getByRole('button', { name: /Preview exact changes/i }));
    expect(screen.getByText(/No changes have been written yet/i)).toBeTruthy();
    expect(screen.getByText(/command adapter is not installed/i)).toBeTruthy();
    expect(screen.getByRole('button', { name: /Apply this reconciliation/i }).disabled)
      .toBe(true);
    expect(importTableEvents).not.toHaveBeenCalled();
  });

  test('surfaces an injected command adapter receipt without writing through the notes path', async () => {
    installMatchMedia(false);
    importTableEvents.mockClear();
    storeState.executeImportReconciliationDraft = vi.fn(async () => ({
      status: 'applied',
      ok: true,
      result: { saveId: 'created-save' },
    }));
    storeState.auth = { user: { id: 'owner-1' } };
    const Panel = await loadPanel();
    render(<Panel campaign={campaign} settlements={settlements} onClose={() => {}} />);

    fireEvent.click(screen.getByRole('button', {
      name: /reconcile a SettlementForge export/i,
    }));
    await screen.findByText(/file is reviewed locally first/i);
    const file = new File([JSON.stringify({
      version: ACCOUNT_EXPORT_VERSION,
      settlements: [{
        id: 'new-save',
        name: 'New Harbor',
        tier: 'town',
        settlement: { name: 'New Harbor', tier: 'town', config: {} },
      }],
      campaigns: [],
    })], 'one-settlement.json', { type: 'application/json' });
    fireEvent.change(screen.getByLabelText(/SettlementForge export file/i), {
      target: { files: [file] },
    });

    fireEvent.change(await screen.findByLabelText(/Decision for New Harbor/i), {
      target: { value: 'create' },
    });
    fireEvent.click(screen.getByRole('button', { name: /Preview exact changes/i }));
    fireEvent.click(screen.getByRole('button', { name: /Apply this reconciliation/i }));

    await waitFor(() => {
      expect(screen.getByText(/Reconciliation applied/i)).toBeTruthy();
    });
    expect(storeState.executeImportReconciliationDraft).toHaveBeenCalledTimes(1);
    expect(storeState.executeImportReconciliationDraft.mock.calls[0][0]).toMatchObject({
      kind: 'import.settlement.create-and-attach',
      executable: true,
    });
    expect(storeState.executeImportReconciliationDraft.mock.calls[0][1]).toMatchObject({
      importSessionId: expect.stringMatching(/^irs:/),
      sourceChecksum: expect.stringMatching(/^sf-import-v1:/),
      reconcileDurable: false,
    });
    expect(importTableEvents).not.toHaveBeenCalled();
  });

  test('holds an unknown outcome until the user explicitly checks durable authority', async () => {
    installMatchMedia(false);
    storeState.auth = { user: { id: 'owner-1' } };
    storeState.executeImportReconciliationDraft = vi.fn()
      .mockResolvedValueOnce({
        commandId: 'cmd:import-reconciliation:unknown',
        kind: 'import.settlement.create-and-attach',
        status: 'reconcile_required',
        ok: false,
        needsReconciliation: true,
      })
      .mockResolvedValueOnce({
        commandId: 'cmd:import-reconciliation:unknown',
        kind: 'import.settlement.create-and-attach',
        status: 'applied',
        ok: true,
        replayed: true,
      });
    const Panel = await loadPanel();
    render(<Panel campaign={campaign} settlements={settlements} onClose={() => {}} />);
    fireEvent.click(screen.getByRole('button', {
      name: /reconcile a SettlementForge export/i,
    }));
    const file = new File([JSON.stringify({
      version: ACCOUNT_EXPORT_VERSION,
      settlements: [{
        id: 'unknown-save',
        name: 'Unknown Harbor',
        tier: 'town',
        settlement: { name: 'Unknown Harbor', tier: 'town', config: {} },
      }],
      campaigns: [],
    })], 'unknown-outcome.json', { type: 'application/json' });
    fireEvent.change(await screen.findByLabelText(/SettlementForge export file/i), {
      target: { files: [file] },
    });
    fireEvent.change(await screen.findByLabelText(/Decision for Unknown Harbor/i), {
      target: { value: 'create' },
    });
    fireEvent.click(screen.getByRole('button', { name: /Preview exact changes/i }));
    fireEvent.click(screen.getByRole('button', { name: /Apply this reconciliation/i }));

    expect(await screen.findByText(/Reconciliation needs attention/i)).toBeTruthy();
    expect(screen.getByText(/bounded private recovery record/i)).toBeTruthy();
    fireEvent.click(screen.getByRole('button', {
      name: /Check 1 durable outcome/i,
    }));
    await waitFor(() => {
      expect(screen.getByText(/Reconciliation applied/i)).toBeTruthy();
    });
    expect(storeState.executeImportReconciliationDraft).toHaveBeenCalledTimes(2);
    expect(storeState.executeImportReconciliationDraft.mock.calls[1][1])
      .toMatchObject({ reconcileDurable: true });
  });
});
