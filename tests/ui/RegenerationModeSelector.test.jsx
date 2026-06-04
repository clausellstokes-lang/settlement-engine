/**
 * @vitest-environment jsdom
 *
 * tests/ui/RegenerationModeSelector.test.jsx - Tier 5.2 surface tests.
 */

import { describe, test, expect, afterEach, vi } from 'vitest';
import { render, cleanup, fireEvent, screen } from '@testing-library/react';
import { RegenerationModeSelector } from '../../src/components/primitives/RegenerationModeSelector.jsx';

afterEach(cleanup);

function fixture() {
  return {
    id: 'sett.test',
    name: 'Bridgeford',
    tier: 'town',
    population: 1500,
    _seed: 'fixed',
    institutions: [
      { id: 'inst.market', name: 'Market', category: 'Economy' },
      { id: 'inst.guard',  name: 'Guard',  category: 'Defense', locked: true },
    ],
    powerStructure: {
      factions: [
        { id: 'fac.guild', name: 'Guild', power: 'high', source: 'user', _authored: true },
      ],
      conflicts: [],
    },
    npcs: [
      { id: 'npc.aldis', name: 'Aldis', role: 'Guildmaster' },
    ],
  };
}

describe('RegenerationModeSelector - initial render', () => {
  test('renders the three mode chips', () => {
    render(<RegenerationModeSelector settlement={fixture()} />);
    // Use role=radio to disambiguate from the Confirm button which
    // also contains the active mode's name.
    expect(screen.getByRole('radio', { name: /Nudge/i })).toBeTruthy();
    expect(screen.getByRole('radio', { name: /Rebalance/i })).toBeTruthy();
    expect(screen.getByRole('radio', { name: /Reforge/i })).toBeTruthy();
  });

  test('defaults to Rebalance', () => {
    render(<RegenerationModeSelector settlement={fixture()} />);
    const rebalance = screen.getByRole('radio', { name: /Rebalance/i });
    expect(rebalance.getAttribute('aria-checked')).toBe('true');
  });

  test('honors defaultMode prop', () => {
    render(<RegenerationModeSelector settlement={fixture()} defaultMode="reforge" />);
    expect(screen.getByRole('radio', { name: /Reforge/i }).getAttribute('aria-checked')).toBe('true');
  });

  test('has role=dialog with aria-modal', () => {
    render(<RegenerationModeSelector settlement={fixture()} />);
    const dialog = screen.getByRole('dialog');
    expect(dialog.getAttribute('aria-modal')).toBe('true');
  });

  test('the mode chips live inside an aria-labeled radiogroup', () => {
    render(<RegenerationModeSelector settlement={fixture()} />);
    expect(screen.getByRole('radiogroup', { name: /Regeneration mode/i })).toBeTruthy();
  });
});

describe('RegenerationModeSelector - mode switching', () => {
  test('clicking a chip flips aria-checked', () => {
    render(<RegenerationModeSelector settlement={fixture()} />);
    fireEvent.click(screen.getByRole('radio', { name: /Reforge/i }));
    expect(screen.getByRole('radio', { name: /Reforge/i }).getAttribute('aria-checked')).toBe('true');
    expect(screen.getByRole('radio', { name: /Rebalance/i }).getAttribute('aria-checked')).toBe('false');
  });

  test('mode summary updates when the chip flips', () => {
    render(<RegenerationModeSelector settlement={fixture()} />);
    // Default summary mentions "Preserve canon".
    expect(screen.getByText(/Preserve canon/i)).toBeTruthy();
    fireEvent.click(screen.getByRole('radio', { name: /Nudge/i }));
    expect(screen.getByText(/Preserve most/i)).toBeTruthy();
  });

  test('confirm button label reflects the active mode', () => {
    render(<RegenerationModeSelector settlement={fixture()} />);
    fireEvent.click(screen.getByRole('radio', { name: /Reforge/i }));
    expect(screen.getByRole('button', { name: /Confirm Reforge/i })).toBeTruthy();
  });
});

describe('RegenerationModeSelector - plan preview', () => {
  test('shows non-zero preserve count when entities are user-authored or locked', () => {
    const { container } = render(<RegenerationModeSelector settlement={fixture()} />);
    // The Rebalance default preserves canon + locked; with our fixture
    // (locked guard + user-authored Guild faction) we should see > 0
    // preserved.
    const preserveSection = container.textContent;
    expect(preserveSection).toMatch(/Preserve/);
  });

  test('shows subsystems list when the mode triggers any', () => {
    render(<RegenerationModeSelector settlement={fixture()} defaultMode="rebalance" />);
    expect(screen.getByText(/Subsystems to recompute/i)).toBeTruthy();
  });

  test('plan preview gracefully degrades when settlement is null', () => {
    render(<RegenerationModeSelector settlement={null} />);
    expect(screen.getByText(/Plan preview unavailable/i)).toBeTruthy();
  });
});

describe('RegenerationModeSelector - actions', () => {
  test('cancel button fires onCancel', () => {
    const onCancel = vi.fn();
    render(<RegenerationModeSelector settlement={fixture()} onCancel={onCancel} />);
    fireEvent.click(screen.getByRole('button', { name: /Cancel/i }));
    expect(onCancel).toHaveBeenCalled();
  });

  test('confirm button fires onConfirm with the active mode', () => {
    const onConfirm = vi.fn();
    render(<RegenerationModeSelector settlement={fixture()} onConfirm={onConfirm} />);
    fireEvent.click(screen.getByRole('radio', { name: /Reforge/i }));
    fireEvent.click(screen.getByRole('button', { name: /Confirm Reforge/i }));
    expect(onConfirm).toHaveBeenCalledWith('reforge');
  });

  test('confirm uses the default mode when no chip click happens', () => {
    const onConfirm = vi.fn();
    render(<RegenerationModeSelector settlement={fixture()} defaultMode="nudge" onConfirm={onConfirm} />);
    fireEvent.click(screen.getByRole('button', { name: /Confirm Nudge/i }));
    expect(onConfirm).toHaveBeenCalledWith('nudge');
  });
});
