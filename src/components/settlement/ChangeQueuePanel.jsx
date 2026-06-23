/**
 * ChangeQueuePanel — the pending-changes queue viewer (Workshop Card 2).
 *
 * Sits ABOVE the EventComposer, between the read of current state and the
 * controls that mutate it. Lists every staged order for the open settlement —
 * each a plain-language label plus a per-order cancel — and a single
 * "Save N pending changes" commit at the foot. Hidden entirely when nothing is
 * staged (no rail noise on an empty queue).
 *
 * The commit flushes the queue (applies every order in insertion order,
 * persists atomically), then SOFT-REFRESHES the dossier via the caller's
 * onCommitted callback (re-derive + key-bump, never a reload). On a failed
 * commit the queue is left intact and a retryable error is surfaced inline.
 *
 * @param {{
 *   saveId: string,
 *   onCommitted?: (settlement: any) => void,
 * }} props
 */

import { useState } from 'react';
import { X } from 'lucide-react';
import { useStore } from '../../store/index.js';
import { INK, MUTED, BODY, BORDER, CARD, GOLD_TXT, sans, FS, SP, R, swatch } from '../theme.js';
import Button from '../primitives/Button.jsx';
import IconButton from '../primitives/IconButton.jsx';

export default function ChangeQueuePanel({ saveId, onCommitted }) {
  // Subscribe to THIS save's slice of the queue map so the panel re-renders on
  // add/cancel without reacting to a foreign settlement's queue.
  const orders = useStore(s => (s.changeQueues || {})[String(saveId)] || []);
  const flushing = useStore(s => s.changeQueueFlushing);
  const cancelQueuedChange = useStore(s => s.cancelQueuedChange);
  const flushQueue = useStore(s => s.flushQueue);

  const [error, setError] = useState('');

  // Empty state: render nothing. The queue is a draft surface; when there is no
  // draft, the composer below is the whole story.
  if (orders.length === 0) return null;

  const count = orders.length;

  async function onCommit() {
    setError('');
    const result = await flushQueue(saveId);
    if (result?.ok) {
      // Soft-refresh: hand the committed settlement up so the dossier re-derives
      // and key-bumps. No reload — the open settlement is preserved.
      onCommitted?.(result.settlement);
    } else {
      setError(result?.error || 'The changes could not be saved. They are still queued.');
    }
  }

  return (
    <section
      data-testid="change-queue-panel"
      aria-label="Pending changes"
      style={{
        background: CARD, border: `1px solid ${BORDER}`, borderRadius: R.md,
        padding: SP.sm, marginBottom: SP.sm,
      }}
    >
      <div style={{
        display: 'flex', alignItems: 'center', gap: 6,
        fontSize: FS.xs, fontWeight: 800, fontFamily: sans,
        color: MUTED, letterSpacing: '0.06em', textTransform: 'uppercase',
        marginBottom: SP.xs,
      }}>
        Pending changes ({count})
      </div>
      <p style={{ fontSize: FS.xxs, fontFamily: sans, color: MUTED, margin: `0 0 ${SP.sm}px`, lineHeight: 1.4 }}>
        Staged, not yet saved. Review the list, then commit them together.
      </p>

      <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: SP.xs }}>
        {orders.map(order => (
          <li
            key={order.id}
            style={{
              display: 'flex', alignItems: 'center', gap: SP.sm,
              padding: `${SP.xs}px ${SP.sm}px`,
              background: swatch.infoBg, borderRadius: R.sm,
            }}
          >
            <span style={{ flex: 1, minWidth: 0, fontSize: FS.sm, fontFamily: sans, color: INK, lineHeight: 1.4 }}>
              {order.humanLabel}
            </span>
            <IconButton
              Icon={X}
              label={`Cancel: ${order.humanLabel}`}
              tone="danger"
              size="md"
              onClick={() => cancelQueuedChange(saveId, order.id)}
              disabled={flushing}
            />
          </li>
        ))}
      </ul>

      {error && (
        <p
          role="alert"
          style={{ fontSize: FS.xxs, fontFamily: sans, color: swatch.danger, margin: `${SP.sm}px 0 0`, lineHeight: 1.4 }}
        >
          {error}
        </p>
      )}

      <div style={{ marginTop: SP.sm, display: 'flex', gap: SP.sm, alignItems: 'center' }}>
        <Button
          variant="gold"
          size="sm"
          onClick={onCommit}
          disabled={flushing}
          style={{ fontWeight: 800, color: GOLD_TXT }}
        >
          {flushing ? 'Saving…' : `Save ${count} pending change${count === 1 ? '' : 's'}`}
        </Button>
        <span style={{ fontSize: FS.xxs, fontFamily: sans, color: BODY, lineHeight: 1.4 }}>
          Applied in order, saved together.
        </span>
      </div>
    </section>
  );
}
