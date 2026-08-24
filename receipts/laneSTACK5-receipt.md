# TE-STACK-5 receipt — LANDING COMPLETE, GATE GREEN

SLOT `86794b5d2480d6bf7821aa390a82f99f4babeeca` (re-read at every proof boundary; never moved).
**STACK TIP = `510c51b766a4ef329a697d61f3006e23d4fb2325`**, pinned at `refs/preserve/holding-stack5`.
No ref CAS'd, nothing pushed, no pin deleted. `holding-ch3` and `holding-cg2` untouched.

## GATE — FULL, BARE, at the COMMITTED TIP
```
TRUE_EXIT=0
[gate-tail] exit: 0 (the gate's own status, not a pipe's)
[gate-tail] full log: /var/folders/0l/_sz6gzvd11x6sthjy1jdj0_80000gp/T//gate-tail.55055.log
free disk at end: 13,279 MB
[implementation-packets] valid: 177 packets (0 READY)
[typecheck-ratchet] OK — no type regressions (173 error(s), ceiling 173).
[domain-strict] ✓ no strict-type regressions (1134 errors, ceiling 1134).
✖ 29 problems (0 errors, 29 warnings)          <- lint, non-fatal
[test-ratchet] OK — no test regressions (11 known failure(s) of 29044 tests, ceiling 11).
[test-ratchet] STRICT DIST OK — 53 discovered/reported file(s), 458 test(s), zero
  failed/non-run/uncollected/missing/extra/duplicate rows.
```
29,044 against the slot's 29,029 = **+15**, exactly the census title delta.
⚠ The gate-tail log was identified BY MY WORKTREE PATH (`grep -aq laneSTACK5-tree`), never by
mtime — exactly one of the 40+ shared-TMPDIR logs matched.

## CENSUS — 2,524/366/2,158/21,002/5,845 -> 2,525/366/2,159/21,017/5,847
CH-3 `+1/+0/+1/+10/+1` · CG-2 `+0/+0/+0/+5/+1`, each measured at its OWN seam with ONE lifted
classifier over three checkouts; the slot reading reproduces the published tuple exactly.

## Environment
`npm ci` (589 added, 468 top-level), `.husky/_` PRESENT so pre-commit ran; `eslint` exit 0 and
`--fix` rewrote NEITHER edited JS file (md5 identical), so the hook was inert and both commits
were re-proved at the committed tip.

## Commits
`6d48e58d8` integration · `510c51b76` the census row.
