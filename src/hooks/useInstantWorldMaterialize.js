/**
 * useInstantWorldMaterialize — render an Instant World's geography from its seed
 * on first open (W-R2 INSTANT WORLD).
 *
 * The composer stages a realm with the map PLAN only (mapState.seed + mapKind +
 * a `pendingMapGen` marker) and NO fmgSnapshot — FMG is iframe-bound, so its
 * geometry cannot be generated headlessly. This hook is the downstream half:
 * when such a campaign becomes active and the map bridge is ready, it drives the
 * FMG iframe to generate the terrain deterministically from that seed + template
 * (aleaPRNG → same seed = same map). The staged settlement placements are React
 * overlays that render over whatever geography appears, so they are untouched.
 *
 * Deliberately does NOT capture or persist the snapshot: snapshotting the live
 * map slice here would race the campaign-load path that populates placements, and
 * could persist an empty map. Instead the geometry re-materializes from the seed
 * on each open (idempotent) until the user runs the normal "Save Map" — which
 * captures the snapshot and drops the marker (saveCampaignMap omits pendingMapGen).
 * Guarded by `!fmgSnapshot`, so once a snapshot exists this hook is inert.
 *
 * Best-effort: a failure leaves the fully-usable staged tableau to the user's
 * manual Regenerate; the realm is amendable regardless of the geometry.
 */
import { useEffect, useRef } from 'react';

/**
 * @param {{
 *   bridgeRef: { current: any },
 *   bridgeReady: boolean,
 *   activeCampaign: any,
 *   bumpGeometryVersion: () => void,
 * }} args
 */
export function useInstantWorldMaterialize({ bridgeRef, bridgeReady, activeCampaign, bumpGeometryVersion }) {
  const doneRef = useRef(null);
  useEffect(() => {
    if (!bridgeReady) return undefined;
    const campaign = activeCampaign;
    const ms = campaign?.mapState;
    if (!campaign?.id || !ms?.pendingMapGen || ms.fmgSnapshot || ms.seed == null) return undefined;
    if (doneRef.current === campaign.id) return undefined;
    const bridge = bridgeRef.current;
    if (!bridge?.isReady) return undefined; // bridge not up yet — retry on next tick
    doneRef.current = campaign.id;

    let cancelled = false;
    (async () => {
      try {
        if (ms.mapKind) {
          try { await bridge.setTemplate(ms.mapKind); } catch { /* template is advisory */ }
        }
        await bridge.resetMap(String(ms.seed));
        if (cancelled) return;
        bumpGeometryVersion();
      } catch {
        // Allow a retry on the next selection — the tableau is usable without it.
        if (!cancelled) doneRef.current = null;
      }
    })();
    return () => { cancelled = true; };
  }, [bridgeReady, activeCampaign, bridgeRef, bumpGeometryVersion]);
}
