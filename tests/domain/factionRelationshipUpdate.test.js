/**
 * tests/domain/factionRelationshipUpdate.test.js — First active derivation.
 *
 * Pins the Tier 4.2 contract: pure deltas, no mutation, archetype
 * routing per event archetype, dominant-NPC routing splits hits
 * between target faction and rival, settlement preserved.
 */

import { describe, it, expect } from 'vitest';
import {
  recalculateFactionRelationships,
  summarizeByFaction,
  supportedArchetypes,
  factionIdFromName,
} from '../../src/domain/factionRelationshipUpdate.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';

// ── Sample settlements ──────────────────────────────────────────────────

function multiFactionSettlement(over = {}) {
  return {
    name: 'Greycairn',
    powerStructure: {
      governingName: 'Town Council',
      publicLegitimacy: { score: 60, label: 'Tolerated' },
      factions: [
        { faction: 'Town Council',         power: 35, desc: '' },
        { faction: 'Merchant Guilds',      power: 30, desc: '' },
        { faction: 'Religious Authorities',power: 25, desc: '' },
        { faction: "Thieves' Guild",       power: 18, desc: '' },
        { faction: 'Military/Guard',       power: 28, desc: '' },
      ],
    },
    ...over,
  };
}

// ── Inference / routing ────────────────────────────────────────────────

describe('recalculateFactionRelationships() — archetype inference', () => {
  it('CUT_TRADE_ROUTE infers trade_route_cut archetype', () => {
    const updates = recalculateFactionRelationships(
      multiFactionSettlement(),
      { type: 'CUT_TRADE_ROUTE', targetId: 'south_road' },
    );
    expect(updates.length).toBeGreaterThan(0);
    // The merchant faction should be the headline loser.
    const merchantHit = updates.find(u => u.archetype === 'merchant' && u.field === 'wealth');
    expect(merchantHit).toBeTruthy();
    expect(merchantHit.delta).toBeLessThan(0);
    // The criminal faction should gain power.
    const criminalGain = updates.find(u => u.archetype === 'criminal' && u.field === 'power');
    expect(criminalGain).toBeTruthy();
    expect(criminalGain.delta).toBeGreaterThan(0);
  });

  it('REMOVE_INSTITUTION with food-pattern target maps to food_anchor_lost', () => {
    const updates = recalculateFactionRelationships(
      multiFactionSettlement(),
      { type: 'REMOVE_INSTITUTION', targetId: 'Town Granary' },
    );
    const religiousGain = updates.find(u => u.archetype === 'religious' && u.field === 'legitimacy');
    expect(religiousGain).toBeTruthy();
    expect(religiousGain.delta).toBeGreaterThan(0);
    const govHit = updates.find(u => u.archetype === 'government' && u.field === 'legitimacy');
    expect(govHit).toBeTruthy();
    expect(govHit.delta).toBeLessThan(0);
  });

  it('REMOVE_INSTITUTION with non-food target returns no impact under default inference', () => {
    const updates = recalculateFactionRelationships(
      multiFactionSettlement(),
      { type: 'REMOVE_INSTITUTION', targetId: 'Library' },
    );
    expect(updates).toEqual([]);
  });

  it('event.factionImpactArchetype overrides inference', () => {
    const updates = recalculateFactionRelationships(
      multiFactionSettlement(),
      { type: 'CUSTOM_USER_EVENT', factionImpactArchetype: 'plague' },
    );
    const religiousGain = updates.find(u => u.archetype === 'religious' && u.field === 'legitimacy');
    expect(religiousGain).toBeTruthy();
    expect(religiousGain.delta).toBeGreaterThan(0);
  });

  it('options.archetype overrides everything', () => {
    const updates = recalculateFactionRelationships(
      multiFactionSettlement(),
      { type: 'WHATEVER' },
      { archetype: 'siege_lifted' },
    );
    const militaryGain = updates.find(u => u.archetype === 'military' && u.field === 'legitimacy');
    expect(militaryGain).toBeTruthy();
    expect(militaryGain.delta).toBeGreaterThan(0);
  });

  it('unknown archetype returns an empty array', () => {
    const updates = recalculateFactionRelationships(
      multiFactionSettlement(),
      { type: 'COMPLETELY_MADE_UP' },
    );
    expect(updates).toEqual([]);
  });
});

// ── Per-archetype impact correctness ───────────────────────────────────

