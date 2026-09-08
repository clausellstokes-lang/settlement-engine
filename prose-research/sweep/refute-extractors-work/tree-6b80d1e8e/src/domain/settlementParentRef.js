/**
 * settlementParentRef.js — immutable founding provenance for campaign members.
 *
 * `settlement.parentRef` answers the historical question "which campaign member
 * founded this one?"  It is deliberately NOT the live relationship.  The
 * separately persisted regional lineage edge owns whether that bond still has
 * political force, so an import, sale, or severance must never infer an edge
 * merely because this receipt survived.
 *
 * This leaf owns the two boundary operations that are easy to get subtly wrong:
 * a regeneration carries the prior receipt unchanged, while a multi-settlement
 * import re-addresses `parentId` only when the referenced parent was imported in
 * the same batch.  An absent destination leaves the source id intact as history;
 * it never fabricates a live parent in the destination campaign.
 */

/**
 * Carry an existing immutable parent receipt across a settlement rewrite.
 * A writer introducing the first receipt is left alone; once present, the prior
 * value wins over any accidental regeneration output.
 *
 * @template {Record<string, any>} S
 * @param {S|null|undefined} nextSettlement
 * @param {S|null|undefined} priorSettlement
 * @returns {S|null|undefined}
 */
export function preserveSettlementParentRef(nextSettlement, priorSettlement) {
  if (!nextSettlement || !priorSettlement) return nextSettlement;
  const priorRef = priorSettlement.parentRef;
  if (!priorRef || typeof priorRef !== 'object' || Array.isArray(priorRef)) {
    return nextSettlement;
  }
  if (nextSettlement.parentRef === priorRef) return nextSettlement;
  return /** @type {S} */ ({ ...nextSettlement, parentRef: priorRef });
}

/**
 * Look up one source save id in an object or Map destination table.
 * Own-property lookup is load-bearing because imported ids are untrusted text.
 *
 * @param {Record<string, unknown>|Map<string, unknown>|null|undefined} destinationBySourceId
 * @param {string} sourceId
 * @returns {string|null}
 */
function destinationIdFor(destinationBySourceId, sourceId) {
  let value;
  if (destinationBySourceId instanceof Map) {
    if (!destinationBySourceId.has(sourceId)) return null;
    value = destinationBySourceId.get(sourceId);
  } else if (
    destinationBySourceId
    && typeof destinationBySourceId === 'object'
    && Object.hasOwn(destinationBySourceId, sourceId)
  ) {
    value = destinationBySourceId[sourceId];
  } else {
    return null;
  }
  const id = String(value ?? '').trim();
  return id || null;
}

/**
 * Re-address historical parent provenance after a multi-member import.
 *
 * The whole settlement and parentRef are returned by identity when the source
 * parent did not land.  That is the intentional orphan-history case: retain the
 * source receipt, but leave the destination campaign without a live lineage
 * edge.  Only `parentId` changes when both members landed; every additive receipt
 * field survives untouched.
 *
 * @template {Record<string, any>} S
 * @param {S} settlement
 * @param {Record<string, unknown>|Map<string, unknown>|null|undefined} destinationBySourceId
 * @returns {S}
 */
export function remapSettlementParentRefForImport(settlement, destinationBySourceId) {
  const parentRef = settlement?.parentRef;
  if (!parentRef || typeof parentRef !== 'object' || Array.isArray(parentRef)) {
    return settlement;
  }
  const sourceParentId = String(parentRef.parentId ?? '').trim();
  if (!sourceParentId) return settlement;
  const destinationParentId = destinationIdFor(destinationBySourceId, sourceParentId);
  if (!destinationParentId || destinationParentId === sourceParentId) return settlement;
  return /** @type {S} */ ({
    ...settlement,
    parentRef: { ...parentRef, parentId: destinationParentId },
  });
}
