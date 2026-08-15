/**
 * domain/realm/realmItemReadModel.js — G-3 canonical RealmItem read envelopes.
 *
 * THIS IS A READ MODEL, NOT A NEW REALM STORE. Pulse history, live stressors,
 * Wizard News, proposals, paused interval majors, and docket entries remain the
 * authoritative records. This module takes immutable snapshots of those records
 * and adds only the cross-surface facts a GM-facing reader needs:
 *
 *   identity · editorial topic · time · resolution · operation · workflow
 *   epistemic status · attention evidence · subjects · cause · legal actions
 *
 * Those dimensions stay independent. In particular, a trade proposal may be
 * emerging (time), unresolved (resolution), blocking (attention), and pending a
 * decision (epistemic class) without being copied into four pseudo-events.
 *
 * DEDUPLICATION IS PROOF-BASED. Exact repeated projections collapse. Proposal and
 * paused-major projections merge only when their shared decision origin ID proves
 * they describe one decision. Same-kind/same-tick records do not collapse merely
 * because their content resembles one another. Conflicting reuse of a source ID
 * survives as a disambiguated item and emits a diagnostic.
 *
 * The envelopes are additive and frozen. No store, persistence, simulation, React,
 * clock, RNG, prose scan, or action dispatch lives here.
 */

import { compareCodepoint } from '../deterministicSort.js';
import { heraldItemReliability } from '../worldPulse/brokerageStamps.js';
import { SECTION_OF, heraldSectionOfRecord, routingKeyOf } from './heraldRouting.js';
import { realmLegalActions, realmOperationalCondition } from './realmItemActions.js';
import { realmAttentionDefinition } from './realmItemAttention.js';
import {
  freezeRealmValue,
  realmSourceFingerprint,
  realmSourceIdentity,
  stableRealmClone,
} from './realmItemIdentity.js';
import { inventoryRealmItemSources, realmCauseIndex } from './realmItemInventory.js';
import { countRealmItems, rankRealmItems } from './realmItemPresentation.js';

export { REALM_ITEM_SOURCE_CLASSES } from './realmItemInventory.js';
export { rankRealmItems, realmItemReadState } from './realmItemPresentation.js';

/** @typedef {import('./realmItemInventory.js').RealmSourceClass} RealmSourceClass */
/** @typedef {'historical'|'current'|'emerging'|'planned'} TemporalPhase */
/** @typedef {'unresolved'|'resolved'|'dismissed'|'superseded'} ResolutionState */
/** @typedef {'report'|'order'|'proposal'|'verdict'|'projection'} WorkflowKind */
/** @typedef {'recorded_fact'|'pending_decision'|'staged_order'|'computed_projection'} EpistemicClass */
/**
 * @typedef {Object} RealmItemDerivationContext
 * @property {Record<string, unknown>} campaign
 * @property {{ provided: boolean, settlements: Map<string, Record<string, unknown>> }} settlementIndex
 * @property {boolean} canUseCustomProvided
 * @property {boolean} canUseCustom
 * @property {boolean} advancePaused
 * @property {{ receiptIds: Set<string>, provenanceIds: Set<string> }} causeIndex
 */

export const REALM_ITEM_SCHEMA_VERSION = 1;

const TEMPORAL_PRIORITY = Object.freeze({
  historical: 0,
  current: 1,
  planned: 2,
  emerging: 3,
});

/** @param {unknown} value @returns {value is Record<string, unknown>} */
function isRecord(value) {
  return value != null && typeof value === 'object' && !Array.isArray(value);
}

/** @param {unknown} value @returns {Record<string, unknown>} */
function recordOf(value) {
  return isRecord(value) ? value : {};
}

/** @param {unknown} value @returns {string} */
function textOf(value) {
  return value == null ? '' : String(value).trim();
}

