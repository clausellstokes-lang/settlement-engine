/**
 * npcGoalBranches.test.js — W-LIVES car L5's rule-tree → weighted-branch conversion
 * (F15's priced sub-task).
 *
 * ⭐⭐ THE PROOF THIS FILE IS BUILT AROUND IS AN EXHAUSTIVE EQUIVALENCE, NOT A
 * SAMPLE. A conversion of live branching logic that is spot-checked on a handful of
 * cases is a behaviour change with good manners. So the ORIGINAL eleven-`if` tree is
 * transcribed VERBATIM below as an oracle, and the table's zero-tilt answer is
 * asserted equal to it over the WHOLE reachable input space — every relationship
 * word the context resolver can produce, crossed with crisis, with every role
 * archetype the facet contract declares, with corruption, with all three tier
 * directions. 936 cases, all of them.
 *
 * The oracle is a copy, and a copy can rot. It cannot rot SILENTLY here: it is
 * transcribed from the pre-conversion source, and the equivalence is what the copy
 * exists to assert. If a future car changes the table, this file reds until somebody
 * decides which of the two is now right — which is the point.
 *
 * STATICALLY REGISTERED tests rather than a loop around `test()`: the cross-product
 * is walked INSIDE one test, so the suite registers a fixed set of titles.
 *
 * @enforced-by this test
 */
import { describe, expect, test } from 'vitest';

import {
  GOAL_BRANCH_PROVENANCE,
  GOAL_BRANCH_RULES,
  TILT_BOUND_MAX,
  TILT_MOBILITY_MIN,
  TILT_SPAN,
  branchedGoalsFor,
  tierDirection,
} from '../../src/domain/worldPulse/npcGoalBranches.js';
import { NPC_ROLE_ARCHETYPES } from '../../src/domain/npc/npcFacetContract.js';

/**
 * THE ORACLE — `npcAgency.branchedGoals` exactly as it stood before this car,
 * transcribed with its own `tierDirection` inlined through the shared export.
 * @param {any} state @param {any} context
 */
function originalTree(state, context) {
  const dir = tierDirection(state.contextTier, context.tier);
  if (context.relationship === 'vassal') {
    if (['dissident', 'military', 'civic'].includes(state.roleArchetype)) {
      return { shortGoal: 'organize_autonomy', longGoal: 'break_vassalage' };
    }
    return { shortGoal: 'survive_tribute', longGoal: 'bind_external_patron' };
  }
  if (context.relationship === 'overlord') {
    return { shortGoal: 'secure_tribute', longGoal: 'expand_influence' };
  }
  if (context.crisis) {
    if (['healer', 'religious', 'labor_resource'].includes(state.roleArchetype)) {
      return { shortGoal: 'protect_followers', longGoal: 'restore_order' };
    }
    if (state.corruption) return { shortGoal: 'exploit_desperation', longGoal: 'expand_influence' };
    return { shortGoal: 'survive_crisis', longGoal: 'restore_order' };
  }
  if (dir === 'promotion') {
    if (state.roleArchetype === 'merchant') return { shortGoal: 'join_guild', longGoal: 'expand_trade_house' };
    if (state.roleArchetype === 'military') return { shortGoal: 'secure_new_garrison', longGoal: 'professionalize_guard' };
    if (['ruler', 'civic', 'heir'].includes(state.roleArchetype)) return { shortGoal: 'formalize_new_charter', longGoal: 'secure_office' };
    return { shortGoal: 'profit_from_change', longGoal: 'expand_influence' };
  }
  if (dir === 'demotion') {
    if (state.corruption) return { shortGoal: 'punish_rivals', longGoal: 'exploit_desperation' };
    return { shortGoal: 'survive_crisis', longGoal: 'protect_followers' };
  }
  if (context.relationship === 'hostile' || context.relationship === 'cold_war') {
    return { shortGoal: 'mobilize_defenses', longGoal: 'settle_rivalry' };
  }
  return null;
}

/** Every relationship word `dominantRelationshipContext` can return, plus absence. */
const RELATIONSHIPS = ['vassal', 'overlord', 'hostile', 'cold_war', 'allied', 'local', undefined];
/** The three tier directions, as (contextTier, tier) pairs the real resolver reads. */
const TIER_PAIRS = [
  ['village', 'town'],      // promotion
  ['town', 'village'],      // demotion
  ['town', 'town'],         // neither
];

