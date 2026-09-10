/**
 * Property-based tests for src/domain/events/factionResponses.js
 *
 *   1. Never throws for arbitrary event/settlement combos (totality)
 *   2. Always returns an array, possibly empty
 *   3. Every produced response has the required shape
 *      (factionId, factionName, stance, response)
 *
 * factionResponses is invoked from applyEvent on every committed event.
 * A throw would tear down the entire event apply path; a malformed
 * response would crash the UI's response list rendering. These three
 * invariants together guarantee that no event the user can construct
 * breaks the system, regardless of what factions live in the settlement.
 */

import { describe, test, expect } from 'vitest';
import fc from 'fast-check';
import { generateFactionResponses } from '../../src/domain/events/factionResponses.js';

const VALID_STANCES = new Set([
  'opportunity', 'threat', 'opportunity_and_threat', 'neutral',
]);

// All event types the engine ships with — generation should cover
// every branch of every archetype responder.
const eventType = fc.constantFrom(
  'DAMAGE_INSTITUTION', 'REMOVE_INSTITUTION', 'ADD_INSTITUTION',
  'CUT_TRADE_ROUTE', 'DEPLETE_RESOURCE',
  'KILL_NPC', 'KILL_LEADER', 'ASSIGN_NPC_TO_ROLE', 'ADD_NPC',
  'IMPAIR_INSTITUTION', 'RESTORE_INSTITUTION',
  'IMPAIR_FACTION', 'RESTORE_FACTION',
  'EXPOSE_CORRUPTION', 'REFUGEE_WAVE', 'PLAGUE', 'RAID_OR_MONSTER_ATTACK',
  'UNKNOWN_EVENT_TYPE',  // include garbage to exercise the default branch
);

// Faction shapes drawn from the four archetypes the responder handles
// plus a generic faction that should match nothing.
const factionName = fc.constantFrom(
  'Merchant Guild', 'Trade Council', 'Bazaar Cartel',
  'Temple of the Sun', 'High Clergy', 'Stone Monastery',
  'City Watch', 'Militia', 'Sheriff\'s Office',
  'Thieves\' Guild', 'Smuggler\'s Ring', 'Shadow Brotherhood',
  'Generic Council',  // unmatched archetype — produces no response
);

const factionArb = fc.record({
  id: fc.string({ minLength: 1, maxLength: 12 }),
  name: factionName,
});

const settlementArb = fc.record({
  powerStructure: fc.record({
    factions: fc.array(factionArb, { minLength: 0, maxLength: 5 }),
  }),
  institutions: fc.array(fc.record({
    id:   fc.string({ minLength: 1, maxLength: 12 }),
    name: fc.string({ minLength: 1, maxLength: 12 }),
  }), { maxLength: 4 }),
  npcs: fc.array(fc.record({
    id:   fc.string({ minLength: 1, maxLength: 12 }),
    name: fc.string({ minLength: 1, maxLength: 12 }),
  }), { maxLength: 4 }),
});

const eventArb = fc.record({
  id:       fc.string({ minLength: 1, maxLength: 12 }),
  type:     eventType,
  targetId: fc.string({ minLength: 1, maxLength: 20 }),
  payload:  fc.option(fc.record({
    severity:   fc.option(fc.double({ min: 0, max: 1, noNaN: true })),
    importance: fc.option(fc.constantFrom('minor', 'notable', 'key', 'pillar')),
    quality:    fc.option(fc.constantFrom('weak', 'competent', 'popular', 'corrupt', 'faction_captured')),
    role:       fc.option(fc.constantFrom('captain', 'commander', 'sheriff', 'priest')),
  }, { requiredKeys: [] })),
  description: fc.string({ maxLength: 40 }),
});

describe('generateFactionResponses (property-based)', () => {
  test('never throws for arbitrary (settlement, event) combos', () => {
    fc.assert(fc.property(settlementArb, eventArb, (settlement, event) => {
      expect(() => generateFactionResponses(settlement, event)).not.toThrow();
    }), { numRuns: 80 });
  });

  test('always returns an array (possibly empty)', () => {
    fc.assert(fc.property(settlementArb, eventArb, (settlement, event) => {
      const out = generateFactionResponses(settlement, event);
      expect(Array.isArray(out)).toBe(true);
    }), { numRuns: 60 });
    // Edge cases — degenerate inputs.
    expect(Array.isArray(generateFactionResponses(null, null))).toBe(true);
    expect(Array.isArray(generateFactionResponses({}, { type: 'X' }))).toBe(true);
    expect(generateFactionResponses(null, null)).toEqual([]);
  });

  test('every response has the required structural shape', () => {
    fc.assert(fc.property(settlementArb, eventArb, (settlement, event) => {
      const out = generateFactionResponses(settlement, event);
      for (const r of out) {
        expect(typeof r.factionId).toBe('string');
        expect(r.factionId.length).toBeGreaterThan(0);
        expect(typeof r.factionName).toBe('string');
        expect(r.factionName.length).toBeGreaterThan(0);
        expect(VALID_STANCES.has(r.stance)).toBe(true);
        expect(typeof r.response).toBe('string');
        expect(r.response.length).toBeGreaterThan(0);
      }
    }), { numRuns: 60 });
  });

  // Bonus invariant: unmatched archetypes produce no response.
  test('a settlement of only unmatched factions yields zero responses', () => {
    fc.assert(fc.property(eventArb, (event) => {
      const settlement = {
        powerStructure: {
          factions: [
            { id: 'f1', name: 'Generic Council' },
            { id: 'f2', name: 'Unaffiliated Group' },
            { id: 'f3', name: 'Random Society' },
          ],
        },
      };
      expect(generateFactionResponses(settlement, event)).toEqual([]);
    }), { numRuns: 30 });
  });
});
