/**
 * townCartography/cartographySynthesis.js — THE S-CARTO RUNNER (design §4).
 *
 * The staged, pure, seeded skeleton synthesis: field, then arterials, then lanes,
 * then walls/gates/bridges. TC-2's whole surface is this one entry point plus the
 * leaves it composes.
 *
 * ── ONE NAMED FORK FAMILY, EVERY DRAW ACCOUNTED ──────────────────────────────
 * The root is the manifest's own `mapModelDigest` — a pure fingerprint of the
 * projected settlement that the compiler already computes. No seed carrier crosses
 * this boundary (`seed`, `_seed` and `rngSeed` are FORBIDDEN_MANIFEST_KEYS, and a
 * synthesis that took a raw seed would be the first place one leaked).
 *
 * Stage substreams are `carto:field`, `carto:arterials`, `carto:lanes` and
 * `carto:defenses` — ONE family, spelled with a single colon. That spelling is
 * load-bearing: `fork('a::b')` derives the same seed string as `fork('a').fork('b')`
 * (kernel/prng.js's delimiter contract), so a family that embedded the delimiter
 * could silently alias a fork chain. These never do.
 *
 * Every stage receives a COUNTED stream and the run returns its exact per-stage
 * draw counts. That is not decoration: a per-tick keyed fork hides STREAM THEFT,
 * where one stage quietly consumes another's entropy and both lanes shift the day
 * anyone reorders a loop. A frozen draw count makes the theft a red test rather
 * than a mystery. `carto:defenses` is expected to draw EXACTLY ZERO — the hull and
 * the segment intersections are exact — and the pin asserts that zero, so the day
 * a future edit reaches for entropy in the defenses stage, it is visible.
 *
 * ── WHAT THIS DOES NOT OWN ───────────────────────────────────────────────────
 * TC-1 owns the manifest schema, and the existing TownSceneManifest owns walls,
 * gates and bridges. The skeleton result below retains its exact intersection
 * receipts for the TC-2 geometry corpus, but `compileTownCartography` is the ONLY
 * adapter allowed to cross into the manifest. It projects arterials and lanes into
 * TC-1's canonical street records and references the manifest's existing gates and
 * bridges by id. It never copies infrastructure geometry into the cartography
 * block, so the manifest remains the single settlement truth.
 *
 * Purity: no store, no clock, no party, no module-scope mutable state. Nothing in
 * the cartography package reads `Date`, `Math.random` or `globalThis`, and a
 * structural scan pins that — a double-pass behavioural check alone is blind to
 * parity-period state (a module-scope counter that alternates would pass "run it
 * twice" and still fork the world on the third call).
 *
 * @enforced-by tests/domain/townCartographySkeleton.test.js
 * @enforced-by tests/domain/townCartographyDeterminism.test.js
 */

import { createPRNG } from '../../kernel/prng.js';
import { TOWN_CARTOGRAPHY_SCHEMA_VERSION } from '../townScene/cartographyContract.js';
import { sceneDigest, stableSceneStringify } from '../townScene/stableScene.js';
import { buildCartographyField } from './cartographyField.js';
import {
  buildBridges,
  buildGates,
  buildWalls,
} from './cartographyDefenses.js';
import { readTownMorphology } from './cartographyMorphology.js';
import { growArterials, growLanes } from './cartographySkeleton.js';
import {
  TOWN_CARTOGRAPHY_TUNING,
  cartographyBand,
  cartographyTierIndex,
  CARTOGRAPHY_TIERS,
  maximumSynthesisWork,
} from './cartographyTuning.js';

const T = TOWN_CARTOGRAPHY_TUNING;

/**
 * @typedef {{ unit: () => number, draws: number }} CountedStream
 */

/**
 * A stage substream that counts its own draws. Created per call, so the counter is
 * function-scoped and can never become the module-scope mutable state the purity
 * scan exists to forbid.
 *
 * @param {ReturnType<typeof createPRNG>} root
 * @param {string} label a `carto:*` label; never spells the reserved `::`
 * @returns {CountedStream}
 */
function countedStream(root, label) {
  const rng = root.fork(label);
  /** @type {CountedStream} */
  const stream = {
    draws: 0,
    unit: () => {
      stream.draws += 1;
      return rng.random();
    },
  };
  return stream;
}

/** UTF-8 byte length of the stable serialization (A-3's measurement).
 *  @param {unknown} value @returns {number} */
function stableByteLength(value) {
  return new TextEncoder().encode(stableSceneStringify(value)).byteLength;
}

/**
 * @typedef {object} TownSkeletonSynthesis
 * @property {{ arterials: import('./cartographySkeleton.js').CartographyStreet[],
 *              lanes: import('./cartographySkeleton.js').CartographyStreet[] }} streets
 * @property {{ walls: import('./cartographyDefenses.js').CartographyWall[],
 *              gates: import('./cartographyDefenses.js').CartographyGate[],
 *              bridges: import('./cartographyDefenses.js').CartographyBridge[] }} infrastructureCandidates
 * @property {import('./cartographyMorphology.js').MorphologyReading} morphology
 * @property {{ tier: string }} receipts the determinism and bounded-work evidence
 */

