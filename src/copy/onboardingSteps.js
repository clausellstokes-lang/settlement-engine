/**
 * copy/onboardingSteps.js — Five-step first-run checklist definitions.
 *
 * The audit's onboarding recommendation: replace prose-heavy
 * HowToUse with a short interactive checklist. Each step is a pure
 * predicate against current store state — no separate "I did this"
 * mark-as-done plumbing. The checklist auto-ticks as the user actually
 * does the thing.
 *
 * Order matters: Save before Canonize, Canonize before Event,
 * Event before Export. That sequence teaches the lifecycle.
 */

export const ONBOARDING_STEPS = [
  {
    id: 'generated',
    label: 'Generate your first draft',
    hint:  'Pick Quick or Advanced and click Generate Draft.',
    isComplete: (s) => !!s.settlement,
  },
  {
    id: 'saved',
    label: 'Save it',
    hint:  'Saving keeps your draft for later.',
    isComplete: (s) => Array.isArray(s.savedSettlements) && s.savedSettlements.length > 0,
  },
  {
    id: 'canonized',
    label: 'Canonize for your campaign',
    hint:  'Marks this town as part of your world. Future changes become events.',
    isComplete: (s) => s.phase === 'canon' || !!s.canonizedAt,
  },
  {
    id: 'eventApplied',
    label: 'Apply your first event',
    hint:  'A famine, a fire, a new temple — any change in the world.',
    isComplete: (s) => Array.isArray(s.eventLog) && s.eventLog.length > 0,
  },
  {
    id: 'exported',
    label: 'Export a dossier',
    hint:  'PDF you can bring to the table.',
    isComplete: (s) => !!s.lastExportAt,
  },
];

/** Returns true if every step is complete — drives auto-hide. */
export function isOnboardingComplete(state) {
  return ONBOARDING_STEPS.every(st => st.isComplete(state));
}

/** Index of the next incomplete step (for "what's next" microcopy). */
export function nextOnboardingStep(state) {
  return ONBOARDING_STEPS.find(st => !st.isComplete(state)) || null;
}
