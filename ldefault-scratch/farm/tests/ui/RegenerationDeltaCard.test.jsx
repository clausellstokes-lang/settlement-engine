/**
 * @vitest-environment jsdom
 *
 * tests/ui/RegenerationDeltaCard.test.jsx — Tier 5.1 surface tests.
 *
 * Verifies the card:
 *   - Returns null when the delta is missing / empty
 *   - Renders every populated section with the right item counts
 *   - Dismiss + collapse handlers fire
 *   - Broken dependencies surface as a warning row
 *   - The summary lines appear when provided
 */

import { describe, test, expect, afterEach, vi } from 'vitest';
import { render, cleanup, fireEvent, screen } from '@testing-library/react';
import { RegenerationDeltaCard } from '../../src/components/primitives/RegenerationDeltaCard.jsx';

afterEach(cleanup);

function makeDelta(over = {}) {
  return {
    directEffects:      [],
    rippleEffects:      [],
    capacityShifts:     [],
    dailyLifeShifts:    [],
    preservedCanon:     [],
    brokenDependencies: [],
    newEntities:        [],
    removedEntities:    [],
    newOpportunities:   [],
    newRisks:           [],
    summary:            [],
    ...over,
  };
}

describe('RegenerationDeltaCard — render gates', () => {
  test('returns null when delta is missing', () => {
    const { container } = render(<RegenerationDeltaCard />);
    expect(container.firstChild).toBeNull();
  });

  test('returns null when every section is empty', () => {
    const { container } = render(<RegenerationDeltaCard delta={makeDelta()} />);
    expect(container.firstChild).toBeNull();
  });
});

describe('RegenerationDeltaCard — header + summary counts', () => {
  test('renders the header when at least one section has content', () => {
    const delta = makeDelta({
      directEffects: [{ label: 'food_security', before: 'adequate', after: 'strained' }],
    });
    render(<RegenerationDeltaCard delta={delta} />);
    expect(screen.getByText(/What changed in the rerun/i)).toBeTruthy();
    expect(screen.getByText(/1 direct/i)).toBeTruthy();
  });

  test('summary counts include every populated section', () => {
    const delta = makeDelta({
      directEffects: [{ label: 'x', before: 'a', after: 'b' }],
      rippleEffects: [{ variable: 'y', beforeBand: 'a', afterBand: 'b' }],
      capacityShifts: [{ capacity: 'z', beforeBand: 'a', afterBand: 'b' }],
      newEntities: [{ type: 'hook', label: 'Bread Riot' }],
    });
    const { container } = render(<RegenerationDeltaCard delta={delta} />);
    expect(container.textContent).toMatch(/1 direct/);
    expect(container.textContent).toMatch(/1 ripple/);
    expect(container.textContent).toMatch(/1 capacity/);
    expect(container.textContent).toMatch(/\+1/);
  });
});

describe('RegenerationDeltaCard — sections', () => {
  test('Direct effects section renders the label + band change', () => {
    const delta = makeDelta({
      directEffects: [{ label: 'food_security', before: 'adequate', after: 'strained' }],
    });
    render(<RegenerationDeltaCard delta={delta} />);
    expect(screen.getByText('food_security')).toBeTruthy();
    expect(screen.getByText('adequate → strained')).toBeTruthy();
  });

  test('Ripple effects section uses beforeBand/afterBand', () => {
    const delta = makeDelta({
      rippleEffects: [{ variable: 'public_legitimacy', beforeBand: 'adequate', afterBand: 'strained' }],
    });
    render(<RegenerationDeltaCard delta={delta} />);
    expect(screen.getByText('public_legitimacy')).toBeTruthy();
    expect(screen.getByText('adequate → strained')).toBeTruthy();
  });

  test('Capacity shifts section renders', () => {
    const delta = makeDelta({
      capacityShifts: [{ capacity: 'labor', beforeBand: 'surplus', afterBand: 'adequate' }],
    });
    render(<RegenerationDeltaCard delta={delta} />);
    expect(screen.getByText('labor')).toBeTruthy();
    expect(screen.getByText('surplus → adequate')).toBeTruthy();
  });

  test('Daily-life shifts section renders', () => {
    const delta = makeDelta({
      dailyLifeShifts: [{ slot: 'evening', summary: 'tavern emptier, watch on edge' }],
    });
    render(<RegenerationDeltaCard delta={delta} />);
    expect(screen.getByText('evening')).toBeTruthy();
    expect(screen.getByText('tavern emptier, watch on edge')).toBeTruthy();
  });

  test('Preserved canon section uses type + label', () => {
    const delta = makeDelta({
      preservedCanon: [{ type: 'npc', label: 'Aldis Vale' }],
    });
    render(<RegenerationDeltaCard delta={delta} />);
    expect(screen.getByText('npc: Aldis Vale')).toBeTruthy();
  });

  test('New opportunities section picks the hook entries when newOpportunities is not provided', () => {
    const delta = makeDelta({
      newEntities: [
        { type: 'hook', label: 'River dispute' },
        { type: 'threat', label: 'Bandit pressure' },
      ],
    });
    render(<RegenerationDeltaCard delta={delta} />);
    expect(screen.getByText('hook: River dispute')).toBeTruthy();
  });

  test('New risks section picks threats/conditions/clocks when newRisks is not provided', () => {
    const delta = makeDelta({
      newEntities: [
        { type: 'threat', label: 'Bandit pressure' },
        { type: 'condition', label: 'plague' },
        { type: 'hook', label: 'River dispute' }, // should NOT appear in risks
      ],
    });
    render(<RegenerationDeltaCard delta={delta} />);
    expect(screen.getByText('threat: Bandit pressure')).toBeTruthy();
    expect(screen.getByText('condition: plague')).toBeTruthy();
  });

  test('explicit newOpportunities / newRisks override the newEntities fallback', () => {
    const delta = makeDelta({
      newEntities: [{ type: 'hook', label: 'Should NOT appear' }],
      newOpportunities: [{ type: 'hook', label: 'Explicit hook' }],
    });
    render(<RegenerationDeltaCard delta={delta} />);
    expect(screen.getByText('hook: Explicit hook')).toBeTruthy();
    expect(screen.queryByText('hook: Should NOT appear')).toBeNull();
  });
});

