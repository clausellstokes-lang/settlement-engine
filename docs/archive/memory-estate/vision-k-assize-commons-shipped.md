---
name: ""
metadata: 
  node_type: memory
  title: "Vision lane V-K — THE ASSIZE + THE COMMONS' VOICE shipped (V-22 + V-23, dark)"
  date: 2026-07-20
  tags: 
    - vision-wave
    - engine-lift
    - assize
    - commons-voice
    - cohesion-law
    - dark-flag
    - dormancy
  branch: claude/vision-k
  tip: b0f1dbe6
  base: 212758ad
  originSessionId: ff8b4b71-3ea5-4d7a-9793-42190018c11f
  modified: 2026-07-20T17:28:19.762Z
---

# Vision V-K — V-22 THE ASSIZE + V-23 THE COMMONS' VOICE (dark, NOT folded)

⭐ Both engine features shipped on claude/vision-k @ **b0f1dbe6** (base 212758ad, NOT
folded/pushed — the manager folds). Two virtual flags: `assizeEnabled`, `commonsVoiceEnabled`
(ABSENT from DEFAULT_SIMULATION_RULES). Files: `src/domain/worldPulse/assizeKernel.js` (new),
`commonsVoiceKernel.js` (new), + pulseKernel name-swap, settlementRumors WHAT_PHRASES,
impactKindWalkers EXPECTED_VOICE, spatialUsage census. Pins: `tests/property/{assize,commonsVoice}DormancyGolden.test.js`
+ `tests/lint/visionKCohesionLaw.test.js`. Closure 1,024,743 B (Δ0 eager, all lazy leaves).

## Why / how it works
- Both are CONSUMERS+REFRAMERS: every consequence routes through an EXISTING writer (the
  cohesion law). Assize: fines via `foldObligations` (generosity ledger), rank via
  `mintFactionPairIncident`, unrest via `adjustStressorSeverityById`, legitimacy via the
  self-contained applyLegitimacySteps idiom. Commons: legitimacy + stressor writers only.
- Assize CONSUMES exposures at AGE ONE (`tick === now-1`), NON-destructively (freshness gate,
  not a drain — war-reasons + ladder stigma + covert-diffusion beat keep their reads). Sources:
  exposedCorruption ledger (keyed `corrupted>patron`, tick stamped) + npcCredibility[nid].lieExposure
  (covers lies AND contradicted-bluffs, which route through the lie machinery).
- Commons: persistent `commonsVoice` sidecar; deterministic petition->gathering->riot escalation
  from legitimacy/corruption/unrest reads. Fills the verified gap (rebellion stressor +
  faction-challenge + manual STARTED_RIOT existed; no organic NAMED commons ACTOR did).
- Coupling: a live commons grievance naming an accused amplifies the verdict; organic
  legitimacy/unrest feedback de-escalates the crowd next tick. Both flags lit compose.

## Load-bearing hazards / judgments (vetoable)
- ⚠️ **pulseKernel is FROZEN (max-lines ceiling, effective 1381).** Adding two guarded blocks
  tripped it (+12). CURE: compose new movers onto the growth chain via the name-swap idiom
  (`advanceNpcGrowthWith…AndRoadsAndCommonsAndAssize` in assizeKernel.js), change pulseKernel by
  NAME ONLY. Any future pulse mover MUST use the chain, never a new pulseKernel block.
- **JUDGMENT (double-charge avoidance):** the ladder ALREADY mints stigma from these exposures
  (npcLadderState maintainMarks). The assize does NOT re-mint stigma — "stigma via the ladder's
  writer" is honored by RIDING the ladder's existing mark; the assize's genuine person adds are
  fine + rank. Re-consuming lieExposure/bluffExposure would fight the ladder's lastLieSeen latch.
- **JUDGMENT (voice class):** the 4 new impactKinds (assize_verdict, commons_petition/gathering/
  riot) are EXPECTED_VOICE `null` (own in-register headline+summary prose), following the
  ladder/roads/traditions engine-lift precedent — NOT a new crier VoiceCategory. Vetoable upgrade:
  dedicated 'assize'/'commons' crier registers (newsVoice.js is lazy ⇒ Δ0-eager-safe if wanted).
- **DEFERRED arrows (no sanctioned writer — documented):** military-figure readiness nudge (§8
  mirror has no external-nudge writer — only warExhaustion/footing, out-of-register); explicit
  migration-push + tradition-spirit channels (field reads, no writer — the legitimacy/unrest
  channels already transmit into coup/challenge/flight reads).
- The impactKind walker (`impactKindWalkers.test.js`) scans for LITERAL `impactKind: '...'` only.
  Dynamic `impactKind: var` is invisible ⇒ commons beats mint LITERALS per rung (the house norm).

## Pre-existing reds (NOT this lane — confirmed at clean base 212758ad in a temp worktree)
beliefMapGolden / generatorGoldenMaster / pipeline.property / worldpulseDeityGolden fail
IDENTICALLY at the untouched base (generator/pipeline are generation goldens my lane never
touches; beliefMap/deity are pulse goldens — byte-identical when my flags dark, proven by 84
passing dormancy goldens). beliefMap is also parallelism-flaky (per prior memory).
