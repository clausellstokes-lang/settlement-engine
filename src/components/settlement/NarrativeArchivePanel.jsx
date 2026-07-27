/**
 * NarrativeArchivePanel — the read side of the event-keyed narrative archive
 * (`aiData.eventNarrativeSnapshots`), Wave R-2, atlas A20 / VI.2 #39b.
 *
 * WHAT THE RECORD IS: when a canon event lands on a save that carries a
 * settlement narrative, both writers (the settlementSlice applyEvent tail and
 * canonEventCommandTransaction) stamp the narrative that stood BEFORE that
 * event into the save's durable aiData archive, keyed by the event's id —
 * same-eventId replacement, then FIFO-capped at the last 10 (the shared
 * appendEventNarrativeSnapshot helper). Until this panel the archive was
 * write-only: paid AI prose no surface read.
 *
 * READ-ONLY: a pure projection of the save row it is handed. No store access,
 * no operations, no persistence — so it needs no operationRegistry row.
 *
 * WHAT "the archived text" MEANS HERE: the snapshot's thesis — the house
 * convention for a narrative snapshot's readable through-line (lib/chronicle.js
 * summaryText = thesis; ChroniclePanel's EntryCard renders the same field).
 * The full pre-event narrative object is retained in the record; this reader
 * deliberately shows the through-line, not a re-render of every tab.
 *
 * RETENTION NOTE: the "holds only the last 10" sentence carries the R-1 cap
 * disclosure (staleNarrative.body, src/copy/en.js) to the reader surface, as
 * that copy block's comment promised. tests/components/narrativeArchivePanel
 * pins the sentence to the live MAX_EVENT_NARRATIVE_SNAPSHOTS constant.
 *
 * NO NATIVE TOOLTIP HERE (Wave R-3 ruling, vetoable): the entry heading first
 * shipped with a native `title` attribute holding the raw stamped eventId, which
 * tripped the shrink-only native-tooltip census in
 * tests/domain/guidanceRegistry.walker (488 vs a baseline of 487, and baselines
 * are never raised). NOTE: that census regex scans RAW source, comments
 * included, so this block deliberately never spells the attribute in its JSX
 * form — writing the example out would re-trip the very ratchet. The id was
 * not re-homed as visible text or as an aria-label, because a stamped eventId is
 * a machine key, never reader value: the canon lane mints `event:<ns>:<hash>`
 * (application/commands/adapters/canonEventApply.js off commandEnvelope.js) and
 * no surface in the product lets a reader look one up. Visible, it fails the
 * legibility law's regular-human test; as an aria-label it would REPLACE the
 * heading's accessible name ("Before: <event label>") with that hash, which is
 * an accessibility regression, not an improvement. The reader already has the
 * three things that identify a stamp — the event's human label, its absolute
 * timestamp, and the archived thesis. Machine addressability is preserved by
 * data-event-id (the house data-*-id idiom, e.g. data-hover-settlement-id),
 * which carries no accessible-name or hover semantics. Pinned below.
 *
 * SEAM (Wave R-2 JUDGMENT, vetoable): mounted in SettlementDetail's edit-mode
 * lifecycle cluster beside ChroniclePanel — the narrative-lineage log users
 * already read — on the same screen whose Make Changes flow fires
 * StaleNarrativeModal (the user-facing moment of the stamp).
 */

import { useState } from 'react';
import { BookOpen } from 'lucide-react';
import { FS, swatch } from '../theme.js';
import Button from '../primitives/Button.jsx';
import EmptyState from '../primitives/EmptyState.jsx';

const BORDER = swatch['#E0D0B0'];
const INK    = swatch['#1C1409'];
const MUTED  = swatch['#9C8068'];
const CARD   = swatch['#FFFBF5'];
const ACCENT = swatch['#5A6E82'];

// The cap sentence — one string, vetoable. "holds only the last 10" mirrors
// staleNarrative.body verbatim; the pin test couples the number to the live
// MAX_EVENT_NARRATIVE_SNAPSHOTS constant so neither can drift alone.
const RETENTION_NOTE =
  'Each entry is the settlement narrative as it stood before a canon event. The archive holds only the last 10; older stamps rotate out as new events land.';

const EMPTY_NOTE =
  'No archived versions yet. When a canon event lands while this save carries a settlement narrative, the version that stood before it is stamped here.';

function absoluteTime(iso) {
  if (!iso) return '';
  try { return new Date(iso).toLocaleString('en-US'); } catch (_) { return String(iso); }
}

function human(value) {
  return String(value || '').replace(/_/g, ' ');
}

