/**
 * BatchCart — the staging area for "multiple simultaneous changes". Lists the
 * staged events, surfaces blocking cross-reference warnings live (a change
 * that targets an entity neither in the settlement nor earlier in the batch),
 * and offers one Preview + one Apply for the whole set.
 *
 * Extracted from EventComposer.jsx (behavior-preserving decomposition).
 */

import { X, Check } from 'lucide-react';
import { validateBatch } from '../../../domain/events/batch.js';
import { EVENT_REGISTRY } from '../../../domain/events/registry.js';
import { GOLD, INK, MUTED, BORDER, sans, FS, SP, R, swatch } from '../../theme.js';
import { labelOfTarget } from './helpers.js';
import { DeltaRow } from './PreviewPanel.jsx';

export function BatchCart({ staged, settlement, phase, pendingBatchPreview, onRemove, onClear, onPreview, onApply }) {
  const validation = validateBatch(settlement, staged);
  const blocks = (validation.warnings || []).filter(w => w.severity === 'block');
  return (
    <div style={{
      marginTop: SP.sm, padding: SP.sm,
      background: swatch['#FAF8F4'], border: `1px solid ${GOLD}`, borderRadius: R.sm,
    }}>
      <div style={{
        fontSize: FS.xs, fontWeight: 800, color: MUTED, fontFamily: sans,
        textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: SP.xs,
      }}>
        Staged changes ({staged.length})
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {staged.map((e, i) => (
          <div key={e.id || i} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: FS.xs, fontFamily: sans, color: INK }}>
            <span style={{ fontWeight: 700, minWidth: 16, color: GOLD }}>{i + 1}.</span>
            <span style={{ flex: 1 }}>
              {EVENT_REGISTRY[e.type]?.label || e.type}{e.targetId ? `: ${labelOfTarget(e.targetId)}` : ''}
            </span>
            <button onClick={() => onRemove(i)} aria-label="Remove staged change" title="Remove" style={{ background: 'none', border: 'none', cursor: 'pointer', color: MUTED, padding: 2, display: 'flex' }}>
              <X size={12} />
            </button>
          </div>
        ))}
      </div>
      {blocks.length > 0 && (
        <ul style={{ margin: '6px 0 0', paddingLeft: 16, color: swatch.danger, fontSize: FS.xxs, fontFamily: sans }}>
          {blocks.map((w, i) => <li key={i}>{w.message}</li>)}
        </ul>
      )}
      {pendingBatchPreview?.systemStateDeltas?.length > 0 && (
        <div style={{ marginTop: 6 }}>
          {pendingBatchPreview.systemStateDeltas.map((d, i) => <DeltaRow key={i} d={d} />)}
        </div>
      )}
      <div style={{ display: 'flex', gap: SP.xs, marginTop: SP.sm }}>
        <button onClick={onPreview} style={primaryBtn(false)}>Preview batch</button>
        <button
          onClick={onApply}
          disabled={blocks.length > 0}
          style={{ ...confirmBtn, opacity: blocks.length > 0 ? 0.5 : 1, cursor: blocks.length > 0 ? 'not-allowed' : 'pointer' }}
        >
          <Check size={11} /> {phase === 'canon' ? `Apply ${staged.length} to timeline` : `Apply all (${staged.length})`}
        </button>
        <button onClick={onClear} style={cancelBtn}>Clear</button>
      </div>
    </div>
  );
}

function primaryBtn(disabled) {
  return {
    padding: '5px 12px',
    background: disabled ? '#eee' : GOLD,
    color: disabled ? '#999' : '#fff',
    border: 'none', borderRadius: R.sm,
    fontSize: FS.xs, fontWeight: 700, fontFamily: sans,
    cursor: disabled ? 'not-allowed' : 'pointer',
  };
}
const confirmBtn = {
  display: 'inline-flex', alignItems: 'center', gap: 4,
  padding: '5px 12px', background: '#1a5a28', color: '#fff',
  border: 'none', borderRadius: R.sm,
  fontSize: FS.xs, fontWeight: 700, fontFamily: sans, cursor: 'pointer',
};
const cancelBtn = {
  display: 'inline-flex', alignItems: 'center', gap: 4,
  padding: '5px 12px', background: '#fff', color: INK,
  border: `1px solid ${BORDER}`, borderRadius: R.sm,
  fontSize: FS.xs, fontWeight: 700, fontFamily: sans, cursor: 'pointer',
};
