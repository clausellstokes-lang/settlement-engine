---
name: soak-route-vocabulary-mountain-pass
description: "2026-07-28 soak ROUTE_VALUES none→mountain_pass + lattice cure SHIPPED (both uncommitted, minifold); ✅ all 21 dim pairs 100% + full-corpus pairwise pin; mountain_pass = neutral 'unknown' tier in tradeRouteSemantics (owner-gated, still open)"
metadata: 
  node_type: memory
  type: project
  originSessionId: eb83fca7-4422-4c15-8091-0ed99012f62d
  modified: 2026-07-28T11:55:23.874Z
---

2026-07-28, minifold (claude/composite-r4), owner-directed EP-g follow-through:
`scripts/audit/generation-certification-soak.mjs` ROUTE_VALUES swapped
`'none'` → `'mountain_pass'` IN PLACE at position 5 (array stays length 6, so
monsterThreat phase arithmetic is untouched — only the former `none` stratum
shifts). UNCOMMITTED, left in-tree for the lane fold. Receipts: fast gate
3 files / 13 tests green (soak vocab + tradeRouteSemantics +
effectReachability); full soak PASS 1,200 worlds / 0 findings / 0/12 replay
mismatches / no coverage gaps; 200 mountain_pass worlds all coherent with 9
access_compatibility repairs (all Fishmonger — the EP-6 list-polarity
stratum, now standing-corpus-exercised). Corpus shift is DELIBERATE and
one-time; verified nothing committed pins configForIndex output
(certification.json gitignored; distribution envelopes measure their own
corpora; deep-profile has a local configForIndex copy).

**Why:** the soak spent 1/6 of its corpus on `none` — a reader-side fallback
token no code path writes into a config — while `mountain_pass`
(user-selectable, 16 catalog forbiddenTradeRoutes entries) had never been
certified.

**How to apply:**
- ⚠️ Do NOT remove the `impossible_route_claim` oracle from inspectSettlement:
  the soak test pins it with an explicit `'none'` config, and `'none'` stays a
  legal reader-side token (`cfg.tradeRouteAccess || 'none'` in
  deriveSystemState/deriveRegionalState).
- ✅ LATTICE CURED 2026-07-28 (same day, follow-through session, uncommitted
  in the same file): the correlated-selector class had TWO instances — the
  reported route×threat 6/18 (phases both floor(i/6) cancel; 5≡2 mod 3) AND a
  route×magic 12/24 the six-dim census missed (strides 5 and 3 both odd, same
  phase cancellation → magic parity locked to route parity). Cure = give
  monsterThreat and the magic scenario phaseEvery = TIER_ORDER.length *
  ROUTE_VALUES.length (36) so neither shares the route selector's own phase
  period. Post-fix census: ALL 21 dimension pairs 100% joint coverage over
  1,200 indexes; full soak PASS 1,200/0 findings/0 replay mismatches — all 24
  newly-reached joint cells certify clean. PREVENTION: the soak contract test
  now has a pairwise-lattice pin walking the full DEFAULT_COUNT corpus
  (reproduce-then-clear proven: names all 12 missing cells against the old
  arithmetic). ⚠️ The class rule stands: two selectDimension picks sharing a
  phase period cancel — never give a selector the same phaseEvery as one it
  must decorrelate from; the pin now enforces this structurally.
- ⚠️ Product gap (executed probe): tradeRouteTier('mountain_pass')='unknown' —
  zero deltas, hasTradeRouteConnection=false AND isTradeRouteDisconnected=false;
  GENERATED_ROUTE_VALUES omits it. The P1.1 neutral-scoring class recurring.
  Fix is OWNER-GATED tuning (derived-state shift for existing worlds under
  [[the-promise-ratified]]). Chip filed.

Recorded in docs/EPISTEMIC_PREVENTION_PLAN.md (2026-07-28 addendum). See
[[epistemic-prevention-shipped]], [[generation-remediation-gate-state]],
[[minifold-tree-is-live]].
