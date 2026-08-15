# Phase 5 W-C1 — the war cluster: evidence bundle

Deterministic soak measuring the four W-C1 work items as **landed** (tuning nothing).
Regenerate: `node scripts/audit/war-cluster-soak.mjs 2>war-cluster-soak.json | tee war-cluster-soak.txt`

- `war-cluster-soak.txt` — the four envelope panels (human-readable).
- `war-cluster-soak.json` — the same numbers as machine-readable evidence.

## The four items and what the soak proves

### Item 4 — DOWN_DECAY retune (panel A)
`DOWN_DECAY` moved **0.04 → 0.002** (weekly-tick temporal constitution). At week scale:

| DOWN_DECAY | half-life | full → drop-threshold |
|---|---|---|
| 0.04 (old, month-contaminated) | 17 wk (**0.3 yr** — a season) | 125 wk (2.4 yr) |
| 0.003 | 231 wk (4.4 yr) | 1690 wk (32.5 yr) |
| **0.002 (chosen)** | **347 wk (6.7 yr)** | **2536 wk (48.8 yr)** |
| 0.001 | 693 wk (13.3 yr) | 5073 wk (97.6 yr) |

**Why 0.002:** it lands peacetime readiness erosion on a **years** scale (half-life 6.7 yr)
and full demilitarization on a **decades** scale (~49 yr) — the owner's target ("not
seasons"). 0.003 halves too fast (4.4 yr feels like a single ruler's peace); 0.001 pushes
full-rust toward a century (a fortress town never forgets war across an entire age). The
patron megaphone spreads the chosen rate **3.9 yr (peacelike) … 10.4 yr (warlike)**.

### Item 2 — threat environment (panel B) + the NEUTRALITY THEOREM
`warFooting01` gains a bounded `threat` term derived **only** from world war records
(live war fronts, occupations, war-type stressors — including the `betrayal` stressor,
which is the actualized deity stance-lane hostility) touching the settlement or a
relationship-graph neighbour. A standing menace **arms a town over years** even with no
war of its own (1 nearby front → readiness 0.67 at 26 wk, ~1.0 by 2 yr); **peace never
climbs** (stays 0).

**Neutrality theorem (pinned):** `buildThreatByCid` returns an empty map — and every
`threat` is 0 — when the world carries no such record. A famine stressor and a hostile
*relationship* rival edge create **no** threat (a relationship-minted phantom war_front is
skipped by the same `isLiveWarFront` provenance gate the siege loop uses). Test
`tests/domain/warClusterWC1.test.js` proves `advanceMartialReadiness` is **byte-identical**
with vs without famine+rival noise, and the `worldpulseDeityGolden` / `religionDormancy`
byte-identity gates stay green.

*Balance note for review:* a single nearby front drives a faith settlement to maxed
readiness within ~2 yr. This only fires for deity-bearing settlements in a world with a
live war layer; `FOOTING_THREAT_W` (0.3) is the knob if the arms-race response reads too hot.

### Item 3 — supply-gap quality penalty (panel C)
New leaf `src/domain/worldPulse/supplyQuality.js`. `deployedQualityMult` reads
`supplyCompleteness` over the 5 core war-kit commodities (arms, iron, leather, livestock,
provisions) and maps mean completeness to a **floored** `[0.55, 1]` multiplier on deployed
strength + attrition-mitigation kit:

| war-kit self-supply | deployed quality × |
|---|---|
| 0/5 (chainless) | **0.550** — floor: degraded, never zero |
| 3/5 | 0.798 |
| 5/5 (self-sufficient arsenal) | 0.964 |

**Flag-gated** (`warSupplyQualityEnabled`, default off) exactly like its war-layer spike
siblings (`defenderAttritionEnabled`, `warEconomyDrainEnabled`, …) — OFF ⇒ byte-identical,
so the war-test corpus and golden fixtures are untouched. It does **not** feed readiness
accrual (readiness = training; supply = kit).

### Item 1 — rust at deployment sizing + suing-for-peace (panel D)
Both reuse `fidelityNoise.fidelityFactor` (no second noise system). Mean |error| over a
4000-draw seeded cohort:

- **Sizing** (rust only, `chaosPull` 0 ⇒ any alignment): seasoned (exp 1.0) → **0.000**
  (byte-identical, no rng forked); a first-war realm (exp 0) → mean 0.176, max **0.350** =
  `RUST_MAX_ERROR` — symmetric over/under-commit, capped at the rust geometry.
- **Peace** (chaos + rust, war-entry geometry): a **lawful** realm reads the war-bankruptcy
  threshold true when seasoned (0.000) — only rust perturbs it; a **chaotic-devout** realm
  mis-reads (mean 0.295 seasoned → 0.377 rusty, max **0.750** = `TOTAL_MAX`) → a delayed or
  premature suit. "Lawful reads the calculator true, chaos mis-reads, rust worsens everyone."

## Gate status
See the W-C1 implementer report. Golden corpus (`generatorGoldenMaster`,
`worldpulseDeityGolden`, `religionDormancy.byteIdentity`) byte-identical — no regen.
