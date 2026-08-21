/**
 * The canonical plan's hover/pin readout.
 *
 * Keeping the mutually exclusive card variants together makes their precedence
 * explicit and keeps SettlementMapPane focused on map composition. The parent
 * mounts this leaf only while the Plan presentation is active.
 */

import InstitutionCard from '../primitives/InstitutionCard.jsx';
import { INK, MUTED } from '../theme.js';
import { DistrictCard, FloatingLabel } from './SettlementMapCards.jsx';

export default function SettlementMapActiveCard({
  active,
  isPinned,
  settlement,
  onClose,
}) {
  if (!active) return null;

  if (active.kind === 'building' && isPinned && active.payload.show) {
    return (
      <InstitutionCard
        open
        institution={active.payload.institution}
        settlement={settlement}
        onClose={onClose}
      />
    );
  }
  if (active.kind === 'building' && !isPinned && active.payload.show) {
    return (
      <FloatingLabel anchor={active.anchor}>
        <strong style={{ color: INK, fontWeight: 800 }}>{active.payload.institution?.name}</strong>
        <span style={{ color: MUTED }}> · click for profile</span>
      </FloatingLabel>
    );
  }
  if (active.kind === 'district') {
    return (
      <DistrictCard
        anchor={active.anchor}
        mapDistrict={active.payload.mapDistrict}
        profile={active.payload.profile}
        provenance={active.payload.provenance}
        pinned={isPinned}
        onClose={onClose}
      />
    );
  }
  if (active.kind === 'hazard' || active.kind === 'condition') {
    return (
      <FloatingLabel anchor={active.anchor}>
        <strong style={{ color: INK, fontWeight: 800 }}>
          {active.payload.label || active.payload.archetype}
        </strong>
        <span style={{ color: MUTED }}>{` · ${active.payload.severityBand || ''}`}</span>
      </FloatingLabel>
    );
  }
  return null;
}
