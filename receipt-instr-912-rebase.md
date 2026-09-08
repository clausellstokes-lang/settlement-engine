# RECEIPT — INSTR-912 REBASE: the nine code cars carried onto the product tip `f3ab08f51`

Seat: Opus 5 — Fable-unvalidated · Lane: INSTR-912 (rebase) · dock `$SC/laneINSTR2`.
A claim without its executed tail is not a claim. Every fenced block below is command output
I saw, pasted verbatim.

## 0. ARRIVAL — the three conditions, executed

```
$ date
Tue Sep  8 01:54:06 EDT 2026
$ V=vit; V2=est; pgrep -fl "$V$V2" | wc -l
       0
$ ls $SC/HOLD-VITEST
ls: .../scratchpad/HOLD-VITEST: No such file or directory
$ git -C $SC/laneINSTR2 rev-parse HEAD
f3ab08f5194201d19f99f8905068783b62fbfaf8
$ git -C $SC/laneINSTR2 status --porcelain | wc -l
       0
$ git -C $SC/laneINSTR2 status -sb | head -3
## HEAD (no branch)
```
Target dock detached at the PRODUCT TIP, porcelain 0, zero runners, no hold file.
SOURCE dock `$SC/laneINSTR` @ `ee403e8ab` — read-only for the whole of this lane.

