/**
 * structuralOverrideDedup.test.js — a deliberately overridden out-of-tier
 * institution must NOT be double-reported. Before the fix, e.g. a town-tier
 * "Smuggling operation" forced into a village surfaced BOTH a red tier_violation
 * ("requires town tier minimum", severity warning) AND a by_design out_of_tier
 * contradiction ("deliberate override, no fix needed") — the same fact framed
 * as a problem-to-fix and an intentional choice at once. The minTier warning is
 * now suppressed for deliberate overrides; the by_design entry still stands.
 */
import { describe, it, expect } from 'vitest';
import { checkStructuralValidity } from '../../src/generators/structuralValidator.js';

describe('structuralValidator — out-of-tier override dedup', () => {
  it('a deliberate override drops the redundant minTier warning but keeps the by_design contradiction', () => {
    const override = { name: 'Smuggling operation', category: 'criminal', outOfTier: true, nativeTier: 'town' };
    const { violations } = checkStructuralValidity([override], { tier: 'village' });

    const tierViolations = violations.filter(v => v.type === 'tier_violation' && v.institution === 'Smuggling operation');
    const byDesign = violations.filter(v => v.type === 'out_of_tier' && v.institution === 'Smuggling operation');

    // The redundant "requires town tier minimum" warning is suppressed for the override.
    expect(tierViolations).toHaveLength(0);
    // The deliberate-override contradiction is still surfaced — but as by_design, not a red issue.
    expect(byDesign).toHaveLength(1);
    expect(byDesign[0].severity).toBe('by_design');
  });

  it('the dedup is gated on outOfTier: a below-tier institution WITHOUT the override flag still warns', () => {
    const notOverride = { name: 'Smuggling operation', category: 'criminal' };
    const { violations } = checkStructuralValidity([notOverride], { tier: 'village' });

    const tierViolations = violations.filter(v => v.type === 'tier_violation' && v.institution === 'Smuggling operation');
    expect(tierViolations).toHaveLength(1);
    expect(tierViolations[0].severity).toBe('warning');
  });
});
