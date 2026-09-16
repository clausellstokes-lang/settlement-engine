/**
 * VersionsTab.jsx — version history.
 *
 * A worldbuilder running a 6-month arc wants to see what changed between
 * session 3 and session 8 — and roll back if a player retconned
 * themselves out of an event. The save's `campaignState` already tracks
 * `editedAt / canonizedAt / lastExportAt`; this tab surfaces them as a
 * timeline + offers revert.
 *
 * Snapshots live in `save.versionHistory: [{ id, ts, label, snapshot }]`
 * — appended automatically before every committed dossier change
 * (settlementPendingEdits commit checkpoint) and before every revert.
 * Reverting creates a *new* snapshot from the old state (never
 * destructive — the critique was explicit about that).
 *
 * HONESTY NOTE (Wave R-1, atlas queue #18 — now CLOSED by the BUILD).
 * R-1 found this tab's pitch selling two features that did not exist:
 * `recordSnapshot` was registered and armed but had no UI caller, and no
 * diff component existed. R-1 un-promised both rather than fake them. The
 * owner then ruled BUILD, and both now ship: the Take-a-snapshot control
 * below is `recordSnapshot`'s first user-facing caller, and VersionDiffView
 * (lazy leaf) is the side-by-side comparison. The pitch re-promises exactly
 * those two and nothing more.
 *
 * STILL FALSE, still unsold: canonize records NO snapshot (it stamps
 * `canonizedAt` and nothing else). tests/components/versionsTabPitchHonesty
 * holds that negative, and holds the two new promises positively, so the
 * copy and the shipped surface can never drift apart again in EITHER
 * direction.
 *
 * Cartographer-gated. Wanderer/Free users see a locked-state preview
 * with a Cartographer upgrade pitch.
 *
 * Self-gates on `versionHistory` flag. Wraps the existing campaignState
 * data — no schema migration needed.
 */

import { useState, useMemo, lazy, Suspense } from 'react';
import { useStore } from '../../store/index.js';
import { flag } from '../../lib/flags.js';
import { t } from '../../copy/index.js';
import { EVENTS } from '../../lib/analytics.js';
import LockedDestination from '../primitives/LockedDestination.jsx';
import { GOLD, INK, BODY, MUTED, BORDER, CARD, sans, serif_, FS, SP, swatch, EMPTY_VALUE } from '../theme.js';
import Button from '../primitives/Button.jsx';

const SLATE = swatch['#5A6E82'];
const GREEN = swatch['#4A7A3A'];
const AMBER = swatch['#D08020'];

// The comparison view is the only heavy thing this tab can reach: it pulls the
// whole settlement-comparison derivation stack (system state, causal state,
// capacity, daily life). Behind its own React.lazy seam so a reader who never
// compares never pays for it. Pinned by tests/build/versionDiffLazy.test.js.
const VersionDiffView = lazy(() => import('./VersionDiffView.jsx'));

/** Default label for a manual snapshot the user did not name. */
const DEFAULT_SNAPSHOT_LABEL = 'Manual snapshot';

