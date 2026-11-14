/**
 * TableView.jsx — P142 / D-6 phone-optimized "at the table" view.
 *
 * A ~380px single-column takeover for running a settlement live during a
 * session. Where the dossier is the wide read-at-home surface, this is the
 * glance-at-your-phone surface, and its body is THE ONE TONIGHT SHEET (X-51):
 * the active crisis, the people to voice, the two facts the players test first,
 * and the hooks (components/TonightSheet.jsx over composeTonightSheet). The old
 * Quick Guide and "Tonight at the table" no longer print here.
 *
 * Presentational + a close affordance:
 *   props.settlement — the settlement to run (raw or AI-refined; caller picks)
 *   props.onClose    — () => dismiss the overlay
 *
 * Esc and backdrop-click both close. Self-gating (flag + the tableViewOpen
 * pref) is the caller's job — OutputContainer only mounts this when
 * flag('tableView') && userPrefs.tableViewOpen, so this component renders
 * unconditionally when present.
 */

import { useEffect, useMemo } from 'react';
import { FS, swatch } from './theme.js';
import { formatCount } from '../domain/formatNumber.js';
import { prosperityLabel } from '../domain/summary/tonightAtTheTable.js';
import { prosperityInCrisisLine } from '../domain/display/prosperityInCrisis.js';
import { composeTonightSheet, TONIGHT_COPY } from '../domain/summary/tonightSheet.js';
import TonightSheet from './TonightSheet.jsx';
import EconomyFreshnessNote from './new/EconomyFreshnessNote.jsx';
import { FIELD_INK } from '../design/organic/ink.js';
import { LAMP_ACCENTS } from '../design/organic/lampTones.js';
import DialogClose from './primitives/DialogClose.jsx';
import { useDialogFocusTrap } from './primitives/useDialogFocusTrap.js';
import useIsMobile from '../hooks/useIsMobile.js';
import { chromeFontSize } from '../design/proseScale.js';

// THE LANTERN TABLE (C14) — the desk by night (reference plate 04): a warm umber
// ground, cream ink, the four cheat-sheet kinds lit as lamp tones. The header
// stays the dark ink band it already was; the body drops from parchment to the
// field-notebook (dim) ramp so the whole surface reads as one pool of lamplight.
const GOLD_ACCENT = swatch['#C9A24C']; // header title on the dark ink band
const INK = swatch['#1B1408'];         // header gradient — deepest ink
const INK_DEEP = swatch['#2C2210'];    // header gradient — second stop
const MUTED = swatch['#9C8068'];       // header subtitle on the dark band

// The dim/field ramp (contrast-proven in tests/design/contrast.test.js).
const UMBER_DESK = FIELD_INK.ground;   // #211B12 — the night desk (panel ground)
const UMBER_CARD = FIELD_INK.panel;    // #2C2416 — a lifted plate on the desk (the umber)
const CREAM = FIELD_INK.ink;           // #ECE0C6 — primary ink in field mode
const CREAM_BODY = FIELD_INK.body;     // #D8C8A8 — body copy in field mode
const CREAM_FAINT = FIELD_INK.faint;   // #9C8C6E — faint labels (AA on the panel)
const FIELD_RULE = FIELD_INK.hairline; // #5A4E38 — the feint rule tone on the dark ground

const serif = '"Crimson Text", Georgia, serif';
const sans = '"Nunito", system-ui, sans-serif';

// The lantern table's palette for the one Tonight sheet: cream ink on the umber desk, the
// lamp tones for the crisis (ember) and the section eyebrows (gold).
const NIGHT_PALETTE = Object.freeze({
  ink: CREAM, body: CREAM_BODY, faint: CREAM_FAINT, rule: FIELD_RULE, card: UMBER_CARD,
  alarm: LAMP_ACCENTS.RED, accent: LAMP_ACCENTS.HOOK,
});

