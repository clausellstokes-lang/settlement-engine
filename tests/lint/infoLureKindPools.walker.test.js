/**
 * IN-2 phrased-kind walker: `lure_sprung`, the lure's DM-truth spring, in its OWN walker file
 * (L6: kinds get their own walker, never rows in a foreign one). It certifies the FIVE JOINS
 * (the annex-verbatim pool, the registry row with requiredSlots and slotless fallbacks,
 * WHAT_PHRASES, the routing row, the address chain) plus the frequency-scaled floor. It is
 * presentation evidence only, never behavioral soak evidence.
 *
 * ⚠ THE ANNEX SLICE IS NARROWER THAN A WAVE HEADING, AND THAT IS MEASURED, NOT PREFERRED. The
 * annex's # IN-2 authors the weakness pool and two SUB-POOLS under headings that all open
 * `### lure_sprung `, so the shared reader's line-anchored kind heading matches THREE times in
 * the wave slice and throws (the first-match law working). The weakness block is therefore read
 * between its own heading and the WEALTH sub-pool's, each asserted to occur exactly once. The
 * sub-pools join with their springs (IN-2b); a distinct sub-pool handle is the chair's annex act.
 *
 * ONE literal `describe`, literal straight-line `test` calls, nothing table-driven (the lighting
 * census parks a table-driven file whole).
 *
 * @enforced-by this file
 */
import { readFileSync } from 'node:fs';
import { describe, expect, test } from 'vitest';

import { anchoredOnce, receiptAnnexPool, INFORMATION_ANNEX_URL } from '../helpers/receiptAnnex.js';
import { FREQUENCY_FLOORS, registrationReasons } from '../helpers/kindPoolWalker.js';
import { WHAT_PHRASES } from '../../src/domain/display/settlementRumors.js';
import { EXACT_SECTION, SECTION_OF } from '../../src/domain/realm/heraldRouting.js';
import { INFORMATION_KIND_REGISTRY, informationReceipt } from '../../src/domain/worldPulse/informationNews.js';
import { lureSprungEntries } from '../../src/domain/worldPulse/infoLure.js';

const KIND = 'lure_sprung';
const ANNEX_SOURCE = readFileSync(INFORMATION_ANNEX_URL, 'utf8');
const OPEN = '### lure_sprung (IN-2;';
const CLOSE = '### lure_sprung — WEALTH';
/** Every slot the weakness block declares. */
const ALL_SLOTS = Object.freeze(['settlement', 'counterpart', 'house', 'faction', 'route', 'season']);
const FULL = Object.freeze({ settlement: 'Harrowmere', counterpart: 'Velden', house: 'the Whisper Exchange', faction: 'Maddoc', route: 'Salt', season: 'high summer' });
/** What the producer can supply at this base: no route, no season (declared unreachable). */
const SUPPLIABLE = Object.freeze({ settlement: 'Harrowmere', counterpart: 'Velden', house: 'the Whisper Exchange', faction: 'Maddoc' });
const SENTINEL = Object.freeze(Object.fromEntries(ALL_SLOTS.map((slot) => [slot, `<<${slot}>>`])));

const annex = (interp) => receiptAnnexPool(KIND, { source: ANNEX_SOURCE, section: OPEN, until: CLOSE, interp, annex: 'information' });
const rowOf = () => INFORMATION_KIND_REGISTRY.find((row) => row.kind === KIND);

/** @param {Record<string, string>} interp */
function reachable(interp) {
  const seen = new Set();
  for (let draw = 0; draw < 400; draw += 1) {
    const receipt = informationReceipt(KIND, `in-2:${draw}`, interp);
    if (receipt) seen.add(receipt.templateIndex);
  }
  return [...seen].sort((a, b) => a - b);
}

