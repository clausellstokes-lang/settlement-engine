/**
 * domain/townMap/fabric/stageManifest.js — ⭐⭐⭐ MF-D1 · §287.8 / SPEC §10.14 ·
 * **THE EXECUTABLE S0–S23 STAGE MANIFEST.**
 *
 * ODQ §287.8 orders it in one sentence: *"an executable S0–S23 manifest owns stage inputs/
 * outputs/imports/random namespaces/ABI/law/censuses/invalidation and CI refuses prose/source
 * drift."* SPEC §10.14 puts the reason plainly: **architecture stops being prose at this seam.**
 *
 * ⛔⛔ WHY A PROSE TABLE WAS NOT ENOUGH, MEASURED RATHER THAN ASSERTED. SPEC §1.0's stage map is
 * a human table, and §10.16's own status override already says such tables *"are the snapshot at
 * the time that table was written; they are not silently refreshed evidence."* Meanwhile the
 * assembly's real internal ordering is **twenty-six** banners spelled `STAGE 0 · 0b · 1 · 1b ·
 * 3b · 3b3 · 3b2 · 3c · 4 · 4b · 5 · 5a · 3d · 6 · 6a…` — a sequence that runs 5 before 3d and
 * 3e after 7b, because stages MOVED and their banners kept their old numbers. Neither the public
 * ids nor the banners are the dependency structure. **The dependency structure is the module
 * import graph, and this manifest is pinned to it.**
 *
 * ⭐⭐⭐ THE ONE DECLARED DATUM IS THE ASSIGNMENT. Everything else in every node below —
 * `allowedImports`, `randomNamespaces`, `statefulForkSites`, the cross-node edge set and the
 * topological order — is DERIVED FROM SOURCE by `tests/lint/stageManifest.walker.test.js`, which
 * re-parses the whole fabric directory and refuses any disagreement. A module added to the
 * directory and not assigned REDS. An import the manifest does not list REDS. A random namespace
 * spelled in source and not registered REDS, and one registered and no longer spelled REDS too.
 * This is the §10.14 sentence *"Existing prose tables remain human-readable projections of the
 * manifest; two competing authorities are forbidden"* made executable in the direction that can
 * actually be enforced today: the manifest is checked against the source, never trusted beside it.
 *
 * ⚠ WHAT THIS IS NOT, STATED SO NOBODY READS A FOUNDATION AS A CUTOVER. `GenerationManifest`'s
 * full §10.14 shape — typed gate expressions, observation-acceptance policies, output authority
 * contracts, `ArtifactHashRef` closures — needs artifact families (`UnitRegistry`,
 * `ProvenanceRef`, `EvidenceScope`) that do not exist in the plan era. Those fields are named
 * ABSENT below rather than stubbed, because a gate expression carrying `ALWAYS_ACTIVE` because
 * nobody built the registry is a worse lie than a missing field. **Nothing in the generation path
 * imports this module. It moves zero bytes and is read-side machinery by construction.**
 *
 * PURITY: pure data plus pure helpers. No Date, no Math.random, no I/O.
 */

import { COORDINATE_ABI_VERSION } from './coordinateAbi.js';

/** The closed public stage union (SPEC §10.14's `StageId`). Immutable — §10.3: *"The public
 *  S0–S23 ids remain immutable. Their internal ownership is corrected."* */
export const STAGE_IDS = Object.freeze(['S0', 'S1', 'S2', 'S3', 'S4', 'S5', 'S6', 'S7', 'S8',
  'S9', 'S10', 'S11', 'S12', 'S13', 'S14', 'S15', 'S16', 'S17', 'S18', 'S19', 'S20', 'S21',
  'S22', 'S23']);

/**
 * ⭐ THE TWO NON-STAGE NODES, DECLARED RATHER THAN SMUGGLED INTO A STAGE.
 *   `PRIMITIVES` — geometry/claim/ABI libraries every stage may import and which own no stage
 *                  output. Folding them into a stage would invent a false dependency edge from
 *                  every consumer to that stage.
 *   `ASSEMBLY`   — `buildFabric.js`, the straight-line composer. It is not a stage; it is the
 *                  ORDER, and §234.2's SCC ratchet already governs it.
 */
export const NON_STAGE_NODES = Object.freeze(['PRIMITIVES', 'FOUNDATIONS', 'ASSEMBLY']);

/**
 * ⭐⭐⭐ `FOUNDATIONS` — MF-D1's OWN ARTIFACTS, AND THE NODE THAT MAKES "MOVES ZERO BYTES" A
 * GRAPH FACT RATHER THAN A PROMISE.
 *
 * The coordinate ABI, this manifest, exact solid legality, the spatial-receipt seam and the DCEL
 * are read-side machinery. §10.15(4) is explicit — *"keep consumers on the legacy accessor until
 * every equivalence gate passes"* — so the wave's whole safety argument is that no stage imports
 * them. Written down, that is a promise. Given its own node it is an EDGE SET: **`FOUNDATIONS`
 * has inbound edges and NO OUTBOUND EDGE**, and the walker refuses the first one that appears.
 * A lane that wires a foundation into the generation path reds before it can move a byte.
 */
export const FOUNDATION_NODE = 'FOUNDATIONS';

/**
 * ⛔⛔ THE STAGES WITH NO MODULE AT ALL — the holes, published as data so a reader cannot mistake
 * silence for coverage. SPEC §1.0 grades S1 NOT BUILT, S8 PARTIAL (§239.1 unbuilt), S9 NOT BUILT
 * (*"the #1 ranked gap in both studies"*) and S12 PARTIAL.
 *
 * ⭐⭐⭐ ⟦SPINE-1 · §670⟧ **S8 HAS LEFT THIS ROSTER.** DESIGN_SPINE's partition is §239.1's hole
 * built: planar faces DERIVED rather than cut, with the half-edge topology SPEC §10.15 names as
 * their objectively stronger owner. **S1, S9 and S12 own no module in this tree**, and the manifest
 * says so in the field rather than by omitting a row. Frontage (S9)
 * is exactly what §287.8 says D1 may NOT prove — *"D1 proves face/adjacency/point-location only;
 * frontage/parcel equivalence waits for fresh W3"* — so its absence here is the ordered state.
 */
