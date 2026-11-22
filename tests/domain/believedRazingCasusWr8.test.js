/**
 * believedRazingCasusWr8.test.js — WR-8 amendment R2 / CR-WR8-C: THE BELIEVED
 * RAZING, END TO END.
 *
 * `scoreAtrocityAnswer` shipped with W-PEACE-1 and had NO PRODUCER: it took "the
 * razings the observer believes occurred" and nothing in the pulse ever assembled
 * that list. atrocityCasusWr8.test.js pins the scorer and says so in its own last
 * paragraph. THIS file is the proof the producer landed — and that it landed as an
 * ARC rather than as a function nobody calls.
 *
 * WHAT IT PROVES, and why each one can fail silently without it:
 *
 *   1. THE ARC. A real razing emission → the real news curator → the real feed
 *      normalizer → the read model → the real war-reason mover → an
 *      `atrocity_answer` row in the persisted ledger, naming the burned town. A
 *      pin over the read model alone would stay green through a wiring that never
 *      reached `advanceWarReasons`, and a pin over the mover alone would stay
 *      green through an id the emission never mints.
 *   2. ATTRIBUTION BY PROOF, NOT BY PARSING. The reconstruction is driven with
 *      settlement ids that CONTAIN DOTS — the exact input that would defeat a
 *      reader that split the id on `.` — and with a wrong accused, which must
 *      recover nothing. Mis-attributing an atrocity is not a cosmetic bug: under
 *      R2's license machinery it is a warrant to burn a city.
 *   3. THE JUST RAZING RAISES NOTHING. A vengeance answer mints no fresh casus
 *      against the avenger. Without this the moral ledger is self-feeding — every
 *      answer manufacturing the next grievance, forever.
 *   4. BELIEF ARRIVES AT NEWS SPEED. The SAME world, one tick before the word
 *      could have reached the observer, yields nothing. Both sides of the
 *      boundary are driven, and the delay is asserted non-zero first so the
 *      pre-arrival pin cannot go vacuous on a zero-distance fixture.
 *   5. ⚠️⚠️ THE RECORDED LIMIT, PINNED AS BEHAVIOUR. The feed caps at 240 entries
 *      while ATROCITY_DECAY_TICKS is 260, so a LESSER razing can scroll out
 *      before its outrage has decayed — and the casus dies with it. `capEntries`
 *      rescues one head per MAJOR arc, so a severity >= 0.72 burning survives the
 *      same flood. THE WORLD FORGETS THE SMALLER FIRES. That is character, not a
 *      defect: a realm remembers the atrocity that horrified it and loses the one
 *      that merely appalled it. It is driven here through the REAL cap so the
 *      limit is measured rather than described.
 *
 * @enforced-by this file
 */
import { describe, expect, test } from 'vitest';

import {
  makeBelievedRazings,
  razingNewsRows,
  roadForAccused,
  RAZING_NEWS_IMPACT_KIND,
} from '../../src/domain/worldPulse/believedRazings.js';
import { RAZING_ROADS, razingOutcomeIdFor } from '../../src/domain/worldPulse/razing.js';
import { razingSiegeEmission } from '../../src/domain/worldPulse/razingExecution.js';
import { newsEntryForOutcome } from '../../src/domain/worldPulse/worldPulseFeedCuration.js';
import { ensureWizardNewsFeed, WIZARD_NEWS_SIGNIFICANCE } from '../../src/domain/region/wizardNews.js';
import { advanceWarReasons, reasonPairKey, REASON_TUNING } from '../../src/domain/worldPulse/warReasons.js';
import { getSpatialLedger } from '../../src/domain/spatial/distanceRead.js';
import { hopDelayTicks } from '../../src/domain/worldPulse/distancePricedNews.js';
import { CONQUEST_REQUIRED_RULES } from '../../src/domain/worldPulse/conquestDoctrineStage.js';

const NOW = '2026-08-04T00:00:00.000Z';
const BURN_TICK = 40;

/** Every WR-8 prerequisite, plus the peace-causal gate the war-reason mover needs. */
const LIT_RULES = Object.freeze({
  ...Object.fromEntries(CONQUEST_REQUIRED_RULES.map((key) => [key, true])),
  peaceEngineEnabled: true,
});

