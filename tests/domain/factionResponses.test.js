/**
 * Faction archetype tests — the four shipped responders (Merchant Guild,
 * Temple, Watch, Thieves' Guild) match correctly and produce sensible
 * stances for the canonical event types, and any faction that matches none
 * of them falls through to a single generic neutral response.
 *
 * Direction-of-causality only — we don't pin exact prose strings since
 * those will be tuned, but we do pin (a) which archetype responds and
 * (b) the stance, since those are user-facing engine claims.
 */

import { describe, test, expect } from 'vitest';
import { generateFactionResponses } from '../../src/domain/events/factionResponses.js';

const settlementWith = (factions) => ({
  factions, powerStructure: { factions },
});

function ev(type, overrides = {}) {
  return {
    id: `ev_${type}`,
    type,
    targetId: '',
    payload: {},
    cause: 'player_action',
    ...overrides,
  };
}

describe('faction archetype matching', () => {
  test('merchant guild matches by name and category', () => {
    const r1 = generateFactionResponses(settlementWith([{ name: 'Merchant Guild' }]), ev('CUT_TRADE_ROUTE'));
    const r2 = generateFactionResponses(settlementWith([{ name: 'River Traders', category: 'merchant' }]), ev('CUT_TRADE_ROUTE'));
    expect(r1.length).toBe(1);
    expect(r2.length).toBe(1);
  });

  test('temple matches by religious category and clergy names', () => {
    const r1 = generateFactionResponses(settlementWith([{ name: 'Temple of Mercy', category: 'religious' }]), ev('PLAGUE'));
    const r2 = generateFactionResponses(settlementWith([{ name: 'The Clergy' }]), ev('PLAGUE'));
    expect(r1.length).toBe(1);
    expect(r2.length).toBe(1);
  });

  test('watch matches military and watch keywords', () => {
    const r = generateFactionResponses(
      settlementWith([{ name: 'Town Watch', category: 'military' }]),
      ev('RAID_OR_MONSTER_ATTACK'),
    );
    expect(r.length).toBe(1);
  });

  test('thieves guild matches criminal category and shadow names', () => {
    const r1 = generateFactionResponses(
      settlementWith([{ name: 'Thieves\' Guild', category: 'criminal' }]),
      ev('CUT_TRADE_ROUTE'),
    );
    const r2 = generateFactionResponses(
      settlementWith([{ name: 'Shadow Hand' }]),
      ev('CUT_TRADE_ROUTE'),
    );
    expect(r1.length).toBe(1);
    expect(r2.length).toBe(1);
  });

  test('thieves guild wins over merchant when name has both', () => {
    // "Thieves' Guild" matches both /thieves/ and /guild/ patterns.
    // Match-order specificity should pick thieves_guild.
    const r = generateFactionResponses(
      settlementWith([{ name: 'Thieves\' Guild' }]),
      ev('CUT_TRADE_ROUTE'),
    );
    expect(r.length).toBe(1);
    expect(r[0].response.toLowerCase()).toMatch(/smugglers|chokepoint|guild thrives/);
  });

  test('unmatched factions get exactly one neutral fallback response', () => {
    const r = generateFactionResponses(
      settlementWith([{ name: 'Random Townspeople' }]),
      ev('PLAGUE'),
    );
    expect(r).toHaveLength(1);
    expect(r[0].stance).toBe('neutral');
    expect(r[0].factionName).toBe('Random Townspeople');
  });
});

describe('generic fallback responder', () => {
  test('a noble house with no specific responder still emits one neutral stance', () => {
    const r = generateFactionResponses(
      settlementWith([{ name: 'House Valeric', category: 'noble' }]),
      ev('CUT_TRADE_ROUTE'),
    );
    expect(r).toHaveLength(1);
    expect(r[0].stance).toBe('neutral');
    expect(r[0].factionId).toBe('faction.house_valeric');
    expect(r[0].factionName).toBe('House Valeric');
    expect(typeof r[0].response).toBe('string');
    expect(r[0].response.length).toBeGreaterThan(0);
  });

  test('fallback is deterministic — same faction + event yields identical output', () => {
    const make = () => generateFactionResponses(
      settlementWith([{ name: 'The Arcane Conclave', category: 'arcane' }]),
      ev('PLAGUE'),
    );
    expect(make()).toEqual(make());
  });

  test('specific archetypes are NOT doubled — they get exactly their one specific response', () => {
    // A merchant faction matches a specific responder, so it must NOT also pick
    // up a generic fallback. Exactly one response, and it's the merchant one.
    const r = generateFactionResponses(
      settlementWith([{ name: 'River Traders', category: 'merchant' }]),
      ev('CUT_TRADE_ROUTE'),
    );
    expect(r).toHaveLength(1);
    expect(r[0].stance).toBe('threat');
  });

  test('mixed settlement — specific factions respond specifically, others get one neutral fallback each', () => {
    const r = generateFactionResponses(
      settlementWith([
        { name: 'Town Watch',    category: 'military' },
        { name: 'House Valeric', category: 'noble' },
        { name: 'Dock Workers',  category: 'labor' },
      ]),
      ev('RAID_OR_MONSTER_ATTACK'),
    );
    expect(r).toHaveLength(3);
    const byName = Object.fromEntries(r.map(x => [x.factionName, x]));
    expect(byName['Town Watch'].stance).toBe('threat');     // specific watch response
    expect(byName['House Valeric'].stance).toBe('neutral'); // generic fallback
    expect(byName['Dock Workers'].stance).toBe('neutral');  // generic fallback
  });
});

