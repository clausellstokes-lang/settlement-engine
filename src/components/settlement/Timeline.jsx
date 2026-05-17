/**
 * Timeline — Event log view for canon-mode settlements.
 *
 * Renders eventLog as a vertical list, newest first. Each entry shows
 * the narrative summary, the deltas, the faction responses, and an
 * undo affordance for the most recent entry.
 *
 * Hidden in draft mode (no log to show).
 */

import React from 'react';
import { Clock, Undo2, ChevronRight } from 'lucide-react';
import { useStore } from '../../store/index.js';
import { GOLD, INK, MUTED, SECOND, BORDER, CARD, sans, FS, SP, R } from '../theme.js';

export default function Timeline() {
  const phase    = useStore(s => s.phase);
  const eventLog = useStore(s => s.eventLog);
  const undoLastEvent = useStore(s => s.undoLastEvent);

  if (phase !== 'canon') return null;

  return (
    <div style={{
      background: CARD, border: `1px solid ${BORDER}`, borderRadius: R.md,
      padding: SP.sm, marginTop: SP.sm,
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 6,
        fontSize: FS.xs, fontWeight: 800, fontFamily: sans,
        color: MUTED, letterSpacing: '0.06em', textTransform: 'uppercase',
        marginBottom: SP.sm,
      }}>
        <Clock size={12} />
        Timeline
        <span style={{ color: MUTED, opacity: 0.7, marginLeft: 6, textTransform: 'none', fontWeight: 400 }}>
          {eventLog.length === 0
            ? 'no events yet'
            : `${eventLog.length} entr${eventLog.length === 1 ? 'y' : 'ies'}`}
        </span>
      </div>

      {eventLog.length === 0 ? (
        <div style={{
          fontSize: FS.xs, color: MUTED, fontFamily: sans, fontStyle: 'italic',
          padding: SP.sm, textAlign: 'center',
        }}>
          Apply an in-world event to start the timeline.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: SP.xs }}>
          {[...eventLog].reverse().map((entry, i) => {
            const realIdx = eventLog.length - 1 - i;
            const isLatest = realIdx === eventLog.length - 1;
            return (
              <Entry key={`${entry.appliedAt}-${i}`} entry={entry} isLatest={isLatest} onUndo={undoLastEvent} />
            );
          })}
        </div>
      )}
    </div>
  );
}

function Entry({ entry, isLatest, onUndo }) {
  const ts = new Date(entry.appliedAt);
  return (
    <div style={{
      padding: SP.sm,
      background: '#fffbf5',
      border: `1px solid ${BORDER}`, borderRadius: R.sm,
    }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
        <span style={{
          fontSize: FS.xs, fontWeight: 700, color: INK, fontFamily: sans, flex: 1,
        }}>
          {entry.narrativeSummary || entry.event.type}
        </span>
        <span style={{ fontSize: FS.xxs, color: MUTED, fontFamily: sans }}>
          {ts.toLocaleString(undefined, { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
        </span>
        {isLatest && (
          <button
            onClick={onUndo}
            title="Undo this event — restores prior state"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 3,
              padding: '2px 6px',
              background: '#fff', color: '#8b1a1a',
              border: `1px solid #c89a9a`, borderRadius: R.sm,
              fontSize: FS.xxs, fontFamily: sans, fontWeight: 700, cursor: 'pointer',
            }}
          >
            <Undo2 size={10} /> Undo
          </button>
        )}
      </div>
      {entry.event.description && (
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
            <div key={i}><ChevronRight size={9} /> <strong style={{ color: GOLD }}>{r.factionName}</strong>: {r.response}</div>
          ))}
        </div>
      )}
    </div>
  );
}
