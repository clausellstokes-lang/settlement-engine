/**
 * e2e/arrow-header.spec.js: THE PAINTED ARROW HEADER, in a real layout engine.
 *
 * The owner's orders (2026-09-16): "Replace the arrow ribbon entirely with the following
 * image however appropriate. ... I do not want you to emulate it." And: "The top of the
 * wooden shaft (not the top feather) is where the page starts, so cut off that top feather."
 *
 * jsdom cannot see any of this (tests/components/arrowHeader.test.jsx pins the contract), so
 * these arms measure boxes:
 *   1. at 1024, 1280, 1440, 1920 and 2560 the header box is exactly the painted band for the
 *      page's own clientWidth (components/nav/arrowGeometry.js, imported here), the page never
 *      scrolls sideways, and the header's first row is the top of the viewport;
 *   2. below the band, where the feather is PAINTED (a paint probe that lifts pointer-events
 *      finds the arrow's image), a real hit test reaches the page underneath, and nothing of
 *      main starts under the feather at scroll top;
 *   3. Tab order: the skip link, the home control, the six painted words, the account;
 *   4. a click on each painted word lands on its route and marks it aria-current;
 *   5. on a generated dossier scrolled so its toolbar pins, the toolbar's Back button is
 *      painted over the feather (the toolbar's layer is above the hang layer);
 *   6. print leaves out the hang layer;
 *   7. 640 to 1023 px: the compact arrow, the six-seat bottom bar, and the footer in the flow;
 *   8. (mobile-safari, WebKit at 390 px) the compact arrow, the bottom bar, a Sign In plate of
 *      at least 44 x 44, and a signed-in plate menu that opens inside the viewport, at 390 and
 *      at the 320 px reflow width;
 *   9. THE FEATHER HIDES ON SCROLL (owner, 2026-09-17): at scroll 0 the feather is painted;
 *      after 1 px and after 400 px its computed opacity is 0 and the page shows through
 *      (the pixels match a frame with the feather removed), while the barb is still
 *      painted; back at 0 its opacity is 1; with a NEGATIVE CONTROL showing the pixel
 *      comparison convicts a feather forced back on while scrolled;
 *  10. a signed-in name (8 letters) is shown whole on the plate at 1024 px (and at 390 px in
 *      WebKit), not cut to an ellipsis;
 *  11. with a real classic scrollbar (Chromium launched without --hide-scrollbars), the
 *      header's first committed frame already fits the page: nothing scrolls sideways.
 *
 * PAINT PROBES lift pointer-events for the duration of one hit test, because the hang layer is
 * pointer-events: none and a plain elementFromPoint skips it (e2e/pinned-footer.spec.js).
 */

import { chromium, test, expect } from '@playwright/test';
import { layoutArrow } from '../src/components/nav/arrowGeometry.js';

/** Sub-pixel slack for comparisons between independently snapped boxes. */
const EPS = 0.1;

/** In-page helper source: the topmost PAINTED element at a point. */
const PAINTED_AT = `(x, y) => {
  const probe = document.createElement('style');
  probe.textContent = '*{pointer-events:auto!important}';
  document.head.appendChild(probe);
  const el = document.elementFromPoint(x, y);
  probe.remove();
  return el;
}`;

const MOCK_FREE_AUTH = {
  user: { id: 'mock-arrow-e2e', email: 'arrow@example.test', user_metadata: {} },
  session: { access_token: 'mock-token' },
  tier: 'free',
  role: 'user',
  displayName: 'Wanderer',
  isFounder: false,
  needsVerification: false,
  emailNotifications: true,
};

async function freshPage(page, { auth = null } = {}) {
  await page.addInitScript((a) => {
    try { localStorage.clear(); } catch { /* sandboxed storage */ }
    try { sessionStorage.clear(); } catch { /* sandboxed storage */ }
    if (a) { try { localStorage.setItem('settlement_mock_auth', JSON.stringify(a)); } catch { /* private mode */ } }
  }, auth);
}

async function raf(page) {
  await page.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))));
}

/** Wait for the header to be laid out and its painted lengths to be written. */
async function settleHeader(page) {
  await page.waitForSelector('.parchment-bg > header[data-sf-arrow-header]');
  await page.waitForFunction(() => document.documentElement.style.getPropertyValue('--sf-header-h') !== '');
  await page.evaluate(() => document.fonts.ready);
  await raf(page);
}

