/**
 * SaveToLibraryButton.jsx — Save-to-library / save-as-signup action.
 *
 * Extracted byte-for-byte from GenerateWizard.jsx. When the user can save,
 * persists the dossier via savesService. When they can't (anonymous or at
 * cap), renders the P101 / X-3 "free account" door that stashes a pending
 * save intent and opens the auth flow.
 */

import { useRef, useState } from 'react';
import { saves as savesService } from '../../lib/saves.js';
import { t } from '../../copy/index.js';
import { writeDraft, clearDraft } from '../../lib/pendingSaveDraft.js';
import { useStore } from '../../store';
import { sans, FS, SP, swatch } from '../theme.js';
import Button from '../primitives/Button.jsx';

// isMobile is part of the public prop contract (callers still pass it); the
// responsive padding it drove now lives in the Button primitive's size, so the
// value is intentionally unused here — aliased to _isMobile to keep lint clean.
export function SaveToLibraryButton({ settlement, canSave, isMobile: _isMobile, onSignIn }) {
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const savingRef = useRef(false);
  // Stamp the active save id after a successful save so the exit dialog stops
  // calling a saved draft unsaved and the durable-purchase rung advances (finding
  // components-shell-commerce-2). The freshly-saved row itself surfaces on the
  // next library hydration (savesService.list → setSavedSettlements).
  const setActiveSaveId = useStore(s => s.setActiveSaveId);

  const handleSave = async () => {
    if (!settlement || savingRef.current) return;
    savingRef.current = true;
    setSaveError(null);
    setSaving(true);
    try {
      // V2 DEFAULT-MINT (create chokepoint 1/3): a newly-saved settlement mints
      // layout v2 onto its fresh blob. The lazy import belongs inside this
      // try/finally so a chunk-load failure cannot strand the button as Saving.
      const { newSettlementMapEdits } = await import('../../domain/townMap/mapEdits.js');
      const minted = settlement.mapEdits ? settlement : { ...settlement, mapEdits: newSettlementMapEdits() };
      const payload = {
        name: minted.name || 'Untitled Settlement',
        tier: minted.tier || 'unknown',
        settlement: minted,
        config: minted._config || null,
      };
      // Safety net: stash the dossier locally BEFORE the network call. If the
      // save stalls, the empty-state can restore it after a reload.
      writeDraft(payload);
      const saveId = await savesService.save(payload);
      // Bind the returned id into the store BEFORE the success chrome so a
      // re-render sees the draft as saved (activeSaveId set).
      if (typeof setActiveSaveId === 'function') setActiveSaveId(saveId);
      setSaved(true);
      clearDraft();
      setTimeout(() => setSaved(false), 3000);
      // F34 — this is a REAL save chokepoint. Fire the first_save/third_save
      // pricing moment + 'saved' research capture here (the dead store
      // saveSettlement action used to host them). Fire-and-forget.
      import('../../store/saveMoments.js')
        .then(({ recordSaveMomentForActiveSave }) =>
          recordSaveMomentForActiveSave({ saveId, settlement, store: useStore }))
        .catch(() => { /* never block the save */ });
    } catch (e) {
      console.error('Save failed:', e);
      setSaveError(t('errors.saveFailed'));
    } finally {
      savingRef.current = false;
      setSaving(false);
    }
  };

  // P101 / X-3 — Save-as-signup. When the user can't save (anonymous,
  // or hit the per-tier cap), instead of a disabled tombstone we render
  // an active "free account" door. Clicking stashes the current dossier
  // as a pending intent, opens the AuthModal, and on success the auth
  // intent registry fires savesService.save with the same payload —
  // the user lands back to a saved settlement.
  if (!canSave) {
    const handleSignupSave = async () => {
      if (!settlement || savingRef.current) return;
      savingRef.current = true;
      setSaving(true);
      setSaveError(null);
      try {
        // Arm the intent BEFORE opening auth. Opening first allowed a fast
        // sign-in to finish while these lazy chunks were still loading, so the
        // SIGNED_IN consumer saw no intent and silently lost the promised save.
        const [{ setPending, INTENTS }, { newSettlementMapEdits }] = await Promise.all([
          import('../../lib/authIntents.js'),
          import('../../domain/townMap/mapEdits.js'),
        ]);
        // V2 DEFAULT-MINT (create chokepoint 1/3, anon→signup arm): the post-signup save
        // (store/index.js SAVE_SETTLEMENT handler) persists this stashed settlement verbatim,
        // so mint v2 here too — a new save mints v2 whether the user is signed in or not.
        const minted = settlement.mapEdits ? settlement : { ...settlement, mapEdits: newSettlementMapEdits() };
        setPending(INTENTS.SAVE_SETTLEMENT, {
          name: minted.name || 'Untitled Settlement',
          tier: minted.tier || 'unknown',
          settlement: minted,
          config: minted._config || null,
        });
        if (typeof onSignIn === 'function') onSignIn();
        // Analytics + auth flow open
        import('../../lib/analytics.js').then(({ Funnel, EVENTS }) => {
          Funnel.track(EVENTS.SAVE_BUTTON_CLICKED, { tier: settlement.tier });
          Funnel.track(EVENTS.SAVE_SIGNUP_INTENT_OPENED, { tier: settlement.tier });
        }).catch(() => { /* analytics must never affect auth */ });
      } catch (error) {
        console.error('Could not prepare save-after-sign-in:', error);
        setSaveError(t('errors.saveFailed'));
      } finally {
        savingRef.current = false;
        setSaving(false);
      }
    };

    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: SP.xs }}>
        <Button
          variant="gold"
          size="lg"
          onClick={handleSignupSave}
          disabled={saving}
          busy={saving}
          title="We'll save your dossier as soon as you're in."
        >
          {saving ? 'Preparing your save…' : 'Save this town. Free account →'}
        </Button>
        {saveError && (
          <div role="alert" style={{ color: swatch.danger, fontSize: FS.xs, fontFamily: sans, maxWidth: 420, textAlign: 'center' }}>
            {saveError}
          </div>
        )}
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: SP.xs }}>
      <Button
        variant="success"
        size="lg"
        onClick={handleSave}
        disabled={saving || saved}
      >
        {saved ? '✓ Saved to Library' : saving ? 'Saving...' : 'Save to Library'}
      </Button>
      {saveError && (
        <div role="alert" style={{ color: swatch.danger, fontSize: FS.xs, fontFamily: sans, maxWidth: 420, textAlign: 'center' }}>
          {saveError}
        </div>
      )}
    </div>
  );
}
