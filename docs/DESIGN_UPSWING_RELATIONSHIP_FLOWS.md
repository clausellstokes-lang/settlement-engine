# DESIGN — UPSWING DRAMA + RELATIONSHIP-DRIVEN MATERIAL FLOWS ("the generosity engine")
## Fable 5 architecture, 2026-07-14 — owner-approved to architect; BUILD queues AFTER the fix program
### Companion to: PHASE55_SPATIAL_ENGINE_DESIGN.md (the mover substrate), COMPREHENSIVE_REVIEW_2026-07-13.md §3 (the asymmetry evidence)

## 0. Thesis
The review proved the engine's loops close mostly through *decay and exhaustion* (wars wear out,
plagues clear, stressors wind down) while the constructive half of the action vocabulary is thin:
relationships change what settlements KNOW and whom they FIGHT, but never move a sack of grain.
This design gives the world its generosity verbs and its upswing arcs — drama with a positive
sign — using ONLY existing substrate (M2 shipments, M4 arrivals, M6 stocks/EV, W-C2 conscience,
W-C3 founding lane, condition/stressor lifecycle, UPGRADE_CHAINS, legitimacy, receipts).
Design values inherited unchanged: bounded, receipted, seeded-fork deterministic, aggregate-only,
dormant-by-default, conservation-exact, no hand of miracle — and no free candy: every upswing
carries its own counterweight.

## 1. Gates (constitutional)
Two new simulationRules flags, both ABSENT from DEFAULT_SIMULATION_RULES (ride the ...input
spread ⇒ byte-identical off; the M6a/M10a opt-in pattern):
- `constructiveFlowsEnabled` — Part A (relief, purchase, credit, overture).
- `upswingArcsEnabled` — Part B (reconstruction, boom, flourishing).
Preset lighting is OWNER-GATED (recommend: living_realm + full_simulation light both; the
dramatic_campaign depth review folds in here). Spatial flows additionally require the spatial
marker (they ride shipments); aspatial fallback noted per mechanic. Zero eager bytes: all state
nests under existing conditional keys (spatialLedgers / conditions); all display is lazy.

## 2. PART A — RELATIONSHIP-DRIVEN MATERIAL FLOWS

### A1. RELIEF CARAVANS (the flagship)
TRIGGER (per tick, codepoint-sorted pairs, seeded fork `relief:${from}:${to}:${tick}`): receiver
in famine/starvation band (foodStockpile band ≤ scarce OR supply_starved active) AND sender holds
surplus above GRANARY_RESERVE_FLOOR (never starve thyself — the hard brake) AND the edge qualifies:
relationship ∈ {ally, trade_partner+positive disposition} OR (W-C2 conscience: lawful-good-leaning
senders relieve even mere neighbors — alignment read via the ONE W0 read). EFFECT: a relief
shipment rides the EXISTING supplyShipments ledger with `kind:'relief'` (no new ledger, no new
cardinality class) at hopWeeks latency; banditry/gate pipeline applies UNCHANGED (tolls apply in
v1 — one pipeline, no special-casing; a safe-conduct exemption is a v2 flavor decision). ARRIVAL:
sender foodStockpile debited exactly, receiver credited exactly what survives the road; losses
booked to the loss lane — CONSERVATION EXACT, asserted (the M4/M6a invariant pattern).
CONSEQUENCES (all receipted): receiver ruler legitimacy small lift + a relationship-strengthening
deposit banked BOTH directions (closing the defenders-never-bank asymmetry class); temple-mediated
relief (sender routes via its strongest religious institution when roster-present) adds a piety
pulse — the M11a temple-relief seam reused. EMERGENT (free): relief into a plagued town risks
contraction once the G1 plague couplings are wired — mercy has a price; the quarantine dilemma
gains a moral horn. BRAKES: per-tick relief cap (RELIEF_MAX_FRACTION of sender surplus), dwell
(no oscillating grain pumps), reserve floor, sparse (fires only in crisis bands).
ASPATIAL FALLBACK: an instant bounded transfer at 1-tick delay (no travel), same conservation.

### A2. GRAIN PURCHASE (the market twin)
A shortage settlement with prosperity above a floor BUYS from the cheapest reachable surplus
neighbor — the non-ally, priced version of A1. Rides dispatchEV (M6c) semantics: need-premium
already exists; the purchase debits receiver prosperity one band-step and credits the seller
(receipted trade income; folds like toll income into institutionLifecycle health, dormant-0).
Same reserve floor, same shipment lane (`kind:'purchase'`), same conservation. This makes
"isolation = autarky" bite in BOTH directions: a blockade now visibly costs the blockaded town
its market option, not just its charity option. Purchase and relief share ONE dispatch scorer
(relief preferred when the edge qualifies; purchase else) so a settlement never does both to the
same target in one tick.

### A3. ALLY CREDIT / INVESTMENT (deepening the G1a lever)
G1a makes the M9a merchant `credit` lever ACT; this design gives it its arc. Credit = a bounded
prosperity transfer sender→receiver with a maturity record nested under the existing
spatialLedgers namespace (`credits` sub-ledger, sparse, pruned on settlement): {from, to,
amount01, maturedTick}. On maturity: receiver repays principal + a gratitude term (relationship
deposit) if solvent; DEFAULT (insolvent or hostile flip): sender banks a grievance receipt —
relationship damage + a legible casus-belli seam for the war chooser (a real, non-random road to
war that starts with generosity — drama both ways). CAP: outstanding credit per sender bounded;
one credit per pair until resolved. The investment's real yield: receiver's reconstruction rate
(B1) reads active inbound credit as an accelerant — investment is how an ally BUYS a neighbor's
recovery.

