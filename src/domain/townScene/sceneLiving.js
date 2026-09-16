/**
 * Living-state compilation for TownSceneManifest.
 *
 * Conditions, persistent scars, reconstruction, and atmosphere remain separate
 * channels because they have different lifecycles and cache axes. Audience
 * filtering occurs before these records are built, and map dress passes through
 * the same final audience wall used by the canonical 2D presentation.
 */

import {
  projectTownMapDressForAudience,
} from '../townMap/audienceProjection.js';
import { resolveMapDress } from '../townMap/mapDress.js';
import {
  boundedSceneString,
  clampSceneNumber,
  compareSceneCodepoint,
  finiteSceneNumber,
  scenePointObject,
  sceneRecord,
  sortSceneRecords,
} from './sceneCompilePrimitives.js';
import { townSceneLivingMarkerKind } from './sceneLivingPresentation.js';
import { sceneDigest } from './stableScene.js';

const EMPTY_PROVENANCE_REFS = /** @type {(sourceId: string) => string[]} */ (
  () => []
);

const CHRONICLE_ID_FIELDS = Object.freeze([
  'campaignEventId',
  'chronicleEntryId',
  'chronicleId',
  'eventId',
  'sourceEventId',
]);

/**
 * Preserve only exact source identities already present on an authorized
 * record. A trigger type, tick, label, or target is useful provenance, but none
 * of those values is promoted into a Chronicle id.
 *
 * @param {unknown} value
 * @returns {Array<{ kind: 'chronicle-entry'|'event', id: string }>}
 */
function projectChronicleRefs(value) {
  const source = sceneRecord(value);
  const candidates = [
    source,
    sceneRecord(source.origin),
    ...(Array.isArray(source.causes) ? source.causes.map(sceneRecord) : []),
  ];
  /** @type {Map<string, { kind: 'chronicle-entry'|'event', id: string }>} */
  const refs = new Map();
  for (const candidate of candidates) {
    for (const field of CHRONICLE_ID_FIELDS) {
      const id = boundedSceneString(candidate[field], 180);
      if (!id) continue;
      const kind = field.startsWith('chronicle')
        ? 'chronicle-entry'
        : 'event';
      refs.set(`${kind}:${id}`, { kind, id });
    }
  }
  return sortSceneRecords([...refs.values()], (ref) => `${ref.kind}:${ref.id}`);
}

/**
 * Keep the structured trigger address separate from Chronicle identity. It can
 * locate a simulation cause by type, target, and tick without claiming that a
 * matching Chronicle entry exists.
 *
 * @param {unknown} value
 * @returns {{ eventType: string|null, targetId: string|null, tick: number|null }|null}
 */
function projectTriggerRef(value) {
  const trigger = sceneRecord(sceneRecord(value).triggeredAt);
  const eventType = boundedSceneString(trigger.sourceEventType, 100) || null;
  const targetId = boundedSceneString(trigger.sourceEventTargetId, 180) || null;
  const tick = Number.isFinite(trigger.tick)
    ? Math.max(0, Math.round(Number(trigger.tick)))
    : null;
  if (!eventType && !targetId && tick === null) return null;
  return { eventType, targetId, tick };
}

/**
 * Read precise scars directly from the compact authorized mirror. The older map
 * reader intentionally omits optional spatial ids; the scene may preserve them
 * only after source projection has admitted the mirror.
 *
 * @param {Record<string, unknown>} settlement
 * @param {Array<Record<string, unknown>>} walls
 * @param {Array<Record<string, unknown>>} districts
 * @param {(sourceId: string) => string[]} [provenanceRefsFor]
 */
export function buildSceneScars(
  settlement,
  walls,
  districts,
  provenanceRefsFor = EMPTY_PROVENANCE_REFS,
) {
  const urban = sceneRecord(settlement.urbanFabric);
  const rawScars = Array.isArray(urban.scars) ? urban.scars : [];
  const wallIds = new Set(walls.map((wall) => String(wall.id)));
  const districtIds = new Set(districts.map((district) => String(district.id)));
  /** @type {Array<Record<string, unknown>>} */
  const scars = [];
  for (const raw of rawScars) {
    const scar = sceneRecord(raw);
    const kind = boundedSceneString(scar.kind, 48);
    if (!kind) continue;
    const severityPermille = clampSceneNumber(
      Math.round(finiteSceneNumber(scar.severity) * 1000),
      0,
      1000,
    );
    const week = Math.max(0, Math.round(finiteSceneNumber(scar.week)));
    const districtId = typeof scar.districtId === 'string' && districtIds.has(scar.districtId)
      ? scar.districtId
      : null;
    const candidateWallId = Number.isInteger(scar.wallSegmentId)
      ? `wall:${Number(scar.wallSegmentId)}`
      : null;
    const wallId = candidateWallId && wallIds.has(candidateWallId)
      ? candidateWallId
      : null;
    const core = {
      kind,
      severityPermille,
      week,
      districtId,
      wallId,
      buildingId: null,
    };
    const provenanceKey = districtId || wallId || `fabric:scar:${kind}`;
    scars.push({
      id: `scar:${sceneDigest(core).slice(-16)}`,
      ...core,
      chronicleRefs: projectChronicleRefs(scar),
      triggerRef: projectTriggerRef(scar),
      provenanceRefs: provenanceRefsFor(provenanceKey),
    });
  }
  return sortSceneRecords(scars, (scar) => String(scar.id));
}

