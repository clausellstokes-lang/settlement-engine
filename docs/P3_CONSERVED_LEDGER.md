# P3 — The conserved food/economy ledger

**Goal.** One conserved set of food/economy quantities, computed once, that every
lens (capacity model, causal substrate, dossier, AI overlay) reads from — so the
lenses can never disagree. This is what takes food/economy/capacity from a strong
heuristic (~8) to a genuine 10: the numbers are the single source of truth and the
qualitative bands *interpret* them rather than re-deriving their own.

## What already exists (and what doesn't)

The food **quantities** already exist. `foodGenerator.generateFoodSecurity` computes
the physics — `dailyNeed`, `dailyProduction`, `importDependency`, `magicSupplement`,
`storageMonths`, `foodRatio`, `deficitPct`, `surplusPct`, `resilienceScore` — and
persists them on `settlement.economicState.foodSecurity`.

The problem is **consumers don't read those quantities consistently**:

1. **Parallel model.** `capacityModel.deriveFood` recomputes its OWN food supply/demand
   from institutions/trade/population/conditions — a *different* model than
   `foodGenerator`'s caloric physics. The two can disagree (the audit's "two food
   models").
2. **Dead reads (confirmed).** `deriveSystemState.deriveResilience` (76-81) and
   `causalState.deriveFoodSecurity` (190-195) both read `foodSecurity.deficitMonths` /
   `surplusMonths` — fields `foodGenerator` **never produces** (it produces
   `deficitPct`/`surplusPct`/`storageMonths`). So the food-deficit/surplus contribution
   to resilience AND causal food_security is **always neutral** — a famine-stricken
   town's food crisis does not lower either score. (grep: `deficitMonths`/`surplusMonths`
   have 5 consumer sites, 0 producer sites.)

## The plan (staged, each slice soak-gated)

- **P3.0 — Ledger accessor (foundation, this slice).** `domain/foodLedger.js`:
  `foodLedger(settlement)` returns the canonical conserved food quantities from
  `economicState.foodSecurity`, with neutral defaults for un-generated settlements.
  One read-point; additive; no behavior change.
- **P3.1 — Fix the dead reads.** Route `deriveResilience` + `deriveFoodSecurity`
  through `foodLedger` and read the fields that actually exist (`deficitPct`/`surplusPct`/
  `storageMonths`). This makes food deficits/surpluses actually move resilience + causal
  food_security. Behavior-changing → soak/systemState/causal gated + reconciled.
- **P3.2 — Converge capacityModel's food lens onto the ledger.** Express
  `capacityModel.deriveFood`'s supply/demand in terms of the ledger quantities so the
  capacity band agrees with the foodSecurity label direction (no two food models).
- **P3.3 — Extend the conserved set** to the other capacities the model already tracks
  (labor, housing, security, healing, transport throughput): compute the conserved
  inputs once, thread them, and have the bands interpret them.

## Invariants (the tests that lock it)

- A settlement with `foodSecurity.deficitPct > 40` has *lower* `deriveSystemState`
  resilience AND lower causal `food_security` than an otherwise-identical surplus town
  (closes the dead-read).
- `capacityModel` food band direction agrees with the `foodSecurity` label (no two
  food models disagreeing) — once P3.2 lands.
- The ledger is the only place that reads `economicState.foodSecurity`'s raw quantities;
  consumers read `foodLedger(settlement)`.

## Scope note

P3 is the "becomes a richer simulation" investment and is deliberately design-first +
incremental. It does NOT turn the engine into a hard economic simulator — it conserves a
*small* set of anchor quantities so the existing qualitative bands stop disagreeing.
