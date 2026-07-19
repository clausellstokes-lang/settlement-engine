/** @vitest-environment jsdom */
/**
 * tests/ui/founderTileRestore.test.jsx — the restored FounderTile affordances
 * (census §1 #15): the P7 seat-scarcity meter and the P10 checkout-error retry.
 *
 * ⛔ ZERO paid-behavior change: these are presentation + error recovery only.
 * The retry path re-invokes the SAME checkout ('founder_lifetime') the tile
 * always used — the pin asserts the checkout ARGUMENT is unchanged so the
 * restoration can never have altered what the buyer is charged for.
 */
import { describe, test, expect, afterEach, beforeEach, vi } from 'vitest';
import { render, cleanup, screen, fireEvent, waitFor } from '@testing-library/react';

// An eligible worldbuilder with the recognition flag on and seats available.
vi.mock('../../src/hooks/useReaderAudience.js', () => ({ useReaderAudience: () => 'worldbuilder' }));
vi.mock('../../src/lib/flags.js', () => ({ flag: (k) => k === 'founderRecognition' }));
vi.mock('../../src/store/index.js', () => {
  const state = { auth: { tier: 'free' } };
  const useStore = (sel) => sel(state);
  useStore.getState = () => state;
  useStore.subscribe = () => () => {};
  return { useStore };
});
vi.mock('../../src/lib/analytics.js', () => ({
  Funnel: { track: vi.fn() },
  EVENTS: new Proxy({}, { get: (_t, k) => String(k) }),
}));

// Seat RPC + checkout are the controllable seams. founderSeats keeps its real
// FOUNDER_SEAT_CAP (the static import + the seat-math), only the async RPC is stubbed.
const fetchFounderSeatsRemaining = vi.fn();
const startCheckout = vi.fn();
vi.mock('../../src/lib/founderSeats.js', async (importOriginal) => {
  const actual = await importOriginal();
  return { ...actual, fetchFounderSeatsRemaining: (...a) => fetchFounderSeatsRemaining(...a) };
});
vi.mock('../../src/lib/stripe.js', () => ({ startCheckout: (...a) => startCheckout(...a) }));

import FounderTile from '../../src/components/pricing/FounderTile.jsx';
import { FOUNDER_SEAT_CAP } from '../../src/lib/founderSeats.js';

beforeEach(() => { fetchFounderSeatsRemaining.mockReset(); startCheckout.mockReset(); });
afterEach(cleanup);

describe('FounderTile — P7 seat-scarcity meter (#15)', () => {
  test('renders the live count AND a filled meter at the taken-fraction width', async () => {
    // 18 of 30 remaining ⇒ 12 taken ⇒ 40% filled.
    fetchFounderSeatsRemaining.mockResolvedValue(18);
    const { container } = render(<FounderTile />);
    await screen.findByText(new RegExp(`18 of ${FOUNDER_SEAT_CAP} seats remaining`));
    // The meter is a two-channel companion to the count: aria-hidden track + fill.
    const track = container.querySelector('[aria-hidden="true"]');
    expect(track).not.toBeNull();
    const fill = track.querySelector('div');
    expect(fill).not.toBeNull();
    expect(fill.style.width).toBe('40%');
  });
});

describe('FounderTile — P10 checkout-error retry (#15)', () => {
  test('a failed checkout surfaces a recoverable error + retry that re-runs the SAME checkout', async () => {
    fetchFounderSeatsRemaining.mockResolvedValue(null); // no meter; focus on the CTA
    startCheckout.mockRejectedValueOnce(new Error('network'));
    render(<FounderTile />);

    const claim = await screen.findByRole('button', { name: /Claim a Founder seat/i });
    fireEvent.click(claim);

    // The dead-end is replaced by a live-region error + a retry control.
    const alert = await screen.findByRole('alert');
    expect(alert.textContent).toMatch(/Checkout could not start/i);
    const retry = screen.getByRole('button', { name: /Try again/i });

    // Zero paid-behavior change: the first attempt used the founder_lifetime
    // checkout, and retry re-invokes the exact same path — nothing else.
    expect(startCheckout).toHaveBeenCalledTimes(1);
    expect(startCheckout).toHaveBeenNthCalledWith(1, 'founder_lifetime');

    startCheckout.mockResolvedValueOnce(undefined);
    fireEvent.click(retry);
    await waitFor(() => expect(startCheckout).toHaveBeenCalledTimes(2));
    expect(startCheckout).toHaveBeenNthCalledWith(2, 'founder_lifetime');
  });
});
