/**
 * domain/coherence/checkDraftEdit.js — Draft-mode policy wrapper around
 * the existing structuralValidator.
 *
 * The validator already produces violations/suggestions. Draft mode
 * surfaces them as actionable warnings — "you added a port to an
 * inland village; suggested fixes: add river access, change terrain,
 * downgrade to caravanserai." Canon mode silences them: the DM said
 * the temple burned, we don't second-guess them.
 *
 * Pure function, no store, no React.
 */

import { checkStructuralValidity } from '../../generators/structuralValidator.js';

/** @typedef {import('../types.js').CoherenceWarning} CoherenceWarning */

/**
 * @param {Object} settlement
 * @returns {CoherenceWarning[]}
 */
export function checkDraftEdit(settlement) {
  // Short-circuit on truly empty input. The validator has tier defaults
  // ('town' + 'frontier') that would otherwise fire a survival-crisis
  // warning against a settlement that doesn't exist yet — useless noise
  // for the UI which only cares about real settlements.
  if (settlement == null) return [];
  const s = settlement;
  const institutions = s.institutions || [];
  const config = s.config || {};
  /** @type {CoherenceWarning[]} */
  const out = [];

  let result;
  try {
    result = checkStructuralValidity(institutions, config);
  } catch (e) {
    return [{ severity: 'warning', message: `Validator error: ${e?.message || e}` }];
  }

  for (const v of result?.violations || []) {
    out.push({
      severity: severityFromValidator(v.severity, v.type),
      message:  formatViolation(v),
      suggestedFixes: suggestFixesForViolation(v),
    });
  }

  for (const s of result?.suggestions || []) {
    out.push({
      severity: 'suggestion',
      message:  formatSuggestion(s),
      suggestedFixes: Array.isArray(s.suggested) ? s.suggested : undefined,
    });
  }

  return out;
}

function severityFromValidator(s, type) {
  if (s === 'critical' || s === 'error') return 'mismatch';
  if (type === 'survival_crisis')        return 'mismatch';
  return 'warning';
}

function formatViolation(v) {
  if (v.reason) return v.reason;
  if (v.type === 'tier_violation') return `${v.institution || 'Institution'} doesn't fit this tier.`;
  if (v.type === 'dependency_violation') return `${v.institution} needs ${(v.missing || []).join(' or ')}.`;
  return `${v.type}: ${v.institution || ''}`.trim();
}

function formatSuggestion(s) {
  if (s.reason) return s.reason;
  if (s.suggested?.length) return `Consider adding ${s.suggested.join(' or ')}.`;
  return s.type;
}

/**
 * Tag a violation with possible fixes the user can apply directly. Kept
 * shallow — the structuralValidator's `suggested` field already has
 * most useful hints; we just promote them. A future version can produce
 * "click to add this institution" affordances against the catalog.
 */
function suggestFixesForViolation(v) {
  if (Array.isArray(v.suggested) && v.suggested.length) return v.suggested;
  if (Array.isArray(v.missing) && v.missing.length) return v.missing.map(m => `Add ${m}`);
  if (v.type === 'tier_violation') return ['Increase settlement tier', 'Remove this institution'];
  return undefined;
}
