/**
 * Player-safe presentation for custom-chain activation evidence.
 *
 * The runtime record keeps compact machine reasons. UI and export surfaces use
 * this leaf so they never expose internal ids or invent a "running" claim for
 * legacy saves that predate activation evidence.
 */

/** @typedef {'active'|'blocked'|'ineligible'|'unverified'} CustomChainPresentationState */
/**
 * @typedef {Object} CustomChainPresentationReason
 * @property {string} [code]
 * @property {string} [component]
 * @property {unknown} [tierMin]
 * @property {unknown} [tierMax]
 * @property {string} [requiredKind]
 */
/**
 * @typedef {Object} CustomChainPresentationSource
 * @property {{state?: string, reasons?: CustomChainPresentationReason[]}} [activation]
 * @property {string} [status]
 */

export const CUSTOM_CHAIN_STATE_PRESENTATION = Object.freeze({
  active: Object.freeze({
    label: 'Active',
    summary: 'Every reviewed component materialized; trade endpoints are live.',
    color: '#1a5a28',
    background: '#f0faf2',
    border: '#a8d8b0',
  }),
  blocked: Object.freeze({
    label: 'Blocked',
    summary: 'This settlement is eligible, but one or more components are unavailable.',
    color: '#8a5010',
    background: '#fdf8ec',
    border: '#e0c070',
  }),
  ineligible: Object.freeze({
    label: 'Ineligible',
    summary: 'One or more reviewed components fall outside this settlement tier.',
    color: '#6b5340',
    background: '#f8f5f0',
    border: '#c8b898',
  }),
  unverified: Object.freeze({
    label: 'Needs reevaluation',
    summary: 'This saved chain predates runtime activation evidence. Regenerate to evaluate it.',
    color: '#6b5340',
    background: '#f8f5f0',
    border: '#c8b898',
  }),
});

/** @param {unknown} value */
function title(value) {
  const text = String(value || '');
  return text ? text.charAt(0).toUpperCase() + text.slice(1) : '';
}

/**
 * @param {CustomChainPresentationSource|null|undefined} chain
 * @returns {CustomChainPresentationState}
 */
export function customSupplyChainStateOf(chain) {
  const state = chain?.activation?.state;
  if (state === 'active' || state === 'blocked' || state === 'ineligible') {
    return state;
  }
  if (chain?.status === 'blocked' || chain?.status === 'ineligible') {
    return chain.status;
  }
  return 'unverified';
}

/** @param {CustomChainPresentationReason|null|undefined} reason */
export function customSupplyChainReasonText(reason) {
  const component = String(reason?.component || 'A required component');
  switch (reason?.code) {
    case 'outside_tier': {
      const min = reason.tierMin ? title(reason.tierMin) : '';
      const max = reason.tierMax ? title(reason.tierMax) : '';
      if (min && max) return `${component} is eligible from ${min} through ${max}.`;
      if (min) return `${component} requires a ${min}-or-larger settlement.`;
      if (max) return `${component} is limited to ${max}-or-smaller settlements.`;
      return `${component} is outside this settlement tier.`;
    }
    case 'not_materialized':
      return `${component} did not materialize in this generation.`;
    case 'materialization_ambiguous':
      return `${component} is present by name, but this settlement cannot prove it is the reviewed definition.`;
    case 'resource_depleted':
      return `${component} is present but depleted.`;
    case 'definition_unavailable':
      return `${component}'s reviewed definition is unavailable in this content environment.`;
    case 'dependency_unavailable':
      return `A required ${String(reason.requiredKind || 'component')} for ${component} is unavailable in this content environment.`;
    case 'review_evidence_missing':
      return `${component} predates exact revision review evidence. Review the chain again before it can trade.`;
    case 'reviewed_projection_changed':
      return 'The reviewed path changed after confirmation. Review the current projection again before it can trade.';
    case 'reviewed_revision_changed':
      return `${component} changed after this chain was reviewed. Review the current projection again before it can trade.`;
    case 'unreviewable_projection':
      return 'This legacy chain has no reviewable dependency snapshot. Review it again, then regenerate.';
    default:
      return `${component} is not currently available.`;
  }
}

/** @param {CustomChainPresentationSource|null|undefined} chain */
export function customSupplyChainPresentation(chain) {
  const state = customSupplyChainStateOf(chain);
  const style = CUSTOM_CHAIN_STATE_PRESENTATION[state];
  const reasons = (chain?.activation?.reasons || [])
    .map(customSupplyChainReasonText)
    .filter(Boolean);
  return { state, ...style, reasons };
}
