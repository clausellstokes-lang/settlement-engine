/**
 * AltitudeControl — the 3-segment progressive-disclosure control.
 * Overview / Detail / Engine ↔ guided / standard / expert.
 *
 * Two modes:
 *   - Uncontrolled (default): binds to the persisted `userPrefs.detailLevel`
 *     via useAltitude(). For one global reading-depth pref.
 *   - Controlled: pass `value` + `onChange` to scope it to a single surface
 *     (e.g. the Substrate tab's local depth), so a minor density preference
 *     lives ON the content it modulates rather than as a global mode switch.
 */

import { useAltitude } from '../../hooks/useAltitude.js';
import Button from '../primitives/Button.jsx';
import { GOLD, GOLD_BG, INK, BODY, BORDER, CARD, sans, FS, SP, R } from '../theme.js';

// The three rungs, in ascending depth. `label` is the user-facing word; `hint`
// is the tooltip; `level` is the pref value the segment writes.
const SEGMENTS = [
  { level: 'guided', label: 'Overview', hint: 'A clean glance. The friendly summary.' },
  { level: 'standard', label: 'Detail', hint: 'Band readouts with plain-language "why".' },
  { level: 'expert', label: 'Engine', hint: 'The full causal grid, pressures, and strength.' },
];

/**
 * @param {{ size?: 'sm'|'md', ariaLabel?: string, value?: 'guided'|'standard'|'expert', onChange?: (level: string) => void }} [props]
 */
export default function AltitudeControl({ size = 'md', ariaLabel = 'Detail level', value, onChange } = {}) {
  const store = useAltitude();
  const level = value != null ? value : store.level;
  const setLevel = onChange != null ? onChange : store.setLevel;
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
              // Inactive segments were MUTED (~3.4:1, fails AA); BODY keeps the
              // un-selected options legible.
              color: active ? INK : BODY,
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
