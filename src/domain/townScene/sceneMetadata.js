/**
 * Provenance, semantic picking records, and material-vocabulary compilation.
 *
 * Material records carry semantic color roles rather than raw display colors.
 * The renderer resolves those roles through the product design tokens, keeping
 * canonical scene data independent from a particular theme or WebGL library.
 */

import {
  boundedSceneString,
  compareSceneCodepoint,
  sceneRecord,
  sortSceneRecords,
} from './sceneCompilePrimitives.js';
import { sceneDigest } from './stableScene.js';

/**
 * @typedef {{
 *   kind: string,
 *   colorRole: string,
 *   roughnessPermille: number,
 *   metalnessPermille: number,
 * }} SceneMaterialDefinition
 * @typedef {{ role: string, materialId: string, weatheringId: string }} SceneSkinRole
 * @typedef {Record<string, unknown>} SceneEntityRecord
 */

const MATERIAL_DEFS = /** @type {Readonly<Record<string, SceneMaterialDefinition>>} */ (
  Object.freeze({
  'material:ground': {
    kind: 'terrain',
    colorRole: 'terrain',
    roughnessPermille: 980,
    metalnessPermille: 0,
  },
  'material:road': {
    kind: 'road',
    colorRole: 'road',
    roughnessPermille: 990,
    metalnessPermille: 0,
  },
  'material:wall': {
    kind: 'wall',
    colorRole: 'wall',
    roughnessPermille: 930,
    metalnessPermille: 0,
  },
  'material:gate': {
    kind: 'gate',
    colorRole: 'timberVillage',
    roughnessPermille: 940,
    metalnessPermille: 0,
  },
  'material:bridge': {
    kind: 'bridge',
    colorRole: 'stoneAshlar',
    roughnessPermille: 920,
    metalnessPermille: 0,
  },
  'material:quay': {
    kind: 'quay',
    colorRole: 'timberVillage',
    roughnessPermille: 950,
    metalnessPermille: 0,
  },
  'material:water': {
    kind: 'water',
    colorRole: 'water',
    roughnessPermille: 460,
    metalnessPermille: 0,
  },
  'material:vegetation:reed': {
    kind: 'vegetation',
    colorRole: 'vegetation',
    roughnessPermille: 900,
    metalnessPermille: 0,
  },
  'material:vegetation:scrub': {
    kind: 'vegetation',
    colorRole: 'vegetation',
    roughnessPermille: 940,
    metalnessPermille: 0,
  },
  'material:vegetation:tree': {
    kind: 'vegetation',
    colorRole: 'vegetation',
    roughnessPermille: 920,
    metalnessPermille: 0,
  },
  'material:brick': {
    kind: 'building-role',
    colorRole: 'brickGuild',
    roughnessPermille: 900,
    metalnessPermille: 0,
  },
  'material:concrete': {
    kind: 'building-role',
    colorRole: 'ruinedGothic',
    roughnessPermille: 880,
    metalnessPermille: 0,
  },
  'material:marble': {
    kind: 'building-role',
    colorRole: 'marbleTemple',
    roughnessPermille: 780,
    metalnessPermille: 0,
  },
  'material:roof': {
    kind: 'building-role',
    colorRole: 'wall',
    roughnessPermille: 860,
    metalnessPermille: 80,
  },
  'material:steel': {
    kind: 'building-role',
    colorRole: 'steelModern',
    roughnessPermille: 620,
    metalnessPermille: 280,
  },
  'material:stone': {
    kind: 'building-role',
    colorRole: 'stoneAshlar',
    roughnessPermille: 920,
    metalnessPermille: 0,
  },
  'material:timber': {
    kind: 'building-role',
    colorRole: 'timberVillage',
    roughnessPermille: 940,
    metalnessPermille: 0,
  },
  'skin:brickGuild': {
    kind: 'building-skin',
    colorRole: 'brickGuild',
    roughnessPermille: 900,
    metalnessPermille: 0,
  },
  'skin:marbleTemple': {
    kind: 'building-skin',
    colorRole: 'marbleTemple',
    roughnessPermille: 780,
    metalnessPermille: 0,
  },
  'skin:ruinedGothic': {
    kind: 'building-skin',
    colorRole: 'ruinedGothic',
    roughnessPermille: 990,
    metalnessPermille: 0,
  },
  'skin:steelModern': {
    kind: 'building-skin',
    colorRole: 'steelModern',
    roughnessPermille: 620,
    metalnessPermille: 280,
  },
  'skin:stoneAshlar': {
    kind: 'building-skin',
    colorRole: 'stoneAshlar',
    roughnessPermille: 920,
    metalnessPermille: 0,
  },
  'skin:timberVillage': {
    kind: 'building-skin',
    colorRole: 'timberVillage',
    roughnessPermille: 940,
    metalnessPermille: 0,
  },
  })
);

