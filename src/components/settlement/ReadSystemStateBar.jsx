/**
 * ReadSystemStateBar — the PROMOTED read-view 4-dimension health strip (UX
 * overhaul Phase 2, plan §4.1). The store-bound SystemStateBar lived only behind
 * premium editMode; this read-only twin derives the same four dimensions from the
 * settlement itself (deriveSystemState — pure, no store, no rng) so a new DM sees
 * the glance at the TOP of the dossier Summary at every altitude, and a public
 * gallery dossier (no store-side systemState) renders it too.
 *
 * Renders nothing when the settlement is absent or the derivation yields no
 * usable state. Pure presentational over deriveSystemState + the shared
 * SystemStateGrid visual.
 */

import { useMemo } from 'react';
import { deriveSystemState } from '../../domain/state/deriveSystemState.js';
import { SystemStateGrid } from './SystemStateBar.jsx';

/**
 * @param {{ settlement: any }} props
 */
export default function ReadSystemStateBar({ settlement }) {
  const systemState = useMemo(() => {
    if (!settlement) return null;
    try {
      return deriveSystemState(settlement);
    } catch {
      return null;
    }
  }, [settlement]);

  if (!systemState) return null;
  return (
    <div data-testid="read-system-state-bar" style={{ marginBottom: 12 }}>
      <SystemStateGrid systemState={systemState} title="State at a glance" />
    </div>
  );
}
