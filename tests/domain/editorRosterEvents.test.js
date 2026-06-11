/**
 * Editor roster wave — RESOLVE_STRESSOR, ADD/REMOVE_TRADE_GOOD,
 * ADD/REMOVE_RESOURCE, PROMOTE/DEMOTE_NPC.
 *
 * Pins, per the wave's contracts:
 *   - registry membership + tight RERUN_KEYS for all seven types;
 *   - every mutate handler's happy path, unknown-target no-op, and purity
 *     (deep-frozen input — same harness mutate.property.test.js uses);
 *   - RESOLVE_STRESSOR's condition wind-down (both the direct stamp and the
 *     promotion-archetype match, with event provenance on the causes);
 *   - the trade-good entrepôt '(transit)' suffix + transit list write;
 *   - the dual-format resource config writes (nearbyResources +
 *     nearbyResourcesState, custom names in nearbyResourcesCustom);
 *   - the NPC standing swap (fields swapped, others preserved, factionId
 *     stamped with the stable faction form);
 *   - the npcAgency adoption seam (adopts a CHANGED importance once; does
 *     not clobber sim-side dotRank promotions on unchanged importance).
 */

import { describe, expect, test } from 'vitest';

import { EVENT_REGISTRY, EVENT_TYPES, RERUN_KEYS_FOR_EVENT } from '../../src/domain/events/registry.js';
import { mutateSettlement } from '../../src/domain/events/mutate.js';
import { ensureNpcStates, npcId } from '../../src/domain/worldPulse/npcAgency.js';
import { createPRNG } from '../../src/generators/prng.js';

const NOW = '2026-06-11T00:00:00.000Z';

// Deep-freeze so any in-place mutation throws in strict mode (the same
// purity harness mutate.property.test.js uses).
function deepFreeze(o) {
  if (o && typeof o === 'object') {
    Object.freeze(o);
    for (const k of Object.keys(o)) deepFreeze(o[k]);
  }
  return o;
}

function ev(type, overrides = {}) {
  return {
    id: `ev_${type.toLowerCase()}`,
    type,
    targetId: '',
    payload: {},
    cause: 'player_action',
    ...overrides,
  };
}

function fixture(overrides = {}) {
  return {
    name: 'Oakmere',
    tier: 'town',
    institutions: [],
    npcs: [],
    activeConditions: [],
    config: {},
    powerStructure: { factions: [{ id: 'faction.the_garrison', faction: 'The Garrison', power: 30 }] },
    ...overrides,
  };
}

