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
 * Fail-safe posture: if the token is MISSING we cannot verify CI, so we PROCEED
 * (exit 1) rather than silently skipping every deploy — the local pre-push hook
 * + branch protection remain the backstop. Configure GITHUB_CI_STATUS_TOKEN to
 * turn this into a hard gate. Strengthen to "fail closed" (exit 0 when the token
 * is absent) once the token is provisioned and you want CI to be the SOLE path
 * to production.
 */

const REQUIRED_CHECKS = [
  'Validate, test, build', // the `check` job (job name shown in the Checks API)
  'Chromium end-to-end', // the `e2e` job
  'Edge function execution tests (Deno)', // the `deno-tests` job
];

const sha = process.env.VERCEL_GIT_COMMIT_SHA;
const owner = process.env.VERCEL_GIT_REPO_OWNER;
const repo = process.env.VERCEL_GIT_REPO_SLUG;
const token = process.env.GITHUB_CI_STATUS_TOKEN;

/** Skip the build (CI is not green / cannot deploy). */
function skip(reason) {
  console.log(`[vercel-ignore-build] SKIP deploy: ${reason}`);
  process.exit(0);
}
/** Proceed with the build. */
function proceed(reason) {
  console.log(`[vercel-ignore-build] PROCEED with deploy: ${reason}`);
  process.exit(1);
}

if (!sha || !owner || !repo) {
  // Outside Vercel (or missing git metadata) — never block.
  proceed('not running in a Vercel git deploy context');
}
if (!token) {
  // Fail-open until the read token is provisioned (see header).
  proceed('GITHUB_CI_STATUS_TOKEN not set — cannot verify CI, deferring to branch protection');
}

const headers = {
  Accept: 'application/vnd.github+json',
  Authorization: `Bearer ${token}`,
  'X-GitHub-Api-Version': '2022-11-28',
  'User-Agent': 'settlementforge-vercel-ignore-build',
};

try {
  const res = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/commits/${sha}/check-runs?per_page=100`,
    { headers },
  );
  if (!res.ok) {
    proceed(`GitHub Checks API returned ${res.status} — deferring to branch protection`);
  }
  const { check_runs: runs = [] } = await res.json();
  const byName = new Map(runs.map((r) => [r.name, r]));

  const missing = REQUIRED_CHECKS.filter((name) => !byName.has(name));
  if (missing.length) {
    // Checks haven't reported yet for this commit. Skip — a deploy will be
    // retriggered once CI publishes its conclusion (Vercel re-evaluates on
    // each redeploy), and a half-reported run must not ship.
    skip(`required checks not yet reported: ${missing.join(', ')}`);
  }

  const failed = REQUIRED_CHECKS.filter((name) => byName.get(name).conclusion !== 'success');
  if (failed.length) {
    skip(`required checks not green: ${failed.map((n) => `${n}=${byName.get(n).conclusion}`).join(', ')}`);
  }

  proceed('all required CI checks are green on this commit');
} catch (err) {
  // Network error talking to GitHub — fail-open to branch protection.
  proceed(`error querying GitHub Checks API (${err?.message || err}) — deferring to branch protection`);
}