describe('RegenerationDeltaCard — broken dependencies', () => {
  test('renders the broken-dependencies row when present', () => {
    const delta = makeDelta({
      brokenDependencies: ['supplyChain.iron', 'faction.silver'],
    });
    render(<RegenerationDeltaCard delta={delta} />);
    expect(screen.getByText(/Broken dependencies:/)).toBeTruthy();
    expect(screen.getByText(/supplyChain\.iron · faction\.silver/)).toBeTruthy();
  });

  test('the row carries role=alert for screen readers', () => {
    const delta = makeDelta({
      brokenDependencies: ['x'],
    });
    render(<RegenerationDeltaCard delta={delta} />);
    expect(screen.getByRole('alert').textContent).toMatch(/Broken dependencies/);
  });
});

describe('RegenerationDeltaCard — summary footer', () => {
  test('renders summary lines below the sections', () => {
    const delta = makeDelta({
      directEffects: [{ label: 'a', before: 'x', after: 'y' }],
      summary: ['Food security dropped after losing the mill', 'Council faction lost legitimacy'],
    });
    render(<RegenerationDeltaCard delta={delta} />);
    expect(screen.getByText(/Food security dropped after losing the mill/)).toBeTruthy();
    expect(screen.getByText(/Council faction lost legitimacy/)).toBeTruthy();
  });

  test('omits the summary footer when summary array is empty', () => {
    const delta = makeDelta({
      directEffects: [{ label: 'a', before: 'x', after: 'y' }],
      summary: [],
    });
    const { container } = render(<RegenerationDeltaCard delta={delta} />);
    // No leading "·" bullet line.
    expect(container.textContent).not.toMatch(/^·/);
  });
});

describe('RegenerationDeltaCard — actions', () => {
  test('dismiss button fires onDismiss', () => {
    const onDismiss = vi.fn();
    const delta = makeDelta({ directEffects: [{ label: 'a', before: 'x', after: 'y' }] });
    render(<RegenerationDeltaCard delta={delta} onDismiss={onDismiss} />);
    fireEvent.click(screen.getByLabelText('Dismiss'));
    expect(onDismiss).toHaveBeenCalled();
  });

  test('dismiss button is hidden when onDismiss is not provided', () => {
    const delta = makeDelta({ directEffects: [{ label: 'a', before: 'x', after: 'y' }] });
    render(<RegenerationDeltaCard delta={delta} />);
    expect(screen.queryByLabelText('Dismiss')).toBeNull();
  });

  test('collapse toggle hides + restores the body', () => {
    const delta = makeDelta({
      directEffects: [{ label: 'food', before: 'adequate', after: 'strained' }],
    });
    render(<RegenerationDeltaCard delta={delta} />);
    expect(screen.getByText('food')).toBeTruthy();
    fireEvent.click(screen.getByText('Hide'));
    expect(screen.queryByText('food')).toBeNull();
    fireEvent.click(screen.getByText('Show'));
    expect(screen.getByText('food')).toBeTruthy();
  });

  test('the region exposes aria-label for screen readers', () => {
    const delta = makeDelta({ directEffects: [{ label: 'a', before: 'x', after: 'y' }] });
    render(<RegenerationDeltaCard delta={delta} />);
    expect(screen.getByLabelText('Regeneration delta summary')).toBeTruthy();
  });
});
