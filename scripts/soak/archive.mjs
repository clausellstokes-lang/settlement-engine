/**
 * archive.mjs — THE EXECUTION SUBSTRATE (SK-1; the soak-harness charter §0, SK.L6).
 *
 * ⛔ A SOAK NEVER RUNS AGAINST A LIVE WORKTREE. The never-census-a-live-tree law
 * generalizes: a tree that a sibling executor can move under you is not a thing you can
 * measure. Every run happens inside a `git archive <tip>` extraction with its own
 * lockfile install, and SOURCE IDENTITY IS THE ARCHIVED TIP SHA, passed in by the
 * runner and stamped into every receipt, report and ledger row.
 *
 * ⚠⚠ AND THE ARCHIVE MUST BE EXTRACTED OUTSIDE ANY REPOSITORY, WHICH IS A HARDER
 * REQUIREMENT THAN IT LOOKS. `readSourceIdentity()` in realm-scale-certification.mjs
 * shells `git ls-files`, and its `commandOutput` is a bare `execFileSync` that THROWS on
 * a non-zero exit. Inside an archive extracted outside any repository, that throw is the
 * safe failure. But extract the same archive ANYWHERE INSIDE a git repository and
 * `git rev-parse` / `git ls-files` succeed against the WRONG repository while
 * `readFileSync(resolve(ROOT, file))` reads the archive — a fingerprint over a mixed
 * file set, at exit 0. The charter's "it errors or lies" is exact, and the lie is the
 * conditional half. `assertOutsideRepository` is that condition made executable.
 *
 * The only impure function here is `assertOutsideRepository`, which must run a command
 * to learn the answer. Everything else is a pure description of what to run.
 */

import { execFileSync } from 'node:child_process';

/**
 * The commands that build a run substrate, as DATA. Returned rather than executed so a
 * test can assert the shape without shelling out, and so the runner logs exactly what
 * it will do before it does it.
 *
 * @param {{tip: string, directory: string}} plan
 * @returns {Array<{argv: string[], cwd: string, why: string}>}
 */
export function archivePlan({ tip, directory }) {
  return [
    {
      argv: ['git', 'archive', '--format=tar', String(tip)],
      cwd: '.',
      why: 'the archived tip IS the source identity; nothing is copied from the live tree',
    },
    {
      argv: ['tar', '-x', '-C', String(directory)],
      cwd: '.',
      why: 'extract OUTSIDE any repository — see assertOutsideRepository',
    },
    {
      argv: ['npm', 'ci', '--ignore-scripts'],
      cwd: String(directory),
      why: 'the archive\'s OWN lockfile install, so a dependency bump cannot silently change the substrate',
    },
  ];
}

/**
 * A directory is a lawful soak substrate only if `git rev-parse --show-toplevel` FAILS
 * inside it. Success means the extraction landed inside some repository, where source
 * identity would be computed from the wrong `git ls-files` at exit 0.
 *
 * @param {string} directory
 * @returns {string[]} refusals; empty means the substrate is lawful
 */
export function assertOutsideRepository(directory, run = defaultRun) {
  try {
    const toplevel = run(['git', 'rev-parse', '--show-toplevel'], directory);
    return [
      `REFUSED: ${directory} is inside the git repository at ${String(toplevel).trim()}. `
      + 'A soak archive extracted inside a repository computes its source fingerprint from '
      + 'THAT repository\'s git index while reading the archive\'s files — a mixed-set '
      + 'fingerprint at exit 0. Extract outside any repository.',
    ];
  } catch {
    // The throw IS the pass. `git rev-parse` failing is what "outside any repository"
    // looks like from inside a process.
    return [];
  }
}

function defaultRun(argv, cwd) {
  return execFileSync(argv[0], argv.slice(1), { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] });
}

/**
 * The identity stamped into every artefact a run produces. `sourceSha` is the ARCHIVED
 * TIP, supplied by the runner — never read from git inside the archive, where there is
 * no `.git` to read.
 */
export function runIdentity({ tip, profile, horizon, scale, startedAtIso }) {
  return {
    sourceSha: String(tip),
    profile: String(profile),
    horizon: Number(horizon),
    scale: Number(scale),
    startedAt: String(startedAtIso),
    substrate: 'git-archive',
  };
}
