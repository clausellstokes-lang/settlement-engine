# W-C5 Implementer Brief — The Cause-Resolution Lifecycle (the last mechanic)

You are the Opus implementer for Phase 5 W-C5 in /Users/cstokes/Desktop/settlement-engine
(branch review-fixes-2026-07-08). You implement; the manager reviews and commits. Runs
SEQUENTIALLY AFTER W-C3 (institutional ecology is committed by then; its founding/
embargo receipts and W-C2's conquest receipts are potential causes here — read both
commits). OWNER MANDATE: this is the final simulation mechanic; after it, the engine
is complete and W2 multiplies content against what you emit.

BINDING SPECS: docs/PHASE5_CONTENT_ARCHITECTURE.md (the cause-resolution lifecycle
section, the two terminals, the temporal constitution and age bands, the coverage
ladder) + docs/PHASE5_ENGINE_COMPANION.md standing laws. Owner vocabulary:
"compromised"/"compromise tag" = corruption — ONE system with covert vs revealed
buckets; do not invent a parallel corruption representation.

## The mechanic, in the owner's own frame
A condition (canonically: the guard captain is compromised) exists BECAUSE of a cause
(the garrison is underfunded). When the cause RESOLVES (the garrison gets funded), the
condition must not silently persist with a stale story. It evolves by exactly one of
three paths, chosen by the bearer's trait plane + a seeded fork:
1. RE-CAUSE — the corruption organically adopts a NEW cause, in canon: the new cause
   must be REAL (an actual concurrent condition of this settlement drawn from the
   cause vocabulary — never invented) and coherent for the role. Corruptible/greedy/
   entrenched-dark trait planes lean here.
2. REFORM — the corruption ends, because the resolved cause was its sole support.
   Principled/upright planes lean here. Reform emits a receipt (the DM sees the
   captain come clean) and clears the compromise tag through the existing corruption
   machinery (undo-clean like every canon mutation).
3. HISTORICIZE — the corruption persists but its origin becomes past-tense: the cause
   is stamped resolved-at-tick, and the condition carries a historicized origin
   ("it began in the lean years" register). Entrenched-but-cautious planes lean here.
TWO TERMINALS override the lifecycle entirely:
- EXPOSURE → PUBLIC ARC: once the compromise crosses covert→revealed (the existing
  bucket transition), quiet evolution stops. No re-causing, no silent reform — the
  arc is public and rides the existing scandal/legitimacy consequence machinery
  (W-F4's clergy-scandal and conduct lanes are the precedent; wire civic exposure to
  the analogous consequence reads, do not build a second scandal system).
- CRIMINAL-INFRASTRUCTURE DESTRUCTION → RE-ADJUDICATE: when the criminal institution
  sustaining an arrangement is destroyed/captured/abolished (conquest outcomes,
  moral-pressure abolition, tier demotion fates), dependent conditions are
  RE-ADJUDICATED from scratch — a fresh seeded determination of whether/how the
  condition persists, not an evolution of the old one.

## Architecture directives
1. CAUSE ATTRIBUTION IS WORLDPULSE-SIDE AND CONDITIONALLY MATERIALIZED — THE GOLDEN
   LAW. Generation schemas do not change. Compromise tags born at generation carry no
   cause field in generated output; the lifecycle attributes a cause LAZILY on first
   worldPulse touch (derive the most coherent cause from the settlement's actual
   state via the cause vocabulary — deterministic, seeded fork per condition), stored
   only in worldPulse-owned state. A never-advanced settlement is byte-identical to
   today. Run generatorGoldenMaster before/after to prove it; goldens byte-identical
   or STOP (W2 owns the sanctioned regen, not you).
2. LOCATE THE EXISTING REPRESENTATIONS FIRST and write a short statement of them in
   your report: the corruption/compromise system (domain corruption module, the
   covert/revealed buckets, how tags attach to NPCs/institutions), crisisLifecycle.js
   (adjacent machinery — study its shape; extend patterns, not duplicate), the trace/
   receipt vocabulary and W1's cause classes (~14 classes in 4 families: economic /
   war / faith / corruption — institutionVocabulary.js documents the survey), and the
   NPC flaw/temperament plane reads (clergyTraitPlane is the Phase 4 precedent for
   projecting traits onto a plane; civic bearers need the analogous projection —
   if a general trait-plane leaf already exists, use it; if you must write one, it is
   a pure leaf consuming the existing flaw/temperament vocabulary).
