/**
 * e2e/pinned-footer.spec.js: THE PINNED FOOTER'S GEOMETRY, in a real layout engine.
 *
 * The owner's orders (2026-09-16), against a 2000x1093 screenshot of the landing:
 * "The footer is missing on the landing page. When we scroll, the header/ribbon
 * remains sticky. The footer should be the same way on every page. Do you see that
 * gap where the shaded region breaks? Underneath that should be the footer, as
 * plain as day." And: "On the footer, keep it the same." Then the follow-up: only the
 * links row (Pricing | Feedback & support | Terms | Privacy | About) floats at the
 * viewport bottom; "only when a user scrolls all the way to the bottom does it show
 * the rest of the footer, including the logo".
 *
 * THE BAND is the footer's top edge down to the top of the row after the links row
 * (--sf-footer-inset); THE TUCK is the rest (--sf-footer-tuck), hung below the
 * viewport edge by a negative sticky bottom offset.
 *
 * jsdom cannot see any of this (tests/components/pinnedFooter.test.jsx pins the
 * style contract), so these arms measure boxes:
 *   1. at scroll 0 the landing shows the links row whole, the home button starts at or
 *      below the viewport bottom, the visible band equals the inset, and the hero's
 *      dark band ends at the band's top edge, at the owner's viewport and two more
 *      (1280 and the 1024 switch); at maximum scroll the home button and the
 *      copyright line are fully inside the viewport;
 *   2. every route carries one footer row, shows only the band at scroll 0 and the
 *      whole footer at maximum scroll;
 *   3. the scroll-button stack (the owner's square arrow) and the Realm map shell end
 *      above the band;
 *   4. keyboard: focus in main never lands under the band (WCAG 2.2 SC 2.4.11), and below
 *      1024 px a nearest-aligned scroll stops above the bottom bar; Tab to
 *      the tucked home button reveals the whole footer without scrolling; focusing a
 *      footer link mid-page never scrolls the document; a MOUSE press on the home
 *      button does not hold the footer open;
 *   5. print lays the footer back into the flow;
 *   5b. (the painted arrow, 2026-09-16) the footer pins only where the full arrow shows,
 *      1024 px and up: from 640 to 1023 px the bottom bar holds the bottom edge, the footer
 *      lies in the flow, and the landing hero ends at the bar;
 *   6. phones keep the in-flow footer, with no inset and no tuck, and the landing's
 *      Terms link clears the fixed bottom nav at the end of the page and is actually
 *      painted there, not under the landing's fixed film (LD-3's deferred pin);
 *   7. the generation reveal's layer (PipelineReveal: fixed, inset 0, its z-index read
 *      from source) covers the in-flow phone footer, as it covered the unpositioned
 *      footer before, while on desktop the pinned band shows over it the way the header
 *      does (a recorded, vetoable call).
 *
 * PAINT PROBES lift pointer-events for the duration of one hit-test: the film is
 * pointer-events: none, so a plain elementFromPoint skips it and reports whatever
 * is underneath, which is exactly how a covered footer once read as visible.
 *
 * Desktop Chromium only: it sets its own viewports, including the phone one.
 */

import { readFileSync } from 'node:fs';
import { test, expect } from '@playwright/test';

test.skip(({ browserName, isMobile }) => browserName !== 'chromium' || isMobile, 'Desktop Chromium suite: it sets its own viewports');

/** Sub-pixel slack for comparisons between independently rounded boxes. */
const EPS = 1;

/** In-page helper source: the topmost PAINTED element at a point (see PAINT PROBES). */
const PAINTED_AT = `(x, y) => {
  const probe = document.createElement('style');
  probe.textContent = '*{pointer-events:auto!important}';
  document.head.appendChild(probe);
  const el = document.elementFromPoint(x, y);
  probe.remove();
  return el;
}`;

async function freshPage(page) {
  await page.addInitScript(() => {
    try { localStorage.clear(); } catch { /* sandboxed storage */ }
    try { sessionStorage.clear(); } catch { /* sandboxed storage */ }
  });
}

