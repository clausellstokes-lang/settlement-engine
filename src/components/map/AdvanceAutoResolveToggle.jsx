/**
 * AdvanceAutoResolveToggle — Advance-scaling Stage 4 (the autoresolve switch row).
 *
 * A labeled switch shown inside the Advance confirm dialog (the `extra` slot) ONLY
 * when the multi-tick flag is on. DEFAULT OFF: an Advance pauses at the big forks so
 * the DM gets a say; ON runs straight to the end, resolving every change to its
 * recommended outcome. Reads/sets the advanceAutoResolve store value, which persists
 * within the session.
 *
 * Pure presentational: `value` + `onChange` arrive from the parent (WorldMap reads
 * the store value + setter). Calm voice; no raw colors (design tokens only); the
 * switch is a real checkbox so it is keyboard- and screen-reader-operable, with the
 * help line wired via aria-describedby.
 */

import { useId } from 'react';
import { BODY, BORDER, BORDER_STRONG, CARD, CARD_ALT, FS, GOLD, INK, PARCH_100, R, SP, sans } from '../theme.js';

export function AdvanceAutoResolveToggle({ value, onChange }) {
  const helpId = useId();
  const on = !!value;
  return (
    <div
      style={{
        display: 'flex', alignItems: 'flex-start', gap: SP.sm,
        padding: SP.md, marginBottom: SP.md,
        border: `1px solid ${BORDER}`, borderRadius: R.md, background: CARD_ALT,
      }}
    >
      <div style={{ flex: 1, minWidth: 0 }}>
        {/* eslint-disable-next-line jsx-a11y/label-has-for -- associated via htmlFor/id; the control is a styled switch nested separately so the flex row can place the track on the right */}
        <label
          htmlFor={`${helpId}-input`}
          style={{ display: 'block', color: INK, fontFamily: sans, fontSize: FS.sm, fontWeight: 800, cursor: 'pointer' }}
        >
          Auto-resolve every change
        </label>
        <p id={helpId} style={{ margin: '3px 0 0', color: BODY, fontFamily: sans, fontSize: FS.xs, lineHeight: 1.45 }}>
          Auto-resolve every change, or pause at the big forks.
        </p>
      </div>
      {/* A real checkbox styled as a switch: visually a track + knob, but the native
          input carries focus, keyboard, and the on/off state for assistive tech. */}
      <span style={{ position: 'relative', flexShrink: 0, width: 40, height: 22, display: 'inline-flex' }}>
        <input
          id={`${helpId}-input`}
          type="checkbox"
          role="switch"
          checked={on}
          aria-checked={on}
          aria-label="Auto-resolve every change"
          aria-describedby={helpId}
          onChange={(e) => onChange(e.target.checked)}
          style={{
            position: 'absolute', inset: 0, width: '100%', height: '100%',
            margin: 0, opacity: 0, cursor: 'pointer', zIndex: 1,
          }}
        />
        <span
          aria-hidden="true"
          style={{
            width: 40, height: 22, borderRadius: 11,
            background: on ? GOLD : CARD,
            border: `1px solid ${on ? GOLD : BORDER_STRONG}`,
            transition: 'background 120ms ease',
            display: 'inline-block', position: 'relative',
          }}
        >
          <span
            style={{
              position: 'absolute', top: 2, left: on ? 20 : 2,
              width: 16, height: 16, borderRadius: '50%',
              background: PARCH_100,
              transition: 'left 120ms ease',
            }}
          />
        </span>
      </span>
    </div>
  );
}

export default AdvanceAutoResolveToggle;