/** A court whose derived nature comes from the two levers the alignment kernel
 *  weighs hardest — the authored conscience of who runs it and the patron deity.
 *  (The razingWitness fixture's shape; a deity alone never clears `malicious`.) */
function court(id, { patron, trait, population = 6000, name }) {
  return [id, {
    id,
    settlement: {
      name,
      tier: 'town',
      population,
      npcs: [{ name: `${id} Elder`, importance: 'pillar', personality: { dominant: trait } }],
      config: {
        primaryDeitySnapshot: {
          name: patron === 'evil' ? 'The Iron Maw' : patron === 'good' ? 'The Open Hand' : 'The Grey Scale',
          alignmentAxis: patron,
        },
      },
    },
  }];
}

const NATURE = Object.freeze({
  good: { patron: 'good', trait: 'incorruptible' },
  evil: { patron: 'evil', trait: 'cruel' },
});

/**
 * ⚠️ THE IDS CARRY DOTS ON PURPOSE. `save.karrow` is exactly the shape a reader
 * that split the outcome id on `.` would shred, and the whole attribution
 * discipline is that this file's reader never does. Every pin below runs on
 * dotted ids, so the immunity is a property of every case rather than of one.
 */
const KARROW = 'save.karrow';
const THORNWALL = 'save.thornwall';
const MERETH = 'save.mereth';

/**
 * A hand-authored frozen canon: activeSpatialDigest needs a positive-integer
 * spatialCanonVersion plus a distanceMatrix, and pathCost then reads the matrix
 * directly (no sea lanes / teleport / season ⇒ its O(1) fast path).
 *
 * ⚠️ THE ASYMMETRY IS THE FIXTURE'S WHOLE POINT. Thornwall↔Mereth is TWENTY
 * TIMES the ordinary hop, because the delay curve is calibrated against the
 * MEDIAN primary hop — a matrix of uniform costs, however large, calibrates to
 * one week and prices every road at zero. A uniform fixture would have left both
 * news-speed pins silently vacuous.
 */
const NEAR_COST = 10;
const FAR_COST = 200;
function spatialDigestFor(ids) {
  const distanceMatrix = {};
  for (const from of ids) {
    distanceMatrix[from] = {};
    for (const to of ids) {
      if (to === from) continue;
      const far = (from === THORNWALL && to === MERETH) || (from === MERETH && to === THORNWALL);
      distanceMatrix[from][to] = far ? FAR_COST : NEAR_COST;
    }
  }
  return { settlementIds: [...ids], distanceMatrix };
}

/** The world Karrow is about to burn Thornwall in, with Mereth watching. */
function arcWorld({ distancePriced = true } = {}) {
  const worldState = {
    simulationRules: {
      ...LIT_RULES,
      ...(distancePriced ? { distancePricedNewsEnabled: true } : {}),
    },
    tick: BURN_TICK,
    spatialCanonVersion: 1,
    spatialDigest: spatialDigestFor([KARROW, THORNWALL, MERETH]),
    relationshipStates: {
      [`rel.${KARROW}.${THORNWALL}`]: { relationshipType: 'hostile', resentment: 0.9, trust: 0.05, fear: 0.4 },
      [`rel.${KARROW}.${MERETH}`]: { relationshipType: 'neutral', trust: 0.4, resentment: 0.1, fear: 0.15 },
      [`rel.${MERETH}.${THORNWALL}`]: { relationshipType: 'allied', trust: 0.9, resentment: 0.02, fear: 0.05 },
    },
    spatialLedgers: {
      warReasons: {
        [reasonPairKey(KARROW, THORNWALL)]: {
          reasons: { grievance: { type: 'grievance', score: 0.9, tick: BURN_TICK, receipt: 'blood is owed' } },
        },
      },
    },
  };
  const byId = new Map([
    court(KARROW, { ...NATURE.evil, population: 45000, name: 'Karrow' }),
    court(THORNWALL, { ...NATURE.good, population: 1200, name: 'Thornwall' }),
    court(MERETH, { ...NATURE.good, name: 'Mereth' }),
  ]);
  const regionalGraph = {
    edges: [
      { id: `rel.${KARROW}.${THORNWALL}`, from: KARROW, to: THORNWALL, relationshipType: 'hostile', type: 'hostile' },
      { id: `rel.${KARROW}.${MERETH}`, from: KARROW, to: MERETH, relationshipType: 'neutral', type: 'neutral' },
      { id: `rel.${MERETH}.${THORNWALL}`, from: MERETH, to: THORNWALL, relationshipType: 'allied', type: 'allied' },
    ],
  };
  return {
    worldState,
    snapshot: { settlements: [...byId.values()], byId, worldState, regionalGraph },
    regionalGraph,
  };
}

