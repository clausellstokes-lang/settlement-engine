/**
 * PDF projection for reviewed custom supply chains.
 *
 * Keep activation wording on the shared player-safe presentation seam while
 * shaping only the compact fields the Economics chapter renders.
 */

import {
  customSupplyChainPresentation,
} from '../../domain/content/customSupplyChainPresentation.js';

/** @param {Record<string, any>} chain */
export function customSupplyChainViewModel(chain) {
  const presentation = customSupplyChainPresentation(chain);
  return {
    name: chain?.label || chain?.name || chain?.chainId || 'Custom chain',
    resource: chain?.resource || null,
    processingInstitutions: chain?.processingInstitutions || [],
    outputs: chain?.outputs || [],
    activationState: presentation.state,
    activationLabel: presentation.label,
    activationSummary: presentation.summary,
    activationReasons: presentation.reasons,
    tradePromoted: chain?.tradeEndpoints?.promoted === true,
  };
}
