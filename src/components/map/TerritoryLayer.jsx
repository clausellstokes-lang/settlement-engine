/**
 * TerritoryLayer.jsx — POLIS-4: the derived territory partition view.
 *
 * ONE TRUTH, CONSUMED — NEVER A SECOND FLOOD (A1.2 §9 resolved): the partition
 * drawn is `digest.territory` VERBATIM — the per-cell settlement index the
 * canonize-time multi-source Dijkstra froze into the spatial digest. This
 * layer computes NO flood of its own, so a partition-vs-digest divergence
 * cannot exist by construction (the comparison receipt is vacuously
 * discharged; SEAM-1's session-divergence flag remains the capture seam's
 * concern, not this view's).
 *
 * THE COORDINATE SEAM: the frozen digest deliberately carries NO cell
 * coordinates (placementRaster's own law), so DRAWING the partition needs the
 * LIVE pack's centroids — the same read-only `getSpatialPack` RPC the capture
 * uses, reached through the same registry handle. The pack is fetched once
 * per digest and STRICTLY RECONCILED: a pack whose cellCount disagrees with
 * the digest's draws NOTHING (geometry moved since canonize — an honest
 * refusal, never a misregistered shading).
 *
 * IMPRESSIONISTIC BY DECLARATION (the A1.2 §9 in-legend fork): with only
 * centroids (no cell polygons in the captured arrays), the shading is a
 * SAMPLED DOT FIELD — at most ~2,400 land-cell dots, stride-sampled on big
 * packs — and the LayersPanel legend SAYS SO. It suggests territory; it does
 * not assert cell borders.
 *
 * PROMINENCE DISPLAY LADDER: dot opacity grades by the owning settlement's
 * TIER (a metropolis claims the eye; a thorp barely tints its hollow).
 *
 * A derived render layer: recomputable from canon + the live pack, zero
 * persisted state, zero sim mutation — the regen hazard class has no
 * habitat here.
 */

import { useEffect, useMemo, useState } from 'react';

import { useStore } from '../../store/index.js';
import { activeSpatialDigest } from '../../domain/spatial/distanceRead.js';
import { normalizeSpatialPack } from '../../domain/spatial/spatialDigest.js';
import { getSpatialCaptureBridge } from '../../lib/spatialCaptureRegistry.js';
import { TIER_ORDER } from '../../data/constants.js';
import { swatch } from '../theme.js';

// A small closed hue cycle for owners (dots, not chart bars — the tab palette
// stays where it is; these route through the sanctioned swatch registry).
const OWNER_COLORS = Object.freeze([
  swatch['#2A3A7A'], swatch['#8B1A1A'], swatch['#1A5A28'], swatch['#A0762A'],
  swatch['#5A2A8A'], swatch['#4A1A4A'], swatch['#8A4010'], swatch['#5A6E82'],
]);
// The prominence ladder: tier → dot opacity (metropolis claims the eye).
const TIER_ALPHA = Object.freeze({ thorp: 0.10, hamlet: 0.13, village: 0.17, town: 0.22, city: 0.28, metropolis: 0.34 });
const MAX_DOTS = 2400;
const LAND_FLOOR = 20; // the flood-fill convention: h < 20 is water

export default function TerritoryLayer() {
  const campaigns = useStore(s => s.campaigns);
  const activeCampaignId = useStore(s => s.activeCampaignId);
  const savedSettlements = useStore(s => s.savedSettlements);
  const imageMode = useStore(s => !!s.mapState.customBackdrop?.imageUrl);

  const digest = useMemo(() => {
    const campaign = activeCampaignId
      ? (campaigns || []).find(c => String(c.id) === String(activeCampaignId)) || null
      : null;
    return activeSpatialDigest(campaign?.worldState || null);
  }, [campaigns, activeCampaignId]);

  // The live pack, fetched once per digest through the registry handle. An
  // image-backdrop map has no FMG pack; a missing/unready bridge fetches
  // nothing (the layer simply stays dark — refusal, never a guess).
  const [pack, setPack] = useState(null);
  useEffect(() => {
    setPack(null);
    if (!digest || imageMode) return undefined;
    const bridge = getSpatialCaptureBridge();
    if (!bridge || !bridge.isReady || typeof bridge.getSpatialPack !== 'function') return undefined;
    let cancelled = false;
    Promise.resolve(bridge.getSpatialPack())
      .then(raw => {
        if (cancelled) return;
        const normalized = normalizeSpatialPack(raw && raw.pack ? raw.pack : raw);
        if (normalized) setPack(normalized);
      })
      .catch(() => { /* an unreadable pack draws nothing — honest dark */ });
    return () => { cancelled = true; };
  }, [digest, imageMode]);

  const dots = useMemo(() => {
    if (!digest || !pack) return [];
    // STRICT RECONCILIATION: a pack that no longer matches the frozen digest's
    // cell universe draws nothing (geometry moved since canonize).
    if (Number(pack.cellCount) !== Number(digest.cellCount)) return [];
    const territory = Array.isArray(digest.territory) ? digest.territory : [];
    const ids = Array.isArray(digest.settlementIds) ? digest.settlementIds : [];
    const tierOf = (sid) => {
      const save = (savedSettlements || []).find(sv => String(sv?.id) === String(sid));
      const tier = save?.settlement?.tier || save?.settlement?.config?.tier;
      return TIER_ORDER.includes(tier) ? tier : 'village';
    };
    const alphaByOwner = ids.map(sid => TIER_ALPHA[tierOf(sid)] ?? TIER_ALPHA.village);
    const stride = Math.max(1, Math.ceil(pack.cellCount / MAX_DOTS));
    const out = [];
    for (let i = 0; i < pack.cellCount; i += stride) {
      const owner = territory[i];
      if (owner == null || owner < 0) continue;           // ocean/unreached stays unclaimed
      if (Number(pack.h?.[i]) < LAND_FLOOR) continue;      // water is never territory
      const point = pack.p?.[i];
      if (!point || !Number.isFinite(point[0]) || !Number.isFinite(point[1])) continue;
      out.push({
        i,
        x: point[0],
        y: point[1],
        color: OWNER_COLORS[owner % OWNER_COLORS.length],
        alpha: alphaByOwner[owner] ?? TIER_ALPHA.village,
        owner: String(ids[owner] ?? owner),
      });
    }
    return out;
  }, [digest, pack, savedSettlements]);

  if (!dots.length) return null;
  return (
    <g className="sf-territory-layer" data-testid="territory-overlay" pointerEvents="none">
      {dots.map(dot => (
        <circle key={dot.i} cx={dot.x} cy={dot.y} r={2.2} fill={dot.color} opacity={dot.alpha} data-territory-owner={dot.owner} />
      ))}
    </g>
  );
}
