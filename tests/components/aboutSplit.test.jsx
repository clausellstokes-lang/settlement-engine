/**
 * @vitest-environment jsdom
 *
 * tests/components/aboutSplit.test.jsx — THE ABOUT SPLIT's pin set (design §5).
 *
 * docs/DESIGN_ABOUT_PAGES.md ordered the About page split into two real pages and
 * named five pins. Four are here; the fifth (the About ▾ dropdown's three items)
 * is DEFERRED WITH REASON, not dropped — see the last describe block.
 *
 *   1. MAPPING TOTALITY — every unit of the pre-split page is assigned to exactly
 *      one destination page + section: none orphaned, none double-homed.
 *   2. ANCHOR SURVIVAL — every assigned anchor is REALLY RENDERED by its page (a
 *      DOM check, so the manifest cannot promise an id no page emits), and every
 *      legacy `?tab=` deep link redirects onto it.
 *   3. HEADER PARITY — all five standalone page families render through the ONE
 *      header writer (primitives/PageHeader); a source scan forbids the About
 *      pages re-rolling lookalike header markup.
 *   4. HEADING-TREE SANITY — exactly one h1 per page and no skipped levels (the
 *      a11y floor the accordion's card-local headings never allowed).
 *
 * ANTI-VACUITY NOTE. Pin 1's denominator is the INDEPENDENT census below, taken
 * from the pre-split `HowToUse.jsx` (two Disclosure collapsibles: the manifesto's
 * six bands + the handbook's six TABS ids) and written here as a literal. Deriving
 * it from the manifest under test would prove only that a list equals itself.
 */
import { describe, it, expect, afterEach, vi } from 'vitest';
import { render, cleanup } from '@testing-library/react';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import {
  ABOUT_UNITS, ABOUT_WHAT_VIEW, ABOUT_GUIDE_VIEW, LEGACY_ABOUT_TABS,
  anchorFor, destinationForLegacyTab, destinationForLegacySearch, unitsForView,
} from '../../src/lib/aboutMapping.js';
import { ROUTES, NAV, isKnownView, viewToPath, redirectForView } from '../../src/lib/routes.js';

const read = (p) => readFileSync(resolve(process.cwd(), p), 'utf-8');

afterEach(cleanup);

// ForgeExactDemo + the FAQ read a few store selectors; a minimal anon mock keeps
// both page mounts quiet (same shape aboutManifesto.test.jsx uses).
const storeState = { auth: { tier: 'anon' } };
vi.mock('../../src/store/index.js', () => {
  function useStore(selector) { return selector(storeState); }
  useStore.subscribe = () => () => {};
  useStore.getState = () => storeState;
  return { useStore };
});

// ── The independent census of the PRE-SPLIT About page ───────────────────────
// Collapsible 1 "What this is" → AboutManifesto's six bands, in render order.
const LEGACY_MANIFESTO_BANDS = ['hero', 'premise', 'covenant', 'mechanism', 'ai', 'close'];
// Collapsible 2 "The Keeper's Handbook" → its TABS ids, in tab-strip order. This
// was ALSO the page's entire deep-link grammar (`/how-to?tab=<id>`).
const LEGACY_HANDBOOK_TABS = ['quick', 'power', 'living', 'ref', 'compare', 'faq'];
const LEGACY_UNITS = [...LEGACY_MANIFESTO_BANDS, ...LEGACY_HANDBOOK_TABS];

/**
 * THE INDEPENDENT ANCHOR CONTRACT — the published `#anchor` of every unit, and
 * the page it lives on, written here as LITERALS.
 *
 * Why literals: the pages derive their section ids from the manifest under test
 * (`anchorFor(...)`), so a DOM check alone proves only that the page renders
 * whatever the manifest currently says — the self-referential pin class, and a
 * negative control confirmed it went green under a corrupted anchor. This table
 * is the second, independent truth: it is also THE PUBLIC CONTRACT, because each
 * string is a URL fragment that outside links will carry. Changing one is a
 * BREAKING CHANGE to `/about/...#anchor` links, so it must be changed here too,
 * deliberately, in the same commit.
 */
