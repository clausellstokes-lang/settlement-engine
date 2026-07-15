# DESIGN — W-LIFECYCLE: SETTLEMENT BIRTH & DEATH (the ladder gains its two ends)
## Fable 5 architecture, 2026-07-15 — owner-commissioned same day ("design it and place it where appropriate to be built!"), superseding the same-morning post-soak park by direct order. The owner's design, verbatim intent: birth and death both live at the tier ladder's bottom rung ("start and end at the same level, thorp/thorpes"); town-or-higher settlements "naturally begin to produce satellite thorpes surrounding it… with potentially new resources and dynamics"; thorps are "extremely precarious without economic backing and physical support and in-flow of people moving in (conservation!)" — they quickly grow, converge into a hamlet, or "quickly die and be destroyed forever"; and THE RELIC-RUIN SCARCITY LAW: "cities or higher that have declined to the point where they are a thorpe and perished are the only things eligible to become relic ruins."
### Companions: DESIGN_RESOURCE_DYNAMICS (the resource-strike birth trigger), DESIGN_UPSWING (boom seeding pressure; bust/exodus decline pressure). PLACEMENT: builds LAST in the engine lane — after W-DISCOVERY, before W-COMPOSER-2 (its verbs join the single manifest lift) — so the soak's century probes certify full birth/death arcs.

