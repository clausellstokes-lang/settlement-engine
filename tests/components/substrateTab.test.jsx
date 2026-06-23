/** @vitest-environment jsdom */
import { afterEach, describe, expect, test } from 'vitest';
import { cleanup, render, fireEvent } from '@testing-library/react';

import SubstrateTab from '../../src/components/new/tabs/SubstrateTab.jsx';
import { SYSTEM_VARIABLES } from '../../src/domain/causalState.js';

afterEach(cleanup);

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

// Click a segment label ('Overview' | 'Detail' | 'Engine') in the tab's LOCAL
// AltitudeControl.
function setLevel(container, label) {
  const btn = [...container.querySelectorAll('button')]
    .find(b => (b.textContent || '').trim() === label);
  if (btn) fireEvent.click(btn);
}

describe('SubstrateTab — local depth control (no global toggle)', () => {
  test('defaults to Detail: shows the causal grid, not the Overview hint', () => {
    const { container } = render(<SubstrateTab settlement={town} saveId="s1" />);
    expect(container.querySelector('[data-testid="causal-view-tabs"]')).toBeTruthy();
  });

  test('the local Overview segment shows the hint and hides the grid', () => {
    const { container } = render(<SubstrateTab settlement={town} saveId="s1" />);
    setLevel(container, 'Overview');
    expect(container.querySelector('[data-testid="causal-view-tabs"]')).toBeNull();
    expect(container.textContent).toMatch(/causal substrate/i);
  });

  test('the local Engine segment shows the full 15-var grid + pressures + strength', () => {
    const { container, getByTestId } = render(<SubstrateTab settlement={town} saveId="s1" />);
    setLevel(container, 'Engine');
    expect(getByTestId('causal-view-tabs')).toBeTruthy();
    expect(container.querySelectorAll('[data-variable]')).toHaveLength(SYSTEM_VARIABLES.length);
    expect(getByTestId('pressure-section')).toBeTruthy();
    expect(getByTestId('strength-readout')).toBeTruthy();
  });
});
