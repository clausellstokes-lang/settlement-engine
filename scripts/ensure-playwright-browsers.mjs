#!/usr/bin/env node
/**
 * ensure-playwright-browsers.mjs — prove the browsers a CI job needs can LAUNCH, and install them
 * only when they cannot (CI-FIT point 75, 2026-11-20).
 *
 *   node scripts/ensure-playwright-browsers.mjs chromium [webkit ...]
 *
 * ── WHY ─────────────────────────────────────────────────────────────────────
 * The two browser jobs of .github/workflows/ci.yml (`e2e`, `performance`) ran
 * `npx playwright install --with-deps …` on the runner. The browsers' download took about 10 s.
 * The SYSTEM PACKAGES did not: apt fetched them from the runner's regional Ubuntu mirror at
 * 48 to 62 kB/s, so the e2e job's install took 43m38s (run 44494042373, job 135456581358:
 * "Fetched 123 MB in 42min 30s (48.2 kB/s)", 181 packages) and the performance job's 9m45s
 * ("Fetched 32.1 MB in 8min 38s (61.9 kB/s)"). The same happened at 8f3b8bf4b (13m57s) and at
 * 64252903e (10m29s). A cache of the browser directory cannot help; the apt step is the cost.
 * So both jobs now run INSIDE Playwright's own image at the lockfile's exact version
 * (`mcr.microsoft.com/playwright:v<version>-noble`; tests/build/ciCheckParity.test.js pins the
 * tag to package-lock.json), which carries the browsers AND their system packages, and the
 * install step is this probe.
 *
 * ── WHAT IT DOES ────────────────────────────────────────────────────────────
 * 1. LAUNCH each named browser through the project's own @playwright/test, open a page, render
 *    a line of text, close. A launch is the only full proof: Playwright refuses to start a
 *    browser whose executable is missing, is of another revision than this playwright-core
 *    expects, or lacks a system library.
 * 2. If every launch succeeds: done, nothing installed (the image served them).
 * 3. If ANY launch fails — the image's browsers are not this version's, the job is not in the
 *    image at all, a library is missing — it FALLS BACK to the old working install,
 *    `npx playwright install --with-deps <browsers>`, then launches again. Only a failure of the
 *    second launch fails the step. So a broken mechanism costs time, never a vacuous job; the
 *    jobs' "is not vacuous" guards still judge whatever runs after.
 */
import { execFileSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const KNOWN = new Set(['chromium', 'webkit', 'firefox']);

/** Validate the argv: one or more known browser names, no duplicates. */
export function parseBrowsers(argv) {
  if (argv.length === 0) return { error: 'name at least one browser (chromium, webkit, firefox)' };
  const unknown = argv.filter((name) => !KNOWN.has(name));
  if (unknown.length) return { error: `unknown browser(s): ${unknown.join(', ')}` };
  if (new Set(argv).size !== argv.length) return { error: `a browser is named twice: ${argv.join(' ')}` };
  return { browsers: argv };
}

/** Launch each browser and render a page. Returns the failures as [{ name, message }]. */
export async function probe(browsers, playwright) {
  const failures = [];
  for (const name of browsers) {
    let browser;
    try {
      browser = await playwright[name].launch();
      const page = await browser.newPage();
      await page.setContent('<p id="probe">probe</p>');
      const text = await page.textContent('#probe');
      if (text !== 'probe') throw new Error(`the page rendered ${JSON.stringify(text)}, not "probe"`);
    } catch (error) {
      failures.push({ name, message: String(error?.message || error).split('\n').slice(0, 6).join(' | ') });
    } finally {
      await browser?.close().catch(() => {});
    }
  }
  return failures;
}

/**
 * Probe; on any failure install with the system packages and probe again.
 * `deps` is injectable so a test can drive both paths without a browser or a network.
 * Returns the exit code; never calls process.exit.
 */
export async function ensure(argv, deps = {}) {
  const parsed = parseBrowsers(argv);
  const log = deps.log || console.log;
  if (parsed.error) {
    (deps.error || console.error)(`[ensure-playwright-browsers] ${parsed.error}`);
    return 2;
  }
  const { browsers } = parsed;
  const playwright = deps.playwright || await import('@playwright/test');
  const install = deps.install || ((names) => execFileSync('npx', ['playwright', 'install', '--with-deps', ...names], { stdio: 'inherit' }));

  const first = await probe(browsers, playwright);
  if (first.length === 0) {
    log(`::notice title=Playwright browsers::${browsers.join(', ')} launched as served (PLAYWRIGHT_BROWSERS_PATH=${process.env.PLAYWRIGHT_BROWSERS_PATH || '(default)'}); nothing installed`);
    return 0;
  }
  for (const { name, message } of first) {
    log(`::warning title=Playwright browsers::${name} did not launch as served — falling back to \`npx playwright install --with-deps\`: ${message}`);
  }
  try {
    install(browsers);
  } catch (error) {
    log(`::error title=Playwright browsers::the fallback install failed: ${String(error?.message || error).split('\n')[0]}`);
    return 1;
  }
  const second = await probe(browsers, playwright);
  if (second.length === 0) {
    log(`::notice title=Playwright browsers::${browsers.join(', ')} launched after the fallback install`);
    return 0;
  }
  for (const { name, message } of second) {
    log(`::error title=Playwright browsers::${name} still does not launch after the fallback install: ${message}`);
  }
  return 1;
}

const invokedDirectly = process.argv[1]
  && path.relative(process.argv[1], fileURLToPath(import.meta.url)) === '';
if (invokedDirectly) process.exit(await ensure(process.argv.slice(2)));