function formatTs(ts) {
  if (!ts) return EMPTY_VALUE;
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
      // PAYLOAD SPELLING. `recordSnapshot` writes the frozen content under
      // `settlement` (settlementSlice.js); this builder only ever read
      // `snapshot`, so every REAL store-written entry arrived here with an
      // undefined payload. Nothing noticed while revert addressed snapshots by
      // id alone, but the comparison view reads the payload, so the two
      // spellings are reconciled here: the store's `settlement` first, the
      // legacy/fixture `snapshot` as fallback.
      const payload = v.settlement ?? v.snapshot;
      entries.push({
        id: v.id || `snap_${v.ts || ''}`,
        ts: v.ts,
        label: v.label || 'Snapshot',
        kind: 'snapshot',
        revertable: true,
        snapshot: payload,
        // Only an entry that actually carries content can be compared.
        comparable: payload != null,
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
  edit:     SLATE,
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
  const recordSnapshot = useStore(s => s.recordSnapshot);
  // 'premium' is the only paid tier value auth ever resolves (resolveTier maps
  // elevated roles to it too); Cartographer is the PLAN name, not a tier value.
  const isPaid = tier === 'premium';
  const [confirmRevert, setConfirmRevert] = useState(null);
  const [revertError, setRevertError] = useState(null);
  const [snapshotLabel, setSnapshotLabel] = useState('');
  const [snapshotError, setSnapshotError] = useState(null);
  // Ids of the snapshots picked for comparison, oldest pick first. Two is the
  // whole vocabulary: a third pick drops the oldest, so the control never needs
  // a "clear then start over" step.
  const [compareIds, setCompareIds] = useState([]);

  const entries = useMemo(() => buildVersionTimeline(save), [save]);

  // Resolve the picked ids against the CURRENT timeline every render: a snapshot
  // can leave the timeline while selected (the cap is 50, newest kept), and a
  // dangling id must degrade to "not comparing", never to a stale payload.
  const comparePair = useMemo(() => {
    const picked = compareIds
      .map(id => entries.find(e => e.id === id && e.comparable))
      .filter(Boolean);
    if (picked.length < 2) return null;
    const [a, b] = picked;
    const at = a.ts ? new Date(a.ts).getTime() : 0;
    const bt = b.ts ? new Date(b.ts).getTime() : 0;
    return at <= bt ? { earlier: a, later: b } : { earlier: b, later: a };
  }, [compareIds, entries]);

  // The snapshot lever writes onto the SAVED entry's timeline. With no save
  // there is no `save.versionHistory` for this tab to read back, so offering
  // the button would record into the draft sibling and show the user nothing.
  const canSnapshot = Boolean(save?.id);

  const toggleCompare = (entryId) => {
    setCompareIds(prev => (
      prev.includes(entryId)
        ? prev.filter(id => id !== entryId)
        : [...prev, entryId].slice(-2)
    ));
  };

  const handleSnapshot = () => {
    if (typeof recordSnapshot !== 'function') {
      setSnapshotError(t('errors.snapshotRecordUnavailable'));
      return;
    }
    const typed = snapshotLabel.trim();
    const result = recordSnapshot({
      saveId: save?.id || null,
      kind: 'manual',
      label: typed || DEFAULT_SNAPSHOT_LABEL,
    });
    if (!result?.ok) {
      setSnapshotError(t('errors.snapshotRecordFail'));
      return;
    }
    setSnapshotLabel('');
    setSnapshotError(null);
  };

  const handleRevert = (snapshotId) => {
    if (!snapshotId || typeof revertToSnapshot !== 'function') {
      setRevertError(t('errors.snapshotRestoreUnavailable'));
      return;
    }
    const ok = revertToSnapshot({ saveId: save?.id || null, snapshotId });
    if (!ok) {
      setRevertError(t('errors.snapshotRestoreFail'));
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
        body="Take a snapshot whenever you want, name it, and put any two of them side by side to see what changed. Auto-snapshot before every committed change and every revert, on a timeline with your canonize, export, and save milestones. Revert creates a new snapshot from the old state. Never destructive. The campaign-running worldbuilder's safety net."
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
      {snapshotError && (
        <div style={{ color: AMBER, fontSize: FS.xs, fontWeight: 700, marginBottom: SP.sm }}>
          {snapshotError}
        </div>
      )}

      {/* The manual snapshot lever. recordSnapshot has been registered and armed
          (undoToken revertToSnapshot) since Track K; this is its first
          user-facing caller. */}
      {canSnapshot ? (
        <div style={{
          display: 'flex', alignItems: 'center', gap: SP.xs, flexWrap: 'wrap',
          marginBottom: SP.md, paddingBottom: SP.sm,
          borderBottom: `1px solid ${BORDER}`,
        }}>
          <label
            htmlFor="version-snapshot-label"
            style={{
              display: 'flex', alignItems: 'center', gap: SP.xs,
              flex: '1 1 280px', fontSize: FS.xs, color: MUTED,
            }}
          >
            Name this moment (optional)
            <input
              id="version-snapshot-label"
              type="text"
              // The wrapping label carries the same words for sighted readers;
              // the explicit aria-label is the house idiom for a text input
              // (CatalogPicker) and is what the a11y lint reads.
              aria-label="Name this moment (optional)"
              value={snapshotLabel}
              maxLength={80}
              onChange={e => setSnapshotLabel(e.target.value)}
              placeholder={DEFAULT_SNAPSHOT_LABEL}
              style={{
                flex: 1, minWidth: 140,
                padding: '5px 8px',
                fontFamily: sans, fontSize: FS.sm, color: INK,
                background: CARD, border: `1px solid ${BORDER}`,
              }}
            />
          </label>
          <Button type="button" variant="secondary" size="sm" onClick={handleSnapshot}>
            Take a snapshot
          </Button>
        </div>
      ) : (
        <div style={{
          marginBottom: SP.md, fontSize: FS.xs, color: MUTED, fontStyle: 'italic',
        }}>
          Save this settlement to start taking snapshots of it.
        </div>
      )}

      {/* The comparison. Rendered above the timeline so the answer sits where
          the reader is looking after picking the second snapshot. */}
      {compareIds.length === 1 && (
        <div style={{ marginBottom: SP.sm, fontSize: FS.xs, color: MUTED }}>
          Pick a second snapshot to compare.
        </div>
      )}
      {comparePair && (
        <Suspense fallback={
          <div style={{ marginBottom: SP.md, fontSize: FS.xs, color: MUTED, fontStyle: 'italic' }}>
            Working out what changed.
          </div>
        }>
          <VersionDiffView
            earlier={comparePair.earlier}
            later={comparePair.later}
            onClose={() => setCompareIds([])}
          />
        </Suspense>
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
                      <div style={{ display: 'flex', gap: SP.xs, alignItems: 'center', flexWrap: 'wrap' }}>
                        <Button
                          type="button"
                          variant="secondary"
                          size="sm"
                          onClick={() => setConfirmRevert(e.id)}
                        >
                          Revert to this snapshot
                        </Button>
                        {e.comparable && (
                          <Button
                            type="button"
                            variant={compareIds.includes(e.id) ? 'primary' : 'ghost'}
                            size="sm"
                            aria-pressed={compareIds.includes(e.id)}
                            onClick={() => toggleCompare(e.id)}
                          >
                            {compareIds.includes(e.id) ? 'Comparing this' : 'Compare'}
                          </Button>
                        )}
                      </div>
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
