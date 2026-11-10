/**
 * PULSE-SITES (2026-11-10) — the simulation's reads of a person's power, re-pointed from the retired card
 * fields to the card's `memberships` (src/domain/people/membership.js), each on a REAL generated record.
 *
 * The people rework (2026-11-07) moved a card's power standing from `factionAffiliation` to `memberships`;
 * the migration (settlementMigrations.js :: migrateV1toV2) maps `factionAffiliation` to a membership, and the
 * retired field was the shim's FIRST-RANK power (membership.js :: powersByRankOf, "the same order the shim
 * derives the two old fields by"). So each read of `npc.factionAffiliation` below is re-pointed to
 * `firstRankMembershipOf(npc, powerOrderOf(settlement))` — one cause per file, red first.
 *
 * The records: the soak corpus's own births (scripts/audit/soak-review/corpus.mjs :: birth), soak1k-3 (a town)
 * and soak1k-4 (a city), born at the lane's base.
 */
import { beforeAll, describe, expect, it } from 'vitest';
import { birth, ensureLaws } from '../../scripts/audit/soak-review/corpus.mjs';
import { firstRankMembershipOf, powerOrderOf } from '../../src/domain/people/membership.js';
import { EVENT_REGISTRY } from '../../src/domain/events/registry.js';

/** @type {any[]} */
let towns = [];
beforeAll(async () => {
  await ensureLaws();
  towns = [birth(3).settlement, birth(4).settlement];
}, 120_000);

/** Every card of the births with a first-rank power, with its settlement and that power. */
function rankedCards() {
  const out = [];
  for (const s of towns) {
    const order = powerOrderOf(s);
    for (const npc of s.npcs || []) {
      const first = firstRankMembershipOf(npc, order);
      if (first && npc.id && npc.name) out.push({ s, npc, power: first.power });
    }
  }
  return out;
}

describe('the records carry the relation only as memberships (the probe the cures stand on)', () => {
  it('no born card carries factionAffiliation, and the births hold first-rank members', () => {
    const cards = towns.flatMap((s) => s.npcs || []);
    expect(cards.filter((n) => 'factionAffiliation' in n)).toEqual([]);
    expect(rankedCards().length).toBeGreaterThan(10);
  });
});

describe('events/registry.js :: PROMOTE_NPC / DEMOTE_NPC narrate name the first-rank power', () => {
  it('every first-rank member is narrated within its power, never "their power"', () => {
    const cards = rankedCards();
    for (const { s, npc, power } of cards) {
      expect(EVENT_REGISTRY.PROMOTE_NPC.narrate({ type: 'PROMOTE_NPC', targetId: npc.id }, s))
        .toBe(`${npc.name} rises within ${power}, displacing a rival on the way up.`);
      expect(EVENT_REGISTRY.DEMOTE_NPC.narrate({ type: 'DEMOTE_NPC', targetId: npc.id }, s))
        .toBe(`${npc.name} is pushed down the ranks of ${power}.`);
    }
  });

  it('a card with no membership keeps the template\'s own fallback', () => {
    const s = towns[0];
    const none = { id: 'pulse-sites-none', name: 'Nobody Inparticular', memberships: [] };
    const settlement = { ...s, npcs: [...s.npcs, none] };
    expect(EVENT_REGISTRY.PROMOTE_NPC.narrate({ type: 'PROMOTE_NPC', targetId: none.id }, settlement))
      .toBe('Nobody Inparticular rises within their power, displacing a rival on the way up.');
  });
});

describe('worldPulse/houseLedger.js :: castHouseFactor casts a member by first-rank power', () => {
  it('every power with a first-rank member on stage casts one of them as its factor', async () => {
    const { castHouseFactor } = await import('../../src/domain/worldPulse/houseLedger.js');
    let cast = 0;
    for (const s of towns) {
      const order = powerOrderOf(s);
      for (const f of s.powerStructure.factions) {
        const factor = castHouseFactor(s, f);
        const firsts = (s.npcs || []).filter((n) => n.id && firstRankMembershipOf(n, order)?.power === f.faction);
        if (!firsts.length) { expect(factor).toBe(''); continue; }
        expect(firsts.map((n) => String(n.id))).toContain(factor);
        cast += 1;
      }
    }
    expect(cast).toBeGreaterThan(3);
  });
});

describe('worldPulse/npcVerdictTable.js :: vacatedSeatOf names the first-rank power as the seat', () => {
  it('every first-rank member vacates a seat at its first-rank power', async () => {
    const { vacatedSeatOf } = await import('../../src/domain/worldPulse/npcVerdictTable.js');
    const cards = rankedCards();
    for (const { s, npc, power } of cards) expect(vacatedSeatOf(s, npc)).toEqual({ factionId: '', factionName: power });
    const none = { id: 'pulse-sites-none', name: 'Nobody Inparticular', memberships: [] };
    expect(vacatedSeatOf(towns[0], none)).toEqual({ factionId: '', factionName: '' });
  });
});
