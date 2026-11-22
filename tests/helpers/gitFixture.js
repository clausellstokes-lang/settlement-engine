/**
 * tests/helpers/gitFixture.js — the one door a test opens a throw-away git repository through.
 *
 * ── THE HAZARD (measured 2026-11-15 on git 2.43.0, against a decoy repository) ──────────
 * Git exports the repository it is working on to the hooks it runs. From a LINKED WORKTREE —
 * where every lane works — a `pre-push` hook receives `GIT_DIR=<main>/.git/worktrees/<lane>`;
 * invoked as `git --git-dir=… --work-tree=…` it receives both variables; and `pre-commit`
 * adds `GIT_INDEX_FILE` and the author's `GIT_AUTHOR_*`. Those variables OUTRANK the working
 * directory, so a fixture's `git init` / `git config` / `git commit` — spawned with `cwd` on a
 * temp directory and the environment it happened to inherit — did not land in the temp
 * directory at all. Run under a decoy's real `pre-push` hook, four test files of this suite
 * set `core.bare = true` in the decoy's config, gave it a `[user]` section naming `Fixture`
 * and `commit.gpgsign = false`, committed fixture trees onto its branch and moved its HEAD.
 * The same four files run normally, and they pass: the leak needs a hook to appear.
 *
 * ── TWO LEVELS, BECAUSE THERE ARE TWO KINDS OF GIT IN A TEST ────────────────────────────
 *   THE RUNNER LEVEL — `scrubRepositoryEnv`, applied to every test worker's `process.env`
 *     by tests/setup/gitEnvIsolation.js. It removes the variables that make git ignore
 *     `cwd` (REPOSITORY_ENV) and nothing else, so "which repository" is decided by the
 *     directory a process was started in — for every git the suite spawns, including the
 *     ones spawned by a script under test that this module never sees. Configuration is
 *     left alone on purpose: the suite's own READS of this checkout must go on behaving
 *     exactly as they do in a run no hook started.
 *
 *   THE FIXTURE LEVEL — `fixtureGit`, for a repository the test itself creates. A fixture
 *     depends on what the test wrote into it and on nothing else, so it gets no ambient
 *     `GIT_*` variable at all, no global or system configuration, and a discovery ceiling at
 *     the fixture's parent — a fixture that is not (yet) a repository fails with "not a git
 *     repository" instead of finding one above it.
 *
 * The runner level alone closes the leak; the fixture level holds without it, so a file run
 * by some other runner, or with the setup file unwired, is still safe.
 *
 * A THIRD LEVEL sits outside the suite: `.husky/pre-push` unsets the same REPOSITORY_ENV
 * before it starts the check, so no step of the check inherits them — Vitest is only one.
 * The guard test executes the hook's own statement and holds the two lists equal.
 *
 * ── ⛔ IT IS POINTED TWICE AND CHECKED ONCE, AND THAT REDUNDANCY WAS PAID FOR ─────────────
 * The first cut of this module told git where to run with ONE option — the spawn's `cwd`.
 * A probe that deleted that one line, to show the guard test noticing, made every "fixture"
 * git run in the checkout the probe was started from: the guard test built its decoy INSIDE a
 * real worktree, and left a `[user]` section, a tag, a branch and two commits in a real
 * repository on its way to turning red. A guard that damages what it guards while proving a
 * point is the same defect one level up. So:
 *   • every call carries the directory twice, as the spawn's `cwd` AND as git's own `-C`;
 *   • before a root's first git, git is asked which repository it would use from there.
 *     An empty directory must get NO answer and a repository must get ITS OWN. Git answering
 *     for any other repository — through a lost direction, a lost ceiling or a variable that
 *     survived the scrub — is REFUSED before a single verb runs.
 * ⚠ WHAT THE QUESTION CANNOT SEE, measured rather than assumed: with BOTH directions removed
 * in a tree that is itself outside every repository (a `git archive` extraction), git lands
 * in a directory no repository answers for, so the question is silent and the verbs create a
 * stray `.git` there. No existing repository is reachable from such a directory to damage.
 *
 * @enforced-by tests/helpers/gitFixture.test.js
 *
 * Pure helper module: no describe/test here (a test file's exports re-register its suites in
 * every importer — see tests/helpers/dormancyOracle.js for the incident), and no side effect
 * at import: the one place `process.env` is changed is the setup file.
 */
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, realpathSync, statSync } from 'node:fs';
import { devNull } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * The variables that tell git WHICH repository, index or object store to use, whatever
 * directory it was started in. This is git's own list — `git rev-parse --local-env-vars`,
 * the set git itself clears before it runs a command inside another repository — less its
 * two configuration carriers (REPOSITORY_ENV_CONFIGURATION below). The guard test re-reads
 * git's list on every run, so a git that learns a new one reds until it is named here.
 */
