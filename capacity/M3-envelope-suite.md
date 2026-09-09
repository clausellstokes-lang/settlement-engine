# M3 — THE ENVELOPE SUITE <= 60 s (CAPACITY C3's unsized evidence item)

The item, re-derived: DESIGN_HORIZON.md §11.4 (snapshot line 1029) budgets
`demographicsEnvelope.test.js` at "<= 60 s (STOP S1 re-scopes the arms, never a conditional
step)", labelled PLAUSIBLE. §2.5 C3's own STOP S1 is the same bar:
"(S1) the envelope suite > ~60 s -> STOP and re-scope the arms (never a conditional step)".

## MEASURED (solo, exclusive mutex tier, 2026-09-06 23:58:16 -> 23:58:22 EDT)
Command: `sh scripts/gate-mutex.sh --run -- npx vitest run tests/domain/demographicsEnvelope.test.js --reporter=verbose`

  Test Files  1 passed (1)
       Tests  6 passed (6)
    Duration  1.14s (transform 269ms, setup 27ms, import 618ms, tests 391ms, environment 0ms)

  real 5.71   user 2.52   sys 1.71

Per-arm (verbose reporter):
  STATE MOTION                                   1ms
  DIFFERENTIATION                                1ms
  NO FLOOR                                       0ms
  THE ARRIVAL                                    0ms
  THE THIRTY-YEAR WINDOW CANNOT SEE THE RUNAWAY  192ms
  RESTORE: the real kernel is back               195ms

FIGURE: 1.14 s vitest-reported file duration (391 ms of assertion execution);
        5.71 s wall including process start and mutex acquisition.
LABEL:  CONFIRMED (executed; output quoted above).
BUDGET: <= 60 s. MARGIN: 52.6x on the vitest duration, 10.5x on the wall figure.
STOP S1: NOT TRIPPED.
DIRECTION: ceiling (60 s), measured far beneath it.
