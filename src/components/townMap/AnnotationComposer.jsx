/**
 * components/townMap/AnnotationComposer — SM-5 (5) the DM-marker placement popover.
 *
 * A small HTML popover anchored at the click point where the owner is placing a
 * marker: a label field + a DM-only / Player-visible audience toggle + Add / Cancel.
 * The audience is the export-visibility split (WYSIWYG law); it defaults to DM-only
 * (fail-closed). Theme tokens only; keyboard-friendly (Enter adds, Escape cancels).
 */
import { useCallback, useState } from 'react';
import Button from '../primitives/Button.jsx';
import Segmented from '../primitives/Segmented.jsx';
import { BORDER, BORDER_STRONG, CARD, ELEV, FS, INK, SP, sans } from '../theme.js';

/** Keep the popover on-screen near the anchor. */
function clampPos(x, y, w, h) {
  if (typeof window === 'undefined') return { left: x + 12, top: y + 12 };
  const vw = window.innerWidth || 1024;
  const vh = window.innerHeight || 768;
  return {
    left: Math.max(12, Math.min(x + 12, vw - w - 12)),
    top: Math.max(12, Math.min(y + 12, vh - h - 12)),
  };
}

/**
 * @param {{ composing: { x:number, y:number, screenX:number, screenY:number } | null,
 *   onAdd: (label: string, audience: 'dm'|'player') => void, onCancel: () => void }} props
 */
export default function AnnotationComposer({ composing, onAdd, onCancel }) {
  const [label, setLabel] = useState('');
  const [audience, setAudience] = useState('dm');
  // Focus on mount via a stable callback ref (the composer is keyed per placement,
  // so it remounts each time) — no autoFocus prop, no setState-in-effect.
  const focusRef = useCallback((el) => { el?.focus?.(); }, []);

  if (!composing) return null;
  const { left, top } = clampPos(composing.screenX, composing.screenY, 240, 132);
  const add = () => { const t = label.trim(); if (t) onAdd(t, /** @type {'dm'|'player'} */ (audience)); };

  return (
    <div
      data-town-annotation-composer
      role="dialog"
      aria-label="Place a map marker"
      style={{
        position: 'fixed', left, top, zIndex: 280, width: 240,
        display: 'flex', flexDirection: 'column', gap: SP.xs,
        padding: SP.sm, background: CARD, border: `1px solid ${BORDER_STRONG}`,
        boxShadow: ELEV[3], fontFamily: sans,
      }}
    >
      <input
        data-town-annotation-input
        ref={focusRef}
        value={label}
        onChange={(e) => setLabel(e.target.value)}
        onKeyDown={(e) => { if (e.key === 'Enter') add(); else if (e.key === 'Escape') onCancel(); }}
        placeholder="Marker note…"
        aria-label="Marker note"
        maxLength={80}
        style={{
          minHeight: 30, padding: '4px 8px', border: `1px solid ${BORDER}`,
          background: CARD, color: INK, fontSize: FS.sm, fontFamily: sans,
        }}
      />
      <Segmented
        size="sm"
        ariaLabel="Marker audience"
        value={audience}
        onChange={setAudience}
        options={[{ id: 'dm', label: 'DM only' }, { id: 'player', label: 'Players' }]}
      />
      <div style={{ display: 'flex', gap: SP.xs, justifyContent: 'flex-end' }}>
        <Button variant="ghost" size="sm" onClick={onCancel} aria-label="Cancel placing a marker"
          style={{ minHeight: 0, padding: '2px 8px' }}>
          Cancel
        </Button>
        <Button variant="primary" size="sm" onClick={add} disabled={!label.trim()}
          aria-label="Add this marker" style={{ minHeight: 0, padding: '2px 8px' }}>
          Add
        </Button>
      </div>
    </div>
  );
}
