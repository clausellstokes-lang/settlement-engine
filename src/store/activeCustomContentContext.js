/**
 * Resolve the custom-content projection allowed to act on the current world.
 *
 * The editable account library is not a campaign's ruleset. Once a campaign
 * exists, its portable `contentBinding` is the only definition source for
 * generation, advancement, and direct canon edits such as deity assignment.
 * Standalone editors retain their historical account-library behavior.
 */

import {
  contentRuntimeFromCampaignBinding,
} from '../domain/content/contentEnvironment.js';

const EMPTY_CAMPAIGN_CONTENT = contentRuntimeFromCampaignBinding(null).customContent;
const bindingContentCache = new WeakMap();

/**
 * @param {object | null | undefined} state
 * @returns {object | null}
 */
export function activeCampaignForCustomContent(state) {
  const activeId = state?.activeCampaignId;
  if (activeId == null) return null;
  return (Array.isArray(state?.campaigns) ? state.campaigns : []).find(
    campaign => String(campaign?.id) === String(activeId),
  ) || null;
}

/**
 * Stable Zustand selector for the definition library permitted in the active
 * execution context. Invalid or absent campaign bindings fail closed to the
 * canonical empty campaign projection; they never fall back to moving account
 * heads.
 *
 * @param {object | null | undefined} state
 * @returns {Record<string, Array<object>>}
 */
export function customContentForActiveContext(state) {
  const campaign = activeCampaignForCustomContent(state);
  if (!campaign) {
    return state?.customContent && typeof state.customContent === 'object'
      ? state.customContent
      : {};
  }

  const binding = campaign.contentBinding;
  if (!binding || typeof binding !== 'object') return EMPTY_CAMPAIGN_CONTENT;
  const cached = bindingContentCache.get(binding);
  if (cached) return cached;

  const content = contentRuntimeFromCampaignBinding(binding).customContent;
  bindingContentCache.set(binding, content);
  return content;
}
