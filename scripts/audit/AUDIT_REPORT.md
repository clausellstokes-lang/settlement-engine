# SettlementForge — Large-Scale Generation & Simulation Audit

A generation, simulation, distribution, and self-repair pass. Both harnesses
(`generate-audit.mjs`, `simulate-audit.mjs`) run the **real** headless engine via
`vite-node` — the same `generateSettlementPipeline` and `advanceCampaignWorld` the
app uses — so findings reflect production behaviour, not a mock.

## Headline

- **70,000+ generations, 0 throws.** 80 campaigns × 24 ticks of simulation, **0 throws, 0 anomalies.**
- **1 real bug found and fixed** (faction power leaked below 100% — commit `ad938fb`).
- **After the fix + harness recalibration, the 10k re-verify is fully clean** (0 anomalies, including all edge configs).
- The loudest raw "anomalies" were the **system working as designed** (subsumption, validator warnings) — correctly *not* changed.
- The rest are **balance/tuning calls**, flagged below with recommendations rather than silently re-tuned.

## What was tested

**Phase 1 — generation (60k + 10k re-verify).** Config sweep: 50% stratified
factorial (6 tiers × 11 cultures × 9 terrains × magic on/off), 40% fully
randomized, 10% edge/adversarial (custom/extreme populations, isolated terrain,
magic-dead metropolis, population 0). Per-settlement invariants: null/missing
fields, tier validity, population-in-range, faction-sum, town+ has factions/NPCs,
the validator's own error-severity violations, conditions-have-causes, dup NPC ids.
Plus incremental distributions for institutions, factions, NPCs, conditions,
stressors, legitimacy, corruption, hooks, stability per tier.

**Phase 2 — regional/campaign simulation.** 10 topologies (small, large, dense,
sparse, isolated, hub-and-spoke, trade-heavy, politically-fragmented, frontier,
interdependent) × 8 campaigns × 24 ticks across week/month/season/year intervals,
on the pure `advanceCampaignWorld`. Telemetry: events/tick, auto-resolutions/tick,
stressor peak + final, condition peak, stall (no events = dead), runaway
(unbounded stressors).

## What failed → what was fixed

### BUG (fixed): faction power leaked below 100% — `factionDynamics.js`
**Symptom:** faction power, a 100-point share, summed short on ~23% of small
settlements — thorp/hamlet councils at ~81–89% instead of 100%.
**Root cause:** `applyLegitimacyMultipliers` scaled each faction's power by a
legitimacy multiplier (the governing council by `govMultiplier` < 1 when
legitimacy is low) but never renormalized — the removed points just leaked. Worst
on small rosters where the penalised council is a large share with few factions to
offset; large rosters masked it with compensating boosts.
**Fix:** renormalize to integer points summing to exactly 100 (largest-remainder)
after the multipliers, then recompute power-band labels from the final share.
Preserves the intended relative legitimacy shift (`rawPower` keeps the
pre-dynamics value for the raw→effective display) and restores the share invariant
the rest of the system already enforces.
**Before → after:** thorp 25% / hamlet 20% short → **0% across all tiers (every
roster sums to exactly 100)**, verified at 60k. All 161 faction/distribution
assertions still pass; golden master regenerated; reproducing test added
(`tests/domain/factionPowerSum.test.js`); full gate green.

## Statistical findings (60k)

| Metric | thorp | hamlet | village | town | city | metropolis |
|---|--:|--:|--:|--:|--:|--:|
| Institutions (mean) | 7.2 | 15.3 | 30.4 | 51.1 | 43.0 | 49.2 |
| Factions (mean) | 2.8 | 3.5 | 5.4 | 5.8 | 6.8 | 7.0 |
| NPCs (mean) | 2.5 | 4.5 | 6.3 | 9.1 | 13.7 | 18.8 |
| Plot hooks (mean) | 3.7 | 5.8 | 8.1 | 11.9 | 18.2 | 25.4 |
| Active conditions (mean) | 0.33 | 0.34 | 0.32 | 0.29 | 0.29 | 0.29 |

- **Legitimacy:** mean 45; bands Contested 26%, Crisis 23%, Tolerated 22%, Approved 19%, Endorsed 10%.
- **Corrupt NPCs:** 3.1%. **Stressor present:** 30% (70% none), 16 types well-spread.
- **Condition severity:** medium 33% / high 67% of conditions; **no low or critical** at generation.

**Phase 2 (per topology):** 0 anomalies. Events/tick ~9–10 uniformly; stressor peak
scales with connectivity (small 2.9 → frontier/interdependent 7.25) and stays
bounded; auto-resolutions/tick scale with member count (large 35.8); 0 stalls,
0 runaways, 0 throws.

## Intended design — deliberately NOT changed (these are not bugs)

- **Institution count "inverts" (town 51 > city 43).** The subsumption pass
  consolidates craft scale-ladders into guilds at city+ — a metropolis has richer
  *major-institution diversity* but fewer raw craft entries. Working as designed;
  raw count is just a misleading size signal.
- **`structuralViolations`** are 100% `warning`-severity (`survival_crisis`) — the
  validator surfacing in-world tensions for the DM, not failures.
