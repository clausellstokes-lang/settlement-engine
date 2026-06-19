/** @vitest-environment jsdom */
import { afterEach, describe, expect, test } from 'vitest';
import { cleanup, render } from '@testing-library/react';

import WhatChangedPanel from '../../src/components/settlement/WhatChangedPanel.jsx';
import { deriveCausalState } from '../../src/domain/causalState.js';

afterEach(cleanup);

const before = {
  id: 'w1', name: 'Beforeton', population: 1000, config: {},
  institutions: [{ name: 'Temple of Healing' }],
  powerStructure: { factions: [{ faction: 'Council', archetype: 'government', power: 50 }] },
  economicState: { foodSecurity: { deficitPct: 0 } },
  activeConditions: [],
};
// The "after" world: a famine has struck, so food_security falls.
const after = {
  ...before,
  economicState: { foodSecurity: { deficitPct: 60 } },
  activeConditions: [{ archetype: 'famine', severity: 0.9, label: 'Famine', affectedSystems: ['food_security'] }],
};

describe('WhatChangedPanel — compareCausalState before→after + population arc', () => {
  test('self-gates to nothing without a prior snapshot or population arc', () => {
    const { container } = render(<WhatChangedPanel settlement={after} />);
    expect(container.firstChild).toBeNull();
  });

  test('renders the per-variable before→after diff when a prior snapshot is given', () => {
    const { getByTestId, container } = render(
      <WhatChangedPanel before={deriveCausalState(before)} after={deriveCausalState(after)} />,
    );
    expect(getByTestId('what-changed-panel')).toBeTruthy();
    // food_security moved — it must appear in the diff list.
    expect(container.querySelector('[data-variable="food_security"]')).toBeTruthy();
    expect(getByTestId('what-changed-list').textContent).toMatch(/Food security/);
  });

  test('derives before/after from priorSettlement + settlement props', () => {
    const { container } = render(<WhatChangedPanel priorSettlement={before} settlement={after} />);
    expect(container.querySelector('[data-testid="what-changed-panel"]')).toBeTruthy();
  });

  test('renders a population arc from populationHistory', () => {
    const { getByTestId } = render(
      <WhatChangedPanel
        before={deriveCausalState(before)} after={deriveCausalState(after)}
        populationHistory={[1000, 950, 900]}
      />,
    );
    expect(getByTestId('population-arc').textContent).toMatch(/1,000 → 900/);
    expect(getByTestId('population-arc').textContent).toMatch(/-100/);
  });
});