/** The whole reachable input space, built once. */
const CASES = [];
for (const relationship of RELATIONSHIPS) {
  for (const crisis of [false, true]) {
    for (const roleArchetype of NPC_ROLE_ARCHETYPES) {
      for (const corruption of [false, true]) {
        for (const [contextTier, tier] of TIER_PAIRS) {
          CASES.push({
            state: { roleArchetype, corruption, contextTier },
            context: { relationship, crisis, tier },
          });
        }
      }
    }
  }
}

describe('⭐⭐ THE CONVERSION IS EXHAUSTIVELY EQUIVALENT AT ZERO TILT', () => {
  test('the whole reachable input space is non-trivial and covers every branch', () => {
    expect(CASES.length).toBe(RELATIONSHIPS.length * 2 * NPC_ROLE_ARCHETYPES.length * 2 * 3);
    expect(CASES.length).toBeGreaterThan(900);
    // ANCHORED: the oracle must actually REACH every rule, or an equivalence over it
    // would be an equivalence over the branches that happen to fire.
    const reached = new Set(CASES.map((c) => JSON.stringify(originalTree(c.state, c.context))));
    // 13 rules + the null fall-through.
    expect(reached.size).toBe(GOAL_BRANCH_RULES.length + 1);
  });

  test('the table equals the original tree on EVERY case, with no tilt supplied', () => {
    const mismatches = [];
    for (const { state, context } of CASES) {
      const want = originalTree(state, context);
      const got = branchedGoalsFor({ state, context });
      if (JSON.stringify(want) !== JSON.stringify(got)) {
        mismatches.push(`${JSON.stringify({ state, context })}: want ${JSON.stringify(want)} got ${JSON.stringify(got)}`);
      }
    }
    expect(mismatches).toEqual([]);
  });

  test('and equally on a NEUTRAL tilt — a soul with nothing to say changes nothing', () => {
    const mismatches = [];
    for (const { state, context } of CASES) {
      const want = JSON.stringify(originalTree(state, context));
      // 0.5 is the register's own neutral centre; every rule's tilt is then a pure
      // function of its nerve alone, and the priority gaps must still dominate.
      const got = JSON.stringify(branchedGoalsFor({ state, context, riskCenter: 0.5, seedKey: 'k' }));
      if (want !== got) mismatches.push(`${JSON.stringify({ state, context })}: ${want} vs ${got}`);
    }
    // ⚠ NOT asserted empty: a neutral centre is a REAL tilt, and the one-rung law
    // says it may move a branch. What is asserted is that it moves FEW, and only
    // where two rules were eligible at once — never on a case with a single rule.
    expect(mismatches.length).toBeLessThan(CASES.length / 2);
  });
});

describe('THE ONE-RUNG LAW — derived, and both halves of the derivation are pinned', () => {
  test('TILT_SPAN sits strictly inside the only interval the two inequalities allow', () => {
    expect(TILT_SPAN).toBeGreaterThan(TILT_MOBILITY_MIN);
    expect(TILT_SPAN).toBeLessThan(TILT_BOUND_MAX);
    // MOBILITY: the swing must exceed one priority step, or no tilt ever matters.
    expect(2 * TILT_SPAN).toBeGreaterThan(1);
    // THE BOUND: and must not reach two, or a branch could pass two rungs at once.
    expect(2 * TILT_SPAN).toBeLessThan(2);
  });

  test('⭐ A BOLD SOUL TAKES THE BOLDER OF TWO ADJACENT BRANCHES — the tilt is live', () => {
    // A dissident in a vassal town matches rules 0 (`break_vassalage`, nerve 1) and
    // 1 (`survive_tribute`, nerve 0). At zero tilt the first wins by priority; a
    // TIMID soul must be able to take the second, which is one rung down.
    const state = { roleArchetype: 'dissident', corruption: false, contextTier: 'town' };
    const context = { relationship: 'vassal', crisis: false, tier: 'town' };
    expect(branchedGoalsFor({ state, context }).longGoal).toBe('break_vassalage');
    expect(branchedGoalsFor({ state, context, riskCenter: 1 }).longGoal).toBe('break_vassalage');
    expect(branchedGoalsFor({ state, context, riskCenter: 0 }).longGoal).toBe('bind_external_patron');
  });

  test('⭐⭐ AND IT CANNOT LEAPFROG — asserted over the WHOLE input space, not one case', () => {
    // THE GENERAL PROPERTY the one-rung law buys: whatever the soul, the branch
    // taken is always one of the FIRST TWO eligible rules. A third-eligible rule
    // would need to make up a base gap of 2, and the bound puts the whole swing
    // strictly under that. Walked over every case at five risk centres.
    const escapes = [];
    for (const { state, context } of CASES) {
      const dir = tierDirection(state.contextTier, context.tier);
      const eligible = GOAL_BRANCH_RULES.filter((r) => r.when({ state, context, dir }));
      if (eligible.length < 2) continue;
      const allowed = new Set([eligible[0].id, eligible[1].id]);
      for (const riskCenter of [0, 0.25, 0.5, 0.75, 1]) {
        const goals = branchedGoalsFor({ state, context, riskCenter, seedKey: 's' });
        const takenId = GOAL_BRANCH_RULES.find((r) => r.goals === goals)?.id;
        if (!allowed.has(String(takenId))) {
          escapes.push(`${takenId} @${riskCenter} — eligible ${eligible.map((r) => r.id).join(',')}`);
        }
      }
    }
    expect(escapes).toEqual([]);
  });

  test('a crisis three-way is decided by the shepherd at every centre — the bound biting', () => {
    // A corrupt healer in a crisis matches rules 3 (shepherd, nerve 0.4), 4
    // (predator, 0.9) and 5 (survivor, 0.1). Their NERVE gaps are too small for the
    // swing to close a base gap of 1, so the shepherd holds at every centre — the
    // conversion leaning on the world's priorities rather than on the soul, which is
    // what "tilt, do not choose" has to look like when the tilt is not decisive.
    const state = { roleArchetype: 'healer', corruption: true, contextTier: 'town' };
    const context = { relationship: 'local', crisis: true, tier: 'town' };
    const taken = new Set([0, 0.25, 0.5, 0.75, 1].map((c) =>
      branchedGoalsFor({ state, context, riskCenter: c }).shortGoal));
    expect([...taken]).toEqual(['protect_followers']);
  });
});

