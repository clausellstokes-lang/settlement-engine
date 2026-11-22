/** @vitest-environment jsdom */
/**
 * summaryTabPhase2.test.jsx — UX Phase 2 self-gating guarantees, repointed to the
 * dossier-keystone reality:
 *
 *   • WarFaithSection was re-homed out of the Summary into its own War & Faith
 *     sub-tab (WarFaithTab). The peaceful/deity-free self-gating guarantee is now
 *     pinned on the War tab.
 *   • The magazine Summary (SummaryTabV2) left the dossier with X-5 and was
 *     retired as dead code by lane WIRING-2 (2026-11-03, TRIM-2 request 5); its
 *     four render pins left with it. Its 4-dim read strip (ReadSystemStateBar)
 *     has no dossier mount since; that is recorded, not re-homed here.
 */
import { afterEach, beforeAll, describe, expect, test } from 'vitest';
import { cleanup, render } from '@testing-library/react';

import WarTab from '../../src/components/new/tabs/WarTab.jsx';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';

afterEach(cleanup);

let town;
beforeAll(() => {
  town = generateSettlementPipeline(
    { size: 'town', tradeRouteAccess: 'road' },
    null,
    { seed: 424242, customContent: {} },
  );
});

// LINEAGE NOTE (master merge W6): the assigned-deity War&Faith render test was
// removed — this lineage's WarFaithTab deliberately carries NO deity data (the
// fenced ungated-pantheon surface, plan fence-2).
describe('War & Faith (dossier keystone) — self-gating', () => {
  test('a peaceful, non-campaign settlement renders NO war block in the WAR tab (§805 split)', () => {
    const { queryByTestId, getByTestId } = render(<WarTab settlement={town} saveId={null} />);
    expect(getByTestId('war-tab')).toBeTruthy();
    expect(queryByTestId('war-block')).toBeNull();
  });
});
