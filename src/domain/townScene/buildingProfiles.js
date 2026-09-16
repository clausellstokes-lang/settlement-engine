/**
 * domain/townScene/buildingProfiles.js — adapt the illustrated-map silhouette
 * taxonomy into renderer-neutral scene building profiles.
 *
 * The map's `glyphKindFor` remains the single institution/category classifier.
 * This file only gives that already-selected silhouette a 3D family, dimensions,
 * coherent skin, quantized heading and compatible condition vector. It does not
 * reclassify institutions from raw settlement prose.
 */

import { glyphKindFor } from '../townMap/glyphAssign.js';
import { silhouetteForKind } from '../townMap/massing.js';
import { clamp } from '../../kernel/math.js';
import { sceneDigest } from './stableScene.js';
import { TOWN_SCENE_HEADING_STEPS } from './manifestContract.js';
import { resolveCustomBuildingPresentation } from './customBuildingPresentation.js';

const COMPASS_16 = /** @type {ReadonlyArray<readonly [number, number]>} */ (
  Object.freeze([
  [0, -1000], [383, -924], [707, -707], [924, -383],
  [1000, 0], [924, 383], [707, 707], [383, 924],
  [0, 1000], [-383, 924], [-707, 707], [-924, 383],
  [-1000, 0], [-924, -383], [-707, -707], [-383, -924],
  ])
);

const SHAPE_FAMILY_BY_KIND = /** @type {Readonly<Record<string, string>>} */ (
  Object.freeze({
  spire: 'sacred',
  'small-spire': 'sacred',
  'mage-tower': 'exotic',
  wheelhouse: 'agrarian',
  forge: 'industrial',
  'towered-keep': 'martial',
  'stall-rows': 'mercantile',
  'gambrel-store': 'agrarian',
  'quay-shed': 'mercantile',
  'signpost-house': 'mercantile',
  'manor-hall': 'civic',
  'moot-hall': 'civic',
  'caravan-house': 'mercantile',
  workshop: 'industrial',
  'kiln-yard': 'industrial',
  barracks: 'martial',
  watchtower: 'martial',
  guildhall: 'mercantile',
  'archive-hall': 'civic',
  farmstead: 'agrarian',
  'graveyard-chapel': 'sacred',
  encampment: 'martial',
  'ruin-shell': 'ruined',
  'house-a': 'domestic',
  'house-b': 'domestic',
  'house-c': 'domestic',
  massing: 'domestic',
  })
);

const HEIGHT_MULTIPLIER = /** @type {Readonly<Record<string, number>>} */ (
  Object.freeze({
  spire: 2.25,
  'small-spire': 1.6,
  'mage-tower': 2.4,
  wheelhouse: 1.0,
  forge: 0.9,
  'towered-keep': 1.7,
  'stall-rows': 0.7,
  'gambrel-store': 1.35,
  'quay-shed': 0.65,
  'signpost-house': 1.0,
  'manor-hall': 1.2,
  'moot-hall': 1.3,
  'caravan-house': 1.05,
  workshop: 0.85,
  'kiln-yard': 0.9,
  barracks: 0.85,
  watchtower: 1.85,
  guildhall: 1.2,
  'archive-hall': 1.15,
  farmstead: 0.9,
  'graveyard-chapel': 1.15,
  encampment: 0.55,
  'ruin-shell': 1.05,
  'house-a': 0.9,
  'house-b': 0.95,
  'house-c': 1.05,
  massing: 0.7,
  })
);

const WEALTH_RANK = /** @type {Readonly<Record<string, number>>} */ (
  Object.freeze({
  destitute: 0,
  poor: 1,
  modest: 2,
  comfortable: 3,
  wealthy: 4,
  opulent: 5,
  })
);

const PROSPERITY_RANK = /** @type {Readonly<Record<string, number>>} */ (
  Object.freeze({
  subsistence: 0,
  struggling: 1,
  poor: 2,
  moderate: 3,
  modest: 3,
  comfortable: 4,
  prosperous: 5,
  wealthy: 6,
  opulent: 6,
  })
);

const COMMONS_SHAPE_KINDS = Object.freeze([
  'house-a',
  'house-b',
  'house-c',
  'massing',
]);

/** Quantize a scalar onto the architecture contract's 1/64 lattice. */
/** @param {number} value */
function q64(value) {
  return Math.round(clamp(value, 0, 1) * 64) / 64;
}

/** @param {unknown} value @returns {Record<string, unknown>} */
function record(value) {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? /** @type {Record<string, unknown>} */ (value)
    : {};
}

/**
 * Return the closest of sixteen headings to a vector. Dot products over the
 * pinned integer compass avoid trigonometry and provide deterministic ties.
 * @param {number} dx @param {number} dz
 */
