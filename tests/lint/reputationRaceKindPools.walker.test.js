/**
 * IN-4 phrased-kind walker: the reputation race's three kinds and its jewel (`race_person`,
 * `race_story`, `race_together`, `word_came_too_late`), in their OWN walker file (L6: kinds get
 * their own walker, never rows in a foreign one). It certifies the FIVE JOINS (the annex-verbatim
 * pool, the registry row with requiredSlots and slotless fallbacks, WHAT_PHRASES, the routing row,
 * the address chain) plus the frequency-scaled floor, and the family's context axis, which IN-4
 * occupied: every sentence speaking of a man is honest for a PERSON racer only. It is
 * presentation evidence only, never behavioral soak evidence.
 *
 * The wave slice is `## IN-4` to `## IN-5`, each heading asserted to occur exactly once, and each
 * kind heading exactly once inside it (the first-match law, executed).
 *
 * Literal `describe` and literal straight-line `test` calls; loops live INSIDE tests, never
 * around them (the lighting census parks a table-driven file whole).
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
import { RACE_OUTCOMES } from '../../src/domain/worldPulse/routeNetworkConsumersRace.js';
import { emptyRouteNetwork, routeEdge, withRouteEdges, writeRouteNetwork } from '../../src/domain/worldPulse/routeNetworkLedger.js';
import { armyRecordOf } from '../../src/domain/spatial/armyTransit.js';
import { setSpatialLedger } from '../../src/domain/spatial/distanceRead.js';
import { RACER_CONTEXTS, TOO_LATE_KIND, reputationRaceEntries } from '../../src/domain/worldPulse/reputationRaceConsumer.js';

const KINDS = Object.freeze(['race_person', 'race_story', 'race_together', TOO_LATE_KIND]);
const ANNEX_SOURCE = readFileSync(INFORMATION_ANNEX_URL, 'utf8');
/** Every slot the IN-4 blocks declare. */
const ALL_SLOTS = Object.freeze(['settlement', 'counterpart', 'npc', 'route', 'band', 'season', 'reason']);
const FULL = Object.freeze({
  settlement: 'Dunmoor', counterpart: 'Ashfen', npc: 'Brand Oller', route: 'Salt', band: 'a loud word', season: 'high summer', reason: 'a false count',
});
/** What the producer supplies at this base: the two seats and the racer's name, nothing else. */
const SUPPLIABLE = Object.freeze({ settlement: 'Dunmoor', counterpart: 'Ashfen', npc: 'Brand Oller' });
const SENTINEL = Object.freeze(Object.fromEntries(ALL_SLOTS.map((slot) => [slot, `<<${slot}>>`])));
/** The depth, significance and slotless count the annex authors for each kind. */
const EXPECTED = Object.freeze({
  race_person: ['notable', 6, 2],
  race_story: ['notable', 6, 3],
  race_together: ['routine', 9, 5],
  word_came_too_late: ['notable', 6, 2],
});

const annex = (kind, interp) => receiptAnnexPool(kind, {
  source: ANNEX_SOURCE, section: '## IN-4', until: '## IN-5', interp, annex: 'information',
});
const rowOf = (kind) => INFORMATION_KIND_REGISTRY.find((row) => row.kind === kind);

/** Every template index a caller can REACH under one interpolation and one racer context. */
function reachable(kind, interp, context) {
  const seen = new Set();
  for (let draw = 0; draw < 400; draw += 1) {
    const receipt = informationReceipt(kind, `in-4:${draw}`, interp, context);
    if (receipt) seen.add(receipt.templateIndex);
  }
  return [...seen].sort((a, b) => a - b);
}

