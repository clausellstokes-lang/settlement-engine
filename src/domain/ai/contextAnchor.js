/**
 * domain/ai/contextAnchor.js — THE CONTEXT ANCHOR (Surveyor Shell,
 * DESIGN_AI_CONTROL_SURFACE §2c point 2).
 *
 * Every Surveyor request carries an anchor: the page scope + the selected entity. The anchor
 * FOLLOWS THE PAGE — dossier ⇒ that settlement · realm/map dashboard ⇒ the realm · chronicle
 * ⇒ the advance in view · map selection ⇒ the picked settlement. It is VISIBLE in the panel
 * ("Reading: <entity> · Week <n>") with a tap-to-change chip (the §3c honesty made tangible),
 * and the state-slicers CONSUME it as the default retrieval scope.
 *
 * PURE, lazy-only (rides the panel chunk) — zero eager bytes. It reads only the already-eager
 * route/store scope values passed in; it opens no network, holds no state.
 */

/** The anchor scopes, matching the pages the Surveyor rides. */
export const ANCHOR_SCOPES = Object.freeze(['settlement', 'realm', 'chronicle', 'map', 'none']);

/** Route views that carry a settlement dossier / realm / chronicle scope. Kept small +
 *  explicit so a new route never silently mis-anchors (a mis-scope shows the wrong "Reading"). */
const SETTLEMENT_VIEWS = new Set(['settlements', 'generate', 'compendium']);
const REALM_VIEWS = new Set(['realm', 'map']);
const CHRONICLE_VIEWS = new Set(['chronicle']);

/** @param {string} id @param {any[]} savedSettlements @param {any} settlement @returns {string} */
function settlementName(id, savedSettlements, settlement) {
  if (settlement && String(settlement.id) === String(id)) return settlement.name || 'this settlement';
  const hit = (Array.isArray(savedSettlements) ? savedSettlements : []).find((/** @type {any} */ s) => String(s?.id) === String(id));
  return (hit && hit.name) || 'this settlement';
}

/**
 * Derive the context anchor from the current page + selection. Pure. The anchor is the SAME
 * shape regardless of scope so the panel + slicers consume it uniformly.
 *
 * @param {{
 *   view?: string, params?: {id?: string},
 *   selectedSettlementId?: string|null,
 *   settlement?: any, savedSettlements?: any[],
 *   activeCampaign?: {name?: string}|null, tick?: number|null,
 * }} [ctx]
 * @returns {{ scope: string, entityId: string|null, label: string, week: number|null,
 *            retrieval: { settlementId: string|null, realm: boolean } }}
 */
export function deriveAnchor({
  view = '', params = {}, selectedSettlementId = null,
  settlement = null, savedSettlements = [], activeCampaign = null, tick = null,
} = {}) {
  const week = Number.isFinite(tick) ? tick : null;
  const weekSuffix = week != null ? ` · Week ${week}` : '';
  const realmName = (activeCampaign && activeCampaign.name) || 'the realm';

  // map SELECTION wins on the map view (the picked settlement is the obvious subject)
  if (REALM_VIEWS.has(view) && selectedSettlementId) {
    const name = settlementName(selectedSettlementId, savedSettlements, settlement);
    return { scope: 'map', entityId: String(selectedSettlementId), label: `Reading: ${name}${weekSuffix}`, week, retrieval: { settlementId: String(selectedSettlementId), realm: false } };
  }
  if (REALM_VIEWS.has(view)) {
    return { scope: 'realm', entityId: null, label: `Reading: ${realmName}${weekSuffix}`, week, retrieval: { settlementId: null, realm: true } };
  }
  if (CHRONICLE_VIEWS.has(view)) {
    return { scope: 'chronicle', entityId: null, label: `Reading: the chronicle${weekSuffix}`, week, retrieval: { settlementId: null, realm: true } };
  }
  // a settlement dossier is in scope: the route param id, else the current generated settlement
  const settlementId = (params && params.id) ? String(params.id) : (settlement && settlement.id ? String(settlement.id) : null);
  if (SETTLEMENT_VIEWS.has(view) && settlementId) {
    const name = settlementName(settlementId, savedSettlements, settlement);
    return { scope: 'settlement', entityId: settlementId, label: `Reading: ${name}${weekSuffix}`, week, retrieval: { settlementId, realm: false } };
  }
  // nothing specific in view — the whole world (the honest default)
  return { scope: 'none', entityId: null, label: `Reading: your world${weekSuffix}`, week, retrieval: { settlementId: null, realm: false } };
}

/**
 * Resolve the anchor's retrieval scope into the settlement object the slicers should default
 * to (so the analyst reads what the DM is looking at). Pure. Returns the in-scope settlement
 * object (from the current settlement or the saved list) or null for a realm/none anchor.
 *
 * @param {ReturnType<typeof deriveAnchor>} anchor
 * @param {{ settlement?: any, savedSettlements?: any[] }} [data]
 * @returns {any}
 */
export function anchorSettlement(anchor, { settlement = null, savedSettlements = [] } = {}) {
  const id = anchor && anchor.retrieval && anchor.retrieval.settlementId;
  if (!id) return null;
  if (settlement && String(settlement.id) === String(id)) return settlement;
  return (Array.isArray(savedSettlements) ? savedSettlements : []).find((/** @type {any} */ s) => String(s?.id) === String(id)) || null;
}
