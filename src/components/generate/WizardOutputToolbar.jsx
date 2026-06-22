/**
 * WizardOutputToolbar.jsx — sticky back-navigation toolbar.
 *
 * Extracted byte-for-byte from GenerateWizard.jsx. The sticky toolbar
 * above the generated dossier: Back-to-config button, settlement name +
 * tier/pop summary, and a New button. Presentational — every value and
 * handler arrives via props; state and handlers stay in the parent.
 */

import { ArrowLeft } from 'lucide-react';
import { GOLD, INK, INK_DEEP, MUTED, serif_, SP, R, FS } from '../theme.js';
import Button from '../primitives/Button.jsx';
import SimulationDrawer from '../dossier/SimulationDrawer.jsx';

export function WizardOutputToolbar({
  settlement,
  isMobile,
  handleBack,
  handleGenerate,
  handleNewSettlement,
}) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: SP.md, flexWrap: 'wrap',
      padding: `${SP.md}px ${SP.lg}px`,
      background: `linear-gradient(to right, ${INK}, ${INK_DEEP})`,
      borderRadius: R.lg,
      boxShadow: '0 2px 8px rgba(0,0,0,0.25)',
      position: 'sticky', top: isMobile ? 0 : 52, zIndex: 40,
    }}>
      {/* Back is a subordinate nav/reset that discards the just-earned draft — it
          must not out-shout the dossier or Save (P8). Demoted to the same
          secondary outline as "New" so Save (below) stays the single primary of
          the post-generate region; the ArrowLeft icon keeps the affordance. */}
      <Button
        variant="secondary"
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

      {/* Utility cluster — How this was simulated, Regenerate, New, clustered to
          the right of the identity. (A second inline save button used to live
          here; it was removed in favour of the single canonical
          SaveToLibraryButton below the dossier, since two saves pointing at the
          same outcome confused users.) Save stays the one primary; everything
          here is a quiet secondary. Wraps below the name on narrow widths. */}
      <div style={{ display: 'flex', gap: SP.xs, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
        {/* "How this was simulated" — the metadata drawer trigger, hoisted from
            the dossier action band so the utility controls cluster together. */}
        <SimulationDrawer variant="toolbar" />
        {/* Regenerate — re-rolls a fresh draft from the same config (the current
            draft is discarded). A quiet secondary; Save below stays the primary. */}
        <Button
          variant="secondary"
          size="md"
          onClick={handleGenerate}
          aria-label="Regenerate draft"
          title="Roll a fresh draft from the same configuration. The current draft is discarded."
        >
          <span aria-hidden="true">↻ </span>Regenerate draft
        </Button>
        {/* "New Draft" restarts in the same path you chose (instant / Basic /
            Advanced) with a clean slate — a quiet outline. Save (below the
            dossier) is the one primary. */}
        <Button
          variant="secondary"
          size="md"
          onClick={handleNewSettlement}
          title="Start a fresh draft in the same generation path. Your current configuration is cleared."
        >
          New Draft
        </Button>
      </div>
    </div>
  );
}
