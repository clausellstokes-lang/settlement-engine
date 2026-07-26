/**
 * domain/realm/realmItemInventory.js — authoritative-source inventory for G-3.
 *
 * This leaf knows WHERE RealmItem source records live, not what they mean. It
 * enumerates every pilot family with source context intact and records malformed
 * entries as exclusions rather than silently losing them. Array ordinals appear
 * only in diagnostics; they never participate in RealmItem identity.
 */

import { realmSourceFingerprint } from './realmItemIdentity.js';

/** @typedef {'pulse_outcome'|'pulse_digest'|'pulse_resolved_stressor'|'live_stressor'|'wizard_news'|'proposal'|'paused_major'|'docket_order'} RealmSourceClass */
/**
 * @typedef {object} RealmSourceProjection
 * @property {RealmSourceClass} sourceClass
 * @property {Record<string, unknown>} source
 * @property {unknown} [tick]
 * @property {unknown} [containerId]
 * @property {number} index diagnostic position only; never stable identity
 */

export const REALM_ITEM_SOURCE_CLASSES = Object.freeze(/** @type {RealmSourceClass[]} */ ([
  'pulse_outcome',
  'pulse_digest',
  'pulse_resolved_stressor',
  'live_stressor',
  'wizard_news',
  'proposal',
  'paused_major',
  'docket_order',
]));

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

/**
 * An old pulse may lack its authored pulse ID. Its container surrogate uses only
 * immutable pulse metadata — never the pulse's array position and never the order
 * of the child collections whose items it contains.
 *
 * @param {Record<string, unknown>} pulse
 * @returns {string}
 */
function pulseContainerIdOf(pulse) {
  const authoredId = textOf(pulse.id);
  if (authoredId) return authoredId;
  const stableContext = {
    tick: pulse.tick ?? null,
    interval: pulse.interval ?? null,
    committed: pulse.committed ?? null,
    createdAt: pulse.createdAt ?? null,
    calendar: pulse.calendar ?? null,
    candidateCount: pulse.candidateCount ?? null,
    selectedCount: pulse.selectedCount ?? null,
    autoAppliedCount: pulse.autoAppliedCount ?? null,
    proposalCount: pulse.proposalCount ?? null,
  };
  const fingerprintTail = realmSourceFingerprint(stableContext).split(':').pop() || '0';
  return `anonymous-pulse:${textOf(pulse.tick) || 'unticked'}:${fingerprintTail}`;
}

/**
 * Mirror the existing CauseWalk's durable lookup surface: pulse outcomes and
 * impact-digest entries are addressable roots by their own record IDs, while the
 * provenance ledger tells us which roots have recorded cause edges.
 *
 * @param {Record<string, unknown>} campaign
 * @returns {{ receiptIds: Set<string>, provenanceIds: Set<string> }}
 */
export function realmCauseIndex(campaign) {
  const worldState = recordOf(campaign.worldState);
  const receiptIds = new Set();
  const pulseHistory = Array.isArray(worldState.pulseHistory) ? worldState.pulseHistory : [];
  for (const value of pulseHistory) {
    const pulse = recordOf(value);
    for (const collection of [pulse.selectedOutcomes, pulse.impactDigest]) {
      if (!Array.isArray(collection)) continue;
      for (const entry of collection) {
        const id = textOf(recordOf(entry).id);
        if (id) receiptIds.add(id);
      }
    }
  }
  const ledgers = recordOf(worldState.spatialLedgers);
  const provenance = recordOf(ledgers.provenance);
  return {
    receiptIds,
    provenanceIds: new Set(Object.keys(provenance)),
  };
}

/**
 * @param {Record<string, unknown>} campaign
 * @returns {{
 *   projections: RealmSourceProjection[],
 *   exclusions: Array<Record<string, unknown>>,
 * }}
 */
export function inventoryRealmItemSources(campaign) {
  const worldState = recordOf(campaign.worldState);
  /** @type {RealmSourceProjection[]} */
  const projections = [];
  /** @type {Array<Record<string, unknown>>} */
  const exclusions = [];

  /**
 * @param {RealmSourceClass} sourceClass
 * @param {unknown} values
 * @param {unknown} tick
 * @param {unknown} containerId
 */
  const addList = (sourceClass, values, tick, containerId) => {
    if (values == null) return;
    if (!Array.isArray(values)) {
      exclusions.push({
        sourceClass,
        containerId: textOf(containerId) || null,
        reason: 'Source collection is not an array.',
      });
      return;
    }
    values.forEach((value, index) => {
      if (!isRecord(value)) {
        exclusions.push({
          sourceClass,
          containerId: textOf(containerId) || null,
          index,
          reason: 'Source entry is not a record.',
        });
        return;
      }
      // Source-authored time wins. Feed/current tick is only compatibility context
      // for old records that genuinely carry no tick of their own.
      projections.push({
        sourceClass,
        source: value,
        tick: value.tick ?? tick,
        containerId,
        index,
      });
    });
  };

  const pulseHistory = Array.isArray(worldState.pulseHistory) ? worldState.pulseHistory : [];
  if (worldState.pulseHistory != null && !Array.isArray(worldState.pulseHistory)) {
    exclusions.push({ sourceClass: 'pulse', reason: 'Pulse history is not an array.' });
  }
  pulseHistory.forEach((value, pulseIndex) => {
    if (!isRecord(value)) {
      exclusions.push({
        sourceClass: 'pulse',
        index: pulseIndex,
        reason: 'Pulse history entry is not a record.',
      });
      return;
    }
    const tick = value.tick;
    const containerId = pulseContainerIdOf(value);
    addList('pulse_outcome', value.selectedOutcomes, tick, containerId);
    addList('pulse_digest', value.impactDigest, tick, containerId);
    addList('pulse_resolved_stressor', value.resolvedStressors, tick, containerId);
  });

  addList('live_stressor', worldState.stressors, worldState.tick, 'live-stressors');
  const wizardFeeds = [
    { containerId: 'campaign-wizard-news', feed: campaign.wizardNews },
    { containerId: 'legacy-world-state-wizard-news', feed: worldState.wizardNews },
  ];
  wizardFeeds.forEach(({ containerId, feed }) => {
    const entries = Array.isArray(feed) ? feed : recordOf(feed).entries;
    addList('wizard_news', entries, worldState.tick, containerId);
  });

  addList('proposal', worldState.proposals, worldState.tick, 'proposals');
  const pausedAdvance = recordOf(worldState.pausedAdvance);
  addList('paused_major', pausedAdvance.pendingMajors, worldState.tick, pausedAdvance.id ?? 'paused-advance');
  addList('docket_order', worldState.pendingEvents, worldState.tick, 'docket');
  return { projections, exclusions };
}
