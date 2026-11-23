# T5M HAND-BACK (VEIL-40, measures only, no cure; worktree /home/user/wt/t5, branch lane/veil-40-2026-11-23-t5-wip)

Written 15:48 UTC (`date -u`). Seated at 13:45 UTC on ADDENDUM 1 (the chair's N102).

## 1. STOPS
1. NOTHING RUN. The mutex order (/var/tmp/v18/out/v40/mutex-order.txt) said "T5M: WAIT (after SSKIP's count)" at every read
   from 13:45 to 15:47 UTC. The file was unchanged in that time: still "written 13:08", R5D-RIVAL GO, SSKIP NEXT. A watcher
   polled it every 30 s for two hours and reached its time limit. So no measure, arm or tooth exists yet: no tpl, smoke,
   towns, pool, insurg or an, no Tell6 run, no (vi) tooth run. No figure below is measured.
2. No cure was applied, as the addendum says. 212, the registry and the twin are untouched.

## 2. PREPARED (ready to run on "T5M: GO")
- q-an.mjs gains an "N102" section (WIP dd809dc4b). It only reads the existing records. Checked with `node --check` and
  with a dry run on an empty directory.
  - (v)(3) JOINT: births whose served page shows 2+ criminal imports. It gives two counts: the family alone, and joint
    (the same page serving exactly one criminal power, `crimP` length 1; the count for one or more is printed beside it).
    These are given for the q33i insurgency births, the pool's part-A insurgency towns and all pool part-A towns, with the
    rosters on those pages.
  - (v)(2): nothing-hidden town births (pool part A; q33i beside it) with a served page whose currentTensions list is EMPTY.
    It also counts births whose stored list is empty, no-signal births with an empty list, and the tension types that
    no-signal births hold, counted by birth.
- The sections already in the analyser cover (iv) on 117 and 136 (served rows with each end's class; B's rows), the (v)(1)
  precondition count for nothing-hidden city and metropolis births, and `bnAt` on 113 and 62 (both engines).
- Read whole: the addendum, T5-HANDBACK.md, q-chain.sh, q.sh, q.probe.jsx, q-an.mjs and galleryVeilTell6.pglite.test.js.
  The (vi) hunks were read as T5's diff. V33-Q's rule binds: a tooth is GREEN at the tip, and a red tooth is a STOP finding.
- The run order on GO: `sh scripts/gate-mutex.sh --run -- sh q-chain.sh tpl` (the tpl step carries no mutex of its own),
  then `q-chain.sh smoke`, `towns`, `pool`, `insurg` (each takes the mutex itself) and `an`. After those, Tell6 (red expected)
  and the two teeth, each run as `gate-mutex --run -- env -u GIT_* sh scripts/gate-tail.sh npx vitest run <file>` with
  R3_MEASURES set.

## 3. FOR THE OWNER
The checks are written and ready. They were never run, because the shared machine never gave this builder a turn in two
hours. Nothing a shared page sends has changed.

COMMITS: dd809dc4b (q-an.mjs); the closing WIP (this file). 212 unchanged since T5: sha256 a4df6dac94980172a30b161034563b490fae126da2a3aae13f0cc574a4c1a4b4.
