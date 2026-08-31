/**
 * TravelRingsLayer.jsx — POLIS-3's travel-time rings, AMENDED TO HONESTY
 * (A2.1): `hopWeeks` is settlement-pair travel TIME — no per-cell cost field
 * exists — so the "rings" are hopWeeks-BANDED SETTLEMENT GROUPINGS ("within a
 * week's ride"), drawn as a banded halo on each reachable settlement's own
 * marker, NEVER continuous spatial contours (upstream's raw-distance circle is
 * exactly what this refuses — a Euclidean ring would contradict the road
 * geometry the digest actually priced).
 *
 * ANCHOR = the map's selected settlement (the same store selection the herald
 * focus rides). No selection ⇒ the layer renders nothing (the LayersPanel row
 * says so). Season rides the read: hopWeeks prices the CURRENT season's roads
 * (the TravelersLayer idiom).
 *
 * THE GATE (distanceRead's own law: "the entitlement + spatialCanonVersion
 * gate lives at the CALL SITES"): `activeSpatialDigest(worldState)` + a null
 * check IS that gate — the tier check happened once, upstream, at the
 * canonize write. No digest ⇒ nothing renders. Travel times are world facts,
 * not §15 secrets (armies/migrants/envoys are; this layer names none of
 * them) — but the lens still defaults OFF like every DM lens.
 *
 * A TravelersLayer sibling: a derived-at-render SVG <g> inside MapOverlay's
 * transformed group; zero sim mutation; no write path; no persisted state.
 */

import { useMemo } from 'react';

import { useStore } from '../../store/index.js';
import { activeSpatialDigest, hopWeeks } from '../../domain/spatial/distanceRead.js';
import { seasonForTick } from '../../domain/worldPulse/worldState.js';
// The estate's ONE spelling of a week-count in prose. Used rather than a local
// plural ternary because the proseLeak adjacency arm reads `week${…}` as a raw
// engine token reaching a component — and it is right to: a hand-rolled plural
// is exactly how the humanizer gets forked one site at a time.
import { tickDurationLabel } from '../../domain/display/humanizeEngineTokens.js';
import { GOLD, GREEN, MUTED, SECOND, swatch } from '../theme.js';

/** The closed band vocabulary: ceiling (weeks) → word + tone. Unreachable is
 *  its own honest band, never a fabricated far number. */
export const TRAVEL_BANDS = Object.freeze([
  Object.freeze({ id: 'week', ceiling: 1, word: "within a week's ride", color: GREEN }),
  Object.freeze({ id: 'fortnight', ceiling: 2, word: 'a fortnight out', color: GOLD }),
  Object.freeze({ id: 'month', ceiling: 4, word: 'within a month', color: SECOND }),
  Object.freeze({ id: 'far', ceiling: Infinity, word: 'a far road', color: MUTED }),
]);

/** Band a hopWeeks answer. null ⇒ unreachable (its own record). */
export function travelBandOf(weeks) {
  if (weeks == null || !Number.isFinite(weeks)) return null;
  for (const band of TRAVEL_BANDS) if (weeks <= band.ceiling) return band;
  return TRAVEL_BANDS[TRAVEL_BANDS.length - 1];
}

export default function TravelRingsLayer() {
  const placements = useStore(s => s.mapState.placements);
  const savedSettlements = useStore(s => s.savedSettlements);
  const campaigns = useStore(s => s.campaigns);
  const activeCampaignId = useStore(s => s.activeCampaignId);
  const anchorId = useStore(s => s.selectedSettlementId);
  const scale = useStore(s => s.mapState.viewport?.scale || 1);

  const rings = useMemo(() => {
    if (anchorId == null || !placements) return [];
    const campaign = activeCampaignId
      ? (campaigns || []).find(c => String(c.id) === String(activeCampaignId)) || null
      : null;
    const worldState = campaign?.worldState || null;
    // THE CALL-SITE GATE: no stamped spatial canon ⇒ no digest ⇒ nothing.
    const digest = activeSpatialDigest(worldState);
    if (!digest) return [];
    const tick = Math.floor(Number(worldState.tick) || 0);
    const weekTick = Number(worldState?.calendar?.elapsedWeeks);
    const season = seasonForTick(Number.isFinite(weekTick) ? weekTick : tick).season;
    const nameOf = (id) => {
      const s = (savedSettlements || []).find(sv => String(sv?.id) === String(id));
      return (s && (s.settlement?.name || s.name)) || String(id);
    };
    const anchor = String(anchorId);
    const out = [];
    for (const p of Object.values(placements)) {
      if (!p?.settlementId || !Number.isFinite(p.x) || !Number.isFinite(p.y)) continue;
      const id = String(p.settlementId);
      if (id === anchor) continue;
      const weeks = hopWeeks(digest, anchor, id, season);
      const band = travelBandOf(weeks);
      out.push({
        id,
        x: p.x,
        y: p.y,
        band: band ? band.id : 'unreachable',
        color: band ? band.color : swatch.danger,
        tip: band
          ? `${nameOf(id)}: ${band.word} from ${nameOf(anchor)} (${tickDurationLabel(weeks)} by road, this season).`
          : `${nameOf(id)}: no road reaches it from ${nameOf(anchor)}.`,
      });
    }
    return out;
  }, [anchorId, placements, campaigns, activeCampaignId, savedSettlements]);

  if (!rings.length) return null;
  const r = 9 / (scale || 1);
  return (
    <g className="sf-travel-rings-layer" data-testid="travel-rings-overlay" pointerEvents="none">
      {rings.map(ring => (
        <g key={ring.id} data-travel-band={ring.band} role="img" aria-label={ring.tip}>
          <title>{ring.tip}</title>
          <circle cx={ring.x} cy={ring.y} r={r} fill="none" stroke={ring.color} strokeWidth={1.8 / (scale || 1)} opacity={0.85} />
          <circle cx={ring.x} cy={ring.y} r={r * 1.35} fill={ring.color} opacity={0.10} />
        </g>
      ))}
    </g>
  );
}

/** The LayersPanel legend rows (word + tone), exported so the key and the drawn
 *  ring can never disagree (the mapPaletteSingleSource discipline). */
export function travelRingLegend() {
  return TRAVEL_BANDS.map(b => ({ id: b.id, word: b.word, color: b.color }));
}
