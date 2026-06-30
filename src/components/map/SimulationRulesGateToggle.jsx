import { useId } from 'react';
import { BODY, BORDER2, CARD, FS, GOLD, GOLD_BG, INK, MUTED, R, sans } from '../theme.js';

/**
 * One living-world subsystem gate (War / Settlement Strategy / Religion) rendered
 * as a labelled checkbox card with an explicit On/Off word (second channel beyond
 * color, P7). `disabled` locks the control on — used when the War layer auto-enables
 * Settlement Strategy. Extracted from SimulationRulesDialog to keep that surface
 * under the component-size ratchet.
 */
export default function GateToggle({ checked, label, description, onChange, disabled = false }) {
  const controlId = useId();
  return (
    <label htmlFor={controlId} style={{
      display: 'grid',
      gap: 4,
      padding: '10px 12px',
      border: `1px solid ${checked ? GOLD : BORDER2}`,
      borderRadius: R.md,
      background: checked ? GOLD_BG : CARD,
      cursor: disabled ? 'default' : 'pointer',
      opacity: disabled ? 0.85 : 1,
    }}>
      <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <input
          id={controlId}
          type="checkbox"
          aria-label={label}
          checked={checked}
          disabled={disabled}
          onChange={event => onChange(event.target.checked)}
        />
        <span style={{ color: INK, fontFamily: sans, fontSize: FS.xs, fontWeight: 900 }}>{label}</span>
        {/* Second channel beyond border/fill hue (P7): an explicit On/Off word so
            the enabled state never reads on color alone. */}
        <span style={{
          marginLeft: 'auto',
          color: checked ? GOLD : MUTED,
          fontFamily: sans,
          fontSize: FS.xxs,
          fontWeight: 950,
          textTransform: 'uppercase',
          letterSpacing: '0.06em',
        }}>
          {checked ? 'On' : 'Off'}
        </span>
      </span>
      <span style={{ color: BODY, fontFamily: sans, fontSize: FS.xxs, fontWeight: 700, lineHeight: 1.4 }}>
        {description}
      </span>
    </label>
  );
}
