# DESIGN — THE NAVY (the sea is a road where losing means drowning)
## Fable 5 architecture, 2026-07-15 — owner-commissioned: navies convoy own/allied armies on water routes; hostile navies meeting = a sea battle with LAND-PARITY semantics (loser retreats to home port); an army at sea shares its convoy's fate; and THE BLOCKADE LAW, verbatim: "a blockade is the same as a siege." Grounded by the dedicated naval recon (2026-07-15) whose headline reshapes the wave: M8 sea lanes are FULLY BUILT and armies already implicitly sail — routing folds sea edges in whenever an endpoint is a port, ~10× cheaper than land, storm-seasoned. W-NAVY formalizes an implicit path property into a named military reality.
### Companion: DESIGN_CONVERGENCE (the engagement law navies join). Builds as W-NAVY immediately after W-CONVERGENCE.

## 0. THE SCOPE SUPERSESSION (conscious, owner-driven)
M8 shipped with a declared boundary — seaLanes.js: "NO FLEET COMBAT… this module mints no
battle" — and a pin freezing the digest slot's exact shape. The owner's three naval laws
explicitly supersede the boundary. HOW we supersede honors the pin: **navies never live in the
frozen slot.** Fleet state lives in `spatialLedgers` (the armyTransit pattern — drop-when-empty,
zero eager, no digest version-axis event, no re-canonize). The M8 slot stays byte-frozen; the
"no fleet combat" scope comment is amended to point here. (JUDGMENT, vetoable: ledger-not-slot.)

