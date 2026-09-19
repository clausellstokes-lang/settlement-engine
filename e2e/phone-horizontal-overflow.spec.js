/**
 * phone-horizontal-overflow.spec.js — NO PUBLIC ROUTE SCROLLS SIDEWAYS ON A PHONE.
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
 * ⚠ FONTS SETTLE FIRST. A fallback face measures differently from the loaded one and
 * a race here would make this flaky in exactly the way that gets a spec deleted, so
 * every assertion waits on `document.fonts.ready` plus a frame.
 */
import { expect, test } from '@playwright/test';
import { staticUrls } from '../scripts/generate-sitemap.mjs';

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