describe('event registry — editor roster wave', () => {
  const WAVE = [
    'RESOLVE_STRESSOR', 'ADD_TRADE_GOOD', 'REMOVE_TRADE_GOOD',
    'ADD_RESOURCE', 'REMOVE_RESOURCE', 'PROMOTE_NPC', 'DEMOTE_NPC',
  ];

  test('all seven types are first-class: registry entry + rerun keys + target required', () => {
    for (const type of WAVE) {
      expect(EVENT_TYPES).toContain(type);
      expect(RERUN_KEYS_FOR_EVENT[type]).toBeTruthy();
      expect(EVENT_REGISTRY[type].requiresTarget).toBe(true);
      expect(typeof EVENT_REGISTRY[type].stateDeltas).toBe('function');
      expect(typeof EVENT_REGISTRY[type].narrate).toBe('function');
    }
  });

  test('rerun keys stay tight and honest per subsystem family', () => {
    expect(RERUN_KEYS_FOR_EVENT.RESOLVE_STRESSOR).toEqual(RERUN_KEYS_FOR_EVENT.APPLY_STRESSOR);
    expect(RERUN_KEYS_FOR_EVENT.ADD_TRADE_GOOD).toEqual(['economicState', 'narrative']);
    expect(RERUN_KEYS_FOR_EVENT.REMOVE_TRADE_GOOD).toEqual(['economicState', 'narrative']);
    expect(RERUN_KEYS_FOR_EVENT.ADD_RESOURCE).toEqual(['resources', 'activeChains', 'foodSecurity', 'economicState', 'narrative']);
    expect(RERUN_KEYS_FOR_EVENT.REMOVE_RESOURCE).toEqual(['resources', 'activeChains', 'foodSecurity', 'economicState', 'narrative']);
    expect(RERUN_KEYS_FOR_EVENT.PROMOTE_NPC).toEqual(['npcs', 'powerStructure', 'narrative']);
    expect(RERUN_KEYS_FOR_EVENT.DEMOTE_NPC).toEqual(['npcs', 'powerStructure', 'narrative']);
  });

  test('RESOLVE_STRESSOR stateDeltas mirror APPLY_STRESSOR inverted, scaled by the removed entry', () => {
    const settlement = fixture({
      stress: [{ type: 'under_siege', name: 'Under Siege', severity: 0.8 }],
    });
    const deltas = EVENT_REGISTRY.RESOLVE_STRESSOR.stateDeltas(
      ev('RESOLVE_STRESSOR', { targetId: 'under_siege', payload: { stressorType: 'under_siege' } }),
      settlement,
    );
    expect(deltas.resilience).toBe(+Math.round(0.8 * 12));
    expect(deltas.volatility).toBe(-Math.round(0.8 * 12));
    expect(deltas.externalThreat).toBeLessThan(0); // siege is an external crisis
    expect(deltas.resourcePressure).toBeUndefined();
  });

  test('RESOLVE_STRESSOR stateDeltas fall back to 0.5 for word-banded legacy severities', () => {
    const settlement = fixture({ stress: [{ type: 'famine', name: 'Famine', severity: 'medium' }] });
    const deltas = EVENT_REGISTRY.RESOLVE_STRESSOR.stateDeltas(
      ev('RESOLVE_STRESSOR', { targetId: 'famine' }),
      settlement,
    );
    expect(deltas.resilience).toBe(+6);
    expect(deltas.resourcePressure).toBe(-6); // famine is a scarcity crisis
  });

  test('swap stateDeltas are a small volatility bump only; narrate names NPC and faction', () => {
    expect(EVENT_REGISTRY.PROMOTE_NPC.stateDeltas(ev('PROMOTE_NPC'))).toEqual({ volatility: +3 });
    expect(EVENT_REGISTRY.DEMOTE_NPC.stateDeltas(ev('DEMOTE_NPC'))).toEqual({ volatility: +3 });
    const settlement = fixture({
      npcs: [{ id: 'npc_1', name: 'Captain Mara', factionAffiliation: 'The Garrison' }],
    });
    expect(EVENT_REGISTRY.PROMOTE_NPC.narrate(ev('PROMOTE_NPC', { targetId: 'npc_1' }), settlement))
      .toMatch(/Captain Mara rises within The Garrison/);
    expect(EVENT_REGISTRY.DEMOTE_NPC.narrate(ev('DEMOTE_NPC', { targetId: 'npc_1' }), settlement))
      .toMatch(/Captain Mara is pushed down the ranks of The Garrison/);
  });
});

