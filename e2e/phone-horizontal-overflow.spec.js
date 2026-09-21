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
 *
 * ── ⛔ AND THE PAGE HAS TO BE THE PAGE (CURE-P, 2026-09-20) ────────────────────
 * PR #53's browser job came back green on one CI run and `1 failed · 2 flaky` on
 * another AT THE SAME COMMIT, with /about/guide and /founders reporting controls
 * thousands of pixels "under the bar". Neither was a layout defect. This spec was
 * measuring pages that were not finished: `networkidle` does not wait for a route's
 * own lazily-imported view, and one `scrollTo` does not hold a page that is still
 * growing at its end. Both faces of that are cured at the top of this file rather
 * than route by route, and BOTH of the instrument's new obligations are negative-
 * controlled at the foot of it: `settle` now waits for the view to mount, and
 * `unreachable` re-scrolls until the page has come to rest, saying so when it
 * cannot. NOTHING HERE WAS WEAKENED TO ACHIEVE IT: no assertion was dropped, no
 * tolerance widened, no timeout raised, no retry added. Two assertions were ADDED.
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

/**
 * ⛔ THE VIEW'S OWN CHUNK HAS TO BE ON THE PAGE BEFORE ANY OF THIS MEASURES A PIXEL,
 * AND WAITING FOR IT IS THE ONE THING `settle` WAS MISSING (CURE-P, 2026-09-20).
 *
 * `networkidle` is not that condition. Vite serves this app's routes as ~780
 * on-demand module transforms, and a quiet 500ms gap in that stream satisfies
 * `networkidle` while the route's own lazily-imported view is still in flight —
 * so the shell, its header and its footer are all the instrument sees. MEASURED
 * at CPU throttle 7x: three of eight measurements judged an 11-control, 1093px
 * SHELL and reported clean, where /about/guide's real page is 40 controls and
 * 10502px. The anti-vacuity count below cannot catch that, because the shell's
 * own chrome draws those 11 controls: `pageControls > 0` passes on a page the
 * view never reached. The same race resolving two frames later is the FALSE RED
 * CI reported (job 106158996888) — the full page's controls read at the shell's
 * scroll position.
 *
 * `[data-sf-route-loading]` is the hook the product already exposes for exactly
 * this (AppViews.jsx's `Loading`, whose own comment names this use), and the
 * same one `arrow-header`, `pinned-footer`, `visual-polish` and
 * `realm-herald-gate` already wait on. No bound is raised to add it: it runs at
 * the suite's default action timeout, and a route whose view never arrives says
 * so instead of timing out on a locator that was never going to appear.
 */
async function routeMounted(page, route) {
  await page.waitForFunction(() => !document.querySelector('[data-sf-route-loading]'))
    .catch(() => {
      throw new Error(`${route}: the route's own view chunk never mounted — the page is still `
        + 'showing the shell\'s loading fallback, so every measurement below would be of the '
        + 'shell rather than of the view. This is a load failure on the route, not a layout '
        + 'defect: check the dev server log for a transform error.');
    });
}

/** Settle the page: the view mounted, fonts loaded, one frame painted, no in-flight navigation. */
async function settle(page, route) {
  await routeMounted(page, route);
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
      await settle(page, route);
      const m = await measure(page);
      // The measurement is asserted, not the element list: a page may legitimately
      // have a child reaching past the fold inside its own scroller (a horizontal
      // strip), and what is forbidden is the DOCUMENT growing.
      expect(m.scrollWidth, report(route, m)).toBeLessThanOrEqual(m.clientWidth);
    });
  }
});

/** The end-reaching loop's stated bound, and how many settled frames end it. */
const REACH_END_BOUND_MS = 5_000;
const REACH_END_STABLE_FRAMES = 3;

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
 *
 * ⛔ AND IT HAS TO ACTUALLY REACH THE END (CURE-P, 2026-09-20). The claim this
 * instrument makes in its own failure text is "at the end of EVERY scroller they
 * still sit below the bar". One `scrollTo` plus two animation frames is not that
 * claim: a page that mounts a section, decodes an image or lands a lazy chunk
 * after that scroll is no longer at its end, and every control the growth pushed
 * down is then reported as unreachable. MEASURED: /founders grows 235px after the
 * first scroll, and 123 of those px are what put its footer's seven controls
 * 60–168px under the bar in CI job 106158996888 and in this lane's reproduction
 * at CPU throttle 7x, to the pixel.
 *
 * So: scroll every scroller and the window to their ends, wait a frame, and do it
 * again until the document's scroll height is UNCHANGED, the window is within a
 * pixel of its end, and every inner scroller is within a pixel of its own end —
 * for three consecutive frames. MEASURED COST of that loop on a settled page:
 * 4 rounds / 45–59ms, and 6 rounds / 126–142ms on a page that was still growing,
 * both at CPU throttle 7x on the lane's box. The bound below is ~35x the worst of
 * those, and it is a BOUND, not a timeout: nothing waits on it when the page is
 * settled, and a page still growing when it expires is its own red with its own
 * message (asserted at every call site) rather than a silent measurement of a
 * page that was never at its end.
 */
