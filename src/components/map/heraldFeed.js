// heraldFeed.js — THE HERALD FEED SELECTOR (THE REALM INSPECTOR = NEWSPAPER,
// owner doctrine 2026-07-22).
//
// Turns a campaign's recorded pulse + wizard-news records into ONE normalized,
// section-filed feed of HeraldItems the six news doors render. The filing is the
// routing table (domain/realm/heraldRouting.js) — never a prose scan. This is a
// PURE display selector: no store, no React, no Date/rng. It reads the already-
// recorded shape and files it; it never mints, tunes, or reorders the engine's data.
//
// TWO TIME LENSES (history is a lens, not a door):
//   - 'advance'  — THIS advance: the LATEST pulse's outcomes + impact digest.
//   - 'campaign' — the WHOLE campaign: every recorded pulse's outcomes + digest,
//                  filed the same way. The live stressors + forecast are lens-
//                  independent (they are the realm's present state, not history).
//
// The SUBJECT descriptor + affected ids reuse the canonical WorldPulseData helpers
// (outcomeSubjectDescriptor / collectSettlementIds), so a HeraldItem carries exactly
// what the AddressChain resolver needs — ids, never names.

import { heraldSectionOfRecord, HERALD_SECTIONS } from '../../domain/realm/heraldRouting.js';
import {
  ACTIVE_UI_STAGES,
  collectSettlementIds,
  outcomeSubjectDescriptor,
} from './WorldPulseData.js';

/**
 * @typedef {'war'|'faith'|'trade'|'events'|'divination'|'adjudication'} HeraldSection
 * @typedef {Object} HeraldItem
 * @property {string} id
 * @property {HeraldSection} section
 * @property {string} headline
 * @property {string} summary
 * @property {number} severity        0..1
 * @property {boolean} major          significance/severity high
 * @property {number|null} tick
 * @property {string[]} reasons
 * @property {{ npcId: string|null, factionId: string|null, factionName: string|null, settlementId: string|number|null }} subject
 * @property {string[]} affectedIds
 * @property {string} kind            the routing token (impactKind/candidateType/type)
 * @property {string|null} rootId     the receipt id the ARTICLE (cause walk) opens on
 * @property {'canon'|'amendable'|'covert'|'decreed'} provenance
 * @property {Record<string, unknown>} record   the source record (for the article + actions)
 */

/** @param {unknown} v @returns {number} */
function num(v) { return typeof v === 'number' && Number.isFinite(v) ? v : 0; }

const FALLBACK_HEADLINE_BY_SECTION = Object.freeze({
  war: 'A military report from the realm',
  faith: 'A matter of faith in the realm',
  trade: 'A change in the realm’s trade',
  events: 'A matter of the realm',
  divination: 'A possible turn ahead',
  adjudication: 'A decision awaits review',
});

/** A section-level truth, never a prettified implementation identifier. */
function fallbackHeadline(section) {
  return FALLBACK_HEADLINE_BY_SECTION[section] || FALLBACK_HEADLINE_BY_SECTION.events;
}

/** An authored display label when the source actually carries one. */
function labelOf(record) {
  const label = record?.label;
  return typeof label === 'string' && label.trim() ? label.trim() : null;
}

/** The provenance chip a record carries (non-canonical only shows). */
function provenanceOf(record) {
  const o = record?.outcome || record || {};
  if (o.applyMode === 'proposal' || record?.status === 'pending') return 'amendable';
  if (o.covert || record?.covert || o.visibility === 'covert') return 'covert';
  if (o.decreed || record?.decreed || o.source === 'dm') return 'decreed';
  return 'canon';
}

/** The receipt id an article opens on: the record's own recorded id. */
function rootIdOf(record) {
  const o = record?.outcome || record || {};
  return record?.id != null ? String(record.id) : (o.id != null ? String(o.id) : null);
}

/**
 * Normalize one recorded record into a HeraldItem filed under its section. `forced`
 * lets a caller pin the section (a pending proposal → adjudication) without re-deriving.
 * @param {Record<string, unknown>} record
 * @param {HeraldSection} [forced]
 * @returns {HeraldItem}
 */
