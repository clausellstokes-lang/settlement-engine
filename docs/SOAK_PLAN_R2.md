# Realm endurance and scale evidence

This is the operating plan for long-horizon simulation evidence. It distinguishes
three things that were previously conflated:

1. a regression soak, which proves specific mechanical properties on one run;
2. a scale matrix, which repeats those proofs across realm sizes and horizons;
3. product certification, which may be published only after every property in the
   certification contract has evidence.

A passing process is not automatically a certification. The composed soak proves
finite arithmetic, same-seed replay, different-seed divergence, bounded population,
a generous serialized-state envelope, and execution in a real isolated Node worker
thread. Contract v2 now also records and evaluates mover activity, event rhythm,
arc polarity, state motion, neighbour propagation, succession, attention, dark
controls, and cross-family composition.

The runner still never edits the committed certification manifest. Every aggregate
therefore keeps `certificationWritten: false`; a completely passing release matrix
plus its signed human Chronicle sample changes only
`claimBoundary.manifestEntryEligible` to `true`. Publishing the manifest entry is a
separate, reviewable operation.

## Profiles

| Profile | Matrix | Purpose | Product claim |
|---|---|---|---|
| `smoke` | 1 year × 4 and 30 settlements × 1 primary seed | Fast harness and scale-shape check | None |
| `weekly` | 30 years × 12 settlements × seed family 1 | Useful-horizon regression at the representative realm size | None by itself |
| `release` | 1-year scale sweep at 4/12/24/30; 30 years × 12 at seed families 1/2; 100 years × 4 at seed 1 and × 12 at seed 2 | Orthogonal scale, useful-horizon, and endurance evidence | The only profile eligible for a product certificate |
| `research` | 300 years × 12 settlements × seed family 1 | Attractor and very-long-horizon study | Research evidence, not a launch promise |

Every matrix cell also performs a byte-identical replay and a divergent-seed run.
The matrix table counts primary runs, not total simulation passes. Every cell adds
the same-seed replay, a bounded divergent-seed run, and one isolated one-year
worker check. Three designated release cells also add a same-seed neighbour probe
and an all-dark one-year control.

The release profile is deliberately orthogonal, not a duration × scale × seed
Cartesian product. Scale is swept at one year; the useful 30-year horizon gets two
representative seed families; the 100-year duration question is exercised at the
smallest and representative scales. On the current audit host, seven one-year
cells took about 39 minutes. Linear extrapolation puts this eight-cell release
profile in the order of hours (potentially tens of hours), not the several
days-to-weeks implied by the former 36-cell grid. Actual duration remains
host-sensitive and the receipt, not this estimate, is authoritative.

Run the profiles with:

```sh
npm run soak:smoke
npm run soak:weekly
npm run soak:release
npm run soak:research
```

`--output <path>` changes the aggregate receipt location. `--dry-run` writes the
source-bound plan without executing the simulation.

The release run produces automated evidence first. After a person reads the
Chronicle sample, attach the review without repeating the long simulation:

```sh
node scripts/audit/realm-scale-certification.mjs \
  --profile release \
  --review-existing \
  --output artifacts/soak/release.json \
  --human-review artifacts/soak/release-human-review.json
```

`--review-existing` fails closed if the current source identity differs from the
source-bound aggregate or if a referenced case receipt is missing.

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
  uncommitted and untracked simulation inputs, including the maintained synthetic
  FMG pack fixture consumed by the headless spatial canon;
- rechecks that identity before and after every child and at aggregate
  finalization, failing the matrix instead of combining mixed-source evidence;
- writes atomically and never mutates the committed certification manifest.

Each primary run additionally emits a versioned behavioral observation:

- every selected outcome's type, major/minor status, broad mover family, arc
  polarity, explicit causal parents, and settlement targets;
- annual population, prosperity-rung, governing-faction, and normalized
  faction-power-entropy vectors;
- pending succession proposals, actual applied attempt/completion counts, and
  power-seat integrity failures;
