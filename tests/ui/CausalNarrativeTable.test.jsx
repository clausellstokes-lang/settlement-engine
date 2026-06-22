/**
 * @vitest-environment jsdom
 *
 * tests/ui/CausalNarrativeTable.test.jsx — Tier 5.7 surface tests.
 */

import { describe, test, expect, afterEach, vi } from 'vitest';
import { render, cleanup, fireEvent, screen } from '@testing-library/react';
import { CausalNarrativeTable } from '../../src/components/primitives/CausalNarrativeTable.jsx';

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

describe('CausalNarrativeTable — render gates', () => {
  test('renders a placeholder when settlement is missing', () => {
    render(<CausalNarrativeTable />);
    expect(screen.getByText(/No settlement loaded/i)).toBeTruthy();
  });

  test('renders the tab strip when settlement is present', () => {
    render(<CausalNarrativeTable settlement={fixture()} />);
    expect(screen.getByRole('tablist', { name: /Causal views/i })).toBeTruthy();
  });
});

describe('CausalNarrativeTable — tabs', () => {
  test('renders all seven view tabs', () => {
    render(<CausalNarrativeTable settlement={fixture()} />);
    const tabs = screen.getAllByRole('tab');
    expect(tabs.length).toBe(7);
  });

  test('defaults to the Narrative tab', () => {
    render(<CausalNarrativeTable settlement={fixture()} />);
    expect(screen.getByRole('tab', { name: /Narrative/i }).getAttribute('aria-selected')).toBe('true');
  });

  test('honors defaultView prop', () => {
    render(<CausalNarrativeTable settlement={fixture()} defaultView="faction" />);
    expect(screen.getByRole('tab', { name: /Faction/i }).getAttribute('aria-selected')).toBe('true');
  });

  test('clicking a tab flips aria-selected', () => {
    render(<CausalNarrativeTable settlement={fixture()} />);
    fireEvent.click(screen.getByRole('tab', { name: /Simulation/i }));
    expect(screen.getByRole('tab', { name: /Simulation/i }).getAttribute('aria-selected')).toBe('true');
    expect(screen.getByRole('tab', { name: /Narrative/i }).getAttribute('aria-selected')).toBe('false');
  });

  test('only the active tab is keyboard-focusable (roving tabindex)', () => {
    render(<CausalNarrativeTable settlement={fixture()} />);
    const active = screen.getByRole('tab', { name: /Narrative/i });
    const inactive = screen.getByRole('tab', { name: /Faction/i });
    expect(active.getAttribute('tabindex')).toBe('0');
    expect(inactive.getAttribute('tabindex')).toBe('-1');
  });

  test('onViewChange fires with the new view key when tab flips', () => {
    const onViewChange = vi.fn();
    render(<CausalNarrativeTable settlement={fixture()} onViewChange={onViewChange} />);
    fireEvent.click(screen.getByRole('tab', { name: /Timeline/i }));
    expect(onViewChange).toHaveBeenCalledWith('timeline');
  });
});

describe('CausalNarrativeTable — panel content', () => {
  test('the tabpanel maps to the active tab via aria-labelledby + id', () => {
    render(<CausalNarrativeTable settlement={fixture()} />);
    const panel = screen.getByRole('tabpanel');
    const labelledBy = panel.getAttribute('aria-labelledby');
    expect(labelledBy).toMatch(/causal-view-tab-narrative/);
  });

  test('view description renders in the panel', () => {
    render(<CausalNarrativeTable settlement={fixture()} />);
    // Narrative description mentions "spine"
    expect(screen.getByText(/spine that drives/i)).toBeTruthy();
  });

  test('flipping tabs swaps the description', () => {
    render(<CausalNarrativeTable settlement={fixture()} />);
    fireEvent.click(screen.getByRole('tab', { name: /Simulation/i }));
    expect(screen.getByText(/Structural read/i)).toBeTruthy();
  });

  test('Simulation tab renders Substrate variables section', () => {
    render(<CausalNarrativeTable settlement={fixture()} />);
    fireEvent.click(screen.getByRole('tab', { name: /Simulation/i }));
    // "Substrate variables" appears both as a summary line and the
    // section heading. Either is fine for this test.
    expect(screen.getAllByText(/Substrate variables/i).length).toBeGreaterThan(0);
  });

  test('Faction tab renders the Factions section', () => {
    render(<CausalNarrativeTable settlement={fixture()} />);
    fireEvent.click(screen.getByRole('tab', { name: /Faction/i }));
    expect(screen.getByText(/^Factions$/i)).toBeTruthy();
  });

  test('Faction tab lists the settlement\'s factions', () => {
    render(<CausalNarrativeTable settlement={fixture()} />);
    fireEvent.click(screen.getByRole('tab', { name: /Faction/i }));
    expect(screen.getByText('Guild')).toBeTruthy();
  });
});

describe('CausalNarrativeTable — defensive', () => {
  test('null settlement renders the placeholder, not a crash', () => {
    expect(() => render(<CausalNarrativeTable settlement={null} />)).not.toThrow();
    expect(screen.getByText(/No settlement loaded/i)).toBeTruthy();
  });

  test('a sparse settlement renders without throwing on any tab', () => {
    const sparse = { id: 's', name: 'Sparse', tier: 'village', population: 100 };
    render(<CausalNarrativeTable settlement={sparse} />);
    // Click every tab.
    for (const name of ['Simulation', 'Delta', 'Faction', 'Supply chain', 'Timeline', 'District']) {
      expect(() => {
        fireEvent.click(screen.getByRole('tab', { name: new RegExp(name, 'i') }));
      }).not.toThrow();
    }
  });
});

describe('CausalNarrativeTable — accessibility', () => {
  test('tablist has aria-label', () => {
    render(<CausalNarrativeTable settlement={fixture()} />);
    expect(screen.getByLabelText(/Causal views/i)).toBeTruthy();
  });

  test('every tab carries aria-controls pointing at the tabpanel', () => {
    render(<CausalNarrativeTable settlement={fixture()} />);
    for (const tab of screen.getAllByRole('tab')) {
      expect(tab.getAttribute('aria-controls')).toMatch(/^causal-view-panel-/);
    }
  });
});
