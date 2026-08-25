---
name: ""
metadata: 
  node_type: memory
  title: DEEP COUPLINGS D-4 — THE CONTESTED GOALS CLASS shipped
  created: 2026-07-19
  updated: 2026-07-19
  status: shipped-not-folded
  branch: claude/deep-couplings-contest (base 49b145bb = claude/deep-couplings-mem tip)
  authority: docs/DESIGN_DEEP_COUPLINGS.md §8 (D-4a..f) + §1/§11/§13/§16
  originSessionId: c7979c3b-d9d7-48bb-a499-e2271011bf43
  modified: 2026-07-20T03:51:14.454Z
---

# DEEP COUPLINGS D-4 — THE CONTESTED GOALS CLASS (shipped, NOT folded)

⭐ Three commits on **claude/deep-couplings-contest** (tip **82c8095e**, base 49b145bb, DARK, NOT folded):
- **35f3dd6a** — the engine: contest leaf + state chokepoints + kernel/challenge threading + news registration + 29 unit pins.
- **efee4b79** — the contested-goals dormancy golden + lit anti-vacuity (7 tests).
- **82c8095e** — D-4c §10.5 the cross-faction loss loop: a cross-faction contest loss deposits a typed 'contest_loss' faction-pair incident (memoryWeave-gated) via factionPairLedger's OWN writer — closes loss→faction-pair-resentment→future-fixation.

## What shipped (all behind the virtual `contestedGoalsEnabled` flag, ABSENT from DEFAULT_SIMULATION_RULES)
- NEW lazy leaf `src/domain/worldPulse/npcLadderContest.js` (~509 eff lines / ceiling 800): genesis (settlement-wide collision scan), awareness/staleness/bluff, tunnel-vision fixation, the head-to-head resolution matrix, D-4f support goals + cascade + bond-joining, `advanceContests` orchestrator (plan-then-apply).
- The THREE state chokepoints in `npcLadderState.js` extended: `normalizeRecord`/`sortedRecord` gain the additive `contests` sub-key (drop-when-empty ⇒ byte-identical dark); `mirrorOf` projects a COMPACT DM-only live-contest summary. Additive optional fields: `goal.supportOf` (D-4f), `grudge.kind` (D-4c typed contest grudges).
- `npcLadderKernel.js`: `contestedGoalsActive` gate; `applyGoalLifecycle` now returns `{st, outcome}` and SKIPS support goals; the settlement-wide contest pass runs AFTER the per-faction loops (determinism disc i); the challenge pass reads the PRIOR tick's contests (cross-tick, law 14).
- `npcLadderChallenge.js`: `openWindows` gains the `contested_goal` reason; `resolveFactionChallenges` accepts `contestPairs`/`loserWindowNids`/`rateMultDir` (all null dark ⇒ byte-identical) and applies the tunnel-vision attempt-rate multiplier.
- News: `npc_contest`/`npc_support` registered in `settlementRumors.js` WHAT_PHRASES + `impactKindWalkers.test.js` EXPECTED_VOICE (deliberately unvoiced — the npc_ladder precedent). **RULE: any NEW impactKind minted in a beat MUST be added to both WHAT_PHRASES and the EXPECTED_VOICE manifest or `impactKindWalkers.test.js` reds.**

## Owner-visible shape (ContestRec, §14 Q2)
`spatialLedgers.npcLadder[sid].contests[id]` = `{ id:'contest.${sid}.${signalVar}.${openedWeek}', signalVar, kind:'convergent'|'opposed', a:{nid, verb?, awareSince, heardProgress, heardWeek}, b:{…}, openedWeek, backedBy:null|'a'|'b', resolvedWeek, outcome, loserNid }`. (Added `verb` per side + `loserNid` beyond the doc's literal shape — needed for robust opposed-resolution + the loser-window read; recorded as owner-visible.) Fork labels (hash01 over `worldState.rngSeed`, the challengeDraw idiom): `ladder-contest:aware/resolve/bluff:…` + tick-invariant `ladder-support:${sid}:${nid}:${year}`.

## ⚠ TWO VETOABLE DEFERRALS (engine side built, cross-layer producer/consumer held back)
1. **D-4e champion-npc STORE INPUT** deferred — `backedBy` engine consumption is BUILT + unit-pinned (margin + tie-break); only the UI/store producer (edit kind + EDIT_KINDS/COMMITTABLE_EDIT_KINDS + settlementSlice dispatcher + a `backedBy` marker conduit + operationRegistry + `gen:compendium-data` + `build:edge-shared`) is held back, to keep the lane to the ladder's own machinery + off the eager closure. Recipe = the reassign-npc/stasis-npc precedent.
2. **bluff→D-2 credibility CHARGE** deferred — the bluff mechanic (heardProgress inflation + contradicted-bluff-on-loss detection) is LIVE + pinned (`advanceContests` returns `bluffDeposits`); the new-sidecar deposit + `informationStatecraft` consume arm (a `deception` delta with `lieExposedBand`) are the deferred half. A new sidecar key needs a `spatialUsage.js` walker entry.

## ⚠ PRE-EXISTING REDS ON BASE 49b145bb (NOT mine — empirically confirmed at base)
The D-7 memory-weave base shipped with un-reminted goldens/baselines. At 49b145bb these FAIL independent of D-4: `beliefMapGolden`, `generatorGoldenMaster`, `pipeline.property`, `worldpulseDeityGolden`, `pdf/goldenViewModel`, `aiGroundingBundle.freshness` (a D-7 bundle input changed w/o `build:edge-shared`), `domainAnyCastBaseline` (any-holes in eliteBleed/factionPairLedger/relationshipEvolution/traditionsKernel, baseline not bumped), `spatialLedgerCoverage.walker` (D-2 `npcCredibility` sidecar unclassified in spatialUsage.js). Plus the full parallel suite is FLAKY (pglite init contention + the advancePauseResume re-entrancy test under load) — **isolate before trusting any full-suite failing set** (the resto2 rule). D-4's own surface is fully green in isolation.

## D-4 verification (CONFIRMED, executed)
29 contest unit pins + 7 dormancy/anti-vacuity + 59 existing ladder (dark byte-identical) + 138 ladder/credibility/contest + 80 security files (mirror projection leaks nothing) + impactKindWalkers + domain-strict 0 errors + build + closure budget (leaf in the lazy advanceInterval chunk ⇒ zero first-paint eager; +3 WHAT_PHRASES lines within budget). NO-DEATH: rung roster asserted a permutation every tick.
