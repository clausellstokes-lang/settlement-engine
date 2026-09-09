# W-C2 Implementer Brief — Conquest Feeds + Mercenary Compensating Market

You are the Opus implementer for Phase 5 W-C2 in /Users/cstokes/Desktop/settlement-engine
(branch review-fixes-2026-07-08). You implement; the manager reviews and commits. Runs
SEQUENTIALLY AFTER W-C1 (its supplyQuality.js leaf and threat-input work are committed
by the time you start — read them, they are dependencies).

BINDING SPEC: docs/PHASE5_ENGINE_COMPANION.md — the standing-laws preamble and §W-C2
are your contract. Read them first, then this operational brief.

## Modules to read before writing anything
- The war outcome application path: how capture/occupation outcomes land on settlements
  (src/domain/worldPulse/warFrontReads.js, tierOutcomeApply.js, tierResourceDynamics.js,
  and the applyWorldPulse/pulseKernel seams where war outcomes commit). Find where a
  CAPTURE and an OCCUPATION become settlement state — that is your conquest-feed seam.
- src/domain/worldPulse/moralInstitutionPressure.js — the moral plane on institutions;
  ABOLITION_FLOOR and the plane math are the conscience gate you will reuse. Do NOT
  build a second morality system.
- src/domain/worldPulse/moralMartialLean.js (engine leaf, FROZEN — consume, never
  extend; the display side-car in domain/display/institutionVocabulary.js documents the
  split) — how institutions carry moral/martial identity, incl. slave-market coding.
- src/domain/worldPulse/martialReadiness.js + supplyQuality.js (post-W-C1) — readiness
  and kit-quality reads; the mercenary market compensates SHORTFALLS in these.
- src/domain/worldPulse/tierResourceDynamics.js — institution demand/strength/activity
  machinery and WAR_SUPPLY chains; economy band pulses.
- The trace/receipt vocabulary (src/domain/worldPulse/trace.js or equivalent) — every
  new mechanic emits its cause.
- src/domain/worldPulse/fidelityNoise.js — the noise geometry; your mercenary fidelity
  penalty composes with it (a bounded additional term or multiplier at the war-decision
  read), it does not fork it.

## Work item 1 — CONQUEST FEEDS
On capture/occupation outcomes committing against a settlement pair (victor V, taken T):
- CAPTIVES CHANNEL: yields captives sized by T's population tier and the outcome
  severity. The channel pays out ONLY if (a) V has an active slave-market-class
  institution (moral coding already exists), AND (b) V's moral plane permits — the
  ABOLITION_FLOOR machinery is the gate. CONSCIENCE FORECLOSES REVENUE: when the gate
  blocks, the yield is LOST — no partial payout, no laundering through another channel,
  no deferred credit. A good-plane conqueror simply does not profit this way. The
  foreclosure itself emits a receipt (the DM should be able to see "V refused the
  captive trade" as a cause).
- LOOT CHANNEL: a temporary prosperity/market pulse on V, decaying over weeks
  (constants justified at week scale), magnitude scaled by T's economic strength and
  the outcome kind (sack > capture > occupation-establishment). Cause-chained to the
  specific conquest receipt. No permanent step-change — loot is a pulse, not a rebase.
- Both channels: deterministic (seeded per-outcome forks if any randomness; prefer
  none — derive from state), and CONDITIONALLY MATERIALIZED: a world with no captures
  produces byte-identical output to today (write the neutrality test).

## Work item 2 — MERCENARY / ADVENTURER-GUILD COMPENSATING MARKET
- DEMAND SIGNAL: derived only from world records — settlements with active war
  exposure (fronts, threat environment per W-C1) whose readiness and/or supply quality
  falls short of their exposure. Define shortfall = f(threat/engagement, readinessOf,
  supplyQuality) with documented week-scale constants.
- SUPPLY RESPONSE: mercenary and adventurer-guild institutions (catalog tags exist)
  gain demand-driven activity/strength where shortfall demand reaches them (local
  first; if a reach mechanism is natural via existing trade/graph channels, bounded and
  documented — do not invent a new propagation system; W-C3 owns propagation).
- THE RENTED-FORCE TRADEOFF: a settlement meeting exposure through the compensating
  market (active strong mercenary presence + shortfall) gets (a) a bounded effective
  readiness/mobilization supplement — it can field force it didn't train — at (b) a
  prosperity cost (upkeep drain while engaged) and (c) a fidelity penalty: hired steel
  reads the risk calculator worse than sworn steel — a bounded additive error term at
  the war-decision sites, composing with the existing chaosPull+rust geometry under its
  TOTAL_MAX-style cap. All three legs emit receipts.
- Neutrality: no wars + no shortfall ⇒ byte-identical world. No user/party inputs
  anywhere in the signal.

## Evidence
scripts/audit/conquest-market-soak.mjs (house pattern: deterministic seeded cohorts,
envelope tables): conquest-yield envelopes by conqueror plane (evil profits, good
forecloses — show the gradient), loot-pulse decay profiles, mercenary supplement vs
prosperity-drain tradeoff curves, fidelity-penalty distributions. Run outputs + README
→ docs/evidence/phase5-wc2/.

## Laws (from the program doc — non-negotiable)
Same-seed byte-identity · dormancy/neutrality (no record ⇒ exact prior bytes) · strict
endogeneity · golden corpus byte-identical or STOP AND REPORT · every mechanic emits
its cause · constants carry week-scale justification comments · shrink-only ratchets
(any-cast baselines; run the ratchet tests before reporting).

## Shared checkout
Check `git status` when you start: expect concurrent unstaged work from a landing
implementer (components/copy/backgrounds/tests-ui) and possibly a W-C4 custom-content
implementer (compendium/settlement components + a lazy copy module). NOT yours — never
touch, stage, stash, or revert; expect their churn during full-suite runs. NO git
add/commit/stash/checkout ever. Leave all your work unstaged.

## Gates before reporting
eslint clean on touched files · targeted suites for every touched module · the three
golden/dormancy oracles byte-identical (generatorGoldenMaster, worldpulseDeityGolden,
religionDormancy.byteIdentity) · typecheck + domain-strict (no new debt; any-cast
ratchet at-or-under baseline) · full suite --test-timeout=90000 (known load flakiness;
concurrent agents' failures are theirs — verify by file ownership, note, don't chase) ·
npm run build && npm run verify:dist (first-paint budget 1,411,000 is a HARD gate with
~359B margin — you are engine-side and must add NOTHING to eager chunks; if first
paint moves at all, find your leak).

## Report
Per-file changes with line counts; every new constant with week-scale justification;
the conscience-foreclosure receipt example; neutrality test evidence; soak envelope
numbers; golden statement; gate results; any spec clause you could not satisfy
(report, never silently deviate).
