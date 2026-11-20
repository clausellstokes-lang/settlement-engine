# GIT-DOOR — hand-back (seventh chair, lane/git-door-2026-11-20)

Written 2026-11-20 02:42 UTC. Base: origin/lane/join-2026-11-14 at 29ec255fe (read back from origin, equal). Tip of the work: 316901a9e
(this file is the next commit). Pushed by plain pushes with the hooks; no pull request; #74 left as it is.

## What landed on the branch

| commit | what |
|---|---|
| a0cea73a7 | pick -x of 40728a7fe: the door (tests/helpers/gitFixture.js), its guard, the runner level (tests/setup/gitEnvIsolation.js first in vite.config.js setupFiles), four suites converted. Clean pick. |
| 3ac0288b2 | pick -x of 94521d5d6: .husky/pre-push forgets git's repository variables. ONE conflict: the line had grown the lane routing (2026-11-12). Resolved by putting the `unset` statement and its comment ABOVE the routing block, routing kept byte for byte. Noted in the commit message. |
| 7840d610c | pick -x of 62709637a: wording only. Clean pick. |
| 228a8f114 | the fifth fixture family, new since master: tests/scripts/landingStageMeasure.test.js through the door. |
| 316901a9e | 32f777c56 carried by re-measurement: the pick conflicted on the stored figure, so it was skipped and the census re-taken through its own refreeze at the clean tip 228a8f114: files 3700 -> 3701, parked 472, credited 3228 -> 3229, titles 31154 -> 31163, suiteTitles 8626 -> 8627 (the same deltas #74 measured on master). |

## 1. The census at the line (EXECUTED)

Static: 45 test files or helpers import child_process (38 at master db832c892); 121 test files reach it through imports
(122 at the tip, with the guard). Dynamic: those 121 run at the base, no hook, no repository variable, behind a logging
git shim: 1322 git calls in eight temp-directory families, plus this checkout only for reads.

| file | family | new since master | status |
|---|---|---|---|
| tests/scripts/implementationPackets.test.js | settlementforge-packets / -seal / -cross | no | behind the door (#74) |
| tests/scripts/implementationSession.test.js | implementation-session, -not-git | no | behind the door (#74) |
| tests/soak-harness/soakRegister.test.js | soak-register (+ its CLI's env) | no | behind the door (#74) |
| tests/lint/tuningRegister.walker.test.js | tunereg-git | no | behind the door (#74) |
| tests/scripts/landingStageMeasure.test.js | stage-guard (+ landing-stage.sh's env) | **yes** | behind the door (228a8f114) |
| tests/helpers/gitFixture.test.js | git-fixture-* (the guard's own decoys) | yes (#74) | the guard; its raw controls aim at its own decoys |
| tests/edgeFunctions/edgeSharedBundleReproducibility.test.js | checkout | no | read: cat-file --batch, ls-files |
| tests/helpers/gitObjectStore.js | checkout | no | read: cat-file -e |
| tests/helpers/goldenRecordDoor.js | checkout | no | read: status --porcelain |
| tests/lint/controlBytes.test.js | checkout | no | read: ls-files, check-attr, diff --numstat (its temp dir runs no git) |
| tests/lint/sovereigntyLightingContract.walker.test.js | checkout | no | read: status --porcelain, rev-parse |
| tests/security/committedSecretsScan.test.js | checkout | no | read: ls-files |
| tests/scripts/provenanceMap.test.js | checkout | no | read: show <ledger ref> |
| tests/ops/backupRestoreDrill.test.js | checkout | no | read: check-ignore |
| tests/lint/ledgerCitationIntegrity.test.js (via scripts/audit/ledger-citations.mjs) | checkout | no | read: -C ls-tree / show / log |
| tests/domain/bar6PowersCards.test.js | checkout | **yes** | read: git grep |
| tests/lint/declaredLineShape.test.js | checkout | **yes** | read: git grep |
| tests/lint/drawDeclaredKeys.walker.test.js | checkout | **yes** | read: git grep |
| tests/lint/wiringCensusDeclared.walker.test.js | checkout | **yes** | read: git grep |

The reads cannot write: every verb the shim saw in the checkout is a read (status, cat-file, grep, rev-parse, ls-files,
log, diff, check-attr, check-ignore, show, ls-tree), with cwd on the checkout. `status` may refresh the index's stat
cache; the decoy's index was byte-identical after every proof run. New since master: ONE fixture family (stage-guard)
and four read sites.

## 2. Red first, then green (EXECUTED, in copies outside every repository)

- The guard at the base's bytes, door absent: `Cannot find module .../tests/helpers/gitFixture.js`, 1 file red.
- The guard and the door at the base's bytes, the runner level unwired and the hook without its `unset`: 2 of 9 red,
  exactly the two that name them (gitEnvIsolation did not run; .husky/pre-push carries no `unset`).
- At the tip: the guard + the five converted suites, 6 files, 137 of 137, exit 0; the real repository's config, HEADs,
  refs and index identical before and after.

## 3. The proof under a hook (EXECUTED)

A decoy (a local clone of this repository at the tip, with the ledger branch as a local ref, a bare decoy remote and a
linked worktree `lane` on lane/proof) had a pre-push hook that snapshots the decoy, runs the tests with the environment
git exported (GIT_DIR=<decoy>/main/.git/worktrees/lane, GIT_PREFIX), with a logging git shim first on PATH, snapshots
again, and refuses the push (so the remote stays as it was). Snapshot = every file of the git dir except object
contents (md5), the object names, both work trees (node_modules aside) and the remote.

- Run 1: the 122 git-reaching files: 122 of 122, 1705 tests passed, 6 skipped. 1647 git calls; 49 carried a repository
  variable, all in /tmp/git-fixture-raw-*, the guard's raw controls, aimed at its own git-fixture-decoy-* dirs. Decoy
  byte-identical.
- Run 2: the WHOLE source phase, six shards by `node scripts/test-ratchet-shard.mjs <i> 6 <report outside the tree>`.
  Shard 1 ran in one hook; the container restarted during shard 2; the decoy was read byte-identical after the kill;
  shards 2-6 then ran in a second hook. 3634 files, 0 red; 41675 tests, 41674 passed, 1 skipped; every shard exit 0.
  Decoy byte-identical across both hooks (before shard 1 = after shard 6). Complete run: 1643 + 338 shim lines (the 338
  include the killed partial shard 2); 49 calls carried a repository variable in each hook's log, and all of them are
  the guard's raw controls (the guard lives in shard 2, which ran twice).
- NOT run under a hook: tests/build (67 files, outside the ratchet's source phase). They ran in the real checkout with
  no hook: tests/lint + tests/build, 286 files, before the census commit; the one red was the census (3700 vs 3701),
  re-taken in 316901a9e. In the real checkout tests/lint/ledgerCitationIntegrity and tests/scripts/provenanceMap red
  at the base AND at the tip because this clone has no local refs/heads/review-fixes-2026-07-08 (environmental; both
  green in the decoy, which has it).

## 4. The hook's routing is unchanged (EXECUTED)

A real `git push` from a decoy's linked worktree, this repository's .husky/_ wrapper and .husky/pre-push, `npm` replaced
by a recorder. Base hook vs tip hook:

| push | base | tip |
|---|---|---|
| lane/x only | ratchet, domain:strict, lint; GIT_DIR set | the same three; GIT_DIR, GIT_PREFIX unset |
| other | check, check:edge-behavior; GIT_DIR set | the same two; unset |
| lane/x + other (mixed) | — | check, check:edge-behavior; unset |
| lane/x as a tag | — | check, check:edge-behavior; unset |
| nothing to send (main, up to date) | check, check:edge-behavior; GIT_DIR set | the same two; unset |

## 5. Doors and gates at 316901a9e (EXECUTED)

Lighting census refrozen (above), then the ordinary walker green: sovereigntyLightingContract + gitFixture +
mutationCoverageManifest (no row owed: green with the new file) + tuningRegister.walker (its row as the pick carries
it): 4 files, 129 of 129. typecheck:ratchet 167/167, typecheck:domain:strict 1113/1113, lint 0 errors (38 warnings),
each read by gate-tail; the lane push's own hook ran the same three.

PLAUSIBLE, not executed: that CI's sharded verdict at the merge agrees (no merged ratchet verdict was run here).
Safety reads before the push: core.bare=false, user.name=Claude, every commit authored by Claude. The real repository's
config gained only core.hookspath=.husky/_ (from `npm ci`'s husky install), and one remote-tracking ref
(origin/review-fixes-2026-07-08, by a fetch).

## 6. Addendum 2026-11-20 02:46 UTC: what the door and the hook forget, measured in this container (the chair's question)

In this container the harness sets GIT_ASKPASS, GIT_CONFIG_COUNT, GIT_CONFIG_KEY_0..2, GIT_CONFIG_VALUE_0..2,
GIT_EDITOR, GIT_SSL_CAINFO and GIT_TERMINAL_PROMPT. I added GIT_DIR, GIT_WORK_TREE, GIT_INDEX_FILE, GIT_COMMON_DIR,
GIT_OBJECT_DIRECTORY, GIT_PREFIX and GIT_NAMESPACE, then ran each level's own function (EXECUTED):

- **The runner level and the hook** (REPOSITORY_ENV: git's own `rev-parse --local-env-vars` less GIT_CONFIG_PARAMETERS and
  GIT_CONFIG_COUNT; the hook's `unset` names the same thirteen) removed GIT_DIR, GIT_WORK_TREE, GIT_INDEX_FILE,
  GIT_COMMON_DIR, GIT_OBJECT_DIRECTORY and GIT_PREFIX. It KEPT every harness variable, including GIT_SSL_CAINFO and all of
  GIT_CONFIG_*. It also kept GIT_NAMESPACE, which is not on git's list. Its effect is ref namespacing inside whichever
  repository git opens; it does not choose the repository. So under it a temp-directory fixture still writes to its own
  repository. I did not change this; it is the chair's to rule.
- **The fixture door** (`fixtureGitEnv`) drops EVERY ambient GIT_* except GIT_EXEC_PATH, so it drops GIT_SSL_CAINFO and
  GIT_CONFIG_* too. It also switches off the global and system configuration and adds GIT_CEILING_DIRECTORIES. That is by
  design: a fixture is a local throwaway repository and reads no network and no harness configuration. Measured
  here: every fixture suite was green in this container, the whole suite under the hook included. A future fixture that
  fetched over HTTPS through the proxy would lose the CA bundle and would have to pass it in `options.env`. Scripts
  under test do NOT go through the door; they keep the harness variables (runner level only).
- **The pushes from this container ran the new hook** (two, both green). The `unset` acts only on the hook's own
  children, not on git's transport, and the harness's GIT_CONFIG_* and GIT_SSL_CAINFO survive it.
