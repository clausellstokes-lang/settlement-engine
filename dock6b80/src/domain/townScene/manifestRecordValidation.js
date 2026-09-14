/**
 * Deep record validation for TownSceneManifest.
 *
 * The top-level contract validator owns versioning, canonical ordering, and the
 * audience wall. This module validates the renderer-facing shape of every
 * record the geometry compiler can consume. Keeping the checks independent of
 * the compiler is deliberate: malformed data must fail at the boundary instead
 * of being silently interpreted as a default road, wall, camera, or material.
 */

import { SCENE_OVERRIDE_VARIANT_IDS } from '../townMap/mapEdits.js';
import { CUSTOM_TOWN_SCENE_PROFILE_IDS } from './customBuildingPresentation.js';
import { validateCustomDefinitionReference } from './customDefinitionReferenceValidation.js';

/** @typedef {Record<string, unknown>} SceneRecord */

/** @param {unknown} value @returns {value is SceneRecord} */
function isRecord(value) {
  return !!value && typeof value === 'object' && !Array.isArray(value);
}

/** @param {unknown} value @returns {SceneRecord[]} */
function records(value) {
  return Array.isArray(value) ? value.filter(isRecord) : [];
}

/** @param {unknown} value @param {string} path @param {string[]} errors */
function requireString(value, path, errors) {
  if (typeof value !== 'string' || value.length === 0) {
    errors.push(`${path} must be a non-empty string`);
  }
}

/** @param {unknown} value @param {string} path @param {string[]} errors */
function requireNullableString(value, path, errors) {
  if (value !== null && (typeof value !== 'string' || value.length === 0)) {
    errors.push(`${path} must be null or a non-empty string`);
  }
}

/**
 * @param {unknown} value
 * @param {string} path
 * @param {string[]} errors
 * @param {{ minimum?: number, maximum?: number }} [bounds]
 */
function requireInteger(value, path, errors, bounds = {}) {
  if (!Number.isInteger(value)) {
    errors.push(`${path} must be an integer`);
    return;
  }
  const number = Number(value);
  if (bounds.minimum != null && number < bounds.minimum) {
    errors.push(`${path} must be at least ${bounds.minimum}`);
  }
  if (bounds.maximum != null && number > bounds.maximum) {
    errors.push(`${path} must be at most ${bounds.maximum}`);
  }
}

/**
 * @param {unknown} value
 * @param {string} path
 * @param {string[]} errors
 * @param {{ length?: number, minimum?: number, maximum?: number }} [options]
 */
function requirePoint(value, path, errors, options = {}) {
  const length = options.length ?? 2;
  if (!Array.isArray(value) || value.length !== length) {
    errors.push(`${path} must be a ${length}-integer point`);
    return;
  }
  for (let index = 0; index < length; index++) {
    requireInteger(value[index], `${path}[${index}]`, errors, {
      minimum: options.minimum,
      maximum: options.maximum,
    });
  }
}

/**
 * @param {unknown} value
 * @param {string} path
 * @param {string[]} errors
 * @param {{ minimumLength?: number, allowEmpty?: boolean }} [options]
 */
function requirePlanPolyline(value, path, errors, options = {}) {
  if (!Array.isArray(value)) {
    errors.push(`${path} must be an array of plan points`);
    return;
  }
  const minimumLength = options.minimumLength ?? 2;
  if (!options.allowEmpty && value.length < minimumLength) {
    errors.push(`${path} must contain at least ${minimumLength} plan points`);
  }
  if (options.allowEmpty && value.length > 0 && value.length < minimumLength) {
    errors.push(`${path} must be empty or contain at least ${minimumLength} plan points`);
  }
  for (let index = 0; index < value.length; index++) {
    requirePoint(value[index], `${path}[${index}]`, errors, {
      minimum: 0,
      maximum: 1000,
    });
  }
}

/**
 * @param {unknown} value
 * @param {string} path
 * @param {string[]} errors
 * @param {{ allowEmpty?: boolean }} [options]
 */
function requireStringArray(value, path, errors, options = {}) {
  if (!Array.isArray(value)) {
    errors.push(`${path} must be an array of strings`);
    return;
  }
  if (!options.allowEmpty && value.length === 0) {
    errors.push(`${path} must contain at least one string`);
  }
  for (let index = 0; index < value.length; index++) {
    requireString(value[index], `${path}[${index}]`, errors);
  }
}

/**
 * Validate an identity in an external address space. The manifest intentionally
 * cannot resolve Realm and Chronicle ids internally, but it can require their
 * typed, bounded shape.
 *
 * @param {unknown} value
 * @param {string} path
 * @param {string[]} errors
 * @param {{ nullable?: boolean }} [options]
 */
function requireTypedReference(value, path, errors, options = {}) {
  if (options.nullable && value === null) return;
  if (!isRecord(value)) {
    errors.push(`${path} must be an object${options.nullable ? ' or null' : ''}`);
    return;
  }
  requireString(value.kind, `${path}.kind`, errors);
  requireString(value.id, `${path}.id`, errors);
}

/**
 * @param {unknown} value
 * @param {string} path
 * @param {string[]} errors
 */
function requireTypedReferenceArray(value, path, errors) {
  if (!Array.isArray(value)) {
    errors.push(`${path} must be an array of typed references`);
    return;
  }
  for (let index = 0; index < value.length; index++) {
    requireTypedReference(value[index], `${path}[${index}]`, errors);
  }
}

