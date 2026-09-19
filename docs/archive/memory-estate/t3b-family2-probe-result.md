---
name: t3b-family2-probe-result
description: "⚠ TRANCHE 3b-C VERDICT = BLOCKED. E-J family-2 (conquest/occupation applied-outcome → mobilization/deploy parent's recorded key, cross-tick) is NOT buildable dark without a NEW persisted field. V1 reachability YES (conquest+deploy are both recorded keys, genuinely cross-tick); V2 derivability NO — the deployment record holding sinceTick is cleared at siege resolution (~1600 lines) before the recorder runs, so the deploy tick is not derivable at record time. Owner-gated. NOT built; probe committed."
metadata: 
  node_type: memory
  type: project
  date: 2026-07-21
  tags: 
    - provenance
    - recorded-depth
    - deepChains
    - E-J
    - family-2
    - cross-tick
    - war-layer
    - blocked-with-evidence
    - owner-gated
  branch: claude/t3b-family2-probe
  base: bff01718
  tip: d173e0f2
  originSessionId: 230c87b4-b237-4d1b-a63e-af48dfb233a0
  modified: 2026-07-21T15:53:41.631Z
---

# TRANCHE 3b-C — E-J FAMILY-2 cross-tick probe: BLOCKED (V1 YES / V2 NO)

VERIFY-FIRST probe (E-J-v2 discipline). The question: can a conquest/occupation applied-outcome
name its **mobilization/deploy PARENT's recorded key** (`wizard_news.<parentTick>.world_pulse.
applied.world_outcome.<type>...`), dark, with NO persisted-shape change? E-J-v2 deferred this
because it is the CROSS-TICK case — the deploy fires ticks before the conquest, so the same-advance
transient derivation that carried family-1 waves does NOT apply. **Verdict: BLOCKED — NOT built.**
The probe is the deliverable (a disproof that stops with evidence is complete). No src/ change;
deepChains unchanged at 6.

## The mechanism that made V1 plausible (verify at code)
The raw war OUTCOMES carry NO top-level `causedBy`/`sourceEventId` (conquest = `world_outcome.
conquest.<target>.<tick>` with only `powerTransfer.sourceStressorId` + nested `condition.triggeredAt`;
strategy_deploy has `sourceEventTargetId` not `sourceEventId`; war_mobilization has neither). So the
raw outcomes are NEVER recorded ledger keys. BUT every applied outcome mints an APPLIED NEWS ENTRY via
`newsEntryForOutcome` (**applyWorldPulse.js:290**): `id: wizard_news.${tick}.world_pulse.${status}.
${outcome.id}`, **`sourceEventId: outcome.id`**. That news entry carries a top-level edge ⇒ it lands
in impactDigest ⇒ it IS a recorded key. So conquest/deploy/mobilization ARE representable in the ledger
— as their applied news entries. (`collectProvenanceEdges` in provenanceKernel.js records a receipt as
a KEY only if it is in durableIds AND carries a top-level `causedBy`/`sourceEventId`.)

## V1 REACHABILITY = YES (CONFIRMED, measured, seed 'arc-soak-seed' @ bff01718)
The arc-soak fixture (15y × 8, full_simulation + provenanceLedgerEnabled) fires 2 conquests and records:
- `wizard_news.83.world_pulse.applied.world_outcome.conquest.c.83`  (b conquers c @ t83)
- `wizard_news.104.world_pulse.applied.world_outcome.conquest.f.104` (e conquers f @ t104)
- `wizard_news.81.world_pulse.applied.world_outcome.strategy_deploy.b.c.81`  (deploy parent for b→c)
- `wizard_news.81.world_pulse.applied.world_outcome.strategy_deploy.e.f.81`  (deploy parent for e→f)
Both deploy parents are recorded keys AND genuinely cross-tick (deploy@81 → conquest@83 / @104). Also
45 recorded `war_mobilization` keys and 1 `occupation_vassalized.f.112`. **So IF the conquest could
name its deploy parent's key, it would be a real cross-tick deepChain (6 → 8).**

## V2 CROSS-TICK PARENT-KEY DERIVABILITY = NO (DISPROVEN — THE BLOCKER)
At each conquest's RECORD seam (`appendPulseHistoryWithProvenance`, **pulseKernel.js:2497**),
`worldState.deployments[occupier]` is **null** (measured `depAtRecord===null` for both conquests). The
siege resolves and the besieger's deployment moves into `resolvedDeployments` at **pulseKernel.js:870**
— ~1600 lines and all movers BEFORE the recorder — so `sinceTick` (=81, the ONLY persisted carrier of
the deploy tick) is gone by record time. `warPosture[occupier].sinceTick` holds the tick the CURRENT
posture was entered (measured 82 / 84), NOT the deploy tick 81 (it is overwritten on every posture
transition, mobilization.js), so a reconstructed key is a NON-recorded key
(`reconstructedDeployKeyIsRecorded===false`, `reconstructedMobKeyIsRecorded===false`).
Occupier + target ARE derivable from the conquest outcome (`condition.causes[0].source` + `targetSaveId`);
the deploy tick **T_d is not persisted anywhere reachable at the record seam.** ⇒ requires a NEW
persisted field (stamp the deploy tick / deploy-outcome id onto the conquest power_transfer or the
occupations ledger at conquest time) = a durable-receipt persistence-shape change = **OWNER-GATED**.
Per the 3b-C brief: STOP, do not force it, move to the owner manifest (the E-J-v1 outcome shape).

## Recommended path (if the owner wants family-2 recorded depth) — owner sign-off first
Stamp the seeding lineage at conquest time so it survives to the record seam WITHOUT re-reading a
cleared deployment: put `deployStartTick` (= the resolved deployment's `sinceTick`) onto the conquest
`powerTransfer` (and/or onto the `occupations[target]` ledger record). Then a lazy `withConquestCauseEdges`
in provenanceKernel.js (mirroring `withWaveCauseEdges`, NEVER the eager wizardNews.js) can reconstruct
`wizard_news.<deployStartTick>.world_pulse.applied.world_outcome.strategy_deploy.<F>.<T>.<deployStartTick>`
and add it as an additive `causedBy` on the conquest's applied news entry — a real cross-tick deepChain,
dark. The persisted-field add is the owner-gated part.

## Files / evidence
- `scripts/probe-ej-family2.mjs` (NEW, committed @ d173e0f2) — deterministic probe; prints the verdict,
  writes evidence JSON to tmpdir. `node scripts/probe-ej-family2.mjs`. Reproduces V1=YES / V2=NO.
- Related: [[enforcer-ej-v2-recorded-depth-shipped]] (family-1 waves, the shipped seam),
  [[enforcer-ej-depth-blocked-finding]] (E-J-v1 outcome shape), [[recorded-causal-depth-reality]].

## Hazards learned this lane
- ⚠️ `npm ci` FAILS EUSAGE on this lineage (lock desync — now `node-exports-info@1.6.2` missing);
  worktree vitest resolves via the MAIN-tree node_modules walk-up (vitest 4.1.8 == worktree ^4.1.8).
  Confirms [[worktree-npmci-eusage-node-modules-walkup]]. Did NOT `npm install` (would rewrite the lock
  = owner-visible). Probe ran under plain `node` (walk-up), NOT vitest, so console/fs output is unfiltered.
- ⚠️ macOS has no `timeout` binary — use the tool's own timeout, not `timeout N cmd`.
- Foreign `stash@{0}` ("analytics-intelligence-layer: generation-tuning fixes") = owner WIP, preserved.
