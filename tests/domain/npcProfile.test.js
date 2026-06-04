/**
 * tests/domain/npcProfile.test.js - Structured NPC profile contract.
 *
 * Pins the Tier 4.5 derivation surface: category → archetype mapping,
 * institution / faction linkage inference, removal-consequence
 * forecasts per archetype × rank, primary-relationship surfacing,
 * idempotence, lossless legacy-field carry-through.
 */

import { describe, it, expect } from 'vitest';
import {
  deriveNpcProfile,
  deriveAllNpcProfiles,
  npcArchetypeBreakdown,
  dominantNpcRemovalImpact,
} from '../../src/domain/npcProfile.js';

// ── Sample NPCs ─────────────────────────────────────────────────────────

function militaryCaptain(over = {}) {
  return {
    id: 'npc_2',
    name: 'Beatrix Becker',
    role: 'Guard Captain',
    category: 'military',
    factionAffiliation: 'Military/Guard',
    structuralPosition: 'Commands enforcement capacity where civilian governance is failing.',
    structuralRank: 'dominant',
    influence: 'high',
    power: 9,
    goal: {
      short: 'Maintain operational cohesion while the chain of command is ambiguous.',
      long: 'Rebuild guard morale after years of under-funding.',
    },
    secret: {
      what: 'Has been delaying vital information from reaching the council.',
      stakes: 'When the consequences emerge, the delay will be traced.',
    },
    plotHooks: [
      'A weapons cache they were responsible for is smaller than it should be.',
      'Someone is paying their soldiers more than their salary.',
    ],
    ...over,
  };
}

function templeHighPriest(over = {}) {
  return {
    id: 'npc_3',
    name: 'Sister Vaela',
    role: 'High Priestess',
    category: 'religious',
    factionAffiliation: 'Religious Authorities',
    structuralRank: 'dominant',
    influence: 'high',
    power: 8,
    goal: { short: 'Expand the relief role.', long: 'Cement temple authority over public welfare.' },
    secret: { what: 'Took a deal with the merchant guild.', stakes: 'Discovery would shatter trust.' },
    plotHooks: ['The relief queues are growing daily.'],
    ...over,
  };
}

function minorTraderNpc(over = {}) {
  return {
    id: 'npc_7',
    name: 'Oren the Quiet',
    role: 'Stall Keeper',
    category: 'economy',
    factionAffiliation: 'Merchant Guilds',
    structuralRank: 'minor',
    influence: 'low',
    power: 3,
    goal: { short: 'Keep his stall', long: 'Buy his brother out of debt.' },
    plotHooks: [],
    ...over,
  };
}

// ── deriveNpcProfile (single NPC) ───────────────────────────────────────

