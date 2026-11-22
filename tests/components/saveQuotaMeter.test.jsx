/**
 * @vitest-environment jsdom
 *
 * saveQuotaMeter.test.jsx — the Library save-quota meter + funnel header (UX
 * Phase 3, plan §4.2 / §3.3).
 *
 * Pins the NO-SIZE-GATE invariant: the header references the save COUNT (3 slots)
 * and pitches the SIMULATION — never a settlement-size cap. Also pins the three
 * tier states (anon → sign in, free → meter + upgrade, premium → unlimited).
 */

import { describe, it, expect, afterEach, vi } from 'vitest';
import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import SaveQuotaMeter, { PREMIUM_PITCH } from '../../src/components/settlements/SaveQuotaMeter.jsx';
import { FREE_SAVE_LIMIT } from '../../src/config/tierFacts.js';

// These pins describe the funnel as it behaves once purchases open (lib/launchGate.js).
// The pre-launch closed state is pinned in launchLock.libraryHeaderLanding.test.jsx.
vi.mock('../../src/lib/launchGate.js', async (importOriginal) => ({ ...(await importOriginal()), purchasesOpen: () => true }));

afterEach(cleanup);

describe('SaveQuotaMeter — no size gate', () => {
  it('the premium pitch names the SIMULATION, never settlement size / a cap', () => {
    const lower = PREMIUM_PITCH.toLowerCase();
    expect(lower).toContain('simulation');
    expect(lower).toMatch(/advance time|campaign|pantheon/);
    // Must NOT sell size — no metropolis/capital/city/size/larger language.
    expect(lower).not.toMatch(/size|metropolis|capital\b|bigger|larger|city tier/);
  });

  it('free meter references the save COUNT remaining + tier name, not a size limit', () => {
    render(<SaveQuotaMeter tier="free" used={2} max={3} />);
    const label = screen.getByTestId('quota-label').textContent || '';
    // Remaining-count framing on the tier name: 1 of 3 saves left on Wanderer.
    expect(label).toMatch(/1 of 3 saves left on Wanderer/i);
    expect(label.toLowerCase()).not.toMatch(/size|metropolis/);
    // The meter bar is present (the count gauge) and the premium pitch is shown.
    expect(screen.getByTestId('quota-bar')).toBeTruthy();
    expect((screen.getByTestId('premium-pitch').textContent || '').toLowerCase()).toContain('simulation');
  });
});

describe('SaveQuotaMeter — tier states', () => {
  // The anon line names the two facts that decide whether a visitor signs up:
  // the account is FREE, and it holds a bounded number of settlements. The
  // number is the DERIVED free-tier cap, never a hand-typed digit — `max` is 0
  // for anon, so the promise cannot be read off this viewer's own quota.
  it('anon → a free account and the derived save cap, no meter, Sign in CTA', () => {
    const onSignIn = vi.fn();
    render(<SaveQuotaMeter tier="anon" used={0} max={0} onSignIn={onSignIn} />);
    const label = screen.getByTestId('quota-label').textContent || '';
    expect(label).toMatch(/Sign in free/i);
    expect(label).toContain(`save up to ${FREE_SAVE_LIMIT} settlements`);
    expect(label).toMatch(/keep them across sessions/i);
    // anchored: the two assertions above prove the label is the live anon line AND already carries the free cap, so a missing 0 cannot mean a vanished label
    expect(label).not.toMatch(/\b0\b/);
    expect(screen.queryByTestId('quota-bar')).toBeNull();
    fireEvent.click(screen.getByText('Sign in'));
    expect(onSignIn).toHaveBeenCalled();
  });

  it('free → Upgrade CTA routes to the premium-value surface', () => {
    const onUpgrade = vi.fn();
    render(<SaveQuotaMeter tier="free" used={3} max={3} onUpgrade={onUpgrade} />);
    fireEvent.click(screen.getByText('Upgrade'));
    expect(onUpgrade).toHaveBeenCalled();
  });

  it('premium → "Unlimited saves", no meter, no upgrade CTA', () => {
    render(<SaveQuotaMeter tier="premium" used={12} max={Infinity} />);
    expect((screen.getByTestId('quota-label').textContent || '')).toMatch(/Unlimited saves/i);
    expect(screen.queryByTestId('quota-bar')).toBeNull();
    expect(screen.queryByText('Upgrade')).toBeNull();
  });
});