/**
 * @param {unknown} value
 * @param {string} path
 * @param {string[]} errors
 */
function requireTriggerReference(value, path, errors) {
  if (value === null) return;
  if (!isRecord(value)) {
    errors.push(`${path} must be an object or null`);
    return;
  }
  requireNullableString(value.eventType, `${path}.eventType`, errors);
  requireNullableString(value.targetId, `${path}.targetId`, errors);
  if (value.tick !== null) {
    requireInteger(value.tick, `${path}.tick`, errors, { minimum: 0 });
  }
}

/**
 * Validate the discriminated payload behind one semantic selection. These
 * fields are consumed by product UI, so allowing arbitrary objects here would
 * move schema failures from the manifest boundary into click handling.
 *
 * @param {SceneRecord} details
 * @param {string} entityKind
 * @param {string} path
 * @param {string[]} errors
 */
function validateSemanticDetails(details, entityKind, path, errors) {
  if (details.kind !== entityKind) {
    errors.push(`${path}.kind must equal the semantic entityKind`);
  }
  switch (entityKind) {
    case 'district':
      for (const field of ['category', 'wealthBand', 'safetyBand']) {
        requireString(details[field], `${path}.${field}`, errors);
      }
      requireInteger(details.densityPermille, `${path}.densityPermille`, errors, {
        minimum: 0,
        maximum: 1000,
      });
      if (typeof details.synthetic !== 'boolean') {
        errors.push(`${path}.synthetic must be a boolean`);
      }
      break;
    case 'building':
      requireNullableString(details.districtId, `${path}.districtId`, errors);
      for (const field of ['generatedFabric', 'landmark']) {
        if (typeof details[field] !== 'boolean') {
          errors.push(`${path}.${field} must be a boolean`);
        }
      }
      break;
    case 'road':
      requireString(details.roadKind, `${path}.roadKind`, errors);
      requireInteger(details.widthPlan, `${path}.widthPlan`, errors, { minimum: 1 });
      for (const field of ['districtIds', 'gateIds', 'bridgeIds']) {
        requireStringArray(details[field], `${path}.${field}`, errors, { allowEmpty: true });
      }
      for (const field of ['connectionLabel', 'relationshipType', 'connectionBasis']) {
        requireNullableString(details[field], `${path}.${field}`, errors);
      }
      break;
    case 'wall':
      requireNullableString(details.defenseReadiness, `${path}.defenseReadiness`, errors);
      requireInteger(details.strengthPermille, `${path}.strengthPermille`, errors, {
        minimum: 0,
        maximum: 1000,
      });
      requireNullableString(details.protectedDistrictId, `${path}.protectedDistrictId`, errors);
      requireStringArray(details.gateIds, `${path}.gateIds`, errors, { allowEmpty: true });
      break;
    case 'gate':
      requireNullableString(details.defenseReadiness, `${path}.defenseReadiness`, errors);
      requireNullableString(details.openingState, `${path}.openingState`, errors);
      requireString(details.wallId, `${path}.wallId`, errors);
      requireStringArray(details.roadIds, `${path}.roadIds`, errors, { allowEmpty: true });
      requireInteger(details.openingWidthCm, `${path}.openingWidthCm`, errors, { minimum: 1 });
      requireInteger(details.openingHeightCm, `${path}.openingHeightCm`, errors, { minimum: 1 });
      break;
    case 'bridge':
      requireString(details.bridgeKind, `${path}.bridgeKind`, errors);
      requireString(details.roadId, `${path}.roadId`, errors);
      requireString(details.waterId, `${path}.waterId`, errors);
      requireInteger(details.widthPlan, `${path}.widthPlan`, errors, { minimum: 1 });
      requireNullableString(details.connectionLabel, `${path}.connectionLabel`, errors);
      requireNullableString(details.connectionBasis, `${path}.connectionBasis`, errors);
      break;
    case 'quay':
      requireString(details.districtId, `${path}.districtId`, errors);
      requireString(details.waterId, `${path}.waterId`, errors);
      requireInteger(details.widthPlan, `${path}.widthPlan`, errors, { minimum: 1 });
      break;
    case 'water':
      requireString(details.waterKind, `${path}.waterKind`, errors);
      requireInteger(details.widthPlan, `${path}.widthPlan`, errors, { minimum: 1 });
      break;
    case 'condition':
    case 'hazard':
      requireString(details.archetype, `${path}.archetype`, errors);
      requireString(details.severityBand, `${path}.severityBand`, errors);
      requireInteger(details.severityPermille, `${path}.severityPermille`, errors, {
        minimum: 0,
        maximum: 1000,
      });
      requireNullableString(details.status, `${path}.status`, errors);
      for (const field of ['districtIds', 'buildingIds', 'wallIds', 'affectedSystems']) {
        requireStringArray(details[field], `${path}.${field}`, errors, { allowEmpty: true });
      }
      requireTriggerReference(details.triggerRef, `${path}.triggerRef`, errors);
      break;
    case 'scar':
      requireString(details.scarKind, `${path}.scarKind`, errors);
      requireInteger(details.severityPermille, `${path}.severityPermille`, errors, {
        minimum: 0,
        maximum: 1000,
      });
      requireInteger(details.week, `${path}.week`, errors, { minimum: 0 });
      for (const field of ['districtId', 'wallId', 'buildingId']) {
        requireNullableString(details[field], `${path}.${field}`, errors);
      }
      requireTriggerReference(details.triggerRef, `${path}.triggerRef`, errors);
      break;
    case 'reconstruction':
      requireString(details.reconstructionType, `${path}.reconstructionType`, errors);
      requireInteger(details.week, `${path}.week`, errors, { minimum: 0 });
      requireStringArray(details.districtIds, `${path}.districtIds`, errors, { allowEmpty: true });
      requireStringArray(details.classes, `${path}.classes`, errors, { allowEmpty: true });
      requireString(details.freshnessBand, `${path}.freshnessBand`, errors);
      requireTriggerReference(details.triggerRef, `${path}.triggerRef`, errors);
      break;
    default:
      errors.push(`${path}.kind is not an implemented semantic record type`);
  }
}

