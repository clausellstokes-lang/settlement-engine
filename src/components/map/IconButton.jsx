/**
 * IconButton.jsx — Compact toolbar button used across the world-map toolbar.
 *
 * Pure presentational: an icon+label button with `primary` / `active`
 * styling variants. Delegates to the design-system Button primitive.
 *
 * Variant ladder (P4 — one focal point):
 *   • primary → the gold CTA, reserved for the single primary action on the
 *     bar (Advance Realm). It also takes the larger `lg` size so it out-weighs
 *     its neighbours in a SECOND channel (size) beyond colour.
 *   • active  → an ON toggle (Layers / Inspector / More-open). Rendered as
 *     `secondary` fill + an inset ELEV[1] shadow, NOT gold — gold stays
 *     reserved for the one primary, and the shadow + aria-pressed carry the
 *     pressed state in two channels. This mirrors ModeSwitch / the contextual
 *     ToolButtons so "selected" reads identically across the whole map chrome
 *     (P11 cross-surface consistency).
 *   • neither → tertiary view utilities (Fit / Help / More). Rendered `ghost`
 *     so the bar resolves to a clear three-tier ladder
 *     (gold Advance > secondary Inspector/toggles > ghost utilities) instead
 *     of a wall of equal bordered boxes. Ghost is safe here: the toolbar is a
 *     flat opaque band, never the painted page.
 *
 * Size (P7/P8 ~44px at-the-table target): defaults to `md` (40px) instead of
 * the historical hard-coded `sm` (32px); the primary opts up to `lg` (44px).
 * Callers may override via `size`.
 *
 * Forwards arbitrary props (data-tour, aria-pressed, disabled) to the Button.
 */

import Button from '../primitives/Button.jsx';
import { ELEV } from '../theme.js';

export function IconButton({
  children, onClick, title, primary, active, tier2,
  size, style, ...rest
}) {
  // primary → gold CTA; active OR tier2 → secondary fill; plain default → ghost.
  // `tier2` keeps a control (the Inspector toggle) at the secondary tier even
  // when it isn't pressed, so it reads as its own affordance above the ghost
  // view-utility trio (P4); `active` additionally layers the inset shadow.
  const variant = primary ? 'primary' : (active || tier2) ? 'secondary' : 'ghost';
  // The primary CTA earns the larger 44px target by default; everything else
  // sits at the 40px everyday floor unless the caller overrides.
  const resolvedSize = size || (primary ? 'lg' : 'md');
  return (
    <Button
      variant={variant}
      size={resolvedSize}
      onClick={onClick}
      title={title}
      // Inset shadow is the second channel that lifts an ON toggle off the flat
      // bar without borrowing gold (P4/P7). Merged last so callers can still
      // layer their own style.
      style={active ? { boxShadow: ELEV[1], ...style } : style}
      {...rest}
    >
      {children}
    </Button>
  );
}
