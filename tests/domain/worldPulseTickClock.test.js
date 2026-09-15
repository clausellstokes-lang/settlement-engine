/**
 * tests/domain/worldPulseTickClock.test.js — Regional wave R1 pins (C3 + H9).
 *
 * Pins:
 *   • C3 — a pulse SYNCS wizardNews.currentTick to worldState.tick (it does
 *     not blindly +1), so a manual impact-advance press can never permanently
 *     skew which tick pulse entries group and ground under.
 *   • C3 — chronicle grounding defaults its window to the latest tick that
 *     HAS entries, not the (possibly skewed-ahead) feed clock.
 *   • H9 — the pulse ages the PREVIOUS tick's regional queue before queueing
 *     this tick's propagation: a pulse-created delayTicks:1 impact stays
 *     delayed through its creating pulse and matures on the NEXT pulse, with
 *     no contradictory queued+ready pair for one impact in one tick.
 */

import { describe, expect, test } from 'vitest';

import {
  advanceCampaignWorld,
  applyWorldPulseOutcomes,
  buildChronicleGrounding,
} from '../../src/domain/worldPulse/index.js';
import { addRegionalChannels, ensureRegionalGraph, normalizeGoodsList } from '../../src/domain/region/index.js';

const NOW = '2026-06-01T00:00:00.000Z';

function bareWorldState() {
  return { stressors: [], npcStates: {}, proposals: [] };
}

describe('C3 — one authoritative tick clock', () => {
  test('a pulse syncs wizardNews.currentTick to the world tick, healing manual skew', () => {
    const result = applyWorldPulseOutcomes({
      snapshot: { regionalGraph: ensureRegionalGraph(), settlements: [], campaign: {} },
      worldState: bareWorldState(),
      regionalGraph: ensureRegionalGraph(),
      // Manual +1/+3 presses ran the feed clock ahead of the world.
      wizardNews: { currentTick: 7, entries: [] },
      settlementMap: new Map(),
      outcomes: [],
      tick: 3,
      now: NOW,
    });
    expect(result.wizardNews.currentTick).toBe(3);
  });

  test('advanceNewsTick:false leaves the feed clock untouched (party/proposal injections)', () => {
    const result = applyWorldPulseOutcomes({
      snapshot: { regionalGraph: ensureRegionalGraph(), settlements: [], campaign: {} },
      worldState: bareWorldState(),
      regionalGraph: ensureRegionalGraph(),
      wizardNews: { currentTick: 7, entries: [] },
      settlementMap: new Map(),
      outcomes: [],
      tick: 3,
      now: NOW,
      advanceNewsTick: false,
      advanceRegionalImpacts: false,
    });
    expect(result.wizardNews.currentTick).toBe(7);
  });

  test('manual skew then full pulse: clocks agree and the pulse entries group under the pulse tick', () => {
    const ids = ['a', 'b', 'c'];
    const saves = ids.map((id, i) => ({
      id,
      name: `Town-${id.toUpperCase()}`,
      phase: 'canon',
      settlement: {
        name: `Town-${id.toUpperCase()}`,
        tier: 'town',
        population: 1400 + i * 300,
        config: { tradeRouteAccess: 'road' },
        institutions: [],
        economicState: { primaryExports: [], primaryImports: [] },
        powerStructure: { factions: [], conflicts: [] },
        npcs: [],
        activeConditions: [],
      },
      campaignState: { phase: 'canon', eventLog: [], locks: {} },
    }));
    const campaign = {
      id: 'camp-clock',
      name: 'Clock Realm',
      settlementIds: ids,
      regionalGraph: ensureRegionalGraph(),
      // Four manual presses while the world never pulsed.
      wizardNews: { currentTick: 4, entries: [] },
      worldState: {
        rngSeed: 'clock-seed',
        tick: 0,
        canonizedAt: NOW,
        // A realm-wide stressor guarantees the pulse emits news entries.
        stressors: [{ id: 'world_stressor.famine.realm', type: 'famine', severity: 0.7, affectedSettlementIds: ids }],
      },
    };

    const result = advanceCampaignWorld({ campaign, saves, interval: 'one_month', now: NOW });

    expect(result.worldState.tick).toBe(1);
    expect(result.wizardNews.currentTick).toBe(1);
    expect(result.wizardNews.entries.length).toBeGreaterThan(0);
    // The feed started empty, so every entry came from this pulse — all of
    // them must group under the live tick, not a stale or skewed one.
    expect(result.wizardNews.entries.every(entry => entry.tick === 1)).toBe(true);
  });
});

