---
name: e0-tempo-governor-shipped
description: "E0 the Narrative Tempo Governor is BUILT + full-gate-green + COMMITTED (dormant); the first E-wave, ships dark, one-seam wired, bypass producers registered-not-wired."
metadata: 
  node_type: memory
  type: project
  originSessionId: 74c25947-3a91-4973-87cf-afa95f444037
---

E0, THE NARRATIVE TEMPO GOVERNOR (the anti-cacophony pacing layer, the FIRST E-wave before E1a) is
BUILT, full-gate-green, and **COMMITTED d81087ab** on branch `claude/zealous-driscoll-f74588`, cut
directly off review-fixes-2026-07-08 @ 5a78af5a. **NOT pushed, NOT merged** (vetoable). Built 2026-07-14
by Fable (architect/manager) + Opus (implementer/verifier) per the MODEL SPLIT. In-repo source of truth:
**`docs/PHASE55_E0_TEMPO_GOVERNOR_PLAN.md`** (frozen plan + §11 judgment-ledger + §11b build corrections);
design authority `docs/DESIGN_PACING_GOVERNOR.md`.

**What it is:** a realm-level governor that throttles SPONTANEITY (independent major-arc births by
drama-class budget over a 52-week window, realm-wide + per-settlement grace + global simultaneity) and
NEVER censors CAUSALITY (receipted consequence chains are provably exempt). Ships FULLY DORMANT: absent
the opt-in `narrativeTempo` axis, every same-seed output is BYTE-IDENTICAL — proven A/B against real
pre-E0 code @5a78af5a (9 surfaces × 4 intervals × 8 ticks, byte-identical). New file
`src/domain/worldPulse/narrativeTempo.js` (lazy, any-cast=0); registry in `decisionTier.js`
(`DRAMA_CLASS_REGISTRY`/`DRAMA_CLASS_PRIORITY`/`EXEMPT_STRESSOR_TYPES`, walker-enforced); one-seam hook in
`candidateEvents.js` rollCandidates; READ/WRITE hooks + DM receipt in `pulseKernel.js`; `'narrativeTempo'`
appended to `CONDITIONAL_LEDGER_KEYS` in `worldState.js`.

**Gate (final, all green):** full vitest **8792**, tsc full + domain-strict (ceiling 0), eslint, build,
verify:dist 109/109. **First-paint closure 1,216,290 ≤ 1,216,350 (60 B margin).** ⚠️ E0 costs **~17 eager
bytes** (the `CONDITIONAL_LEDGER_KEYS` string in the eager `worldState.js`) — NOT literally zero; the heavy
governor (module+registry+wiring) IS lazy (absent from the closure). The margin is now THIN (60 B) — a
forward budget risk for the next eager-touching change.

**Load-bearing JUDGMENT CALLS (all vetoable — owner may reverse; recorded in the plan §11):**
- Chain-immunity is scoped to RECEIPTED chains (design §1 "provably unable to break a *receipted* chain").
  Pressure-born famines (indistinguishable from war-born — the pressure model launders arc identity) are
  GOVERNED as spontaneous draws under deferral-not-denial. `isChainedConsequence` keys on MARKERS
  (residual/spread/escalate candidateType, mobilization_reaction ruleFamily, any world_stressor.* cause) —
  **NOT probability** (a verifier-caught fix: prob-1 exempted `strategy_deploy`, a spontaneous opportunistic
  war the design names governor-eligible; now governed).
- SCOPE = one seam (rollCandidates) wired + the §6 registration MECHANISM. The bypass producers (calamity
  annual strike, religious contest flip, war mobilization/siege-open) are REGISTERED with `wired:false` —
  their governor wiring is DEFERRED to their own waves (each has a distinct persistence/determinism nuance).
- Deferral = Model A (emergent re-fire via persistent pressure) + a recorded `deferred` ledger for the DM
  "pressure builds" receipt.
- Taxonomy (vetoable): famine→economic_shock; magical/monster→calamity; political_fracture→succession_coup
  + slave_revolt→schism_contest (grounded in REALM_LABELS); mass_migration/infiltration/betrayal→exempt;
  boom_flourishing declared, no producer (future rung).

**FORWARD (next waves):** (1) the DEFERRED bypass wirings (calamity/contest/war-mobilization register at
their own birth sites); (2) the LIGHTING event (owner-signed): the World-Laws dial UI + preset wiring
(`narrativeTempo` on presets) — deliberately NOT this wave (lighting a preset would break existing
goldens). See [[handoff-plan-post-ladder]], [[round21-backlog-program]]. The wrong-lineage worktree trap
fired again here (recurrence #4, [[wrong-lineage-worktree-trap-2026-07-14]]) — re-pointed via
`git checkout -B <branch> 5a78af5a` before building.