describe('mutateSettlement — RESOLVE_STRESSOR', () => {
  test('removes the entry and winds the promoted condition down with event provenance', () => {
    // Realistic round-trip: author the crisis (promotes famine), then resolve it.
    const applied = mutateSettlement({
      settlement: fixture(),
      event: ev('APPLY_STRESSOR', {
        id: 'ev-onset', targetId: 'famine',
        payload: { stressorType: 'famine', label: 'Famine', severity: 0.7 },
      }),
      now: NOW,
    });
    expect((applied.stress || []).some(st => st.type === 'famine')).toBe(true);
    expect((applied.activeConditions || []).find(c => c.archetype === 'famine').status).toBe('worsening');

    const resolved = mutateSettlement({
      settlement: applied,
      event: ev('RESOLVE_STRESSOR', {
        id: 'ev-resolve', targetId: 'famine',
        payload: { stressorType: 'famine', label: 'Famine' },
      }),
      now: NOW,
    });
    expect((resolved.stress || []).some(st => st.type === 'famine')).toBe(false);
    const condition = (resolved.activeConditions || []).find(c => c.archetype === 'famine');
    expect(condition.status).toBe('easing');
    // Near-term trail-off, never an extension.
    expect(condition.duration.expiresAtTicks).toBeLessThanOrEqual(condition.duration.elapsedTicks + 2);
    // The resolution is a durable consequence — it carries the event id.
    expect(condition.causes.some(c => c.source === 'event' && c.eventId === 'ev-resolve')).toBe(true);
  });

  test('winds down a custom_crisis via the direct stressor-type stamp', () => {
    const applied = mutateSettlement({
      settlement: fixture(),
      event: ev('APPLY_STRESSOR', {
        id: 'ev-custom', targetId: 'dragon_tax',
        payload: { stressorType: 'dragon_tax', label: 'Dragon Tax', severity: 0.6, isCustom: true },
      }),
      now: NOW,
    });
    const resolved = mutateSettlement({
      settlement: applied,
      event: ev('RESOLVE_STRESSOR', { id: 'ev-custom-end', targetId: 'dragon_tax' }),
      now: NOW,
    });
    expect((resolved.stress || []).some(st => st.type === 'dragon_tax')).toBe(false);
    const condition = (resolved.activeConditions || []).find(c => c.archetype === 'custom_crisis');
    expect(condition.status).toBe('easing');
    expect(condition.causes.some(c => c.eventId === 'ev-custom-end')).toBe(true);
  });

  test('matches a legacy untyped entry by display name', () => {
    const settlement = fixture({ stress: [{ name: 'Old Grudge', severity: 0.4 }] });
    const next = mutateSettlement({
      settlement,
      event: ev('RESOLVE_STRESSOR', { targetId: 'old grudge' }),
      now: NOW,
    });
    expect(next.stress).toHaveLength(0);
  });

  test('unknown target is a settlement no-op; input never mutated', () => {
    const settlement = deepFreeze(fixture({
      stress: [{ type: 'famine', name: 'Famine', severity: 0.7 }],
      activeConditions: [],
    }));
    const next = mutateSettlement({
      settlement,
      event: ev('RESOLVE_STRESSOR', { targetId: 'plague' }),
      now: NOW,
    });
    expect(next.stress).toEqual(settlement.stress);
    expect(next.activeConditions).toEqual([]);
  });
});