/**
 * Wait until the view's own content has replaced the lazy-route fallback and the document has
 * stopped growing. The shell and its footer render BEFORE the view's chunk arrives (the
 * .app-route-main floor keeps the footer below the fold meanwhile), so a scroll to the end taken
 * while the fallback shows lands on a page that grows underneath it once the chunk lands. On a
 * cold CI dev server the Terms chunk arrived between the scroll and the measurement: the document
 * went from 1,093 to 4,158 px, the scroll stayed at 281, and the footer was about 3,000 px below
 * the viewport (CI job 105119662237; reproduced locally by delaying the chunk).
 */
async function settleRoute(page) {
  await page.waitForFunction(() => !document.querySelector('[data-sf-route-loading]'));
  await page.evaluate(() => new Promise((resolve) => {
    let last = -1;
    let stable = 0;
    let frames = 0;
    const tick = () => {
      const height = document.documentElement.scrollHeight;
      stable = height === last ? stable + 1 : 0;
      last = height;
      frames += 1;
      if (stable >= 5 || frames > 600) resolve();
      else requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }));
}

/** Scroll to the true end of the settled page, re-scrolling if the end moved. */
async function scrollToEnd(page) {
  await settleRoute(page);
  for (let attempt = 0; attempt < 5; attempt += 1) {
    const atEnd = await page.evaluate(() => new Promise((resolve) => {
      window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'instant' });
      requestAnimationFrame(() => requestAnimationFrame(() => {
        const root = document.documentElement;
        resolve(window.scrollY + window.innerHeight >= root.scrollHeight - 1);
      }));
    }));
    if (atEnd) return;
  }
  throw new Error('scrollToEnd: the page did not stay scrolled to its end');
}

/** Wait until the view has loaded, the shell has measured its chrome (the band and the tuck) and layout has settled. */
async function settleChrome(page, { pinned = true } = {}) {
  await page.waitForSelector('footer [data-testid="legal-ribbon-row"]');
  await page.evaluate(() => document.fonts.ready);
  await settleRoute(page);
  if (pinned) {
    await page.waitForFunction(() => {
      const root = document.documentElement.style;
      const footer = document.querySelector('footer');
      const next = footer && footer.querySelector('[data-sf-footer-links] + *');
      if (!next) return false;
      const f = footer.getBoundingClientRect();
      const band = Math.floor(next.getBoundingClientRect().top - f.top);
      return root.getPropertyValue('--sf-footer-inset') === `${band}px` && band > 0
        && parseFloat(root.getPropertyValue('--sf-footer-tuck')) > 0;
    });
  }
  await page.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))));
}

/** The footer's box, its rows, and the chrome variables, in viewport coordinates. */
async function footerBox(page) {
  return page.evaluate(() => {
    const footer = document.querySelector('footer');
    const r = footer.getBoundingClientRect();
    const nav = footer.querySelector('nav[aria-label="Footer"]').getBoundingClientRect();
    const home = footer.querySelector('button[aria-label="SettlementForge home"]').getBoundingClientRect();
    const copy = [...footer.querySelectorAll('span')].find((el) => /Simulated, not AI-generated\./.test(el.textContent));
    const c = copy.parentElement.getBoundingClientRect();
    const root = document.documentElement.style;
    return {
      top: r.top, bottom: r.bottom, height: r.height, innerHeight: window.innerHeight, scrollY: window.scrollY,
      maxScroll: document.documentElement.scrollHeight - window.innerHeight,
      navTop: nav.top, navBottom: nav.bottom, homeTop: home.top, homeBottom: home.bottom,
      copyTop: c.top, copyBottom: c.bottom,
      inset: parseFloat(root.getPropertyValue('--sf-footer-inset')),
      tuck: parseFloat(root.getPropertyValue('--sf-footer-tuck')),
    };
  });
}

