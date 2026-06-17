/**
 * WorldMapOverlays.jsx — floating overlays for the world map: toast, confirm
 * dialogs, simulation-rules dialog, guided tour, and the spinner keyframes.
 *
 * Extracted verbatim from WorldMap.jsx (no logic change). Pure presentational:
 * every piece of state and every handler lives in the parent WorldMap and is
 * passed in as props.
 */

import { Suspense, lazy } from 'react';
import { sans, FS, R, swatch } from '../theme.js';
import { ConfirmDialog } from '../primitives/Dialog.jsx';
import WorldMapTour from './WorldMapTour.jsx';
import { WORLD_MAP_TOUR_STEPS } from './WorldMapTourSteps.js';

const SimulationRulesDialog = lazy(() => import('./SimulationRulesDialog.jsx'));

export function WorldMapOverlays({
  toast,
  regenerateConfirm,
  performRegenerate,
  setRegenerateConfirm,
  mapSaveConfirm,
  setMapSaveConfirm,
  performSaveMap,
  showSimulationRules,
  activeCampaign,
  setShowSimulationRules,
  tourOpen,
  setTourOpen,
}) {
  return (
    <>
      {/* Toast */}
      {toast && (
        <div style={{
          position: 'fixed', bottom: 20, left: '50%', transform: 'translateX(-50%)',
          padding: '10px 18px',
          background: toast.kind === 'error' ? '#8a2a2a' : toast.kind === 'info' ? '#3a4a5a' : '#1a5a28',
          color: swatch.white, borderRadius: R.md, fontSize: FS.sm, fontWeight: 700, fontFamily: sans,
          boxShadow: '0 6px 16px rgba(0,0,0,0.2)',
          zIndex: 100,
        }}>
          {toast.text}
        </div>
      )}

      <ConfirmDialog
        open={!!regenerateConfirm}
        tone="warning"
        title="Regenerate world?"
        body={regenerateConfirm || ''}
        confirmLabel="Regenerate"
        onConfirm={performRegenerate}
        onCancel={() => setRegenerateConfirm(null)}
      />

      <ConfirmDialog
        open={mapSaveConfirm}
        title="Save canonized map?"
        body="This campaign's world is canonized, so placed settlements can no longer be moved. Any settlements you've newly added will be saved where they sit. Continue?"
        confirmLabel="Save map"
        onConfirm={() => { setMapSaveConfirm(false); performSaveMap(); }}
        onCancel={() => setMapSaveConfirm(false)}
      />

      <Suspense fallback={null}>
        <SimulationRulesDialog
          open={showSimulationRules}
          campaign={activeCampaign}
          onClose={() => setShowSimulationRules(false)}
        />
      </Suspense>

      {/* §16 — guided help walkthrough */}
      <WorldMapTour open={tourOpen} steps={WORLD_MAP_TOUR_STEPS} onClose={() => setTourOpen(false)} />

      {/* Spinner animation */}
      <style>{`
        .sf-spin { animation: sf-spin 1.2s linear infinite; }
        @keyframes sf-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </>
  );
}
