/**
 * WorldMapContextToolbars.jsx — mode-specific contextual toolbar row.
 *
 * Extracted verbatim from WorldMap.jsx (no logic change). Pure presentational:
 * renders the Annotate / Terrain / Routes contextual toolbar for the active
 * mode. State, refs, and mode wiring live in the parent WorldMap.
 */

import { Suspense, lazy } from 'react';
import { MAP_MODES } from '../../store/mapSlice.js';

const AnnotateToolbar = lazy(() => import('./AnnotateToolbar.jsx'));
const TerrainToolbar  = lazy(() => import('./TerrainToolbar.jsx'));
// P132 / M-4 promote — Routes mode contextual toolbar. Lazy because
// terrain/annotate users never need it.
const RoutesToolbar   = lazy(() => import('./RoutesToolbar.jsx'));

export function WorldMapContextToolbars({ showingCampaignPanel, mapMode, imageMode, bridgeRef }) {
  return (
    <>
      {!showingCampaignPanel && mapMode === MAP_MODES.ANNOTATE && (
        <Suspense fallback={null}><AnnotateToolbar /></Suspense>
      )}
      {/* Terrain + Routes toolbars are FMG-only (need pack.cells); suppressed in image mode. */}
      {!showingCampaignPanel && !imageMode && mapMode === MAP_MODES.TERRAIN && (
        <Suspense fallback={null}><TerrainToolbar bridgeRef={bridgeRef} /></Suspense>
      )}
      {!showingCampaignPanel && !imageMode && mapMode === MAP_MODES.ROUTES && (
        <Suspense fallback={null}><RoutesToolbar /></Suspense>
      )}
    </>
  );
}
