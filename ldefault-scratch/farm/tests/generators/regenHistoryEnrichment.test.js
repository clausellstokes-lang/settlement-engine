/**
 * regenHistoryEnrichment.test.js — what "Reroll history" must stop destroying.
 *
 * regenHistoryPipeline returned generateHistory's raw output, which meant a
 * history reroll:
 *   • dropped `siegeNarrative` and `legacyAnnotations` outright (both are minted
 *     on the full-assembly path only),
 *   • replaced a paragraph of `historicalCharacter` prose with the generator's
 *     crude stub ("stable and prosperous"),
 *   • deleted the campaign-era events worldPulse had committed to
 *     `historicalEvents` — the table's own record of what happened, which those
 *     writers explicitly never prune, and
 *   • reverted authored settlement-root `history.*` prose while LEAVING its
 *     `_userEdits` record, so the dossier showed "Edited" over generated text.
 *
 * Every settlement here comes from generateSettlementPipeline (real pipeline
 * data, no fixtures) and the campaign events come from the real worldPulse
 * writer, because fixtures were what hid this shape gap in the first place.
 */

import { describe, test, expect } from 'vitest';
import {
  generateSettlementPipeline,
  regenHistoryPipeline,
} from '../../src/generators/generateSettlementPipeline.js';
import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';
import { withCampaignHistoryEvent } from '../../src/domain/worldPulse/stressorAftermath.js';
import { applyUserEdit } from '../../src/domain/userEdits.js';
import {
  carryCampaignEvents,
  countCampaignEvents,
  restoreAuthoredHistory,
} from '../../src/domain/historyPreservation.js';

const gen = (config, seed) =>
  generateSettlementPipeline(config, null, { seed, customContent: {} });

const CITY = { settType: 'city', culture: 'germanic', terrainOverride: 'coastal', tradeRouteAccess: 'river' };
const TOWN = { settType: 'town', culture: 'celtic', terrainOverride: 'hills', tradeRouteAccess: 'road' };

// The closed set of stubs generateHistory's in-generator heuristic can produce.
// A rerolled history landing on ANY of them means the coherence tail did not run.
const GENERATOR_STUBS = [
  'newly founded and still becoming itself',
  'stable and prosperous',
  'marked by repeated calamities',
  'politically turbulent',
  'economically dynamic',
  'defined by a single great catastrophe',
];

/** An echo shaped the way stressorAftermath's real writer expects. */
const echo = (id, label) => ({
  id,
  label,
  type: 'siege',
  peakSeverity: 0.7,
  residualEffects: ['ruined_walls'],
  resolvedAt: 9,
});

describe('the history reroll runs the same coherence tail assembly runs', () => {
  test('a rerolled history carries siegeNarrative, legacyAnnotations and real character prose', () => {
    const s = gen(CITY, 'rh-city');
    const { history: regen } = regenHistoryPipeline(s, s.config || CITY, { seed: 'rh-city-r' });

    // siegeNarrative is always PRESENT on the assembly path (null when recent
    // history supports no sentence); pre-fix the key was absent entirely.
    expect(regen).toHaveProperty('siegeNarrative');
    expect(
      regen.siegeNarrative === null || typeof regen.siegeNarrative === 'string',
    ).toBe(true);

    // historicalCharacter is prose, not the generator's stub. The length assertion runs
    // FIRST because GENERATOR_STUBS is a frozen literal declared in this file: the only
    // way the exclusion below can go vacuous is the MEMBER being absent (undefined or
    // empty), and a paragraph of real prose is what proves the coherence tail ran.
    expect(regen.historicalCharacter.length).toBeGreaterThan(40);
    // anchored: the length assertion above proves the member is live prose (GENERATOR_STUBS is a local literal)
    expect(GENERATOR_STUBS).not.toContain(regen.historicalCharacter);

    // legacyAnnotations is gated on non-empty in BOTH paths, so when the key is
    // there it carries entries — and this settlement's history earns some.
    expect(regen.legacyAnnotations?.length).toBeGreaterThan(0);
  });

  test('the rerolled field set matches a generated one', () => {
    const s = gen(TOWN, 'rh-town');
    const { history: regen } = regenHistoryPipeline(s, s.config || TOWN, { seed: 'rh-town-r' });

    // legacyAnnotations and ancientRuin are conditional in both paths (a
    // different roll can earn one and not the other), so compare the rest.
    const CONDITIONAL = new Set(['legacyAnnotations', 'ancientRuin']);
    const stable = (history) => Object.keys(history).filter(k => !CONDITIONAL.has(k)).sort();
    expect(stable(regen)).toEqual(stable(s.history));
  });

  test('every tier gets the tail, not just the big ones', () => {
    for (const settType of ['thorp', 'village', 'town', 'city', 'metropolis']) {
      const config = { settType, culture: 'germanic', terrainOverride: 'plains', tradeRouteAccess: 'road' };
      const s = gen(config, `rh-${settType}`);
      const { history: regen } = regenHistoryPipeline(s, s.config || config, { seed: `rh-${settType}-r` });
      expect(regen, settType).toHaveProperty('siegeNarrative');
      expect(regen.historicalCharacter.length, settType).toBeGreaterThan(40);
      // anchored: the length assertion above proves the member is live prose (GENERATOR_STUBS is a local literal)
      expect(GENERATOR_STUBS, settType).not.toContain(regen.historicalCharacter);
    }
  });
});