/**
 * SYNTHESIZE THE SKELETON.
 *
 * @param {object} input
 * @param {unknown} input.terrain the compiled scene terrain layer (the raster)
 * @param {unknown} input.roads the compiled scene roads (boundary conditions)
 * @param {unknown} input.settlement the audience-projected settlement
 * @param {string} input.digest the manifest's mapModelDigest
 * @returns {TownSkeletonSynthesis}
 */
export function synthesizeTownSkeleton(input) {
  const morphology = readTownMorphology(input.settlement);
  const tier = CARTOGRAPHY_TIERS[cartographyTierIndex(
    /** @type {{ tier?: unknown }} */ (input.settlement || {}).tier,
  )];
  const root = createPRNG(String(input.digest || ''));
  const fieldStream = countedStream(root, 'carto:field');
  const arterialStream = countedStream(root, 'carto:arterials');
  const laneStream = countedStream(root, 'carto:lanes');
  const defenseStream = countedStream(root, 'carto:defenses');

  const field = buildCartographyField({
    terrain: input.terrain,
    roads: input.roads,
    morphology,
    tier,
    stream: fieldStream,
  });
  const arterials = growArterials(field, morphology, arterialStream);
  const lanes = growLanes(field, arterials.streets, morphology, tier, laneStream);
  const walls = buildWalls(lanes.streets, field.core, morphology);
  const gates = buildGates(arterials.streets, walls);
  const bridges = buildBridges(
    arterials.streets.concat(lanes.streets),
    field.waterPaths,
  );

  const streets = {
    arterials: arterials.streets,
    lanes: lanes.streets,
  };
  // These are geometric WITNESSES, not manifest facts. TC-2 uses them to bind the
  // street web to nearby gates and bridges the base manifest already owns. Keeping
  // them outside `streets` prevents a caller from mistaking provisional crossings
  // for the canonical infrastructure records.
  const infrastructureCandidates = {
    walls,
    gates: gates.gates,
    bridges: bridges.bridges,
  };
  const defenseWork = gates.work + bridges.work;
  const totalWork = field.work + arterials.work + lanes.work + defenseWork;
  const cellCount = field.gridSize * field.gridSize;

  return {
    streets,
    infrastructureCandidates,
    morphology,
    receipts: Object.freeze({
      tier,
      gridSize: field.gridSize,
      // THE DRAW LEDGER. Frozen by the pins; a stage that starts consuming another
      // stage's entropy moves a number here before it moves any geometry.
      draws: Object.freeze({
        field: fieldStream.draws,
        arterials: arterialStream.draws,
        lanes: laneStream.draws,
        defenses: defenseStream.draws,
      }),
      // THE WORK LEDGER, against the declared budget. `withinBudget` is the
      // iteration contract of design §7 stated as a boolean the caller can trust.
      work: Object.freeze({
        field: field.work,
        arterials: arterials.work,
        lanes: lanes.work,
        defenses: defenseWork,
        total: totalWork,
      }),
      workBudget: maximumSynthesisWork(tier, cellCount),
      withinBudget: totalWork <= maximumSynthesisWork(tier, cellCount),
      laneIterations: lanes.iterations,
      laneIterationCap: T.LANE_ITERATIONS,
      laneNodeCap: cartographyBand(T.LANE_NODES, tier),
      // A-3: the per-tier byte budget for the new layer, measured here.
      bytes: stableByteLength({ streets, infrastructureCandidates }),
      byteBudget: cartographyBand(T.STREETS_LAYER_MAX_BYTES, tier),
      // The determinism corpus row: one stable digest per (settlement, seed).
      skeletonDigest: sceneDigest({ streets, infrastructureCandidates }),
    }),
  };
}

/** @param {unknown} value @returns {Record<string, unknown>} */
function record(value) {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? /** @type {Record<string, unknown>} */ (value)
    : {};
}

/**
 * Narrow an untrusted manifest coordinate pair into the exact integer tuple the
 * infrastructure binder consumes. Keeping the guard here prevents a permissive
 * array check from leaving `unknown` coordinates inside the distance arithmetic.
 * @param {unknown} value
 * @returns {[number, number] | null}
 */
function integerPlanPoint(value) {
  if (!Array.isArray(value) || value.length !== 2) return null;
  const x = value[0];
  const z = value[1];
  if (typeof x !== 'number' || typeof z !== 'number') return null;
  if (!Number.isInteger(x) || !Number.isInteger(z)) return null;
  return [x, z];
}

/**
 * Bind TC-2's geometric defense candidates to infrastructure records the base
 * manifest already owns. A candidate outside the authored radius selects nothing;
 * a tie resolves by canonical id. The return value is ids only, so candidate
 * geometry can influence the canonical cartography block without becoming a
 * second wall/gate/bridge truth.
 *
 * @param {unknown} candidates TC-2 candidate rows carrying `position`
 * @param {unknown} canonicalRows base-manifest rows carrying `id` + `position`
 * @returns {string[]}
 */
