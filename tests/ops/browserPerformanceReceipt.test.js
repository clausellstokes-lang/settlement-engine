import { mkdtemp, mkdir, rm, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import {
  buildPerformanceReceipt,
  evaluateMeasurementValidity,
  evaluatePerformanceBudgets,
  fingerprintBuild,
  performanceReceiptPath,
} from '../../scripts/audit/browserPerformanceReceipt.mjs';

const temporaryDirectories = [];

async function makeBuildFixture() {
  const directory = await mkdtemp(path.join(os.tmpdir(), 'sf-performance-build-'));
  temporaryDirectories.push(directory);
  await mkdir(path.join(directory, 'assets'));
  await writeFile(path.join(directory, 'index.html'), '<main>SettlementForge</main>');
  await writeFile(path.join(directory, 'assets', 'application.js'), 'export const ready = true;');
  return directory;
}

afterEach(async () => {
  await Promise.all(
    temporaryDirectories.splice(0).map((directory) =>
      rm(directory, { recursive: true, force: true }),
    ),
  );
});

describe('browser performance receipts', () => {
  it('fingerprints paths, bytes, and contents in stable order', async () => {
    const directory = await makeBuildFixture();

    const first = await fingerprintBuild(directory);
    const second = await fingerprintBuild(directory);

    expect(first.sha256).toBe(second.sha256);
    expect(first.files.map((file) => file.path)).toEqual([
      'assets/application.js',
      'index.html',
    ]);
    expect(first.files.every((file) => file.bytes > 0 && file.sha256.length === 64)).toBe(true);
  });

  it('changes the build identity when an artifact changes', async () => {
    const directory = await makeBuildFixture();
    const before = await fingerprintBuild(directory);

    await writeFile(path.join(directory, 'assets', 'application.js'), 'export const ready = false;');
    const after = await fingerprintBuild(directory);

    expect(after.sha256).not.toBe(before.sha256);
  });

  it('requires positive, within-budget timings without rejecting valid zero CLS', () => {
    const budgets = {
      appReadyMs: 10_000,
      lcpMs: 5_000,
      interactionToPaintMs: 500,
      cls: 0.1,
    };

    expect(
      evaluatePerformanceBudgets(
        {
          appReadyMs: 1_250,
          lcpMs: 900,
          interactionLatencyMs: 48,
          cls: 0,
        },
        budgets,
      ),
    ).toEqual({
      appReady: true,
      largestContentfulPaint: true,
      interactionToPaint: true,
      cumulativeLayoutShift: true,
    });

    expect(
      evaluatePerformanceBudgets(
        {
          appReadyMs: 0,
          lcpMs: 0,
          interactionLatencyMs: 0,
          cls: 0.11,
        },
        budgets,
      ),
    ).toEqual({
      appReady: false,
      largestContentfulPaint: false,
      interactionToPaint: false,
      cumulativeLayoutShift: false,
    });
  });

  it('rejects unsupported or vacuous measurements before they can earn a green receipt', async () => {
    const directory = await makeBuildFixture();
    const measurements = {
      supported: {
        largestContentfulPaint: false,
        layoutShift: false,
        eventTiming: false,
      },
      navigationInteractiveMs: 0,
      appReadyMs: 1_250,
      lcpMs: 900,
      cls: 0,
      interactionSampleCount: 0,
      interactionLatencyMs: 48,
    };
    expect(evaluateMeasurementValidity(measurements)).toEqual({
      largestContentfulPaintSupported: false,
      layoutShiftSupported: false,
      eventTimingSupported: false,
      navigationTimingCaptured: false,
      largestContentfulPaintCaptured: true,
      interactionSamplesCaptured: false,
      interactionLatencyCaptured: true,
    });

    const receipt = await buildPerformanceReceipt({
      measurements,
      budgets: {
        appReadyMs: 10_000,
        lcpMs: 5_000,
        interactionToPaintMs: 500,
        cls: 0.1,
      },
      profile: { browserProject: 'unsupported-fixture' },
      productionAssetsLoaded: true,
      moduleScripts: ['/assets/application.js'],
      buildDirectory: directory,
    });

    expect(Object.values(receipt.budgetResults).every(Boolean)).toBe(true);
    expect(receipt.passed).toBe(false);
  });

  it('keeps each browser profile in a separate retained receipt', () => {
    expect(
      performanceReceiptPath(
        '/evidence/browser-synthetic.json',
        'performance-mobile-chromium',
      ),
    ).toBe('/evidence/browser-synthetic.performance-mobile-chromium.json');
    expect(
      performanceReceiptPath('/evidence/browser-synthetic.json', null),
    ).toBe('/evidence/browser-synthetic.json');
  });
});
