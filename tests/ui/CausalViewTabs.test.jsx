/**
 * @vitest-environment jsdom
 *
 * tests/ui/CausalViewTabs.test.jsx — Tier 5.7 surface tests.
 */

import { describe, test, expect, afterEach, vi } from 'vitest';
import { render, cleanup, fireEvent, screen } from '@testing-library/react';
import { CausalViewTabs } from '../../src/components/primitives/CausalViewTabs.jsx';

afterEach(cleanup);

function fixture() {
  return {
    id: 'sett.test',
    name: 'Bridgeford',
    tier: 'town',
    population: 1500,
    _seed: 'fixed',
    institutions: [{ id: 'inst.market', name: 'Market', category: 'Economy' }],
    powerStructure: {
      factions: [{ id: 'fac.guild', name: 'Guild', power: 'high', archetype: 'merchant' }],
      conflicts: [],
    },
    npcs: [],
    history: {
      historicalEvents: [{ name: 'Flood Year', description: 'River broke' }],
      currentTensions: [],
      founding: { reason: 'River ford' },
    },
  };
}

describe('CausalViewTabs — render gates', () => {
  test('renders a placeholder when settlement is missing', () => {
    render(<CausalViewTabs />);
    expect(screen.getByText(/No settlement loaded/i)).toBeTruthy();
  });

  test('renders the tab strip when settlement is present', () => {
    render(<CausalViewTabs settlement={fixture()} />);
    expect(screen.getByRole('tablist', { name: /Causal views/i })).toBeTruthy();
  });
});

describe('CausalViewTabs — tabs', () => {
  test('renders all seven view tabs', () => {
    render(<CausalViewTabs settlement={fixture()} />);
    const tabs = screen.getAllByRole('tab');
    expect(tabs.length).toBe(7);
  });

  test('defaults to the Narrative tab', () => {
    render(<CausalViewTabs settlement={fixture()} />);
    expect(screen.getByRole('tab', { name: /Narrative/i }).getAttribute('aria-selected')).toBe('true');
  });

  test('honors defaultView prop', () => {
    render(<CausalViewTabs settlement={fixture()} defaultView="faction" />);
    expect(screen.getByRole('tab', { name: /Faction/i }).getAttribute('aria-selected')).toBe('true');
  });

  test('clicking a tab flips aria-selected', () => {
    render(<CausalViewTabs settlement={fixture()} />);
    fireEvent.click(screen.getByRole('tab', { name: /Simulation/i }));
    expect(screen.getByRole('tab', { name: /Simulation/i }).getAttribute('aria-selected')).toBe('true');
    expect(screen.getByRole('tab', { name: /Narrative/i }).getAttribute('aria-selected')).toBe('false');
  });

  test('only the active tab is keyboard-focusable (roving tabindex)', () => {
    render(<CausalViewTabs settlement={fixture()} />);
    const active = screen.getByRole('tab', { name: /Narrative/i });
    const inactive = screen.getByRole('tab', { name: /Faction/i });
    expect(active.getAttribute('tabindex')).toBe('0');
    expect(inactive.getAttribute('tabindex')).toBe('-1');
  });

  test('onViewChange fires with the new view key when tab flips', () => {
    const onViewChange = vi.fn();
    render(<CausalViewTabs settlement={fixture()} onViewChange={onViewChange} />);
    fireEvent.click(screen.getByRole('tab', { name: /Timeline/i }));
    expect(onViewChange).toHaveBeenCalledWith('timeline');
  });
});

describe('CausalViewTabs — panel content', () => {
  test('the tabpanel maps to the active tab via aria-labelledby + id', () => {
    render(<CausalViewTabs settlement={fixture()} />);
    const panel = screen.getByRole('tabpanel');
    const labelledBy = panel.getAttribute('aria-labelledby');
    expect(labelledBy).toMatch(/causal-view-tab-narrative/);
  });

  test('view description renders in the panel', () => {
    render(<CausalViewTabs settlement={fixture()} />);
    // Narrative description mentions "spine"
    expect(screen.getByText(/spine that drives/i)).toBeTruthy();
  });

  test('flipping tabs swaps the description', () => {
    render(<CausalViewTabs settlement={fixture()} />);
    fireEvent.click(screen.getByRole('tab', { name: /Simulation/i }));
    expect(screen.getByText(/Structural read/i)).toBeTruthy();
  });

  test('Simulation tab renders Substrate variables section', () => {
    render(<CausalViewTabs settlement={fixture()} />);
    fireEvent.click(screen.getByRole('tab', { name: /Simulation/i }));
    // "Substrate variables" appears both as a summary line and the
    // section heading. Either is fine for this test.
    expect(screen.getAllByText(/Substrate variables/i).length).toBeGreaterThan(0);
  });

  test('Faction tab renders the Factions section', () => {
    render(<CausalViewTabs settlement={fixture()} />);
    fireEvent.click(screen.getByRole('tab', { name: /Faction/i }));
    expect(screen.getByText(/^Factions$/i)).toBeTruthy();
  });

  test('Faction tab lists the settlement\'s factions', () => {
    render(<CausalViewTabs settlement={fixture()} />);
    fireEvent.click(screen.getByRole('tab', { name: /Faction/i }));
    expect(screen.getByText('Guild')).toBeTruthy();
  });
});

describe('CausalViewTabs — defensive', () => {
  test('null settlement renders the placeholder, not a crash', () => {
    expect(() => render(<CausalViewTabs settlement={null} />)).not.toThrow();
    expect(screen.getByText(/No settlement loaded/i)).toBeTruthy();
  });

  test('a sparse settlement renders without throwing on any tab', () => {
    const sparse = { id: 's', name: 'Sparse', tier: 'village', population: 100 };
    render(<CausalViewTabs settlement={sparse} />);
    // Click every tab.
    for (const name of ['Simulation', 'Delta', 'Faction', 'Supply chain', 'Timeline', 'District']) {
      expect(() => {
        fireEvent.click(screen.getByRole('tab', { name: new RegExp(name, 'i') }));
      }).not.toThrow();
    }
  });
});

describe('CausalViewTabs — accessibility', () => {
  test('tablist has aria-label', () => {
    render(<CausalViewTabs settlement={fixture()} />);
    expect(screen.getByLabelText(/Causal views/i)).toBeTruthy();
  });

  test('every tab carries aria-controls pointing at the tabpanel', () => {
    render(<CausalViewTabs settlement={fixture()} />);
    for (const tab of screen.getAllByRole('tab')) {
      expect(tab.getAttribute('aria-controls')).toMatch(/^causal-view-panel-/);
    }
  });
});
