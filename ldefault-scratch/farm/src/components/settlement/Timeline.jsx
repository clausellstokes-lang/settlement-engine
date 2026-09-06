/**
 * Timeline — Event log view for canon-mode settlements.
 *
 * Renders eventLog as a vertical list, newest first. Each entry shows
 * the narrative summary, the deltas, the faction responses, and an
 * undo affordance for the newest reachable mechanical entry.
 *
 * Hidden in draft mode (no log to show).
 */

import { useState } from 'react';
import { Undo2 } from 'lucide-react';
import { useStore } from '../../store/index.js';
import { planTimelineUndo } from '../../store/settlementSliceHelpers.js';
import { t } from '../../copy/index.js';
import { GOLD, INK, MUTED, SECOND, BORDER, CARD, sans, FS, SP } from '../theme.js';
import Button from '../primitives/Button.jsx';

export default function Timeline() {
  const [undoError, setUndoError] = useState(null);
  const phase    = useStore(s => s.phase);
  const eventLog = useStore(s => s.eventLog);
  const undoLastEvent = useStore(s => s.undoLastEvent);
  // Campaign-clock (Phase C3): once this settlement is bound to a canonized
  // campaign world, its individual undo moves up to the world-map (pulse) level.
  const activeSaveId = useStore(s => s.activeSaveId);
  const clockBound = useStore(s =>
    typeof s.isSettlementClockBound === 'function' && s.isSettlementClockBound(activeSaveId));
  const undoPlan = planTimelineUndo(eventLog);
  const undoTargetIndex = undoPlan.ok ? undoPlan.targetIndex : -1;

  const handleUndo = () => {
    const result = undoLastEvent();
    if (result?.ok === false) {
      const reason = result.before?.reason;
      setUndoError(result.userMessage || (
        reason === 'entry_not_undoable'
          ? t('errors.timelineUndoBlocked')
          : t('errors.timelineUndoUnavailable')
      ));
      return;
    }
    setUndoError(null);
  };

  if (phase !== 'canon') return null;

  return (
    <div style={{
      background: CARD, border: `1px solid ${BORDER}`,
      padding: SP.sm, marginTop: SP.sm,
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 6,
        fontSize: FS.xs, fontWeight: 800, fontFamily: sans,
        color: MUTED, letterSpacing: '0.06em', textTransform: 'uppercase',
        marginBottom: SP.sm,
      }}>
        Campaign Timeline
        <span style={{ color: MUTED, opacity: 0.7, marginLeft: 6, textTransform: 'none', fontWeight: 400 }}>
          {eventLog.length === 0
            ? 'no events yet'
            : `${eventLog.length} entr${eventLog.length === 1 ? 'y' : 'ies'}`}
        </span>
      </div>

      {clockBound && (
        <div style={{
          fontSize: FS.xxs, color: MUTED, fontFamily: sans, fontStyle: 'italic',
          lineHeight: 1.5, marginBottom: SP.sm,
        }}>
          On the world-map clock. Events resolve together at each World Pulse, and
          undo lives at the map level (“Undo last advance”).
        </div>
      )}

      {undoError && (
        <div role="alert" style={{
          fontSize: FS.xxs, color: SECOND, fontFamily: sans,
          lineHeight: 1.5, marginBottom: SP.sm,
        }}>
          {undoError}
        </div>
      )}

      {eventLog.length === 0 ? (
        <div style={{
          fontSize: FS.xs, color: MUTED, fontFamily: sans, fontStyle: 'italic',
          padding: SP.sm, textAlign: 'center',
        }}>
          Apply an in-world event to start the campaign timeline. Founding history lives in the History tab.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: SP.xs }}>
          {[...eventLog].reverse().map((entry, i) => {
            const realIdx = eventLog.length - 1 - i;
            return (
              <Entry key={`${entry.appliedAt || entry.timestamp}-${i}`} entry={entry} canUndo={realIdx === undoTargetIndex && !clockBound} onUndo={handleUndo} />
            );
          })}
        </div>
      )}
    </div>
  );
}

function Entry({ entry, canUndo, onUndo }) {
  // Canonical applyEvent entries nest the event under `.event` and stamp
  // `appliedAt`; the library-row flavor entries written by renameSettlement /
  // destroySavedSettlement use a flat `timestamp` + flat `type` and carry no
  // `event` object. Fall back across both shapes so neither renders as
  // "Invalid Date" nor crashes on `entry.event.description`.
  const ts = new Date(entry.appliedAt || entry.timestamp);
  return (
    <div style={{
      padding: SP.sm,
      background: CARD,
      border: `1px solid ${BORDER}`,
    }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
        <span style={{
          fontSize: FS.xs, fontWeight: 700, color: INK, fontFamily: sans, flex: 1,
        }}>
          {entry.narrativeSummary || entry.event?.type || entry.type}
        </span>
        <span style={{ fontSize: FS.xxs, color: MUTED, fontFamily: sans }}>
          {ts.toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
        </span>
        {canUndo && (
          <Button
            variant="danger"
            size="sm"
            icon={<Undo2 size={10} />}
            onClick={onUndo}
            title="Undo this event and restore its prior state"
          >
            Undo
          </Button>
        )}
      </div>
      {entry.event?.description && (
        <div style={{ fontSize: FS.xxs, color: SECOND, fontFamily: sans, fontStyle: 'italic', marginTop: 2 }}>
          {entry.event.description}
        </div>
      )}
      {entry.deltas?.length > 0 && (
        <ul style={{ margin: '4px 0 0', paddingLeft: 16, fontSize: FS.xxs, fontFamily: sans, color: INK, lineHeight: 1.6 }}>
          {entry.deltas.slice(0, 4).map((d, i) => (
            <li key={i}>
              {d.explanation} <span style={{ color: MUTED }}>({d.before}→{d.after})</span>
            </li>
          ))}
        </ul>
      )}
      {entry.factionResponses?.length > 0 && (
        <div style={{ marginTop: 4, fontSize: FS.xxs, color: INK, fontFamily: sans, lineHeight: 1.5 }}>
          {entry.factionResponses.map((r, i) => (
            <div key={i}><strong style={{ color: GOLD }}>{r.factionName}</strong>: {r.response}</div>
          ))}
        </div>
      )}
    </div>
  );
}
