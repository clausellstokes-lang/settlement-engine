# SKEPTIC — §911 / CAP-HORIZON-909 · LENS: THE PROCESS AND THE FENCES
Seat: Opus 5 — Fable-unvalidated. Read-only on every tree and dock. Every figure below
came from a command executed in this session whose output I read.

Dock porcelain BEFORE 0 (10:58:05 EDT) · AFTER 0 (11:06:26 EDT).
Dock HEAD before and after: 3b1c0eaa51f77561a036ae7ec54682c39856192c.

## (a) THE FENCES — VERIFIED NOW
| check | measured | verdict |
|---|---|---|
| dock HEAD | `3b1c0eaa51f77561a036ae7ec54682c39856192c` | CONFIRMED |
| dock `log -1 --format=%ci` | `2026-09-07 08:11:03 -0400` (BEFORE the lane's 08:35 arrival) | CONFIRMED |
| porcelain (`--untracked-files=all`) | 0 | CONFIRMED |
| reflog top 8 | last commit 08:11:03, §910 capsule car; no lane commit | CONFIRMED |
| `stash list` | one entry, dated `2026-06-15 14:07:07 -0500` — predates by ~3 months, not this lane's | CONFIRMED (R7 intact) |
| `pgrep -fl whole-world-soak` / `gate-mutex` / `vitest` | rc=1 on all three (none alive) | CONFIRMED |
| `/tmp/settlementforge-vitest-gate.502.lock` | `No such file or directory` — released | CONFIRMED |
| dock `artifacts/` | does not exist — no receipt written into the dock | CONFIRMED |

R7 ("no product byte moved") is CONFIRMED on every arm I could execute.

## (b) THE THREE RUNS — TRUE_EXIT AND WALL CLOCKS
`grep TRUE_EXIT` on the three logs returns `TRUE_EXIT=0` three times (lines 64, 56, 64).
Each log's own `SOAK START` / `SOAK END` lines, and each artifact's mtime, agree:

| run | log START → END | receipt mtime | receipt bytes | claimed | verdict |
|---|---|---|---|---|---|
| 30y×12s LIT | 08:38:44 → 08:47:44 | 08:47:43 | 1,043,214 | 9 m 00 s | CONFIRMED |
| 600y×4s LIT | 08:51:02 → 10:05:54 | 10:05:54 | 10,496,438 | 1 h 14 m 52 s | CONFIRMED |
| 30y×12s DARK | 10:08:33 → 10:18:34 | 10:18:34 | 1,018,350 | 10 m 01 s | CONFIRMED |

pid files: 23543 / 29037 / 44903, mtimes 08:38:44 / 08:51:02 / 10:08:33 — each equal to its own
launch instant. Mutex holders in the logs: 23547, 29041, 44907; all three acquired
"after 0 atomic poll(s) + 0 legacy poll(s) + 0 shared-drain poll(s)". The dark log's ARGV
carries no `--lighting` token; the two lit logs carry `--lighting demographicsEnabled=true`.
`runDurationsMs` read off all six receipts reproduces every timing figure in the receipt
(2239561/2230837/13819 · 244623/241917/37195 · 271395/267012/44912 · §907 762290 · §909 55243 · §909 dark 66679).

## (c) THE pgrep FALSE POSITIVE — REPRODUCED WITH AN INDEPENDENT CONTROL
`gate-mutex.sh:61` and `:85` both spell `/tmp/settlementforge-vitest-gate.$(id -u).lock` —
verified by reading those lines. "vitest" is a substring of that path.

Control (a `python3` sleeper, NOT the lane's `tail`, so the reproduction is independent):
baseline `pgrep -f vitest` = 0 → with the sleeper alive, `pgrep -fl vitest` printed the
python process and the count read 1 → after `kill`, back to 0.

DIRECTION CLAIM. "Over-matching gives false positives but never a false zero" is logically
sound as far as the mechanism goes: an over-matching predicate's match set is a superset of
the true set, so a count of 0 forces a true count of 0. I also tried to induce a false zero by
argv truncation (padded argv at 4 KB, 50 KB and 150 KB with the token last): `pgrep -f` still
matched at every size. PARTLY, not CONFIRMED, because the estate-wide sentence "every
`vitest: 0` stands" needs a second premise the control does not establish — that every real
vitest process carries the literal token in its argv. That premise is plausible and untested.

## (d) THE QUIET-WINDOW LOGS — SAMPLES QUOTED VERBATIM ARE ACCURATE
Every sample the receipt quotes reproduces exactly: M1 log samples 1–3 (2.73, 2.07, 2.22, all
vitest 0); sampler B samples 3/4/5 (3.25, 2.51, 1.87); sampler A samples 13/14/15 (3.15, 2.47,
1.88); M1b SAMPLE 6 at 08:50:54 `vitest: 1 | gate-mutex procs: 12`; M2dark SAMPLE 74 at
10:08:25 `vitest: 1 | gate-mutex procs: 12`; M2dark samples 72/73 at 2.30 and 2.41.
The sampler is `quiet-sample.sh`, which builds V from `pgrep -f 'vitest' | wc -l` — the idiom
under discussion.

⚠ ONE CORRECTION. The M1 window is genuinely three consecutive clean minutes on two
independent samplers. The DARK twin's is TWO (samples 72 and 73); sample 71 at 10:05:25 still
read `gate-mutex procs: 1` because M1 had not yet released. The receipt does not claim three
for the dark twin, but a chair summarising "all three launches met the three-sample law" would
be wrong.

## (e) THE RETROVALIDATION ROWS R1–R13
All thirteen are calls a MEASUREMENT lane may make and a chair may ratify — none touches a
product byte, a register, a dial or a gate. Three carry defects.

RATIFIABLE AS WRITTEN, evidence checked: R1 (run order; the mutex serialises either way, so the
inversion is free), R2 (no `--case-id`; `cellKeyOf` is at `register.mjs:65` as cited), R6 (the
seeds differ between the 300y and 600y runs — both seed strings read off the receipts confirm
it), R7 (fences, above), R8 (the dark twin measured not inherited — its own receipt exists),
R9 (prediction miss: 1809 s predicted, 2,239,561 ms measured = +23.8 %; the model's 300-year
self-check integrates to 754.5 s against 762.29 s = 1.0 % — I re-did both integrals),
R10 (cross-run ×1.4691 = 0.9332/0.6352 vs seed-controlled ×1.1787 = 0.9215/0.7818; the ×1.25
over-statement is 1.469/1.179 = 1.246), R11 (the third-category answer; both readings
reproduced — see below), R12 (the two plateau definitions; I re-ran `settlementShapeOf` from
the dock and got `other/plateau/plateau/other` against `capacity_plateau` convicting all four).

R3 — PARTLY. The control is real and I reproduced it independently. The over-claim is the
absolute "never a false zero" for the DETECTOR, when what was proven is that THIS defect
cannot cause one (see (c)).

⛔ R5 — REFUTED IN ITS LOAD-BEARING WORD. R5 says `k = 1.358` comes from "TWO settlement counts
at ONE horizon on ONE seed". The two points are on DIFFERENT seeds and materially different
fixtures, read off the receipts:
  · 30 y × 4 s LIT  = seed `w0-soak`, realm starts at **16,814** souls (4 settlements)
  · 30 y × 12 s LIT = seed `realm-scale-research-lit-4s-30y-12s-seed1`, realm starts at **64,815**
The ×4.446 cost ratio therefore spans a ×3.855 population difference, not a ×3 settlement
difference. This is the same confound R6 and R10 exist to name on the HORIZON axis, unnamed on
the SETTLEMENT axis. R4 inherits it ("×1.482 from 4 to 12" is stated without the seed caveat).

⛔ R13 — PARTLY. soak-b's hairline is real and reproduced (drift 0.0502 against 0.05). But it is
not the only one on this receipt, and the one left unflagged is the sharper of the two:
`settlementShapeOf` grades **soak-c** `plateau` by a margin of **0.25 heads** (|305 − 320| = 15
against 5 % × 305 = 15.25) — one more soul at year 600 flips it — and `population.soak-c.shape`
is a register **`exact`** figure, where a flip is a hard register finding.

## THE TWO ARITHMETIC DEFECTS IN THE PRICED CELL
⛔ 1. `rate(4,300)` seed B = **0.8051 s/sy** is REFUTED. Summing the 600-year receipt's own
`yearlyMs[0..299]` gives **938.16 s over 1,200 settlement-years = 0.7818 s/sy**. 0.8051 is not
any 300-year prefix of that series (it is the rate of a ~341-year prefix). The lane's OWN
extract prints 0.7818 at `M1-600y-extract.txt:201`, so the receipt's final table contradicts
its own instrument. Consequences, recomputed: the seed spread is **+23.1 %**, not +26.7 %;
`rate(12,300)` tops out at **1.1586**, not 1.1933; SOAK-1's total ask reads **≈ 4.0–4.9 h**,
not ≈ 4.0–5.1 h. The "7× to 9× less than ≈ 35 h" headline SURVIVES (35/4.89 = 7.2).

⛔ 2. Caveat 4's "the seed band … is the largest single term" is REFUTED. Re-deriving `f_S(12)`
with a same-fixture-family 4-settlement denominator, from the two long runs' own `yearlyMs`
first-30-year prefixes:
```
rate(4,30)  w0-soak        0.4585 s/sy   → f_S(12) = 1.4820   (what the receipt uses)
rate(4,30)  §907 world     0.5259 s/sy   → f_S(12) = 1.2921
rate(4,30)  600-year world 0.6339 s/sy   → f_S(12) = 1.0719
```
The denominator choice moves f_S by ×1.38 — larger than the ×1.231 seed spread the receipt
names as the largest term. The direction is favourable: ×1.4820 is the most pessimistic of the
three, so the priced cell falls rather than rises (SOAK-1 total 3.5–4.3 h on the §907-family
denominator, 2.9–3.5 h on the 600-year world's own). The headline survives; the caveat list is
incomplete and one of its rankings is wrong.

## WHAT I INDEPENDENTLY RE-EXECUTED AND CONFIRMED
Running the dock's own `evaluateReceipt` from `scripts/soak/evaluate.mjs` (read-only import,
cwd in my scratchpad) on three receipts:
```
600y LIT : deterministicFirings 4 · notExecutable [] · observability [] · annotated.fullInstrument true
           four capacity_plateau findings, detail strings identical to the receipt's
30y DARK : deterministicFirings 0 · notExecutable [] · annotated.fullInstrument true
§907 300y: deterministicFirings 1 · annotated.fullInstrument FALSE · both series rows NOT-EXECUTABLE
           capacity_realm_load fires: "realm load 0.4787 outside the plateau window [0.6, 1.05]"
```
So §910's D1 (the shipped-300-row proof, quoted from the ledger row at 29a4ff20d) IS discharged,
and §907's receipt genuinely lacked the series. C1 stands.

Recomputed from the 600-year JSON without the lane's instrument: `yearlyPopulations` 600×4 and
`yearlyDiedFlags` 600 rows; plateau drifts 0.1554 / 0.0502 / 0.3203 / 0.4615 against mid=y300;
century means 2708.8 → 3154.6 (×1.165) → 3518.2 (×1.299) → 4045.1 (×1.493) → 4333.9 (×1.600)
→ 4355.0 (×1.608), so the "+0.5 % at century 6" saturation claim is exact; prefix rates
0.6772 / 0.7329 / 0.7818 / 0.8392 / 0.8880 / 0.9215; `loadRatio01` 0.6443 at y300 and 0.7251 at
y600; decades outside [0.6, 1.05] are exactly y200–y280, y360–y390 and y470 (min 0.4843 at y230);
five of the six 50-year marks from y350 inside the 5 % band and none of the five before it.
Every one of these reproduces the receipt to the digit.

The ≈ 35 h and ≈ 17.6 h design figures are real: `$SC/capacity/DESIGN_HORIZON.snapshot.md`
line 1068 states SOAK-1's ask as the 300 y × 12 s LIT cell plus the DARK twin at ledger figures.

## TWO SMALLER PROCESS NOTES
· `docs/DESIGN_HORIZON.md` is NOT in the dock at 3b1c0eaa5 (`git ls-files | grep -i horizon`
  returns only `tests/domain/memoryHorizon.test.js`); it lives on the ledger branch. The lane
  read the §907 snapshot instead, which is correct — but the brief's artifact list is wrong
  there, and a chair told to "check the design in the dock" will find nothing.
· The same design snapshot (line 338) already carries **"9.1 s/settlement-year measured at 12s"**.
  The receipt reconciles the ledger's 17.6 h/case figure by name but never mentions this
  pre-existing 12-settlement rate, while framing the settlement-count datum as first-taken.
· Three orientation citations land on the doc comment rather than the statement:
  `tripwires.mjs:426` (the `requires` array; :427 is the horizon line, which is right),
  `whole-world-soak.mjs:169` (the `--settlements` clamp), `register.mjs:53` (`CENTURY`).
  Every other cited line I checked is exact, including `soakInvariants.mjs:158/165/172`.
· The dark/lit ratio at 4 settlements is quoted twice in one receipt as ×1.207 and ×1.2120
  (single-run vs two-run-average denominator). Both are derivable; only one can be cited.
