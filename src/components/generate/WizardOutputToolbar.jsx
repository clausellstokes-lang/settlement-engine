/**
 * WizardOutputToolbar.jsx — sticky back-navigation toolbar.
 *
 * Extracted byte-for-byte from GenerateWizard.jsx. The sticky toolbar
 * above the generated dossier: Back-to-config button, settlement name +
 * tier/pop summary, and a New button. Presentational — every value and
 * handler arrives via props; state and handlers stay in the parent.
 */

import { ArrowLeft } from 'lucide-react';
import { GOLD, INK, INK_DEEP, MUTED, serif_, SP, R, FS, CHROME } from '../theme.js';
import Button from '../primitives/Button.jsx';
import SimulationDrawer from '../dossier/SimulationDrawer.jsx';

export function WizardOutputToolbar({
  settlement,
  isMobile,
  handleBack,
  handleGenerate,
  handleNewSettlement,
  maxWidth,
}) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: SP.md, flexWrap: 'wrap',
      padding: `${SP.md}px ${SP.lg}px`,
      background: `linear-gradient(to right, ${INK}, ${INK_DEEP})`,
      borderRadius: R.lg,
      boxShadow: '0 2px 8px rgba(0,0,0,0.25)',
      // Cap the toolbar to the dossier's column and centre it, so on wide
      // screens its edges align to the PAGE_MAX dossier below instead of
      // overhanging full <main> width. Applied to the toolbar's OWN box —
      // it must NOT be wrapped in a height-collapsed parent, or it would lose
      // its sticky containing block and scroll away with the dossier.
      maxWidth, marginLeft: 'auto', marginRight: 'auto', width: '100%',
      // Pin below the sticky app header (z:50). The desktop offset clears the
      // full header so the toolbar's top edge and shadow are not tucked under it.
      // On mobile the header is slim (CHROME.headerMobile) and also sticky at
      // top:0; pinning this bar at the header's height stacks the two cleanly
      // instead of letting the toolbar slide UNDER the header (so the dossier
      // name and Back/Regenerate stay visible while scrolling). zIndex 40 keeps
      // the bar above the dossier but below the header, so the header always wins
      // the overlap. This sticky only pins because the app's <main> no longer
      // establishes a (dead) scroll container — see the note in App.jsx; the
      // window is the scroller.
      position: 'sticky', top: isMobile ? CHROME.headerMobile : 60, zIndex: 40,
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
          here is a quiet secondary. On desktop it sits to the right of the name;
          on mobile, where the name takes its own wrapped row, the cluster
          left-aligns and may grow full-width so the three controls read as a calm
          row under the name rather than crowding the right edge. */}
      <div style={{
        display: 'flex', gap: SP.xs, flexWrap: 'wrap',
        justifyContent: isMobile ? 'flex-start' : 'flex-end',
        ...(isMobile ? { flex: '1 1 100%' } : null),
      }}>
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
