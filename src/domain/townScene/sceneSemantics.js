/**
 * Typed semantic records for TownSceneManifest picking and product navigation.
 *
 * Scene identity, canonical identity, provenance, Chronicle entries, and Realm
 * entities are deliberately separate address spaces. This compiler never
 * manufactures one address from another: a neighbour name may label a
 * schematic approach road, for example, but it becomes a Realm reference only
 * when the authorized settlement already carries a stable neighbour id.
 */

import {
  boundedSceneString,
  compareSceneCodepoint,
  sceneRecord,
  sortSceneRecords,
} from './sceneCompilePrimitives.js';

/** @typedef {Record<string, unknown>} SceneEntityRecord */
/** @typedef {{ kind: string, id: string }} SceneReference */

/**
 * @param {unknown} value
 * @returns {string[]}
 */
function sceneStringArray(value) {
  if (!Array.isArray(value)) return [];
  return [...new Set(
    value
      .map((entry) => boundedSceneString(entry, 180))
      .filter(Boolean),
  )].sort(compareSceneCodepoint);
}

/**
 * @param {unknown} value
 * @returns {Array<{ kind: string, id: string }>}
 */
function sceneReferenceArray(value) {
  if (!Array.isArray(value)) return [];
  /** @type {Map<string, { kind: string, id: string }>} */
  const refs = new Map();
  for (const raw of value) {
    const record = sceneRecord(raw);
    const kind = boundedSceneString(record.kind, 48);
    const id = boundedSceneString(record.id, 180);
    if (!kind || !id) continue;
    refs.set(`${kind}:${id}`, { kind, id });
  }
  return sortSceneRecords([...refs.values()], (ref) => `${ref.kind}:${ref.id}`);
}

/**
 * Collect the settlement links that can honestly label an approach. Names are
 * useful wayfinding labels; only an explicit id is a navigable Realm address.
 * The stable pairing remains schematic because town-scale data has no canonical
 * bearing for a neighbour.
 *
 * @param {Record<string, unknown>} settlement
 * @returns {Array<{
 *   label: string,
 *   relationshipType: string|null,
 *   realmRef: { kind: 'settlement', id: string, label: string }|null,
 * }>}
 */
function settlementConnections(settlement) {
  const source = sceneRecord(settlement);
  const candidates = [
    ...(Array.isArray(source.neighbourNetwork) ? source.neighbourNetwork : []),
    ...(Array.isArray(source.neighborNetwork) ? source.neighborNetwork : []),
    ...(Array.isArray(source.neighbours) ? source.neighbours : []),
    ...(Array.isArray(source.neighbors) ? source.neighbors : []),
    ...(source.neighborRelationship ? [source.neighborRelationship] : []),
  ];
  /** @type {Map<string, {
   *   label: string,
   *   relationshipType: string|null,
   *   realmRef: { kind: 'settlement', id: string, label: string }|null,
   * }>} */
  const byIdentity = new Map();
  for (const raw of candidates) {
    const connection = typeof raw === 'string'
      ? { name: raw }
      : sceneRecord(raw);
    const label = boundedSceneString(
      connection.name || connection.neighbourName,
      120,
    );
    if (!label) continue;
    const id = boundedSceneString(connection.id, 180);
    const relationshipType = boundedSceneString(
      connection.relationshipType || connection.regionalType,
      64,
    ) || null;
    const key = id ? `id:${id}` : `name:${label.toLocaleLowerCase('en-US')}`;
    const existing = byIdentity.get(key);
    const realmRef = id
      ? { kind: /** @type {const} */ ('settlement'), id, label }
      : null;
    // Prefer the richer exact address if duplicate legacy spellings disagree.
    if (!existing || (!existing.realmRef && realmRef)) {
      byIdentity.set(key, { label, relationshipType, realmRef });
    }
  }
  return [...byIdentity.values()].sort((a, b) => (
    compareSceneCodepoint(a.label, b.label)
    || compareSceneCodepoint(a.realmRef?.id || '', b.realmRef?.id || '')
  ));
}

/**
 * @param {SceneEntityRecord[]} roads
 * @param {Record<string, unknown>} settlement
 */
function connectionByRoadId(roads, settlement) {
  const approaches = roads
    .filter((road) => road.kind === 'arterial')
    .slice()
    .sort((a, b) => compareSceneCodepoint(String(a.id), String(b.id)));
  const connections = settlementConnections(settlement);
  /** @type {Map<string, ReturnType<typeof settlementConnections>[number]>} */
  const byRoad = new Map();
  const count = Math.min(approaches.length, connections.length);
  for (let index = 0; index < count; index++) {
    byRoad.set(String(approaches[index].id), connections[index]);
  }
  return byRoad;
}

