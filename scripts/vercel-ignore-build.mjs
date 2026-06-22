#!/usr/bin/env node
/**
 * scripts/vercel-ignore-build.mjs — Vercel "Ignored Build Step" gate.
 *
 * Wired via vercel.json `ignoreCommand`. Vercel runs this BEFORE a production
 * (or preview) build and reads the EXIT CODE to decide whether to build:
 *
 *   exit 0  → "ignore" → SKIP the build (CI not green / non-deployable ref)
 *   exit 1  → proceed  → run the build (CI green on this commit)
 *
 * (This is Vercel's documented convention — it is the inverse of a normal
 * shell exit. See https://vercel.com/docs/projects/overview#ignored-build-step)
 *
 * Why this exists: production deploy on Vercel is otherwise INDEPENDENT of CI
 * (see docs/DEPLOY.md "Gating production on CI"). A commit that fails tests, the
 * build's MISSING_EXPORT guard, or a security check would still ship the moment
 * it lands on master. This step closes that gap from inside the repo, so the
 * gate travels with the code instead of living only in the Vercel dashboard.
 *
 * It checks the GitHub Commit Status / Checks API for the `CI / Validate, test,
 * build` (the `check` job), `CI / Chromium end-to-end` (`e2e`), and
 * `CI / Edge function execution tests (Deno)` (`deno-tests`) conclusions on the
 * exact commit being deployed. The build proceeds ONLY when all required checks
 * have concluded successfully.
 *
 * Required environment (set in Vercel → Project → Settings → Environment
 * Variables; the first three Vercel injects automatically):
 *   VERCEL_GIT_COMMIT_SHA      — the commit being built (Vercel-provided)
 *   VERCEL_GIT_REPO_OWNER      — GitHub org/user        (Vercel-provided)
 *   VERCEL_GIT_REPO_SLUG       — GitHub repo name        (Vercel-provided)
 *   GITHUB_CI_STATUS_TOKEN     — a GitHub token with `repo:status` / checks read
 *                                (set this one yourself — a read-only PAT)
 *
 * Fail-CLOSED posture: this gate is ARMED. If we are running inside a Vercel
 * git deploy but the token is MISSING we CANNOT verify CI, so we BLOCK the
 * deploy (exit 0 = skip) rather than shipping unverified bytes — the whole
 * point of the gate is that CI is the SOLE path to production. The ONLY escape
 * hatch is the explicit, documented opt-out env `VERCEL_ALLOW_UNGATED_DEPLOY=1`
 * (e.g. a deliberate hotfix while the token is being rotated); it proceeds with
 * a LOUD warning so an ungated deploy is never silent. The not-running-in-Vercel
 * branch always proceeds (local `vercel build`, `vite preview`, etc. must never
 * be blocked by a gate meant for production deploys).
 */

import { pathToFileURL } from 'node:url';

// Exported so a test can assert these still match the `name:` of every job in
// .github/workflows/ci.yml — a renamed CI job would otherwise leave the gate
// requiring a check that never reports, blocking every deploy forever (the gate
// is fail-closed, so the failure is safe but total). The drift guard lives in
// tests/build/ciGateHardening.test.js.
export const REQUIRED_CHECKS = [
  'Validate, test, build', // the `check` job (job name shown in the Checks API)
  'Chromium end-to-end', // the `e2e` job
  'Edge function execution tests (Deno)', // the `deno-tests` job
];

/**
 * Pure, side-effect-free deploy decision. Tests import THIS so they assert the
 * real skip/proceed DECISION (not just wiring strings). `fetchCheckRuns` is
 * injected so the CI-status fetch can be stubbed without hitting the network.
 *
 * @param {Record<string, string | undefined>} env  - process.env (or a fake).
 * @param {(args: { owner: string, repo: string, sha: string, token: string }) =>
 *           Promise<{ ok: boolean, status?: number, runs?: Array<{ name: string, conclusion: string | null }> }>}
 *         [fetchCheckRuns] - resolves the commit's check-runs; defaults to GitHub.
 * @returns {Promise<{ action: 'skip' | 'proceed', reason: string, warn?: boolean }>}
 *   `action: 'skip'` → exit 0 (Vercel ignores the build);
 *   `action: 'proceed'` → exit 1 (Vercel runs the build).
 */
