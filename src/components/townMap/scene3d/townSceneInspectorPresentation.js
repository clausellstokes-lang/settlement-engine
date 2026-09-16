/**
 * Human-readable facts for the scene inspector.
 *
 * TownSceneManifest keeps structural identities and product references typed.
 * This module is the intentionally small translation layer from those records
 * to table language. It never derives a new fact: missing control, gate state,
 * or route identity is said to be unrecorded instead of inferred from geometry.
 */

/** @param {unknown} value @returns {Record<string, unknown>} */
function record(value) {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? /** @type {Record<string, unknown>} */ (value)
    : {};
}

/** @param {unknown} value @returns {string} */
export function sceneInspectorTitle(value) {
  return String(value || '')
    .replace(/[-_.:]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

/** @param {unknown} value @returns {string|null} */
function text(value) {
  const normalized = typeof value === 'string' ? value.trim() : '';
  return normalized || null;
}

/** @param {unknown} value @returns {string|null} */
function title(value) {
  const normalized = text(value);
  return normalized ? sceneInspectorTitle(normalized) : null;
}

/** @param {unknown} value @returns {string|null} */
function percentPermille(value) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return null;
  return `${Math.round(numeric / 10)}%`;
}

/** @param {unknown} value @returns {string|null} */
function centimeters(value) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return null;
  return `${Math.round(numeric)} cm`;
}

/** @param {unknown} value @returns {string|null} */
function titleList(value) {
  if (!Array.isArray(value) || value.length === 0) return null;
  const entries = value.map(title).filter(Boolean);
  return entries.length ? entries.join(', ') : null;
}

/**
 * @typedef {{ label: string, value: string }} SceneInspectorFact
 */

/**
 * @param {SceneInspectorFact[]} facts
 * @param {string} label
 * @param {string|null|undefined} value
 */
function add(facts, label, value) {
  if (value) facts.push({ label, value });
}

/**
 * Exact facts for a selected semantic record.
 *
 * @param {unknown} semanticValue
 * @param {unknown} livingRecordValue
 * @returns {SceneInspectorFact[]}
 */
export function townSceneInspectorFacts(semanticValue, livingRecordValue) {
  const semantic = record(semanticValue);
  const details = record(semantic.details);
  const living = record(livingRecordValue);
  /** @type {SceneInspectorFact[]} */
  const facts = [];
  const kind = text(semantic.entityKind) || text(details.kind) || '';

  if (kind === 'district') {
    add(facts, 'Quarter type', title(details.category));
    add(facts, 'Wealth', title(details.wealthBand));
    add(facts, 'Safety', title(details.safetyBand));
    add(facts, 'Built density', percentPermille(details.densityPermille));
    add(facts, 'Control', 'Not recorded for this quarter');
  } else if (kind === 'building') {
    add(
      facts,
      'Role',
      details.generatedFabric === true
        ? 'Generated district fabric'
        : details.landmark === true
          ? 'Named landmark'
          : 'Named institution',
    );
    add(facts, 'Quarter', title(details.districtId || semantic.districtId));
  } else if (kind === 'road') {
    add(facts, 'Road type', title(details.roadKind));
    add(
      facts,
      'Connected settlement',
      text(details.connectionLabel) || (
        details.roadKind === 'arterial' ? 'Not recorded' : null
      ),
    );
    add(facts, 'Relationship', title(details.relationshipType));
    add(facts, 'Quarters reached', titleList(details.districtIds));
    add(facts, 'Gates', titleList(details.gateIds));
    add(facts, 'Bridges', titleList(details.bridgeIds));
  } else if (kind === 'wall') {
    add(facts, 'Defense readiness', title(details.defenseReadiness) || 'Not recorded');
    add(facts, 'Strength', percentPermille(details.strengthPermille));
    add(facts, 'Protects', title(details.protectedDistrictId));
    add(facts, 'Gates', titleList(details.gateIds));
  } else if (kind === 'gate') {
    add(facts, 'Defense readiness', title(details.defenseReadiness) || 'Not recorded');
    add(facts, 'Gate status', title(details.openingState) || 'Not recorded');
    add(facts, 'Wall segment', title(details.wallId));
    add(facts, 'Roads', titleList(details.roadIds));
    add(facts, 'Opening width', centimeters(details.openingWidthCm));
    add(facts, 'Opening height', centimeters(details.openingHeightCm));
  } else if (kind === 'bridge') {
    add(facts, 'Bridge type', title(details.bridgeKind));
    add(facts, 'Connected settlement', text(details.connectionLabel) || 'Not recorded');
    add(facts, 'Road', title(details.roadId));
    add(facts, 'Waterway', title(details.waterId));
  } else if (kind === 'quay') {
    add(facts, 'Quarter', title(details.districtId || semantic.districtId));
    add(facts, 'Waterway', title(details.waterId));
  } else if (kind === 'water') {
    add(facts, 'Water body', title(details.waterKind));
  } else if (kind === 'condition' || kind === 'hazard') {
    add(facts, 'State type', title(details.archetype || living.archetype));
    add(facts, 'Status', title(details.status || living.status));
    add(facts, 'Severity', title(details.severityBand || living.severityBand));
    add(
      facts,
      'Intensity',
      percentPermille(details.severityPermille ?? living.severityPermille),
    );
    add(facts, 'Affected systems', titleList(details.affectedSystems));
    add(facts, 'Affected quarters', titleList(details.districtIds));
    add(facts, 'Affected buildings', titleList(details.buildingIds));
    add(facts, 'Affected walls', titleList(details.wallIds));
  } else if (kind === 'scar') {
    add(facts, 'Scar type', title(details.scarKind || living.kind));
    add(facts, 'Severity', percentPermille(details.severityPermille ?? living.severityPermille));
    if (Number.isFinite(Number(details.week ?? living.week))) {
      add(facts, 'Recorded', `Week ${Math.round(Number(details.week ?? living.week))}`);
    }
    add(
      facts,
      'Exact target',
      title(details.buildingId || details.wallId || details.districtId)
        || 'Settlement-wide',
    );
  } else if (kind === 'reconstruction') {
    add(facts, 'Rebuilding type', title(details.reconstructionType || living.type));
    add(facts, 'Freshness', title(details.freshnessBand || living.freshnessBand));
    if (Number.isFinite(Number(details.week ?? living.week))) {
      add(facts, 'Recorded', `Week ${Math.round(Number(details.week ?? living.week))}`);
    }
    add(facts, 'Quarters', titleList(details.districtIds));
    add(facts, 'Rebuilt fabric', titleList(details.classes));
  }

  const trigger = record(details.triggerRef || living.triggerRef);
  add(
    facts,
    'Recorded trigger',
    text(trigger.label) || text(trigger.id) || null,
  );
  return facts;
}

/**
 * @param {unknown} referenceValue
 * @returns {string|null}
 */
export function townSceneReferenceLabel(referenceValue) {
  const reference = record(referenceValue);
  const label = text(reference.label);
  const id = text(reference.id);
  const kind = title(reference.kind);
  if (label && kind) return `${label} · ${kind}`;
  if (label) return label;
  if (id && kind) return `${kind}: ${id}`;
  return id;
}