/** At scroll 0 (or anywhere short of the last `tuck` px): only the band shows. */
function expectBandOnly(f) {
  expect(f.navTop, 'the links row is inside the viewport').toBeGreaterThanOrEqual(0);
  expect(f.navBottom, 'the links row is whole').toBeLessThanOrEqual(f.innerHeight);
  expect(f.homeTop, 'the home button hangs below the viewport edge').toBeGreaterThanOrEqual(f.innerHeight);
  expect(Math.abs((f.innerHeight - f.top) - f.inset), 'the visible band equals --sf-footer-inset').toBeLessThanOrEqual(EPS);
  expect(Math.abs((f.bottom - f.innerHeight) - f.tuck), 'the tucked part equals --sf-footer-tuck').toBeLessThanOrEqual(EPS);
}

/** At maximum scroll: the whole footer is inside the viewport. */
function expectWholeFooter(f) {
  expect(f.scrollY, 'presence control: at maximum scroll').toBeGreaterThanOrEqual(f.maxScroll - 1);
  expect(f.homeTop).toBeGreaterThanOrEqual(0);
  expect(f.homeBottom, 'the home button is fully inside the viewport').toBeLessThanOrEqual(f.innerHeight + EPS);
  expect(f.copyBottom, 'the copyright line is fully inside the viewport').toBeLessThanOrEqual(f.innerHeight + EPS);
  expect(f.bottom, 'the footer rests on the viewport bottom').toBeLessThanOrEqual(f.innerHeight + EPS);
}

async function scrollToY(page, y) {
  if (y === 'max') {
    await scrollToEnd(page);
    return;
  }
  await page.evaluate((target) => window.scrollTo({ top: target, behavior: 'instant' }), y);
  await page.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))));
}

async function raf(page) {
  await page.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))));
}

