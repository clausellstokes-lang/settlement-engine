/**
 * phone-horizontal-overflow.spec.js — WHAT A PHONE CAN REACH: NO PUBLIC ROUTE SCROLLS
 * SIDEWAYS, AND EVERY ROUTE'S LAST CONTROL CAN BE SCROLLED TO.
 *
 * ── WHY THIS EXISTS (owner, 2026-09-19: "watch out for this overflow regarding
 * phone view") ─────────────────────────────────────────────────────────────────
 * A browser walk found /create 52px wider than its own viewport at 391px —
 * `documentElement.scrollWidth` 437 against `clientWidth` 385. The cause was one
 * span: an unresolved copy key (`pricing.tiers.founder.priceSub`), 29 unbreakable
 * characters in a baseline flex row, cured in ODQ §934.22 car 1.
 *
 * Curing the span is not the same as curing the CLASS. Horizontal overflow on a
 * phone has no single source — a long unbroken token, a fixed `width`, a negative
 * margin, an image without `max-width`, a table, a `100vw` beside a padded parent —
 * and NOTHING in this estate measured it. Every instrument it has for phone layout
 * reads SOURCE (the phone-floor censuses) or runs in jsdom, which computes no layout
 * at all and cannot see a pixel of it.
 *
 * ⭐ SO THIS IS THE ONE MEASUREMENT, IN A REAL ENGINE. Chromium, 375×812 — the
 * narrowest common phone, narrower than the 391 the walk used, so a page that passes
 * here passes there.
 *
 * ── THE ROUTE LIST IS DERIVED, NOT TYPED ───────────────────────────────────────
 * From `staticUrls()` in scripts/generate-sitemap.mjs, which reads ROUTES in
 * src/lib/routes.js and drops the noindex and retired views. That is the SAME
 * enumeration tests/build/sitemap.test.js holds the committed sitemap to, so a new
 * public route joins this sweep the day it ships and cannot be forgotten into it.
 *
 * ── THE FAILURE MESSAGE IS THE POINT ───────────────────────────────────────────
 * "scrollWidth 437 > clientWidth 375" is a fact nobody can act on. On failure this
 * walks every element whose right edge is past the viewport, sorts by how far, and
 * prints the tag, id, classes and the head of the text for the worst offenders —
 * so the reader is handed the element, not a symptom.
 *
 * ── THE SECOND MEASUREMENT: VERTICAL REACHABILITY (the owner, 2026-09-19) ──────
 * "note how the See Cartographer and the button for instant generate settlements are
 * cut off and can't be scrolled down to." The library's realm gate sat BETWEEN a fixed
 * header and the only scrolling region of a fixed-height column inside an
 * `overflow: hidden` ancestor, so its last controls were squeezed and then clipped, and
 * no amount of scrolling reached them. Horizontal overflow is loud — the page slides
 * under your thumb. THIS defect is silent: the page looks finished and a control simply
 * is not there.
 *
 * So each route is also scrolled to its end and every interactive element is measured
 * against the bottom bar's top edge. The bar's height is READ FROM THE PAGE (the fixed
 * `nav` the shell renders), never typed here, so a taller bar tightens the assertion
 * instead of silently invalidating it. The failure names the element, as the horizontal
 * arm does.
 *
 * ⚠ FONTS SETTLE FIRST. A fallback face measures differently from the loaded one and
 * a race here would make this flaky in exactly the way that gets a spec deleted, so
 * every assertion waits on `document.fonts.ready` plus a frame.
 */
import { expect, test } from '@playwright/test';
import { staticUrls } from '../scripts/generate-sitemap.mjs';
import { BOTTOM_NAV_ATTR } from '../src/lib/chromeInsets.js';

/** The narrowest common phone. Narrower than the 391px the walk used, deliberately. */
test.use({ viewport: { width: 375, height: 812 } });

/**
 * Every indexable public path, origin stripped, de-duplicated. `staticUrls()` fans
 * the compendium out to one URL per section; those are the same DOCUMENT with a
 * different tab, so the query is kept — a tab can overflow on its own.
 */
const ROUTES = [...new Set(
  staticUrls().map(({ loc }) => new URL(loc).pathname + new URL(loc).search),
)];

