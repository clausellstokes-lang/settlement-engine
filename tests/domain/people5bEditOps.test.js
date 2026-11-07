/**
 * tests/domain/people5bEditOps.test.js — PEOPLE-5B EDIT (2026-11-07, the chair's ruling M-7): the edit
 * layer's ops round-trip on the v2 card. A card's standing is `memberships` ([{ power, rank, share }], every
 * power ∈ powerStructure.factions) and its house is `institution` ({ kind, key, family, title } | null).
 *
 * The proofs, each on a PLANTED or a GENERATED settlement:
 *   P1 create   — entities/npcs.js :: createNpc writes `memberships` and `institution: null` (a DM card).
 *   P2 reassign — the seat fields' three mirrors move together: the intent (pendingEditIntents.js) admits a
 *                 membership list and a house; the writer (settlementPendingEditWriters.js) refuses a power
 *                 the record does not carry and applies one it does; the op (npc/npcOps.js) carries both.
 *   P3 rename   — a POWER rename moves every `memberships[].power` and a minted face's `institution.key`;
 *                 an INSTITUTION rename moves a house face's `institution.key` (its title source).
 *   P4 the role assignment and the death loop read and append memberships; successors overlap on them.
 */
import { describe, expect, test, vi } from 'vitest';
import { createNpc, killNpc, assignNpcToRole } from '../../src/domain/entities/npcs.js';
import { normalizePendingEditPayload } from '../../src/domain/pendingEditIntents.js';
import { applyNpcOp } from '../../src/store/settlementPendingEditWriters.js';
import { reassignNpc, SEAT_HELD_FIELDS } from '../../src/domain/npc/npcOps.js';
import { applyFactionRenameToSettlement } from '../../src/domain/factionRename.js';
import { applyInstitutionRenameToSettlement } from '../../src/domain/institutionRename.js';
import { inferSuccessors } from '../../src/domain/entities/successors.js';
import { entityLinksFaction } from '../../src/domain/factionRefs.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';

const planted = () => ({
  name: 'Plantford',
  schemaVersion: 2,
  powerStructure: { factions: [
    { faction: 'Merchant Guilds', power: 40, isGoverning: true },
    { faction: 'Temple of Dawn', power: 35 },
    { faction: 'Thieves\' Guild', power: 25 },
  ] },
  institutions: [{ name: 'Counting House', category: 'economy' }, { name: 'Dawn Chapel', category: 'religious' }],
  npcs: [
    { id: 'npc_counting_house', name: 'Ada Vell', role: 'the guild master', title: 'the guild master', importance: 'pillar',
      institution: { kind: 'house', key: 'Counting House', family: 'Counting House', title: 'the guild master' },
      memberships: [{ power: 'Merchant Guilds', rank: 1, share: 1 }] },
    { id: 'npc_dawn_chapel', name: 'Bren Sol', role: 'the priest', title: 'the priest', importance: 'key',
      institution: { kind: 'house', key: 'Dawn Chapel', family: 'Chapel', title: 'the priest' },
      memberships: [{ power: 'Temple of Dawn', rank: 1, share: 1 }, { power: 'Merchant Guilds', rank: 2, share: 0.5 }] },
    { id: 'npc_power_thieves', name: 'Cass Morrow', role: 'the guildmaster', title: 'the guildmaster', importance: 'key',
      institution: { kind: 'power', key: 'Thieves\' Guild', family: null, title: 'the guildmaster' },
      memberships: [{ power: 'Thieves\' Guild', rank: 1, share: 1 }] },
  ],
  relationships: [],
});

describe('P1 — create: the card is born on the v2 shape', () => {
  test('a DM card is a face of no house with no membership; a given membership is kept', () => {
    const dm = createNpc({ name: 'Dela', role: 'smuggler' });
    expect(dm.memberships).toEqual([]);
    expect(dm.institution).toBeNull();
    expect('linkedFactionIds' in dm, 'the retired field is not written').toBe(false);
    const placed = createNpc({ name: 'Dela', role: 'smuggler', memberships: [{ power: 'Thieves\' Guild', rank: null, share: null }] });
    expect(placed.memberships).toEqual([{ power: 'Thieves\' Guild', rank: null, share: null }]);
    expect(placed.id, 'the id seed reads the powers, so a placed card is a different person from an unplaced one')
      .not.toBe(dm.id);
  });
});

