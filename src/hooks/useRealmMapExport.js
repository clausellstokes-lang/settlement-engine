/**
 * useRealmMapExport — the realm-map PNG export handler (MAP EXPORTS).
 *
 * Extracted from WorldMap (which is at its max-lines ceiling) as a small hook:
 * owns the busy flag and the on-click handler that lazily loads the realm export
 * lib and downloads the composited terrain + settlement-marker PNG. The bridge +
 * campaign name + toast come from WorldMap. Free to the signed-in owner (WorldMap
 * withholds the toolbar affordance for anon); browser + iframe-bridge bound.
 *
 * @param {object} deps
 * @param {{ current: any }} [deps.bridgeRef]  the FMG bridge ref (bridgeRef.current is the api)
 * @param {any} [deps.activeCampaign]          the active campaign (its name seeds the filename)
 * @param {(kind: string, text: string) => void} [deps.showToast]
 * @returns {{ exportingMap: boolean, handleExportMap: () => Promise<void> }}
 */
import { useCallback, useState } from 'react';

export function useRealmMapExport(deps = {}) {
  const { bridgeRef, activeCampaign, showToast } = deps;
  const [exportingMap, setExportingMap] = useState(false);
  const handleExportMap = useCallback(async () => {
    if (exportingMap) return;
    const bridge = bridgeRef?.current;
    if (!bridge?.isReady) { showToast?.('info', 'The map is still loading — try again in a moment.'); return; }
    setExportingMap(true);
    try {
      const { downloadRealmMapPng } = await import('../lib/realmMapExport.js');
      const out = await downloadRealmMapPng({ bridge, name: activeCampaign?.name || 'realm' });
      if (!out) showToast?.('error', 'Could not export the map. Please try again.');
    } catch (err) {
      showToast?.('error', err?.message || 'Could not export the map.');
    } finally {
      setExportingMap(false);
    }
  }, [exportingMap, activeCampaign, showToast, bridgeRef]);
  return { exportingMap, handleExportMap };
}

export default useRealmMapExport;