/**
 * @param {unknown} value
 * @param {string} path
 * @param {string[]} errors
 * @param {number} headingSteps
 */
function requireHeading(value, path, errors, headingSteps) {
  requireInteger(value, path, errors, {
    minimum: 0,
    maximum: headingSteps - 1,
  });
}

/**
 * Validate the legacy illustration marks retained as terrain provenance. The
 * WebGL compiler currently uses the heightfield, but these records are still
 * serialized and must remain bounded JSON rather than an arbitrary payload.
 *
 * @param {unknown} value
 * @param {string} path
 * @param {string[]} errors
 */
function validateTerrainMarks(value, path, errors) {
  if (!Array.isArray(value)) {
    errors.push(`${path} must be an array`);
    return;
  }
  for (let index = 0; index < value.length; index++) {
    const mark = value[index];
    const markPath = `${path}[${index}]`;
    if (!isRecord(mark)) {
      errors.push(`${markPath} must be an object`);
      continue;
    }
    if (mark.m === 'curve') {
      requirePlanPolyline(mark.pts, `${markPath}.pts`, errors);
      requireInteger(mark.w, `${markPath}.w`, errors, { minimum: 0 });
    } else if (mark.m === 'stroke') {
      for (const field of ['x1', 'y1', 'x2', 'y2']) {
        requireInteger(mark[field], `${markPath}.${field}`, errors, {
          minimum: 0,
          maximum: 1000,
        });
      }
      requireInteger(mark.w, `${markPath}.w`, errors, { minimum: 0 });
    } else if (mark.m === 'dot') {
      for (const field of ['x', 'y']) {
        requireInteger(mark[field], `${markPath}.${field}`, errors, {
          minimum: 0,
          maximum: 1000,
        });
      }
      requireInteger(mark.r, `${markPath}.r`, errors, { minimum: 1 });
    } else {
      errors.push(`${markPath}.m must be curve, stroke, or dot`);
    }
  }
}

/**
 * Validate every renderer-facing record in a manifest.
 *
 * @param {SceneRecord} manifest
 * @param {string[]} errors
 * @param {{ headingSteps: number, elevationSteps: number }} vocabulary
 */
