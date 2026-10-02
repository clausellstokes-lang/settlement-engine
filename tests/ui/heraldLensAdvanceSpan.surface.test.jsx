/** @vitest-environment jsdom */
/**
 * heraldLensAdvanceSpan.surface.test.jsx — FP-21 U1 at the DOOR: the Realm Inspector's
 * default lens, "This advance", shows every week of a one-month advance, and "Whole
 * campaign" adds the advance before it.
 *
 * The selector pins live in tests/components/heraldLensAdvanceSpan.test.js; this file drives
 * the same campaign through the real RealmInspector → HeraldBody → HeraldSection →
 * HeraldHeadline chain in jsdom, so what is counted is what a DM would see on the War door
 * (one `herald-headline` article per filed beat, and the door's "Since the last turning"
 * heading count). Before FP-21 this door showed one beat, the month's final week.
 */
import { afterEach, describe, expect, test, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react';

vi.mock('../../src/lib/flags.js', () => ({ flag: () => false }));

const storeState = { savedSettlements: [], setActivePricingMoment: vi.fn() };
vi.mock('../../src/store/index.js', () => {
  function useStore(selector) { return selector(storeState); }
  useStore.getState = () => storeState;
  useStore.subscribe = () => () => {};
  return { useStore };
});

// The War door's live blocks read war ledgers this campaign does not carry; they are not the
// surface under test, so they render nothing and the door body is the filed beats alone.
vi.mock('../../src/components/map/RealmDashboard.jsx', () => ({ default: () => null }));
vi.mock('../../src/components/map/LiveWarStatus.jsx', () => ({ default: () => null }));
vi.mock('../../src/components/map/RealmIntrigue.jsx', () => ({ default: () => null }));
vi.mock('../../src/components/map/BeliefDivergenceBand.jsx', () => ({ default: () => null }));
vi.mock('../../src/components/map/WarResolveSection.jsx', () => ({ default: () => null }));

import RealmInspector from '../../src/components/map/RealmInspector.jsx';
import { appendWizardNewsEntries } from '../../src/domain/region/wizardNews.js';

afterEach(cleanup);

const NOW = '2026-09-24T00:00:00.000Z';

/** One war-desk beat minted at `tick`. */
function raid(tick) {
  return {
    id: `wizard_news.${tick}.webwar_raid.a.v.b`,
    kind: 'webwar_raid',
    significance: 'notable',
    severity: 0.4,
    score: 40,
    tick,
    headline: `Aldermoor raids Irondell in week ${tick}`,
    summary: 'x',
    settlementIds: ['a', 'v', 'b'],
  };
}

/** The previous advance ended at tick 4; this one-month advance ran 5..8 (one record each). */
function monthCampaign() {
  return {
    id: 'lens-span',
    name: 'Lens Realm',
    settlementIds: ['a', 'v', 'b'],
    worldState: {
      tick: 8,
      pulseHistory: [4, 8].map((tick) => ({ tick, selectedOutcomes: [], impactDigest: [], resolvedStressors: [] })),
      stressors: [],
    },
    wizardNews: appendWizardNewsEntries({}, [4, 5, 6, 7, 8].map(raid), { now: NOW }),
  };
}

const baseProps = {
  open: true,
  section: 'war',
  onSection: () => {},
  onClose: () => {},
  canManageCampaigns: false,
  tier: 'free',
  inspectorSize: 'default',
  onSetSize: () => {},
};

/** The War door's filed beats, as the ticks their headlines carry. */
function shownWeeks() {
  return screen.queryAllByTestId('herald-headline')
    .map((node) => Number((node.textContent || '').match(/week (\d+)/)?.[1]))
    .sort((a, b) => a - b);
}

describe('FP-21 U1 — the War door under "This advance" shows the whole month', () => {
  test('the default lens files all four weeks of a one-month advance', async () => {
    render(<RealmInspector {...baseProps} campaign={monthCampaign()} />);
    await waitFor(() => expect(screen.getAllByTestId('herald-headline').length).toBeGreaterThan(0));
    expect(shownWeeks()).toEqual([5, 6, 7, 8]);
    const heading = screen.getByText('Since the last turning');
    expect(within(heading.parentElement).getByText('4')).toBeTruthy();
  });

  test('"Whole campaign" adds the previous advance\'s beat, and "This advance" takes it away again', async () => {
    render(<RealmInspector {...baseProps} campaign={monthCampaign()} />);
    await waitFor(() => expect(screen.getAllByTestId('herald-headline').length).toBeGreaterThan(0));
    fireEvent.click(screen.getByRole('button', { name: 'Whole campaign' }));
    await waitFor(() => expect(shownWeeks()).toEqual([4, 5, 6, 7, 8]));
    fireEvent.click(screen.getByRole('button', { name: 'This advance' }));
    await waitFor(() => expect(shownWeeks()).toEqual([5, 6, 7, 8]));
  });
});
