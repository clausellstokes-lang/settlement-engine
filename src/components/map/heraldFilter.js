// heraldFilter.js — THE HERALD FILTER / FOCUS / SORT logic (pure).
//
// The scaling layer over the section-filed feed (heraldFeed): FOCUS (the local
// edition — scope every door to one settlement), structured SEARCH (over resolved
// names + the recorded headline + the typed kind label, never a blind prose grep of
// deep fields), a NEEDS-ATTENTION triage lens, and a severity FACET. Composable —
// focus ∩ query ∩ attention ∩ facet all narrow together. Plus the SORT LAW helpers.
//
// PURE. No store, no React. The FOCUS id itself is the store-global
// mapSlice.selectedSettlementId, read by the shell and passed in — never duplicated.

import { primarySettlementOf } from './heraldGrammar.js';

/**
 * @typedef {import('./heraldFeed.js').HeraldItem} HeraldItem
 * @typedef {import('../../domain/realm/heraldRouting.js').HeraldSection} HeraldSection
 */

/** The severity band of an item (mirrors the WorldPulse >=0.72 critical threshold). */
export function severityBand(item) {
  const s = item?.severity ?? 0;
  if (s >= 0.72) return 'critical';
  if (s >= 0.4) return 'strained';
  return 'routine';
}

/** The urgent threshold — a true cross-realm crisis floats above the alphabet. */
export const URGENT_SEVERITY = 0.85;

/**
 * The needs-attention triage predicate (the DM's "what needs me now"): a major beat,
 * a critical severity, a pending/amendable decision, or a covert turn. Mirrors the
 * LibraryToolbar needsAttention idiom over the fields a HeraldItem carries.
 * @param {HeraldItem} item
 * @returns {boolean}
 */
export function needsAttention(item) {
  return !!item && (
    item.major
    || (item.severity ?? 0) >= 0.72
    || item.provenance === 'amendable'
    || item.provenance === 'covert'
    || item.section === 'adjudication'
  );
}

/** Whether an item belongs to the focused settlement (primary OR a membership touch). */
export function matchesFocus(item, focusId) {
  if (focusId == null) return true;
  const fid = String(focusId);
  if (primarySettlementOf(item) === fid) return true;
  return Array.isArray(item?.affectedIds) && item.affectedIds.map(String).includes(fid);
}

/**
 * Structured query match: over the recorded headline, the typed kind label, and the
 * RESOLVED settlement names (primary + affected), never arbitrary deep record fields.
 * @param {HeraldItem} item @param {string} query @param {Map<string,string>} nameById
 */
export function matchesQuery(item, query, nameById = new Map()) {
  const q = String(query || '').trim().toLowerCase();
  if (!q) return true;
  const hay = [];
  if (item.headline) hay.push(String(item.headline).toLowerCase());
  if (item.kind) hay.push(String(item.kind).replace(/_/g, ' ').toLowerCase());
  const ids = new Set([primarySettlementOf(item), ...(item.affectedIds || [])].filter(Boolean).map(String));
  for (const id of ids) {
    const nm = nameById.get(id);
    if (nm) hay.push(String(nm).toLowerCase());
  }
  return hay.some(h => h.includes(q));
}

/**
 * Filter a whole section-filed feed, returning the narrowed bySection + its counts.
 * @param {{ bySection: Record<HeraldSection, HeraldItem[]> }} feed
 * @param {{ focusId?: string|number|null, query?: string, attention?: boolean, band?: string|null, nameById?: Map<string,string> }} [opts]
 * @returns {{ bySection: Record<HeraldSection, HeraldItem[]>, counts: Record<HeraldSection, number> }}
 */
export function filterFeed(feed, opts = {}) {
  const { focusId = null, query = '', attention = false, band = null, nameById = new Map() } = opts;
  /** @type {Record<string, HeraldItem[]>} */
  const bySection = {};
  /** @type {Record<string, number>} */
  const counts = {};
  const sections = feed && feed.bySection ? Object.keys(feed.bySection) : [];
  for (const section of sections) {
    const kept = (feed.bySection[section] || []).filter(item =>
      matchesFocus(item, focusId)
      && matchesQuery(item, query, nameById)
      && (!attention || needsAttention(item))
      && (!band || severityBand(item) === band));
    bySection[section] = kept;
    counts[section] = kept.length;
  }
  return { bySection: /** @type {any} */ (bySection), counts: /** @type {any} */ (counts) };
}

/**
 * THE SORT LAW — partition an already-ordered section list into the URGENT PIN (true
 * cross-realm crises, floated above the alphabet) and the rest (to be grouped
 * alphabetically by settlement downstream).
 * @param {HeraldItem[]} items
 * @returns {{ urgent: HeraldItem[], rest: HeraldItem[] }}
 */
export function partitionUrgent(items = []) {
  const urgent = [];
  const rest = [];
  for (const item of items) {
    if ((item.severity ?? 0) >= URGENT_SEVERITY) urgent.push(item);
    else rest.push(item);
  }
  return { urgent, rest };
}

/** Alphabetical-by-name group order (the realm-wide group always last). Codepoint,
 *  never localeCompare. @param {import('./heraldGrammar.js').HeraldGroup[]} groups */
export function sortGroupsAlphabetical(groups = []) {
  return [...groups].sort((a, b) => {
    if (a.settlementId == null) return 1;
    if (b.settlementId == null) return -1;
    const an = String(a.name).toLowerCase();
    const bn = String(b.name).toLowerCase();
    return an < bn ? -1 : an > bn ? 1 : 0;
  });
}

/** The K most-severe needs-attention items across a whole feed, for the Dashboard
 *  banner + the strip. Severity-desc, then recency, then id.
 *  @param {{ bySection: Record<string, HeraldItem[]> }} feed @param {number} [k] */
export function needsAttentionDigest(feed, k = 4) {
  const all = [];
  for (const section of Object.keys(feed?.bySection || {})) {
    for (const item of feed.bySection[section]) if (needsAttention(item)) all.push(item);
  }
  all.sort((a, b) => {
    if ((b.severity ?? 0) !== (a.severity ?? 0)) return (b.severity ?? 0) - (a.severity ?? 0);
    const ta = a.tick == null ? -1 : a.tick, tb = b.tick == null ? -1 : b.tick;
    if (tb !== ta) return tb - ta;
    return a.id < b.id ? -1 : a.id > b.id ? 1 : 0;
  });
  return all.slice(0, k);
}