function headingForVector(dx, dz) {
  if (dx === 0 && dz === 0) return 0;
  let best = 0;
  let bestDot = -Infinity;
  for (let i = 0; i < COMPASS_16.length; i++) {
    const dot = dx * COMPASS_16[i][0] + dz * COMPASS_16[i][1];
    if (dot > bestDot) {
      best = i;
      bestDot = dot;
    }
  }
  return best;
}

/**
 * Select the nearest road segment and align with its tangent. Distance uses the
 * segment midpoint because roads in TownMapModel are short, straight semantic
 * links; midpoint distance gives a stable, inexpensive total ordering.
 * @param {{ x: number, y: number }} point
 * @param {Array<{ id: string, centerline: Array<[number, number]> }>} roads
 */
export function buildingHeadingStep(point, roads) {
  let best = null;
  let bestDistance = Infinity;
  for (const road of roads) {
    const first = road.centerline[0];
    const last = road.centerline[road.centerline.length - 1];
    if (!first || !last) continue;
    const mx = Math.round((first[0] + last[0]) / 2);
    const mz = Math.round((first[1] + last[1]) / 2);
    const dx = point.x - mx;
    const dz = point.y - mz;
    const distance = dx * dx + dz * dz;
    if (
      distance < bestDistance
      || (distance === bestDistance && best && road.id < best.id)
      || (distance === bestDistance && !best)
    ) {
      bestDistance = distance;
      best = road;
    }
  }
  if (!best) return 0;
  const first = best.centerline[0];
  const last = best.centerline[best.centerline.length - 1];
  return headingForVector(last[0] - first[0], last[1] - first[1]);
}

/**
 * Oriented rectangle in plan coordinates using the fixed 16-heading table.
 * @param {[number, number]} center
 * @param {number} widthPlan
 * @param {number} depthPlan
 * @param {number} headingStep
 * @returns {Array<[number, number]>}
 */
export function orientedFootprint(center, widthPlan, depthPlan, headingStep) {
  const forward = COMPASS_16[((headingStep % TOWN_SCENE_HEADING_STEPS) + TOWN_SCENE_HEADING_STEPS) % TOWN_SCENE_HEADING_STEPS];
  const right = [-forward[1], forward[0]];
  const halfW = widthPlan / 2;
  const halfD = depthPlan / 2;
  /** @type {Array<[number, number]>} */
  const corners = [];
  for (const [rw, fd] of [[-halfW, -halfD], [halfW, -halfD], [halfW, halfD], [-halfW, halfD]]) {
    corners.push([
      clamp(Math.round(center[0] + (right[0] * rw + forward[0] * fd) / 1000), 0, 1000),
      clamp(Math.round(center[1] + (right[1] * rw + forward[1] * fd) / 1000), 0, 1000),
    ]);
  }
  return corners;
}

/**
 * Resolve the coherent default skin. Explicit overrides are admitted by the
 * map-edit wall before this function is called.
 *
 * @param {string} shapeFamily
 * @param {string} terrain
 * @param {string} wealth
 * @param {number} scarLevel
 */
function defaultSkin(shapeFamily, terrain, wealth, scarLevel) {
  if (scarLevel >= 0.72) return 'ruinedGothic';
  if (shapeFamily === 'ruined') return 'ruinedGothic';
  const lowerTerrain = String(terrain || '').toLowerCase();
  const wealthRank = WEALTH_RANK[String(wealth || '').toLowerCase()] ?? WEALTH_RANK.modest;
  if (/desert|dune|arid|badland/.test(lowerTerrain)) return 'brickGuild';
  if (shapeFamily === 'sacred') {
    return wealthRank === WEALTH_RANK.opulent ? 'marbleTemple' : 'stoneAshlar';
  }
  if (shapeFamily === 'martial' || shapeFamily === 'civic' || shapeFamily === 'exotic') return 'stoneAshlar';
  if (shapeFamily === 'industrial' || shapeFamily === 'mercantile') return 'brickGuild';
  // District wealth changes the actual commons material vocabulary, not merely
  // its shader tint: prosperous wards can sustain masonry homes while ordinary
  // domestic fabric remains timber. Terrain and scar overrides stay dominant.
  if (shapeFamily === 'domestic' && wealthRank >= WEALTH_RANK.wealthy) {
    return 'stoneAshlar';
  }
  return 'timberVillage';
}

/**
 * Build the frozen architecture-compatible condition vector from already
 * authorized settlement/district facts. Canonical ActiveCondition rows are
 * settlement-scoped, so every visible building receives their treatment;
 * future local effects need one typed TownScene-local target derived after the
 * map exists rather than guessed persistence aliases. Covert corruption is a
 * literal zero.
 * @param {Record<string, unknown>} settlement
 * @param {Record<string, unknown>} district
 * @param {string} terrain
 * @param {number} scarLevel
 * @param {string} entropy
 */
