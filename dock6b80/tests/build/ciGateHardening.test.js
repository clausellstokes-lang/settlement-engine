/**
 * tests/build/ciGateHardening.test.js — the deploy-gate hardening contracts.
 *
 * Wave 5b fuses the reference tree's fail-CLOSED Vercel `ignoreCommand` gate
 * (scripts/vercel-ignore-build.mjs) and its post-CI Deploy-Hook `redeploy` job
 * WITH this tree's CI-native `deploy` job — defense-in-depth on the same green
 * set. This pins the load-bearing behavior so a regression re-opens the gap:
 *
 *   - decideDeploy() SKIPS (fail-closed) when CI can't be verified (missing
 *     token, network/4xx, no git metadata on a CLI prod deploy), proceeds ONLY
 *     when every REQUIRED_CHECK is green, and the sole escape hatch is the
 *     explicit VERCEL_ALLOW_UNGATED_DEPLOY=1. Fail-closed extends to CRASHES:
 *     Vercel reads exit 1 as PROCEED, so a thrown error anywhere in the decision
 *     path must become SKIP (exit 0), never a crash-proceed.
 *   - REQUIRED_CHECKS ⇔ ci.yml job names stay in sync BOTH directions (a rename
 *     can't leave the gate requiring a check that never reports; a new gating job
 *     can't ship past the gate unless deliberately marked `# deploy-gate: optional`).
 *   - the `redeploy` job retriggers Vercel after the SAME gating jobs succeed on
 *     master, opt-in via the VERCEL_DEPLOY_HOOK_URL secret.
 *
 * (Scoped to the deploy gate. The reference tree's omnibus gate test also pinned
 * enforcing-CSP, the map supply-chain manifest, and an env-injectable
 * domain-strict --update ratchet — those are separate subsystems this tree
 * handles differently and are out of the gate-fusion scope.)
 */
import { describe, it, expect } from 'vitest';
import { readFileSync, writeFileSync, mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { decideDeploy, runGate, REQUIRED_CHECKS } from '../../scripts/vercel-ignore-build.mjs';
import { readAppliedHeadLedger } from '../../scripts/check-migration-head.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const REQUIRED_DEPLOY_JOB_IDS = [
  'check',
  'e2e',
  'performance',
  'deno-tests',
  'coverage-floors',
  'determinism-hostile-locale',
];