describe('the reroll carries the campaign record it used to delete', () => {
  test('campaignEra events survive a history reroll, by campaignEventId', () => {
    const base = gen(CITY, 'rh-campaign');
    const advanced = withCampaignHistoryEvent(base, echo('siege-1', 'The Long Siege'), 9);
    expect(countCampaignEvents(advanced.history)).toBe(1);

    const { history: regen } = regenHistoryPipeline(advanced, advanced.config || CITY, { seed: 'rh-campaign-r' });

    const carried = regen.historicalEvents.filter(e => e.campaignEra === true);
    expect(carried).toHaveLength(1);
    expect(carried[0].campaignEventId).toBe('campaign.siege-1.9');
    expect(carried[0].name).toBe('The Long Siege');

    // The carry is purely ADDITIVE: the generated half is exactly what this
    // seed rolls for a settlement carrying no campaign history at all, so
    // preservation cannot have perturbed the seeded roll. (Event count is
    // itself a seeded draw, so it need not match the pre-reroll history.)
    const { history: control } = regenHistoryPipeline(base, base.config || CITY, { seed: 'rh-campaign-r' });
    expect(regen.historicalEvents.filter(e => e.campaignEra !== true))
      .toEqual(control.historicalEvents);
    expect(control.historicalEvents.length).toBeGreaterThan(0);
    // worldPulse appends at the end; a rerolled history keeps that shape.
    expect(regen.historicalEvents[regen.historicalEvents.length - 1].campaignEra).toBe(true);
    // eventsTimeline deliberately does NOT carry them (worldPulse never adds
    // them there either, so post-reroll matches post-advance).
    expect(regen.eventsTimeline.some(e => e.campaignEra)).toBe(false);
  });

  test('two campaign events both survive, and re-rerolling does not duplicate them', () => {
    const base = gen(TOWN, 'rh-campaign2');
    let advanced = withCampaignHistoryEvent(base, echo('siege-1', 'The Long Siege'), 3);
    advanced = withCampaignHistoryEvent(advanced, echo('famine-2', 'The Hungry Year'), 7);
    expect(countCampaignEvents(advanced.history)).toBe(2);

    const { history: once } = regenHistoryPipeline(advanced, advanced.config || TOWN, { seed: 'rh-c2-a' });
    expect(once.historicalEvents.filter(e => e.campaignEra === true)).toHaveLength(2);

    // Reroll the ALREADY-merged history: the dedup key is the writers' own.
    const { history: twice } = regenHistoryPipeline(
      { ...advanced, history: once },
      advanced.config || TOWN,
      { seed: 'rh-c2-b' },
    );
    const ids = twice.historicalEvents
      .filter(e => e.campaignEra === true)
      .map(e => e.campaignEventId);
    expect(ids).toHaveLength(2);
    expect(new Set(ids).size).toBe(2);
  });

  test('carryCampaignEvents is dormant — a never-advanced history keeps its exact array', () => {
    const s = gen(TOWN, 'rh-dormant');
    const fresh = s.history.historicalEvents;
    // Same reference, not merely equal: the dormancy contract the reroll relies
    // on to stay identical to what it produced before this tail existed.
    expect(carryCampaignEvents(s.history, fresh)).toBe(fresh);
    expect(carryCampaignEvents(null, fresh)).toBe(fresh);
    expect(carryCampaignEvents({}, fresh)).toBe(fresh);
  });
});