test.describe('desktop (Chromium)', () => {
  test.skip(({ browserName, isMobile }) => browserName !== 'chromium' || isMobile, 'Desktop Chromium arms: they set their own viewports');

  for (const width of [1024, 1280, 1440, 1920, 2560]) {
    test(`at ${width} px the header is the painted band for the page width, and nothing scrolls sideways`, async ({ page }) => {
      await freshPage(page);
      await page.setViewportSize({ width, height: 900 });
      await page.goto('/terms', { waitUntil: 'domcontentloaded' });
      await settleHeader(page);
      const m = await page.evaluate(() => {
        const header = document.querySelector('.parchment-bg > header');
        const r = header.getBoundingClientRect();
        const hang = header.nextElementSibling.getBoundingClientRect();
        return {
          clientWidth: document.documentElement.clientWidth,
          scrollWidth: document.documentElement.scrollWidth,
          top: r.top,
          height: r.height,
          hangTop: hang.top,
          mode: header.getAttribute('data-sf-arrow-header'),
          regions: header.querySelectorAll('nav button').length,
        };
      });
      const layout = layoutArrow({ clientWidth: m.clientWidth, full: true });
      expect(m.mode).toBe('full');
      expect(m.regions).toBe(6);
      expect(m.top, 'the page starts at the top of the shaft').toBe(0);
      expect(Math.abs(m.height - layout.bandPx), `header ${m.height} vs band ${layout.bandPx}`).toBeLessThanOrEqual(EPS);
      expect(Math.abs(m.hangTop - m.height), 'the hang layer hangs from the band\'s bottom row').toBeLessThanOrEqual(EPS);
      expect(m.scrollWidth, 'no horizontal overflow').toBe(m.clientWidth);
    });
  }

  test('below the band the feather is painted, a click reaches the page, and main starts clear of it', async ({ page }) => {
    await freshPage(page);
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/terms', { waitUntil: 'domcontentloaded' });
    await settleHeader(page);
    const m = await page.evaluate((paintedAtSrc) => {
      const paintedAt = new Function(`return (${paintedAtSrc})`)();
      const header = document.querySelector('.parchment-bg > header');
      const band = header.getBoundingClientRect().height;
      const hangPx = parseFloat(document.documentElement.style.getPropertyValue('--sf-arrow-hang'));
      // Inside the feather: strip x ~100, a third of the way down the hang.
      const s = band / 68;
      const x = Math.round(100 * s);
      const y = Math.round(band + hangPx / 3);
      const painted = paintedAt(x, y);
      const hit = document.elementFromPoint(x, y);
      const main = document.querySelector('main#main-content');
      const firstContent = main.firstElementChild.getBoundingClientRect();
      return {
        paintedIsArrow: !!painted && !!painted.closest('.sf-arrow-hang'),
        paintedTag: painted && painted.tagName,
        hitIsArrow: !!hit && !!hit.closest('.sf-arrow-hang, header'),
        hitInPage: !!hit && !!hit.closest('.parchment-bg'),
        contentTop: firstContent.top,
        clear: band + hangPx,
      };
    }, PAINTED_AT);
    expect(m.paintedIsArrow, 'presence control: the feather really is painted at the probe point').toBe(true);
    expect(m.paintedTag).toBe('IMG');
    expect(m.hitIsArrow, 'the hang layer takes no pointer events').toBe(false);
    expect(m.hitInPage).toBe(true);
    expect(m.contentTop, 'main reserves the hang at scroll top').toBeGreaterThanOrEqual(m.clear - EPS);
  });

  test('Tab order: skip link, home, the six painted words, then the account', async ({ page }) => {
    await freshPage(page);
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/terms', { waitUntil: 'domcontentloaded' });
    await settleHeader(page);
    const seen = [];
    for (let i = 0; i < 9; i += 1) {
      await page.keyboard.press('Tab');
      seen.push(await page.evaluate(() => {
        const el = document.activeElement;
        return (el.getAttribute('aria-label') || el.textContent || '').trim();
      }));
    }
    expect(seen).toEqual([
      'Skip to content', 'SettlementForge home',
      'Create', 'Library', 'Realm', 'Compendium', 'Gallery', 'About',
      'Sign In',
    ]);
  });

  test('a click on each painted word lands on its route and marks it current', async ({ page }) => {
    await freshPage(page);
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/terms', { waitUntil: 'domcontentloaded' });
    await settleHeader(page);
    const routes = [
      ['Library', '/settlements'], ['Compendium', '/compendium'], ['Gallery', '/gallery'],
      ['About', '/about/what-this-is'], ['Realm', '/realm'], ['Create', '/create'],
    ];
    for (const [label, path] of routes) {
      await page.locator('header nav button', { hasText: label }).click();
      await expect(page).toHaveURL(new RegExp(`${path}$`));
      await expect(page.locator('header nav button[aria-current="page"]')).toHaveText(label);
    }
  });

  test('on a pinned dossier toolbar the Back button is painted over the feather', async ({ page }) => {
    test.setTimeout(60_000);
    await freshPage(page, { auth: MOCK_FREE_AUTH });
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/create');
    const hero = page.locator('section[aria-label*="generator"]').first();
    await expect(hero).toBeVisible({ timeout: 15_000 });
    await hero.locator('button[data-settlement-size="village"]').click();
    await hero.getByRole('button', { name: /Generate a|Forge a|Begin a settlement/i }).first().click();
    const back = page.getByRole('button', { name: /^Back$/ }).first();
    await expect(back).toBeVisible({ timeout: 30_000 });
    await settleHeader(page);
    await page.evaluate(() => window.scrollTo({ top: 600, behavior: 'instant' }));
    await raf(page);
    const m = await page.evaluate((paintedAtSrc) => {
      const paintedAt = new Function(`return (${paintedAtSrc})`)();
      const button = [...document.querySelectorAll('button')].find((b) => b.textContent.trim() === 'Back');
      const r = button.getBoundingClientRect();
      const header = document.querySelector('.parchment-bg > header').getBoundingClientRect();
      const hangPx = parseFloat(document.documentElement.style.getPropertyValue('--sf-arrow-hang'));
      const x = r.left + r.width / 2;
      const y = r.top + r.height / 2;
      const hit = paintedAt(x, y);
      return {
        scrollY: window.scrollY,
        pinnedAt: button.closest('[style*="sticky"]').getBoundingClientRect().top,
        headerBottom: header.bottom,
        underFeather: y < header.bottom + hangPx && x < 470 * (header.height / 68),
        painted: !!hit && button.contains(hit),
      };
    }, PAINTED_AT);
    expect(m.scrollY, 'presence control: the page scrolled').toBeGreaterThan(0);
    expect(Math.abs(m.pinnedAt - m.headerBottom), 'the toolbar is pinned flush under the band').toBeLessThanOrEqual(1);
    expect(m.underFeather, 'presence control: the Back button sits where the feather hangs').toBe(true);
    expect(m.painted, 'the Back button is painted over the feather').toBe(true);
  });

  test('print leaves out the hang layer', async ({ page }) => {
    await freshPage(page);
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/terms', { waitUntil: 'domcontentloaded' });
    await settleHeader(page);
    expect(await page.evaluate(() => getComputedStyle(document.querySelector('.sf-arrow-hang')).display)).not.toBe('none');
    await page.emulateMedia({ media: 'print' });
    expect(await page.evaluate(() => getComputedStyle(document.querySelector('.sf-arrow-hang')).display)).toBe('none');
  });

  test('the feather hides once the page scrolls and comes back at the very top; the barb stays', async ({ page }) => {
    await freshPage(page);
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/terms', { waitUntil: 'domcontentloaded' });
    await settleHeader(page);
    const boxes = await page.evaluate(() => {
      const hang = document.querySelector('.sf-arrow-hang');
      const r = (sel) => { const b = hang.querySelector(sel).getBoundingClientRect(); return { x: b.left, y: b.top, w: b.width, h: b.height }; };
      return {
        feather: r('[data-sf-arrow-paint="feather"]'), hang: r('[data-sf-arrow-paint="hang"]'),
        band: document.querySelector('.parchment-bg > header').getBoundingClientRect().height,
        clientWidth: document.documentElement.clientWidth,
      };
    });
    const layout = layoutArrow({ clientWidth: boxes.clientWidth, full: true });
    const { s } = layout;
    // Below the band only: the feather's own rows, and the barb (strip columns 1940 to 2037, rows 68 to 109).
    const featherClip = { x: 0, y: Math.ceil(boxes.band + 2), width: Math.floor(boxes.feather.w), height: Math.floor(100 * s) };
    const barbClip = { x: Math.floor(layout.mapX(1945)), y: Math.ceil(boxes.band + 2), width: Math.floor(85 * s), height: Math.floor(35 * s) };
    const state = () => page.evaluate(() => {
      const el = document.querySelector('.sf-arrow-hang [data-sf-arrow-paint="feather"]');
      return { scrollY: window.scrollY, opacity: getComputedStyle(el).opacity, hangOpacity: getComputedStyle(document.querySelector('.sf-arrow-hang [data-sf-arrow-paint="hang"]')).opacity };
    });
    /** A screenshot of a clip, then the same clip with one part of the arrow removed. */
    const withAndWithout = async (clip, part) => {
      const shown = await page.screenshot({ clip, animations: 'disabled', caret: 'hide' });
      await page.evaluate((p) => { document.querySelector(`.sf-arrow-hang [data-sf-arrow-paint="${p}"]`).style.visibility = 'hidden'; }, part);
      await raf(page);
      const removed = await page.screenshot({ clip, animations: 'disabled', caret: 'hide' });
      await page.evaluate((p) => { document.querySelector(`.sf-arrow-hang [data-sf-arrow-paint="${p}"]`).style.visibility = ''; }, part);
      await raf(page);
      return shown.equals(removed);
    };
    const scrollTo = async (y) => {
      await page.evaluate((top) => window.scrollTo({ top, behavior: 'instant' }), y);
      await page.waitForFunction((top) => Math.abs(window.scrollY - top) < 0.5, y);
      await page.waitForFunction((top) => getComputedStyle(document.querySelector('.sf-arrow-hang [data-sf-arrow-paint="feather"]')).opacity === (top < 1 ? '1' : '0'), y);
      await raf(page);
    };

    expect(await state()).toEqual({ scrollY: 0, opacity: '1', hangOpacity: '1' });
    expect(await withAndWithout(featherClip, 'feather'), 'at the top the feather is painted (removing it changes the pixels)').toBe(false);

    for (const y of [1, 400]) {
      await scrollTo(y);
      expect(await state(), `scrolled ${y} px`).toEqual({ scrollY: y, opacity: '0', hangOpacity: '1' });
      expect(await withAndWithout(featherClip, 'feather'), `scrolled ${y} px: the page shows through where the feather was`).toBe(true);
      expect(await withAndWithout(barbClip, 'hang'), `scrolled ${y} px: the barb is still painted`).toBe(false);
    }

    // NEGATIVE CONTROL: the same comparison convicts a feather forced back on while scrolled.
    await page.evaluate(() => {
      const el = document.querySelector('.sf-arrow-hang [data-sf-arrow-paint="feather"]');
      el.style.transition = 'none';
      el.style.opacity = '1';
    });
    await raf(page);
    expect(await withAndWithout(featherClip, 'feather'), 'a forced-on feather is caught').toBe(false);
    await page.evaluate(() => {
      const el = document.querySelector('.sf-arrow-hang [data-sf-arrow-paint="feather"]');
      el.style.transition = 'opacity 120ms ease-out';
      el.style.opacity = '0';
    });

    await scrollTo(0);
    expect(await state()).toEqual({ scrollY: 0, opacity: '1', hangOpacity: '1' });
    expect(await withAndWithout(featherClip, 'feather'), 'back at the top the feather is painted again').toBe(false);
  });

  test('at 1024 px an 8-letter signed-in name shows whole on the plate', async ({ page }) => {
    await freshPage(page, { auth: MOCK_FREE_AUTH });
    await page.setViewportSize({ width: 1024, height: 768 });
    await page.goto('/terms', { waitUntil: 'domcontentloaded' });
    await settleHeader(page);
    const plate = page.getByRole('button', { name: /^Account menu, Wanderer/ });
    await expect(plate).toBeVisible({ timeout: 15_000 });
    await raf(page);
    const m = await plate.evaluate((btn) => {
      const name = btn.querySelector('[title]');
      return { text: name.textContent, title: name.title, clipped: name.scrollWidth > name.clientWidth, size: parseFloat(getComputedStyle(name).fontSize) };
    });
    expect([m.text, m.title]).toEqual(['Wanderer', 'Wanderer']);
    expect(m.clipped, `the name is cut at ${m.size} px`).toBe(false);
    expect(m.size).toBeGreaterThanOrEqual(9);
  });

  test('640 to 1023 px: the compact arrow, a six-seat bottom bar, and the footer in the flow above it', async ({ page }) => {
    await freshPage(page);
    await page.setViewportSize({ width: 800, height: 900 });
    await page.goto('/terms', { waitUntil: 'domcontentloaded' });
    await settleHeader(page);
    await page.evaluate(() => window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'instant' }));
    await raf(page);
    const m = await page.evaluate(() => {
      const header = document.querySelector('.parchment-bg > header');
      const bar = [...document.querySelectorAll('.parchment-bg > nav')].find((d) => getComputedStyle(d).position === 'fixed');
      const footer = document.querySelector('footer');
      const layoutWidth = document.documentElement.clientWidth;
      return {
        mode: header.getAttribute('data-sf-arrow-header'),
        nav: header.querySelectorAll('nav').length,
        headerH: header.getBoundingClientRect().height,
        layoutWidth,
        seats: bar ? [...bar.querySelectorAll('button')].map((b) => b.textContent.trim()) : null,
        barTop: bar ? bar.getBoundingClientRect().top : null,
        footerPosition: getComputedStyle(footer).position,
        footerBottom: footer.getBoundingClientRect().bottom,
        inset: document.documentElement.style.getPropertyValue('--sf-footer-inset'),
        scrollWidth: document.documentElement.scrollWidth,
      };
    });
    expect(m.mode).toBe('compact');
    expect(m.nav).toBe(0);
    expect(Math.abs(m.headerH - layoutArrow({ clientWidth: m.layoutWidth, full: false }).bandPx)).toBeLessThanOrEqual(EPS);
    expect(m.seats).toEqual(['Create', 'Library', 'Realm', 'Gallery', 'Compendium', 'About']);
    expect(m.footerPosition, 'the footer pins only with the full arrow').toBe('relative');
    expect(m.inset).toBe('0px');
    expect(m.footerBottom, 'at the end of the page the whole footer clears the bar').toBeLessThanOrEqual(m.barTop + 1);
    expect(m.scrollWidth).toBe(m.layoutWidth);
  });
});

