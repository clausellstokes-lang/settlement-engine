/**
 * tests/generators/tieReserveHead.test.js — GOALS-1 (GR3 for ties; the chair's rulings of 2026-11-20 10:28 UTC: "the
 * head size frozen; new pairs reached only past it", and a template that must be held twice is never held by two people
 * tied to each other). `npcData.js :: pairProse` takes an optional reserve (empty in every pool today) and carries
 * `head`, its variants' count; the tie draw (`power/relationshipArchetypes.js :: createTieProseDraw`) keeps its cycle,
 * its two-name lines and today's resolution on the first `head` indices, and only where today's resolution prints an
 * index the town already printed for the archetype (a repeat) does it choose, draw-free: (i) the reserve's first free
 * admitted index; (ii) else an index printed ONCE whose earlier tie shares no card with this one, in the order the
 * overflow cycle visits; (iii) else today's. A replacement declares the same trust as today's index.
 *
 * Every expectation is COMPUTED from the pool itself (which lines name both cards, which declare a trust, which index
 * each tie printed): no sentence of a pool is quoted.
 *
 *   (a) the frozen head: every pool's head is its size (every reserve empty), and the first `head` ties deal as before;
 *   (b) a planted repeat past the head takes an index printed once by a tie sharing no card, never one whose earlier tie
 *       shares a card while another is free;
 *   (c) the trust guard: a candidate whose trust differs from today's index is passed over.
 *
 * @enforced-by npx vitest run tests/generators/tieReserveHead.test.js
 */
import { describe, expect, it } from 'vitest';
import { STRESS_ECONOMIC_EFFECTS } from '../../src/data/npcData.js';
import { createTieProseDraw } from '../../src/generators/power/relationshipArchetypes.js';
import { CALM_FACTS_ADMIT_ALL } from '../helpers/calmFactsDouble.js';

/** R-N's one calm double, with the two answers a tie row reads that it leaves open (a council; a guild). */
const ADMIT_ALL = { ...CALM_FACTS_ADMIT_ALL, rulerKind: 'council', guild: true };
/** A card of the planted town. @param {string} id */
const card = (id) => ({ id, name: `Card ${id}` });
const STAND_A = card('stand-a');
const STAND_B = card('stand-b');

/** The indices of the archetype's tension lines that name both cards, read off the pool. @param {any} archetype */
const namedOf = (archetype) => Array.from({ length: archetype.tension.size }, (_, i) => i)
  .filter((i) => { const line = archetype.tension(STAND_A, STAND_B, i); return line.includes(STAND_A.name) && line.includes(STAND_B.name); });
/** The trust an index declares (its desc row's, else its tension row's), as `ties.js :: temperOfTie` reads it. @param {any} archetype @param {number} i */
const trustOf = (archetype, i) => {
  const rows = [archetype.desc.lines, archetype.tension.lines].map((l) => l[i % l.length]);
  return rows.map((r) => (r && typeof r === 'object' ? r.trust : undefined)).find((t) => t !== undefined);
};

/**
 * A town of one archetype: its first `size` ties each between two fresh cards (`h<k>` and `g<k>`), then the planted
 * overflow ties in order. @param {any} archetype @param {Array<[string, string]>} overflow
 * @returns {{ head: Array<{ from: string, to: string, v: number }>, after: Array<{ from: string, to: string, v: number }> }}
 */
const townOf = (archetype, overflow) => {
  const draw = createTieProseDraw(undefined, ADMIT_ALL);
  const deal = (/** @type {string} */ a, /** @type {string} */ b) => ({ from: a, to: b, v: draw(archetype, card(a), card(b)).proseVariant });
  const head = Array.from({ length: archetype.tension.size }, (_, k) => deal(`h${k}`, `g${k}`));
  return { head, after: overflow.map(([a, b]) => deal(a, b)) };
};

/** The order the overflow cycle visits from index `v` (the two-name lines, from v's place). @param {number[]} named @param {number} v */
const cycleFrom = (named, v) => named.map((_, k) => named[(named.indexOf(v) + k) % named.length]);

