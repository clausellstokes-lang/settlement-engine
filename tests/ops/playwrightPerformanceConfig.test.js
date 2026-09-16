/**
 * Performance evidence server-ownership contract.
 *
 * A browser receipt fingerprints the current dist/ directory. The browser must
 * therefore load that same build from the preview process owned by this run.
 * Reusing an arbitrary process already listening on the evidence port could
 * attach fresh local fingerprints to stale or unrelated served assets.
 */

import { afterEach, describe, expect, it, vi } from 'vitest';

afterEach(() => {
  vi.unstubAllEnvs();
  vi.resetModules();
});

describe('Playwright performance evidence configuration', () => {
  it('owns a fresh strict-port preview server for local evidence runs', async () => {
    vi.stubEnv('PERFORMANCE_BASE_URL', '');
    vi.resetModules();

    const { default: config } = await import('../../playwright.perf.config.js');

    expect(config.webServer).toMatchObject({
      url: 'http://127.0.0.1:4175',
      reuseExistingServer: false,
    });
    expect(config.webServer.command).toContain('--strictPort');
  });

  it('rejects an explicit external target instead of misattributing local build evidence', async () => {
    vi.stubEnv('PERFORMANCE_BASE_URL', 'https://performance.example.test');
    vi.resetModules();

    await expect(import('../../playwright.perf.config.js')).rejects.toThrow(
      /PERFORMANCE_BASE_URL is unsupported for build-bound performance evidence/,
    );
  });
});
