import {
  applyFactionRenameToPartner,
  factionRenameChanges,
} from '../../domain/factionRename.js';

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
export function findSaveById(saves, id) {
  return id == null
    ? null
    : saves.find(save => save?.id != null && String(save.id) === String(id)) || null;
}

// Rename every supported settlement reference field on one relationship. The
// implementation moved to src/domain/factionRename.js (owner queue #14) so the
// store lane and this library lane share ONE writer; re-exported here because
// this module is the spelling every existing importer already reaches for.
export { renameInterSettlementReference } from '../../domain/factionRename.js';

/** Apply settlement fields without disturbing save-level persistence metadata. */
export function withSettlementChanges(save, changes) {
  return {
    ...save,
    settlement: {
      ...save.settlement,
      ...changes,
    },
  };
}

/**
 * Apply a faction rename to ONE library save (owner queue #14). The host save
 * gets the full in-settlement cascade; every other save gets only the neighbour
 * links that point back at the host. Returns the SAME reference when nothing
 * moved, so the caller's `s !== saves[i]` modified-set stays honest and no
 * untouched save is persisted.
 *
 * The generic rewrites in applyRename are deliberately not reused for factions:
 * they also rewrite partnerName and npcName, which would rename a neighbouring
 * town or a person who happens to share the faction's name.
 *
 * @param {any} save
 * @param {boolean} isHost  whether this save owns the renamed faction
 * @param {string} hostName the host settlement's own name
 * @param {string} oldName
 * @param {string} newName
 */
export function withFactionRenamed(save, isHost, hostName, oldName, newName) {
  if (!isHost) {
    const partner = applyFactionRenameToPartner(save?.settlement, hostName, oldName, newName);
    return partner.changed ? { ...save, settlement: partner.settlement } : save;
  }
  const { changed, changes } = factionRenameChanges(save?.settlement, oldName, newName);
  return changed ? withSettlementChanges(save, changes) : save;
}

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

/**
 * Pure computation behind the dossier-header inline settlement rename (C3 / C4
 * Panel A handoff): given the open `detail` and a new name, return the detail with
 * the settlement name patched on BOTH the live copy and the embedded saveData (the
 * `name` column + `settlement.name`), so the open saved-dossier view reflects the
 * rename immediately. The store's renameSettlement (the single town-rename writer)
 * owns the persist + the savedSettlements update; this ONLY keeps the local detail
 * copy in lockstep — renameSettlement mutates savedSettlements, not this component's
 * detail state, and the header's EditableInline renders from its `value` prop after
 * commit, so without this the name would revert until re-open. Null / empty-name
 * tolerant: returns the detail unchanged (same reference) when there is nothing to do.
 * @param {any} detail
 * @param {string} newName
 * @returns {any} the next detail (or the same reference when unchanged)
 */
export function renameDetailSettlement(detail, newName) {
  const trimmed = String(newName || '').trim();
  if (!detail || !trimmed) return detail;
  return {
    ...detail,
    settlement: { ...(detail.settlement || {}), name: trimmed },
    saveData: detail.saveData
      ? { ...detail.saveData, name: trimmed, settlement: { ...(detail.saveData.settlement || {}), name: trimmed } }
      : detail.saveData,
  };
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