const PUBLISHED_ANCHORS = Object.freeze({
  hero: ['about-what-this-is', 'what-this-is'],
  premise: ['about-what-this-is', 'the-premise'],
  covenant: ['about-what-this-is', 'the-covenant'],
  mechanism: ['about-what-this-is', 'how-it-works'],
  ai: ['about-what-this-is', 'where-the-ai-fits'],
  close: ['about-what-this-is', 'examine-it'],
  compare: ['about-what-this-is', 'how-we-compare'],
  quick: ['about-guide', 'quick-start'],
  power: ['about-guide', 'power-user'],
  living: ['about-guide', 'the-living-world'],
  ref: ['about-guide', 'reference'],
  faq: ['about-guide', 'faq'],
});

async function renderWhatThisIs() {
  const Page = (await import('../../src/components/about/AboutWhatThisIs.jsx')).default;
  return render(<Page />);
}
async function renderGuide() {
  const Page = (await import('../../src/components/HowToUse.jsx')).default;
  return render(<Page />);
}

describe('About split — pin 1: the mapping is a TOTALITY, not a vibe', () => {
  it('every unit of the pre-split page appears in the manifest exactly once', () => {
    const ids = ABOUT_UNITS.map((u) => u.id);
    expect(new Set(ids).size, 'a unit id is listed twice').toBe(ids.length);
    expect([...ids].sort()).toEqual([...LEGACY_UNITS].sort());
  });

  it('no unit is ORPHANED — each names a real destination view and a non-empty anchor', () => {
    for (const u of ABOUT_UNITS) {
      expect([ABOUT_WHAT_VIEW, ABOUT_GUIDE_VIEW], `${u.id} destination`).toContain(u.view);
      expect(isKnownView(u.view), `${u.id} → unroutable view ${u.view}`).toBe(true);
      expect(u.anchor, `${u.id} anchor`).toMatch(/^[a-z][a-z0-9-]*$/);
    }
  });

  it('no unit is DOUBLE-HOMED — anchors are unique across BOTH pages', () => {
    // Global uniqueness (not per-page) so a section can never be reachable by the
    // same #anchor on two different pages.
    const anchors = ABOUT_UNITS.map((u) => u.anchor);
    expect(new Set(anchors).size).toBe(anchors.length);
  });

  it('the split honours the conceptual / operational rule, including the one crossing', () => {
    const whatIds = unitsForView(ABOUT_WHAT_VIEW).map((u) => u.id);
    const guideIds = unitsForView(ABOUT_GUIDE_VIEW).map((u) => u.id);
    // Every manifesto band is conceptual; the operational tabs stay on the guide.
    expect(whatIds).toEqual([...LEGACY_MANIFESTO_BANDS, 'compare']);
    expect(guideIds).toEqual(['quick', 'power', 'living', 'ref', 'faq']);
    // The crossing is deliberate: "How We Compare" IS the positioning ladder,
    // which design §1 names as conceptual. If this flips, the /compare* redirects
    // and CompareSection's home must move with it.
    expect(destinationForLegacyTab('compare').view).toBe(ABOUT_WHAT_VIEW);
  });

  it('the two pages together re-home the whole inventory (nothing evaporated)', () => {
    const homed = [...unitsForView(ABOUT_WHAT_VIEW), ...unitsForView(ABOUT_GUIDE_VIEW)];
    expect(homed.length).toBe(LEGACY_UNITS.length);
  });
});

