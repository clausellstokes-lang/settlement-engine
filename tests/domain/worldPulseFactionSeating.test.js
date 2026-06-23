/**
 * Faction seating invariant — real generation, not a hand-built fixture.
 *
 * Regression guard for the seam between generation and worldPulse: the
 * generator records an NPC's faction on `factionAffiliation`
 * (npcGenerator.js — `enriched.factionAffiliation = assignedFaction.faction`),
 * but the world pulse seats NPCs into factions through `factionIdFor`
 * (npcAgency.js). When `factionIdFor` did NOT read `factionAffiliation`, every
 * affiliated NPC fell through to the positional-index fallback, so the named
 * power factions ended up with EMPTY `memberNpcIds` rosters and the live-state
 * signals built on them (momentum, leadership seats, rivalries) were corrupt.
 *
 * This test generates a settlement, runs the seating pipeline, and asserts the
 * named factions actually carry their affiliated NPCs.
 */

import { describe, test, expect } from 'vitest';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { ensureNpcStates } from '../../src/domain/worldPulse/npcAgency.js';
import { ensureFactionStates, seatNpcsIntoFactions } from '../../src/domain/worldPulse/factionCompetition.js';
import { stablePart } from '../../src/domain/worldPulse/worldState.js';
import { createPRNG } from '../../src/generators/prng.js';

const SEED = 'faction-seating-2026-06';

function seatedWorld(config, seed = SEED) {
  const settlement = generateSettlementPipeline(config, null, { seed, customContent: {} });
  const snapshot = { settlements: [{ id: 's1', activeConditions: [], settlement }] };
  let ws = { npcStates: {}, factionStates: {} };
  ws = ensureNpcStates(ws, snapshot, createPRNG(`${seed}:npc`).fork('init'));
  ws = ensureFactionStates(ws, snapshot, createPRNG(`${seed}:faction`).fork('init'));
  ws = seatNpcsIntoFactions(ws);
  return { settlement, ws };
}

describe('seatNpcsIntoFactions — affiliated NPCs seat into their NAMED faction', () => {
  const config = { settType: 'city', culture: 'germanic', terrain: 'grassland', tradeRouteAccess: 'road' };

  test('named factions carry populated memberNpcIds rosters (not empty)', () => {
    const { settlement, ws } = seatedWorld(config);

    // Sanity: this fixture actually has affiliated NPCs to seat, else the
    // invariant below would pass vacuously.
    const affiliated = (settlement.npcs || []).filter(n => n.factionAffiliation);
    expect(affiliated.length).toBeGreaterThan(0);

    const states = Object.values(ws.factionStates);
    expect(states.length).toBeGreaterThan(0);

    // At least one named faction must carry members. Pre-fix, EVERY roster was
    // empty because affiliations were ignored in favour of positional index.
    const withMembers = states.filter(f => (f.memberNpcIds || []).length > 0);
    expect(withMembers.length).toBeGreaterThan(0);

    // Every NPC that was seated must be a known NPC state.
    const knownNpcIds = new Set(Object.values(ws.npcStates).map(s => s.npcId));
    for (const f of states) {
      for (const id of f.memberNpcIds || []) {
        expect(knownNpcIds.has(id)).toBe(true);
      }
    }
  });

  test('each affiliated NPC lands in the faction its factionAffiliation names', () => {
    const { ws } = seatedWorld(config);

    // Map each seated NPC id to the faction state it was seated under.
    const seatedFactionByNpc = new Map();
    for (const f of Object.values(ws.factionStates)) {
      for (const id of f.memberNpcIds || []) seatedFactionByNpc.set(id, f);
    }

    const affiliatedStates = Object.values(ws.npcStates).filter(s => s.factionId && s.factionId !== 'unaffiliated');
    expect(affiliatedStates.length).toBeGreaterThan(0);

    // For every NPC whose affiliation matches a real faction on the settlement,
    // the faction it seats into must be that faction (matched by stable name),
    // never an arbitrary positional one.
    const factionNameKeys = new Set(
      Object.values(ws.factionStates).map(f => stablePart(f.name)),
    );

    let checked = 0;
    for (const npc of affiliatedStates) {
      const affilKey = stablePart(npc.factionId);
      if (!factionNameKeys.has(affilKey)) continue; // affiliation has no matching faction state
      const seated = seatedFactionByNpc.get(npc.npcId);
      expect(seated, `NPC ${npc.name} (${affilKey}) was not seated into any faction`).toBeTruthy();
      expect(stablePart(seated.name)).toBe(affilKey);
      checked += 1;
    }

    // Guard against a vacuous pass: we must have actually verified some NPCs.
    expect(checked).toBeGreaterThan(0);
  });

  test('seating is deterministic for a fixed seed', () => {
    const a = seatedWorld(config);
    const b = seatedWorld(config);
    const roster = ws =>
      Object.values(ws.factionStates)
        .map(f => `${stablePart(f.name)}:${[...(f.memberNpcIds || [])].sort().join(',')}`)
        .sort();
    expect(roster(a.ws)).toEqual(roster(b.ws));
  });
});
