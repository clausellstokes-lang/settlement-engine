/**
 * eventComposer/PreviewPanel.jsx — preview look-ahead for a single event,
 * extracted from EventComposer.jsx (behavior-preserving). Renders the
 * narrative summary, warnings, system deltas (DeltaRow) and faction
 * responses. DeltaRow is also reused by BatchCart, so it is exported.
 */

import { SP, CARD, GOLD, R, FS, sans, INK, MUTED, SECOND, swatch } from '../../theme.js';
import { PARTY, PARTY_BG } from './helpers.js';

export function PreviewPanel({ preview }) {
  if (!preview) return null;
  const { deltas, factionResponses, narrativeSummary, warnings } = preview;
  const partyCaused = !!(preview.event?.partyCaused || preview.event?.cause === 'party_action');
  return (
    <div style={{
      marginTop: SP.sm, padding: SP.sm,
      background: CARD, border: `1px solid ${GOLD}`, borderRadius: R.sm,
    }}>
      {partyCaused && (
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 4, marginBottom: 6,
          padding: '2px 8px', borderRadius: 999,
          background: PARTY_BG, color: PARTY, border: `1px solid ${PARTY}`,
          fontSize: FS.xxs, fontFamily: sans, fontWeight: 800, letterSpacing: '0.04em',
        }}>
          ⚔ Party-caused
        </div>
      )}
      <div style={{ fontSize: FS.sm, fontFamily: sans, color: INK, fontWeight: 700, marginBottom: 4 }}>
        {narrativeSummary || 'Preview'}
      </div>
      {warnings?.length > 0 && (
        <ul style={{ margin: '4px 0', paddingLeft: 18, color: swatch.danger, fontSize: FS.xs, fontFamily: sans }}>
          {warnings.map((w, i) => <li key={i}>{w.message}</li>)}
        </ul>
      )}
      {deltas?.length > 0 && (
        <div style={{ marginTop: 6 }}>
          {deltas.map((d, i) => <DeltaRow key={i} d={d} />)}
        </div>
      )}
      {factionResponses?.length > 0 && (
        <div style={{ marginTop: 8 }}>
          <div style={{
            fontSize: FS.xxs, color: MUTED, fontWeight: 800, fontFamily: sans,
            letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 4,
          }}>
            Faction responses
          </div>
          {factionResponses.map((r, i) => (
            <div key={i} style={{
              fontSize: FS.xs, fontFamily: sans, color: INK, lineHeight: 1.5, marginBottom: 4,
            }}>
              <strong style={{ color: GOLD }}>{r.factionName}:</strong> {r.response}
              {r.hookSeed && (
                <div style={{ color: SECOND, fontStyle: 'italic', marginTop: 2 }}>
                  Hook seed: {r.hookSeed}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function DeltaRow({ d }) {
  const arrow = d.change > 0 ? '↑' : '↓';
  const sevColor = d.severity === 'major' ? '#8b1a1a' : d.severity === 'moderate' ? '#a0762a' : MUTED;
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 6,
      fontSize: FS.xs, fontFamily: sans, color: INK, lineHeight: 1.5,
    }}>
      <span style={{ color: sevColor, fontWeight: 800, minWidth: 12 }}>{arrow}</span>
      <span>{d.explanation}</span>
      <span style={{ color: MUTED, marginLeft: 'auto' }}>
        {d.before} → {d.after}
      </span>
    </div>
  );
}