/**
 * Resolve a stamped eventId to the human label of its canon-log entry.
 * Canonical applyEvent entries nest the event under `.event` (Timeline.jsx
 * reads the same shape); label preference mirrors the Timeline's:
 * narrativeSummary, else the event type translated out of snake_case. A
 * stamp whose event is no longer in the log (uncanonize wiped it, or the
 * command lane rotated) stays honest: a generic label, never a fabricated one.
 * @param {string} eventId
 * @param {Array<any>} eventLog
 * @returns {string}
 */
export function eventLabelFor(eventId, eventLog) {
  const rows = Array.isArray(eventLog) ? eventLog : [];
  const hit = rows.find((row) => String(row?.event?.id ?? row?.id ?? '') === String(eventId));
  if (!hit) return 'Canon event (no longer in the log)';
  return hit.narrativeSummary || human(hit.event?.type || hit.type) || 'Canon event';
}

/**
 * @param {{ save: any }} props  the saved-settlement row (aiData + campaignState).
 */
export default function NarrativeArchivePanel({ save }) {
  const [open, setOpen] = useState(false);
  const snapshots = Array.isArray(save?.aiData?.eventNarrativeSnapshots)
    ? save.aiData.eventNarrativeSnapshots
    : [];
  const eventLog = save?.campaignState?.eventLog;
  // Stored oldest → newest (append + FIFO tail-keep); read newest-first.
  const newestFirst = [...snapshots].reverse();

  return (
    <div data-testid="narrative-archive" style={{ border: `1px solid ${BORDER}`, overflow: 'hidden' }}>
      <Button
        variant="ghost"
        fullWidth
        aria-expanded={open}
        onClick={() => setOpen(v => !v)}
        style={{
          justifyContent: 'flex-start', gap: 8, padding: '10px 14px',
          background: open ? '#f5ede0' : CARD,
          borderColor: 'transparent', borderRadius: 0,
          borderBottom: open ? `1px solid ${BORDER}` : 'none',
          textAlign: 'left', whiteSpace: 'normal',
        }}
      >
        <BookOpen size={14} color={ACCENT} />
        <span style={{ fontFamily: 'Crimson Text, Georgia, serif', fontSize: FS['14'], fontWeight: 600, color: INK, flex: 1 }}>
          Narrative Archive {snapshots.length > 0 ? `(${snapshots.length})` : ''}
        </span>
        <span style={{ fontSize: FS.xxs, color: MUTED, fontFamily: 'Nunito, sans-serif' }}>
          what the prose said before each event
        </span>
        <span style={{ fontSize: FS.xs, color: MUTED }}>{open ? '▲' : '▼'}</span>
      </Button>

      {open && (
        <div style={{ padding: '12px 14px', background: swatch['#FAF8F4'], maxHeight: 420, overflowY: 'auto' }}>
          <p style={{ margin: '0 0 10px', fontSize: FS.xxs, color: MUTED, fontFamily: 'Nunito, sans-serif', lineHeight: 1.5 }}>
            {RETENTION_NOTE}
          </p>
          {newestFirst.length === 0 ? (
            <EmptyState heading="No archived versions yet." body={EMPTY_NOTE} />
          ) : (
            newestFirst.map((snap) => {
              const thesis = typeof snap?.aiSettlement?.thesis === 'string' && snap.aiSettlement.thesis
                ? snap.aiSettlement.thesis
                : '(no thesis captured)';
              return (
                <div
                  key={snap.eventId}
                  data-testid="narrative-archive-entry"
                  data-event-id={snap.eventId}
                  style={{
                    padding: '10px 12px',
                    background: CARD,
                    border: `1px solid ${BORDER}`,
                    borderLeft: `3px solid ${ACCENT}`,
                    marginBottom: 8,
                  }}
                >
                  <div
                    style={{ fontSize: FS.xxs, fontWeight: 800, color: ACCENT, textTransform: 'uppercase', letterSpacing: '0.06em', fontFamily: 'Nunito, sans-serif' }}
                  >
                    Before: {eventLabelFor(snap.eventId, eventLog)}
                  </div>
                  <div style={{ fontSize: FS['10.5'], color: MUTED, fontFamily: 'Nunito, sans-serif', marginTop: 2 }}>
                    {absoluteTime(snap.ts)}
                  </div>
                  <p style={{ margin: '6px 0 0', fontSize: FS.sm, color: INK, lineHeight: 1.55, fontFamily: 'Georgia, serif' }}>
                    {thesis}
                  </p>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
