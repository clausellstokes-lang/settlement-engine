/**
 * domain/provenance.js — Generated-vs-authored transparency summary.
 *
 * Tier 5.6 of the roadmap. Reads the canon-tag breakdown from
 * Phase 33 plus the settlement's aiOverlays state, and produces the
 * structured payload the transparency UI consumes:
 *
 *   deriveProvenanceSummary(settlement) -> {
 *     procedurallyGenerated,     count of generated entities
 *     userAuthored,              count of user-added entities
 *     eventApplied,              count from applied events
 *     aiPolished,                count of ai_overlay entries
 *     hasAiPolish,               boolean — has any AI overlay been applied?
 *     hasUserCanon,              boolean — has the user added or locked anything?
 *     hasAppliedEvents,          boolean
 *     summary,                   user-facing prose lines
 *     trustSignals               [{key, label}] for badge rendering
 *   }
 *
 * Pure read-only.
 */

import { canonBreakdown } from './canonStatus.js';

const TRUST_KEYS = Object.freeze({
  procedural:    { label: 'Built from procedural simulation.' },
  ai_off:        { label: 'AI not used on this dossier.' },
  ai_polished:   { label: 'AI used for narrative polish — facts unchanged.' },
  user_canon:    { label: 'User canon preserved across rerolls.' },
  event_history: { label: 'Event history applied to current state.' },
});

/**
 * Build the structured provenance summary.
 *
 * @param {Object} settlement
 * @returns {Object}
 */
export function deriveProvenanceSummary(settlement) {
  if (!settlement) {
    return {
      procedurallyGenerated: 0,
      userAuthored: 0,
      eventApplied: 0,
      aiPolished: 0,
      hasAiPolish: false,
      hasUserCanon: false,
      hasAppliedEvents: false,
      summary: [],
      trustSignals: [],
    };
  }

  const breakdown = canonBreakdown(settlement);
  const procedurallyGenerated = breakdown.bySource.generated || 0;
  const userAuthored          = breakdown.bySource.user || 0;
  const eventApplied          = breakdown.bySource.event || 0;
  const aiPolished            = breakdown.bySource.ai_overlay || 0;

  // AI overlays array is a Phase 1 canonical container; treat any
  // non-empty array as "AI has been applied."
  const aiOverlays = Array.isArray(settlement.aiOverlays) ? settlement.aiOverlays : [];
  const hasAiPolish = aiPolished > 0 || aiOverlays.length > 0;

  const hasUserCanon = userAuthored > 0 || breakdown.locked > 0;
  const hasAppliedEvents = eventApplied > 0
    || (Array.isArray(settlement.eventLog) && settlement.eventLog.length > 0);

  // User-facing prose. The opening line is the strongest trust signal
  // for the anti-AI audience.
  const summary = [];
  summary.push('Built from procedural simulation.');
  if (!hasAiPolish) {
    summary.push('AI not used unless you choose Narrative Overlay.');
  } else {
    summary.push('AI used for narrative polish — simulated facts unchanged.');
  }
  if (hasUserCanon) {
    summary.push('Your canon (locked or user-added) is preserved across rerolls.');
  }
  if (hasAppliedEvents) {
    summary.push('Applied events are part of the current state.');
  }
  summary.push('Simulation facts separate from prose polish.');

  // Trust signal chips (UI can render these as badges).
  const trustSignals = [];
  trustSignals.push({ key: 'procedural', label: TRUST_KEYS.procedural.label });
  trustSignals.push(hasAiPolish
    ? { key: 'ai_polished', label: TRUST_KEYS.ai_polished.label }
    : { key: 'ai_off',      label: TRUST_KEYS.ai_off.label });
  if (hasUserCanon) trustSignals.push({ key: 'user_canon', label: TRUST_KEYS.user_canon.label });
  if (hasAppliedEvents) trustSignals.push({ key: 'event_history', label: TRUST_KEYS.event_history.label });

  return {
    procedurallyGenerated,
    userAuthored,
    eventApplied,
    aiPolished,
    hasAiPolish,
    hasUserCanon,
    hasAppliedEvents,
    summary,
    trustSignals,
  };
}

/** Catalog accessor. */
export function provenanceTrustKeys() {
  return Object.keys(TRUST_KEYS);
}