/**
 * Create an exact event/story reference set from already-projected living
 * records. These are entity identities, not generated narrative summaries.
 *
 * @param {SceneEntityRecord[]} conditions
 */
function storyRefsByDistrict(conditions) {
  /** @type {Map<string, Map<string, SceneReference>>} */
  const byDistrict = new Map();
  for (const condition of conditions) {
    const chronicleRefs = sceneReferenceArray(condition.chronicleRefs);
    for (const districtId of sceneStringArray(condition.districtIds)) {
      const refs = byDistrict.get(districtId) || new Map();
      for (const ref of chronicleRefs) {
        refs.set(`${ref.kind}:${ref.id}`, ref);
      }
      byDistrict.set(districtId, refs);
    }
  }
  return new Map(
    [...byDistrict.entries()].map(([districtId, refs]) => [
      districtId,
      sortSceneRecords([...refs.values()], (ref) => `${ref.kind}:${ref.id}`),
    ]),
  );
}

/**
 * A district condition badge is a canonical pressure entity placed at this
 * district by the shared map model. Its `basis` prevents consumers from
 * mistaking the scene-marker placement for a simulation-level causal claim.
 *
 * @param {SceneEntityRecord[]} conditions
 */
function pressureRefsByDistrict(conditions) {
  /** @type {Map<string, Array<Record<string, unknown>>>} */
  const byDistrict = new Map();
  for (const condition of conditions) {
    const kind = condition.kind === 'condition'
      ? 'living-condition'
      : 'living-hazard';
    for (const districtId of sceneStringArray(condition.districtIds)) {
      const refs = byDistrict.get(districtId) || [];
      refs.push({
        kind,
        id: String(condition.id),
        label: boundedSceneString(condition.label, 120),
        basis: 'scene-marker',
      });
      byDistrict.set(districtId, refs);
    }
  }
  for (const [districtId, refs] of byDistrict) {
    byDistrict.set(
      districtId,
      sortSceneRecords(refs, (ref) => `${ref.kind}:${ref.id}`),
    );
  }
  return byDistrict;
}

/**
 * Base fields shared by every semantic row. Nullable action/reference fields
 * are present intentionally so the UI can say "Unavailable" without probing
 * undocumented shapes.
 *
 * @param {{
 *   sceneId: unknown,
 *   entityKind: string,
 *   anchorKey?: unknown,
 *   canonicalRef: Record<string, unknown>,
 *   districtId?: unknown,
 *   label: unknown,
 *   provenanceRefs?: unknown,
 *   details: Record<string, unknown>,
 *   realmRef?: Record<string, unknown>|null,
 *   chronicleRefs?: unknown,
 *   relatedRefs?: Record<string, unknown>,
 *   workbenchRef?: Record<string, unknown>|null,
 * }} row
 */
function semanticRow(row) {
  return {
    sceneId: String(row.sceneId),
    entityKind: row.entityKind,
    anchorKey: boundedSceneString(row.anchorKey, 180) || null,
    canonicalRef: row.canonicalRef,
    districtId: boundedSceneString(row.districtId, 180) || null,
    label: boundedSceneString(row.label, 140) || 'Unnamed place',
    provenanceRefs: sceneStringArray(row.provenanceRefs),
    realmRef: row.realmRef || null,
    chronicleRefs: sceneReferenceArray(row.chronicleRefs),
    relatedRefs: {
      factionRefs: sceneReferenceArray(row.relatedRefs?.factionRefs),
      pressureRefs: Array.isArray(row.relatedRefs?.pressureRefs)
        ? row.relatedRefs.pressureRefs
        : [],
      storyRefs: sceneReferenceArray(row.relatedRefs?.storyRefs),
    },
    workbenchRef: row.workbenchRef || null,
    details: row.details,
  };
}

/**
 * Canonical semantic/picking table for every structural and living scene
 * record. Infill buildings resolve to their owning district instead of
 * pretending to be new institutions.
 *
 * @param {{
 *   model: {
 *     buildings?: Array<Record<string, unknown>>,
 *     fortifications?: Record<string, unknown>|null,
 *   },
 *   settlement: Record<string, unknown>,
 *   districts: SceneEntityRecord[],
 *   roads: SceneEntityRecord[],
 *   walls: SceneEntityRecord[],
 *   gates: SceneEntityRecord[],
 *   bridges: SceneEntityRecord[],
 *   quays: SceneEntityRecord[],
 *   buildings: SceneEntityRecord[],
 *   terrain: { waterBodies: SceneEntityRecord[] },
 *   conditions: SceneEntityRecord[],
 *   scars: SceneEntityRecord[],
 *   reconstruction: SceneEntityRecord[],
 *   provenanceRefsFor: (sourceId: string) => string[],
 * }} args
 */
