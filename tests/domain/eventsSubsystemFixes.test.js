/**
 * Events-subsystem correctness fixes (review bundle B05-domain-events).
 *
 * Each describe block pins one reviewed bug so a regression is caught:
 *   #1  assignNpcMutation heals ONLY the vacancy it fills, not the whole
 *       staffing dimension (multi-vacancy institutions keep unfilled penalties).
 *   #2  target-less PLAGUE / REFUGEE_WAVE onsets get DISTINCT condition ids
 *       (a second onset compounds rather than overwriting the first).
 *   #3  batch validation catches the previously-unguarded hard references
 *       (relationship events, KILL_LEADER, swapWithName, EXPOSE_CORRUPTION npc).
 *   #5  faction-response classification uses the registry's single source of
 *       truth (classifyInstitution) — no drift from the local copy.
 *   #7  swapNpcStanding swaps presence as well as value (no field:undefined).
 *   #8  removedThreat prefers exact match; recoveredResource clears the live
 *       depleted entry with the same slug-tolerance the record uses.
 */

import { describe, test, expect } from 'vitest';
import { mutateSettlement } from '../../src/domain/events/mutate.js';
import { validateBatch, eventConsumes } from '../../src/domain/events/batch.js';
import { generateFactionResponses } from '../../src/domain/events/factionResponses.js';

function ev(type, overrides = {}) {
  return {
    id: `ev_${type}_${Math.random().toString(36).slice(2, 6)}`,
    type,
    targetId: '',
    payload: {},
    cause: 'authoring',
    ...overrides,
  };
}

const staffing = (inst) => (inst?.impairments || []).filter(i => i.type === 'staffing');

// ── #1 assignNpcMutation: vacancy-specific staffing recovery ────────────────

describe('assignNpcMutation heals only the filled vacancy (#1)', () => {
  // An institution with two distinct staffing wounds (two dead pillars / roles).
  function settlementWithTwoVacancies() {
    return {
      institutions: [{
        id: 'institution.watch',
        name: 'City Watch',
        impairments: [
          { type: 'staffing', severity: 0.8, causeEventId: 'kill.captain',  description: 'Lost key staff member: Old Captain (Captain)' },
          { type: 'staffing', severity: 0.6, causeEventId: 'kill.sergeant', description: 'Lost key staff member: Old Sergeant (Sergeant)' },
        ],
      }],
      npcs: [],
      config: {},
    };
  }

  test('fillsVacancyEventId clears ONLY that kill\'s staffing impairment', () => {
    const s = settlementWithTwoVacancies();
    const next = mutateSettlement({
      settlement: s,
      event: ev('ASSIGN_NPC_TO_ROLE', {
        targetId: 'New Captain',
        payload: { institutionId: 'institution.watch', role: 'Captain', quality: 'competent', fillsVacancyEventId: 'kill.captain' },
      }),
    });
    const inst = next.institutions.find(i => i.id === 'institution.watch');
    const remaining = staffing(inst);
    expect(remaining).toHaveLength(1);
    expect(remaining[0].causeEventId).toBe('kill.sergeant');
  });

  test('role discriminator clears only the same-role vacancy', () => {
    const s = settlementWithTwoVacancies();
    const next = mutateSettlement({
      settlement: s,
      event: ev('ASSIGN_NPC_TO_ROLE', {
        targetId: 'New Sergeant',
        payload: { institutionId: 'institution.watch', role: 'Sergeant', quality: 'competent' },
      }),
    });
    const inst = next.institutions.find(i => i.id === 'institution.watch');
    const remaining = staffing(inst);
    expect(remaining).toHaveLength(1);
    expect(remaining[0].causeEventId).toBe('kill.captain');
  });

  test('no discriminator preserves v1 single-vacancy behaviour (clears all staffing)', () => {
    const s = settlementWithTwoVacancies();
    const next = mutateSettlement({
      settlement: s,
      event: ev('ASSIGN_NPC_TO_ROLE', {
        targetId: 'Generic Hire',
        payload: { institutionId: 'institution.watch', quality: 'competent' },
      }),
    });
    const inst = next.institutions.find(i => i.id === 'institution.watch');
    expect(staffing(inst)).toHaveLength(0);
  });
});

// ── #2 distinct condition ids for target-less crises ────────────────────────