export const UNBUILT_STAGES = Object.freeze(['S1', 'S9', 'S12']);

/**
 * ⚠⚠ THE TWO EDGES WHERE THE PUBLIC ORDER AND THE REAL DEPENDENCY ORDER DISAGREE, ENUMERATED AND
 * REASONED. A module belonging to a LATER public stage is imported by an EARLIER one at exactly
 * two places in the whole fabric. Both are real and neither is a cycle (the import graph is
 * acyclic — §234.2's own arm proves it); they are places where the public numbering is a
 * NARRATIVE order and the derivation is not. A THIRD inversion REDS: an undeclared downstream
 * read is precisely what §10.14 orders the validator to refuse.
 */
export const PUBLIC_ORDER_INVERSIONS = Object.freeze([
  { edge: 'S6>S2', importer: 'relief.js', imported: 'umbrella.js',
    reason: 'the relief pass reads the settlement EXTENT to size its own field; extent is a '
      + 'roster fact (population and tier), not a district fact, so the read is of a scalar the '
      + 'umbrella happens to own rather than of S6 geometry. ⚠ ⟦§297.2b⟧ `cliffs.js` RIDES THIS '
      + 'SAME EDGE and is named here so the second importer is not a silent one: it takes '
      + '`traceMask` — a pure raster-boundary chainer that touches no district and no organism, '
      + 'and which lives in umbrella.js only because the umbrella was the first thing to need it. '
      + 'The EDGE SET is unchanged, so this is not a third inversion; a second importer of one '
      + 'declared backward edge is what it is' },
  { edge: 'S13>S6', importer: 'districtPartition.js', imported: 'wallCircuit.js',
    reason: 'the partition asks the circuit for its rings so a quarter boundary can stop at the '
      + 'curtain; §200 MOVED the circuit AHEAD of the ground law in the assembly, so at run time '
      + 'the circuit genuinely precedes this read — the public numbering is what is stale' },
]);

/**
 * ⭐⭐ THE NODE TABLE. `modules` is the DECLARED datum; every other field is DERIVED and the
 * walker re-derives it from source on every run.
 *
 * `randomNamespaces` is §287.8's per-stage RANDOM NAMESPACE REGISTRY. `*` stands for an
 * interpolated expression, so `'*|valley|bearing'` is the shape `` `${x}|valley|bearing` ``. The
 * registry is over the KEY SPELLINGS a stage mints, which is the surface a collision would
 * appear on — two stages minting one spelling is how two mechanics come to share a draw.
 *
 * `statefulForkSites` counts `fabricRng(...)` calls — the ONLY stateful streams in the fabric.
 * Everything else is `hashUnit`/`hash32`/`hashInt`/`keyedRandom`, which are pure string hashes
 * with no stream at all. This count is the subject of the §293.3c stream-derivation audit.
 */
