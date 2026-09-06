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
 *  2. ADD_INSTITUTION on a supported removed entity clears only its removal.
 *     ADD_FACTION has no removal lifecycle and is a strict idempotent no-op for
 *     an existing canonical name; it must not become a hidden restore event.
 */

import { describe, it, expect } from 'vitest';
import { mutateSettlement, mutateSettlementChecked } from '../../../src/domain/events/mutate.js';
import { findActiveCondition } from '../../../src/domain/activeConditions.js';

const run = (s, type, targetId, payload) => mutateSettlement({
  settlement: s, event: { id: 'e1', type, targetId, payload },
});

// Landed events wave — needs food_anchor_lost wind-down on the RESTORE_/ADD_INSTITUTION handlers in src/domain/events/mutate.js
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

  it('restoring an UNRELATED wound on a still-broken anchor does NOT clear the food crisis', () => {
    // The granary takes a capacity break (raises the food crisis), then later a
    // separate legitimacy scandal. A RESTORE with no explicit cause undoes the
    // MOST RECENT impairment — the scandal — leaving the capacity break in place.
    // The granary is still physically broken, so the food crisis must survive.
    const base = {
      name: 'Town',
      institutions: [{ id: 'institution.granary', name: 'Granary', status: 'active', impairments: [] }],
    };
    // Capacity break — raises food_anchor_lost.
    let st = mutateSettlement({
      settlement: base,
      event: { id: 'e_break', type: 'IMPAIR_INSTITUTION', targetId: 'institution.granary', payload: { dimension: 'capacity', severity: 0.7 } },
    });
    expect(findActiveCondition(st, 'food_anchor_lost')).not.toBeNull();
    // A LATER, unrelated legitimacy scandal (the most-recent impairment).
    st = mutateSettlement({
      settlement: st,
      event: { id: 'e_scandal', type: 'IMPAIR_INSTITUTION', targetId: 'institution.granary', payload: { dimension: 'legitimacy', severity: 0.4 } },
    });
    // RESTORE with no explicit cause winds down only the most-recent (the scandal).
    st = mutateSettlement({
      settlement: st,
      event: { id: 'e_restore', type: 'RESTORE_INSTITUTION', targetId: 'institution.granary' },
    });

    const granary = st.institutions.find(i => i.id === 'institution.granary');
    // The capacity break still stands; the scandal is gone.
    expect((granary.impairments || []).filter(i => i.type === 'capacity')).toHaveLength(1);
    expect((granary.impairments || []).some(i => i.type === 'legitimacy')).toBe(false);
    // A still-broken granary must NOT read as a healthy food supply.
    expect(findActiveCondition(st, 'food_anchor_lost')).not.toBeNull();
  });

  it('restoring the capacity break itself DOES clear the food crisis (anchor whole again)', () => {
    const base = {
      name: 'Town',
      institutions: [{ id: 'institution.granary', name: 'Granary', status: 'active', impairments: [] }],
    };
    const broken = mutateSettlement({
      settlement: base,
      event: { id: 'e_break', type: 'IMPAIR_INSTITUTION', targetId: 'institution.granary', payload: { dimension: 'capacity', severity: 0.7 } },
    });
    expect(findActiveCondition(broken, 'food_anchor_lost')).not.toBeNull();
    // RESTORE the only impairment (the capacity break) — anchor is whole again.
    const restored = mutateSettlement({
      settlement: broken,
      event: { id: 'e_restore', type: 'RESTORE_INSTITUTION', targetId: 'institution.granary' },
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

// Landed events wave — removal-scoped institution reopening and an explicit
// no-resurrection faction contract.
describe('idempotent add semantics preserve each entity lifecycle', () => {
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

  it('legacy ADD_FACTION on an existing faction remains an unchanged-content no-op', () => {
    const base = {
      name: 'Town',
      powerStructure: {
        factions: [{
          id: 'faction.guild', name: 'Guild', faction: 'Guild', status: 'impaired',
          impairments: [
            { type: 'public_support', severity: 0.4, causeEventId: 'old_riot' },
          ],
        }],
      },
    };
    const event = { id: 'e_add', type: 'ADD_FACTION', targetId: 'faction.guild' };
    const checked = mutateSettlementChecked({ settlement: base, event });
    const legacy = mutateSettlement({ settlement: base, event });

    expect(checked.veto).toEqual({
      __mutationVeto: true,
      code: 'faction_already_present',
      detail: 'guild',
    });
    expect(legacy).toEqual(base);
    expect(legacy).toEqual(checked.settlement);
    expect(legacy.powerStructure.factions[0]).toEqual(base.powerStructure.factions[0]);
  });
});
