/**
 * WizardOutputToolbar.jsx — sticky back-navigation toolbar.
 *
 * Extracted byte-for-byte from GenerateWizard.jsx. The sticky toolbar
 * above the generated dossier: Back-to-config button, settlement name +
 * tier/pop summary, and a New button. Presentational — every value and
 * handler arrives via props; state and handlers stay in the parent.
 */

import { ArrowLeft, Zap } from 'lucide-react';
import { GOLD, INK, INK_DEEP, MUTED, serif_, SP, R, FS } from '../theme.js';
import Button from '../primitives/Button.jsx';

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
      <Button
        variant="gold"
        size="md"
        icon={<ArrowLeft size={14} />}
        onClick={handleBack}
        title="Back to configuration"
      >
        Back
      </Button>

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
        <Button
          variant="primary"
          size="md"
          icon={<Zap size={14} />}
          onClick={handleNewSettlement}
        >
          New
        </Button>
      </div>
    </div>
  );
}