test.describe('the landing: the dark band ends where the floating links band begins', () => {
  for (const [width, height] of [[2000, 1093], [1280, 800], [1024, 768]]) {
    test(`at ${width}x${height}: only the links band at scroll 0, the whole footer at the end`, async ({ page }) => {
      await freshPage(page);
      await page.setViewportSize({ width, height });
      await page.goto('/home', { waitUntil: 'domcontentloaded' });
      await page.waitForSelector('section[aria-labelledby="sf-hero-title"]');
      await page.waitForSelector('#closer', { state: 'attached' });
      await settleChrome(page);

      const m = await page.evaluate((paintedAtSrc) => {
        const paintedAt = new Function(`return (${paintedAtSrc})`)();
        const hero = document.querySelector('section[aria-labelledby="sf-hero-title"]');
        const cue = hero.querySelector('a[href="#forge"]');
        const footer = document.querySelector('footer');
        const f = footer.getBoundingClientRect();
        const h = hero.getBoundingClientRect();
        const probe = paintedAt(Math.floor(window.innerWidth / 2), Math.floor(f.top) - 2);
        const terms = [...footer.querySelectorAll('nav[aria-label="Footer"] button')].find((b) => b.textContent.trim() === 'Terms');
        const t = terms.getBoundingClientRect();
        const termsHit = paintedAt(t.left + t.width / 2, t.top + t.height / 2);
        return {
          scrollY: window.scrollY,
          footerTop: f.top,
          heroBottom: h.bottom,
          cueBottom: cue.getBoundingClientRect().bottom,
          probeInHero: !!probe && hero.contains(probe),
          termsPainted: !!termsHit && terms.contains(termsHit),
          footerPosition: getComputedStyle(footer).position,
          rows: document.querySelectorAll('[data-testid="legal-ribbon-row"]').length,
        };
      }, PAINTED_AT);
      expect(m.scrollY).toBe(0);
      expect(m.footerPosition).toBe('sticky');
      expect(m.rows, 'one footer row on the landing').toBe(1);
      const top = await footerBox(page);
      expectBandOnly(top);
      // The hero reaches the band (no strip of film between them) and stops at it.
      expect(m.heroBottom, 'no gap between the dark band and the links band').toBeGreaterThanOrEqual(m.footerTop - 0.01);
      expect(m.heroBottom - m.footerTop, 'the hero ends at the band top edge').toBeLessThanOrEqual(2);
      expect(m.probeInHero, 'directly above the band is the hero, not the film').toBe(true);
      expect(m.termsPainted, 'the footer\'s Terms link is painted on top, "plain as day"').toBe(true);
      expect(m.cueBottom, 'FOLLOW THE ROAD stays above the band').toBeLessThanOrEqual(m.footerTop + EPS);

      await scrollToY(page, 'max');
      expectWholeFooter(await footerBox(page));
    });
  }

  test('at 800x900 (below the 1024 switch) the footer lies in the flow and the hero ends at the bottom bar', async ({ page }) => {
    await freshPage(page);
    await page.setViewportSize({ width: 800, height: 900 });
    await page.goto('/home', { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('section[aria-labelledby="sf-hero-title"]');
    await page.waitForSelector('#closer', { state: 'attached' });
    await settleChrome(page, { pinned: false });
    const m = await page.evaluate(() => {
      const hero = document.querySelector('section[aria-labelledby="sf-hero-title"]').getBoundingClientRect();
      const bar = [...document.querySelectorAll('.parchment-bg > nav')].find((d) => getComputedStyle(d).position === 'fixed');
      const root = document.documentElement.style;
      return {
        footerPosition: getComputedStyle(document.querySelector('footer')).position,
        inset: root.getPropertyValue('--sf-footer-inset'),
        tuck: root.getPropertyValue('--sf-footer-tuck'),
        heroTop: hero.top,
        heroBottom: hero.bottom,
        barTop: bar ? bar.getBoundingClientRect().top : null,
      };
    });
    expect(m.footerPosition).toBe('relative');
    expect([m.inset, m.tuck]).toEqual(['0px', '0px']);
    expect(m.barTop, 'presence control: the bottom bar shows at 800').not.toBeNull();
    expect(m.heroTop, 'the hero starts under the transparent painted header').toBeLessThanOrEqual(EPS);
    expect(Math.abs(m.heroBottom - m.barTop), 'the hero ends at the bottom bar').toBeLessThanOrEqual(2);

    await scrollToY(page, 'max');
    const end = await page.evaluate(() => {
      const bar = [...document.querySelectorAll('.parchment-bg > nav')].find((d) => getComputedStyle(d).position === 'fixed');
      return { footerBottom: document.querySelector('footer').getBoundingClientRect().bottom, barTop: bar.getBoundingClientRect().top };
    });
    expect(end.footerBottom, 'at the end of the page the footer clears the bar').toBeLessThanOrEqual(end.barTop + EPS);
  });

  test('the scroll-button stack sits above the footer', async ({ page }) => {
    await freshPage(page);
    await page.setViewportSize({ width: 2000, height: 1093 });
    await page.goto('/home', { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('#closer', { state: 'attached' });
    await settleChrome(page);
    await scrollToY(page, 900);
    const up = page.getByRole('button', { name: 'Scroll to top' });
    const down = page.getByRole('button', { name: 'Scroll to bottom' });
    await expect(up).toBeVisible();
    await expect(down).toBeVisible();
    const f = await footerBox(page);
    const downBox = await down.boundingBox();
    expect(downBox.y + downBox.height, 'the down arrow clears the footer').toBeLessThanOrEqual(f.top + EPS);
  });
});

test.describe('every route: one row, the band alone at scroll 0, the whole footer at the end', () => {
  for (const path of ['/compendium', '/pricing', '/terms', '/signin', '/realm', '/create']) {
    test(`${path} at 1280x800`, async ({ page }) => {
      await freshPage(page);
      await page.setViewportSize({ width: 1280, height: 800 });
      await page.goto(path, { waitUntil: 'domcontentloaded' });
      await page.waitForFunction(() => {
        const main = document.querySelector('main#main-content');
        return main && main.textContent.trim().length > 0 && !/^Loading/i.test(main.textContent.trim());
      });
      await settleChrome(page);

      const rows = await page.locator('[data-testid="legal-ribbon-row"]').count();
      expect(rows).toBe(1);
      await scrollToY(page, 0);
      expectBandOnly(await footerBox(page));

      await scrollToY(page, 'max');
      const f = await footerBox(page);
      expectWholeFooter(f);
      const mainBottom = await page.evaluate(() => document.querySelector('main#main-content').getBoundingClientRect().bottom);
      expect(mainBottom, 'at the end of the page nothing of main is under the footer').toBeLessThanOrEqual(f.top + EPS);
    });
  }

  test('/realm: the map shell ends above the band at the owner\'s viewport', async ({ page }) => {
    await freshPage(page);
    await page.setViewportSize({ width: 2000, height: 1093 });
    await page.goto('/realm', { waitUntil: 'domcontentloaded' });
    // The shell's inline height is the calc WorldMap.jsx writes (the painted arrow's clear
    // length, 66 px of padding and air, the bottom bar and the footer's band).
    const shell = page.locator('main [style*="100vh - var(--sf-arrow-clear"]').first();
    await shell.waitFor({ state: 'attached' });
    await settleChrome(page);
    await scrollToY(page, 0);
    const f = await footerBox(page);
    const box = await shell.boundingBox();
    expect(box.y + box.height, 'the map, legend and inspector end above the band').toBeLessThanOrEqual(f.top + EPS);
    expectBandOnly(f);
  });
});

test('keyboard focus is never obscured by the footer (WCAG 2.2 SC 2.4.11)', async ({ page }) => {
  await freshPage(page);
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto('/home', { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('#closer', { state: 'attached' });
  await settleChrome(page);
  await scrollToY(page, 0);

  let belowFoldChecked = 0;
  const offenders = [];
  for (let i = 0; i < 40 && belowFoldChecked < 3; i += 1) {
    await page.keyboard.press('Tab');
    await page.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))));
    const s = await page.evaluate(() => {
      const el = document.activeElement;
      const main = document.querySelector('main#main-content');
      if (!el || !main || !main.contains(el) || el === main) return null;
      const r = el.getBoundingClientRect();
      const f = document.querySelector('footer').getBoundingClientRect();
      return { label: (el.getAttribute('aria-label') || el.textContent || '').trim().slice(0, 40), bottom: r.bottom, footerTop: f.top, scrollY: window.scrollY };
    });
    if (!s) continue;
    if (s.scrollY > 0) belowFoldChecked += 1;
    if (s.bottom > s.footerTop + EPS) offenders.push(s);
  }
  expect(belowFoldChecked, 'presence control: focus travelled below the first viewport').toBeGreaterThan(0);
  expect(offenders).toEqual([]);
});

// Chromium's own Tab path scrolls a newly focused control well clear of the edge, so
// the arm above passes with or without the root's scroll-padding-bottom (measured).
// A NEAREST-aligned scroll is the path that reads the padding: it is what
// scrollIntoView({ block: 'nearest' }) callers get and the alignment other engines
// use for focus, so this arm is the one that proves the rule is live.
test('a nearest-aligned scroll stops above the footer (the root scroll-padding-bottom)', async ({ page }) => {
  await freshPage(page);
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto('/home', { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('#closer', { state: 'attached' });
  await settleChrome(page);
  await scrollToY(page, 0);
  const m = await page.evaluate(async () => {
    const target = document.querySelector('#forge button');
    const before = target.getBoundingClientRect();
    target.scrollIntoView({ block: 'nearest', behavior: 'instant' });
    await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
    const after = target.getBoundingClientRect();
    const footer = document.querySelector('footer').getBoundingClientRect();
    return { startedBelowFold: before.top > window.innerHeight, scrollY: window.scrollY, bottom: after.bottom, footerTop: footer.top };
  });
  expect(m.startedBelowFold, 'presence control: the target began below the first viewport').toBe(true);
  expect(m.scrollY).toBeGreaterThan(0);
  expect(m.bottom, 'the control lands above the footer, not under it').toBeLessThanOrEqual(m.footerTop + EPS);
});

// Below 1024 px the fixed bottom bar holds the bottom edge and the band is 0px, so the same
// root rule counts the bar instead (--sf-bottom-nav-h); without it a nearest-aligned scroll
// stopped at the viewport's bottom edge, under the bar (the review's finding, 2026-09-17).
test('below 1024 px a nearest-aligned scroll stops above the bottom bar (the same root rule)', async ({ page }) => {
  await freshPage(page);
  await page.setViewportSize({ width: 800, height: 900 });
  await page.goto('/home', { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('#closer', { state: 'attached' });
  await settleChrome(page, { pinned: false });
  await scrollToY(page, 0);
  const m = await page.evaluate(async () => {
    const bar = [...document.querySelectorAll('.parchment-bg > nav')].find((d) => getComputedStyle(d).position === 'fixed');
    const target = document.querySelector('#forge button');
    const before = target.getBoundingClientRect();
    target.scrollIntoView({ block: 'nearest', behavior: 'instant' });
    await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
    const after = target.getBoundingClientRect();
    return {
      startedBelowFold: before.top > window.innerHeight,
      scrollY: window.scrollY,
      bottom: after.bottom,
      barTop: bar ? bar.getBoundingClientRect().top : null,
      padding: getComputedStyle(document.documentElement).scrollPaddingBottom,
    };
  });
  expect(m.barTop, 'presence control: the bottom bar shows at 800').not.toBeNull();
  expect(m.startedBelowFold, 'presence control: the target began below the first viewport').toBe(true);
  expect(m.scrollY).toBeGreaterThan(0);
  expect(m.bottom, 'the control lands above the bar, not under it').toBeLessThanOrEqual(m.barTop + EPS);
  expect(m.padding, 'the root padding is the bar as rendered').toBe('45px');
});

test('Tab to the tucked home button reveals the whole footer without scrolling, and Shift+Tab tucks it again', async ({ page }) => {
  await freshPage(page);
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto('/home', { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('#closer', { state: 'attached' });
  await settleChrome(page);
  await scrollToY(page, 0);

  await page.locator('footer nav[aria-label="Footer"] button', { hasText: 'About' }).focus();
  await raf(page);
  const before = await footerBox(page);
  expect(before.scrollY, 'focusing a band link does not scroll').toBe(0);
  expectBandOnly(before);

  await page.keyboard.press('Tab');
  await raf(page);
  const focused = await page.evaluate(() => ({
    label: document.activeElement.getAttribute('aria-label'),
    visible: document.activeElement.matches(':focus-visible'),
  }));
  expect(focused, 'presence control: keyboard focus is on the home button').toEqual({ label: 'SettlementForge home', visible: true });
  const open = await footerBox(page);
  expect(open.scrollY, 'the reveal moves the footer, not the page').toBe(0);
  expect(open.homeTop, 'the home button is inside the viewport').toBeGreaterThanOrEqual(0);
  expect(open.homeBottom, 'the home button is fully inside the viewport').toBeLessThanOrEqual(open.innerHeight + EPS);
  expect(open.copyBottom, 'the whole footer shows').toBeLessThanOrEqual(open.innerHeight + EPS);

  await page.keyboard.press('Shift+Tab');
  await raf(page);
  const back = await footerBox(page);
  expect(back.scrollY).toBe(0);
  expectBandOnly(back);
});

// The root scroll-padding-bottom counts the band as "obscured", and no scroll can move a
// sticky footer, so without the footer controls' matching scroll-margin every focus on a
// footer link mid-page scrolled the document by about half a viewport (measured: about
// 405 px per Tab at 1280x800) and left the link exactly where it was.
test('focusing footer controls mid-page never scrolls the document', async ({ page }) => {
  await freshPage(page);
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto('/home', { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('#closer', { state: 'attached' });
  await settleChrome(page);
  await scrollToY(page, 2000);

  await page.locator('footer nav[aria-label="Footer"] button', { hasText: 'Pricing' }).evaluate((el) => el.focus());
  await raf(page);
  const seen = [];
  const record = async () => seen.push(await page.evaluate(() => ({
    active: (document.activeElement.getAttribute('aria-label') || document.activeElement.textContent).trim(),
    scrollY: window.scrollY,
  })));
  await record();
  for (let i = 0; i < 5; i += 1) {
    await page.keyboard.press('Tab');
    await raf(page);
    await record();
  }
  expect(seen.map((s) => s.active), 'presence control: focus walked the whole footer')
    .toEqual(['Pricing', 'Feedback & support', 'Terms', 'Privacy', 'About', 'SettlementForge home']);
  expect(seen.map((s) => s.scrollY)).toEqual([2000, 2000, 2000, 2000, 2000, 2000]);
});

test('a mouse press on the home button does not hold the footer open (keyed on :focus-visible)', async ({ page }) => {
  await freshPage(page);
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto('/home', { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('#closer', { state: 'attached' });
  await settleChrome(page);
  await scrollToY(page, 'max');

  // Press on the home button and release elsewhere: focus lands there by mouse, no click.
  const home = page.locator('footer button[aria-label="SettlementForge home"]');
  const box = await home.boundingBox();
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down();
  await page.mouse.move(8, 300);
  await page.mouse.up();
  const focus = await page.evaluate(() => ({
    label: document.activeElement.getAttribute('aria-label'),
    visible: document.activeElement.matches(':focus-visible'),
  }));
  expect(focus, 'presence control: the home button has focus, by mouse').toEqual({ label: 'SettlementForge home', visible: false });

  await scrollToY(page, 0);
  expectBandOnly(await footerBox(page));
});

test('print lays the footer back into the flow', async ({ page }) => {
  await freshPage(page);
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto('/terms', { waitUntil: 'domcontentloaded' });
  await settleChrome(page);
  expect(await page.evaluate(() => getComputedStyle(document.querySelector('footer')).position)).toBe('sticky');
  await page.emulateMedia({ media: 'print' });
  expect(await page.evaluate(() => getComputedStyle(document.querySelector('footer')).position)).toBe('static');
});

test('phones keep the in-flow footer, and the landing Terms link clears the bottom nav', async ({ page }) => {
  await freshPage(page);
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('/home', { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('#closer', { state: 'attached' });
  await settleChrome(page, { pinned: false });

  const state = await page.evaluate(() => ({
    position: getComputedStyle(document.querySelector('footer')).position,
    zIndex: getComputedStyle(document.querySelector('footer')).zIndex,
    bottom: getComputedStyle(document.querySelector('footer')).bottom,
    inset: document.documentElement.style.getPropertyValue('--sf-footer-inset'),
    tuck: document.documentElement.style.getPropertyValue('--sf-footer-tuck'),
    rows: document.querySelectorAll('[data-testid="legal-ribbon-row"]').length,
  }));
  // In the flow (never sticky on phones), on a low layer (z 2) so the landing's fixed
  // film (z 0) and its z-1 roots cannot paint over it, and nothing else changes order.
  expect(state.position).toBe('relative');
  expect(state.zIndex).toBe('2');
  expect(state.inset).toBe('0px');
  expect(state.tuck, 'nothing is tucked on phones').toBe('0px');
  expect(state.bottom, 'a zero offset: no geometry moves').toBe('0px');
  expect(state.rows).toBe(1);

  await scrollToY(page, 'max');
  const geo = await page.evaluate((paintedAtSrc) => {
    const paintedAt = new Function(`return (${paintedAtSrc})`)();
    const nav = [...document.querySelectorAll('.parchment-bg > nav')].find((d) => getComputedStyle(d).position === 'fixed');
    const terms = [...document.querySelectorAll('footer nav[aria-label="Footer"] button')].find((b) => b.textContent.trim() === 'Terms');
    const r = terms ? terms.getBoundingClientRect() : null;
    // What is actually PAINTED at the link's centre: the landing's film backdrop is a
    // fixed layer, so a footer that sits under it is in the right place and still
    // invisible. Rectangles alone passed on exactly that defect (see PAINT PROBES).
    const hit = r ? paintedAt(r.left + r.width / 2, r.top + r.height / 2) : null;
    return {
      navTop: nav ? nav.getBoundingClientRect().top : null,
      termsTop: r ? r.top : null,
      termsBottom: r ? r.bottom : null,
      termsPainted: !!(hit && terms && terms.contains(hit)),
    };
  }, PAINTED_AT);
  expect(geo.navTop, 'presence control: the fixed mobile nav rendered').not.toBeNull();
  expect(geo.termsBottom, 'presence control: the footer Terms link rendered').not.toBeNull();
  expect(geo.termsTop, 'the Terms link is inside the viewport at the end of the page').toBeGreaterThanOrEqual(0);
  expect(geo.termsBottom).toBeLessThanOrEqual(geo.navTop + EPS);
  expect(geo.termsPainted, 'the Terms link is the topmost thing at its own centre (not under the film)').toBe(true);
});

/** PipelineReveal's own layer, read from its source so the stand-in cannot drift from it. */
function revealLayerZ() {
  const src = readFileSync(new URL('../src/components/generate/PipelineReveal.jsx', import.meta.url), 'utf8');
  const m = src.match(/position: 'fixed', inset: 0, zIndex: (\d+)/);
  if (!m) throw new Error('PipelineReveal no longer declares its fixed full-viewport layer; re-anchor this probe');
  return Number(m[1]);
}

/**
 * Mount a stand-in for the generation reveal where GenerateWizard mounts the real one
 * (inside <main>, which forms no stacking context), then report what is PAINTED at the
 * footer's Terms link. Generating for real would add a worker run and a feature flag to
 * a stacking question the layer's three declarations answer.
 */
async function paintedOverRevealAtTerms(page, z) {
  return page.evaluate(({ paintedAtSrc, zIndex }) => {
    const paintedAt = new Function(`return (${paintedAtSrc})`)();
    const reveal = document.createElement('div');
    reveal.setAttribute('data-probe', 'reveal-stand-in');
    Object.assign(reveal.style, { position: 'fixed', inset: '0', zIndex: String(zIndex), background: '#000' });
    document.querySelector('main#main-content').appendChild(reveal);
    const terms = [...document.querySelectorAll('footer nav[aria-label="Footer"] button')].find((b) => b.textContent.trim() === 'Terms');
    const r = terms.getBoundingClientRect();
    const inView = r.top >= 0 && r.bottom <= window.innerHeight;
    const hit = paintedAt(r.left + r.width / 2, r.top + r.height / 2);
    const out = { inView, reveal: hit === reveal, terms: !!hit && terms.contains(hit) };
    reveal.remove();
    return out;
  }, { paintedAtSrc: PAINTED_AT, zIndex: z });
}

test('the generation reveal covers the in-flow phone footer; the desktop band shows over it like the header', async ({ page }) => {
  const z = revealLayerZ();
  await freshPage(page);
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('/terms', { waitUntil: 'domcontentloaded' });
  await settleChrome(page, { pinned: false });
  // The collapsed page sits scrolled to its end while the reveal plays, so the footer is in view.
  await scrollToY(page, 'max');
  const phone = await paintedOverRevealAtTerms(page, z);
  expect(phone.inView, 'presence control: the phone footer\'s Terms link is in the viewport').toBe(true);
  expect(phone, 'the reveal, not the footer, is painted at the Terms link').toEqual({ inView: true, reveal: true, terms: false });

  await page.setViewportSize({ width: 1280, height: 800 });
  await settleChrome(page);
  await scrollToY(page, 0);
  const desktop = await paintedOverRevealAtTerms(page, z);
  expect(desktop, 'the pinned band is painted over the reveal, as the header is').toEqual({ inView: true, reveal: false, terms: true });
});
