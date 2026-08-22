/**
 * domain/townMap/fabric/stageManifest.js — ⭐⭐⭐ MF-T2J · §287.8 / SPEC §10.14 ·
 * **THE EXECUTABLE S0–S23 STAGE MANIFEST, PORTED FROM THE SEALED W3 TIP.**
 *
 * ODQ §287.8 orders it in one sentence: *"an executable S0–S23 manifest owns stage inputs/
 * outputs/imports/random namespaces/ABI/law/censuses/invalidation and CI refuses prose/source
 * drift."* SPEC §10.14 puts the reason plainly: architecture stops being prose at this seam.
 *
 * ⛔⛔ **READ THIS BEFORE READING ANY FIGURE BELOW: WHAT THE ARTIFACT IS *IN THIS TREE*.**
 * In the sealed sandbox this file declared ONE datum — which stage a module serves — and its
 * walker re-derived every other field from the 54-module sandbox fabric on every run. **This tree
 * is not that tree.** `src/domain/townMap/fabric/` here holds the codex slice plus the D3a port
 * so far; 50 of the 54 modules named below do not exist here yet. So the port carries the whole
 * table as **PUBLISHED DATA — a frozen record of a measurement taken elsewhere** — and
 * `tests/lint/townMapStageManifest.walker.test.js` checks it in the two directions that are
 * honest here:
 *
 *   (i)  **the record against itself** — the edge set, the backward edges, the topological order,
 *        the foundation closure, the namespace-collision roster and the strongly-connected
 *        component are all RE-DERIVED from `NODE_EDGES` and `GENERATION_NODES` by an independent
 *        implementation and must agree, so a hand edit to any published figure reds; and
 *   (ii) **the record against the LANDED sub-tranche** — every fabric module that exists here AND
 *        is named below has its real imports, its real key spellings and its real fork sites
 *        re-parsed from source with `acorn` and refused if they disagree. That set grows with
 *        every port member, so the executable half of §287.8 arrives incrementally rather than
 *        being promised.
 *
 * ⚠⚠ **AND ONE PUBLISHED CLAIM IS TRUE OF THE SANDBOX AND NOT OF THIS TREE — SAID HERE RATHER
 * THAN DISCOVERED LATER.** `FOUNDATIONS` has no outbound edge *in the sandbox*. Here the codex
 * slice already reads the coordinate ABI from four of its own modules, which the derivation
 * cannot see because those modules are unassigned. The walker therefore does NOT rest on the
 * sealed arm: it publishes this tree's real reader roster for every landed foundation module and
 * freezes it, so a new reader reds on arrival. An absence measured against a denominator that
 * does not contain the surface proves nothing about it.
 *
 * ⭐⭐ THE FINDING THIS FILE EXISTS TO CARRY, AND IT SURVIVES THE PORT INTACT: **the module import
 * graph is acyclic and the STAGE graph is NOT.** See `STAGE_GRAPH_SCC`. The port PRESERVES that
 * component; it does not repair it.
 *
 * ⚠ WHAT THIS IS NOT, STATED SO NOBODY READS A FOUNDATION AS A CUTOVER. `GenerationManifest`'s
 * full §10.14 shape — typed gate expressions, observation-acceptance policies, output authority
 * contracts, `ArtifactHashRef` closures — needs artifact families (`UnitRegistry`,
 * `ProvenanceRef`, `EvidenceScope`) that do not exist in the plan era. Those fields are named
 * ABSENT below rather than stubbed, because a gate expression carrying `ALWAYS_ACTIVE` because
 * nobody built the registry is a worse lie than a missing field. **Nothing in the generation path
 * imports this module. It moves zero bytes and is read-side machinery by construction.**
 *
 * COST (preamble §P1 R-MF-1): every helper here is a fixed-size fold over published data — 23
 * nodes, 88 edges, 54 module names — and none of it scales with a settlement. The topological
 * sort is Kahn's with a re-sort per ready-push, O(V² log V) at V = 23; the real leaf sizes
 * R-MF-1 prices against (11,603 and 17,417 boundaries) never enter this file.
 * ARITHMETIC (R-MF-2): no product of ABI quanta is computed here. The only arithmetic is a
 * difference of public stage indices bounded by 25, so no BigInt is owed.
 * PURITY: pure data plus pure helpers over it. No clock read, no ambient randomness source, no
 * input/output, no locale-sensitive formatting.
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
 * GRAPH FACT RATHER THAN A PROMISE — **IN THE TREE THE RECORD WAS MEASURED IN.**
 *
 * The coordinate ABI, this manifest, exact solid legality, the spatial-receipt seam and the DCEL
 * are read-side machinery. §10.15(4) is explicit — *"keep consumers on the legacy accessor until
 * every equivalence gate passes"* — so the wave's whole safety argument is that no stage imports
 * them. Written down, that is a promise. Given its own node it is an EDGE SET: in the sealed
 * sandbox **`FOUNDATIONS` has inbound edges and NO OUTBOUND EDGE**, and `foundationOutboundEdges()`
 * re-derives that from the published edge set so an edit to the record reds.
 *
 * ⛔ **IT IS NOT A LIVE LAW HERE, AND THE WALKER SAYS SO.** In this tree `coordinateAbi.js` is
 * already read by codex-slice modules the record does not assign, so the derivation cannot see
 * those edges at all. The walker's live arm freezes the real reader roster instead of asserting
 * an emptiness its denominator cannot support.
 */