export const GENERATION_NODES = Object.freeze([
  { nodeId: 'PRIMITIVES', modules: ['fabricGeometry.js', 'reservedGround.js', 'trigTable.js'],
    allowedImports: [],
    randomNamespaces: [],
    statefulForkSites: 0 },
  // ⚠ ⟦MF-W3F⟧ `streetWebVersions.js` JOINS THIS NODE AND NOT S17. It is SW-1b's declaration —
  //   read only by `tests/lint/streetWebVersion.walker.test.js`, imported by no stage — so it is
  //   read-side machinery by exactly the test this node exists to enforce, and arm 10 keeps it
  //   outbound-edge-free. Assigning it to the street stage would give FOUNDATIONS' sibling a
  //   module the generation path could start importing without anything reding.
  { nodeId: 'FOUNDATIONS', modules: ['coordinateAbi.js', 'fabricDcel.js', 'solidLegality.js', 'spatialReceipt.js', 'stageManifest.js', 'streetWebVersions.js'],
    allowedImports: ['fabricGeometry.js', 'fabricRng.js'],
    randomNamespaces: ['f0:*', 'f1:*', 'f2:*', 'f3:*'],
    statefulForkSites: 0 },
  // ⚠ ⟦REG-GROW-A⟧ `growthAnnotation.js` AND `growthLedger.js` JOIN **S0**, AND THE ASSIGNMENT IS
  //   THE ARGUMENT. The growth kernel is a PRE-STAGE producing PURE DATA (DESIGN_REG_GROW A1.1):
  //   roster and record math with no geometry, which is exactly S0's character — it sits beside
  //   `compile.js` (the spatial record), `snapshot.js` (the year projection it supersedes) and
  //   `tierGrammar.js` (the sizer it hands a frame's population to).
  //   ⭐ AND THE ASSIGNMENT COSTS NO EDGE. Both import S0 members only, so every import is
  //   INTRA-node: `allowedImports` is unchanged and `NODE_EDGES` gains nothing.
  //   ⛔⛔ THE ONE IMPORT THIS NODE MAY NOT TAKE, RECORDED SO A LATER LANE DOES NOT TRY IT:
  //   `epochAxis.js` (S5). `growthLedger` needs the circuit thresholds and `OUTGROWN_SHARE`, and
  //   importing them would create an **S5>S0 backward edge — a THIRD public-order inversion**,
  //   which `PUBLIC_ORDER_INVERSIONS` refuses at the door. The values are therefore spelled
  //   locally (`WALLED_TIERS`, `OUTGROWN_SHARE_LOCAL`) and pinned equal by test, and the traffic
  //   runs the LAWFUL way instead: `deriveEpochs` becomes a READER of the ledger (A1.5), which is
  //   the already-declared forward edge `S0>S5`.
  //   ⚠ NEITHER MINTS A RANDOM NAMESPACE. The kernel is pure arithmetic over the record — no
  //   seeded draw anywhere — so this row's `randomNamespaces` and `statefulForkSites` are
  //   unchanged and honestly so.
  { nodeId: 'S0', modules: ['compile.js', 'fabricRng.js', 'growthAnnotation.js', 'growthLedger.js', 'lineage.js', 'morphology.js', 'snapshot.js', 'tierGrammar.js'],
    allowedImports: ['../../foundingKind.js'],
    randomNamespaces: ['*|g'],
    statefulForkSites: 0 },
  // ⚠ ⟦§297.2b · TE-REG-G1⟧ `cliffs.js` JOINS S2 AND NOT `FOUNDATIONS`, WHICH IS THE WHOLE SHAPE
  //   OF THE DISCHARGE. `fabricDcel.js` held `CLIFF_EDGE` empty because *"inventing one from a
  //   raster threshold would be a new derivation wearing a foundation's name"* — so the derivation
  //   lives HERE, beside the substrate field it reads and the refusal law it consumes, and the
  //   foundation reads the published line the way it already reads `fabric.water.line`.
  //   ⚠ IT MINTS NO RANDOM NAMESPACE. The escarpment is de-staircased by corner-cutting alone
  //   (no seeded displacement — see `cliffs.js`'s no-wobble ruling), so this row's
  //   `randomNamespaces` and `statefulForkSites` are unchanged and honestly so.
  //   ⚠ ITS `umbrella.js` IMPORT RIDES THE **ALREADY-DECLARED** `S6>S2` INVERSION — the same
  //   backward edge `relief.js` carries, not a third one. See PUBLIC_ORDER_INVERSIONS.
  { nodeId: 'S2', modules: ['cliffs.js', 'groundRefusal.js', 'measure.js', 'relief.js', 'substrate.js', 'terraform.js'],
    allowedImports: ['fabricGeometry.js', 'fabricRng.js', 'trigTable.js', 'umbrella.js'],
    randomNamespaces: ['*|*', '*|ang', '*|a|*', '*|ca|*|*', '*|cr|*|*', '*|hr|*|*', '*|i0', '*|jx|*|*', '*|jy|*|*', '*|m*', '*|ph1', '*|ph2', '*|pri|*|*', '*|ramp|edge', '*|resource|*|site', '*|r|*', '*|valley|across', '*|valley|bearing'],
    statefulForkSites: 0 },
  { nodeId: 'S3', modules: ['suitability.js'],
    allowedImports: ['fabricRng.js', 'groundRefusal.js', 'substrate.js'],
    randomNamespaces: ['*|jx', '*|jy', 'nuclei'],
    statefulForkSites: 2 },
  { nodeId: 'S4', modules: ['waterMode.js'],
    allowedImports: ['fabricGeometry.js', 'fabricRng.js', 'relief.js', 'substrate.js'],
    randomNamespaces: ['jitter', 'water-mode'],
    statefulForkSites: 1 },
  { nodeId: 'S5', modules: ['epochAxis.js'],
    allowedImports: ['fabricGeometry.js', 'tierGrammar.js'],
    randomNamespaces: [],
    statefulForkSites: 0 },
  { nodeId: 'S6', modules: ['builtUmbrella.js', 'commons.js', 'districtPartition.js', 'organismFields.js', 'organisms.js', 'umbrella.js'],
    allowedImports: ['epochAxis.js', 'fabricGeometry.js', 'fabricRng.js', 'groundRefusal.js', 'lineage.js', 'reservedGround.js', 'substrate.js', 'suitability.js', 'wallCircuit.js', 'waterMode.js'],
    randomNamespaces: ['*|*', '*|common|slot|*', '*|dither', '*|grain|y*', '*|matrix', '*|r', '*|reach', 'commons'],
    statefulForkSites: 3 },
  { nodeId: 'S7', modules: ['marketRegister.js', 'routes.js', 'streetEdges.js', 'streets.js'],
    allowedImports: ['fabricGeometry.js', 'fabricRng.js', 'lineage.js', 'substrate.js', 'waterMode.js'],
    randomNamespaces: ['*|*|a', '*|across', '*|approach|*', '*|b13|*', '*|bearing', '*|jit', '*|outlane|*', 'corridor.*', 'square.*', 'square.heart'],
    statefulForkSites: 6 },
  // ⭐⭐⭐ ⟦SPINE-1 · ODQ §669/§670⟧ **S8 IS NO LONGER AN EMPTY STAGE, AND THAT IS THE POINT.**
  //   `UNBUILT_STAGES` published S8 as owning no module because §239.1's planar faces were CUT by
  //   the packer rather than DERIVED — the manifest's own words. DESIGN_SPINE's partition is
  //   exactly that stage built: a planar subdivision whose faces ARE the blocks and plots, with a
  //   maintained half-edge topology and point location (SPEC §10.15's *"a DCEL is the objectively
  //   stronger owner for S8/S9 planar faces, holes, adjacency, frontage and parcel boundaries"*).
  //   ⚠ IT IS FLAG-DORMANT, NOT ABSENT. `buildFabric` imports it and calls it only under
  //   `options.partition === true`, so the edge `S8>ASSEMBLY` is REAL and declared — which is why
  //   these modules are NOT on `FOUNDATIONS`, whose whole law is having no outbound edge.
  //   ⚠ AND THEY IMPORT NO FOUNDATION. `coordinateAbi.js`'s quantum is spelled locally in
  //   `partitionArrangement.js` and pinned equal by test, precisely so arm 10 stays green.
  // ⭐⭐ ⟦SPINE-2 · ODQ §680⟧ TWO MORE MODULES AND TWO MORE ALLOWED IMPORTS, both FORWARD.
  //   `partitionWater.js` reads `waterMode.js` (S4) because §2 makes the §648 width profile the
  //   SINGLE authority for banks and `stationAt` is its one home — a local re-derivation would be
  //   the second water truth TE-WSEAM measured at 2.63 % agreement. `partitionDecline.js` reads
  //   `growthLedger.js` (S0) for `LOSS_REGION_SCHEMA`, which GROW-A reserved precisely so car B
  //   would not re-shape it. S4 and S0 both precede S8, so no inversion is created.
  { nodeId: 'S8', modules: ['partitionArrangement.js', 'partitionCensus.js', 'partitionConstruct.js', 'partitionDecline.js', 'partitionView.js', 'partitionWater.js'],
    allowedImports: ['fabricGeometry.js', 'fabricRng.js', 'growthAnnotation.js', 'growthLedger.js', 'waterMode.js'],
    // ⭐ SIX MECHANIC IDS, ALL `keyedRandom` — pure string hashes with no stream, which is why
    //   `statefulForkSites` stays 0 and the fabric's pinned total of 18 does not move.
    randomNamespaces: ['bearing', 'cut', 'empty', 'gapbar', 'stop', 'ward'],
    statefulForkSites: 0 },
  { nodeId: 'S10', modules: ['frontageFusion.js', 'parcels.js'],
    allowedImports: ['fabricGeometry.js', 'fabricRng.js', 'groundRefusal.js', 'lineage.js', 'organismFields.js', 'reservedGround.js', 'substrate.js', 'tierGrammar.js'],
    randomNamespaces: ['*/pack', '*|a', '*|alley|*|*|*', '*|amp', '*|back', '*|backd', '*|d', '*|dwelling-guarantee', '*|g', '*|gap', '*|gapthru', '*|h', '*|l', '*|mat', '*|row|*', '*|s', '*|sb', '*|t', '*|t2', '*|w', '*|wing', '*|wingside', '*|w|*', '*|x', '*|y'],
    statefulForkSites: 1 },
  { nodeId: 'S11', modules: ['institutionShapes.js', 'shapeCode.js'],
    allowedImports: ['fabricGeometry.js', 'fabricRng.js', 'lineage.js', 'trigTable.js'],
    randomNamespaces: ['*|front|*', '*|roof|*'],
    statefulForkSites: 0 },
  // ⚠ ⟦§301.6⟧ `trigTable.js` IS NEW ON THIS NODE and the walker required the row. The terrain
  //   service's re-aimed search takes its eight bearings from the fabric's ONE home for an angle;
  //   the purity law forbids runtime trig outright, so a neighbourhood search cannot be spelled
  //   any other way. It is a PRIMITIVES edge S11 and S14 already carry — no new node pair.
  // ⚠ ⟦§297.2b / ODQ §577⟧ `cliffs.js` IS NEW ON THIS NODE. The segmented circuit terminates at
  //   the escarpment, so the trace consumes the boundary and its crossing read. It is an `S2>S13`
  //   edge the node pair already carries (`substrate.js`, `groundRefusal.js`) — no new node pair.
  // ⭐⭐⭐ ⟦DRESS-1 · ODQ §686.7⟧ **`wallPublication.js` JOINS S13, AND THE ORDER ARM IS WHAT PUT IT
  //   HERE.** PA.2's successor publication derives the wall surface ONCE — off the WALLBAND faces
  //   and the wrap's own ledger facts — so the dress consumes rather than re-derives (the estate
  //   has twice found one law spelled two ways inside one module, §686.3's own words; this is the
  //   structural refusal of a third).
  //   ⛔ IT WAS FIRST ASSIGNED TO S8, WITH THE PARTITION, AND THE WALKER CONVICTED THE CHOICE: an
  //   S8 module reading `wallRuns`/`walls`/`rampartWorks` derives the BACKWARD edge `S13>S8`, a new
  //   PUBLIC ORDER INVERSION. The right reading of that red is not a declared exception — it is
  //   that **this module is wall machinery that happens to read the partition, not partition
  //   machinery that happens to read walls.** On S13 its one cross-node read is
  //   `partitionArrangement.js` (S8), and `S8>S13` runs FORWARD. No inversion is created and S8's
  //   own row is untouched.
  //   ⭐ `statefulForkSites` STAYS 3: the publication draws with `keyedRandom` (pure string hashes,
  //   no stream), so the fabric's pinned total of 18 does not move to admit it.
  { nodeId: 'S13', modules: ['rampartWorks.js', 'wallCircuit.js', 'wallPublication.js', 'wallRuns.js', 'walls.js'],
    allowedImports: ['builtUmbrella.js', 'cliffs.js', 'epochAxis.js', 'fabricGeometry.js', 'fabricRng.js', 'groundRefusal.js', 'partitionArrangement.js', 'reservedGround.js', 'snapshot.js', 'substrate.js', 'trigTable.js', 'waterMode.js'],
    randomNamespaces: ['kind', 'rampart.E*', 'thin', 'wall.epoch.*', 'wall.epoch.*.*'],
    statefulForkSites: 3 },
  // ⭐ ⟦SPINE-3 · ODQ §692.6(ii)⟧ **S14 GAINS `wallRuns.js`, DECLARED RATHER THAN HIDDEN.**
  //   `circuitDemotion` needs a run for the fate ladder when a legacy ring carries no chain, and
  //   it used to spell the word `'new-cutting'` itself. `wallRuns` owns that vocabulary, so the
  //   fallback is now `wallRuns.FALLBACK_RUN_TYPE` and the edge is on the manifest. Same reading
  //   as J-DRESS1-8: **a visible dependency the chair can veto beats an invisible one that
  //   works** — and the alternative was a second home for a run type's name, which is the exact
  //   defect this wave was chartered to close.
  { nodeId: 'S14', modules: ['circuitDemotion.js'],
    allowedImports: ['fabricGeometry.js', 'fabricRng.js', 'groundRefusal.js', 'trigTable.js', 'wallCircuit.js', 'wallRuns.js'],
    randomNamespaces: ['wall.demote.*'],
    statefulForkSites: 1 },
  { nodeId: 'S15', modules: ['faubourgOrigin.js', 'habitation.js'],
    allowedImports: ['commons.js', 'fabricGeometry.js', 'fabricRng.js', 'lineage.js', 'trigTable.js', 'waterMode.js'],
    randomNamespaces: ['*|d', '*|faub|*', '*|hab|*', '*|i', '*|keeper|*', '*|landing|*', '*|landing|*|*|a', '*|landing|*|*|r', '*|o', '*|s', '*|stead|*|a', '*|t', '*|tenure', '*|tone', '*|w'],
    statefulForkSites: 0 },
  // ⭐⭐ ⟦CAR-SEATING⟧ `partitionSeating.js` JOINS S16, THE SEATING NODE, AND NOT S8.
  //   It is a SEATING law — a deck, an order and a scorer — that happens to read partition faces,
  //   exactly as `seating.js` is a seating law that reads the organism fields. Its neighbours here
  //   are the two modules that already decide where a body goes.
  // ⭐ IT DECLARES `S8>S16` RATHER THAN HIDING IT. The module reads `partitionArrangement.js`
  //   directly, so the edge is REAL; ⟦DRESS-1 §686.7⟧ already refused the injected-reader dodge
  //   for `wallPublication.js` on the ground that it makes a real dependency invisible to the very
  //   graph this manifest exists to expose, and the same answer is taken here. S8 PRECEDES S16 in
  //   the stage order, so the edge runs FORWARD: no inversion, and the SCC roster does not grow.
  // ⭐ `fabricGeometry.js` is a PRIMITIVES edge S16 ALREADY CARRIES (via `trigTable.js`), so no
  //   new node pair is created by it. And the module mints no namespace and opens no stream — it
  //   holds none of the seven scanned callees — so `randomNamespaces` is unchanged, S16's
  //   `statefulForkSites` stays 1, and the fabric's pinned total of 18 does not move.
  { nodeId: 'S16', modules: ['institutions.js', 'partitionSeating.js', 'seating.js'],
    allowedImports: ['fabricGeometry.js', 'fabricRng.js', 'lineage.js', 'organismFields.js', 'partitionArrangement.js', 'substrate.js', 'trigTable.js', 'waterMode.js', '../../../data/institutionAtlas.js', '../../../data/institutionLadders.js', '../../institutions/institutionRoster.js'],
    randomNamespaces: ['*|candr|*', '*|cand|*', '*|repairr|*', '*|repair|*', '*|rot', '*|success', '*|variant', 'seat.*'],
    statefulForkSites: 1 },
  { nodeId: 'S17', modules: ['waterWorks.js'],
    allowedImports: ['fabricGeometry.js', 'fabricRng.js', 'lineage.js', 'reservedGround.js', 'trigTable.js', 'waterMode.js'],
    // ⭐ REG-5 · V-QUAY's four key spellings join S17 with the deriver that mints them
    //   (ODQ §636.2). They are pure `hashUnit` string hashes — no stream — so
    //   `statefulForkSites` is unchanged and honestly so.
    randomNamespaces: ['*|vquay|*', '*|vquay|*|*|n', '*|vquay|*|*|u', '*|vquay|*|*|v', '*|watergate|*|*'],
    statefulForkSites: 0 },
  { nodeId: 'S18', modules: ['fields.js'],
    allowedImports: ['fabricGeometry.js', 'fabricRng.js', 'groundRefusal.js', 'substrate.js'],
    randomNamespaces: ['*|*|*|*', '*|*|t', '*|*|t2', '*|aj', '*|br|*', '*|cut|*', '*|gf|*|b', '*|gf|*|r', '*|gf|*|t', '*|n', '*|te*', '*|tone', '*|tr', '*|tr*', '*|trn', '*|tu*', '*|vx|*|*', '*|vy|*|*'],
    statefulForkSites: 0 },
  // ⭐⭐ ⟦CAR-STATE-BRIDGE · ODQ §710.6⟧ `partitionState.js` JOINS S19, THE STATE NODE.
  //   It is a §10 law — WHERE a state mark stands — and its neighbour here is the module that
  //   decides WHICH state marks exist. It takes NO partition module: a projected page is plain
  //   data, so unlike `partitionSeating.js`'s honest `S8>S16` this module derives no new node
  //   edge at all, and S19's `allowedImports` is unchanged (`fabricGeometry.js` was already
  //   there). ⭐ It opens no stream and mints no key — it TRANSFORMS families rigidly rather
  //   than re-deriving them — so `randomNamespaces` is unchanged, `statefulForkSites` stays 0,
  //   and the fabric's pinned total of 18 stateful streams does not move.
  { nodeId: 'S19', modules: ['partitionState.js', 'stateMarks.js'],
    allowedImports: ['fabricGeometry.js', 'fabricRng.js', '../../../data/stressTypes.js', '../../canonicalAccessors.js'],
    randomNamespaces: ['*|barricade', '*|camp|*|x', '*|camp|*|y', '*|siege|*'],
    statefulForkSites: 0 },
  { nodeId: 'S20', modules: ['accessLaw.js', 'compoundGround.js', 'groundLaw.js', 'lateGround.js', 'minFootprint.js'],
    allowedImports: ['fabricGeometry.js', 'groundRefusal.js', 'lineage.js', 'reservedGround.js'],
    randomNamespaces: [],
    statefulForkSites: 0 },
  { nodeId: 'S21', modules: ['leafCensus.js'],
    allowedImports: ['accessLaw.js', 'fabricGeometry.js', 'lineage.js', 'organismFields.js', 'reservedGround.js', 'wallCircuit.js', 'waterMode.js', 'waterWorks.js'],
    randomNamespaces: [],
    statefulForkSites: 0 },
  // ⭐⭐⭐ ⟦DRESS-1 · ODQ §686.7⟧ **`partitionDress.js` JOINS S22 — THE INK BELONGS WITH THE LENS.**
  //   DESIGN_SPINE §4: *"views read the partition plus closed dress vocabularies, and nothing
  //   else."* The dress is exactly that view, and `folioLenses.js` — the closed vocabulary it reads
  //   — is already this node. Assigned to S8 it derived the backward edges `S17>S8` and `S22>S8`;
  //   here its reads of `waterWorks.js` (S17, `V_QUAY_BAND`) and `rampartWorks.js` (S13, the signed
  //   comb/texture/stair pitches) both run FORWARD, and the lens table is a same-node read.
  //   ⚠ It takes NO partition module: the dress consumes a PAGE FRAME and a WALL PUBLICATION as
  //   plain data, which is why the ink can be judged without the constructor being in scope.
  { nodeId: 'S22', modules: ['folioLenses.js', 'immersion.js', 'partitionDress.js'],
    allowedImports: ['fabricGeometry.js', 'fabricRng.js', 'measure.js', 'rampartWorks.js', 'waterWorks.js'],
    randomNamespaces: ['*|*|road', '*|*|side', '*|field', '*|h', '*|keep', '*|w'],
    statefulForkSites: 0 },
  /**
   * ⭐⭐ ⟦CAR-WORDS-2 · ODQ §717⟧ **`pageChrome.js` JOINS S23, AND THE ASSIGNMENT IS THE WHOLE
   *   REASON THE PORT COSTS NO NEW EDGE.** The dress page carried ZERO `<text>` on 18 of 18 leaves
   *   (F0-31/32/33); the cure needs the §173 typesetter, and the OBVIOUS home for it —
   *   `partitionDress.js`, S22 — would have derived `S23>S22`, a **new public-order inversion**
   *   arm 6 convicts by name and arm 7 would then have to re-roster the SCC for.
   *   ⭐ At S23 the read of `lettering.js` is a SAME-NODE read and derives no cross-node edge at
   *   all, so `allowedImports` is unchanged and `NODE_EDGES`, `PUBLIC_ORDER_INVERSIONS` and
   *   `STAGE_GRAPH_SCC` are all untouched by this wave. Everything else the chrome needs — the
   *   palette, the scale bar, the leaf's own drawn-group roster — arrives as PLAIN DATA, which is
   *   the discipline the S22 block above already documents for `losses`.
   *   ⚠ S23 remains a SINK: nothing in `src/` imports either module, so an inbound edge cannot
   *   create a cycle here however the graph grows.
   */
  { nodeId: 'S23', modules: ['lettering.js', 'pageChrome.js'],
    allowedImports: ['fabricGeometry.js'],
    randomNamespaces: [],
    statefulForkSites: 0 },
  { nodeId: 'ASSEMBLY', modules: ['buildFabric.js', 'publication.js'],
    allowedImports: ['builtUmbrella.js', 'circuitDemotion.js', 'cliffs.js', 'commons.js', 'compile.js', 'compoundGround.js', 'districtPartition.js', 'fabricGeometry.js', 'fabricRng.js', 'faubourgOrigin.js', 'fields.js', 'frontageFusion.js', 'groundLaw.js', 'groundRefusal.js', 'growthLedger.js', 'habitation.js', 'immersion.js', 'institutionShapes.js', 'institutions.js', 'lateGround.js', 'leafCensus.js', 'lineage.js', 'marketRegister.js', 'measure.js', 'minFootprint.js', 'morphology.js', 'organismFields.js', 'organisms.js', 'parcels.js', 'partitionConstruct.js', 'partitionSeating.js', 'partitionView.js', 'rampartWorks.js', 'relief.js', 'reservedGround.js', 'routes.js', 'seating.js', 'shapeCode.js', 'snapshot.js', 'stateMarks.js', 'streetEdges.js', 'streets.js', 'substrate.js', 'suitability.js', 'terraform.js', 'tierGrammar.js', 'umbrella.js', 'wallCircuit.js', 'wallRuns.js', 'walls.js', 'waterMode.js', 'waterWorks.js'],
    randomNamespaces: [],
    statefulForkSites: 0 },
].map(Object.freeze));

