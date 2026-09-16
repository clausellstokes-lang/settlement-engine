---
name: wr9-partial-build-and-stops
description: "WR-9a REPAIRED @ 06c58f69/43b3195b (PASS); WR-9c/9d owed with the collector-totality obligation (N3); durable facts — virtual-key persistence shift, horizon ruling CR-WR9-C, lint-red-at-base"
metadata: 
  node_type: memory
  type: project
  originSessionId: 1c189f3d-9fc3-4fc9-9cb7-b767525d28d5
  modified: 2026-08-04T13:57:32.372Z
---

# WR-9 — convergence instrumentation: state + the three STOPs (2026-08-04)

## FINAL: WR-9 COMPLETE AS AN INSTRUMENT (the acceptance VERDICT stays owner-held)

Cycle 46 landed WR-9c (@ 7a3c51ef+, six force cells with PASS/FAIL/UNOBSERVED-
with-reason) and WR-9d (@ a70c9284+, the collector counting its FIRST REAL WARS —
3 in the verification cell). The verifier REJECTED on exactly ONE row — WR-9d's
new negative pin was un-anchored against a ceiling-0 walker — repaired by the
chair inline @ d91e3ea0 (suite 7/7; walker violation rows for the file: 1 → 0).
Two lessons from that single row: **the anchor walker honors `// anchored:` ONLY
on the assertion's own line or the line IMMEDIATELY above** (a comment block with
the anchor at its top does not count — measured); and **a failure-set diff BY
FILE NAME cannot see COUNT growth inside an already-red walker** — diff the
violation rows, not the failing-file names.

Cycle-46 rulings/facts (full detail in the ledger @ c0ae5eb7/1453676b):
- **CR-WR9-D**: the chair's force-2 premise was FALSE — the floor exists as
  `WAR_DEMOGRAPHIC_TUNING.CAPABILITY_FLOOR` (demographicsWar.js:78, wave P4);
  the brief's grep set searched CAMPAIGN_FLOOR, never CAPABILITY_FLOOR. The
  WZ-3 hazard class (ruling built on an unverified read) recurring — lanes are
  right to re-measure chair premises.
- **J-WR9D-2 ⚠️⚠️ THE YEAR-BOUNDARY CENSUS WAS BLIND TO WITHIN-YEAR WARS**: the
  briefed deployment-ledger census reported an EMPTY WORLD while fifteen armies
  marched (wars live 2-14 ticks of a 52-tick year). Replaced with the OUTCOME-
  STREAM census (tick-exact durations). ⚠️ the SPATIAL CANON (soak-fixture-only)
  suppresses boundary-spanning wars — a probe WITHOUT it "confirms" the broken
  design.
- Observation v4→5: `endingsUnclassified` + `endings_classified` cell (the
  WR-9r blindness one dimension over — made the dead UNCLASSIFIED_MAX_SHARE
  constant live) + `decidingTermSampling` declared IN THE RECEIPT (1-in-52).
- The endings mix is HONESTLY all-zero at HEAD: every observed close is a
  feasibility-collapse `siege_abandoned`; mapping it onto `exhaustion` was
  REFUSED (would plant a false receipt). Five of eight ending keys are reachable
  only through unlit channels — CHANNEL_COVERAGE names each with its reason.
- war_convergence_instrumented is now UNEARNABLE until force 3 grows substrate
  (owner-gated: needs a war identity on a persisted seat-transition record,
  which WR-9's lifecycle clause forbids) — deductively forced, disclosed, and
  the certificate honestly refuses.
- Owed later: #123 WR-9e (force-1 evidence via the war-termination receipt's
  homeFrontDurationBand — flag-gated 1-in-52 sample).

## State

**WR-9a REPAIRED @ 06c58f69 + 43b3195b — verifier PASS ("WR-9a STANDS REPAIRED"),
both directions executed** (lost corpus fails, restored corpus passes; specificity
proven: ONE lost duration reds ONLY duration_measured). Vocabulary gained a fifth
cell `unmeasured` (appended LAST — positions stable); `WAR_DURATION_LENGTH_BANDS`
is an INDEPENDENT envelope denominator (kills the self-referential-denominator
class); the router refuses coercion BEFORE classifying (⚠ `Number(null)===0` and
`Number('')===0` reach 'short' through COERCION, not the non-finite arm — a
Number.isFinite-only guard would have left them defaulting). Observation v2→3
(J-WR9R-2, nothing orphaned — measured). Still owed: **WR-9c** (six-force cells)
+ **WR-9d** (the collector).

Verifier's forward notes to carry into WR-9c/9d:
- **N3 ⚠️⚠️ THE COLLECTOR-TOTALITY OBLIGATION**: nothing obliges WR-9d to route
  every close through `warDurationBandFor` — a collector that DROPS an unreadable
  close leaves unmeasured at 0 and restores the cured blindness by another road.
  Structural pin owed: every counted close lands in EXACTLY ONE histogram cell and
  sum(histogram) == close count.