/** Drive the mouth's one call, exactly as warDeployment does. */
function burnThornwall() {
  const { worldState, snapshot, regionalGraph } = arcWorld();
  const razed = razingSiegeEmission({
    worldState,
    snapshot,
    razerId: KARROW,
    victimId: THORNWALL,
    razerName: 'Karrow',
    victimName: 'Thornwall',
    tick: BURN_TICK,
    population: 1200,
    namedCastCount: 3,
    institutions: [{ id: 'shrine', name: 'Shrine of the Open Hand' }],
    movableWealth: 40,
    now: NOW,
  });
  return { razed, worldState, snapshot, regionalGraph };
}

/** `count` unrelated NEWER feed entries, each on its own arc so no rescue applies. */
const flood = (count) => Array.from({ length: count }, (_, i) => ({
  id: `wizard_news.${BURN_TICK + 1 + i}.filler.${i}`,
  tick: BURN_TICK + 1 + i,
  scope: 'settlement',
  significance: 'notable',
  score: 1,
  headline: `a quiet week ${i}`,
  summary: '',
  kind: 'applied',
  impactKind: 'drift',
  severity: 0.1,
  settlementIds: [`filler.${i}`],
  sourceEventId: `filler_event.${i}`,
  tags: ['world_pulse'],
  reasons: [],
}));

/** The `atrocity_answer` row `observer` holds against `accused` after one pass. */
function atrocityRowFor({ worldState, snapshot, regionalGraph, wizardNews, tick, observer, accused }) {
  const advanced = advanceWarReasons({
    snapshot, worldState, graph: regionalGraph, tick, wizardNews,
  });
  const ledger = getSpatialLedger(advanced.worldState, 'warReasons') || {};
  return ledger[reasonPairKey(observer, accused)]?.reasons?.atrocity_answer || null;
}

// ─────────────────────────────────────────────────────────────────────────────

describe('the id is spelled once, and attribution is by proof', () => {
  test('the emission mints the road INTO the id, through the law leaf', () => {
    const { razed } = burnThornwall();
    expect(razed).not.toBeNull();
    expect(RAZING_ROADS).toContain(razed.plan.road);
    expect(razed.outcome.id).toBe(razingOutcomeIdFor({
      road: razed.plan.road, razerId: KARROW, victimId: THORNWALL, tick: BURN_TICK,
    }));
    // The dotted ids are really in there — the premise of the whole attribution
    // discipline, asserted rather than assumed.
    expect(razed.outcome.id).toContain('.');
    expect(KARROW).toContain('.');
  });

  test('an unspellable road yields NO id — a razing nobody could be tried for is never named', () => {
    expect(razingOutcomeIdFor({ road: 'conquest', razerId: KARROW, victimId: THORNWALL, tick: 1 })).toBe('');
    expect(razingOutcomeIdFor({ road: '', razerId: KARROW, victimId: THORNWALL, tick: 1 })).toBe('');
    expect(razingOutcomeIdFor({ road: 'initiation', razerId: '', victimId: THORNWALL, tick: 1 })).toBe('');
    expect(razingOutcomeIdFor({ road: 'initiation', razerId: KARROW, victimId: '', tick: 1 })).toBe('');
  });

  test('reconstruction recovers the razer through dotted ids, and refuses the wrong court', () => {
    const row = {
      sourceEventId: razingOutcomeIdFor({
        road: 'initiation', razerId: KARROW, victimId: THORNWALL, tick: BURN_TICK,
      }),
      victimId: THORNWALL,
      tick: BURN_TICK,
    };
    expect(roadForAccused(row, KARROW)).toBe('initiation');
    // The wrong accused, an EMPTY accused, and a court whose id is a PREFIX of the
    // real razer's all recover nothing: equality, never containment.
    expect(roadForAccused(row, MERETH)).toBeNull();
    expect(roadForAccused(row, '')).toBeNull();
    expect(roadForAccused(row, 'save')).toBeNull();
    expect(roadForAccused(row, 'save.karro')).toBeNull();
  });
});

