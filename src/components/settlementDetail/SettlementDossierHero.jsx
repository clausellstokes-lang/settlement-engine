/**
 * SettlementDossierHero — the library settlement view's dossier body + its
 * phase-aware NextActionRail (RESTORED @ S2r-a, owner's BASE RULING 2026-07-18).
 *
 * Read mode renders master's two-column dossier hero: the [Dossier | Map]
 * toggle-fed body on the LEFT (OutputContainer readOnly / SettlementMapPane,
 * flex 1 1 520px) beside the sticky NextActionRail aside on the RIGHT
 * (flex 0 1 248px, shown for a saved record); it reflows to one column on narrow
 * (flexWrap). Edit mode keeps the composite's single full-width column below the
 * edit chrome — the rail's guided actions are redundant while the editor is open
 * (master mounts the read panel, not the rail, beneath the editor). The map
 * stays a SIBLING of OutputContainer, fed by the toggle, never inside it.
 *
 * Extracted from SettlementDetail (behavior-preserving) to keep that surface
 * under the component-size ratchet. Every rail handler maps to an action
 * SettlementDetail already performs; the co-located useNextActionRailHandlers
 * hook routes canonize through ONE confirm gate + the first_canonize pricing
 * moment and the event/AI rungs through enter-edit + scroll-focus.
 */

import { lazy, Suspense, useState } from 'react';
import Segmented from '../primitives/Segmented.jsx';
import { ConfirmDialog } from '../primitives/Dialog.jsx';
import DetailErrorBoundary from './DetailErrorBoundary.jsx';
import FeatureErrorBoundary from '../FeatureErrorBoundary.jsx';
import NextActionRail from '../settlement/NextActionRail.jsx';
import { useNextActionRailHandlers } from './useNextActionRailHandlers.js';
import useIsMobile from '../../hooks/useIsMobile.js';
import { useStore } from '../../store/index.js';
import { MUTED, PAGE_MAX, CHROME } from '../theme';

// Lazy exactly as in SettlementDetail: the town-map pane and the PDF-dragging
// OutputContainer load only when their surface renders, never on first paint
// (tests/build/townMapLazy.test.js, vendorPdfLazy.test.js).
const OutputContainer = lazy(() => import('../OutputContainer'));
const SettlementMapPane = lazy(() => import('../townMap/SettlementMapPane.jsx'));
// THE LIVING BACKDROP wash (LB-b) — lazy exactly like the pane so the town-map
// model's fork-key fingerprint stays off first paint (tests/build/townMapLazy).
const SettlementDossierBackdrop = lazy(() => import('./SettlementDossierBackdrop.jsx'));

export default function SettlementDossierHero({
  detail, detailView, setDetailView,
  editMode, canEdit, saveId, authTier, phase, narrated,
  toggleEditMode, openExportSheet,
}) {
  // NextActionRail inputs — reuse existing selectors; no new store fields.
  const canonize = useStore(s => s.canonize);
  const isSettlementClockBound = useStore(s => s.isSettlementClockBound);
  // `simulated` = this settlement's realm is clock-bound (already in the Realm),
  // driving the rail's gold "Send it to the Realm" vs "Open the Realm" rung.
  const simulated = !!(saveId && typeof isSettlementClockBound === 'function' && isSettlementClockBound(saveId));
  // Narration is a PAID, edit-mode-free action → any SIGNED-IN owner of a saved
  // settlement, decoupled from the premium canEdit gate that governs manual
  // editing / canonize (pinned in nextActionRailNarrateGate.test.jsx).
  const canNarrate = !!saveId && authTier != null && authTier !== 'anon';
  const isMobile = useIsMobile();
  const [confirmCanonizeOpen, setConfirmCanonizeOpen] = useState(false);

  const { railHandlers, confirmCanonize } = useNextActionRailHandlers({
    saveId, phase, canEdit, canNarrate, editMode, narrated,
    toggleEditMode, canonize, setConfirmCanonizeOpen, openExportSheet,
  });

  if (!detail.settlement) return null;

  const toggle = (
    <div style={{ margin: '0 0 12px', width: '100%' }}>
      <Segmented
        ariaLabel="Settlement view"
        options={[{ id: 'dossier', label: 'Dossier' }, { id: 'map', label: 'Map' }]}
        value={detailView}
        onChange={setDetailView}
      />
    </div>
  );
  // In read mode the rail owns the paid Narrate/Regenerate CTAs, so the read
  // dossier suppresses its own (the free raw/narrated toggle stays); edit mode
  // (no rail) keeps them.
  const body = (
    <div style={{ marginBottom: 12 }}>
      <DetailErrorBoundary>
        <Suspense fallback={<div style={{ padding: 20, textAlign: 'center', color: MUTED }}>Loading...</div>}>
          {detailView === 'map'
            ? <SettlementMapPane settlement={detail.settlement} canEdit={canEdit} saveId={saveId} />
            : <OutputContainer settlement={detail.settlement} readOnly saveId={saveId} suppressNarrativeCta={!editMode} />}
        </Suspense>
      </DetailErrorBoundary>
    </div>
  );

  return (
    <>
      {editMode ? (
        <div style={{ maxWidth: PAGE_MAX, margin: '0 auto', width: '100%' }}>
          {toggle}
          {body}
        </div>
      ) : (
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'flex-start', marginBottom: 24, position: 'relative' }}>
          {/* THE LIVING BACKDROP — the last-viewed map as a faint ink wash behind
              the dossier plates + rail (zIndex 0). Isolated: a load/render failure
              renders nothing, never the core view. */}
          {saveId && (
            <FeatureErrorBoundary label="settlement-backdrop" fallback={() => null}>
              <Suspense fallback={null}>
                <SettlementDossierBackdrop settlement={detail.settlement} saveId={saveId} />
              </Suspense>
            </FeatureErrorBoundary>
          )}
          <div style={{ flex: '1 1 520px', minWidth: 0, position: 'relative', zIndex: 1 }}>
            {toggle}
            {body}
          </div>
          {saveId && (
            <aside style={{ flex: '0 1 248px', minWidth: 0, position: 'sticky', top: isMobile ? CHROME.headerMobile + CHROME.stickyTop : CHROME.stickyTop, alignSelf: 'flex-start', zIndex: 1 }}>
              <NextActionRail
                settlement={detail.settlement}
                save={detail.saveData || detail}
                simulated={simulated}
                handlers={railHandlers}
              />
            </aside>
          )}
        </div>
      )}

      {/* Shared canonize confirm — opened by the rail's Canonize rung;
          confirmCanonize() runs canonize() + the first_canonize pricing moment. */}
      <ConfirmDialog
        open={confirmCanonizeOpen}
        tone="warning"
        title="Mark settlement as canon?"
        body="Future changes will be logged as in-world events with timeline entries."
        confirmLabel="Canonize"
        onConfirm={confirmCanonize}
        onCancel={() => setConfirmCanonizeOpen(false)}
      />
    </>
  );
}
