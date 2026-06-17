import { FS, swatch } from '../theme.js';
import { Eye, EyeOff, RefreshCw } from 'lucide-react';

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
  aiError,
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
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 6 }}>
          <button
            onClick={runNarrativeLayer}
            title="Narrative Refinement Layer. Turns the simulator output into prose that feels specific to this settlement. Uses credits."
            style={{
              ...btnBase,
              background: 'rgba(90,42,138,0.2)',
              border: '1px solid rgba(160,100,220,0.35)',
              color: swatch['#C8A0F0'],
            }}
          >
            <span style={{ fontSize: FS.xs }}>{'\u2726'}</span>
            {`Generate Narrative${costLabel}`}
          </button>
          {aiError && (
            <div style={{ position: 'absolute', top: '110%', right: 0, background: swatch.errorBgDeep, border: '1px solid #8b1a1a', borderRadius: 6, padding: '8px 12px', fontSize: FS.xs, color: swatch.errorText, whiteSpace: 'nowrap', zIndex: 50, maxWidth: 300, wordBreak: 'break-word' }}>
              {' '}{aiError}
            </div>
          )}
        </div>
      );
    }

    // State 2: loading (first-time) → progress chip
    if (aiLoading && !aiRegenerating) {
      return (
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div
            style={{
              ...btnBase,
              background: 'rgba(90,42,138,0.3)',
              border: '1px solid rgba(160,100,220,0.35)',
              color: 'rgba(200,160,240,0.8)',
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
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 6 }}>
        {/* Toggle view button — free action */}
        <button
          onClick={() => setShowNarrative(!inNarrativeView)}
          disabled={regenerating}
          title={inNarrativeView
            ? 'Switch to the raw generated data (no AI polish). No credits used.'
            : 'Switch to the AI-refined view. No credits used.'}
          style={{
            ...btnBase,
            background: inNarrativeView
              ? 'rgba(156,128,104,0.2)'
              : 'linear-gradient(135deg, #4a1a7a, #6a2a9a)',
            border: inNarrativeView
              ? '1px solid rgba(156,128,104,0.35)'
              : '1px solid rgba(160,100,220,0.6)',
            color: inNarrativeView ? '#c8b89a' : swatch['#F0D8FF'],
            opacity: regenerating ? 0.5 : 1,
            cursor: regenerating ? 'default' : 'pointer',
          }}
        >
          {inNarrativeView
            ? <EyeOff size={12} />
            : <Eye size={12} />}
          {inNarrativeView ? 'View Raw Simulation' : 'View Narrative'}
        </button>
        {/* Regenerate button — spends credits */}
        <button
          onClick={runNarrativeLayer}
          disabled={regenerating}
          title={`Regenerate the Narrative Layer from the simulator output. Spends ${getCost('narrative')} credits.`}
          style={{
            ...btnBase,
            background: regenerating ? 'rgba(90,42,138,0.3)' : 'rgba(90,42,138,0.2)',
            border: '1px solid rgba(160,100,220,0.35)',
            color: regenerating ? 'rgba(200,160,240,0.6)' : swatch['#C8A0F0'],
            cursor: regenerating ? 'default' : 'pointer',
          }}
        >
          {regenerating
            ? <span style={{ display: 'inline-block', animation: 'spin 1.2s linear infinite' }}>{'\u21ba'}</span>
            : <RefreshCw size={12} />}
          {regenerating ? (displayProgress || 'Regenerating\u2026') : `Regenerate${costLabel}`}
        </button>
        {aiError && (
          <div style={{ position: 'absolute', top: '110%', right: 0, background: swatch.errorBgDeep, border: '1px solid #8b1a1a', borderRadius: 6, padding: '8px 12px', fontSize: FS.xs, color: swatch.errorText, whiteSpace: 'nowrap', zIndex: 50, maxWidth: 300, wordBreak: 'break-word' }}>
            {' '}{aiError}
          </div>
        )}
      </div>
    );
}
