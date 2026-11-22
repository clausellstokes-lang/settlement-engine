/**
 * useGalleryShareControls — the share state and writes behind "Manage gallery"
 * (RULINGS-CROSS X-21, X-24, X-24b; W2-VEIL-B). ShareToGallery owns the form state it shares
 * with the gallery details (memberOverrides, importable, busy, error) and hands the setters in;
 * this hook owns the mode, the Manage and Curate panels, and the four share writes: a mode
 * change, a snapshot refresh, curate Done, and Remove from gallery.
 */

import { useMemo, useState } from 'react';
import { unpublishSettlement, updateGalleryMetadata } from '../lib/gallery.js';
import {
  readShareVeil, writeShareVeil, readShareMode, galleryPayloadFor, curateModelFor, VEIL_MODES,
} from '../domain/display/galleryVeil.js';

export default function useGalleryShareControls({
  saveId, settlement, shareDm, memberOverrides, setMemberOverrides, importable, setImportable,
  isPublic, setIsPublic, updateSavedSettlement, onSaved, setBusy, setError, galleryMemberOverrides,
}) {
  // X-24: snapshot (the default) or live. Read from the share's mode record.
  const [mode, setMode] = useState(() => readShareMode(galleryMemberOverrides).mode || VEIL_MODES[0]);
  const [manageOpen, setManageOpen] = useState(false);
  const [curating, setCurating] = useState(false);
  const veil = useMemo(() => readShareVeil(memberOverrides), [memberOverrides]);
  const share = useMemo(() => readShareMode(memberOverrides), [memberOverrides]);
  // The visitor's copy (before the veil) and the curate model: computed only while Manage is
  // open, since the projection walks the whole settlement.
  const visitorCopy = useMemo(() => (
    manageOpen && settlement ? galleryPayloadFor(settlement, { shareDm, memberOverrides }) : null
  ), [manageOpen, settlement, shareDm, memberOverrides]);
  const veilModel = useMemo(() => (
    visitorCopy && veil.marked ? curateModelFor(visitorCopy, veil.deltas) : null
  ), [visitorCopy, veil]);
  // X-24b REMOVE FROM GALLERY: unpublish, then clear the veil, the mode and every per-member
  // entry (the veil's card-level half) and turn import off, so a later export starts clean
  // from the defaults. The button reverts to "Export to gallery".
  async function handleRemove() {
    setBusy(true); setError(null);
    try {
      await unpublishSettlement(saveId);
      await updateGalleryMetadata(saveId, { memberOverrides: {}, importable: false });
      setIsPublic(false);
      setManageOpen(false);
      setCurating(false);
      setMemberOverrides({});
      setImportable(false);
      setMode(VEIL_MODES[0]);
      try {
        updateSavedSettlement?.(saveId, { is_public: false, gallery_member_overrides: {}, gallery_importable: false });
      } catch { /* non-fatal */ }
    } catch (e) {
      setError(e.message || 'Remove from gallery failed');
    } finally {
      setBusy(false);
    }
  }

  /** The mode record a write carries: the mode, now, and (snapshot) the frozen copy. */
  function modeRecord(nextMode) {
    return {
      mode: nextMode,
      at: new Date().toISOString(),
      snapshot: nextMode === VEIL_MODES[0] && settlement ? galleryPayloadFor(settlement, { shareDm, memberOverrides }) : null,
    };
  }

  /** Persist a share change at once (curate Done, mode, refresh): overrides and import. */
  async function persistShare(nextOverrides, nextImportable) {
    setBusy(true); setError(null);
    try {
      await updateGalleryMetadata(saveId, { memberOverrides: nextOverrides, importable: nextImportable });
      setMemberOverrides(nextOverrides);
      setImportable(nextImportable);
      try {
        updateSavedSettlement?.(saveId, { gallery_member_overrides: nextOverrides, gallery_importable: nextImportable });
      } catch { /* non-fatal */ }
      onSaved?.();
    } catch (e) {
      setError(e.message || 'Gallery details could not be saved');
    } finally {
      setBusy(false);
    }
  }

  function handleMode(nextMode) {
    if (nextMode === mode) return;
    setMode(nextMode);
    if (!isPublic) return; // before export the toggle only chooses
    persistShare(writeShareVeil(memberOverrides, veil.deltas, modeRecord(nextMode)), nextMode === 'live' ? false : importable);
  }

  function handleRefreshSnapshot() {
    persistShare(writeShareVeil(memberOverrides, veil.deltas, modeRecord(VEIL_MODES[0])), importable);
  }

  function handleCurateDone(nextDeltas) {
    setCurating(false);
    persistShare(writeShareVeil(memberOverrides, nextDeltas), importable);
  }

  return {
    mode, manageOpen, setManageOpen, curating, setCurating, veil, share, visitorCopy, veilModel,
    modeRecord, handleMode, handleRefreshSnapshot, handleCurateDone, handleRemove,
  };
}
