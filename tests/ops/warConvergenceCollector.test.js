/**
 * warConvergenceCollector.test.js — WR-9d's pins.
 *
 * THE LOAD-BEARING ONE IS N3, THE COLLECTOR-TOTALITY OBLIGATION. Every counted war
 * lands in EXACTLY ONE duration cell and every closed war in exactly one ending
 * cell or one unclassified reason. A collector that silently skipped a war it could
 * not read would restore the blindness WR-9r cured by another road, so the identity
 * is asserted on a corpus that deliberately contains unreadable wars — a fixture of
 * only clean opens and closes could not tell a total collector from a skipping one.
 *
 * The mutant that proves it: make the fold drop a war whose duration it cannot read
 * (guard the histogram loop on `sinceTick != null && closeTick != null`). The N3
 * pins red.
 *
 * THE FIXTURES DRIVE THE REAL ID MINTERS. Every war event below is spelled the way
 * warDeployment.js spells it, through the real `stablePart`, so a change to the
 * engine's id shape reds these pins instead of silently unhooking the census.
 */

import { describe, it, expect } from 'vitest';
import {
  CHANNEL_COVERAGE,
  TERMINAL_OUTCOME_CANDIDATE_TYPES,
  TICKS_PER_YEAR,
  WAR_CONVERGENCE_SAMPLING,
  WAR_LIFECYCLE_FAMILIES,
  buildWarConvergenceObservation,
  observeWarConvergenceYear,
} from '../../scripts/audit/war-convergence-collector.mjs';
import {
  WAR_CONVERGENCE_OBSERVATION_VERSION,
  WAR_DURATION_BANDS,
  WAR_ENDING_UNCLASSIFIED_KEYS,
  validateWarConvergenceObservation,
} from '../../src/domain/certification/warConvergenceContract.js';
import { WAR_ENDING_UNCLASSIFIED_REASONS } from '../../src/domain/certification/warEndingClassifier.js';
import { RAZING_ROADS, razingOutcomeIdFor } from '../../src/domain/worldPulse/razing.js';
import { stablePart } from '../../src/domain/worldPulse/stablePart.js';

const IDS = ['soak-a', 'soak-b', 'soak-c'];
const saves = (ids = IDS, died = []) => ids.map((id) => ({
  id, settlement: died.includes(id) ? { died: true } : {},
}));

/** A war-open outcome, spelled exactly as warDeployment.js:1204 mints it. */
const openOutcome = (a, b, tick) => ({
  id: `world_outcome.${WAR_LIFECYCLE_FAMILIES.open.idFamily}.${stablePart(a)}.${stablePart(b)}.${tick}`,
  ruleId: WAR_LIFECYCLE_FAMILIES.open.ruleId,
  candidateType: 'strategy_deploy',
  targetSaveId: a,
});
/** A war-close outcome, spelled exactly as warDeployment.js:645 mints it. */
const closeOutcome = (a, b, tick) => ({
  id: `world_outcome.${WAR_LIFECYCLE_FAMILIES.close.idFamily}.${stablePart(a)}.${stablePart(b)}.${tick}`,
  ruleId: WAR_LIFECYCLE_FAMILIES.close.ruleId,
  candidateType: 'war_exhaustion',
  targetSaveId: a,
});

/** Observe one year built from a list of outcomes, through the REAL observer. */
const observe = (n, outcomes, { deployments = {}, ids = IDS, died = [], ...rest } = {}) => (
  observeWarConvergenceYear({
    year: n,
    tick: n * TICKS_PER_YEAR,
    result: {
      worldState: { tick: n * TICKS_PER_YEAR, deployments, ...(rest.worldState || {}) },
      selected: outcomes,
      pulseRecord: rest.pulseRecord || {},
    },
    saves: saves(ids, died),
  })
);

const sum = (counts) => Object.values(counts).reduce((total, count) => total + count, 0);

