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

---

## Phase 2c — deity competition + religion spread

Religion is a **double-gated, opt-in subsystem**: it is a pure no-op unless
`simulationRules.religionDynamicsEnabled` is true (default **false**, exposed via the
map's "Religion dynamics" toggle / the Workshop "Awaken religion" gate, behind the
`pantheon_preview` feature flag) AND ≥1 settlement carries an embedded
`config.primaryDeitySnapshot` (assigned by the DM via `PrimaryDeityPicker` /
SET_PRIMARY_DEITY). Contests then run along `allied`/`trade_partner` faith carriers.
Phases 2/2b never exercised it (flag off, no deities, no faith carriers).

`simulate-religion.mjs` builds a religion-ACTIVE region — 6 faith centres bearing
3 rival MAJOR deities (Vael/Korl/Aurum), 8 weak-faith cult converts, edges so ≥2
deities reach each convert — and advances 3 reps × 30 ticks at each scale.

**Result: the subsystem works, and produces a coherent religious history.** Per scale
(week/month/season/year), all numbers are similar:
- **Competition:** deities contest and bank a wins/losses/seats/tier ledger
  (`worldState.pantheon`). ~57–66 wins / 43–51 losses per cell; 52 `religious_authority`
  channels minted. Final ledger of a sampled run: **Aurum 14–0, 11 seats, major** —
  one deity swept the region while every displaced cult fell to 0 seats.
- **Spread:** 43–51 conversions/cell (a convert's `config.primaryDeitySnapshot`
  re-embeds to the winning neighbour's faith), seeding `religious_conversion_fracture`
  stressors (~1/tick). Distinct faiths **consolidate 11 → 2–3** — strong deities
  absorbing weak cults.
- **Deity tiers shift:** cult→minor→major promotions 15–17/cell; demotions 2–3 — the
  same promote-biased hysteresis as settlement tiers (here it does fire downward at
  scale, unlike the settlement demotion which stayed ~0).
- **All scales:** identical-shaped activity week through year; consolidation lands at
  every interval.

**Caveats / observations:**
- **Reachability:** none of this fires in a default campaign. Religion needs the DM to
  (1) enable the rule (preview-flagged) and (2) assign deities. A campaign that does
  neither sees zero religion activity — by design, but it means the subsystem is
  invisible until deliberately switched on.
- **Possible balance note (1 data point):** the peaceful-aligned major (Aurum) swept
  the sampled run; whether winner correlates with alignment/position vs. seed is worth
  a glance if faith balance matters, but it is not a confirmed finding.

---

## Phase 3 — the unified "everything-on" whole-world soak

`simulate-world.mjs` activates EVERY subsystem at once (war layer, settlement strategy,
religion, plus every default-on organic system) on an 18-settlement region built to
trigger the conditional dynamics, then soaks it and measures whether the catalogued
dynamics fire, in balance, with no stalls or runaways. The audit found the **engine
healthy** but the **harness's coverage claims resting on two unverified grounds** — a
fixture bug that silenced the organic war loop, and several measurement gaps. Both are
now fixed; the soak below is the trustworthy re-run.

### Fixed (harness fixture): the organic war loop never fired

**Symptom.** `war_mobilization` / `army_deployed` / `strategy_deploy` / `war_drain` /
`war_exhaustion` / `mobilization_reaction_*` fired **0×**; the only conquests came from a
pre-seeded siege. The war PROJECTION worked, but the organic peace→war ramp never started.

**Root cause (NOT a per-tick rebuild).** The war gate (`buildWantsWarLookup`, pulseKernel.js)
ramps a settlement only against a `hostile`/`rival`/`cold_war` neighbour. `buildWorld`
seeded six such edges, then its alliance/trade edge loop **re-emitted an edge with the same
`edge.<from>.<to>` id over every one of those pairs** (e.g. `E(0,6,'hostile')` then
`E(0,6,'trade_partner')` for `c=6`). `ensureRegionalGraph`'s `dedupeById` keeps the **last
write**, so all six hostility seeds were clobbered to `trade_partner`/`allied` **at graph
construction, before tick 1** — `wantsWar` was false forever, posture never left peace. (The
suspected neighbourNetwork rebuild is a red herring here: generated settlements ship an
*empty* neighbourNetwork, and the pure kernel does not rebuild the graph from saves.)

**Fix.** Seed durable hostility in the three places the engine reads, none of which the
alliance loop can now clobber: (1) the regionalGraph edge (the alliance/trade loop skips any
hostile pair); (2) `worldState.relationshipStates` (the gate reads this first, and an
existing state is sticky across ticks); (3) each end's `neighbourNetwork` (so a store-layer
`deriveRegionalGraphFromSaves` re-mints the hostile edge rather than refreshing it away) —
the same durable-hostility shape `tests/domain/mobilizationPulse.integration` uses. The
pre-seeded siege was removed so every conquest is now organic. **No engine code changed.**

