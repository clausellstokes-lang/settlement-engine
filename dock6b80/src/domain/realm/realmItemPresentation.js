/**
 * domain/realm/realmItemPresentation.js — deterministic RealmItem collection
 * projections.
 *
 * RealmItem envelopes own facts; this leaf owns only collection ordering, counts,
 * and session-local read flags. None of these functions mutates an envelope or
 * promotes presentation state into shared campaign truth.
 */

import { compareCodepoint } from '../deterministicSort.js';
import { freezeRealmValue } from './realmItemIdentity.js';
import { realmAttentionRank } from './realmItemAttention.js';

/** @param {unknown} value @returns {Record<string, unknown>} */
function recordOf(value) {
  return value != null && typeof value === 'object' && !Array.isArray(value)
    ? /** @type {Record<string, unknown>} */ (value) : {};
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

/** @param {Record<string, unknown>} item @returns {string[]} */
function sourceClassesOf(item) {
  const classes = recordOf(item.source).classes;
  if (!Array.isArray(classes)) return [];
  return [...new Set(classes.map(textOf).filter(Boolean))].sort(compareCodepoint);
}

/**
 * Deterministic attention ranking. It sorts a copy and never mutates either the
 * item collection or its envelopes.
 *
 * @param {ReadonlyArray<Record<string, unknown>>} items
 * @returns {Array<Record<string, unknown>>}
 */
export function rankRealmItems(items) {
  return [...items].sort((a, b) => {
    const aa = recordOf(a.attention);
    const ba = recordOf(b.attention);
    const classDelta = realmAttentionRank(aa.class) - realmAttentionRank(ba.class);
    if (classDelta) return classDelta;
    const urgencyDelta = (finiteNumber(ba.urgency) ?? 0) - (finiteNumber(aa.urgency) ?? 0);
    if (urgencyDelta) return urgencyDelta;
    const significanceDelta = (finiteNumber(ba.significance) ?? 0) - (finiteNumber(aa.significance) ?? 0);
    if (significanceDelta) return significanceDelta;
    const tickDelta = (finiteNumber(b.tick) ?? -1) - (finiteNumber(a.tick) ?? -1);
    if (tickDelta) return tickDelta;
    const identityDelta = compareCodepoint(a.id, b.id);
    if (identityDelta) return identityDelta;
    // Collision survivors deliberately share their canonical RealmItem ID. Their
    // deterministic, read-only presentation key is the final ordering seam; using
    // only `id` here would fall back to the authoritative array's incidental order.
    return compareCodepoint(a.presentationKey ?? a.id, b.presentationKey ?? b.id);
  });
}

/**
 * Count canonical items by independent dimensions. A proven merged decision is
 * one item and one blocker, while each authoritative source class remains
 * represented in `bySource`.
 *
 * @param {ReadonlyArray<Record<string, unknown>>} items
 * @returns {Record<string, unknown>}
 */
export function countRealmItems(items) {
  /** @type {Record<string, number>} */
  const bySource = {};
  /** @type {Record<string, number>} */
  const byTopic = {};
  /** @type {Record<string, number>} */
  const byWorkflow = {};
  /** @type {Record<string, number>} */
  const byAttention = {};
  let blocking = 0;
  for (const item of items) {
    for (const sourceClass of sourceClassesOf(item)) bySource[sourceClass] = (bySource[sourceClass] || 0) + 1;
    const topic = textOf(recordOf(item.topic).primary);
    const workflow = textOf(recordOf(item.workflow).kind);
    const attention = textOf(recordOf(item.attention).class);
    if (topic) byTopic[topic] = (byTopic[topic] || 0) + 1;
    if (workflow) byWorkflow[workflow] = (byWorkflow[workflow] || 0) + 1;
    if (attention) byAttention[attention] = (byAttention[attention] || 0) + 1;
    if (recordOf(item.attention).blocking === true) blocking += 1;
  }
  return { total: items.length, blocking, bySource, byTopic, byWorkflow, byAttention };
}

/**
 * Session-local presentation state remains SEPARATE from canonical realm truth.
 * This helper derives read flags keyed by RealmItem ID without modifying items or
 * implying that "read" belongs in shared campaign persistence.
 *
 * @param {ReadonlyArray<Record<string, unknown>>} items
 * @param {Iterable<unknown>} [readIds]
 * @returns {Readonly<Record<string, Readonly<{read: boolean}>>>}
 */
export function realmItemReadState(items, readIds = []) {
  const read = new Set([...readIds].map(textOf));
  /** @type {Record<string, Readonly<{read: boolean}>>} */
  const state = {};
  for (const item of [...items].sort((a, b) => compareCodepoint(a.id, b.id))) {
    const id = textOf(item.id);
    if (id) state[id] = Object.freeze({ read: read.has(id) });
  }
  return freezeRealmValue(state);
}
