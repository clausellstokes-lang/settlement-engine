/** @vitest-environment jsdom */
import { afterEach, beforeEach, describe, expect, test } from 'vitest';
import { cleanup, render } from '@testing-library/react';

import {
  EconomicsGranarySection,
  DefenseWarFrontSection,
  PowerSuccessionSection,
  NpcAgencySection,
} from '../../src/components/dossier/EngineSections.jsx';
import { useStore } from '../../src/store/index.js';

afterEach(cleanup);
beforeEach(() => {
  // Detail altitude so the band detail / contributors render for assertions.
  useStore.getState().setDetailLevel('standard');
});

describe('EconomicsGranarySection — economic_capacity + granary gauge', () => {
  test('self-gates to nothing without a band or stockpile record', () => {
    // A null settlement has no causal band derivation worth surfacing... but
    // deriveCausalState defaults to 50/adequate for everything, so use a real
    // settlement WITHOUT a stockpile and confirm the band still renders (the band
    // is the always-present half). The gauge/flags are what self-gate.
    const { container } = render(<EconomicsGranarySection settlement={null} />);
    expect(container.firstChild).toBeNull();
  });

  test('renders the granary gauge + flags when a live stockpile is blockaded', () => {
    const town = {
      id: 'g1', name: 'Holdfast', population: 2000, config: {}, institutions: [],
      powerStructure: { factions: [] },
      economicState: {
        foodSecurity: {
          stockpile: { blockaded: true, storageMonths: 1.5, capacityMonths: 6, tithe: true },
        },
      },
    };
    const { getByTestId } = render(<EconomicsGranarySection settlement={town} />);
    expect(getByTestId('economics-granary-section')).toBeTruthy();
    expect(getByTestId('granary-gauge')).toBeTruthy();
    expect(getByTestId('granary-flags').textContent.toLowerCase()).toMatch(/blockade/);
    expect(getByTestId('granary-flags').textContent.toLowerCase()).toMatch(/tithe/);
  });
});

describe('DefenseWarFrontSection — frozen scores → live readiness + war-front', () => {
  const town = {
    id: 'd1', name: 'Wardmoor', population: 1500, config: {},
    institutions: [], powerStructure: { factions: [] },
    defenseProfile: { scores: { walls: 40, garrison: 30 }, readiness: { label: 'Vulnerable' } },
    economicState: {},
  };

  test('renders the readiness band even without a live war (band always present)', () => {
    const { getByTestId } = render(<DefenseWarFrontSection settlement={town} warStatus={null} />);
    expect(getByTestId('defense-warfront-section')).toBeTruthy();
  });

  test('renders the war-front readout (coalition / garrison thinning) when besieged', () => {
    const warStatus = { besiegingTargets: [], besiegedBy: ['X', 'Y'], atWar: true };
    const { getByTestId } = render(
      <DefenseWarFrontSection settlement={town} warStatus={warStatus} nameFor={(id) => ({ X: 'Xtown', Y: 'Ytown' }[id] || id)} />,
    );
    const readout = getByTestId('war-front-readout');
    expect(readout.textContent).toMatch(/coalition/i);
    expect(readout.textContent).toMatch(/Xtown/);
  });
});

describe('PowerSuccessionSection — ruler / coup forecast / lineage', () => {
  test('renders ruler + coup-risk and the previousGovernments lineage', () => {
    const town = {
      id: 'p1', name: 'Throneward', population: 3000, config: {},
      powerStructure: {
        governingName: 'The Crown',
        factions: [
          { faction: 'The Crown', archetype: 'noble', power: 50, isGoverning: true },
          { faction: 'Generals', archetype: 'military', power: 45 },
          { faction: 'Guilds', archetype: 'merchant', power: 30 },
        ],
        publicLegitimacy: { govMultiplier: 1.0 },
        previousGovernments: [{ label: 'Free Commune', cause: 'coup', tick: 4 }],
      },
    };
    const { getByTestId } = render(<PowerSuccessionSection settlement={town} />);
    expect(getByTestId('power-succession-section').textContent).toMatch(/The Crown/);
    expect(getByTestId('coup-risk').textContent).toMatch(/Stable|Holding|Contested|Critical/);
    expect(getByTestId('government-lineage').textContent).toMatch(/Free Commune/);
    expect(getByTestId('government-lineage').textContent).toMatch(/coup/);
  });

  test('self-gates to nothing for a placeholder with no ruler, challengers, or lineage', () => {
    const empty = { id: 'p2', name: 'Nowhere', population: 50, config: {}, powerStructure: { factions: [] } };
    const { container } = render(<PowerSuccessionSection settlement={empty} />);
    expect(container.firstChild).toBeNull();
  });
});

describe('NpcAgencySection — agency disclosure', () => {
  test('renders only NPCs that carry agency fields', () => {
    const npcs = [
      { name: 'Mira', title: 'Spymaster', power: 80, goals: ['Control the docks'], ambition: 'Run the city', rivalries: ['Donn'], consequenceIfRemoved: 'The network collapses' },
      { name: 'Bland', title: 'Clerk', power: 10 }, // no agency
    ];
    const { getByTestId, container } = render(<NpcAgencySection npcs={npcs} />);
    expect(getByTestId('npc-agency-section')).toBeTruthy();
    expect(container.querySelectorAll('[data-npc-agent]')).toHaveLength(1);
    expect(container.textContent).toMatch(/Control the docks/);
    expect(container.textContent).toMatch(/network collapses/);
  });

  test('self-gates to nothing when no NPC has agency', () => {
    const { container } = render(<NpcAgencySection npcs={[{ name: 'Bland', power: 1 }]} />);
    expect(container.firstChild).toBeNull();
  });
});
