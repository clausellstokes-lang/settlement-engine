/**
 * RoadsLayer — SVG layer rendering the derived road network.
 *
 * Pipeline:
 *   1. roadNetwork.computeRoadEdges(saves, placements)  → edge list (React-side)
 *   2. bridge.call('settlementEngine:computeRoadNetwork') → A* polylines (iframe-side)
 *   3. Batched <path> per tier (highway/trade/lane/sea) for perf
 *
 * The geometry comes back in FMG map coordinates, so the layer sits inside
 * the overlay's transformed <g> and follows pan/zoom automatically.
 */

import { useEffect, useMemo, useRef, useState } from 'react';
import { useStore } from '../../store';
import { computeRoadEdges } from '../../lib/roadNetwork.js';
import { activeSpatialDigest, activeSeaLanes, isPort } from '../../domain/spatial/distanceRead.js';

const STYLE = {
  highway: { color: '#5a4530', width: 3.2, dash: null,    op: 0.92, shadow: 2.2 },
  trade:   { color: '#7a5f38', width: 2.1, dash: null,    op: 0.85, shadow: 1.6 },
  lane:    { color: '#8a7654', width: 1.1, dash: '4 3',   op: 0.75, shadow: 1.0 },
  sea:     { color: '#3a5a88', width: 1.5, dash: '5 4',   op: 0.80, shadow: 1.2 },
};

const RENDER_ORDER = ['lane', 'trade', 'highway', 'sea'];

function pointsToD(pts) {
  if (!Array.isArray(pts) || pts.length < 2) return '';
  let d = `M ${pts[0].x.toFixed(1)} ${pts[0].y.toFixed(1)}`;
  for (let i = 1; i < pts.length; i++) {
    d += ` L ${pts[i].x.toFixed(1)} ${pts[i].y.toFixed(1)}`;
  }
  return d;
}

