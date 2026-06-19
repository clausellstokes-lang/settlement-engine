/**
 * WarFaithMapOverlay — spatial war/faith glyphs over the map (UX Phase 5, plan §4.5).
 *
 * EXTENDS the existing overlay layer (sibling of RelationshipEdges, which already
 * draws the war_front / religious_authority directed EDGES honoring visibility).
 * This component draws the non-edge glyphs derived from the LIVE read-models:
 *
 *   - deployment arrows   home → target (activeDeployments)
 *   - siege rings + a coalition BADGE (count of besiegers)  (liveSieges)
 *   - occupation shading  on conquered nodes  (occupiedSettlements)
 *   - trade-war prize glyph on the contested buyer (third party)  (liveTradeWars)
 *
 * The faith-FRONT overlay is the religious_authority edge already drawn by
 * RelationshipEdges; the per-deity contest depth lives in the Pantheon section.
 *
 * VISIBILITY IS LAW. The siege ring + coalition badge reuse the SAME visibility
 * decision liveSieges already computed (a target whose every war_front is `gm` is
 * GM-only; one `public` front makes it public; `hidden` is dropped upstream). A
 * `gm` siege is drawn ONLY for the DM view (regionalShowGm). Deployment arrows and
 * trade-war prizes are public-tier live ledgers (deployments / tradeWarState are
 * not channel-visibility-scoped), so they draw whenever live — matching how the
 * Realm War panel already surfaces them.
 *
 * INERT WHEN ABSENT. A no-war / no-campaign map yields empty read-models ⇒ this
 * renders nothing (returns null) ⇒ byte-identical off-state. Pure read-models only.
 */

import { useMemo } from 'react';
import { useStore } from '../../store';
import {
  activeDeployments,
  liveSieges,
  liveTradeWars,
  occupiedSettlements,
} from '../../domain/display/warStatus.js';
import { regionalChannelColor } from '../../lib/regionalMapOverlay.js';

// Source the glyph colors from the SAME canonical channel palette the map's other
// overlays use (regionalMapOverlay.CHANNEL_COLORS) so the war/faith glyphs match
// the war_front edge / faith edge exactly — never a re-declared (forkable) hex.
const COLOR_WAR = regionalChannelColor('war_front');             // siege/deploy red
const COLOR_OCCUPATION = regionalChannelColor('criminal_corridor'); // occupation violet
const COLOR_PRIZE = regionalChannelColor('export_market');       // trade-prize gold

/** Map every placement to { settlementId → {x,y} } (string keys). */
function pointsBySettlement(placements) {
  /** @type {Map<string, { x: number, y: number }>} */
  const out = new Map();
  for (const p of Object.values(placements || {})) {
    if (!p?.settlementId) continue;
    if (typeof p.x !== 'number' || typeof p.y !== 'number') continue;
    out.set(String(p.settlementId), { x: p.x, y: p.y });
  }
  return out;
}

