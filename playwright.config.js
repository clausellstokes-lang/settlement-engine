/**
 * Playwright configuration — Tier 3.7 end-to-end flows.
 *
 * Two flows live under e2e/:
 *   - flow-a-generate-save-export.spec.js  (anonymous user path)
 *   - flow-b-auth-credits-ai.spec.js       (auth-gated paths)
 *
 * Local run:   `npm run test:e2e`
 * UI mode:     `npm run test:e2e:ui`
 * Headed run:  `npm run test:e2e:headed`
 *
 * Playwright starts the Vite dev server automatically (webServer
 * config) so the suite is self-hosted. Re-uses an already-running
 * dev server during interactive iteration.
 */

import { defineConfig, devices } from '@playwright/test';

const PORT = 5173;
const BASE_URL = process.env.E2E_BASE_URL || `http://localhost:${PORT}`;

// Default: the Vite DEV server, which is what the specs (and the live
// money-path suite's window.__store seam) are written against. The dev
// server is NOT the production bundle — chunking, minification, and lazy
// boundaries differ — so prod-bundle regressions are invisible to the
// default run. E2E_PROD_PREVIEW=1 opts into building + serving the real
// bundle via `vite preview` instead (same port, same specs; the live
// money-path suite skips there since __store is DEV-only).
const PROD_PREVIEW = !!process.env.E2E_PROD_PREVIEW;

export default defineConfig({
  testDir: './e2e',

  // Each spec gets up to 30s; per-test action default is 10s.
  timeout: 30_000,
  expect: { timeout: 5_000 },

  // Run files in parallel; tests within a file serial (state isolation).
  fullyParallel: true,

  // Fail the build on test.only left in committed code.
  forbidOnly: !!process.env.CI,

  // CI retries once to ride out flaky network; local devs see issues immediately.
  retries: process.env.CI ? 1 : 0,

  // CI uses 1 worker to keep server logs readable; local maxes out cores.
  workers: process.env.CI ? 1 : undefined,

  reporter: process.env.CI ? [['github'], ['html', { open: 'never' }]] : 'list',

  use: {
    baseURL: BASE_URL,
    // Capture artifacts only on failure — keeps green runs lean.
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    // Reasonable defaults for our SPA.
    actionTimeout: 10_000,
    navigationTimeout: 15_000,
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      // Mobile project — used by e2e/mobile-pointer-targets.spec.js to
      // catch interactive elements smaller than the 44×44 touch-target
      // floor (Apple HIG / Material design guidance). Pinned to a
      // common iPhone profile so the layout matches what real users
      // see; if specs need a different viewport they should override
      // via `test.use({ viewport: ... })`.
      name: 'mobile-safari',
      use: { ...devices['iPhone 13'] },
    },
  ],

  // Boot the Vite dev server for the spec lifetime. If a dev server
  // is already running on PORT, reuse it (interactive dev loop).
  // E2E_PROD_PREVIEW=1 swaps in a production build served by `vite
  // preview` (never reused — a stale dev server on the port would
  // silently defeat the point of the prod run).
  webServer: {
    command: PROD_PREVIEW
      ? `npx vite build --mode e2e && npx vite preview --port ${PORT} --strictPort`
      : 'npm run dev -- --mode e2e',
    url: BASE_URL,
    timeout: PROD_PREVIEW ? 240_000 : 60_000,
    reuseExistingServer: !process.env.CI && !PROD_PREVIEW,
    stdout: 'ignore',
    stderr: 'pipe',
  },
});
