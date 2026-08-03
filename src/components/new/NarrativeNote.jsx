import { useState } from 'react';
import { FS, swatch } from '../theme.js';
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
      background: swatch['#FAF8F4'],
      border: `1px solid ${swatch['#C8B89A']}`,
      borderLeft: `3px solid ${swatch['#5A6E82']}`,
      overflow: 'hidden',
      fontFamily: sans,
    }}>
      {/* Header */}
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen(o => !o)}
        style={{
          width: '100%', display: 'flex', alignItems: 'center', gap: 8,
          padding: '7px 12px', background: 'none', border: 'none',
          cursor: 'pointer', textAlign: 'left',
        }}
      >
        <span style={{ fontSize: FS.xs, fontWeight: 800, color: swatch['#5A6E82'], textTransform: 'uppercase', letterSpacing: '0.07em', flex: 1 }}>
          Narrative Layer
        </span>
        <span style={{ fontSize: FS.xs, color: swatch['#5A6E82'] }}>{open ? '▲' : '▼'}</span>
      </button>

      {/* Body */}
      {open && (
        <div style={{ padding: '0 12px 10px', fontSize: FS['12.5'], color: swatch['#2D1F0E'], lineHeight: 1.65, fontFamily: 'Georgia, serif' }}>
          {note}
        </div>
      )}
    </div>
  );
}

export default NarrativeNote;
