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
vi.mock('../../src/lib/campaignChronicle.js', () => ({
  requestCampaignChronicle: (...a) => requestSpy(...a),
}));

const appendSpy = vi.fn();
const setCreditSpy = vi.fn();
vi.mock('../../src/store/index.js', () => {
  const state = {
    savedSettlements: [],
    appendCampaignChronicle: (...a) => appendSpy(...a),
    setCreditBalance: (...a) => setCreditSpy(...a),
  };
  return { useStore: (selector) => selector(state) };
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
    appendSpy.mockReset();
    setCreditSpy.mockReset();
  });

  afterEach(() => {
    cleanup();
  });

  it('disables the chronicle button when the feed has no entries', () => {
    render(<WizardNewsPanel campaign={campaignWith({ currentTick: 5, entries: [] })} />);
    const button = screen.getByRole('button', { name: /chronicle/i });
    expect(button.disabled).toBe(true);
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
});
