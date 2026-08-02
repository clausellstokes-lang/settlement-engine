# THE DEMOGRAPHIC ENGINE — wave P (owner-ratified 2026-08-01)

**Status:** ARCHITECTURE COMPLETE, build authorized as the FINAL simulation-changing
wave of the realm-directives program. Every soak redo waits on this wave.

**The finding it cures (executed evidence):** the 300-year research soak
(`research-300y-12s-seed1.json`, source b66e9551, preserved in the session
scratchpad) FAILED `realm population bounded`. Two settlements compounded at a
smooth ×1.07/year to 29.1 trillion and 16.4 trillion people by year 300 while six
siblings floored at 200–500. The realm BIFURCATES: unbounded winners, floored
losers, nothing between. Invisible at 30 years (both seeds green, reading as
healthy differentiation ×0.06–×5.4). Root cause: **the population model has births
without a death side, growth without a carrying capacity, and no redistribution.**
Decline has a floor; growth has nothing. This document is the missing half.

**The owner's ratified design (2026-08-01, verbatim intent):** density maxima by
tier, even metropolis; food and food deficit as the master bounds; satellites as
purposeful food/resource acquisition for the parent, need-weighted through the
seeded draw; overflow to satellites before tier upgrade, and as the only valve at
the metropolis ceiling; a realm-scale food conservation effect that correlates
population with the settlement portfolio and fuels war, trade, expansion, and
conquest up to a point; realm density curbed intentionally through stressors —
disease, war, catastrophe, beast raids; populations die NATURALLY, from old age
and the likes, unlike named NPCs; higher deaths AND emigration under food
deficit, low prosperity, low defense, and low internal security, where
appropriate.

---

## §0 THE DEFECT, GROUNDED (executed verification 2026-08-01 — supersedes every
## earlier hypothesis, including my own and the external review's)

**THE RUNAWAY AND THE FLOOR ARE THE SAME DEFECT.** Both halves of the
bifurcation come from ONE uncapped proportional rate read through ONE integer
deadband:

```
src/domain/worldPulse/populationDynamics.js:277  monthlyRate = 0.0018 + (stability - 0.5) * 0.012   // no carrying capacity
src/domain/worldPulse/populationDynamics.js:303  const rawDelta = Math.round(pop * rate * magnitude);
src/domain/worldPulse/populationDynamics.js:305  if (Math.abs(delta) < Math.max(2, Math.round(pop * 0.001))) return null;
```

A settlement below ~2,500 people must produce |delta| >= 2 or **no candidate is
emitted at all**. Because rawDelta scales with pop, a shrinking settlement
shrinks until its delta rounds to -1 and then **freezes permanently**.
Equilibrium is `pop* = 1.5 / (|monthlyRate| x intervalMagnitude)`.

