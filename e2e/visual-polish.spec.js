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
  test(`(a) the Realm sidebar's locked gate holds its label and pill at ${viewport.width}px`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.goto('/realm');
    await settleRoute(page);
    // ⚠ THE SUBJECT MOVED, AND THE DEFECT MOVED WITH IT. Owner defect (a) was the Instant
    // World card's LOCKED button, whose label and "Available at launch" pill could not wrap
    // inside the Realm's 240px sidebar and spilled out of both sides. Since 7a203fc36 ("The
    // desktop Realm gate is as honest as the phone's, and both doors are true") the palette
    // withholds that card from a non-entitled viewer and draws RealmLockedGate in its place.
    // And the card's guard, `canManageCampaigns`, is the SAME predicate as its own
    // `canGenerate`, so `premiumReachClosed` is always false at the one live mount: the
    // LOCKED Instant World button is unreachable on the live surface by construction, and
    // this arm's anonymous visit could never reach it again. That commit's own body says
    // where the measurement went — "Its wrap site follows the pill from RealmDashboard to
    // RealmLockedGate in the census" — so the arm follows it, to the live locked control in
    // the same 240px sidebar, with the same label, pill and wrap to measure. The card's own
    // contract stays pinned in jsdom (tests/components/launchLock.upsells.test.jsx).
    const card = page.getByTestId('realm-palette-locked');
    await expect(card).toBeVisible({ timeout: 20_000 });
    const button = card.getByRole('button', { name: /See Cartographer/i });
    await expect(button).toBeVisible();
    await expect(button.locator('[data-launch-pill]')).toHaveCount(1);
    const box = await button.evaluate((el) => {
      const b = el.getBoundingClientRect();
      const card_ = el.closest('[data-testid="realm-palette-locked"]').getBoundingClientRect();
      // The label is a text node, so the content box is a Range over the button's contents.
      const range = document.createRange();
      range.selectNodeContents(el);
      const rects = [...range.getClientRects()].filter((r) => r.width > 0);
      return {
        left: b.left, right: b.right,
        contentLeft: Math.min(...rects.map((r) => r.left)),
        contentRight: Math.max(...rects.map((r) => r.right)),
        cardLeft: card_.left, cardRight: card_.right,
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

test('the phone landing does not scroll sideways, and is the hero alone (§934.27)', async ({ page }) => {
  // ⚠ THIS ARM USED TO WAIT FOR #commons. The owner's §934.27 order takes the below-fold
  // OFF the phone entirely — "I only want this part to show, not the other scroll down" —
  // so the wait would time out on a page that is behaving exactly as ordered. It settles
  // on the hero instead, and adds the order's own two measurements while it is there: no
  // below-fold section mounted, and one painted image on the page.
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await page.waitForSelector('section.sf-landing-hero', { timeout: 30_000 });
  await settleRoute(page);
  const m = await page.evaluate(() => ({
    scroll: document.documentElement.scrollWidth,
    client: document.documentElement.clientWidth,
    belowFold: ['forge', 'voice', 'realm', 'commons', 'closer'].filter((id) => document.getElementById(id)),
    heroMinH: getComputedStyle(document.querySelector('section.sf-landing-hero')).minHeight,
    images: [...document.querySelectorAll('*')]
      .flatMap((el) => [...String(el.getAttribute('style') || '').matchAll(/url\((['"]?)([^'")]+)\1\)/g)])
      .map((x) => x[2])
      .concat([...document.querySelectorAll('img, picture, video')].map((el) => el.tagName)),
  }));
  expect(m.scroll).toBeLessThanOrEqual(m.client);
  expect(m.belowFold, 'a below-fold section mounted at phone width').toEqual([]);
  // The hero really fills the band: a min-height in px, at least most of the viewport.
  expect(Number.parseFloat(m.heroMinH)).toBeGreaterThan(600);
  // "and its background image as the only one" — the hero's scene, and nothing else.
  expect(m.images).toHaveLength(1);
  expect(m.images[0]).toMatch(/still-0-desk/);
});

test('the TABLET landing keeps the below fold, and its two-column track never exceeds its column', async ({ page }) => {
  // 640 to 1023 px: the below fold still mounts (§934.27 moves the phone only), so the
  // grid-track measurement the phone arm used to carry lives here, at the narrowest width
  // that still draws it — which is also the tightest column the track has to fit.
  await page.setViewportSize({ width: 640, height: 900 });
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