## 0. THE ARCHITECTURAL KEY (why this needs NO version-axis event)
The frozen spatial digest is GEOMETRY, and geometry survives death. Two lanes, both V1-safe:
- **THE SATELLITE LANE** (new entities): satellite thorps are NOT digest members — they orbit a
  PARENT (position = within the parent's territory, cosmetic map placement around its marker;
  routing = via-parent + a fixed local hop; economy = tributary of the parent's). They live in
  a `spatialLedgers.satellites` conditional ledger keyed by parent (drop-when-empty, dormant ⇒
  absent ⇒ prior bytes) — in aspatial worlds the orbit is abstract and everything still works.
- **THE FIRST-CLASS LANE** (existing members): a canonize-time settlement that terminally dies
  KEEPS its digest cell — death is a STATE, not a deletion. The entity becomes a remnant
  (relic ruin or abandoned site) at the same coordinates: movers skip it, roads still pass its
  stones, the map still draws it (as ruins). No membership change, no re-canonize, ever.
The ONE version-axis seam stays deferred (V2, its own commission): satellite GRADUATION past
village-in-orbit to first-class digest membership. V1 caps satellites in orbit.

## 1. BIRTH (the satellite lane)
**SEEDING (owner: town or higher; JUDGMENT — threshold town+, vetoable):** each tick, a town+
parent may seed a satellite thorp, §H-loaded on: sustained growth/boom (the W-UPSWING boom
condition + prosperity band + population pressure), a RESOURCE STRIKE (the W-DISCOVERY
`resource_strike` condition — the mining-camp birth, historically exact), and refugee/migration
pressure (an inflow the parent cannot absorb — the absorption cap's overflow becomes the
frontier). E0-classed RARE (accumulator + cooldown per parent; realm cap by parent tier: town
1–2, city 2–4, metropolis up to 6; deferral-visible when capped). CONSERVATION AT BIRTH: the
founding families DEBIT the parent's population through the migration ledger (Σ conserved) —
never minted from nothing. A satellite may carry a resource assignment drawn from the SAME
terrain-legal latent pool as W-DISCOVERY (the steading exists BECAUSE of the vein) — provenance
typed: `growth | resource_strike | resettlement | forced`.
**PRECARITY (the owner's physics):** a thorp record carries {population (small), backing
(parent prosperity + route health read), inflow (migration tally), dwell}. Each tick it either
GROWS (backing + inflow adequate → population rises; thresholds promote in-orbit thorp →
hamlet → village, the popToTier idiom), STARVES (backing or inflow fails → decline dwell
accrues → the death draw arms — quickly die, per the owner), or CONVERGES.
**CONVERGENCE (owner):** satellites of the SAME parent in close orbit-proximity merge into one
hamlet-satellite — populations SUM (conservation), histories concatenate, the receipt names
both steadings ("Millbrook and the Weir folded into one palisade"). A second, distinct
hamlet-birth path: coalescence of a frontier, not promotion of a steading.
**SATELLITE DEATH:** a dead thorp leaves AT MOST a minor trace — an abandoned-steading note in
the parent's history (never a relic ruin; it never earned one — the scarcity law). Its last
residents flow back through the migration ledger.

## 2. DEATH (the first-class lane)
A first-class settlement that has DEMOTED down the existing ladder to thorp tier and then
dwelled in terminal decline (extended dwell — the resource-removal ruling's rhythm: never
sudden) may draw terminal death (§H-loaded on the decline's depth, E0-classed very rare;
authority-routed as a campaign-altering candidate — the DM sees it coming and can force or
veto). ON DEATH: the last residents DISPERSE through the migration ledger (conserved); NPCs
disperse with fates UNRESOLVED ("she left with the last wagons" — the never-resolve-fates
boundary holds at the grave's edge: the engine kills no named character, ever — pinned);
institutions clear; the entity's status becomes its remnant grade:
- **RELIC RUIN (the owner's scarcity law, verbatim):** eligible ONLY if the monotone `peakTier`
  stamp (new field, write-once-upward, stamped by the existing promotion path) ≥ city. A named,
  permanent world feature: map-drawn as ruins, chronicle-borne, superstition-attracting; its
  interior is the DM's (world-facing effects only — scavengers, bandit dens, pilgrim awe ride
  existing pressure/flavor reads).
- **ABANDONED SITE** (peakTier < city): a minor marker + history entry. Quieter, still real.
Sub-century honesty: the full city→thorp→death arc rarely completes inside 30 years — relic
ruins arrive mostly as GENERATION-SEEDED ancients (a small generation-time chance that a
world's history includes a fallen city, riding the existing history machinery — flavor + map
feature, no live state) and as the extraordinary earned event of long campaigns and soaks.
**RESETTLEMENT (the twin, commissioned with this design):** a remnant is a PRIVILEGED birth
site — a new thorp founded ON the old cell (first-class rebirth: the digest cell never left,
so no version event). §H-loaded by nearby prosperity + route utility + the remnant's resources;
the new settlement keeps the ladder from the bottom and the chronicle remembers ("New
Thornwall, raised on the old stones"). Relic-ruin resettlement carries extra texture (the
name half-returns; peakTier restarts — the ruin's glory is not inherited, it is aspired to).

## 3. MECHANICS + POSTURE
New lazy mover `settlementLifecycleKernel.js` at the standard pulse seam; gate: virtual
`settlementLifecycleEnabled` (absent from DEFAULT_SIMULATION_RULES; dormant ⇒ no satellites
key, no peakTier writes, no death draws, byte-identical). Satellites are SUB-SETTLEMENT
entities: they do NOT join the pulse's per-settlement mover loops (the settlement-cap study's
N is untouched); their tick is the lightweight lifecycle pass only; their economy contributes
to the PARENT (a bounded tributary term on the parent's reads — prosperity/food/defense
never more than a small modifier, receipted). Satellite records: no named NPCs until hamlet
(names begin where community begins — cost + the fates boundary). First-class death/rebirth
ride the candidate/authority lane (campaign-altering candidateType, CHANGE_AUTHORITY_POLICY
entries, proposal-mode under majors-require-proposal). peakTier: one new monotone field
stamped at promotion — additive, absent-tolerated (backfill = current tier at first read;
veterans are never newborns). Counterparts (registrable shapes, lifted at W-COMPOSER-2):
FORCE_FOUND_STEADING (parent + optional resource + name freetext), FORCE_ABANDON (the
terminal-death verb, dwell-bypassing, DM-authority), FORCE_RESETTLE (site + name). Display:
satellites as small orbit markers on the realm map + a "steadings" dossier section on the
parent; remnants as map features (all lazy).

## 4. PINS
Dormancy byte-identity (flag absent ⇒ zero keys incl. peakTier, prior bytes; fenced golden
pre-captured). Conservation at every edge (birth debits parent; convergence sums; death
disperses through the ledger; Σ population conserved realm-wide across any lifecycle event).
THE SCARCITY PIN (peakTier < city NEVER mints a relic ruin; a satellite NEVER mints one).
THE FATES PIN (terminal death resolves zero named-NPC fates — dispersal prose only).
No-sudden-death (terminal death requires the dwell; the draw never fires from a healthy or
briefly-declined state). Geometry-persistence (death/rebirth never touch the digest — the
digest golden byte-stable across a full die-and-resettle cycle). Cap + cadence (satellite
counts bounded by parent tier; E0 rarity; deferral-visible). Tributary boundedness (a
parent's satellite modifier is capped and receipted). Convergence proximity is deterministic
(codepoint-ordered pair scan, seeded draw). Force≡organic (the three verbs resolve through
the same kernel paths). Aspatial parity (the whole lifecycle runs without a digest).
Catch-up integrity (dwell counters survive the M10b one-interval collapse). Undo round-trip
(seed → undo → prior bytes).

## 5. PLACEMENT (the owner's "where appropriate")
W-LIFECYCLE builds LAST IN THE ENGINE LANE: after W-DISCOVERY (it consumes resource_strike
births and the latent pool), after W-UPSWING (boom seeding / bust decline pressure), before
W-COMPOSER-2 (one manifest lift carries every parked verb including these three). This
placement puts the full birth/death system INSIDE the soak's certification scope — the
century probes are precisely the bench that exercises complete arcs (seed → grow → converge
→ decline → die → ruin → resettle), which is where this system's tuning verdicts belong.
The V2 graduation seam (satellite → first-class digest member) stays parked for its own
owner commission, recorded here so nobody builds it by momentum.
