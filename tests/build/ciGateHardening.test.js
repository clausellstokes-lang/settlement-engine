/**
 * tests/build/ciGateHardening.test.js — B17 build/CI gate-hardening contracts.
 *
 * Pins the concrete fixes from the B17 review so a regression re-opens the gap:
 *
 *   1. CSP is ENFORCING (a real `Content-Security-Policy` header), not the old
 *      `Content-Security-Policy-Report-Only` that blocked nothing — and still
 *      covers every origin the app actually uses (self, Supabase, Google Fonts,
 *      plausible) plus a report sink. The app-origin script-src stays locked
 *      (no 'unsafe-inline'/'unsafe-eval'); the vendored FMG fork under /map/*
 *      gets a SCOPED override for the relaxations it genuinely needs (inline
 *      handlers, d3-dsv `new Function`, unpkg Dropbox SDK). The report sink
 *      (/api/csp-report) is a REAL serverless function, not a 404.
 *   2. The vendored-map supply-chain manifest exists, pins every shipped lib by
 *      sha256+byteSize, matches the bytes on disk, and records the jQuery 3.1.1
 *      advisory ledger (so the blind spot stays documented, not silent).
 *   3. validate-edge-functions.mjs's strengthened botGuard contract FAILS when a
 *      function captures botGuard() but never consumes `.reject` (an unprotected
 *      endpoint), and PASSES on the current tree.
 *   4. The Vercel ignore-build gate is ARMED and fail-CLOSED: decideDeploy()
 *      SKIPS the deploy when the CI status token is missing or CI cannot be
 *      verified (network/4xx), proceeds only when every required check is green,
 *      and the lone escape hatch is the explicit VERCEL_ALLOW_UNGATED_DEPLOY=1.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { decideDeploy, REQUIRED_CHECKS } from '../../scripts/vercel-ignore-build.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');

// ── 1. CSP is enforcing and complete ──────────────────────────────────────────
describe('vercel.json CSP is enforcing (not Report-Only)', () => {
  const vercel = JSON.parse(readFileSync(join(ROOT, 'vercel.json'), 'utf8'));
  const headers = vercel.headers.flatMap((h) => h.headers);
  const byKey = (k) => headers.find((h) => h.key.toLowerCase() === k.toLowerCase());

  it('ships an enforcing Content-Security-Policy header', () => {
    expect(byKey('Content-Security-Policy'), 'must have an ENFORCING CSP header').toBeTruthy();
  });

  it('no longer relies SOLELY on a Report-Only policy (the old zero-enforcement bug)', () => {
    // A parallel Report-Only is allowed for monitoring, but an enforcing CSP
    // MUST exist. Before this fix only the Report-Only header was present.
    expect(byKey('Content-Security-Policy')).toBeTruthy();
  });

  it('covers every origin current usage needs', () => {
    const csp = byKey('Content-Security-Policy').value;
    // Supabase (REST + realtime websocket), Google Fonts, plausible analytics.
    expect(csp).toMatch(/connect-src[^;]*'self'/);
    expect(csp).toMatch(/connect-src[^;]*https:\/\/\*\.supabase\.co/);
    expect(csp).toMatch(/connect-src[^;]*wss:\/\/\*\.supabase\.co/);
    expect(csp).toMatch(/style-src[^;]*https:\/\/fonts\.googleapis\.com/);
    expect(csp).toMatch(/font-src[^;]*https:\/\/fonts\.gstatic\.com/);
    expect(csp).toMatch(/img-src[^;]*https:\/\/\*\.supabase\.co/);
    // Locked-down sinks.
    expect(csp).toMatch(/object-src 'none'/);
    expect(csp).toMatch(/base-uri 'self'/);
    expect(csp).toMatch(/frame-ancestors 'self'/);
  });

  it('declares a report sink for ongoing monitoring', () => {
    const csp = byKey('Content-Security-Policy').value;
    expect(csp).toMatch(/report-uri|report-to/);
  });
});

// ── 1b. App-origin script-src stays strict; the map fork gets a scoped override ─
describe('vercel.json CSP — app-origin strictness + scoped /map/ override', () => {
  const vercel = JSON.parse(readFileSync(join(ROOT, 'vercel.json'), 'utf8'));

  // The CSP that applies to a given path = the LAST matching rule for the key
  // (Vercel's last-match-wins). Mirror that selection here so the test asserts
  // the EFFECTIVE policy a browser would receive, not just "some" CSP string.
  const effectiveCsp = (path) => {
    let value;
    for (const rule of vercel.headers) {
      const re = new RegExp('^' + rule.source + '$');
      if (!re.test(path)) continue;
      const h = rule.headers.find((x) => x.key.toLowerCase() === 'content-security-policy');
      if (h) value = h.value;
    }
    return value;
  };
  const directive = (csp, name) => {
    const m = csp.match(new RegExp(`(?:^|;)\\s*${name}\\s([^;]*)`));
    return m ? m[1].trim() : '';
  };

  it('the app origin keeps a locked-down script-src (no unsafe-inline / unsafe-eval)', () => {
    // The headline rule: an XSS on the app origin must NOT be able to eval.
    const appScript = directive(effectiveCsp('/index.html'), 'script-src');
    expect(appScript, 'app script-src must exist').toBeTruthy();
    expect(appScript).not.toMatch(/'unsafe-inline'/);
    expect(appScript).not.toMatch(/'unsafe-eval'/);
    expect(appScript).toMatch(/'self'/);
  });

  it('the /map/* fork gets the relaxations FMG genuinely needs, scoped to that path', () => {
    // The vendored FMG iframe (public/map/index.html) has ~80 inline on*=
    // handlers, d3-dsv parses CSV via `new Function`, and dropbox.html loads the
    // Dropbox SDK from unpkg — all of which the strict app CSP would break.
    const mapCsp = effectiveCsp('/map/index.html');
    expect(mapCsp, 'a /map/ CSP must exist').toBeTruthy();
    const mapScript = directive(mapCsp, 'script-src');
    expect(mapScript).toMatch(/'unsafe-inline'/); // inline on*= handlers
    expect(mapScript).toMatch(/'unsafe-eval'/); // d3-dsv new Function
    expect(mapScript).toMatch(/https:\/\/unpkg\.com/); // dropbox.html SDK
    // dropbox.html token exchange + FMG embedded generators.
    expect(directive(mapCsp, 'connect-src')).toMatch(/https:\/\/api\.dropboxapi\.com/);
    expect(directive(mapCsp, 'frame-src')).toMatch(/https:\/\/watabou\.github\.io/);
    // The relaxations are SCOPED: the map override must not be the app default.
    expect(effectiveCsp('/index.html')).not.toBe(mapCsp);
  });
});

// ── 1c. The CSP report sink is REAL (not a 404) ───────────────────────────────
describe('CSP report sink endpoint exists', () => {
  it('vercel.json points report-uri/report-to at /api/csp-report', () => {
    const vercel = JSON.parse(readFileSync(join(ROOT, 'vercel.json'), 'utf8'));
    const csp = vercel.headers
      .flatMap((h) => h.headers)
      .find((h) => h.key.toLowerCase() === 'content-security-policy').value;
    expect(csp).toMatch(/report-uri \/api\/csp-report/);
    const reporting = vercel.headers
      .flatMap((h) => h.headers)
      .find((h) => h.key.toLowerCase() === 'reporting-endpoints').value;
    expect(reporting).toMatch(/csp-endpoint="\/api\/csp-report"/);
  });

  it('the api/csp-report.js serverless function backing that route exists', () => {
    // The route the CSP reports to must be a real file, or violations 404.
    const src = readFileSync(join(ROOT, 'api/csp-report.js'), 'utf8');
    expect(src).toMatch(/export default/);
    expect(src).toMatch(/csp-report/);
  });
});

// ── 2. Vendored-map supply-chain manifest ─────────────────────────────────────
describe('vendored map libs supply-chain manifest', () => {
  const manifestPath = join(ROOT, 'public/map/libs/VENDOR-MANIFEST.json');
  const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));

  it('pins at least the headline third-party libs', () => {
    const names = manifest.libs.map((l) => l.name);
    expect(names).toContain('jquery');
    expect(names).toContain('three');
    expect(names).toContain('tinymce');
  });

  it('every pinned file matches its sha256 + byteSize on disk', () => {
    for (const lib of manifest.libs) {
      const buf = readFileSync(join(ROOT, 'public/map/libs', lib.file));
      const sha256 = createHash('sha256').update(buf).digest('hex');
      expect(sha256, `${lib.file} sha256 drift`).toBe(lib.sha256);
      expect(buf.length, `${lib.file} byteSize drift`).toBe(lib.byteSize);
    }
  });

  it('records the jQuery 3.1.1 advisory ledger (documented, not silent)', () => {
    const jq = manifest.libs.find((l) => l.name === 'jquery');
    expect(jq.version).toBe('3.1.1');
    expect(jq.knownAdvisories).toContain('CVE-2020-11023');
  });
});

// ── 3. validate-edge-functions strengthened botGuard contract ──────────────────
describe('validate-edge-functions.mjs botGuard contract', () => {
  const script = join(ROOT, 'scripts/validate-edge-functions.mjs');

  it('passes on the current edge-function tree', () => {
    // Throws (non-zero exit) on failure; success is a clean run.
    const out = execFileSync('node', [script], { cwd: ROOT, encoding: 'utf8' });
    expect(out).toMatch(/valid/i);
  });

  it('the source enforces .reject consumption, not just the one wrong shape', () => {
    // Guard against a silent revert to the old regex-only contract that only
    // flagged `if (guard) return guard` and proved nothing about consumption.
    const src = readFileSync(script, 'utf8');
    expect(src).toMatch(/\.reject/);
    expect(src).toMatch(/never consumed|must check guard\.reject/);
  });
});

// ── 4. Vercel CI-gate ignore-build step is ARMED (fail-closed) ─────────────────
// These exercise the REAL decideDeploy() decision (skip vs proceed), not just
// the presence of wiring strings — a regression to fail-OPEN flips an assertion.
describe('production deploy is gated on CI', () => {
  it('vercel.json wires an ignoreCommand to the gate script', () => {
    const vercel = JSON.parse(readFileSync(join(ROOT, 'vercel.json'), 'utf8'));
    expect(vercel.ignoreCommand).toMatch(/vercel-ignore-build\.mjs/);
  });

  // Vercel exit-code convention: skip → exit 0 (ignore build), proceed → exit 1.
  const greenRuns = [
    { name: 'Validate, test, build', conclusion: 'success' },
    { name: 'Chromium end-to-end', conclusion: 'success' },
    { name: 'Edge function execution tests (Deno)', conclusion: 'success' },
  ];
  const vercelEnv = {
    VERCEL_GIT_COMMIT_SHA: 'deadbeef',
    VERCEL_GIT_REPO_OWNER: 'acme',
    VERCEL_GIT_REPO_SLUG: 'forge',
  };
  const okFetch = (runs) => async () => ({ ok: true, status: 200, runs });

  it('proceeds outside a Vercel git deploy (local builds never blocked)', async () => {
    const d = await decideDeploy({}, async () => {
      throw new Error('must not fetch when not in Vercel');
    });
    expect(d.action).toBe('proceed');
  });

  it('FAILS CLOSED: blocks the deploy when the CI token is missing', async () => {
    // The core hardening: an unset GITHUB_CI_STATUS_TOKEN must SKIP (not ship).
    const d = await decideDeploy({ ...vercelEnv }, async () => {
      throw new Error('must not fetch without a token');
    });
    expect(d.action).toBe('skip');
    expect(d.reason).toMatch(/cannot verify CI/i);
  });

  it('honors the explicit, documented VERCEL_ALLOW_UNGATED_DEPLOY opt-out (loudly)', async () => {
    const d = await decideDeploy(
      { ...vercelEnv, VERCEL_ALLOW_UNGATED_DEPLOY: '1' },
      async () => {
        throw new Error('must not fetch in opt-out path');
      },
    );
    expect(d.action).toBe('proceed');
    expect(d.warn).toBe(true);
    expect(d.reason).toMatch(/UNGATED/);
  });

  it('proceeds only when all required checks are green', async () => {
    const d = await decideDeploy({ ...vercelEnv, GITHUB_CI_STATUS_TOKEN: 't' }, okFetch(greenRuns));
    expect(d.action).toBe('proceed');
  });

  it('skips when a required check is failing', async () => {
    const runs = greenRuns.map((r) =>
      r.name === 'Chromium end-to-end' ? { ...r, conclusion: 'failure' } : r,
    );
    const d = await decideDeploy({ ...vercelEnv, GITHUB_CI_STATUS_TOKEN: 't' }, okFetch(runs));
    expect(d.action).toBe('skip');
    expect(d.reason).toMatch(/not green/);
  });

  it('PROCEEDS on a green-after-rerun commit (a re-run success overrides a same-name stale failure)', async () => {
    // GitHub returns check-runs newest-first; a re-run leaves [{success},{failure}]
    // for the same name. The dedup must keep the SUCCESS (not the older failure),
    // else a legitimately-green-after-rerun master commit stays blocked forever.
    const runs = [
      { name: 'Chromium end-to-end', conclusion: 'success' },   // the re-run (newest)
      { name: 'Chromium end-to-end', conclusion: 'failure' },   // the stale original
      { name: 'Validate, test, build', conclusion: 'success' },
      { name: 'Edge function execution tests (Deno)', conclusion: 'success' },
    ];
    const d = await decideDeploy({ ...vercelEnv, GITHUB_CI_STATUS_TOKEN: 't' }, okFetch(runs));
    expect(d.action).toBe('proceed');
  });

  it('skips when a required check has not reported yet', async () => {
    const runs = greenRuns.filter((r) => r.name !== 'Edge function execution tests (Deno)');
    const d = await decideDeploy({ ...vercelEnv, GITHUB_CI_STATUS_TOKEN: 't' }, okFetch(runs));
    expect(d.action).toBe('skip');
    expect(d.reason).toMatch(/not yet reported/);
  });

  it('FAILS CLOSED on a GitHub API error (no backdoor for an unreachable status API)', async () => {
    const d = await decideDeploy({ ...vercelEnv, GITHUB_CI_STATUS_TOKEN: 't' }, async () => {
      throw new Error('network down');
    });
    expect(d.action).toBe('skip');
  });

  it('FAILS CLOSED on a non-2xx GitHub response (bad token / rate limit / 404)', async () => {
    const d = await decideDeploy({ ...vercelEnv, GITHUB_CI_STATUS_TOKEN: 't' }, async () => ({
      ok: false,
      status: 401,
      runs: [],
    }));
    expect(d.action).toBe('skip');
  });

  it('the gate script still references the required CI checks', () => {
    const src = readFileSync(join(ROOT, 'scripts/vercel-ignore-build.mjs'), 'utf8');
    expect(src).toMatch(/REQUIRED_CHECKS/);
    expect(src).toMatch(/Validate, test, build/);
  });

  it('every REQUIRED_CHECKS name is the `name:` of a real job in ci.yml (rename-drift guard)', () => {
    // The gate matches CI by the human-readable JOB NAME from the GitHub Checks
    // API. If a job is renamed in ci.yml without updating REQUIRED_CHECKS, the
    // gate would require a check that never reports and block every deploy
    // forever (fail-closed → safe but total outage of the deploy path). Assert
    // each required check is literally a `name:` line in the workflow.
    const ci = readFileSync(join(ROOT, '.github/workflows/ci.yml'), 'utf8');
    const jobNames = [...ci.matchAll(/^\s{4}name:\s*(.+?)\s*$/gm)].map((m) => m[1].replace(/^['"]|['"]$/g, ''));
    for (const required of REQUIRED_CHECKS) {
      expect(jobNames, `REQUIRED_CHECKS "${required}" must be a job name in ci.yml`).toContain(required);
    }
  });
});
