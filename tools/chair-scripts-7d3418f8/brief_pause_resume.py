# -*- coding: utf-8 -*-
"""LANE-EM-BUILD.md: the owner's pause-and-resume practice written into the shared build brief (2026-09-19 17:1x)."""
import io, sys

p = sys.argv[1]
t = io.open(p, encoding="utf-8").read()

a = t.index("3. **Focused gates (§10)**")
b = t.index("4. **The standing instruments")
NEW3 = (
"3. **⛔ GATED RUNS ARE PAUSE-AND-RESUME (the owner's normative practice, restated 2026-09-19 17:05: the five seats are FOUR WORKING LANES + ONE GATE/SUITE SEAT — "
"\"once a build has gone to the point where it's waiting on the suite or a gate it is paused and waits until it's resumed for its turn\").** A GATED RUN is anything that runs vitest, eslint, "
"the typecheck, a build, `verify:dist` or `check:packet`. You NEVER sit waiting for the lock. When you reach a gated batch: (a) finish EVERY edit the batch needs; (b) write "
"`$SP/lane-<ID>-build-scratch/<ID>.lane-resume.md` (in your SCRATCH, never in the worktree — `git status` must stay exactly §7) — the batch's exact commands in order (ONE TEST DIRECTORY PER "
"INVOCATION), the paths edited so far, and what remains after the batch; (c) STOP: end your turn with the single line `PAUSED AT THE GATE — <the note's path>`. The chair resumes you "
"(\"the gate is yours\") when the gate seat is free; you run the note's batch straight through and carry on, and you stop the same way at the next gated batch. A RED-FIRST proof is its own "
"batch (tests written → pause → the red quoted → implement → pause → the green). Inside your window every vitest command still goes through the mutex, SHARED tier, worker-capped, because the "
"chair's own terminal may hold it: `GATE_MUTEX_TIER=shared GATE_MUTEX_MAX_POLLS=100000 GATE_MUTEX_POLL_SECONDS=20 sh scripts/gate-mutex.sh --run -- npx vitest run --pool=threads --maxWorkers=2 "
"<explicit files>`. Quote every count line. ⛔ A gate line with no printed test count DID NOT RUN (the mutex's default gives up after 40 polls and EXITS 0 — never drop the two exports). "
"NEVER `npm run check`, `npm run test`, `test:ratchet`. Ungated work (reading, editing, plain `node` probes, `git`, the seal of verb 1, `shasum`) never pauses.\n"
)
t = t[:a] + NEW3 + t[b:]

old7 = "7. **Seal checks BEFORE the commit:**"
assert t.count(old7) == 1
t = t.replace(old7, "7. **Seal checks BEFORE the commit (part of your LAST gated batch — `check:packet` runs gated steps):**", 1)
io.open(p, "w", encoding="utf-8").write(t)
print("LANE-EM-BUILD.md: verb 3 is pause-and-resume")
