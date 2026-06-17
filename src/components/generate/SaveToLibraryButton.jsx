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
import { GOLD, R, sans, FS, SP, swatch } from '../theme.js';
import { Save } from 'lucide-react';

export function SaveToLibraryButton({ settlement, canSave, isMobile, onSignIn }) {
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState(null);

  const handleSave = async () => {
    if (!settlement || saving) return;
    setSaveError(null);
    setSaving(true);
    try {
      await savesService.save({
        name: settlement.name || 'Untitled Settlement',
        tier: settlement.tier || 'unknown',
        settlement,
        config: settlement._config || null,
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
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
      <button
        onClick={handleSignupSave}
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
          padding: isMobile ? '13px 24px' : '12px 24px',
          background: swatch.white,
          color: GOLD, fontWeight: 700,
          border: `1.5px solid ${GOLD}`,
          borderBottom: `2px solid ${GOLD}`,
          borderRadius: R.md,
          cursor: 'pointer',
          fontFamily: sans, fontSize: FS.md,
          boxShadow: '0 1px 0 rgba(140,111,50,0.15)',
          transition: 'all 0.15s',
        }}
        title="We'll save your dossier as soon as you're in."
      >
        <Save size={15} />
        Save this town. Free account →
      </button>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: SP.xs }}>
      <button onClick={handleSave} disabled={saving || saved} style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
        padding: isMobile ? '13px 24px' : '10px 24px',
        background: saved ? '#2a7a2a' : '#1a4a2a',
        color: swatch.white, border: 'none', borderRadius: R.md,
        cursor: saving || saved ? 'default' : 'pointer',
        fontFamily: sans, fontSize: FS.md, fontWeight: 700,
        boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
        transition: 'all 0.2s',
      }}>
        <Save size={15} />
        {saved ? '✓ Saved to Library' : saving ? 'Saving...' : 'Save to Library'}
      </button>
      {saveError && (
        <div style={{ color: swatch.danger, fontSize: FS.xs, fontFamily: sans, maxWidth: 420, textAlign: 'center' }}>
          {saveError}
        </div>
      )}
    </div>
  );
}