export default function WarFaithMapOverlay() {
  const placements       = useStore(s => s.mapState.placements);
  const savedSettlements = useStore(s => s.savedSettlements);
  const campaigns        = useStore(s => s.campaigns);
  const activeCampaignId = useStore(s => s.activeCampaignId);
  // GM view gate — mirrors RelationshipEdges / RegionalCausalityLayer exactly.
  const showGm           = useStore(s => s.mapState.layers.regionalShowGm !== false);
  // War layer can be toggled off in the layers panel like the other overlays; when
  // the key is absent (legacy) default ON so existing maps still show war glyphs.
  const warLayerOn       = useStore(s => s.mapState.layers.warFaith !== false);
  // Re-run the memo on a fresh world (loadSnapshot / regenerate) even when the
  // placement keys are identical — same trigger dep RelationshipEdges uses.
  const geometryVersion  = useStore(s => s.geometryVersion);

  const activeCampaign = useMemo(
    () => (activeCampaignId ? (campaigns || []).find(c => String(c.id) === String(activeCampaignId)) : null) || null,
    [campaigns, activeCampaignId],
  );

  const model = useMemo(() => {
    if (!activeCampaign || !placements) return null;
    const worldState = activeCampaign.worldState || {};
    const regionalGraph = activeCampaign.regionalGraph || worldState.regionalGraph || null;
    const xy = pointsBySettlement(placements);
    if (!xy.size) return null;

    // Member settlement snapshots (for occupation provenance) — only this
    // campaign's saves.
    const memberIds = new Set((activeCampaign.settlementIds || []).map(String));
    const memberItems = (savedSettlements || [])
      .filter(sv => memberIds.has(String(sv.id)))
      .map(sv => ({ id: sv.id, settlement: sv.settlement }));

    // Deployment arrows — home → target. Public-tier ledger.
    const arrows = activeDeployments(worldState)
      .map(d => ({ ...d, from: xy.get(String(d.homeId)), to: xy.get(String(d.targetId)) }))
      .filter(d => d.from && d.to)
      .map(d => ({
        id: `dep-${d.homeId}-${d.targetId}`,
        x1: d.from.x, y1: d.from.y, x2: d.to.x, y2: d.to.y,
      }));

    // Siege rings + coalition badge — VISIBILITY-honored via the per-siege tier
    // liveSieges already resolved (hidden dropped upstream; gm only for DM view).
    const sieges = liveSieges({ worldState, regionalGraph })
      .filter(s => s.visibility !== 'gm' || showGm)
      .map(s => ({ ...s, p: xy.get(String(s.targetId)) }))
      .filter(s => s.p)
      .map(s => ({
        id: `siege-${s.targetId}`,
        x: s.p.x, y: s.p.y,
        coalition: s.frontCount,
        gm: s.visibility === 'gm',
      }));

    // Occupation shading — conquered nodes (conquest provenance on the snapshot).
    const occupations = occupiedSettlements(memberItems)
      .map(o => ({ ...o, p: xy.get(String(o.id)) }))
      .filter(o => o.p)
      .map(o => ({ id: `occ-${o.id}`, x: o.p.x, y: o.p.y }));

    // Trade-war prize glyph — on the contested BUYER (the third party the war is
    // fought over). Public-tier ledger.
    const prizes = liveTradeWars({ worldState, regionalGraph })
      .map(t => ({ ...t, p: xy.get(String(t.buyerId)) }))
      .filter(t => t.p)
      .map(t => ({ id: `prize-${t.prizeId}`, x: t.p.x, y: t.p.y, label: t.commodityLabel }));

    if (!arrows.length && !sieges.length && !occupations.length && !prizes.length) return null;
    return { arrows, sieges, occupations, prizes };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeCampaign, placements, savedSettlements, showGm, geometryVersion]);

  if (!warLayerOn || !model) return null;

  return (
    <g className="sf-war-faith-overlay" pointerEvents="none" data-testid="war-faith-overlay">
      <defs>
        <marker id="sf-deploy-arrow" markerWidth="7" markerHeight="7" refX="5.5" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6 Z" fill={COLOR_WAR} fillOpacity="0.92" />
        </marker>
      </defs>

      {/* ── Occupation shading (drawn first, under everything) ─────────────── */}
      {model.occupations.map(o => (
        <g key={o.id} className="sf-occupation" transform={`translate(${o.x} ${o.y})`}>
          <circle r={13} fill={COLOR_OCCUPATION} fillOpacity={0.16} stroke={COLOR_OCCUPATION} strokeOpacity={0.4} strokeWidth={1} strokeDasharray="3 2">
            <title>Occupied — under an occupation authority</title>
          </circle>
        </g>
      ))}

      {/* ── Deployment arrows (home → target) ─────────────────────────────── */}
      {model.arrows.map(a => (
        <line
          key={a.id}
          className="sf-deployment-arrow"
          x1={a.x1} y1={a.y1} x2={a.x2} y2={a.y2}
          stroke={COLOR_WAR} strokeWidth={2.2} strokeOpacity={0.7}
          strokeLinecap="round" strokeDasharray="7 4"
          markerEnd="url(#sf-deploy-arrow)"
        />
      ))}

      {/* ── Siege rings + coalition badge ─────────────────────────────────── */}
      {model.sieges.map(s => (
        <g key={s.id} className="sf-siege-ring" transform={`translate(${s.x} ${s.y})`}>
          <circle r={10} fill="none" stroke={COLOR_WAR} strokeOpacity={s.gm ? 0.6 : 0.85} strokeWidth={2} strokeDasharray={s.gm ? '4 3' : '5 3'}>
            <title>{`Under siege — coalition of ${s.coalition}`}</title>
          </circle>
          {/* Coalition badge — the count of besiegers (a coalition of 1 still shows). */}
          <g className="sf-coalition-badge" transform="translate(9 -9)">
            <circle r={6.5} fill={COLOR_WAR} fillOpacity={0.95} stroke="#fffbf5" strokeWidth={1.2} />
            <text x="0" y="2.4" textAnchor="middle" fontFamily="Georgia, serif" fontSize="8" fontWeight="800" fill="#fffbf5">
              {s.coalition}
            </text>
          </g>
        </g>
      ))}

      {/* ── Trade-war prize glyph (on the contested buyer) ────────────────── */}
      {model.prizes.map(p => (
        <g key={p.id} className="sf-trade-prize" transform={`translate(${p.x} ${p.y})`}>
          {/* a diamond prize marker offset above the node */}
          <g transform="translate(0 -14)">
            <path d="M0,-5 L5,0 L0,5 L-5,0 Z" fill={COLOR_PRIZE} fillOpacity={0.92} stroke="#fffbf5" strokeWidth={1}>
              <title>{`Trade-war prize${p.label ? `: ${p.label}` : ''}`}</title>
            </path>
          </g>
        </g>
      ))}
    </g>
  );
}
