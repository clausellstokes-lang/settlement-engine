/**
 * tests/helpers/fixtureGit.js — git in a throwaway folder acts on the throwaway folder, never on the
 * repository the suite runs in.
 *
 * THE CLASS: git exports GIT_DIR to every hook it runs (some hooks add GIT_INDEX_FILE and
 * GIT_WORK_TREE), and every child of the hook inherits it. From a LINKED worktree that GIT_DIR is
 * absolute, so under the pre-push hook a test that runs `git init` / `git config` / `git commit` in a
 * mkdtemp folder does not touch the folder at all: it acts on the real repository. Measured on
 * 2026-11-13 (COHERENCE-VEIL-4, the push of lane/coherence-veil-2026-11-11 from a linked worktree):
 * the whole check moved the lane branch onto fixture commits, made branches `other` and `side`,
 * wrote a Fixture identity and `commit.gpgsign=false` into the shared config and set
 * `core.bare=true`. It never bit before because every earlier whole-check push ran from a main
 * checkout, where a fixture's own `.git` happened to win.
 *
 * THE CURE, in one place:
 *   - `fixtureEnv(extra)` — this process's environment with every repository-locating variable
 *     removed (REPO_LOCATING_VARS and every GIT_CONFIG*), then `extra` laid over it. Pass it as
 *     `env` to any git, or any script that runs git, whose cwd is a folder outside the repository.
 *   - `fixtureGit(args, options)` — `execFileSync('git', …)` with that environment.
 *   - `isolateFromHostRepo()` — for a file that BUILDS a fixture repository: removes the same
 *     variables from `process.env` for the file's run (restored after), so the in-process library
 *     calls and spawned CLIs under test, which inherit `process.env`, act on the fixture too.
 * tests/lint/fixtureGitIsolation.walker.test.js reds a test file that runs git in such a folder
 * without them.
 *
 * Stripping is safe for a git call aimed at the real repository too: with no GIT_DIR, git finds the
 * repository from its cwd, which is how every such call in the suite already names it.
 *
 * Pure helper module: no describe/test here (a test file's exports re-register its suites in every
 * importer — see tests/helpers/dormancyOracle.js for the incident).
 */
import { execFileSync } from 'node:child_process';
import { afterAll, beforeAll } from 'vitest';

/** The variables by which an inherited environment points git at a repository other than its cwd's. */
export const REPO_LOCATING_VARS = Object.freeze([
  'GIT_DIR',
  'GIT_WORK_TREE',
  'GIT_INDEX_FILE',
  'GIT_COMMON_DIR',
  'GIT_OBJECT_DIRECTORY',
  'GIT_ALTERNATE_OBJECT_DIRECTORIES',
  'GIT_PREFIX',
]);

/** @param {string} key */
export const locatesRepo = (key) => REPO_LOCATING_VARS.includes(key) || key.startsWith('GIT_CONFIG');

/**
 * @param {Record<string, string | undefined>} [extra] laid over the stripped environment
 * @param {NodeJS.ProcessEnv} [base]
 * @returns {Record<string, string | undefined>}
 */
export function fixtureEnv(extra = {}, base = process.env) {
  /** @type {Record<string, string | undefined>} */
  const env = {};
  for (const [key, value] of Object.entries(base)) if (!locatesRepo(key)) env[key] = value;
  return { ...env, ...extra };
}

/**
 * `execFileSync('git', args, options)` with the repository-locating variables removed; `options.env`,
 * when given, is laid over the stripped environment rather than replacing it.
 * @param {string[]} args
 * @param {import('node:child_process').ExecFileSyncOptions} [options]
 */
export function fixtureGit(args, options = {}) {
  return execFileSync('git', args, { ...options, env: fixtureEnv(/** @type {any} */ (options.env)) });
}

/**
 * Call at module scope in a file that builds a fixture repository. Removes the repository-locating
 * variables from `process.env` before the file's first test and restores them after its last.
 */
export function isolateFromHostRepo() {
  /** @type {Record<string, string | undefined>} */
  const saved = {};
  beforeAll(() => {
    for (const key of Object.keys(process.env)) {
      if (locatesRepo(key)) { saved[key] = process.env[key]; delete process.env[key]; }
    }
  });
  afterAll(() => { Object.assign(process.env, saved); });
}
