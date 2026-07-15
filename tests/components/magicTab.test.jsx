/** @vitest-environment jsdom */
import { afterEach, describe, expect, test } from 'vitest';
import { cleanup, render } from '@testing-library/react';

import MagicTab from '../../src/components/new/tabs/MagicTab.jsx';
import { deriveMagicPosture } from '../../src/domain/display/dossierViewModel.js';

afterEach(cleanup);

const liveMagicTown = {
  id: 'm1',
  name: 'Spireholt',
  population: 4000,
  config: { magicExists: true, magicLevel: 'high' },
  institutions: [{ name: "Wizard's Tower", category: 'Magic' }],
  powerStructure: { factions: [{ faction: 'Mages', archetype: 'arcane', power: 50 }] },
  economicState: {},
};

const deadMagicTown = {
  id: 'm2',
  name: 'Dustfall',
  population: 600,
  config: { magicExists: false },
  institutions: [],
  powerStructure: { factions: [] },
  economicState: {},
};

const majorDeityTown = {
  ...liveMagicTown,
  config: {
    magicExists: true,
    magicLevel: 'high',
    primaryDeitySnapshot: { name: 'Orthos', rankAxis: 'major', alignmentAxis: 'evil', temperamentAxis: 'warlike' },
  },
};

describe('MagicTab — the 10-facet magic profile', () => {
  test('renders the 6 envelope facets and 4 role lines for a live-magic settlement', () => {
    const { getByTestId, container } = render(<MagicTab settlement={liveMagicTown} />);
    expect(getByTestId('magic-tab')).toBeTruthy();
    // 6 envelope facets.
    expect(container.querySelectorAll('[data-facet]')).toHaveLength(6);
    // 4 role lines.
    expect(container.querySelectorAll('[data-role-line]')).toHaveLength(4);
    // The display string matches the read-model verbatim.
    const posture = deriveMagicPosture(liveMagicTown);
    expect(container.textContent).toContain(posture.display);
  });

  test('a dead-magic world says so and shows no envelope/roles', () => {
    const { container } = render(<MagicTab settlement={deadMagicTown} />);
    expect(container.textContent).toMatch(/Magic does not function/i);
    expect(container.querySelectorAll('[data-facet]')).toHaveLength(0);
  });

  test('a MAJOR patron deity surfaces the deity⇄magic-legality coupling', () => {
    const { getByTestId } = render(<MagicTab settlement={majorDeityTown} />);
    const coupling = getByTestId('magic-deity-coupling');
    expect(coupling.textContent).toMatch(/Orthos/);
    expect(coupling.textContent).toMatch(/magic legality/i);
  });

  test('a minor/cult deity does NOT surface the coupling (only a major regulates)', () => {
    const minorTown = { ...liveMagicTown, config: { ...liveMagicTown.config, primaryDeitySnapshot: { name: 'Faye', rankAxis: 'minor' } } };
    const { queryByTestId } = render(<MagicTab settlement={minorTown} />);
    expect(queryByTestId('magic-deity-coupling')).toBeNull();
  });
});