export const REPOSITORY_ENV = Object.freeze([
  'GIT_DIR',
  'GIT_WORK_TREE',
  'GIT_COMMON_DIR',
  'GIT_INDEX_FILE',
  'GIT_OBJECT_DIRECTORY',
  'GIT_ALTERNATE_OBJECT_DIRECTORIES',
  'GIT_PREFIX',
  'GIT_IMPLICIT_WORK_TREE',
  'GIT_GRAFT_FILE',
  'GIT_SHALLOW_FILE',
  'GIT_REPLACE_REF_BASE',
  'GIT_NO_REPLACE_OBJECTS',
  'GIT_CONFIG',
]);

/**
 * The two members of git's own list that carry CONFIGURATION rather than a location, and
 * are therefore left to the runner level's callers: `git -c key=value` travels to a hook
 * as GIT_CONFIG_PARAMETERS, and a container may hand git its `safe.directory` through
 * GIT_CONFIG_COUNT. Removing either from every worker would change how the suite reads
 * THIS checkout. A fixture never sees them: `fixtureGitEnv` drops every `GIT_*`.
 */
export const REPOSITORY_ENV_CONFIGURATION = Object.freeze([
  'GIT_CONFIG_PARAMETERS',
  'GIT_CONFIG_COUNT',
]);

/** The one ambient `GIT_*` a fixture keeps: where this git binary keeps its own programs. */
const FIXTURE_KEPT_ENV = Object.freeze(['GIT_EXEC_PATH']);

const REPOSITORY_ENV_SET = new Set(REPOSITORY_ENV);

/** The checkout this suite belongs to — the one directory a fixture may never be. */
const SUITE_ROOT = physicalPath(join(dirname(fileURLToPath(import.meta.url)), '../..'));

/** @param {string} path @returns {string} the path with every symlink resolved, when it exists */
function physicalPath(path) {
  const absolute = resolve(path);
  try {
    return realpathSync(absolute);
  } catch {
    return absolute;
  }
}

/**
 * Remove the repository variables from an environment, IN PLACE.
 * @param {Record<string, string | undefined>} [env] defaults to this process's own
 * @returns {string[]} the names it removed, sorted — empty when there was nothing to remove
 */
export function scrubRepositoryEnv(env = process.env) {
  const removed = [];
  for (const name of Object.keys(env)) {
    if (!REPOSITORY_ENV_SET.has(name.toUpperCase())) continue;
    delete env[name];
    removed.push(name);
  }
  return removed.sort();
}

/**
 * The same removal as a COPY, for a test that hands a child process an environment of its
 * own: `spawnSync(node, [cli], { env: { ...withoutRepositoryEnv(), ...extra } })`.
 * @param {Record<string, string | undefined>} [env] defaults to this process's own
 * @returns {Record<string, string | undefined>}
 */
export function withoutRepositoryEnv(env = process.env) {
  const copy = { ...env };
  scrubRepositoryEnv(copy);
  return copy;
}

/**
 * Resolve a fixture root, refusing the one directory it must never be.
 * @param {string} root
 * @returns {string}
 */
function fixtureRoot(root) {
  if (typeof root !== 'string' || root.trim() === '') {
    throw new TypeError('fixtureGit: the fixture root must be a directory path. Create a temp'
      + ' directory (mkdtempSync(join(tmpdir(), …))) and pass it.');
  }
  const physical = physicalPath(root);
  if (physical === SUITE_ROOT) {
    throw new Error(`fixtureGit REFUSED: ${physical} is the checkout this suite belongs to,`
      + ' not a fixture. A fixture repository lives in a temp directory the test created; to'
      + ' READ this checkout, spawn git with `cwd: ROOT` as the walkers do.');
  }
  return physical;
}

/**
 * The environment a fixture's git runs in: the ambient one with every `GIT_*` variable
 * removed, the global and system configuration switched off, prompts off, and discovery
 * capped at the fixture's parent directory.
 *
 * `extra` is applied AFTER the removal, so it is the only way a `GIT_*` variable reaches a
 * fixture — a fixed `GIT_AUTHOR_DATE`, say, when a test needs reproducible commit ids. It
 * may not name a REPOSITORY_ENV variable: a fixture's repository is its root directory.
 *
 * ⚠ GIT_CONFIG_GLOBAL is honoured from git 2.32. On an older git the global file is still
 * read; which REPOSITORY a fixture's git reaches does not depend on it.
 *
 * @param {string} root the fixture's root directory
 * @param {Record<string, string>} [extra] variables this one fixture needs
 * @returns {Record<string, string | undefined>}
 */
