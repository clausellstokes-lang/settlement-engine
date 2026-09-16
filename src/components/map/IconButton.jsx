/**
 * IconButton.jsx — Compact toolbar button used across the world-map toolbar.
 *
 * Pure presentational: an icon+label button with `primary` / `active`
 * styling variants. Delegates to the design-system Button primitive
 * (primary → gold CTA, active → gold tint, neither → secondary). Forwards
 * arbitrary props (e.g. data-tour, aria-pressed, disabled) to the Button.
 */

import Button from '../primitives/Button.jsx';

export function IconButton({ children, onClick, title, primary, active, tier2: _tier2, ...rest }) {
  // `tier2` is destructured (into an ignored local, not spread) to keep the
  // non-standard attribute off the DOM; a non-primary/non-active control already
  // resolves to the secondary variant it asks for.
  return (
    <Button
      variant={primary ? 'primary' : active ? 'gold' : 'secondary'}
      size="sm"
      onClick={onClick}
      title={title}
      {...rest}
    >
      {children}
    </Button>
  );
}