describe('SP-6 phrased-kind registry — IN-2 the lure_sprung spring', () => {
  test('the registry row and the five typed joins are exact', () => {
    const row = rowOf();
    expect(row).toMatchObject({ kind: KIND, significance: 'notable', audience: 'dm-only', section: 'war' });
    expect(Object.isFrozen(row)).toBe(true);
    expect(row.pool).toHaveLength(6);
    expect(row.requiredSlots).toHaveLength(6);
    expect(row.pool.length).toBeGreaterThanOrEqual(FREQUENCY_FLOORS[row.significance]);
    expect(row.requiredSlots.filter((slots) => slots.length === 0)).toHaveLength(2);
    expect(registrationReasons(row, { phrases: WHAT_PHRASES, sectionOf: SECTION_OF })).toEqual([]);
    expect(EXACT_SECTION[KIND]).toBe('war');
    expect(SECTION_OF(KIND)).toBe(SECTION_OF('plant_took'));
    expect(typeof WHAT_PHRASES[KIND]).toBe('string');
  });

  test('the pool is the annex weakness block, verbatim and in order, and the annex decides the arity', () => {
    const row = rowOf();
    const rendered = row.pool.map((variant) => (typeof variant === 'function' ? String(variant(FULL)) : String(variant)));
    expect(rendered).toEqual(annex(FULL).lines);
    expect(annex(FULL).from).toBe('information');
    const fromAnnex = annex(SENTINEL).lines.map((line) => ALL_SLOTS.filter((slot) => line.includes(SENTINEL[slot])));
    expect(fromAnnex.map((slots) => [...slots].sort())).toEqual(row.requiredSlots.map((slots) => [...slots].sort()));
    expect(fromAnnex.filter((slots) => slots.length > 0)).toHaveLength(4);
    for (const line of rendered) {
      expect(line.length).toBeGreaterThan(0);
      // anchored: `rendered` is pinned equal to the six annex lines above and each is non-empty.
      expect(line).not.toMatch(/\d|%|×|_|\$\{|\bundefined\b|\bNaN\b|!/);
      // NO-FATES (the annex's Law One boundary): a bait names no fate a named soul could meet.
      // anchored: the same six rendered lines, each non-empty above.
      expect(line).not.toMatch(/\b(?:hanged|killed|executed|exiled|shuttered|murdered|slain)\b/i);
    }
  });

  test('THE FIRST-MATCH LAW: both slice anchors occur exactly once, and the kind heading three times in the volume', () => {
    expect(() => anchoredOnce(ANNEX_SOURCE, /^### lure_sprung \(IN-2;(?=[ \n])/gm, 'open')).not.toThrow();
    expect(() => anchoredOnce(ANNEX_SOURCE, /^### lure_sprung — WEALTH(?=[ \n])/gm, 'close')).not.toThrow();
    expect([...ANNEX_SOURCE.matchAll(/^### lure_sprung(?= )/gm)]).toHaveLength(3);
  });

  test('the eligible set is exactly four without a route or a season and exactly six with both', () => {
    expect(reachable(SUPPLIABLE)).toEqual([0, 2, 3, 4]);
    expect(reachable(FULL)).toEqual([0, 1, 2, 3, 4, 5]);
    const row = rowOf();
    expect(row.requiredSlots
      .map((slots, index) => (slots.includes('route') || slots.includes('season') ? index : -1))
      .filter((index) => index >= 0)).toEqual([1, 5]);
  });

  test('the address chain: the one producer addresses all three courts, covert, in the registered voice', () => {
    // Last week's resolved march by m on v, stamped a strength misjudgment on the planted band.
    const worldState = {
      pulseHistory: [{
        tick: 4,
        selectedOutcomes: [{
          candidateType: 'strategy_deploy',
          metadata: {
            settlementId: 'm', strategyMove: 'deploy', deployTargetId: 'v',
            misjudgment: { observerId: 'm', subjectId: 'v', believedStrengthBand: 1, trueStrengthBand: 3, kinds: ['strength'] },
          },
        }],
      }],
    };
    const disinfo = {
      'plant:h:m:v': { liarId: 'h', subjectId: 'v', audienceId: 'm', assertedBand: 1, trueBand: 3, seededTick: 3, lineageId: 'disinfo:h:m:3' },
    };
    const [entry, ...rest] = lureSprungEntries({ worldState, disinfo, tick: 5, nameFor: (id) => `${id}-town` });
    expect(rest).toEqual([]);
    expect(entry).toMatchObject({
      id: 'wizard_news.5.lure_sprung.h.m.v', kind: KIND, impactKind: KIND, settlementIds: ['h', 'm', 'v'],
      audience: 'dm-only', covert: true, section: 'war', significance: 'notable', tick: 5,
    });
    expect(entry.familyId).toMatch(/^lure_sprung\.[1-6]$/);
    expect(entry.reasons).toHaveLength(2);
    // The summary IS the registered line for the producer's own seed and fills (no market name
    // on this plant, so the house-bearing variant is ineligible rather than rendered with a hole).
    const voiced = informationReceipt(KIND, 'plant:h:m:v:5', { settlement: 'h-town', counterpart: 'v-town', faction: 'm-town', house: '' });
    expect(entry.summary).toBe(voiced.line);
    expect(entry.familyId).toBe(voiced.familyId);
  });
});
