/**
 * @vitest-environment jsdom
 *
 * economicsTabFlow.test.js — M6d FLOW-DERIVED ECONOMICS, the EconomicsTab thread.
 *
 * The tab reads the owning campaign's worldState from the store (the RumorsTab
 * store-selector pattern) and projects the arrivals tally through the marker-gated
 * selector. Proves:
 *   - DORMANT (no campaign / no tally) ⇒ the tab renders WITHOUT the "Live Trade
 *     Flow" section (byte-identical to today);
 *   - FLOW PRESENT (a campaign carrying a tradeFlow ledger) ⇒ the additive live-flow
 *     section renders BESIDE the generation baseline (which still renders).
 */
import React from 'react';
import { describe, test, expect, afterEach } from 'vitest';
import { render, cleanup } from '@testing-library/react';
import { EconomicsTab } from '../../src/components/new/tabs/EconomicsTab.jsx';
import { useStore } from '../../src/store/index.js';

const e = React.createElement;

const ECO = {
  prosperity: 'modest', economicComplexity: 'a market town', tradeAccess: 'road',
  primaryImports: ['Wrought iron'], primaryExports: ['Timber'],
  tradeDependencies: [{ resource: 'iron', severity: 'critical' }],
  activeChains: [], incomeSources: [],
};
const SETTLEMENT = { id: 'forge_town', name: 'Forge Town', economicState: ECO };

const initialCampaigns = useStore.getState().campaigns;
afterEach(() => {
  cleanup();
  useStore.setState({ campaigns: initialCampaigns });
});

describe('EconomicsTab M6d thread', () => {
  test('DORMANT: no campaign in the store ⇒ no Live Trade Flow section (baseline only)', () => {
    useStore.setState({ campaigns: [] });
    const { container } = render(e(EconomicsTab, { economicState: ECO, settlement: SETTLEMENT, saveId: 'forge_town' }));
    expect(container.textContent).not.toContain('Live Trade Flow');
    // The generation baseline still renders (prosperity header).
    expect(container.textContent).toContain('modest');
  });

  test('FLOW PRESENT: a campaign carrying a tradeFlow tally ⇒ the additive live-flow section renders', () => {
    useStore.setState({
      campaigns: [{
        id: 'c1', settlementIds: ['forge_town'],
        worldState: { tick: 6, spatialLedgers: { tradeFlow: { forge_town: { in: 2, out: 1, lastTick: 6 } } } },
      }],
    });
    const { container } = render(e(EconomicsTab, { economicState: ECO, settlement: SETTLEMENT, saveId: 'forge_town' }));
    expect(container.textContent).toContain('Live Trade Flow');
    // The generation baseline is UNTOUCHED beside it.
    expect(container.textContent).toContain('modest');
  });

  test('a CHOKED trade-dependent town surfaces the shortage reading', () => {
    useStore.setState({
      campaigns: [{
        id: 'c1', settlementIds: ['forge_town'],
        worldState: { tick: 6, spatialLedgers: { tradeFlow: { forge_town: { in: 0.1, out: 0.05, lastTick: 6 } } } },
      }],
    });
    const { container } = render(e(EconomicsTab, { economicState: ECO, settlement: SETTLEMENT, saveId: 'forge_town' }));
    expect(container.textContent).toContain('Trade choked');
  });

  test('does not throw when saveId is absent (falls back to settlement.id, no store campaign)', () => {
    useStore.setState({ campaigns: [] });
    expect(() => render(e(EconomicsTab, { economicState: ECO, settlement: SETTLEMENT }))).not.toThrow();
  });
});
