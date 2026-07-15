# DESIGN — W-DISCOVERY: RESOURCE DYNAMICS (the ground gives, and the ground gives out)
## Fable 5 architecture, 2026-07-15 — owner-commissioned ("one of my intents to change things dynamically, so design and build!" + "the complete removal of resources as well" + the lifecycle rulings, verbatim: "removal should happen after extended periods of depleted state of a nonrenewable resource"; "discovery has to organically be tied to the terrain or forced"). Grounded by the three-slice endowment census (2026-07-15): by-symbol (4 storage strata, full reader census), by-concept (the regex taxonomies + derived-cache map), precedents (overlay/founding/undo lifecycles).
### Companion: DESIGN_UPSWING.md (discovery is a boom SOURCE; removal is a bust source on B2's severance seam). Builds after W-UPSWING's stages land (shared seams), branch W-DISCOVERY.

## 0. THE CENSUS VERDICT THAT RESHAPES THE WAVE
Endowment does NOT live in the frozen spatial digest (it carries pure geometry). It lives in
`settlement.config.nearbyResources*` — and it is ALREADY half-dynamic:
- DEPLETION STATE IS LIVE: `tierResourceDynamics` mints `resource_depletion`/`resource_recovery`
  candidates (authority-routed, `rules.resourceDriftEnabled`-gated) and
  `applyResourceOutcomeToSettlement` writes state + a capped `resourceHistory`.
- THE RENEWABLE AXIS EXISTS: `resourceTaxonomy.js` RENEWABLE/NONRENEWABLE/MAGICAL patterns are
  already the engine's recovery model — the owner's ruling names a distinction the code drew.
- THE FORCE PATH EXISTS: ADD/REMOVE/DEPLETE/RECOVER resource DM verbs live in mutateWorld,
  recorded in the regen-surviving `config.resourceEdits` overlay (re-applied rng-free inside
  resolveResources) and routed through the rerun-keys partial regeneration
  (['resources','activeChains','foodSecurity','economicState','narrative']). THE COUNTERPART
  CRITERION IS ALREADY SATISFIED — the wave adds NO new verbs, only receipt parity.
- THE MINE FOUNDS ITSELF: institutionLifecycle's gap detector (extraction/downstream families)
  already reads the LIVE roster — a discovered key feeding a chain with no works fires "Local
  resources could support X" → an institution_build candidate. On the shelf, zero new code.
THE ACTUAL GAP, precisely: roster MEMBERSHIP only changes by DM hand. No organic discovery, no
organic removal, and a tick-side membership write is INVISIBLE to the generation-stamped
economy (economicState.activeChains/primaryExports — production rates follow the stamped list)
without the surgical reconcile calamityKernel proved possible (reconcileProductionAfterStrike).

