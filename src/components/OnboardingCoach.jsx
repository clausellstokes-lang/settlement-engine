/**
 * OnboardingCoach.jsx — First-run coaching banner.
 *
 * Renders a contextual banner above the main content that guides new
 * users through their first settlement generation. The banner is:
 *   - Non-blocking (never covers controls)
 *   - Contextual (message matches the current onboarding step)
 *   - Dismissible at any time
 *   - Invisible once the user has completed their first settlement
 *
 * Steps:
 *   0 — Welcome: "Pick a size to start"
 *   1 — Tier chosen: "Now hit Generate"
 *   2 — Settlement generated: "Scroll through tabs to explore"
 *   3 — Explored: "You're all set" (with Finish Tour)
 *   4 — Complete (component returns null)
 */
import { Sparkles, X } from 'lucide-react';
import { useStore } from '../store/index.js';
import { t } from '../copy/index.js';
import { GOLD, GOLD_BG, INK, SECOND, sans, serif_, SP, R, FS } from './theme.js';
import Button from './primitives/Button.jsx';
import IconButton from './primitives/IconButton.jsx';

// Structural metadata only. Titles and bodies route through the copy
// registry (onboarding.firstRun.*) so tone changes happen there, mirroring
// the sibling PostGenCoach. `id` and `highlight` are wiring, not user copy.
const STEP_CONTENT = [
  { id: 'welcome', titleKey: 'onboarding.firstRun.step0Title', bodyKey: 'onboarding.firstRun.step0Body', highlight: 'tier-selector' },
  { id: 'ready',   titleKey: 'onboarding.firstRun.step1Title', bodyKey: 'onboarding.firstRun.step1Body', highlight: 'generate-button' },
  { id: 'explore', titleKey: 'onboarding.firstRun.step2Title', bodyKey: 'onboarding.firstRun.step2Body', highlight: 'output-tabs' },
  { id: 'done',    titleKey: 'onboarding.firstRun.step3Title', bodyKey: 'onboarding.firstRun.step3Body', highlight: null },
];

export default function OnboardingCoach() {
  const onboardingActive = useStore(s => s.onboardingActive);
  const onboardingStep = useStore(s => s.onboardingStep);
  const completeOnboarding = useStore(s => s.completeOnboarding);

  if (!onboardingActive) return null;
  if (onboardingStep >= STEP_CONTENT.length) return null;

  const content = STEP_CONTENT[onboardingStep];
  const isFinalStep = onboardingStep === STEP_CONTENT.length - 1;

  return (
    <>
      <style>{`
        @keyframes onboard-pulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(160, 118, 42, 0.55); }
          50% { box-shadow: 0 0 0 8px rgba(160, 118, 42, 0); }
        }
        [data-onboard-highlight="true"] {
          animation: onboard-pulse 1.8s ease-in-out infinite;
          position: relative;
          border-radius: 10px;
        }
        @keyframes onboard-slide-in {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
      <div
        role="status"
        aria-live="polite"
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: SP.md,
          padding: `${SP.md}px ${SP.lg}px`,
          marginBottom: SP.lg,
          background: 'linear-gradient(135deg, #fef9ee 0%, #fdf3d8 100%)',
          border: `1.5px solid ${GOLD}`,
          borderLeft: `5px solid ${GOLD}`,
          borderRadius: R.lg,
          boxShadow: '0 2px 14px rgba(160,118,42,0.18)',
          animation: 'onboard-slide-in 0.35s ease-out',
          fontFamily: sans,
        }}
      >
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 36,
          height: 36,
          borderRadius: '50%',
          background: GOLD_BG,
          border: `1px solid ${GOLD}`,
          flexShrink: 0,
          marginTop: 2,
        }}>
          <Sparkles size={18} color={GOLD} />
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontSize: FS.xxs,
            fontFamily: sans,
            fontWeight: 700,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: GOLD,
            marginBottom: 2,
          }}>
            {t('onboarding.firstRun.stepCounter', { current: onboardingStep + 1, total: STEP_CONTENT.length })}
          </div>
          <div style={{
            fontSize: FS.lg,
            fontFamily: serif_,
            fontWeight: 700,
            color: INK,
            marginBottom: 4,
          }}>
            {t(content.titleKey)}
          </div>
          <div style={{
            fontSize: FS.sm,
            color: SECOND,
            lineHeight: 1.5,
          }}>
            {t(content.bodyKey)}
          </div>

          {isFinalStep && (
            <Button
              variant="primary"
              size="md"
              onClick={completeOnboarding}
              style={{ marginTop: SP.md }}
            >
              {t('onboarding.firstRun.finish')}
            </Button>
          )}
        </div>

        <IconButton
          Icon={X}
          label={t('onboarding.firstRun.dismiss')}
          tone="ghost"
          size="lg"
          onClick={completeOnboarding}
          style={{ flexShrink: 0 }}
        />
      </div>
    </>
  );
}