describe('temple responses', () => {
  const temple = settlementWith([{ name: 'Temple of Mercy', category: 'religious' }]);

  test('PLAGUE: opportunity_and_threat — both relief role and risk', () => {
    const [r] = generateFactionResponses(temple, ev('PLAGUE'));
    expect(r.stance).toBe('opportunity_and_threat');
  });

  test('REFUGEE_WAVE: temple opens doors — opportunity_and_threat', () => {
    const [r] = generateFactionResponses(temple, ev('REFUGEE_WAVE'));
    expect(r.stance).toBe('opportunity_and_threat');
  });

  test('EXPOSE_CORRUPTION (elsewhere): temple takes moral high ground', () => {
    const [r] = generateFactionResponses(temple, ev('EXPOSE_CORRUPTION', { targetId: 'faction.merchants' }));
    expect(r.stance).toBe('opportunity');
  });

  test('KILL_LEADER: temple frames death as divine sign', () => {
    const [r] = generateFactionResponses(temple, ev('KILL_LEADER'));
    expect(r.stance).toBe('threat');
    expect(r.response.toLowerCase()).toMatch(/mourning|justice|gods/);
  });
});

describe('watch responses', () => {
  const watch = settlementWith([{ name: 'Town Watch', category: 'military' }]);

  test('RAID_OR_MONSTER_ATTACK: watch mobilizes', () => {
    const [r] = generateFactionResponses(watch, ev('RAID_OR_MONSTER_ATTACK'));
    expect(r.stance).toBe('threat');
  });

  test('REFUGEE_WAVE: watch fortifies', () => {
    const [r] = generateFactionResponses(watch, ev('REFUGEE_WAVE'));
    expect(r.stance).toBe('threat');
  });

  test('ASSIGN_NPC_TO_ROLE corrupt captain: watch grumbles', () => {
    const [r] = generateFactionResponses(watch, ev('ASSIGN_NPC_TO_ROLE', {
      payload: { role: 'Watch Captain', quality: 'corrupt' },
    }));
    expect(r.stance).toBe('threat');
  });

  test('ASSIGN_NPC_TO_ROLE popular captain: morale lifts', () => {
    const [r] = generateFactionResponses(watch, ev('ASSIGN_NPC_TO_ROLE', {
      payload: { role: 'Watch Captain', quality: 'popular' },
    }));
    expect(r.stance).toBe('opportunity');
  });

  test('ASSIGN_NPC_TO_ROLE non-captain: no response', () => {
    const r = generateFactionResponses(watch, ev('ASSIGN_NPC_TO_ROLE', {
      payload: { role: 'Apprentice Smith', quality: 'competent' },
    }));
    expect(r).toEqual([]);
  });
});

describe('thieves guild responses', () => {
  const guild = settlementWith([{ name: 'Thieves\' Guild', category: 'criminal' }]);

  test('CUT_TRADE_ROUTE: opportunity (smugglers thrive)', () => {
    const [r] = generateFactionResponses(guild, ev('CUT_TRADE_ROUTE'));
    expect(r.stance).toBe('opportunity');
  });

  test('damaging law enforcement: opportunity (vacuum to fill)', () => {
    const [r] = generateFactionResponses(guild, ev('DAMAGE_INSTITUTION', { targetId: 'institution.watch' }));
    expect(r.stance).toBe('opportunity');
  });

  test('REFUGEE_WAVE: opportunity (recruitment pool)', () => {
    const [r] = generateFactionResponses(guild, ev('REFUGEE_WAVE'));
    expect(r.stance).toBe('opportunity');
  });

  test('PLAGUE: opportunity_and_threat (smuggling medicine)', () => {
    const [r] = generateFactionResponses(guild, ev('PLAGUE'));
    expect(r.stance).toBe('opportunity_and_threat');
  });

  test('EXPOSE_CORRUPTION: scapegoats and silence', () => {
    const [r] = generateFactionResponses(guild, ev('EXPOSE_CORRUPTION'));
    expect(r.stance).toBe('opportunity_and_threat');
  });
});

describe('multi-archetype settlement', () => {
  test('plague triggers responses from temple, watch, and thieves guild simultaneously', () => {
    const responses = generateFactionResponses(
      settlementWith([
        { name: 'Temple of the Hearth', category: 'religious' },
        { name: 'Town Watch',           category: 'military' },
        { name: 'Crow Hand',            category: 'criminal' },
      ]),
      ev('PLAGUE'),
    );
    expect(responses).toHaveLength(3);
    const stances = responses.map(r => r.stance).sort();
    // Watch threatens (quarantine), temple opportunity-and-threat, guild opportunity-and-threat
    expect(stances.filter(s => s === 'threat')).toHaveLength(1);
  });
});
