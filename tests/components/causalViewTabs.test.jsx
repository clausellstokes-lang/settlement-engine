/** @vitest-environment jsdom */
import { afterEach, describe, expect, test } from 'vitest';
import { cleanup, render } from '@testing-library/react';

import CausalViewTabs from '../../src/components/settlement/CausalViewTabs.jsx';
import { deriveCausalState, SYSTEM_VARIABLES } from '../../src/domain/causalState.js';

afterEach(cleanup);

// A settlement engineered to put several variables under pressure: a famine
// condition + no healing institutions + no factions, so the bands span the
// spectrum (some strained/critical, some adequate). This is a real causal-state
// fixture — we derive against the same engine the component does.
const pressuredSettlement = {
  id: 's1',
  name: 'Grimhold',
  population: 120,
  config: { tradeRouteAccess: 'isolated', magicLevel: 'low' },
  institutions: [],
  powerStructure: { factions: [] },
  economicState: {
    prosperity: 'struggling',
    foodSecurity: { deficitPct: 50 },
    safetyProfile: { blackMarketCapture: 70 },
  },
  activeConditions: [
    { archetype: 'famine', severity: 0.8, label: 'Famine', affectedSystems: ['food_security'] },
  ],
};

// A healthy settlement: no conditions, all variables in the adequate band (or
// better). Tuned so no var drifts strained — institutions/factions/NPCs/magic are
// all present, which is what the default-pessimistic substrate needs to read 50+.
const peacefulSettlement = {
  id: 's2',
  name: 'Calmwater',
  population: 1500,
  config: { magicLevel: 'high' },
  institutions: [
    { name: 'Temple of Healing' }, { name: 'House of Mercy' }, { name: 'Infirmary' },
    // A peaceful, well-ordered town keeps the peace through courts + a watch —
    // without these law_order would (correctly) read 'strained' (Phase B0).
    { name: 'Magistrate Court' }, { name: 'Town Watch' },
    ...Array.from({ length: 14 }, (_, i) => ({ name: `Guildhall ${i}` })),
  ],
  powerStructure: {
    factions: [
      { faction: 'Council', archetype: 'government', power: 50 },
      { faction: 'Temple', archetype: 'religious', power: 40 },
      { faction: 'Mages', archetype: 'arcane', power: 40 },
    ],
    governingName: 'Council',
    publicLegitimacy: { score: 60 },
  },
  npcs: [{ name: 'Mayor', rank: 'dominant', importance: 'pillar', notability: 3 }],
  economicState: { prosperity: 'moderate', primaryExports: ['grain'], safetyProfile: {} },
  activeConditions: [],
};

describe('CausalViewTabs — altitude-driven causal readout', () => {
  test('Overview (guided) renders nothing — the clean face', () => {
    const { container } = render(
      <CausalViewTabs settlement={pressuredSettlement} forceLevel="guided" />,
    );
    expect(container.querySelector('[data-testid="causal-view-tabs"]')).toBeNull();
  });

  test('renders nothing when there is no settlement', () => {
    const { container } = render(<CausalViewTabs settlement={null} forceLevel="expert" />);
    expect(container.firstChild).toBeNull();
  });

  test('Engine (expert) renders the FULL 16-variable grid', () => {
    const { container, getByTestId } = render(
      <CausalViewTabs settlement={pressuredSettlement} forceLevel="expert" />,
    );
    expect(getByTestId('causal-view-tabs')).toBeTruthy();
    const rows = container.querySelectorAll('[data-variable]');
    expect(rows).toHaveLength(SYSTEM_VARIABLES.length); // all 16
  });

  test('Engine altitude shows the Pressures section and the strength readout', () => {
    const { getByTestId, container } = render(
      <CausalViewTabs settlement={pressuredSettlement} forceLevel="expert" />,
    );
    expect(getByTestId('pressure-section')).toBeTruthy();
    // 9 pressure axes
    expect(container.querySelectorAll('[data-pressure]')).toHaveLength(9);
    expect(getByTestId('strength-readout').textContent).toMatch(/Strength \d+%/);
  });

  test('Detail (standard) shows ONLY the pressured variables (and no pressures/strength)', () => {
    const { container, queryByTestId } = render(
      <CausalViewTabs settlement={pressuredSettlement} forceLevel="standard" />,
    );
    const shown = [...container.querySelectorAll('[data-variable]')].map(el => el.getAttribute('data-variable'));
    expect(shown.length).toBeGreaterThan(0);
    expect(shown.length).toBeLessThan(SYSTEM_VARIABLES.length);

    // Cross-check against the engine: the shown rows are exactly the
    // strained/critical/collapsed bands.
    const state = deriveCausalState(pressuredSettlement);
    const pressured = SYSTEM_VARIABLES.filter(
      v => ['strained', 'critical', 'collapsed'].includes(state.bands[v]),
    );
    expect(new Set(shown)).toEqual(new Set(pressured));

    // Detail omits the engine-only sections.
    expect(queryByTestId('pressure-section')).toBeNull();
    expect(queryByTestId('strength-readout')).toBeNull();
  });

  test('pressured rows float to the top (polarity-aware sort) at Engine altitude', () => {
    const { container } = render(
      <CausalViewTabs settlement={pressuredSettlement} forceLevel="expert" />,
    );
    const bands = [...container.querySelectorAll('[data-variable] [data-band]')]
      .map(el => el.getAttribute('data-band'));
    // The first row's band must be at least as "pressured" as the last row's.
    const order = { collapsed: 0, critical: 1, strained: 2, adequate: 3, surplus: 4 };
    for (let i = 1; i < bands.length; i++) {
      expect(order[bands[i - 1]]).toBeLessThanOrEqual(order[bands[i]]);
    }
  });

  test('a peaceful settlement renders cleanly (empty pressured list at Detail)', () => {
    const { container } = render(
      <CausalViewTabs settlement={peacefulSettlement} forceLevel="standard" />,
    );
    // The shell renders, but the empty-state message stands in for the grid.
    expect(container.querySelector('[data-testid="causal-view-tabs"]')).toBeTruthy();
    expect(container.querySelector('[data-testid="causal-grid"]')).toBeNull();
    expect(container.textContent).toMatch(/within the adequate band/i);
  });

  test('a peaceful settlement at Engine still shows all 16 + pressures + strength', () => {
    const { container, getByTestId } = render(
      <CausalViewTabs settlement={peacefulSettlement} forceLevel="expert" />,
    );
    expect(container.querySelectorAll('[data-variable]')).toHaveLength(SYSTEM_VARIABLES.length);
    expect(getByTestId('strength-readout')).toBeTruthy();
  });
});
