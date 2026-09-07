/**
 * mapEntityIds.js — display-layer identity helpers for persisted map records.
 *
 * Local records and cloud rows can represent the same identifier as either a
 * number or a string. Normalize only at comparison boundaries: callers still
 * receive the stored identifier, so these helpers do not silently rewrite
 * campaign or settlement state.
 */

/** Compare two present identifiers without coercing either stored value. */
export const sameEntityId = (left, right) => (
  left != null
  && right != null
  && String(left) === String(right)
);

/** Find one entity across the persisted number/string identifier boundary. */
export function findEntityById(items, id) {
  return (items || []).find(item => sameEntityId(item?.id, id)) || null;
}

/**
 * Return the identifier as stored by the matching entity.
 *
 * Unknown, non-empty identifiers pass through so callers can retain a pending
 * selection while its backing collection is still loading.
 */
export function resolveEntityId(items, id) {
  if (id == null || id === '') return null;
  return findEntityById(items, id)?.id ?? id;
}

/**
 * Select the saved settlements named by a campaign without changing save order.
 *
 * An absent campaign means no membership filter is active, so the original
 * saves collection is returned unchanged.
 */
export function campaignMemberSaves(saves, campaign) {
  if (!campaign) return saves || [];
  const ids = new Set((campaign.settlementIds || []).map(String));
  return (saves || []).filter(save => ids.has(String(save.id)));
}