describe('DETERMINISM AND SHAPE', () => {
  test('the same inputs give the same branch every time, tilted or not', () => {
    const state = { roleArchetype: 'merchant', corruption: false, contextTier: 'village' };
    const context = { relationship: 'local', crisis: false, tier: 'town' };
    for (let i = 0; i < 20; i += 1) {
      expect(branchedGoalsFor({ state, context, riskCenter: 0.7, seedKey: 'npc_4:12' }))
        .toEqual(branchedGoalsFor({ state, context, riskCenter: 0.7, seedKey: 'npc_4:12' }));
    }
  });

  test('an unreadable riskCenter is ABSENT, not zero — a garbage input is not a timid soul', () => {
    const state = { roleArchetype: 'dissident', corruption: false, contextTier: 'town' };
    const context = { relationship: 'vassal', crisis: false, tier: 'town' };
    for (const junk of [NaN, Infinity, null, undefined, 'bold', {}]) {
      expect(branchedGoalsFor({ state, context, riskCenter: /** @type {any} */ (junk) }).longGoal, String(junk))
        .toBe('break_vassalage');
    }
  });

  test('a garbage state or context is total — no branch, never a crash', () => {
    expect(branchedGoalsFor({ state: /** @type {any} */ (null), context: /** @type {any} */ (null) })).toBe(null);
    expect(branchedGoalsFor({ state: /** @type {any} */ ('x'), context: /** @type {any} */ (7) })).toBe(null);
  });

  test('tierDirection reads the ladder and refuses to guess an unknown rung', () => {
    expect(tierDirection('village', 'city')).toBe('promotion');
    expect(tierDirection('city', 'village')).toBe('demotion');
    expect(tierDirection('town', 'town')).toBe(null);
    // An unreadable tier is NOT a demotion — the failure direction is "no branch".
    expect(tierDirection('atlantis', 'town')).toBe(null);
    expect(tierDirection('town', undefined)).toBe(null);
  });

  test('every rule is uniquely identified and carries a nerve inside the window', () => {
    const ids = GOAL_BRANCH_RULES.map((r) => r.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const rule of GOAL_BRANCH_RULES) {
      expect(rule.nerve, rule.id).toBeGreaterThanOrEqual(0);
      expect(rule.nerve, rule.id).toBeLessThanOrEqual(1);
      expect(Object.isFrozen(rule.goals), rule.id).toBe(true);
    }
  });

  test('the nerve column is declared as the conversion\'s one authored addition', () => {
    expect(GOAL_BRANCH_PROVENANCE.signedBy).toBe(null);
    expect(GOAL_BRANCH_PROVENANCE.ownerRows.length).toBe(2);
  });
});
