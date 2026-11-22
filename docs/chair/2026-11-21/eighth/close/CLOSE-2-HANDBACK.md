# CLOSE-2 — HAND-BACK (kept current at every push; last written 2026-11-22 17:55 UTC, read from `date -u`)

The close's second seat (prompt: the chair's seating message of 2026-11-22 17:41 UTC; it follows CLOSE-1, whose
`CLOSE-1-HANDBACK.md` section 0 is the map of the read-in). The chair: session_01ACmDYY29VRchM87v1yhL9Q (send_message).

## 0. WHERE THE SEAT STANDS (2026-11-22 17:55 UTC; the seat's count about 150,000)

| ref | tip | state |
|---|---|---|
| `lane/close-2-2026-11-22` (this lane) | this push | cut at CLOSE-1's 935c3d633; docs only (this hand-back, the re-run records under `close/close-2/`) |
| `lane/close-1-2026-11-22-join-wip` | a1319f388 | JOIN: E101's diff read whole by CLOSE-2; re-runs below |
| `lane/close-1-2026-11-22-golden-wip` | ba0e1c288 | GOLDEN-LIT: diff read whole by CLOSE-2; proofs running |
| `lane/close-1-lit-scratch-2026-11-22` | 217b628f3 | the lit ref (read only) |

THE WORKTREES ON THIS BOX (scratch; none is a lane): `/home/user/wt/join` (a1319f388, dark), `/home/user/wt/joinlit`
(217b628f3 with JOIN's seven test files checked out: a1319f388 plus exactly the three dial lines), `/home/user/wt/golden`
(ba0e1c288), `/home/user/wt/plant` (a `git archive` of a1319f388 for the plants). The scripts: the seat's scratchpad
`joinverify/verify.sh`, `golden/golden.sh` + `capture.mjs`, `stop1/graze.mjs`, `stop2/find.mjs`.

UNITS: (1) JOIN re-runs: plants and dark/lit six DONE (see `close-2/JOIN-RERUN.md`), `tests/lint` whole running.
(2) GOLDEN-LIT proofs queued. (3) loose ends: stop 1 read (one trouble line over the bar at thorp, its dark/lit cause
probe queued); stop 2's three places being rendered; unit 7's draft to be updated with the golden finding.
(4) the final census waits on "THE LINE IS READY <tip>". (5) the flip waits on "BUILD THE FLIP".
NEXT: "JOIN <commit>" to the chair when `tests/lint` ends.
