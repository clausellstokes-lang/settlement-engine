/**
 * tests/generators/tieReserveHead.test.js — GOALS-1 (GR3 for ties; the chair's rulings of 2026-11-20 10:28 UTC: "the
 * head size frozen; new pairs reached only past it", and a template that must be held twice is never held by two people
 * tied to each other). `npcData.js :: pairProse` takes an optional reserve (builder 5: the chair's 13 approved pairs, in
 * five archetypes; empty in every other pool) and carries
 * `head`, its variants' count; the tie draw (`power/relationshipArchetypes.js :: createTieProseDraw`) keeps its cycle,
 * its two-name lines and today's resolution on the first `head` indices, and only where today's resolution prints an
 * index the town already printed for the archetype (a repeat) does it choose, draw-free: (i) the reserve's first free
 * admitted index; (ii) else an index printed ONCE whose earlier tie shares no card with this one, in the order the
 * overflow cycle visits; (iii) else today's. A replacement declares the same trust as today's index.
 *
 * Every expectation is COMPUTED from the pool itself (which lines name both cards, which declare a trust, which index
 * each tie printed): no sentence of a pool is quoted.
 *
 *   (a) the frozen head: a pool without a reserve has its head as its size, and the first `head` ties deal as before;
 *   (b) a planted repeat past the head takes an index printed once by a tie sharing no card, never one whose earlier tie
 *       shares a card while another is free (on a pool without a reserve, where rung (i) has nothing to give);
 *   (c) the trust guard: a candidate whose trust differs from today's index is passed over (likewise).
 *
 * GOALS-4 builder 11 (the chair's rulings of 2026-11-20 20:30, 20:50 and 21:30 UTC; TIES-HOLD): RE-KEYED BY CAUSE. The
 * rungs became (1) the head in its keyed order from the drawn index, (2) the reserve from the cycle's place, each the first
 * line not yet taken that the trust clause and the declarations admit, else (3) the LEAST PRINTED admitted line (a line
 * naming both cards first, then one whose earlier ties share no card, then the same order); and the trust clause became the
 * corrected law: a replacement that DECLARES a trust stands in only for today's same trust, one that declares NONE for any.
 * So (b)'s and (c)'s expected indices are computed by that law (`trustOk`, `overflowDealt`, `fallbackOf`); the claims
 * stand. CONDITION (b), the planted arm below: a reserve line that declares a DIFFERENT trust is still refused.
 * THE RESERVE ARMS (builder 5; red at 94493d1fd, where no reserve exists):
 *   (a) with the real reserve: `head` is the variants' count, `size` the head and its reserve, and the first `head` ties
 *       deal exactly the head-only cycle;
 *   (b) a repeat past the head takes the reserve's first free admitted index from the cycle's place, each at most once,
 *       then rung (ii);
 *   (c) a saved tie inside the head re-renders, through the re-render's own call, as the head-only lines write it (a
 *       KEEP: green at 94493d1fd too, where the head is the whole pool and nothing can differ);
 *   (d) a reserve index (and its exchanged form) resolves at every reader of `proseVariant` to the reserve's own line.
 *
 * @enforced-by npx vitest run tests/generators/tieReserveHead.test.js
 */
import { describe, expect, it } from 'vitest';
import { REVERSED_TIE, STRESS_ECONOMIC_EFFECTS, tieIndexOf } from '../../src/data/npcData.js';
import { secondMentions } from '../../src/data/people/personMention.js';
import { fnv1a32 } from '../../src/kernel/proseHash.js';
import { createTieProseDraw } from '../../src/generators/power/relationshipArchetypes.js';
import { CALM_FACTS_ADMIT_ALL } from '../helpers/calmFactsDouble.js';

/** R-N's one calm double, with the two answers a tie row reads that it leaves open (a council; a guild). */
const ADMIT_ALL = { ...CALM_FACTS_ADMIT_ALL, rulerKind: 'council', guild: true };
/** A card of the planted town. @param {string} id */
const card = (id) => ({ id, name: `Card ${id}` });
const STAND_A = card('stand-a');
const STAND_B = card('stand-b');

/** The indices of the archetype's HEAD tension lines that name both cards, read off the pool. @param {any} archetype */
const namedOf = (archetype) => Array.from({ length: archetype.tension.head }, (_, i) => i)
  .filter((i) => { const line = archetype.tension(STAND_A, STAND_B, i); return line.includes(STAND_A.name) && line.includes(STAND_B.name); });