/** ⭐ THE CROSS-NODE EDGE SET, `'PRODUCER>CONSUMER'`, derived from the real import graph. */
export const NODE_EDGES = Object.freeze([
  'PRIMITIVES>ASSEMBLY', 'PRIMITIVES>FOUNDATIONS', 'PRIMITIVES>S10', 'PRIMITIVES>S11', 'PRIMITIVES>S13',
  'PRIMITIVES>S14', 'PRIMITIVES>S15', 'PRIMITIVES>S16', 'PRIMITIVES>S17', 'PRIMITIVES>S18',
  'PRIMITIVES>S19', 'PRIMITIVES>S2', 'PRIMITIVES>S20', 'PRIMITIVES>S21', 'PRIMITIVES>S22',
  'PRIMITIVES>S23', 'PRIMITIVES>S4', 'PRIMITIVES>S5', 'PRIMITIVES>S6', 'PRIMITIVES>S7', 'S0>ASSEMBLY',
  'S0>FOUNDATIONS', 'S0>S10', 'S0>S11', 'S0>S13', 'S0>S14', 'S0>S15', 'S0>S16', 'S0>S17', 'S0>S18',
  'S0>S19', 'S0>S2', 'S0>S20', 'S0>S21', 'S0>S22', 'S0>S3', 'S0>S4', 'S0>S5', 'S0>S6', 'S0>S7',
  'S10>ASSEMBLY', 'S11>ASSEMBLY', 'S13>ASSEMBLY', 'S13>S14', 'S13>S21', 'S13>S6', 'S14>ASSEMBLY',
  'S15>ASSEMBLY', 'S16>ASSEMBLY', 'S17>ASSEMBLY', 'S17>S21', 'S18>ASSEMBLY', 'S19>ASSEMBLY',
  'S20>ASSEMBLY', 'S20>S21', 'S21>ASSEMBLY', 'S22>ASSEMBLY', 'S2>ASSEMBLY', 'S2>S10', 'S2>S13', 'S2>S14',
  'S2>S16', 'S2>S18', 'S2>S20', 'S2>S22', 'S2>S3', 'S2>S4', 'S2>S6', 'S2>S7', 'S3>ASSEMBLY', 'S3>S6',
  'S4>ASSEMBLY', 'S4>S13', 'S4>S15', 'S4>S16', 'S4>S17', 'S4>S21', 'S4>S6', 'S4>S7', 'S4>S8', 'S5>S13', 'S5>S6',
  'S6>ASSEMBLY', 'S6>S10', 'S6>S13', 'S6>S15', 'S6>S16', 'S6>S2', 'S6>S21', 'S7>ASSEMBLY',
  // ⭐ SPINE-1's THREE, and all three run FORWARD: the partition reads the primitives and the S0
  //   pre-stages, and the assembly reads the partition. No new inversion, so `STAGE_GRAPH_SCC` is
  //   unchanged and arm 7's roster still names the whole feedback set.
  'PRIMITIVES>S8', 'S0>S8', 'S8>ASSEMBLY',
  // ⭐⭐ ⟦DRESS-1 · §686.7⟧ THREE MORE, AND ALL THREE RUN **FORWARD** — which is the whole reason
  //   the publication sits on S13 and the dress on S22 rather than both on S8. Assigning them to
  //   the partition node derived `S13>S8`, `S17>S8`, `S22>S8`: three NEW public-order inversions
  //   in a dress car. `PUBLIC_ORDER_INVERSIONS` and `STAGE_GRAPH_SCC` are untouched by the
  //   assignment that actually landed.
  'S8>S13', 'S13>S22', 'S17>S22',
  // ⟦CAR-SEATING⟧ the seating pass reads the arrangement's faces. FORWARD (S8 precedes S16), so
  // it creates no inversion and does not enlarge the SCC — see the S16 block for why it is
  // declared here rather than routed around an injected reader.
  'S8>S16'
]);

