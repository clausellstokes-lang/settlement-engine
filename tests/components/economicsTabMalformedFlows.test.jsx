/** @vitest-environment jsdom */
/**
 * economicsTabMalformedFlows.test.jsx — B12 finding #1 + #9 pins.
 *
 * #1 (HIGH): EconomicFlowsSection used to read `inc.source.toLowerCase()` and
 * `chain.label.split(' ')[0]` unguarded. A single income entry with a non-string
 * `source`, or a chain with no `label`, threw — and in the live generate flow
 * (OutputContainer renders renderTab with NO error boundary around it) that
 * white-screens the whole create view. These tests render the tab with exactly
 * those malformed shapes and assert it renders instead of throwing.
 *
 * #9 (LOW): the food-security "trade covers % of gap" readout divided by a falsy
 * rawDeficit and could render "NaN%". Pinned here: with importCoverage>0 and a
 * zero rawDeficit, the readout never contains "NaN".
 */

import { describe, it, expect, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import { EconomicsTab } from '../../src/components/new/tabs/EconomicsTab.jsx';

afterEach(cleanup);

/** Minimal settlement whose Economics tab exercises EconomicFlowsSection. */
function settlementWithFlows({ chains, incomeSources }) {
  return {
    tier: 'town',
    economicState: {
      prosperity: 'Comfortable',
      economicComplexity: 'Mixed economy',
      tradeAccess: 'road',
      activeChains: chains,
      incomeSources,
      institutionalServices: [],
      compound: { economyOutput: 50 },
    },
  };
}

describe('EconomicsTab EconomicFlowsSection — malformed entry resilience', () => {
  it('does not throw when an income source has a non-string source', () => {
    const settlement = settlementWithFlows({
      chains: [{
        status: 'running',
        label: 'Grain Milling',
        needIcon: '', needLabel: 'Food', needColor: '#1a5a28',
        resourceIcon: '', processingInstitutions: ['Mill'], outputs: ['flour'],
      }],
      // A malformed income entry: `source` is not a string. Pre-fix this threw
      // inside `.some(inc => inc.source.toLowerCase()...)`.
      incomeSources: [{ source: null, percentage: 10 }, { source: 42, percentage: 5 }],
    });
    expect(() => render(<EconomicsTab settlement={settlement} />)).not.toThrow();
    // The Economic Flows section header renders (it's a collapsed Section by
    // default with no impaired chains) — proving the section mounted without
    // throwing on the malformed income entry.
    expect(screen.getByText(/Economic Flows \(1 active/)).toBeTruthy();
  });

  it('does not throw when an active chain has no label', () => {
    const settlement = settlementWithFlows({
      // A chain with no label: pre-fix `chain.label.split(' ')` threw.
      chains: [{
        status: 'running',
        needIcon: '', needLabel: 'Food', needColor: '#1a5a28',
        resourceIcon: '', processingInstitutions: ['Mill'], outputs: ['flour'],
      }],
      incomeSources: [{ source: 'Milling', percentage: 20 }],
    });
    expect(() => render(<EconomicsTab settlement={settlement} />)).not.toThrow();
    // The Economic Flows section header renders with the active count.
    expect(screen.getByText(/Economic Flows \(1 active/)).toBeTruthy();
  });
});

describe('EconomicsTab Food Security — no NaN% in trade-coverage readout', () => {
  it('renders a finite "trade covers % of gap" when rawDeficit is zero', () => {
    const settlement = {
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
        metrics: {
          foodBalance: {
            dailyProduction: 800,
            dailyNeed: 1000,
            deficit: 200,
            surplus: 0,
            importCoverage: 200,
            rawDeficit: 0, // falsy denominator — pre-fix produced NaN%
            agricultureModifier: 1,
          },
        },
      },
    };
    const { container } = render(<EconomicsTab settlement={settlement} />);
    expect(container.textContent).not.toContain('NaN');
    expect(screen.getByText(/Trade covers \d+% of gap/)).toBeTruthy();
  });
});