describe('GR3 for ties: the head frozen, a repeat reaches past it (GOALS-1)', () => {
  it('(a) every pool carries its head, and with every reserve empty the head is the whole pool', () => {
    for (const [key, archetype] of Object.entries(STRESS_ECONOMIC_EFFECTS)) {
      expect(archetype.tension.head, `${key}: tension head`).toBe(archetype.tension.size);
      expect(archetype.desc.head, `${key}: desc head`).toBe(archetype.desc.size);
      expect(archetype.desc.size, `${key}: one index picks both rows`).toBe(archetype.tension.size);
    }
  });

  it('(a) the first `head` ties of an archetype deal every head index once, in the cycle (KEEP)', () => {
    for (const archetype of Object.values(STRESS_ECONOMIC_EFFECTS)) {
      const { head } = townOf(archetype, []);
      const got = head.map((t) => t.v);
      const size = archetype.tension.size;
      expect([...got].sort((x, y) => x - y)).toEqual(Array.from({ length: size }, (_, i) => i));
      expect(got.map((v) => (v - got[0] + size) % size)).toEqual(got.map((_, k) => k));
    }
  });

  /** An archetype whose every index names both cards and declares no trust: the overflow cycle is the whole pool. */
  const PLAIN = Object.entries(STRESS_ECONOMIC_EFFECTS).find(([, a]) => namedOf(a).length === a.tension.size
    && Array.from({ length: a.tension.size }, (_, i) => trustOf(a, i)).every((t) => t === undefined));

  it('(b) a repeat whose earlier tie shares a card takes the next index printed once by a tie sharing none', () => {
    expect(PLAIN, 'a plain archetype exists').toBeDefined();
    const [key, archetype] = /** @type {[string, any]} */ (PLAIN);
    // the overflow tie's index for a pair of fresh cards: today's, kept (no card shared with its earlier tie)
    const { head, after: [fresh] } = townOf(archetype, [['fresh-a', 'fresh-b']]);
    const earlier = head.find((t) => t.v === fresh.v);
    expect(earlier, `${key}: the overflow index was printed in the head`).toBeDefined();
    // the same town, its overflow tie planted on the card that printed that index
    const { after: [planted] } = townOf(archetype, [[/** @type {any} */ (earlier).from, 'fresh-c']]);
    const want = cycleFrom(namedOf(archetype), fresh.v).find((v) => {
      const by = head.find((t) => t.v === v);
      return by && ![by.from, by.to].includes(planted.from) && ![by.from, by.to].includes(planted.to);
    });
    expect(planted.v, `${key}: the planted repeat moves off the index its own card printed`).not.toBe(fresh.v);
    expect(planted.v, `${key}: the first index in the cycle printed once by a tie sharing no card`).toBe(want);
  });

  it('(b) never an index whose earlier tie shares a card while another is free', () => {
    const [key, archetype] = /** @type {[string, any]} */ (PLAIN);
    const { head, after: [fresh] } = townOf(archetype, [['fresh-a', 'fresh-b']]);
    const order = cycleFrom(namedOf(archetype), fresh.v);
    const byIndex = (/** @type {number} */ v) => /** @type {{ from: string, to: string }} */ (head.find((t) => t.v === v));
    // planted on the card that printed today's index AND the card that printed the next one in the cycle
    const { after: [planted] } = townOf(archetype, [[byIndex(order[0]).from, byIndex(order[1]).to]]);
    const sharing = new Set(order.filter((v) => { const by = byIndex(v); return [by.from, by.to].some((c) => c === planted.from || c === planted.to); }));
    expect(sharing.size, `${key}: two indices printed by a tie sharing a card`).toBe(2);
    expect(sharing.has(planted.v), `${key}: ${planted.v} was printed by a tie sharing a card`).toBe(false);
    expect(planted.v, `${key}: the first index in the cycle whose tie shares no card`).toBe(order.find((v) => !sharing.has(v)));
  });

  it('(c) a candidate whose trust differs from today\'s index is passed over', () => {
    // an archetype whose two-name lines mix a declared trust and none
    const found = Object.entries(STRESS_ECONOMIC_EFFECTS).find(([, a]) => namedOf(a).length === a.tension.size
      && new Set(Array.from({ length: a.tension.size }, (_, i) => trustOf(a, i))).size > 1);
    expect(found, 'an archetype mixing trust lines exists').toBeDefined();
    const [key, archetype] = /** @type {[string, any]} */ (found);
    const named = namedOf(archetype);
    // fresh overflow ties walk the overflow cycle; stop at the first whose next index in the cycle declares another trust
    /** @type {Array<[string, string]>} */
    const lead = [];
    let probe = townOf(archetype, [['fresh-0', 'fresh-1']]);
    let today = probe.after[0].v;
    for (let n = 0; n < named.length && trustOf(archetype, cycleFrom(named, today)[1]) === trustOf(archetype, today); n++) {
      lead.push([`lead-${n}`, `lead-${n}-b`]);
      probe = townOf(archetype, [...lead, ['fresh-0', 'fresh-1']]);
      today = probe.after[lead.length].v;
    }
    const order = cycleFrom(named, today);
    expect(trustOf(archetype, order[1]), `${key}: the next index declares another trust than ${today}`).not.toBe(trustOf(archetype, today));
    const earlier = /** @type {{ from: string }} */ (probe.head.find((t) => t.v === today));
    const { head, after } = townOf(archetype, [...lead, [earlier.from, 'fresh-c']]);
    const planted = after[lead.length];
    const printedOnce = (/** @type {number} */ v) => [...head, ...after.slice(0, lead.length)].filter((t) => t.v === v).length === 1;
    const want = order.slice(1).find((v) => printedOnce(v) && trustOf(archetype, v) === trustOf(archetype, today));
    expect(planted.v, `${key}: the repeat moved`).not.toBe(today);
    expect(planted.v, `${key}: the next index of another trust is passed over`).not.toBe(order[1]);
    expect(trustOf(archetype, planted.v), `${key}: the replacement declares today's trust`).toBe(trustOf(archetype, today));
    expect(planted.v, `${key}: the first index of today's trust printed once`).toBe(want);
  });
});