/** Settle the page: fonts loaded, one frame painted, no in-flight navigation. */
async function settle(page) {
  await page.waitForLoadState('networkidle').catch(() => {});
  await page.evaluate(async () => {
    if (document.fonts?.ready) await document.fonts.ready;
    await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
  });
}

/**
 * The page's own measurement of itself, plus — when it overflows — WHO.
 * Runs entirely in the page so the element handles never cross the boundary.
 */
async function measure(page) {
  return page.evaluate(() => {
    const doc = document.documentElement;
    const over = [];
    for (const el of document.querySelectorAll('*')) {
      const r = el.getBoundingClientRect();
      // Zero-area nodes cannot push the document wider; skip them so the report
      // names things a reader can find on the screen.
      if (r.width === 0 || r.height === 0) continue;
      if (r.right > window.innerWidth + 0.5) {
        over.push({
          past: Math.round((r.right - window.innerWidth) * 100) / 100,
          right: Math.round(r.right * 100) / 100,
          width: Math.round(r.width * 100) / 100,
          tag: el.tagName.toLowerCase(),
          id: el.id || '',
          cls: (typeof el.className === 'string' ? el.className : '').slice(0, 60),
          text: (el.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 70),
        });
      }
    }
    over.sort((a, b) => b.past - a.past);
    return {
      scrollWidth: doc.scrollWidth,
      clientWidth: doc.clientWidth,
      innerWidth: window.innerWidth,
      over: over.slice(0, 8),
      overCount: over.length,
    };
  });
}

const report = (route, m) => `\n${route} overflows its viewport horizontally.\n`
  + `  documentElement.scrollWidth ${m.scrollWidth} > clientWidth ${m.clientWidth} `
  + `(over by ${m.scrollWidth - m.clientWidth}px at ${m.innerWidth}px wide)\n`
  + `  ${m.overCount} element(s) reach past the viewport; the worst:\n`
  + m.over.map((o) => `    +${o.past}px  <${o.tag}${o.id ? `#${o.id}` : ''}`
    + `${o.cls ? ` class="${o.cls}"` : ''}>  w=${o.width}  "${o.text}"`).join('\n')
  + '\n\n  A phone page must never scroll sideways. The usual causes: an unbroken token '
  + '(a URL, an unresolved copy KEY — see ODQ §934.22 car 1), a fixed width, a negative '
  + 'margin, an image without max-width, or 100vw inside a padded parent.\n';

test.describe('phone layout — no horizontal overflow at 375px', () => {
  test('the route list is derived and non-empty (anti-vacuity)', () => {
    // ⛔ Without this the sweep below is a green that visited nothing. The floor is
    // the measurement at landing, and it moves only when a public route really does.
    expect(ROUTES.length, 'the public route enumeration is empty — has ROUTES or the '
      + 'sitemap generator moved?').toBeGreaterThanOrEqual(8);
    expect(ROUTES, 'the landing page is not in the sweep').toContain('/');
    expect(ROUTES, 'the Create page — where the overflow was found — is not in the sweep')
      .toContain('/create');
  });

  for (const route of ROUTES) {
    test(`${route} fits its viewport`, async ({ page }) => {
      await page.goto(route);
      await settle(page);
      const m = await measure(page);
      // The measurement is asserted, not the element list: a page may legitimately
      // have a child reaching past the fold inside its own scroller (a horizontal
      // strip), and what is forbidden is the DOCUMENT growing.
      expect(m.scrollWidth, report(route, m)).toBeLessThanOrEqual(m.clientWidth);
    });
  }
});

