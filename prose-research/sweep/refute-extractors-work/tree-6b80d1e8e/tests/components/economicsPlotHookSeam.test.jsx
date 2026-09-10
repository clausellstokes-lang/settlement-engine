/** @vitest-environment jsdom */
/**
 * economicsPlotHookSeam.test.jsx - cold-review finding H2 render pin.
 *
 * EconomicsTab surfaced the Economic Plot Hooks section but rendered each hook's
 * text RAW - foodBalance.js bakes a leading ' PLOT HOOK: ' authoring marker into
 * every economic hook, so the DM read 'PLOT HOOK: The road trade route...' on the
 * dossier. The fix routes the hook text through the shared display chokepoint
 * (src/lib/proseSeams.js :: normalizePlotHook), which strips the marker.
 *
 * This pin renders the tab with a raw-marker hook, expands the (collapsed)
 * section, and asserts the reader sees the hook body with NO 'PLOT HOOK:' marker.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { render, screen, cleanup, fireEvent } from '@testing-library/react';

import { EconomicsTab } from '../../src/components/new/tabs/EconomicsTab.jsx';

afterEach(cleanup);

const RAW_HOOK = ' PLOT HOOK: The road trade route is cut off. Famine threatens within weeks.';

function settlementWithRawHook() {
  return {
    tier: 'town',
    economicState: {
      prosperity: 'Struggling',
      economicComplexity: 'Import-dependent',
      tradeAccess: 'road',
      activeChains: [],
      incomeSources: [],
      institutionalServices: [],
      compound: { economyOutput: 20 },
    },
    economicViability: {
      metrics: {},
      plotHooks: [{ category: 'Trade Disruption', hook: RAW_HOOK, severity: 'high' }],
    },
  };
}

describe('EconomicsTab - Economic Plot Hooks strip the authored PLOT HOOK marker (H2)', () => {
  it('renders the hook body without the raw " PLOT HOOK: " marker', () => {
    render(<EconomicsTab settlement={settlementWithRawHook()} />);

    // The section is collapsible + collapsed by default; expand it so the body
    // enters the DOM (a collapsed Section renders no children).
    fireEvent.click(screen.getByText(/Economic Plot Hooks \(1\)/));

    // The stripped hook body is shown to the DM...
    expect(screen.getByText(/The road trade route is cut off\. Famine threatens within weeks\./)).toBeTruthy();
    // ...and the raw authoring marker never reaches the reader surface. (The
    // section TITLE 'Economic Plot Hooks' has no colon, so this is unambiguous.)
    expect(document.body.textContent).not.toContain('PLOT HOOK:');
  });
});