/** The ABSENT §10.14 fields, named rather than stubbed. A consumer that needs one must build
 *  the artifact family first; a placeholder here would let a later lane read `ALWAYS_ACTIVE` as
 *  a decision somebody made. */
export const MANIFEST_ABSENT_FIELDS = Object.freeze(['lawManifestRef', 'coordinateAbiRef',
  'executableVocabularyRef', 'customParityFixtureRegistryRef', 'provenanceRef', 'contentHash',
  'gate', 'observationAcceptance', 'outputContracts', 'invalidationRoots', 'invariants']);

/** The manifest artifact itself. */
export const GENERATION_MANIFEST = Object.freeze({
  artifactKind: 'GENERATION_MANIFEST',
  schemaVersion: 1,
  lawVersion: 'mf-d1-sandbox-stage-manifest-v1',
  coordinateAbiVersion: COORDINATE_ABI_VERSION,
  stageIds: STAGE_IDS,
  nonStageNodes: NON_STAGE_NODES,
  unbuiltStages: UNBUILT_STAGES,
  publicOrderInversions: PUBLIC_ORDER_INVERSIONS,
  nodes: GENERATION_NODES,
  edges: NODE_EDGES,
  absentFields: MANIFEST_ABSENT_FIELDS,
});

/**
 * ⛔⛔ **THE FINDING THE MANIFEST EXISTS TO MAKE VISIBLE, AND IT IS A NUMBER: THE MODULE IMPORT
 * GRAPH IS ACYCLIC AND THE STAGE GRAPH IS NOT.**
 *
 * §234.2's walker already proves the FILE-level import graph has zero cycles, and it does. Ask
 * the same graph the STAGE question — collapse each module onto the public S0–S23 id it serves —
 * and one strongly-connected component appears, spanning five stages. It is not a contradiction:
 * a collapse can only add cycles, never remove them, and this is what "the public numbering is a
 * narrative order, not a derivation order" looks like when it is measured instead of asserted.
 *
 * ⭐ AND THE FEEDBACK EDGE SET IS EXACTLY THE TWO DECLARED INVERSIONS. Remove `S6>S2` and
 * `S13>S6` — nothing else — and the stage graph is a DAG. So the component is fully explained by
 * two named module imports with written reasons, rather than being a diffuse tangle. A third
 * inversion, or a component this roster does not name, REDS.
 */
