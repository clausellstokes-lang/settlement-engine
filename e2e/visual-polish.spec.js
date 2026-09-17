import { test, expect } from '@playwright/test';

/**
 * e2e/visual-polish.spec.js: THE SMALL VISUAL DEFECTS, measured in a real layout engine.
 *
 * Owner order (2026-09-17): "Fix the small visual defects." The three named to the owner:
 *   (a) the Realm page's Instant World card read "ee Premium": its locked button could not
 *       wrap its "Available at launch" pill inside the 240px sidebar, so label and pill
 *       spilled out of both sides and the card clipped them;
 *   (b) the Pricing page's Surveyor card had a large empty gap in its middle: its body
 *       paragraph grew to fill the stretched card;
 *   (c) the landing page showed a plain cream strip between the arrow's shaft and the
 *       painted film once scrolled: a cream stop's empty bottom band passing under the
 *       transparent header (not a space kept for the feather).
 * And one found beside them: the phone landing scrolled 2px sideways (a 380px grid track
 * in a 366px column).
 *
 * jsdom pins the style contracts (tests/components/launchLock.upsells.test.jsx,
 * tests/ui/pricingPageBands.test.jsx, tests/ui/homeLanding.test.jsx); these arms measure
 * the boxes. Pages load their view lazily after the shell, so each arm waits for
 * [data-sf-route-loading] to be gone first (settleRoute in e2e/pinned-footer.spec.js).
 */

test.skip(({ browserName, isMobile }) => browserName !== 'chromium' || isMobile, 'Desktop Chromium suite: it sets its own viewports');

/** Sub-pixel slack for comparisons between independently rounded boxes. */
const EPS = 1;

async function settleRoute(page) {
  await page.waitForFunction(() => !document.querySelector('[data-sf-route-loading]'));
  await page.evaluate(() => document.fonts.ready);
}

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    try { localStorage.clear(); sessionStorage.clear(); } catch { /* storage unavailable */ }
  });
});

for (const viewport of [{ width: 1024, height: 768 }, { width: 1440, height: 900 }]) {
  test(`(a) the Realm sidebar's locked Instant World button holds its label and pill at ${viewport.width}px`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.goto('/realm');
    await settleRoute(page);
    const button = page.getByTestId('instant-world-open');
    await expect(button).toBeVisible({ timeout: 20_000 });
    await expect(button.locator('[data-launch-pill]')).toHaveCount(1);
    const box = await button.evaluate((el) => {
      const b = el.getBoundingClientRect();
      const card = el.closest('[data-testid="instant-world-entry"]').getBoundingClientRect();
      // The label is a text node, so the content box is a Range over the button's contents.
      const range = document.createRange();
      range.selectNodeContents(el);
      const rects = [...range.getClientRects()].filter((r) => r.width > 0);
      return {
        left: b.left, right: b.right,
        contentLeft: Math.min(...rects.map((r) => r.left)),
        contentRight: Math.max(...rects.map((r) => r.right)),
        cardLeft: card.left, cardRight: card.right,
        wrap: getComputedStyle(el).flexWrap,
      };
    });
    expect(box.contentLeft, 'the label starts inside the button').toBeGreaterThanOrEqual(box.left - EPS);
    expect(box.contentRight, 'the pill ends inside the button').toBeLessThanOrEqual(box.right + EPS);
    expect(box.left).toBeGreaterThanOrEqual(box.cardLeft - EPS);
    expect(box.right).toBeLessThanOrEqual(box.cardRight + EPS);
    expect(box.wrap).toBe('wrap');
  });

  test(`(b) the Surveyor card reads straight down, its CTA level with the Wanderer's, at ${viewport.width}px`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.goto('/pricing');
    await settleRoute(page);
    const surveyor = page.locator('article[aria-labelledby="tier-surveyor-name"]');
    await expect(surveyor).toBeVisible({ timeout: 20_000 });
    const m = await page.evaluate(() => {
      const card = (id) => document.querySelector(`article[aria-labelledby="${id}"]`);
      const s = card('tier-surveyor-name');
      const kids = [...s.children];
      const rect = (el) => el.getBoundingClientRect();
      const paragraphSlack = kids.filter((k) => k.tagName === 'P').map((k) => {
        const range = document.createRange();
        range.selectNodeContents(k);
        return rect(k).height - range.getBoundingClientRect().height;
      });
      const contentGaps = kids.slice(1, -1).map((k, i) => rect(k).top - rect(kids[i]).bottom);
      const cta = (el) => el.children[el.children.length - 1];
      return {
        paragraphSlack,
        contentGaps,
        surveyorCtaBottom: rect(cta(s)).bottom,
        wandererCtaBottom: rect(cta(card('tier-wanderer-name'))).bottom,
      };
    });
    for (const slack of m.paragraphSlack) expect(slack, 'no paragraph box grows past its text').toBeLessThanOrEqual(6);
    for (const gap of m.contentGaps) expect(gap, 'the lead, body and key note sit one gap apart').toBeLessThanOrEqual(24);
    expect(Math.abs(m.surveyorCtaBottom - m.wandererCtaBottom), 'the CTAs stay level').toBeLessThanOrEqual(2);
  });
}

test('(c) every cream stop fades its empty tail into the film, so no plain strip sits under the shaft', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');
  await page.waitForSelector('#commons', { timeout: 30_000 });
  await settleRoute(page);
  const stops = await page.evaluate(() => [...document.querySelectorAll('section.sf-landing-scene-cream')].map((section) => {
    const style = getComputedStyle(section);
    return { id: section.id, pad: style.paddingBottom, mask: style.maskImage || style.webkitMaskImage };
  }));
  expect(stops.map((s) => s.id)).toEqual(['forge', 'voice', 'realm', 'commons']);
  for (const stop of stops) {
    expect(stop.pad).toBe('84px');
    expect(stop.mask, `${stop.id} fades over exactly its tail`).toMatch(/^linear-gradient\(rgb\(.+\) calc\(100% - 84px\), rgba\(0, 0, 0, 0\)\)$/);
  }
});

test('the phone landing does not scroll sideways', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await page.waitForSelector('#commons', { timeout: 30_000 });
  await settleRoute(page);
  const widths = await page.evaluate(() => ({
    scroll: document.documentElement.scrollWidth,
    client: document.documentElement.clientWidth,
    forgeTrack: getComputedStyle([...document.querySelectorAll('#forge > div')].find((d) => getComputedStyle(d).display === 'grid')).gridTemplateColumns,
  }));
  expect(widths.scroll).toBeLessThanOrEqual(widths.client);
  expect(Number.parseFloat(widths.forgeTrack)).toBeLessThanOrEqual(widths.client);
});