- N1: the forces docstring's "except this sentence" is off by one since the ledger
  row landed (same class as finding 3) — one-phrase in-place repair.
- N2: `duration_measured` passes VACUOUSLY on an all-zero histogram — a green
  there must never be read as "the instrument ran" (non_vacuous is that wall).
- N4: `warDurationBandFor` has ZERO production consumers until WR-9d (mutants
  prove pin quality, not runtime protection); the string 'Infinity' → 'unresolved'
  routing is intended but unpinned.
- Methodology (bit twice in one lane): **a diff of two EMPTY streams exits 0** —
  BSD sed choked and emptied both sides, printing a green receipt over nothing;
  assert both sides non-empty before believing any diff exit code.

## Chair rulings (vetoable)

- **CR-WR9-A**: unmeasurable durations get their own `unmeasured` counter +
  a `war_convergence.duration_measured` wall failing on any unmeasured > 0
  (threshold revisitable WITH EVIDENCE at the tuning wave); **Infinity routes to
  `unresolved`** — an infinite duration IS the alive-at-horizon case, not a lost
  measurement. Envelope shares compute over measured bands only.
- **CR-WR9-B**: docstring truth in place (the V4D convention — a false sentence
  may not stand with the correction elsewhere).
- **CR-WR9-C** (for WR-9d, recorded not implemented): the no-infinity criterion
  binds at the OWNER-ORDERED SOAK REDO's full horizon — when the collector lands,
  the evaluator feeds ALL instrumented cases (release + research), the unresolved
  wall keyed to each case's own horizon. Cures STOP #2's contradiction
  (behavioralContract.js:1051-1054 feeds only releaseCases = 100y, while the
  criterion names year-300 = the research horizon).

## ⚠️⚠️ STOP #1 durable fact — DECLARING A VIRTUAL PRESET KEY MOVES NEW-CAMPAIGN SAVES

The conquestDoctrineEnabled certification-row repair passed every focused gate,
then same-seed measurement moved BOTH cells by exactly +32 bytes/year — the
persisted simulationRules blob gaining the key. The world did not move; the SHAPE
did. **The five sibling keys' rationale comments claim declared-false changes
nothing — TRUE for installed saves, FALSE for the new-campaign hash** (each
sibling moved it the same way when landed). Repair built, measured, REVERTED
UNSHIPPED; ⛔ OWNER-GATED (persistence shape): certify WR-8's flag row at the
cost of +1 persisted boolean on new campaigns, or leave WR-8 uncertified — two
arms in the ledger @ d7a6a16b. Until ruled, subsystem totality reports FULL while
WR-8's whole lane is uncertified (invisible to the machine built to find that).

## ⚠️⚠️ STOP #3 — tests/lint is RED AT BASE (program-level, no lane's)

32 tests / 11 files at 98edbc9f (stale shrink-only ratchets, warDeployment 16→17
inherited from WZ-4, three SP-6 war kind-pool walkers = 17 of 32) +
mechanismLitCoverage 2 (warEconomyEnabled vs empty baseline). **NO full
`npm run check` can go green until dispositioned** — must be settled before any
full-gate wave-end run or the terminal phase.

## The collector (WR-9d) is OPEN, not blocked — a scout premise disproven

Scout P9 claimed no per-tick data path exists (collector would need a forbidden
persisted ledger). **MEASURED FALSE**: advanceInterval.js:508-514 accumulates
candidates/selected/rollExplanations/etc across EVERY interior tick and returns
them on the composed year result (:607-613); only pulseHistory is collapsed.
A harness-side endings/duration census needs ZERO engine surface. ⚠️ The
DECIDING-TERM histogram is a 1-in-52 SAMPLE (warTerminationReads ride the pulse
record — only year-final receipts survive); the collector must DECLARE that.
⚠️ tests/ops/storyMixDivergence.test.js:120/:127 source-pin two exact strings in
whole-world-soak.mjs the collector must repair same-edit.

## WR-9c substrate notes

Force 1 live (warCosts.js durationGain), force 4 live (compromiseRound.js, 145
eff, ONE consumer), force 6 partial (candidateType conquest/razing; `annihilation`
exists nowhere). ⚠️ Force 2's "P4 capability floor" returned ZERO greps under
every spelling — may not exist as a declared floor. Force 3 needs
seat-transition↔war-duration correlation — nothing computes it. Each cell
reports UNOBSERVED-with-reason rather than being omitted. behavioralContract.js
sits at 795/800 — compose cells inside the evaluator's returned array (spread at
:1050-1053), never grow the oracle.
