/**
 * @vitest-environment jsdom
 *
 * tests/components/advanceChronicleSummary.test.jsx — Advance-scaling Stage 4: the
 * end-of-advance chronicle summary ("what unfolded over the {interval}"), reusing the
 * deterministic wizardNews/chronicle beats via buildChronicleGrounding. Pins:
 *   • a multi-tick advance (latest pulse interval = one_year) with major beats renders
 *     the summary card listing the major headlines.
 *   • FLAG-OFF: the summary does NOT render (the Chronicle is byte-unchanged off-flag).
 *   • a single-tick advance (one_week) renders no summary (self-gates).
 */

import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';

vi.mock('../../src/store/index.js', () => ({
  useStore: selector => selector({ setSelectedSettlementId: vi.fn() }),
}));

let multiTickOn = true;
vi.mock('../../src/lib/flags.js', () => ({
  flag: name => (name === 'advanceMultiTick' ? multiTickOn : false),
}));

import ChronicleScrollback from '../../src/components/map/ChronicleScrollback.jsx';

// A campaign whose latest pulse spanned a full year and whose wizardNews carries a
// major realm beat at that tick — so the grounding surfaces a major headline.
function yearCampaign() {
  return {
    id: 'camp-1',
    settlementIds: ['ashford'],
    wizardNews: {
      currentTick: 48,
      entries: [
        { tick: 48, headline: 'Ashford weathers a long siege', summary: 'The walls held.', scope: 'realm', significance: 'major', settlementIds: ['ashford'], reasons: [] },
      ],
    },
    worldState: {
      canonizedAt: '2026-01-01T00:00:00.000Z',
      tick: 48,
      calendar: { season: 'winter' },
      stressors: [],
      pulseHistory: [
        { tick: 48, interval: 'one_year', selectedCount: 2, headlines: [], settlementIds: ['ashford'] },
      ],
    },
  };
}

describe('ChronicleScrollback — Stage 4 interval summary', () => {
  beforeEach(() => { multiTickOn = true; });
  afterEach(cleanup);

  test('a multi-tick advance renders the "what unfolded over the year" summary', () => {
    render(<ChronicleScrollback campaign={yearCampaign()} nameFor={(id) => id} />);
    const summary = screen.getByTestId('interval-chronicle-summary');
    expect(summary).toBeTruthy();
    expect(summary.textContent).toMatch(/What unfolded over the year/);
    expect(screen.getByText('Ashford weathers a long siege')).toBeTruthy();
  });

  test('FLAG-OFF: the interval summary does NOT render', () => {
    multiTickOn = false;
    render(<ChronicleScrollback campaign={yearCampaign()} nameFor={(id) => id} />);
    expect(screen.queryByTestId('interval-chronicle-summary')).toBeNull();
  });

  test('a single-tick advance renders no interval summary', () => {
    const c = yearCampaign();
    c.worldState.pulseHistory = [{ tick: 1, interval: 'one_week', selectedCount: 1, headlines: [] }];
    c.wizardNews.entries = [{ tick: 1, headline: 'x', summary: '', scope: 'realm', significance: 'major', settlementIds: ['ashford'], reasons: [] }];
    c.worldState.tick = 1;
    render(<ChronicleScrollback campaign={c} nameFor={(id) => id} />);
    expect(screen.queryByTestId('interval-chronicle-summary')).toBeNull();
  });
});
