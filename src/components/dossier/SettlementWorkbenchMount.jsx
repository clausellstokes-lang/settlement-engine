/**
 * Lazy boundary for the game-grade Settlement Workbench.
 *
 * OutputContainer is already a large dossier coordinator. Keeping the boundary
 * here gives the flag one readable mount point without pulling the Workbench
 * implementation into the initial dossier chunk.
 */

import { lazy, Suspense } from 'react';
import { useStore } from '../../store/index.js';
import { viewerCanAuthor } from '../../lib/viewerAuthority.js';

const SettlementWorkbench = lazy(() => import('./SettlementWorkbench.jsx'));

export default function SettlementWorkbenchMount({ enabled, readOnly }) {
  // R-2 premium-gate parity — vetoable JUDGMENT per
  // docs/CAPABILITY_REMEDIATION_PLAN.md Wave R-2 (parity chosen over
  // open-by-default; veto = drop the `|| !canAuthor` condition below).
  //
  // The Create flow reaches this mount with readOnly=false and NO tier check,
  // while the sibling NPC authoring path holds the SettlementDetail authority
  // (`canEdit`: premium / founder / elevated role; free tier is routed to the
  // purchase modal). Since Wave R-4 both surfaces READ THE SAME predicate,
  // src/lib/viewerAuthority.js `viewerCanAuthor` (was a hand-copied mirror of
  // SettlementDetail.jsx `canEdit`), so the Workbench's authoring levers —
  // the prose editor, Edit NPC details, and the Change Dock — never open
  // below it and the two spellings can no longer drift. FAIL-CLOSED: missing
  // auth state or a missing isElevated selector reads as not entitled, and
  // the upstream readOnly prop still wins, so the Library mount's existing
  // closure is untouched. The single source is enforced by
  // tests/lint/premiumGateSingleSource.test.js.
  //
  // FLAG-ON COUPLING (recorded 2026-07-27, R-3 verify pass): OutputContainer
  // renders the standalone PendingChangesBar only when the settlementWorkbench
  // flag is OFF, so at flag-ON this gate leaves free/anon Create-flow users
  // with live queueEdit levers (NpcLifecycleControls via npcAuthoringAllowed)
  // but NO review/commit surface — a widening of the parked "flag-on review
  // blackout" class. Cure is owner-gated (R-5 / G-2b promotion); tracked in
  // the plan's Deferred ledger.
  const canAuthor = useStore(viewerCanAuthor);
  if (!enabled) return null;
  return (
    <Suspense fallback={<span role="status">Opening settlement tools…</span>}>
      <SettlementWorkbench readOnly={readOnly || !canAuthor} />
    </Suspense>
  );
}
