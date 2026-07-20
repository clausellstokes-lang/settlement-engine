/** @vitest-environment jsdom */
/**
 * campaignImportPanel.test.jsx — V-17 THE CAMPAIGN IMPORT surface pins.
 *
 * The per-event confirmation gate as UI (commit disabled until a row is confirmed),
 * the commit calls the store action with source:'table' records, and the surface is
 * an accessible dialog. The 375px usability pin lives in the R-3 companion pass.
 */
import { afterEach, describe, expect, test, vi } from 'vitest';
import { cleanup, render, screen, fireEvent } from '@testing-library/react';

const importTableEvents = vi.fn(() => 1);
const storeState = { importTableEvents };
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

const campaign = { id: 'camp1', name: 'The Long Winter', worldState: { tick: 20 }, wizardNews: { currentTick: 20 } };
const settlements = [{ id: 'ashford', name: 'Ashford' }];

afterEach(cleanup);

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
});