test.describe('phone (WebKit, iPhone 13)', () => {
  test.skip(({ isMobile }) => !isMobile, 'mobile-safari arms');

  test('the compact arrow, the bottom bar, and a Sign In plate of at least 44 x 44', async ({ page }) => {
    await freshPage(page);
    await page.goto('/terms', { waitUntil: 'domcontentloaded' });
    await settleHeader(page);
    const m = await page.evaluate(() => {
      const header = document.querySelector('.parchment-bg > header');
      const plate = [...header.querySelectorAll('button')].find((b) => b.textContent.trim() === 'Sign In');
      const home = header.querySelector('button[aria-label="SettlementForge home"]');
      const bar = [...document.querySelectorAll('.parchment-bg > nav')].find((d) => getComputedStyle(d).position === 'fixed');
      const box = (el) => { const r = el.getBoundingClientRect(); return { w: r.width, h: r.height, right: r.right }; };
      return {
        mode: header.getAttribute('data-sf-arrow-header'),
        plate: box(plate),
        home: box(home),
        seats: bar ? bar.querySelectorAll('button').length : 0,
        clientWidth: document.documentElement.clientWidth,
        scrollWidth: document.documentElement.scrollWidth,
      };
    });
    expect(m.mode).toBe('compact');
    expect(m.seats).toBe(5);
    expect(m.plate.w).toBeGreaterThanOrEqual(44);
    expect(m.plate.h).toBeGreaterThanOrEqual(44);
    expect(m.home.h).toBeGreaterThanOrEqual(44);
    expect(m.plate.right).toBeLessThanOrEqual(m.clientWidth);
    expect(m.scrollWidth).toBe(m.clientWidth);
  });

  test('the signed-in plate menu opens inside the viewport', async ({ page }) => {
    await freshPage(page, { auth: MOCK_FREE_AUTH });
    await page.goto('/terms', { waitUntil: 'domcontentloaded' });
    await settleHeader(page);
    const plate = page.getByRole('button', { name: /^Account menu, Wanderer/ });
    await expect(plate).toBeVisible({ timeout: 15_000 });
    await plate.click();
    const menu = page.getByRole('menu');
    await expect(menu).toBeVisible();
    const r = await menu.boundingBox();
    const vw = await page.evaluate(() => window.innerWidth);
    expect(r.x).toBeGreaterThanOrEqual(0);
    expect(r.x + r.width).toBeLessThanOrEqual(vw);
    await expect(menu.getByRole('menuitem', { name: /credits remaining$/ })).toBeVisible();
  });

  test('at the 320 px reflow width the plate menu still opens inside the viewport', async ({ page }) => {
    await freshPage(page, { auth: { ...MOCK_FREE_AUTH } });
    await page.setViewportSize({ width: 320, height: 640 });
    await page.goto('/terms', { waitUntil: 'domcontentloaded' });
    await settleHeader(page);
    const plate = page.getByRole('button', { name: /^Account menu, Wanderer/ });
    await expect(plate).toBeVisible({ timeout: 15_000 });
    await plate.click();
    const menu = page.getByRole('menu');
    await expect(menu).toBeVisible();
    const r = await menu.boundingBox();
    const vw = await page.evaluate(() => document.documentElement.clientWidth);
    expect(vw).toBe(320);
    expect(r.x, 'the menu starts on the page').toBeGreaterThanOrEqual(0);
    expect(r.x + r.width).toBeLessThanOrEqual(vw);
    // Every row's label starts on the page too.
    const lefts = await menu.evaluate((el) => [...el.querySelectorAll('[role="menuitem"]')].map((row) => row.getBoundingClientRect().left));
    expect(lefts.length).toBeGreaterThanOrEqual(3);
    for (const left of lefts) expect(left).toBeGreaterThanOrEqual(0);
  });

  test('an 8-letter signed-in name shows whole on the phone plate', async ({ page }) => {
    await freshPage(page, { auth: MOCK_FREE_AUTH });
    await page.goto('/terms', { waitUntil: 'domcontentloaded' });
    await settleHeader(page);
    const plate = page.getByRole('button', { name: /^Account menu, Wanderer/ });
    await expect(plate).toBeVisible({ timeout: 15_000 });
    await page.evaluate(() => document.fonts.ready);
    await raf(page);
    const m = await plate.evaluate((btn) => {
      const name = btn.querySelector('[title]');
      return { text: name.textContent, clipped: name.scrollWidth > name.clientWidth, size: parseFloat(getComputedStyle(name).fontSize) };
    });
    expect(m.text).toBe('Wanderer');
    expect(m.clipped, `the name is cut at ${m.size} px`).toBe(false);
  });
});