describe('About split — pin 2: anchor survival', () => {
  it('the legacy deep-link set is exactly the old ?tab= grammar', () => {
    expect([...LEGACY_ABOUT_TABS].sort()).toEqual([...LEGACY_HANDBOOK_TABS].sort());
  });

  it('every legacy ?tab= link redirects to its section — never a 404, never the wrong page', () => {
    for (const tab of LEGACY_HANDBOOK_TABS) {
      const dest = destinationForLegacySearch(`?tab=${tab}`);
      const unit = ABOUT_UNITS.find((u) => u.legacyTab === tab);
      expect(dest.view, `?tab=${tab} page`).toBe(unit.view);
      expect(dest.hash, `?tab=${tab} anchor`).toBe(`#${unit.anchor}`);
    }
  });

  it('a bare /how-to, an unknown tab, and a malformed query all land on What this Is', () => {
    for (const search of ['', '?', '?tab=', '?tab=nope', '?x=1']) {
      expect(destinationForLegacySearch(search)).toEqual({ view: ABOUT_WHAT_VIEW, hash: '' });
    }
  });

  it('routes.js forwards every retired About URL (and the compare family) accordingly', () => {
    expect(redirectForView('about')).toEqual({ view: ABOUT_WHAT_VIEW, hash: '' });
    expect(redirectForView('howto', '?tab=faq'))
      .toEqual({ view: ABOUT_GUIDE_VIEW, hash: `#${anchorFor('faq')}` });
    for (const v of ['compare', 'compare-chatgpt', 'compare-worldographer', 'compare-kanka']) {
      expect(redirectForView(v), `${v} redirect`)
        .toEqual({ view: ABOUT_WHAT_VIEW, hash: `#${anchorFor('compare')}` });
    }
    // A live page must NEVER be treated as retired.
    expect(redirectForView(ABOUT_WHAT_VIEW)).toBe(null);
    expect(redirectForView(ABOUT_GUIDE_VIEW)).toBe(null);
  });

  it('the manifest matches the PUBLISHED anchor contract exactly', () => {
    // The independent side of the pin: manifest ⟷ literal contract. A typo in
    // either is a red, and a deliberate change must be made in both places —
    // which is the point, because these strings are live URL fragments.
    const fromManifest = Object.fromEntries(ABOUT_UNITS.map((u) => [u.id, [u.view, u.anchor]]));
    expect(fromManifest).toEqual({ ...PUBLISHED_ANCHORS });
  });

  it('What this Is RENDERS every PUBLISHED anchor assigned to it', async () => {
    const { container } = await renderWhatThisIs();
    for (const [id, [view, anchor]] of Object.entries(PUBLISHED_ANCHORS)) {
      if (view !== ABOUT_WHAT_VIEW) continue;
      expect(container.querySelector(`#${anchor}`), `${id}: missing section #${anchor}`).toBeTruthy();
    }
  });

  it('the Practical Guide RENDERS every PUBLISHED anchor assigned to it', async () => {
    const { container } = await renderGuide();
    for (const [id, [view, anchor]] of Object.entries(PUBLISHED_ANCHORS)) {
      if (view !== ABOUT_GUIDE_VIEW) continue;
      expect(container.querySelector(`#${anchor}`), `${id}: missing section #${anchor}`).toBeTruthy();
    }
  });

  it('each page renders ONLY its own anchors (a section cannot leak to both pages)', async () => {
    const what = (await renderWhatThisIs()).container;
    for (const [id, [view, anchor]] of Object.entries(PUBLISHED_ANCHORS)) {
      if (view === ABOUT_WHAT_VIEW) continue;
      expect(what.querySelector(`#${anchor}`), `${id} leaked onto What this Is`).toBeNull();
    }
    cleanup();
    const guide = (await renderGuide()).container;
    for (const [id, [view, anchor]] of Object.entries(PUBLISHED_ANCHORS)) {
      if (view === ABOUT_GUIDE_VIEW) continue;
      expect(guide.querySelector(`#${anchor}`), `${id} leaked onto the Practical Guide`).toBeNull();
    }
  });

  it('both pages are real, distinct routes with the paths the order named', () => {
    expect(viewToPath(ABOUT_WHAT_VIEW)).toBe('/about/what-this-is');
    expect(viewToPath(ABOUT_GUIDE_VIEW)).toBe('/about/guide');
    expect(viewToPath('about')).toBe('/about');
    // The parent "About" nav cell points at the default page (design §1 / §4).
    expect(NAV.find((n) => n.label === 'About').id).toBe(ABOUT_WHAT_VIEW);
  });
});

