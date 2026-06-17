/**
 * IconButton.jsx — Compact toolbar button used across the world-map toolbar.
 *
 * Pure presentational: an icon+label button with `primary` / `active`
 * styling variants. Delegates to the design-system Button primitive
 * (primary → gold CTA, active → gold tint, neither → secondary). Forwards
 * arbitrary props (e.g. data-tour, aria-pressed, disabled) to the Button.
 */

import Button from '../primitives/Button.jsx';

export function IconButton({ children, onClick, title, primary, active, ...rest }) {
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