/** The trust an index declares (its desc row's, else its tension row's), as `ties.js :: temperOfTie` reads it. @param {any} archetype @param {number} i */
const trustOf = (archetype, i) => {
  const rows = [archetype.desc.lines, archetype.tension.lines].map((l) => l[i % l.length]);
  return rows.map((r) => (r && typeof r === 'object' ? r.trust : undefined)).find((t) => t !== undefined);
};

/** THE CORRECTED TRUST CLAUSE: index `i` may stand in for today's trust where it declares none or the same. @param {any} archetype @param {number} i @param {string | undefined} trust */
const trustOk = (archetype, i, trust) => trustOf(archetype, i) === undefined || trustOf(archetype, i) === trust;
/** Whether the tension line at `i` (head or reserve) names both cards. @param {any} archetype @param {number} i */
const namesBothAt = (archetype, i) => { const line = archetype.tension(STAND_A, STAND_B, i); return line.includes(STAND_A.name) && line.includes(STAND_B.name); };
/**
 * TIES-HOLD's last rung, as the draw ranks it: among the indices of today's trust clause, a line naming both cards first,
 * then the least printed, then one whose earlier ties share no card with the planted pair, then the walk's order (the head
 * from today's index, then the reserve from the cycle's place `place`).
 * @param {any} archetype @param {number} today @param {number} place @param {Array<{ from: string, to: string, v: number }>} ties
 * @param {[string, string]} pair @param {boolean} [clause] false: rank without the trust clause (for reading what it passes over)
 */
const fallbackOf = (archetype, today, place, ties, pair, clause = true) => {
  const head = archetype.tension.head, reserve = archetype.tension.size - head;
  const order = [...Array.from({ length: head }, (_, k) => (today + k) % head), ...Array.from({ length: reserve }, (_, k) => head + ((place + k) % reserve))];
  const rank = (/** @type {number} */ v, /** @type {number} */ at) => {
    const by = ties.filter((t) => t.v === v);
    return [namesBothAt(archetype, v) ? 0 : 1, by.length, by.some((t) => pair.includes(t.from) || pair.includes(t.to)) ? 1 : 0, at];
  };
  const open = order.map((v, at) => ({ v, r: rank(v, at) })).filter(({ v }) => !clause || trustOk(archetype, v, trustOf(archetype, today)));
  open.sort((x, y) => x.r[0] - y.r[0] || x.r[1] - y.r[1] || x.r[2] - y.r[2] || x.r[3] - y.r[3]);
  return open[0]?.v;
};
/**
 * A town of one archetype: its first `head` ties each between two fresh cards (`h<k>` and `g<k>`), then the planted
 * overflow ties in order (each with the description and tension the draw wrote). @param {any} archetype
 * @param {Array<[string, string]>} overflow
 * @returns {{ head: Array<{ from: string, to: string, v: number, d: string, t: string }>, after: Array<{ from: string, to: string, v: number, d: string, t: string }> }}
 */
const townOf = (archetype, overflow) => {
  const draw = createTieProseDraw(undefined, ADMIT_ALL);
  const deal = (/** @type {string} */ a, /** @type {string} */ b) => {
    const tie = draw(archetype, card(a), card(b));
    return { from: a, to: b, v: tie.proseVariant, d: tie.description, t: tie.tension };
  };
  const head = Array.from({ length: archetype.tension.head }, (_, k) => deal(`h${k}`, `g${k}`));
  return { head, after: overflow.map(([a, b]) => deal(a, b)) };
};

/** The order the overflow cycle visits from index `v` (the two-name lines, from v's place). @param {number[]} named @param {number} v */
const cycleFrom = (named, v) => named.map((_, k) => named[(named.indexOf(v) + k) % named.length]);

/** The reserve's length in each archetype that carries one (the chair's 13 approved pairs; counts, never lines). */
const RESERVE = Object.freeze({ mutual_leverage: 5, old_debt: 2, peer_rivalry: 2, wary_alliance: 2, mentor_legacy: 2 });
/** @param {string} key @returns {any} */
const archetypeOf = (key) => STRESS_ECONOMIC_EFFECTS[/** @type {keyof typeof STRESS_ECONOMIC_EFFECTS} */ (key)];
/** The cycle's offset in a `townOf` town: the fnv of its first tie's directed pair and the archetype's key. @param {string} key */
const baseOf = (key) => fnv1a32(`${card('h0').name}>${card('g0').name}::${key}`);
/** The force words handed to every render below (the re-render's own third argument). */
const FORCE = Object.freeze({ body: 'watch', members: 'watchmen', member: 'watchman' });
/**
 * A row rendered as `pairProse` writes it for two plain cards (no category, no seat, no secret: no order or debt exchange),
 * its two ends in the order the variant names: every closure the row may write (its line; its twin where it carries one).
 * @param {any} row @param {any} r @param {any} s @param {boolean} reversed @returns {string[]}
 */
