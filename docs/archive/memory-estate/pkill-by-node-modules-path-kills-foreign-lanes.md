---
name: pkill-by-node-modules-path-kills-foreign-lanes
description: "⚠⚠ NEVER `pkill -f` ON A node_modules PATH IN THIS REPO — every lane's archive/census tree SYMLINKS `node_modules` to the main worktree's, so vitest workers in EVERY tree show the MAIN worktree's absolute path in their argv. On 2026-08-10 an OSR repair lane killed the concurrent CR-TRFZ census lane's `check-test-ratchet.mjs --update` workers with `pkill -f \"minifold/node_modules/vitest/dist/workers/forks.js\"`, believing they were its own orphans. The blast radius was bounded ONLY because check-test-ratchet fails closed; a foreground Bash timeout (exit 143) ORPHANS children rather than killing them, which is what created the false 'my orphans' reading in the first place."
metadata:
  type: project
  date: 2026-08-10
  branch: claude/composite-r4
  originSessionId: 0e891b2f-8f5a-4f56-bc66-d7add755cac2
  modified: 2026-08-11T02:15:41.657Z
---

## What happened

An Opus reader-without-writer repair lane ran a probe through
`sh scripts/gate-mutex.sh --run -- npx vitest run <probe>`. The **10-minute Bash
foreground timeout** fired (exit 143), which killed the shell but **orphaned** the
vitest workers. Seeing `forks.js` processes whose argv carried
`/…/.claude/worktrees/minifold/node_modules/vitest/dist/workers/forks.js`, the lane
read them as its own orphans and ran:

```
pkill -f "minifold/node_modules/vitest/dist/workers/forks.js"
```

That killed **the other lane's** workers.

## ⚠⚠ WHY THE ARGV LIES

The concurrent lane's census tree was
`scratchpad/TRFZ/tree`, and per the recorded archive-census law it had
**`node_modules` symlinked to the main worktree's**:

```
scratchpad/TRFZ/tree/node_modules -> /Users/…/.claude/worktrees/minifold/node_modules
```

So its `npx vitest` resolved `forks.js` through the symlink and every worker in that
foreign tree advertises **the main worktree's absolute path**. The path in a worker's
argv identifies the `node_modules` it loaded from, **NOT the tree it is testing**.
There is no way to tell the lanes apart from that string.

The mutex was never mine: `sh scripts/gate-mutex.sh` reported
`HELD by atomic lock PID 96794: … check-test-ratchet.mjs --update`. **Inspect the
mutex BEFORE concluding a process is yours.**

## How to apply

- **Never `pkill -f` any pattern containing `node_modules` in this repo.** It cannot
  discriminate lanes.
- To kill only your own orphans, kill **by PID from your own job**, or by the parent
  you started (`ps -o ppid=`), never by a path substring.
- Before touching ANY process, run `sh scripts/gate-mutex.sh` — if it reports a
  holder that is not your command, every vitest worker on the box is presumed
  foreign.
- Long vitest runs go through `run_in_background: true`, never a foreground Bash
  call, precisely because a foreground timeout orphans rather than terminates.
- Prefer a **temporary git worktree** for base-state work and drive it under one
  `gate-mutex.sh --run` hold; then no orphan-hunting is ever needed.

## Why the damage was bounded (do not rely on this)

`scripts/check-test-ratchet.mjs` **fails closed**, which is the only reason a
corrupted baseline did not land:

- `--update` **REFUSES** and writes nothing when any failing test is absent from the
  census — "`--update` NEVER BANKS A NEW REGRESSION" (`:388`). Killed workers produce
  *new* failures, so the refusal path is the expected outcome.
- A no-report / unparseable-report / zero-tests run all fail closed (`:215-241`).
- The scope sentinel's count floor and `newUncollected` guard catch gross losses.

⚠ The residual risk is REAL: the `vanished` check is **deliberately not enforced
under `--update`** (`:342`, `if (vanished.length && !UPDATE)`), so a baselined-failing
test that disappeared from the report because its worker was killed would be silently
**DROPPED** from the census. Verified at the time: the baseline file was NOT written
(mtime unchanged, `git status` clean) and the census parent respawned workers and
continued — but any `--update` run that overlapped an external kill must be **re-run
on a quiet tree before its output is trusted**.

Related: [[archive-census-node-modules-leg]] (the symlink law that creates this trap) ·
[[session-scratchpad-is-shared-between-lanes]] · [[concurrency-law-ruled]] ·
[[step12-test-ratchet-landed]].