describe('deriveNpcProfile()', () => {
  it('produces all canonical fields on a rich NPC', () => {
    const profile = deriveNpcProfile(militaryCaptain());
    expect(profile.id).toBe('npc_2');
    expect(profile.name).toBe('Beatrix Becker');
    expect(profile.archetype).toBe('military');
    expect(profile.rank).toBe('dominant');
    expect(profile.factionLink).toBe('faction.military_guard');
    expect(profile.leverage.length).toBeGreaterThan(0);
    expect(profile.vulnerabilities.length).toBeGreaterThan(0);
    expect(profile.consequenceIfRemoved).toBeTruthy();
    expect(profile.consequenceIfRemoved.severity).toBe('dominant');
    expect(profile.consequenceIfRemoved.consequences.length).toBeGreaterThan(0);
  });

  it('maps category to canonical faction archetype', () => {
    expect(deriveNpcProfile(militaryCaptain()).archetype).toBe('military');
    expect(deriveNpcProfile(templeHighPriest()).archetype).toBe('religious');
    expect(deriveNpcProfile({ id: 'x', name: 'X', category: 'economy' }).archetype).toBe('merchant');
    expect(deriveNpcProfile({ id: 'x', name: 'X', category: 'craft' }).archetype).toBe('craft');
    expect(deriveNpcProfile({ id: 'x', name: 'X', category: 'criminal' }).archetype).toBe('criminal');
    expect(deriveNpcProfile({ id: 'x', name: 'X', category: 'arcane' }).archetype).toBe('arcane');
    expect(deriveNpcProfile({ id: 'x', name: 'X', category: 'unknown' }).archetype).toBe('other');
  });

  it('factionLink derives a stable id from factionAffiliation', () => {
    expect(deriveNpcProfile(militaryCaptain()).factionLink).toBe('faction.military_guard');
    expect(deriveNpcProfile(templeHighPriest()).factionLink).toBe('faction.religious_authorities');
    expect(deriveNpcProfile({ id: 'x', name: 'X', factionAffiliation: '' }).factionLink).toBeNull();
  });

  it('inferences institutionLink from settlement institutions when available', () => {
    const settlement = {
      institutions: [
        { name: 'Town Watch' },
        { name: 'Royal Mill' },
      ],
    };
    expect(deriveNpcProfile(militaryCaptain(), settlement).institutionLink).toBe('institution.town_watch');
  });

  it('institutionLink is null when no matching institution exists', () => {
    expect(deriveNpcProfile(militaryCaptain(), { institutions: [] }).institutionLink).toBeNull();
  });

  it('vulnerabilities include the secret-driven exposure when a secret is present', () => {
    const profile = deriveNpcProfile(militaryCaptain());
    const hasSecretLine = profile.vulnerabilities.some(v => v.includes('Secret-driven exposure'));
    expect(hasSecretLine).toBe(true);
  });

  it('vulnerabilities omit the secret line when no secret is present', () => {
    const profile = deriveNpcProfile({ ...militaryCaptain(), secret: undefined });
    const hasSecretLine = profile.vulnerabilities.some(v => v.includes('Secret-driven exposure'));
    expect(hasSecretLine).toBe(false);
  });

  it('publicReputation falls through structuralPosition → presentation → role', () => {
    expect(deriveNpcProfile(militaryCaptain()).publicReputation)
      .toContain('Commands enforcement capacity');
    expect(deriveNpcProfile({ id: 'x', name: 'X', role: 'Innkeeper' }).publicReputation)
      .toContain('Innkeeper');
    expect(deriveNpcProfile({ id: 'x', name: 'X' }).publicReputation).toBeNull();
  });

  it('privateAgenda prefers goal.long but falls back to goal.short', () => {
    expect(deriveNpcProfile(militaryCaptain()).privateAgenda).toContain('Rebuild guard morale');
    expect(deriveNpcProfile({ id: 'x', name: 'X', goal: { short: 'just survive' } }).privateAgenda)
      .toBe('just survive');
  });

  it('offerToPlayers takes the first two plot hooks', () => {
    const profile = deriveNpcProfile(militaryCaptain());
    expect(profile.offerToPlayers.length).toBe(2);
    expect(profile.offerToPlayers[0]).toContain('weapons cache');
  });

  it('returns null for nullish input', () => {
    expect(deriveNpcProfile(null)).toBeNull();
    expect(deriveNpcProfile(undefined)).toBeNull();
  });

  it('does not mutate the input', () => {
    const input = militaryCaptain();
    const before = JSON.stringify(input);
    deriveNpcProfile(input, { institutions: [{ name: 'Town Watch' }] });
    expect(JSON.stringify(input)).toBe(before);
  });

  it('leverage / vulnerabilities are fresh clones (mutating return does not pollute template)', () => {
    const a = deriveNpcProfile(militaryCaptain());
    a.leverage.push('mutate me');
    a.vulnerabilities.push('mutate me too');
    const b = deriveNpcProfile(militaryCaptain());
    expect(b.leverage).not.toContain('mutate me');
    expect(b.vulnerabilities).not.toContain('mutate me too');
  });
});

// ── Consequence-if-removed forecasts ────────────────────────────────────

describe('consequenceIfRemoved', () => {
  it('a dominant military NPC produces multiple severe consequences', () => {
    const profile = deriveNpcProfile(militaryCaptain());
    expect(profile.consequenceIfRemoved.severity).toBe('dominant');
    expect(profile.consequenceIfRemoved.consequences.length).toBeGreaterThanOrEqual(3);
    // Military removal should reference watch / patrols.
    const text = profile.consequenceIfRemoved.consequences.join(' ');
    expect(text).toMatch(/watch|patrol/i);
  });

  it('a minor NPC produces a single trivial consequence', () => {
    const profile = deriveNpcProfile(minorTraderNpc());
    expect(profile.consequenceIfRemoved.severity).toBe('minor');
    expect(profile.consequenceIfRemoved.consequences.length).toBeGreaterThan(0);
    expect(profile.consequenceIfRemoved.consequences.length).toBeLessThan(3);
  });

  it('a dominant religious NPC consequences mention relief / legitimacy', () => {
    const profile = deriveNpcProfile(templeHighPriest());
    const text = profile.consequenceIfRemoved.consequences.join(' ');
    expect(text).toMatch(/relief|legitimacy|mourning|moral/i);
  });

  it('unknown archetype falls back to "other" consequences', () => {
    const profile = deriveNpcProfile({
      id: 'x', name: 'X', category: 'mystery', structuralRank: 'dominant',
    });
    expect(profile.archetype).toBe('other');
    expect(profile.consequenceIfRemoved.consequences.length).toBeGreaterThan(0);
  });

  it('unknown rank falls back to minor consequences', () => {
    const profile = deriveNpcProfile({
      id: 'x', name: 'X', category: 'military', structuralRank: undefined,
    });
    expect(profile.rank).toBe('minor');
    expect(profile.consequenceIfRemoved.severity).toBe('minor');
  });
});

