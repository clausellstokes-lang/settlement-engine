/**
 * domain/townMap/townMapModel.js — the deterministic town-map render model.
 *
 * `buildTownMapModel(settlement, mapEdits)` is a PURE, view-time projection of the
 * dossier (the settlement object). It composes the existing derivations
 * (deriveAllDistricts, deriveMapProfile, resolveTerrain, defenseProfileHasWalls,
 * deriveAllActiveConditions, popToTier) and synthesizes vector GEOMETRY in a
 * normalized 0..1000 × 0..1000 coordinate space — numbers only, no rendering, no
 * <image>. The map persists NOTHING onto the settlement, so same-seed byte
 * identity of the generator golden is untouched; this model is derived only when
 * a viewer asks for it.
 *
 * DETERMINISM — the hard contract:
 *   • The rng is derived INTERNALLY from the settlement seed (never ambient), so
 *     the same (settlement, mapEdits) is a pure function → byte-identical
 *     JSON.stringify across runs and machines.
 *   • Geometry uses ONLY the correctly-rounded IEEE ops (+ - * / round/min/max) and
 *     a hardcoded INTEGER direction table — never Math.cos/sin/trig, whose last-ULP
 *     results are NOT guaranteed identical across platforms. That keeps the golden
 *     hash cross-machine stable.
 *   • Every iteration that lands in output or feeds an rng draw is codepoint-sorted
 *     first; output objects are built with a fixed key insertion order.
 *   • Absent mapEdits / layoutVariant 0 ⇒ the base fork key ⇒ byte-identical to no
 *     edits at all (the dormancy law at the model level).
 *
 * Purity-banned by construction (eslint determinism guard + a source-scan pin):
 * no Date, no Math.random, no localeCompare. Any-cast baseline 0.
 */

import { createPRNG } from '../../kernel/prng.js';
import { clamp } from '../../kernel/math.js';
import { compareCodepoint } from '../deterministicSort.js';
import { deriveAllDistricts } from '../districtProfile.js';
import { deriveMapProfile } from '../mapProfile.js';
import { resolveTerrain } from '../resolveTerrain.js';
import { defenseProfileHasWalls } from '../causalState.js';
import { deriveAllActiveConditions } from '../activeConditions.js';
import { popToTier, TIER_ORDER } from '../../data/constants.js';
import { anchorForInstitution, anchorForDistrict } from './anchors.js';
import { assignInstitutionsToDistricts } from './institutionAssignment.js';
import { buildTownLayoutV2 } from './townLayoutV2.js';

/** @typedef {ReturnType<typeof createPRNG>} Rng */

// ── Version axes (stamped into every model; a bump is a declared, not silent,
//    geometry/overlay change — the spatialDigest exemplar) ────────────────────
export const TOWN_MAP_GEOMETRY_VERSION = 1;
export const LAYOUT_LAW_VERSION = 1;
export const TOWN_MAP_OVERLAY_VERSION = 1;

// The normalized viewBox and the usable placement extent from its center.
const VIEW = 1000;
const CENTER = 500;
const EXTENT = 420;

/**
 * Sixteen integer unit directions (cos/sin of 22.5° multiples ×100, rounded to
 * fixed literals). Used for all radial placement so no runtime trig is needed —
 * the constants are computed once, HERE, by hand, not by the engine at run time.
 * @type {ReadonlyArray<readonly [number, number]>}
 */
const COMPASS = Object.freeze([
  [0, -100], [38, -92], [71, -71], [92, -38],
  [100, 0], [92, 38], [71, 71], [38, 92],
  [0, 100], [-38, 92], [-71, 71], [-92, 38],
  [-100, 0], [-92, -38], [-71, -71], [-38, -92],
]);

/**
 * District-category placement priors: `ring` is the radius as a percent of
 * EXTENT (central → peripheral), `dir` is the base COMPASS index (the category's
 * quarter of the compass). Honors the quarters' own prose: civic/noble central,
 * criminal/industrial peripheral, waterfront categories pulled to the water.
 * @type {Readonly<Record<string, { ring: number, dir: number }>>}
 */
