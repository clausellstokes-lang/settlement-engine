/**
 * ReadSystemStateBar — the read-view 4-dimension health strip (UX overhaul
 * Phase 2, plan §4.1; REMOUNTED by R-5b #22). The store-bound SystemStateBar
 * lives only behind premium editMode; this read-only twin derives the same four
 * dimensions from the settlement itself (deriveSystemState — pure, no store, no
 * rng), so the glance is available without an edit seat.
 *
 * WHERE IT MOUNTS (kept honest — the previous header claimed a mount that did
 * not exist; the strip had zero importers between the Phase-2 move and R-5b):
 *   - SummaryTabV2 — directly under the header band. That is the one Summary
 *     OutputContainer renders (flag `summaryMagazineV2`), so the library and
 *     generate dossiers get it.
 *   - PublicDossierView wraps that same OutputContainer in readOnly mode, so
 *     the public gallery dossier gets it for free — no second mount.
 *
 * HONEST LIMITS (the economyFreshness.js pattern — say what this does NOT know):
 *   This strip DERIVES from the settlement object, exactly like every sibling
 *   dossier tab. It does NOT read the layered campaignState.systemState that
 *   applyAuthoredStateDeltas builds during event application (eventPipeline.js).
 *   On an advanced campaign save the edit-mode SystemStateBar (store-layered)
 *   and this strip (derived) can therefore disagree: authored per-event deltas
 *   move the store copy and not the derivation. Neither side is fully
 *   authoritative — the layered state's own drivers/risks are stale by
 *   construction (they are not recomputed when the deltas land). The derived
 *   read is chosen as the default because it always matches what the rest of
 *   the dossier is showing. A caller that genuinely holds the layered state can
 *   pass it in via `systemState` and this strip will render that instead.
 *
 * WHAT THE SELF-GATE ACTUALLY DOES (measured, R-5b #22 — an earlier reading of
 * this file overstated it): deriveSystemState is deliberately tolerant and
 * NEVER throws — a sparse settlement returns a usable state built from neutral
 * defaults. So the only input that renders nothing here is an ABSENT
 * settlement. A sanitized public projection missing some derivation inputs does
 * not blank the strip; it produces neutral bands. The try/catch below is belt
 * and braces against a future derivation that stops being total, not a live
 * path. Pure presentational over deriveSystemState + the shared SystemStateGrid.
 *
 * Carries NO outer margin: each mount owns its own spacing (SummaryTabV2 wraps
 * it in the body gutter), so this leaf stays layout-neutral.
 */

import { useMemo } from 'react';
import { deriveSystemState } from '../../domain/state/deriveSystemState.js';
import { SystemStateGrid } from './SystemStateBar.jsx';

/**
 * @param {{ settlement: any, systemState?: any }} props
 *   settlement  — the dossier settlement to derive from (ignored when
 *                 `systemState` is supplied).
 *   systemState — OPTIONAL pre-computed state (e.g. the store's layered copy).
 *                 When given it wins outright; nothing is derived.
 */
export default function ReadSystemStateBar({ settlement, systemState: systemStateProp }) {
  const derived = useMemo(() => {
    if (systemStateProp) return systemStateProp;
    if (!settlement) return null;
    try {
      return deriveSystemState(settlement);
    } catch {
      return null;
    }
  }, [settlement, systemStateProp]);

  if (!derived) return null;
  return (
    <div data-testid="read-system-state-bar">
      <SystemStateGrid systemState={derived} title="State at a glance" />
    </div>
  );
}
