---
name: tree-mutants-contaminate-a-sibling-gate
description: ⛔⛔ NEVER plant a mutant in the shared tree — a foreground mutex wait times out and the mutant sits live through a sibling lane's whole gate run. Use an IN-SUITE spliced control instead.
metadata:
  node_type: memory
  type: project
  originSessionId: c42c8924-7331-45ab-a096-c5f1bc35f7d3
  modified: 2026-08-11T23:24:12.807Z
---

Caused and measured on 2026-08-11 (Lane T, census micro-act batch). This is an
incident report, not a theory.

## What happened

To prove two new pins were non-vacuous, two mutants were planted directly in the
shared worktree (`disposition.js` ladder rung drifted; `cartographyPaint.js`
throw arm replaced by a fallback), then a vitest run was launched **in the
foreground** through `scripts/gate-mutex.sh --run`.

The mutex was already **HELD by a sibling lane** running
`node scripts/check-test-ratchet.mjs` (a full-estate run). So the run never
acquired the lock — it just polled. The harness's 10-minute foreground Bash cap
then killed the waiter.

**Net effect: the two mutants sat live in the shared working tree for ~10
minutes, spanning essentially the whole of a sibling lane's full test-ratchet
measurement.** That lane's run saw a deliberately broken `disposition.js` and
`cartographyPaint.js`. Both files were restored and `cmp`-verified byte-identical
to HEAD afterwards, but the sibling's measurement was already contaminated.

## The two compounding failures

1. **A foreground mutex wait is a trap.** `gate-mutex.sh --run` waits up to
   `GATE_MUTEX_MAX_POLLS × GATE_MUTEX_POLL_SECONDS` (default 20 min), which is
   longer than the 10-minute foreground Bash cap. It WILL time out while waiting,
   before running anything. **Always launch mutex runs with
   `run_in_background: true`** and wait on the completion notification.
2. **A tree mutant is a shared-tree write.** In a worktree with concurrent lanes,
   the window a mutant is live is not "the duration of my test run" — it is "the
   duration of my test run PLUS however long I am blocked", which is unbounded.

## How to apply

- **Do not plant mutants in the shared tree at all.** Get the same proof with an
  **in-suite spliced control**: read the real source with `readFileSync`, splice
  the mutation into the STRING in memory, and assert the instrument reports the
  difference. It is strictly better — it executes on every gate forever instead
  of once, and it touches no shared file. Precedents now in the repo:
  `tests/domain/townCartographyPaint.test.js` C4 (spliced colour control) and
  `tests/domain/disposition.test.js` H14 ("THE SPLICED CONTROL — the extractor
  DOES report a drifted rung").
- For a throw-arm pin, the equivalent of a mutant is to assert the arm's OWN
  distinguishing message and pin the sibling arm's message beside it, so the case
  cannot be satisfied by the other arm.
- If a tree mutation is ever genuinely unavoidable: check
  `sh scripts/gate-mutex.sh` (inspect-only) FIRST and refuse to plant while it is
  held; back up with `cp`, restore with `cp`, and `cmp` against **HEAD**, not
  only against your backup.