function conditionProfile(
  settlement,
  district,
  terrain,
  scarLevel,
  entropy,
) {
  const economic = record(settlement.economicState);
  const power = record(settlement.powerStructure);
  const urban = record(settlement.urbanFabric);
  const prosperityRaw = economic.prosperity;
  const prosperityLabel = typeof prosperityRaw === 'string'
    ? prosperityRaw
    : String(record(prosperityRaw).tier || record(prosperityRaw).label || '');
  const prosperityRank = PROSPERITY_RANK[prosperityLabel.toLowerCase()] ?? 3;
  const districtWealth = WEALTH_RANK[String(district.wealth || '').toLowerCase()] ?? 2;
  const moralRaw = typeof settlement.moralDrift === 'number' ? settlement.moralDrift : 0.5;
  const legitimacyRaw = typeof power.legitimacy === 'number'
    ? power.legitimacy
    : typeof settlement.legitimacy === 'number' ? settlement.legitimacy : 0.5;
  const terrainBand = /mountain|hill|crag|highland/.test(terrain) ? 0.8
    : /desert|dune|arid/.test(terrain) ? 0.2
      : /marsh|swamp|river|coast/.test(terrain) ? 0.35 : 0.55;

  let corruptionRevealed = 0;
  let occupation = 0;
  let abandonment = 0;
  let neglect = clamp((3 - prosperityRank) / 3, 0, 1);
  let repair = 0;
  let construction = 0;
  const conditions = Array.isArray(settlement.activeConditions) ? settlement.activeConditions : [];
  for (const condition of conditions) {
    const item = record(condition);
    if (item.covert === true) continue;
    const text = [
      item.id,
      item.label,
      item.archetype,
      item.status,
    ].map((value) => String(value || '').toLowerCase()).join(' ');
    const severity = typeof item.severity === 'number'
      ? clamp(item.severity, 0, 1)
      : 0.5;
    if (/corrupt|taint|blight/.test(text)) {
      corruptionRevealed = Math.max(corruptionRevealed, severity);
    }
    if (
      /occupation|occupied|occupier/.test(text)
      && !/occupation_burden|occupation_lifted/.test(text)
    ) occupation = Math.max(occupation, severity);
    if (/abandon|deserted|evacuat/.test(text)) {
      abandonment = Math.max(abandonment, severity);
    }
    if (/neglect|derelict|decay|lean_year|destitut/.test(text)) {
      neglect = Math.max(neglect, severity);
    }
    if (/occupation_lifted|siege_lifted|repair|restor|recovery|mend/.test(text)) {
      repair = Math.max(repair, severity);
    }
    if (/reconstruct|construction|rebuild|rebirth/.test(text)) {
      construction = Math.max(construction, severity);
    }
  }

  const districtCategory = String(district.category || '');
  const rebirths = Array.isArray(urban.rebirths) ? urban.rebirths : [];
  for (const value of rebirths) {
    const rebirth = record(value);
    const classes = Array.isArray(rebirth.classes)
      ? rebirth.classes.map(String)
      : [];
    if (classes.includes(districtCategory)) {
      construction = Math.max(construction, 0.75);
    }
  }

  const digest = sceneDigest({ entropy, districtId: district.id || null });
  const patronEmblem = parseInt(digest.slice(-2), 16) % 48;
  const history = Array.isArray(settlement.history) ? settlement.history.length : Object.keys(record(settlement.history)).length;
  const historyMark = Math.min(15, history);
  return {
    patronAlignLaw: 0.5,
    patronAlignGood: 0.5,
    moral: q64(moralRaw),
    prosperity: q64((prosperityRank + districtWealth / 5) / 7),
    terrain: q64(terrainBand),
    warScar: q64(scarLevel),
    corruptionCovert: 0,
    corruptionRevealed: q64(corruptionRevealed),
    occupation: q64(occupation),
    abandonment: q64(abandonment),
    neglect: q64(neglect),
    repair: q64(repair),
    construction: q64(construction),
    legitimacy: q64(legitimacyRaw),
    patronEmblem,
    historyMark,
  };
}

/**
 * Lift one TownMapModel building to its scene profile.
 * @param {{
 *   building: Record<string, unknown>,
 *   district: Record<string, unknown>,
 *   settlement: Record<string, unknown>,
 *   roads: Array<{ id: string, centerline: Array<[number, number]> }>,
 *   override: { variantId?: string, skinId?: string, headingOffsetStep?: number }|null,
 *   planUnitCm: number,
 *   terrain: string,
 *   tier: string,
 *   scarLevel: number,
 *   entropy: string,
 *   provenanceRefs: string[],
 * }} args
 */
