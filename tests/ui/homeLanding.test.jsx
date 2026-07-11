/**
 * @vitest-environment jsdom
 *
 * tests/ui/homeLanding.test.jsx — pins the scrollable Welcome page (the
 * salt-road landing) and its W-L2 derived-artifact contract.
 *
 * Contract locked here (landing spec §9 + owner amendments W-L2/1..5):
 *   - exactly ONE <h1> on the page (the hero), carrying the registry copy;
 *   - all six section headings render (from the copy registry, not literals);
 *   - the anon ceiling string appears EXACTLY once across the page;
 *   - decorative chips (Save to Library / Fork / Advance time) stay plain
 *     spans, never buttons (§3.8) — while the ONE interactive artifact control
 *     ("Forge this exact town") renders as a real button;
 *   - the hero primary CTA label equals landing.hero.cta for an anon visitor;
 *   - FIXTURE SHAPE: the frozen module carries non-empty derived artifacts
 *     (brief town + hooks, voice receipts + narration, why-trace deltas,
 *     chronicle, pins), an anon-ceiling settType, and engine version markers
 *     (the regen-policy drift signal);
 *   - the mono seed provenance tag renders (determinism is the promise);
 *   - COMMONS FALLBACK: with the gallery unreachable (jsdom → supabase
 *     unconfigured), all four decorative cards render — four full slots, no
 *     empty grid, zero layout shift.
 *
 * Copy is asserted against the `landing` registry object and the frozen
 * fixture, so a copy/fixture change is a data change here, never a literal edit.
 */

import { describe, test, expect, afterEach, vi } from 'vitest';
import { render, cleanup, screen, within } from '@testing-library/react';
import HomeLanding from '../../src/components/HomeLanding.jsx';
import { landing } from '../../src/copy/landing.js';
import { fixture } from '../../src/components/home/landingFixture.js';

// Analytics is fire-and-forget (welcome_view + the optional-chained
// landing-fixture forge tag); stub it so the mount path stays quiet.
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
    // Generous timeout: the FIRST mount pays the store/gallery/fixture module
    // compile for the whole file (later tests hit the module cache).
    await screen.findByText(landing.closer.h2, {}, { timeout: 10_000 });
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

  test('decorative chips stay spans; the forge-exact control is a real button', async () => {
    renderLanding();
    const save = await screen.findByText(landing.brief.save);
    const advance = await screen.findByText(landing.realm.clockCta);

    expect(save.closest('button')).toBeNull();
    expect(save.tagName).toBe('SPAN');
    expect(advance.closest('button')).toBeNull();
    expect(advance.tagName).toBe('SPAN');

    // Decorative Fork chips (the commons fallback set) — never buttons.
    const forks = screen.getAllByText(landing.commons.fork);
    expect(forks.length).toBeGreaterThan(0);
    for (const fork of forks) {
      expect(fork.closest('button')).toBeNull();
      expect(fork.tagName).toBe('SPAN');
    }

    // The ONE interactive artifact control (owner addition W-L2/5).
    const forgeExact = screen.getByRole('button', { name: new RegExp(landing.brief.forgeExact) });
    expect(forgeExact.tagName).toBe('BUTTON');
  });

  test('the hero primary CTA label matches landing.hero.cta for anon', () => {
    const { container } = renderLanding({ signedIn: false });
    const hero = container.querySelector('section[aria-labelledby="sf-hero-title"]');
    expect(hero).toBeTruthy();
    const cta = within(hero).getByRole('button', { name: landing.hero.cta });
    expect(cta.tagName).toBe('BUTTON');
  });

  // ── W-L2/1 + W-L2/5 — the frozen fixture's shape contract ─────────────────
  test('fixture module carries non-empty derived artifacts within the anon ceiling', () => {
    // Provenance + determinism promise.
    expect(fixture.seed).toBeTruthy();
    expect(fixture.weeks).toBeGreaterThan(0);
    // Engine version markers — the regen-policy drift signal.
    expect(fixture.engine.generatorVersion).toBeTruthy();
    expect(fixture.engine.simulationVersion).not.toBeNull();
    // The forge-exact replay inputs: full config recorded, anon-ceiling tier.
    expect(['hamlet', 'village', 'town']).toContain(fixture.forge.config.settType);
    expect(fixture.forge.mode).toBeTruthy();
    // Brief artifact.
    expect(fixture.town.name).toBeTruthy();
    expect(fixture.town.population).toBeGreaterThan(0);
    expect(fixture.town.prose).toBeTruthy();
    expect(fixture.town.pressure).toBeTruthy();
    expect(fixture.town.hooks.length).toBeGreaterThanOrEqual(2);
    for (const hook of fixture.town.hooks) {
      expect(hook.kind).toBeTruthy();
      expect(hook.tag).toMatch(/^derived · /);
      expect((hook.text || hook.rest || '').length).toBeGreaterThan(0);
    }
    expect(fixture.town.hooksMore).toBeGreaterThan(0);
    // Voice artifact: real receipts + the sanctioned stock narration.
    expect(fixture.voice.receipts.length).toBeGreaterThanOrEqual(3);
    for (const r of fixture.voice.receipts) {
      expect(r.label).toBeTruthy();
      expect(r.text).toBeTruthy();
    }
    expect(fixture.voice.narrated.length).toBeGreaterThan(100);
    // Why-trace: real band deltas with real causes.
    expect(fixture.realm.whyTrace.length).toBeGreaterThanOrEqual(3);
    for (const d of fixture.realm.whyTrace) {
      expect(d.axis).toBeTruthy();
      expect(d.from).toBeTruthy();
      expect(d.to).toBeTruthy();
      expect(d.from).not.toBe(d.to);
      expect(d.reason).toBeTruthy();
    }
    // Chronicle + pins: real applied events, real generated names.
    expect(fixture.realm.chronicle.length).toBeGreaterThanOrEqual(3);
    for (const c of fixture.realm.chronicle) {
      expect(c.text).toBeTruthy();
      expect(c.week).toMatch(/^Week \d+$/);
    }
    expect(fixture.realm.pins.length).toBeGreaterThanOrEqual(2);
    expect(fixture.realm.pins[0].name).toBe(fixture.town.name);
  });

  test('the mono seed provenance tag renders on the artifacts', async () => {
    renderLanding();
    await screen.findByText(landing.closer.h2);
    const tags = screen.getAllByText(new RegExp(`seed · ${fixture.seed}`));
    expect(tags.length).toBeGreaterThanOrEqual(2); // brief + voice (+ why-trace with week)
    expect(screen.getByText(`seed · ${fixture.seed} · week ${fixture.weeks}`)).toBeTruthy();
  });

  test('commons fallback renders all four decorative slots when the gallery is unreachable', async () => {
    renderLanding();
    await screen.findByText(landing.commons.h2);
    // jsdom has no Supabase config → fetchPublicGallery resolves empty → all
    // four decorative cards render (zero layout shift, no empty grid).
    expect(landing.commons.cards).toHaveLength(4);
    for (const card of landing.commons.cards) {
      expect(await screen.findByText(card.name)).toBeTruthy();
    }
  });
});
