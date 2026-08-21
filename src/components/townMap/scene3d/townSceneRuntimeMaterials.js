/**
 * Illustrated-diorama material policy for the lazy Three runtime.
 *
 * Canonical manifests carry semantic color roles and numeric surface traits,
 * never theme colors. This adapter is the single place where those roles meet
 * product design tokens.
 */
import {
  BLUE,
  BODY,
  BORDER,
  CARD_ALT,
  GOLD,
  GOLD_SOFT,
  GREEN,
  INK,
  MUTED,
  PARCH,
  SECOND,
} from '../../theme.js';

const MATERIAL_PALETTE = Object.freeze({
  terrain: PARCH,
  ground: PARCH,
  'material:ground': PARCH,
  water: BLUE,
  'material:water': BLUE,
  road: BODY,
  street: BODY,
  'material:road': BODY,
  wall: BORDER,
  'material:wall': BORDER,
  'material:bridge': BORDER,
  'material:gate': SECOND,
  'material:quay': SECOND,
  'material:roof': SECOND,
  'material:stone': BORDER,
  'material:timber': SECOND,
  'material:brick': BODY,
  'material:vegetation:tree': GREEN,
  gate: SECOND,
  structure: BORDER,
  roof: SECOND,
  detail: GOLD,
  stone: BORDER,
  timber: SECOND,
  marble: CARD_ALT,
  brick: BODY,
  steel: MUTED,
  stoneAshlar: BORDER,
  roofLead: SECOND,
  tracery: GOLD,
  buttressStone: BORDER,
  timberVillage: SECOND,
  marbleTemple: CARD_ALT,
  brickGuild: BODY,
  steelModern: MUTED,
  steelGlassCurtain: MUTED,
  corrugatedIndustrial: SECOND,
  concreteBrutalist: BORDER,
  ruinedGothic: INK,
  vegetation: GREEN,
});

const SEASONAL_MATERIAL_PALETTE = Object.freeze({
  autumn: Object.freeze({
    terrain: GOLD_SOFT,
    vegetation: BODY,
  }),
  winter: Object.freeze({
    terrain: CARD_ALT,
    vegetation: SECOND,
  }),
});

export function townSceneAoShade(value) {
  return Math.max(0.28, Math.min(1, Number.isFinite(value) ? value : 1));
}

export function townSceneSeasonalMaterialColor(role, season) {
  const seasonal = SEASONAL_MATERIAL_PALETTE[String(season || '').toLowerCase()];
  return seasonal?.[role] || MATERIAL_PALETTE[role] || null;
}

export function townSceneMaterialIdForRole(
  definition,
  role,
  explicitMaterialId,
  fallbackMaterialId,
) {
  if (explicitMaterialId) return explicitMaterialId;
  const assignment = definition?.roleAssignments?.find(
    (candidate) => candidate.role === role,
  );
  // Role names describe submesh intent; they are not material ids. A skin may
  // deliberately map `roof` to lead, but a vegetation template whose role is
  // also `roof` must retain its vegetation material instead of turning gray.
  return assignment?.materialId || fallbackMaterialId || role;
}

function materialColor(id, kind, atmosphere) {
  const season = atmosphere?.season;
  const byId = townSceneSeasonalMaterialColor(id, season);
  if (byId != null) return byId;
  const byKind = townSceneSeasonalMaterialColor(kind, season);
  if (byKind != null) return byKind;
  const token = String(id || kind || 'stone');
  let hash = 2166136261;
  for (let index = 0; index < token.length; index++) {
    hash ^= token.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  // A deterministic lightness nudge keeps unknown material ids distinct while
  // remaining inside the established parchment/ink palette.
  return hash % 2 === 0 ? BORDER : SECOND;
}

export function createTownSceneMaterial(
  THREE,
  materialId,
  kind,
  definition,
  atmosphere,
) {
  const isWater = kind === 'water'
    || String(materialId).toLowerCase().includes('water');
  const colorRole = definition?.colorRole;
  const isRoad = kind === 'road'
    || String(materialId).toLowerCase().includes('road');
  const material = new THREE.MeshStandardMaterial({
    // Exact semantic material ids take precedence over broad color roles.
    // `material:roof`, for example, must not collapse into the wall token just
    // because its portable manifest role is `wall`.
    color: definition?.baseColor
      || materialColor(materialId, colorRole || kind, atmosphere),
    roughness: Number.isFinite(definition?.roughnessPermille)
      ? definition.roughnessPermille / 1000
      : isWater ? 0.35 : 0.86,
    metalness: Number.isFinite(definition?.metalnessPermille)
      ? definition.metalnessPermille / 1000
      : String(materialId).toLowerCase().includes('steel') ? 0.28 : 0.02,
    transparent: isWater,
    opacity: isWater ? 0.88 : 1,
    depthWrite: !isWater,
    polygonOffset: isWater || isRoad,
    polygonOffsetFactor: isWater ? -2 : -1,
    polygonOffsetUnits: isWater ? -4 : -2,
    // The canonical road/water batches are authored as thin presentation
    // surfaces and some generators wind them downward. They are intentionally
    // two-sided in GLB, so the live viewer must honor the same contract.
    side: isWater || isRoad ? THREE.DoubleSide : THREE.FrontSide,
    vertexColors: true,
  });
  material.name = `town-scene:${materialId || kind || 'default'}`;
  return material;
}
