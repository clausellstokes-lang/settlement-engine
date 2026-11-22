import { describe, expect, it } from 'vitest';
import {
  advanceNpcLadder,
  appendNpcLadderSeatTransition,
} from '../../src/domain/worldPulse/npcLadderKernel.js';
import {
  LADDER_TUNING,
  ladderFactionKey,
  normalizeRecord,
  normalizeSeatTransitions,
  sortedRecord,
} from '../../src/domain/worldPulse/npcLadderState.js';

const guild = { id: 'guild.ashford', name: 'Ashford Guild', isGoverning: true, power: 60 };

function npc(id, name, importance, dots, rank, extra = {}) {
  return {
    id,
    name,
    role: name,
    importance,
    dots,
    structuralRank: rank,
    factionAffiliation: guild.name,
    personality: { dominant: 'shrewd', flaw: 'proud', modifier: 'bold' },
    ...extra,
  };
}

function settlement(npcs) {
  return {
    name: 'Ashford',
    tier: 'city',
    population: 9000,
    powerStructure: { factions: [guild], publicLegitimacy: { score: 55 } },
    npcs,
    institutions: [],
    activeConditions: [],
  };
}

function advance(town, worldState, tick) {
  const item = { id: 'a', name: 'Ashford', settlement: town };
  return advanceNpcLadder({
    snapshot: { settlements: [item] },
    worldState: {
      ...worldState,
      simulationRules: { ...worldState.simulationRules, npcLadderEnabled: true },
      calendar: { elapsedWeeks: tick },
    },
    settlementUpdates: [{ saveId: 'a', settlement: town }],
    tick,
    now: null,
  });
}

