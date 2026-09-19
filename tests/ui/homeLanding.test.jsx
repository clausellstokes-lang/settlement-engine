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
 *     unconfigured) the strip renders the Create page's three curated Founding
 *     Worlds with their real 'Fork this sample' buttons, and NOTHING on the page
 *     is labelled '(placeholder)' — the six decorative cards (invented names,
 *     invented authors, a 'City' of 412) were deleted on 2026-09-18.
 *
 * Copy is asserted against the `landing` registry object and the frozen
 * fixture, so a copy/fixture change is a data change here, never a literal edit.
 */

import { describe, test, expect, afterEach, vi } from 'vitest';
import { render, cleanup, screen, within } from '@testing-library/react';
import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';
import HomeLanding from '../../src/components/HomeLanding.jsx';
import { landing, tl } from '../../src/copy/landing.js';
import { fixture } from '../../src/components/home/landingFixture.js';
import { SAMPLE_SETTLEMENTS } from '../../src/data/sampleSettlements.js';
import { BOTTOM_NAV_H, FOOTER_INSET } from '../../src/components/theme.js';

// Analytics is fire-and-forget (landing_funnel_used via the SM-5-pattern lazy
// helper — lib/landingFunnelAnalytics.js imports track + EVENTS from this
// module); stub it so the mount path stays quiet.
vi.mock('../../src/lib/analytics.js', () => ({
  track: vi.fn(),
  Funnel: {},
  EVENTS: new Proxy({}, { get: (_t, k) => String(k) }),
}));

// THE COMMONS STRIP fetches the public gallery on below-fold mount. jsdom has no
// Supabase config, so the REAL module resolves empty — the fallback state every
// other test in this file reads. This mock KEEPS that default (items: []) and lets
// the real-rows arm below hand the strip three published towns, which is the other
// half of the rule: three or more real rows and the real rows render.
// `gate`, when set, HOLDS the fetch unsettled so the in-flight state can be read.
const galleryRows = vi.hoisted(() => ({ items: [], gate: null }));
vi.mock('../../src/lib/gallery.js', () => ({
  fetchPublicGallery: async () => {
    if (galleryRows.gate) await galleryRows.gate;
    return { items: galleryRows.items, hasMore: false, total: galleryRows.items.length };
  },
}));

