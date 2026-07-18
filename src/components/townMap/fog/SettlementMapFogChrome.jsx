/**
 * components/townMap/fog/SettlementMapFogChrome — DOOR 2 the pane-level fog chrome, extracted.
 *
 * Everything the fog layer renders OUTSIDE the map SVG: the DM control panel (top-right) and the
 * live PLAYER VIEW overlay. Extracted from SettlementMapPane (a max-lines-capped hot file) so the
 * pane threads one component. Owns the player-view open state + the fogged-handout export (the
 * existing export matrix, audience:'player' + the mask). The player view is React.lazy() — a
 * store-free second surface that stays off the pane chunk's eager path (the InteriorView posture).
 */
import { lazy, Suspense, useCallback, useState } from 'react';
import SettlementMapFogControls from './SettlementMapFogControls.jsx';

const FogPlayerView = lazy(() => import('./FogPlayerView.jsx'));

/**
 * @param {{
 *   fog: ReturnType<typeof import('./useMapFog.js').useMapFog>,
 *   editing: boolean,
 *   settlement: any,
 *   activeLens: string,
 *   fire: (feature: string, props?: Record<string, unknown>) => void,
 * }} props
 */
export default function SettlementMapFogChrome({ fog, editing, settlement, activeLens, fire }) {
  const [playerViewOpen, setPlayerViewOpen] = useState(false);

  // The fogged player HANDOUT: the active session's reveal through the existing export matrix
  // (audience:'player' drops DM-only markers; the mask hides unrevealed quarters). Dynamic-import
  // the export lane so it rides the export chunk, not this component's static closure.
  const onExportHandout = useCallback(async () => {
    if (!fog.activeReveal) return;
    fire('fog_handout');
    const mod = await import('../../../lib/townMapExport.js');
    await mod.downloadTownMapExport(settlement, {
      format: 'png', resolution: 2400, style: activeLens,
      audience: 'player', fogReveal: fog.activeReveal,
    });
  }, [fog.activeReveal, settlement, activeLens, fire]);

  return (
    <>
      <div data-town-fog-controls style={{ position: 'absolute', top: 8, right: 8, zIndex: 3 }}>
        <SettlementMapFogControls
          fog={fog}
          editing={editing}
          onOpenPlayerView={() => setPlayerViewOpen(true)}
          onExportHandout={onExportHandout}
        />
      </div>
      {playerViewOpen && (
        <Suspense fallback={null}>
          <FogPlayerView
            settlement={settlement}
            reveal={fog.activeReveal}
            styleId={activeLens}
            sessionName={fog.sessionName}
            onClose={() => setPlayerViewOpen(false)}
          />
        </Suspense>
      )}
    </>
  );
}
