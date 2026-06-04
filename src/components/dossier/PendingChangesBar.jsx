/**
 * PendingChangesBar.jsx — P106 / E-2 pending-changes floating drawer.
 *
 * Renders below the dossier title whenever the store has unapplied
 * edits in `pendingEditsQueue`. Lists count + categories, with three
 * actions:
 *   - Preview cascade → opens the side panel showing structured deltas
 *   - Commit          → flushes the queue against the live settlement
 *   - Revert          → drops the queue (no changes applied)
 *
 * Self-gates inside on `flag('inlineEdit')` and `hasPending(queue)`.
 *
 * Visual: amber-accented banner-card, full-width inside dossier
 * gutter, max ~48px tall. Matches the EditorInline mockup from the
 * Editing & Map canvas.
 */

import { useState } from 'react';
import { useStore } from '../../store/index.js';
import { flag } from '../../lib/flags.js';
import { hasPending, activeEdits } from '../../domain/pendingEdits.js';
import { Funnel, EVENTS } from '../../lib/analytics.js';
import { sans, FS, SP, R, swatch, GOLD_DEEP, MUTED } from '../theme.js';
import CascadePreviewPanel from './CascadePreviewPanel.jsx';

const AMBER = '#D08020';
const AMBER_BG = '#FBEAD0';
const INK = '#1B1408';

export default function PendingChangesBar() {
  const enabled = flag('inlineEdit');
  const queue = useStore(s => s.pendingEditsQueue || []);
  const commit = useStore(s => s.commitPendingEdits);
  const revert = useStore(s => s.revertPendingEdits);
  const [previewOpen, setPreviewOpen] = useState(false);

  if (!enabled) return null;
  if (!hasPending(queue)) return null;

  const active = activeEdits(queue);
  const count = active.length;
  const noun = count === 1 ? 'change' : 'changes';

  // Short categorical summary: "renamed Captain · added Tavern".
  // Pull the first 2-3 distinctive edits and label them.
  const summary = active.slice(0, 3).map(e => {
    switch (e.kind) {
      case 'rename-npc':         return `renamed ${e.payload?.newName || 'NPC'}`;
      case 'rename-faction':     return `renamed ${e.payload?.newName || 'faction'}`;
      case 'rename-settlement':  return `renamed settlement`;
      case 'add-institution':    return `added ${e.payload?.label || 'institution'}`;
      case 'remove-institution': return `removed ${e.payload?.label || 'institution'}`;
      case 'add-resource':       return `added resource`;
      case 'remove-resource':    return `removed resource`;
      case 'add-stressor':       return `added stressor`;
      case 'remove-stressor':    return `removed stressor`;
      case 'edit-prose':         return `edited prose`;
      default:                   return e.kind;
    }
  }).join(' · ');

  const onCommit = () => {
    Funnel.track(EVENTS.EDIT_COMMITTED, { count });
    if (typeof commit === 'function') commit();
  };
  const onRevert = () => {
    Funnel.track(EVENTS.EDIT_REVERTED, { count });
    if (typeof revert === 'function') revert();
  };
  const onPreview = () => {
    Funnel.track(EVENTS.EDIT_CASCADE_PREVIEWED, { count });
    setPreviewOpen(true);
  };

  return (
    <>
      <div
        role="status"
        aria-live="polite"
        style={{
          margin: `${SP.sm}px auto`,
          maxWidth: 720,
          padding: `${SP.sm}px ${SP.md}px`,
          background: AMBER_BG,
          border: `1px solid ${AMBER}`,
          borderLeft: `3px solid ${AMBER}`,
          borderRadius: R.sm,
          display: 'flex', alignItems: 'center', gap: SP.sm,
          fontFamily: sans, fontSize: FS.xs, color: INK,
          flexWrap: 'wrap',
        }}
      >
        <span style={{ fontWeight: 700, color: AMBER }}>
          {count} unsaved {noun}
        </span>
        {summary && (
          <span style={{ color: swatch['#3A2F18'], flex: 1, minWidth: 0 }}>
            · {summary}
          </span>
        )}
        <button
          type="button"
          onClick={onPreview}
          style={{
            background: 'transparent',
            border: 'none',
            color: GOLD_DEEP,
            fontWeight: 700,
            cursor: 'pointer',
            padding: 0,
            fontFamily: sans, fontSize: FS.xs,
          }}
        >
          Preview cascade →
        </button>
        <button
          type="button"
          onClick={onCommit}
          style={{
            background: GOLD_DEEP,
            color: swatch.white,
            border: 'none',
            borderRadius: R.sm,
            padding: '4px 10px',
            fontWeight: 700,
            cursor: 'pointer',
            fontFamily: sans, fontSize: FS.xs,
          }}
        >
          Commit
        </button>
        <button
          type="button"
          onClick={onRevert}
          style={{
            background: 'transparent',
            border: 'none',
            color: MUTED,
            cursor: 'pointer',
            padding: 0,
            fontFamily: sans, fontSize: FS.xs,
          }}
        >
          Revert
        </button>
      </div>

      {previewOpen && (
        <CascadePreviewPanel
          onClose={() => setPreviewOpen(false)}
          onCommit={() => { setPreviewOpen(false); onCommit(); }}
        />
      )}
    </>
  );
}