const SKIN_ROLE_ASSIGNMENTS = /** @type {Readonly<Record<string, SceneSkinRole[]>>} */ (
  Object.freeze({
  brickGuild: [
    { role: 'detail', materialId: 'material:stone', weatheringId: 'stain' },
    { role: 'roof', materialId: 'material:roof', weatheringId: 'stain' },
    { role: 'structure', materialId: 'material:brick', weatheringId: 'pristine' },
  ],
  marbleTemple: [
    { role: 'detail', materialId: 'material:marble', weatheringId: 'pristine' },
    { role: 'roof', materialId: 'material:roof', weatheringId: 'stain' },
    { role: 'structure', materialId: 'material:marble', weatheringId: 'pristine' },
  ],
  ruinedGothic: [
    { role: 'detail', materialId: 'material:stone', weatheringId: 'ruin' },
    { role: 'roof', materialId: 'material:roof', weatheringId: 'ruin' },
    { role: 'structure', materialId: 'material:stone', weatheringId: 'moss' },
  ],
  steelModern: [
    { role: 'detail', materialId: 'material:steel', weatheringId: 'pristine' },
    { role: 'roof', materialId: 'material:steel', weatheringId: 'pristine' },
    { role: 'structure', materialId: 'material:concrete', weatheringId: 'pristine' },
  ],
  stoneAshlar: [
    { role: 'detail', materialId: 'material:stone', weatheringId: 'pristine' },
    { role: 'roof', materialId: 'material:roof', weatheringId: 'stain' },
    { role: 'structure', materialId: 'material:stone', weatheringId: 'soot' },
  ],
  timberVillage: [
    { role: 'detail', materialId: 'material:stone', weatheringId: 'pristine' },
    { role: 'roof', materialId: 'material:roof', weatheringId: 'stain' },
    { role: 'structure', materialId: 'material:timber', weatheringId: 'pristine' },
  ],
  })
);

/** Flatten TownMapModel's lookup-by-element provenance into stable records. */
/**
 * @param {Record<string, unknown>} model
 * @param {string} audience
 */