describe('THE ARC — a razing becomes an atrocity casus in a court that heard about it', () => {
  test('emission → curator → feed normalizer → read model → the war-reason ledger', () => {
    const { razed, worldState, snapshot, regionalGraph } = burnThornwall();

    // (1) THE CURATOR. The real one, not a hand-built row.
    const entry = newsEntryForOutcome(razed.outcome, BURN_TICK);
    expect(entry.impactKind).toBe(RAZING_NEWS_IMPACT_KIND);
    expect(entry.sourceEventId).toBe(razed.outcome.id);
    expect(entry.settlementIds).toEqual([THORNWALL]);

    // (2) THE FEED'S OWN NORMALIZER. The read model's whole attribution chain hangs
    // off `sourceEventId` surviving normalization — pinned, because a normalizer
    // that dropped it would break the casus while every other feed pin stayed green.
    const feed = ensureWizardNewsFeed({ currentTick: BURN_TICK, entries: [entry] }, { now: NOW });
    expect(feed.entries).toHaveLength(1);
    expect(feed.entries[0].sourceEventId).toBe(razed.outcome.id);
    expect(razingNewsRows(feed)).toEqual([
      { sourceEventId: razed.outcome.id, victimId: THORNWALL, tick: BURN_TICK },
    ]);

    // (3) THE NEWS SPEED. Non-zero first, so the pre-arrival pin below is not vacuous.
    const delay = hopDelayTicks(worldState.spatialDigest, THORNWALL, MERETH);
    expect(delay).toBeGreaterThan(0);

    // (4) THE READ MODEL, at the arrival tick.
    const arrival = BURN_TICK + delay;
    const believed = makeBelievedRazings({
      worldState, snapshot, wizardNews: feed, tick: arrival,
    }).believedFor(MERETH, KARROW);
    expect(believed).toHaveLength(1);
    // THE NEWS ADDRESS LAW reaches the receipt: the burned town is NAMED, not keyed.
    expect(believed[0]).toEqual({ razerId: KARROW, victimName: 'Thornwall', tick: BURN_TICK });

    // (5) THE MOVER. The casus lands in the persisted ledger, on the directed pair
    // (observer → accused), with a receipt a DM can read.
    const row = atrocityRowFor({
      worldState, snapshot, regionalGraph, wizardNews: feed, tick: arrival,
      observer: MERETH, accused: KARROW,
    });
    expect(row).not.toBeNull();
    expect(row.type).toBe('atrocity_answer');
    expect(row.score).toBeGreaterThan(0);
    expect(row.receipt).toContain('Thornwall');
    // The receipt NAMES the town rather than keying it — the id must not leak.
    expect(row.receipt).not.toContain(THORNWALL);
    expect(row.receipt).toContain('Someone must stop them');
  });

  test('the accusation runs ONE WAY — the razer holds no atrocity casus against its witness', () => {
    const { razed, worldState, snapshot, regionalGraph } = burnThornwall();
    const feed = ensureWizardNewsFeed({
      currentTick: BURN_TICK, entries: [newsEntryForOutcome(razed.outcome, BURN_TICK)],
    }, { now: NOW });
    const arrival = BURN_TICK + hopDelayTicks(worldState.spatialDigest, THORNWALL, MERETH);
    // Karrow burned the town; nothing it heard about ITSELF may accuse Mereth.
    expect(atrocityRowFor({
      worldState, snapshot, regionalGraph, wizardNews: feed, tick: arrival,
      observer: KARROW, accused: MERETH,
    })).toBeNull();
  });

  test('THE VICTIM holds no atrocity casus of its own — one burning is not scored twice', () => {
    const { razed, worldState, snapshot, regionalGraph } = burnThornwall();
    const feed = ensureWizardNewsFeed({
      currentTick: BURN_TICK, entries: [newsEntryForOutcome(razed.outcome, BURN_TICK)],
    }, { now: NOW });
    // ANTI-VACUITY FIRST: Thornwall→Karrow IS a directed pair in this world (they
    // share the hostile edge), and Thornwall is at distance ZERO from its own
    // burning — so it would believe instantly if the rule did not exclude it.
    expect(hopDelayTicks(worldState.spatialDigest, THORNWALL, THORNWALL)).toBe(0);
    const advanced = advanceWarReasons({
      snapshot, worldState, graph: regionalGraph, tick: BURN_TICK, wizardNews: feed,
    });
    const ledger = getSpatialLedger(advanced.worldState, 'warReasons') || {};
    expect(Object.keys(ledger)).toContain(reasonPairKey(THORNWALL, KARROW));
    // J-WZ4-3, applied a second time: the razed town's own cause against its
    // razer rides the grievance / revanchism clocks. `atrocity_answer` measures
    // the THIRD-PARTY outrage, and scoring both would count one fire twice.
    expect(ledger[reasonPairKey(THORNWALL, KARROW)]?.reasons?.atrocity_answer).toBeUndefined();
  });
});

