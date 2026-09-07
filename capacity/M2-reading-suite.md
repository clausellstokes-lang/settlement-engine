# M2 — THE READING SUITE ms (CAPACITY C2's unsized evidence item)

The item, re-derived: DESIGN_HORIZON.md §11.4 (snapshot line 1029), the CAPACITY row of
"Wall-clock added to the gate and to CI":

| CAPACITY `demographicsEnvelope.test.js` (+ the reading suite) | `test:ratchet` | <= 60 s (STOP S1 re-scopes the arms, never a conditional step); the reading suite ms | PLAUSIBLE |

C2's half of that row is "the reading suite ms" — named, never sized. Label in the design: PLAUSIBLE.

## MEASURED (solo, exclusive mutex tier, 2026-09-06 23:58:05 -> 23:58:11 EDT)
Command: `sh scripts/gate-mutex.sh --run -- npx vitest run tests/domain/demographicReading.test.js --reporter=verbose`

  Test Files  1 passed (1)
       Tests  8 passed (8)
    Duration  356ms (transform 152ms, setup 35ms, import 187ms, tests 12ms, environment 0ms)

  real 5.80   user 1.42   sys 1.68

FIGURE: 356 ms vitest-reported file duration; 12 ms of that is assertion execution.
        5.80 s wall including node/vitest process start and the mutex acquisition.
LABEL:  CONFIRMED (executed; output quoted above).
DIRECTION: report (a cost reading; no register cell shape exists for it — see the receipt).
VERDICT: the reading suite is a MILLISECOND item on the gate. The design's PLAUSIBLE
         placeholder is discharged; there is no cost question here.
