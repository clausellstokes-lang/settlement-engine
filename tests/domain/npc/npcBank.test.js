/**
 * npcBank.test.js — DESIGN_NPC_LIFECYCLE §1 + §5 pins for THE BANK.
 *
 * Guards: zero-drift mirror (temperament === the generator's pool; alignment/goal
 * vocab COVERS every value the engine can seed), bank-bounded validation (free-text
 * rejected), the facet-law read (declared over inferred; absent ⇒ null = dormancy),
 * and the transition-typed goal catalog's bank-boundedness.
 */
import { describe, expect, test } from 'vitest';
import { NPC_PERSONALITY_TRAITS } from '../../../src/data/npcData.js';
import {
  NPC_ALIGNMENTS, NPC_TEMPERAMENTS, NPC_ROLE_ARCHETYPES, NPC_GOALS, NPC_SEED_GOALS,
  NPC_GOAL_CATALOG, NPC_FACET_KINDS, ROLE_GOAL_CHAIN,
  npcFacetOf, isBankValid, validateNpcFacet, bankVocabulary,
  goalChainForRole, goalTransitions, roleGoalAffinity, roleInstitutionLegal,
} from '../../../src/domain/npc/npcBank.js';

// The engine's native alignment grid (worldPulse/npcAgency ALIGNMENTS, module-private
// there). The bank MUST cover every one so a seeded npcState.alignment is bank-valid.
const ENGINE_ALIGNMENTS = [
  'lawful_good', 'neutral_good', 'lawful_neutral', 'true_neutral',
  'chaotic_neutral', 'lawful_evil', 'neutral_evil', 'chaotic_evil',
];

describe('NPC bank — zero-drift vocabulary mirror', () => {
  test('temperament vocab is EXACTLY the generator positive-trait pool (counterpart criterion)', () => {
    // If npcData's positive traits drift, this fails the build — the instant NPC's
    // temperament pool and a generated NPC's must stay one vocabulary.
    expect([...NPC_TEMPERAMENTS]).toEqual([...NPC_PERSONALITY_TRAITS.positive]);
  });

  test('alignment vocab covers every value the engine can seed', () => {
    for (const a of ENGINE_ALIGNMENTS) expect(NPC_ALIGNMENTS).toContain(a);
  });

  test('goal vocab covers every base goal the engine seeds (NPC_SEED_GOALS ⊆ NPC_GOALS)', () => {
    for (const g of NPC_SEED_GOALS) expect(NPC_GOALS).toContain(g);
  });

  test('all vocabularies are frozen', () => {
    expect(Object.isFrozen(NPC_ALIGNMENTS)).toBe(true);
    expect(Object.isFrozen(NPC_TEMPERAMENTS)).toBe(true);
    expect(Object.isFrozen(NPC_ROLE_ARCHETYPES)).toBe(true);
    expect(Object.isFrozen(NPC_GOAL_CATALOG)).toBe(true);
  });
});

describe('NPC bank — bank-bounded validation (free-text rejected)', () => {
  test('valid members pass', () => {
    expect(isBankValid('alignment', 'lawful_good')).toBe(true);
    expect(isBankValid('temperament', NPC_TEMPERAMENTS[0])).toBe(true);
    expect(isBankValid('role', 'merchant')).toBe(true);
    expect(isBankValid('goal', 'secure_office')).toBe(true);
  });

  test('free-text and off-vocab strings are rejected', () => {
    expect(isBankValid('alignment', 'super evil overlord')).toBe(false);
    expect(isBankValid('role', 'Supreme Dragon Emperor')).toBe(false);
    expect(isBankValid('goal', 'take over the world')).toBe(false);
    expect(validateNpcFacet('alignment', 'not a real alignment').ok).toBe(false);
    expect(validateNpcFacet('temperament', 'chaotic and cool').ok).toBe(false);
  });

  test('unknown facet kinds and non-strings are rejected', () => {
    expect(isBankValid('hairColor', 'brown')).toBe(false);
    expect(isBankValid('alignment', 42)).toBe(false);
    expect(isBankValid('alignment', null)).toBe(false);
    expect(validateNpcFacet('hairColor', 'brown').ok).toBe(false);
  });

  test('bankVocabulary returns the right list per kind and null otherwise', () => {
    expect(bankVocabulary('goal')).toBe(NPC_GOALS);
    expect(bankVocabulary('nope')).toBe(null);
    for (const k of NPC_FACET_KINDS) expect(bankVocabulary(k)).not.toBe(null);
  });
});