describe('the two refusals — the just razing, and the word that has not arrived', () => {
  test('a VENGEANCE razing mints no casus against the avenger', () => {
    const { worldState, snapshot, regionalGraph } = arcWorld();
    // The SAME burning, on the other road. Only the road differs, so a green here
    // with a red on `initiation` isolates exactly the polarity under test.
    const vengeanceId = razingOutcomeIdFor({
      road: 'vengeance', razerId: KARROW, victimId: THORNWALL, tick: BURN_TICK,
    });
    const initiationId = razingOutcomeIdFor({
      road: 'initiation', razerId: KARROW, victimId: THORNWALL, tick: BURN_TICK,
    });
    expect(vengeanceId).not.toBe(initiationId);

    const feedFor = (id) => ensureWizardNewsFeed({
      currentTick: BURN_TICK,
      entries: [newsEntryForOutcome({
        id, candidateType: 'razing', type: 'condition', severity: 0.8,
        headline: 'a town burns', summary: '', affectedSettlementIds: [THORNWALL],
      }, BURN_TICK)],
    }, { now: NOW });
    const arrival = BURN_TICK + hopDelayTicks(worldState.spatialDigest, THORNWALL, MERETH);
    const rowFor = (id) => atrocityRowFor({
      worldState, snapshot, regionalGraph, wizardNews: feedFor(id), tick: arrival,
      observer: MERETH, accused: KARROW,
    });

    expect(rowFor(vengeanceId)).toBeNull();
    // ANTI-VACUITY: the identical world on the initiation road DOES raise it, so
    // the refusal above is the road and not a broken fixture.
    expect(rowFor(initiationId)?.score).toBeGreaterThan(0);
  });

  test('the observer believes nothing until the word could have reached it', () => {
    const { razed, worldState, snapshot, regionalGraph } = burnThornwall();
    const feed = ensureWizardNewsFeed({
      currentTick: BURN_TICK, entries: [newsEntryForOutcome(razed.outcome, BURN_TICK)],
    }, { now: NOW });
    const delay = hopDelayTicks(worldState.spatialDigest, THORNWALL, MERETH);
    expect(delay).toBeGreaterThan(0);

    const rowAt = (tick) => atrocityRowFor({
      worldState, snapshot, regionalGraph, wizardNews: feed, tick,
      observer: MERETH, accused: KARROW,
    });
    // ONE TICK SHORT — the fire is lit, the world knows, this court does not.
    expect(rowAt(BURN_TICK + delay - 1)).toBeNull();
    // AND THE TICK IT LANDS.
    expect(rowAt(BURN_TICK + delay)?.score).toBeGreaterThan(0);
  });

  test('an ungated world hears instantly — the estate has ONE distance curve, gated where it always was', () => {
    const dark = arcWorld({ distancePriced: false });
    const { razed } = burnThornwall();
    const feed = ensureWizardNewsFeed({
      currentTick: BURN_TICK, entries: [newsEntryForOutcome(razed.outcome, BURN_TICK)],
    }, { now: NOW });
    // Same distance, flag dark ⇒ delay 0 ⇒ believed on the burning tick itself.
    expect(makeBelievedRazings({
      worldState: dark.worldState, snapshot: dark.snapshot, wizardNews: feed, tick: BURN_TICK,
    }).believedFor(MERETH, KARROW)).toHaveLength(1);
  });
});

