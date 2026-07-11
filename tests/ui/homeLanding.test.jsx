/**
 * @vitest-environment jsdom
 *
 * tests/ui/homeLanding.test.jsx — pins the scrollable Welcome page (the
 * salt-road landing that replaced the flag-gated single-hero + V2 bands).
 *
 * Contract locked here (landing spec §9):
 *   - exactly ONE <h1> on the page (the hero), carrying the registry copy;
 *   - all six section headings render (from the copy registry, not literals);
 *   - the anon ceiling string appears EXACTLY once across the page;
 *   - the decorative chips (Save to Library / Fork / Advance time) are plain
 *     spans, never buttons (§3.8 — nothing clickable may no-op);
 *   - the hero primary CTA label equals landing.hero.cta for an anon visitor.
 *
 * Copy is asserted against the `landing` registry object, so a spec-copy change
 * is a one-line data change here, never a literal edit.
 */

import { describe, test, expect, afterEach, vi } from 'vitest';
import { render, cleanup, screen, within } from '@testing-library/react';
import HomeLanding from '../../src/components/HomeLanding.jsx';
import { landing } from '../../src/copy/landing.js';

// Analytics is fire-and-forget (the once-per-session welcome_view); stub it so
// the mount path stays quiet and offline.
vi.mock('../../src/lib/analytics.js', () => ({
  track: vi.fn(),
  Funnel: { welcomeView: vi.fn() },
  EVENTS: new Proxy({}, { get: (_t, k) => String(k) }),
}));

afterEach(cleanup);

function renderLanding(props = {}) {
  return render(
    <HomeLanding
      isMobile={false}
      signedIn={false}
      onNavigate={() => {}}
      onSignIn={() => {}}
      {...props}
    />,
  );
}

describe('HomeLanding — scrollable landing', () => {
  test('renders exactly one h1 (the hero) carrying the registry copy', async () => {
    const { container } = renderLanding();
    // Wait for the lazy below-fold so any stray heading would have surfaced.
    await screen.findByText(landing.closer.h2);
    const h1s = container.querySelectorAll('h1');
    expect(h1s).toHaveLength(1);
    expect(h1s[0].textContent).toBe(landing.hero.h1);
  });

  test('all six section headings render from the copy registry', async () => {
    renderLanding();
    const headings = [
      landing.forge.h2, landing.brief.h2, landing.voice.h2,
      landing.realm.h2, landing.commons.h2, landing.closer.h2,
    ];
    for (const h2 of headings) {
      expect(await screen.findByText(h2)).toBeTruthy();
    }
  });

  test('the anon ceiling string appears exactly once', async () => {
    renderLanding();
    await screen.findByText(landing.forge.ceiling); // wait for below-fold
    expect(screen.getAllByText(landing.forge.ceiling)).toHaveLength(1);
  });

  test('decorative chips (Save to Library / Fork / Advance time) are non-button spans', async () => {
    renderLanding();
    const save = await screen.findByText(landing.brief.dossier.save);
    const advance = await screen.findByText(landing.realm.clockCta);

    expect(save.closest('button')).toBeNull();
    expect(save.tagName).toBe('SPAN');
    expect(advance.closest('button')).toBeNull();
    expect(advance.tagName).toBe('SPAN');

    // One Fork chip per gallery card — none may be an interactive button.
    const forks = screen.getAllByText(landing.commons.fork);
    expect(forks.length).toBeGreaterThan(0);
    for (const fork of forks) {
      expect(fork.closest('button')).toBeNull();
      expect(fork.tagName).toBe('SPAN');
    }
  });

  test('the hero primary CTA label matches landing.hero.cta for anon', () => {
    const { container } = renderLanding({ signedIn: false });
    const hero = container.querySelector('section[aria-labelledby="sf-hero-title"]');
    expect(hero).toBeTruthy();
    const cta = within(hero).getByRole('button', { name: landing.hero.cta });
    expect(cta.tagName).toBe('BUTTON');
  });
});