export function fixtureGitEnv(root, extra = {}) {
  const physical = fixtureRoot(root);
  const redirecting = Object.keys(extra).filter((name) => REPOSITORY_ENV_SET.has(name.toUpperCase()));
  if (redirecting.length > 0) {
    throw new Error(`fixtureGit REFUSED: the extra environment names ${redirecting.join(', ')}.`
      + ' A fixture\'s repository is its root directory — pass a different root, never a'
      + ' variable that tells git to use another repository, index or object store.');
  }
  /** @type {Record<string, string | undefined>} */
  const env = {};
  for (const [name, value] of Object.entries(process.env)) {
    const upper = name.toUpperCase();
    if (upper.startsWith('GIT_') && !FIXTURE_KEPT_ENV.includes(upper)) continue;
    env[name] = value;
  }
  env.GIT_CONFIG_NOSYSTEM = '1';
  env.GIT_CONFIG_GLOBAL = devNull;
  env.GIT_TERMINAL_PROMPT = '0';
  const parent = dirname(physical);
  if (parent !== physical) env.GIT_CEILING_DIRECTORIES = parent;
  return { ...env, ...extra };
}

/**
 * The one spawn. The directory is given twice on purpose — see the header.
 * @param {string} physical the fixture root, resolved
 * @param {string[]} args
 * @param {Record<string, string>} [extra]
 * @returns {string}
 */
function spawnGit(physical, args, extra) {
  return execFileSync('git', ['-C', physical, ...args], {
    cwd: physical,
    env: fixtureGitEnv(physical, extra),
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  });
}

/**
 * The git dir a fixture root OWNS, read with `fs` and never with git: `<root>/.git` as a
 * directory, the target of `<root>/.git` as a linked worktree's file, or the root itself
 * when it is a bare repository. `null` when the root is not a repository (yet).
 * @param {string} physical
 * @returns {string | null}
 */
function ownGitDir(physical) {
  const dotGit = join(physical, '.git');
  if (existsSync(dotGit)) {
    if (statSync(dotGit).isDirectory()) return physicalPath(dotGit);
    const pointer = /^gitdir: (.+)$/m.exec(readFileSync(dotGit, 'utf8'));
    return pointer ? physicalPath(resolve(physical, pointer[1].trim())) : null;
  }
  return existsSync(join(physical, 'HEAD')) && existsSync(join(physical, 'objects')) ? physical : null;
}

/** Roots already shown to answer for themselves — one question per root, never per call. */
const answeredForThemselves = new Set();

/**
 * Ask git which repository it would use from a fixture root, BEFORE that root's first verb.
 * An empty directory must get no answer; a repository must get its own git dir.
 * @param {string} physical
 */
function assertAnswersForItself(physical) {
  if (answeredForThemselves.has(physical)) return;
  let answer = null;
  try {
    answer = physicalPath(spawnGit(physical, ['rev-parse', '--absolute-git-dir']).trim());
  } catch {
    // "not a git repository": nothing answers for this directory, which is what a fresh
    // fixture root must hear. (A missing git binary also lands here, and is reported by the
    // call this question was asked for.)
  }
  const own = ownGitDir(physical);
  if (answer !== null && answer !== own) {
    throw new Error(`fixtureGit REFUSED: git, started for the fixture root ${physical}, would`
      + ` use the repository at ${answer}`
      + (own === null ? ', while the fixture root is not a repository at all.' : ` instead of its own (${own}).`)
      + ' Nothing was run. A fixture git that reaches another repository is the leak this'
      + ' module exists to prevent: tests/helpers/gitFixture.js lost its `cwd`/`-C`, its'
      + ' ceiling, or its environment scrub.');
  }
  answeredForThemselves.add(physical);
}

/**
 * Run git inside a fixture repository and return what it printed.
 *
 *   const dir = mkdtempSync(join(tmpdir(), 'my-fixture-'));
 *   fixtureGit(dir, ['init', '-q', '-b', 'fixture']);
 *   fixtureGit(dir, ['config', 'user.email', 'fixture@example.test']);
 *
 * Throws what `execFileSync` throws when git exits non-zero (`status`, `stderr`).
 *
 * @param {string} root the fixture's root directory — a temp directory the test created
 * @param {string[]} args git's arguments
 * @param {{ env?: Record<string, string> }} [options] `env`: variables for this one call
 * @returns {string} git's stdout, untrimmed
 */
export function fixtureGit(root, args, options = {}) {
  const physical = fixtureRoot(root);
  assertAnswersForItself(physical);
  return spawnGit(physical, args, options.env);
}
