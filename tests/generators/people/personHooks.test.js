/**
 * personHooks.test.js — ONE PLOT HOOK PER REPRESENTATIVE (the people car, PEOPLE-3 HOOKS, step 1;
 * docs/chair/2026-11-07/BRIEF-PEOPLE-3-HOOKS-2026-11-07.md; the owner: "one plot hook per NPC
 * rather than multiple").
 *
 * The claims: the hook pool is keyed by the face's title through the pool map, every mapped title
 * reaching a pool that exists (M-4: no new prose); every card of the soak's first 120 carries
 * EXACTLY one hook, drawn from its own pool; a card whose hook the record contradicts redraws the
 * next true line of its own pool (the planted refusal), draw-free; a held hook is never repeated.
 *
 * BUDGET: the corpus arm births 120 full settlements (~30 s on the lane's machine); it carries an
 * explicit per-test budget at that measured cost, never the suite-wide timeout.
 */
import { describe, expect, it } from 'vitest';
import { NPC_FACTION_LOYALTY } from '../../../src/data/npcData.js';
import { HOOK_POOLS, POOL_BY_SHELF, POOL_BY_TITLE, hookPoolFor } from '../../../src/generators/people/poolMap.js';
import { truePersonHooks } from '../../../src/generators/people/personHooks.js';
import { birth, ensureLaws } from '../../../scripts/audit/soak-review/corpus.mjs';

const lines = (pool) => new Set(NPC_FACTION_LOYALTY[pool]);
const ALL_LINES = new Set(Object.values(NPC_FACTION_LOYALTY).flat());

describe('the person hook pool, keyed by title through the pool map', () => {
  it('every mapped title reaches a hook pool that exists, by its title', () => {
    expect(HOOK_POOLS.length).toBe(7);
    for (const title of Object.keys(POOL_BY_TITLE)) {
      const row = hookPoolFor(title, null);
      expect(row.via, title).toBe('title');
      expect(row.fallback, title).toBe(false);
      expect(NPC_FACTION_LOYALTY[row.pool]?.length, title).toBeGreaterThan(0);
    }
  });

  it('a title with no row draws its shelf\'s pool and is listed as a fallback; the seat draws government', () => {
    for (const shelf of Object.keys(POOL_BY_SHELF)) {
      const row = hookPoolFor('the unheard-of keeper', shelf);
      expect(row.via).toBe('shelf');
      expect(row.fallback).toBe(true);
      expect(HOOK_POOLS).toContain(row.pool);
    }
    expect(hookPoolFor('the unheard-of keeper', null)).toEqual({ pool: 'other', via: 'generic', fallback: true });
    expect(hookPoolFor('the miller', 'Crafts', { seat: true })).toEqual({ pool: 'government', via: 'seat', fallback: false });
    expect(hookPoolFor("the revolt's leader", null, { category: 'military' })).toEqual({ pool: 'military', via: 'mint', fallback: false });
  });
});

describe('the redraw: a refused hook takes the next true line of its own pool (HK-LAW-1)', () => {
  const settlement = (npcs) => ({ name: 'Ashford', tier: 'village', institutions: [], npcs });

  it('the PLANTED refusal: a card whose stored hook names a hospital the place lacks redraws a true line', () => {
    const planted = 'The hospital has sealed its doors and will not say why.';
    const s = settlement([
      { id: 'npc_a', name: 'A', category: 'religious', plotHooks: [planted] },
      { id: 'npc_b', name: 'B', category: 'religious', plotHooks: [NPC_FACTION_LOYALTY.religious[0]] },
    ]);
    const next = truePersonHooks(s, 'river');
    expect(next).not.toBe(s.npcs);
    expect(next[0].plotHooks).toHaveLength(1);
    expect(next[0].plotHooks[0]).not.toBe(planted);
    expect(lines('religious').has(next[0].plotHooks[0])).toBe(true);
    // never a line another card holds
    expect(next[0].plotHooks[0]).not.toBe(NPC_FACTION_LOYALTY.religious[0]);
    // the true card is untouched, by reference
    expect(next[1]).toBe(s.npcs[1]);
  });

  it('a card left with none (the record check dropped it) takes one; a record of true hooks is returned by reference', () => {
    const s = settlement([{ id: 'npc_a', name: 'A', category: 'economy', plotHooks: [] }]);
    const next = truePersonHooks(s, 'river');
    expect(next[0].plotHooks).toHaveLength(1);
    expect(lines('economy').has(next[0].plotHooks[0])).toBe(true);
    // draw-free and stable: the same record gives the same line
    expect(truePersonHooks(s, 'river')[0].plotHooks).toEqual(next[0].plotHooks);
    const settled = settlement(next);
    expect(truePersonHooks(settled, 'river')).toBe(settled.npcs);
  });
});

describe('every card of the soak carries exactly one hook, from the pool map\'s pools', () => {
  it('the soak\'s first 120: one hook per card, every line authored, no repeat below the city', async () => {
    await ensureLaws();
    let cards = 0;
    let authored = 0;
    /** @type {Record<string, number>} */
    const repeats = {};
    for (let i = 0; i < 120; i += 1) {
      const s = birth(i).settlement;
      const roster = (s.npcs || []).filter((n) => n && n.institution);
      const seen = new Set();
      for (const card of roster) {
        cards += 1;
        expect(card.plotHooks, `${i} ${card.id}`).toHaveLength(1);
        const [line] = card.plotHooks;
        // below the city the pools hold a line for every face; a city or metropolis can hold more
        // faces of one kind than its pool and the generic pools together have lines (measured on
        // these 120: 145 repeats, all city/metropolis — the writing wave's W7 HOOKS). Re-keyed 145 -> 156 by
        // MERGE-234 (the chair's ruling: a magic-swapped face draws its hook from its EFFECTIVE category): over
        // lane 1's world-law swap, 21 faces of these 120 (19 in a city or metropolis) draw from `other` instead
        // of `magic`, spending `other` lines later faces then repeat; the seam mints' own repeats fell 3 -> 0.
        if (seen.has(line)) repeats[s.tier] = (repeats[s.tier] || 0) + 1;
        seen.add(line);
        if (ALL_LINES.has(line)) authored += 1;
      }
    }
    // liveness anchor: the corpus carried cards at all
    expect(cards).toBeGreaterThan(1000);
    // every line is the pool's own, or its inland twin (F5) where the place has no water
    expect(authored / cards).toBeGreaterThan(0.9);
    expect(Object.keys(repeats).filter((tier) => !['city', 'metropolis'].includes(tier))).toEqual([]);
    expect((repeats.city || 0) + (repeats.metropolis || 0)).toBeLessThanOrEqual(156);
  }, 90_000);
});
