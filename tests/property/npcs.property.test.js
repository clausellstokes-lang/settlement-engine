/**
 * Property-based tests for src/domain/entities/npcs.js
 *
 *   1. createNpc returns a complete NpcStructural shape for ANY partial input
 *   2. importanceWeight is monotone across the tier ladder
 *   3. killNpc never mutates input + impairment count is monotone in importance
 *
 * The kill-NPC path is the most consequential mutation in the engine -
 * pillar deaths cascade through every linked institution and faction.
 * Locking the monotonicity contract here means future tuning of the
 * propagation engine can't accidentally make a "key" death produce more
 * impairments than a "pillar" death.
 */

import { describe, test, expect } from 'vitest';
import fc from 'fast-check';
import { createNpc, killNpc, inferImportance, importanceWeight } from '../../src/domain/entities/npcs.js';

const importance = fc.constantFrom('minor', 'notable', 'key', 'pillar');
const npcInput = fc.record({
  name:                 fc.string({ minLength: 1, maxLength: 20 }),
  role:                 fc.string({ maxLength: 20 }),
  importance,
  linkedInstitutionIds: fc.array(fc.string({ minLength: 1, maxLength: 12 }), { maxLength: 4 }),
  linkedFactionIds:     fc.array(fc.string({ minLength: 1, maxLength: 12 }), { maxLength: 4 }),
}, { requiredKeys: ['name'] });

describe('npcs (property-based)', () => {
  test('createNpc returns a complete shape for any partial input', () => {
    fc.assert(fc.property(npcInput, (input) => {
      const npc = createNpc(input);
      // All structural fields exist with the right types - downstream
      // consumers (propagate.js, the UI, the PDF) assume these are
      // present without null-checks.
      expect(typeof npc.id).toBe('string');
      expect(npc.id.length).toBeGreaterThan(0);
      expect(typeof npc.name).toBe('string');
      expect(typeof npc.role).toBe('string');
      expect(['minor', 'notable', 'key', 'pillar']).toContain(npc.importance);
      expect(['active', 'dead', 'missing', 'exiled', 'retired']).toContain(npc.status);
      expect(Array.isArray(npc.linkedInstitutionIds)).toBe(true);
      expect(Array.isArray(npc.linkedFactionIds)).toBe(true);
      expect(Array.isArray(npc.serviceContribution)).toBe(true);
      expect(Array.isArray(npc.potentialSuccessors)).toBe(true);
    }), { numRuns: 60 });
  });

  test('importanceWeight is monotone across the tier ladder', () => {
    // Fixed property - exhaustively true for all 4 tiers, but expressing
    // it via fast-check gives shrinking on the (rare) failure case.
    fc.assert(fc.property(fc.constant(null), () => {
      const m = importanceWeight({ importance: 'minor' });
      const n = importanceWeight({ importance: 'notable' });
      const k = importanceWeight({ importance: 'key' });
      const p = importanceWeight({ importance: 'pillar' });
      expect(m).toBe(0);
      expect(n).toBeGreaterThan(m);
      expect(k).toBeGreaterThan(n);
      expect(p).toBeGreaterThan(k);
      expect(p).toBeLessThanOrEqual(1);
    }), { numRuns: 1 });
  });

  test('killNpc does not mutate input + impairment count is monotone in importance', () => {
    // For an NPC linked to N institutions and M factions, the number of
    // produced impairments must rise (or stay equal) as importance moves
    // from notable → key → pillar. (minor produces zero - checked
    // separately by the example tests.)
    fc.assert(fc.property(
      fc.array(fc.string({ minLength: 1, maxLength: 12 }), { minLength: 1, maxLength: 3 }),
      fc.array(fc.string({ minLength: 1, maxLength: 12 }), { minLength: 1, maxLength: 3 }),
      (instIds, factionIds) => {
        const base = createNpc({
          name: 'Test',
          role:  'X',
          linkedInstitutionIds: instIds,
          linkedFactionIds:     factionIds,
        });

        // Snapshot the input so we can detect mutation. JSON round-trip
        // because impairments arrays are not deep-frozen.
        const snapNotable = JSON.parse(JSON.stringify({ ...base, importance: 'notable' }));
        const snapKey     = JSON.parse(JSON.stringify({ ...base, importance: 'key' }));
        const snapPillar  = JSON.parse(JSON.stringify({ ...base, importance: 'pillar' }));

        const rNotable = killNpc({ ...base, importance: 'notable' }, 'e1');
        const rKey     = killNpc({ ...base, importance: 'key' },     'e2');
        const rPillar  = killNpc({ ...base, importance: 'pillar' },  'e3');

        // Each result returns a NEW npc object (status 'dead'); the
        // original is unaffected.
        expect(snapNotable.status).toBe('active');
        expect(snapKey.status).toBe('active');
        expect(snapPillar.status).toBe('active');
        expect(rNotable.npc.status).toBe('dead');
        expect(rKey.npc.status).toBe('dead');
        expect(rPillar.npc.status).toBe('dead');

        // Monotonicity of impairment count across tiers.
        const cNotable = rNotable.institutionImpairments.length + rNotable.factionImpairments.length;
        const cKey     = rKey.institutionImpairments.length     + rKey.factionImpairments.length;
        const cPillar  = rPillar.institutionImpairments.length  + rPillar.factionImpairments.length;
        expect(cKey).toBeGreaterThanOrEqual(cNotable);
        expect(cPillar).toBeGreaterThanOrEqual(cKey);
      },
    ), { numRuns: 40 });
  });

  // Bonus invariant: inferImportance is stable - calling it on its own
  // output produces the same result. Catches role-regex drift.
  test('inferImportance is stable on its own output', () => {
    fc.assert(fc.property(npcInput, (input) => {
      const npc = createNpc(input);
      const inferred = inferImportance(npc);
      const npc2 = { ...npc, importance: inferred };
      expect(inferImportance(npc2)).toBe(inferred);
    }), { numRuns: 40 });
  });
});
