/**
 * IconButton.jsx — Compact toolbar button used across the world-map toolbar.
 *
 * Extracted byte-for-byte from WorldMap.jsx (no logic change). Pure
 * presentational: an icon+label button with `primary` / `active` styling
 * variants. Forwards arbitrary props (e.g. data-tour, aria-pressed, disabled)
 * to the underlying <button>.
 */

import { GOLD, GOLD_BG, CARD, INK, BORDER, R, FS, sans } from '../theme.js';

export function IconButton({ children, onClick, title, primary, active, ...rest }) {
  return (
    <button
      onClick={onClick}
      title={title}
      {...rest}
      style={{
        display: 'flex', alignItems: 'center', gap: 4,
        padding: '5px 10px',
        background: primary ? GOLD : active ? GOLD_BG : CARD,
        color: primary ? '#fff' : INK,
        border: `1px solid ${primary ? GOLD : BORDER}`,
        borderRadius: R.sm,
        fontSize: FS.xs, fontWeight: 700, fontFamily: sans,
        cursor: 'pointer',
      }}
    >
      {children}
    </button>
  );
}
