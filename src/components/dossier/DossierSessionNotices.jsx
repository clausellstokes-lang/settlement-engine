import { FS, SP, swatch } from '../theme.js';
import Button from '../primitives/Button.jsx';
import AvailableAtLaunchPill from '../primitives/AvailableAtLaunchPill.jsx';
import { AiOverlayViolations } from '../primitives/AiOverlayViolations.jsx';
import { RegenerationDeltaCard } from '../primitives/RegenerationDeltaCard.jsx';
import { purchasesOpen } from '../../lib/launchGate.js';
import useIsMobile from '../../hooks/useIsMobile.js';
import { chromeFontSize } from '../../design/proseScale.js';

// Session-level notices cluster (AI error, partial-refinement, verifier
// findings, regenerate delta) — all session-scoped, not tab-scoped, so they
// group as ONE spacing-grouped column (shared gap + inset) instead of
// independently-bordered bands laddering down. Each child keeps its own semantic
// left accent; the wrapper owns only the rhythm, and renders ONLY when at least
// one notice is present so it never paints an empty band above the hero content.
// (P4 / P6 / P5.) Extracted from OutputContainer; presentational only — every
// value + handler arrives via props.
export default function DossierSessionNotices({
  showNarrative,
  aiError,
  aiErrorIsCredits,
  openCreditsMoment,
  partialFailure,
  violations,
  onDismissViolations,
  regenDelta,
  onDismissRegenDelta,
}) {
  const mobile = useIsMobile();
  const hasAiError = !!aiError;
  const hasPartialFailure = !!(showNarrative && partialFailure && partialFailure.failedFields?.length > 0);
  const hasViolations = !!(showNarrative && violations && (violations.length || violations.summary));
  const hasRegenDelta = !!regenDelta;
  if (!(hasAiError || hasPartialFailure || hasViolations || hasRegenDelta)) return null;
  // Pre-launch lockout (lib/launchGate.js): "View plans" opens the credits pricing
  // moment, so it renders disabled and wears the Available at launch pill until
  // purchases open. The error notice itself still shows.
  const purchasesAreOpen = purchasesOpen();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: SP.sm, margin: `${SP.sm}px ${SP.lg}px 0` }}>
      {/* AI error — persistent inline notice (replaces the old floating tooltip),
          with a recovery CTA per error class: a credits error opens the pricing
          moment; the save-first message already names its own action. role=alert
          + aria-live so it's announced. (P10.) */}
      {hasAiError && (
        <div
          role="alert"
          aria-live="assertive"
          style={{
            display: 'flex', alignItems: 'center', gap: SP.sm, flexWrap: 'wrap',
            padding: '8px 12px',
            background: swatch.dangerBg,
            borderLeft: '3px solid ' + swatch.danger,
            fontSize: chromeFontSize(FS.xs, mobile), color: swatch['#5A1A1A'],
            fontFamily: 'Nunito, sans-serif',
          }}
        >
          <span style={{ flex: 1, minWidth: 0 }}>{aiError}</span>
          {aiErrorIsCredits && (
            <Button variant="secondary" size="sm" disabled={!purchasesAreOpen} onClick={openCreditsMoment} style={{ flexShrink: 0, ...(purchasesAreOpen ? null : { flexWrap: 'wrap' }) }}>
              View plans
              {!purchasesAreOpen && <AvailableAtLaunchPill style={{ marginLeft: 6 }} />}
            </Button>
          )}
        </div>
      )}
      {/* Partial-refinement notice — de-boxed to the established left-accent idiom
          (3px amber left border + tint, no 4-side border/radius) so it groups
          with the sibling accent cards instead of being the one boxed holdout.
          (P5.) */}
      {hasPartialFailure && (
        <div
          style={{
            padding: '6px 0 6px 10px',
            background: 'rgba(196,128,60,0.08)',
            borderLeft: '3px solid rgba(196,128,60,0.85)',
            fontSize: chromeFontSize(FS.xs, mobile), color: swatch['#8A5A20'],
            fontFamily: 'Nunito, sans-serif',
          }}
        >{`Partial refinement: ${partialFailure.failedFields.join(', ')} kept raw data.`}</div>
      )}
      {/* Runtime verifier findings — surfaces hard violations (invented entity,
          renamed proper noun, overwritten user edit) so the DM sees the AI output
          isn't safe to ship without inspection. */}
      {showNarrative && (
        <AiOverlayViolations violations={violations} onDismiss={onDismissViolations} />
      )}
      {/* What changed in the most recent regenerate — visible regardless of
          narrative mode so the DM can audit engine-side decisions independently
          of AI prose. */}
      <RegenerationDeltaCard delta={regenDelta} onDismiss={onDismissRegenDelta} />
    </div>
  );
}