describe('About split — anchor survival, the SCROLL half', () => {
  // Surviving as a URL fragment is only half the promise: `history.replaceState`
  // performs no fragment navigation, and a cold load looks for the anchor before
  // React has rendered it. Without the hook, a translated deep link would land at
  // page top — the right page, the wrong place. These pins hold the landing.
  const withHash = async (hash, mount) => {
    const orig = window.location.pathname + window.location.search + window.location.hash;
    window.history.replaceState({}, '', `/about/x${hash}`);
    const scrolled = [];
    const proto = window.HTMLElement.prototype;
    const had = Object.prototype.hasOwnProperty.call(proto, 'scrollIntoView');
    const prev = proto.scrollIntoView;
    proto.scrollIntoView = function scrollIntoViewStub() { scrolled.push(this.id); };
    // jsdom's rAF is real but ASYNC, and under a loaded parallel run the event
    // loop can starve well past any fixed sleep — a `setTimeout(30)` here failed
    // in a 11-worker full-suite run while passing every time in isolation, which
    // is a flaky pin, not a finding. POLL for the effect instead of guessing a
    // duration: the assertion still fails fast on a genuinely unwired hook
    // (it just waits out the deadline first).
    try {
      await mount();
      const deadline = Date.now() + 3000;
      while (scrolled.length === 0 && Date.now() < deadline) {
        await new Promise((r) => setTimeout(r, 10));
      }
      // One extra beat so a WRONG extra scroll would still be observed by the
      // negative cases below rather than racing past them.
      await new Promise((r) => setTimeout(r, 20));
    } finally {
      if (had) proto.scrollIntoView = prev; else delete proto.scrollIntoView;
      window.history.replaceState({}, '', orig);
    }
    return scrolled;
  };

  it('the Practical Guide scrolls a translated ?tab= deep link onto its section', async () => {
    const scrolled = await withHash(`#${anchorFor('faq')}`, renderGuide);
    expect(scrolled).toContain(anchorFor('faq'));
  });

  it('What this Is scrolls the /compare* destination onto the positioning ladder', async () => {
    const scrolled = await withHash(`#${anchorFor('compare')}`, renderWhatThisIs);
    expect(scrolled).toContain(anchorFor('compare'));
  });

  it('a retired or unknown fragment is a no-op, never a throw and never a jump', async () => {
    const scrolled = await withHash('#no-such-section', renderGuide);
    expect(scrolled).toEqual([]);
  });

  it('no fragment at all scrolls nothing (the plain page visit)', async () => {
    const scrolled = await withHash('', renderGuide);
    expect(scrolled).toEqual([]);
  });
});