describe('P2 — reassign: the three seat mirrors move together', () => {
  test('the op carries memberships and the house; the retired fields are not seat fields', () => {
    expect(SEAT_HELD_FIELDS).toContain('memberships');
    expect(SEAT_HELD_FIELDS).toContain('institution');
    expect(SEAT_HELD_FIELDS).not.toContain('factionAffiliation');
    expect(SEAT_HELD_FIELDS).not.toContain('linkedFactionIds');
    const s = planted();
    const target = { memberships: [{ power: 'Temple of Dawn', rank: 2, share: null }], institution: null };
    const out = reassignNpc(s, 0, target);
    expect(out.ok).toBe(true);
    expect(out.settlement.npcs[0].memberships).toEqual(target.memberships);
    expect(out.settlement.npcs[0].institution).toBeNull();
    expect(s.npcs[0].memberships[0].power, 'pure: the input is untouched').toBe('Merchant Guilds');
  });

  test('the intent admits a membership list and a house, and refuses a malformed one', () => {
    const s = planted();
    const ctx = { settlement: s, settlementRef: 'x', ownerKey: 'o', phase: 'draft' };
    const ok = normalizePendingEditPayload('reassign-npc', { npcId: 'npc_counting_house',
      target: { memberships: [{ power: ' Temple of Dawn ', rank: 1 }], institution: { kind: 'house', key: 'Dawn Chapel' } } }, ctx);
    expect(ok.ok).toBe(true);
    expect(ok.payload.target).toEqual({
      memberships: [{ power: 'Temple of Dawn', rank: 1, share: null }],
      institution: { kind: 'house', key: 'Dawn Chapel', family: null, title: null },
    });
    for (const bad of [
      { memberships: 'Temple of Dawn' },
      { memberships: [{ power: '' }] },
      { memberships: [{ power: 'Temple of Dawn', rank: 4 }] },
      { memberships: [{ power: 'Temple of Dawn' }, { power: 'Temple of Dawn' }] },
      { institution: { kind: 'guild', key: 'X' } },
      { factionAffiliation: 'Temple of Dawn' },
      { linkedFactionIds: ['faction.temple_of_dawn'] },
    ]) {
      const res = normalizePendingEditPayload('reassign-npc', { npcId: 'npc_counting_house', target: bad }, ctx);
      expect(res.ok, JSON.stringify(bad)).toBe(false);
    }
  });

  test('the writer refuses a power the record does not carry and applies one it does', () => {
    const state = { settlement: planted(), persistActiveSaveEdit: vi.fn() };
    const run = (target) => applyNpcOp(() => state, (producer) => producer(state),
      { kind: 'reassign-npc', payload: { npcId: 'npc_counting_house', target } });
    const refused = run({ memberships: [{ power: 'The Dissolved Grouping', rank: 1, share: null }] });
    expect(refused.ok).toBe(false);
    expect(refused.reason).toBe('npc_membership_power_unknown');
    expect(state.settlement.npcs[0].memberships[0].power).toBe('Merchant Guilds');
    const applied = run({ memberships: [{ power: 'Thieves\' Guild', rank: 2, share: null }] });
    expect(applied.ok).toBe(true);
    expect(state.settlement.npcs[0].memberships).toEqual([{ power: 'Thieves\' Guild', rank: 2, share: null }]);
  });
});

