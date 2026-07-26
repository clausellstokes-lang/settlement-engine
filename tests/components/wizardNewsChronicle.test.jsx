/** @vitest-environment jsdom */
/**
 * wizardNewsChronicle.test.jsx — Regional wave R1 pin (C3, UI half).
 *
 * Pins:
 *   • The paid chronicle button is disabled when the feed has no entries
 *     (no empty-grounded 2-credit generation).
 *   • Generation grounds on the latest tick that HAS entries — not the feed
 *     clock, which manual impact advances can run ahead — and the saved
 *     chronicle records that same tick.
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, cleanup, fireEvent, waitFor } from '@testing-library/react';

const requestSpy = vi.fn();
const analyticsSpy = vi.fn();
const storeState = vi.hoisted(() => ({ savedSettlements: [] }));
vi.mock('../../src/lib/campaignChronicle.js', () => ({
  requestCampaignChronicle: (...a) => requestSpy(...a),
}));
vi.mock('../../src/lib/analytics.js', () => ({
  EVENTS: { WIZARD_NEWS_PANEL_OPENED: 'wizard_news_panel_opened' },
  track: (...args) => analyticsSpy(...args),
}));

const appendSpy = vi.fn();
const setCreditSpy = vi.fn();
vi.mock('../../src/store/index.js', () => {
  storeState.appendCampaignChronicle = (...a) => appendSpy(...a);
  storeState.setCreditBalance = (...a) => setCreditSpy(...a);
  return { useStore: (selector) => selector(storeState) };
});

import WizardNewsPanel from '../../src/components/map/WizardNewsPanel.jsx';

function campaignWith(feed) {
  return { id: 'camp-1', name: 'Realm', settlementIds: [], wizardNews: feed };
}

const SKEWED_FEED = {
  currentTick: 9, // manual presses ran ahead; the newest entries sit at tick 4
  entries: [
    { id: 'e_major', tick: 4, scope: 'realm', significance: 'major', score: 90, headline: 'The Great Hunger grips the realm', kind: 'realm', severity: 0.8, settlementIds: [], reasons: [] },
    { id: 'e_old', tick: 2, scope: 'settlement', significance: 'notable', score: 20, headline: 'Old news', kind: 'applied', severity: 0.3, settlementIds: [], reasons: [] },
  ],
};

describe('WizardNewsPanel chronicle', () => {
  beforeEach(() => {
    requestSpy.mockReset();
    analyticsSpy.mockReset();
    appendSpy.mockReset();
    setCreditSpy.mockReset();
    storeState.savedSettlements = [];
  });

  afterEach(() => {
    cleanup();
  });

  it('disables the chronicle button when the feed has no entries', () => {
    render(<WizardNewsPanel campaign={campaignWith({ currentTick: 5, entries: [] })} />);
    const button = screen.getByRole('button', { name: /chronicle/i });
    expect(button.disabled).toBe(true);
  });

  it('addresses the panel-open event to the campaign subject', async () => {
    render(<WizardNewsPanel campaign={campaignWith({ currentTick: 5, entries: [] })} />);
    await waitFor(() => expect(analyticsSpy).toHaveBeenCalledWith(
      'wizard_news_panel_opened',
      { unread_count: 0, current_tick: 5 },
      { subjectId: 'camp-1' },
    ));
  });

  it('grounds the chronicle on the latest entry tick, not the skewed feed clock', async () => {
    requestSpy.mockResolvedValue({ chronicle: 'A season of hunger.', creditsRemaining: 3 });
    render(<WizardNewsPanel campaign={campaignWith(SKEWED_FEED)} />);
    const button = screen.getByRole('button', { name: /chronicle/i });
    expect(button.disabled).toBe(false);

    fireEvent.click(button);
    await waitFor(() => expect(appendSpy).toHaveBeenCalled());

    expect(requestSpy.mock.calls[0][0].tick).toBe(4);
    expect(appendSpy).toHaveBeenCalledWith('camp-1', { tick: 4, prose: 'A season of hunger.' });
    expect(setCreditSpy).toHaveBeenCalledWith(3);
  });

  it('includes a string-id save when campaign membership stores the numeric equivalent', async () => {
    storeState.savedSettlements = [{
      id: '7',
      name: 'Aldermoor',
      settlement: { name: 'Aldermoor' },
    }];
    requestSpy.mockResolvedValue({ chronicle: 'Aldermoor endures.', creditsRemaining: 2 });
    const campaign = { ...campaignWith(SKEWED_FEED), settlementIds: [7] };
    render(<WizardNewsPanel campaign={campaign} />);

    fireEvent.click(screen.getByRole('button', { name: /chronicle/i }));
    await waitFor(() => expect(requestSpy).toHaveBeenCalled());

    expect(requestSpy.mock.calls[0][0].snapshot.settlements).toEqual([{
      id: '7',
      name: 'Aldermoor',
      settlement: { name: 'Aldermoor' },
    }]);
  });

  // correctness-2: the paid Chronicle button must never stick busy forever.
  it('clears busy and surfaces an error when the request RESOLVES with { error }', async () => {
    requestSpy.mockResolvedValue({ error: 'Sign in to generate a chronicle' });
    render(<WizardNewsPanel campaign={campaignWith(SKEWED_FEED)} />);
    fireEvent.click(screen.getByRole('button', { name: /chronicle/i }));
    // the error surfaces...
    expect(await screen.findByText(/Sign in to generate a chronicle/i)).toBeTruthy();
    // ...and the button un-busies (label back to "Chronicle", enabled), never stuck on "Writing".
    const button = screen.getByRole('button', { name: /chronicle/i });
    expect(button.disabled).toBe(false);
    expect(appendSpy).not.toHaveBeenCalled();
  });

  it('clears busy and surfaces an error when the request REJECTS (throws)', async () => {
    requestSpy.mockRejectedValue(new Error('kaboom'));
    render(<WizardNewsPanel campaign={campaignWith(SKEWED_FEED)} />);
    fireEvent.click(screen.getByRole('button', { name: /chronicle/i }));
    // C2 (bar 18): the failure copy now speaks in the register (errors.chronicleFail).
    expect(await screen.findByText(/set down the pen/i)).toBeTruthy();
    const button = screen.getByRole('button', { name: /chronicle/i });
    expect(button.disabled).toBe(false);
    expect(appendSpy).not.toHaveBeenCalled();
  });
});