describe('target-less PLAGUE / REFUGEE_WAVE onsets get distinct ids (#2)', () => {
  const plagueArchetype = (s) => (s.activeConditions || []).filter(c => c.archetype === 'plague');
  const migrationArchetype = (s) => (s.activeConditions || []).filter(c => c.archetype === 'regional_migration_pressure');

  test('two consecutive unnamed plagues compound (do not overwrite)', () => {
    let s = { institutions: [], npcs: [], config: {}, activeConditions: [] };
    s = mutateSettlement({ settlement: s, event: ev('PLAGUE', { id: 'plague-1', payload: { severity: 0.5 } }) });
    s = mutateSettlement({ settlement: s, event: ev('PLAGUE', { id: 'plague-2', payload: { severity: 0.7 } }) });
    const conds = plagueArchetype(s);
    expect(conds).toHaveLength(2);
    expect(new Set(conds.map(c => c.id)).size).toBe(2);
  });

  test('two consecutive unnamed refugee waves compound', () => {
    let s = { institutions: [], npcs: [], config: {}, activeConditions: [] };
    s = mutateSettlement({ settlement: s, event: ev('REFUGEE_WAVE', { id: 'wave-1', payload: { size: 'small' } }) });
    s = mutateSettlement({ settlement: s, event: ev('REFUGEE_WAVE', { id: 'wave-2', payload: { size: 'large' } }) });
    expect(migrationArchetype(s)).toHaveLength(2);
  });

  test('replaying the same event id is idempotent (same id, no duplicate)', () => {
    let s = { institutions: [], npcs: [], config: {}, activeConditions: [] };
    const e = ev('PLAGUE', { id: 'plague-stable', payload: { severity: 0.5 } });
    s = mutateSettlement({ settlement: s, event: e });
    const firstId = plagueArchetype(s)[0].id;
    s = mutateSettlement({ settlement: s, event: e });
    const conds = plagueArchetype(s);
    expect(conds).toHaveLength(1);
    expect(conds[0].id).toBe(firstId);
  });

  test('a NAMED plague still keys its id off the target (unchanged)', () => {
    let s = { institutions: [], npcs: [], config: {}, activeConditions: [] };
    s = mutateSettlement({ settlement: s, event: ev('PLAGUE', { id: 'pX', targetId: 'Red Fever', payload: { severity: 0.5 } }) });
    // Distinct disease names stay distinct; re-onset of the same name still
    // collapses on the target (the documented behaviour for named crises).
    s = mutateSettlement({ settlement: s, event: ev('PLAGUE', { id: 'pY', targetId: 'Bone Ague', payload: { severity: 0.5 } }) });
    expect(plagueArchetype(s)).toHaveLength(2);
  });
});

// ── #3 batch validation catches previously-unguarded refs ───────────────────

describe('batch validation guards missing hard references (#3)', () => {
  const settlement = {
    institutions: [{ id: 'institution.watch', name: 'City Watch' }],
    powerStructure: { factions: [{ id: 'faction.council', name: 'Council' }] },
    npcs: [
      { id: 'npc.mayor', name: 'The Mayor', importance: 'pillar' },
      { id: 'npc.deputy', name: 'The Deputy', importance: 'key' },
    ],
    neighbourNetwork: [{ name: 'Riverford', relationshipType: 'neutral' }],
    config: {},
  };

  test('eventConsumes now lists the relationship neighbour ref', () => {
    expect(eventConsumes(ev('BROKERED_ALLIANCE', { targetId: 'Riverford' })))
      .toEqual([{ kind: 'neighbour', ref: 'Riverford' }]);
  });

  test('KILL_LEADER hard-requires the NPC', () => {
    expect(eventConsumes(ev('KILL_LEADER', { targetId: 'npc.mayor' })))
      .toEqual([{ kind: 'npc', ref: 'npc.mayor' }]);
  });

  test('PROMOTE_NPC validates the swapWithName peer alternative', () => {
    expect(eventConsumes(ev('PROMOTE_NPC', { targetId: 'npc.deputy', payload: { swapWithName: 'The Mayor' } })))
      .toEqual([{ kind: 'npc', ref: 'npc.deputy' }, { kind: 'npc', ref: 'The Mayor' }]);
  });

  test('relationship event with a real neighbour passes', () => {
    const { ok } = validateBatch(settlement, [ev('BROKERED_ALLIANCE', { targetId: 'Riverford' })]);
    expect(ok).toBe(true);
  });

  test('relationship event with a phantom neighbour blocks', () => {
    const { ok, warnings } = validateBatch(settlement, [ev('SETTLEMENT_DISPUTE', { targetId: 'Nowhere' })]);
    expect(ok).toBe(false);
    expect(warnings.some(w => w.severity === 'block')).toBe(true);
  });

  test('KILL_LEADER with a phantom NPC blocks; a real one passes', () => {
    expect(validateBatch(settlement, [ev('KILL_LEADER', { targetId: 'npc.ghost' })]).ok).toBe(false);
    expect(validateBatch(settlement, [ev('KILL_LEADER', { targetId: 'npc.mayor' })]).ok).toBe(true);
  });

  test('PROMOTE_NPC with a phantom swapWithName peer blocks', () => {
    const { ok } = validateBatch(settlement, [
      ev('PROMOTE_NPC', { targetId: 'npc.deputy', payload: { swapWithName: 'A Stranger' } }),
    ]);
    expect(ok).toBe(false);
  });

  test('EXPOSE_CORRUPTION accepts an NPC target (npc/faction/institution)', () => {
    expect(eventConsumes(ev('EXPOSE_CORRUPTION', { targetId: 'npc.mayor' })))
      .toEqual([{ kind: 'npcOrFactionOrInstitution', ref: 'npc.mayor' }]);
    expect(validateBatch(settlement, [ev('EXPOSE_CORRUPTION', { targetId: 'npc.mayor' })]).ok).toBe(true);
    expect(validateBatch(settlement, [ev('EXPOSE_CORRUPTION', { targetId: 'faction.council' })]).ok).toBe(true);
    expect(validateBatch(settlement, [ev('EXPOSE_CORRUPTION', { targetId: 'institution.watch' })]).ok).toBe(true);
    expect(validateBatch(settlement, [ev('EXPOSE_CORRUPTION', { targetId: 'nobody' })]).ok).toBe(false);
  });
});

