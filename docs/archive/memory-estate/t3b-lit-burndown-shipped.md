---
name: t3b-lit-burndown-shipped
description: "TRANCHE 3b-A E-H lit burn-down — all 12 baselined worldPulse mechanisms/flags struck to [] via one direct-import lit test"
metadata: 
  node_type: memory
  type: project
  created: 2026-07-21
  branch: claude/t3b-lit-burndown
  commit: 688d2089
  base: bff01718 (composite-r4)
  worktree: vision-i
  status: "shipped, NOT folded"
  originSessionId: 230c87b4-b237-4d1b-a63e-af48dfb233a0
  modified: 2026-07-21T15:56:21.693Z
---

# TRANCHE 3b-A E-H LIT BURN-DOWN shipped — bar 4 (A → A+)

`tests/domain/worldPulseLitBurndown.test.js` (new) + `tests/fixtures/mechanism-lit-coverage-baseline.json` (arrays emptied) @ claude/t3b-lit-burndown **688d2089** (base bff01718/composite-r4, worktree vision-i, NOT folded), 2026-07-21. Tests-only; 0 src bytes; eager Δ 0. Struck ALL 12 E-H baseline entries → the walker's gap is now `mechanisms:[] flags:[]`.

- **9 mechanisms** — one direct-import LIT drive each (AUTO credit; barrel imports earn NO walker credit): canonRelationshipImpact (mapEventToCanonRelationship: BROKERED_ALLIANCE→allied/warm, SETTLEMENT_DISPUTE→rival/sour), generosityNews (succorNews/defaultNews impactKind+id+score), generosityUpdates (applyLegitimacyDeltasToUpdates clamp [0,100] on a NEW array), mobilizationEffects (war_mobilization outcome + dismissal), relationshipRuleHelpers (hostilityRank/mean/signedDispositionFactor), relationshipRulesCore (neutralRules → trade_partner vs rival candidates), relationshipRulesAdversarial (tradeLeverageCandidate → trade_embargo_collapse; RULE_EVALUATORS dispatch), stablePart (slug), stressorSeverity (effectiveStressorSeverity min-of-override).
- **3 flags** — literal `<flag>: true` drive each: ladderPoliticalWindowsEnabled (ladderPoliticalWindowsActive predicate), underwaysOrganicFoundingEnabled (detectInstitutionGaps clandestine gap on/off), warDispositionEnabled (coupVerdictOutcomes hold-chance 0.35→0.13).

Gate: mechanismLitCoverage **12/12** (mechanisms:[] flags:[]) · new test 13/13 · domain-strict 0 bare · tsc 0 (tests/ excluded from tsconfig.full.json — untouched by scope) · eslint 0 · E-A mutationCoverageManifest 6/6 · NUL 0.

## Sharpest hazards (each bit or nearly bit this build)

1. ⚠️ **The flag LITERAL detector is VARIABLE-BLIND — write `<flag>: true` INLINE.** First fed warDispositionEnabled through a `runCoup(flag)` helper (ES6 shorthand `{ warDispositionEnabled }`) → the walker's flags ratchet REDDED (`[warDispositionEnabled]` vs `[]`) because `/\bwarDispositionEnabled\s*:\s*true\b/` never matched. The gated function reads the variable fine; the DETECTOR only sees a literal. Cure: two inline `coupVerdictOutcomes({ …, warDispositionEnabled: true/false })` calls. This is the documented "flags fed through variables are invisible" hazard — it fires on any helper-parameterized flag drive.
2. ⚠️ **The coup on/off differential SATURATES with no challengers.** A minimal settlement (no `powerStructure.factions`) → `coupContenders` returns zero challengers → `resolveCoupVerdict` early-returns `pHold:1` BEFORE the formula that applies `warSentimentAdj` → both flag-on and flag-off read 1 (differ=false). Cure: use warDisposition.p2's `warlikeTown()` fixture (governing War Council + Merchant/Temple challengers) so pHold is mid-range; then `warExhaustion` scar 0.9 → `computeWarSentiment` saturates to −1 (WAR_WEARINESS_WEIGHT=1.5, appetite−1.5·scar) → `warSentimentAdj = 0.22·−1 = −0.22` → pHold 0.35→0.13. Drive `coupVerdictOutcomes` (which READS the flag) — NOT `resolveCoupVerdict`; the existing warDisposition.p2.test.js injects `warSentimentAdj` numerically and thus BYPASSES the flag gate, which is exactly why warDispositionEnabled sat uncovered despite that test existing.
3. ⚠️ **E-A manifest enumeration is name/dir-driven — keep new lit tests OUT of it.** `mutationCoverageManifest.test.js` (via mutationCoverage.shared.mjs) enumerates every `*.test.js(x)` under tests/{lint,design,docs,data,copy,security,edgeFunctions} wholesale, PLUS any basename matching `(census|scan|baseline|ratchet|walker|killlist|parity|coverage|governance|freshness|integrity|exhaustiveness|roundtrip|golden|contract|pin)`. A match REDS the manifest until given a `kind:mutation|rationale|uncovered` entry (+ lowering uncoveredBaseline). Named `tests/domain/worldPulseLitBurndown.test.js` (no keyword, non-enforcer dir) → NOT enumerated (verified 6/6). If a lit test MUST carry a keyword or live in an enforcer dir, add its manifest entry in the same change.
4. **underways** = `detectInstitutionGaps(settlement, null, { underwaysFoundingLit: rules.underwaysOrganicFoundingEnabled === true })`; the flag ON emits a `clandestine` gap named 'Underground network' at a village+ settlement holding a `vice` institution (`facets.institutionNature:'vice'`) and no clandestine one; OFF emits none. 'Underground network' resolves in the catalog on this lineage (G2 folded).

## Why / how to apply
- **JUDGMENT (vetoable): direct-import AUTO credit for all 9, not LIT_COVERED_BY.** The barrel-driven existing tests (e.g. changeAuthorityPolicy.contract.test.js) drive `deriveFlowCandidates` in flows.js, NOT the relationship `RULE_EVALUATORS` (dispatched by relationshipEvolution.js), so they were not clean registry citations for Core/Adversarial; direct import is robust, self-contained, and gives full anti-vacuity control. The relationship rule ctx only needs a well-formed `{ edge:{id,from,to}, relState:{relationshipType,…}, sourcePressure, targetPressure, tick }` — `candidateBase`/`labelProposal`/`pairStableId` are pure and won't throw on that shape.
- **Strike the baseline entry in the SAME change as its covering drive** — the walker is strict-equality forced-shrink; gained coverage with an unstruck entry REDS by design (cite E-H). Adding a lit test for one of these from ANOTHER lane will red the walker at fold until the baseline shrinks.
- ⚠️ **npm ci FAILED (EUSAGE) in the worktree** (the known worktree-npmci-eusage hazard; no local node_modules). Ran all gates via the walked-up MAIN-tree vitest (`/Users/cstokes/Desktop/settlement-engine/node_modules/.bin/vitest`) — SAFE here because the test imports source by RELATIVE path (`../../src/domain/…`), so the code under test is the worktree's bff01718 source; only the framework comes from main. package.json is identical d3ff6778→bff01718.
- All assertions were empirically grounded via throwaway node probes before writing the test (adversarial-verify) — the coup saturation and the flag-literal miss were both caught by running, not reasoning.