3. RESOLUTION DETECTION: per-tick, ONLY over settlements with attributed causes
   (conditional materialization — no global scan state for untouched worlds). A cause
   resolves when its underlying condition genuinely clears in state (underfunded →
   funded, war ends, blockade lifts, chain restored). Map each cause class to its
   resolution predicate; document the table. Hysteresis: require the resolution to
   hold N consecutive ticks (justify N at week scale) so a one-week blip doesn't
   reform a captain.
4. SELECTION: outcome weights from the bearer's trait plane, resolved by seeded fork
   (`cause-resolution::<tick>::<cid>::<conditionId>` — the religion-contest fork
   pattern). Deterministic, per-decision, endogenous only (user/party never feed it).
5. AGE BANDS: every lifecycle record stamps origin tick, resolution tick, and (for
   historicize) the historicization tick, so display derives the temporal register
   (this-week / this-month / this-season / this-year / years-past) per the temporal
   constitution. Emit the band boundaries from one shared helper — W2's prose will
   bind to it; do not hardcode band math in the lifecycle.
6. CONTENT CONTRACT (the seam W2 multiplies against): every lifecycle event emits
   (a) a receipt in the trace vocabulary, and (b) a CONJUNCTION KEY —
   {role, situation, causeClass, lifecycleStage} where lifecycleStage ∈
   {attributed, re-caused, reformed, historicized, exposed-public, re-adjudicated}.
   Ship a GENERIC CONTENT FLOOR so no surface ever renders empty: a small
   display-side phrase table (W1's institutionVocabulary side-car pattern — lazy,
   golden-inert) covering every lifecycleStage × causeClass generically (~2-3
   variants each). Specific role×situation×cause lines are W2's job, not yours.
7. SURFACING (minimal, honest): wherever compromise currently renders (dossier
   sections that show corruption), the lifecycle state shows through the generic
   floor — a historicized captain reads past-tense, a reformed one is gone, an
   exposed one reads public. No new tabs; thread through existing display models.

## Evidence
scripts/audit/cause-lifecycle-soak.mjs: outcome distributions by trait plane (the
principled-reform vs corruptible-recause gradient), historicize/reform/re-cause
ratios over long campaigns, terminal frequencies (exposure arcs, re-adjudications),
re-cause coherence audit (every adopted cause verifiably real in-state at adoption),
age-band distribution of surviving corruption. Outputs + README →
docs/evidence/phase5-wc5/.

## Laws
Same-seed byte-identity · dormancy/neutrality (no corruption, or corruption whose
causes never resolve ⇒ exact prior bytes) · strict endogeneity · goldens
byte-identical or STOP · receipts for everything · week-scale constants justified ·
covert/revealed is THE bucket system · undo-clean canon mutations · shrink-only
ratchets · first-paint budget untouched (all display work lazy; margin is ~270 B).

## Shared checkout
Check `git status` at start; expect possible concurrent unstaged work (landing
implementer in components/copy; possibly others — the reunification wave may be
staging by the time you run). NOT yours; never touch or stage. NO git
add/commit/stash/checkout. Leave all work unstaged.

## Gates
eslint clean · targeted suites for every touched module + a new
tests/domain/causeResolutionLifecycle.test.js covering: attribution lazily
materializes and is dormancy-neutral; each of the three paths under forced trait
planes; both terminals; resolution hysteresis; age-band stamps; re-cause coherence;
undo round-trip for reform · generatorGoldenMaster + worldpulseDeityGolden +
religionDormancy.byteIdentity byte-identical · typecheck + domain-strict, any-cast
ratchet at-or-under · institutionVocabulary coverage pin green if you extend the
side-car · full suite --test-timeout=90000 · build + verify:dist.

## Report
The representation statement (where corruption/causes/trait-planes live); per-file
changes; the cause→resolution-predicate table; every constant with week-scale
justification; the conjunction-key shape W2 will consume (spell it out — this is a
contract); soak envelopes; the two golden runs; gate results; any deviation
(report, never silent).
