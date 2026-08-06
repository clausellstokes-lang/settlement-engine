---
name: ""
metadata: 
  node_type: memory
  created: 2026-07-16
  tags: 
    - w-r2
    - d7
    - reframe
    - engine-wave
    - dormant
    - worldPulse
    - motive-attribution
  originSessionId: 7115c211-9732-4751-8d73-170ba6bbcf31
---

# W-R2-D7 THE REFRAME LAYER shipped (facts frozen, meaning derived)

The final engine wave of the round-2 depth program. Motive attribution as belief:
`interpretationOf(act, observer, now)` as a belief-side DERIVED read over immutable
ledgers, never a ledger rewrite. Built on branch `claude/w-r2-d7` off base 4052fc9c
(claude/w7-prep lineage: 4052fc9c → 5aa11dec DEPTH-2 merge → 17e4850b). 7 commits
788b5aa6 → 5a20b4d7. NOT pushed/merged (the manager reviews + merges per §0.3).

## Why / what
- Owner commission 2026-07-16: "the inverse of emotions/intentions as relationships
  change — shouldn't that generosity turn more into a debtor mentality after a betrayal."
- The engine: a new pure lazy leaf `src/domain/worldPulse/reframeKernel.js` (545 lines,
  0 eager) — the reframeEnabled gate, the bounded 8-act-class vocabulary (dark + bright
  misreading lanes), the deterministic interpretation read, and a transition mover that
  folds sticky/hysteresis/capped/both-signs interpretations into `spatialLedgers.reframes`
  over the immutable OBLIGATIONS ledger (kind + predatory = the frozen TRUE mint intent) +
  trade-dependence edges. It NEVER writes any transfer/receipt ledger (frozen-facts pin).
- 5 consumers wired: (1) war reasons ingratitude_debt + dependency_by_design + DISTINCT
  peace mirrors debt_forgiven + bonds_of_commerce (warReasons/peaceReasons; strict §14.3
  bijection walker now 11 kinds/side); (2) restitution peace TERM (peaceTerms); (3)
  corruption-leash bounded input (corruptionWeb.recruitmentWeight REFRAME_BOOST_MAX); (4)
  DECLARE_CASUS dials (auto — realmManifest enumDial spreads WAR_REASON_TYPES); (5) THE
  LEDGER OF GIFTS AND DEBTS read-model (`src/domain/display/giftsAndDebtsRead.js`, the DM-
  truth irony lane). Consumer 6 (whisper + glossary) DEFERRED in-file (needs a wired UI
  component host, outside the worldPulse/display-read-model scope).
- 8th E0 drama class `reframe` (decisionTier, wired:false bypass producer, boom_flourishing
  precedent).

## Load-bearing decisions / hazards (verify before building on these)
- **DORMANCY = PURELY VIRTUAL flag.** reframeEnabled is absent from DEFAULT_SIMULATION_RULES
  AND the WAVES preset bundle — so EVERY golden (even peaceEngine-lit ones via WAVES) runs
  the reframe layer DARK ⇒ byte-identical. Full gate green: 11,704 passed, sole red the
  documented EXEMPT_CEILING 69>66 (store op-registry, untouched by D7). Closure 1,063,701 /
  budget 1,066,400 / margin 2,699 — ZERO eager added.
- **JUDGMENT: transitions are DETERMINISTIC** (sticky threshold-crossings + hysteresis
  deadband + global CAP filled score-desc + negativity-biased asymmetric thresholds), NOT
  rng draws — truer to "meaning DERIVED", matches warReasons "reads not rolls", and needs
  no rng plumbed through advanceWarReasons (pulseKernel is at its unraisable 1410 ceiling).
- **WIRING: advanceReframe is FOLDED into the top of advanceWarReasons** (gated on its own
  reframeActive, before the peaceCausalActive gate), threading the reframe-updated ws — because
  pulseKernel is at its hard line ceiling and cannot take a new mover call. Zero pulseKernel
  lines added.
- **JUDGMENT: reframe peace mirrors minted** (design under-specifies them): ingratitude_debt↔
  debt_forgiven, dependency_by_design↔bonds_of_commerce (Blainey-consistent, distinct kinds).
- **JUDGMENT: restitution term shares the 'economic' family** (one-per-family §13, mutually
  exclusive with tribute) — reuse avoids a house-voice-totality row peaceTerms.js's tight
  788/800 ceiling can't afford.
- ⚠️ **HAZARD RECURRED: embedded NUL bytes.** Two 0x00 bytes appeared as a Set-key separator
  in the reframe fold (`${pairKey}\x00${actClass}`); the controlBytes pin caught it. Fixed by
  switching to OBJECT-REFERENCE identity (no separator). Use the python byte-count check.
- Relationship state is keyed by `relationshipKeyFromEdge` = `edge.id` OR directional
  `rel.${from}.${to}` (NOT canonical) — the mover resolves state from the REAL graph edges
  (both orientations → one shared state), never a synthesized edge.
- `src/lib/spatialUsage.js` EXEMPT_LEDGER_KEYS gained `reframes` (the walker-forced companion
  to the ledger write — outside the stated worldPulse/display scope but mandatory).

## Deferrals (recorded in-file)
- Act classes intelligence/mediation/religion/kinship enumerated only in the vocabulary +
  read-model (fact sources exist; per-class transition enumeration is a v2 the generic fold
  supports). Whisper + glossary compendium (consumer 6). All in reframeKernel/giftsAndDebtsRead.

## OWNER QUEUE
- **The reframeEnabled LIGHTING question** — does reframeEnabled join the three world-alive
  presets (dramatic_campaign / living_realm / full_simulation) for the regen batch? Shipped
  DARK; lighting is the owner's call. If lit, it rides THE ONE REGEN (its shifts batch there).
- Minor stale comment: `src/domain/spatial/generosityEV.js:40` says "DRAMA_CLASS_PRIORITY
  stays at 7" (now 8) — cosmetic, left untouched (outside scope).