export function validateTownSceneRecordShapes(manifest, errors, vocabulary) {
  const terrain = isRecord(manifest.terrain) ? manifest.terrain : {};
  requireString(terrain.profileId, 'terrain.profileId', errors);
  requireString(terrain.materialId, 'terrain.materialId', errors);

  for (const [index, water] of records(terrain.waterBodies).entries()) {
    const path = `terrain.waterBodies[${index}]`;
    requireString(water.kind, `${path}.kind`, errors);
    requirePlanPolyline(water.path, `${path}.path`, errors);
    requirePlanPolyline(water.surfacePolygon, `${path}.surfacePolygon`, errors, {
      minimumLength: 3,
      allowEmpty: true,
    });
    requireInteger(water.widthPlan, `${path}.widthPlan`, errors, { minimum: 1 });
    requireInteger(water.elevationCm, `${path}.elevationCm`, errors);
    requireString(water.materialId, `${path}.materialId`, errors);
  }

  for (const [index, landform] of records(terrain.landforms).entries()) {
    const path = `terrain.landforms[${index}]`;
    requireString(landform.kind, `${path}.kind`, errors);
    validateTerrainMarks(landform.marks, `${path}.marks`, errors);
  }

  for (const [index, district] of records(manifest.districts).entries()) {
    const path = `districts[${index}]`;
    for (const field of ['anchorKey', 'name', 'category', 'wealthBand', 'safetyBand']) {
      requireString(district[field], `${path}.${field}`, errors);
    }
    requirePlanPolyline(district.footprint, `${path}.footprint`, errors, { minimumLength: 3 });
    requirePoint(district.centroid, `${path}.centroid`, errors, { minimum: 0, maximum: 1000 });
    requireInteger(district.elevationCm, `${path}.elevationCm`, errors);
    requireInteger(district.densityPermille, `${path}.densityPermille`, errors, {
      minimum: 0,
      maximum: 1000,
    });
    requireInteger(district.flammabilityPermille, `${path}.flammabilityPermille`, errors, {
      minimum: 0,
      maximum: 1000,
    });
    if (typeof district.synthetic !== 'boolean') errors.push(`${path}.synthetic must be a boolean`);
    requireStringArray(district.provenanceRefs, `${path}.provenanceRefs`, errors, { allowEmpty: true });
  }

  for (const [index, road] of records(manifest.roads).entries()) {
    const path = `roads[${index}]`;
    requireString(road.kind, `${path}.kind`, errors);
    requirePlanPolyline(road.centerline, `${path}.centerline`, errors);
    requireInteger(road.widthPlan, `${path}.widthPlan`, errors, { minimum: 1 });
    requireInteger(road.widthCm, `${path}.widthCm`, errors, { minimum: 1 });
    requireInteger(road.elevationOffsetCm, `${path}.elevationOffsetCm`, errors);
    requireString(road.materialId, `${path}.materialId`, errors);
    requireStringArray(road.districtIds, `${path}.districtIds`, errors, { allowEmpty: true });
    requireStringArray(road.provenanceRefs, `${path}.provenanceRefs`, errors, { allowEmpty: true });
  }

  for (const [index, wall] of records(manifest.walls).entries()) {
    const path = `walls[${index}]`;
    requirePlanPolyline(wall.centerline, `${path}.centerline`, errors);
    requireInteger(wall.heightCm, `${path}.heightCm`, errors, { minimum: 1 });
    requireInteger(wall.widthCm, `${path}.widthCm`, errors, { minimum: 1 });
    requireInteger(wall.strengthPermille, `${path}.strengthPermille`, errors, {
      minimum: 0,
      maximum: 1000,
    });
    requireNullableString(wall.protectedDistrictId, `${path}.protectedDistrictId`, errors);
    requireStringArray(wall.gateIds, `${path}.gateIds`, errors, { allowEmpty: true });
    requireString(wall.materialId, `${path}.materialId`, errors);
    requireStringArray(wall.conditionRefs, `${path}.conditionRefs`, errors, { allowEmpty: true });
    requireStringArray(wall.provenanceRefs, `${path}.provenanceRefs`, errors, { allowEmpty: true });
  }

  for (const [index, gate] of records(manifest.gates).entries()) {
    const path = `gates[${index}]`;
    requireString(gate.wallId, `${path}.wallId`, errors);
    requirePoint(gate.position, `${path}.position`, errors, { minimum: 0, maximum: 1000 });
    requireHeading(gate.headingStep, `${path}.headingStep`, errors, vocabulary.headingSteps);
    for (const field of ['openingWidthCm', 'openingHeightCm', 'towerWidthCm', 'towerHeightCm']) {
      requireInteger(gate[field], `${path}.${field}`, errors, { minimum: 1 });
    }
    requireString(gate.materialId, `${path}.materialId`, errors);
    requireStringArray(gate.roadIds, `${path}.roadIds`, errors, { allowEmpty: true });
    requireStringArray(gate.provenanceRefs, `${path}.provenanceRefs`, errors, { allowEmpty: true });
  }

  for (const field of ['bridges', 'quays']) {
    const districtRequired = field === 'quays';
    for (const [index, record] of records(manifest[field]).entries()) {
      const path = `${field}[${index}]`;
      if (field === 'bridges') {
        requireString(record.kind, `${path}.kind`, errors);
        requireString(record.roadId, `${path}.roadId`, errors);
      }
      if (districtRequired) requireString(record.districtId, `${path}.districtId`, errors);
      requireString(record.waterId, `${path}.waterId`, errors);
      requirePoint(record.position, `${path}.position`, errors, { minimum: 0, maximum: 1000 });
      requirePlanPolyline(record.centerline, `${path}.centerline`, errors);
      requireHeading(record.headingStep, `${path}.headingStep`, errors, vocabulary.headingSteps);
      requireInteger(record.widthPlan, `${path}.widthPlan`, errors, { minimum: 1 });
      requireInteger(record.widthCm, `${path}.widthCm`, errors, { minimum: 1 });
      requireInteger(record.deckElevationCm, `${path}.deckElevationCm`, errors);
      requireString(record.materialId, `${path}.materialId`, errors);
      requireStringArray(record.provenanceRefs, `${path}.provenanceRefs`, errors, { allowEmpty: true });
    }
  }

  for (const [index, building] of records(manifest.buildings).entries()) {
    const path = `buildings[${index}]`;
    for (const field of [
      'semanticId', 'anchorKey', 'districtId', 'shapeKind', 'skinId',
      'variantId', 'geometryKey', 'materialKey',
    ]) {
      requireString(building[field], `${path}.${field}`, errors);
    }
    if (
      building.variantId !== 'default'
      && !SCENE_OVERRIDE_VARIANT_IDS.includes(
        /** @type {'mirror'} */ (building.variantId),
      )
    ) {
      errors.push(`${path}.variantId is not an implemented scene variant`);
    }
    if (Object.prototype.hasOwnProperty.call(building, 'sceneProfileId')) {
      requireString(building.sceneProfileId, `${path}.sceneProfileId`, errors);
      if (!CUSTOM_TOWN_SCENE_PROFILE_IDS.includes(String(building.sceneProfileId))) {
        errors.push(`${path}.sceneProfileId is not a registered custom scene profile`);
      }
    }
    requirePoint(building.mapAnchor, `${path}.mapAnchor`, errors, { minimum: 0, maximum: 1000 });
    requirePoint(building.renderCenter, `${path}.renderCenter`, errors, { minimum: 0, maximum: 1000 });
    requirePlanPolyline(building.footprint, `${path}.footprint`, errors, { minimumLength: 3 });
    requireHeading(building.headingStep, `${path}.headingStep`, errors, vocabulary.headingSteps);
    requireInteger(building.planUnitCm, `${path}.planUnitCm`, errors, { minimum: 1 });
    if (typeof building.landmark !== 'boolean') errors.push(`${path}.landmark must be a boolean`);
    if (typeof building.generatedFabric !== 'boolean') errors.push(`${path}.generatedFabric must be a boolean`);
    requireStringArray(building.provenanceRefs, `${path}.provenanceRefs`, errors, { allowEmpty: true });
    const condition = isRecord(building.conditionProfile) ? building.conditionProfile : null;
    if (!condition) {
      errors.push(`${path}.conditionProfile must be an object`);
    } else {
      for (const [key, value] of Object.entries(condition)) {
        if (typeof value !== 'number' || !Number.isFinite(value)) {
          errors.push(`${path}.conditionProfile.${key} must be finite`);
        }
      }
    }
  }

  for (const [index, vegetation] of records(manifest.vegetation).entries()) {
    const path = `vegetation[${index}]`;
    for (const field of ['kind', 'instanceKey', 'materialId']) {
      requireString(vegetation[field], `${path}.${field}`, errors);
    }
    requirePoint(vegetation.position, `${path}.position`, errors, { minimum: 0, maximum: 1000 });
    requireHeading(vegetation.headingStep, `${path}.headingStep`, errors, vocabulary.headingSteps);
    requireInteger(vegetation.sizeBand, `${path}.sizeBand`, errors, { minimum: 0 });
    requireNullableString(vegetation.districtId, `${path}.districtId`, errors);
  }

  for (const [index, material] of records(manifest.materials).entries()) {
    const path = `materials[${index}]`;
    requireString(material.kind, `${path}.kind`, errors);
    requireNullableString(material.skinId, `${path}.skinId`, errors);
    requireString(material.colorRole, `${path}.colorRole`, errors);
    requireInteger(material.roughnessPermille, `${path}.roughnessPermille`, errors, {
      minimum: 0,
      maximum: 1000,
    });
    requireInteger(material.metalnessPermille, `${path}.metalnessPermille`, errors, {
      minimum: 0,
      maximum: 1000,
    });
    if (!Array.isArray(material.roleAssignments)) {
      errors.push(`${path}.roleAssignments must be an array`);
    } else {
      for (let roleIndex = 0; roleIndex < material.roleAssignments.length; roleIndex++) {
        const assignment = material.roleAssignments[roleIndex];
        const rolePath = `${path}.roleAssignments[${roleIndex}]`;
        if (!isRecord(assignment)) {
          errors.push(`${rolePath} must be an object`);
          continue;
        }
        for (const field of ['role', 'materialId', 'weatheringId']) {
          requireString(assignment[field], `${rolePath}.${field}`, errors);
        }
      }
    }
  }

  for (const [index, provenance] of records(manifest.provenance).entries()) {
    const path = `provenance[${index}]`;
    for (const field of ['family', 'sourceRef', 'effect', 'displayText']) {
      requireString(provenance[field], `${path}.${field}`, errors);
    }
    requireString(provenance.audience, `${path}.audience`, errors);
    if (Object.prototype.hasOwnProperty.call(provenance, 'localUid')) {
      requireString(provenance.localUid, `${path}.localUid`, errors);
    }
    validateCustomDefinitionReference(provenance, path, errors);
  }

  for (const [index, semantic] of records(manifest.semantics).entries()) {
    const path = `semantics[${index}]`;
    requireString(semantic.entityKind, `${path}.entityKind`, errors);
    requireNullableString(semantic.anchorKey, `${path}.anchorKey`, errors);
    requireNullableString(semantic.districtId, `${path}.districtId`, errors);
    requireString(semantic.label, `${path}.label`, errors);
    requireStringArray(semantic.provenanceRefs, `${path}.provenanceRefs`, errors, { allowEmpty: true });
    const canonicalRef = isRecord(semantic.canonicalRef) ? semantic.canonicalRef : null;
    if (!canonicalRef) {
      errors.push(`${path}.canonicalRef must be an object`);
    } else {
      requireString(canonicalRef.kind, `${path}.canonicalRef.kind`, errors);
      requireString(canonicalRef.id, `${path}.canonicalRef.id`, errors);
      validateCustomDefinitionReference(
        canonicalRef,
        `${path}.canonicalRef`,
        errors,
      );
    }
    requireTypedReference(semantic.realmRef, `${path}.realmRef`, errors, { nullable: true });
    requireTypedReference(semantic.workbenchRef, `${path}.workbenchRef`, errors, { nullable: true });
    requireTypedReferenceArray(semantic.chronicleRefs, `${path}.chronicleRefs`, errors);
    const relatedRefs = isRecord(semantic.relatedRefs) ? semantic.relatedRefs : null;
    if (!relatedRefs) {
      errors.push(`${path}.relatedRefs must be an object`);
    } else {
      requireTypedReferenceArray(
        relatedRefs.factionRefs,
        `${path}.relatedRefs.factionRefs`,
        errors,
      );
      requireTypedReferenceArray(
        relatedRefs.pressureRefs,
        `${path}.relatedRefs.pressureRefs`,
        errors,
      );
      requireTypedReferenceArray(
        relatedRefs.storyRefs,
        `${path}.relatedRefs.storyRefs`,
        errors,
      );
    }
    const details = isRecord(semantic.details) ? semantic.details : null;
    if (!details) {
      errors.push(`${path}.details must be an object`);
    } else {
      requireString(details.kind, `${path}.details.kind`, errors);
      validateSemanticDetails(
        details,
        String(semantic.entityKind || ''),
        `${path}.details`,
        errors,
      );
    }
  }

  for (const [index, camera] of records(manifest.cameraPresets).entries()) {
    const path = `cameraPresets[${index}]`;
    requirePoint(camera.target, `${path}.target`, errors, { length: 3 });
    requireHeading(camera.azimuthStep, `${path}.azimuthStep`, errors, vocabulary.headingSteps);
    requireHeading(camera.elevationStep, `${path}.elevationStep`, errors, vocabulary.elevationSteps);
    requireInteger(camera.distanceCm, `${path}.distanceCm`, errors, { minimum: 1 });
  }

  const living = isRecord(manifest.living) ? manifest.living : {};
  for (const [index, condition] of records(living.conditions).entries()) {
    const path = `living.conditions[${index}]`;
    for (const field of ['kind', 'archetype', 'label', 'severityBand']) {
      requireString(condition[field], `${path}.${field}`, errors);
    }
    requireInteger(condition.severityPermille, `${path}.severityPermille`, errors, {
      minimum: 0,
      maximum: 1000,
    });
    for (const field of ['districtIds', 'buildingIds', 'wallIds', 'provenanceRefs']) {
      requireStringArray(condition[field], `${path}.${field}`, errors, { allowEmpty: true });
    }
    requireNullableString(condition.status, `${path}.status`, errors);
    requireStringArray(condition.affectedSystems, `${path}.affectedSystems`, errors, { allowEmpty: true });
    requireTypedReferenceArray(condition.chronicleRefs, `${path}.chronicleRefs`, errors);
    requireTriggerReference(condition.triggerRef, `${path}.triggerRef`, errors);
    if (condition.position !== undefined) {
      requirePoint(condition.position, `${path}.position`, errors, { minimum: 0, maximum: 1000 });
    }
  }

  for (const [index, scar] of records(living.scars).entries()) {
    const path = `living.scars[${index}]`;
    requireString(scar.kind, `${path}.kind`, errors);
    requireInteger(scar.severityPermille, `${path}.severityPermille`, errors, {
      minimum: 0,
      maximum: 1000,
    });
    requireInteger(scar.week, `${path}.week`, errors, { minimum: 0 });
    for (const field of ['districtId', 'wallId', 'buildingId']) {
      requireNullableString(scar[field], `${path}.${field}`, errors);
    }
    requireStringArray(scar.provenanceRefs, `${path}.provenanceRefs`, errors, { allowEmpty: true });
    requireTypedReferenceArray(scar.chronicleRefs, `${path}.chronicleRefs`, errors);
    requireTriggerReference(scar.triggerRef, `${path}.triggerRef`, errors);
  }

  for (const [index, reconstruction] of records(living.reconstruction).entries()) {
    const path = `living.reconstruction[${index}]`;
    requireString(reconstruction.type, `${path}.type`, errors);
    requireInteger(reconstruction.week, `${path}.week`, errors, { minimum: 0 });
    requireStringArray(reconstruction.districtIds, `${path}.districtIds`, errors, { allowEmpty: true });
    requireStringArray(reconstruction.classes, `${path}.classes`, errors, { allowEmpty: true });
    requireString(reconstruction.freshnessBand, `${path}.freshnessBand`, errors);
    requireStringArray(reconstruction.provenanceRefs, `${path}.provenanceRefs`, errors, { allowEmpty: true });
    requireTypedReferenceArray(reconstruction.chronicleRefs, `${path}.chronicleRefs`, errors);
    requireTriggerReference(reconstruction.triggerRef, `${path}.triggerRef`, errors);
  }

  const atmosphere = isRecord(living.atmosphere) ? living.atmosphere : {};
  requireNullableString(atmosphere.season, 'living.atmosphere.season', errors);
  requireNullableString(atmosphere.severity, 'living.atmosphere.severity', errors);
  if (typeof atmosphere.besieged !== 'boolean') {
    errors.push('living.atmosphere.besieged must be a boolean');
  }
  requireInteger(atmosphere.scarLevelPermille, 'living.atmosphere.scarLevelPermille', errors, {
    minimum: 0,
    maximum: 1000,
  });
  requireStringArray(atmosphere.rebuiltCategories, 'living.atmosphere.rebuiltCategories', errors, {
    allowEmpty: true,
  });
  if (atmosphere.festivalScale !== null) {
    requireInteger(atmosphere.festivalScale, 'living.atmosphere.festivalScale', errors, {
      minimum: 0,
    });
  }

  const budgets = isRecord(manifest.budgets) ? manifest.budgets : {};
  for (const field of [
    'maximumBuildings', 'maximumVegetationInstances', 'maximumUniqueMeshes',
  ]) {
    requireInteger(budgets[field], `budgets.${field}`, errors, { minimum: 1 });
  }
  if (!Array.isArray(budgets.maximumTrianglesByLod) || budgets.maximumTrianglesByLod.length !== 3) {
    errors.push('budgets.maximumTrianglesByLod must contain exactly three entries');
  } else {
    for (let index = 0; index < budgets.maximumTrianglesByLod.length; index++) {
      requireInteger(
        budgets.maximumTrianglesByLod[index],
        `budgets.maximumTrianglesByLod[${index}]`,
        errors,
        { minimum: 1 },
      );
    }
  }
}

