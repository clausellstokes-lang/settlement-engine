/**
 * WizardOutputToolbar.jsx — sticky back-navigation toolbar.
 *
 * Extracted byte-for-byte from GenerateWizard.jsx. The sticky toolbar
 * above the generated dossier: Back-to-config button, settlement name +
 * tier/pop summary, and a New button. Presentational — every value and
 * handler arrives via props; state and handlers stay in the parent.
 */

import { ArrowLeft, Zap } from 'lucide-react';
import { GOLD, INK, INK_DEEP, MUTED, sans, serif_, SP, R, FS, swatch } from '../theme.js';

export function WizardOutputToolbar({
  settlement,
  isMobile,
  handleBack,
  handleNewSettlement,
}) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: SP.md,
      padding: `${SP.md}px ${SP.lg}px`,
      background: `linear-gradient(to right, ${INK}, ${INK_DEEP})`,
      borderRadius: R.lg,
      boxShadow: '0 2px 8px rgba(0,0,0,0.25)',
      position: 'sticky', top: isMobile ? 0 : 52, zIndex: 40,
    }}>
      <button
        onClick={handleBack}
        style={{
          display: 'flex', alignItems: 'center', gap: SP.xs,
          padding: `${SP.sm}px ${SP.md}px`,
          background: 'rgba(160,118,42,0.15)',
          border: `1px solid rgba(160,118,42,0.3)`,
          borderRadius: R.md, cursor: 'pointer',
          color: GOLD, fontSize: FS.sm, fontWeight: 600, fontFamily: sans,
        }}
        title="Back to configuration"
      >
        <ArrowLeft size={14} /> Back
      </button>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: FS.lg, fontWeight: 700, fontFamily: serif_,
          color: GOLD, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>
          {settlement.name || 'Untitled Settlement'}
        </div>
        <div style={{ fontSize: FS.xxs, color: MUTED, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          {settlement.tier || 'Settlement'} &middot; Pop. {settlement.population?.toLocaleString?.() || '?'}
        </div>
      </div>

      {/* Save UX consolidation (code-review fix): there was a
          second, smaller save button here that called
          savesService.save directly with no error toast, no
          "saved" feedback, and no canSave server-side gate.
          Removed — the SaveToLibraryButton lower in the page
          is the single canonical save action. Two save buttons
          pointing at the same outcome was confusing and meant
          users frequently clicked the worse one. */}
      <div style={{ display: 'flex', gap: SP.xs }}>
        <button
          onClick={handleNewSettlement}
          style={{
            display: 'flex', alignItems: 'center', gap: SP.xs,
            padding: `${SP.sm}px ${SP.md}px`,
            background: GOLD,
            border: 'none',
            borderRadius: R.md, cursor: 'pointer',
            color: swatch.white, fontSize: FS.sm, fontWeight: 700, fontFamily: sans,
          }}
        >
          <Zap size={14} /> New
        </button>
      </div>
    </div>
  );
}
