/**
 * dealingLines.test.js — E13b (WORDS-1; the tenth chair's ruling G39 of 2026-11-25): "HOW THEY DEAL" DOES NOT REPEAT IN A TOWN
 * WHILE ITS PAIR'S POOL ALLOWS. Every person of one disposition and trait family printed the same sentence, up to five on a page
 * (measured at 0ec96f13d: C 590 / 96 / 12 / 2 town-pairs at 2 / 3 / 4 / 5 cards). Each of the 52 pairs holds two lines and the
 * eighteen that reach three cards hold three (70 new sentences, the owner's to veto); one town pass after the last draw gives
 * the cards of a pair the pair's lines in turn, ranked by a hash of the seed and the card's own id.
 * THE ORACLE is the raw record: each card's pair is read from its own disposition and traits by the shipped draw
 * (`npcData.js :: dealingLineFor`, the line it would have printed), never from the pass.
 */
import { readFileSync } from 'node:fs';
import { beforeAll, describe, expect, it } from 'vitest';
import { generateSettlementPipeline, regenNPCsPipeline } from '../../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../../src/domain/density/densityCreateBoundary.js';
import { NPC_DEALING_BY_TRAIT, NPC_PLOT_HOOKS_DATA, dealingLineFor } from '../../../src/data/npcData.js';
import { DEALING_POOL_OF_FIRST_LINE, NPC_DEALING_LINES } from '../../../src/data/people/dealingLines.js';
import { dealingLinesOfTown } from '../../../src/generators/people/dealingLinesOfTown.js';

/** births of the measure (C: `{ settType }`): a pair at five, at four, at three, at two cards */
const SEEDS = ['dp-metropolis-31', 'dp-city-26', 'dp-city-103', 'dp-city-0'];
/** @type {Record<string, any>} */ const towns = {};
beforeAll(async () => {
  await loadGenerationLawPayloads();
  for (const seed of SEEDS) towns[seed] = generateSettlementPipeline(birthConfig({ settType: /** @type {RegExpMatchArray} */ (seed.match(/^dp-(\w+)-\d+$/))[1] }), null, { seed, customContent: {} });
}, 900000);

/** @param {any} card @returns {ReadonlyArray<string> | null} the card's pair's lines, from its own disposition and traits */
const poolOf = (card) => {
  const first = dealingLineFor(card?.presentation?.disposition, card?.personality);
  const lines = DEALING_POOL_OF_FIRST_LINE.get(first) || null;
  return lines && lines.includes(card?.presentation?.behaviour) ? lines : null; // a title row's line is not the pair's
};
/** @param {any[]} npcs @returns {string[]} two cards of one pair sharing a line while the pool still had a free one */
const repeatsWithin = (npcs) => {
  /** @type {Map<ReadonlyArray<string>, any[]>} */ const by = new Map();
  for (const c of npcs) { const lines = poolOf(c); if (lines) by.set(lines, [...(by.get(lines) || []), c]); }
  /** @type {string[]} */ const out = [];
  for (const [lines, cards] of by) {
    const held = new Set(cards.map((c) => c.presentation.behaviour));
    if (held.size < Math.min(cards.length, lines.length)) out.push(`${cards.length} cards, pool ${lines.length}, lines held ${held.size}: ${lines[0]}`);
  }
  return out;
};

describe('E13b · how they deal', () => {
  it('the table: 52 pairs, each first line the existing sentence by import, two lines each and three for eighteen; 70 new, all distinct, no reflexive', () => {
    expect(Object.keys(NPC_DEALING_LINES).sort()).toEqual(Object.keys(NPC_DEALING_BY_TRAIT).sort());
    /** @type {string[]} */ const fresh = [];
    for (const [d, byFamily] of Object.entries(NPC_DEALING_LINES)) {
      expect(Object.keys(byFamily).sort()).toEqual([...Object.keys(NPC_DEALING_BY_TRAIT[d]), 'own'].sort());
      for (const [f, lines] of Object.entries(byFamily)) {
        expect(lines[0], `${d}/${f}`).toBe(f === 'own' ? NPC_PLOT_HOOKS_DATA[d] : NPC_DEALING_BY_TRAIT[d][f]);
        expect(lines.length === 2 || lines.length === 3, `${d}/${f}`).toBe(true);
        fresh.push(...lines.slice(1));
      }
    }
    const pools = [...DEALING_POOL_OF_FIRST_LINE.values()];
    expect(pools.length).toBe(52);
    expect(pools.filter((l) => l.length === 3).length).toBe(18);
    expect(fresh.length).toBe(70);
    expect(new Set(pools.flat()).size).toBe(pools.flat().length);
    expect(fresh.filter((t) => /\b(?:themselves|himself|herself)\b/.test(t))).toEqual([]);
    // the first lines are imported, never copied: no existing sentence stands as a literal in the new table's source
    const source = readFileSync(new URL('../../../src/data/people/dealingLines.js', import.meta.url), 'utf8');
    expect(pools.map((l) => l[0]).filter((t) => source.includes(t))).toEqual([]);
  });

  it('no two cards of one pair share a line in a town while the pool allows; the first ranked keeps today\'s line', () => {
    /** @type {string[]} */ const faults = []; let atThreePlus = 0;
    for (const [seed, s] of Object.entries(towns)) {
      for (const r of repeatsWithin(s.npcs)) faults.push(`${seed}: ${r}`);
      /** @type {Map<ReadonlyArray<string>, any[]>} */ const by = new Map();
      for (const c of s.npcs) { const lines = poolOf(c); if (lines) by.set(lines, [...(by.get(lines) || []), c]); }
      for (const [lines, cards] of by) {
        if (cards.length >= 3) atThreePlus++;
        if (!cards.some((c) => c.presentation.behaviour === lines[0])) faults.push(`${seed}: no card keeps the first line of "${lines[0]}"`);
      }
      if (dealingLinesOfTown(s.npcs, s._seed) !== s.npcs) faults.push(`${seed}: a second pass changed the town`);
    }
    expect(faults).toEqual([]);
    expect(atThreePlus, 'fixture premise: a pair at three cards or more').toBeGreaterThan(0);
  });

  it('the regen: a kept card is untouched; no repeat among the rest while the pool allows; a re-resolve changes nothing', () => {
    const town = towns['dp-city-26'];
    const kept = town.npcs.find((/** @type {any} */ c) => poolOf(c));
    expect(kept, 'fixture premise: a card holding a dealing line').toBeTruthy();
    const held = { ...town, npcs: town.npcs.map((/** @type {any} */ c) => (c === kept ? { ...c, _authored: true } : c)) };
    const parts = regenNPCsPipeline(held, held.config, { seed: 'e13b-regen' });
    const after = parts.npcs.find((/** @type {any} */ c) => c?._authored === true && c?.name === kept.name);
    expect(after?.presentation?.behaviour).toBe(kept.presentation.behaviour);
    expect(repeatsWithin(parts.npcs)).toEqual([]);
    expect(dealingLinesOfTown(parts.npcs, 'e13b-regen', { keep: new Set([String(after.id)]) })).toBe(parts.npcs);
  });
});