/**
 * @param {unknown} value
 * @param {string} key
 * @returns {Set<string>}
 */
function recordIds(value, key = 'id') {
  /** @type {Set<string>} */
  const ids = new Set();
  for (const row of records(value)) {
    const id = row[key];
    if (typeof id === 'string' && id.length > 0) ids.add(id);
  }
  return ids;
}

/**
 * @param {unknown} value
 * @param {Set<string>} allowed
 * @param {string} path
 * @param {string[]} errors
 * @param {{ nullable?: boolean }} [options]
 */
function requireReference(value, allowed, path, errors, options = {}) {
  if (options.nullable && value === null) return;
  if (typeof value !== 'string' || !allowed.has(value)) {
    errors.push(`${path} must resolve to an existing manifest record`);
  }
}

/**
 * @param {unknown} value
 * @param {Set<string>} allowed
 * @param {string} path
 * @param {string[]} errors
 */
function requireReferenceArray(value, allowed, path, errors) {
  if (!Array.isArray(value)) return;
  for (let index = 0; index < value.length; index++) {
    requireReference(value[index], allowed, `${path}[${index}]`, errors);
  }
}

/**
 * Validate every internal manifest join. Shape validation alone is not enough:
 * a syntactically valid ghost id would otherwise become a pick target with no
 * semantic record, or silently select a nonexistent material/provenance entry.
 *
 * @param {SceneRecord} manifest
 * @param {string[]} errors
 */
