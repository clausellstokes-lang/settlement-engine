/** @vitest-environment jsdom */
import { afterEach, beforeAll, describe, expect, test } from 'vitest';
import { cleanup, render } from '@testing-library/react';

import SummaryTab from '../../src/components/new/SummaryTab.jsx';
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

describe('SummaryTab (UX Phase 2) — promoted state strip + self-gating War & Faith', () => {
  test('promotes the read-view 4-dim "state at a glance" strip into the Summary', () => {
    const { getByTestId } = render(<SummaryTab settlement={town} saveId={null} />);
    expect(getByTestId('read-system-state-bar')).toBeTruthy();
  });

  test('a peaceful, deity-free, non-campaign settlement renders NO War & Faith section', () => {
    const { queryByTestId } = render(<SummaryTab settlement={town} saveId={null} />);
    expect(queryByTestId('war-faith-section')).toBeNull();
  });

  test('a peaceful, never-advanced settlement renders NO "What changed" panel', () => {
    const { queryByTestId } = render(<SummaryTab settlement={town} saveId={null} />);
    expect(queryByTestId('what-changed-panel')).toBeNull();
  });

  test('an assigned-deity settlement DOES render the War & Faith section', () => {
    const deityTown = {
      ...town,
      config: { ...town.config, primaryDeitySnapshot: { name: 'Sol', rankAxis: 'major', alignmentAxis: 'good' } },
    };
    const { getByTestId } = render(<SummaryTab settlement={deityTown} saveId={null} />);
    expect(getByTestId('war-faith-section').textContent).toMatch(/Sol|Primary faith/);
  });
});
