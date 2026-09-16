/**
 * pendingEditsPreview.js — coarse, lazy cascade preview for dossier edits.
 *
 * Queue construction stays in pendingEdits.js because the store needs it on
 * first paint. Previewing is an explicit authoring action, so keeping this
 * richer read model in its own module avoids charging every visitor for it.
 */

import { activeEdits } from './pendingEdits.js';
import { collectPlotHooks } from './dossier/plotHooks.js';

const PROSE_EDITS_BEFORE_PROGRESSION_SUGGESTION = 2;
const INSTITUTION_REMOVALS_BEFORE_ANCHOR_WARNING = 2;

const SUPPORTED_PREVIEW_KINDS = new Set([
  'add-institution', 'remove-institution',
  'add-resource', 'remove-resource',
  'add-stressor', 'remove-stressor',
  'rename-npc', 'rename-faction', 'rename-settlement',
  'edit-prose',
  'edit-npc', 'reassign-npc', 'stasis-npc', 'return-npc',
  'ransom-npc', 'rescue-npc', 'champion-npc', 'recall-npc',
  'table-event',
]);

const STRUCTURAL_DELTA_SPEC = Object.freeze({
  'add-institution': Object.freeze({
    subject: 'institution',
    direction: 'add',
    keys: Object.freeze(['label', 'name', 'institutionName', 'institutionId', 'id']),
  }),
  'remove-institution': Object.freeze({
    subject: 'institution',
    direction: 'remove',
    keys: Object.freeze(['label', 'name', 'institutionName', 'institutionId', 'id']),
  }),
  'add-resource': Object.freeze({
    subject: 'resource',
    direction: 'add',
    keys: Object.freeze(['label', 'name', 'resourceName', 'resourceId', 'id']),
  }),
  'remove-resource': Object.freeze({
    subject: 'resource',
    direction: 'remove',
    keys: Object.freeze(['label', 'name', 'resourceName', 'resourceId', 'id']),
  }),
  'add-stressor': Object.freeze({
    subject: 'stressor',
    direction: 'add',
    keys: Object.freeze(['label', 'name', 'stressorName', 'stressorId', 'type', 'id']),
  }),
  'remove-stressor': Object.freeze({
    subject: 'stressor',
    direction: 'remove',
    keys: Object.freeze(['label', 'name', 'stressorName', 'stressorId', 'type', 'id']),
  }),
});

/**
 * @typedef {{
 *   id?: unknown,
 *   name?: unknown,
 * }} PreviewNpc
 *
 * @typedef {{
 *   npcs?: PreviewNpc[],
 *   factions?: unknown[],
 *   _narrative?: unknown,
 *   aiSettlement?: unknown,
 *   narrativeNotes?: unknown,
 * }} PreviewSettlement
 *
 * @typedef {{
 *   npcIndex?: unknown,
 *   npcId?: unknown,
 *   facetKind?: unknown,
 *   reason?: unknown,
 *   [key: string]: unknown,
 * }} PreviewPayload
 *
 * @typedef {{
 *   kind?: string,
 *   id?: unknown,
 *   payload?: PreviewPayload,
 *   reverted?: boolean,
 * }} PreviewEdit
 *
 * @typedef {{
 *   intentId: string|null,
 *   kind: string,
 *   subject: 'institution'|'resource'|'stressor',
 *   direction: 'add'|'remove',
 *   amount: 1,
 *   targetLabel: string|null,
 * }} StructuralDelta
 *
 * @typedef {{
 *   epistemic: {
 *     class: 'bounded_projection'|'partial_projection'|'unavailable',
 *     basis: 'queued_intents_and_current_read_model',
 *     simulatesCommit: false,
 *   },
 *   availability: {
 *     status: 'available'|'partial'|'unavailable',
 *     reason: string|null,
 *   },
 *   scope: {
 *     kind: 'intent-set',
 *     count: number,
 *     intentIds: string[],
 *   },
 *   structural: {
 *     status: 'changed'|'balanced'|'none'|'unassessed'|'unavailable',
 *     deltas: StructuralDelta[],
 *   },
 *   summaryLines: string[],
 *   downstreamCounts: Record<string, number>,
 *   narrativeImpact: string,
 *   warnings: string[],
 * }} CascadePreview
 */

