---
name: w-discovery-resource-dynamics-shipped
description: W-DISCOVERY (organic resource discovery + removal) SHIPPED 2026-07-15 on branch claude/w-discovery (3 commits off afc71a74) — FULL SUITE GREEN (858 files / 9609 tests), ZERO eager bytes (budget 1,122,663 untouched). Key hazards inside — the zero-headroom budget wall killed the condition-template path (templates ALSO break the faction-response 1:1 pin), and new src/domain files must be 0 any-holes + kernel-slugify.
metadata:
  node_type: memory
  type: project
  originSessionId: 049d4c82-58c0-4be1-956a-d47c628ee704
---

## W-DISCOVERY — RESOURCE DYNAMICS SHIPPED (2026-07-15, branch claude/w-discovery)

Three commits off review-fixes-2026-07-08 @ afc71a74 (NOT merged/pushed): 847f4f54 (Stage 1 mover),
9803baa7 (Stage 2 writer + seams), d68faa05 (Stage 3 lifecycle pins + ratchet conformance).
FULL SUITE 858/858 files, 9609 pass / 1 skip / 0 fail; build + VERIFY_DIST 115/115 at budget
1,122,663 — **EXACT eager delta: 0 bytes**. Binding spec docs/DESIGN_RESOURCE_DYNAMICS.md.

### What shipped
- NEW lazy leaf `src/domain/worldPulse/resourceDynamicsKernel.js`: `evaluateResourceDynamics`
  (candidate-lane mover, wired in pulseKernel after evaluateTierResourceDynamics), the ONE writer
  `applyResourceMembershipOutcomeToSettlement` (wired in applyWorldPulse on `outcome.resourceMembership`),
  and `reconcileProductionAfterResourceChange` (both-direction computeActiveChains before/after delta,
  surgically merged into economicState.activeChains + primaryExports).
- DISCOVERY: latent pool = getCompatibleResources(route, config.terrainType).filter(compatible) minus
  roster minus resourceEdits.removed; prospecting integrator (floor 0.7, cooldown 52, years-scale) +
  keyed fork `resource_discovery:<cid>:<tick>`. REMOVAL: recoveryMode==='manual' (resourceTaxonomy)
  AND dwell ≥ 156 ticks via integer arithmetic `tick − depletedSince[key]` (M10b catch-up-collapse-proof);
  state nests in settlementTickStates[cid].resourceDynamics (byte-neutral when empty).
- Durability: resourceEdits delta dual-written config+_config, `{key, custom:false}` — organic ≡ DM ADD;
  survives full regeneration (pinned). Conditions `resource_strike` (positive MARKER, affectedSystems [])
  / `vein_exhausted` (drains economic_capacity) planted FULLY SPECIFIED with bounded expiresAtTicks:10.
- W-UPSWING B2 seam CONSUMED: upswingKernel `resourceRemoved()` (vein_exhausted) now feeds the bust flip
  (cause 'resource_removal'); `resourceStruck()` joins boom receipt sources (`sources.discovery`).
- Gate: virtual `resourceDynamicsEnabled` (ABSENT from DEFAULT_SIMULATION_RULES); dark ⇒ mover returns
  the SAME worldState reference. Dormancy golden tests/property/resourceDynamicsDormancyGolden.test.js
  (captured post-wire as a forward fence; the pre-wire byte-identity proof = the ENTIRE pre-existing
  golden battery holding green unchanged).

### ⚠️ HAZARDS a future wave will hit
1. **The budget wall is ZERO-headroom** (afc71a74 ratcheted to exactly the closure): +2 condition catalog
   templates in activeConditions.js cost +330 B eager ⇒ RED. AND templates trip a SECOND wall: the
   factionRelationshipUpdate.js closed-set 1:1 pin requires every CONDITION_ARCHETYPE_TEMPLATES entry to
   route a faction response (MORE eager bytes). Solution shipped: plant conditions fully-specified at the
   lazy writer (explicit bounded duration + affectedSystems) — closes the :714 immortal hazard with zero
   eager cost. Precedent for any future condition-minting wave.
2. **New src/domain files must be 0 any-holes** (domainAnyCastBaseline: "new files get 0", frozen ceiling)
   and **must use kernel/slugify.js** (slugifyIdiomBaseline blocks any inlined `[^a-z0-9]+ → [-_]` idiom).
   Every recent mover (upswing, corruptionWeb, infoStatecraft) is 0-holes; only grandfathered files carry debt.
3. **activeConditions.js / causalState.js / archetypeCatalog.js are aiGroundingBundle inputs** — ANY byte
   change (even a comment) reds aiGroundingBundle.freshness until `npm run build:edge-shared` re-commits
   the bundle. Keep doc comments out of those files unless regenerating the bundle.
4. Pre-existing taxonomy quirks (NOT fixed, out of scope): classifyResource('grain_fields') → magical
   (substring 'barley'→'ley'), 'coal_deposits' → renewable. Removal keys on recoveryMode so behavior is
   taxonomy-consistent; a taxonomy-regex wave would change which keys are organically removable.

### JUDGMENTs (vetoable, recorded in commit messages)
- Latent pool = getCompatibleResources set, NOT TERRAIN_DATA.allowedResources ∩ (allowedResources is a
  display-token vocabulary that does not map to RESOURCE_DATA keys — intersecting is degenerate).
- resource_strike carries NO direct economic_capacity lift (marker; upside flows through boom + reconcile).
- Removed keys never re-mint (a worked-out vein does not return).
- Drama-class: resource_discovery/removal flow UNREGISTERED like resource_depletion/recovery (walker only
  enforces STRESSOR_CATALOG coverage); the "E0-classed RARE" cadence is the accumulator+floor+cooldown idiom.

### Deferrals
- E0/preset lighting for `resourceDynamicsEnabled` — OWNER-GATED standing (design §5). Lit fixtures need
  `simulationRules: { resourceDynamicsEnabled: true }`.
- No new DM verbs (design order): ADD/REMOVE/DEPLETE/RECOVER already exist; force ≡ organic parity pinned.
