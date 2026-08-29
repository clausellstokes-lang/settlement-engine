/**
 * @vitest-environment jsdom
 *
 * tests/ui/homeLanding.test.jsx — pins the scrollable Welcome page (the
 * salt-road landing) and its W-L2 derived-artifact contract.
 *
 * Contract locked here (landing spec §9 + owner amendments W-L2/1..5):
 *   - exactly ONE <h1> on the page (the hero), carrying the registry copy;
 *   - all five section headings render (from the copy registry, not literals);
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
 *     unconfigured), all six slots render as labeled placeholders — six full
 *     slots, no empty grid, zero layout shift.
 *
 * Copy is asserted against the `landing` registry object and the frozen
 * fixture, so a copy/fixture change is a data change here, never a literal edit.
 */

import { describe, test, expect, afterEach, vi } from 'vitest';
import { render, cleanup, screen, within } from '@testing-library/react';
import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';
import HomeLanding from '../../src/components/HomeLanding.jsx';
import { landing } from '../../src/copy/landing.js';
import { fixture } from '../../src/components/home/landingFixture.js';

// Analytics is fire-and-forget (landing_funnel_used via the SM-5-pattern lazy
// helper — lib/landingFunnelAnalytics.js imports track + EVENTS from this
// module); stub it so the mount path stays quiet.
vi.mock('../../src/lib/analytics.js', () => ({
  track: vi.fn(),
  Funnel: {},
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
    expect(h1s[0].textContent).toBe(landing.hero.h1a + landing.hero.h1b);
  });

  // Owner walk orders 10/11 (2026-07-22) put the map card in the 02 slot (retitled
  // "The visual"), so brief.h2 renders nowhere. TE-STRIP-1 (owner ruling, ODQ §725)
  // then removed that slot entirely — it WAS the drawn settlement map — leaving FIVE
  // sections. The `map` copy block is gone with it.
  test('all five section headings render from the copy registry', async () => {
    renderLanding();
    const headings = [
      landing.forge.h2, landing.voice.h2,
      landing.realm.h2, landing.commons.h2, landing.closer.h2,
    ];
    for (const h2 of headings) {
      expect(await screen.findByText(h2)).toBeTruthy();
    }
    // The removed section leaves no copy behind to render by accident — and BOTH
    // absences are anchored on a live sibling that travels the same registry path,
    // so neither can pass because the registry drifted away entirely.
    expectAbsentWithAnchor(Object.keys(landing), 'map', 'commons', 'landing copy registry');
    expectAbsentWithAnchor(Object.keys(landing.brief), 'waypoint', 'h2', 'landing.brief copy block');
  });

  test('visible waypoints stay contiguous after the map section was removed', async () => {
    renderLanding();
    await screen.findByText(landing.closer.h2, {}, { timeout: 10_000 });

    // 01..05 with no gap and no stale 06 — the five survivors renumbered in the
    // same act that removed "02 · The visual".
    for (const pill of ['01 · Forge', '02 · The voice', '03 · The Realm',
      '04 · The commons', '05 · Set out']) {
      expect(screen.getByText(pill), `waypoint pill missing: ${pill}`).toBeTruthy();
    }
    // anchored: the loop immediately above asserts all FIVE surviving pills are present,
    // so a landing page that failed to render its waypoints at all reds there first — these
    // two queries can only be measuring the removed section and the retired sixth number.
    expect(screen.queryByText('02 · The visual')).toBeNull();
    expect(screen.queryByText('06 · Set out')).toBeNull();
  });

  // ⚠ THIS PIN WAS INVERTED, AND THE HISTORY IS THE POINT.
  // Owner walk order 10 (2026-07-22) removed the Instant Draft widget — the
  // ceiling string's only landing carrier — and this pin was written to hold
  // the landing CLEAR of it. What that silently also removed was the anon
  // SIZE-CEILING DISCLOSURE from the page an anonymous visitor actually enters
  // through; the copy key and its claims-parity binding stayed green the whole
  // time (§320.3, the rendered-surface vacuity).
  // §363.1 SUPERSEDES walk order 10 on exactly this point: "the anonymous size
  // ceiling appears in one sentence at the landing's anonymous entry point."
  // So the assertion flips from 0 to EXACTLY ONE — which is also what this
  // file's own docblock has claimed all along. Exactly one, not ≥1: two copies
  // of a disclosure is a design defect, and the §01 panel is its one home.
  test('the anon ceiling string appears exactly once on the landing (§363.1)', async () => {
    renderLanding();
    await screen.findByText(landing.closer.h2, {}, { timeout: 10_000 }); // page settled
    expect(screen.queryAllByText(landing.forge.ceiling)).toHaveLength(1);
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
    // §69.3 (DA-A1): the landing page is the PUBLIC surface, so the provenance stamp
    // states an elapsed SPAN rather than a raw engine week counter.
    expect(screen.getByText(`seed · ${fixture.seed} · ${fixture.weeks} weeks in`)).toBeTruthy();
  });

  // ── W-DOC — THE MAP ARTIFACT: RETIRED BY TE-STRIP-1 (owner ruling, ODQ §725) ──
  // Two arms lived here: the lens-flip control over the frozen cnocby plates, and the
  // plate DRIFT CONTRACT that read public/landing-maps/<town>.<lens>.svg off disk and
  // pinned each plate's seed + style + town stamp. Both the plates and the section that
  // showed them are removed, so neither arm has a subject. The realm-map preview plates
  // in the same directory are a DIFFERENT surface and still ship.

  test('commons fallback renders six labeled placeholder slots when the gallery is unreachable', async () => {
    renderLanding();
    await screen.findByText(landing.commons.h2);
    // W1 (owner order 2026-07-21): the commons strip is fed dynamically from the
    // gallery into SIX slots; real towns fill first, decorative placeholders back-
    // fill the rest and are LABELED ' (placeholder)'. jsdom has no Supabase config
    // → fetchPublicGallery resolves empty → all six slots render as placeholders
    // (zero layout shift, no empty grid).
    expect(landing.commons.cards).toHaveLength(6);
    for (const card of landing.commons.cards) {
      expect(await screen.findByText(`${card.name} (placeholder)`)).toBeTruthy();
    }
  });
});