describe('mutateSettlement — ADD_TRADE_GOOD / REMOVE_TRADE_GOOD', () => {
  const economy = () => fixture({
    economicState: {
      primaryExports: ['Salted fish'],
      primaryImports: [{ name: 'Iron tools', good: 'Iron tools' }],
      transit: [],
    },
  });

  test('appends an export label; dedupe is case-insensitive', () => {
    const added = mutateSettlement({
      settlement: economy(),
      event: ev('ADD_TRADE_GOOD', { targetId: 'Milled flour', payload: { direction: 'export', entrepot: false, label: 'Milled flour' } }),
      now: NOW,
    });
    expect(added.economicState.primaryExports).toContain('Milled flour');

    const duped = mutateSettlement({
      settlement: deepFreeze(economy()),
      event: ev('ADD_TRADE_GOOD', { targetId: 'SALTED FISH', payload: { direction: 'export', label: 'SALTED FISH' } }),
      now: NOW,
    });
    expect(duped.economicState.primaryExports).toEqual(['Salted fish']);
  });

  test('entrepôt export takes the "(transit)" suffix AND lands in transit', () => {
    const next = mutateSettlement({
      settlement: deepFreeze(economy()),
      event: ev('ADD_TRADE_GOOD', { targetId: 'Rare spices', payload: { direction: 'export', entrepot: true, label: 'Rare spices' } }),
      now: NOW,
    });
    expect(next.economicState.primaryExports).toContain('Rare spices (transit)');
    expect(next.economicState.transit).toContain('Rare spices');
  });

  test('imports go to primaryImports', () => {
    const next = mutateSettlement({
      settlement: economy(),
      event: ev('ADD_TRADE_GOOD', { targetId: 'Fine cloth', payload: { direction: 'import', label: 'Fine cloth' } }),
      now: NOW,
    });
    expect(next.economicState.primaryImports).toContain('Fine cloth');
    expect(next.economicState.primaryExports).toEqual(['Salted fish']);
  });

  test('REMOVE strips the label with and without the suffix, across lists and entry shapes', () => {
    const settlement = fixture({
      economicState: {
        primaryExports: ['Salted fish', 'Rare spices (transit)'],
        primaryImports: [{ name: 'Iron tools', good: 'Iron tools' }],
        transit: ['Rare spices'],
      },
    });
    // The picker may hand back either form — the un-suffixed label clears both.
    const noSpices = mutateSettlement({
      settlement: deepFreeze(settlement),
      event: ev('REMOVE_TRADE_GOOD', { targetId: 'Rare spices' }),
      now: NOW,
    });
    expect(noSpices.economicState.primaryExports).toEqual(['Salted fish']);
    expect(noSpices.economicState.transit).toEqual([]);

    // Case-insensitive object-entry removal (the Roster's legacy write shape).
    const noTools = mutateSettlement({
      settlement,
      event: ev('REMOVE_TRADE_GOOD', { targetId: 'iron tools' }),
      now: NOW,
    });
    expect(noTools.economicState.primaryImports).toEqual([]);
  });

  test('REMOVE of an unknown label is a no-op', () => {
    const settlement = economy();
    const next = mutateSettlement({
      settlement,
      event: ev('REMOVE_TRADE_GOOD', { targetId: 'Dragonbone' }),
      now: NOW,
    });
    expect(next.economicState).toEqual(settlement.economicState);
  });
});

describe('mutateSettlement — ADD_RESOURCE / REMOVE_RESOURCE', () => {
  test('catalog key writes BOTH config formats (roster array + state map)', () => {
    const next = mutateSettlement({
      settlement: deepFreeze(fixture()),
      event: ev('ADD_RESOURCE', { targetId: 'fishing_grounds' }),
      now: NOW,
    });
    expect(next.config.nearbyResources).toContain('fishing_grounds');
    expect(next.config.nearbyResourcesState.fishing_grounds).toBe('allow');
    expect(next.config.nearbyResourcesCustom).toBeUndefined();
  });

  test('a catalog label slugifies to its canonical underscore key', () => {
    const next = mutateSettlement({
      settlement: fixture(),
      event: ev('ADD_RESOURCE', { targetId: 'Fishing Grounds' }),
      now: NOW,
    });
    expect(next.config.nearbyResources).toContain('fishing_grounds');
  });

  test('custom names are stored verbatim and recorded in nearbyResourcesCustom', () => {
    const next = mutateSettlement({
      settlement: fixture(),
      event: ev('ADD_RESOURCE', { targetId: 'Moonpetal grove', payload: { isCustom: true } }),
      now: NOW,
    });
    expect(next.config.nearbyResources).toContain('Moonpetal grove');
    expect(next.config.nearbyResourcesCustom).toContain('Moonpetal grove');
    expect(next.config.nearbyResourcesState['Moonpetal grove']).toBe('allow');
  });

  test('re-adding dedupes and clears a stale depletion record (formats agree)', () => {
    const settlement = fixture({
      config: {
        nearbyResources: ['fishing_grounds'],
        nearbyResourcesState: { fishing_grounds: 'depleted' },
        nearbyResourcesDepleted: ['fishing_grounds'],
      },
    });
    const next = mutateSettlement({
      settlement,
      event: ev('ADD_RESOURCE', { targetId: 'fishing_grounds' }),
      now: NOW,
    });
    expect(next.config.nearbyResources).toEqual(['fishing_grounds']);
    expect(next.config.nearbyResourcesState.fishing_grounds).toBe('allow');
    expect(next.config.nearbyResourcesDepleted).toEqual([]);
  });

  test('REMOVE clears every config surface that names the resource', () => {
    const settlement = deepFreeze(fixture({
      config: {
        nearbyResources: ['fishing_grounds', 'Moonpetal grove'],
        nearbyResourcesCustom: ['Moonpetal grove'],
        nearbyResourcesState: { fishing_grounds: 'depleted', 'Moonpetal grove': 'allow' },
        nearbyResourcesDepleted: ['fishing_grounds'],
      },
    }));
    const next = mutateSettlement({
      settlement,
      event: ev('REMOVE_RESOURCE', { targetId: 'fishing_grounds' }),
      now: NOW,
    });
    expect(next.config.nearbyResources).toEqual(['Moonpetal grove']);
    expect(next.config.nearbyResourcesState).toEqual({ 'Moonpetal grove': 'allow' });
    expect(next.config.nearbyResourcesDepleted).toEqual([]);

    const noCustom = mutateSettlement({
      settlement,
      event: ev('REMOVE_RESOURCE', { targetId: 'Moonpetal grove' }),
      now: NOW,
    });
    expect(noCustom.config.nearbyResources).toEqual(['fishing_grounds']);
    expect(noCustom.config.nearbyResourcesCustom).toEqual([]);
  });

  test('REMOVE of an unlisted resource is a no-op', () => {
    const settlement = fixture({ config: { nearbyResources: ['fishing_grounds'] } });
    const next = mutateSettlement({
      settlement,
      event: ev('REMOVE_RESOURCE', { targetId: 'silver_lode' }),
      now: NOW,
    });
    expect(next.config).toEqual(settlement.config);
  });
});

