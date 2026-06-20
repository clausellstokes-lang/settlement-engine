/**
 * SaveToLibraryButton.jsx — Save-to-library / save-as-signup action.
 *
 * Extracted byte-for-byte from GenerateWizard.jsx. When the user can save,
 * persists the dossier via savesService. When they can't (anonymous or at
 * cap), renders the P101 / X-3 "free account" door that stashes a pending
 * save intent and opens the auth flow.
 */

import { useState } from 'react';
import { saves as savesService } from '../../lib/saves.js';
import { useStore } from '../../store/index.js';
import { sans, FS, SP, swatch } from '../theme.js';
import { Save } from 'lucide-react';
import Button from '../primitives/Button.jsx';

// isMobile is part of the public prop contract (callers still pass it); the
// responsive padding it drove now lives in the Button primitive's size, so the
// value is intentionally unused here — aliased to _isMobile to keep lint clean.
export function SaveToLibraryButton({ settlement, canSave, isMobile: _isMobile, onSignIn }) {
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const notePersistedSave = useStore(s => s.notePersistedSave);
  const setSavedSettlements = useStore(s => s.setSavedSettlements);

  const handleSave = async () => {
    if (!settlement || saving) return;
    setSaveError(null);
    setSaving(true);
    try {
      const saveId = await savesService.save({
        name: settlement.name || 'Untitled Settlement',
        tier: settlement.tier || 'unknown',
        settlement,
        config: settlement._config || null,
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
      // Refresh the store's savedSettlements so the count is accurate, then
      // fire the real-save instrumentation (first_save/third_save pricing
      // moments + 'saved' fingerprint). Fire-and-forget — never blocks the UI.
      try {
        const refreshed = await savesService.list();
        setSavedSettlements?.(refreshed);
      } catch { /* count may be stale; instrumentation still safe */ }
      notePersistedSave?.(settlement, saveId);
    } catch (e) {
      console.error('Save failed:', e);
      setSaveError(`Failed to save: ${e.message || e}`);
    } finally {
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
    const handleSignupSave = () => {
      if (typeof onSignIn === 'function') onSignIn();
      // Lazy-load to avoid pulling authIntents into the wizard bundle
      // until the user actually clicks the button.
      import('../../lib/authIntents.js').then(({ setPending, INTENTS }) => {
        setPending(INTENTS.SAVE_SETTLEMENT, {
          name: settlement.name || 'Untitled Settlement',
          tier: settlement.tier || 'unknown',
          settlement,
          config: settlement._config || null,
        });
        // Analytics + auth flow open
        import('../../lib/analytics.js').then(({ Funnel, EVENTS }) => {
          Funnel.track(EVENTS.SAVE_BUTTON_CLICKED, { tier: settlement.tier });
          Funnel.track(EVENTS.SAVE_SIGNUP_INTENT_OPENED, { tier: settlement.tier });
        });
      });
    };

    return (
      <Button
        variant="gold"
        size="lg"
        icon={<Save size={15} />}
        onClick={handleSignupSave}
        title="We'll save your dossier as soon as you're in."
      >
        Save this town. Free account →
      </Button>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: SP.xs }}>
      <Button
        variant="success"
        size="lg"
        icon={<Save size={15} />}
        onClick={handleSave}
        disabled={saving || saved}
      >
        {saved ? '✓ Saved to Library' : saving ? 'Saving...' : 'Save to Library'}
      </Button>
      {saveError && (
        <div style={{ color: swatch.danger, fontSize: FS.xs, fontFamily: sans, maxWidth: 420, textAlign: 'center' }}>
          {saveError}
        </div>
      )}
    </div>
  );
}
