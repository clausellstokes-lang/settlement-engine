/** @vitest-environment jsdom */
/**
 * regionalGraphSummaryNoAdvance.test.jsx — LIBRARY-SIMPLE (2026-11-10), STOP-1 as ruled.
 *
 * The owner, verbatim: "I now want to simplify the library page. No longer does it
 * advance time. ... anything associated that is an independent campaign advance time
 * outside of the realm needs to be removed."
 *
 * "Between Your Towns" (mounted only in the Library's campaign folder) carried a "+1" /
 * "+3" pair that stepped a campaign's queued regional impacts forward on their own — an
 * independent advance of the campaign's clock outside the Realm. The Realm's own advance
 * matures regional impacts on every tick (applyWorldPulse.js, advanceRegionalImpacts),
 * so the act is not lost. This pins, over a campaign whose impact is still DELAYED (the
 * one state in which the pair rendered), that no step control renders, that the maturing
 * note keeps its sentence minus the clause pointing at the removed controls, and that
 * the impact row itself (apply / ignore) stays.
 */
import { describe, it, expect, afterEach, vi } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';

vi.mock('../../src/components/region/RegionalCausalChainViewer.jsx', () => ({
  default: () => null,
}));

import RegionalGraphSummary from '../../src/components/region/RegionalGraphSummary.jsx';

afterEach(cleanup);

function campaignWithDelayedImpact() {
  return {
    id: 'camp-delay',
    regionalGraph: {
      schemaVersion: 2,
      nodes: [
        { id: 's1', name: 'Alpha', settlementId: 's1' },
        { id: 's2', name: 'Beta', settlementId: 's2' },
      ],
      edges: [],
      channels: [],
      queuedImpacts: [{
        id: 'impact-1', kind: 'trade_disruption', status: 'queued', delayTicks: 2,
        targetSettlementId: 's2', sourceSettlementId: 's1', severity: 0.4,
        goods: [{ id: 'grain', label: 'Grain' }],
      }],
      eventLog: [],
      updatedAt: '2026-01-01T00:00:00.000Z',
    },
  };
}

describe('RegionalGraphSummary — no independent advance (owner, 2026-11-10)', () => {
  it('a delayed impact renders its row and no step control', () => {
    render(<RegionalGraphSummary campaign={campaignWithDelayedImpact()} settlementCount={2} />);
    // The keep-side: the delayed impact's own row and its two verbs.
    expect(screen.getByText(/Beta · trade disruption/)).toBeTruthy();
    expect(screen.getByRole('button', { name: /Delayed: matures in 2 ticks/ })).toBeTruthy();
    // The negative, by the removed controls' own anchors (their labels and titles).
    expect(screen.queryByRole('button', { name: '+1' })).toBeNull();
    expect(screen.queryByRole('button', { name: '+3' })).toBeNull();
    expect(screen.queryByTitle(/Advance regional impacts/)).toBeNull();
    // The maturing note keeps its sentence, minus the pointer to the removed controls.
    expect(screen.getByText(/· matures in 2 ticks/)).toBeTruthy();
    expect(screen.queryByText(/advance above to apply/)).toBeNull();
  });
});