describe('P3 — rename: the powers and the houses cascade onto the card', () => {
  test('a power rename moves every membership and the minted face\'s institution.key', () => {
    const s = planted();
    const res = applyFactionRenameToSettlement(s, 'Thieves\' Guild', 'The Night Ledger');
    expect(res.changed).toBe(true);
    expect(s.npcs[2].memberships[0].power).toBe('The Night Ledger');
    expect(s.npcs[2].institution.key, 'a minted face is the face of the power itself').toBe('The Night Ledger');
    const renamedGuild = applyFactionRenameToSettlement(s, 'Merchant Guilds', 'The Exchange');
    expect(renamedGuild.changed).toBe(true);
    expect(s.npcs[1].memberships.map((m) => m.power)).toEqual(['Temple of Dawn', 'The Exchange']);
    expect(s.npcs[0].institution.key, 'a house face\'s key is the institution ledger\'s, never a power\'s').toBe('Counting House');
    const dead = JSON.stringify(s.npcs).match(/Merchant Guilds|Thieves' Guild/g);
    expect(dead, 'no card holds a dead power name').toBeNull();
  });

  test('an institution rename renames a card\'s house (its title source), and only the house kind', () => {
    const s = planted();
    const res = applyInstitutionRenameToSettlement(s, 'Dawn Chapel', 'Chapel of First Light');
    expect(res.changed).toBe(true);
    expect(s.npcs[1].institution.key).toBe('Chapel of First Light');
    expect(s.npcs[0].institution.key).toBe('Counting House');
    expect(s.npcs[2].institution.key, 'a power-kind face is untouched by a house rename').toBe('Thieves\' Guild');
  });

  test('on a GENERATED v2 record: a power rename leaves no membership naming the dead power', () => {
    const s = generateSettlementPipeline({ settType: 'town' }, null, { seed: 'people-5b-rename', customContent: {} });
    expect(s.schemaVersion).toBe(2);
    expect('factions' in s, 'the v2 record carries no grouping').toBe(false);
    const target = s.powerStructure.factions.find((f) => s.npcs.some((n) => (n.memberships || []).some((m) => m.power === (f.faction || f.name))));
    expect(target, 'a power some card stands in').toBeTruthy();
    const old = target.faction || target.name;
    const holders = s.npcs.filter((n) => n.memberships.some((m) => m.power === old)).length;
    expect(holders).toBeGreaterThan(0);
    applyFactionRenameToSettlement(s, old, 'Renamed Power');
    expect(s.npcs.filter((n) => n.memberships.some((m) => m.power === old)).length).toBe(0);
    expect(s.npcs.filter((n) => n.memberships.some((m) => m.power === 'Renamed Power')).length).toBe(holders);
  });
});

describe('P4 — the role assignment, the death loop and the successors read memberships', () => {
  test('an appointment appends its power once; a death impairs every power the card stands in', () => {
    const s = planted();
    const { npc } = assignNpcToRole({ npc: s.npcs[0], institutionId: 'Dawn Chapel', quality: 'competent', factionAlignment: 'Temple of Dawn', eventId: 'e1' });
    expect(npc.memberships.map((m) => m.power)).toEqual(['Merchant Guilds', 'Temple of Dawn']);
    expect(npc.memberships[1]).toEqual({ power: 'Temple of Dawn', rank: null, share: null });
    const again = assignNpcToRole({ npc, institutionId: 'Dawn Chapel', quality: 'competent', factionAlignment: 'Temple of Dawn', eventId: 'e2' });
    expect(again.npc.memberships.length, 'once').toBe(2);
    const { factionImpairments } = killNpc(s.npcs[1], 'e3');
    expect(factionImpairments.map((f) => f.factionId)).toEqual(['Temple of Dawn', 'Merchant Guilds']);
    expect(entityLinksFaction(s.npcs[1], s.powerStructure.factions[1], s.powerStructure.factions)).toBe(true);
    expect(entityLinksFaction(s.npcs[2], s.powerStructure.factions[1], s.powerStructure.factions)).toBe(false);
  });

  test('the successors overlap on the powers (no grouping fallback)', () => {
    const s = planted();
    const ids = inferSuccessors({ outgoing: s.npcs[0], settlement: s }).map((n) => n.id);
    expect(ids, 'the priest shares the Merchant Guilds').toEqual(['npc_dawn_chapel']);
  });
});