export async function decideDeploy(env, fetchCheckRuns = fetchGithubCheckRuns) {
  const sha = env.VERCEL_GIT_COMMIT_SHA;
  const owner = env.VERCEL_GIT_REPO_OWNER;
  const repo = env.VERCEL_GIT_REPO_SLUG;
  const token = env.GITHUB_CI_STATUS_TOKEN;
  const allowUngated = env.VERCEL_ALLOW_UNGATED_DEPLOY === '1';

  if (!sha || !owner || !repo) {
    // Outside Vercel (or missing git metadata) — never block.
    return { action: 'proceed', reason: 'not running in a Vercel git deploy context' };
  }

  if (!token) {
    // FAIL CLOSED: we cannot verify CI, so the gate blocks the deploy. The one
    // documented escape hatch proceeds, loudly, so it is never silent.
    if (allowUngated) {
      return {
        action: 'proceed',
        warn: true,
        reason:
          'GITHUB_CI_STATUS_TOKEN not set but VERCEL_ALLOW_UNGATED_DEPLOY=1 — proceeding UNGATED (CI was NOT verified)',
      };
    }
    return {
      action: 'skip',
      reason:
        'GITHUB_CI_STATUS_TOKEN not set — cannot verify CI; blocking deploy (set the token, or VERCEL_ALLOW_UNGATED_DEPLOY=1 to override)',
    };
  }

  let res;
  try {
    res = await fetchCheckRuns({ owner, repo, sha, token });
  } catch (err) {
    // Network error talking to GitHub — fail CLOSED. An unreachable status API
    // must not become a backdoor that ships unverified commits.
    return {
      action: 'skip',
      reason: `error querying GitHub Checks API (${err?.message || err}) — cannot verify CI; blocking deploy`,
    };
  }

  if (!res || !res.ok) {
    // Non-2xx from GitHub (bad token, rate limit, 404) — fail CLOSED.
    return {
      action: 'skip',
      reason: `GitHub Checks API returned ${res?.status ?? 'no response'} — cannot verify CI; blocking deploy`,
    };
  }

  const runs = res.runs ?? [];
  // GitHub returns check-runs newest-first. A re-run leaves multiple runs with the
  // same name on the commit, so naive `new Map(runs.map(...))` would keep the LAST
  // array entry = the OLDEST run, leaving a green-after-rerun commit blocked by its
  // stale failure. Keep the most-relevant run per name: a success wins; otherwise
  // the most-recent (first-seen, since the list is newest-first).
  const byName = new Map();
  for (const r of runs) {
    const existing = byName.get(r.name);
    if (!existing) byName.set(r.name, r);
    else if (existing.conclusion !== 'success' && r.conclusion === 'success') byName.set(r.name, r);
  }

  const missing = REQUIRED_CHECKS.filter((name) => !byName.has(name));
  if (missing.length) {
    // Checks haven't reported yet for this commit. Skip — a deploy will be
    // retriggered once CI publishes its conclusion (Vercel re-evaluates on
    // each redeploy), and a half-reported run must not ship.
    return { action: 'skip', reason: `required checks not yet reported: ${missing.join(', ')}` };
  }

  const failed = REQUIRED_CHECKS.filter((name) => byName.get(name).conclusion !== 'success');
  if (failed.length) {
    return {
      action: 'skip',
      reason: `required checks not green: ${failed.map((n) => `${n}=${byName.get(n).conclusion}`).join(', ')}`,
    };
  }

  return { action: 'proceed', reason: 'all required CI checks are green on this commit' };
}

/**
 * Default fetcher: queries the GitHub Checks API for a commit's check-runs.
 * @param {{ owner: string, repo: string, sha: string, token: string }} args
 * @returns {Promise<{ ok: boolean, status: number, runs: Array<{ name: string, conclusion: string | null }> }>}
 */
async function fetchGithubCheckRuns({ owner, repo, sha, token }) {
  const headers = {
    Accept: 'application/vnd.github+json',
    Authorization: `Bearer ${token}`,
    'X-GitHub-Api-Version': '2022-11-28',
    'User-Agent': 'settlementforge-vercel-ignore-build',
  };
  const res = await fetch(
    // filter=latest → GitHub returns only the most-recent run per check name, so
    // accumulated re-runs can't push a required check past the per_page window
    // (and can't resurrect a stale failure). The byName dedup is a belt-and-braces.
    `https://api.github.com/repos/${owner}/${repo}/commits/${sha}/check-runs?per_page=100&filter=latest`,
    { headers },
  );
  if (!res.ok) return { ok: false, status: res.status, runs: [] };
  const { check_runs: runs = [] } = await res.json();
  return { ok: true, status: res.status, runs };
}

/** Run the gate as a CLI: translate the decision into Vercel's exit-code convention. */
async function main() {
  const decision = await decideDeploy(process.env);
  if (decision.warn) {
    console.warn(`[vercel-ignore-build] WARNING: ${decision.reason}`);
  }
  if (decision.action === 'skip') {
    console.log(`[vercel-ignore-build] SKIP deploy: ${decision.reason}`);
    process.exit(0); // exit 0 → Vercel IGNORES (skips) the build
  } else {
    console.log(`[vercel-ignore-build] PROCEED with deploy: ${decision.reason}`);
    process.exit(1); // exit 1 → Vercel RUNS the build
  }
}

// Only run the CLI when invoked directly (`node scripts/vercel-ignore-build.mjs`),
// not when imported by the test that exercises decideDeploy(). argv[1] may be a
// relative path, so resolve it to a file: URL before comparing.
const invokedPath = process.argv[1] ? pathToFileURL(process.argv[1]).href : '';
if (import.meta.url === invokedPath) {
  await main();
}
