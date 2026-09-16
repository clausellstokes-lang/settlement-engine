/** @vitest-environment jsdom */
import { afterEach, describe, expect, test } from 'vitest';
import { cleanup, render } from '@testing-library/react';

import ReadSystemStateBar from '../../src/components/settlement/ReadSystemStateBar.jsx';

afterEach(cleanup);

const town = {
  id: 'r1', name: 'Glance', population: 1500, config: {},
  institutions: [{ name: 'Market' }],
  powerStructure: { factions: [{ faction: 'Council', archetype: 'government', power: 50 }] },
  economicState: { prosperity: 'moderate', safetyProfile: {} },
  activeConditions: [],
};

describe('ReadSystemStateBar — promoted read-view 4-dim strip', () => {
  test('derives the 4-dimension state from the settlement (no store needed)', () => {
    const { getByTestId } = render(<ReadSystemStateBar settlement={town} />);
    expect(getByTestId('read-system-state-bar')).toBeTruthy();
    // Four dimension rows render through the shared SystemStateGrid.
    expect(getByTestId('system-state-grid').textContent).toMatch(/Resilience/);
    expect(getByTestId('system-state-grid').textContent).toMatch(/Volatility/);
  });

  test('renders nothing for an absent settlement', () => {
    const { container } = render(<ReadSystemStateBar settlement={null} />);
    expect(container.firstChild).toBeNull();
  });

  // R-5b #22 — the honest-wiring escape hatch. The strip derives by default, so
  // on an advanced campaign save it can disagree with the store's LAYERED
  // systemState (authored per-event deltas move the store copy, not the
  // derivation). A caller that holds the layered copy passes it in and it wins
  // outright — pinned so the override cannot silently regress to a derivation.
  test('a supplied systemState overrides the derivation outright', () => {
    const layered = {
      resilience:       { value: 11, band: 'Critical', drivers: [], risks: [] },
      volatility:       { value: 22, band: 'Stable',   drivers: [], risks: [] },
      externalThreat:   { value: 33, band: 'Strained', drivers: [], risks: [] },
      resourcePressure: { value: 44, band: 'Stable',   drivers: [], risks: [] },
    };
    const { getByTestId } = render(
      <ReadSystemStateBar settlement={town} systemState={layered} />,
    );
    const text = getByTestId('system-state-grid').textContent;
    // The override's numbers, not the town's derived ones.
    expect(text).toMatch(/11/);
    expect(text).toMatch(/44/);
    expect(text).toMatch(/Critical/);
  });
});
