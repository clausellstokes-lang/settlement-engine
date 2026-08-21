/**
 * Portable illustrated-diorama palette for deterministic scene artifacts.
 *
 * The manifest stores semantic color roles, never UI colors. Browser rendering
 * resolves those roles through live theme tokens; portable PNG/GLB files need a
 * frozen, theme-independent interpretation. This table is that export skin.
 */

/**
 * @typedef {readonly [number, number, number, number]} SceneExportAlbedo
 * @typedef {Record<string, unknown>} SceneExportManifest
 * @typedef {'ground'|'water'|'road'|'building'|'structure'|'vegetation'|'living'} SceneExportPresentationClass
 * @typedef {{
 *   materialId: string,
 *   colorRole: string,
 *   color: SceneExportAlbedo,
 *   roughness: number,
 *   metalness: number,
 *   water: boolean,
 *   presentationClass: SceneExportPresentationClass,
 * }} SceneExportMaterial
 */

/** @type {Readonly<Record<string, SceneExportAlbedo>>} */
export const TOWN_SCENE_EXPORT_ALBEDO = Object.freeze({
  terrain: [0.72, 0.66, 0.52, 1],
  road: [0.49, 0.42, 0.30, 1],
  wall: [0.69, 0.65, 0.57, 1],
  water: [0.24, 0.43, 0.57, 0.82],
  vegetation: [0.28, 0.44, 0.25, 1],
  skyTop: [0.70, 0.76, 0.84, 1],
  skyBottom: [0.90, 0.84, 0.70, 1],
  stoneAshlar: [0.72, 0.68, 0.59, 1],
  timberVillage: [0.46, 0.30, 0.20, 1],
  marbleTemple: [0.84, 0.82, 0.74, 1],
  brickGuild: [0.55, 0.31, 0.24, 1],
  steelModern: [0.46, 0.50, 0.53, 1],
  steelGlassCurtain: [0.36, 0.49, 0.56, 1],
  corrugatedIndustrial: [0.43, 0.43, 0.40, 1],
  concreteBrutalist: [0.55, 0.54, 0.50, 1],
  ruinedGothic: [0.34, 0.34, 0.31, 1],
  'living:condition': [0.76, 0.51, 0.16, 1],
  'living:hazard': [0.66, 0.17, 0.12, 1],
  'living:fire': [0.82, 0.28, 0.08, 1],
  'living:flood': [0.10, 0.38, 0.62, 1],
  'living:plague': [0.35, 0.44, 0.12, 1],
  'living:siege': [0.28, 0.19, 0.16, 1],
  'living:occupation': [0.51, 0.11, 0.10, 1],
  'living:abandonment': [0.18, 0.17, 0.15, 1],
  'living:neglect': [0.43, 0.35, 0.22, 1],
  'living:repair': [0.78, 0.62, 0.24, 1],
  'living:construction': [0.68, 0.50, 0.20, 1],
  'living:scar': [0.16, 0.14, 0.12, 1],
  'living:reconstruction': [0.84, 0.68, 0.25, 1],
  // Exact renderer-neutral material ids take precedence over their broader
  // manifest color roles. In particular, roofs must not collapse into the
  // same pale value as walls, and transport/water surfaces must remain
  // recognizable when the portrait is reduced to a campaign-handout size.
  'material:ground': [0.62, 0.59, 0.45, 1],
  'material:road': [0.34, 0.27, 0.18, 1],
  'material:water': [0.16, 0.43, 0.58, 0.88],
  'material:wall': [0.74, 0.70, 0.61, 1],
  'material:roof': [0.31, 0.21, 0.17, 1],
  'material:bridge': [0.61, 0.52, 0.39, 1],
  'material:gate': [0.35, 0.22, 0.14, 1],
  'material:quay': [0.40, 0.29, 0.20, 1],
  'material:stone': [0.73, 0.68, 0.57, 1],
  'material:timber': [0.43, 0.27, 0.17, 1],
  'material:brick': [0.55, 0.29, 0.21, 1],
  'material:vegetation:tree': [0.24, 0.42, 0.22, 1],
});

