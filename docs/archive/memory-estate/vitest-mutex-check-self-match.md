---
name: vitest-mutex-check-self-match
description: "⚠️⚠️ The gate mutex check `ps aux | grep -c \"[v]itest\"` SELF-MATCHES when any other part of the same command line contains the word vitest (an echo label is enough) — a phantom holder costs up to 40 minutes of scripted sleeping per agent per gate run; run the check STANDALONE and never believe a count without visible pid lines"
metadata:
  node_type: memory
  type: project
  created: 2026-08-06
  originSessionId: 0be2ac61-89a4-425a-9361-67c3f5ab1681
  modified: 2026-08-06T10:26:09.093Z
---

# The gate-mutex check self-matches, and the false positive is expensive

Reproduced 2026-08-06. This program serializes test runs behind a machine-wide
mutex because two concurrent vitest lanes produce FAKE reds that lanes have then
"repaired" (the failure recorded in [[generation-remediation-gate-state]]). Every
build brief therefore gates a gate-run on `ps aux | grep -c "[v]itest"` and sleeps
while the count is positive.

The bracket trick stops grep matching *its own pattern* — and it does that
correctly. What it cannot stop is `ps aux` also listing **the shell running your
command**. If any other part of that command line contains the literal string
`vitest` outside the bracket class, grep matches your own shell and the count
reads `1` with nothing running.

**The measured trigger** was an innocuous progress label in a compound command:

```sh
... && echo "=== vitest lanes ===" && ps aux | grep -c "[v]itest"     # prints 1
ps aux | grep "[v]itest"                                              # prints NOTHING
```

The count said 1; the standalone listing showed no process at all.

**Why it is expensive rather than cosmetic:** build agents are briefed to sleep
60s and re-check up to 40 times before running a gate. A phantom holder therefore
burns **up to 40 minutes per agent per gate run**, across every lane, waiting on a
mutex nobody holds. It is a throughput bug that hides as patience — nothing errors,
nothing reds, the lane just looks slow.

**Why:** `grep -c "[v]itest"` answers "how many lines of `ps aux` output contain
the word", and `ps aux` output includes the command line of the process asking the
question. The bracket class only removes the *pattern literal* from that line; it
does not remove any *other* occurrence of the word you put on the same line. A
count is a measurement of text, never evidence of a running process.

**How to apply — both halves are load-bearing:**

1. **Run the check STANDALONE.** No `&&`-compound, no `echo` label, no
   description string, nothing else on the line that could contain the word.
2. **On ANY positive, read the ACTUAL PROCESS LINES before believing it:**
   `ps aux | grep "[v]itest"`. If it prints no process lines, the mutex is FREE —
   proceed immediately. Only a visible pid counts as held. **A count alone is
   never sufficient evidence.**

The same shape bites any self-referential process check (`grep -c "[n]ode"`,
`pgrep -f` with a labelled compound). Treat "the checker appears in its own
haystack" as the general class.

## ⏳ The structural cure is OWED and DELIBERATELY DEFERRED

The correct fix is a `scripts/gate-mutex.sh` helper in the build tree that every
brief invokes instead of re-spelling the check, so the class has no habitat —
one spelling, audited once, with the pid-listing check built in.

It is **deliberately deferred — documented, not a bug to re-find** — to the
cycle-4 landing boundary rather than written mid-cycle, because adding a file to
the build worktree while two build lanes are mid-wave is not worth the collision
risk ([[concurrency-law-ruled]]: one worktree, exact-census files merge
green-but-wrong). Until it lands, the two-part manual cure above is the standard.

Related: [[concurrency-law-ruled]] (the mutex this check enforces — one gate slot,
one machine) · [[generation-remediation-gate-state]] (records "parallel-load reds
are FAKE; `ps aux | grep vitest` first" — the practice this hazard undermines) ·
[[app-shell-suite-census-and-app-prefix-grep-trap]] (the sibling grep-census trap:
an undelimited pattern silently matching a longer token) ·
[[lane-end-gate-gotchas]].
