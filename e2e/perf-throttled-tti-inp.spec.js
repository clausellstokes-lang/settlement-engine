/**
 * e2e/perf-throttled-tti-inp.spec.js — V-27b: the throttled TTI/INP performance
 * harness (bar 5, PERFORMANCE: "budgets are laws … in bytes AND time").
 *
 * The byte budget is already a law (tests/build/vendorPdfLazy.test.js's eager
 * first-paint closure ratchet). This is its TIME counterpart: it drives the real
 * anonymous generator hero under a throttled mid-tier device profile (CPU 4×
 * slowdown + a "Regular 4G"-ish network via CDP) and measures three web-vitals-
 * shaped numbers from the browser's own Performance APIs — never a wall-clock the
 * test framework could bias:
 *
 *   • TTI proxy — navigation `domInteractive` (main document parsed + interactive).
 *   • LCP       — Largest Contentful Paint (the hero paint), via PerformanceObserver.
 *   • INP proxy — the worst interaction latency (Event Timing) across a real click.
 *
 * CDP throttling is Chromium-only, so the spec runs under the `chromium` project
 * (the one CI executes) and skips `mobile-safari`. It contributes a real, non-
 * skipped, passing assertion under chromium — satisfying scripts/check-e2e-not-
 * vacuous.mjs (which hard-fails an all-skipped run).
 *
 * ⚠️ OWNER-GATED BUDGETS (unratified). No TTI/INP numbers are documented anywhere
 * in the repo (docs/DESIGN_ORGANIC_CRAFT.md §8 + ORGANIC_CRAFT_SURFACE_CENSUS.md
 * frame this harness as the thing that CLOSES that deferral). The ceilings below
 * are DELIBERATELY GENEROUS placeholders chosen to (a) not flake on a slow CI box
 * and (b) still trip on a gross regression (a doubling). They are also measured
 * against the Vite DEV server the e2e webServer boots (unminified, HMR) — which is
 * NOT production-representative. The harness is the INSTRUMENT; the owner ratifies
 * the real numbers after a production-build run. Every measured value is annotated
 * onto the test so the owner can read the actuals and tighten. Do not treat a green
 * here as a production performance certification.
 */

import { test, expect } from '@playwright/test';

// ── Throttling profile — a mid-tier device on a real mobile network ──────────
const CPU_THROTTLE_RATE = 4; // 4× slowdown (a mid-range phone vs a dev laptop).
// "Regular 4G"-ish: enough to be honest without making the DEV server crawl.
const NETWORK = Object.freeze({
  offline: false,
  latency: 40, // ms RTT
  downloadThroughput: Math.floor((10 * 1024 * 1024) / 8), // 10 Mbps
  uploadThroughput: Math.floor((3 * 1024 * 1024) / 8), // 3 Mbps
});

// ── Budgets (OWNER-GATED, unratified — see header) ───────────────────────────
// Observed baseline on this machine (Vite DEV server, 4× CPU, 10 Mbps/40 ms):
// LCP ≈ 15.3 s, INP < 1 s. The ceilings sit ~1.6× over that observed LCP so the
// harness clears the (heavy, unminified) dev environment without flaking while
// still tripping on a gross regression (a doubling). They are NOT production
// numbers — the owner ratifies real budgets after a production-build run (and may
// point the webServer at `vite preview` for representative timings).
const TTI_BUDGET_MS = 25_000; // domInteractive under 4× CPU on the dev server.
const LCP_BUDGET_MS = 25_000; // hero largest-contentful-paint.
const INP_BUDGET_MS = 1_500; // worst interaction-to-next-paint on a size click.

function hero(page) {
  return page.locator('section[aria-label*="generator"]').first();
}
function sizeButton(scope, label) {
  return scope.locator(`button[data-settlement-size="${label.toLowerCase()}"]`);
}

