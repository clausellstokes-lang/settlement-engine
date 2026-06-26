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
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { readFileSync, writeFileSync, mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { createHash } from 'node:crypto';
import { execFileSync, spawnSync } from 'node:child_process';
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

  // ── INVERSE-DIRECTION guard (the sibling of the rename-drift test above) ─────
  // The rename guard above only proves REQUIRED_CHECKS ⊆ ci.yml jobs. It says
  // NOTHING about the other direction: a NEW gating job added to ci.yml is not
  // auto-required by the deploy gate, so it could pass the deploy while that new
  // gate is RED on the commit — exactly the "added a check that doesn't gate"
  // hole. This test closes it by deriving the gating-job set from ci.yml and
  // asserting REQUIRED_CHECKS ⊇ it.
  //
  // Convention: every job under `jobs:` is deploy-gating BY DEFAULT (its name
  // must appear in REQUIRED_CHECKS). The only way to add a CI job that does NOT
  // gate the deploy is to mark it EXPLICITLY with a `# deploy-gate: optional`
  // comment inside that job's block — a deliberate, reviewable opt-out, not a
  // silent omission. So a new required job that someone forgets to wire into
  // REQUIRED_CHECKS fails HERE instead of silently shipping past a red gate.
  //
  // Parse ci.yml structurally: collect each 2-space-indented job id under the
  // top-level `jobs:` key, its `name:`, and whether its block carries the
  // opt-out marker. (Scoped to after `jobs:` so the `on:` → push/pull_request
  // 2-space keys above it are never mistaken for jobs.)
  const parseGatingJobs = (ci) => {
    const lines = ci.split('\n');
    const jobsIdx = lines.findIndex((l) => /^jobs:\s*$/.test(l));
    expect(jobsIdx, 'ci.yml must declare a top-level `jobs:` key').toBeGreaterThanOrEqual(0);

    const jobs = [];
    let current = null;
    for (let i = jobsIdx + 1; i < lines.length; i++) {
      const line = lines[i];
      // A top-level job id: exactly 2 leading spaces, an identifier, then `:`.
      const jobMatch = /^ {2}([A-Za-z][\w-]*):\s*(?:#.*)?$/.exec(line);
      if (jobMatch) {
        current = { id: jobMatch[1], name: null, optional: false };
        // The opt-out marker may ride as a trailing comment on the job-id line
        // itself (`  perf-bench: # deploy-gate: optional`) or on any line inside
        // the block — honor both.
        if (/#\s*deploy-gate:\s*optional\b/.test(line)) current.optional = true;
        jobs.push(current);
        continue;
      }
      // A non-indented line after `jobs:` ends the jobs block entirely.
      if (/^\S/.test(line)) break;
      if (!current) continue;
      const nameMatch = /^ {4}name:\s*(.+?)\s*$/.exec(line);
      if (nameMatch) current.name = nameMatch[1].replace(/^['"]|['"]$/g, '');
      if (/#\s*deploy-gate:\s*optional\b/.test(line)) current.optional = true;
    }
    return jobs;
  };

  it('every deploy-gating CI job in ci.yml is in REQUIRED_CHECKS (inverse-direction guard)', () => {
    const ci = readFileSync(join(ROOT, '.github/workflows/ci.yml'), 'utf8');
    const jobs = parseGatingJobs(ci);
    // Sanity: we actually found the workflow's jobs (a broken parser that finds
    // none would vacuously pass).
    expect(jobs.length, 'parser must discover the ci.yml jobs').toBeGreaterThanOrEqual(3);

    const gating = jobs.filter((j) => !j.optional);
    for (const job of gating) {
      expect(job.name, `job "${job.id}" must declare a name:`).toBeTruthy();
      expect(
        REQUIRED_CHECKS,
        `ci.yml job "${job.id}" (name "${job.name}") gates the deploy but is NOT in ` +
          `REQUIRED_CHECKS — add it to scripts/vercel-ignore-build.mjs, or mark the job ` +
          `"# deploy-gate: optional" if it deliberately must not block deploys.`,
      ).toContain(job.name);
    }
  });

  it('the opt-out marker is the ONLY way a ci.yml job escapes the gate (parser honors the convention)', () => {
    // Prove the inverse guard would actually CATCH a new unwired required job —
    // and that the documented opt-out marker is what suppresses it — by running
    // the parser over a synthetic workflow rather than trusting the real one to
    // exercise both branches. (The real ci.yml currently has every job required,
    // so without this the opt-out branch is never executed.)
    const synthetic = [
      'name: CI',
      'on:',
      '  push:',
      '    branches: [master]',
      'jobs:',
      '  check:',
      '    name: Validate, test, build',
      '    runs-on: ubuntu-latest',
      '  new-required:',
      '    name: Brand New Gate',
      '    runs-on: ubuntu-latest',
      '  perf-bench: # deploy-gate: optional (informational, must not block deploys)',
      '    name: Performance benchmark',
      '    runs-on: ubuntu-latest',
      'permissions:',
      '  contents: read',
      '',
    ].join('\n');
    const jobs = parseGatingJobs(synthetic);
    expect(jobs.map((j) => j.id)).toEqual(['check', 'new-required', 'perf-bench']);
    // The optional job is recognized as opted-out…
    expect(jobs.find((j) => j.id === 'perf-bench').optional).toBe(true);
    // …and the trailing non-indented `permissions:` block is NOT swallowed as a job.
    expect(jobs.some((j) => j.id === 'permissions')).toBe(false);

    const gating = jobs.filter((j) => !j.optional).map((j) => j.name);
    expect(gating).toEqual(['Validate, test, build', 'Brand New Gate']);
    // "Brand New Gate" is gating but absent from REQUIRED_CHECKS → the real test
    // above would FAIL for it, which is the protection we want.
    expect(REQUIRED_CHECKS).not.toContain('Brand New Gate');
  });
});

// ── 5. check-domain-strict.mjs --update only TIGHTENS (lower-only ratchet) ─────
// A ratchet that --update can RAISE is no ratchet: re-baselining could launder
// new strict debt straight past the gate. Drive the real script with a stubbed
// tsc (DOMAIN_STRICT_TSC_CMD) so we control the reported error count, and a temp
// baseline (DOMAIN_STRICT_BASELINE) so the committed one is never touched.
describe('check-domain-strict.mjs --update is lower-only (ratchet never widens)', () => {
  const script = join(ROOT, 'scripts/check-domain-strict.mjs');

  // A fake "tsc" that prints `count` domain strict-error lines in the exact shape
  // the parser matches, then exits 1 (like a real tsc with errors). Encoded as a
  // node -e command so it is cross-platform and needs no temp script file.
  const fakeTsc = (count) =>
    `node -e "for(let i=0;i<${count};i++)process.stdout.write('src/domain/foo.js('+(i+1)+',1): error TS2304: x\\n');process.exit(1)"`;

  const runUpdate = (baselinePath, count) =>
    spawnSync('node', [script, '--update'], {
      cwd: ROOT,
      encoding: 'utf8',
      env: { ...process.env, DOMAIN_STRICT_BASELINE: baselinePath, DOMAIN_STRICT_TSC_CMD: fakeTsc(count) },
    });

  let dir;
  let baselinePath;
  beforeEach(() => {
    dir = mkdtempSync(join(tmpdir(), 'domstrict-'));
    baselinePath = join(dir, 'baseline.json');
  });
  afterEach(() => rmSync(dir, { recursive: true, force: true }));

  it('REFUSES to raise the ceiling (new total > baseline → non-zero exit, baseline unchanged)', () => {
    writeFileSync(baselinePath, `${JSON.stringify({ total: 5, files: { 'src/domain/foo.js': 5 } }, null, 2)}\n`);
    const r = runUpdate(baselinePath, 8); // would-be ceiling of 8 > 5
    expect(r.status, r.stdout + r.stderr).not.toBe(0);
    expect(r.stderr).toMatch(/refusing to RAISE|only LOWER/i);
    // Baseline on disk is untouched — the higher ceiling was NOT written.
    expect(JSON.parse(readFileSync(baselinePath, 'utf8')).total).toBe(5);
  });

  it('ALLOWS lowering the ceiling (new total < baseline → writes the tighter ceiling)', () => {
    writeFileSync(baselinePath, `${JSON.stringify({ total: 5, files: { 'src/domain/foo.js': 5 } }, null, 2)}\n`);
    const r = runUpdate(baselinePath, 2); // burn-down to 2
    expect(r.status, r.stdout + r.stderr).toBe(0);
    expect(JSON.parse(readFileSync(baselinePath, 'utf8')).total).toBe(2);
  });

  it('ALLOWS an equal re-baseline (idempotent, never blocks an unchanged count)', () => {
    writeFileSync(baselinePath, `${JSON.stringify({ total: 3, files: { 'src/domain/foo.js': 3 } }, null, 2)}\n`);
    const r = runUpdate(baselinePath, 3);
    expect(r.status, r.stdout + r.stderr).toBe(0);
    expect(JSON.parse(readFileSync(baselinePath, 'utf8')).total).toBe(3);
  });
});
