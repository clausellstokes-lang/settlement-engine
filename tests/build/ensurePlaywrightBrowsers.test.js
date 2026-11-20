/**
 * tests/build/ensurePlaywrightBrowsers.test.js — the browser jobs' install probe (CI-FIT point 75).
 *
 * scripts/ensure-playwright-browsers.mjs LAUNCHES each browser a CI job needs and installs only
 * when one does not launch. These arms drive every path with an injected Playwright and an
 * injected install, so they need no browser and no network: served as-is, the fallback that
 * cures, the fallback that does not, the install that throws, and the refused arguments.
 */
import { describe, expect, it } from 'vitest';
import { ensure, parseBrowsers, probe } from '../../scripts/ensure-playwright-browsers.mjs';
import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';

/** A fake Playwright whose browsers launch only while `alive()` says so for that name. */
function fakePlaywright(alive) {
  const launched = [];
  const make = (name) => ({
    async launch() {
      if (!alive(name)) throw new Error(`browserType.launch: Executable doesn't exist at /ms-playwright/${name}\nline two`);
      launched.push(name);
      return {
        async newPage() {
          let html = '';
          return {
            async setContent(value) { html = value; },
            async textContent() { return /<p id="probe">(.*)<\/p>/.exec(html)?.[1] ?? null; },
          };
        },
        async close() {},
      };
    },
  });
  return { launched, chromium: make('chromium'), webkit: make('webkit'), firefox: make('firefox') };
}

function harness({ aliveBefore, aliveAfter = aliveBefore, installThrows = false }) {
  const lines = [];
  const installs = [];
  let installed = false;
  const playwright = fakePlaywright((name) => (installed ? aliveAfter(name) : aliveBefore(name)));
  const deps = {
    playwright,
    log: (line) => lines.push(line),
    error: (line) => lines.push(line),
    install: (names) => {
      installs.push(names.join(' '));
      if (installThrows) throw new Error('apt-get exited 100\nmore');
      installed = true;
    },
  };
  return { deps, lines, installs, playwright };
}

describe('ensure-playwright-browsers: launch first, install only on a failed launch', () => {
  it('every browser launches as served: nothing is installed, and it says so', async () => {
    const h = harness({ aliveBefore: () => true });
    expect(await ensure(['chromium', 'webkit'], h.deps)).toBe(0);
    expect(h.installs).toEqual([]);
    expect(h.playwright.launched).toEqual(['chromium', 'webkit']);
    expect(h.lines.join('\n')).toMatch(/::notice title=Playwright browsers::chromium, webkit launched as served/);
  });

  it('one browser does not launch: the fallback installs ALL named browsers with their system packages, then both launch', async () => {
    const h = harness({ aliveBefore: (name) => name !== 'webkit', aliveAfter: () => true });
    expect(await ensure(['chromium', 'webkit'], h.deps)).toBe(0);
    expect(h.installs).toEqual(['chromium webkit']);
    const out = h.lines.join('\n');
    expect(out).toMatch(/::warning title=Playwright browsers::webkit did not launch as served/);
    // The browser that launched is not reported as failed, anchored by its sibling's own warning on the same
    // code path (the 'did not launch as served' line), so the absence cannot pass on an empty log.
    expectAbsentWithAnchor(out, 'chromium did not launch', 'webkit did not launch as served', 'the fallback names only the browser that failed');
    expect(out).toMatch(/::notice title=Playwright browsers::chromium, webkit launched after the fallback install/);
  });

  it('the fallback does not cure it: the step FAILS, naming the browser (never a job that runs on without one)', async () => {
    const h = harness({ aliveBefore: () => false, aliveAfter: (name) => name === 'chromium' });
    expect(await ensure(['chromium', 'webkit'], h.deps)).toBe(1);
    expect(h.installs).toEqual(['chromium webkit']);
    expect(h.lines.join('\n')).toMatch(/::error title=Playwright browsers::webkit still does not launch after the fallback install/);
  });

  it('the fallback install itself throws: the step FAILS and does not probe again', async () => {
    const h = harness({ aliveBefore: () => false, installThrows: true });
    expect(await ensure(['chromium'], h.deps)).toBe(1);
    expect(h.installs).toEqual(['chromium']);
    expect(h.lines.join('\n')).toMatch(/::error title=Playwright browsers::the fallback install failed: apt-get exited 100$/m);
  });

  it('a page that renders the wrong text is a failed launch, not a pass', async () => {
    const playwright = fakePlaywright(() => true);
    playwright.chromium = {
      async launch() {
        return { async newPage() { return { async setContent() {}, async textContent() { return ''; } }; }, async close() {} };
      },
    };
    const failures = await probe(['chromium'], playwright);
    expect(failures).toEqual([{ name: 'chromium', message: 'the page rendered "", not "probe"' }]);
  });

  it('a failure message is kept to its first lines, joined', async () => {
    const failures = await probe(['webkit'], fakePlaywright(() => false));
    expect(failures).toEqual([{ name: 'webkit', message: "browserType.launch: Executable doesn't exist at /ms-playwright/webkit | line two" }]);
  });

  it('refuses no browser, an unknown browser and a browser named twice, installing nothing', async () => {
    expect(parseBrowsers([])).toEqual({ error: 'name at least one browser (chromium, webkit, firefox)' });
    expect(parseBrowsers(['chromium', 'edge'])).toEqual({ error: 'unknown browser(s): edge' });
    expect(parseBrowsers(['webkit', 'webkit'])).toEqual({ error: 'a browser is named twice: webkit webkit' });
    expect(parseBrowsers(['chromium', 'webkit'])).toEqual({ browsers: ['chromium', 'webkit'] });
    const h = harness({ aliveBefore: () => true });
    expect(await ensure(['edge'], h.deps)).toBe(2);
    expect(h.installs).toEqual([]);
    expect(h.playwright.launched).toEqual([]);
  });
});