describe('recalculateFactionRelationships() — archetype impacts', () => {
  const PLAGUE = { type: 'PLAGUE', factionImpactArchetype: 'plague' };

  it('plague: religious gains legitimacy + publicTrust', () => {
    const updates = recalculateFactionRelationships(multiFactionSettlement(), PLAGUE);
    const religiousUpdates = updates.filter(u => u.archetype === 'religious');
    expect(religiousUpdates.length).toBeGreaterThanOrEqual(2);
    const fields = new Set(religiousUpdates.map(u => u.field));
    expect(fields.has('legitimacy')).toBe(true);
    expect(fields.has('publicTrust')).toBe(true);
  });

  it('plague: government takes a legitimacy hit', () => {
    const updates = recalculateFactionRelationships(multiFactionSettlement(), PLAGUE);
    const govHit = updates.find(u => u.archetype === 'government' && u.field === 'legitimacy');
    expect(govHit).toBeTruthy();
    expect(govHit.delta).toBeLessThan(0);
  });

  it('plague: merchant takes publicTrust hit but gains wealth', () => {
    const updates = recalculateFactionRelationships(multiFactionSettlement(), PLAGUE);
    const merchantTrust = updates.find(u => u.archetype === 'merchant' && u.field === 'publicTrust');
    const merchantWealth = updates.find(u => u.archetype === 'merchant' && u.field === 'wealth');
    expect(merchantTrust.delta).toBeLessThan(0);
    expect(merchantWealth.delta).toBeGreaterThan(0);
  });

  it('plague: criminal gains power', () => {
    const updates = recalculateFactionRelationships(multiFactionSettlement(), PLAGUE);
    const criminalGain = updates.find(u => u.archetype === 'criminal' && u.field === 'power');
    expect(criminalGain.delta).toBeGreaterThan(0);
  });

  it('corruption_exposed: government takes the biggest legitimacy hit', () => {
    const updates = recalculateFactionRelationships(
      multiFactionSettlement(),
      { type: 'CORRUPTION_EXPOSED', factionImpactArchetype: 'corruption_exposed' },
    );
    const govHit = updates.find(u => u.archetype === 'government' && u.field === 'legitimacy');
    expect(govHit).toBeTruthy();
    expect(govHit.delta).toBeLessThanOrEqual(-8);
    // Religious benefits.
    const relGain = updates.find(u => u.archetype === 'religious' && u.field === 'publicTrust');
    expect(relGain.delta).toBeGreaterThan(0);
  });

  it('siege_lifted: lifts military legitimacy and merchant wealth simultaneously', () => {
    const updates = recalculateFactionRelationships(
      multiFactionSettlement(),
      { type: 'SIEGE_LIFTED' },
      { archetype: 'siege_lifted' },
    );
    const mil = updates.find(u => u.archetype === 'military' && u.field === 'legitimacy');
    const mer = updates.find(u => u.archetype === 'merchant' && u.field === 'wealth');
    expect(mil.delta).toBeGreaterThan(0);
    expect(mer.delta).toBeGreaterThan(0);
  });
});

// ── dominant_npc_removed routing ───────────────────────────────────────

describe('recalculateFactionRelationships() — dominant_npc_removed', () => {
  const targetNpc = {
    id: 'npc.captain_rusk',
    name: 'Captain Rusk',
    archetype: 'military',
    factionLink: 'faction.military_guard',
    rank: 'dominant',
  };

  it('hits the target NPC\'s faction with sameAsTarget deltas', () => {
    const updates = recalculateFactionRelationships(
      multiFactionSettlement(),
      { type: 'KILL_NPC' },
      { archetype: 'dominant_npc_removed', targetNpc },
    );
    expect(updates.length).toBeGreaterThan(0);

    // All sameAsTarget hits should land on the military faction.
    const hit = updates.find(u => u.archetype === 'military' && u.field === 'power');
    expect(hit).toBeTruthy();
    expect(hit.delta).toBeLessThan(0);
  });

  it('promotes a non-same-archetype rival faction', () => {
    const updates = recalculateFactionRelationships(
      multiFactionSettlement(),
      { type: 'KILL_NPC' },
      { archetype: 'dominant_npc_removed', targetNpc },
    );
    // One rival faction (non-military) gets a +power update.
    const rivalGain = updates.find(u =>
      u.archetype !== 'military' && u.field === 'power' && u.delta > 0
    );
    expect(rivalGain).toBeTruthy();
  });

  it('returns [] when no targetNpc is provided', () => {
    const updates = recalculateFactionRelationships(
      multiFactionSettlement(),
      { type: 'KILL_NPC' },
      { archetype: 'dominant_npc_removed' },
    );
    expect(updates).toEqual([]);
  });

  it('falls back to archetype matching when factionLink is missing', () => {
    const npcNoLink = { ...targetNpc, factionLink: null };
    const updates = recalculateFactionRelationships(
      multiFactionSettlement(),
      { type: 'KILL_NPC' },
      { archetype: 'dominant_npc_removed', targetNpc: npcNoLink },
    );
    const hit = updates.find(u => u.archetype === 'military');
    expect(hit).toBeTruthy();
  });
});

// ── Update shape integrity ─────────────────────────────────────────────