- **Condition severity defaults are mid-range (0.3–0.65)** → medium/high at
  generation; low/critical are reachable through simulation escalation, not at mint.
- **Events/tick ~constant regardless of region size** — the news-curation cap
  keeping the feed readable.

## Tuning recommendations — your design calls (flagged, not auto-changed)

1. **Active conditions are flat across tiers (~0.3) and bounded (≤2).** A metropolis
   plausibly should carry more simultaneous conditions than a thorp. Consider a mild
   tier scaling if you want larger settlements to feel busier.
2. **Legitimacy skews grim** (mean 45; ~49% Contested-or-Crisis). Coherent for a
   tensions-driven world, but if the default world should feel less embattled,
   soften the legitimacy curve.
3. **Corruption 3%** may be low for a product whose hooks lean on corruption.
   Consider raising the corruptible rate if it's a core gameplay lever.
4. **70% of settlements have no stressor.** Reasonable (30% in active crisis); tune
   if you want a busier baseline.

Each is a balance/design choice without a ground-truth target, so they are
recommendations, not changes — and any change shifts the golden master.

## What remains uncertain

- Whether **low/critical condition severities** actually emerge over long
  campaigns (the defaults are mid-range and escalation logic exists, but Phase-2
  captured condition *counts*, not severity bands — a future probe could confirm).
- "Appropriate rate" for the tuning items has no objective target; the bands used
  here are reasoned priors, not ground truth.

## Reproducing the audit

```
npx vite-node scripts/audit/generate-audit.mjs --count 60000 --harnessSeed 7 --out /tmp/gen.json
npx vite-node scripts/audit/simulate-audit.mjs --reps 8 --ticks 24 --out /tmp/sim.json
```

---

## Phase 2b — deep dynamics probe (do the SPECIFIC mechanics happen, at every scale?)

Phase 2 proved the sim is bounded/alive/crash-free but did not verify the specific
dynamics. `simulate-deep.mjs` runs 2 topologies × 2 authority modes (gated/auto) ×
4 interval scales × 3 reps × 30 ticks and counts the actual candidate spectrum,
applied tier changes, war lifecycle, and relationship evolution.

**The sim is richly active.** Candidate spectrum (totals across all cells), top families:
NPC agency dominates (npc_expose 19810, npc_suppress 15849, npc_exploit/bargain/
mobilize/reform/protect/seek_promotion/sabotage/defect…), population_growth 12817 /
population_decline 2282 / emigration 30, crime_pressure 11120, resource_depletion
9928, food/legitimacy/conflict/trade/disease pressure, faction dynamics
(government_challenge 2097, institution_capture 1397, rival_power_contest 835,
institution_suppression 2208), and a full **stressor lifecycle** (birth → escalate →
spread) for famine, betrayal, coup d'état (892), insurgency (508), siege, wartime,
monster-raider, mass-migration, infiltration, etc.

Answers:
- **Relationships evolve: yes.** `neutral_to_rival` fired 4094× (+ border incidents),
  plus continuous disposition drift in `worldState.relationshipStates`. Type-flips to
  rival happen under pressure; they don't flip from purely neutral, calm pairs.
- **Promotion vs demotion: a real asymmetry.** tier_promotion 814 vs tier_demotion 6
  (~135:1); promotions apply in auto mode (up to 26/run in a year-advance), demotions
  ~never. Settlements DO decline in population (population_decline 2282) but almost
  never cross a tier boundary downward — consistent with the deliberate promote/demote
  hysteresis (pantheon.js), but the ratio is extreme. **Tuning flag:** if decline
  should register at the tier level (a besieged/famined city slipping to town), the
  demotion threshold/hysteresis needs loosening. Not a hard bug — the path fires (6×).
- **Wars: conflict dynamics yes; territorial conquest needs provocation.** Siege and
  wartime stressors are BORN, ESCALATE, and SPREAD across the region (siege_spread
  788, siege_escalate 325, wartime_escalate 40, insurgency 508, coup 892). What did
  NOT fire from neutral starting conditions is organic **conquest** (0) → no
  regionalGraph `war_front` channels → `liveSieges` 0. The war PROJECTION is verified
  working (a seeded war_front reports a siege coalition correctly). So territorial war
  needs a genuine aggressor (hostile relationship + mobilization), which neutral
  random neighbours don't create — likely by design, but the conquest→war_front path
  is unverified end-to-end without a hostility setup.
- **Scales: all dynamics fire at week/month/season/year.** State evolution is
  interval-equivalent (existing test: one_year == 48 one_week ticks, byte-identical);
  longer intervals collapse the surfaced event log (intended curation), so a
  year-advance shows fewer discrete rows than 48 weekly advances.

**Harness note:** Phase 2's "0 sim anomalies" stands (bounded/alive/crash-free), but
its telemetry was too coarse to confirm dynamics — it measured `war_front`/`liveSieges`
(zero, because war activity is in the stressor lifecycle) and `relationshipStates`
type-flips (zero, because evolution surfaces as candidates). `simulate-deep.mjs`
captures the real signals.