export const FOUNDATION_NODE = 'FOUNDATIONS';

/**
 * ⛔⛔ THE STAGES WITH NO MODULE AT ALL — the holes, published as data so a reader cannot mistake
 * silence for coverage. SPEC §1.0 grades S1 NOT BUILT, S8 PARTIAL (§239.1 unbuilt), S9 NOT BUILT
 * (*"the #1 ranked gap in both studies"*) and S12 PARTIAL. **S1, S8, S9 and S12 own no module in
 * the measured tree**, and the manifest says so in the field rather than by omitting a row.
 * Frontage (S9) is exactly what §287.8 says D1 may NOT prove — *"D1 proves face/adjacency/
 * point-location only; frontage/parcel equivalence waits for fresh W3"* — so its absence here is
 * the ordered state, and ODQ §310.1 carries it forward as NOT BUILT.
 */
export const UNBUILT_STAGES = Object.freeze(['S1', 'S8', 'S9', 'S12']);

/**
 * ⚠⚠ THE TWO EDGES WHERE THE PUBLIC ORDER AND THE REAL DEPENDENCY ORDER DISAGREE, ENUMERATED AND
 * REASONED. A module belonging to a LATER public stage is imported by an EARLIER one at exactly
 * two places in the measured fabric. Both are real and neither is a cycle at the FILE level (that
 * import graph is acyclic); they are places where the public numbering is a NARRATIVE order and
 * the derivation is not. A THIRD inversion REDS: an undeclared downstream read is precisely what
 * §10.14 orders the validator to refuse.
 */
export const PUBLIC_ORDER_INVERSIONS = Object.freeze([
  { edge: 'S6>S2', importer: 'relief.js', imported: 'umbrella.js',
    reason: 'the relief pass reads the settlement EXTENT to size its own field; extent is a '
      + 'roster fact (population and tier), not a district fact, so the read is of a scalar the '
      + 'umbrella happens to own rather than of S6 geometry' },
  { edge: 'S13>S6', importer: 'districtPartition.js', imported: 'wallCircuit.js',
    reason: 'the partition asks the circuit for its rings so a quarter boundary can stop at the '
      + 'curtain; §200 MOVED the circuit AHEAD of the ground law in the assembly, so at run time '
      + 'the circuit genuinely precedes this read — the public numbering is what is stale' },
]);

/**
 * ⭐⭐ THE NODE TABLE. In the sandbox `modules` was the declared datum and every other field was
 * re-derived; here the whole table is the published record, and the walker re-derives what this
 * tree can reach (the landed sub-tranche) rather than pretending it can reach the rest.
 *
 * `randomNamespaces` is §287.8's per-stage RANDOM NAMESPACE REGISTRY. `*` stands for an
 * interpolated expression, so `'*|valley|bearing'` is the shape `` `${x}|valley|bearing` ``. The
 * registry is over the KEY SPELLINGS a stage mints, which is the surface a collision would
 * appear on — two stages minting one spelling is how two mechanics come to share a draw.
 *
 * `statefulForkSites` counts `fabricRng(...)` calls — the ONLY stateful streams in the fabric.
 * Everything else is `hashUnit`/`hash32`/`hashInt`/`keyedRandom`, which are pure string hashes
 * with no stream at all. This count is the subject of the §293.3c stream-derivation audit.
 *
 * @typedef {{ nodeId: string, modules: readonly string[], allowedImports: readonly string[],
 *   randomNamespaces: readonly string[], statefulForkSites: number }} GenerationNode
 * @type {readonly GenerationNode[]}
 */