const CATEGORY_PLACEMENT = Object.freeze({
  civic:       { ring: 12, dir: 0 },
  noble:       { ring: 24, dir: 2 },
  merchant:    { ring: 30, dir: 6 },
  religious:   { ring: 30, dir: 4 },
  arcane:      { ring: 38, dir: 10 },
  craft:       { ring: 42, dir: 12 },
  residential: { ring: 50, dir: 8 },
  foreign:     { ring: 62, dir: 5 },
  military:    { ring: 60, dir: 14 },
  criminal:    { ring: 72, dir: 9 },
  industrial:  { ring: 75, dir: 13 },
  other:       { ring: 48, dir: 8 },
});

/** Categories that hug the water when the settlement has any. */
const WATERFRONT = Object.freeze(new Set(['industrial', 'foreign', 'merchant']));

/** roadImportance band → integer stroke weight. */
const ROAD_WEIGHT = Object.freeze({ low: 1, moderate: 2, major: 3, critical: 4 });

/** defensiveTerrain band → wall weight (readiness styles the wall, not a stroke). */
const DEFENSIVE_BANDS = Object.freeze(['exposed', 'open', 'mixed', 'sheltered', 'fortified']);

/** Aggregate (district-fill at city+) categories: lodging / mass residential. */
const AGGREGATE_RE = /lodging|residential|tenement|housing|hostel|dormitor|boarding|slum|almshouse|\binn\b|\btavern/i;

// ── Input shapes ────────────────────────────────────────────────────────────
/**
 * @typedef {Object} TownInstitution
 * @property {string} [name]
 * @property {string} [catalogId]
 * @property {string} [localUid]
 * @property {string} [priorityCategory]
 * @property {string} [category]
 * @property {string[]} [tags]
 * @property {string} [id]
 */

/**
 * @typedef {Object} TownMapPin
 * @property {string} anchor   the building/district anchorKey to nudge
 * @property {number} [dx]     horizontal nudge in view units
 * @property {number} [dy]     vertical nudge in view units
 */

/**
 * @typedef {Object} TownMapEdits
 * @property {number} [layoutVariant]  integer salt for a deterministic reroll (0/absent ⇒ base)
 * @property {TownMapPin[]} [pins]     anchor-keyed position nudges
 * @property {Record<string, unknown>} [legendPrefs]  reserved for SM-3 legend prefs
 * @property {string} [styleLens]      the chosen map lens (MAP STYLES)
 * @property {number} [layoutLawVersion]  1 (v1, dormant default) | 2 (v2 semantic engine)
 */

/**
 * The settlement view this model reads. Declared as the intersection of the
 * existing derivations' own settlement shapes plus the seed/tier/edits fields, so
 * every composed derive() call is exactly-typed with zero any-casts.
 * @typedef {import('../mapProfile.js').MapSettlement
 *   & import('../districtProfile.js').DistrictSettlement
 *   & { _seed?: string|number|null, tier?: string|null, population?: number|null,
 *       mapEdits?: TownMapEdits|null }} TownMapSettlement
 */

// ── Output shapes ───────────────────────────────────────────────────────────
/** @typedef {{ x: number, y: number }} Point */

/**
 * @typedef {Object} TownMapDistrict
 * @property {string} id
 * @property {string} name
 * @property {string} category
 * @property {string} anchorKey
 * @property {boolean} synthetic          true for the quarter-less hamlet-cluster floor
 * @property {Array<[number, number]>} polygon
 * @property {Point} centroid
 * @property {string} wealth
 * @property {string} safety
 */

/**
 * @typedef {Object} TownMapBuilding
 * @property {string} anchorKey
 * @property {string} name
 * @property {string|null} catalogId
 * @property {string|null} localUid
 * @property {string} districtId
 * @property {'landmark'|'fill'} kind
 * @property {Point} position
 */

/**
 * @typedef {Object} TownMapRoad
 * @property {string} id
 * @property {[number, number]} from
 * @property {[number, number]} to
 * @property {number} weight
 */

/**
 * @typedef {Object} TownMapWater
 * @property {'coast'|'river'} kind
 * @property {Array<[number, number]>} path
 */

/**
 * @typedef {Object} TownMapFortifications
 * @property {Array<[number, number]>} walls
 * @property {Point[]} gates
 * @property {string} readiness
 * @property {number} wallWeight
 */

/**
 * @typedef {Object} TownMapHazard
 * @property {string} id
 * @property {string} label
 * @property {string} kind
 * @property {number} severity
 * @property {string} severityBand
 * @property {string} visibility
 * @property {Point} position
 */

