/**
 * ApplyControls — the composer's Preview / Apply / Cancel / + Add to batch row,
 * plus the §9c Destroy-Settlement type-the-name confirm gate. Extracted from
 * EventComposer.jsx (behavior-preserving decomposition, W-COMPOSER-1) to keep
 * the host under the 600-line component ratchet. All state lives in the parent
 * and threads down as props.
 *
 * Composer V2 §5: Apply ALWAYS commits the freshly-built form event (the
 * apply-prefers-pendingPreview bypass is retired in the host's onApply), so
 * applyOk always honors canSubmit — no preview-pending bypass exists here.
 */

import { X, Check } from 'lucide-react';
import Button from '../../primitives/Button.jsx';
import { INK, CARD, sans, FS, SP, R, swatch } from '../../theme.js';

export function ApplyControls({
  type, phase, isLinkNeighbour, canSubmit, settlement,
  destroyConfirm, setDestroyConfirm,
  pendingPreview, dismissPreview,
  onPreview, onApply, onAddToBatch,
}) {
  const isDestroy = type === 'DESTROY_SETTLEMENT';
  const destroyOk = !isDestroy || destroyConfirm.trim() === (settlement?.name || '').trim();
  const applyOk = destroyOk && canSubmit;
  return (
    <div style={{ display: 'flex', gap: SP.xs, marginTop: SP.sm, flexWrap: 'wrap' }}>
      {/* LINK_NEIGHBOUR delegates to onLink instead of building an event, so it
          is never previewed or batched — Preview / + Add to batch are suppressed. */}
      <Button variant="primary" size="sm" onClick={onPreview} disabled={!canSubmit || isLinkNeighbour}>
        Preview
      </Button>
      {isDestroy && (
        <div style={{ width: '100%', marginTop: 6, padding: '8px 10px', border: `1px solid ${swatch.danger}`, borderRadius: R.sm, background: swatch.dangerBg }}>
          <div style={{ fontSize: FS.xs, fontWeight: 800, color: swatch.danger, marginBottom: 5, lineHeight: 1.4 }}>
            ⚠ This destroys {settlement?.name || 'the settlement'} — services go dark, institutions are impaired, and partner relationships sour. Recoverable, but only by deliberate action.
          </div>
          <input
            value={destroyConfirm}
            onChange={(e) => setDestroyConfirm(e.target.value)}
            placeholder={`Type "${settlement?.name || ''}" to confirm`}
            aria-label="Type the settlement name to confirm destruction"
            style={{ width: '100%', padding: '5px 8px', border: `1px solid ${swatch.danger}`, borderRadius: 4, fontSize: FS.sm, fontFamily: sans, color: INK, background: CARD, boxSizing: 'border-box' }}
          />
        </div>
      )}
      <Button
        variant={isDestroy ? 'danger' : 'success'}
        size="sm"
        icon={<Check size={11} />}
        onClick={onApply}
        disabled={!applyOk}
      >
        {isDestroy ? 'Destroy settlement' : isLinkNeighbour ? 'Link a neighbour' : (phase === 'canon' ? 'Apply to Timeline' : 'Apply')}
      </Button>
      {pendingPreview && (
        <Button variant="secondary" size="sm" icon={<X size={11} />} onClick={() => { dismissPreview(); setDestroyConfirm(''); }}>
          Cancel
        </Button>
      )}
      <Button
        variant="gold"
        size="sm"
        onClick={onAddToBatch}
        disabled={!canSubmit || isLinkNeighbour}
      >
        + Add to batch
      </Button>
    </div>
  );
}