// ── NPC-facing summary helpers ───────────────────────────────────────────────

/**
 * Resolve an NPC label without assuming imported identifiers kept their type.
 *
 * @param {PreviewSettlement} settlement
 * @param {PreviewPayload|undefined} payload
 */
function npcName(settlement, payload) {
  const npcs = Array.isArray(settlement?.npcs) ? settlement.npcs : [];
  const index = Number(payload?.npcIndex);
  const byIndex = Number.isInteger(index) ? npcs[index] : null;
  if (byIndex?.name) return byIndex.name;
  const id = payload?.npcId;
  if (id != null) {
    const byId = npcs.find(npc => String(npc?.id) === String(id));
    if (byId?.name) return byId.name;
  }
  return 'NPC';
}

/** @param {unknown} value */
function words(value) {
  return String(value || '')
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/** @param {PreviewPayload|undefined} payload @param {readonly string[]} keys */
function firstPayloadText(payload, keys) {
  if (!payload || typeof payload !== 'object') return null;
  for (const key of keys) {
    const value = payload[key];
    if (typeof value !== 'string' && typeof value !== 'number') continue;
    const label = String(value).trim();
    if (label) return label;
  }
  return null;
}

/**
 * Preserve each structural intent before calculating its net count. A balanced
 * pair is still two real operations (and may touch two different entities), so
 * reducing it to zero would make the preview materially false.
 *
 * @param {PreviewEdit} edit
 * @returns {StructuralDelta|null}
 */
function structuralDeltaOf(edit) {
  const spec = edit.kind
    ? STRUCTURAL_DELTA_SPEC[
        /** @type {keyof typeof STRUCTURAL_DELTA_SPEC} */ (edit.kind)
      ]
    : null;
  if (!spec) return null;
  return {
    intentId: edit.id == null ? null : String(edit.id),
    kind: String(edit.kind),
    subject: /** @type {StructuralDelta['subject']} */ (spec.subject),
    direction: /** @type {StructuralDelta['direction']} */ (spec.direction),
    amount: 1,
    targetLabel: firstPayloadText(edit.payload, spec.keys),
  };
}

/**
 * @param {PreviewSettlement} settlement
 * @param {PreviewEdit} edit
 */
function npcSummary(settlement, edit) {
  const name = npcName(settlement, edit.payload);

  switch (edit.kind) {
    case 'edit-npc':
      return `${name}: ${words(edit.payload?.facetKind) || 'detail'} would change`;
    case 'reassign-npc':
      return `${name}: would be reassigned`;
    case 'stasis-npc':
      return `${name}: would be set aside (${words(edit.payload?.reason) || 'stasis'})`;
    case 'return-npc':
      return `${name}: would return to active duty`;
    case 'ransom-npc':
      return `${name}: ransom would be authorized`;
    case 'rescue-npc':
      return `${name}: rescue would be authorized`;
    case 'champion-npc':
      return `${name}: would be backed by the party`;
    case 'recall-npc':
      return `${name}: would be recalled home`;
    default:
      return null;
  }
}

// ── Cascade read model ───────────────────────────────────────────────────────

/**
 * Compute a structured, best-effort preview without running the simulation.
 * @param {PreviewSettlement|null|undefined} settlement
 * @param {PreviewEdit[]} queue
 * @returns {CascadePreview}
 */
export function previewCascade(settlement, queue) {
  const edits = activeEdits(queue);
  const structuralDeltas = edits.map(structuralDeltaOf).filter(Boolean);
  const intentIds = edits
    .map(edit => edit?.id == null ? '' : String(edit.id))
    .filter(Boolean);
  /** @type {CascadePreview} */
  const preview = {
    epistemic: {
      class: 'bounded_projection',
      basis: 'queued_intents_and_current_read_model',
      simulatesCommit: false,
    },
    availability: { status: 'available', reason: null },
    scope: {
      kind: 'intent-set',
      count: edits.length,
      intentIds,
    },
    structural: {
      status: structuralDeltas.length > 0 ? 'changed' : 'none',
      deltas: /** @type {StructuralDelta[]} */ (structuralDeltas),
    },
    summaryLines: [],
    downstreamCounts: {},
    narrativeImpact: 'none',
    warnings: [],
  };

  if (!edits.length) return preview;
  if (!settlement || typeof settlement !== 'object') {
    const reason = 'The settlement is unavailable, so these changes could not be previewed.';
    preview.epistemic.class = 'unavailable';
    preview.availability = { status: 'unavailable', reason };
    preview.structural.status = 'unavailable';
    preview.warnings.push(reason);
    return preview;
  }

  // Count the queued intent without applying it. The real simulation remains a
  // commit-time concern; this read model only reports coarse downstream risk.
  let netInstitutions = 0;
  let netResources = 0;
  let netStressors = 0;
  let renames = 0;
  let proseEdits = 0;
  let structuralCount = 0;
  let npcChanges = 0;
  let tableEvents = 0;
  let supportedCount = 0;
  /** @type {string[]} */
  const npcLines = [];

  for (const edit of edits) {
    switch (edit.kind) {
      case 'add-institution':
        netInstitutions += 1;
        structuralCount += 1;
        supportedCount += 1;
        break;
      case 'remove-institution':
        netInstitutions -= 1;
        structuralCount += 1;
        supportedCount += 1;
        break;
      case 'add-resource':
        netResources += 1;
        structuralCount += 1;
        supportedCount += 1;
        break;
      case 'remove-resource':
        netResources -= 1;
        structuralCount += 1;
        supportedCount += 1;
        break;
      case 'add-stressor':
        netStressors += 1;
        structuralCount += 1;
        supportedCount += 1;
        break;
      case 'remove-stressor':
        netStressors -= 1;
        structuralCount += 1;
        supportedCount += 1;
        break;
      case 'rename-npc':
      case 'rename-faction':
      case 'rename-settlement':
        renames += 1;
        supportedCount += 1;
        break;
      case 'edit-prose':
        proseEdits += 1;
        supportedCount += 1;
        break;
      case 'edit-npc':
      case 'reassign-npc':
      case 'stasis-npc':
      case 'return-npc':
      case 'ransom-npc':
      case 'rescue-npc':
      case 'champion-npc':
      case 'recall-npc': {
        npcChanges += 1;
        supportedCount += 1;
        const line = npcSummary(settlement, edit);
        if (line) {
          npcLines.push(line);
        }
        break;
      }
      case 'table-event':
        tableEvents += 1;
        supportedCount += 1;
        break;
      default:
        break;
    }
  }

  if (supportedCount !== edits.length) {
    const unsupportedKinds = [...new Set(
      edits
        .filter(edit => !SUPPORTED_PREVIEW_KINDS.has(edit.kind))
        .map(edit => words(edit.kind) || 'unknown change'),
    )];
    const reason = `Preview unavailable for: ${unsupportedKinds.join(', ')}.`;
    preview.epistemic.class = 'unavailable';
    preview.availability = { status: 'unavailable', reason };
    preview.structural.status = 'unavailable';
    preview.warnings.push(reason);
  }

  // A table event carries a typed directive, but this coarse adapter does not
  // run the event pipeline. Obligation and relief entries may add, alter, or
  // resolve a stressor; exposure may change an NPC. Calling that a complete
  // zero-effect preview would be false, especially in a mixed review whose
  // separately-known structural rows happen to balance.
  if (tableEvents > 0 && preview.availability.status === 'available') {
    preview.epistemic.class = 'partial_projection';
    preview.availability = {
      status: 'partial',
      reason: `${tableEvents} table ${tableEvents === 1 ? 'event has' : 'events have'} typed consequences that this preview does not simulate.`,
    };
  }

  if (netInstitutions !== 0) {
    preview.summaryLines.push(
      `${netInstitutions > 0 ? '+' : ''}${netInstitutions} institution${Math.abs(netInstitutions) === 1 ? '' : 's'}`,
    );
  }
  if (netResources !== 0) {
    preview.summaryLines.push(
      `${netResources > 0 ? '+' : ''}${netResources} resource${Math.abs(netResources) === 1 ? '' : 's'}`,
    );
  }
  if (netStressors !== 0) {
    preview.summaryLines.push(
      `${netStressors > 0 ? '+' : ''}${netStressors} stressor${Math.abs(netStressors) === 1 ? '' : 's'}`,
    );
  }
  if (renames > 0) {
    preview.summaryLines.push(`${renames} rename${renames === 1 ? '' : 's'}`);
  }
  if (proseEdits > 0) {
    preview.summaryLines.push(`${proseEdits} prose edit${proseEdits === 1 ? '' : 's'}`);
  }
  preview.summaryLines.push(...npcLines);
  if (tableEvents > 0) {
    preview.summaryLines.push(
      `${tableEvents} table event${tableEvents === 1 ? '' : 's'} queued; downstream effect unassessed`,
    );
  }
  if (preview.availability.status === 'unavailable') {
    preview.structural.status = 'unavailable';
  } else if (preview.availability.status === 'partial') {
    preview.structural.status = 'unassessed';
  } else if (
    structuralCount > 0
    && netInstitutions === 0
    && netResources === 0
    && netStressors === 0
  ) {
    preview.structural.status = 'balanced';
    preview.summaryLines.push(
      `${structuralCount} structural ${structuralCount === 1 ? 'change' : 'changes'} balance to no net count change`,
    );
  } else if (structuralCount === 0) {
    preview.structural.status = 'none';
  } else {
    preview.structural.status = 'changed';
  }

  preview.downstreamCounts.npcs = Array.isArray(settlement.npcs)
    ? settlement.npcs.length
    : 0;
  preview.downstreamCounts.factions = Array.isArray(settlement.factions)
    ? settlement.factions.length
    : 0;
  // ⚠ WAS ALWAYS ZERO. Both root addresses (`settlement.plotHooks`,
  // `settlement.hooks`) are writerless, so the preview told every user that an
  // edit touched 0 hooks. Counted through the canonical collector instead.
  // The cast is the module's usual idiom: PreviewSettlement is this file's own
  // narrow read-shape, not the collector's, and the collector tolerates any shape.
  preview.downstreamCounts.hooks = collectPlotHooks(
    /** @type {Parameters<typeof collectPlotHooks>[0]} */ (/** @type {unknown} */ (settlement)),
  ).length;
  preview.downstreamCounts.npcChanges = npcChanges;

  const isNarrated = Boolean(
    settlement._narrative
    || settlement.aiSettlement
    || settlement.narrativeNotes,
  );
  if (isNarrated) {
    if (structuralCount > 0) {
      preview.narrativeImpact = 'regenerate-needed';
    } else if (
      proseEdits > PROSE_EDITS_BEFORE_PROGRESSION_SUGGESTION
      || renames > 0
      || npcChanges > 0
      || tableEvents > 0
    ) {
      preview.narrativeImpact = 'progression-suggested';
    }
  }

  if (structuralCount > 0 && isNarrated) {
    preview.warnings.push(
      'Structural change on a narrated save. The narrative layer is expected to need regeneration to stay coherent.',
    );
  }
  if (
    netInstitutions < 0
    && Math.abs(netInstitutions) >= INSTITUTION_REMOVALS_BEFORE_ANCHOR_WARNING
  ) {
    preview.warnings.push(
      'Removing multiple institutions may leave hooks and NPCs without anchors.',
    );
  }

  return preview;
}