describe('About split — pin 3: header parity (ONE header writer)', () => {
  // The five standalone page families named by design §2 — the About family is
  // joining the grammar the other four already share.
  const PAGE_FAMILIES = [
    'src/components/CompendiumPanel.jsx',
    'src/components/GalleryPage.jsx',
    'src/components/SettlementsPanel.jsx',
    'src/components/about/AboutWhatThisIs.jsx',
    'src/components/HowToUse.jsx',
  ];

  it('every page family consumes primitives/PageHeader', () => {
    for (const f of PAGE_FAMILIES) {
      expect(read(f), `${f} must import PageHeader`).toMatch(/import PageHeader from '[^']*primitives\/PageHeader\.jsx'/);
      expect(read(f), `${f} must render <PageHeader`).toMatch(/<PageHeader\b/);
    }
  });

  // THE LIVENESS ANCHOR for every source scan below (the vacuous-negative class).
  // A source-scan negative is TRUE for two reasons — the file really is free of
  // the forbidden markup, or `read(f)` drifted out from under the test (the file
  // was renamed, moved, or emptied) and the scan now searches nothing. The second
  // reading survives forever and silently. Each file therefore names a POSITIVE
  // token it is SUPPOSED to contain, asserted first: the token is JSX in the same
  // module, so it travels exactly the path a stray <h1> or <Disclosure> would and
  // vanishes under the same drift. A hardcoded constant the renderer never emits
  // would re-introduce the vacuity one level up, so each anchor is real markup.
  const LIVE_ANCHOR = Object.freeze({
    'src/components/about/AboutWhatThisIs.jsx': /<PageHeader\b/,
    'src/components/HowToUse.jsx': /<PageHeader\b/,
    'src/components/about/CompareSection.jsx': /<h2[\s>]/,
    'src/components/howto/AboutManifesto.jsx': /<h2[\s>]/,
  });

  /** Read a scanned source, proving it is LIVE before any negative is asked of it. */
  const readLive = (f) => {
    const src = read(f);
    expect(
      src,
      `LIVENESS ANCHOR: ${f} does not contain the markup it is supposed to render`
      + ` (${LIVE_ANCHOR[f]}). Every negative below would pass vacuously against an`
      + ` empty or drifted read — fix the path or the component, never the assertion.`,
    ).toMatch(LIVE_ANCHOR[f]);
    return src;
  };

  it('the About pages roll NO lookalike header markup of their own', () => {
    // The projection-as-second-truth class applied to chrome: a hand-rolled <h1>
    // beside the shared header is how a "shared" idiom quietly forks. The pages
    // may render section h2/h3; the h1 belongs to PageHeader alone.
    for (const f of ['src/components/about/AboutWhatThisIs.jsx', 'src/components/HowToUse.jsx',
      'src/components/about/CompareSection.jsx', 'src/components/howto/AboutManifesto.jsx']) {
      const src = readLive(f);
      // anchored: readLive() just proved this source renders its own PageHeader/h2 markup, so an absent <h1> is a real exclusion and not an empty read.
      expect(src, `${f} must not hand-roll an <h1>`).not.toMatch(/<h1[\s>]/);
    }
  });

  it('the retired accordion machinery is gone from the About family', () => {
    // Design §0.2: the collapsing cards are REMOVED, headers and all.
    // ANCHORED on the import + the element, never the bare word — a docstring
    // that EXPLAINS the removal must not read as the thing it removed (the
    // unanchored-extractor class: the prose gets matched instead of the code).
    for (const f of ['src/components/HowToUse.jsx', 'src/components/about/AboutWhatThisIs.jsx']) {
      const src = readLive(f);
      // anchored: readLive() proved the source is live markup, so "no Disclosure import" measures REMOVAL rather than a read() that found nothing to search.
      expect(src, `${f} still imports Disclosure`).not.toMatch(/^import .*Disclosure\.jsx';$/m);
      // anchored: same readLive() liveness anchor — a drifted or empty source reds there, never silently here.
      expect(src, `${f} still renders <Disclosure`).not.toMatch(/<Disclosure\b/);
      // anchored: same readLive() liveness anchor — a drifted or empty source reds there, never silently here.
      expect(src, `${f} still renders a tab strip`).not.toMatch(/role="tab"/);
    }
  });
});

describe('About split — pin 4: heading-tree sanity (the a11y floor)', () => {
  /** Levels of every heading in document order. */
  const levels = (container) =>
    [...container.querySelectorAll('h1,h2,h3,h4,h5,h6')].map((el) => Number(el.tagName[1]));

  for (const [name, mount] of [['What this Is', renderWhatThisIs], ['Practical Guide', renderGuide]]) {
    it(`${name}: exactly one h1, and no skipped levels`, async () => {
      const { container } = await mount();
      const ls = levels(container);
      expect(ls.filter((l) => l === 1).length, `${name} h1 count`).toBe(1);
      expect(ls[0], `${name} must OPEN with its h1`).toBe(1);
      let deepest = 1;
      for (const l of ls) {
        expect(l, `${name} skips a heading level (…${deepest} → ${l})`).toBeLessThanOrEqual(deepest + 1);
        deepest = Math.max(deepest, l);
      }
    });
  }
});

describe('About split — §3 the in-page section nav (the MAY, ruled BUILD)', () => {
  // Design §3: "each page MAY carry the standard in-page section nav IF the
  // Compendium pattern has one (match, never invent)". It has one — the hub-card
  // grid of real, anchor-carrying hrefs in compendium/CompendiumDashboard.jsx —
  // and the Practical Guide is a long flat page, so the glance layer is built.
  //
  // What this Is deliberately has NO nav: it is three components deep and renders
  // two sections, so a table of contents longer than the page it indexes would be
  // furniture, not legibility. Recorded, not forgotten.

  it('the guide lists EVERY one of its sections, in reading order, and no others', async () => {
    const { container } = await renderGuide();
    const hrefs = [...container.querySelectorAll('nav a')].map((a) => a.getAttribute('href'));
    expect(hrefs).toEqual(unitsForView(ABOUT_GUIDE_VIEW).map((u) => `#${u.anchor}`));
  });

  /**
   * The nav's links, with the COUNT asserted first.
   *
   * A `for (const a of querySelectorAll('nav a'))` body proves nothing when the
   * selector matches nothing: delete the nav and every per-link assertion below
   * passes on zero iterations. (This is not hypothetical — an executed negative
   * control caught exactly that shape here before this guard existed.) The
   * expected count comes from the manifest, which is the independent side.
   */
  const navLinks = (container) => {
    const links = [...container.querySelectorAll('nav a')];
    expect(
      links.length,
      'LIVENESS ANCHOR: the guide rendered no section-nav links at all, so every'
      + ' per-link assertion below would pass over an empty list.',
    ).toBe(unitsForView(ABOUT_GUIDE_VIEW).length);
    return links;
  };

  it('every nav link targets a section the page really renders', async () => {
    // The nav and the sections both read the manifest, so this is the DOM-side
    // check that the manifest's promise is kept in both directions at once.
    const { container } = await renderGuide();
    for (const a of navLinks(container)) {
      const id = a.getAttribute('href').slice(1);
      expect(container.querySelector(`#${id}`), `nav links #${id}, which no section renders`).toBeTruthy();
    }
  });

  it('each nav label is the heading of the section it points at (no second truth)', async () => {
    // The nav introduces a SECOND place the section's name is written. Bind the two
    // so a renamed heading cannot leave a stale label in the table of contents.
    const { container } = await renderGuide();
    for (const a of navLinks(container)) {
      const id = a.getAttribute('href').slice(1);
      const heading = container.querySelector(`#${id}`).querySelector('h2');
      expect(heading, `#${id} has no h2 to label`).toBeTruthy();
      expect(a.textContent, `nav label for #${id}`).toContain(heading.textContent);
    }
  });

  it('the nav lands its target CLEAR of the sticky header, the way the Compendium does', async () => {
    // App's ribbon is `position:'sticky', top:0` (App.jsx), so a bare fragment jump
    // parks the section heading UNDERNEATH it. The Compendium answers this with
    // scroll-margin-top (its ANCHOR_SCROLL_MARGIN, 84). The guide derives the same
    // 84 from the chrome token it measures — CHROME.headerDesktop (60) + SP.xxl
    // (24) — so the two surfaces cannot drift apart through a copied magic number.
    const { container } = await renderGuide();
    for (const u of unitsForView(ABOUT_GUIDE_VIEW)) {
      const el = container.querySelector(`#${u.anchor}`);
      expect(el.style.scrollMarginTop, `#${u.anchor} scroll margin`).toBe('84px');
    }
  });
});

describe('About split — pin 5: the About ▾ dropdown (DEFERRED, with reason)', () => {
  // DEFERRED — DOCUMENTED, NOT A BUG TO RE-FIND. Design §4/§5's fifth pin asserts
  // the dropdown's three items (What this Is · Practical Guide · Founders) are
  // present, ordered and routed. §6 sequences that work AFTER LD-5's dropdown
  // machinery exists, and at this commit it does NOT: the desktop ribbon renders
  // one flat <button> per NAV cell, and NO NAV-RIBBON DROPDOWN EXISTS.
  // (Precisely that, not "no menu layer at all" — the estate does have real menus,
  // e.g. components/AccountMenu.jsx and townMap/SettlementMapExportMenu.jsx. What
  // is missing is the RIBBON dropdown grammar, which is exactly LD-5's subject.
  // The ribbon's own file is moving under LD-2, so the claim is deliberately made
  // about the ribbon rather than about whichever module currently holds it.)
  // Building a one-off About menu here would fork the grammar LD-5 exists to create.
  //
  // What CAN be pinned today is that every item LD-5 will hang off About is
  // already a real, routable destination — so LD-5 becomes pure chrome work.
  it('all three future dropdown targets are real routes today', () => {
    for (const view of [ABOUT_WHAT_VIEW, ABOUT_GUIDE_VIEW, 'founders']) {
      expect(isKnownView(view), `${view} must be routable`).toBe(true);
      expect(ROUTES.find((r) => r.view === view).path, `${view} path`).toMatch(/^\//);
    }
    expect(viewToPath('founders')).toBe('/founders');
  });

  it('the ribbon still exposes About as ONE cell until LD-5 lands', () => {
    // Guards the interim state: exactly one About nav cell, pointing at the
    // default page. When LD-5 lands, this expectation is what it amends.
    expect(NAV.filter((n) => n.label === 'About').length).toBe(1);
  });
});
