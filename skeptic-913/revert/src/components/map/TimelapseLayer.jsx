/**
 * TimelapseLayer — THE TIMELAPSE OVERLAY (VISION WAVE V-3). A derived-at-render SVG
 * layer (the TravelersLayer / WarFaithMapOverlay sibling) that paints the realm's
 * history at the scrubber's tick: EVENT PULSES (rings on the settlements struck that
 * advance, sized by severity) + settlement TINT (a green/red halo for who grew / who
 * declined). It authors purely in FMG map coordinates as a child of MapOverlay's
 * transformed <g ref={gRef}>, so it inherits the same pan/zoom transform the
 * travelers overlay does (the origin-audited seam) — it never re-projects.
 *
 * CONSTITUTION: purely derived read-only rendering; ZERO sim mutation. Reads the
 * durable pulseHistory only (via buildTimelineTrack). SECRET (§15): the pulse/
 * population truth is DM-secret, so the overlay renders only in the owner's realm
 * session (viewerSeesDmSecrets, fail-closed) and the shared/gallery payload never
 * carries worldState. Zero eager: this component lives in the lazy map chunk.
 * Inactive (timelapseTick == null) ⇒ MapOverlay never mounts it ⇒ byte-inert.
 *
 * @enforced-by tests/domain/timelineTrack.test.js + tests/property/timelineTrackGolden.test.js
 */

import { useMemo } from 'react';
import { useStore } from '../../store';
import { swatch } from '../theme.js';
import { buildTimelineTrack, frameAtTick } from '../../domain/display/timelineTrack.js';
import { viewerSeesDmSecrets } from '../../domain/display/viewerSecrets.js';

// Single-sourced from the swatch registry (never a raw hue literal — the map
// palette single-source + raw-color-literal ratchets).
const GREW = swatch.success;
const FELL = swatch.danger;
const PULSE = swatch['#A0762A'];

export default function TimelapseLayer() {
  const placements = useStore((s) => s.mapState.placements);
  const campaigns = useStore((s) => s.campaigns);
  const activeCampaignId = useStore((s) => s.activeCampaignId);
  const timelapseTick = useStore((s) => s.timelapseTick);
  const geometryVersion = useStore((s) => s.geometryVersion);
  const auth = useStore((s) => s.auth);

  const activeCampaign = useMemo(
    () => (activeCampaignId ? (campaigns || []).find((c) => String(c.id) === String(activeCampaignId)) : null) || null,
    [campaigns, activeCampaignId],
  );

  // §15 SECRETS SEAM: DM-secret; only an authenticated owner session renders it.
  const seesSecrets = viewerSeesDmSecrets({ isOwner: !!auth?.user, authenticated: !!auth?.user });

  const marks = useMemo(() => {
    if (!activeCampaign || !placements || !seesSecrets || timelapseTick == null) return null;
    const worldState = activeCampaign.worldState || {};
    const track = buildTimelineTrack({ worldState });
    const frame = frameAtTick(track, timelapseTick);
    if (!frame) return null;
    const coordinatesBySettlementId = new Map();
    for (const placement of Object.values(placements)) {
      const hasCoordinates = Number.isFinite(placement?.x)
        && Number.isFinite(placement?.y);
      if (placement?.settlementId != null && hasCoordinates) {
        coordinatesBySettlementId.set(
          String(placement.settlementId),
          { x: placement.x, y: placement.y },
        );
      }
    }
    // Tint halos (population grew/declined this frame) render UNDER the pulses.
    const tints = [];
    for (const [id, direction] of Object.entries(frame.deltas)) {
      const coordinates = coordinatesBySettlementId.get(id);
      if (!coordinates) continue;
      tints.push({
        id,
        x: coordinates.x,
        y: coordinates.y,
        color: direction === 'up' ? GREW : FELL,
      });
    }
    const pulses = [];
    for (const pulse of frame.pulses) {
      const coordinates = coordinatesBySettlementId.get(String(pulse.settlementId));
      if (!coordinates) continue;
      const severity = Math.max(0, Math.min(1, pulse.severity));
      pulses.push({
        id: pulse.settlementId,
        x: coordinates.x,
        y: coordinates.y,
        r: 4 + severity * 7,
        opacity: 0.35 + severity * 0.45,
      });
    }
    return { tints, pulses, tick: frame.tick };
    // geometryVersion is a deliberate recompute trigger (geography can shift under
    // identical placements on campaign reload / regenerate), mirroring TravelersLayer.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeCampaign, placements, timelapseTick, seesSecrets, geometryVersion]);

  if (!marks || (marks.tints.length === 0 && marks.pulses.length === 0)) return null;

  return (
    <g className="sf-timelapse-layer" data-testid="timelapse-overlay" pointerEvents="none">
      {marks.tints.map((t) => (
        <circle key={`tint.${t.id}`} cx={t.x} cy={t.y} r={9} fill={t.color} opacity={0.22} />
      ))}
      {marks.pulses.map((p) => (
        <circle key={`pulse.${p.id}`} cx={p.x} cy={p.y} r={p.r} fill="none" stroke={PULSE} strokeWidth={1.4} opacity={p.opacity} />
      ))}
    </g>
  );
}