export function buildSceneProvenance(model, audience) {
  const source = sceneRecord(model.provenance);
  /** @type {Map<string, Record<string, unknown>>} */
  const byId = new Map();
  /** @type {Map<string, string[]>} */
  const refsByElement = new Map();
  for (const element of Object.keys(source).sort(compareSceneCodepoint)) {
    const rawEntries = Array.isArray(source[element]) ? source[element] : [];
    /** @type {string[]} */
    const refs = [];
    for (const raw of rawEntries) {
      const entry = sceneRecord(raw);
      const family = boundedSceneString(entry.sourceFamily, 48) || 'derived';
      const sourceRef = boundedSceneString(entry.sourceRef, 180);
      const effect = boundedSceneString(entry.effect, 80) || 'derived';
      const core = { family, sourceRef, effect, audience };
      const id = `provenance:${sceneDigest(core).slice(-16)}`;
      if (!byId.has(id)) {
        byId.set(id, {
          id,
          ...core,
          displayText: boundedSceneString(
            sourceRef ? `${effect}: ${sourceRef}` : effect,
            260,
          ),
        });
      }
      refs.push(id);
    }
    refsByElement.set(
      element,
      [...new Set(refs)].sort(compareSceneCodepoint),
    );
  }

  // A generated custom institution retains its exact definition identity on
  // the TownMap building. Add one semantic provenance edge when that definition
  // also carries a version, fingerprint, or registered scene profile. The
  // canonical reference preserves those exact fields; this concise provenance
  // row explains why the authored presentation exists without copying geometry.
  const modelBuildings = audience === 'dm' && Array.isArray(model.buildings)
    ? model.buildings
    : [];
  for (const raw of modelBuildings) {
    const building = sceneRecord(raw);
    const localUid = boundedSceneString(building.localUid, 160);
    const anchorKey = boundedSceneString(building.anchorKey, 180);
    const profileId = boundedSceneString(building.sceneProfileId, 80);
    const definitionId = boundedSceneString(
      building.customDefinitionId,
      240,
    );
    const revisionId = boundedSceneString(
      building.customDefinitionRevisionId,
      240,
    );
    const contentHash = boundedSceneString(
      building.customDefinitionContentHash,
      240,
    );
    const fingerprint = boundedSceneString(
      building.customDefinitionFingerprint,
      240,
    );
    const version = (
      (Number.isSafeInteger(building.customDefinitionVersion)
        && Number(building.customDefinitionVersion) >= 0)
      || (
        typeof building.customDefinitionVersion === 'string'
        && building.customDefinitionVersion.length > 0
      )
    )
      ? building.customDefinitionVersion
      : null;
    if (!localUid || !anchorKey || (!profileId && !fingerprint && version === null)) {
      continue;
    }
    const core = {
      family: 'custom-definition',
      sourceRef: `custom:${localUid}`,
      effect: profileId ? `scene-profile:${profileId}` : 'custom-definition',
      audience,
      localUid,
      ...(definitionId ? { definitionId } : {}),
      ...(revisionId ? { revisionId } : {}),
      ...(contentHash ? { contentHash } : {}),
      ...(version === null ? {} : { definitionVersion: version }),
      ...(fingerprint ? { definitionFingerprint: fingerprint } : {}),
    };
    const id = `provenance:${sceneDigest(core).slice(-16)}`;
    if (!byId.has(id)) {
      byId.set(id, {
        id,
        ...core,
        displayText: profileId
          ? `scene-profile:${profileId}: custom:${localUid}`
          : `custom-definition: custom:${localUid}`,
      });
    }
    refsByElement.set(
      anchorKey,
      [...new Set([...(refsByElement.get(anchorKey) || []), id])]
        .sort(compareSceneCodepoint),
    );
  }
  return {
    entries: sortSceneRecords(
      [...byId.values()],
      (entry) => String(entry.id),
    ),
    /** @param {string} element */
    refsFor(element) {
      return refsByElement.get(element)
        || refsByElement.get(element.replace(/^(building|district|road):/, ''))
        || [];
    },
  };
}

/** Material records referenced by the compiled scene, including skin roles. */
/**
 * @param {Array<{ materialKey: string, skinId: string }>} buildings
 * @param {Array<{ materialId: string }>} vegetation
 * @param {Array<{ materialId: string }>} bridges
 * @param {Array<{ materialId: string }>} quays
 */
export function buildSceneMaterials(buildings, vegetation, bridges, quays) {
  const ids = new Set([
    'material:bridge',
    'material:gate',
    'material:ground',
    'material:quay',
    'material:road',
    'material:wall',
    'material:water',
  ]);
  for (const building of buildings) {
    ids.add(building.materialKey);
    const skinId = String(building.skinId || '');
    for (const assignment of SKIN_ROLE_ASSIGNMENTS[skinId] || []) {
      ids.add(assignment.materialId);
    }
  }
  for (const instance of vegetation) ids.add(instance.materialId);
  for (const bridge of bridges) ids.add(bridge.materialId);
  for (const quay of quays) ids.add(quay.materialId);

  /** @type {Array<Record<string, unknown>>} */
  const materials = [];
  for (const id of [...ids].sort(compareSceneCodepoint)) {
    const definition = MATERIAL_DEFS[id] || MATERIAL_DEFS['material:ground'];
    const skinId = id.startsWith('skin:') ? id.slice(5) : null;
    materials.push({
      id,
      kind: definition.kind,
      skinId,
      colorRole: definition.colorRole,
      roughnessPermille: definition.roughnessPermille,
      metalnessPermille: definition.metalnessPermille,
      roleAssignments: skinId ? (SKIN_ROLE_ASSIGNMENTS[skinId] || []) : [],
    });
  }
  return materials;
}
