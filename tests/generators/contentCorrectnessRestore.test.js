/**
 * tests/generators/contentCorrectnessRestore.test.js
 *
 * Restores intent that the prior remediation loosened:
 *
 *  1. Crafts merchant override — the roleToCategory unification dropped the
 *     merchant stress-goal override for the two reachable crafts roles
 *     'Journeyman Overseer' (resolves to crafts: 'journeyman' > 'overseer' under
 *     longest-keyword-first) and 'Craft Guild Representative' (resolves to crafts
 *     via 'craft'). roleTakesMerchantStress now re-includes them, exactly as the
 *     pre-unification hand-rolled merchant test (merchant|guild|factor|overseer)
 *     did. Exercised through the REAL mergeNPCLists path.
 *
 *  2. Feudal-leadership coherence guards — the noble→government HISTORY_EVENTS
 *     merge dropped the requiresInstKeyword palace/royal-seat guards on
 *     Duke/Duchess and Royal Chamberlain. They are restored, and proven through
 *     the REAL getUpgradeOpportunities gate: both roles surface only when a
 *     palace / royal seat / government-complex institution is present.
 */
import { describe, it, expect } from 'vitest';

import { setActiveRng, clearActiveRng } from '../../src/generators/rngContext.js';
import { createPRNG } from '../../src/generators/prng.js';
import { mergeNPCLists } from '../../src/generators/npcGenerator.js';
import { roleTakesMerchantStress } from '../../src/generators/roleCategory.js';
import { getUpgradeOpportunities } from '../../src/generators/economicGenerator.js';
import { HISTORY_EVENTS } from '../../src/data/historyData.js';

// ── 1. Crafts merchant stress override ────────────────────────────────────────

// The exact wartime merchant goal copy (the override the two crafts roles must
// receive). Sourced from STRESS_GOAL_OVERRIDES.wartime.merchant.short.
const WARTIME_MERCHANT_SHORT =
  'Secure a war contract before a rival does, or find a way to profit from the disruption instead of suffering it';

function overrideGoalFor(role) {
  setActiveRng(createPRNG('merchant-override-seed'));
  try {
    const npcs = [{ name: 'Subject', role, category: 'crafts', goal: { short: 'ORIGINAL crafts goal', long: 'orig-long' } }];
    const factions = [{ faction: 'The Crafts Guild', category: 'crafts', power: 30, isGoverning: true }];
    const out = mergeNPCLists(npcs, factions, [{ name: 'Guildhall' }], 'city', { stressType: 'wartime' });
    return out[0].goal.short;
  } finally {
    clearActiveRng();
  }
}

describe('roleTakesMerchantStress (predicate)', () => {
  it('includes the economy category and the two guild/overseer crafts roles', () => {
    expect(roleTakesMerchantStress('Wealthiest Merchant')).toBe(true); // economy
    expect(roleTakesMerchantStress('Grain Factor')).toBe(true); // economy
    expect(roleTakesMerchantStress('Journeyman Overseer')).toBe(true); // crafts → restored
    expect(roleTakesMerchantStress('Craft Guild Representative')).toBe(true); // crafts → restored
  });

  it('does NOT widen to ordinary crafts / unrelated roles', () => {
    expect(roleTakesMerchantStress('Master Potter')).toBe(false);
    expect(roleTakesMerchantStress('Master Blacksmith')).toBe(false);
    expect(roleTakesMerchantStress('Parish Priest')).toBe(false);
    expect(roleTakesMerchantStress('')).toBe(false);
    expect(roleTakesMerchantStress(null)).toBe(false);
  });
});

describe('merchant stress override reaches the two crafts roles (real mergeNPCLists)', () => {
  it.each(['Journeyman Overseer', 'Craft Guild Representative'])(
    '%s receives the merchant wartime override',
    (role) => {
      expect(overrideGoalFor(role)).toBe(WARTIME_MERCHANT_SHORT);
    },
  );

  it('an ordinary crafts role (Master Potter) keeps its original goal — fix is scoped, not blanket', () => {
    expect(overrideGoalFor('Master Potter')).toBe('ORIGINAL crafts goal');
  });

  it('a control economy role (Merchant) also receives the override', () => {
    expect(overrideGoalFor('Wealthiest Merchant')).toBe(WARTIME_MERCHANT_SHORT);
  });
});

// ── 2. Feudal-leadership requiresInstKeyword coherence guards ──────────────────

describe('Duke/Duchess + Royal Chamberlain carry palace/royal-seat guards', () => {
  it('the HISTORY_EVENTS government bucket pins the restored requiresInstKeyword guards', () => {
    const gov = HISTORY_EVENTS.government || [];
    const duke = gov.find((r) => r.role === 'Duke/Duchess');
    const chamberlain = gov.find((r) => r.role === 'Royal Chamberlain');
    expect(duke).toBeTruthy();
    expect(chamberlain).toBeTruthy();
    expect(duke.requiresInstKeyword).toEqual(['palace', 'royal seat', 'noble governor', 'government complex']);
    expect(chamberlain.requiresInstKeyword).toEqual(['palace', 'royal seat', 'government complex']);
  });

  // Real gate: a government-categorized institution is present in EVERY case, so
  // the dual-axis category gate is satisfied — the ONLY discriminator left is the
  // requiresInstKeyword (palace) guard.
  const govInst = { name: 'Town hall', category: 'government', priorityCategory: 'government' };
  const roleNames = (arr) => arr.map((r) => r.role);

  it('Duke/Chamberlain surface only when a palace/royal-seat institution exists', () => {
    const palace = { name: 'Royal palace', category: 'government', priorityCategory: 'government' };
    const withSeat = roleNames(getUpgradeOpportunities([govInst, palace], 'metropolis', {}));
    const withoutSeat = roleNames(getUpgradeOpportunities([govInst], 'metropolis', {}));

    expect(withSeat).toContain('Duke/Duchess');
    expect(withSeat).toContain('Royal Chamberlain');
    expect(withoutSeat).not.toContain('Duke/Duchess');
    expect(withoutSeat).not.toContain('Royal Chamberlain');
  });

  it('the "government complex" keyword also satisfies the guard', () => {
    const gc = { name: 'Government complex', category: 'government', priorityCategory: 'government' };
    const roles = roleNames(getUpgradeOpportunities([govInst, gc], 'metropolis', {}));
    expect(roles).toContain('Duke/Duchess');
    expect(roles).toContain('Royal Chamberlain');
  });

  it('the guard is the discriminator: an UNGUARDED government role still surfaces with only a town hall', () => {
    // Baron/Baroness lives in the same government bucket and carries NO
    // requiresInstKeyword, so it must surface in a bare-town-hall metropolis.
    // If the Duke guard were dropped, Duke would surface here too — this is what
    // makes the test above non-vacuous.
    const roles = roleNames(getUpgradeOpportunities([govInst], 'metropolis', {}));
    expect(roles).toContain('Baron/Baroness');
  });
});