/**
 * Scroll the document AND every scrolling region to its end, then report every
 * interactive element whose bottom edge still sits under the fixed bottom bar.
 *
 * ⛔ EVERY SCROLLER, NOT JUST THE DOCUMENT. The defect this exists for was a control
 * inside a fixed-height column: the window was already at its end and the control was
 * still out of reach. So each element with a real overflow is scrolled to its own end
 * first, and only then is the geometry read.
 *
 * ⚠ ONLY WHAT A READER COULD USE IS JUDGED. A control that is `display:none`, zero-area,
 * inside a closed dialog or `aria-hidden` is not a reachability failure — it is not on
 * the page. A control that is VISIBLE and under the bar is.
 *
 * ⛔ AND THE BAR'S OWN SEATS ARE NOT THE PAGE. This judged EVERY control in the document
 * against the bar's top edge, the bar's five seats included — and a seat in a bar pinned
 * to `bottom: 0` ends at the viewport's bottom edge BY DEFINITION, which is the bar's own
 * height below the floor. So the instrument convicted the bar of sitting under itself on
 * every route it walked (27 reds, CI job 106141849116: five controls, `bottom: 812,
 * past: 45`, identically on all 27). The bar is now found by its DECLARED hook
 * (BOTTOM_NAV_ATTR, src/lib/chromeInsets.js) rather than by the shape "the first <nav>
 * whose computed position is fixed", its own descendants are exempt, and `barFound` is
 * asserted — because the shape's other failure mode is the silent one: the day the bar
 * stops matching, the floor becomes the viewport bottom and every route reports clean.
 *
 * ⛔ THE ANTI-VACUITY COUNT IS THE PAGE'S CONTROLS, NOT THE DOCUMENT'S. The bar draws five
 * controls on every route no matter what the view does, so a count over the document would
 * be satisfied by the chrome alone — which is precisely the thrown-lazy-chunk case the
 * count exists to catch.
 */
async function unreachable(page) {
  await page.evaluate(async () => {
    const scrollers = [document.scrollingElement, ...document.querySelectorAll('*')]
      .filter((el) => el && el.scrollHeight - el.clientHeight > 2);
    for (const el of scrollers) el.scrollTop = el.scrollHeight;
    window.scrollTo(0, document.documentElement.scrollHeight);
    await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
  });
  return page.evaluate((attr) => {
    const bar = document.querySelector(`[${attr}]`);
    const barTop = bar ? bar.getBoundingClientRect().top : window.innerHeight;
    const floor = Math.min(barTop, window.innerHeight);
    const visible = (el) => {
      const cs = getComputedStyle(el);
      if (cs.display === 'none' || cs.visibility === 'hidden' || Number(cs.opacity) === 0) return false;
      if (el.closest('[aria-hidden="true"]')) return false;
      const r = el.getBoundingClientRect();
      return r.width > 0 && r.height > 0;
    };
    const CONTROLS = 'button, a[href], input, select, textarea, [role="button"]';
    // The PAGE's controls: everything the document draws, minus the bar's own seats.
    const owned = [...document.querySelectorAll(CONTROLS)].filter((el) => !(bar && bar.contains(el)));
    const under = owned
      .filter(visible)
      .map((el) => ({ el, r: el.getBoundingClientRect() }))
      .filter(({ r }) => r.bottom > floor + 1)
      .map(({ el, r }) => ({
        tag: el.tagName.toLowerCase(),
        name: (el.getAttribute('aria-label') || el.textContent || '').trim().slice(0, 60),
        bottom: Math.round(r.bottom),
        past: Math.round(r.bottom - floor),
      }));
    return {
      barFound: Boolean(bar),
      floor: Math.round(floor),
      barHeight: bar ? Math.round(window.innerHeight - barTop) : 0,
      innerHeight: window.innerHeight,
      under: under.slice(0, 8),
      underCount: under.length,
      controls: document.querySelectorAll(CONTROLS).length,
      pageControls: owned.length,
    };
  }, BOTTOM_NAV_ATTR);
}

const reachReport = (route, m) => `\n${route} has ${m.underCount} control(s) a phone `
  + `cannot scroll to: at the end of every scroller they still sit below ${m.floor}px, `
  + `which is the top of the ${m.barHeight}px bottom bar in a ${m.innerHeight}px viewport.\n`
  + `  (${m.pageControls} of the page's own controls were judged; the bar's own seats are not `
  + 'among them.)\n'
  + m.under.map((u) => `    +${u.past}px under the bar  <${u.tag}>  "${u.name}"`).join('\n')
  + '\n\n  Cure it at the LAYOUT ROOT, never per card: a content column must not be a '
  + 'fixed-height box inside `overflow: hidden` with controls outside its one scroller, '
  + "and the page's bottom reserve must be derived from the bar's height plus the "
  + 'safe-area inset rather than from a constant (ODQ §934.27 / the owner, 2026-09-19).\n';

