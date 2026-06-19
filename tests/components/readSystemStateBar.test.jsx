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
});
