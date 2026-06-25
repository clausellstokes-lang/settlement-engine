/**
 * tests/domain/events/killNpcDoubleImpair.test.js
 *
 * KILL_NPC stamps direct structural impairments onto the dead NPC's linked
 * institutions and factions, THEN propagates from the NPC origin so those
 * impairments reach their own neighbours. The bug: with no visited-set seeding,
 * propagation re-impaired the very institutions/factions just wounded directly —
 * a second, damped staffing/leadership hit. Because withImpairment is idempotent
 * per (type, cause), that damped hit REPLACED the full direct severity, silently
 * weakening a pillar's death from 1.0 down to the propagated 0.6.
 *
 * The fix seeds propagation's visited set with the directly-impaired entities so
 * each linked entity is impaired EXACTLY once at the correct, full severity.
 */

import { describe, it, expect } from 'vitest';
import { mutateSettlement } from '../../../src/domain/events/mutate.js';

const settlement = () => ({
  name: 'Town',
  institutions: [{ id: 'inst.watch', name: 'City Watch', impairments: [] }],
  powerStructure: { factions: [{ id: 'faction.militia', name: 'Town Militia', impairments: [] }] },
  npcs: [{
    id: 'npc.cap',
    name: 'Captain Vael',
    role: 'Captain',
    importance: 'pillar',
    linkedInstitutionIds: ['inst.watch'],
    linkedFactionIds: ['faction.militia'],
  }],
});

describe('KILL_NPC double-application', () => {
  it('impairs each linked entity EXACTLY once at full direct severity (no propagated clobber)', () => {
    const next = mutateSettlement({
      settlement: settlement(),
      event: { id: 'e1', type: 'KILL_NPC', targetId: 'npc.cap', payload: {} },
    });

    const inst = next.institutions[0];
    const faction = next.powerStructure.factions[0];

    // Direct staffing impairment for a pillar = importanceWeight('pillar') = 1.0.
    // The bug let propagation overwrite it with the damped 0.6 hop value.
    const staffing = (inst.impairments || []).filter(i => i.type === 'staffing');
    expect(staffing).toHaveLength(1);
    expect(staffing[0].severity).toBe(1.0);

    // The pillar's legitimacy impairment is untouched — it has no propagated twin.
    const legitimacy = (inst.impairments || []).filter(i => i.type === 'legitimacy');
    expect(legitimacy).toHaveLength(1);
    expect(legitimacy[0].severity).toBe(0.7);

    // Direct faction leadership impairment for a pillar = 1.0, not the damped 0.6.
    const leadership = (faction.impairments || []).filter(i => i.type === 'leadership');
    expect(leadership).toHaveLength(1);
    expect(leadership[0].severity).toBe(1.0);
  });

  it('KILL_LEADER (forced pillar) does not double-impair its linked entities either', () => {
    const next = mutateSettlement({
      settlement: settlement(),
      // KILL_LEADER reuses killNpcMutation at forced-pillar importance.
      event: { id: 'e2', type: 'KILL_LEADER', targetId: 'npc.cap', payload: {} },
    });

    const inst = next.institutions[0];
    const faction = next.powerStructure.factions[0];

    expect((inst.impairments || []).filter(i => i.type === 'staffing')[0].severity).toBe(1.0);
    expect((faction.impairments || []).filter(i => i.type === 'leadership')[0].severity).toBe(1.0);
  });
});
