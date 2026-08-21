/**
 * HealthPip — the 4-dim resilience band dot on a Library card (UX overhaul
 * Phase 3, plan §4.2). A single colored dot summarising the settlement's worst
 * health band (from deriveSystemState via healthPip()), paired with the
 * "Needs attention" sort key that floats strained/critical settlements up.
 *
 * DORMANCY-QUIET: the caller only renders this dot when the worst band reaches
 * the attention threshold (Vulnerable/Critical) — a peaceful, healthy town shows
 * NO pip, so its card stays byte-identical to today. The component itself is a
 * pure projection over healthPip() and renders nothing for a null pip.
 */

import { FS, sans } from '../theme.js';
import SurveyorGlossary from '../guidance/SurveyorGlossary.jsx';

/**
 * @param {{ pip: ReturnType<typeof import('./livingWorldSignals.js').healthPip> }} props
 */
export default function HealthPip({ pip }) {
  if (!pip) return null;
  // W-GUIDE-2 §6: the band word is a "what am I reading?" glossary affordance
  // (stability-band term). This replaces the native title= teaching tooltip —
  // one migration off the shrink-only title= census — with the uniform in-place
  // glossary card. Honesty-gated: if the band has no glossary entry, the word
  // renders as plain text.
  return (
    <span
      data-testid="health-pip"
      data-band={pip.band}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 4,
        fontSize: FS.xs, fontWeight: 700, fontFamily: sans, color: pip.color,
      }}
    >
      <span
        aria-hidden
        style={{ width: 8, height: 8, borderRadius: '50%', background: pip.color, flexShrink: 0, display: 'inline-block' }}
      />
      <SurveyorGlossary id={`stability-${String(pip.band).toLowerCase()}`}>{pip.band}</SurveyorGlossary>
    </span>
  );
}
