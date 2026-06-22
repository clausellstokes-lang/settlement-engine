/**
 * Pill.jsx — the one canonical badge/pill primitive.
 *
 * Before this, five pill variants coexisted across the Account surface
 * (RoleBadge, the 2FA "Coming soon" chip, the credit-pack discount badge, the
 * ticket StatusPill, FounderBadge) — each re-deciding radius, padding, font,
 * colour model, and whether to carry an icon. That forced the GM to relearn the
 * badge grammar mid-page and let some states ride colour alone (a P7 gap).
 *
 * This primitive enforces the shared rule once:
 *   • radius / padding / uppercase micro-label are fixed,
 *   • `tone` selects a colour-paired surface,
 *   • an optional `icon` gives the two-channel (icon + label) signal P7 wants
 *     for any state that carries meaning (open/closed, warning, role).
 *
 * `bg`/`color` can be passed directly for the rare tone the token set doesn't
 * name (e.g. the dynamic per-pack accent on the discount badge). `absolute`
 * supports the discount badge's corner-anchored layout variant.
 */
import { FS, R, sans } from '../theme.js';

export default function Pill({
  children,
  icon = null,
  bg,
  color,
  absolute = false,
  style,
  ...rest
}) {
  return (
    <span
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 3,
        padding: '2px 8px', borderRadius: R.md,
        background: bg, color,
        fontFamily: sans, fontSize: FS.xs, fontWeight: 700,
        textTransform: 'uppercase', letterSpacing: '0.04em',
        whiteSpace: 'nowrap',
        ...(absolute ? { position: 'absolute' } : null),
        ...style,
      }}
      {...rest}
    >
      {icon}
      {children}
    </span>
  );
}
