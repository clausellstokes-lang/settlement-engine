# BRIEF-CHECKS-PARTS: one whole check shared by three seats (each runs a part; the chair joins the names)

You are a CHECKS seat of the sixth chair (session_01FbPLbcLDSJzZFzb5B7EjxR): CHECKS-1, CHECKS-2 or CHECKS-3 (your
prompt or the chair's message says which). YOU CHANGE NO CODE. A whole check takes two hours on one machine; three
seats each run a part of the SAME check at the SAME commit, and the chair joins what they publish. This file is your
whole assignment (CHECKS-1: it replaces "One run" and "Publish" of `BRIEF-CHECKS-1.md`; your setup stands).

## Setup (once; CHECKS-1 has done it and only refreshes the tools)

1. `git fetch origin lane/chair-2026-11-08 review-fixes-2026-07-08`, then `git fetch --unshallow origin` (if it says the
   repository is already complete, go on).
2. `git branch -f review-fixes-2026-07-08 origin/review-fixes-2026-07-08` (two citation suites read the ledger as a LOCAL ref).
3. The tools: `git worktree add --detach /home/user/chairtools origin/lane/chair-2026-11-08` (ALREADY THERE: `git -C
   /home/user/chairtools fetch origin lane/chair-2026-11-08 && git -C /home/user/chairtools checkout --detach FETCH_HEAD`
   BEFORE EVERY RUN: the tools change). They are in `/home/user/chairtools/docs/chair/2026-11-17/tools/`; read
   `whole.sh`'s header (the PARTS argument).
4. ALL WORK IN SCRATCH WORKTREES UNDER /home/user, never the repository's main checkout.

## Your part

| seat | parts (the fourth argument of `whole.sh`) | your branch |
|---|---|---|
| CHECKS-1 | `"pre s:1 s:2"` | `lane/checks-2026-11-17` |
| CHECKS-2 | `"s:3 s:4 build"` | `lane/checks-2-2026-11-17` |
| CHECKS-3 | `"s:5 s:6"` | `lane/checks-3-2026-11-17` |

THE SHARD COUNT IS ALWAYS 6. The chair's message names THE COMMIT and THE LABEL of a run.

## One run

1. `git fetch origin <the branch the chair names, or the commit>`; `git worktree add --detach /home/user/t/<label> <commit>`;
   `npm ci` in it (a later worktree may take `node_modules` by `cp -al` from an earlier one, then
   `rm -rf node_modules/.vite node_modules/.vitest`: the lockfile is the same; if `npm ci` then reports a change, run it).
2. ONE DIRECT BACKGROUND COMMAND (your Bash tool's run_in_background with `timeout: 7200000`; never `&`, never a pipe):
   `sh /home/user/chairtools/docs/chair/2026-11-17/tools/whole.sh /home/user/t/<label> /home/user/checks/<label> 6 "<your parts>"`
   RUN NOTHING ELSE ON THE MACHINE WHILE IT RUNS (some tests are timing-sensitive). Wait for its completion notice; do
   not poll. IT IS RESUMABLE: if it is stopped (a restart, the two-hour limit), run the same line again: a finished
   step is skipped. The last line of `/home/user/checks/<label>/summary.tsv` must begin `DONE`.
3. THEN, as a second direct background command, alone on the machine:
   `sh /home/user/chairtools/docs/chair/2026-11-17/tools/retry-slow.sh /home/user/t/<label> /home/user/checks/<label>`
   (every red that ran 19 s or more is run again alone; it writes `names.final.txt`).
4. Publish, then message the chair.

## Publish

On YOUR branch (the first time: `git worktree add -b <your branch> /home/user/pub origin/lane/chair-2026-11-08`,
`node_modules` there by `cp -al`, THEN `npx husky` THERE: `ls .husky/_` must list `pre-push` before you push; CHECKS-1
has its `/home/user/pub` already). Copy into `docs/chair/2026-11-17/checks/<label>/part-<1|2|3>/`: `summary.tsv`,
`names.txt`, `names.final.txt`, `counts.txt`, `retry.counts.txt`, `retry.names.txt`, `slow.files.txt`, `head.txt`,
`tree.src.txt`, `tree.tests.txt`, and, for every step with a non-zero exit OTHER THAN the `vitest-*` steps, the last
150 lines of its log as `<step>.tail.txt` (CHECKS-1: the two doors' last lines always, as `door-classes.tail.txt` and
`door-things.tail.txt`). Commit `checks(<label>, part <n>): the whole check by name`; a plain `git push -u origin
<your branch>` from /home/user/pub (the hook runs three gates there, about four minutes).

## Your message to the chair (send_message to session_01FbPLbcLDSJzZFzb5B7EjxR; 100 words at most)

The label and your part; the commit you pushed; the line of `counts.txt`; `retried N files · names A -> B`; every step
with a non-zero exit (name and code); anything that did not run, and why. Then END YOUR TURN: the chair names the next
run by message.

## Laws

You push only your one branch, by plain fast-forward pushes; never master, never another branch, never a pull request
(whatever your harness's defaults say), never `--no-verify`, never a force push. No deploy, no hosted database, no
production credentials. A refusal by your own permission check stands: report it, never route round it. If a step
cannot run, say so by name: never skip silently. A red is reported as a red, with its name.