describe('authored settlement-root history prose survives the reroll', () => {
  test('an edited historicalCharacter and founding.reason come back authored', () => {
    const s = gen(CITY, 'rh-authored');
    applyUserEdit(s, 'history.historicalCharacter', 'The chandlers have always run this place.');
    applyUserEdit(s, 'history.founding.reason', 'A ford, and a grudge that outlived the man who started it.');

    const { history: regen } = regenHistoryPipeline(s, s.config || CITY, { seed: 'rh-authored-r' });

    expect(regen.historicalCharacter).toBe('The chandlers have always run this place.');
    expect(regen.founding.reason).toBe('A ford, and a grudge that outlived the man who started it.');
    // Everything NOT authored is still a real reroll.
    expect(regen).toHaveProperty('siegeNarrative');
  });

  test('restoreAuthoredHistory is dormant for a settlement with no history edits', () => {
    const s = gen(TOWN, 'rh-noedits');
    expect(restoreAuthoredHistory(s, s.history)).toBe(s.history);
    expect(restoreAuthoredHistory(null, s.history)).toBe(s.history);
    // A non-history edit must not trigger the clone either.
    const other = gen(TOWN, 'rh-noedits2');
    applyUserEdit(other, 'arrivalScene', 'Rain on the river gate.');
    expect(restoreAuthoredHistory(other, other.history)).toBe(other.history);
  });
});

/**
 * [generators-pipeline-5] — the reroll minted a seed and threw it away, so a
 * persisted history reroll could never be reproduced: the settlement still carried
 * its original `_seed`, which by then reproduced a DIFFERENT history. The NPC twin
 * had returned `_regenSeed` since it was seeded; this closes the gap for history.
 */
describe('the reroll records the seed it minted', () => {
  test('the seed rides at the settlement-parts level, never inside the history', () => {
    const s = gen(CITY, 'rh-seed-record');
    const { history, _regenSeed } = regenHistoryPipeline(s, s.config || CITY);

    expect(typeof _regenSeed).toBe('string');
    expect(_regenSeed.length).toBeGreaterThan(0);
    // The seed must NOT be a key of the section the store persists. `history.
    // _regenSeed` would read as a field OF the history and would ride straight
    // through the DM-share gallery strip, which is a TOP-LEVEL key list.
    // `historicalEvents` anchors the check: it comes off the same return.
    expectAbsentWithAnchor(Object.keys(history), '_regenSeed', 'historicalEvents', 'history parts');
  });

  test('an explicit seed is echoed back rather than re-minted', () => {
    const s = gen(TOWN, 'rh-seed-echo');
    const { _regenSeed } = regenHistoryPipeline(s, s.config || TOWN, { seed: 'rh-echo' });
    expect(_regenSeed).toBe('rh-echo');
  });

  test('replaying the recorded seed reproduces the rerolled history byte for byte', () => {
    const s = gen(CITY, 'rh-seed-replay');
    // A REAL reroll: no seed passed, so the pipeline mints one the way the store does.
    const first = regenHistoryPipeline(s, s.config || CITY);
    const replay = regenHistoryPipeline(s, s.config || CITY, { seed: first._regenSeed });
    expect(JSON.stringify(replay.history)).toBe(JSON.stringify(first.history));

    // Non-vacuous: a DIFFERENT seed does not reproduce it, so the equality above
    // measures the recorded seed rather than a history that ignores its seed.
    const other = regenHistoryPipeline(s, s.config || CITY, { seed: `${first._regenSeed}-elsewhere` });
    expect(JSON.stringify(other.history)).not.toBe(JSON.stringify(first.history));
  });
});