## 1. THE NAVY (the unit)
One navy per port settlement (JUDGMENT: mirrors the one-army law; a settlement that is not a
port per the digest's `isPort` read has no navy). CAPABILITY derives — never persists — from
what exists: port geography (the digest) ∧ maritime institutions via the Facet Law
(`hasWaterAccessInstitution` narrowed to the `shipbuilding` tag / the city Shipyard's
`military` tag; a custom "Drydock Guild" declaring naval-capable COUNTS), scaled by economy
tier. The existing `hasNavy` defense bucket and the `Navy (if coastal)` gate feature — display
prose today — become the legibility surface of a real number. Naval strength joins the martial
reads as a parallel facet (JUDGMENT: never a field on the land-readiness scalar). Upkeep rides
the prosperity-affordability idiom (the SEE/official-pay precedent).

## 2. CONVOY (function one)
`planConvoy`: an ArmyTransitRecord with `mode:'sea'` + a new `ARMY_ROLES.CONVOY` (the recon's
role-coercion trap is a named fix: `armyRecordOf`'s unknown→'march' coercion extends or reds).
The record carries OWNER (the navy's home port) ≠ CARGO (the army's home — the allied-convoy
case the home-keyed ledger strains; JUDGMENT: convoy records live in `spatialLedgers.
navalTransit`, sibling to armyTransit, carrying both ids). Speed: a per-mode factor at the
plan seam — sea legs are already ~10× cheaper through the cost calibration; the mode factor
makes the advantage deliberate rather than incidental. THE STORM LAW already prices seasons
(spring 1.3 / summer 1.0 / autumn 1.5 / winter 2.5) — winter convoys are the risk the EV must
respect, which quietly delivers the seasonal-campaigning texture at sea for free. CAPACITY:
the convoy system becomes the FIRST consumer of the recorded-but-unenforced
`SEA_LANE_CAPACITY` (a soak-tunable throughput bound; deferral-visible when full).

## 3. SEA BATTLE (function two — the owner's parity rule)
Two hostile navies whose paths share a SEA EDGE collide (the recon's precise gap: today's
collision is node-shared only — the wave adds the shared-sea-edge predicate, derivable from
consecutive path pairs ∩ seaLaneAdjacency). Resolution: `resolveFieldBattle` VERBATIM (the
pure sigmoid, bounded attrition, the same fork idiom — land parity by construction). LOSER
RETREATS TO HOME PORT via the existing retreatRoute/recall flow verbatim (it already routes
over sea edges). Hostility: the graph's hostile relationship labels + the convergence law's
contest-side predicate (JUDGMENT: NOT the mutual-homeland predicate — navies blockade and
escort in peacetime; the marching-on-each-other's-homes test is too narrow at sea).
**SHARED FATE (JUDGMENT, the owner's "an army at sea shares its convoy's fate" bounded by the
constitution's never-annihilated law):** a lost sea battle inflicts CATASTROPHIC-but-bounded
attrition on the embarked army (the heaviest loss band in the engine — losing at sea is worse
than any land defeat) + forced debark at the nearest friendly port, whence the survivors
retreat overland. The convoy EV prices exactly this: speed against ruin. Fog: sea lanes carry
only the ship rumor-carrier over a sparse edge set — naval movements are topologically
stealthier, `fought_blind` more common, and the PHANTOM FLEET is possible through the
information machinery with zero new code.

## 4. THE BLOCKADE (the owner's law: a blockade IS a siege)
A navy blockading a port MINTS A SIEGE through the existing machinery — no new verdict, no new
record type: the blockade is a siege whose interdiction term (`resolveSiegeVerdict` already
carries it) is fed from the water side, whose supply-cutting rides `routeIntercepted` (a
hostile navy holding the port's sea approaches IS the hostile-intermediary predicate), and
whose feasibility reads naval strengths against harbor defenses. The M8 parity pin already
enshrines the law's physics: **a port starves only when BOTH land AND sea are cut** — so a
blockade alone strangles commerce (feeding economic_strangulation) while combined arms (land
siege + blockade, one aim-group under the convergence aggregation) starves. Downstream, all
free: BLOCKADE-RUNNING is M7 smuggling over sea paths (one roll vs the worst gate — the
blockading fleet is the gate); LIFTING the blockade is a relief fleet engaging under the
convergence law (sea battle, loser retreats); the supply-web `interdiction` instrument gains
its physical naval mechanism (closing that documented deferral).

## 5. PIRACY (the parity clause the gap-hunt named)
Pirates are bandits on water: sea-edge danger rides the SAME embattlement/danger scoring that
prices land banditry (the M8 pin already treats port-node embattlement as piracy), preying on
convoys and fat shipments, weighted by criminal-facet density at adjacent ports (a pirate
haven is a port whose underworld is strong — the thievesGuildStrength read at sea) and DAMPED
by naval patrol presence (a navy at home suppresses local piracy — the counterplay). Raiders
respond to broadcast wealth per the generosity coupling. Largely weights + one danger term —
data-and-coherence, not new machinery.

## 6. CONSTITUTIONAL POSTURE
Dormant: virtual `navalEnabled` sub-flag AND the spatial marker (navies are physical — the
armyTransit gating precedent; no DEFAULT_SIMULATION_RULES entry); absent ⇒ byte-identical
(fenced dormancy golden; the recon's tripwire list — seaLanesGolden, spatialDigestGolden,
worldpulseSpatialGolden, armyTransitFieldCombat, statefulArmies, moverCompositionSmoke, the
M9d initiation-split pins — after every substantive change). Aspatial worlds: no sea (the
digest is the water's only home) — navies are spatial-only by nature, and that is correct.
Conservation absolute (embarked armies are the same conserved units; drowning is attrition
within the never-annihilated bound). First-paint ≤ the standing budget (engine-lazy;
seaLanes stays imported only by the digest — preserve the builder/reader split). §H loaded
dice on initiation (E0-classed; convoys routine, blockades drama). Authority: blockade
initiation = a campaign-altering candidate through authorityFor (the siege-initiation twin).
Counterpart criterion: ORDER_CONVOY / DECLARE_BLOCKADE verbs in registrable shape for the
W-COMPOSER-2 manifest lift.

## 7. PINS (headline set)
Dormancy byte-identity (flag dark ⇒ zero keys, zero forks); land-parity (sea battle = the
same resolver, same bounds, fork-keyed); shared-fate (lost convoy ⇒ heaviest-band army
attrition + debark-retreat, never annihilation); retreat-to-home-port reuse; the blockade
siege-mint (interdiction term fed, verdict machinery untouched); the both-cut-to-starve law
(blockade alone strangles, combined arms starves — the M8 pin extended); blockade-running
(a smuggle roll vs the fleet gate); lift-the-blockade (relief fleet, convergence law, loser
retreats); phantom-fleet reactivity; piracy dampens under patrol (negative control: no navy ⇒
prior danger); capacity deferral visible; the role-coercion fix pinned; storm-season pricing
respected by convoy EV (winter crossings rare).

## 8. SEQUENCING
W-NAVY builds immediately after W-CONVERGENCE (its battles join the engagement law; its
blockades join the siege law; its verbs join the same manifest lift). With CONVERGENCE +
NAVY + W-UPSWING (the reconstruction/boom counterweight, already frozen in the G3/cohesion
corpus), the simulation is CONCEPTUALLY COMPLETE per the 2026-07-15 gap audit — nothing else
passes the four-boundary filter.
