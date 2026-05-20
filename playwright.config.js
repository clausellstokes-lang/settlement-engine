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
  ],

  // Boot the Vite dev server for the spec lifetime. If a dev server
  // is already running on PORT, reuse it (interactive dev loop).
  webServer: {
    command: 'npm run dev',
    url: BASE_URL,
    timeout: 60_000,
    reuseExistingServer: !process.env.CI,
    stdout: 'ignore',
    stderr: 'pipe',
  },
});
