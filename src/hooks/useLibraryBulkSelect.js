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
 *                                       bulkDeleteConfirmed, isActive, isDraft });
 */

import { useCallback, useState } from 'react';

/**
 * @param {{
 *   saves: Array<any>,
 *   addToCampaign: (campaignId: string, saveId: string) => void,
 *   canonizeSavedSettlement: (saveId: string) => void,
 *   bulkDeleteConfirmed: (ids: string[]) => void,
 *   isActive: (save: any) => boolean,
 *   isDraft: (save: any) => boolean,
 * }} deps
 */
export function useLibraryBulkSelect({ saves, addToCampaign, canonizeSavedSettlement, bulkDeleteConfirmed, isActive, isDraft }) {
  const [selectMode, setSelectMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState(() => new Set());
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  const toggleSelect = useCallback((id) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }, []);

  const clear = useCallback(() => { setSelectedIds(new Set()); setSelectMode(false); setDeleteConfirm(false); }, []);
  const toggleMode = useCallback(() => { setSelectMode(m => !m); setSelectedIds(new Set()); }, []);

  const addToCampaignBulk = useCallback((campaignId) => {
    for (const id of selectedIds) addToCampaign(campaignId, id);
    clear();
  }, [selectedIds, addToCampaign, clear]);

  const canonizeBulk = useCallback(() => {
    for (const id of selectedIds) {
      const sv = saves.find(s => s.id === id);
      if (sv && isActive(sv) && isDraft(sv)) canonizeSavedSettlement(id);
    }
    clear();
  }, [selectedIds, saves, canonizeSavedSettlement, isActive, isDraft, clear]);

  const exportBulk = useCallback(() => {
    const picked = saves.filter(s => selectedIds.has(s.id));
    if (!picked.length) { clear(); return; }
    try {
      const blob = new Blob([JSON.stringify(picked, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `settlements-export-${picked.length}.json`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error('[useLibraryBulkSelect] export failed:', e);
    }
    clear();
  }, [saves, selectedIds, clear]);

  const confirmDelete = useCallback(() => {
    bulkDeleteConfirmed([...selectedIds]);
    clear();
  }, [selectedIds, bulkDeleteConfirmed, clear]);

  return {
    selectMode, selectedIds, deleteConfirm,
    setDeleteConfirm,
    toggleSelect, toggleMode, clear,
    addToCampaignBulk, canonizeBulk, exportBulk, confirmDelete,
  };
}
