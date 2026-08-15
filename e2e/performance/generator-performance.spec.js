/**
 * Production-build browser performance evidence.
 *
 * This is a synthetic regression gate, not field-performance certification.
 * It runs the minified `dist/` application under repeatable desktop and
 * lower-end mobile profiles and proves that every reported number came from a
 * supported, non-vacuous browser measurement. The launch objectives in
 * docs/ops/SERVICE_OBJECTIVES.md remain field p75 targets; CI cannot substitute
 * one runner, one browser, and one network shape for real-user telemetry.
 */

import { test, expect } from '@playwright/test';
import {
  buildPerformanceReceipt,
  writePerformanceReceipt,
} from '../../scripts/audit/browserPerformanceReceipt.mjs';

const DEVICE_PROFILE = Object.freeze({
  cpuSlowdown: 4,
  network: Object.freeze({
    offline: false,
    latency: 40,
    downloadThroughput: Math.floor((10 * 1024 * 1024) / 8),
    uploadThroughput: Math.floor((3 * 1024 * 1024) / 8),
  }),
});

/**
 * These ceilings detect gross production-build regressions while leaving
 * enough runner variance for shared CI hardware. Tightening them requires a
 * retained baseline from the same profile, not a fast developer machine.
 */
const SYNTHETIC_BUDGETS = Object.freeze({
  appReadyMs: 10_000,
  lcpMs: 5_000,
  interactionToPaintMs: 500,
  cls: 0.1,
});

function generatorHero(page) {
  return page.locator('section[aria-label*="generator"]').first();
}

function settlementSizeButton(scope, label) {
  return scope.locator(`button[data-settlement-size="${label.toLowerCase()}"]`);
}

/**
 * Install observers before navigation. Each observer writes into one small,
 * content-free browser state object so the test never serializes page text or
 * user data into the evidence receipt.
 */
async function installBrowserObservers(page) {
  await page.addInitScript(() => {
    const supportedTypes = new Set(globalThis.PerformanceObserver?.supportedEntryTypes || []);
    const state = {
      supported: {
        largestContentfulPaint: supportedTypes.has('largest-contentful-paint'),
        layoutShift: supportedTypes.has('layout-shift'),
        eventTiming: supportedTypes.has('event'),
      },
      largestContentfulPaintMs: 0,
      cumulativeLayoutShift: 0,
      eventDurationsMs: [],
      interactionToPaintMs: [],
      appReadyMs: 0,
    };

    globalThis.__settlementForgePerformance = state;

    if (state.supported.largestContentfulPaint) {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          state.largestContentfulPaintMs = Math.max(
            state.largestContentfulPaintMs,
            entry.startTime,
          );
        }
      });
      observer.observe({ type: 'largest-contentful-paint', buffered: true });
    }

    if (state.supported.layoutShift) {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!entry.hadRecentInput) {
            state.cumulativeLayoutShift += entry.value;
          }
        }
      });
      observer.observe({ type: 'layout-shift', buffered: true });
    }

    if (state.supported.eventTiming) {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.interactionId > 0) {
            state.eventDurationsMs.push(entry.duration);
          }
        }
      });
      observer.observe({ type: 'event', buffered: true, durationThreshold: 16 });
    }

    /*
     * Event Timing intentionally omits interactions shorter than its reporting
     * threshold. Capture a browser-clock event-to-next-paint sample as a
     * non-vacuous fallback; it is reported as a proxy and never mislabeled as
     * field INP.
     */
    document.addEventListener(
      'pointerdown',
      (event) => {
        const eventStart = Number.isFinite(event.timeStamp)
          ? event.timeStamp
          : performance.now();
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            state.interactionToPaintMs.push(Math.max(0, performance.now() - eventStart));
          });
        });
      },
      { capture: true, passive: true },
    );
  });
}

async function readBrowserMeasurements(page) {
  return page.evaluate(async () => {
    await new Promise((resolve) => {
      requestAnimationFrame(() => requestAnimationFrame(resolve));
    });

    const navigation = performance.getEntriesByType('navigation')[0];
    const state = globalThis.__settlementForgePerformance;
    const eventTimingMs = Math.max(0, ...(state?.eventDurationsMs || []));
    const interactionToPaintMs = Math.max(0, ...(state?.interactionToPaintMs || []));

    return {
      supported: state?.supported || {},
      navigationInteractiveMs: navigation?.domInteractive || 0,
      appReadyMs: state?.appReadyMs || 0,
      lcpMs: state?.largestContentfulPaintMs || 0,
      cls: state?.cumulativeLayoutShift || 0,
      eventTimingMs,
      eventTimingSampleCount: state?.eventDurationsMs?.length || 0,
      interactionToPaintMs,
      interactionSampleCount: state?.interactionToPaintMs?.length || 0,
      interactionLatencyMs: eventTimingMs || interactionToPaintMs,
    };
  });
}

