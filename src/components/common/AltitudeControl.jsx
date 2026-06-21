/**
 * AltitudeControl — the 3-segment progressive-disclosure control.
 * Overview / Detail / Engine ↔ guided / standard / expert,
 * bound to the persisted `userPrefs.detailLevel` via useAltitude().
 *
 * Pure presentational + the store binding. Mounted NOWHERE yet — it is wired
 * into the dossier/realm/PDF surfaces in later phases. A single axis replaces the
 * scattered legacy flags so a new DM lands at Overview and a power user stays at
 * Engine.
 */

import { useAltitude } from '../../hooks/useAltitude.js';
import Button from '../primitives/Button.jsx';
import { GOLD, GOLD_BG, INK, MUTED, BORDER, CARD, sans, FS, SP, R } from '../theme.js';

// The three rungs, in ascending depth. `label` is the user-facing word; `hint`
// is the tooltip; `level` is the pref value the segment writes.
const SEGMENTS = [
  { level: 'guided', label: 'Overview', hint: 'A clean glance — the friendly summary.' },
  { level: 'standard', label: 'Detail', hint: 'Band readouts with plain-language "why".' },
  { level: 'expert', label: 'Engine', hint: 'The full causal grid, pressures, and strength.' },
];

/**
 * @param {{ size?: 'sm'|'md', ariaLabel?: string }} [props]
 */
export default function AltitudeControl({ size = 'md', ariaLabel = 'Detail level' } = {}) {
  const { level, setLevel } = useAltitude();
  const pad = size === 'sm' ? '3px 8px' : `${SP.xs}px ${SP.sm}px`;
  const fontSize = size === 'sm' ? FS.xs : FS.sm;

  return (
    <div
      role="radiogroup"
      aria-label={ariaLabel}
      data-testid="altitude-control"
      style={{
        display: 'inline-flex',
        alignItems: 'stretch',
        background: CARD,
        border: `1px solid ${BORDER}`,
        borderRadius: R.md,
        overflow: 'hidden',
        fontFamily: sans,
      }}
    >
      {SEGMENTS.map((seg, i) => {
        const active = seg.level === level;
        return (
          <Button
            key={seg.level}
            variant="ghost"
            size={size === 'sm' ? 'sm' : 'md'}
            role="radio"
            aria-checked={active}
            title={seg.hint}
            data-level={seg.level}
            data-active={active ? 'true' : 'false'}
            onClick={() => setLevel?.(seg.level)}
            style={{
              minHeight: undefined,
              padding: pad,
              fontSize,
              fontWeight: active ? 800 : 600,
              color: active ? INK : MUTED,
              background: active ? GOLD_BG : 'transparent',
              border: 'none',
              borderLeft: i === 0 ? 'none' : `1px solid ${BORDER}`,
              borderRadius: 0,
              boxShadow: active ? `inset 0 -2px 0 ${GOLD}` : 'none',
              lineHeight: 1.2,
            }}
          >
            {seg.label}
          </Button>
        );
      })}
    </div>
  );
}

export { SEGMENTS as ALTITUDE_SEGMENTS };
