/**
 * IconButton.jsx — Compact toolbar button used across the world-map toolbar.
 *
 * Pure presentational: an icon+label button with `primary` / `active`
 * styling variants. Delegates to the design-system Button primitive
 * (primary → gold CTA, active → gold tint, neither → secondary). Forwards
 * arbitrary props (e.g. data-tour, aria-pressed, disabled) to the Button.
 *
 * `exportGate` (X-53): the control is an export, so it renders inside LaunchGatedExport, which
 * decides whether it is the launch teaser. `launch` (set by LaunchGatedExport): the control
 * wears the Button's launch skin. The skin clips the gold to the label's TEXT, so an icon child
 * (a lucide svg on currentColor) takes the launch ink, as the Button does for its own `icon`.
 */

import { Children, isValidElement } from 'react';
import Button from '../primitives/Button.jsx';
import { launchSkin } from '../theme.js';
import LaunchGatedExport from '../primitives/LaunchGatedExport.jsx';

export function IconButton({ children, onClick, title, primary, active, tier2: _tier2, launch = false, exportGate = false, ...rest }) {
  if (exportGate) {
    return (
      <LaunchGatedExport>
        <IconButton onClick={onClick} title={title} primary={primary} active={active} {...rest}>{children}</IconButton>
      </LaunchGatedExport>
    );
  }
  if (launch) {
    return (
      <Button variant="launch" size="sm" onClick={onClick} title={title} {...rest}>
        {Children.map(children, child => (isValidElement(child)
          ? <span style={{ display: 'inline-flex', color: launchSkin.ink }}>{child}</span>
          : child))}
      </Button>
    );
  }
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
