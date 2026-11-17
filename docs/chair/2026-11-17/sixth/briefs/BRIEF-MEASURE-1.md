# BRIEF-MEASURE-1: the auditors' runners at two trees, rule by rule (before the supply rule lands)

You are MEASURE-1, a seat of the sixth chair (session_01FbPLbcLDSJzZFzb5B7EjxR). YOU CHANGE NO CODE. You render town
pages at two trees and count what the eight detectors find in each, rule by rule. This file is your whole assignment.

## The two trees

- L, THE WORKING LINE: commit ed1d43529bdfcf6e513bb2eb234c5a4c0305746d (`lane/join-2026-11-14`).
- M, THE LINE WITH THE SUPPLY RULE MERGED: in a scratch worktree at L run
  `git merge --no-ff --no-edit 8b0506eae` (the tip of `lane/birth-3-2026-11-17`; `git -c commit.gpgsign=false` is fine:
  this merge is local and NEVER PUSHED). It must be clean and `git rev-parse HEAD^{tree}` must read
  4a9735d2f9ed4ef8e21aa19ec145de2e719e11f0. If not: stop and tell the chair in one line.

Setup: `git fetch origin lane/join-2026-11-14 lane/birth-3-2026-11-17 lane/chair-2026-11-08`; worktrees
`/home/user/L` and `/home/user/M` (detached), `npm ci` in L, `cp -al /home/user/L/node_modules /home/user/M/node_modules`
then `rm -rf /home/user/M/node_modules/.vite /home/user/M/node_modules/.vitest`; the chair's lane at
`/home/user/chairtools` (detached). ALL WORK IN SCRATCH DIRECTORIES UNDER /home/user, never the main checkout.

## The render (the page as printed)

The tool is on the chair's lane: `/home/user/chairtools/docs/chair/2026-11-16/probes/PAGE-COPY/` (read its README.md:
30 lines). One command renders a seed list at a tree, the output OUTSIDE the repository:

    HOLDERS=<PAGE-COPY>/holders.tipA.json sh <PAGE-COPY>/census3.sh <tree> <out-dir> 4 --seeds <seeds file> --count-only

About five seconds a town at four workers. THE POPULATIONS:
- the thirty of the sixth read: `<PAGE-COPY>/seeds.bar0.txt`'s ten lines with `rand-1` replaced by `rand-42`, `rand-43`
  and `rand-44` (write the 30 lines to a file);
- the 150: `/home/user/M/docs/chair/2026-11-17/birth/birth3/seeds.w150.txt`;
- the 720 (the census): `<PAGE-COPY>/seeds.txt`.

ORDER, each as ONE direct background command (run_in_background; never `&`; ONE render at a time on the machine; wait
for each completion notice, do not poll): the 30 at L, the 30 at M, the 150 at L, the 150 at M; REPORT (below); then the
720 at M and the 720 at L, and a second report. A render dir must hold one dump a seed (`ls <out>/dumps | wc -l`) or it
did not finish: your machine may restart; run the same command again.

## The runners (eight detectors; each takes `<render-dir> <out.json>` and prints its counts)

In each tree: `docs/chair/2026-11-16/bar5/AUDIT/run-a.mjs`, `.../bar5/AUDIT/runB.mjs`,
`docs/chair/2026-11-16/bar6/AUDIT/runC.mjs`, `runD.mjs`, `runE.mjs`, `runF.mjs`,
`docs/chair/2026-11-17/bar7/AUDIT/runH.mjs`, `runI.mjs` (run from the tree's root: `cd <tree> && node <runner> <dir> <out.json>`).
`/home/user/M/docs/chair/2026-11-17/birth/birth3/runners.sh` shows the loop the last seat used.
RUN THREE COLUMNS for each population: (1) L's render read by L's runners; (2) M's render read by L's runners (the
detectors held still: what the PAGE changed); (3) M's render read by M's runners (what the detectors' own change adds:
`tests/helpers/markPromise.js` gained an exclusion, EX-BOUGHT).

## What you report

A table: one row per RULE of each runner (read each runner's JSON for its per-rule counts: instances and towns), the
three columns, for the 30 and the 150 (later the 720). Then, FOR EVERY RULE WHOSE COUNT RISES from column 1 to column
2 or 3: up to five instances (the town, the tab, the line as printed), and one sentence of what the page says there.
Also say for `runD`'s rule `8b.extract` and `8b.person` what moved and name the towns. Do not judge whether a rise is
a fault: print the lines; the chair rules.

Publish: branch `lane/measure-2026-11-17`, created by
`git worktree add -b lane/measure-2026-11-17 /home/user/pub origin/lane/chair-2026-11-08` (`node_modules` there by
`cp -al`, THEN `npx husky` THERE: it writes the hook directory `.husky/_`, without which the push hook does not run;
`ls .husky/_` must list `pre-push` before you push); files under `docs/chair/2026-11-17/measure/<L|M>/`: the runners' JSON outputs
gzipped, their logs, and `TABLE.md` (the table and the instances). Commit, then a plain
`git push -u origin lane/measure-2026-11-17` (the hook runs three gates, about four minutes).

Your message to the chair (send_message to session_01FbPLbcLDSJzZFzb5B7EjxR): 200 words at most plus the table's rows
THAT MOVED (not the whole table): the commit pushed, the rules that rose with their counts, the rules that fell,
anything that did not run. Then end your turn (after the first report: go on with the 720 and report again).

## Laws

You push only `lane/measure-2026-11-17`, plain fast-forward pushes; never master, never a pull request, never
`--no-verify`, never a force push; the local merge M is never pushed. No deploy, no hosted database. A refusal by your
own permission check stands: report it. Report exactly what ran; a number you did not see printed is not reported.
Budget: 250,000 of your count; if it runs short, publish what is done and say what is left.
