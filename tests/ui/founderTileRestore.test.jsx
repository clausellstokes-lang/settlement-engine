/** @vitest-environment jsdom */
/**
 * tests/ui/founderTileRestore.test.jsx — the FounderTile affordances
 * (census §1 #15): the P7 chair meter, and the CTA that no longer buys anything.
 *
 * ⛔ REWRITTEN IN PLACE, NOT DELETED (ODQ §118, J-TC22-7). This file used to pin
 * the OPPOSITE of what it pins now: that the tile's CTA opened a
 * `startCheckout('founder_lifetime')` and that a failed checkout offered a retry
 * which re-invoked the SAME purchase. A chair is given, never sold, so the
 * purchase call is gone — and with it the failure it needed recovering from. A
 * link cannot fail, so a "retry" for it would be invented behaviour.
 *
 * The strongest thing this file can now assert is the NEGATIVE with teeth: the
 * checkout seam is still mocked, and `startCheckout` must never be called no
 * matter what the reader clicks. The file is rewritten rather than removed so the
 * test-file census moves by a predictable single step.
 */
import { describe, test, expect, afterEach, beforeEach, vi } from 'vitest';
import { render, cleanup, screen, fireEvent, waitFor } from '@testing-library/react';

// An eligible worldbuilder with the recognition flag on and chairs unheld.
//
// ⚠ THE SEAM MOVED WITH ROW O-16 AND THE MOCK MOVED WITH IT. The tile no longer
// reads a bare archetype: it reads the recognition verdict WITH its grounds, so
// this fixture supplies the evidence shape the real hook returns. Stubbing only
// the old `useReaderAudience` would leave the tile reading `undefined` grounds
// and quietly stop exercising the gate.
vi.mock('../../src/hooks/useReaderAudience.js', () => ({
  useReaderAudience: () => 'worldbuilder',
  useReaderAudienceEvidence: () => ({
    audience: 'worldbuilder',
    reasons: ['saves_at_least_five', 'neighbour_network_used'],
  }),
}));
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
// FOUNDER_SEAT_CAP (the static import + the seat-math), only the async RPC is
// stubbed. The checkout seam stays mocked ON PURPOSE even though the tile no
// longer imports it: an unused mock that must stay unused is the pin.
const fetchFounderSeatsRemaining = vi.fn();
const startCheckout = vi.fn();
vi.mock('../../src/lib/founderSeats.js', async (importOriginal) => {
  const actual = await importOriginal();
  return { ...actual, fetchFounderSeatsRemaining: (...a) => fetchFounderSeatsRemaining(...a) };
});
vi.mock('../../src/lib/stripe.js', () => ({ startCheckout: (...a) => startCheckout(...a) }));

import FounderTile from '../../src/components/pricing/FounderTile.jsx';
import {
  founderRecognitionEvidence,
  FOUNDER_RECOGNITION_WITHHELD,
} from '../../src/hooks/useFounderTileEligible.js';
import { FOUNDER_SEAT_CAP } from '../../src/lib/founderSeats.js';
import { viewToPath } from '../../src/lib/routes.js';

beforeEach(() => { fetchFounderSeatsRemaining.mockReset(); startCheckout.mockReset(); });
afterEach(cleanup);

describe('FounderTile — P7 chair meter (#15)', () => {
  test('renders the live chairs-HELD count AND a filled meter at the held fraction', async () => {
    // 18 of 30 unheld ⇒ 12 held ⇒ 40% filled. The count reads in the Hall's own
    // vocabulary: a chair is held, never "remaining" for sale.
    fetchFounderSeatsRemaining.mockResolvedValue(18);
    const { container } = render(<FounderTile />);
    await screen.findByText(new RegExp(`12 of ${FOUNDER_SEAT_CAP} chairs held`));
    // The meter is a two-channel companion to the count: aria-hidden track + fill.
    const track = container.querySelector('[aria-hidden="true"]');
    expect(track).not.toBeNull();
    const fill = track.querySelector('div');
    expect(fill).not.toBeNull();
    expect(fill.style.width).toBe('40%');
  });

  test('says nothing about seats remaining, one-time payment, or a price', async () => {
    fetchFounderSeatsRemaining.mockResolvedValue(18);
    const { container } = render(<FounderTile />);
    await screen.findByRole('link', { name: /Request a chair/i });
    const text = container.textContent;
    // Non-vacuity: a rendered-surface negative passes on a surface that never
    // rendered, so prove there IS a surface before asserting what is absent.
    expect(text.length).toBeGreaterThan(80);
    for (const dead of ['$99', '$144', 'one-time', 'seats remaining', 'Claim', 'Pay once']) {
      // anchored: text.length > 80 is asserted above and the CTA link is found by role, so the rendered subject is proven live
      expect(text, `the tile still renders dead purchase copy: ${dead}`).not.toContain(dead);
    }
  });
});

