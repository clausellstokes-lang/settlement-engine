/**
 * OnboardingChecklist — Five-step first-run checklist that auto-ticks
 * itself as the user actually does each thing.
 *
 * The audit's onboarding recommendation: replace prose-heavy long-form
 * help with a short interactive checklist. This component:
 *   - reads completion state from the store via pure predicates
 *     (copy/onboardingSteps.js)
 *   - auto-hides when all steps are complete
 *   - is dismissible; the dismiss state persists in the store
 *   - exposes a "Show getting-started" path elsewhere so dismissed
 *     users can bring it back
 *
 * Accessibility:
 *   - The list is rendered as <ol> with each step as a checkbox-role
 *     <li> so screen readers report progress
 *   - The hide button has an aria-label, not just an icon
 *   - Focus moves to the next-incomplete step on first render so
 *     keyboard users land on what to do next
 */

import { useEffect, useRef } from 'react';
import { FS } from '../theme.js';
import { X, CheckCircle2, Circle } from 'lucide-react';
import { useStore } from '../../store/index.js';
import { ONBOARDING_STEPS, isOnboardingComplete, nextOnboardingStep } from '../../copy/onboardingSteps.js';
import { COPY } from '../../copy/strings.js';
import Card from '../primitives/Card.jsx';
import IconButton from '../primitives/IconButton.jsx';

export default function OnboardingChecklist() {
  const dismissed = useStore(s => s.onboardingChecklistDismissed);
  const dismiss   = useStore(s => s.dismissOnboardingChecklist);
  // Subscribe broadly so the checklist re-evaluates on any state change
  // that could complete a step. We pull the entire store snapshot once
  // per render — cheap, and avoids missed selectors.
  const state     = useStore();

  const focusRef = useRef(null);
  useEffect(() => {
    // Move focus to the next incomplete step on mount so keyboard
    // users can immediately act on the prompt.
    const next = nextOnboardingStep(state);
    if (next && focusRef.current) {
      focusRef.current.focus({ preventScroll: true });
    }
    // Intentionally only on mount — re-focus on every step change would
    // yank focus out from under the user mid-typing.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (dismissed) return null;
  if (isOnboardingComplete(state)) return null;

  const next = nextOnboardingStep(state);

  return (
    <Card
      variant="suggestion"
      kicker={COPY.onboarding.title}
      actions={
        <IconButton
          Icon={X}
          label={COPY.onboarding.hide}
          tone="ghost"
          size="sm"
          onClick={dismiss}
        />
      }
    >
      <ol style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 4 }}>
        {ONBOARDING_STEPS.map(step => {
          const done = step.isComplete(state);
          const isNext = !done && next && step.id === next.id;
          const Icon = done ? CheckCircle2 : Circle;
          return (
            <li
              key={step.id}
              role="checkbox"
              aria-checked={done}
              tabIndex={isNext ? 0 : -1}
              ref={isNext ? focusRef : null}
              style={{
                display: 'flex', alignItems: 'flex-start', gap: 8,
                padding: '4px 6px',
                background: isNext ? 'rgba(160,118,42,0.08)' : 'transparent',
                borderRadius: 4,
                outline: isNext ? '1px dashed rgba(160,118,42,0.4)' : 'none',
              }}
            >
              <Icon
                size={14}
                color={done ? '#1a5a28' : isNext ? '#a0762a' : '#a89880'}
                aria-hidden="true"
                style={{ marginTop: 2, flexShrink: 0 }}
              />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  fontSize: FS.sm,
                  fontWeight: done ? 400 : 700,
                  fontFamily: 'system-ui, -apple-system, sans-serif',
                  color: done ? '#7a5040' : '#1c1409',
                  textDecoration: done ? 'line-through' : 'none',
                  opacity: done ? 0.7 : 1,
                }}>
                  {step.label}
                </div>
                {!done && step.hint && (
                  <div style={{
                    fontSize: FS['10.5'], color: '#7a4f0f', marginTop: 1,
                    fontFamily: 'system-ui, -apple-system, sans-serif',
                    lineHeight: 1.4,
                  }}>
                    {step.hint}
                  </div>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </Card>
  );
}