describe('mutateSettlement — PROMOTE_NPC / DEMOTE_NPC standing swap', () => {
  const roster = () => fixture({
    npcs: [
      {
        id: 'npc_1', name: 'Captain Mara', role: 'Watch Captain',
        importance: 'key', influence: 'high', structuralRank: 'dominant',
        factionAffiliation: 'The Garrison',
        personality: { dominant: 'stern' },
      },
      {
        id: 'npc_2', name: 'Sergeant Brik', role: 'Gate Sergeant',
        importance: 'notable', influence: 'low', structuralRank: 'subordinate',
        factionAffiliation: 'The Garrison',
        personality: { dominant: 'jovial' },
      },
    ],
  });

  test('swaps importance/influence/structuralRank, preserves everything else, stamps factionId', () => {
    const next = mutateSettlement({
      settlement: deepFreeze(roster()),
      event: ev('PROMOTE_NPC', { targetId: 'npc_2', payload: { swapWithNpcId: 'npc_1' } }),
      now: NOW,
    });
    const mara = next.npcs.find(n => n.id === 'npc_1');
    const brik = next.npcs.find(n => n.id === 'npc_2');
    // Standing swapped both ways.
    expect(brik.importance).toBe('key');
    expect(brik.influence).toBe('high');
    expect(brik.structuralRank).toBe('dominant');
    expect(mara.importance).toBe('notable');
    expect(mara.influence).toBe('low');
    expect(mara.structuralRank).toBe('subordinate');
    // Everything else preserved.
    expect(brik.role).toBe('Gate Sergeant');
    expect(brik.personality).toEqual({ dominant: 'jovial' });
    expect(mara.role).toBe('Watch Captain');
    // factionId stamped with the power faction's STABLE id (the sim's
    // factionIdFor does not read factionAffiliation).
    expect(mara.factionId).toBe('faction.the_garrison');
    expect(brik.factionId).toBe('faction.the_garrison');
  });

  test('DEMOTE_NPC uses the same swap; an existing factionId is never overwritten', () => {
    const settlement = roster();
    settlement.npcs[0].factionId = 'faction.preexisting';
    const next = mutateSettlement({
      settlement,
      event: ev('DEMOTE_NPC', { targetId: 'npc_1', payload: { swapWithNpcId: 'npc_2' } }),
      now: NOW,
    });
    const mara = next.npcs.find(n => n.id === 'npc_1');
    expect(mara.importance).toBe('notable');
    expect(mara.factionId).toBe('faction.preexisting');
  });

  test('missing counterpart (or self-swap) is a settlement no-op', () => {
    const settlement = roster();
    const missing = mutateSettlement({
      settlement,
      event: ev('PROMOTE_NPC', { targetId: 'npc_2', payload: { swapWithNpcId: 'npc_99' } }),
      now: NOW,
    });
    expect(missing.npcs).toEqual(settlement.npcs);
    const self = mutateSettlement({
      settlement,
      event: ev('PROMOTE_NPC', { targetId: 'npc_2', payload: { swapWithNpcId: 'npc_2' } }),
      now: NOW,
    });
    expect(self.npcs).toEqual(settlement.npcs);
  });
});