export function toHeraldItem(record, forced) {
  const o = /** @type {Record<string, unknown>} */ (record.outcome && typeof record.outcome === 'object' ? record.outcome : record);
  const section = forced || heraldSectionOfRecord(record);
  const severity = num(record.severity ?? o.severity ?? (o.score != null ? Math.min(1, num(o.score) / 100) : 0));
  const major = record.significance === 'major' || o.significance === 'major' || severity >= 0.72;
  const kind = String(o.impactKind || o.candidateType || record.impactKind || record.candidateType
    || (o.stressor && o.stressor.type) || record.type || o.type || '');
  const authoredHeadline = record.headline || o.headline || labelOf(record) || labelOf(o);
  return {
    id: String(record.id ?? o.id ?? `${section}-${kind}-${record.tick ?? ''}`),
    section,
    headline: String(authoredHeadline || fallbackHeadline(section)),
    summary: String(record.summary || o.summary || ''),
    severity,
    major,
    tick: record.tick != null ? num(record.tick) : (o.tick != null ? num(o.tick) : null),
    reasons: Array.isArray(record.reasons) ? record.reasons : (Array.isArray(o.reasons) ? o.reasons : []),
    subject: outcomeSubjectDescriptor(record),
    affectedIds: collectSettlementIds(record),
    kind,
    rootId: rootIdOf(record),
    provenance: /** @type {HeraldItem['provenance']} */ (provenanceOf(record)),
    record,
  };
}

/** An empty section→items map (single no-narrowing source of truth). */
function emptyBySection() {
  /** @type {Record<HeraldSection, HeraldItem[]>} */
  const out = /** @type {any} */ ({});
  for (const s of HERALD_SECTIONS) out[s] = [];
  return out;
}

/**
 * Build the section-filed feed for a campaign under a time lens.
 * @param {any} campaign
 * @param {{ lens?: 'advance'|'campaign' }} [opts]
 * @returns {{ bySection: Record<HeraldSection, HeraldItem[]>, counts: Record<HeraldSection, number> }}
 */
export function buildHeraldFeed(campaign, opts = {}) {
  const lens = opts.lens === 'campaign' ? 'campaign' : 'advance';
  const worldState = campaign?.worldState || {};
  const bySection = emptyBySection();
  const seen = new Set();

  const file = (item) => {
    if (!item || seen.has(item.id)) return;
    seen.add(item.id);
    (bySection[item.section] || bySection.events).push(item);
  };

  // The recorded pulses: the whole campaign under the campaign lens, only the
  // latest under the advance lens.
  const history = Array.isArray(worldState.pulseHistory) ? worldState.pulseHistory : [];
  const pulses = lens === 'campaign' ? history : history.slice(-1);
  for (const pulse of pulses) {
    for (const outcome of (pulse?.selectedOutcomes || [])) file(toHeraldItem(outcome));
    for (const entry of (pulse?.impactDigest || [])) file(toHeraldItem(entry));
    for (const stressor of (pulse?.resolvedStressors || [])) {
      const label = labelOf(stressor);
      file(toHeraldItem({
        ...stressor,
        headline: label ? `${label} has lifted` : 'A recorded pressure has lifted',
      }));
    }
  }

  // Lens-independent operational substrate — the live stressors. Active
  // (non-emerging) file by content; emerging file to divination (the forecast);
  // residual echoes file by content as "in living memory".
  for (const stressor of (worldState.stressors || [])) {
    const stage = stressor.lifecycleStage || 'active';
    if (stressor.status === 'residual') {
      const label = labelOf(stressor);
      file(toHeraldItem({
        id: `echo-${stressor.id}`,
        ...stressor,
        stressor,
        headline: label
          ? `${label}, in living memory`
          : 'A past pressure remains in living memory',
      }));
    } else if (ACTIVE_UI_STAGES.has(stage)) {
      file(toHeraldItem({
        ...stressor,
        stressor,
        headline: labelOf(stressor) || 'A strain on the realm',
      }));
    }
  }

  /** @type {Record<HeraldSection, number>} */
  const counts = /** @type {any} */ ({});
  for (const s of HERALD_SECTIONS) counts[s] = bySection[s].length;
  return { bySection, counts };
}