export function buildSceneSemantics(args) {
  const {
    model,
    settlement,
    districts,
    roads,
    walls,
    gates,
    bridges,
    quays,
    buildings,
    terrain,
    conditions,
    scars,
    reconstruction,
    provenanceRefsFor,
  } = args;
  /** @type {Array<Record<string, unknown>>} */
  const semantics = [];
  const districtById = new Map(
    districts.map((district) => [String(district.id), district]),
  );
  const roadConnection = connectionByRoadId(roads, settlement);
  const gateIdsByRoadId = new Map(
    roads.map((road) => [
      String(road.id),
      gates
        .filter((gate) => sceneStringArray(gate.roadIds).includes(String(road.id)))
        .map((gate) => String(gate.id))
        .sort(compareSceneCodepoint),
    ]),
  );
  const bridgeIdsByRoadId = new Map(
    roads.map((road) => [
      String(road.id),
      bridges
        .filter((bridge) => bridge.roadId === road.id)
        .map((bridge) => String(bridge.id))
        .sort(compareSceneCodepoint),
    ]),
  );
  const storiesByDistrict = storyRefsByDistrict(conditions);
  const pressuresByDistrict = pressureRefsByDistrict(conditions);
  const defenseReadiness = boundedSceneString(
    sceneRecord(model.fortifications).readiness,
    32,
  ) || null;

  for (const district of districts) {
    const districtId = String(district.id);
    semantics.push(semanticRow({
      sceneId: `district:${districtId}`,
      entityKind: 'district',
      anchorKey: district.anchorKey,
      canonicalRef: { kind: 'district', id: districtId },
      districtId,
      label: district.name,
      provenanceRefs: district.provenanceRefs,
      details: {
        kind: 'district',
        category: district.category,
        wealthBand: district.wealthBand,
        safetyBand: district.safetyBand,
        densityPermille: district.densityPermille,
        synthetic: district.synthetic === true,
      },
      relatedRefs: {
        // The stored quarter schema has no district-to-faction identity. Do not
        // turn the profile layer's category inference into canonical control.
        factionRefs: [],
        pressureRefs: pressuresByDistrict.get(districtId) || [],
        storyRefs: storiesByDistrict.get(districtId) || [],
      },
    }));
  }

  const mapBuildingByAnchor = new Map(
    (Array.isArray(model.buildings) ? model.buildings : [])
      .map((building) => [String(building.anchorKey), building]),
  );
  for (const building of buildings) {
    const sourceBuilding = sceneRecord(
      mapBuildingByAnchor.get(String(building.anchorKey)),
    );
    const district = districtById.get(String(building.districtId));
    const isFabric = building.generatedFabric === true;
    const definitionId = boundedSceneString(
      sourceBuilding.customDefinitionId,
      240,
    );
    const definitionRevisionId = boundedSceneString(
      sourceBuilding.customDefinitionRevisionId,
      240,
    );
    const definitionContentHash = boundedSceneString(
      sourceBuilding.customDefinitionContentHash,
      240,
    );
    const definitionVersion = sourceBuilding.customDefinitionVersion;
    const definitionFingerprint = boundedSceneString(
      sourceBuilding.customDefinitionFingerprint,
      240,
    );
    const canonicalRef = isFabric
      ? {
        kind: 'district-fabric',
        id: building.anchorKey,
        districtId: building.districtId,
      }
      : {
        kind: 'institution',
        id: sourceBuilding.localUid
          || sourceBuilding.catalogId
          || building.anchorKey,
        catalogId: sourceBuilding.catalogId || null,
        localUid: sourceBuilding.localUid || null,
        ...(definitionId ? { definitionId } : {}),
        ...(definitionRevisionId ? { revisionId: definitionRevisionId } : {}),
        ...(definitionContentHash ? { contentHash: definitionContentHash } : {}),
        ...(
          (Number.isSafeInteger(definitionVersion) && Number(definitionVersion) >= 0)
          || (typeof definitionVersion === 'string' && definitionVersion.length > 0)
            ? { definitionVersion }
            : {}
        ),
        ...(definitionFingerprint
          ? { definitionFingerprint }
          : {}),
      };
    semantics.push(semanticRow({
      sceneId: building.semanticId,
      entityKind: 'building',
      anchorKey: building.anchorKey,
      canonicalRef,
      districtId: building.districtId,
      label: isFabric
        ? `${boundedSceneString(district?.name, 100) || 'District'} building`
        : sourceBuilding.name,
      provenanceRefs: building.provenanceRefs,
      workbenchRef: isFabric
        ? null
        : {
          kind: 'institution',
          id: canonicalRef.id,
          label: boundedSceneString(sourceBuilding.name, 120),
        },
      details: {
        kind: 'building',
        generatedFabric: isFabric,
        landmark: building.landmark === true,
        districtId: boundedSceneString(building.districtId, 180) || null,
        ...(
          !isFabric && typeof sourceBuilding.category === 'string'
            ? { category: boundedSceneString(sourceBuilding.category, 80) }
            : {}
        ),
        ...(
          !isFabric && typeof building.sceneProfileId === 'string'
            ? { sceneProfileId: building.sceneProfileId }
            : {}
        ),
      },
    }));
  }

  for (const road of roads) {
    const connection = roadConnection.get(String(road.id)) || null;
    semantics.push(semanticRow({
      sceneId: road.id,
      entityKind: 'road',
      canonicalRef: { kind: 'map-element', id: road.id },
      label: road.kind === 'arterial' ? 'Approach road' : 'Town street',
      provenanceRefs: road.provenanceRefs,
      realmRef: connection?.realmRef || null,
      workbenchRef: connection?.realmRef || null,
      details: {
        kind: 'road',
        roadKind: road.kind,
        widthPlan: road.widthPlan,
        districtIds: sceneStringArray(road.districtIds),
        gateIds: gateIdsByRoadId.get(String(road.id)) || [],
        bridgeIds: bridgeIdsByRoadId.get(String(road.id)) || [],
        connectionLabel: connection?.label || null,
        relationshipType: connection?.relationshipType || null,
        connectionBasis: connection ? 'schematic-stable-pairing' : null,
      },
    }));
  }

  for (const wall of walls) {
    semantics.push(semanticRow({
      sceneId: wall.id,
      entityKind: 'wall',
      canonicalRef: { kind: 'map-element', id: wall.id },
      districtId: wall.protectedDistrictId,
      label: 'Town wall',
      provenanceRefs: wall.provenanceRefs,
      details: {
        kind: 'wall',
        defenseReadiness,
        strengthPermille: wall.strengthPermille,
        protectedDistrictId: wall.protectedDistrictId || null,
        gateIds: sceneStringArray(wall.gateIds),
      },
    }));
  }

  for (const gate of gates) {
    semantics.push(semanticRow({
      sceneId: gate.id,
      entityKind: 'gate',
      canonicalRef: { kind: 'map-element', id: gate.id },
      label: 'Town gatehouse',
      provenanceRefs: gate.provenanceRefs,
      details: {
        kind: 'gate',
        defenseReadiness,
        // A geometric opening is not proof of an open/closed simulation state.
        openingState: null,
        wallId: gate.wallId,
        roadIds: sceneStringArray(gate.roadIds),
        openingWidthCm: gate.openingWidthCm,
        openingHeightCm: gate.openingHeightCm,
      },
    }));
  }

  for (const bridge of bridges) {
    const connection = roadConnection.get(String(bridge.roadId)) || null;
    semantics.push(semanticRow({
      sceneId: bridge.id,
      entityKind: 'bridge',
      canonicalRef: { kind: 'map-element', id: bridge.id },
      label: bridge.kind === 'causeway' ? 'Harbor causeway' : 'Bridge',
      provenanceRefs: bridge.provenanceRefs,
      realmRef: connection?.realmRef || null,
      workbenchRef: connection?.realmRef || null,
      details: {
        kind: 'bridge',
        bridgeKind: bridge.kind,
        roadId: bridge.roadId,
        waterId: bridge.waterId,
        widthPlan: bridge.widthPlan,
        connectionLabel: connection?.label || null,
        connectionBasis: connection ? 'via-linked-approach-road' : null,
      },
    }));
  }

  for (const quay of quays) {
    semantics.push(semanticRow({
      sceneId: quay.id,
      entityKind: 'quay',
      canonicalRef: { kind: 'map-element', id: quay.id },
      districtId: quay.districtId,
      label: 'Waterside quay',
      provenanceRefs: quay.provenanceRefs,
      details: {
        kind: 'quay',
        districtId: quay.districtId,
        waterId: quay.waterId,
        widthPlan: quay.widthPlan,
      },
    }));
  }

  for (const water of terrain.waterBodies) {
    semantics.push(semanticRow({
      sceneId: water.id,
      entityKind: 'water',
      canonicalRef: { kind: 'map-element', id: water.id },
      label: water.kind === 'coast' ? 'Coast' : 'River',
      provenanceRefs: provenanceRefsFor('site:water'),
      details: {
        kind: 'water',
        waterKind: water.kind,
        widthPlan: water.widthPlan,
      },
    }));
  }

  for (const condition of conditions) {
    const districtIds = sceneStringArray(condition.districtIds);
    const livingKind = condition.kind === 'condition'
      ? 'living-condition'
      : 'living-hazard';
    semantics.push(semanticRow({
      sceneId: condition.id,
      entityKind: condition.kind === 'condition' ? 'condition' : 'hazard',
      canonicalRef: { kind: livingKind, id: condition.id },
      districtId: districtIds[0] || null,
      label: condition.label,
      provenanceRefs: condition.provenanceRefs,
      chronicleRefs: condition.chronicleRefs,
      details: {
        kind: condition.kind === 'condition' ? 'condition' : 'hazard',
        archetype: condition.archetype,
        severityBand: condition.severityBand,
        severityPermille: condition.severityPermille,
        status: condition.status || null,
        districtIds,
        buildingIds: sceneStringArray(condition.buildingIds),
        wallIds: sceneStringArray(condition.wallIds),
        affectedSystems: sceneStringArray(condition.affectedSystems),
        triggerRef: condition.triggerRef || null,
      },
      relatedRefs: {
        pressureRefs: [{
          kind: livingKind,
          id: String(condition.id),
          label: boundedSceneString(condition.label, 120),
          basis: 'selected-record',
        }],
        storyRefs: condition.chronicleRefs,
      },
    }));
  }

  for (const scar of scars) {
    semantics.push(semanticRow({
      sceneId: scar.id,
      entityKind: 'scar',
      // Keep the precise scar target on the canonical address, not only in
      // presentation details. A wall scar and a district scar may share the
      // same authored kind; downstream Workbench/Chronicle navigation must be
      // able to resolve the exact affected entity without reverse-parsing the
      // descriptive payload.
      canonicalRef: {
        kind: 'living-scar',
        id: scar.id,
        districtId: scar.districtId || null,
        wallId: scar.wallId || null,
        buildingId: scar.buildingId || null,
      },
      districtId: scar.districtId,
      label: humanizeSceneToken(scar.kind),
      provenanceRefs: scar.provenanceRefs,
      chronicleRefs: scar.chronicleRefs,
      details: {
        kind: 'scar',
        scarKind: scar.kind,
        severityPermille: scar.severityPermille,
        week: scar.week,
        districtId: scar.districtId || null,
        wallId: scar.wallId || null,
        buildingId: scar.buildingId || null,
        triggerRef: scar.triggerRef || null,
      },
      relatedRefs: { storyRefs: scar.chronicleRefs },
    }));
  }

  for (const rebuild of reconstruction) {
    const districtIds = sceneStringArray(rebuild.districtIds);
    semantics.push(semanticRow({
      sceneId: rebuild.id,
      entityKind: 'reconstruction',
      canonicalRef: {
        kind: 'living-reconstruction',
        id: rebuild.id,
        districtIds,
      },
      districtId: districtIds[0] || null,
      label: `Reconstruction: ${humanizeSceneToken(rebuild.type)}`,
      provenanceRefs: rebuild.provenanceRefs,
      chronicleRefs: rebuild.chronicleRefs,
      details: {
        kind: 'reconstruction',
        reconstructionType: rebuild.type,
        week: rebuild.week,
        districtIds,
        classes: sceneStringArray(rebuild.classes),
        freshnessBand: rebuild.freshnessBand,
        triggerRef: rebuild.triggerRef || null,
      },
      relatedRefs: { storyRefs: rebuild.chronicleRefs },
    }));
  }

  return sortSceneRecords(semantics, (semantic) => String(semantic.sceneId));
}

/** @param {unknown} value */
function humanizeSceneToken(value) {
  const text = boundedSceneString(value, 80)
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  return text ? `${text[0].toUpperCase()}${text.slice(1)}` : 'Living condition';
}
