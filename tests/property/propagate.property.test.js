/**
 * Property-based tests for src/domain/entities/propagate.js
 *
 *   1. Isolated origin → no new impairments anywhere else
 *   2. Damping is monotone: lower damping ⇒ smaller or equal propagated severity
 *   3. BFS terminates (returns finite result) even under construction-induced cycles
 *
 * The propagation engine is the single highest-risk module in the domain
 * layer - it's recursive, the math is custom, and a regression turns one
 * event into an infinite loop or a flat earthquake. These properties
 * lock the two safety knobs (damping, maxHops) and the topology guard
 * (visited set against cycles) at the input-space level.
 */

import { describe, test, expect } from 'vitest';
import fc from 'fast-check';
import { propagateImpairment } from '../../src/domain/entities/propagate.js';

function totalImpairments(settlement) {
  let n = 0;
  for (const i of settlement.institutions || []) n += (i.impairments || []).length;
  for (const f of settlement.factions     || []) n += (f.impairments || []).length;
  for (const f of settlement.powerStructure?.factions || []) n += (f.impairments || []).length;
  return n;
}

// fc.double, not fc.float - float requires 32-bit-representable bounds
// (0.1 is not). The engine math is double-precision anyway.
const sev = fc.double({ min: 0.1, max: 1, noNaN: true });
const causeId = fc.string({ minLength: 1, maxLength: 8 });

describe('propagateImpairment (property-based)', () => {
  test('origin with no linked factions yields no new impairments', () => {
    // Build a settlement where the institution has zero faction edges -
    // no controls/funds/staffs/protects fields touch it. Propagation
    // should return the settlement unchanged.
    fc.assert(fc.property(sev, causeId, (severity, cid) => {
      const settlement = {
        institutions: [{ id: 'inst.alone', name: 'Alone' }],
        factions: [
          // Faction exists, but is linked to a different institution.
          { id: 'faction.other', name: 'Other', controlsInstitutionIds: ['inst.other'] },
        ],
        npcs: [],
      };
      const before = totalImpairments(settlement);
      const next = propagateImpairment({
        settlement,
        origin: {
          entityType: 'institution',
          entityId: 'inst.alone',
          impairment: { type: 'capacity', severity, causeEventId: cid, description: 'A' },
        },
      });
      expect(totalImpairments(next)).toBe(before);
    }), { numRuns: 30 });
  });

  test('lower damping produces equal-or-smaller propagated severity', () => {
    // For a fixed settlement + origin, propagation with damping=0.3
    // must produce a controlling-faction severity ≤ propagation with
    // damping=0.9. This pins the "damping is a real attenuator" guarantee.
    fc.assert(fc.property(sev, causeId, (severity, cid) => {
      const make = () => ({
        institutions: [{ id: 'inst.granary', name: 'Granary' }],
        factions: [
          { id: 'faction.merchants', name: 'Merchants', controlsInstitutionIds: ['inst.granary'] },
        ],
        npcs: [],
      });
      const low = propagateImpairment({
        settlement: make(),
        origin: {
          entityType: 'institution', entityId: 'inst.granary',
          impairment: { type: 'capacity', severity, causeEventId: cid, description: 'A' },
        },
        opts: { damping: 0.3 },
      });
      const high = propagateImpairment({
        settlement: make(),
        origin: {
          entityType: 'institution', entityId: 'inst.granary',
          impairment: { type: 'capacity', severity, causeEventId: cid, description: 'A' },
        },
        opts: { damping: 0.9 },
      });
      // Either both branches produced an impairment (compare severities)
      // OR low damping fell below the 0.05 negligibility threshold and
      // produced none. Both outcomes satisfy "low ≤ high".
      const sevLow  = low.factions[0].impairments?.[0]?.severity ?? 0;
      const sevHigh = high.factions[0].impairments?.[0]?.severity ?? 0;
      expect(sevLow).toBeLessThanOrEqual(sevHigh + 1e-9);
    }), { numRuns: 30 });
  });

  test('terminates with bounded impairment count under cycle-friendly topology', () => {
    // Construct a topology with reciprocal links: faction A controls
    // inst X, and inst X is also touched by faction B which controls
    // inst Y, which is controlled by A. BFS with maxHops=2 must still
    // terminate and total impairments must stay bounded - not infinite,
    // not exponential.
    fc.assert(fc.property(sev, causeId, (severity, cid) => {
      const settlement = {
        institutions: [
          { id: 'inst.x', name: 'X' },
          { id: 'inst.y', name: 'Y' },
        ],
        factions: [
          { id: 'faction.a', name: 'A', controlsInstitutionIds: ['inst.x', 'inst.y'] },
          { id: 'faction.b', name: 'B', controlsInstitutionIds: ['inst.x'] },
        ],
        npcs: [],
      };
      const next = propagateImpairment({
        settlement,
        origin: {
          entityType: 'institution',
          entityId: 'inst.x',
          impairment: { type: 'capacity', severity, causeEventId: cid, description: 'A' },
        },
        opts: { maxHops: 2 },
      });
      // 2 institutions + 2 factions = 4 entities. Each can be touched
      // at most once by propagation (the visited set guarantees it).
      // So total propagated impairments ≤ 4.
      expect(totalImpairments(next)).toBeLessThanOrEqual(4);
    }), { numRuns: 30 });
  });

  // Bonus: maxHops=0 disables propagation entirely.
  test('maxHops=0 produces no propagation', () => {
    fc.assert(fc.property(sev, causeId, (severity, cid) => {
      const settlement = {
        institutions: [{ id: 'inst.granary', name: 'Granary' }],
        factions: [
          { id: 'faction.merchants', name: 'Merchants', controlsInstitutionIds: ['inst.granary'] },
        ],
        npcs: [],
      };
      const next = propagateImpairment({
        settlement,
        origin: {
          entityType: 'institution', entityId: 'inst.granary',
          impairment: { type: 'capacity', severity, causeEventId: cid, description: 'A' },
        },
        opts: { maxHops: 0 },
      });
      expect(totalImpairments(next)).toBe(0);
    }), { numRuns: 20 });
  });
});
