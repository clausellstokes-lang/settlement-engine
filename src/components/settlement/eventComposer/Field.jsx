/**
 * Field — a small labelled-control wrapper used throughout EventComposer.
 * Extracted from EventComposer.jsx (behavior-preserving decomposition).
 */

import { MUTED, sans, FS } from '../../theme.js';

export function Field({ label, hint, children }) {
  return (
    // The control is implicitly associated by nesting inside this <label>, which
    // is a valid accessible label association; a static htmlFor can't be used on a
    // reusable wrapper without colliding ids, so the htmlFor half of label-has-for
    // is intentionally waived here.
    // eslint-disable-next-line jsx-a11y/label-has-for
    <label style={{ display: 'flex', flexDirection: 'column', gap: 2, fontSize: FS.xxs, fontFamily: sans, color: MUTED }}>
      {label}
      {children}
      {hint && <span style={{ fontStyle: 'italic', color: MUTED, opacity: 0.7 }}>{hint}</span>}
    </label>
  );
}
