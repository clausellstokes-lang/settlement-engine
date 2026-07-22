// heraldGrammar.js — THE HERALD HEADLINE GRAMMAR (THE NEWS ADDRESS LAW +
// FINITE-SEMANTICS, owner doctrine 2026-07-22).
//
// The shared headline line, as TYPED SLOTS (never freeform composition):
//
//   [SUBJECT-ADDRESS]  [ACTION OBJECT]  ·  [AFFECTED]  |  [REASON]  [·PROVENANCE]
//
//   - SUBJECT-ADDRESS  — resolved by the realm entity web (AddressChain), ids only.
//   - ACTION + OBJECT  — the recorded headline, carried BYTE-VERBATIM. The discourse
//                        kernel's law: a recorded realization is the truth surface and
//                        is NEVER rewritten, retensed, or re-composed here. The engine
//                        already realized the verb+complement; the Herald presents it.
//   - AFFECTED         — the settlement(s) touched, linked (AffectedSettlements).
//   - REASON           — the recorded cause (item.reasons[0]); ABSENT when unrecorded,
//                        never faked. The "|" separator is a STYLED layout element in
//                        HeraldHeadline, not a literal em-dash in any copy string.
//   - PROVENANCE       — a chip ONLY when non-canonical (amendable/covert/decreed).
//
// PER-SECTION TEMPLATES are the FROZEN presentation config below (typed reason label
// + lead emphasis per section), matching the spec's forms (siege/declaration/
// occupation/capture for war; rise/seats/seat for faith; relationship/embargo/route
// for trade; stressor/tradition for events). A kind with no richer record degrades to
// the recorded headline alone — honest, never invented.
//
// PURE display selector. No store, no React, no Date/rng.

import { human } from './WorldPulseData.js';

/**
 * @typedef {import('./heraldFeed.js').HeraldItem} HeraldItem
 * @typedef {import('../../domain/realm/heraldRouting.js').HeraldSection} HeraldSection
 */

/**
 * The frozen per-section headline template config. `reasonLabel` is a typed section
 * word (the spec's casus / from / driver / origin / drivers / stakes); it is a fixed
 * small-caps LABEL for the recorded reason, not authored prose about the event.
 * @type {Readonly<Record<HeraldSection, { reasonLabel: string }>>}
 */
export const HEADLINE_TEMPLATES = Object.freeze(/** @type {Record<HeraldSection, { reasonLabel: string }>} */ ({
  war: { reasonLabel: 'Casus' },
  faith: { reasonLabel: 'From' },
  trade: { reasonLabel: 'Driver' },
  events: { reasonLabel: 'Origin' },
  divination: { reasonLabel: 'Drivers' },
  adjudication: { reasonLabel: 'Stakes' },
}));

/** @param {unknown} v @returns {string} */
function str(v) { return v == null ? '' : String(v); }

/**
 * The recorded reason for the headline: the first recorded reason string (humanized
 * for the underscore vocabulary), or null when the record holds no reason (degrade —
 * the REASON slot then renders nothing). Never a fabricated cause.
 * @param {HeraldItem} item
 * @returns {string|null}
 */
export function reasonOf(item) {
  const reasons = Array.isArray(item?.reasons) ? item.reasons.filter(Boolean) : [];
  if (reasons.length === 0) return null;
  const first = str(reasons[0]).trim();
  if (!first) return null;
  // A recorded reason may be a typed token (jargon) — humanize the underscores, never
  // invent words. If it already reads as prose, humanize is a no-op.
  return /^[a-z][a-z0-9_]*$/.test(first) ? human(first) : first;
}

/**
 * The typed headline slots for one item under its section template. Everything is
 * READ from the record — subject descriptor, byte-verbatim glance, affected ids,
 * recorded reason, provenance — nothing composed.
 * @param {HeraldItem} item
 * @returns {{ subject: HeraldItem['subject'], glance: string, affectedIds: string[], reason: string|null, reasonLabel: string, provenance: HeraldItem['provenance'] }}
 */
export function headlineSlotsOf(item) {
  const tpl = HEADLINE_TEMPLATES[item.section] || HEADLINE_TEMPLATES.events;
  return {
    subject: item.subject,
    glance: str(item.headline),
    affectedIds: Array.isArray(item.affectedIds) ? item.affectedIds : [],
    reason: reasonOf(item),
    reasonLabel: tpl.reasonLabel,
    provenance: item.provenance,
  };
}

/**
 * The settlement an item is primarily FILED under, for the nested (presence-over-
 * repetition) form: the resolved subject's settlement, else the first affected id.
 * Returns null for a subjectless, settlement-less item (the "across the realm" group).
 * @param {HeraldItem} item
 * @returns {string|null}
 */
export function primarySettlementOf(item) {
  const s = item?.subject?.settlementId;
  if (s != null && str(s)) return str(s);
  const first = Array.isArray(item?.affectedIds) ? item.affectedIds.find(Boolean) : null;
  return first != null ? str(first) : null;
}

/**
 * @typedef {Object} HeraldGroup
 * @property {string|null} settlementId   null = the realm-wide group.
 * @property {string} name                the settlement name (or 'Across the realm').
 * @property {HeraldItem[]} items
 */

/**
 * Group items by their primary settlement (presence-over-repetition: the settlement
 * name hoists to the group header, the nested headlines omit it). Within a group,
 * items keep the order they arrive in (the caller has already sorted). Groups are
 * returned settlement-first (a resolvable name), realm-wide last. The ALPHABETICAL
 * ordering + urgent pin is THE SORT LAW (Phase 4); this only clusters.
 *
 * @param {HeraldItem[]} items
 * @param {Map<string,string>} [nameById]
 * @returns {HeraldGroup[]}
 */
export function groupBySettlement(items = [], nameById = new Map()) {
  /** @type {Map<string, HeraldItem[]>} */
  const bySettlement = new Map();
  /** @type {HeraldItem[]} */
  const realmWide = [];
  for (const item of items) {
    const sid = primarySettlementOf(item);
    if (sid == null) { realmWide.push(item); continue; }
    const list = bySettlement.get(sid) || [];
    list.push(item);
    bySettlement.set(sid, list);
  }
  /** @type {HeraldGroup[]} */
  const groups = [];
  for (const [sid, list] of bySettlement) {
    groups.push({ settlementId: sid, name: nameById.get(sid) || sid, items: list });
  }
  if (realmWide.length) groups.push({ settlementId: null, name: 'Across the realm', items: realmWide });
  return groups;
}