/**
 * @typedef {Object} TownMapConditionBadge
 * @property {string} id
 * @property {string} archetype
 * @property {string} label
 * @property {number} severity
 * @property {string} severityBand
 * @property {string|null} districtId
 */

/**
 * @typedef {Object} TownMapModel
 * @property {number} townMapGeometryVersion
 * @property {number} layoutLawVersion
 * @property {number} overlayVersion
 * @property {{ tier: string, terrain: string|null, tradeAccess: string|null,
 *   hasWalls: boolean, layoutVariant: number, buildingCount: number,
 *   districtCount: number, hamletCluster: boolean, morphology?: string,
 *   hasFabric?: boolean, lynchScore?: number, lynchParts?: Record<string, number>,
 *   retries?: number, deformedElementCount?: number, siteKind?: string,
 *   responseMode?: string, coreNucleated?: boolean }} meta
 * @property {{ water: TownMapWater|null, roads: TownMapRoad[], landform?: import('./siteGenesis.js').TownLandform }} frame
 * @property {{ anchor: { x: number, y: number, kind: string }, pattern: string,
 *   streets: Array<{ from: Point, to: Point }> }} skeleton
 * @property {TownMapDistrict[]} districts
 * @property {TownMapBuilding[]} buildings
 * @property {TownMapFortifications|null} fortifications
 * @property {{ hazards: TownMapHazard[], conditions: TownMapConditionBadge[] }} overlays
 * @property {Record<string, Array<{ sourceFamily: string, sourceRef: string, effect: string }>>} [provenance]
 * @property {Array<{ attractorRef: string, declinedBy: string, latentValue01: number, point: { x: number, y: number } }>} [latentAdvantages]
 * @property {{ scarHistory: null, thumbnail: null, pdfPlate: null }} reserved
 */

// ── small deterministic numeric helpers ─────────────────────────────────────
// `clamp` is imported from the kernel primitive (src/kernel/math.js) — the one
// sanctioned clamp (code-quality-4). Every call here passes finite values with
// lo ≤ hi, where the kernel policy is byte-identical to a bare ternary clamp.

/** Offset from center by a compass direction, `ringPct` percent of EXTENT.
 * @param {readonly [number, number]} dir @param {number} ringPct @returns {[number, number]} */
function ringPoint(dir, ringPct) {
  return [
    CENTER + Math.round((dir[0] * ringPct * EXTENT) / 10000),
    CENTER + Math.round((dir[1] * ringPct * EXTENT) / 10000),
  ];
}

/** Reserved-null slots (declared-not-silent; future waves light them). */
function reservedSlots() {
  return { scarHistory: null, thumbnail: null, pdfPlate: null };
}

/**
 * Build the deterministic town-map render model. Pure function of its inputs;
 * never mutates them.
 * @param {TownMapSettlement | null | undefined} settlement
 * @param {TownMapEdits | null | undefined} [mapEdits]
 * @returns {TownMapModel}
 */