afterEach(() => { cleanup(); galleryRows.items = []; galleryRows.gate = null; });

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
  // THE FADED TAIL + THE CAPPED TRACK (owner orders 2026-09-17, "Fix the small visual
  // defects"). The header is transparent, so a cream stop's empty bottom band read as a
  // plain strip under the arrow; each translucent-cream stop now fades that band into
  // the film over exactly its own height (the dark closer keeps its scene). The two-column
  // grid's track minimum is capped at the column, so a 390px phone no longer scrolls
  // sideways. jsdom has no layout and its CSSOM drops mask declarations, so these read
  // the style props React rendered; e2e/visual-polish.spec.js measures both in Chromium.
  // ⚠ THIS ARM USED TO RUN AT BOTH WIDTHS, AND NOW RUNS AT ONE. At phone width the
  // below-fold chunk is NOT MOUNTED (ODQ §934.27, pinned in its own block at the end of
  // this file), so there are no cream stops there to measure and the mobile pass would
  // wait out its timeout on a page behaving exactly as ordered. ⛔ THE CONSEQUENCE,
  // RECORDED RATHER THAN HIDDEN: LandingBelowFold's own `isMobile` branches — this tail
  // height among them — are now unreachable in production, because its ONE mount is
  // gated on `!isMobile`. Retiring them is a separate, larger edit in a file other lanes
  // hold work in; it is deliberately deferred and written down, not a bug to re-find.
  test('cream stops fade their empty tails into the film, and the two-column track never exceeds its column', async () => {
    const renderedStyle = (el) => {
      const key = Object.keys(el).find((k) => k.startsWith('__reactProps$'));
      return (key && el[key].style) || {};
    };
    const { container } = renderLanding({ isMobile: false });
    await screen.findByText(landing.closer.h2, {}, { timeout: 10_000 });
    const tailPx = 84;
    const cream = [...container.querySelectorAll('section.sf-landing-scene-cream')];
    expect(cream.map((section) => section.id)).toEqual(['forge', 'voice', 'realm', 'commons']);
    for (const section of cream) {
      expect(section.style.paddingBottom, `${section.id} tail height`).toBe(`${tailPx}px`);
      const style = renderedStyle(section);
      expect(style.WebkitMaskImage, `${section.id} carries the prefixed mask too`).toBe(style.maskImage);
      expect(style.maskImage, `${section.id} fades its tail`).toMatch(new RegExp(`^linear-gradient\\(.+ calc\\(100% - ${tailPx}px\\), transparent\\)$`));
    }
    const closer = container.querySelector('#closer');
    expect(renderedStyle(closer).maskImage).toBeUndefined();
    const grids = [...container.querySelectorAll('#forge > div, #realm > div')].filter((el) => /380px/.test(el.style.gridTemplateColumns));
    expect(grids.length).toBe(2);
    for (const grid of grids) {
      expect(grid.style.gridTemplateColumns).toBe('repeat(auto-fit, minmax(min(380px, 100%), 1fr))');
    }
  });

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

    // The commons fallback's fork controls are the OPPOSITE case and belong in
    // the same pin: they are REAL buttons, because they really forge (the Create
    // page's own action). §3.8 forbids decorative chips that look like controls,
    // not controls that work.
    const forks = await screen.findAllByRole('button', { name: /Fork this sample/ });
    expect(forks).toHaveLength(SAMPLE_SETTLEMENTS.length);

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

  // ⛔ THE LAZY SEAM ONLY PAYS IF NOTHING MOUNTS BEFORE THE FETCH SETTLES. `tiles`
  // starts null, and treating null as "no rows yet" made the fallback branch true on
  // the FIRST render: React.lazy mounts, requests its chunk, and every landing visit
  // paid a second serial round-trip for a strip that real rows were about to replace.
  // React.lazy imports on MOUNT, so "the strip has not mounted" is "the chunk has not
  // been requested" — which is what these three absences read, against a positive
  // control (the reserve) that proves the section rendered at all.
  test('the fallback chunk is not requested until the gallery fetch settles', async () => {
    let release;
    galleryRows.gate = new Promise((resolve) => { release = resolve; });
    renderLanding();
    await screen.findByText(landing.commons.h2);

    // In flight: the section mounts nothing and holds the footprint of the state
    // this path ENDS in. jsdom has no gallery backend, so fetchPublicGallery cannot
    // return a row and the curated strip is certain — holding the row grid's box
    // here would only move the jump from the Suspense swap to the settle moment,
    // which is the defect this arm pins shut. The attribute IS the choice.
    const reserve = screen.getByTestId('commons-awaiting-gallery');
    expect(reserve.getAttribute('data-reserve')).toBe('curated');
    expect(screen.queryByRole('heading', { name: 'Founding Worlds' })).toBeNull();
    expect(screen.queryByText(SAMPLE_SETTLEMENTS[0].name)).toBeNull();

    // Settled (empty) — now, and only now, the curated strip is reached for.
    release();
    galleryRows.gate = null;
    expect(await screen.findByRole('heading', { name: 'Founding Worlds' })).toBeTruthy();
    expect(screen.queryByTestId('commons-awaiting-gallery')).toBeNull();
  });

  test('three or more real published rows: the strip renders the real towns', async () => {
    galleryRows.items = [
      { slug: 'ashford-9f2',    name: 'Ashford-on-Vell', tier: 'town',    population: 1840, netVotes: 12, imageUrl: '' },
      { slug: 'harrowgate-3a1', name: 'Harrowgate',      tier: 'city',    population: 9200, netVotes: 7,  imageUrl: '' },
      { slug: 'pellmoor-77c',   name: 'Pellmoor',        tier: 'village', population: 610,  netVotes: 3,  imageUrl: '' },
    ];
    renderLanding();
    await screen.findByText(landing.commons.h2);

    for (const row of galleryRows.items) {
      expect(await screen.findByText(row.name), `missing real row: ${row.name}`).toBeTruthy();
    }
    // Each real row carries its vote count (registry copy) and a REAL route out.
    expect(screen.getByText(tl('commons.votes', { n: 12 }))).toBeTruthy();
    expect(screen.getAllByRole('button', { name: landing.commons.open })).toHaveLength(3);
    // ...and the curated trio yields to them: the samples are the FALLBACK, not a
    // permanent strip. (queryByRole returns null, so this negative carries its own
    // liveness — the three row names above are asserted present on the same render.)
    expect(screen.queryByRole('heading', { name: 'Founding Worlds' })).toBeNull();
  });

  test('commons fallback renders the curated Founding Worlds, never invented towns', async () => {
    const { container } = renderLanding();
    await screen.findByText(landing.commons.h2);
    // jsdom has no Supabase config → fetchPublicGallery resolves empty → fewer
    // than three real rows → the Create page's curated trio renders instead of
    // the deleted decorative cards. Names come from the DATA module, so this is a
    // data assertion, never a literal edit.
    for (const sample of SAMPLE_SETTLEMENTS) {
      expect(await screen.findByText(sample.name), `missing curated sample: ${sample.name}`).toBeTruthy();
    }
    // The Create page's own heading + lead-in travel with the strip (one source).
    expect(screen.getByRole('heading', { name: 'Founding Worlds' })).toBeTruthy();

    // ⛔ THE REGRESSION THIS PIN EXISTS FOR: the label the decorative cards wore.
    // anchored: the three curated sample names and the Founding Worlds heading are asserted PRESENT on this same render above, so a landing that rendered nothing reds there first
    expect(container.textContent).not.toMatch(/\(placeholder\)/);
    // And the fixtures themselves are gone from the registry, not merely unused.
    expectAbsentWithAnchor(Object.keys(landing.commons), 'cards', 'votes', 'landing.commons copy block');
    expectAbsentWithAnchor(Object.keys(landing.commons), 'fork', 'open', 'landing.commons copy block');
  });
});

