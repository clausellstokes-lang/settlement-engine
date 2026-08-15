/**
 * Playwright configuration for production-build performance evidence.
 *
 * `npm run test:e2e:performance` builds the e2e/local-data variant first, then
 * this config serves the minified `dist/` directory. Keeping this separate from
 * the functional E2E config prevents a development server measurement from
 * being mistaken for release evidence.
 */

import { defineConfig, devices } from '@playwright/test';

const PORT = 4175;
const BASE_URL = `http://127.0.0.1:${PORT}`;
if (process.env.PERFORMANCE_BASE_URL?.trim()) {
  throw new Error(
    'PERFORMANCE_BASE_URL is unsupported for build-bound performance evidence. '
      + 'The gate must measure the local dist/ tree through its owned preview server.',
  );
}

export default defineConfig({
  testDir: './e2e/performance',
  timeout: 90_000,
  expect: { timeout: 10_000 },
  fullyParallel: false,
  forbidOnly: Boolean(process.env.CI),
  retries: 0,
  workers: 1,
  reporter: process.env.CI ? [['github'], ['html', { open: 'never' }]] : 'list',
  use: {
    baseURL: BASE_URL,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 10_000,
    navigationTimeout: 30_000,
  },
  projects: [
    {
      name: 'performance-chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'performance-mobile-chromium',
      use: { ...devices['Pixel 5'] },
    },
  ],
  webServer: {
    command: `npm run preview -- --host 127.0.0.1 --port ${PORT} --strictPort`,
    url: BASE_URL,
    timeout: 60_000,
    // Evidence must describe the dist/ tree built by this invocation. Reusing
    // a process already bound to the port could measure stale or unrelated
    // assets while the receipt fingerprints the current local dist/ folder.
    // strictPort then fails loudly instead of producing misattributed proof.
    reuseExistingServer: false,
    stdout: 'ignore',
    stderr: 'pipe',
  },
});
