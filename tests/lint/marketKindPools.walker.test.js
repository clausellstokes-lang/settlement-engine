/**
 * marketKindPools.walker.test.js — TR-3's phrased-kind census: the exact ONE-kind MARKET
 * registry (the T-1 tellable, the wrong-market arrival), re-derived from the content annex on
 * every run. L6's own walker file for this family, never rows in a foreign walker.
 *
 * THE ANNEX-READ POLICY: TRADE-VOLUME-ONLY, as TR-1's walker ruled it. The pool resolves
 * `from === 'trade'`, asserted POSITIVELY, so a future merge that forwarded it reds here instead
 * of the pin going quietly stale.
 *
 * THE FIVE JOINS (L6) are checked here: the annex pool verbatim (marketReceiptPools.js), the
 * registry row with requiredSlots and a slotless fallback (marketNews.js), the WHAT_PHRASES
 * phrase, the section authority (an EXACT_SECTION row at the trade desk), and — in
 * tests/domain/believedMarketsTr3.test.js, over evidence the orchestrator really returned — the
 * address chain.
 *
 * ⭐ THE REGISTRATION SHAPE IS A CENSUS FACT: one literal `describe` per concern and straight-line
 * literal `test` calls, no table-driven registration, so the estate's lighting census credits
 * every title here.
 *
 * @enforced-by this file
 */
import { readFileSync } from 'node:fs';
import { describe, expect, test } from 'vitest';

import { TRADE_ANNEX_URL, anchoredOnce, receiptAnnexPool } from '../helpers/receiptAnnex.js';
import { FREQUENCY_FLOORS, registrationReasons } from '../helpers/kindPoolWalker.js';
import { WHAT_PHRASES } from '../../src/domain/display/settlementRumors.js';
import { EXACT_SECTION, SECTION_OF, isExplicitlyRouted } from '../../src/domain/realm/heraldRouting.js';
import { MARKET_RECEIPTS, MARKET_RECEIPT_SLOTS } from '../../src/domain/worldPulse/marketReceiptPools.js';
import {
  MARKET_KINDS, MARKET_KIND_REGISTRY, MARKET_NEWS_TUNING, WRONG_MARKET_ARRIVAL_KIND, marketLine,
} from '../../src/domain/worldPulse/marketNews.js';

const ANNEX_SOURCE = readFileSync(TRADE_ANNEX_URL, 'utf8');
const SECTION = '# TR-3';
const UNTIL = '# TR-4';

/** The annex-id ↔ engine-token join, one authored decision rather than a naming convention. */
const KIND_OF = Object.freeze({ 'market.wrong_market_arrival': 'market_wrong_market_arrival' });

/** Fixed slot values covering the pool's whole slot vocabulary. */
const INTERP = Object.freeze({
  settlement: 'Iron Vale', counterpart: 'Brook End', house: 'House Rowan', good: 'iron', band: 'surplus',
});

/** The annex's editorial exemplar markers, the same strip the TR-1 extraction applied. */
const stripEditorial = (line) => line.replace(/\s*\*\([^)]*\)\*\s*$/, '');

/** The slots a raw annex row interpolates, codepoint-sorted. */
const slotsOf = (row) => [...new Set([...row.matchAll(/\{(\w+)\}/g)].map((m) => m[1]))].sort();

/** The annex block for one kind, through the ONE reader. */
function annexPool(annexId) {
  return receiptAnnexPool(annexId, {
    source: ANNEX_SOURCE, section: SECTION, until: UNTIL, interp: INTERP, strip: stripEditorial, annex: 'trade',
  });
}

