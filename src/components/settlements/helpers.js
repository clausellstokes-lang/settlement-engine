// ── Save migration ─────────────────────────────────────────────────────────
export function migrateConfig(config) {
  if (!config) return {};
  const c = { ...config };
  if (c.magicExists === undefined) c.magicExists = (c.priorityMagic ?? 50) > 0;
  if (!c.nearbyResourcesState) c.nearbyResourcesState = {};
  return c;
}

// buildInterSettlementNPCs (shared with the canonical save flow) is imported
// from domain/relationships/neighbourBackLink.js. The manual-link and
// remove-neighbour handlers below still build links by hand, so they keep this
// small lookup.
export function findSaveById(saves, id) { return saves.find(s => s.id === id) || null; }

// ── Analytics banding (coarse, privacy-safe) ─────────────────────────────────
// Counts → buckets so library/revisit events never carry raw cardinality.
export function saveCountBand(n) {
  const c = Number(n) || 0;
  if (c === 0) return 'zero';
  if (c <= 2) return '1_2';
  if (c <= 5) return '3_5';
  if (c <= 10) return '6_10';
  return 'gt_10';
}
// Day-gap band vocabulary (taxonomy §Banding): same_day · 1_3d · 4_7d · 8_30d · gt_30d.
export function dayGapBand(fromMs) {
  const n = Number(fromMs);
  if (!Number.isFinite(n) || n <= 0) return 'unknown';
  const days = (Date.now() - n) / (24 * 60 * 60 * 1000);
  if (days < 0) return 'unknown';
  if (days <= 1) return 'same_day';
  if (days <= 3) return '1_3d';
  if (days <= 7) return '4_7d';
  if (days <= 30) return '8_30d';
  return 'gt_30d';
}
// Canon phase enum off a save's campaignState (defaults to 'draft' for legacy saves).
export function canonPhaseOf(save) {
  const p = save?.campaignState?.phase;
  return typeof p === 'string' ? p : 'draft';
}
// Best available "last edited" epoch ms for a save (campaignState.editedAt → savedAt).
export function lastEditedMs(save) {
  const edited = save?.campaignState?.editedAt;
  if (edited) { const t = Date.parse(edited); if (Number.isFinite(t)) return t; }
  if (Number.isFinite(save?.savedAt)) return save.savedAt;
  if (save?.timestamp) { const t = Date.parse(save.timestamp); if (Number.isFinite(t)) return t; }
  return 0;
}
export function hasAiData(save) {
  const ai = save?.aiData;
  return !!ai && typeof ai === 'object' && Object.keys(ai).length > 0;
}

/**
 * Pure computation behind a bulk delete: given the current saves and the ids to
 * remove, return the surviving saves (with neighbour links to the deleted ones
 * cleaned up) and the list of ids whose settlement object actually changed. The
 * caller owns the side effects (analytics, setSaves, persistence).
 * @param {Array<any>} saves
 * @param {Array<string>} ids
 * @returns {{ remaining: Array<any>, modifiedIds: Array<string> }}
 */
export function computeBulkDelete(saves, ids) {
  const idSet = new Set(ids.map(String));
  const deletedSaves = saves.filter(s => idSet.has(String(s.id)));
  const deletedNames = new Set(deletedSaves.map(d => d?.settlement?.name).filter(Boolean));
  const survivors = saves.filter(s => !idSet.has(String(s.id)));
  const remaining = survivors.map(s => {
    const cleanNet = (s.settlement?.neighbourNetwork || []).filter(n => !idSet.has(String(n.id)) && !deletedNames.has(n.name));
    const cleanISR = (s.settlement?.interSettlementRelationships || []).filter(r => !deletedNames.has(r.partnerSettlement));
    if (cleanNet.length === (s.settlement?.neighbourNetwork || []).length
      && cleanISR.length === (s.settlement?.interSettlementRelationships || []).length) return s;
    return { ...s, settlement: { ...s.settlement, neighbourNetwork: cleanNet, interSettlementRelationships: cleanISR } };
  });
  const modifiedIds = remaining.filter((s, i) => s !== survivors[i]).map(s => s.id);
  return { remaining, modifiedIds };
}

export function regionalCountsForSave(campaign, saveId) {
  const impacts = campaign?.regionalGraph?.queuedImpacts || [];
  const counts = { queued: 0, applied: 0, resolved: 0, ignored: 0, expired: 0 };
  for (const impact of impacts) {
    if (String(impact.targetSettlementId) !== String(saveId)) continue;
    if (counts[impact.status] !== undefined) counts[impact.status] += 1;
  }
  return counts;
}