describe('C3 — chronicle grounding window', () => {
  test('defaults to the latest entry tick over a mixed manual+pulse feed (latest pulse headline included)', () => {
    const wizardNews = {
      currentTick: 9, // manual presses ran ahead of the last pulse
      entries: [
        { id: 'n1', tick: 4, headline: 'The Great Hunger grips the realm', significance: 'major', scope: 'realm', settlementIds: ['a', 'b', 'c'] },
        { id: 'n2', tick: 4, headline: 'Trade slows in Millcross', significance: 'notable', scope: 'regional', settlementIds: ['a'] },
        { id: 'n3', tick: 2, headline: 'Old news', significance: 'notable', scope: 'settlement', settlementIds: ['b'] },
      ],
    };
    const g = buildChronicleGrounding({ wizardNews, worldState: { tick: 9 } });
    expect(g.tick).toBe(4);
    expect(g.headlines).toHaveLength(2);
    expect(g.majorHeadlines).toContain('The Great Hunger grips the realm');
  });

  test('an empty feed falls back to the world tick with zero headlines', () => {
    const g = buildChronicleGrounding({ wizardNews: { currentTick: 5, entries: [] }, worldState: { tick: 5 } });
    expect(g.tick).toBe(5);
    expect(g.headlines).toEqual([]);
  });
});

describe('H9 — pulses age the queue before queueing newborns', () => {
  function fixture() {
    const supplier = {
      name: 'Granary Ford',
      tier: 'town',
      population: 2000,
      config: { tradeRouteAccess: 'road' },
      institutions: [],
      economicState: { primaryExports: ['Bulk grain and foodstuffs'], primaryImports: [] },
      powerStructure: { factions: [], conflicts: [] },
      npcs: [],
      activeConditions: [],
    };
    const buyer = { ...supplier, name: 'Millcross', economicState: { primaryExports: [], primaryImports: ['Grain and malt'] } };
    const goods = normalizeGoodsList(['Bulk grain and foodstuffs']);
    const graph = addRegionalChannels(null, [
      { type: 'trade_dependency', from: 'supplier', to: 'buyer', goods, status: 'confirmed', strength: 0.6, confidence: 0.8 },
    ]);
    const settlements = [
      { id: 'supplier', name: supplier.name, settlement: supplier },
      { id: 'buyer', name: buyer.name, settlement: buyer },
    ];
    const settlementMap = new Map(settlements.map(item => [item.id, { saveId: item.id, save: { name: item.name }, settlement: item.settlement }]));
    return { graph, settlements, settlementMap };
  }

  test('a pulse-queued delayed impact survives its creating pulse and matures on the NEXT pulse', () => {
    const { graph, settlements, settlementMap } = fixture();
    const outcome = {
      id: 'o_pop_loss',
      type: 'population',
      candidateType: 'population_decline',
      applyMode: 'auto',
      targetSaveId: 'supplier',
      severity: 0.4,
      headline: 'A hard season empties Granary Ford',
      populationDeltas: [{ saveId: 'supplier', delta: -120 }],
    };

    const first = applyWorldPulseOutcomes({
      snapshot: { regionalGraph: graph, settlements, campaign: {} },
      worldState: bareWorldState(),
      regionalGraph: graph,
      wizardNews: { currentTick: 4, entries: [] },
      settlementMap,
      outcomes: [outcome],
      tick: 5,
      now: NOW,
    });

    const newborn = first.regionalGraph.queuedImpacts.find(impact =>
      impact.kind === 'import_shortage' && impact.targetSettlementId === 'buyer');
    expect(newborn).toBeTruthy();
    // delayTicks:1 means "next tick": this pulse must not age its own newborn.
    expect(newborn.status).toBe('queued');
    expect(newborn.delayTicks).toBeGreaterThan(0);
    // No contradictory queued+ready pair for one impact in one tick's feed.
    const kinds = first.newsEntries.filter(e => e.impactIds.includes(newborn.id)).map(e => e.kind);
    expect(kinds).toContain('queued');
    expect(kinds).not.toContain('ready');

    const updatedMap = new Map(first.settlementUpdates.map(item => [item.saveId, item]));
    const second = applyWorldPulseOutcomes({
      snapshot: { regionalGraph: first.regionalGraph, settlements, campaign: {} },
      worldState: first.worldState,
      regionalGraph: first.regionalGraph,
      wizardNews: first.wizardNews,
      settlementMap: updatedMap,
      outcomes: [],
      tick: 6,
      now: NOW,
    });

    const matured = second.regionalGraph.queuedImpacts.find(impact => impact.id === newborn.id);
    expect(matured.status).toBe('queued');
    expect(matured.delayTicks).toBe(0);
    expect(second.newsEntries.some(e => e.kind === 'ready' && e.impactIds.includes(newborn.id))).toBe(true);
  });
});

