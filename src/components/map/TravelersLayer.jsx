/**
 * TravelersLayer — THE TRAVELERS OVERLAY (DESIGN_THE_ROADS §13). A derived-at-render SVG
 * layer (the ChainEdges / WarFaithMapOverlay sibling) drawing the moving things on the road
 * graph: army columns, migrant columns, and named-NPC envoys — each positioned along its
 * path's settlement placements at a fraction derived purely from tick vs the record's ticks.
 *
 * CONSTITUTION (§13): purely derived read-only rendering; ZERO sim mutation; no write path.
 * The ARMY + MIGRANT sub-layers are the wave's ONLY not-flag-gated deliverable — safe because
 * they are a plain UI lens over LIVE systems' existing ledgers (armyTransit / migration): no
 * flag, dormant ledgers render nothing, no golden hashes any UI. The ENVOY sub-layer reads the
 * roads ledger, which only exists when roadsEnabled is lit ⇒ trivially dormancy-safe (no ledger
 * ⇒ sub-layer absent).
 *
 * SECRET (§15): army positions, migrant positions, and envoy markers/intent are all DM-SECRET;
 * this overlay mounts only in the owner's realm-map session, and the shared/gallery payload
 * never carries worldState (the §19 data-probe asserts it). Zero eager beyond the layers-key
 * default — this component lives in the lazy map chunk.
 *
 * @enforced-by tests/domain/roadsTravelersGeometry.test.js + tests/security/roadsSecretsProbe.test.js
 */

import { useMemo } from 'react';
import { useStore } from '../../store';
import { swatch } from '../theme.js';
import { progress01, pointAlongPath, chevronPoints } from '../../domain/roads/travelersGeometry.js';
import {
  getSpatialLedger, activeSpatialDigest, candidateRoutes, isPort, isTeleportNode, hopWeeks,
} from '../../domain/spatial/distanceRead.js';
import { seasonForTick } from '../../domain/worldPulse/worldState.js';

const COLOR = { armies: swatch.danger, migrants: '#5B7B9A', envoys: swatch['#A0762A'] };

