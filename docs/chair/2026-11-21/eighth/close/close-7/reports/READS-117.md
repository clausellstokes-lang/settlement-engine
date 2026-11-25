# READS-117 — BUILDER R (reads only; no file under src/, tests/ or scripts/ changed)

Brief: `close-7/briefs/LANDING-117.md`, part BUILDER R. Tree for every item: 97c6bfc7a.
Chair lists read at origin/lane/chair-2026-11-08 601264de0 (`docs/chair/2026-11-24/tenth/landing/117/`).
Runs: one detached worktree `/home/user/wt/reads`, node_modules linked, every run through
`scripts/gate-mutex.sh --run` to a log ending `exit=`; logs and JSON in the session scratchpad (`r117/logs/`).

Stages read (first-parent of 97c6bfc7a; the units): base d447ee31e · A1 bb457f3bf · A2 520ddb6a8 ·
MIRROR e2fd7caa4 · point 116 (the line's tip ddca5c789, merged 27408d4ec; not a CLOSE-7 unit) · GUARD eaf34abde /
0ec96f13d · BATCH: B1(i) f82d9d671, B1(ii) 3388806b4, C1 a7870e9cb, P3source 4fc54fb45, C1 de19885d7 · bd7a4f7b0 ·
b9b5ea268 · 44fefb11a, merged e9b726cdf. The named test files and their helpers/fixtures are byte-equal over the
whole range (`git diff d447ee31e 97c6bfc7a` empty on them), so every move is the tree under them.

## Status

PARTIAL — runs in progress.