### A4. TRADE OVERTURE (trade-as-diplomacy)
Completes G1a's `seek_allies` payload: a settlement courting an ally opens a SUBSIDIZED channel
(grace-period channel mint at a favorable weight, receipted as an overture). If flows actually
run for N ticks, the relationship label warms one step (the existing evolution machinery reads
the flow tally from M6d tradeFlow — coupling two built systems, zero new mechanism). If severed
early, the overture lapses quietly. Bounded: one live overture per settlement; dwell.

## 3. PART B — UPSWING ARCS

### B1. RECONSTRUCTION (calamity/war aftermath — the rebuild race)
TRIGGER: a calamityHistory stamp or an occupation/siege clearing mints a `reconstruction`
POSITIVE-polarity condition via the EXISTING condition lifecycle (crisisLifecycle + the
polarity-aware causal scanner already support it — no new representation). PROGRESS per tick =
f(prosperity band, builder roster (mason/carpenter/lodge institutions — roster read, never a
toggle), inbound ally credit (A3), peace dwell); regressions on new shocks. MILESTONES emit news
in the house voice ("the new granary raises its beams over Thornwood"). COMPLETION: permanent
history beat ("rebuilt in the year …"), legitimacy dividend, and — the jewel — an institution
UPGRADE drawn UP the same UPGRADE_CHAINS lattice calamity demotes DOWN (the demote table read in
reverse gives the upgrade lattice for free; codepoint-sorted candidates, K bounded).
COUNTERWEIGHT (no free candy): reconstruction skim — while active, a corruption-pressure term
scaled by funds flowing (the W-C2 conscience gates it: honest towns rebuild clean, compromised
ones leak) — so the rebuild race can BIRTH the next corruption arc. That is an upswing that
plants a story.

### B2. BOOM → BUST (making the existing fragility legible as an arc)
TRIGGER: sustained trade throughput (M6d tally) + entrepôt centrality + surplus dwell → a `boom`
condition: founding-lane acceleration (W-C3 cadence bonus), migration pull (M4's richness axis
already reads prosperity — no change), prosperity drift up. THE BUST IS ALREADY BUILT: boom
deliberately RAISES dependency concentration (the M2 <2-independent-sources fragility flag) —
the condition records its own fragile edges; a severance/embattlement event during boom flips it
to `bust` (prosperity retreat + emigration pulse + a legible receipt naming the severed artery).
Boom/bust adds almost no new physics — it NAMES a composition the movers already produce, gives
it hysteresis (enter/exit bands + dwell), and makes it receipt-visible. This is the cheapest
high-drama arc in the design.

### B3. FLOURISHING (the golden-age homeostat, modest v1)
When prosperity + legitimacy + peace-dwell all hold high N ticks (rare by construction):
a bounded `flourishing` condition — positive tolerance drift, temple/academy founding bias,
piety warmth, a chronicle beat. It is war_exhaustion's mirror: a gentle attractor toward
cultural texture, NOT a power snowball (no military/economic multiplier — flavor + founding
bias only, capped duration, cooldown). Exists mostly to make peace narratively fertile instead
of silent — the anti-stasis fix on the upswing side.

### B4. PILGRIMAGE (v2, flagged, design-later)
Faith upswing flows (pilgrim seasons to a flourishing temple, prosperity + faith spread along
routes, riding M4-lite arrivals). Deferred: needs the faith constitution review; recorded here
so the seam is named.

## 4. Determinism, conservation, cardinality
All rolls are seeded forks on stable composite keys (`relief:…`, `credit:${from}:${to}:${mintTick}`,
`upswing:${id}:${tick}`); all pair iteration codepoint-sorted; conditions ride existing
machinery; ledger growth bounded (credits: ≤1/pair; relief/purchase: transient shipment records
in the existing ledger; conditions: one per settlement per kind with dwell). Conservation
invariants asserted: food (A1/A2 exact), prosperity transfers zero-sum ± documented sinks,
UPGRADE never mints a duplicate id (reuses the calamity-demote dedup fix from G-track).

## 5. Test plan (per-wave pins + one soak)
Dormancy byte-identity (both flags off ⇒ zero new keys, goldens byte-identical); conservation
properties (relief/purchase/credit round-trips exact under fast-check); reserve-floor never
crossed; relief-reaches-only-qualified-edges (adversarial fixture: hostile pair never relieves);
credit default mints the grievance receipt; reconstruction completes within envelope + skim
fires only under low-conscience; boom names its fragile edges and busts on severance; the
30-year "war → peace → rebuild → boom" soak: an 8-settlement realm that ends a war and shows a
receipted recovery arc WITHOUT owner intervention — the upswing counterpart of the war-ends-
endogenously certification.

## 6. Sequencing + owner decisions
BUILD ORDER (after the fix program, per the owner's sequencing ruling): A1 relief → A3 credit
(rides G1a's lever seam) → B1 reconstruction → B2 boom/bust → A2 purchase → A4 overture → B3
flourishing → (v2: B4, safe-conduct tolls, proud-refusal, evil relief-for-leverage).
OWNER DECISIONS QUEUED: preset lighting for the two flags; tolls-apply-to-relief (v1 recommends
yes); whether flourishing may bias PDF/dossier voice (recommend yes, lazy).
Golden posture: everything here is flag-gated ⇒ Track-N-style byte-identity while dark; lighting
presets is the same owner golden-decision as the rest of the preset batch.
