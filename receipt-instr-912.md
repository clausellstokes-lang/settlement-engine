# RECEIPT — LANE INSTR-912 (the instrument cars) — **PARTIAL**
Seat: Opus 5 — Fable-unvalidated
Lane: INSTR-912 · dock `$SC/laneINSTR` (detached at the product tip) · opened 2026-09-07 18:43 EDT (`date`)
Brief: `$SC/briefs/brief-INSTR-912.md`
Status: **PARTIAL — in progress.** Sections are appended as each car lands. A successor resumes from the dock's tip + the last landed car below.

## 0. ARRIVAL CHECK — CONFIRMED
```
$ git -C $SC/laneINSTR rev-parse HEAD
3b1c0eaa51f77561a036ae7ec54682c39856192c        # == the required product tip
$ git -C $SC/laneINSTR status --porcelain | wc -l
0
$ ls -A $SC/laneINSTR/node_modules | wc -l
453
$ date
Mon Sep  7 18:43:23 EDT 2026
```
All three arrival conditions met. No deviation.

### 0.1 HAZARD FOUND AT ARRIVAL (new; worth the index)
The brief's pre-vitest gate command **self-matches**. Run literally:
```
$ pgrep -fl vitest | grep -v gate-mutex | wc -l
7          # <-- FALSE. Zero runners were live.
```
`pgrep -f` matches full command lines, and the shell running *my own* check has the literal
string `vitest` in its cmdline (the Bash tool evals the command string), so the check counts
itself and its pipeline members. The honest form splits the pattern so it cannot appear
literally in the caller's cmdline:
```
$ V=vit; V2=est; pgrep -fl "$V$V2" | wc -l
0          # CONFIRMED: zero vitest runners
```
This lane uses the split-pattern form before **every** vitest run, together with
`ls $SC/HOLD-VITEST` (absent at arrival). CONFIRMED.

## 0.2 CAR PLAN (the brief's order; each with focused proofs green before the next)
| # | Car | Gates? | Planned landing |
|---|-----|--------|-----------------|
| 1 | The entry walker (CLERK-LAWS §2): C1–C6, FAIL/WITHHELD/NOTE, composed-fill licence, 4 Brackwater fixtures, anti-vacuity guard on the 4 live breaches | yes (lint suite) | pending |
| 2 | The B-GRAMMAR walker (MOVE-GRAMMAR §4 as amended): arms A–J, the owner's three numbers, the ten §J gaps, a negative control per arm, per-paragraph re-measurement (report only) | yes | pending |
| 3 | The loaders in the wave's order (chronicle, R5, R4b, R6, R7, D-d, chrome pools) | no | pending |
| 4 | The derived, unpersisted institution table (CLERK-LAWS §1/§1.5) | no | pending |
| 5 | The presence measure + the unrendered-facts census (report only) | no | pending |
| 6 | D8's ledger walker (report only) | no | pending |