test.describe('production-build browser performance', () => {
  test('the anonymous generator stays within the synthetic regression budgets', async ({
    page,
  }, testInfo) => {
    const client = await page.context().newCDPSession(page);
    await client.send('Network.enable');
    await client.send('Network.emulateNetworkConditions', DEVICE_PROFILE.network);
    await client.send('Emulation.setCPUThrottlingRate', {
      rate: DEVICE_PROFILE.cpuSlowdown,
    });
    await installBrowserObservers(page);

    await page.goto('/create', { waitUntil: 'load' });
    const hero = generatorHero(page);
    await expect(hero).toBeVisible({ timeout: SYNTHETIC_BUDGETS.appReadyMs });
    await page.evaluate(() => {
      globalThis.__settlementForgePerformance.appReadyMs = performance.now();
    });

    /*
     * Exercise several real controls. Multiple samples avoid treating one
     * sub-threshold Event Timing entry as proof that interaction measurement
     * worked.
     */
    for (const size of ['Hamlet', 'Village', 'Town']) {
      const button = settlementSizeButton(hero, size);
      await button.click();
      await expect(button).toHaveAttribute('aria-pressed', 'true');
    }

    const measurements = await readBrowserMeasurements(page);
    const moduleScripts = await page.locator('script[type="module"][src]').evaluateAll(
      (nodes) => nodes.map((node) => new URL(node.src).pathname),
    );
    const productionAssetsLoaded =
      moduleScripts.length > 0 &&
      moduleScripts.every((source) => source.startsWith('/assets/'));
    const browserProfile = {
      ...DEVICE_PROFILE,
      browserProject: testInfo.project.name,
      viewport: testInfo.project.use.viewport || null,
      isMobile: testInfo.project.use.isMobile === true,
      hasTouch: testInfo.project.use.hasTouch === true,
    };

    const receipt = await buildPerformanceReceipt({
      measurements,
      budgets: SYNTHETIC_BUDGETS,
      profile: browserProfile,
      productionAssetsLoaded,
      moduleScripts,
    });
    const receiptPath = await writePerformanceReceipt(
      receipt,
      undefined,
      testInfo.project.name,
    );

    testInfo.annotations.push(
      { type: 'performance-receipt', description: receiptPath },
      { type: 'app-ready-ms', description: String(Math.round(measurements.appReadyMs)) },
      { type: 'lcp-ms', description: String(Math.round(measurements.lcpMs)) },
      {
        type: 'interaction-to-paint-ms',
        description: String(Math.round(measurements.interactionLatencyMs)),
      },
      { type: 'cls', description: measurements.cls.toFixed(4) },
    );

    console.log(
      `[performance:${testInfo.project.name}] ` +
        `ready=${Math.round(measurements.appReadyMs)}ms ` +
        `LCP=${Math.round(measurements.lcpMs)}ms ` +
        `interaction=${Math.round(measurements.interactionLatencyMs)}ms ` +
        `CLS=${measurements.cls.toFixed(4)} receipt=${receiptPath}`,
    );

    expect(productionAssetsLoaded, 'the performance gate must run the built asset graph').toBe(true);
    expect(measurements.supported.largestContentfulPaint, 'LCP API unsupported').toBe(true);
    expect(measurements.supported.layoutShift, 'Layout Shift API unsupported').toBe(true);
    expect(measurements.supported.eventTiming, 'Event Timing API unsupported').toBe(true);
    expect(measurements.navigationInteractiveMs, 'navigation timing was not captured').toBeGreaterThan(0);
    expect(measurements.lcpMs, 'LCP observer captured no entry').toBeGreaterThan(0);
    expect(measurements.interactionSampleCount, 'no real interaction sample was captured').toBeGreaterThanOrEqual(3);
    expect(measurements.interactionLatencyMs, 'interaction measurement was vacuous').toBeGreaterThan(0);

    expect(measurements.appReadyMs, 'generator readiness exceeded its synthetic budget').toBeLessThanOrEqual(
      SYNTHETIC_BUDGETS.appReadyMs,
    );
    expect(measurements.lcpMs, 'LCP exceeded its synthetic budget').toBeLessThanOrEqual(
      SYNTHETIC_BUDGETS.lcpMs,
    );
    expect(
      measurements.interactionLatencyMs,
      'interaction-to-next-paint exceeded its synthetic budget',
    ).toBeLessThanOrEqual(SYNTHETIC_BUDGETS.interactionToPaintMs);
    expect(measurements.cls, 'CLS exceeded its synthetic budget').toBeLessThanOrEqual(
      SYNTHETIC_BUDGETS.cls,
    );
    expect(
      receipt.passed,
      'the retained receipt must agree that the supported measurement passed',
    ).toBe(true);
  });
});
