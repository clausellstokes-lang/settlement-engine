import { useId } from 'react';
import { BODY, BORDER2, CARD, FS, GOLD, GOLD_BG, INK, MUTED, R, sans } from '../theme.js';

/**
 * One living-world subsystem gate (War / Settlement Strategy / Religion) rendered
 * as a labelled checkbox card with an explicit On/Off word (second channel beyond
 * color, P7). `disabled` locks the control — used when the War layer auto-enables
 * Settlement Strategy, and while the realm is advancing (the store no-ops the rules
 * write mid-tick, so the gate must not invite an edit that would be silently dropped).
 * `disabledReason` is an optional brief hint rendered under the row when disabled —
 * the advance path passes 'the realm is advancing…' so the lock reads as a state, not
 * a broken control. Extracted from SimulationRulesDialog to keep that surface under
 * the component-size ratchet.
 */
export default function GateToggle({ checked, label, description, onChange, disabled = false, disabledReason = '' }) {
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
      {disabled && disabledReason && (
        // Brief affordance so the locked state reads as "busy", not "broken". Only
        // shown when a reason is supplied (the War-forced lock carries its "why" in
        // the description instead), so the byte-identical war path is unaffected.
        <span
          data-testid="gate-disabled-reason"
          style={{ color: GOLD, fontFamily: sans, fontSize: FS.xxs, fontWeight: 900 }}
        >
          {disabledReason}
        </span>
      )}
    </label>
  );
}
