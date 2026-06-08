/**
 * ChronicleTab.jsx — the settlement's living-history Chronicle (spec §8 M3c).
 *
 * Relocated under Notes (third sub-tab). One chronological feed of every event
 * affecting the settlement — manual changes, party-caused actions, and
 * world-pulse effects — newest first, each entry timed relative to campaign
 * canonization ("Day N", starting at zero) and tagged by source so it's clear
 * who drove it and which events are recent vs. earlier.
 *
 * The merge/normalize/classify/sort/relative-timing all live in the pure,
 * tested domain/dossier/chronicleFeed helper; this is presentation only.
 */
import { Section, Empty } from '../Primitives';
import { FS, swatch, MUTED } from '../../theme.js';

const PARTY = '#8a2f4a';
const PARTY_BG = '#f7ebf0';
const SRC_EDIT = '#7a5a2a';
const SRC_EDIT_BG = '#f5ecd8';
const ROW_BORDER = '#c8d0e8';

function chip(color, bg) {
  return { fontSize: FS.micro, color, background: bg, border: `1px solid ${color}`, borderRadius: 3, padding: '0 5px', fontWeight: 800 };
}

export default function ChronicleTab({ entries = [] }) {
  if (!entries.length) {
    return (
      <Empty message="No chronicle yet — manual changes, party actions, and world-pulse events will appear here as the settlement's living history, timed from canonization." />
    );
  }
  return (
    <div style={{ padding: '16px 18px' }}>
      <Section title={`Chronicle (${entries.length})`}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {entries.map((event, i) => {
            const accent = event.source === 'party' ? PARTY : event.source === 'manual' ? SRC_EDIT : swatch.info;
            return (
              <div key={event.id || i} style={{ border: `1px solid ${ROW_BORDER}`, borderLeft: `3px solid ${accent}`, borderRadius: 7, background: swatch['#F4F6FD'], padding: '10px 12px' }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, flexWrap: 'wrap', marginBottom: event.summary ? 4 : 0 }}>
                  {event.relativeLabel && (
                    <span style={{ fontSize: FS.micro, fontWeight: 800, color: MUTED, fontVariantNumeric: 'tabular-nums' }}>{event.relativeLabel}</span>
                  )}
                  <span style={{ fontSize: FS.xs, fontWeight: 800, color: accent, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    {String(event.title || 'Event').replace(/_/g, ' ')}
                  </span>
                  {event.partyCaused
                    ? <span title="Caused by the party" style={chip(PARTY, PARTY_BG)}>⚔ PARTY</span>
                    : event.source === 'manual'
                      ? <span title="A change you authored" style={chip(SRC_EDIT, SRC_EDIT_BG)}>EDIT</span>
                      : <span title="The world engine produced this" style={chip(swatch.info, swatch['#F4F6FD'])}>WORLD</span>}
                </div>
                {event.summary && <p style={{ fontSize: FS.sm, color: swatch.inkMag2, lineHeight: 1.5, margin: 0 }}>{event.summary}</p>}
              </div>
            );
          })}
        </div>
      </Section>
    </div>
  );
}
