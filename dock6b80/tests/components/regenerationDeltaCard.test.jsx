/** @vitest-environment jsdom */
/**
 * regenerationDeltaCard.test.jsx — band-transition wiring pins.
 *
 * The "Ripple effects" and "Capacity shifts" sections render a band
 * transition detail per entry. Those entries come from two different
 * comparators with two different shapes:
 *   • compareCausalState      → flat bandBefore / bandAfter keys
 *   • compareCapacityStates   → band nested under before / after objects
 *
 * A key-spelling mismatch here fails silently (formatBandChange returns
 * '' for undefined args), so these tests feed REAL comparator output
 * through the card and assert the transition text actually appears.
 */

import { describe, it, expect, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import RegenerationDeltaCard from '../../src/components/primitives/RegenerationDeltaCard.jsx';
import { compareCausalState } from '../../src/domain/causalState.js';
import { compareCapacityStates } from '../../src/domain/capacityModel.js';

function emptyDelta() {
  return {
    directEffects: [],
    rippleEffects: [],
    capacityShifts: [],
    dailyLifeShifts: [],
    preservedCanon: [],
    brokenDependencies: [],
    newEntities: [],
    removedEntities: [],
    newOpportunities: [],
    newRisks: [],
    summary: [],
  };
}

afterEach(cleanup);

describe('RegenerationDeltaCard band transitions', () => {
  it('renders the band transition for a causal ripple entry', () => {
    const rippleEffects = compareCausalState(
      { scores: { social_trust: 62 }, bands: {} },
      { scores: { social_trust: 20 }, bands: {} },
    );
    expect(rippleEffects).toHaveLength(1);
    const [entry] = rippleEffects;
    // Sanity-check the comparator's key spelling — if this fails, the
    // domain shape moved and the card wiring below must move with it.
    expect(entry.bandBefore).toBe('adequate');
    expect(entry.bandAfter).toBe('critical');

    render(<RegenerationDeltaCard delta={{ ...emptyDelta(), rippleEffects }} />);
    expect(screen.getByText('Ripple effects (1)')).toBeTruthy();
    expect(screen.getByText(`${entry.bandBefore} → ${entry.bandAfter}`)).toBeTruthy();
  });

  it('renders the band transition for a capacity shift entry', () => {
    const capacityShifts = compareCapacityStates(
      { capacities: { labor: { supply: 100, demand: 80, ratio: 1.25, band: 'surplus' } } },
      { capacities: { labor: { supply: 50, demand: 100, ratio: 0.5, band: 'strained' } } },
    );
    expect(capacityShifts).toHaveLength(1);
    const [entry] = capacityShifts;
    expect(entry.before.band).toBe('surplus');
    expect(entry.after.band).toBe('strained');

    render(<RegenerationDeltaCard delta={{ ...emptyDelta(), capacityShifts }} />);
    expect(screen.getByText('Capacity shifts (1)')).toBeTruthy();
    expect(screen.getByText(`${entry.before.band} → ${entry.after.band}`)).toBeTruthy();
  });
});