/** Read reconstruction markers as their own persistent, authorized layer. */
/**
 * @param {Record<string, unknown>} settlement
 * @param {Array<Record<string, unknown>>} districts
 * @param {(sourceId: string) => string[]} [provenanceRefsFor]
 */
export function buildSceneReconstruction(
  settlement,
  districts,
  provenanceRefsFor = EMPTY_PROVENANCE_REFS,
) {
  const urban = sceneRecord(settlement.urbanFabric);
  const raw = Array.isArray(urban.rebirths) ? urban.rebirths : [];
  /** @type {Array<Record<string, unknown>>} */
  const reconstruction = [];
  for (const value of raw) {
    const row = sceneRecord(value);
    const classes = Array.isArray(row.classes)
      ? [...new Set(
        row.classes.filter((item) => typeof item === 'string').map(String),
      )].sort(compareSceneCodepoint)
      : [];
    const districtIds = districts
      .filter((district) => classes.includes(String(district.category)))
      .map((district) => String(district.id))
      .sort(compareSceneCodepoint);
    const type = boundedSceneString(row.type, 48) || 'rebuilding';
    const week = Math.max(0, Math.round(finiteSceneNumber(row.week)));
    const core = {
      type,
      week,
      districtIds,
      classes,
      freshnessBand: 'fresh',
    };
    reconstruction.push({
      id: `reconstruction:${sceneDigest(core).slice(-16)}`,
      ...core,
      chronicleRefs: projectChronicleRefs(row),
      triggerRef: projectTriggerRef(row),
      provenanceRefs: [...new Set(
        districtIds.flatMap((districtId) => provenanceRefsFor(districtId)),
      )].sort(compareSceneCodepoint),
    });
  }
  return sortSceneRecords(reconstruction, (row) => String(row.id));
}

/**
 * Lower the already-audience-projected TownMapModel overlays. The model wall is
 * responsible for visibility admission; this stage does not invent a second
 * and inevitably divergent visibility vocabulary.
 *
 * @param {Record<string, unknown>} model
 * @param {(sourceId: string) => string[]} [provenanceRefsFor]
 * @param {{
 *   walls?: Array<Record<string, unknown>>,
 *   settlement?: Record<string, unknown>,
 * }} [context]
 */
