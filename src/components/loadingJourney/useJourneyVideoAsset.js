/**
 * useJourneyVideoAsset.js — THE DORMANT-SAFE ASSET DETECT for the realm journey
 * video (the socket half of the owner order, 2026-07-22).
 *
 * The socket lights the moment the owner drops the file at the contract path and
 * falls back to the CURRENT loading presentation while it is absent. Detection is a
 * cheap module-cached HEAD probe: ONE request per URL per session, shared by every
 * mount. A 404 resolves to `false` (res.ok === false) WITHOUT a console error —
 * a bare <video> pointing at a missing src would log a MEDIA_ERR, so we deliberately
 * probe with fetch instead (the brief's "no console spew when absent").
 *
 * State: `null` while probing (the caller shows the fallback — no gap), then a
 * boolean. The probe fn is injectable so tests never touch the network.
 */

import { useEffect, useState } from 'react';
import { JOURNEY_VIDEO_SRC } from './journeyProgress.js';

const cache = new Map();

/**
 * probeJourneyVideo(src) — resolve whether the asset exists (cached per URL).
 * Never rejects; a missing asset / no-fetch environment resolves to `false`.
 */
export function probeJourneyVideo(src = JOURNEY_VIDEO_SRC) {
  if (cache.has(src)) return cache.get(src);
  let p;
  if (typeof fetch !== 'function') {
    p = Promise.resolve(false);
  } else {
    p = fetch(src, { method: 'HEAD' })
      .then((res) => !!res && res.ok)
      .catch(() => false);
  }
  cache.set(src, p);
  return p;
}

/** Test-only: drop the session cache so a probe stub takes effect. */
export function __resetJourneyVideoProbeCache() { cache.clear(); }

/**
 * useJourneyVideoAsset(src, probe) — `null` while probing, then present:boolean.
 */
export function useJourneyVideoAsset(src = JOURNEY_VIDEO_SRC, probe = probeJourneyVideo) {
  const [present, setPresent] = useState(null);
  useEffect(() => {
    let live = true;
    Promise.resolve(probe(src))
      .then((ok) => { if (live) setPresent(!!ok); })
      .catch(() => { if (live) setPresent(false); });
    return () => { live = false; };
  }, [src, probe]);
  return present;
}