export default function RoadsLayer({ bridge }) {
  const saves      = useStore(s => s.savedSettlements);
  const placements = useStore(s => s.mapState.placements);
  const seed       = useStore(s => s.mapState.seed);
  const campaigns        = useStore(s => s.campaigns);
  const activeCampaignId = useStore(s => s.activeCampaignId);
  // Bumped by WorldMap.jsx after a snapshot load or regenerate. Even when
  // placements are unchanged (e.g. you reopen a saved campaign), the FMG
  // cells underneath have changed — A* needs to re-route from scratch.
  const geometryVersion = useStore(s => s.geometryVersion);

  const [paths, setPaths] = useState({});
  const reqIdRef = useRef(0);

  // ── WEAVE NET-1 · the render tier reads the CANON's port definition ────────
  // `preferSea` is the one thing this layer sends the iframe that depends on
  // "is this settlement a port", and until now the answer came from the
  // settlement's own `config.tradeRouteAccess` — an INSTITUTIONAL claim. Where a
  // campaign has a frozen spatial canon, the sea-lane graph already holds the
  // real answer (geography ∧ institution ∧ navigability), so we ask it instead,
  // through `isPort` — the same read every engine seam uses. No canon, or a canon
  // whose sea lanes are dormant ⇒ null ⇒ computeRoadEdges keeps the old read
  // byte-identically.
  //
  // This layer is where the read belongs: it is the only `preferSea` consumer,
  // and it already sits on a lazy map surface, so importing the frozen-digest
  // reader here costs no first-paint bytes (TravelersLayer, its sibling, imports
  // the same module). roadNetwork.js itself stays a zero-domain-import leaf.
  const canonPortIds = useMemo(() => {
    const campaign = activeCampaignId
      ? (campaigns || []).find(c => String(c.id) === String(activeCampaignId))
      : null;
    const digest = activeSpatialDigest(campaign?.worldState);
    if (!digest || !activeSeaLanes(digest)) return null;
    const ids = new Set();
    for (const p of Object.values(placements || {})) {
      const id = p?.settlementId ? String(p.settlementId) : null;
      if (id && isPort(digest, id)) ids.add(id);
    }
    return ids;
  }, [campaigns, activeCampaignId, placements]);

  const edges = useMemo(
    () => computeRoadEdges(saves, placements, { canonPortIds }),
    [saves, placements, canonPortIds],
  );

  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect */
    // setPaths({}) on the early-return paths is functionally derived
    // state — when prerequisites aren't met, we have no paths to draw.
    // The set-state-in-effect rule flags both these and the increment-
    // and-assign of the request id below. Suppressing across the whole
    // effect body because deriving paths from inputs the other way (via
    // useMemo) would require a synchronous A* implementation, which the
    // bridge call is deliberately async.
    if (!bridge || !bridge.isReady) { setPaths({}); return; }
    if (!edges.length) { setPaths({}); return; }

    const myReqId = ++reqIdRef.current;
    const payload = edges.map(e => ({
      id: e.id,
      fromX: e.fromX, fromY: e.fromY,
      toX:   e.toX,   toY:   e.toY,
      preferSea: !!e.preferSea,
    }));

    let cancelled = false;
    bridge.call('settlementEngine:computeRoadNetwork', { edges: payload }, { timeout: 20000 })
      .then(reply => {
        if (cancelled || myReqId !== reqIdRef.current) return;
        // ── WEAVE E-NET-3 · a road that vanished says so ───────────────────
        // The iframe's A* has an iteration guard, and a search that hits it gives
        // up and returns nothing — so the road it was drawing simply is not on the
        // map, and until this car nothing anywhere said a word about it. The
        // bridge now counts its own give-ups and names the roads; this surfaces
        // them in the PARENT console, where whoever is looking at the map is
        // actually looking. Silent when the count is zero, which is the expected
        // reading on every realm measured so far.
        const d = reply?.diagnostics;
        if (d && d.exhaustedSearches > 0) {
          console.warn(
            `[RoadsLayer] ${d.exhaustedSearches} of ${d.searches} route searches were abandoned at the `
            + `${d.maxIterations}-iteration guard, so ${d.edges - d.routed} of ${d.edges} roads are not drawn.`,
            d.exhaustedEdgeIds,
          );
        }
        setPaths(reply?.paths || {});
      })
      .catch(err => {
        if (cancelled || myReqId !== reqIdRef.current) return;
        console.warn('[RoadsLayer] computeRoadNetwork failed', err?.message || err);
        setPaths({});
      });

    return () => { cancelled = true; };
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [edges, bridge, seed, geometryVersion]);

  if (!edges.length || !Object.keys(paths).length) return null;

  // Group edges by render style (tier, or "sea" if iframe routed via water).
  const byStyle = { highway: [], trade: [], lane: [], sea: [] };
  for (const e of edges) {
    const p = paths[e.id];
    if (!p?.points?.length || p.points.length < 2) continue;
    const key = p.mode === 'sea' ? 'sea' : e.tier;
    if (!byStyle[key]) continue;
    byStyle[key].push(p.points);
  }

  return (
    <g className="sf-roads-layer" pointerEvents="none">
      {RENDER_ORDER.map(key => {
        const polylines = byStyle[key];
        if (!polylines.length) return null;
        const st = STYLE[key];
        const d = polylines.map(pointsToD).filter(Boolean).join(' ');
        if (!d) return null;
        return (
          <g key={key}>
            {/* Soft shadow to give the road some visual depth over terrain */}
            <path
              d={d}
              fill="none"
              stroke={st.color}
              strokeWidth={st.width + st.shadow}
              strokeOpacity={0.22}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Main stroke */}
            <path
              d={d}
              fill="none"
              stroke={st.color}
              strokeWidth={st.width}
              strokeOpacity={st.op}
              strokeDasharray={st.dash || undefined}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>
        );
      })}
    </g>
  );
}
