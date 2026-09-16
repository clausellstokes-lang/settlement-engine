/**
 * tests/helpers/gitObjectStore.js — resolve a declared sha against the real object store
 * (epistemic prevention; F-SURVEY-1 J-S12-J8, the attribution arm's existence leg).
 *
 * THE CLASS: an attribution attested by SHAPE alone accepts any well-formed string. The
 * declared-overrun ledgers in tests/lint/domainAnyCastBaseline.test.js and
 * tests/lint/transcendentalMathBaseline.test.js each require `introducedAt` to match
 * /^[0-9a-f]{40}$/ — and `f`x40 satisfies that exactly as well as a real commit does. A sha
 * that LOOKS bisectable and is not is worse than a missing one, because the next lane plans
 * against it. This module resolves one, by asking git.
 *
 * ⚠⚠ IT LIVES HERE, NOT IN THE LEDGERS, AND THAT PLACEMENT IS LOAD-BEARING. Those two files
 * are the estate's NAMED COUNTEREXAMPLES for the walker-census law's DELEGATED arm (A4) —
 * tests/lint/testRatchet.test.js pins that arms A1 (name), A2 (title) and A3 (structure) all
 * MISS them and only A4 reaches, which is what proves the union is not reducible to one arm.
 * A3's predicate matches a shell-out to git, so writing `execFileSync('git', ...)` INSIDE
 * either ledger flips its structure arm true and destroys the counterexample — measured, not
 * feared: it reds testRatchet's "NO SINGLE ARM CLASSIFIES THEM ALL" pin by name. Keeping the
 * shell-out in an imported module keeps both ledgers delegating every walk they do.
 *
 * ⚠ THE ENVIRONMENT BRANCH IS DATA, NOT A DECISION. This module reports whether the object
 * store answered; it never decides what that means. The wave-end attribution method runs the
 * suite inside `git archive` extractions, which carry no object store at all, so a caller
 * that shelled out unconditionally would red in exactly the trees it is read in most. The
 * callers assert the branch instead of trusting it — a fake sha must fail to resolve before
 * any row is believed, and a tree that cannot answer must genuinely carry no `.git` entry.
 *
 * Pure helper module: no describe/test here (a test file's exports re-register its suites in
 * every importer — see tests/helpers/dormancyOracle.js for the incident).
 */
import { execFileSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');

/** True when `sha` names a real commit in THIS checkout's object store. */
export function gitResolvesCommit(sha) {
  try {
    execFileSync('git', ['cat-file', '-e', `${sha}^{commit}`], { cwd: ROOT, stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

/** True when this tree can be asked about commits at all (false in a `git archive` tree). */
export const GIT_OBJECTS_REACHABLE = gitResolvesCommit('HEAD');

/** True when the checkout carries a `.git` entry — a worktree's is a FILE, not a directory. */
export function gitDirPresent() {
  return existsSync(join(ROOT, '.git'));
}

/**
 * A 40-hex sha that is a commit in no repository — the negative control an existence check
 * is measured against, and deliberately the exact shape the ledgers' own regex accepts.
 */
export const UNRESOLVABLE_WELL_FORMED_SHA = 'f'.repeat(40);