export function buildSceneConditions(
  model,
  provenanceRefsFor = EMPTY_PROVENANCE_REFS,
  context = {},
) {
  const overlays = sceneRecord(model.overlays);
  const wallIds = (Array.isArray(context.walls) ? context.walls : [])
    .map((wall) => String(wall.id || ''))
    .filter(Boolean)
    .sort(compareSceneCodepoint);
  const settlement = sceneRecord(context.settlement);
  /** @type {Map<string, Record<string, unknown>>} */
  const sourceConditions = new Map();
  for (const raw of Array.isArray(settlement.activeConditions)
    ? settlement.activeConditions
    : []) {
    const condition = sceneRecord(raw);
    const id = boundedSceneString(condition.id, 100);
    if (id) sourceConditions.set(id, condition);
  }
  const defense = sceneRecord(settlement.defenseProfile);
  /** @type {Map<string, Record<string, unknown>>} */
  const sourceHazards = new Map();
  for (const raw of Array.isArray(defense.threats) ? defense.threats : []) {
    const hazard = sceneRecord(raw);
    const id = boundedSceneString(hazard.id, 100);
    if (id) sourceHazards.set(id, hazard);
  }
  /** @type {Array<Record<string, unknown>>} */
  const conditions = [];
  const conditionRows = Array.isArray(overlays.conditions) ? overlays.conditions : [];
  for (const raw of conditionRows) {
    const condition = sceneRecord(raw);
    const sourceId = boundedSceneString(condition.id, 100);
    if (!sourceId) continue;
    const districtId = typeof condition.districtId === 'string'
      ? condition.districtId
      : null;
    const sourceCondition = sourceConditions.get(sourceId) || {};
    const row = {
      id: `condition:${sourceId}`,
      kind: 'condition',
      archetype: boundedSceneString(condition.archetype, 64),
      label: boundedSceneString(condition.label, 120),
      severityPermille: clampSceneNumber(
        Math.round(finiteSceneNumber(condition.severity) * 1000),
        0,
        1000,
      ),
      severityBand: boundedSceneString(condition.severityBand, 32) || 'low',
      districtIds: districtId ? [districtId] : [],
      buildingIds: /** @type {string[]} */ ([]),
      wallIds: /** @type {string[]} */ ([]),
      status: boundedSceneString(sourceCondition.status, 32) || null,
      affectedSystems: Array.isArray(sourceCondition.affectedSystems)
        ? [...new Set(
          sourceCondition.affectedSystems
            .map((system) => boundedSceneString(system, 80))
            .filter(Boolean),
        )].sort(compareSceneCodepoint)
        : [],
      chronicleRefs: projectChronicleRefs(sourceCondition),
      triggerRef: projectTriggerRef(sourceCondition),
      provenanceRefs: provenanceRefsFor(sourceId),
    };
    // Occupation is settlement-wide and visibly reshapes control of entrances.
    // Binding its authorized marker to existing wall ids produces banners and
    // defensive-work silhouettes without inventing a second fortification map.
    if (townSceneLivingMarkerKind(row, 'condition') === 'occupation') {
      row.wallIds = wallIds;
    }
    conditions.push(row);
  }

  const hazards = Array.isArray(overlays.hazards) ? overlays.hazards : [];
  for (const raw of hazards) {
    const hazard = sceneRecord(raw);
    const sourceId = boundedSceneString(hazard.id, 100);
    if (!sourceId) continue;
    const position = scenePointObject(hazard.position);
    const sourceHazard = sourceHazards.get(sourceId) || {};
    conditions.push({
      id: `hazard:${sourceId}`,
      kind: boundedSceneString(hazard.kind, 48) || 'hazard',
      archetype: 'hazard',
      label: boundedSceneString(hazard.label, 120),
      severityPermille: clampSceneNumber(
        Math.round(finiteSceneNumber(hazard.severity) * 1000),
        0,
        1000,
      ),
      severityBand: boundedSceneString(hazard.severityBand, 32) || 'low',
      districtIds: [],
      buildingIds: [],
      wallIds: [],
      position: [position.x, position.y],
      status: boundedSceneString(sourceHazard.status, 32) || null,
      affectedSystems: [],
      chronicleRefs: projectChronicleRefs(sourceHazard),
      triggerRef: projectTriggerRef(sourceHazard),
      provenanceRefs: provenanceRefsFor(sourceId),
    });
  }
  return sortSceneRecords(conditions, (row) => String(row.id));
}

/**
 * Derive atmosphere through the shared 2D dress resolver and audience wall.
 * Player/public scenes retain only allowed seasonal dress; siege, scar,
 * rebuilding, and festival facts never hitchhike from raw campaign inputs.
 *
 * @param {Record<string, unknown>} settlement
 * @param {unknown} worldState
 * @param {unknown} regionalGraph
 * @param {'dm'|'player'|'public'} audience
 */
export function buildSceneAtmosphere(
  settlement,
  worldState,
  regionalGraph,
  audience,
) {
  const resolved = resolveMapDress(
    /** @type {Parameters<typeof resolveMapDress>[0]} */ (settlement),
    /** @type {Parameters<typeof resolveMapDress>[1]} */ (worldState),
    regionalGraph,
  );
  const dress = projectTownMapDressForAudience(resolved, audience);
  const state = sceneRecord(dress && dress.state);
  const festival = sceneRecord(dress && dress.festival);
  return {
    season: dress && typeof dress.season === 'string' ? dress.season : null,
    severity: dress && typeof dress.severity === 'string' ? dress.severity : null,
    besieged: state.besieged === true,
    scarLevelPermille: clampSceneNumber(
      Math.round(finiteSceneNumber(state.scarLevel) * 1000),
      0,
      1000,
    ),
    rebuiltCategories: Array.isArray(state.rebuiltCategories)
      ? state.rebuiltCategories
        .filter((value) => typeof value === 'string')
        .map(String)
        .sort(compareSceneCodepoint)
      : [],
    festivalScale: Number.isFinite(festival.scale)
      ? Math.max(0, Math.round(Number(festival.scale)))
      : null,
  };
}
