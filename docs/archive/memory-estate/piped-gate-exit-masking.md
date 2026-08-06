---
name: piped-gate-exit-masking
description: "⚠️ HAZARD (bit three times) with a STRUCTURAL CURE @ 82e2ff08 2026-07-27: reading a gate through a pipe returns the PIPE's exit 0, not the gate's. Use `npm run check:tail` / `sh scripts/gate-tail.sh <cmd…>` — logs full output, prints tail, exits with the gate's own code."
metadata: 
  node_type: memory
  type: project
  originSessionId: ae4f7b77-b1b5-42f0-8576-af15b79688cc
  modified: 2026-07-28T02:28:21.935Z
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
