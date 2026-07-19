/**
 * @vitest-environment jsdom
 *
 * welcomeJourney.test.jsx — STILLS ARE THE FLOOR on the WELCOME (Slice C2 law #1).
 *
 * The test-level equivalent of the network-blocked walk: with no fine pointer and
 * no matchMedia (jsdom default) the scroll film never mounts, yet the COMPLETE
 * travel-and-stop journey still renders — the desk/stop stills paint (the floor),
 * the six travel legs exist, the film backdrop mints its lazy-ratchet fingerprint,
 * and EVERY re-vehicled section + CTA is present and functional before one video
 * byte arrives. The film is a progressive enhancement, never a dependency.
 *
 * (The full section/CTA retention contract is pinned by homeLanding.test.jsx; this
 * file adds the journey-floor half — legs, stills, fingerprint, film-absent.)
 */
import { describe, test, expect, afterEach, vi } from 'vitest';
import { render, cleanup, screen } from '@testing-library/react';
import HomeLanding from '../../src/components/HomeLanding.jsx';
import { landing } from '../../src/copy/landing.js';
import { WELCOME_JOURNEY_FINGERPRINT } from '../../src/components/home/WelcomeJourneyBackdrop.jsx';

// Analytics is fire-and-forget (landing_funnel_used via the lazy helper); stub it
// so the mount path stays quiet — mirrors homeLanding.test.jsx.
vi.mock('../../src/lib/analytics.js', () => ({
  track: vi.fn(),
  Funnel: {},
  EVENTS: new Proxy({}, { get: (_t, k) => String(k) }),
}));

afterEach(cleanup);

function renderLanding(props = {}) {
  return render(
    <HomeLanding isMobile={false} signedIn={false} onNavigate={() => {}} onSignIn={() => {}} {...props} />,
  );
}

describe('THE WELCOME FLOOR — the journey renders from stills, film absent', () => {
  test('mounts the film backdrop with its lazy-ratchet fingerprint', async () => {
    const { container } = renderLanding();
    // Wait for the lazy below-fold (the backdrop rides that chunk).
    await screen.findByText(landing.closer.h2, {}, { timeout: 10_000 });
    const backdrop = container.querySelector('[data-welcome-journey]');
    expect(backdrop, 'the Welcome film backdrop must mount').not.toBeNull();
    expect(backdrop.getAttribute('data-welcome-journey')).toBe(WELCOME_JOURNEY_FINGERPRINT);
  });

  test('paints a journey stop still (the floor) with no fine pointer / no film', async () => {
    const { container } = renderLanding();
    await screen.findByText(landing.closer.h2, {}, { timeout: 10_000 });
    // The floor is a crisp stop still under the (absent) video.
    const still = container.querySelector('img[src*="/media/journey-legs/"]');
    expect(still, 'the stop still floor must render film-independently').not.toBeNull();
    expect(still.getAttribute('src')).toMatch(/\/media\/journey-legs\/(bg|journey)\/still-\d+-[a-z]+\.jpg$/);
    // Progressive enhancement only: jsdom has no matchMedia → no <video> anywhere.
    expect(container.querySelector('video'), 'no film byte without a fine pointer').toBeNull();
  });

  test('interleaves exactly six travel legs between the stops', async () => {
    const { container } = renderLanding();
    await screen.findByText(landing.closer.h2, {}, { timeout: 10_000 });
    const legs = container.querySelectorAll('[data-welcome-leg]');
    expect(legs).toHaveLength(6);
    // The legs mark their 0-based index so the DOM order and index never disagree.
    expect([...legs].map((l) => l.getAttribute('data-welcome-leg'))).toEqual(['0', '1', '2', '3', '4', '5']);
  });

  test('the town-stop caption (THE FILM RULING) renders at the living-world stop', async () => {
    renderLanding();
    expect(await screen.findByText(landing.journey.townGrew)).toBeTruthy();
  });

  test('every section CTA is present and functional before any video byte', async () => {
    renderLanding();
    // The hero + section forge CTAs and the closer CTA all resolve as real
    // buttons with the film absent (the floor carries the whole funnel).
    await screen.findByText(landing.closer.h2, {}, { timeout: 10_000 });
    expect(screen.getAllByRole('button', { name: landing.forge.cta }).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByRole('button', { name: landing.commons.cta }).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByRole('button', { name: landing.closer.cta }).length).toBeGreaterThanOrEqual(1);
  });
});
