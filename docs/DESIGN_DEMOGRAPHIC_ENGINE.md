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
Every one banded, none a bare float on a surface.

## §11 Wave slicing (build order)

- **P1 — THE RATES:** demographicsKernel (K_food, D_tier, rates, the §3 step,
  H3-floor composition), certification row, dormancy golden. The runaway dies
  in this slice.
- **P2 — THE VALVES:** overflow → satellites (need-weighted), earned promotion,
  metropolis ceiling.
- **P3 — THE HOMEOSTAT:** push-pull migration through the ledger, arrivals,
  transit accounting.
- **P4 — THE WORLD'S HAND:** stressor couplings, realmPressure emission +
  motive weights, Herald lines.

**Acceptance (the 300-year re-run, everything lit):** every settlement
plateaus (no monotone growth past ~×50 century-over-century); the realm's
size distribution is realm-shaped (all tiers occupied, no 10^9 outliers, the
floored-six pattern replaced by circulation); realm conservation exact;
the SAME seed that produced 29T now produces a bounded world — that receipt
diff IS the cure's proof. Paired check: the small-N stasis medicine (B1b)
re-measured on the same run — the two findings bracket the model.

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
