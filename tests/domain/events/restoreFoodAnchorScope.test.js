/**
 * tests/domain/events/restoreFoodAnchorScope.test.js
 *
 * Two siblings of the "fixed one path, missed the sibling" class on the
 * restore / re-add handlers in mutateEntities.js:
 *
 *  1. Restoring or re-opening a food-anchor institution heals the institution
 *     but must ALSO wind down the settlement-level food_anchor_lost condition
 *     its loss raised — otherwise the food crisis outlives the granary's repair.
 *
 *  2. The idempotent re-add path (ADD_INSTITUTION / ADD_FACTION on an existing
 *     entity) must clear ONLY the removal (REMOVED status + removal-caused
 *     impairments), mirroring RESTORE_*. A blanket `impairments: []` wipes
 *     UNRELATED impairments from other in-timeline events.
 */

import { describe, it, expect } from 'vitest';
import { mutateSettlement } from '../../../src/domain/events/mutate.js';
import { findActiveCondition } from '../../../src/domain/activeConditions.js';

const run = (s, type, targetId, payload) => mutateSettlement({
  settlement: s, event: { id: 'e1', type, targetId, payload },
});

describe('food_anchor_lost winds down when the anchor is restored / re-opened', () => {
  it('REMOVE then ADD a granary clears the food_anchor_lost crisis its loss raised', () => {
    const base = {
      name: 'Town',
      institutions: [{ id: 'institution.granary', name: 'Granary', status: 'active', impairments: [] }],
    };
    const removed = run(base, 'REMOVE_INSTITUTION', 'institution.granary');
    expect(findActiveCondition(removed, 'food_anchor_lost')).not.toBeNull();

    const reopened = run(removed, 'ADD_INSTITUTION', 'institution.granary');
    // The food crisis must not outlive the re-opened anchor.
    expect(findActiveCondition(reopened, 'food_anchor_lost')).toBeNull();
    const granary = reopened.institutions.find(i => i.id === 'institution.granary');
    expect(granary.status).toBe('active');
  });

  it('DAMAGE then RESTORE a mill clears the food_anchor_lost crisis the damage raised', () => {
    const base = {
      name: 'Town',
      institutions: [{ id: 'institution.grist_mill', name: 'Grist Mill', status: 'active', impairments: [] }],
    };
    const damaged = mutateSettlement({
      settlement: base,
      event: { id: 'e_dmg', type: 'DAMAGE_INSTITUTION', targetId: 'institution.grist_mill', payload: { severity: 0.7 } },
    });
    expect(findActiveCondition(damaged, 'food_anchor_lost')).not.toBeNull();

    const restored = mutateSettlement({
      settlement: damaged,
      event: { id: 'e_dmg', type: 'RESTORE_INSTITUTION', targetId: 'institution.grist_mill' },
    });
    expect(findActiveCondition(restored, 'food_anchor_lost')).toBeNull();
  });

  it('restoring one anchor does NOT clear a food crisis raised by a DIFFERENT anchor', () => {
    const base = {
      name: 'Town',
      institutions: [
        { id: 'institution.granary', name: 'Granary', status: 'active', impairments: [] },
        { id: 'institution.fishery', name: 'Fishery', status: 'active', impairments: [] },
      ],
    };
    let s = mutateSettlement({ settlement: base, event: { id: 'e_g', type: 'REMOVE_INSTITUTION', targetId: 'institution.granary' } });
    s = mutateSettlement({ settlement: s, event: { id: 'e_f', type: 'REMOVE_INSTITUTION', targetId: 'institution.fishery' } });
    // Re-open only the granary.
    s = mutateSettlement({ settlement: s, event: { id: 'e_g', type: 'ADD_INSTITUTION', targetId: 'institution.granary' } });

    const conds = (s.activeConditions || []).filter(c => c.archetype === 'food_anchor_lost');
    expect(conds).toHaveLength(1);
    expect(conds[0].triggeredAt.sourceEventTargetId).toBe('institution.fishery');
  });
});

describe('idempotent re-add clears ONLY the removal, not unrelated impairments', () => {
  it('ADD_INSTITUTION on a removed institution preserves an impairment from an unrelated event', () => {
    const base = {
      name: 'Town',
      institutions: [{
        id: 'institution.barracks', name: 'Barracks', status: 'removed',
        removedByEventId: 'e_close',
        impairments: [
          // Pre-existing wound from a SEPARATE event — must survive the re-open.
          { type: 'legitimacy', severity: 0.3, causeEventId: 'old_scandal' },
          // A wound the removal itself caused — must be cleared.
          { type: 'capacity', severity: 1.0, causeEventId: 'e_close' },
        ],
      }],
    };
    const reopened = run(base, 'ADD_INSTITUTION', 'institution.barracks');
    const barracks = reopened.institutions.find(i => i.id === 'institution.barracks');
    const causes = (barracks.impairments || []).map(i => i.causeEventId);
    expect(causes).toContain('old_scandal');
    expect(causes).not.toContain('e_close');
    expect(barracks.removedByEventId).toBeUndefined();
  });

  it('ADD_FACTION on a removed faction preserves an impairment from an unrelated event', () => {
    const base = {
      name: 'Town',
      powerStructure: {
        factions: [{
          id: 'faction.guild', name: 'Guild', faction: 'Guild', status: 'removed',
          removedByEventId: 'e_disband',
          impairments: [
            { type: 'public_support', severity: 0.4, causeEventId: 'old_riot' },
            { type: 'membership', severity: 1.0, causeEventId: 'e_disband' },
          ],
        }],
      },
    };
    const readded = run(base, 'ADD_FACTION', 'faction.guild');
    const guild = readded.powerStructure.factions.find(f => f.id === 'faction.guild');
    const causes = (guild.impairments || []).map(i => i.causeEventId);
    expect(causes).toContain('old_riot');
    expect(causes).not.toContain('e_disband');
    expect(guild.removedByEventId).toBeUndefined();
  });
});
