/**
 * components/townMap/useMapLayerAnalytics — SM-5 (7) the map-layer capture wiring.
 *
 * Keeps the analytics fires out of the pane body (the hot-file rule). Fires the
 * GENERATION profile once per settlement render / v1→v2 redraw, the passive
 * edge-labels-visible signal once, and hands back once/repeat trackers for the
 * interaction-driven legibility signals. All best-effort via mapLayerAnalytics
 * (never throws); coarse enums/bands/counts only.
 */
import { useCallback, useEffect, useRef } from 'react';
import { trackMapRender, trackMapFeature } from '../../lib/mapLayerAnalytics.js';

/**
 * @param {{ model: any, settlement: any, hasEdgeLabels: boolean }} deps
 * @returns {{ fireOnce: (feature: string, props?: Record<string, unknown>) => void,
 *             fire: (feature: string, props?: Record<string, unknown>) => void }}
 */
export function useMapLayerAnalytics({ model, settlement, hasEdgeLabels }) {
  const settlementKey = settlement?.id ?? settlement?._seed ?? null;
  const layoutVersion = model?.layoutLawVersion === 2 ? 2 : 1;
  const modelRef = useRef(model);
  const firedRef = useRef(new Set());

  // Keep the latest model without a render-time ref write (updated in an effect).
  useEffect(() => { modelRef.current = model; });

  // GENERATION profile — once per settlement + version; re-arms every once-signal.
  useEffect(() => {
    firedRef.current = new Set();
    trackMapRender(modelRef.current);
  }, [settlementKey, layoutVersion]);

  // Passive edge-labels-visible — once while present (re-armed per settlement above).
  useEffect(() => {
    if (hasEdgeLabels && !firedRef.current.has('edge_labels')) {
      firedRef.current.add('edge_labels');
      trackMapFeature('edge_labels');
    }
  }, [hasEdgeLabels, settlementKey]);

  const fireOnce = useCallback((feature, props) => {
    if (firedRef.current.has(feature)) return;
    firedRef.current.add(feature);
    trackMapFeature(feature, props);
  }, []);
  const fire = useCallback((feature, props) => trackMapFeature(feature, props), []);

  return { fireOnce, fire };
}