describe('WR-9d — the war convergence collector', () => {
  it('N3 — every counted war lands in exactly one duration cell, unreadable wars included', () => {
    // FOUR wars, deliberately one of each kind the census can produce:
    //   a->b  opens t4, closes t56          → measured
    //   a->c  closes t20 with NO open        → counted, duration unmeasured
    //   b->c  opens t8, never closes, no army at the horizon → counted, unmeasured
    //   c->a  opens t9 and still holds the field at the horizon → alive, unresolved
    const collected = buildWarConvergenceObservation({
      yearly: [
        observe(1, [openOutcome('soak-a', 'soak-b', 4), openOutcome('soak-b', 'soak-c', 8),
          openOutcome('soak-c', 'soak-a', 9), closeOutcome('soak-a', 'soak-c', 20)]),
        observe(2, [closeOutcome('soak-a', 'soak-b', 56)], {
          deployments: { 'soak-c': { targetId: 'soak-a', sinceTick: 9 } },
        }),
      ],
    });
    const { observation, census } = collected;
    expect(census.countedWars).toBe(4);
    expect(census.closedWars).toBe(3);
    expect(census.aliveAtHorizonWars).toBe(1);
    // THE IDENTITY. Both spellings are asserted: the boolean the soak reads, and the
    // arithmetic itself, so a builder that hard-coded the boolean still reds.
    expect(census.durationTotalityHolds).toBe(true);
    expect(sum(observation.warDurationHistogram)).toBe(census.countedWars);
    expect(census.histogramSum).toBe(4);
    // …and the population really did contain unreadable wars, so the pin is not
    // vacuously true on an all-measurable corpus.
    expect(observation.warDurationHistogram.unmeasured).toBe(2);
    expect(observation.warDurationHistogram.unresolved).toBe(1);
    expect(observation.warDurationHistogram.short).toBe(1);
    expect(census.unmeasuredFromUnobservedRoad).toBe(2);
  });

  it('N3 — every closed war lands in exactly one ending or one unclassified reason', () => {
    const { observation, census } = buildWarConvergenceObservation({
      yearly: [
        observe(1, [openOutcome('soak-a', 'soak-b', 4), openOutcome('soak-a', 'soak-c', 6)]),
        observe(2, [closeOutcome('soak-a', 'soak-b', 56), closeOutcome('soak-a', 'soak-c', 58)],
          { died: ['soak-b'] }),
      ],
    });
    // soak-b was beaten into the ground (annihilation); soak-c's close read nothing.
    expect(observation.endingsMix.annihilation).toBe(1);
    expect(observation.endingsUnclassified.no_terminal_evidence).toBe(1);
    expect(census.endingsTotalityHolds).toBe(true);
    expect(sum(observation.endingsMix) + sum(observation.endingsUnclassified))
      .toBe(census.closedWars);
    expect(census.closedWars).toBe(2);
  });

  it('counts a war that opens AND closes inside one year — the ledger census could not', () => {
    // THE MEASUREMENT THAT DROVE THE DESIGN. On the soak's own fixture the year-end
    // deployment ledger is empty in every year while fifteen deployments happen,
    // because these wars live 2-14 ticks. A year-boundary census reports an empty
    // world; this one reports three short wars.
    const { observation, census } = buildWarConvergenceObservation({
      yearly: [observe(1, [
        openOutcome('soak-c', 'soak-b', 7), closeOutcome('soak-c', 'soak-b', 9),
        openOutcome('soak-b', 'soak-c', 10), closeOutcome('soak-b', 'soak-c', 13),
        openOutcome('soak-c', 'soak-b', 21), closeOutcome('soak-c', 'soak-b', 24),
      ])],
    });
    expect(census.countedWars).toBe(3);
    expect(census.closedWars).toBe(3);
    expect(observation.warDurationHistogram.short).toBe(3);
    expect(observation.warDurationHistogram.unmeasured).toBe(0);
    expect(census.durationTotalityHolds).toBe(true);
  });

  it('pairs a re-opened war with its OWN open, never fusing two wars into one long one', () => {
    // soak-c fights soak-b twice. Pairing the second close with the FIRST open would
    // report one 17-tick war instead of two short ones and would leave an orphan.
    const { census, observation } = buildWarConvergenceObservation({
      yearly: [observe(1, [
        openOutcome('soak-c', 'soak-b', 7), closeOutcome('soak-c', 'soak-b', 9),
        openOutcome('soak-c', 'soak-b', 21), closeOutcome('soak-c', 'soak-b', 24),
      ])],
    });
    expect(census.countedWars).toBe(2);
    expect(observation.warDurationHistogram.short).toBe(2);
    expect(observation.warDurationHistogram.unmeasured).toBe(0);
  });

  it('a war still holding the field in the last observed year is unresolved, keyed to THAT horizon', () => {
    // CR-WR9-C's per-case horizon, discharged at collection time: the SAME war is
    // unresolved for a case that stopped at year 2 and closed for one that ran on.
    const held = { deployments: { 'soak-a': { targetId: 'soak-b', sinceTick: 4 } } };
    const short = buildWarConvergenceObservation({
      yearly: [observe(1, [openOutcome('soak-a', 'soak-b', 4)], held), observe(2, [], held)],
    });
    expect(short.observation.warDurationHistogram.unresolved).toBe(1);
    expect(short.census.aliveAtHorizonWars).toBe(1);
    expect(short.census.closedWars).toBe(0);

    const longer = buildWarConvergenceObservation({
      yearly: [observe(1, [openOutcome('soak-a', 'soak-b', 4)], held), observe(2, [], held),
        observe(3, [closeOutcome('soak-a', 'soak-b', 160)])],
    });
    expect(longer.observation.warDurationHistogram.unresolved).toBe(0);
    // 160 - 4 = 156 ticks = exactly 3.0 years, and `short` is strictly < 3, so this
    // lands in `long`. The boundary is the bander's, read from it, not restated.
    expect(longer.observation.warDurationHistogram.long).toBe(1);
    expect(longer.census.aliveAtHorizonWars).toBe(0);
  });

  it('recovers the belligerents by RECONSTRUCTION, so a dotted id cannot be mis-split', () => {
    const ids = ['keep.of.a', 'hold.of.b'];
    const { census, observation } = buildWarConvergenceObservation({
      yearly: [observe(1, [
        openOutcome('keep.of.a', 'hold.of.b', 4), closeOutcome('keep.of.a', 'hold.of.b', 30),
      ], { ids })],
    });
    // Splitting these ids on '.' would invent belligerents that do not exist; the
    // prefix mint matches them whole.
    expect(census.countedWars).toBe(1);
    expect(observation.warDurationHistogram.short).toBe(1);
    expect(observation.warDurationHistogram.unmeasured).toBe(0);
  });

  it('an id that matches no known pair is not counted as a war at all', () => {
    const { census } = buildWarConvergenceObservation({
      yearly: [observe(1, [
        { ...openOutcome('soak-a', 'soak-b', 4), id: 'world_outcome.strategy_deploy.ghost.phantom.4' },
        // …and a well-formed prefix with a non-numeric tail is refused too.
        { ...closeOutcome('soak-a', 'soak-b', 9), id: 'world_outcome.siege_abandoned.soak_a.soak_b.later' },
      ])],
    });
    expect(census.countedWars).toBe(0);
    expect(census.durationTotalityHolds).toBe(true);
  });

  it('an AMBIGUOUS stable-part pairing is an unmeasured reading, never a guessed one', () => {
    // `stablePart` lowercases and collapses punctuation, so these two distinct
    // settlements mint the SAME prefix. The war is still counted — dropping it is
    // the blindness N3 forbids — but its duration is refused rather than attributed.
    const ids = ['Vale-Keep', 'vale_keep', 'soak-b'];
    const { census, observation } = buildWarConvergenceObservation({
      yearly: [observe(1, [
        openOutcome('Vale-Keep', 'soak-b', 4), closeOutcome('Vale-Keep', 'soak-b', 30),
      ], { ids })],
    });
    expect(census.countedWars).toBe(1);
    expect(census.unmeasuredFromAmbiguousPair).toBe(1);
    expect(observation.warDurationHistogram.unmeasured).toBe(1);
    expect(observation.warDurationHistogram.short).toBe(0);
    expect(census.durationTotalityHolds).toBe(true);
  });

  it('classifies a razing close by RECONSTRUCTING the road, never by splitting the id', () => {
    const razerId = 'soak-a';
    const victimId = 'soak-b';
    const outcomeId = razingOutcomeIdFor({ road: RAZING_ROADS[0], razerId, victimId, tick: 30 });
    const { observation, census } = buildWarConvergenceObservation({
      yearly: [observe(1, [
        openOutcome(razerId, victimId, 4),
        { id: outcomeId, candidateType: 'razing', targetSaveId: victimId, generatedAtTick: 30 },
        closeOutcome(razerId, victimId, 34),
      ])],
    });
    expect(sum(observation.endingsMix)).toBe(1);
    expect(census.unclassifiedEndings).toBe(0);
  });

  it('a razing whose road does not reconstruct is a DISTINCT diagnosis, not a guess', () => {
    const { observation, census } = buildWarConvergenceObservation({
      yearly: [observe(1, [
        openOutcome('soak-a', 'soak-b', 4),
        { id: 'world_outcome.razing.forged.0', candidateType: 'razing', targetSaveId: 'soak-b', generatedAtTick: 30 },
        closeOutcome('soak-a', 'soak-b', 34),
      ])],
    });
    expect(observation.endingsUnclassified.razing_road_unreconstructable).toBe(1);
    expect(observation.endingsUnclassified.no_terminal_evidence).toBe(0);
    expect(sum(observation.endingsMix)).toBe(0);
    expect(census.endingsTotalityHolds).toBe(true);
  });

  it('the observation it builds passes the contract totality wall at the current version', () => {
    const { observation } = buildWarConvergenceObservation({
      yearly: [observe(1, [openOutcome('soak-a', 'soak-b', 4), closeOutcome('soak-a', 'soak-b', 30)])],
    });
    const result = validateWarConvergenceObservation(observation);
    expect(result.errors).toEqual([]);
    expect(result.ok).toBe(true);
    expect(observation.schemaVersion).toBe(WAR_CONVERGENCE_OBSERVATION_VERSION);
    expect(Object.keys(observation.warDurationHistogram).sort())
      .toEqual([...WAR_DURATION_BANDS].sort());
  });

  it('declares the deciding-term sample rather than quoting an unstated precision', () => {
    const withTerms = (n, terms) => observeWarConvergenceYear({
      year: n,
      tick: n * TICKS_PER_YEAR,
      result: {
        worldState: { tick: n * TICKS_PER_YEAR },
        selected: [],
        pulseRecord: { warTerminationReads: terms.map((decidingTerm) => ({ decidingTerm })) },
      },
      saves: saves(),
    });
    const { observation, census } = buildWarConvergenceObservation({
      yearly: [withTerms(1, ['cause', 'momentum']), withTerms(2, ['cause'])],
    });
    expect(observation.terminationDecidingTermHistogram.cause).toBe(2);
    expect(observation.terminationDecidingTermHistogram.momentum).toBe(1);
    expect(census.decidingTermSamples).toBe(3);
    // The declaration travels IN THE RECEIPT, and the contract refuses a receipt
    // that counted terms while naming no sample.
    expect(observation.decidingTermSampling.decidingTermSample).toBe('1-in-52');
    expect(observation.decidingTermSampling.samples).toBe(3);
    expect(validateWarConvergenceObservation(observation).ok).toBe(true);
    const undeclared = {
      ...observation,
      decidingTermSampling: { decidingTermSample: '', samples: 3 },
    };
    expect(validateWarConvergenceObservation(undeclared).errors.join(' '))
      .toMatch(/must name its sample/);
  });

  it('reads a real result shape — deduping accumulations and excluding the cost beats', () => {
    const observed = observeWarConvergenceYear({
      year: 1,
      tick: 52,
      result: {
        worldState: {
          tick: 52,
          deployments: { 'soak-b': { targetId: 'soak-c', sinceTick: 32, role: 'siege' } },
          treatyLedger: { 'pair:x': {} },
        },
        selected: [
          openOutcome('soak-a', 'soak-b', 7),
          { id: 'o1', candidateType: 'conquest', targetSaveId: 'soak-c', generatedAtTick: 41 },
          // `war_exhaustion` ALSO carries "nurses its war wounds", which is a cost
          // beat and not the end of a war. Its id is not a siege-abandoned id, so it
          // must not be read as a close.
          { id: 'world_outcome.war_exhaustion.soak_a.9', ruleId: 'war_layer_war_exhaustion', candidateType: 'war_exhaustion', targetSaveId: 'soak-a' },
        ],
        autoApplied: [{ id: 'o1', candidateType: 'conquest', targetSaveId: 'soak-c', generatedAtTick: 41 }],
        pulseRecord: { warTerminationReads: [{ decidingTerm: 'cost_to_stop' }] },
      },
      saves: saves(),
    });
    expect(observed.warOpens).toEqual([
      { attackerId: 'soak-a', defenderId: 'soak-b', tick: 7, ambiguous: false },
    ]);
    expect(observed.warCloses).toEqual([]);
    expect(observed.terminalOutcomes).toEqual([
      { id: 'o1', candidateType: 'conquest', targetSaveId: 'soak-c', tick: 41 },
    ]);
    expect(observed.openLedgerWars).toEqual([
      { attackerId: 'soak-b', defenderId: 'soak-c', sinceTick: 32 },
    ]);
    expect(observed.decidingTerms).toEqual(['cost_to_stop']);
    expect(observed.treatyPairKeys).toEqual(['pair:x']);
  });

  it('keeps the unclassified vocabulary identical to the classifier that mints it', () => {
    // The contract declares its own copy so the two modules cannot close a cycle
    // (the dist chunk-cycle TDZ class). The coupling is enforced HERE, against the
    // real module, in WR-9c's J-WR9C-1 idiom.
    expect([...WAR_ENDING_UNCLASSIFIED_KEYS].sort())
      .toEqual([...WAR_ENDING_UNCLASSIFIED_REASONS].sort());
  });

  it('publishes its own resolution and names every unfilled classifier channel', () => {
    expect(WAR_CONVERGENCE_SAMPLING.closeTickResolution).toBe('tick');
    expect(WAR_CONVERGENCE_SAMPLING.censusSource).toMatch(/outcome stream/);
    expect(WAR_CONVERGENCE_SAMPLING.unobservedRoadDurationsAre).toBe('unmeasured');
    for (const channel of ['closed', 'attackerId', 'defenderId', 'terminalOutcomes',
      'loserDied', 'treatyWritten', 'peaceReason', 'coalitionFragmented', 'seatTransitionFamily']) {
      expect(typeof CHANNEL_COVERAGE[channel]).toBe('string');
      expect(CHANNEL_COVERAGE[channel].length).toBeGreaterThan(0);
    }
    for (const unfilled of ['peaceReason', 'coalitionFragmented', 'seatTransitionFamily']) {
      expect(CHANNEL_COVERAGE[unfilled]).toMatch(/^unfilled — /);
    }
    expect([...TERMINAL_OUTCOME_CANDIDATE_TYPES]).toEqual(['conquest', 'razing']);
  });

  it('an empty corpus is honestly empty, and both identities still hold', () => {
    const { observation, census } = buildWarConvergenceObservation({ yearly: [] });
    expect(census.countedWars).toBe(0);
    expect(census.durationTotalityHolds).toBe(true);
    expect(census.endingsTotalityHolds).toBe(true);
    expect(sum(observation.warDurationHistogram)).toBe(0);
    expect(validateWarConvergenceObservation(observation).ok).toBe(true);
  });
});
