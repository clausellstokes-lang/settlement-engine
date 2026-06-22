import { FS, swatch } from '../theme.js';
import { TIER_LABELS } from '../new/design';
import { EVENTS } from '../../lib/analytics.js';
import { AlertTriangle } from 'lucide-react';
import EditableInline from '../primitives/EditableInline.jsx';
import { threatDisplay } from '../map/settlementThreat.js';

// Persistent at-the-table header facts (tier / population / trade route) read
// mid-session on the dark identity bar. '#D8C8A8' is a light warm parchment ink
// that clears 4.5:1 comfortably on the near-black header — well above the thin
// margin mutedBrown ('#9c8068') held — while weight still distinguishes the tier
// from the supporting facts. (P7 forbids muted/chrome tones in persistent state.)
const HEADER_FACT = swatch['#D8C8A8'];

// Dossier header bar — extracted verbatim from OutputContainer's render.
// Presentational only: every value/handler arrives via props; the parent
// keeps all state and effects. `narrativeButtons` is the already-evaluated
// narrative-button slot the parent decides whether to render.
//
// Reroll lives in the NPCs / History tab bodies (next to the content it
// rerolls), NOT in this header — a header control that appeared on only 2 of
// ~20 sub-tabs read as a layout glitch and duplicated the in-tab Reroll button.
export default function DossierHeaderRow({
  readOnly,
  queueEdit,
  settlement,
  saveId,
  stressObj,
  narrativeButtons,
  // UX overhaul Phase 6 — the dossier header is the ONE place a settlement is
  // renamed. In the live editor that goes through queueEdit('rename-settlement');
  // in the saved-dossier editor (readOnly OutputContainer) allowRename + an
  // explicit onRenameSettlement callback enable the same inline edit there too,
  // so the old config.customName / Edit-Names triple-path collapses into this.
  allowRename = false,
  onRenameSettlement = null,
}) {
  // Editable when the live editor is active (write store via queueEdit), or when
  // the saved-dossier editor opted in via allowRename + a rename callback.
  const nameEditable = (!readOnly && queueEdit) || (allowRename && typeof onRenameSettlement === 'function');
  const commitRename = (newName) => {
    if (allowRename && typeof onRenameSettlement === 'function') {
      onRenameSettlement(newName);
    } else if (queueEdit) {
      queueEdit('rename-settlement', { newName });
    }
  };
  return (
          <div style={{ padding: '14px 20px', background: 'linear-gradient(135deg, #1c1409 0%, #2d1f0e 60%, #1c1409 100%)', display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', borderBottom: '1px solid rgba(196,154,60,0.2)' }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: 'Crimson Text, Georgia, serif', fontSize: FS.h1, fontWeight: 600, color: swatch['#C49A3C'], lineHeight: 1.1 }}>
                {nameEditable ? (
                  <EditableInline
                    value={settlement.name || ''}
                    ariaLabel="Edit settlement name"
                    textStyle={{ fontFamily: 'Crimson Text, Georgia, serif', fontSize: FS.h1, fontWeight: 600, color: swatch['#C49A3C'], lineHeight: 1.1 }}
                    trackEvent={EVENTS.EDIT_PENDING_QUEUED}
                    provenance={{ kind: 'rename-settlement', entityId: saveId || 'unsaved' }}
                    onCommit={commitRename}
                  />
                ) : settlement.name}
              </div>
              <div style={{ display: 'flex', gap: 8, marginTop: 5, flexWrap: 'wrap', alignItems: 'center' }}>
                <span style={{ fontSize: FS.sm, color: HEADER_FACT, textTransform: 'capitalize', fontWeight: 700 }}>{TIER_LABELS[settlement.tier] || settlement.tier}</span>
                <span aria-hidden="true" style={{ fontSize: FS.sm, color: swatch.mutedBrown }}>{'\u00b7'}</span>
                <span style={{ fontSize: FS.sm, color: HEADER_FACT, fontWeight: 600 }}>{settlement.population?.toLocaleString() + ' pop.'}</span>
                {settlement.config?.tradeRouteAccess && <span style={{ fontSize: FS.sm, color: HEADER_FACT, fontWeight: 600 }}>{settlement.config.tradeRouteAccess.replace(/_/g,' ')}</span>}
                {/* The threat WORD comes from the shared threatDisplay helper so
                    a given monsterThreat reads identically here and in the
                    SettlementPalette pill (P2) — the old inline map showed the
                    SAME value as a different word on each surface. Colors stay
                    parchment-toned for the dark header bar; only the label is
                    unified. AlertTriangle on 'plagued' is the two-channel cue. */}
                {settlement.config?.monsterThreat && settlement.config.monsterThreat !== 'frontier' && <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: FS.xs, fontWeight: 700, color: settlement.config.monsterThreat === 'plagued' ? swatch.stressAmber : swatch['#C49A3C'], background: 'rgba(196,154,60,0.12)', borderRadius: 3, padding: '2px 7px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{settlement.config.monsterThreat === 'plagued' && <AlertTriangle size={11} aria-hidden="true" />}{threatDisplay(settlement.config.monsterThreat)?.label || settlement.config.monsterThreat}</span>}
                {stressObj && <span style={{ fontSize: FS.xxs, fontWeight: 800, color: swatch.stressAmber, background: 'rgba(0,0,0,0.45)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 4, padding: '2px 8px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{stressObj.label}</span>}
              </div>
            </div>
            {/* ── AI Narrative Layer button group ──────────────────────────────────
                When `narrativeLayerStrip` flag is on, the
                narrative buttons move out of the header into a labeled strip
                below (rendered further down). The header remains lean. When
                the flag is off, the legacy header-button cluster renders.
                readOnly exception: the strip below is suppressed in readOnly
                (SettlementDetail's saved-dossier view), so keep the header
                buttons there or the free View Narrative/Raw toggle vanishes. */}
            {narrativeButtons}
          </div>
  );
}
