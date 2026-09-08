# W-C3 Implementer Brief — Institutional Ecology + Moral Founding Lane

You are the Opus implementer for Phase 5 W-C3 in /Users/cstokes/Desktop/settlement-engine
(branch review-fixes-2026-07-08). You implement; the manager reviews and commits. Runs
SEQUENTIALLY AFTER W-C2 (conquest feeds + mercenary market are committed by the time
you start — their receipts and demand machinery may be inputs here; read that commit).

BINDING SPEC: docs/PHASE5_ENGINE_COMPANION.md — the standing-laws preamble and §W-C3
are your contract. Read them first, then this operational brief.

## Modules to read before writing anything
- THE FOUNDING SEAM: locate where new institutions emerge post-generation — the
  worldPulse lifecycle lane (grep the worldPulse dir for founding/emergence/
  promotionAdditions/newInstitution and study tierResourceDynamics' institution
  surgery). The program doc says "the seam exists"; your first deliverable is a short
  written statement of WHERE it is and how entries enter it. If you conclude no true
  founding lane exists (only tier-promotion additions), STOP and report before
  building one — the manager must ratify new-seam architecture.
- src/domain/worldPulse/moralInstitutionPressure.js — the moral plane pressure system
  (MAX_STEP/ABOLITION_FLOOR class machinery). Extension point for faith-prescribes.
- src/domain/worldPulse/moralMartialLean.js — engine leaf, FROZEN: consume only. The
  side-car split is documented in src/domain/display/institutionVocabulary.js (its
  drift-pin test asserts side-car ⊇ engine seed — if you add engine-read leans for new
  institutions, the side-car and its test must be extended IN THE SAME CHANGE).
- src/domain/worldPulse/religiousContest.js — FAITH_CARRIER_RELATIONSHIPS/CHANNELS:
  the existing cross-settlement faith graph; faith-prescribes propagates over THESE
  carriers. Do not build a second graph.
- src/domain/worldPulse/tradeWar.js + tradeSalience.js — partner-selection scoring
  (supplyCompleteness × economicStrength × standing). Embargo-as-conscience lands as a
  standing-term penalty HERE.
- The generation institution catalog (src/generators/data/…) and how cascadeGenerator/
  assembleInstitutions spread catalog defs onto instances — THE GOLDEN TRAP (see
  work item 1).
- The trace/receipt vocabulary — every mechanic emits its cause.

## Work item 1 — MORAL FOUNDING LANE + EMERGENCE WEIGHTING
- Weight new-institution emergence by the settlement's moral plane + patron axes:
  good/merciful planes preferentially found the benevolent set (almshouse, hospice,
  orphanage, house of healing); cruel/disorderly planes the exploitative set (fighting
  pit, debtors' yard) — derive both sets' moral codings consistently with the existing
  vocabulary (cruelty/disorder coords).
- CATALOG ENTRIES (the deliverable the owner named): author the benevolent set as
  LIFECYCLE-ONLY entries — institutions the founding lane can instantiate post-
  generation. GOLDEN LAW: generation must never select them. Verify the mechanism:
  if the founding lane reads the generation catalog, prove your entries are unreachable
  by generation's selection tables AND that adding them changes zero generation bytes
  (run generatorGoldenMaster before/after adding entries, before any lane wiring). If
  entries cannot be added without generation-visible effects, STOP AND REPORT.
- Each founded institution arrives with a receipt naming its cause ("the almshouse
  rose because the plane demanded it" — in the trace vocabulary, not prose).
- Emergence rates at week scale: founding is a years-scale event per settlement, not
  monthly churn — justify constants accordingly; soak must show sane founding rates.
- Extend src/domain/display/institutionVocabulary.js with identity one-liners + moral
  leans for every NEW institution you introduce (the W1 coverage pin asserts 100%
  coverage — keep it green), and the drift-pin if you seed engine leans.

## Work item 2 — INSTITUTIONAL ECOLOGY + PROPAGATION
- TRADE NORMALIZES: sustained trade relationships pull partners' institutional
  TOLERANCE profiles toward each other — slow (multi-year half-life), capped (never
  full convergence), symmetric-ish but weighted by relative mass (the faithMass-style
  asymmetry already in religionState is the precedent — a metropolis norms a hamlet
  more than the reverse). Tolerance here = the moral-plane leniency a settlement
  applies when judging institutions (its own founding weights and its embargo
  thresholds), NOT its actual plane — trade normalizes what you tolerate before it
  changes what you are. Cause-chained.
- FAITH PRESCRIBES: extend moralInstitutionPressure across settlements over the
  existing faith carriers — a patron's plane presses its CONVERT settlements'
  institutions at carrier-attenuated strength (bounded, documented). A proselytizing
  good faith slowly abolishes its converts' slave markets; an evil one licenses them.
- EMBARGO AS CONSCIENCE: in trade partner selection, a settlement whose effective
  tolerance abhors a partner's active institutions (the slave-market-under-good-plane
  case is canonical) applies a standing penalty against that partner — scaling with
  abhorrence, emitting a receipt ("trade with X curtailed: the plane objects to the
  flesh market"). CONSCIENCE COSTS: the embargoer genuinely loses the trade score;
  no compensating bonus. Interlock note: this modifies tradeWar standing inputs —
  verify the war-supply web and trade tests still hold, and that the neutrality case
  (no moral objection anywhere) is byte-identical.

## Evidence
scripts/audit/institution-ecology-soak.mjs: founding-rate envelopes by plane (the
almshouse gradient), tolerance-normalization convergence curves under sustained trade,
cross-settlement pressure decay over carrier hops, embargo incidence + trade-score
cost distributions. Run outputs + README → docs/evidence/phase5-wc3/.

## Laws
Same-seed byte-identity · dormancy/neutrality (no trade, no faith carriers, no moral
signal ⇒ exact prior bytes) · strict endogeneity · goldens byte-identical or STOP ·
receipts for every mechanic · week-scale constant justifications · shrink-only
ratchets · the moralMartialLean freeze and the W1 side-car drift-pin.

## Shared checkout
Check `git status` at start; expect concurrent unstaged work from landing/W-C4
implementers in components/copy — NOT yours; never touch or stage; expect churn in
full-suite runs. NO git add/commit/stash/checkout. Leave all work unstaged.

## Gates
eslint clean · targeted suites for every touched module · generatorGoldenMaster +
worldpulseDeityGolden + religionDormancy.byteIdentity byte-identical (goldens run
TWICE for item 1: after catalog entries alone, and after full wiring) · typecheck +
domain-strict, any-cast ratchet at-or-under baseline · institutionVocabulary coverage
pin green · full suite --test-timeout=90000 · build + verify:dist (first-paint hard
gate ~359B margin — engine-side work must add NOTHING to eager chunks; the
institutionVocabulary side-car is lazy, keep it that way).

## Report
Founding-seam statement (where it is, how entries enter); per-file changes; new
catalog entries listed with moral codings; every constant with week-scale
justification; the two golden runs; neutrality evidence; soak envelopes; gate
results; any deviation (report, never silent).