// ── #5 faction-response classification single source of truth ───────────────

describe('faction responses classify via the registry (#5)', () => {
  const guild = { factions: [{ name: 'Merchant Guild' }], powerStructure: { factions: [{ name: 'Merchant Guild' }] } };

  test('a market removal classifies as trade (shared category preserved)', () => {
    const [r] = generateFactionResponses(guild, ev('DAMAGE_INSTITUTION', { targetId: 'market' }));
    expect(r.stance).toBe('threat');
  });

  test('a granary removal still classifies as food_storage (shared category)', () => {
    const [r] = generateFactionResponses(guild, ev('REMOVE_INSTITUTION', { targetId: 'institution.granary' }));
    expect(r.stance).toBe('opportunity');
  });

  test('a watch removal classifies as law_enforcement (shared category)', () => {
    const [r] = generateFactionResponses(guild, ev('REMOVE_INSTITUTION', { targetId: 'institution.watch' }));
    expect(r.stance).toBe('opportunity_and_threat');
  });
});

// ── #7 swapNpcStanding swaps presence as well as value ──────────────────────

describe('swapNpcStanding never writes field:undefined (#7)', () => {
  test('a field present on only one peer ends up present on the OTHER, absent on the first', () => {
    const s = {
      institutions: [],
      npcs: [
        // a HAS structuralRank; b does NOT.
        { id: 'npc.a', name: 'Alice', importance: 'key',     influence: 6, structuralRank: 2, factionAffiliation: 'Guild' },
        { id: 'npc.b', name: 'Bob',   importance: 'notable', influence: 3, factionAffiliation: 'Guild' },
      ],
      powerStructure: { factions: [{ id: 'faction.guild', name: 'Guild' }] },
      config: {},
    };
    const next = mutateSettlement({
      settlement: s,
      event: ev('PROMOTE_NPC', { targetId: 'npc.b', payload: { swapWithNpcId: 'npc.a' } }),
    });
    const a = next.npcs.find(n => n.id === 'npc.a');
    const b = next.npcs.find(n => n.id === 'npc.b');
    // After the swap, structuralRank should move to b and be ABSENT (not
    // explicitly undefined) on a.
    expect(b.structuralRank).toBe(2);
    expect('structuralRank' in a).toBe(false);
    // Values still swapped for the shared fields.
    expect(a.importance).toBe('notable');
    expect(b.importance).toBe('key');
  });
});

// ── #8 removedThreat exact-match + recoveredResource slug tolerance ─────────

describe('removedThreat prefers exact match (#8)', () => {
  test('an exact type/name match wins over a substring collision', () => {
    const s = {
      institutions: [],
      npcs: [],
      stressors: [
        { name: 'Pirates raiding the coast', type: 'raid' },
        { name: 'Rats', type: 'vermin' },
      ],
      config: {},
    };
    // Target 'Rats' must strike the vermin stressor, not the 'piRATS' substring.
    const next = mutateSettlement({ settlement: s, event: ev('REMOVED_THREAT', { targetId: 'Rats' }) });
    const names = next.stressors.map(st => st.name);
    expect(names).toContain('Pirates raiding the coast');
    expect(names).not.toContain('Rats');
  });

  test('a 1-3 char label no longer matches greedily by substring', () => {
    const s = {
      institutions: [],
      npcs: [],
      stressors: [{ name: 'Banditry on the road', type: 'crime' }],
      config: {},
    };
    // 'an' is a substring of 'Banditry' but too short to be a discriminating
    // threat label — it must not remove the stressor.
    const next = mutateSettlement({ settlement: s, event: ev('REMOVED_THREAT', { targetId: 'an' }) });
    expect(next.stressors).toHaveLength(1);
  });
});

describe('recoveredResource clears the live depleted entry by slug tolerance (#8)', () => {
  test('a verbatim custom-name depleted entry is cleared even when the target slugifies', () => {
    const s = {
      institutions: [],
      npcs: [],
      config: {
        nearbyResourcesCustom: ['Moonpetal grove'],
        nearbyResourcesDepleted: ['Moonpetal grove'],
        nearbyResourcesState: { 'Moonpetal grove': 'depleted' },
      },
    };
    const next = mutateSettlement({ settlement: s, event: ev('RECOVERED_RESOURCE', { targetId: 'moonpetal_grove' }) });
    expect(next.config.nearbyResourcesDepleted).not.toContain('Moonpetal grove');
    expect(next.config.nearbyResourcesState['Moonpetal grove']).not.toBe('depleted');
    // The record agrees with the live state.
    expect(next.config.resourceEdits.recovered.some(k => k === 'Moonpetal grove' || k === 'moonpetal_grove')).toBe(true);
  });
});