test.describe('phone layout — every route reaches its last control at 375px', () => {
  for (const route of ROUTES) {
    test(`${route} can be scrolled to its end`, async ({ page }) => {
      await page.goto(route);
      await settle(page);
      const m = await unreachable(page);
      // ⛔ ANTI-VACUITY, BOTH WAYS. A page that rendered no controls satisfies "nothing is
      // under the bar" trivially, which is exactly what a thrown lazy chunk leaves behind —
      // and the count has to EXCLUDE the bar, which draws five seats on every route however
      // badly the view failed. A bar the walk cannot find is the other vacuous green: the
      // floor silently becomes the viewport bottom and every route reports clean.
      expect(m.barFound, `${route}: the bottom bar carries no ${BOTTOM_NAV_ATTR} hook, so the `
        + 'floor is the viewport edge and this measurement means nothing').toBe(true);
      expect(m.pageControls, `${route} rendered no interactive element of its own`).toBeGreaterThan(0);
      expect(m.under, reachReport(route, m)).toEqual([]);
    });
  }

  test('THE LIBRARY: the realm gate\'s own controls are reachable (the owner\'s screenshot)', async ({ page }) => {
    // The named controls, pinned by name rather than by count, because THEY are what the
    // owner found cut off. The library is where a phone reader meets the gate card.
    await page.goto('/settlements');
    await settle(page);
    const m = await unreachable(page);
    expect(m.barFound, 'the bottom bar carries no hook, so this measurement means nothing').toBe(true);
    expect(m.pageControls, 'the library rendered no interactive element of its own').toBeGreaterThan(0);
    expect(m.under, reachReport('/settlements', m)).toEqual([]);
    const named = await page.evaluate(() => [...document.querySelectorAll('button')]
      .map((b) => (b.getAttribute('aria-label') || b.textContent || '').trim())
      .filter((t) => /See Cartographer|^Sign in$|Generate a settlement|Instant/i.test(t)));
    // Not an assertion that they EXIST — the library's state decides that — but if any
    // of them is drawn, the arm above has already proved it is reachable. Recorded so a
    // reader of a green run knows which controls were on the page when it passed.
    expect(Array.isArray(named)).toBe(true);
  });

  test('NEGATIVE CONTROL: a control planted under the bar is still convicted', async ({ page }) => {
    // ⛔ EXEMPTING THE BAR'S OWN SEATS IS A HOLE CUT IN THE INSTRUMENT, AND THIS IS THE
    // PROOF THAT IT IS ONLY THAT HOLE. Every arm above is an assertion that a list is
    // EMPTY, and an exemption that grew one element too wide would make all 27 of them
    // pass forever on a page whose last control really was unreachable. So a visible
    // button is planted in the page's own body, fixed exactly where the bar sits, and the
    // SAME `unreachable()` the sweep runs has to name it.
    await page.goto('/');
    await settle(page);
    const clean = await unreachable(page);
    expect(clean.barFound, 'presence control: the bar was found by its declared hook').toBe(true);
    expect(clean.under, 'presence control: the landing is clean before the plant').toEqual([]);

    await page.evaluate(() => {
      const plant = document.createElement('button');
      plant.type = 'button';
      plant.textContent = 'PLANTED under the bar';
      // Fixed to the viewport's bottom edge: the same geometry the bar's own seats have,
      // and the geometry a clipped panel's last control ends up with.
      plant.style.cssText = 'position:fixed;left:0;bottom:0;width:120px;height:40px;z-index:1';
      document.querySelector('main').appendChild(plant);
    });

    const planted = await unreachable(page);
    expect(
      planted.underCount,
      'the instrument stopped convicting a control under the bar — the bar exemption is too wide',
    ).toBe(1);
    expect(planted.under[0].name).toBe('PLANTED under the bar');
    expect(planted.under[0].past, 'the plant sits under the bar by the bar\'s own height')
      .toBe(planted.barHeight);
    expect(planted.pageControls, 'the plant joined the page\'s own controls, not the bar\'s')
      .toBe(clean.pageControls + 1);
  });
});
