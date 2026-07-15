# Geopolitical War Layer — Design

**Status:** DESIGN — **Phase 0 IMPLEMENTED** (the `economic_capacity` causal dial + the `settlementStrength` economic term; the homeostasis loop can now close). Remaining phases unbuilt.
**Owner:** single-author project (bus factor one) — this doc is the cold-start spec.
**Scope:** a cohesive inter-settlement geopolitics layer for the campaign world pulse, in three features:
**A — War & Deployment** (coalition sieges, a one-army constraint, relief/liberation, contextual return
outcomes); **B — Trade War** (B challenges A to become C's primary supplier of a commodity); and
**C — Settlement Agency & Disposition** (an aggressiveness trait + a war-decision/strategy chooser that
picks each settlement's best move — defend / deploy / relieve / liberate / return-home / sue-for-peace —
weighted-best with RNG). and **D — Religion & Pantheon** (premium-gated: add-a-god custom content, assign a settlement's primary
deity, deity-vs-deity conversion contests, spread via conquest/migration/trade, a pantheon hierarchy).
All four sit on a shared "two-aggressors-over-a-third" contest substrate and a wartime **economic
homeostasis** loop. §8 maps the cross-system blast radius (economics, resources, defense, institutions,
NPCs/power, population, surfacing). (Features C and D are unnumbered, between §3 and §4, to avoid
renumbering the spec.)

> **Prime directive:** this layer must *compose with* the existing systems, never run a
> parallel model. Wherever possible a new mechanic is expressed as **(a)** which regional
> **channels** are active, **(b)** a **relationship-state** axis movement, **(c)** a
> **stressor/condition** lifecycle, or **(d)** a **queuedImpact** timer — all of which the
> engine already owns. Net-new state is called out explicitly and kept minimal.

---

## 0. The existing substrate we build ON (integration contract)

This layer plugs into these canonical vocabularies. New code must use these verbatim.

### Relationship types (`REGIONAL_RELATIONSHIP_TYPES`, `regionalGraph.js:28`; defaults `relationshipEvolution.js:29-120`)
`neutral · trade_partner · allied · patron · client · vassal · rival · cold_war · hostile · criminal_network`

Direction is **state-decided** (H16): roles are re-derived each tick from `settlementStrength`
and the `overlordSaveId`/`vassalSaveId`/`patronSaveId` stamps — never from edge orientation
(`relationshipRoles`, `relationshipEvolution.js:225-237`).

### Regional channel types (`REGIONAL_CHANNEL_TYPES`, `graph.js:21-38`) — minted per relationship by `relationshipChannelBundle` (`graph.js:456-512`)
| Group | Channel | Minted by (today) |
|---|---|---|
| P0 logistics/economic | `trade_dependency`, `export_market`, `trade_route` | trade_partner→trade_route; allied→trade_route; **discovery**→trade_dependency/export_market |
| P1 governance/force | `political_authority`, `tax_obligation`, `military_protection`, **`war_front`** | vassal/patron→political_authority+military_protection+tax_obligation; allied→military_protection; **hostile→war_front** |
| P2 social/cross-cutting | `service_dependency`, **`religious_authority`**, `criminal_corridor`, `migration_pressure`, `information_flow`, `resource_competition` | hostile/rival/cold_war→resource_competition; criminal→criminal_corridor; religious_authority exists (GM-visible) |

Channel fields: `{ type, from, to, strength 0..1, confidence 0..1, status, visibility, goods[] }`.
Statuses: `suggested · confirmed · dormant · disabled` (`REGIONAL_CHANNEL_STATUSES`, `graph.js:40`).
Visibility: `public · gm · hidden`; `criminal_corridor`/`information_flow`/`religious_authority` default `gm`.

### Regional impact lifecycle — **the cross-settlement timer** (`graph.js:47-53, 620-694`)
`queued → applied | ignored | expired | resolved`. An impact carries `delayTicks`, `ageTicks`,
`maxAgeTicks`, `expiresAtTick`, and a materialized `conditionId`.
- `advanceRegionalImpacts(graph, ticks, {currentTick})` decrements `delayTicks`, ages, expires.
- `isRegionalImpactAvailable` = `status==='queued' && delayTicks<=0` (`graph.js:674`).
- `setRegionalImpactStatus(graph, id, status)` transitions and stamps `*At`.
This is the seam for **"troops return in N ticks," "relief arrives in N ticks," and "drain
accrues each tick."**

### Relationship-state axes (per pair, `ensureRelationshipState`, `relationshipEvolution.js:279-314`)
`relationshipType, trust, resentment, fear, dependency, leverage, tradeBalance, pactStrength,
militaryBurden, aidBurden, obligationFatigue, recentIncidents[], history[], lastTransitionTick,
overlordWeaknessStreak, …`. **Relax (`relationshipEvolution.js:342-355`) mean-reverts ONLY
trust/resentment/fear** — `tradeBalance/dependency/leverage/pactStrength` ratchet (no decay).

### Stressor lifecycle (`stressors.js`)
`STRESSOR_CATALOG` (`stressors.js:56-269`), policies transient/episodic/structural/dormant_residual;
birth via `evaluateStressorRules`, age/decay/resolve in `ageRoamingStressors` (`stressors.js:628`,
run at `advanceCampaignWorld.js:206`), `originContext.attackerSettlementId` for the aggressor link,
and the `coupVerdictOutcomes` interception (`coup.js:69`, wired `advanceCampaignWorld.js:221`) — the
template for "a resolving stressor reads a target's live state and emits a regime-change outcome."

### The determinism contract (sacred — must be honored everywhere below)
- Fork RNG **on the record/edge id**, never a list-order stream (`rng.fork('age:'+id)`).
- All cross-settlement reads come from the **single pre-aging per-tick snapshot**
  (`worldSnapshot.js`, `byId` carries each settlement's full `economicState` + states); never
  read a sibling record mutated earlier in the same loop.
- Choices use **plain codepoint sorts** and `pairStableId`/`hash01(sortedPair+tick)` tie-breaks
  (e.g. `subjugationDirection` `relationshipEvolution.js:564-583`).
- No `Date.now()`/`Math.random()` outside the seeded seams.

---

## 0.5 Critical structural caveats (impact-audit findings — the layer MUST reckon with these)

A 7-subsystem blast-radius audit found the engine is only ~half-ready and that several of the doc's own assumptions don't hold yet. The non-negotiable ones:

- **The economy is FROZEN at generation.** `economicState` (prosperity, economicComplexity, primaryExports, incomeSources) is generated once (`economicGenerator.js:2541`) and **never recomputed in the pulse**. The only economic quantities that move per tick are the **food granary** (`foodStockpile.js`) and the **causal `trade_connectivity` score** (moved by conditions, `causalState.js:386`). The layer's "economicStrength" must read the **live** `trade_connectivity` and/or a **new `economic_capacity` variable** — never the frozen `prosperity` string, or the homeostasis loop reads a stale value and never converges.
- **🔴→✅ THE HOMEOSTASIS LOOP (the #1 blocker) — RESOLVED by OQ7=A.** There is **no `economy`/`economic_capacity` causal variable** today (only `trade_connectivity`, which reads routes/chains, not prosperity/war-drain) **and `settlementStrength` — the confidence input — has no economic term at all** (`relationshipEvolution.js:479-489` = tier+pop+inverse-pressure; the existing `trade_connectivity`→`pressure.trade` path feeds it at only ~0.1). **Phase 0 fixes this:** add a dedicated `economic_capacity` SYSTEM_VARIABLE + an economic term in `settlementStrength`/confidence (OQ7=A), so "drain → `economic_capacity` falls → confidence falls → peace" can fire.
- **No treasury / wealth ledger exists.** Tribute, occupation extraction, and the trade-war prize can move only as channel **STRENGTH** + relationship `tradeBalance` — the occupier/overlord gains leverage, **not coin**. Conservation (§5) nets in channel strength, never a wealth balance.
- **`tax_revenue` is a DEAD signal** — not one of the 14 causal variables (`causalState.js:67-82`). Any war effect routed through it silently no-ops (the retired `merchant_wealth` bug class, `activeConditions.js:157-161`). Use a real variable.
- **Occupation is currently modeled LIGHTER than a plain siege:** the `occupation` stressor's affectedSystems OMIT `trade_connectivity` (`stressors.js:81`), and it promotes to `vassal_extraction` which `populationDynamics` ignores (`conditionPromotion.js:45`). The harshest state has the weakest blast radius. Must be fixed.
- **The AGGRESSOR has no condition.** Every war archetype (`war_pressure`/`vassal_extraction`/`alliance_burden`/`rebellion`) models the **victim/ally**. The besieger's self-debuff (defense down because the army is away, economy down from drain) — the thing that makes wars END — has **no archetype**; it is net-new (`army_deployed`, `war_drain`).
- **Dual stressor vocabulary + PDF parity.** Catalog types (`siege`/`occupation`) differ from the generation types (`under_siege`/`occupied`) the PDF military banner + defense gates match (`viewModel.js:644`, `defenseGenerator.js:335`). A world-pulse-born siege will **not** light "ACTIVE MILITARY STATUS" without a reverse `PULSE_TO_GEN` read-alias. And the PDF "Current State" page renders the **legacy 4-dim `systemState`, not the 14-var causal substrate** — so substrate-only war effects are invisible on the page (`SystemStateSnapshot.jsx`). See OQ11.

---

## 1. Shared substrate: `contestOverThirdParty` (built ONCE, consumed by both features)

Both features are the same archetype: **two aggressors contest a third settlement's relationship
status.** Factor the determinism + triangulation logic into one helper so the two features cannot
diverge into different tie-breaks.

```
contestOverThirdParty({
  snapshot, rng, tick,
  prizeId,            // the contested settlement (B's sovereignty / C's trade allegiance)
  contenders: [X,Y],  // the two competitors (challenger, incumbent/defender)
  scoreFor(id),       // 0..1 fitness, computed from the pre-tick snapshot
  hardOverride(),     // optional: returns a winner id, short-circuiting the roll
}) → { winnerId, loserId, margin, rolled }
```

Contract: evaluate **both directions** with identical math; the higher `scoreFor` wins; **exact
ties break on codepoint id**; the candidate is keyed on the **sorted contender set**; the roll forks
on `hash01(sortedSet + ':' + tick)`. `hardOverride` runs first (vassal compulsion). This is the
generalization of `subjugationDirection` (`564-583`) + `sharedEnemyAllianceCandidate` (`692-716`) +
`protectorBackingScore` (`504-543`). Coalition variants pass a **sorted coalition** as a contender
and sum member scores (see §2.1).

Acceptance test for the substrate: the **mutual case** — `contestOverThirdParty` with the two
contenders swapped, and with both as simultaneous aggressors, must be byte-identical regardless of
save-array order, and must guarantee **monotone progress** (no same-tick mutual cancellation/oscillation).

---

## 2. Feature A — War & Deployment

### 2.0 One-army constraint (the keystone)
A settlement fields **exactly one army**. Its army is in exactly one mode at a time:
`home | offensive(targetId) | relief(allyId) | liberating(occupierId@allyId)`. A settlement with its
army committed **cannot** open a second siege or send aid until it returns. This is the natural cap
that prevents the "aggressor hollows itself across many fronts" pathology — the cap is **1**, baked
into the fiction.

**Representation (net-new, minimal):** a single `worldState.deployments[settlementId]` record (or a
`deployed_troops` stressor on the settlement with `originContext`), `null` when home:
`{ mode, targetId, coalitionRole: 'primary'|'support'|null, startedTick, returnsAtTick, sourceWarFrontKey }`.
Defaulted in `ensureWorldState`; absence = army home (legacy-safe).

### 2.1 Confidence gate (why a war starts at all)
A settlement only escalates toward **hostile** if confident its **coalition** out-muscles the
target's coalition; otherwise it competes by **trade** (§3), **diplomacy** (cold_war), or **religion**
(future). Reuse the existing strength + backing math:

```
coalitionStrength(X) = settlementStrength(X)                              // tier+pop+inverse-pressure (479-489)
  + Σ over allies Y of X (allied / patron protecting X, via military_protection channels)
        of settlementStrength(Y) * backingWeight(Y→X)                    // protectorBackingScore shape (504-543)
confidence(X vs T) = coalitionStrength(X) / (coalitionStrength(T) + ε)
go_hostile  ⟺  confidence ≥ HOSTILE_CONFIDENCE (≈1.25, tunable)
            AND economicHeadroom(X) ≥ WAR_HEADROOM   // §2.4 — won't start a war it can't afford
```
This already half-exists as `rival_power_play`'s `confidenceGap` (`relationshipEvolution.js:1542-1562`)
and `protectorBackingScore`. Coalitions are read from the snapshot's `allied`/`patron` edges +
`military_protection` channels. **Determinism:** sum over a codepoint-sorted ally set.

### 2.2 Coalition siege (multiple besiegers, one target)
A siege on target T is the set of **active `war_front` channels into T** whose source has an army in
`offensive(T)` mode. `hostile` already mints `war_front` (`graph.js:496`). So a coalition siege is
**N war_front channels converging on T** — no new channel type.

- **Primary instigator** = the besieger stamped on T's siege stressor `originContext.primaryInstigatorId`
  (deterministically the strongest, codepoint tie-break). Supporters are listed in
  `originContext.supporterIds[]` (extends the current single `attackerSettlementId`).
- **Occupation odds rise with coalition size:** the siege contest's aggressor side sums the coalition's
  `war_front.strength × deployerStrength`; more committed besiegers ⇒ higher chance the occupation
  resolves in the attackers' favor. *(CONFIRM with owner: "increases the chance against occupation" is
  read as "raises occupation-success odds.")*
- **After occupation:** the **primary retains** `offensive(T)`/occupying mode; **supporters' armies
  return home** (`returnsAtTick` set) or redirect to another siege. Only the primary's economic drain
  and defense debuff persist for the occupation's duration.

### 2.3 Deployment modes & the recursive liberation
- **Offensive** — army → `offensive(T)`: mints/joins the `war_front` into T; applies the deployer's
  **defense debuff** (a reversible condition on `defense_readiness`, NOT a mutation of the frozen
  `defenseProfile.scores.military` — avoids the parallel-model drift `defenseLedger.js` exists to
  prevent) and the **economic drain** (§2.4).
- **Relief (ally under siege)** — army → `relief(allyId)`: activates a **`military_protection`** channel
  reliever→ally (allied/patron already mint it, `graph.js:485`); adds the reliever's strength to the
  **defender side** of the ally's `war_front` contest, lowering the besiegers' occupation odds.
- **Liberation (ally occupied)** — army → `liberating(occupier@ally)`: an occupied ally cannot be relieved
  passively because the **occupier's army physically sits at the occupied settlement** (it's in
  `offensive` mode there). Liberation therefore opens a **new `war_front` against the occupier at that
  location** — a counter-siege. This recursive structure falls straight out of "the occupier retains
  deployed troops there."

### 2.4 Wartime economic drain → the homeostasis loop (why wars end)
Every committed army (offensive, relief, or liberating) imposes a **per-tick economic condition** on its
home settlement, and the drain **scales with the count of active war_fronts** the settlement is party to
(attacker or defender). Model it as a reversible active condition (`war_drain`) on the live economic
dial, strength ∝ active-war count.

> **🔴 BLOCKED on OQ7 / §0.5 — read before building this.** "The live economic dial" does **not exist
> today**: `economicState` is generation-frozen, there is **no `economic_capacity` causal variable** (only
> `trade_connectivity`), and **`settlementStrength` — what `confidence` reads — has no economic term**. So
> the loop below cannot close until Phase 0 adds an `economic_capacity` variable (or locks the
> `trade_connectivity` aliasing) **and** folds an economic term into `settlementStrength`/`confidence`.
> Routing `war_drain` at a fictional `economy`/dead `tax_revenue` tag silently no-ops (§0.5).

```
drain(X) per tick ∝ Σ active war_fronts touching X        // more fronts → heavier bleed
economic_capacity(X) falls → confidence(X) falls (§2.1) → X seeks peace   // requires the Phase-0 economic term
peace ⇒ army returns home ⇒ drain lifts ⇒ economy recovers (mean-reverting condition)
```
This is the negative-feedback that makes the realm self-stabilize, complementing the existing
`windDownSponsoredStressors` (`stressorDynamics.js:920`). It is ALSO carried structurally — a sustained
drain → causal economy score `declining` → the existing institution-close lifecycle (`institutionLifecycle.js:113,563`,
§8 Economics). **Calibration is load-bearing** — too weak and wars never end; too strong and no one risks
war. The convergence is an explicit acceptance test (§6, gate #2).

### 2.5 Vassalization (the prize of a successful war)
Vassalization stays the existing **relationship subjugation contest** (`canSubjugateDirection`,
`relationshipEvolution.js:545-583`), now fed by the deployment debuff: a besieger with its army
committed elsewhere (or recalled) has lowered `defense_readiness` → lowered conflict pressure →
**fails to qualify** for the `hostile_occupation_pressure` → vassal proposal. **LOCKED:** "B not
vassalized when A's siege fails" is enforced **stressor-layer** — recall **winds down T's siege**
(`windDownSponsoredStressors` idiom) and lowered-strength A stops qualifying. Not by coupling into the
subjugation gate.

### 2.6 Contextual return outcomes (troops come home to trouble) — **LOCKED**
When a `deployed_troops`/army record **resolves** (returns home), consume it beside `coupVerdictOutcomes`
(`advanceCampaignWorld.js:221`) in a new `deploymentReturnOutcomes` resolver (clone of `coup.js`). The
outcome is **contextual to the home's predicament**, "maintaining the dynamics of the settlement":
| Home state on return | Outcome |
|---|---|
| **Occupied** | probability-gated chance to **end the occupation** (wind down the occupation stressor / counter the occupier) |
| **Under siege** | probability-gated chance to **end the siege** (relieve it) |
| **Vassal** | probability-gated **coup d'état vs rebellion**, chosen by **legitimacy** (low ruling_authority → coup via `coup.js`; else rebellion via `vassal_rebellion`/`independencePressure`) |
Probability rises if the return was **accelerated** (troops rushed home). Fire on the **resolution
transition only** (not ongoing state) to avoid per-tick re-firing. Deterministic: fork on the record id.

---

## 3. Feature B — Trade War (primary-supplier contest)

### 3.1 "Primary" is DERIVED, never stored — **LOCKED**
There is no `primaryPartner` field today and we add none. One canonical selector, used everywhere
(rules, Wizard News, PDF) so the world never tells inconsistent stories:
```
primarySupplierInto(C, commodity K) =
  argmax over X of  channelStrength(X→C for K)            // trade_dependency/export_market/trade_route into C, status confirmed
                    [tie-break: codepoint id]
```
**Per-commodity** (LOCKED): C can have a primary grain supplier and a primary ore supplier
independently. This requires **lifting commodity-matching into the tick path** —
`deriveTradeLinks`/`goodsIntersect` (`tradeLinks.js`) currently run only at generation; the trade war
reads "X exports K that C imports" from the snapshot's `economicState.primaryExports` ∩ `C.primaryImports`.

### 3.2 Eligibility + the win contest — **LOCKED**
Challenger B may contest A for C's primary-K crown **only if** B actually exports K that C imports **and**
has a strong/complete supply chain for K. The winner is a **seeded, weighted** roll (never deterministic):

```
eligible(B, C, K) ⟺ B.exports ∋ K  AND  K ∈ C.primaryImports  AND  supplyCompleteness(B,K) ≥ MIN_CHAIN

score(X for C,K) = w_sup·supplyCompleteness(X,K)          // active vs total chain stages for K
                 + w_eco·economicStrength(X)              // prosperity/complexity/capacity (0..1)
                 + w_dip·diplomaticStanding(X↔C)          // trust − resentment − recency-weighted incidents
                 + w_all·allianceBias(X↔C)                // allied/patron with C ⇒ strong +; cold_war/hostile ⇒ −
                 + w_inc·incumbencyBias(X is current primary)  // sticky incumbent (also the anti-thrash term)

P(B wins) = logistic( k · ( score(B) − score(A) ) )      // log-odds, NOT a raw product — see §4
roll < P(B wins) ⇒ B becomes C's primary supplier of K
```
- **`supplyCompleteness(X,K)`** — fraction of K's supply-chain input stages active for X
  (`computeActiveChains`/`supplyChainState`); range 0..1. **NET-NEW derivation** — no such scalar exists
  today (only per-chain status enums + counts, §8 Resources); must not double-count the upstream penalty
  `computeActiveChains` already applies.
- **`economicStrength(X)`** — the **live** economic dial (`trade_connectivity`, or the Phase-0
  `economic_capacity`), **never the frozen `prosperity`/`economicComplexity` strings** (§0.5/OQ7). Same
  blocker as the war drain — until Phase 0 this term reads `trade_connectivity` only.
- **`diplomaticStanding(X↔C)`** — composite of `trust`, `resentment`, `fear`, relationshipType, and
  **recency-weighted `recentIncidents`** (a fresh betrayal/attack weighs more than an old one via the
  `relationshipMemory` half-life). A recently-hostile/betrayed challenger takes a **significant-but-not-
  fatal** demerit (a multiplier < 1 on its score contribution, never a hard zero). *(Exact signal
  functions pinned by the in-flight contest-factor investigation; folded in on landing.)*
- **`allianceBias`** — allied/patron with C is a strong positive; cold_war/hostile a negative.

### 3.3 Hard overrides (precedence over the roll) — **LOCKED**
If **C is X's vassal and the overlord compels it**, C's primary-K = the overlord's designate, bypassing
the contest. This **extends the existing hierarchy cascade** (`relationshipHierarchy.js:39-44`, "the
overlord compels embargoes against the former trade partner") — add a `hierarchyDecision` branch that
also forces C's `trade_dependency` allocation along the overlord's `political_authority` channel. The
`primarySupplierInto` selector must **respect this override** (return the compelled supplier regardless
of channel strength).

### 3.4 The rivalry itself — cold_war-with-cause (NOT a new type) — **LOCKED**
A trade war is a **`cold_war` on the A↔B edge** whose cause is the contest over C. Emit it as a
cross-cutting candidate (sibling of `sharedEnemyAllianceCandidate`, `relationshipEvolution.js:2039`) on
the **sorted A↔B edge**, stashing `{ contestedThirdPartyId: C, commodity: K }` in edge metadata. Reuse
`cold_war_supply_sanctions` (`1631-1675`) for ongoing pressure and the **`market_shock`** stressor
(`stressors.js:207`) as the **loser's** consequence. Single-key contract preserved: C's preference shift
**emerges** from C's own per-edge rules reacting to the new posture + the channel-strength transfer.

### 3.5 Anti-thrash (mandatory)
Because `tradeBalance/dependency` **don't mean-revert**, a naive flip thrashes B→A→B. Guard with the
existing `lastTransitionTick` cooldown + an `overlordWeaknessStreak`-style hysteresis (a flip requires a
sustained margin over K ticks, not a single-tick lead). The incumbency term (§3.2) is the other half.

---

## Feature C — Settlement agency, strategy & disposition (the agent that picks the moves)

Features A/B are the *actions*; this is the *agent* that chooses among them and the *disposition* that colors every choice. **Key finding: the engine already has a deliberative "enumerate options, score, pick the best" chooser** — `npcAgency.evaluateNpcRules` (`npcAgency.js:799-814`) maps a role's `preferredActions`, scores each, sorts, takes the best above a gate. The settlement strategy layer is that pattern **lifted from the NPC tier to the settlement tier**, and `weightedPick`/`fork` are already built-ins (`prng.js:50,62`). So this is ~75% reuse + one new evaluator + the new disposition state.

### C.1 The aggressiveness disposition (modulates ALL relationship dynamics)
A per-settlement scalar, **recomputed each tick from the pre-tick snapshot** (NOT cached — the inputs drift via corruption, promotion/demotion, and coups), **signed/centered** (−1 pacific … +1 belligerent) so it can pull toward war OR toward diplomacy/trade/alliance:
```
aggressiveness(S) = squash( w_gov·govBaseline(S) + w_pers·personalityDrive(S) + w_hist·historyDrive(S) )
```
- **govBaseline** = `GOVERNMENT_AGGRESSION_BASELINE[ factionArchetype(governingFactionOf(S)) ]` — a NEW table (military/occupation high; merchant/civic/labor low; religious/noble mid). The existing **`COUP_COERCION`** table (`rulingPower.js:142-155`: military 1.25 … craft/labor 0.85) is literally "how readily this archetype converts power into force" and can be re-centered as a first-cut baseline.
- **personalityDrive** = importance-weighted mean of a trait score over S's NPCs: `Σ traitScore(npc) · dotRank(npc) · normFactionPower(npc.faction) / Σ weights`, with the **governing faction up-weighted**. `traitScore` reads the **authored `npc.personality.{dominant,flaw,modifier}`** strings via a NEW frozen `TRAIT_AGGRESSION` lexicon over the `npcData` vocab (flaw cruel/callous/ruthless/cold-blooded/domineering → **+**; dominant merciful/compassionate/diplomatic/generous → **−**; modifier zealous/ambitious → mild **+**). **Use the authored strings, NOT the RNG-rolled `npcStates.alignment`** — they don't correspond, and the authored ones are what the dossier shows. Reuse `factionArchetype` / `governingFactionOf` / `dotRankFor` / `factionPower` / `seatNpcsIntoFactions` — all present, all snapshot-readable.
- **historyDrive** = `tanh(k·(warWins−warLosses)) − tanh(k·(tradeWins−tradeLosses))` — "we succeed more at war / at trade." **Needs a NET-NEW persisted ledger** `worldState.dispositionStats[S] = {warWins,warLosses,tradeWins,tradeLosses}`, **ratcheted (non-mean-reverting** — or the relax passes erase it), defaulted in `ensureWorldState`, **populated by the war/trade resolvers we're already adding** (§2.6, §3). Until it ships, a lossy interim proxy (sign of `tradeBalance` + war-incident density on S's edges — but that conflates victim and victor).

**How it modulates ALL relationship dynamics (not just war):** thread aggressiveness as a **centered-on-1.0 multiplier** into the per-candidate severity/probability of `evaluateRelationshipRules` (the `candidateBase`, `relationshipEvolution.js:369`) — hostility/war candidates ×(1+aggr), peace/alliance/trade candidates ×(1−aggr). **It MUST default to 1.0 (neutral) for legacy saves with no disposition state**, or it moves every relationship determinism fixture and breaks the mutual-case byte-identity test (gate #1). The same centered-multiplier idiom `hesitation` already uses (`relationshipEvolution.js:994`).

### C.2 The strategy chooser (intelligence + efficiency, RNG-varied)
`evaluateSettlementStrategyRules(snapshot, {tick})` — a sibling of `evaluateNpcRules`/`evaluateFactionRules`, registered in `candidateEvents.js` behind a `strategyEnabled` simulation-rules flag. For each settlement **party to a conflict** (has a `war_front`/siege/occupation/hostile edge in the snapshot):

1. **HARD OVERRIDE first — return-home is the priority.** If home (or a vassal) is occupied/under-siege while S's army is deployed away, emit **return-home deterministically** (probability 1, via the deterministic-bypass path that `coupVerdictOutcomes`/`structuralCandidates` use at `advanceCampaignWorld.js:385`). Skip the weighted sample entirely — an *override* cannot be out-competed by a high deploy weight; a mere utility floor can. (Mirrors `contestOverThirdParty`'s `hardOverride`, §1.)
2. **Enumerate legal moves** (filtered by the one-army constraint + gates), **codepoint-sorted**: `defend · deploy-offensive(T) · relieve(ally) · liberate(occupied-ally) · hold-occupation · war-of-attrition · rout · sue-for-peace`.
3. **Score each move's utility** `u = f(settlementStrength, coalition backing via protectorBackingScore, the relevant edge's relationship dynamics, aggressiveness, economic exhaustion)`.
4. **Sample one** with `weightedPick` over **softmax weights `exp(k·u)`** (k = decisiveness — "best most likely, RNG varies it"; OQ3), forked **once** on `strategy:<settlementId>:<tick>`; any two-settlement target choice (relieve/liberate which ally) uses the sorted-pair `hash01(sortedPair+':'+tick)` key.
5. **Emit ONE candidate** with exclusiveTag `[strategy:<settlementId>]` so `resolveCandidateConflicts` enforces one move per settlement, at **probability 1** — the move was *already* sampled in step 4; a second `rollCandidates` Bernoulli would double-randomize. Major moves (deploy / sue-for-peace) carry applyMode `proposal`.

**Sue-for-peace** — GATE: neither S nor any of S's vassals (enumerate via `relationshipRoles`) is currently occupied/under-siege (pure snapshot read). WEIGHT ∝ **economic exhaustion** (the `attackerAttrition` mean, `hostileRules:1742`, until OQ7's `economic_capacity` lands). When chosen it pulls **existing levers** — no new peace machinery: a `labelProposal` toward `cold_war` (the `hostile_truce` shape, `relationshipEvolution.js:1869`) or `rival` (`cold_war_thaw`, `:1696`), and on apply calls the LOCKED **`windDownSponsoredStressors`** (`stressorDynamics.js:920`) to drop the sponsored siege/occupation below the structural gate so the next aging tick ends it; `recordWarResolutionIncidents` writes the peace into edge memory.

**Coordination with the reactive layer (critical).** The per-edge rules (`hostileRules` raid/truce, etc.) keep firing for the same settlements. The chooser must **suppress the per-edge war rules for conflict-involved settlements** (or share their `label:<key>` exclusiveTags) — else a settlement could "deploy offensive" (chooser) AND "sue truce" (`hostileRules`) in one tick. The strategy layer is **inter-settlement posture**; `npcAgency` is **intra-settlement politics** — they must emit **non-overlapping conflictTags** or `resolveCandidateConflicts`' budgets starve one out.

**Determinism / save-shape:** recompute aggressiveness fresh each tick (don't cache); `dispositionStats` ratchets + defaults in `ensureWorldState`; codepoint-sort the option set before `weightedPick` (array order leaks otherwise); read only the pre-tick snapshot. The softmax `k` is load-bearing (too high → hard argmax, RNG never varies — *defeating the requirement*; too low → random rout/peace). Return-home-as-override must NOT be subject to `maxProposals` or an emergency recall could be silently dropped on a busy tick.

---

## Feature D — Religion & Pantheon (premium-gated)

The realization of the "future religious axis" (§7) — but far richer: a DM **adds a god** to custom content and **assigns a settlement's primary deity**; deities then **contest** to convert other settlements (a contest-over-a-third sibling of the Trade War), **spread** via conquest/migration/trade, and rise/fall through a **pantheon** hierarchy. **Premium-only**, end to end. ~60-70% reuse; the authoring/gating half is near-pure reuse and the good/evil NPC effects fit the corruption substrate *unusually* well.

### D.0 Activation gate & premium model — **LOCKED** (resolves OQ17 + OQ19)
- **DORMANT until assigned.** The religion layer is **OFF** for a campaign until ≥1 settlement has an assigned primary deity (`config.primaryDeityRef`). With zero deities, the campaign runs the **current** system verbatim (`deriveReligiousAuthority` from faction power; no contest, no pantheon). ⇒ **all legacy / no-deity campaigns are behaviorally unchanged → no determinism-fixture churn, save-shape-safe by construction.** The activation is a *derived* flag ("any settlement has a primaryDeityRef"), not stored. The new code paths (deity term in the deriver, the contest, the pantheon) MUST no-op when no deity is present.
- **Premium = the simulation.** Religion only *acts* inside the **world pulse** (advance-time), which is **already premium-only** (`canManageCampaigns`). So religion-in-the-pulse is premium-gated **for free** — and a god is **inert custom content until a premium account advances the campaign.** ⇒ the existing **client-only** custom-content gate is *sufficient*; **no server-side tier predicate is needed** on the god row (OQ19), because a free user who POSTs a god can never run the pulse that would make it act. A shared/imported campaign is safe too: the free viewer sees the resulting state but cannot advance it.
- ⇒ **The `religious_conversion_fracture` stressor finally has its reason for existing** — it is the named per-tick vehicle for deity-driven conversion (D.4), no longer an under-motivated primitive.

### D.1 Authoring & gating (near-pure reuse)
- **Add a god** = a new custom-content bucket `gods`, registered in the **three lockstep lists** (store `EMPTY` `customContentSlice.js:59`, the SQL `custom_content_category_check` via a NEW migration, UI `CUSTOM_CATEGORIES` `CustomContent.jsx:24`) + `REGISTRY_CATEGORIES`/`CUSTOM_SLICE_KEY_FOR` (`customRegistry.js`). The generic CRUD/localUid/cloud-sync/migrations all generalize for free. ⚠️ **Bucket-set drift:** these lists already disagree (services/factions are in store+UI but NOT the SQL CHECK) — add `gods` to ALL or premium cloud writes silently fail.
- The **3 tag axes** = frozen enums in `customContentSchema.js` + UI `fields[]`: `alignment{good,evil,neutral}`, `temperament{warlike,peacelike,neutral}`, `powerTier{major,minor,cult}`.
- **Premium gate** = `canUseCustomContent()` (`authSlice.js:364`) reused **verbatim**. ⚠️ It's **client-only** (the custom-content RLS enforces ownership, not tier — `004:9-10`); a determined free user could POST a god row. Acceptable only if the *pulse* religion is itself premium-campaign-gated; else add a server tier predicate.
- **Assign primary deity** = a `config.primaryDeityRef` (the stable `custom:<localUid>`, mirroring `config.nearbyResourcesCustom`) committed via a NEW **`SET_PRIMARY_DEITY` event** (`registry.js`) — buys preview / stale-narrative / canon-history for free. NOT a `userEdits` path (those are prose-only).

### D.2 The embed-on-assign bridge (the key net-new boundary)
**The pulse does NOT read custom content** — it's deliberately store-decoupled for determinism/headless (`worldSnapshot.js` builds only from saves). So a deity must be **embedded as a resolved, self-contained snapshot ON the settlement record at assign-time** (the resolved tags, NOT a live store refId), and the pulse reads only that snapshot. Do it any other way and you break the sacred single-snapshot/headless contract.

### D.3 The deity-vs-deity contest (a `contestOverThirdParty` sibling)
- **`primaryDeityOf(S)`** — the **stored** DM assignment is the incumbent *seed*; the contest can overwrite it (so it's stored-but-contestable, unlike the trade war's pure-derived crown).
- **Contest** = `contestOverThirdParty` (§1): prize = settlement S, contenders = [challenger deity, incumbent deity], `scoreFor` = **alignment-direction match** (S's good/evil + warlike posture vs the deity's) + **incumbency** + **major/minor/cult tier** — combined as a **weighted-sum→logistic** (§4, never a raw product), forked on `hash01(sortedSet+tick)`.
- **A strong primary deity feeds `religious_authority`** — extend the shallow `deriveReligiousAuthority` (`causalState.js:539`, today reads only faction power) with a deity term scaled by tier.

### D.4 Spread (reuses the existing conversion vehicle + the war layer)
**The vehicle already exists:** the `religious_conversion_fracture` stressor (`stressors.js:156`) already declares `spreadChannels:['religious_authority']`, and `religiousConversionGate` already boosts conversion **1.6× when occupied** ("*the occupier's faith arrives with its garrison*", `stressorGates.js:436`). So:
- **Conquest** → the war layer's occupation/vassalage **exports the conqueror's deity** (a crusade loop; ties Feature A↔D — a warlike-evil deity is a casus belli).
- **Migration** → `flows.js` carries the deity with the migrants. **Trade/allyship** → the `religious_authority` channel along trade/ally edges; "where people engage, faith spreads."
- ⚠️ **THE MINT GAP:** `relationshipChannelBundle` mints **no** `religious_authority` channel today — the layer must add the mint (on conquest/trade/migration edges) or deity-strength routed at the channel silently no-ops (the `tax_revenue` dead-signal class).

### D.5 good/evil → the NPC substrate (fits *unusually* well)
The **corruption system is already the exact shape** the deity needs: a damped, bounded, deterministic per-tick machine that boosts/represses NPCs via 0..1 knobs (`evaluateNpcRules` pressure, `onsetHazard`/`exposureChance`), demotes via `dotRank`, replaces via `successorNpc` — **all without mutating the frozen `personality`**, and it already reads the **authored** personality (`npcCorruptibleFlaw`).
- **Read:** a signed **`TRAIT_ALIGNMENT` lexicon** over the `npcData` positive/negative/neutral vocab (good +, evil −) — the *only* net-new read primitive, identical shape to Feature C's `TRAIT_AGGRESSION`. ⚠️ **Read the AUTHORED `npc.personality`, NOT the RNG-rolled `npcStates.alignment`** (write-only, dossier-mismatched — OQ13).
- **Effect:** a deity-disfavor multiplier into the corruption knobs (raises onset/exposure/demotion of misaligned NPCs; a good deity's purge reads as "*the temple installed an incorruptible successor*"). Aligned NPCs rise via the existing `seek_promotion`/`dotRank` path. A per-NPC scalar **recomputed each tick** (not stored).
- ⚠️ **The criminal-gate crux:** corruption onset is **hard-gated on `hasCriminalInst`** (`corruption.js:521`) — so "an evil deity corrupts the faithful" silently no-ops in a crime-free town. Either rethink the gate or route deity-punishment only through the exposure/demotion side (which runs regardless). ⚠️ Keep it ONE bounded centered-on-1.0 multiplier — stacking onset+exposure+demotion blows past corruption's deliberate equilibrium damping (death-spiral).
- **Criminal-relations multiplier** rides `criminal_opportunity` (a deity condition tagged it) + the crime climate (an evil deity raises it; a good deity self-cleans via the exposure/reform counter-force).

### D.6 warlike/peacelike → Feature C disposition (the unification)
A deity's **temperament is a new term in `aggressiveness(S)`** (§C.1) alongside govBaseline + NPC personality + history — flowing through the **same centered-on-1.0 `candidateBase` multiplier**. A theocratic-warlike settlement is a crusader state; a peacelike deity tilts it to trade/alliance. Religion modulates war/peace/trade through the existing disposition seam — **NOT a parallel model**. (⚠️ coordinate so deity-temperament and the other aggressiveness terms compose, not double-count.)

### D.7 The pantheon (a `dispositionStats`-shaped ledger — build LAST)
- `worldState.pantheon[deityRef] = { wins, losses, seatsControlled, tier }` — **ratcheted, ensureWorldState-defaulted**, identical shape to the war layer's `dispositionStats`. The god *definition* is account-global (a custom_content row); the *pantheon tier* is per-campaign (worldState-resident). Author sets the initial tier; the ledger overrides it as wins/losses accrue.
- **Promote/demote major↔minor↔cult** — ⚠️ the **determinism danger zone** (a global cross-settlement aggregation) + oscillation/cascade-prone (religion is *more* connective than war — rides P2 social channels everywhere; one cult could eat the map). Mitigations: aggregate from the **pre-tick snapshot only**, derive tier from seatsControlled **lazily** (not a global rebalance every tick), and require **hysteresis + a containment gate** from day one (gate #4-style).

### D.8 Immersion (the holistic expansion)
- **The pantheon as a campaign epic:** a deity's major→cult fall graduates into a realm arc "**The Twilight of X**", an ascension into "**The Ascendancy of X**" (via `synthesizeRealmEvents`, like "The War"). A pantheon panel shows the hierarchy + who controls what.
- **The chronicle names the contest:** the conversion stressor reads "*the cult of X is displacing the worship of Y*" rather than a generic schism; conversions/schisms graduate to settlement history.
- **Temples are deity seats** — religiousCenter institutions become the deity's footholds; conversion re-serves them; a deity's "control" = the settlements whose temples serve it.
- **NPC faith** — `npcGoalRebranch` on conversion ("context changed → the faithful's ambitions shift"); the devout rise, the heretical fall — visible power-structure movement, not a hidden number.
- **Cross-system ripples** — pantheon tier → magic `religiousAcceptance` (a dominant orthodox major deity tightens magic legality, `magicProfile.js`); the `religious_authority` channel is already purple on the regional-map overlay (the DM watches faith spread like a front line).

### D.9 Phasing (war-doc spirit — loop-prone parts last)
- **R1** — bucket + authoring + assign-deity (`SET_PRIMARY_DEITY` event) + the embed-on-assign bridge + the `deriveReligiousAuthority` deity term + dossier surfacing. *Pure reuse, premium-gated, deterministic (doesn't touch the contest yet).*
- **R2** — the `religiousContest` (contestOverThirdParty) + spread via the existing conversion stressor + **the channel mint**.
- **R3** — the good/evil NPC effects (`TRAIT_ALIGNMENT` + the corruption/agency knobs + the criminal-gate decision) + the warlike→Feature-C term.
- **R4 (last, behind convergence tests)** — the pantheon ledger + the major↔minor↔cult balancing.

---

## 4. The contest math (avoiding multiplier collapse)

Stacking five 0..1 factors as a raw product collapses toward 0. Use a **weighted-sum fitness → logistic
log-odds** instead (§3.2). Each factor is normalized 0..1; weights sum to ~1; the diplomatic/alliance
**demerits/bonuses are multipliers centered on 1.0** (e.g. 0.6–1.4) applied to their term, not the whole
score. `k` controls decisiveness (higher = "the stronger one almost always wins"; lower = "upsets
happen"). Same shape governs the **war confidence gate** and the **siege/occupation odds** so all three
contests read consistently.

---

## 5. Determinism, conservation & save-shape invariants

- **Conservation:** the army a settlement deploys is a single quantum — the `defense_readiness` debuff
  removed from home on deploy must be **exactly restored** on return; track it in the un-rounded
  condition/relationship state, never re-derived from clamped 0..100 scores. The trade channel-strength
  **transferred** from A→C to B→C on a trade-war win must net (debit A as you credit B).
- **Cross-settlement reads** (coalition strength, "is my home besieged?", `primarySupplierInto`, war
  count) come from the **pre-aging snapshot only**.
- **No-echo carve-out:** a returned army / resolved deployment must **not** spawn a stressor echo
  (`echoOf`) or it pollutes the chronicle/realm-arcs with "the deployment passes into history."
- **Save-shape:** `deployments[]`, `originContext.{primaryInstigatorId,supporterIds,contestedThirdPartyId,
  commodity}`, and any streak fields must default in `ensureWorldState`/`ensureRelationshipState`/
  `normalizeStressor` so legacy canon saves heal (the `overlordWeaknessStreak` pattern).
- **Non-member attacker:** ~half of sieges are unattributed (goblin warband, null attacker) — the army/
  deployment mechanics are **hard-gated on the attacker being a canon member** (`byId.has(id)`).
- **Once-per-siege:** siege stressors re-upsert their id every tick; the deployment must spawn **once**
  (keyed on `sourceWarFrontKey`) or the countdown resets forever.

---

## 6. Test plan (acceptance gates — write these FIRST)

1. **Mutual-siege convergence** — A↔B besiege each other: run the pulse with saves `[A,B]` and `[B,A]`,
   assert byte-identical `worldState`, and assert **monotone progress** (both sieges provably resolve,
   no limit cycle).
2. **Economic homeostasis** — a multi-front war provably winds down: drain drives confidence below the
   peace threshold within a bounded number of ticks; no perpetual war.
3. **Trade-war thrash** — without a sustained margin the primary crown does **not** flip B→A→B; with one
   it flips once and sticks (incumbency + cooldown).
4. **Cascade containment** — a single trade rivalry does **not** cascade the whole map into war; the
   confidence gate + drain bound it.
5. **Conservation** — deploy→return restores `defense_readiness` exactly; trade-war win nets the channel
   transfer; no leak.
6. **Coalition** — N besiegers raise occupation odds; on occupation only the **primary** retains the
   debuff/drain, supporters' armies return.
7. **Determinism property** — seed-stable across machines; member-iteration order never changes outcomes.
8. **Surfacing & parity** — a world-pulse siege lights the PDF "ACTIVE MILITARY STATUS" banner (reverse alias); a deploy debuff appears in the causal trace + chronicle, not just as a moved number; no economic effect routes through a dead `tax_revenue`/fictional `economy` tag (silent no-op).
9. **Institution reversibility** — siege/deploy impairments LIFT on relief/return; only terminal states (occupation suppression) close; a close→reopen preserves war impairments; no double-count vs the lifecycle.
10. **Population cascade & conservation** — a single sack does not ping-pong refugees/instability across the map unbounded; mass-emigration and `flows.js` cannot remove the same population twice on one tick; occupation registers in the population flight/decline sets.
11. **Agency & disposition (Feature C)** — the strategy chooser is seed-stable + order-independent (codepoint-sorted options, fork on `strategy:<id>:<tick>`); the **return-home override always wins** when home/a vassal is compromised (never out-competed); sue-for-peace fires ONLY when the gate passes (self + vassals free); aggressiveness defaults to **neutral (1.0)** for legacy saves and does not move the §6.1 mutual-case byte-identity; a high-aggression settlement measurably escalates more (hostility candidates up) and a low one seeks trade/alliance more — without either pinning to hard-argmax (RNG still varies the move).

---

## 7. Build order (phased, reviewable)

0. **✅ DONE — UNBLOCK THE LOOP (OQ7=A).** Added the `economic_capacity` SYSTEM_VARIABLE (15th) in `causalState.js` (deriver: prosperity→baseline + economicComplexity + active-condition deltas; HIGHER_IS_BETTER; label; schema typedef) — auto-picked-up by `qualitativeBands`/`explanation`/`distributionDashboard`/`structuralFingerprint`; rebuilt the AI-grounding edge bundle. `pressureModel`'s `economy` pressure now reads `economic_capacity` at 50% weight, and `settlementStrength` gained a dedicated `(1−pressure.economy)·0.12` term (rebalanced to sum 1.0, conflict kept at 0.18). Verified: full domain/store/property/generator/security/pdf/ui suites green, **determinism + golden-master preserved**, typecheck clean. Now a `war_drain` condition lowering `economic_capacity` flows → `pressure.economy` ↑ → `settlementStrength` ↓ → confidence ↓ → peace. Calibrate the 0.12 weight + baseline against the drain magnitude in Phase 3.
1. **Shared substrate** `contestOverThirdParty` + its mutual/coalition determinism tests (gate #1, #7).
2. **War core** — one-army state machine (+ its faction/commander carrier, OQ12), confidence gate, coalition `war_front` siege, the
   `defense_readiness` deploy debuff (reversible condition; dedup vs `war_pressure`/`war_front` pressure), the failed-vassalization wind-down,
   the army-eats-home-stockpile cost, and the surfacing alias (gate #8). (gates #1, #5, #6, #8)
3. **Economic drain + homeostasis loop** (depends on Phase 0). Wire occupation extraction (attach `vassal_extraction`), and let the existing economy→`declining`→institution-close path carry the structural cost. (gates #2, #4, #9)
4. **Trade War** — `primarySupplierInto` selector + the net-new `supplyCompleteness(X,K)`, eligibility + the §3.2 contest, cold_war-with-cause,
   hierarchy hard-override (+ government-variant swap), anti-thrash, the loser's `tradeScarcityFlows` cascade. (gate #3)
5. **Contextual return outcomes** (§2.6) + relief/liberation modes + regime-change (`transferRulingPower(cause:'conquest')` puppet install) + population/NPC casualty-or-displacement (OQ8) + the conquest history graduation. (the loop-prone part — last, behind the others' tests) (gates #10)
6. **Feature C — agency & disposition.** Ship **C.1 disposition** early (inputs 1-3: the `TRAIT_AGGRESSION` lexicon + `GOVERNMENT_AGGRESSION_BASELINE` + the importance-weighted aggregation, recomputed per tick) — it can modulate relationship dynamics standalone (OQ15). Then the **`dispositionStats` win/loss ledger** (populated by the Phase 4-5 resolvers, OQ14) and the **strategy chooser** `evaluateSettlementStrategyRules` (return-home override + softmax `weightedPick` + sue-for-peace gate→existing levers, OQ16). Depends on the war actions (Phase 2) + the economic var (Phase 0, for the exhaustion weight). (gate #11)
7. *(Future)* Religious axis on the `religious_authority` channel — same `contestOverThirdParty` shape; military attrition (OQ9) if in scope.

Gallery filters (importable + 3-tab content type) are **unrelated** and ship in parallel anytime.

---

## 8. Cross-system impact map (what war does to every subsystem)

A war/trade state is never just a channel + a condition — it ripples through economics, resources, defense, institutions, NPCs/power, population, and the narrative surfacing. The audit's verdict per subsystem: what **rides existing rails** (reuse), what's a **gap to close**, and what's a **net-new lift**.

### Economics
- **Reuse:** the condition→`trade_connectivity` seam (`causalState.js:386`) is the ONLY economic mover — route ALL war economics through conditions, never a bespoke mutation. `vassal_tribute_extraction` (`relationshipEvolution.js:1265`) already drains a junior; `tradeScarcityFlows` (`flows.js:114`) already cascades a supplier-in-crisis to its dependents (the trade-war loser is exactly that); a sustained low-economy streak already CLOSES institutions (`institutionLifecycle.js:113,563`).
- **Gap:** occupation carries no `trade_connectivity` hit (lighter than siege); the trade war's `economicStrength(X)` term has no live home; demand never shifts to military provisioning under war (`demandProfile.js:39`, generation-frozen); `economicComplexity` never degrades.
- **New:** the `economic_capacity` variable + its fold into confidence (OQ7); a `war_drain` condition (severity ∝ `war_front` count via `countChannels`, `pressureModel.js:142`); occupation extraction = attach `vassal_extraction` to the occupied settlement.

### Resources / Food / Supply chains
- **Reuse:** the besieged larder is excellently modeled — blockade cuts imports + drains the granary over rationed ticks (`foodStockpile.js:255-298`), the **siege→famine synergy** is wired both ways (`stressorGates.js:251`, `stressorDynamics.js:463`), magic-transit partly runs the blockade (`foodStockpile.js:114`), and a severed chain **already cascades to dependents** via the regional state-diff path (`deriveRegionalState.js:182` → `propagation.js:270` → `supplyChainState.js:252`).
- **Gap:** **an army on campaign does not eat its home stockpile** (the single most-overlooked resource cost); occupation EXTRACTION (`deriveExportsFromChains`'s "taxed by occupation") is generation-only, never run in the pulse; famine/market_shock **spread along trade channels** — a blockade/trade-war win can propagate famine two hops away (unstated).
- **New:** `supplyCompleteness(X,K)` as a 0..1 scalar does NOT exist (only per-chain status enums + counts) — net-new derivation for §3.2 eligibility; an army-eats-stockpile term routed through `foodStockpile`'s `effectiveDeficit` (NOT a parallel counter — double-drain risk, occupation is already a blockade type).
- **Key insight:** **the food layer IS the siege clock** — `storageMonths` is simultaneously the granary, the famine-immunity shield (≥4 months), and a leg of the siege counterforce. §2.2/OQ1's "occupation odds" must read it (and carve out the magic-transit bypass — a teleport metropolis doesn't starve on schedule).

### Defense / Military
- **Reuse:** `deriveDefenseReadiness` (`causalState.js:445`) walks any `defense_readiness`-tagged condition and applies a reversible delta — the **exact, engine-ready seam** for the deploy debuff (restore = remove the condition, never recompute the clamped score). Three relevant archetypes already tag it: `war_pressure` (besieger drain), `alliance_burden` (relief burden), `vassal_extraction` (vassal constraint). `windDownSponsoredStressors` is the LOCKED failed-vassalization lever.
- **Gap:** **occupation-disarm is generation-only** (`powerGenerator.js:1223` faction ×0.3; `defenseGenerator.js:383` military −35) — a mid-campaign occupation gets the readiness condition but NOT the faction disarm (powerStructure is frozen); walls never degrade from siege duration.
- **New (DECISION):** **military attrition** — `settlementStrength` reads only mean-reverting pressure, so a defeated aggressor snaps back to full in ~9 ticks → war-spam. A durable post-war penalty needs net-new **non-mean-reverting** state (a long-`maxAge` `war_exhaustion` condition, or an attrition term ratcheted like `leverage`). The singleton "one army" has no magnitude to deplete — attrition must live on the settlement (OQ9). **Dedup rule needed:** one act of besieging must not stack `war_pressure` + the deploy debuff + the `war_front` pressure bump into a triple defense hit.

### Institutions (the doc never mentioned them — major omission)
- **Reuse:** the **reversible cause-keyed impairment** stamp (`blockadeTransport.js:34`, today only airship docks) is the exact template for "siege shutters the market/court" — generalize the matcher; the economy-drain→`declining`→**close** lifecycle (`institutionLifecycle.js:666`) means war reaches institutions FOR FREE; the tier-demotion fate map (`tierResourceDynamics.js:97`) + `events/mutate.js` add/remove are the occupier suppress/install primitives; the catalog has paired **free-vs-lord government variants** (`exclusiveGroup:'government'`) for the vassal swap.
- **Rule:** war effects must be **IMPAIRMENTS (reversible)** for transient states (siege/deploy) and **closure/remnant ONLY** for terminal ones (occupation suppression) — or relieved settlements stay shuttered forever. Route through the single `rollCandidates` seam (no double-count) and extend the close→reopen keep-filter to preserve war impairments.
- **New:** occupation suppress/install; vassal government-variant swap; a `staffing` impairment on the militia/garrison institution when the army deploys (the muster, visible at the institution layer).

### NPCs / Factions / Power
- **Reuse (strong):** **regime change after conquest is fully plumbed but never fires** — `transferRulingPower(cause:'conquest')` with "Occupation Authority"/"Foreign Administration" labels + conquest-cold legitimacy reseed (`rulingPower.js:87,327,376`), routed by `applyWorldPulse.js:221`; the §2.6 return resolver has both branches live (`coupVerdictOutcomes`/`resolveCoupVerdict` for coup; `vassal_rebellion_succeeds/quashed` for rebellion); `factionCapture` history idiom stamps "The Sack of X"/"The Liberation of X"; `successorNpc` reseats a fallen ruler/commander.
- **Gap:** **the army has no human carrier** — bind each deployment to the **military faction + a garrison-commander NPC** (`seatNpcsIntoFactions`), so a captured/killed commander reshapes the coup field on return; **war never kills/displaces NPCs** (only corruption-ousting does); faction competition doesn't intensify under war (extend `dominantRelationshipContext` with `besieging`/`occupied`/`army_deployed`); the `loyalty` NPC field is **written but never read** — the return coup should be its first consumer.
- **New:** emit the occupation `power_transfer` (puppet install) on a won siege + a counter-transfer on liberation; a one-shot NPC-casualty/displacement on a sack (distinct from the slow rate), graduated to settlement history.

### Population / Migration / Refugees (~60% ready)
- **Reuse:** `flows.js` refugee transfer is **already war-aware** (`DISPLACEMENT_STRESSORS` ∋ siege/occupation/wartime), a conserved debit-source/credit-dest down migration channels; relationship-weighted dispersal makes refugees **shun the occupier** (hostile 0.15 < 0.35 admission bar); depopulation → **tier demotion** (`tierResourceDynamics.js:153`) → weaker prize → feeds confidence/homeostasis (population is 0.22 of `settlementStrength`); the receiver's food+housing strain is already modeled.
- **Gap (DECISION):** **does war KILL or only DISPLACE?** Every loss path today is flight (people survive elsewhere) or slow rate-decline — a "sack" is demographically gentle (OQ8). Occupation's archetype blind spot (populationDynamics ignores `vassal_extraction`); **double-displacement** risk (mass-emigration + flows both fire); **no refugee return** (permanent demographic leak); the **refugee cascade** (a wave tips the receiver into its own crisis) has **no convergence gate** — add one alongside §6.4.

### Surfacing & parity (so war TELLS its story)
- **Reuse:** the condition-archetype → causal → `compareCausalState` delta → `explanation.js` → chronicle → settlement-history → realm-arc pipeline is genuinely good — ride it. `siege_lifted` is the ONLY positive-polarity recovery archetype (`causalState.js:248`); `synthesizeRealmEvents` promotes a type gripping ≥3 settlements to "The War"/"The Occupation"; `HISTORY_EVENT_TYPE` already maps occupation→`occupation_legacy`.
- **Gap:** the **dual-vocabulary surfacing break** + the **PDF legacy-4-dim vs 14-var-substrate parity break** (§0.5); chronicle grounding carries `attackerLabel` but NOT the new `primaryInstigatorId/supporterIds/contestedThirdPartyId/commodity` (so the AI can't name the coalition); realm-arcs count **victim** settlements, so a 4-member coalition vs 1 target reads as a 1-settlement event; `deriveProvenanceSummary` has no category for autonomously-generated world-pulse state.
- **New archetypes (with REAL affectedSystems):** `army_deployed`→`['defense_readiness']`+economic; `war_drain`→the economic var; `relief_burden`→reuse the **orphan `alliance_burden`** + add its promotion rule; `occupation_lifted`→positive-polarity clone of `siege_lifted`; `primary_supplier_won`→the **first positive trade archetype** (the winner's gain — today every trade archetype is a loss).
- **No-echo, refined:** a deployment RETURN must NOT echo/graduate (no chronicle noise); but a CONQUEST outcome (occupation taken, vassal made, trade crown won/lost) MUST graduate into settlement history via `withCampaignHistoryEvent`. Distinguish the two explicitly.

---

## 9. Open questions for the owner (decide before/within the relevant phase)

- **OQ1 — "increases the chance against occupation":** confirm = coalition size raises **occupation-
  success** odds (overwhelm the defender), not the defender's resistance.
- **OQ2 — escalation trigger:** what *exactly* tips a **lost trade war** into a siege? Proposed: a lost
  trade war leaves accumulated cold_war resentment; **escalation requires the confidence gate to pass
  AND resentment over a threshold AND DM proposal** — so conquest-for-trade is the rare dramatic outcome,
  not the default. Confirm the bar.
- **OQ3 — numbers:** `HOSTILE_CONFIDENCE`, drain-per-front curve, deployment duration N, recall
  acceleration, the contest weights `w_*` and decisiveness `k`, incumbency strength, hysteresis K.
- **OQ4 — religious axis:** in scope later as a 4th competition mode on `religious_authority`, or drop?
- **OQ5 — relief/liberation visibility:** are deployments DM-visible cards (overt, like a siege) or
  covert until they matter (like betrayal)?
- **OQ6 — coalition formation:** do supporters join a siege automatically (shared hostility to T) or only
  by DM proposal?
- **✅ OQ7 — the economic dimension — LOCKED = Option A (the high-dividends/coherence choice).** Add a new **`economic_capacity` SYSTEM_VARIABLE** (deriver: baseline from tier + economicComplexity, then condition deltas; label + polarity higher-is-better) and a **dedicated economic term in `settlementStrength`/confidence**. The `war_drain`, the trade-war `w_eco`, and the sue-for-peace weight all read this one purpose-built dial — NOT an alias onto `trade_connectivity` (which would conflate blockade with war-bankruptcy, triple-cut the same variable, and perturb all relationship math). This is **Phase 0**. ("Fix things as they come" — calibrate after the loop closes.)
- **OQ8 — casualties vs displacement:** does war **KILL** population (a net-new one-shot casualty term on siege/occupation resolution) or only **DISPLACE** it (today's engine — `flows.js` refugee flight, conserved)?
- **OQ9 — military attrition:** is a **durable** post-war weakening in scope? Today conditions expire in ~9 ticks and `settlementStrength` fully recovers (war-spam risk). A durable scar needs net-new **non-mean-reverting** state on the settlement (the magnitude-less "one army" has nothing to deplete).
- **OQ10 — occupation depth:** does a **mid-campaign** occupation reproduce the rich generation-time effects (faction disarm ×0.3, government-variant swap, institution suppression) on the tick, or stay the thinner condition-only version? (They'll disagree on the same "occupied" settlement otherwise.)
- **OQ11 — surfacing & parity:** (a) add the reverse `PULSE_TO_GEN` read-alias so a world-pulse siege lights the PDF military banner + defense gates; (b) must war effects also update the **legacy 4-dim `systemState`** the PDF renders, or are they **screen-only** with the PDF out of scope?
- **OQ12 — the army's face:** bind each deployment to the **military faction + a garrison-commander NPC** (so capture/death reshapes the return coup and the write-only `loyalty` field gets a consumer), or keep the army a faceless economic/defense quantum?
- **OQ13 — aggressiveness shape & inputs (Feature C.1):** confirm the personality signal = the **authored `npc.personality` strings** (recommended — matches the dossier) not the RNG-rolled `npcStates.alignment`; **signed (−1..+1)** so it pulls both ways; faction-importance weighting = `dotRank × normFactionPower`, governing faction up-weighted (and do non-governing factions contribute at all?); reuse/re-center **`COUP_COERCION`** as the government baseline or author a new `GOVERNMENT_AGGRESSION_BASELINE`?
- **OQ14 — the history term:** ship Feature C now with a **lossy proxy** (sign of `tradeBalance` + war-incident density — conflates victim/victor), or **block** on the net-new ratcheted `worldState.dispositionStats` win/loss ledger that the war/trade resolvers (§2.6, §3) would populate? (The "we succeed at war vs trade" learning is impossible without the ledger.)
- **OQ15 — modulation scope:** does aggressiveness multiply **only the war/hostility candidates** (`hostileRules`/`rivalRules`/`coldWarRules`), or **every** relationship candidate via `candidateBase` (the literal "modulate ALL relationship dynamics" ask)? The wider scope moves every relationship determinism fixture and must be re-pinned.
- **OQ16 — chooser path:** emit the strategy move as a **probability-1 resolver** (recommended — the move is already sampled by `weightedPick`, so a second `rollCandidates` Bernoulli would double-randomize) or as a normal candidate into `rollCandidates`? Confirm.
- **OQ17 — Religion: pulse or flavor? — RESOLVED (D.0): pulse.** Runs inside the campaign world pulse, premium by inheritance (advance-time is premium), **dormant until ≥1 deity is assigned** so legacy/no-deity campaigns are byte-identical.
- **OQ18 — Religion: the criminal-gate crux.** corruption onset is hard-gated on `hasCriminalInst` (`corruption.js:521`), so an evil deity "corrupts the faithful" no-ops in a crime-free town. Rethink the gate (deity as an institution-independent onset path) or route deity-punishment only through the exposure/demotion side (runs regardless)?
- **OQ19 — Religion: premium enforcement depth — RESOLVED (D.0): client-only gate suffices.** A god is inert custom content until a **premium** account runs the pulse; a free user who POSTs a god can never advance time to make it act, so no server-side tier predicate is needed.
- **OQ20 — Religion: primary-deity authority.** the design says the DM **assigns** a primary deity AND deities **contest** to replace it — confirmed model: the DM assignment is the **incumbent seed**, the contest can overwrite it (stored-but-contestable). Confirm DM intent doesn't hard-lock against the simulation.
- **OQ21 — Religion: the pantheon balancing.** derive major/minor/cult tier **lazily from seatsControlled** (recommended — avoids a global per-tick rebalance, the determinism danger zone) or run a global promote/demote pass each tick? Either needs hysteresis + a cascade-containment gate (religion is more connective than war).
- **OQ22 — Religion ↔ Feature C.** the deity temperament (warlike/peacelike) folds into the **existing `aggressiveness(S)`** as one more term (recommended — one model) rather than a parallel war/peace multiplier. Confirm + define how it composes without double-counting.

---

## 10. Glossary — new concept → existing primitive it rides on

| New concept | Rides on |
|---|---|
| Coalition siege | `war_front` channels (hostile) + siege stressor `originContext.{primaryInstigatorId,supporterIds}` |
| Relief deployment | `military_protection` channel (allied/patron) added to the defender side |
| Liberate occupation | new `war_front` vs the occupier at the occupied site (counter-siege) |
| One army | a single `worldState.deployments[id]` record / `deployed_troops` stressor |
| Wartime drain | reversible active condition on economic capacity ∝ active `war_front` count |
| Confidence gate | `coalitionStrength` (settlementStrength + `protectorBackingScore` over allies) |
| Vassal forces trade | `relationshipHierarchy` cascade on the `political_authority` channel |
| Primary supplier | derived `primarySupplierInto(C,K)` over `trade_dependency/export_market/trade_route` strength |
| Trade war | `cold_war` on A↔B with `{contestedThirdPartyId,commodity}` metadata + `cold_war_supply_sanctions` + `market_shock` |
| Return-to-trouble outcome | `deploymentReturnOutcomes` resolver, `coup.js`/`coupVerdictOutcomes` shape |
| Timers (return/relief/drain) | `queuedImpacts` (`delayTicks` → `queued/applied/resolved/expired`) |
| Religion (Feature D) | add-a-god custom-content bucket + `config.primaryDeityRef` (embedded snapshot) + `religiousContest` (contestOverThirdParty) on the `religious_authority` channel/variable |
| Faith spread | the existing `religious_conversion_fracture` stressor (already `spreadChannels:['religious_authority']`, +1.6× on occupation) + a NEW `religious_authority` channel mint |
| Deity → NPCs | a signed `TRAIT_ALIGNMENT` lexicon (authored personality) feeding the corruption knobs (`onsetHazard`/`exposureChance`/`dotRank`) — never mutating `personality` |
| Deity → war/peace | a temperament term in `aggressiveness(S)` (Feature C), same `candidateBase` multiplier |
| Pantheon | ratcheted `worldState.pantheon[deity]={wins,losses,seats,tier}` (dispositionStats-shaped), tier derived lazily from seatsControlled |
| Occupation regime change | `transferRulingPower(cause:'conquest')` → "Occupation Authority" puppet (`rulingPower.js:376`) |
| War refugees | `flows.js` refugee transfer (war-aware) + relationship-weighted dispersal (refugees shun the occupier) |
| Army eats home stockpile | a deployment term on `foodStockpile.effectiveDeficit` (NOT a parallel counter) |
| Siege shutters markets/courts | reversible cause-keyed institution **impairment** (`blockadeTransport.js` template, generalized) |
| War hollows the economy | drain → causal economy score falls → `institutionLifecycle` `declining` → close (already built) |
| Trade-war loser cascade | `tradeScarcityFlows` propagates `regional_import_shortage` to the loser's dependents |
| Army's human carrier | military faction + garrison-commander NPC (`seatNpcsIntoFactions`) — OQ12 |
| Economic dimension | a new `economic_capacity` causal variable (or `trade_connectivity` alias) + a confidence term — OQ7 |
| Conquest history | `withCampaignHistoryEvent` graduation ("The Sack of X" / "The Liberation of X") — distinct from the no-echo deployment return |
| Aggressiveness disposition | per-tick signed scalar = `govBaseline` (`COUP_COERCION`-shaped) + importance-weighted NPC personality (`TRAIT_AGGRESSION` lexicon × `dotRank` × `factionPower`) + win/loss history — modulates `candidateBase` (`relationshipEvolution.js:369`) |
| Strategy chooser | `evaluateSettlementStrategyRules` — a settlement-tier generalization of `npcAgency.evaluateNpcRules` (enumerate → score → `weightedPick(exp(k·u))` → one move) |
| Return-home priority | a HARD OVERRIDE (probability-1 deterministic bypass, `advanceCampaignWorld.js:385`), never a high weight |
| Sue-for-peace | gated chooser pulling existing levers: `hostile_truce`/`cold_war_thaw` labelProposal + `windDownSponsoredStressors` |
| Disposition win/loss ledger | net-new ratcheted `worldState.dispositionStats[S]={warWins,warLosses,tradeWins,tradeLosses}`, populated by the war/trade resolvers |
