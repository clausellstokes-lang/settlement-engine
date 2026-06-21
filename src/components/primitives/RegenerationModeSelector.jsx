/**
 * primitives/RegenerationModeSelector
 *
 * Three rerun strengths the DM can choose from before regenerating:
 *
 *   Nudge       preserve most; reroll only minor service / detail
 *               fields. "Just want to change one thing."
 *   Rebalance   preserve canon + locked entities; reroll affected
 *               subsystems. "Things changed, let the simulation
 *               propagate."
 *   Reforge     keep only the hard anchors (seed, name, tier,
 *               geography). "Start over with the same bones."
 *
 * Consumes domain/regenerationMode.js#buildRegenerationPlan to show
 * the user what each mode WOULD do before they commit. Pure
 * presentational — the parent owns the rerun action and passes
 * `onConfirm(mode)` to fire it.
 *
 * Mode selection is sticky within the modal but resets on close.
 * The parent decides whether to dismiss after onConfirm.
 */

import { useMemo, useState } from 'react';
import { FS, swatch } from '../theme.js';
import { buildRegenerationPlan, REGENERATION_MODES } from '../../domain/regenerationMode.js';

const COLORS = Object.freeze({
  bg:        '#fffbf5',
  border:    '#d2bd96',
  headerBg:  'rgba(160,118,42,0.10)',
  ink:       '#1c1409',
  muted:     '#9c8068',
  gold:      '#a0762a',
  navy:      '#2a3a7a',
  violet:    '#5a2a8a',
  red:       '#8b1a1a',
  preserve:  '#1a4a20',
  reroll:    '#7a1a1a',
});

const MODE_META = Object.freeze({
  nudge: {
    label:    'Nudge',
    color:    COLORS.navy,
    summary:  'Preserve most. Reroll only minor service / detail fields.',
    tagline:  'Just want to change one thing.',
  },
  rebalance: {
    label:    'Rebalance',
    color:    COLORS.violet,
    summary:  'Preserve canon + locked entities. Reroll affected subsystems.',
    tagline:  'Things changed, let the simulation propagate.',
  },
  reforge: {
    label:    'Reforge',
    color:    COLORS.red,
    summary:  'Keep hard anchors (seed, name, tier, geography). Everything else rerolls.',
    tagline:  'Start over with the same bones.',
  },
});