describe('WR-5 ladder-owned seatTransitions', () => {
  it('rejects missing dates and canonicalizes imported history oldest-first', () => {
    const transition = (id, tick) => ({
      id,
      fromRulerId: `old.${id}`,
      toRulerId: `new.${id}`,
      cause: 'appointment',
      tick,
    });
    const rows = [
      transition('later', 9),
      transition('same-b', 4),
      transition('missing-null', null),
      transition('same-a', 4),
      transition('missing-empty', ''),
      transition('missing-blank', '   '),
      transition('first', 0),
    ];

    expect(normalizeSeatTransitions(rows).map((row) => [row.id, row.tick])).toEqual([
      ['first', 0],
      ['same-a', 4],
      ['same-b', 4],
      ['later', 9],
    ]);
    expect(normalizeSeatTransitions([...rows].reverse()))
      .toEqual(normalizeSeatTransitions(rows));
  });

  it('normalizes and serializes the bounded typed shape byte-stably', () => {
    const raw = {
      seatTransitions: [{
        toRulerId: 'new-ruler',
        fromRulerId: 'old-ruler',
        tick: 7.9,
        cause: 'government_change',
        installerFactionName: 'Peace League',
        installerFactionId: 'fac.peace',
        governingFactionName: 'The Regency',
        governingFactionId: 'fac.regency',
        transitionId: 'transfer.7',
        ignored: 'not-authoritative',
        warDemand: {
          targetId: 'foe',
          desiredAction: 'peace',
          decisionId: 'decision.7',
          actorId: 'home',
          ignored: true,
        },
      }],
    };
    const serialized = sortedRecord(normalizeRecord(raw, 0));
    expect(serialized).toEqual({
      seatTransitions: [{
        cause: 'government_change',
        fromRulerId: 'old-ruler',
        governingFactionId: 'fac.regency',
        governingFactionName: 'The Regency',
        id: 'transfer.7',
        installerFactionId: 'fac.peace',
        installerFactionName: 'Peace League',
        tick: 7,
        toRulerId: 'new-ruler',
        warDemand: {
          actorId: 'home',
          decisionId: 'decision.7',
          desiredAction: 'peace',
          targetId: 'foe',
        },
      }],
    });
    expect(JSON.stringify(sortedRecord(normalizeRecord(serialized, 0))))
      .toBe(JSON.stringify(serialized));
  });

  it('records a real organic governing-seat succession but not first derivation', () => {
    const roster = [
      npc('old', 'Old Master', 'pillar', 3, 'dominant'),
      npc('heir', 'Living Heir', 'key', 2, 'subordinate'),
    ];
    const first = advance(settlement(roster), {
      simulationRules: { warLayerEnabled: true, warTerminationEnabled: true },
    }, 10);
    const firstRecord = first.worldState.spatialLedgers.npcLadder.a;
    expect(firstRecord.seatTransitions).toBeUndefined();

    const nextTown = settlement([
      npc('old', 'Old Master', 'pillar', 3, 'dominant', { status: 'dead' }),
      npc('heir', 'Living Heir', 'key', 2, 'subordinate'),
    ]);
    const second = advance(nextTown, first.worldState, 11);
    const secondRecord = second.worldState.spatialLedgers.npcLadder.a;
    expect(secondRecord.factions[ladderFactionKey(guild)].rungs[0]).toBe('a:heir');
    expect(secondRecord.seatTransitions).toEqual([expect.objectContaining({
      fromRulerId: 'a:old',
      toRulerId: 'a:heir',
      cause: 'succession',
      tick: 11,
      governingFactionId: guild.id,
      governingFactionName: guild.name,
    })]);
    expect(secondRecord.seatTransitions[0].warDemand).toBeUndefined();
  });

  it('keeps WR-5 death eligibility and transition history dark under the ladder flag alone', () => {
    const roster = [
      npc('old', 'Old Master', 'pillar', 3, 'dominant'),
      npc('heir', 'Living Heir', 'key', 2, 'subordinate'),
    ];
    const first = advance(settlement(roster), { simulationRules: {} }, 10);
    const nextTown = settlement([
      npc('old', 'Old Master', 'pillar', 3, 'dominant', { status: 'dead' }),
      npc('heir', 'Living Heir', 'key', 2, 'subordinate'),
    ]);
    const second = advance(nextTown, first.worldState, 11);
    const record = second.worldState.spatialLedgers.npcLadder.a;
    expect(record.factions[ladderFactionKey(guild)].rungs[0]).toBe('a:old');
    expect(record.seatTransitions).toBeUndefined();
  });

  it('carries a living name-keyed seat beyond the bounded government-label history', () => {
    const currentFaction = { name: "Workers' Assembly", isGoverning: true, power: 60 };
    const immediatePriorFaction = { name: 'Guildhall Council' };
    const town = {
      ...settlement([
        npc('old', 'Old Master', 'pillar', 3, 'dominant', {
          // This authored affiliation predates more transfers than the bounded
          // previousGovernments receipt retains.
          factionAffiliation: 'Town Council',
        }),
      ]),
      powerStructure: {
        factions: [currentFaction],
        publicLegitimacy: { score: 55 },
        previousGovernments: [
          'Military Council',
          'Merchant City Council',
          'Theocratic Council',
          'Ducal Governorship',
          'Arcane Council',
          'Guildhall Council',
        ].map((label, tick) => ({ label, cause: 'appointment', tick })),
      },
    };
    const priorKey = ladderFactionKey(immediatePriorFaction);
    const next = advance(town, {
      simulationRules: { warLayerEnabled: true, warTerminationEnabled: true },
      spatialLedgers: {
        npcLadder: {
          a: {
            factions: { [priorKey]: { rungs: ['a:old'], lastPower: 60 } },
            npcs: {
              'a:old': { stock: 6, since: 1, week: 1, goal: null, stigma: null, grudges: {} },
            },
          },
        },
      },
    }, 12);
    const record = next.worldState.spatialLedgers.npcLadder.a;
    expect(record.factions[ladderFactionKey(currentFaction)].rungs[0]).toBe('a:old');
  });

  it('preserves the ladder record, dedupes identity/decision, and evicts oldest rows at the bound', () => {
    const fkey = ladderFactionKey(guild);
    let worldState = {
      spatialLedgers: {
        npcLadder: {
          a: {
            factions: { [fkey]: { rungs: ['a:old'], lastPower: 60 } },
            npcs: {
              'a:old': { stock: 6, since: 1, week: 1, goal: null, stigma: null, grudges: {} },
            },
          },
        },
      },
    };
    const count = LADDER_TUNING.SEAT_TRANSITION_CAP + 3;
    for (let i = 0; i < count; i += 1) {
      worldState = appendNpcLadderSeatTransition(worldState, 'a', {
        id: `transition.${i}`,
        fromRulerId: `ruler.${i}`,
        toRulerId: `ruler.${i + 1}`,
        cause: 'appointment',
        tick: i,
      });
    }
    const record = worldState.spatialLedgers.npcLadder.a;
    expect(record.factions[fkey].rungs).toEqual(['a:old']);
    expect(record.npcs['a:old'].stock).toBe(6);
    expect(record.seatTransitions).toHaveLength(LADDER_TUNING.SEAT_TRANSITION_CAP);
    expect(record.seatTransitions[0].id).toBe('transition.3');
    expect(record.seatTransitions.at(-1).id).toBe(`transition.${count - 1}`);

    const identityRetry = appendNpcLadderSeatTransition(worldState, 'a', {
      id: `transition.${count - 1}`,
      fromRulerId: 'different-old',
      toRulerId: 'different-new',
      cause: 'retry',
      tick: 999,
    });
    expect(identityRetry).toBe(worldState);

    const withDemand = appendNpcLadderSeatTransition(worldState, 'a', {
      id: 'transfer.with-demand',
      fromRulerId: 'ruler.a',
      toRulerId: 'ruler.b',
      cause: 'government_change',
      tick: 100,
      warDemand: {
        actorId: 'a', targetId: 'b', decisionId: 'decision.install', desiredAction: 'continue',
      },
    });
    const decisionRetry = appendNpcLadderSeatTransition(withDemand, 'a', {
      id: 'different-wrapper-id',
      fromRulerId: 'ruler.x',
      toRulerId: 'ruler.y',
      cause: 'government_change',
      tick: 101,
      warDemand: {
        actorId: 'a', targetId: 'b', decisionId: 'decision.install', desiredAction: 'continue',
      },
    });
    const decisionRows = decisionRetry.spatialLedgers.npcLadder.a.seatTransitions;
    expect(decisionRetry).not.toBe(withDemand);
    expect(decisionRows.at(-1)).toMatchObject({ id: 'different-wrapper-id', tick: 101 });
    expect(decisionRows.at(-1).warDemand).toBeUndefined();
    expect(decisionRows.filter((row) => row.warDemand?.decisionId === 'decision.install')).toHaveLength(1);
  });

  it('does not fabricate a war demand for an unrelated or malformed transition', () => {
    const untouched = {};
    expect(appendNpcLadderSeatTransition(untouched, 'a', {
      fromRulerId: 'old', toRulerId: 'new', tick: 4,
    })).toBe(untouched);

    const worldState = appendNpcLadderSeatTransition(untouched, 'a', {
      fromRulerId: 'old',
      toRulerId: 'new',
      cause: 'ordinary_succession',
      tick: 5,
      warDemand: {
        actorId: 'a', targetId: 'b', decisionId: 'decision.bad', desiredAction: 'delay',
      },
    });
    const row = worldState.spatialLedgers.npcLadder.a.seatTransitions[0];
    expect(row.warDemand).toBeUndefined();
  });
});