/**
 * ⛔ THE PHONE LANDING IS THE HERO ALONE (the owner, ODQ §934.27).
 *
 * "for the landing page, I only want this part to show, not the other scroll down" — the
 * headline, the one paragraph, the two actions, the free line — "and its background image
 * as the only one."
 *
 * NOT HIDDEN, NOT MOUNTED. React.lazy requests its chunk on MOUNT, so a `display:none` or
 * a CSS media query would still make the phone fetch the below-fold chunk, the scroll
 * film and every painting the five scenes name. That is the difference these arms measure,
 * and it is measurable in jsdom precisely because it is a MOUNT question and not a layout
 * one: the below-fold's root is either in the tree or it is not.
 */
describe('HomeLanding — §934.27: at phone width the hero is the whole page', () => {
  /** The four texts the owner named, read from the registry rather than as literals. */
  const HERO_TEXTS = () => [landing.hero.h1a + landing.hero.h1b, landing.hero.sub, landing.hero.reassure];

  test("the hero's four texts are all there", () => {
    const { container } = renderLanding({ isMobile: true });
    const h1 = container.querySelectorAll('h1');
    expect(h1).toHaveLength(1);
    expect(h1[0].textContent).toBe(landing.hero.h1a + landing.hero.h1b);
    expect(screen.getByText(landing.hero.sub)).toBeTruthy();
    expect(screen.getByText(landing.hero.reassure)).toBeTruthy();
    // The two actions: the forge CTA and Sign in (the latter only while signed out).
    expect(screen.getByRole('button', { name: landing.hero.cta })).toBeTruthy();
    expect(screen.getByRole('button', { name: landing.hero.signin })).toBeTruthy();
    for (const text of HERO_TEXTS()) {
      expect(container.textContent, `the hero lost: ${text}`).toContain(text);
    }
  });

  test('the below-fold root is ABSENT — the chunk is never reached for', async () => {
    const { container } = renderLanding({ isMobile: true });
    // ⛔ ANTI-VACUITY, and it is the whole arm: the negative is anchored on the hero,
    // which is asserted present on THIS render, so "the closer heading is missing"
    // cannot pass because the page failed to render.
    const rendered = [...container.querySelectorAll('h1, h2')].map((h) => h.textContent);
    expectAbsentWithAnchor(
      rendered,
      landing.closer.h2,
      landing.hero.h1a + landing.hero.h1b,
      'the phone landing renders the hero and nothing below the fold',
    );
    for (const id of ['forge', 'voice', 'realm', 'commons', 'closer']) {
      expect(container.querySelector(`#${id}`), `the below-fold section #${id} mounted on a phone`).toBeNull();
    }
    expect(container.querySelectorAll('section.sf-landing-scene-cream')).toHaveLength(0);
    // A microtask turn: React.lazy resolves on mount, so if anything had mounted the
    // chunk its content would arrive by now rather than after this assertion.
    await Promise.resolve();
    expect(container.querySelector('#closer'), 'the below-fold arrived a tick later').toBeNull();
  });

  test('the hero painting is the ONLY image on the page', () => {
    const { container } = renderLanding({ isMobile: true });
    // ⚠ READ THE STYLE REACT RENDERED, NOT THE CSSOM. The hero's scene is a CUSTOM
    // PROPERTY (`--sf-scene`), and jsdom's CSSOM is lossy about those exactly as it is
    // about the mask declarations the cream-stop arm above reads this way; a CSSOM read
    // could return nothing and call an unchecked page clean. This is the same
    // `__reactProps$` idiom, applied to every element rather than to one.
    const urls = [...container.querySelectorAll('*')].flatMap((el) => {
      const key = Object.keys(el).find((k) => k.startsWith('__reactProps$'));
      const style = (key && el[key].style) || {};
      return Object.values(style)
        .filter((v) => typeof v === 'string')
        .flatMap((v) => [...v.matchAll(/url\((['"]?)([^'")]+)\1\)/g)].map((m) => m[2]));
    });
    expect(urls.length, 'the phone landing paints no image at all — is the hero scene gone?').toBe(1);
    expect(urls[0]).toMatch(/still-0-desk/);
    expect(container.querySelectorAll('img, picture, video')).toHaveLength(0);
  });

  test('the hero fills the band between the header and the bar', () => {
    const { container } = renderLanding({ isMobile: true });
    const hero = container.querySelector('section[aria-labelledby="sf-hero-title"]');
    expect(hero.style.minHeight).toBe(`calc(100vh - ${FOOTER_INSET} - ${BOTTOM_NAV_H})`);
  });

  test('TABLET AND DESKTOP ARE UNCHANGED: the below fold still mounts', async () => {
    const { container } = renderLanding({ isMobile: false });
    expect(await screen.findByText(landing.closer.h2, {}, { timeout: 10_000 })).toBeTruthy();
    expect(container.querySelector('#forge'), 'the below fold stopped mounting above the phone').not.toBeNull();
  });
});
