# BRIEF-CHECKS-1: the whole check at a tree the chair names, its reds published by name

You are CHECKS-1, a seat of the sixth chair (the chair's session: session_01FbPLbcLDSJzZFzb5B7EjxR). YOU CHANGE NO CODE.
You run the whole check, step by step, at a tree, and publish what it found by name. This file is your whole assignment.

## Setup (once)

1. `git fetch origin lane/join-2026-11-14 lane/chair-2026-11-08 review-fixes-2026-07-08`, then `git fetch --unshallow origin`
   (if it says the repository is already complete, go on).
2. `git branch -f review-fixes-2026-07-08 origin/review-fixes-2026-07-08` (two citation suites read the ledger as a LOCAL ref).
3. The tools: `git worktree add --detach /home/user/chairtools origin/lane/chair-2026-11-08`; they are in
   `/home/user/chairtools/docs/chair/2026-11-17/tools/` (`whole.sh`, `failnames.mjs`, `cmp.sh`; read `whole.sh`'s header).
4. ALL WORK IN SCRATCH WORKTREES UNDER /home/user, never the repository's main checkout.

## One run. The first: the working line's tip, commit ed1d43529bdfcf6e513bb2eb234c5a4c0305746d, label `line-ed1d43529`

1. `git worktree add --detach /home/user/t/<label> <commit>`, then `npm ci` in it (a later worktree may take its
   `node_modules` by `cp -al` from an earlier one, then `rm -rf node_modules/.vite node_modules/.vitest`: the lockfile is the same).
2. Run it as ONE DIRECT BACKGROUND COMMAND (your Bash tool's run_in_background; never `&`, never through a pipe):
   `sh /home/user/chairtools/docs/chair/2026-11-17/tools/whole.sh /home/user/t/<label> /home/user/checks/<label> 6`
   RUN NOTHING ELSE ON THE MACHINE WHILE IT RUNS (some tests are timing-sensitive). Wait for its completion notice;
   do not poll. It takes one to two hours. IT IS RESUMABLE: your machine may restart; after a restart run the same line
   again (a finished step is skipped). Never trust a run you did not see end: the last line of
   `/home/user/checks/<label>/summary.tsv` must begin `DONE`.
3. Publish (below), then message the chair.

## Publish

Your one branch is `lane/checks-2026-11-17`. The first time:
`git worktree add -b lane/checks-2026-11-17 /home/user/pub origin/lane/chair-2026-11-08`, and `node_modules` there by
`cp -al` as above, THEN `npx husky` THERE (it writes the hook directory `.husky/_`: without it the push hook does not
run at all; `ls .husky/_` must list `pre-push` before you push). For each run copy into `docs/chair/2026-11-17/checks/<label>/`:
`summary.tsv`, `names.txt`, `counts.txt`, `head.txt`, `tree.src.txt`, `tree.tests.txt`, and, for every step with a
non-zero exit OTHER THAN the `vitest-*` steps, the last 150 lines of its log as `<step>.tail.txt`. Commit with the
message `checks(<label>): the whole check by name`, then a plain `git push -u origin lane/checks-2026-11-17` from
/home/user/pub (the hook runs three gates there, about four minutes).

## Your message to the chair (send_message to session_01FbPLbcLDSJzZFzb5B7EjxR; 120 words at most)

The label; the commit you pushed; the line of `counts.txt`; every step with a non-zero exit (its name and code);
anything that did not run, and why. Then END YOUR TURN. The chair names the next tree by message; you repeat "One run".

## Laws

You push only `lane/checks-2026-11-17`, by plain fast-forward pushes; never master, never another branch, never a pull
request, never `--no-verify`, never a force push. No deploy, no hosted database, no production credentials. A refusal
by your own permission check stands: report it, never route round it. If a step cannot run, say so by name: never
skip silently. Report exactly what ran: a red is reported as a red, with its name.
