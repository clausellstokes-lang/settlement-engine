---
name: ""
metadata: 
  node_type: memory
  created: 2026-07-21
  kind: milestone
  branch: claude/e-h-mechanism
  commit: de94d733
  status: "shipped, NOT folded"
  originSessionId: ff8b4b71-3ea5-4d7a-9793-42190018c11f
  modified: 2026-07-21T07:30:32.991Z
---

# Enforcer E-H shipped — the per-mechanism lit-walkthrough walker (bar 4)

`tests/property/mechanismLitCoverage.test.js` + `tests/fixtures/mechanism-lit-coverage-baseline.json` @ claude/e-h-mechanism `de94d733` (base b339e178, worktree vision-j). Tests-only; 0 src bytes; eager Δ 0. Gate: domain-strict 0 (bare) · full tsc 0 · eslint 0 · walker 12/12 · NUL scan 0.

## What it enforces
Two source-derived axes, each a strict-equality shrink-only ratchet against the baseline JSON — a NEW worldPulse mechanism or `*Enabled` flag with no flag-ON lit proof REDS (completeness), and a baseline entry that gains coverage REDS until struck (forced shrink; drive to []).
- **Modules**: 156 flat `src/domain/worldPulse/*.js`; 1 exempt (`pulseShapes` typedef-only, guarded to stay runtime-export-free — bare `export {};` permitted). 146/155 lit-proven (94.2%): 138 via direct-import scan over non-dormancy/non-byteIdentity tests + 8 via the validated `LIT_COVERED_BY` registry. Baselined gap 9: canonRelationshipImpact, generosityNews, generosityUpdates, mobilizationEffects, relationshipRuleHelpers, relationshipRulesAdversarial, relationshipRulesCore, stablePart, stressorSeverity.
- **Flags**: 59 rules keys (predicate-helper function names excluded, e.g. isFaithSpreadEnabled). 56/59 lit-proven (94.9%): 48 literal `<flag>: true` in some test (dormancy goldens count via their LIT ANTI-VACUITY halves) + 4 default-true in DEFAULT_SIMULATION_RULES + 4 via `FLAG_LIT_COVERED_BY`. Baselined gap 3: ladderPoliticalWindowsEnabled, underwaysOrganicFoundingEnabled, warDispositionEnabled (all dark F3-era flags with ZERO flag-ON drives anywhere).

## Why / how to apply
- Registry entries are self-validating (referenced file must exist, evidence string must appear, entry must not duplicate auto-credit) — a stale or redundant reference reds with a strike-it message. To burn down the gap: write a lit test (or add a validated registry entry for an existing indirect proof), then strike the baseline entry in the SAME change.
- ⚠ Hazards for future edits: barrel imports (`worldPulse/index.js`) deliberately earn NO module credit — only direct module imports do; a lit test written against the barrel needs a registry entry. Flags fed through variables (`warForageEnabled: warForage`) are invisible to the literal detector — registry them. Adding a lit test for a baselined mechanism from ANOTHER lane will red this walker at fold time until the baseline shrinks — that is by design, cite this file.
- The three baselined flags are the honest bar-4 burn-down list: no test anywhere drives them lit.
