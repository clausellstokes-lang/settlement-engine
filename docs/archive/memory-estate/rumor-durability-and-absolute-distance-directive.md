---
name: rumor-durability-and-absolute-distance-directive
description: "OWNER DIRECTIVES (2026-08-05): (1) truth in rumors is MORE DURABLE through transit/hops scaling with event SEVERITY, unless deliberately manipulated; (2) realm distance is ABSOLUTE, derived from the map's declared scale (miles), never normalized to a fixed 2-8 march-week span. Both fold into DESIGN_FP_ARCHITECTURE at the integration pass"
metadata:
  type: project
  created: 2026-08-05
  originSessionId: c44e5d99-2ba5-49d5-a554-40b68534c8eb
  modified: 2026-08-06T10:27:45.655Z
---

# Two late design directives (owner, 2026-08-05, post-espionage)

## ✅ WAYFARE ARCHITECTURE COHESIVE (2026-08-05, run wf_6b8020de-71c, r3)

VERDICT COHESIVE at draft r3 — 1,563 lines, scratchpad wayfare-arch/
DESIGN_WAYFARE_ARCHITECTURE-DRAFT.md. All THIRTEEN directive sections
(1, 2, 2b..2l) absorbed and clause-walked. Final shape: NINE conditional
fields (F9 = supplyCargo, owner-gated sign-off row) + spatialDigest.kmScale;
EIGHT flags (rows 45-52, armySupplyEnabled at 52); TWELVE waves (Engine:
WY-1..6,11; Surface: WY-0,7,8,9,10; WY-8 a declared MIXED wave — slice 8a
is engine, after WY-3, commodityFlow quiet window, CHECK-GIT-FIRST); FP
wave count 68→75; seam matrix 58→66. 2k = supply as {goodClass: units}
over the CLOSED goods vocabulary (food=grain, armor=crafted), conserved
(debited = carried + consumed), surplus-gated reinforcement ("a bled home
sends empty wagons"), OCCUPIED requisition mints resistance-feeding
receipts into WR-10's fragility coupling, FRIENDLY books ally burden;
single-writer armySupply.js + second-writer source-scan mutant. 2l = a
VERIFY-THEN-PIN census obligation (§5b item 10) routed WAR-side via a
war-chair queue row; WY contributes only 2k's receipts; seam-1 tripwire
makes the fold commit incomplete until the item-10 census executes.
All 15 r1 findings closed (both HIGHs verified by executed-logic
scrutiny); 5 chair OQ rulings baked (Q1 conservation as drafted; Q2 home
units DECLARE-ABSENT; Q3 WarFaith deployment arrows DELETED under the
ambiguity law; Q4 popup = PortablePopup modal v1, anchored popover
recorded-not-built; Q5 caravan layer ships against non-food shipments,
legend honest). ⭐ TravelersLayer ALREADY SHIPS — missing exactly three:
anchored popover (deferred), first CLICKABLE derived layer, projection
builders + facet walker. ⚠ ONE DELIBERATE TRANSLATION (owner-vetoable,
one clause): "low supply drags exhaustion up" is rendered as the army's
OWN accumulatedAttrition (condition), NEVER the realm's warExhaustion —
the field-side twin of WR-4's home-front drain, which owns the realm
quantity; seam-1 CONTRACT says WY-8a writes ONLY accumulatedAttrition.
NEXT: the integration pass folds this + the espionage draft into
docs/DESIGN_FP_ARCHITECTURE.md (queue insertion verbatim-landable per
draft §5b).

## 1. Severity-durable rumor truth

Owner verbatim intent: truth in rumors becomes MORE DURABLE through transit
and hopping, scaling with how severe the event is, UNLESS deliberately
manipulated. Chair mechanics (accepted in conversation): per-hop fidelity
decay (completeness01/accuracy01) takes a multiplier INVERSE to the event's
severity band on the freshly-minted single ladder (SP-A @ 59df13a9:
glancing/telling/grave/ruinous) — ruinous ≈ lossless organic transit,
glancing drifts fast. Deliberate manipulation (LIE/plants) bypasses the
durability floor BUT severe events carry more corroborating streams, so a
sustained big lie contradicts more independent reports and raises exposure
odds BY CONSTRUCTION (big lies cost more — emergent, not tuned). Espionage
economy sharpens correctly: spies matter most for drift-prone small facts +
auditing suspicious severe claims; catastrophes stay commonly known (fog
belongs on details/states/intentions, never on burned cities). Lands in the
IN program's rumor mechanics as a one-multiplier amendment, zero new keys.

## 2. Absolute distance from the map's declared scale

Owner verbatim intent: realm distance should NOT be a normalized 2-8
march-week span; it must scale with LITERAL distance under the map's scale
(tens of miles vs thousands), settlements priced by absolute distance.
Chair notes (accepted): this ACTIVATES the parked J-D11(b) socket (the map
km-scale constant for the transit kernel's mode table, war volume §7,
"owner-signed when the mode table lands"). Consequences ride correctly: war
duration scales with theater size; fog scales with real distance (big
realms foggier — spies/magic worth more); large maps regionalize (tyranny
of distance). CARE: (a) every distance-derived band (hopWeeks spectra,
reinforcement, patience timeouts) derives from the WORLD'S OWN measured
spectrum per map — the dead-band law applied per-map; (b) the scale
constant is an OWNER-SIGNED DISCLOSED SHIFT for live-transit worlds (as
J-D11(b) already stipulates); (c) tiny-scale maps become near-transparent
worlds (no fog) — correct simulation; the CREATION FLOW should disclose
the scale-vs-mystery trade, never mechanically distort.

## 2b. Addendum (owner, same night): the roads are inhabited at freeze

With absolute distance, caravans, populations/migrations, armies, NPCs,
envoys, and spies are MID-ROUTE during ticks as a matter of course — at any
freeze review an honest share of the world is camped on roads, scaling with
map size. Chair notes (accepted): the engine already walks movers leg by
leg (paths, legArrivalTick, positionRef, whereabouts 'traveling') — the
scale makes the mid-route state the COMMON case rather than new mechanics.
Consequences: roads become populated exposure surfaces (interception/
capture windows already priced per leg); relief timing becomes visible
drama; absence effects lengthen. FOLD OBLIGATIONS (mechanical): (a) a
CONSUMER CENSUS + totality walker for every reader assuming a mover's
placeId is a settlement (route positions must be tolerated everywhere
read); (b) surface note: the map + dossiers owe the in-transit render
(entities between nodes, camped positions in prose; "still on the road,
expected by first thaw"). Zero new keys.

## 2c. Addendum (owner, same night): THE WAYFARE LAYERS (map transit overlays)

Owner order: architect map layers showing ARMIES, CARAVANS (trade), and
NPCs at their road positions; interceptions (parlays, captures) happen when
they interact; the map tells POSITIONS ONLY — no direction from visual cues;
context comes from READING (the Herald and the likes). Chair architecture
(accepted): three toggleable DM-facing layers (army markers force-BANDED,
caravan movers, named persons) reading existing record state at freeze
(route ref + leg + deterministic progress interpolation), ZERO new keys.
THE AMBIGUITY LAW (ruled): no direction arrows, no destination lines, no
path highlights — a marker is a presence, never an intention; heading and
purpose live in the Herald, dossiers, and click-through record panels
(reading, not visual telling). THE COVERT LAW: covert travelers render
ONLY in the DM's true view, marked covert, omitted fail-closed from every
player-facing export. Encounters: co-location + context through EXISTING
kernels (interception, capture, parlay, convergence); the map SHOWS
encounters (glyph linked to the Herald record), never creates mechanics.
FOLD OBLIGATIONS: (a) the closed ENCOUNTER-PAIRS census + walker (verify
army×caravan seizure vs supplyWebWarfare or record it as the one new arm);
(b) a surface-program wave family beside the in-transit render debt.

## 2d. Addendum (owner, same night): PHYSICAL TRADE — economies persist by ARRIVAL

Owner directive: trade flow must be PHYSICAL — supply chains and economies
persist ONLY when caravans actually arrive, with CONSTANT inflow/outflow
between places; the map's caravan layer must reflect the real flow. Chair
assessment (accepted; "are we set up?" = YES by design): TR-4's grain wave
is the socket — physical arrivals crediting via ONE authored units→months
constant + the T7 walker enforcing EXACTLY ONE regime (netted rate-share
XOR physical arrivals) per settlement per tick forever + commodityFlow
conservation. THE DIRECTIVE GENERALIZES IT: (a) per-good-class regime
flips under the same exactly-one walker as commodity families land; (b)
DISPATCH DEBITS the origin (stock lives in THREE places: origin, TRANSIT
— banded cargo on the mover record — destination; conservation across all
three); (c) supply shocks become physical with LAG (a cut route = missing
caravans weeks later, visible on the Wayfare layer); (d) SEIZURE transfers
cargo to the seizer (raiding economically real; the supply-web prize arm);
(e) QUANTIZATION law: cadence derives from flow bands (half-caravan/month
= one per two months, doubled credit — never a starvation artifact); (f)
the caravan MAP LAYER binds to the physical regime so a marker is never a
lie — the caravans ARE the economy's unit of persistence in transit. Fold:
TR canonical model + TR-4 generalization + war seam at the integration
pass.

## 2e. Addendum (owner, same night): INTERACTABLE WAYFARE + THE POPULATIONS LAYER

Owner directive: every wayfare marker is CLICKABLE — a popup shows what it
is, affiliation, mission, and state. Army/reinforcement: exhaustion,
readiness, experience, troop population + destination and purpose. Caravan:
cargo carried, origin, destination. Counterparts for every type. ADD A
POPULATIONS LAYER (migration columns). Chair architecture (accepted):
RECONCILIATION with the ambiguity law — the CANVAS stays direction-silent;
the POPUP is a READING surface (clicking is reading; truth lives there).
POPUP GRAMMAR = the legibility law embodied: glance (marker/banner) →
sentence (one house-voiced state line) → TABLE (exact figures — the third
register permits numbers) + LINKED RECEIPTS (the entity's recent Herald
lines). Facets render where records carry them and DECLARED-ABSENT where
not (the popup never invents). COVERT: DM popup shows declared face + true
purpose marked covert; the entity is projected out of player exports
fail-closed. THE POPULATIONS IMPLICATION (named): a clickable column
requires PHYSICAL MIGRATION — a POP wave mirroring TR-4's regime-flip
(netted rates XOR physical columns, exactly-one walker, conservation
across origin/transit/destination, dispatch debits + arrival credits).
POPULATIONS POPUP (owner refinement, same night): shows HOW MUCH (banded
size + count in the table register), WHAT FAITHS THEY CARRY (banded
composition derived deterministically from the origin's observance mix at
departure, carried on the mover record like cargo), origin, destination
(or 'seeking'), and WHY (the launching stressor/exodus receipt). THE
WF×POP SEAM (accepted): migration is the PHYSICAL VECTOR of faith
spread — arrival CREDITS the destination's observance mix, conserved;
belief walks in with the column. A large column of one faith marching
toward a town of another is next year's religious tension, visible and
clickable.
THE HOUSE IDIOM (ruled): if it is on the map it is REAL, and if it is
real it is CONSERVED. Popups = read-only freeze projections, zero new
keys; the POP regime flip is the one engine wave. Fold: surface program
(four layers + popup family) + the POP physicalization wave at the
integration pass.

## 2f. Addendum (owner, same night): THE SINGLE-PROJECTION MIRROR LAW

Owner directive: everything a map popup shows must appear IDENTICALLY in
the home dossier — armies show the EXACT same facet set in the war tab for
ALL their units (home + field); NPCs' popup content reflects the NPC tab.
EXCEPTIONS: populations and caravans are map-only (transient movers, not
dossier residents; their traces live in ledgers/Herald). Chair ruling
(accepted): this is the SINGLE-PROJECTION LAW for display — ONE projection
builder per entity kind (armyProjection, personProjection, ...) with an
audience parameter, consumed by the map popup AND the dossier tab AND
future PDF; a totality walker proves the facet sets identical across
surfaces; surface drift becomes structurally impossible. OWNER MANDATE:
comprehensively refine + cohere the full addenda set (1, 2, 2b-2f), then
ARCHITECT it and put it in the QUEUE — dispatched 2026-08-05 as the
WAYFARE (WY) architecture run (censuses → architect → cohesion, the
espionage pattern).

## 2g. Addendum (owner, same night): MOVERS CARRY NEWS

Owner directive: caravans (trade) and populations (columns) carry rumors
and news from place to place. Chair mechanics (accepted): the ambient
hop-speed diffusion STAYS (untracked background rumor); tracked movers add
FIDELITY INJECTIONS — arrival credits tidings from origin + waypoints like
cargo, fresher/more complete than ambient drift; carried news obeys the
severity-durability law and the TAP-ORDER law (movers carry what places
TOLD them = performance fidelity, except self-witnessed events = higher).
THE CONSEQUENCE (named): a town whose caravans stop coming GOES DARK —
one cut route starves grain AND news on the same interruption; sieges
create information blackouts naturally; "no word has come from Alderford
since the thaw" becomes a computed fact. The Wayfare architect absorbs
this section mid-run (it reads this file after its censuses).

## 2h. Addendum (owner, same night): CARAVAN DENSITY SCALES, WITH A FLOOR

Owner directive: regional caravan count scales with economic activity AND
the number/diversity of settlement TIERS (peace + heavy trade = many more
caravans); but trade is the LIFEBLOOD — always a minimum appropriate
threshold from the quantity and quality of settlements. Chair decomposition
(accepted): the scaling is largely EMERGENT from EV-priced dispatch
(TR-3): prosperity raises clearing dispatches; TIER DIVERSITY raises EV
structurally (central-place hierarchy — inter-tier price differentials
make routes profitable; uniform hamlets trade little); war thins roads
emergently (seizure risk lowers EV — no explicit penalty dial). THE
DIRECTIVE'S TWO REAL ADDITIONS: (a) THE FLOOR LAW — per-region subsistence
circulation (peddler-grade minimum) derived from settlement quantity ×
quality, an owner-signed tuning band; ECONOMIC not physical (never
overrides interdiction — cut routes still go dark; the floor means trade
always WANTS to flow, not that it cannot be stopped); (b) THE DENSITY
ENVELOPE instrument — a soak envelope correlating caravan density vs
activity/diversity/war-state, proving lively AND lean regions reachable
(the dead-band law applied to an emergent quantity). Composes with 2d's
quantization cadence.

## 2i. Addendum (owner, same night): CARAVANS FOLLOW THE FLOW OF GOODS

Owner directive: caravans must follow the actual flow of trade goods,
cohesively and exhaustively architected IN the system. Chair principle
(accepted): A CARAVAN IS THE QUANTIZED COMMODITY FLOW, never an
illustration — manifest drawn from the origin's REAL surplus in the CLOSED
goods vocabulary; destination where that good's EV actually clears;
cadence = the flow rate under the quantization law. THE GROUNDING CHAIN
the architect verifies and binds: (a) the closed goods vocabulary (good
classes: the scarcity families' classes, the term catalog `good`
precedent, bandedStock's classes); (b) PRODUCTION TRUTH
(resourceDynamicsKernel + terrain-based yields per settlement); (c)
DEMAND TRUTH (the needs model the dispatch composer prices truth-side,
by tier and population); (d) FLOW TOPOLOGY (surplus@A + deficit@B +
profitable route = a caravan; per-good-class caravan sums reconcile to
commodityFlow conservation). THE BIDIRECTIONAL EXHAUSTIVE TEST: every
manifest traces to a real surplus-deficit pair AND every computed flow is
realized by caravans or explicitly carried netted — the exactly-one
walker deciding which, per good class per settlement forever. Nothing on
the road the economy didn't send; nothing sent that fails to appear.

## 2j. Addendum (owner, same night): CARAVANS READ THE RELATIONSHIP

Owner directive: caravan volume between two settlements scales with their
relationship — trade partnership/allyship = more caravans between them;
war = fewer/stopped (armies interdict). Chair decomposition (accepted):
WAR SUPPRESSION fully emergent (hostility raises expected seizure in
dispatch EV; armies = capture points; interdiction cuts routes).
PARTNERSHIP AMPLIFICATION enters through three existing terms: RISK
(allyship lowers expected loss), COST (the designed market_access /
toll_exemption treaty families mechanically lower route costs between
signatories — the instruments ARE the lever), INFORMATION (ally intel
sharing = fresher market pictures = better-targeted dispatches). TR-1's
partnership pairs supply the typed commercial reasons. THE PAYOFF (named):
pair-wise caravan density becomes an AMBIENT RELATIONSHIP READ consistent
with the ambiguity law — no label says allies, but a thick road tells it;
a once-busy road gone quiet between neighbors is visible trouble before
any Herald line names it.

## 2k. Addendum (owner, same night): MILITARY SUPPLY

Owner directive: military units carry SUPPLIES (armor + food), replenished
(a) by REINFORCEMENTS bringing surplus (if their origin has surplus) and
(b) by RESTING in an occupied or friendly town. Chair mechanics (accepted):
supply = a banded army facet over the SAME closed goods vocabulary (food =
grain class, armor = crafted class — no new resource type; army supply is
stock-in-transit like caravan cargo, conserved); CONSUMPTION runs with
time/march and couples to the popup facets (low supply drags exhaustion up,
readiness down — the FIELD-side twin of WR-4's home-front drain; war cost
gains a geography). REPLENISHMENT: reinforcement columns carry supply AS
CARGO from origin surplus per the 2i grounding chain (a bled home sends
empty wagons — visible in the manifest); resting debits the HOST's real
stores — OCCUPIED requisition feeds the occupation's resistance (the army
eats, the town resents — WR-10's durable fragility gains a feeding
schedule); FRIENDLY hosting burdens allies (coalition strain with physical
roots). EMERGENT: supply lines become strategy (path through friends or
carry trains; cut the road behind an army = starve it in weeks — the
supply-web layer's army-side half; siege doctrine writes itself). SUPPLY
joins the army popup facet table + the mirror-law war tab.

## 2l. Addendum (owner, same night, final): OCCUPATION IS BOTH-SIDED PROSPERITY

Owner clarification: occupation requires prosperity from BOTH the occupied
town AND the governing town — a risk/strategy register for both; believed
mostly built. Chair assessment (accepted, VERIFY-THEN-PIN at the fold):
the OCCUPIED side exists (occupation benefitYield to the occupier;
resistance as fragility; 2k's requisition-resentment coupling); the
OCCUPIER side is the half to pin — holding COSTS the governor (garrison/
administration drain), so occupation is viable only while BOTH
prosperities sustain it (a poor occupier cannot afford to hold; a drained
holding yields nothing and resists more). Feeds the HOLD/RELEASE/SELL
strategy calculus and both dossiers' risk registers. THE EXIT EXISTS
(named): a soured occupation is the sovereignty market's firesale story —
seize, hold while it pays, sell before it ruins you, or hold too long out
of pride (temperament's business). Fold: census the exact existing reads
(benefitYield, war-economy drains, any occupier-side cost) and pin the
both-sided register where the occupier half is missing.

## How to apply

Fold both into docs/DESIGN_FP_ARCHITECTURE.md at the espionage integration
pass: #1 into the IN program (rumor fidelity mechanics + the espionage
seam); #2 into the transit spine (SP-7-adjacent, jointly with the mode
table + km-scale item; creation-flow disclosure noted for the surface
program). Related: [[espionage-confirmers-directive]],
[[unreachable-band-and-absent-self-belief]] (the hopWeeks calibration
whose meaning this changes).

## Migrated from the memory index (2026-08-06)

**THE FOLD IS TASK #34.** The WAYFARE draft folds together with the espionage draft
at the integration pass, and that landing is queue **task #34**. Fold drafting ran
as run `wf_3ab9cd44-602` (a READ-ONLY package: promoted ES/WY files + parent deltas
+ queue rows + amendment pairs); the LANDING waits for cycle 1's lane to release
the tree. See [[espionage-confirmers-directive]], [[fable-build-era-takeover]].