/**
 * ⭐⭐⭐ ⟦DRESS-1 · §686.7⟧ **THE COMPONENT GAINS S8, AND THE GAIN IS DECLARED RATHER THAN ROUTED
 * AROUND.** `wallPublication.js` (S13) reads `partitionArrangement.js` (S8) — it must, because it
 * publishes the wall surface off the WALLBAND faces themselves — and S13 already reads
 * `waterMode.js` (S4), which already reaches S8. So `S8>S13` closes a loop and the partition joins
 * the feedback set: five stages become six.
 *
 * ⚠ **THE ALTERNATIVE WAS AVAILABLE AND WAS REFUSED ON PURPOSE.** Handing the publication an
 * injected reader (`{facesOf, ringOf, centroidOf}`) the way `partitionDress` takes `ringOfFace`
 * would have kept the roster at five — by making a real, direct dependency INVISIBLE to the very
 * graph this manifest exists to expose. A smaller roster bought with a hidden edge is the wrong
 * trade in a file whose stated law is *"moves zero bytes as a GRAPH FACT"*.
 *
 * ⭐ **AND NO THIRD INVERSION IS CREATED.** `closedBy` is unchanged: cutting `S13>S6` and `S6>S2`
 * — and nothing else — still leaves a DAG with a unique order, which arm 7 proves separately from
 * this roster. The component grew; its explanation did not.
 */
