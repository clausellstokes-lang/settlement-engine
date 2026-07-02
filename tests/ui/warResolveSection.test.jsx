/** @vitest-environment jsdom */
/**
 * tests/ui/warResolveSection.test.jsx — the War & Resolve surfacing tab (P5c).
 *
 * Renders the section directly (it is a plain default export; RealmInspector lazy-loads it
 * and gates it behind the warEconomySurfacing flag). Pins: a besieged settlement gets the
 * "Under siege" badge + a Resolve chip, the supply note reflects the bypass rule (a teleport
 * circle reads blockade-proof, NOT starving), and a peaceful realm reads calmly.
 */

import { describe, test, expect, afterEach } from 'vitest';
import { render, screen, cleanup, within } from '@testing-library/react';

import WarResolveSection from '../../src/components/map/WarResolveSection.jsx';

afterEach(cleanup);

function town(name, patch = {}) {
  return {
    name,
    tier: patch.tier || 'town',
    population: patch.population || 4000,
    config: { magicExists: true, government: 'Council', ...(patch.deity ? { primaryDeitySnapshot: patch.deity } : {}) },
    institutions: patch.institutions || [],
    economicState: { foodSecurity: patch.foodSecurity || { storageMonths: 6, deficitPct: 0 } },
    powerStructure: {
      publicLegitimacy: { score: patch.legitimacy ?? 60 },
      factions: [{ faction: 'Town Council', category: 'civic', power: 60, isGoverning: true }],
    },
    npcs: [{ id: `n_${name}`, name: `Reeve of ${name}`, importance: 'key' }],
  };
}

const nameById = new Map([['s1', 'Ravager'], ['s2', 'Aurelia']]);

// s1 (Ravager) besieges s2 (Aurelia); Aurelia holds a teleportation circle.
const siegeCampaign = {
  settlementIds: ['s1', 's2'],
  worldState: { deployments: { s1: { targetId: 's2', sinceTick: 2, role: 'siege' } }, warExhaustion: {} },
  regionalGraph: { channels: [{ type: 'war_front', from: 's1', to: 's2', status: 'confirmed' }] },
};
const siegeSaves = [
  { id: 's1', name: 'Ravager', settlement: town('Ravager', { tier: 'city', population: 30000 }) },
  { id: 's2', name: 'Aurelia', settlement: town('Aurelia', { institutions: [{ name: 'Teleportation Circle', status: 'active' }], foodSecurity: { storageMonths: 0.5, deficitPct: 40 } }) },
];

describe('WarResolveSection', () => {
  test('a besieged settlement shows the siege badge, a resolve chip, and the blockade-proof supply note', () => {
    render(<WarResolveSection campaign={siegeCampaign} saves={siegeSaves} nameById={nameById} />);
    // The besieged town is surfaced under "At war".
    expect(screen.getByText('At war')).toBeTruthy();
    expect(screen.getByText('Aurelia')).toBeTruthy();
    expect(screen.getByText('Under siege')).toBeTruthy();
    // Resolve is always surfaced; the supply note honours the teleport-circle bypass rule.
    expect(screen.getAllByText('Resolve').length).toBeGreaterThan(0);
    expect(screen.getByText(/blockade cannot touch/i)).toBeTruthy();
    // It names its besieger.
    expect(screen.getByText(/Besieged by Ravager/)).toBeTruthy();
  });

  test('the besieger is marked on campaign', () => {
    render(<WarResolveSection campaign={siegeCampaign} saves={siegeSaves} nameById={nameById} />);
    expect(screen.getByText('On campaign')).toBeTruthy();
  });

  test('a peaceful realm renders an At-peace section, no siege badge', () => {
    const peace = { settlementIds: ['a'], worldState: {}, regionalGraph: null };
    const saves = [{ id: 'a', name: 'Haven', settlement: town('Haven') }];
    render(<WarResolveSection campaign={peace} saves={saves} nameById={new Map([['a', 'Haven']])} />);
    expect(screen.getByText('At peace')).toBeTruthy();
    expect(screen.queryByText('Under siege')).toBeNull();
  });

  test('an empty roster renders the calm empty note (no crash)', () => {
    render(<WarResolveSection campaign={{ settlementIds: [] }} saves={[]} nameById={new Map()} />);
    expect(screen.getByText(/reads each settlement's morale/i)).toBeTruthy();
  });
});
