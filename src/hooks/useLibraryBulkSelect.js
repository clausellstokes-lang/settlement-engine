/**
 * useLibraryBulkSelect — the Library multi-select state + bulk-action handlers
 * (UX overhaul Phase 3, plan §4.2). Extracted from SettlementsPanel so the panel
 * stays focused on layout/wiring and this owns the selection set + the four bulk
 * operations (add-to-campaign / canonize / export / delete).
 *
 * Pure store-free hook: every mutation is performed via the callbacks the caller
 * passes in (the panel already owns `saves`, `addToCampaign`, `canonizeSaved...`,
 * and a batch-delete). The hook holds only the ephemeral selection UI state.
 *
 *   const bulk = useLibraryBulkSelect({ saves, addToCampaign, canonizeSavedSettlement,
 *     bulkDeleteConfirmed, getCampaignMembershipBlock, getSettlementDeletionBlock,
 *     isActive, isDraft });
 */

import { useCallback, useState } from 'react';

/**
 * @param {{
 *   saves: Array<any>,
 *   addToCampaign: (campaignId: string, saveId: string) => any,
 *   canonizeSavedSettlement: (saveId: string) => void,
 *   bulkDeleteConfirmed: (ids: string[]) => any | Promise<any>,
 *   getCampaignMembershipBlock?: (campaignId: string, saveId: string) => any,
 *   getSettlementDeletionBlock?: (saveIds: string[]) => any,
 *   isActive: (save: any) => boolean,
 *   isDraft: (save: any) => boolean,
 * }} deps
 */
export function useLibraryBulkSelect({
  saves,
  addToCampaign,
  canonizeSavedSettlement,
  bulkDeleteConfirmed,
  getCampaignMembershipBlock,
  getSettlementDeletionBlock,
  isActive,
  isDraft,
}) {
  const [selectMode, setSelectMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState(() => new Set());
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [exportError, setExportError] = useState('');

  const toggleSelect = useCallback((id) => {
    const key = String(id);
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  }, []);

  const clear = useCallback(() => {
    setSelectedIds(new Set());
    setSelectMode(false);
    setDeleteConfirm(false);
    setExportError('');
  }, []);
  const toggleMode = useCallback(() => {
    setSelectMode(currentMode => !currentMode);
    setSelectedIds(new Set());
    setExportError('');
  }, []);

  const getAddToCampaignBlock = useCallback((campaignId) => {
    for (const id of selectedIds) {
      const blocked = getCampaignMembershipBlock?.(campaignId, id);
      if (blocked) return blocked;
    }
    return null;
  }, [selectedIds, getCampaignMembershipBlock]);

  const addToCampaignBulk = useCallback((campaignId) => {
    const blocked = getAddToCampaignBlock(campaignId);
    if (blocked) return blocked;
    for (const id of selectedIds) {
      addToCampaign(campaignId, id);
    }
    clear();
    return { ok: true };
  }, [selectedIds, addToCampaign, clear, getAddToCampaignBlock]);

  const canonizeBulk = useCallback(() => {
    for (const id of selectedIds) {
      const selectedSave = saves.find(save => String(save.id) === id);
      if (selectedSave && isActive(selectedSave) && isDraft(selectedSave)) {
        canonizeSavedSettlement(id);
      }
    }
    clear();
  }, [selectedIds, saves, canonizeSavedSettlement, isActive, isDraft, clear]);

  const exportBulk = useCallback(() => {
    const selectedSaves = saves.filter(save => selectedIds.has(String(save.id)));
    if (!selectedSaves.length) {
      clear();
      return;
    }
    try {
      setExportError('');
      const blob = new Blob(
        [JSON.stringify(selectedSaves, null, 2)],
        { type: 'application/json' },
      );
      const url = URL.createObjectURL(blob);
      const downloadLink = document.createElement('a');
      downloadLink.href = url;
      downloadLink.download = `settlements-export-${selectedSaves.length}.json`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      downloadLink.remove();
      URL.revokeObjectURL(url);
    } catch (error) {
      // P10: a failed export must not look identical to a success. Surface a
      // recoverable error and KEEP the selection so the user can retry — do not
      // clear() on the failure path.
      console.error('[useLibraryBulkSelect] export failed:', error);
      setExportError('That export could not be created. Try again, or export settlements individually.');
      return;
    }
    clear();
  }, [saves, selectedIds, clear]);

  const getDeleteBlock = useCallback(
    () => getSettlementDeletionBlock?.([...selectedIds]) || null,
    [selectedIds, getSettlementDeletionBlock],
  );

  const confirmDelete = useCallback(async () => {
    const result = await bulkDeleteConfirmed([...selectedIds]);
    if (result?.ok !== false) {
      clear();
    }
    return result;
  }, [selectedIds, bulkDeleteConfirmed, clear]);

  return {
    selectMode,
    selectedIds,
    deleteConfirm,
    setDeleteConfirm,
    exportError,
    setExportError,
    toggleSelect,
    toggleMode,
    clear,
    addToCampaignBulk,
    getAddToCampaignBlock,
    canonizeBulk,
    exportBulk,
    confirmDelete,
    getDeleteBlock,
  };
}
