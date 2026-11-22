/** @vitest-environment jsdom */

import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { EconomicsTab } from '../../src/components/new/tabs/EconomicsTab.jsx';
import { buildViewModel } from '../../src/pdf/lib/viewModel.js';

afterEach(cleanup);

const customChains = [
  {
    chainId: 'custom.active',
    label: 'Ore to tools',
    resource: 'Ore',
    processingInstitutions: ['Forge'],
    outputs: ['Tools'],
    activation: { state: 'active', evaluatedTier: 'town', reasons: [] },
    tradeEndpoints: { exports: ['Tools'], imports: [], promoted: true },
  },
  {
    chainId: 'custom.blocked',
    label: 'Herbs to medicine',
    resource: 'Herbs',
    processingInstitutions: ['Apothecary'],
    outputs: ['Medicine'],
    activation: {
      state: 'blocked',
      evaluatedTier: 'town',
      reasons: [{
        code: 'not_materialized',
        component: 'Apothecary',
        kind: 'institution',
      }, {
        code: 'materialization_ambiguous',
        component: 'Twin Apothecary',
        kind: 'institution',
      }],
    },
    tradeEndpoints: { exports: ['Medicine'], imports: [], promoted: false },
  },
  {
    chainId: 'custom.ineligible',
    label: 'Sun ore to sunsteel',
    resource: 'Sun Ore',
    processingInstitutions: ['Sun Foundry'],
    outputs: ['Sunsteel'],
    activation: {
      state: 'ineligible',
      evaluatedTier: 'town',
      reasons: [{
        code: 'outside_tier',
        component: 'Sun Foundry',
        kind: 'institution',
        tierMin: 'city',
        tierMax: null,
      }],
    },
    tradeEndpoints: { exports: ['Sunsteel'], imports: [], promoted: false },
  },
];

function settlement() {
  return {
    tier: 'town',
    config: { tradeRouteAccess: 'road' },
    economicState: {
      prosperity: 'Comfortable',
      economicComplexity: 'Mixed economy',
      tradeAccess: 'road',
      activeChains: [],
      customChains,
      incomeSources: [],
      institutionalServices: [],
      primaryExports: ['Tools'],
      primaryImports: [],
      compound: { economyOutput: 50 },
    },
  };
}

describe('custom supply-chain runtime state presentation', () => {
  it('shows active, blocked, and ineligible states with player-safe reasons on screen', () => {
    render(<EconomicsTab settlement={settlement()} />);
    const toggle = screen.getByRole('button', {
      name: /Custom Supply Chains \(1 active · 2 unavailable\)/,
    });
    fireEvent.click(toggle);

    expect(screen.getByText('Active')).toBeTruthy();
    expect(screen.getByText('Blocked')).toBeTruthy();
    expect(screen.getByText('Ineligible')).toBeTruthy();
    expect(screen.getByText(/Apothecary did not materialize/)).toBeTruthy();
    expect(screen.getByText(/Twin Apothecary is present by name/)).toBeTruthy();
    expect(screen.getByText(/Sun Foundry requires a City-or-larger settlement/))
      .toBeTruthy();
  });

  it('carries the same bounded labels and reasons into the PDF view model', () => {
    const vm = buildViewModel({ settlement: settlement() });
    expect(vm.economics.customChains).toEqual([
      expect.objectContaining({
        name: 'Ore to tools',
        activationState: 'active',
        activationLabel: 'Active',
        activationReasons: [],
        tradePromoted: true,
      }),
      expect.objectContaining({
        name: 'Herbs to medicine',
        activationState: 'blocked',
        activationLabel: 'Blocked',
        activationReasons: [
          'Apothecary did not materialize in this generation.',
          'Twin Apothecary is present by name, but this settlement cannot prove it is the reviewed definition.',
        ],
        tradePromoted: false,
      }),
      expect.objectContaining({
        name: 'Sun ore to sunsteel',
        activationState: 'ineligible',
        activationLabel: 'Ineligible',
        activationReasons: ['Sun Foundry requires a City-or-larger settlement.'],
        tradePromoted: false,
      }),
    ]);
  });

  it('does not present legacy saved chains as running without activation evidence', () => {
    const legacy = settlement();
    legacy.economicState.customChains = [{
      label: 'Old reviewed chain',
      status: 'running',
    }];
    const vm = buildViewModel({ settlement: legacy });

    expect(vm.economics.customChains[0]).toMatchObject({
      activationState: 'unverified',
      activationLabel: 'Needs reevaluation',
      tradePromoted: false,
    });
  });
});