export function bindCanonicalInfrastructureRefs(candidates, canonicalRows) {
  /** @type {Array<{ id: string, position: [number, number] }>} */
  const canonical = [];
  for (const raw of Array.isArray(canonicalRows) ? canonicalRows : []) {
    const row = record(raw);
    const position = integerPlanPoint(row.position);
    if (typeof row.id === 'string' && position) canonical.push({ id: row.id, position });
  }
  canonical.sort((left, right) => (left.id < right.id ? -1 : left.id > right.id ? 1 : 0));

  /** @type {Array<{ position: [number, number] }>} */
  const witnessRows = [];
  for (const raw of Array.isArray(candidates) ? candidates : []) {
    const position = integerPlanPoint(record(raw).position);
    if (position) witnessRows.push({ position });
  }
  const maximumDistanceSq = T.INFRASTRUCTURE_BINDING_PLAN
    * T.INFRASTRUCTURE_BINDING_PLAN;
  /** @type {Set<string>} */
  const ids = new Set();
  for (const witness of witnessRows) {
    /** @type {{ id: string, position: [number, number] } | null} */
    let chosen = null;
    let chosenDistance = Number.POSITIVE_INFINITY;
    for (const row of canonical) {
      const dx = witness.position[0] - row.position[0];
      const dz = witness.position[1] - row.position[1];
      const distance = dx * dx + dz * dz;
      if (distance > maximumDistanceSq || distance >= chosenDistance) continue;
      chosen = row;
      chosenDistance = distance;
    }
    if (chosen) ids.add(chosen.id);
  }
  return [...ids].sort();
}

/**
 * Project TC-2's working street record into TC-1's manifest record. Keeping this
 * adapter at the compiler boundary lets the growth algorithms use the vocabulary
 * natural to their work while ensuring no provisional shape crosses the contract.
 *
 * @param {import('./cartographySkeleton.js').CartographyStreet} street
 * @param {'arterial'|'lane'} classKind
 * @param {string} tier
 */
function manifestStreet(street, classKind, tier) {
  return {
    id: street.id,
    classKind,
    polyline: street.centerline,
    widthPlan: cartographyBand(
      classKind === 'arterial' ? T.ARTERIAL_WIDTH_PLAN : T.LANE_WIDTH_PLAN,
      tier,
    ),
    provenance: { kind: 'generated', ref: null },
    // A-10: the Lynch grammar decides the primary paths; Watabou/FTG feel decides
    // the lane grain. Colour never enters either geometry record.
    decidedBy: classKind === 'arterial' ? 'lynch' : 'feel',
  };
}

/**
 * Compile the TC-2 slice into the additive TC-1 block.
 *
 * THE ONE-LAW API takes the already-compiled base manifest, not parallel terrain,
 * road, wall, gate or bridge arguments. That makes it impossible for a caller to
 * synthesize against one town and attach the result to another. Walls remain the
 * base manifest's `walls`; gates and bridges remain its records and are referenced
 * by id. TC-3 and TC-4 fill the three deliberately empty future layers.
 *
 * @param {Record<string, unknown>} manifest the current base TownSceneManifest
 * @param {unknown} settlement the already audience-projected compiler settlement
 * @returns {Record<string, unknown>}
 */
export function compileTownCartography(manifest, settlement) {
  const base = record(manifest);
  const source = record(base.source);
  const synthesis = synthesizeTownSkeleton({
    terrain: base.terrain,
    roads: base.roads,
    settlement,
    digest: typeof source.mapModelDigest === 'string'
      ? source.mapModelDigest
      : sceneDigest(base),
  });
  const tier = synthesis.receipts.tier;
  const wallIds = new Set(
    (Array.isArray(base.walls) ? base.walls : [])
      .map((row) => record(row).id)
      .filter((id) => typeof id === 'string'),
  );
  // A canonical gate whose wall is absent is already invalid at the manifest
  // level; filtering here makes the cartography binding fail closed even if this
  // adapter is exercised in isolation against an unvalidated fixture.
  const canonicalGates = (Array.isArray(base.gates) ? base.gates : [])
    .filter((row) => {
      const wallId = record(row).wallId;
      return typeof wallId === 'string' && wallIds.has(wallId);
    });
  /** @param {{ id?: unknown }} a @param {{ id?: unknown }} b */
  const byId = (a, b) => {
    const left = String(a.id);
    const right = String(b.id);
    return left < right ? -1 : left > right ? 1 : 0;
  };

  return {
    schemaVersion: TOWN_CARTOGRAPHY_SCHEMA_VERSION,
    streets: {
      arterials: synthesis.streets.arterials
        .map((street) => manifestStreet(street, 'arterial', tier))
        .sort(byId),
      lanes: synthesis.streets.lanes
        .map((street) => manifestStreet(street, 'lane', tier))
        .sort(byId),
      gateRefs: bindCanonicalInfrastructureRefs(
        synthesis.infrastructureCandidates.gates,
        canonicalGates,
      ),
      bridgeRefs: bindCanonicalInfrastructureRefs(
        synthesis.infrastructureCandidates.bridges,
        base.bridges,
      ),
    },
    wards: [],
    parcels: [],
    buildings: [],
  };
}
