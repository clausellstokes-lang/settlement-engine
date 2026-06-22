/** @vitest-environment jsdom */
/**
 * summaryTabPhase2.test.jsx — UX Phase 2 self-gating guarantees, repointed to the
 * dossier-keystone reality:
 *
 *   • The legacy single-column SummaryTab was deleted; SummaryTabV2 is the one
 *     Summary. The "What changed" deltas live in SummaryTabV2 and self-gate.
 *   • WarFaithSection was re-homed out of the Summary into its own War & Faith
 *     sub-tab (WarFaithTab). The peaceful/deity-free self-gating guarantee is now
 *     pinned on WarFaithTab.
 *   • The "state at a glance" 4-dim strip (ReadSystemStateBar) is no longer in the
 *     Summary; it moved to the editor Workshop, so that assertion is dropped here
 *     (the Workshop owns it; see workshop.test.jsx).
 */
import { afterEach, beforeAll, describe, expect, test } from 'vitest';
import { cleanup, render } from '@testing-library/react';

import SummaryTabV2 from '../../src/components/new/SummaryTabV2.jsx';
import WarFaithTab from '../../src/components/new/tabs/WarFaithTab.jsx';
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

describe('SummaryTabV2 + War & Faith (dossier keystone) — self-gating', () => {
  test('the one Summary renders for a generated town', () => {
    const { container } = render(<SummaryTabV2 settlement={town} />);
    expect(container.textContent).toMatch(/Tonight at the table|town in 4 sentences/);
  });

  test('a peaceful, never-advanced settlement renders NO "What changed" panel', () => {
    const { queryByTestId } = render(<SummaryTabV2 settlement={town} />);
    expect(queryByTestId('what-changed-panel')).toBeNull();
  });

  test('a peaceful, deity-free, non-campaign settlement renders NO War & Faith section', () => {
    const { queryByTestId } = render(<WarFaithTab settlement={town} saveId={null} />);
    expect(queryByTestId('war-faith-section')).toBeNull();
  });

  test('an assigned-deity settlement DOES render the War & Faith section', () => {
    const deityTown = {
      ...town,
      config: { ...town.config, primaryDeitySnapshot: { name: 'Sol', rankAxis: 'major', alignmentAxis: 'good' } },
    };
    const { getByTestId } = render(<WarFaithTab settlement={deityTown} saveId={null} />);
    expect(getByTestId('war-faith-section').textContent).toMatch(/Sol|Primary faith/);
  });
});
