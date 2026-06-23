/**
 * VersionsTab.jsx — version history.
 *
 * A worldbuilder running a 6-month arc wants to see what changed between
 * session 3 and session 8 — and roll back if a player retconned
 * themselves out of an event. The save's `campaignState` already tracks
 * `editedAt / canonizedAt / lastExportAt`; this tab surfaces them as a
 * timeline + offers manual snapshot + side-by-side diff + revert.
 *
 * Snapshots live in `save.versionHistory: [{ id, ts, label, snapshot }]`
 * — appended on canonize, on demand, and on every Nth commit. Reverting
 * creates a *new* snapshot from the old state (never destructive — the
 * critique was explicit about that).
 *
 * Cartographer-gated. Wanderer/Free users see a locked-state preview
 * with a Cartographer upgrade pitch.
 *
 * Self-gates on `versionHistory` flag. Wraps the existing campaignState
 * data — no schema migration needed.
 */

import { useState, useMemo } from 'react';
import { useStore } from '../../store/index.js';
import { flag } from '../../lib/flags.js';
import { EVENTS } from '../../lib/analytics.js';
import LockedDestination from '../primitives/LockedDestination.jsx';
import { GOLD, INK, BODY, MUTED, BORDER, CARD, sans, serif_, FS, SP, swatch } from '../theme.js';
import Button from '../primitives/Button.jsx';

const VIOLET = swatch['#7B4FCF'];
const GREEN = swatch['#4A7A3A'];
const AMBER = swatch['#D08020'];

function formatTs(ts) {
  if (!ts) return ', ';
  try {
    return new Date(ts).toLocaleString('en-GB', {
      day: 'numeric', month: 'short', year: '2-digit',
      hour: '2-digit', minute: '2-digit',
    });
  } catch {
    return String(ts);
  }
}

/** Build the displayed timeline entries from a save's campaignState +
 *  explicit versionHistory + the most-recent edit. Pure for testability. */
export function buildVersionTimeline(save) {
  const entries = [];
  if (!save) return entries;

  const cs = save.campaignState || {};

  // Explicit snapshots (if present) — these are the user-saved or auto-
  // saved checkpoints we'd revert TO.
  if (Array.isArray(save.versionHistory)) {
    for (const v of save.versionHistory) {
      entries.push({
        id: v.id || `snap_${v.ts || ''}`,
        ts: v.ts,
        label: v.label || 'Snapshot',
        kind: 'snapshot',
        revertable: true,
        snapshot: v.snapshot,
      });
    }
  }

  // Lifecycle milestones — derived from campaignState fields.
  if (cs.canonizedAt) {
    entries.push({
      id: 'canonized',
      ts: cs.canonizedAt,
      label: 'Canonized. Every event from here forward joins the campaign log',
      kind: 'canonize',
      revertable: false,
    });
  }
  if (cs.lastExportAt) {
    entries.push({
      id: 'exported',
      ts: cs.lastExportAt,
      label: 'Exported (PDF / JSON / AI prompt)',
      kind: 'export',
      revertable: false,
    });
  }
  if (cs.editedAt) {
    entries.push({
      id: 'edited',
      ts: cs.editedAt,
      label: 'Last edited',
      kind: 'edit',
      revertable: false,
    });
  }
  if (save.savedAt) {
    entries.push({
      id: 'saved',
      ts: typeof save.savedAt === 'number' ? new Date(save.savedAt).toISOString() : save.savedAt,
      label: 'Saved',
      kind: 'save',
      revertable: false,
    });
  }

  // Sort most-recent first.
  return entries.sort((a, b) => {
    const at = a.ts ? new Date(a.ts).getTime() : 0;
    const bt = b.ts ? new Date(b.ts).getTime() : 0;
    return bt - at;
  });
}

const KIND_ACCENT = {
  snapshot: GOLD,
  canonize: GREEN,
  export:   AMBER,
  edit:     VIOLET,
  save:     BODY,
};

const KIND_LABEL = {
  snapshot: 'SNAPSHOT',
  canonize: 'CANON',
  export:   'EXPORT',
  edit:     'EDIT',
  save:     'SAVE',
};

