/**
 * Playwright configuration — Tier 3.7 end-to-end flows.
 *
 * Flows under e2e/:
 *   - flow-a-generate-save-export.spec.js  (anonymous user path)
 *   - flow-b-auth-credits-ai.spec.js       (auth-gated paths)
 *   - flow-c-save-journey.spec.js          (signed-in positive save, LOCAL mode)
 *   - flow-d-export.spec.js                (client-side PDF export, LOCAL mode)
 *   - flow-e-checkout-reconcile.spec.js    (post-Stripe reconciliation, CONFIGURED mode)
 *   - flow-f-single-dossier.spec.js        (single-dossier recovery, CONFIGURED mode)
 *   - regional-causality.spec.js           (campaign UI, LOCAL mode)
 *
 * TWO dev servers boot for the suite:
 *   - :5173 — the default LOCAL-data server (VITE_E2E_LOCAL_DATA=true from
 *     .env.e2e). Here `isConfigured` is false, so auth uses the
 *     `settlement_mock_auth` localStorage seam and saves round-trip through
 *     localStorage. Every spec EXCEPT flow-e/flow-f uses this (the default
 *     baseURL).
 *   - :5174 — a Supabase-CONFIGURED server. flow-e/flow-f must exercise the
 *     payment reconciliation / verify edge functions, and those hard-guard on
 *     `isConfigured` (src/lib/stripe.js: `if (!isConfigured) throw`). The only
 *     way to reach that code is a client that believes Supabase is configured,
 *     so this server is booted with dummy VITE_SUPABASE_* vars and
 *     VITE_E2E_LOCAL_DATA disabled. flow-e/flow-f stub every Supabase REST /
 *     auth / function route with page.route (no real network). They opt in via
 *     `test.use({ baseURL: CONFIGURED_URL })`. Vite gives process.env VITE_*
 *     precedence over .env.e2e, so the webServer `env` below wins.
 *
 * Local run:   `npm run test:e2e`
 * UI mode:     `npm run test:e2e:ui`
 * Headed run:  `npm run test:e2e:headed`
 */

import { defineConfig, devices } from '@playwright/test';

const PORT = 5173;
const BASE_URL = process.env.E2E_BASE_URL || `http://localhost:${PORT}`;

// Second server for the payment flows — Supabase-configured, fully route-stubbed.
const CONFIGURED_PORT = 5174;
export const CONFIGURED_URL = `http://localhost:${CONFIGURED_PORT}`;

export default defineConfig({
  testDir: './e2e',
  // Performance evidence has its own production-build server and configuration.
  testIgnore: '**/performance/**',

  // Each spec gets up to 30s; per-test action default is 10s.
  timeout: 30_000,
  expect: { timeout: 5_000 },

  // Parallelise at the TEST level, not just the file level. (The comment that
  // stood here claimed "tests within a file serial"; that describes
  // fullyParallel:false and is not what this flag does. Two specs are seeded
  // per-test via addInitScript and a fresh context, so test-level parallelism
  // is safe for state; what it is NOT safe for is the shared dev server, which
  // is why `workers` is capped below.)
  fullyParallel: true,

  // Fail the build on test.only left in committed code.
  forbidOnly: !!process.env.CI,

  // CI retries once to ride out flaky network; local devs see issues immediately.
  retries: process.env.CI ? 1 : 0,

  // CI uses 1 worker to keep server logs readable. LOCAL IS CAPPED AT 2, NOT
  // LEFT TO PLAYWRIGHT'S DEFAULT (half the logical cores). The bottleneck this
  // suite contends for is not CPU, it is the ONE Vite dev server per port: a
  // signed-in route costs ~780 on-demand module transforms per navigation, and
  // N browsers cold-loading that graph at once serialise behind it. Measured on
  // an 8-core box at a5876c0ea: the default (4 workers) reds flow-c and
  // regional-causality deterministically and ALSO, under a different schedule,
  // flow-a and flow-d, because whichever heavy journey loses the scheduling
  // draw blows `timeout` / `expect.timeout` above. 2 workers ran the whole
  // chromium suite green three times for the SAME 2.1 min wall clock, so the
  // extra parallelism was buying failures, not speed. CI (1 worker) never saw
  // this, which is why the suite read green there while the local run reds.
  workers: process.env.CI ? 1 : 2,

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

  // Boot both Vite dev servers for the spec lifetime. If a dev server is
  // already running on a port, reuse it (interactive dev loop).
  webServer: [
    {
      // Default LOCAL-data server (VITE_E2E_LOCAL_DATA=true via .env.e2e).
      command: 'npm run dev -- --mode e2e',
      url: BASE_URL,
      timeout: 60_000,
      reuseExistingServer: !process.env.CI,
      stdout: 'ignore',
      stderr: 'pipe',
    },
    {
      // Supabase-CONFIGURED server for flow-e/flow-f. Dummy credentials + no
      // local-data override → `isConfigured` is true so the payment/verify code
      // paths run; flow-e/flow-f stub every outbound Supabase route. Vite gives
      // these process.env VITE_* vars precedence over .env.e2e's local-data flag.
      command: `npm run dev -- --mode e2e --port ${CONFIGURED_PORT} --strictPort`,
      url: CONFIGURED_URL,
      timeout: 60_000,
      reuseExistingServer: !process.env.CI,
      stdout: 'ignore',
      stderr: 'pipe',
      env: {
        VITE_SUPABASE_URL: 'https://mock.supabase.co',
        VITE_SUPABASE_ANON_KEY: 'mock-anon-key-for-e2e',
        VITE_E2E_LOCAL_DATA: 'false',
      },
    },
  ],
});
