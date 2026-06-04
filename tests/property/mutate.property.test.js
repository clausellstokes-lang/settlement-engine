/**
 * Property-based tests for src/domain/events/mutate.js
 *
 *   1. mutateSettlement never mutates its input (frozen-input check)
 *   2. DAMAGE + RESTORE round-trip with matching causeEventId clears
 *      the impairment back to zero
 *   3. KILL_NPC of a pillar with at least one linked institution
 *      produces both staffing AND legitimacy impairments on it
 *
 * These are the structural contracts the event reducer in the store
 * relies on. Property #1 protects redux/zustand immutability - if a
 * future refactor introduces a hidden mutation, the entire React tree
 * stops re-rendering correctly. #2 protects the undo path. #3 protects
 * the pillar-death narrative coherence.
 */

import { describe, test, expect } from 'vitest';
import fc from 'fast-check';
import { mutateSettlement } from '../../src/domain/events/mutate.js';

// Deep-freeze a value so any attempted mutation throws TypeError in strict
// mode. JSON round-trip then freeze recursively - the cleanest way to
// detect "did the function mutate my input?" without instrumenting it.
function deepFreeze(o) {
  if (o && typeof o === 'object') {
    Object.freeze(o);
    for (const k of Object.keys(o)) deepFreeze(o[k]);
  }
  return o;
}

function makeSettlement(opts = {}) {
  return {
    institutions: [
      { id: 'inst.granary', name: 'Granary', impairments: [] },
      { id: 'inst.temple',  name: 'Temple',  impairments: [] },
    ],
    factions: [
      { id: 'faction.merchants', name: 'Merchants', controlsInstitutionIds: ['inst.granary'], impairments: [] },
      { id: 'faction.clergy',    name: 'Clergy',    controlsInstitutionIds: ['inst.temple'],  impairments: [] },
    ],
    npcs: opts.npcs || [],
    config: {},
  };
}

// fc.double, not fc.float - float requires 32-bit-representable bounds
// (0.1 is not). The engine math is double-precision anyway.
const severity = fc.double({ min: 0.1, max: 1, noNaN: true });
const eventId  = fc.string({ minLength: 1, maxLength: 8 });

describe('mutateSettlement (property-based)', () => {
  test('does not mutate the input settlement (deep-frozen)', () => {
    fc.assert(fc.property(severity, eventId, (sev, eid) => {
      const settlement = deepFreeze(makeSettlement());
      const event = {
        id: eid,
        type: 'DAMAGE_INSTITUTION',
        targetId: 'inst.granary',
        payload: { severity: sev },
        description: 'Burned',
      };
      // Should return a new settlement without throwing from the frozen
      // inputs. If mutateSettlement mutates anything in place, the
      // frozen object throws in strict mode and the property fails.
      expect(() => mutateSettlement({ settlement, event })).not.toThrow();
      const next = mutateSettlement({ settlement, event });
      expect(next).not.toBe(settlement);
      // Original granary still has no impairments.
      const origGranary = settlement.institutions.find(i => i.id === 'inst.granary');
      expect(origGranary.impairments).toEqual([]);
    }), { numRuns: 30 });
  });

  test('DAMAGE + RESTORE with matching causeEventId clears the impairment', () => {
    // Apply DAMAGE_INSTITUTION (creates an impairment whose causeEventId
    // is the event id), then RESTORE_INSTITUTION with payload.causeEventId
    // matching that same id. The impairment count on the targeted
    // institution must return to zero - this is the undo guarantee.
    fc.assert(fc.property(severity, eventId, (sev, eid) => {
      const settlement = makeSettlement();
      const damaged = mutateSettlement({
        settlement,
        event: {
          id: eid, type: 'DAMAGE_INSTITUTION',
          targetId: 'inst.granary',
          payload: { severity: sev },
          description: 'Burned',
        },
      });
      const granaryAfterDamage = damaged.institutions.find(i => i.id === 'inst.granary');
      expect((granaryAfterDamage.impairments || []).length).toBeGreaterThan(0);

      const restored = mutateSettlement({
        settlement: damaged,
        event: {
          id: `${eid}-restore`,
          type: 'RESTORE_INSTITUTION',
          targetId: 'inst.granary',
          payload: { causeEventId: eid },
          description: 'Rebuilt',
        },
      });
      const granaryAfterRestore = restored.institutions.find(i => i.id === 'inst.granary');
      expect((granaryAfterRestore.impairments || []).length).toBe(0);
    }), { numRuns: 30 });
  });

  test('KILL_NPC of a pillar with linked institution produces staffing AND legitimacy impairments', () => {
    fc.assert(fc.property(eventId, fc.string({ minLength: 1, maxLength: 10 }), (eid, npcName) => {
      const settlement = makeSettlement({
        npcs: [{
          id: `npc.${npcName}`,
          name: npcName,
          importance: 'pillar',
          status: 'active',
          linkedInstitutionIds: ['inst.temple'],
          linkedFactionIds: [],
          impairments: [],
        }],
      });
      const next = mutateSettlement({
        settlement,
        event: {
          id: eid,
          type: 'KILL_NPC',
          targetId: `npc.${npcName}`,
          payload: { importance: 'pillar' },
          description: 'Slain',
        },
      });
      const temple = next.institutions.find(i => i.id === 'inst.temple');
      const types = (temple.impairments || []).map(i => i.type);
      // Both dimensions of impact must be present - pillar deaths are
      // both a staffing problem and a legitimacy problem for the
      // institution that anchored them.
      expect(types).toContain('staffing');
      expect(types).toContain('legitimacy');
    }), { numRuns: 30 });
  });

  // Bonus: unknown event types are no-ops on the settlement.
  test('unknown event types leave the settlement structurally unchanged', () => {
    fc.assert(fc.property(eventId, (eid) => {
      const settlement = makeSettlement();
      const next = mutateSettlement({
        settlement,
        event: { id: eid, type: 'SOME_UNREGISTERED_EVENT', targetId: 'whatever' },
      });
      // The default-branch path returns the spread-copy of settlement.
      // institutions/factions/npcs should be deeply identical.
      expect(next.institutions).toEqual(settlement.institutions);
      expect(next.factions).toEqual(settlement.factions);
      expect(next.npcs).toEqual(settlement.npcs);
    }), { numRuns: 20 });
  });
});
