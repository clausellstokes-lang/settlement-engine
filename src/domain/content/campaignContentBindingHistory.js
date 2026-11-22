/**
 * Eager-safe admission for bounded campaign content-binding history.
 *
 * History is recovery data, not simulation input. It is nevertheless admitted
 * at the campaign persistence wall so malformed snapshots never enter state.
 * Review planning and apply orchestration remain in the lazy lifecycle module.
 */

import {
  admitCampaignContentBinding,
} from './campaignContentBinding.js';
import {
  canonicalContentJson,
} from './contentFingerprint.js';

export const MAX_CAMPAIGN_CONTENT_BINDING_REVISIONS = 64;
export const MAX_CAMPAIGN_CONTENT_HISTORY_BYTES = 2 * 1024 * 1024;

/**
 * @typedef {Readonly<{
 *   definitionId:string,
 *   revisionId:string,
 *   contentHash:string,
 *   category:string,
 * }>} ResolvedDefinition
 * @typedef {Readonly<{
 *   schemaVersion:number,
 *   source:string,
 *   environment:unknown,
 *   resolvedDefinitions:ReadonlyArray<ResolvedDefinition>,
 *   bindingHash:string,
 * }>} CampaignBinding
 * @typedef {{ok:true, history:ReadonlyArray<CampaignBinding>,
 *   reason?:undefined, message?:undefined} |
 *   {ok:false, reason:string, message?:string,
 *   history?:undefined}} BindingHistoryAdmission
 */

/** @param {unknown} value */
function utf8ByteLength(value) {
  const text = String(value);
  if (typeof TextEncoder !== 'undefined') {
    return new TextEncoder().encode(text).byteLength;
  }
  return unescape(encodeURIComponent(text)).length;
}

/**
 * Admit one binding or throw with field-specific context for lifecycle plans.
 *
 * @param {unknown} value
 * @param {string} field
 * @returns {CampaignBinding}
 */
export function requireCampaignContentBinding(value, field) {
  const admitted = admitCampaignContentBinding(value);
  if (!admitted.ok) {
    throw new TypeError(
      `${field} is invalid: ${admitted.message || admitted.reason}.`,
    );
  }
  return /** @type {CampaignBinding} */ (admitted.binding);
}

/**
 * Strictly admit the immutable binding snapshots stored beside a campaign.
 *
 * @param {unknown} value
 * @returns {BindingHistoryAdmission}
 */
export function admitCampaignContentBindingHistory(value) {
  try {
    if (!Array.isArray(value)) {
      return { ok: false, reason: 'campaign_content_history_not_array' };
    }
    if (value.length > MAX_CAMPAIGN_CONTENT_BINDING_REVISIONS) {
      return { ok: false, reason: 'campaign_content_history_limit_exceeded' };
    }
    const canonicalInput = canonicalContentJson(value);
    if (
      utf8ByteLength(canonicalInput)
      > MAX_CAMPAIGN_CONTENT_HISTORY_BYTES
    ) {
      return { ok: false, reason: 'campaign_content_history_bytes_exceeded' };
    }
    /** @type {Set<string>} */
    const seen = new Set();
    /** @type {CampaignBinding[]} */
    const history = value.map((entry, index) => {
      const binding = requireCampaignContentBinding(
        entry,
        `contentBindingHistory[${index}]`,
      );
      if (seen.has(binding.bindingHash)) {
        throw new TypeError(
          `contentBindingHistory contains duplicate binding "${binding.bindingHash}".`,
        );
      }
      seen.add(binding.bindingHash);
      return binding;
    });
    if (canonicalInput !== canonicalContentJson(history)) {
      return { ok: false, reason: 'campaign_content_history_shape_mismatch' };
    }
    return {
      ok: true,
      history: Object.freeze(history),
    };
  } catch (error) {
    return {
      ok: false,
      reason: 'campaign_content_history_invalid',
      message: error instanceof Error
        ? error.message
        : 'Campaign content history is invalid.',
    };
  }
}