export default function TravelersLayer() {
  // Minimal primitives; derived data in useMemo for reference-stable output between renders.
  const placements       = useStore(s => s.mapState.placements);
  const savedSettlements = useStore(s => s.savedSettlements);
  const campaigns        = useStore(s => s.campaigns);
  const activeCampaignId = useStore(s => s.activeCampaignId);
  const filter           = useStore(s => s.mapState.layers.travelersFilter);
  const geometryVersion  = useStore(s => s.geometryVersion);

  const activeCampaign = useMemo(
    () => (activeCampaignId ? (campaigns || []).find(c => String(c.id) === String(activeCampaignId)) : null) || null,
    [campaigns, activeCampaignId],
  );

  const markers = useMemo(() => {
    if (!activeCampaign || !placements) return [];
    const worldState = activeCampaign.worldState || {};
    const digest = activeSpatialDigest(worldState);
    const tick = Math.floor(Number(worldState.tick) || 0);
    const weekTick = Number(worldState?.calendar?.elapsedWeeks);
    const season = seasonForTick(Number.isFinite(weekTick) ? weekTick : tick).season;
    const allow = Array.isArray(filter) && filter.length ? new Set(filter) : null; // null ⇒ all three
    const on = (id) => !allow || allow.has(id);

    const xy = new Map();
    for (const p of Object.values(placements)) {
      if (p?.settlementId && Number.isFinite(p.x) && Number.isFinite(p.y)) xy.set(String(p.settlementId), { x: p.x, y: p.y });
    }
    const nameOf = (id) => {
      const s = (savedSettlements || []).find(sv => String(sv?.id) === String(id));
      return (s && (s.settlement?.name || s.name)) || String(id);
    };
    const ptsOf = (path) => (Array.isArray(path) ? path.map(id => xy.get(String(id))).filter(Boolean) : []);
    const retWeeks = (from, to) => (digest ? Math.max(1, Number(hopWeeks(digest, from, to, season)) || 1) : 1);
    const out = [];

    // (a) ARMY COLUMNS — worldState.spatialLedgers.armyTransit (armyId = owning settlement).
    if (on('armies')) {
      const ledger = getSpatialLedger(worldState, 'armyTransit') || {};
      for (const key of Object.keys(ledger).sort()) {
        const rec = ledger[key]; if (!rec || typeof rec !== 'object') continue;
        const pts = ptsOf(rec.path); if (pts.length < 2) continue;
        const t = Number.isFinite(rec.position01) ? rec.position01 : progress01(tick, rec.departTick, rec.arrivalTick);
        const pt = pointAlongPath(pts, t); if (!pt) continue;
        const retreat = rec.role === 'retreat';
        const eta = Math.max(0, Math.round(Number(rec.arrivalTick) - tick));
        out.push({
          id: `army.${key}`, kind: 'armies', x: pt.x, y: pt.y,
          angleDeg: retreat ? pt.angleDeg + 180 : pt.angleDeg,
          tip: `${nameOf(rec.armyId || rec.originId)} — army ${retreat ? 'retreating' : 'on the march'}${eta ? `, ETA ${eta}w` : ''}`,
        });
      }
    }

    // (b) MIGRANT COLUMNS — worldState.spatialLedgers.migration, ROAD-BORNE ONLY (skip
    //     sea-lane / teleport pairs: no port/teleport endpoint AND a land route exists).
    if (on('migrants') && digest) {
      const ledger = getSpatialLedger(worldState, 'migration') || {};
      for (const key of Object.keys(ledger).sort()) {
        const rec = ledger[key]; if (!rec || typeof rec !== 'object') continue;
        const o = String(rec.originId || ''); const d = String(rec.destId || '');
        if (!o || !d) continue;
        if (isPort(digest, o) || isPort(digest, d) || isTeleportNode(digest, o) || isTeleportNode(digest, d)) continue;
        const routes = candidateRoutes(digest, o, d);
        if (!routes.length) continue; // no land path ⇒ not road-borne
        const pts = ptsOf(routes[0].path); if (pts.length < 2) continue;
        const hw = retWeeks(o, d);
        const t = progress01(tick, Number(rec.arrivalTick) - hw, Number(rec.arrivalTick)); // 1 − (arrival−tick)/hw
        const pt = pointAlongPath(pts, t); if (!pt) continue;
        out.push({ id: `mig.${key}`, kind: 'migrants', x: pt.x, y: pt.y, angleDeg: pt.angleDeg, tip: `Migrant column — ${nameOf(o)} → ${nameOf(d)}` });
      }
    }

    // (c) NAMED-NPC ENVOYS — worldState.spatialLedgers.roads.missions (present only when lit).
    if (on('envoys')) {
      const missions = (worldState.spatialLedgers && worldState.spatialLedgers.roads && worldState.spatialLedgers.roads.missions) || {};
      for (const mid of Object.keys(missions).sort()) {
        const m = missions[mid]; if (!m || typeof m !== 'object') continue;
        const pts = ptsOf(m.path); if (pts.length < 2) continue;
        let t; let flip = false;
        if (m.phase === 'visiting') { t = 1; }
        else if (m.phase === 'returning') { const rw = retWeeks(m.destId, m.homeId); t = 1 - progress01(tick, Number(m.legArrivalTick) - rw, Number(m.legArrivalTick)); flip = true; }
        else { t = progress01(tick, m.departTick, m.legArrivalTick); }
        const pt = pointAlongPath(pts, t); if (!pt) continue;
        const purpose = String((m.purpose && m.purpose.kind) || 'business');
        out.push({
          id: `envoy.${mid}`, kind: 'envoys', x: pt.x, y: pt.y,
          angleDeg: flip ? pt.angleDeg + 180 : pt.angleDeg,
          tip: `${m.npcName || 'An envoy'} of ${nameOf(m.homeId)} — ${purpose}`,
        });
      }
    }
    return out;
    // geometryVersion is a deliberate recompute trigger (geography can shift under identical
    // placements on campaign reload / regenerate), mirroring ChainEdges.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeCampaign, placements, savedSettlements, filter, geometryVersion]);

  if (!markers.length) return null;

  return (
    <g className="sf-travelers-layer" data-testid="travelers-overlay" pointerEvents="none">
      {markers.map(m => {
        const color = COLOR[m.kind] || swatch.inkMag3;
        return (
          <g key={m.id} className="sf-traveler" data-traveler={m.kind} role="img" aria-label={m.tip}>
            <title>{m.tip}</title>
            {/* flat marker: an outlined dot (the position) + a direction chevron (the heading) */}
            <circle cx={m.x} cy={m.y} r={2.6} fill={color} stroke={swatch.white} strokeWidth={0.8} />
            <polygon points={chevronPoints(m.x, m.y, m.angleDeg || 0, 4)} fill={color} stroke={swatch.white} strokeWidth={0.5} />
          </g>
        );
      })}
    </g>
  );
}
