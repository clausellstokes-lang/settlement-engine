/** @vitest-environment jsdom */
import { afterEach, beforeEach, describe, expect, test } from 'vitest';
import { cleanup, render } from '@testing-library/react';

import SubstrateTab from '../../src/components/new/tabs/SubstrateTab.jsx';
import { useStore } from '../../src/store/index.js';
import { DEFAULT_DETAIL_LEVEL } from '../../src/store/uiSlice.js';
import { SYSTEM_VARIABLES } from '../../src/domain/causalState.js';

afterEach(cleanup);
beforeEach(() => {
  useStore.getState().setDetailLevel(DEFAULT_DETAIL_LEVEL);
});

const town = {
  id: 's1',
  name: 'Grimhold',
  population: 120,
  config: { tradeRouteAccess: 'isolated' },
  institutions: [],
  powerStructure: { factions: [] },
  economicState: { foodSecurity: { deficitPct: 50 }, safetyProfile: {} },
  activeConditions: [{ archetype: 'famine', severity: 0.8, label: 'Famine', affectedSystems: ['food_security'] }],
};

describe('SubstrateTab — altitude-gated 15-var causal mount', () => {
  test('Overview (guided) shows the hint, NOT the 15-var grid', () => {
    useStore.getState().setDetailLevel('guided');
    const { container } = render(<SubstrateTab settlement={town} saveId="s1" />);
    expect(container.querySelector('[data-testid="causal-view-tabs"]')).toBeNull();
    expect(container.textContent).toMatch(/causal substrate/i);
  });

  test('Engine (expert) shows the full 15-var grid + pressures + strength', () => {
    useStore.getState().setDetailLevel('expert');
    const { container, getByTestId } = render(<SubstrateTab settlement={town} saveId="s1" />);
    expect(getByTestId('causal-view-tabs')).toBeTruthy();
    expect(container.querySelectorAll('[data-variable]')).toHaveLength(SYSTEM_VARIABLES.length);
    expect(getByTestId('pressure-section')).toBeTruthy();
    expect(getByTestId('strength-readout')).toBeTruthy();
  });
});