describe('FactionRelationshipUpdate shape integrity', () => {
  it('every update carries all canonical fields', () => {
    const updates = recalculateFactionRelationships(
      multiFactionSettlement(),
      { type: 'CUT_TRADE_ROUTE' },
    );
    for (const u of updates) {
      expect(typeof u.factionId).toBe('string');
      expect(u.factionId).toMatch(/^faction\./);
      expect(typeof u.factionName).toBe('string');
      expect(typeof u.archetype).toBe('string');
      expect(typeof u.field).toBe('string');
      expect(typeof u.delta).toBe('number');
      expect(typeof u.reason).toBe('string');
      expect(typeof u.eventType).toBe('string');
    }
  });

  it('field is always one of the canonical FactionUpdateField values', () => {
    const updates = recalculateFactionRelationships(
      multiFactionSettlement(),
      { type: 'CUT_TRADE_ROUTE' },
    );
    const canonical = new Set(['power', 'legitimacy', 'wealth', 'publicTrust', 'manpower']);
    for (const u of updates) {
      expect(canonical.has(u.field), `unexpected field: ${u.field}`).toBe(true);
    }
  });
});

// ── No mutation ─────────────────────────────────────────────────────────

describe('recalculateFactionRelationships() does not mutate', () => {
  it('does not modify the settlement', () => {
    const s = multiFactionSettlement();
    const before = JSON.stringify(s);
    recalculateFactionRelationships(s, { type: 'CUT_TRADE_ROUTE' });
    expect(JSON.stringify(s)).toBe(before);
  });

  it('does not modify the event', () => {
    const event = { type: 'CUT_TRADE_ROUTE', targetId: 'south_road' };
    const before = JSON.stringify(event);
    recalculateFactionRelationships(multiFactionSettlement(), event);
    expect(JSON.stringify(event)).toBe(before);
  });
});

// ── Nullish handling ────────────────────────────────────────────────────

describe('recalculateFactionRelationships() — nullish + edge cases', () => {
  it('returns [] for nullish settlement', () => {
    expect(recalculateFactionRelationships(null, { type: 'CUT_TRADE_ROUTE' })).toEqual([]);
  });

  it('returns [] for nullish event', () => {
    expect(recalculateFactionRelationships(multiFactionSettlement(), null)).toEqual([]);
  });

  it('returns [] when settlement has no factions', () => {
    expect(recalculateFactionRelationships(
      { name: 'No Faction Town' },
      { type: 'CUT_TRADE_ROUTE' },
    )).toEqual([]);
  });
});

// ── summarizeByFaction ─────────────────────────────────────────────────

describe('summarizeByFaction()', () => {
  it('aggregates numeric deltas per faction per field', () => {
    const updates = [
      { factionId: 'faction.a', factionName: 'A', archetype: 'merchant', field: 'wealth', delta: -8, reason: '' },
      { factionId: 'faction.a', factionName: 'A', archetype: 'merchant', field: 'wealth', delta: -2, reason: '' },
      { factionId: 'faction.a', factionName: 'A', archetype: 'merchant', field: 'power',  delta: -4, reason: '' },
      { factionId: 'faction.b', factionName: 'B', archetype: 'criminal', field: 'power',  delta: +6, reason: '' },
    ];
    const summary = summarizeByFaction(updates);
    expect(summary['faction.a'].deltas.wealth).toBe(-10);
    expect(summary['faction.a'].deltas.power).toBe(-4);
    expect(summary['faction.b'].deltas.power).toBe(6);
  });

  it('returns {} for empty / nullish input', () => {
    expect(summarizeByFaction([])).toEqual({});
    expect(summarizeByFaction(null)).toEqual({});
  });
});

// ── supportedArchetypes / factionIdFromName ────────────────────────────

describe('supportedArchetypes()', () => {
  it('returns at least the documented archetypes', () => {
    const list = supportedArchetypes();
    expect(list).toContain('plague');
    expect(list).toContain('trade_route_cut');
    expect(list).toContain('corruption_exposed');
    expect(list).toContain('food_anchor_lost');
    expect(list).toContain('dominant_npc_removed');
    expect(list).toContain('siege_lifted');
  });
});

describe('factionIdFromName()', () => {
  it('produces a stable id', () => {
    expect(factionIdFromName('Merchant Guilds')).toBe('faction.merchant_guilds');
    expect(factionIdFromName(null)).toBeNull();
  });
});

// ── Integration: real generated settlement ─────────────────────────────

describe('recalculateFactionRelationships() — real generated settlement', () => {
  it('produces deltas against a city-tier settlement\'s actual factions', () => {
    const settlement = generateSettlementPipeline(
      { settType: 'city', culture: 'germanic' },
      null,
      { seed: 'factionUpdates-2026-05-18', customContent: {} },
    );

    const updates = recalculateFactionRelationships(
      settlement,
      { type: 'CUT_TRADE_ROUTE', targetId: 'south_road' },
    );
    expect(updates.length).toBeGreaterThan(0);
    // Every update should reference a faction that actually exists.
    const existingFactionIds = new Set(
      (settlement.powerStructure?.factions || []).map(f =>
        `faction.${f.faction.replace(/[^a-zA-Z0-9]+/g, '_').replace(/^_+|_+$/g, '').toLowerCase()}`
      )
    );
    for (const u of updates) {
      expect(existingFactionIds.has(u.factionId), `${u.factionId} not on settlement`).toBe(true);
    }
  });
});