export const GENERATION_NODES = Object.freeze([
  { nodeId: 'PRIMITIVES', modules: ['fabricGeometry.js', 'reservedGround.js', 'trigTable.js'],
    allowedImports: [],
    randomNamespaces: [],
    statefulForkSites: 0 },
  // ⚠ ⟦MF-W3F⟧ `streetWebVersions.js` JOINS THIS NODE AND NOT S17. It is SW-1b's declaration —
  //   read only by `tests/lint/streetWebVersion.walker.test.js`, imported by no stage — so it is
  //   read-side machinery by exactly the test this node exists to enforce, and the foundation
  //   closure keeps it outbound-edge-free. Assigning it to the street stage would give
  //   FOUNDATIONS' sibling a module the generation path could start importing without a red.
  { nodeId: 'FOUNDATIONS', modules: ['coordinateAbi.js', 'fabricDcel.js', 'solidLegality.js', 'spatialReceipt.js', 'stageManifest.js', 'streetWebVersions.js'],
    allowedImports: ['fabricGeometry.js', 'fabricRng.js'],
    randomNamespaces: ['f0:*', 'f1:*', 'f2:*', 'f3:*'],
    statefulForkSites: 0 },
  { nodeId: 'S0', modules: ['compile.js', 'fabricRng.js', 'lineage.js', 'morphology.js', 'snapshot.js', 'tierGrammar.js'],
    allowedImports: ['../../foundingKind.js'],
    randomNamespaces: ['*|g'],
    statefulForkSites: 0 },
  { nodeId: 'S2', modules: ['groundRefusal.js', 'measure.js', 'relief.js', 'substrate.js', 'terraform.js'],
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
  { nodeId: 'S7', modules: ['routes.js', 'streetEdges.js', 'streets.js'],
    allowedImports: ['fabricGeometry.js', 'fabricRng.js', 'lineage.js', 'substrate.js', 'waterMode.js'],
    randomNamespaces: ['*|across', '*|approach|*', '*|bearing', '*|jit', '*|outlane|*', 'corridor.*', 'square.*', 'square.heart'],
    statefulForkSites: 6 },
  { nodeId: 'S10', modules: ['parcels.js'],
    allowedImports: ['fabricGeometry.js', 'fabricRng.js', 'groundRefusal.js', 'lineage.js', 'organismFields.js', 'substrate.js', 'tierGrammar.js'],
    randomNamespaces: ['*/pack', '*|a', '*|alley|*|*|*', '*|amp', '*|back', '*|backd', '*|d', '*|dwelling-guarantee', '*|g', '*|gap', '*|gapthru', '*|h', '*|l', '*|mat', '*|row|*', '*|s', '*|sb', '*|t', '*|t2', '*|w', '*|wing', '*|wingside', '*|w|*', '*|x', '*|y'],
    statefulForkSites: 1 },
  { nodeId: 'S11', modules: ['institutionShapes.js'],
    allowedImports: ['fabricGeometry.js', 'fabricRng.js', 'lineage.js', 'trigTable.js'],
    randomNamespaces: ['*|front|*'],
    statefulForkSites: 0 },
  // ⚠ ⟦§301.6⟧ `trigTable.js` IS NEW ON THIS NODE and the walker required the row. The terrain
  //   service's re-aimed search takes its eight bearings from the fabric's ONE home for an angle;
  //   the purity law forbids runtime trig outright, so a neighbourhood search cannot be spelled
  //   any other way. It is a PRIMITIVES edge S11 and S14 already carry — no new node pair.
  { nodeId: 'S13', modules: ['wallCircuit.js', 'wallRuns.js', 'walls.js'],
    allowedImports: ['builtUmbrella.js', 'epochAxis.js', 'fabricGeometry.js', 'fabricRng.js', 'groundRefusal.js', 'reservedGround.js', 'snapshot.js', 'substrate.js', 'trigTable.js'],
    randomNamespaces: ['wall.epoch.*', 'wall.epoch.*.*'],
    statefulForkSites: 2 },
  { nodeId: 'S14', modules: ['circuitDemotion.js'],
    allowedImports: ['fabricGeometry.js', 'fabricRng.js', 'groundRefusal.js', 'trigTable.js', 'wallCircuit.js'],
    randomNamespaces: ['wall.demote.*'],
    statefulForkSites: 1 },
  { nodeId: 'S15', modules: ['habitation.js'],
    allowedImports: ['commons.js', 'fabricGeometry.js', 'fabricRng.js', 'lineage.js', 'trigTable.js', 'waterMode.js'],
    randomNamespaces: ['*|d', '*|faub|*', '*|hab|*', '*|i', '*|keeper|*', '*|landing|*', '*|landing|*|*|a', '*|landing|*|*|r', '*|o', '*|s', '*|stead|*|a', '*|t', '*|tenure', '*|tone', '*|w'],
    statefulForkSites: 0 },
  { nodeId: 'S16', modules: ['institutions.js', 'seating.js'],
    allowedImports: ['fabricRng.js', 'lineage.js', 'organismFields.js', 'substrate.js', 'trigTable.js', 'waterMode.js', '../../../data/institutionAtlas.js', '../../../data/institutionLadders.js'],
    randomNamespaces: ['*|candr|*', '*|cand|*', '*|repairr|*', '*|repair|*', '*|rot', '*|success', '*|variant', 'seat.*'],
    statefulForkSites: 1 },
  { nodeId: 'S17', modules: ['waterWorks.js'],
    allowedImports: ['fabricGeometry.js', 'fabricRng.js', 'lineage.js', 'reservedGround.js', 'trigTable.js', 'waterMode.js'],
    randomNamespaces: ['*|watergate|*|*'],
    statefulForkSites: 0 },
  { nodeId: 'S18', modules: ['fields.js'],
    allowedImports: ['fabricGeometry.js', 'fabricRng.js', 'groundRefusal.js', 'substrate.js'],
    randomNamespaces: ['*|*|*|*', '*|*|t', '*|*|t2', '*|aj', '*|br|*', '*|cut|*', '*|gf|*|b', '*|gf|*|r', '*|gf|*|t', '*|n', '*|te*', '*|tone', '*|tr', '*|tr*', '*|trn', '*|tu*', '*|vx|*|*', '*|vy|*|*'],
    statefulForkSites: 0 },
  { nodeId: 'S19', modules: ['stateMarks.js'],
    allowedImports: ['fabricGeometry.js', 'fabricRng.js', '../../../data/stressTypes.js', '../../canonicalAccessors.js'],
    randomNamespaces: ['*|barricade', '*|camp|*|x', '*|camp|*|y', '*|siege|*'],
    statefulForkSites: 0 },
  { nodeId: 'S20', modules: ['accessLaw.js', 'compoundGround.js', 'groundLaw.js', 'lateGround.js'],
    allowedImports: ['fabricGeometry.js', 'groundRefusal.js', 'lineage.js', 'reservedGround.js'],
    randomNamespaces: [],
    statefulForkSites: 0 },
  { nodeId: 'S21', modules: ['leafCensus.js'],
    allowedImports: ['accessLaw.js', 'fabricGeometry.js', 'lineage.js', 'organismFields.js', 'reservedGround.js', 'wallCircuit.js', 'waterMode.js', 'waterWorks.js'],
    randomNamespaces: [],
    statefulForkSites: 0 },
  { nodeId: 'S22', modules: ['folioLenses.js', 'immersion.js'],
    allowedImports: ['fabricGeometry.js', 'fabricRng.js', 'measure.js'],
    randomNamespaces: ['*|*|road', '*|*|side', '*|field', '*|h', '*|keep', '*|w'],
    statefulForkSites: 0 },
  { nodeId: 'S23', modules: ['lettering.js'],
    allowedImports: ['fabricGeometry.js'],
    randomNamespaces: [],
    statefulForkSites: 0 },
  { nodeId: 'ASSEMBLY', modules: ['buildFabric.js', 'publication.js'],
    allowedImports: ['builtUmbrella.js', 'circuitDemotion.js', 'commons.js', 'compile.js', 'compoundGround.js', 'districtPartition.js', 'fabricGeometry.js', 'fabricRng.js', 'fields.js', 'groundLaw.js', 'groundRefusal.js', 'habitation.js', 'immersion.js', 'institutionShapes.js', 'institutions.js', 'lateGround.js', 'leafCensus.js', 'lineage.js', 'measure.js', 'morphology.js', 'organismFields.js', 'organisms.js', 'parcels.js', 'relief.js', 'reservedGround.js', 'routes.js', 'seating.js', 'snapshot.js', 'stateMarks.js', 'streetEdges.js', 'streets.js', 'substrate.js', 'suitability.js', 'terraform.js', 'tierGrammar.js', 'umbrella.js', 'wallCircuit.js', 'wallRuns.js', 'waterMode.js', 'waterWorks.js'],
    randomNamespaces: [],
    statefulForkSites: 0 },
  // ⚠ `.map((node) => Object.freeze(node))` rather than the sealed `.map(Object.freeze)`: the
  //   bare reference is handed `(value, index, array)` and erases the element type to
  //   `Readonly<unknown>` under `tsconfig.domain-strict.json`. Behaviour is identical — the two
  //   extra arguments were always ignored — and the arrow keeps the node shape typed.
].map((node) => Object.freeze(node)));

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
  'S4>ASSEMBLY', 'S4>S15', 'S4>S16', 'S4>S17', 'S4>S21', 'S4>S6', 'S4>S7', 'S5>S13', 'S5>S6',
  'S6>ASSEMBLY', 'S6>S10', 'S6>S13', 'S6>S15', 'S6>S16', 'S6>S2', 'S6>S21', 'S7>ASSEMBLY'
]);

