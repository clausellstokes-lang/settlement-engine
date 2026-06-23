/**
 * WorldMapOverlays.jsx — floating overlays for the world map: toast, confirm
 * dialogs, simulation-rules dialog, guided tour, and the spinner keyframes.
 *
 * Extracted verbatim from WorldMap.jsx (no logic change). Pure presentational:
 * every piece of state and every handler lives in the parent WorldMap and is
 * passed in as props.
 */

import { Suspense, lazy } from 'react';
import { sans, FS, R, ELEV, swatch } from '../theme.js';
import Button from '../primitives/Button.jsx';
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
  advanceConfirm,
  advanceBody,
  performAdvanceRealm,
  setAdvanceConfirm,
  showSimulationRules,
  activeCampaign,
  setShowSimulationRules,
  tourOpen,
  setTourOpen,
}) {
  return (
    <>
      {/* Toast — an optional `action` renders a recovery CTA (P10) so an error
          (e.g. "canonize first") offers a reachable next step, not a dead-end. */}
      {toast && (
        <div style={{
          position: 'fixed', bottom: 20, left: '50%', transform: 'translateX(-50%)',
          display: 'flex', alignItems: 'center', gap: 12,
          padding: '10px 18px',
          background: toast.kind === 'error' ? swatch['#8A2A2A'] : toast.kind === 'info' ? swatch.info : swatch.success,
          color: swatch.white, borderRadius: R.md, fontSize: FS.sm, fontWeight: 700, fontFamily: sans,
          boxShadow: ELEV[2],
          zIndex: 100,
        }}>
          <span>{toast.text}</span>
          {toast.action && (
            <Button
              variant="ghost"
              size="sm"
              onClick={toast.action.onClick}
              style={{
                flexShrink: 0,
                background: 'rgba(255,255,255,0.16)', color: swatch.white,
                border: '1px solid rgba(255,255,255,0.4)', borderRadius: R.sm,
                padding: '4px 10px', fontSize: FS.xs, fontWeight: 800,
                minHeight: undefined,
              }}
            >
              {toast.action.label}
            </Button>
          )}
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
        open={!!advanceConfirm}
        title="Advance the realm?"
        body={advanceBody || ''}
        confirmLabel="Advance Realm"
        onConfirm={performAdvanceRealm}
        onCancel={() => setAdvanceConfirm(false)}
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
