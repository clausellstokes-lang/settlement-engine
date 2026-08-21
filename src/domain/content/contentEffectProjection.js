/**
 * contentEffectProjection.js — deterministic interpretation of an authored
 * definition against the canonical custom-content manifest.
 *
 * AI may propose a structure, but it never explains its own authority. This
 * projection is derived locally from registered field contracts and therefore
 * answers the questions the author actually needs:
 *
 *   - what is mechanically consumed;
 *   - what changes presentation only;
 *   - what is dormant until an explicit activation;
 *   - what the engine does not understand.
 */

import {
  classifyCustomContentField,
  getCustomContentCategory,
  getCustomContentField,
} from './customContentManifest.js';

/**
 * @typedef {'mechanical'|'conditional'|'presentation'|'unsupported'} ContentTruthLabel
 * @typedef {{
 *   label:ContentTruthLabel,
 *   effectKind:'mechanical'|'presentation'|'unsupported',
 *   activation:string,
 *   explanation:string|null,
 *   consumers:string[],
 * }} ContentFieldTruth
 * @typedef {{ action?:string, editedFields?:object }} ContentEffectDecision
 */

/** @param {unknown} value @returns {Record<string, unknown>} */
function plainRecord(value) {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? /** @type {Record<string, unknown>} */ (value)
    : {};
}

/** @param {ReturnType<typeof getCustomContentField>} field */
function normalizedActivation(field) {
  return {
    mode: field?.activation || 'always',
    explanation: field?.condition || null,
  };
}

/** @param {ReturnType<typeof getCustomContentField>} field */
function normalizedEffect(field) {
  const effect = field?.effect;
  if (effect === 'mechanical' || effect === 'presentation' || effect === 'unsupported') {
    return effect;
  }
  // A registered field with no behavior declaration is deliberately
  // presentation-only. Mechanical authority is never inferred from existence.
  return field ? 'presentation' : 'unsupported';
}

/** @param {ReturnType<typeof getCustomContentField>} field */
function consumersOf(field) {
  return field ? [...field.consumers] : [];
}

/**
 * Resolve the user-facing four-way truth label without collapsing the richer
 * effect/activation axes stored in the manifest.
 *
 * @param {string} bucket
 * @param {string} fieldName
 * @param {unknown} [value]
 * @returns {ContentFieldTruth}
 */
export function contentFieldTruth(bucket, fieldName, value) {
  const field = getCustomContentField(bucket, fieldName);
  if (!field) {
    return {
      label: 'unsupported',
      effectKind: 'unsupported',
      activation: 'never',
      explanation: 'This field is outside the registered content vocabulary.',
      consumers: [],
    };
  }

  // Some registered fields are mechanical only for a closed subset of values.
  // For example, the known trade-demand categories satisfy real ledgers while
  // a user-authored label remains presentation metadata. Static form labels do
  // not have a value yet, so they describe the field's maximum authority;
  // interpretation reports always classify the actual value.
  const classification = arguments.length >= 3
    ? classifyCustomContentField(bucket, fieldName, value)
    : null;
  if (classification?.displayKind === 'unsupported') {
    const rejectionReason = /** @type {{ reason?: string }} */ (
      classification
    ).reason;
    return {
      label: 'unsupported',
      effectKind: 'unsupported',
      activation: 'never',
      explanation: rejectionReason === 'invalid_value'
        ? 'This value is outside the registered content vocabulary.'
        : 'This field is outside the registered content vocabulary.',
      consumers: [],
    };
  }

  const effectKind = classification?.effectKind || normalizedEffect(field);
  const activation = classification?.activation
    ? {
        mode: classification.activation.kind,
        explanation: classification.activation.when || null,
      }
    : normalizedActivation(field);
  const conditional = effectKind === 'mechanical'
    && !['always', 'immediate'].includes(activation.mode);
  const label = effectKind === 'unsupported'
    ? 'unsupported'
    : effectKind === 'presentation'
      ? 'presentation'
      : conditional
        ? 'conditional'
        : 'mechanical';

  return {
    label,
    effectKind,
    activation: activation.mode,
    explanation: activation.explanation
      || field.condition
      || null,
    consumers: classification?.consumers || consumersOf(field),
  };
}

/**
 * @param {unknown} rawEntry
 * @param {ContentEffectDecision} decision
 * @returns {Record<string, unknown>|null}
 */
function selectedEntry(rawEntry, decision) {
  const entry = plainRecord(plainRecord(rawEntry).entry);
  if (decision?.action === 'reject') return null;
  if (decision?.action === 'edit') {
    return { ...entry, ...plainRecord(decision.editedFields) };
  }
  return entry;
}

/**
 * Build a deterministic interpretation report for a compiled draft.
 *
 * @param {{ entries?:Array<object>, unsupported?:Array<object>, assumptions?:Array<unknown> }} draft
 * @param {Record<string, ContentEffectDecision>} [decisions]
 */
export function projectContentEffects(draft, decisions = {}) {
  const entries = Array.isArray(draft?.entries) ? draft.entries : [];
  /** @type {Array<{
   *   index:number,
   *   bucket:string,
   *   categoryLabel:string,
   *   name:string,
   *   action:string,
   *   fields:Array<{name:string, value:unknown} & ContentFieldTruth>,
   *   mechanicalConsumers:string[],
   *   presentationConsumers:string[],
   * }>} */
  const projectedEntries = [];
  const totals = {
    mechanical: 0,
    conditional: 0,
    presentation: 0,
    unsupported: 0,
  };

  entries.forEach((candidate, index) => {
    const candidateRecord = plainRecord(candidate);
    const bucket = typeof candidateRecord.bucket === 'string'
      ? candidateRecord.bucket
      : '';
    const category = getCustomContentCategory(bucket);
    const decision = decisions?.[index] || {};
    const entry = selectedEntry(candidate, decision);
    if (!entry) return;

    const fields = Object.entries(entry).map(([name, value]) => {
      const truth = contentFieldTruth(bucket, name, value);
      totals[truth.label] += 1;
      return {
        name,
        value,
        ...truth,
      };
    });

    projectedEntries.push({
      index,
      bucket,
      categoryLabel: category?.singular || category?.label || bucket || 'Unknown',
      name: typeof entry.name === 'string' ? entry.name : `Entry ${index + 1}`,
      action: decision.action || 'pending',
      fields,
      mechanicalConsumers: [...new Set(
        fields
          .filter((field) => field.effectKind === 'mechanical')
          .flatMap((field) => field.consumers),
      )].sort(),
      presentationConsumers: [...new Set(
        fields
          .filter((field) => field.effectKind === 'presentation')
          .flatMap((field) => field.consumers),
      )].sort(),
    });
  });

  const unsupportedRequests = Array.isArray(draft?.unsupported)
    ? draft.unsupported.map((entry) => ({ ...plainRecord(entry) }))
    : [];
  totals.unsupported += unsupportedRequests.length;

  const interpreted = totals.mechanical + totals.conditional + totals.presentation;
  const total = interpreted + totals.unsupported;
  return {
    entries: projectedEntries,
    totals,
    mappingRate: total > 0 ? interpreted / total : 1,
    assumptions: Array.isArray(draft?.assumptions)
      ? draft.assumptions.map((entry) => String(entry))
      : [],
    unsupported: unsupportedRequests,
  };
}
