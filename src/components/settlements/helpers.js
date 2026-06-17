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

export function regionalCountsForSave(campaign, saveId) {
  const impacts = campaign?.regionalGraph?.queuedImpacts || [];
  const counts = { queued: 0, applied: 0, resolved: 0, ignored: 0, expired: 0 };
  for (const impact of impacts) {
    if (String(impact.targetSettlementId) !== String(saveId)) continue;
    if (counts[impact.status] !== undefined) counts[impact.status] += 1;
  }
  return counts;
}
