/**
 * HealthPip — the 4-dim resilience band dot on a Library card (UX overhaul
 * Phase 3, plan §4.2). A single colored dot summarising the settlement's worst
 * health band (from deriveSystemState via healthPip()), paired with the
 * "Needs attention" sort key that floats strained/critical settlements up.
 *
 * Always derivable (pure function of the settlement, like the dossier's promoted
 * ReadSystemStateBar) — this is NOT gated like the living-world row, because a
 * peaceful town still has a health band. It is deliberately understated: a quiet
 * "Stable" dot reads the same as a card with no living world, so a peaceful card
 * keeps its current clean appearance.
 *
 * Pure presentational over healthPip().
 */

import { FS, sans } from '../theme.js';

/**
 * @param {{ pip: ReturnType<typeof import('./livingWorldSignals.js').healthPip> }} props
 */
export default function HealthPip({ pip }) {
  if (!pip) return null;
  return (
    <span
      data-testid="health-pip"
      data-band={pip.band}
      title={`Health: ${pip.band} (worst of resilience / volatility / threat / resource pressure)`}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 4,
        fontSize: FS.micro, fontWeight: 700, fontFamily: sans, color: pip.color,
      }}
    >
      <span
        aria-hidden
        style={{ width: 8, height: 8, borderRadius: '50%', background: pip.color, flexShrink: 0, display: 'inline-block' }}
      />
      {pip.band}
    </span>
  );
}