export default function TableView({ settlement, onClose }) {
  // Shared modal focus management (M12): focus-in on open, Tab/Shift+Tab cycling
  // trapped inside the panel, Escape-to-close, and focus restore on unmount.
  // Replaces the hand-rolled Escape-only listener — a full-screen aria-modal
  // dialog with no trap leaked keyboard focus to the obscured app behind it.
  const dialogRef = useDialogFocusTrap(true, onClose);
  // THE PHONE PROSE FLOOR — this is the glance-at-your-phone surface; the Tonight
  // sheet's reading text takes the floor below the breakpoint (TonightSheet.jsx),
  // and the header strip keeps its own glance steps. On a desktop the 380px
  // column is unchanged.
  const mobile = useIsMobile();

  // FIELD MODE wake lock (Organic Craft law §7 — the cook-mode pattern): while
  // the at-table view is open the screen stays awake, where supported. The lock
  // is auto-released by the platform when the tab hides; we re-acquire on
  // visibilitychange so returning mid-session keeps the table lit. Fails silent
  // (older Safari): the surface works identically without it. Interruption
  // persistence is already the caller's tableViewOpen pref (the store idiom).
  useEffect(() => {
    let lock = null;
    let disposed = false;
    const acquire = async () => {
      try {
        if (!disposed && document.visibilityState === 'visible') {
          lock = await navigator.wakeLock?.request?.('screen');
        }
      } catch { /* unsupported or denied — the view works without it */ }
    };
    const onVis = () => { if (document.visibilityState === 'visible') acquire(); };
    acquire();
    document.addEventListener('visibilitychange', onVis);
    return () => {
      disposed = true;
      document.removeEventListener('visibilitychange', onVis);
      try { lock?.release?.(); } catch { /* already released */ }
    };
  }, []);

  const sheet = useMemo(() => composeTonightSheet(settlement), [settlement]);
  // components-dossier-library-3: prosperity is a STRING label, not a { tier }
  // object — the tolerant read is the SummaryTabV2 sibling.
  const prosperity = prosperityLabel(settlement?.economicState?.prosperity);
  // The header's label, where a crisis in force lowered it, says what the place is in ordinary years
  // (the chair's ruling 1(a), REVIEW-UPKEEP-2): the one sentence, at the head of the body.
  const prosperityInCrisis = prosperityInCrisisLine(settlement);

  return (
    // Backdrop: a presentational scrim that dismisses only on a click of the
    // scrim itself (currentTarget), the shared modal idiom. Escape + focus
    // management live in the panel's useDialogFocusTrap.
    <div
      role="presentation"
      onMouseDown={(e) => { if (e.target === e.currentTarget) onClose?.(); }}
      style={{
        position: 'fixed', inset: 0, zIndex: 1100,
        background: 'rgba(12,8,4,0.72)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 12,
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={`${TONIGHT_COPY.title}: ${settlement?.name || 'settlement'}`}
        tabIndex={-1}
        style={{
          width: '100%', maxWidth: 380,
          height: '100%', maxHeight: 760,
          background: UMBER_DESK,
          border: `1px solid ${FIELD_RULE}`,
          overflow: 'hidden',
          display: 'flex', flexDirection: 'column',
          fontFamily: sans,
        }}
      >
        {/* Sticky header */}
        <header style={{
          flexShrink: 0,
          padding: '14px 16px',
          background: `linear-gradient(135deg, ${INK} 0%, ${INK_DEEP} 100%)`,
          display: 'flex', alignItems: 'flex-start', gap: 10,
        }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <h1 style={{
              margin: 0,
              fontFamily: serif, fontWeight: 600, fontSize: FS.xxl,
              color: GOLD_ACCENT, lineHeight: 1.12,
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            }}>
              {settlement?.name || 'Untitled settlement'}
            </h1>
            <div style={{
              marginTop: 3, fontSize: chromeFontSize(FS.xxs, mobile), color: MUTED, letterSpacing: '0.04em',
            }}>
              {String(settlement?.tier || 'SETTLEMENT').toUpperCase()}
              {settlement?.population != null && (
                <> · {formatCount(settlement.population)} pop</>
              )}
              {prosperity && <> · {String(prosperity).toUpperCase()}</>}
            </div>
          </div>
          <div style={{ flexShrink: 0 }}>
            {/* THE HOUSE DOOR (ODQ §934.31): the one close primitive, named "Close Tonight" as before. */}
            <DialogClose onClose={onClose} subject={TONIGHT_COPY.title} />
          </div>
        </header>

        {/* Scrollable body */}
        <div style={{
          flex: 1, minHeight: 0, overflowY: 'auto',
          WebkitOverflowScrolling: 'touch',
          padding: '14px 16px',
          display: 'flex', flexDirection: 'column', gap: 14,
        }}>
          {prosperityInCrisis && (
            <p data-testid="tableview-prosperity-in-crisis" style={{ margin: 0, fontSize: FS.sm, color: CREAM_BODY, fontStyle: 'italic', lineHeight: 1.45 }}>
              {prosperityInCrisis}
            </p>
          )}
          <TonightSheet sheet={sheet} palette={NIGHT_PALETTE} />
          {/* ECONOMY FRESHNESS (Wave R-4) — the header's prosperity label and the sheet's food
              fact are generation-time reads of the economy; neither is re-derived when an event
              lands, so the shared note qualifies them here. CREAM_FAINT, not the parchment MUTED:
              this is the lantern-table dark ramp. Conditional, so an un-shifted settlement renders
              byte-identically. */}
          <EconomyFreshnessNote
            settlement={settlement}
            variant="tallies"
            margin="0"
            color={CREAM_FAINT}
          />

          <div style={{
            marginTop: 'auto', paddingTop: 6,
            fontSize: chromeFontSize(FS.xxs, mobile), color: CREAM_FAINT, textAlign: 'center', fontStyle: 'italic',
          }}>
            Tap outside or press Esc to close
          </div>
        </div>
      </div>
    </div>
  );
}