/** The ABSENT §10.14 fields, named rather than stubbed. A consumer that needs one must build
 *  the artifact family first; a placeholder here would let a later lane read `ALWAYS_ACTIVE` as
 *  a decision somebody made. */
export const MANIFEST_ABSENT_FIELDS = Object.freeze(['lawManifestRef', 'coordinateAbiRef',
  'executableVocabularyRef', 'customParityFixtureRegistryRef', 'provenanceRef', 'contentHash',
  'gate', 'observationAcceptance', 'outputContracts', 'invalidationRoots', 'invariants']);

/** The manifest artifact itself. `coordinateAbiVersion` is the ONE field read from live code
 *  rather than from the record, which is what joins the published table to this tree's ABI. */
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
 *
 * ⛔⛔ **THE PORT PRESERVES THIS COMPONENT AND DOES NOT REPAIR IT.** Collapsing the two inversions
 * away is W4's generative-epoch work, not a port member's; a "cleanup" that deletes either
 * inversion, renames a member out of the roster or quietly empties `STAGE_GRAPH_SCC` reds against
 * an independently recomputed Tarjan run in the walker.
 *
 * @type {readonly { members: readonly string[], closedBy: readonly string[] }[]}
 */
export const STAGE_GRAPH_SCC = Object.freeze([
  Object.freeze({
    members: Object.freeze(['S13', 'S2', 'S3', 'S4', 'S6']),
    closedBy: Object.freeze(['S13>S6', 'S6>S2']),
  }),
]);