- a bounded eight-entry Chronicle sample per year, with late-decade prose retained
  for human review.

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

## Behavioral contract v3

The machine-readable source of truth is
`src/domain/certification/behavioralContract.js`. These gates were fixed before a
release result was observed. They are conservative regression floors, not desired
means and not permission to auto-tune the simulation.

All rates use settlement-time denominators. "Per 100 settlement-years" means one
settlement simulated for 100 years, ten settlements for ten years, or any
equivalent exposure.

| Property | Release gate |
|---|---|
| Mover activity | Ten broad families (`pressure`, `place`, `population`, `economy`, `politics`, `war`, `faith`, `people`, `constructive`, `knowledge`) each produce at least 0.25 classified events per 100 settlement-years; each appears in the final decade of at least 25% of century cases; no family exceeds 65% of classified activity. Unknown outcomes remain unclassified rather than being forced into a passing family. |
| Event tempo and diversity | 0.25–52 selected events per settlement-year; 0.25–20 major events per settlement-decade; at least 12 event types; effective inverse-Simpson diversity at least 4; no type exceeds 55% of events. |
| Constructive and destructive arcs | Each polarity produces at least 0.25 explicit arc signals per 100 settlement-years, appears in at least 25% of century cases, and remains present in the final decade. Classification uses committed event vocabulary; a generic positive population delta is not promoted into an "arc." |
| State motion | Population changes by at least 0.25% on 5% of settlement-year transitions (2% in the final decade); prosperity moves a canonical rung on 3% (1% final decade); governing identity or faction-share distance moves on 2% (1% final decade); median per-settlement normalized power-entropy range is at least 0.03. |
| Neighbour perturbation | Three same-seed probes across at least two scale bands and two seed families. One source settlement begins at +10% population; the source is excluded from the distance. Non-source state distance must reach 0.001 by year 30, be positive at two checkpoints, and retain at least half its observed peak. Release probes are fixed at 30y/12/seed1, 30y/12/seed2, and 100y/4/seed1 (the latter compares its first 30 years); the research seed1 probe runs the full 300 years. |
| Succession integrity | At least 0.05 **applied** attempts and 0.02 applied completions per settlement-decade; completion share 5–95%; zero duplicate governing identities, invalid faction powers, multiple governing factions, or governing names absent from their faction roster. Pending succession proposals are reported separately and earn no attempt/completion credit. |
| Attention fairness | At least 90% of century cases attain Jain fairness 0.70 with no settlement above 4× its case mean; no more than 5% of settlement/case members receive zero selected-event attention across the century. |
| Dark controls | Three one-year, all-dark probes across at least two scale bands and two seed families, attached to the same designated release cells as the neighbour probes. Every boolean mover gate is false, propagation is off, migration is void, patron/cult/latent deity activation is removed, and the spatial-canon marker/digest are stripped. The lit first year must be non-vacuous; the dark year must emit zero selected outcomes and no non-empty conditional mover ledger. |
| Anomaly and composition | Burst years are at most 5% and p99 event load is at most 80 events per settlement-year. Explicit cross-family causal edges occur at least 0.10 times per 100 settlement-years, span at least three ordered family pairs, and remain below 50% of selected events. This proves coupled consequences without accepting a cascade storm as "depth." |
| Human Chronicle review | A human reviews at least 30 retained entries from both 100-year cases, spanning the 4- and 12-settlement bands and seed families 1 and 2, including the final decade. Causal legibility, temporal coherence, settlement attribution, and arc readability must each pass; blocking notes must be empty. |

The neighbour metric is a normalized mean over non-source population distance,
prosperity-rung distance, faction-power entropy distance, and governing-identity
change. It proves state sensitivity propagated through a relationship, not merely
that two unrelated seeds differ.

The anomaly gate and the cross-family gate are intentionally paired. A busy world
does not earn credit for composition merely by emitting many simultaneous events:
the outcome must name a causal parent in a different mover family.