**Verified (an isolated probe + the full soak):** the ramp fires on schedule —
peace (t1-2) → alert (t3-4) → war_preparation (t5-6) → mobilized (t7) → deployed (t8) — and
the loop is **bounded and self-terminating**: it bleeds the home economy
(`war_drain`/`army_deployed`), accrues a non-reverting `war_exhaustion` scar, and de-escalates
via `sue_for_peace`, after which scarred settlements demobilize back to peace. The
`COOL`/`shouldCool` gate was left untouched.

### Fixed (harness measurement) — so the next soak is trustworthy

| Gap | Before | After |
|---|---|---|
| corruption onsets | dead counter (no engine 'onset' event; regex never matched) | diff `npcStates[id].corruption` false→true tick-over-tick |
| institution gains/losses | `institutions.length` deltas (closures mutate in place → ~0) | count `_worldPulseInactive` flips (active↔inactive) + new founded ids |
| rolled vs landed | `candByType` counted ROLLS only | added `appliedByType` from `autoApplied` (what LANDED) |
| stressor share | live-tick AUC only (persistence-weights long-lived types) | added `stressorBirthsByType` (true generation share) alongside the AUC |
| scale comparison | varied seed+interval at fixed 14 ticks; each tick took a coarse interval magnitude (≈7.8× for one_year) → spurious "+89%" / "interval collapse" | hold seed FIXED, run `ticksForInterval` REAL one-week ticks (1/4/12/48) |
| multi-month population | single coarse kernel tick stacked → artifact | drive `simulateCampaignWorldInterval`; cross-checked against the weekly run (`intervalEquivalence`) |
| novelty tail | measured tail family DENSITY, mislabelled novelty | renamed `tailFamilyDensity`; added `lateNovelFamilies` (families first-seen in the window) |
| population recovery | inferred from min/max only | emit a per-tick `popPerTick` trajectory |

Plus self-diagnosing `flags` (e.g. `WAR_LOOP_SILENT`, `NO_ORGANIC_CONQUEST`) so a future soak
fails loudly if a load-bearing dynamic goes quiet, and a `--scales 0` switch for a fast core run.

### Result — the re-run (160 ticks / 2 reps, all subsystems on)

**0 throws, 0 stalls, HEALTH OK, 91 distinct dynamics fired** (cand/tick 119-155, mean 136).

- **Organic war loop, end-to-end:** war_mobilization 308, strategy_deploy 90, army_deployed
  204, war_drain 204, war_exhaustion 317, sue_for_peace 57, mobilization_reaction 1; **12
  conquests, all organic** (12 rolled → 12 applied), occupations bounded at peak 5. The loop
  starts, deploys, exhausts, and sues for peace repeatedly — bounded, not a runaway.
- **Rolled vs landed (the new signal):** betrayal 1241 rolled → 1 landed; coup_detat 100
  rolled → 0 landed. The coverage report now shows both, so "rolled but never lands" is
  visible instead of inflating the fired-dynamics count.
- **Births vs live-AUC:** by GENERATION, betrayal dominates (1241, ≈56% of births) and
  religious_conversion_fracture is small (84, ≈4%); by live-tick AUC, rcf dominates (283) —
  confirming its apparent "monoculture" is episodic residual echo, not generation share.
- **Population is bounded and recovers:** the maximal six-front war world declines ≈28% over
  160 ticks but oscillates (per-tick min 102,548, max 165,076 — recovery is now measured, not
  inferred). The deliberately-belligerent fixture makes the decline expected; it never
  collapses or runs away.
- **Scales are interval-equivalent:** fixed-seed weekly ticks give a gentle, monotonic
  population curve (one_week 0% · one_month -0.7% · one_season -5.7% · one_year -26%), and
  `simulateCampaignWorldInterval` reproduces each EXACTLY (`match=true` at month/season/year).
  The old "+89% / interval collapse" was harness arithmetic, now gone.

**Net:** the engine PASSED (0 throws/stalls/runaways, well-spread families, bounded-and-
recovering population, load-bearing conquest→occupation→conversion coupling), and the soak
now actually exercises — and can be trusted to report — the organic war loop.

### Reproducing

```
npx vite-node scripts/audit/simulate-world.mjs --ticks 80 --reps 2 --out /tmp/world.json
npx vite-node scripts/audit/simulate-world.mjs --ticks 40 --reps 1 --scales 0 --out /tmp/core.json   # fast core soak
```
