# Realm endurance and scale evidence

This is the operating plan for long-horizon simulation evidence. It distinguishes
three things that were previously conflated:

1. a regression soak, which proves specific mechanical properties on one run;
2. a scale matrix, which repeats those proofs across realm sizes and horizons;
3. product certification, which may be published only after every property in the
   certification contract has evidence.

A passing process is not automatically a certification. The current composed soak
proves finite arithmetic, same-seed replay, different-seed divergence, bounded
population, a generous serialized-state envelope, and execution in a real isolated
Node worker thread. It reports stressor rhythm and stasis but does not yet prove
their desired behavior. Its aggregate receipt therefore sets
`certificationWritten: false`.

## Profiles

| Profile | Matrix | Purpose | Product claim |
|---|---|---|---|
| `smoke` | 1 year × 4 and 30 settlements × 1 primary seed | Fast harness and scale-shape check | None |
| `weekly` | 30 years × 4, 12, 24, and 30 settlements × 1 primary seed | Useful-horizon regression evidence | None by itself |
| `release` | 1, 30, and 100 years × every scale band × 3 primary seeds | Complete pre-launch performance and endurance matrix | Eligible only after the missing behavioral evaluators pass |
| `research` | 300 years × 12 settlements × 3 primary seeds | Attractor and very-long-horizon study | Research evidence, not a launch promise |

Every matrix cell also performs a byte-identical replay and a divergent-seed run.
The `seedsPerCell` column therefore counts primary seed families, not total child
processes.

Run the profiles with:

```sh
npm run soak:smoke
npm run soak:weekly
npm run soak:release
npm run soak:research
```

`--output <path>` changes the aggregate receipt location. `--dry-run` writes the
source-bound plan without executing the simulation.

## Evidence contract

`whole-world-soak.mjs` emits a receipt for one cell. The realm-scale runner:

- executes cells sequentially so CPU contention does not corrupt timing trends;
- stops on the first failed, malformed, or vacuous child receipt;
- records raw yearly timings, full-realm bytes, a same-thread structured-clone
  observation, and observed peak heap use;
- runs one additional one-year advance in an actual `node:worker_threads` isolate
  per matrix cell, importing `src/workers/advanceInterval.worker.js` and requiring
  its output hash to equal the direct domain run;
- reports the worker's cold request-to-result round trip and its in-isolate handler
  duration separately;
- calculates transparent p50/p95/max summaries;
- binds the aggregate to Git HEAD and to a content fingerprint that includes
  uncommitted and untracked simulation inputs;
- rechecks that identity before and after every child and at aggregate
  finalization, failing the matrix instead of combining mixed-source evidence;
- writes atomically and never mutates the committed certification manifest.

Wall time, clone time, worker duration, and heap use are host-sensitive
observations. Deterministic state hashes, finite-number scans, tick arithmetic,
population bounds, worker/direct output equality, and the serialized byte ceiling
are gates.

The isolated-worker measurement is actual execution, not a structured-clone
approximation: the receipt carries distinct parent/worker thread IDs, progress
messages, input/output hashes, and timings from both sides of the boundary. Its
transport is nevertheless Node `worker_threads`, not a browser Web Worker.
`boundaryAndBootstrapResidual` includes module bootstrap, scheduling, structured
clone, and message delivery; it is an arithmetic remainder, not exact transport
time. Browser startup and device-specific worker duration remain unmeasured until
the production browser journey can exercise a representative saved realm without
adding a test-only product API or a second simulation path.

## Remaining certification evaluators

Before a band can be called certified, the long soak must also evaluate:

- final-decade activity floors for each mover family;
- major-event tempo and class diversity;
- both constructive and destructive arc presence;
- continued population, prosperity, and power-topology motion;
- neighbor-perturbation divergence rather than only unrelated-seed divergence;
- succession integrity at volume;
- per-settlement attention fairness;
- chronicle legibility, with the manual sample identified as human evidence.

Those are behavioral additions to the maintained harness, not permission to create
a second simulation engine. Until they exist and pass, successful receipts remain
measurement evidence.

## Evidence retention and invalidation

The weekly workflow uploads receipts for 90 days. Release receipts belong in the
release evidence bundle. Any change under `src/`, `scripts/audit/`, or the dependency
manifests changes the source fingerprint and invalidates earlier certification for
that source state. Display-only changes can be judged separately only when their
fingerprint scope is explicitly narrowed in a future schema version.

The 30-year profile is the useful product horizon, 100 years is the strong
pre-launch endurance horizon, and 300 years is research. A 300-year run is valuable
only if it diagnoses behavior the 100-year matrix cannot; it is not a substitute
for breadth across supported realm sizes.
