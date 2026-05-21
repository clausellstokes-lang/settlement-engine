import { useState } from 'react';
import { sans } from './Primitives';

/**
 * NarrativeNote — per-tab addendum from the Narrative Refinement layer.
 * Shows a collapsible purple-accented card at the top of a tab.
 * Only renders when `note` is a non-empty string.
 *
 * The label drops "AI" deliberately. The settlement itself is simulated;
 * this is the optional refinement that turns the simulator's facts into
 * prose. Calling the card "AI" suggested the content was AI-generated
 * fiction, when in fact it's grounded paraphrasing of the simulator's
 * outputs.
 */
export function NarrativeNote({ note }) {
  const [open, setOpen] = useState(true);
  if (!note) return null;

  return (
    <div style={{
      marginBottom: 14,
      background: 'linear-gradient(135deg, rgba(74,26,122,0.05), rgba(106,42,154,0.03))',
      border: '1px solid rgba(138,80,176,0.25)',
      borderLeft: '3px solid #8a50b0',
      borderRadius: 7,
      overflow: 'hidden',
      fontFamily: sans,
    }}>
      {/* Header */}
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: '100%', display: 'flex', alignItems: 'center', gap: 8,
          padding: '7px 12px', background: 'none', border: 'none',
          cursor: 'pointer', textAlign: 'left',
        }}
      >
        <span style={{ fontSize: 11, color: '#8a50b0' }}>✦</span>
        <span style={{ fontSize: 9.5, fontWeight: 800, color: '#8a50b0', textTransform: 'uppercase', letterSpacing: '0.07em', flex: 1 }}>
          Narrative Layer
        </span>
        <span style={{ fontSize: 9.5, color: '#a070c0' }}>{open ? '▲' : '▼'}</span>
      </button>

      {/* Body */}
      {open && (
        <div style={{ padding: '0 12px 10px', fontSize: 12.5, color: '#2d1f0e', lineHeight: 1.65, fontFamily: 'Georgia, serif' }}>
          {note}
        </div>
      )}
    </div>
  );
}

export default NarrativeNote;