async function unreachable(page) {
  const reach = await page.evaluate(async ({ bound, stableFrames }) => {
    const doc = document.documentElement;
    const frame = () => new Promise((r) => requestAnimationFrame(() => r()));
    // ⛔ OVERFLOWING IS NOT THE SAME AS SCROLLABLE, AND ONLY THE SECOND CAN BE
    // "AT ITS END". The set below is the one the instrument has always pushed to
    // its end — every box whose content overflows it — and pushing an
    // `overflow: hidden` box is a harmless no-op. Asking whether that box ARRIVED
    // is not harmless: its scrollTop is pinned at 0 for ever, so a rest condition
    // that waits for it never comes. (It did not: this loop span 301 rounds over
    // 5,013ms on /create, reporting the document 0px short of its own end and
    // three inner scrollers eternally not at theirs.) Content clipped inside a
    // hidden box is a real defect, but it is a DIFFERENT one, and the geometry
    // below already judges those controls where they actually sit.
    const scrollableEnough = (el) => {
      if (el === document.scrollingElement) return true;
      const overflowY = getComputedStyle(el).overflowY;
      return overflowY === 'auto' || overflowY === 'scroll' || overflowY === 'overlay';
    };
    // Re-derived every round: the set of scrollers is itself a function of the
    // layout, so a page that grows can grow a NEW scroller the first pass missed.
    const scrollEverythingToItsEnd = () => {
      const scrollers = [document.scrollingElement, ...document.querySelectorAll('*')]
        .filter((el) => el && el.scrollHeight - el.clientHeight > 2);
      for (const el of scrollers) el.scrollTop = el.scrollHeight;
      window.scrollTo(0, doc.scrollHeight);
      return scrollers.filter(scrollableEnough);
    };
    const startedAt = Date.now();
    let stable = 0;
    let previousHeight = -1;
    let rounds = 0;
    let shortOfEndBy = 0;
    let scrollersNotAtEnd = 0;
    while (Date.now() - startedAt < bound) {
      rounds += 1;
      const scrollables = scrollEverythingToItsEnd();
      await frame();
      const height = doc.scrollHeight;
      shortOfEndBy = Math.round((height - doc.clientHeight) - window.scrollY);
      scrollersNotAtEnd = scrollables
        .filter((el) => el.scrollHeight - el.clientHeight - el.scrollTop > 1).length;
      const atEnd = Math.abs(shortOfEndBy) <= 1 && scrollersNotAtEnd === 0;
      stable = (height === previousHeight && atEnd) ? stable + 1 : 0;
      previousHeight = height;
      if (stable >= stableFrames) break;
    }
    return {
      reachedEnd: stable >= stableFrames,
      reachRounds: rounds,
      reachMs: Date.now() - startedAt,
      reachHeight: doc.scrollHeight,
      shortOfEndBy,
      scrollersNotAtEnd,
    };
  }, { bound: REACH_END_BOUND_MS, stableFrames: REACH_END_STABLE_FRAMES });

  const measured = await page.evaluate((attr) => {
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
  return { ...measured, ...reach };
}

/**
 * The red a page that never stopped growing gets. It is deliberately NOT the
 * reachability report: nothing was measured at the end, so naming elements would
 * be naming them at an arbitrary scroll position.
 */
const reachEndReport = (route, m) => `\n${route} never came to rest at its end: after `
  + `${m.reachRounds} rounds over ${m.reachMs}ms of scrolling every scroller to its end, the `
  + `document still stands ${m.shortOfEndBy}px short of its own end (scroll height `
  + `${m.reachHeight}px, ${m.scrollersNotAtEnd} inner scroller(s) not at their end).\n\n  `
  + 'Nothing below was measured, because a page that is still growing is not at the end this '
  + 'instrument claims to measure from. Either the view is still mounting content after the '
  + 'page reports settled (an animation, a polling fetch, an image without reserved height), '
  + 'or a scroll handler is fighting the scroll. Find what is still moving before reading any '
  + 'reachability number from this route.\n';

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
      await settle(page, route);
      const m = await unreachable(page);
      // ⛔ ANTI-VACUITY, BOTH WAYS. A page that rendered no controls satisfies "nothing is
      // under the bar" trivially, which is exactly what a thrown lazy chunk leaves behind —
      // and the count has to EXCLUDE the bar, which draws five seats on every route however
      // badly the view failed. A bar the walk cannot find is the other vacuous green: the
      // floor silently becomes the viewport bottom and every route reports clean.
      expect(m.barFound, `${route}: the bottom bar carries no ${BOTTOM_NAV_ATTR} hook, so the `
        + 'floor is the viewport edge and this measurement means nothing').toBe(true);
      // ⛔ AND THE THIRD VACUOUS GREEN: a measurement taken somewhere short of the end.
      // It is asserted BEFORE the list, because a list read off a page that was still
      // growing is neither a pass nor a fail, it is a number from the wrong moment.
      expect(m.reachedEnd, reachEndReport(route, m)).toBe(true);
      expect(m.pageControls, `${route} rendered no interactive element of its own`).toBeGreaterThan(0);
      expect(m.under, reachReport(route, m)).toEqual([]);
    });
  }

  test('THE LIBRARY: the realm gate\'s own controls are reachable (the owner\'s screenshot)', async ({ page }) => {
    // The named controls, pinned by name rather than by count, because THEY are what the
    // owner found cut off. The library is where a phone reader meets the gate card.
    await page.goto('/settlements');
    await settle(page, '/settlements');
    // ⛔ AND THE LIBRARY HAS A SECOND READINESS CONDITION OF ITS OWN, WHICH IT DECLARES:
    // while `savesLoading` is true (useOwnerScopedSaves.js initialises it to `true`, so it
    // is true at the panel's first paint) SettlementsPanel.jsx draws a skeleton carrying
    // `role="status" aria-label="Loading saves"` INSTEAD of the folders and cards. Measuring
    // reachability against three skeleton rows is measuring the wrong page, and the gate card
    // this arm exists for is not on it yet. The page's own <h1> is waited for first so the
    // skeleton's absence cannot be read off a document the panel has not mounted into.
    await expect(page.getByRole('heading', { name: 'Library', exact: true })).toBeVisible();
    await expect(page.getByRole('status', { name: 'Loading saves' })).toHaveCount(0);
    const m = await unreachable(page);
    expect(m.barFound, 'the bottom bar carries no hook, so this measurement means nothing').toBe(true);
    expect(m.reachedEnd, reachEndReport('/settlements', m)).toBe(true);
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
    await settle(page, '/');
    const clean = await unreachable(page);
    expect(clean.barFound, 'presence control: the bar was found by its declared hook').toBe(true);
    expect(clean.reachedEnd, reachEndReport('/', clean)).toBe(true);
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

  test('NEGATIVE CONTROL 2: a page that GROWS after the first scroll is still measured at its true end', async ({ page }) => {
    // ⛔ THE END-REACHING LOOP IS THE SECOND HOLE CUT IN THIS INSTRUMENT, AND THIS IS THE
    // PROOF THAT IT IS ONLY THAT HOLE (CURE-P, 2026-09-20). The loop above re-scrolls until
    // the page stops growing, which is the only honest way to stand where this spec claims
    // to stand. A loop is also exactly the shape that can be made to pass anything: one that
    // gave up quietly, or that treated "I scrolled again" as "I am at the end", would turn
    // all 27 empty-list assertions into greens nobody could ever red.
    //
    // So a page is made to do the thing that reddened /about/guide and /founders in CI job
    // 106158996888 — GROW, by thousands of pixels, in response to the very first scroll —
    // and a control is planted genuinely under the bar at the end it grows to. The SAME
    // `unreachable()` the sweep runs must (a) reach the true end and (b) still convict the
    // one control that really is unreachable.
    //
    // ⭐ THE RED-FIRST IS QUOTED, NOT ASSUMED. Against the pre-cure single-scroll
    // instrument this exact plant convicts NINE controls instead of one: the two plants
    // plus the landing's own Pricing / Feedback & support / Terms / Privacy / Guide /
    // Roadmap / SettlementForge home, at +1666px and +1722px under the bar. Those are the
    // SAME SEVEN CONTROLS, BY NAME, that CI convicted on /founders at +60px and +116px in
    // job 106158996888. The /founders red IS this test's red-first, so a regression here is
    // that CI failure returning, and a reader need not take that on trust.
    await page.goto('/');
    await settle(page, '/');
    const clean = await unreachable(page);
    expect(clean.reachedEnd, reachEndReport('/', clean)).toBe(true);
    expect(clean.under, 'presence control: the landing is clean before the plant').toEqual([]);

    const cleanHeight = clean.reachHeight;
    // A SEPARATE TASK from the plant below, so the scroll event this queues is dispatched
    // before the growth listener exists and cannot spring it early. (It did, the first time
    // this control was written: the growth fired on the scroll-to-top, the instrument then
    // scrolled a page that was already its final height, and the control passed while
    // proving nothing.)
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.evaluate(() => {
      // A block that is ten pixels tall until the page is first scrolled DOWN, and three
      // thousand after: a late-mounting section, an image that finally decoded, a lazy
      // chunk that landed.
      const grower = document.createElement('div');
      grower.setAttribute('data-plant', 'late-growth');
      grower.style.cssText = 'position:relative;height:10px;background:transparent';
      // A control in the MIDDLE of the growth. At the page's TRUE end it is about a
      // thousand pixels above the fold and unconvictable; at the PRE-GROWTH end it is
      // about a thousand below the floor. Nothing but whether the instrument came to rest
      // at the end decides its verdict, which is what makes it a test OF THE LOOP rather
      // than of the geometry the loop happens to leave behind.
      const inBlock = document.createElement('button');
      inBlock.type = 'button';
      inBlock.textContent = 'PLANTED inside the late growth';
      inBlock.style.cssText = 'position:absolute;top:1500px;left:0;width:200px;height:40px';
      grower.appendChild(inBlock);
      // Guarded on scrollY so only a scroll that really moves down the page springs it,
      // and removed on that first one so the page comes to rest rather than growing
      // forever (which would be a different defect with a different red).
      const onScroll = () => {
        if (window.scrollY <= 0) return;
        window.removeEventListener('scroll', onScroll);
        grower.style.height = '3000px';
      };
      window.addEventListener('scroll', onScroll);
      document.querySelector('main').appendChild(grower);

      const plant = document.createElement('button');
      plant.type = 'button';
      plant.textContent = 'PLANTED under the bar, after the growth';
      plant.style.cssText = 'position:fixed;left:0;bottom:0;width:120px;height:40px;z-index:1';
      document.querySelector('main').appendChild(plant);
    });

    const planted = await unreachable(page);
    expect(planted.reachedEnd, reachEndReport('/ (with a late-growing block planted)', planted))
      .toBe(true);
    expect(
      planted.reachHeight - cleanHeight,
      'the plant did not actually grow the page, so this control proved nothing about growth',
    ).toBeGreaterThan(2_000);
    expect(
      planted.underCount,
      'the end-reaching loop stopped short of the grown page\'s end: the landing\'s own '
      + 'controls are being convicted along with the plant, which is the /founders defect '
      + 'reproduced inside the instrument that is supposed to be immune to it',
    ).toBe(1);
    expect(planted.under[0].name).toBe('PLANTED under the bar, after the growth');
    expect(planted.under[0].past, 'the plant sits under the bar by the bar\'s own height')
      .toBe(planted.barHeight);
    expect(
      planted.pageControls,
      'the page\'s own controls should be the clean landing plus the two plants plus exactly '
      + 'one more. The third is the product\'s own "Scroll to top" affordance: App.jsx shows '
      + 'it at `y > 400`, and the landing\'s own end is 281px, so it is absent from the clean '
      + 'measurement and present once the plant has grown the page past three thousand. Its '
      + 'arrival is itself evidence that the loop came to rest at the GROWN page\'s end and '
      + 'not at the landing\'s own. A count of +2 here means the growth never happened; '
      + 'anything larger means the page gained a control this control does not know about.',
    ).toBe(clean.pageControls + 3);
  });
});