### Preliminary observer check on the launch-tail source

A one-year, four-settlement diagnostic was run after the audit-only raw
Wizard-News capture was added. It is **not** a release-matrix cell and cannot
earn or fail the product certificate, but it confirms that capped terminal feed
state no longer hides post-apply outcomes. The observer retained 52 post-apply
receipts and found 21 constructive mover signals (23 constructive arcs total);
the earlier zero-constructive reading was instrumentation loss. Its zero-knowledge
reading was also an audit-fixture artifact: that historical run stamped
`canonizedAt` but carried no spatial-canon marker/digest, so the belief plane was
constitutionally dark. The v3 fixture now authors a real deterministic spatial
canon through the production digest seam. The replacement v3 diagnostic observed
two knowledge signals, proving the plane is reachable.

The same diagnostic also exposed source behavior that must not be normalized
away: 1,198 selected events equal 299.5 events per settlement-year against the
signed maximum of 52, and 25 authoritative major events equal 62.5 per
settlement-decade against the signed maximum of 20. It recorded 239 explicit
cross-family edges over four ordered family pairs. Its schema-v2 count of 18
"succession attempts" is superseded: that observer included selected-but-pending
government proposals, which v3 now reports separately from applied attempts and
completions. The correct next step is source-level tuning followed by the complete
release matrix; the thresholds remain unchanged. Receipt SHA-256:
`38f680d19ad993ea6902776200d056d40b6c5ccc05497dbc5cc9a1ee785b5613`
(historical behavioral observation schema v2; not eligible under v3).

The replacement v3 diagnostic remained mechanically deterministic and worker-
identical, but it did not clear tempo: 1,210 selected outcomes and 33 majors over
four settlement-years. It reported 32 pending succession proposals separately
from 0 applied attempts and 0 completions. The pending-proposal hold prevents an
equivalent unresolved question from being re-selected; this first-year count is
therefore a set of distinct questions, not evidence of 32 failed transfers.
Receipt SHA-256:
`965905fbf05ac10a1a29f056aa76c1fda148ffbcb0d69e783dac4588e7cdf75f`
(behavioral observation schema v3).

## Human Chronicle receipt

The reviewer supplies a source-bound JSON record. `sampleCaseIds` must be the
canonical IDs in the release aggregate; the validator checks their horizon, scale,
and seed breadth.

```json
{
  "schemaVersion": 1,
  "kind": "human_chronicle_review",
  "reviewerKind": "human",
  "reviewer": "stable reviewer name or id",
  "reviewedAt": "2026-07-28T12:00:00.000Z",
  "sourceCommit": "40-character Git commit",
  "verdict": "pass",
  "entriesReviewed": 30,
  "sampleCaseIds": [
    "release-100y-4s-seed1",
    "release-100y-12s-seed2"
  ],
  "includedFinalDecade": true,
  "criteria": {
    "causalLegibility": "pass",
    "temporalCoherence": "pass",
    "settlementAttribution": "pass",
    "arcReadability": "pass"
  },
  "blockingNotes": []
}
```

An automated prose score may accompany the record as a diagnostic, but it cannot
set `reviewerKind: "human"` and cannot mint the human evidence property.

## Evidence retention and invalidation

The weekly workflow uploads receipts for 90 days. Release receipts belong in the
release evidence bundle. Any change under `src/`, `scripts/audit/`, or the dependency
manifests changes the source fingerprint and invalidates earlier certification for
that source state. Display-only changes can be judged separately only when their
fingerprint scope is explicitly narrowed in a future schema version.

The 30-year profile is the useful product horizon, 100 years is the release and
endurance horizon, and 300 years is research. A 30-year pass cannot mint a
certificate. A 300-year pass cannot widen the promise or compensate for a failed
100-year release matrix. The research result is valuable only when it diagnoses
attractor behavior, late divergence, or Chronicle decay that the breadth-first
release matrix cannot expose.