describe('FounderTile — the CTA asks for a chair, it does not buy one (ODQ §118)', () => {
  test('the CTA is a link to the Founders’ Hall and NEVER opens a checkout', async () => {
    fetchFounderSeatsRemaining.mockResolvedValue(null); // no meter; focus on the CTA
    render(<FounderTile />);

    const cta = await screen.findByRole('link', { name: /Request a chair/i });
    expect(cta.getAttribute('href')).toBe(viewToPath('founders'));

    fireEvent.click(cta);
    // Clicking records the funnel event and goes to the Hall. It must not reach
    // Stripe — and there is no error state and no retry, because a link that
    // cannot fail has nothing to recover from.
    await waitFor(() => expect(startCheckout).not.toHaveBeenCalled());
    expect(screen.queryByRole('alert')).toBeNull();
    expect(screen.queryByRole('button', { name: /Try again/i })).toBeNull();
  });

  test('the tile does not import the checkout seam at all', async () => {
    // The mock above can only prove the call never HAPPENS. This proves the edge
    // is gone from the module graph, which is what stops it coming back.
    // jsdom gives import.meta.url an http scheme, so resolve from the vitest
    // root instead of from this module's URL.
    const [fs, path] = await Promise.all([import('node:fs'), import('node:path')]);
    const src = fs.readFileSync(
      path.resolve(process.cwd(), 'src/components/pricing/FounderTile.jsx'),
      'utf8',
    );
    // anchored: readFileSync throws on a missing path, and FOUNDER_SEAT_CAP is asserted PRESENT in this same source below
    expect(src).not.toMatch(/from '\.\.\/\.\.\/lib\/stripe\.js'/);
    // anchored: same source, proven non-empty by the FOUNDER_SEAT_CAP assertion below
    expect(src).not.toMatch(/startCheckout\s*\(/);
    // The header comment NAMES the abolished SKU deliberately (that record is the
    // point), so the negative is on the call, not the word: no checkout is opened
    // for it anywhere in the file.
    // anchored: same source, proven non-empty by the FOUNDER_SEAT_CAP assertion on the next line
    expect(src).not.toMatch(/\(\s*'founder_lifetime'\s*\)/);
    // …and it still reads the shared cap rather than a literal 30.
    expect(src).toMatch(/FOUNDER_SEAT_CAP/);
  });
});

// ── ROW O-16: THE LIT PAID SURFACE, AND WHO IT REACHES ──────────────────────
//
// `founderRecognition` shipped dark. On 2026-09-03 the owner handed row O-16 to
// the chair and it is LIT. That makes these arms the paid-surface contract:
// they hold the population the flip actually reaches, and — the one that
// matters most — the population it must NOT reach.
//
// The gate is pure, so it is driven directly here rather than through the
// component's mocked seams; the tile's own rendering is covered above.
describe('founder recognition — the lit gate and its evidence (O-16)', () => {
  const worldbuilder = {
    recognitionEnabled: true,
    audience: 'worldbuilder',
    reasons: ['saves_at_least_five', 'neighbour_network_used'],
  };

  test('the recognition flag ships LIT', async () => {
    // Read the real registry, not the mocked `flags.js` facade above.
    const { FLAG_DEFAULTS } = await import('../../src/lib/flagRegistry.js');
    // Anti-vacuity: the registry is really loaded and really has other flags.
    expect(Object.keys(FLAG_DEFAULTS).length).toBeGreaterThan(20);
    expect(FLAG_DEFAULTS.founderRecognition).toBe(true);
  });

  test('⛔ A PAYING SUBSCRIBER IS NEVER OFFERED A CHAIR — the flip changes nothing for them', () => {
    const verdict = founderRecognitionEvidence({ ...worldbuilder, tier: 'premium' });
    expect(verdict.eligible).toBe(false);
    expect(verdict.withheldBy).toContain(FOUNDER_RECOGNITION_WITHHELD.ALREADY_PREMIUM);
    // …and the refusal carries NO earning grounds, so a downstream receipt can
    // never read "earned" off a reader who was refused.
    expect([...verdict.earnedBy]).toEqual([]);
  });

  test('a demonstrated worldbuilder on a free tier is offered one, WITH the grounds', () => {
    const verdict = founderRecognitionEvidence({ ...worldbuilder, tier: 'free' });
    expect(verdict.eligible).toBe(true);
    expect([...verdict.withheldBy]).toEqual([]);
    expect([...verdict.earnedBy]).toEqual(['saves_at_least_five', 'neighbour_network_used']);
  });

  test('a refusal names EVERY ground it rests on, not merely the first', () => {
    const verdict = founderRecognitionEvidence({
      recognitionEnabled: false, audience: 'new', reasons: [], tier: 'premium',
    });
    expect(verdict.eligible).toBe(false);
    expect([...verdict.withheldBy]).toEqual([
      FOUNDER_RECOGNITION_WITHHELD.RECOGNITION_FLAG_DARK,
      FOUNDER_RECOGNITION_WITHHELD.AUDIENCE_NOT_WORLDBUILDER,
      FOUNDER_RECOGNITION_WITHHELD.ALREADY_PREMIUM,
    ]);
  });

  test('the tile and the parent one-primary hook cannot disagree about one reader', () => {
    // The old shape recomputed the same three conditions in two modules and kept
    // them in agreement by a comment. Both now read this one composition.
    for (const tier of ['anon', 'free', 'premium']) {
      for (const audience of ['new', 'intermediate', 'worldbuilder']) {
        const verdict = founderRecognitionEvidence({ ...worldbuilder, audience, tier });
        expect(verdict.eligible).toBe(audience === 'worldbuilder' && tier !== 'premium');
      }
    }
  });
});