describe('npcAgency — importance adoption (ensureNpcStates)', () => {
  const snapshotFor = (npcs) => ({
    settlements: [{
      id: 's1',
      activeConditions: [],
      settlement: { tier: 'town', institutions: [], npcs },
    }],
  });

  test('creation seeds dotRank from importance and stamps the adoption marker', () => {
    const npcs = [{ id: 'npc_1', name: 'Mara', importance: 'key' }];
    const ws = ensureNpcStates({ npcStates: {} }, snapshotFor(npcs), createPRNG('seed-a').fork('init'));
    const state = ws.npcStates[npcId('s1', npcs[0], 0)];
    expect(state.dotRank).toBe(3);
    expect(state.factionSeat).toBe('leader_champion');
    expect(state.adoptedImportance).toBe('key');
  });

  test('adopts a CHANGED importance once; unchanged importance never clobbers sim promotions', () => {
    const before = [{ id: 'npc_1', name: 'Mara', importance: 'key' }];
    const id = npcId('s1', before[0], 0);
    let ws = ensureNpcStates({ npcStates: {} }, snapshotFor(before), createPRNG('seed-b').fork('init'));
    expect(ws.npcStates[id].dotRank).toBe(3);

    // The sim moves the NPC (corruption demotion / seek_promotion write
    // dotRank + factionSeat without touching settlement importance)...
    ws = {
      ...ws,
      npcStates: {
        ...ws.npcStates,
        [id]: { ...ws.npcStates[id], dotRank: 2, factionSeat: 'lieutenant_operator' },
      },
    };
    // ...and the next ensure with UNCHANGED importance must not undo it.
    ws = ensureNpcStates(ws, snapshotFor(before), createPRNG('seed-b2').fork('init'));
    expect(ws.npcStates[id].dotRank).toBe(2);
    expect(ws.npcStates[id].factionSeat).toBe('lieutenant_operator');

    // A settlement-side demotion (the DEMOTE_NPC swap) changes importance —
    // adoption fires once and updates the marker.
    const after = [{ id: 'npc_1', name: 'Mara', importance: 'minor' }];
    ws = ensureNpcStates(ws, snapshotFor(after), createPRNG('seed-b3').fork('init'));
    expect(ws.npcStates[id].dotRank).toBe(1);
    expect(ws.npcStates[id].factionSeat).toBe('agent_protege');
    expect(ws.npcStates[id].adoptedImportance).toBe('minor');

    // Re-ensuring with the same importance is then a no-op again.
    ws = {
      ...ws,
      npcStates: { ...ws.npcStates, [id]: { ...ws.npcStates[id], dotRank: 2 } },
    };
    ws = ensureNpcStates(ws, snapshotFor(after), createPRNG('seed-b4').fork('init'));
    expect(ws.npcStates[id].dotRank).toBe(2);
  });
});