describe('SP-6 phrased-kind registry — IN-4 the reputation race', () => {
  test('the four registry rows and their five typed joins are exact', () => {
    for (const kind of KINDS) {
      const [significance, depth, slotless] = EXPECTED[kind];
      const row = rowOf(kind);
      expect(row, kind).toMatchObject({ kind, significance, audience: 'public', section: 'events' });
      expect(Object.isFrozen(row) && Object.isFrozen(row.requiredSlots) && Object.isFrozen(row.contexts), kind).toBe(true);
      expect(row.pool, kind).toHaveLength(depth);
      expect(row.requiredSlots, kind).toHaveLength(depth);
      expect(row.contexts, kind).toHaveLength(depth);
      expect(row.pool.length, kind).toBeGreaterThanOrEqual(FREQUENCY_FLOORS[significance]);
      expect(row.requiredSlots.filter((slots) => slots.length === 0), kind).toHaveLength(slotless);
      expect(registrationReasons(row, { phrases: WHAT_PHRASES, sectionOf: SECTION_OF }), kind).toEqual([]);
      expect(EXACT_SECTION[kind], kind).toBe('events');
      expect(SECTION_OF(kind), kind).toBe(SECTION_OF('envoy_home'));
      expect(typeof WHAT_PHRASES[kind], kind).toBe('string');
    }
  });

  test('every pool is its annex block, verbatim and in order, and the annex decides the arity', () => {
    for (const kind of KINDS) {
      const row = rowOf(kind);
      const rendered = row.pool.map((variant) => (typeof variant === 'function' ? String(variant(FULL)) : String(variant)));
      expect(rendered, kind).toEqual(annex(kind, FULL).lines);
      expect(annex(kind, FULL).from, kind).toBe('information');
      const fromAnnex = annex(kind, SENTINEL).lines.map((line) => ALL_SLOTS.filter((slot) => line.includes(SENTINEL[slot])));
      expect(fromAnnex.map((slots) => [...slots].sort()), kind).toEqual(row.requiredSlots.map((slots) => [...slots].sort()));
      for (const line of rendered) {
        expect(line.length, kind).toBeGreaterThan(0);
        // anchored: `rendered` is pinned equal to the annex lines above, each one non-empty.
        expect(line, kind).not.toMatch(/\d|%|×|_|\$\{|\bundefined\b|\bNaN\b|!|—/);
      }
    }
  });

  test('THE FIRST-MATCH LAW: the wave slice and every kind heading occur exactly once', () => {
    expect(() => anchoredOnce(ANNEX_SOURCE, /^## IN-4(?=[ \n])/gm, 'open')).not.toThrow();
    expect(() => anchoredOnce(ANNEX_SOURCE, /^## IN-5(?=[ \n])/gm, 'close')).not.toThrow();
    for (const kind of KINDS) {
      expect([...ANNEX_SOURCE.matchAll(new RegExp(`^### ${kind}(?= )`, 'gm'))], kind).toHaveLength(1);
    }
  });

  test('the race kinds are the built RACE_OUTCOMES tokens verbatim, and neither has no kind by law', () => {
    const race = INFORMATION_KIND_REGISTRY.map((row) => row.kind).filter((kind) => kind.startsWith('race_'));
    expect(race).toEqual(RACE_OUTCOMES.filter((token) => token !== 'neither').map((token) => `race_${token}`));
    expect(rowOf('race_neither')).toBeUndefined();
    expect(EXACT_SECTION.race_neither).toBeUndefined();
  });

  test('the racer context axis: a column draws only the sentences honest of a column', () => {
    expect(RACER_CONTEXTS).toEqual(['column', 'person']);
    expect(reachable('race_person', SUPPLIABLE, 'column'), 'no annex sentence voices a column ahead of its story').toEqual([]);
    expect(reachable('race_story', SUPPLIABLE, 'column')).toEqual([4]);
    expect(reachable('race_together', SUPPLIABLE, 'column')).toEqual([2, 4, 5, 6]);
    expect(reachable('race_person', SUPPLIABLE, 'person')).toEqual([0, 1, 2, 3, 5]);
    expect(reachable('race_story', SUPPLIABLE, 'person')).toEqual([0, 1, 2, 3, 4]);
    expect(reachable('race_together', SUPPLIABLE, 'person')).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8]);
  });

  test('the eligible sets: a route, a season, a band and a typed reason have no supplier, and each supplied opens its variant', () => {
    expect(reachable(TOO_LATE_KIND, SUPPLIABLE, 'person')).toEqual([0, 1, 2, 4, 5]);
    expect(reachable(TOO_LATE_KIND, FULL, 'person')).toEqual([0, 1, 2, 3, 4, 5]);
    expect(reachable('race_person', FULL, 'person')).toEqual([0, 1, 2, 3, 4, 5]);
    expect(reachable('race_story', FULL, 'person')).toEqual([0, 1, 2, 3, 4, 5]);
    expect(reachable('race_person', { ...SUPPLIABLE, npc: '' }, 'person'), 'a nameless person keeps his slotless sentences').toEqual([0, 2, 3, 5]);
  });

  test('the address chain: the one producer addresses both seats, public, in the registered voice', () => {
    const seats = ['dunmoor', 'farholt'];
    const worldState = setSpatialLedger(writeRouteNetwork({
      tick: 26,
      spatialCanonVersion: 1,
      spatialDigest: {
        settlementIds: seats,
        gates: [{ between: seats, cost: 2400 }],
        distanceMatrix: { dunmoor: { farholt: 2400 }, farholt: { dunmoor: 2400 } },
        tiers: { dunmoor: { farholt: 2 }, farholt: { dunmoor: 2 } },
      },
      simulationRules: { reputationRaceEnabled: true, routeLifecycleEnabled: true },
    }, withRouteEdges(emptyRouteNetwork(), [
      routeEdge({ a: 'dunmoor', b: 'farholt', grade: 'road', mode: 'land', provenance: 'generated', flavor: 'genesis', tick: 0 }),
    ])), 'armyTransit', {
      farholt: armyRecordOf({ armyId: 'farholt', role: 'march', originId: 'farholt', destId: 'dunmoor', path: seats.slice().reverse(), departTick: 10, arrivalTick: 25, lastTick: 25 }),
    });
    const names = { dunmoor: 'Dunmoor', farholt: 'Farholt' };
    const [entry, ...rest] = reputationRaceEntries({ worldState, tick: 26, nameFor: (id) => names[id] });
    expect(rest).toEqual([]);
    expect(entry).toMatchObject({
      id: 'wizard_news.26.race_story.army.farholt_10', kind: 'race_story', impactKind: 'race_story',
      settlementIds: ['dunmoor', 'farholt'], settlementNames: ['Dunmoor', 'Farholt'],
      audience: 'public', section: 'events', significance: 'notable', tick: 26,
    });
    expect(entry.reasons).toEqual(['The word out of Farholt reached Dunmoor before the column did.']);
    const voiced = informationReceipt('race_story', 'army:farholt.10:26', { settlement: 'Dunmoor', counterpart: 'Farholt', npc: '' }, 'column');
    expect(entry.summary).toBe(voiced.line);
    expect(entry.familyId).toBe(voiced.familyId);
  });
});
