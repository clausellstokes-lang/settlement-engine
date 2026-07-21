/**
 * UndoHistoryPanel — the visible face of the campaign's advance-undo history.
 *
 * The engine already keeps a byte-exact, session-scoped stack of pre-advance
 * snapshots (store `pulseUndoStack`; the toolbar's "Undo Advance" chip pops the
 * top). This panel SURFACES that stack as a readable list and lets the DM walk
 * back to any point through the EXISTING undo path — it builds NO new undo
 * machinery. "Return here" on the k-th row (0 = most recent) simply calls the
 * existing `undoLastPulse` (k + 1) times, which IS the documented multi-step
 * walk-back: each call pops one snapshot and restores its world.
 *
 * SECRETS-SAFE: each snapshot deep-clones the full pre-pulse worldState, which
 * carries covert marks (conspiracies, foreign assets, corruption). The rows
 * therefore read ONLY the non-covert scalars — the calendar date it returns to,
 * the interval one undo reverts, and the capture time — and NEVER summarize what
 * changed from the snapshot body. No covert field is read here.
 *
 * Session-scoped + in-memory: a reload clears the stack, so an empty panel after
 * a reload is correct (the empty copy says so), not a lost history.
 */
import { useState } from 'react';
import { X } from 'lucide-react';
import { useStore } from '../store/index.js';
import { useDialogFocusTrap } from './primitives/useDialogFocusTrap.js';
import IconButton from './primitives/IconButton.jsx';
import Button from './primitives/Button.jsx';
import EmptyState from './primitives/EmptyState.jsx';
import { GOLD, INK, INK_DEEP, BODY, MUTED, BORDER, CARD, sans, serif_, FS, SP } from './theme.js';

// The human name of what a single undo reverts. Mirrors the toolbar's chip copy
// so the two affordances agree; an absent/single-tick interval reads generically.
const INTERVAL_LABEL = Object.freeze({
  one_week: 'a week', one_month: 'a month', one_season: 'a season', one_year: 'a year',
});

// A calm, session-relative capture time. Wall-clock display only (never engine
// state), so it is deliberately outside determinism's scope.
function ago(iso) {
  const then = Date.parse(iso);
  if (!Number.isFinite(then)) return '';
  const secs = Math.max(0, Math.round((Date.now() - then) / 1000));
  if (secs < 45) return 'moments ago';
  const mins = Math.round(secs / 60);
  if (mins < 60) return `${mins} minute${mins === 1 ? '' : 's'} ago`;
  const hrs = Math.round(mins / 60);
  return `${hrs} hour${hrs === 1 ? '' : 's'} ago`;
}

// The non-covert return-point label: the calendar date the snapshot returns to,
// falling back to the raw tick. Reads calendar scalars only — never the body.
function pointLabel(entry) {
  const cal = entry?.worldState?.calendar;
  const year = cal?.year;
  if (year != null) {
    const season = typeof cal?.season === 'string' ? cal.season : null;
    return season ? `Year ${year}, ${season}` : `Year ${year}`;
  }
  return `Tick ${entry?.tick ?? 0}`;
}

export default function UndoHistoryPanel({ campaignId, onClose }) {
  const dialogRef = useDialogFocusTrap(true, onClose);
  const stack = useStore((s) => s.pulseUndoStack);
  const undoLastPulse = useStore((s) => s.undoLastPulse);
  const [busy, setBusy] = useState(false);

  // The campaign's own snapshots, oldest→newest in the stack; displayed most
  // recent first. Row index k therefore needs (k + 1) pops to return to it.
  const mine = (stack || []).filter((e) => e && e.campaignId === campaignId);
  const rows = mine.slice().reverse();

  const restoreTo = async (k) => {
    if (busy) return;
    setBusy(true);
    try {
      for (let i = 0; i <= k; i += 1) {
        // The EXISTING mechanism: pops one snapshot, restores its world. Refuses
        // mid-advance (returns false) — stop the walk-back if it does.
        const ok = await undoLastPulse(campaignId);
        if (!ok) break;
      }
    } finally {
      setBusy(false);
      onClose?.();
    }
  };

  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions -- backdrop click-to-close; Escape handled by useDialogFocusTrap.
    <div
      onClick={onClose}
      className="oc-m-warmdim"
      style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
    >
      {/* Clicks stop here so the backdrop's click-to-close never fires from inside
          the plate. Keydown deliberately does NOT stop (SB5, WCAG 2.1.2 — same
          root cause the palette fixed in wave 4): the shared focus trap (Escape +
          Tab cycling) listens on window, so a blanket keydown stopPropagation
          silently disabled Escape-close and Tab containment for this dialog. */}
      {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions, jsx-a11y/click-events-have-key-events -- the onClick is a propagation fence for the backdrop, not an interaction; keyboard behavior lives in the window-level trap. */}
      <div
        ref={dialogRef}
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="undo-history-title"
        style={{
          background: CARD, border: `1px solid ${BORDER}`,
          width: '90%', maxWidth: 460, maxHeight: '84vh',
          display: 'flex', flexDirection: 'column',
        }}
      >
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: `${SP.md}px ${SP.lg}px`,
          background: `linear-gradient(to right, ${INK}, ${INK_DEEP})`, color: GOLD,
        }}>
          <h2 id="undo-history-title" style={{ margin: 0, fontSize: FS.lg, fontFamily: serif_, fontWeight: 600 }}>
            Advance history
          </h2>
          <IconButton Icon={X} label="Close advance history" onClick={onClose} tone="ghost" size="lg" />
        </div>

        <div style={{ padding: SP.md, overflowY: 'auto' }}>
          {rows.length === 0 ? (
            <EmptyState
              heading="No advances to undo yet."
              body="Advance the realm and each step is kept here for the session, so you can return to any point before it. A page reload makes the advances permanent."
            />
          ) : (
            <>
              <p style={{ margin: `0 0 ${SP.sm}px`, color: MUTED, fontFamily: sans, fontSize: FS.xs, lineHeight: 1.5 }}>
                Return the realm to any point below. Later advances are undone with it. Kept for this session only.
              </p>
              <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column' }}>
                {rows.map((entry, k) => (
                  <li
                    key={`${entry.tick}-${entry.now}-${k}`}
                    style={{
                      display: 'flex', alignItems: 'center', gap: SP.sm,
                      padding: `${SP.sm}px 0`,
                      borderTop: k === 0 ? 'none' : `1px solid ${BORDER}`,
                    }}
                  >
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ color: INK, fontFamily: sans, fontSize: FS.sm, fontWeight: 800 }}>
                        {pointLabel(entry)}
                      </div>
                      <div style={{ color: BODY, fontFamily: sans, fontSize: FS.xs, lineHeight: 1.5 }}>
                        Undoes {INTERVAL_LABEL[entry.interval] || 'one advance'}
                        {entry.now ? ` · captured ${ago(entry.now)}` : ''}
                      </div>
                    </div>
                    <Button variant="gold" size="sm" disabled={busy} onClick={() => restoreTo(k)}>
                      Return here
                    </Button>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