function ciJobBody(yaml, jobId) {
  const start = yaml.search(new RegExp(`^ {2}${jobId}:`, 'm'));
  if (start < 0) return null;
  const tail = yaml.slice(start);
  const next = tail.slice(1).search(/\n {2}[A-Za-z0-9_-]+:\s*(?:#.*)?$/m);
  return next >= 0 ? tail.slice(0, next + 1) : tail;
}

function inlineNeeds(job) {
  const value = job?.match(/^\s{4}needs:\s*\[([^\]]+)\]\s*$/m)?.[1];
  return value ? value.split(',').map((id) => id.trim()) : null;
}

// ── The Deno edge gate installs + type-checks before execution ────────────────
describe('Deno edge-function CI gate is reproducible and fail-closed', () => {
  const ci = readFileSync(join(ROOT, '.github/workflows/ci.yml'), 'utf8');
  const denoJobStart = ci.search(/^ {2}deno-tests:\s*$/m);
  const denoJobTail = denoJobStart >= 0 ? ci.slice(denoJobStart) : '';
  const nextJobOffset = denoJobTail.slice(1).search(/\n {2}[A-Za-z0-9_-]+:\s*(?:#.*)?$/m);
  const denoJob = nextJobOffset >= 0
    ? denoJobTail.slice(0, nextJobOffset + 1)
    : denoJobTail;

  it('pins @types/node as a direct exact dependency in both npm manifests', () => {
    const pkg = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8'));
    const lock = JSON.parse(readFileSync(join(ROOT, 'package-lock.json'), 'utf8'));
    const denoConfig = JSON.parse(readFileSync(join(ROOT, 'deno.json'), 'utf8'));
    const denoLock = JSON.parse(readFileSync(join(ROOT, 'deno.lock'), 'utf8'));
    expect(pkg.devDependencies['@types/node']).toBe('25.6.0');
    expect(lock.packages[''].devDependencies['@types/node']).toBe('25.6.0');
    expect(lock.packages['node_modules/@types/node'].version).toBe('25.6.0');
    expect(denoConfig.nodeModulesDir).toBe('manual');
    expect(denoLock.workspace.packageJson.dependencies).toContain('npm:@types/node@25.6.0');
  });

  it('installs the lockfile and blocks on the production type-check before tests', () => {
    expect(denoJobStart, 'ci.yml must declare a deno-tests job').toBeGreaterThanOrEqual(0);
    expect(denoJob).toMatch(/actions\/setup-node@v4/);
    expect(denoJob).toMatch(/run:\s*npm ci --ignore-scripts/);
    const installAt = denoJob.indexOf('run: npm ci --ignore-scripts');
    const checkAt = denoJob.indexOf('run: deno task check:edge');
    const testAt = denoJob.indexOf('run: deno task test:edge');
    expect(installAt, 'deno-tests must install the locked dependency tree').toBeGreaterThanOrEqual(0);
    expect(checkAt, 'deno-tests must run the production type-check').toBeGreaterThanOrEqual(0);
    expect(testAt, 'deno-tests must run the execution suite').toBeGreaterThanOrEqual(0);
    expect(installAt, 'locked dependencies must be installed before type-checking').toBeLessThan(checkAt);
    expect(checkAt, 'production type-check must block before edge tests').toBeLessThan(testAt);
    expect(denoJob.slice(checkAt, testAt)).not.toMatch(/continue-on-error:\s*true/);
  });
});

// ── The Vercel ignore-build gate is ARMED (fail-closed) ────────────────────────
// These exercise the REAL decideDeploy() decision (skip vs proceed), not just the
// presence of wiring strings — a regression to fail-OPEN flips an assertion.
describe('production deploy is gated on CI (fail-closed)', () => {
  it('vercel.json wires an ignoreCommand to the gate script', () => {
    const vercel = JSON.parse(readFileSync(join(ROOT, 'vercel.json'), 'utf8'));
    expect(vercel.ignoreCommand).toMatch(/vercel-ignore-build\.mjs/);
  });

  // Build the green-run set from REQUIRED_CHECKS itself, so this stays correct as
  // the gating set grows/shrinks (this tree requires the 5 jobs the `deploy` job
  // needs, not the reference's 3).
  const greenRuns = REQUIRED_CHECKS.map((name) => ({ name, conclusion: 'success' }));
  const vercelEnv = {
    VERCEL_GIT_COMMIT_SHA: 'deadbeef',
    VERCEL_GIT_REPO_OWNER: 'acme',
    VERCEL_GIT_REPO_SLUG: 'forge',
  };
  const okFetch = (runs) => async () => ({ ok: true, status: 200, runs });
  const cleanMigState = () => ({ repoHead: 1, appliedHead: 1 });

  it('proceeds outside a Vercel git deploy (local builds never blocked)', async () => {
    const d = await decideDeploy({}, async () => { throw new Error('must not fetch when not in Vercel'); });
    expect(d.action).toBe('proceed');
  });

  it('FAILS CLOSED: blocks a CLI `vercel deploy --prod` (VERCEL prod build, no git metadata)', async () => {
    const d = await decideDeploy({ VERCEL: '1', VERCEL_ENV: 'production' }, async () => {
      throw new Error('must not fetch — no git metadata to verify');
    });
    expect(d.action).toBe('skip');
    expect(d.reason).toMatch(/without git metadata/i);
  });

  it('a CLI prod deploy still honors VERCEL_ALLOW_UNGATED_DEPLOY (loudly)', async () => {
    const d = await decideDeploy(
      { VERCEL: '1', VERCEL_ENV: 'production', VERCEL_ALLOW_UNGATED_DEPLOY: '1' },
      async () => { throw new Error('must not fetch in opt-out path'); },
    );
    expect(d.action).toBe('proceed');
    expect(d.warn).toBe(true);
    expect(d.reason).toMatch(/UNGATED/);
  });

  it('a non-production Vercel context without git metadata still proceeds (preview/local build)', async () => {
    const d = await decideDeploy({ VERCEL: '1', VERCEL_ENV: 'preview' }, async () => { throw new Error('must not fetch'); });
    expect(d.action).toBe('proceed');
  });

  it('FAILS CLOSED: blocks the deploy when the CI token is missing', async () => {
    const d = await decideDeploy({ ...vercelEnv }, async () => { throw new Error('must not fetch without a token'); });
    expect(d.action).toBe('skip');
    expect(d.reason).toMatch(/cannot verify CI/i);
  });

  it('honors the explicit VERCEL_ALLOW_UNGATED_DEPLOY opt-out (loudly)', async () => {
    const d = await decideDeploy({ ...vercelEnv, VERCEL_ALLOW_UNGATED_DEPLOY: '1' }, async () => {
      throw new Error('must not fetch in opt-out path');
    });
    expect(d.action).toBe('proceed');
    expect(d.warn).toBe(true);
    expect(d.reason).toMatch(/UNGATED/);
  });

  it('proceeds only when ALL required checks are green', async () => {
    const d = await decideDeploy({ ...vercelEnv, GITHUB_CI_STATUS_TOKEN: 't' }, okFetch(greenRuns), cleanMigState);
    expect(d.action).toBe('proceed');
  });

  it('skips when a required check is failing', async () => {
    const runs = greenRuns.map((r, i) => (i === 1 ? { ...r, conclusion: 'failure' } : r));
    const d = await decideDeploy({ ...vercelEnv, GITHUB_CI_STATUS_TOKEN: 't' }, okFetch(runs));
    expect(d.action).toBe('skip');
    expect(d.reason).toMatch(/not green/);
  });

  it('skips when a required check has not reported yet', async () => {
    const runs = greenRuns.slice(0, -1); // drop the last required check
    const d = await decideDeploy({ ...vercelEnv, GITHUB_CI_STATUS_TOKEN: 't' }, okFetch(runs));
    expect(d.action).toBe('skip');
    expect(d.reason).toMatch(/not yet reported/);
  });

  it('PROCEEDS on a green-after-rerun commit (a re-run success overrides a same-name stale failure)', async () => {
    const [firstName] = REQUIRED_CHECKS;
    const runs = [
      { name: firstName, conclusion: 'success' }, // the re-run (newest first)
      { name: firstName, conclusion: 'failure' }, // the stale original
      ...greenRuns.slice(1),
    ];
    const d = await decideDeploy({ ...vercelEnv, GITHUB_CI_STATUS_TOKEN: 't' }, okFetch(runs), cleanMigState);
    expect(d.action).toBe('proceed');
  });

  it('FAILS CLOSED on a GitHub API error (no backdoor for an unreachable status API)', async () => {
    const d = await decideDeploy({ ...vercelEnv, GITHUB_CI_STATUS_TOKEN: 't' }, async () => { throw new Error('network down'); });
    expect(d.action).toBe('skip');
  });

  it('FAILS CLOSED on a non-2xx GitHub response (bad token / rate limit / 404)', async () => {
    const d = await decideDeploy({ ...vercelEnv, GITHUB_CI_STATUS_TOKEN: 't' }, async () => ({ ok: false, status: 401, runs: [] }));
    expect(d.action).toBe('skip');
  });

  // ── Migration-currency gate: CI only WARNS on ledger drift; the deploy gate
  //    makes it fail-closed so code can't ship ahead of the prod schema. ──
  const greenCiEnv = { ...vercelEnv, GITHUB_CI_STATUS_TOKEN: 't' };
  const migState = (repoHead, appliedHead) => () => ({ repoHead, appliedHead });

  it('FAILS CLOSED: skips when CI is green but the prod migration ledger is behind the repo head', async () => {
    const d = await decideDeploy(greenCiEnv, okFetch(greenRuns), migState(98, 97));
    expect(d.action).toBe('skip');
    expect(d.reason).toMatch(/db push|repo head is 98/i);
  });

  it('proceeds when the ledger confirms prod is at the repo head', async () => {
    const d = await decideDeploy(greenCiEnv, okFetch(greenRuns), migState(97, 97));
    expect(d.action).toBe('proceed');
  });

  it('honors VERCEL_ALLOW_MIGRATION_DRIFT=1 for a deliberate schema-free deploy (loudly)', async () => {
    const d = await decideDeploy({ ...greenCiEnv, VERCEL_ALLOW_MIGRATION_DRIFT: '1' }, okFetch(greenRuns), migState(98, 97));
    expect(d.action).toBe('proceed');
    expect(d.warn).toBe(true);
    expect(d.reason).toMatch(/VERCEL_ALLOW_MIGRATION_DRIFT/);
  });

  it('fails OPEN on unknown migration state (null) — never blocks on an unreadable ledger', async () => {
    const d = await decideDeploy(greenCiEnv, okFetch(greenRuns), migState(null, null));
    expect(d.action).toBe('proceed');
  });

  it('FAILS CLOSED when the migration-state read THROWS (e.g. corrupt applied-head.json)', async () => {
    const d = await decideDeploy(greenCiEnv, okFetch(greenRuns), () => { throw new SyntaxError('bad JSON'); });
    expect(d.action).toBe('skip');
    expect(d.reason).toMatch(/blocking deploy/i);
  });

  it('the REAL applied-head read THROWS on a present-but-corrupt file under strict (gate fails closed for real)', () => {
    const dir = mkdtempSync(join(tmpdir(), 'applied-head-'));
    try {
      const corrupt = join(dir, 'applied-head.json');
      writeFileSync(corrupt, '{ "appliedHead": 110,'); // truncated → invalid JSON
      expect(() => readAppliedHeadLedger(corrupt, { strict: true })).toThrow(/not valid JSON/i);
      expect(readAppliedHeadLedger(corrupt, { strict: false })).toBe(null); // routine run tolerates
      expect(readAppliedHeadLedger(join(dir, 'absent.json'), { strict: true })).toBe(null); // missing ≠ corrupt
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });

  it('runGate() translates ANY thrown error into SKIP (exit 0), never a crash-exit-1 proceed', async () => {
    const code = await runGate({}, async () => { throw new Error('unexpected gate bug'); });
    expect(code).toBe(0); // exit 0 → Vercel skips the build (fail-closed)
  });

  it('runGate() preserves the Vercel exit-code convention (skip → 0, proceed → 1)', async () => {
    expect(await runGate({}, async () => ({ action: 'skip', reason: 'r' }))).toBe(0);
    expect(await runGate({}, async () => ({ action: 'proceed', reason: 'r' }))).toBe(1);
  });
});

// ── REQUIRED_CHECKS ⇔ ci.yml job-name parity (both directions) ─────────────────
describe('REQUIRED_CHECKS stays in sync with ci.yml jobs', () => {
  const ci = readFileSync(join(ROOT, '.github/workflows/ci.yml'), 'utf8');

  it('the gate script still references the required CI checks', () => {
    const src = readFileSync(join(ROOT, 'scripts/vercel-ignore-build.mjs'), 'utf8');
    expect(src).toMatch(/REQUIRED_CHECKS/);
    expect(src).toMatch(/Validate, test, build/);
  });

  it('every REQUIRED_CHECKS name is the `name:` of a real job in ci.yml (rename-drift guard)', () => {
    const jobNames = [...ci.matchAll(/^\s{4}name:\s*(.+?)\s*$/gm)].map((m) => m[1].replace(/^['"]|['"]$/g, ''));
    for (const required of REQUIRED_CHECKS) {
      expect(jobNames, `REQUIRED_CHECKS "${required}" must be a job name in ci.yml`).toContain(required);
    }
  });

  // Collect each 2-space-indented job id under `jobs:`, its `name:`, and whether it
  // carries the `# deploy-gate: optional` opt-out (on the id line or inside the block).
  const parseGatingJobs = (yaml) => {
    const lines = yaml.split('\n');
    const jobsIdx = lines.findIndex((l) => /^jobs:\s*$/.test(l));
    expect(jobsIdx, 'ci.yml must declare a top-level `jobs:` key').toBeGreaterThanOrEqual(0);
    const jobs = [];
    let current = null;
    for (let i = jobsIdx + 1; i < lines.length; i++) {
      const line = lines[i];
      const jobMatch = /^ {2}([A-Za-z][\w-]*):\s*(?:#.*)?$/.exec(line);
      if (jobMatch) {
        current = { id: jobMatch[1], name: null, optional: /#\s*deploy-gate:\s*optional\b/.test(line) };
        jobs.push(current);
        continue;
      }
      if (/^\S/.test(line)) break; // a non-indented line ends the jobs block
      if (!current) continue;
      const nameMatch = /^ {4}name:\s*(.+?)\s*$/.exec(line);
      if (nameMatch) current.name = nameMatch[1].replace(/^['"]|['"]$/g, '');
      if (/#\s*deploy-gate:\s*optional\b/.test(line)) current.optional = true;
    }
    return jobs;
  };

  it('every deploy-gating CI job is in REQUIRED_CHECKS (inverse-direction guard)', () => {
    const jobs = parseGatingJobs(ci);
    expect(jobs.length, 'parser must discover the ci.yml jobs').toBeGreaterThanOrEqual(3);
    for (const job of jobs.filter((j) => !j.optional)) {
      expect(job.name, `job "${job.id}" must declare a name:`).toBeTruthy();
      expect(
        REQUIRED_CHECKS,
        `ci.yml job "${job.id}" (name "${job.name}") gates the deploy but is NOT in ` +
          'REQUIRED_CHECKS — add it to scripts/vercel-ignore-build.mjs, or mark the job ' +
          '"# deploy-gate: optional" if it deliberately must not block deploys.',
      ).toContain(job.name);
    }
  });

  it('the opt-out marker is the ONLY way a job escapes the gate (parser honors the convention)', () => {
    const synthetic = [
      'name: CI', 'on:', '  push:', '    branches: [master]', 'jobs:',
      '  check:', '    name: Validate, test, build', '    runs-on: ubuntu-latest',
      '  new-required:', '    name: Brand New Gate', '    runs-on: ubuntu-latest',
      '  perf-bench: # deploy-gate: optional (informational, must not block deploys)',
      '    name: Performance benchmark', '    runs-on: ubuntu-latest',
      'permissions:', '  contents: read', '',
    ].join('\n');
    const jobs = parseGatingJobs(synthetic);
    expect(jobs.map((j) => j.id)).toEqual(['check', 'new-required', 'perf-bench']);
    expect(jobs.find((j) => j.id === 'perf-bench').optional).toBe(true);
    expect(jobs.some((j) => j.id === 'permissions')).toBe(false);
    expect(jobs.filter((j) => !j.optional).map((j) => j.name)).toEqual(['Validate, test, build', 'Brand New Gate']);
    expect(REQUIRED_CHECKS).not.toContain('Brand New Gate');
  });
});

// ── The redeploy job retriggers Vercel after CI goes green ──────────────────────
describe('ci.yml redeploy job retriggers Vercel after CI goes green', () => {
  const ci = readFileSync(join(ROOT, '.github/workflows/ci.yml'), 'utf8');
  const jobBlock = ciJobBody(ci, 'redeploy');

  it('deploy and redeploy need the exact same complete gating job set', () => {
    expect(ciJobBody(ci, 'deploy'), 'ci.yml must have a top-level `deploy:` job').toBeTruthy();
    expect(jobBlock, 'ci.yml must have a top-level `redeploy:` job').toBeTruthy();
    expect(inlineNeeds(ciJobBody(ci, 'deploy'))).toEqual(REQUIRED_DEPLOY_JOB_IDS);
    expect(inlineNeeds(jobBlock)).toEqual(REQUIRED_DEPLOY_JOB_IDS);
  });

  it('fires only on a master push — never PRs or other branches', () => {
    const [ifLine] = jobBlock.match(/^\s{4}if:.*$/m) ?? [''];
    expect(ifLine).toMatch(/github\.event_name == 'push'/);
    expect(ifLine).toMatch(/github\.ref == 'refs\/heads\/master'/);
  });

  it('is OPT-IN via the VERCEL_DEPLOY_HOOK_URL secret and no-ops when unset', () => {
    expect(jobBlock).toMatch(/secrets\.VERCEL_DEPLOY_HOOK_URL/);
    expect(jobBlock).toMatch(/-z "\$VERCEL_DEPLOY_HOOK_URL"/);
    expect(jobBlock).toMatch(/curl -fsS -X POST "\$VERCEL_DEPLOY_HOOK_URL"/);
  });

  it('is marked deploy-gate: optional (the trigger must not be required to gate itself)', () => {
    expect(ci).toMatch(/^ {2}redeploy:.*#\s*deploy-gate:\s*optional/m);
  });
});