const rendersOf = (row, r, s, reversed) => {
  const ends = reversed ? [s, r] : [r, s];
  const closures = typeof row === 'function' ? [row] : [row.line, ...(typeof row.twin === 'function' ? [row.twin] : [])];
  return closures.map((c) => secondMentions(c(ends[0], ends[1], FORCE), ends));
};
/**
 * `generateSettlementPipeline.js :: refreshRelationshipProjections`'s re-render of one stored tie, by its own call
 * (`archetype.desc(first, second, rel.proseVariant, force)`): that function is module-private and its one caller
 * (`carryLockedRosterThroughGenerate`) returns before it while `lockedNpcIdSet` is empty, so the call is mirrored here.
 * @param {{ from: string, to: string, archetypeKey: string, proseVariant: number }} rel @param {Map<string, any>} byId
 */
const rerender = (rel, byId) => {
  const archetype = archetypeOf(rel.archetypeKey);
  const first = byId.get(rel.from), second = byId.get(rel.to);
  return { description: archetype.desc(first, second, rel.proseVariant, FORCE), tension: archetype.tension(first, second, rel.proseVariant, FORCE) };
};

describe('GR3 for ties: the head frozen, a repeat reaches past it (GOALS-1)', () => {
  it('(a) every pool carries its head, and a pool without a reserve has the head as the whole pool', () => {
    for (const [key, archetype] of Object.entries(STRESS_ECONOMIC_EFFECTS)) {
      if (Object.hasOwn(RESERVE, key)) continue; // the reserve arms below
      expect(archetype.tension.head, `${key}: tension head`).toBe(archetype.tension.size);
      expect(archetype.desc.head, `${key}: desc head`).toBe(archetype.desc.size);
      expect(archetype.desc.size, `${key}: one index picks both rows`).toBe(archetype.tension.size);
    }
  });

  it('(a) the first `head` ties of an archetype deal every head index once, in the cycle (KEEP)', () => {
    for (const archetype of Object.values(STRESS_ECONOMIC_EFFECTS)) {
      const { head } = townOf(archetype, []);
      const got = head.map((t) => t.v);
      const size = archetype.tension.head;
      expect([...got].sort((x, y) => x - y)).toEqual(Array.from({ length: size }, (_, i) => i));
      expect(got.map((v) => (v - got[0] + size) % size)).toEqual(got.map((_, k) => k));
    }
  });

  /** An archetype without a reserve whose every index names both cards and declares no trust: the overflow cycle is the whole pool. */
  const PLAIN = Object.entries(STRESS_ECONOMIC_EFFECTS).find(([, a]) => a.tension.head === a.tension.size && namedOf(a).length === a.tension.size
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

  it('(c) the corrected trust clause: a candidate of ANOTHER declared trust is passed over, a no-trust candidate stands in', () => {
    // GOALS-4 builder 11 (re-keyed by cause, the corrected law of 20:30/20:50 UTC under TIES-HOLD): an archetype whose
    // two-name head lines mix a declared trust and none; fresh overflow ties past its head, each computed by the law
    const found = Object.entries(STRESS_ECONOMIC_EFFECTS).find(([, a]) => namedOf(a).length === a.tension.head && a.tension.size === a.tension.head
      && new Set(Array.from({ length: a.tension.head }, (_, i) => trustOf(a, i))).size > 1);
    expect(found, 'an archetype without a reserve mixing trust lines exists').toBeDefined();
    const [key, archetype] = /** @type {[string, any]} */ (found);
    const named = namedOf(archetype), base = baseOf(key);
    // each overflow tie planted on the card whose head tie printed today's index, so today's line shares a card and the
    // least printed line sharing none is read past it, through the trust clause
    const head0 = archetype.tension.head;
    /** @type {Array<[string, string]>} */
    const overflow = Array.from({ length: 2 * head0 }, (_, j) => [`h${(((named[(base + j) % named.length] - base) % head0) + head0) % head0}`, `o${j}-b`]);
    const { head, after } = townOf(archetype, overflow);
    const ties = [...head];
    let standIn = 0, passedOver = 0;
    after.forEach((t, j) => {
      const today = named[(base + j) % named.length];
      const pair = /** @type {[string, string]} */ ([t.from, t.to]);
      expect(t.v, `${key}: overflow tie ${j} takes the least printed line of today's (#${today}) trust clause`).toBe(fallbackOf(archetype, today, base + j, ties, pair));
      expect(trustOk(archetype, t.v, trustOf(archetype, today)), `${key}: #${t.v} may stand in for #${today}`).toBe(true);
      if (trustOf(archetype, today) !== undefined && trustOf(archetype, t.v) === undefined) standIn++;
      const unclaused = /** @type {number} */ (fallbackOf(archetype, today, base + j, ties, pair, false));
      if (unclaused !== t.v && trustOf(archetype, unclaused) !== undefined && trustOf(archetype, unclaused) !== trustOf(archetype, today)) passedOver++;
      ties.push(t);
    });
    expect(standIn, `${key}: a no-trust line stood in for a declared trust`).toBeGreaterThan(0);
    expect(passedOver, `${key}: a line of another declared trust was passed over`).toBeGreaterThan(0);
  });
});

/**
 * The indices fresh-card overflow ties take past the head of a `townOf` town, by TIES-HOLD's rungs (every tie past the
 * head repeats an index; every head index is printed; no fresh card shares one with an earlier tie): the reserve's first
 * index from the cycle's place not yet printed, of today's trust clause (`trustOk`); else the least printed index of the
 * clause, a two-name line first, in the walk's order (`fallbackOf`). Dealt until the reserve is spent. @param {string} key
 * @returns {{ dealt: number[], printed: Map<number, number> }}
 */
const overflowDealt = (key) => {
  const a = archetypeOf(key);
  const head = a.tension.head, reserve = a.tension.size - head, named = namedOf(a), base = baseOf(key);
  const printed = new Map(Array.from({ length: head }, (_, i) => [(base + i) % head, 1]));
  /** @type {number[]} */
  const dealt = [];
  for (let j = 0; dealt.filter((v) => v >= head).length < reserve && j < 4 * a.tension.size; j++) {
    const today = named[(base + j) % named.length];
    const trust = trustOf(a, today);
    const id = Array.from({ length: reserve }, (_, k) => head + ((base + j + k) % reserve)).find((i) => !printed.has(i) && trustOk(a, i, trust))
      ?? /** @type {number} */ (fallbackOf(a, today, base + j, [...printed].flatMap(([v, n]) => Array.from({ length: n }, (_, c) => ({ from: `p${v}-${c}`, to: `q${v}-${c}`, v }))), ['fresh-x', 'fresh-y']));
    dealt.push(id);
    printed.set(id, (printed.get(id) ?? 0) + 1);
  }
  return { dealt, printed };
};

describe('GR3 for ties: the reserve arms, with the chair\'s approved pairs (GOALS-1 builder 5)', () => {
  const X = card('x'), Y = card('y');
  const byId = new Map([[X.id, X], [Y.id, Y]]);

  it('(a) with the real reserve: head is the variants\' count, size the head and its reserve, and the head deals the head-only cycle', () => {
    for (const [key, length] of Object.entries(RESERVE)) {
      const a = archetypeOf(key);
      const head = a.tension.head;
      expect(a.desc.head, `${key}: one head for both rows`).toBe(head);
      expect(a.tension.size, `${key}: size is the head and its reserve`).toBe(head + length);
      expect(a.desc.size, `${key}: one index picks both rows`).toBe(a.tension.size);
      expect(a.desc.lines.length, `${key}: the desc lines hold the reserve`).toBe(a.desc.size);
      const got = townOf(a, []).head.map((t) => t.v);
      expect(got, `${key}: the first head ties deal the head-only cycle`).toEqual(Array.from({ length: head }, (_, k) => (baseOf(key) + k) % head));
    }
  });

  it('(b) a repeat past the head takes the reserve\'s first free index, each at most once, then rung (ii)', () => {
    for (const [key, length] of Object.entries(RESERVE)) {
      const a = archetypeOf(key);
      const head = a.tension.head;
      expect(a.tension.size - head, `${key}: the reserve is there`).toBe(length);
      const { dealt } = overflowDealt(key);
      const { head: heads, after } = townOf(a, dealt.map((_, j) => [`o${j}-a`, `o${j}-b`]));
      expect(after.map((t) => t.v), `${key}: the overflow ties take the reserve by the rungs`).toEqual(dealt);
      const reserved = after.filter((t) => t.v >= head);
      expect(reserved.map((t) => t.v).sort((p, q) => p - q), `${key}: each reserve index once`).toEqual(Array.from({ length }, (_, k) => head + k));
      // the draw's own render of a reserve tie (a reader of `proseVariant`) writes the reserve's own row
      for (const t of reserved) {
        expect([t.d], `${key}: ${t.v}'s description`).toEqual(rendersOf(a.desc.lines[t.v], card(t.from), card(t.to), false));
        expect([t.t], `${key}: ${t.v}'s tension`).toEqual(rendersOf(a.tension.lines[t.v], card(t.from), card(t.to), false));
      }
      // the reserve spent: a repeat planted on the card that printed today's index takes rung (ii)
      const named = namedOf(a);
      const today = named[(baseOf(key) + dealt.length) % named.length];
      const fresh = dealt.map((_, j) => /** @type {[string, string]} */ ([`o${j}-a`, `o${j}-b`]));
      const by = /** @type {{ from: string }} */ (heads.find((t) => t.v === today));
      const town = townOf(a, [...fresh, [by.from, 'fresh-c']]);
      const planted = town.after[fresh.length];
      const all = [...town.head, ...town.after.slice(0, fresh.length)];
      // TIES-HOLD (GOALS-4 builder 11, re-keyed by cause): past the spent pool and reserve, the least printed line of today's
      // trust clause, a two-name line first, then one whose earlier ties share no card with the planted pair, in the walk's order
      const want = fallbackOf(a, today, baseOf(key) + fresh.length, all, [planted.from, planted.to]);
      expect(want, `${key}: the last rung has a candidate`).toBeDefined();
      const wantTies = all.filter((t) => t.v === want);
      expect(wantTies.some((t) => [t.from, t.to].includes(planted.from) || [t.from, t.to].includes(planted.to)), `${key}: the candidate's ties share no card`).toBe(false);
      expect(planted.v, `${key}: past the spent pool and reserve, the least printed line, sharing no card`).toBe(want);
    }
  });

  it('(c) a saved tie inside the head re-renders as the head-only lines write it (KEEP, both directions)', () => {
    let checked = 0;
    for (const key of Object.keys(RESERVE)) {
      const a = archetypeOf(key);
      const head = a.tension.head;
      const [descHead, tensionHead] = [a.desc.lines.slice(0, head), a.tension.lines.slice(0, head)];
      for (let i = 0; i < head; i++) {
        for (const reversed of [false, true]) {
          const got = rerender({ from: X.id, to: Y.id, archetypeKey: key, proseVariant: reversed ? REVERSED_TIE + i : i }, byId);
          expect(rendersOf(descHead[i], X, Y, reversed), `${key}: desc ${i}${reversed ? ' exchanged' : ''}`).toContain(got.description);
          expect(rendersOf(tensionHead[i], X, Y, reversed), `${key}: tension ${i}${reversed ? ' exchanged' : ''}`).toContain(got.tension);
          checked++;
        }
      }
    }
    expect(checked, 'the five archetypes\' heads, both ways').toBe(Object.keys(RESERVE).length * 16);
  });

  it('(d) a reserve index, and its exchanged form, resolves at every reader of proseVariant to the reserve\'s own line', () => {
    for (const [key, length] of Object.entries(RESERVE)) {
      const a = archetypeOf(key);
      const head = a.desc.head;
      for (let k = 0; k < length; k++) {
        const i = head + k;
        expect(i, `${key}: reserve index ${i} lies inside the pool`).toBeLessThan(a.desc.size);
        for (const reversed of [false, true]) {
          const v = reversed ? REVERSED_TIE + i : i;
          const where = `${key}: ${i}${reversed ? ' exchanged' : ''}`;
          // `pairProse`'s closures through the re-render's call (`refreshRelationshipProjections`, mirrored)
          const got = rerender({ from: X.id, to: Y.id, archetypeKey: key, proseVariant: v }, byId);
          for (const [field, lines] of /** @type {Array<['description' | 'tension', any[]]>} */ ([['description', a.desc.lines], ['tension', a.tension.lines]])) {
            expect(typeof got[field] === 'string' && got[field].length > 0, `${where}: a ${field}`).toBe(true);
            expect([got[field]], `${where}: the reserve's own ${field}`).toEqual(rendersOf(lines[i], X, Y, reversed));
            for (let h = 0; h < head; h++) expect(rendersOf(lines[h], X, Y, reversed), `${where}: never head ${field} ${h}`).not.toContain(got[field]); // anchored: got[field] is asserted a non-empty string and equal to the reserve line's own render two lines above
          }
          // `ties.js :: temperOfTie`'s read (module-private): the rows at `tieIndexOf(v) % lines.length` are the reserve's
          expect(tieIndexOf(v), `${where}: the stored index`).toBe(i);
          for (const lines of [a.desc.lines, a.tension.lines]) expect(lines[tieIndexOf(v) % lines.length], `${where}: the temper's row`).toBe(lines[i]);
        }
      }
    }
  });
});

/**
 * CONDITION (b) (GOALS-4 builder 11; the chair's 20:30 ruling, the law as corrected): A REPLACEMENT THAT DECLARES A TRUST
 * STANDS IN ONLY FOR THE SAME TRUST. No real reserve line declares a trust, so the arm is PLANTED: a synthetic archetype of
 * two head lines that declare `trust: 'none'` and one reserve line. Two fresh ties print the head; the third repeats a head
 * index (today's trust 'none') and walks to the reserve. A reserve line of ANOTHER declared trust ('full') is refused, and
 * the tie takes the least printed head line instead; one of the same trust, or of none, stands in.
 * Shown red with the clause (`relationshipArchetypes.js`, TIES-HOLD's `admits`: `whole[id].trust && whole[id].trust !==
 * trust`) removed: the third tie then prints the 'full' reserve line.
 */
describe('condition (b): a reserve line of another declared trust is still refused (GOALS-4 builder 11, planted)', () => {
  /** A planted field as `pairProse` shapes one: callable by index, with `size`, `head` and its frozen `lines`. @param {any[]} rows */
  const fieldOf = (rows) => Object.assign((/** @type {any} */ r, /** @type {any} */ s, /** @type {number} */ variant) => rows[tieIndexOf(variant) % rows.length].line(r, s),
    { size: rows.length, head: 2, lines: Object.freeze(rows) });
  /** @param {'none' | 'full' | undefined} reserveTrust */
  const plantedOf = (reserveTrust) => {
    const rows = (/** @type {string} */ f) => [
      { line: (/** @type {any} */ r, /** @type {any} */ s) => `${r.name} and ${s.name} keep the planted ${f} line one.`, trust: 'none' },
      { line: (/** @type {any} */ r, /** @type {any} */ s) => `${r.name} and ${s.name} keep the planted ${f} line two.`, trust: 'none' },
      { line: (/** @type {any} */ r, /** @type {any} */ s) => `${r.name} and ${s.name} keep the planted ${f} reserve line.`, ...(reserveTrust ? { trust: reserveTrust } : {}) },
    ];
    return { label: `Planted ${reserveTrust ?? 'no'} trust`, desc: fieldOf(rows('desc')), tension: fieldOf(rows('tension')), type: 'rival' };
  };
  /** @param {any} archetype @returns {number[]} the three ties' printed indices */
  const dealThree = (archetype) => {
    const draw = createTieProseDraw(undefined, ADMIT_ALL);
    return [['p0', 'q0'], ['p1', 'q1'], ['p2', 'q2']].map(([a, b]) => draw(archetype, card(a), card(b)).proseVariant);
  };

  it('a reserve line declaring ANOTHER trust is refused: the repeat takes the least printed head line', () => {
    const got = dealThree(plantedOf('full'));
    expect([...got.slice(0, 2)].sort(), 'the two fresh ties print the head').toEqual([0, 1]);
    expect(got[2], 'the third tie never prints the reserve line of another declared trust').not.toBe(2);
    expect([0, 1], 'it takes a head line of today\'s trust').toContain(got[2]);
  });

  it('a reserve line of the same trust, or of none, stands in (the positive controls)', () => {
    expect(dealThree(plantedOf('none'))[2], 'the same declared trust').toBe(2);
    expect(dealThree(plantedOf(undefined))[2], 'no declared trust').toBe(2);
  });
});