export function buildSceneBuildingProfile(args) {
  const {
    building, district, settlement, roads, override, planUnitCm,
    terrain, tier, scarLevel, entropy, provenanceRefs,
  } = args;
  const position = record(building.position);
  const anchorKey = typeof building.anchorKey === 'string' ? building.anchorKey : '';
  const mapAnchor = /** @type {[number, number]} */ ([
    clamp(Math.round(Number(position.x) || 0), 0, 1000),
    clamp(Math.round(Number(position.y) || 0), 0, 1000),
  ]);
  const glyph = glyphKindFor(
    {
      name: typeof building.name === 'string' ? building.name : '',
      anchorKey: typeof building.anchorKey === 'string' ? building.anchorKey : '',
      kind: typeof building.kind === 'string' ? building.kind : '',
    },
    typeof district.category === 'string' ? district.category : 'other',
  );
  const customPresentation = resolveCustomBuildingPresentation(building);
  const commonsDigest = sceneDigest({
    purpose: 'commons-shape',
    entropy,
    anchorKey,
  });
  const commonsShapeIndex = Number.parseInt(commonsDigest.slice(-2), 16)
    % COMMONS_SHAPE_KINDS.length;
  const inferredLandmark = building.kind !== 'fill';
  const landmark = customPresentation.landmark ?? inferredLandmark;
  const useCommonsShape = (
    building.kind === 'fill'
    && customPresentation.landmark !== true
    && !customPresentation.glyphKind
  );
  const shapeKind = customPresentation.glyphKind
    || (useCommonsShape ? COMMONS_SHAPE_KINDS[commonsShapeIndex] : glyph.kind);
  const silhouette = silhouetteForKind(shapeKind);
  const shapeFamily = SHAPE_FAMILY_BY_KIND[shapeKind] || 'domestic';
  const tierIndex = Math.max(0, ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'].indexOf(tier));
  // Commons stay house-scale as the settlement grows; a metropolis contains
  // more roofs, not six-tier-inflated cottages. Landmark scale still rises.
  const basePlan = landmark ? 11 + tierIndex : 7 + Math.round(tierIndex / 3);
  const fabricScale = landmark
    ? 1
    : clamp(Number(building.fabricScalePermille) || 1000, 650, 1000) / 1000;
  const widthPlan = clamp(
    Math.round(basePlan * silhouette.foot * fabricScale),
    5,
    44,
  );
  const depthPlan = clamp(
    Math.round(
      widthPlan
      * (shapeKind === 'spire' ? 1.35 : shapeKind === 'stall-rows' ? 0.72 : 0.9),
    ),
    5,
    48,
  );
  const baseHeightPlan = landmark ? 9 + tierIndex * 2 : 6 + tierIndex;
  const heightPlan = clamp(Math.round(baseHeightPlan * (HEIGHT_MULTIPLIER[shapeKind] || 1)), 5, 60);
  const baseHeading = buildingHeadingStep(
    { x: mapAnchor[0], y: mapAnchor[1] },
    roads,
  );
  const offset = override && Number.isInteger(override.headingOffsetStep) ? Number(override.headingOffsetStep) : 0;
  const headingStep = ((baseHeading + offset) % TOWN_SCENE_HEADING_STEPS + TOWN_SCENE_HEADING_STEPS) % TOWN_SCENE_HEADING_STEPS;
  const commonsMirror = Number.parseInt(commonsDigest.slice(-4, -2), 16) % 2 === 1;
  const variantId = override?.variantId
    || ((building.kind === 'fill' ? commonsMirror : glyph.mirror) ? 'mirror' : 'default');
  const skinId = override?.skinId
    || customPresentation.skinId
    || defaultSkin(shapeFamily, terrain, String(district.wealth || ''), scarLevel);
  const id = `building:${anchorKey}`;
  return {
    id,
    semanticId: id,
    anchorKey,
    districtId: typeof building.districtId === 'string' ? building.districtId : '',
    mapAnchor,
    renderCenter: mapAnchor,
    headingStep,
    footprint: orientedFootprint(mapAnchor, widthPlan, depthPlan, headingStep),
    widthCm: widthPlan * planUnitCm,
    depthCm: depthPlan * planUnitCm,
    heightCm: heightPlan * planUnitCm,
    landmark,
    shapeFamily,
    shapeKind,
    lodFamily: landmark ? 'signature' : 'commons',
    skinId,
    variantId,
    geometryKey: `building:${shapeKind}:${variantId}`,
    materialKey: `skin:${skinId}`,
    conditionProfile: conditionProfile(
      settlement,
      district,
      terrain,
      scarLevel,
      entropy,
    ),
    provenanceRefs,
    ...(customPresentation.profileId
      ? { sceneProfileId: customPresentation.profileId }
      : {}),
  };
}
