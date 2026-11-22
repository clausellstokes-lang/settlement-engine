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
 * Since the UX consolidation of 2026-10-30 (X-2) the hooks render only on the Plot
 * Hooks tab, so this pin asserts the Economics tab prints none of them and that the
 * collector feeding the Plot Hooks tab still strips the marker.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';

import { EconomicsTab } from '../../src/components/new/tabs/EconomicsTab.jsx';
import { collectPlotHooks } from '../../src/domain/dossier/plotHooks.js';

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

describe('Economic plot hooks have ONE home, the Plot Hooks collector (X-2), and the H2 marker stays stripped there', () => {
  it('the Economics tab no longer prints the hook or its section; the collector carries the stripped body', () => {
    // UX consolidation 2026-10-30 (RULINGS-CROSS X-2, RULINGS-T2 T2-7): the Economic Plot
    // Hooks section left the Economics tab — every hook was printed on two pages. The H2
    // pin moves with the hook to its one home: collectPlotHooks feeds the Plot Hooks tab.
    const settlement = settlementWithRawHook();
    render(<EconomicsTab settlement={settlement} />);
    // Liveness: the tab really rendered (its prosperity header) ...
    expect(screen.getByText('Struggling')).toBeTruthy();
    // ... and printed neither the section nor the hook body. // anchored: getByText('Struggling') above proves this render drew the tab
    expect(document.body.textContent).not.toMatch(/Economic Plot Hooks/);
    expect(document.body.textContent).not.toContain('The road trade route is cut off'); // anchored: same render as the liveness getByText above

    // The one home strips the authored marker and keeps the body.
    const texts = collectPlotHooks(settlement).map((h) => h.text);
    expect(texts.some((t) => t.includes('The road trade route is cut off. Famine threatens within weeks.'))).toBe(true);
    expect(texts.join(' ')).not.toContain('PLOT HOOK:'); // anchored: the toBe(true) above proves the body is in this list
  });
});