/** The annex's raw (uninterpolated) rows for one kind, for the slot witness. */
function annexRawRows(annexId) {
  const open = anchoredOnce(ANNEX_SOURCE, new RegExp(`^### ${annexId.replace('.', '\\.')} `, 'gm'), annexId);
  const rest = ANNEX_SOURCE.slice(ANNEX_SOURCE.indexOf('\n', open.index) + 1);
  const next = rest.search(/^#{1,3} /m);
  const block = next >= 0 ? rest.slice(0, next) : rest;
  return [...block.matchAll(/^\d+\. (.+)$/gm)].map((m) => stripEditorial(m[1]));
}

/** Every template index the picker can REACH under one interpolation. */
function reachable(interp, draws = 400) {
  const seen = new Set();
  for (let draw = 0; draw < draws; draw += 1) {
    const picked = marketLine(WRONG_MARKET_ARRIVAL_KIND, `tr3:${draw}`, interp);
    if (picked) seen.add(picked.templateIndex);
  }
  return [...seen].sort((a, b) => a - b);
}

describe('TR-3 kind pools — the one-kind census and the corpus', () => {
  test('the annex, the registry and the reader are all live, and the census is exactly one kind', () => {
    expect(ANNEX_SOURCE.length).toBeGreaterThan(20000);
    expect(MARKET_KIND_REGISTRY).toHaveLength(1);
    expect(MARKET_KINDS).toEqual([WRONG_MARKET_ARRIVAL_KIND]);
    expect(new Set(Object.values(KIND_OF))).toEqual(new Set(MARKET_KINDS));
    expect(Object.isFrozen(MARKET_KIND_REGISTRY[0])).toBe(true);
    // The reader THROWS on a bad address rather than returning an empty pool, so the greens below cannot be emptiness.
    expect(() => annexPool('market.not_a_kind')).toThrow(/heading/);
  });

  test('the pool is the annex block verbatim and in order, never forwarded, and the registry reads the corpus module itself', () => {
    const row = MARKET_KIND_REGISTRY[0];
    const authored = annexPool('market.wrong_market_arrival');
    expect(authored.from).toBe('trade');
    expect(authored.requiredSlots).toBeNull();
    const rendered = row.pool.map((variant) => (typeof variant === 'function' ? String(variant(INTERP)) : String(variant)));
    expect(rendered).toEqual(authored.lines);
    expect(new Set(rendered).size).toBe(row.pool.length);
    expect(row.pool).toBe(MARKET_RECEIPTS[WRONG_MARKET_ARRIVAL_KIND]);
    // The volume exemplar is variant one, verbatim.
    expect(rendered[0]).toBe('The caravans came for the famine and found the harvest.');
  });

  test('the requiredSlots table is the annex\'s own slot witness, row for row', () => {
    const measured = annexRawRows('market.wrong_market_arrival').map(slotsOf);
    expect(MARKET_RECEIPT_SLOTS[WRONG_MARKET_ARRIVAL_KIND].map((slots) => [...slots])).toEqual(measured);
    expect(MARKET_KIND_REGISTRY[0].requiredSlots.map((slots) => [...slots])).toEqual(measured);
    // The witness can DISAGREE: five of the seven rows name a slot.
    expect(measured.filter((slots) => slots.length > 0)).toHaveLength(5);
  });

  test('significance and audience are the ANNEX\'s declarations, and the pool meets its frequency-scaled floor', () => {
    const heading = anchoredOnce(ANNEX_SOURCE, /^### market\.wrong_market_arrival .*$/gm, 'the T-1 heading')[0];
    const rest = ANNEX_SOURCE.slice(ANNEX_SOURCE.indexOf(heading));
    const row = MARKET_KIND_REGISTRY[0];
    expect(row.significance).toBe(/significance: (\w+)/.exec(heading)[1]);
    expect(row.audience).toBe(/^AUDIENCE: (\S+)$/m.exec(rest)[1]);
    expect(row.pool.length).toBeGreaterThanOrEqual(FREQUENCY_FLOORS[row.significance]);
    // The feed weight is the trade desk's notable class, a fraction the feed turns into its own score.
    expect(MARKET_NEWS_TUNING.notableSeverity).toBeGreaterThan(0);
    expect(MARKET_NEWS_TUNING.notableSeverity).toBeLessThan(1);
  });
});

describe('TR-3 kind pools — the picker, the fallback and the Herald joins', () => {
  test('the picker reaches exactly the variants whose slots are supplied, in both directions', () => {
    // No house rides a caravan at this wave, so the three house variants are unreachable from the evidence.
    expect(reachable({ settlement: INTERP.settlement, counterpart: INTERP.counterpart, good: INTERP.good })).toEqual([0, 1, 4, 5]);
    expect(reachable(INTERP)).toEqual([0, 1, 2, 3, 4, 5, 6]);
    // THE SLOTLESS FALLBACK: with nothing supplied the beat still speaks, through the two authored slotless lines.
    expect(reachable({})).toEqual([0, 1]);
    // A value the reader fence refuses (a digit, an engine token) is not a supplied slot.
    expect(reachable({ settlement: 'Iron Vale 2', counterpart: 'brook_end' })).toEqual([0, 1]);
    // anchored: the registered kind answers a full line from the same call two lines below, so null here is the unknown kind.
    expect(marketLine('market_not_a_kind', 'seed', INTERP)).toBeNull();
    const picked = marketLine(WRONG_MARKET_ARRIVAL_KIND, 'seed', INTERP);
    expect(picked).toMatchObject({ kind: WRONG_MARKET_ARRIVAL_KIND, significance: 'notable', audience: 'public', section: 'trade' });
    expect(picked.familyId).toBe(`${WRONG_MARKET_ARRIVAL_KIND}.${picked.templateIndex + 1}`);
  });

  test('the five typed joins hold as one value: phrased, routed EXPLICITLY to the trade desk, and at its floor', () => {
    const row = MARKET_KIND_REGISTRY[0];
    expect(registrationReasons(row, { sectionOf: SECTION_OF, phrases: WHAT_PHRASES })).toEqual([]);
    expect(EXACT_SECTION[WRONG_MARKET_ARRIVAL_KIND]).toBe('trade');
    expect(SECTION_OF(WRONG_MARKET_ARRIVAL_KIND)).toBe('trade');
    expect(isExplicitlyRouted(WRONG_MARKET_ARRIVAL_KIND)).toBe(true);
    const phrase = WHAT_PHRASES[WRONG_MARKET_ARRIVAL_KIND];
    expect(typeof phrase).toBe('string');
    expect(phrase).toBe(phrase.toLowerCase());
    // anchored: the phrase was asserted present and lower case on the two lines above, so its freedom from the token is a fact about a live phrase.
    expect(phrase).not.toMatch(/_|\d|[.!?]$/);
    // anchored: the phrase is live and lower case (asserted above), so its difference from the de-underscored token is a fact about an authored phrase.
    expect(phrase).not.toBe(WRONG_MARKET_ARRIVAL_KIND.replace(/_/g, ' '));
  });
});
