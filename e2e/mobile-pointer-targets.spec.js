/**
 * e2e/mobile-pointer-targets.spec.js — P99 mobile pointer-target floor.
 *
 * Asserts that on a mobile viewport (iPhone 13 profile, configured in
 * playwright.config.js under the `mobile-safari` project), every
 * interactive element on the anonymous landing surface meets the 44×44
 * touch-target floor recommended by Apple HIG and Material Design.
 *
 * Why this test exists:
 *   The mobile UX refactor (Tier 7.18 / P77) added a slim mobile header
 *   with a brand wordmark + Sign-In chip, and the HomeHero card picker
 *   was retuned for thumb reach. Without an assertion, a future CSS
 *   change can quietly shrink a chip back below the floor — and we
 *   wouldn't catch it until a user complains.
 *
 *   This spec deliberately ignores anything that's *visually* a button
 *   but lives inside a parent the user taps (e.g. the X inside a chip
 *   the whole chip is tappable as one target). We measure the
 *   outermost interactive element; cosmetic-only inner SVGs aren't
 *   evaluated.
 *
 * Run only the mobile project:
 *   npx playwright test --project=mobile-safari mobile-pointer-targets
 *
 * To intentionally bypass the floor on a specific element (e.g. a
 * dev-only debug bar), give it `data-pt-allow-small="1"` and the test
 * will skip it.
 */

import { test, expect } from '@playwright/test';

const TARGET_FLOOR_PX = 44;

// Run this suite only under the mobile-safari project so the desktop
// project doesn't try to assert mobile-specific selectors. Pass
// `--project=mobile-safari` (or omit `--project` and Playwright will
// run every project; the desktop run will skip).
test.skip(({ browserName, project }, testInfo) => {
  // testInfo.project.name is set by Playwright; older versions exposed
  // it via the destructured `project` arg. Either is fine.
  const projectName = testInfo.project?.name || project?.name;
  return projectName !== 'mobile-safari';
}, 'mobile-only suite — skipped on desktop projects');

test.describe('P99 mobile pointer targets — anonymous landing', () => {
  test.beforeEach(async ({ page }) => {
    // Clear local state — analytics flag, anon counter, dismissed
    // banners — so the hero renders in its first-visit form.
    await page.addInitScript(() => {
      try { localStorage.clear(); } catch { /* sandboxed storage — accept */ }
      try { sessionStorage.clear(); } catch { /* sandboxed storage — accept */ }
    });
    await page.goto('/', { waitUntil: 'networkidle' });
  });

  test('every interactive element is at least 44×44 px', async ({ page }) => {
    // Wait for the hero to mount before measuring.
    await page.waitForSelector('[aria-label="Anonymous settlement generator"]', {
      timeout: 10_000,
    });

    // Collect every interactive element on the page, then measure each
    // one's bounding box and report violations.
    const violations = await page.evaluate((floor) => {
      const INTERACTIVE_SELECTOR = [
        'button',
        'a[href]',
        '[role="button"]',
        '[role="link"]',
        '[role="tab"]',
        'input:not([type="hidden"])',
        'select',
        'textarea',
      ].join(',');

      const els = Array.from(document.querySelectorAll(INTERACTIVE_SELECTOR));
      const out = [];
      for (const el of els) {
        // Skip elements opted out (dev panels, etc.).
        if (el.dataset?.ptAllowSmall === '1') continue;

        // Skip hidden / display:none elements.
        const cs = window.getComputedStyle(el);
        if (cs.display === 'none' || cs.visibility === 'hidden' || cs.opacity === '0') continue;

        const rect = el.getBoundingClientRect();
        // Skip zero-size (collapsed wrappers, off-screen).
        if (rect.width === 0 || rect.height === 0) continue;

        if (rect.width < floor || rect.height < floor) {
          out.push({
            tag: el.tagName.toLowerCase(),
            text: (el.innerText || el.textContent || '').trim().slice(0, 40),
            aria: el.getAttribute('aria-label') || null,
            width: Math.round(rect.width),
            height: Math.round(rect.height),
          });
        }
      }
      return out;
    }, TARGET_FLOOR_PX);

    // Report a readable diff if anything is too small.
    if (violations.length > 0) {
      const summary = violations
        .map((v, i) => `  ${i + 1}. <${v.tag}> ${v.width}×${v.height}px — "${v.aria || v.text}"`)
        .join('\n');

      console.error(`Mobile pointer-target violations (floor = ${TARGET_FLOOR_PX}px):\n${summary}`);
    }
    expect(violations, `Found ${violations.length} interactive element(s) below the ${TARGET_FLOOR_PX}px floor.`).toEqual([]);
  });
});