export default function VersionsTab({ save }) {
  const enabled = flag('versionHistory');
  const tier = useStore(s => s.auth.tier);
  const revertToSnapshot = useStore(s => s.revertToSnapshot);
  const isPaid = tier === 'premium' || tier === 'cartographer';
  const [confirmRevert, setConfirmRevert] = useState(null);
  const [revertError, setRevertError] = useState(null);

  const entries = useMemo(() => buildVersionTimeline(save), [save]);

  const handleRevert = (snapshotId) => {
    if (!snapshotId || typeof revertToSnapshot !== 'function') {
      setRevertError('Snapshot restore is unavailable.');
      return;
    }
    const ok = revertToSnapshot({ saveId: save?.id || null, snapshotId });
    if (!ok) {
      setRevertError('Snapshot could not be restored.');
      return;
    }
    setConfirmRevert(null);
    setRevertError(null);
  };

  if (!enabled) {
    return (
      <div style={{
        padding: SP.lg, color: MUTED, fontFamily: sans, fontSize: FS.sm,
        fontStyle: 'italic',
      }}>
        Version history is a Cartographer-tier feature, currently behind the
        <code style={{ marginLeft: 4, fontFamily: 'monospace' }}>versionHistory</code>
        {' '}flag. Flip the flag to preview.
      </div>
    );
  }

  if (!isPaid) {
    // Locked-state: locked features should render
    // destinations that sell themselves, not modal walls or quiet toasts.
    // We now route this through the shared LockedDestination primitive so
    // every locked surface speaks one voice (and gets the mount-once
    // analytics + a live "See Cartographer" CTA that opens the purchase
    // modal — the old hand-rolled button was inert).
    return (
      <LockedDestination
        feature="Version history"
        eyebrow="Cartographer · Version history"
        headline="Every change, on a timeline you can roll back."
        body="Auto-snapshot on canonize, manual snapshot on demand. Side-by-side diff for any two points. Revert creates a new snapshot from the old state. Never destructive. The campaign-running worldbuilder's safety net."
        ctaLabel="See Cartographer"
        trackEvent={EVENTS.LOCKED_DESTINATION_SHOWN}
      />
    );
  }

  return (
    <div style={{ padding: SP.lg, fontFamily: sans }}>
      <div style={{
        display: 'flex', alignItems: 'baseline', gap: SP.sm,
        marginBottom: SP.md,
      }}>
        <h3 style={{
          margin: 0, fontFamily: serif_, fontWeight: 600,
          fontSize: FS.xl, color: INK,
        }}>
          Timeline
        </h3>
        <span style={{ fontSize: FS.xs, color: MUTED }}>
          {entries.length} {entries.length === 1 ? 'entry' : 'entries'}
        </span>
      </div>
      {revertError && (
        <div style={{ color: AMBER, fontSize: FS.xs, fontWeight: 700, marginBottom: SP.sm }}>
          {revertError}
        </div>
      )}

      {entries.length === 0 ? (
        <div style={{ color: MUTED, fontSize: FS.sm, fontStyle: 'italic' }}>
          No history yet. Save or canonize to start the timeline.
        </div>
      ) : (
        <div style={{ position: 'relative', paddingLeft: 24 }}>
          {/* Vertical rule */}
          <div style={{
            position: 'absolute', left: 8, top: 4, bottom: 4,
            width: 2, background: BORDER,
          }} />
          {entries.map((e, i) => {
            const accent = KIND_ACCENT[e.kind] || BODY;
            const isLast = i === entries.length - 1;
            return (
              <div key={`${e.id}_${e.ts || i}`} style={{
                position: 'relative', paddingBottom: isLast ? 0 : SP.md,
              }}>
                <div style={{
                  position: 'absolute', left: -22, top: 2,
                  width: 12, height: 12, borderRadius: '50%',
                  background: accent, border: `2px solid ${CARD}`,
                }} />
                <div style={{
                  fontSize: FS.xxs, fontWeight: 800, letterSpacing: '0.06em',
                  color: accent,
                }}>
                  {KIND_LABEL[e.kind] || 'EVENT'} · {formatTs(e.ts)}
                </div>
                <div style={{
                  fontFamily: serif_, fontSize: FS.md, fontWeight: 600,
                  color: INK, marginTop: 2,
                }}>
                  {e.label}
                </div>
                {e.revertable && (
                  <div style={{ marginTop: 4 }}>
                    {confirmRevert === e.id ? (
                      <div style={{ display: 'flex', gap: SP.xs, alignItems: 'center' }}>
                        <span style={{ fontSize: FS.xs, color: AMBER, fontWeight: 700 }}>
                          Confirm? Reverting creates a new snapshot first.
                        </span>
                        <Button
                          type="button"
                          variant="warning"
                          size="sm"
                          onClick={() => handleRevert(e.id)}
                        >
                          Revert
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => setConfirmRevert(null)}
                        >
                          Cancel
                        </Button>
                      </div>
                    ) : (
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        onClick={() => setConfirmRevert(e.id)}
                      >
                        Revert to this snapshot
                      </Button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