describe('⚠️⚠️ THE RECORDED LIMIT — the world forgets the smaller fires', () => {
  /** A razing news entry at `severity`, through the REAL curator. */
  const razingEntry = (severity) => newsEntryForOutcome({
    id: razingOutcomeIdFor({ road: 'initiation', razerId: KARROW, victimId: THORNWALL, tick: BURN_TICK }),
    candidateType: 'razing', type: 'condition', severity,
    headline: 'a town burns', summary: '', affectedSettlementIds: [THORNWALL],
  }, BURN_TICK);

  test('the cap (240) is TIGHTER than the decay band (260) — the arithmetic of the limit', () => {
    // Not a style assertion: this inequality IS the limit. If the cap ever exceeds
    // the band, this test should be deleted along with the behaviour below.
    const capped = ensureWizardNewsFeed({ currentTick: 0, entries: flood(500) }, { now: NOW });
    expect(capped.entries.length).toBe(240);
    expect(REASON_TUNING.ATROCITY_DECAY_TICKS).toBe(260);
    expect(capped.entries.length).toBeLessThan(REASON_TUNING.ATROCITY_DECAY_TICKS);
  });

  test('a LESSER razing scrolls out and is forgotten while its outrage was still live', () => {
    const { worldState, snapshot, regionalGraph } = arcWorld();
    const lesser = razingEntry(0.5);
    expect(lesser.significance).toBe('notable');

    const feed = ensureWizardNewsFeed({
      currentTick: BURN_TICK, entries: [lesser, ...flood(260)],
    }, { now: NOW });
    // The burning is GONE from the surface the courts read...
    expect(feed.entries.some((e) => e.sourceEventId === lesser.sourceEventId)).toBe(false);
    // ...at a tick well inside the decay band, where the outrage should still burn.
    const stillLive = BURN_TICK + 100;
    expect(stillLive - BURN_TICK).toBeLessThan(REASON_TUNING.ATROCITY_DECAY_TICKS);
    expect(atrocityRowFor({
      worldState, snapshot, regionalGraph, wizardNews: feed, tick: stillLive,
      observer: MERETH, accused: KARROW,
    })).toBeNull();
  });

  test('a MAJOR razing survives the same flood — capEntries rescues one head per major arc', () => {
    const { worldState, snapshot, regionalGraph } = arcWorld();
    const major = razingEntry(0.8);
    expect(major.significance).toBe(WIZARD_NEWS_SIGNIFICANCE.MAJOR);

    const feed = ensureWizardNewsFeed({
      currentTick: BURN_TICK, entries: [major, ...flood(260)],
    }, { now: NOW });
    expect(feed.entries.some((e) => e.sourceEventId === major.sourceEventId)).toBe(true);
    expect(atrocityRowFor({
      worldState, snapshot, regionalGraph, wizardNews: feed, tick: BURN_TICK + 100,
      observer: MERETH, accused: KARROW,
    })?.score).toBeGreaterThan(0);
  });
});

describe('dormancy — every world that has not burned a town is untouched', () => {
  test('no feed, an empty feed, and a feed with no razing all hand back the same frozen empty', () => {
    const { worldState, snapshot } = arcWorld();
    const build = (wizardNews) => makeBelievedRazings({ worldState, snapshot, wizardNews, tick: BURN_TICK });
    const none = build(null).believedFor(MERETH, KARROW);
    expect(none).toEqual([]);
    // The SAME frozen object, not merely an equal one — the byte-neutrality anchor.
    expect(build({ entries: [] }).believedFor(MERETH, KARROW)).toBe(none);
    expect(build({ entries: flood(3) }).believedFor(MERETH, KARROW)).toBe(none);
  });

  test('the war-reason mover mints no atrocity record in a world with no razing news', () => {
    const { worldState, snapshot, regionalGraph } = arcWorld();
    const advanced = advanceWarReasons({
      snapshot, worldState, graph: regionalGraph, tick: BURN_TICK, wizardNews: { entries: [] },
    });
    const ledger = getSpatialLedger(advanced.worldState, 'warReasons') || {};
    for (const entry of Object.values(ledger)) {
      expect(Object.keys(entry.reasons || {})).not.toContain('atrocity_answer');
    }
  });
});