export function RegenerationModeSelector({
  settlement,
  defaultMode = 'rebalance',
  onConfirm,
  onCancel,
}) {
  const [mode, setMode] = useState(defaultMode);

  // Plan is recomputed when mode flips. Memoised so picking the same
  // mode twice doesn't trigger a re-derive.
  const plan = useMemo(() => {
    if (!settlement || !REGENERATION_MODES.includes(mode)) return null;
    try {
      return buildRegenerationPlan(settlement, { mode });
    } catch (e) {
      console.warn('[RegenerationModeSelector] buildRegenerationPlan failed', e);
      return null;
    }
  }, [settlement, mode]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Regeneration mode"
      style={{
        background: COLORS.bg,
        border: `1px solid ${COLORS.border}`,
        borderRadius: 6,
        boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
        padding: 16,
        maxWidth: 520,
        margin: '0 auto',
        fontFamily: 'Nunito, sans-serif',
      }}
    >
      <h2 style={{
        margin: '0 0 4px',
        fontSize: FS['16'], fontWeight: 800,
        color: COLORS.ink,
        textTransform: 'uppercase', letterSpacing: '0.05em',
      }}>
        How aggressive should the rerun be?
      </h2>
      <p style={{
        margin: '0 0 12px',
        fontSize: FS.sm, color: COLORS.muted, lineHeight: 1.4,
      }}>
        Pick the strength of the rerun. The preview shows which entities
        survive and which get rerolled before you commit.
      </p>

      {/* Mode chips */}
      <div role="radiogroup" aria-label="Regeneration mode"
           style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
        {REGENERATION_MODES.map(m => {
          const meta = MODE_META[m];
          const active = mode === m;
          return (
            <button
              key={m}
              role="radio"
              aria-checked={active}
              type="button"
              onClick={() => setMode(m)}
              style={{
                flex: 1,
                padding: '10px 12px',
                background: active ? meta.color : COLORS.bg,
                color: active ? '#fff' : meta.color,
                border: `2px solid ${meta.color}`,
                borderRadius: 5,
                cursor: 'pointer',
                fontSize: FS.sm, fontWeight: 800,
                textTransform: 'uppercase', letterSpacing: '0.05em',
                transition: 'background 0.15s',
              }}
            >
              {meta.label}
            </button>
          );
        })}
      </div>

      {/* Active mode description */}
      <div style={{
        padding: '8px 10px',
        background: swatch['#FAF6EE'],
        border: `1px solid ${COLORS.border}`,
        borderRadius: 4,
        marginBottom: 12,
      }}>
        <div style={{ fontSize: FS.sm, fontWeight: 700, color: COLORS.ink, marginBottom: 2 }}>
          {MODE_META[mode].summary}
        </div>
        <div style={{ fontSize: FS.xs, color: COLORS.muted, fontStyle: 'italic' }}>
          {MODE_META[mode].tagline}
        </div>
      </div>

      {/* Plan preview */}
      <PlanPreview plan={plan} />

      {/* Actions */}
      <div style={{ display: 'flex', gap: 8, marginTop: 14, justifyContent: 'flex-end' }}>
        <button
          type="button"
          onClick={onCancel}
          style={{
            padding: '6px 14px',
            background: COLORS.bg,
            color: COLORS.muted,
            border: `1px solid ${COLORS.border}`,
            borderRadius: 4,
            cursor: 'pointer',
            fontSize: FS.sm, fontWeight: 700,
          }}
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={() => onConfirm?.(mode)}
          style={{
            padding: '6px 14px',
            background: MODE_META[mode].color,
            color: swatch.white,
            border: 'none',
            borderRadius: 4,
            cursor: 'pointer',
            fontSize: FS.sm, fontWeight: 800,
            letterSpacing: '0.03em',
          }}
        >
          Confirm {MODE_META[mode].label}
        </button>
      </div>
    </div>
  );
}

function PlanPreview({ plan }) {
  if (!plan) {
    return (
      <div style={{
        padding: '8px 10px',
        background: swatch['#FAF6EE'],
        border: `1px dashed ${COLORS.border}`,
        borderRadius: 4,
        fontSize: FS.xs, color: COLORS.muted, fontStyle: 'italic',
      }}>
        Plan preview unavailable for this settlement.
      </div>
    );
  }

  const preserveCount = plan.preserveEntities?.length || 0;
  const rerollCount   = plan.rerollEntities?.length   || 0;
  const subsystems    = plan.rerollSubsystems || [];

  return (
    <div style={{
      padding: '8px 10px',
      background: swatch['#FAF6EE'],
      border: `1px solid ${COLORS.border}`,
      borderRadius: 4,
      fontSize: FS.xs, color: COLORS.ink, lineHeight: 1.5,
    }}>
      <div style={{
        display: 'flex', gap: 14,
        marginBottom: 6,
      }}>
        <PlanStat label="Preserve" count={preserveCount} color={COLORS.preserve} />
        <PlanStat label="Reroll" count={rerollCount} color={COLORS.reroll} />
        <PlanStat label="Subsystems" count={subsystems.length} color={COLORS.gold} />
      </div>
      {subsystems.length > 0 && (
        <div style={{ fontSize: FS['10.5'], color: COLORS.muted }}>
          <strong style={{ color: COLORS.ink }}>Subsystems to recompute:</strong>{' '}
          {subsystems.join(' · ')}
        </div>
      )}
    </div>
  );
}

function PlanStat({ label, count, color }) {
  return (
    <div style={{ display: 'flex', alignItems: 'baseline', gap: 5 }}>
      <span style={{
        fontSize: FS['16'], fontWeight: 800,
        color,
      }}>
        {count}
      </span>
      <span style={{
        fontSize: FS.xxs, fontWeight: 700,
        color: COLORS.muted,
        textTransform: 'uppercase', letterSpacing: '0.05em',
      }}>
        {label}
      </span>
    </div>
  );
}

export default RegenerationModeSelector;
