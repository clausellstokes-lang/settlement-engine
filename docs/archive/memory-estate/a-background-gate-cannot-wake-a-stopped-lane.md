---
name: a-background-gate-cannot-wake-a-stopped-lane
description: "⚠⚠ A lane that yields \"waiting for the gate\" is DEAD to that gate — no monitor, background task, or waiter re-invokes a stopped agent; it must outlast the run inside its own turn"
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 0e891b2f-8f5a-4f56-bc66-d7add755cac2
  modified: 2026-08-11T09:44:09.089Z
---

**FIRED FOUR TIMES IN ONE SESSION (2026-08-11).** A lane launches a long gate
(`npm run check`, a ~28,000-test ratchet step, a corpus scan), yields with "I'm blocked
on that run — the monitor and the background task will both fire on completion", and
**stops.** Nothing fires. The harness re-invokes an agent only while it has live
background children of its own; a detached gate process is not one. The lane sits
finished with its work uncommitted and its verdict uncollected until the chair notices.

Verbatim shapes seen: *"the monitor (task b47g62ive) and the background gate task will
both fire on completion"* · *"I'm blocked on its TRUE exit code with two independent
waiters armed"* · *"holding for that result before reporting"*. **Two "independent
waiters" is not redundancy — it is two things that cannot wake a stopped agent.**

**How to apply — for a lane:** never end a turn on a pending gate. **Outlast it inside
your own turn**: poll at bounded intervals in your own shell (watch the
`vitest`/`check-test-ratchet` processes and read the output file when they vanish), and
do not yield until you hold the TRUE exit code and tail. If the processes disappear with
no output, restart with `npm run check:tail` and carry THAT to its exit code.

**For the chair:** when a report says "waiting", **verify liveness before assuming
anything** — `ps aux | grep -E "vitest|check-test-ratchet" | grep -v grep | wc -l`. Then
either resume the lane with an explicit "collect it yourself" order (it keeps its
context, which re-dispatching would burn) or take the gate over. ⚠ Also ask whether any
edit landed AFTER the run began — a lane invalidated its own base receipt exactly that
way and disclosed it; **a green bound to a vanished tree is not a verdict.**

**Why: the failure is silent and expensive — the work is done, verified, and simply
never reported, so a board that looks busy is actually idle.** Related:
[[concurrency-law-ruled]], [[receipt-vacuity-and-shared-ratchet-rules]],
[[seamless-resume-directive]].

## ⚠⚠⚠ THE HARNESS ITSELF GREENWASHED A RED GATE (measured 2026-08-11)

**The task harness reported a lane's gate task as "completed (exit code 0)". The gate's
own `$?` was 1** — RED at `test:ratchet` with three real regressions. The lane caught it
ONLY because it captured `$?` directly to a file rather than trusting the reported
status, then carried the red to a cure and re-ran.

⚠⚠ **This is the greenwash class one level UP from the recorded pipe hazard, and it is
worse, because a harness status LOOKS AUTHORITATIVE in a way a piped exit code does not.**
The recorded rule was "never read a gate through a pipe"; it is now **"trust no exit
status you did not capture yourself"** — not a pipe's, not a wrapper's, and not the
harness's.

**How to apply:** every gate invocation writes its own `$?` to a file
(`...; echo $? > /tmp/gate-exit`) or runs under `scripts/gate-tail.sh`, which prints
"the gate's own status, not a pipe's". A lane reporting green must be able to say WHERE
its exit code came from. A chair verifying a lane's green should ask the same question.
