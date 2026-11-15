/**
 * tests/setup/gitEnvIsolation.js — no test worker inherits a git hook's repository.
 *
 * Git exports the repository it is working on to every hook it runs: `GIT_DIR` from a
 * linked worktree, `GIT_DIR` and `GIT_WORK_TREE` under `--git-dir`, `GIT_INDEX_FILE` from a
 * commit hook. Those variables outrank the working directory, and `npm run check` — the
 * `pre-push` hook's whole body — hands them to Vitest, which hands them to every worker,
 * which hands them to every `git` a test or a script under test spawns. A fixture's
 * `git init` in a temp directory then re-initialises the REAL repository instead.
 * tests/helpers/gitFixture.js carries the measurement.
 *
 * This file is the suite-wide half of the cure. It runs in every worker before the test
 * file loads (vite.config.js `test.setupFiles`) and removes exactly the variables that make
 * git ignore `cwd`, so that for the rest of the worker's life "which repository" is answered
 * by the directory a process is started in — the same answer a run no hook started gets.
 * It cannot take away anything the suite relies on: in a run no hook started none of these
 * variables exists, and that is the run the suite is written to pass.
 *
 * It leaves a record on `globalThis` under a registered symbol, so the guard test can prove
 * by execution — without importing this file, which would run it — that the wiring is live
 * in the worker it is running in.
 *
 * @enforced-by tests/helpers/gitFixture.test.js
 */
import { scrubRepositoryEnv } from '../helpers/gitFixture.js';

/** Where the record lives. `Symbol.for`, so a test can name it without importing this file. */
export const GIT_ENV_ISOLATION = Symbol.for('settlementforge.tests.gitEnvIsolation');

globalThis[GIT_ENV_ISOLATION] = Object.freeze({
  /** The variables this worker inherited and no longer carries. Empty outside a hook. */
  removed: Object.freeze(scrubRepositoryEnv(process.env)),
});
