/** @vitest-environment jsdom */
/**
 * surveyorGateParity.test.js — the ONE-chokepoint drift guard.
 *
 * The Surveyor entitlement predicate exists in TWO copies on purpose: the door's
 * surveyorGate.isSurveyorTier and the account hook's inlined `surveyorEntitled`.
 * They are physically separate ONLY because a module shared across the door +
 * account lazy chunks rebalances the first-paint budget (+42 B, measured) — the
 * security LOGIC must never diverge. This pin fails the instant the two disagree
 * on ANY input, so "the ONE chokepoint" holds in behavior even across the split.
 */
import { describe, it, expect, vi } from 'vitest';

// useAccountSurveyorGate imports supabase + the store at module load (for its
// hook); stub them so importing the pure predicate is side-effect-free.
vi.mock('../../src/lib/supabase.js', () => ({ supabase: null, isConfigured: false }));
vi.mock('../../src/store/index.js', () => ({ useStore: () => undefined }));

import { isSurveyorTier } from '../../src/components/surveyor/surveyorGate.js';
import { surveyorEntitled } from '../../src/components/account/useAccountSurveyorGate.js';

describe('Surveyor entitlement predicate parity (door vs account copies)', () => {
  it('the two copies agree on every input combination', () => {
    const bools = [true, false, undefined];
    const roles = ['user', 'admin', 'developer', undefined];
    const tiers = ['free', 'premium', undefined];
    for (const hasSurveyorEntitlement of bools) {
      for (const isFounder of bools) {
        for (const role of roles) {
          for (const tier of tiers) {
            const auth = { hasSurveyorEntitlement, isFounder, role, tier };
            expect(
              surveyorEntitled(auth),
              `diverged on ${JSON.stringify(auth)}`,
            ).toBe(isSurveyorTier(auth));
          }
        }
      }
    }
    // null/undefined auth: both fail closed.
    expect(surveyorEntitled(null)).toBe(isSurveyorTier(null));
    expect(surveyorEntitled(undefined)).toBe(isSurveyorTier(undefined));
    // and a Cartographer premium is excluded by both (the discriminator).
    expect(isSurveyorTier({ tier: 'premium' })).toBe(false);
    expect(surveyorEntitled({ tier: 'premium' })).toBe(false);
  });
});