describe('NPC bank — the facet-law read (declared over inferred; dormancy)', () => {
  test('a declared facet wins over the inferred value', () => {
    const npc = { role: 'baker', facets: { role: 'merchant' } };
    expect(npcFacetOf(npc, 'role')).toBe('merchant');
  });

  test('a facet:<kind>:<value> tag is honored via the chokepoint', () => {
    const npc = { role: 'baker', tags: ['facet:role:criminal'] };
    expect(npcFacetOf(npc, 'role')).toBe('criminal');
  });

  test('absent declaration ⇒ the NPC-native inferred value', () => {
    expect(npcFacetOf({ role: 'guard captain' }, 'role')).toBe('guard captain');
    expect(npcFacetOf({ personality: { dominant: 'brave' } }, 'temperament')).toBe('brave');
    expect(npcFacetOf({ goal: { short: 'secure_office' } }, 'goal')).toBe('secure_office');
  });

  test('absent both ⇒ null (byte-identical dormancy: no declared, nothing to infer)', () => {
    expect(npcFacetOf({}, 'role')).toBe(null);
    expect(npcFacetOf({}, 'alignment')).toBe(null);
    expect(npcFacetOf(null, 'goal')).toBe(null);
    // alignment has no native SimNpc field, so even a fully-populated NPC infers null
    // unless a facet is declared.
    expect(npcFacetOf({ role: 'ruler', personality: { dominant: 'wise' } }, 'alignment')).toBe(null);
  });
});

describe('NPC bank — the transition-typed goal catalog', () => {
  test('every catalog entry is bank-bounded (onAchieve/onFail values are all in NPC_GOALS)', () => {
    for (const [goal, tr] of Object.entries(NPC_GOAL_CATALOG)) {
      expect(NPC_GOALS).toContain(goal);
      for (const s of tr.onAchieve) expect(NPC_GOALS, `${goal}.onAchieve → ${s}`).toContain(s);
      for (const f of tr.onFail) expect(NPC_GOALS, `${goal}.onFail → ${f}`).toContain(f);
      expect(typeof tr.drive).toBe('string');
    }
  });

  test('goalTransitions returns edges for catalog goals and null otherwise', () => {
    expect(goalTransitions('secure_office')).toBeTruthy();
    expect(goalTransitions('not_a_goal')).toBe(null);
  });

  test('every role archetype has a bank-valid opening goal chain', () => {
    for (const role of NPC_ROLE_ARCHETYPES) {
      const chain = goalChainForRole(role);
      expect(isBankValid('goal', chain.short), `${role}.short`).toBe(true);
      expect(isBankValid('goal', chain.long), `${role}.long`).toBe(true);
      // The declared chain is what the ROLE_GOAL_CHAIN table promises.
      expect(chain).toEqual(ROLE_GOAL_CHAIN[role]);
    }
  });

  test('goalChainForRole falls back to the civic default for an unknown role', () => {
    expect(goalChainForRole('llama_wrangler')).toEqual(ROLE_GOAL_CHAIN.civic);
  });

  test('role×goal affinity and role×institution legality are bank-typed', () => {
    expect(roleGoalAffinity('merchant', 'join_guild')).toBe(true);
    expect(roleGoalAffinity('merchant', 'free text goal')).toBe(false);
    expect(roleInstitutionLegal('military', 'security')).toBe(true);
    expect(roleInstitutionLegal('military', 'faith')).toBe(false);
    expect(roleInstitutionLegal('unknown_role', 'anything')).toBe(true);
  });
});