export function buildTownMapModel(settlement, mapEdits = null) {
  const s = settlement || /** @type {TownMapSettlement} */ ({});

  // ── VERSIONING LAW (task #38) ───────────────────────────────────────────────
  // An explicit `mapEdits.layoutLawVersion === 2` selects the v2 semantic urban-
  // planning engine (a SIBLING generation in townLayoutV2.js that emits this exact
  // TownMapModel shape, so every lens / export / hover / pin inherits it). Absent /
  // 1 / anything-else renders the v1 path BELOW, byte-for-byte unchanged — so every
  // pre-v2 settlement and every v1 golden stays identical (the lane lands free). New
  // settlements mint v2 by carrying the marker; existing ones never do.
  if (mapEdits && Number(mapEdits.layoutLawVersion) === 2) {
    return buildTownLayoutV2(/** @type {import('./townLayoutV2.js').TownV2Settlement} */ (s), mapEdits);
  }

  // ── rng, derived internally (never ambient). layoutVariant salts the fork; a
  //    variant of 0 / absent yields the base key ⇒ byte-identical to no edits. ──
  const variant = Number.isInteger(mapEdits?.layoutVariant) && Number(mapEdits?.layoutVariant) > 0
    ? Number(mapEdits?.layoutVariant)
    : 0;
  const seed = s._seed ?? s.id ?? 'town-map-seedless';
  const forkKey = variant ? `${seed}::town-map:v1::variant:${variant}` : `${seed}::town-map:v1`;
  const rng = createPRNG(forkKey);
  const assignRng = rng.fork('assign');
  const geometryRng = rng.fork('geometry');

  // ── composed derivations (all pure reads) ──────────────────────────────────
  const derivedDistricts = deriveAllDistricts(s);
  const mapProfile = deriveMapProfile(s);
  const terrain = resolveTerrain(s.config);
  const tradeAccess = typeof s.config?.tradeRouteAccess === 'string' ? s.config.tradeRouteAccess : null;
  const hasWalls = defenseProfileHasWalls(s.defenseProfile);
  const activeConditions = deriveAllActiveConditions(s);

  const tier = typeof s.tier === 'string' && TIER_ORDER.indexOf(s.tier) >= 0
    ? s.tier
    : popToTier(typeof s.population === 'number' ? s.population : 0);
  const tierIndex = Math.max(0, TIER_ORDER.indexOf(tier));

  /** @type {TownInstitution[]} */
  const institutions = Array.isArray(s.institutions) ? s.institutions : [];

  // ── total institution→district assignment ──────────────────────────────────
  const assignment = assignInstitutionsToDistricts(institutions, derivedDistricts, assignRng);

  // ── geometry district descriptors (real districts, or the synthetic floor) ──
  /** @type {Array<{ id: string, name: string, category: string, wealth: string, safety: string, synthetic: boolean }>} */
  let geomSources;
  if (assignment.floored && assignment.syntheticDistrict) {
    geomSources = [{
      id: assignment.syntheticDistrict.id,
      name: assignment.syntheticDistrict.name,
      category: assignment.syntheticDistrict.category,
      wealth: 'modest',
      safety: 'watched',
      synthetic: true,
    }];
  } else {
    geomSources = derivedDistricts.map((d) => ({
      id: d.id,
      name: d.name,
      category: typeof d.category === 'string' ? d.category : 'other',
      wealth: d.wealth,
      safety: d.safety,
      synthetic: false,
    }));
  }
  geomSources.sort((a, b) => compareCodepoint(a.id, b.id));

  // ── (1) Frame — terrain edge + approach roads by trade class ────────────────
  const isCoast = tradeAccess === 'port' || tradeAccess === 'coastal' || terrain === 'coastal';
  const isRiver = terrain === 'riverside' || tradeAccess === 'river';
  /** @type {TownMapWater|null} */
  let water = null;
  /** @type {Point|null} */
  let waterAnchor = null;
  if (isCoast) {
    water = { kind: 'coast', path: [[0, 840], [1000, 840]] };
    waterAnchor = { x: 500, y: 880 };
  } else if (isRiver) {
    water = { kind: 'river', path: [[0, 300], [330, 470], [670, 540], [1000, 720]] };
    waterAnchor = { x: 500, y: 620 };
  }

  const roadCount = tradeAccess === 'crossroads' ? 4
    : (tradeAccess === 'port' || tradeAccess === 'road') ? 3
      : tradeAccess === 'isolated' ? 1 : 2;
  const roadWeight = ROAD_WEIGHT[/** @type {'low'|'moderate'|'major'|'critical'} */ (mapProfile.outputs.roadImportance)] ?? 2;
  /** @type {number[]} */
  const roadDirIdx = [];
  for (let i = 0; i < roadCount; i++) roadDirIdx.push((Math.round((i * 16) / roadCount) + 1) % 16);
  /** @type {TownMapRoad[]} */
  const roads = roadDirIdx.map((di, i) => {
    const dir = COMPASS[di];
    return {
      id: `road.${i}`,
      from: [CENTER + dir[0] * 5, CENTER + dir[1] * 5],
      to: [CENTER, CENTER],
      weight: roadWeight,
    };
  });

  // ── (2) Skeleton — anchor + pattern ─────────────────────────────────────────
  const anchorKind = tradeAccess === 'crossroads' ? 'crossroads'
    : isCoast ? 'water-gate'
      : 'market-square';
  const anchorPos = isCoast ? { x: 500, y: 760 } : { x: 500, y: 500 };
  const skeleton = {
    anchor: { x: anchorPos.x, y: anchorPos.y, kind: anchorKind },
    pattern: tierIndex >= 4 ? 'grid' : 'radial',
    streets: roads.map((r) => ({ from: { x: anchorPos.x, y: anchorPos.y }, to: { x: r.from[0], y: r.from[1] } })),
  };

  // ── (3) Districts — one polygon per district, category-primed placement ─────
  const N = geomSources.length;
  const size = clamp(Math.round(240 - N * 12), 70, 200);
  const halfH = Math.round(size * 0.8);
  /** @type {TownMapDistrict[]} */
  const districts = geomSources.map((src, i) => {
    const place = CATEGORY_PLACEMENT[src.category] || CATEGORY_PLACEMENT.other;
    const dirIndex = (place.dir + i * 3) % 16;
    const base = ringPoint(COMPASS[dirIndex], place.ring);
    let cx = base[0];
    let cy = base[1];
    // Waterfront categories are pulled 40% toward the water.
    if (waterAnchor && WATERFRONT.has(src.category)) {
      cx = Math.round((cx * 6 + waterAnchor.x * 4) / 10);
      cy = Math.round((cy * 6 + waterAnchor.y * 4) / 10);
    }
    const djit = geometryRng.fork(`district:${src.id}`);
    cx = clamp(cx + djit.randInt(-16, 16), 60, VIEW - 60);
    cy = clamp(cy + djit.randInt(-16, 16), 60, VIEW - 60);
    /** @type {Array<[number, number]>} */
    const corners = [[-size, -halfH], [size, -halfH], [size, halfH], [-size, halfH]];
    /** @type {Array<[number, number]>} */
    const polygon = corners.map(([ox, oy]) => [
      clamp(cx + ox + djit.randInt(-18, 18), 0, VIEW),
      clamp(cy + oy + djit.randInt(-18, 18), 0, VIEW),
    ]);
    return {
      id: src.id,
      name: src.name,
      category: src.category,
      anchorKey: anchorForDistrict(src),
      synthetic: src.synthetic,
      polygon,
      centroid: { x: cx, y: cy },
      wealth: src.wealth,
      safety: src.safety,
    };
  });
  const districtByIdGeom = new Map(districts.map((d) => [d.id, d]));

  // ── (4) Buildings — EVERY institution placed via the total assigner ─────────
  // Re-anchor the roster with the SAME comparator the assigner used, so index i of
  // this list lines up with assignment.placements[i]: both are the same roster
  // mapped through anchorForInstitution and stably sorted by compareCodepoint, so
  // placement i belongs to institution i. Reading the district POSITIONALLY (not via
  // an anchorKey→districtId map) is what keeps two institutions that share a fallback
  // name-slug anchor (no catalogId/localUid) in their OWN assigned districts — an
  // anchorKey-keyed map would collapse the collision (last-wins) and mis-home one.
  const anchored = institutions.map((inst) => ({ anchorKey: anchorForInstitution(inst), inst }));
  anchored.sort((a, b) => compareCodepoint(a.anchorKey, b.anchorKey));
  /** @type {Record<string, number>} */
  const perDistrictSeen = {};
  const cityPlus = tierIndex >= 4;
  /** @type {TownMapBuilding[]} */
  const buildings = anchored.map(({ anchorKey, inst }, i) => {
    const districtId = assignment.placements[i]?.districtId ?? (districts[0]?.id ?? '');
    const geom = districtByIdGeom.get(districtId);
    const centroid = geom ? geom.centroid : { x: CENTER, y: CENTER };
    const j = perDistrictSeen[districtId] ?? 0;
    perDistrictSeen[districtId] = j + 1;
    const dir = COMPASS[(j * 5) % 16];
    const r = Math.round(size * 0.55);
    const bjit = geometryRng.fork(`building:${anchorKey}`);
    const bx = clamp(centroid.x + Math.round((dir[0] * r) / 100) + bjit.randInt(-10, 10), 0, VIEW);
    const by = clamp(centroid.y + Math.round((dir[1] * r) / 100) + bjit.randInt(-10, 10), 0, VIEW);
    const haystack = `${inst?.name || ''} ${inst?.priorityCategory || ''} ${inst?.category || ''} ${(inst?.tags || []).join(' ')}`;
    const aggregate = AGGREGATE_RE.test(haystack);
    /** @type {'landmark'|'fill'} */
    const kind = aggregate && cityPlus ? 'fill' : 'landmark';
    return {
      anchorKey,
      name: typeof inst?.name === 'string' ? inst.name : '',
      catalogId: typeof inst?.catalogId === 'string' ? inst.catalogId : null,
      localUid: typeof inst?.localUid === 'string' ? inst.localUid : null,
      districtId,
      kind,
      position: { x: bx, y: by },
    };
  });

  // ── (5) Fortifications — walls + gates iff the hardened predicate says so ────
  /** @type {TownMapFortifications|null} */
  let fortifications = null;
  if (hasWalls) {
    const readinessIdx = Math.max(0, DEFENSIVE_BANDS.indexOf(mapProfile.outputs.defensiveTerrain));
    /** @type {Array<[number, number]>} */
    const walls = [0, 2, 4, 6, 8, 10, 12, 14].map((di) => ringPoint(COMPASS[di], 112));
    const gates = roadDirIdx.map((di) => {
      const p = ringPoint(COMPASS[di], 112);
      return { x: p[0], y: p[1] };
    });
    fortifications = {
      walls,
      gates,
      readiness: DEFENSIVE_BANDS[readinessIdx] || 'open',
      wallWeight: readinessIdx + 1,
    };
  }

  // ── (6) Overlays — hazard markers + district-level condition badges ─────────
  const hazardMarkers = mapProfile.outputs.hazardMarkers.slice().sort((a, b) => compareCodepoint(a.id, b.id));
  /** @type {TownMapHazard[]} */
  const hazards = hazardMarkers.map((h, i) => {
    const p = ringPoint(COMPASS[(i * 3 + 1) % 16], 105);
    return {
      id: h.id,
      label: h.label,
      kind: h.kind,
      severity: h.severity,
      severityBand: h.severityBand,
      visibility: h.visibility,
      position: { x: p[0], y: p[1] },
    };
  });

  // conditions overlay MUST be a subset of activeConditions — we emit one badge
  // per active condition, attaching it to a seeded district (never inventing one).
  const sortedConditions = activeConditions.slice().sort((a, b) => compareCodepoint(a.id, b.id));
  const districtIds = districts.map((d) => d.id);
  /** @type {TownMapConditionBadge[]} */
  const conditions = sortedConditions.map((c) => {
    /** @type {string|null} */
    let districtId = null;
    if (districtIds.length === 1) districtId = districtIds[0];
    else if (districtIds.length > 1) districtId = geometryRng.fork(`condition:${c.id}`).pick(districtIds) ?? districtIds[0];
    return {
      id: c.id,
      archetype: c.archetype,
      label: c.label,
      severity: c.severity,
      severityBand: c.severityBand,
      districtId,
    };
  });

  // ── mapEdits pins — nudge the building/district whose anchorKey matches; a pin
  //    that matches nothing is dropped (no throw, no phantom). Absent ⇒ no-op. ──
  const pins = Array.isArray(mapEdits?.pins) ? mapEdits.pins : [];
  for (const pin of pins) {
    const anchor = typeof pin?.anchor === 'string' ? pin.anchor : '';
    if (anchor === '') continue;
    const dx = Number.isFinite(pin?.dx) ? Number(pin?.dx) : 0;
    const dy = Number.isFinite(pin?.dy) ? Number(pin?.dy) : 0;
    if (dx === 0 && dy === 0) continue;
    const b = buildings.find((x) => x.anchorKey === anchor);
    if (b) {
      b.position = { x: clamp(b.position.x + dx, 0, VIEW), y: clamp(b.position.y + dy, 0, VIEW) };
      continue;
    }
    const d = districts.find((x) => x.anchorKey === anchor);
    if (d) {
      d.centroid = { x: clamp(d.centroid.x + dx, 0, VIEW), y: clamp(d.centroid.y + dy, 0, VIEW) };
      d.polygon = d.polygon.map(([px, py]) => [clamp(px + dx, 0, VIEW), clamp(py + dy, 0, VIEW)]);
    }
    // else: dangling anchor — dropped.
  }

  // ── assemble (fixed key insertion order ⇒ byte-stable stringify) ────────────
  return {
    townMapGeometryVersion: TOWN_MAP_GEOMETRY_VERSION,
    layoutLawVersion: LAYOUT_LAW_VERSION,
    overlayVersion: TOWN_MAP_OVERLAY_VERSION,
    meta: {
      tier,
      terrain,
      tradeAccess,
      hasWalls,
      layoutVariant: variant,
      buildingCount: buildings.length,
      districtCount: districts.length,
      hamletCluster: assignment.floored,
    },
    frame: { water, roads },
    skeleton,
    districts,
    buildings,
    fortifications,
    overlays: { hazards, conditions },
    reserved: reservedSlots(),
  };
}