export const STAGE_GRAPH_SCC = Object.freeze([
  Object.freeze({
    members: Object.freeze(['S13', 'S2', 'S3', 'S4', 'S6', 'S8']),
    closedBy: Object.freeze(['S13>S6', 'S6>S2']),
  }),
]);

/** The edge set with the declared inversions removed — the acyclic core the order is taken over. */
export function acyclicEdges() {
  const cut = new Set(PUBLIC_ORDER_INVERSIONS.map((i) => i.edge));
  return NODE_EDGES.filter((e) => !cut.has(e));
}

/** Every module the manifest assigns, flat and sorted — the walker compares this to `readdir`. */
export function manifestModules() {
  const out = [];
  for (const n of GENERATION_NODES) for (const m of n.modules) out.push(m);
  return out.sort();
}

/** The node a module belongs to, or `null`. */
export function nodeOfModule(moduleName) {
  for (const n of GENERATION_NODES) if (n.modules.includes(moduleName)) return n.nodeId;
  return null;
}

/**
 * ⭐ THE UNIQUELY DERIVED TOPOLOGICAL ORDER (SPEC §10.14: *"`topologicalNodeIds` is the uniquely
 * derived stable topological order"*). Kahn's algorithm with a canonical tie-break by node id,
 * so the order is a pure function of the edge set and not of iteration order. Returns `null` on
 * a cycle rather than throwing, so the walker can report the cycle rather than crash on it.
 *
 * ⚠⚠ IT IS COMPUTED OVER THE EDGE SET MINUS THE TWO DECLARED INVERSIONS, AND THE REASON IS
 * `STAGE_GRAPH_SCC` BELOW: the raw stage graph is NOT a DAG. Passing the raw set returns `null`,
 * which is the honest answer and is asserted as such by the walker.
 */
