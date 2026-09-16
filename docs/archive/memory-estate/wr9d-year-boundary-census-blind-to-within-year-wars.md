---
name: ""
metadata:
  node_type: memory
  created: 2026-08-04
  lane: "WR-9d (the WR-9 collector)"
  commits: "a70c9284, 1453676b"
  branch: claude/composite-r4 (worktree .claude/worktrees/minifold)
  status: WR-9d CLOSED; forceEvidence still empty (task #123)
  originSessionId: 1c189f3d-9fc3-4fc9-9cb7-b767525d28d5
  modified: 2026-08-04T13:20:33.380Z
---

# WR-9d — a year-boundary census is blind to within-year wars, and the war-lifecycle vocabulary

## Why this matters

A chair brief specified a collector that reads `worldState.deployments` at each
YEAR boundary and calls a war closed when its key disappears. Built exactly as
briefed, it reported **an empty world** on the soak's own fixture. The design was
measured wrong and replaced. Any future "sample state at the interval boundary"
instrument in this engine is suspect for the same reason.

## 1. ⚠️⚠️ THE MEASUREMENT

On `scripts/audit/whole-world-soak.mjs`'s own fixture (`full_simulation`, spatial
canon on, seed `w0-soak`, 4 settlements), measured 2026-08-04:

- `worldState.deployments` is **EMPTY at every year end, for ten straight years**.
- The same run selects **15 `strategy_deploy` outcomes** and 2 `army_deployed`.
- Observed war open/close ticks: **7 to 9, 10 to 13, 21 to 24** — wars live
  2 to 14 ticks, and a year is 52.

So the wars open and close *between* boundary samples. A year-boundary census is
blind precisely to SHORT wars — which is the exact population WR-9's "most wars
short, some long, a few generational" envelope is about. It would have shipped an
instrument whose headline reading was 0.

⚠️ THE SPATIAL CANON IS WHAT HIDES THEM, and it is only in the soak fixture. With
`buildWholeWorldSoakSpatialCanon` OFF, the same seed produces one war that spans a
year boundary (`soak-b -> soak-c`, sinceTick 32, gone by tick 104) and the ledger
census "works". A probe that omits the spatial canon will therefore CONFIRM a
broken design. Always probe the real fixture.

## 2. THE WAR-LIFECYCLE VOCABULARY (measured, use it — do not re-derive)

Both live in `src/domain/worldPulse/warDeployment.js`:

- **OPEN** — `ruleId: 'war_layer_strategy_deploy'`, id minted at :1204 as
  `world_outcome.strategy_deploy.${stablePart(attacker)}.${stablePart(defender)}.${tick}`
- **CLOSE** — `ruleId: 'war_layer_war_exhaustion'`, id minted at :645 as
  `world_outcome.siege_abandoned.${stablePart(attacker)}.${stablePart(defender)}.${tick}`

⚠️ `war_exhaustion` is TWO populations. It carries the siege-abandoned withdrawal
AND the ordinary "nurses its war wounds" cost beat. Never treat the candidateType
as a close — match the `siege_abandoned` id family.

⚠️ WORLD OUTCOMES DO NOT CARRY `generatedAtTick`. Only the `candidate.strategy.deploy.*`
records do. The tick of a `world_outcome.*` is recoverable ONLY from its id.

## 3. HOW TO READ A TICK OUT OF AN ID WITHOUT SPLITTING IT

The razing law (never split a published id on `.`; settlement ids may contain dots)
applies here too. The cure used in `scripts/audit/war-convergence-collector.mjs`:
**re-mint the PREFIX for each known ordered pair, test `startsWith`, and only then
read the remaining tail — which must match `/^\d+$/`.**

`stablePart()` is LOSSY (`Vale-Keep` and `vale_keep` both mint `vale_keep`), so two
distinct settlements can collide onto one prefix. The collector detects the
collision and counts that war with an **unmeasured** duration rather than
attributing it to a guess.

## 4. THE ENGINE CLOSES WARS ON NO WR-9 ROAD AT ALL (flag-state finding)

At HEAD's `full_simulation`, every observed close is a feasibility-collapse
`siege_abandoned` — a war ending PHYSICALLY, not on any of WR-9's eight ending
keys. The verification cell reports 3 closes, 3 `no_terminal_evidence`, endings mix
all-zero. That is the honest reading and must NOT be "fixed" by mapping
siege-abandoned onto `exhaustion`: that key requires the `exhaustion` PEACE REASON
(peaceReasons.js), and inventing it plants the false receipt
`warEndingClassifier.js`'s own header exists to prevent.

Also measured: `warTerminationEnabled` is **false** in `full_simulation`, so
`warTerminationReads` is empty and the deciding-term histogram is all-zero at HEAD.
The seven `WAR_RULINGS_FLAG_KEYS` are all false/undefined there; `warLayerEnabled`
and `peaceEngineEnabled` are TRUE, which is why wars happen at all.

## 5. TWO DEAD THINGS WR-9d MADE LIVE

Measured at `cb1ea74f`, before the lane:
- `foldWarEndings` had **NO production consumer** — its only callers were its own test.
- `UNCLASSIFIED_MAX_SHARE` appeared **EXACTLY ONCE in the whole repository**: its own
  declaration. It had no consumer because the observation had no address for an
  unreadable close. v5's `endingsUnclassified` + the new
  `war_convergence.endings_classified` cell are what made it grade something.

## 6. ⚠️ `warConvergenceContract.js` IS ON A WORLD-BYTE PATH

`src/domain/worldPulse/warTermination.js:52` imports `WAR_TERMINATION_DECIDING_TERM_KEYS`
from it. So the same-seed law binds on edits to that certification module, even
though it looks like a pure grader. WR-9d discharged it two ways: statically (the
imported symbol is byte-identical base vs HEAD) and by executed per-year world
hashes on the war-exercising fixture (3/3 identical).

Conversely, a certification module must NOT import worldPulse — that drags the war
chain into the behavioral oracle's bundle, which is how the dist chunk-cycle TDZ
class starts. That is why the collector lives in `scripts/audit/`, beside
`behavioral-observation.mjs` and `story-mix-divergence.mjs`.

## How to apply

- Before building any interval-boundary sampler, probe the REAL fixture and count
  the events between boundaries. Boundary sampling in this engine loses short-lived
  state routinely.
- Reach for the outcome stream (`result.candidates/selected/autoApplied/majors`),
  which `advanceInterval` accumulates across every interior tick and returns on the
  composed year result. Only `pulseHistory` is collapsed to the final tick — so
  anything riding the PULSE RECORD (`warTerminationReads`) is a declared 1-in-52
  sample, while outcomes are full resolution.
- Recover ids by prefix RECONSTRUCTION, never by splitting; handle `stablePart`
  collisions as a lost reading, not a guess.
