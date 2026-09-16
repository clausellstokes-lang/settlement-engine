# 5.5-K Implementer Brief — THE KEYSTONE: the frozen spatial digest at entitled canonize

Opus 4.8 ultracode implementer, Phase 5.5 keystone wave, /Users/cstokes/Desktop/settlement-engine
(branch review-fixes-2026-07-08). You implement; the manager (Fable) reviews + commits. BINDING:
docs/PHASE55_SPATIAL_ENGINE_DESIGN.md PART II (§II.1-II.4 — the substrate reality + the keystone
move), PART V §V.1/V.2 (version axes + receipts + carrier profiles), PART VI §VI.2-2 + the §4j
sea-edge-set reservation, §4i SEASONS-B slot. DEPENDS ON: CL-0 committed (spatialCanonVersion
gating discipline), W0 committed (temporal audit green). This is the hardest wave in the program —
the manager expects STOP-AND-REPORTs; a wrong digest is worse than a late one.

## THE SCOPE RULING (manager, binding — freeze the schema, not the ocean)
This wave ships the LAND cost field + the DIGEST SCHEMA with RESERVED SLOTS. It does NOT ship sea
lanes, air/teleport edges, seasonal overlays, or any consumer of routes. The digest is inert
canon data this wave — consumers arrive in the modulation wave. Resist all scope creep.

## Items

1. **The spatial-canon marker + entitled canonize.** A NEW `worldState.spatialCanonVersion` marker
   stamped ONLY by an explicit spatial opt-in at the canonize seam (canonizeCampaignWorld,
   campaignWorldPulseSlice — beside where extractRegionalGraphSnapshot runs), behind an entitlement
   read AT THE STORE CALL SITE (the settlementSlice tier-split pattern; the domain stays
   tier-blind). The EXISTING canonizedAt is NEVER the trigger (PART II: it would retro-light the
   installed base). Old saves have no marker ⇒ byte-identical forever. v1 offers the opt-in ONLY
   for GENERATED maps (II.5-3: imported/customBackdrop maps stay aspatial).

2. **One-shot extraction → the frozen integer digest.** At entitled canonize, run the extraction
   ONCE and persist the result as immutable canon data under the marker:
   - PORT the cost function + routing OUT of the iframe: lift landCost/seaCost + the A* from
     public/map/sf-bridge.js (:655-764) into a pure domain module. The extraction MAY use the
     iframe ONCE to obtain pack.cells (the II.5-4 one-shot ruling) — but everything DERIVED from
     it is computed in the pure module and QUANTIZED TO INTEGERS before persistence.
   - Run ONE multi-source Dijkstra over the cost field seeded from ALL placed settlements
     (PART II §II.4 — NOT all-pairs A*): yields per-cell nearest settlement (TERRITORY), the
     GATES (route cell-sequences crossing a territory), NEIGHBOUR TIERS, and the base DISTANCE
     MATRIX in one pass. Explicit deterministic tie-breaks: equal cost ⇒ lower cell index; equal
     tentative ⇒ lower predecessor index (II.3-1).
   - The digest object: { spatialGeometryVersion, costLawVersion, overlayVersion, costField
     (quantized, compact), territory, gates, tiers, distanceMatrix, routeReceipts, reserved:
     { seaLanes: null, airField: null, teleportEdges: null, seasonalOverlay: null } } — the FOUR
     RESERVED SLOTS are schema-present and null (the §4j/round-7/§4i reservations; materialized
     by their own waves). NOTE the rename: spatialGeometryVersion, NOT geometryVersion (PART VI —
     name-collision with a live runtime store field).
   - ROUTE RECEIPTS (§V.1): each stored route carries WHY — segment list + cost breakdown by
     terrain class. Compact but complete; this is the determinism audit trail and the DM's
     "why this road?" answer.
3. **Persistence discipline.** The digest lives under a NEW conditionally-materialized worldState
   key (the strip/clone/spread procedure — CL-0 just did this for rulesetLog; deepCloneConditionalLedger
   is OBJECT-ONLY, shape accordingly). Absent ⇒ byte-invisible. Do NOT bump mapState's schema
   (PART III — it would rewrite every stored map on load). Size-check the digest (report bytes for
   a 5/15/30-settlement map); if a 30-settlement digest exceeds ~200KB, STOP-AND-REPORT with the
   quantization/compaction options rather than shipping a save-bloater.

4. **Re-derivation events.** The digest re-derives ONLY on discrete canon events: spatial
   re-canonize (a new placement/forced-road after opt-in ⇒ an explicit re-canonize action, receipted
   via the CL-0 ruleset/receipt machinery). NEVER on load, NEVER per tick. In-flight anything
   (none exist yet this wave) is out of scope.

5. **The invariant suite (§V.5 — front-heavy by design, budget accordingly).** This wave's tests
   ARE the deliverable as much as the code:
   - same map + same placements ⇒ byte-identical digest across two extractions (the one-shot iframe
     read must be capture-then-derive; if raw pack.cells capture is itself nondeterministic across
     reloads, STOP-AND-REPORT with evidence — this is the II.1 risk and we freeze the FIRST capture
     as canon rather than pretend).
   - adding an unrelated settlement ⇒ existing territory/routes unchanged outside its Voronoi
     neighbourhood (property test).
   - stable tie-breaks (construct an equal-cost fixture; assert the deterministic choice).
   - dormant ⇒ byte-identical (no marker ⇒ zero new fields; the golden corpus + a dormancy-oracle
     test on a canonized-but-not-opted-in campaign).
   - old-save identity fallback (a pre-CL-0 fixture loads and advances byte-identically).
   - version axes: bumping costLawVersion in a fixture does NOT change an existing digest (frozen);
     only re-canonize re-derives.
   - a digest GOLDEN: one committed fixture map ⇒ sha256-pinned digest.

## Fence + gates
NEW: src/domain/spatial/** (the pure module + digest builder). TOUCH: campaignWorldPulseSlice
(the entitled canonize call site), worldState.js (3-line ledger add), the opt-in UI point on the
realm surface (smallest possible — a canonize-dialog option behind the entitlement; coordinate
with CL-0's committed dialog if it landed a spatial-axis card), tests + fixtures. READ-ONLY:
public/map/sf-bridge.js (you lift FROM it; do not modify the iframe). NO git add/commit/stash.
Gates: full battery; goldens byte-identical (dormant path constitutional); verify:dist budget
1,441,000 — the spatial module must NOT enter first paint (it loads at canonize action time;
verify the import graph); the invariant suite above green. Report: extraction determinism
findings (the II.1 question answered with evidence), digest sizes, the invariant results, every
gate, and everything STOP-AND-REPORTED.
