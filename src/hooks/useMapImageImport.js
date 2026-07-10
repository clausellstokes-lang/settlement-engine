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
      const { blob, w, h, type } = await downscaleImageFile(file, 4096);
      const { url } = await uploadMapBackdrop(blob, { ownerId, campaignId: activeCampaignId, contentType: type });
      setMapBackdrop({ imageUrl: url, w, h });
      // Do NOT eagerly delete the replaced backdrop object. The prior URL is still
      // referenced by the session undo stack (Undo would restore a 404 blank map)
      // and — if this campaign's map was published or imported by others — by the
      // gallery tile and every downstream clone, which owner edits must never break.
      // Physical cleanup of unreferenced backdrops is deferred to campaign deletion /
      // an offline unreferenced-object sweep; a stale object is cheap, a broken
      // reference is not.
      showToast('success', 'Custom map imported. Undo reverts to the generated terrain.');
    } catch (err) {
      showToast('error', err?.message || 'Map import failed.');
    }
  }, [pendingImportFile, activeCampaignId, setMapBackdrop, showToast]);

  const handleClearImage = useCallback(() => {
    clearMapBackdrop();
    // Clearing only drops the reference from mapState — it does NOT delete the
    // storage object, which may still back a published gallery tile, an imported
    // clone, or an undo-stack entry (Undo restores the backdrop). Same deferral as
    // re-import above: physical deletion belongs to campaign deletion / a sweep,
    // never to an owner-side edit that other users' copies depend on.
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