/**
 * LT40 car 7 — THE SECOND CLOCK, PINNED AS THE CONSTANT IT IS.
 *
 * This estate runs TWO clocks over one world and they are different facts by
 * construction:
 *   • THE CAMPAIGN CLOCK MOVES. `calendarFromWeeks` (worldState.js) re-derives
 *     `year` from canonical elapsed weeks on every tick, so an advance always
 *     changes it.
 *   • `history.age` DOES NOT. It is drawn ONCE by `resolveSettlementAge` at
 *     generation and written at `historyGenerator.js`'s `founding.age = age`,
 *     which a repo-wide scan measures as the ONLY `.age =` assignment in `src/`.
 *     Nothing on the advance path rewrites it.
 *
 * ⛔ THE FREEZE IS DELIBERATE AND RECORDED, NOT A BUG THIS ARM FORGOT TO FIX.
 * The diary measured it on 2026-09-14 (kit/RESUME-NOTE 06:3x: over 30 `one_year`
 * advances `calendar.year` went 2 to 31 while `history.age` stayed 215) and ruled
 * it REPORTED NOT FIXED, because advancing the age moves rendered text on every
 * advance. The disposition, both cure options and their prices are
 * docs/ENGINE_DEFECT_DISPOSITIONS.md §5.
 *
 * ⇒ IF THIS ARM REDS, something has begun aging a settlement on the advance path.
 * That is an output-moving change under §764.3 and it is owner-gated. Read §5
 * before altering this arm: the arm is the record, and deleting it deletes the
 * only place the freeze is asserted rather than assumed.
 */
describe('LT40 car 7 — the second clock: history.age is a generation-time constant', () => {
  test('the campaign year advances every tick while history.age never moves, over a run of real advances', () => {
    const FROZEN_AGE = 215;
    const madeSettlement = {
      name: 'Ashford',
      tier: 'town',
      population: 1800,
      config: { tradeRouteAccess: 'road' },
      institutions: [],
      economicState: { primaryExports: [], primaryImports: [] },
      powerStructure: { factions: [], conflicts: [] },
      npcs: [],
      activeConditions: [],
      // The generation-time draw, exactly as generateHistory stamps it.
      history: { age: FROZEN_AGE, founding: { age: FROZEN_AGE } },
    };
    let campaign = {
      id: 'camp-age',
      name: 'Age Realm',
      settlementIds: ['a'],
      regionalGraph: ensureRegionalGraph(),
      wizardNews: { currentTick: 0, entries: [] },
      worldState: { rngSeed: 'age-pin', tick: 0, canonizedAt: NOW, ...bareWorldState() },
    };
    let saves = [{
      id: 'a',
      name: 'Ashford',
      phase: 'canon',
      settlement: madeSettlement,
      campaignState: { phase: 'canon', eventLog: [], locks: {} },
    }];

    /** @type {number[]} */ const years = [];
    /** @type {Array<number|undefined>} */ const ages = [];
    let updatesSeen = 0;
    for (let i = 0; i < 12; i += 1) {
      const result = advanceCampaignWorld({ campaign, saves, interval: 'one_year', now: NOW });
      campaign = {
        ...campaign,
        worldState: result.worldState,
        regionalGraph: result.regionalGraph,
        wizardNews: result.wizardNews,
      };
      const update = (result.settlementUpdates || []).find(item => String(item.saveId) === 'a');
      if (update) {
        updatesSeen += 1;
        saves = [{ ...saves[0], settlement: update.settlement }];
      }
      years.push(result.worldState?.calendar?.year);
      ages.push(saves[0].settlement?.history?.age);
    }

    // ⛔ ANTI-VACUITY FIRST: the settlement record must actually be REWRITTEN on every
    // tick, or "the age did not change" would be true merely because nothing happened.
    // MEASURED while writing this arm: none of the twelve ticks returns the same object,
    // and population, powerStructure, populationHistory and activeConditions all move
    // across the run. Population is asserted as the live anchor because it is written by
    // populationDynamics.js on the very record `history` rides on: that is the writer the
    // negative control planted an age bump into, and the arm caught it (215 became 216
    // through 227). Movement is asserted, never the figure, so a tuning change cannot
    // red this pin.
    expect(updatesSeen, 'every tick re-emitted the settlement record').toBe(12);
    expect(saves[0].settlement?.population, 'the record really is live: population moved').toBeGreaterThan(1800);
    // The moving clock moves, and strictly: twelve advances, twelve distinct years.
    expect(years, 'the campaign year increments once per one_year advance').toEqual([2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]);
    // The frozen clock does not move, through all twelve of those record rewrites.
    expect([...new Set(ages)], 'history.age is invariant across the whole run').toEqual([FROZEN_AGE]);
    // And the founding record carries the same untouched draw it was stamped with.
    expect(saves[0].settlement?.history?.founding?.age, 'founding.age is the same generation-time draw').toBe(FROZEN_AGE);
  });
});
