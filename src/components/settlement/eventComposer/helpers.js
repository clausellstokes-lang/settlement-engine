/**
 * eventComposer/helpers.js — pure helpers extracted from EventComposer.jsx
 * (behavior-preserving decomposition). buildTargetOptions normalizes a
 * dossier collection into {id, name} dropdown options; labelOfTarget turns a
 * dotted target id into a human label.
 */

import { swatch } from '../../theme.js';

// Party-attribution accent — a heraldic crimson, distinct from the gold brand
// accent and the purple AI-narrative tint, so "the party did this" reads clearly.
// Shared by EventComposer (the "Caused by the party" toggle) and PreviewPanel
// (the "Party-caused" badge), so the hex is declared in one place.
export const PARTY = swatch['#8A2F4A'];
export const PARTY_BG = swatch['#F7EBF0'];

// buildTargetOptions moved to the AFFORDANCE MANIFEST (domain-pure; Composer
// V2 §2) — re-exported so the field modules keep their import path.
export { buildTargetOptions } from '../../../domain/events/affordanceManifest.js';

/**
 * {id, name} options for OPENED_TRADE_ROUTE's optional campaign-settlement
 * target: every OTHER active-campaign member of the active save. Resolved from
 * the raw campaigns array keyed by activeSaveId (the PendingIntentions pattern),
 * so a trade route can open with any campaign peer, not only a linked neighbour.
 */
export function campaignPeerOptions(campaigns, savedSettlements, activeSaveId) {
  if (activeSaveId == null) return [];
  const sid = String(activeSaveId);
  const c = (campaigns || []).find(x =>
    (x?.accessState || 'active') === 'active'
    && (x.settlementIds || []).map(String).includes(sid));
  if (!c) return [];
  const others = new Set((c.settlementIds || []).map(String).filter(id => id !== sid));
  return (savedSettlements || [])
    .filter(save => others.has(String(save.id)))
    .map(save => ({ id: String(save.id), name: String(save.settlement?.name || save.name || save.id) }))
    .filter(o => o.id && o.name);
}

export function labelOfTarget(targetId) {
  const tail = String(targetId || '').split('.').pop();
  return tail.replace(/_/g, ' ');
}
