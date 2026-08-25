---
name: ""
metadata:
  node_type: memory
  title: "ENFORCER E-F shipped — deterministic tick op-count budget (tests/perf/tickOpBudget.test.js)"
  date: 2026-07-21
  tags:
    - tranche-2-enforcer
    - E-F
    - performance
    - bar-5
    - op-budget
    - not-folded
  branch: claude/e-f-opbudget
  tip: 9f5ff2bf
  base: b339e178
  originSessionId: ff8b4b71-3ea5-4d7a-9793-42190018c11f
  modified: 2026-07-21T07:40:35.477Z
---

# ENFORCER E-F shipped — the deterministic tick op-count budget

**Fact.** `tests/perf/tickOpBudget.test.js` (NEW `tests/perf/` dir) @ claude/e-f-opbudget tip **9f5ff2bf** (base b339e178, NOT folded): the townMapOpBudget OP_CEILING idiom generalized to the advance pipeline, per THE_APLUS_EXECUTION_ARCHITECTURE.md §E-F (bar 5). **Zero src change — eager Δ 0 structurally** (the proxy counts entirely from the `simulateCampaignWorldPulse` result; no instrumentation hook was needed).

**The proxy.** Per-advance FLOWS (candidates, rollExplanations, selected, autoApplied, proposals, settlementUpdates, wizardNews entries stamped with the advance tick) + ledger STOCKS the pipeline iterates each advance (stressors, queuedImpacts, spatial arrivals/rumors, pulseHistory length). Fixture mirrors moverCompositionSmoke (LITERAL full_simulation preset, 4 settlements × 24 weekly ticks, seed `op-budget-seed`) — replicated, not imported (importing a .test.js cross-registers its suites).

**Pins (measured 2026-07-21, exact under fixed seed).** Grand total 4671 → ceiling 6500 (~1.4×); worst advance 256 @ tick 16 → 400; 12 per-component ceilings at ~1.4–1.5× measured (component resolution so one family doubling can't hide behind a quiet run); anti-vacuity floor 2000 + five families must be non-zero. Determinism test: same seed twice → per-advance row arrays deep-equal (executed, 2 passed).

**CANNOT-CATCH.** Bounds op-COUNT, not per-op COST: an O(n²) blow-up inside one evaluation emitting the same receipts is invisible (that half stays with worldTickCostEnvelope's 10× wall-time trend); so is work surfacing nothing in the result; cap-evicted news under-counts.

## Why
The owner rejected absolute-ms thresholds as flaky; bytes were the only deterministic budget. This closes the constant-factor blind spot machine-independently. The measured values are EXACT (same seed ⇒ same counts) — any future drift in them is a real behavior change, never machine noise.

## How to apply
- A red here = a constant-factor regression in the named family; find the hot kernel before touching a ceiling. Raising a ceiling requires stating the legitimate behavior change (doctrine: never silently re-pin).
- Legitimate engine changes (new kernels, tuned rates) that shift counts <~1.4× pass by design; re-measure with `TICK_OP_BUDGET_REPORT=1` and re-pin WITH the cause stated in the diff.
- Gate receipts at ship: domain-strict 0 · full tsc 0 · eslint 0 · vitest 2 passed (post-commit, post-hook) · NUL scan 0 · foreign stash@{0} untouched.