## 1. THE ORGANIC MOVER (new lazy worldPulse leaf `resourceDynamicsKernel.js`)
Rides the EXISTING candidate lane (tierResourceDynamics' shape): candidates, authority-routed,
volatility/E0-governed, applied through the outcome writer. Gate: NEW virtual flag
`resourceDynamicsEnabled` (absent from DEFAULT_SIMULATION_RULES; dormant ⇒ zero candidates,
zero new keys, byte-identical — existing lit goldens untouched because the flag is new).
NOT spatial-only: terrain is `config.terrainType` (generation-side, always present) — resource
dynamics runs in aspatial worlds too (JUDGMENT, vetoable: this is settlement economics, not
geometry; no spatialLedgers ledger is minted — accumulator/dwell state nests in
`settlementTickStates[cid].resourceDynamics`, the moral-founding-accumulator precedent,
byte-neutral when empty).

**DISCOVERY (`resource_discovery` candidate):** THE LATENT POOL = terrain-legal-but-unrolled:
(TERRAIN_DATA[config.terrainType].allowedResources ∩ terrain-compatible RESOURCE_DATA keys)
MINUS current roster MINUS previously-removed keys (a worked-out vein does not return —
JUDGMENT, vetoable). Draws only known RESOURCE_DATA keys (resolveNearbyCommodities silently
drops unknown keys — census hazard; custom kinds stay the DM's mint). "Organically tied to the
terrain" is therefore STRUCTURAL: a discovery is always one generation COULD have rolled there;
a geography-inconsistent draw is impossible, not rare. §H loading on the fork
`resource_discovery:<id>:<tick>`: prospecting pressure (economic/food pressure — need drives
prospecting), boom/investment presence (the W-UPSWING coupling), extraction-institution
presence; E0-classed RARE (accumulator + floor + cooldown, the founding-catalog cadence idiom;
a few per campaign-decade, cap-held, deferral-visible).

**REMOVAL (`resource_removal` candidate) — the owner's lifecycle verbatim:** fires ONLY for a
NONRENEWABLE (resourceTaxonomy) resource that has DWELLED depleted ≥ REMOVAL_DWELL ticks (the
"extended period"; dwell counted from the depletion stamp in resourceHistory / the tick-state
counter). Renewables NEVER organically remove — depleted renewables ride the existing
`resource_recovery` path when pressure eases. Removal is §H-loaded (longer dwell ⇒ heavier
weight), authority-routed, and receipted ("the old workings gave out — the vein is done").
Calamity/DM force may still strip any resource (the bucket's strip coupling + the existing
REMOVE verb).

## 2. THE APPLICATION WRITE (one writer, every lifecycle path)
Both candidate kinds apply through ONE extended outcome writer that does, atomically:
(a) membership: append/remove `config.nearbyResources` (+ state-map/depleted-list hygiene);
(b) durability: record the `config.resourceEdits` delta (added[]/removed[]) — the census-proven
regen-surviving channel, so an organic discovery survives full regeneration exactly as a DM
ADD does (dual-write config AND _config per the mutateWorld precedent);
(c) THE SURGICAL RECONCILE: `reconcileProductionAfterResourceChange` — the calamityKernel
precedent (reconcileProductionAfterStrike) run in BOTH directions: recompute the affected
chains via computeActiveChains over the live roster and surgically merge
economicState.activeChains + primaryExports (+ DEPLETED_IMPORT_MAP hygiene), so the physical
goods flow (commodityFlow production rates read the stamp) sees the change NEXT TICK — no
mid-campaign full regen, no stale economy;
(d) legibility: resourceHistory append + a news entry through the candidate's
headline/summary/reasons (the feed path — never the discarded-receipt direct-write path);
(e) the CONDITION: discovery plants a bounded positive `resource_strike` activeCondition and
removal its negative twin (`vein_exhausted`) — because economic_capacity (the causal score
every strategic consumer reads) moves ONLY through conditions (census: the frozen-prosperity
carve-out); this is also the typed seam W-UPSWING's B2 consumes (discovery → boom source;
removal → bust flip naming the dead vein).
UNDO/RESUME: inherit the lane's semantics — all writes ride the candidate-outcome path inside
the pulse result exactly as existing resource_depletion outcomes do; the implementer VERIFIES
the undo round-trip for a discovery outcome (pin), and keeps the mover pure (worldState, tick,
forked rng) so the paused-resume re-run re-derives byte-identically.

## 3. WHAT STAYS STALE, SAID OUT LOUD (deferrals-by-design)
- `settlement.resourceAnalysis` (the dossier's exploitation/exports/gaps narrative) and the
  PDF economics blocks are generation-stamped; they refresh on the user's next regeneration,
  not per tick. The LIVE chips (ResourcesTab reads config directly) show the discovery
  immediately with its ABUNDANT/DEPLETED badge — accepted V1 split (JUDGMENT: a mid-campaign
  auto-regen of narrative strata is a bigger, riskier machine than this wave warrants).
- `structuralFingerprint` treats roster fields as structure; the implementer confirms a
  dynamics-written roster doesn't false-flag regen diffs (test, not redesign).
- The regex taxonomies (resourceTaxonomy, WAR_SUPPLY, extraction gates) classify discovered
  keys automatically because V1 draws known catalog keys — no registry work. If custom-kind
  organic discovery is ever commissioned, those regexes are the named sweep surface.

## 4. PINS (the build's proof set)
Dormancy byte-identity (flag absent ⇒ no candidates, no tick-state key, prior bytes; fenced
golden pre-captured; aspatial + spatial both). Terrain legality (a minted key is ALWAYS in the
latent pool — property test over every terrain type; the impossible-draw pin). Nonrenewable-
only removal (a renewable at max dwell NEVER mints removal; a nonrenewable below REMOVAL_DWELL
never mints). Dwell arithmetic survives the M10b catch-up collapse (one orchestrated interval
== N sequential weeks for the counter — the census's integer-tick rule). Force ≡ organic
receipts (DM ADD and organic discovery leave the same downstream state shape: membership +
resourceEdits + reconcile + condition — differing only in provenance). Regen durability (an
organic discovery survives full regeneration via resourceEdits — the ghost-write class killed
at birth). The surgical reconcile (discovery ⇒ chain activates ⇒ production rates move next
tick; removal ⇒ chain deactivates + exports pruned — both directions, the calamity-precedent
mirror test). The mine founds itself (discovery + no works ⇒ the lifecycle gap detector emits
the build candidate within K ticks — integration test). Empty-roster tolerance (remove to
empty: resolveNearbyCommodities, foodGenerator, economy derivation, ResourcesTab all survive —
the owner-named zero-resource hazard). Undo round-trip (apply discovery → undo → prior bytes).
Conservation of the pool (Σ discoveries ≤ latent pool size; removed keys never re-mint).
Condition boundedness (resource_strike/vein_exhausted bounded, capped duration, no snowball).

## 5. SEQUENCING
Builds AFTER W-UPSWING lands (B2's bust seam + the source taxonomy must exist to consume the
conditions; both waves touch the candidate lane — sequential merges, no parallel worktree
overlap on tierResourceDynamics). One wave, branch claude/w-discovery. E0/preset lighting for
`resourceDynamicsEnabled` is OWNER-GATED standing. The overlay-chokepoint pattern documented
at commission (for future dynamic roads/ports) is NOT needed here and stays parked for its
own commission — recorded so nobody builds it by momentum.