Executed against the real evaluator and the real full_simulation preset at
one_year intervals (the soak's own configuration), 300-year trajectories from
pop=1200 under constant pressure p:

| p | y50 | y100 | y300 | next delta |
|---|---|---|---|---|
| 0.60 | 1533 | 1964 | 5280 | +26 (unbounded) |
| 0.62 | 1400 | 1621 | 2931 | +9 (unbounded) |
| 0.67 | 1100 | 1000 | 756 | 0 — FROZEN |
| 0.68 | 1044 | 894 | 504 | 0 — FROZEN |
| 0.70 | 934 | 728 | 301 | 0 — FROZEN |
| 0.75 | 729 | 442 | 151 | 0 — FROZEN |

**The soak's 200-500 band is reproduced exactly at p ≈ 0.68-0.70.**

**CONSEQUENCE FOR THIS WAVE (binding):** a carrying-capacity ceiling alone
fixes the top and leaves the bottom frozen — the bifurcation survives with
smaller winners. **P1 must also remove the deadband's attractor property on the
decline side.** The in-flight P1 change suppresses only the GROWTH lane behind
`demographicsEnabled`; the decline lane and this deadband were explicitly left
untouched. That is a HOLE, not a scope boundary, and P1a closes it.

**FOUR INTUITIVE HYPOTHESES ABOUT THE FLOOR ARE ALL REFUTED** (each grepped and
disproven — anyone reasoning from them designs the wrong cure): there is no
population clamp anywhere (only `Math.max(0, ...)`); it is NOT the named-cast
floor (`reconcilePopulationFloor` has **zero production callers**, and
`npcConsequencesEnabled` is false in the soak preset); the growth term DOES go
negative (rate spans [-0.0042, +0.0078] before modifiers); and it is NOT the
zombie-cure dwell gate (that engages at <= 4 people; the floored six sit at
200-500).

### §0b What the tree ALREADY has (the review's premises, verified)

- **FOOD STOCKS EXIST.** `advanceFoodStockpile`
  (src/domain/worldPulse/foodStockpile.js:279-488) is a real conserved,
  tick-advanced stock: opening balance clamped to a granary capacity, surplus
  fill at 0.6, a reserve tithe, rationed drawdown capped at 50% of stores per
  tick, hysteresis giving the pair a fixed point, and a live resilience re-grade.
  A siege ALREADY has a staged arc. **Do not build a second stock — extend this
  one.** The three REAL gaps: (1) no spoilage/decay sink anywhere; (2) the stock
  is denominated in MONTHS OF NEED, not absolute food, so a population change
  silently revalues the granary; (3) `dailyProduction`/`dailyNeed` are
  GENERATION-FROZEN, so consumption does not follow the head count at tick time —
  **K_food and the granary diverge the moment population moves.** Gap 3 is the
  demographic engine's problem to fix, not to inherit.
- **`storageMonths` HAS FIVE WRITERS** (foodStockpile, generosityUpdates, war
  sack in applyWorldPulse, K3's magicBufferApply, and the DM grain verb). The
  production/need/deficit half IS single-writer (`generateFoodSecurity`, one call
  site, with `deriveFoodBalanceAnalysis` demoted to a view and pinned). A new
  stock term becomes writer #6 unless it joins foodStockpile. A single-writer
  ratchet for `storageMonths` is the missing structural guard.
- **DEPENDABLE-vs-NOMINAL IMPORTS DO NOT EXIST.** `config.tradeRouteAccess` is a
  static generation value with read-only consumers; import coverage is a static
  per-token table. The only live modulators are siege-specific. Route reliability
  affecting delivered food is NEW WORK, not a retune.
- **DEMOTION ALREADY EXISTS ON THREE PATHS**, the primary one ON BY DEFAULT
  (`tierDriftEnabled` is true in DEFAULT_SIMULATION_RULES): organic tier drift
  with a consecutive-streak gate deliberately easier than promotion's, emergent
  calamity demotion via `popToTier`, and the DM's SHIFT_TIER verb. Demotion is
  conservation-exact (a pure label change). **A new density-driven demotion would
  be a SECOND WRITER on the same transition — extend tier drift's eligibility
  instead.**
- **PROMOTION IS NOT CONSERVED.** `tierOutcomeApply.js:308-316` raises population
  to the new tier's minimum, self-annotated as "a deliberate (unconserved) mint".
  This VIOLATES law 4 and must be dispositioned explicitly before the
  conservation check can be exact (see §14).
- **DISPERSAL IS WRITTEN BUT UNWIRED, AND DOES NOT SCATTER.**
  `disperseCastToPool` has exactly one grep hit — its own definition. Even lit,
  it moves souls to a POOL with `hostSettlementId: null`; placement is a separate
  uncalled flow. The LIVE terminal lane marks NPCs `dispersed: true` and keeps
  them on the dead settlement's roster (THE FATES PIN). Worse: the floored
  settlements can never reach the death lane at all, because it has a thorp-tier
  precondition and 200-500 is above the thorp ceiling of 60. **The tier gate and
  the deadband must be fixed together.**
- **STRESSOR INCIDENCE HAS EXACTLY ONE SEAM.** Incidence is a function of ONE
  number, the pressure score (birth-threshold gate + emission probability).
  Population has effectively no coupling today and "density" in that code is a
  tier ordinal. Demographic coupling means adding contributors to the causal
  derivers or new condition archetypes — NOT retuning a weight. Two traps: the
  pop>=5000 steps SATURATE (a new term must be continuous or the whole runaway
  range collapses into one bucket), and the housing-pressure consumer sits behind
  a hard gate.
- **WAR ALREADY HAS AN ECONOMIC MOTIVE, AND NO DEMOGRAPHIC ONE.**
  `resource_pressure` is a first-class casus belli wired into the live per-pair
  loop, scored off `pressureBlend` = 0.6 x food + 0.4 x economy. Law 6's
  insertion point is `scoreResourcePressure`'s own01/foe01 terms, with
  RESOURCE_ENVY_GAIN and the x1.30 war-factor cap already supplying the banded
  appetite. **Do NOT build a parallel motive path** — the casus taxonomy is
  walker-enforced for totality and bijection.

---

## §1 The laws (constitutional for this wave)

1. **DEMOGRAPHY IS A DIFFERENCE OF RATES.** Net growth = births − deaths ± net
   migration, every tick, for every settlement. There is no growth term that is
   not a birth, no shrink that is not a death or a departure. The ×1.07 compound
   dies here: equilibrium is where the rates meet, not where a clamp bites.
2. **FOOD IS THE CAP; DENSITY IS THE RATE.** Carrying capacity K is derived from
   food (local production + net imports through the route ledger). The tier
   density ceiling governs how fast population may approach K and when overflow
   fires. The two never fight because they answer different questions: K says how
   many can EAT; density says how many can FIT before the settlement must shed,
   sprawl, or ascend. The effective bound is min(K_food, D_tier), and which one
   binds is itself a diagnosis the Herald can name ("the granaries are the wall"
   vs "the walls are the wall").
3. **NAMED SOULS ARE EXEMPT.** Natural mortality, migration pressure, and every
   stressor in this wave act on the population NUMBER. No engine path may remove
   a roster character or a world-ledger NPC: the DM's KILL verb remains the only
   named death (H4's pinned law), and H3's floor (population ≥ resident named
   cast) is this wave's hard floor. The cast is the floor; food is the ceiling.
4. **DAMAGE TRANSMUTES, PEOPLE ACCOUNT.** Every death and departure is
   conservation-visible: deaths reduce the number with a cause class; emigrants
   ARRIVE somewhere (or join a migration column in transit) — the realm total
   changes only through births, deaths, and world edges, never through arithmetic
   convenience. The soak's realm-conservation check becomes exact.
5. **CURBS ARE WORLD EVENTS, NEVER INVISIBLE MATH.** Disease, beast raids,
   catastrophe, and war curb density through the EXISTING stressor machinery with
   incidence coupled to demographic state — a packed, hungry city invites plague;
   a sprawling underdefended satellite invites raids. No silent per-tick
   percentage shaves population without a nameable event or a natural-mortality
   line the dossier can state.
6. **ENDOGENOUS MOTIVE, BANDED APPETITE.** Carrying-capacity pressure feeds the
   war/trade/expansion motive weights ("up to a point"): pressure raises the
   weight inside an authored band and never past its cap. The realm develops
   reasons, not mania.
7. **THE PROMISE HOLDS.** The wave ships dark behind ONE virtual flag
   (`demographicsEnabled`, absent from DEFAULT_SIMULATION_RULES), byte-identical
   when dark by object identity, lit in the full_simulation preset only at the
   owner-signed soak redo. Every band in §13 is tuning-pass property.

## §2 The canonical model

`worldState.demographics` — conditional, drop-when-empty, ONE writer
(`src/domain/worldPulse/demographicsKernel.js`):

```
DemographicState (per settlement, derived-where-possible, persisted-minimal):
  vitality: {
    birthBand:  word     // authored band from tier + prosperity + culture
    deathBand:  word     // authored band from tier + age structure proxy
    pressure01: number   // population / min(K_food, D_tier), clamped [0..2]
  }
  // K_food and D_tier are DERIVED every tick, never stored (never-store-a-
  // derivable). The persisted surface is only what cannot be re-derived:
  migrationDebt: { in: int, out: int, sinceTick: int }   // transit accounting
  overflowLedger: [ { tick, kind: 'satellite'|'migration'|'refused', count } ]
```

Derivations (pure leaves, all zero-PRNG except where noted):

- **`foodCapacityOf(settlement, world)` → K_food.** Local food production
  (existing foodBalance channels, incl. K4's substitution channel at its cap) +
  net food imports (J2's goods flows on live edges, signed) − obligations
  (exports under treaty), converted to mouths-fed through ONE authored
  `MOUTHS_PER_FOOD_UNIT` table (finite semantics: banded by tier, never a float
  surface). Interdiction consequence is automatic: cut the artery, imports fall,
  K falls, §4's mortality/emigration terms rise. Siege-by-starvation is this
  line, not a feature.
- **`densityCeilingOf(settlement)` → D_tier.** The authored per-tier table
  (thorp … metropolis), terrain-adjusted (a mountain terrace holds fewer than a
  plain), METROPOLIS INCLUDED — the top tier's ceiling is the design's point.
- **`demographicRates(settlement, world)` → {birth01, death01}.** Birth from the
  birth band modulated DOWN by pressure (crowding suppresses); death from the
  death band modulated UP by pressure, food deficit, and the §8 stressor
  couplings. Natural mortality (old age and the likes) is the death band's
  floor — it exists at zero pressure, in the happiest town, forever.

### §2b THREE READINGS, NEVER ONE DIAGNOSIS (review amendment 1, accepted 2026-08-01)

Reserves are NOT carrying capacity — a warehouse of grain buys TIME, never
permanent headroom. The engine therefore exposes THREE independent readings,
each with its own bands, and NO single "binding cause" enum collapses them:

- **foodFlowRatio** — recurring production + dependable imports vs recurring
  consumption. K_food derives from FLOW ONLY (P1 already builds this way:
  K_food reads dailyProduction, never storageMonths — reserves are excluded
  from K by construction, and that exclusion is pinned).
- **reserveCoverage** — how long stores cover the current deficit. THIS READING
  ALREADY EXISTS: foodStockpile's storageMonths + rationed drawdown IS the
  reserve horizon (§0b). The wave formalizes it as a named band and closes its
  three verified gaps (spoilage sink; absolute-food denomination; tick-time
  need following the head count).
- **urbanLoadRatio** — population vs D_tier.

A settlement can be food-insecure, reserve-rich, and overcrowded AT ONCE, and
politically able to address only one of those — so consequences key on the
COMBINATION (deficit+high reserves+comfortable ⇒ import policy and lower
births; secure+high+critical ⇒ construction, promotion, satellites; deficit+
low+critical ⇒ rationing, displacement, disease risk). min(K_food, D_tier)
survives ONLY as the safety bound and the pressure01 denominator, never as
the behavior selector.

## §3 Natural demography

Every advance, per settlement: `next = pop + births − deaths + arrivals −
departures`, with each term integer, seeded where stochastic (ONE fork,
`demographics:<settlementId>`, draw-accounted per the wave-E instrument), and
each term receipt-visible in the pulse's demographic line. Old-age mortality is
the guaranteed nonzero death floor. The logistic shape emerges: far from the
bound, births dominate (the familiar growth); approaching min(K, D), the
pressure terms close the gap; past it (a K collapse under siege), deaths and
departures dominate. No clamp anywhere — a settlement CAN briefly exceed K
(famine lag is real and narratable) and then pays for it.

The H3 floor composes structurally: the death/departure draw is taken against
`pop − residentNamedCount` (the same subtraction the terminal-decline lane
already learned in §9 of the NPC design) — the engine starves the number, never
the cast.

## §4 Migration — the push-pull homeostat

The bifurcation's cure at BOTH tails. Per advance, per settlement, a pure
push score and pull score from the owner's four drivers plus food:

- **PUSH:** food deficit (K_food < pop), low prosperity (the existing prosperity
  read), low defense (the defense score the dossier already computes), low
  internal security (corruption exposure + crime pressure via the existing
  reads) — each banded, "where appropriate" honored by per-driver applicability
  guards (a garrison town's soldiers don't emigrate over low prosperity).
- **PULL:** food surplus (K_food > pop), prosperity, safety, and route
  reachability — pull is evaluated ONLY over settlements reachable on the lived
  route network (J4's adjacency), distance-discounted by the same hop costs
  people actually pay.

Emigrants leave as population-column entries in the EXISTING migration ledger
(J2 already counts these as population flows — the desire-path accounting was
built for this), travel at column speed, and ARRIVE (law 4). The overcrowded
city sheds toward the starving village; the floored six become destinations the
moment they have food slack; and the whole homeostat runs on machinery that
exists today. Zero new ledger kinds.

## §5 Overflow — satellites before ascension

When pressure01 crosses the overflow band and the settlement is below its
tier ceiling's promotion window, the EXISTING satellite lane (wave E) is asked
first: can a steading take the overflow? The ask is need-weighted:

- **The parent's need vector** (from J2's unmet-demand goods vocabulary — food
  first when K_food binds, ore/timber/etc. when the economy's gaps say so)
  re-weights wave E's suitability draw. Need × topographic availability: the
  mountain parent needing grain whose orbit offers only stone GETS the quarry
  camp — the grain problem survives, becomes a J2 corridor demand, and feeds §6's
  motives. Just because they want it doesn't mean they get it; it increases the
  chances (the owner's words; the house seeded-weighting idiom exactly).
- Population transfers stay conservation-exact (the wave E pin extends).
- **Promotion is EARNED:** tier upgrade requires pressure sustained at the
  ceiling AND K_food headroom at the NEXT tier's appetite (your food base must
  afford the city you're becoming) AND the satellite web where the tier expects
  one. This replaces the bare population-threshold crossing and cures the
  promotion-ladder flatness item on the tuning agenda.
- **At the metropolis ceiling** there is no next tier: overflow, migration, and
  §6's expansion motives are the only valves — by design, the top of the ladder
  leaks ambition outward instead of numbers upward.

### §5b Spatial density — the land is the last ledger (owner amendment 2026-08-01)

The map must never crowd, and the count of settlements must cap ORGANICALLY:

- **THE PROXIMITY BAND (owner clarified: against ANY settlement, both ends):**
  every engine-founded settlement (satellites included) must land inside a
  band measured against the WHOLE realm, not just its parent — no closer than
  `MIN_SEPARATION` to ANY existing settlement (tier-pair banded: a steading may
  sit nearer a thorp than a metropolis may sit to a city), and no farther than
  `MAX_REACH` from its NEAREST existing settlement, whichever settlement that
  is. The max is a reach-the-web law, not a parent leash: the realm grows
  contiguously, never as isolated pockets in the deep wild. A satellite still
  PREFERS its parent's orbit (wave E's annulus stands as the placement
  preference), but the LAW it must satisfy is realm-wide on both ends. Wave E's
  annulus and wave G's tier-banded spacing already speak this vocabulary; this
  section graduates them from placement preferences into REALM LAW.
- **THE USER EXCEPTION (sovereign hand):** user-placed settlements are exempt
  from the band, exactly as user routes are lifecycle-immune. The engine never
  refuses the DM's hand; it only disciplines its own.
- **THE ORGANIC COUNT CAP:** because every engine founding needs a legal spot,
  the map's geometry itself bounds the settlement count. Saturation is
  DISCOVERED, never precomputed: the overflow lane's bounded candidate
  enumeration (wave E's capped set, Weyl-sampled) simply comes back EMPTY after
  the band filters — that empty answer IS the saturation signal, cheap and
  honest, re-asked every attempt as the map and its ruins change.
- **AT SATURATION, THE LADDER TAKES OVER — WITH CONSERVATIONS:** when no legal
  ground remains, overflow has no founding valve, so pressure resolves through
  TIER MOVEMENT: sustained pressure with next-tier food headroom promotes
  (§5's earned ascension — the same people on the same ground, holding more
  because the settlement has become MORE); decline demotes down the same
  ladder. Both are conservation-exact: not one person is created or destroyed
  by a tier transition; the promotion absorbs the overflow ledger's refused
  count into the higher tier's density ceiling. A saturated realm stops
  sprawling and starts DEEPENING — which is what old countries do.

### §5c THE PLAN, NOT THE REROLL (review amendment 3, accepted)

The response draw fires when a pressure episode CROSSES a band threshold,
never per tick — and the selected response becomes a PERSISTENT PLAN riding
the existing proposal/commitment machinery: proposed → underway → completed /
failed / abandoned, with startup cost, duration, progress, failure conditions,
a reconsideration threshold (band-crossing magnitude, not drift), a cooldown
after abandonment, and a receipt naming why it was chosen. ONE active plan
per settlement (the scope trim: this rides the docket architecture, it is not
a general planning system). A city that commits to founding a satellite does
not change its mind because one weekly ratio moved a fraction — deterministic
AND coherent. Draws are keyed by (realm, settlement, episode, response) so an
unrelated candidate's appearance cannot steal a draw from another
settlement's history (the wave-E stream-theft law applied forward).


## §6 The realm food conservation effect, and what it fuels

Realm-scale: Σ population tracks Σ K_food loosely (not strictly — food is
created and destroyed at all times, the owner's phrasing), with the divergence
`realmPressure01 = Σpop / ΣK_food` emitted per pulse into the behavioral
observation (an additive v5 field beside J2's self-sufficiency). realmPressure
feeds, inside authored caps (law 6):

- **war-motive weight** (conquest as carrying-capacity release; the war layer's
  endogenous WHY),
- **trade-agreement propensity** (buy the grain before you bleed for it),
- **expansion/satellite propensity** (the §5 lane's realm-level appetite),
- and STOPS at its band cap — "up to a point."
- **MOTIVE / CAPABILITY / OPPORTUNITY / BELIEF (review refinement, accepted):**
  scarcity creates motive; surplus creates CAPABILITY (armies eat). The war
  read splits them: a starving fractured realm WANTS war and cannot wage it;
  a fed realm CAN and may not need to. And the actor acts on PERCEIVED
  scarcity through its belief map — never omniscient truth — so a court can
  invade a neighbor it wrongly believes grain-rich and destroy the route both
  needed. Insertion point per §0b: scoreResourcePressure's own01/foe01 terms
  (the EXISTING wired casus belli), fed through the belief read; never a
  parallel motive path (the taxonomy is walker-enforced).

## §7 Stressor coupling — populations reasonably die

The existing stressor machinery gains demographic incidence coupling, banded:

- **Disease:** incidence weight rises with density pressure AND food deficit
  (the packed granary-empty city). Severity draws down population through §3's
  death term with cause class `plague`.
- **Beast raids:** weight rises for LOW-DEFENSE settlements and satellites
  (the sprawl pays for its cheap land).
- **Catastrophe:** unchanged incidence (K3's buffer already prices mitigation);
  its deaths now flow through §3's accounting instead of ad-hoc subtraction.
- **War:** deaths through the existing war lanes, now conservation-visible;
  conquest transfers population and K (territory) — the release valve.

### §7b THE VIABILITY LADDER (review refinement, accepted)

Nonzero population and functioning-settlement status are DIFFERENT facts. A
ruined city holding one named hermit does not trade, field armies, or emit
institutional output. The lifecycle's existing grades extend to: viable →
failing → evacuating → remnant (occupied) → remnant (empty), with movers
gated on the grade (the K1 status system's precedent: liveInstitutions for
buildings, this ladder for the settlement itself). The named soul counts
toward population (the owner's law) while the PLACE has ceased to function —
both laws hold. §0b's finding folds in here: the terminal lane's thorp-tier
precondition is replaced by the ladder, so a nonviable town descends and dies
properly instead of freezing at 300 people forever.

## §8 Integration seams (all existing, none rewritten)

| Seam | This wave's use |
|---|---|
| settlementLifecycleKernel | HOST: the demographic step replaces the raw growth line; decline/terminal lanes unchanged (they already work — the soak proved it) |
| foodBalance + K4 substitution | K_food's production side (substitution counts at its cap; magical dependency = demographic fragility for free) |
| J2 flows / J4 adjacency | K_food's import side; migration reachability + costs; interdiction ⇒ K collapse |
| Wave E satellites | the overflow lane + need-weighted acquisition |
| H3 floor + circulation | named-cast floor; roamers ride the same push-pull reads |
| calamity/war/stressor lanes | §7 couplings; K3 buffer unchanged |
| Herald | demographic lines per the address law ("Grain ran short in Ashford; three hundred took the north road") |

## §9 Determinism, dormancy, discipline

One fork per settlement per tick (`demographics:<id>`), draw-accounted;
seed-family totality pins for every restriction (never single-seed); structural
purity scans; dark = object-identity byte-equal (the fenced golden BEFORE the
wiring, per the J1 precedent); zero any-casts; kernel math primitives; the
certification row (`demographicsEnabled`, Growth lane) authored with the wave.

## §10 The tuning surface (owner-signed at the soak redo, per THE PROMISE)

Birth/death bands per tier · MOUTHS_PER_FOOD_UNIT · density ceilings per tier
(+terrain adjust) · pressure curve shape · overflow band · promotion window +
headroom requirement · push/pull driver bands + applicability guards · migration
column speed · realmPressure motive caps · stressor incidence couplings.
MIN_SEPARATION per tier-pair · MAX_REACH to the nearest settlement · the saturation
re-ask cadence.
Every one banded, none a bare float on a surface.

## §11 Wave slicing (build order)

- **P1 — THE RATES** (LANDED 2026-08-01, cure measured: 8 settlements x 300
  years all plateau at fixed points; the pre-cure control re-creates the
  runaway from the same fixture): demographicsKernel, K_food from FLOW,
  D_tier, the §3 step, certification row, object-identity dormancy fence.
- **P1a — THE FLOOR (from the §0 finding):** remove the integer deadband's
  attractor on the decline side (emit the candidate at |delta| >= 1 when
  declining, or accumulate fractional decline across ticks — implementer's
  choice, pinned either way); fix the terminal lane's thorp-tier precondition
  so a nonviable non-thorp can descend the ladder and die; wire tier drift's
  EXISTING demotion as the descent path (never a second writer); disposition
  the promotion mint (tierOutcomeApply's unconserved population raise) against
  law 4. The floored-six seed must UNFREEZE.
- **P2 — THE HOMEOSTAT FIRST (review amendment 2: migration precedes response
  competition, because you cannot choose between moving people to existing
  capacity and founding new settlements until destination competition
  exists):** push-pull migration over the lived network, destination
  competition (existing settlements with spare capacity outcompete new
  foundings), arrivals + transit accounting, refugee vs voluntary classes.
- **P3 — THE VALVES + PLANS:** overflow responses as WEIGHTED COMPETING
  options (satellite / promotion / infrastructure / imports / emigration —
  the owner's "where reasonable and appropriate", never a fixed order), the
  §5b spatial law, earned promotion, AND §5c's commitment model.
- **P4 — THE WORLD'S HAND:** causal risk conditions (crowding raises disease
  susceptibility CONTINUOUSLY — §0b's saturation trap noted), war
  motive/capability split through the PERCEIVED-scarcity belief read,
  realmPressure emission, Herald lines, the viability ladder (§7b).

**Acceptance — THE FOURTEEN CLAIMS (the review's contract, adopted verbatim as
the wave's certification):** (1) no unexplained exponential growth — sustained
positive growth requires identifiable capacity expansion; (2) reserves delay
crisis, never create permanent capacity; (3) capacity expansion produces
RENEWED bounded growth (stepwise history, NOT a flat plateau — a plateau
criterion would fail a healthy realm and tempt tuning to flatten the model);
(4) food-bound and crowding-bound settlements behave DIFFERENTLY; (5) responses
do not flap (plans persist to receipts); (6) existing settlements compete with
and usually beat new foundings; (7) founding conserves people and capital;
(8) territorial opportunity is finite but dynamic (saturate/reclaim/reopen,
receipted); (9) low-population settlements recover, demote, or die — NO
unexplained floor beyond the named-cast dispersal rule (the §0 deadband must
be provably gone: the floored-six seed unfreezes); (10) risk stays causal —
disease and war correlate with enabling conditions, never with a hidden
population target; (11) replay exact hash-for-hash; (12) direct == worker;
(13) seed families, never the one pathological century; (14) NO imposed target
distribution — bounded, varied, causally intelligible, and nothing else.
Paired check: the B1b small-N stasis medicine re-measured on the same run.

## §11b P3's GROUNDED CORRECTIONS (2026-08-01, recorded so nobody re-finds them)

- **⚠️ THE DIGEST PERSISTS NO COORDINATES, so §5b cannot be a radius.** Verified
  three independent ways (spatialDigest assembly, placementRaster's header, and
  steadingTopography's header all record it). The proximity band is therefore
  written in the digest's own persisted nearness vocabulary — the frozen
  cost-field Dijkstra — with two NAMED evidence classes: `frontier` (a recorded
  gate, so the pair cost is exact) and `hinterland` (unmeasured, enveloped by the
  country radius and CONSERVATIVE TOWARD REFUSING). Restore a true radius the day
  the digest persists seed cells.
- **⚠️ VILLAGE SEEDING: two ratified documents disagree.** This design's §5
  example says "a farm village with open land spins off steadings"; wave E's
  ratified `SATELLITE_CAPS` is `{town:2, city:4, metropolis:6}` — a village can
  NEVER seed. **MANAGER RULING (delegated, vetoable): wave E's cap table STANDS.**
  A cap table is a ratified engine law; a prose example in a later document is
  not, and forking the satellite lane to satisfy an illustration is the wrong
  direction. The founding lane refuses below town with the named word
  `parent_tier`, and the canonical example is pinned at TOWN scale. If villages
  SHOULD seed, that is a tuning-pass cap change with soak evidence behind it, not
  a doc-driven fork. THE OWNER MAY VETO — the veto raises the cap; it does not
  fork the lane.
- **⚠️ THERE IS NO SETTLEMENT TREASURY.** Enumerated: `economicState` carries
  foodSecurity, exports/imports, prosperity (a LABEL, not a stock), chains,
  stockpiles, complexity — not one spendable. `storageMonths` was REFUSED as the
  denomination precisely because §0b names its five existing writers and a sixth
  would BE the drift. The founding's capital cost is therefore the plan lane's own
  `provision` unit, conserved WITHIN the lane, and must be re-denominated the day a
  real treasury exists.
- **⚠️ A REAL SAME-SEED SHIFT, in ONE configuration that exists in no preset
  today:** demographicsEnabled AND settlementLifecycleEnabled lit together move
  the satellite fork's draw sequence (a plan-driven founding arms the mint on a
  tick the seeding integrator would not have). No golden covers this
  configuration. It is stated here rather than left to be discovered, and the
  soak redo lights both — expect it and do not read it as corruption.
- **The response race is `w * u`, not `u ** (1/w)`.** The textbook weighted race
  was implemented and then REMOVED: `Math.pow` is implementation-approximated per
  the ECMAScript spec and the transcendental-math ratchet caught it. Multiplication
  is required to be correctly rounded, so cross-engine same-seed replay is
  preserved at the cost of exact proportionality — THE PROMISE outranks elegance.
- **§5b's occupancy census is REALM-WIDE**, which wave E's was not (it saw only
  the parent's own steadings, so two adjacent parents could plant on one cell,
  each blind to the other). An ASPATIAL world reports `applicable:false` rather
  than `saturated:true` — reporting saturation there would have silently stopped
  every aspatial realm from founding anything, a bug wearing a law's clothes.

## §12 Judgment blocks (binding unless vetoed)

- **J-P1:** food = cap, density = rate (never two caps). VETO reverts to
  dual-cap min with both as ceilings.
- **J-P2:** natural mortality is the death band's guaranteed floor — even
  paradise ages. VETO makes old age a stressor event instead.
- **J-P3:** pull evaluates only over the LIVED route network, distance-priced —
  people move the way goods do. VETO opens realm-wide teleport-migration.
- **J-P4:** promotion requires next-tier K headroom (earned ascension).
  VETO reverts to population thresholds.
- **J-P5:** the brief-overshoot allowance (famine lag) instead of a hard clamp
  at K. VETO clamps at K exactly.
- **J-P6:** MIN_SEPARATION is tier-PAIR banded (steading-near-thorp legal,
  city-near-city not) rather than one global radius. VETO flattens to one
  number.
- **J-P6b:** the band's BOTH ends are any-settlement (min vs every settlement,
  max vs the nearest), per the owner's clarification — the parent annulus is a
  preference inside the law, never the law. VETO restores a parent-only tether.
- **J-P7:** saturation is discovered per-attempt from the empty filtered
  candidate set, never precomputed realm-wide. VETO orders a global
  saturation census each pulse.
- **J-P8:** the user exception is total — no engine rule ever refuses or
  relocates a user-placed settlement, matching the user-route immunity law.
  VETO subjects user placements to MIN_SEPARATION warnings (never blocks).

---

## §15 WAVE P5 — PRE-SOAK RECONCILIATION (owner-ordered 2026-08-01: "push them to
## before soak grid"; architecture by the Fable chair same day; implementation =
## the external implementer; sequenced WR-0 → P5 → the lighting batch → the grid)

Both items were 2026-08-01 validation escalations with executed evidence. Both are
DARK today (the demographics flag is in no preset), so both fixes carry ZERO golden
risk now and land before the flag ever lights — the cheapest possible window. Both
would corrupt the soak's evidence if left: the desert lock would surface as global
"tier-promotion flatness" and invite a WRONG global tune for a biome-local
arithmetic bug; the saturation divergence would make the legacy migration lane
refuse destinations the density law calls half-empty, distorting the exact
homeostat the soak exists to grade. Fix the instruments, then run the experiment.

### P5a — THE DESERT UNLOCK (preserve the interlock, keep the desert harshest)
**The measured defect:** TERRAIN_DENSITY_ADJUST.desert (0.50) × DENSITY_CEILINGS ×
max public works (×1.24) sits below the NEXT tier's POPULATION_RANGES.min at ALL
FIVE tier pairs (56<61 · 372<401 · 868<901 · 4650<5001 · 23560<25001), and
populations equilibrate at 76–83% of bound, so the lock is absolute — a desert
thorp can never become a hamlet regardless of anything it builds. Desert is the
ONLY locked terrain; mountain (0.60) locks WITHOUT works and unlocks at max works —
an elegant, evidently designed interlock. Desert being beyond the works ladder
contradicts DENSITY_CEILINGS' own stated purpose (demographicsRates.js:139-141).
**THE RULING (owner-ordered fixed; design vetoable):** put desert ON the interlock
rather than beyond it — raise TERRAIN_DENSITY_ADJUST.desert to the MINIMAL value
where maximum works clears every tier pair (the live-table arithmetic resolves to
0.55: the thorp edge rounds 61.38 to 61, while the 0.54 mutant rounds to 60;
the implementer takes the first value that clears all five, keeping desert STRICTLY
below mountain's 0.60
so the ordering desert-harshest survives). The desert story this encodes is the
honest one: a pure-desert settlement ascends ONLY at maximum public works —
cisterns and caravanserais, the Palmyra pattern — while a desert town that never
builds stays locked forever, which is directive 9's "geographic fate" preserved.
(A riverside desert settlement already carries the riverside class; this cell is
the waterless extreme only.)
**STRUCTURAL PREVENTION (mandatory, the actual point):** a WALKER over
TERRAIN_DENSITY_ADJUST × DENSITY_CEILINGS × works-max × POPULATION_RANGES
asserting, for EVERY terrain, max works clears EVERY tier pair — so no future
band edit can silently re-create a locked biome — plus the ordering pin
(desert < mountain < … strictly) and the mountain negative arm (locked without
works) so the interlock property itself is pinned, not just today's values.
**Discipline:** dark-side band correction pre-first-lighting, recorded here per
THE PROMISE; dormancy goldens untouched (the flag is lit nowhere); the band
lands in the §10 table with its flavor sentence so the tuning pass inherits a
documented value, not a mystery constant.

**LANDED 2026-08-01:** `TERRAIN_DENSITY_ADJUST.desert = 0.55`. The structural
walker executes all seven terrains across all five tier-promotion pairs through
the real `densityCeilingOf` works reader at the live maximum factor (1.24). The
strict terrain ordering, mountain-without-works negative, desert-before-cap
negative, and 0.54 mutant pin preserve both sides of the interlock.

### P5b — ONE CAPACITY TRUTH (retire the 9,000-person city wall when the engine is lit)
**The measured divergence:** the legacy migration lane's size-saturation axis
saturates at SATURATION_POP 9,000 (migrationKernel.js:65-70 — a per-capita
"pull fades" anchor, not a wall) while DENSITY_CEILINGS puts a city at 38,000 and
a metropolis at 140,000. A 20k city reads FULL to the legacy lane and half-empty
to the P2 homeostat. The lanes share no imports; the collision lands exactly at
the both-flags-lit soak configuration §11b already warns has no golden coverage.
**THE RULING (vetoable):** when `demographicsEnabled` is lit, the legacy lane's
size-saturation axis DELEGATES to the engine's own reading — pressure01
(population / min(K_food, D_tier), the §2b-sanctioned denominator role) via a
single read-seam `sizeSaturationOf(settlement, world)`; dark, the seam returns
the legacy pop/9000 formula BYTE-IDENTICALLY. One capacity truth when lit; zero
behavior change when dark; SATURATION_POP survives only inside the dark arm and
retires with the legacy lane. NEVER two notions of "full" in a lit world — this
is the canonical-truth doctrine applied to urban capacity.
**Pins:** dormancy (dark arm byte-identical, object-identity where the house
pattern applies); the divergence fixture (a 20k city: legacy arm saturated, lit
arm ~0.53 of bound — both asserted); the writer/reader spelling pin (the seam
boots the REAL demographics kernel, never a hand-rolled twin — the recorded
hazard class); and the §11b both-flags-lit configuration gains its FIRST fenced
golden as part of this slice (the same-seed shift §11b predicts is captured and
documented at the moment it becomes real, not discovered by the soak).

**LANDED 2026-08-01:** `migrationKernel.sizeSaturationOf` preserves the exact
legacy `population / 9000` arm while dark and delegates to
`demographicReadings` + `pressureOf` when lit, carrying the settlement id so
completed works and the other canonical context cannot disappear. The 20k-city
fixture reads 1.0 dark and 0.526315... lit against the 38,000 city bound. The new
`demographicsLifecycleGolden` fences four both-flags seeds: each plan-driven
founding occurs at tick 41 as `plan.Brimhold.1` / `steading.brimhold.41`, while
the same-seed lifecycle-only twin produces no founding inside the 80-tick fence.

**VERIFIED 2026-08-01:** the combined P5 wave passed the full repository gate:
2,110 test files passed (one intentionally skipped), 22,319 tests passed with
54 intentional skips, domain-strict remained at zero errors, the production
build completed, and all 47 distribution test files / 364 tests passed. The
fenced both-flags lifecycle golden is registered in the mutation-coverage
manifest; generated edge bundles were rebuilt to carry the new charter/schema
source hashes.
