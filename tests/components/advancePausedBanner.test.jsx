/**
 * @vitest-environment jsdom
 *
 * tests/components/advancePausedBanner.test.jsx — Advance-scaling Stage 4 (b) + (e):
 * the PAUSED banner in WorldPulsePanel. Pins:
 *   (b) when getPausedAdvance is non-empty (a pausedAdvance cursor sits on worldState),
 *       the amber banner renders the batched majors and the Continue CTA wires
 *       resolveIntervalMajors with the DM's verdicts.
 *   (b2) toggling a major to Dismiss carries its 'dismissed' verdict into the call.
 *   (e) FLAG-OFF: the banner does NOT render even with a cursor present (byte-unchanged
 *       off-flag), and the rest of the panel is unaffected.
 *   a11y: the banner is announced as waiting-by-design (aria-label), not stuck.
 */

import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';

const actions = {
  applyWorldPulseProposal: vi.fn(),
  dismissWorldPulseProposal: vi.fn(),
  canonizeCampaignWorld: vi.fn(),
  recordPartyImpact: vi.fn(),
  resolveIntervalMajors: vi.fn(() => Promise.resolve({ status: 'complete' })),
  savedSettlements: [],
};
vi.mock('../../src/store/index.js', () => ({
  useStore: selector => selector(actions),
}));

let multiTickOn = true;
vi.mock('../../src/lib/flags.js', () => ({
  flag: name => (name === 'advanceMultiTick' ? multiTickOn : false),
}));

import WorldPulsePanel from '../../src/components/map/WorldPulsePanel.jsx';

function pausedCampaign() {
  return {
    id: 'camp-1',
    name: 'Realm',
    worldState: {
      canonizedAt: '2026-01-01T00:00:00.000Z',
      tick: 5,
      proposals: [],
      pulseHistory: [],
      pausedAdvance: {
        interval: 'one_year',
        ticksTotal: 48,
        ticksDone: 5,
        pendingMajors: [
          { id: 'major-coup', headline: 'A coup grips Ashford', summary: 'The reeve is deposed.', severity: 0.86, reasons: ['legitimacy collapse'] },
          { id: 'major-war', headline: 'Briarwatch marches on the river', summary: 'A siege begins.', severity: 0.74, reasons: ['rival mobilized'] },
        ],
      },
    },
  };
}

describe('WorldPulsePanel — Stage 4 PAUSED banner', () => {
  beforeEach(() => { multiTickOn = true; });
  afterEach(() => { cleanup(); vi.clearAllMocks(); });

  test('(b) renders the batched majors + the Continue CTA wires resolveIntervalMajors', async () => {
    render(<WorldPulsePanel campaign={pausedCampaign()} />);

    const banner = screen.getByTestId('advance-paused-banner');
    expect(banner).toBeTruthy();
    // Announced as waiting BY DESIGN, not stuck.
    expect(banner.getAttribute('aria-label')).toMatch(/waiting for your decisions/i);

    // Both batched majors render as decision cards.
    expect(screen.getByText('A coup grips Ashford')).toBeTruthy();
    expect(screen.getByText('Briarwatch marches on the river')).toBeTruthy();

    // The Continue CTA names the remaining work.
    const cta = screen.getByTitle('Apply your decisions and continue advancing the realm');
    expect(cta.textContent).toMatch(/Continue advancing \(43 of 48 remaining\)/);

    fireEvent.click(cta);
    await waitFor(() => {
      // Default (no toggles): every major resolves recommended → empty decisions map.
      expect(actions.resolveIntervalMajors).toHaveBeenCalledWith('camp-1', {});
    });
  });

  test('(b2) dismissing a major carries its verdict into resolveIntervalMajors', async () => {
    render(<WorldPulsePanel campaign={pausedCampaign()} />);

    // Each major card has a Dismiss toggle; dismiss the coup.
    const dismissButtons = screen.getAllByTitle('Dismiss this change');
    fireEvent.click(dismissButtons[0]);
    // The card now reads as dismissed.
    expect(screen.getByText('Dismissed, will not apply')).toBeTruthy();

    fireEvent.click(screen.getByTitle('Apply your decisions and continue advancing the realm'));
    await waitFor(() => {
      expect(actions.resolveIntervalMajors).toHaveBeenCalledWith('camp-1', {
        'major-coup': { decision: 'dismissed' },
      });
    });
  });

  test('(e) FLAG-OFF: the banner does NOT render even with a cursor present', () => {
    multiTickOn = false;
    render(<WorldPulsePanel campaign={pausedCampaign()} />);
    expect(screen.queryByTestId('advance-paused-banner')).toBeNull();
    // The rest of the panel is intact.
    expect(screen.getByText('World Pulse')).toBeTruthy();
  });
});
