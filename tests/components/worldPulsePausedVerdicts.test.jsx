/**
 * @vitest-environment jsdom
 *
 * worldPulsePausedVerdicts.test.jsx — experience-product-fit-1: the paused advance
 * finally has a verdict surface. WorldPulsePanel renders each batched major as a
 * keep/dismiss card and resumes with the collected per-major verdicts (dismissed ⇒
 * { decision: 'dismissed' }; kept ⇒ absent ⇒ recommended), instead of the old
 * silent auto-resolve-to-defaults.
 */

import React from 'react';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';

// Heavy store-connected children are out of scope for this surface — stub to null.
vi.mock('../../src/components/map/RealmDocket.jsx', () => ({ default: () => null }));
vi.mock('../../src/components/map/RealmVerbComposer.jsx', () => ({ default: () => null }));
vi.mock('../../src/components/map/WhileYouWereAway.jsx', () => ({ default: () => null }));

let state;
vi.mock('../../src/store/index.js', () => {
  const useStore = (selector) => selector(state);
  useStore.getState = () => state;
  return { useStore };
});

import WorldPulsePanel from '../../src/components/map/WorldPulsePanel.jsx';

const resolveIntervalMajors = vi.fn(async () => ({ ok: true, status: 'complete' }));

function pausedCampaign(pendingMajors) {
  return {
    id: 'c1',
    worldState: {
      canonizedAt: '2026-07-16T00:00:00Z',
      pausedAdvance: { ticksTotal: 52, ticksDone: 10, pendingMajors },
      proposals: [], pulseHistory: [], simulationRules: {}, stressors: [],
    },
  };
}

beforeEach(() => {
  resolveIntervalMajors.mockClear();
  state = {
    applyWorldPulseProposal: vi.fn(), dismissWorldPulseProposal: vi.fn(),
    canonizeCampaignWorld: vi.fn(), recordPartyImpact: vi.fn(),
    resolveIntervalMajors, savedSettlements: [],
  };
});
afterEach(cleanup);

const MAJORS = [
  { id: 'm1', headline: 'Thornwall vassalizes Ashford', summary: 'A crown bows.', severity: 0.9 },
  { id: 'm2', headline: 'The Ember Rebellion rises', summary: 'Streets burn.', severity: 0.85 },
];

describe('WorldPulsePanel — paused-verdict surface', () => {
  test('renders each batched major as a decision card', () => {
    render(<WorldPulsePanel campaign={pausedCampaign(MAJORS)} />);
    const surface = screen.getByTestId('paused-verdict-surface');
    expect(surface.textContent).toContain('Thornwall vassalizes Ashford');
    expect(surface.textContent).toContain('The Ember Rebellion rises');
    expect(surface.textContent).toContain('2 major turns await your verdict');
  });

  test('resume with all kept sends an EMPTY decisions map (every major recommended)', async () => {
    render(<WorldPulsePanel campaign={pausedCampaign(MAJORS)} />);
    fireEvent.click(screen.getByText(/Resume with recommendations/));
    expect(resolveIntervalMajors).toHaveBeenCalledTimes(1);
    expect(resolveIntervalMajors).toHaveBeenCalledWith('c1', {});
  });

  test('dismissing a major sends only that id as { decision: "dismissed" }', async () => {
    render(<WorldPulsePanel campaign={pausedCampaign(MAJORS)} />);
    // Toggle the first major to dismissed (its Keep button flips to Dismissed).
    const keepButtons = screen.getAllByText('Keep');
    fireEvent.click(keepButtons[0]);
    // The resume label now reflects one dismissal.
    fireEvent.click(screen.getByText(/Resume with your verdicts \(1 dismissed\)/));
    expect(resolveIntervalMajors).toHaveBeenCalledWith('c1', { m1: { decision: 'dismissed' } });
  });
});