/** The edge set with the declared inversions removed — the acyclic core the order is taken over.
 *  @returns {string[]} */
export function acyclicEdges() {
  const cut = new Set(PUBLIC_ORDER_INVERSIONS.map((i) => i.edge));
  return NODE_EDGES.filter((e) => !cut.has(e));
}

/** Every module the manifest assigns, flat and sorted — the walker compares this to `readdir`.
 *  @returns {string[]} */
export function manifestModules() {
  /** @type {string[]} */
  const out = [];
  for (const n of GENERATION_NODES) for (const m of n.modules) out.push(m);
  return out.sort();
}

/** The node a module belongs to, or `null`.
 *  @param {string} moduleName @returns {string|null} */
export function nodeOfModule(moduleName) {
  for (const n of GENERATION_NODES) if (n.modules.includes(moduleName)) return n.nodeId;
  return null;
}

/** Public-stage index, with the two non-stage nodes pinned to the ends.
 *  @param {string} nodeId @returns {number} */
export function stageOrderIndex(nodeId) {
  if (nodeId === 'PRIMITIVES') return -1;
  if (nodeId === 'ASSEMBLY') return STAGE_IDS.length;
  // ⭐ THE FOUNDATIONS SIT AFTER THE ASSEMBLY BY CONSTRUCTION: they read what it published and
  // nothing reads them, so putting them anywhere earlier would invent a dependency.
  if (nodeId === FOUNDATION_NODE) return STAGE_IDS.length + 1;
  return STAGE_IDS.indexOf(nodeId);
}

