/**
 * Build-bound receipt support for the synthetic browser-performance gate.
 *
 * The receipt deliberately fingerprints the built artifact rather than trusting
 * a branch name or an environment-provided commit SHA. That keeps local dirty
 * builds attributable and prevents a green result from being attached to a
 * different `dist/` directory later.
 */

import { createHash } from 'node:crypto';
import { mkdir, readdir, readFile, rename, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';

const RECEIPT_SCHEMA = 'settlementforge.browser-performance-receipt.v1';

function sha256(value) {
  return createHash('sha256').update(value).digest('hex');
}

/**
 * Walk a build directory in stable path order.
 *
 * @param {string} directory
 * @param {string} [relativeDirectory]
 * @returns {Promise<string[]>}
 */
async function listFiles(directory, relativeDirectory = '') {
  const absoluteDirectory = path.join(directory, relativeDirectory);
  const entries = await readdir(absoluteDirectory, { withFileTypes: true });
  const files = [];

  for (const entry of entries.sort((a, b) => a.name.localeCompare(b.name))) {
    const relativePath = path.join(relativeDirectory, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await listFiles(directory, relativePath)));
    } else if (entry.isFile()) {
      files.push(relativePath);
    }
  }

  return files;
}

/**
 * Fingerprint every file in the production build using path, byte count, and
 * content hash. The inventory is retained in the receipt so an operator can
 * explain a digest without access to this process.
 */
export async function fingerprintBuild(directory = path.resolve('dist')) {
  const files = await listFiles(directory);
  const inventory = [];

  for (const relativePath of files) {
    const absolutePath = path.join(directory, relativePath);
    const [contents, metadata] = await Promise.all([
      readFile(absolutePath),
      stat(absolutePath),
    ]);
    inventory.push({
      path: relativePath.split(path.sep).join('/'),
      bytes: metadata.size,
      sha256: sha256(contents),
    });
  }

  return {
    directory: path.basename(directory),
    files: inventory,
    sha256: sha256(JSON.stringify(inventory)),
  };
}

/**
 * Evaluate every synthetic threshold independently so the receipt explains a
 * failure instead of collapsing it into one boolean.
 *
 * @param {Record<string, number>} measurements
 * @param {Record<string, number>} budgets
 */
export function evaluatePerformanceBudgets(measurements, budgets) {
  return {
    appReady: measurements.appReadyMs > 0 && measurements.appReadyMs <= budgets.appReadyMs,
    largestContentfulPaint:
      measurements.lcpMs > 0 && measurements.lcpMs <= budgets.lcpMs,
    interactionToPaint:
      measurements.interactionLatencyMs > 0 &&
      measurements.interactionLatencyMs <= budgets.interactionToPaintMs,
    cumulativeLayoutShift:
      measurements.cls >= 0 && measurements.cls <= budgets.cls,
  };
}

/**
 * Prove that a browser result is an actual, supported measurement before its
 * timings are compared with budgets. Positive numbers alone are insufficient:
 * a fallback or hand-built payload must not earn a green receipt when the
 * browser APIs, navigation timing, or interaction samples were absent.
 *
 * Keep this in lockstep with the non-vacuity assertions in the Playwright spec.
 *
 * @param {{
 *   supported?: {
 *     largestContentfulPaint?: boolean,
 *     layoutShift?: boolean,
 *     eventTiming?: boolean,
 *   },
 *   navigationInteractiveMs?: number,
 *   lcpMs?: number,
 *   interactionSampleCount?: number,
 *   interactionLatencyMs?: number,
 * }} measurements
 */
export function evaluateMeasurementValidity(measurements) {
  return {
    largestContentfulPaintSupported:
      measurements.supported?.largestContentfulPaint === true,
    layoutShiftSupported: measurements.supported?.layoutShift === true,
    eventTimingSupported: measurements.supported?.eventTiming === true,
    navigationTimingCaptured: Number(measurements.navigationInteractiveMs) > 0,
    largestContentfulPaintCaptured: Number(measurements.lcpMs) > 0,
    interactionSamplesCaptured: Number(measurements.interactionSampleCount) >= 3,
    interactionLatencyCaptured: Number(measurements.interactionLatencyMs) > 0,
  };
}

/**
 * @param {{
 *   measurements: Record<string, number>,
 *   budgets: Record<string, number>,
 *   profile: Record<string, unknown>,
 *   productionAssetsLoaded: boolean,
 *   moduleScripts: string[],
 *   buildDirectory?: string,
 * }} input
 */
export async function buildPerformanceReceipt({
  measurements,
  budgets,
  profile,
  productionAssetsLoaded,
  moduleScripts,
  buildDirectory,
}) {
  const build = await fingerprintBuild(buildDirectory);
  const budgetResults = evaluatePerformanceBudgets(measurements, budgets);
  const measurementValidity = evaluateMeasurementValidity(measurements);
  const evidence = {
    schema: RECEIPT_SCHEMA,
    createdAt: new Date().toISOString(),
    claim: 'synthetic-production-build-regression',
    claimBoundary:
      'This receipt is not field p75 performance or production certification.',
    build,
    profile,
    budgets,
    measurements,
    productionAssetsLoaded,
    moduleScripts,
    measurementValidity,
    budgetResults,
    passed:
      productionAssetsLoaded &&
      Object.values(measurementValidity).every(Boolean) &&
      Object.values(budgetResults).every(Boolean),
  };

  return {
    ...evidence,
    receiptSha256: sha256(JSON.stringify(evidence)),
  };
}

/**
 * Give every browser/device profile its own retained receipt. Playwright runs
 * the performance projects serially, but letting them share one filename would
 * still make the last project erase the first project's evidence.
 */
export function performanceReceiptPath(basePath, profileName) {
  const normalizedProfile = String(profileName || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9.-]+/g, '-')
    .replace(/^-+|-+$/g, '');
  if (!normalizedProfile) return basePath;

  const extension = path.extname(basePath);
  const stem = extension ? basePath.slice(0, -extension.length) : basePath;
  return `${stem}.${normalizedProfile}${extension || '.json'}`;
}

/**
 * Write atomically so a killed Playwright process cannot leave a plausible,
 * half-written receipt in the retained evidence directory.
 */
export async function writePerformanceReceipt(
  receipt,
  outputPath = process.env.SF_PERFORMANCE_RECEIPT
    || path.resolve('artifacts/performance/browser-synthetic.json'),
  profileName = null,
) {
  const resolvedOutputPath = performanceReceiptPath(outputPath, profileName);
  await mkdir(path.dirname(resolvedOutputPath), { recursive: true });
  const temporaryPath = `${resolvedOutputPath}.${process.pid}.tmp`;
  await writeFile(temporaryPath, `${JSON.stringify(receipt, null, 2)}\n`, {
    encoding: 'utf8',
    mode: 0o600,
  });
  await rename(temporaryPath, resolvedOutputPath);
  return resolvedOutputPath;
}
