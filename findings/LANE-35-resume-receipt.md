# LANE 35 — review wave 2 — ⛔ GATE RUN COMPLETE, NOTHING PENDING

Branch `fix-review-wave2-2026-09-19`, cut at `13ab242e3`. Tip `1236b4134`, 11 cars.
Working tree CLEAN. Every gate below was run through the SHARED tier at 09:13–09:31 EDT.

| gate | files | tests | verdict |
|---|---|---|---|
| tests/store (6 files) | 6 | 53 | green |
| tests/components (12 files) | 12 | 87 | green (after cars 9 + 10) |
| tests/ui (8 files) | 8 | 74 | green |
| tests/lint walkers (11 files) | 11 | 100 | green (after car 10) |
| tests/lint OSR + typecheck baselines (5 files) | 5 | 198 | green (after car 11) |
| tests/generators (4 files) | 4 | 27 | green |
| tests/config · tests/copy | 1 · 1 | 24 · 8 | green |
| tests/pdf (whole) | 46 | 456 | green |
| generatorGoldenMaster, PLAIN | 1 | 3 | green — 525 rows byte-identical |
| `eslint src/ tests/ scripts/` | — | — | 0 errors, 36 warnings, none in this lane's files |
| `typecheck:ratchet` | — | — | 167 errors, ceiling 167, no regression |
| `typecheck:domain:strict` | — | — | 1113 errors, ceiling 1113, no regression |

THREE REDS WERE FOUND AND CURED IN THIS LANE'S OWN FILES (cars 9, 10, 11). One
register row moved and is re-recorded with its cause: `phoneChromeFloor.census`
`/settlements floored 991 -> 992` (car 3 mounts ClerkNote there; `bare` holds at 0).
NOTHING ELSE was refrozen — the OSR, the goldens and every baseline are unmoved.

⚠ NOT RUN HERE (no build in this lane): the first-paint closure budget and the
`tests/build` dist contracts. Car 3 adds primitives/RefusalNotice.jsx to HomeHero's
import graph, car 5 adds lib/generationIntent.js to SettlementsPanel's, car 8 adds
config/pricing.js to LandingBelowFold's. Watch the closure budget on the consist gate.

⛔ SHARED-TIER NOTE for the next lane: `gate-mutex.sh` refuses a shared-tier command
that declares no worker cap, and eslint/tsc take no `--maxWorkers`. The form that works
is `sh scripts/gate-mutex.sh --run -- sh -c 'npx eslint … --concurrency=2' --maxWorkers=2`
— the cap is declared to the mutex, the tool never sees it, and both are honest (eslint
was given `--concurrency=2`).