/**
 * ⭐ THE UNIQUELY DERIVED TOPOLOGICAL ORDER (SPEC §10.14: *"`topologicalNodeIds` is the uniquely
 * derived stable topological order"*). Kahn's algorithm with a canonical tie-break by node id,
 * so the order is a pure function of the edge set and not of iteration order. Returns `null` on
 * a cycle rather than throwing, so the walker can report the cycle rather than crash on it.
 *
 * ⚠⚠ IT IS COMPUTED OVER THE EDGE SET MINUS THE TWO DECLARED INVERSIONS, AND THE REASON IS
 * `STAGE_GRAPH_SCC` ABOVE: the raw stage graph is NOT a DAG. Passing the raw set returns `null`,
 * which is the honest answer and is asserted as such by the walker.
 *
 * @param {readonly string[]} [edges] @returns {string[]|null}
 */
export function topologicalNodeIds(edges = acyclicEdges()) {
  const ids = GENERATION_NODES.map((n) => n.nodeId);
  /** @type {Map<string, number>} */
  const indeg = new Map(ids.map((i) => [i, 0]));
  /** @type {Map<string, string[]>} */
  const out = new Map(ids.map((i) => [i, /** @type {string[]} */ ([])]));
  for (const e of edges) {
    const [a, b] = e.split('>');
    const from = out.get(a);
    const degree = indeg.get(b);
    if (from === undefined || degree === undefined) continue;
    from.push(b);
    indeg.set(b, degree + 1);
  }
  // CANONICAL TIE-BREAK: the public stage index, so the derived order reads as the program's
  // own numbering wherever the dependencies leave it free. Deterministic either way; legible
  // only this way, and §10.14 asks for the order to be UNIQUE, which a total tie-break gives.
  /** @param {string} a @param {string} b @returns {number} */
  const rank = (a, b) => stageOrderIndex(a) - stageOrderIndex(b);
  const ready = ids.filter((i) => indeg.get(i) === 0).sort(rank);
  /** @type {string[]} */
  const order = [];
  while (ready.length) {
    const v = /** @type {string} */ (ready.shift());
    order.push(v);
    for (const w of (out.get(v) ?? []).slice().sort(rank)) {
      const degree = indeg.get(w);
      if (degree === undefined) continue;
      indeg.set(w, degree - 1);
      if (degree - 1 === 0) { ready.push(w); ready.sort(rank); }
    }
  }
  return order.length === ids.length ? order : null;
}

/** Every edge OUT of the foundations node — empty in the measured tree, forever.
 *  @returns {string[]} */
export function foundationOutboundEdges() {
  return NODE_EDGES.filter((e) => e.split('>')[0] === FOUNDATION_NODE).sort();
}

/** Every edge whose producer sits LATER in the public order than its consumer.
 *  @returns {string[]} */
export function backwardEdges() {
  /** @type {string[]} */
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
 *
 * @returns {{ namespace: string, nodes: string[] }[]}
 */
export function namespaceCollisions() {
  /** @type {Map<string, string>} */
  const owner = new Map();
  /** @type {Map<string, string[]>} */
  const clash = new Map();
  for (const n of GENERATION_NODES) {
    for (const ns of n.randomNamespaces) {
      const held = owner.get(ns);
      if (held !== undefined && held !== n.nodeId) {
        if (!clash.has(ns)) clash.set(ns, [held]);
        (clash.get(ns) ?? []).push(n.nodeId);
      } else owner.set(ns, n.nodeId);
    }
  }
  return [...clash.entries()].map(([ns, nodes]) => ({ namespace: ns, nodes: nodes.sort() }))
    .sort((x, y) => (x.namespace < y.namespace ? -1 : 1));
}
