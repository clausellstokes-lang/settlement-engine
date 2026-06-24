/**
 * useMapImageImport.js — custom-image map backdrop import/clear (Project 1, premium).
 *
 * Extracted from WorldMap.jsx (to hold the component size ratchet). Owns the
 * pending-import state and the three handlers the toolbar wires:
 *
 *   handleImportImage  — open the device file picker; a chosen file is held in
 *                        pendingImportFile, gating on the ConfirmDialog.
 *   performImportImage — on confirm: validate → downscale (≤4096px) → upload to
 *                        Supabase Storage → setMapBackdrop (one undo step, so the
 *                        map's Undo button reverts the whole import).
 *   handleClearImage   — drop back to generated terrain.
 *
 * Premium + active-campaign gated at the toolbar call site (the controls only
 * render for canManageCampaigns + activeCampaignId).
 */

import { useCallback, useState } from 'react';
import { useStore } from '../store/index.js';

/**
 * @param {object} args
 * @param {string|null} args.activeCampaignId
 * @param {(b:{imageUrl:string,w:number,h:number})=>void} args.setMapBackdrop
 * @param {()=>void} args.clearMapBackdrop
 * @param {(kind:string,text:string)=>void} args.showToast
 */
export function useMapImageImport({ activeCampaignId, setMapBackdrop, clearMapBackdrop, showToast }) {
  // The device File the user picked, held while the ConfirmDialog warns that
  // applying it disables terrain features and overwrites the current map.
  const [pendingImportFile, setPendingImportFile] = useState(null);

  const handleImportImage = useCallback(() => {
    if (!activeCampaignId) { showToast('info', 'Select a campaign before importing a map image.'); return; }
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/png,image/jpeg,image/webp';
    input.onchange = () => { if (input.files?.[0]) setPendingImportFile(input.files[0]); };
    input.click();
  }, [activeCampaignId, showToast]);

  const performImportImage = useCallback(async () => {
    const file = pendingImportFile;
    setPendingImportFile(null);
    if (!file || !activeCampaignId) return;
    try {
      const { validateImageFile, downscaleImageFile, uploadMapBackdrop } = await import('../lib/imageUpload.js');
      const v = validateImageFile(file);
      if (!v.ok) { showToast('error', v.error); return; }
      const ownerId = useStore.getState().auth?.user?.id;
      if (!ownerId) { showToast('error', 'Sign in to import a map image.'); return; }
      showToast('info', 'Processing image…');
      const prevUrl = useStore.getState().mapState.customBackdrop?.imageUrl || null;
      const { blob, w, h, type } = await downscaleImageFile(file, 4096);
      const { url } = await uploadMapBackdrop(blob, { ownerId, campaignId: activeCampaignId, contentType: type });
      setMapBackdrop({ imageUrl: url, w, h });
      // Best-effort: delete the replaced object so re-imports don't orphan storage.
      if (prevUrl && prevUrl !== url) import('../lib/imageUpload.js').then(({ removeMapBackdrop }) => removeMapBackdrop(prevUrl)).catch(() => {});
      showToast('success', 'Custom map imported. Undo reverts to the generated terrain.');
    } catch (err) {
      showToast('error', err?.message || 'Map import failed.');
    }
  }, [pendingImportFile, activeCampaignId, setMapBackdrop, showToast]);

  const handleClearImage = useCallback(() => {
    const url = useStore.getState().mapState.customBackdrop?.imageUrl;
    clearMapBackdrop();
    if (url) import('../lib/imageUpload.js').then(({ removeMapBackdrop }) => removeMapBackdrop(url)).catch(() => {});
    showToast('info', 'Reverted to generated terrain.');
  }, [clearMapBackdrop, showToast]);

  return {
    pendingImportFile,
    cancelImportImage: useCallback(() => setPendingImportFile(null), []),
    handleImportImage,
    performImportImage,
    handleClearImage,
  };
}
