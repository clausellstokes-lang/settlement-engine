---
name: piped-gate-exit-masking
description: "⚠️⚠️ HAZARD (bit FOUR times, latest 2026-08-10) with a STRUCTURAL CURE @ 82e2ff08 2026-07-27: reading a gate through a pipe returns the PIPE's exit 0, not the gate's. Use `npm run check:tail` / `sh scripts/gate-tail.sh <cmd…>`. ⚠⚠ The 4th bite is a NEW SHAPE — `gate-mutex.sh --run … | tail` masked a GIVE-UP (status 3, default budget only 20 min) so the command NEVER RAN; under the concurrency law that is routine, and the tell is a ~180-byte log with no `Tests` summary beside a green exit."
metadata: 
  node_type: memory
  type: project
  originSessionId: ae4f7b77-b1b5-42f0-8576-af15b79688cc
  modified: 2026-08-10T18:20:13.301Z
---

Mechanism: in `cmd 2>&1 | tail`, the shell's exit status is tail's (0), and in a long
`npm run check` chain the failing step's output also scrolls out of the tail window —
so the gate reads green both by exit code AND by visible text.

**Two confirmed bites:**
1. `npm ci` EUSAGE on the w7-prep lineage read as success → [[worktree-npmci-eusage-node-modules-walkup]].
2. The town-layout-v2 fold (66eda8e8) landed 112 domain-strict errors with the gate
   believed green; red for a full day of build-out until [[domain-strict-burndown-shipped]]
   closed it (2026-07-17).

**How to apply:** run the ACTUAL gate script bare and read its own exit code —
`node scripts/check-domain-strict.mjs; echo EXIT:$?` — never through `| tail`/`| head`.
If output length forces a pipe, redirect to a file and tail the FILE, or `set -o pipefail`.
Fold/merge protocols must quote the gate's own verdict line + exit code as the receipt.
Note: check-domain-strict.mjs itself is SOUND (loud verdict line + fail-closed anti-vacuity
sentinel) — this failure mode is operator-side; no script hardening needed.

**Second confirmed bite (2026-07-26):** `npm run check:edge-behavior | tail`
reported exit 0 over a RED gate — `check-edge-behavior.mjs` exits
`r.status || 1` and the pipe swallowed it. Same cure: run unpiped, capture to a
file (`> out.log 2>&1; echo EXIT=$?`) and read the file.

**Third confirmed bite (2026-07-27):** hungry-driscoll's pre-push full gate read
through `npm run check | tail` captured exit 0 while 5 tests had failed and the
`&&` chain had stopped before build; caught only by grepping the log body.

**✅ STRUCTURAL CURE SHIPPED @ 82e2ff08 (2026-07-27, owner-ordered "fix these"):**
`scripts/gate-tail.sh` — logs the full gate output to `$TMPDIR/gate-tail.$$.log`,
prints the tail, and EXITS WITH THE GATE COMMAND'S OWN STATUS, with the code named
on its last printed line so truncation can't hide the verdict. `npm run check:tail`
wires the common case; the minifold CLAUDE.md now forbids bare-pipe gate reads.
Controls executed at ship: exit-3 command propagates 3; green command exits 0.
The convenient path is now the correct path — use it instead of ad-hoc pipes.

**⚠️⚠️ FOURTH BITE (2026-08-10) — A NEW SHAPE: THE MASKED STATUS WAS "NEVER RAN",
NOT "RAN AND FAILED".** `sh scripts/gate-mutex.sh --run -- npx vitest run <walker>
2>&1 | tail -60` reported exit 0. The gate-mutex script is SOUND — `run_held()`
returns **3** when it gives up waiting for the lock (scripts/gate-mutex.sh:268-272)
— and `| tail` converted that 3 into 0. The command after `--` never executed at
all.

Why this shape now recurs, and why it is worse than the first three: under the
CONCURRENCY LAW (two lanes, one gate, one worktree) a queued `--run` waiting behind
another lane's whole-census run routinely exhausts `GATE_MUTEX_MAX_POLLS`
(default 40 × 30 s = **20 minutes**, and a `check-test-ratchet.mjs` census can hold
longer than that). So the give-up is an ordinary event, not an exotic one.

**THE TELL IS THE LOG SIZE, and it is the same tell as
[[gate-mutex-run-mode-absent-at-old-shas]]:** ~180 bytes containing only
`gate-mutex: GAVE UP after 40 poll(s)` and the holder line — no `RUN v…` banner, no
`Test Files`/`Tests` summary. Two different causes, one signature: **a green exit
beside a log with no test summary is a run that did not happen.**

**How to apply:**
- Use `sh scripts/gate-tail.sh …` (or `npm run check:tail`). It exists precisely for
  this and was bypassed here.
- When waiting behind another lane, RAISE THE BUDGET EXPLICITLY:
  `GATE_MUTEX_MAX_POLLS=240 sh scripts/gate-mutex.sh --run -- <cmd> > out.log 2>&1;
  echo EXIT=$?` — unpiped, status captured directly.
- Before believing any gated green, `grep -c 'Tests ' out.log`. Assert the summary is
  PRESENT; never read the exit code alone.

Related: [[gate-mutex-run-mode-absent-at-old-shas]] (same tell, different cause),
[[concurrency-law-ruled]] (why give-ups are now routine).
