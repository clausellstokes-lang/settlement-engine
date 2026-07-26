/**
 * Lazy boundary for the game-grade Settlement Workbench.
 *
 * OutputContainer is already a large dossier coordinator. Keeping the boundary
 * here gives the flag one readable mount point without pulling the Workbench
 * implementation into the initial dossier chunk.
 */

import { lazy, Suspense } from 'react';

const SettlementWorkbench = lazy(() => import('./SettlementWorkbench.jsx'));

export default function SettlementWorkbenchMount({ enabled, readOnly }) {
  if (!enabled) return null;
  return (
    <Suspense fallback={<span role="status">Opening settlement tools…</span>}>
      <SettlementWorkbench readOnly={readOnly} />
    </Suspense>
  );
}