/** @type {Readonly<Record<string, Readonly<Record<string, SceneExportAlbedo>>>>} */
export const TOWN_SCENE_EXPORT_SEASONAL_ALBEDO = Object.freeze({
  autumn: Object.freeze({
    terrain: /** @type {SceneExportAlbedo} */ ([0.58, 0.50, 0.34, 1]),
    vegetation: /** @type {SceneExportAlbedo} */ ([0.48, 0.31, 0.16, 1]),
    skyTop: /** @type {SceneExportAlbedo} */ ([0.62, 0.68, 0.72, 1]),
    skyBottom: /** @type {SceneExportAlbedo} */ ([0.86, 0.74, 0.57, 1]),
  }),
  winter: Object.freeze({
    terrain: /** @type {SceneExportAlbedo} */ ([0.75, 0.77, 0.73, 1]),
    vegetation: /** @type {SceneExportAlbedo} */ ([0.34, 0.40, 0.34, 1]),
    skyTop: /** @type {SceneExportAlbedo} */ ([0.58, 0.68, 0.78, 1]),
    skyBottom: /** @type {SceneExportAlbedo} */ ([0.82, 0.85, 0.84, 1]),
  }),
});

/** @type {SceneExportAlbedo} */
export const TOWN_SCENE_EXPORT_FALLBACK_ALBEDO = Object.freeze([
  0.68, 0.63, 0.54, 1,
]);

/** @type {SceneExportAlbedo} */
export const TOWN_SCENE_EXPORT_INK_ALBEDO = Object.freeze([
  0.08, 0.07, 0.06, 0.64,
]);

/**
 * Classify a material for deterministic cartographic presentation. This does
 * not add product state: it only tells portable renderers how an already
 * canonical surface should participate in legibility and overlap policy.
 *
 * @param {string} materialId
 * @param {Record<string, unknown>|null} definition
 * @param {string} colorRole
 * @returns {SceneExportPresentationClass}
 */
function presentationClassFor(materialId, definition, colorRole) {
  const id = String(materialId || '').toLowerCase();
  const kind = String(definition?.kind || '').toLowerCase();
  const role = String(colorRole || '').toLowerCase();
  if (id.startsWith('living:')) return 'living';
  if (id.includes('water') || kind === 'water' || role === 'water') return 'water';
  if (id.includes('road') || kind === 'road' || role === 'road') return 'road';
  if (
    id.includes('ground')
    || id.includes('terrain')
    || kind === 'terrain'
    || role === 'terrain'
  ) return 'ground';
  if (id.includes('vegetation') || kind === 'vegetation' || role === 'vegetation') {
    return 'vegetation';
  }
  if (
    kind === 'building-role'
    || kind === 'building-skin'
    || id.startsWith('skin:')
    || ['roof', 'stoneashlar', 'timbervillage', 'brickguild'].includes(role)
  ) return 'building';
  return 'structure';
}

/**
 * Resolve one manifest material into the fixed portable export skin.
 * @param {SceneExportManifest} manifest
 * @param {string} materialId
 * @returns {SceneExportMaterial}
 */
export function resolveTownSceneExportMaterial(manifest, materialId) {
  const materials = /** @type {Array<Record<string, unknown>>} */ (
    Array.isArray(manifest.materials) ? manifest.materials : []
  );
  const definition = materials.find(
    (candidate) => candidate.id === materialId,
  ) || null;
  const colorRole = String(definition?.colorRole || '');
  const living = manifest.living && typeof manifest.living === 'object'
    ? /** @type {Record<string, unknown>} */ (manifest.living)
    : {};
  const atmosphere = living.atmosphere && typeof living.atmosphere === 'object'
    ? /** @type {Record<string, unknown>} */ (living.atmosphere)
    : {};
  const seasonal = TOWN_SCENE_EXPORT_SEASONAL_ALBEDO[
    String(atmosphere.season || '').toLowerCase()
  ];
  const paletteRole = colorRole || materialId;
  const color = seasonal?.[materialId]
    || seasonal?.[paletteRole]
    || TOWN_SCENE_EXPORT_ALBEDO[materialId]
    || TOWN_SCENE_EXPORT_ALBEDO[colorRole]
    || TOWN_SCENE_EXPORT_FALLBACK_ALBEDO;
  const roughnessPermille = definition?.roughnessPermille;
  const metalnessPermille = definition?.metalnessPermille;
  const roughness = typeof roughnessPermille === 'number'
    && Number.isFinite(roughnessPermille)
    ? roughnessPermille / 1000
    : 0.9;
  const metalness = typeof metalnessPermille === 'number'
    && Number.isFinite(metalnessPermille)
    ? metalnessPermille / 1000
    : 0;
  return {
    materialId,
    colorRole: colorRole || materialId,
    color,
    roughness,
    metalness,
    water: colorRole === 'water' || materialId === 'material:water',
    presentationClass: presentationClassFor(materialId, definition, colorRole),
  };
}