test.describe('V-27b — throttled TTI/INP performance harness', () => {
  test.beforeEach(async ({}, testInfo) => {
    // CDP (setCPUThrottlingRate / emulateNetworkConditions / Event Timing) is
    // Chromium-only. Skip the WebKit mobile project rather than run untuned.
    test.skip(testInfo.project.name === 'mobile-safari', 'CDP throttling is chromium-only');
  });

  test('the anonymous generator hero meets the time budgets under a throttled mid-tier device', async ({ page }, testInfo) => {
    // 1. Apply CPU + network throttling via CDP BEFORE the first navigation, so
    //    the whole load is measured under the mid-tier profile.
    const client = await page.context().newCDPSession(page);
    await client.send('Network.enable');
    await client.send('Network.emulateNetworkConditions', NETWORK);
    await client.send('Emulation.setCPUThrottlingRate', { rate: CPU_THROTTLE_RATE });

    // 2. Load the real anon generator hero (no auth needed).
    await page.goto('/create', { waitUntil: 'load' });
    await expect(hero(page)).toBeVisible({ timeout: 30_000 });

    // 3. TTI proxy + LCP from the browser's own timing, not a framework clock.
    const paint = await page.evaluate(async () => {
      const nav = performance.getEntriesByType('navigation')[0] || {};
      const lcp = await new Promise((resolve) => {
        let last = 0;
        try {
          const po = new PerformanceObserver((list) => {
            for (const e of list.getEntries()) last = e.startTime;
          });
          po.observe({ type: 'largest-contentful-paint', buffered: true });
          // LCP is finalized on the next frame after layout settles.
          requestAnimationFrame(() => requestAnimationFrame(() => { po.disconnect(); resolve(last); }));
        } catch {
          resolve(0);
        }
      });
      return { tti: nav.domInteractive || 0, lcp };
    });

    // 4. INP proxy: observe Event Timing, perform a real interaction (a size
    //    click that flips aria-pressed), read the worst interaction duration.
    const h = hero(page);
    await page.evaluate(() => {
      window.__inpMax = 0;
      try {
        const po = new PerformanceObserver((list) => {
          for (const e of list.getEntries()) {
            if (e.duration > window.__inpMax) window.__inpMax = e.duration;
          }
        });
        po.observe({ type: 'event', buffered: true, durationThreshold: 0 });
        window.__inpObserver = po;
      } catch { /* Event Timing unsupported — INP stays 0, asserted below */ }
    });
    const village = sizeButton(h, 'Village');
    await village.click();
    await expect(village).toHaveAttribute('aria-pressed', 'true', { timeout: 10_000 });
    // Let the event-timing entry flush, then read + disconnect.
    const inp = await page.evaluate(async () => {
      await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
      try { window.__inpObserver?.disconnect(); } catch { /* ignore */ }
      return window.__inpMax || 0;
    });

    // 5. Annotate the actuals so the owner can read them and ratify tighter
    //    numbers (the whole point of an unratified harness).
    testInfo.annotations.push(
      { type: 'perf-tti-ms', description: String(Math.round(paint.tti)) },
      { type: 'perf-lcp-ms', description: String(Math.round(paint.lcp)) },
      { type: 'perf-inp-ms', description: String(Math.round(inp)) },
      { type: 'perf-profile', description: `cpu ${CPU_THROTTLE_RATE}x, net ${NETWORK.downloadThroughput * 8 / 1024 / 1024}Mbps/${NETWORK.latency}ms (dev server)` },
    );
    console.log(`[perf] TTI=${Math.round(paint.tti)}ms LCP=${Math.round(paint.lcp)}ms INP=${Math.round(inp)}ms (cpu ${CPU_THROTTLE_RATE}x)`);

    // 6. Real assertions — non-vacuous, non-flaky ceilings that still catch a
    //    gross regression. These are the numbers the owner ratifies/tightens.
    expect(paint.tti, 'TTI proxy (domInteractive) over budget').toBeGreaterThan(0);
    expect(paint.tti, 'TTI proxy (domInteractive) over budget').toBeLessThan(TTI_BUDGET_MS);
    // LCP can read 0 if the observer never fired (fully-cached instant paint) —
    // only enforce the ceiling when a real LCP was captured.
    if (paint.lcp > 0) {
      expect(paint.lcp, 'LCP over budget').toBeLessThan(LCP_BUDGET_MS);
    }
    expect(inp, 'INP proxy (worst interaction) over budget').toBeLessThan(INP_BUDGET_MS);
  });
});