test.describe('a real classic scrollbar (Chromium)', () => {
  test.skip(({ browserName, isMobile }) => browserName !== 'chromium' || isMobile, 'Chromium desktop only');

  test('the first committed frame already lays the arrow across the page, not across the viewport', async ({ baseURL }) => {
    // Playwright launches headless Chromium with --hide-scrollbars, where clientWidth always
    // equals innerWidth and the width the JS sizing exists for never happens; launchOptions
    // cannot be set per describe (it forces a worker), so this arm launches its own browser.
    const browser = await chromium.launch({ ignoreDefaultArgs: ['--hide-scrollbars'] });
    try {
      const context = await browser.newContext({ viewport: { width: 1440, height: 700 } });
      const page = await context.newPage();
      await freshPage(page);
      await page.addInitScript(() => {
        // Record the page's width before the app exists, and the header as React first
        // commits it: a MutationObserver callback is a microtask, so it runs after the commit
        // and the updates its layout effects schedule, and before any later task (a paint
        // may follow a task).
        window.__firstFrame = null;
        document.addEventListener('DOMContentLoaded', () => { window.__widthBeforeApp = document.documentElement.clientWidth; });
        new MutationObserver((_records, observer) => {
          const band = document.querySelector('[data-sf-arrow-paint="band"]');
          if (!band) return;
          observer.disconnect();
          window.__firstFrame = {
            paintWidth: parseFloat(band.style.width),
            clientWidth: document.documentElement.clientWidth,
            scrollWidth: document.documentElement.scrollWidth,
            innerWidth: window.innerWidth,
          };
        }).observe(document, { childList: true, subtree: true });
      });
      await page.goto(new URL('/terms', baseURL).href, { waitUntil: 'domcontentloaded' });
      await settleHeader(page);
      const m = await page.evaluate(() => ({ first: window.__firstFrame, before: window.__widthBeforeApp }));
      expect(m.first, 'presence control: the first frame was recorded').not.toBeNull();
      expect(m.first.clientWidth, 'presence control: a classic scrollbar takes width once the page is tall').toBeLessThan(m.first.innerWidth);
      expect(m.before, 'presence control: before the app existed there was no scrollbar').toBe(m.first.innerWidth);
      expect(m.first.paintWidth, 'the first frame is laid across the page width').toBe(m.first.clientWidth);
      expect(m.first.scrollWidth, 'nothing scrolls sideways on the first frame').toBe(m.first.clientWidth);
    } finally {
      await browser.close();
    }
  });
});
