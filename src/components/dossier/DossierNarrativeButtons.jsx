import { FS, swatch, VIOLET_DEEP } from '../theme.js';
import Button from '../primitives/Button.jsx';

// ── Button group state ─────────────────────────────────────────────────────
// Three distinct buttons replace the old single action so view-toggling
// can't accidentally spend credits.
//
// Extracted verbatim from OutputContainer's renderNarrativeButtons(); all
// state/handlers stay in the parent and arrive via props. Presentational only.
export default function DossierNarrativeButtons({
  narrativeEnabled,
  isConfigured,
  getCost,
  aiSettlement,
  aiLoading,
  aiRegenerating,
  displayProgress,
  storeShowNarrative,
  setShowNarrative,
  runNarrativeLayer,
}) {
    // Unsaved settlements: render nothing here. The AI-enrichment affordance
    // moved to a slim hint line below the tab strip so the header stays
    // focused on what the user just generated. This avoids a teaser button
    // that can't actually fire.
    if (!narrativeEnabled) return null;

    const costLabel = isConfigured ? ` (${getCost('narrative')} credits)` : '';
    const btnBase = {
      display: 'flex', alignItems: 'center', gap: 6,
      padding: '6px 14px', borderRadius: 20,
      fontSize: FS.xs, fontWeight: 800,
      fontFamily: 'Nunito, sans-serif', letterSpacing: '0.04em',
      transition: 'all 0.2s', whiteSpace: 'nowrap',
      cursor: 'pointer',
    };

    // State 1: no narrative yet → single generate button
    if (!aiSettlement && !aiLoading) {
      return (
        // aiError no longer renders as a floating tooltip here \u2014 moved to a
        // persistent inline notice + recovery CTA in OutputContainer's session-
        // notices cluster (the strip-band placement floated it off-target). (P10.)
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Button
            variant="ai"
            size="md"
            onClick={runNarrativeLayer}
            title="Narrative Refinement Layer. Turns the simulator output into prose that feels specific to this settlement, and writes daily life dawn to night in the same run. Uses credits."
            icon={<span style={{ fontSize: FS.xs }}>{'\u2726'}</span>}
          >
            {`Generate Narrative${costLabel}`}
          </Button>
        </div>
      );
    }

    // State 2: loading (first-time) → progress chip
    if (aiLoading && !aiRegenerating) {
      return (
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div
            role="status"
            aria-live="polite"
            style={{
              ...btnBase,
              // Opaque violet text token on an opaque violet-tint surface so the
              // progress text clears 4.5:1 on the light strip (the prior
              // translucent-on-translucent pair fell below the floor).
              background: swatch['#EBE2FA'],
              border: '1px solid rgba(160,100,220,0.45)',
              color: VIOLET_DEEP,
              cursor: 'default',
            }}
          >
            <span style={{ display: 'inline-block', animation: 'spin 1.2s linear infinite' }}>{'\u2726'}</span>
            {displayProgress || 'Weaving\u2026'}
          </div>
        </div>
      );
    }

    // State 3 or 4: narrative exists → toggle + regenerate pair
    // (Includes the aiLoading && aiRegenerating case — buttons appear but the
    // Regenerate one is disabled while the new narrative is brewing.)
    const inNarrativeView = storeShowNarrative;
    const regenerating = aiLoading && aiRegenerating;

    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        {/* Toggle view button — the free, safe, expected first click, so it
            stays the dominant action of the pair (gold when already in narrative
            view, else the violet 'ai' affordance). */}
        <Button
          variant={inNarrativeView ? 'gold' : 'ai'}
          size="md"
          onClick={() => setShowNarrative(!inNarrativeView)}
          disabled={regenerating}
          title={inNarrativeView
            ? 'Switch back to the raw simulation. No credits used.'
            : 'Switch to the refined prose. No credits used.'}
        >
          {inNarrativeView ? 'View Raw Simulation' : 'View Narrative'}
        </Button>
        {/* Regenerate button — spends credits AND discards the current prose, so
            it recedes to a low-emphasis ghost: the costly/destructive action must
            never out-shout the free toggle (this reinforces the three-button split
            that exists so view-toggling can't accidentally spend credits). */}
        <Button
          variant="ghost"
          size="md"
          onClick={runNarrativeLayer}
          disabled={regenerating}
          busy={regenerating}
          title={`Regenerate the Narrative Layer from the simulator output, daily life included. Spends ${getCost('narrative')} credits.`}
        >
          {regenerating ? (displayProgress || 'Regenerating\u2026') : `Regenerate${costLabel}`}
        </Button>
        {/* aiError moved to OutputContainer's persistent session-notices cluster
            (with a recovery CTA) \u2014 see State 1 note. (P10.) */}
      </div>
    );
}