export function validateTownSceneRecordReferences(manifest, errors) {
  const terrain = isRecord(manifest.terrain) ? manifest.terrain : {};
  const living = isRecord(manifest.living) ? manifest.living : {};
  const districtIds = recordIds(manifest.districts);
  const roadIds = recordIds(manifest.roads);
  const wallIds = recordIds(manifest.walls);
  const gateIds = recordIds(manifest.gates);
  const bridgeIds = recordIds(manifest.bridges);
  const quayIds = recordIds(manifest.quays);
  const buildingIds = recordIds(manifest.buildings);
  const vegetationIds = recordIds(manifest.vegetation);
  const waterIds = recordIds(terrain.waterBodies);
  const materialIds = recordIds(manifest.materials);
  const provenanceIds = recordIds(manifest.provenance);
  const semanticIds = recordIds(manifest.semantics, 'sceneId');
  const conditionIds = recordIds(living.conditions);
  const scarIds = recordIds(living.scars);
  const reconstructionIds = recordIds(living.reconstruction);
  const livingIds = new Set([...conditionIds, ...scarIds, ...reconstructionIds]);
  const physicalSemanticIds = new Set([
    ...roadIds,
    ...wallIds,
    ...gateIds,
    ...bridgeIds,
    ...quayIds,
    ...buildingIds,
    ...waterIds,
    ...[...districtIds].map((id) => `district:${id}`),
  ]);
  const expectedSemanticIds = new Set([...physicalSemanticIds, ...livingIds]);

  requireReference(terrain.materialId, materialIds, 'terrain.materialId', errors);
  for (const [index, water] of records(terrain.waterBodies).entries()) {
    requireReference(water.materialId, materialIds, `terrain.waterBodies[${index}].materialId`, errors);
    requireReference(water.id, semanticIds, `terrain.waterBodies[${index}].id`, errors);
  }

  for (const [index, district] of records(manifest.districts).entries()) {
    requireReference(`district:${String(district.id)}`, semanticIds, `districts[${index}].id`, errors);
    requireReferenceArray(district.provenanceRefs, provenanceIds, `districts[${index}].provenanceRefs`, errors);
  }

  for (const [index, road] of records(manifest.roads).entries()) {
    const path = `roads[${index}]`;
    requireReference(road.id, semanticIds, `${path}.id`, errors);
    requireReference(road.materialId, materialIds, `${path}.materialId`, errors);
    requireReferenceArray(road.districtIds, districtIds, `${path}.districtIds`, errors);
    requireReferenceArray(road.provenanceRefs, provenanceIds, `${path}.provenanceRefs`, errors);
  }

  for (const [index, wall] of records(manifest.walls).entries()) {
    const path = `walls[${index}]`;
    requireReference(wall.id, semanticIds, `${path}.id`, errors);
    requireReference(wall.materialId, materialIds, `${path}.materialId`, errors);
    requireReference(wall.protectedDistrictId, districtIds, `${path}.protectedDistrictId`, errors, {
      nullable: true,
    });
    requireReferenceArray(wall.gateIds, gateIds, `${path}.gateIds`, errors);
    requireReferenceArray(wall.conditionRefs, conditionIds, `${path}.conditionRefs`, errors);
    requireReferenceArray(wall.provenanceRefs, provenanceIds, `${path}.provenanceRefs`, errors);
  }

  for (const [index, gate] of records(manifest.gates).entries()) {
    const path = `gates[${index}]`;
    requireReference(gate.id, semanticIds, `${path}.id`, errors);
    requireReference(gate.wallId, wallIds, `${path}.wallId`, errors);
    requireReference(gate.materialId, materialIds, `${path}.materialId`, errors);
    requireReferenceArray(gate.roadIds, roadIds, `${path}.roadIds`, errors);
    requireReferenceArray(gate.provenanceRefs, provenanceIds, `${path}.provenanceRefs`, errors);
  }

  for (const field of ['bridges', 'quays']) {
    for (const [index, record] of records(manifest[field]).entries()) {
      const path = `${field}[${index}]`;
      requireReference(record.id, semanticIds, `${path}.id`, errors);
      requireReference(record.waterId, waterIds, `${path}.waterId`, errors);
      requireReference(record.materialId, materialIds, `${path}.materialId`, errors);
      requireReferenceArray(record.provenanceRefs, provenanceIds, `${path}.provenanceRefs`, errors);
      if (field === 'bridges') {
        requireReference(record.roadId, roadIds, `${path}.roadId`, errors);
      } else {
        requireReference(record.districtId, districtIds, `${path}.districtId`, errors);
      }
    }
  }

  for (const [index, building] of records(manifest.buildings).entries()) {
    const path = `buildings[${index}]`;
    requireReference(building.id, semanticIds, `${path}.id`, errors);
    requireReference(building.semanticId, semanticIds, `${path}.semanticId`, errors);
    if (building.semanticId !== building.id) {
      errors.push(`${path}.semanticId must equal ${path}.id`);
    }
    requireReference(building.districtId, districtIds, `${path}.districtId`, errors);
    requireReference(building.materialKey, materialIds, `${path}.materialKey`, errors);
    requireReferenceArray(building.provenanceRefs, provenanceIds, `${path}.provenanceRefs`, errors);
  }

  for (const [index, vegetation] of records(manifest.vegetation).entries()) {
    const path = `vegetation[${index}]`;
    requireReference(vegetation.materialId, materialIds, `${path}.materialId`, errors);
    requireReference(vegetation.districtId, districtIds, `${path}.districtId`, errors, {
      nullable: true,
    });
  }

  for (const [index, material] of records(manifest.materials).entries()) {
    if (!Array.isArray(material.roleAssignments)) continue;
    for (let roleIndex = 0; roleIndex < material.roleAssignments.length; roleIndex++) {
      const assignment = material.roleAssignments[roleIndex];
      if (!isRecord(assignment)) continue;
      requireReference(
        assignment.materialId,
        materialIds,
        `materials[${index}].roleAssignments[${roleIndex}].materialId`,
        errors,
      );
    }
  }

  for (const [index, semantic] of records(manifest.semantics).entries()) {
    const path = `semantics[${index}]`;
    requireReference(semantic.sceneId, expectedSemanticIds, `${path}.sceneId`, errors);
    requireReference(semantic.districtId, districtIds, `${path}.districtId`, errors, {
      nullable: true,
    });
    requireReferenceArray(semantic.provenanceRefs, provenanceIds, `${path}.provenanceRefs`, errors);
  }

  for (const [index, condition] of records(living.conditions).entries()) {
    const path = `living.conditions[${index}]`;
    requireReference(condition.id, semanticIds, `${path}.id`, errors);
    requireReferenceArray(condition.districtIds, districtIds, `${path}.districtIds`, errors);
    requireReferenceArray(condition.buildingIds, buildingIds, `${path}.buildingIds`, errors);
    requireReferenceArray(condition.wallIds, wallIds, `${path}.wallIds`, errors);
    requireReferenceArray(condition.provenanceRefs, provenanceIds, `${path}.provenanceRefs`, errors);
  }

  for (const [index, scar] of records(living.scars).entries()) {
    const path = `living.scars[${index}]`;
    requireReference(scar.id, semanticIds, `${path}.id`, errors);
    requireReference(scar.districtId, districtIds, `${path}.districtId`, errors, { nullable: true });
    requireReference(scar.wallId, wallIds, `${path}.wallId`, errors, { nullable: true });
    requireReference(scar.buildingId, buildingIds, `${path}.buildingId`, errors, { nullable: true });
    requireReferenceArray(scar.provenanceRefs, provenanceIds, `${path}.provenanceRefs`, errors);
  }

  for (const [index, reconstruction] of records(living.reconstruction).entries()) {
    const path = `living.reconstruction[${index}]`;
    requireReference(reconstruction.id, semanticIds, `${path}.id`, errors);
    requireReferenceArray(reconstruction.districtIds, districtIds, `${path}.districtIds`, errors);
    requireReferenceArray(reconstruction.provenanceRefs, provenanceIds, `${path}.provenanceRefs`, errors);
  }

  const budgets = isRecord(manifest.budgets) ? manifest.budgets : {};
  if (Number.isInteger(budgets.maximumBuildings) && Number(budgets.maximumBuildings) < buildingIds.size) {
    errors.push('budgets.maximumBuildings must cover every building');
  }
  if (
    Number.isInteger(budgets.maximumVegetationInstances)
    && Number(budgets.maximumVegetationInstances) < vegetationIds.size
  ) {
    errors.push('budgets.maximumVegetationInstances must cover every vegetation instance');
  }
  const templateIds = new Set();
  for (const building of records(manifest.buildings)) {
    for (const lod of [0, 1, 2]) {
      templateIds.add(
        `building:${String(building.shapeKind)}:${String(building.variantId)}:${lod}`,
      );
    }
  }
  for (const vegetation of records(manifest.vegetation)) {
    templateIds.add(`vegetation:${String(vegetation.kind)}`);
  }
  if (
    Number.isInteger(budgets.maximumUniqueMeshes)
    && templateIds.size > Number(budgets.maximumUniqueMeshes)
  ) {
    errors.push(
      `budgets.maximumUniqueMeshes must cover ${templateIds.size} reusable templates`,
    );
  }
}