// ── Primary relationship inference ──────────────────────────────────────

describe('primaryRelationship', () => {
  const sampleRelationships = [
    {
      type: 'ally',
      typeName: 'Pragmatic Alliance',
      description: 'They work together because the alternative is worse.',
      tension: 'A third party is destabilizing the calculation.',
      npc1Id: 'npc_2', npc2Id: 'npc_3',
      npc1N: 'Beatrix Becker', npc2N: 'Sister Vaela',
    },
  ];

  it('surfaces a relationship for an NPC who has one', () => {
    const profile = deriveNpcProfile(militaryCaptain(), { relationships: sampleRelationships });
    expect(profile.primaryRelationship).toBeTruthy();
    expect(profile.primaryRelationship.otherName).toBe('Sister Vaela');
    expect(profile.primaryRelationship.tension).toContain('third party');
  });

  it('returns null when no relationships involve this NPC', () => {
    const profile = deriveNpcProfile({ ...militaryCaptain(), id: 'npc_99' },
                                     { relationships: sampleRelationships });
    expect(profile.primaryRelationship).toBeNull();
  });

  it('returns null when settlement has no relationships', () => {
    const profile = deriveNpcProfile(militaryCaptain());
    expect(profile.primaryRelationship).toBeNull();
  });
});

// ── deriveAllNpcProfiles + diagnostics ─────────────────────────────────

describe('deriveAllNpcProfiles()', () => {
  it('maps every NPC on the settlement to a profile', () => {
    const settlement = {
      npcs: [militaryCaptain(), templeHighPriest(), minorTraderNpc()],
    };
    const profiles = deriveAllNpcProfiles(settlement);
    expect(profiles).toHaveLength(3);
    expect(profiles[0].archetype).toBe('military');
    expect(profiles[1].archetype).toBe('religious');
    expect(profiles[2].archetype).toBe('merchant');
  });

  it('returns [] for a settlement with no NPCs', () => {
    expect(deriveAllNpcProfiles({})).toEqual([]);
    expect(deriveAllNpcProfiles(null)).toEqual([]);
  });

  it('filters out nullish entries gracefully', () => {
    const settlement = { npcs: [militaryCaptain(), null, undefined, templeHighPriest()] };
    expect(deriveAllNpcProfiles(settlement)).toHaveLength(2);
  });
});

describe('npcArchetypeBreakdown()', () => {
  it('counts NPCs by archetype', () => {
    const settlement = {
      npcs: [
        militaryCaptain(),
        templeHighPriest(),
        minorTraderNpc(),
        { id: 'x', name: 'X', category: 'criminal' },
      ],
    };
    const breakdown = npcArchetypeBreakdown(settlement);
    expect(breakdown.military).toBe(1);
    expect(breakdown.religious).toBe(1);
    expect(breakdown.merchant).toBe(1);
    expect(breakdown.criminal).toBe(1);
    expect(breakdown.government).toBe(0);
  });
});

describe('dominantNpcRemovalImpact()', () => {
  it('aggregates consequences across every dominant-rank NPC', () => {
    const settlement = {
      npcs: [militaryCaptain(), templeHighPriest(), minorTraderNpc()],
    };
    const impact = dominantNpcRemovalImpact(settlement);
    // The two dominant NPCs each contribute multiple consequences;
    // the minor trader contributes none to this list.
    expect(impact.length).toBeGreaterThanOrEqual(6);
    const archetypes = new Set(impact.map(i => i.archetype));
    expect(archetypes.has('military')).toBe(true);
    expect(archetypes.has('religious')).toBe(true);
    expect(archetypes.has('merchant')).toBe(false);  // merchant NPC is minor rank
  });

  it('returns [] when no dominant NPCs are present', () => {
    expect(dominantNpcRemovalImpact({ npcs: [minorTraderNpc()] })).toEqual([]);
  });
});