/** @param {unknown} value @returns {number|null} */
function finiteNumber(value) {
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

/** @param {number} value @returns {number} */
function unit(value) {
  return Math.max(0, Math.min(1, value));
}

/** @param {Array<unknown>} values @returns {string[]} */
function uniqueStrings(values) {
  return [...new Set(values.map(textOf).filter(Boolean))].sort(compareCodepoint);
}

/** @param {Record<string, unknown>} record @returns {Record<string, unknown>} */
function outcomeOf(record) {
  return recordOf(record.outcome);
}

/**
 * A semantic view used only while deriving dimensions. It never replaces the
 * preserved source record. Docket entries are wrappers whose event owns the kind;
 * all other source adapters already expose their routable fields structurally.
 *
 * @param {RealmSourceClass} sourceClass
 * @param {Record<string, unknown>} source
 * @returns {Record<string, unknown>}
 */
function semanticRecordOf(sourceClass, source) {
  if (sourceClass !== 'docket_order') return source;
  return { ...recordOf(source.event), ...source };
}

/**
 * @param {Record<string, unknown>} source
 * @param {RealmSourceClass} sourceClass
 * @returns {unknown}
 */
function explicitSourceId(source, sourceClass) {
  if (sourceClass === 'docket_order') {
    return source.queueId ?? source.id ?? recordOf(source.event).id;
  }
  if (sourceClass === 'paused_major') {
    return source.proposalId ?? source.id ?? outcomeOf(source).id;
  }
  return source.id ?? source.eventId ?? source.outcomeId ?? source.impactId;
}

/**
 * @param {Record<string, unknown>} source
 * @param {RealmSourceClass} sourceClass
 * @returns {string}
 */
function identityNamespace(source, sourceClass) {
  const isDecisionSource = (
    sourceClass === 'proposal'
    || sourceClass === 'paused_major'
  );
  if (isDecisionSource && textOf(explicitSourceId(source, sourceClass))) {
    return 'decision';
  }
  return sourceClass;
}

/** @param {Record<string, unknown>} record @returns {Record<string, unknown>[]} */
function nestedSemanticRecords(record) {
  const outcome = recordOf(record.outcome);
  return [
    record,
    outcome,
    recordOf(record.stressor),
    recordOf(outcome.stressor),
    recordOf(record.proposalPayload),
    recordOf(outcome.proposalPayload),
    recordOf(record.payload),
    recordOf(outcome.payload),
  ];
}

/**
 * Collect explicit settlement references only. A generic `targetId` may denote an
 * NPC, faction, relationship, or settlement and is therefore not silently
 * promoted into routeable settlement context.
 *
 * @param {Record<string, unknown>} record
 * @returns {string[]}
 */
function settlementIdsOf(record) {
  /** @type {unknown[]} */
  const found = [];
  for (const candidate of nestedSemanticRecords(record)) {
    for (const key of [
      'settlementId',
      'saveId',
      'targetSaveId',
      'sourceSettlementId',
      'targetSettlementId',
      'subjectSettlementId',
    ]) {
      if (candidate[key] != null) found.push(candidate[key]);
    }
    for (const key of ['settlementIds', 'affectedSettlementIds']) {
      if (Array.isArray(candidate[key])) found.push(...candidate[key]);
    }

    const deltas = candidate.populationDeltas;
    if (Array.isArray(deltas)) {
      for (const delta of deltas) {
        const d = recordOf(delta);
        if (d.settlementId != null) found.push(d.settlementId);
        else if (d.saveId != null) found.push(d.saveId);
      }
    } else if (isRecord(deltas)) {
      found.push(...Object.keys(deltas));
    }
  }
  return uniqueStrings(found);
}

/**
 * @param {Record<string, unknown>} record
 * @returns {Array<{kind: 'npc'|'faction', id: string}>}
 */
function nonSettlementSubjectsOf(record) {
  /** @type {Array<{kind: 'npc'|'faction', id: string}>} */
  const subjects = [];
  for (const candidate of nestedSemanticRecords(record)) {
    const npcId = textOf(candidate.npcId ?? candidate.subjectNpcId);
    const factionId = textOf(candidate.factionId ?? candidate.subjectFactionId);
    if (npcId) subjects.push({ kind: 'npc', id: npcId });
    if (factionId) subjects.push({ kind: 'faction', id: factionId });
  }
  const seen = new Set();
  return subjects
    .filter(({ kind, id }) => {
      const key = `${kind}:${id}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .sort((a, b) => compareCodepoint(`${a.kind}:${a.id}`, `${b.kind}:${b.id}`));
}

/**
 * @param {unknown} saves
 * @returns {{ provided: boolean, settlements: Map<string, Record<string, unknown>> }}
 */
function settlementIndexOf(saves) {
  /** @type {Map<string, Record<string, unknown>>} */
  const settlements = new Map();
  if (saves instanceof Map) {
    for (const [id, value] of saves) {
      const save = recordOf(value);
      settlements.set(String(id), recordOf(save.settlement ?? save));
    }
    return { provided: true, settlements };
  }
  if (Array.isArray(saves)) {
    for (const value of saves) {
      const save = recordOf(value);
      const settlement = recordOf(save.settlement ?? save);
      const id = textOf(save.id ?? settlement.id);
      if (id) settlements.set(id, settlement);
    }
    return { provided: true, settlements };
  }
  if (isRecord(saves)) {
    for (const [id, value] of Object.entries(saves)) {
      const save = recordOf(value);
      settlements.set(String(id), recordOf(save.settlement ?? save));
    }
    return { provided: true, settlements };
  }
  return { provided: false, settlements };
}

/**
 * @param {Record<string, unknown>} semantic
 * @param {{ provided: boolean, settlements: Map<string, Record<string, unknown>> }} settlementIndex
 * @param {string} campaignId
 * @returns {{
 *   subjects: Array<Record<string, unknown>>,
 *   affectedEntities: Array<Record<string, unknown>>,
 *   diagnostics: Array<Record<string, unknown>>,
 * }}
 */
function subjectContextOf(semantic, settlementIndex, campaignId) {
  const settlementIds = settlementIdsOf(semantic);
  const otherSubjects = nonSettlementSubjectsOf(semantic);
  /** @type {Array<Record<string, unknown>>} */
  const diagnostics = [];

  const settlementSubjects = settlementIds.map((id) => {
    const settlement = settlementIndex.settlements.get(id);
    const routeable = settlementIndex.provided ? !!settlement : null;
    if (settlementIndex.provided && !settlement) {
      diagnostics.push({
        code: 'missing_settlement_subject',
        severity: 'warning',
        subjectKind: 'settlement',
        subjectId: id,
        message: 'A referenced settlement is no longer available; retain readable fallback text and disable navigation.',
      });
    }
    return {
      kind: 'settlement',
      id,
      owner: campaignId ? { kind: 'campaign', id: campaignId } : null,
      name: textOf(settlement?.name) || null,
      routeable,
      fallbackLabel: routeable === false ? 'A settlement no longer in this campaign' : null,
    };
  });
  const other = otherSubjects.map((subject) => ({ ...subject, owner: null, routeable: null }));
  return {
    subjects: [...settlementSubjects, ...other],
    affectedEntities: [...settlementSubjects, ...other],
    diagnostics,
  };
}

/**
 * Cause truth is deliberately asymmetric: absence remains visible absence. The
 * source record's own ID is never relabeled as its cause.
 *
 * @param {Record<string, unknown>} semantic
 * @param {RealmSourceClass} sourceClass
 * @param {unknown} sourceId
 * @param {{ receiptIds: Set<string>, provenanceIds: Set<string> }} causeIndex
 * @returns {{
 *   state: 'available'|'partial'|'degraded'|'unavailable',
 *   available: boolean,
 *   rootRecordId: string|null,
 *   receiptId: string|null,
 *   reason: string,
 * }}
 */
function causeReceiptOf(semantic, sourceClass, sourceId, causeIndex) {
  const ownId = textOf(sourceId);
  if ((sourceClass === 'pulse_outcome' || sourceClass === 'pulse_digest')
    && ownId && causeIndex.receiptIds.has(ownId)) {
    const hasRecordedEdges = causeIndex.provenanceIds.has(ownId);
    return {
      state: hasRecordedEdges ? 'available' : 'partial',
      available: true,
      rootRecordId: ownId,
      receiptId: ownId,
      reason: hasRecordedEdges
        ? 'The pulse story is indexed and has a recorded provenance entry.'
        : 'The pulse story is indexed, but the ledger records no deeper cause edge.',
    };
  }

  for (const candidate of nestedSemanticRecords(semantic)) {
    const metadata = recordOf(candidate.metadata);
    const causedBy = recordOf(candidate.causedBy);
    const receiptId = textOf(
      candidate.causeReceiptId
      ?? candidate.sourceEventId
      ?? candidate.rootCauseId
      ?? metadata.causeReceiptId
      ?? metadata.causedBy
      ?? causedBy.id,
    );
    if (receiptId) {
      const hasRecordedEdges = causeIndex.provenanceIds.has(receiptId);
      const indexed = causeIndex.receiptIds.has(receiptId) || hasRecordedEdges;
      const state = indexed
        ? (hasRecordedEdges ? 'available' : 'partial')
        : 'degraded';
      const reason = indexed
        ? (
            hasRecordedEdges
              ? 'The authoritative source names an indexed cause receipt with recorded provenance.'
              : 'The authoritative source names an indexed receipt, but no deeper cause edge is recorded.'
          )
        : 'The source names a cause receipt that is not available in the current recorded index.';
      return {
        state,
        available: indexed,
        rootRecordId: receiptId,
        receiptId,
        reason,
      };
    }
  }
  return {
    state: 'unavailable',
    available: false,
    rootRecordId: null,
    receiptId: null,
    reason: 'No recorded cause receipt is available for this source.',
  };
}

/** @param {Record<string, unknown>} semantic @returns {number} */
function significanceOf(semantic) {
  for (const candidate of nestedSemanticRecords(semantic)) {
    const severity = finiteNumber(candidate.severity);
    if (severity != null) return unit(severity);
    const score = finiteNumber(candidate.score);
    if (score != null) return unit(score > 1 ? score / 100 : score);
    const significance = textOf(candidate.significance).toLowerCase();
    if (significance === 'major' || significance === 'critical') return 0.85;
    if (significance === 'moderate') return 0.55;
    if (significance === 'minor') return 0.3;
  }
  return 0.35;
}

/**
 * ⚠ The `__forecast` marker arm was DELETED here as writerless, together with this
 * file's `__resolution` arm (resolutionStateOf) and the three sibling arms in
 * heraldRouting.js — see the note above `isPendingDecision` there for the full
 * reasoning. The three structural stage spellings below are the live discriminator.
 *
 * @param {Record<string, unknown>} semantic @returns {TemporalPhase|null}
 */
function explicitEmergingPhase(semantic) {
  for (const candidate of nestedSemanticRecords(semantic)) {
    const stage = textOf(
      candidate.lifecycleStage
      ?? candidate.phase
      ?? candidate.temporalPhase,
    );
    if (stage === 'emerging') return 'emerging';
  }
  return null;
}

/**
 * @param {RealmSourceClass} sourceClass
 * @param {Record<string, unknown>} semantic
 * @returns {TemporalPhase}
 */
function temporalPhaseOf(sourceClass, semantic) {
  const resolution = sourceResolutionStateOf(sourceClass, semantic);
  if (sourceClass === 'proposal' && resolution !== 'unresolved') return 'historical';
  const emerging = explicitEmergingPhase(semantic);
  if (emerging) return emerging;
  if (
    sourceClass === 'proposal'
    || sourceClass === 'paused_major'
    || sourceClass === 'docket_order'
  ) {
    return 'planned';
  }
  if (sourceClass === 'live_stressor') return 'current';
  if (sourceClass === 'wizard_news') {
    const status = textOf(semantic.status ?? semantic.kind);
    return ['queued', 'ready', 'active'].includes(status) ? 'current' : 'historical';
  }
  return 'historical';
}

/** @param {Record<string, unknown>} semantic @returns {ResolutionState} */
function resolutionStateOf(semantic) {
  const status = textOf(semantic.status).toLowerCase();
  if (
    status === 'dismissed'
    || status === 'rejected'
    || status === 'ignored'
  ) {
    return 'dismissed';
  }
  if (status === 'superseded' || status === 'expired') return 'superseded';
  // The `__resolution` marker arm was deleted here as writerless (see
  // explicitEmergingPhase above); this status allowlist is the live discriminator.
  if (['applied', 'applied_by_dm', 'refused', 'resolved', 'completed'].includes(status)) {
    return 'resolved';
  }
  return 'unresolved';
}

/**
 * Recorded pulse members are completed facts even when their compact history
 * shape omits a redundant status field. Wizard News stores its transition in
 * `kind`, while the decision/order/stressor sources use ordinary status fields.
 *
 * @param {RealmSourceClass} sourceClass
 * @param {Record<string, unknown>} semantic
 * @returns {ResolutionState}
 */
function sourceResolutionStateOf(sourceClass, semantic) {
  if (sourceClass.startsWith('pulse_')) return 'resolved';
  if (sourceClass === 'paused_major') return 'unresolved';
  if (sourceClass === 'wizard_news') {
    const transition = textOf(semantic.status ?? semantic.kind).toLowerCase();
    if (
      transition === 'queued'
      || transition === 'ready'
      || transition === 'active'
    ) {
      return 'unresolved';
    }
    if (transition === 'ignored') return 'dismissed';
    if (transition === 'expired') return 'superseded';
    return 'resolved';
  }
  return resolutionStateOf(semantic);
}

/**
 * @param {RealmSourceClass} sourceClass
 * @param {ResolutionState} resolution
 * @returns {WorkflowKind}
 */
function workflowKindOf(sourceClass, resolution) {
  if (sourceClass === 'docket_order') return 'order';
  if (sourceClass === 'proposal') return resolution === 'unresolved' ? 'proposal' : 'verdict';
  if (sourceClass === 'paused_major') return 'verdict';
  return 'report';
}

/**
 * @param {RealmSourceClass} sourceClass
 * @param {ResolutionState} resolution
 * @returns {EpistemicClass}
 */
function epistemicClassOf(sourceClass, resolution) {
  if (sourceClass === 'docket_order') return 'staged_order';
  if (
    (sourceClass === 'proposal' || sourceClass === 'paused_major')
    && resolution === 'unresolved'
  ) {
    return 'pending_decision';
  }
  return 'recorded_fact';
}

/**
 * [W-I I2] The epistemic block: its class, plus a RELIABILITY STAMP when an information
 * house standing on this item's address chain both vouches for the item's channel and
 * actually heard the telling. The stamp key is CONDITIONAL and drops when absent, so a
 * campaign without brokerages (and every campaign while the virtual flag is dark) carries
 * the identical block it carried before this slice existed. The derivation itself lives in
 * domain/worldPulse/brokerageStamps.js; this seam only supplies what it already has.
 *
 * @param {EpistemicClass} epistemicClass
 * @param {RealmItemDerivationContext} context
 * @param {Record<string, unknown>} source
 * @param {{ primary: import('./heraldRouting.js').HeraldSection, tags: string[] }} topic
 * @param {{ subjects: Array<Record<string, unknown>> }} subjectContext
 * @returns {Record<string, unknown>}
 */
function epistemicBlockOf(epistemicClass, context, source, topic, subjectContext) {
  const reliability = heraldItemReliability({
    worldState: recordOf(context.campaign.worldState),
    settlements: context.settlementIndex.settlements,
    section: topic.primary,
    subjects: subjectContext.subjects,
    source,
  });
  return reliability ? { class: epistemicClass, reliability } : { class: epistemicClass };
}

/**
 * @param {Record<string, unknown>} semantic
 * @param {RealmSourceClass} sourceClass
 * @returns {{ primary: import('./heraldRouting.js').HeraldSection, tags: string[] }}
 */
function editorialTopicOf(semantic, sourceClass) {
  const key = routingKeyOf(semantic);
  const tags = [];
  for (const candidate of nestedSemanticRecords(semantic)) {
    if (Array.isArray(candidate.tags)) tags.push(...candidate.tags);
    tags.push(
      candidate.channelType,
      candidate.impactKind,
      candidate.candidateType,
      candidate.lifecycleStage,
    );
  }
  tags.push(sourceClass, key);
  return { primary: SECTION_OF(key), tags: uniqueStrings(tags) };
}

/**
 * @param {Record<string, unknown>} item
 * @returns {Record<string, unknown>}
 */
function attentionOf(item) {
  const workflow = textOf(recordOf(item.workflow).kind);
  const temporal = textOf(recordOf(item.temporal).phase);
  const operational = textOf(recordOf(item.operational).state);
  const resolution = textOf(recordOf(item.resolution).state);
  const significance = unit(finiteNumber(recordOf(item.attention).significance) ?? 0.35);

  let attentionClass = 'routine_record';
  let blocking = false;
  let urgency = temporal === 'historical' ? 0.15 : 0.4;
  let reason = realmAttentionDefinition(attentionClass).reason;

  if (
    (workflow === 'proposal' || workflow === 'verdict')
    && resolution === 'unresolved'
  ) {
    attentionClass = 'blocking_decision';
    blocking = true;
    urgency = 1;
    reason = realmAttentionDefinition(attentionClass).reason;
  } else if (operational === 'lapsed') {
    attentionClass = 'lapsed_order';
    urgency = 0.95;
    reason = realmAttentionDefinition(attentionClass).reason;
  } else if (temporal === 'current' && significance >= 0.72) {
    attentionClass = 'critical_condition';
    urgency = Math.max(0.75, significance);
    reason = realmAttentionDefinition(attentionClass).reason;
  } else if (significance >= 0.72) {
    attentionClass = 'major_change';
    urgency = temporal === 'historical' ? 0.45 : 0.7;
    reason = realmAttentionDefinition(attentionClass).reason;
  } else if (temporal === 'emerging') {
    attentionClass = 'emerging_pressure';
    urgency = Math.max(0.6, significance);
    reason = realmAttentionDefinition(attentionClass).reason;
  } else if (operational === 'endangered') {
    urgency = 0.55;
    reason = 'Current context is insufficient to prove that this staged order remains executable.';
  }

  return {
    class: attentionClass,
    blocking,
    urgency: unit(urgency),
    significance,
    reason,
  };
}

/**
 * @param {{
 *   sourceClass: RealmSourceClass,
 *   source: Record<string, unknown>,
 *   tick?: unknown,
 *   containerId?: unknown,
 *   index: number,
 * }} projection
 * @param {RealmItemDerivationContext} context
 * @returns {Record<string, unknown>}
 */
function realmItemOf(projection, context) {
  const {
    sourceClass,
    source,
    tick,
    containerId,
  } = projection;
  const semantic = semanticRecordOf(sourceClass, source);
  const namespace = identityNamespace(source, sourceClass);
  const identity = realmSourceIdentity({
    namespace,
    record: source,
    explicitId: explicitSourceId(source, sourceClass),
    containerId,
    tick,
  });
  const sourceRecord = stableRealmClone(source);
  const topic = editorialTopicOf(semantic, sourceClass);
  const campaignId = textOf(context.campaign.id);
  const subjectContext = subjectContextOf(semantic, context.settlementIndex, campaignId);
  /** @type {Array<Record<string, unknown>>} */
  const diagnostics = [...subjectContext.diagnostics];
  if (identity.usedFallback) {
    diagnostics.push({
      code: 'fallback_source_identity',
      severity: 'info',
      message: 'The source has no authored ID; identity uses immutable source context and content.',
    });
  }

  const itemTick = finiteNumber(tick ?? source.tick ?? outcomeOf(source).tick);
  const resolution = sourceResolutionStateOf(sourceClass, semantic);
  const cause = {
    ...causeReceiptOf(
      semantic,
      sourceClass,
      explicitSourceId(source, sourceClass),
      context.causeIndex,
    ),
    inWorldTick: itemTick,
    subjects: subjectContext.subjects,
    affectedEntities: subjectContext.affectedEntities,
    provenance: {
      sourceClass,
      sourceOriginKey: identity.originKey,
      sourceFingerprint: identity.fingerprint,
    },
  };
  const itemId = `realm-item:${encodeURIComponent(campaignId || 'unowned')}:${identity.originKey}`;
  /** @type {Record<string, unknown>} */
  const item = {
    schemaVersion: REALM_ITEM_SCHEMA_VERSION,
    id: itemId,
    // `presentationKey` normally equals identity. Only an irresolvable anonymous
    // collision receives a volatile projection suffix; consumers must never
    // persist or route by that degraded key.
    presentationKey: itemId,
    identity: {
      state: identity.usedFallback ? 'surrogate' : 'authored',
      interactive: true,
      owner: campaignId ? { kind: 'campaign', id: campaignId } : null,
      reason: identity.usedFallback
        ? 'Derived from immutable source context because the legacy record has no authored ID.'
        : 'The authoritative source owns this identity.',
    },
    sourceFingerprint: identity.fingerprint,
    source: {
      primaryClass: sourceClass,
      classes: [sourceClass],
      containerId: textOf(containerId) || null,
      originKey: identity.originKey,
      fingerprint: identity.fingerprint,
      records: [{
        sourceClass,
        containerId: textOf(containerId) || null,
        sourceTick: itemTick,
        originKey: identity.originKey,
        fingerprint: identity.fingerprint,
        record: sourceRecord,
      }],
    },
    sourceKind: routingKeyOf(semantic) || sourceClass,
    headline: textOf(source.headline ?? outcomeOf(source).headline) || null,
    summary: textOf(source.summary ?? outcomeOf(source).summary) || null,
    tick: itemTick,
    topic,
    temporal: { phase: temporalPhaseOf(sourceClass, semantic) },
    resolution: { state: resolution },
    operational: realmOperationalCondition({
      sourceClass,
      source,
      resolution,
      campaign: context.campaign,
      settlementIndex: context.settlementIndex,
      canUseCustomProvided: context.canUseCustomProvided,
      canUseCustom: context.canUseCustom,
    }),
    workflow: { kind: workflowKindOf(sourceClass, resolution) },
    // [W-I I2] The epistemic dimension gains a CONDITIONAL reliability stamp where an
    // information house stands on the item's own address chain (design section 5). The key
    // is absent everywhere else, which is the design's unlabelled baseline rather than an
    // omission, and absent entirely while the virtual flag is dark, so no golden moves.
    epistemic: epistemicBlockOf(epistemicClassOf(sourceClass, resolution), context, source, topic, subjectContext),
    attention: { significance: significanceOf(semantic) },
    subjects: subjectContext.subjects,
    affectedEntities: subjectContext.affectedEntities,
    cause,
    legalActions: realmLegalActions({
      sourceClass,
      source,
      sourceId: textOf(explicitSourceId(source, sourceClass)),
      resolution,
      advancePaused: context.advancePaused,
    }),
    payload: { kind: sourceClass, sourceRecord },
    compatibility: {
      heraldSection: heraldSectionOfRecord(semantic),
    },
    diagnostics,
  };
  item.attention = attentionOf(item);
  return item;
}

/** @param {Record<string, unknown>} item @returns {string[]} */
function itemSourceClasses(item) {
  return Array.isArray(recordOf(item.source).classes)
    ? uniqueStrings(/** @type {unknown[]} */ (recordOf(item.source).classes))
    : [];
}

/** @param {Array<Record<string, unknown>>} entries @returns {Array<Record<string, unknown>>} */
function uniqueEntities(entries) {
  const byKey = new Map();
  for (const entry of entries) {
    const key = `${textOf(entry.kind)}:${textOf(entry.id)}`;
    if (key !== ':' && !byKey.has(key)) byKey.set(key, entry);
  }
  return [...byKey.entries()]
    .sort(([a], [b]) => compareCodepoint(a, b))
    .map(([, value]) => value);
}

/**
 * Preserve an identity collision as readable evidence while disabling every
 * route or command that would pretend the ambiguous identity is safe.
 *
 * @param {Record<string, unknown>} item
 * @param {{ code: string, reason: string, presentationKey: string }} collision
 * @returns {Record<string, unknown>}
 */
function degradedCollision(item, collision) {
  const { code, reason, presentationKey } = collision;
  /** @param {Record<string, unknown>} value @returns {Record<string, unknown>} */
  const disableRoute = (value) => ({
    ...value,
    routeable: false,
    routeReason: reason,
  });
  /** @param {Record<string, unknown>} value @returns {Record<string, unknown>} */
  const disableAction = (value) => ({
    ...value,
    availability: {
      available: false,
      refusalReason: reason,
    },
  });
  return {
    ...item,
    presentationKey,
    identity: {
      state: 'degraded_collision',
      interactive: false,
      reason,
    },
    subjects: Array.isArray(item.subjects) ? item.subjects.filter(isRecord).map(disableRoute) : [],
    affectedEntities: Array.isArray(item.affectedEntities)
      ? item.affectedEntities.filter(isRecord).map(disableRoute) : [],
    legalActions: Array.isArray(item.legalActions) ? item.legalActions.filter(isRecord).map(disableAction) : [],
    diagnostics: [
      ...(Array.isArray(item.diagnostics) ? item.diagnostics : []),
      {
        code,
        severity: 'error',
        message: reason,
      },
    ],
  };
}

/**
 * Two anonymous records with identical immutable context cannot receive honest,
 * distinct stable identities. `projectionNumber` is only a volatile rendering
 * key; it is outside `id`/`source.originKey` and must never be persisted.
 *
 * @param {Record<string, unknown>} item
 * @param {number} projectionNumber
 * @returns {Record<string, unknown>}
 */
function degradedAnonymousCollision(item, projectionNumber) {
  return degradedCollision(item, {
    code: 'anonymous_identity_collision',
    reason: 'Two anonymous source records are indistinguishable in immutable context; navigation and actions are disabled.',
    presentationKey: `${textOf(item.id)}::volatile-projection-${projectionNumber}`,
  });
}

/** @param {Record<string, unknown>} item @returns {Record<string, unknown>} */
function degradedAuthoredCollision(item) {
  const fingerprint = textOf(item.sourceFingerprint).split(':').pop() || 'unknown';
  return degradedCollision(item, {
    code: 'source_identity_collision',
    reason: 'Conflicting records reuse one authored source identity; navigation and actions are disabled.',
    presentationKey: `${textOf(item.id)}::conflicting-source-${fingerprint}`,
  });
}

/**
 * Merge two PROVEN views of the same decision. The proposal remains the primary
 * content payload when present; the pause adds verdict workflow and its legal
 * actions. Both source snapshots remain inspectable.
 *
 * @param {Record<string, unknown>} existing
 * @param {Record<string, unknown>} incoming
 * @returns {Record<string, unknown>}
 */
function mergeDecisionItems(existing, incoming) {
  const existingSource = recordOf(existing.source);
  const incomingSource = recordOf(incoming.source);
  const records = [
    ...(Array.isArray(existingSource.records) ? existingSource.records : []),
    ...(Array.isArray(incomingSource.records) ? incomingSource.records : []),
  ].filter(isRecord);
  const classes = uniqueStrings([...itemSourceClasses(existing), ...itemSourceClasses(incoming)]);
  const hasPausedVerdict = classes.includes('paused_major');
  const proposalPrimary = classes.includes('proposal');
  const primary = proposalPrimary ? existing : incoming;
  const secondary = primary === existing ? incoming : existing;
  const primaryTopic = recordOf(primary.topic);
  const secondaryTopic = recordOf(secondary.topic);
  const primaryTemporal = textOf(recordOf(primary.temporal).phase);
  const secondaryTemporal = textOf(recordOf(secondary.temporal).phase);
  const temporalPriority = /** @type {Readonly<Record<string, number>>} */ (TEMPORAL_PRIORITY);
  const primaryTemporalPriority = temporalPriority[primaryTemporal] ?? 0;
  const secondaryTemporalPriority = temporalPriority[secondaryTemporal] ?? 0;
  const temporal = primaryTemporalPriority >= secondaryTemporalPriority
    ? primaryTemporal
    : secondaryTemporal;
  const combinedFingerprint = realmSourceFingerprint(records.map((entry) => ({
    sourceClass: entry.sourceClass,
    fingerprint: entry.fingerprint,
  })));
  const incomingCarriesPausedVerdict = (
    classes.includes(textOf(incomingSource.primaryClass))
    && incomingSource.primaryClass === 'paused_major'
  );
  const pausedVerdictActions = incomingCarriesPausedVerdict
    ? incoming.legalActions
    : existing.legalActions;

  /** @type {Record<string, unknown>} */
  const merged = {
    ...primary,
    sourceFingerprint: combinedFingerprint,
    source: {
      primaryClass: proposalPrimary ? 'proposal' : incomingSource.primaryClass,
      classes,
      containerId: proposalPrimary ? existingSource.containerId : incomingSource.containerId,
      originKey: existingSource.originKey,
      fingerprint: combinedFingerprint,
      records,
    },
    sourceKind: primary.sourceKind || secondary.sourceKind,
    headline: primary.headline || secondary.headline,
    summary: primary.summary || secondary.summary,
    tick: Math.max(finiteNumber(primary.tick) ?? 0, finiteNumber(secondary.tick) ?? 0) || null,
    topic: {
      primary: primaryTopic.primary || secondaryTopic.primary,
      tags: uniqueStrings([
        ...(Array.isArray(primaryTopic.tags) ? primaryTopic.tags : []),
        ...(Array.isArray(secondaryTopic.tags) ? secondaryTopic.tags : []),
      ]),
    },
    temporal: { phase: temporal },
    resolution: { state: 'unresolved' },
    operational: { state: 'active', assessed: true, reason: null },
    workflow: { kind: hasPausedVerdict ? 'verdict' : 'proposal' },
    epistemic: { class: 'pending_decision' },
    attention: {
      significance: Math.max(
        finiteNumber(recordOf(primary.attention).significance) ?? 0,
        finiteNumber(recordOf(secondary.attention).significance) ?? 0,
      ),
    },
    subjects: uniqueEntities([
      ...(Array.isArray(primary.subjects) ? primary.subjects.filter(isRecord) : []),
      ...(Array.isArray(secondary.subjects) ? secondary.subjects.filter(isRecord) : []),
    ]),
    affectedEntities: uniqueEntities([
      ...(Array.isArray(primary.affectedEntities) ? primary.affectedEntities.filter(isRecord) : []),
      ...(Array.isArray(secondary.affectedEntities) ? secondary.affectedEntities.filter(isRecord) : []),
    ]),
    cause: recordOf(primary.cause).available ? primary.cause : secondary.cause,
    legalActions: hasPausedVerdict ? pausedVerdictActions : primary.legalActions,
    payload: {
      kind: 'decision',
      sourceRecords: records.map((entry) => ({
        sourceClass: entry.sourceClass,
        record: entry.record,
      })),
    },
    compatibility: {
      heraldSection: 'adjudication',
    },
    diagnostics: [
      ...(Array.isArray(primary.diagnostics) ? primary.diagnostics : []),
      ...(Array.isArray(secondary.diagnostics) ? secondary.diagnostics : []),
    ],
  };
  merged.attention = attentionOf(merged);
  return merged;
}

/**
 * Derive the complete G-3 read model. `saves` and `canUseCustom` are optional,
 * but both are required for an honest docket-lapse verdict. Without them a docket
 * item is marked operationally endangered/unassessed, never falsely declared safe.
 *
 * @param {Record<string, unknown>|null|undefined} campaignValue
 * @param {{ saves?: unknown, canUseCustom?: boolean }} [options]
 * @returns {Readonly<{
 *   schemaVersion: number,
 *   items: ReadonlyArray<Record<string, unknown>>,
 *   ranked: ReadonlyArray<Record<string, unknown>>,
 *   counts: Record<string, unknown>,
 *   diagnostics: ReadonlyArray<Record<string, unknown>>,
 *   exclusions: ReadonlyArray<Record<string, unknown>>,
 * }>}
 */
export function buildRealmItemReadModel(campaignValue, options = {}) {
  const campaign = recordOf(campaignValue);
  const settlementIndex = settlementIndexOf(options.saves);
  const worldState = recordOf(campaign.worldState);
  const inventory = inventoryRealmItemSources(campaign);
  const context = {
    campaign,
    settlementIndex,
    canUseCustomProvided: typeof options.canUseCustom === 'boolean',
    canUseCustom: options.canUseCustom === true,
    advancePaused: isRecord(worldState.pausedAdvance),
    causeIndex: realmCauseIndex(campaign),
  };
  /** @type {Map<string, Record<string, unknown>>} */
  const byId = new Map();
  /** @type {Map<string, number>} */
  const anonymousCollisionCounts = new Map();
  /** @type {Array<Record<string, unknown>>} */
  const modelDiagnostics = [];

  for (const projection of inventory.projections) {
    let item = realmItemOf(projection, context);
    const existing = byId.get(textOf(item.id));
    if (!existing) {
      byId.set(textOf(item.id), item);
      continue;
    }

    const existingRecordsValue = recordOf(existing.source).records;
    const existingRecords = Array.isArray(existingRecordsValue)
      ? existingRecordsValue.filter(isRecord) : [];
    const incomingRecord = recordOf(item.source).records;
    const incomingProjection = Array.isArray(incomingRecord) ? recordOf(incomingRecord[0]) : {};
    const sameClass = existingRecords.find((entry) => entry.sourceClass === projection.sourceClass);
    if (sameClass && sameClass.fingerprint === incomingProjection.fingerprint) {
      const existingIdentity = textOf(recordOf(existing.identity).state);
      const incomingIdentity = textOf(recordOf(item.identity).state);
      const anonymousCollision = existingIdentity !== 'authored' && incomingIdentity !== 'authored';
      if (anonymousCollision) {
        const collisionCount = (anonymousCollisionCounts.get(textOf(item.id)) || 1) + 1;
        anonymousCollisionCounts.set(textOf(item.id), collisionCount);
        if (collisionCount === 2) {
          byId.set(textOf(item.id), degradedAnonymousCollision(existing, 1));
        }
        const storageKey = `${textOf(item.id)}::anonymous-collision:${collisionCount}`;
        byId.set(storageKey, degradedAnonymousCollision(item, collisionCount));
        modelDiagnostics.push({
          code: 'anonymous_identity_collision',
          severity: 'error',
          itemId: item.id,
          projectionCount: collisionCount,
          message: 'Indistinguishable anonymous projections were retained with interaction disabled.',
        });
        continue;
      }
      modelDiagnostics.push({
        code: 'duplicate_source_projection',
        severity: 'info',
        itemId: item.id,
        sourceClass: projection.sourceClass,
        message: 'An exact repeated source projection was accounted for once.',
      });
      continue;
    }

    const classes = uniqueStrings([...itemSourceClasses(existing), ...itemSourceClasses(item)]);
    const provenDecisionPair = classes.length === 2
      && classes.includes('proposal')
      && classes.includes('paused_major');
    if (provenDecisionPair) {
      byId.set(textOf(item.id), mergeDecisionItems(existing, item));
      continue;
    }

    const collisionSuffix = textOf(item.sourceFingerprint).split(':').pop() || 'unknown';
    const storageKey = `${textOf(item.id)}::source-collision:${collisionSuffix}`;
    byId.set(textOf(item.id), degradedAuthoredCollision(existing));
    byId.set(storageKey, degradedAuthoredCollision(item));
    modelDiagnostics.push({
      code: 'source_identity_collision',
      severity: 'error',
      itemId: existing.id,
      conflictingItemId: item.id,
      message: 'Conflicting source projections were retained with interaction disabled.',
    });
  }

  const items = [...byId.values()]
    .sort((a, b) => {
      const identityDelta = compareCodepoint(a.id, b.id);
      return identityDelta || compareCodepoint(
        a.presentationKey ?? a.id,
        b.presentationKey ?? b.id,
      );
    })
    .map((item) => freezeRealmValue(item));
  const ranked = Object.freeze(rankRealmItems(items));
  const diagnostics = Object.freeze([
    ...modelDiagnostics,
    ...items.flatMap((item) => (Array.isArray(item.diagnostics) ? item.diagnostics : [])),
  ].map((diagnostic) => freezeRealmValue(stableRealmClone(diagnostic))));
  return freezeRealmValue({
    schemaVersion: REALM_ITEM_SCHEMA_VERSION,
    items: Object.freeze(items),
    ranked,
    counts: freezeRealmValue(countRealmItems(items)),
    diagnostics,
    exclusions: Object.freeze(
      inventory.exclusions.map((entry) => (
        freezeRealmValue(stableRealmClone(entry))
      )),
    ),
  });
}