export function topologicalNodeIds(edges = acyclicEdges()) {
  const ids = GENERATION_NODES.map((n) => n.nodeId);
  const indeg = new Map(ids.map((i) => [i, 0]));
  const out = new Map(ids.map((i) => [i, []]));
  for (const e of edges) {
    const [a, b] = e.split('>');
    if (!indeg.has(a) || !indeg.has(b)) continue;
    out.get(a).push(b);
    indeg.set(b, indeg.get(b) + 1);
  }
  // CANONICAL TIE-BREAK: the public stage index, so the derived order reads as the program's
  // own numbering wherever the dependencies leave it free. Deterministic either way; legible
  // only this way, and §10.14 asks for the order to be UNIQUE, which a total tie-break gives.
  const rank = (a, b) => stageOrderIndex(a) - stageOrderIndex(b);
  const ready = ids.filter((i) => indeg.get(i) === 0).sort(rank);
  const order = [];
  while (ready.length) {
    const v = ready.shift();
    order.push(v);
    for (const w of out.get(v).slice().sort(rank)) {
      indeg.set(w, indeg.get(w) - 1);
      if (indeg.get(w) === 0) { ready.push(w); ready.sort(rank); }
    }
  }
  return order.length === ids.length ? order : null;
}

/** Public-stage index, with the two non-stage nodes pinned to the ends. */
export function stageOrderIndex(nodeId) {
  if (nodeId === 'PRIMITIVES') return -1;
  if (nodeId === 'ASSEMBLY') return STAGE_IDS.length;
  // ⭐ THE FOUNDATIONS SIT AFTER THE ASSEMBLY BY CONSTRUCTION: they read what it published and
  // nothing reads them, so putting them anywhere earlier would invent a dependency.
  if (nodeId === FOUNDATION_NODE) return STAGE_IDS.length + 1;
  return STAGE_IDS.indexOf(nodeId);
}

/** Every edge OUT of the foundations node — must be empty, forever. */
export function foundationOutboundEdges() {
  return NODE_EDGES.filter((e) => e.split('>')[0] === FOUNDATION_NODE).sort();
}

/** Every edge whose producer sits LATER in the public order than its consumer. */
export function backwardEdges() {
  const out = [];
  for (const e of NODE_EDGES) {
    const [a, b] = e.split('>');
    if (stageOrderIndex(a) > stageOrderIndex(b)) out.push(e);
  }
  return out.sort();
}

/**
 * ⭐⭐ THE RANDOM-NAMESPACE COLLISION QUESTION, ASKED OF THE REGISTRY ITSELF. Two stages minting
 * one key spelling is how two mechanics come to share a draw, and it is invisible until a lane
 * changes one of them. Returns the spellings claimed by more than one node.
 */
export function namespaceCollisions() {
  const owner = new Map();
  const clash = new Map();
  for (const n of GENERATION_NODES) {
    for (const ns of n.randomNamespaces) {
      if (owner.has(ns) && owner.get(ns) !== n.nodeId) {
        if (!clash.has(ns)) clash.set(ns, [owner.get(ns)]);
        clash.get(ns).push(n.nodeId);
      } else owner.set(ns, n.nodeId);
    }
  }
  return [...clash.entries()].map(([ns, nodes]) => ({ namespace: ns, nodes: nodes.sort() }))
    .sort((x, y) => (x.namespace < y.namespace ? -1 : 1));
}
