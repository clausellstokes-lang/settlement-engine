/**
 * PostGenCoach.jsx - Three-step coach shown after a first generation.
 *
 * The pre-generation OnboardingCoach (src/components/OnboardingCoach.jsx)
 * walks the user through "pick a size, hit generate, scroll the tabs".
 * Once they have a settlement, a different conversation starts:
 *
 *   1. Read the dossier - here's what to look at first.
 *   2. Watch how it was simulated - the rail to the right shows it.
 *   3. Save it - sign in to keep it.
 *
 * Source: UI Redesign §18.6. Copy is in src/copy/en.js under
 * onboarding.coach so tone changes happen there, not here.
 *
 * Visibility rules:
 *   - User has at least one settlement on screen.
 *   - User hasn't dismissed (or completed) this coach before - tracked
 *     via localStorage `sf.postGenCoachDismissedAt`.
 *
 * The component renders nothing if any rule fails, so safe to mount
 * unconditionally at the App level.
 */

import { useEffect, useState } from 'react';
import { Sparkles, X, ChevronRight, ChevronLeft, Check } from 'lucide-react';
import { useStore } from '../store/index.js';
import { t } from '../copy/index.js';
import { GOLD, INK, BORDER, sans, serif_, SP, R, FS, swatch, GOLD_DEEP } from './theme.js';

const DISMISS_KEY = 'sf.postGenCoachDismissedAt';
const MUTED = '#6b5340';
const BODY  = '#4A3B22';

function readDismissed() {
  if (typeof window === 'undefined') return false;
  try { return Boolean(window.localStorage.getItem(DISMISS_KEY)); }
  catch { return false; }
}
function writeDismissed() {
  if (typeof window === 'undefined') return;
  try { window.localStorage.setItem(DISMISS_KEY, String(Date.now())); }
  catch { /* private mode */ }
}

const STEPS = [
  { titleKey: 'onboarding.coach.step1Title', bodyKey: 'onboarding.coach.step1Body' },
  { titleKey: 'onboarding.coach.step2Title', bodyKey: 'onboarding.coach.step2Body' },
  { titleKey: 'onboarding.coach.step3Title', bodyKey: 'onboarding.coach.step3Body' },
];

export default function PostGenCoach() {
  const settlement = useStore(s => s.settlement);

  // Skip immediately for users who've already seen / dismissed it.
  // Read once on mount so a fresh write during this session doesn't
  // re-hide the coach mid-flow.
  const [alreadyDismissed] = useState(readDismissed);

  const [step, setStep] = useState(0);
  const [dismissedThisSession, setDismissedThisSession] = useState(false);

  // Auto-dismiss after the final step is acknowledged so future
  // sessions land straight on the dossier.
  useEffect(() => {
    if (dismissedThisSession) writeDismissed();
  }, [dismissedThisSession]);

  if (alreadyDismissed) return null;
  if (dismissedThisSession) return null;
  if (!settlement) return null;

  const isLast = step === STEPS.length - 1;
  const stepDef = STEPS[step];

  function close() {
    setDismissedThisSession(true);
  }
  function next() {
    if (isLast) { close(); return; }
    setStep(s => s + 1);
  }
  function back() {
    if (step > 0) setStep(s => s - 1);
  }

  return (
    <div
      role="dialog"
      aria-labelledby="postgen-coach-title"
      style={{
        position: 'fixed',
        bottom: 24, right: 24, zIndex: 900,
        width: 340, maxWidth: 'calc(100vw - 48px)',
        background: `linear-gradient(180deg, #FBF5E6 0%, #F4EAD0 100%)`,
        border: `1.5px solid ${GOLD}`,
        borderRadius: R.xl,
        boxShadow: '0 12px 32px rgba(27,20,8,0.25)',
        fontFamily: sans, color: INK,
        overflow: 'hidden',
        animation: 'pgc-slide-in 0.3s ease-out',
      }}
    >
      <style>{`
        @keyframes pgc-slide-in {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: SP.sm,
        padding: `${SP.sm + 2}px ${SP.md}px`,
        background: 'rgba(27,20,8,0.06)',
        borderBottom: `1px solid rgba(140,111,50,0.25)`,
      }}>
        <span style={{
          width: 22, height: 22, borderRadius: '50%',
          background: GOLD, color: swatch.white,
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Sparkles size={12} />
        </span>
        <span style={{
          fontSize: FS.xxs, fontWeight: 700, letterSpacing: '0.08em',
          textTransform: 'uppercase', color: GOLD_DEEP,
          flex: 1,
        }}>
          {t('onboarding.coach.welcomeTitle')}
        </span>
        <button
          type="button"
          onClick={close}
          aria-label="Dismiss coach"
          style={{
            background: 'transparent', border: 'none',
            color: MUTED, cursor: 'pointer',
            padding: 2, lineHeight: 0,
          }}
        >
          <X size={14} />
        </button>
      </div>

      {/* Body */}
      <div style={{ padding: `${SP.md}px ${SP.md}px ${SP.lg}px` }}>
        <div style={{
          fontSize: FS.xxs, fontWeight: 700, color: MUTED,
          letterSpacing: '0.08em', textTransform: 'uppercase',
          marginBottom: 4,
        }}>
          Step {step + 1} of {STEPS.length}
        </div>
        <h3 id="postgen-coach-title" style={{
          margin: 0, fontFamily: serif_, fontSize: FS.lg, fontWeight: 600,
          color: INK,
        }}>
          {t(stepDef.titleKey)}
        </h3>
        <p style={{
          margin: `${SP.sm}px 0 0`, fontSize: FS.sm, color: BODY,
          lineHeight: 1.55,
        }}>
          {t(stepDef.bodyKey)}
        </p>

        {/* Progress dots */}
        <div style={{ display: 'flex', gap: 6, marginTop: SP.md }} aria-hidden="true">
          {STEPS.map((_, i) => (
            <span
              key={i}
              style={{
                width: 6, height: 6, borderRadius: '50%',
                background: i === step ? GOLD : 'rgba(140,111,50,0.30)',
                transition: 'background 0.15s',
              }}
            />
          ))}
        </div>

        {/* Actions */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: SP.sm,
          marginTop: SP.md,
        }}>
          {step > 0 && (
            <button
              type="button"
              onClick={back}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 4,
                padding: '6px 10px', borderRadius: R.md,
                background: 'transparent', color: MUTED,
                border: `1px solid ${BORDER}`,
                fontFamily: sans, fontSize: FS.xs, cursor: 'pointer',
              }}
            >
              <ChevronLeft size={12} /> Back
            </button>
          )}
          <span style={{ flex: 1 }} />
          <button
            type="button"
            onClick={close}
            style={{
              background: 'transparent', border: 'none',
              color: MUTED, fontSize: FS.xs, fontFamily: sans,
              cursor: 'pointer', padding: '6px 8px',
            }}
          >
            {t('onboarding.coach.dismiss')}
          </button>
          <button
            type="button"
            onClick={next}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 4,
              padding: '6px 12px', borderRadius: R.md,
              background: GOLD, color: swatch.white, border: 'none',
              fontFamily: sans, fontSize: FS.xs, fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            {isLast ? (<><Check size={12} /> Done</>) : (<>Next <ChevronRight size={12} /></>)}
          </button>
        </div>
      </div>
    </div>
  );
}
